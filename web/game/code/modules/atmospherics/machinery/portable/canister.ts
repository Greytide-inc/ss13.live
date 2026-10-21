// From code/modules/atmospherics/machinery/portable/canister.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10689, "/obj/machinery/portable_atmospherics/canister", "/obj/machinery/portable_atmospherics", {
	valve_open: 0,
	pump: null,
	release_log: "",
	filled: 0.5,
	gas_type: "",
	release_pressure: 101.325,
	can_max_release_pressure: 1013.25,
	can_min_release_pressure: 10.1325,
	temperature_resistance: 1273.15,
	starter_temp: null,
	prototype: 0,
	valve_timer: null,
	timer_set: 30,
	default_timer_set: 30,
	minimum_timer_set: 1,
	maximum_timer_set: 300,
	timing: 0,
	restricted: 0,
	update: 0,
	pressure_resistance: 709.27496,
	name: "canister",
	desc: "A canister for the storage of gas.",
	icon_state: "yellow",
	density: 1,
	volume: 1000,
	armor: null,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 100,
	req_access: null,
}, { global: { label2types: 1055 } });

// /obj/machinery/portable_atmospherics/canister/proc/<init>  (code/modules/atmospherics/machinery/portable/canister.dm:20)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 80, "acid", 50]));
	$0 = $0;
	rt.setSv(f, "req_access", rt.list());
	return f.dot;
});

// /obj/machinery/portable_atmospherics/canister/proc/interact  (code/modules/atmospherics/machinery/portable/canister.dm:53)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/interact", function* interact(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Error - Unauthorized User</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/misc/compiler-failure.ogg"), 50, 1]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/portable_atmospherics/canister/proc/get_time_left  (code/modules/atmospherics/machinery/portable/canister.dm:121)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/get_time_left", function get_time_left(f: Frame) {
	if (truthy(rt.sv(f, "timing"))) {
		f.dot = rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "valve_timer"), rt.worldTime(f))]), 10), 1]);
	} else {
		f.dot = rt.sv(f, "timer_set");
	}
	return f.dot;
});

// /obj/machinery/portable_atmospherics/canister/proc/set_active  (code/modules/atmospherics/machinery/portable/canister.dm:126)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/set_active", function set_active(f: Frame) {
	rt.setSv(f, "timing", (!truthy(rt.sv(f, "timing")) ? 1 : 0));
	if (truthy(rt.sv(f, "timing"))) {
		rt.setSv(f, "valve_timer", add(rt.worldTime(f), multiply(rt.sv(f, "timer_set"), 10)));
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/portable_atmospherics/canister/proc/New  (code/modules/atmospherics/machinery/portable/canister.dm:160)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		yield* g.callName(f, rt.sv(f, "air_contents"), "copy_from", [live(f.args[1])]);
	} else {
		yield* g.srcCall(f, "create_gas");
	}
	rt.setSv(f, "pump", (yield* g.new_(f, T("/obj/machinery/atmospherics/components/binary/passive_gate"), [live(f.src), 0])));
	rt.setFv(f, "on", rt.sv(f, "pump"), 1);
	rt.setFv(f, "stat", rt.sv(f, "pump"), 0);
	yield* g.callName(f, rt.sv(f, "pump"), "build_network", []);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["loc", "existing_mixture"] });

// /obj/machinery/portable_atmospherics/canister/proc/Destroy  (code/modules/atmospherics/machinery/portable/canister.dm:173)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pump")]);
	rt.setSv(f, "pump", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/create_gas  (code/modules/atmospherics/machinery/portable/canister.dm:179)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/create_gas", function create_gas(f: Frame) {
	if (!truthy(rt.sv(f, "gas_type"))) return f.dot;
	rt.callName(f, rt.sv(f, "air_contents"), "add_gas", [rt.sv(f, "gas_type")]);
	if (truthy(rt.sv(f, "starter_temp"))) {
		rt.setFv(f, "temperature", rt.sv(f, "air_contents"), rt.sv(f, "starter_temp"));
	}
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), rt.sv(f, "gas_type")), 1, divide(multiply(multiply(rt.sv(f, "maximum_pressure"), rt.sv(f, "filled")), rt.fv(f, "volume", rt.sv(f, "air_contents"))), multiply(8.3100004196167, rt.fv(f, "temperature", rt.sv(f, "air_contents")))));
	if (!truthy(rt.sv(f, "starter_temp"))) return f.dot;
	rt.setFv(f, "temperature", rt.sv(f, "air_contents"), rt.sv(f, "starter_temp"));
	return f.dot;
});

