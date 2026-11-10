// Based on /tg/station's code/modules/client/preferences.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// preferences.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalpreferences_datums", function InitGlobalpreferences_datums(f: Frame) {
	GLOB.preferences_datums = list();
	this.gvars_datum_init_order += "preferences_datums";
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

// preferences.dm:26
rt.def("/datum/preferences/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.be_special = list();
	this.features = rt.alist(f, ["mcolor", "FFF", "tail_lizard", "Smooth", "tail_human", "None", "snout", "Round", "horns", "None", "ears", "None", "wings", "None", "frills", "None", "spines", "None", "body_markings", "None", "legs", "Normal Legs"]);
	this.custom_names = list("clown", "mime", "ai", "cyborg", "religion", "deity");

	this.ignoring = list();

	this.pref_species = new_(T("/datum/species/human"));
	return f.dot;
});

// preferences.dm:114
rt.def("/datum/preferences/proc/New", function* New(f: Frame, C: Value) {
	let loaded_preferences_successfully: Value = null;
	this.parent = C;
	rt.setAt(this.custom_names, "ai", pick(GLOB.ai_names));
	rt.setAt(this.custom_names, "cyborg", pick(GLOB.ai_names));
	rt.setAt(this.custom_names, "clown", pick(GLOB.clown_names));
	rt.setAt(this.custom_names, "mime", pick(GLOB.mime_names));
	if (rt.istype(C, T("/client"))) {
		if (!IsGuestKey(C.key)) {
			this.load_path(C.ckey);
			this.unlock_content = C.IsByondMember();
			if (this.unlock_content) {
				this.max_save_slots = 8;
			}
		}
	}
	if (loaded_preferences_successfully = this.load_preferences()) {
		if (yield* this.load_character()) {
			return f.dot;
		}
	}
	yield* this.random_character();
	this.real_name = this.pref_species.random_name(this.gender, 1);
	if (!loaded_preferences_successfully) {
		this.save_preferences();
	}
	this.save_character();
	this.menuoptions = list();
	return f.dot;
}, true);

