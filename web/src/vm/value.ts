// Value representation and the primitive semantics that BYOND 511 gives them.
//
//   null        -> JS null
//   number      -> JS number, always a 32-bit float (every arithmetic result goes through Math.fround)
//   text        -> JS string
//   type path   -> the DMType object itself          (e.g. /obj/item)
//   proc path   -> the DMProc object itself          (e.g. /proc/foo)
//   'file'      -> Resource
//   list literal from a var initialiser -> ListLiteral (turned into a fresh DMList per object)
//   datum       -> DMObject                          (objects.ts)
//   list        -> DMList (and its views ArgsList, VarsList)

import { DMProc, DMType, ListLiteral, Resource } from "./objtree.js";
import { DMList, DMObject } from "./objects.js";

export type Value = null | number | string | DMType | DMProc | Resource | ListLiteral | DMObject | DMList;

export const fround = Math.fround;

/** A DM runtime error: BYOND logs it, aborts the current proc (which returns its `.`), and the caller continues. */
export class DMRuntimeError extends Error {
	constructor(message?: string) {
		// deep enough to reach the translated proc that raised it (src/translate/error-lines.ts reads the stack).
		// Runtime errors are rare, so the deeper capture costs nothing per tick.
		const limit = Error.stackTraceLimit;
		Error.stackTraceLimit = 200;
		super(message);
		Error.stackTraceLimit = limit;
	}
	/** DM `throw x`: a catch receives `thrown` itself instead of a new /exception. */
	isThrow = false;
	thrown: Value = null;
	/** the value a catch gets, computed where the error was handled (VM.handleError). */
	caught: Value | undefined = undefined;
	/** the call stack where it happened, when translated code carried it up past that proc (runtime.ts callGen,
	 * callPlain): the /exception and the log use this one instead of the stack at the catch. */
	frames: object[] | undefined = undefined;
	static throwing(v: Value, message: string): DMRuntimeError {
		const e = new DMRuntimeError(message);
		e.isThrow = true;
		e.thrown = v;
		return e;
	}
}

/** A feature the VM doesn't have yet. Never caught by DM-level error handling: it stops the VM. */
export class NotImplementedError extends Error {
	constructor(what: string) {
		super(`not implemented: ${what}`);
	}
}

export function isTruthy(v: Value): boolean {
	if (v === null) return false;
	if (typeof v === "number") return v !== 0; // NaN is true, as in C (unverified in BYOND)
	if (typeof v === "string") return v.length > 0;
	return true;
}

export function typeName(v: Value): string {
	if (v === null) return "null";
	if (typeof v === "number") return "num";
	if (typeof v === "string") return "text";
	if (v instanceof DMType) return "type";
	if (v instanceof DMProc) return "proc";
	if (v instanceof Resource) return "file";
	if (v instanceof DMObject) return "datum";
	return "list";
}

/** Text form used by "[x]" embedding and by text concatenation. */
export function stringify(v: Value): string {
	if (v === null) return "";
	if (typeof v === "string") return v;
	if (typeof v === "number") return formatNumber(v);
	if (v instanceof DMType) return v.path;
	if (v instanceof DMProc) return v.path;
	if (v instanceof Resource) return v.path;
	if (v instanceof DMList) return "/list";
	if (v instanceof DMObject) {
		if (v.deleted || v.type.textNone) return "";
		// Measured: a datum whose `name` is text prints it; no `name` var, or a null one, prints the type path.
		const name = v.hasVar("name") ? v.getVar("name") : v.type.textVar !== null ? v.getVar(v.type.textVar) : null;
		return typeof name === "string" ? name : v.type.textEmpty ? "" : v.type.path;
	}
	throw new NotImplementedError(`stringify ${typeName(v)}`);
}

/** How a value is shown inside error messages: strings quoted, like BYOND's `"a" + 1`. */
export function describe(v: Value): string {
	if (typeof v === "string") return `"${v}"`;
	if (v === null) return "null";
	// Measured: `Undefined operation: /list (/list) * 2`. Objects: unverified, same shape assumed.
	if (v instanceof DMList) return "/list (/list)";
	if (v instanceof DMObject) return `${stringify(v)} (${v.type.path})`;
	return stringify(v);
}

