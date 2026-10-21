// From code/modules/admin/admin_verbs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_default  (code/modules/admin/admin_verbs.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_default", function InitGlobaladmin_verbs_default(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_default", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_default  (code/modules/admin/admin_verbs.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_default", function InitGlobaladmin_verbs_default(f: Frame) {
	rt.setGl("admin_verbs_default", rt.callName(f, rt.world(), "AVerbsDefault", []));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_default", add);
	return f.dot;
});

// /world/proc/AVerbsDefault  (code/modules/admin/admin_verbs.dm:6)
rt.def("/world/proc/AVerbsDefault", function AVerbsDefault(f: Frame) {
	return rt.list(P("/client/proc/deadmin"), P("/client/proc/cmd_admin_say"), P("/client/proc/hide_verbs"), P("/client/proc/hide_most_verbs"), P("/client/proc/debug_variables"), P("/client/proc/dsay"), P("/client/proc/investigate_show"), P("/client/proc/secrets"), P("/client/proc/reload_admins"), P("/client/proc/cmd_admin_pm_context"), P("/client/proc/cmd_admin_pm_panel"), P("/client/proc/cmd_admin_ticket_panel"), P("/client/proc/stop_sounds"));
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_admin  (code/modules/admin/admin_verbs.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_admin", function InitGlobaladmin_verbs_admin(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_admin", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_admin  (code/modules/admin/admin_verbs.dm:23)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_admin", function InitGlobaladmin_verbs_admin(f: Frame) {
	rt.setGl("admin_verbs_admin", rt.callName(f, rt.world(), "AVerbsAdmin", []));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_admin", add);
	return f.dot;
});

// /world/proc/AVerbsAdmin  (code/modules/admin/admin_verbs.dm:25)
rt.def("/world/proc/AVerbsAdmin", function AVerbsAdmin(f: Frame) {
	return rt.list(P("/client/proc/invisimin"), P("/datum/admins/proc/show_player_panel"), P("/client/proc/game_panel"), P("/client/proc/check_ai_laws"), P("/datum/admins/proc/toggleooc"), P("/datum/admins/proc/toggleoocdead"), P("/datum/admins/proc/toggleenter"), P("/datum/admins/proc/toggleguests"), P("/datum/admins/proc/announce"), P("/datum/admins/proc/set_admin_notice"), P("/client/proc/admin_ghost"), P("/client/proc/toggle_view_range"), P("/datum/admins/proc/view_txt_log"), P("/datum/admins/proc/view_atk_log"), P("/client/proc/cmd_admin_subtle_message"), P("/client/proc/cmd_admin_delete"), P("/client/proc/cmd_admin_check_contents"), P("/client/proc/check_antagonists"), P("/datum/admins/proc/access_news_network"), P("/client/proc/getserverlog"), P("/client/proc/jumptocoord"), P("/client/proc/Getmob"), P("/client/proc/Getkey"), P("/client/proc/jumptoarea"), P("/client/proc/jumptokey"), P("/client/proc/jumptomob"), P("/client/proc/jumptoturf"), P("/client/proc/admin_call_shuttle"), P("/client/proc/admin_cancel_shuttle"), P("/client/proc/cmd_admin_direct_narrate"), P("/client/proc/cmd_admin_world_narrate"), P("/client/proc/cmd_admin_local_narrate"), P("/client/proc/cmd_admin_create_centcom_report"), P("/client/proc/cmd_change_command_name"), P("/client/proc/toggle_antag_hud"), P("/client/proc/toggle_AI_interact"), P("/client/proc/customiseSNPC"), P("/client/proc/resetSNPC"), P("/client/proc/open_shuttle_manipulator"), P("/client/proc/deadchat"), P("/client/proc/toggleprayers"), P("/client/proc/toggleadminhelpsound"), P("/client/proc/respawn_character"));
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_ban  (code/modules/admin/admin_verbs.dm:72)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_ban", function InitGlobaladmin_verbs_ban(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_ban", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_ban  (code/modules/admin/admin_verbs.dm:73)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_ban", function InitGlobaladmin_verbs_ban(f: Frame) {
	rt.setGl("admin_verbs_ban", rt.list(P("/client/proc/unban_panel"), P("/client/proc/stickybanpanel")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_ban", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_sounds  (code/modules/admin/admin_verbs.dm:74)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_sounds", function InitGlobaladmin_verbs_sounds(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_sounds", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_sounds  (code/modules/admin/admin_verbs.dm:75)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_sounds", function InitGlobaladmin_verbs_sounds(f: Frame) {
	rt.setGl("admin_verbs_sounds", rt.list(P("/client/proc/play_local_sound"), P("/client/proc/play_sound"), P("/client/proc/set_round_end_sound")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_sounds", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_fun  (code/modules/admin/admin_verbs.dm:76)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_fun", function InitGlobaladmin_verbs_fun(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_fun", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_fun  (code/modules/admin/admin_verbs.dm:77)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_fun", function InitGlobaladmin_verbs_fun(f: Frame) {
	rt.setGl("admin_verbs_fun", rt.list(P("/client/proc/cmd_admin_dress"), P("/client/proc/cmd_admin_gib_self"), P("/client/proc/drop_bomb"), P("/client/proc/set_dynex_scale"), P("/client/proc/drop_dynex_bomb"), P("/client/proc/cinematic"), P("/client/proc/one_click_antag"), P("/client/proc/cmd_admin_add_freeform_ai_law"), P("/client/proc/object_say"), P("/client/proc/toggle_random_events"), P("/client/proc/set_ooc"), P("/client/proc/reset_ooc"), P("/client/proc/forceEvent"), P("/client/proc/admin_change_sec_level"), P("/client/proc/toggle_nuke"), P("/client/proc/mass_zombie_infection"), P("/client/proc/mass_zombie_cure"), P("/client/proc/polymorph_all"), P("/client/proc/show_tip"), P("/client/proc/smite")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_fun", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_spawn  (code/modules/admin/admin_verbs.dm:99)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_spawn", function InitGlobaladmin_verbs_spawn(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_spawn", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_spawn  (code/modules/admin/admin_verbs.dm:100)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_spawn", function InitGlobaladmin_verbs_spawn(f: Frame) {
	rt.setGl("admin_verbs_spawn", rt.list(P("/datum/admins/proc/spawn_atom"), P("/datum/admins/proc/spawn_many"), P("/datum/admins/proc/spawn_grid"), P("/client/proc/respawn_character")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_spawn", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_server  (code/modules/admin/admin_verbs.dm:101)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_server", function InitGlobaladmin_verbs_server(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_server", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_server  (code/modules/admin/admin_verbs.dm:102)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_server", function InitGlobaladmin_verbs_server(f: Frame) {
	rt.setGl("admin_verbs_server", rt.callName(f, rt.world(), "AVerbsServer", []));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_server", add);
	return f.dot;
});

// /world/proc/AVerbsServer  (code/modules/admin/admin_verbs.dm:104)
rt.def("/world/proc/AVerbsServer", function AVerbsServer(f: Frame) {
	return rt.list(P("/datum/admins/proc/startnow"), P("/datum/admins/proc/restart"), P("/datum/admins/proc/end_round"), P("/datum/admins/proc/delay"), P("/datum/admins/proc/toggleaban"), P("/client/proc/everyone_random"), P("/datum/admins/proc/toggleAI"), P("/client/proc/cmd_admin_delete"), P("/client/proc/cmd_debug_del_all"), P("/client/proc/toggle_random_events"), P("/client/proc/forcerandomrotate"), P("/client/proc/adminchangemap"));
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug  (code/modules/admin/admin_verbs.dm:120)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug", function InitGlobaladmin_verbs_debug(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_debug", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug  (code/modules/admin/admin_verbs.dm:121)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug", function InitGlobaladmin_verbs_debug(f: Frame) {
	rt.setGl("admin_verbs_debug", rt.callName(f, rt.world(), "AVerbsDebug", []));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_debug", add);
	return f.dot;
});

// /world/proc/AVerbsDebug  (code/modules/admin/admin_verbs.dm:123)
rt.def("/world/proc/AVerbsDebug", function AVerbsDebug(f: Frame) {
	return rt.list(P("/client/proc/zoom_out"), P("/client/proc/zoom_in"), P("/client/proc/zoom_reset"), P("/client/proc/restart_controller"), P("/client/proc/cmd_admin_list_open_jobs"), P("/client/proc/Debug2"), P("/client/proc/cmd_debug_make_powernets"), P("/client/proc/cmd_debug_mob_lists"), P("/client/proc/cmd_admin_delete"), P("/client/proc/cmd_debug_del_all"), P("/client/proc/restart_controller"), P("/client/proc/enable_debug_verbs"), P("/client/proc/callproc"), P("/client/proc/callproc_datum"), P("/client/proc/SDQL2_query"), P("/client/proc/test_movable_UI"), P("/client/proc/test_snap_UI"), P("/client/proc/debugNatureMapGenerator"), P("/client/proc/check_bomb_impacts"), P("/proc/machine_upgrade"), P("/client/proc/populate_world"), P("/client/proc/get_dynex_power"), P("/client/proc/get_dynex_range"), P("/client/proc/set_dynex_scale"), P("/client/proc/cmd_display_del_log"), P("/client/proc/create_outfits"), P("/client/proc/modify_goals"), P("/client/proc/debug_huds"), P("/client/proc/map_template_load"), P("/client/proc/map_template_upload"), P("/client/proc/jump_to_ruin"), P("/client/proc/clear_dynamic_transit"), P("/client/proc/view_runtimes"), P("/client/proc/pump_random_event"), P("/client/proc/cmd_display_init_log"));
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_possess  (code/modules/admin/admin_verbs.dm:158)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_possess", function InitGlobaladmin_verbs_possess(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_possess", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_possess  (code/modules/admin/admin_verbs.dm:159)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_possess", function InitGlobaladmin_verbs_possess(f: Frame) {
	rt.setGl("admin_verbs_possess", rt.list(P("/proc/possess"), P("/proc/release")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_possess", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_hideable  (code/modules/admin/admin_verbs.dm:166)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_hideable", function InitGlobaladmin_verbs_hideable(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_verbs_hideable", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_verbs_hideable  (code/modules/admin/admin_verbs.dm:167)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_hideable", function InitGlobaladmin_verbs_hideable(f: Frame) {
	rt.setGl("admin_verbs_hideable", rt.list(P("/client/proc/set_ooc"), P("/client/proc/reset_ooc"), P("/client/proc/deadmin"), P("/datum/admins/proc/show_traitor_panel"), P("/datum/admins/proc/toggleenter"), P("/datum/admins/proc/toggleguests"), P("/datum/admins/proc/announce"), P("/datum/admins/proc/set_admin_notice"), P("/client/proc/admin_ghost"), P("/client/proc/toggle_view_range"), P("/datum/admins/proc/view_txt_log"), P("/datum/admins/proc/view_atk_log"), P("/client/proc/cmd_admin_subtle_message"), P("/client/proc/cmd_admin_check_contents"), P("/datum/admins/proc/access_news_network"), P("/client/proc/admin_call_shuttle"), P("/client/proc/admin_cancel_shuttle"), P("/client/proc/cmd_admin_direct_narrate"), P("/client/proc/cmd_admin_world_narrate"), P("/client/proc/cmd_admin_local_narrate"), P("/client/proc/play_local_sound"), P("/client/proc/play_sound"), P("/client/proc/set_round_end_sound"), P("/client/proc/cmd_admin_dress"), P("/client/proc/cmd_admin_gib_self"), P("/client/proc/drop_bomb"), P("/client/proc/drop_dynex_bomb"), P("/client/proc/get_dynex_range"), P("/client/proc/get_dynex_power"), P("/client/proc/set_dynex_scale"), P("/client/proc/cinematic"), P("/client/proc/cmd_admin_add_freeform_ai_law"), P("/client/proc/cmd_admin_create_centcom_report"), P("/client/proc/cmd_change_command_name"), P("/client/proc/object_say"), P("/client/proc/toggle_random_events"), P("/datum/admins/proc/startnow"), P("/datum/admins/proc/restart"), P("/datum/admins/proc/delay"), P("/datum/admins/proc/toggleaban"), P("/client/proc/everyone_random"), P("/datum/admins/proc/toggleAI"), P("/client/proc/restart_controller"), P("/client/proc/cmd_admin_list_open_jobs"), P("/client/proc/callproc"), P("/client/proc/callproc_datum"), P("/client/proc/Debug2"), P("/client/proc/reload_admins"), P("/client/proc/cmd_debug_make_powernets"), P("/client/proc/startSinglo"), P("/client/proc/cmd_debug_mob_lists"), P("/client/proc/cmd_debug_del_all"), P("/client/proc/enable_debug_verbs"), P("/proc/possess"), P("/proc/release"), P("/client/proc/reload_admins"), P("/client/proc/admin_change_sec_level"), P("/client/proc/toggle_nuke"), P("/client/proc/cmd_display_del_log"), P("/client/proc/toggle_antag_hud"), P("/client/proc/debug_huds"), P("/client/proc/customiseSNPC"), P("/client/proc/resetSNPC")));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_verbs_hideable", add);
	return f.dot;
});

// /client/proc/add_admin_verbs  (code/modules/admin/admin_verbs.dm:238)
rt.def("/client/proc/add_admin_verbs", function add_admin_verbs(f: Frame) {
	let rights: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [rights, path, $e];
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	rt.setSv(f, "control_freak", 6);
	rights = rt.gv(f, "rights", rt.fv(f, "rank", rt.sv(f, "holder")));
	rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_default"), add);
	if (truthy(rt.bitAnd(live(rights), 1))) {
		rt.modSrcVar(f, "verbs", P("/client/proc/togglebuildmodeself"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 2))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_admin"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 4))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_ban"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 8))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_fun"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 16))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_server"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 32))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_debug"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 64))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_possess"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 256))) {
		rt.modSrcVar(f, "verbs", P("/client/proc/stealth"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 2048))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_sounds"), add);
	}
	if (truthy(rt.bitAnd(live(rights), 4096))) {
		rt.modSrcVar(f, "verbs", rt.gl("admin_verbs_spawn"), add);
	}
	path = null;
	rt.forList(f, 0, rt.gv(f, "adds", rt.fv(f, "rank", rt.sv(f, "holder"))));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.modSrcVar(f, "verbs", live(path), add);
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, rt.gv(f, "subs", rt.fv(f, "rank", rt.sv(f, "holder"))));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		(rt.modSrcVar(f, "verbs", live(path), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /client/proc/remove_admin_verbs  (code/modules/admin/admin_verbs.dm:271)
rt.def("/client/proc/remove_admin_verbs", function remove_admin_verbs(f: Frame) {
	rt.callName(f, rt.sv(f, "verbs"), "Remove", [rt.gl("admin_verbs_default"), P("/client/proc/togglebuildmodeself"), rt.gl("admin_verbs_admin"), rt.gl("admin_verbs_ban"), rt.gl("admin_verbs_fun"), rt.gl("admin_verbs_server"), rt.gl("admin_verbs_debug"), rt.gl("admin_verbs_possess"), P("/client/proc/stealth"), rt.gl("admin_verbs_sounds"), rt.gl("admin_verbs_spawn"), P("/client/proc/Cell"), P("/client/proc/camera_view"), P("/client/proc/sec_camera_report"), P("/client/proc/intercom_view"), P("/client/proc/air_status"), P("/client/proc/atmosscan"), P("/client/proc/powerdebug"), P("/client/proc/count_objects_on_z_level"), P("/client/proc/count_objects_all"), P("/client/proc/cmd_assume_direct_control"), P("/client/proc/startSinglo"), P("/client/proc/set_server_fps"), P("/client/proc/cmd_admin_grantfullaccess"), P("/client/proc/cmd_admin_areatest"), P("/client/proc/readmin")]);
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	rt.callName(f, rt.sv(f, "verbs"), "Remove", [rt.gv(f, "adds", rt.fv(f, "rank", rt.sv(f, "holder")))]);
	return f.dot;
});

// /client/proc/hide_most_verbs  (code/modules/admin/admin_verbs.dm:309)
rt.def("/client/proc/hide_most_verbs", function hide_most_verbs(f: Frame) {
	rt.callName(f, rt.sv(f, "verbs"), "Remove", [P("/client/proc/hide_most_verbs"), rt.gl("admin_verbs_hideable")]);
	rt.modSrcVar(f, "verbs", P("/client/proc/show_verbs"), add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='interface'>Most of your adminverbs have been hidden.</span>"]);
	return live(f.dot);
}, false, { verb: { name: "Adminverbs - Hide Most", category: "Admin" } });

// /client/proc/hide_verbs  (code/modules/admin/admin_verbs.dm:320)
rt.def("/client/proc/hide_verbs", function hide_verbs(f: Frame) {
	rt.callSrc(f, "remove_admin_verbs", []);
	rt.modSrcVar(f, "verbs", P("/client/proc/show_verbs"), add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='interface'>Almost all of your adminverbs have been hidden.</span>"]);
	return live(f.dot);
}, false, { verb: { name: "Adminverbs - Hide All", category: "Admin" } });

// /client/proc/show_verbs  (code/modules/admin/admin_verbs.dm:331)
rt.def("/client/proc/show_verbs", function show_verbs(f: Frame) {
	(rt.modSrcVar(f, "verbs", P("/client/proc/show_verbs"), subtract));
	rt.callSrc(f, "add_admin_verbs", []);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='interface'>All of your adminverbs are now visible.</span>"]);
	return f.dot;
}, false, { verb: { name: "Adminverbs - Show", category: "Admin" } });

// /client/proc/admin_ghost  (code/modules/admin/admin_verbs.dm:343)  may sleep
rt.def("/client/proc/admin_ghost", function* admin_ghost(f: Frame) {
	let ghost: Value = null, body: Value = null;
	f.vars = () => [ghost, body];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "mind", (ghost = rt.sv(f, "mob")))) || !truthy(rt.gv(f, "current", rt.fv(f, "mind", live(ghost)))))) {
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "can_reenter_corpse", live(ghost)))) {
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ re-entered corpse", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ re-entered corpse", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		}
		rt.setFv(f, "can_reenter_corpse", live(ghost), 1);
		yield* g.callName(f, live(ghost), "reenter_corpse", []);
	} else {
		if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/new_player")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Error: Aghost: Can't admin-ghost whilst in the lobby. Join or Observe first.</font>"]);
		} else {
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ admin ghosted.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ admin ghosted.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
			yield* g.callName(f, (body = rt.sv(f, "mob")), "ghostize", [1]);
			if ((truthy(live(body)) && !truthy(rt.fv(f, "key", live(body))))) {
				rt.setFv(f, "key", live(body), fmt("@＀", [rt.sv(f, "key")]));
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Aghost", category: "Admin" } });

// /client/proc/invisimin  (code/modules/admin/admin_verbs.dm:373)
rt.def("/client/proc/invisimin", function invisimin(f: Frame) {
	if (!(truthy(rt.sv(f, "holder")) && truthy(rt.sv(f, "mob")))) return f.dot;
	if (isEqual(rt.fv(f, "invisibility", rt.sv(f, "mob")), 60)) {
		rt.setFv(f, "invisibility", rt.sv(f, "mob"), rt.initial(f, rt.sv(f, "mob"), "invisibility"));
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "mob"), "<span class='boldannounce'>Invisimin off. Invisibility reset.</span>"]);
	} else {
		rt.setFv(f, "invisibility", rt.sv(f, "mob"), 60);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "mob"), "<span class='adminnotice'><b>Invisimin on. You are now as invisible as a ghost.</b></span>"]);
	}
	return f.dot;
}, false, { verb: { name: "Invisimin", category: "Admin", desc: "Toggles ghost-like invisibility (Don't abuse this)" } });

// /client/proc/check_antagonists  (code/modules/admin/admin_verbs.dm:385)  may sleep
rt.def("/client/proc/check_antagonists", function* check_antagonists(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "check_antagonists", []);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ checked antagonists.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ checked antagonists.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		}
	}
	return f.dot;
}, true, { verb: { name: "Check Antagonists", category: "Admin" } });

// /client/proc/unban_panel  (code/modules/admin/admin_verbs.dm:395)
rt.def("/client/proc/unban_panel", function unban_panel(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		rt.callName(f, rt.sv(f, "holder"), "unbanpanel", []);
	}
	return f.dot;
}, false, { verb: { name: "Unban Panel", category: "Admin" } });

// /client/proc/game_panel  (code/modules/admin/admin_verbs.dm:405)
rt.def("/client/proc/game_panel", function game_panel(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		rt.callName(f, rt.sv(f, "holder"), "Game", []);
	}
	return f.dot;
}, false, { verb: { name: "Game Panel", category: "Admin" } });

// /client/proc/secrets  (code/modules/admin/admin_verbs.dm:412)
rt.def("/client/proc/secrets", function secrets(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		rt.callName(f, rt.sv(f, "holder"), "Secrets", []);
	}
	return f.dot;
}, false, { verb: { name: "Secrets", category: "Admin" } });

// /client/proc/findStealthKey  (code/modules/admin/admin_verbs.dm:418)
rt.def("/client/proc/findStealthKey", function findStealthKey(f: Frame, txt: Value) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [txt, _P, $e];
	if (truthy(live(txt))) {
		_P = null;
		rt.forList(f, 0, rt.gl("stealthminID"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			if (isEqual(rt.index(rt.gl("stealthminID"), live(_P)), live(txt))) {
				return live(_P);
			}
		}
		rt.endFor(f, 0);
	}
	return (txt = rt.index(rt.gl("stealthminID"), rt.sv(f, "ckey")));
});

// /client/proc/createStealthKey  (code/modules/admin/admin_verbs.dm:425)
rt.def("/client/proc/createStealthKey", function createStealthKey(f: Frame) {
	let num: Value = null, i: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [num, i, _P, $e];
	num = rt.call(f, P("/proc/rand"), null, [0, 1000]);
	i = 0;
	while (isEqual(live(i), 0)) {
		i = 1;
		_P = null;
		rt.forList(f, 0, rt.gl("stealthminID"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			if (isEqual(live(num), rt.index(rt.gl("stealthminID"), live(_P)))) {
				num = rt.inc(live(num), 1);
				i = 0;
			}
		}
		rt.endFor(f, 0);
	}
	rt.setAt(rt.gl("stealthminID"), fmt("＀", [rt.sv(f, "ckey")]), fmt("@＀", [rt.call(f, P("/proc/num2text"), null, [live(num)])]));
	return f.dot;
});

// /client/proc/stealth  (code/modules/admin/admin_verbs.dm:439)  may sleep
rt.def("/client/proc/stealth", function* stealth(f: Frame) {
	let new_key: Value = null;
	let $0: any, $1: any;
	f.vars = () => [new_key, $0, $1];
	if (truthy(rt.sv(f, "holder"))) {
		if (truthy(rt.fv(f, "fakekey", rt.sv(f, "holder")))) {
			rt.setFv(f, "fakekey", rt.sv(f, "holder"), null);
			if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) {
				rt.setFv(f, "invisibility", rt.sv(f, "mob"), rt.initial(f, rt.sv(f, "mob"), "invisibility"));
				rt.setFv(f, "alpha", rt.sv(f, "mob"), rt.initial(f, rt.sv(f, "mob"), "alpha"));
				rt.setFv(f, "name", rt.sv(f, "mob"), rt.initial(f, rt.sv(f, "mob"), "name"));
				rt.setFv(f, "mouse_opacity", rt.sv(f, "mob"), rt.initial(f, rt.sv(f, "mob"), "mouse_opacity"));
			}
		} else {
			if (!truthy((new_key = (yield* g.call(f, P("/proc/ckeyEx"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.sv(f, "key"), "Fake Key", "Enter your desired display name.", null]))]))))) {
				return live(f.dot);
			}
			if (rt.ge(rt.length(live(new_key)), 26)) {
				new_key = (yield* g.call(f, P("/proc/copytext"), null, [live(new_key), 1, 26]));
			}
			rt.setFv(f, "fakekey", rt.sv(f, "holder"), live(new_key));
			yield* g.srcCall(f, "createStealthKey");
			if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) {
				rt.setFv(f, "invisibility", rt.sv(f, "mob"), 100);
				rt.setFv(f, "alpha", rt.sv(f, "mob"), 0);
				rt.setFv(f, "name", rt.sv(f, "mob"), " ");
				rt.setFv(f, "mouse_opacity", rt.sv(f, "mob"), 0);
			}
		}
		$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]));
		if (truthy(rt.fv(f, "fakekey", rt.sv(f, "holder")))) {
			$1 = "ON";
		} else {
			$1 = "OFF";
		}
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has turned stealth mode ＀", [$0, $1])]);
		$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
		if (truthy(rt.fv(f, "fakekey", rt.sv(f, "holder")))) {
			$1 = "ON";
		} else {
			$1 = "OFF";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has turned stealth mode ＀", [$0, $1])]);
	}
	return f.dot;
}, true, { verb: { name: "Stealth Mode", category: "Admin" } });

