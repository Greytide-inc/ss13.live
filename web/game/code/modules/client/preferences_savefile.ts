// Based on /tg/station's code/modules/client/preferences_savefile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// preferences_savefile.dm:24
rt.def("/datum/preferences/proc/savefile_needs_update", function savefile_needs_update(f: Frame, S: Value) {
	let savefile_version: Value = rt.input(f, rt.R.index, null, [S, "version"]);
	if (savefile_version < SAVEFILE_VERSION_MIN) {
		S.dir.Cut();
		return -2;
	}
	if (savefile_version < SAVEFILE_VERSION_MAX) {
		return savefile_version;
	}
	return -1;
});

// preferences_savefile.dm:35
rt.def("/datum/preferences/proc/update_antagchoices", function update_antagchoices(f: Frame, current_version: Value, S: Value) {
	let flag: Value = null;
	let $e: any;
	if (!((!rt.istype(this.be_special, T("/list")) || this.old_be_special) && current_version < 12)) return f.dot;
	let B_traitor: Value = 1;
	let B_operative: Value = 2;
	let B_changeling: Value = 4;
	let B_wizard: Value = 8;
	let B_malf: Value = 16;
	let B_rev: Value = 32;
	let B_alien: Value = 64;
	let B_pai: Value = 128;
	let B_cultist: Value = 256;
	let B_blob: Value = 512;
	let B_ninja: Value = 1024;
	let B_monkey: Value = 2048;
	let B_gang: Value = 4096;
	let B_abductor: Value = 16384;
	let archived: Value = list(B_traitor, B_operative, B_changeling, B_wizard, B_malf, B_rev, B_alien, B_pai, B_cultist, B_blob, B_ninja, B_monkey, B_gang, B_abductor);
	this.be_special = list();
	for (flag of each(archived)) {
		if (rt.bitAnd(this.old_be_special, flag)) {
			if (flag === 1) {
				this.be_special += "traitor";
			} else if (flag === 2) {
				this.be_special += "operative";
			} else if (flag === 4) {
				this.be_special += "changeling";
			} else if (flag === 8) {
				this.be_special += "wizard";
			} else if (flag === 16) {
				this.be_special += "malf AI";
			} else if (flag === 32) {
				this.be_special += "revolutionary";
			} else if (flag === 64) {
				this.be_special += "xenomorph";
			} else if (flag === 128) {
				this.be_special += "pAI";
			} else if (flag === 256) {
				this.be_special += "cultist";
			} else if (flag === 512) {
				this.be_special += "blob";
			} else if (flag === 1024) {
				this.be_special += "space ninja";
			} else if (flag === 2048) {
				this.be_special += "monkey";
			} else if (flag === 4096) {
				this.be_special += "gangster";
			} else if (flag === 16384) {
				this.be_special += "abductor";
			}
		}
	}
	return f.dot;
});

// preferences_savefile.dm:100
rt.def("/datum/preferences/proc/update_character", function update_character(f: Frame, current_version: Value, S: Value) {
	let berandom: Value = null;
	if (current_version < 16) {
		berandom = rt.input(f, rt.R.index, null, [S, "userandomjob"]);
		if (berandom) {
			this.joblessrole = BERANDOMJOB;
		} else {
			this.joblessrole = BEASSISTANT;
		}
	}
	if (!(current_version < 17)) return f.dot;
	rt.setAt(this.features, "legs", "Normal Legs");
	return f.dot;
});

// preferences_savefile.dm:113
rt.def("/datum/preferences/proc/load_path", function load_path(f: Frame, ckey: Value, filename: Value) {
	filename ??= "preferences.sav";
	if (!ckey) {
		return f.dot;
	}
	this.path = `data/player_saves/${copytext(ckey, 1, 2)}/${ckey}/${filename}`;
	return f.dot;
});

