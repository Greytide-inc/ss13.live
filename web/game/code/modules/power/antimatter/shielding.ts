// From code/modules/power/antimatter/shielding.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/cardinalrange  (code/modules/power/antimatter/shielding.dm:3)
rt.def("/proc/cardinalrange", function cardinalrange(f: Frame, center: Value) {
	let things: Value = null, direction: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [things, direction, _T, $e];
	things = rt.list();
	direction = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (!truthy((_T = rt.getStep(f, live(center), live(direction))))) {
			continue;
		}
		things = rt.modify(live(things), rt.fv(f, "contents", live(_T)), add);
	}
	rt.endFor(f, 0);
	return live(things);
});

rt.type(10975, "/obj/machinery/am_shielding", "/obj/machinery", {
	control_unit: null,
	processing: 0,
	stability: 100,
	efficiency: 1,
	coredirs: 0,
	dirs: 0,
	anchored: 1,
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
	name: "antimatter reactor section",
	desc: "This device was built using a plasma life-form that seems to increase plasma's natural ability to react with neutrinos while reducing the combustibility.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "shield",
	density: 1,
	dir: 1,
});

// /obj/machinery/am_shielding/proc/Initialize  (code/modules/power/antimatter/shielding.dm:32)  may sleep
rt.def("/obj/machinery/am_shielding/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/am_shielding/proc/controllerscan")])), 10]);
	return f.dot;
}, true);

