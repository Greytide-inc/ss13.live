// Based on /tg/station's code/modules/admin/admin_verbs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// admin_verbs.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_default", function InitGlobaladmin_verbs_default(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_default";
	return f.dot;
});

// admin_verbs.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_default", function InitGlobaladmin_verbs_default(f: Frame) {
	GLOB.admin_verbs_default = rt.world().AVerbsDefault();
	this.gvars_datum_init_order += "admin_verbs_default";
	return f.dot;
});

// admin_verbs.dm:6
rt.def("/world/proc/AVerbsDefault", function AVerbsDefault(f: Frame) {
	return list(P("/client/proc/deadmin"), P("/client/proc/cmd_admin_say"), P("/client/proc/hide_verbs"), P("/client/proc/hide_most_verbs"), P("/client/proc/debug_variables"), P("/client/proc/dsay"), P("/client/proc/investigate_show"), P("/client/proc/secrets"), P("/client/proc/reload_admins"), P("/client/proc/cmd_admin_pm_context"), P("/client/proc/cmd_admin_pm_panel"), P("/client/proc/cmd_admin_ticket_panel"), P("/client/proc/stop_sounds"));
});

// admin_verbs.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_admin", function InitGlobaladmin_verbs_admin(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_admin";
	return f.dot;
});

// admin_verbs.dm:23
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_admin", function InitGlobaladmin_verbs_admin(f: Frame) {
	GLOB.admin_verbs_admin = rt.world().AVerbsAdmin();
	this.gvars_datum_init_order += "admin_verbs_admin";
	return f.dot;
});

// admin_verbs.dm:25
rt.def("/world/proc/AVerbsAdmin", function AVerbsAdmin(f: Frame) {
	return list(P("/client/proc/invisimin"), P("/datum/admins/proc/show_player_panel"), P("/client/proc/game_panel"), P("/client/proc/check_ai_laws"), P("/datum/admins/proc/toggleooc"), P("/datum/admins/proc/toggleoocdead"), P("/datum/admins/proc/toggleenter"), P("/datum/admins/proc/toggleguests"), P("/datum/admins/proc/announce"), P("/datum/admins/proc/set_admin_notice"), P("/client/proc/admin_ghost"), P("/client/proc/toggle_view_range"), P("/datum/admins/proc/view_txt_log"), P("/datum/admins/proc/view_atk_log"), P("/client/proc/cmd_admin_subtle_message"), P("/client/proc/cmd_admin_delete"), P("/client/proc/cmd_admin_check_contents"), P("/client/proc/check_antagonists"), P("/datum/admins/proc/access_news_network"), P("/client/proc/getserverlog"), P("/client/proc/jumptocoord"), P("/client/proc/Getmob"), P("/client/proc/Getkey"), P("/client/proc/jumptoarea"), P("/client/proc/jumptokey"), P("/client/proc/jumptomob"), P("/client/proc/jumptoturf"), P("/client/proc/admin_call_shuttle"), P("/client/proc/admin_cancel_shuttle"), P("/client/proc/cmd_admin_direct_narrate"), P("/client/proc/cmd_admin_world_narrate"), P("/client/proc/cmd_admin_local_narrate"), P("/client/proc/cmd_admin_create_centcom_report"), P("/client/proc/cmd_change_command_name"), P("/client/proc/toggle_antag_hud"), P("/client/proc/toggle_AI_interact"), P("/client/proc/customiseSNPC"), P("/client/proc/resetSNPC"), P("/client/proc/open_shuttle_manipulator"), P("/client/proc/deadchat"), P("/client/proc/toggleprayers"), P("/client/proc/toggleadminhelpsound"), P("/client/proc/respawn_character"));
});

// admin_verbs.dm:72
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_ban", function InitGlobaladmin_verbs_ban(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_ban";
	return f.dot;
});

// admin_verbs.dm:73
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_ban", function InitGlobaladmin_verbs_ban(f: Frame) {
	GLOB.admin_verbs_ban = list(P("/client/proc/unban_panel"), P("/client/proc/stickybanpanel"));
	this.gvars_datum_init_order += "admin_verbs_ban";
	return f.dot;
});

// admin_verbs.dm:74
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_sounds", function InitGlobaladmin_verbs_sounds(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_sounds";
	return f.dot;
});

// admin_verbs.dm:75
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_sounds", function InitGlobaladmin_verbs_sounds(f: Frame) {
	GLOB.admin_verbs_sounds = list(P("/client/proc/play_local_sound"), P("/client/proc/play_sound"), P("/client/proc/set_round_end_sound"));
	this.gvars_datum_init_order += "admin_verbs_sounds";
	return f.dot;
});