// preferences_savefile.dm:118
rt.def("/datum/preferences/proc/load_preferences", function load_preferences(f: Frame) {
	let S: Value = null, needs_update: Value = null;
	if (!this.path) {
		return 0;
	}
	if (!fexists(this.path)) {
		return 0;
	}
	if (!(S = new_(T("/savefile"), this.path))) {
		return 0;
	}
	S.cd = "/";
	if ((needs_update = this.savefile_needs_update(S)) == -2) {
		return 0;
	}
	this.ooccolor = rt.input(f, rt.R.index, null, [S, "ooccolor"]);
	this.lastchangelog = rt.input(f, rt.R.index, null, [S, "lastchangelog"]);
	this.UI_style = rt.input(f, rt.R.index, null, [S, "UI_style"]);
	this.hotkeys = rt.input(f, rt.R.index, null, [S, "hotkeys"]);
	this.tgui_fancy = rt.input(f, rt.R.index, null, [S, "tgui_fancy"]);
	this.tgui_lock = rt.input(f, rt.R.index, null, [S, "tgui_lock"]);
	this.windowflashing = rt.input(f, rt.R.index, null, [S, "windowflash"]);
	this.be_special = rt.input(f, rt.R.index, null, [S, "be_special"]);
	this.default_slot = rt.input(f, rt.R.index, null, [S, "default_slot"]);
	this.chat_toggles = rt.input(f, rt.R.index, null, [S, "chat_toggles"]);
	this.toggles = rt.input(f, rt.R.index, null, [S, "toggles"]);
	this.ghost_form = rt.input(f, rt.R.index, null, [S, "ghost_form"]);
	this.ghost_orbit = rt.input(f, rt.R.index, null, [S, "ghost_orbit"]);
	this.ghost_accs = rt.input(f, rt.R.index, null, [S, "ghost_accs"]);
	this.ghost_others = rt.input(f, rt.R.index, null, [S, "ghost_others"]);
	this.preferred_map = rt.input(f, rt.R.index, null, [S, "preferred_map"]);
	this.ignoring = rt.input(f, rt.R.index, null, [S, "ignoring"]);
	this.ghost_hud = rt.input(f, rt.R.index, null, [S, "ghost_hud"]);
	this.inquisitive_ghost = rt.input(f, rt.R.index, null, [S, "inquisitive_ghost"]);
	this.uses_glasses_colour = rt.input(f, rt.R.index, null, [S, "uses_glasses_colour"]);
	this.clientfps = rt.input(f, rt.R.index, null, [S, "clientfps"]);
	this.parallax = rt.input(f, rt.R.index, null, [S, "parallax"]);
	this.screentip_pref = rt.input(f, rt.R.index, null, [S, "screentip_pref"]);
	this.runechat_pref = rt.input(f, rt.R.index, null, [S, "runechat_pref"]);
	this.widescreenpref = rt.input(f, rt.R.index, null, [S, "widescreenpref"]);
	this.menuoptions = rt.input(f, rt.R.index, null, [S, "menuoptions"]);
	this.enable_tips = rt.input(f, rt.R.index, null, [S, "enable_tips"]);
	this.tip_delay = rt.input(f, rt.R.index, null, [S, "tip_delay"]);
	if (needs_update >= 0) {
		this.update_preferences(needs_update, S);
		this.update_antagchoices(needs_update, S);
	}
	this.ooccolor = sanitize_ooccolor(sanitize_hexcolor(this.ooccolor, 6, 1, rt.initial(f, this, "ooccolor")));
	this.lastchangelog = sanitize_text(this.lastchangelog, rt.initial(f, this, "lastchangelog"));
	this.UI_style = sanitize_inlist(this.UI_style, list("Midnight", "Plasmafire", "Retro", "Slimecore", "Operative", "Clockwork"), rt.initial(f, this, "UI_style"));
	this.hotkeys = sanitize_integer(this.hotkeys, 0, 1, rt.initial(f, this, "hotkeys"));
	this.tgui_fancy = sanitize_integer(this.tgui_fancy, 0, 1, rt.initial(f, this, "tgui_fancy"));
	this.tgui_lock = sanitize_integer(this.tgui_lock, 0, 1, rt.initial(f, this, "tgui_lock"));
	this.windowflashing = sanitize_integer(this.windowflashing, 0, 1, rt.initial(f, this, "windowflashing"));
	this.default_slot = sanitize_integer(this.default_slot, 1, this.max_save_slots, rt.initial(f, this, "default_slot"));
	this.toggles = sanitize_integer(this.toggles, 0, 65535, rt.initial(f, this, "toggles"));
	this.clientfps = sanitize_integer(this.clientfps, 0, 1000, 0);
	this.parallax = sanitize_integer(this.parallax, PARALLAX_INSANE, PARALLAX_DISABLE, null);
	this.screentip_pref = sanitize_integer(this.screentip_pref, 0, 1, 1);
	this.runechat_pref = sanitize_integer(this.runechat_pref, 0, 1, 1);
	this.widescreenpref = sanitize_integer(this.widescreenpref, 0, 1, 1);
	this.ghost_form = sanitize_inlist(this.ghost_form, GLOB.ghost_forms, rt.initial(f, this, "ghost_form"));
	this.ghost_orbit = sanitize_inlist(this.ghost_orbit, GLOB.ghost_orbits, rt.initial(f, this, "ghost_orbit"));
	this.ghost_accs = sanitize_inlist(this.ghost_accs, GLOB.ghost_accs_options, GHOST_ACCS_DEFAULT_OPTION);
	this.ghost_others = sanitize_inlist(this.ghost_others, GLOB.ghost_others_options, GHOST_OTHERS_DEFAULT_OPTION);
	this.menuoptions = rt.istype(this.menuoptions, T("/list")) ? this.menuoptions : list();
	this.be_special = rt.istype(this.be_special, T("/list")) ? this.be_special : list();
	return 1;
});

