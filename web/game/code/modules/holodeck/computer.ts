// From code/modules/holodeck/computer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10421, "/obj/machinery/computer/holodeck", "/obj/machinery/computer", {
	linked: null,
	program: null,
	last_program: null,
	program_cache: null,
	emag_programs: null,
	init_program: null,
	random_program: 0,
	active: 0,
	damaged: 0,
	spawned: null,
	effects: null,
	last_change: 0,
	offline_program: rt.typePath("/area/holodeck/rec_center/offline"),
	holodeck_type: rt.typePath("/area/holodeck/rec_center"),
	program_type: rt.typePath("/area/holodeck/rec_center"),
	icon_screen: "holocontrol",
	name: "holodeck control console",
	desc: "A computer used to control a nearby holodeck.",
	idle_power_usage: 10,
	active_power_usage: 50,
});

// /obj/machinery/computer/holodeck/proc/<init>  (code/modules/holodeck/computer.dm:29)
rt.def("/obj/machinery/computer/holodeck/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "program_cache", rt.list());
	$0 = $0;
	rt.setSv(f, "emag_programs", rt.list());
	$0 = $0;
	rt.setSv(f, "spawned", rt.list());
	$0 = $0;
	rt.setSv(f, "effects", rt.list());
	return f.dot;
});

// /obj/machinery/computer/holodeck/proc/Initialize  (code/modules/holodeck/computer.dm:51)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true, { args: ["mapload"] });

// /obj/machinery/computer/holodeck/proc/LateInitialize  (code/modules/holodeck/computer.dm:55)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/LateInitialize", function* LateInitialize(f: Frame) {
	let possible: Value = null, AS: Value = null, typekey: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [possible, AS, typekey, A, $e];
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "holodeck_type"), T("/area")])))) {
		rt.setSv(f, "linked", (yield* g.call(f, P("/proc/pop"), null, [(possible = (yield* g.call(f, P("/proc/get_areas"), null, [null, rt.sv(f, "holodeck_type"), "subtypes", 0], rt.Args.Named)))])));
	}
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "offline_program"), T("/area")])))) {
		rt.setSv(f, "offline_program", (yield* g.call(f, P("/proc/pop"), null, [(possible = (yield* g.call(f, P("/proc/get_areas"), null, [null, rt.sv(f, "offline_program"), "subtypes", 0], rt.Args.Named)))])));
	}
	if ((!truthy(rt.sv(f, "linked")) || !truthy(rt.sv(f, "offline_program")))) {
		yield* g.call(f, P("/proc/log_world"), null, ["No matching holodeck area found"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((rt.istype((AS = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), T("/area/holodeck")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/log_world"), null, ["### MAPPING ERROR"]);
		yield* g.call(f, P("/proc/log_world"), null, ["Holodeck computer cannot be in a holodeck."]);
		yield* g.call(f, P("/proc/log_world"), null, ["This would cause circular power dependency."]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		rt.setFv(f, "linked", rt.sv(f, "linked"), live(f.src));
	}
	rt.setSv(f, "program_cache", rt.list());
	rt.setSv(f, "emag_programs", rt.list());
	typekey = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [rt.sv(f, "program_type")])), rt.sv(f, "program_type")));
	while (($e = rt.next(f, 0)) !== undefined) {
		typekey = $e;
		if ((!truthy((A = rt.locateIn(f, live(typekey), rt.world()))) || isEqual(live(A), rt.sv(f, "offline_program")))) {
			continue;
		}
		if (isEqual(rt.getLen(f, rt.fv(f, "contents", live(A))), 0)) {
			continue;
		}
		if (truthy(rt.fv(f, "restricted", live(A)))) {
			rt.modSrcVar(f, "emag_programs", live(A), add);
		} else {
			rt.modSrcVar(f, "program_cache", live(A), add);
		}
		if (isEqual(live(typekey), rt.sv(f, "init_program"))) {
			yield* g.callSrc(f, "load_program", [null, live(A), "force", 1], rt.Args.Named);
		}
	}
	rt.endFor(f, 0);
	if (((truthy(rt.sv(f, "random_program")) && truthy(rt.len(f, rt.sv(f, "program_cache")))) && rt.sv(f, "init_program") === null)) {
		yield* g.callSrc(f, "load_program", [null, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "program_cache")]), "force", 1], rt.Args.Named);
	} else {
		if (truthy(rt.sv(f, "program"))) return f.dot;
		yield* g.srcCall(f, "load_program", rt.sv(f, "offline_program"));
	}
	return f.dot;
}, true);

