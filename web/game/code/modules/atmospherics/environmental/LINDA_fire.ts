// From code/modules/atmospherics/environmental/LINDA_fire.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/temperature_expose  (code/modules/atmospherics/environmental/LINDA_fire.dm:2)
rt.def("/atom/proc/temperature_expose", function temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	return null;
});

// /turf/open/proc/hotspot_expose  (code/modules/atmospherics/environmental/LINDA_fire.dm:11)  may sleep
rt.def("/turf/open/proc/hotspot_expose", function* hotspot_expose(f: Frame, exposed_temperature: Value, exposed_volume: Value, soh: Value) {
	let air_contents: Value = null, oxy: Value = null, tox: Value = null, igniting: Value = null;
	let $0: any;
	f.vars = () => [exposed_temperature, exposed_volume, soh, air_contents, oxy, tox, igniting, $0];
	if (!truthy((air_contents = (yield* g.srcCall(f, "return_air"))))) {
		return 0;
	}
	if (truthy(rt.index(rt.fv(f, "gases", live(air_contents)), "o2"))) {
		$0 = rt.index(rt.index(rt.fv(f, "gases", live(air_contents)), "o2"), 1);
	} else {
		$0 = 0;
	}
	oxy = $0;
	if (truthy(rt.index(rt.fv(f, "gases", live(air_contents)), "plasma"))) {
		$0 = rt.index(rt.index(rt.fv(f, "gases", live(air_contents)), "plasma"), 1);
	} else {
		$0 = 0;
	}
	tox = $0;
	if (truthy(rt.sv(f, "active_hotspot"))) {
		if (truthy(live(soh))) {
			if ((rt.gt(live(tox), 0.5) && rt.gt(live(oxy), 0.5))) {
				if (rt.lt(rt.fv(f, "temperature", rt.sv(f, "active_hotspot")), live(exposed_temperature))) {
					rt.setFv(f, "temperature", rt.sv(f, "active_hotspot"), live(exposed_temperature));
				}
				if (rt.lt(rt.fv(f, "volume", rt.sv(f, "active_hotspot")), live(exposed_volume))) {
					rt.setFv(f, "volume", rt.sv(f, "active_hotspot"), live(exposed_volume));
				}
			}
		}
		return 1;
	}
	igniting = 0;
	if ((rt.gt(live(exposed_temperature), 373.1499938964844) && rt.gt(live(tox), 0.5))) {
		igniting = 1;
	}
	if (truthy(live(igniting))) {
		if ((rt.lt(live(oxy), 0.5) || rt.lt(live(tox), 0.5))) {
			return 0;
		}
		rt.setSv(f, "active_hotspot", (yield* g.new_(f, T("/obj/effect/hotspot"), [live(f.src)])));
		rt.setFv(f, "temperature", rt.sv(f, "active_hotspot"), live(exposed_temperature));
		rt.setFv(f, "volume", rt.sv(f, "active_hotspot"), live(exposed_volume));
		rt.setFv(f, "just_spawned", rt.sv(f, "active_hotspot"), (rt.lt(rt.sv(f, "current_cycle"), rt.fv(f, "times_fired", rt.gl("SSair"))) ? 1 : 0));
		yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src), 0]);
	}
	return live(igniting);
}, true);

rt.type(12039, "/obj/effect/hotspot", "/obj/effect", {
	volume: 125,
	temperature: 373.15,
	just_spawned: 1,
	bypassing: 0,
	anchored: 1,
	light_range: 3,
	light_color: "#FAA019",
	mouse_opacity: 0,
	icon: rt.rsc("icons/effects/fire.dmi"),
	icon_state: "1",
	layer: 2.04,
});

// /obj/effect/hotspot/proc/New  (code/modules/atmospherics/environmental/LINDA_fire.dm:61)  may sleep
rt.def("/obj/effect/hotspot/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSair"), "hotspots", live(f.src), add);
	yield* g.srcCall(f, "perform_exposure");
	yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
	yield* g.srcCall(f, "air_update_turf");
	return f.dot;
}, true);

