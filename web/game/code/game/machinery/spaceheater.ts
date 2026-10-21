// From code/game/machinery/spaceheater.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10828, "/obj/machinery/space_heater", "/obj/machinery", {
	cell: null,
	on: 0,
	mode: "standby",
	setMode: "auto",
	targetTemperature: 293.15,
	heatingPower: 40000,
	efficiency: 20000,
	temperatureTolerance: 1,
	settableTemperatureMedian: 303.15,
	settableTemperatureRange: 30,
	anchored: 0,
	interact_open: 1,
	density: 1,
	icon: rt.rsc("icons/obj/atmos.dmi"),
	icon_state: "sheater-off",
	name: "space heater",
	desc: "Made by Space Amish using traditional space techniques, this heater/cooler is guaranteed not to set the station on fire.",
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
});

// /obj/machinery/space_heater/proc/<init>  (code/game/machinery/spaceheater.dm:15)
rt.def("/obj/machinery/space_heater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 100, "fire", 80, "acid", 10]));
	return f.dot;
});

// /obj/machinery/space_heater/proc/New  (code/game/machinery/spaceheater.dm:31)  may sleep
rt.def("/obj/machinery/space_heater/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/space_heater"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(6730, "/obj/item/weapon/circuitboard/machine/space_heater", "/obj/item/weapon/circuitboard/machine", {
	name: "Space Heater (Machine Board)",
	build_path: rt.typePath("/obj/machinery/space_heater"),
	origin_tech: "programming=2;engineering=2;plasmatech=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/space_heater/proc/<init>  (code/game/machinery/spaceheater.dm:41)
rt.def("/obj/item/weapon/circuitboard/machine/space_heater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/stack/cable_coil"), 3]));
	return f.dot;
});

// /obj/machinery/space_heater/proc/on_construction  (code/game/machinery/spaceheater.dm:47)  may sleep
rt.def("/obj/machinery/space_heater/proc/on_construction", function* on_construction(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cell")]);
	rt.setSv(f, "cell", null);
	rt.setSv(f, "panel_open", 1);
	yield* g.srcCall(f, "update_icon");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/space_heater/proc/on_deconstruction  (code/game/machinery/spaceheater.dm:55)
rt.def("/obj/machinery/space_heater/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	if (truthy(rt.sv(f, "cell"))) {
		rt.modSrcVar(f, "component_parts", rt.sv(f, "cell"), add);
		rt.setSv(f, "cell", null);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/machinery/space_heater/proc/examine  (code/game/machinery/spaceheater.dm:60)
rt.def("/obj/machinery/space_heater/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = $1;
		$2 = "on";
	} else {
		$2 = "off";
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		$3 = "open";
	} else {
		$3 = "closed";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＄！ is ＀, and the hatch is ＀.", [$1, $2, $3])]);
	if (truthy(rt.sv(f, "cell"))) {
		$0 = live(f.args[0]);
		if (truthy(rt.sv(f, "cell"))) {
			$1 = rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.sv(f, "cell"), "percent", []), 1]);
		} else {
			$1 = 0;
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The charge meter reads ＀%.", [$1])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There is no power cell installed."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/space_heater/proc/update_icon  (code/game/machinery/spaceheater.dm:69)
rt.def("/obj/machinery/space_heater/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", fmt("sheater-＀", [rt.sv(f, "mode")]));
	} else {
		rt.setSv(f, "icon_state", "sheater-off");
	}
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "panel_open"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["sheater-open"]);
	return f.dot;
});

