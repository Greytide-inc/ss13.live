// From code/modules/lighting/lighting_source.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2804, "/datum/light_source", "/datum", {
	top_atom: null,
	source_atom: null,
	source_turf: null,
	pixel_turf: null,
	light_power: null,
	light_range: null,
	light_color: null,
	lum_r: null,
	lum_g: null,
	lum_b: null,
	applied_lum_r: null,
	applied_lum_g: null,
	applied_lum_b: null,
	effect_str: null,
	affecting_turfs: null,
	applied: 0,
	needs_update: 0,
}, { tmp: ["applied_lum_r","applied_lum_g","applied_lum_b"] });

// /datum/light_source/proc/New  (code/modules/lighting/lighting_source.dm:33)
rt.def("/datum/light_source/proc/New", function New(f: Frame) {
	rt.setSv(f, "source_atom", live(f.args[0]));
	if (!truthy(rt.fv(f, "light_sources", rt.sv(f, "source_atom")))) {
		rt.setFv(f, "light_sources", rt.sv(f, "source_atom"), rt.list());
	}
	rt.modField(f, rt.sv(f, "source_atom"), "light_sources", live(f.src), add);
	rt.setSv(f, "top_atom", live(f.args[1]));
	if (!isEqual(rt.sv(f, "top_atom"), rt.sv(f, "source_atom"))) {
		if (!truthy(rt.fv(f, "light_sources", rt.sv(f, "top_atom")))) {
			rt.setFv(f, "light_sources", rt.sv(f, "top_atom"), rt.list());
		}
		rt.modField(f, rt.sv(f, "top_atom"), "light_sources", live(f.src), add);
	}
	rt.setSv(f, "source_turf", rt.sv(f, "top_atom"));
	rt.setSv(f, "pixel_turf", (rt.call(f, P("/proc/get_turf_pixel"), null, [rt.sv(f, "top_atom")]) || rt.sv(f, "source_turf")));
	rt.setSv(f, "light_power", rt.fv(f, "light_power", rt.sv(f, "source_atom")));
	rt.setSv(f, "light_range", rt.fv(f, "light_range", rt.sv(f, "source_atom")));
	rt.setSv(f, "light_color", rt.fv(f, "light_color", rt.sv(f, "source_atom")));
	rt.callSrc(f, "parse_light_color", []);
	rt.callSrc(f, "update", []);
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["owner", "top"] });

// /datum/light_source/proc/Destroy  (code/modules/lighting/lighting_source.dm:53)  may sleep
rt.def("/datum/light_source/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "remove_lum");
	if (truthy(rt.sv(f, "source_atom"))) {
		if (truthy(rt.fv(f, "light_sources", rt.sv(f, "source_atom")))) {
			(rt.modField(f, rt.sv(f, "source_atom"), "light_sources", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "light_sources", rt.sv(f, "source_atom"))))) {
				rt.setFv(f, "light_sources", rt.sv(f, "source_atom"), null);
			}
		}
	}
	if (truthy(rt.sv(f, "top_atom"))) {
		if (truthy(rt.fv(f, "light_sources", rt.sv(f, "top_atom")))) {
			(rt.modField(f, rt.sv(f, "top_atom"), "light_sources", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "light_sources", rt.sv(f, "top_atom"))))) {
				rt.setFv(f, "light_sources", rt.sv(f, "top_atom"), null);
			}
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[0]))) return f.dot;
	return 2;
}, true, { args: ["force"] });

