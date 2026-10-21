// From code/modules/power/singularity/field_generator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10632, "/obj/machinery/field/generator", "/obj/machinery/field", {
	num_power_levels: 6,
	power_level: 0,
	active: 0,
	power: 20,
	state: 0,
	warming_up: 0,
	fields: null,
	connected_gens: null,
	clean_up: 0,
	anchored: 0,
	name: "field generator",
	desc: "A large thermal battery that projects a high amount of energy when powered.",
	icon: rt.rsc("icons/obj/machines/field_generator.dmi"),
	icon_state: "Field_Gen",
	density: 1,
	use_power: 0,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
}, { const: ["num_power_levels"] });

// /obj/machinery/field/generator/proc/<init>  (code/modules/power/singularity/field_generator.dm:32)
rt.def("/obj/machinery/field/generator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 100, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]));
	return f.dot;
});

// /obj/machinery/field/generator/proc/update_icon  (code/modules/power/singularity/field_generator.dm:44)
rt.def("/obj/machinery/field/generator/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "warming_up"))) {
		rt.callSrc(f, "add_overlay", [fmt("+a＀", [rt.sv(f, "warming_up")])]);
	}
	if (truthy(rt.len(f, rt.sv(f, "fields")))) {
		rt.callSrc(f, "add_overlay", ["+on"]);
	}
	if (!truthy(rt.sv(f, "power_level"))) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("+p＀", [rt.sv(f, "power_level")])]);
	return f.dot;
});

// /obj/machinery/field/generator/proc/New  (code/modules/power/singularity/field_generator.dm:54)  may sleep
rt.def("/obj/machinery/field/generator/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "fields", rt.list());
	rt.setSv(f, "connected_gens", rt.list());
	return f.dot;
}, true);

// /obj/machinery/field/generator/proc/process  (code/modules/power/singularity/field_generator.dm:60)
rt.def("/obj/machinery/field/generator/proc/process", function process(f: Frame) {
	if (!isEqual(rt.sv(f, "active"), 2)) return f.dot;
	rt.callSrc(f, "calc_power", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/field/generator/proc/attack_hand  (code/modules/power/singularity/field_generator.dm:64)  may sleep
rt.def("/obj/machinery/field/generator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual(rt.sv(f, "state"), 2)) {
		if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
			if (rt.ge(rt.sv(f, "active"), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You are unable to turn off the ＀ once it is online!</span>", [rt.sv(f, "name")])]);
				return 1;
			} else {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ turns on the ＀.", [rt.fv(f, "name", live(user)), rt.sv(f, "name")]), fmt("<span class='notice'>You turn on the ＀.</span>", [rt.sv(f, "name")]), "<span class='italics'>You hear heavy droning.</span>"]);
				yield* g.srcCall(f, "turn_on");
				yield* g.srcCall(f, "investigate_log", fmt("<font color='green'>activated</font> by ＀.", [rt.fv(f, "key", live(user))]), "singulo");
				yield* g.srcCall(f, "add_fingerprint", live(user));
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ needs to be firmly secured to the floor first!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/machinery/field/generator/proc/can_be_unfasten_wrench  (code/modules/power/singularity/field_generator.dm:81)
rt.def("/obj/machinery/field/generator/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (isEqual(rt.sv(f, "state"), 2)) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is welded to the floor!</span>", [live(f.src)])]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/machinery/field/generator/proc/default_unfasten_wrench  (code/modules/power/singularity/field_generator.dm:88)  may sleep
rt.def("/obj/machinery/field/generator/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 2)) return f.dot;
	if (truthy(rt.sv(f, "anchored"))) {
		rt.setSv(f, "state", 1);
	} else {
		rt.setSv(f, "state", 0);
	}
	return f.dot;
}, true, { args: ["user", "W", "time"] });

// /obj/machinery/field/generator/proc/attackby  (code/modules/power/singularity/field_generator.dm:97)  may sleep
rt.def("/obj/machinery/field/generator/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	let $0: any;
	f.vars = () => [WT, $0];
	if (truthy(rt.sv(f, "active"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ needs to be off!</span>", [live(f.src)])]);
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 0);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				WT = live(f.args[0]);
				$0 = rt.sv(f, "state");
				if ($0 === 0) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ needs to be wrenched to the floor!</span>", [rt.sv(f, "name")])]);
				} else if ($0 === 1) {
					if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to weld the ＀ to the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
						if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && isEqual(rt.sv(f, "state"), 1)) && truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
							rt.setSv(f, "state", 2);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You weld the field generator to the floor.</span>"]);
						}
					}
				} else if ($0 === 2) {
					if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to cut the ＀ free from the floor.", [rt.fv(f, "name", live(f.args[1])), rt.sv(f, "name")]), fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
						if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && isEqual(rt.sv(f, "state"), 2)) && truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
							rt.setSv(f, "state", 1);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [live(f.src)])]);
						}
					}
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/field/generator/proc/attack_animal  (code/modules/power/singularity/field_generator.dm:132)  may sleep
rt.def("/obj/machinery/field/generator/proc/attack_animal", function* attack_animal(f: Frame) {
	if (((rt.ge(rt.fv(f, "environment_smash", live(f.args[0])), 3) && isEqual(rt.sv(f, "active"), 0)) && !isEqual(rt.sv(f, "state"), 0))) {
		rt.setSv(f, "state", 0);
		rt.setSv(f, "anchored", 0);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ rips ＀ free from its moorings!</span>", [live(f.args[0]), live(f.src)])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	if (truthy(rt.sv(f, "anchored"))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.getDir(f, live(f.args[0]), live(f.src))]);
	return f.dot;
}, true, { args: ["M"] });

// /obj/machinery/field/generator/proc/blob_act  (code/modules/power/singularity/field_generator.dm:147)  may sleep
rt.def("/obj/machinery/field/generator/proc/blob_act", function* blob_act(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		return 0;
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["B"] });

// /obj/machinery/field/generator/proc/bullet_act  (code/modules/power/singularity/field_generator.dm:152)  may sleep
rt.def("/obj/machinery/field/generator/proc/bullet_act", function* bullet_act(f: Frame) {
	if (!isEqual(rt.fv(f, "flag", live(f.args[0])), "bullet")) {
		rt.setSv(f, "power", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "power"), rt.fv(f, "damage", live(f.args[0]))), 250])));
		yield* g.srcCall(f, "check_power_level");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/machinery/field/generator/proc/Destroy  (code/modules/power/singularity/field_generator.dm:159)  may sleep
