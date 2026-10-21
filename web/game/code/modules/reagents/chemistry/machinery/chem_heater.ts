// From code/modules/reagents/chemistry/machinery/chem_heater.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10978, "/obj/machinery/chem_heater", "/obj/machinery", {
	beaker: null,
	target_temperature: 300,
	heater_coefficient: 0.1,
	on: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 40,
	name: "chemical heater",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "mixer0b",
	resistance_flags: 34,
});

// /obj/machinery/chem_heater/proc/Initialize  (code/modules/reagents/chemistry/machinery/chem_heater.dm:16)  may sleep
rt.def("/obj/machinery/chem_heater/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/chem_heater"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6776, "/obj/item/weapon/circuitboard/machine/chem_heater", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Chemical Heater (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_heater"),
	origin_tech: "programming=2;engineering=2;biotech=2",
});

// /obj/item/weapon/circuitboard/machine/chem_heater/proc/<init>  (code/modules/reagents/chemistry/machinery/chem_heater.dm:24)
rt.def("/obj/item/weapon/circuitboard/machine/chem_heater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/chem_heater/proc/RefreshParts  (code/modules/reagents/chemistry/machinery/chem_heater.dm:30)
rt.def("/obj/machinery/chem_heater/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	rt.setSv(f, "heater_coefficient", 0.10000000149011612);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(rt.modSrcVar(f, "heater_coefficient", rt.fv(f, "rating", live(M)), multiply));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/chem_heater/proc/process  (code/modules/reagents/chemistry/machinery/chem_heater.dm:34)  may sleep
rt.def("/obj/machinery/chem_heater/proc/process", function* process(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	if (rt.gt(rt.gv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.sv(f, "target_temperature"))) {
		rt.modField(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "chem_temp", (yield* g.call(f, P("/proc/min"), null, [-1, multiply(subtract(rt.sv(f, "target_temperature"), rt.gv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker")))), rt.sv(f, "heater_coefficient"))])), add);
	}
	if (rt.lt(rt.gv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.sv(f, "target_temperature"))) {
		rt.modField(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "chem_temp", (yield* g.call(f, P("/proc/max"), null, [1, multiply(subtract(rt.sv(f, "target_temperature"), rt.gv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker")))), rt.sv(f, "heater_coefficient"))])), add);
	}
	rt.setFv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker")), (yield* g.call(f, P("/proc/round"), null, [rt.gv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker")))])));
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "handle_reactions", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/chem_heater/proc/attackby  (code/modules/reagents/chemistry/machinery/chem_heater.dm:48)  may sleep
rt.def("/obj/machinery/chem_heater/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "mixer0b", "mixer0b", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "container_type", live(f.args[0])), 4096)))) {
		f.dot = 1;
		if (truthy(rt.sv(f, "beaker"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A beaker is already loaded into the machine!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setSv(f, "beaker", live(f.args[0]));
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the beaker to the machine.</span>"]);
		rt.setSv(f, "icon_state", "mixer1b");
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/chem_heater/proc/on_deconstruction  (code/modules/reagents/chemistry/machinery/chem_heater.dm:73)  may sleep
rt.def("/obj/machinery/chem_heater/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.srcCall(f, "eject_beaker");
	return f.dot;
}, true);

// /obj/machinery/chem_heater/proc/ui_interact  (code/modules/reagents/chemistry/machinery/chem_heater.dm:77)  may sleep
rt.def("/obj/machinery/chem_heater/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "chem_heater", rt.sv(f, "name"), 275, 400, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/chem_heater/proc/ui_data  (code/modules/reagents/chemistry/machinery/chem_heater.dm:83)
rt.def("/obj/machinery/chem_heater/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, beakerContents: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, beakerContents, R, $0, $1, $2, $e];
	rt.setAt((data = rt.list()), "targetTemp", rt.sv(f, "target_temperature"));
	rt.setAt(live(data), "isActive", rt.sv(f, "on"));
	$0 = live(data);
	$1 = "isBeakerLoaded";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "currentTemp";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = rt.gv(f, "chem_temp", rt.fv(f, "reagents", rt.sv(f, "beaker")));
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "beakerCurrentVolume";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker")));
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "beakerMaxVolume";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = rt.fv(f, "volume", rt.sv(f, "beaker"));
	} else {
		$2 = null;
	}
	rt.setAt($0, $1, $2);
	beakerContents = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (truthy(rt.sv(f, "beaker"))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			rt.callName(f, live(beakerContents), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(R)), "volume", rt.fv(f, "volume", live(R))]))]);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "beakerContents", live(beakerContents));
	return live(data);
});

// /obj/machinery/chem_heater/proc/ui_act  (code/modules/reagents/chemistry/machinery/chem_heater.dm:100)  may sleep
rt.def("/obj/machinery/chem_heater/proc/ui_act", function* ui_act(f: Frame) {
	let target: Value = null, adjust: Value = null;
	let $0: any;
	f.vars = () => [target, adjust, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "temperature") {
		target = rt.at(live(f.args[1]), "target");
		adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]));
		if (isEqual(live(target), "input")) {
			if (((target = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "target_temperature"), rt.sv(f, "name"), "New target temperature:", null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				f.dot = 1;
			}
		} else {
			if (truthy(live(adjust))) {
				target = add(rt.sv(f, "target_temperature"), live(adjust));
			} else {
				if ((yield* g.call(f, P("/proc/text2num"), null, [live(target)])) !== null) {
					target = (yield* g.call(f, P("/proc/text2num"), null, [live(target)]));
					f.dot = 1;
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "target_temperature", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(target), 1000]))])));
		}
	} else if ($0 === "eject") {
		rt.setSv(f, "on", 0);
		yield* g.srcCall(f, "eject_beaker");
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/chem_heater/proc/eject_beaker  (code/modules/reagents/chemistry/machinery/chem_heater.dm:127)  may sleep
rt.def("/obj/machinery/chem_heater/proc/eject_beaker", function* eject_beaker(f: Frame) {
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.getStep(f, live(f.src), 0));
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "handle_reactions", []);
	rt.setSv(f, "beaker", null);
	rt.setSv(f, "icon_state", "mixer0b");
	return f.dot;
}, true);
