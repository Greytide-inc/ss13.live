// From code/modules/lighting/lighting_corner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalLIGHTING_CORNER_DIAGONAL  (code/modules/lighting/lighting_corner.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalLIGHTING_CORNER_DIAGONAL", function InitGlobalLIGHTING_CORNER_DIAGONAL(f: Frame) {
	rt.setGl("LIGHTING_CORNER_DIAGONAL", rt.list(5, 6, 10, 9));
	rt.modSrcVar(f, "gvars_datum_init_order", "LIGHTING_CORNER_DIAGONAL", add);
	return f.dot;
});

rt.type(2802, "/datum/lighting_corner", "/datum", {
	masters: null,
	affecting: null,
	active: 0,
	x: 0,
	y: 0,
	z: 0,
	lum_r: 0,
	lum_g: 0,
	lum_b: 0,
	needs_update: 0,
	cache_r: 0,
	cache_g: 0,
	cache_b: 0,
	cache_mx: 0,
});

// /datum/lighting_corner/proc/New  (code/modules/lighting/lighting_corner.dm:29)
rt.def("/datum/lighting_corner/proc/New", function New(f: Frame) {
	let vertical: Value = null, horizontal: Value = null, _T: Value = null, i: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [vertical, horizontal, _T, i, $0, $1, $2, $3];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "masters", rt.list());
	rt.setAt(rt.sv(f, "masters"), live(f.args[0]), rt.call(f, P("/proc/turn"), null, [live(f.args[1]), 180]));
	rt.setSv(f, "z", rt.fv(f, "z", live(f.args[0])));
	vertical = rt.bitAnd(live(f.args[1]), rt.op(f, "BitNot", [], [subtract(live(f.args[1]), 1)]));
	horizontal = rt.bitAnd(live(f.args[1]), rt.op(f, "BitNot", [], [live(vertical)]));
	$0 = rt.fv(f, "x", live(f.args[0]));
	if (isEqual(live(horizontal), 4)) {
		$1 = 0.5;
	} else {
		$1 = -0.5;
	}
	rt.setSv(f, "x", add($0, $1));
	$0 = rt.fv(f, "y", live(f.args[0]));
	if (isEqual(live(vertical), 1)) {
		$1 = 0.5;
	} else {
		$1 = -0.5;
	}
	rt.setSv(f, "y", add($0, $1));
	_T = null;
	i = null;
	if (truthy((_T = rt.getStep(f, live(f.args[0]), live(f.args[1]))))) {
		if (!truthy(rt.fv(f, "corners", live(_T)))) {
			rt.setFv(f, "corners", live(_T), rt.list(null, null, null, null));
		}
		rt.setAt(rt.sv(f, "masters"), live(_T), live(f.args[1]));
		i = rt.callName(f, rt.gl("LIGHTING_CORNER_DIAGONAL"), "Find", [rt.call(f, P("/proc/turn"), null, [live(f.args[1]), 180])]);
		rt.setAt(rt.fv(f, "corners", live(_T)), live(i), live(f.src));
	}
	if (truthy((_T = rt.getStep(f, live(f.args[0]), live(horizontal))))) {
		if (!truthy(rt.fv(f, "corners", live(_T)))) {
			rt.setFv(f, "corners", live(_T), rt.list(null, null, null, null));
		}
		$0 = rt.sv(f, "masters");
		$1 = live(_T);
		if (rt.gt(rt.fv(f, "x", live(_T)), rt.sv(f, "x"))) {
			$2 = 4;
		} else {
			$2 = 8;
		}
		if (rt.gt(rt.fv(f, "y", live(_T)), rt.sv(f, "y"))) {
			$3 = 1;
		} else {
			$3 = 2;
		}
		rt.setAt($0, $1, rt.bitOr($2, $3));
		i = rt.callName(f, rt.gl("LIGHTING_CORNER_DIAGONAL"), "Find", [rt.call(f, P("/proc/turn"), null, [rt.index(rt.sv(f, "masters"), live(_T)), 180])]);
		rt.setAt(rt.fv(f, "corners", live(_T)), live(i), live(f.src));
	}
	if (truthy((_T = rt.getStep(f, live(f.args[0]), live(vertical))))) {
		if (!truthy(rt.fv(f, "corners", live(_T)))) {
			rt.setFv(f, "corners", live(_T), rt.list(null, null, null, null));
		}
		$0 = rt.sv(f, "masters");
		$1 = live(_T);
		if (rt.gt(rt.fv(f, "x", live(_T)), rt.sv(f, "x"))) {
			$2 = 4;
		} else {
			$2 = 8;
		}
		if (rt.gt(rt.fv(f, "y", live(_T)), rt.sv(f, "y"))) {
			$3 = 1;
		} else {
			$3 = 2;
		}
		rt.setAt($0, $1, rt.bitOr($2, $3));
		i = rt.callName(f, rt.gl("LIGHTING_CORNER_DIAGONAL"), "Find", [rt.call(f, P("/proc/turn"), null, [rt.index(rt.sv(f, "masters"), live(_T)), 180])]);
		rt.setAt(rt.fv(f, "corners", live(_T)), live(i), live(f.src));
	}
	rt.callSrc(f, "update_active", []);
	return f.dot;
}, false, { args: ["new_turf", "diagonal"] });

