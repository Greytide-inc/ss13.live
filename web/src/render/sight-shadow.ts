// sight-shadow (plans/archive/sight-shadows.md) - Which tiles block sight round the eye, as the server sends them (`opq` in a view update), and how
// much of each tile a straight line from the eye reaches past them: the page's own line of sight, worked out from where it draws the eye.
// Tile (i, j) of a box covers [i, i+1] x [j, j+1]; the eye is a point in the same units (the eye tile's centre is ex + 0.5, ey + 0.5).

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** `opq` on the wire: [x0, y0, w, h, bits, seen bits], bits 6 tiles a character (tile k = x + y * w is bit k % 6 of character k / 6).
 *  bits: the tile blocks sight; seen bits (the "smoothed tg" look): the server's tile rules show the tile (ClientSight.vis). */
export type Opq = [number, number, number, number, string, string?];

const packBits = (n: number, on: Uint8Array): string => {
	let s = "";
	for (let k = 0; k < n; k += 6) {
		let v = 0;
		for (let b = 0; b < 6 && k + b < n; b++) if (on[k + b]) v |= 1 << b;
		s += B64[v];
	}
	return s;
};
const unpackBits = (n: number, s: string): Uint8Array => {
	const on = new Uint8Array(n);
	for (let k = 0; k < n; k++) on[k] = (B64.indexOf(s[(k / 6) | 0]) >> k % 6) & 1;
	return on;
};

export function packOpacity(x0: number, y0: number, w: number, h: number, opaque: Uint8Array, vis?: Uint8Array): Opq {
	const p: Opq = [x0, y0, w, h, packBits(w * h, opaque)];
	if (vis && vis.length === w * h) p.push(packBits(w * h, vis));
	return p;
}

export function unpackOpacity(p: Opq): { x0: number; y0: number; w: number; h: number; opaque: Uint8Array; vis: Uint8Array | null } {
	const [x0, y0, w, h, s, v] = p;
	return { x0, y0, w, h, opaque: unpackBits(w * h, s), vis: v ? unpackBits(w * h, v) : null };
}

/** Whether the straight line from (px, py) to (qx, qy), a point inside tile (tx, ty), crosses no opaque tile on the way. The start and end
 *  tiles don't count (a wall's own face shows); a line through the exact corner between two opaque tiles is blocked (walls that meet
 *  diagonally leave no gap). Tiles outside the box are clear. */
export function lineClear(opaque: Uint8Array, w: number, h: number, px: number, py: number, qx: number, qy: number, tx: number, ty: number): boolean {
	const at = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && opaque[x + y * w] === 1;
	let cx = Math.floor(px), cy = Math.floor(py);
	const dx = qx - px, dy = qy - py, sx = dx > 0 ? 1 : -1, sy = dy > 0 ? 1 : -1;
	const tdx = dx !== 0 ? 1 / Math.abs(dx) : Infinity, tdy = dy !== 0 ? 1 / Math.abs(dy) : Infinity;
	let tmx = dx > 0 ? (cx + 1 - px) * tdx : dx < 0 ? (px - cx) * tdx : Infinity;
	let tmy = dy > 0 ? (cy + 1 - py) * tdy : dy < 0 ? (py - cy) * tdy : Infinity;
	while (cx !== tx || cy !== ty) {
		if (Math.min(tmx, tmy) > 1) return true; // the end point isn't in (tx, ty): stop at it anyway
		if (Math.abs(tmx - tmy) < 1e-9) {
			if (at(cx + sx, cy) && at(cx, cy + sy)) return false;
			cx += sx; cy += sy; tmx += tdx; tmy += tdy;
		} else if (tmx < tmy) { cx += sx; tmx += tdx; }
		else { cy += sy; tmy += tdy; }
		if ((cx !== tx || cy !== ty) && at(cx, cy)) return false;
	}
	return true;
}

/** The shadows an eye point (px, py) casts in the box: per opaque tile that has a clear tile beside it (a wall inside a block of walls is
 *  in its neighbours' shadow anyway), the region behind it as seen from the point, the tile itself left out (its face shows), as flat
 *  [x, y, ...] polygons, pushed onto out. A spot is in shadow when one of them covers it: the same as !lineClear. Each tile is grown by
 *  `grow` so two walls meeting at a corner leave no hairline gap. Tiles the point is in cast nothing (lineClear's start tile). */
