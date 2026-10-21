// view-los (los1): BYOND's view() visibility for one box of tiles around an eye. Shared by view()/oview()/
// viewers()/hearers() (world.ts) and the live page's view (worker/client-view.ts), so both hide the same tiles.
//
// Line of sight follows Lummox JR's description (https://www.byond.com/forum/post/2130277, as ported by
// OpenDream's ViewAlgorithm.cs): a diagonal shadow pass (rings by max(|dx|,|dy|)), a straight shadow pass
// (diamonds by |dx|+|dy|), then opaque "wall" and "corner" tiles next to visible tiles are shown too.
// Darkness was measured in BYOND 511 (web/tests/dm/zz_view_los.dm, 120 random dark maps in web/build/los):
//  - a tile is seen if its area is luminous, or light reaches it, or the viewer's see_in_dark does;
//  - an atom with luminosity L lights its tile and spreads L-1 steps (8-way) through clear tiles, whether or not
//    the viewer sees them; an opaque tile it reaches is lit only when the clear tile it came from is in the
//    viewer's line of sight (a wall lit from behind stays dark), and it spreads no further (unless it is a source);
//  - see_in_dark N works exactly like a light of luminosity N on the eye's tile that only the viewer sees.
// Two details beyond Lummox's text, fitted to the BYOND measurements (242 lit and 150 dark random maps, 0 tiles off):
//  - cells of the box past the map edge count as clear, lit tiles (they are never reported);
//  - the wall/corner pass walks rows north to south, west to east; a tile it marks counts at once for the corner
//    test of later tiles, but the wall test (both E+W or N+S seen) only looks at the line-of-sight result.

/** One view box, filled by the caller. Index = x + y * w, eye at (ex, ey). */
export interface LosBox {
	w: number;
	h: number;
	ex: number;
	ey: number;
	opaque: Uint8Array;
	/** Highest luminosity of the turf and the movables on it. */
	lamp: Int32Array;
	/** 1 if the tile's area is luminous (lit regardless). */
	areaLit: Uint8Array;
}

export function newLosBox(w: number, h: number): LosBox {
	const n = w * h;
	return { w, h, ex: (w - 1) >> 1, ey: (h - 1) >> 1, opaque: new Uint8Array(n), lamp: new Int32Array(n), areaLit: new Uint8Array(n) };
}

/** view() runs thousands of times a second: its boxes and work arrays are kept per box size (they never leave one call). */
interface Scratch { box: LosBox; vis: Int32Array; vis2: Int32Array; lamp: Int32Array; src: Uint8Array; litO: Uint8Array; los: Int32Array }
const scratchBySize = new Map<number, Scratch>();
function scratchFor(w: number, h: number): Scratch {
	const key = w * 65536 + h;
	let s = scratchBySize.get(key);
	if (s === undefined) {
		const n = w * h;
		s = { box: newLosBox(w, h), vis: new Int32Array(n), vis2: new Int32Array(n), lamp: new Int32Array(n), src: new Uint8Array(n), litO: new Uint8Array(n), los: new Int32Array(n) };
		scratchBySize.set(key, s);
	}
	return s;
}

/** a cleared box of this size that's reused by the next call (for a box used once, at once: world.ts viewBox). */
export function scratchLosBox(w: number, h: number): LosBox {
	const b = scratchFor(w, h).box;
	b.opaque.fill(0);
	b.lamp.fill(0);
	b.areaLit.fill(0);
	return b;
}

/**
 * Visibility for every tile of the box: nonzero = visible. ignoreLight: line of sight only (hearers()).
 * reuse (gc1): the result is a shared array that the next reuse call of the same size overwrites.
 */
