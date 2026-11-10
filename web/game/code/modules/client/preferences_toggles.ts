// Based on /tg/station's code/modules/client/preferences_toggles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(871, "/datum/verbs/menu/Settings", "/datum/verbs/menu", {});

// preferences_toggles.dm:8
rt.def("/datum/verbs/menu/Settings/proc/Set_checked", function Set_checked(f: Frame, C: Value, verbpath: Value) {
	let checked: Value = null;
	if (this.checkbox == CHECKBOX_GROUP) {
		rt.setAt(C.prefs.menuoptions, this.type, verbpath);
	} else {
		if (this.checkbox != CHECKBOX_TOGGLE) return f.dot;
		checked = this.Get_checked(C);
		rt.setAt(C.prefs.menuoptions, this.type, (!checked ? 1 : 0));
		winset(C, `${verbpath}`, `is-checked = ${(!checked ? 1 : 0)}`);
	}
	return f.dot;
});

// preferences_toggles.dm:19
rt.def("/datum/verbs/menu/Settings/verb/setup_character", function* setup_character(f: Frame) {
	f.usr.client.prefs.current_tab = 1;
	yield* f.usr.client.prefs.ShowChoices(f.usr);
	return f.dot;
}, true, { verb: { name: "Game Preferences", category: "Preferences", desc: "Open Game Preferences Window" } });

rt.type(874, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:30
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears/verb/toggle_ghost_ears", function toggle_ghost_ears(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "chat_toggles", 4, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.chat_toggles, 4)) {
		$1 = "see all speech in the world";
	} else {
		$1 = "only see speech from nearby mobs";
	}
	to_chat($0, `As a ghost, you will now ${$1}.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostEars", category: "Preferences", desc: "See All Speech" } });

// preferences_toggles.dm:35
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.chat_toggles, 4);
});

rt.type(875, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:41
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight/verb/toggle_ghost_sight", function toggle_ghost_sight(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "chat_toggles", 8, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.chat_toggles, 8)) {
		$1 = "see all emotes in the world";
	} else {
		$1 = "only see emotes from nearby mobs";
	}
	to_chat($0, `As a ghost, you will now ${$1}.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostSight", category: "Preferences", desc: "See All Emotes" } });

// preferences_toggles.dm:46
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.chat_toggles, 8);
});

rt.type(876, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:52
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers/verb/toggle_ghost_whispers", function toggle_ghost_whispers(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "chat_toggles", 128, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.chat_toggles, 128)) {
		$1 = "see all whispers in the world";
	} else {
		$1 = "only see whispers from nearby mobs";
	}
	to_chat($0, `As a ghost, you will now ${$1}.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostWhispers", category: "Preferences", desc: "See All Whispers" } });

// preferences_toggles.dm:57
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.chat_toggles, 128);
});

rt.type(877, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:63
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio/verb/toggle_ghost_radio", function toggle_ghost_radio(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "chat_toggles", 512, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.chat_toggles, 512)) {
		$1 = "see radio chatter";
	} else {
		$1 = "not see radio chatter";
	}
	to_chat($0, `As a ghost, you will now ${$1}.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostRadio", category: "Preferences", desc: "See All Radio Chatter" } });

// preferences_toggles.dm:68
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.chat_toggles, 512);
});

