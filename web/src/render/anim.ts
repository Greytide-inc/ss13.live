// anim - the page side of animate(): turns the steps the worker sends (ViewUpdate.anims) into the
// values an object shows at a given time. Pure functions plus a small state class; no DOM except the
// colour-name fallback. Rules from the BYOND 511 reference ("animate proc"): each step sets vars from the
// value before to the value after over `time` ds; steps chain; loop (-1 = forever); easing curves with
// EASE_IN/EASE_OUT; alpha, color, transform, pixel_x/y, layer and maptext_* interpolate, icon_state and dir
// switch when their step starts; a new animation on an animating object starts from where it is now unless
// ANIMATION_END_NOW; ANIMATION_PARALLEL runs alongside; ANIMATION_LINEAR_TRANSFORM lerps matrices.
// Not modelled: ANIMATION_RELATIVE (the VM sets the absolute value), ANIMATION_CONTINUE/SLICE/END_LOOP,
// JUMP_EASING (drawn linear; tg never uses it or ANIMATION_RELATIVE: an1), luminosity, icon/invisibility/
// maptext changes (snap to the end value at once, as the server's appearance says), the exact BYOND
// matrix decomposition (ours: scale + rotation + translate, straight lerp when a flip or a half turn is involved).

export type AnimValue = number | string | number[] | null;
/** [var name, value before, value after] */
export type StepVar = [string, AnimValue, AnimValue];
export interface Step { ms: number; easing: number; flags: number; vars: StepVar[] }
export interface Seq { t0: number; steps: Step[]; loop: number; total: number }

/** the id animate(client, ...) steps carry in ViewUpdate.anims (objects have ids from 1). */
export const CLIENT_ANIM_ID = -1;

export const ANIMATION_END_NOW = 1, ANIMATION_LINEAR_TRANSFORM = 2, ANIMATION_PARALLEL = 4;
const EASE_IN = 64, EASE_OUT = 128;

/** Appearance field for each animated var; the ones that interpolate, then the ones that switch. */
export const SMOOTH: Record<string, string> = { alpha: "alpha", color: "color", transform: "transform", pixel_x: "pixelX", pixel_y: "pixelY", pixel_z: "pixelZ", pixel_w: "pixelW", layer: "layer", maptext_width: "maptextWidth", maptext_height: "maptextHeight", maptext_x: "maptextX", maptext_y: "maptextY" };
export const SWITCH: Record<string, string> = { icon_state: "iconState", dir: "dir" };

/** pixel_w / pixel_z sit inside an appearance's pixelX / pixelY (appearance.ts); with any of the four animating, put the sum together again (each var animates alone). Sets `out` in place. */
export function foldPixels(out: { pixelX: number; pixelY: number; pixelW?: number; pixelZ?: number }, vals: Map<string, AnimValue>): void {
	if (!(vals.has("pixel_x") || vals.has("pixel_w") || vals.has("pixel_y") || vals.has("pixel_z"))) return;
	const w0 = out.pixelW ?? 0, z0 = out.pixelZ ?? 0, n = (k: string, d: number) => { const v = vals.get(k); return typeof v === "number" ? v : d; };
	out.pixelX = n("pixel_x", out.pixelX - w0) + n("pixel_w", w0);
	out.pixelY = n("pixel_y", out.pixelY - z0) + n("pixel_z", z0);
}

// ---- easing ----
const bounceOut = (t: number): number => {
	const n = 7.5625, d = 2.75;
	if (t < 1 / d) return n * t * t;
	if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
	if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
	return n * (t -= 2.625 / d) * t + 0.984375;
};
/** The "in" half of each curve (0 -> 1, slow start). */
const curveIn = (type: number, t: number): number => {
	switch (type) {
		case 1: return 1 - Math.cos((t * Math.PI) / 2); // SINE
		case 2: return 1 - Math.sqrt(1 - t * t); // CIRCULAR
		case 3: return t * t * t; // CUBIC
		case 4: return 1 - bounceOut(1 - t); // BOUNCE
		case 5: return t === 0 || t === 1 ? t : -Math.pow(2, 10 * t - 10) * Math.sin(((10 * t - 10.75) * 2 * Math.PI) / 3); // ELASTIC
		case 6: return t * t * (2.70158 * t - 1.70158); // BACK
		case 7: return t * t; // QUAD
		default: return t; // LINEAR (and JUMP, not modelled)
	}
};
/** Eased progress for t in 0..1. Neither EASE_IN nor EASE_OUT (or both) = the whole curve; bounce and elastic default to EASE_OUT. */
export function ease(easing: number, t: number): number {
	const type = easing & 63;
	if (type === 0) return t;
	let inn = (easing & EASE_IN) !== 0, out = (easing & EASE_OUT) !== 0;
	if (!inn && !out && (type === 4 || type === 5)) out = true;
	if (inn && !out) return curveIn(type, t);
	if (out && !inn) return 1 - curveIn(type, 1 - t);
	return t < 0.5 ? curveIn(type, 2 * t) / 2 : 1 - curveIn(type, 2 * (1 - t)) / 2;
}