export function shadowPolys(opaque: Uint8Array, w: number, h: number, px: number, py: number, out: number[][] = [], grow = 0.001): number[][] {
	const at = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && opaque[x + y * w] === 1;
	const far = 4 * (w + h);
	for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++) {
		if (!at(tx, ty) || (at(tx - 1, ty) && at(tx + 1, ty) && at(tx, ty - 1) && at(tx, ty + 1))) continue;
		const x0 = tx - grow, x1 = tx + 1 + grow, y0 = ty - grow, y1 = ty + 1 + grow;
		if (px >= x0 && px <= x1 && py >= y0 && py <= y1) continue;
		// corners counter-clockwise; the two on the outline as seen from the point (A, B) and the chain between them on the far side
		const c = [x0, y0, x1, y0, x1, y1, x0, y1];
		const ax = tx + 0.5 - px, ay = ty + 0.5 - py;
		let ia = 0, ib = 0, lo = Infinity, hi = -Infinity;
		for (let i = 0; i < 4; i++) {
			const dx = c[2 * i] - px, dy = c[2 * i + 1] - py, s = Math.atan2(ax * dy - ay * dx, ax * dx + ay * dy); // the angle from the centre's direction, counter-clockwise +
			if (s < lo) { lo = s; ia = i; }
			if (s > hi) { hi = s; ib = i; }
		}
		// walking counter-clockwise from A to B passes the far side (A is the clockwise-most outline corner)
		const poly: number[] = [];
		for (let i = ia; ; i = (i + 1) % 4) { poly.push(c[2 * i], c[2 * i + 1]); if (i === ib) break; }
		for (const i of [ib, ia]) {
			const dx = c[2 * i] - px, dy = c[2 * i + 1] - py, k = far / Math.hypot(dx, dy);
			poly.push(c[2 * i] + dx * k, c[2 * i + 1] + dy * k);
		}
		out.push(poly);
	}
	return out;
}

/** Whether (x, y) is inside the flat polygon p (even-odd). */
export function inPoly(p: number[], x: number, y: number): boolean {
	let inside = false;
	for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
		const xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/** How strong the page draws the sight shadow for a mob's `sight` flags (plans/archive/sight-shadows.md, player forms): 1 = full; DIM with mesons or
 *  thermals (SEE_TURFS, SEE_OBJS or SEE_MOBS but not all three: what they show through walls stays readable); 0 = none, when the server sent
 *  no opacity box (`hasBox` false: ghosts and the AI see through everything, the blind see nothing). */
export const SHADOW_DIM = 0.5;
export function shadowStrength(sight: number, hasBox: boolean): number {
	if (!hasBox) return 0;
	const x = sight & (4 | 8 | 16); // SEE_MOBS | SEE_OBJS | SEE_TURFS
	return x === 28 ? 0 : x ? SHADOW_DIM : 1;
}

/** The soft shadows (plans/archive/sight-shadows.md, rule 2): the eye is N x N points spread over a tile-sized square round the drawn eye
 *  (ex, ey); a spot is fully lit once a 1/GAIN share of them see it, and darker the fewer do. */
export const SOFT_N = 4, SOFT_GAIN = 4;
export function eyePoints(ex: number, ey: number, n = SOFT_N): [number, number][] {
	const out: [number, number][] = [];
	for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) out.push([ex - 0.5 + (i + 0.5) / n, ey - 0.5 + (j + 0.5) / n]);
	return out;
}
/** The darkness (0 = lit, 1 = black) at (x, y), given each eye point's shadows (shadowPolys). */
export function softDark(shadows: number[][][], x: number, y: number, gain = SOFT_GAIN): number {
	let seen = 0;
	for (const polys of shadows) if (!polys.some((p) => inPoly(p, x, y))) seen++;
	return 1 - Math.min(1, (gain * seen) / shadows.length);
}

/** Per tile of the box, the share of it (n x n points spread over it) a line from the eye at (ex, ey) reaches: 0 = all in shadow, 1 = none. */
export function litShare(opaque: Uint8Array, w: number, h: number, ex: number, ey: number, n = 4): Float32Array {
	const out = new Float32Array(w * h);
	for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++) {
		let lit = 0;
		for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (lineClear(opaque, w, h, ex, ey, tx + (i + 0.5) / n, ty + (j + 0.5) / n, tx, ty)) lit++;
		out[tx + ty * w] = lit / (n * n);
	}
	return out;
}

