// From code/modules/client/preferences.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalpreferences_datums  (code/modules/client/preferences.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalpreferences_datums", function InitGlobalpreferences_datums(f: Frame) {
	rt.setGl("preferences_datums", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "preferences_datums", add);
	return f.dot;
});

rt.type(2291, "/datum/preferences", "/datum", {
	parent: null,
	path: null,
	default_slot: 1,
	max_save_slots: 3,
	muted: 0,
	last_ip: null,
	last_id: null,
	lastchangelog: "",
	ooccolor: null,
	enable_tips: 1,
	tip_delay: 500,
	be_special: null,
	old_be_special: 0,
	UI_style: "Midnight",
	hotkeys: 0,
	tgui_fancy: 1,
	tgui_lock: 1,
	windowflashing: 1,
	toggles: 3071,
	chat_toggles: 1023,
	ghost_form: "ghost",
	ghost_orbit: "circle",
	ghost_accs: 100,
	ghost_others: 100,
	ghost_hud: 1,
	inquisitive_ghost: 1,
	allow_midround_antag: 1,
	preferred_map: null,
	uses_glasses_colour: 0,
	real_name: null,
	be_random_name: 0,
	be_random_body: 0,
	gender: "male",
	age: 30,
	underwear: "Nude",
	undershirt: "Nude",
	socks: "Nude",
	backbag: "Department Backpack",
	hair_style: "Bald",
	hair_color: "000",
	facial_hair_style: "Shaved",
	facial_hair_color: "000",
	skin_tone: "caucasian1",
	eye_color: "000",
	features: null,
	custom_names: null,
	prefered_security_department: "Random",
	preview_icon: null,
	job_civilian_high: 0,
	job_civilian_med: 0,
	job_civilian_low: 0,
	job_medsci_high: 0,
	job_medsci_med: 0,
	job_medsci_low: 0,
	job_engsec_high: 0,
	job_engsec_med: 0,
	job_engsec_low: 0,
	joblessrole: 2,
	current_tab: 0,
	metadata: "",
	unlock_content: 0,
	ignoring: null,
	clientfps: 0,
	parallax: null,
	screentip_pref: 1,
	runechat_pref: 1,
	widescreenpref: 1,
	uplink_spawn_loc: "PDA",
	menuoptions: null,
	pref_species: null,
}, { tmp: ["old_be_special"] });

// /datum/preferences/proc/<init>  (code/modules/client/preferences.dm:26)
rt.def("/datum/preferences/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "be_special", rt.list());
	rt.setSv(f, "features", rt.alist(f, ["mcolor", "FFF", "tail_lizard", "Smooth", "tail_human", "None", "snout", "Round", "horns", "None", "ears", "None", "wings", "None", "frills", "None", "spines", "None", "body_markings", "None", "legs", "Normal Legs"]));
	rt.setSv(f, "custom_names", rt.list("clown", "mime", "ai", "cyborg", "religion", "deity"));
	$0 = $0;
	rt.setSv(f, "ignoring", rt.list());
	$0 = $0;
	rt.setSv(f, "pref_species", rt.new_(f, T("/datum/species/human"), []));
	return f.dot;
});

