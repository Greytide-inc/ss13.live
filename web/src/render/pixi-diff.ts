// pixi-diff - the pixel-diff tool (?renderer=pd). The page shows the new (screen-size) Pixi view; window.pdDiff(hud)
// draws the current view again with it AND with the old path (?pd=0: a view-size canvas), on the same frame (same Prepared, same frame time),
// reads both back and counts the differing pixels. Zoomed out, the old picture is shrunk in JS by the pixel-grid rule of part 1:
// screen pixel i samples map pixel floor((i + 0.5 - ox - bias) / s) - cx (bias: pixi-view.ts GRID_BIAS, the same tie-break the GPU path has).
// The shrink handles map items only, so zoomed out call it with the HUD off (hud = false); at normal zoom the HUD and plane masters are compared too.
// live = true: the new side is the picture the page shows right now (its kept, shifted planes, not drawn again), against a fresh old-path draw of the
// same frame; catches a kept plane that drifted (shifted lighting plane overshooting the camera). Uses the HUD setting of that draw.

import { createPixiBackend } from "./pixi-view.js";
import type { Prepared, ViewBackend } from "./client-scene.js";

export interface PdResult {
	hud: boolean; noTransform: boolean; live: boolean; scale: number; newSize: string; oldSize: string; pixels: number; differing: number; nearEdge: number; chunkEdge: number; chunkEdgeNotTexelEdge: number; over2: number; maxDelta: number; first: string[]; ms: number;
}

export async function createPdBackend(): Promise<ViewBackend> {
	const oldB = await createPixiBackend({ screen: false });
	const newB = await createPixiBackend({ screen: true });
	let last: { p: Prepared; hud: boolean; ft: number } | null = null;
	const render = (p: Prepared, hud: boolean, ft: number): void => { last = { p, hud, ft }; newB.render(p, hud, ft); };
	(globalThis as Record<string, unknown>).pdDiff = (hud: boolean, noTransform = false, live = false): PdResult | string => {
		if (!last) return "no view drawn yet";
		const t0 = performance.now(), { p, ft } = last;
		if (live) { hud = last.hud; noTransform = false; }
		const L = live ? newB.pixels() : null; // read before anything draws again
		// noTransform: leave out map items with a transform (their source texels are picked after scaling/rotating, so a shrunk full-size picture can't match them texel for texel)
		const forced = { ...p, forceDraw: true, ...(noTransform ? { scene: undefined, mapItems: p.mapItems.filter((it) => !it.appearance.transform && !it.appearance.overlays.some((o) => o.transform)) } : {}) };
		oldB.render(forced, hud, ft);
		const A = oldB.pixels();
		if (!L) newB.render(forced, hud, ft);
		const B = L ?? newB.pixels();
		const g = newB.grid()!;
		const first: string[] = [];
		let chunkEdge = 0, chunkEdgeOnly = 0, differing = 0, nearEdge = 0, over2 = 0, maxDelta = 0;
		const edge = (f: number): boolean => { const r = f - Math.floor(f); return Math.min(r, 1 - r) < 0.02; }; // within 0.02 map px of a texel edge: the GPU's float rounding can pick the other texel
		for (let j = 0; j < B.h; j++) {
			const fy = (j + 0.5 - g.oy - g.bias) / g.s, vy = g.s === 1 ? j : Math.floor(fy) - g.cy;
			for (let i = 0; i < B.w; i++) {
				const fx = (i + 0.5 - g.ox - g.bias) / g.s, vx = g.s === 1 ? i : Math.floor(fx) - g.cx;
				const b = (j * B.w + i) * 4, inside = vx >= 0 && vy >= 0 && vx < A.w && vy < A.h, a = (vy * A.w + vx) * 4;
				let d = 0;
				for (let c = 0; c < 4; c++) d = Math.max(d, Math.abs((inside ? A.data[a + c] : 0) - B.data[b + c]));
				if (d) {
					differing++;
					const te = g.s !== 1 && (edge(fx) || edge(fy));
					if (te) nearEdge++;
					if (g.s !== 1) { // chunk boundary (chunk-index.ts: 512 px, rows shifted 480): is this pixel one of the last/first screen pixels either side of a chunk edge?
						const u = i - g.ox, v = j - g.oy, c = Math.round((u + 0.5 - g.bias) / g.s / 512), r = Math.round(((v + 0.5 - g.bias) / g.s + 480) / 512);
						const jb = Math.ceil(c * 512 * g.s + g.bias - 0.5), kb = Math.ceil((r * 512 - 480) * g.s + g.bias - 0.5);
						if (u === jb || u === jb - 1 || v === kb || v === kb - 1) { chunkEdge++; if (!te) chunkEdgeOnly++; }
					}
					if (d > 2) over2++;
					if (d > maxDelta) maxDelta = d;
					if (first.length < 8) first.push(`(${i},${j}) old [${inside ? A.data.slice(a, a + 4).join(",") : "outside"}] new [${B.data.slice(b, b + 4).join(",")}]`);
				}
			}
		}
		if (!L) newB.render({ ...p, forceDraw: true }, last.hud, ft); // put the page's own picture back
		return { hud, noTransform, live, scale: g.s, newSize: `${B.w}x${B.h}`, oldSize: `${A.w}x${A.h}`, pixels: B.w * B.h, differing, nearEdge, chunkEdge, chunkEdgeNotTexelEdge: chunkEdgeOnly, over2, maxDelta, first, ms: Math.round(performance.now() - t0) };
	};
	return { canvas: newB.canvas, render, stale: newB.stale };
}