// admin_verbs.dm:76
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_fun", function InitGlobaladmin_verbs_fun(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_fun";
	return f.dot;
});

// admin_verbs.dm:77
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_fun", function InitGlobaladmin_verbs_fun(f: Frame) {
	GLOB.admin_verbs_fun = list(P("/client/proc/cmd_admin_dress"), P("/client/proc/cmd_admin_gib_self"), P("/client/proc/drop_bomb"), P("/client/proc/set_dynex_scale"), P("/client/proc/drop_dynex_bomb"), P("/client/proc/cinematic"), P("/client/proc/one_click_antag"), P("/client/proc/cmd_admin_add_freeform_ai_law"), P("/client/proc/object_say"), P("/client/proc/toggle_random_events"), P("/client/proc/set_ooc"), P("/client/proc/reset_ooc"), P("/client/proc/forceEvent"), P("/client/proc/admin_change_sec_level"), P("/client/proc/toggle_nuke"), P("/client/proc/mass_zombie_infection"), P("/client/proc/mass_zombie_cure"), P("/client/proc/polymorph_all"), P("/client/proc/show_tip"), P("/client/proc/smite"));
	this.gvars_datum_init_order += "admin_verbs_fun";
	return f.dot;
});

// admin_verbs.dm:99
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_spawn", function InitGlobaladmin_verbs_spawn(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_spawn";
	return f.dot;
});

// admin_verbs.dm:100
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_spawn", function InitGlobaladmin_verbs_spawn(f: Frame) {
	GLOB.admin_verbs_spawn = list(P("/datum/admins/proc/spawn_atom"), P("/datum/admins/proc/spawn_many"), P("/datum/admins/proc/spawn_grid"), P("/client/proc/respawn_character"));
	this.gvars_datum_init_order += "admin_verbs_spawn";
	return f.dot;
});

// admin_verbs.dm:101
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_server", function InitGlobaladmin_verbs_server(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_server";
	return f.dot;
});

// admin_verbs.dm:102
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_server", function InitGlobaladmin_verbs_server(f: Frame) {
	GLOB.admin_verbs_server = rt.world().AVerbsServer();
	this.gvars_datum_init_order += "admin_verbs_server";
	return f.dot;
});

// admin_verbs.dm:104
rt.def("/world/proc/AVerbsServer", function AVerbsServer(f: Frame) {
	return list(P("/datum/admins/proc/startnow"), P("/datum/admins/proc/restart"), P("/datum/admins/proc/end_round"), P("/datum/admins/proc/delay"), P("/datum/admins/proc/toggleaban"), P("/client/proc/everyone_random"), P("/datum/admins/proc/toggleAI"), P("/client/proc/cmd_admin_delete"), P("/client/proc/cmd_debug_del_all"), P("/client/proc/toggle_random_events"), P("/client/proc/forcerandomrotate"), P("/client/proc/adminchangemap"));
});

// admin_verbs.dm:120
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug", function InitGlobaladmin_verbs_debug(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_debug";
	return f.dot;
});

// admin_verbs.dm:121
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_debug", function InitGlobaladmin_verbs_debug(f: Frame) {
	GLOB.admin_verbs_debug = rt.world().AVerbsDebug();
	this.gvars_datum_init_order += "admin_verbs_debug";
	return f.dot;
});

// admin_verbs.dm:123
rt.def("/world/proc/AVerbsDebug", function AVerbsDebug(f: Frame) {
	return list(P("/client/proc/zoom_out"), P("/client/proc/zoom_in"), P("/client/proc/zoom_reset"), P("/client/proc/restart_controller"), P("/client/proc/cmd_admin_list_open_jobs"), P("/client/proc/Debug2"), P("/client/proc/cmd_debug_make_powernets"), P("/client/proc/cmd_debug_mob_lists"), P("/client/proc/cmd_admin_delete"), P("/client/proc/cmd_debug_del_all"), P("/client/proc/restart_controller"), P("/client/proc/enable_debug_verbs"), P("/client/proc/callproc"), P("/client/proc/callproc_datum"), P("/client/proc/SDQL2_query"), P("/client/proc/test_movable_UI"), P("/client/proc/test_snap_UI"), P("/client/proc/debugNatureMapGenerator"), P("/client/proc/check_bomb_impacts"), P("/proc/machine_upgrade"), P("/client/proc/populate_world"), P("/client/proc/get_dynex_power"), P("/client/proc/get_dynex_range"), P("/client/proc/set_dynex_scale"), P("/client/proc/cmd_display_del_log"), P("/client/proc/create_outfits"), P("/client/proc/modify_goals"), P("/client/proc/debug_huds"), P("/client/proc/map_template_load"), P("/client/proc/map_template_upload"), P("/client/proc/jump_to_ruin"), P("/client/proc/clear_dynamic_transit"), P("/client/proc/view_runtimes"), P("/client/proc/pump_random_event"), P("/client/proc/cmd_display_init_log"));
});

