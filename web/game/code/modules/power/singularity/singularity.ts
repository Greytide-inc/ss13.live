// From code/modules/power/singularity/singularity.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13034, "/obj/singularity", "/obj", {
	current_size: 1,
	allowed_size: 1,
	contained: 1,
	energy: 100,
	dissipate: 1,
	dissipate_delay: 10,
	dissipate_track: 0,
	dissipate_strength: 1,
	move_self: 1,
	grav_pull: 4,
	consume_range: 0,
	event_chance: 15,
	target: null,
	last_failed_movement: 0,
	last_warning: null,
	consumedSupermatter: 0,
	anchored: 1,
	name: "gravitational singularity",
	desc: "A gravitational singularity.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "singularity_s1",
	density: 1,
	layer: 11,
	luminosity: 6,
	appearance_flags: 0,
	resistance_flags: 115,
	dangerous_possession: 1,
});

// /obj/singularity/proc/Initialize  (code/modules/power/singularity/singularity.dm:34)
rt.def("/obj/singularity/proc/Initialize", function Initialize(f: Frame) {
	let singubeacon: Value = null;
	let $e: any;
	f.vars = () => [singubeacon, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 50;
	}
	rt.callSrc(f, "admin_investigate_setup", []);
	rt.setFv(f, "energy", live(f.src), live(f.args[1]));
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	(rt.modGl("singularities", live(f.src), rt.bitOr));
	singubeacon = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/singularity_beacon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		singubeacon = $e;
		if (truthy(rt.fv(f, "active", live(singubeacon)))) {
			rt.setSv(f, "target", live(singubeacon));
			break;
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, false, { args: ["mapload", "starting_energy"] });

// /obj/singularity/proc/Destroy  (code/modules/power/singularity/singularity.dm:48)  may sleep
rt.def("/obj/singularity/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	yield* g.callName(f, rt.gl("singularities"), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/singularity/proc/Move  (code/modules/power/singularity/singularity.dm:54)  may sleep
rt.def("/obj/singularity/proc/Move", function* Move(f: Frame) {
	if ((rt.ge(rt.sv(f, "current_size"), 9) || truthy((yield* g.srcCall(f, "check_turfs_in", live(f.args[1])))))) {
		rt.setSv(f, "last_failed_movement", 0);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	rt.setSv(f, "last_failed_movement", live(f.args[1]));
	return 0;
}, true, { args: ["newloc", "direct"] });

// /obj/singularity/proc/attack_hand  (code/modules/power/singularity/singularity.dm:63)  may sleep
rt.def("/obj/singularity/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "consume", live(user));
	return 1;
}, true);

// /obj/singularity/proc/attack_paw  (code/modules/power/singularity/singularity.dm:67)  may sleep
rt.def("/obj/singularity/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "consume", live(user));
	return f.dot;
}, true);

// /obj/singularity/proc/attack_alien  (code/modules/power/singularity/singularity.dm:70)  may sleep
rt.def("/obj/singularity/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "consume", live(user));
	return f.dot;
}, true);

// /obj/singularity/proc/attack_animal  (code/modules/power/singularity/singularity.dm:73)  may sleep
rt.def("/obj/singularity/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "consume", live(user));
	return f.dot;
}, true);

// /obj/singularity/proc/attackby  (code/modules/power/singularity/singularity.dm:76)  may sleep
rt.def("/obj/singularity/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	yield* g.srcCall(f, "consume", live(user));
	return 1;
}, true);

// /obj/singularity/proc/ex_act  (code/modules/power/singularity/singularity.dm:86)  may sleep
rt.def("/obj/singularity/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		if (rt.le(rt.sv(f, "current_size"), 3)) {
			yield* g.srcCall(f, "investigate_log", "has been destroyed by a heavy explosion.", "singulo");
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		} else {
			(rt.modSrcVar(f, "energy", (yield* g.call(f, P("/proc/round"), null, [divide(add(rt.sv(f, "energy"), 1), 2), 1])), subtract));
		}
	} else if ($0 === 2) {
		(rt.modSrcVar(f, "energy", (yield* g.call(f, P("/proc/round"), null, [divide(add(rt.sv(f, "energy"), 1), 3), 1])), subtract));
	} else if ($0 === 3) {
		(rt.modSrcVar(f, "energy", (yield* g.call(f, P("/proc/round"), null, [divide(add(rt.sv(f, "energy"), 1), 4), 1])), subtract));
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/singularity/proc/Bump  (code/modules/power/singularity/singularity.dm:106)  may sleep
rt.def("/obj/singularity/proc/Bump", function* Bump(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "consume", live(A));
	return live(f.dot);
}, true);

