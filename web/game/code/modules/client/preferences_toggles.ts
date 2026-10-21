// From code/modules/client/preferences_toggles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(871, "/datum/verbs/menu/Settings", "/datum/verbs/menu", {});

// /datum/verbs/menu/Settings/proc/Set_checked  (code/modules/client/preferences_toggles.dm:8)
rt.def("/datum/verbs/menu/Settings/proc/Set_checked", function Set_checked(f: Frame, C: Value, verbpath: Value) {
	let checked: Value = null;
	f.vars = () => [checked];
	if (isEqual(rt.sv(f, "checkbox"), 1)) {
		rt.setAt(rt.gv(f, "menuoptions", rt.fv(f, "prefs", live(C))), rt.sv(f, "type"), live(verbpath));
	} else {
		if (!isEqual(rt.sv(f, "checkbox"), 2)) return f.dot;
		checked = rt.callSrc(f, "Get_checked", [live(C)]);
		rt.setAt(rt.gv(f, "menuoptions", rt.fv(f, "prefs", live(C))), rt.sv(f, "type"), (!truthy(live(checked)) ? 1 : 0));
		rt.call(f, P("/proc/winset"), null, [live(C), fmt("＀", [live(verbpath)]), fmt("is-checked = ＀", [(!truthy(live(checked)) ? 1 : 0)])]);
	}
	return f.dot;
});

// /datum/verbs/menu/Settings/verb/setup_character  (code/modules/client/preferences_toggles.dm:19)  may sleep
rt.def("/datum/verbs/menu/Settings/verb/setup_character", function* setup_character(f: Frame) {
	rt.setFv(f, "current_tab", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), 1);
	yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "ShowChoices", [live(f.usr)]);
	return f.dot;
}, true, { verb: { name: "Game Preferences", category: "Preferences", desc: "Open Game Preferences Window" } });

rt.type(874, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears/verb/toggle_ghost_ears  (code/modules/client/preferences_toggles.dm:30)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears/verb/toggle_ghost_ears", function toggle_ghost_ears(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "chat_toggles", 4, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 4))) {
		$1 = "see all speech in the world";
	} else {
		$1 = "only see speech from nearby mobs";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("As a ghost, you will now ＀.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostEars", category: "Preferences", desc: "See All Speech" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears/proc/Get_checked  (code/modules/client/preferences_toggles.dm:35)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_ears/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 4);
});

rt.type(875, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight/verb/toggle_ghost_sight  (code/modules/client/preferences_toggles.dm:41)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight/verb/toggle_ghost_sight", function toggle_ghost_sight(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "chat_toggles", 8, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 8))) {
		$1 = "see all emotes in the world";
	} else {
		$1 = "only see emotes from nearby mobs";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("As a ghost, you will now ＀.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostSight", category: "Preferences", desc: "See All Emotes" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight/proc/Get_checked  (code/modules/client/preferences_toggles.dm:46)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_sight/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 8);
});

rt.type(876, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers/verb/toggle_ghost_whispers  (code/modules/client/preferences_toggles.dm:52)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers/verb/toggle_ghost_whispers", function toggle_ghost_whispers(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "chat_toggles", 128, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 128))) {
		$1 = "see all whispers in the world";
	} else {
		$1 = "only see whispers from nearby mobs";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("As a ghost, you will now ＀.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostWhispers", category: "Preferences", desc: "See All Whispers" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers/proc/Get_checked  (code/modules/client/preferences_toggles.dm:57)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_whispers/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 128);
});

rt.type(877, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio/verb/toggle_ghost_radio  (code/modules/client/preferences_toggles.dm:63)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio/verb/toggle_ghost_radio", function toggle_ghost_radio(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "chat_toggles", 512, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 512))) {
		$1 = "see radio chatter";
	} else {
		$1 = "not see radio chatter";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("As a ghost, you will now ＀.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostRadio", category: "Preferences", desc: "See All Radio Chatter" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio/proc/Get_checked  (code/modules/client/preferences_toggles.dm:68)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_radio/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 512);
});

