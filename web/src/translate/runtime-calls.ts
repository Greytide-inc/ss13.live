// runtime-calls - The runtime's plain calls: call, callSuper, callSrc, callName (a plain proc runs on the JS stack;
// a generator proc called from one runs on a temporary thread), the per-call-site method caches (methodSite) and
// try/catch. Split out of runtime.ts, which re-exports all of it (game code still loads only runtime.js as rt).

import { EndProc, Frame, genFramePool, MOVE_HOOKS, GenRequest } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { ArgsType } from "../vm/args-type.js";
import { asDMError, DMRuntimeError, type Value } from "../vm/value.js";
import { DMProc, DMType } from "../vm/objtree.js";
import { Thread } from "../vm/scheduler.js";
import { vm, plainFrames, plain, gens, nParams, natives, openTries, fullStack, enterHook, newPlainProc, setNewPlainProc, type PlainFn, type GenFn, type Gen, type GenLike } from "./runtime-state.js";
import { invoke, EntryCall } from "./runtime.js";
import { g, gCallSrc, gCallName } from "./runtime-gen.js";
import { checkSrc } from "./runtime-ops.js";

// ---- calls ------------------------------------------------------------------------------------------

/** How the args of a call were written: `f(a, b)`, `f(a, name = b)` (pairs), `f(arglist(L))`, `..()` with no args (the caller's). */
export const Args = { None: ArgsType.None, Positional: ArgsType.FromStack, Named: ArgsType.FromStackKeyed, List: ArgsType.FromArgumentList, Same: ArgsType.FromProcArguments } as const;
export type ArgKind = ArgsType;

export function resolveArgs(f: Frame, proc: DMProc | null, vals: Value[], kind: ArgKind): Value[] {
	if (kind === Args.Positional) return vals;
	if (kind === Args.None) return [];
	if (kind === Args.Same) return f.args.slice();
	return vm.popArgs(vals, f.args, proc, kind);
}

export function callResolved(f: Frame, proc: DMProc, src: Value, args: Value[]): Value {
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
export function callGenFromPlain(f: Frame, proc: DMProc, fn: GenFn, src: Value, args: Value[]): Value {
	if (src !== null && typeof src === "object" && src instanceof DMObject && src.deleted) { checkSrc(f); return null; } // it would end at once (VM.runThread)
	if (args.length < proc.argNames.length) args = padArgs(args, proc.argNames.length);
	if (enterHook !== null) enterHook(proc, src, args);
	const fromNew = proc === newPlainProc;
	setNewPlainProc(null);
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
		if (err === null && f2.waitfor) { const k = `${f.proc.path} > ${proc.path}`; plainSleeps.set(k, (plainSleeps.get(k) ?? 0) + 1); } // DM's caller would have waited; this one carries on
		// The VM takes over: the frame's generator ends with its `.` on an EndProc (VM.endTop), as entryGen's does.
		const w = new EntryCall(f2, it) as unknown as Gen;
		for (const fr2 of t.frames) if (fr2.gen === it) fr2.gen = w;
		vm.resumeTemp(t, r === null ? null : (r.value as GenRequest), err);
	}
	return tempDone(f, t, fr, f2);
}
/** "caller > callee": a plain proc's callee (not `set waitfor = 0`) really slept, so the caller carried on where DM's would have
 * waited (callGenFromPlain). The bundler can't see these (it matches calls by name): boot.ts lists them at the end. */
export const plainSleeps = new Map<string, number>();
/** finished temporary threads (empty) and their stand-in frames, for callGenFromPlain (most never sleep). */
const tempThreads: Thread[] = [];
const tempFrames: Frame[] = [];

/** args with nulls up to n, as one exact-size array (pushing onto the caller's array literal regrew it by 16 slots). */
const NULLS: Value[][] = [];
export function padArgs(args: Value[], n: number): Value[] {
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

export function callPlain(f: Frame, proc: DMProc, fn: PlainFn, src: Value, args: Value[]): Value {
	if (src !== null && typeof src === "object" && src instanceof DMObject && src.deleted) return null;
	if (args.length < proc.argNames.length) args = padArgs(args, proc.argNames.length);
	if (enterHook !== null) enterHook(proc, src, args);
	const f2 = framePool.length !== 0 ? framePool.pop()!.reusePlain(proc, args, src, f.usr) : new Frame(proc, args, src, f.usr);
	f2.depth = vm.running.length;
	const depth = plainFrames.push(f2) - 1;
	let r: Value;
	try {
		r = invoke(fn, f2, args, nParams[proc.id]);
	} catch (e0) {
		const e = asDMError(e0); // a JS error from game code is a DM one
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

// ---- try/catch ------------------------------------------------------------------------------------

/** The value a DM `catch(e)` gets for a JS exception (rethrows anything that isn't a DM error). */
export function caught(f: Frame, e: unknown): Value {
	e = asDMError(e);
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
	e = asDMError(e);
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
