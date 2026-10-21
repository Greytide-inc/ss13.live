// From code/modules/power/antimatter/control.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10327, "/obj/machinery/power/am_control_unit", "/obj/machinery/power", {
	linked_shielding: null,
	linked_cores: null,
	fueljar: null,
	update_shield_icons: 0,
	stability: 100,
	exploding: 0,
	active: 0,
	fuel_injection: 2,
	shield_icon_delay: 0,
	reported_core_efficiency: 0,
	power_cycle: 0,
	power_cycle_delay: 4,
	stored_core_stability: 0,
	stored_core_stability_delay: 0,
	stored_power: 0,
	anchored: 0,
	name: "antimatter control unit",
	desc: "This device injects antimatter into connected shielding units, the more antimatter injected the more power produced.  Wrench the device to set it up.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "control",
	density: 1,
	use_power: 1,
	idle_power_usage: 100,
	active_power_usage: 1000,
});

// /obj/machinery/power/am_control_unit/proc/New  (code/modules/power/antimatter/control.dm:33)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "linked_shielding", rt.list());
	rt.setSv(f, "linked_cores", rt.list());
	return f.dot;
}, true);

// /obj/machinery/power/am_control_unit/proc/Destroy  (code/modules/power/antimatter/control.dm:39)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/Destroy", function* Destroy(f: Frame) {
	let AMS: Value = null;
	let $e: any;
	f.vars = () => [AMS, $e];
	AMS = null;
	rt.forList(f, 0, rt.sv(f, "linked_shielding"), T("/obj/machinery/am_shielding"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AMS = $e;
		rt.setFv(f, "control_unit", live(AMS), null);
		yield* g.call(f, P("/proc/qdel"), null, [live(AMS)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "fueljar")]);
	rt.setSv(f, "fueljar", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/am_control_unit/proc/process  (code/modules/power/antimatter/control.dm:49)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "exploding"))) {
		yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(f.src), 0), 8, 12, 18, 12]);
		if (truthy(live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	if ((truthy(rt.sv(f, "update_shield_icons")) && !truthy(rt.sv(f, "shield_icon_delay")))) {
		yield* g.srcCall(f, "check_shield_icons");
		rt.setSv(f, "update_shield_icons", 0);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || !truthy(rt.sv(f, "active")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "fueljar"))) {
		yield* g.srcCall(f, "toggle_power");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-two.ogg"), 50, 0]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_avail", rt.sv(f, "stored_power"));
	rt.incSrcVar(f, "power_cycle", 1, true);
	if (rt.ge(rt.sv(f, "power_cycle"), rt.sv(f, "power_cycle_delay"))) {
		yield* g.srcCall(f, "produce_power");
		rt.setSv(f, "power_cycle", 0);
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/machinery/power/am_control_unit/proc/produce_power  (code/modules/power/antimatter/control.dm:76)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/produce_power", function* produce_power(f: Frame) {
	let core_power: Value = null, core_damage: Value = null, fuel: Value = null, AMS: Value = null;
	let $e: any;
	f.vars = () => [core_power, core_damage, fuel, AMS, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/bang.ogg"), 25, 1]);
	if (rt.le((core_power = rt.sv(f, "reported_core_efficiency")), 0)) {
		return 0;
	}
	core_damage = 0;
	rt.setSv(f, "stored_power", multiply(multiply(divide((fuel = (yield* g.callName(f, rt.sv(f, "fueljar"), "usefuel", [rt.sv(f, "fuel_injection")]))), live(core_power)), live(fuel)), 200000));
	if (rt.gt(live(fuel), multiply(2, live(core_power)))) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			core_damage = 1;
		}
		if (rt.gt(subtract(live(fuel), live(core_power)), 5)) {
			core_damage = 5;
		}
		if (rt.gt(subtract(live(fuel), live(core_power)), 10)) {
			core_damage = 20;
		}
		if (isEqual(live(core_damage), 0)) {
			return live(f.dot);
		}
		AMS = null;
		rt.forList(f, 0, rt.sv(f, "linked_cores"), T("/obj/machinery/am_shielding"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AMS = $e;
			(rt.modField(f, live(AMS), "stability", live(core_damage), subtract));
			yield* g.callName(f, live(AMS), "check_stability", [1]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
	}
	return live(f.dot);
}, true);

// /obj/machinery/power/am_control_unit/proc/emp_act  (code/modules/power/antimatter/control.dm:102)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === 1) {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.srcCall(f, "toggle_power");
		}
		(rt.modSrcVar(f, "stability", (yield* g.call(f, P("/proc/rand"), null, [15, 30])), subtract));
	} else if ($0 === 2) {
		if (truthy(rt.sv(f, "active"))) {
			yield* g.srcCall(f, "toggle_power");
		}
		(rt.modSrcVar(f, "stability", (yield* g.call(f, P("/proc/rand"), null, [10, 20])), subtract));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return 0;
}, true, { args: ["severity"] });

