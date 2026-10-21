// How BYOND 511 stores atom look vars on write. Measured through web/tests/dm/look.dm
// unless marked "unverified". These rules apply to atoms, /image and /mutable_appearance only; a
// datum's own `color` var is plain.
//  - color: text is parsed and stored as lowercase "#rrggbb" (alpha dropped: "#aabbcc80" and
//    "#abcd" are "#aabbcc"). White in any spelling ("#FFF", "#ffffffff", "white") and anything
//    unparseable ("", "#12345", "AABBCC", " #AABBCC", "orange", numbers) become null. The 16 HTML
//    names are known (BYOND's "green" is #00c000). A colour matrix list (3x3, 3x4, 4x4, 4x5 numbers,
//    or 3-4 colour texts as rows) that only scales r/g/b (no cross terms, no offsets) becomes that
//    colour text (identity: null; the alpha scale is dropped); any other matrix is kept as a copy.
//  - pixel_x/y/w/z: truncated toward zero and clamped to +-32767; non-numbers are 0.
//  - step_x/y: truncated; non-numbers 0. alpha: truncated, 0..255. invisibility: truncated, at most
//    127 (negatives kept). Non-numbers 0.
//  - A type's compile-time default is normalised in each new instance, but initial() still reads
//    the raw default (pixel_x = 4.5 reads 4, initial() 4.5).

import { DMList, live } from "./objects.js";
import type { Value } from "./value.js";

const NAMES: Record<string, string> = {
	black: "#000000", silver: "#c0c0c0", gray: "#808080", grey: "#808080", white: "#ffffff",
	maroon: "#800000", red: "#ff0000", purple: "#800080", fuchsia: "#ff00ff", magenta: "#ff00ff",
	green: "#00c000", lime: "#00ff00", olive: "#808000", yellow: "#ffff00", navy: "#000080",
	blue: "#0000ff", teal: "#008080", aqua: "#00ffff", cyan: "#00ffff",
};

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/;

/** Lowercase "#rrggbb" for a colour text, or null if BYOND can't parse it. */
export function parseColorText(s: string): string | null {
	const l = s.toLowerCase();
	const named = NAMES[l];
	if (named !== undefined) return named;
	const m = HEX.exec(l);
	if (!m) return null;
	const h = m[1];
	if (h.length <= 4) return "#" + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
	return "#" + h.slice(0, 6);
}

/** The stored value of `color = v` on an atom or image. */
export function normColor(v: Value): Value {
	if (typeof v === "string") {
		const c = parseColorText(v);
		return c === null || c === "#ffffff" ? null : c;
	}
	if (v instanceof DMList) return normMatrix(v);
	if (typeof v === "number") return null;
	return v; // unverified: other objects
}

function hex2(x: number): string {
	const n = Math.round(Math.min(1, Math.max(0, x)) * 255);
	return (n < 16 ? "0" : "") + n.toString(16);
}

/** Rows of 4 (r, g, b, a) from a matrix list, or null if it isn't a shape BYOND reads as one. */
function matrixRows(l: DMList): number[][] | null {
	const items = l.items;
	if (items.length >= 3 && items.length <= 4 && items.every((x) => typeof x === "string")) {
		const rows: number[][] = [];
		for (const x of items as string[]) {
			const c = parseColorText(x);
			if (c === null) return null; // unverified
			// Measured: "#ff000080" as the red row maps red into alpha (kept as a list); the 4th text is
			// the alpha row (its own alpha, else 1).
			const a = x.length === 9 ? parseInt(x.slice(7), 16) / 255 : rows.length === 3 ? 1 : 0;
			rows.push([parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255, a]);
		}
		if (rows.length === 3) rows.push([0, 0, 0, 1]);
		return rows;
	}
	if (!items.every((x) => typeof x === "number")) return null;
	const n = items as number[];
	const cols = n.length === 9 || n.length === 12 ? 3 : n.length === 16 || n.length === 20 ? 4 : 0;
	if (cols === 0) return null;
	const rows: number[][] = [];
	for (let i = 0; i < n.length; i += cols) rows.push(cols === 3 ? [n[i], n[i + 1], n[i + 2], 0] : n.slice(i, i + 4));
	if (cols === 3) rows.splice(3, 0, [0, 0, 0, 1]);
	return rows;
}

function normMatrix(l: DMList): Value {
	const rows = matrixRows(l);
	if (rows !== null) {
		let diagonal = true;
		for (let r = 0; r < rows.length && diagonal; r++) {
			for (let c = 0; c < 4; c++) {
				if (r === c || rows[r][c] === 0) continue;
				diagonal = false;
				break;
			}
		}
		if (diagonal) {
			const c = "#" + hex2(rows[0][0]) + hex2(rows[1][1]) + hex2(rows[2][2]);
			return c === "#ffffff" ? null : c;
		}
	}
	// Measured: a copy (`color == L` is false after `color = L`).
	const out = new DMList();
	for (const x of l.items) out.push(live(x));
	return out;
}

function num(v: Value): number {
	return typeof v === "number" ? Math.trunc(v) : 0;
}

/**
 * The stored value of `name = v` for a look var on an atom or image, or `undefined` if `name` isn't
 * one of the normalised vars.
 */
export function normLookVar(name: string, v: Value): Value | undefined {
	switch (name) {
		case "color": return normColor(v);
		case "pixel_x": case "pixel_y": case "pixel_w": case "pixel_z": return Math.max(-32767, Math.min(32767, num(v)));
		case "step_x": case "step_y": return num(v);
		case "alpha": return Math.max(0, Math.min(255, num(v)));
		case "invisibility": return Math.min(127, num(v));
	}
	return undefined;
}

/** Names normLookVar handles (for a quick membership test). */
export const LOOK_VARS: ReadonlySet<string> = new Set(["color", "pixel_x", "pixel_y", "pixel_w", "pixel_z", "step_x", "step_y", "alpha", "invisibility"]);