rt.type(878, "/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda", "/datum/verbs/menu/Settings/Ghost/chatterbox", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda/verb/toggle_ghost_pda  (code/modules/client/preferences_toggles.dm:74)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda/verb/toggle_ghost_pda", function toggle_ghost_pda(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "chat_toggles", 256, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 256))) {
		$1 = "see all pda messages in the world";
	} else {
		$1 = "only see pda messages from nearby mobs";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("As a ghost, you will now ＀.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Show/Hide GhostPDA", category: "Preferences", desc: "See All PDA Messages" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda/proc/Get_checked  (code/modules/client/preferences_toggles.dm:79)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/toggle_ghost_pda/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 256);
});

rt.type(880, "/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle", "/datum/verbs/menu/Settings/Ghost/chatterbox/Events", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle/verb/toggle_deathrattle  (code/modules/client/preferences_toggles.dm:89)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle/verb/toggle_deathrattle", function toggle_deathrattle(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 4096, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 4096))) {
		$1 = "no longer";
	} else {
		$1 = "now";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ get messages when a sentient mob dies.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle Deathrattle", category: "Preferences", desc: "Death" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle/proc/Get_checked  (code/modules/client/preferences_toggles.dm:94)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_deathrattle/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return (!truthy(rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 4096)) ? 1 : 0);
});

rt.type(881, "/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle", "/datum/verbs/menu/Settings/Ghost/chatterbox/Events", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle/verb/toggle_arrivalrattle  (code/modules/client/preferences_toggles.dm:100)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle/verb/toggle_arrivalrattle", function toggle_arrivalrattle(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 8192, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 8192))) {
		$1 = "no longer";
	} else {
		$1 = "now";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ get messages when someone joins the station.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Toggle Arrivalrattle", category: "Preferences", desc: "New Player Arrival" } });

// /datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle/proc/Get_checked  (code/modules/client/preferences_toggles.dm:105)
rt.def("/datum/verbs/menu/Settings/Ghost/chatterbox/Events/toggle_arrivalrattle/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return (!truthy(rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 8192)) ? 1 : 0);
});

rt.type(882, "/datum/verbs/menu/Settings/Ghost/togglemidroundantag", "/datum/verbs/menu/Settings/Ghost", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Ghost/togglemidroundantag/verb/togglemidroundantag  (code/modules/client/preferences_toggles.dm:111)
rt.def("/datum/verbs/menu/Settings/Ghost/togglemidroundantag/verb/togglemidroundantag", function togglemidroundantag(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 64, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 64))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ be considered for midround antagonist positions.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle Midround Antagonist", category: "Preferences", desc: "Midround Antagonist" } });

// /datum/verbs/menu/Settings/Ghost/togglemidroundantag/proc/Get_checked  (code/modules/client/preferences_toggles.dm:116)
rt.def("/datum/verbs/menu/Settings/Ghost/togglemidroundantag/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 64);
});

rt.type(884, "/datum/verbs/menu/Settings/Sound/toggletitlemusic", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/toggletitlemusic/verb/toggletitlemusic  (code/modules/client/preferences_toggles.dm:122)  may sleep
rt.def("/datum/verbs/menu/Settings/Sound/toggletitlemusic/verb/toggletitlemusic", function* toggletitlemusic(f: Frame) {
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 8, rt.bitXor));
	yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 8))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will now hear music in the game lobby."]);
		if (truthy((rt.istype(live(f.usr), T("/mob/dead/new_player")) ? 1 : 0))) {
			yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "playtitlemusic", []);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will no longer hear music in the game lobby."]);
		yield* g.callName(f, live(f.usr), "stop_sound_channel", [1024]);
	}
	return f.dot;
}, true, { verb: { name: "Hear/Silence LobbyMusic", category: "Preferences", desc: "Hear Music In Lobby" } });

