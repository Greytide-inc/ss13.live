// Built-ins for tg's boot path: typesof/text2path/hascall, rand/rand_seed, JSON,
// splittext/jointext, html/url encoding, ckey, params, time2text, and the /regex datum.
// Behaviour measured in BYOND 511 through web/tests/dm/boot_natives.dm unless marked "unverified".

import type { NativeProc, VM } from "./interpreter.js";
import { DMList, DMObject, listSubtract, live, type SharedAssoc } from "./objects.js";
import { DMProc, DMType } from "./objtree.js";
import { DMRuntimeError, formatNumber, fround, isTruthy, stringify, type Value } from "./value.js";
import { stripMarkers } from "./markers.js";
import { wallNow } from "./clockhook.js";

const num = (v: Value, dflt: number): number => (typeof v === "number" ? v : dflt);
const text = (v: Value): string => (typeof v === "string" ? v : stringify(v));

// ---- types ---------------------------------------------------------------------------------------

/** Each type's direct children, in type-id order (DMCompiler numbers types in order of first mention). */
function childrenOf(vm: VM): Map<DMType, DMType[]> {
	const cache = vm as unknown as { _typeChildren?: Map<DMType, DMType[]> };
	if (!cache._typeChildren) {
		const m = new Map<DMType, DMType[]>();
		for (const t of vm.tree.types) {
			if (!t.parent || t === t.parent) continue;
			let l = m.get(t.parent);
			if (!l) m.set(t.parent, (l = []));
			l.push(t);
		}
		cache._typeChildren = m;
	}
	return cache._typeChildren;
}

/**
 * typesof(T): measured order is post-order: each subtree's types before the type itself, children
 * in the order they were first mentioned in the source (typesof(/b) = /b/c1, /b/c0, /b).
 */
function typesOf(vm: VM, t: DMType, out: Value[]): void {
	for (const c of childrenOf(vm).get(t) ?? []) typesOf(vm, c, out);
	out.push(t);
}

function toType(vm: VM, v: Value): DMType | null {
	if (v instanceof DMType) return v;
	if (typeof v === "string") return vm.tree.getType(v) ?? null;
	return null;
}

function text2path(vm: VM, t: Value): Value {
	if (typeof t !== "string" || t === "") return null;
	const ty = vm.tree.getType(t);
	if (ty) return ty;
	// "/proc/name" and "/type/proc/name" (also /verb/): the proc itself.
	const m = /^(.*)\/(?:proc|verb)\/([^/]+)$/.exec(t);
	if (m) {
		if (m[1] === "") return vm.tree.globalProcs.get(m[2]) ?? null;
		return vm.tree.getType(m[1])?.procs.get(m[2]) ?? null;
	}
	return null;
}

// ---- JSON ----------------------------------------------------------------------------------------

/** Measured: numbers print like "[x]" (1e+06, 0.333333); types print their path; `/` isn't escaped. */
export function jsonEncode(v: Value): string {
	v = live(v);
	if (v === null) return "null";
	if (typeof v === "number") return Number.isFinite(v) ? formatNumber(v) : "null"; // non-finite: unverified
	if (typeof v === "string") return JSON.stringify(stripMarkers(v));
	if (v instanceof DMList) {
		// Measured: a list with any associated value (list("a", "b" = 2)) is an object, keys without
		// values give null. A list whose keys were all given null values: unverified (object here).
		if (v.hasAssoc) {
			const parts = v.items.map((k) => {
				const key = live(k);
				const val = v.assocOf(k);
				return `${JSON.stringify(stripMarkers(stringify(key)))}:${jsonEncode(val === undefined ? null : val)}`;
			});
			return `{${parts.join(",")}}`;
		}
		return `[${v.items.map((x) => jsonEncode(x)).join(",")}]`;
	}
	return JSON.stringify(stringify(v)); // types, procs, files; datums unverified
}

function jsonToValue(x: unknown): Value {
	if (x === null) return null;
	if (typeof x === "boolean") return x ? 1 : 0;
	if (typeof x === "number") return fround(x);
	if (typeof x === "string") return x;
	if (Array.isArray(x)) return new DMList(x.map(jsonToValue));
	const l = new DMList();
	for (const [k, v] of Object.entries(x as Record<string, unknown>)) l.set(k, jsonToValue(v));
	return l;
}

// ---- text helpers ----------------------------------------------------------------------------------

