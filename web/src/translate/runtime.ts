// Runtime for translated procs. The files in build/translated/ import this.
//
// A translated proc is `function name(f, ...args)` (can't sleep) or `function* name(f, ...args)` (may
// sleep, per the sleep analysis). `f` is a VM Frame: src, usr, `.` (f.dot) and args live on it, so the
// interpreter's rules for deleted srcs, waitfor = 0, runtime errors and GC apply unchanged.
//
// - Generator procs run as frames of the interpreter's threads (VM.stepGen). Calls, new, del and input()
//   (`yield* g.x(...)`) are made here; the only thing a generator yields to the VM is "suspend" (
//   GenRequest, after a sleep() or an input() that waits), and a `set waitfor = 0` callee that suspends
//   moves to a thread of its own (VM.detach).
// - Plain procs call other plain translated procs and natives directly; a generator proc they call runs on a temporary
//   thread (callGenFromPlain), the way a `set waitfor = 0` call would.
// - GC: plain procs' frames sit on `plainFrames` (= VM.extraFrames, GC roots) while they run and
//   expose their JS locals with `f.vars`; the temporary threads are marked `rootsKnown` so safe points
//   (locate(ref), new /savefile, a Del() candidate's release on return) still run inside them.

import { EndProc, Frame, assocList, genFramePool, ListEnumerator, MOVE_HOOKS, NONE, formatString, cmpGe, cmpGt, cmpLe, cmpLt, num, rangeEnumerator, GenRequest, type NativeProc, type VM } from "../vm/interpreter.js";
import { DMList, DMObject, FieldIC, listAndInPlace, listAssignFrom, listOr, listXor, live } from "../vm/objects.js";
import { add, bitAnd, bitOr, bitXor, subtract } from "../vm/interpreter.js";
import { ArgsType } from "../vm/args-type.js";
import { DMRuntimeError, describe, fround, isTruthy, NotImplementedError, toInt, type Value } from "../vm/value.js";
import { output } from "../vm/natives-io.js";
import { rgb } from "../vm/natives-misc.js";
import { DMProc, DMType, Resource } from "../vm/objtree.js";
import { ProcAttr } from "../vm/json.js";
import type { ProcMeta } from "../vm/json.js";
import { installFastAir } from "./fast-air.js";
import { errorSource, noteBundle } from "./error-lines.js";
// the game files declare the type tree, globals and string table with these (src/vm/typedefs.ts).
export { type, typePath, procRef, globals, maps, procDecls } from "../vm/typedefs.js";
import { declaredPaths, setGlobalInit } from "../vm/typedefs.js";
import { TAIL_MARK, Thread } from "../vm/scheduler.js";
import { setTailStarter } from "../vm/snapshot.js";
import { heap } from "../vm/gc.js";

export { add, subtract, multiply, divide, modulus, power, bitAnd, bitOr, bitXor, shiftLeft, shiftRight } from "../vm/interpreter.js";
export { isTruthy as truthy, isEqual } from "../vm/value.js";
export type { Frame } from "../vm/interpreter.js";
export type { Value } from "../vm/value.js";

type PlainFn = (f: Frame, ...args: Value[]) => Value;
type GenFn = (f: Frame, ...args: Value[]) => Generator<GenRequest, Value, Value>;
type Gen = Generator<GenRequest, Value, Value>;

export { EndProc };

let vm: VM;
/** Frames of the plain procs running now, innermost last (VM.extraFrames: GC roots). */
let plainFrames: Frame[] = [];
/** For each plainFrames entry: vm.running.length when it was pushed (where it sits in the call stack). */

/** the call stack as the interpreter would have it, outermost first: each running thread's frames
 * with the plain frames called from it, minus the stand-in frames of temporary threads (tempThread) that stand in
 * for their caller. Threads the VM started itself (vm.call from a native, world.Error) begin a stack of
 * their own, as in the interpreter. */
function fullStack(): Frame[] {
	const out: Frame[] = [];
	const running = vm.running;
	let k0 = running.length - 1;
	while (k0 > 0 && running[k0].frames[0]?.rethrow) k0--;
	let p = 0;
	while (p < plainFrames.length && plainFrames[p].depth < k0 + 1 && !(k0 === 0 && plainFrames[p].depth === 0)) p++;
	while (p < plainFrames.length && plainFrames[p].depth === 0) out.push(plainFrames[p++]);
	for (let k = Math.max(k0, 0); k < running.length; k++) {
		for (const fr of vm.running[k].frames) if (!fr.rethrow) out.push(fr);
		while (p < plainFrames.length && plainFrames[p].depth === k + 1) out.push(plainFrames[p++]);
	}
	return out;
}
/** the rt.def calls in bundle order; install() matches the i-th to the i-th declared proc (typedefs.procDecls). */
const defs: { path: string; fn: PlainFn | GenFn | undefined; gen: boolean }[] = [];
let nDefs = 0;
const plain: (PlainFn | undefined)[] = [];
/** the generator procs, called inline from other generator procs (callGen). */
const gens: (GenFn | undefined)[] = [];
/** how many JS params each installed proc takes after f (see invoke). */
const nParams: number[] = [];
const natives: (NativeProc | undefined)[] = [];
/** Frames of plain procs (not on any thread) with a translated `try` open, innermost last. */
const openTries: Frame[] = [];

/** fn(f, ...args) without the spread: a translated proc declares exactly its DM args (extra ones are only
 * seen through `args`, i.e. f.args), and `a` is padded to at least n. */
function invoke<R>(fn: (f: Frame, ...args: Value[]) => R, f: Frame, a: Value[], n: number): R {
	switch (n) {
		case 0: return fn(f);
		case 1: return fn(f, a[0]);
		case 2: return fn(f, a[0], a[1]);
		case 3: return fn(f, a[0], a[1], a[2]);
		case 4: return fn(f, a[0], a[1], a[2], a[3]);
		case 5: return fn(f, a[0], a[1], a[2], a[3], a[4]);
		case 6: return fn(f, a[0], a[1], a[2], a[3], a[4], a[5]);
		default: return fn(f, ...a);
	}
}

/**
 * Called by each game file: defines the proc at `path` ("/type/proc/name", "/type/verb/name", "/proc/name" for a global).
 * A second rt.def of the same path (in bundle order: files sorted, then top to bottom) overrides the first. No `fn`:
 * a proc with no body (a BYOND built-in, or an empty proc). `gen`: fn is a generator (it may sleep).
 * `meta`: the proc's other facts (ProcMeta: DM arg names when the parameters aren't them, waitfor, verb settings).
 * The type tree reads it from build/game-types.js (tools/translate-tg.mjs copies it there), not from this call.
 */
export function def(path: string, fn?: PlainFn | GenFn, gen = false, meta?: ProcMeta): void {
	void meta;
	if (hot !== null) return void hot.push({ path, fn, gen }); // hotSwap is loading one file again
	if (defs.length === 0) noteBundle(new Error().stack); // where translated-tg.lines.json is (error-lines.procStart)
	defs.push({ path, fn, gen });
	if (fn) nDefs++;
}

/** The runtime's VM: what translated code reads and calls through (install, or the global init on an interpreter-only VM). */
function attach(v: VM): void {
	if (vm !== v) natives.length = 0; // the natives are this VM's (a second VM in one process: tests)
	vm = v;
	plainFrames = v.extraFrames;
	procByPath.clear();
	const decl = declaredPaths(); // proc id = rt.def position
	for (let i = 0; i < decl.length; i++) procByPath.set(decl[i], i);
}

/**
 * game/_globals.ts's global init (`var/global x = expr`, translated once from the bytecode): `fn(f)`, a generator
 * if `gen`. The VM runs it as a translated frame before the maps load (VM.runGlobalInit).
 */
export function globalInit(fn: PlainFn | GenFn, gen = false): void {
	setGlobalInit((v, p) => {
		if (vm !== v) attach(v as VM); // an interpreter-only VM (install wasn't called)
		(p as DMProc).translated = gen ? (f) => entryGen(fn as GenFn, f, 0) : (f) => entryPlain(fn as PlainFn, f, 0);
	});
}

/**
 * Points every proc of `v`'s tree at its translation. Returns how many were installed. a proc with a body must
 * have one (there's no bytecode to fall back on): "no body" otherwise.
 */