// /obj/machinery/computer/holodeck/proc/power_change  (code/modules/holodeck/computer.dm:96)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/power_change", function* power_change(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "toggle_power", (!truthy(rt.sv(f, "stat")) ? 1 : 0));
	return f.dot;
}, true);

// /obj/machinery/computer/holodeck/proc/toggle_power  (code/modules/holodeck/computer.dm:100)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/toggle_power", function* toggle_power(f: Frame, toggleOn: Value) {
	f.vars = () => [toggleOn];
	if (live(toggleOn) === null) {
		toggleOn = 0;
	}
	if (isEqual(rt.sv(f, "active"), live(toggleOn))) {
		return live(f.dot);
	}
	if (truthy(live(toggleOn))) {
		if ((truthy(rt.sv(f, "last_program")) && !isEqual(rt.sv(f, "last_program"), rt.sv(f, "offline_program")))) {
			yield* g.callSrc(f, "load_program", [null, rt.sv(f, "last_program"), "delay", 1], rt.Args.Named);
		}
		rt.setSv(f, "active", 1);
	} else {
		rt.setSv(f, "last_program", rt.sv(f, "program"));
		yield* g.callSrc(f, "load_program", [null, rt.sv(f, "offline_program"), "force", 1], rt.Args.Named);
		rt.setSv(f, "active", 0);
	}
	return f.dot;
}, true);

// /obj/machinery/computer/holodeck/proc/emergency_shutdown  (code/modules/holodeck/computer.dm:112)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/emergency_shutdown", function* emergency_shutdown(f: Frame) {
	rt.setSv(f, "last_program", rt.sv(f, "program"));
	yield* g.srcCall(f, "load_program", rt.sv(f, "offline_program"), 1);
	rt.setSv(f, "active", 0);
	return f.dot;
}, true);