// /datum/preferences/proc/New  (code/modules/client/preferences.dm:114)  may sleep
rt.def("/datum/preferences/proc/New", function* New(f: Frame, C: Value) {
	let loaded_preferences_successfully: Value = null;
	f.vars = () => [C, loaded_preferences_successfully];
	rt.setSv(f, "parent", live(C));
	rt.setAt(rt.sv(f, "custom_names"), "ai", rt.op(f, "PickUnweighted", [1], [rt.gl("ai_names")]));
	rt.setAt(rt.sv(f, "custom_names"), "cyborg", rt.op(f, "PickUnweighted", [1], [rt.gl("ai_names")]));
	rt.setAt(rt.sv(f, "custom_names"), "clown", rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")]));
	rt.setAt(rt.sv(f, "custom_names"), "mime", rt.op(f, "PickUnweighted", [1], [rt.gl("mime_names")]));
	if (truthy((rt.istype(live(C), T("/client")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/IsGuestKey"), null, [rt.fv(f, "key", live(C))])))) {
			yield* g.srcCall(f, "load_path", rt.fv(f, "ckey", live(C)));
			rt.setSv(f, "unlock_content", (yield* g.callName(f, live(C), "IsByondMember", [])));
			if (truthy(rt.sv(f, "unlock_content"))) {
				rt.setSv(f, "max_save_slots", 8);
			}
		}
	}
	if (truthy((loaded_preferences_successfully = (yield* g.srcCall(f, "load_preferences"))))) {
		if (truthy((yield* g.srcCall(f, "load_character")))) {
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "random_character");
	rt.setSv(f, "real_name", (yield* g.callName(f, rt.sv(f, "pref_species"), "random_name", [rt.sv(f, "gender"), 1])));
	if (!truthy(live(loaded_preferences_successfully))) {
		yield* g.srcCall(f, "save_preferences");
	}
	yield* g.srcCall(f, "save_character");
	rt.setSv(f, "menuoptions", rt.list());
	return live(f.dot);
}, true);

// /datum/preferences/proc/ShowChoices  (code/modules/client/preferences.dm:140)  may sleep
rt.def("/datum/preferences/proc/ShowChoices", function* ShowChoices(f: Frame, user: Value) {
	let dat: Value = null, S: Value = null, name: Value = null, i: Value = null, button_name: Value = null, p_map: Value = null, VM: Value = null, i_2: Value = null, days_remaining: Value = null, mode_path: Value = null, temp_mode: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, dat, S, name, i, button_name, p_map, VM, i_2, days_remaining, mode_path, temp_mode, popup, $0, $1, $2, $e];
	if ((!truthy(live(user)) || !truthy(rt.fv(f, "client", live(user))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_preview_icon");
	rt.op(f, "BrowseResource", [], [live(user), rt.sv(f, "preview_icon"), "previewicon.png"], false);
	dat = "<center>";
	if (isEqual(rt.sv(f, "current_tab"), 0)) {
		$0 = "class='linkOn'";
	} else {
		$0 = "";
	}
	dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=tab;tab=0' ＀>Character Settings</a> ", [$0]), add);
	if (isEqual(rt.sv(f, "current_tab"), 1)) {
		$0 = "class='linkOn'";
	} else {
		$0 = "";
	}
	dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=tab;tab=1' ＀>Game Preferences</a>", [$0]), add);
	if (!truthy(rt.sv(f, "path"))) {
		dat = rt.modify(live(dat), "<div class='notice'>Please create an account to save your preferences</div>", add);
	}
	dat = rt.modify(live(dat), "</center>", add);
	dat = rt.modify(live(dat), "<HR>", add);
	$0 = rt.sv(f, "current_tab");
	if ($0 === 0) {
		if (truthy(rt.sv(f, "path"))) {
			if (truthy((S = (yield* g.new_(f, T("/savefile"), [rt.sv(f, "path")]))))) {
				dat = rt.modify(live(dat), "<center>", add);
				name = null;
				i = null;
				i = 1;
				while (rt.le(live(i), rt.sv(f, "max_save_slots"))) {
					rt.setFv(f, "cd", live(S), fmt("/character＀", [live(i)]));
					name = rt.input(f, rt.R.index, null, [live(S), "real_name"]);
					if (!truthy(live(name))) {
						name = fmt("Character＀", [live(i)]);
					}
					$0 = live(i);
					if (isEqual(live(i), rt.sv(f, "default_slot"))) {
						$1 = "class='linkOn'";
					} else {
						$1 = "";
					}
					dat = rt.modify(live(dat), fmt("<a style='white-space:nowrap;' href='?_src_=prefs;preference=changeslot;num=＀;' ＀>＀</a> ", [$0, $1, live(name)]), add);
					i = rt.inc(live(i), 1);
				}
				dat = rt.modify(live(dat), "</center>", add);
			}
		}
		dat = rt.modify(live(dat), "<center><h2>Occupation Choices</h2>", add);
		dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=job;task=menu'>Set Occupation Preferences</a><br></center>", add);
		dat = rt.modify(live(dat), "<h2>Identity</h2>", add);
		dat = rt.modify(live(dat), "<table width='100%'><tr><td width='75%' valign='top'>", add);
		if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), "appearance"])))) {
			dat = rt.modify(live(dat), "<b>You are banned from using custom names and appearances. You can continue to adjust your characters, but you will be randomised once you join the game.</b><br>", add);
		}
		dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=name;task=random'>Random Name</A> ", add);
		if (truthy(rt.sv(f, "be_random_name"))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=name'>Always Random Name: ＀</a><BR>", [$0]), add);
		dat = rt.modify(live(dat), "<b>Name:</b> ", add);
		dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=name;task=input'>＀</a><BR>", [rt.sv(f, "real_name")]), add);
		if (isEqual(rt.sv(f, "gender"), "male")) {
			$0 = "Male";
		} else {
			$0 = "Female";
		}
		dat = rt.modify(live(dat), fmt("<b>Gender:</b> <a href='?_src_=prefs;preference=gender'>＀</a><BR>", [$0]), add);
		dat = rt.modify(live(dat), fmt("<b>Age:</b> <a href='?_src_=prefs;preference=age;task=input'>＀</a><BR>", [rt.sv(f, "age")]), add);
		dat = rt.modify(live(dat), "<b>Special Names:</b><BR>", add);
		dat = rt.modify(live(dat), fmt("<a href ='?_src_=prefs;preference=clown_name;task=input'><b>Clown:</b> ＀</a> ", [rt.at(rt.sv(f, "custom_names"), "clown")]), add);
		dat = rt.modify(live(dat), fmt("<a href ='?_src_=prefs;preference=mime_name;task=input'><b>Mime:</b>＀</a><BR>", [rt.at(rt.sv(f, "custom_names"), "mime")]), add);
		dat = rt.modify(live(dat), fmt("<a href ='?_src_=prefs;preference=ai_name;task=input'><b>AI:</b> ＀</a> ", [rt.at(rt.sv(f, "custom_names"), "ai")]), add);
		dat = rt.modify(live(dat), fmt("<a href ='?_src_=prefs;preference=cyborg_name;task=input'><b>Cyborg:</b> ＀</a><BR>", [rt.at(rt.sv(f, "custom_names"), "cyborg")]), add);
		dat = rt.modify(live(dat), fmt("<a href ='?_src_=prefs;preference=religion_name;task=input'><b>Chaplain religion:</b> ＀ </a>", [rt.at(rt.sv(f, "custom_names"), "religion")]), add);
		dat = rt.modify(live(dat), fmt("<a href ='?_src_=prefs;preference=deity_name;task=input'><b>Chaplain deity:</b> ＀</a><BR>", [rt.at(rt.sv(f, "custom_names"), "deity")]), add);
		dat = rt.modify(live(dat), "<b>Custom job preferences:</b><BR>", add);
		dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=sec_dept;task=input'><b>Prefered security department:</b> ＀</a><BR></td>", [rt.sv(f, "prefered_security_department")]), add);
		dat = rt.modify(live(dat), "<td valign='center'>", add);
		dat = rt.modify(live(dat), fmt("<div class='statusDisplay'><center><img src=previewicon.png width=＀ height=＀></center></div>", [(yield* g.callName(f, rt.sv(f, "preview_icon"), "Width", [])), (yield* g.callName(f, rt.sv(f, "preview_icon"), "Height", []))]), add);
		dat = rt.modify(live(dat), "</td></tr></table>", add);
		dat = rt.modify(live(dat), "<h2>Body</h2>", add);
		dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=all;task=random'>Random Body</A> ", add);
		if (truthy(rt.sv(f, "be_random_body"))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=all'>Always Random Body: ＀</A><br>", [$0]), add);
		dat = rt.modify(live(dat), "<table width='100%'><tr><td width='24%' valign='top'>", add);
		if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
			dat = rt.modify(live(dat), fmt("<b>Species:</b><BR><a href='?_src_=prefs;preference=species;task=input'>＀</a><BR>", [rt.fv(f, "name", rt.sv(f, "pref_species"))]), add);
		} else {
			dat = rt.modify(live(dat), "<b>Species:</b> Human<BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<b>Underwear:</b><BR><a href ='?_src_=prefs;preference=underwear;task=input'>＀</a><BR>", [rt.sv(f, "underwear")]), add);
		dat = rt.modify(live(dat), fmt("<b>Undershirt:</b><BR><a href ='?_src_=prefs;preference=undershirt;task=input'>＀</a><BR>", [rt.sv(f, "undershirt")]), add);
		dat = rt.modify(live(dat), fmt("<b>Socks:</b><BR><a href ='?_src_=prefs;preference=socks;task=input'>＀</a><BR>", [rt.sv(f, "socks")]), add);
		dat = rt.modify(live(dat), fmt("<b>Backpack:</b><BR><a href ='?_src_=prefs;preference=bag;task=input'>＀</a><BR>", [rt.sv(f, "backbag")]), add);
		dat = rt.modify(live(dat), fmt("<b>Uplink Spawn Location:</b><BR><a href ='?_src_=prefs;preference=uplink_loc;task=input'>＀</a><BR></td>", [rt.sv(f, "uplink_spawn_loc")]), add);
		if (truthy(rt.fv(f, "use_skintones", rt.sv(f, "pref_species")))) {
			dat = rt.modify(live(dat), "<td valign='top' width='21%'>", add);
			dat = rt.modify(live(dat), "<h3>Skin Tone</h3>", add);
			dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=s_tone;task=input'>＀</a><BR>", [rt.sv(f, "skin_tone")]), add);
			dat = rt.modify(live(dat), "</td>", add);
		}
		if (truthy((rt.isIn(f, 2, rt.fv(f, "species_traits", rt.sv(f, "pref_species"))) ? 1 : 0))) {
			dat = rt.modify(live(dat), "<td valign='top' width='21%'>", add);
			dat = rt.modify(live(dat), "<h3>Hair Style</h3>", add);
			dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=hair_style;task=input'>＀</a><BR>", [rt.sv(f, "hair_style")]), add);
			dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=previous_hair_style;task=input'>&lt;</a> <a href='?_src_=prefs;preference=next_hair_style;task=input'>&gt;</a><BR>", add);
			dat = rt.modify(live(dat), fmt("<span style='border:1px solid #161616; background-color: #＀;'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=hair;task=input'>Change</a><BR>", [rt.sv(f, "hair_color")]), add);
			dat = rt.modify(live(dat), "</td><td valign='top' width='21%'>", add);
			dat = rt.modify(live(dat), "<h3>Facial Hair Style</h3>", add);
			dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=facial_hair_style;task=input'>＀</a><BR>", [rt.sv(f, "facial_hair_style")]), add);
			dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=previous_facehair_style;task=input'>&lt;</a> <a href='?_src_=prefs;preference=next_facehair_style;task=input'>&gt;</a><BR>", add);
			dat = rt.modify(live(dat), fmt("<span style='border: 1px solid #161616; background-color: #＀;'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=facial;task=input'>Change</a><BR>", [rt.sv(f, "facial_hair_color")]), add);
			dat = rt.modify(live(dat), "</td>", add);
		}
		if (truthy((rt.isIn(f, 4, rt.fv(f, "species_traits", rt.sv(f, "pref_species"))) ? 1 : 0))) {
			dat = rt.modify(live(dat), "<td valign='top' width='21%'>", add);
			dat = rt.modify(live(dat), "<h3>Eye Color</h3>", add);
			dat = rt.modify(live(dat), fmt("<span style='border: 1px solid #161616; background-color: #＀;'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=eyes;task=input'>Change</a><BR>", [rt.sv(f, "eye_color")]), add);
			dat = rt.modify(live(dat), "</td>", add);
		}
		if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
			if ((truthy((rt.isIn(f, 1, rt.fv(f, "species_traits", rt.sv(f, "pref_species"))) ? 1 : 0)) || truthy((rt.isIn(f, 17, rt.fv(f, "species_traits", rt.sv(f, "pref_species"))) ? 1 : 0)))) {
				dat = rt.modify(live(dat), "<td valign='top' width='14%'>", add);
				dat = rt.modify(live(dat), "<h3>Mutant Color</h3>", add);
				dat = rt.modify(live(dat), fmt("<span style='border: 1px solid #161616; background-color: #＀;'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=mutant_color;task=input'>Change</a><BR>", [rt.at(rt.sv(f, "features"), "mcolor")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "tail_lizard", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Tail</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=tail_lizard;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "tail_lizard")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "snout", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Snout</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=snout;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "snout")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "horns", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Horns</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=horns;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "horns")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "frills", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Frills</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=frills;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "frills")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "spines", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Spines</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=spines;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "spines")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "body_markings", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Body Markings</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=body_markings;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "body_markings")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "legs", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Legs</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=legs;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "legs")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
		}
		if (truthy(rt.fv(f, "mutant_humans", rt.gl("config")))) {
			if (truthy((rt.isIn(f, "tail_human", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Tail</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=tail_human;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "tail_human")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "ears", rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species"))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Ears</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=ears;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "ears")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
			if (truthy((rt.isIn(f, "wings", (rt.fv(f, "mutant_bodyparts", rt.sv(f, "pref_species")) && (rt.gt(rt.len(f, rt.gl("r_wings_list")), 1) ? 1 : 0))) ? 1 : 0))) {
				dat = rt.modify(live(dat), "<td valign='top' width='7%'>", add);
				dat = rt.modify(live(dat), "<h3>Wings</h3>", add);
				dat = rt.modify(live(dat), fmt("<a href='?_src_=prefs;preference=wings;task=input'>＀</a><BR>", [rt.at(rt.sv(f, "features"), "wings")]), add);
				dat = rt.modify(live(dat), "</td>", add);
			}
		}
		dat = rt.modify(live(dat), "</tr></table>", add);
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), "<table><tr><td width='340px' height='300px' valign='top'>", add);
		dat = rt.modify(live(dat), "<h2>General Settings</h2>", add);
		dat = rt.modify(live(dat), fmt("<b>UI Style:</b> <a href='?_src_=prefs;task=input;preference=ui'>＀</a><br>", [rt.sv(f, "UI_style")]), add);
		if (truthy(rt.sv(f, "tgui_fancy"))) {
			$0 = "Fancy";
		} else {
			$0 = "No Frills";
		}
		dat = rt.modify(live(dat), fmt("<b>tgui Style:</b> <a href='?_src_=prefs;preference=tgui_fancy'>＀</a><br>", [$0]), add);
		if (truthy(rt.sv(f, "tgui_lock"))) {
			$0 = "Primary";
		} else {
			$0 = "All";
		}
		dat = rt.modify(live(dat), fmt("<b>tgui Monitors:</b> <a href='?_src_=prefs;preference=tgui_lock'>＀</a><br>", [$0]), add);
		if (truthy(rt.sv(f, "windowflashing"))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<b>Window Flashing:</b> <a href='?_src_=prefs;preference=winflash'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "toggles"), 2))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<b>Play admin midis:</b> <a href='?_src_=prefs;preference=hear_midis'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "toggles"), 8))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<b>Play lobby music:</b> <a href='?_src_=prefs;preference=lobby_music'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "chat_toggles"), 4))) {
			$0 = "All Speech";
		} else {
			$0 = "Nearest Creatures";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghost ears:</b> <a href='?_src_=prefs;preference=ghost_ears'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "chat_toggles"), 8))) {
			$0 = "All Emotes";
		} else {
			$0 = "Nearest Creatures";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghost sight:</b> <a href='?_src_=prefs;preference=ghost_sight'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "chat_toggles"), 128))) {
			$0 = "All Speech";
		} else {
			$0 = "Nearest Creatures";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghost whispers:</b> <a href='?_src_=prefs;preference=ghost_whispers'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "chat_toggles"), 512))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghost radio:</b> <a href='?_src_=prefs;preference=ghost_radio'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "chat_toggles"), 256))) {
			$0 = "All Messages";
		} else {
			$0 = "Nearest Creatures";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghost pda:</b> <a href='?_src_=prefs;preference=ghost_pda'>＀</a><br>", [$0]), add);
		if (truthy(rt.bitAnd(rt.sv(f, "toggles"), 64))) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat = rt.modify(live(dat), fmt("<b>Midround Antagonist:</b> <a href='?_src_=prefs;preference=allow_midround_antag'>＀</a><br>", [$0]), add);
		if (truthy(rt.fv(f, "allow_Metadata", rt.gl("config")))) {
			dat = rt.modify(live(dat), "<b>OOC Notes:</b> <a href='?_src_=prefs;preference=metadata;task=input'>Edit </a><br>", add);
		}
		if (truthy(rt.fv(f, "client", live(user)))) {
			if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(user))))) {
				if (truthy(rt.bitAnd(rt.sv(f, "toggles"), 1))) {
					$0 = "On";
				} else {
					$0 = "Off";
				}
				dat = rt.modify(live(dat), fmt("<b>Adminhelp Sound:</b> <a href='?_src_=prefs;preference=hear_adminhelps'>＀</a><br>", [$0]), add);
				if (truthy(rt.bitAnd(rt.sv(f, "toggles"), 1024))) {
					$0 = "On";
				} else {
					$0 = "Off";
				}
				dat = rt.modify(live(dat), fmt("<b>Announce Login:</b> <a href='?_src_=prefs;preference=announce_login'>＀</a><br>", [$0]), add);
			}
			if ((truthy(rt.sv(f, "unlock_content")) || truthy((yield* g.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]))))) {
				if (truthy(rt.sv(f, "ooccolor"))) {
					$0 = rt.sv(f, "ooccolor");
				} else {
					$0 = rt.gl("normal_ooc_colour");
				}
				dat = rt.modify(live(dat), fmt("<b>OOC:</b> <span style='border: 1px solid #161616; background-color: ＀;'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=ooccolor;task=input'>Change</a><br>", [$0]), add);
			}
			if (truthy(rt.sv(f, "unlock_content"))) {
				if (truthy(rt.bitAnd(rt.sv(f, "toggles"), 16))) {
					$0 = "Public";
				} else {
					$0 = "Hidden";
				}
				dat = rt.modify(live(dat), fmt("<b>BYOND Membership Publicity:</b> <a href='?_src_=prefs;preference=publicity'>＀</a><br>", [$0]), add);
				dat = rt.modify(live(dat), fmt("<b>Ghost Form:</b> <a href='?_src_=prefs;task=input;preference=ghostform'>＀</a><br>", [rt.sv(f, "ghost_form")]), add);
				dat = rt.modify(live(dat), fmt("<B>Ghost Orbit: </B> <a href='?_src_=prefs;task=input;preference=ghostorbit'>＀</a><br>", [rt.sv(f, "ghost_orbit")]), add);
			}
		}
		button_name = "If you see this something went wrong.";
		$0 = rt.sv(f, "ghost_accs");
		if ($0 === 100) {
			button_name = "full accessories";
		} else if ($0 === 50) {
			button_name = "only directional sprites";
		} else if ($0 === 1) {
			button_name = "default sprites";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghost Accessories:</b> <a href='?_src_=prefs;task=input;preference=ghostaccs'>＀</a><br>", [live(button_name)]), add);
		$0 = rt.sv(f, "ghost_others");
		if ($0 === 100) {
			button_name = "their setting";
		} else if ($0 === 50) {
			button_name = "default sprites";
		} else if ($0 === 1) {
			button_name = "white ghost";
		}
		dat = rt.modify(live(dat), fmt("<b>Ghosts of Others:</b> <a href='?_src_=prefs;task=input;preference=ghostothers'>＀</a><br>", [live(button_name)]), add);
		if (truthy(rt.fv(f, "maprotation", rt.gl("config")))) {
			if (!truthy((p_map = rt.sv(f, "preferred_map")))) {
				p_map = "Default";
				if (truthy(rt.fv(f, "defaultmap", rt.gl("config")))) {
					p_map = rt.modify(live(p_map), fmt(" (＀)", [rt.gv(f, "map_name", rt.fv(f, "defaultmap", rt.gl("config")))]), add);
				}
			} else {
				if (truthy((rt.isIn(f, live(p_map), rt.fv(f, "maplist", rt.gl("config"))) ? 1 : 0))) {
					if (!truthy((VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(p_map))))) {
						p_map = rt.modify(live(p_map), " (No longer exists)", add);
					} else {
						p_map = rt.fv(f, "map_name", live(VM));
					}
				} else {
					p_map = rt.modify(live(p_map), " (No longer exists)", add);
				}
			}
			if (truthy(rt.fv(f, "allow_map_voting", rt.gl("config")))) {
				dat = rt.modify(live(dat), fmt("<b>Preferred Map:</b> <a href='?_src_=prefs;preference=preferred_map;task=input'>＀</a><br>", [live(p_map)]), add);
			}
		}
		dat = rt.modify(live(dat), fmt("<b>FPS:</b> <a href='?_src_=prefs;preference=clientfps;task=input'>＀</a><br>", [rt.sv(f, "clientfps")]), add);
		dat = rt.modify(live(dat), "<b>Parallax (Fancy Space):</b> <a href='?_src_=prefs;preference=parallaxdown' oncontextmenu='window.location.href=\"?_src_=prefs;preference=parallaxup\";return false;'>", add);
		$0 = rt.sv(f, "parallax");
		if ($0 === 2) {
			dat = rt.modify(live(dat), "Low", add);
		} else if ($0 === 1) {
			dat = rt.modify(live(dat), "Medium", add);
		} else if ($0 === -1) {
			dat = rt.modify(live(dat), "Insane", add);
		} else if ($0 === 3) {
			dat = rt.modify(live(dat), "Disabled", add);
		} else {
			dat = rt.modify(live(dat), "High", add);
		}
		dat = rt.modify(live(dat), "</a><br>", add);
		dat = rt.modify(live(dat), "</td><td width='300px' height='300px' valign='top'>", add);
		dat = rt.modify(live(dat), "<h2>Special Role Settings</h2>", add);
		if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), "Syndicate"])))) {
			dat = rt.modify(live(dat), "<font color=red><b>You are banned from antagonist roles.</b></font>", add);
			rt.setFv(f, "be_special", live(f.src), rt.list());
		}
		i_2 = null;
		rt.forList(f, 0, rt.gl("special_roles"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i_2 = $e;
			if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), live(i_2)])))) {
				dat = rt.modify(live(dat), fmt("<b>Be ＀:</b> BANNED<br>", [(yield* g.call(f, P("/proc/capitalize"), null, [live(i_2)]))]), add);
			} else {
				$0 = (yield* g.call(f, P("/proc/capitalize"), null, [live(i_2)]));
				$1 = live(i_2);
				if (truthy((rt.isIn(f, live(i_2), rt.sv(f, "be_special")) ? 1 : 0))) {
					$2 = "Yes";
				} else {
					$2 = "No";
				}
				dat = rt.modify(live(dat), fmt("<b>Be ＀:</b> <a href='?_src_=prefs;preference=be_special;be_special_type=＀'>＀</a><br>", [$0, $1, $2]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</td></tr></table>", add);
	}
	dat = rt.modify(live(dat), "<hr><center>", add);
	if (!truthy((yield* g.call(f, P("/proc/IsGuestKey"), null, [rt.fv(f, "key", live(user))])))) {
		dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=load'>Undo</a> ", add);
		dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=save'>Save Setup</a> ", add);
	}
	dat = rt.modify(live(dat), "<a href='?_src_=prefs;preference=reset_all'>Reset Setup</a>", add);
	dat = rt.modify(live(dat), "</center>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "preferences", "<div align='center'>Character Setup</div>", 640, 770]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", [0]);
	return f.dot;
}, true);

