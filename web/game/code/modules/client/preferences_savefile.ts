// From code/modules/client/preferences_savefile.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/preferences/proc/savefile_needs_update  (code/modules/client/preferences_savefile.dm:24)
rt.def("/datum/preferences/proc/savefile_needs_update", function savefile_needs_update(f: Frame, S: Value) {
	let savefile_version: Value = null;
	f.vars = () => [savefile_version];
	savefile_version = null;
	savefile_version = rt.input(f, rt.R.index, null, [live(S), "version"]);
	if (rt.lt(live(savefile_version), 15)) {
		rt.callName(f, rt.fv(f, "dir", live(S)), "Cut", []);
		return -2;
	}
	if (rt.lt(live(savefile_version), 18)) {
		return live(savefile_version);
	}
	return -1;
});

// /datum/preferences/proc/update_antagchoices  (code/modules/client/preferences_savefile.dm:35)
rt.def("/datum/preferences/proc/update_antagchoices", function update_antagchoices(f: Frame, current_version: Value, S: Value) {
	let B_traitor: Value = null, B_operative: Value = null, B_changeling: Value = null, B_wizard: Value = null, B_malf: Value = null, B_rev: Value = null, B_alien: Value = null, B_pai: Value = null, B_cultist: Value = null, B_blob: Value = null, B_ninja: Value = null, B_monkey: Value = null, B_gang: Value = null, B_abductor: Value = null, archived: Value = null, flag: Value = null;
	let $0: any, $e: any;
	f.vars = () => [B_traitor, B_operative, B_changeling, B_wizard, B_malf, B_rev, B_alien, B_pai, B_cultist, B_blob, B_ninja, B_monkey, B_gang, B_abductor, archived, flag, $0, $e];
	if (!((!truthy((rt.istype(rt.sv(f, "be_special"), T("/list")) ? 1 : 0)) || truthy(rt.sv(f, "old_be_special"))) && rt.lt(live(current_version), 12))) return f.dot;
	B_traitor = 1;
	B_operative = 2;
	B_changeling = 4;
	B_wizard = 8;
	B_malf = 16;
	B_rev = 32;
	B_alien = 64;
	B_pai = 128;
	B_cultist = 256;
	B_blob = 512;
	B_ninja = 1024;
	B_monkey = 2048;
	B_gang = 4096;
	B_abductor = 16384;
	archived = rt.list(live(B_traitor), live(B_operative), live(B_changeling), live(B_wizard), live(B_malf), live(B_rev), live(B_alien), live(B_pai), live(B_cultist), live(B_blob), live(B_ninja), live(B_monkey), live(B_gang), live(B_abductor));
	rt.setSv(f, "be_special", rt.list());
	flag = null;
	rt.forList(f, 0, live(archived));
	while (($e = rt.next(f, 0)) !== undefined) {
		flag = $e;
		if (truthy(rt.bitAnd(rt.sv(f, "old_be_special"), live(flag)))) {
			$0 = live(flag);
			if ($0 === 1) {
				rt.modSrcVar(f, "be_special", "traitor", add);
			} else if ($0 === 2) {
				rt.modSrcVar(f, "be_special", "operative", add);
			} else if ($0 === 4) {
				rt.modSrcVar(f, "be_special", "changeling", add);
			} else if ($0 === 8) {
				rt.modSrcVar(f, "be_special", "wizard", add);
			} else if ($0 === 16) {
				rt.modSrcVar(f, "be_special", "malf AI", add);
			} else if ($0 === 32) {
				rt.modSrcVar(f, "be_special", "revolutionary", add);
			} else if ($0 === 64) {
				rt.modSrcVar(f, "be_special", "xenomorph", add);
			} else if ($0 === 128) {
				rt.modSrcVar(f, "be_special", "pAI", add);
			} else if ($0 === 256) {
				rt.modSrcVar(f, "be_special", "cultist", add);
			} else if ($0 === 512) {
				rt.modSrcVar(f, "be_special", "blob", add);
			} else if ($0 === 1024) {
				rt.modSrcVar(f, "be_special", "space ninja", add);
			} else if ($0 === 2048) {
				rt.modSrcVar(f, "be_special", "monkey", add);
			} else if ($0 === 4096) {
				rt.modSrcVar(f, "be_special", "gangster", add);
			} else if ($0 === 16384) {
				rt.modSrcVar(f, "be_special", "abductor", add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/preferences/proc/update_character  (code/modules/client/preferences_savefile.dm:100)
rt.def("/datum/preferences/proc/update_character", function update_character(f: Frame, current_version: Value, S: Value) {
	let berandom: Value = null;
	f.vars = () => [berandom];
	if (rt.lt(live(current_version), 16)) {
		berandom = null;
		berandom = rt.input(f, rt.R.index, null, [live(S), "userandomjob"]);
		if (truthy(live(berandom))) {
			rt.setSv(f, "joblessrole", 2);
		} else {
			rt.setSv(f, "joblessrole", 1);
		}
	}
	if (!rt.lt(live(current_version), 17)) return f.dot;
	rt.setAt(rt.sv(f, "features"), "legs", "Normal Legs");
	return f.dot;
});

// /datum/preferences/proc/load_path  (code/modules/client/preferences_savefile.dm:113)
rt.def("/datum/preferences/proc/load_path", function load_path(f: Frame, ckey: Value, filename: Value) {
	f.vars = () => [filename];
	if (live(filename) === null) {
		filename = "preferences.sav";
	}
	if (!truthy(live(ckey))) {
		return live(f.dot);
	}
	rt.setSv(f, "path", fmt("data/player_saves/＀/＀/＀", [rt.call(f, P("/proc/copytext"), null, [live(ckey), 1, 2]), live(ckey), live(filename)]));
	return f.dot;
});

// /datum/preferences/proc/load_preferences  (code/modules/client/preferences_savefile.dm:118)
rt.def("/datum/preferences/proc/load_preferences", function load_preferences(f: Frame) {
	let S: Value = null, needs_update: Value = null;
	let $0: any;
	f.vars = () => [S, needs_update, $0];
	if (!truthy(rt.sv(f, "path"))) {
		return 0;
	}
	if (!truthy(rt.call(f, P("/proc/fexists"), null, [rt.sv(f, "path")]))) {
		return 0;
	}
	if (!truthy((S = rt.new_(f, T("/savefile"), [rt.sv(f, "path")])))) {
		return 0;
	}
	rt.setFv(f, "cd", live(S), "/");
	if (isEqual((needs_update = rt.callSrc(f, "savefile_needs_update", [live(S)])), -2)) {
		return 0;
	}
	rt.setSv(f, "ooccolor", rt.input(f, rt.R.index, null, [live(S), "ooccolor"]));
	rt.setSv(f, "lastchangelog", rt.input(f, rt.R.index, null, [live(S), "lastchangelog"]));
	rt.setSv(f, "UI_style", rt.input(f, rt.R.index, null, [live(S), "UI_style"]));
	rt.setSv(f, "hotkeys", rt.input(f, rt.R.index, null, [live(S), "hotkeys"]));
	rt.setSv(f, "tgui_fancy", rt.input(f, rt.R.index, null, [live(S), "tgui_fancy"]));
	rt.setSv(f, "tgui_lock", rt.input(f, rt.R.index, null, [live(S), "tgui_lock"]));
	rt.setSv(f, "windowflashing", rt.input(f, rt.R.index, null, [live(S), "windowflash"]));
	rt.setSv(f, "be_special", rt.input(f, rt.R.index, null, [live(S), "be_special"]));
	rt.setSv(f, "default_slot", rt.input(f, rt.R.index, null, [live(S), "default_slot"]));
	rt.setSv(f, "chat_toggles", rt.input(f, rt.R.index, null, [live(S), "chat_toggles"]));
	rt.setSv(f, "toggles", rt.input(f, rt.R.index, null, [live(S), "toggles"]));
	rt.setSv(f, "ghost_form", rt.input(f, rt.R.index, null, [live(S), "ghost_form"]));
	rt.setSv(f, "ghost_orbit", rt.input(f, rt.R.index, null, [live(S), "ghost_orbit"]));
	rt.setSv(f, "ghost_accs", rt.input(f, rt.R.index, null, [live(S), "ghost_accs"]));
	rt.setSv(f, "ghost_others", rt.input(f, rt.R.index, null, [live(S), "ghost_others"]));
	rt.setSv(f, "preferred_map", rt.input(f, rt.R.index, null, [live(S), "preferred_map"]));
	rt.setSv(f, "ignoring", rt.input(f, rt.R.index, null, [live(S), "ignoring"]));
	rt.setSv(f, "ghost_hud", rt.input(f, rt.R.index, null, [live(S), "ghost_hud"]));
	rt.setSv(f, "inquisitive_ghost", rt.input(f, rt.R.index, null, [live(S), "inquisitive_ghost"]));
	rt.setSv(f, "uses_glasses_colour", rt.input(f, rt.R.index, null, [live(S), "uses_glasses_colour"]));
	rt.setSv(f, "clientfps", rt.input(f, rt.R.index, null, [live(S), "clientfps"]));
	rt.setSv(f, "parallax", rt.input(f, rt.R.index, null, [live(S), "parallax"]));
	rt.setSv(f, "screentip_pref", rt.input(f, rt.R.index, null, [live(S), "screentip_pref"]));
	rt.setSv(f, "runechat_pref", rt.input(f, rt.R.index, null, [live(S), "runechat_pref"]));
	rt.setSv(f, "widescreenpref", rt.input(f, rt.R.index, null, [live(S), "widescreenpref"]));
	rt.setSv(f, "menuoptions", rt.input(f, rt.R.index, null, [live(S), "menuoptions"]));
	rt.setSv(f, "enable_tips", rt.input(f, rt.R.index, null, [live(S), "enable_tips"]));
	rt.setSv(f, "tip_delay", rt.input(f, rt.R.index, null, [live(S), "tip_delay"]));
	if (rt.ge(live(needs_update), 0)) {
		rt.callSrc(f, "update_preferences", [live(needs_update), live(S)]);
		rt.callSrc(f, "update_antagchoices", [live(needs_update), live(S)]);
	}
	rt.setSv(f, "ooccolor", rt.call(f, P("/proc/sanitize_ooccolor"), null, [rt.call(f, P("/proc/sanitize_hexcolor"), null, [rt.sv(f, "ooccolor"), 6, 1, rt.initial(f, live(f.src), "ooccolor")])]));
	rt.setSv(f, "lastchangelog", rt.call(f, P("/proc/sanitize_text"), null, [rt.sv(f, "lastchangelog"), rt.initial(f, live(f.src), "lastchangelog")]));
	rt.setSv(f, "UI_style", rt.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "UI_style"), rt.list("Midnight", "Plasmafire", "Retro", "Slimecore", "Operative", "Clockwork"), rt.initial(f, live(f.src), "UI_style")]));
	rt.setSv(f, "hotkeys", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "hotkeys"), 0, 1, rt.initial(f, live(f.src), "hotkeys")]));
	rt.setSv(f, "tgui_fancy", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "tgui_fancy"), 0, 1, rt.initial(f, live(f.src), "tgui_fancy")]));
	rt.setSv(f, "tgui_lock", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "tgui_lock"), 0, 1, rt.initial(f, live(f.src), "tgui_lock")]));
	rt.setSv(f, "windowflashing", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "windowflashing"), 0, 1, rt.initial(f, live(f.src), "windowflashing")]));
	rt.setSv(f, "default_slot", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "default_slot"), 1, rt.sv(f, "max_save_slots"), rt.initial(f, live(f.src), "default_slot")]));
	rt.setSv(f, "toggles", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "toggles"), 0, 65535, rt.initial(f, live(f.src), "toggles")]));
	rt.setSv(f, "clientfps", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "clientfps"), 0, 1000, 0]));
	rt.setSv(f, "parallax", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "parallax"), -1, 3, null]));
	rt.setSv(f, "screentip_pref", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "screentip_pref"), 0, 1, 1]));
	rt.setSv(f, "runechat_pref", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "runechat_pref"), 0, 1, 1]));
	rt.setSv(f, "widescreenpref", rt.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "widescreenpref"), 0, 1, 1]));
	rt.setSv(f, "ghost_form", rt.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "ghost_form"), rt.gl("ghost_forms"), rt.initial(f, live(f.src), "ghost_form")]));
	rt.setSv(f, "ghost_orbit", rt.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "ghost_orbit"), rt.gl("ghost_orbits"), rt.initial(f, live(f.src), "ghost_orbit")]));
	rt.setSv(f, "ghost_accs", rt.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "ghost_accs"), rt.gl("ghost_accs_options"), 100]));
	rt.setSv(f, "ghost_others", rt.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "ghost_others"), rt.gl("ghost_others_options"), 100]));
	if (truthy((rt.istype(rt.sv(f, "menuoptions"), T("/list")) ? 1 : 0))) {
		$0 = rt.sv(f, "menuoptions");
	} else {
		$0 = rt.list();
	}
	rt.setSv(f, "menuoptions", $0);
	if (truthy((rt.istype(rt.sv(f, "be_special"), T("/list")) ? 1 : 0))) {
		$0 = rt.sv(f, "be_special");
	} else {
		$0 = rt.list();
	}
	rt.setSv(f, "be_special", $0);
	return 1;
});

