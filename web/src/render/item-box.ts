// item-box - where a draw item's pixels can land, relative to its origin (map pixels, y down): the union of its icon rects (with pixel offsets and
// transforms) and maptext boxes, atom and overlays. page-draw step 4 uses it to put an item into every 16x16-tile chunk its box touches.

import { cellRect } from "../dmi/dmi.js";
import type { Appearance, BuiltAppearance } from "../appearance/appearance.js";
import { findState } from "./sprite-lookup.js";
import { byondMatrixToCanvas } from "./byond-transform.js";
import { maptextBoxRect } from "./maptext.js";
import type { LoadedIcon } from "./station-client.js";

/** x1/y1 are exclusive. */
export interface Box { x0: number; y0: number; x1: number; y1: number; /** grown by a pixel for transforms/maptext (their edges aren't whole pixels) */ padded: boolean }

const TILE = 32;
const memo = new WeakMap<object, Box>();
const plain: Box = { x0: 0, y0: 0, x1: TILE, y1: TILE, padded: false };

/** The box of one appearance (atom with its overlays) relative to its item origin. Memoised per appearance object once its icons are loaded. */
export function relBox(a: BuiltAppearance, icons: Map<string, LoadedIcon>): Box {
	const m = memo.get(a);
	if (m) return m;
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, padded = false, complete = true;
	const add = (ax: number, ay: number, bx: number, by: number): void => { if (ax < x0) x0 = ax; if (ay < y0) y0 = ay; if (bx > x1) x1 = bx; if (by > y1) y1 = by; };
	const layer = (l: Appearance, ox: number, oy: number, withMaptext: boolean): void => {
		if (l.icon && l.alpha > 0) {
			const loaded = icons.get(l.icon);
			const state = loaded && findState(loaded.dmi, l.iconState);
			if (!loaded) complete = false;
			if (loaded && state) {
				const w = loaded.dmi.width, h = loaded.dmi.height; // every cell of a state is one size
				const dx = ox + l.pixelX, dy = oy - l.pixelY - (h - TILE);
				if (l.transform) {
					const [A, B, C, D, E, F] = byondMatrixToCanvas(l.transform);
					const tx = dx + w / 2 + E, ty = dy + h / 2 + F;
					let ax = Infinity, ay = Infinity, bx = -Infinity, by = -Infinity;
					for (const [u, v] of [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]]) {
						const X = A * u + C * v + tx, Y = B * u + D * v + ty;
						if (X < ax) ax = X; if (X > bx) bx = X; if (Y < ay) ay = Y; if (Y > by) by = Y;
					}
					add(Math.floor(ax) - 1, Math.floor(ay) - 1, Math.ceil(bx) + 1, Math.ceil(by) + 1);
					padded = true;
				} else add(dx, dy, dx + w, dy + h);
			}
		}
		if (withMaptext && l.maptext) {
			const r = maptextBoxRect(l, ox + l.pixelX, oy - l.pixelY, TILE);
			if (r.w > 0 && r.h > 0) { add(Math.floor(r.x) - 1, Math.floor(r.y) - 1, Math.ceil(r.x + r.w) + 1, Math.ceil(r.y + r.h) + 1); padded = true; }
		}
	};
	layer(a, 0, 0, true);
	for (const o of a.overlays) layer(o, a.pixelX, -a.pixelY, true);
	const box: Box = x0 === Infinity ? plain : { x0, y0, x1, y1, padded };
	if (complete) memo.set(a, box);
	return box;
}