// /obj/singularity/proc/Bumped  (code/modules/power/singularity/singularity.dm:111)  may sleep
rt.def("/obj/singularity/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "consume", live(A));
	return live(f.dot);
}, true);

// /obj/singularity/proc/process  (code/modules/power/singularity/singularity.dm:116)  may sleep
rt.def("/obj/singularity/proc/process", function* process(f: Frame) {
	if (rt.ge(rt.sv(f, "current_size"), 3)) {
		yield* g.srcCall(f, "move");
		yield* g.srcCall(f, "pulse");
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "event_chance")]))) {
			yield* g.srcCall(f, "event");
		}
	}
	yield* g.srcCall(f, "eat");
	yield* g.srcCall(f, "dissipate");
	yield* g.srcCall(f, "check_energy");
	return live(f.dot);
}, true, { waitfor: false });

// /obj/singularity/proc/admin_investigate_setup  (code/modules/power/singularity/singularity.dm:134)
rt.def("/obj/singularity/proc/admin_investigate_setup", function admin_investigate_setup(f: Frame) {
	let count: Value = null;
	let $0: any;
	f.vars = () => [count, $0];
	rt.setSv(f, "last_warning", rt.worldTime(f));
	if (!truthy((count = rt.locateIn(f, T("/obj/machinery/field/containment"), rt.call(f, P("/proc/urange"), null, [30, live(f.src), 1]))))) {
		rt.call(f, P("/proc/message_admins"), null, [fmt("A singulo has been created without containment fields active (＀,＀,＀)", [rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")]), 1]);
	}
	if (truthy(live(count))) {
		$0 = "";
	} else {
		$0 = "<font color='red'>No containment fields were active</font>";
	}
	rt.callSrc(f, "investigate_log", [fmt("was created. ＀", [$0]), "singulo"]);
	return f.dot;
});

// /obj/singularity/proc/dissipate  (code/modules/power/singularity/singularity.dm:140)
rt.def("/obj/singularity/proc/dissipate", function dissipate(f: Frame) {
	if (!truthy(rt.sv(f, "dissipate"))) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "dissipate_track"), rt.sv(f, "dissipate_delay"))) {
		(rt.modField(f, live(f.src), "energy", rt.sv(f, "dissipate_strength"), subtract));
		rt.setSv(f, "dissipate_track", 0);
	} else {
		rt.incSrcVar(f, "dissipate_track", 1, true);
	}
	return f.dot;
});

// /obj/singularity/proc/expand  (code/modules/power/singularity/singularity.dm:152)
rt.def("/obj/singularity/proc/expand", function expand(f: Frame, force_size: Value) {
	let temp_allowed_size: Value = null;
	let $0: any;
	f.vars = () => [force_size, temp_allowed_size, $0];
	if (live(force_size) === null) {
		force_size = 0;
	}
	temp_allowed_size = rt.fv(f, "allowed_size", live(f.src));
	if (truthy(live(force_size))) {
		temp_allowed_size = live(force_size);
	}
	if ((rt.ge(live(temp_allowed_size), 11) && !truthy(rt.sv(f, "consumedSupermatter")))) {
		temp_allowed_size = 9;
	}
	$0 = live(temp_allowed_size);
	if ($0 === 1) {
		rt.setSv(f, "current_size", 1);
		rt.setSv(f, "icon", rt.rsc("icons/obj/singularity.dmi"));
		rt.setSv(f, "icon_state", "singularity_s1");
		rt.setSv(f, "pixel_x", 0);
		rt.setSv(f, "pixel_y", 0);
		rt.setSv(f, "grav_pull", 4);
		rt.setSv(f, "consume_range", 0);
		rt.setSv(f, "dissipate_delay", 10);
		rt.setSv(f, "dissipate_track", 0);
		rt.setSv(f, "dissipate_strength", 1);
	} else if ($0 === 3) {
		if ((((truthy(rt.callSrc(f, "check_turfs_in", [1, 1])) && truthy(rt.callSrc(f, "check_turfs_in", [2, 1]))) && truthy(rt.callSrc(f, "check_turfs_in", [4, 1]))) && truthy(rt.callSrc(f, "check_turfs_in", [8, 1])))) {
			rt.setSv(f, "current_size", 3);
			rt.setSv(f, "icon", rt.rsc("icons/effects/96x96.dmi"));
			rt.setSv(f, "icon_state", "singularity_s3");
			rt.setSv(f, "pixel_x", -32);
			rt.setSv(f, "pixel_y", -32);
			rt.setSv(f, "grav_pull", 6);
			rt.setSv(f, "consume_range", 1);
			rt.setSv(f, "dissipate_delay", 5);
			rt.setSv(f, "dissipate_track", 0);
			rt.setSv(f, "dissipate_strength", 5);
		}
	} else if ($0 === 5) {
		if ((((truthy(rt.callSrc(f, "check_turfs_in", [1, 2])) && truthy(rt.callSrc(f, "check_turfs_in", [2, 2]))) && truthy(rt.callSrc(f, "check_turfs_in", [4, 2]))) && truthy(rt.callSrc(f, "check_turfs_in", [8, 2])))) {
			rt.setSv(f, "current_size", 5);
			rt.setSv(f, "icon", rt.rsc("icons/effects/160x160.dmi"));
			rt.setSv(f, "icon_state", "singularity_s5");
			rt.setSv(f, "pixel_x", -64);
			rt.setSv(f, "pixel_y", -64);
			rt.setSv(f, "grav_pull", 8);
			rt.setSv(f, "consume_range", 2);
			rt.setSv(f, "dissipate_delay", 4);
			rt.setSv(f, "dissipate_track", 0);
			rt.setSv(f, "dissipate_strength", 20);
		}
	} else if ($0 === 7) {
		if ((((truthy(rt.callSrc(f, "check_turfs_in", [1, 3])) && truthy(rt.callSrc(f, "check_turfs_in", [2, 3]))) && truthy(rt.callSrc(f, "check_turfs_in", [4, 3]))) && truthy(rt.callSrc(f, "check_turfs_in", [8, 3])))) {
			rt.setSv(f, "current_size", 7);
			rt.setSv(f, "icon", rt.rsc("icons/effects/224x224.dmi"));
			rt.setSv(f, "icon_state", "singularity_s7");
			rt.setSv(f, "pixel_x", -96);
			rt.setSv(f, "pixel_y", -96);
			rt.setSv(f, "grav_pull", 10);
			rt.setSv(f, "consume_range", 3);
			rt.setSv(f, "dissipate_delay", 10);
			rt.setSv(f, "dissipate_track", 0);
			rt.setSv(f, "dissipate_strength", 10);
		}
	} else if ($0 === 9) {
		rt.setSv(f, "current_size", 9);
		rt.setSv(f, "icon", rt.rsc("icons/effects/288x288.dmi"));
		rt.setSv(f, "icon_state", "singularity_s9");
		rt.setSv(f, "pixel_x", -128);
		rt.setSv(f, "pixel_y", -128);
		rt.setSv(f, "grav_pull", 10);
		rt.setSv(f, "consume_range", 4);
		rt.setSv(f, "dissipate", 0);
	} else if ($0 === 11) {
		rt.setSv(f, "current_size", 11);
		rt.setSv(f, "icon", rt.rsc("icons/effects/352x352.dmi"));
		rt.setSv(f, "icon_state", "singularity_s11");
		rt.setSv(f, "pixel_x", -160);
		rt.setSv(f, "pixel_y", -160);
		rt.setSv(f, "grav_pull", 15);
		rt.setSv(f, "consume_range", 5);
		rt.setSv(f, "dissipate", 0);
	}
	if (isEqual(rt.sv(f, "current_size"), rt.sv(f, "allowed_size"))) {
		rt.callSrc(f, "investigate_log", [fmt("<font color='red'>grew to size ＀</font>", [rt.sv(f, "current_size")]), "singulo"]);
		return 1;
	} else {
		if (rt.lt(rt.sv(f, "current_size"), (temp_allowed_size = rt.inc(live(temp_allowed_size), -1)))) {
			rt.callSrc(f, "expand", [live(temp_allowed_size)]);
		} else {
			return 0;
		}
	}
	return f.dot;
});

// /obj/singularity/proc/check_energy  (code/modules/power/singularity/singularity.dm:231)  may sleep
rt.def("/obj/singularity/proc/check_energy", function* check_energy(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (rt.le(rt.sv(f, "energy"), 0)) {
		yield* g.srcCall(f, "investigate_log", "collapsed.", "singulo");
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	$0 = rt.sv(f, "energy");
	if (rt.inRange($0, 1, 199)) {
		rt.setSv(f, "allowed_size", 1);
	} else if (rt.inRange($0, 200, 499)) {
		rt.setSv(f, "allowed_size", 3);
	} else if (rt.inRange($0, 500, 999)) {
		rt.setSv(f, "allowed_size", 5);
	} else if (rt.inRange($0, 1000, 1999)) {
		rt.setSv(f, "allowed_size", 7);
	} else if (rt.inRange($0, 2000, 9.999999848243207e+30)) {
		if ((rt.ge(rt.sv(f, "energy"), 3000) && truthy(rt.sv(f, "consumedSupermatter")))) {
			rt.setSv(f, "allowed_size", 11);
		} else {
			rt.setSv(f, "allowed_size", 9);
		}
	}
	if (!isEqual(rt.sv(f, "current_size"), rt.sv(f, "allowed_size"))) {
		yield* g.srcCall(f, "expand");
	}
	return 1;
}, true);

// /obj/singularity/proc/eat  (code/modules/power/singularity/singularity.dm:256)  may sleep
rt.def("/obj/singularity/proc/eat", function* eat(f: Frame) {
	let tile: Value = null, _T: Value = null, thing: Value = null, X: Value = null;
	let $e: any;
	f.vars = () => [tile, _T, thing, X, $e];
	// stress2c: TG_STRESS_COUNTS=1 counts what each pass pulls and consumes and notes the energy and size (printed at exit)
	const counting = truthy(rt.call(f, P("/proc/stress_counts_on"), null, []));
	const who = rt.istype(live(f.src), T("/obj/singularity/narsie")) ? "narsie" : "sing";
	if (counting) {
		rt.call(f, P("/proc/stress_count"), null, [who + "_passes", 1]);
		rt.call(f, P("/proc/stress_set"), null, [who + "_energy", rt.sv(f, "energy")]);
		rt.call(f, P("/proc/stress_set"), null, [who + "_size", rt.sv(f, "current_size")]);
	}
	tile = null;
	// stress2c: pipes ripped out in this pass rebuild their neighbours' pipelines once at the end of the pass (flush_pipe_rebuilds),
	// not after each pipe. The pass can sleep (stoplag below) with rebuilds still waiting: everything that needs a pipe's pipeline
	// flushes first (SSair.fire, an atmos machine's Destroy and update_parents, a pipe's return_air/returnPipenets), so the wait is at
	// most until the air subsystem next fires. TG_PIPE_BATCH=0 turns it off.
	if (rt.gl("pipe_rebuild_defer") === null && truthy(rt.call(f, P("/proc/pipe_batch_on"), null, []))) rt.setGl("pipe_rebuild_defer", rt.list());
	rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [rt.sv(f, "grav_pull"), live(f.src)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		tile = $e;
		if ((!truthy((_T = live(tile))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
			continue;
		}
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(_T), live(f.src)])), rt.sv(f, "consume_range"))) {
			if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_pulled", 1]);
			yield* g.callName(f, live(_T), "singularity_pull", [live(f.src), rt.sv(f, "current_size")]);
		} else {
			if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_consumed", 1]);
			yield* g.srcCall(f, "consume", live(_T));
		}
		thing = null;
		rt.forList(f, 1, live(_T));
		while (($e = rt.next(f, 1)) !== undefined) {
			thing = $e;
			if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) && !isEqual(live(thing), live(f.src)))) {
				if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [(X = live(thing)), live(f.src)])), rt.sv(f, "consume_range"))) {
					if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_pulled", 1]);
					yield* g.callName(f, live(X), "singularity_pull", [live(f.src), rt.sv(f, "current_size")]);
				} else {
					if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_consumed", 1]);
					yield* g.srcCall(f, "consume", live(X));
				}
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
				if (rt.gl("pipe_rebuild_defer") === null && truthy(rt.call(f, P("/proc/pipe_batch_on"), null, []))) rt.setGl("pipe_rebuild_defer", rt.list());
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	rt.setGl("pipe_rebuild_defer", null);
	return live(f.dot);
}, true);