// /datum/preferences/proc/save_preferences  (code/modules/client/preferences_savefile.dm:195)
rt.def("/datum/preferences/proc/save_preferences", function save_preferences(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy(rt.sv(f, "path"))) {
		return 0;
	}
	if (!truthy((S = rt.new_(f, T("/savefile"), [rt.sv(f, "path")])))) {
		return 0;
	}
	rt.setFv(f, "cd", live(S), "/");
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "version", 18], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ooccolor", rt.sv(f, "ooccolor")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "lastchangelog", rt.sv(f, "lastchangelog")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "UI_style", rt.sv(f, "UI_style")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "hotkeys", rt.sv(f, "hotkeys")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "tgui_fancy", rt.sv(f, "tgui_fancy")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "tgui_lock", rt.sv(f, "tgui_lock")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "windowflash", rt.sv(f, "windowflashing")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "be_special", rt.sv(f, "be_special")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "default_slot", rt.sv(f, "default_slot")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "toggles", rt.sv(f, "toggles")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "chat_toggles", rt.sv(f, "chat_toggles")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ghost_form", rt.sv(f, "ghost_form")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ghost_orbit", rt.sv(f, "ghost_orbit")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ghost_accs", rt.sv(f, "ghost_accs")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ghost_others", rt.sv(f, "ghost_others")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "preferred_map", rt.sv(f, "preferred_map")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ignoring", rt.sv(f, "ignoring")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ghost_hud", rt.sv(f, "ghost_hud")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "inquisitive_ghost", rt.sv(f, "inquisitive_ghost")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "uses_glasses_colour", rt.sv(f, "uses_glasses_colour")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "clientfps", rt.sv(f, "clientfps")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "parallax", rt.sv(f, "parallax")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "screentip_pref", rt.sv(f, "screentip_pref")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "runechat_pref", rt.sv(f, "runechat_pref")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "widescreenpref", rt.sv(f, "widescreenpref")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "menuoptions", rt.sv(f, "menuoptions")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "enable_tips", rt.sv(f, "enable_tips")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "tip_delay", rt.sv(f, "tip_delay")], false);
	return 1;
});

