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
import { cellRect, dirIndex } from "../dmi/dmi.js";
import { findState } from "./sprite-lookup.js";
import { byondMatrixToCanvas } from "./byond-transform.js";
import { drawMaptext, maptextBoxRect } from "./maptext.js";
import { frameForState, isLighting, matrixTintedRect, TILE_PX, type LoadedIcon } from "./station-client.js";
import { ANIM, CLOCK, incPlace, incPlaceChunk, sameFit } from "./inc-place.js";
import { icons, isAnimated, sortPrepared, viewStats, type DrawItem, type HudFit, type PlaneMaster, type Prepared, type SortedPrepared, type ViewBackend } from "./client-scene.js";
import { blendOf } from "./inherit.js";
import { buildAnimationSteps } from "../dmi/animation.js";
import { chunkCol, chunkRect, chunkRow, CHUNK_PX, chunkId, type ChunkPlane } from "./chunk-index.js";
import type { Appearance } from "../appearance/appearance.js";

// BLEND_OVERLAY(1)/INSET_OVERLAY(5) draw normally. WebGL multiply is dst*src + dst*(1-srcA): empty or src-transparent
// pixels leave the destination as is, which is what BYOND does (the canvas path's "multiply" differs there).
const BLEND: Record<number, PIXI.BLEND_MODES> = { 2: "add", 3: "subtract", 4: "multiply" }; // else "normal"

const sources = new WeakMap<HTMLImageElement, PIXI.TextureSource>();
const frames = new Map<string, PIXI.Texture>(); // "icon|x,y,w,h" -> a cell of the sheet
const canvasTex = new WeakMap<HTMLCanvasElement, PIXI.Texture>();
const maptexts = new Map<string, PIXI.Texture>();

function nearest<T extends PIXI.TextureSource>(s: T): T {
	s.scaleMode = "nearest";
	return s;
}

function cellTexture(icon: string, loaded: LoadedIcon, r: { x: number; y: number; w: number; h: number }): PIXI.Texture {
	const key = `${icon}|${r.x},${r.y},${r.w},${r.h}`;
	let t = frames.get(key);
	if (!t) {
		let src = sources.get(loaded.img);
		if (!src) sources.set(loaded.img, (src = nearest(PIXI.Texture.from(loaded.img).source)));
		frames.set(key, (t = new PIXI.Texture({ source: src, frame: new PIXI.Rectangle(r.x, r.y, r.w, r.h) })));
	}
	return t;
}

// lookups that place() repeated for every sprite every redraw (findState scanned dmi.states linearly; cellTexture built a string key; cellRect allocated).
const stateMemo = new WeakMap<object, Map<string, ReturnType<typeof findState> | null>>(); // dmi -> iconState -> state
function findStateC(dmi: LoadedIcon["dmi"], name: string): ReturnType<typeof findState> {
	let m = stateMemo.get(dmi);
	if (!m) stateMemo.set(dmi, (m = new Map()));
	let st = m.get(name);
	if (st === undefined) m.set(name, (st = findState(dmi, name) ?? null));
	return st ?? undefined;
}
interface CellInfo { rect: { x: number; y: number; w: number; h: number }; tex: PIXI.Texture }
const cellMemo = new WeakMap<LoadedIcon, CellInfo[]>(); // loaded icon -> cell index -> rect + texture
function cellInfo(loaded: LoadedIcon, icon: string, cell: number): CellInfo {
	let arr = cellMemo.get(loaded);
	if (!arr) cellMemo.set(loaded, (arr = []));
	let ce = arr[cell];
	if (!ce) {
		const rect = cellRect(loaded.dmi, cell);
		arr[cell] = ce = { rect, tex: cellTexture(icon, loaded, rect) };
	}
	return ce;
}
const wholeDelays = new WeakMap<object, boolean>();
function ticksOnDeciseconds(state: NonNullable<ReturnType<typeof findState>>): boolean {
	let w = wholeDelays.get(state);
	if (w === undefined) wholeDelays.set(state, (w = !(state.loop > 0) && ([] as number[]).concat(state.delay ?? []).every((d) => Number.isInteger(d))));
	return w;
}
const lightMemo = new WeakMap<object, { ce: CellInfo; tex: PIXI.Texture }>(); // color matrix (the array itself: a fading copy of an appearance keeps it) -> lighting texture
const colorMemo = new Map<string, number>(); // color string -> tint number (-1: not a color Pixi knows)
function tintOf(str: string): number {
	let n = colorMemo.get(str);
	if (n === undefined) {
		try { n = new PIXI.Color(str).toNumber(); } catch { n = -1; }
		if (colorMemo.size > 2000) colorMemo.clear();
		colorMemo.set(str, n);
	}
	return n;
}

