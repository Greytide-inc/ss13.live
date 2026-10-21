// hit-test - Which object is under the mouse pointer, by BYOND's rule (DM reference, mouse_opacity var):
// the top-most object that is not transparent at the pointer; mouse_opacity 0 = ignored, 1 = only where its icon
// is opaque, 2 = its whole box. "Top-most" is draw order (plane, then layer; ties by emission order = creation order,
// as sortPrepared), and a plane whose plane_master has mouse_opacity 0 is skipped whole (lighting, parallax).
// Runs on the same draw items as the renderer, so it hits what is drawn under the pointer, mid-glide included.
// Icon pixels are read straight from the loaded sheet (one pixel through a 1x1 canvas), no re-render.
// Assumptions (not measured in BYOND): an overlay counts as part of its owner (any overlay pixel hits the owner);
// transformed icons are hit through the inverse transform; opaque = alpha > 0; a colour tint doesn't change the shape.

import { cellRect, dirIndex } from "../dmi/dmi.js";
import type { Appearance } from "../appearance/appearance.js";
import { findState } from "./sprite-lookup.js";
import { frameForState, type LoadedIcon } from "./station-client.js";
import { byondMatrixToCanvas } from "./byond-transform.js";
import type { DrawItem, Prepared } from "./client-scene.js";

export interface Hit { item: DrawItem; hud: boolean; iconX: number; iconY: number }

let scratch: CanvasRenderingContext2D | null = null;
const alphaAt = (img: HTMLImageElement, sx: number, sy: number): number => {
	scratch ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })!;
	scratch.clearRect(0, 0, 1, 1);
	scratch.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
	return scratch.getImageData(0, 0, 1, 1).data[3];
};

/** Icon-own pixel (floor u, v, box height) of the last transformed layer that hit; hitTest reads it for icon-x/icon-y. */
const uv = { u: 0, v: 0, h: 32 };

/** Is canvas pixel (px, py) inside this layer's box (mo 2) or on one of its opaque pixels (mo 1)? */
function inLayer(l: Appearance, originX: number, originY: number, px: number, py: number, mo: number, icons: Map<string, LoadedIcon>, frameTime: number): boolean {
	if (!l.icon || l.alpha <= 0) return false;
	const loaded = icons.get(l.icon);
	const state = loaded && findState(loaded.dmi, l.iconState);
	if (!loaded || !state) return false;
	const frame = frameForState(state, frameTime, frameTime, l.flickT0);
	const rect = cellRect(loaded.dmi, state.cells[dirIndex(state.dirs, l.dir)]?.[frame] ?? state.cells[0][0]);
	const dx = originX + l.pixelX, dy = originY - l.pixelY - (rect.h - 32);
	let u = px + 0.5 - dx, v = py + 0.5 - dy; // the pixel's centre, in the icon's own pixels
	if (l.transform) {
		const [A, B, C, D, E, F] = byondMatrixToCanvas(l.transform);
		const det = A * D - B * C;
		if (Math.abs(det) < 1e-9) return false;
		const X = u - rect.w / 2 - E, Y = v - rect.h / 2 - F; // drawImageWithTransform: about the icon's centre
		u = (D * X - C * Y) / det + rect.w / 2;
		v = (-B * X + A * Y) / det + rect.h / 2;
	}
	if (u < 0 || v < 0 || u >= rect.w || v >= rect.h) return false;
	const ok = mo === 2 || alphaAt(loaded.img, rect.x + Math.floor(u), rect.y + Math.floor(v)) > 0;
	if (ok) { uv.u = Math.floor(u); uv.v = Math.floor(v); uv.h = rect.h; }
	return ok;
}

/** the pointer in the item's own pixels (a screen object laid out in base-view pixels is drawn k times as big at an offset). */
const local = (it: DrawItem, px: number, py: number): [number, number] => it.hk ? [(px + 0.5 - it.hk.dx) / it.hk.k - 0.5, (py + 0.5 - it.hk.dy) / it.hk.k - 0.5] : [px, py];

/** The top-most clickable object at canvas pixel (px, py) (whole numbers, 0,0 = top-left), or null. */
export function hitTest(p: Prepared, icons: Map<string, LoadedIcon>, X: number, Y: number, frameTime: number): Hit | null {
	const cands: DrawItem[] = [];
	const consider = (items: DrawItem[]) => {
		for (const it of items) {
			if ((it.mo ?? 1) === 0 || p.masters.get(it.plane)?.mouseOpacity === 0) continue;
			const a = it.appearance, [px, py] = local(it, X, Y);
			// Cheap reject before the icon lookup; icons taller/wider than ~4 tiles or with a transform always get the exact test.
			if (!a.transform && !a.overlays.some((o) => o.transform)) {
				const dx = px - (it.originX + a.pixelX);
				if (dx < -128 || dx > 160 || py - (it.originY - a.pixelY) < -128 || py - (it.originY - a.pixelY) > 160) continue;
			}
			cands.push(it);
		}
	};
	consider(p.mapNear ? p.mapNear(X, Y) : p.mapItems); // page-draw step 4: the chunk under the pointer when the page keeps a scene
	consider(p.hudItems);
	cands.sort((a, b) => a.plane - b.plane || a.layer - b.layer); // stable: creation order on ties, as sortPrepared
	for (let i = cands.length - 1; i >= 0; i--) {
		const it = cands[i], a = it.appearance, mo = it.mo ?? 1, [px, py] = local(it, X, Y);
		let hit = inLayer(a, it.originX, it.originY, px, py, mo, icons, frameTime), by: Appearance | null = hit ? a : null;
		for (let k = 0; !hit && k < a.overlays.length; k++) if ((hit = inLayer(a.overlays[k], it.originX + a.pixelX, it.originY - a.pixelY, px, py, mo, icons, frameTime))) by = a.overlays[k];
		if (hit) {
			// icon-x/icon-y are in the icon's own untransformed pixels (assumption: BYOND's rule is unmeasured), 1-based from its lower-left.
			if (by!.transform) { // the layer's hit spot, mapped back through its transform (an overlay's offset from its owner added)
				const o = by === a ? null : by!;
				return { item: it, hud: p.hudItems.includes(it), iconX: uv.u + (o?.pixelX ?? 0) + 1, iconY: uv.h - uv.v + (o?.pixelY ?? 0) };
			}
			return { item: it, hud: p.hudItems.includes(it), iconX: Math.floor(px) - (it.iconX0 ?? it.originX) + 1, iconY: (it.iconY1 ?? it.originY + 32) - Math.floor(py) };
		}
	}
	return null;
}