rt.def("/obj/machinery/field/generator/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "cleanup");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/field/generator/proc/check_power_level  (code/modules/power/singularity/field_generator.dm:164)
rt.def("/obj/machinery/field/generator/proc/check_power_level", function check_power_level(f: Frame) {
	let new_level: Value = null;
	f.vars = () => [new_level];
	if (isEqual((new_level = rt.call(f, P("/proc/round"), null, [divide(multiply(6, rt.sv(f, "power")), 250)])), rt.sv(f, "power_level"))) return f.dot;
	rt.setSv(f, "power_level", live(new_level));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/field/generator/proc/turn_off  (code/modules/power/singularity/field_generator.dm:171)
rt.def("/obj/machinery/field/generator/proc/turn_off", function turn_off(f: Frame) {
	rt.setSv(f, "active", 0);
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/turn_off: spawn at modules/power/singularity/field_generator.dm:171");
	return f.dot;
});

// a spawn(1) body of /obj/machinery/field/generator/proc/turn_off, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/turn_off: spawn at modules/power/singularity/field_generator.dm:171", function* (f: Frame) {
	yield* g.srcCall(f, "cleanup");
	while (rt.gt(rt.sv(f, "warming_up"), 0) && !truthy(rt.sv(f, "active"))) {
		yield* g.call(f, P("/proc/sleep"), null, [50]);
		rt.incSrcVar(f, "warming_up", -1, true);
		yield* g.srcCall(f, "update_icon");
	}
	return null;
});

// /obj/machinery/field/generator/proc/turn_on  (code/modules/power/singularity/field_generator.dm:180)
rt.def("/obj/machinery/field/generator/proc/turn_on", function turn_on(f: Frame) {
	rt.setSv(f, "active", 1);
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/turn_on: spawn at modules/power/singularity/field_generator.dm:180");
	return f.dot;
});

// a spawn(1) body of /obj/machinery/field/generator/proc/turn_on, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/turn_on: spawn at modules/power/singularity/field_generator.dm:180", function* (f: Frame) {
	while (rt.lt(rt.sv(f, "warming_up"), 3) && truthy(rt.sv(f, "active"))) {
		yield* g.call(f, P("/proc/sleep"), null, [50]);
		rt.incSrcVar(f, "warming_up", 1, true);
		yield* g.srcCall(f, "update_icon");
		if (rt.ge(rt.sv(f, "warming_up"), 3)) {
			yield* g.srcCall(f, "start_fields");
		}
	}
	return null;
});

