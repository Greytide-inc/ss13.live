// pixi-view - PixiJS backend for the live client view. Same picture as client-scene.ts's canvas 2D
// path, but drawn on the GPU: each plane is drawn into its own RenderTexture (only when the view changed or the
// plane holds animated items, as the canvas path does), then the plane textures are composited on the stage in plane order with
// each plane master's alpha / blend mode / color. Sprites, frame textures, lighting-matrix textures and maptext
// textures are all cached; a redraw only re-points pooled sprites.
//
// Differences from the canvas path (known): transformed sprites are sampled nearest, not bilinear; a plane master
// color matrix goes through Pixi's ColorMatrixFilter; BLEND_SUBTRACT uses Pixi's "subtract" (canvas: "difference").
// ?sync=1 makes each redraw wait for the GPU (gl.finish) so the #perf ms are the real frame cost.

import * as PIXI from "pixi.js";
import { TILE_PX } from "./station-client.js";
import { ANIM, CLOCK, incPlace, sameFit } from "./inc-place.js";
import { icons, sortPrepared, viewStats, type DrawItem, type PlaneMaster, type Prepared, type SortedPrepared, type ViewBackend } from "./client-scene.js";
import { BLEND, GRID_BIAS, placeItem, sameItems, type LayerState } from "./pixi-sprites.js";
import { makeChunks } from "./pixi-chunks.js";
import { makeShadow } from "./pixi-shadow.js";

export { GRID_BIAS } from "./pixi-sprites.js";

export interface PlaneState extends LayerState {
	rt: PIXI.RenderTexture; out: PIXI.Sprite; p: Prepared | null; items: DrawItem[]; hud: boolean; filterKey: string; ends: number[] | null; flags: number[]; iconsN: number; incRuns: number; ds: number; emx: number; emy: number;
	/** chunked draw: comp = [screen items below?, chunk sprites, screen items above?] rendered into rt; hudLayer holds the plane's screen items */
	comp: PIXI.Container; chunkLayer: PIXI.Container; hudLo: LayerState; hudHi: LayerState; hudLoItems: DrawItem[]; hudHiItems: DrawItem[]; sig: string;
}

/** what the last draw used, for the pixel diff (?renderer=pd) and the probes. */
export interface PixiGrid { s: number; w: number; h: number; viewW: number; viewH: number; ox: number; oy: number; cx: number; cy: number; bias: number; dpr: number; css: string }
export interface PixiBackend extends ViewBackend { grid: () => PixiGrid | null; pixels: () => { w: number; h: number; data: Uint8ClampedArray } }