export function install(v: VM): number {
	attach(v);
	v.stackOf = fullStack;
	v.translatedSource = (f, err) => errorSource(err, f.proc.path) ?? errorSource(locateSuspended(f), f.proc.path);
	setTailStarter(startTail);
	let n = 0;
	// Paths to procs once, here: the i-th rt.def is the i-th proc the type tree was declared with (both lists come from
	// the same rt.def statements: build/game-types.js has their paths, build/translated-tg.js the calls).
	const decl = declaredPaths();
	if (v.tree.procs.length !== decl.length) throw new Error(`the tree has ${v.tree.procs.length} procs, the type bundle ${decl.length}: build the tree from typedefs.gameProgram()`);
	if (decl.length !== defs.length) throw new Error(`the proc bundle has ${defs.length} rt.def calls, the type bundle ${decl.length}: rebuild both (node tools/translate-tg.mjs)`);
	for (let i = 0; i < defs.length; i++) {
		const d = defs[i], id = i;
		if (decl[i] !== d.path) throw new Error(`rt.def #${i} is ${d.path} in the proc bundle but ${decl[i]} in the type bundle: rebuild both`);
		const proc = v.tree.procs[id];
		if (!proc || proc.path !== d.path) throw new Error(`translated proc ${id} ${d.path} doesn't match the program (${proc?.path})`);
		if (!d.fn) {
			if (proc.hasBody && !proc.isNative) throw new Error(`rt.def("${d.path}") #${i}: no body (a proc with a body needs its function; there is no bytecode)`);
			continue;
		}
		if (proc.isNative) continue; // the VM replaced this DM proc with a native (VM.overrideWithNative)
		// Its JS params: all of the DM args, or none (a proc that uses `args` reads them from f.args).
		const np = d.fn.length - 1;
		if (np !== 0 && np !== proc.argNames.length) throw new Error(`translated proc ${id} ${d.path} takes ${np} args, the program says ${proc.argNames.length}`);
		nParams[id] = np;
		if (d.gen) {
			const fn = d.fn as GenFn;
			gens[id] = fn;
			proc.translated = (f) => entryGen(fn, f, np);
		} else {
			const fn = d.fn as PlainFn;
			plain[id] = fn;
			proc.translated = (f) => entryPlain(fn, f, np);
		}
		n++;
	}
	for (const t of procTables) {
		for (let k = 0; k < t.paths.length; k++) {
			const id = procByPath.get(t.paths[k]);
			if (id === undefined) throw new Error(`game/${t.file}: P("${t.paths[k]}"): no rt.def has that path`);
			t.procs[k] = v.tree.procs[id];
		}
	}
	return n + installFastAir(v);
}

/** makes `proc` run `fn` (a hand-written stand-in for its translation, src/translate/fast-air.ts); returns the translation. */
export function override(proc: DMProc, fn: PlainFn | GenFn, gen: boolean): PlainFn | GenFn | undefined {
	const id = proc.id, old = gen ? gens[id] : plain[id];
	standIns.add(id);
	if (old === undefined || nParams[id] !== fn.length - 1) throw new Error(`fast-air: can't override ${proc.path} (${old === undefined ? "not translated as " + (gen ? "a generator" : "plain") : "arg count"})`);
	if (gen) {
		gens[id] = fn as GenFn;
		proc.translated = (f) => entryGen(fn as GenFn, f, nParams[id]);
	} else {
		plain[id] = fn as PlainFn;
		proc.translated = (f) => entryPlain(fn as PlainFn, f, nParams[id]);
	}
	return old;
}
/** the rt.def calls of the file hotSwap is loading (null: not loading one). */
let hot: { path: string; fn: PlainFn | GenFn | undefined; gen: boolean }[] | null = null;
/** a proc's text without what an edit elsewhere in its file moves (the bundler's per-file slot numbers and their padding). */
const hotText = (fn: unknown): string => String(fn).replace(/\$(?:[qP]\[\d+\]|M?\.s\d+)/g, "$").replace(/\s+/g, " ");
/** procs running a hand-written stand-in (override): a hot swap leaves them alone. */
const standIns = new Set<number>();
/**
 * hot1 (tools/hot.mjs, a dev server started with --hot): replaces the procs of one game file in the running world, so an
 * edit to a proc's body needs no restart. `js` is the file as the bundle has it (tools/translate-tg.mjs --hot), `firstId`
 * the proc id of its first rt.def and `paths` its rt.def paths in order, both from the build the world was started from:
 * the tool has checked that the file's types, vars and proc list are unchanged, so only bodies differ. `ns` is this module
 * (the file's `rt`). Every call made after this runs the new code; a proc that is asleep, or looping, finishes on the old
 * one. Nothing is replaced if any proc doesn't fit. Returns the procs whose text changed and the ones left alone.
 */
export function hotSwap(ns: unknown, file: string, js: string, firstId: number, paths: string[]): { procs: number; changed: string[]; left: string[] } {
	if (!vm) throw new Error("no world to swap into yet");
	const got: NonNullable<typeof hot> = [];
	hot = got;
	// The file's lines stay where they are (the wrapper is on line 1), so a stack names hot/FILE.ts:line.
	try { ((0, eval)(`(function (rt) {${js}\n})\n//# sourceURL=hot/${file}`) as (rt: unknown) => void)(ns); } finally { hot = null; }
	if (got.length !== paths.length) throw new Error(`${file} has ${got.length} rt.def calls, the running world ${paths.length}: restart`);
	const todo: { id: number; fn: PlainFn | GenFn; gen: boolean; np: number }[] = [], changed: string[] = [], left: string[] = [];
	for (let i = 0; i < got.length; i++) {
		const d = got[i], id = firstId + i, proc = vm.tree.procs[id];
		if (!proc || proc.path !== d.path || paths[i] !== d.path) throw new Error(`${file}: rt.def #${i} is ${d.path}, the running world has ${proc?.path} there: restart`);
		if (!d.fn || proc.isNative) continue;
		if (standIns.has(id)) { left.push(`${d.path} (runs a fast-air stand-in)`); continue; }
		const np = d.fn.length - 1;
		if (np !== 0 && np !== proc.argNames.length) throw new Error(`${d.path} takes ${np} args, the running world says ${proc.argNames.length}: restart`);
		if (hotText(plain[id] ?? gens[id]) !== hotText(d.fn)) changed.push(d.path);
		todo.push({ id, fn: d.fn, gen: d.gen, np });
	}
	for (const { id, fn, gen, np } of todo) {
		nParams[id] = np;
		plain[id] = gen ? undefined : fn as PlainFn;
		gens[id] = gen ? fn as GenFn : undefined;
		vm.tree.procs[id].translated = gen ? (f) => entryGen(fn as GenFn, f, np) : (f) => entryPlain(fn as PlainFn, f, np);
	}
	return { procs: todo.length, changed, left };
}
/** a diff trace is on (every proc entry must go through callPlain/callGen, so fast-air calls nothing directly). */
export function traceHooked(): boolean {
	return enterHook !== null;
}

/** Diff detail mode (src/tools/diff/diary.ts, --diff-trace): called at each DM proc entry that doesn't go through VM.enter (callPlain,
 * callGen), with the padded args. Null (always, outside a diff trace) = one module-variable check per call. */
let enterHook: ((proc: DMProc, src: Value, args: Value[]) => void) | null = null;
export function setEnterHook(h: ((proc: DMProc, src: Value, args: Value[]) => void) | null): void {
	enterHook = h;
}

export function registered(): number {
	return nDefs;
}

function entryGen(fn: GenFn, f: Frame, n: number): Gen {
	return new EntryCall(f, invoke(fn, f, f.args, n)) as unknown as Gen;
}

/**
 * a generator proc entered by the VM: its generator, ending with its `.` when an EndProc for its frame comes out
 * (VM.endTop). An iterator forwarding to the proc's generator rather than a wrapper generator (`yield*` made a
 * generator object per call and a result object per request).
 */
class EntryCall {
	constructor(readonly f: Frame, readonly inner: Gen) {}
	next(v: Value): IteratorResult<GenRequest, Value> {
		try {
			return this.inner.next(v);
		} catch (e) {
			return this.ended(e);
		}
	}
	throw(err: unknown): IteratorResult<GenRequest, Value> {
		try {
			return this.inner.throw(err);
		} catch (e) {
			return this.ended(e);
		}
	}
	return(v: Value): IteratorResult<GenRequest, Value> {
		return this.inner.return(v);
	}
	[Symbol.iterator](): this {
		return this;
	}
	private ended(e: unknown): IteratorResult<GenRequest, Value> {
		if (e instanceof EndProc && e.frame === this.f) return { done: true, value: this.f.dot };
		throw e;
	}
}