// /obj/singularity/proc/consume  (code/modules/power/singularity/singularity.dm:276)  may sleep
rt.def("/obj/singularity/proc/consume", function* consume(f: Frame, A: Value) {
	let gain: Value = null;
	f.vars = () => [A, gain];
	gain = (yield* g.callName(f, live(A), "singularity_act", [rt.sv(f, "current_size"), live(f.src)]));
	rt.modField(f, live(f.src), "energy", live(gain), add);
	if ((truthy((rt.istype(live(A), T("/obj/machinery/power/supermatter_shard")) ? 1 : 0)) && !truthy(rt.sv(f, "consumedSupermatter")))) {
		rt.setSv(f, "desc", fmt("＀ It glows fiercely with inner fire.", [rt.initial(f, live(f.src), "desc")]));
		rt.setSv(f, "name", fmt("supermatter-charged ＀", [rt.initial(f, live(f.src), "name")]));
		rt.setSv(f, "consumedSupermatter", 1);
		rt.setSv(f, "luminosity", 10);
	}
	return live(f.dot);
}, true);

// /obj/singularity/proc/move  (code/modules/power/singularity/singularity.dm:287)  may sleep
rt.def("/obj/singularity/proc/move", function* move(f: Frame, force_move: Value) {
	let movement_dir: Value = null;
	f.vars = () => [force_move, movement_dir];
	if (live(force_move) === null) {
		force_move = 0;
	}
	if (!truthy(rt.sv(f, "move_self"))) {
		return 0;
	}
	movement_dir = rt.op(f, "PickUnweighted", [1], [subtract(rt.gl("alldirs"), rt.sv(f, "last_failed_movement"))]);
	if (truthy(live(force_move))) {
		movement_dir = live(force_move);
	}
	if ((truthy(rt.sv(f, "target")) && truthy(rt.op(f, "Prob", [], [60])))) {
		movement_dir = rt.getDir(f, live(f.src), rt.sv(f, "target"));
	}
	yield* g.call(f, P("/proc/step"), null, [live(f.src), live(movement_dir)]);
	return f.dot;
}, true);