function fromCanvas(c: HTMLCanvasElement): PIXI.Texture {
	let t = canvasTex.get(c);
	if (!t) {
		t = new PIXI.Texture({ source: nearest(new PIXI.CanvasSource({ resource: c })) });
		canvasTex.set(c, t);
	}
	return t;
}

/** Maptext of one layer as a small texture, drawn with the canvas maptext code at the box's own position. */
function maptextSprite(a: Appearance, originX: number, originY: number): { tex: PIXI.Texture; x: number; y: number } | null {
	const box = maptextBoxRect(a, originX, originY, TILE_PX);
	if (box.w <= 0 || box.h <= 0) return null;
	const key = JSON.stringify([a.maptext, a.maptextWidth, a.maptextHeight]);
	let tex = maptexts.get(key);
	if (!tex) {
		if (maptexts.size >= 512) maptexts.clear(); // ponytail: cleared whole when full
		const c = document.createElement("canvas");
		c.width = box.w;
		c.height = box.h;
		// drawMaptext places the box at origin + maptext_x/y; draw it with the box's top-left at (0,0).
		drawMaptext(c.getContext("2d")!, a, -a.maptextX, a.maptextY + a.maptextHeight - TILE_PX, TILE_PX);
		maptexts.set(key, (tex = new PIXI.Texture({ source: nearest(new PIXI.CanvasSource({ resource: c })) })));
	}
	return { tex, x: box.x, y: box.y };
}

/** Same items in the same order at the same places (appearances compared by identity). */
function sameItems(a: DrawItem[], b: DrawItem[]): boolean {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i].appearance !== b[i].appearance || a[i].originX !== b[i].originX || a[i].originY !== b[i].originY || !sameFit(a[i].hk, b[i].hk)) return false;
	return true;
}

/** A pool of sprites in a container: a plane's whole-plane draw, a chunk's, or a plane's screen items. */
interface LayerState { container: PIXI.Container; pool: PIXI.Sprite[]; used: number; clock: boolean; anim?: boolean; slotsA?: Slot[]; slotsB?: Slot[] }
/** An animated sprite of a kept layer (chunk / screen items): swap its texture when the frame changes instead of placing everything again. */
interface Slot { s: PIXI.Sprite; a: Appearance; loaded: LoadedIcon; state: NonNullable<ReturnType<typeof findState>>; cells: number[]; frame: number; lighting: boolean; obj: number | undefined; table: Int16Array | null; total: number; /** its sprite's pool index */ k: number }
/** page-draw step 4: one chunk-plane drawn at screen resolution into its own small render texture. */
interface ChunkPx extends LayerState { cp: ChunkPlane; version: number; ds: number; rt: PIXI.RenderTexture | null; out: PIXI.Sprite; j0: number; k0: number; w: number; h: number; items: DrawItem[] | null; ends: number[]; flags: number[]; incRuns: number; iconsN: number }
interface PlaneState extends LayerState {
	rt: PIXI.RenderTexture; out: PIXI.Sprite; p: Prepared | null; items: DrawItem[]; hud: boolean; filterKey: string; ends: number[] | null; flags: number[]; iconsN: number; incRuns: number; ds: number; emx: number; emy: number;
	/** chunked draw: comp = [screen items below?, chunk sprites, screen items above?] rendered into rt; hudLayer holds the plane's screen items */
	comp: PIXI.Container; chunkLayer: PIXI.Container; hudLo: LayerState; hudHi: LayerState; hudLoItems: DrawItem[]; hudHiItems: DrawItem[]; sig: string;
}