// /client/proc/drop_bomb  (code/modules/admin/admin_verbs.dm:469)  may sleep
rt.def("/client/proc/drop_bomb", function* drop_bomb(f: Frame) {
	let choices: Value = null, choice: Value = null, epicenter: Value = null, devastation_range: Value = null, heavy_impact_range: Value = null, light_impact_range: Value = null, flash_range: Value = null;
	let $0: any;
	f.vars = () => [choices, choice, epicenter, devastation_range, heavy_impact_range, light_impact_range, flash_range, $0];
	choices = rt.list("Small Bomb (1, 2, 3, 3)", "Medium Bomb (2, 3, 4, 4)", "Big Bomb (3, 5, 7, 5)", "Maxcap", "Custom Bomb");
	choice = (yield* g.op(f, "Prompt", [1], [null, null, null, "What size explosion would you like to produce? WARNING: These ignore the maxcap", live(choices)]));
	epicenter = rt.fv(f, "loc", rt.sv(f, "mob"));
	$0 = live(choice);
	if (isEqual($0, null)) {
		return 0;
	} else if ($0 === "Small Bomb (1, 2, 3, 3)") {
		yield* g.call(f, P("/proc/explosion"), null, [live(epicenter), 1, 2, 3, 3, 1, 1]);
	} else if ($0 === "Medium Bomb (2, 3, 4, 4)") {
		yield* g.call(f, P("/proc/explosion"), null, [live(epicenter), 2, 3, 4, 4, 1, 1]);
	} else if ($0 === "Big Bomb (3, 5, 7, 5)") {
		yield* g.call(f, P("/proc/explosion"), null, [live(epicenter), 3, 5, 7, 5, 1, 1]);
	} else if ($0 === "Maxcap") {
		yield* g.call(f, P("/proc/explosion"), null, [live(epicenter), rt.gl("MAX_EX_DEVESTATION_RANGE"), rt.gl("MAX_EX_HEAVY_RANGE"), rt.gl("MAX_EX_LIGHT_RANGE"), rt.gl("MAX_EX_FLASH_RANGE")]);
	} else if ($0 === "Custom Bomb") {
		if ((devastation_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Devastation range (in tiles):", null]))) === null) {
			return live(f.dot);
		}
		if ((heavy_impact_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Heavy impact range (in tiles):", null]))) === null) {
			return live(f.dot);
		}
		if ((light_impact_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Light impact range (in tiles):", null]))) === null) {
			return live(f.dot);
		}
		if ((flash_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Flash range (in tiles):", null]))) === null) {
			return live(f.dot);
		}
		if ((((rt.gt(live(devastation_range), rt.gl("MAX_EX_DEVESTATION_RANGE")) || rt.gt(live(heavy_impact_range), rt.gl("MAX_EX_HEAVY_RANGE"))) || rt.gt(live(light_impact_range), rt.gl("MAX_EX_LIGHT_RANGE"))) || rt.gt(live(flash_range), rt.gl("MAX_EX_FLASH_RANGE")))) {
			if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Bomb is bigger than the maxcap. Continue?", null, "Yes", "No"])), "Yes")) {
				return live(f.dot);
			}
		}
		yield* g.call(f, P("/proc/explosion"), null, [(epicenter = rt.fv(f, "loc", rt.sv(f, "mob"))), live(devastation_range), live(heavy_impact_range), live(light_impact_range), live(flash_range), 1, 1]);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ creating an admin explosion at ＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), rt.fv(f, "loc", live(epicenter))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created an admin explosion at ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "loc", live(epicenter))])]);
	return f.dot;
}, true, { verb: { name: "Drop Bomb", category: "Special Verbs", desc: "Cause an explosion of varying strength at your location." } });

// /client/proc/drop_dynex_bomb  (code/modules/admin/admin_verbs.dm:510)  may sleep
rt.def("/client/proc/drop_dynex_bomb", function* drop_dynex_bomb(f: Frame) {
	let ex_power: Value = null, epicenter: Value = null;
	f.vars = () => [ex_power, epicenter];
	ex_power = (yield* g.op(f, "Prompt", [33], [null, null, null, "Explosive Power:", null]));
	epicenter = rt.fv(f, "loc", rt.sv(f, "mob"));
	if (!(truthy(live(ex_power)) && truthy(live(epicenter)))) return f.dot;
	yield* g.call(f, P("/proc/dyn_explosion"), null, [live(epicenter), live(ex_power)]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ creating an admin explosion at ＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), rt.fv(f, "loc", live(epicenter))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ created an admin explosion at ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "loc", live(epicenter))])]);
	return f.dot;
}, true, { verb: { name: "Drop DynEx Bomb", category: "Special Verbs", desc: "Cause an explosion of varying strength at your location." } });

// /client/proc/get_dynex_range  (code/modules/admin/admin_verbs.dm:523)  may sleep
rt.def("/client/proc/get_dynex_range", function* get_dynex_range(f: Frame) {
	let ex_power: Value = null, range: Value = null;
	f.vars = () => [ex_power, range];
	ex_power = (yield* g.op(f, "Prompt", [33], [null, null, null, "Explosive Power:", null]));
	range = (yield* g.call(f, P("/proc/round"), null, [rt.power(multiply(2, live(ex_power)), rt.gl("DYN_EX_SCALE"))]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Estimated Explosive Range: (Devestation: ＀, Heavy: ＀, Light: ＀)", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(range), 0.25)])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(range), 0.5)])), (yield* g.call(f, P("/proc/round"), null, [live(range)]))])]);
	return f.dot;
}, true, { verb: { name: "Get DynEx Range", category: "Debug", desc: "Get the estimated range of a bomb, using explosive power." } });

// /client/proc/get_dynex_power  (code/modules/admin/admin_verbs.dm:532)  may sleep
rt.def("/client/proc/get_dynex_power", function* get_dynex_power(f: Frame) {
	let ex_range: Value = null, power: Value = null;
	f.vars = () => [ex_range, power];
	ex_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Light Explosion Range:", null]));
	power = rt.power(multiply(0.5, live(ex_range)), divide(1, rt.gl("DYN_EX_SCALE")));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Estimated Explosive Power: ＀", [live(power)])]);
	return f.dot;
}, true, { verb: { name: "Get DynEx Power", category: "Debug", desc: "Get the estimated required power of a bomb, to reach a specific range." } });

// /client/proc/set_dynex_scale  (code/modules/admin/admin_verbs.dm:541)  may sleep
rt.def("/client/proc/set_dynex_scale", function* set_dynex_scale(f: Frame) {
	let ex_scale: Value = null;
	f.vars = () => [ex_scale];
	if (!truthy((ex_scale = (yield* g.op(f, "Prompt", [33], [null, null, null, "New DynEx Scale:", null]))))) {
		return live(f.dot);
	}
	rt.setGl("DYN_EX_SCALE", live(ex_scale));
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has modified Dynamic Explosion Scale: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(ex_scale)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has  modified Dynamic Explosion Scale: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ex_scale)])]);
	return f.dot;
}, true, { verb: { name: "Set DynEx Scale", category: "Debug", desc: "Set the scale multiplier of dynex explosions. The default is 0.5." } });