// preferences.dm:140
rt.def("/datum/preferences/proc/ShowChoices", function* ShowChoices(f: Frame, user: Value) {
	let S: Value = null, name: Value = null, i: Value = null, button_name: Value = null, p_map: Value = null, VM: Value = null, i_2: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (!user || !user.client) {
		return f.dot;
	}
	yield* this.update_preview_icon();
	rt.op(f, "BrowseResource", [], [user, this.preview_icon, "previewicon.png"], false);
	let dat: Value = "<center>";
	if (this.current_tab == 0) {
		$0 = "class='linkOn'";
	} else {
		$0 = "";
	}
	dat += `<a href='?_src_=prefs;preference=tab;tab=0' ${$0}>Character Settings</a> `;
	if (this.current_tab == 1) {
		$0 = "class='linkOn'";
	} else {
		$0 = "";
	}
	dat += `<a href='?_src_=prefs;preference=tab;tab=1' ${$0}>Game Preferences</a>`;
	if (!this.path) {
		dat += "<div class='notice'>Please create an account to save your preferences</div>";
	}
	dat += "</center>";
	dat += "<HR>";
	$0 = this.current_tab;
	if ($0 === 0) {
		if (this.path) {
			if (S = (yield* new_(T("/savefile"), this.path))) {
				dat += "<center>";
				i = 1;
				while (i <= this.max_save_slots) {
					S.cd = `/character${i}`;
					name = rt.input(f, rt.R.index, null, [S, "real_name"]);
					if (!name) {
						name = `Character${i}`;
					}
					$0 = i;
					if (i == this.default_slot) {
						$1 = "class='linkOn'";
					} else {
						$1 = "";
					}
					dat += `<a style='white-space:nowrap;' href='?_src_=prefs;preference=changeslot;num=${$0};' ${$1}>${name}</a> `;
					i++;
				}
				dat += "</center>";
			}
		}
		dat += "<center><h2>Occupation Choices</h2>";
		dat += "<a href='?_src_=prefs;preference=job;task=menu'>Set Occupation Preferences</a><br></center>";
		dat += "<h2>Identity</h2>";
		dat += "<table width='100%'><tr><td width='75%' valign='top'>";
		if (jobban_isbanned(user, "appearance")) {
			dat += "<b>You are banned from using custom names and appearances. You can continue to adjust your characters, but you will be randomised once you join the game.</b><br>";
		}
		dat += "<a href='?_src_=prefs;preference=name;task=random'>Random Name</A> ";
		if (this.be_random_name) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<a href='?_src_=prefs;preference=name'>Always Random Name: ${$0}</a><BR>`;
		dat += "<b>Name:</b> ";
		dat += `<a href='?_src_=prefs;preference=name;task=input'>${this.real_name}</a><BR>`;
		if (this.gender == "male") {
			$0 = "Male";
		} else {
			$0 = "Female";
		}
		dat += `<b>Gender:</b> <a href='?_src_=prefs;preference=gender'>${$0}</a><BR>`;
		dat += `<b>Age:</b> <a href='?_src_=prefs;preference=age;task=input'>${this.age}</a><BR>`;
		dat += "<b>Special Names:</b><BR>";
		dat += `<a href ='?_src_=prefs;preference=clown_name;task=input'><b>Clown:</b> ${rt.at(this.custom_names, "clown")}</a> `;
		dat += `<a href ='?_src_=prefs;preference=mime_name;task=input'><b>Mime:</b>${rt.at(this.custom_names, "mime")}</a><BR>`;
		dat += `<a href ='?_src_=prefs;preference=ai_name;task=input'><b>AI:</b> ${rt.at(this.custom_names, "ai")}</a> `;
		dat += `<a href ='?_src_=prefs;preference=cyborg_name;task=input'><b>Cyborg:</b> ${rt.at(this.custom_names, "cyborg")}</a><BR>`;
		dat += `<a href ='?_src_=prefs;preference=religion_name;task=input'><b>Chaplain religion:</b> ${rt.at(this.custom_names, "religion")} </a>`;
		dat += `<a href ='?_src_=prefs;preference=deity_name;task=input'><b>Chaplain deity:</b> ${rt.at(this.custom_names, "deity")}</a><BR>`;
		dat += "<b>Custom job preferences:</b><BR>";
		dat += `<a href='?_src_=prefs;preference=sec_dept;task=input'><b>Prefered security department:</b> ${this.prefered_security_department}</a><BR></td>`;
		dat += "<td valign='center'>";
		dat += `<div class='statusDisplay'><center><img src=previewicon.png width=${this.preview_icon.Width()} height=${this.preview_icon.Height()}></center></div>`;
		dat += "</td></tr></table>";
		dat += "<h2>Body</h2>";
		dat += "<a href='?_src_=prefs;preference=all;task=random'>Random Body</A> ";
		if (this.be_random_body) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<a href='?_src_=prefs;preference=all'>Always Random Body: ${$0}</A><br>`;
		dat += "<table width='100%'><tr><td width='24%' valign='top'>";
		if (GLOB.config.mutant_races) {
			dat += `<b>Species:</b><BR><a href='?_src_=prefs;preference=species;task=input'>${this.pref_species.name}</a><BR>`;
		} else {
			dat += "<b>Species:</b> Human<BR>";
		}
		dat += `<b>Underwear:</b><BR><a href ='?_src_=prefs;preference=underwear;task=input'>${this.underwear}</a><BR>`;
		dat += `<b>Undershirt:</b><BR><a href ='?_src_=prefs;preference=undershirt;task=input'>${this.undershirt}</a><BR>`;
		dat += `<b>Socks:</b><BR><a href ='?_src_=prefs;preference=socks;task=input'>${this.socks}</a><BR>`;
		dat += `<b>Backpack:</b><BR><a href ='?_src_=prefs;preference=bag;task=input'>${this.backbag}</a><BR>`;
		dat += `<b>Uplink Spawn Location:</b><BR><a href ='?_src_=prefs;preference=uplink_loc;task=input'>${this.uplink_spawn_loc}</a><BR></td>`;
		if (this.pref_species.use_skintones) {
			dat += "<td valign='top' width='21%'>";
			dat += "<h3>Skin Tone</h3>";
			dat += `<a href='?_src_=prefs;preference=s_tone;task=input'>${this.skin_tone}</a><BR>`;
			dat += "</td>";
		}
		if (rt.isIn(f, 2, this.pref_species.species_traits)) {
			dat += "<td valign='top' width='21%'>";
			dat += "<h3>Hair Style</h3>";
			dat += `<a href='?_src_=prefs;preference=hair_style;task=input'>${this.hair_style}</a><BR>`;
			dat += "<a href='?_src_=prefs;preference=previous_hair_style;task=input'>&lt;</a> <a href='?_src_=prefs;preference=next_hair_style;task=input'>&gt;</a><BR>";
			dat += `<span style='border:1px solid #161616; background-color: #${this.hair_color};'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=hair;task=input'>Change</a><BR>`;
			dat += "</td><td valign='top' width='21%'>";
			dat += "<h3>Facial Hair Style</h3>";
			dat += `<a href='?_src_=prefs;preference=facial_hair_style;task=input'>${this.facial_hair_style}</a><BR>`;
			dat += "<a href='?_src_=prefs;preference=previous_facehair_style;task=input'>&lt;</a> <a href='?_src_=prefs;preference=next_facehair_style;task=input'>&gt;</a><BR>";
			dat += `<span style='border: 1px solid #161616; background-color: #${this.facial_hair_color};'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=facial;task=input'>Change</a><BR>`;
			dat += "</td>";
		}
		if (rt.isIn(f, 4, this.pref_species.species_traits)) {
			dat += "<td valign='top' width='21%'>";
			dat += "<h3>Eye Color</h3>";
			dat += `<span style='border: 1px solid #161616; background-color: #${this.eye_color};'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=eyes;task=input'>Change</a><BR>`;
			dat += "</td>";
		}
		if (GLOB.config.mutant_races) {
			if (rt.isIn(f, 1, this.pref_species.species_traits) || rt.isIn(f, 17, this.pref_species.species_traits)) {
				dat += "<td valign='top' width='14%'>";
				dat += "<h3>Mutant Color</h3>";
				dat += `<span style='border: 1px solid #161616; background-color: #${rt.at(this.features, "mcolor")};'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=mutant_color;task=input'>Change</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "tail_lizard", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Tail</h3>";
				dat += `<a href='?_src_=prefs;preference=tail_lizard;task=input'>${rt.at(this.features, "tail_lizard")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "snout", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Snout</h3>";
				dat += `<a href='?_src_=prefs;preference=snout;task=input'>${rt.at(this.features, "snout")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "horns", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Horns</h3>";
				dat += `<a href='?_src_=prefs;preference=horns;task=input'>${rt.at(this.features, "horns")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "frills", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Frills</h3>";
				dat += `<a href='?_src_=prefs;preference=frills;task=input'>${rt.at(this.features, "frills")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "spines", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Spines</h3>";
				dat += `<a href='?_src_=prefs;preference=spines;task=input'>${rt.at(this.features, "spines")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "body_markings", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Body Markings</h3>";
				dat += `<a href='?_src_=prefs;preference=body_markings;task=input'>${rt.at(this.features, "body_markings")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "legs", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Legs</h3>";
				dat += `<a href='?_src_=prefs;preference=legs;task=input'>${rt.at(this.features, "legs")}</a><BR>`;
				dat += "</td>";
			}
		}
		if (GLOB.config.mutant_humans) {
			if (rt.isIn(f, "tail_human", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Tail</h3>";
				dat += `<a href='?_src_=prefs;preference=tail_human;task=input'>${rt.at(this.features, "tail_human")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "ears", this.pref_species.mutant_bodyparts)) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Ears</h3>";
				dat += `<a href='?_src_=prefs;preference=ears;task=input'>${rt.at(this.features, "ears")}</a><BR>`;
				dat += "</td>";
			}
			if (rt.isIn(f, "wings", (this.pref_species.mutant_bodyparts && (rt.len(f, GLOB.r_wings_list) > 1 ? 1 : 0)))) {
				dat += "<td valign='top' width='7%'>";
				dat += "<h3>Wings</h3>";
				dat += `<a href='?_src_=prefs;preference=wings;task=input'>${rt.at(this.features, "wings")}</a><BR>`;
				dat += "</td>";
			}
		}
		dat += "</tr></table>";
	} else if ($0 === 1) {
		dat += "<table><tr><td width='340px' height='300px' valign='top'>";
		dat += "<h2>General Settings</h2>";
		dat += `<b>UI Style:</b> <a href='?_src_=prefs;task=input;preference=ui'>${this.UI_style}</a><br>`;
		if (this.tgui_fancy) {
			$0 = "Fancy";
		} else {
			$0 = "No Frills";
		}
		dat += `<b>tgui Style:</b> <a href='?_src_=prefs;preference=tgui_fancy'>${$0}</a><br>`;
		if (this.tgui_lock) {
			$0 = "Primary";
		} else {
			$0 = "All";
		}
		dat += `<b>tgui Monitors:</b> <a href='?_src_=prefs;preference=tgui_lock'>${$0}</a><br>`;
		if (this.windowflashing) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<b>Window Flashing:</b> <a href='?_src_=prefs;preference=winflash'>${$0}</a><br>`;
		if (rt.bitAnd(this.toggles, 2)) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<b>Play admin midis:</b> <a href='?_src_=prefs;preference=hear_midis'>${$0}</a><br>`;
		if (rt.bitAnd(this.toggles, 8)) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<b>Play lobby music:</b> <a href='?_src_=prefs;preference=lobby_music'>${$0}</a><br>`;
		if (rt.bitAnd(this.chat_toggles, 4)) {
			$0 = "All Speech";
		} else {
			$0 = "Nearest Creatures";
		}
		dat += `<b>Ghost ears:</b> <a href='?_src_=prefs;preference=ghost_ears'>${$0}</a><br>`;
		if (rt.bitAnd(this.chat_toggles, 8)) {
			$0 = "All Emotes";
		} else {
			$0 = "Nearest Creatures";
		}
		dat += `<b>Ghost sight:</b> <a href='?_src_=prefs;preference=ghost_sight'>${$0}</a><br>`;
		if (rt.bitAnd(this.chat_toggles, 128)) {
			$0 = "All Speech";
		} else {
			$0 = "Nearest Creatures";
		}
		dat += `<b>Ghost whispers:</b> <a href='?_src_=prefs;preference=ghost_whispers'>${$0}</a><br>`;
		if (rt.bitAnd(this.chat_toggles, 512)) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<b>Ghost radio:</b> <a href='?_src_=prefs;preference=ghost_radio'>${$0}</a><br>`;
		if (rt.bitAnd(this.chat_toggles, 256)) {
			$0 = "All Messages";
		} else {
			$0 = "Nearest Creatures";
		}
		dat += `<b>Ghost pda:</b> <a href='?_src_=prefs;preference=ghost_pda'>${$0}</a><br>`;
		if (rt.bitAnd(this.toggles, 64)) {
			$0 = "Yes";
		} else {
			$0 = "No";
		}
		dat += `<b>Midround Antagonist:</b> <a href='?_src_=prefs;preference=allow_midround_antag'>${$0}</a><br>`;
		if (GLOB.config.allow_Metadata) {
			dat += "<b>OOC Notes:</b> <a href='?_src_=prefs;preference=metadata;task=input'>Edit </a><br>";
		}
		if (user.client) {
			if (user.client.holder) {
				if (rt.bitAnd(this.toggles, 1)) {
					$0 = "On";
				} else {
					$0 = "Off";
				}
				dat += `<b>Adminhelp Sound:</b> <a href='?_src_=prefs;preference=hear_adminhelps'>${$0}</a><br>`;
				if (rt.bitAnd(this.toggles, 1024)) {
					$0 = "On";
				} else {
					$0 = "Off";
				}
				dat += `<b>Announce Login:</b> <a href='?_src_=prefs;preference=announce_login'>${$0}</a><br>`;
			}
			if (this.unlock_content || check_rights_for(user.client, 2)) {
				if (this.ooccolor) {
					$0 = this.ooccolor;
				} else {
					$0 = GLOB.normal_ooc_colour;
				}
				dat += `<b>OOC:</b> <span style='border: 1px solid #161616; background-color: ${$0};'>&nbsp;&nbsp;&nbsp;</span> <a href='?_src_=prefs;preference=ooccolor;task=input'>Change</a><br>`;
			}
			if (this.unlock_content) {
				if (rt.bitAnd(this.toggles, 16)) {
					$0 = "Public";
				} else {
					$0 = "Hidden";
				}
				dat += `<b>BYOND Membership Publicity:</b> <a href='?_src_=prefs;preference=publicity'>${$0}</a><br>`;
				dat += `<b>Ghost Form:</b> <a href='?_src_=prefs;task=input;preference=ghostform'>${this.ghost_form}</a><br>`;
				dat += `<B>Ghost Orbit: </B> <a href='?_src_=prefs;task=input;preference=ghostorbit'>${this.ghost_orbit}</a><br>`;
			}
		}
		button_name = "If you see this something went wrong.";
		if (this.ghost_accs === 100) {
			button_name = "full accessories";
		} else if (this.ghost_accs === 50) {
			button_name = "only directional sprites";
		} else if (this.ghost_accs === 1) {
			button_name = "default sprites";
		}
		dat += `<b>Ghost Accessories:</b> <a href='?_src_=prefs;task=input;preference=ghostaccs'>${button_name}</a><br>`;
		if (this.ghost_others === 100) {
			button_name = "their setting";
		} else if (this.ghost_others === 50) {
			button_name = "default sprites";
		} else if (this.ghost_others === 1) {
			button_name = "white ghost";
		}
		dat += `<b>Ghosts of Others:</b> <a href='?_src_=prefs;task=input;preference=ghostothers'>${button_name}</a><br>`;
		if (GLOB.config.maprotation) {
			if (!(p_map = this.preferred_map)) {
				p_map = "Default";
				if (GLOB.config.defaultmap) {
					p_map += ` (${GLOB.config.defaultmap.map_name})`;
				}
			} else if (rt.isIn(f, p_map, GLOB.config.maplist)) {
				if (!(VM = rt.index(GLOB.config.maplist, p_map))) {
					p_map += " (No longer exists)";
				} else {
					p_map = VM.map_name;
				}
			} else {
				p_map += " (No longer exists)";
			}
			if (GLOB.config.allow_map_voting) {
				dat += `<b>Preferred Map:</b> <a href='?_src_=prefs;preference=preferred_map;task=input'>${p_map}</a><br>`;
			}
		}
		dat += `<b>FPS:</b> <a href='?_src_=prefs;preference=clientfps;task=input'>${this.clientfps}</a><br>`;
		dat += "<b>Parallax (Fancy Space):</b> <a href='?_src_=prefs;preference=parallaxdown' oncontextmenu='window.location.href=\"?_src_=prefs;preference=parallaxup\";return false;'>";
		if (this.parallax === 2) {
			dat += "Low";
		} else if (this.parallax === 1) {
			dat += "Medium";
		} else if (this.parallax === -1) {
			dat += "Insane";
		} else if (this.parallax === 3) {
			dat += "Disabled";
		} else {
			dat += "High";
		}
		dat += "</a><br>";
		dat += "</td><td width='300px' height='300px' valign='top'>";
		dat += "<h2>Special Role Settings</h2>";
		if (jobban_isbanned(user, "Syndicate")) {
			dat += "<font color=red><b>You are banned from antagonist roles.</b></font>";
			this.be_special = list();
		}
		for (i_2 of each(GLOB.special_roles)) {
			if (jobban_isbanned(user, i_2)) {
				dat += `<b>Be ${capitalize(i_2)}:</b> BANNED<br>`;
			} else {
				$0 = capitalize(i_2);
				$1 = i_2;
				if (rt.isIn(f, i_2, this.be_special)) {
					$2 = "Yes";
				} else {
					$2 = "No";
				}
				dat += `<b>Be ${$0}:</b> <a href='?_src_=prefs;preference=be_special;be_special_type=${$1}'>${$2}</a><br>`;
			}
		}
		dat += "</td></tr></table>";
	}
	dat += "<hr><center>";
	if (!IsGuestKey(user.key)) {
		dat += "<a href='?_src_=prefs;preference=load'>Undo</a> ";
		dat += "<a href='?_src_=prefs;preference=save'>Save Setup</a> ";
	}
	dat += "<a href='?_src_=prefs;preference=reset_all'>Reset Setup</a>";
	dat += "</center>";
	(popup = (yield* new_(T("/datum/browser"), user, "preferences", "<div align='center'>Character Setup</div>", 640, 770))).set_content(dat);
	yield* popup.open(0);
	return f.dot;
}, true);

// preferences.dm:494
rt.def("/datum/preferences/proc/SetChoices", function* SetChoices(f: Frame, user: Value, limit: Value, splitJobs: Value, widthPerColumn: Value, height: Value) {
	let index: Value = null, lastJob: Value = null, job: Value = null, i: Value = null, rank: Value = null, prefLevelLabel: Value = null, prefLevelColor: Value = null, prefUpperLevel: Value = null, prefLowerLevel: Value = null, i_4: Value = null, message: Value = null, popup: Value = null;
	limit ??= 17;
	splitJobs ??= list("Chief Engineer");
	widthPerColumn ??= 295;
	height ??= 620;
	if (!GLOB.SSjob) {
		return f.dot;
	}
	let width: Value = widthPerColumn;
	let HTML: Value = "<center>";
	if (rt.len(f, GLOB.SSjob.occupations) <= 0) {
		HTML += "The job SSticker is not yet finished creating jobs, please try again later";
		HTML += "<center><a href='?_src_=prefs;preference=job;task=close'>Done</a></center><br>";
	} else {
		HTML += "<b>Choose occupation chances</b><br>";
		HTML += "<div align='center'>Left-click to raise an occupation preference, right-click to lower it.<br></div>";
		HTML += "<center><a href='?_src_=prefs;preference=job;task=close'>Done</a></center><br>";
		HTML += "<script type='text/javascript'>function setJobPrefRedirect(level, rank) { window.location.href='?_src_=prefs;preference=job;task=setJobLevel;level=' + level + ';text=' + encodeURIComponent(rank); return false; }</script>";
		HTML += "<table width='100%' cellpadding='1' cellspacing='0'><tr><td width='20%'>";
		HTML += "<table width='100%' cellpadding='1' cellspacing='0'>";
		index = -1;
		for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if ((index += 1) >= limit || rt.isIn(f, job.title, splitJobs)) {
				width += widthPerColumn;
				if (index < limit && lastJob !== null) {
					i = 0;
					while (i < limit - index) {
						HTML += `<tr bgcolor='${lastJob.selection_color}'><td width='60%' align='right'>&nbsp</td><td>&nbsp</td></tr>`;
						i += 1;
					}
				}
				HTML += "</table></td><td width='20%'><table width='100%' cellpadding='1' cellspacing='0'>";
				index = 0;
			}
			HTML += `<tr bgcolor='${job.selection_color}'><td width='60%' align='right'>`;
			rank = job.title;
			lastJob = job;
			if (jobban_isbanned(user, rank)) {
				HTML += `<font color=red>${rank}</font></td><td> BANNED</td></tr>`;
				continue;
			}
			if (rt.bitAnd(this.job_civilian_low, 8192) && rank != "Assistant" && !jobban_isbanned(user, "Assistant")) {
				HTML += `<font color=orange>${rank}</font></td><td></td></tr>`;
				continue;
			}
			if (GLOB.config.enforce_human_authority && !user.client.prefs.pref_species.qualifies_for_rank(rank, user.client.prefs.features)) {
				if (user.client.prefs.pref_species.id == "human") {
					HTML += `<font color=red>${rank}</font></td><td><font color=red><b> [MUTANT]</b></font></td></tr>`;
				} else {
					HTML += `<font color=red>${rank}</font></td><td><font color=red><b> [NON-HUMAN]</b></font></td></tr>`;
				}
				continue;
			}
			if (rt.isIn(f, rank, GLOB.command_positions) || rank == "AI") {
				HTML += `<b><span class='dark'>${rank}</span></b>`;
			} else {
				HTML += `<span class='dark'>${rank}</span>`;
			}
			HTML += "</td><td width='40%'>";
			prefLevelLabel = "ERROR";
			prefLevelColor = "pink";
			prefUpperLevel = -1;
			prefLowerLevel = -1;
			if (rt.bitAnd(this.GetJobDepartment(job, 1), job.flag)) {
				prefLevelLabel = "High";
				prefLevelColor = "slateblue";
				prefUpperLevel = 4;
				prefLowerLevel = 2;
			} else if (rt.bitAnd(this.GetJobDepartment(job, 2), job.flag)) {
				prefLevelLabel = "Medium";
				prefLevelColor = "green";
				prefUpperLevel = 1;
				prefLowerLevel = 3;
			} else if (rt.bitAnd(this.GetJobDepartment(job, 3), job.flag)) {
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
			HTML += `<a class='white' href='?_src_=prefs;preference=job;task=setJobLevel;level=${prefUpperLevel};text=${rank}' oncontextmenu='javascript:return setJobPrefRedirect(${prefLowerLevel}, "${rank}");'>`;
			if (rank == "Assistant") {
				if (rt.bitAnd(this.job_civilian_low, 8192)) {
					HTML += "<font color=green>Yes</font>";
				} else {
					HTML += "<font color=red>No</font>";
				}
				HTML += "</a></td></tr>";
				continue;
			}
			HTML += `<font color=${prefLevelColor}>${prefLevelLabel}</font>`;
			HTML += "</a></td></tr>";
		}
		i_4 = 1;
		while (i_4 < limit - index) {
			HTML += `<tr bgcolor='${lastJob.selection_color}'><td width='60%' align='right'>&nbsp</td><td>&nbsp</td></tr>`;
			i_4 += 1;
		}
		HTML += "</td'></tr></table>";
		HTML += "</center></table>";
		message = "Be an Assistant if preferences unavailable";
		if (this.joblessrole == 2) {
			message = "Get random job if preferences unavailable";
		} else if (this.joblessrole == 3) {
			message = "Return to lobby if preferences unavailable";
		}
		HTML += `<center><br><a href='?_src_=prefs;preference=job;task=random'>${message}</a></center>`;
		HTML += "<center><a href='?_src_=prefs;preference=job;task=reset'>Reset Preferences</a></center>";
	}
	rt.op(f, "Browse", [], [user, null, "window=preferences"], false);
	(popup = (yield* new_(T("/datum/browser"), user, "mob_occupation", "<div align='center'>Occupation Preferences</div>", width, height))).set_window_options("can_close=0");
	popup.set_content(HTML);
	yield* popup.open(0);
	return f.dot;
}, true);

// preferences.dm:622
rt.def("/datum/preferences/proc/SetJobPreferenceLevel", function SetJobPreferenceLevel(f: Frame, job: Value, level: Value) {
	if (!job) {
		return 0;
	}
	if (level == 1) {
		(rt.modSrcVar(f, "job_civilian_med", this.job_civilian_high, rt.bitOr));
		(rt.modSrcVar(f, "job_engsec_med", this.job_engsec_high, rt.bitOr));
		(rt.modSrcVar(f, "job_medsci_med", this.job_medsci_high, rt.bitOr));
		this.job_civilian_high = 0;
		this.job_engsec_high = 0;
		this.job_medsci_high = 0;
	}
	if (job.department_flag == 4) {
		(rt.modSrcVar(f, "job_civilian_low", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		(rt.modSrcVar(f, "job_civilian_med", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		(rt.modSrcVar(f, "job_civilian_high", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		if (level === 1) {
			(rt.modSrcVar(f, "job_civilian_high", job.flag, rt.bitOr));
		} else if (level === 2) {
			(rt.modSrcVar(f, "job_civilian_med", job.flag, rt.bitOr));
		} else if (level === 3) {
			(rt.modSrcVar(f, "job_civilian_low", job.flag, rt.bitOr));
		}
		return 1;
	} else if (job.department_flag == 1) {
		(rt.modSrcVar(f, "job_engsec_low", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		(rt.modSrcVar(f, "job_engsec_med", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		(rt.modSrcVar(f, "job_engsec_high", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		if (level === 1) {
			(rt.modSrcVar(f, "job_engsec_high", job.flag, rt.bitOr));
		} else if (level === 2) {
			(rt.modSrcVar(f, "job_engsec_med", job.flag, rt.bitOr));
		} else if (level === 3) {
			(rt.modSrcVar(f, "job_engsec_low", job.flag, rt.bitOr));
		}
		return 1;
	} else if (job.department_flag == 2) {
		(rt.modSrcVar(f, "job_medsci_low", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		(rt.modSrcVar(f, "job_medsci_med", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		(rt.modSrcVar(f, "job_medsci_high", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		if (level === 1) {
			(rt.modSrcVar(f, "job_medsci_high", job.flag, rt.bitOr));
		} else if (level === 2) {
			(rt.modSrcVar(f, "job_medsci_med", job.flag, rt.bitOr));
		} else if (level === 3) {
			(rt.modSrcVar(f, "job_medsci_low", job.flag, rt.bitOr));
		}
		return 1;
	}
	return 0;
});

// preferences.dm:680
rt.def("/datum/preferences/proc/UpdateJobPreference", function* UpdateJobPreference(f: Frame, user: Value, role: Value, desiredLvl: Value) {
	let job: Value = null;
	if (!GLOB.SSjob || rt.len(f, GLOB.SSjob.occupations) <= 0) {
		return f.dot;
	}
	if (!(job = (yield* GLOB.SSjob.GetJob(role)))) {
		rt.op(f, "Browse", [], [user, null, "window=mob_occupation"], false);
		yield* this.ShowChoices(user);
		return f.dot;
	}
	if (!isnum(desiredLvl)) {
		to_chat(user, "<span class='danger'>UpdateJobPreference - desired level was not a number. Please notify coders!</span>");
		yield* this.ShowChoices(user);
		return f.dot;
	}
	if (role == "Assistant") {
		if (rt.bitAnd(this.job_civilian_low, job.flag)) {
			(rt.modSrcVar(f, "job_civilian_low", rt.op(f, "BitNot", [], [job.flag]), rt.bitAnd));
		} else {
			(rt.modSrcVar(f, "job_civilian_low", job.flag, rt.bitOr));
		}
		yield* this.SetChoices(user);
		return 1;
	}
	this.SetJobPreferenceLevel(job, desiredLvl);
	yield* this.SetChoices(user);
	return 1;
}, true);

// preferences.dm:724
rt.def("/datum/preferences/proc/GetJobDepartment", function GetJobDepartment(f: Frame, job: Value, level: Value) {
	if (!job || !level) {
		return 0;
	}
	if (job.department_flag === 4) {
		if (level === 1) {
			return this.job_civilian_high;
		} else if (level === 2) {
			return this.job_civilian_med;
		} else if (level === 3) {
			return this.job_civilian_low;
		}
	} else if (job.department_flag === 2) {
		if (level === 1) {
			return this.job_medsci_high;
		} else if (level === 2) {
			return this.job_medsci_med;
		} else if (level === 3) {
			return this.job_medsci_low;
		}
	} else if (job.department_flag === 1) {
		if (level === 1) {
			return this.job_engsec_high;
		} else if (level === 2) {
			return this.job_engsec_med;
		} else if (level === 3) {
			return this.job_engsec_low;
		}
	}
	return 0;
});

// preferences.dm:754
rt.def("/datum/preferences/proc/process_link", function* process_link(f: Frame, user: Value, href_list: Value) {
	let be_special_type: Value = null, new_form: Value = null, new_orbit: Value = null, new_ghost_accs: Value = null, new_ghost_others: Value = null, new_name: Value = null, new_age: Value = null, new_metadata: Value = null, new_hair: Value = null, new_hair_style: Value = null, new_facial: Value = null, new_facial_hair_style: Value = null, new_underwear: Value = null, new_undershirt: Value = null, new_socks: Value = null, new_eyes: Value = null, result: Value = null, newtype: Value = null, temp_hsv: Value = null, new_mutantcolor: Value = null, temp_hsv_1: Value = null, new_tail: Value = null, new_snout: Value = null, new_horns: Value = null, new_ears: Value = null, new_wings: Value = null, new_frills: Value = null, new_spines: Value = null, new_body_markings: Value = null, new_legs: Value = null, new_s_tone: Value = null, new_ooccolor: Value = null, new_backbag: Value = null, new_loc: Value = null, new_clown_name: Value = null, new_mime_name: Value = null, new_ai_name: Value = null, new_cyborg_name: Value = null, new_religion_name: Value = null, new_deity_name: Value = null, department: Value = null, maplist: Value = null, _default: Value = null, M: Value = null, VM: Value = null, friendlyname: Value = null, pickedmap: Value = null, version_message: Value = null, desiredfps: Value = null, pickedui: Value = null;
	let $e: any;
	if (rt.at(href_list, "preference") == "job") {
		const item_2 = rt.at(href_list, "task");
		if (item_2 === "close") {
			rt.op(f, "Browse", [], [user, null, "window=mob_occupation"], false);
			yield* this.ShowChoices(user);
		} else if (item_2 === "reset") {
			this.ResetJobs();
			yield* this.SetChoices(user);
		} else if (item_2 === "random") {
			if (this.joblessrole === 3) {
				if (jobban_isbanned(user, "Assistant")) {
					this.joblessrole = 2;
				} else {
					this.joblessrole = 1;
				}
			} else if (this.joblessrole === 1) {
				this.joblessrole = 2;
			} else if (this.joblessrole === 2) {
				this.joblessrole = 3;
			}
			yield* this.SetChoices(user);
		} else if (item_2 === "setJobLevel") {
			yield* this.UpdateJobPreference(user, rt.at(href_list, "text"), text2num(rt.at(href_list, "level")));
		} else {
			yield* this.SetChoices(user);
		}
		return 1;
	}
	const item = rt.at(href_list, "task");
	if (item === "random") {
		const item_2 = rt.at(href_list, "preference");
		if (item_2 === "name") {
			this.real_name = this.pref_species.random_name(this.gender, 1);
		} else if (item_2 === "age") {
			this.age = rand(17, 85);
		} else if (item_2 === "hair") {
			this.hair_color = random_short_color();
		} else if (item_2 === "hair_style") {
			this.hair_style = random_hair_style(this.gender);
		} else if (item_2 === "facial") {
			this.facial_hair_color = random_short_color();
		} else if (item_2 === "facial_hair_style") {
			this.facial_hair_style = random_facial_hair_style(this.gender);
		} else if (item_2 === "underwear") {
			this.underwear = (yield* random_underwear(this.gender));
		} else if (item_2 === "undershirt") {
			this.undershirt = (yield* random_undershirt(this.gender));
		} else if (item_2 === "socks") {
			this.socks = (yield* random_socks());
		} else if (item_2 === "eyes") {
			this.eye_color = random_eye_color();
		} else if (item_2 === "s_tone") {
			this.skin_tone = random_skin_tone();
		} else if (item_2 === "bag") {
			this.backbag = pick(GLOB.backbaglist);
		} else if (item_2 === "all") {
			yield* this.random_character();
		}
	} else if (item === "input") {
		const item_2 = rt.at(href_list, "preference");
		if (item_2 === "ghostform") {
			if (this.unlock_content) {
				if (new_form = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly form:", user, GLOB.ghost_forms]))) {
					this.ghost_form = new_form;
				}
			}
		} else if (item_2 === "ghostorbit") {
			if (this.unlock_content) {
				if (new_orbit = (yield* g.op(f, "Prompt", [1], [null, "Thanks for supporting BYOND", "Thanks for supporting BYOND - Choose your ghostly orbit:", user, GLOB.ghost_orbits]))) {
					this.ghost_orbit = new_orbit;
				}
			}
		} else if (item_2 === "ghostaccs") {
			const subject = (new_ghost_accs = (yield* alert("Do you want your ghost to show full accessories where possible, hide accessories but still use the directional sprites where possible, or also ignore the directions and stick to the default sprites?", null, "full accessories", "only directional sprites", "default sprites")));
			if (subject === "full accessories") {
				this.ghost_accs = 100;
			} else if (subject === "only directional sprites") {
				this.ghost_accs = 50;
			} else if (subject === "default sprites") {
				this.ghost_accs = 1;
			}
		} else if (item_2 === "ghostothers") {
			const subject = (new_ghost_others = (yield* alert("Do you want the ghosts of others to show up as their own setting, as their default sprites or always as the default white ghost?", null, "their setting", "default sprites", "white ghost")));
			if (subject === "their setting") {
				this.ghost_others = 100;
			} else if (subject === "default sprites") {
				this.ghost_others = 50;
			} else if (subject === "white ghost") {
				this.ghost_others = 1;
			}
		} else if (item_2 === "name") {
			if (new_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's name:", user, null])))) {
				this.real_name = new_name;
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>`);
			}
		} else if (item_2 === "age") {
			if (new_age = (yield* g.op(f, "Prompt", [33], [null, "Character Preference", `Choose your character's age:\n(${17}-${85})`, user, null]))) {
				this.age = max(min(round(text2num(new_age)), 85), 17);
			}
		} else if (item_2 === "metadata") {
			if (new_metadata = (yield* g.op(f, "Prompt", [65], [this.metadata, "Game Preference", "Enter any information you'd like others to see, such as Roleplay-preferences:", user, null]))) {
				this.metadata = sanitize(copytext(new_metadata, 1, 1024));
			}
		} else if (item_2 === "hair") {
			if (new_hair = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's hair colour:", user, null]))) {
				this.hair_color = sanitize_hexcolor(new_hair);
			}
		} else if (item_2 === "hair_style") {
			if (this.gender == "male") {
				new_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's hair style:", user, GLOB.hair_styles_male_list]));
			} else {
				new_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's hair style:", user, GLOB.hair_styles_female_list]));
			}
			if (new_hair_style) {
				this.hair_style = new_hair_style;
			}
		} else if (item_2 === "next_hair_style") {
			if (this.gender == "male") {
				this.hair_style = next_list_item(this.hair_style, GLOB.hair_styles_male_list);
			} else {
				this.hair_style = next_list_item(this.hair_style, GLOB.hair_styles_female_list);
			}
		} else if (item_2 === "previous_hair_style") {
			if (this.gender == "male") {
				this.hair_style = previous_list_item(this.hair_style, GLOB.hair_styles_male_list);
			} else {
				this.hair_style = previous_list_item(this.hair_style, GLOB.hair_styles_female_list);
			}
		} else if (item_2 === "facial") {
			if (new_facial = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's facial-hair colour:", user, null]))) {
				this.facial_hair_color = sanitize_hexcolor(new_facial);
			}
		} else if (item_2 === "facial_hair_style") {
			if (this.gender == "male") {
				new_facial_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's facial-hair style:", user, GLOB.facial_hair_styles_male_list]));
			} else {
				new_facial_hair_style = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's facial-hair style:", user, GLOB.facial_hair_styles_female_list]));
			}
			if (new_facial_hair_style) {
				this.facial_hair_style = new_facial_hair_style;
			}
		} else if (item_2 === "next_facehair_style") {
			if (this.gender == "male") {
				this.facial_hair_style = next_list_item(this.facial_hair_style, GLOB.facial_hair_styles_male_list);
			} else {
				this.facial_hair_style = next_list_item(this.facial_hair_style, GLOB.facial_hair_styles_female_list);
			}
		} else if (item_2 === "previous_facehair_style") {
			if (this.gender == "male") {
				this.facial_hair_style = previous_list_item(this.facial_hair_style, GLOB.facial_hair_styles_male_list);
			} else {
				this.facial_hair_style = previous_list_item(this.facial_hair_style, GLOB.facial_hair_styles_female_list);
			}
		} else if (item_2 === "underwear") {
			if (this.gender == "male") {
				new_underwear = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's underwear:", user, GLOB.underwear_m]));
			} else {
				new_underwear = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's underwear:", user, GLOB.underwear_f]));
			}
			if (new_underwear) {
				this.underwear = new_underwear;
			}
		} else if (item_2 === "undershirt") {
			if (this.gender == "male") {
				new_undershirt = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's undershirt:", user, GLOB.undershirt_m]));
			} else {
				new_undershirt = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's undershirt:", user, GLOB.undershirt_f]));
			}
			if (new_undershirt) {
				this.undershirt = new_undershirt;
			}
		} else if (item_2 === "socks") {
			if (new_socks = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's socks:", user, GLOB.socks_list]))) {
				this.socks = new_socks;
			}
		} else if (item_2 === "eyes") {
			if (new_eyes = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's eye colour:", user, null]))) {
				this.eye_color = sanitize_hexcolor(new_eyes);
			}
		} else if (item_2 === "species") {
			if (result = (yield* g.op(f, "Prompt", [1], [null, "Species Selection", "Select a species", user, GLOB.roundstart_species]))) {
				newtype = rt.index(GLOB.roundstart_species, result);
				this.pref_species = (yield* new_(newtype));
				temp_hsv = RGBtoHSV(rt.at(this.features, "mcolor"));
				if (rt.at(this.features, "mcolor") == "#000" || !rt.isIn(f, 17, this.pref_species.species_traits) && rt.index(ReadHSV(temp_hsv), 3) < rt.index(ReadHSV("#7F7F7F"), 3)) {
					rt.setAt(this.features, "mcolor", this.pref_species.default_color);
				}
			}
		} else if (item_2 === "mutant_color") {
			if (new_mutantcolor = (yield* g.op(f, "Prompt", [257], [null, "Character Preference", "Choose your character's alien/mutant color:", user, null]))) {
				temp_hsv_1 = RGBtoHSV(new_mutantcolor);
				if (new_mutantcolor == "#000000") {
					rt.setAt(this.features, "mcolor", this.pref_species.default_color);
				} else if (rt.isIn(f, 17, this.pref_species.species_traits) || rt.index(ReadHSV(temp_hsv_1), 3) >= rt.index(ReadHSV("#7F7F7F"), 3)) {
					rt.setAt(this.features, "mcolor", sanitize_hexcolor(new_mutantcolor));
				} else {
					to_chat(user, "<span class='danger'>Invalid color. Your color is not bright enough.</span>");
				}
			}
		} else if (item_2 === "tail_lizard") {
			if (new_tail = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's tail:", user, GLOB.tails_list_lizard]))) {
				rt.setAt(this.features, "tail_lizard", new_tail);
			}
		} else if (item_2 === "tail_human") {
			new_tail = null;
			if (new_tail = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's tail:", user, GLOB.tails_list_human]))) {
				rt.setAt(this.features, "tail_human", new_tail);
			}
		} else if (item_2 === "snout") {
			if (new_snout = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's snout:", user, GLOB.snouts_list]))) {
				rt.setAt(this.features, "snout", new_snout);
			}
		} else if (item_2 === "horns") {
			if (new_horns = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's horns:", user, GLOB.horns_list]))) {
				rt.setAt(this.features, "horns", new_horns);
			}
		} else if (item_2 === "ears") {
			if (new_ears = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's ears:", user, GLOB.ears_list]))) {
				rt.setAt(this.features, "ears", new_ears);
			}
		} else if (item_2 === "wings") {
			if (new_wings = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's wings:", user, GLOB.r_wings_list]))) {
				rt.setAt(this.features, "wings", new_wings);
			}
		} else if (item_2 === "frills") {
			if (new_frills = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's frills:", user, GLOB.frills_list]))) {
				rt.setAt(this.features, "frills", new_frills);
			}
		} else if (item_2 === "spines") {
			if (new_spines = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's spines:", user, GLOB.spines_list]))) {
				rt.setAt(this.features, "spines", new_spines);
			}
		} else if (item_2 === "body_markings") {
			if (new_body_markings = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's body markings:", user, GLOB.body_markings_list]))) {
				rt.setAt(this.features, "body_markings", new_body_markings);
			}
		} else if (item_2 === "legs") {
			if (new_legs = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's legs:", user, GLOB.legs_list]))) {
				rt.setAt(this.features, "legs", new_legs);
			}
		} else if (item_2 === "s_tone") {
			if (new_s_tone = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's skin-tone:", user, GLOB.skin_tones]))) {
				this.skin_tone = new_s_tone;
			}
		} else if (item_2 === "ooccolor") {
			if (new_ooccolor = (yield* g.op(f, "Prompt", [257], [null, "Game Preference", "Choose your OOC colour:", user, null]))) {
				this.ooccolor = sanitize_ooccolor(new_ooccolor);
			}
		} else if (item_2 === "bag") {
			if (new_backbag = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's style of bag:", user, GLOB.backbaglist]))) {
				this.backbag = new_backbag;
			}
		} else if (item_2 === "uplink_loc") {
			if (new_loc = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your character's traitor uplink spawn location:", user, GLOB.uplink_spawn_loc_list]))) {
				this.uplink_spawn_loc = new_loc;
			}
		} else if (item_2 === "clown_name") {
			if (new_clown_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's clown name:", user, null])))) {
				rt.setAt(this.custom_names, "clown", new_clown_name);
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>`);
			}
		} else if (item_2 === "mime_name") {
			if (new_mime_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's mime name:", user, null])))) {
				rt.setAt(this.custom_names, "mime", new_mime_name);
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>`);
			}
		} else if (item_2 === "ai_name") {
			if (new_ai_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's AI name:", user, null])), 1)) {
				rt.setAt(this.custom_names, "ai", new_ai_name);
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, 0-9, -, ' and .</font>`);
			}
		} else if (item_2 === "cyborg_name") {
			if (new_cyborg_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's cyborg name:", user, null])), 1)) {
				rt.setAt(this.custom_names, "cyborg", new_cyborg_name);
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, 0-9, -, ' and .</font>`);
			}
		} else if (item_2 === "religion_name") {
			if (new_religion_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's religion:", user, null])))) {
				rt.setAt(this.custom_names, "religion", new_religion_name);
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>`);
			}
		} else if (item_2 === "deity_name") {
			if (new_deity_name = reject_bad_name((yield* g.op(f, "Prompt", [3], [null, "Character Preference", "Choose your character's deity:", user, null])))) {
				rt.setAt(this.custom_names, "deity", new_deity_name);
			} else {
				to_chat(user, `<font color='red'>Invalid name. Your name should be at least 2 and at most ${42} characters long. It may only contain the characters A-Z, a-z, -, ' and .</font>`);
			}
		} else if (item_2 === "sec_dept") {
			if (department = (yield* g.op(f, "Prompt", [1], [null, "Security Departments", "Choose your prefered security department:", user, GLOB.security_depts_prefs]))) {
				this.prefered_security_department = department;
			}
		} else if (item_2 === "preferred_map") {
			maplist = list();
			_default = "Default";
			if (GLOB.config.defaultmap) {
				_default += ` (${GLOB.config.defaultmap.map_name})`;
			}
			for (M of each(GLOB.config.maplist)) {
				VM = rt.index(GLOB.config.maplist, M);
				friendlyname = `${VM.map_name} `;
				if (VM.voteweight <= 0) {
					friendlyname += " (disabled)";
				}
				rt.setAt(maplist, friendlyname, VM.map_name);
			}
			rt.setAt(maplist, _default, null);
			if (pickedmap = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your preferred map. This will be used to help weight random map selection.", user, maplist]))) {
				this.preferred_map = rt.index(maplist, pickedmap);
			}
		} else if (item_2 === "clientfps") {
			if (user.client && user.client.byond_version < 511) {
				version_message = `\nYou need to be using byond version 511 or later to take advantage of this feature, your version of ${user.client.byond_version} is too low`;
			}
			if (rt.world().byond_version < 511) {
				version_message += "\nThis server does not currently support client side fps. You can set now for when it does.";
			}
			if ((desiredfps = (yield* g.op(f, "Prompt", [33], [this.clientfps, "Character Preference", `Choose your desired fps.${version_message}\n(0 = synced with server tick rate (currently:${rt.world().fps}))`, user, null]))) !== null) {
				this.clientfps = sanitize_integer(desiredfps, 0, 1000, this.clientfps); // tg_js: modern tg's bounds (any number was kept)
				if (rt.world().byond_version >= 511 && user.client && user.client.byond_version >= 511) {
					rt.setAt(user.client.vars, "fps", this.clientfps);
				}
			}
		} else if (item_2 === "ui") {
			if (pickedui = (yield* g.op(f, "Prompt", [1], [null, "Character Preference", "Choose your UI style.", user, list("Midnight", "Plasmafire", "Retro", "Slimecore", "Operative", "Clockwork")]))) {
				this.UI_style = pickedui;
			}
		}
	} else {
		const item_2 = rt.at(href_list, "preference");
		if (item_2 === "publicity") {
			if (this.unlock_content) {
				(rt.modSrcVar(f, "toggles", 16, rt.bitXor));
			}
		} else if (item_2 === "gender") {
			if (this.gender == "male") {
				this.gender = "female";
			} else {
				this.gender = "male";
			}
			this.underwear = (yield* random_underwear(this.gender));
			this.undershirt = (yield* random_undershirt(this.gender));
			this.socks = (yield* random_socks());
			this.facial_hair_style = random_facial_hair_style(this.gender);
			this.hair_style = random_hair_style(this.gender);
		} else if (item_2 === "tgui_fancy") {
			this.tgui_fancy = (!this.tgui_fancy ? 1 : 0);
		} else if (item_2 === "tgui_lock") {
			this.tgui_lock = (!this.tgui_lock ? 1 : 0);
		} else if (item_2 === "winflash") {
			this.windowflashing = (!this.windowflashing ? 1 : 0);
		} else if (item_2 === "hear_adminhelps") {
			(rt.modSrcVar(f, "toggles", 1, rt.bitXor));
		} else if (item_2 === "announce_login") {
			(rt.modSrcVar(f, "toggles", 1024, rt.bitXor));
		} else if (item_2 === "be_special") {
			be_special_type = rt.at(href_list, "be_special_type");
			// tg_js: only tg's roles (the menu's list): any text was added, so the saved list grew without end
			if (!rt.isIn(f, be_special_type, GLOB.special_roles)) {
			} else if (rt.isIn(f, be_special_type, this.be_special)) {
				this.be_special -= be_special_type;
			} else {
				this.be_special += be_special_type;
			}
		} else if (item_2 === "name") {
			this.be_random_name = (!this.be_random_name ? 1 : 0);
		} else if (item_2 === "all") {
			this.be_random_body = (!this.be_random_body ? 1 : 0);
		} else if (item_2 === "hear_midis") {
			(rt.modSrcVar(f, "toggles", 2, rt.bitXor));
		} else if (item_2 === "lobby_music") {
			(rt.modSrcVar(f, "toggles", 8, rt.bitXor));
			if (rt.bitAnd(this.toggles, 8) && user.client) {
				yield* user.client.playtitlemusic();
			} else {
				user.stop_sound_channel(1024);
			}
		} else if (item_2 === "ghost_ears") {
			(rt.modSrcVar(f, "chat_toggles", 4, rt.bitXor));
		} else if (item_2 === "ghost_sight") {
			(rt.modSrcVar(f, "chat_toggles", 8, rt.bitXor));
		} else if (item_2 === "ghost_whispers") {
			(rt.modSrcVar(f, "chat_toggles", 128, rt.bitXor));
		} else if (item_2 === "ghost_radio") {
			(rt.modSrcVar(f, "chat_toggles", 512, rt.bitXor));
		} else if (item_2 === "ghost_pda") {
			(rt.modSrcVar(f, "chat_toggles", 256, rt.bitXor));
		} else if (item_2 === "allow_midround_antag") {
			(rt.modSrcVar(f, "toggles", 64, rt.bitXor));
		} else if (item_2 === "parallaxup") {
			this.parallax = Wrap(this.parallax + 1, -1, 4);
			if (this.parent && this.parent.mob && this.parent.mob.hud_used) {
				yield* this.parent.mob.hud_used.update_parallax_pref(this.parent.mob);
			}
		} else if (item_2 === "parallaxdown") {
			this.parallax = Wrap(this.parallax - 1, -1, 4);
			if (this.parent && this.parent.mob && this.parent.mob.hud_used) {
				yield* this.parent.mob.hud_used.update_parallax_pref(this.parent.mob);
			}
		} else if (item_2 === "save") {
			this.save_preferences();
			this.save_character();
		} else if (item_2 === "load") {
			this.load_preferences();
			yield* this.load_character();
		} else if (item_2 === "changeslot") {
			if (!(yield* this.load_character(text2num(rt.at(href_list, "num"))))) {
				yield* this.random_character();
				this.real_name = random_unique_name(this.gender);
				this.save_character();
			}
		} else if (item_2 === "tab") {
			// tg_js: the two tabs there are (tab=2 or 0.5 showed an empty window)
			const tab = text2num(rt.at(href_list, "tab"));
			if (tab === 0 || tab === 1) {
				this.current_tab = tab;
			}
		}
	}
	yield* this.ShowChoices(user);
	return 1;
}, true);

// preferences.dm:1248
rt.def("/datum/preferences/proc/copy_to", function* copy_to(f: Frame, character: Value, icon_updates: Value) {
	let firstspace: Value = null, name_length: Value = null, organ_eyes: Value = null, chosen_species: Value = null;
	icon_updates ??= 1;
	if (this.be_random_name) {
		this.real_name = this.pref_species.random_name(this.gender);
	}
	if (this.be_random_body) {
		yield* this.random_character(this.gender);
	}
	if (GLOB.config.humans_need_surnames) {
		firstspace = findtext(this.real_name, " ");
		name_length = rt.length(this.real_name);
		if (!firstspace) {
			this.real_name += ` ${pick(GLOB.last_names)}`;
		} else if (firstspace == name_length) {
			this.real_name += `${pick(GLOB.last_names)}`;
		}
	}
	character.real_name = this.real_name;
	character.name = character.real_name;
	character.gender = this.gender;
	character.age = this.age;
	character.eye_color = this.eye_color;
	if (organ_eyes = character.getorgan(T("/obj/item/organ/eyes"))) {
		if (!rt.initial(f, organ_eyes, "eye_color")) {
			organ_eyes.eye_color = this.eye_color;
		}
		organ_eyes.old_eye_color = this.eye_color;
	}
	character.hair_color = this.hair_color;
	character.facial_hair_color = this.facial_hair_color;
	character.skin_tone = this.skin_tone;
	character.hair_style = this.hair_style;
	character.facial_hair_style = this.facial_hair_style;
	character.underwear = this.underwear;
	character.undershirt = this.undershirt;
	character.socks = this.socks;
	character.backbag = this.backbag;
	character.dna.features = (yield* this.features.Copy());
	character.dna.real_name = character.real_name;
	if (this.pref_species != T("/datum/species/human") && GLOB.config.mutant_races) {
		chosen_species = this.pref_species.type;
	} else {
		chosen_species = T("/datum/species/human");
	}
	yield* character.set_species(chosen_species, { icon_update: 0 });
	if (!icon_updates) return f.dot;
	yield* character.update_body();
	yield* character.update_hair();
	yield* character.update_body_parts();
	return f.dot;
}, true);