rt.type(878, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:74
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda/verb/toggle_ghost_pda", function toggle_ghost_pda(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "chat_toggles", 256, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.chat_toggles, 256)) {
		$1 = "see all pda messages in the world";
	} else {
		$1 = "only see pda messages from nearby mobs";
	}
	to_chat($0, `As a ghost, you will now ${$1}.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostPDA", category: "Preferences", desc: "See All PDA Messages" } });

// preferences_toggles.dm:79
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.chat_toggles, 256);
});

rt.type(880, "/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle", "/datum/verbs/menu/Settings/Ghost/chatterbox/Events", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:89
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle/verb/toggle_deathrattle", function toggle_deathrattle(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "toggles", 4096, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.toggles, 4096)) {
		$1 = "no longer";
	} else {
		$1 = "now";
	}
	to_chat($0, `You will ${$1} get messages when a sentient mob dies.`);
	return f.dot;
}, false, { verb: { name: "Toggle Deathrattle", category: "Preferences", desc: "Death" } });

// preferences_toggles.dm:94
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return (!rt.bitAnd(C.prefs.toggles, 4096) ? 1 : 0);
});

rt.type(881, "/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle", "/datum/verbs/menu/Settings/Ghost/chatterbox/Events", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:100
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle/verb/toggle_arrivalrattle", function toggle_arrivalrattle(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "toggles", 8192, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.toggles, 8192)) {
		$1 = "no longer";
	} else {
		$1 = "now";
	}
	to_chat($0, `You will ${$1} get messages when someone joins the station.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Toggle Arrivalrattle", category: "Preferences", desc: "New Player Arrival" } });

// preferences_toggles.dm:105
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return (!rt.bitAnd(C.prefs.toggles, 8192) ? 1 : 0);
});

rt.type(882, "/datum/verbs/menu/Settings/Ghost/togglemidroundantag", "/datum/verbs/menu/Settings/Ghost", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:111
rt.def("/datum/verbs/menu/Settings/Ghost/togglemidroundantag/verb/togglemidroundantag", function togglemidroundantag(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "toggles", 64, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.toggles, 64)) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	to_chat($0, `You will ${$1} be considered for midround antagonist positions.`);
	return f.dot;
}, false, { verb: { name: "Toggle Midround Antagonist", category: "Preferences", desc: "Midround Antagonist" } });

// preferences_toggles.dm:116
rt.def("/datum/verbs/menu/Settings/Ghost/togglemidroundantag/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 64);
});

