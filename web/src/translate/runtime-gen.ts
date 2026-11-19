// runtime-gen - The runtime's generator calls (`yield* g.x(...)`, DM code that may sleep): imm and IMM (a call that
// can't sleep, as a done iterator), callFromGen, callGen and InlineCall (a generator proc run inline), the g helpers
// and gDel. Split out of runtime.ts, which re-exports all of it (game code still loads only runtime.js as rt).

import { EndProc, Frame, genFramePool, MOVE_HOOKS, GenRequest } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { asDMError, DMRuntimeError, NotImplementedError, type Value } from "../vm/value.js";
import { DMProc } from "../vm/objtree.js";
import { ProcAttr } from "../vm/json.js";
import { vm, plain, gens, nParams, natives, enterHook, type GenLike, type GenFn, type Gen } from "./runtime-state.js";
import { checkSrc } from "./runtime-ops.js";
import { Args, resolveArgs, padArgs, callPlain, type ArgKind } from "./runtime-calls.js";
import { callDynTarget, delHere, gNew } from "./runtime-new.js";
import { invoke, EntryCall } from "./runtime.js";

/**
 * what the g.* call helpers return for `yield* g.x(...)`. A call made here that can't sleep (a plain proc, a
 * native that didn't sleep) returns IMM, an iterator that's done at once with the value: no generator objects. The
 * one result object is reused: yield* reads it straight away, before anything else can run.
 */
const IMM_RESULT: IteratorReturnResult<Value> = { done: true, value: null };
export const IMM: GenLike = {
	next() { return IMM_RESULT; },
	[Symbol.iterator]() { return this; },
};
export function imm(v: Value): GenLike {
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
export function callFromGen(f: Frame, proc: DMProc, src: Value, args: Value[]): GenLike {
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
		e = asDMError(e);
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
export function gCallSrc(f: Frame, proc: DMProc, name: string, vals: Value[], kind: ArgKind): GenLike {
	return callFromGen(f, proc, f.src, resolveArgs(f, proc, vals, kind));
}
/** g.callName once the proc is found on `o` (= live(obj)) (also the cached call sites). */
export function gCallName(f: Frame, obj: Value, o: Value, proc: DMProc, name: string, vals: Value[], kind: ArgKind): GenLike {
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