// /datum/light_source/proc/update  (code/modules/lighting/lighting_source.dm:77)
rt.def("/datum/light_source/proc/update", function update(f: Frame, new_top_atom: Value) {
	if ((truthy(live(new_top_atom)) && !isEqual(live(new_top_atom), rt.sv(f, "top_atom")))) {
		if ((!isEqual(rt.sv(f, "top_atom"), rt.sv(f, "source_atom")) && truthy(rt.fv(f, "light_sources", rt.sv(f, "top_atom"))))) {
			if (truthy(rt.fv(f, "light_sources", rt.sv(f, "top_atom")))) {
				(rt.modField(f, rt.sv(f, "top_atom"), "light_sources", live(f.src), subtract));
				if (!truthy(rt.getLen(f, rt.fv(f, "light_sources", rt.sv(f, "top_atom"))))) {
					rt.setFv(f, "light_sources", rt.sv(f, "top_atom"), null);
				}
			}
		}
		rt.setSv(f, "top_atom", live(new_top_atom));
		if (!isEqual(rt.sv(f, "top_atom"), rt.sv(f, "source_atom"))) {
			if (!truthy(rt.fv(f, "light_sources", rt.sv(f, "top_atom")))) {
				rt.setFv(f, "light_sources", rt.sv(f, "top_atom"), rt.list());
			}
			rt.modField(f, rt.sv(f, "top_atom"), "light_sources", live(f.src), add);
		}
	}
	if (isEqual(rt.sv(f, "needs_update"), 0)) {
		rt.modGl("lighting_update_lights", live(f.src), add);
	}
	if (!rt.lt(rt.sv(f, "needs_update"), 2)) return f.dot;
	rt.setSv(f, "needs_update", 2);
	return f.dot;
});

// /datum/light_source/proc/force_update  (code/modules/lighting/lighting_source.dm:90)
rt.def("/datum/light_source/proc/force_update", function force_update(f: Frame) {
	if (isEqual(rt.sv(f, "needs_update"), 0)) {
		rt.modGl("lighting_update_lights", live(f.src), add);
	}
	if (!rt.lt(rt.sv(f, "needs_update"), 3)) return f.dot;
	rt.setSv(f, "needs_update", 3);
	return f.dot;
});

// /datum/light_source/proc/vis_update  (code/modules/lighting/lighting_source.dm:94)
rt.def("/datum/light_source/proc/vis_update", function vis_update(f: Frame) {
	if (isEqual(rt.sv(f, "needs_update"), 0)) {
		rt.modGl("lighting_update_lights", live(f.src), add);
	}
	if (!rt.lt(rt.sv(f, "needs_update"), 1)) return f.dot;
	rt.setSv(f, "needs_update", 1);
	return f.dot;
});

// /datum/light_source/proc/parse_light_color  (code/modules/lighting/lighting_source.dm:99)
rt.def("/datum/light_source/proc/parse_light_color", function parse_light_color(f: Frame) {
	if (truthy(rt.sv(f, "light_color"))) {
		rt.setSv(f, "lum_r", divide(rt.call(f, P("/proc/GetRedPart"), null, [rt.sv(f, "light_color")]), 255));
		rt.setSv(f, "lum_g", divide(rt.call(f, P("/proc/GetGreenPart"), null, [rt.sv(f, "light_color")]), 255));
		rt.setSv(f, "lum_b", divide(rt.call(f, P("/proc/GetBluePart"), null, [rt.sv(f, "light_color")]), 255));
	} else {
		rt.setSv(f, "lum_r", 1);
		rt.setSv(f, "lum_g", 1);
		rt.setSv(f, "lum_b", 1);
	}
	return f.dot;
});

