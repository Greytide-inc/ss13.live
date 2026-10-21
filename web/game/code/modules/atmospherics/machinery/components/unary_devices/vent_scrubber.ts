// From code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10609, "/obj/machinery/atmospherics/components/unary/vent_scrubber", "/obj/machinery/atmospherics/components/unary", {
	id_tag: null,
	on: 0,
	scrubbing: 1,
	scrub_CO2: 1,
	scrub_Toxins: 0,
	scrub_N2O: 0,
	scrub_BZ: 0,
	scrub_Freon: 0,
	scrub_WaterVapor: 0,
	volume_rate: 200,
	widenet: 0,
	adjacent_turfs: null,
	frequency: 1439,
	radio_connection: null,
	radio_filter_out: null,
	radio_filter_in: null,
	can_unwrench: 1,
	welded: 0,
	level: 1,
	name: "air scrubber",
	desc: "Has a valve and pump attached to it.",
	icon_state: "scrub_map",
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 60,
	layer: 2.46,
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/<init>  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:30)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "adjacent_turfs", rt.list());
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:38)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "id_tag"))) return f.dot;
	yield* g.srcCall(f, "assign_uid");
	rt.setSv(f, "id_tag", (yield* g.call(f, P("/proc/num2text"), null, [rt.sv(f, "uid")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/Destroy  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:48)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [A, I, $e];
	(rt.modField(f, (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), "air_scrub_names", rt.sv(f, "id_tag"), subtract));
	(rt.modField(f, live(A), "air_scrub_info", rt.sv(f, "id_tag"), subtract));
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	rt.setSv(f, "radio_connection", null);
	I = null;
	rt.forList(f, 0, rt.sv(f, "adjacent_turfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		I = null;
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/auto_use_power  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:62)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/auto_use_power", function auto_use_power(f: Frame) {
	let amount: Value = null;
	f.vars = () => [amount];
	if (!truthy(rt.callSrc(f, "powered", [rt.sv(f, "power_channel")]))) {
		return 0;
	}
	if ((!truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "welded")))) {
		return 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	amount = rt.sv(f, "idle_power_usage");
	if (truthy(rt.bitAnd(rt.sv(f, "scrubbing"), 1))) {
		if (truthy(rt.sv(f, "scrub_CO2"))) {
			amount = rt.modify(live(amount), rt.sv(f, "idle_power_usage"), add);
		}
		if (truthy(rt.sv(f, "scrub_Toxins"))) {
			amount = rt.modify(live(amount), rt.sv(f, "idle_power_usage"), add);
		}
		if (truthy(rt.sv(f, "scrub_N2O"))) {
			amount = rt.modify(live(amount), rt.sv(f, "idle_power_usage"), add);
		}
		if (truthy(rt.sv(f, "scrub_BZ"))) {
			amount = rt.modify(live(amount), rt.sv(f, "idle_power_usage"), add);
		}
		if (truthy(rt.sv(f, "scrub_Freon"))) {
			amount = rt.modify(live(amount), rt.sv(f, "idle_power_usage"), add);
		}
		if (truthy(rt.sv(f, "scrub_WaterVapor"))) {
			amount = rt.modify(live(amount), rt.sv(f, "idle_power_usage"), add);
		}
	} else {
		amount = rt.sv(f, "active_power_usage");
	}
	if (truthy(rt.sv(f, "widenet"))) {
		amount = rt.modify(live(amount), multiply(live(amount), multiply(rt.len(f, rt.sv(f, "adjacent_turfs")), divide(rt.len(f, rt.sv(f, "adjacent_turfs")), 2))), add);
	}
	rt.callSrc(f, "use_power", [live(amount), rt.sv(f, "power_channel")]);
	return 1;
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:93)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "showpipe"))) {
		rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.sv(f, "icon"), "scrub_cap", rt.sv(f, "initialize_directions")])]);
	}
	if (truthy(rt.sv(f, "welded"))) {
		rt.setSv(f, "icon_state", "scrub_welded");
		return live(f.dot);
	}
	if (((!truthy(rt.index(rt.sv(f, "nodes"), 1)) || !truthy(rt.sv(f, "on"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		rt.setSv(f, "icon_state", "scrub_off");
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "scrubbing"), 1))) {
		rt.setSv(f, "icon_state", "scrub_on");
	} else {
		rt.setSv(f, "icon_state", "scrub_purge");
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/set_frequency  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:111)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.sv(f, "radio_filter_in")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/broadcast_status  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:116)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null, A: Value = null;
	f.vars = () => [signal, A];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	rt.setFv(f, "data", live(signal), rt.alist(f, ["tag", rt.sv(f, "id_tag"), "frequency", rt.sv(f, "frequency"), "device", "VS", "timestamp", rt.worldTime(f), "power", rt.sv(f, "on"), "scrubbing", rt.sv(f, "scrubbing"), "widenet", rt.sv(f, "widenet"), "filter_co2", rt.sv(f, "scrub_CO2"), "filter_toxins", rt.sv(f, "scrub_Toxins"), "filter_n2o", rt.sv(f, "scrub_N2O"), "filter_bz", rt.sv(f, "scrub_BZ"), "filter_freon", rt.sv(f, "scrub_Freon"), "filter_water_vapor", rt.sv(f, "scrub_WaterVapor"), "sigtype", "status"]));
	if (!truthy(rt.index(rt.gv(f, "air_scrub_names", (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))), rt.sv(f, "id_tag")))) {
		rt.setSv(f, "name", fmt("ÿ\u0016＀ air scrubber #＀", [rt.fv(f, "name", live(A)), add(rt.getLen(f, rt.fv(f, "air_scrub_names", live(A))), 1)]));
		rt.setAt(rt.fv(f, "air_scrub_names", live(A)), rt.sv(f, "id_tag"), rt.sv(f, "name"));
	}
	rt.setAt(rt.fv(f, "air_scrub_info", live(A)), rt.sv(f, "id_tag"), rt.fv(f, "data", live(signal)));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal), rt.sv(f, "radio_filter_out")]);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/atmosinit  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:150)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/atmosinit", function* atmosinit(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.sv(f, "frequency"), rt.initial(f, live(f.src), "frequency"))) {
		$0 = rt.gl("RADIO_FROM_AIRALARM");
	} else {
		$0 = null;
	}
	rt.setSv(f, "radio_filter_in", $0);
	if (isEqual(rt.sv(f, "frequency"), rt.initial(f, live(f.src), "frequency"))) {
		$0 = rt.gl("RADIO_TO_AIRALARM");
	} else {
		$0 = null;
	}
	rt.setSv(f, "radio_filter_out", $0);
	if (truthy(rt.sv(f, "frequency"))) {
		yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	}
	yield* g.srcCall(f, "broadcast_status");
	yield* g.srcCall(f, "check_turfs");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:159)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/process_atmos", function* process_atmos(f: Frame) {
	let tile: Value = null;
	let $e: any;
	f.vars = () => [tile, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.sv(f, "nodes"), 1))) {
		rt.setSv(f, "on", 0);
	}
	if ((!truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "welded")))) {
		return 0;
	}
	yield* g.srcCall(f, "scrub", rt.sv(f, "loc"));
	if (!truthy(rt.sv(f, "widenet"))) return f.dot;
	tile = null;
	rt.forList(f, 0, rt.sv(f, "adjacent_turfs"), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tile = $e;
		yield* g.srcCall(f, "scrub", live(tile));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/scrub  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:172)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/scrub", function* scrub(f: Frame, tile: Value) {
	let environment: Value = null, air_contents: Value = null, env_gases: Value = null, should_we_scrub: Value = null, id: Value = null, transfer_moles: Value = null, removed: Value = null, removed_gases: Value = null, filtered_out: Value = null, filtered_gases: Value = null, transfer_moles_3: Value = null, removed_4: Value = null;
	let $e: any;
	f.vars = () => [tile, environment, air_contents, env_gases, should_we_scrub, id, transfer_moles, removed, removed_gases, filtered_out, filtered_gases, transfer_moles_3, removed_4, $e];
	if (!truthy((rt.istype(live(tile), T("/turf")) ? 1 : 0))) {
		return 0;
	}
	environment = (yield* g.callName(f, live(tile), "return_air", []));
	air_contents = rt.index(rt.sv(f, "airs"), 1);
	env_gases = rt.fv(f, "gases", live(environment));
	if (truthy(rt.bitAnd(rt.sv(f, "scrubbing"), 1))) {
		should_we_scrub = 0;
		id = null;
		rt.forList(f, 0, live(env_gases));
		while (($e = rt.next(f, 0)) !== undefined) {
			id = $e;
			if ((isEqual(live(id), "n2") || isEqual(live(id), "o2"))) {
				continue;
			}
			if (truthy(rt.index(rt.index(live(env_gases), live(id)), 1))) {
				should_we_scrub = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(should_we_scrub))) {
			transfer_moles = multiply((yield* g.call(f, P("/proc/min"), null, [1, divide(rt.sv(f, "volume_rate"), rt.fv(f, "volume", live(environment)))])), (yield* g.callName(f, live(environment), "total_moles", [])));
			if ((removed = (yield* g.callName(f, live(tile), "remove_air", [live(transfer_moles)]))) === null) {
				return live(f.dot);
			}
			removed_gases = rt.fv(f, "gases", live(removed));
			filtered_out = (yield* g.new_(f, T("/datum/gas_mixture"), []));
			filtered_gases = rt.fv(f, "gases", live(filtered_out));
			rt.setFv(f, "temperature", live(filtered_out), rt.fv(f, "temperature", live(removed)));
			if ((truthy(rt.sv(f, "scrub_Toxins")) && truthy(rt.at(live(removed_gases), "plasma")))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["plasma"]);
				rt.setAt(rt.at(live(filtered_gases), "plasma"), 1, rt.index(rt.at(live(removed_gases), "plasma"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "plasma"), 1, 0);
			}
			if ((truthy(rt.sv(f, "scrub_CO2")) && truthy(rt.at(live(removed_gases), "co2")))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["co2"]);
				rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), "co2"), 1, rt.index(rt.at(live(removed_gases), "co2"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "co2"), 1, 0);
			}
			if (truthy(rt.at(live(removed_gases), "agent_b"))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["agent_b"]);
				rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), "agent_b"), 1, rt.index(rt.at(live(removed_gases), "agent_b"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "agent_b"), 1, 0);
			}
			if ((truthy(rt.sv(f, "scrub_N2O")) && truthy(rt.at(live(removed_gases), "n2o")))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["n2o"]);
				rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), "n2o"), 1, rt.index(rt.at(live(removed_gases), "n2o"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "n2o"), 1, 0);
			}
			if ((truthy(rt.sv(f, "scrub_BZ")) && truthy(rt.at(live(removed_gases), "bz")))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["bz"]);
				rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), "bz"), 1, rt.index(rt.at(live(removed_gases), "bz"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "bz"), 1, 0);
			}
			if ((truthy(rt.sv(f, "scrub_Freon")) && truthy(rt.at(live(removed_gases), "freon")))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["freon"]);
				rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), "freon"), 1, rt.index(rt.at(live(removed_gases), "freon"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "freon"), 1, 0);
			}
			if ((truthy(rt.sv(f, "scrub_WaterVapor")) && truthy(rt.at(live(removed_gases), "water_vapor")))) {
				yield* g.callName(f, live(filtered_out), "assert_gas", ["water_vapor"]);
				rt.setAt(rt.index(rt.fv(f, "gases", live(filtered_out)), "water_vapor"), 1, rt.index(rt.at(live(removed_gases), "water_vapor"), 1));
				rt.setAt(rt.index(rt.fv(f, "gases", live(removed)), "water_vapor"), 1, 0);
			}
			yield* g.callName(f, live(removed), "garbage_collect", []);
			yield* g.callName(f, live(air_contents), "merge", [live(filtered_out)]);
			yield* g.callName(f, live(tile), "assume_air", [live(removed)]);
			yield* g.callName(f, live(tile), "air_update_turf", []);
		}
	} else {
		if (rt.ge((yield* g.callName(f, live(air_contents), "return_pressure", [])), 5066.25)) {
			return live(f.dot);
		}
		transfer_moles_3 = multiply((yield* g.callName(f, live(environment), "total_moles", [])), divide(rt.sv(f, "volume_rate"), rt.fv(f, "volume", live(environment))));
		removed_4 = (yield* g.callName(f, live(tile), "remove_air", [live(transfer_moles_3)]));
		yield* g.callName(f, live(air_contents), "merge", [live(removed_4)]);
		yield* g.callName(f, live(tile), "air_update_turf", []);
	}
	yield* g.srcCall(f, "update_parents");
	return 1;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/process  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:265)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/process", function process(f: Frame) {
	if (!truthy(rt.sv(f, "widenet"))) return f.dot;
	rt.callSrc(f, "check_turfs", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/check_turfs  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:270)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/check_turfs", function check_turfs(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	rt.callName(f, rt.sv(f, "adjacent_turfs"), "Cut", []);
	if (!truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "adjacent_turfs", rt.callName(f, live(_T), "GetAtmosAdjacentTurfs", ["alldir", 1], rt.Args.Named));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/receive_signal  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:277)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	f.vars = () => [signal];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (((!truthy(rt.index(rt.fv(f, "data", live(signal)), "tag")) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "tag"), rt.sv(f, "id_tag"))) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "sigtype"), "command"))) {
		return 0;
	}
	if (truthy((rt.isIn(f, "power", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "power")])));
	}
	if (truthy((rt.isIn(f, "power_toggle", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "widenet", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "widenet", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "widenet")])));
	}
	if (truthy((rt.isIn(f, "toggle_widenet", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "widenet", (!truthy(rt.sv(f, "widenet")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "scrubbing", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrubbing", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "scrubbing")])));
	}
	if (truthy((rt.isIn(f, "toggle_scrubbing", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrubbing", (!truthy(rt.sv(f, "scrubbing")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "co2_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_CO2", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "co2_scrub")])));
	}
	if (truthy((rt.isIn(f, "toggle_co2_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_CO2", (!truthy(rt.sv(f, "scrub_CO2")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "tox_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_Toxins", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "tox_scrub")])));
	}
	if (truthy((rt.isIn(f, "toggle_tox_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_Toxins", (!truthy(rt.sv(f, "scrub_Toxins")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "n2o_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_N2O", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "n2o_scrub")])));
	}
	if (truthy((rt.isIn(f, "toggle_n2o_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_N2O", (!truthy(rt.sv(f, "scrub_N2O")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "bz_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_BZ", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "bz_scrub")])));
	}
	if (truthy((rt.isIn(f, "toggle_bz_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_BZ", (!truthy(rt.sv(f, "scrub_BZ")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "freon_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_Freon", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "freon_scrub")])));
	}
	if (truthy((rt.isIn(f, "toggle_freon_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_Freon", (!truthy(rt.sv(f, "scrub_Freon")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "water_vapor_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_WaterVapor", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "water_vapor_scrub")])));
	}
	if (truthy((rt.isIn(f, "toggle_water_vapor_scrub", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "scrub_WaterVapor", (!truthy(rt.sv(f, "scrub_WaterVapor")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "init", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "name", rt.index(rt.fv(f, "data", live(signal)), "init"));
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "status", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		yield* g.srcCall(f, "broadcast_status");
		return live(f.dot);
	}
	yield* g.srcCall(f, "broadcast_status");
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/power_change  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:340)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon_nopipes", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/attackby  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:344)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Now welding the scrubber.</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
				if (!truthy(rt.sv(f, "welded"))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ welds the scrubber shut.", [live(f.args[1])]), "You weld the scrubber shut.", "You hear welding."]);
					rt.setSv(f, "welded", 1);
				} else {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unwelds the scrubber.", [live(f.args[1])]), "You unweld the scrubber.", "You hear welding."]);
					rt.setSv(f, "welded", 0);
				}
				yield* g.srcCall(f, "update_icon");
				rt.setSv(f, "pipe_vision_img", (yield* g.call(f, P("/proc/image"), null, [null, live(f.src), null, rt.sv(f, "loc"), "layer", 20, "dir", rt.sv(f, "dir")], rt.Args.Named)));
				rt.setFv(f, "plane", rt.sv(f, "pipe_vision_img"), 20);
			}
			return 0;
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/can_unwrench  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:367)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/can_unwrench", function can_unwrench(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "on")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot unwrench ＀, turn it off first!</span>", [live(f.src)])]);
	} else {
		return 1;
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/can_crawl_through  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:374)
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/can_crawl_through", function can_crawl_through(f: Frame) {
	return (!truthy(rt.sv(f, "welded")) ? 1 : 0);
});

// /obj/machinery/atmospherics/components/unary/vent_scrubber/proc/attack_alien  (code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm:377)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "welded")) || !truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(f.src)], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ furiously claws at ＀!", [live(user), live(f.src)]), "You manage to clear away the stuff blocking the scrubber.", "You hear loud scraping noises."]);
	rt.setSv(f, "welded", 0);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "pipe_vision_img", (yield* g.call(f, P("/proc/image"), null, [null, live(f.src), null, rt.sv(f, "loc"), "layer", 20, "dir", rt.sv(f, "dir")], rt.Args.Named)));
	rt.setFv(f, "plane", rt.sv(f, "pipe_vision_img"), 20);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bladeslice.ogg"), 100, 1]);
	return f.dot;
}, true);