// /datum/preferences/proc/SetChoices  (code/modules/client/preferences.dm:494)  may sleep
rt.def("/datum/preferences/proc/SetChoices", function* SetChoices(f: Frame, user: Value, limit: Value, splitJobs: Value, widthPerColumn: Value, height: Value) {
	let width: Value = null, HTML: Value = null, index: Value = null, lastJob: Value = null, job: Value = null, i: Value = null, rank: Value = null, available_in_days: Value = null, prefLevelLabel: Value = null, prefLevelColor: Value = null, prefUpperLevel: Value = null, prefLowerLevel: Value = null, i_4: Value = null, message: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, limit, splitJobs, widthPerColumn, height, width, HTML, index, lastJob, job, i, rank, available_in_days, prefLevelLabel, prefLevelColor, prefUpperLevel, prefLowerLevel, i_4, message, popup, $e];
	if (live(limit) === null) {
		limit = 17;
	}
	if (live(splitJobs) === null) {
		splitJobs = rt.list("Chief Engineer");
	}
	if (live(widthPerColumn) === null) {
		widthPerColumn = 295;
	}
	if (live(height) === null) {
		height = 620;
	}
	if (!truthy(rt.gl("SSjob"))) {
		return live(f.dot);
	}
	width = live(widthPerColumn);
	HTML = "<center>";
	if (rt.le(rt.getLen(f, rt.fv(f, "occupations", rt.gl("SSjob"))), 0)) {
		HTML = rt.modify(live(HTML), "The job SSticker is not yet finished creating jobs, please try again later", add);
		HTML = rt.modify(live(HTML), "<center><a href='?_src_=prefs;preference=job;task=close'>Done</a></center><br>", add);
	} else {
		HTML = rt.modify(live(HTML), "<b>Choose occupation chances</b><br>", add);
		HTML = rt.modify(live(HTML), "<div align='center'>Left-click to raise an occupation preference, right-click to lower it.<br></div>", add);
		HTML = rt.modify(live(HTML), "<center><a href='?_src_=prefs;preference=job;task=close'>Done</a></center><br>", add);
		HTML = rt.modify(live(HTML), "<script type='text/javascript'>function setJobPrefRedirect(level, rank) { window.location.href='?_src_=prefs;preference=job;task=setJobLevel;level=' + level + ';text=' + encodeURIComponent(rank); return false; }</script>", add);
		HTML = rt.modify(live(HTML), "<table width='100%' cellpadding='1' cellspacing='0'><tr><td width='20%'>", add);
		HTML = rt.modify(live(HTML), "<table width='100%' cellpadding='1' cellspacing='0'>", add);
		index = -1;
		lastJob = null;
		job = null;
		rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
		while (($e = rt.next(f, 0)) !== undefined) {
			job = $e;
			if ((rt.ge((index = rt.modify(live(index), 1, add)), live(limit)) || truthy((rt.isIn(f, rt.fv(f, "title", live(job)), live(splitJobs)) ? 1 : 0)))) {
				width = rt.modify(live(width), live(widthPerColumn), add);
				if ((rt.lt(live(index), live(limit)) && live(lastJob) !== null)) {
					i = null;
					i = 0;
					while (rt.lt(live(i), subtract(live(limit), live(index)))) {
						HTML = rt.modify(live(HTML), fmt("<tr bgcolor='＀'><td width='60%' align='right'>&nbsp</td><td>&nbsp</td></tr>", [rt.fv(f, "selection_color", live(lastJob))]), add);
						i = rt.modify(live(i), 1, add);
					}
				}
				HTML = rt.modify(live(HTML), "</table></td><td width='20%'><table width='100%' cellpadding='1' cellspacing='0'>", add);
				index = 0;
			}
			HTML = rt.modify(live(HTML), fmt("<tr bgcolor='＀'><td width='60%' align='right'>", [rt.fv(f, "selection_color", live(job))]), add);
			rank = rt.fv(f, "title", live(job));
			lastJob = live(job);
			if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), live(rank)])))) {
				HTML = rt.modify(live(HTML), fmt("<font color=red>＀</font></td><td> BANNED</td></tr>", [live(rank)]), add);
				continue;
			}
			if (((truthy(rt.bitAnd(rt.sv(f, "job_civilian_low"), 8192)) && !isEqual(live(rank), "Assistant")) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), "Assistant"]))))) {
				HTML = rt.modify(live(HTML), fmt("<font color=orange>＀</font></td><td></td></tr>", [live(rank)]), add);
				continue;
			}
			if ((truthy(rt.fv(f, "enforce_human_authority", rt.gl("config"))) && !truthy((yield* g.callName(f, rt.gv(f, "pref_species", rt.gv(f, "prefs", rt.fv(f, "client", live(user)))), "qualifies_for_rank", [live(rank), rt.gv(f, "features", rt.gv(f, "prefs", rt.fv(f, "client", live(user))))]))))) {
				if (isEqual(rt.gv(f, "id", rt.gv(f, "pref_species", rt.gv(f, "prefs", rt.fv(f, "client", live(user))))), "human")) {
					HTML = rt.modify(live(HTML), fmt("<font color=red>＀</font></td><td><font color=red><b> [MUTANT]</b></font></td></tr>", [live(rank)]), add);
				} else {
					HTML = rt.modify(live(HTML), fmt("<font color=red>＀</font></td><td><font color=red><b> [NON-HUMAN]</b></font></td></tr>", [live(rank)]), add);
				}
				continue;
			}
			if ((truthy((rt.isIn(f, live(rank), rt.gl("command_positions")) ? 1 : 0)) || isEqual(live(rank), "AI"))) {
				HTML = rt.modify(live(HTML), fmt("<b><span class='dark'>＀</span></b>", [live(rank)]), add);
			} else {
				HTML = rt.modify(live(HTML), fmt("<span class='dark'>＀</span>", [live(rank)]), add);
			}
			HTML = rt.modify(live(HTML), "</td><td width='40%'>", add);
			prefLevelLabel = "ERROR";
			prefLevelColor = "pink";
			prefUpperLevel = -1;
			prefLowerLevel = -1;
			if (truthy(rt.bitAnd((yield* g.srcCall(f, "GetJobDepartment", live(job), 1)), rt.fv(f, "flag", live(job))))) {
				prefLevelLabel = "High";
				prefLevelColor = "slateblue";
				prefUpperLevel = 4;
				prefLowerLevel = 2;
			} else {
				if (truthy(rt.bitAnd((yield* g.srcCall(f, "GetJobDepartment", live(job), 2)), rt.fv(f, "flag", live(job))))) {
					prefLevelLabel = "Medium";
					prefLevelColor = "green";
					prefUpperLevel = 1;
					prefLowerLevel = 3;
				} else {
					if (truthy(rt.bitAnd((yield* g.srcCall(f, "GetJobDepartment", live(job), 3)), rt.fv(f, "flag", live(job))))) {
						prefLevelLabel = "Low";
						prefLevelColor = "orange";
						prefUpperLevel = 2;
						prefLowerLevel = 4;
					} else {
						prefLevelLabel = "NEVER";
						prefLevelColor = "red";
						prefUpperLevel = 3;
						prefLowerLevel = 1;
					}
				}
			}
			HTML = rt.modify(live(HTML), fmt("<a class='white' href='?_src_=prefs;preference=job;task=setJobLevel;level=＀;text=＀' oncontextmenu='javascript:return setJobPrefRedirect(＀, \"＀\");'>", [live(prefUpperLevel), live(rank), live(prefLowerLevel), live(rank)]), add);
			if (isEqual(live(rank), "Assistant")) {
				if (truthy(rt.bitAnd(rt.sv(f, "job_civilian_low"), 8192))) {
					HTML = rt.modify(live(HTML), "<font color=green>Yes</font>", add);
				} else {
					HTML = rt.modify(live(HTML), "<font color=red>No</font>", add);
				}
				HTML = rt.modify(live(HTML), "</a></td></tr>", add);
				continue;
			}
			HTML = rt.modify(live(HTML), fmt("<font color=＀>＀</font>", [live(prefLevelColor), live(prefLevelLabel)]), add);
			HTML = rt.modify(live(HTML), "</a></td></tr>", add);
		}
		rt.endFor(f, 0);
		i_4 = null;
		i_4 = 1;
		while (rt.lt(live(i_4), subtract(live(limit), live(index)))) {
			HTML = rt.modify(live(HTML), fmt("<tr bgcolor='＀'><td width='60%' align='right'>&nbsp</td><td>&nbsp</td></tr>", [rt.fv(f, "selection_color", live(lastJob))]), add);
			i_4 = rt.modify(live(i_4), 1, add);
		}
		HTML = rt.modify(live(HTML), "</td'></tr></table>", add);
		HTML = rt.modify(live(HTML), "</center></table>", add);
		message = "Be an Assistant if preferences unavailable";
		if (isEqual(rt.sv(f, "joblessrole"), 2)) {
			message = "Get random job if preferences unavailable";
		} else {
			if (isEqual(rt.sv(f, "joblessrole"), 3)) {
				message = "Return to lobby if preferences unavailable";
			}
		}
		HTML = rt.modify(live(HTML), fmt("<center><br><a href='?_src_=prefs;preference=job;task=random'>＀</a></center>", [live(message)]), add);
		HTML = rt.modify(live(HTML), "<center><a href='?_src_=prefs;preference=job;task=reset'>Reset Preferences</a></center>", add);
	}
	rt.op(f, "Browse", [], [live(user), null, "window=preferences"], false);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "mob_occupation", "<div align='center'>Occupation Preferences</div>", live(width), live(height)]))), "set_window_options", ["can_close=0"]);
	yield* g.callName(f, live(popup), "set_content", [live(HTML)]);
	yield* g.callName(f, live(popup), "open", [0]);
	return live(f.dot);
}, true);

