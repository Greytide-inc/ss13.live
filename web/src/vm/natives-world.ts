// World built-ins: type checks on atoms, block/range/view, get_step_to, walk*, turn, and
// the built-in /world/Error. BYOND 511 behaviour measured in web/tests/dm/world.dm unless marked
// "unverified". Natives get exactly the arguments passed (no DMStandard defaults).

import { ANIM_LOG_MAX, type NativeProc, type VM } from "./interpreter.js";
import { DMList, DMObject, live } from "./objects.js";
import { output } from "./natives-io.js";
import { NotImplementedError, stringify, type Value } from "./value.js";
import { DMAtom, Kind, turnDir, viewHalfSize } from "./world.js";

const num = (v: Value, dflt: number): number => (typeof v === "number" ? v : dflt);

/** isturf(A, B, ...) etc.: true only if every argument passes (at least one). */
function kindCheck(test: (a: DMAtom) => boolean): NativeProc {
	return (_vm, args) => {
		if (args.length === 0) return 0;
		for (const a of args) if (!(a instanceof DMAtom) || a.deleted || !test(a)) return 0;
		return 1;
	};
}

/**
 * range()/view() arguments: (Dist, Center), in either order (measured: range(o, 0) is range(0, o)).
 * Dist defaults to world.view and Center to usr (unverified). a "WxH" text Dist gives a rectangular box
 * of half-sizes (W-1)/2 by (H-1)/2 (the BYOND docs allow it; unverified in 511).
 */
function spatialArgs(vm: VM, args: Value[], usr: Value): [number, number, DMAtom | null] {
	let [a = null, b = null] = args;
	if (a instanceof DMAtom && !(b instanceof DMAtom)) [a, b] = [b, a];
	if (a === null && vm.world) a = vm.world.getVar("view");
	const [dx, dy] = viewHalfSize(a) ?? [5, 5];
	const center = b instanceof DMAtom ? b : args.length < 2 && usr instanceof DMAtom ? usr : null;
	return [dx, dy, center && !center.deleted ? center : null];
}

function rangeNative(exclusive: boolean, useView: boolean): NativeProc {
	return (vm, args, _src, usr) => {
		const [dx, dy, center] = spatialArgs(vm, args, usr);
		if (!center) return new DMList();
		return vm.map.rangeList(dx, center, exclusive, useView, false, dy);
	};
}

/** viewers()/hearers(): the mobs in view of Center (unverified: BYOND checks each mob's own sight). hearers()
 *  ignores darkness (measured, a mob in the dark counts for hearers() but not viewers()). */
function mobsInView(exclusive: boolean, ignoreLight = false): NativeProc {
	return (vm, args, _src, usr) => {
		const [dx, dy, center] = spatialArgs(vm, args, usr);
		if (!center) return new DMList();
		// only the mobs are collected (not the whole view list, then filtered).
		const res = vm.map.rangeList(dx, center, exclusive, true, ignoreLight, dy, isMob);
		if (CHECK_RANGE) {
			const all = vm.map.rangeList(dx, center, exclusive, true, ignoreLight, dy);
			checkSame("mobsInView", res, all.items.filter((x) => x instanceof DMAtom && x.kind === Kind.Mob));
		}
		return res;
	};
}

const isMob = (a: DMAtom): boolean => a.kind === Kind.Mob;

/** stress2a check mode (env TG_CHECK_RANGE=1): the filtered scans also run the old way and compare. */
const CHECK_RANGE = typeof process !== "undefined" && !!process.env?.TG_CHECK_RANGE;
const checkStats = { compared: 0, differences: 0 };
function checkSame(what: string, got: DMList, want: Value[]): void {
	checkStats.compared++;
	const g = got.items;
	let same = g.length === want.length;
	for (let i = 0; same && i < g.length; i++) if (g[i] !== want[i]) same = false;
	if (!same) {
		checkStats.differences++;
		console.error(`[check-range] DIFFERENCE in ${what}: got ${g.length}, want ${want.length}`);
	}
}
if (CHECK_RANGE) process.on("exit", () => console.error(`[check-range] compared ${checkStats.compared}, differences ${checkStats.differences}`));