// preferences_savefile.dm:195
rt.def("/datum/preferences/proc/save_preferences", function save_preferences(f: Frame) {
	let S: Value = null;
	if (!this.path) {
		return 0;
	}
	if (!(S = new_(T("/savefile"), this.path))) {
		return 0;
	}
	S.cd = "/";
	rt.op(f, "OutputReference", [rt.R.index], [S, "version", SAVEFILE_VERSION_MAX], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ooccolor", this.ooccolor], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "lastchangelog", this.lastchangelog], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "UI_style", this.UI_style], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "hotkeys", this.hotkeys], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "tgui_fancy", this.tgui_fancy], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "tgui_lock", this.tgui_lock], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "windowflash", this.windowflashing], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "be_special", this.be_special], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "default_slot", this.default_slot], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "toggles", this.toggles], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "chat_toggles", this.chat_toggles], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ghost_form", this.ghost_form], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ghost_orbit", this.ghost_orbit], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ghost_accs", this.ghost_accs], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ghost_others", this.ghost_others], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "preferred_map", this.preferred_map], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ignoring", this.ignoring], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ghost_hud", this.ghost_hud], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "inquisitive_ghost", this.inquisitive_ghost], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "uses_glasses_colour", this.uses_glasses_colour], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "clientfps", this.clientfps], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "parallax", this.parallax], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "screentip_pref", this.screentip_pref], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "runechat_pref", this.runechat_pref], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "widescreenpref", this.widescreenpref], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "menuoptions", this.menuoptions], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "enable_tips", this.enable_tips], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "tip_delay", this.tip_delay], false);
	return 1;
});

