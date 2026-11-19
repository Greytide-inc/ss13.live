// runtime-ops - The runtime's operations: Ref and R (references a DM op writes through), op (a DM operation by
// name, with FAST_OPS and OPS), istype, locate, in, the for-list and for-range loops. Split out of runtime.ts,
// which re-exports all of it (game code still loads only runtime.js as rt).

import { EndProc, Frame, assocList, ListEnumerator, NONE, num, rangeEnumerator } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { ArgsType } from "../vm/args-type.js";
import { DMRuntimeError, NotImplementedError, toInt, type Value } from "../vm/value.js";
import { output } from "../vm/natives-io.js";
import { rgb } from "../vm/natives-misc.js";
import { DMType } from "../vm/objtree.js";
import { vm, enumPool, fullStack } from "./runtime-state.js";

// ---- operations by name ---------------------------------------------------------------------------

/** Ends the current proc if its src was deleted (by del, in something it called). */
export function checkSrc(f: Frame): void {
	const s = f.src;
	if (s !== null && typeof s === "object" && s instanceof DMObject && s.deleted) throw new EndProc(f);
}

/**
 * a NotImplementedError out of something run directly for a plain proc (an rt.op, `>>`, `del` of a list): with
 * vm.lenient it's reported and the operation gives null, as when it ran as an instruction on a frame of its own (the VM
 * logged it and ended that frame). Anything else is thrown on.
 */
export function gap(e: unknown): null {
	if (!(e instanceof NotImplementedError) || !vm.lenient) throw e;
	vm.reportError(e.message, fullStack(), vm.notImplemented, e);
	return null;
}

export const enum RefKind { Field, SrcVar, Index, Glob, Src, Usr, World, None }
/** A place an operation reads or writes (`L[k] << v`, `L[k] >> x`): the owner (Field) or list and index (Index) are the
 * first of the operation's values. */
export class Ref {
	constructor(readonly kind: RefKind, readonly index: number, readonly name: string) {}
}
/** Refs for the operations that take one (never locals: translated procs keep those in JS variables). */
export const R = {
	field: (name: string) => new Ref(RefKind.Field, 0, name),
	srcVar: (name: string) => new Ref(RefKind.SrcVar, 0, name),
	index: new Ref(RefKind.Index, 0, ""),
	glob: (i: number) => new Ref(RefKind.Glob, i, ""),
	src: new Ref(RefKind.Src, 0, ""),
	usr: new Ref(RefKind.Usr, 0, ""),
	world: new Ref(RefKind.World, 0, ""),
	none: new Ref(RefKind.None, 0, ""),
};
/** What `r` holds now. A src var reads through f's bound src without binding it (as the instruction's own frame did). */
export function refGet(f: Frame, r: Ref, vals: Value[]): Value {
	switch (r.kind) {
		case RefKind.Field: f.lastDeref = vals[0]; return vm.getField(vals[0], r.name);
		case RefKind.SrcVar: return vm.getField(f.boundSrc === undefined ? f.src : f.boundSrc, r.name);
		case RefKind.Index: return vm.getIndex(vals[0], vals[1]);
		case RefKind.Glob: return live(vm.globals[r.index]);
		case RefKind.Src: return live(f.src);
		case RefKind.Usr: return live(f.usr);
		case RefKind.World: return vm.world;
		case RefKind.None: return null;
	}
}

/**
 * An operation by name (the translator's `rt.op(f, "Name", operands, vals)`), with its operands and the values it takes.
 * `pushes`: whether the translated code uses its result (all give one; null when there's nothing to give).
 * In a generator proc, use g.op (input() may wait for the page).
 */
export function op(f: Frame, name: string, operands: unknown[], vals: Value[], pushes = true): Value {
	const fast = FAST_OPS[name];
	if (fast !== undefined) return fast(vals, operands);
	const slow = OPS[name];
	if (slow === undefined) throw new Error(`rt.op("${name}"): not an operation the runtime has`);
	let r: Value;
	try {
		r = slow(f, operands, vals);
	} catch (e) {
		r = gap(e);
	}
	checkSrc(f); // something it ran may have deleted f's src (a GC safe point's Del())
	return pushes ? r : null;
}

