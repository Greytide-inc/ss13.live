// pixi-chunks - page-draw step 4 for pixi-view.ts, the zoomed-out draw: each chunk-plane (16x16 tiles of one plane) keeps its own sprites and a
// small render texture at screen resolution; a frame re-places only the chunks whose items changed and composites them into the plane's texture.

import * as PIXI from "pixi.js";
import { incPlaceChunk } from "./inc-place.js";
import { icons, viewStats, type DrawItem, type PlaneMaster, type Prepared } from "./client-scene.js";
import { chunkCol, chunkRect, chunkRow, chunkId, type ChunkPlane } from "./chunk-index.js";
import { GRID_BIAS, placeItem, refreshSlots, sameItems, type LayerState } from "./pixi-sprites.js";
import type { PlaneState } from "./pixi-view.js";

/** What createPixiBackend shares with the chunked draw. ehx/ehy are getters: render() sets them each draw. */
export interface ChunkCtx {
	app: PIXI.Application;
	sync: boolean;
	gl: PIXI.WebGLRenderer["gl"];
	readonly ehx: number;
	readonly ehy: number;
	planeState: (plane: number) => PlaneState;
	drawPlane: (st: PlaneState, items: DrawItem[], frameTime: number) => void;
	applyMaster: (st: PlaneState, master: PlaneMaster | undefined) => void;
}

/** page-draw step 4: one chunk-plane drawn at screen resolution into its own small render texture. */
export interface ChunkPx extends LayerState { cp: ChunkPlane; version: number; ds: number; rt: PIXI.RenderTexture | null; out: PIXI.Sprite; j0: number; k0: number; w: number; h: number; items: DrawItem[] | null; ends: number[]; flags: number[]; incRuns: number; iconsN: number }

