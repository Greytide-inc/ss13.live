// From code/modules/atmospherics/machinery/other/miner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10611, "/obj/machinery/atmospherics/miner", "/obj/machinery/atmospherics", {
	spawn_id: null,
	spawn_temp: 293.15,
	spawn_mol: 1039.8379,
	max_ext_mol: 1e+31,
	max_ext_kpa: 6500,
	overlay_color: "#FFFFFF",
	active: 1,
	power_draw: 0,
	power_draw_static: 2000,
	power_draw_dynamic_mol_coeff: 5,
	power_draw_dynamic_kpa_coeff: 0.5,
	broken: 0,
	broken_message: "ERROR",
	anchored: 1,
	name: "gas miner",
	desc: "Gasses mined from the gas giant below (above?) flow out through this massive vent.",
	icon: rt.rsc("icons/obj/atmospherics/components/miners.dmi"),
	icon_state: "miner",
	density: 0,
	resistance_flags: 98,
	idle_power_usage: 150,
	active_power_usage: 2000,
});

// /obj/machinery/atmospherics/miner/proc/Initialize  (code/modules/atmospherics/machinery/other/miner.dm:33)  may sleep
rt.def("/obj/machinery/atmospherics/miner/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "set_active", rt.sv(f, "active"));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/miner/proc/examine  (code/modules/atmospherics/machinery/other/miner.dm:37)
rt.def("/obj/machinery/atmospherics/miner/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "broken"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Its debug output is printing \"＀\"", [rt.sv(f, "broken_message")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/miner/proc/check_operation  (code/modules/atmospherics/machinery/other/miner.dm:42)
rt.def("/obj/machinery/atmospherics/miner/proc/check_operation", function check_operation(f: Frame) {
	let _T: Value = null, OT: Value = null, G: Value = null;
	f.vars = () => [_T, OT, G];
	if (!truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if (!truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0))) {
		rt.setSv(f, "broken_message", "<span class='boldnotice'>VENT BLOCKED</span>");
		rt.callSrc(f, "set_broken", [1]);
		return 0;
	}
	if (truthy(rt.gv(f, "planetary_atmos", (OT = live(_T))))) {
		rt.setSv(f, "broken_message", "<span class='boldwarning'>DEVICE NOT ENCLOSED IN A PRESSURIZED ENVIRONMENT</span>");
		rt.callSrc(f, "set_broken", [1]);
		return 0;
	}
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) {
		rt.setSv(f, "broken_message", "<span class='boldnotice'>AIR VENTING TO SPACE</span>");
		rt.callSrc(f, "set_broken", [1]);
		return 0;
	}
	if (rt.gt(rt.callName(f, (G = rt.callName(f, live(OT), "return_air", [])), "return_pressure", []), subtract(rt.sv(f, "max_ext_kpa"), divide(multiply(multiply(rt.sv(f, "spawn_mol"), rt.sv(f, "spawn_temp")), 8.3100004196167), 2500)))) {
		rt.setSv(f, "broken_message", "<span class='boldwarning'>EXTERNAL PRESSURE OVER THRESHOLD</span>");
		rt.callSrc(f, "set_broken", [1]);
		return 0;
	}
	if (rt.gt(rt.callName(f, live(G), "total_moles", []), rt.sv(f, "max_ext_mol"))) {
		rt.setSv(f, "broken_message", "<span class='boldwarning'>EXTERNAL AIR CONCENTRATION OVER THRESHOLD</span>");
		rt.callSrc(f, "set_broken", [1]);
		return 0;
	}
	if (truthy(rt.sv(f, "broken"))) {
		rt.callSrc(f, "set_broken", [0]);
		rt.setSv(f, "broken_message", "");
	}
	return 1;
});

// /obj/machinery/atmospherics/miner/proc/set_active  (code/modules/atmospherics/machinery/other/miner.dm:73)
rt.def("/obj/machinery/atmospherics/miner/proc/set_active", function set_active(f: Frame, setting: Value) {
	if (isEqual(rt.sv(f, "active"), live(setting))) return f.dot;
	rt.setSv(f, "active", live(setting));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/miner/proc/set_broken  (code/modules/atmospherics/machinery/other/miner.dm:78)
rt.def("/obj/machinery/atmospherics/miner/proc/set_broken", function set_broken(f: Frame, setting: Value) {
	if (isEqual(rt.sv(f, "broken"), live(setting))) return f.dot;
	rt.setSv(f, "broken", live(setting));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/miner/proc/update_power  (code/modules/atmospherics/machinery/other/miner.dm:83)
rt.def("/obj/machinery/atmospherics/miner/proc/update_power", function update_power(f: Frame) {
	let _T: Value = null, G: Value = null, _P: Value = null;
	let $0: any;
	f.vars = () => [_T, G, _P, $0];
	if (!truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "active_power_usage", rt.sv(f, "idle_power_usage"));
	}
	_T = rt.getStep(f, live(f.src), 0);
	G = rt.callName(f, live(_T), "return_air", []);
	_P = rt.callName(f, live(G), "return_pressure", []);
	$0 = rt.sv(f, "power_draw");
	if ($0 === 0) {
		rt.setSv(f, "active_power_usage", 0);
	} else if ($0 === 1) {
		rt.setSv(f, "active_power_usage", rt.sv(f, "power_draw_static"));
	} else if ($0 === 2) {
		rt.setSv(f, "active_power_usage", multiply(rt.sv(f, "spawn_mol"), rt.sv(f, "power_draw_dynamic_mol_coeff")));
	} else if ($0 === 3) {
		rt.setSv(f, "active_power_usage", multiply(live(_P), rt.sv(f, "power_draw_dynamic_kpa_coeff")));
	} else if ($0 === 4) {
		rt.setSv(f, "active_power_usage", add(multiply(rt.sv(f, "spawn_mol"), rt.sv(f, "power_draw_dynamic_mol_coeff")), multiply(live(_P), rt.sv(f, "power_draw_dynamic_kpa_coeff"))));
	}
	return f.dot;
});

// /obj/machinery/atmospherics/miner/proc/do_use_power  (code/modules/atmospherics/machinery/other/miner.dm:101)
rt.def("/obj/machinery/atmospherics/miner/proc/do_use_power", function do_use_power(f: Frame, amount: Value) {
	let _T: Value = null, C: Value = null;
	f.vars = () => [_T, C];
	if ((truthy((_T = rt.getStep(f, live(f.src), 0))) && truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0)))) {
		if (((truthy((C = rt.callName(f, live(_T), "get_cable_node", []))) && truthy(rt.fv(f, "powernet", live(C)))) && rt.gt(rt.gv(f, "avail", rt.fv(f, "powernet", live(C))), live(amount)))) {
			rt.modField(f, rt.fv(f, "powernet", live(C)), "load", live(amount), add);
			return 1;
		}
	}
	if (truthy(rt.callSrc(f, "powered", []))) {
		rt.callSrc(f, "use_power", [live(amount)]);
		return 1;
	}
	return 0;
});

// /obj/machinery/atmospherics/miner/proc/update_icon  (code/modules/atmospherics/machinery/other/miner.dm:113)
rt.def("/obj/machinery/atmospherics/miner/proc/update_icon", function update_icon(f: Frame) {
	let on_overlay: Value = null;
	f.vars = () => [on_overlay];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "broken"))) {
		rt.callSrc(f, "add_overlay", ["broken"]);
	} else {
		if (!truthy(rt.sv(f, "active"))) return f.dot;
		rt.setFv(f, "color", (on_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "on"])), rt.sv(f, "overlay_color"));
		rt.callSrc(f, "add_overlay", [live(on_overlay)]);
	}
	return f.dot;
});