// /obj/machinery/field/generator/proc/calc_power  (code/modules/power/singularity/field_generator.dm:190)
rt.def("/obj/machinery/field/generator/proc/calc_power", function calc_power(f: Frame, set_power_draw: Value) {
	let power_draw: Value = null;
	f.vars = () => [power_draw];
	power_draw = add(2, rt.len(f, rt.sv(f, "fields")));
	if (truthy(live(set_power_draw))) {
		power_draw = live(set_power_draw);
	}
	if (truthy(rt.callSrc(f, "draw_power", [rt.call(f, P("/proc/round"), null, [divide(live(power_draw), 2), 1])]))) {
		rt.callSrc(f, "check_power_level", []);
		return 1;
	} else {
		rt.callSrc(f, "visible_message", [fmt("<span class='danger'>The ＀ shuts down!</span>", [rt.sv(f, "name")]), "<span class='italics'>You hear something shutting down.</span>"]);
		rt.callSrc(f, "turn_off", []);
		rt.callSrc(f, "investigate_log", ["ran out of power and <font color='red'>deactivated</font>", "singulo"]);
		rt.setSv(f, "power", 0);
		rt.callSrc(f, "check_power_level", []);
		return 0;
	}
	return f.dot;
});

// /obj/machinery/field/generator/proc/draw_power  (code/modules/power/singularity/field_generator.dm:207)
rt.def("/obj/machinery/field/generator/proc/draw_power", function draw_power(f: Frame, draw: Value, failsafe: Value, G: Value, last: Value) {
	let CG: Value = null, FG: Value = null;
	let $e: any;
	f.vars = () => [draw, failsafe, G, last, CG, FG, $e];
	if (live(draw) === null) {
		draw = 0;
	}
	if (live(failsafe) === null) {
		failsafe = 0;
	}
	if (live(G) === null) {
		G = null;
	}
	if (live(last) === null) {
		last = null;
	}
	if (((truthy(live(G)) && isEqual(live(G), live(f.src))) || rt.ge(live(failsafe), 8))) {
		return 0;
	} else {
		failsafe = rt.inc(live(failsafe), 1);
	}
	if (rt.ge(rt.sv(f, "power"), live(draw))) {
		(rt.modSrcVar(f, "power", live(draw), subtract));
		return 1;
	} else {
		(draw = rt.modify(live(draw), rt.sv(f, "power"), subtract));
		rt.setSv(f, "power", 0);
		CG = null;
		rt.forList(f, 0, rt.sv(f, "connected_gens"));
		while (($e = rt.next(f, 0)) !== undefined) {
			CG = $e;
			if (isEqual((FG = live(CG)), live(last))) {
				continue;
			}
			if (truthy(live(G))) {
				if (truthy(rt.callName(f, live(FG), "draw_power", [live(draw), live(failsafe), live(G), live(f.src)]))) {
					return 1;
				} else {
					return 0;
				}
			} else {
				if (truthy(rt.callName(f, live(FG), "draw_power", [live(draw), live(failsafe), live(f.src), live(f.src)]))) {
					return 1;
				} else {
					return 0;
				}
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /obj/machinery/field/generator/proc/start_fields  (code/modules/power/singularity/field_generator.dm:236)
rt.def("/obj/machinery/field/generator/proc/start_fields", function start_fields(f: Frame) {
	if ((!isEqual(rt.sv(f, "state"), 2) || !truthy(rt.sv(f, "anchored")))) {
		rt.callSrc(f, "turn_off", []);
		return live(f.dot);
	}
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:239");
	rt.spawnTail(f, 2, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:241");
	rt.spawnTail(f, 3, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:243");
	rt.spawnTail(f, 4, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:245");
	rt.spawnTail(f, 5, "/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:247");
	return f.dot;
});

// a spawn(5) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:247", function* (f: Frame) {
	rt.setSv(f, "active", 2);
	return null;
});

// a spawn(4) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:245", function* (f: Frame) {
	yield* g.srcCall(f, "setup_field", 8);
	return null;
});

// a spawn(3) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:243", function* (f: Frame) {
	yield* g.srcCall(f, "setup_field", 4);
	return null;
});

// a spawn(2) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:241", function* (f: Frame) {
	yield* g.srcCall(f, "setup_field", 2);
	return null;
});

// a spawn(1) body of /obj/machinery/field/generator/proc/start_fields, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/start_fields: spawn at modules/power/singularity/field_generator.dm:239", function* (f: Frame) {
	yield* g.srcCall(f, "setup_field", 1);
	return null;
});

