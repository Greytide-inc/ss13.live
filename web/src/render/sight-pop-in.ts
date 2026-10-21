// sight-pop-in (plans/archive/sight-pop-in.md step 4) - The page's own sight: what BYOND's client would see from the tile the page has stepped you to
// (the server's eye tile plus the predicted steps drawn), worked out by the server's rules (vm/view-los.ts viewSight) over the box it sends
// (opq + lum). The server sends what could be seen a step or two ahead too (worker/client-view.ts unionExtra); the page shows only this.

import { viewSight } from "../vm/view-los.js";
import { packOpacity, unpackLum, unpackOpacity, type Lum, type Opq } from "./sight-shadow.js";

/** Per tile of the opq box (world x0, y0, w x h), 1 = shown. */
export interface PageSight { x0: number; y0: number; w: number; h: number; vis: Uint8Array }

/** The sight from (ax, ay) tiles off the box's middle, for a view of half-size hx, hy (and the 1-tile glide ring); past that, the server's
 *  own sight from the middle (opq's seen bits): the camera glides behind the stepped-to tile, so the strip behind you still shows. Null when
 *  the box doesn't hold that view round that tile (another view size, a step too far) or lum doesn't fit the box. */
export function pageSight(opq: Opq, lum: Lum, ax: number, ay: number, hx: number, hy: number, seeInDark: number): PageSight | null {
	const o = unpackOpacity(opq), b = unpackLum(o, lum);
	const ring = (o.w - 1) / 2 - hx;
	if (!b || (o.h - 1) / 2 - hy !== ring || Math.max(Math.abs(ax), Math.abs(ay)) + 1 > ring) return null;
	const v = viewSight(b, b.ex + ax, b.ey + ay, hx, hy, 1, seeInDark), vw = 2 * hx + 3, sx = b.ex + ax - hx - 1, sy = b.ey + ay - hy - 1;
	const vis = o.vis ?? new Uint8Array(o.w * o.h);
	for (let k = 0; k < v.length; k++) vis[sx + (k % vw) + (sy + Math.floor(k / vw)) * o.w] = v[k];
	return { x0: o.x0, y0: o.y0, w: o.w, h: o.h, vis };
}

/** whether world tile (x, y) is shown */
export const pageSees = (s: PageSight, x: number, y: number): boolean => {
	const i = x - s.x0, j = y - s.y0;
	return i >= 0 && j >= 0 && i < s.w && j < s.h && s.vis[i + j * s.w] === 1;
};

/** opq with its seen bits from the page's sight, for the smoothed tg look (sight-shadow-paint.ts hardPainter) */
export function withSight(opq: Opq, s: PageSight): Opq {
	const o = unpackOpacity(opq);
	return packOpacity(o.x0, o.y0, o.w, o.h, o.opaque, s.vis);
}
