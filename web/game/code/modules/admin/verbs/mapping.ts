// From code/modules/admin/verbs/mapping.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug_mapping  (code/modules/admin/verbs/mapping.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug_mapping", function InitGlobaladmin_verbs_debug_mapping(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_debug_mapping", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug_mapping  (code/modules/admin/verbs/mapping.dm:23)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug_mapping", function InitGlobaladmin_verbs_debug_mapping(f: Frame) {
	rt.setGl("admin_verbs_debug_mapping", rt.list(P("/client/proc/camera_view"), P("/client/proc/sec_camera_report"), P("/client/proc/intercom_view"), P("/client/proc/air_status"), P("/client/proc/Cell"), P("/client/proc/atmosscan"), P("/client/proc/powerdebug"), P("/client/proc/count_objects_on_z_level"), P("/client/proc/count_objects_all"), P("/client/proc/cmd_assume_direct_control"), P("/client/proc/startSinglo"), P("/client/proc/set_server_fps"), P("/client/proc/cmd_admin_grantfullaccess"), P("/client/proc/cmd_admin_areatest"), P("/client/proc/cmd_admin_rejuvenate"), P("/datum/admins/proc/show_traitor_panel"), P("/client/proc/disable_communication"), P("/client/proc/print_pointers"), P("/client/proc/cmd_show_at_list"), P("/client/proc/cmd_show_at_markers"), P("/client/proc/manipulate_organs")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_debug_mapping", add);
	return f.dot;
});