rt.type(10697, "/obj/machinery/portable_atmospherics/canister/air", "/obj/machinery/portable_atmospherics/canister", {
	name: "air canister",
	desc: "Pre-mixed air.",
	icon_state: "grey",
});

// /obj/machinery/portable_atmospherics/canister/air/proc/create_gas  (code/modules/atmospherics/machinery/portable/canister.dm:186)
rt.def("/obj/machinery/portable_atmospherics/canister/air/proc/create_gas", function create_gas(f: Frame) {
	rt.callName(f, rt.sv(f, "air_contents"), "add_gases", ["o2", "n2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1, divide(multiply(multiply(multiply(0.20999999344348907, rt.sv(f, "maximum_pressure")), rt.sv(f, "filled")), rt.fv(f, "volume", rt.sv(f, "air_contents"))), multiply(8.3100004196167, rt.fv(f, "temperature", rt.sv(f, "air_contents")))));
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "n2"), 1, divide(multiply(multiply(multiply(0.7900000214576721, rt.sv(f, "maximum_pressure")), rt.sv(f, "filled")), rt.fv(f, "volume", rt.sv(f, "air_contents"))), multiply(8.3100004196167, rt.fv(f, "temperature", rt.sv(f, "air_contents")))));
	return f.dot;
});

// /obj/machinery/portable_atmospherics/canister/proc/update_icon  (code/modules/atmospherics/machinery/portable/canister.dm:197)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/update_icon", function update_icon(f: Frame) {
	let last_update: Value = null, pressure: Value = null;
	f.vars = () => [last_update, pressure];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.callSrc(f, "cut_overlays", []);
		rt.setSv(f, "icon_state", fmt("＀-1", [rt.initial(f, live(f.src), "icon_state")]));
		return live(f.dot);
	}
	last_update = rt.sv(f, "update");
	rt.setSv(f, "update", 0);
	if (truthy(rt.sv(f, "holding"))) {
		(rt.modSrcVar(f, "update", 1, rt.bitOr));
	}
	if (truthy(rt.sv(f, "connected_port"))) {
		(rt.modSrcVar(f, "update", 2, rt.bitOr));
	}
	if (rt.lt((pressure = rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", [])), 10)) {
		(rt.modSrcVar(f, "update", 4, rt.bitOr));
	} else {
		if (rt.lt(live(pressure), 101.32499694824219)) {
			(rt.modSrcVar(f, "update", 8, rt.bitOr));
		} else {
			if (rt.lt(live(pressure), 1519.875)) {
				(rt.modSrcVar(f, "update", 16, rt.bitOr));
			} else {
				(rt.modSrcVar(f, "update", 32, rt.bitOr));
			}
		}
	}
	if (isEqual(rt.sv(f, "update"), live(last_update))) {
		return live(f.dot);
	}
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "update"), 1))) {
		rt.callSrc(f, "add_overlay", ["can-open"]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "update"), 2))) {
		rt.callSrc(f, "add_overlay", ["can-connector"]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "update"), 4))) {
		rt.callSrc(f, "add_overlay", ["can-o0"]);
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "update"), 8))) {
			rt.callSrc(f, "add_overlay", ["can-o1"]);
		} else {
			if (truthy(rt.bitAnd(rt.sv(f, "update"), 16))) {
				rt.callSrc(f, "add_overlay", ["can-o2"]);
			} else {
				if (!truthy(rt.bitAnd(rt.sv(f, "update"), 32))) return f.dot;
				rt.callSrc(f, "add_overlay", ["can-o3"]);
			}
		}
	}
	return f.dot;
});