// /datum/verbs/menu/Settings/Sound/toggletitlemusic/proc/Get_checked  (code/modules/client/preferences_toggles.dm:133)
rt.def("/datum/verbs/menu/Settings/Sound/toggletitlemusic/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 8);
});

rt.type(885, "/datum/verbs/menu/Settings/Sound/togglemidis", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/togglemidis/verb/togglemidis  (code/modules/client/preferences_toggles.dm:140)
rt.def("/datum/verbs/menu/Settings/Sound/togglemidis/verb/togglemidis", function togglemidis(f: Frame) {
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 2, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will now hear any sounds uploaded by admins."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will no longer hear sounds uploaded by admins"]);
		rt.callName(f, live(f.usr), "stop_sound_channel", [1023]);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Midis", category: "Preferences", desc: "Hear Admin Triggered Sounds (Midis)" } });

// /datum/verbs/menu/Settings/Sound/togglemidis/proc/Get_checked  (code/modules/client/preferences_toggles.dm:149)
rt.def("/datum/verbs/menu/Settings/Sound/togglemidis/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 2);
});

rt.type(886, "/datum/verbs/menu/Settings/Sound/toggle_instruments", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/toggle_instruments/verb/toggle_instruments  (code/modules/client/preferences_toggles.dm:156)
rt.def("/datum/verbs/menu/Settings/Sound/toggle_instruments/verb/toggle_instruments", function toggle_instruments(f: Frame) {
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 128, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 128))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will now hear people playing musical instruments."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will no longer hear musical instruments."]);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Instruments", category: "Preferences", desc: "Hear In-game Instruments" } });

// /datum/verbs/menu/Settings/Sound/toggle_instruments/proc/Get_checked  (code/modules/client/preferences_toggles.dm:164)
rt.def("/datum/verbs/menu/Settings/Sound/toggle_instruments/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 128);
});

rt.type(887, "/datum/verbs/menu/Settings/Sound/Toggle_Soundscape", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/Toggle_Soundscape/verb/Toggle_Soundscape  (code/modules/client/preferences_toggles.dm:171)
rt.def("/datum/verbs/menu/Settings/Sound/Toggle_Soundscape/verb/Toggle_Soundscape", function Toggle_Soundscape(f: Frame) {
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 4, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 4))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will now hear ambient sounds."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will no longer hear ambient sounds."]);
		rt.op(f, "Output", [], [live(f.usr), rt.call(f, P("/proc/sound"), null, [null, null, "repeat", 0, "wait", 0, "volume", 0, "channel", 1], rt.Args.Named)], false);
		rt.op(f, "Output", [], [live(f.usr), rt.call(f, P("/proc/sound"), null, [null, null, "repeat", 0, "wait", 0, "volume", 0, "channel", 2], rt.Args.Named)], false);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Ambience", category: "Preferences", desc: "Hear Ambient Sound Effects" } });

// /datum/verbs/menu/Settings/Sound/Toggle_Soundscape/proc/Get_checked  (code/modules/client/preferences_toggles.dm:181)
rt.def("/datum/verbs/menu/Settings/Sound/Toggle_Soundscape/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 4);
});

rt.type(888, "/datum/verbs/menu/Settings/Sound/toggle_ship_ambience", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/toggle_ship_ambience/verb/toggle_ship_ambience  (code/modules/client/preferences_toggles.dm:188)
rt.def("/datum/verbs/menu/Settings/Sound/toggle_ship_ambience/verb/toggle_ship_ambience", function toggle_ship_ambience(f: Frame) {
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 256, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 256))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will now hear ship ambience."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will no longer hear ship ambience."]);
		rt.op(f, "Output", [], [live(f.usr), rt.call(f, P("/proc/sound"), null, [null, null, "repeat", 0, "wait", 0, "volume", 0, "channel", 2], rt.Args.Named)], false);
		rt.setFv(f, "ambience_playing", rt.fv(f, "client", live(f.usr)), 0);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Ship Ambience", category: "Preferences", desc: "Hear Ship Ambience Roar" } });

