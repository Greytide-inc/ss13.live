// Carried light (client-scene.ts): the light a mob carries (a flashlight in hand) drawn where the page draws the mob, not a ping late.
// The server sends the mob's light sources (power, range, colour), which corners they light and what each of those shows without them
// (client-view.ts carriedLightOf). The page puts the last into the server's lighting tiles (lessLight) and draws the light as lighting
// tiles of its own that stay put in the world: walls cut the light off per tile, so a shape that slid with the mob lit wall corners mid-step
// and then snapped back (the seclite flicker). Which corners it lights (the mask) is the server's and fades from one shape to the next; how
// strongly (strengthAt) follows where the mob is drawn, worked out from the light's power and range as lighting_source.dm does.
// A lighting tile's colour matrix (lighting_object.dm update) holds its four corners' light, a row each: SW, SE, NW, NE (r, g, b, 0).

export interface CarriedSource { power: number; range: number; lum: [number, number, number] }
export interface CarriedLight {
	mob: number;
	sources: CarriedSource[];
	/** the light's colour, its largest channel 1: what strengthAt is a strength of */
	colour: [number, number, number];
	/** the sources' applied turf minus the mob's server tile */
	ax: number; ay: number;
	/** each corner the light reaches (half tiles from the applied turf, odd) -> [r, g, b] it shows without the light */
	bases: Map<number, [number, number, number]>;
	/** the tiles that touch a lit corner, relative to the applied turf */
	tiles: [number, number][];
}

const ck = (cx: number, cy: number): number => (cx + 4096) * 8192 + cy + 4096;

/** u.light as sent: [mob, ax, ay, n, n x (power, range, r, g, b), then per corner cx, cy, r, g, b without it]; null for []. */
export function parseLight(a: number[]): CarriedLight | null {
	if (a.length < 4) return null;
	const sources: CarriedSource[] = [], sum = [0, 0, 0];
	for (let j = 0; j < a[3]; j++) {
		const o = 4 + 5 * j, s: CarriedSource = { power: a[o], range: a[o + 1], lum: [a[o + 2], a[o + 3], a[o + 4]] };
		sources.push(s);
		for (let k = 0; k < 3; k++) sum[k] += s.power * s.lum[k];
	}
	const top = Math.max(...sum), colour: [number, number, number] = top > 0 ? [sum[0] / top, sum[1] / top, sum[2] / top] : [1, 1, 1];
	const start = 4 + 5 * a[3];
	if (a.length < start + 5) return null;
	const bases = new Map<number, [number, number, number]>(), seen = new Set<number>(), tiles: [number, number][] = [];
	for (let i = start; i + 4 < a.length; i += 5) {
		const cx = a[i], cy = a[i + 1];
		bases.set(ck(cx, cy), [a[i + 2], a[i + 3], a[i + 4]]);
		for (const tx of [(cx - 1) / 2, (cx + 1) / 2]) for (const ty of [(cy - 1) / 2, (cy + 1) / 2]) {
			const k = ck(tx, ty);
			if (!seen.has(k)) { seen.add(k); tiles.push([tx, ty]); }
		}
	}
	return { mob: a[0], sources, colour, ax: a[1], ay: a[2], bases, tiles };
}

/** How strongly the light lights corner (cx, cy) (half tiles from the applied turf) with its source at (px, py) (tiles from the applied turf,
 *  fractions mid-step), in `colour`: lighting_source.dm's LUM_FALLOFF, 1 - sqrt(dx^2 + dy^2 + LIGHTING_HEIGHT 1) / max(1, range), times power. */
export function strengthAt(l: CarriedLight, cx: number, cy: number, px: number, py: number): number {
	let n = 0;
	for (const s of l.sources) {
		const f = 1 - Math.sqrt((cx / 2 - px) ** 2 + (cy / 2 - py) ** 2 + 1) / Math.max(1, s.range);
		if (f > 0) n += f * s.power * Math.max(...s.lum);
	}
	return n;
}

/** The tile's corners in matrix row order (SW, SE, NW, NE), as offsets in half tiles from the applied turf. */
export const cornersOf = (tx: number, ty: number): [number, number][] => [[2 * tx - 1, 2 * ty - 1], [2 * tx + 1, 2 * ty - 1], [2 * tx - 1, 2 * ty + 1], [2 * tx + 1, 2 * ty + 1]];

const flat = (k: number): number[] => [k, k, k, 0, k, k, k, 0, k, k, k, 0, k, k, k, 0, 0, 0, 0, 1];

/** The server's lighting matrix for tile (tx, ty) from the applied turf with the carried light taken out: each corner it lights set to what
 *  the corner shows without it. iconState/color: the server tile's look ("transparent" and "dark" are all 1s / all 0s). null: no change. */
export function lessLight(iconState: string, color: unknown, l: CarriedLight, tx: number, ty: number): number[] | null {
	let out: number[];
	if (iconState === "transparent") out = flat(1);
	else if (iconState === "dark") out = flat(0);
	else if (iconState === "" && Array.isArray(color) && color.length >= 16) out = (color as number[]).slice();
	else return null;
	let changed = false;
	cornersOf(tx, ty).forEach(([cx, cy], row) => {
		const b = l.bases.get(ck(cx, cy));
		if (!b) return;
		for (let k = 0; k < 3; k++) out[row * 4 + k] = b[k];
		changed = true;
	});
	return changed ? out : null;
}
