// From code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10598, "/obj/machinery/atmospherics/components/unary/thermomachine", "/obj/machinery/atmospherics/components/unary", {
	icon_state_on: "cold_on",
	icon_state_open: "cold_off",
	on: 0,
	min_temperature: 0,
	max_temperature: 0,
	target_temperature: 293.15,
	heat_capacity: 0,
	interactive: 1,
	anchored: 1,
	name: "thermomachine",
	desc: "Heats or cools gas in connected pipes.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "freezer",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	layer: 3,
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/<init>  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:12)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 80, "acid", 30]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:23)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "initialize_directions", rt.sv(f, "dir"));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/thermomachine"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6745, "/obj/item/weapon/circuitboard/machine/thermomachine", "/obj/item/weapon/circuitboard/machine", {
	name: "Thermomachine (Machine Board)",
	desc: "You can use a screwdriver to switch between heater and freezer.",
	origin_tech: "programming=3;plasmatech=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/thermomachine/proc/<init>  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:32)
rt.def("/obj/item/weapon/circuitboard/machine/thermomachine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/micro_laser"), 2, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/item/weapon/circuitboard/machine/thermomachine/proc/Initialize  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:39)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/thermomachine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.setSv(f, "name", "Freezer (Machine Board)");
		rt.setSv(f, "build_path", T("/obj/machinery/atmospherics/components/unary/thermomachine/freezer"));
	} else {
		rt.setSv(f, "name", "Heater (Machine Board)");
		rt.setSv(f, "build_path", T("/obj/machinery/atmospherics/components/unary/thermomachine/heater"));
	}
	return f.dot;
}, true);

// /obj/item/weapon/circuitboard/machine/thermomachine/proc/attackby  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:48)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/thermomachine/proc/attackby", function* attackby(f: Frame) {
	let freezer: Value = null, heater: Value = null, newtype: Value = null, new_setting: Value = null;
	f.vars = () => [freezer, heater, newtype, new_setting];
	freezer = T("/obj/item/weapon/circuitboard/machine/thermomachine/freezer");
	heater = T("/obj/item/weapon/circuitboard/machine/thermomachine/heater");
	newtype = null;
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		new_setting = "Heater";
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (isEqual(rt.sv(f, "build_path"), rt.initial(f, live(heater), "build_path"))) {
			newtype = live(freezer);
			new_setting = "Freezer";
		} else {
			newtype = live(heater);
		}
		rt.setSv(f, "name", rt.initial(f, live(newtype), "name"));
		rt.setSv(f, "build_path", rt.initial(f, live(newtype), "build_path"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You change the circuitboard setting to \"＀\".</span>", [live(new_setting)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/on_construction  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:67)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/on_construction", function* on_construction(f: Frame) {
	yield* g.callSuper(f, [rt.sv(f, "dir"), rt.sv(f, "dir")]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/RefreshParts  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:71)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [B, M, $e];
	B = null;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		B = rt.modify(live(B), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "heat_capacity", multiply(5000, rt.power(subtract(live(B), 1), 2)));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/update_icon  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:77)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_open"));
	} else {
		if ((truthy(rt.sv(f, "on")) && truthy(rt.callSrc(f, "is_operational", [])))) {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_state_on"));
		} else {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		}
	}
	return live(f.dot);
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:85)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "showpipe"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.sv(f, "icon"), "scrub_cap", rt.sv(f, "initialize_directions")])]);
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:90)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/process_atmos", function process_atmos(f: Frame) {
	let air_contents: Value = null, air_heat_capacity: Value = null, combined_heat_capacity: Value = null, old_temperature: Value = null, combined_energy: Value = null, temperature_delta: Value = null;
	f.vars = () => [air_contents, air_heat_capacity, combined_heat_capacity, old_temperature, combined_energy, temperature_delta];
	rt.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "on")) || !truthy(rt.index(rt.sv(f, "nodes"), 1)))) {
		return live(f.dot);
	}
	air_contents = rt.index(rt.sv(f, "airs"), 1);
	air_heat_capacity = rt.callName(f, live(air_contents), "heat_capacity", []);
	combined_heat_capacity = add(rt.sv(f, "heat_capacity"), live(air_heat_capacity));
	old_temperature = rt.fv(f, "temperature", live(air_contents));
	if (rt.gt(live(combined_heat_capacity), 0)) {
		combined_energy = add(multiply(rt.sv(f, "heat_capacity"), rt.sv(f, "target_temperature")), multiply(live(air_heat_capacity), rt.fv(f, "temperature", live(air_contents))));
		rt.setFv(f, "temperature", live(air_contents), divide(live(combined_energy), live(combined_heat_capacity)));
	}
	if (rt.gt((temperature_delta = rt.op(f, "Abs", [], [subtract(live(old_temperature), rt.fv(f, "temperature", live(air_contents)))])), 1)) {
		rt.setSv(f, "active_power_usage", add(divide(multiply(rt.sv(f, "heat_capacity"), live(temperature_delta)), 10), rt.sv(f, "idle_power_usage")));
		rt.callSrc(f, "update_parents", []);
	} else {
		rt.setSv(f, "active_power_usage", rt.sv(f, "idle_power_usage"));
	}
	return 1;
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/power_change  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:112)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/attackby  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:116)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/attackby", function* attackby(f: Frame) {
	if (!(truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "state_open")))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), rt.sv(f, "icon_state_open"), rt.initial(f, live(f.src), "icon_state"), live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/default_change_direction_wrench  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:128)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/default_change_direction_wrench", function* default_change_direction_wrench(f: Frame) {
	let node: Value = null;
	f.vars = () => [node];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	yield* g.srcCall(f, "SetInitDirections");
	if (truthy((node = rt.index(rt.sv(f, "nodes"), 1)))) {
		yield* g.callName(f, live(node), "disconnect", [live(f.src)]);
		rt.setAt(rt.sv(f, "nodes"), 1, null);
	}
	yield* g.srcCall(f, "nullifyPipenet", rt.index(rt.sv(f, "parents"), 1));
	yield* g.srcCall(f, "atmosinit");
	if (truthy((node = rt.index(rt.sv(f, "nodes"), 1)))) {
		yield* g.callName(f, live(node), "atmosinit", []);
		yield* g.callName(f, live(node), "addMember", [live(f.src)]);
	}
	yield* g.srcCall(f, "build_network");
	return 1;
}, true, { args: ["user", "W"] });

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_status  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:147)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_status", function ui_status(f: Frame) {
	if (truthy(rt.sv(f, "interactive"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return -1;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_interact  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:152)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "thermomachine", rt.sv(f, "name"), 400, 240, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_data  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:158)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, air1: Value = null;
	f.vars = () => [data, air1];
	rt.setAt((data = rt.list()), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "min", rt.sv(f, "min_temperature"));
	rt.setAt(live(data), "max", rt.sv(f, "max_temperature"));
	rt.setAt(live(data), "target", rt.sv(f, "target_temperature"));
	rt.setAt(live(data), "initial", rt.initial(f, live(f.src), "target_temperature"));
	air1 = rt.index(rt.sv(f, "airs"), 1);
	rt.setAt(live(data), "temperature", rt.fv(f, "temperature", live(air1)));
	rt.setAt(live(data), "pressure", rt.callName(f, live(air1), "return_pressure", []));
	return live(data);
});