// /datum/verbs/menu/Settings/Sound/toggle_ship_ambience/proc/Get_checked  (code/modules/client/preferences_toggles.dm:198)
rt.def("/datum/verbs/menu/Settings/Sound/toggle_ship_ambience/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 256);
});

rt.type(889, "/datum/verbs/menu/Settings/Sound/toggle_announcement_sound", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/toggle_announcement_sound/verb/toggle_announcement_sound  (code/modules/client/preferences_toggles.dm:205)
rt.def("/datum/verbs/menu/Settings/Sound/toggle_announcement_sound/verb/toggle_announcement_sound", function toggle_announcement_sound(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 2048, rt.bitXor));
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 2048))) {
		$1 = "hear announcement sounds";
	} else {
		$1 = "no longer hear announcements";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will now ＀.", [$1])]);
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Hear/Silence Announcements", category: "Preferences", desc: "Hear Announcement Sound" } });

// /datum/verbs/menu/Settings/Sound/toggle_announcement_sound/proc/Get_checked  (code/modules/client/preferences_toggles.dm:210)
rt.def("/datum/verbs/menu/Settings/Sound/toggle_announcement_sound/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 2048);
});

rt.type(890, "/datum/verbs/menu/Settings/Sound/toggleprayersounds", "/datum/verbs/menu/Settings/Sound", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/Sound/toggleprayersounds/verb/toggleprayersounds  (code/modules/client/preferences_toggles.dm:217)
rt.def("/datum/verbs/menu/Settings/Sound/toggleprayersounds/verb/toggleprayersounds", function toggleprayersounds(f: Frame) {
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "toggles", 512, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 512))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will now hear prayer sounds."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You will no longer prayer sounds."]);
	}
	return f.dot;
}, false, { verb: { name: "Hear/Silence Prayer Sounds", category: "Preferences", desc: "Hear Prayer Sounds" } });

// /datum/verbs/menu/Settings/Sound/toggleprayersounds/proc/Get_checked  (code/modules/client/preferences_toggles.dm:225)
rt.def("/datum/verbs/menu/Settings/Sound/toggleprayersounds/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 512);
});

rt.type(883, "/datum/verbs/menu/Settings/Sound", "/datum/verbs/menu/Settings", {});

// /datum/verbs/menu/Settings/Sound/verb/stop_client_sounds  (code/modules/client/preferences_toggles.dm:232)
rt.def("/datum/verbs/menu/Settings/Sound/verb/stop_client_sounds", function stop_client_sounds(f: Frame) {
	rt.op(f, "Output", [], [live(f.usr), rt.call(f, P("/proc/sound"), null, [null])], false);
	return f.dot;
}, false, { verb: { name: "Stop Sounds", category: "Preferences", desc: "Stop Current Sounds" } });

rt.type(891, "/datum/verbs/menu/Settings/listen_ooc", "/datum/verbs/menu/Settings", {
	abstract: 1,
	checkbox: 2,
});

// /datum/verbs/menu/Settings/listen_ooc/verb/listen_ooc  (code/modules/client/preferences_toggles.dm:240)
rt.def("/datum/verbs/menu/Settings/listen_ooc/verb/listen_ooc", function listen_ooc(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "chat_toggles", 1, rt.bitXor));
	rt.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 1))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ see messages on the OOC channel.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Show/Hide OOC", category: "Preferences", desc: "Show OOC Chat" } });

// /datum/verbs/menu/Settings/listen_ooc/proc/Get_checked  (code/modules/client/preferences_toggles.dm:245)
rt.def("/datum/verbs/menu/Settings/listen_ooc/proc/Get_checked", function Get_checked(f: Frame, C: Value) {
	return rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 1);
});