// /client/proc/camera_view  (code/modules/admin/verbs/mapping.dm:65)
rt.def("/client/proc/camera_view", function camera_view(f: Frame) {
	let on: Value = null, _T: Value = null, seen: Value = null, C: Value = null, _T_3: Value = null, _T_2: Value = null;
	let $e: any;
	f.vars = () => [on, _T, seen, C, _T_3, _T_2, $e];
	on = 0;
	_T = null;
	rt.forList(f, 0, rt.world(), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.fv(f, "maptext", live(_T)))) {
			on = 1;
		}
		rt.setFv(f, "maptext", live(_T), null);
	}
	rt.endFor(f, 0);
	if (!truthy(live(on))) {
		seen = rt.list();
		C = null;
		rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			_T_3 = null;
			rt.forList(f, 1, rt.callName(f, live(C), "can_see", []), T("/turf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				_T_3 = $e;
				rt.incAt(live(seen), live(_T_3), 1, true);
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		_T_2 = null;
		rt.forList(f, 0, live(seen), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_2 = $e;
			rt.setFv(f, "maptext", live(_T_2), fmt("＀", [rt.index(live(seen), live(_T_2))]));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, false, { verb: { name: "Camera Range Display", category: "Mapping" } });

// /client/proc/sec_camera_report  (code/modules/admin/verbs/mapping.dm:85)  may sleep
rt.def("/client/proc/sec_camera_report", function* sec_camera_report(f: Frame) {
	let CL: Value = null, C: Value = null, output: Value = null, C1: Value = null, C2: Value = null, _T: Value = null, window_check: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [CL, C, output, C1, C2, _T, window_check, W, $e];
	if (!truthy(rt.gl("Master"))) {
		yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Master_controller not found.", "Sec Camera Report"]);
		return 0;
	}
	CL = rt.list();
	C = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		CL = rt.modify(live(CL), live(C), add);
	}
	rt.endFor(f, 0);
	output = "<B>CAMERA ANNOMALITIES REPORT</B><HR>\n<B>The following annomalities have been detected. The ones in red need immediate attention: Some of those in black may be intentional.</B><BR><ul>";
	C1 = null;
	rt.forList(f, 0, live(CL), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C1 = $e;
		C2 = null;
		rt.forList(f, 1, live(CL), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 1)) !== undefined) {
			C2 = $e;
			if (!isEqual(live(C1), live(C2))) {
				if (isEqual(rt.fv(f, "c_tag", live(C1)), rt.fv(f, "c_tag", live(C2)))) {
					output = rt.modify(live(output), fmt("<li><font color='red'>c_tag match for sec. cameras at [＀, ＀, ＀] (＀) and [＀, ＀, ＀] (＀) - c_tag is ＀</font></li>", [rt.fv(f, "x", live(C1)), rt.fv(f, "y", live(C1)), rt.fv(f, "z", live(C1)), rt.gv(f, "loc", rt.fv(f, "loc", live(C1))), rt.fv(f, "x", live(C2)), rt.fv(f, "y", live(C2)), rt.fv(f, "z", live(C2)), rt.gv(f, "loc", rt.fv(f, "loc", live(C2))), rt.fv(f, "c_tag", live(C1))]), add);
				}
				if ((((isEqual(rt.fv(f, "loc", live(C1)), rt.fv(f, "loc", live(C2))) && isEqual(rt.fv(f, "dir", live(C1)), rt.fv(f, "dir", live(C2)))) && isEqual(rt.fv(f, "pixel_x", live(C1)), rt.fv(f, "pixel_x", live(C2)))) && isEqual(rt.fv(f, "pixel_y", live(C1)), rt.fv(f, "pixel_y", live(C2))))) {
					output = rt.modify(live(output), fmt("<li><font color='red'>FULLY overlapping sec. cameras at [＀, ＀, ＀] (＀) Networks: ＀ and ＀</font></li>", [rt.fv(f, "x", live(C1)), rt.fv(f, "y", live(C1)), rt.fv(f, "z", live(C1)), rt.gv(f, "loc", rt.fv(f, "loc", live(C1))), rt.fv(f, "network", live(C1)), rt.fv(f, "network", live(C2))]), add);
				}
				if (isEqual(rt.fv(f, "loc", live(C1)), rt.fv(f, "loc", live(C2)))) {
					output = rt.modify(live(output), fmt("<li>overlapping sec. cameras at [＀, ＀, ＀] (＀) Networks: ＀ and ＀</font></li>", [rt.fv(f, "x", live(C1)), rt.fv(f, "y", live(C1)), rt.fv(f, "z", live(C1)), rt.gv(f, "loc", rt.fv(f, "loc", live(C1))), rt.fv(f, "network", live(C1)), rt.fv(f, "network", live(C2))]), add);
				}
			}
		}
		rt.endFor(f, 1);
		if (((!truthy((_T = rt.getStep(f, live(C1), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(C1)), 180]))))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) || !truthy(rt.fv(f, "density", live(_T))))) {
			if (!truthy(rt.locateIn(f, T("/obj/structure/grille"), live(_T)))) {
				window_check = 0;
				W = null;
				rt.forList(f, 1, live(_T), T("/obj/structure/window"));
				while (($e = rt.next(f, 1)) !== undefined) {
					W = $e;
					if (truthy((rt.isIn(f, ((isEqual(rt.fv(f, "dir", live(W)), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(C1)), 180]))) ? 1 : 0) || rt.fv(f, "dir", live(W))), rt.list(5, 6, 9, 10)) ? 1 : 0))) {
						window_check = 1;
						break;
					}
				}
				rt.endFor(f, 1);
				if (!truthy(live(window_check))) {
					output = rt.modify(live(output), fmt("<li><font color='red'>Camera not connected to wall at [＀, ＀, ＀] (＀) Network: ＀</color></li>", [rt.fv(f, "x", live(C1)), rt.fv(f, "y", live(C1)), rt.fv(f, "z", live(C1)), rt.gv(f, "loc", rt.fv(f, "loc", live(C1))), rt.fv(f, "network", live(C1))]), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	output = rt.modify(live(output), "</ul>", add);
	rt.op(f, "Browse", [], [live(f.usr), live(output), "window=airreport;size=1000x500"], false);
	return f.dot;
}, true, { verb: { name: "Camera Report", category: "Mapping" } });