// /datum/light_source/proc/remove_lum  (code/modules/lighting/lighting_source.dm:179)
rt.def("/datum/light_source/proc/remove_lum", function remove_lum(f: Frame) {
	let thing: Value = null, _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [thing, _T, C, $e];
	rt.setSv(f, "applied", 0);
	thing = null;
	rt.forList(f, 0, rt.sv(f, "affecting_turfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.gv(f, "affecting_lights", (_T = live(thing))))) {
			(rt.modField(f, live(_T), "affecting_lights", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "affecting_lights", live(_T))))) {
				rt.setFv(f, "affecting_lights", live(_T), null);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "affecting_turfs", null);
	C = null;
	rt.forList(f, 0, rt.sv(f, "effect_str"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		C = live(thing);
		f.dot = rt.neg(rt.index(rt.sv(f, "effect_str"), live(C)));
		rt.callName(f, live(C), "update_lumcount", [multiply(live(f.dot), rt.sv(f, "applied_lum_r")), multiply(live(f.dot), rt.sv(f, "applied_lum_g")), multiply(live(f.dot), rt.sv(f, "applied_lum_b"))]);
		if (truthy(rt.fv(f, "affecting", live(C)))) {
			(rt.modField(f, live(C), "affecting", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "affecting", live(C))))) {
				rt.setFv(f, "affecting", live(C), null);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "effect_str", null);
	return f.dot;
});

// /datum/light_source/proc/recalc_corner  (code/modules/lighting/lighting_source.dm:195)
rt.def("/datum/light_source/proc/recalc_corner", function recalc_corner(f: Frame, C: Value) {
	let OLD: Value = null;
	f.vars = () => [OLD];
	if (!truthy(rt.sv(f, "effect_str"))) {
		rt.setSv(f, "effect_str", rt.list());
	}
	if (truthy(rt.index(rt.sv(f, "effect_str"), live(C)))) {
		f.dot = rt.neg(rt.index(rt.sv(f, "effect_str"), live(C)));
		rt.callName(f, live(C), "update_lumcount", [multiply(live(f.dot), rt.sv(f, "applied_lum_r")), multiply(live(f.dot), rt.sv(f, "applied_lum_g")), multiply(live(f.dot), rt.sv(f, "applied_lum_b"))]);
		rt.setAt(rt.sv(f, "effect_str"), live(C), 0);
	}
	f.dot = subtract(1, rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [divide(rt.op(f, "Sqrt", [], [add(add(rt.power(subtract(rt.fv(f, "x", live(C)), rt.fv(f, "x", rt.sv(f, "pixel_turf"))), 2), rt.power(subtract(rt.fv(f, "y", live(C)), rt.fv(f, "y", rt.sv(f, "pixel_turf"))), 2)), 1)]), rt.call(f, P("/proc/max"), null, [1, rt.sv(f, "light_range")])), 1])]));
	(f.dot = rt.modify(live(f.dot), rt.sv(f, "light_power"), multiply));
	OLD = rt.index(rt.sv(f, "effect_str"), live(C));
	rt.setAt(rt.sv(f, "effect_str"), live(C), live(f.dot));
	rt.callName(f, live(C), "update_lumcount", [subtract(multiply(live(f.dot), rt.sv(f, "lum_r")), multiply(live(OLD), rt.sv(f, "applied_lum_r"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_g")), multiply(live(OLD), rt.sv(f, "applied_lum_g"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_b")), multiply(live(OLD), rt.sv(f, "applied_lum_b")))]);
	if (!(truthy(rt.sv(f, "effect_str")) && !truthy(rt.len(f, rt.sv(f, "effect_str"))))) return f.dot;
	rt.setSv(f, "effect_str", null);
	return f.dot;
});

