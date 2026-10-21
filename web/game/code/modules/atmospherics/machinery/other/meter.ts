// From code/modules/atmospherics/machinery/other/meter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10883, "/obj/machinery/meter", "/obj/machinery", {
	target: null,
	frequency: 0,
	id_tag: null,
	anchored: 1,
	power_channel: 3,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 4,
	name: "gas flow meter",
	desc: "It measures something.",
	icon: rt.rsc("icons/obj/meter.dmi"),
	icon_state: "meterX",
	obj_integrity: 150,
	max_integrity: 150,
	armor: null,
});

// /obj/machinery/meter/proc/<init>  (code/modules/atmospherics/machinery/other/meter.dm:16)
rt.def("/obj/machinery/meter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 40, "acid", 0]));
	return f.dot;
});

// /obj/machinery/meter/proc/Initialize  (code/modules/atmospherics/machinery/other/meter.dm:20)  may sleep
rt.def("/obj/machinery/meter/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	if (truthy(rt.sv(f, "target"))) return f.dot;
	rt.setSv(f, "target", rt.locateIn(f, T("/obj/machinery/atmospherics/pipe"), rt.sv(f, "loc")));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/meter/proc/Destroy  (code/modules/atmospherics/machinery/other/meter.dm:26)  may sleep
rt.def("/obj/machinery/meter/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	rt.setFv(f, "target", live(f.src), null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/meter/proc/process_atmos  (code/modules/atmospherics/machinery/other/meter.dm:31)  may sleep
rt.def("/obj/machinery/meter/proc/process_atmos", function* process_atmos(f: Frame) {
	let environment: Value = null, env_pressure: Value = null, val: Value = null, radio_connection: Value = null, signal: Value = null;
	f.vars = () => [environment, env_pressure, val, radio_connection, signal];
	if (!truthy(rt.sv(f, "target"))) {
		rt.setSv(f, "icon_state", "meterX");
		return 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.setSv(f, "icon_state", "meter0");
		return 0;
	}
	yield* g.srcCall(f, "use_power", 5);
	if (!truthy((environment = (yield* g.callName(f, rt.sv(f, "target"), "return_air", []))))) {
		rt.setSv(f, "icon_state", "meterX");
		return 0;
	}
	if (rt.le((env_pressure = (yield* g.callName(f, live(environment), "return_pressure", []))), 15.198750495910645)) {
		rt.setSv(f, "icon_state", "meter0");
	} else {
		if (rt.le(live(env_pressure), 182.38499450683594)) {
			rt.setSv(f, "icon_state", fmt("meter1_＀", [(val = (yield* g.call(f, P("/proc/round"), null, [add(divide(live(env_pressure), 30.39750099182129), 0.5)])))]));
		} else {
			if (rt.le(live(env_pressure), 3039.75)) {
				rt.setSv(f, "icon_state", fmt("meter2_＀", [(val = add((yield* g.call(f, P("/proc/round"), null, [subtract(divide(live(env_pressure), 506.625), 0.3499999940395355)])), 1))]));
			} else {
				if (rt.le(live(env_pressure), 5978.1748046875)) {
					rt.setSv(f, "icon_state", fmt("meter3_＀", [(val = add((yield* g.call(f, P("/proc/round"), null, [subtract(divide(live(env_pressure), 506.625), 6)])), 1))]));
				} else {
					rt.setSv(f, "icon_state", "meter4");
				}
			}
		}
	}
	if (!truthy(rt.sv(f, "frequency"))) return f.dot;
	if (!truthy((radio_connection = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [rt.sv(f, "frequency")]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "source", (signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "transmission_method", live(signal), 1);
	rt.setFv(f, "data", live(signal), rt.alist(f, ["id_tag", rt.sv(f, "id_tag"), "device", "AM", "pressure", (yield* g.call(f, P("/proc/round"), null, [live(env_pressure)])), "sigtype", "status"]));
	yield* g.callName(f, live(radio_connection), "post_signal", [live(f.src), live(signal)]);
	return f.dot;
}, true);

// /obj/machinery/meter/proc/status  (code/modules/atmospherics/machinery/other/meter.dm:79)
rt.def("/obj/machinery/meter/proc/status", function status(f: Frame) {
	let t: Value = null, environment: Value = null;
	f.vars = () => [t, environment];
	t = "";
	if (truthy(rt.fv(f, "target", live(f.src)))) {
		if (truthy((environment = rt.callName(f, rt.sv(f, "target"), "return_air", [])))) {
			t = rt.modify(live(t), fmt("The pressure gauge reads ＀ kPa; ＀ K (＀&deg;C)", [rt.call(f, P("/proc/round"), null, [rt.callName(f, live(environment), "return_pressure", []), 0.009999999776482582]), rt.call(f, P("/proc/round"), null, [rt.fv(f, "temperature", live(environment)), 0.009999999776482582]), rt.call(f, P("/proc/round"), null, [subtract(rt.fv(f, "temperature", live(environment)), 273.1499938964844), 0.009999999776482582])]), add);
		} else {
			t = rt.modify(live(t), "The sensor error light is blinking.", add);
		}
	} else {
		t = rt.modify(live(t), "The connect error light is blinking.", add);
	}
	return live(t);
});

// /obj/machinery/meter/proc/examine  (code/modules/atmospherics/machinery/other/meter.dm:91)
rt.def("/obj/machinery/meter/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.callSrc(f, "status", [])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/meter/proc/attackby  (code/modules/atmospherics/machinery/other/meter.dm:96)  may sleep
rt.def("/obj/machinery/meter/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to unfasten ％！...</span>", [live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unfastens ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unfasten ％！.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
			yield* g.new_(f, T("/obj/item/pipe_meter"), [rt.fv(f, "loc", live(f.src))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/meter/proc/attack_ai  (code/modules/atmospherics/machinery/other/meter.dm:110)
rt.def("/obj/machinery/meter/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return rt.callName(f, live(f.src), "attack_hand", [live(user)]);
});

// /obj/machinery/meter/proc/attack_paw  (code/modules/atmospherics/machinery/other/meter.dm:113)
rt.def("/obj/machinery/meter/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	return rt.callName(f, live(f.src), "attack_hand", [live(user)]);
});

// /obj/machinery/meter/proc/attack_hand  (code/modules/atmospherics/machinery/other/meter.dm:117)
rt.def("/obj/machinery/meter/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 1;
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), rt.callSrc(f, "status", [])]);
		return 1;
	}
	return f.dot;
});

// /obj/machinery/meter/proc/singularity_pull  (code/modules/atmospherics/machinery/other/meter.dm:124)  may sleep
rt.def("/obj/machinery/meter/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.new_(f, T("/obj/item/pipe_meter"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10884, "/obj/machinery/meter/turf", "/obj/machinery/meter", {});

// /obj/machinery/meter/turf/proc/Initialize  (code/modules/atmospherics/machinery/other/meter.dm:133)  may sleep
rt.def("/obj/machinery/meter/turf/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "target", live(f.src), rt.sv(f, "loc"));
	return f.dot;
}, true);
