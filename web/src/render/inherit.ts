// inherit - overlays follow their owner. Pure, so tests/draw can import it.
import { parseColor } from "./anim.js";
import type { Appearance } from "../appearance/appearance.js";

const RESET_COLOR = 2, RESET_ALPHA = 4, RESET_TRANSFORM = 8;
/** Two plain colors multiplied channel by channel; null if either is a matrix (unmodelled: the overlay's own then wins). */
function mulColor(a: Appearance["color"], b: Appearance["color"]): string | null {
	if (typeof a !== "string" || typeof b !== "string") return null;
	const x = parseColor(a), y = parseColor(b);
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
