// From code/controllers/subsystem/atoms.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(15, "/datum/controller/subsystem/atoms", "/datum/controller/subsystem", {
	initialized: 0,
	old_initialized: null,
	late_loaders: null,
	created_atoms: null,
	BadInitializeCalls: null,
	name: "Atoms",
	init_order: 11,
	flags: 2,
});

// /datum/controller/subsystem/atoms/proc/New  (code/controllers/subsystem/atoms.dm:6)  may sleep
rt.def("/datum/controller/subsystem/atoms/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSatoms"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSatoms"), T("/datum/controller/subsystem/atoms")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSatoms")]);
		}
		rt.setGl("SSatoms", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/atoms/proc/<init>  (code/controllers/subsystem/atoms.dm:17)
rt.def("/datum/controller/subsystem/atoms/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "BadInitializeCalls", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/atoms/proc/Initialize  (code/controllers/subsystem/atoms.dm:20)  may sleep
rt.def("/datum/controller/subsystem/atoms/proc/Initialize", function* Initialize(f: Frame) {
	rt.setFv(f, "appearance_flags", rt.gl("fire_overlay"), 2);
	yield* g.srcCall(f, "setupGenetics");
	rt.setSv(f, "initialized", 1);
	yield* g.srcCall(f, "InitializeAtoms");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["timeofday"] });

// /datum/controller/subsystem/atoms/proc/InitializeAtoms  (code/controllers/subsystem/atoms.dm:27)  may sleep
rt.def("/datum/controller/subsystem/atoms/proc/InitializeAtoms", function* InitializeAtoms(f: Frame, atoms: Value) {
	let count: Value = null, mapload_arg: Value = null, I: Value = null, A: Value = null, A_2: Value = null;
	let $e: any;
	f.vars = () => [atoms, count, mapload_arg, I, A, A_2, $e];
	if (isEqual(rt.sv(f, "initialized"), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "initialized", 1);
	if (!truthy(rt.sv(f, "late_loaders"))) {
		rt.setSv(f, "late_loaders", rt.list());
	}
	count = null;
	mapload_arg = rt.list(1);
	if (truthy(live(atoms))) {
		rt.setSv(f, "created_atoms", rt.list());
		count = rt.len(f, live(atoms));
		I = null;
		rt.forList(f, 0, live(atoms));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (!truthy(rt.gv(f, "initialized", (A = live(I))))) {
				if (truthy((yield* g.srcCall(f, "InitAtom", live(I), live(mapload_arg))))) {
					(atoms = rt.modify(live(atoms), live(I), subtract));
				}
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
		}
		rt.endFor(f, 0);
	} else {
		count = 0;
		A_2 = null;
		rt.forList(f, 0, rt.world(), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A_2 = $e;
			if (!truthy(rt.fv(f, "initialized", live(A_2)))) {
				yield* g.srcCall(f, "InitAtom", live(A_2), live(mapload_arg));
				count = rt.inc(live(count), 1);
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("Initialized ＀ atoms", [live(count)])]);
	rt.setSv(f, "initialized", 2);
	if (truthy(rt.len(f, rt.sv(f, "late_loaders")))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "late_loaders"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, (A = live(I)), "LateInitialize", []);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "late_loaders"), "Cut", []);
	}
	if (!truthy(live(atoms))) return f.dot;
	f.dot = add(rt.sv(f, "created_atoms"), live(atoms));
	rt.setSv(f, "created_atoms", null);
	return f.dot;
}, true);

// /datum/controller/subsystem/atoms/proc/InitAtom  (code/controllers/subsystem/atoms.dm:70)  may sleep
rt.def("/datum/controller/subsystem/atoms/proc/InitAtom", function* InitAtom(f: Frame, A: Value, _arguments: Value) {
	let the_type: Value = null, start_tick: Value = null, result: Value = null, qdeleted: Value = null;
	let $0: any;
	f.vars = () => [A, _arguments, the_type, start_tick, result, qdeleted, $0];
	the_type = rt.fv(f, "type", live(A));
	if (truthy(rt.fv(f, "gc_destroyed", live(A)))) {
		(rt.modAt(rt.sv(f, "BadInitializeCalls"), live(the_type), 1, rt.bitOr));
		return 1;
	}
	start_tick = rt.worldTime(f);
	result = (yield* g.callName(f, live(A), "Initialize", [live(_arguments)], rt.Args.List));
	if (!isEqual(live(start_tick), rt.worldTime(f))) {
		(rt.modAt(rt.sv(f, "BadInitializeCalls"), live(the_type), 4, rt.bitOr));
	}
	qdeleted = 0;
	if (!isEqual(live(result), 0)) {
		$0 = live(result);
		if ($0 === 1) {
			if (truthy(rt.index(live(_arguments), 1))) {
				rt.modSrcVar(f, "late_loaders", live(A), add);
			} else {
				yield* g.callName(f, live(A), "LateInitialize", []);
			}
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
			qdeleted = 1;
		} else {
			(rt.modAt(rt.sv(f, "BadInitializeCalls"), live(the_type), 8, rt.bitOr));
		}
	}
	if (!truthy(live(A))) {
		qdeleted = 1;
	} else {
		if (!truthy(rt.fv(f, "initialized", live(A)))) {
			(rt.modAt(rt.sv(f, "BadInitializeCalls"), live(the_type), 2, rt.bitOr));
		}
	}
	return (live(qdeleted) || rt.fv(f, "gc_destroyed", live(A)));
}, true);

// /datum/controller/subsystem/atoms/proc/map_loader_begin  (code/controllers/subsystem/atoms.dm:104)
rt.def("/datum/controller/subsystem/atoms/proc/map_loader_begin", function map_loader_begin(f: Frame) {
	rt.setSv(f, "old_initialized", rt.sv(f, "initialized"));
	rt.setSv(f, "initialized", 0);
	return f.dot;
});

// /datum/controller/subsystem/atoms/proc/map_loader_stop  (code/controllers/subsystem/atoms.dm:108)
rt.def("/datum/controller/subsystem/atoms/proc/map_loader_stop", function map_loader_stop(f: Frame) {
	rt.setSv(f, "initialized", rt.sv(f, "old_initialized"));
	return f.dot;
});

// /datum/controller/subsystem/atoms/proc/Recover  (code/controllers/subsystem/atoms.dm:112)  may sleep
rt.def("/datum/controller/subsystem/atoms/proc/Recover", function* Recover(f: Frame) {
	rt.setSv(f, "initialized", rt.fv(f, "initialized", rt.gl("SSatoms")));
	if (isEqual(rt.sv(f, "initialized"), 1)) {
		yield* g.srcCall(f, "InitializeAtoms");
	}
	rt.setSv(f, "old_initialized", rt.fv(f, "old_initialized", rt.gl("SSatoms")));
	rt.setSv(f, "BadInitializeCalls", rt.fv(f, "BadInitializeCalls", rt.gl("SSatoms")));
	return f.dot;
}, true);

// /datum/controller/subsystem/atoms/proc/setupGenetics  (code/controllers/subsystem/atoms.dm:118)  may sleep
rt.def("/datum/controller/subsystem/atoms/proc/setupGenetics", function* setupGenetics(f: Frame) {
	let avnums: Value = null, i: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [avnums, i, A, B, $e];
	avnums = (yield* g.new_(f, T("/list"), [19]));
	i = null;
	i = 1;
	while (rt.le(live(i), 19)) {
		rt.setAt(live(avnums), live(i), live(i));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
		i = rt.inc(live(i), 1);
	}
	A = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/mutation/human")])), T("/datum/mutation/human")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.gv(f, "dna_block", (B = (yield* g.new_(f, live(A), [])))), -1)) {
			continue;
		}
		rt.setFv(f, "dna_block", live(B), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(avnums)])));
		if (isEqual(rt.fv(f, "quality", live(B)), 1)) {
			(rt.modGl("good_mutations", live(B), rt.bitOr));
		} else {
			if (isEqual(rt.fv(f, "quality", live(B)), 2)) {
				(rt.modGl("bad_mutations", live(B), rt.bitOr));
			} else {
				if (isEqual(rt.fv(f, "quality", live(B)), 3)) {
					(rt.modGl("not_good_mutations", live(B), rt.bitOr));
				}
			}
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/atoms/proc/InitLog  (code/controllers/subsystem/atoms.dm:137)
rt.def("/datum/controller/subsystem/atoms/proc/InitLog", function InitLog(f: Frame) {
	let path: Value = null, fails: Value = null;
	let $e: any;
	f.vars = () => [path, fails, $e];
	f.dot = "";
	path = null;
	rt.forList(f, 0, rt.sv(f, "BadInitializeCalls"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		f.dot = rt.modify(live(f.dot), fmt("Path : ＀ \n", [live(path)]), add);
		if (truthy(rt.bitAnd((fails = rt.index(rt.sv(f, "BadInitializeCalls"), live(path))), 2))) {
			f.dot = rt.modify(live(f.dot), "- Didn't call atom/Initialize()\n", add);
		}
		if (truthy(rt.bitAnd(live(fails), 8))) {
			f.dot = rt.modify(live(f.dot), "- Didn't return an Initialize hint\n", add);
		}
		if (truthy(rt.bitAnd(live(fails), 1))) {
			f.dot = rt.modify(live(f.dot), "- Qdel'd in New()\n", add);
		}
		if (truthy(rt.bitAnd(live(fails), 4))) {
			f.dot = rt.modify(live(f.dot), "- Slept during Initialize()\n", add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/subsystem/atoms/proc/Shutdown  (code/controllers/subsystem/atoms.dm:151)
rt.def("/datum/controller/subsystem/atoms/proc/Shutdown", function Shutdown(f: Frame) {
	let initlog: Value = null;
	f.vars = () => [initlog];
	if (!truthy((initlog = rt.callSrc(f, "InitLog", [])))) return f.dot;
	rt.call(f, P("/proc/text2file"), null, [live(initlog), fmt("＀/initialize.log", [rt.gl("log_directory")])]);
	return f.dot;
});
