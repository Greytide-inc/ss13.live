// sight-shadow-paint (plans/archive/sight-shadows.md step 3) - Paints the soft sight shadows for the box the server sent (`opq`) from where the
// page draws the eye: per eye point (eyePoints) its shadows (shadowPolys) filled on a scratch canvas, added up at 1/16 each, then turned
// into darkness (softDark's rule, one value per pixel) on a small canvas, `res` pixels a tile; the backend stretches it over the map (smooth).
// The smoothed tg look (mode "smooth") is tg's black squares with hard diagonal steps (hardTile per tile: black, or stamps of its corner triangles), one canvas pixel per game pixel and
// drawn unsmoothed (crisp), from the box alone: painted again only when the box changes, never as the eye moves.
// A wall is drawn whole, as lit as its most lit pixel: its neighbours' shadows cut its face into a sawtooth, and tg shows a wall all or nothing.

import { eyePoints, HARD_HIDDEN, hardTile, inCorners, shadowPolys, SOFT_GAIN, unpackOpacity, type Opq, type ShadowMode } from "./sight-shadow.js";

const RES = Number(new URLSearchParams(globalThis.location?.search).get("shadowres")) || 4; // ?shadowres=8: a finer shadow picture

export interface ShadowPaint {
	canvas: HTMLCanvasElement;
	/** bumped each time the canvas is painted again */
	version: number;
	/** the box's south-west tile (world x, y) and size in tiles */
	x0: number; y0: number; w: number; h: number;
	/** px per tile on the canvas */
	res: number;
	/** the last paint's time (ms) */
	ms: number;
	/** drawn with hard pixel edges (nearest), not stretched smooth */
	crisp?: boolean;
}

const HARD_RES = 32; // the game's pixels per tile

function hardPainter(): (opq: Opq) => ShadowPaint {
	const out: ShadowPaint = { canvas: document.createElement("canvas"), version: 0, x0: 0, y0: 0, w: 0, h: 0, res: HARD_RES, ms: 0, crisp: true };
	const oc = out.canvas.getContext("2d")!, res = HARD_RES;
	// one 32 x 32 stamp per set of staircase corners (hardTile's bits), made the first time it's needed: the triangles' pixels, black
	const stamps = new Map<number, HTMLCanvasElement>();
	const stampOf = (bits: number): HTMLCanvasElement => {
		let c = stamps.get(bits);
		if (c) return c;
		c = document.createElement("canvas"); c.width = c.height = res;
		const sc = c.getContext("2d")!, img = sc.createImageData(res, res);
		for (let r = 0; r < res; r++) for (let col = 0; col < res; col++) if (inCorners(bits, (col + 0.5) / res, 1 - (r + 0.5) / res)) img.data[(r * res + col) * 4 + 3] = 255;
		sc.putImageData(img, 0, 0);
		stamps.set(bits, c);
		return c;
	};
	let key = "";
	return (opq) => {
		const k = opq.join();
		if (k === key) return out;
		key = k;
		const t0 = performance.now(), b = unpackOpacity(opq), W = b.w * res, H = b.h * res;
		if (out.canvas.width !== W || out.canvas.height !== H) { out.canvas.width = W; out.canvas.height = H; } else oc.clearRect(0, 0, W, H);
		oc.fillStyle = "#000";
		if (b.vis) for (let ty = 0; ty < b.h; ty++) for (let tx = 0; tx < b.w; tx++) {
			const t = hardTile(b.vis, b.opaque, b.w, b.h, tx, ty), x = tx * res, y = (b.h - 1 - ty) * res;
			if (t === HARD_HIDDEN) oc.fillRect(x, y, res, res);
			else if (t) oc.drawImage(stampOf(t), x, y);
		}
		Object.assign(out, { x0: b.x0, y0: b.y0, w: b.w, h: b.h, version: out.version + 1, ms: performance.now() - t0 });
		return out;
	};
}

export function shadowPainter(res = RES): { paint(opq: Opq, eyeX: number, eyeY: number, mode?: ShadowMode): ShadowPaint } {
	const mk = () => document.createElement("canvas");
	const acc = mk(), tmp = mk(), out: ShadowPaint = { canvas: mk(), version: 0, x0: 0, y0: 0, w: 0, h: 0, res, ms: 0 };
	const ac = acc.getContext("2d", { willReadFrequently: true })!, tc = tmp.getContext("2d")!, oc = out.canvas.getContext("2d")!;
	let box: ReturnType<typeof unpackOpacity> | null = null, boxKey = "", key = "";
	let img: ImageData | null = null;
	const hard = hardPainter();
	return {
		/** eyeX, eyeY: the drawn eye in world tiles (the eye tile's centre is x + 0.5, y + 0.5). Paints again only when the box or the eye moved. */
		paint(opq, eyeX, eyeY, mode = "full") {
			if (mode === "smooth") return hard(opq);
			const k = opq.join();
			if (k !== boxKey) { boxKey = k; box = unpackOpacity(opq); }
			const b = box!, ex = eyeX - b.x0, ey = eyeY - b.y0, now = `${k}|${Math.round(ex * 32)},${Math.round(ey * 32)}`;
			if (now === key) return out;
			key = now;
			const t0 = performance.now();
			const W = b.w * res, H = b.h * res;
			if (acc.width !== W || acc.height !== H) {
				for (const c of [acc, tmp, out.canvas]) { c.width = W; c.height = H; }
				img = oc.createImageData(W, H);
			}
			const pts = eyePoints(ex, ey);
			ac.globalCompositeOperation = "copy"; ac.fillStyle = "#000"; ac.fillRect(0, 0, W, H);
			ac.globalCompositeOperation = "lighter"; ac.globalAlpha = 1 / pts.length;
			tc.fillStyle = "#fff";
			for (const [px, py] of pts) {
				tc.clearRect(0, 0, W, H);
				tc.beginPath(); // one shape (all wound the same way, so they add up, not cancel): separate fills left faint seams where shadows meet
				for (const p of shadowPolys(b.opaque, b.w, b.h, px, py)) {
					tc.moveTo(p[0] * res, (b.h - p[1]) * res);
					for (let i = 2; i < p.length; i += 2) tc.lineTo(p[i] * res, (b.h - p[i + 1]) * res);
					tc.closePath();
				}
				tc.fill();
				ac.drawImage(tmp, 0, 0);
			}
			// shaded / 255 = the share of eye points whose shadow covers the pixel; dark = 1 - min(1, GAIN * seen share)
			const src = ac.getImageData(0, 0, W, H).data, dst = img!.data;
			for (let i = 0; i < src.length; i += 4) {
				const seen = 1 - src[i] / 255;
				dst[i + 3] = Math.round(255 * Math.max(0, 1 - SOFT_GAIN * seen));
			}
			for (let ty = 0; ty < b.h; ty++) for (let tx = 0; tx < b.w; tx++) {
				if (!b.opaque[tx + ty * b.w]) continue;
				const r0 = (b.h - 1 - ty) * res, c0 = tx * res;
				let lo = 255;
				for (let r = r0; r < r0 + res; r++) for (let c = c0; c < c0 + res; c++) lo = Math.min(lo, dst[(r * W + c) * 4 + 3]);
				for (let r = r0; r < r0 + res; r++) for (let c = c0; c < c0 + res; c++) dst[(r * W + c) * 4 + 3] = lo;
			}
			oc.putImageData(img!, 0, 0);
			Object.assign(out, { x0: b.x0, y0: b.y0, w: b.w, h: b.h, version: out.version + 1, ms: performance.now() - t0 });
			return out;
		},
	};
}