// /obj/machinery/space_heater/proc/process  (code/game/machinery/spaceheater.dm:78)  may sleep
rt.def("/obj/machinery/space_heater/proc/process", function* process(f: Frame) {
	let L: Value = null, env: Value = null, newMode: Value = null, heat_capacity: Value = null, requiredPower: Value = null, deltaTemperature: Value = null;
	f.vars = () => [L, env, newMode, heat_capacity, requiredPower, deltaTemperature];
	if ((!truthy(rt.sv(f, "on")) || !truthy((yield* g.srcCall(f, "is_operational"))))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "cell")) && rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), 0))) {
		if (!truthy((rt.istype((L = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) {
			if (!isEqual(rt.sv(f, "mode"), "standby")) {
				rt.setSv(f, "mode", "standby");
				yield* g.srcCall(f, "update_icon");
			}
			return live(f.dot);
		}
		env = (yield* g.callName(f, live(L), "return_air", []));
		newMode = "standby";
		if ((!isEqual(rt.sv(f, "setMode"), "cool") && rt.lt(rt.fv(f, "temperature", live(env)), subtract(rt.sv(f, "targetTemperature"), rt.sv(f, "temperatureTolerance"))))) {
			newMode = "heat";
		} else {
			if ((!isEqual(rt.sv(f, "setMode"), "heat") && rt.gt(rt.fv(f, "temperature", live(env)), add(rt.sv(f, "targetTemperature"), rt.sv(f, "temperatureTolerance"))))) {
				newMode = "cool";
			}
		}
		if (!isEqual(rt.sv(f, "mode"), live(newMode))) {
			rt.setSv(f, "mode", live(newMode));
			yield* g.srcCall(f, "update_icon");
		}
		if (isEqual(rt.sv(f, "mode"), "standby")) {
			return live(f.dot);
		}
		heat_capacity = (yield* g.callName(f, live(env), "heat_capacity", []));
		if (rt.lt((requiredPower = (yield* g.call(f, P("/proc/min"), null, [(requiredPower = multiply(rt.op(f, "Abs", [], [subtract(rt.fv(f, "temperature", live(env)), rt.sv(f, "targetTemperature"))]), live(heat_capacity))), rt.sv(f, "heatingPower")]))), 1)) {
			return live(f.dot);
		}
		deltaTemperature = divide(live(requiredPower), live(heat_capacity));
		if (isEqual(rt.sv(f, "mode"), "cool")) {
			(deltaTemperature = rt.modify(live(deltaTemperature), -1, multiply));
		}
		if (truthy(live(deltaTemperature))) {
			rt.modField(f, live(env), "temperature", live(deltaTemperature), add);
			yield* g.srcCall(f, "air_update_turf");
		}
		yield* g.callName(f, rt.sv(f, "cell"), "use", [divide(live(requiredPower), rt.sv(f, "efficiency"))]);
	} else {
		rt.setSv(f, "on", 0);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/space_heater/proc/RefreshParts  (code/game/machinery/spaceheater.dm:125)
rt.def("/obj/machinery/space_heater/proc/RefreshParts", function RefreshParts(f: Frame) {
	let laser: Value = null, cap: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [laser, cap, M, $e];
	laser = 0;
	cap = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		laser = rt.modify(live(laser), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		cap = rt.modify(live(cap), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "heatingPower", multiply(live(laser), 40000));
	rt.setSv(f, "settableTemperatureRange", multiply(live(cap), 30));
	rt.setSv(f, "efficiency", multiply(add(live(cap), 1), 10000));
	rt.setSv(f, "targetTemperature", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "settableTemperatureMedian"), rt.sv(f, "settableTemperatureRange")), 2.700000047683716]), rt.call(f, P("/proc/min"), null, [rt.sv(f, "targetTemperature"), add(rt.sv(f, "settableTemperatureMedian"), rt.sv(f, "settableTemperatureRange"))])]));
	return f.dot;
});