// /obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_act  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:172)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/proc/ui_act", function* ui_act(f: Frame) {
	let target: Value = null, adjust: Value = null;
	let $0: any;
	f.vars = () => [target, adjust, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		if (truthy(rt.sv(f, "on"))) {
			$0 = 2;
		} else {
			$0 = 1;
		}
		rt.setSv(f, "use_power", $0);
		if (truthy(rt.sv(f, "on"))) {
			$0 = "on";
		} else {
			$0 = "off";
		}
		yield* g.srcCall(f, "investigate_log", fmt("was turned ＀ by ＀", [$0, (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		f.dot = 1;
	} else if ($0 === "target") {
		target = rt.at(live(f.args[1]), "target");
		adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]));
		if (isEqual(live(target), "input")) {
			if (((target = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "target_temperature"), rt.sv(f, "name"), fmt("Set new target (＀-＀ K):", [rt.sv(f, "min_temperature"), rt.sv(f, "max_temperature")]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				f.dot = 1;
			}
		} else {
			if (truthy(live(adjust))) {
				target = add(rt.sv(f, "target_temperature"), live(adjust));
				f.dot = 1;
			} else {
				if ((yield* g.call(f, P("/proc/text2num"), null, [live(target)])) !== null) {
					target = (yield* g.call(f, P("/proc/text2num"), null, [live(target)]));
					f.dot = 1;
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "target_temperature", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "min_temperature"), (yield* g.call(f, P("/proc/min"), null, [live(target), rt.sv(f, "max_temperature")]))])));
			yield* g.srcCall(f, "investigate_log", fmt("was set to ＀ K by ＀", [rt.sv(f, "target_temperature"), (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

rt.type(10599, "/obj/machinery/atmospherics/components/unary/thermomachine/freezer", "/obj/machinery/atmospherics/components/unary/thermomachine", {
	icon_state_on: "freezer_1",
	icon_state_open: "freezer-o",
	max_temperature: 293.15,
	min_temperature: 170,
	name: "freezer",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "freezer",
});

// /obj/machinery/atmospherics/components/unary/thermomachine/freezer/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:208)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/freezer/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/thermomachine/freezer"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/thermomachine/freezer/proc/RefreshParts  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:217)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/freezer/proc/RefreshParts", function RefreshParts(f: Frame) {
	let L: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L, M, $e];
	rt.callSuper(f, [], rt.Args.Same);
	L = null;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		L = rt.modify(live(L), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "min_temperature", rt.call(f, P("/proc/max"), null, [subtract(273.1499938964844, add(rt.initial(f, live(f.src), "min_temperature"), multiply(live(L), 15))), 2.700000047683716]));
	return f.dot;
});

rt.type(10600, "/obj/machinery/atmospherics/components/unary/thermomachine/heater", "/obj/machinery/atmospherics/components/unary/thermomachine", {
	icon_state_on: "heater_1",
	icon_state_open: "heater-o",
	max_temperature: 140,
	min_temperature: 293.15,
	name: "heater",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "heater",
});

// /obj/machinery/atmospherics/components/unary/thermomachine/heater/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:233)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/heater/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/thermomachine/heater"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/thermomachine/heater/proc/RefreshParts  (code/modules/atmospherics/machinery/components/unary_devices/thermomachine.dm:242)
rt.def("/obj/machinery/atmospherics/components/unary/thermomachine/heater/proc/RefreshParts", function RefreshParts(f: Frame) {
	let L: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L, M, $e];
	rt.callSuper(f, [], rt.Args.Same);
	L = null;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		L = rt.modify(live(L), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "max_temperature", add(293.1499938964844, multiply(rt.initial(f, live(f.src), "max_temperature"), live(L))));
	return f.dot;
});