// /datum/controller/global_vars/proc/InitGlobalghost_forms  (code/modules/client/preferences_toggles.dm:248)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_forms", function InitGlobalghost_forms(f: Frame) {
	rt.setGl("ghost_forms", rt.list("ghost", "ghostking", "ghostian2", "skeleghost", "ghost_red", "ghost_black", "ghost_blue", "ghost_yellow", "ghost_green", "ghost_pink", "ghost_cyan", "ghost_dblue", "ghost_dred", "ghost_dgreen", "ghost_dcyan", "ghost_grey", "ghost_dyellow", "ghost_dpink", "ghost_purpleswirl", "ghost_funkypurp", "ghost_pinksherbert", "ghost_blazeit", "ghost_mellow", "ghost_rainbow", "ghost_camo", "ghost_fire", "catghost"));
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_forms", add);
	return f.dot;
});

// /client/proc/pick_form  (code/modules/client/preferences_toggles.dm:254)  may sleep
rt.def("/client/proc/pick_form", function* pick_form(f: Frame) {
	let new_form: Value = null, O: Value = null;
	f.vars = () => [new_form, O];
	if (!truthy((yield* g.srcCall(f, "is_content_unlocked")))) {
		yield* g.call(f, P("/proc/alert"), null, ["This setting is for accounts with BYOND premium only."]);
		return live(f.dot);
	}
	if (!truthy((new_form = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly form:", live(f.src), rt.gl("ghost_forms")]))))) return f.dot;
	rt.setFv(f, "ghost_form", rt.sv(f, "prefs"), live(new_form));
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (O = rt.sv(f, "mob")), "update_icon", [live(new_form)]);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalghost_orbits  (code/modules/client/preferences_toggles.dm:265)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_orbits", function InitGlobalghost_orbits(f: Frame) {
	rt.setGl("ghost_orbits", rt.list("circle", "triangle", "square", "hexagon", "pentagon"));
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_orbits", add);
	return f.dot;
});

// /client/proc/pick_ghost_orbit  (code/modules/client/preferences_toggles.dm:268)  may sleep
rt.def("/client/proc/pick_ghost_orbit", function* pick_ghost_orbit(f: Frame) {
	let new_orbit: Value = null, O: Value = null;
	f.vars = () => [new_orbit, O];
	if (!truthy((yield* g.srcCall(f, "is_content_unlocked")))) {
		yield* g.call(f, P("/proc/alert"), null, ["This setting is for accounts with BYOND premium only."]);
		return live(f.dot);
	}
	if (!truthy((new_orbit = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly orbit:", live(f.src), rt.gl("ghost_orbits")]))))) return f.dot;
	rt.setFv(f, "ghost_orbit", rt.sv(f, "prefs"), live(new_orbit));
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "ghost_orbit", (O = rt.sv(f, "mob")), live(new_orbit));
	return f.dot;
}, true);

// /client/proc/pick_ghost_accs  (code/modules/client/preferences_toggles.dm:280)  may sleep
rt.def("/client/proc/pick_ghost_accs", function* pick_ghost_accs(f: Frame) {
	let new_ghost_accs: Value = null, O: Value = null;
	let $0: any;
	f.vars = () => [new_ghost_accs, O, $0];
	if (!truthy((new_ghost_accs = (yield* g.call(f, P("/proc/alert"), null, ["Do you want your ghost to show full accessories where possible, hide accessories but still use the directional sprites where possible, or also ignore the directions and stick to the default sprites?", null, "full accessories", "only directional sprites", "default sprites"]))))) return f.dot;
	$0 = live(new_ghost_accs);
	if ($0 === "full accessories") {
		rt.setFv(f, "ghost_accs", rt.sv(f, "prefs"), 100);
	} else if ($0 === "only directional sprites") {
		rt.setFv(f, "ghost_accs", rt.sv(f, "prefs"), 50);
	} else if ($0 === "default sprites") {
		rt.setFv(f, "ghost_accs", rt.sv(f, "prefs"), 1);
	}
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (O = rt.sv(f, "mob")), "update_icon", []);
	return f.dot;
}, true);

// /client/verb/pick_ghost_customization  (code/modules/client/preferences_toggles.dm:298)  may sleep
rt.def("/client/verb/pick_ghost_customization", function* pick_ghost_customization(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.srcCall(f, "is_content_unlocked")))) {
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Which setting do you want to change?", null, "Ghost Form", "Ghost Orbit", "Ghost Accessories"]));
		if ($0 === "Ghost Form") {
			yield* g.srcCall(f, "pick_form");
		} else if ($0 === "Ghost Orbit") {
			yield* g.srcCall(f, "pick_ghost_orbit");
		} else if ($0 === "Ghost Accessories") {
			yield* g.srcCall(f, "pick_ghost_accs");
		}
	} else {
		yield* g.srcCall(f, "pick_ghost_accs");
	}
	return f.dot;
}, true, { verb: { name: "Ghost Customization", category: "Preferences", desc: "Customize your ghastly appearance." } });