// /obj/machinery/power/am_control_unit/proc/blob_act  (code/modules/power/antimatter/control.dm:116)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/blob_act", function* blob_act(f: Frame) {
	let AMS: Value = null;
	let $e: any;
	f.vars = () => [AMS, $e];
	(rt.modSrcVar(f, "stability", 20, subtract));
	if (truthy(rt.op(f, "Prob", [], [subtract(100, rt.sv(f, "stability"))]))) {
		AMS = null;
		rt.forList(f, 0, rt.sv(f, "linked_shielding"), T("/obj/machinery/am_shielding"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AMS = $e;
			yield* g.callName(f, live(AMS), "blob_act", []);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "check_stability");
	return live(f.dot);
}, true);

// /obj/machinery/power/am_control_unit/proc/ex_act  (code/modules/power/antimatter/control.dm:127)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	(rt.modSrcVar(f, "stability", subtract(80, multiply(live(severity), 20)), subtract));
	yield* g.srcCall(f, "check_stability");
	return live(f.dot);
}, true, { waitfor: false });

// /obj/machinery/power/am_control_unit/proc/bullet_act  (code/modules/power/antimatter/control.dm:133)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/bullet_act", function* bullet_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (isEqual(rt.fv(f, "flag", live(f.args[0])), "bullet")) return f.dot;
	(rt.modSrcVar(f, "stability", rt.fv(f, "force", live(f.args[0])), subtract));
	yield* g.srcCall(f, "check_stability");
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/machinery/power/am_control_unit/proc/power_change  (code/modules/power/antimatter/control.dm:140)
rt.def("/obj/machinery/power/am_control_unit/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		if (truthy(rt.sv(f, "active"))) {
			rt.callSrc(f, "toggle_power", [1]);
		} else {
			rt.setSv(f, "use_power", 0);
		}
	} else {
		if ((!truthy(rt.sv(f, "stat")) && truthy(rt.sv(f, "anchored")))) {
			rt.setSv(f, "use_power", 1);
		}
	}
	return live(f.dot);
});

// /obj/machinery/power/am_control_unit/proc/update_icon  (code/modules/power/antimatter/control.dm:155)
rt.def("/obj/machinery/power/am_control_unit/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "control_on");
	} else {
		rt.setSv(f, "icon_state", "control");
	}
	return f.dot;
});

