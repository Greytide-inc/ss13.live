// From code/modules/modular_computers/computers/machinery/modular_computer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10956, "/obj/machinery/modular_computer", "/obj/machinery", {
	hardware_flag: 0,
	last_power_usage: 0,
	icon_state_unpowered: null,
	icon_state_powered: null,
	screen_icon_state_menu: "menu",
	screen_icon_screensaver: "standby",
	max_hardware_size: 0,
	steel_sheet_cost: 10,
	light_strength: 0,
	base_active_power_usage: 100,
	base_idle_power_usage: 10,
	cpu: null,
	use_power: 1,
	idle_power_usage: 5,
	name: "modular computer",
	desc: "An advanced computer.",
	icon: null,
	icon_state: null,
});

// /obj/machinery/modular_computer/proc/Initialize  (code/modules/modular_computers/computers/machinery/modular_computer.dm:31)  may sleep
rt.def("/obj/machinery/modular_computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "cpu", (yield* g.new_(f, T("/obj/item/device/modular_computer/processor"), [live(f.src)])));
	rt.setFv(f, "physical", rt.sv(f, "cpu"), live(f.src));
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/Destroy  (code/modules/modular_computers/computers/machinery/modular_computer.dm:36)  may sleep
rt.def("/obj/machinery/modular_computer/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cpu")]);
	rt.setSv(f, "cpu", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/modular_computer/proc/attack_ghost  (code/modules/modular_computers/computers/machinery/modular_computer.dm:41)  may sleep
rt.def("/obj/machinery/modular_computer/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "attack_ghost", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/emag_act  (code/modules/modular_computers/computers/machinery/modular_computer.dm:44)
rt.def("/obj/machinery/modular_computer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "cpu"))) {
		$0 = rt.callName(f, rt.sv(f, "cpu"), "emag_act", [live(user)]);
	} else {
		$0 = 1;
	}
	return $0;
});

// /obj/machinery/modular_computer/proc/update_icon  (code/modules/modular_computers/computers/machinery/modular_computer.dm:47)  may sleep
rt.def("/obj/machinery/modular_computer/proc/update_icon", function* update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "icon_state", rt.sv(f, "icon_state_powered"));
	if ((!truthy(rt.sv(f, "cpu")) || !truthy(rt.fv(f, "enabled", rt.sv(f, "cpu"))))) {
		if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && (truthy(rt.sv(f, "cpu")) && truthy((yield* g.callName(f, rt.sv(f, "cpu"), "use_power", [])))))) {
			yield* g.srcCall(f, "add_overlay", rt.sv(f, "screen_icon_screensaver"));
		} else {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_state_unpowered"));
		}
		yield* g.srcCall(f, "set_light", 0);
	} else {
		yield* g.srcCall(f, "set_light", rt.sv(f, "light_strength"));
		if (truthy(rt.fv(f, "active_program", rt.sv(f, "cpu")))) {
			if (truthy(rt.gv(f, "program_icon_state", rt.fv(f, "active_program", rt.sv(f, "cpu"))))) {
				$0 = rt.gv(f, "program_icon_state", rt.fv(f, "active_program", rt.sv(f, "cpu")));
			} else {
				$0 = rt.sv(f, "screen_icon_state_menu");
			}
			yield* g.srcCall(f, "add_overlay", $0);
		} else {
			yield* g.srcCall(f, "add_overlay", rt.sv(f, "screen_icon_state_menu"));
		}
	}
	if (!(truthy(rt.sv(f, "cpu")) && rt.le(rt.fv(f, "obj_integrity", rt.sv(f, "cpu")), rt.fv(f, "integrity_failure", rt.sv(f, "cpu"))))) return f.dot;
	yield* g.srcCall(f, "add_overlay", "bsod");
	yield* g.srcCall(f, "add_overlay", "broken");
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/eject_id  (code/modules/modular_computers/computers/machinery/modular_computer.dm:73)  may sleep
rt.def("/obj/machinery/modular_computer/proc/eject_id", function* eject_id(f: Frame) {
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "eject_id", []);
	return f.dot;
}, true, { verb: { name: "Eject ID", category: "Object" } });

// /obj/machinery/modular_computer/proc/eject_disk  (code/modules/modular_computers/computers/machinery/modular_computer.dm:81)  may sleep
rt.def("/obj/machinery/modular_computer/proc/eject_disk", function* eject_disk(f: Frame) {
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "eject_disk", []);
	return f.dot;
}, true, { verb: { name: "Eject Data Disk", category: "Object" } });

