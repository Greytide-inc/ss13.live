// From code/modules/holodeck/area_copy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalduplicate_forbidden_vars  (code/modules/holodeck/area_copy.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalduplicate_forbidden_vars", function InitGlobalduplicate_forbidden_vars(f: Frame) {
	rt.setGl("duplicate_forbidden_vars", rt.list("tag", "area", "type", "loc", "locs", "vars", "parent", "parent_type", "verbs", "ckey", "key", "power_supply", "contents", "reagents", "stat", "x", "y", "z", "group", "atmos_adjacent_turfs"));
	rt.modSrcVar(f, "gvars_datum_init_order", "duplicate_forbidden_vars", add);
	return f.dot;
});

// /proc/DuplicateObject  (code/modules/holodeck/area_copy.dm:5)  may sleep
rt.def("/proc/DuplicateObject", function* DuplicateObject(f: Frame, original: Value, perfectcopy: Value, sameloc: Value, newloc: Value, nerf: Value, holoitem: Value) {
	let O: Value = null, V: Value = null, L: Value = null, N: Value = null, I: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [original, perfectcopy, sameloc, newloc, nerf, holoitem, O, V, L, N, I, M, $e];
	if (live(perfectcopy) === null) {
		perfectcopy = 1;
	}
	if (live(sameloc) === null) {
		sameloc = 0;
	}
	if (live(newloc) === null) {
		newloc = null;
	}
	if (live(nerf) === null) {
		nerf = 0;
	}
	if (live(holoitem) === null) {
		holoitem = 0;
	}
	if (!truthy(live(original))) {
		return null;
	}
	O = null;
	if (truthy(live(sameloc))) {
		O = (yield* g.new_(f, rt.fv(f, "type", live(original)), [rt.fv(f, "loc", live(original))]));
	} else {
		O = (yield* g.new_(f, rt.fv(f, "type", live(original)), [live(newloc)]));
	}
	if (((truthy(live(perfectcopy)) && truthy(live(O))) && truthy(live(original)))) {
		V = null;
		rt.forList(f, 0, subtract(rt.fv(f, "vars", live(original)), rt.gl("duplicate_forbidden_vars")));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if (truthy((rt.istype(rt.index(rt.fv(f, "vars", live(original)), live(V)), T("/list")) ? 1 : 0))) {
				L = rt.index(rt.fv(f, "vars", live(original)), live(V));
				rt.setAt(rt.fv(f, "vars", live(O)), live(V), (yield* g.callName(f, live(L), "Copy", [])));
			} else {
				if (truthy((rt.istype(rt.index(rt.fv(f, "vars", live(original)), live(V)), T("/datum")) ? 1 : 0))) {
					continue;
				}
				rt.setAt(rt.fv(f, "vars", live(O)), live(V), rt.index(rt.fv(f, "vars", live(original)), live(V)));
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy((rt.istype(live(O), T("/obj")) ? 1 : 0))) {
		N = live(O);
		if (truthy(live(holoitem))) {
			rt.setFv(f, "resistance_flags", live(N), 51);
		}
		if ((truthy(live(nerf)) && truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0)))) {
			rt.setFv(f, "damtype", (I = live(O)), "stamina");
		}
		yield* g.callName(f, live(N), "update_icon", []);
		if (truthy((rt.istype(live(O), T("/obj/machinery")) ? 1 : 0))) {
			yield* g.callName(f, (M = live(O)), "power_change", []);
		}
	}
	if (truthy(live(holoitem))) {
		if (!truthy(rt.fv(f, "secondary_flags", live(O)))) {
			rt.setFv(f, "secondary_flags", live(O), rt.list());
		}
		rt.setAt(rt.fv(f, "secondary_flags", live(O)), "hologram", 1);
	}
	return live(O);
}, true);