// admin_verbs.dm:158
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_possess", function InitGlobaladmin_verbs_possess(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_possess";
	return f.dot;
});

// admin_verbs.dm:159
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_possess", function InitGlobaladmin_verbs_possess(f: Frame) {
	GLOB.admin_verbs_possess = list(P("/proc/possess"), P("/proc/release"));
	this.gvars_datum_init_order += "admin_verbs_possess";
	return f.dot;
});

// admin_verbs.dm:166
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_hideable", function InitGlobaladmin_verbs_hideable(f: Frame) {
	parent_proc();
	this.gvars_datum_protected_varlist += "admin_verbs_hideable";
	return f.dot;
});

// admin_verbs.dm:167
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_verbs_hideable", function InitGlobaladmin_verbs_hideable(f: Frame) {
	GLOB.admin_verbs_hideable = list(P("/client/proc/set_ooc"), P("/client/proc/reset_ooc"), P("/client/proc/deadmin"), P("/datum/admins/proc/show_traitor_panel"), P("/datum/admins/proc/toggleenter"), P("/datum/admins/proc/toggleguests"), P("/datum/admins/proc/announce"), P("/datum/admins/proc/set_admin_notice"), P("/client/proc/admin_ghost"), P("/client/proc/toggle_view_range"), P("/datum/admins/proc/view_txt_log"), P("/datum/admins/proc/view_atk_log"), P("/client/proc/cmd_admin_subtle_message"), P("/client/proc/cmd_admin_check_contents"), P("/datum/admins/proc/access_news_network"), P("/client/proc/admin_call_shuttle"), P("/client/proc/admin_cancel_shuttle"), P("/client/proc/cmd_admin_direct_narrate"), P("/client/proc/cmd_admin_world_narrate"), P("/client/proc/cmd_admin_local_narrate"), P("/client/proc/play_local_sound"), P("/client/proc/play_sound"), P("/client/proc/set_round_end_sound"), P("/client/proc/cmd_admin_dress"), P("/client/proc/cmd_admin_gib_self"), P("/client/proc/drop_bomb"), P("/client/proc/drop_dynex_bomb"), P("/client/proc/get_dynex_range"), P("/client/proc/get_dynex_power"), P("/client/proc/set_dynex_scale"), P("/client/proc/cinematic"), P("/client/proc/cmd_admin_add_freeform_ai_law"), P("/client/proc/cmd_admin_create_centcom_report"), P("/client/proc/cmd_change_command_name"), P("/client/proc/object_say"), P("/client/proc/toggle_random_events"), P("/datum/admins/proc/startnow"), P("/datum/admins/proc/restart"), P("/datum/admins/proc/delay"), P("/datum/admins/proc/toggleaban"), P("/client/proc/everyone_random"), P("/datum/admins/proc/toggleAI"), P("/client/proc/restart_controller"), P("/client/proc/cmd_admin_list_open_jobs"), P("/client/proc/callproc"), P("/client/proc/callproc_datum"), P("/client/proc/Debug2"), P("/client/proc/reload_admins"), P("/client/proc/cmd_debug_make_powernets"), P("/client/proc/startSinglo"), P("/client/proc/cmd_debug_mob_lists"), P("/client/proc/cmd_debug_del_all"), P("/client/proc/enable_debug_verbs"), P("/proc/possess"), P("/proc/release"), P("/client/proc/reload_admins"), P("/client/proc/admin_change_sec_level"), P("/client/proc/toggle_nuke"), P("/client/proc/cmd_display_del_log"), P("/client/proc/toggle_antag_hud"), P("/client/proc/debug_huds"), P("/client/proc/customiseSNPC"), P("/client/proc/resetSNPC"));
	this.gvars_datum_init_order += "admin_verbs_hideable";
	return f.dot;
});

