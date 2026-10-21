// BYOND built-in procs implemented in TS, keyed by proc path. This is the small set the VM tests
// need; the full catalogue is a later chunk. Behaviour measured in BYOND 511 through
// web/tests/dm/natives.dm and lists.dm unless marked "unverified".
//
// Natives get their arguments already bound (named args placed, padded with null to the declared
// count). Default values from DMStandard are NOT applied for natives, so each handles null itself.

import type { NativeProc, VM } from "./interpreter.js";
import { lessThan } from "./interpreter.js";
import { DMList, live } from "./objects.js";
import { OverlayList } from "./appearances.js";
import { DMType } from "./objtree.js";
import { isRegex, regexFind, regexReplace } from "./natives-text.js";
import { DMRuntimeError, NotImplementedError, formatNumberPrecision, fround, stringify, type Value } from "./value.js";

const num = (v: Value, dflt: number): number => (typeof v === "number" ? v : dflt);

function listSrc(src: Value): DMList {
	if (!(src instanceof DMList)) throw new Error("list proc called on a non-list");
	return src;
}

/** BYOND text positions: negative counts from the end, End 0 means "the end". Returns 1-based [start, end). */
function textRange(len: number, start: Value, end: Value): [number, number] {
	let s = Math.trunc(num(start, 1));
	let e = Math.trunc(num(end, 0));
	// Measured: a negative start counts from the end and clamps to 1 (copytext("abc", -10) = "abc"),
	// but a start of exactly 0 matches nothing (copytext = "", findtext = 0).
	if (s < 0) s = Math.max(1, s + len + 1);
	if (e <= 0) e += len + 1;
	if (e > len + 1) e = len + 1;
	return [s, e];
}

function findText(caseSensitive: boolean): NativeProc {
	return (vm, [hay = null, needle = null, start = null, end = null]) => {
		if (typeof hay !== "string") return 0;
		if (isRegex(vm, needle)) return regexFind(needle, hay, start, end);
		const n = stringify(needle);
		const [s, e] = textRange(hay.length, start, end);
		if (s < 1 || s > e) return 0;
		const region = hay.slice(0, e - 1);
		const idx = caseSensitive ? region.indexOf(n, s - 1) : region.toLowerCase().indexOf(n.toLowerCase(), s - 1);
		return idx < 0 ? 0 : idx + 1;
	};
}

/** max()/min(): a single list argument means its items. Measured: a single non-list gives null; null acts as 0. */
function extreme(isMax: boolean): NativeProc {
	return (_vm, args) => {
		let vals = args;
		if (args.length === 1) {
			if (!(args[0] instanceof DMList)) return null;
			vals = args[0].items.map(live);
		}
		if (vals.length === 0) return null;
		let best = vals[0];
		for (let i = 1; i < vals.length; i++) {
			const v = vals[i];
			if (isMax ? lessThan(best, v) : lessThan(v, best)) best = v;
		}
		return best;
	};
}

