// icon-ops - Runtime icon building: the pixel side of DM's /icon datum. The VM only keeps a
// recipe per /icon (IconRecipe: where it came from plus the Blend calls made on it); evalRecipe turns
// one into real pixels on demand, so nothing here runs at boot unless tg asks for a pixel.
// Behaviour measured in BYOND 511 through web/tests/dm/icon_blend.dm and icon_ops.dm (Scale,
// Crop, Flip, Turn, Shift, SwapColor, MapColors, SetIntensity, DrawBox, Insert) unless marked "unverified".
// Pure: no Node or browser APIs (PNG decode/encode live in dmi-node.ts).

import { DMI_DIR_ORDER, type Dmi, type DmiDirCount, type DmiState, cellRect } from "./dmi.js";

/** One state with its pixels: px[dirIndex][frame] = RGBA, rows top to bottom, w*h*4 bytes. */
export interface IconStateImage extends Omit<DmiState, "cells"> {
	px: Uint8ClampedArray[][];
}

export interface IconImage {
	width: number;
	height: number;
	states: IconStateImage[];
}

export type RGBA = [number, number, number, number];

export type BlendOp = { mode: number; x: number; y: number; icon: IconRecipe } | { mode: number; color: RGBA };

/** The other /icon procs, as recorded by the VM (arguments already checked and defaulted). */
export type IconOp =
	| BlendOp
	| { kind: "scale"; w: number; h: number }
	| { kind: "crop"; x1: number; y1: number; x2: number; y2: number }
	| { kind: "flip"; dir: number }
	| { kind: "turn"; angle: number }
	| { kind: "shift"; dir: number; offset: number; wrap: boolean }
	/** from null matches clear pixels; exact: from had an alpha digit pair (match RGBA, not just RGB). */
	| { kind: "swap"; from: RGBA | null; exact: boolean; to: RGBA | null }
	/** m: 20 numbers, rows rr rg rb ra / gr .. / br .. / ar .. / r0 g0 b0 a0 (offsets 0..1). alpha: false leaves alpha alone. */
	| { kind: "map"; m: number[]; alpha: boolean }
	| { kind: "box"; color: RGBA | null; x1: number; y1: number; x2: number; y2: number }
	| { kind: "insert"; icon: IconRecipe; state: string; dir: number; frame: number; delay: number | null; moving: boolean };

/** An /icon as the VM sees it. Immutable: Blend makes a new recipe, so a snapshot is just a reference. */
export interface IconRecipe {
	/** A file path, another recipe, or null (an empty icon). */
	src: string | IconRecipe | null;
	state: string | null;
	dir: number;
	frame: number;
	ops: readonly IconOp[];
}

/** Every icon file a recipe reads pixels from (its source and every Blend/Insert icon, recursively). */
export function recipePaths(r: IconRecipe, out = new Set<string>()): string[] {
	if (typeof r.src === "string") out.add(r.src);
	else if (r.src) recipePaths(r.src, out);
	for (const op of r.ops) {
		if ("icon" in op) recipePaths(op.icon, out);
	}
	return [...out];
}

export const ICON_ADD = 0, ICON_SUBTRACT = 1, ICON_MULTIPLY = 2, ICON_OVERLAY = 3, ICON_AND = 4, ICON_OR = 5, ICON_UNDERLAY = 6;

/** Splits a decoded sheet into per-state pixels. */
export function iconFromSheet(dmi: Dmi, rgba: Uint8Array, sheetWidth: number): IconImage {
	const { width: w, height: h } = dmi;
	const cut = (cell: number) => {
		const r = cellRect(dmi, cell);
		const out = new Uint8ClampedArray(w * h * 4);
		for (let y = 0; y < h; y++) {
			const from = ((r.y + y) * sheetWidth + r.x) * 4;
			out.set(rgba.subarray(from, from + w * 4), y * w * 4);
		}
		return out;
	};
	return { width: w, height: h, states: dmi.states.map(({ cells, ...s }) => ({ ...s, px: cells.map((row) => row.map(cut)) })) };
}