// /obj/machinery/modular_computer/proc/eject_card  (code/modules/modular_computers/computers/machinery/modular_computer.dm:89)  may sleep
rt.def("/obj/machinery/modular_computer/proc/eject_card", function* eject_card(f: Frame) {
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "eject_card", []);
	return f.dot;
}, true, { verb: { name: "Eject Intellicard", category: "Object", src: 1, range: 1 } });

// /obj/machinery/modular_computer/proc/AltClick  (code/modules/modular_computers/computers/machinery/modular_computer.dm:93)  may sleep
rt.def("/obj/machinery/modular_computer/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "AltClick", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/attack_hand  (code/modules/modular_computers/computers/machinery/modular_computer.dm:98)  may sleep
rt.def("/obj/machinery/modular_computer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "attack_self", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/process  (code/modules/modular_computers/computers/machinery/modular_computer.dm:104)
rt.def("/obj/machinery/modular_computer/proc/process", function process(f: Frame) {
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	rt.setFv(f, "name", rt.sv(f, "cpu"), rt.fv(f, "name", live(f.src)));
	rt.callName(f, rt.sv(f, "cpu"), "process", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/modular_computer/proc/power_failure  (code/modules/modular_computers/computers/machinery/modular_computer.dm:109)  may sleep
rt.def("/obj/machinery/modular_computer/proc/power_failure", function* power_failure(f: Frame, malfunction: Value) {
	let battery_module: Value = null;
	let $0: any, $1: any;
	f.vars = () => [malfunction, battery_module, $0, $1];
	if (live(malfunction) === null) {
		malfunction = 0;
	}
	battery_module = rt.index(rt.fv(f, "all_components", rt.sv(f, "cpu")), "CELL");
	if ((truthy(rt.sv(f, "cpu")) && truthy(rt.fv(f, "enabled", rt.sv(f, "cpu"))))) {
		$0 = live(f.src);
		if (truthy(live(battery_module))) {
			if (truthy(live(malfunction))) {
				$1 = "MALFUNCTION";
			} else {
				$1 = "CRITICAL";
			}
			$1 = fmt("\"BATTERY ＀\"", [$1]);
		} else {
			$1 = "\"EXTERNAL POWER LOSS\"";
		}
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！'s screen flickers ＀ warning as it shuts down unexpectedly.</span>", [$0, $1]));
		if (truthy(rt.sv(f, "cpu"))) {
			yield* g.callName(f, rt.sv(f, "cpu"), "shutdown_computer", [0]);
		}
	}
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/power_change  (code/modules/modular_computers/computers/machinery/modular_computer.dm:120)  may sleep
rt.def("/obj/machinery/modular_computer/proc/power_change", function* power_change(f: Frame) {
	if ((truthy(rt.sv(f, "cpu")) && truthy((yield* g.callName(f, rt.sv(f, "cpu"), "use_power", []))))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/attackby  (code/modules/modular_computers/computers/machinery/modular_computer.dm:128)  may sleep
rt.def("/obj/machinery/modular_computer/proc/attackby", function* attackby(f: Frame) {
	if ((truthy(rt.sv(f, "cpu")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		return (yield* g.callName(f, rt.sv(f, "cpu"), "attackby", [live(f.args[0]), live(f.args[1])]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user"] });

// /obj/machinery/modular_computer/proc/ex_act  (code/modules/modular_computers/computers/machinery/modular_computer.dm:137)
rt.def("/obj/machinery/modular_computer/proc/ex_act", function ex_act(f: Frame) {
	if (truthy(rt.sv(f, "cpu"))) {
		rt.callName(f, rt.sv(f, "cpu"), "ex_act", [live(f.args[0])]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity"], waitfor: false });

// /obj/machinery/modular_computer/proc/emp_act  (code/modules/modular_computers/computers/machinery/modular_computer.dm:143)  may sleep
rt.def("/obj/machinery/modular_computer/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "emp_act", [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/modular_computer/proc/bullet_act  (code/modules/modular_computers/computers/machinery/modular_computer.dm:150)  may sleep
rt.def("/obj/machinery/modular_computer/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.vars = () => [Proj];
	if (!truthy(rt.sv(f, "cpu"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cpu"), "bullet_act", [live(Proj)]);
	return f.dot;
}, true);