rt.type(884, "/datum/verbs/menu/Settings/Sound/toggletitlemusic", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:122
rt.def("/datum/verbs/menu/Settings/Sound/toggletitlemusic/verb/toggletitlemusic", function* toggletitlemusic(f: Frame) {
	(rt.modField(f, f.usr.client.prefs, "toggles", 8, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	if (rt.bitAnd(f.usr.client.prefs.toggles, 8)) {
		to_chat(f.usr, "You will now hear music in the game lobby.");
		if (rt.istype(f.usr, T("/mob/dead/new_player"))) {
			yield* f.usr.client.playtitlemusic();
		}
	} else {
		to_chat(f.usr, "You will no longer hear music in the game lobby.");
		f.usr.stop_sound_channel(1024);
	}
	return f.dot;
}, true, { verb: { name: "Hear/Silence LobbyMusic", category: "Preferences", desc: "Hear Music In Lobby" } });

// preferences_toggles.dm:133
rt.def("/datum/verbs/menu/Settings/Sound/toggletitlemusic/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 8);
});

rt.type(885, "/datum/verbs/menu/Settings/Sound/togglemidis", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:140
rt.def("/datum/verbs/menu/Settings/Sound/togglemidis/verb/togglemidis", function togglemidis(f: Frame) {
	(rt.modField(f, f.usr.client.prefs, "toggles", 2, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	if (rt.bitAnd(f.usr.client.prefs.toggles, 2)) {
		to_chat(f.usr, "You will now hear any sounds uploaded by admins.");
	} else {
		to_chat(f.usr, "You will no longer hear sounds uploaded by admins");
		f.usr.stop_sound_channel(1023);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Midis", category: "Preferences", desc: "Hear Admin Triggered Sounds (Midis)" } });

// preferences_toggles.dm:149
rt.def("/datum/verbs/menu/Settings/Sound/togglemidis/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 2);
});

rt.type(886, "/datum/verbs/menu/Settings/Sound/toggle_instruments", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:156
rt.def("/datum/verbs/menu/Settings/Sound/toggle_instruments/verb/toggle_instruments", function toggle_instruments(f: Frame) {
	(rt.modField(f, f.usr.client.prefs, "toggles", 128, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	if (rt.bitAnd(f.usr.client.prefs.toggles, 128)) {
		to_chat(f.usr, "You will now hear people playing musical instruments.");
	} else {
		to_chat(f.usr, "You will no longer hear musical instruments.");
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Instruments", category: "Preferences", desc: "Hear In-game Instruments" } });

// preferences_toggles.dm:164
rt.def("/datum/verbs/menu/Settings/Sound/toggle_instruments/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 128);
});

rt.type(887, "/datum/verbs/menu/Settings/Sound/Toggle_Soundscape", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:171
rt.def("/datum/verbs/menu/Settings/Sound/Toggle_Soundscape/verb/Toggle_Soundscape", function Toggle_Soundscape(f: Frame) {
	(rt.modField(f, f.usr.client.prefs, "toggles", 4, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	if (rt.bitAnd(f.usr.client.prefs.toggles, 4)) {
		to_chat(f.usr, "You will now hear ambient sounds.");
	} else {
		to_chat(f.usr, "You will no longer hear ambient sounds.");
		rt.op(f, "Output", [], [f.usr, sound(null, { repeat: 0, wait: 0, volume: 0, channel: 1 })], false);
		rt.op(f, "Output", [], [f.usr, sound(null, { repeat: 0, wait: 0, volume: 0, channel: 2 })], false);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Ambience", category: "Preferences", desc: "Hear Ambient Sound Effects" } });

// preferences_toggles.dm:181
rt.def("/datum/verbs/menu/Settings/Sound/Toggle_Soundscape/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 4);
});

rt.type(888, "/datum/verbs/menu/Settings/Sound/toggle_ship_ambience", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:188
rt.def("/datum/verbs/menu/Settings/Sound/toggle_ship_ambience/verb/toggle_ship_ambience", function toggle_ship_ambience(f: Frame) {
	(rt.modField(f, f.usr.client.prefs, "toggles", 256, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	if (rt.bitAnd(f.usr.client.prefs.toggles, 256)) {
		to_chat(f.usr, "You will now hear ship ambience.");
	} else {
		to_chat(f.usr, "You will no longer hear ship ambience.");
		rt.op(f, "Output", [], [f.usr, sound(null, { repeat: 0, wait: 0, volume: 0, channel: 2 })], false);
		f.usr.client.ambience_playing = 0;
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Ship Ambience", category: "Preferences", desc: "Hear Ship Ambience Roar" } });

// preferences_toggles.dm:198
rt.def("/datum/verbs/menu/Settings/Sound/toggle_ship_ambience/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 256);
});

rt.type(889, "/datum/verbs/menu/Settings/Sound/toggle_announcement_sound", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:205
rt.def("/datum/verbs/menu/Settings/Sound/toggle_announcement_sound/verb/toggle_announcement_sound", function toggle_announcement_sound(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "toggles", 2048, rt.bitXor));
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.toggles, 2048)) {
		$1 = "hear announcement sounds";
	} else {
		$1 = "no longer hear announcements";
	}
	to_chat($0, `You will now ${$1}.`);
	f.usr.client.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Hear/Silence Announcements", category: "Preferences", desc: "Hear Announcement Sound" } });

// preferences_toggles.dm:210
rt.def("/datum/verbs/menu/Settings/Sound/toggle_announcement_sound/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 2048);
});

rt.type(890, "/datum/verbs/menu/Settings/Sound/toggleprayersounds", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:217
rt.def("/datum/verbs/menu/Settings/Sound/toggleprayersounds/verb/toggleprayersounds", function toggleprayersounds(f: Frame) {
	(rt.modField(f, f.usr.client.prefs, "toggles", 512, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	if (rt.bitAnd(f.usr.client.prefs.toggles, 512)) {
		to_chat(f.usr, "You will now hear prayer sounds.");
	} else {
		to_chat(f.usr, "You will no longer prayer sounds.");
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Prayer Sounds", category: "Preferences", desc: "Hear Prayer Sounds" } });

// preferences_toggles.dm:225
rt.def("/datum/verbs/menu/Settings/Sound/toggleprayersounds/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.toggles, 512);
});

rt.type(883, "/datum/verbs/menu/Settings/Sound", "/datum/verbs/menu/Settings", {});

// preferences_toggles.dm:232
rt.def("/datum/verbs/menu/Settings/Sound/verb/stop_client_sounds", function stop_client_sounds(f: Frame) {
	rt.op(f, "Output", [], [f.usr, sound(null)], false);
	return f.dot;
}, false, { verb: { name: "Stop Sounds", category: "Preferences", desc: "Stop Current Sounds" } });

rt.type(891, "/datum/verbs/menu/Settings/listen_ooc", "/datum/verbs/menu/Settings", {
	abstract: 1,
	checkbox: 2,
});

// preferences_toggles.dm:240
rt.def("/datum/verbs/menu/Settings/listen_ooc/verb/listen_ooc", function listen_ooc(f: Frame) {
	let $1: any;
	(rt.modField(f, f.usr.client.prefs, "chat_toggles", 1, rt.bitXor));
	f.usr.client.prefs.save_preferences();
	let $0: any = f.usr;
	if (rt.bitAnd(f.usr.client.prefs.chat_toggles, 1)) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	to_chat($0, `You will ${$1} see messages on the OOC channel.`);
	return f.dot;
}, false, { verb: { name: "Show/Hide OOC", category: "Preferences", desc: "Show OOC Chat" } });

// preferences_toggles.dm:245
rt.def("/datum/verbs/menu/Settings/listen_ooc/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(C.prefs.chat_toggles, 1);
});

// preferences_toggles.dm:248
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_forms", function InitGlobalghost_forms(f: Frame) {
	GLOB.ghost_forms = list("ghost", "ghostking", "ghostian2", "skeleghost", "ghost_red", "ghost_black", "ghost_blue", "ghost_yellow", "ghost_green", "ghost_pink", "ghost_cyan", "ghost_dblue", "ghost_dred", "ghost_dgreen", "ghost_dcyan", "ghost_grey", "ghost_dyellow", "ghost_dpink", "ghost_purpleswirl", "ghost_funkypurp", "ghost_pinksherbert", "ghost_blazeit", "ghost_mellow", "ghost_rainbow", "ghost_camo", "ghost_fire", "catghost");
	this.gvars_datum_init_order += "ghost_forms";
	return f.dot;
});

// preferences_toggles.dm:254
rt.def("/client/proc/pick_form", function* pick_form(f: Frame) {
	let new_form: Value = null, O: Value = null;
	if (!this.is_content_unlocked()) {
		yield* alert("This setting is for accounts with BYOND premium only.");
		return f.dot;
	}
	if (!(new_form = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly form:", this, GLOB.ghost_forms])))) return f.dot;
	this.prefs.ghost_form = new_form;
	this.prefs.save_preferences();
	if (!rt.istype(this.mob, T("/mob/dead/observer"))) return f.dot;
	yield* (O = this.mob).update_icon(new_form);
	return f.dot;
}, true);

// preferences_toggles.dm:265
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_orbits", function InitGlobalghost_orbits(f: Frame) {
	GLOB.ghost_orbits = list("circle", "triangle", "square", "hexagon", "pentagon");
	this.gvars_datum_init_order += "ghost_orbits";
	return f.dot;
});

// preferences_toggles.dm:268
rt.def("/client/proc/pick_ghost_orbit", function* pick_ghost_orbit(f: Frame) {
	let new_orbit: Value = null, O: Value = null;
	if (!this.is_content_unlocked()) {
		yield* alert("This setting is for accounts with BYOND premium only.");
		return f.dot;
	}
	if (!(new_orbit = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly orbit:", this, GLOB.ghost_orbits])))) return f.dot;
	this.prefs.ghost_orbit = new_orbit;
	this.prefs.save_preferences();
	if (!rt.istype(this.mob, T("/mob/dead/observer"))) return f.dot;
	(O = this.mob).ghost_orbit = new_orbit;
	return f.dot;
}, true);

// preferences_toggles.dm:280
rt.def("/client/proc/pick_ghost_accs", function* pick_ghost_accs(f: Frame) {
	let new_ghost_accs: Value = null, O: Value = null;
	if (!(new_ghost_accs = (yield* alert("Do you want your ghost to show full accessories where possible, hide accessories but still use the directional sprites where possible, or also ignore the directions and stick to the default sprites?", null, "full accessories", "only directional sprites", "default sprites")))) return f.dot;
	if (new_ghost_accs === "full accessories") {
		this.prefs.ghost_accs = GHOST_ACCS_FULL;
	} else if (new_ghost_accs === "only directional sprites") {
		this.prefs.ghost_accs = GHOST_ACCS_DIR;
	} else if (new_ghost_accs === "default sprites") {
		this.prefs.ghost_accs = GHOST_ACCS_NONE;
	}
	this.prefs.save_preferences();
	if (!rt.istype(this.mob, T("/mob/dead/observer"))) return f.dot;
	yield* (O = this.mob).update_icon();
	return f.dot;
}, true);

// preferences_toggles.dm:298
rt.def("/client/verb/pick_ghost_customization", function* pick_ghost_customization(f: Frame) {
	if (this.is_content_unlocked()) {
		const subject = (yield* alert("Which setting do you want to change?", null, "Ghost Form", "Ghost Orbit", "Ghost Accessories"));
		if (subject === "Ghost Form") {
			yield* this.pick_form();
		} else if (subject === "Ghost Orbit") {
			yield* this.pick_ghost_orbit();
		} else if (subject === "Ghost Accessories") {
			yield* this.pick_ghost_accs();
		}
	} else {
		yield* this.pick_ghost_accs();
	}
	return f.dot;
}, true, { verb: { name: "Ghost Customization", category: "Preferences", desc: "Customize your ghastly appearance." } });

// preferences_toggles.dm:313
rt.def("/client/verb/pick_ghost_others", function* pick_ghost_others(f: Frame) {
	let new_ghost_others: Value = null, O: Value = null;
	if (!(new_ghost_others = (yield* alert("Do you want the ghosts of others to show up as their own setting, as their default sprites or always as the default white ghost?", null, "Their Setting", "Default Sprites", "White Ghost")))) return f.dot;
	if (new_ghost_others === "Their Setting") {
		this.prefs.ghost_others = GHOST_OTHERS_THEIR_SETTING;
	} else if (new_ghost_others === "Default Sprites") {
		this.prefs.ghost_others = GHOST_OTHERS_DEFAULT_SPRITE;
	} else if (new_ghost_others === "White Ghost") {
		this.prefs.ghost_others = GHOST_OTHERS_SIMPLE;
	}
	this.prefs.save_preferences();
	if (!rt.istype(this.mob, T("/mob/dead/observer"))) return f.dot;
	yield* (O = this.mob).update_sight();
	return f.dot;
}, true, { verb: { name: "Ghosts of Others", category: "Preferences", desc: "Change display settings for the ghosts of other players." } });

// preferences_toggles.dm:331
rt.def("/client/verb/toggle_intent_style", function toggle_intent_style(f: Frame) {
	let $1: any;
	(rt.modField(f, this.prefs, "toggles", 32, rt.bitXor));
	let $0: any = this;
	if (rt.bitAnd(this.prefs.toggles, 32)) {
		$1 = "Clicking directly on intents selects them.";
	} else {
		$1 = "Clicking on intents rotates selection clockwise.";
	}
	to_chat($0, `${$1}`);
	this.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Toggle Intent Selection Style", category: "Preferences", desc: "Toggle between directly clicking the desired intent or clicking to rotate through." } });

// preferences_toggles.dm:341
rt.def("/client/verb/toggle_ghost_hud_pref", function* toggle_ghost_hud_pref(f: Frame) {
	this.prefs.ghost_hud = (!this.prefs.ghost_hud ? 1 : 0);
	let $0: any = this;
	to_chat($0, `Ghost HUD will now be ${this.prefs.ghost_hud ? "visible" : "hidden"}.`);
	this.prefs.save_preferences();
	if (rt.istype(this.mob, T("/mob/dead/observer"))) {
		yield* this.mob.hud_used.show_hud();
	}
	return f.dot;
}, true, { verb: { name: "Toggle Ghost HUD", category: "Preferences", desc: "Hide/Show Ghost HUD" } });

// preferences_toggles.dm:353
rt.def("/client/verb/toggle_inquisition", function toggle_inquisition(f: Frame) {
	this.prefs.inquisitive_ghost = (!this.prefs.inquisitive_ghost ? 1 : 0);
	this.prefs.save_preferences();
	if (this.prefs.inquisitive_ghost) {
		to_chat(this, "<span class='notice'>You will now examine everything you click on.</span>");
	} else {
		to_chat(this, "<span class='notice'>You will no longer examine things you click on.</span>");
	}
	return f.dot;
}, false, { verb: { name: "Toggle Inquisitiveness", category: "Preferences", desc: "Sets whether your ghost examines everything on click by default" } });

// preferences_toggles.dm:366
rt.def("/client/proc/toggleadminhelpsound", function toggleadminhelpsound(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	(rt.modField(f, this.prefs, "toggles", 1, rt.bitXor));
	this.prefs.save_preferences();
	let $0: any = f.usr;
	to_chat($0, `You will ${rt.bitAnd(this.prefs.toggles, 1) ? "now" : "no longer"} hear a sound when adminhelps arrive.`);
	return f.dot;
}, false, { verb: { name: "Hear/Silence Adminhelps", category: "Preferences", desc: "Toggle hearing a notification when admin PMs are received" } });

// preferences_toggles.dm:377
rt.def("/client/proc/toggleannouncelogin", function toggleannouncelogin(f: Frame) {
	let $1: any;
	if (!this.holder) {
		return f.dot;
	}
	(rt.modField(f, this.prefs, "toggles", 1024, rt.bitXor));
	this.prefs.save_preferences();
	let $0: any = f.usr;
	if (rt.bitAnd(this.prefs.toggles, 1024)) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	to_chat($0, `You will ${$1} have an announcement to other admins when you login.`);
	return f.dot;
}, false, { verb: { name: "Do/Don't Announce Login", category: "Preferences", desc: "Toggle if you want an announcement to admins when you login during a round" } });

// preferences_toggles.dm:388
rt.def("/client/proc/toggle_hear_radio", function toggle_hear_radio(f: Frame) {
	let $1: any;
	if (!this.holder) {
		return f.dot;
	}
	(rt.modField(f, this.prefs, "chat_toggles", 32, rt.bitXor));
	this.prefs.save_preferences();
	let $0: any = f.usr;
	if (rt.bitAnd(this.prefs.chat_toggles, 32)) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	to_chat($0, `You will ${$1} see radio chatter from nearby radios or speakers`);
	return f.dot;
}, false, { verb: { name: "Show/Hide Radio Chatter", category: "Preferences", desc: "Toggle seeing radiochatter from nearby radios and speakers" } });

// preferences_toggles.dm:398
rt.def("/client/proc/deadchat", function deadchat(f: Frame) {
	(rt.modField(f, this.prefs, "chat_toggles", 2, rt.bitXor));
	this.prefs.save_preferences();
	let $0: any = this;
	to_chat($0, `You will ${rt.bitAnd(this.prefs.chat_toggles, 2) ? "now" : "no longer"} see deadchat.`);
	return f.dot;
}, false, { verb: { name: "Show/Hide Deadchat", category: "Preferences", desc: "Toggles seeing deadchat" } });

// preferences_toggles.dm:407
rt.def("/client/proc/toggleprayers", function toggleprayers(f: Frame) {
	(rt.modField(f, this.prefs, "chat_toggles", 16, rt.bitXor));
	this.prefs.save_preferences();
	let $0: any = this;
	to_chat($0, `You will ${rt.bitAnd(this.prefs.chat_toggles, 16) ? "now" : "no longer"} see prayerchat.`);
	return f.dot;
}, false, { verb: { name: "Show/Hide Prayers", category: "Preferences", desc: "Toggles seeing prayers" } });
