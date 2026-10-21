// From code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10563, "/obj/machinery/atmospherics/components/binary/dp_vent_pump", "/obj/machinery/atmospherics/components/binary", {
	frequency: 0,
	id: null,
	radio_connection: null,
	on: 0,
	pump_direction: 1,
	external_pressure_bound: 101.325,
	input_pressure_min: 0,
	output_pressure_max: 0,
	pressure_checks: 1,
	level: 1,
	icon: rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"),
	icon_state: "dpvent_map",
	name: "dual-port air vent",
	desc: "Has a valve and pump attached to it. There are two ports.",
});

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/Destroy  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:41)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10565, "/obj/machinery/atmospherics/components/binary/dp_vent_pump/high_volume", "/obj/machinery/atmospherics/components/binary/dp_vent_pump", {
	name: "large dual-port air vent",
});

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/high_volume/proc/New  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:52)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/high_volume/proc/New", function* New(f: Frame) {
	let air1: Value = null, air2: Value = null;
	f.vars = () => [air1, air2];
	yield* g.callSuper(f, [], rt.Args.Same);
	air1 = rt.index(rt.sv(f, "airs"), 1);
	air2 = rt.index(rt.sv(f, "airs"), 2);
	rt.setFv(f, "volume", live(air1), 1000);
	rt.setFv(f, "volume", live(air2), 1000);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:59)
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "showpipe"))) {
		rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.rsc("icons/obj/atmospherics/components/unary_devices.dmi"), "dpvent_cap"])]);
	}
	if ((!truthy(rt.sv(f, "on")) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		rt.setSv(f, "icon_state", "vent_off");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "pump_direction"))) {
		rt.setSv(f, "icon_state", "vent_out");
	} else {
		rt.setSv(f, "icon_state", "vent_in");
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/process_atmos  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:73)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let air1: Value = null, air2: Value = null, environment: Value = null, environment_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null, parent1: Value = null, parent2: Value = null;
	f.vars = () => [air1, air2, environment, environment_pressure, pressure_delta, transfer_moles, removed, parent1, parent2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		return 0;
	}
	air1 = rt.index(rt.sv(f, "airs"), 1);
	air2 = rt.index(rt.sv(f, "airs"), 2);
	environment = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []));
	environment_pressure = (yield* g.callName(f, live(environment), "return_pressure", []));
	if (truthy(rt.sv(f, "pump_direction"))) {
		pressure_delta = 10000;
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 1))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract(rt.sv(f, "external_pressure_bound"), live(environment_pressure))]));
		}
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 2))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract((yield* g.callName(f, live(air1), "return_pressure", [])), rt.sv(f, "input_pressure_min"))]));
		}
		if (rt.gt(live(pressure_delta), 0)) {
			if (rt.gt(rt.fv(f, "temperature", live(air1)), 0)) {
				transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(environment))), multiply(rt.fv(f, "temperature", live(air1)), 8.3100004196167));
				if (!truthy((removed = (yield* g.callName(f, live(air1), "remove", [live(transfer_moles)]))))) {
					return 0;
				}
				yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(removed)]);
				yield* g.srcCall(f, "air_update_turf");
				rt.setFv(f, "update", (parent1 = rt.index(rt.sv(f, "parents"), 1)), 1);
			}
		}
	} else {
		pressure_delta = 10000;
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 1))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract(live(environment_pressure), rt.sv(f, "external_pressure_bound"))]));
		}
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 2))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract(rt.sv(f, "output_pressure_max"), (yield* g.callName(f, live(air2), "return_pressure", [])))]));
		}
		if (rt.gt(live(pressure_delta), 0)) {
			if (rt.gt(rt.fv(f, "temperature", live(environment)), 0)) {
				transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(air2))), multiply(rt.fv(f, "temperature", live(environment)), 8.3100004196167));
				if (!truthy((removed = (yield* g.callName(f, rt.sv(f, "loc"), "remove_air", [live(transfer_moles)]))))) {
					return 0;
				}
				yield* g.callName(f, live(air2), "merge", [live(removed)]);
				yield* g.srcCall(f, "air_update_turf");
				rt.setFv(f, "update", (parent2 = rt.index(rt.sv(f, "parents"), 2)), 1);
			}
		}
	}
	return 1;
}, true);

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/set_frequency  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:134)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [null, live(f.src), null, rt.sv(f, "frequency"), "filter", rt.gl("RADIO_ATMOSIA")], rt.Args.Named)));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/broadcast_status  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:140)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any;
	f.vars = () => [signal, $0, $1, $2, $3, $4, $5, $6, $7, $8];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	$0 = live(signal);
	$1 = "tag";
	$2 = rt.sv(f, "id");
	$3 = "device";
	$4 = "ADVP";
	$5 = "power";
	$6 = rt.sv(f, "on");
	$7 = "direction";
	if (truthy(rt.sv(f, "pump_direction"))) {
		$8 = "release";
	} else {
		$8 = "siphon";
	}
	rt.setFv(f, "data", $0, rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8, "checks", rt.sv(f, "pressure_checks"), "input", rt.sv(f, "input_pressure_min"), "output", rt.sv(f, "output_pressure_max"), "external", rt.sv(f, "external_pressure_bound"), "sigtype", "status"]));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "filter", rt.gl("RADIO_ATMOSIA")], rt.Args.Named);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/atmosinit  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:163)  may sleep
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/atmosinit", function* atmosinit(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "frequency"))) {
		yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	}
	yield* g.srcCall(f, "broadcast_status");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal  (code/modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:170)
rt.def("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	if (((!truthy(rt.index(rt.fv(f, "data", live(signal)), "tag")) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "tag"), rt.sv(f, "id"))) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "sigtype"), "command"))) {
		return 0;
	}
	if (truthy((rt.isIn(f, "power", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "power")]));
	}
	if (truthy((rt.isIn(f, "power_toggle", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "set_direction", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "pump_direction", rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_direction")]));
	}
	if (truthy((rt.isIn(f, "checks", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "pressure_checks", rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "checks")]));
	}
	if (truthy((rt.isIn(f, "purge", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		(rt.modSrcVar(f, "pressure_checks", 16777214, rt.bitAnd));
		rt.setSv(f, "pump_direction", 0);
	}
	if (truthy((rt.isIn(f, "stabalize", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		(rt.modSrcVar(f, "pressure_checks", 1, rt.bitOr));
		rt.setSv(f, "pump_direction", 1);
	}
	if (truthy((rt.isIn(f, "set_input_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "input_pressure_min", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_input_pressure")]), 5066.25])]));
	}
	if (truthy((rt.isIn(f, "set_output_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "output_pressure_max", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_output_pressure")]), 5066.25])]));
	}
	if (truthy((rt.isIn(f, "set_external_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "external_pressure_bound", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_external_pressure")]), 5066.25])]));
	}
	if (truthy((rt.isIn(f, "status", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:202", signal);
		return live(f.dot);
	}
	rt.spawnTail(f, 2, "/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:206", signal);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:206", function* (f: Frame, signal: Value) {
	f.vars = () => [signal];
	yield* g.srcCall(f, "broadcast_status");
	return null;
});

// a spawn(2) body of /obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/components/binary/dp_vent_pump/proc/receive_signal: spawn at modules/atmospherics/machinery/components/binary_devices/dp_vent_pump.dm:202", function* (f: Frame, signal: Value) {
	f.vars = () => [signal];
	yield* g.srcCall(f, "broadcast_status");
	return null;
});