// /obj/machinery/computer/holodeck/proc/process  (code/modules/holodeck/computer.dm:118)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/process", function* process(f: Frame) {
	let _T: Value = null, s: Value = null, M: Value = null, item: Value = null, HE: Value = null;
	let $e: any;
	f.vars = () => [_T, s, M, item, HE, $e];
	if (truthy(rt.sv(f, "damaged"))) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			_T = null;
			rt.forList(f, 0, rt.sv(f, "linked"), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy(rt.op(f, "Prob", [], [5]))) {
					yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [2, 1, live(_T)]);
					yield* g.callName(f, live(s), "start", []);
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
		}
	}
	if ((!truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy(rt.sv(f, "active")))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "floorcheck")))) {
		yield* g.srcCall(f, "emergency_shutdown");
		rt.setSv(f, "damaged", 1);
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [10, live(f.src)])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "show_message", ["The holodeck overloads!"]);
		}
		rt.endFor(f, 0);
		_T = null;
		rt.forList(f, 0, rt.sv(f, "linked"), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy(rt.op(f, "Prob", [], [30]))) {
				yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [2, 1, live(_T)]);
				yield* g.callName(f, live(s), "start", []);
			}
			yield* g.callName(f, live(_T), "ex_act", [3]);
			yield* g.callName(f, live(_T), "hotspot_expose", [1000, 500, 1]);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "emagged"))) {
		item = null;
		rt.forList(f, 0, rt.sv(f, "spawned"));
		while (($e = rt.next(f, 0)) !== undefined) {
			item = $e;
			if (!truthy((rt.isIn(f, rt.getStep(f, live(item), 0), rt.sv(f, "linked")) ? 1 : 0))) {
				yield* g.srcCall(f, "derez", live(item), 0);
			}
		}
		rt.endFor(f, 0);
	}
	HE = null;
	rt.forList(f, 0, rt.sv(f, "effects"), T("/obj/effect/holodeck_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HE = $e;
		yield* g.callName(f, live(HE), "tick", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "active_power_usage", add(add(50, multiply(rt.len(f, rt.sv(f, "spawned")), 3)), multiply(rt.len(f, rt.sv(f, "effects")), 5)));
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/holodeck/proc/floorcheck  (code/modules/holodeck/computer.dm:153)
rt.def("/obj/machinery/computer/holodeck/proc/floorcheck", function floorcheck(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	_T = null;
	rt.forList(f, 0, rt.sv(f, "linked"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((!truthy(rt.fv(f, "intact", live(_T))) || truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/machinery/computer/holodeck/proc/Topic  (code/modules/holodeck/computer.dm:159)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/Topic", function* Topic(f: Frame) {
	let areapath: Value = null, area: Value = null, safe: Value = null;
	f.vars = () => [areapath, area, safe];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy(rt.at(live(f.args[1]), "loadarea"))) {
		if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [(areapath = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "loadarea")]))), T("/area/holodeck")])))) {
			return live(f.dot);
		}
		if (!truthy((rt.istype((area = rt.locateIn(f, live(areapath), rt.world())), T("/area/holodeck")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (((isEqual(live(area), rt.sv(f, "offline_program")) || truthy((rt.isIn(f, live(area), rt.sv(f, "program_cache")) ? 1 : 0))) || (truthy(rt.sv(f, "emagged")) && truthy((rt.isIn(f, live(area), rt.sv(f, "emag_programs")) ? 1 : 0))))) {
			yield* g.srcCall(f, "load_program", live(area));
		}
	} else {
		if (truthy((rt.isIn(f, "safety", live(f.args[1])) ? 1 : 0))) {
			safe = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "safety")]));
			if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
				return live(f.dot);
			}
			rt.setSv(f, "emagged", (!truthy(live(safe)) ? 1 : 0));
			if (!truthy(rt.sv(f, "program"))) {
				return live(f.dot);
			}
			if ((truthy(live(safe)) && truthy((rt.isIn(f, rt.sv(f, "program"), rt.sv(f, "emag_programs")) ? 1 : 0)))) {
				yield* g.srcCall(f, "emergency_shutdown");
			}
			yield* g.srcCall(f, "nerf", live(safe));
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/holodeck/proc/nerf  (code/modules/holodeck/computer.dm:185)
rt.def("/obj/machinery/computer/holodeck/proc/nerf", function nerf(f: Frame, active: Value) {
	let I: Value = null, HE: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [I, HE, $0, $1, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "spawned"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		$0 = live(I);
		if (truthy(live(active))) {
			$1 = "stamina";
		} else {
			$1 = rt.initial(f, live(I), "damtype");
		}
		rt.setFv(f, "damtype", $0, $1);
	}
	rt.endFor(f, 0);
	HE = null;
	rt.forList(f, 0, rt.sv(f, "effects"), T("/obj/effect/holodeck_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HE = $e;
		rt.callName(f, live(HE), "safety", [live(active)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/holodeck/proc/emag_act  (code/modules/holodeck/computer.dm:191)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	if (!truthy(rt.len(f, rt.sv(f, "emag_programs")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ does not seem to have a card swipe port.  It must be an inferior model.", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/sparks4.ogg"), 75, 1]);
	rt.setSv(f, "emagged", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You vastly increase projector power and override the safety and security protocols.</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Warning.  Automatic shutoff and derezing protocols have been corrupted.  Please call Nanotrasen maintenance and do not use the simulator."]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ emagged the Holodeck Control Console", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.srcCall(f, "nerf", (!truthy(rt.sv(f, "emagged")) ? 1 : 0));
	return f.dot;
}, true);

// /obj/machinery/computer/holodeck/proc/Destroy  (code/modules/holodeck/computer.dm:205)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "linked"))) {
		yield* g.srcCall(f, "emergency_shutdown");
		rt.setFv(f, "linked", rt.sv(f, "linked"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/holodeck/proc/emp_act  (code/modules/holodeck/computer.dm:210)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.srcCall(f, "emergency_shutdown");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["severity"] });

// /obj/machinery/computer/holodeck/proc/ex_act  (code/modules/holodeck/computer.dm:214)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.srcCall(f, "emergency_shutdown");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/computer/holodeck/proc/blob_act  (code/modules/holodeck/computer.dm:218)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/blob_act", function* blob_act(f: Frame) {
	yield* g.srcCall(f, "emergency_shutdown");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["B"] });