// /client/proc/intercom_view  (code/modules/admin/verbs/mapping.dm:127)  may sleep
rt.def("/client/proc/intercom_view", function* intercom_view(f: Frame) {
	let M: Value = null, I: Value = null, _T: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [M, I, _T, F, $e];
	if (truthy(rt.gl("intercom_range_display_status"))) {
		rt.setGl("intercom_range_display_status", 0);
	} else {
		rt.setGl("intercom_range_display_status", 1);
	}
	M = null;
	rt.forList(f, 0, rt.world(), T("/obj/effect/debugging/marker"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.gl("intercom_range_display_status"))) {
		I = null;
		rt.forList(f, 0, rt.world(), T("/obj/item/device/radio/intercom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			_T = null;
			rt.forList(f, 1, (yield* g.call(f, P("/proc/orange"), null, [7, live(I)])), T("/turf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				_T = $e;
				if (!truthy((rt.isIn(f, (F = (yield* g.new_(f, T("/obj/effect/debugging/marker"), [live(_T)]))), (yield* g.call(f, P("/proc/view"), null, [7, rt.fv(f, "loc", live(I))]))) ? 1 : 0))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(F)]);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { verb: { name: "Intercom Range Display", category: "Mapping" } });

// /client/proc/cmd_show_at_list  (code/modules/admin/verbs/mapping.dm:147)
rt.def("/client/proc/cmd_show_at_list", function cmd_show_at_list(f: Frame) {
	let dat: Value = null, t: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, t, _T, $0, $e];
	dat = "<b>Coordinate list of Active Turfs at Roundstart</b>\n\t <br>Real-time Active Turfs list you can see in Air Subsystem at active_turfs var<br>";
	t = null;
	rt.forList(f, 0, rt.gl("active_turfs_startlist"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (truthy((_T = live(t)))) {
			$0 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$0 = "nonexistent location";
		}
		dat = rt.modify(live(dat), fmt("＀\n", [fmt("＀", [$0])]), add);
		dat = rt.modify(live(dat), "<br>", add);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=at_list"], false);
	return f.dot;
}, false, { verb: { name: "Show roundstart AT list", category: "Mapping", desc: "Displays a list of active turfs coordinates at roundstart" } });

// /client/proc/cmd_show_at_markers  (code/modules/admin/verbs/mapping.dm:165)  may sleep
rt.def("/client/proc/cmd_show_at_markers", function* cmd_show_at_markers(f: Frame) {
	let count: Value = null, AT: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [count, AT, t, $e];
	count = 0;
	AT = null;
	rt.forList(f, 0, rt.gl("all_abstract_markers"), T("/obj/effect/abstract/marker/at"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AT = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(AT)]);
		count = rt.inc(live(count), 1);
	}
	rt.endFor(f, 0);
	if (truthy(live(count))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ AT markers removed.", [live(count)])]);
	} else {
		t = null;
		rt.forList(f, 0, rt.gl("active_turfs_startlist"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			yield* g.new_(f, T("/obj/effect/abstract/marker/at"), [live(t)]);
			count = rt.inc(live(count), 1);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ AT markers placed.", [live(count)])]);
	}
	return f.dot;
}, true, { verb: { name: "Show roundstart AT markers", category: "Mapping", desc: "Places a marker on all active-at-roundstart turfs" } });

// /client/proc/enable_debug_verbs  (code/modules/admin/verbs/mapping.dm:182)
rt.def("/client/proc/enable_debug_verbs", function enable_debug_verbs(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [32]))) {
		return live(f.dot);
	}
	(rt.modSrcVar(f, "verbs", P("/client/proc/enable_debug_verbs"), subtract));
	rt.callName(f, rt.sv(f, "verbs"), "Add", [P("/client/proc/disable_debug_verbs"), rt.gl("admin_verbs_debug_mapping")]);
	return f.dot;
}, false, { verb: { name: "Debug verbs - Enable", category: "Debug" } });

// /client/proc/disable_debug_verbs  (code/modules/admin/verbs/mapping.dm:191)
rt.def("/client/proc/disable_debug_verbs", function disable_debug_verbs(f: Frame) {
	rt.callName(f, rt.sv(f, "verbs"), "Remove", [P("/client/proc/disable_debug_verbs"), rt.gl("admin_verbs_debug_mapping")]);
	rt.modSrcVar(f, "verbs", P("/client/proc/enable_debug_verbs"), add);
	return f.dot;
}, false, { verb: { name: "Debug verbs - Disable", category: "Debug" } });

// /client/proc/count_objects_on_z_level  (code/modules/admin/verbs/mapping.dm:198)  may sleep
rt.def("/client/proc/count_objects_on_z_level", function* count_objects_on_z_level(f: Frame) {
	let level: Value = null, num_level: Value = null, type_text: Value = null, type_path: Value = null, count: Value = null, atom_list: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [level, num_level, type_text, type_path, count, atom_list, A, B, $e];
	if (!truthy((level = (yield* g.op(f, "Prompt", [2], [null, null, "Level?", "Which z-level?", null]))))) {
		return live(f.dot);
	}
	if (!truthy((num_level = (yield* g.call(f, P("/proc/text2num"), null, [live(level)]))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(num_level)])))) {
		return live(f.dot);
	}
	if (!truthy((type_text = (yield* g.op(f, "Prompt", [2], [null, null, "Path?", "Which type path?", null]))))) {
		return live(f.dot);
	}
	if (!truthy((type_path = (yield* g.call(f, P("/proc/text2path"), null, [live(type_text)]))))) {
		return live(f.dot);
	}
	count = 0;
	atom_list = rt.list();
	A = null;
	rt.forList(f, 0, rt.world(), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.op(f, "IsType", [], [live(A), live(type_path)]))) {
			B = live(A);
			while (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(B))])))) {
				if ((truthy(live(B)) && truthy(rt.fv(f, "loc", live(B))))) {
					B = rt.fv(f, "loc", live(B));
				} else {
					break;
				}
			}
			if (truthy(live(B))) {
				if (isEqual(rt.fv(f, "z", live(B)), live(num_level))) {
					count = rt.inc(live(count), 1);
					atom_list = rt.modify(live(atom_list), live(A), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("There are ＀ objects of type ＀ on z-level ＀", [live(count), live(type_path), live(num_level)])]);
	return f.dot;
}, true, { verb: { name: "Count Objects On Level", category: "Mapping" } });