// /obj/machinery/portable_atmospherics/canister/proc/temperature_expose  (code/modules/atmospherics/machinery/portable/canister.dm:243)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), rt.sv(f, "temperature_resistance"))) return f.dot;
	yield* g.srcCall(f, "take_damage", 5, "fire", 0);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/deconstruct  (code/modules/atmospherics/machinery/portable/canister.dm:248)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			yield* g.srcCall(f, "canister_break");
		}
		if (truthy(live(disassembled))) {
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 10]);
		} else {
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/attackby  (code/modules/atmospherics/machinery/portable/canister.dm:258)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)))) {
		WT = live(f.args[0]);
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			if (!truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin cutting ＀ apart...</span>", [live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
				yield* g.srcCall(f, "deconstruct", 1);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cannot slice ＀ apart when it isn't broken.</span>", [live(f.src)])]);
		}
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/portable_atmospherics/canister/proc/obj_break  (code/modules/atmospherics/machinery/portable/canister.dm:274)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) || truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "canister_break");
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/canister_break  (code/modules/atmospherics/machinery/portable/canister.dm:279)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/canister_break", function* canister_break(f: Frame) {
	let expelled_gas: Value = null, _T: Value = null;
	f.vars = () => [expelled_gas, _T];
	yield* g.srcCall(f, "disconnect");
	expelled_gas = (yield* g.callName(f, rt.sv(f, "air_contents"), "remove", [(yield* g.callName(f, rt.sv(f, "air_contents"), "total_moles", []))]));
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "assume_air", [live(expelled_gas)]);
	yield* g.srcCall(f, "air_update_turf");
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.setSv(f, "density", 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray.ogg"), 10, 1, -3]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "investigate_log", "was destroyed.", "atmos");
	if (!truthy(rt.sv(f, "holding"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "holding"), "forceMove", [live(_T)]);
	rt.setSv(f, "holding", null);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/process_atmos  (code/modules/atmospherics/machinery/portable/canister.dm:296)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, $0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return 26;
	}
	if ((truthy(rt.sv(f, "timing")) && rt.lt(rt.sv(f, "valve_timer"), rt.worldTime(f)))) {
		rt.setSv(f, "valve_open", (!truthy(rt.sv(f, "valve_open")) ? 1 : 0));
		rt.setSv(f, "timing", 0);
	}
	if (!truthy(rt.sv(f, "valve_open"))) {
		rt.setAt(rt.fv(f, "airs", rt.sv(f, "pump")), 1, null);
		rt.setAt(rt.fv(f, "airs", rt.sv(f, "pump")), 2, null);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	rt.setAt(rt.fv(f, "airs", rt.sv(f, "pump")), 1, rt.sv(f, "air_contents"));
	$0 = rt.fv(f, "airs", rt.sv(f, "pump"));
	$1 = 2;
	if (truthy(rt.sv(f, "holding"))) {
		$2 = rt.fv(f, "air_contents", rt.sv(f, "holding"));
	} else {
		$2 = (yield* g.callName(f, live(_T), "return_air", []));
	}
	rt.setAt($0, $1, $2);
	rt.setFv(f, "target_pressure", rt.sv(f, "pump"), rt.sv(f, "release_pressure"));
	yield* g.callName(f, rt.sv(f, "pump"), "process_atmos", []);
	if (!truthy(rt.sv(f, "holding"))) {
		yield* g.srcCall(f, "air_update_turf");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/ui_interact  (code/modules/atmospherics/machinery/portable/canister.dm:319)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "canister", rt.sv(f, "name"), 420, 405, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/portable_atmospherics/canister/proc/ui_data  (code/modules/atmospherics/machinery/portable/canister.dm:325)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	$0 = (data = rt.list());
	$1 = "portConnected";
	if (truthy(rt.sv(f, "connected_port"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "tankPressure";
	if (truthy(rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", []))) {
		$2 = rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", []);
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [$2]));
	$0 = live(data);
	$1 = "releasePressure";
	if (truthy(rt.sv(f, "release_pressure"))) {
		$2 = rt.sv(f, "release_pressure");
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [$2]));
	rt.setAt(live(data), "defaultReleasePressure", rt.call(f, P("/proc/round"), null, [101.32499694824219]));
	rt.setAt(live(data), "minReleasePressure", rt.call(f, P("/proc/round"), null, [rt.sv(f, "can_min_release_pressure")]));
	rt.setAt(live(data), "maxReleasePressure", rt.call(f, P("/proc/round"), null, [rt.sv(f, "can_max_release_pressure")]));
	$0 = live(data);
	$1 = "valveOpen";
	if (truthy(rt.sv(f, "valve_open"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "isPrototype";
	if (truthy(rt.sv(f, "prototype"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	if (truthy(rt.sv(f, "prototype"))) {
		rt.setAt(live(data), "restricted", rt.sv(f, "restricted"));
		rt.setAt(live(data), "timing", rt.sv(f, "timing"));
		rt.setAt(live(data), "time_left", rt.callSrc(f, "get_time_left", []));
		rt.setAt(live(data), "timer_set", rt.sv(f, "timer_set"));
		rt.setAt(live(data), "timer_is_not_default", (!isEqual(rt.sv(f, "timer_set"), rt.sv(f, "default_timer_set")) ? 1 : 0));
		rt.setAt(live(data), "timer_is_not_min", (!isEqual(rt.sv(f, "timer_set"), rt.sv(f, "minimum_timer_set")) ? 1 : 0));
		rt.setAt(live(data), "timer_is_not_max", (!isEqual(rt.sv(f, "timer_set"), rt.sv(f, "maximum_timer_set")) ? 1 : 0));
	}
	$0 = live(data);
	$1 = "hasHoldingTank";
	if (truthy(rt.sv(f, "holding"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	if (truthy(rt.sv(f, "holding"))) {
		rt.setAt(live(data), "holdingTank", rt.list());
		rt.setAt(rt.at(live(data), "holdingTank"), "name", rt.fv(f, "name", rt.sv(f, "holding")));
		rt.setAt(rt.at(live(data), "holdingTank"), "tankPressure", rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.fv(f, "air_contents", rt.sv(f, "holding")), "return_pressure", [])]));
	}
	return live(data);
});

// /obj/machinery/portable_atmospherics/canister/proc/ui_act  (code/modules/atmospherics/machinery/portable/canister.dm:352)  may sleep
rt.def("/obj/machinery/portable_atmospherics/canister/proc/ui_act", function* ui_act(f: Frame) {
	let label: Value = null, newtype: Value = null, replacement: Value = null, pressure: Value = null, logmsg: Value = null, danger: Value = null, id: Value = null, gas: Value = null, name: Value = null, msg: Value = null, change: Value = null, user_input: Value = null, N: Value = null;
	let $0: any, $e: any;
	f.vars = () => [label, newtype, replacement, pressure, logmsg, danger, id, gas, name, msg, change, user_input, N, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "relabel") {
		if ((truthy((label = (yield* g.op(f, "Prompt", [1], [null, null, rt.sv(f, "name"), "New canister label:", rt.gl("label2types")])))) && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
			if (truthy((newtype = rt.index(rt.gl("label2types"), live(label))))) {
				rt.setSv(f, "name", rt.initial(f, (replacement = live(newtype)), "name"));
				rt.setSv(f, "desc", rt.initial(f, live(replacement), "name"));
				rt.setSv(f, "icon_state", rt.initial(f, live(replacement), "icon_state"));
			}
		}
	} else if ($0 === "restricted") {
		rt.setSv(f, "restricted", (!truthy(rt.sv(f, "restricted")) ? 1 : 0));
		if (truthy(rt.sv(f, "restricted"))) {
			rt.setSv(f, "req_access", rt.list(10));
		} else {
			rt.setSv(f, "req_access", rt.list());
			f.dot = 1;
		}
	} else if ($0 === "pressure") {
		if (isEqual((pressure = rt.at(live(f.args[1]), "pressure")), "reset")) {
			pressure = 101.32499694824219;
			f.dot = 1;
		} else {
			if (isEqual(live(pressure), "min")) {
				pressure = rt.sv(f, "can_min_release_pressure");
				f.dot = 1;
			} else {
				if (isEqual(live(pressure), "max")) {
					pressure = rt.sv(f, "can_max_release_pressure");
					f.dot = 1;
				} else {
					if (isEqual(live(pressure), "input")) {
						if (((pressure = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "release_pressure"), rt.sv(f, "name"), fmt("New release pressure (＀-＀ kPa):", [rt.sv(f, "can_min_release_pressure"), rt.sv(f, "can_max_release_pressure")]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
							f.dot = 1;
						}
					} else {
						if ((yield* g.call(f, P("/proc/text2num"), null, [live(pressure)])) !== null) {
							pressure = (yield* g.call(f, P("/proc/text2num"), null, [live(pressure)]));
							f.dot = 1;
						}
					}
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "release_pressure", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "can_min_release_pressure"), (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [live(pressure)])), rt.sv(f, "can_max_release_pressure")]))])));
			yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ kPa by ＀.", [rt.sv(f, "release_pressure"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		}
	} else if ($0 === "valve") {
		logmsg = null;
		rt.setSv(f, "valve_open", (!truthy(rt.sv(f, "valve_open")) ? 1 : 0));
		if (truthy(rt.sv(f, "valve_open"))) {
			logmsg = fmt("Valve was <b>opened</b> by ＀, starting a transfer into ％！.<br>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (rt.sv(f, "holding") || "air")]);
			if (!truthy(rt.sv(f, "holding"))) {
				danger = rt.list();
				id = null;
				rt.forList(f, 0, rt.fv(f, "gases", rt.sv(f, "air_contents")));
				while (($e = rt.next(f, 0)) !== undefined) {
					id = $e;
					if (!truthy(rt.index(rt.index((gas = rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), live(id))), 3), 5))) {
						continue;
					}
					if (rt.gt(rt.index(live(gas), 1), (rt.index(rt.index(live(gas), 3), 3) || 0.5))) {
						rt.setAt(live(danger), rt.index(rt.index(live(gas), 3), 2), rt.index(live(gas), 1));
					}
				}
				rt.endFor(f, 0);
				if (truthy(rt.len(f, live(danger)))) {
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ opened a canister that contains the following: ＀", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ opened a canister that contains the following at ＀:", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
					name = null;
					rt.forList(f, 0, live(danger));
					while (($e = rt.next(f, 0)) !== undefined) {
						name = $e;
						yield* g.call(f, P("/proc/log_admin"), null, [(msg = fmt("＀: ＀ moles.", [live(name), rt.index(live(danger), live(name))]))]);
						yield* g.call(f, P("/proc/message_admins"), null, [live(msg)]);
					}
					rt.endFor(f, 0);
				}
			}
		} else {
			logmsg = fmt("Valve was <b>closed</b> by ＀, stopping the transfer into ％！.<br>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (rt.sv(f, "holding") || "air")]);
		}
		yield* g.srcCall(f, "investigate_log", live(logmsg), "atmos");
		rt.modSrcVar(f, "release_log", live(logmsg), add);
		f.dot = 1;
	} else if ($0 === "timer") {
		$0 = (change = rt.at(live(f.args[1]), "change"));
		if ($0 === "reset") {
			rt.setSv(f, "timer_set", rt.sv(f, "default_timer_set"));
		} else if ($0 === "decrease") {
			rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_timer_set"), subtract(rt.sv(f, "timer_set"), 10)])));
		} else if ($0 === "increase") {
			rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "maximum_timer_set"), add(rt.sv(f, "timer_set"), 10)])));
		} else if ($0 === "input") {
			if (!truthy((user_input = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "name"), "Set time to valve toggle.", live(f.usr), null]))))) {
				return live(f.dot);
			}
			if (!truthy((N = (yield* g.call(f, P("/proc/text2num"), null, [live(user_input)]))))) {
				return live(f.dot);
			}
			rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_timer_set"), (yield* g.call(f, P("/proc/min"), null, [live(N), rt.sv(f, "maximum_timer_set")]))])));
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has activated a prototype valve timer", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
			f.dot = 1;
		} else if ($0 === "toggle_timer") {
			yield* g.srcCall(f, "set_active");
		}
	} else if ($0 === "eject") {
		if (truthy(rt.sv(f, "holding"))) {
			if (truthy(rt.sv(f, "valve_open"))) {
				yield* g.srcCall(f, "investigate_log", fmt("＀ removed the ＀, leaving the valve open and transfering into the <span class='boldannounce'>air</span><br>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "holding")]), "atmos");
			}
			yield* g.callName(f, rt.sv(f, "holding"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			rt.setSv(f, "holding", null);
			f.dot = 1;
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });
