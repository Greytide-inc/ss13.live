// Based on /tg/station's code/modules/admin/verbs/mapping.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// mapping.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug_mapping", function InitGlobaladmin_verbs_debug_mapping(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_debug_mapping";
	return f.dot;
});

// mapping.dm:23
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug_mapping", function InitGlobaladmin_verbs_debug_mapping(f: Frame) {
	GLOB.admin_verbs_debug_mapping = list(P("/client/proc/camera_view"), P("/client/proc/sec_camera_report"), P("/client/proc/intercom_view"), P("/client/proc/air_status"), P("/client/proc/Cell"), P("/client/proc/atmosscan"), P("/client/proc/powerdebug"), P("/client/proc/count_objects_on_z_level"), P("/client/proc/count_objects_all"), P("/client/proc/cmd_assume_direct_control"), P("/client/proc/startSinglo"), P("/client/proc/set_server_fps"), P("/client/proc/cmd_admin_grantfullaccess"), P("/client/proc/cmd_admin_areatest"), P("/client/proc/cmd_admin_rejuvenate"), P("/datum/admins/proc/show_traitor_panel"), P("/client/proc/disable_communication"), P("/client/proc/print_pointers"), P("/client/proc/cmd_show_at_list"), P("/client/proc/cmd_show_at_markers"), P("/client/proc/manipulate_organs"));
	this.gvars_datum_init_order += "admin_verbs_debug_mapping";
	return f.dot;
});

// mapping.dm:65
rt.def("/client/proc/camera_view", function camera_view(f: Frame) {
	let _T: Value = null, seen: Value = null, C: Value = null, _T_3: Value = null, _T_2: Value = null;
	let on: Value = 0;
	for (_T of each(rt.world(), T("/turf"))) {
		if (_T.maptext) {
			on = 1;
		}
		_T.maptext = null;
	}
	if (!on) {
		seen = list();
		for (C of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
			_T_3 = null;
			for (_T_3 of each(C.can_see(), T("/turf"))) {
				rt.incAt(seen, _T_3, 1, true);
			}
		}
		for (_T_2 of each(seen, T("/turf"))) {
			_T_2.maptext = `${rt.index(seen, _T_2)}`;
		}
	}
	return f.dot;
}, false, { verb: { name: "Camera Range Display", category: "Mapping" } });

// mapping.dm:85
rt.def("/client/proc/sec_camera_report", function* sec_camera_report(f: Frame) {
	let C: Value = null, C1: Value = null, C2: Value = null, _T: Value = null, window_check: Value = null, W: Value = null;
	if (!GLOB.Master) {
		yield* alert(f.usr, "Master_controller not found.", "Sec Camera Report");
		return 0;
	}
	let CL: Value = list();
	for (C of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
		CL += C;
	}
	let output: Value = "<B>CAMERA ANNOMALITIES REPORT</B><HR>\n<B>The following annomalities have been detected. The ones in red need immediate attention: Some of those in black may be intentional.</B><BR><ul>";
	for (C1 of each(CL, T("/obj/machinery/camera"))) {
		C2 = null;
		for (C2 of each(CL, T("/obj/machinery/camera"))) {
			if (C1 != C2) {
				if (C1.c_tag == C2.c_tag) {
					output += `<li><font color='red'>c_tag match for sec. cameras at [${C1.x}, ${C1.y}, ${C1.z}] (${C1.loc.loc}) and [${C2.x}, ${C2.y}, ${C2.z}] (${C2.loc.loc}) - c_tag is ${C1.c_tag}</font></li>`;
				}
				if (C1.loc == C2.loc && C1.dir == C2.dir && C1.pixel_x == C2.pixel_x && C1.pixel_y == C2.pixel_y) {
					output += `<li><font color='red'>FULLY overlapping sec. cameras at [${C1.x}, ${C1.y}, ${C1.z}] (${C1.loc.loc}) Networks: ${C1.network} and ${C2.network}</font></li>`;
				}
				if (C1.loc == C2.loc) {
					output += `<li>overlapping sec. cameras at [${C1.x}, ${C1.y}, ${C1.z}] (${C1.loc.loc}) Networks: ${C1.network} and ${C2.network}</font></li>`;
				}
			}
		}
		if (!(_T = rt.getStep(f, C1, turn(C1.dir, 180))) || !isturf(_T) || !_T.density) {
			if (!rt.locateIn(f, T("/obj/structure/grille"), _T)) {
				window_check = 0;
				W = null;
				for (W of each(_T, T("/obj/structure/window"))) {
					if (rt.isIn(f, ((W.dir == turn(C1.dir, 180) ? 1 : 0) || W.dir), list(5, 6, 9, 10))) {
						window_check = 1;
						break;
					}
				}
				if (!window_check) {
					output += `<li><font color='red'>Camera not connected to wall at [${C1.x}, ${C1.y}, ${C1.z}] (${C1.loc.loc}) Network: ${C1.network}</color></li>`;
				}
			}
		}
	}
	output += "</ul>";
	rt.op(f, "Browse", [], [f.usr, output, "window=airreport;size=1000x500"], false);
	return f.dot;
}, true, { verb: { name: "Camera Report", category: "Mapping" } });

