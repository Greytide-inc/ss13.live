// inherit - overlays follow their owner. Pure, so tests/draw can import it. Used on both sides: the worker builds
// appearances with it (appearance.ts), the page draws with it (client-scene.ts, pixi-sprites.ts).
import type { Appearance } from "./appearance.js";

/** "#rgb" or "#rrggbb" (what the VM stores, vm/look.ts) as [r, g, b]; null for anything else. */
function hexRgb(c: string): number[] | null {
	const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
	if (!m) return null;
	const h = m[1].length === 3 ? [...m[1]].map((d) => d + d).join("") : m[1];
	return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

const RESET_COLOR = 2, RESET_ALPHA = 4, RESET_TRANSFORM = 8;
/** Two plain colors multiplied channel by channel; null if either is a matrix or not hex (unmodelled: the overlay's own then wins). */
function mulColor(a: Appearance["color"], b: Appearance["color"]): string | null {
	if (typeof a !== "string" || typeof b !== "string") return null;
	const x = hexRgb(a), y = hexRgb(b);
	if (!x || !y) return null;
	return "#" + [0, 1, 2].map((i) => Math.round((x[i] * y[i]) / 255).toString(16).padStart(2, "0")).join("");
}

/** An overlay drawn under its owner's alpha, color and transform (BYOND 511 applies them to overlays and underlays
 *  unless the child's flags have RESET_ALPHA/COLOR/TRANSFORM). The transform is about the
 *  owner's centre; BYOND's y-up pixel offsets o = the overlay's own pixel_x/y. Colors multiply when both are plain
 *  (matrix colors: the overlay's own wins, unmodelled). */
export function inherit(o: Appearance, p: Appearance): Appearance {
	const f = o.flags ?? 0, r = { ...o };
	if (!(f & RESET_ALPHA)) r.alpha = (o.alpha * p.alpha) / 255;
	if (p.color && !(f & RESET_COLOR)) r.color = !o.color ? p.color : mulColor(o.color, p.color) ?? o.color;
	if (p.transform && !(f & RESET_TRANSFORM)) {
		const [pa, pb, pc, pd, pe, pf] = p.transform, [oa, ob, oc, od, oe, of] = o.transform ?? [1, 0, 0, 0, 1, 0], x = o.pixelX, y = o.pixelY;
		r.transform = [pa * oa + pb * od, pa * ob + pb * oe, pa * x + pb * y - x + pa * oc + pb * of + pc, pd * oa + pe * od, pd * ob + pe * oe, pd * x + pe * y - y + pd * oc + pe * of + pf];
	}
	return r;
}

/** An overlay's own blend_mode; BLEND_DEFAULT (0) means the owner's. */
export const blendOf = (o: Appearance, p: Appearance): number => o.blendMode || p.blendMode;