/** url_encode format 0: only A-Z a-z 0-9 . - _ are kept, space is +, hex is lowercase (measured). */
export function urlEncode(t: string, format = 0): string {
	let out = "";
	for (const ch of t) {
		const c = ch.charCodeAt(0);
		if (/[A-Za-z0-9._-]/.test(ch)) out += ch;
		else if (format === 0 && ch === " ") out += "+";
		// format 1: measured only that " " is %20 and "/" is kept; the rest follow encodeURI (unverified).
		else if (format !== 0 && /[;,/?:@&=+$!~*'()#]/.test(ch)) out += ch;
		else out += "%" + (c < 16 ? "0" : "") + (c & 0xff).toString(16);
	}
	return out;
}

/** url_decode: "+" is a space, %XX a byte, a bad escape stays as it is (measured). */
export function urlDecode(t: string): string {
	return t.replace(/\+/g, " ").replace(/%([0-9a-fA-F]{2})/g, (_m, h) => String.fromCharCode(parseInt(h, 16)));
}

const HTML_ENC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&#34;", "'": "&#39;" };
const HTML_DEC: Record<string, string> = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'", nbsp: " " };

// ---- regex ---------------------------------------------------------------------------------------

/** BYOND pattern -> JS. `\l` is a letter (measured inside a class). */
function translatePattern(p: string): string {
	let out = "";
	let inClass = false;
	for (let i = 0; i < p.length; i++) {
		const ch = p[i];
		if (ch === "\\" && i + 1 < p.length) {
			const n = p[++i];
			if (n === "l") out += inClass ? "A-Za-z" : "[A-Za-z]";
			else out += "\\" + n;
			continue;
		}
		if (ch === "[") inClass = true;
		else if (ch === "]") inClass = false;
		out += ch;
	}
	return out;
}

const regexCache = new Map<string, RegExp>();
function jsRegex(pattern: string, flags: string): RegExp {
	const key = flags + "\u0000" + pattern;
	let r = regexCache.get(key);
	if (!r) {
		try {
			r = new RegExp(translatePattern(pattern), "g" + (flags.includes("i") ? "i" : "") + (flags.includes("m") ? "m" : ""));
		} catch (e) {
			throw new DMRuntimeError(`bad regex: ${pattern}`); // unverified wording
		}
		regexCache.set(key, r);
	}
	return r;
}

export function isRegex(vm: VM, v: Value): v is DMObject {
	const t = vm.tree.getType("/regex");
	return v instanceof DMObject && t !== undefined && v.type.isSubtypeOf(t);
}

function regexParts(R: DMObject): { re: RegExp; global: boolean } {
	const flags = typeof R.getVar("flags") === "string" ? (R.getVar("flags") as string) : "";
	return { re: jsRegex(text(R.getVar("name")), flags), global: flags.includes("g") };
}

/**
 * R.Find(hay, Start, End). Measured: returns the 1-based index or 0. On a match it sets match,
 * index, group (a list of the capture groups) and, for a "g" regex, next (just past the match; one
 * past an empty match). `text` is never set. A "g" regex with no Start continues from next. On
 * failure nothing changes except that a "g" regex's next becomes null.
 */
export function regexFind(R: DMObject, hay: Value, start: Value, end: Value): number {
	const { re, global } = regexParts(R);
	const h = text(hay);
	let s = typeof start === "number" ? Math.trunc(start) : global && typeof R.getVar("next") === "number" ? (R.getVar("next") as number) : 1;
	if (s < 1) s = 1;
	let e = Math.trunc(num(end, 0));
	if (e <= 0 || e > h.length + 1) e = h.length + 1;
	re.lastIndex = s - 1;
	const m = s <= e ? re.exec(h.slice(0, e - 1)) : null;
	if (!m) {
		if (global) R.setVar("next", null);
		return 0;
	}
	const index = m.index + 1;
	R.setVar("match", m[0]);
	R.setVar("index", index);
	R.setVar("group", m.length > 1 ? new DMList(m.slice(1).map((g) => (g === undefined ? null : g))) : null); // no groups: unverified
	if (global) R.setVar("next", index + Math.max(1, m[0].length));
	return index;
}

/**
 * R.Replace(hay, replacement, Start, End). Measured: without "g" only the first match is replaced;
 * $1..$9 and $& work; a proc replacement is called with (match, group1, ...) and its result used.
 */
export function regexReplace(vm: VM, R: DMObject, hay: Value, repl: Value, start: Value, end: Value): Value {
	if (typeof hay !== "string") return hay;
	const { re, global } = regexParts(R);
	let s = Math.max(1, Math.trunc(num(start, 1)));
	let e = Math.trunc(num(end, 0));
	if (e <= 0 || e > hay.length + 1) e = hay.length + 1;
	if (s > e) return hay;
	const region = hay.slice(s - 1, e - 1);
	let count = 0;
	const out = region.replace(re, (...a: unknown[]) => {
		const m = a[0] as string;
		if (!global && count++ > 0) return m;
		const groups = a.slice(1, a.length - 2) as (string | undefined)[];
		if (repl instanceof DMProc) return stringify(vm.call(repl, [m, ...groups.map((g) => (g === undefined ? null : g))]));
		const r = text(repl);
		return r.replace(/\$(\d|&|`|')/g, (_x, k: string) => {
			if (k === "&") return m;
			if (k === "`") return region.slice(0, a[a.length - 2] as number);
			if (k === "'") return region.slice((a[a.length - 2] as number) + m.length);
			const g = groups[Number(k) - 1];
			return k === "0" ? m : g ?? "";
		});
	});
	return hay.slice(0, s - 1) + out + hay.slice(e - 1);
}

// ---- time2text -----------------------------------------------------------------------------------

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const BYOND_EPOCH = Date.UTC(2000, 0, 1);

/**
 * time2text(t, format). Measured: t is deciseconds since 2000-01-01 00:00 UTC, shown in the host's
 * local time (BST in summer). A t from 0 up to a day is a time on *today's* UTC date instead (so
 * time2text(0, "hh") gives the host's UTC offset, which tg uses). Seconds are floored. Tokens:
 * YYYY YY MM MMM Month DD DDD Day hh mm ss (no MMMM/DDDD: "MMMM" is "MMM" then "M").
 */
export function time2text(t: number, format: string): string {
	let base = BYOND_EPOCH;
	if (t >= 0 && t < 864000) {
		const now = new Date(wallNow());
		base = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	}
	const d = new Date(base + Math.floor(t / 10) * 1000);
	const p2 = (n: number) => (n < 10 ? "0" : "") + n;
	return format.replace(/YYYY|YY|Month|MMM|MM|Day|DDD|DD|hh|mm|ss/g, (tok) => {
		switch (tok) {
			case "YYYY": return String(d.getFullYear());
			case "YY": return p2(d.getFullYear() % 100);
			case "Month": return MONTHS[d.getMonth()];
			case "MMM": return MONTHS[d.getMonth()].slice(0, 3);
			case "MM": return p2(d.getMonth() + 1);
			case "Day": return DAYS[d.getDay()];
			case "DDD": return DAYS[d.getDay()].slice(0, 3);
			case "DD": return p2(d.getDate());
			case "hh": return p2(d.getHours());
			case "mm": return p2(d.getMinutes());
			default: return p2(d.getSeconds());
		}
	});
}

// ---- tg's typecacheof (mem3) --------------------------------------------------------------------

/**
 * tg's /proc/typecacheof (code/__HELPERS/_lists.dm) as a native, step for step the same list operations
 * (typesof, `typesof(P) - P` for subtypesof, `L[T] = TRUE` in the same order), plus a memo: a call with
 * the same paths and flags gets a new list holding the same items whose assoc storage is shared with the
 * earlier result until either is written (DMList copy-on-write). Measured (mem2): 11,009 machines each
 * keep `typecacheof(list(/mob/living))`, 285 entries, ~345 MB of Firefox's live heap.
 * The result is a new list on every call, as in DM; only its storage is shared.
 */
function installTypecacheof(vm: VM): void {
	const typesof = (P: Value): DMList => {
		const out: Value[] = [];
		const t = toType(vm, P);
		if (t) typesOf(vm, t, out);
		return new DMList(out);
	};
	const subtypesof = (P: Value): DMList => listSubtract(typesof(P), P);
	const compute = (path: Value, ignoreRoot: boolean, onlyRoot: boolean): Value => {
		if (path instanceof DMType) {
			const types = onlyRoot ? new DMList([path]) : ignoreRoot ? subtypesof(path) : typesof(path);
			const L = new DMList();
			for (const T of types.items.slice()) L.set(live(T), 1);
			return L;
		}
		if (path instanceof DMList) {
			const L = new DMList();
			for (const x of path.items.slice()) {
				const P = live(x);
				if (ignoreRoot) for (const T of subtypesof(P).items.slice()) L.set(live(T), 1);
				else if (onlyRoot) L.set(P, 1);
				else for (const T of typesof(P).items.slice()) L.set(live(T), 1);
			}
			return L;
		}
		return null;
	};
	const memo = new Map<string, SharedAssoc>();
	vm.natives.set("/proc/typecacheof", (_vm, args) => {
		const path = live(args[0] ?? null);
		const ignoreRoot = isTruthy(args[1] ?? null), onlyRoot = isTruthy(args[2] ?? 0);
		// Memo key: the paths (only when every one is a type path) and the two flags.
		let key: string | null = null;
		if (path instanceof DMType) key = path.path;
		else if (path instanceof DMList && path.items.length > 0) {
			key = "";
			for (const x of path.items) {
				const P = live(x);
				if (!(P instanceof DMType)) { key = null; break; }
				key += "," + P.path;
			}
		}
		if (key === null) return compute(path, ignoreRoot, onlyRoot);
		key = (ignoreRoot ? "i" : "") + (onlyRoot ? "o" : "") + "|" + key;
		const hit = memo.get(key);
		if (hit !== undefined) return DMList.withSharedAssoc(hit);
		const L = compute(path, ignoreRoot, onlyRoot) as DMList;
		const shared = L.shareAssoc();
		if (shared !== null) memo.set(key, shared);
		return L;
	});
	vm.overrideWithNative("/proc/typecacheof");
}

// ---- install -------------------------------------------------------------------------------------

export function installTextNatives(vm: VM): void {
	const def = (path: string, fn: NativeProc) => vm.natives.set(path, fn);

	// ---- types
	def("/proc/typesof", (vm, args) => {
		const out: Value[] = [];
		for (const a of args) {
			const t = toType(vm, a);
			if (t) typesOf(vm, t, out);
		}
		return new DMList(out);
	});
	installTypecacheof(vm);
	def("/proc/text2path", (vm, [t = null]) => text2path(vm, t));
	def("/proc/hascall", (vm, [o = null, name = null]) => {
		const t = vm.typeOf(o);
		return t && typeof name === "string" && t.procs.has(name) ? 1 : 0;
	});

	// ---- random. Measured: rand() is a float in [0,1); rand(H) is rand(0,H); bounds are floored;
	// rand(4,1) gives 3 or 4 (L minus 0..L-H-2). prob is an opcode (interpreter.ts).
	def("/proc/rand", (vm, args) => {
		if (args.length === 0) return fround(vm.rng.next());
		let lo = Math.floor(num(args[0], 0)), hi = Math.floor(num(args[1] ?? null, 0));
		if (args.length === 1) [lo, hi] = [0, lo];
		if (hi >= lo) return vm.rng.int(lo, hi);
		return lo - vm.rng.int(0, Math.max(0, lo - hi - 2));
	});
	def("/proc/rand_seed", (vm, [s = null]) => {
		vm.rng.seed(Math.trunc(num(s, 0)));
		return null;
	});

	// ---- JSON
	def("/proc/json_encode", (_vm, [v = null]) => jsonEncode(v));
	def("/proc/json_decode", (_vm, [t = null]) => {
		// Measured: "A" decodes to "u" (511 has no Unicode). A parse error is a runtime error;
		// its measured message for "{bad" is "Unknown value: 1" (other inputs unverified).
		const src = text(t).replace(/\\u[0-9a-fA-F]{4}/g, "u");
		let parsed: unknown;
		try {
			parsed = JSON.parse(src);
		} catch {
			throw new DMRuntimeError("Unknown value: 1");
		}
		return jsonToValue(parsed);
	});

	// ---- text
	def("/proc/splittext", (vm, [t = null, delim = null, start = null, end = null, incl = null]) => {
		if (typeof t !== "string") return new DMList(); // unverified
		// Measured: works on copytext(t, Start, End); "" splits into len+1 empty strings; "" text gives an empty list.
		let s = Math.max(1, Math.trunc(num(start, 1)));
		let e = Math.trunc(num(end, 0));
		if (e <= 0 || e > t.length + 1) e = t.length + 1;
		const region = s <= e ? t.slice(s - 1, e - 1) : "";
		if (region === "") return new DMList();
		if (isRegex(vm, delim)) {
			const { re } = regexParts(delim);
			const out: Value[] = [];
			let last = 0;
			re.lastIndex = 0;
			for (let m = re.exec(region); m; m = re.exec(region)) {
				if (m[0] === "") {
					re.lastIndex++;
					continue;
				}
				out.push(region.slice(last, m.index));
				if (incl) out.push(m[0]);
				last = m.index + m[0].length;
			}
			out.push(region.slice(last));
			return new DMList(out);
		}
		const d = text(delim);
		if (d === "") return new DMList(new Array(region.length + 1).fill(""));
		const parts = region.split(d);
		if (!incl) return new DMList(parts);
		const out: Value[] = [];
		parts.forEach((p, i) => {
			if (i > 0) out.push(d);
			out.push(p);
		});
		return new DMList(out);
	});
	// Measured: the same Start/End quirk as list.Join().
	def("/proc/jointext", (vm, [l = null, glue = null, start = null, end = null]) => {
		if (!(l instanceof DMList)) return text(l); // unverified
		return vm.natives.get("/list/proc/Join")!(vm, [glue, start ?? 1, end ?? 0], l, null);
	});
	def("/proc/html_encode", (_vm, [t = null]) => stripMarkers(text(t)).replace(/[&<>"']/g, (c) => HTML_ENC[c]));
	def("/proc/html_decode", (_vm, [t = null]) =>
		text(t).replace(/&(#\d+|[a-zA-Z]+);/g, (m, e: string) => (e[0] === "#" ? String.fromCharCode(Number(e.slice(1))) : HTML_DEC[e] ?? m)),
	);
	def("/proc/url_encode", (_vm, [t = null, f = null]) => urlEncode(text(t), Math.trunc(num(f, 0))));
	def("/proc/url_decode", (_vm, [t = null]) => urlDecode(text(t)));
	// Measured: ckey keeps a-z 0-9 @ (lowercased); ckeyEx keeps letters, digits, _ - @ and case.
	def("/proc/ckey", (_vm, [t = null]) => (typeof t === "string" ? t.toLowerCase().replace(/[^a-z0-9@]/g, "") : ""));
	def("/proc/ckeyEx", (_vm, [t = null]) => (typeof t === "string" ? t.replace(/[^A-Za-z0-9_@-]/g, "") : ""));
	def("/proc/text2ascii", (_vm, [t = null, pos = null]) => {
		const s = text(t);
		const i = Math.trunc(num(pos, 1));
		return i >= 1 && i <= s.length ? s.charCodeAt(i - 1) : 0;
	});
	def("/proc/ascii2text", (_vm, [n = null]) => String.fromCharCode(Math.trunc(num(n, 0))));
	def("/proc/cmptext", (_vm, args) => {
		// Measured: \proper / \improper markers are ignored (cmptextEx: unverified, kept).
		const first = stripMarkers(text(args[0] ?? null)).toLowerCase();
		return args.every((a) => stripMarkers(text(a)).toLowerCase() === first) ? 1 : 0;
	});
	const sortText = (fold: boolean): NativeProc => (_vm, args) => {
		// Measured: 1 if every pair ascends, -1 if every pair descends, else 0.
		// Measured for sorttext: \proper / \improper markers are ignored (sorttextEx: unverified, kept).
		const v = args.map((a) => (fold ? stripMarkers(text(a)).toLowerCase() : text(a)));
		let asc = true, desc = true;
		for (let i = 1; i < v.length; i++) {
			if (!(v[i - 1] < v[i])) asc = false;
			if (!(v[i - 1] > v[i])) desc = false;
		}
		return asc ? 1 : desc ? -1 : 0;
	};
	def("/proc/sorttext", sortText(true));
	def("/proc/sorttextEx", sortText(false));
	def("/proc/time2text", (_vm, [t = null, f = null]) => time2text(num(t, 0), typeof f === "string" ? f : "DDD MMM DD hh:mm:ss YYYY"));

	// ---- params. Measured: & and ; both separate; values are url-decoded text; a key without "="
	// gets ""; a repeated key's value becomes a list of its values.
	def("/proc/params2list", (_vm, [t = null]) => {
		const l = new DMList();
		for (const part of text(t).split(/[&;]/)) {
			if (part === "") continue;
			const eq = part.indexOf("=");
			const k = urlDecode(eq < 0 ? part : part.slice(0, eq));
			const v = eq < 0 ? "" : urlDecode(part.slice(eq + 1));
			if (l.contains(k)) {
				const old = l.get(k);
				if (old instanceof DMList) old.push(v);
				else l.set(k, new DMList([old, v]));
			} else l.set(k, v);
		}
		return l;
	});
	def("/proc/list2params", (_vm, [l = null]) => {
		if (!(l instanceof DMList)) return "";
		return l.items
			.map((k) => {
				const v = l.assocOf(k);
				const key = urlEncode(stringify(live(k)));
				return v === undefined || v === null ? key : `${key}=${urlEncode(stringify(live(v)))}`;
			})
			.join("&");
	});

	// ---- regex
	def("/proc/regex", (vm, [pattern = null, flags = null]) => vm.newObject(vm.tree.getType("/regex")!, [pattern, flags]));
	def("/regex/proc/Find", (_vm, [hay = null, start = null, end = null], src) => regexFind(src as DMObject, hay, start, end));
	def("/regex/proc/Replace", (vm, [hay = null, repl = null, start = null, end = null], src) => regexReplace(vm, src as DMObject, hay, repl, start, end));
}