// mapping.dm:127
rt.def("/client/proc/intercom_view", function* intercom_view(f: Frame) {
	let M: Value = null, I: Value = null, _T: Value = null, F: Value = null;
	if (GLOB.intercom_range_display_status) {
		GLOB.intercom_range_display_status = 0;
	} else {
		GLOB.intercom_range_display_status = 1;
	}
	for (M of each(rt.world(), T("/obj/effect/debugging/marker"))) {
		yield* qdel(M);
	}
	if (GLOB.intercom_range_display_status) {
		for (I of each(rt.world(), T("/obj/item/device/radio/intercom"))) {
			_T = null;
			for (_T of each(orange(7, I), T("/turf"))) {
				if (!rt.isIn(f, (F = (yield* new_(T("/obj/effect/debugging/marker"), _T))), view(7, I.loc))) {
					yield* qdel(F);
				}
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Intercom Range Display", category: "Mapping" } });

// mapping.dm:147
rt.def("/client/proc/cmd_show_at_list", function cmd_show_at_list(f: Frame) {
	let t: Value = null, _T: Value = null;
	let $0: any, $e: any;
	let dat: Value = "<b>Coordinate list of Active Turfs at Roundstart</b>\n\t <br>Real-time Active Turfs list you can see in Air Subsystem at active_turfs var<br>";
	for (t of each(GLOB.active_turfs_startlist)) {
		if (_T = t) {
			$0 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$0 = "nonexistent location";
		}
		dat += `${`${$0}`}\n`;
		dat += "<br>";
	}
	rt.op(f, "Browse", [], [f.usr, dat, "window=at_list"], false);
	return f.dot;
}, false, { verb: { name: "Show roundstart AT list", category: "Mapping", desc: "Displays a list of active turfs coordinates at roundstart" } });

// mapping.dm:165
rt.def("/client/proc/cmd_show_at_markers", function* cmd_show_at_markers(f: Frame) {
	let AT: Value = null, t: Value = null;
	let count: Value = 0;
	for (AT of each(GLOB.all_abstract_markers, T("/obj/effect/abstract/marker/at"))) {
		yield* qdel(AT);
		count++;
	}
	if (count) {
		to_chat(f.usr, `${count} AT markers removed.`);
	} else {
		for (t of each(GLOB.active_turfs_startlist)) {
			yield* new_(T("/obj/effect/abstract/marker/at"), t);
			count++;
		}
		to_chat(f.usr, `${count} AT markers placed.`);
	}
	return f.dot;
}, true, { verb: { name: "Show roundstart AT markers", category: "Mapping", desc: "Places a marker on all active-at-roundstart turfs" } });

// mapping.dm:182
rt.def("/client/proc/enable_debug_verbs", function enable_debug_verbs(f: Frame) {
	if (!check_rights(32)) {
		return f.dot;
	}
	this.verbs -= P("/client/proc/enable_debug_verbs");
	this.verbs.Add(P("/client/proc/disable_debug_verbs"), GLOB.admin_verbs_debug_mapping);
	return f.dot;
}, false, { verb: { name: "Debug verbs - Enable", category: "Debug" } });

// mapping.dm:191
rt.def("/client/proc/disable_debug_verbs", function disable_debug_verbs(f: Frame) {
	this.verbs.Remove(P("/client/proc/disable_debug_verbs"), GLOB.admin_verbs_debug_mapping);
	this.verbs += P("/client/proc/enable_debug_verbs");
	return f.dot;
}, false, { verb: { name: "Debug verbs - Disable", category: "Debug" } });

// mapping.dm:198
rt.def("/client/proc/count_objects_on_z_level", function* count_objects_on_z_level(f: Frame) {
	let level: Value = null, num_level: Value = null, type_text: Value = null, type_path: Value = null, A: Value = null, B: Value = null;
	if (!(level = (yield* g.op(f, "Prompt", [2], [null, null, "Level?", "Which z-level?", null])))) {
		return f.dot;
	}
	if (!(num_level = text2num(level))) {
		return f.dot;
	}
	if (!isnum(num_level)) {
		return f.dot;
	}
	if (!(type_text = (yield* g.op(f, "Prompt", [2], [null, null, "Path?", "Which type path?", null])))) {
		return f.dot;
	}
	if (!(type_path = text2path(type_text))) {
		return f.dot;
	}
	let count: Value = 0;
	let atom_list: Value = list();
	for (A of each(rt.world(), T("/atom"))) {
		if (rt.op(f, "IsType", [], [A, type_path])) {
			B = A;
			while (!isturf(B.loc)) {
				if (B && B.loc) {
					B = B.loc;
				} else {
					break;
				}
			}
			if (B) {
				if (B.z == num_level) {
					count++;
					atom_list += A;
				}
			}
		}
	}
	to_chat(rt.world(), `There are ${count} objects of type ${type_path} on z-level ${num_level}`);
	return f.dot;
}, true, { verb: { name: "Count Objects On Level", category: "Mapping" } });

// mapping.dm:242
rt.def("/client/proc/count_objects_all", function* count_objects_all(f: Frame) {
	let type_text: Value = null, type_path: Value = null, A: Value = null;
	if (!(type_text = (yield* g.op(f, "Prompt", [2], [null, null, "", "Which type path?", null])))) {
		return f.dot;
	}
	if (!(type_path = text2path(type_text))) {
		return f.dot;
	}
	let count: Value = 0;
	for (A of each(rt.world(), T("/atom"))) {
		if (rt.op(f, "IsType", [], [A, type_path])) {
			count++;
		}
	}
	to_chat(rt.world(), `There are ${count} objects of type ${type_path} in the game world`);
	return f.dot;
}, true, { verb: { name: "Count Objects All", category: "Mapping" } });

// mapping.dm:267
rt.def("/datum/controller/global_vars/proc/InitGlobalsay_disabled", function InitGlobalsay_disabled(f: Frame) {
	GLOB.say_disabled = 0;
	this.gvars_datum_init_order += "say_disabled";
	return f.dot;
});

// mapping.dm:272
rt.def("/client/proc/disable_communication", function disable_communication(f: Frame) {
	GLOB.say_disabled = (!GLOB.say_disabled ? 1 : 0);
	if (GLOB.say_disabled) {
		message_admins(`${this.ckey} used 'Disable all communication verbs', killing all communication methods.`);
	} else {
		message_admins(`${this.ckey} used 'Disable all communication verbs', restoring all communication methods.`);
	}
	return f.dot;
}, false, { verb: { name: "Disable all communication verbs", category: "Mapping" } });