export function makeChunks(ctx: ChunkCtx) {
	const { app, sync, gl, planeState, drawPlane, applyMaster } = ctx;
	let texMs = 0; // render-texture time of the plane being drawn (GPU included with ?sync=1)
	const incStats = { replaced: 0, moved: 0, kept: 0 };
	// ---- page-draw step 4: chunks. Each chunk-plane (16x16 tiles of one plane) keeps its sprites placed and its own small render texture at screen
	// resolution on the map-fixed pixel grid; a frame only re-places a chunk whose items changed (index version), swaps the textures of animated sprites
	// whose frame moved, re-renders those chunks, and draws the chunk textures into the plane's screen-size texture (so plane masters apply as before).
	const chunksOn = new URLSearchParams(location.search).get("chunks") !== "0"; // ?chunks=0: step 3's whole-plane draw at scale < 1 (A/B)
	const cpx = new Map<ChunkPlane, ChunkPx>();
	const pxPool: ChunkPx[] = [];
	const rtPool = new Map<string, PIXI.RenderTexture[]>();
	let rtLive = 0, rtBytes = 0, rtPooled = 0, rtCreated = 0, rtPeak = 0, rtPeakBytes = 0, zoomPend: { s: number; c0: number; t: number } | null = null, wasChunked = false, chunkScale = 0, hudMemo: { p: Prepared; hud: boolean; by: Map<number, DrawItem[]> } | null = null;
	function takeRt(w: number, h: number): PIXI.RenderTexture {
		const l = rtPool.get(`${w}x${h}`);
		const rt = l?.pop();
		if (rt) { rtPooled--; return rt; }
		rtLive++; rtCreated++; rtBytes += w * h * 4;
		if (rtLive > rtPeak) rtPeak = rtLive;
		if (rtBytes > rtPeakBytes) rtPeakBytes = rtBytes;
		return PIXI.RenderTexture.create({ width: w, height: h, scaleMode: "nearest" });
	}
	function giveRt(rt: PIXI.RenderTexture): void {
		const key = `${rt.width}x${rt.height}`;
		let l = rtPool.get(key);
		if (!l) rtPool.set(key, (l = []));
		if (rtPooled >= 300) { rtLive--; rtBytes -= rt.width * rt.height * 4; rt.destroy(true); return; }
		l.push(rt); rtPooled++;
	}
	function freePx(px: ChunkPx): void {
		cpx.delete(px.cp);
		if (px.rt) { giveRt(px.rt); px.rt = null; }
		px.out.parent?.removeChild(px.out);
		for (let i = 0; i < px.used; i++) px.pool[i].visible = false;
		px.used = 0; px.slotsA!.length = 0; px.slotsB!.length = 0;
		if (pxPool.length < 400) pxPool.push(px); else px.container.destroy({ children: true });
	}
	function freeAllPx(): void {
		for (const px of [...cpx.values()]) freePx(px);
		for (const l of rtPool.values()) for (const rt of l) { rtLive--; rtBytes -= rt.width * rt.height * 4; rt.destroy(true); }
		rtPool.clear(); rtPooled = 0;
	}
	function pxFor(cp: ChunkPlane): ChunkPx | null {
		let px = cpx.get(cp);
		if (px) return px;
		const r = chunkRect(cp.col, cp.row), s = chunkScale;
		const j0 = Math.ceil(r.x0 * s + GRID_BIAS - 0.5), j1 = Math.ceil(r.x1 * s + GRID_BIAS - 0.5), k0 = Math.ceil(r.y0 * s + GRID_BIAS - 0.5), k1 = Math.ceil(r.y1 * s + GRID_BIAS - 0.5);
		if (j1 <= j0 || k1 <= k0) return null; // the chunk covers no screen pixel
		px = pxPool.pop();
		if (!px) px = { container: new PIXI.Container(), pool: [], used: 0, clock: false, slotsA: [], slotsB: [], cp, version: -1, ds: -1, rt: null, out: new PIXI.Sprite(), j0, k0, w: 0, h: 0, items: null, ends: [], flags: [], incRuns: 0, iconsN: 0 };
		px.cp = cp; px.version = -1; px.ds = -1; px.items = null; px.j0 = j0; px.k0 = k0; px.w = j1 - j0; px.h = k1 - k0;
		px.rt = takeRt(px.w, px.h);
		px.out.texture = px.rt;
		px.container.scale.set(s);
		px.container.position.set(GRID_BIAS - j0, GRID_BIAS - k0); // screen px = map px * s + bias - the plane-wide rule (m * s + ox + bias), shifted to the chunk's first pixel
		cpx.set(cp, px);
		return px;
	}
	function hudGroups(p: Prepared, showHud: boolean): Map<number, DrawItem[]> {
		if (hudMemo?.p === p && hudMemo.hud === showHud) return hudMemo.by;
		const by = new Map<number, DrawItem[]>();
		if (showHud) for (const it of p.hudItems) { const l = by.get(it.plane); if (l) l.push(it); else by.set(it.plane, [it]); }
		for (const l of by.values()) l.sort((a, b) => a.layer - b.layer);
		hudMemo = { p, hud: showHud, by };
		return by;
	}
	function renderTo(container: PIXI.Container, rt: PIXI.RenderTexture): void {
		app.renderer.render({ container, target: rt, clear: true, clearColor: [0, 0, 0, 0] });
	}

	/** Draw the view from the kept scene's chunks. ox/oy: the map origin's screen pixel (whole numbers). */
	/** a changed chunk keeps the sprites of items that did not change (moved if their origin did); the animated-slot lists drop the slots of re-placed items and gain the new ones.
	 *  Frames of kept animated items are picked by refreshSlots afterwards, so every flag is 0 here (never "animated: place again"). */
	function placeChunkInc(px: ChunkPx, list: DrawItem[], ft: number): void {
		const k = { items: px.items!, ends: px.ends, flags: px.flags }, stats = incStats;
		px.used = incPlaceChunk(k, list, px.used, px.pool.length, [px.slotsA!, px.slotsB!], {
			placeItem: (it, start) => { px.used = start; placeItem(px, it, it.originX, it.originY, ft); return px.used; },
			shift: (k0, k1, dx, dy) => { for (let i = k0; i < k1; i++) { const sp = px.pool[i]; sp.position.set(sp.position.x + dx, sp.position.y + dy); } },
		}, stats);
		px.ends = k.ends; px.flags = k.flags;
		viewStats.iRep += stats.replaced; viewStats.iMov += stats.moved; viewStats.iKeep += stats.kept; stats.replaced = stats.moved = stats.kept = 0;
		px.items = list; px.incRuns++;
	}

	function drawChunked(p: Prepared, showHud: boolean, ft: number, ox: number, oy: number, w: number, h: number, s: number): number {
		const idx = p.scene!.chunks, ds = Math.floor(ft), force = !!p.forceDraw;
		const tp0 = performance.now();
		// the chunks the canvas shows: map pixel m is sampled by screen pixel j at m = (j + 0.5 - bias) / s
		const c0 = chunkCol((-ox - GRID_BIAS) / s), c1 = chunkCol((w - ox) / s), r0 = chunkRow((-oy - GRID_BIAS) / s), r1 = chunkRow((h - oy) / s);
		for (const px of [...cpx.values()]) if (px.cp.col < c0 - 1 || px.cp.col > c1 + 1 || px.cp.row < r0 - 1 || px.cp.row > r1 + 1) freePx(px); // left the view (one chunk of slack)
		const vis = new Map<number, ChunkPlane[]>();
		let nVis = 0;
		for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) for (const cp of idx.chunks.get(chunkId(c, r)) ?? []) {
			const l = vis.get(cp.plane);
			if (l) l.push(cp); else vis.set(cp.plane, [cp]);
			nVis++;
		}
		const hudBy = hudGroups(p, showHud);
		const planeSet = new Set<number>([...idx.planeItems.keys(), ...hudBy.keys()]);
		if (showHud) for (const pl of p.masters.keys()) planeSet.add(pl);
		const order = [...planeSet].sort((a, b) => a - b);
		viewStats.rSort += performance.now() - tp0;
		app.stage.removeChildren();
		let nPlace = 0, nFrame = 0;
		for (const plane of order) {
			const st = planeState(plane);
			const tp = performance.now();
			texMs = 0;
			const cps = vis.get(plane) ?? [], hudItems = hudBy.get(plane) ?? [];
			let minL = Infinity, maxL = -Infinity;
			if (hudItems.length) for (const cp of cps) { idx.items(cp); if (cp.list!.length) { if (cp.minLayer < minL) minL = cp.minLayer; if (cp.maxLayer > maxL) maxL = cp.maxLayer; } }
			// the plane's screen items go below every map item (layer < the lowest) or above (layer >= the highest: on a tie the map item came first); any in between: whole-plane draw
			const lo: DrawItem[] = [], hi: DrawItem[] = [];
			let interleaved = false;
			for (const it of hudItems) { if (minL === Infinity || it.layer >= maxL) hi.push(it); else if (it.layer < minL) lo.push(it); else interleaved = true; }
			const master = showHud ? p.masters.get(plane) : undefined;
			if (interleaved) { // screen and map items interleave by layer on this plane: today's whole-plane draw
				const items = p.scene!.items().filter((it) => it.plane === plane).concat(hudItems);
				items.sort((a, b) => a.layer - b.layer);
				drawPlane(st, items, ft);
				st.sig = "";
				viewStats.cFall++;
				viewStats.cFallInfo = `plane ${plane}: screen layers ${hudItems[0].layer}..${hudItems[hudItems.length - 1].layer} (${hudItems.length}), map layers ${minL}..${maxL}`;
				applyMaster(st, master);
				continue;
			}
			// the plane's screen items: kept sprites, redone when the items differ
			let hudChanged = false;
			const keepHud = (hl: LayerState, prev: DrawItem[], now: DrawItem[]): boolean => {
				if (force || !sameItems(prev, now)) {
					hl.used = 0; hl.slotsA!.length = 0; hl.slotsB!.length = 0; hl.clock = false;
					for (const it of now) placeItem(hl, it, it.originX + ctx.ehx, it.originY + ctx.ehy, ft);
					for (let i = hl.used; i < hl.pool.length; i++) hl.pool[i].visible = false;
					hl.container.scale.set(s);
					return true;
				}
				return now.length > 0 && refreshSlots(hl, ft, st.ds !== ds);
			};
			if (keepHud(st.hudLo, st.hudLoItems, lo)) hudChanged = true;
			if (keepHud(st.hudHi, st.hudHiItems, hi)) hudChanged = true;
			st.hudLoItems = lo; st.hudHiItems = hi;
			// the chunks
			let rendered = 0;
			const tpl = performance.now();
			for (const cp of cps) {
				const px = pxFor(cp);
				if (!px) continue;
				let draw = false;
				if (force || px.version !== cp.version) {
					const list = idx.items(cp);
					if (px.items && !force && px.iconsN === icons.size && px.incRuns < 120 && px.items.length > 0) { placeChunkInc(px, list, ft); refreshSlots(px, ft, px.ds !== ds); } // only the items that differ from the last draw
					else {
						px.used = 0; px.slotsA!.length = 0; px.slotsB!.length = 0; px.clock = false;
						const ends: number[] = new Array(list.length);
						for (let i = 0; i < list.length; i++) { const it = list[i]; placeItem(px, it, it.originX, it.originY, ft); ends[i] = px.used; }
						px.ends = ends; px.flags = new Array(list.length).fill(0); px.items = list; px.iconsN = icons.size; px.incRuns = 0;
					}
					for (let i = px.used; i < px.pool.length; i++) px.pool[i].visible = false;
					viewStats.sprites += px.used;
					px.version = cp.version; px.ds = ds; draw = true; nPlace++;
				} else {
					const ch = refreshSlots(px, ft, px.ds !== ds);
					px.ds = ds;
					if (ch) { draw = true; nFrame++; }
				}
				if (draw) { const tr = performance.now(); renderTo(px.container, px.rt!); texMs += performance.now() - tr; rendered++; }
			}
			st.ds = ds;
			viewStats.cRender += rendered;
			if (sync && rendered) { const tr = performance.now(); gl.finish(); texMs += performance.now() - tr; } // ?sync=1: the GPU time of this plane's chunk textures counts here, once per plane
			// composite the chunk textures into the plane's texture
			const sig = `${ox},${oy},${idx.shape},${c0},${c1},${r0},${r1},${cps.length}`;
			let why = "same";
			if (rendered || hudChanged || sig !== st.sig || force) {
				st.sig = sig;
				st.chunkLayer.removeChildren();
				for (const cp of cps) { const px = cpx.get(cp); if (px) { px.out.position.set(px.j0 + ox, px.k0 + oy); st.chunkLayer.addChild(px.out); } }
				st.comp.removeChildren();
				st.comp.addChild(st.hudLo.container, st.chunkLayer, st.hudHi.container);
				const tr = performance.now();
				renderTo(st.comp, st.rt);
				texMs += performance.now() - tr;
				viewStats.cComp++;
				why = rendered ? "anim" : "drawn";
			}
			const acc = viewStats.planeAcc[plane] ??= { draws: 0, anim: 0, items: 0, sprites: 0, placeMs: 0, texMs: 0 };
			const all = performance.now() - tp;
			if (why === "same") viewStats.plSame++; else { acc.draws++; viewStats.plDrawn++; acc.items = idx.planeItems.get(plane) ?? 0; acc.sprites = rendered; }
			acc.placeMs += all - texMs; acc.texMs += texMs;
			viewStats.rPlace += all - texMs; viewStats.rTex += texMs;
			void tpl;
			applyMaster(st, master);
		}
		viewStats.cPlace += nPlace; viewStats.cFrame += nFrame; viewStats.cVisible = nVis;
		return nVis;
	}

	/** This draw is chunked (or not) at scale s: on entering / leaving chunks, or a new scale, nothing kept is valid. True when it changed. */
	function setMode(chunked: boolean, s: number): boolean {
		if (chunked === wasChunked && (!chunked || s === chunkScale)) return false;
		wasChunked = chunked; chunkScale = s;
		if (chunked) zoomPend = { s, c0: rtCreated, t: performance.now() };
		freeAllPx();
		return true;
	}
	/** the chunk textures' part of the #perf canvas line ("" when not chunked) */
	function info(): string {
		return wasChunked ? `, chunk textures ${rtLive} live, peak ${rtPeak} / ${(rtPeakBytes / 1048576).toFixed(1)} MB, ${rtCreated} created ever (${cpx.size} in use, ${rtPooled} pooled, ~${(rtBytes / 1048576).toFixed(1)} MB, ${cpx.size ? `${[...cpx.values()][0].w}x${[...cpx.values()][0].h}` : "-"} px each)` : "";
	}
	/** after the first chunked redraw at a new view size: log it with the chunk textures it created */
	function logZoom(): void {
		if (!zoomPend) return;
		const vs = viewStats as unknown as Record<string, string[]>;
		(vs.zoomLog ??= []).push(`scale ${zoomPend.s.toFixed(4)}: first redraw ${(performance.now() - zoomPend.t).toFixed(0)} ms, ${rtCreated - zoomPend.c0} chunk textures created, ${cpx.size} in use`);
		zoomPend = null;
	}
	return { on: chunksOn, draw: drawChunked, setMode, info, logZoom };
}
