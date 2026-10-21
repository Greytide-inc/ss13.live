// From code/controllers/subsystem/weather.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(51, "/datum/controller/subsystem/weather", "/datum/controller/subsystem", {
	processing: null,
	existing_weather: null,
	eligible_zlevels: null,
	name: "Weather",
	flags: 4,
	wait: 10,
	runlevels: 4,
});

// /datum/controller/subsystem/weather/proc/New  (code/controllers/subsystem/weather.dm:2)  may sleep
rt.def("/datum/controller/subsystem/weather/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSweather"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSweather"), T("/datum/controller/subsystem/weather")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSweather")]);
		}
		rt.setGl("SSweather", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/weather/proc/<init>  (code/controllers/subsystem/weather.dm:7)
rt.def("/datum/controller/subsystem/weather/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "processing", rt.list());
	$0 = $0;
	rt.setSv(f, "existing_weather", rt.list());
	$0 = $0;
	rt.setSv(f, "eligible_zlevels", rt.list(5));
	return f.dot;
});

// /datum/controller/subsystem/weather/proc/fire  (code/controllers/subsystem/weather.dm:12)  may sleep
rt.def("/datum/controller/subsystem/weather/proc/fire", function* fire(f: Frame) {
	let V: Value = null, W: Value = null, L: Value = null, Z: Value = null, possible_weather_for_this_z: Value = null, V_2: Value = null, WE: Value = null, W_2: Value = null;
	let $e: any;
	f.vars = () => [V, W, L, Z, possible_weather_for_this_z, V_2, WE, W_2, $e];
	V = null;
	rt.forList(f, 0, rt.sv(f, "processing"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.gv(f, "aesthetic", (W = live(V))))) {
			continue;
		}
		L = null;
		rt.forList(f, 1, rt.gl("mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			if (truthy((yield* g.callName(f, live(W), "can_impact", [live(L)])))) {
				yield* g.callName(f, live(W), "impact", [live(L)]);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	Z = null;
	rt.forList(f, 0, rt.sv(f, "eligible_zlevels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Z = $e;
		possible_weather_for_this_z = rt.list();
		V_2 = null;
		rt.forList(f, 1, rt.sv(f, "existing_weather"));
		while (($e = rt.next(f, 1)) !== undefined) {
			V_2 = $e;
			if ((isEqual(rt.gv(f, "target_z", (WE = live(V_2))), live(Z)) && truthy(rt.fv(f, "probability", live(WE))))) {
				rt.setAt(live(possible_weather_for_this_z), live(WE), rt.fv(f, "probability", live(WE)));
			}
		}
		rt.endFor(f, 1);
		yield* g.srcCall(f, "run_weather", rt.gv(f, "name", (W_2 = (yield* g.call(f, P("/proc/pickweight"), null, [live(possible_weather_for_this_z)])))), live(Z));
		(rt.modSrcVar(f, "eligible_zlevels", live(Z), subtract));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/controller/subsystem/weather/proc/make_z_eligible"), live(Z)])), add((yield* g.call(f, P("/proc/rand"), null, [3000, 6000])), rt.fv(f, "weather_duration_upper", live(W_2))), 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/weather/proc/Initialize  (code/controllers/subsystem/weather.dm:31)  may sleep
rt.def("/datum/controller/subsystem/weather/proc/Initialize", function* Initialize(f: Frame) {
	let V: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [V, W, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	V = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/weather")])), T("/datum/weather")));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		W = live(V);
		yield* g.new_(f, live(W), []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["start_timeofday"] });

// /datum/controller/subsystem/weather/proc/run_weather  (code/controllers/subsystem/weather.dm:37)  may sleep
rt.def("/datum/controller/subsystem/weather/proc/run_weather", function* run_weather(f: Frame, weather_name: Value, Z: Value) {
	let V: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [weather_name, Z, V, W, $e];
	if (!truthy(live(weather_name))) {
		return live(f.dot);
	}
	V = null;
	rt.forList(f, 0, rt.sv(f, "existing_weather"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((isEqual(rt.gv(f, "name", (W = live(V))), live(weather_name)) && isEqual(rt.fv(f, "target_z", live(W)), live(Z)))) {
			yield* g.callName(f, live(W), "telegraph", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/weather/proc/make_z_eligible  (code/controllers/subsystem/weather.dm:45)
rt.def("/datum/controller/subsystem/weather/proc/make_z_eligible", function make_z_eligible(f: Frame, zlevel: Value) {
	(rt.modSrcVar(f, "eligible_zlevels", live(zlevel), rt.bitOr));
	return f.dot;
});