// /datum/preferences/proc/SetJobPreferenceLevel  (code/modules/client/preferences.dm:622)
rt.def("/datum/preferences/proc/SetJobPreferenceLevel", function SetJobPreferenceLevel(f: Frame, job: Value, level: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(live(job))) {
		return 0;
	}
	if (isEqual(live(level), 1)) {
		(rt.modSrcVar(f, "job_civilian_med", rt.sv(f, "job_civilian_high"), rt.bitOr));
		(rt.modSrcVar(f, "job_engsec_med", rt.sv(f, "job_engsec_high"), rt.bitOr));
		(rt.modSrcVar(f, "job_medsci_med", rt.sv(f, "job_medsci_high"), rt.bitOr));
		rt.setSv(f, "job_civilian_high", 0);
		rt.setSv(f, "job_engsec_high", 0);
		rt.setSv(f, "job_medsci_high", 0);
	}
	if (isEqual(rt.fv(f, "department_flag", live(job)), 4)) {
		(rt.modSrcVar(f, "job_civilian_low", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
		(rt.modSrcVar(f, "job_civilian_med", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
		(rt.modSrcVar(f, "job_civilian_high", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
		$0 = live(level);
		if ($0 === 1) {
			(rt.modSrcVar(f, "job_civilian_high", rt.fv(f, "flag", live(job)), rt.bitOr));
		} else if ($0 === 2) {
			(rt.modSrcVar(f, "job_civilian_med", rt.fv(f, "flag", live(job)), rt.bitOr));
		} else if ($0 === 3) {
			(rt.modSrcVar(f, "job_civilian_low", rt.fv(f, "flag", live(job)), rt.bitOr));
		}
		return 1;
	} else {
		if (isEqual(rt.fv(f, "department_flag", live(job)), 1)) {
			(rt.modSrcVar(f, "job_engsec_low", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
			(rt.modSrcVar(f, "job_engsec_med", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
			(rt.modSrcVar(f, "job_engsec_high", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
			$0 = live(level);
			if ($0 === 1) {
				(rt.modSrcVar(f, "job_engsec_high", rt.fv(f, "flag", live(job)), rt.bitOr));
			} else if ($0 === 2) {
				(rt.modSrcVar(f, "job_engsec_med", rt.fv(f, "flag", live(job)), rt.bitOr));
			} else if ($0 === 3) {
				(rt.modSrcVar(f, "job_engsec_low", rt.fv(f, "flag", live(job)), rt.bitOr));
			}
			return 1;
		} else {
			if (isEqual(rt.fv(f, "department_flag", live(job)), 2)) {
				(rt.modSrcVar(f, "job_medsci_low", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
				(rt.modSrcVar(f, "job_medsci_med", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
				(rt.modSrcVar(f, "job_medsci_high", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
				$0 = live(level);
				if ($0 === 1) {
					(rt.modSrcVar(f, "job_medsci_high", rt.fv(f, "flag", live(job)), rt.bitOr));
				} else if ($0 === 2) {
					(rt.modSrcVar(f, "job_medsci_med", rt.fv(f, "flag", live(job)), rt.bitOr));
				} else if ($0 === 3) {
					(rt.modSrcVar(f, "job_medsci_low", rt.fv(f, "flag", live(job)), rt.bitOr));
				}
				return 1;
			}
		}
	}
	return 0;
});

// /datum/preferences/proc/UpdateJobPreference  (code/modules/client/preferences.dm:680)  may sleep
rt.def("/datum/preferences/proc/UpdateJobPreference", function* UpdateJobPreference(f: Frame, user: Value, role: Value, desiredLvl: Value) {
	let job: Value = null;
	f.vars = () => [user, role, desiredLvl, job];
	if ((!truthy(rt.gl("SSjob")) || rt.le(rt.getLen(f, rt.fv(f, "occupations", rt.gl("SSjob"))), 0))) {
		return live(f.dot);
	}
	if (!truthy((job = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [live(role)]))))) {
		rt.op(f, "Browse", [], [live(user), null, "window=mob_occupation"], false);
		yield* g.srcCall(f, "ShowChoices", live(user));
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(desiredLvl)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>UpdateJobPreference - desired level was not a number. Please notify coders!</span>"]);
		yield* g.srcCall(f, "ShowChoices", live(user));
		return live(f.dot);
	}
	if (isEqual(live(role), "Assistant")) {
		if (truthy(rt.bitAnd(rt.sv(f, "job_civilian_low"), rt.fv(f, "flag", live(job))))) {
			(rt.modSrcVar(f, "job_civilian_low", rt.op(f, "BitNot", [], [rt.fv(f, "flag", live(job))]), rt.bitAnd));
		} else {
			(rt.modSrcVar(f, "job_civilian_low", rt.fv(f, "flag", live(job)), rt.bitOr));
		}
		yield* g.srcCall(f, "SetChoices", live(user));
		return 1;
	}
	yield* g.srcCall(f, "SetJobPreferenceLevel", live(job), live(desiredLvl));
	yield* g.srcCall(f, "SetChoices", live(user));
	return 1;
}, true);

// /datum/preferences/proc/GetJobDepartment  (code/modules/client/preferences.dm:724)
rt.def("/datum/preferences/proc/GetJobDepartment", function GetJobDepartment(f: Frame, job: Value, level: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((!truthy(live(job)) || !truthy(live(level)))) {
		return 0;
	}
	$0 = rt.fv(f, "department_flag", live(job));
	if ($0 === 4) {
		$0 = live(level);
		if ($0 === 1) {
			return rt.sv(f, "job_civilian_high");
		} else if ($0 === 2) {
			return rt.sv(f, "job_civilian_med");
		} else if ($0 === 3) {
			return rt.sv(f, "job_civilian_low");
		}
	} else if ($0 === 2) {
		$0 = live(level);
		if ($0 === 1) {
			return rt.sv(f, "job_medsci_high");
		} else if ($0 === 2) {
			return rt.sv(f, "job_medsci_med");
		} else if ($0 === 3) {
			return rt.sv(f, "job_medsci_low");
		}
	} else if ($0 === 1) {
		$0 = live(level);
		if ($0 === 1) {
			return rt.sv(f, "job_engsec_high");
		} else if ($0 === 2) {
			return rt.sv(f, "job_engsec_med");
		} else if ($0 === 3) {
			return rt.sv(f, "job_engsec_low");
		}
	}
	return 0;
});

// /datum/preferences/proc/process_link  (code/modules/client/preferences.dm:754)  may sleep
rt.def("/datum/preferences/proc/process_link", function* process_link(f: Frame, user: Value, href_list: Value) {
	let job: Value = null, sql_ckey: Value = null, query_get_jobban: Value = null, reason: Value = null, bantime: Value = null, duration: Value = null, expiration_time: Value = null, a_ckey: Value = null, text: Value = null, be_special_type: Value = null, new_form: Value = null, new_orbit: Value = null, new_ghost_accs: Value = null, new_ghost_others: Value = null, new_name: Value = null, new_age: Value = null, new_metadata: Value = null, new_hair: Value = null, new_hair_style: Value = null, new_facial: Value = null, new_facial_hair_style: Value = null, new_underwear: Value = null, new_undershirt: Value = null, new_socks: Value = null, new_eyes: Value = null, result: Value = null, newtype: Value = null, temp_hsv: Value = null, new_mutantcolor: Value = null, temp_hsv_1: Value = null, new_tail: Value = null, new_snout: Value = null, new_horns: Value = null, new_ears: Value = null, new_wings: Value = null, new_frills: Value = null, new_spines: Value = null, new_body_markings: Value = null, new_legs: Value = null, new_s_tone: Value = null, new_ooccolor: Value = null, new_backbag: Value = null, new_loc: Value = null, new_clown_name: Value = null, new_mime_name: Value = null, new_ai_name: Value = null, new_cyborg_name: Value = null, new_religion_name: Value = null, new_deity_name: Value = null, department: Value = null, maplist: Value = null, _default: Value = null, M: Value = null, VM: Value = null, friendlyname: Value = null, pickedmap: Value = null, version_message: Value = null, desiredfps: Value = null, pickedui: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, href_list, job, sql_ckey, query_get_jobban, reason, bantime, duration, expiration_time, a_ckey, text, be_special_type, new_form, new_orbit, new_ghost_accs, new_ghost_others, new_name, new_age, new_metadata, new_hair, new_hair_style, new_facial, new_facial_hair_style, new_underwear, new_undershirt, new_socks, new_eyes, result, newtype, temp_hsv, new_mutantcolor, temp_hsv_1, new_tail, new_snout, new_horns, new_ears, new_wings, new_frills, new_spines, new_body_markings, new_legs, new_s_tone, new_ooccolor, new_backbag, new_loc, new_clown_name, new_mime_name, new_ai_name, new_cyborg_name, new_religion_name, new_deity_name, department, maplist, _default, M, VM, friendlyname, pickedmap, version_message, desiredfps, pickedui, $0, $e];
	if (isEqual(rt.at(live(href_list), "preference"), "job")) {
		$0 = rt.at(live(href_list), "task");
		if ($0 === "close") {
			rt.op(f, "Browse", [], [live(user), null, "window=mob_occupation"], false);
			yield* g.srcCall(f, "ShowChoices", live(user));
		} else if ($0 === "reset") {
			yield* g.srcCall(f, "ResetJobs");
			yield* g.srcCall(f, "SetChoices", live(user));
		} else if ($0 === "random") {
			$0 = rt.sv(f, "joblessrole");
			if ($0 === 3) {
				if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), "Assistant"])))) {
					rt.setSv(f, "joblessrole", 2);
				} else {
					rt.setSv(f, "joblessrole", 1);
				}
			} else if ($0 === 1) {
				rt.setSv(f, "joblessrole", 2);
			} else if ($0 === 2) {
				rt.setSv(f, "joblessrole", 3);
			}
			yield* g.srcCall(f, "SetChoices", live(user));
		} else if ($0 === "setJobLevel") {
			yield* g.srcCall(f, "UpdateJobPreference", live(user), rt.at(live(href_list), "text"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "level")])));
		} else {
			yield* g.srcCall(f, "SetChoices", live(user));
		}
		return 1;
	}
	$0 = rt.at(live(href_list), "task");
	if ($0 === "random") {
		$0 = rt.at(live(href_list), "preference");
		if ($0 === "name") {
			rt.setSv(f, "real_name", (yield* g.callName(f, rt.sv(f, "pref_species"), "random_name", [rt.sv(f, "gender"), 1])));
		} else if ($0 === "age") {
			rt.setSv(f, "age", (yield* g.call(f, P("/proc/rand"), null, [17, 85])));
		} else if ($0 === "hair") {
			rt.setSv(f, "hair_color", (yield* g.call(f, P("/proc/random_short_color"), null, [])));
		} else if ($0 === "hair_style") {
			rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/random_hair_style"), null, [rt.sv(f, "gender")])));
		} else if ($0 === "facial") {
			rt.setSv(f, "facial_hair_color", (yield* g.call(f, P("/proc/random_short_color"), null, [])));
		} else if ($0 === "facial_hair_style") {
			rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/random_facial_hair_style"), null, [rt.sv(f, "gender")])));
		} else if ($0 === "underwear") {
			rt.setSv(f, "underwear", (yield* g.call(f, P("/proc/random_underwear"), null, [rt.sv(f, "gender")])));
		} else if ($0 === "undershirt") {
			rt.setSv(f, "undershirt", (yield* g.call(f, P("/proc/random_undershirt"), null, [rt.sv(f, "gender")])));
		} else if ($0 === "socks") {
			rt.setSv(f, "socks", (yield* g.call(f, P("/proc/random_socks"), null, [])));
		} else if ($0 === "eyes") {
			rt.setSv(f, "eye_color", (yield* g.call(f, P("/proc/random_eye_color"), null, [])));
		} else if ($0 === "s_tone") {
			rt.setSv(f, "skin_tone", (yield* g.call(f, P("/proc/random_skin_tone"), null, [])));
		} else if ($0 === "bag") {
			rt.setSv(f, "backbag", rt.op(f, "PickUnweighted", [1], [rt.gl("backbaglist")]));
		} else if ($0 === "all") {
			yield* g.srcCall(f, "random_character");
		}
	} else if ($0 === "input") {
		$0 = rt.at(live(href_list), "preference");
		if ($0 === "ghostform") {
			if (truthy(rt.sv(f, "unlock_content"))) {
				if (truthy((new_form = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly form:", live(user), rt.gl("ghost_forms")]))))) {
					rt.setSv(f, "ghost_form", live(new_form));
				}
			}
		} else if ($0 === "ghostorbit") {
			if (truthy(rt.sv(f, "unlock_content"))) {
				if (truthy((new_orbit = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly orbit:", live(user), rt.gl("ghost_orbits")]))))) {
					rt.setSv(f, "ghost_orbit", live(new_orbit));
				}
			}
		} else if ($0 === "ghostaccs") {
			$0 = (new_ghost_accs = (yield* g.call(f, P("/proc/alert"), null, ["Do you want your ghost to show full accessories where possible, hide accessories but still use the directional sprites where possible, or also ignore the directions and stick to the default sprites?", null, "full accessories", "only directional sprites", "default sprites"])));
			if ($0 === "full accessories") {
				rt.setSv(f, "ghost_accs", 100);
			} else if ($0 === "only directional sprites") {
				rt.setSv(f, "ghost_accs", 50);
			} else if ($0 === "default sprites") {
				rt.setSv(f, "ghost_accs", 1);
			}
		} else if ($0 === "ghostothers") {
			$0 = (new_ghost_others = (yield* g.call(f, P("/proc/alert"), null, ["Do you want the ghosts of others to show up as their own setting, as their default sprites or always as the default white ghost?", null, "their setting", "default sprites", "white ghost"])));
			if ($0 === "their setting") {
				rt.setSv(f, "ghost_others", 100);
			} else if ($0 === "default sprites") {
				rt.setSv(f, "ghost_others", 50);
			} else if ($0 === "white ghost") {
				rt.setSv(f, "ghost_others", 1);
			}
		} else if ($0 === "name") {
			if (truthy((new_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's name:", live(user), null]))]))))) {
				rt.setSv(f, "real_name", live(new_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "age") {
			if (truthy((new_age = (yield* g.op(f, "Prompt", [33], [null, "Character Preference", fmt("Choose your character's age:\n(＀-＀)", [17, 85]), live(user), null]))))) {
				rt.setSv(f, "age", (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/text2num"), null, [live(new_age)]))])), 85])), 17])));
			}
		} else if ($0 === "metadata") {
			if (truthy((new_metadata = (yield* g.op(f, "Prompt", [65], [rt.sv(f, "metadata"), "Game Preference", "Enter any information you'd like others to see, such as Roleplay-preferences:", live(user), null]))))) {
				rt.setSv(f, "metadata", (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(new_metadata), 1, 1024]))])));
			}
		} else if ($0 === "hair") {
			if (truthy((new_hair = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's hair colour:", live(user), null]))))) {
				rt.setSv(f, "hair_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_hair)])));
			}
		} else if ($0 === "hair_style") {
			new_hair_style = null;
			if (isEqual(rt.sv(f, "gender"), "male")) {
				new_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's hair style:", live(user), rt.gl("hair_styles_male_list")]));
			} else {
				new_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's hair style:", live(user), rt.gl("hair_styles_female_list")]));
			}
			if (truthy(live(new_hair_style))) {
				rt.setSv(f, "hair_style", live(new_hair_style));
			}
		} else if ($0 === "next_hair_style") {
			if (isEqual(rt.sv(f, "gender"), "male")) {
				rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/next_list_item"), null, [rt.sv(f, "hair_style"), rt.gl("hair_styles_male_list")])));
			} else {
				rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/next_list_item"), null, [rt.sv(f, "hair_style"), rt.gl("hair_styles_female_list")])));
			}
		} else if ($0 === "previous_hair_style") {
			if (isEqual(rt.sv(f, "gender"), "male")) {
				rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/previous_list_item"), null, [rt.sv(f, "hair_style"), rt.gl("hair_styles_male_list")])));
			} else {
				rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/previous_list_item"), null, [rt.sv(f, "hair_style"), rt.gl("hair_styles_female_list")])));
			}
		} else if ($0 === "facial") {
			if (truthy((new_facial = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's facial-hair colour:", live(user), null]))))) {
				rt.setSv(f, "facial_hair_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_facial)])));
			}
		} else if ($0 === "facial_hair_style") {
			new_facial_hair_style = null;
			if (isEqual(rt.sv(f, "gender"), "male")) {
				new_facial_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's facial-hair style:", live(user), rt.gl("facial_hair_styles_male_list")]));
			} else {
				new_facial_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's facial-hair style:", live(user), rt.gl("facial_hair_styles_female_list")]));
			}
			if (truthy(live(new_facial_hair_style))) {
				rt.setSv(f, "facial_hair_style", live(new_facial_hair_style));
			}
		} else if ($0 === "next_facehair_style") {
			if (isEqual(rt.sv(f, "gender"), "male")) {
				rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/next_list_item"), null, [rt.sv(f, "facial_hair_style"), rt.gl("facial_hair_styles_male_list")])));
			} else {
				rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/next_list_item"), null, [rt.sv(f, "facial_hair_style"), rt.gl("facial_hair_styles_female_list")])));
			}
		} else if ($0 === "previous_facehair_style") {
			if (isEqual(rt.sv(f, "gender"), "male")) {
				rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/previous_list_item"), null, [rt.sv(f, "facial_hair_style"), rt.gl("facial_hair_styles_male_list")])));
			} else {
				rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/previous_list_item"), null, [rt.sv(f, "facial_hair_style"), rt.gl("facial_hair_styles_female_list")])));
			}
		} else if ($0 === "underwear") {
			new_underwear = null;
			if (isEqual(rt.sv(f, "gender"), "male")) {
				new_underwear = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's underwear:", live(user), rt.gl("underwear_m")]));
			} else {
				new_underwear = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's underwear:", live(user), rt.gl("underwear_f")]));
			}
			if (truthy(live(new_underwear))) {
				rt.setSv(f, "underwear", live(new_underwear));
			}
		} else if ($0 === "undershirt") {
			new_undershirt = null;
			if (isEqual(rt.sv(f, "gender"), "male")) {
				new_undershirt = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's undershirt:", live(user), rt.gl("undershirt_m")]));
			} else {
				new_undershirt = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's undershirt:", live(user), rt.gl("undershirt_f")]));
			}
			if (truthy(live(new_undershirt))) {
				rt.setSv(f, "undershirt", live(new_undershirt));
			}
		} else if ($0 === "socks") {
			new_socks = null;
			if (truthy((new_socks = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's socks:", live(user), rt.gl("socks_list")]))))) {
				rt.setSv(f, "socks", live(new_socks));
			}
		} else if ($0 === "eyes") {
			if (truthy((new_eyes = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's eye colour:", live(user), null]))))) {
				rt.setSv(f, "eye_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_eyes)])));
			}
		} else if ($0 === "species") {
			if (truthy((result = (yield* g.op(f, "Prompt", [1], [null, "Species Selection", "Select a species", live(user), rt.gl("roundstart_species")]))))) {
				newtype = rt.index(rt.gl("roundstart_species"), live(result));
				rt.setSv(f, "pref_species", (yield* g.new_(f, live(newtype), [])));
				temp_hsv = (yield* g.call(f, P("/proc/RGBtoHSV"), null, [rt.at(rt.sv(f, "features"), "mcolor")]));
				if ((isEqual(rt.at(rt.sv(f, "features"), "mcolor"), "#000") || (!truthy((rt.isIn(f, 17, rt.fv(f, "species_traits", rt.sv(f, "pref_species"))) ? 1 : 0)) && rt.lt(rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, [live(temp_hsv)])), 3), rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, ["#7F7F7F"])), 3))))) {
					rt.setAt(rt.sv(f, "features"), "mcolor", rt.fv(f, "default_color", rt.sv(f, "pref_species")));
				}
			}
		} else if ($0 === "mutant_color") {
			if (truthy((new_mutantcolor = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's alien/mutant color:", live(user), null]))))) {
				temp_hsv_1 = (yield* g.call(f, P("/proc/RGBtoHSV"), null, [live(new_mutantcolor)]));
				if (isEqual(live(new_mutantcolor), "#000000")) {
					rt.setAt(rt.sv(f, "features"), "mcolor", rt.fv(f, "default_color", rt.sv(f, "pref_species")));
				} else {
					if ((truthy((rt.isIn(f, 17, rt.fv(f, "species_traits", rt.sv(f, "pref_species"))) ? 1 : 0)) || rt.ge(rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, [live(temp_hsv_1)])), 3), rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, ["#7F7F7F"])), 3)))) {
						rt.setAt(rt.sv(f, "features"), "mcolor", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_mutantcolor)])));
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Invalid color. Your color is not bright enough.</span>"]);
					}
				}
			}
		} else if ($0 === "tail_lizard") {
			new_tail = null;
			if (truthy((new_tail = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's tail:", live(user), rt.gl("tails_list_lizard")]))))) {
				rt.setAt(rt.sv(f, "features"), "tail_lizard", live(new_tail));
			}
		} else if ($0 === "tail_human") {
			new_tail = null;
			if (truthy((new_tail = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's tail:", live(user), rt.gl("tails_list_human")]))))) {
				rt.setAt(rt.sv(f, "features"), "tail_human", live(new_tail));
			}
		} else if ($0 === "snout") {
			new_snout = null;
			if (truthy((new_snout = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's snout:", live(user), rt.gl("snouts_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "snout", live(new_snout));
			}
		} else if ($0 === "horns") {
			new_horns = null;
			if (truthy((new_horns = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's horns:", live(user), rt.gl("horns_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "horns", live(new_horns));
			}
		} else if ($0 === "ears") {
			new_ears = null;
			if (truthy((new_ears = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's ears:", live(user), rt.gl("ears_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "ears", live(new_ears));
			}
		} else if ($0 === "wings") {
			new_wings = null;
			if (truthy((new_wings = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's wings:", live(user), rt.gl("r_wings_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "wings", live(new_wings));
			}
		} else if ($0 === "frills") {
			new_frills = null;
			if (truthy((new_frills = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's frills:", live(user), rt.gl("frills_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "frills", live(new_frills));
			}
		} else if ($0 === "spines") {
			new_spines = null;
			if (truthy((new_spines = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's spines:", live(user), rt.gl("spines_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "spines", live(new_spines));
			}
		} else if ($0 === "body_markings") {
			new_body_markings = null;
			if (truthy((new_body_markings = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's body markings:", live(user), rt.gl("body_markings_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "body_markings", live(new_body_markings));
			}
		} else if ($0 === "legs") {
			new_legs = null;
			if (truthy((new_legs = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's legs:", live(user), rt.gl("legs_list")]))))) {
				rt.setAt(rt.sv(f, "features"), "legs", live(new_legs));
			}
		} else if ($0 === "s_tone") {
			if (truthy((new_s_tone = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's skin-tone:", live(user), rt.gl("skin_tones")]))))) {
				rt.setSv(f, "skin_tone", live(new_s_tone));
			}
		} else if ($0 === "ooccolor") {
			if (truthy((new_ooccolor = (yield* g.op(f, "Prompt", [257], [null, "Game Preference", "Choose your OOC colour:", live(user), null]))))) {
				rt.setSv(f, "ooccolor", (yield* g.call(f, P("/proc/sanitize_ooccolor"), null, [live(new_ooccolor)])));
			}
		} else if ($0 === "bag") {
			if (truthy((new_backbag = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's style of bag:", live(user), rt.gl("backbaglist")]))))) {
				rt.setSv(f, "backbag", live(new_backbag));
			}
		} else if ($0 === "uplink_loc") {
			if (truthy((new_loc = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's traitor uplink spawn location:", live(user), rt.gl("uplink_spawn_loc_list")]))))) {
				rt.setSv(f, "uplink_spawn_loc", live(new_loc));
			}
		} else if ($0 === "clown_name") {
			if (truthy((new_clown_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's clown name:", live(user), null]))]))))) {
				rt.setAt(rt.sv(f, "custom_names"), "clown", live(new_clown_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "mime_name") {
			if (truthy((new_mime_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's mime name:", live(user), null]))]))))) {
				rt.setAt(rt.sv(f, "custom_names"), "mime", live(new_mime_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "ai_name") {
			if (truthy((new_ai_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's AI name:", live(user), null])), 1]))))) {
				rt.setAt(rt.sv(f, "custom_names"), "ai", live(new_ai_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, 0-9, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "cyborg_name") {
			if (truthy((new_cyborg_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's cyborg name:", live(user), null])), 1]))))) {
				rt.setAt(rt.sv(f, "custom_names"), "cyborg", live(new_cyborg_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, 0-9, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "religion_name") {
			if (truthy((new_religion_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's religion:", live(user), null]))]))))) {
				rt.setAt(rt.sv(f, "custom_names"), "religion", live(new_religion_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "deity_name") {
			if (truthy((new_deity_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's deity:", live(user), null]))]))))) {
				rt.setAt(rt.sv(f, "custom_names"), "deity", live(new_deity_name));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>Invalid name. Your name should be at least 2 and at most ＀ characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>", [42])]);
			}
		} else if ($0 === "sec_dept") {
			if (truthy((department = (yield* g.op(f, "Prompt", [1], [null, "Security Departments", "Choose your prefered security department:", live(user), rt.gl("security_depts_prefs")]))))) {
				rt.setSv(f, "prefered_security_department", live(department));
			}
		} else if ($0 === "preferred_map") {
			maplist = rt.list();
			_default = "Default";
			if (truthy(rt.fv(f, "defaultmap", rt.gl("config")))) {
				_default = rt.modify(live(_default), fmt(" (＀)", [rt.gv(f, "map_name", rt.fv(f, "defaultmap", rt.gl("config")))]), add);
			}
			M = null;
			rt.forList(f, 0, rt.fv(f, "maplist", rt.gl("config")));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(M));
				friendlyname = fmt("＀ ", [rt.fv(f, "map_name", live(VM))]);
				if (rt.le(rt.fv(f, "voteweight", live(VM)), 0)) {
					friendlyname = rt.modify(live(friendlyname), " (disabled)", add);
				}
				rt.setAt(live(maplist), live(friendlyname), rt.fv(f, "map_name", live(VM)));
			}
			rt.endFor(f, 0);
			rt.setAt(live(maplist), live(_default), null);
			if (truthy((pickedmap = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your preferred map. This will be used to help weight random map selection.", live(user), live(maplist)]))))) {
				rt.setSv(f, "preferred_map", rt.index(live(maplist), live(pickedmap)));
			}
		} else if ($0 === "clientfps") {
			version_message = null;
			if ((truthy(rt.fv(f, "client", live(user))) && rt.lt(rt.gv(f, "byond_version", rt.fv(f, "client", live(user))), 511))) {
				version_message = fmt("\nYou need to be using byond version 511 or later to take advantage of this feature, your version of ＀ is too low", [rt.gv(f, "byond_version", rt.fv(f, "client", live(user)))]);
			}
			if (rt.lt(rt.fv(f, "byond_version", rt.world()), 511)) {
				version_message = rt.modify(live(version_message), "\nThis server does not currently support client side fps. You can set now for when it does.", add);
			}
			if ((desiredfps = (yield* g.op(f, "Prompt", [33], [rt.sv(f, "clientfps"), "Character Preference", fmt("Choose your desired fps.＀\n(0 = synced with server tick rate (currently:＀))", [live(version_message), rt.fv(f, "fps", rt.world())]), live(user), null]))) !== null) {
				rt.setSv(f, "clientfps", (yield* g.call(f, P("/proc/sanitize_integer"), null, [live(desiredfps), 0, 1000, rt.sv(f, "clientfps")]))); // tg_js: modern tg's bounds (any number was kept)
				if (((rt.ge(rt.fv(f, "byond_version", rt.world()), 511) && truthy(rt.fv(f, "client", live(user)))) && rt.ge(rt.gv(f, "byond_version", rt.fv(f, "client", live(user))), 511))) {
					rt.setAt(rt.gv(f, "vars", rt.fv(f, "client", live(user))), "fps", rt.sv(f, "clientfps"));
				}
			}
		} else if ($0 === "ui") {
			if (truthy((pickedui = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your UI style.", live(user), rt.list("Midnight", "Plasmafire", "Retro", "Slimecore", "Operative", "Clockwork")]))))) {
				rt.setSv(f, "UI_style", live(pickedui));
			}
		}
	} else {
		$0 = rt.at(live(href_list), "preference");
		if ($0 === "publicity") {
			if (truthy(rt.sv(f, "unlock_content"))) {
				(rt.modSrcVar(f, "toggles", 16, rt.bitXor));
			}
		} else if ($0 === "gender") {
			if (isEqual(rt.sv(f, "gender"), "male")) {
				rt.setSv(f, "gender", "female");
			} else {
				rt.setSv(f, "gender", "male");
			}
			rt.setSv(f, "underwear", (yield* g.call(f, P("/proc/random_underwear"), null, [rt.sv(f, "gender")])));
			rt.setSv(f, "undershirt", (yield* g.call(f, P("/proc/random_undershirt"), null, [rt.sv(f, "gender")])));
			rt.setSv(f, "socks", (yield* g.call(f, P("/proc/random_socks"), null, [])));
			rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/random_facial_hair_style"), null, [rt.sv(f, "gender")])));
			rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/random_hair_style"), null, [rt.sv(f, "gender")])));
		} else if ($0 === "tgui_fancy") {
			rt.setSv(f, "tgui_fancy", (!truthy(rt.sv(f, "tgui_fancy")) ? 1 : 0));
		} else if ($0 === "tgui_lock") {
			rt.setSv(f, "tgui_lock", (!truthy(rt.sv(f, "tgui_lock")) ? 1 : 0));
		} else if ($0 === "winflash") {
			rt.setSv(f, "windowflashing", (!truthy(rt.sv(f, "windowflashing")) ? 1 : 0));
		} else if ($0 === "hear_adminhelps") {
			(rt.modSrcVar(f, "toggles", 1, rt.bitXor));
		} else if ($0 === "announce_login") {
			(rt.modSrcVar(f, "toggles", 1024, rt.bitXor));
		} else if ($0 === "be_special") {
			be_special_type = rt.at(live(href_list), "be_special_type");
			// tg_js: only tg's roles (the menu's list): any text was added, so the saved list grew without end
			if (!truthy((rt.isIn(f, live(be_special_type), rt.gl("special_roles")) ? 1 : 0))) {
			} else if (truthy((rt.isIn(f, live(be_special_type), rt.sv(f, "be_special")) ? 1 : 0))) {
				(rt.modSrcVar(f, "be_special", live(be_special_type), subtract));
			} else {
				rt.modSrcVar(f, "be_special", live(be_special_type), add);
			}
		} else if ($0 === "name") {
			rt.setSv(f, "be_random_name", (!truthy(rt.sv(f, "be_random_name")) ? 1 : 0));
		} else if ($0 === "all") {
			rt.setSv(f, "be_random_body", (!truthy(rt.sv(f, "be_random_body")) ? 1 : 0));
		} else if ($0 === "hear_midis") {
			(rt.modSrcVar(f, "toggles", 2, rt.bitXor));
		} else if ($0 === "lobby_music") {
			(rt.modSrcVar(f, "toggles", 8, rt.bitXor));
			if ((truthy(rt.bitAnd(rt.sv(f, "toggles"), 8)) && truthy(rt.fv(f, "client", live(user))))) {
				yield* g.callName(f, rt.fv(f, "client", live(user)), "playtitlemusic", []);
			} else {
				yield* g.callName(f, live(user), "stop_sound_channel", [1024]);
			}
		} else if ($0 === "ghost_ears") {
			(rt.modSrcVar(f, "chat_toggles", 4, rt.bitXor));
		} else if ($0 === "ghost_sight") {
			(rt.modSrcVar(f, "chat_toggles", 8, rt.bitXor));
		} else if ($0 === "ghost_whispers") {
			(rt.modSrcVar(f, "chat_toggles", 128, rt.bitXor));
		} else if ($0 === "ghost_radio") {
			(rt.modSrcVar(f, "chat_toggles", 512, rt.bitXor));
		} else if ($0 === "ghost_pda") {
			(rt.modSrcVar(f, "chat_toggles", 256, rt.bitXor));
		} else if ($0 === "allow_midround_antag") {
			(rt.modSrcVar(f, "toggles", 64, rt.bitXor));
		} else if ($0 === "parallaxup") {
			rt.setSv(f, "parallax", (yield* g.call(f, P("/proc/Wrap"), null, [add(rt.sv(f, "parallax"), 1), -1, 4])));
			if (((truthy(rt.sv(f, "parent")) && truthy(rt.fv(f, "mob", rt.sv(f, "parent")))) && truthy(rt.gv(f, "hud_used", rt.fv(f, "mob", rt.sv(f, "parent")))))) {
				yield* g.callName(f, rt.gv(f, "hud_used", rt.fv(f, "mob", rt.sv(f, "parent"))), "update_parallax_pref", [rt.fv(f, "mob", rt.sv(f, "parent"))]);
			}
		} else if ($0 === "parallaxdown") {
			rt.setSv(f, "parallax", (yield* g.call(f, P("/proc/Wrap"), null, [subtract(rt.sv(f, "parallax"), 1), -1, 4])));
			if (((truthy(rt.sv(f, "parent")) && truthy(rt.fv(f, "mob", rt.sv(f, "parent")))) && truthy(rt.gv(f, "hud_used", rt.fv(f, "mob", rt.sv(f, "parent")))))) {
				yield* g.callName(f, rt.gv(f, "hud_used", rt.fv(f, "mob", rt.sv(f, "parent"))), "update_parallax_pref", [rt.fv(f, "mob", rt.sv(f, "parent"))]);
			}
		} else if ($0 === "save") {
			yield* g.srcCall(f, "save_preferences");
			yield* g.srcCall(f, "save_character");
		} else if ($0 === "load") {
			yield* g.srcCall(f, "load_preferences");
			yield* g.srcCall(f, "load_character");
		} else if ($0 === "changeslot") {
			if (!truthy((yield* g.srcCall(f, "load_character", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "num")])))))) {
				yield* g.srcCall(f, "random_character");
				rt.setSv(f, "real_name", (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.sv(f, "gender")])));
				yield* g.srcCall(f, "save_character");
			}
		} else if ($0 === "tab") {
			// tg_js: the two tabs there are (tab=2 or 0.5 showed an empty window)
			const tab = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "tab")]));
			if (tab === 0 || tab === 1) {
				rt.setSv(f, "current_tab", tab);
			}
		}
	}
	yield* g.srcCall(f, "ShowChoices", live(user));
	return 1;
}, true);

// /datum/preferences/proc/copy_to  (code/modules/client/preferences.dm:1248)  may sleep
rt.def("/datum/preferences/proc/copy_to", function* copy_to(f: Frame, character: Value, icon_updates: Value) {
	let firstspace: Value = null, name_length: Value = null, organ_eyes: Value = null, chosen_species: Value = null;
	f.vars = () => [character, icon_updates, firstspace, name_length, organ_eyes, chosen_species];
	if (live(icon_updates) === null) {
		icon_updates = 1;
	}
	if (truthy(rt.sv(f, "be_random_name"))) {
		rt.setSv(f, "real_name", (yield* g.callName(f, rt.sv(f, "pref_species"), "random_name", [rt.sv(f, "gender")])));
	}
	if (truthy(rt.sv(f, "be_random_body"))) {
		yield* g.srcCall(f, "random_character", rt.sv(f, "gender"));
	}
	if (truthy(rt.fv(f, "humans_need_surnames", rt.gl("config")))) {
		firstspace = (yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "real_name"), " "]));
		name_length = rt.length(rt.sv(f, "real_name"));
		if (!truthy(live(firstspace))) {
			rt.modSrcVar(f, "real_name", fmt(" ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]), add);
		} else {
			if (isEqual(live(firstspace), live(name_length))) {
				rt.modSrcVar(f, "real_name", fmt("＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]), add);
			}
		}
	}
	rt.setFv(f, "real_name", live(character), rt.sv(f, "real_name"));
	rt.setFv(f, "name", live(character), rt.fv(f, "real_name", live(character)));
	rt.setFv(f, "gender", live(character), rt.sv(f, "gender"));
	rt.setFv(f, "age", live(character), rt.sv(f, "age"));
	rt.setFv(f, "eye_color", live(character), rt.sv(f, "eye_color"));
	if (truthy((organ_eyes = (yield* g.callName(f, live(character), "getorgan", [T("/obj/item/organ/eyes")]))))) {
		if (!truthy(rt.initial(f, live(organ_eyes), "eye_color"))) {
			rt.setFv(f, "eye_color", live(organ_eyes), rt.sv(f, "eye_color"));
		}
		rt.setFv(f, "old_eye_color", live(organ_eyes), rt.sv(f, "eye_color"));
	}
	rt.setFv(f, "hair_color", live(character), rt.sv(f, "hair_color"));
	rt.setFv(f, "facial_hair_color", live(character), rt.sv(f, "facial_hair_color"));
	rt.setFv(f, "skin_tone", live(character), rt.sv(f, "skin_tone"));
	rt.setFv(f, "hair_style", live(character), rt.sv(f, "hair_style"));
	rt.setFv(f, "facial_hair_style", live(character), rt.sv(f, "facial_hair_style"));
	rt.setFv(f, "underwear", live(character), rt.sv(f, "underwear"));
	rt.setFv(f, "undershirt", live(character), rt.sv(f, "undershirt"));
	rt.setFv(f, "socks", live(character), rt.sv(f, "socks"));
	rt.setFv(f, "backbag", live(character), rt.sv(f, "backbag"));
	rt.setFv(f, "features", rt.fv(f, "dna", live(character)), (yield* g.callName(f, rt.sv(f, "features"), "Copy", [])));
	rt.setFv(f, "real_name", rt.fv(f, "dna", live(character)), rt.fv(f, "real_name", live(character)));
	chosen_species = null;
	if ((!isEqual(rt.sv(f, "pref_species"), T("/datum/species/human")) && truthy(rt.fv(f, "mutant_races", rt.gl("config"))))) {
		chosen_species = rt.fv(f, "type", rt.sv(f, "pref_species"));
	} else {
		chosen_species = T("/datum/species/human");
	}
	yield* g.callName(f, live(character), "set_species", [null, live(chosen_species), "icon_update", 0], rt.Args.Named);
	if (!truthy(live(icon_updates))) return f.dot;
	yield* g.callName(f, live(character), "update_body", []);
	yield* g.callName(f, live(character), "update_hair", []);
	yield* g.callName(f, live(character), "update_body_parts", []);
	return f.dot;
}, true);