/**
 * BYOND 511 number-to-text: C printf "%g" (6 significant digits, trailing zeros trimmed,
 * exponent form when exp < -4 or >= 6, at least two exponent digits) applied to the float's
 * exact value, with round-half-to-even on exact ties (glibc behaviour: 1234565 -> 1.23456e+06,
 * 1234575 -> 1.23458e+06). Checked against Linux DreamDaemon 511.1385; Windows BYOND prints
 * three exponent digits (1e+006), which we deliberately don't copy.
 * Special cases measured in BYOND: -0 prints "0", NaN prints "-nan", infinities "inf"/"-inf".
 */
export function formatNumber(x: number): string {
	if (x === 0) return "0";
	if (Number.isInteger(x) && x > -1e6 && x < 1e6) return String(x);
	if (x !== x) return "-nan";
	if (x === Infinity) return "inf";
	if (x === -Infinity) return "-inf";
	return formatG(x, 6);
}

const numCache = new Map<number, string>();

/** `num2text(x, precision)`: %g with the given number of significant digits. */
export function formatNumberPrecision(x: number, precision: number): string {
	if (precision === 6) return formatNumber(x);
	if (x === 0) return "0";
	if (x !== x) return "-nan";
	if (x === Infinity) return "inf";
	if (x === -Infinity) return "-inf";
	return formatG(x, Math.max(1, Math.min(precision, 99)));
}

function formatG(x: number, precision: number): string {
	const useCache = precision === 6;
	const cached = useCache ? numCache.get(x) : undefined;
	if (cached !== undefined) return cached;

	const neg = x < 0;
	// Exact decimal digits of the value: toExponential(99) gives 100 significant digits, which is
	// exact for any float32 in the normal range.
	const exact = Math.abs(x).toExponential(99);
	const ePos = exact.indexOf("e");
	let digits = exact.slice(0, ePos).replace(".", "");
	let exp = Number(exact.slice(ePos + 1));

	// Round to `precision` significant digits, half to even.
	const head = digits.slice(0, precision);
	const rest = digits.slice(precision);
	let roundUp = false;
	if (rest[0] > "5") roundUp = true;
	else if (rest[0] === "5") {
		const tail = rest.slice(1);
		const exactHalf = /^0*$/.test(tail);
		roundUp = exactHalf ? Number(head[head.length - 1]) % 2 === 1 : true;
	}
	let n = BigInt(head);
	if (roundUp) n += 1n;
	digits = n.toString();
	if (digits.length > precision) {
		digits = digits.slice(0, precision);
		exp += 1;
	}

	let out: string;
	if (exp < -4 || exp >= precision) {
		let mant = digits[0] + "." + digits.slice(1);
		mant = mant.replace(/\.?0+$/, "");
		const es = Math.abs(exp) < 10 ? "0" + Math.abs(exp) : String(Math.abs(exp));
		out = `${mant}e${exp < 0 ? "-" : "+"}${es}`;
	} else if (exp >= 0) {
		const intPart = digits.slice(0, exp + 1);
		const frac = digits.slice(exp + 1).replace(/0+$/, "");
		out = frac ? `${intPart}.${frac}` : intPart;
	} else {
		const frac = ("0".repeat(-exp - 1) + digits).replace(/0+$/, "");
		out = `0.${frac}`;
	}
	if (neg) out = "-" + out;
	if (!useCache) return out;
	if (numCache.size > 50000) numCache.clear();
	numCache.set(x, out);
	return out;
}

/** `==` / `!=` / switch matching. No coercion: null != 0, "10" != 10. */
export function isEqual(a: Value, b: Value): boolean {
	if (a === b) return true;
	if (a instanceof Resource && b instanceof Resource) return a.path === b.path;
	return false;
}

/**
 * Float -> int for BYOND's integer operators (%, &, |, ^, ~, <<, >>). Truncates toward zero.
 * Measured in 511: values above 2^31 saturate to 2147483647 and below -2^31 to -2147483647,
 * while exactly 2^31 wraps to -2147483648 (x86 overflow). Consistent with a clamp that compares
 * against (float)INT_MAX == 2^31 using `>` before casting.
 */
export function toInt(v: Value): number {
	if (typeof v !== "number") return 0;
	if (v > 2147483648) return 2147483647;
	if (v < -2147483648) return -2147483647;
	if (v !== v || v === 2147483648) return -2147483648;
	return v | 0;
}