const cloneState = (s: IconStateImage): IconStateImage => ({ ...s, delay: [...s.delay], px: s.px.map((d) => d.map((f) => f.slice())) });

/** DMI_DIR_ORDER index of a BYOND dir, or -1. */
const dirIdx = (dir: number) => (DMI_DIR_ORDER as readonly number[]).indexOf(dir);

/** new/icon(src, state, dir, frame): a copy, cut down to one state / dir / frame when asked. */
export function extract(icon: IconImage, state: string | null, dir: number, frame: number): IconImage {
	let states = icon.states;
	if (state !== null) {
		// The picked state is renamed "" (measured: GetPixel(.., "a") on icon(f, "a") finds nothing).
		const s = states.find((x) => x.name === state && !x.movement) ?? states.find((x) => x.name === state);
		states = s ? [{ ...s, name: "" }] : [];
	}
	// measured: a dir or frame the state doesn't have leaves no state at all.
	if (dir) states = states.filter((s) => dirIdx(dir) >= 0 && dirIdx(dir) < s.dirs);
	if (frame > 0) states = states.filter((s) => frame <= s.frames);
	states = states.map((s) => {
		let px = s.px, dirs = s.dirs, frames = s.frames, delay = s.delay;
		if (dir) {
			px = [px[dirIdx(dir)]];
			dirs = 1;
		}
		if (frame > 0) {
			const f = frame - 1;
			px = px.map((d) => [d[f]]);
			frames = 1;
			delay = [delay[f] ?? 1];
		}
		return cloneState({ ...s, px, dirs, frames, delay });
	});
	return { width: icon.width, height: icon.height, states };
}

const round = Math.round;

/** One pixel of Blend. d and s are 4-byte RGBA; the result is written into d. */
function blendPixel(mode: number, d: Uint8ClampedArray, di: number, s: ArrayLike<number>, si: number): void {
	let da = d[di + 3], sa = s[si + 3];
	switch (mode) {
		case ICON_ADD:
		case ICON_AND: // measured: AND is ADD
		case ICON_SUBTRACT: {
			const sign = mode === ICON_SUBTRACT ? -1 : 1;
			for (let c = 0; c < 3; c++) d[di + c] = d[di + c] + sign * s[si + c]; // clamped by the array
			d[di + 3] = round((da * sa) / 255);
			return;
		}
		case ICON_MULTIPLY:
			for (let c = 0; c < 4; c++) d[di + c] = round((d[di + c] * s[si + c]) / 255);
			return;
		case ICON_OR:
			// measured: colours add (not bitwise), alpha is the union; a fully clear side gives the other.
			if (sa === 0) return;
			if (da === 0) break;
			for (let c = 0; c < 3; c++) d[di + c] = d[di + c] + s[si + c];
			d[di + 3] = round(da + sa - (da * sa) / 255);
			return;
		case ICON_UNDERLAY: {
			// Overlay with the two sides swapped.
			const dst = [d[di], d[di + 1], d[di + 2], da];
			if (sa === 0) return;
			for (let c = 0; c < 4; c++) d[di + c] = s[si + c];
			blendPixel(ICON_OVERLAY, d, di, dst, 0);
			return;
		}
		case ICON_OVERLAY:
		default: // unverified: unknown modes
			if (da === 0) break;
			for (let c = 0; c < 3; c++) d[di + c] = round(d[di + c] + ((s[si + c] - d[di + c]) * sa) / 255);
			d[di + 3] = round(da + sa - (da * sa) / 255);
			return;
	}
	for (let c = 0; c < 4; c++) d[di + c] = s[si + c];
}