// /obj/machinery/field/generator/proc/setup_field  (code/modules/power/singularity/field_generator.dm:252)  may sleep
rt.def("/obj/machinery/field/generator/proc/setup_field", function* setup_field(f: Frame, NSEW: Value) {
	let _T: Value = null, G: Value = null, steps: Value = null, dist: Value = null, TC: Value = null, A: Value = null, field_dir: Value = null, CF: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [NSEW, _T, G, steps, dist, TC, A, field_dir, CF, L, $e];
	if (!truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) {
		return 0;
	}
	G = null;
	steps = 0;
	if (!truthy(live(NSEW))) {
		return 0;
	}
	dist = null;
	rt.forRange(f, 0, 0, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		dist = $e;
		if (truthy(rt.gv(f, "density", (_T = rt.getStep(f, live(_T), live(NSEW)))))) {
			return 0;
		}
		if (truthy((G = rt.locateIn(f, T("/obj/machinery/field/generator"), live(_T))))) {
			(steps = rt.modify(live(steps), 1, subtract));
			if (!truthy(rt.fv(f, "active", live(G)))) {
				return 0;
			}
			break;
		}
		TC = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)));
		while (($e = rt.next(f, 1)) !== undefined) {
			TC = $e;
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(A = live(TC))])))) {
				continue;
			}
			if (truthy(rt.fv(f, "density", live(A)))) {
				return 0;
			}
		}
		rt.endFor(f, 1);
		steps = rt.inc(live(steps), 1);
	}
	rt.endFor(f, 0);
	if (!truthy(live(G))) {
		return 0;
	}
	_T = rt.sv(f, "loc");
	dist = null;
	rt.forRange(f, 0, 0, live(steps), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		dist = $e;
		field_dir = rt.getDir(f, live(_T), rt.getStep(f, rt.fv(f, "loc", live(G)), live(NSEW)));
		_T = rt.getStep(f, live(_T), live(NSEW));
		if (!truthy(rt.locateIn(f, T("/obj/machinery/field/containment"), live(_T)))) {
			yield* g.callName(f, (CF = (yield* g.new_(f, T("/obj/machinery/field/containment"), []))), "set_master", [live(f.src), live(G)]);
			rt.setFv(f, "loc", live(CF), live(_T));
			yield* g.callName(f, live(CF), "setDir", [live(field_dir)]);
			rt.modSrcVar(f, "fields", live(CF), add);
			rt.modField(f, live(G), "fields", live(CF), add);
			L = null;
			rt.forList(f, 1, live(_T), T("/mob/living"));
			while (($e = rt.next(f, 1)) !== undefined) {
				L = $e;
				yield* g.callName(f, live(CF), "Crossed", [live(L)]);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "connected_gens", live(G), rt.bitOr));
	(rt.modField(f, live(G), "connected_gens", live(f.src), rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/field/generator/proc/cleanup  (code/modules/power/singularity/field_generator.dm:305)  may sleep
rt.def("/obj/machinery/field/generator/proc/cleanup", function* cleanup(f: Frame) {
	let F: Value = null, CG: Value = null, FG: Value = null, temp: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [F, CG, FG, temp, O, $e];
	rt.setSv(f, "clean_up", 1);
	F = null;
	rt.forList(f, 0, rt.sv(f, "fields"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
	}
	rt.endFor(f, 0);
	CG = null;
	rt.forList(f, 0, rt.sv(f, "connected_gens"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CG = $e;
		(rt.modField(f, (FG = live(CG)), "connected_gens", live(f.src), subtract));
		if (!truthy(rt.fv(f, "clean_up", live(FG)))) {
			yield* g.callName(f, live(FG), "cleanup", []);
		}
		(rt.modSrcVar(f, "connected_gens", live(FG), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "clean_up", 0);
	yield* g.srcCall(f, "update_icon");
	rt.spawnTail(f, 1, "/obj/machinery/field/generator/proc/cleanup: spawn at modules/power/singularity/field_generator.dm:320", F, CG, FG, temp, O);
	return f.dot;
}, true);

// a spawn(1) body of /obj/machinery/field/generator/proc/cleanup, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/field/generator/proc/cleanup: spawn at modules/power/singularity/field_generator.dm:320", function* (f: Frame, F: Value, CG: Value, FG: Value, temp: Value, O: Value) {
	let $e: any;
	f.vars = () => [F, CG, FG, temp, O, $e];
	temp = 1;
	O = null;
	rt.forList(f, 0, rt.gl("singularities"), T("/obj/singularity"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.fv(f, "last_warning", live(O))) && truthy(live(temp)))) {
			if (rt.gt(subtract(rt.worldTime(f), rt.fv(f, "last_warning", live(O))), 50)) {
				temp = 0;
				yield* g.call(f, P("/proc/message_admins"), null, ["A singulo exists and a containment field has failed.", 1]);
				yield* g.srcCall(f, "investigate_log", "has <font color='red'>failed</font> whilst a singulo exists.", "singulo");
			}
		}
		rt.setFv(f, "last_warning", live(O), rt.worldTime(f));
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/field/generator/proc/shock  (code/modules/power/singularity/field_generator.dm:331)  may sleep
rt.def("/obj/machinery/field/generator/proc/shock", function* shock(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "fields")))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/field/generator/proc/bump_field  (code/modules/power/singularity/field_generator.dm:335)  may sleep
rt.def("/obj/machinery/field/generator/proc/bump_field", function* bump_field(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "fields")))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });
