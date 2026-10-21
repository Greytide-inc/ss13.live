// The client's skin as data: every control in interface/skin.dmf with its parameters, so
// winset() can change them and winget()/winexists() can read them back the way a fresh
// DreamSeeker would. The host reads the .dmf text and hands it to Clients.setSkin().
//
// skin.dmf is three kinds of top-level block (`macro "name"`, `menu "name"`, `window "name"`), each
// holding `elem "id"` sub-blocks of tab-indented `key = value` lines. tg's file writes out every
// parameter of every control, so the values here are what BYOND reports for an untouched client.
// Same grammar as web/src/tools/skin-to-html.ts, which draws the layout.

export interface SkinControl {
	id: string;
	/** "MAIN", "BROWSER", "MAP", ... as written in the .dmf; "MACRO"/"MENU" for those blocks' items. */
	type: string;
	/** The block it belongs to (window, menu or macro set name). */
	parent: string;
	params: Map<string, string>;
}

export interface Skin {
	controls: Map<string, SkinControl>;
	windows: string[];
	menus: string[];
	macros: string[];
}

function unquote(v: string): string {
	if (v.length >= 2 && v.startsWith('"') && v.endsWith('"'))
		return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\t/g, "\t").replace(/\\\\/g, "\\");
	return v;
}

export function parseSkin(text: string): Skin {
	const skin: Skin = { controls: new Map(), windows: [], menus: [], macros: [] };
	let kind = "", block = "";
	let cur: SkinControl | null = null;
	let anon = 0;
	for (const line of text.split(/\r?\n/)) {
		const top = /^(macro|menu|window)\s+"([^"]*)"\s*$/.exec(line);
		if (top) {
			kind = top[1];
			block = top[2];
			(kind === "window" ? skin.windows : kind === "menu" ? skin.menus : skin.macros).push(block);
			cur = null;
			continue;
		}
		const em = /^\telem(?:\s+"([^"]*)")?\s*$/.exec(line);
		if (em) {
			let id = em[1] || `${block}.#${++anon}`; // macros are mostly anonymous; keep them anyway
			// tg names "w_key"/"s_key" in both "hotkeys" and "robot-hotkeys": a later set's copy is kept as "set.id"
			// (dropping it left cyborgs without W/S).
			if (skin.controls.has(id) && kind === "macro") id = `${block}.${id}`;
			cur = { id, type: kind === "window" ? "" : kind.toUpperCase(), parent: block, params: new Map() };
			if (!skin.controls.has(id)) skin.controls.set(id, cur);
			continue;
		}
		const prop = /^\t\t([^=]+?)\s*=\s*(.*)$/.exec(line);
		if (prop && cur) {
			const v = unquote(prop[2]);
			if (prop[1] === "type") cur.type = v;
			cur.params.set(prop[1], v);
		}
	}
	return skin;
}

/** A per-client copy (winset changes one player's skin only). */
export function cloneSkin(s: Skin): Skin {
	const controls = new Map<string, SkinControl>();
	for (const [id, c] of s.controls) controls.set(id, { ...c, params: new Map(c.params) });
	return { controls, windows: [...s.windows], menus: [...s.menus], macros: [...s.macros] };
}

/**
 * winset's parameter text: `a=b;c="x y"` or, with no control id, `ctl.a=b ctl2.c=d` (tg uses both
 * ; and spaces). Quoted values keep their spaces and lose their quotes and backslash escapes.
 */
export function parseWinsetParams(t: string): [string, string][] {
	const out: [string, string][] = [];
	let i = 0;
	const n = t.length;
	while (i < n) {
		while (i < n && (t[i] === ";" || t[i] === " " || t[i] === "&")) i++;
		if (i >= n) break;
		let key = "";
		while (i < n && t[i] !== "=" && t[i] !== ";" && t[i] !== " ") key += t[i++];
		let val = "";
		if (t[i] === "=") {
			i++;
			if (t[i] === '"') {
				i++;
				while (i < n && t[i] !== '"') {
					if (t[i] === "\\" && i + 1 < n) i++;
					val += t[i++];
				}
				i++;
			} else {
				while (i < n && t[i] !== ";" && t[i] !== " " && t[i] !== "&") val += t[i++]; // list2params joins with "&" and url-encodes the values
				if (val.includes("%")) try { val = decodeURIComponent(val); } catch { /* not encoded after all */ }
			}
		}
		if (key) out.push([key, val]);
	}
	return out;
}
