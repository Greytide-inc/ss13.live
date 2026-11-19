// runtime-vars - The runtime's values and vars: type lookups (T), resources, lists, globals, comparisons,
// vars read as properties, fields and indexes, modify and increment, and the for-loop `next`. Split out of
// runtime.ts, which re-exports all of it (game code still loads only runtime.js as rt).

import { Frame, formatString, cmpGe, cmpGt, cmpLe, cmpLt, type VM } from "../vm/interpreter.js";
import { DMList, DMObject, FieldIC, listAndInPlace, listAssignFrom, listOr, listXor, live } from "../vm/objects.js";
import { add, bitAnd, bitOr, bitXor, subtract } from "../vm/interpreter.js";
import { type Value } from "../vm/value.js";
import { DMType, Resource } from "../vm/objtree.js";
import { GCNode, heap } from "../vm/gc.js";
import { vm } from "./runtime-state.js";

// ---- values ---------------------------------------------------------------------------------------

/** A type path (`/obj/item`). */
export function T(path: string): DMType {
	const t = vm.tree.getType(path);
	if (!t) throw new Error(`no type ${path}`);
	return t;
}
export function rsc(path: string): Resource {
	return new Resource(path, true);
}
export function list(...items: Value[]): DMList {
	return new DMList(items);
}
export function fmt(template: string, vals: Value[]): string {
	return formatString(template, vals);
}
export function world(): Value {
	return vm.world;
}
export function glob(i: number): Value {
	return live(vm.globals[i]);
}
/** a global's index by its source key ("name", or "name#2" for a later global of the same name). */
let globIndex: Map<string, number> | null = null;
function globalIndex(key: string): number {
	if (!globIndex) {
		globIndex = new Map();
		const seen = new Map<string, number>();
		vm.tree.globalNames.forEach((n, i) => {
			const c = (seen.get(n) ?? 0) + 1;
			seen.set(n, c);
			globIndex!.set(c === 1 ? n : `${n}#${c}`, i);
		});
	}
	const i = globIndex.get(key);
	if (i === undefined) throw new Error(`no global ${key}`);
	return i;
}
/** 7f source forms of glob/setGlob/modGlob/incGlob, a global by name. The bundle lowers each literal name to the index form (`$l(872)` = glob); these are the unbundled fallbacks. */
export function gl(name: string): Value {
	return glob(globalIndex(name));
}
export function setGl(name: string, v: Value): Value {
	return setGlob(globalIndex(name), v);
}
export function modGl(name: string, rhs: Value, op: (a: Value, b: Value) => Value): Value {
	return modGlob(globalIndex(name), rhs, op);
}
export function incGl(name: string, d: number, post: boolean): Value {
	return incGlob(globalIndex(name), d, post);
}
export function setGlob(i: number, v: Value): Value {
	vm.setGlobal(i, v);
	return v;
}
export function lt(a: Value, b: Value): boolean {
	return cmpLt(a, b);
}
export function gt(a: Value, b: Value): boolean {
	return cmpGt(a, b);
}
export function le(a: Value, b: Value): boolean {
	return cmpLe(a, b);
}
export function ge(a: Value, b: Value): boolean {
	return cmpGe(a, b);
}
export function neg(v: Value): number {
	return -(typeof v === "number" ? v : 0);
}
/** ++/--: anything that isn't a number counts as 0. */
export function inc(v: Value, d: number): number {
	return (typeof v === "number" ? v : 0) + d;
}
/** `if(lo to hi)` in a switch: only numbers match (VM Op.SwitchCaseRange). */
export function inRange(v: Value, lo: Value, hi: Value): boolean {
	return typeof v === "number" && typeof lo === "number" && typeof hi === "number" && lo <= v && v <= hi;
}

// ---- vars as properties (detranslate) ----------------------------------------------------------------

/**
 * DM var names that are never properties: JS's own meanings (code that duck-types a `length`, `size`, `next`, `value` or
 * `message` must not run a DM read) and the engine's members of objects and lists, which would hide them (`o.loc` is
 * DMAtom's field, `L.len` and `L.copy` DMList's). Game code keeps rt.fv/rt.setFv for these. tests/dt-props.test.mjs checks
 * that this covers every clash.
 */
export const NOT_PROPS: ReadonlySet<string> = new Set([
	"length", "size", "next", "value", "message", "stack", "caller", "arguments", "prototype",
	"type", "loc", "x", "y", "z", "contents", "key", // DMObject, DMAtom, DMAppearance
	"len", "items", "index", "contains", "copy", "cut", "drop", "range", "map", "owner", "sync", // DMList and its views
]);
/** the names that have a property already (a second VM in one process: tests). */
const propNames = new Set<string>();
/**
 * Every DM var name (but NOT_PROPS) becomes a property of every object and list: `o.health` reads and `o.health = v`
 * writes through the same engine path as rt.fv/rt.setFv (VM.readIC/writeIC: deleted objects read null, a var of a
 * deleted object is a runtime error, refcounts and tags kept), with one cache per name instead of one per site. A
 * property read doesn't set the frame's lastDeref (rt.fv does). The accessors sit on
 * plain objects chained above GCNode.prototype, under 1000 per object: V8 turns an object with more properties into a
 * hash table, and a read found in one of those isn't inlined.
 */