// /obj/singularity/proc/check_turfs_in  (code/modules/power/singularity/singularity.dm:302)
rt.def("/obj/singularity/proc/check_turfs_in", function check_turfs_in(f: Frame, direction: Value, step: Value) {
	let steps: Value = null, turfs: Value = null, _T: Value = null, i: Value = null, dir2: Value = null, dir3: Value = null, T2: Value = null, j: Value = null, k: Value = null, T3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [direction, step, steps, turfs, _T, i, dir2, dir3, T2, j, k, T3, $0, $e];
	if (live(direction) === null) {
		direction = 0;
	}
	if (live(step) === null) {
		step = 0;
	}
	if (!truthy(live(direction))) {
		return 0;
	}
	steps = 0;
	if (!truthy(live(step))) {
		$0 = rt.sv(f, "current_size");
		if ($0 === 1) {
			steps = 1;
		} else if ($0 === 3) {
			steps = 3;
		} else if ($0 === 5) {
			steps = 3;
		} else if ($0 === 7) {
			steps = 4;
		} else if ($0 === 9) {
			steps = 5;
		}
	} else {
		steps = live(step);
	}
	turfs = rt.list();
	_T = rt.fv(f, "loc", live(f.src));
	i = null;
	rt.forRange(f, 0, 1, live(steps), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, live(_T), live(direction));
	}
	rt.endFor(f, 0);
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [live(_T)]))) {
		return 0;
	}
	rt.callName(f, live(turfs), "Add", [live(_T)]);
	dir2 = 0;
	dir3 = 0;
	$0 = live(direction);
	if ($0 === 1) {
		dir2 = 4;
		dir3 = 8;
	} else if ($0 === 4) {
		dir2 = 1;
		dir3 = 2;
	}
	T2 = live(_T);
	j = null;
	rt.forRange(f, 0, 1, subtract(live(steps), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		if (!truthy(rt.call(f, P("/proc/isturf"), null, [(T2 = rt.getStep(f, live(T2), live(dir2)))]))) {
			return 0;
		}
		rt.callName(f, live(turfs), "Add", [live(T2)]);
	}
	rt.endFor(f, 0);
	k = null;
	rt.forRange(f, 0, 1, subtract(live(steps), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		k = $e;
		if (!truthy(rt.call(f, P("/proc/isturf"), null, [(_T = rt.getStep(f, live(_T), live(dir3)))]))) {
			return 0;
		}
		rt.callName(f, live(turfs), "Add", [live(_T)]);
	}
	rt.endFor(f, 0);
	T3 = null;
	rt.forList(f, 0, live(turfs), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		T3 = $e;
		if (live(T3) === null) {
			continue;
		}
		if (!truthy(rt.callSrc(f, "can_move", [live(T3)]))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/singularity/proc/can_move  (code/modules/power/singularity/singularity.dm:355)
rt.def("/obj/singularity/proc/can_move", function can_move(f: Frame, _T: Value) {
	let G: Value = null, S: Value = null;
	f.vars = () => [G, S];
	if (!truthy(live(_T))) {
		return 0;
	}
	if ((truthy(rt.locateIn(f, T("/obj/machinery/field/containment"), live(_T))) || truthy(rt.locateIn(f, T("/obj/machinery/shieldwall"), live(_T))))) {
		return 0;
	} else {
		if (truthy(rt.locateIn(f, T("/obj/machinery/field/generator"), live(_T)))) {
			if ((truthy((G = rt.locateIn(f, T("/obj/machinery/field/generator"), live(_T)))) && truthy(rt.fv(f, "active", live(G))))) {
				return 0;
			}
		} else {
			if (truthy(rt.locateIn(f, T("/obj/machinery/shieldwallgen"), live(_T)))) {
				if ((truthy((S = rt.locateIn(f, T("/obj/machinery/shieldwallgen"), live(_T)))) && truthy(rt.fv(f, "active", live(S))))) {
					return 0;
				}
			}
		}
	}
	return 1;
});

// /obj/singularity/proc/event  (code/modules/power/singularity/singularity.dm:371)  may sleep
rt.def("/obj/singularity/proc/event", function* event(f: Frame) {
	let numb: Value = null;
	let $0: any;
	f.vars = () => [numb, $0];
	$0 = (numb = rt.op(f, "PickUnweighted", [6], [1, 2, 3, 4, 5, 6]));
	if ($0 === 1) {
		yield* g.srcCall(f, "emp_area");
	} else if ($0 === 2 || $0 === 3) {
		yield* g.srcCall(f, "toxmob");
	} else if ($0 === 4) {
		yield* g.srcCall(f, "mezzer");
	} else if ($0 === 5 || $0 === 6) {
		if (rt.lt(rt.sv(f, "current_size"), 11)) {
			return 0;
		}
		yield* g.srcCall(f, "combust_mobs");
	} else {
		return 0;
	}
	return 1;
}, true);

// /obj/singularity/proc/toxmob  (code/modules/power/singularity/singularity.dm:392)  may sleep
rt.def("/obj/singularity/proc/toxmob", function* toxmob(f: Frame) {
	let toxrange: Value = null, radiation: Value = null, radiationmin: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [toxrange, radiation, radiationmin, M, $e];
	toxrange = 10;
	radiation = 15;
	radiationmin = 3;
	if (rt.gt(rt.sv(f, "energy"), 200)) {
		radiationmin = (yield* g.call(f, P("/proc/round"), null, [divide((radiation = rt.modify(live(radiation), (yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "energy"), 150), 10), 1])), add)), 5), 1]));
	}
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(toxrange), rt.fv(f, "loc", live(f.src))])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "rad_act", [(yield* g.call(f, P("/proc/rand"), null, [live(radiationmin), live(radiation)]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/singularity/proc/combust_mobs  (code/modules/power/singularity/singularity.dm:400)  may sleep
rt.def("/obj/singularity/proc/combust_mobs", function* combust_mobs(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [20, live(f.src), 1])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀'s skin bursts into flame!</span>", [live(C)]), "<span class='userdanger'>You feel an inner fire as your skin bursts into flames!</span>"]);
		yield* g.callName(f, live(C), "adjust_fire_stacks", [5]);
		yield* g.callName(f, live(C), "IgniteMob", []);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /obj/singularity/proc/mezzer  (code/modules/power/singularity/singularity.dm:409)  may sleep
rt.def("/obj/singularity/proc/mezzer", function* mezzer(f: Frame) {
	let M: Value = null, H: Value = null, MS: Value = null;
	let $e: any;
	f.vars = () => [M, H, MS, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oviewers"), null, [8, live(f.src)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/brain")) ? 1 : 0))) {
			continue;
		}
		if (isEqual(rt.fv(f, "stat", live(M)), 0)) {
			if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (truthy((rt.istype(rt.gv(f, "glasses", (H = live(M))), T("/obj/item/clothing/glasses/meson")) ? 1 : 0))) {
					if (isEqual(rt.gv(f, "vision_flags", (MS = rt.fv(f, "glasses", live(H)))), 16)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You look directly into the ＀, good thing you had your protective eyewear on!</span>", [rt.fv(f, "name", live(f.src))])]);
						return live(f.dot);
					}
				}
			}
		}
		yield* g.callName(f, live(M), "apply_effect", [60, "stun"]);
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ stares blankly at the ＀!</span>", [live(M), rt.fv(f, "name", live(f.src))]), fmt("<span class='userdanger'>You look directly into the ＀ and feel weak.</span>", [rt.fv(f, "name", live(f.src))])]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /obj/singularity/proc/emp_area  (code/modules/power/singularity/singularity.dm:429)  may sleep
rt.def("/obj/singularity/proc/emp_area", function* emp_area(f: Frame) {
	yield* g.call(f, P("/proc/empulse"), null, [live(f.src), 8, 10]);
	return live(f.dot);
}, true);

// /obj/singularity/proc/pulse  (code/modules/power/singularity/singularity.dm:434)
rt.def("/obj/singularity/proc/pulse", function pulse(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	R = null;
	rt.forList(f, 0, rt.gl("rad_collectors"), T("/obj/machinery/power/rad_collector"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((isEqual(rt.fv(f, "z", live(R)), rt.sv(f, "z")) && rt.le(rt.call(f, P("/proc/get_dist"), null, [live(R), live(f.src)]), 15))) {
			rt.callName(f, live(R), "receive_pulse", [rt.sv(f, "energy")]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/singularity/proc/singularity_act  (code/modules/power/singularity/singularity.dm:439)  may sleep
rt.def("/obj/singularity/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = null, dist: Value = null;
	f.vars = () => [gain, dist];
	gain = divide(rt.sv(f, "energy"), 2);
	dist = (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "current_size"), 2), 1]));
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), live(dist), multiply(live(dist), 2), multiply(live(dist), 4)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(gain);
}, true);
