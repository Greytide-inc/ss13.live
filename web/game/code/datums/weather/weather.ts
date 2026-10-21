// From code/datums/weather/weather.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1051, "/datum/weather", "/datum", {
	name: "space wind",
	desc: "Heavy gusts of wind blanket the area, periodically knocking down anyone caught in the open.",
	telegraph_message: "<span class='warning'>The wind begins to pick up.</span>",
	telegraph_duration: 300,
	telegraph_sound: null,
	telegraph_overlay: null,
	weather_message: "<span class='userdanger'>The wind begins to blow ferociously!</span>",
	weather_duration: 1200,
	weather_duration_lower: 1200,
	weather_duration_upper: 1500,
	weather_sound: null,
	weather_overlay: null,
	weather_color: null,
	end_message: "<span class='danger'>The wind relents its assault.</span>",
	end_duration: 300,
	end_sound: null,
	end_overlay: null,
	impacted_areas: null,
	protected_areas: null,
	target_z: 2,
	overlay_layer: 10,
	aesthetic: 0,
	immunity_type: "storm",
	stage: 4,
	probability: 0,
	area_type: rt.typePath("/area/space"),
});

// /datum/weather/proc/<init>  (code/datums/weather/weather.dm:31)
rt.def("/datum/weather/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "impacted_areas", rt.list());
	$0 = $0;
	rt.setSv(f, "protected_areas", rt.list());
	return f.dot;
});

// /datum/weather/proc/New  (code/datums/weather/weather.dm:44)
rt.def("/datum/weather/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	(rt.modField(f, rt.gl("SSweather"), "existing_weather", live(f.src), rt.bitOr));
	return f.dot;
});

// /datum/weather/proc/Destroy  (code/datums/weather/weather.dm:48)  may sleep
rt.def("/datum/weather/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSweather"), "existing_weather", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/weather/proc/telegraph  (code/datums/weather/weather.dm:52)  may sleep
rt.def("/datum/weather/proc/telegraph", function* telegraph(f: Frame) {
	let affectareas: Value = null, V: Value = null, A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [affectareas, V, A, M, $e];
	if (isEqual(rt.sv(f, "stage"), 1)) {
		return live(f.dot);
	}
	rt.setSv(f, "stage", 1);
	affectareas = rt.list();
	V = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_areas"), null, [rt.sv(f, "area_type")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		affectareas = rt.modify(live(affectareas), live(V), add);
	}
	rt.endFor(f, 0);
	V = null;
	rt.forList(f, 0, rt.sv(f, "protected_areas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		(affectareas = rt.modify(live(affectareas), (yield* g.call(f, P("/proc/get_areas"), null, [live(V)])), subtract));
	}
	rt.endFor(f, 0);
	V = null;
	rt.forList(f, 0, live(affectareas));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (isEqual(rt.gv(f, "z", (A = live(V))), rt.sv(f, "target_z"))) {
			(rt.modSrcVar(f, "impacted_areas", live(A), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "weather_duration", (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "weather_duration_lower"), rt.sv(f, "weather_duration_upper")])));
	yield* g.srcCall(f, "update_areas");
	V = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (isEqual(rt.gv(f, "z", (M = live(V))), rt.sv(f, "target_z"))) {
			if (truthy(rt.sv(f, "telegraph_message"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), rt.sv(f, "telegraph_message")]);
			}
			if (truthy(rt.sv(f, "telegraph_sound"))) {
				rt.op(f, "Output", [], [live(M), (yield* g.call(f, P("/proc/sound"), null, [rt.sv(f, "telegraph_sound")]))], false);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/weather/proc/start")])), rt.sv(f, "telegraph_duration")]);
	return f.dot;
}, true);