// /obj/machinery/atmospherics/miner/proc/process  (code/modules/atmospherics/machinery/other/miner.dm:122)
rt.def("/obj/machinery/atmospherics/miner/proc/process", function process(f: Frame) {
	rt.callSrc(f, "update_power", []);
	rt.callSrc(f, "check_operation", []);
	if (!(truthy(rt.sv(f, "active")) && !truthy(rt.sv(f, "broken")))) return f.dot;
	if (rt.sv(f, "spawn_id") === null) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "do_use_power", [rt.sv(f, "active_power_usage")]))) return f.dot;
	rt.callSrc(f, "mine_gas", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/atmospherics/miner/proc/mine_gas  (code/modules/atmospherics/machinery/other/miner.dm:131)
rt.def("/obj/machinery/atmospherics/miner/proc/mine_gas", function mine_gas(f: Frame) {
	let O: Value = null, merger: Value = null;
	f.vars = () => [O, merger];
	if (!truthy((rt.istype((O = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0))) {
		return 0;
	}
	rt.callName(f, (merger = rt.new_(f, T("/datum/gas_mixture"), [])), "assert_gas", [rt.sv(f, "spawn_id")]);
	rt.setAt(rt.index(rt.fv(f, "gases", live(merger)), rt.sv(f, "spawn_id")), 1, rt.sv(f, "spawn_mol"));
	rt.setFv(f, "temperature", live(merger), rt.sv(f, "spawn_temp"));
	rt.callName(f, live(O), "assume_air", [live(merger)]);
	rt.callName(f, rt.gl("SSair"), "add_to_active", [live(O)]);
	return f.dot;
});

// /obj/machinery/atmospherics/miner/proc/attack_ai  (code/modules/atmospherics/machinery/other/miner.dm:143)  may sleep
rt.def("/obj/machinery/atmospherics/miner/proc/attack_ai", function* attack_ai(f: Frame) {
	if (truthy(rt.sv(f, "broken"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ seems to be broken. Its debug interface outputs: ＀", [live(f.src), rt.sv(f, "broken_message")])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
