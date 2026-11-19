// Runtime for translated procs. The files in build/translated/ import this.
// This file keeps def, install and hotSwap and re-exports the rest, split by job: runtime-state (what they share),
// runtime-vars (values, globals, fields), runtime-ops (operations by name, loops), runtime-calls (plain calls,
// try/catch), runtime-new (new, del, spawn, tails), runtime-gen (generator calls, the g helpers).
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

import { EndProc, Frame, GenRequest, type VM } from "../vm/interpreter.js";
import { live } from "../vm/objects.js";
import { isTruthy, type Value } from "../vm/value.js";
import { DMProc } from "../vm/objtree.js";
import type { ProcMeta } from "../vm/json.js";
import { installFastAir } from "./fast-air.js";
import { errorSource, noteBundle } from "./error-lines.js";
import { declaredPaths, setGlobalInit } from "../vm/typedefs.js";
import { setTailStarter } from "../vm/snapshot.js";
import { vm, setVM, defs, plain, gens, nParams, natives, fullStack, enterHook, setHook, type PlainFn, type GenFn, type Gen } from "./runtime-state.js";
import { installVarProps } from "./runtime-vars.js";
import { startTail } from "./runtime-new.js";
import { locateSuspended } from "./runtime-gen.js";
export * from "./runtime-gen.js";
export * from "./runtime-new.js";
export * from "./runtime-calls.js";
export * from "./runtime-ops.js";
export * from "./runtime-vars.js";
// the game files declare the type tree, globals and string table with these (src/vm/typedefs.ts).
export { type, typePath, procRef, globals, maps, procDecls } from "../vm/typedefs.js";

export { add, subtract, multiply, divide, modulus, power, bitAnd, bitOr, bitXor, shiftLeft, shiftRight } from "../vm/interpreter.js";
export { isTruthy as truthy, isEqual } from "../vm/value.js";
export type { Frame } from "../vm/interpreter.js";
export type { Value } from "../vm/value.js";


export { EndProc };


/** fn(f, ...args) without the spread, with `this` = src (game code reads src's vars as `this.health`): a translated proc
 * declares exactly its DM args (extra ones are only seen through `args`, i.e. f.args), and `a` is padded to at least n. */
export function invoke<R>(fn: (f: Frame, ...args: Value[]) => R, f: Frame, a: Value[], n: number): R {
	const s = f.src;
	switch (n) {
		case 0: return fn.call(s, f);
		case 1: return fn.call(s, f, a[0]);
		case 2: return fn.call(s, f, a[0], a[1]);
		case 3: return fn.call(s, f, a[0], a[1], a[2]);
		case 4: return fn.call(s, f, a[0], a[1], a[2], a[3]);
		case 5: return fn.call(s, f, a[0], a[1], a[2], a[3], a[4]);
		case 6: return fn.call(s, f, a[0], a[1], a[2], a[3], a[4], a[5]);
		default: return fn.call(s, f, ...a);
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
}

/** The runtime's VM: what translated code reads and calls through (install, or the global init on an interpreter-only VM). */
function attach(v: VM): void {
	if (vm !== v) natives.length = 0; // the natives are this VM's (a second VM in one process: tests)
	setVM(v);
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
	installVarProps(v);
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
export let hot: { path: string; fn: PlainFn | GenFn | undefined; gen: boolean }[] | null = null;
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

/** Diff detail mode (src/tools/diff/diary.ts, --diff-trace): see enterHook in runtime-state.ts. */
export function setEnterHook(h: ((proc: DMProc, src: Value, args: Value[]) => void) | null): void {
	setHook(h);
}

function entryGen(fn: GenFn, f: Frame, n: number): Gen {
	return new EntryCall(f, invoke(fn, f, f.args, n)) as unknown as Gen;
}

/**
 * a generator proc entered by the VM: its generator, ending with its `.` when an EndProc for its frame comes out
 * (VM.endTop). An iterator forwarding to the proc's generator rather than a wrapper generator (`yield*` made a
 * generator object per call and a result object per request).
 */
export class EntryCall {
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

export function* spawnGen(body: GenFn, f: Frame, vals: Value[]): Gen {
	try {
		return yield* body.call(f.src, f, ...vals);
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

// ---- procs by path ------------------------------------------------------------------------------

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



export { isTruthy, live };
// True when the world runs on a server (tools/server-prelude.mjs sets the flag), false in a single-player tab.
// Game code uses it to keep single-player-only features (zoom out) off a server.
export function onServer(): boolean {
	return (globalThis as { tgjsServer?: boolean }).tgjsServer === true;
}