// admin_verbs.dm:238
rt.def("/client/proc/add_admin_verbs", function add_admin_verbs(f: Frame) {
	let path: Value = null;
	if (!this.holder) return f.dot;
	this.control_freak = 6;
	let rights: Value = this.holder.rank.rights;
	this.verbs += GLOB.admin_verbs_default;
	if (rt.bitAnd(rights, 1)) {
		this.verbs += P("/client/proc/togglebuildmodeself");
	}
	if (rt.bitAnd(rights, 2)) {
		this.verbs += GLOB.admin_verbs_admin;
	}
	if (rt.bitAnd(rights, 4)) {
		this.verbs += GLOB.admin_verbs_ban;
	}
	if (rt.bitAnd(rights, 8)) {
		this.verbs += GLOB.admin_verbs_fun;
	}
	if (rt.bitAnd(rights, 16)) {
		this.verbs += GLOB.admin_verbs_server;
	}
	if (rt.bitAnd(rights, 32)) {
		this.verbs += GLOB.admin_verbs_debug;
	}
	if (rt.bitAnd(rights, 64)) {
		this.verbs += GLOB.admin_verbs_possess;
	}
	if (rt.bitAnd(rights, 256)) {
		this.verbs += P("/client/proc/stealth");
	}
	if (rt.bitAnd(rights, 2048)) {
		this.verbs += GLOB.admin_verbs_sounds;
	}
	if (rt.bitAnd(rights, 4096)) {
		this.verbs += GLOB.admin_verbs_spawn;
	}
	for (path of each(this.holder.rank.adds)) {
		this.verbs += path;
	}
	path = null;
	for (path of each(this.holder.rank.subs)) {
		this.verbs -= path;
	}
	return f.dot;
});

// admin_verbs.dm:271
rt.def("/client/proc/remove_admin_verbs", function remove_admin_verbs(f: Frame) {
	this.verbs.Remove(GLOB.admin_verbs_default, P("/client/proc/togglebuildmodeself"), GLOB.admin_verbs_admin, GLOB.admin_verbs_ban, GLOB.admin_verbs_fun, GLOB.admin_verbs_server, GLOB.admin_verbs_debug, GLOB.admin_verbs_possess, P("/client/proc/stealth"), GLOB.admin_verbs_sounds, GLOB.admin_verbs_spawn, P("/client/proc/Cell"), P("/client/proc/camera_view"), P("/client/proc/sec_camera_report"), P("/client/proc/intercom_view"), P("/client/proc/air_status"), P("/client/proc/atmosscan"), P("/client/proc/powerdebug"), P("/client/proc/count_objects_on_z_level"), P("/client/proc/count_objects_all"), P("/client/proc/cmd_assume_direct_control"), P("/client/proc/startSinglo"), P("/client/proc/set_server_fps"), P("/client/proc/cmd_admin_grantfullaccess"), P("/client/proc/cmd_admin_areatest"), P("/client/proc/readmin"));
	if (!this.holder) return f.dot;
	this.verbs.Remove(this.holder.rank.adds);
	return f.dot;
});

// admin_verbs.dm:309
rt.def("/client/proc/hide_most_verbs", function hide_most_verbs(f: Frame) {
	this.verbs.Remove(P("/client/proc/hide_most_verbs"), GLOB.admin_verbs_hideable);
	this.verbs += P("/client/proc/show_verbs");
	to_chat(this, "<span class='interface'>Most of your adminverbs have been hidden.</span>");
	return f.dot;
}, false, { verb: { name: "Adminverbs - Hide Most", category: "Admin" } });

// admin_verbs.dm:320
rt.def("/client/proc/hide_verbs", function hide_verbs(f: Frame) {
	this.remove_admin_verbs();
	this.verbs += P("/client/proc/show_verbs");
	to_chat(this, "<span class='interface'>Almost all of your adminverbs have been hidden.</span>");
	return f.dot;
}, false, { verb: { name: "Adminverbs - Hide All", category: "Admin" } });

// admin_verbs.dm:331
rt.def("/client/proc/show_verbs", function show_verbs(f: Frame) {
	this.verbs -= P("/client/proc/show_verbs");
	this.add_admin_verbs();
	to_chat(this, "<span class='interface'>All of your adminverbs are now visible.</span>");
	return f.dot;
}, false, { verb: { name: "Adminverbs - Show", category: "Admin" } });

// admin_verbs.dm:343
rt.def("/client/proc/admin_ghost", function* admin_ghost(f: Frame) {
	let ghost: Value = null, body: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if (rt.istype(this.mob, T("/mob/dead/observer"))) {
		if (!(ghost = this.mob).mind || !ghost.mind.current) {
			return f.dot;
		}
		if (!ghost.can_reenter_corpse) {
			log_admin(`${key_name(f.usr)} re-entered corpse`);
			message_admins(`${key_name_admin(f.usr)} re-entered corpse`);
		}
		ghost.can_reenter_corpse = 1;
		yield* ghost.reenter_corpse();
	} else if (rt.istype(this.mob, T("/mob/dead/new_player"))) {
		to_chat(this, "<font color='red'>Error: Aghost: Can't admin-ghost whilst in the lobby. Join or Observe first.</font>");
	} else {
		log_admin(`${key_name(f.usr)} admin ghosted.`);
		message_admins(`${key_name_admin(f.usr)} admin ghosted.`);
		yield* (body = this.mob).ghostize(1);
		if (body && !body.key) {
			body.key = `@${this.key}`;
		}
	}
	return f.dot;
}, true, { verb: { name: "Aghost", category: "Admin" } });

