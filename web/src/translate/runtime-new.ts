// runtime-new - The runtime's new, del and spawn: new_ and newPlain (from a plain proc), gNew (from a generator),
// callDyn (call()()), input, del, spawn, and tails (the rest of a proc after a sleep in a plain proc: sleepThen,
// spawnTail). Split out of runtime.ts, which re-exports all of it (game code still loads only runtime.js as rt).

import { EndProc, Frame, ListEnumerator, NONE } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { describe, NotImplementedError, type Value } from "../vm/value.js";
import { DMProc } from "../vm/objtree.js";
import { TAIL_MARK, Thread } from "../vm/scheduler.js";
import { vm, plain, gens, nParams, setNewPlainProc, type GenLike, type GenFn, type Gen } from "./runtime-state.js";
import { Ref, checkSrc, gap, refGet, RefKind } from "./runtime-ops.js";
import { Args, resolveArgs, callResolved, callGenFromPlain, callPlain, type ArgKind } from "./runtime-calls.js";
import { EntryCall, hot, invoke, P, spawnGen } from "./runtime.js";
import { callFromGen, g, imm, IMM } from "./runtime-gen.js";

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
				setNewPlainProc(plain[init.id] === undefined ? init : null); callResolved(f, init, obj, []);
			} catch (e) {
				if (!(e instanceof EndProc && e.frame === f)) throw e;
				end = e; // (init) deleted the caller's src: New() still runs (as on a thread), then the caller ends
			}
		}
		if (newProc !== null) { setNewPlainProc(plain[newProc.id] === undefined ? newProc : null); callResolved(f, newProc, obj, args); }
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
export function gNew(f: Frame, tv: Value, ov: string | null, vals: Value[], kind: ArgKind): GenLike {
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
export function callDynTarget(f: Frame, source: Value, id: Value | undefined): [DMProc, Value] {
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
export function delHere(f: Frame, v: Value): boolean {
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
	return yield* tailFn(l[1] as string).call(f.src, f, ...l.slice(2));
}
/** A frame holding [TAIL_MARK, name, ...values] (spawnTail, or a saved/loaded snapshot's) gets the generator that runs the tail. */
export function startTail(f: Frame): void {
	tailFn(f.locals[1] as string);
	f.gen = new EntryCall(f, runTail(f)) as unknown as Gen;
}
export function* sleepThen(f: Frame, delay: Value, name: string, vals: Value[]): Gen {
	const fn = tailFn(name);
	f.locals = [TAIL_MARK, name, ...vals];
	yield* g.call(f, P("/proc/sleep"), null, [delay]);
	f.locals = NONE;
	return yield* fn.call(f.src, f, ...vals);
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