// /obj/machinery/am_shielding/proc/controllerscan  (code/modules/power/antimatter/shielding.dm:38)  may sleep
rt.def("/obj/machinery/am_shielding/proc/controllerscan", function* controllerscan(f: Frame, priorscan: Value) {
	let AMS: Value = null, direction: Value = null, AMC: Value = null;
	let $e: any;
	f.vars = () => [priorscan, AMS, direction, AMC, $e];
	if (live(priorscan) === null) {
		priorscan = 0;
	}
	if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/turf")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	AMS = null;
	rt.forList(f, 0, rt.fv(f, "contents", rt.sv(f, "loc")), T("/obj/machinery/am_shielding"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AMS = $e;
		if (isEqual(live(AMS), live(f.src))) {
			continue;
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	AMS = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/cardinalrange"), null, [live(f.src)])), T("/obj/machinery/am_shielding"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AMS = $e;
		if (((truthy(live(AMS)) && truthy(rt.fv(f, "control_unit", live(AMS)))) && truthy((yield* g.srcCall(f, "link_control", rt.fv(f, "control_unit", live(AMS))))))) {
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "control_unit"))) {
		direction = null;
		rt.forList(f, 0, rt.gl("cardinal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			direction = $e;
		}
		rt.endFor(f, 0);
		AMC = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/cardinalrange"), null, [live(f.src)])), T("/obj/machinery/power/am_control_unit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AMC = $e;
			if (truthy((yield* g.callName(f, live(AMC), "add_shielding", [live(f.src)])))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "control_unit"))) return f.dot;
	if (!truthy(live(priorscan))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/am_shielding/proc/controllerscan"), 1])), 20]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/am_shielding/proc/Destroy  (code/modules/power/antimatter/shielding.dm:67)  may sleep
rt.def("/obj/machinery/am_shielding/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "control_unit"))) {
		yield* g.callName(f, rt.sv(f, "control_unit"), "remove_shielding", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "processing"))) {
		yield* g.srcCall(f, "shutdown_core");
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ melts!</span>", [rt.fv(f, "name", live(f.src))]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/am_shielding/proc/CanPass  (code/modules/power/antimatter/shielding.dm:76)
rt.def("/obj/machinery/am_shielding/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	return 0;
});

// /obj/machinery/am_shielding/proc/process  (code/modules/power/antimatter/shielding.dm:82)
rt.def("/obj/machinery/am_shielding/proc/process", function process(f: Frame) {
	if (!truthy(rt.sv(f, "processing"))) {
		f.dot = 26;
	}
	return live(f.dot);
}, false, { waitfor: false });

// /obj/machinery/am_shielding/proc/ex_act  (code/modules/power/antimatter/shielding.dm:93)  may sleep
rt.def("/obj/machinery/am_shielding/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	(rt.modSrcVar(f, "stability", subtract(80, multiply(live(severity), 20)), subtract));
	yield* g.srcCall(f, "check_stability");
	return live(f.dot);
}, true, { waitfor: false });

// /obj/machinery/am_shielding/proc/bullet_act  (code/modules/power/antimatter/shielding.dm:99)  may sleep
rt.def("/obj/machinery/am_shielding/proc/bullet_act", function* bullet_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (isEqual(rt.fv(f, "flag", live(f.args[0])), "bullet")) return f.dot;
	(rt.modSrcVar(f, "stability", divide(rt.fv(f, "force", live(f.args[0])), 2), subtract));
	yield* g.srcCall(f, "check_stability");
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/machinery/am_shielding/proc/update_icon  (code/modules/power/antimatter/shielding.dm:108)
rt.def("/obj/machinery/am_shielding/proc/update_icon", function update_icon(f: Frame) {
	let direction: Value = null, _T: Value = null, machine: Value = null, shield: Value = null, control: Value = null, prefix: Value = null, icondirs: Value = null;
	let $e: any;
	f.vars = () => [direction, _T, machine, shield, control, prefix, icondirs, $e];
	rt.setSv(f, "dirs", 0);
	rt.setSv(f, "coredirs", 0);
	rt.callSrc(f, "cut_overlays", []);
	direction = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		_T = rt.getStep(f, rt.sv(f, "loc"), live(direction));
		machine = null;
		rt.forList(f, 1, live(_T), T("/obj/machinery"));
		while (($e = rt.next(f, 1)) !== undefined) {
			machine = $e;
			if (truthy((rt.istype(live(machine), T("/obj/machinery/am_shielding")) ? 1 : 0))) {
				if (isEqual(rt.gv(f, "control_unit", (shield = live(machine))), rt.sv(f, "control_unit"))) {
					if (truthy(rt.fv(f, "processing", live(shield)))) {
						(rt.modSrcVar(f, "coredirs", live(direction), rt.bitOr));
					}
					if (truthy((rt.isIn(f, live(direction), rt.gl("cardinal")) ? 1 : 0))) {
						(rt.modSrcVar(f, "dirs", live(direction), rt.bitOr));
					}
				}
			} else {
				if ((truthy((rt.istype(live(machine), T("/obj/machinery/power/am_control_unit")) ? 1 : 0)) && truthy((rt.isIn(f, live(direction), rt.gl("cardinal")) ? 1 : 0)))) {
					if (isEqual((control = live(machine)), rt.sv(f, "control_unit"))) {
						(rt.modSrcVar(f, "dirs", live(direction), rt.bitOr));
					}
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	prefix = "";
	icondirs = rt.sv(f, "dirs");
	if (truthy(rt.sv(f, "coredirs"))) {
		prefix = "core";
	}
	rt.setSv(f, "icon_state", fmt("＀shield_＀", [live(prefix), live(icondirs)]));
	if (truthy(rt.callSrc(f, "core_check", []))) {
		rt.callSrc(f, "add_overlay", [fmt("core＀", [(rt.sv(f, "control_unit") && rt.fv(f, "active", rt.sv(f, "control_unit")))])]);
		if (!truthy(rt.sv(f, "processing"))) {
			rt.callSrc(f, "setup_core", []);
		}
	} else {
		if (!truthy(rt.sv(f, "processing"))) return f.dot;
		rt.callSrc(f, "shutdown_core", []);
	}
	return f.dot;
});

// /obj/machinery/am_shielding/proc/take_damage  (code/modules/power/antimatter/shielding.dm:144)  may sleep
rt.def("/obj/machinery/am_shielding/proc/take_damage", function* take_damage(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value) {
	let $0: any;
	f.vars = () => [damage_amount, damage_type, damage_flag, sound_effect, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (live(sound_effect) === null) {
		sound_effect = 1;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(sound_effect))) {
			if (truthy(live(damage_amount))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/smash.ogg"), 50, 1]);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
			}
		}
	} else if ($0 === "fire") {
		if (truthy(live(sound_effect))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
		}
	} else {
		return live(f.dot);
	}
	if (!rt.ge(live(damage_amount), 10)) return f.dot;
	(rt.modSrcVar(f, "stability", divide(live(damage_amount), 2), subtract));
	yield* g.srcCall(f, "check_stability");
	return f.dot;
}, true);

// /obj/machinery/am_shielding/proc/link_control  (code/modules/power/antimatter/shielding.dm:163)
rt.def("/obj/machinery/am_shielding/proc/link_control", function link_control(f: Frame, AMC: Value) {
	if (!truthy((rt.istype(live(AMC), T("/obj/machinery/power/am_control_unit")) ? 1 : 0))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "control_unit")) && !isEqual(rt.sv(f, "control_unit"), live(AMC)))) {
		return 0;
	}
	rt.setSv(f, "control_unit", live(AMC));
	rt.callName(f, rt.sv(f, "control_unit"), "add_shielding", [live(f.src), 1]);
	return 1;
});

// /obj/machinery/am_shielding/proc/core_check  (code/modules/power/antimatter/shielding.dm:174)
rt.def("/obj/machinery/am_shielding/proc/core_check", function core_check(f: Frame) {
	let direction: Value = null, found_am_device: Value = null, machine: Value = null;
	let $e: any;
	f.vars = () => [direction, found_am_device, machine, $e];
	direction = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		found_am_device = 0;
		machine = null;
		rt.forList(f, 1, rt.getStep(f, rt.sv(f, "loc"), live(direction)), T("/obj/machinery"));
		while (($e = rt.next(f, 1)) !== undefined) {
			machine = $e;
			if (!truthy(live(machine))) {
				continue;
			}
			if ((truthy((rt.istype(live(machine), T("/obj/machinery/am_shielding")) ? 1 : 0)) || truthy((rt.istype(live(machine), T("/obj/machinery/power/am_control_unit")) ? 1 : 0)))) {
				found_am_device = 1;
				break;
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(found_am_device))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/machinery/am_shielding/proc/setup_core  (code/modules/power/antimatter/shielding.dm:190)
rt.def("/obj/machinery/am_shielding/proc/setup_core", function setup_core(f: Frame) {
	rt.setSv(f, "processing", 1);
	(rt.modGl("machines", live(f.src), rt.bitOr));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), add);
	}
	if (!truthy(rt.sv(f, "control_unit"))) {
		return live(f.dot);
	}
	rt.callName(f, rt.fv(f, "linked_cores", rt.sv(f, "control_unit")), "Add", [live(f.src)]);
	rt.modField(f, rt.sv(f, "control_unit"), "reported_core_efficiency", rt.sv(f, "efficiency"), add);
	return live(f.dot);
});

// /obj/machinery/am_shielding/proc/shutdown_core  (code/modules/power/antimatter/shielding.dm:201)
rt.def("/obj/machinery/am_shielding/proc/shutdown_core", function shutdown_core(f: Frame) {
	rt.setSv(f, "processing", 0);
	if (!truthy(rt.sv(f, "control_unit"))) {
		return live(f.dot);
	}
	rt.callName(f, rt.fv(f, "linked_cores", rt.sv(f, "control_unit")), "Remove", [live(f.src)]);
	(rt.modField(f, rt.sv(f, "control_unit"), "reported_core_efficiency", rt.sv(f, "efficiency"), subtract));
	return live(f.dot);
});

// /obj/machinery/am_shielding/proc/check_stability  (code/modules/power/antimatter/shielding.dm:209)  may sleep
rt.def("/obj/machinery/am_shielding/proc/check_stability", function* check_stability(f: Frame, injecting_fuel: Value) {
	f.vars = () => [injecting_fuel];
	if (live(injecting_fuel) === null) {
		injecting_fuel = 0;
	}
	if (rt.gt(rt.sv(f, "stability"), 0)) {
		return live(f.dot);
	}
	if ((truthy(live(injecting_fuel)) && truthy(rt.sv(f, "control_unit")))) {
		rt.setFv(f, "exploding", rt.sv(f, "control_unit"), 1);
	}
	if (truthy(live(f.src))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(f.dot);
}, true);

// /obj/machinery/am_shielding/proc/recalc_efficiency  (code/modules/power/antimatter/shielding.dm:219)
rt.def("/obj/machinery/am_shielding/proc/recalc_efficiency", function recalc_efficiency(f: Frame, new_efficiency: Value) {
	f.vars = () => [new_efficiency];
	if ((!truthy(rt.sv(f, "control_unit")) || !truthy(rt.sv(f, "processing")))) {
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "stability"), 50)) {
		(new_efficiency = rt.modify(live(new_efficiency), 2, divide));
	}
	rt.modField(f, rt.sv(f, "control_unit"), "reported_core_efficiency", subtract(live(new_efficiency), rt.sv(f, "efficiency")), add);
	rt.setSv(f, "efficiency", live(new_efficiency));
	return live(f.dot);
});

rt.type(9428, "/obj/item/device/am_shielding_container", "/obj/item/device", {
	flags: 64,
	throw_speed: 1,
	throw_range: 2,
	name: "packaged antimatter reactor section",
	desc: "A small storage unit containing an antimatter reactor section.  To use place near an antimatter control unit or deployed antimatter reactor section and use a multitool to activate this package.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "box",
	item_state: "electronic",
	w_class: 4,
	throwforce: 5,
	materials: null,
});

// /obj/item/device/am_shielding_container/proc/<init>  (code/modules/power/antimatter/shielding.dm:240)
rt.def("/obj/item/device/am_shielding_container/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100]));
	return f.dot;
});

// /obj/item/device/am_shielding_container/proc/attackby  (code/modules/power/antimatter/shielding.dm:243)  may sleep
rt.def("/obj/item/device/am_shielding_container/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) && truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/turf")) ? 1 : 0)))) {
		yield* g.new_(f, T("/obj/machinery/am_shielding"), [rt.fv(f, "loc", live(f.src))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