// ---- values ----
let scratch: CanvasRenderingContext2D | null = null;
const colorCache = new Map<string, number[]>();
/** A colour string as [r, g, b, a] (0-255, a 0-1). Hex forms directly; names through a canvas. */
export function parseColor(c: string): number[] {
	let r = colorCache.get(c);
	if (r) return r;
	let h = c;
	if (h[0] !== "#" && typeof document !== "undefined") { scratch ??= document.createElement("canvas").getContext("2d")!; scratch.fillStyle = "#000"; scratch.fillStyle = h; h = scratch.fillStyle; }
	const m = /^#([0-9a-f]{3,8})$/i.exec(h);
	let x = m ? m[1] : "ffffff";
	if (x.length === 3 || x.length === 4) x = [...x].map((d) => d + d).join("");
	r = [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), x.length >= 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1];
	if (colorCache.size < 200) colorCache.set(c, r);
	return r;
}
const hex2 = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");

const decompose = (m: number[]) => { const sx = Math.hypot(m[0], m[3]); return { sx, sy: sx ? (m[0] * m[4] - m[1] * m[3]) / sx : 0, th: Math.atan2(m[3], m[0]) }; };
function lerpMatrix(a: number[], b: number[], k: number, linear: boolean): number[] {
	const lin = (): number[] => a.map((v, i) => v + (b[i] - v) * k);
	if (linear) return lin();
	const p = decompose(a), q = decompose(b);
	let dth = q.th - p.th;
	if (dth > Math.PI) dth -= 2 * Math.PI; else if (dth < -Math.PI) dth += 2 * Math.PI;
	if (Math.abs(dth) > 3 || p.sy * q.sy <= 0 || !p.sx || !q.sx) return lin(); // a flip or a half turn: straight lerp (a coin narrows, it doesn't spin round)
	const sx = p.sx + (q.sx - p.sx) * k, sy = p.sy + (q.sy - p.sy) * k, th = p.th + dth * k;
	// The translate turns with the rotation (BYOND's Turn rotates a matrix's translate too, so a translated-then-spun matrix
	// is a circle, not a chord): take each end's translate back out of its rotation, lerp that, rotate by the lerped angle.
	const ux = (m: number[], t: number) => m[2] * Math.cos(t) + m[5] * Math.sin(t), uy = (m: number[], t: number) => -m[2] * Math.sin(t) + m[5] * Math.cos(t);
	const tx = ux(a, p.th) + (ux(b, q.th) - ux(a, p.th)) * k, ty = uy(a, p.th) + (uy(b, q.th) - uy(a, p.th)) * k;
	const cx = tx * Math.cos(th) - ty * Math.sin(th), cy = tx * Math.sin(th) + ty * Math.cos(th);
	return [sx * Math.cos(th), -sy * Math.sin(th), cx, sx * Math.sin(th), sy * Math.cos(th), cy];
}
const IDENT = [1, 0, 0, 0, 1, 0];