// /obj/machinery/power/am_control_unit/proc/attackby  (code/modules/power/antimatter/control.dm:161)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ secures the ＀ to the floor.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You secure the anchor bolts to the floor.</span>", "<span class='italics'>You hear a ratchet.</span>"]);
			rt.setFv(f, "anchored", live(f.src), 1);
			yield* g.srcCall(f, "connect_to_network");
		} else {
			if (rt.gt((!truthy(rt.len(f, rt.sv(f, "linked_shielding"))) ? 1 : 0), 0)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unsecures the ＀.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You remove the anchor bolts.</span>", "<span class='italics'>You hear a ratchet.</span>"]);
				rt.setFv(f, "anchored", live(f.src), 0);
				yield* g.srcCall(f, "disconnect_from_network");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Once bolted and linked to a shielding unit it the ＀ is unable to be moved!</span>", [rt.fv(f, "name", live(f.src))])]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/am_containment")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "fueljar"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is already a ＀ inside!</span>", [rt.sv(f, "fueljar")])]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "fueljar", live(f.args[0]));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ loads an ＀ into the ＀.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.args[0])), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You load an ＀.</span>", [rt.fv(f, "name", live(f.args[0]))]), "<span class='italics'>You hear a thunk.</span>"]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/am_control_unit/proc/take_damage  (code/modules/power/antimatter/control.dm:195)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/take_damage", function* take_damage(f: Frame, damage: Value, damage_type: Value, sound_effect: Value) {
	let $0: any;
	f.vars = () => [damage, damage_type, sound_effect, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(sound_effect) === null) {
		sound_effect = 1;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(sound_effect))) {
			if (truthy(live(damage))) {
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
	if (!rt.ge(live(damage), 20)) return f.dot;
	(rt.modSrcVar(f, "stability", divide(live(damage), 2), subtract));
	yield* g.srcCall(f, "check_stability");
	return f.dot;
}, true);

// /obj/machinery/power/am_control_unit/proc/attack_hand  (code/modules/power/antimatter/control.dm:213)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "anchored"))) return f.dot;
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/power/am_control_unit/proc/add_shielding  (code/modules/power/antimatter/control.dm:216)
rt.def("/obj/machinery/power/am_control_unit/proc/add_shielding", function add_shielding(f: Frame, AMS: Value, AMS_linking: Value) {
	f.vars = () => [AMS_linking];
	if (live(AMS_linking) === null) {
		AMS_linking = 0;
	}
	if (!truthy((rt.istype(live(AMS), T("/obj/machinery/am_shielding")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "anchored"))) {
		return 0;
	}
	if ((!truthy(live(AMS_linking)) && !truthy(rt.callName(f, live(AMS), "link_control", [live(f.src)])))) {
		return 0;
	}
	rt.callName(f, rt.sv(f, "linked_shielding"), "Add", [live(AMS)]);
	rt.setSv(f, "update_shield_icons", 1);
	return 1;
});

// /obj/machinery/power/am_control_unit/proc/remove_shielding  (code/modules/power/antimatter/control.dm:228)
rt.def("/obj/machinery/power/am_control_unit/proc/remove_shielding", function remove_shielding(f: Frame, AMS: Value) {
	if (!truthy((rt.istype(live(AMS), T("/obj/machinery/am_shielding")) ? 1 : 0))) {
		return 0;
	}
	rt.callName(f, rt.sv(f, "linked_shielding"), "Remove", [live(AMS)]);
	rt.setSv(f, "update_shield_icons", 2);
	if (truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "toggle_power", []);
	}
	return 1;
});

// /obj/machinery/power/am_control_unit/proc/check_stability  (code/modules/power/antimatter/control.dm:238)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/check_stability", function* check_stability(f: Frame) {
	if (rt.le(rt.sv(f, "stability"), 0)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return live(f.dot);
}, true);

// /obj/machinery/power/am_control_unit/proc/toggle_power  (code/modules/power/antimatter/control.dm:244)
rt.def("/obj/machinery/power/am_control_unit/proc/toggle_power", function toggle_power(f: Frame, powerfail: Value) {
	f.vars = () => [powerfail];
	if (live(powerfail) === null) {
		powerfail = 0;
	}
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "use_power", 2);
		rt.callSrc(f, "visible_message", [fmt("The ＀ starts up.", [rt.fv(f, "name", live(f.src))])]);
	} else {
		rt.setSv(f, "use_power", (!truthy(live(powerfail)) ? 1 : 0));
		rt.callSrc(f, "visible_message", [fmt("The ＀ shuts down.", [rt.fv(f, "name", live(f.src))])]);
	}
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
});