/** leading space, sign, decimal or 0x hex, exponent; trailing junk ignored; no digits gives null. */
function text2num(t: Value): Value {
	if (typeof t === "number") return t;
	if (typeof t !== "string") return null;
	const m = /^\s*([+-]?)(?:0x([0-9a-f]+)|((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?))/i.exec(t);
	if (!m) return null;
	const sign = m[1] === "-" ? -1 : 1;
	return fround(sign * (m[2] !== undefined ? parseInt(m[2], 16) : parseFloat(m[3])));
}

export function installNatives(vm: VM): void {
	const def = (path: string, fn: NativeProc) => vm.natives.set(path, fn);

	// ---- scheduler ----
	def("/proc/sleep", (vm, [delay]) => {
		vm.requestSleep(typeof delay === "number" ? delay : 0);
		return null;
	});
	// Measured: CRASH(msg) is a runtime error with message msg (catchable; e.name is msg). It aborts
	// the proc that called it, which returns its `.`.
	def("/proc/CRASH", (_vm, [msg]) => {
		throw new DMRuntimeError(stringify(msg ?? null));
	});

	// ---- datum ----
	def("/datum/proc/New", () => null);
	def("/datum/proc/Del", () => null);
	def("/datum/proc/Topic", () => null); // BYOND's default does nothing; tg's overrides call ..() (3x)

	// ---- /list methods ----
	def("/list/proc/Add", (_vm, args, src) => {
		const l = listSrc(src);
		for (const a of args) l.add(a);
		return null; // measured: Add() returns null in 511
	});
	def("/list/proc/Remove", (_vm, args, src) => {
		const l = listSrc(src);
		let any = false;
		for (const a of args) if (l.remove(a)) any = true;
		return any ? 1 : 0;
	});
	def("/list/proc/Find", (_vm, [elem = null, start, end], src) => {
		// Measured: Find() doesn't range-check (Find(x, 5) on a 3-item list is just 0).
		const l = listSrc(src);
		let s = Math.trunc(num(start, 1));
		let e = Math.trunc(num(end, 0));
		if (e <= 0 || e > l.len + 1) e = l.len + 1; // unverified for negative End
		if (s < 1) s = 1; // unverified
		return l.indexOf(elem, s - 1, Math.max(s - 1, e - 1)) + 1;
	});
	def("/list/proc/Copy", (_vm, [start, end], src) => {
		const l = listSrc(src);
		const [from, to] = l.range(start, end);
		return l.copy(from, to);
	});
	def("/list/proc/Cut", (_vm, [start, end], src) => {
		const l = listSrc(src);
		const [from, to] = l.range(start, end);
		l.cut(from, to);
		return null; // unverified return value
	});
	def("/list/proc/Insert", (_vm, [index = null, ...items], src) => {
		const l = listSrc(src);
		const given = Math.trunc(num(index, 0));
		const i = given === 0 ? l.len + 1 : given;
		if (i < 1 || i > l.len + 1) throw new DMRuntimeError("list index out of bounds");
		const before = l.len;
		l.insert(i - 1, items);
		// Measured: returns the index just past the inserted items (Insert(2, x) = 3), except that
		// Insert(0, x) returns 0.
		return given === 0 ? 0 : i + (l.len - before);
	});
	def("/list/proc/Swap", (_vm, [a, b], src) => {
		const l = listSrc(src);
		const i = Math.trunc(num(a, 0));
		const j = Math.trunc(num(b, 0));
		if (i < 1 || i > l.len || j < 1 || j > l.len) throw new DMRuntimeError("list index out of bounds");
		const t = l.items[i - 1];
		if (l instanceof OverlayList) l.touch();
		l.items[i - 1] = l.items[j - 1];
		l.items[j - 1] = t;
		return null;
	});
	def("/list/proc/Join", (_vm, [glue = null, start, end], src) => {
		// Measured BYOND 511 quirk: End is counted from Start, i.e. the items joined are
		// Start .. End+Start-2. Join("-", 1, 3) = "1-2", Join("-", 2, 4) = "2-3-4", Join("-", 2) = "".
		// End 0 with Start 1 is the whole list. (Out-of-range and negative values unverified: clamped.)
		const l = listSrc(src);
		const s = Math.max(1, Math.trunc(num(start, 1)));
		let e = Math.trunc(num(end, 0)) + s - 1;
		if (e === 0 || e > l.len + 1) e = l.len + 1;
		if (e < s) return "";
		return l.items.slice(s - 1, e - 1).map((x) => stringify(live(x))).join(stringify(glue));
	});

	// ---- type checks ----
	def("/proc/isnull", (_vm, [v]) => (v === null ? 1 : 0));
	def("/proc/isnum", (_vm, [v]) => (typeof v === "number" ? 1 : 0));
	def("/proc/istext", (_vm, [v]) => (typeof v === "string" ? 1 : 0));
	def("/proc/islist", (_vm, [v]) => (v instanceof DMList ? 1 : 0));
	def("/proc/ispath", (_vm, args) => {
		const [v, t] = args;
		if (!(v instanceof DMType)) return 0;
		if (args.length < 2 || t === null) return 1;
		return t instanceof DMType && v.isSubtypeOf(t) ? 1 : 0;
	});

	// ---- text ----
	def("/proc/copytext", (_vm, [t, start, end]) => {
		if (typeof t !== "string") return ""; // measured for null
		const [s, e] = textRange(t.length, start, end);
		if (s < 1 || s >= e) return "";
		return t.slice(s - 1, e - 1);
	});
	def("/proc/findtext", findText(false));
	def("/proc/findtextEx", findText(true));
	// Only a-z / A-Z change (measured: the \improper marker's 255 stays 255; JS would make it 376).
	const NON_ASCII = /[^\x00-\x7f]/;
	def("/proc/uppertext", (_vm, [t]) => (typeof t !== "string" ? t : NON_ASCII.test(t) ? t.replace(/[a-z]+/g, (m) => m.toUpperCase()) : t.toUpperCase()));
	def("/proc/lowertext", (_vm, [t]) => (typeof t !== "string" ? t : NON_ASCII.test(t) ? t.replace(/[A-Z]+/g, (m) => m.toLowerCase()) : t.toLowerCase()));
	def("/proc/num2text", (_vm, [n, sig]) => {
		// Measured: num2text(null) and num2text("x") both give "0".
		const x = typeof n === "number" ? n : 0;
		return formatNumberPrecision(x, Math.trunc(num(sig, 6)));
	});
	def("/proc/text2num", (_vm, [t]) => text2num(t));
	// replacetext is case-insensitive, replacetextEx case-sensitive. Unverified: Start/End, regex needles.
	const replaceText = (caseSensitive: boolean): NativeProc => (vm, [hay = null, needle = null, repl = null, start = null, end = null]) => {
		if (typeof hay !== "string") return hay;
		if (isRegex(vm, needle)) return regexReplace(vm, needle, hay, repl, start, end);
		if (needle !== null && typeof needle !== "string") throw new NotImplementedError("replacetext with a regex");
		const n = needle ?? "";
		if (n === "") return hay;
		const r = stringify(repl);
		if (caseSensitive) return hay.split(n).join(r);
		const esc = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		return hay.replace(new RegExp(esc, "gi"), () => r);
	};
	def("/proc/replacetext", replaceText(false));
	def("/proc/replacetextEx", replaceText(true));

	// ---- maths ----
	def("/proc/max", extreme(true));
	def("/proc/min", extreme(false));
	def("/proc/round", (_vm, args) => {
		const a = num(args[0], 0);
		// round(A): floor. round(A, B): nearest multiple of B (measured: round(-7, 5) = -5).
		if (args.length < 2 || args[1] === null) return fround(Math.floor(a));
		const b = num(args[1], 0);
		if (b === 0) return a; // unverified
		return fround(Math.floor(a / b + 0.5) * b);
	});
}