/** operations that can't run DM code or delete anything (pure, or the RNG): no checks around them. */
const FAST_OPS: Record<string, (vals: Value[], operands: unknown[]) => Value> = {
	Abs: (v) => Math.abs(num(v[0])),
	BitNot: (v) => ~toInt(v[0]) & 0xffff, // LINDA's `atmos_supeconductivity &= ~dir`
	IsType: (v) => (vm.isType(live(v[0]), v[1]) ? 1 : 0),
	// prob(P): true with P% chance. Measured: 0 and below never, 100 and above always.
	Prob: (v) => (typeof v[0] === "number" && vm.rng.next() * 100 < v[0] ? 1 : 0),
	PickUnweighted: (v, o) => {
		const n = o[0] as number;
		if (n !== 1) return v[Math.floor(vm.rng.next() * n)];
		const x = v[0];
		if (!(x instanceof DMList)) return x;
		if (x.len === 0) throw new DMRuntimeError("pick() from empty list"); // unverified wording
		return live(x.items[Math.floor(vm.rng.next() * x.len)]);
	},
	PickWeighted: (kv, o) => {
		// [weight1, value1, weight2, value2, ...] (a missing weight counts as 100)
		const n = o[0] as number;
		let total = 0;
		const cum: number[] = [];
		for (let i = 0; i < n; i++) {
			const w = kv[i * 2];
			total += typeof w === "number" ? w : 100;
			cum.push(total);
		}
		const r = vm.rng.next() * total;
		for (let i = 0; i < n; i++) if (r < cum[i]) return kv[i * 2 + 1];
		return null;
	},
	// maths builtins
	Sqrt: (v) => {
		const x = num(v[0]);
		if (x < 0) throw new DMRuntimeError(`illegal: sqrt(${x.toFixed(6)})`);
		return Math.sqrt(x);
	},
	Sin: (v) => Math.sin((num(v[0]) * Math.PI) / 180),
	Cos: (v) => Math.cos((num(v[0]) * Math.PI) / 180),
	Tan: (v) => Math.tan((num(v[0]) * Math.PI) / 180),
	ArcSin: (v) => (Math.asin(num(v[0])) * 180) / Math.PI,
	ArcCos: (v) => (Math.acos(num(v[0])) * 180) / Math.PI,
	ArcTan: (v) => (Math.atan(num(v[0])) * 180) / Math.PI,
	ArcTan2: (v) => (Math.atan2(num(v[1]), num(v[0])) * 180) / Math.PI,
	Log: (v) => Math.log(num(v[0])) / Math.log(num(v[1])),
	LogE: (v) => Math.log(num(v[0])),
	// `x in a to b` (OpenDream's semantics: non-numbers count as 0; unverified in BYOND)
	IsInRange: (v) => {
		const hi = typeof v[2] === "number" ? v[2] : 0, lo = typeof v[1] === "number" ? v[1] : 0, x = typeof v[0] === "number" ? v[0] : 0;
		return lo <= x && x <= hi ? 1 : 0;
	},
	CreateMultidimensionalList: (v) => vm.newList(v),
};

/** The other operations: output to players and files, animate(), rgb(), for(var/T/x). */
const OPS: Record<string, (f: Frame, operands: unknown[], vals: Value[]) => Value> = {
	Output: (f, o, v) => { output(vm, v[0], v[1]); return null; },
	// browse()/browse_rsc()/output()/link()/ftp() sent to a player: recorded for the page (vm/clients.ts).
	Browse: (f, o, v) => { vm.clients.browse(v[0], v[1], v[2]); return null; },
	BrowseResource: (f, o, v) => { vm.clients.browseRsc(v[0], v[1], v[2]); return null; },
	OutputControl: (f, o, v) => { vm.clients.outputControl(v[0], v[1], v[2]); return null; },
	Link: (f, o, v) => { vm.clients.link(v[0], v[1]); return null; },
	Ftp: (f, o, v) => { vm.clients.ftp(v[0], v[1], v[2]); return null; },
	/** `ref << v`; `savefile[k] << v` is `savefile[k] = v` (OpenDream's Output handler). */
	OutputReference: (f, o, v) => {
		const r = o[0] as Ref, x = v[v.length - 1];
		if (r.kind === RefKind.Index) {
			const indexing = v[0];
			if (indexing instanceof DMObject && indexing.type.special) {
				vm.setIndex(indexing, v[1], x);
				return null;
			}
		}
		output(vm, refGet(f, r, v), x);
		return null;
	},
	/** rgb(): operands [ArgsType, count]. */
	Rgb: (f, o, v) => rgb(vm.popArgs(v, f.args, null, o[0] as ArgsType)),
	/** animate(): operands [ArgsType, count]. */
	Animate: (f, o, v) => { vm.animate(f, o[0] as ArgsType, v); return null; },
	/** for(var/T/x) with no `in` (operand: the enumerator's index). */
	CreateTypeEnumerator: (f, o, v) => {
		const i = o[0] as number;
		if (f.enumerators === NONE) f.enumerators = [];
		f.enumerators[i] = vm.typeEnumerator(v[0]);
		return null;
	},
};