// admin_verbs.dm:373
rt.def("/client/proc/invisimin", function invisimin(f: Frame) {
	if (!(this.holder && this.mob)) return f.dot;
	if (this.mob.invisibility == 60) {
		this.mob.invisibility = rt.initial(f, this.mob, "invisibility");
		to_chat(this.mob, "<span class='boldannounce'>Invisimin off. Invisibility reset.</span>");
	} else {
		this.mob.invisibility = 60;
		to_chat(this.mob, "<span class='adminnotice'><b>Invisimin on. You are now as invisible as a ghost.</b></span>");
	}
	return f.dot;
}, false, { verb: { name: "Invisimin", category: "Admin", desc: "Toggles ghost-like invisibility (Don't abuse this)" } });

// admin_verbs.dm:385
rt.def("/client/proc/check_antagonists", function* check_antagonists(f: Frame) {
	if (this.holder) {
		yield* this.holder.check_antagonists();
		log_admin(`${key_name(f.usr)} checked antagonists.`);
		if (!rt.istype(f.usr, T("/mob/dead/observer"))) {
			message_admins(`${key_name_admin(f.usr)} checked antagonists.`);
		}
	}
	return f.dot;
}, true, { verb: { name: "Check Antagonists", category: "Admin" } });

// admin_verbs.dm:395
rt.def("/client/proc/unban_panel", function unban_panel(f: Frame) {
	if (this.holder) {
		this.holder.unbanpanel();
	}
	return f.dot;
}, false, { verb: { name: "Unban Panel", category: "Admin" } });

// admin_verbs.dm:405
rt.def("/client/proc/game_panel", function game_panel(f: Frame) {
	if (this.holder) {
		this.holder.Game();
	}
	return f.dot;
}, false, { verb: { name: "Game Panel", category: "Admin" } });

// admin_verbs.dm:412
rt.def("/client/proc/secrets", function secrets(f: Frame) {
	if (this.holder) {
		this.holder.Secrets();
	}
	return f.dot;
}, false, { verb: { name: "Secrets", category: "Admin" } });

// admin_verbs.dm:418
rt.def("/client/proc/findStealthKey", function findStealthKey(f: Frame, txt: Value) {
	let _P: Value = null;
	if (txt) {
		for (_P of each(GLOB.stealthminID)) {
			if (rt.index(GLOB.stealthminID, _P) == txt) {
				return _P;
			}
		}
	}
	return (txt = rt.index(GLOB.stealthminID, this.ckey));
});

// admin_verbs.dm:425
rt.def("/client/proc/createStealthKey", function createStealthKey(f: Frame) {
	let _P: Value = null;
	let num: Value = rand(0, 1000);
	let i: Value = 0;
	while (i == 0) {
		i = 1;
		_P = null;
		for (_P of each(GLOB.stealthminID)) {
			if (num == rt.index(GLOB.stealthminID, _P)) {
				num++;
				i = 0;
			}
		}
	}
	rt.setAt(GLOB.stealthminID, `${this.ckey}`, `@${num2text(num)}`);
	return f.dot;
});

// admin_verbs.dm:439
rt.def("/client/proc/stealth", function* stealth(f: Frame) {
	let new_key: Value = null;
	if (this.holder) {
		if (this.holder.fakekey) {
			this.holder.fakekey = null;
			if (rt.istype(this.mob, T("/mob/dead/observer"))) {
				this.mob.invisibility = rt.initial(f, this.mob, "invisibility");
				this.mob.alpha = rt.initial(f, this.mob, "alpha");
				this.mob.name = rt.initial(f, this.mob, "name");
				this.mob.mouse_opacity = rt.initial(f, this.mob, "mouse_opacity");
			}
		} else {
			if (!(new_key = ckeyEx((yield* g.op(f, "Prompt", [3], [null, this.key, "Fake Key", "Enter your desired display name.", null]))))) {
				return f.dot;
			}
			if (rt.length(new_key) >= 26) {
				new_key = copytext(new_key, 1, 26);
			}
			this.holder.fakekey = new_key;
			this.createStealthKey();
			if (rt.istype(this.mob, T("/mob/dead/observer"))) {
				this.mob.invisibility = INVISIBILITY_MAXIMUM;
				this.mob.alpha = 0;
				this.mob.name = " ";
				this.mob.mouse_opacity = 0;
			}
		}
		log_admin(`${key_name(f.usr)} has turned stealth mode ${this.holder.fakekey ? "ON" : "OFF"}`);
		message_admins(`${key_name_admin(f.usr)} has turned stealth mode ${this.holder.fakekey ? "ON" : "OFF"}`);
	}
	return f.dot;
}, true, { verb: { name: "Stealth Mode", category: "Admin" } });