/** icon.Blend(other icon, mode, x, y), in place. */
export function blendIcon(dst: IconImage, src: IconImage, mode: number, x: number, y: number): void {
	const { width: w, height: h } = dst, { width: sw, height: sh } = src;
	for (let si = 0; si < dst.states.length; si++) {
		const st = dst.states[si];
		// unverified with several states: the same-named state, else the first.
		const ss = src.states.find((s) => s.name === st.name) ?? src.states[0];
		if (!ss) continue;
		if (ss.dirs > st.dirs) {
			// measured: a 1-dir icon blended with a 4-dir one gets 4 dirs, each a copy of its own.
			while (st.px.length < ss.dirs) st.px.push(st.px[0].map((f) => f.slice()));
			st.dirs = ss.dirs as DmiDirCount;
		}
		st.px.forEach((frames, d) =>
			frames.forEach((dp, f) => {
				// measured: a 1-dir source applies to every dir. unverified: fewer source frames.
				const dirFrames = ss.px[d < ss.dirs ? d : 0];
				const sp = dirFrames[f < ss.frames ? f : 0];
				// Source pixel (sx, sy), 1-based from the bottom, lands on (sx + x - 1, sy + y - 1).
				for (let sy = 1; sy <= sh; sy++) {
					const ty = sy + y - 1;
					if (ty < 1 || ty > h) continue;
					for (let sx = 1; sx <= sw; sx++) {
						const tx = sx + x - 1;
						if (tx < 1 || tx > w) continue;
						blendPixel(mode, dp, ((h - ty) * w + tx - 1) * 4, sp, ((sh - sy) * sw + sx - 1) * 4);
					}
				}
			}),
		);
	}
}

/** icon.Blend("#rrggbb[aa]", mode): every pixel (measured: x and y are ignored). */
export function blendColor(dst: IconImage, color: RGBA, mode: number): void {
	for (const st of dst.states) for (const frames of st.px) for (const p of frames) for (let i = 0; i < p.length; i += 4) blendPixel(mode, p, i, color, 0);
}

/** icon.GetPixel(x, y, state, dir, frame): "#rrggbb", "#rrggbbaa" below full alpha, null when clear. */
export function getPixel(icon: IconImage, x: number, y: number, state: string | null, dir: number, frame: number): string | null {
	// unverified: a null state on a many-state icon (we take "", else the first).
	const st = state === null ? icon.states.find((s) => s.name === "") ?? icon.states[0] : icon.states.find((s) => s.name === state);
	if (!st) return null;
	const d = dir ? dirIdx(dir) : 0; // measured: a dir the state doesn't have gives null
	if (d < 0 || d >= st.dirs) return null;
	const f = frame > 0 ? frame - 1 : 0;
	if (f >= st.frames || x < 1 || y < 1 || x > icon.width || y > icon.height) return null;
	const p = st.px[d][f], i = ((icon.height - y) * icon.width + x - 1) * 4;
	if (p[i + 3] === 0) return null;
	const hex = (n: number) => n.toString(16).padStart(2, "0");
	return "#" + hex(p[i]) + hex(p[i + 1]) + hex(p[i + 2]) + (p[i + 3] < 255 ? hex(p[i + 3]) : "");
}

/** Runs a recipe. `load` gives a whole file's icon (cached by the caller); results are cached per recipe. */
export function evalRecipe(r: IconRecipe, load: (path: string) => IconImage | null): IconImage {
	const hit = cache.get(r);
	if (hit) return hit;
	const base = r.src === null ? null : typeof r.src === "string" ? load(r.src) : evalRecipe(r.src, load);
	// measured: icon() is 0x0 (Width() stays 0 even after Insert; see recipeSize).
	const out = extract(base ?? { width: 0, height: 0, states: [] }, r.state, r.dir, r.frame);
	for (const op of r.ops) {
		if (!("kind" in op)) {
			if ("color" in op) blendColor(out, op.color, op.mode);
			else blendIcon(out, evalRecipe(op.icon, load), op.mode, op.x, op.y);
		} else if (op.kind === "insert") insertIcon(out, evalRecipe(op.icon, load), op);
		else if (op.kind === "scale") scaleIcon(out, op.w, op.h);
		else if (op.kind === "crop") cropIcon(out, op.x1, op.y1, op.x2, op.y2);
		else if (op.kind === "box") drawBox(out, op);
		else if (op.kind === "swap") eachPixel(out, (p, i) => swapPixel(p, i, op));
		else if (op.kind === "map") eachPixel(out, (p, i) => mapPixel(p, i, op.m, op.alpha));
		else remapIcon(out, op);
	}
	cache.set(r, out);
	return out;
}
const cache = new WeakMap<IconRecipe, IconImage>();

/** Width()/Height() of a recipe without working out pixels. `fileSize` is the host's iconSize hook. */
export function recipeSize(r: IconRecipe, fileSize: (path: string) => [number, number] | null): [number, number] {
	if (r.src === null) return [0, 0]; // measured: icon() stays 0x0 through Insert and Scale
	let size = typeof r.src === "string" ? fileSize(r.src) ?? [32, 32] : recipeSize(r.src, fileSize);
	for (const op of r.ops) {
		if (!("kind" in op)) continue;
		if (op.kind === "scale") size = [op.w, op.h];
		else if (op.kind === "crop") size = [Math.abs(op.x2 - op.x1) + 1, Math.abs(op.y2 - op.y1) + 1];
		else if (op.kind === "insert") size = recipeSize(op.icon, fileSize); // measured: the icon takes the inserted one's size
	}
	return size;
}

/** State names of a recipe, for icon_states(), without working out pixels. `fileStates` lists a file's states. */
export function recipeStates(r: IconRecipe, fileStates: (path: string) => readonly Omit<DmiState, "cells">[] | null): string[] {
	type S = Pick<DmiState, "name" | "dirs" | "frames" | "movement">;
	const walk = (r: IconRecipe): S[] => {
		let states: S[] = r.src === null ? [] : typeof r.src === "string" ? [...(fileStates(r.src) ?? [])] : walk(r.src);
		// The same cut as extract().
		if (r.state !== null) {
			const s = states.find((x) => x.name === r.state && !x.movement) ?? states.find((x) => x.name === r.state);
			states = s ? [{ ...s, name: "" }] : [];
		}
		if (r.dir) states = states.filter((s) => dirIdx(r.dir) >= 0 && dirIdx(r.dir) < s.dirs);
		if (r.frame > 0) states = states.filter((s) => r.frame <= s.frames);
		for (const op of r.ops)
			if ("kind" in op && op.kind === "insert" && !states.some((s) => s.name === op.state && !!s.movement === op.moving))
				states.push({ name: op.state, dirs: 1, frames: 1, movement: op.moving });
		return states;
	};
	// measured: each name once (a movement state sharing a name isn't listed again), file order.
	return [...new Set(walk(r).map((s) => s.name))];
}

// ---- The other /icon procs. Each changes the image in place.

function eachPixel(icon: IconImage, fn: (p: Uint8ClampedArray, i: number) => void): void {
	for (const st of icon.states) for (const frames of st.px) for (const p of frames) for (let i = 0; i < p.length; i += 4) fn(p, i);
}

/** Replaces every cell with f(x, y) -> source index (1-based, y=1 bottom) or -1 for clear, sized w x h. */
function remap(icon: IconImage, w: number, h: number, f: (x: number, y: number) => number): void {
	const map = new Int32Array(w * h);
	for (let y = 1; y <= h; y++)
		for (let x = 1; x <= w; x++) {
			const at = f(x, y);
			map[(h - y) * w + x - 1] = at < 0 ? -1 : at;
		}
	for (const st of icon.states)
		st.px = st.px.map((frames) =>
			frames.map((p) => {
				const out = new Uint8ClampedArray(w * h * 4);
				for (let i = 0; i < map.length; i++) if (map[i] >= 0) out.set(p.subarray(map[i] * 4, map[i] * 4 + 4), i * 4);
				return out;
			}),
		);
	icon.width = w;
	icon.height = h;
}
/** Index of pixel (x, y) in a w x h cell, or -1 outside it. */
const at = (w: number, h: number, x: number, y: number) => (x < 1 || y < 1 || x > w || y > h ? -1 : (h - y) * w + x - 1);