// /datum/lighting_corner/proc/update_active  (code/modules/lighting/lighting_corner.dm:82)
rt.def("/datum/lighting_corner/proc/update_active", function update_active(f: Frame) {
	let _T: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [_T, thing, $e];
	rt.setSv(f, "active", 0);
	_T = null;
	thing = null;
	rt.forList(f, 0, rt.sv(f, "masters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.gv(f, "lighting_object", (_T = live(thing))))) {
			rt.setSv(f, "active", 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/lighting_corner/proc/update_lumcount  (code/modules/lighting/lighting_corner.dm:89)
rt.def("/datum/lighting_corner/proc/update_lumcount", function update_lumcount(f: Frame, delta_r: Value, delta_g: Value, delta_b: Value) {
	rt.modSrcVar(f, "lum_r", live(delta_r), add);
	rt.modSrcVar(f, "lum_g", live(delta_g), add);
	rt.modSrcVar(f, "lum_b", live(delta_b), add);
	if (truthy(rt.sv(f, "needs_update"))) return f.dot;
	rt.setSv(f, "needs_update", 1);
	rt.modGl("lighting_update_corners", live(f.src), add);
	return f.dot;
});

// /datum/lighting_corner/proc/update_objects  (code/modules/lighting/lighting_corner.dm:102)
rt.def("/datum/lighting_corner/proc/update_objects", function update_objects(f: Frame) {
	let lum_r: Value = null, lum_g: Value = null, lum_b: Value = null, mx: Value = null, TT: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [lum_r, lum_g, lum_b, mx, TT, _T, $e];
	lum_r = rt.fv(f, "lum_r", live(f.src));
	lum_g = rt.fv(f, "lum_g", live(f.src));
	lum_b = rt.fv(f, "lum_b", live(f.src));
	mx = rt.call(f, P("/proc/max"), null, [live(lum_r), live(lum_g), live(lum_b)]);
	f.dot = 1;
	if (rt.gt(live(mx), 1)) {
		f.dot = divide(1, live(mx));
	}
	rt.setSv(f, "cache_r", rt.call(f, P("/proc/round"), null, [multiply(live(lum_r), live(f.dot)), 0.015625]));
	rt.setSv(f, "cache_g", rt.call(f, P("/proc/round"), null, [multiply(live(lum_g), live(f.dot)), 0.015625]));
	rt.setSv(f, "cache_b", rt.call(f, P("/proc/round"), null, [multiply(live(lum_b), live(f.dot)), 0.015625]));
	rt.setSv(f, "cache_mx", rt.call(f, P("/proc/round"), null, [live(mx), 0.015625]));
	TT = null;
	rt.forList(f, 0, rt.sv(f, "masters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		TT = $e;
		if (truthy(rt.gv(f, "lighting_object", (_T = live(TT))))) {
			if (!truthy(rt.gv(f, "needs_update", rt.fv(f, "lighting_object", live(_T))))) {
				rt.setFv(f, "needs_update", rt.fv(f, "lighting_object", live(_T)), 1);
				rt.modGl("lighting_update_objects", rt.fv(f, "lighting_object", live(_T)), add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/lighting_corner/proc/Destroy  (code/modules/lighting/lighting_corner.dm:134)  may sleep
rt.def("/datum/lighting_corner/proc/Destroy", function* Destroy(f: Frame) {
	if (!truthy(live(f.args[0]))) {
		return 1;
	}
	yield* g.call(f, P("/proc/stack_trace"), null, ["Ok, Look, TG, I need you to find whatever fucker decided to call qdel on a fucking lighting corner, then tell him very nicely and politely that he is 100% retarded and needs his head checked. Thanks. Send them my regards by the way."]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["force"] });