/** The sight shadow looks a player can pick (the ⚙ panel's Game section): "tg" = none, tg's hard black squares as they are; "smooth" = tg's
 *  squares with hard diagonal steps (tgDark with no fade, pixel sharp: sight-shadow-paint.ts); "full" = the cast shadows (softDark). */
export type ShadowMode = "tg" | "smooth" | "full";
export const SHADOW_FEATHER = 0.2; // the smooth look's fade, in tiles

/** The smooth look's darkness (0 = lit, 1 = black) at (qx, qy), from the tiles the server shows (vis) and blocks sight (opaque), box units:
 *  a hidden tile is black; a floor tile tg shows fades to black towards each hidden tile beside it (8 ways, so corners round off) over
 *  `feather` of a tile; with hidden tiles on two sides that meet (the inside corner of a black staircase) it also gets a black half-tile
 *  triangle in that corner, so the steps read as a slope. Walls tg shows get no fade (tg shows a wall whole). Outside the box is hidden. */
export function tgDark(vis: Uint8Array, opaque: Uint8Array, w: number, h: number, qx: number, qy: number, feather = SHADOW_FEATHER): number {
	const hid = (x: number, y: number) => x < 0 || y < 0 || x >= w || y >= h || vis[x + y * w] === 0;
	const x = Math.floor(qx), y = Math.floor(qy);
	if (hid(x, y)) return 1;
	if (opaque[x + y * w]) return 0;
	let d = Infinity;
	for (let ny = y - 1; ny <= y + 1; ny++) for (let nx = x - 1; nx <= x + 1; nx++) {
		if (!hid(nx, ny) && !opaque[nx + ny * w]) { // its staircase corners: the points with |u - cx| + |v - cy| <= 1 (u, v in the tile)
			for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
				if (!hid(nx + sx, ny) || !hid(nx, ny + sy)) continue;
				const cx = sx > 0 ? 1 : 0, cy = sy > 0 ? 1 : 0;
				const u = Math.min(Math.max(qx - nx, 0), 1), v = Math.min(Math.max(qy - ny, 0), 1);
				const out = Math.hypot(qx - nx - u, qy - ny - v), k = Math.abs(u - cx) + Math.abs(v - cy) - 1;
				d = Math.min(d, k <= 0 ? out : Math.hypot(out, k / Math.SQRT2));
			}
		}
		if ((nx === x && ny === y) || !hid(nx, ny)) continue;
		d = Math.min(d, Math.hypot(Math.max(nx - qx, 0, qx - (nx + 1)), Math.max(ny - qy, 0, qy - (ny + 1))));
	}
	if (d <= 0) return 1;
	if (feather <= 0 || d >= feather) return 0;
	const f = 1 - d / feather;
	return f * f * (3 - 2 * f); // smooth, not a straight ramp
}

/** The smoothed tg look per tile, tgDark with no fade: HARD_HIDDEN = all black (tg hides it); else bits of the staircase corners of a
 *  shown floor tile, black half-tile triangles (bit cx + 2 * cy for its corner (cx, cy)); 0 = clear. */
export const HARD_HIDDEN = 16;
export function hardTile(vis: Uint8Array, opaque: Uint8Array, w: number, h: number, tx: number, ty: number): number {
	const hid = (x: number, y: number) => x < 0 || y < 0 || x >= w || y >= h || vis[x + y * w] === 0;
	if (hid(tx, ty)) return HARD_HIDDEN;
	if (opaque[tx + ty * w]) return 0;
	let bits = 0;
	for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) if (hid(tx + sx, ty) && hid(tx, ty + sy)) bits |= 1 << ((sx > 0 ? 1 : 0) + 2 * (sy > 0 ? 1 : 0));
	return bits;
}
/** Whether (u, v) in a tile (0..1, y up) is in one of the corner triangles `bits` (hardTile): |u - cx| + |v - cy| <= 1. */
export function inCorners(bits: number, u: number, v: number): boolean {
	for (let i = 0; i < 4; i++) if (bits & (1 << i) && Math.abs(u - (i & 1)) + Math.abs(v - (i >> 1)) <= 1) return true;
	return false;
}