export function installVarProps(v: VM): void {
	const fresh: string[] = [];
	for (const t of v.tree.types) for (const k of t.vars.keys()) if (!NOT_PROPS.has(k) && !propNames.has(k)) { propNames.add(k); fresh.push(k); }
	for (let i = 0; i < fresh.length; i += 900) {
		const holder = Object.create(Object.getPrototypeOf(GCNode.prototype)) as object;
		for (const name of fresh.slice(i, i + 900)) {
			const ic = new FieldIC(name);
			Object.defineProperty(holder, name, {
				get(this: Value): Value { return vm.readIC(this, ic); },
				set(this: Value, val: Value): void { vm.writeIC(this, ic, val); },
				configurable: true,
			});
		}
		Object.setPrototypeOf(GCNode.prototype, holder);
	}
	// V8 turns a prototype back into a fast object the first time a read walks through it, but that walk stops at the
	// first prototype made fast before (DMObject's, long before this): a read on a fresh object made from the top holder
	// walks them all. Without it every property read is ~3x slower (measured).
	if (fresh.length !== 0) {
		const probe = Object.create(Object.getPrototypeOf(GCNode.prototype) as object) as Record<string, unknown>;
		for (let k = 0; k < 2; k++) void probe.dtProbe;
	}
}

// ---- vars, indexes ---------------------------------------------------------------------------------

/** `o.name` read through a reference (PushReferenceValue / PushRefAndDereferenceField). */
export function field(f: Frame, o: Value, name: string): Value {
	f.lastDeref = o;
	return vm.getField(o, name);
}
/** `o.name` as an expression (DereferenceField). */
export function get(f: Frame, o: Value, name: string): Value {
	o = live(o);
	f.lastDeref = o;
	return vm.getField(o, name);
}
export function set(f: Frame, o: Value, name: string, v: Value): Value {
	f.lastDeref = o;
	vm.setField(o, name, v);
	return v;
}
/** Bare `name` (src's var). */
export function srcVar(f: Frame, name: string): Value {
	return vm.getField(f.fieldSrc(), name);
}
/** `rt.sv(f, "name")`, a read of a variable of src. The bundle lowers a literal name to srcVarI with its own cache slot; this is the unbundled fallback. */
export function sv(f: Frame, name: string): Value {
	return vm.getField(f.fieldSrc(), name);
}
export function setSrcVar(f: Frame, name: string, v: Value): Value {
	vm.setField(f.fieldSrc(), name, v);
	return v;
}
export { FieldIC };
export function fieldICs(names: string[]): FieldIC[] {
	return names.map((n) => new FieldIC(n));
}
export function fieldI(f: Frame, o: Value, ic: FieldIC): Value {
	f.lastDeref = o;
	return vm.readIC(o, ic);
}
/** `rt.fv(f, "name", o)`, a read of a variable of another object (fieldI by name). The bundle lowers a literal name to fieldQ with its own cache slot; this is the unbundled fallback. */
const fvICs = new Map<string, FieldIC>();
export function fv(f: Frame, name: string, o: Value): Value {
	let ic = fvICs.get(name);
	if (!ic) fvICs.set(name, (ic = new FieldIC(name)));
	f.lastDeref = o;
	return vm.readIC(o, ic);
}
/** fieldI with the cache before the object (what the bundle lowers `rt.fv(f, "name", o)` to, so the object text keeps its column). */
export function fieldQ(f: Frame, ic: FieldIC, o: Value): Value {
	f.lastDeref = o;
	return vm.readIC(o, ic);
}
/** `rt.setFv(f, "name", o, v)`, a write of a variable of another object (setI by name). The bundle lowers a literal name to setQ; this is the unbundled fallback. */
export function setFv(f: Frame, name: string, o: Value, v: Value): Value {
	let ic = fvICs.get(name);
	if (!ic) fvICs.set(name, (ic = new FieldIC(name)));
	f.lastDeref = o;
	vm.writeIC(o, ic, v);
	return v;
}
/** setI with the cache before the object (what the bundle lowers `rt.setFv(f, "name", o, v)` to). */
export function setQ(f: Frame, ic: FieldIC, o: Value, v: Value): Value {
	f.lastDeref = o;
	vm.writeIC(o, ic, v);
	return v;
}
export function getI(f: Frame, o: Value, ic: FieldIC): Value {
	f.lastDeref = o;
	return vm.readIC(o, ic);
}
export function setI(f: Frame, o: Value, ic: FieldIC, v: Value): Value {
	f.lastDeref = o;
	vm.writeIC(o, ic, v);
	return v;
}
/** `o.len` (same value and errors as fieldI with a "len" cache: a list reads straight, everything else goes through getField). */
export function len(f: Frame, o: Value): Value {
	f.lastDeref = o;
	return o instanceof DMList && !heap.check ? o.len : vm.getField(o, "len");
}
/** `world.time` / `world.tick_usage` (fieldI on the world: lastDeref is the world, the read is getField's). */
export function worldTime(f: Frame): Value {
	f.lastDeref = vm.world;
	return vm.getField(vm.world, "time");
}
export function tickUsage(f: Frame): Value {
	f.lastDeref = vm.world;
	return vm.getField(vm.world, "tick_usage");
}
export function srcVarI(f: Frame, ic: FieldIC): Value {
	return vm.readIC(f.fieldSrc(), ic);
}
/** `rt.setSv(f, "name", v)`, a write of a variable of src. The bundle lowers a literal name to setSrcVarI with its own cache slot; this is the unbundled fallback. */
export function setSv(f: Frame, name: string, v: Value): Value {
	vm.setField(f.fieldSrc(), name, v);
	return v;
}
export function setSrcVarI(f: Frame, ic: FieldIC, v: Value): Value {
	vm.writeIC(f.fieldSrc(), ic, v);
	return v;
}
/** `L[i]` through a reference. */
export function at(l: Value, i: Value): Value {
	return vm.getIndex(l, i);
}
/** `L[i]` as an expression (DereferenceIndex). */
export function index(l: Value, i: Value): Value {
	return vm.getIndex(live(l), i);
}
export function setAt(l: Value, i: Value, v: Value): Value {
	vm.setIndex(l, i, v);
	return v;
}