export function computeLos(b: LosBox, seeInDark: number, ignoreLight: boolean, reuse = false): Int32Array {
	const { w: W, h: H, ex, ey, opaque: O } = b;
	const n = W * H;
	const sc = scratchFor(W, H);
	const vis = reuse ? sc.vis.fill(0) : new Int32Array(n);
	const vis2 = sc.vis2.fill(0);
	const nb = (arr: Int32Array, x: number, y: number, d: number): boolean => {
		const x0 = x > 0 ? x - 1 : 0, x1 = x < W - 1 ? x + 1 : W - 1, y0 = y > 0 ? y - 1 : 0, y1 = y < H - 1 ? y + 1 : H - 1;
		for (let ny = y0; ny <= y1; ny++) for (let nx = x0; nx <= x1; nx++) {
			const k = nx + ny * W;
			if (arr[k] === d && (nx !== x || ny !== y)) return true;
		}
		return false;
	};
	// Diagonal shadow loop: rings of max(|dx|,|dy|) = d+1.
	const maxDepth = Math.max(W - ex, H - ey);
	for (let d = 0; d < maxDepth; d++) {
		const lx = ex - d - 1, ux = ex + d + 1, uy = ey + d + 1;
		for (let x = Math.max(lx, 0); x <= Math.min(ux, W - 1); x++) {
			const skip = x !== lx && x !== ux;
			let y = ey - d - 1;
			if (y < 0) y = skip ? uy : 0;
			while (y <= uy && y < H) {
				const k = x + y * W;
				if (nb(vis2, x, y, d)) vis2[k] = O[k] ? -1 : d + 1;
				if (skip && y !== uy) y = uy;
				else y++;
			}
		}
	}
	// Straight shadow loop: diamonds of |dx|+|dy| = d+1.
	const sumDepth = (W - ex) + (H - ey);
	for (let d = 0; d < sumDepth; d++) {
		const lx = Math.max(ex - d - 1, 0), ux = Math.min(ex + d + 1, W - 1);
		for (let x = lx; x <= ux; x++) {
			const oy = d + 1 - Math.abs(ex - x);
			for (let s = 0; s < (oy !== 0 ? 2 : 1); s++) {
				const y = s === 0 ? ey - oy : ey + oy;
				if (y < 0 || y >= H) continue;
				const k = x + y * W;
				if (!nb(vis, x, y, d)) continue;
				if (O[k]) vis[k] = -1;
				else if (vis2[k] !== 0) vis[k] = d + 1;
			}
		}
	}
	const e = ex + ey * W;
	vis[e] = 1;

	let allLit = true;
	for (let k = 0; k < n && allLit; k++) if (!b.areaLit[k]) allLit = false;
	if (!ignoreLight && !allLit) {
		// Light: lamp values spread one step less per tile through clear tiles (see the header).
		const lamp = sc.lamp, src = sc.src.fill(0), litO = sc.litO.fill(0);
		lamp.set(b.lamp);
		const cap = W + H + 2;
		let maxL = 0;
		for (let k = 0; k < n; k++) if (lamp[k] > 0) { if (lamp[k] > cap) lamp[k] = cap; src[k] = 1; if (lamp[k] > maxL) maxL = lamp[k]; }
		if (seeInDark > 0) { const s = Math.min(seeInDark, cap); if (s > lamp[e]) lamp[e] = s; src[e] = 1; if (s > maxL) maxL = s; }
		for (let L = maxL; L >= 2; L--) {
			for (let k = 0; k < n; k++) {
				if (lamp[k] !== L || (O[k] && !src[k])) continue;
				const x = k % W, y = (k - x) / W;
				for (let ny = Math.max(y - 1, 0); ny <= Math.min(y + 1, H - 1); ny++) for (let nx = Math.max(x - 1, 0); nx <= Math.min(x + 1, W - 1); nx++) {
					const m = nx + ny * W;
					if (m === k) continue;
					if (O[m]) { if (vis[k] !== 0) litO[m] = 1; }
					else if (lamp[m] < L - 1) lamp[m] = L - 1;
				}
			}
		}
		for (let k = 0; k < n; k++) if (!b.areaLit[k] && lamp[k] === 0 && !litO[k]) vis[k] = 0;
	}

	// Walls and corners: an unseen opaque tile between seen tiles is shown (see the header for the order).
	const los = sc.los;
	los.set(vis);
	const corner = (x: number, y: number, dx: number, dy: number): boolean => {
		const X = x + dx, Y = y + dy;
		if (X < 0 || Y < 0 || X >= W || Y >= H) return false;
		return vis[X + Y * W] !== 0 && vis[x + Y * W] !== 0 && vis[X + y * W] !== 0 && O[x + Y * W] === 1 && O[X + y * W] === 1 && O[X + Y * W] === 0;
	};
	for (let y = H - 1; y >= 0; y--) for (let x = 0; x < W; x++) {
		const k = x + y * W;
		if (!O[k] || vis[k] !== 0) continue;
		if ((x !== 0 && x !== W - 1 && los[k - 1] !== 0 && los[k + 1] !== 0) || (y !== 0 && y !== H - 1 && los[k - W] !== 0 && los[k + W] !== 0)
			|| corner(x, y, 1, 1) || corner(x, y, 1, -1) || corner(x, y, -1, -1) || corner(x, y, -1, 1)) vis[k] = -1;
	}
	return vis;
}

/** The same box without its outer m rings (the eye stays in the middle). */
export function cropLosBox(b: LosBox, m: number): LosBox {
	const w = b.w - 2 * m, h = b.h - 2 * m, c = newLosBox(w, h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const k = x + y * w, s = x + m + (y + m) * b.w;
		c.opaque[k] = b.opaque[s];
		c.lamp[k] = b.lamp[s];
		c.areaLit[k] = b.areaLit[s];
	}
	return c;
}