function* spawnGen(body: GenFn, f: Frame, vals: Value[]): Gen {
	try {
		return yield* body(f, ...vals);
	} catch (e) {
		if (e instanceof EndProc && e.frame === f) return f.dot;
		throw e;
	}
}

// A plain proc entered by the VM (a native or the host) still gets a frame of its own.
function entryPlain(fn: PlainFn, f: Frame, n: number): Gen {
	return new PlainEntry(fn, f, n) as unknown as Gen;
}
/** entryPlain's one step, as an iterator (was a generator that never yielded). */
class PlainEntry {
	constructor(readonly fn: PlainFn, readonly f: Frame, readonly n: number) {}
	next(): IteratorResult<GenRequest, Value> {
		const f = this.f;
		try {
			return { done: true, value: invoke(this.fn, f, f.args, this.n) };
		} catch (e) {
			if (e instanceof EndProc && e.frame === f) return { done: true, value: f.dot };
			throw e;
		}
	}
	throw(err: unknown): IteratorResult<GenRequest, Value> {
		throw err; // as a generator that hasn't started: it ends, throwing err
	}
	return(v: Value): IteratorResult<GenRequest, Value> {
		return { done: true, value: v };
	}
	[Symbol.iterator](): this {
		return this;
	}
}

// ---- values ---------------------------------------------------------------------------------------

/** A type path (`/obj/item`). */
export function T(path: string): DMType {
	const t = vm.tree.getType(path);
	if (!t) throw new Error(`no type ${path}`);
	return t;
}
/**
 * a proc by its rt.def path ("/proc/playsound", "/obj/item/proc/attack_self"); a type that redefines its own proc
 * has two rt.defs of one path, and the path names the last (the override). In the proc bundle no `P("...")` call is
 * left: tools/translate-tg.mjs turns each into `$P[k]` (the file's procTable, filled once by install), so a call site
 * costs one array load. This lookup is for code outside the bundle.
 */