// /datum/weather/proc/start  (code/datums/weather/weather.dm:76)  may sleep
rt.def("/datum/weather/proc/start", function* start(f: Frame) {
	let V: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [V, M, $e];
	if (rt.ge(rt.sv(f, "stage"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "stage", 2);
	yield* g.srcCall(f, "update_areas");
	V = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (isEqual(rt.gv(f, "z", (M = live(V))), rt.sv(f, "target_z"))) {
			if (truthy(rt.sv(f, "weather_message"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), rt.sv(f, "weather_message")]);
			}
			if (truthy(rt.sv(f, "weather_sound"))) {
				rt.op(f, "Output", [], [live(M), (yield* g.call(f, P("/proc/sound"), null, [rt.sv(f, "weather_sound")]))], false);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSweather"), "processing", live(f.src), add);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/weather/proc/wind_down")])), rt.sv(f, "weather_duration")]);
	return f.dot;
}, true);

// /datum/weather/proc/wind_down  (code/datums/weather/weather.dm:91)  may sleep
rt.def("/datum/weather/proc/wind_down", function* wind_down(f: Frame) {
	let V: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [V, M, $e];
	if (rt.ge(rt.sv(f, "stage"), 3)) {
		return live(f.dot);
	}
	rt.setSv(f, "stage", 3);
	yield* g.srcCall(f, "update_areas");
	V = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (isEqual(rt.gv(f, "z", (M = live(V))), rt.sv(f, "target_z"))) {
			if (truthy(rt.sv(f, "end_message"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), rt.sv(f, "end_message")]);
			}
			if (truthy(rt.sv(f, "end_sound"))) {
				rt.op(f, "Output", [], [live(M), (yield* g.call(f, P("/proc/sound"), null, [rt.sv(f, "end_sound")]))], false);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSweather"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/weather/proc/end")])), rt.sv(f, "end_duration")]);
	return f.dot;
}, true);

// /datum/weather/proc/end  (code/datums/weather/weather.dm:106)
rt.def("/datum/weather/proc/end", function end(f: Frame) {
	if (isEqual(rt.sv(f, "stage"), 4)) {
		return 1;
	}
	rt.setSv(f, "stage", 4);
	rt.callSrc(f, "update_areas", []);
	return f.dot;
});

// /datum/weather/proc/can_impact  (code/datums/weather/weather.dm:112)
rt.def("/datum/weather/proc/can_impact", function can_impact(f: Frame, L: Value) {
	let mob_turf: Value = null;
	f.vars = () => [mob_turf];
	if ((truthy((mob_turf = rt.getStep(f, live(L), 0))) && !isEqual(rt.fv(f, "z", live(mob_turf)), rt.sv(f, "target_z")))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.sv(f, "immunity_type"), rt.fv(f, "weather_immunities", live(L))) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, rt.call(f, P("/proc/get_area"), null, [live(L)]), rt.sv(f, "impacted_areas")) ? 1 : 0))) {
		return live(f.dot);
	}
	return 1;
});

// /datum/weather/proc/update_areas  (code/datums/weather/weather.dm:125)
rt.def("/datum/weather/proc/update_areas", function update_areas(f: Frame) {
	let V: Value = null, N: Value = null;
	let $0: any, $e: any;
	f.vars = () => [V, N, $0, $e];
	V = null;
	rt.forList(f, 0, rt.sv(f, "impacted_areas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.setFv(f, "layer", (N = live(V)), rt.sv(f, "overlay_layer"));
		rt.setFv(f, "icon", live(N), rt.rsc("icons/effects/weather_effects.dmi"));
		rt.setFv(f, "color", live(N), rt.sv(f, "weather_color"));
		$0 = rt.sv(f, "stage");
		if ($0 === 1) {
			rt.setFv(f, "icon_state", live(N), rt.sv(f, "telegraph_overlay"));
		} else if ($0 === 2) {
			rt.setFv(f, "icon_state", live(N), rt.sv(f, "weather_overlay"));
		} else if ($0 === 3) {
			rt.setFv(f, "icon_state", live(N), rt.sv(f, "end_overlay"));
		} else if ($0 === 4) {
			rt.setFv(f, "color", live(N), null);
			rt.setFv(f, "icon_state", live(N), "");
			rt.setFv(f, "icon", live(N), rt.rsc("icons/turf/areas.dmi"));
			rt.setFv(f, "layer", live(N), 10);
			rt.callName(f, live(N), "set_opacity", [0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
