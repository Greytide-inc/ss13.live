// runtime-state - What the runtime's sections share: the VM it runs on, the plain frames (GC roots), the proc tables
// install() fills, the pools of reused objects and fullStack (the call stack as the interpreter has it). Split out of
// runtime.ts: a file can't assign another file's variable, so the two that change (vm, plainFrames) are set only
// through attach -> setVM.

import type { Frame, GenRequest, ListEnumerator, NativeProc, VM } from "../vm/interpreter.js";
import type { DMProc } from "../vm/objtree.js";
import type { Value } from "../vm/value.js";

export type PlainFn = (f: Frame, ...args: Value[]) => Value;
export type GenFn = (f: Frame, ...args: Value[]) => Generator<GenRequest, Value, Value>;
export type Gen = Generator<GenRequest, Value, Value>;
/** a generator proc's call as an iterator: a generator, or IMM / an InlineCall (no generator objects). */
export type GenLike = Iterator<GenRequest, Value, Value> & Iterable<GenRequest, Value, Value>;

export let vm: VM;
/** Frames of the plain procs running now, innermost last (VM.extraFrames: GC roots). */
export let plainFrames: Frame[] = [];
/** attach's: the VM translated code runs on now, and its extra frames. */
export function setVM(v: VM): void { vm = v; plainFrames = v.extraFrames; }
/** the rt.def calls in bundle order; install() matches the i-th to the i-th declared proc (typedefs.procDecls). */
export const defs: { path: string; fn: PlainFn | GenFn | undefined; gen: boolean }[] = [];
export const plain: (PlainFn | undefined)[] = [];
/** the generator procs, called inline from other generator procs (callGen). */
export const gens: (GenFn | undefined)[] = [];
/** how many JS params each installed proc takes after f (see invoke). */
export const nParams: number[] = [];
export const natives: (NativeProc | undefined)[] = [];
/** Frames of plain procs (not on any thread) with a translated `try` open, innermost last. */
export const openTries: Frame[] = [];
/** list enumerators of plain procs that returned (~9M `for (x in L)` loops per snapshot run). */
export const enumPool: ListEnumerator[] = [];

/** the call stack as the interpreter would have it, outermost first: each running thread's frames
 * with the plain frames called from it, minus the stand-in frames of temporary threads (tempThread) that stand in
 * for their caller. Threads the VM started itself (vm.call from a native, world.Error) begin a stack of
 * their own, as in the interpreter. */
export function fullStack(): Frame[] {
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

/** Diff detail mode (src/tools/diff/diary.ts, --diff-trace): called at each DM proc entry that doesn't go through VM.enter (callPlain,
 * callGen), with the padded args. Null (always, outside a diff trace) = one module-variable check per call. */
export let enterHook: ((proc: DMProc, src: Value, args: Value[]) => void) | null = null;
export function setHook(h: typeof enterHook): void { enterHook = h; }
/** The (init)/New proc newPlain is calling right now (callGenFromPlain reads it on entry: a sleep there is a bug in the caller's translation). */
export let newPlainProc: DMProc | null = null;
export function setNewPlainProc(p: DMProc | null): void { newPlainProc = p; }