export function P(path: string): DMProc {
	const id = procByPath.get(path);
	if (id === undefined) throw new Error(`no proc ${path}`);
	return vm.tree.procs[id];
}
/** path -> proc id (the last rt.def of each path), set by install. */
const procByPath = new Map<string, number>();
/** each game file's table of the procs it names (`$P[k]` in the bundle), filled by install. */
const procTables: { file: string; paths: string[]; procs: DMProc[] }[] = [];
/** (The bundler puts `const $P = rt.procTable(file, [paths])` on each file's import line): an array that install fills. */
export function procTable(file: string, paths: string[]): DMProc[] {
	const procs: DMProc[] = new Array(paths.length).fill(null);
	if (hot !== null) { // the world is installed, so fill it now
		for (let k = 0; k < paths.length; k++) {
			const id = procByPath.get(paths[k]);
			if (id === undefined) throw new Error(`game/${file}: P("${paths[k]}"): no rt.def has that path (a new proc needs a restart)`);
			procs[k] = vm.tree.procs[id];
		}
		return procs;
	}
	procTables.push({ file, paths, procs });
	return procs;
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
	return fround(-(typeof v === "number" ? v : 0));
}
/** ++/--: anything that isn't a number counts as 0. */
export function inc(v: Value, d: number): number {
	return fround((typeof v === "number" ? v : 0) + d);
}
/** `if(lo to hi)` in a switch: only numbers match (VM Op.SwitchCaseRange). */
export function inRange(v: Value, lo: Value, hi: Value): boolean {
	return typeof v === "number" && typeof lo === "number" && typeof hi === "number" && lo <= v && v <= hi;
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
/** `rt.gv(f, "name", o)`, a read of a variable of another object, o read through live() first (getI by name). The bundle lowers a literal name to getQ; this is the unbundled fallback. */
export function gv(f: Frame, name: string, o: Value): Value {
	let ic = fvICs.get(name);
	if (!ic) fvICs.set(name, (ic = new FieldIC(name)));
	o = live(o);
	f.lastDeref = o;
	return vm.readIC(o, ic);
}
/** getI with the cache before the object (what the bundle lowers `rt.gv(f, "name", o)` to). */
export function getQ(f: Frame, ic: FieldIC, o: Value): Value {
	o = live(o);
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
	o = live(o);
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
/** `o.len` where o is read through live() first (getI). */
export function getLen(f: Frame, o: Value): Value {
	o = live(o);
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
/** for(k, v in L): L[k] for the key just enumerated. */
export function assocOf(f: Frame, i: number, k: Value): Value {
	const l = (f.enumerators[i] as { list?: DMList | null } | null)?.list;
	const a = l ? l.assocOf(k) : undefined;
	return a === undefined ? null : live(a);
}

// ---- operations by name ---------------------------------------------------------------------------

/** Ends the current proc if its src was deleted (by del, in something it called). */
function checkSrc(f: Frame): void {
	const s = f.src;
	if (s !== null && typeof s === "object" && s instanceof DMObject && s.deleted) throw new EndProc(f);
}

/**
 * a NotImplementedError out of something run directly for a plain proc (an rt.op, `>>`, `del` of a list): with
 * vm.lenient it's reported and the operation gives null, as when it ran as an instruction on a frame of its own (the VM
 * logged it and ended that frame). Anything else is thrown on.
 */
function gap(e: unknown): null {
	if (!(e instanceof NotImplementedError) || !vm.lenient) throw e;
	vm.reportError(e.message, fullStack(), vm.notImplemented, e);
	return null;
}

const enum RefKind { Field, SrcVar, Index, Glob, Src, Usr, World, None }
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
function refGet(f: Frame, r: Ref, vals: Value[]): Value {
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
	// maths builtins: BYOND computes these in double precision, then stores a float
	Sqrt: (v) => {
		const x = num(v[0]);
		if (x < 0) throw new DMRuntimeError(`illegal: sqrt(${x.toFixed(6)})`);
		return fround(Math.sqrt(x));
	},
	Sin: (v) => fround(Math.sin((num(v[0]) * Math.PI) / 180)),
	Cos: (v) => fround(Math.cos((num(v[0]) * Math.PI) / 180)),
	Tan: (v) => fround(Math.tan((num(v[0]) * Math.PI) / 180)),
	ArcSin: (v) => fround((Math.asin(num(v[0])) * 180) / Math.PI),
	ArcCos: (v) => fround((Math.acos(num(v[0])) * 180) / Math.PI),
	ArcTan: (v) => fround((Math.atan(num(v[0])) * 180) / Math.PI),
	ArcTan2: (v) => fround((Math.atan2(num(v[1]), num(v[0])) * 180) / Math.PI),
	Log: (v) => fround(Math.log(num(v[0])) / Math.log(num(v[1]))),
	LogE: (v) => fround(Math.log(num(v[0]))),
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

// ---- calls ------------------------------------------------------------------------------------------

/** How the args of a call were written: `f(a, b)`, `f(a, name = b)` (pairs), `f(arglist(L))`, `..()` with no args (the caller's). */
export const Args = { None: ArgsType.None, Positional: ArgsType.FromStack, Named: ArgsType.FromStackKeyed, List: ArgsType.FromArgumentList, Same: ArgsType.FromProcArguments } as const;
type ArgKind = ArgsType;

function resolveArgs(f: Frame, proc: DMProc | null, vals: Value[], kind: ArgKind): Value[] {
	if (kind === Args.Positional) return vals;
	if (kind === Args.None) return [];
	if (kind === Args.Same) return f.args.slice();
	return vm.popArgs(vals, f.args, proc, kind);
}

function callResolved(f: Frame, proc: DMProc, src: Value, args: Value[]): Value {
	const fn = plain[proc.id];
	if (fn !== undefined) return callPlain(f, proc, fn, src, args);
	if (proc.isNative) {
		const nat = (natives[proc.id] ??= vm.natives.get(proc.path));
		if (!nat) return vm.call(proc, args, src, f.usr); // raises NotImplemented the usual way
		const r = nat(vm, args, src, f.usr);
		vm.yieldDelay = null; // a plain proc can't sleep (the analysis said so): like waitfor = 0
		vm.yieldPrompt = null;
		checkSrc(f);
		return r;
	}
	const gfn = gens[proc.id];
	if (gfn !== undefined) return callGenFromPlain(f, proc, gfn, src, args);
	// A proc with no body: it returns its `.`, null.
	checkSrc(f);
	return null;
}

/**
 * A pooled temporary thread holding only its stand-in frame for the plain caller `f` (callGenFromPlain). The stand-in
 * returns what the callee returns (VM.finishStandIn). If a translated try is open, it has one too: an error in the callee
 * then comes back to the plain caller's try (VM.handleError throws it on); otherwise the callee logs it itself.
 */
function tempThread(f: Frame, src: Value): Thread {
	let t: Thread, fr: Frame;
	if (tempThreads.length !== 0) {
		t = tempThreads.pop()!;
		t.done = false;
		t.result = null;
		fr = tempFrames.pop()!.reuse(f.proc, f.args, src, f.usr);
		t.frames.push(fr);
	} else {
		fr = new Frame(f.proc, f.args, src, f.usr);
		const frames = [fr, fr]; // room for the callee's frame (pop keeps the capacity)
		frames.pop();
		t = new Thread(frames);
		t.rootsKnown = true;
	}
	fr.rethrow = true;
	fr.waitfor = true;
	if (anyTry()) fr.tries = 1;
	return t;
}
/** The end of a call on a temporary thread `t` (stand-in `fr`, callee frame `callee`): the plain caller's result. */
function tempDone(f: Frame, t: Thread, fr: Frame, callee: Frame): Value {
	// a translated callee that waits for its callees (waitfor = 1: never split off to a thread of its own) is finished
	// and nobody's once the thread is done (VM.finishFrame popped it): its frame is reused.
	if (t.done && callee.gen !== null && callee.waitfor && genFramePool.length < 64) genFramePool.push(callee);
	checkSrc(f);
	if (!t.done) return null; // it slept: the thread lives on in the scheduler
	// a finished thread and its stand-in are nobody's now (an error would have left by a throw above); reused by the next call.
	const r = t.result;
	if (tempThreads.length < 16) {
		tempThreads.push(t);
		tempFrames.push(fr);
	}
	return r;
}

/**
 * a plain proc calls a translated generator proc. The callee's frame goes on a temporary thread (tempThread: the
 * stand-in below it stands for the caller: error stacks, the open translated try, a sleep); its first step is made
 * here, not by the VM loop. Almost every call returns in that first step: VM.tempReturned does what the
 * loop's finishFrame/deliver/Return would have. If it asks for an instruction or throws, the VM carries on from that
 * step (VM.resumeTemp) exactly as before: a sleep leaves the thread in the scheduler and the caller gets null.
 */
function callGenFromPlain(f: Frame, proc: DMProc, fn: GenFn, src: Value, args: Value[]): Value {
	if (src !== null && typeof src === "object" && src instanceof DMObject && src.deleted) { checkSrc(f); return null; } // it would end at once (VM.runThread)
	if (args.length < proc.argNames.length) args = padArgs(args, proc.argNames.length);
	if (enterHook !== null) enterHook(proc, src, args);
	const fromNew = proc === newPlainProc;
	newPlainProc = null;
	const t = tempThread(f, src), fr = t.frames[0];
	const f2 = genFramePool.length !== 0 ? genFramePool.pop()!.reuse(proc, args, src, f.usr) : new Frame(proc, args, src, f.usr);
	// VM.enter: the hooks Move() calls don't hold it up (the stand-in is the caller, f.proc)
	if (!f.proc.superProc && f.proc.name === "Move" && MOVE_HOOKS.has(proc.name)) f2.waitfor = false;
	t.frames.push(f2);
	const it = invoke(fn, f2, args, nParams[proc.id]);
	f2.gen = it; // inline callees (callGen) share it
	let r: IteratorResult<GenRequest, Value> | null = null, err: unknown = null, value: Value = null, done = false;
	vm.running.push(t);
	try {
		try {
			r = it.next(null);
			if (r.done) { value = r.value; done = true; }
		} catch (e) {
			if (e instanceof EndProc && e.frame === f2) { value = f2.dot; done = true; }
			else err = e;
		}
		if (done) value = vm.tempReturned(t, value);
	} finally {
		vm.running.pop();
	}
	if (!done) {
		if (fromNew) throw new Error(`${proc.path} slept under a plain proc's new (the caller must be a generator: g.new_)`); // fail loudly, not silently misordered
		// The VM takes over: the frame's generator ends with its `.` on an EndProc (VM.endTop), as entryGen's does.
		const w = new EntryCall(f2, it) as unknown as Gen;
		for (const fr2 of t.frames) if (fr2.gen === it) fr2.gen = w;
		vm.resumeTemp(t, r === null ? null : (r.value as GenRequest), err);
	}
	return tempDone(f, t, fr, f2);
}
/** finished temporary threads (empty) and their stand-in frames, for callGenFromPlain (most never sleep). */
const tempThreads: Thread[] = [];
const tempFrames: Frame[] = [];

/** args with nulls up to n, as one exact-size array (pushing onto the caller's array literal regrew it by 16 slots). */
const NULLS: Value[][] = [];
function padArgs(args: Value[], n: number): Value[] {
	const k = n - args.length;
	return args.concat(NULLS[k] ??= nulls(k));
}
function nulls(k: number): Value[] {
	const z: Value[] = []; // pushed, not new Array(k): that one is holey, and so would be every padded args array
	for (let i = 0; i < k; i++) z.push(null);
	return z;
}

function anyTry(): boolean {
	if (openTries.length > 0) return true;
	const th = vm.running[vm.running.length - 1];
	if (th) for (const fr of th.frames) if (fr.tries !== 0) return true;
	return false;
}

function callPlain(f: Frame, proc: DMProc, fn: PlainFn, src: Value, args: Value[]): Value {
	if (src !== null && typeof src === "object" && src instanceof DMObject && src.deleted) return null;
	if (args.length < proc.argNames.length) args = padArgs(args, proc.argNames.length);
	if (enterHook !== null) enterHook(proc, src, args);
	const f2 = framePool.length !== 0 ? framePool.pop()!.reusePlain(proc, args, src, f.usr) : new Frame(proc, args, src, f.usr);
	f2.depth = vm.running.length;
	const depth = plainFrames.push(f2) - 1;
	let r: Value;
	try {
		r = invoke(fn, f2, args, nParams[proc.id]);
	} catch (e) {
		const stack = e instanceof DMRuntimeError ? fullStack() : null; // f2 still on it
		plainFrames.length = depth;
		while (openTries.length !== 0 && openTries[openTries.length - 1] === f2) openTries.pop();
		if (e instanceof EndProc && e.frame === f2) r = f2.dot;
		else if (e instanceof DMRuntimeError && !anyTry()) {
			// Uncaught: logged (or world.Error), and only this proc ends (VM.handleError).
			vm.logUncaught(e, stack!);
			r = f2.dot;
		} else {
			// A try further out takes it: the /exception names the proc where it happened.
			if (e instanceof DMRuntimeError && e.caught === undefined && e.frames === undefined) e.frames = stack!; // as callGen (the catch closes its try)
			throw e;
		}
	}
	plainFrames.pop(); // f2 is on top (callees cut back to their own depth); cheaper than setting length
	// The length check first: reading index -1 of an empty array is a slow lookup in V8, and this runs after every plain call.
	while (openTries.length !== 0 && openTries[openTries.length - 1] === f2) openTries.pop(); // returned from inside a try
	if (vm.delWatch) vm.frameReturned(f2, r); // frees what only this proc held, as VM.finishFrame does
	// nothing refers to f2 now (an error leaving by `throw e` above may still be carrying it in e.frames: those aren't reused),
	// nor to its list enumerators (only its own JS read them).
	if (framePool.length < 64) framePool.push(f2);
	checkSrc(f);
	return r;
}
/** light frames of plain procs that returned, for the next calls (12M calls per snapshot run; a Frame is ~190 bytes). */
const framePool: Frame[] = [];
/** list enumerators of plain procs that returned (~9M `for (x in L)` loops per snapshot run). */
const enumPool: ListEnumerator[] = [];

/** `name(args)` for a global proc, `..()` or `.()`: `proc` is already known. */
export function call(f: Frame, proc: DMProc | null, src: Value, vals: Value[], kind: ArgKind = Args.Positional): Value {
	if (proc === null) return null; // `..()` with no parent
	return callResolved(f, proc, src, resolveArgs(f, proc, vals, kind));
}
export function callSuper(f: Frame, vals: Value[], kind: ArgKind = Args.Positional): Value {
	return call(f, f.proc.superProc, f.src, vals, kind);
}
export function callSelf(f: Frame, vals: Value[], kind: ArgKind = Args.Positional): Value {
	return call(f, f.proc, f.src, vals, kind);
}
/** `name(args)` on src (bare proc name). */
export function callSrc(f: Frame, name: string, vals: Value[], kind: ArgKind = Args.Positional): Value {
	const proc = vm.findMethod(live(f.src), name);
	return callResolved(f, proc, f.src, resolveArgs(f, proc, vals, kind));
}
/** `obj.name(args)`. */
export function callName(f: Frame, obj: Value, name: string, vals: Value[], kind: ArgKind = Args.Positional): Value {
	obj = live(obj);
	f.lastDeref = obj;
	const proc = vm.findMethod(obj, name);
	return callResolved(f, proc, obj, resolveArgs(f, proc, vals, kind));
}

// ---- per-call-site method caches ------------------------------------------------------------------
// tools/translate-tg.mjs turns each `g.callName` / `g.callSrc` callee whose name argument is a string literal into
// `$.sK` and each `rt.callName` / `rt.callSrc` into `$M.sK` (padded to the same length; V8 reports a property call at the
// property's column, so error positions stay where they were), where `$` / `$M` are the file's object literals of call
// sites (`sK: rt.methodSite("n")`), made once when the bundle loads. Each site remembers the last two (type, proc) pairs it
// saw, so a call usually finds its proc with one or two compares instead of VM.findMethod's Map lookup. Types' proc maps
// never change after loading, so an entry never goes stale. `S6_OLD=1` (node) makes every site the uncached function (A/B).

/** one call site's cache: the last two types `name` was looked up on and the proc found. */
class MethodIC {
	t0: DMType | null | undefined = undefined;
	p0: DMProc | null = null;
	t1: DMType | null | undefined = undefined;
	p1: DMProc | null = null;
	/** findMethod(o, name) for this site's (constant) name. */
	get(o: Value, name: string): DMProc {
		const t = o instanceof DMObject ? o.type : o instanceof DMList ? vm.listType : null;
		if (t === this.t0) return this.p0!;
		if (t === this.t1) return this.p1!;
		return this.miss(o, t, name);
	}
	/** Sites that keep missing (one call site, many types: `A.attackby()`) also get a map of every type they've seen. */
	mega: Map<DMType, DMProc> | null = null;
	misses = 0;
	private miss(o: Value, t: DMType | null, name: string): DMProc {
		let p = this.mega !== null && t !== null ? this.mega.get(t) : undefined;
		if (p === undefined) {
			p = vm.findMethod(o, name); // throws BYOND's error for a non-object (t null), so t0/t1 are never null
			if (this.mega !== null) this.mega.set(t!, p);
			else if (++this.misses > 16) (this.mega = new Map()).set(t!, p);
		}
		this.t1 = this.t0;
		this.p1 = this.p0;
		this.t0 = t;
		this.p0 = p;
		return p;
	}
}
const S6_OLD = typeof process !== "undefined" && process.env?.S6_OLD === "1";
/** one call site of the bundle (`$.sK` / `$M.sK`): n/s/t = g.callName/g.callSrc/g.srcCall, N/S = rt.callName/rt.callSrc. */
export function methodSite(k: string): (...a: never[]) => unknown {
	if (S6_OLD) return k === "n" ? g.callName : k === "s" ? g.callSrc : k === "t" ? g.srcCall : k === "N" ? callName : callSrc;
	const ic = new MethodIC();
	if (k === "n") return (f: Frame, obj: Value, name: string, vals: Value[], kind: ArgKind = Args.Positional): GenLike => {
		const o = live(obj);
		return gCallName(f, obj, o, ic.get(o, name), name, vals, kind);
	};
	if (k === "s") return (f: Frame, name: string, vals: Value[], kind: ArgKind = Args.Positional): GenLike =>
		gCallSrc(f, ic.get(live(f.src), name), name, vals, kind);
	if (k === "t") return (f: Frame, name: string, ...vals: Value[]): GenLike =>
		gCallSrc(f, ic.get(live(f.src), name), name, vals, Args.Positional);
	if (k === "N") return (f: Frame, obj: Value, name: string, vals: Value[], kind: ArgKind = Args.Positional): Value => {
		obj = live(obj);
		f.lastDeref = obj;
		const proc = ic.get(obj, name);
		return callResolved(f, proc, obj, resolveArgs(f, proc, vals, kind));
	};
	if (k === "S") return (f: Frame, name: string, vals: Value[], kind: ArgKind = Args.Positional): Value => {
		const proc = ic.get(live(f.src), name);
		return callResolved(f, proc, f.src, resolveArgs(f, proc, vals, kind));
	};
	throw new Error(`methodSite: unknown site kind ${k}`);
}
/** `new type(args)`. */
export function new_(f: Frame, type: Value, vals: Value[], kind: ArgKind = Args.Positional): Value {
	return newPlain(f, type, null, vals, kind);
}
/** `new type{var = value}(args)`: ov is the compiler's JSON text of the var overrides. */
export function newOv(f: Frame, type: Value, ov: string, vals: Value[], kind: ArgKind = Args.Positional): Value {
	return newPlain(f, type, ov, vals, kind);
}
/**
 * `new` from a plain proc, as Op.CreateObject did it: the object, then its (init) proc, then New(), each called
 * like any call from a plain proc (callResolved: a generator callee goes on a temporary thread); `new` is the object.
 * A type with a Del() of its own: between the calls the object is held in f.locals (a GC root), so a callee's release
 * check can't free it.
 */
/** The (init)/New proc newPlain is calling right now (callGenFromPlain reads it on entry: a sleep there is a bug in the caller's translation). */
let newPlainProc: DMProc | null = null;
function newPlain(f: Frame, tv: Value, ov: string | null, vals: Value[], kind: ArgKind): Value {
	const type = vm.newType(tv);
	if (type === vm.listType || type.isSubtypeOf(vm.listType)) return vm.newList(resolveArgs(f, null, vals, kind));
	const np = type.procs.get("New") ?? null;
	const newProc = np !== null && !(np.isNative && np.path === "/datum/proc/New") ? np : null;
	const init = type.initProc;
	const args = resolveArgs(f, np, vals, kind);
	const obj = vm.newBare(type, args, ov);
	const held = vm.hasUserDel(type);
	if (held) hold(f, obj);
	try {
		let end: EndProc | null = null;
		if (init) {
			try {
				newPlainProc = plain[init.id] === undefined ? init : null; callResolved(f, init, obj, []);
			} catch (e) {
				if (!(e instanceof EndProc && e.frame === f)) throw e;
				end = e; // (init) deleted the caller's src: New() still runs (as on a thread), then the caller ends
			}
		}
		if (newProc !== null) { newPlainProc = plain[newProc.id] === undefined ? newProc : null; callResolved(f, newProc, obj, args); }
		if (end !== null) throw end;
		return obj;
	} finally {
		if (held) unhold(f, obj);
	}
}
/** keeps `o` reachable from f (a GC root) while `new` runs its procs: f.locals, which plain/generator frames don't use. */
function hold(f: Frame, o: DMObject): void {
	if (f.locals === NONE) f.locals = [o];
	else f.locals.push(o);
}
function unhold(f: Frame, o: DMObject): void {
	const l = f.locals;
	const k = l.lastIndexOf(o);
	if (k >= 0) l.splice(k, 1);
	if (l.length === 0 && l !== NONE) f.locals = NONE;
}
/**
 * `new` from a generator proc (g.new_/g.newOv): as newPlain, with the calls made by callFromGen (they may sleep).
 * every type, as Op.CreateObject did it (the object, its (init) proc, then New(); `new` is the object).
 */
function gNew(f: Frame, tv: Value, ov: string | null, vals: Value[], kind: ArgKind): GenLike {
	const type = vm.newType(tv);
	if (type === vm.listType || type.isSubtypeOf(vm.listType)) return imm(vm.newList(resolveArgs(f, null, vals, kind)));
	const np = type.procs.get("New") ?? null;
	const newProc = np !== null && !(np.isNative && np.path === "/datum/proc/New") ? np : null;
	const init = type.initProc;
	const args = resolveArgs(f, np, vals, kind);
	const obj = vm.newBare(type, args, ov);
	if (vm.hasUserDel(type)) return newHeld(f, obj, init, newProc, args);
	let end: EndProc | null = null;
	if (init) {
		let r: GenLike;
		try {
			r = callFromGen(f, init, obj, []);
		} catch (e) {
			if (!(e instanceof EndProc && e.frame === f)) throw e;
			end = e;
			r = IMM;
		}
		if (r !== IMM) return newRest(f, r, obj, newProc, args);
	}
	if (newProc !== null) {
		const r = callFromGen(f, newProc, obj, args);
		if (r !== IMM) return newTail(r, obj, end);
	}
	if (end !== null) throw end;
	return imm(obj);
}
/**
 * gNew for a type with a Del() of its own (only the DM tests have one): between the calls the object would be only on
 * the JS stack, and a callee's release check (VM.frameReturned) could free it. Op.CreateObject had it on the thread (New()'s
 * frame, then the caller's stack): here it waits on the caller's stack, a GC root, until `new` is done.
 */
function* newHeld(f: Frame, obj: DMObject, init: DMProc | null, newProc: DMProc | null, args: Value[]): Gen {
	hold(f, obj);
	try {
		let end: unknown = null;
		if (init) {
			try {
				yield* callFromGen(f, init, obj, []);
			} catch (e) {
				if (!(e instanceof EndProc && e.frame === f)) throw e;
				end = e;
			}
		}
		if (newProc !== null) yield* callFromGen(f, newProc, obj, args);
		if (end !== null) throw end;
		return obj;
	} finally {
		unhold(f, obj);
	}
}
/** gNew after an (init) proc that didn't finish at once (a generator proc, or a native that sleeps). */
function* newRest(f: Frame, r: GenLike, obj: DMObject, newProc: DMProc | null, args: Value[]): Gen {
	let end: unknown = null;
	try {
		yield* r;
	} catch (e) {
		if (!(e instanceof EndProc && e.frame === f)) throw e;
		end = e;
	}
	if (newProc !== null) yield* callFromGen(f, newProc, obj, args);
	if (end !== null) throw end;
	return obj;
}
/** gNew after a New() that didn't finish at once. */
function* newTail(r: GenLike, obj: DMObject, end: EndProc | null): Gen {
	yield* r;
	if (end !== null) throw end;
	return obj;
}
/**
 * `call(proc)(args)` (id undefined) or `call(obj, name or proc)(args)`: the proc Op.CallStatement would call (VM.callTarget,
 * with its errors) and its src (the caller's for `call(proc)`).
 */
function callDynTarget(f: Frame, source: Value, id: Value | undefined): [DMProc, Value] {
	if ((id === undefined) !== source instanceof DMProc && source !== null) throw new Error(`translated call() guessed the wrong form (source ${source})`);
	const src = live(source);
	const proc = vm.callTarget(src, id);
	return [proc, src instanceof DMProc ? f.src : src];
}
export function callDyn(f: Frame, source: Value, id: Value | undefined, vals: Value[], kind: ArgKind = Args.Positional): Value {
	const [proc, src] = callDynTarget(f, source, id);
	return callResolved(f, proc, src, resolveArgs(f, proc, vals, kind));
}
/** `L >> x` (savefiles): what the VM reads from L (a ref, or `value` held in one of our variables). */
export function input(f: Frame, lref: Ref | null, value: Value, vals: Value[]): Value {
	// `L >> R`: only savefiles. `S[k] >> v` is `v = S[k]`, `S >> v` reads the cd directory.
	let v: Value;
	try {
		if (lref !== null && lref.kind === RefKind.Index) {
			const indexing = vals[0];
			if (!(indexing instanceof DMObject && indexing.type.special)) throw new NotImplementedError(`>> from ${describe(indexing)}`);
			v = vm.getIndex(indexing, vals[1]);
		} else {
			const src = lref === null ? value : refGet(f, lref, vals);
			if (!(src instanceof DMObject && src.type.special)) throw new NotImplementedError(`>> from ${describe(src)}`);
			v = src.type.special.input(src);
		}
	} catch (e) {
		v = gap(e);
	}
	checkSrc(f);
	return v;
}
/**
 * `del v` as Op.DeleteObject did it: Del() (if it has one of its own), then the object is marked deleted (also after an
 * error in Del()), and the caller ends if it was its src. What delHere leaves: a Del() that is a generator proc runs on a
 * temporary thread (callGenFromPlain; if it sleeps, the object is marked deleted when it ends), a Del() with no body,
 * and `del` of a list (not done: gap).
 */
export function del(f: Frame, v: Value): void {
	if (delHere(f, v)) return;
	const o = live(v);
	if (!(o instanceof DMObject)) {
		gap(new NotImplementedError("del(list)"));
		return;
	}
	const d = o.type.procs.get("Del")!;
	const gfn = gens[d.id];
	if (gfn !== undefined) {
		const n = nParams[d.id];
		callGenFromPlain(f, d, function* (fr: Frame, ...a: Value[]): Gen {
			try {
				return yield* invoke(gfn, fr, a, n);
			} finally {
				vm.markDeleted(o);
			}
		}, o, []);
	} else vm.markDeleted(o);
	checkSrc(f);
}
/**
 * `del v` when its Del() (if any) is a plain translated proc: Del(), then the object is marked deleted (also after an
 * error in Del()), and the caller ends if it was its src. False: del()/gDel do it.
 */
function delHere(f: Frame, v: Value): boolean {
	const o = live(v);
	if (!(o instanceof DMObject)) return !(o instanceof DMList);
	const d = o.type.procs.get("Del");
	if (d !== undefined && !d.isNative) {
		const fn = plain[d.id];
		if (fn === undefined) return false;
		try {
			callPlain(f, d, fn, o, []);
		} finally {
			vm.markDeleted(o);
		}
	} else vm.markDeleted(o);
	checkSrc(f);
	return true;
}
export function spawn(f: Frame, delay: Value, body: GenFn, ...vals: Value[]): void {
	const d = typeof delay === "number" ? delay : 0;
	const c = f.cloneForSpawn();
	// own copies of the list enumerators (a plain proc's go back to enumPool when it returns; the copies keep the same lists alive)
	const ens = c.enumerators;
	for (let k = 0; k < ens.length; k++) {
		const en = ens[k];
		if (en instanceof ListEnumerator) ens[k] = new ListEnumerator(en.items.slice(), en.list, en.filter, vm, en.world);
	}
	c.gen = spawnGen(body, c, vals);
	const t = new Thread();
	t.rootsKnown = true;
	t.frames.push(c);
	if (d < 0) vm.run(t);
	else vm.sched.schedule(t, d);
}

/**
 * tails. A sleeping generator can't go in a world snapshot, so where the lobby snapshot would catch a proc asleep, the
 * code after the sleep is a named tail: `rt.tail(name, function* (f, ...values) {...})` at the top level of the game file,
 * started by `return yield* rt.sleepThen(f, delay, name, [values])` (sleep, then run the tail in this frame and return what
 * it returns) or `rt.spawnTail(f, delay, name, ...values)` (spawn(delay) whose body is the tail). While it waits, the frame
 * holds [TAIL_MARK, name, ...values] in `locals`: plain data, which vm/snapshot.ts saves instead of the generator.
 */
const tails = new Map<string, GenFn>();
export function tail(name: string, fn: GenFn): void {
	if (tails.has(name) && hot === null) throw new Error(`rt.tail("${name}") defined twice`); // a reloaded file replaces its tails
	tails.set(name, fn);
}
function tailFn(name: string): GenFn {
	const fn = tails.get(name);
	if (fn === undefined) throw new Error(`no rt.tail("${name}")`);
	return fn;
}
function* runTail(f: Frame): Gen {
	const l = f.locals;
	f.locals = NONE;
	return yield* tailFn(l[1] as string)(f, ...l.slice(2));
}
/** A frame holding [TAIL_MARK, name, ...values] (spawnTail, or a saved/loaded snapshot's) gets the generator that runs the tail. */
function startTail(f: Frame): void {
	tailFn(f.locals[1] as string);
	f.gen = new EntryCall(f, runTail(f)) as unknown as Gen;
}
export function* sleepThen(f: Frame, delay: Value, name: string, vals: Value[]): Gen {
	const fn = tailFn(name);
	f.locals = [TAIL_MARK, name, ...vals];
	yield* g.call(f, P("/proc/sleep"), null, [delay]);
	f.locals = NONE;
	return yield* fn(f, ...vals);
}
/** A sleep inside a loop that a snapshot may be saved during (mid-round snapshots, tools/make-snapshot.mjs): while it sleeps,
 *  the frame holds tail `name` with `vals`, so a saved (or just-saved) world restarts that tail, which must be the loop's next
 *  iteration from the top. Only for a sleep followed by `continue` or the end of the loop body. */
export function* sleepKeep(f: Frame, delay: Value, name: string, vals: Value[]): Gen {
	tailFn(name);
	f.locals = [TAIL_MARK, name, ...vals];
	yield* g.call(f, P("/proc/sleep"), null, [delay]);
	f.locals = NONE;
	return null;
}
export function spawnTail(f: Frame, delay: Value, name: string, ...vals: Value[]): void {
	const d = typeof delay === "number" ? delay : 0;
	const c = f.cloneForSpawn();
	const ens = c.enumerators;
	for (let k = 0; k < ens.length; k++) {
		const en = ens[k];
		if (en instanceof ListEnumerator) ens[k] = new ListEnumerator(en.items.slice(), en.list, en.filter, vm, en.world);
	}
	c.locals = [TAIL_MARK, name, ...vals];
	startTail(c);
	const t = new Thread();
	t.rootsKnown = true;
	t.frames.push(c);
	if (d < 0) vm.run(t);
	else vm.sched.schedule(t, d);
}

/**
 * what the g.* call helpers return for `yield* g.x(...)`. A call made here that can't sleep (a plain proc, a
 * native that didn't sleep) returns IMM, an iterator that's done at once with the value: no generator objects. The
 * one result object is reused: yield* reads it straight away, before anything else can run.
 */
type GenLike = Iterator<GenRequest, Value, Value> & Iterable<GenRequest, Value, Value>;
const IMM_RESULT: IteratorReturnResult<Value> = { done: true, value: null };
const IMM: GenLike = {
	next() { return IMM_RESULT; },
	[Symbol.iterator]() { return this; },
};
function imm(v: Value): GenLike {
	IMM_RESULT.value = v;
	return IMM;
}
/**
 * suspends the generator proc (a native it called asked to: VM.yieldDelay is set) and returns what it resumes with:
 * `value`, the native's result, unless an input() answer replaced it.
 */
function* req(value: Value): Gen {
	const r = new GenRequest(value);
	for (;;) try { return yield r; } catch (e) { probe(e); } // see locateSuspended
}

/**
 * where a translated generator proc waits, for an error raised by the request it yielded (the proc isn't on the JS
 * stack then). PROBE is thrown into it: req (the one place a generator proc yields) catches it at its yield, records a
 * JS stack (which shows the proc's line, at its `yield*`) and yields the same request again, so the generator is left
 * exactly where it was. Only for a frame that has suspended (what it resumes with waits on its stack; a frame that
 * hasn't started yet must not be thrown into); a running generator just throws a TypeError.
 */
const PROBE = { probe: "5b" };
let probed: Error | null = null;
function probe(e: unknown): void {
	if (e !== PROBE) throw e;
	probed = new Error("5b probe");
}
export function locateSuspended(f: Frame): Error | null {
	if (f.gen === null || f.resume === undefined) return null;
	probed = null;
	try {
		f.gen.throw(PROBE);
	} catch {
		return null;
	}
	const p = probed;
	probed = null;
	return p;
}

/**
 * a call from a generator proc to `proc`, made here: a plain translated proc (callPlain), a native, or a generator
 * proc run inline (callGen). every call (the VM made the rest before): `set waitfor = 0` callees and the hooks the
 * built-in Move() calls run in place too (callGen with `own`), and a proc with no body returns null.
 */
function callFromGen(f: Frame, proc: DMProc, src: Value, args: Value[]): GenLike {
	const id = proc.id;
	const fn = plain[id];
	if (fn !== undefined) return imm(callPlain(f, proc, fn, src, args));
	const gfn = gens[id];
	if (gfn !== undefined) {
		// `set waitfor = 0` callees (their caller goes on when they sleep) and the hooks the built-in Move() calls (VM.enter).
		if ((proc.attributes & ProcAttr.DisableWaitfor) !== 0) return callGen(f, proc, gfn, src, args, true);
		if (f.proc.name === "Move" && !f.proc.superProc && MOVE_HOOKS.has(proc.name)) return callGen(f, proc, gfn, src, args, true);
		return callGen(f, proc, gfn, src, args, false);
	}
	if (proc.isNative) {
		const nat = (natives[id] ??= vm.natives.get(proc.path));
		if (nat === undefined) return imm(vm.call(proc, args, src, f.usr)); // raises NotImplemented the usual way
		const r = nat(vm, args, src, f.usr);
		// It wants to sleep (sleep(), input()...): the generator suspends; runThread then suspends the thread.
		if (vm.yieldDelay !== null) return req(r);
		checkSrc(f);
		return imm(r);
	}
	// A proc with no body (`rt.def` without a function): it returns its `.`, null.
	if (enterHook !== null) enterHook(proc, src, args.length < proc.argNames.length ? padArgs(args, proc.argNames.length) : args);
	return imm(null);
}

/**
 * a generator proc called from a generator proc runs inside the caller's generator (yield*) instead of on a VM
 * frame of its own. Its frame still goes on the thread (stacks, sleeps, tries, GC see it as usual) and shares the
 * caller's generator, so VM.stepGen steps it as the top frame; what VM.enter/finishFrame/handleError do for a
 * frame is done here (VM.endTop ends it with an EndProc when the VM has to).
 */
function callGen(f: Frame, proc: DMProc, fn: GenFn, src: Value, args: Value[], own: boolean): GenLike {
	if (args.length < proc.argNames.length) args = padArgs(args, proc.argNames.length);
	if (enterHook !== null) enterHook(proc, src, args);
	const f2 = genFramePool.length !== 0 ? genFramePool.pop()!.reuse(proc, args, src, f.usr) : new Frame(proc, args, src, f.usr);
	vm.running[vm.running.length - 1].frames.push(f2);
	const it = callPool.length !== 0 ? callPool.pop()! : new InlineCall();
	it.f = f;
	it.f2 = f2;
	it.inner = invoke(fn, f2, args, nParams[proc.id]);
	it.own = own;
	if (own) {
		f2.waitfor = false; // (a Move() hook: VM.enter's rule)
		f2.gen = it.inner; // its inline callees share its own generator: it can go to a thread of its own
	} else f2.gen = f.gen;
	return it;
}

/**
 * what callGen returns for the caller's `yield*`: the callee's generator wrapped in a small reusable iterator
 * instead of a generator of its own (a generator object per call, plus a result object per request passing
 * through it). next/throw forward to the callee; its errors and its end are handled as callGen's
 * try/catch and tail did. (yield* never calls return() here: the VM ends procs by throwing EndProc.)
 */
class InlineCall implements Iterator<GenRequest, Value, Value> {
	f: Frame = null!;
	f2: Frame = null!;
	inner: Gen = null!;
	/** f2 runs its own generator (waitfor = 0, or a Move() hook): when it asks to suspend, it goes to a thread of its own. */
	own = false;
	next(v: Value): IteratorResult<GenRequest, Value> {
		let r: IteratorResult<GenRequest, Value>;
		try {
			r = this.inner.next(v);
		} catch (e) {
			return this.finish(this.caught(e));
		}
		return r.done ? this.finish(r.value) : this.own ? this.detach(r.value) : r;
	}
	throw(err: unknown): IteratorResult<GenRequest, Value> {
		let r: IteratorResult<GenRequest, Value>;
		try {
			r = this.inner.throw(err);
		} catch (e) {
			return this.finish(this.caught(e));
		}
		return r.done ? this.finish(r.value) : this.own ? this.detach(r.value) : r;
	}
	return(v: Value): IteratorResult<GenRequest, Value> {
		return this.inner.return(v);
	}
	[Symbol.iterator](): this {
		return this;
	}
	/** An error out of the callee: its `.` if it ends here, else thrown on. */
	private caught(e: unknown): Value {
		const f2 = this.f2;
		// The thread may have changed (a sleep moved these frames to a thread of their own): it's the running one.
		const frames = vm.running[vm.running.length - 1].frames;
		const k = frames.lastIndexOf(f2);
		if (e instanceof EndProc && e.frame === f2) return f2.dot;
		if (e instanceof DMRuntimeError && e.caught === undefined) {
			// Raised by f2's own JS (VM.handleError would see it on f2): f2 is still on the thread.
			const stack = (e.frames as Frame[] | undefined) ?? vm.reportFrames(k >= 0 ? frames.slice(0, k + 1) : frames);
			if (!frames.some((fr) => fr.tries > 0)) {
				// Uncaught: logged (or world.Error), and only this proc ends.
				if (k >= 0) frames.length = k + 1;
				vm.logUncaught(e, stack);
				return f2.dot;
			}
			e.frames = stack; // a try further down takes it: the /exception names this proc
			if (k >= 0) frames.length = k;
			throw e;
		}
		if (k >= 0) frames.length = k;
		throw e;
	}
	/** The callee returned r (or ended): pop its frame, then the caller goes on. */
	private finish(r: Value): IteratorResult<GenRequest, Value> {
		const f = this.f, f2 = this.f2;
		this.f = this.f2 = null!;
		this.inner = null!;
		const frames = vm.running[vm.running.length - 1].frames;
		let clean = false;
		if (frames[frames.length - 1] === f2) { frames.pop(); clean = true; }
		else { const k = frames.lastIndexOf(f2); if (k >= 0) frames.length = k; }
		vm.frameReturned(f2, r); // VM.finishFrame's release check
		// popped from the top as usual: no thread or error refers to it any more (errors leave by the throws above).
		if (clean && genFramePool.length < 64) genFramePool.push(f2);
		checkSrc(f);
		callPool.push(this); // done: yield* drops it once it has read the result
		CALL_DONE.value = r;
		return CALL_DONE;
	}
	/**
	 * an `own` callee asked to suspend (its first sleep): its frames (it and its inline callees) go to a new thread that
	 * sleeps (VM.detach), and the caller carries on with the callee's current `.`, as VM.suspend did for a waitfor = 0 frame.
	 * Its generator is then stepped by the VM, ending with its `.` on an EndProc for its frame (EntryCall, as entryGen's).
	 */
	private detach(q: GenRequest): IteratorResult<GenRequest, Value> {
		const f = this.f, f2 = this.f2, it = this.inner;
		this.f = this.f2 = null!;
		this.inner = null!;
		const th = vm.running[vm.running.length - 1];
		const w = new EntryCall(f2, it) as unknown as Gen;
		const frames = th.frames;
		for (let k = frames.length - 1; k >= 0 && frames[k].gen === it; k--) frames[k].gen = w;
		vm.detach(th, f2, q.value);
		callPool.push(this);
		checkSrc(f); // VM.deliver: a caller whose src was deleted meanwhile ends
		CALL_DONE.value = f2.dot;
		return CALL_DONE;
	}
}
/** The result InlineCall ends with (read by yield* at once, like IMM_RESULT). */
const CALL_DONE: IteratorReturnResult<Value> = { done: true, value: null };
const callPool: InlineCall[] = [];

/** Helpers for generator procs (`yield* g.x(...)`): same meaning as above, but DM code they start may sleep. */
/** g.callSrc once the proc is found (also the cached call sites). */
function gCallSrc(f: Frame, proc: DMProc, name: string, vals: Value[], kind: ArgKind): GenLike {
	return callFromGen(f, proc, f.src, resolveArgs(f, proc, vals, kind));
}
/** g.callName once the proc is found on `o` (= live(obj)) (also the cached call sites). */
function gCallName(f: Frame, obj: Value, o: Value, proc: DMProc, name: string, vals: Value[], kind: ArgKind): GenLike {
	f.lastDeref = o;
	return callFromGen(f, proc, o, resolveArgs(f, proc, vals, kind));
}
export const g = {
	call(f: Frame, proc: DMProc | null, src: Value, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		if (proc === null) return imm(null);
		return callFromGen(f, proc, src, resolveArgs(f, proc, vals, kind));
	},
	/** `..()` */
	callSuper(f: Frame, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		return g.call(f, f.proc.superProc, f.src, vals, kind);
	},
	/** `.()` */
	callSelf(f: Frame, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		return g.call(f, f.proc, f.src, vals, kind);
	},
	callSrc(f: Frame, name: string, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		return gCallSrc(f, vm.findMethod(live(f.src), name), name, vals, kind);
	},
	callName(f: Frame, obj: Value, name: string, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		const o = live(obj);
		return gCallName(f, obj, o, vm.findMethod(o, name), name, vals, kind);
	},
	/** `g.srcCall(f, "name", a, b)` = `g.callSrc(f, "name", [a, b])` (positional arguments as rest parameters). */
	srcCall(f: Frame, name: string, ...vals: Value[]): GenLike {
		return gCallSrc(f, vm.findMethod(live(f.src), name), name, vals, Args.Positional);
	},
	new_(f: Frame, type: Value, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		return gNew(f, type, null, vals, kind);
	},
	newOv(f: Frame, type: Value, ov: string, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		return gNew(f, type, ov, vals, kind);
	},
	callDyn(f: Frame, source: Value, id: Value | undefined, vals: Value[], kind: ArgKind = Args.Positional): GenLike {
		const [proc, src] = callDynTarget(f, source, id);
		return callFromGen(f, proc, src, resolveArgs(f, proc, vals, kind));
	},
	del(f: Frame, v: Value): GenLike {
		if (delHere(f, v)) return imm(null);
		return gDel(f, v);
	},
	/** only `input()` (Op.Prompt) is left as an instruction a generator proc names; it's run here. */
	op(f: Frame, name: string, operands: unknown[], vals: Value[]): GenLike {
		if (name !== "Prompt") throw new Error(`g.op("${name}"): only Prompt is made by name in a generator proc`);
		// The args as Op.Prompt popped them (pushed last-first, then the list or null).
		const n = vals.length;
		const r = vm.clients.prompt(operands[0] as number, vals[n - 1], vals[n - 2], vals[n - 3], vals[n - 4], vals[n - 5], f.usr);
		if (vm.yieldDelay !== null) return req(r); // a dialog: the thread parks (VM.park) until the page answers
		return imm(r);
	},
};
/**
 * `del v` that delHere leaves (a Del() that is a generator proc, or no proc at all): Del() runs (it may sleep, holding
 * up its caller), then the object is marked deleted (also after an error in Del()), and the caller ends if it was its src:
 * what the old ReturnMode.Delete did. `del` of a list: not done (BYOND's list deletion was never measured).
 */
function gDel(f: Frame, v: Value): GenLike {
	const o = live(v);
	if (o instanceof DMList) throw new NotImplementedError("del(list)");
	const obj = o as DMObject;
	let r: GenLike;
	try {
		r = callFromGen(f, obj.type.procs.get("Del")!, obj, []);
	} catch (e) {
		vm.markDeleted(obj);
		throw e;
	}
	if (r !== IMM) return delRest(f, obj, r);
	vm.markDeleted(obj);
	checkSrc(f);
	return imm(null);
}
function* delRest(f: Frame, obj: DMObject, r: GenLike): Gen {
	try {
		yield* r;
	} finally {
		vm.markDeleted(obj);
	}
	checkSrc(f);
	return null;
}

// ---- try/catch ------------------------------------------------------------------------------------

/** The value a DM `catch(e)` gets for a JS exception (rethrows anything that isn't a DM error). */
export function caught(f: Frame, e: unknown): Value {
	if (!(e instanceof DMRuntimeError)) throw e;
	if (e.caught !== undefined) return e.caught;
	if (e.isThrow) return e.thrown;
	// f is on fullStack() (a thread's top frame or the top plain frame); e.frames: raised further in (callGen, callPlain)
	return vm.makeException(e.message, (e.frames as Frame[] | undefined) ?? fullStack(), e);
}
/**
 * A translated `try` opens: errors in procs it calls must come back to it. A generator frame marks it
 * in its own `tries` (the VM sees those, and they survive sleeps); a plain proc's frame isn't on any
 * thread, so it goes on openTries (plain procs nest strictly on the JS stack).
 */
export function tryOpen(f: Frame): void {
	if (f.gen !== null) f.tries++;
	else openTries.push(f);
}
/** A structured `catch`: the value DM's catch(e) gets (JS errors that aren't DM errors go on up). */
export function catchValue(f: Frame, e: unknown): Value {
	if (!(e instanceof DMRuntimeError)) throw e;
	tryCaught(f, e);
	return caught(f, e);
}
/** In a catch: closes the try unless the VM already did (it delivered the error, VM.handleError). */
export function tryCaught(f: Frame, e: unknown): void {
	if (!(e instanceof DMRuntimeError && e.caught !== undefined)) tryClose(f);
}
export function tryClose(f: Frame): void {
	if (f.gen !== null) { if (f.tries > 0) f.tries--; }
	else if (openTries[openTries.length - 1] === f) openTries.pop();
}
export { isTruthy, live };
// True when the world runs on a server (tools/server-prelude.mjs sets the flag), false in a single-player tab.
// Game code uses it to keep single-player-only features (zoom out) off a server.
export function onServer(): boolean {
	return (globalThis as { tgjsServer?: boolean }).tgjsServer === true;
}
