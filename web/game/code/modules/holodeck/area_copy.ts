// Based on /tg/station's code/modules/holodeck/area_copy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// area_copy.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalduplicate_forbidden_vars", function InitGlobalduplicate_forbidden_vars(f: Frame) {
	GLOB.duplicate_forbidden_vars = list("tag", "area", "type", "loc", "locs", "vars", "parent", "parent_type", "verbs", "ckey", "key", "power_supply", "contents", "reagents", "stat", "x", "y", "z", "group", "atmos_adjacent_turfs");
	this.gvars_datum_init_order += "duplicate_forbidden_vars";
	return f.dot;
});

// area_copy.dm:5
rt.def("/proc/DuplicateObject", function* DuplicateObject(f: Frame, original: Value, perfectcopy: Value, sameloc: Value, newloc: Value, nerf: Value, holoitem: Value) {
	let O: Value = null, V: Value = null, L: Value = null, N: Value = null, I: Value = null, M: Value = null;
	perfectcopy ??= 1;
	sameloc ??= 0;
	nerf ??= 0;
	holoitem ??= 0;
	if (!original) {
		return null;
	}
	if (sameloc) {
		O = (yield* new_(original.type, original.loc));
	} else {
		O = (yield* new_(original.type, newloc));
	}
	if (perfectcopy && O && original) {
		for (V of each(original.vars - GLOB.duplicate_forbidden_vars)) {
			if (rt.istype(rt.index(original.vars, V), T("/list"))) {
				L = rt.index(original.vars, V);
				rt.setAt(O.vars, V, (yield* L.Copy()));
			} else {
				if (rt.istype(rt.index(original.vars, V), T("/datum"))) {
					continue;
				}
				rt.setAt(O.vars, V, rt.index(original.vars, V));
			}
		}
	}
	if (rt.istype(O, T("/obj"))) {
		N = O;
		if (holoitem) {
			N.resistance_flags = 51;
		}
		if (nerf && rt.istype(O, T("/obj/item"))) {
			(I = O).damtype = "stamina";
		}
		yield* N.update_icon();
		if (rt.istype(O, T("/obj/machinery"))) {
			yield* (M = O).power_change();
		}
	}
	if (holoitem) {
		if (!O.secondary_flags) {
			O.secondary_flags = list();
		}
		rt.setAt(O.secondary_flags, "hologram", 1);
	}
	return O;
}, true);

// area_copy.dm:50
rt.def("/area/proc/copy_contents_to", function* copy_contents_to(f: Frame, A: Value, platingRequired: Value, nerf_weapons: Value) {
	let _T: Value = null, _T_8: Value = null, _T_10: Value = null, coordstring: Value = null, B: Value = null, old_dir1: Value = null, old_icon_state1: Value = null, old_icon1: Value = null, O: Value = null, O2: Value = null, M: Value = null, SM: Value = null, V: Value = null, O1: Value = null, O2_18: Value = null, T1: Value = null;
	platingRequired ??= 0;
	nerf_weapons ??= 0;
	if (!A || !this) {
		return 0;
	}
	let turfs_src: Value = get_area_turfs(this.type);
	let turfs_trg: Value = get_area_turfs(A.type);
	let src_min_x: Value = 99999;
	let src_min_y: Value = 99999;
	let refined_src: Value = (yield* new_(T("/list")));
	for (_T of each(turfs_src, T("/turf"))) {
		src_min_x = min(src_min_x, _T.x);
		src_min_y = min(src_min_y, _T.y);
	}
	_T = null;
	for (_T of each(turfs_src, T("/turf"))) {
		rt.setAt(refined_src, _T, `${_T.x - src_min_x}.${_T.y - src_min_y}`);
	}
	let trg_min_x: Value = 99999;
	let trg_min_y: Value = 99999;
	let refined_trg: Value = (yield* new_(T("/list")));
	for (_T_8 of each(turfs_trg, T("/turf"))) {
		trg_min_x = min(trg_min_x, _T_8.x);
		trg_min_y = min(trg_min_y, _T_8.y);
	}
	_T_8 = null;
	for (_T_8 of each(turfs_trg, T("/turf"))) {
		rt.setAt(refined_trg, `${_T_8.x - trg_min_x}.${_T_8.y - trg_min_y}`, _T_8);
	}
	let toupdate: Value = (yield* new_(T("/list")));
	let copiedobjs: Value = list();
	for (_T_10 of each(refined_src, T("/turf"))) {
		coordstring = rt.index(refined_src, _T_10);
		if (!rt.istype((B = rt.index(refined_trg, coordstring)), T("/turf"))) {
			continue;
		}
		if (platingRequired) {
			if (rt.istype(B, T("/turf/open/space"))) {
				continue;
			}
		}
		old_dir1 = _T_10.dir;
		old_icon_state1 = _T_10.icon_state;
		old_icon1 = _T_10.icon;
		yield* (B = (yield* B.ChangeTurf(_T_10.type))).setDir(old_dir1);
		B.icon = old_icon1;
		B.icon_state = old_icon_state1;
		O = null;
		for (O of each(_T_10, T("/obj"))) {
			if (!(O2 = (yield* DuplicateObject(O, { perfectcopy: 1, newloc: B, nerf: nerf_weapons, holoitem: 1 })))) {
				continue;
			}
			copiedobjs += O2.GetAllContents();
		}
		M = null;
		for (M of each(_T_10, T("/mob"))) {
			if (rt.istype(M, T("/mob/camera"))) {
				continue;
			}
			copiedobjs += (SM = (yield* DuplicateObject(M, { perfectcopy: 1, newloc: B, holoitem: 1 }))).GetAllContents();
		}
		V = null;
		for (V of each(_T_10.vars - GLOB.duplicate_forbidden_vars)) {
			if (V == "air") {
				O1 = B;
				O2_18 = _T_10;
				O1.air.copy_from(O2_18.return_air());
				continue;
			}
			rt.setAt(B.vars, V, rt.index(_T_10.vars, V));
		}
		toupdate += B;
	}
	if (rt.len(f, toupdate)) {
		for (T1 of each(toupdate, T("/turf"))) {
			T1.CalculateAdjacentTurfs();
			GLOB.SSair.add_to_active(T1, 1);
		}
	}
	return copiedobjs;
}, true);