// /obj/machinery/power/am_control_unit/proc/check_shield_icons  (code/modules/power/antimatter/control.dm:259)
rt.def("/obj/machinery/power/am_control_unit/proc/check_shield_icons", function check_shield_icons(f: Frame) {
	let AMS: Value = null;
	let $e: any;
	f.vars = () => [AMS, $e];
	if (truthy(rt.sv(f, "shield_icon_delay"))) {
		return live(f.dot);
	}
	rt.setSv(f, "shield_icon_delay", 1);
	if (isEqual(rt.sv(f, "update_shield_icons"), 2)) {
		AMS = null;
		rt.forList(f, 0, rt.sv(f, "linked_shielding"), T("/obj/machinery/am_shielding"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AMS = $e;
			if (truthy(rt.fv(f, "processing", live(AMS)))) {
				rt.callName(f, live(AMS), "shutdown_core", []);
			}
			rt.setFv(f, "control_unit", live(AMS), null);
			rt.spawnTail(f, 10, "/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:264", AMS);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "linked_shielding", rt.list());
	} else {
		AMS = null;
		rt.forList(f, 0, rt.sv(f, "linked_shielding"), T("/obj/machinery/am_shielding"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AMS = $e;
			rt.callName(f, live(AMS), "update_icon", []);
		}
		rt.endFor(f, 0);
	}
	rt.spawnTail(f, 20, "/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:271", AMS);
	return live(f.dot);
});

// a spawn(20) body of /obj/machinery/power/am_control_unit/proc/check_shield_icons, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:271", function* (f: Frame, AMS: Value) {
	f.vars = () => [AMS];
	rt.setSv(f, "shield_icon_delay", 0);
	return null;
});

// a spawn(10) body of /obj/machinery/power/am_control_unit/proc/check_shield_icons, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/am_control_unit/proc/check_shield_icons: spawn at modules/power/antimatter/control.dm:264", function* (f: Frame, AMS: Value) {
	f.vars = () => [AMS];
	yield* g.callName(f, live(AMS), "controllerscan", []);
	return null;
});

// /obj/machinery/power/am_control_unit/proc/check_core_stability  (code/modules/power/antimatter/control.dm:277)
rt.def("/obj/machinery/power/am_control_unit/proc/check_core_stability", function check_core_stability(f: Frame) {
	let AMS: Value = null;
	let $e: any;
	f.vars = () => [AMS, $e];
	if ((truthy(rt.sv(f, "stored_core_stability_delay")) || rt.le(rt.len(f, rt.sv(f, "linked_cores")), 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "stored_core_stability_delay", 1);
	rt.setSv(f, "stored_core_stability", 0);
	AMS = null;
	rt.forList(f, 0, rt.sv(f, "linked_cores"), T("/obj/machinery/am_shielding"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AMS = $e;
		rt.modSrcVar(f, "stored_core_stability", rt.fv(f, "stability", live(AMS)), add);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "stored_core_stability", rt.len(f, rt.sv(f, "linked_cores")), divide));
	rt.spawnTail(f, 40, "/obj/machinery/power/am_control_unit/proc/check_core_stability: spawn at modules/power/antimatter/control.dm:284", AMS);
	return live(f.dot);
});

// a spawn(40) body of /obj/machinery/power/am_control_unit/proc/check_core_stability, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/am_control_unit/proc/check_core_stability: spawn at modules/power/antimatter/control.dm:284", function* (f: Frame, AMS: Value) {
	f.vars = () => [AMS];
	rt.setSv(f, "stored_core_stability_delay", 0);
	return null;
});