/** Crop(x1, y1, x2, y2): corners in either order; area outside the old icon comes out clear. */
function cropIcon(icon: IconImage, x1: number, y1: number, x2: number, y2: number): void {
	const lx = Math.min(x1, x2), ly = Math.min(y1, y2), { width: w, height: h } = icon;
	remap(icon, Math.abs(x2 - x1) + 1, Math.abs(y2 - y1) + 1, (x, y) => at(w, h, x + lx - 1, y + ly - 1));
}

/** Flip, Shift, and Turn: pixels move, none change. Each dir keeps its own pixels (measured: no dir swapping). */
function remapIcon(icon: IconImage, op: Extract<IconOp, { kind: "flip" | "shift" | "turn" }>): void {
	const { width: w, height: h } = icon;
	if (op.kind === "shift") {
		const dx = (op.dir & 4 ? op.offset : 0) - (op.dir & 8 ? op.offset : 0), dy = (op.dir & 1 ? op.offset : 0) - (op.dir & 2 ? op.offset : 0);
		const wrap = (v: number, n: number) => ((((v - 1) % n) + n) % n) + 1;
		remap(icon, w, h, (x, y) => (op.wrap ? at(w, h, wrap(x - dx, w), wrap(y - dy, h)) : at(w, h, x - dx, y - dy)));
		return;
	}
	if (op.kind === "flip") {
		const d = op.dir;
		if (d === 1 || d === 2) remap(icon, w, h, (x, y) => at(w, h, x, h + 1 - y));
		else if (d === 4 || d === 8) remap(icon, w, h, (x, y) => at(w, h, w + 1 - x, y));
		// measured: diagonals mirror across that diagonal, and do nothing to a non-square icon.
		else if (w === h && (d === 5 || d === 10)) remap(icon, w, h, (x, y) => at(w, h, w + 1 - y, w + 1 - x));
		else if (w === h && (d === 6 || d === 9)) remap(icon, w, h, (x, y) => at(w, h, y, x));
		return;
	}
	// Turn: clockwise. measured: a non-square icon doesn't turn at all.
	const a = ((op.angle % 360) + 360) % 360;
	if (w !== h || a === 0) return;
	if (a === 90) remap(icon, w, h, (x, y) => at(w, h, w + 1 - y, x));
	else if (a === 180) remap(icon, w, h, (x, y) => at(w, h, w + 1 - x, h + 1 - y));
	else if (a === 270) remap(icon, w, h, (x, y) => at(w, h, y, w + 1 - x));
	else {
		// ponytail: other angles are nearest-pixel about the centre, which is close to BYOND's but not
		// exact (a few edge pixels differ; tg only turns /icons by 90s). Match it if something needs it.
		const c = (w + 1) / 2, r = (a * Math.PI) / 180, cos = Math.cos(r), sin = Math.sin(r);
		remap(icon, w, h, (x, y) => {
			const u = (x - c) * cos - (y - c) * sin + c, v = (x - c) * sin + (y - c) * cos + c;
			if (u < 0 || v < 0 || u >= w + 1 || v >= h + 1) return -1;
			return at(w, h, Math.min(w, Math.max(1, Math.round(u))), Math.min(h, Math.max(1, Math.round(v))));
		});
	}
}