// /client/proc/count_objects_all  (code/modules/admin/verbs/mapping.dm:242)  may sleep
rt.def("/client/proc/count_objects_all", function* count_objects_all(f: Frame) {
	let type_text: Value = null, type_path: Value = null, count: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [type_text, type_path, count, A, $e];
	if (!truthy((type_text = (yield* g.op(f, "Prompt", [2], [null, null, "", "Which type path?", null]))))) {
		return live(f.dot);
	}
	if (!truthy((type_path = (yield* g.call(f, P("/proc/text2path"), null, [live(type_text)]))))) {
		return live(f.dot);
	}
	count = 0;
	A = null;
	rt.forList(f, 0, rt.world(), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.op(f, "IsType", [], [live(A), live(type_path)]))) {
			count = rt.inc(live(count), 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("There are ＀ objects of type ＀ in the game world", [live(count), live(type_path)])]);
	return f.dot;
}, true, { verb: { name: "Count Objects All", category: "Mapping" } });

// /datum/controller/global_vars/proc/InitGlobalsay_disabled  (code/modules/admin/verbs/mapping.dm:267)
rt.def("/datum/controller/global_vars/proc/InitGlobalsay_disabled", function InitGlobalsay_disabled(f: Frame) {
	rt.setGl("say_disabled", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "say_disabled", add);
	return f.dot;
});

// /client/proc/disable_communication  (code/modules/admin/verbs/mapping.dm:272)
rt.def("/client/proc/disable_communication", function disable_communication(f: Frame) {
	rt.setGl("say_disabled", (!truthy(rt.gl("say_disabled")) ? 1 : 0));
	if (truthy(rt.gl("say_disabled"))) {
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ used 'Disable all communication verbs', killing all communication methods.", [rt.fv(f, "ckey", live(f.src))])]);
	} else {
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ used 'Disable all communication verbs', restoring all communication methods.", [rt.fv(f, "ckey", live(f.src))])]);
	}
	return f.dot;
}, false, { verb: { name: "Disable all communication verbs", category: "Mapping" } });