// Named forms of the common VM instructions (same instruction underneath unless it's a one-liner).
export function length(v: Value): number {
	v = live(v);
	return typeof v === "string" ? v.length : v instanceof DMList ? v.len : 0;
}
/** istype(v, T) with a literal T (Op.IsTypeDirect). */
export function istype(v: Value, t: DMType): boolean {
	const vt = vm.typeOf(live(v));
	return vt !== null && vt.isSubtypeOf(t);
}
/** locate(x, y, z) */
export function locate(x: Value, y: Value, z: Value): Value {
	return typeof x === "number" && typeof y === "number" && typeof z === "number" ? vm.map.turfAt(x, y, z) : null;
}
/** `v in L` */
export function isIn(f: Frame, v: Value, l: Value): boolean {
	return vm.isInList(v, l);
}
/** locate(what) in container */
export function locateIn(f: Frame, what: Value, container: Value): Value {
	const r = vm.locateIn(what, container);
	checkSrc(f); // its GC safe point may have run a Del()
	return r;
}
export function initial(f: Frame, owner: Value, name: Value): Value {
	return vm.initialOf(owner, name);
}
export function getStep(f: Frame, ref: Value, dir: Value): Value {
	return vm.map.getStep(live(ref), dir);
}
export function getDir(f: Frame, a: Value, b: Value): Value {
	b = live(b);
	return vm.map.getDir(live(a), b);
}
/** list(k = v, ...) from [k, v, k, v...] */
export function alist(f: Frame, kv: Value[]): Value {
	return assocList(kv);
}
/** `throw v` */
export function throw_(f: Frame, v: Value): never {
	vm.throwValue(v);
}
/** for(x in L) / for(var/T/x in L): sets up enumerator `i` of the frame (read with next()). */
export function forList(f: Frame, i: number, l: Value, filter: DMType | null = null): void {
	// reusing a finished plain proc's enumerator.
	const en = enumPool.length !== 0 ? vm.listEnumeratorReuse(enumPool.pop()!, l, filter) : vm.listEnumerator(l, filter);
	if (f.enumerators === NONE) f.enumerators = i === 0 ? [en] : []; // [en] is exactly one slot ([] then [0] = en takes 17)
	f.enumerators[i] = en;
	checkSrc(f); // a safe point (world loops) may have run a Del()
}
/** The end of a for loop (Op.DestroyEnumerator). a list enumerator is reused by the next loop (only this frame's JS read it). */
export function endFor(f: Frame, i: number): void {
	const en = f.enumerators[i];
	if (en === undefined) return; // never started (a light frame's NONE)
	f.enumerators[i] = null;
	if (en instanceof ListEnumerator) recycle(en);
}
function recycle(en: ListEnumerator): void {
	if (!en.world && enumPool.length < 64) {
		en.release();
		enumPool.push(en);
	}
}
/** for(x in a to b step s) */
export function forRange(f: Frame, i: number, a: Value, b: Value, step: Value): void {
	const en = rangeEnumerator(a, b, step);
	if (f.enumerators === NONE) f.enumerators = i === 0 ? [en] : [];
	f.enumerators[i] = en;
}