/** For each target pixel along one axis: [source index (0-based), weight] pairs. */
function axisWeights(from: number, to: number): [number, number][][] {
	const out: [number, number][][] = [];
	for (let i = 0; i < to; i++) {
		// measured: growing picks the nearest-left pixel; shrinking averages by covered area.
		if (to >= from) out.push([[Math.floor((i * from) / to), 1]]);
		else {
			// In units where a source pixel is `to` wide, target pixel i covers [i*from, (i+1)*from).
			const ws: [number, number][] = [];
			for (let j = Math.floor((i * from) / to); j * to < (i + 1) * from; j++) ws.push([j, Math.min((i + 1) * from, (j + 1) * to) - Math.max(i * from, j * to)]);
			out.push(ws);
		}
	}
	return out;
}

/** Scale(w, h). Shrinking: alpha is the area average; colour averages only the pixels that aren't clear
 * (not weighted by alpha); both round down (measured). */
function scaleIcon(icon: IconImage, w: number, h: number): void {
	if (w < 1 || h < 1) return; // unverified
	const { width: sw, height: sh } = icon;
	if (w === sw && h === sh) return;
	const xs = axisWeights(sw, w), ys = axisWeights(sh, h);
	for (const st of icon.states)
		st.px = st.px.map((frames) =>
			frames.map((p) => {
				const out = new Uint8ClampedArray(w * h * 4);
				for (let ty = 0; ty < h; ty++) // ty counts from the top, like the rows
					for (let tx = 0; tx < w; tx++) {
						let sumW = 0, sumA = 0, sumCW = 0, r = 0, g = 0, b = 0;
						for (const [sy, wy] of ys[ty])
							for (const [sx, wx] of xs[tx]) {
								const i = (sy * sw + sx) * 4, wt = wx * wy, a = p[i + 3];
								sumW += wt;
								sumA += wt * a;
								if (a === 0) continue;
								sumCW += wt;
								r += wt * p[i];
								g += wt * p[i + 1];
								b += wt * p[i + 2];
							}
						const o = (ty * w + tx) * 4;
						if (sumCW) {
							out[o] = Math.floor(r / sumCW);
							out[o + 1] = Math.floor(g / sumCW);
							out[o + 2] = Math.floor(b / sumCW);
						}
						out[o + 3] = Math.floor(sumA / sumW);
					}
				return out;
			}),
		);
	icon.width = w;
	icon.height = h;
}

/** SwapColor(old, new). measured: "#rrggbb" matches on colour and keeps the pixel's alpha;
 * "#rrggbbaa" matches exactly and writes the new alpha too; null matches clear pixels; new null clears. */
function swapPixel(p: Uint8ClampedArray, i: number, op: Extract<IconOp, { kind: "swap" }>): void {
	const { from, to } = op;
	if (from === null ? p[i + 3] !== 0 : p[i] !== from[0] || p[i + 1] !== from[1] || p[i + 2] !== from[2] || (op.exact && p[i + 3] !== from[3])) return;
	if (to === null) p.fill(0, i, i + 4);
	else if (op.exact || from === null) p.set(to, i);
	else p.set(to.slice(0, 3), i);
}

/** MapColors: each channel is a sum of the old channels times the matrix, plus an offset; rounded. */
function mapPixel(p: Uint8ClampedArray, i: number, m: number[], alpha: boolean): void {
	const [r, g, b, a] = [p[i], p[i + 1], p[i + 2], p[i + 3]];
	for (let c = 0; c < (alpha ? 4 : 3); c++) p[i + c] = Math.round(r * m[c] + g * m[4 + c] + b * m[8 + c] + a * m[12 + c] + 255 * m[16 + c]);
}

/** DrawBox(rgb, x1, y1, x2, y2): writes the colour over the box (measured: no blending; null clears), clipped. */
function drawBox(icon: IconImage, op: Extract<IconOp, { kind: "box" }>): void {
	const { width: w, height: h } = icon, c = op.color ?? [0, 0, 0, 0];
	const x1 = Math.max(1, Math.min(op.x1, op.x2)), x2 = Math.min(w, Math.max(op.x1, op.x2));
	const y1 = Math.max(1, Math.min(op.y1, op.y2)), y2 = Math.min(h, Math.max(op.y1, op.y2));
	for (const st of icon.states) for (const frames of st.px) for (const p of frames) for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) p.set(c, ((h - y) * w + x - 1) * 4);
}

