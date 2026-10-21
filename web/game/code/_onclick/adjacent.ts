// From code/_onclick/adjacent.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /area/proc/Adjacent  (code/_onclick/adjacent.dm:18)
rt.def("/area/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value) {
	rt.call(f, P("/proc/CRASH"), null, ["Call to /area/Adjacent(), unimplemented proc"]);
	return f.dot;
});

// /turf/proc/Adjacent  (code/_onclick/adjacent.dm:29)
rt.def("/turf/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value, target: Value) {
	let T0: Value = null, in_dir: Value = null, d1: Value = null, d2: Value = null, d: Value = null, T1: Value = null;
	let $e: any;
	f.vars = () => [target, T0, in_dir, d1, d2, d, T1, $e];
	if (live(target) === null) {
		target = null;
	}
	if (isEqual((T0 = rt.getStep(f, live(neighbor), 0)), live(f.src))) {
		return 1;
	}
	if (rt.gt(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(T0)]), 1)) {
		return 0;
	}
	if ((isEqual(rt.fv(f, "x", live(T0)), rt.sv(f, "x")) || isEqual(rt.fv(f, "y", live(T0)), rt.sv(f, "y")))) {
		return (rt.callName(f, live(T0), "ClickCross", [null, rt.getDir(f, live(T0), live(f.src)), "border_only", 1, "target_atom", live(target)], rt.Args.Named) && rt.callName(f, live(f.src), "ClickCross", [null, rt.getDir(f, live(f.src), live(T0)), "border_only", 1, "target_atom", live(target)], rt.Args.Named));
	}
	in_dir = rt.getDir(f, live(T0), live(f.src));
	d1 = rt.bitAnd(live(in_dir), 3);
	d2 = rt.bitAnd(live(in_dir), 12);
	d = null;
	rt.forList(f, 0, rt.list(live(d1), live(d2)));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		if (!truthy(rt.callName(f, live(T0), "ClickCross", [null, live(d), "border_only", 1, "target_atom", live(target)], rt.Args.Named))) {
			continue;
		}
		if (((!truthy((T1 = rt.getStep(f, live(T0), live(d)))) || truthy(rt.fv(f, "density", live(T1)))) || !truthy(rt.callName(f, live(T1), "ClickCross", [null, rt.bitOr(rt.getDir(f, live(T1), live(T0)), rt.getDir(f, live(T1), live(f.src))), "border_only", 0, "target_atom", live(target)], rt.Args.Named)))) {
			continue;
		}
		if (!truthy(rt.callName(f, live(f.src), "ClickCross", [null, rt.getDir(f, live(f.src), live(T1)), "border_only", 1, "target_atom", live(target)], rt.Args.Named))) {
			continue;
		}
		return 1;
	}
	rt.endFor(f, 0);
	return 0;
});

// /atom/movable/proc/Adjacent  (code/_onclick/adjacent.dm:67)
rt.def("/atom/movable/proc/Adjacent", function Adjacent(f: Frame, neighbor: Value) {
	if (isEqual(live(neighbor), rt.sv(f, "loc"))) {
		return 1;
	}
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) {
		return 0;
	}
	if (truthy(rt.callName(f, rt.sv(f, "loc"), "Adjacent", [null, live(neighbor), "target", live(neighbor)], rt.Args.Named))) {
		return 1;
	}
	return 0;
});

// /obj/item/proc/Adjacent  (code/_onclick/adjacent.dm:77)
rt.def("/obj/item/proc/Adjacent", function Adjacent(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (isEqual(live(f.args[0]), rt.sv(f, "loc"))) {
		return 1;
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item")) ? 1 : 0))) {
		if (rt.gt(live(f.args[1]), 0)) {
			return rt.callName(f, rt.sv(f, "loc"), "Adjacent", [live(f.args[0]), subtract(live(f.args[1]), 1)]);
		}
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["neighbor", "recurse"] });

// /turf/proc/ClickCross  (code/_onclick/adjacent.dm:90)
rt.def("/turf/proc/ClickCross", function ClickCross(f: Frame, target_dir: Value, border_only: Value, target_atom: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [target_atom, O, $e];
	if (live(target_atom) === null) {
		target_atom = null;
	}
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (((!truthy(rt.fv(f, "density", live(O))) || isEqual(live(O), live(target_atom))) || truthy(rt.bitAnd(rt.fv(f, "pass_flags", live(O)), 32)))) {
			continue;
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(O)), 512))) {
			if ((truthy(rt.bitAnd(rt.fv(f, "dir", live(O)), live(target_dir))) || truthy(rt.bitAnd(rt.fv(f, "dir", live(O)), subtract(rt.fv(f, "dir", live(O)), 1))))) {
				return 0;
			}
		} else {
			if (!truthy(live(border_only))) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
});