// /obj/machinery/power/am_control_unit/proc/interact  (code/modules/power/antimatter/control.dm:290)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any;
	f.vars = () => [user, dat, $0];
	if ((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			yield* g.callName(f, live(user), "unset_machine", []);
			rt.op(f, "Browse", [], [live(user), null, "window=AMcontrol"], false);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "";
	dat = rt.modify(live(dat), "AntiMatter Control Panel<BR>", add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;close=1'>Close</A><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;refresh=1'>Refresh</A><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;refreshicons=1'>Force Shielding Update</A><BR><BR>", [live(f.src)]), add);
	if (truthy(rt.sv(f, "active"))) {
		$0 = "Injecting";
	} else {
		$0 = "Standby";
	}
	dat = rt.modify(live(dat), fmt("Status: ＀ <BR>", [$0]), add);
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;togglestatus=1'>Toggle Status</A><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("Stability: ＀%<BR>", [rt.sv(f, "stability")]), add);
	dat = rt.modify(live(dat), fmt("Reactor parts: ＀<BR>", [rt.len(f, rt.sv(f, "linked_shielding"))]), add);
	dat = rt.modify(live(dat), fmt("Cores: ＀<BR><BR>", [rt.len(f, rt.sv(f, "linked_cores"))]), add);
	dat = rt.modify(live(dat), fmt("-Current Efficiency: ＀<BR>", [rt.sv(f, "reported_core_efficiency")]), add);
	dat = rt.modify(live(dat), fmt("-Average Stability: ＀ <A href='?src=＃;refreshstability=1'>(update)</A><BR>", [rt.sv(f, "stored_core_stability"), live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("Last Produced: ＀<BR>", [rt.sv(f, "stored_power")]), add);
	dat = rt.modify(live(dat), "Fuel: ", add);
	if (!truthy(rt.sv(f, "fueljar"))) {
		dat = rt.modify(live(dat), "<BR>No fuel receptacle detected.", add);
	} else {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;ejectjar=1'>Eject</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("- ＀/＀ Units<BR>", [rt.fv(f, "fuel", rt.sv(f, "fueljar")), rt.fv(f, "fuel_max", rt.sv(f, "fueljar"))]), add);
		dat = rt.modify(live(dat), fmt("- Injecting: ＀ units<BR>", [rt.sv(f, "fuel_injection")]), add);
		dat = rt.modify(live(dat), fmt("- <A href='?src=＃;strengthdown=1'>--</A>|<A href='?src=＃;strengthup=1'>++</A><BR><BR>", [live(f.src), live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=AMcontrol;size=420x500"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "AMcontrol"]);
	return live(f.dot);
}, true);

// /obj/machinery/power/am_control_unit/proc/Topic  (code/modules/power/antimatter/control.dm:329)  may sleep
rt.def("/obj/machinery/power/am_control_unit/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=AMcontrol"], false);
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "togglestatus"))) {
		yield* g.srcCall(f, "toggle_power");
	}
	if (truthy(rt.at(live(f.args[1]), "refreshicons"))) {
		rt.setSv(f, "update_shield_icons", 1);
	}
	if (truthy(rt.at(live(f.args[1]), "ejectjar"))) {
		if (truthy(rt.sv(f, "fueljar"))) {
			rt.setFv(f, "loc", rt.sv(f, "fueljar"), rt.fv(f, "loc", live(f.src)));
			rt.setSv(f, "fueljar", null);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "strengthup"))) {
		rt.incSrcVar(f, "fuel_injection", 1, true);
	}
	if (truthy(rt.at(live(f.args[1]), "strengthdown"))) {
		rt.incSrcVar(f, "fuel_injection", -1, true);
		if (rt.lt(rt.sv(f, "fuel_injection"), 0)) {
			rt.setSv(f, "fuel_injection", 0);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "refreshstability"))) {
		yield* g.srcCall(f, "check_core_stability");
	}
	yield* g.srcCall(f, "updateDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });
