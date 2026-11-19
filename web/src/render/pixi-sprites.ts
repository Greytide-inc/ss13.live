// pixi-sprites - the sprite side of pixi-view.ts: cached textures (sheet cells, lighting matrices, maptext, tints) and placing one
// appearance (atom + overlays) as pooled sprites in a layer, with the animated ones kept as slots whose texture is swapped when the frame moves.

import * as PIXI from "pixi.js";
import { cellRect, dirIndex } from "../dmi/dmi.js";
import { findState } from "./sprite-lookup.js";
import { byondMatrixToCanvas } from "./byond-transform.js";
import { drawMaptext, maptextBoxRect } from "./maptext.js";
import { frameForState, isLighting, matrixTintedRect, TILE_PX, type LoadedIcon } from "./station-client.js";
import { sameFit } from "./inc-place.js";
import { icons, type DrawItem, type HudFit } from "./client-scene.js";
import { blendOf } from "./inherit.js";
import { buildAnimationSteps } from "../dmi/animation.js";
import type { Appearance } from "../appearance/appearance.js";

// BLEND_OVERLAY(1)/INSET_OVERLAY(5) draw normally. WebGL multiply is dst*src + dst*(1-srcA): empty or src-transparent
// pixels leave the destination as is, which is what BYOND does (the canvas path's "multiply" differs there).
export const BLEND: Record<number, PIXI.BLEND_MODES> = { 2: "add", 3: "subtract", 4: "multiply" }; // else "normal"

const sources = new WeakMap<HTMLImageElement, PIXI.TextureSource>();
const frames = new Map<string, PIXI.Texture>(); // "icon|x,y,w,h" -> a cell of the sheet
const canvasTex = new WeakMap<HTMLCanvasElement, PIXI.Texture>();
const maptexts = new Map<string, PIXI.Texture>();

export function nearest<T extends PIXI.TextureSource>(s: T): T {
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
export function ticksOnDeciseconds(state: NonNullable<ReturnType<typeof findState>>): boolean {
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

export function fromCanvas(c: HTMLCanvasElement): PIXI.Texture {
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
export function sameItems(a: DrawItem[], b: DrawItem[]): boolean {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i].appearance !== b[i].appearance || a[i].originX !== b[i].originX || a[i].originY !== b[i].originY || !sameFit(a[i].hk, b[i].hk)) return false;
	return true;
}

/** A pool of sprites in a container: a plane's whole-plane draw, a chunk's, or a plane's screen items. */
export interface LayerState { container: PIXI.Container; pool: PIXI.Sprite[]; used: number; clock: boolean; anim?: boolean; slotsA?: Slot[]; slotsB?: Slot[] }
/** An animated sprite of a kept layer (chunk / screen items): swap its texture when the frame changes instead of placing everything again. */
export interface Slot { s: PIXI.Sprite; a: Appearance; loaded: LoadedIcon; state: NonNullable<ReturnType<typeof findState>>; cells: number[]; frame: number; lighting: boolean; obj: number | undefined; table: Int16Array | null; total: number; /** its sprite's pool index */ k: number }

/** Screen-size drawing: a nearest-sampled screen pixel i sits exactly on a texel edge whenever the scale is 1/k
 *  (sample point (i + 0.5) / s is a whole number), and which texel the GPU then picks is up to float rounding. Every screen sample is moved
 *  this far (screen px) towards the lower texel so ties always go the same way; the pixel-diff reference applies the same shift. */
export const GRID_BIAS = 1 / 256;

export function sprite(st: LayerState): PIXI.Sprite {
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
export function refreshSlots(ls: LayerState, ft: number, doA: boolean): boolean {
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
export function place(st: LayerState, a: Appearance, originX: number, originY: number, blend: PIXI.BLEND_MODES, lighting: boolean, frameTime: number, withMaptext: boolean, objTime: number = frameTime, objT0?: number): void {
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

/** the sprites this screen object just placed (pool slots u0..used) were laid out in base-view pixels: move and scale them to the zoomed view. */
export function fitHud(st: LayerState, u0: number, hk: HudFit): void {
	for (let i = u0; i < st.used; i++) {
		const sp = st.pool[i];
		sp.position.set(sp.position.x * hk.k + hk.dx, sp.position.y * hk.k + hk.dy);
		sp.scale.set(sp.scale.x * hk.k, sp.scale.y * hk.k);
	}
}

/** One draw item (atom with its overlays) at (ox, oy) in this layer's pixels. */
export function placeItem(st: LayerState, it: DrawItem, ox: number, oy: number, frameTime: number): void {
	const a = it.appearance, blend = BLEND[a.blendMode] ?? "normal", lighting = isLighting(a);
	const objTime = a.appearedT0 === undefined ? frameTime : frameTime - a.appearedT0; // pt-d: loop>0 states run on the object's own clock
	const u0 = st.used;
	place(st, a, ox, oy, blend, lighting, frameTime, !lighting, objTime, a.appearedT0);
	for (const o of a.overlays) place(st, o, ox + a.pixelX, oy - a.pixelY, o.blendMode ? BLEND[blendOf(o, a)] ?? "normal" : blend, lighting, frameTime, !lighting, objTime, a.appearedT0);
	if (it.hk) fitHud(st, u0, it.hk);
}