// admin_verbs.dm:469
rt.def("/client/proc/drop_bomb", function* drop_bomb(f: Frame) {
	let devastation_range: Value = null, heavy_impact_range: Value = null, light_impact_range: Value = null, flash_range: Value = null;
	let choices: Value = list("Small Bomb (1, 2, 3, 3)", "Medium Bomb (2, 3, 4, 4)", "Big Bomb (3, 5, 7, 5)", "Maxcap", "Custom Bomb");
	let choice: Value = (yield* g.op(f, "Prompt", [1], [null, null, null, "What size explosion would you like to produce? WARNING: These ignore the maxcap", choices]));
	let epicenter: Value = this.mob.loc;
	if (choice == null) {
		return 0;
	} else if (choice === "Small Bomb (1, 2, 3, 3)") {
		yield* explosion(epicenter, 1, 2, 3, 3, 1, 1);
	} else if (choice === "Medium Bomb (2, 3, 4, 4)") {
		yield* explosion(epicenter, 2, 3, 4, 4, 1, 1);
	} else if (choice === "Big Bomb (3, 5, 7, 5)") {
		yield* explosion(epicenter, 3, 5, 7, 5, 1, 1);
	} else if (choice === "Maxcap") {
		yield* explosion(epicenter, GLOB.MAX_EX_DEVESTATION_RANGE, GLOB.MAX_EX_HEAVY_RANGE, GLOB.MAX_EX_LIGHT_RANGE, GLOB.MAX_EX_FLASH_RANGE);
	} else if (choice === "Custom Bomb") {
		if ((devastation_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Devastation range (in tiles):", null]))) === null) {
			return f.dot;
		}
		if ((heavy_impact_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Heavy impact range (in tiles):", null]))) === null) {
			return f.dot;
		}
		if ((light_impact_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Light impact range (in tiles):", null]))) === null) {
			return f.dot;
		}
		if ((flash_range = (yield* g.op(f, "Prompt", [33], [null, null, null, "Flash range (in tiles):", null]))) === null) {
			return f.dot;
		}
		if (devastation_range > GLOB.MAX_EX_DEVESTATION_RANGE || heavy_impact_range > GLOB.MAX_EX_HEAVY_RANGE || light_impact_range > GLOB.MAX_EX_LIGHT_RANGE || flash_range > GLOB.MAX_EX_FLASH_RANGE) {
			if ((yield* alert("Bomb is bigger than the maxcap. Continue?", null, "Yes", "No")) != "Yes") {
				return f.dot;
			}
		}
		yield* explosion((epicenter = this.mob.loc), devastation_range, heavy_impact_range, light_impact_range, flash_range, 1, 1);
	}
	message_admins(`${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} creating an admin explosion at ${epicenter.loc}.`);
	log_admin(`${key_name(f.usr)} created an admin explosion at ${epicenter.loc}.`);
	return f.dot;
}, true, { verb: { name: "Drop Bomb", category: "Special Verbs", desc: "Cause an explosion of varying strength at your location." } });

// admin_verbs.dm:510
rt.def("/client/proc/drop_dynex_bomb", function* drop_dynex_bomb(f: Frame) {
	let ex_power: Value = (yield* g.op(f, "Prompt", [33], [null, null, null, "Explosive Power:", null]));
	let epicenter: Value = this.mob.loc;
	if (!(ex_power && epicenter)) return f.dot;
	dyn_explosion(epicenter, ex_power);
	message_admins(`${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} creating an admin explosion at ${epicenter.loc}.`);
	log_admin(`${key_name(f.usr)} created an admin explosion at ${epicenter.loc}.`);
	return f.dot;
}, true, { verb: { name: "Drop DynEx Bomb", category: "Special Verbs", desc: "Cause an explosion of varying strength at your location." } });

// admin_verbs.dm:523
rt.def("/client/proc/get_dynex_range", function* get_dynex_range(f: Frame) {
	let ex_power: Value = (yield* g.op(f, "Prompt", [33], [null, null, null, "Explosive Power:", null]));
	let range: Value = round((2 * ex_power) ** GLOB.DYN_EX_SCALE);
	to_chat(f.usr, `Estimated Explosive Range: (Devestation: ${round(range * 0.25)}, Heavy: ${round(range * 0.5)}, Light: ${round(range)})`);
	return f.dot;
}, true, { verb: { name: "Get DynEx Range", category: "Debug", desc: "Get the estimated range of a bomb, using explosive power." } });

// admin_verbs.dm:532
rt.def("/client/proc/get_dynex_power", function* get_dynex_power(f: Frame) {
	let ex_range: Value = (yield* g.op(f, "Prompt", [33], [null, null, null, "Light Explosion Range:", null]));
	let power: Value = (0.5 * ex_range) ** (1 / GLOB.DYN_EX_SCALE);
	to_chat(f.usr, `Estimated Explosive Power: ${power}`);
	return f.dot;
}, true, { verb: { name: "Get DynEx Power", category: "Debug", desc: "Get the estimated required power of a bomb, to reach a specific range." } });

// admin_verbs.dm:541
rt.def("/client/proc/set_dynex_scale", function* set_dynex_scale(f: Frame) {
	let ex_scale: Value = null;
	if (!(ex_scale = (yield* g.op(f, "Prompt", [33], [null, null, null, "New DynEx Scale:", null])))) {
		return f.dot;
	}
	GLOB.DYN_EX_SCALE = ex_scale;
	log_admin(`${key_name(f.usr)} has modified Dynamic Explosion Scale: ${ex_scale}`);
	message_admins(`${key_name_admin(f.usr)} has  modified Dynamic Explosion Scale: ${ex_scale}`);
	return f.dot;
}, true, { verb: { name: "Set DynEx Scale", category: "Debug", desc: "Set the scale multiplier of dynex explosions. The default is 0.5." } });

// admin_verbs.dm:553
rt.def("/client/proc/give_spell", function* give_spell(f: Frame, _T: Value) {
	let A: Value = null, S: Value = null;
	let spell_list: Value = list();
	let type_length: Value = rt.length("/obj/effect/proc_holder/spell") + 2;
	for (A of each(GLOB.spells)) {
		rt.setAt(spell_list, copytext(`${A}`, type_length), A);
	}
	if (!(S = (yield* g.op(f, "Prompt", [1], [null, null, "ABRAKADABRA", "Choose the spell to give to that guy", spell_list])))) {
		return f.dot;
	}
	log_admin(`${key_name(f.usr)} gave ${key_name(_T)} the spell ${S}.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} gave ${key_name(_T)} the spell ${S}.</span>`);
	S = rt.index(spell_list, S);
	if (_T.mind) {
		yield* _T.mind.AddSpell((yield* new_(S)));
	} else {
		yield* _T.AddSpell((yield* new_(S)));
		message_admins("<span class='danger'>Spells given to mindless mobs will not be transferred in mindswap or cloning!</span>");
	}
	return f.dot;
}, true, { verb: { name: "Give Spell", category: "Fun", desc: "Gives a spell to a mob." }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// admin_verbs.dm:577
rt.def("/client/proc/remove_spell", function* remove_spell(f: Frame, _T: Value) {
	let S: Value = null;
	if (!(_T && _T.mind)) return f.dot;
	if (!(S = (yield* g.op(f, "Prompt", [1], [null, null, "NO ABRAKADABRA", "Choose the spell to remove", _T.mind.spell_list])))) return f.dot;
	yield* _T.mind.RemoveSpell(S);
	log_admin(`${key_name(f.usr)} removed the spell ${S} from ${key_name(_T)}.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} removed the spell ${S} from ${key_name(_T)}.</span>`);
	return f.dot;
}, true, { verb: { name: "Remove Spell", category: "Fun", desc: "Remove a spell from the selected mob." }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// admin_verbs.dm:589
rt.def("/client/proc/give_disease", function* give_disease(f: Frame, _T: Value) {
	let D: Value = null;
	if (!(D = (yield* g.op(f, "Prompt", [1], [null, null, "ACHOO", "Choose the disease to give to that guy", GLOB.SSdisease.diseases])))) {
		return f.dot;
	}
	yield* _T.ForceContractDisease((yield* new_(D)));
	log_admin(`${key_name(f.usr)} gave ${key_name(_T)} the disease ${D}.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} gave ${key_name(_T)} the disease ${D}.</span>`);
	return f.dot;
}, true, { verb: { name: "Give Disease", category: "Fun", desc: "Gives a Disease to a mob." }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// admin_verbs.dm:600
rt.def("/client/proc/object_say", function* object_say(f: Frame, O: Value) {
	let message: Value = null;
	if (!(message = (yield* g.op(f, "Prompt", [3], [null, "Make Sound", "What do you want the message to be?", f.usr, null])))) {
		return f.dot;
	}
	yield* O.say(message);
	log_admin(`${key_name(f.usr)} made ${O} at ${O.x}, ${O.y}, ${O.z} say "${message}"`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} made ${O} at ${O.x}, ${O.y}, ${O.z}. say "${message}"</span>`);
	return f.dot;
}, true, { verb: { name: "OSay", category: "Special Verbs", desc: "Makes an object say something." }, argTypes: [{ type: 4, path: "/obj", source: "world" }] });

// admin_verbs.dm:610
rt.def("/client/proc/togglebuildmodeself", function* togglebuildmodeself(f: Frame) {
	if (this.mob) {
		yield* togglebuildmode(this.mob);
	}
	return f.dot;
}, true, { verb: { name: "Toggle Build Mode Self", category: "Special Verbs" } });

// admin_verbs.dm:618
rt.def("/client/proc/check_ai_laws", function check_ai_laws(f: Frame) {
	if (!this.holder) return f.dot;
	this.holder.output_ai_laws();
	return f.dot;
}, false, { verb: { name: "Check AI Laws", category: "Admin" } });

// admin_verbs.dm:625
rt.def("/client/proc/deadmin", function* deadmin(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	if (this.has_antag_hud()) {
		this.toggle_antag_hud();
	}
	this.holder.disassociate();
	yield* qdel(this.holder);
	GLOB.deadmins += this.ckey;
	GLOB.admin_datums -= this.ckey;
	this.verbs += P("/client/proc/readmin");
	to_chat(this, "<span class='interface'>You are now a normal player.</span>");
	log_admin(`${this} deadmined themself.`);
	message_admins(`${this} deadmined themself.`);
	return f.dot;
}, true, { verb: { name: "Deadmin", category: "Admin", desc: "Shed your admin powers." } });

// admin_verbs.dm:648
rt.def("/client/proc/readmin", function* readmin(f: Frame) {
	yield* load_admins(this.ckey);
	if (!this.holder) {
		return f.dot;
	}
	GLOB.deadmins -= this.ckey;
	this.verbs -= P("/client/proc/readmin");
	to_chat(this, "<span class='interface'>You are now an admin.</span>");
	message_admins(`${this} re-adminned themselves.`);
	log_admin(`${this} re-adminned themselves.`);
	return f.dot;
}, true, { verb: { name: "Readmin", category: "Admin", desc: "Regain your admin powers." } });

// admin_verbs.dm:666
rt.def("/client/proc/populate_world", function* populate_world(f: Frame, amount: Value) {
	let area: Value = null, candidates: Value = null, tile: Value = null, j: Value = null, k: Value = null, i: Value = null;
	let $e: any;
	amount ??= 50;
	if (!(amount > 0)) return f.dot;
	rt.forRange(f, 0, 1, amount, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		j = 100;
		while (true) {
			if (area = pick(GLOB.the_station_areas)) {
				if (rt.len(f, (candidates = get_area_turfs(area)))) {
					k = 100;
					while ((!(tile = pick(candidates)) || !rt.istype(tile, T("/turf/open/floor"))) && --k > 0) {
					}
					if (tile) {
						yield* new_(T("/mob/living/carbon/human/interactive"), tile);
					}
				}
			}
			if (!(!area && --j > 0)) break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Populate World", category: "Debug", desc: "(\"Amount of mobs to create\") Populate the world with test mobs." }, argTypes: [{ type: 32 }] });

// admin_verbs.dm:699
rt.def("/client/proc/toggle_AI_interact", function toggle_AI_interact(f: Frame) {
	this.AI_Interact = (!this.AI_Interact ? 1 : 0);
	if (this.mob && IsAdminGhost(this.mob)) {
		this.mob.has_unlimited_silicon_privilege = this.AI_Interact;
	}
	let $0: any = key_name(f.usr);
	log_admin(`${$0} has ${this.AI_Interact ? "activated" : "deactivated"} Admin AI Interact`);
	message_admins(`${key_name_admin(f.usr)} has ${this.AI_Interact ? "activated" : "deactivated"} their AI interaction`);
	return f.dot;
}, false, { verb: { name: "Toggle Admin AI Interact", category: "Admin", desc: "Allows you to interact with most machines as an AI would as a ghost" } });