/** typecache_filter_list(range(Dist, Center), Typecache) without building the range list (hostile ListTargets). */
function rangeTypecache(): NativeProc {
	return (vm, args, _src, usr) => {
		const typecache = args[2];
		const [dx, dy, center] = spatialArgs(vm, [args[0] ?? null, args[1] ?? null], usr);
		if (!center) return new DMList();
		if (!(typecache instanceof DMList)) return new DMList();
		const pick = (a: DMAtom): boolean => { const v = typecache.get(a.getVar("type")); return v !== null && v !== 0 && v !== ""; };
		const res = vm.map.rangeList(dx, center, false, false, false, dy, pick);
		if (CHECK_RANGE) {
			const all = vm.map.rangeList(dx, center, false, false, false, dy);
			checkSame("rangeTypecache", res, all.items.filter((x) => x instanceof DMAtom && pick(x)));
		}
		return res;
	};
}

export function installWorldNatives(vm: VM): void {
	const def = (path: string, fn: NativeProc) => vm.natives.set(path, fn);

	// Measured: `..()` in an overridden world/Error logs the error as BYOND normally would.
	// With DEBUG (tg), it writes "runtime error: <E.name>" and E.desc to world.log, which tg's
	// handler points at its runtime log file first (matches web/reference/byond-boot.log's shape).
	def("/world/proc/Error", (vm, [E = null]) => {
		vm.pendingErrorLog?.();
		if (vm.debugInfo && E instanceof DMObject && vm.world) {
			output(vm, vm.getField(vm.world, "log"), `runtime error: ${stringify(E.getVar("name"))}\n${stringify(E.getVar("desc")).replace(/\n$/, "")}`);
		}
		return null;
	});

	// BYOND's host config (bans, admin keys set through the pager): empty in the VM. Unverified: exact return for an empty set.
	def("/world/proc/GetConfig", () => null);
	def("/world/proc/SetConfig", () => null);

	// world.Export: HTTP/topic requests to other servers. The browser has no network in play, and BYOND's answer to
	// a failed request is null.
	// Unverified against BYOND (no test): an unreachable address is assumed to give null.
	def("/world/proc/Export", () => null);

	// world.Reboot(reason). BYOND shuts the world down and runs world/New again; connected clients reconnect into
	// the new world. The VM can't restart itself from inside a proc, so it marks the reboot and the host (boot-worker.ts,
	// boot.ts) stops running this world after the current tick and starts the next one. Unverified: whether BYOND runs the
	// rest of the tick after Reboot() returns; tg's callers do nothing after it (world/Reboot's `..()` is its last line).
	def("/world/proc/Reboot", (vm, [reason = null]) => {
		if (!vm.rebootRequested) vm.rebootRequested = { reason: reason === null ? "" : stringify(reason), time: vm.sched.time };
		return null;
	});

	// Built-in hooks with no default behaviour (Move() calls them; tg overrides them).
	for (const name of ["Entered", "Exited", "Crossed", "Uncrossed", "Click", "DblClick", "MouseDown", "MouseDrag", "MouseDrop", "MouseEntered", "MouseExited", "MouseMove", "MouseUp", "MouseWheel", "Stat"]) {
		def(`/atom/proc/${name}`, () => null);
	}
	def("/atom/movable/proc/Bump", () => null);

	def("/proc/isturf", kindCheck((a) => a.kind === Kind.Turf));
	def("/proc/isarea", kindCheck((a) => a.kind === Kind.Area));
	def("/proc/ismob", kindCheck((a) => a.kind === Kind.Mob));
	def("/proc/isobj", kindCheck((a) => a.kind === Kind.Obj));
	def("/proc/isloc", kindCheck((a) => a.kind !== Kind.Atom && a.kind !== Kind.Movable));
	def("/proc/ismovable", kindCheck((a) => a.isMovable)); // not in BYOND 511 (tg has its own macro)

	def("/proc/block", (vm, [start = null, end = null]) => vm.map.block(start, end));
	def("/proc/range", rangeNative(false, false));
	def("/proc/typecache_filter_range", rangeTypecache());
	def("/proc/orange", rangeNative(true, false));
	def("/proc/view", rangeNative(false, true));
	def("/proc/oview", rangeNative(true, true));
	def("/proc/viewers", mobsInView(false));
	def("/proc/hearers", mobsInView(false, true));
	def("/proc/oviewers", mobsInView(true));
	def("/proc/ohearers", mobsInView(true, true));

	// get_hearers_in_view's loop (`hear |= recursive_hear_check(A)` for each movable in the view list).
	// recursive_hear_check walks A and everything inside it breadth-first and keeps the atoms with HEAR_1 (flags & 16).
	def("/proc/collect_hearers", (_vm, [range = null]) => {
		const out = new Set<DMAtom>();
		if (!(range instanceof DMList)) return new DMList();
		const queue: DMAtom[] = [];
		for (const A of range.items) {
			if (!(A instanceof DMAtom) || A.deleted || !A.isMovable) continue;
			queue.length = 0;
			queue.push(A);
			for (let i = 0; i < queue.length; i++) {
				const a = queue[i];
				const fl = a.getVar("flags");
				if (typeof fl === "number" && (fl & 16) !== 0) out.add(a);
				const c = a.contents;
				for (let j = 0; j < c.length; j++) queue.push(c[j]);
			}
		}
		return new DMList([...out]);
	});
	const CHECK_HEAR = typeof process !== "undefined" && !!process.env?.TG_CHECK_HEAR;
	const hearStats = { compared: 0, differences: 0 };
	if (CHECK_HEAR) process.on("exit", () => console.error(`[check-hear] compared ${hearStats.compared}, differences ${hearStats.differences}`));
	def("/proc/hear_check_mode", () => (CHECK_HEAR ? 1 : 0));
	// Move's per-neighbour hooks. A Move calls Uncross, CheckExit and Uncrossed on everything sharing the old turf and
	// CanPass and Crossed on everything on the new one; almost all of those run the base proc, which does nothing (or, for
	// CanPass, lets anything past a non-dense atom). hook_list(Loc, Hook) gives only the contents whose call can matter, in
	// contents order, or null when there are none. Hook: 1 Uncross, 2 Uncrossed, 3 Crossed, 4 CheckExit (objs only, as the
	// loop in /turf/Enter), 5 CanPass. TG_CHECK_HOOKS=1: hook_list gives everything (every hook is called, as before) and
	// hook_check counts the calls hook_skips would have dropped whose result says they mattered.
	const HOOK_NAMES = ["", "Uncross", "Uncrossed", "Crossed", "CheckExit", "CanPass"];
	const HOOK_BASES = [new Set<string>(), new Set(["/atom"]), new Set(["/atom"]), new Set(["/atom", "/atom/movable"]), new Set(["/atom"]), new Set(["/atom", "/atom/movable"])];
	/** per type: bit h set = the type overrides hook h; bit 0 = the type is an /obj */
	const hookBits = new Map<unknown, number>();
	const hookBitsOf = (vm: VM, a: DMAtom): number => {
		let b = hookBits.get(a.type);
		if (b === undefined) {
			b = a.kind === Kind.Obj ? 1 : 0;
			for (let h = 1; h <= 5; h++) { const p = a.type.procs.get(HOOK_NAMES[h]); if (p && !HOOK_BASES[h].has(p.owner.path)) b |= 1 << h; }
			hookBits.set(a.type, b);
		}
		return b;
	};
	const hookMatters = (vm: VM, a: DMAtom, h: number): boolean => {
		const b = hookBitsOf(vm, a);
		if (h === 4 && (b & 1) === 0) return false; // not an obj: the CheckExit loop never saw it
		if ((b & (1 << h)) !== 0) return true;
		if (h === 5) { const d = a.getVar("density"); return d !== 0 && d !== null && d !== ""; } // base CanPass: !density (|| the mover is buckled to it)
		return false;
	};
	const CHECK_HOOKS = typeof process !== "undefined" && !!process.env?.TG_CHECK_HOOKS;
	const hookStats = { compared: 0, skipped: 0, differences: 0 };
	if (CHECK_HOOKS) process.on("exit", () => console.error(`[check-hooks] hook calls compared ${hookStats.compared}, of them skipped by hook_list ${hookStats.skipped}, differences ${hookStats.differences}`));
	def("/proc/hook_check_mode", () => (CHECK_HOOKS ? 1 : 0));
	def("/proc/hook_list", (vm, [loc = null, hook = null]) => {
		if (!(loc instanceof DMAtom) || loc.deleted || typeof hook !== "number") return null;
		const c = loc.contents;
		let out: DMAtom[] | null = null;
		for (let i = 0; i < c.length; i++) {
			const a = c[i];
			if (a.deleted) continue;
			if (CHECK_HOOKS ? hook !== 4 || (hookBitsOf(vm, a) & 1) !== 0 : hookMatters(vm, a, hook)) (out ??= []).push(a);
		}
		return out === null ? null : new DMList(out);
	});
	def("/proc/hook_skips", (vm, [a = null, hook = null]) => (a instanceof DMAtom && typeof hook === "number" && !hookMatters(vm, a, hook) ? 1 : 0));
	// hook_check(Skipped, Result, Hook): Uncross/CheckExit/CanPass on a skipped atom must have said "go ahead" (true); Uncrossed and
	// Crossed return nothing to compare (skipped ones run a base proc with an empty body).
	def("/proc/hook_check", (_vm, [skipped = null, result = null, hook = null]) => {
		hookStats.compared++;
		if (skipped === 1) {
			hookStats.skipped++;
			if ((hook === 1 || hook === 4 || hook === 5) && (result === 0 || result === null || result === "")) {
				if (hookStats.differences++ < 20) console.error(`[check-hooks] DIFFERENCE: hook ${HOOK_NAMES[hook]} skipped but returned ${String(result)}`);
			}
		}
		return null;
	});
	// visible_message's "is any player's mob within range" pre-check; TG_CHECK_VISMSG=1 counts client mobs the full
	// hearer scan found (compared) and those found when the pre-check had said none (differences).
	const CHECK_VISMSG = typeof process !== "undefined" && !!process.env?.TG_CHECK_VISMSG;
	const visStats = { compared: 0, differences: 0 };
	if (CHECK_VISMSG) process.on("exit", () => console.error(`[check-vismsg] client hearers compared ${visStats.compared}, differences ${visStats.differences}`));
	def("/proc/vismsg_check_mode", () => (CHECK_VISMSG ? 1 : 0));
	def("/proc/vismsg_check", (_vm, [near = null]) => { visStats.compared++; if (near !== 1) visStats.differences++; return null; });
	// TG_PIPE_BATCH=0 turns the batched pipe rebuilds (singularity eat, explosions) off (the old rebuild after every ripped pipe).
	const PIPE_BATCH = !(typeof process !== "undefined" && process.env?.TG_PIPE_BATCH === "0");
	def("/proc/pipe_batch_on", () => (PIPE_BATCH ? 1 : 0));
	// stress-throw: TG_BLAST_THROW=old gives explosions their old throws (every item flies for real, an item can be thrown again by the same blast), to compare with the new ones.
	const BLAST_OLD = typeof process !== "undefined" && process.env?.TG_BLAST_THROW === "old";
	def("/proc/blast_throw_old", () => (BLAST_OLD ? 1 : 0));
	// TG_STRESS_COUNTS=1 prints named counters at exit (what the singularity ate and pulled, its energy and size, the
	// pipelines and their gas), to compare a run before and after a change. stress_count(key, n) adds, stress_set(key, v) keeps the last.
	const STRESS_COUNTS = typeof process !== "undefined" && !!process.env?.TG_STRESS_COUNTS;
	const counts = new Map<string, number>();
	if (STRESS_COUNTS) process.on("exit", () => console.error(`[stress-counts] ${[...counts].sort().map(([k, v]) => `${k}=${Number.isInteger(v) ? v : v.toFixed(3)}`).join(" ")}`));
	def("/proc/stress_counts_on", () => (STRESS_COUNTS ? 1 : 0));
	def("/proc/stress_count", (_vm, args) => { const k = String(args[0]); counts.set(k, (counts.get(k) ?? 0) + (typeof args[1] === "number" ? args[1] : 1)); return null; });
	def("/proc/stress_set", (_vm, args) => { counts.set(String(args[0]), typeof args[1] === "number" ? args[1] : 0); return null; });
	def("/proc/hear_check_compare", (_vm, [got = null, want = null]) => {
		hearStats.compared++;
		const g = got instanceof DMList ? got.items : [], w = want instanceof DMList ? want.items : [];
		let same = g.length === w.length;
		for (let i = 0; same && i < g.length; i++) if (g[i] !== w[i]) same = false;
		if (!same) {
			hearStats.differences++;
			console.error(`[check-hear] DIFFERENCE: got ${g.length}, want ${w.length}`);
		}
		return null;
	});

	def("/proc/get_dist", (vm, [a = null, b = null]) => vm.map.getDist(a, b));
	vm.overrideWithNative("/proc/get_dist");
	def("/proc/get_step_to", (vm, [ref = null, trg = null, min = null]) => vm.map.getStepTo(ref, trg, num(min, 0)));

	// flick(icon_state, object): a one-off animation on the client. Measured: the object's vars don't
	// change. recorded for the live page (vm.animLog), which plays the state's frames once.
	def("/proc/flick", (vm, [state = null, obj = null]) => {
		const o = live(obj as never);
		if (vm.animLog && typeof state === "string" && o instanceof DMObject && !o.deleted && vm.animLog.length < ANIM_LOG_MAX) vm.animLog.push({ o, flick: state });
		return null;
	});

	def("/proc/turn", (vm, [dir = null, angle = null]) => {
		if (typeof dir !== "number") {
			const m = vm.matrixTurn(dir, num(angle, 0));
			if (m !== undefined) return m;
			throw new NotImplementedError("turn() on icons");
		}
		return turnDir(dir, num(angle, 0));
	});

	// ---- walk*: see VM.startWalker for the timing ----------------------------------------------
	const startWalk = (vm: VM, ref: Value, lag: Value, stepOnce: (ref: DMAtom) => void): null => {
		if (ref instanceof DMAtom && !ref.deleted) vm.startWalker(ref, num(lag, 0), stepOnce);
		return null;
	};
	const stop = (ref: Value): null => {
		if (ref instanceof DMAtom) vm.stopWalker(ref);
		return null;
	};
	const callStep = (vm: VM, name: string, args: Value[]) => {
		const p = vm.tree.globalProcs.get(name);
		if (p) vm.call(p, args);
	};
	def("/proc/walk", (vm, [ref = null, dir = null, lag = null]) => {
		if (!dir) return stop(ref);
		return startWalk(vm, ref, lag, (r) => callStep(vm, "step", [r, dir]));
	});
	def("/proc/walk_to", (vm, [ref = null, trg = null, min = null, lag = null]) => {
		if (!(trg instanceof DMAtom)) return stop(ref);
		return startWalk(vm, ref, lag, (r) => callStep(vm, "step_to", [r, trg, num(min, 0)]));
	});
	def("/proc/walk_towards", (vm, [ref = null, trg = null, lag = null]) => {
		if (!(trg instanceof DMAtom)) return stop(ref);
		return startWalk(vm, ref, lag, (r) => callStep(vm, "step_towards", [r, trg]));
	});
	def("/proc/walk_away", (vm, [ref = null, trg = null, max = null, lag = null]) => {
		if (!(trg instanceof DMAtom)) return stop(ref);
		return startWalk(vm, ref, lag, (r) => callStep(vm, "step_away", [r, trg, num(max, 5)]));
	});
	def("/proc/walk_rand", (vm, [ref = null, lag = null]) => startWalk(vm, ref, lag, (r) => callStep(vm, "step_rand", [r])));
	// DMStandard gives walk_away a DM body that CRASHes; ours replaces it.
	vm.overrideWithNative("/proc/walk_away");
}