// /client/verb/pick_ghost_others  (code/modules/client/preferences_toggles.dm:313)  may sleep
rt.def("/client/verb/pick_ghost_others", function* pick_ghost_others(f: Frame) {
	let new_ghost_others: Value = null, O: Value = null;
	let $0: any;
	f.vars = () => [new_ghost_others, O, $0];
	if (!truthy((new_ghost_others = (yield* g.call(f, P("/proc/alert"), null, ["Do you want the ghosts of others to show up as their own setting, as their default sprites or always as the default white ghost?", null, "Their Setting", "Default Sprites", "White Ghost"]))))) return f.dot;
	$0 = live(new_ghost_others);
	if ($0 === "Their Setting") {
		rt.setFv(f, "ghost_others", rt.sv(f, "prefs"), 100);
	} else if ($0 === "Default Sprites") {
		rt.setFv(f, "ghost_others", rt.sv(f, "prefs"), 50);
	} else if ($0 === "White Ghost") {
		rt.setFv(f, "ghost_others", rt.sv(f, "prefs"), 1);
	}
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	if (!truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (O = rt.sv(f, "mob")), "update_sight", []);
	return f.dot;
}, true, { verb: { name: "Ghosts of Others", category: "Preferences", desc: "Change display settings for the ghosts of other players." } });

// /client/verb/toggle_intent_style  (code/modules/client/preferences_toggles.dm:331)
rt.def("/client/verb/toggle_intent_style", function toggle_intent_style(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.sv(f, "prefs"), "toggles", 32, rt.bitXor));
	$0 = live(f.src);
	if (truthy(rt.bitAnd(rt.fv(f, "toggles", rt.sv(f, "prefs")), 32))) {
		$1 = "Clicking directly on intents selects them.";
	} else {
		$1 = "Clicking on intents rotates selection clockwise.";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＀", [$1])]);
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	return f.dot;
}, false, { verb: { name: "Toggle Intent Selection Style", category: "Preferences", desc: "Toggle between directly clicking the desired intent or clicking to rotate through." } });