export async function createPixiBackend(opts: { screen?: boolean } = {}): Promise<PixiBackend> {
	const screen = opts.screen !== false; // false: ?pd=0, today's view-size canvas (the pixel-diff reference)
	const app = new PIXI.Application();
	await app.init({ width: 480, height: 480, backgroundAlpha: 0, antialias: false, resolution: 1, autoStart: false, preference: "webgl" });
	app.ticker.stop();
	app.canvas.className = "client-canvas";
	const sync = new URLSearchParams(location.search).has("sync");
	const gl = (app.renderer as PIXI.WebGLRenderer).gl;
	const planes = new Map<number, PlaneState>();
	let sizeW = 480, sizeH = 480, sizeKey = "480x480";
	let scale = 1, emx = 0, emy = 0, ehx = 0, ehy = 0; // this draw's scale and the shifts (view px) that put map items / screen objects on their pixel grids
	let useScene = false; // this draw's map items come from p.scene (map pixels), not p.mapItems (view pixels)
	let grid: PixiGrid | null = null, paneDirty = false, lastDpr = devicePixelRatio;
	const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => { paneDirty = true; }) : null;
	ro?.observe(app.canvas);
	addEventListener("resize", () => { paneDirty = true; });
	let sorted: ({ p: Prepared; hud: boolean; scene: boolean } & SortedPrepared) | null = null;

	function planeState(plane: number): PlaneState {
		let st = planes.get(plane);
		if (!st) {
			const rt = PIXI.RenderTexture.create({ width: sizeW, height: sizeH, scaleMode: "nearest" });
			const mkLayer = (): LayerState => ({ container: new PIXI.Container(), pool: [], used: 0, clock: false, slotsA: [], slotsB: [] }), chunkLayer = new PIXI.Container(), comp = new PIXI.Container();
			planes.set(plane, (st = { container: new PIXI.Container(), pool: [], used: 0, rt, out: new PIXI.Sprite(rt), p: null, items: [], hud: true, filterKey: "", clock: false, ends: null, flags: [], iconsN: 0, incRuns: 0, ds: 0, emx: 0, emy: 0, comp, chunkLayer, hudLo: mkLayer(), hudHi: mkLayer(), hudLoItems: [], hudHiItems: [], sig: "" }));
		}
		return st;
	}


	/** a plane whose items are the same appearances in the same order, each only moved: move the sprites placed for them instead of placing everything again
	 *  (every glide frame shifts the whole map by the camera offset). Not for planes with animated items (their frame depends on frameTime). */
	function canShift(prev: DrawItem[], next: DrawItem[]): boolean {
		if (prev.length !== next.length) return false;
		for (let i = 0; i < next.length; i++) if (prev[i].appearance !== next[i].appearance || !sameFit(prev[i].hk, next[i].hk)) return false;
		return true;
	}

	function shiftPlane(st: PlaneState, prev: DrawItem[], next: DrawItem[]): void {
		const ends = st.ends!, dmx = emx - st.emx, dmy = emy - st.emy; // the map grid shift may have moved too (screen objects' never does)
		let s0 = 0;
		for (let i = 0; i < next.length; i++) {
			const e = ends[i], hud = next[i].hud, hk = next[i].hk?.k ?? 1, dx = (next[i].originX - prev[i].originX) * hk + (hud ? 0 : dmx), dy = (next[i].originY - prev[i].originY) * hk + (hud ? 0 : dmy);
			if (dx || dy) for (let k = s0; k < e; k++) { const sp = st.pool[k]; sp.position.set(sp.position.x + dx, sp.position.y + dy); }
			s0 = e;
		}
		st.emx = emx; st.emy = emy; // the sprites now sit on this grid: the next shift (or the "same" check) counts from here, not from the last full draw
	}

	function renderPlane(st: PlaneState): void {
		const t = performance.now();
		app.renderer.render({ container: st.container, target: st.rt, clear: true, clearColor: [0, 0, 0, 0] });
		if (sync) gl.finish();
		texMs += performance.now() - t;
	}
	let texMs = 0; // render-texture time of the plane being drawn (GPU included with ?sync=1)


	/** Places one item's sprites from slot `start`; returns where they end and the ANIM/CLOCK flags (the plane's own `clock` keeps the OR over its items). */
	function placeOne(st: PlaneState, it: DrawItem, start: number, frameTime: number): { end: number; flags: number } {
		st.used = start;
		const planeClock = st.clock;
		st.clock = false; st.anim = false;
		placeItem(st, it, it.originX + (it.hud ? ehx : emx), it.originY + (it.hud ? ehy : emy), frameTime);
		const flags = (st.anim ? ANIM : 0) | (st.clock ? CLOCK : 0);
		st.clock = planeClock || st.clock;
		return { end: st.used, flags };
	}

	function hideRest(st: PlaneState): void {
		for (let i = st.used; i < st.pool.length; i++) { const sp = st.pool[i]; if (sp.visible) sp.visible = false; else break; } // slots past the last used one were already hidden
	}

	function drawPlane(st: PlaneState, items: DrawItem[], frameTime: number): void {
		st.used = 0;
		st.clock = false;
		st.emx = emx; st.emy = emy;
		const ends: number[] = (st.ends = new Array(items.length)), fl: number[] = (st.flags = new Array(items.length));
		let n = 0;
		for (const it of items) {
			const r = placeOne(st, it, st.used, frameTime);
			ends[n] = r.end; fl[n++] = r.flags;
		}
		st.iconsN = icons.size; st.incRuns = 0;
		hideRest(st);
		viewStats.sprites += st.used;
		renderPlane(st);
	}

	/** the same picture as drawPlane, placing only the items whose appearance changed or whose frame may have (see inc-place.ts). */
	function drawPlaneInc(st: PlaneState, prev: DrawItem[], items: DrawItem[], frameTime: number): void {
		const dsMoved = st.ds !== Math.floor(frameTime);
		const k = { items: prev, ends: st.ends!, flags: st.flags }, dmx = emx - st.emx, dmy = emy - st.emy;
		st.emx = emx; st.emy = emy;
		const stats = incStats;
		st.used = incPlace(k, items, {
			dsMoved, dmx, dmy,
			place: (it, start) => placeOne(st, it, start, frameTime),
			shift: (k0, k1, dx, dy) => { for (let i = k0; i < k1; i++) { const sp = st.pool[i]; sp.position.set(sp.position.x + dx, sp.position.y + dy); } },
		}, stats);
		viewStats.iRep += stats.replaced; viewStats.iMov += stats.moved; viewStats.iKeep += stats.kept; stats.replaced = stats.moved = stats.kept = 0;
		st.ends = k.ends; st.flags = k.flags;
		st.ds = Math.floor(frameTime); st.incRuns++;
		hideRest(st);
		viewStats.sprites += st.used;
		renderPlane(st);
	}
	const incStats = { replaced: 0, moved: 0, kept: 0 };

	/** The plane master's own compositing: alpha, blend mode, and color (a matrix as a filter, a plain tint as a tint); then the plane goes on the stage. */
	function applyMaster(st: PlaneState, master: PlaneMaster | undefined): void {
		const out = st.out;
		out.alpha = (master?.alpha ?? 255) / 255;
		out.blendMode = BLEND[master?.blendMode ?? 0] ?? "normal";
		out.tint = 0xffffff;
		const c = master?.color;
		const key = Array.isArray(c) ? c.join(",") : "";
		if (key !== st.filterKey) {
			st.filterKey = key;
			if (!Array.isArray(c)) out.filters = null;
			else {
				// BYOND: m[row*4+col], rows = input R,G,B,A,const. Pixi: 4 rows of [R,G,B,A,const] per output channel.
				const f = new PIXI.ColorMatrixFilter();
				f.matrix = [0, 1, 2, 3].flatMap((o) => [c[o], c[4 + o], c[8 + o], c[12 + o], c[16 + o]]) as PIXI.ColorMatrix;
				out.filters = [f];
			}
		}
		if (typeof c === "string") { try { out.tint = new PIXI.Color(c).toNumber(); } catch { /* not a color Pixi knows */ } }
		app.stage.addChild(out);
	}


	const chunks = makeChunks({ app, sync, gl, get ehx() { return ehx; }, get ehy() { return ehy; }, planeState, drawPlane, applyMaster });
	const placeShadow = makeShadow(app, planes);

	function render(p: Prepared, showHud: boolean, frameTime: number): void {
		// draw at the pane's pixel size when the view is bigger (the canvas's CSS box x devicePixelRatio), else at view size (scale 1).
		const dpr = devicePixelRatio;
		paneDirty = false; lastDpr = dpr;
		const paneW = screen ? Math.round(app.canvas.clientWidth * dpr) : 0;
		const zoomedIn = (p.hudItems.find((it) => it.hk)?.hk?.k ?? 1) < 1; // a zoomed-in view draws its (smaller than a tile) screen objects at pane size too, not stretched up from view size
		const s = paneW > 0 && (paneW < p.canvasW || (zoomedIn && paneW > p.canvasW)) ? paneW / p.canvasW : 1;
		const w = s === 1 ? p.canvasW : paneW, h = s === 1 ? p.canvasH : Math.max(1, Math.round(p.canvasH * s));
		scale = s;
		let ox = 0, oy = 0, cx = 0, cy = 0;
		// scene items are in map pixels, so the camera is this draw's shift: view px = map px - (cx, cy).
		const g = p.geom;
		if (g) { cx = g.minX * TILE_PX + g.camX; cy = -((g.viewH - 1 + g.minY) * TILE_PX + g.camY); } // the map's own origin, not the view's
		useScene = screen && !!p.scene && s <= 1; // normal zoom draws the kept scene too (stable item objects: unchanged items and sorts are skipped). A pane bigger than the view (s > 1) stays on the view-pixel path
		if (s === 1) { emx = emy = ehx = ehy = 0; if (useScene) { emx = -cx; emy = -cy; } }
		else {
			ox = Math.round(-cx * s); oy = Math.round(-cy * s); // the map's origin lands on a whole screen pixel
			ehx = ehy = GRID_BIAS / s;
			emx = ox / s + GRID_BIAS / s; emy = oy / s + GRID_BIAS / s;
			if (!useScene) { emx += cx; emy += cy; }
		}
		grid = { s, w, h, viewW: p.canvasW, viewH: p.canvasH, ox, oy, cx, cy, bias: GRID_BIAS, dpr, css: `${app.canvas.clientWidth}x${app.canvas.clientHeight}` };
		const key = `${w}x${h}`;
		if (key !== sizeKey) { // a widescreen view is wider than tall; or a new pane size
			sizeKey = key;
			sizeW = w; sizeH = h;
			app.renderer.resize(sizeW, sizeH);
			// a new render texture per plane (rt.resize left each plane's sprite on its old frame size, so a 608 -> 480 change drew the planes stretched).
			for (const st of planes.values()) { const old = st.rt; st.rt = PIXI.RenderTexture.create({ width: sizeW, height: sizeH, scaleMode: "nearest" }); st.out.texture = st.rt; old.destroy(true); st.p = null; st.sig = ""; }
		}
		for (const st of planes.values()) st.container.scale.set(s);
		const chunked = useScene && s < 1 && chunks.on;
		if (chunks.setMode(chunked, s)) {
			for (const st of planes.values()) { st.p = null; st.sig = ""; st.hudLoItems = []; st.hudHiItems = []; }
		}
		const t0 = performance.now();
		if (chunked) chunks.draw(p, showHud, frameTime, ox, oy, w, h, s);
		else {
		if (sorted?.p !== p || sorted.hud !== showHud || sorted.scene !== useScene) sorted = { p, hud: showHud, scene: useScene, ...sortPrepared(p, showHud, useScene) };
		const { byPlane, planes: order, animated } = sorted;
		viewStats.rSort += performance.now() - t0;
		app.stage.removeChildren();
		for (const plane of order) {
			const st = planeState(plane);
			const tp = performance.now();
			texMs = 0;
			let why = "";
			const master = showHud ? p.masters.get(plane) : undefined;
			if (st.p !== p || st.hud !== showHud || animated.has(plane)) {
				const items = byPlane.get(plane) ?? [];
				// a glide frame is a new Prepared every frame, but the HUD planes are the same as the last one: skip drawing those.
				const same = !p.forceDraw && st.p !== null && st.hud === showHud && !animated.has(plane) && st.emx === emx && st.emy === emy && sameItems(st.items, items);
				const shift = !same && !p.forceDraw && st.p !== null && st.hud === showHud && (!animated.has(plane) || (!st.clock && st.ds === Math.floor(frameTime))) && st.ends !== null && canShift(st.items, items);
				const prevItems = st.items, prevP = st.p, prevHud = st.hud;
				st.p = p;
				st.hud = showHud;
				st.items = items;
				const inc = !shift && !same && !p.forceDraw && prevP !== null && st.hud === showHud && prevHud === showHud && st.ends !== null && st.iconsN === icons.size && st.incRuns < 120 && prevItems.length > 0;
				if (shift) { shiftPlane(st, prevItems, items); renderPlane(st); why = "shift"; }
				else if (inc) { drawPlaneInc(st, prevItems, items, frameTime); why = prevP === p ? "anim" : "drawn"; }
				else if (!same) {
					st.ds = Math.floor(frameTime); // the decisecond the sprites' frames were picked at (a shift is only right within it)
					drawPlane(st, items, frameTime);
					why = prevP === p ? "anim" : "drawn";
				} else why = "same";
				// per plane, why it was drawn and what it cost
				const acc = viewStats.planeAcc[plane] ??= { draws: 0, anim: 0, items: 0, sprites: 0, placeMs: 0, texMs: 0 };
				const all = performance.now() - tp;
				if (why === "same") viewStats.plSame++;
				else if (why === "shift") viewStats.plShift++;
				else { acc.draws++; if (why === "anim") { acc.anim++; viewStats.plAnim++; } else viewStats.plDrawn++; acc.items = items.length; acc.sprites = st.used; }
				acc.placeMs += all - texMs; acc.texMs += texMs;
				viewStats.rPlace += all - texMs; viewStats.rTex += texMs;
			}
			applyMaster(st, master);
		}
		}
		placeShadow(p, s, ox, oy, cx, cy);
		const tc = performance.now();
		app.renderer.render({ container: app.stage });
		if (sync) gl.finish();
		viewStats.rComp += performance.now() - tc;
		const info = `canvas ${sizeW}x${sizeH} (view ${p.canvasW}x${p.canvasH}, scale ${scale.toFixed(4)}), ${planes.size} plane textures of that size (~${Math.round(planes.size * sizeW * sizeH * 4 / 1048576)} MB)${chunks.info()}, MAX_TEXTURE_SIZE ${maxTex}, devicePixelRatio ${devicePixelRatio}, CSS box ${app.canvas.clientWidth}x${app.canvas.clientHeight}`;
		if (info !== viewStats.pixiInfo) viewStats.pixiInfo = info;
		if (chunked) chunks.logZoom(); // the first redraw at a new view size, with the chunk textures it created
	}
	const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
	(globalThis as Record<string, unknown>).pixiDebug = { app, planes, get sorted() { return sorted; } }; // probes (worker-boot --probe)
	/** Read the canvas back (RGBA, top row first), right after a render. */
	function pixels(): { w: number; h: number; data: Uint8ClampedArray } {
		const r = app.renderer.extract.pixels({ target: app.stage, frame: new PIXI.Rectangle(0, 0, sizeW, sizeH), resolution: 1 }) as unknown as { pixels: Uint8ClampedArray; width: number; height: number };
		return { w: r.width, h: r.height, data: r.pixels };
	}
	return { canvas: app.canvas, render, stale: () => paneDirty || devicePixelRatio !== lastDpr, grid: () => grid, pixels };
}