/** Insert(icon, state, dir, frame, moving, delay). measured: the new icon's first state goes in (all its
 * dirs unless one is named); a new state with a dir named has 4 dirs, the rest clear; the whole icon
 * takes the inserted icon's size, scaling the states already there. */
function insertIcon(icon: IconImage, src: IconImage, op: Extract<IconOp, { kind: "insert" }>): void {
	const ss = src.states[0];
	if (!ss) return; // unverified
	if (icon.width !== src.width || icon.height !== src.height) {
		if (icon.states.length) scaleIcon(icon, src.width, src.height);
		icon.width = src.width;
		icon.height = src.height;
	}
	let st = icon.states.find((s) => s.name === op.state && !!s.movement === op.moving);
	if (!op.dir && !op.frame) {
		const copy = { ...cloneState(ss), name: op.state, movement: op.moving };
		if (st) icon.states[icon.states.indexOf(st)] = copy;
		else icon.states.push(copy);
		st = copy;
	} else {
		const blank = () => new Uint8ClampedArray(src.width * src.height * 4);
		const dirs = op.dir ? (dirIdx(op.dir) >= 4 ? 8 : 4) : ss.dirs;
		if (!st) {
			st = { name: op.state, dirs: (op.dir ? dirs : 1) as DmiDirCount, frames: 1, delay: [1], loop: 0, rewind: false, movement: op.moving, hotspot: null, px: [] };
			st.px = Array.from({ length: st.dirs }, () => [blank()]);
			icon.states.push(st);
		}
		const target = st;
		const f = op.frame ? op.frame - 1 : 0;
		while (target.frames <= f) {
			target.px.forEach((d) => d.push(blank()));
			target.delay.push(1);
			target.frames++;
		}
		if (op.dir && dirIdx(op.dir) >= target.dirs) {
			// unverified: a 1-dir state growing dirs; the new ones start clear.
			while (target.px.length < dirs) target.px.push(Array.from({ length: target.frames }, blank));
			target.dirs = dirs as DmiDirCount;
		}
		const dirList = op.dir ? [dirIdx(op.dir)] : target.px.map((_, i) => i);
		for (const d of dirList) {
			const sp = ss.px[d < ss.dirs && !op.dir ? d : 0]; // unverified: a named dir takes the new icon's first dir
			const frameList = op.frame ? [f] : target.px[d].map((_, i) => i);
			for (const fi of frameList) target.px[d][fi] = sp[op.frame ? 0 : Math.min(fi, ss.frames - 1)].slice();
		}
	}
	if (op.delay !== null) st.delay[op.frame ? op.frame - 1 : 0] = op.delay;
}

/** The Description text for a sheet laid out one cell per column, states in order (see sheetCells). */
export function dmiDescription(icon: IconImage): string {
	let d = `# BEGIN DMI\nversion = 4.0\n\twidth = ${icon.width}\n\theight = ${icon.height}\n`;
	for (const s of icon.states) {
		d += `state = "${s.name.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"\n\tdirs = ${s.dirs}\n\tframes = ${s.frames}\n`;
		if (s.frames > 1) d += `\tdelay = ${s.delay.join(",")}\n`;
		if (s.loop) d += `\tloop = ${s.loop}\n`;
		if (s.rewind) d += `\trewind = 1\n`;
		if (s.movement) d += `\tmovement = 1\n`;
	}
	return d + "# END DMI\n";
}

/** Every cell in DMI order (per state: frames outer, dirs inner). */
export function sheetCells(icon: IconImage): Uint8ClampedArray[] {
	const out: Uint8ClampedArray[] = [];
	for (const s of icon.states) for (let f = 0; f < s.frames; f++) for (let d = 0; d < s.dirs; d++) out.push(s.px[d][f]);
	return out;
}