// /area/proc/copy_contents_to  (code/modules/holodeck/area_copy.dm:50)  may sleep
rt.def("/area/proc/copy_contents_to", function* copy_contents_to(f: Frame, A: Value, platingRequired: Value, nerf_weapons: Value) {
	let turfs_src: Value = null, turfs_trg: Value = null, src_min_x: Value = null, src_min_y: Value = null, refined_src: Value = null, _T: Value = null, trg_min_x: Value = null, trg_min_y: Value = null, refined_trg: Value = null, _T_8: Value = null, toupdate: Value = null, copiedobjs: Value = null, _T_10: Value = null, coordstring: Value = null, B: Value = null, old_dir1: Value = null, old_icon_state1: Value = null, old_icon1: Value = null, O: Value = null, O2: Value = null, M: Value = null, SM: Value = null, V: Value = null, O1: Value = null, O2_18: Value = null, T1: Value = null;
	let $e: any;
	f.vars = () => [A, platingRequired, nerf_weapons, turfs_src, turfs_trg, src_min_x, src_min_y, refined_src, _T, trg_min_x, trg_min_y, refined_trg, _T_8, toupdate, copiedobjs, _T_10, coordstring, B, old_dir1, old_icon_state1, old_icon1, O, O2, M, SM, V, O1, O2_18, T1, $e];
	if (live(platingRequired) === null) {
		platingRequired = 0;
	}
	if (live(nerf_weapons) === null) {
		nerf_weapons = 0;
	}
	if ((!truthy(live(A)) || !truthy(live(f.src)))) {
		return 0;
	}
	turfs_src = (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(f.src))]));
	turfs_trg = (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(A))]));
	src_min_x = 99999;
	src_min_y = 99999;
	refined_src = (yield* g.new_(f, T("/list"), []));
	_T = null;
	rt.forList(f, 0, live(turfs_src), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		src_min_x = (yield* g.call(f, P("/proc/min"), null, [live(src_min_x), rt.fv(f, "x", live(_T))]));
		src_min_y = (yield* g.call(f, P("/proc/min"), null, [live(src_min_y), rt.fv(f, "y", live(_T))]));
	}
	rt.endFor(f, 0);
	_T = null;
	rt.forList(f, 0, live(turfs_src), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.setAt(live(refined_src), live(_T), fmt("＀.＀", [subtract(rt.fv(f, "x", live(_T)), live(src_min_x)), subtract(rt.fv(f, "y", live(_T)), live(src_min_y))]));
	}
	rt.endFor(f, 0);
	trg_min_x = 99999;
	trg_min_y = 99999;
	refined_trg = (yield* g.new_(f, T("/list"), []));
	_T_8 = null;
	rt.forList(f, 0, live(turfs_trg), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T_8 = $e;
		trg_min_x = (yield* g.call(f, P("/proc/min"), null, [live(trg_min_x), rt.fv(f, "x", live(_T_8))]));
		trg_min_y = (yield* g.call(f, P("/proc/min"), null, [live(trg_min_y), rt.fv(f, "y", live(_T_8))]));
	}
	rt.endFor(f, 0);
	_T_8 = null;
	rt.forList(f, 0, live(turfs_trg), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T_8 = $e;
		rt.setAt(live(refined_trg), fmt("＀.＀", [subtract(rt.fv(f, "x", live(_T_8)), live(trg_min_x)), subtract(rt.fv(f, "y", live(_T_8)), live(trg_min_y))]), live(_T_8));
	}
	rt.endFor(f, 0);
	toupdate = (yield* g.new_(f, T("/list"), []));
	copiedobjs = rt.list();
	_T_10 = null;
	rt.forList(f, 0, live(refined_src), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T_10 = $e;
		coordstring = rt.index(live(refined_src), live(_T_10));
		if (!truthy((rt.istype((B = rt.index(live(refined_trg), live(coordstring))), T("/turf")) ? 1 : 0))) {
			continue;
		}
		if (truthy(live(platingRequired))) {
			if (truthy((rt.istype(live(B), T("/turf/open/space")) ? 1 : 0))) {
				continue;
			}
		}
		old_dir1 = rt.fv(f, "dir", live(_T_10));
		old_icon_state1 = rt.fv(f, "icon_state", live(_T_10));
		old_icon1 = rt.fv(f, "icon", live(_T_10));
		yield* g.callName(f, (B = (yield* g.callName(f, live(B), "ChangeTurf", [rt.fv(f, "type", live(_T_10))]))), "setDir", [live(old_dir1)]);
		rt.setFv(f, "icon", live(B), live(old_icon1));
		rt.setFv(f, "icon_state", live(B), live(old_icon_state1));
		O = null;
		rt.forList(f, 1, live(_T_10), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (!truthy((O2 = (yield* g.call(f, P("/proc/DuplicateObject"), null, [null, live(O), "perfectcopy", 1, "newloc", live(B), "nerf", live(nerf_weapons), "holoitem", 1], rt.Args.Named))))) {
				continue;
			}
			copiedobjs = rt.modify(live(copiedobjs), (yield* g.callName(f, live(O2), "GetAllContents", [])), add);
		}
		rt.endFor(f, 1);
		M = null;
		rt.forList(f, 1, live(_T_10), T("/mob"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			if (truthy((rt.istype(live(M), T("/mob/camera")) ? 1 : 0))) {
				continue;
			}
			copiedobjs = rt.modify(live(copiedobjs), (yield* g.callName(f, (SM = (yield* g.call(f, P("/proc/DuplicateObject"), null, [null, live(M), "perfectcopy", 1, "newloc", live(B), "holoitem", 1], rt.Args.Named))), "GetAllContents", [])), add);
		}
		rt.endFor(f, 1);
		V = null;
		rt.forList(f, 1, subtract(rt.fv(f, "vars", live(_T_10)), rt.gl("duplicate_forbidden_vars")));
		while (($e = rt.next(f, 1)) !== undefined) {
			V = $e;
			if (isEqual(live(V), "air")) {
				O1 = live(B);
				O2_18 = live(_T_10);
				yield* g.callName(f, rt.fv(f, "air", live(O1)), "copy_from", [(yield* g.callName(f, live(O2_18), "return_air", []))]);
				continue;
			}
			rt.setAt(rt.fv(f, "vars", live(B)), live(V), rt.index(rt.fv(f, "vars", live(_T_10)), live(V)));
		}
		rt.endFor(f, 1);
		toupdate = rt.modify(live(toupdate), live(B), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(toupdate)))) {
		T1 = null;
		rt.forList(f, 0, live(toupdate), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			T1 = $e;
			yield* g.callName(f, live(T1), "CalculateAdjacentTurfs", []);
			yield* g.callName(f, rt.gl("SSair"), "add_to_active", [live(T1), 1]);
		}
		rt.endFor(f, 0);
	}
	return live(copiedobjs);
}, true);
