// click-params - The `params` text of a Click/DblClick, as BYOND 511 builds it. Pure, so the tests can import it.
// Format (DM reference "mouse control": icon-x/icon-y, screen-loc, left/middle/right, ctrl/shift/alt, params2list-able):
//   icon-x=17;icon-y=6;shift=1;left=1;screen-loc=12:17,7:6
// icon-x/icon-y count from 1 at the icon's lower-left pixel (32 = the last of a 32 px icon); screen-loc is
// "tile:pixel,tile:pixel" from the map's lower-left, tile and pixel both 1-based (tg's tooltip.html sample:
// "icon-x=32;icon-y=29;screen-loc=3:10,15:29", and projectile.dm's `tile * 32 + pixel - 32`).
// Not measured in BYOND: the order of the keys (params2list doesn't care), whether right-click sends Click at all
// (tg leaves show_popup_menus on, so a real right-click on an atom with verbs opens the popup instead).

export interface ClickInfo {
	/** Pointer position in canvas pixels, whole numbers, 0,0 = top-left. */
	px: number;
	py: number;
	/** The map/canvas height in pixels (the width doesn't matter, and a widescreen view isn't square). */
	canvasH: number;
	/** icon-x / icon-y of the object hit, or null when nothing was hit. */
	iconX: number | null;
	iconY: number | null;
	button: "" | "left" | "middle" | "right";
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
}

export function screenLoc(px: number, py: number, canvasH: number): string {
	const fromBottom = canvasH - 1 - py;
	return `${Math.floor(px / 32) + 1}:${(px % 32) + 1},${Math.floor(fromBottom / 32) + 1}:${(fromBottom % 32) + 1}`;
}

export function clickParams(c: ClickInfo): string {
	const out: string[] = [];
	if (c.iconX !== null && c.iconY !== null) out.push(`icon-x=${c.iconX}`, `icon-y=${c.iconY}`);
	if (c.ctrl) out.push("ctrl=1");
	if (c.shift) out.push("shift=1");
	if (c.alt) out.push("alt=1");
	if (c.button) out.push(`${c.button}=1`);
	out.push(`screen-loc=${screenLoc(c.px, c.py, c.canvasH)}`);
	return out.join(";");
}
