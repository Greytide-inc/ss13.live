// From code/modules/lighting/lighting_turf.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /turf/proc/reconsider_lights  (code/modules/lighting/lighting_turf.dm:16)
rt.def("/turf/proc/reconsider_lights", function reconsider_lights(f: Frame) {
	let L: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [L, thing, $e];
	L = null;
	thing = null;
	rt.forList(f, 0, rt.sv(f, "affecting_lights"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		rt.callName(f, (L = live(thing)), "vis_update", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/proc/lighting_clear_overlay  (code/modules/lighting/lighting_turf.dm:22)  may sleep
rt.def("/turf/proc/lighting_clear_overlay", function* lighting_clear_overlay(f: Frame) {
	let C: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [C, thing, $e];
	if (truthy(rt.sv(f, "lighting_object"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "lighting_object"), 1]);
	}
	C = null;
	thing = null;
	rt.forList(f, 0, rt.sv(f, "corners"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			continue;
		}
		yield* g.callName(f, (C = live(thing)), "update_active", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/lighting_build_overlay  (code/modules/lighting/lighting_turf.dm:37)  may sleep
rt.def("/turf/proc/lighting_build_overlay", function* lighting_build_overlay(f: Frame) {
	let A: Value = null, thing: Value = null, C: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [A, thing, C, S, $e];
	if (truthy(rt.sv(f, "lighting_object"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.gv(f, "dynamic_lighting", (A = rt.sv(f, "loc")))) && !truthy(rt.sv(f, "light_sources")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "lighting_corners_initialised"))) {
		yield* g.srcCall(f, "generate_missing_corners");
	}
	yield* g.new_(f, T("/atom/movable/lighting_object"), [live(f.src)]);
	thing = null;
	C = null;
	S = null;
	rt.forList(f, 0, rt.sv(f, "corners"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			continue;
		}
		if (!truthy(rt.gv(f, "active", (C = live(thing))))) {
			rt.forList(f, 1, rt.fv(f, "affecting", live(C)));
			while (($e = rt.next(f, 1)) !== undefined) {
				thing = $e;
				yield* g.callName(f, (S = live(thing)), "recalc_corner", [live(C)]);
			}
			rt.endFor(f, 1);
			rt.setFv(f, "active", live(C), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/proc/get_lumcount  (code/modules/lighting/lighting_turf.dm:61)
rt.def("/turf/proc/get_lumcount", function get_lumcount(f: Frame, minlum: Value, maxlum: Value) {
	let totallums: Value = null, thing: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [minlum, maxlum, totallums, thing, L, $e];
	if (live(minlum) === null) {
		minlum = 0;
	}
	if (live(maxlum) === null) {
		maxlum = 1;
	}
	if (!truthy(rt.sv(f, "lighting_object"))) {
		return 1;
	}
	totallums = 0;
	thing = null;
	L = null;
	rt.forList(f, 0, rt.sv(f, "corners"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			continue;
		}
		totallums = rt.modify(live(totallums), add(add(rt.gv(f, "lum_r", (L = live(thing))), rt.fv(f, "lum_b", live(L))), rt.fv(f, "lum_g", live(L))), add);
	}
	rt.endFor(f, 0);
	(totallums = rt.modify(live(totallums), 12, divide));
	totallums = divide(subtract(live(totallums), live(minlum)), subtract(live(maxlum), live(minlum)));
	return rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(totallums), 1])]);
});

// /turf/proc/is_softly_lit  (code/modules/lighting/lighting_turf.dm:84)
rt.def("/turf/proc/is_softly_lit", function is_softly_lit(f: Frame) {
	if (!truthy(rt.sv(f, "lighting_object"))) {
		return 0;
	}
	return (!truthy(rt.fv(f, "luminosity", rt.sv(f, "lighting_object"))) ? 1 : 0);
});

// /turf/proc/recalc_atom_opacity  (code/modules/lighting/lighting_turf.dm:91)
rt.def("/turf/proc/recalc_atom_opacity", function recalc_atom_opacity(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	rt.setSv(f, "has_opaque_atom", rt.sv(f, "opacity"));
	if (truthy(rt.sv(f, "has_opaque_atom"))) return f.dot;
	A = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.fv(f, "opacity", live(A)))) {
			rt.setSv(f, "has_opaque_atom", 1);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/proc/Entered  (code/modules/lighting/lighting_turf.dm:100)
rt.def("/turf/proc/Entered", function Entered(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && truthy(rt.fv(f, "opacity", live(f.args[0]))))) return f.dot;
	rt.setSv(f, "has_opaque_atom", 1);
	rt.callSrc(f, "reconsider_lights", []);
	return f.dot;
}, false, { args: ["Obj", "OldLoc"] });

// /turf/proc/Exited  (code/modules/lighting/lighting_turf.dm:107)
rt.def("/turf/proc/Exited", function Exited(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && truthy(rt.fv(f, "opacity", live(f.args[0]))))) return f.dot;
	rt.callSrc(f, "recalc_atom_opacity", []);
	rt.callSrc(f, "reconsider_lights", []);
	return f.dot;
}, false, { args: ["Obj", "newloc"] });

// /turf/proc/change_area  (code/modules/lighting/lighting_turf.dm:114)  may sleep
rt.def("/turf/proc/change_area", function* change_area(f: Frame, old_area: Value, new_area: Value) {
	f.vars = () => [old_area, new_area];
	if (isEqual(rt.fv(f, "dynamic_lighting", live(new_area)), rt.fv(f, "dynamic_lighting", live(old_area)))) return f.dot;
	if (truthy(rt.fv(f, "dynamic_lighting", live(new_area)))) {
		yield* g.srcCall(f, "lighting_build_overlay");
	} else {
		yield* g.srcCall(f, "lighting_clear_overlay");
	}
	return f.dot;
}, true);

// /turf/proc/get_corners  (code/modules/lighting/lighting_turf.dm:122)
rt.def("/turf/proc/get_corners", function get_corners(f: Frame) {
	// Turfs without dynamic lighting (space) hand out their corners too, so walls and doors next to space
	// get light from a source standing in space. Those turfs have no lighting object, so they stay fullbright.
	// (2017 tg returned null here for them; ported from tg-translated.)
	if (!truthy(rt.sv(f, "lighting_corners_initialised"))) {
		rt.callSrc(f, "generate_missing_corners", []);
	}
	if (truthy(rt.sv(f, "has_opaque_atom"))) {
		return null;
	}
	return rt.sv(f, "corners");
});

// /turf/proc/generate_missing_corners  (code/modules/lighting/lighting_turf.dm:132)
rt.def("/turf/proc/generate_missing_corners", function generate_missing_corners(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	// Corners are made for non-dynamic (space) turfs too; see get_corners.
	rt.setSv(f, "lighting_corners_initialised", 1);
	if (!truthy(rt.sv(f, "corners"))) {
		rt.setSv(f, "corners", rt.list(null, null, null, null));
	}
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.index(rt.sv(f, "corners"), live(i)))) {
			continue;
		}
		rt.setAt(rt.sv(f, "corners"), live(i), rt.new_(f, T("/datum/lighting_corner"), [live(f.src), rt.index(rt.gl("LIGHTING_CORNER_DIAGONAL"), live(i))]));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /turf/proc/ChangeTurf  (code/modules/lighting/lighting_turf.dm:146)  may sleep
rt.def("/turf/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	let old_opacity: Value = null, old_dynamic_lighting: Value = null, old_affecting_lights: Value = null, old_lighting_object: Value = null, old_corners: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [old_opacity, old_dynamic_lighting, old_affecting_lights, old_lighting_object, old_corners, S, $e];
	if (((!truthy(live(f.args[0])) || (!truthy(rt.gl("use_preloader")) && isEqual(live(f.args[0]), rt.sv(f, "type")))) || !truthy(rt.fv(f, "initialized", rt.gl("SSlighting"))))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	old_opacity = rt.sv(f, "opacity");
	old_dynamic_lighting = rt.sv(f, "dynamic_lighting");
	old_affecting_lights = rt.sv(f, "affecting_lights");
	old_lighting_object = rt.sv(f, "lighting_object");
	old_corners = rt.sv(f, "corners");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "recalc_atom_opacity");
	rt.setSv(f, "lighting_object", live(old_lighting_object));
	rt.setSv(f, "affecting_lights", live(old_affecting_lights));
	rt.setSv(f, "corners", live(old_corners));
	if ((!isEqual(live(old_opacity), rt.sv(f, "opacity")) || !isEqual(rt.sv(f, "dynamic_lighting"), live(old_dynamic_lighting)))) {
		yield* g.srcCall(f, "reconsider_lights");
	}
	if (!isEqual(rt.sv(f, "dynamic_lighting"), live(old_dynamic_lighting))) {
		if (truthy(rt.fv(f, "dynamic_lighting", live(f.src)))) {
			yield* g.srcCall(f, "lighting_build_overlay");
		} else {
			yield* g.srcCall(f, "lighting_clear_overlay");
		}
	}
	S = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(f.src)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(f.src)), 1), 1])), rt.fv(f, "z", live(f.src))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(f.src)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(f.src)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(f.src)))])), T("/turf/open/space"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.callName(f, live(S), "update_starlight", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["path"] });
