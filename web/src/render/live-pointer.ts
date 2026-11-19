// live-pointer - where the pointer is on liveClientView's picture, and the driver's look-ups: spots to click and the HUD's state.
// makePointer(ctx) returns what liveClientView calls.

import type { BuiltAppearance } from "../appearance/appearance.js";
import type { ViewUpdate } from "../worker/client-view.js";
import type { PointerInfo, Prepared, viewStats as ViewStats } from "./client-scene.js";
import type { makeItemPredict } from "./live-items.js";
import { hitTest } from "./hit-test.js";
import { TILE_PX, type LoadedIcon } from "./station-client.js";

/** What liveClientView shares with the pointer. shown, last and screen are getters: liveClientView reassigns them. */
export interface PointerCtx {
	host: HTMLElement;
	readonly shown: Prepared | null;
	readonly last: ViewUpdate | null;
	readonly screen: [number, string, unknown][];
	apps: Map<number, BuiltAppearance>;
	hidden: Map<number, number>;
	items: ReturnType<typeof makeItemPredict>;
	icons: Map<string, LoadedIcon>;
	t0: number;
	viewStats: typeof ViewStats;
}

export function makePointer(ctx: PointerCtx) {
	const { host, apps, hidden, items, icons, t0, viewStats } = ctx;
	const { picked, placed } = items;
	// CSS scales the canvas, so the pointer is mapped back to canvas pixels.
	const canvasBox = () => host.querySelector("canvas");
	function pointAt(clientX: number, clientY: number): PointerInfo | null {
		const c = canvasBox(), p = ctx.shown;
		if (!c || !p) return null;
		const r = c.getBoundingClientRect();
		const px = Math.floor((clientX - r.left) / r.width * p.canvasW), py = Math.floor((clientY - r.top) / r.height * p.canvasH);
		if (px < 0 || py < 0 || px >= p.canvasW || py >= p.canvasH) return null;
		const th = performance.now();
		const hit = hitTest(p, icons, px, py, (th - t0) / 100);
		viewStats.hitMs.push(Math.round((performance.now() - th) * 100) / 100); // the driver prints these
		const g = p.geom;
		// Tile columns/rows as buildPrepared places them: x from minX at -camX, y from the top (maxY) at +camY.
		const tile: [number, number] | null = g ? [g.minX + Math.floor((px + g.camX) / TILE_PX), g.minY + g.viewH - 1 - Math.floor((py - g.camY) / TILE_PX)] : null;
		return { hit, px, py, canvasW: p.canvasW, canvasH: p.canvasH, tile, id: hit?.item.id ?? null };
	}
	/** Client coordinates of a spot for the driver's clicks: "tile:X,Y", "rel:DX,DY" (from the eye tile) or "eye" (that tile's centre), "px:X,Y" (canvas pixel), "hud:TEXT[#N]" (a screen object whose type contains TEXT). */
	function locate(spec: string): { x: number; y: number } | null {
		const c = canvasBox(), p = ctx.shown, g = p?.geom;
		if (!c || !p || !g) return null;
		const r = c.getBoundingClientRect(), k = r.width / p.canvasW;
		const at = (cx: number, cy: number) => ({ x: r.left + (cx + 0.5) * k, y: r.top + (cy + 0.5) * k });
		const [kind, arg = ""] = spec.split(":");
		if (kind === "tile" || kind === "eye" || kind === "rel") {
			const [ex, ey] = [ctx.last?.eyeTile?.x ?? 0, ctx.last?.eyeTile?.y ?? 0], [ax, ay, dpx = 0, dpy = 0] = arg.split(",").map(Number); // optional 3rd/4th = pixel offset (right, up), for wall-mounted things drawn pixel_x away from their tile
			const [tx, ty] = kind === "eye" ? [ex, ey] : kind === "rel" ? [ex + ax, ey + ay] : [ax, ay];
			return at((tx - g.minX) * TILE_PX + 16 - g.camX + dpx, (g.viewH - 1 - (ty - g.minY)) * TILE_PX + 16 + g.camY - dpy);
		}
		if (kind === "hud") {
			const [text, nth = "1"] = arg.split("#"); // hud:hand#2 = the second match
			// Only objects whose centre is on the canvas (a screen_loc can put one outside the view).
			const spot = (id: number) => { const i = p.hudItems.find((h) => h.id === id && (h.mo ?? 1) !== 0); return i && { x: i.iconX0! * (i.hk?.k ?? 1) + (i.hk?.dx ?? 0) + 16 * (i.hk?.k ?? 1), y: i.iconY1! * (i.hk?.k ?? 1) + (i.hk?.dy ?? 0) - 16 * (i.hk?.k ?? 1) }; };
			const on = (q: { x: number; y: number } | undefined | null) => !!q && q.x >= 0 && q.y >= 0 && q.x < p.canvasW && q.y < p.canvasH;
			const e = ctx.screen.filter(([id, type]) => type.includes(text) && on(spot(id)))[Number(nth) - 1];
			let q = e && spot(e[0]);
			if (q && e) { // an icon with a see-through middle (throw, swap hand) isn't hit there: the nearest pixel of it that is
				const t = (performance.now() - t0) / 100, hits = (x: number, y: number) => hitTest(p, icons, Math.round(x), Math.round(y), t)?.item.id === e[0];
				if (!hits(q.x, q.y)) {
					let best: { x: number; y: number } | null = null;
					for (let dy = -16; dy <= 16; dy += 2) for (let dx = -16; dx <= 16; dx += 2) if ((!best || Math.hypot(dx, dy) < Math.hypot(best.x - q.x, best.y - q.y)) && hits(q.x + dx, q.y + dy)) best = { x: q.x + dx, y: q.y + dy };
					if (best) q = best;
				}
			}
			return q ? at(q.x, q.y) : null;
		}
		if (kind === "px") { // a canvas pixel
			const [x, y] = arg.split(",").map(Number);
			return at(x, y);
		}
		return null;
	}
	const hudState = (spec: string): string => {
		if (spec.startsWith("pick:")) { const [dx, dy] = spec.slice(5).split(",").map(Number), p = items.pick?.find((q) => q[1] === dx && q[2] === dy); return p ? String(p[0]) : "none"; } // the id of an item listed in pick at that offset
		if (spec === "held") return ctx.screen.filter((e) => !e[1].startsWith("/obj/screen") && apps.has(e[0]) && !hidden.has(e[0]) && !placed.has(e[0])).map((e) => `${e[0]} ${e[1]}`).concat([...picked.keys()].map((id) => `${id} (predicted)`)).join("; ") || "none"; // what is held (items on the screen list) and the predicted pick-ups
		const [text, nth = "1"] = spec.split("#"), e = ctx.screen.filter(([, type]) => type.includes(text))[Number(nth) - 1], a = e && apps.get(e[0]);
		return a ? `${e[1]} ${a.iconState}${a.overlays.length ? " +" + a.overlays.map((o) => o.iconState).join(",") : ""}${hidden.has(e[0]) ? " (hidden)" : ""}` : "none";
	};
	return { pointAt, locate, hudState };
}
