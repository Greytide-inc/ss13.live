// From code/modules/lighting/lighting_object.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalall_lighting_objects  (code/modules/lighting/lighting_object.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_lighting_objects", function InitGlobalall_lighting_objects(f: Frame) {
	rt.setGl("all_lighting_objects", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_lighting_objects", add);
	return f.dot;
});

rt.type(4805, "/atom/movable/lighting_object", "/atom/movable", {
	needs_update: 0,
	anchored: 1,
	name: "",
	icon: rt.rsc("icons/effects/lighting_object.dmi"),
	icon_state: "transparent",
	color: null,
	plane: 15,
	mouse_opacity: 0,
	layer: 15,
	invisibility: 20,
	blend_mode: 2,
});

// /atom/movable/lighting_object/proc/Initialize  (code/modules/lighting/lighting_object.dm:21)
rt.def("/atom/movable/lighting_object/proc/Initialize", function Initialize(f: Frame) {
	let _T: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [_T, S, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, rt.sv(f, "verbs"), "Cut", []);
	rt.setFv(f, "lighting_object", (_T = rt.sv(f, "loc")), live(f.src));
	rt.setFv(f, "luminosity", live(_T), 0);
	S = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(f.src)), 1), 1]), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(f.src)), 1), 1]), rt.fv(f, "z", live(f.src))), rt.locate(rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(f.src)), 1), rt.fv(f, "maxx", rt.world())]), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(f.src)), 1), rt.fv(f, "maxy", rt.world())]), rt.fv(f, "z", live(f.src)))]), T("/turf/open/space"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.callName(f, live(S), "update_starlight", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "needs_update", 1);
	rt.modGl("lighting_update_objects", live(f.src), add);
	return f.dot;
}, false, { args: ["mapload"] });

// /atom/movable/lighting_object/proc/Destroy  (code/modules/lighting/lighting_object.dm:37)  may sleep
rt.def("/atom/movable/lighting_object/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(live(f.args[0]))) {
		(rt.modGl("lighting_update_objects", live(f.src), subtract));
		if (truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) {
			rt.setFv(f, "lighting_object", live(_T), null);
			rt.setFv(f, "luminosity", live(_T), 1);
		}
		return (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

// /atom/movable/lighting_object/proc/update  (code/modules/lighting/lighting_object.dm:50)  may sleep
rt.def("/atom/movable/lighting_object/proc/update", function* update(f: Frame) {
	let _T: Value = null, corners: Value = null, cr: Value = null, cg: Value = null, cb: Value = null, ca: Value = null, max: Value = null, rr: Value = null, rg: Value = null, rb: Value = null, gr: Value = null, gg: Value = null, gb: Value = null, br: Value = null, bg: Value = null, bb: Value = null, ar: Value = null, ag: Value = null, ab: Value = null, set_luminosity: Value = null;
	f.vars = () => [_T, corners, cr, cg, cb, ca, max, rr, rg, rb, gr, gg, gb, br, bg, bb, ar, ag, ab, set_luminosity];
	if (!truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "loc"))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("A lighting object realised its loc was NOT a turf (actual loc: ＀, ＀) in update()!", [rt.sv(f, "loc"), rt.fv(f, "type", rt.sv(f, "loc"))])]);
		} else {
			yield* g.call(f, P("/proc/warning"), null, ["A lighting object realised it was in nullspace in update()!"]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src), 1]);
		return live(f.dot);
	}
	corners = rt.fv(f, "corners", live(_T));
	cr = rt.gl("dummy_lighting_corner");
	cg = rt.gl("dummy_lighting_corner");
	cb = rt.gl("dummy_lighting_corner");
	ca = rt.gl("dummy_lighting_corner");
	if (truthy(live(corners))) {
		cr = (rt.index(live(corners), 3) || rt.gl("dummy_lighting_corner"));
		cg = (rt.index(live(corners), 2) || rt.gl("dummy_lighting_corner"));
		cb = (rt.index(live(corners), 4) || rt.gl("dummy_lighting_corner"));
		ca = (rt.index(live(corners), 1) || rt.gl("dummy_lighting_corner"));
	}
	max = (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "cache_mx", live(cr)), rt.fv(f, "cache_mx", live(cg)), rt.fv(f, "cache_mx", live(cb)), rt.fv(f, "cache_mx", live(ca))]));
	rr = rt.fv(f, "cache_r", live(cr));
	rg = rt.fv(f, "cache_g", live(cr));
	rb = rt.fv(f, "cache_b", live(cr));
	gr = rt.fv(f, "cache_r", live(cg));
	gg = rt.fv(f, "cache_g", live(cg));
	gb = rt.fv(f, "cache_b", live(cg));
	br = rt.fv(f, "cache_r", live(cb));
	bg = rt.fv(f, "cache_g", live(cb));
	bb = rt.fv(f, "cache_b", live(cb));
	ar = rt.fv(f, "cache_r", live(ca));
	ag = rt.fv(f, "cache_g", live(ca));
	ab = rt.fv(f, "cache_b", live(ca));
	set_luminosity = (rt.gt(live(max), 9.999999974752427e-7) ? 1 : 0);
	if ((truthy(rt.bitAnd(rt.bitAnd(rt.bitAnd(live(rr), live(gr)), live(br)), live(ar))) && isEqual(add(add(add(add(add(add(add(live(rg), live(gg)), live(bg)), live(ag)), live(rb)), live(gb)), live(bb)), live(ab)), 8))) {
		rt.setSv(f, "icon_state", "transparent");
		rt.setSv(f, "color", null);
	} else {
		if (!truthy(live(set_luminosity))) {
			rt.setSv(f, "icon_state", "dark");
			rt.setSv(f, "color", null);
		} else {
			rt.setSv(f, "icon_state", null);
			rt.setSv(f, "color", rt.list(live(rr), live(rg), live(rb), 0, live(gr), live(gg), live(gb), 0, live(br), live(bg), live(bb), 0, live(ar), live(ag), live(ab), 0, 0, 0, 0, 1));
		}
	}
	rt.setSv(f, "luminosity", live(set_luminosity));
	return f.dot;
}, true);

// /atom/movable/lighting_object/proc/forceMove  (code/modules/lighting/lighting_object.dm:149)  may sleep
rt.def("/atom/movable/lighting_object/proc/forceMove", function* forceMove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["destination", "no_tp", "harderforce"] });