// /datum/preferences/proc/load_character  (code/modules/client/preferences_savefile.dm:237)  may sleep
rt.def("/datum/preferences/proc/load_character", function* load_character(f: Frame, slot: Value) {
	let S: Value = null, needs_update: Value = null, species_id: Value = null, newtype: Value = null, rando_race: Value = null;
	f.vars = () => [slot, S, needs_update, species_id, newtype, rando_race];
	if (!truthy(rt.sv(f, "path"))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/fexists"), null, [rt.sv(f, "path")])))) {
		return 0;
	}
	if (!truthy((S = (yield* g.new_(f, T("/savefile"), [rt.sv(f, "path")]))))) {
		return 0;
	}
	rt.setFv(f, "cd", live(S), "/");
	if (!truthy(live(slot))) {
		slot = rt.sv(f, "default_slot");
	}
	if (!isEqual((slot = (yield* g.call(f, P("/proc/sanitize_integer"), null, [live(slot), 1, rt.sv(f, "max_save_slots"), rt.initial(f, live(f.src), "default_slot")]))), rt.sv(f, "default_slot"))) {
		rt.setSv(f, "default_slot", live(slot));
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "default_slot", live(slot)], false);
	}
	rt.setFv(f, "cd", live(S), fmt("/character＀", [live(slot)]));
	if (isEqual((needs_update = (yield* g.srcCall(f, "savefile_needs_update", live(S)))), -2)) {
		return 0;
	}
	species_id = null;
	species_id = rt.input(f, rt.R.index, null, [live(S), "species"]);
	if (((truthy(rt.fv(f, "mutant_races", rt.gl("config"))) && truthy(live(species_id))) && truthy((rt.isIn(f, live(species_id), rt.gl("roundstart_species")) ? 1 : 0)))) {
		newtype = rt.index(rt.gl("roundstart_species"), live(species_id));
		rt.setSv(f, "pref_species", (yield* g.new_(f, live(newtype), [])));
	} else {
		if (truthy(rt.getLen(f, rt.fv(f, "roundstart_races", rt.gl("config"))))) {
			if (truthy((rando_race = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "roundstart_races", rt.gl("config"))])))) {
				rt.setSv(f, "pref_species", (yield* g.new_(f, live(rando_race), [])));
			}
		}
	}
	if ((!truthy(rt.index(live(S), fmt("features＀", ["mcolor"]))) || isEqual(rt.index(live(S), fmt("features＀", ["mcolor"])), "#000"))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), fmt("features＀", ["mcolor"]), "#FFF"], false);
	}
	rt.setSv(f, "metadata", rt.input(f, rt.R.index, null, [live(S), "OOC_Notes"]));
	rt.setSv(f, "real_name", rt.input(f, rt.R.index, null, [live(S), "real_name"]));
	rt.setSv(f, "be_random_name", rt.input(f, rt.R.index, null, [live(S), "name_is_always_random"]));
	rt.setSv(f, "be_random_body", rt.input(f, rt.R.index, null, [live(S), "body_is_always_random"]));
	rt.setSv(f, "gender", rt.input(f, rt.R.index, null, [live(S), "gender"]));
	rt.setSv(f, "age", rt.input(f, rt.R.index, null, [live(S), "age"]));
	rt.setSv(f, "hair_color", rt.input(f, rt.R.index, null, [live(S), "hair_color"]));
	rt.setSv(f, "facial_hair_color", rt.input(f, rt.R.index, null, [live(S), "facial_hair_color"]));
	rt.setSv(f, "eye_color", rt.input(f, rt.R.index, null, [live(S), "eye_color"]));
	rt.setSv(f, "skin_tone", rt.input(f, rt.R.index, null, [live(S), "skin_tone"]));
	rt.setSv(f, "hair_style", rt.input(f, rt.R.index, null, [live(S), "hair_style_name"]));
	rt.setSv(f, "facial_hair_style", rt.input(f, rt.R.index, null, [live(S), "facial_style_name"]));
	rt.setSv(f, "underwear", rt.input(f, rt.R.index, null, [live(S), "underwear"]));
	rt.setSv(f, "undershirt", rt.input(f, rt.R.index, null, [live(S), "undershirt"]));
	rt.setSv(f, "socks", rt.input(f, rt.R.index, null, [live(S), "socks"]));
	rt.setSv(f, "backbag", rt.input(f, rt.R.index, null, [live(S), "backbag"]));
	rt.setSv(f, "uplink_spawn_loc", rt.input(f, rt.R.index, null, [live(S), "uplink_loc"]));
	rt.setAt(rt.sv(f, "features"), "mcolor", rt.input(f, rt.R.index, null, [live(S), "feature_mcolor"]));
	rt.setAt(rt.sv(f, "features"), "tail_lizard", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_tail"]));
	rt.setAt(rt.sv(f, "features"), "snout", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_snout"]));
	rt.setAt(rt.sv(f, "features"), "horns", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_horns"]));
	rt.setAt(rt.sv(f, "features"), "frills", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_frills"]));
	rt.setAt(rt.sv(f, "features"), "spines", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_spines"]));
	rt.setAt(rt.sv(f, "features"), "body_markings", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_body_markings"]));
	rt.setAt(rt.sv(f, "features"), "legs", rt.input(f, rt.R.index, null, [live(S), "feature_lizard_legs"]));
	if (!truthy(rt.fv(f, "mutant_humans", rt.gl("config")))) {
		rt.setAt(rt.sv(f, "features"), "tail_human", "none");
		rt.setAt(rt.sv(f, "features"), "ears", "none");
	} else {
		rt.setAt(rt.sv(f, "features"), "tail_human", rt.input(f, rt.R.index, null, [live(S), "feature_human_tail"]));
		rt.setAt(rt.sv(f, "features"), "ears", rt.input(f, rt.R.index, null, [live(S), "feature_human_ears"]));
	}
	rt.setAt(rt.sv(f, "custom_names"), "clown", rt.input(f, rt.R.index, null, [live(S), "clown_name"]));
	rt.setAt(rt.sv(f, "custom_names"), "mime", rt.input(f, rt.R.index, null, [live(S), "mime_name"]));
	rt.setAt(rt.sv(f, "custom_names"), "ai", rt.input(f, rt.R.index, null, [live(S), "ai_name"]));
	rt.setAt(rt.sv(f, "custom_names"), "cyborg", rt.input(f, rt.R.index, null, [live(S), "cyborg_name"]));
	rt.setAt(rt.sv(f, "custom_names"), "religion", rt.input(f, rt.R.index, null, [live(S), "religion_name"]));
	rt.setAt(rt.sv(f, "custom_names"), "deity", rt.input(f, rt.R.index, null, [live(S), "deity_name"]));
	rt.setSv(f, "prefered_security_department", rt.input(f, rt.R.index, null, [live(S), "prefered_security_department"]));
	rt.setSv(f, "joblessrole", rt.input(f, rt.R.index, null, [live(S), "joblessrole"]));
	rt.setSv(f, "job_civilian_high", rt.input(f, rt.R.index, null, [live(S), "job_civilian_high"]));
	rt.setSv(f, "job_civilian_med", rt.input(f, rt.R.index, null, [live(S), "job_civilian_med"]));
	rt.setSv(f, "job_civilian_low", rt.input(f, rt.R.index, null, [live(S), "job_civilian_low"]));
	rt.setSv(f, "job_medsci_high", rt.input(f, rt.R.index, null, [live(S), "job_medsci_high"]));
	rt.setSv(f, "job_medsci_med", rt.input(f, rt.R.index, null, [live(S), "job_medsci_med"]));
	rt.setSv(f, "job_medsci_low", rt.input(f, rt.R.index, null, [live(S), "job_medsci_low"]));
	rt.setSv(f, "job_engsec_high", rt.input(f, rt.R.index, null, [live(S), "job_engsec_high"]));
	rt.setSv(f, "job_engsec_med", rt.input(f, rt.R.index, null, [live(S), "job_engsec_med"]));
	rt.setSv(f, "job_engsec_low", rt.input(f, rt.R.index, null, [live(S), "job_engsec_low"]));
	if (rt.ge(live(needs_update), 0)) {
		yield* g.srcCall(f, "update_character", live(needs_update), live(S));
	}
	rt.setSv(f, "metadata", (yield* g.call(f, P("/proc/sanitize_text"), null, [rt.sv(f, "metadata"), rt.initial(f, live(f.src), "metadata")])));
	rt.setSv(f, "real_name", (yield* g.call(f, P("/proc/reject_bad_name"), null, [rt.sv(f, "real_name")])));
	if ((!truthy(rt.at(rt.sv(f, "features"), "mcolor")) || isEqual(rt.at(rt.sv(f, "features"), "mcolor"), "#000"))) {
		rt.setAt(rt.sv(f, "features"), "mcolor", rt.op(f, "PickUnweighted", [8], ["FFFFFF", "7F7F7F", "7FFF7F", "7F7FFF", "FF7F7F", "7FFFFF", "FF7FFF", "FFFF7F"]));
	}
	if (!truthy(rt.sv(f, "real_name"))) {
		rt.setSv(f, "real_name", (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.sv(f, "gender")])));
	}
	rt.setSv(f, "be_random_name", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "be_random_name"), 0, 1, rt.initial(f, live(f.src), "be_random_name")])));
	rt.setSv(f, "be_random_body", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "be_random_body"), 0, 1, rt.initial(f, live(f.src), "be_random_body")])));
	rt.setSv(f, "gender", (yield* g.call(f, P("/proc/sanitize_gender"), null, [rt.sv(f, "gender")])));
	if (isEqual(rt.sv(f, "gender"), "male")) {
		rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "hair_style"), rt.gl("hair_styles_male_list")])));
		rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "facial_hair_style"), rt.gl("facial_hair_styles_male_list")])));
		rt.setSv(f, "underwear", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "underwear"), rt.gl("underwear_m")])));
		rt.setSv(f, "undershirt", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "undershirt"), rt.gl("undershirt_m")])));
	} else {
		rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "hair_style"), rt.gl("hair_styles_female_list")])));
		rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "facial_hair_style"), rt.gl("facial_hair_styles_female_list")])));
		rt.setSv(f, "underwear", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "underwear"), rt.gl("underwear_f")])));
		rt.setSv(f, "undershirt", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "undershirt"), rt.gl("undershirt_f")])));
	}
	rt.setSv(f, "socks", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "socks"), rt.gl("socks_list")])));
	rt.setSv(f, "age", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "age"), 17, 85, rt.initial(f, live(f.src), "age")])));
	rt.setSv(f, "hair_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.sv(f, "hair_color"), 3, 0])));
	rt.setSv(f, "facial_hair_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.sv(f, "facial_hair_color"), 3, 0])));
	rt.setSv(f, "eye_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.sv(f, "eye_color"), 3, 0])));
	rt.setSv(f, "skin_tone", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "skin_tone"), rt.gl("skin_tones")])));
	rt.setSv(f, "backbag", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "backbag"), rt.gl("backbaglist"), rt.initial(f, live(f.src), "backbag")])));
	rt.setSv(f, "uplink_spawn_loc", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.sv(f, "uplink_spawn_loc"), rt.gl("uplink_spawn_loc_list"), rt.initial(f, live(f.src), "uplink_spawn_loc")])));
	rt.setAt(rt.sv(f, "features"), "mcolor", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.at(rt.sv(f, "features"), "mcolor"), 3, 0])));
	rt.setAt(rt.sv(f, "features"), "tail_lizard", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "tail_lizard"), rt.gl("tails_list_lizard")])));
	rt.setAt(rt.sv(f, "features"), "tail_human", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "tail_human"), rt.gl("tails_list_human"), "None"])));
	rt.setAt(rt.sv(f, "features"), "snout", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "snout"), rt.gl("snouts_list")])));
	rt.setAt(rt.sv(f, "features"), "horns", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "horns"), rt.gl("horns_list")])));
	rt.setAt(rt.sv(f, "features"), "ears", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "ears"), rt.gl("ears_list"), "None"])));
	rt.setAt(rt.sv(f, "features"), "frills", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "frills"), rt.gl("frills_list")])));
	rt.setAt(rt.sv(f, "features"), "spines", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "spines"), rt.gl("spines_list")])));
	rt.setAt(rt.sv(f, "features"), "body_markings", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "body_markings"), rt.gl("body_markings_list")])));
	rt.setAt(rt.sv(f, "features"), "feature_lizard_legs", (yield* g.call(f, P("/proc/sanitize_inlist"), null, [rt.at(rt.sv(f, "features"), "legs"), rt.gl("legs_list"), "Normal Legs"])));
	rt.setSv(f, "joblessrole", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "joblessrole"), 1, 3, rt.initial(f, live(f.src), "joblessrole")])));
	rt.setSv(f, "job_civilian_high", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_civilian_high"), 0, 65535, rt.initial(f, live(f.src), "job_civilian_high")])));
	rt.setSv(f, "job_civilian_med", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_civilian_med"), 0, 65535, rt.initial(f, live(f.src), "job_civilian_med")])));
	rt.setSv(f, "job_civilian_low", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_civilian_low"), 0, 65535, rt.initial(f, live(f.src), "job_civilian_low")])));
	rt.setSv(f, "job_medsci_high", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_medsci_high"), 0, 65535, rt.initial(f, live(f.src), "job_medsci_high")])));
	rt.setSv(f, "job_medsci_med", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_medsci_med"), 0, 65535, rt.initial(f, live(f.src), "job_medsci_med")])));
	rt.setSv(f, "job_medsci_low", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_medsci_low"), 0, 65535, rt.initial(f, live(f.src), "job_medsci_low")])));
	rt.setSv(f, "job_engsec_high", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_engsec_high"), 0, 65535, rt.initial(f, live(f.src), "job_engsec_high")])));
	rt.setSv(f, "job_engsec_med", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_engsec_med"), 0, 65535, rt.initial(f, live(f.src), "job_engsec_med")])));
	rt.setSv(f, "job_engsec_low", (yield* g.call(f, P("/proc/sanitize_integer"), null, [rt.sv(f, "job_engsec_low"), 0, 65535, rt.initial(f, live(f.src), "job_engsec_low")])));
	return 1;
}, true);

// /datum/preferences/proc/save_character  (code/modules/client/preferences_savefile.dm:380)
rt.def("/datum/preferences/proc/save_character", function save_character(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy(rt.sv(f, "path"))) {
		return 0;
	}
	if (!truthy((S = rt.new_(f, T("/savefile"), [rt.sv(f, "path")])))) {
		return 0;
	}
	rt.setFv(f, "cd", live(S), fmt("/character＀", [rt.sv(f, "default_slot")]));
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "version", 18], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "OOC_Notes", rt.sv(f, "metadata")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "real_name", rt.sv(f, "real_name")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "name_is_always_random", rt.sv(f, "be_random_name")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "body_is_always_random", rt.sv(f, "be_random_body")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "gender", rt.sv(f, "gender")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "age", rt.sv(f, "age")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "hair_color", rt.sv(f, "hair_color")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "facial_hair_color", rt.sv(f, "facial_hair_color")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "eye_color", rt.sv(f, "eye_color")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "skin_tone", rt.sv(f, "skin_tone")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "hair_style_name", rt.sv(f, "hair_style")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "facial_style_name", rt.sv(f, "facial_hair_style")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "underwear", rt.sv(f, "underwear")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "undershirt", rt.sv(f, "undershirt")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "socks", rt.sv(f, "socks")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "backbag", rt.sv(f, "backbag")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "uplink_loc", rt.sv(f, "uplink_spawn_loc")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "species", rt.fv(f, "id", rt.sv(f, "pref_species"))], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_mcolor", rt.at(rt.sv(f, "features"), "mcolor")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_tail", rt.at(rt.sv(f, "features"), "tail_lizard")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_human_tail", rt.at(rt.sv(f, "features"), "tail_human")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_snout", rt.at(rt.sv(f, "features"), "snout")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_horns", rt.at(rt.sv(f, "features"), "horns")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_human_ears", rt.at(rt.sv(f, "features"), "ears")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_frills", rt.at(rt.sv(f, "features"), "frills")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_spines", rt.at(rt.sv(f, "features"), "spines")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_body_markings", rt.at(rt.sv(f, "features"), "body_markings")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "feature_lizard_legs", rt.at(rt.sv(f, "features"), "legs")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "clown_name", rt.at(rt.sv(f, "custom_names"), "clown")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "mime_name", rt.at(rt.sv(f, "custom_names"), "mime")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "ai_name", rt.at(rt.sv(f, "custom_names"), "ai")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "cyborg_name", rt.at(rt.sv(f, "custom_names"), "cyborg")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "religion_name", rt.at(rt.sv(f, "custom_names"), "religion")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "deity_name", rt.at(rt.sv(f, "custom_names"), "deity")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "prefered_security_department", rt.sv(f, "prefered_security_department")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "joblessrole", rt.sv(f, "joblessrole")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_civilian_high", rt.sv(f, "job_civilian_high")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_civilian_med", rt.sv(f, "job_civilian_med")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_civilian_low", rt.sv(f, "job_civilian_low")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_medsci_high", rt.sv(f, "job_medsci_high")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_medsci_med", rt.sv(f, "job_medsci_med")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_medsci_low", rt.sv(f, "job_medsci_low")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_engsec_high", rt.sv(f, "job_engsec_high")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_engsec_med", rt.sv(f, "job_engsec_med")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "job_engsec_low", rt.sv(f, "job_engsec_low")], false);
	return 1;
});