// /obj/machinery/space_heater/proc/emp_act  (code/game/machinery/spaceheater.dm:140)  may sleep
rt.def("/obj/machinery/space_heater/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.callSuper(f, [live(severity)]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.callName(f, rt.sv(f, "cell"), "emp_act", [live(severity)]);
	}
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/space_heater/proc/attackby  (code/game/machinery/spaceheater.dm:148)  may sleep
rt.def("/obj/machinery/space_heater/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [C, $0, $1, $2];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy(rt.sv(f, "cell"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a power cell inside!</span>"]);
				return live(f.dot);
			} else {
				if (truthy((rt.istype((C = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "cell", live(C));
					rt.setFv(f, "loc", live(C), live(f.src));
					yield* g.callName(f, live(C), "add_fingerprint", [live(f.usr)]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＄！ inserts a power cell into ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You insert the power cell into ％！.</span>", [live(f.src)])]);
					yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The hatch must be open to insert a power cell!</span>"]);
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
			$0 = live(f.args[1]);
			$1 = live(f.args[1]);
			if (truthy(rt.sv(f, "panel_open"))) {
				$1 = $1;
				$2 = "opens";
			} else {
				$2 = "closes";
			}
			$1 = fmt("＄！ ＀ the hatch on ％！.", [$1, $2, live(f.src)]);
			if (truthy(rt.sv(f, "panel_open"))) {
				$2 = "open";
			} else {
				$2 = "close";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀ the hatch on ％！.</span>", [$2, live(f.src)])]);
			yield* g.srcCall(f, "update_icon");
			if (truthy(rt.sv(f, "panel_open"))) {
				yield* g.srcCall(f, "interact", live(f.args[1]));
			}
		} else {
			if ((truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0])))) || truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0])))))) {
				return live(f.dot);
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/space_heater/proc/ui_interact  (code/game/machinery/spaceheater.dm:182)  may sleep
rt.def("/obj/machinery/space_heater/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "space_heater", rt.sv(f, "name"), 400, 305, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/space_heater/proc/ui_data  (code/game/machinery/spaceheater.dm:188)
rt.def("/obj/machinery/space_heater/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, L: Value = null, curTemp: Value = null, env: Value = null;
	f.vars = () => [data, L, curTemp, env];
	rt.setAt((data = rt.list()), "open", rt.sv(f, "panel_open"));
	rt.setAt(live(data), "on", rt.sv(f, "on"));
	rt.setAt(live(data), "mode", rt.sv(f, "setMode"));
	rt.setAt(live(data), "hasPowercell", (truthy(rt.sv(f, "cell")) ? 1 : 0));
	if (truthy(rt.sv(f, "cell"))) {
		rt.setAt(live(data), "powerLevel", rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.sv(f, "cell"), "percent", []), 1]));
	}
	rt.setAt(live(data), "targetTemp", rt.call(f, P("/proc/round"), null, [subtract(rt.sv(f, "targetTemperature"), 273.1499938964844), 1]));
	rt.setAt(live(data), "minTemp", rt.call(f, P("/proc/max"), null, [subtract(subtract(rt.sv(f, "settableTemperatureMedian"), rt.sv(f, "settableTemperatureRange")), 273.1499938964844), 2.700000047683716]));
	rt.setAt(live(data), "maxTemp", subtract(add(rt.sv(f, "settableTemperatureMedian"), rt.sv(f, "settableTemperatureRange")), 273.1499938964844));
	L = rt.getStep(f, rt.sv(f, "loc"), 0);
	curTemp = null;
	if (truthy((rt.istype(live(L), T("/turf")) ? 1 : 0))) {
		curTemp = rt.gv(f, "temperature", (env = rt.callName(f, live(L), "return_air", [])));
	} else {
		if (truthy(rt.call(f, P("/proc/isturf"), null, [live(L)]))) {
			curTemp = rt.fv(f, "temperature", live(L));
		}
	}
	if (live(curTemp) === null) {
		rt.setAt(live(data), "currentTemp", "N/A");
	} else {
		rt.setAt(live(data), "currentTemp", rt.call(f, P("/proc/round"), null, [subtract(live(curTemp), 273.1499938964844), 1]));
	}
	return live(data);
});

// /obj/machinery/space_heater/proc/ui_act  (code/game/machinery/spaceheater.dm:213)  may sleep
rt.def("/obj/machinery/space_heater/proc/ui_act", function* ui_act(f: Frame) {
	let target: Value = null, adjust: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [target, adjust, $0, $1, $2];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		rt.setSv(f, "mode", "standby");
		$0 = live(f.usr);
		$1 = live(f.usr);
		if (truthy(rt.sv(f, "on"))) {
			$1 = $1;
			$2 = "on";
		} else {
			$2 = "off";
		}
		$1 = fmt("＀ switches ＀ ％！.", [$1, $2, live(f.src)]);
		if (truthy(rt.sv(f, "on"))) {
			$2 = "on";
		} else {
			$2 = "off";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You switch ＀ ％！.</span>", [$2, live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
		f.dot = 1;
	} else if ($0 === "mode") {
		rt.setSv(f, "setMode", rt.at(live(f.args[1]), "mode"));
		f.dot = 1;
	} else if ($0 === "target") {
		if (!truthy(rt.sv(f, "panel_open"))) {
			return live(f.dot);
		}
		target = rt.at(live(f.args[1]), "target");
		adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]));
		if (isEqual(live(target), "input")) {
			if (((target = (yield* g.op(f, "Prompt", [33], [null, (yield* g.call(f, P("/proc/round"), null, [subtract(rt.sv(f, "targetTemperature"), 273.1499938964844), 1])), rt.sv(f, "name"), "New target temperature:", null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				target = rt.modify(live(target), 273.1499938964844, add);
				f.dot = 1;
			}
		} else {
			if (truthy(live(adjust))) {
				target = add(rt.sv(f, "targetTemperature"), live(adjust));
				f.dot = 1;
			} else {
				if ((yield* g.call(f, P("/proc/text2num"), null, [live(target)])) !== null) {
					target = add((yield* g.call(f, P("/proc/text2num"), null, [live(target)])), 273.1499938964844);
					f.dot = 1;
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "targetTemperature", (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "settableTemperatureMedian"), rt.sv(f, "settableTemperatureRange")), 2.700000047683716])), (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [live(target)])), add(rt.sv(f, "settableTemperatureMedian"), rt.sv(f, "settableTemperatureRange"))]))])));
		}
	} else if ($0 === "eject") {
		if (!(truthy(rt.sv(f, "panel_open")) && truthy(rt.sv(f, "cell")))) return f.dot;
		rt.setFv(f, "loc", rt.sv(f, "cell"), rt.getStep(f, live(f.src), 0));
		rt.setSv(f, "cell", null);
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