// `x op= y` (VM.modifyRef): a list or matrix on the left changes in place and isn't assigned back.
let inPlace = false;
export function modify(cur: Value, rhs: Value, op: (a: Value, b: Value) => Value): Value {
	inPlace = false;
	if (cur instanceof DMList) {
		switch (op) {
			case add: cur.add(rhs); break;
			case subtract: cur.remove(rhs); break;
			case bitOr:
				if (rhs instanceof DMList) listAssignFrom(cur, listOr(cur, rhs));
				else if (!cur.contains(rhs)) cur.push(rhs);
				break;
			case bitAnd: listAndInPlace(cur, rhs); break;
			case bitXor: listAssignFrom(cur, listXor(cur, rhs)); break;
			default: op(cur, rhs);
		}
		inPlace = true;
		return cur;
	}
	const v = op(cur, rhs);
	if (v instanceof DMObject && cur instanceof DMObject && v !== cur && v.type === cur.type && v.type.path === "/matrix") {
		for (const k of ["a", "b", "c", "d", "e", "f"]) cur.setVar(k, v.getVar(k));
		inPlace = true;
		return cur;
	}
	return v;
}
export function modField(f: Frame, o: Value, name: string, rhs: Value, op: (a: Value, b: Value) => Value): Value {
	f.lastDeref = o;
	const v = modify(vm.getField(o, name), rhs, op);
	if (!inPlace) { f.lastDeref = o; vm.setField(o, name, v); }
	return v;
}
export function modSrcVar(f: Frame, name: string, rhs: Value, op: (a: Value, b: Value) => Value): Value {
	const v = modify(vm.getField(f.fieldSrc(), name), rhs, op);
	if (!inPlace) vm.setField(f.fieldSrc(), name, v);
	return v;
}
export function modAt(l: Value, i: Value, rhs: Value, op: (a: Value, b: Value) => Value): Value {
	const v = modify(vm.getIndex(l, i), rhs, op);
	if (!inPlace) vm.setIndex(l, i, v);
	return v;
}
export function modGlob(i: number, rhs: Value, op: (a: Value, b: Value) => Value): Value {
	const v = modify(live(vm.globals[i]), rhs, op);
	if (!inPlace) vm.setGlobal(i, v);
	return v;
}
/** ++/-- on a var of `o`: returns the old value (post) or the new one. */
export function incField(f: Frame, o: Value, name: string, d: number, post: boolean): Value {
	f.lastDeref = o;
	const old = vm.getField(o, name), nv = inc(old, d);
	f.lastDeref = o;
	vm.setField(o, name, nv);
	return post ? old : nv;
}
export function incSrcVar(f: Frame, name: string, d: number, post: boolean): Value {
	const old = vm.getField(f.fieldSrc(), name), nv = inc(old, d);
	vm.setField(f.fieldSrc(), name, nv);
	return post ? old : nv;
}
export function incAt(l: Value, i: Value, d: number, post: boolean): Value {
	const old = vm.getIndex(l, i), nv = inc(old, d);
	vm.setIndex(l, i, nv);
	return post ? old : nv;
}
export function incGlob(i: number, d: number, post: boolean): Value {
	const old = live(vm.globals[i]), nv = inc(old, d);
	vm.setGlobal(i, nv);
	return post ? old : nv;
}

// ---- for loops ---------------------------------------------------------------------------------------

/** The next item of enumerator `i` (made by an Op.Create*Enumerator), or undefined at the end. */
export function next(f: Frame, i: number): Value | undefined {
	const en = f.enumerators[i];
	return en ? en.next() : undefined;
}