// /datum/light_source/proc/update_corners  (code/modules/lighting/lighting_source.dm:206)  may sleep
rt.def("/datum/light_source/proc/update_corners", function* update_corners(f: Frame) {
	let update: Value = null, _P: Value = null, corners: Value = null, turfs: Value = null, thing: Value = null, C: Value = null, _T: Value = null, oldlum: Value = null, L: Value = null, OLD: Value = null;
	let $e: any;
	f.vars = () => [update, _P, corners, turfs, thing, C, _T, oldlum, L, OLD, $e];
	update = 0;
	if ((!truthy(rt.sv(f, "source_atom")) || (!truthy(rt.sv(f, "source_atom")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "source_atom")))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "light_power", rt.sv(f, "source_atom")), rt.sv(f, "light_power"))) {
		rt.setSv(f, "light_power", rt.fv(f, "light_power", rt.sv(f, "source_atom")));
		update = 1;
	}
	if (!isEqual(rt.fv(f, "light_range", rt.sv(f, "source_atom")), rt.sv(f, "light_range"))) {
		rt.setSv(f, "light_range", rt.fv(f, "light_range", rt.sv(f, "source_atom")));
		update = 1;
	}
	if (!truthy(rt.sv(f, "top_atom"))) {
		rt.setSv(f, "top_atom", rt.sv(f, "source_atom"));
		update = 1;
	}
	if ((!truthy(rt.sv(f, "light_range")) || !truthy(rt.sv(f, "light_power")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "top_atom")])))) {
		if (!isEqual(rt.sv(f, "source_turf"), rt.sv(f, "top_atom"))) {
			rt.setSv(f, "source_turf", rt.sv(f, "top_atom"));
			rt.setSv(f, "pixel_turf", rt.sv(f, "source_turf"));
			update = 1;
		}
	} else {
		if (!isEqual(rt.fv(f, "loc", rt.sv(f, "top_atom")), rt.sv(f, "source_turf"))) {
			rt.setSv(f, "source_turf", rt.fv(f, "loc", rt.sv(f, "top_atom")));
			rt.setSv(f, "pixel_turf", (yield* g.call(f, P("/proc/get_turf_pixel"), null, [rt.sv(f, "top_atom")])));
			update = 1;
		} else {
			if (!isEqual((_P = (yield* g.call(f, P("/proc/get_turf_pixel"), null, [rt.sv(f, "top_atom")]))), rt.sv(f, "pixel_turf"))) {
				rt.setSv(f, "pixel_turf", live(_P));
				update = 1;
			}
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "source_turf")])))) {
		if (truthy(rt.sv(f, "applied"))) {
			yield* g.srcCall(f, "remove_lum");
		}
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "light_range")) && truthy(rt.sv(f, "light_power"))) && !truthy(rt.sv(f, "applied")))) {
		update = 1;
	}
	if (!isEqual(rt.fv(f, "light_color", rt.sv(f, "source_atom")), rt.sv(f, "light_color"))) {
		rt.setSv(f, "light_color", rt.fv(f, "light_color", rt.sv(f, "source_atom")));
		yield* g.srcCall(f, "parse_light_color");
		update = 1;
	} else {
		if (((!isEqual(rt.sv(f, "applied_lum_r"), rt.sv(f, "lum_r")) || !isEqual(rt.sv(f, "applied_lum_g"), rt.sv(f, "lum_g"))) || !isEqual(rt.sv(f, "applied_lum_b"), rt.sv(f, "lum_b")))) {
			update = 1;
		}
	}
	if (truthy(live(update))) {
		rt.setSv(f, "needs_update", 2);
		rt.setSv(f, "applied", 1);
	} else {
		if (isEqual(rt.sv(f, "needs_update"), 2)) {
			return live(f.dot);
		}
	}
	corners = rt.list();
	turfs = rt.list();
	thing = null;
	C = null;
	_T = null;
	if (truthy(rt.sv(f, "source_turf"))) {
		oldlum = rt.fv(f, "luminosity", rt.sv(f, "source_turf"));
		rt.setFv(f, "luminosity", rt.sv(f, "source_turf"), (yield* g.call(f, P("/proc/Ceiling"), null, [rt.sv(f, "light_range")])));
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [(yield* g.call(f, P("/proc/Ceiling"), null, [rt.sv(f, "light_range")])), rt.sv(f, "source_turf")])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			rt.forList(f, 1, (yield* g.callName(f, live(_T), "get_corners", [rt.sv(f, "source_turf")])));
			while (($e = rt.next(f, 1)) !== undefined) {
				thing = $e;
				if (!truthy(live(thing))) {
					continue;
				}
				C = live(thing);
				rt.setAt(live(corners), live(C), 0);
			}
			rt.endFor(f, 1);
			turfs = rt.modify(live(turfs), live(_T), add);
		}
		rt.endFor(f, 0);
		rt.setFv(f, "luminosity", rt.sv(f, "source_turf"), live(oldlum));
	}
	if (!truthy(rt.sv(f, "affecting_turfs"))) {
		rt.setSv(f, "affecting_turfs", rt.list());
	}
	rt.modSrcVar(f, "affecting_turfs", (L = subtract(live(turfs), rt.sv(f, "affecting_turfs"))), add);
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(rt.gv(f, "affecting_lights", (_T = live(thing))))) {
			rt.setFv(f, "affecting_lights", live(_T), rt.list());
		}
		rt.modField(f, live(_T), "affecting_lights", live(f.src), add);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "affecting_turfs", (L = subtract(rt.sv(f, "affecting_turfs"), live(turfs))), subtract));
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.gv(f, "affecting_lights", (_T = live(thing))))) {
			(rt.modField(f, live(_T), "affecting_lights", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "affecting_lights", live(_T))))) {
				rt.setFv(f, "affecting_lights", live(_T), null);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "effect_str"))) {
		rt.setSv(f, "effect_str", rt.list());
	}
	if (isEqual(rt.sv(f, "needs_update"), 1)) {
		rt.forList(f, 0, subtract(live(corners), rt.sv(f, "effect_str")));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (!truthy(live(thing))) {
				continue;
			}
			if (!truthy(rt.gv(f, "affecting", (C = live(thing))))) {
				rt.setFv(f, "affecting", live(C), rt.list());
			}
			rt.modField(f, live(C), "affecting", live(f.src), add);
			if (!truthy(rt.fv(f, "active", live(C)))) {
				rt.setAt(rt.sv(f, "effect_str"), live(C), 0);
				continue;
			}
			f.dot = subtract(1, (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(rt.op(f, "Sqrt", [], [add(add(rt.power(subtract(rt.fv(f, "x", live(C)), rt.fv(f, "x", rt.sv(f, "pixel_turf"))), 2), rt.power(subtract(rt.fv(f, "y", live(C)), rt.fv(f, "y", rt.sv(f, "pixel_turf"))), 2)), 1)]), (yield* g.call(f, P("/proc/max"), null, [1, rt.sv(f, "light_range")]))), 1]))])));
			(f.dot = rt.modify(live(f.dot), rt.sv(f, "light_power"), multiply));
			OLD = rt.index(rt.sv(f, "effect_str"), live(C));
			rt.setAt(rt.sv(f, "effect_str"), live(C), live(f.dot));
			yield* g.callName(f, live(C), "update_lumcount", [subtract(multiply(live(f.dot), rt.sv(f, "lum_r")), multiply(live(OLD), rt.sv(f, "applied_lum_r"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_g")), multiply(live(OLD), rt.sv(f, "applied_lum_g"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_b")), multiply(live(OLD), rt.sv(f, "applied_lum_b")))]);
		}
		rt.endFor(f, 0);
	} else {
		rt.forList(f, 0, (L = subtract(live(corners), rt.sv(f, "effect_str"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (!truthy(live(thing))) {
				continue;
			}
			if (!truthy(rt.gv(f, "affecting", (C = live(thing))))) {
				rt.setFv(f, "affecting", live(C), rt.list());
			}
			rt.modField(f, live(C), "affecting", live(f.src), add);
			if (!truthy(rt.fv(f, "active", live(C)))) {
				rt.setAt(rt.sv(f, "effect_str"), live(C), 0);
				continue;
			}
			f.dot = subtract(1, (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(rt.op(f, "Sqrt", [], [add(add(rt.power(subtract(rt.fv(f, "x", live(C)), rt.fv(f, "x", rt.sv(f, "pixel_turf"))), 2), rt.power(subtract(rt.fv(f, "y", live(C)), rt.fv(f, "y", rt.sv(f, "pixel_turf"))), 2)), 1)]), (yield* g.call(f, P("/proc/max"), null, [1, rt.sv(f, "light_range")]))), 1]))])));
			(f.dot = rt.modify(live(f.dot), rt.sv(f, "light_power"), multiply));
			OLD = rt.index(rt.sv(f, "effect_str"), live(C));
			rt.setAt(rt.sv(f, "effect_str"), live(C), live(f.dot));
			yield* g.callName(f, live(C), "update_lumcount", [subtract(multiply(live(f.dot), rt.sv(f, "lum_r")), multiply(live(OLD), rt.sv(f, "applied_lum_r"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_g")), multiply(live(OLD), rt.sv(f, "applied_lum_g"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_b")), multiply(live(OLD), rt.sv(f, "applied_lum_b")))]);
		}
		rt.endFor(f, 0);
		rt.forList(f, 0, subtract(live(corners), live(L)));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (!truthy(live(thing))) {
				continue;
			}
			if (!truthy(rt.gv(f, "active", (C = live(thing))))) {
				rt.setAt(rt.sv(f, "effect_str"), live(C), 0);
				continue;
			}
			f.dot = subtract(1, (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [divide(rt.op(f, "Sqrt", [], [add(add(rt.power(subtract(rt.fv(f, "x", live(C)), rt.fv(f, "x", rt.sv(f, "pixel_turf"))), 2), rt.power(subtract(rt.fv(f, "y", live(C)), rt.fv(f, "y", rt.sv(f, "pixel_turf"))), 2)), 1)]), (yield* g.call(f, P("/proc/max"), null, [1, rt.sv(f, "light_range")]))), 1]))])));
			(f.dot = rt.modify(live(f.dot), rt.sv(f, "light_power"), multiply));
			OLD = rt.index(rt.sv(f, "effect_str"), live(C));
			rt.setAt(rt.sv(f, "effect_str"), live(C), live(f.dot));
			yield* g.callName(f, live(C), "update_lumcount", [subtract(multiply(live(f.dot), rt.sv(f, "lum_r")), multiply(live(OLD), rt.sv(f, "applied_lum_r"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_g")), multiply(live(OLD), rt.sv(f, "applied_lum_g"))), subtract(multiply(live(f.dot), rt.sv(f, "lum_b")), multiply(live(OLD), rt.sv(f, "applied_lum_b")))]);
		}
		rt.endFor(f, 0);
	}
	rt.forList(f, 0, (L = subtract(rt.sv(f, "effect_str"), live(corners))));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (!truthy(live(thing))) {
			continue;
		}
		C = live(thing);
		f.dot = rt.neg(rt.index(rt.sv(f, "effect_str"), live(C)));
		yield* g.callName(f, live(C), "update_lumcount", [multiply(live(f.dot), rt.sv(f, "applied_lum_r")), multiply(live(f.dot), rt.sv(f, "applied_lum_g")), multiply(live(f.dot), rt.sv(f, "applied_lum_b"))]);
		if (truthy(rt.fv(f, "affecting", live(C)))) {
			(rt.modField(f, live(C), "affecting", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "affecting", live(C))))) {
				rt.setFv(f, "affecting", live(C), null);
			}
		}
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "effect_str", live(L), subtract));
	rt.setSv(f, "applied_lum_r", rt.sv(f, "lum_r"));
	rt.setSv(f, "applied_lum_g", rt.sv(f, "lum_g"));
	rt.setSv(f, "applied_lum_b", rt.sv(f, "lum_b"));
	if ((truthy(rt.sv(f, "effect_str")) && !truthy(rt.len(f, rt.sv(f, "effect_str"))))) {
		rt.setSv(f, "effect_str", null);
	}
	if (!(truthy(rt.sv(f, "affecting_turfs")) && !truthy(rt.len(f, rt.sv(f, "affecting_turfs"))))) return f.dot;
	rt.setSv(f, "affecting_turfs", null);
	return f.dot;
}, true);