// /client/proc/give_spell  (code/modules/admin/admin_verbs.dm:553)  may sleep
rt.def("/client/proc/give_spell", function* give_spell(f: Frame, _T: Value) {
	let spell_list: Value = null, type_length: Value = null, A: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [_T, spell_list, type_length, A, S, $e];
	spell_list = rt.list();
	type_length = add(rt.length("/obj/effect/proc_holder/spell"), 2);
	A = null;
	rt.forList(f, 0, rt.gl("spells"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setAt(live(spell_list), (yield* g.call(f, P("/proc/copytext"), null, [fmt("＀", [live(A)]), live(type_length)])), live(A));
	}
	rt.endFor(f, 0);
	if (!truthy((S = (yield* g.op(f, "Prompt", [1], [null, null, "ABRAKADABRA", "Choose the spell to give to that guy", live(spell_list)]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ gave ＀ the spell ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(_T)])), live(S)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ gave ＀ the spell ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(_T)])), live(S)])]);
	S = rt.index(live(spell_list), live(S));
	if (truthy(rt.fv(f, "mind", live(_T)))) {
		yield* g.callName(f, rt.fv(f, "mind", live(_T)), "AddSpell", [(yield* g.new_(f, live(S), []))]);
	} else {
		yield* g.callName(f, live(_T), "AddSpell", [(yield* g.new_(f, live(S), []))]);
		yield* g.call(f, P("/proc/message_admins"), null, ["<span class='danger'>Spells given to mindless mobs will not be transferred in mindswap or cloning!</span>"]);
	}
	return f.dot;
}, true, { verb: { name: "Give Spell", category: "Fun", desc: "Gives a spell to a mob." }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/remove_spell  (code/modules/admin/admin_verbs.dm:577)  may sleep
rt.def("/client/proc/remove_spell", function* remove_spell(f: Frame, _T: Value) {
	let S: Value = null;
	f.vars = () => [_T, S];
	if (!(truthy(live(_T)) && truthy(rt.fv(f, "mind", live(_T))))) return f.dot;
	if (!truthy((S = (yield* g.op(f, "Prompt", [1], [null, null, "NO ABRAKADABRA", "Choose the spell to remove", rt.gv(f, "spell_list", rt.fv(f, "mind", live(_T)))]))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(_T)), "RemoveSpell", [live(S)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ removed the spell ＀ from ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(S), (yield* g.call(f, P("/proc/key_name"), null, [live(_T)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ removed the spell ＀ from ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(S), (yield* g.call(f, P("/proc/key_name"), null, [live(_T)]))])]);
	return f.dot;
}, true, { verb: { name: "Remove Spell", category: "Fun", desc: "Remove a spell from the selected mob." }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/give_disease  (code/modules/admin/admin_verbs.dm:589)  may sleep
rt.def("/client/proc/give_disease", function* give_disease(f: Frame, _T: Value) {
	let D: Value = null;
	f.vars = () => [_T, D];
	if (!truthy((D = (yield* g.op(f, "Prompt", [1], [null, null, "ACHOO", "Choose the disease to give to that guy", rt.fv(f, "diseases", rt.gl("SSdisease"))]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(_T), "ForceContractDisease", [(yield* g.new_(f, live(D), []))]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ gave ＀ the disease ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(_T)])), live(D)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ gave ＀ the disease ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(_T)])), live(D)])]);
	return f.dot;
}, true, { verb: { name: "Give Disease", category: "Fun", desc: "Gives a Disease to a mob." }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/object_say  (code/modules/admin/admin_verbs.dm:600)  may sleep
rt.def("/client/proc/object_say", function* object_say(f: Frame, O: Value) {
	let message: Value = null;
	f.vars = () => [O, message];
	if (!truthy((message = (yield* g.op(f, "Prompt", [3], [null, "Make Sound", "What do you want the message to be?", live(f.usr), null]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(O), "say", [live(message)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made ＀ at ＀, ＀, ＀ say \"＀\"", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(O), rt.fv(f, "x", live(O)), rt.fv(f, "y", live(O)), rt.fv(f, "z", live(O)), live(message)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ made ＀ at ＀, ＀, ＀. say \"＀\"</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(O), rt.fv(f, "x", live(O)), rt.fv(f, "y", live(O)), rt.fv(f, "z", live(O)), live(message)])]);
	return f.dot;
}, true, { verb: { name: "OSay", category: "Special Verbs", desc: "Makes an object say something." }, argTypes: [{ type: 4, path: "/obj", source: "world" }] });

// /client/proc/togglebuildmodeself  (code/modules/admin/admin_verbs.dm:610)  may sleep
rt.def("/client/proc/togglebuildmodeself", function* togglebuildmodeself(f: Frame) {
	if (truthy(rt.fv(f, "mob", live(f.src)))) {
		yield* g.call(f, P("/proc/togglebuildmode"), null, [rt.fv(f, "mob", live(f.src))]);
	}
	return f.dot;
}, true, { verb: { name: "Toggle Build Mode Self", category: "Special Verbs" } });

// /client/proc/check_ai_laws  (code/modules/admin/admin_verbs.dm:618)
rt.def("/client/proc/check_ai_laws", function check_ai_laws(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	rt.callName(f, rt.fv(f, "holder", live(f.src)), "output_ai_laws", []);
	return f.dot;
}, false, { verb: { name: "Check AI Laws", category: "Admin" } });

// /client/proc/deadmin  (code/modules/admin/admin_verbs.dm:625)  may sleep
rt.def("/client/proc/deadmin", function* deadmin(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "has_antag_hud")))) {
		yield* g.srcCall(f, "toggle_antag_hud");
	}
	yield* g.callName(f, rt.sv(f, "holder"), "disassociate", []);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holder")]);
	rt.modGl("deadmins", rt.sv(f, "ckey"), add);
	(rt.modGl("admin_datums", rt.sv(f, "ckey"), subtract));
	rt.modSrcVar(f, "verbs", P("/client/proc/readmin"), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='interface'>You are now a normal player.</span>"]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ deadmined themself.", [live(f.src)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ deadmined themself.", [live(f.src)])]);
	return f.dot;
}, true, { verb: { name: "Deadmin", category: "Admin", desc: "Shed your admin powers." } });

// /client/proc/readmin  (code/modules/admin/admin_verbs.dm:648)  may sleep
rt.def("/client/proc/readmin", function* readmin(f: Frame) {
	yield* g.call(f, P("/proc/load_admins"), null, [rt.sv(f, "ckey")]);
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	(rt.modGl("deadmins", rt.sv(f, "ckey"), subtract));
	(rt.modSrcVar(f, "verbs", P("/client/proc/readmin"), subtract));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='interface'>You are now an admin.</span>"]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ re-adminned themselves.", [live(f.src)])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ re-adminned themselves.", [live(f.src)])]);
	return f.dot;
}, true, { verb: { name: "Readmin", category: "Admin", desc: "Regain your admin powers." } });

// /client/proc/populate_world  (code/modules/admin/admin_verbs.dm:666)  may sleep
rt.def("/client/proc/populate_world", function* populate_world(f: Frame, amount: Value) {
	let area: Value = null, candidates: Value = null, tile: Value = null, j: Value = null, k: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [amount, area, candidates, tile, j, k, i, $e];
	if (live(amount) === null) {
		amount = 50;
	}
	if (!rt.gt(live(amount), 0)) return f.dot;
	area = null;
	candidates = null;
	tile = null;
	j = null;
	k = null;
	i = null;
	rt.forRange(f, 0, 1, live(amount), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		j = 100;
		while (true) {
			if (truthy((area = rt.op(f, "PickUnweighted", [1], [rt.gl("the_station_areas")])))) {
				if (truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/get_area_turfs"), null, [live(area)])))))) {
					k = 100;
					while ((!truthy((tile = rt.op(f, "PickUnweighted", [1], [live(candidates)]))) || !truthy((rt.istype(live(tile), T("/turf/open/floor")) ? 1 : 0))) && rt.gt((k = rt.inc(live(k), -1)), 0)) {
					}
					if (truthy(live(tile))) {
						yield* g.new_(f, T("/mob/living/carbon/human/interactive"), [live(tile)]);
					}
				}
			}
			if (!(!truthy(live(area)) && rt.gt((j = rt.inc(live(j), -1)), 0))) break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Populate World", category: "Debug", desc: "(\"Amount of mobs to create\") Populate the world with test mobs." }, argTypes: [{ type: 32 }] });

// /client/proc/toggle_AI_interact  (code/modules/admin/admin_verbs.dm:699)
rt.def("/client/proc/toggle_AI_interact", function toggle_AI_interact(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "AI_Interact", (!truthy(rt.sv(f, "AI_Interact")) ? 1 : 0));
	if ((truthy(rt.sv(f, "mob")) && truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [rt.sv(f, "mob")])))) {
		rt.setFv(f, "has_unlimited_silicon_privilege", rt.sv(f, "mob"), rt.sv(f, "AI_Interact"));
	}
	$0 = rt.call(f, P("/proc/key_name"), null, [live(f.usr)]);
	if (truthy(rt.sv(f, "AI_Interact"))) {
		$1 = "activated";
	} else {
		$1 = "deactivated";
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ has ＀ Admin AI Interact", [$0, $1])]);
	$0 = rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]);
	if (truthy(rt.sv(f, "AI_Interact"))) {
		$1 = "activated";
	} else {
		$1 = "deactivated";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has ＀ their AI interaction", [$0, $1])]);
	return f.dot;
}, false, { verb: { name: "Toggle Admin AI Interact", category: "Admin", desc: "Allows you to interact with most machines as an AI would as a ghost" } });
