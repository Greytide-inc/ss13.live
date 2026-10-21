// glide.ts - Glides as client-scene draws them: an offset in px (east+ / north+) from where the atom is, moving to a target over ms.
// tx, ty (movement prediction): where the glide ends, if not on the tile itself; it stays there until the server's move comes.
export interface Glide { ox: number; oy: number; t0: number; ms: number; tx?: number; ty?: number }

/** The offset drawn at `now`, or null once the glide is over and ends on the tile itself. */
export const glideAt = (g: Glide, now: number): [number, number] | null => {
	const f = (now - g.t0) / g.ms, tx = g.tx ?? 0, ty = g.ty ?? 0;
	if (f >= 1) return tx || ty ? [tx, ty] : null;
	return [Math.round(tx + (g.ox - tx) * (1 - f)), Math.round(ty + (g.oy - ty) * (1 - f))];
};

/** From where `old` is drawn now to (tx, ty), at `ms` a tile. A diagonal step counts as one tile, as BYOND glides it (glide_size px a tick on
 *  each axis): counted by its length, each diagonal step of a run lost 0.4 tile, and a ghost flying diagonally left its camera tiles behind. */
export const predGlide = (old: Glide | null | undefined, tx: number, ty: number, ms: number, now: number, tilePx: number): Glide => {
	const cur = (old && glideAt(old, now)) ?? [0, 0];
	return { ox: cur[0], oy: cur[1], tx, ty, t0: now, ms: Math.max(1, ms * Math.max(Math.abs(tx - cur[0]), Math.abs(ty - cur[1])) / tilePx) };
};

/** The server moved the atom (dx, dy) tiles: from where `old` is drawn now (mid-glide) to the new tile, at most a tile behind, at `size` px a tick
 *  (glide_size 0 = BYOND's automatic, min 4 px, used as 4) on each axis, as BYOND glides: counted by its length, a diagonal glide took 1.4 steps'
 *  time, fell behind a little more each step, and the "at most a tile behind" cap then snapped it a tile forward every few steps. */
export const serverGlide = (old: Glide | null | undefined, dx: number, dy: number, size: number, now: number, tickMs: number, tilePx: number): Glide => {
	const cur = (old && glideAt(old, now)) ?? [0, 0];
	const ox = Math.max(-tilePx, Math.min(tilePx, cur[0] - dx * tilePx)), oy = Math.max(-tilePx, Math.min(tilePx, cur[1] - dy * tilePx));
	return { ox, oy, t0: now, ms: Math.max(Math.abs(ox), Math.abs(oy)) / (size > 0 ? size : 4) * tickMs };
};
