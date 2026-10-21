// From code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10601, "/obj/machinery/atmospherics/components/unary/vent_pump", "/obj/machinery/atmospherics/components/unary", {
	id_tag: null,
	on: 0,
	pump_direction: 1,
	pressure_checks: 1,
	external_pressure_bound: 101.325,
	internal_pressure_bound: 0,
	frequency: 1439,
	radio_connection: null,
	radio_filter_out: null,
	radio_filter_in: null,
	can_unwrench: 1,
	welded: 0,
	level: 1,
	name: "air vent",
	desc: "Has a valve and pump attached to it.",
	icon_state: "vent_map",
	use_power: 1,
	layer: 2.46,
});

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:49)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "id_tag"))) return f.dot;
	yield* g.srcCall(f, "assign_uid");
	rt.setSv(f, "id_tag", (yield* g.call(f, P("/proc/num2text"), null, [rt.sv(f, "uid")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/Destroy  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:55)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	(rt.modField(f, (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), "air_vent_names", rt.sv(f, "id_tag"), subtract));
	(rt.modField(f, live(A), "air_vent_info", rt.sv(f, "id_tag"), subtract));
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	rt.setSv(f, "radio_connection", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10605, "/obj/machinery/atmospherics/components/unary/vent_pump/high_volume", "/obj/machinery/atmospherics/components/unary/vent_pump", {
	name: "large air vent",
	power_channel: 1,
});

// /obj/machinery/atmospherics/components/unary/vent_pump/high_volume/proc/New  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:83)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/high_volume/proc/New", function* New(f: Frame) {
	let air_contents: Value = null;
	f.vars = () => [air_contents];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "volume", (air_contents = rt.index(rt.sv(f, "airs"), 1)), 1000);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/update_icon_nopipes  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:88)
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "showpipe"))) {
		rt.callSrc(f, "add_overlay", [rt.callSrc(f, "getpipeimage", [rt.sv(f, "icon"), "vent_cap", rt.sv(f, "initialize_directions")])]);
	}
	if (truthy(rt.sv(f, "welded"))) {
		rt.setSv(f, "icon_state", "vent_welded");
		return live(f.dot);
	}
	if (((!truthy(rt.index(rt.sv(f, "nodes"), 1)) || !truthy(rt.sv(f, "on"))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		rt.setSv(f, "icon_state", "vent_off");
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "pump_direction"), 1))) {
		rt.setSv(f, "icon_state", "vent_out");
	} else {
		rt.setSv(f, "icon_state", "vent_in");
	}
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:106)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/process_atmos", function* process_atmos(f: Frame) {
	let air_contents: Value = null, environment: Value = null, environment_pressure: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [air_contents, environment, environment_pressure, pressure_delta, transfer_moles, removed];
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
	air_contents = rt.index(rt.sv(f, "airs"), 1);
	environment = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []));
	environment_pressure = (yield* g.callName(f, live(environment), "return_pressure", []));
	if (truthy(rt.bitAnd(rt.sv(f, "pump_direction"), 1))) {
		pressure_delta = 10000;
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 1))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract(rt.sv(f, "external_pressure_bound"), live(environment_pressure))]));
		}
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 2))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract((yield* g.callName(f, live(air_contents), "return_pressure", [])), rt.sv(f, "internal_pressure_bound"))]));
		}
		if (rt.gt(live(pressure_delta), 0)) {
			if (rt.gt(rt.fv(f, "temperature", live(air_contents)), 0)) {
				transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(environment))), multiply(rt.fv(f, "temperature", live(air_contents)), 8.3100004196167));
				removed = (yield* g.callName(f, live(air_contents), "remove", [live(transfer_moles)]));
				yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(removed)]);
				yield* g.srcCall(f, "air_update_turf");
			}
		}
	} else {
		pressure_delta = 10000;
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 1))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract(live(environment_pressure), rt.sv(f, "external_pressure_bound"))]));
		}
		if (truthy(rt.bitAnd(rt.sv(f, "pressure_checks"), 2))) {
			pressure_delta = (yield* g.call(f, P("/proc/min"), null, [live(pressure_delta), subtract(rt.sv(f, "internal_pressure_bound"), (yield* g.callName(f, live(air_contents), "return_pressure", [])))]));
		}
		if (rt.gt(live(pressure_delta), 0)) {
			if (rt.gt(rt.fv(f, "temperature", live(environment)), 0)) {
				transfer_moles = divide(multiply(live(pressure_delta), rt.fv(f, "volume", live(air_contents))), multiply(rt.fv(f, "temperature", live(environment)), 8.3100004196167));
				if ((removed = (yield* g.callName(f, rt.sv(f, "loc"), "remove_air", [live(transfer_moles)]))) === null) {
					return live(f.dot);
				}
				yield* g.callName(f, live(air_contents), "merge", [live(removed)]);
				yield* g.srcCall(f, "air_update_turf");
			}
		}
	}
	yield* g.srcCall(f, "update_parents");
	return 1;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/set_frequency  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:159)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.sv(f, "radio_filter_in")])));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/broadcast_status  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:165)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $11: any, $12: any;
	f.vars = () => [signal, A, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	$0 = live(signal);
	$1 = "tag";
	$2 = rt.sv(f, "id_tag");
	$3 = "frequency";
	$4 = rt.sv(f, "frequency");
	$5 = "device";
	$6 = "VP";
	$7 = "timestamp";
	$8 = rt.worldTime(f);
	$9 = "power";
	$10 = rt.sv(f, "on");
	$11 = "direction";
	if (truthy(rt.sv(f, "pump_direction"))) {
		$12 = "release";
	} else {
		$12 = "siphon";
	}
	rt.setFv(f, "data", $0, rt.alist(f, [$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, "checks", rt.sv(f, "pressure_checks"), "internal", rt.sv(f, "internal_pressure_bound"), "external", rt.sv(f, "external_pressure_bound"), "sigtype", "status"]));
	if (!truthy(rt.index(rt.gv(f, "air_vent_names", (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))), rt.sv(f, "id_tag")))) {
		rt.setSv(f, "name", fmt("ÿ\u0016＀ vent pump #＀", [rt.fv(f, "name", live(A)), add(rt.getLen(f, rt.fv(f, "air_vent_names", live(A))), 1)]));
		rt.setAt(rt.fv(f, "air_vent_names", live(A)), rt.sv(f, "id_tag"), rt.sv(f, "name"));
	}
	rt.setAt(rt.fv(f, "air_vent_info", live(A)), rt.sv(f, "id_tag"), rt.fv(f, "data", live(signal)));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal), rt.sv(f, "radio_filter_out")]);
	return 1;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/atmosinit  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:198)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/atmosinit", function* atmosinit(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.sv(f, "frequency"), 1439)) {
		$0 = rt.gl("RADIO_FROM_AIRALARM");
	} else {
		$0 = null;
	}
	rt.setSv(f, "radio_filter_in", $0);
	if (isEqual(rt.sv(f, "frequency"), 1439)) {
		$0 = rt.gl("RADIO_TO_AIRALARM");
	} else {
		$0 = null;
	}
	rt.setSv(f, "radio_filter_out", $0);
	if (truthy(rt.sv(f, "frequency"))) {
		yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	}
	yield* g.srcCall(f, "broadcast_status");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/receive_signal  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:206)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let $0: any;
	f.vars = () => [signal, $0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (((!truthy(rt.index(rt.fv(f, "data", live(signal)), "tag")) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "tag"), rt.sv(f, "id_tag"))) || !isEqual(rt.index(rt.fv(f, "data", live(signal)), "sigtype"), "command"))) {
		return 0;
	}
	if (truthy((rt.isIn(f, "purge", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		(rt.modSrcVar(f, "pressure_checks", 16777214, rt.bitAnd));
		rt.setSv(f, "pump_direction", 0);
	}
	if (truthy((rt.isIn(f, "stabalize", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		(rt.modSrcVar(f, "pressure_checks", 1, rt.bitOr));
		rt.setSv(f, "pump_direction", 1);
	}
	if (truthy((rt.isIn(f, "power", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "power")])));
	}
	if (truthy((rt.isIn(f, "power_toggle", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	}
	if (truthy((rt.isIn(f, "checks", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "pressure_checks", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "checks")])));
	}
	if (truthy((rt.isIn(f, "checks_toggle", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		if (truthy(rt.sv(f, "pressure_checks"))) {
			$0 = 0;
		} else {
			$0 = 3;
		}
		rt.setSv(f, "pressure_checks", $0);
	}
	if (truthy((rt.isIn(f, "direction", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "pump_direction", (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "direction")])));
	}
	if (truthy((rt.isIn(f, "set_internal_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "internal_pressure_bound", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_internal_pressure")])), 5066.25]))])));
	}
	if (truthy((rt.isIn(f, "set_external_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "external_pressure_bound", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "set_external_pressure")])), 5066.25]))])));
	}
	if (truthy((rt.isIn(f, "reset_external_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "external_pressure_bound", 101.32499694824219);
	}
	if (truthy((rt.isIn(f, "adjust_internal_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "internal_pressure_bound", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "internal_pressure_bound"), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "adjust_internal_pressure")]))), 5066.25]))])));
	}
	if (truthy((rt.isIn(f, "adjust_external_pressure", rt.fv(f, "data", live(signal))) ? 1 : 0))) {
		rt.setSv(f, "external_pressure_bound", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "external_pressure_bound"), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "data", live(signal)), "adjust_external_pressure")]))), 5066.25]))])));
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

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/attackby  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:264)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You begin welding the vent...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
				if (!truthy(rt.sv(f, "welded"))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ welds the vent shut.", [live(f.args[1])]), "<span class='notice'>You weld the vent shut.</span>", "<span class='italics'>You hear welding.</span>"]);
					rt.setSv(f, "welded", 1);
				} else {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unwelds the vent.", [live(f.args[1])]), "<span class='notice'>You unweld the vent.</span>", "<span class='italics'>You hear welding.</span>"]);
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

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/can_unwrench  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:286)
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/can_unwrench", function can_unwrench(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if ((!truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "on")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You cannot unwrench ＀, turn it off first!</span>", [live(f.src)])]);
	} else {
		return 1;
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/examine  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:293)
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "welded"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It seems welded shut."]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/power_change  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:298)
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon_nopipes", []);
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/can_crawl_through  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:302)
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/can_crawl_through", function can_crawl_through(f: Frame) {
	return (!truthy(rt.sv(f, "welded")) ? 1 : 0);
});

// /obj/machinery/atmospherics/components/unary/vent_pump/proc/attack_alien  (code/modules/atmospherics/machinery/components/unary_devices/vent_pump.dm:305)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/vent_pump/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "welded")) || !truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(f.src)], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ furiously claws at ＀!", [live(user), live(f.src)]), "You manage to clear away the stuff blocking the vent", "You hear loud scraping noises."]);
	rt.setSv(f, "welded", 0);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "pipe_vision_img", (yield* g.call(f, P("/proc/image"), null, [null, live(f.src), null, rt.sv(f, "loc"), "layer", 20, "dir", rt.sv(f, "dir")], rt.Args.Named)));
	rt.setFv(f, "plane", rt.sv(f, "pipe_vision_img"), 20);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bladeslice.ogg"), 100, 1]);
	return f.dot;
}, true);