// preferences_savefile.dm:237
rt.def("/datum/preferences/proc/load_character", function* load_character(f: Frame, slot: Value) {
	let S: Value = null, needs_update: Value = null, newtype: Value = null, rando_race: Value = null;
	if (!this.path) {
		return 0;
	}
	if (!fexists(this.path)) {
		return 0;
	}
	if (!(S = (yield* new_(T("/savefile"), this.path)))) {
		return 0;
	}
	S.cd = "/";
	if (!slot) {
		slot = this.default_slot;
	}
	if ((slot = sanitize_integer(slot, 1, this.max_save_slots, rt.initial(f, this, "default_slot"))) != this.default_slot) {
		this.default_slot = slot;
		rt.op(f, "OutputReference", [rt.R.index], [S, "default_slot", slot], false);
	}
	S.cd = `/character${slot}`;
	if ((needs_update = this.savefile_needs_update(S)) == -2) {
		return 0;
	}
	let species_id: Value = rt.input(f, rt.R.index, null, [S, "species"]);
	if (GLOB.config.mutant_races && species_id && rt.isIn(f, species_id, GLOB.roundstart_species)) {
		newtype = rt.index(GLOB.roundstart_species, species_id);
		this.pref_species = (yield* new_(newtype));
	} else if (rt.len(f, GLOB.config.roundstart_races)) {
		if (rando_race = pick(GLOB.config.roundstart_races)) {
			this.pref_species = (yield* new_(rando_race));
		}
	}
	if (!rt.index(S, `features${"mcolor"}`) || rt.index(S, `features${"mcolor"}`) == "#000") {
		rt.op(f, "OutputReference", [rt.R.index], [S, `features${"mcolor"}`, "#FFF"], false);
	}
	this.metadata = rt.input(f, rt.R.index, null, [S, "OOC_Notes"]);
	this.real_name = rt.input(f, rt.R.index, null, [S, "real_name"]);
	this.be_random_name = rt.input(f, rt.R.index, null, [S, "name_is_always_random"]);
	this.be_random_body = rt.input(f, rt.R.index, null, [S, "body_is_always_random"]);
	this.gender = rt.input(f, rt.R.index, null, [S, "gender"]);
	this.age = rt.input(f, rt.R.index, null, [S, "age"]);
	this.hair_color = rt.input(f, rt.R.index, null, [S, "hair_color"]);
	this.facial_hair_color = rt.input(f, rt.R.index, null, [S, "facial_hair_color"]);
	this.eye_color = rt.input(f, rt.R.index, null, [S, "eye_color"]);
	this.skin_tone = rt.input(f, rt.R.index, null, [S, "skin_tone"]);
	this.hair_style = rt.input(f, rt.R.index, null, [S, "hair_style_name"]);
	this.facial_hair_style = rt.input(f, rt.R.index, null, [S, "facial_style_name"]);
	this.underwear = rt.input(f, rt.R.index, null, [S, "underwear"]);
	this.undershirt = rt.input(f, rt.R.index, null, [S, "undershirt"]);
	this.socks = rt.input(f, rt.R.index, null, [S, "socks"]);
	this.backbag = rt.input(f, rt.R.index, null, [S, "backbag"]);
	this.uplink_spawn_loc = rt.input(f, rt.R.index, null, [S, "uplink_loc"]);
	rt.setAt(this.features, "mcolor", rt.input(f, rt.R.index, null, [S, "feature_mcolor"]));
	rt.setAt(this.features, "tail_lizard", rt.input(f, rt.R.index, null, [S, "feature_lizard_tail"]));
	rt.setAt(this.features, "snout", rt.input(f, rt.R.index, null, [S, "feature_lizard_snout"]));
	rt.setAt(this.features, "horns", rt.input(f, rt.R.index, null, [S, "feature_lizard_horns"]));
	rt.setAt(this.features, "frills", rt.input(f, rt.R.index, null, [S, "feature_lizard_frills"]));
	rt.setAt(this.features, "spines", rt.input(f, rt.R.index, null, [S, "feature_lizard_spines"]));
	rt.setAt(this.features, "body_markings", rt.input(f, rt.R.index, null, [S, "feature_lizard_body_markings"]));
	rt.setAt(this.features, "legs", rt.input(f, rt.R.index, null, [S, "feature_lizard_legs"]));
	if (!GLOB.config.mutant_humans) {
		rt.setAt(this.features, "tail_human", "none");
		rt.setAt(this.features, "ears", "none");
	} else {
		rt.setAt(this.features, "tail_human", rt.input(f, rt.R.index, null, [S, "feature_human_tail"]));
		rt.setAt(this.features, "ears", rt.input(f, rt.R.index, null, [S, "feature_human_ears"]));
	}
	rt.setAt(this.custom_names, "clown", rt.input(f, rt.R.index, null, [S, "clown_name"]));
	rt.setAt(this.custom_names, "mime", rt.input(f, rt.R.index, null, [S, "mime_name"]));
	rt.setAt(this.custom_names, "ai", rt.input(f, rt.R.index, null, [S, "ai_name"]));
	rt.setAt(this.custom_names, "cyborg", rt.input(f, rt.R.index, null, [S, "cyborg_name"]));
	rt.setAt(this.custom_names, "religion", rt.input(f, rt.R.index, null, [S, "religion_name"]));
	rt.setAt(this.custom_names, "deity", rt.input(f, rt.R.index, null, [S, "deity_name"]));
	this.prefered_security_department = rt.input(f, rt.R.index, null, [S, "prefered_security_department"]);
	this.joblessrole = rt.input(f, rt.R.index, null, [S, "joblessrole"]);
	this.job_civilian_high = rt.input(f, rt.R.index, null, [S, "job_civilian_high"]);
	this.job_civilian_med = rt.input(f, rt.R.index, null, [S, "job_civilian_med"]);
	this.job_civilian_low = rt.input(f, rt.R.index, null, [S, "job_civilian_low"]);
	this.job_medsci_high = rt.input(f, rt.R.index, null, [S, "job_medsci_high"]);
	this.job_medsci_med = rt.input(f, rt.R.index, null, [S, "job_medsci_med"]);
	this.job_medsci_low = rt.input(f, rt.R.index, null, [S, "job_medsci_low"]);
	this.job_engsec_high = rt.input(f, rt.R.index, null, [S, "job_engsec_high"]);
	this.job_engsec_med = rt.input(f, rt.R.index, null, [S, "job_engsec_med"]);
	this.job_engsec_low = rt.input(f, rt.R.index, null, [S, "job_engsec_low"]);
	if (needs_update >= 0) {
		this.update_character(needs_update, S);
	}
	this.metadata = sanitize_text(this.metadata, rt.initial(f, this, "metadata"));
	this.real_name = reject_bad_name(this.real_name);
	if (!rt.at(this.features, "mcolor") || rt.at(this.features, "mcolor") == "#000") {
		rt.setAt(this.features, "mcolor", pick("FFFFFF", "7F7F7F", "7FFF7F", "7F7FFF", "FF7F7F", "7FFFFF", "FF7FFF", "FFFF7F"));
	}
	if (!this.real_name) {
		this.real_name = random_unique_name(this.gender);
	}
	this.be_random_name = sanitize_integer(this.be_random_name, 0, 1, rt.initial(f, this, "be_random_name"));
	this.be_random_body = sanitize_integer(this.be_random_body, 0, 1, rt.initial(f, this, "be_random_body"));
	this.gender = sanitize_gender(this.gender);
	if (this.gender == "male") {
		this.hair_style = sanitize_inlist(this.hair_style, GLOB.hair_styles_male_list);
		this.facial_hair_style = sanitize_inlist(this.facial_hair_style, GLOB.facial_hair_styles_male_list);
		this.underwear = sanitize_inlist(this.underwear, GLOB.underwear_m);
		this.undershirt = sanitize_inlist(this.undershirt, GLOB.undershirt_m);
	} else {
		this.hair_style = sanitize_inlist(this.hair_style, GLOB.hair_styles_female_list);
		this.facial_hair_style = sanitize_inlist(this.facial_hair_style, GLOB.facial_hair_styles_female_list);
		this.underwear = sanitize_inlist(this.underwear, GLOB.underwear_f);
		this.undershirt = sanitize_inlist(this.undershirt, GLOB.undershirt_f);
	}
	this.socks = sanitize_inlist(this.socks, GLOB.socks_list);
	this.age = sanitize_integer(this.age, AGE_MIN, AGE_MAX, rt.initial(f, this, "age"));
	this.hair_color = sanitize_hexcolor(this.hair_color, 3, 0);
	this.facial_hair_color = sanitize_hexcolor(this.facial_hair_color, 3, 0);
	this.eye_color = sanitize_hexcolor(this.eye_color, 3, 0);
	this.skin_tone = sanitize_inlist(this.skin_tone, GLOB.skin_tones);
	this.backbag = sanitize_inlist(this.backbag, GLOB.backbaglist, rt.initial(f, this, "backbag"));
	this.uplink_spawn_loc = sanitize_inlist(this.uplink_spawn_loc, GLOB.uplink_spawn_loc_list, rt.initial(f, this, "uplink_spawn_loc"));
	rt.setAt(this.features, "mcolor", sanitize_hexcolor(rt.at(this.features, "mcolor"), 3, 0));
	rt.setAt(this.features, "tail_lizard", sanitize_inlist(rt.at(this.features, "tail_lizard"), GLOB.tails_list_lizard));
	rt.setAt(this.features, "tail_human", sanitize_inlist(rt.at(this.features, "tail_human"), GLOB.tails_list_human, "None"));
	rt.setAt(this.features, "snout", sanitize_inlist(rt.at(this.features, "snout"), GLOB.snouts_list));
	rt.setAt(this.features, "horns", sanitize_inlist(rt.at(this.features, "horns"), GLOB.horns_list));
	rt.setAt(this.features, "ears", sanitize_inlist(rt.at(this.features, "ears"), GLOB.ears_list, "None"));
	rt.setAt(this.features, "frills", sanitize_inlist(rt.at(this.features, "frills"), GLOB.frills_list));
	rt.setAt(this.features, "spines", sanitize_inlist(rt.at(this.features, "spines"), GLOB.spines_list));
	rt.setAt(this.features, "body_markings", sanitize_inlist(rt.at(this.features, "body_markings"), GLOB.body_markings_list));
	rt.setAt(this.features, "feature_lizard_legs", sanitize_inlist(rt.at(this.features, "legs"), GLOB.legs_list, "Normal Legs"));
	this.joblessrole = sanitize_integer(this.joblessrole, 1, 3, rt.initial(f, this, "joblessrole"));
	this.job_civilian_high = sanitize_integer(this.job_civilian_high, 0, 65535, rt.initial(f, this, "job_civilian_high"));
	this.job_civilian_med = sanitize_integer(this.job_civilian_med, 0, 65535, rt.initial(f, this, "job_civilian_med"));
	this.job_civilian_low = sanitize_integer(this.job_civilian_low, 0, 65535, rt.initial(f, this, "job_civilian_low"));
	this.job_medsci_high = sanitize_integer(this.job_medsci_high, 0, 65535, rt.initial(f, this, "job_medsci_high"));
	this.job_medsci_med = sanitize_integer(this.job_medsci_med, 0, 65535, rt.initial(f, this, "job_medsci_med"));
	this.job_medsci_low = sanitize_integer(this.job_medsci_low, 0, 65535, rt.initial(f, this, "job_medsci_low"));
	this.job_engsec_high = sanitize_integer(this.job_engsec_high, 0, 65535, rt.initial(f, this, "job_engsec_high"));
	this.job_engsec_med = sanitize_integer(this.job_engsec_med, 0, 65535, rt.initial(f, this, "job_engsec_med"));
	this.job_engsec_low = sanitize_integer(this.job_engsec_low, 0, 65535, rt.initial(f, this, "job_engsec_low"));
	return 1;
}, true);