/** what the last draw used, for the pixel diff (?renderer=pd) and the probes. */
export interface PixiGrid { s: number; w: number; h: number; viewW: number; viewH: number; ox: number; oy: number; cx: number; cy: number; bias: number; dpr: number; css: string }
export interface PixiBackend extends ViewBackend { grid: () => PixiGrid | null; pixels: () => { w: number; h: number; data: Uint8ClampedArray } }

/** Screen-size drawing: a nearest-sampled screen pixel i sits exactly on a texel edge whenever the scale is 1/k
 *  (sample point (i + 0.5) / s is a whole number), and which texel the GPU then picks is up to float rounding. Every screen sample is moved
 *  this far (screen px) towards the lower texel so ties always go the same way; the pixel-diff reference applies the same shift. */
export const GRID_BIAS = 1 / 256;

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

	function sprite(st: LayerState): PIXI.Sprite {
		let s = st.pool[st.used];
		if (!s) {
			st.pool.push((s = new PIXI.Sprite()));
			st.container.addChild(s);
		}
		st.used++;
		s.visible = true;
		return s;
	}

	function layerTexture(a: Appearance, ce: CellInfo, loaded: LoadedIcon, lighting: boolean): PIXI.Texture {
		if (lighting && Array.isArray(a.color)) {
			let lm = lightMemo.get(a.color);
			if (!lm || lm.ce !== ce) lightMemo.set(a.color, (lm = { ce, tex: fromCanvas(matrixTintedRect(loaded.img, ce.rect, a.color)) }));
			return lm.tex;
		}
		return ce.tex;
	}
	const tables = new WeakMap<object, Int16Array | null>();
	/** state -> frame at each whole decisecond of its cycle (shared-clock states with whole-decisecond delays), else null */
	function tableOf(state: Slot["state"]): Int16Array | null {
		let t = tables.get(state);
		if (t === undefined) {
			t = null;
			if (ticksOnDeciseconds(state) && state.frames > 1) {
				const total = buildAnimationSteps(state.frames, state.delay, state.rewind).reduce((n, x) => n + x.delay, 0);
				if (total > 0 && total <= 4096 && Number.isInteger(total)) { t = new Int16Array(total); for (let k = 0; k < total; k++) t[k] = frameForState(state, k, k); }
			}
			tables.set(state, t);
		}
		return t;
	}
	function addSlot(st: LayerState, s: PIXI.Sprite, a: Appearance, loaded: LoadedIcon, state: Slot["state"], cells: number[], frame: number, lighting: boolean, obj: number | undefined): void {
		const table = a.flickT0 === undefined ? tableOf(state) : null;
		const sl: Slot = { s, a, loaded, state, cells, frame, lighting, obj, table, total: table?.length ?? 0, k: st.used - 1 };
		(table ? st.slotsA! : st.slotsB!).push(sl);
	}
	function setFrame(sl: Slot, f: number): void {
		sl.frame = f;
		sl.s.texture = layerTexture(sl.a, cellInfo(sl.loaded, sl.a.icon!, sl.cells[f] ?? sl.state.cells[0][0]), sl.loaded, sl.lighting);
	}
	/** Re-pick the frame of a layer's animated sprites: shared-clock ones only when the decisecond moved (doA), own-clock ones every call. True if any changed. */
	function refreshSlots(ls: LayerState, ft: number, doA: boolean): boolean {
		let changed = false;
		if (doA) {
			const ds = Math.floor(ft);
			for (const sl of ls.slotsA!) { const f = sl.table![ds % sl.total]; if (f !== sl.frame) { setFrame(sl, f); changed = true; } }
		}
		for (const sl of ls.slotsB!) {
			const f = frameForState(sl.state, ft, sl.obj === undefined ? ft : ft - sl.obj, sl.a.flickT0);
			if (f !== sl.frame) { setFrame(sl, f); changed = true; }
		}
		return changed;
	}

	/** One appearance layer (atom or overlay) as a pooled sprite; mirrors station-client.ts drawLayer/drawLightingLayer. */
	function place(st: LayerState, a: Appearance, originX: number, originY: number, blend: PIXI.BLEND_MODES, lighting: boolean, frameTime: number, withMaptext: boolean, objTime: number = frameTime, objT0?: number): void {
		if (a.icon && a.alpha > 0) {
			const loaded = icons.get(a.icon);
			const state = loaded && findStateC(loaded.dmi, a.iconState);
			if (loaded && state) {
				const di = dirIndex(state.dirs, a.dir);
				if (state.frames > 1) { st.anim = true; if (a.flickT0 !== undefined || !ticksOnDeciseconds(state)) st.clock = true; } // this sprite's frame can change between deciseconds (own clock, or a fractional delay): a plane with one is never shifted
				const fr = frameForState(state, frameTime, objTime, a.flickT0);
				const cell = state.cells[di]?.[fr] ?? state.cells[0][0];
				const ce = cellInfo(loaded, a.icon, cell), rect = ce.rect;
				const dx = originX + a.pixelX, dy = originY - a.pixelY - (rect.h - 32);
				const s = sprite(st);
				let tint = 0xffffff;
				s.texture = layerTexture(a, ce, loaded, lighting);
				if (!(lighting && Array.isArray(a.color)) && !lighting && typeof a.color === "string") {
					const n = tintOf(a.color);
					if (n >= 0) tint = n; // bad color string: untinted, as the canvas path
				}
				if (st.slotsA && state.frames > 1) addSlot(st, s, a, loaded, state, state.cells[di] ?? state.cells[0], fr, lighting, objT0);
				s.tint = tint;
				s.alpha = a.alpha / 255;
				s.blendMode = blend;
				if (a.transform) {
					const [ca, cb, cc, cd, ce, cf] = byondMatrixToCanvas(a.transform);
					s.anchor.set(0.5, 0.5);
					s.setFromMatrix(new PIXI.Matrix(ca, cb, cc, cd, dx + rect.w / 2 + ce, dy + rect.h / 2 + cf));
				} else {
					s.anchor.set(0, 0);
					s.scale.set(1, 1);
					s.rotation = 0;
					s.skew.set(0, 0);
					s.position.set(dx, dy);
				}
			}
		}
		if (withMaptext && a.maptext) {
			const m = maptextSprite(a, originX + a.pixelX, originY - a.pixelY);
			if (m) {
				const s = sprite(st);
				s.texture = m.tex;
				s.tint = 0xffffff;
				s.alpha = 1;
				s.blendMode = blend;
				s.anchor.set(0, 0);
				s.scale.set(1, 1);
				s.rotation = 0;
				s.skew.set(0, 0);
				s.position.set(m.x, m.y);
			}
		}
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
	let texMs = 0, lastFt = 0; // render-texture time of the plane being drawn (GPU included with ?sync=1)

	/** the sprites this screen object just placed (pool slots u0..used) were laid out in base-view pixels: move and scale them to the zoomed view. */
	function fitHud(st: LayerState, u0: number, hk: HudFit): void {
		for (let i = u0; i < st.used; i++) {
			const sp = st.pool[i];
			sp.position.set(sp.position.x * hk.k + hk.dx, sp.position.y * hk.k + hk.dy);
			sp.scale.set(sp.scale.x * hk.k, sp.scale.y * hk.k);
		}
	}

	/** One draw item (atom with its overlays) at (ox, oy) in this layer's pixels. */
	function placeItem(st: LayerState, it: DrawItem, ox: number, oy: number, frameTime: number): void {
		const a = it.appearance, blend = BLEND[a.blendMode] ?? "normal", lighting = isLighting(a);
		const objTime = a.appearedT0 === undefined ? frameTime : frameTime - a.appearedT0; // pt-d: loop>0 states run on the object's own clock
		const u0 = st.used;
		place(st, a, ox, oy, blend, lighting, frameTime, !lighting, objTime, a.appearedT0);
		for (const o of a.overlays) place(st, o, ox + a.pixelX, oy - a.pixelY, o.blendMode ? BLEND[blendOf(o, a)] ?? "normal" : blend, lighting, frameTime, !lighting, objTime, a.appearedT0);
		if (it.hk) fitHud(st, u0, it.hk);
	}

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
					for (const it of now) placeItem(hl, it, it.originX + ehx, it.originY + ehy, ft);
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
		const chunked = useScene && s < 1 && chunksOn;
		if (chunked !== wasChunked || (chunked && s !== chunkScale)) { // entering / leaving chunks, or a new scale: nothing kept is valid
			wasChunked = chunked; chunkScale = s;
			if (chunked) zoomPend = { s, c0: rtCreated, t: performance.now() };
			freeAllPx();
			for (const st of planes.values()) { st.p = null; st.sig = ""; st.hudLoItems = []; st.hudHiItems = []; }
		}
		const t0 = performance.now();
		lastFt = frameTime;
		if (chunked) drawChunked(p, showHud, frameTime, ox, oy, w, h, s);
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
		const info = `canvas ${sizeW}x${sizeH} (view ${p.canvasW}x${p.canvasH}, scale ${scale.toFixed(4)}), ${planes.size} plane textures of that size (~${Math.round(planes.size * sizeW * sizeH * 4 / 1048576)} MB)${wasChunked ? `, chunk textures ${rtLive} live, peak ${rtPeak} / ${(rtPeakBytes / 1048576).toFixed(1)} MB, ${rtCreated} created ever (${cpx.size} in use, ${rtPooled} pooled, ~${(rtBytes / 1048576).toFixed(1)} MB, ${cpx.size ? `${[...cpx.values()][0].w}x${[...cpx.values()][0].h}` : "-"} px each)` : ""}, MAX_TEXTURE_SIZE ${maxTex}, devicePixelRatio ${devicePixelRatio}, CSS box ${app.canvas.clientWidth}x${app.canvas.clientHeight}`;
		if (info !== viewStats.pixiInfo) viewStats.pixiInfo = info;
		if (zoomPend && chunked) { // the first redraw at a new view size, with the chunk textures it created
			const vs = viewStats as unknown as Record<string, string[]>;
			(vs.zoomLog ??= []).push(`scale ${zoomPend.s.toFixed(4)}: first redraw ${(performance.now() - zoomPend.t).toFixed(0)} ms, ${rtCreated - zoomPend.c0} chunk textures created, ${cpx.size} in use`);
			zoomPend = null;
		}
	}
	// Sight shadows (client-scene.ts, sight-shadow-paint.ts): the painted canvas stretched over its box of tiles (linear, so soft), above every
	// plane under FULLSCREEN_PLANE (the lighting included), below the fullscreen overlays (blindness, flashes) and the HUD.
	const FULLSCREEN_PLANE = 18;
	const shadowSprite = new PIXI.Sprite();
	let shadowTex: PIXI.Texture | null = null, shadowVer = -1, shadowSize = "", shadowCanvas: HTMLCanvasElement | null = null;
	function placeShadow(p: Prepared, s: number, ox: number, oy: number, cx: number, cy: number): void {
		const sh = p.shadow;
		if (!sh) { shadowSprite.parent?.removeChild(shadowSprite); return; }
		shadowSprite.alpha = p.shadowAlpha ?? 1;
		const size = `${sh.canvas.width}x${sh.canvas.height}`;
		if (size !== shadowSize || sh.canvas !== shadowCanvas) { // the smoothed tg look paints on a canvas of its own
			shadowSize = size; shadowCanvas = sh.canvas;
			shadowTex?.destroy(true);
			const src = new PIXI.CanvasSource({ resource: sh.canvas });
			shadowTex = new PIXI.Texture({ source: sh.crisp ? nearest(src) : src });
			shadowSprite.texture = shadowTex;
		} else if (sh.version !== shadowVer) shadowTex!.source.update();
		shadowVer = sh.version;
		const mx = sh.x0 * TILE_PX, my = -(sh.y0 + sh.h - 1) * TILE_PX; // the box's top-left in map px
		shadowSprite.position.set(s === 1 ? mx - cx : mx * s + ox, s === 1 ? my - cy : my * s + oy);
		shadowSprite.scale.set((s * TILE_PX) / sh.res);
		let at = 0; // after the planes below FULLSCREEN_PLANE (the stage holds one sprite per plane, in plane order)
		for (const [plane, st] of planes) if (plane < FULLSCREEN_PLANE && st.out.parent === app.stage) at = Math.max(at, app.stage.getChildIndex(st.out) + 1);
		app.stage.addChildAt(shadowSprite, at);
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
