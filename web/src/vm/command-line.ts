// The command line of DreamSeeker's input box: `verb-name arg arg ...`, argument text split and typed the way
// verb arguments are declared (`as text`, `as num`, mob/obj names, ...). Pure text handling: matching a typed name to
// an object is a callback, so tests need no VM. Read from the BYOND 511 reference (verbs > arguments, src setting);
// unverified guesses are marked `guess`.

/** DMValueType bits as DMCompiler writes them into a verb argument's `Type` (absent = declared without `as`). */
export const ArgType = { Null: 0x1, Text: 0x2, Obj: 0x4, Mob: 0x8, Turf: 0x10, Num: 0x20, Message: 0x40, Area: 0x80, Color: 0x100, File: 0x200, CommandText: 0x400, Sound: 0x800, Icon: 0x1000 } as const;
const TEXTY = ArgType.Text | ArgType.Message | ArgType.Color;
const THINGS = ArgType.Obj | ArgType.Mob | ArgType.Turf | ArgType.Area;

export interface ArgSpec { Type?: number }
export type ParsedArgs<T> = { ok: true; args: (T | string | number | null)[] } | { ok: false; reason: "missing" | "invalid"; arg: number; text: string };

/** Reads one token at `pos`: a "quoted" string (backslash escapes; an unterminated quote runs to the end, as the Say button's `say "` prefix needs) or a word. */
export function nextToken(s: string, pos: number): { text: string; quoted: boolean; end: number } | null {
	while (s[pos] === " ") pos++;
	if (pos >= s.length) return null;
	if (s[pos] === '"') {
		let out = "";
		for (pos++; pos < s.length && s[pos] !== '"'; pos++) out += s[pos] === "\\" && pos + 1 < s.length ? s[++pos] : s[pos];
		return { text: out, quoted: true, end: Math.min(pos + 1, s.length) };
	}
	const e = s.indexOf(" ", pos);
	return { text: s.slice(pos, e < 0 ? s.length : e), quoted: false, end: e < 0 ? s.length : e };
}

/**
 * Splits `rest` (the command line after the verb name) into arguments for `specs`. `match(text, mask)` finds a
 * mob/obj/turf by the typed name (undefined = none).
 * - untyped arguments and `as anything`: a number if it looks like one, else text.
 * - `as command_text`: the rest of the line, raw.
 * - guess: the last argument of a text type takes the rest of the line when unquoted ("say hello world").
 * - a missing argument is "missing" unless its type includes `null` (then null); "missing" is where BYOND pops an input dialog.
 * Not modelled: `in list` argument sources (not in the compiled JSON), `as file/sound/icon/area/color` picking dialogs.
 */
export function parseArgs<T>(rest: string, specs: ArgSpec[], match: (text: string, mask: number) => T | undefined): ParsedArgs<T> {
	const args: (T | string | number | null)[] = [];
	let pos = 0;
	for (let i = 0; i < specs.length; i++) {
		const mask = specs[i].Type ?? 0;
		if (mask & ArgType.CommandText) { args.push(rest.slice(pos).replace(/^ +/, "")); pos = rest.length; continue; }
		let tok = nextToken(rest, pos);
		if (!tok) {
			if (mask & ArgType.Null) { args.push(null); continue; }
			return { ok: false, reason: "missing", arg: i, text: "" };
		}
		if (!tok.quoted && i === specs.length - 1 && mask !== 0 && mask & TEXTY && !(mask & ArgType.Num)) tok = { text: rest.slice(tok.end - tok.text.length).trim(), quoted: false, end: rest.length };
		pos = tok.end;
		const numeric = !tok.quoted && tok.text !== "" && !isNaN(Number(tok.text));
		if (mask & ArgType.Num && numeric) args.push(Number(tok.text));
		else if (mask === 0 || mask & TEXTY) args.push(mask === 0 && numeric ? Number(tok.text) : tok.text);
		else if (mask & THINGS) {
			const o = match(tok.text, mask);
			if (o === undefined) return { ok: false, reason: "invalid", arg: i, text: tok.text };
			args.push(o);
		} else return { ok: false, reason: "invalid", arg: i, text: tok.text };
	}
	return { ok: true, args };
}

/** Picks the first name equal (case-insensitive) to `typed`, else the first that starts with it. */
export function pickByName<T>(items: T[], name: (x: T) => string, typed: string): T | undefined {
	const t = typed.toLowerCase();
	return items.find((x) => name(x).toLowerCase() === t) ?? (t ? items.find((x) => name(x).toLowerCase().startsWith(t)) : undefined);
}