// /client/verb/toggle_ghost_hud_pref  (code/modules/client/preferences_toggles.dm:341)  may sleep
rt.def("/client/verb/toggle_ghost_hud_pref", function* toggle_ghost_hud_pref(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setFv(f, "ghost_hud", rt.sv(f, "prefs"), (!truthy(rt.fv(f, "ghost_hud", rt.sv(f, "prefs"))) ? 1 : 0));
	$0 = live(f.src);
	if (truthy(rt.fv(f, "ghost_hud", rt.sv(f, "prefs")))) {
		$1 = "visible";
	} else {
		$1 = "hidden";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Ghost HUD will now be ＀.", [$1])]);
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	if (truthy((rt.istype(rt.sv(f, "mob"), T("/mob/dead/observer")) ? 1 : 0))) {
		yield* g.callName(f, rt.fv(f, "hud_used", rt.sv(f, "mob")), "show_hud", []);
	}
	return f.dot;
}, true, { verb: { name: "Toggle Ghost HUD", category: "Preferences", desc: "Hide/Show Ghost HUD" } });

// /client/verb/toggle_inquisition  (code/modules/client/preferences_toggles.dm:353)
rt.def("/client/verb/toggle_inquisition", function toggle_inquisition(f: Frame) {
	rt.setFv(f, "inquisitive_ghost", rt.sv(f, "prefs"), (!truthy(rt.fv(f, "inquisitive_ghost", rt.sv(f, "prefs"))) ? 1 : 0));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	if (truthy(rt.fv(f, "inquisitive_ghost", rt.sv(f, "prefs")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You will now examine everything you click on.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You will no longer examine things you click on.</span>"]);
	}
	return f.dot;
}, false, { verb: { name: "Toggle Inquisitiveness", category: "Preferences", desc: "Sets whether your ghost examines everything on click by default" } });

// /client/proc/toggleadminhelpsound  (code/modules/client/preferences_toggles.dm:366)
rt.def("/client/proc/toggleadminhelpsound", function toggleadminhelpsound(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	(rt.modField(f, rt.sv(f, "prefs"), "toggles", 1, rt.bitXor));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.fv(f, "toggles", rt.sv(f, "prefs")), 1))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ hear a sound when adminhelps arrive.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Hear/Silence Adminhelps", category: "Preferences", desc: "Toggle hearing a notification when admin PMs are received" } });

// /client/proc/toggleannouncelogin  (code/modules/client/preferences_toggles.dm:377)
rt.def("/client/proc/toggleannouncelogin", function toggleannouncelogin(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	(rt.modField(f, rt.sv(f, "prefs"), "toggles", 1024, rt.bitXor));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.fv(f, "toggles", rt.sv(f, "prefs")), 1024))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ have an announcement to other admins when you login.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Do/Don't Announce Login", category: "Preferences", desc: "Toggle if you want an announcement to admins when you login during a round" } });

// /client/proc/toggle_hear_radio  (code/modules/client/preferences_toggles.dm:388)
rt.def("/client/proc/toggle_hear_radio", function toggle_hear_radio(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	(rt.modField(f, rt.sv(f, "prefs"), "chat_toggles", 32, rt.bitXor));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.bitAnd(rt.fv(f, "chat_toggles", rt.sv(f, "prefs")), 32))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ see radio chatter from nearby radios or speakers", [$1])]);
	return f.dot;
}, false, { verb: { name: "Show/Hide Radio Chatter", category: "Preferences", desc: "Toggle seeing radiochatter from nearby radios and speakers" } });

// /client/proc/deadchat  (code/modules/client/preferences_toggles.dm:398)
rt.def("/client/proc/deadchat", function deadchat(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.sv(f, "prefs"), "chat_toggles", 2, rt.bitXor));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	$0 = live(f.src);
	if (truthy(rt.bitAnd(rt.fv(f, "chat_toggles", rt.sv(f, "prefs")), 2))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ see deadchat.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Show/Hide Deadchat", category: "Preferences", desc: "Toggles seeing deadchat" } });

// /client/proc/toggleprayers  (code/modules/client/preferences_toggles.dm:407)
rt.def("/client/proc/toggleprayers", function toggleprayers(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modField(f, rt.sv(f, "prefs"), "chat_toggles", 16, rt.bitXor));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	$0 = live(f.src);
	if (truthy(rt.bitAnd(rt.fv(f, "chat_toggles", rt.sv(f, "prefs")), 16))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You will ＀ see prayerchat.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Show/Hide Prayers", category: "Preferences", desc: "Toggles seeing prayers" } });