// preferences_savefile.dm:380
rt.def("/datum/preferences/proc/save_character", function save_character(f: Frame) {
	let S: Value = null;
	if (!this.path) {
		return 0;
	}
	if (!(S = new_(T("/savefile"), this.path))) {
		return 0;
	}
	S.cd = `/character${this.default_slot}`;
	rt.op(f, "OutputReference", [rt.R.index], [S, "version", SAVEFILE_VERSION_MAX], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "OOC_Notes", this.metadata], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "real_name", this.real_name], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "name_is_always_random", this.be_random_name], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "body_is_always_random", this.be_random_body], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "gender", this.gender], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "age", this.age], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "hair_color", this.hair_color], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "facial_hair_color", this.facial_hair_color], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "eye_color", this.eye_color], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "skin_tone", this.skin_tone], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "hair_style_name", this.hair_style], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "facial_style_name", this.facial_hair_style], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "underwear", this.underwear], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "undershirt", this.undershirt], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "socks", this.socks], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "backbag", this.backbag], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "uplink_loc", this.uplink_spawn_loc], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "species", this.pref_species.id], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_mcolor", rt.at(this.features, "mcolor")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_tail", rt.at(this.features, "tail_lizard")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_human_tail", rt.at(this.features, "tail_human")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_snout", rt.at(this.features, "snout")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_horns", rt.at(this.features, "horns")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_human_ears", rt.at(this.features, "ears")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_frills", rt.at(this.features, "frills")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_spines", rt.at(this.features, "spines")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_body_markings", rt.at(this.features, "body_markings")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "feature_lizard_legs", rt.at(this.features, "legs")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "clown_name", rt.at(this.custom_names, "clown")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "mime_name", rt.at(this.custom_names, "mime")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "ai_name", rt.at(this.custom_names, "ai")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "cyborg_name", rt.at(this.custom_names, "cyborg")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "religion_name", rt.at(this.custom_names, "religion")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "deity_name", rt.at(this.custom_names, "deity")], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "prefered_security_department", this.prefered_security_department], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "joblessrole", this.joblessrole], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_civilian_high", this.job_civilian_high], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_civilian_med", this.job_civilian_med], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_civilian_low", this.job_civilian_low], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_medsci_high", this.job_medsci_high], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_medsci_med", this.job_medsci_med], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_medsci_low", this.job_medsci_low], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_engsec_high", this.job_engsec_high], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_engsec_med", this.job_engsec_med], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "job_engsec_low", this.job_engsec_low], false);
	return 1;
});