/** The value between `from` and `to` at eased progress k, for a smooth var. */
export function lerpValue(name: string, from: AnimValue, to: AnimValue, k: number, flags: number): AnimValue {
	if (k === 1) return to; // not >=: ELASTIC and BACK overshoot past 1 (an1)
	if (name === "transform") return lerpMatrix((from as number[] | null) ?? IDENT, (to as number[] | null) ?? IDENT, k, (flags & ANIMATION_LINEAR_TRANSFORM) !== 0);
	if (name === "color") {
		if (Array.isArray(from) && Array.isArray(to) && from.length === to.length) return from.map((v, i) => v + (to[i] - v) * k);
		if ((typeof from === "string" || from === null) && (typeof to === "string" || to === null)) {
			const a = parseColor(from ?? "#ffffff"), b = parseColor(to ?? "#ffffff");
			return "#" + [0, 1, 2].map((i) => hex2(a[i] + (b[i] - a[i]) * k)).join("");
		}
		return from; // a string and a matrix: no way to lerp, hold until the step ends
	}
	if (typeof from !== "number" || typeof to !== "number") return to;
	const v = from + (to - from) * k;
	return name === "alpha" ? Math.max(0, Math.min(255, v)) : v; // an overshooting ease (ELASTIC, BACK) can't make alpha leave 0..255
}

// ---- sequences ----
export function newSeq(t0: number, loop: number): Seq { return { t0, steps: [], loop, total: 0 }; }
export function addStep(s: Seq, step: Step): void { s.steps.push(step); s.total += step.ms; }

/** What a sequence shows at `now` (ms): appearance-var -> value, or null when it has finished. */
export function seqValues(s: Seq, now: number): Map<string, AnimValue> | null {
	let e = now - s.t0;
	if (e < 0) e = 0;
	if (s.total <= 0) { if (e > 0 || s.loop !== -1) return null; e = 0; }
	else if (s.loop !== -1 && e >= s.total * Math.max(1, s.loop)) return null;
	else e %= s.total;
	let cur = 0, start = 0;
	while (cur < s.steps.length - 1 && e >= start + s.steps[cur].ms) start += s.steps[cur++].ms;
	const st = s.steps[cur];
	const frac = st.ms > 0 ? Math.min(1, (e - start) / st.ms) : 1;
	const out = new Map<string, AnimValue>();
	const names = new Set<string>();
	for (const x of s.steps) for (const v of x.vars) names.add(v[0]);
	for (const n of names) {
		let idx = -1;
		for (let i = cur; i >= 0; i--) if (s.steps[i].vars.some((v) => v[0] === n)) { idx = i; break; }
		if (idx < 0) { // not yet reached: what it was before its first step
			for (let i = cur + 1; i < s.steps.length; i++) { const v = s.steps[i].vars.find((w) => w[0] === n); if (v) { out.set(n, v[1]); break; } }
			continue;
		}
		const v = s.steps[idx].vars.find((w) => w[0] === n)!;
		if (idx < cur || !(n in SMOOTH)) out.set(n, v[2]);
		else out.set(n, lerpValue(n, v[1], v[2], ease(st.easing, frac), st.flags));
	}
	return out;
}

/** The animations on one object. `feed` takes one "a" event; `values` merges what its sequences show now. */
export class ObjectAnims {
	seqs: Seq[] = [];
	/** An animate() step. `fresh` starts a new animation (replacing running ones unless PARALLEL); else it adds a step to the last sequence. */
	step(now: number, fresh: boolean, ms: number, loop: number, easing: number, flags: number, vars: StepVar[]): void {
		const step: Step = { ms: ms * 100, easing, flags, vars };
		if (!fresh && this.seqs.length) { addStep(this.seqs[this.seqs.length - 1], step); return; }
		if (!(flags & ANIMATION_PARALLEL)) {
			if (!(flags & ANIMATION_END_NOW)) { // start from where they are now, not from the values the server already snapped to
				const cur = this.values(now);
				for (const v of vars) if (cur.has(v[0])) v[1] = cur.get(v[0])!;
			}
			this.seqs = [];
		}
		if (!vars.length && ms === 0) return; // animate(O): nothing to do, the old animation ended
		const s = newSeq(now, loop);
		addStep(s, step);
		this.seqs.push(s);
	}
	/** Drops finished sequences; the merged values of the rest. */
	values(now: number): Map<string, AnimValue> {
		const out = new Map<string, AnimValue>();
		this.seqs = this.seqs.filter((s) => {
			const m = seqValues(s, now);
			if (m) for (const [k, v] of m) out.set(k, v);
			return m !== null;
		});
		return out;
	}
}