// /obj/effect/hotspot/proc/perform_exposure  (code/modules/atmospherics/environmental/LINDA_fire.dm:71)  may sleep
rt.def("/obj/effect/hotspot/proc/perform_exposure", function* perform_exposure(f: Frame) {
	let location: Value = null, affected: Value = null, A: Value = null, AT: Value = null;
	let $e: any;
	f.vars = () => [location, affected, A, AT, $e];
	if ((!truthy((rt.istype((location = rt.sv(f, "loc")), T("/turf/open")) ? 1 : 0)) || !truthy(rt.fv(f, "air", live(location))))) {
		return 0;
	}
	rt.setFv(f, "active_hotspot", live(location), live(f.src));
	if (rt.gt(rt.sv(f, "volume"), 2375)) {
		rt.setSv(f, "bypassing", 1);
	} else {
		rt.setSv(f, "bypassing", 0);
	}
	if (truthy(rt.sv(f, "bypassing"))) {
		if (!truthy(rt.sv(f, "just_spawned"))) {
			rt.setSv(f, "volume", multiply(rt.index(rt.gv(f, "reaction_results", rt.fv(f, "air", live(location))), "fire"), 40000));
			rt.setSv(f, "temperature", rt.gv(f, "temperature", rt.fv(f, "air", live(location))));
		}
	} else {
		rt.setFv(f, "temperature", (affected = (yield* g.callName(f, rt.fv(f, "air", live(location)), "remove_ratio", [divide(rt.sv(f, "volume"), rt.gv(f, "volume", rt.fv(f, "air", live(location))))]))), rt.sv(f, "temperature"));
		yield* g.callName(f, live(affected), "react", []);
		rt.setSv(f, "temperature", rt.fv(f, "temperature", live(affected)));
		rt.setSv(f, "volume", multiply(rt.index(rt.fv(f, "reaction_results", live(affected)), "fire"), 40000));
		yield* g.callName(f, live(location), "assume_air", [live(affected)]);
	}
	A = null;
	rt.forList(f, 0, rt.sv(f, "loc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((truthy((AT = live(A))) && !isEqual(live(AT), live(f.src)))) {
			yield* g.callName(f, live(AT), "fire_act", [rt.sv(f, "temperature"), rt.sv(f, "volume")]);
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /obj/effect/hotspot/proc/process  (code/modules/atmospherics/environmental/LINDA_fire.dm:106)  may sleep
rt.def("/obj/effect/hotspot/proc/process", function* process(f: Frame) {
	let location: Value = null, radiated_temperature: Value = null, t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [location, radiated_temperature, t, _T, $e];
	if (truthy(rt.sv(f, "just_spawned"))) {
		rt.setSv(f, "just_spawned", 0);
		return 0;
	}
	if (!truthy((rt.istype((location = rt.sv(f, "loc")), T("/turf/open")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "excited_group", live(location)))) {
		yield* g.callName(f, rt.fv(f, "excited_group", live(location)), "reset_cooldowns", []);
	}
	if ((rt.lt(rt.sv(f, "temperature"), 373.1499938964844) || rt.le(rt.sv(f, "volume"), 1))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (((((!truthy(rt.fv(f, "air", live(location))) || !truthy(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(location))), "plasma"))) || !truthy(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(location))), "o2"))) || rt.lt(rt.index(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(location))), "plasma"), 1), 0.5)) || rt.lt(rt.index(rt.index(rt.gv(f, "gases", rt.fv(f, "air", live(location))), "o2"), 1), 0.5))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "perform_exposure");
	if (truthy(rt.sv(f, "bypassing"))) {
		rt.setSv(f, "icon_state", "3");
		yield* g.callName(f, live(location), "burn_tile", []);
		if (rt.gt(rt.gv(f, "temperature", rt.fv(f, "air", live(location))), 423.1499938964844)) {
			radiated_temperature = multiply(rt.gv(f, "temperature", rt.fv(f, "air", live(location))), 0.8500000238418579);
			t = null;
			rt.forList(f, 0, rt.fv(f, "atmos_adjacent_turfs", live(location)));
			while (($e = rt.next(f, 0)) !== undefined) {
				t = $e;
				if (truthy(rt.gv(f, "active_hotspot", (_T = live(t))))) {
					yield* g.callName(f, live(_T), "hotspot_expose", [live(radiated_temperature), 625]);
				}
			}
			rt.endFor(f, 0);
		}
	} else {
		if (rt.gt(rt.sv(f, "volume"), 1000)) {
			rt.setSv(f, "icon_state", "2");
		} else {
			rt.setSv(f, "icon_state", "1");
		}
	}
	if (rt.gt(rt.sv(f, "temperature"), rt.fv(f, "max_fire_temperature_sustained", live(location)))) {
		rt.setFv(f, "max_fire_temperature_sustained", live(location), rt.sv(f, "temperature"));
	}
	if ((truthy(rt.fv(f, "heat_capacity", live(location))) && rt.gt(rt.sv(f, "temperature"), rt.fv(f, "heat_capacity", live(location))))) {
		rt.setFv(f, "to_be_destroyed", live(location), 1);
	}
	return 1;
}, true, { waitfor: false });

// /obj/effect/hotspot/proc/Destroy  (code/modules/atmospherics/environmental/LINDA_fire.dm:153)  may sleep
rt.def("/obj/effect/hotspot/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.srcCall(f, "set_light", 0);
	(rt.modField(f, rt.gl("SSair"), "hotspots", live(f.src), subtract));
	if ((truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf/open")) ? 1 : 0)) && isEqual(rt.fv(f, "active_hotspot", live(_T)), live(f.src)))) {
		rt.setFv(f, "active_hotspot", live(_T), null);
	}
	yield* g.srcCall(f, "DestroyTurf");
	rt.setSv(f, "loc", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/hotspot/proc/DestroyTurf  (code/modules/atmospherics/environmental/LINDA_fire.dm:163)  may sleep
rt.def("/obj/effect/hotspot/proc/DestroyTurf", function* DestroyTurf(f: Frame) {
	let _T: Value = null, chance_of_deletion: Value = null;
	f.vars = () => [_T, chance_of_deletion];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	if (!truthy(rt.gv(f, "to_be_destroyed", (_T = rt.sv(f, "loc"))))) return f.dot;
	chance_of_deletion = null;
	if (truthy(rt.fv(f, "heat_capacity", live(_T)))) {
		chance_of_deletion = multiply(divide(rt.fv(f, "max_fire_temperature_sustained", live(_T)), rt.fv(f, "heat_capacity", live(_T))), 8);
	} else {
		chance_of_deletion = 100;
	}
	if (truthy(rt.op(f, "Prob", [], [live(chance_of_deletion)]))) {
		yield* g.callName(f, live(_T), "ChangeTurf", [rt.fv(f, "baseturf", live(_T))]);
	} else {
		rt.setFv(f, "to_be_destroyed", live(_T), 0);
		rt.setFv(f, "max_fire_temperature_sustained", live(_T), 0);
	}
	return f.dot;
}, true);

// /obj/effect/hotspot/proc/Crossed  (code/modules/atmospherics/environmental/LINDA_fire.dm:178)  may sleep
rt.def("/obj/effect/hotspot/proc/Crossed", function* Crossed(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "fire_act", [rt.sv(f, "temperature"), rt.sv(f, "volume")]);
	return f.dot;
}, true, { args: ["L"] });
