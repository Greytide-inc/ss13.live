// Based on /tg/station's code/game/gamemodes/changeling/changeling.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// changeling.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_changeling_IDs", function InitGlobalpossible_changeling_IDs(f: Frame) {
	GLOB.possible_changeling_IDs = list("Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega");
	this.gvars_datum_init_order += "possible_changeling_IDs";
	return f.dot;
});

// changeling.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalslots", function InitGlobalslots(f: Frame) {
	GLOB.slots = list("head", "wear_mask", "back", "wear_suit", "w_uniform", "shoes", "belt", "gloves", "glasses", "ears", "wear_id", "s_store");
	this.gvars_datum_init_order += "slots";
	return f.dot;
});

// changeling.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalslot2slot", function InitGlobalslot2slot(f: Frame) {
	GLOB.slot2slot = rt.alist(f, ["head", 11, "wear_mask", 2, "neck", 10, "back", 1, "wear_suit", 13, "w_uniform", 14, "shoes", 12, "belt", 5, "gloves", 9, "glasses", 8, "ears", 7, "wear_id", 6, "s_store", 17]);
	this.gvars_datum_init_order += "slot2slot";
	return f.dot;
});

// changeling.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalslot2type", function InitGlobalslot2type(f: Frame) {
	GLOB.slot2type = rt.alist(f, ["head", T("/obj/item/clothing/head/changeling"), "wear_mask", T("/obj/item/clothing/mask/changeling"), "back", T("/obj/item/changeling"), "wear_suit", T("/obj/item/clothing/suit/changeling"), "w_uniform", T("/obj/item/clothing/under/changeling"), "shoes", T("/obj/item/clothing/shoes/changeling"), "belt", T("/obj/item/changeling"), "gloves", T("/obj/item/clothing/gloves/changeling"), "glasses", T("/obj/item/clothing/glasses/changeling"), "ears", T("/obj/item/changeling"), "wear_id", T("/obj/item/changeling"), "s_store", T("/obj/item/changeling")]);
	this.gvars_datum_init_order += "slot2type";
	return f.dot;
});

rt.type(1083, "/datum/game_mode/changeling", "/datum/game_mode", {
	prob_int_murder_target: 50,
	prob_right_murder_target_l: 25,
	prob_right_murder_target_h: 50,
	prob_int_item: 50,
	prob_right_item_l: 25,
	prob_right_item_h: 50,
	prob_int_sab_target: 50,
	prob_right_sab_target_l: 25,
	prob_right_sab_target_h: 50,
	prob_right_killer_l: 25,
	prob_right_killer_h: 50,
	prob_right_objective_l: 25,
	prob_right_objective_h: 50,
	changeling_amount: 4,
	changeling_team_objective_type: null,
	name: "changeling",
	config_tag: "changeling",
	antag_flag: "changeling",
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 15,
	required_enemies: 1,
	recommended_enemies: 4,
	reroll_friendly: 1,
	announce_span: "green",
	announce_text: "Alien changelings have infiltrated the crew!\n<span class='green'>Changelings</span>: Accomplish the objectives assigned to you.\n<span class='notice'>Crew</span>: Root out and eliminate the changeling menace.",
}, { const: ["prob_int_murder_target","prob_right_murder_target_l","prob_right_murder_target_h","prob_int_item","prob_right_item_l","prob_right_item_h","prob_int_sab_target","prob_right_sab_target_l","prob_right_sab_target_h","prob_right_killer_l","prob_right_killer_h","prob_right_objective_l","prob_right_objective_h","changeling_amount"] });

// changeling.dm:54
rt.def("/datum/game_mode/changeling/proc/pre_setup", function pre_setup(f: Frame) {
	let i: Value = null, changeling: Value = null;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	let num_changelings: Value = 1;
	if (GLOB.config.changeling_scaling_coeff) {
		num_changelings = max(1, min(round(this.num_players() / (GLOB.config.changeling_scaling_coeff * 2)) + 2, round(this.num_players() / GLOB.config.changeling_scaling_coeff)));
	} else {
		num_changelings = max(1, min(this.num_players(), 4));
	}
	if (rt.len(f, this.antag_candidates) > 0) {
		i = 0;
		while (i < num_changelings) {
			if (!rt.len(f, this.antag_candidates)) {
				break;
			}
			this.antag_candidates -= (changeling = pick(this.antag_candidates));
			this.changelings += changeling;
			changeling.special_role = "Changeling";
			changeling.restricted_roles = this.restricted_jobs;
			i++;
		}
		return 1;
	} else {
		return 0;
	}
});

// changeling.dm:83
rt.def("/datum/game_mode/changeling/proc/post_setup", function* post_setup(f: Frame) {
	let _T: Value = null, CTO: Value = null, changeling: Value = null;
	let team_objectives: Value = typesof(T("/datum/objective/changeling_team_objective")) - T("/datum/objective/changeling_team_objective");
	let possible_team_objectives: Value = list();
	for (_T of each(team_objectives)) {
		CTO = _T;
		if (rt.len(f, this.changelings) >= rt.initial(f, CTO, "min_lings")) {
			possible_team_objectives += _T;
		}
	}
	if (rt.len(f, possible_team_objectives) && prob(20 * rt.len(f, this.changelings))) {
		this.changeling_team_objective_type = pick(possible_team_objectives);
	}
	for (changeling of each(this.changelings, T("/datum/mind"))) {
		log_game(`${changeling.key} (ckey) has been selected as a changeling`);
		yield* changeling.current.make_changeling();
		yield* this.forge_changeling_objectives(changeling);
		yield* this.greet_changeling(changeling);
		GLOB.SSticker.mode.update_changeling_icons_added(changeling);
	}
	this.modePlayer += this.changelings;
	yield* parent_proc();
	return f.dot;
}, true);

// changeling.dm:104
rt.def("/datum/game_mode/changeling/proc/make_antag_chance", function* make_antag_chance(f: Frame, character: Value) {
	let changelingcap: Value = min(round(rt.len(f, GLOB.joined_player_list) / (GLOB.config.changeling_scaling_coeff * 2)) + 2, round(rt.len(f, GLOB.joined_player_list) / GLOB.config.changeling_scaling_coeff));
	if (rt.len(f, GLOB.SSticker.mode.changelings) >= changelingcap) {
		return f.dot;
	}
	if (!(rt.len(f, GLOB.SSticker.mode.changelings) <= changelingcap - 2 || prob(100 - GLOB.config.changeling_scaling_coeff * 2))) return f.dot;
	if (!rt.isIn(f, "changeling", character.client.prefs.be_special)) return f.dot;
	if (!(!jobban_isbanned(character, "changeling") && !jobban_isbanned(character, "Syndicate"))) return f.dot;
	if (rt.isIn(f, character.job, this.restricted_jobs)) return f.dot;
	yield* character.mind.make_Changling();
	return f.dot;
}, true);

// changeling.dm:122
rt.def("/datum/game_mode/proc/forge_changeling_objectives", function* forge_changeling_objectives(f: Frame, changeling: Value, team_mode: Value) {
	let CTO: Value = null, absorb_objective: Value = null, steal_objective: Value = null, active_ais: Value = null, destroy_objective: Value = null, kill_objective: Value = null, maroon_objective: Value = null, identity_theft: Value = null, escape_objective: Value = null, identity_theft_3: Value = null;
	team_mode ??= 0;
	let escape_objective_possible: Value = 1;
	for (CTO of each(changeling.objectives, T("/datum/objective/changeling_team_objective"))) {
		if (!CTO.escape_objective_compatible) {
			escape_objective_possible = 0;
			break;
		}
	}
	(absorb_objective = (yield* new_(T("/datum/objective/absorb")))).owner = changeling;
	absorb_objective.gen_amount_goal(6, 8);
	changeling.objectives += absorb_objective;
	if (prob(60)) {
		(steal_objective = (yield* new_(T("/datum/objective/steal")))).owner = changeling;
		yield* steal_objective.find_target();
		changeling.objectives += steal_objective;
	}
	if (rt.len(f, (active_ais = (yield* g.call(f, P("/proc/active_ais"), null, [])))) && prob(100 / rt.len(f, GLOB.joined_player_list))) {
		(destroy_objective = (yield* new_(T("/datum/objective/destroy")))).owner = changeling;
		yield* destroy_objective.find_target();
		changeling.objectives += destroy_objective;
	} else if (prob(70)) {
		(kill_objective = (yield* new_(T("/datum/objective/assassinate")))).owner = changeling;
		if (team_mode) {
			yield* kill_objective.find_target_by_role({ role: "Changeling", role_type: 1, invert: 1 });
		} else {
			yield* kill_objective.find_target();
		}
		changeling.objectives += kill_objective;
	} else {
		(maroon_objective = (yield* new_(T("/datum/objective/maroon")))).owner = changeling;
		if (team_mode) {
			yield* maroon_objective.find_target_by_role({ role: "Changeling", role_type: 1, invert: 1 });
		} else {
			yield* maroon_objective.find_target();
		}
		changeling.objectives += maroon_objective;
		if (!rt.locateIn(f, T("/datum/objective/escape"), changeling.objectives) && escape_objective_possible) {
			(identity_theft = (yield* new_(T("/datum/objective/escape/escape_with_identity")))).owner = changeling;
			identity_theft.target = maroon_objective.target;
			identity_theft.update_explanation_text();
			changeling.objectives += identity_theft;
			escape_objective_possible = 0;
		}
	}
	if (!(!rt.locateIn(f, T("/datum/objective/escape"), changeling.objectives) && escape_objective_possible)) return f.dot;
	if (prob(50)) {
		(escape_objective = (yield* new_(T("/datum/objective/escape")))).owner = changeling;
		changeling.objectives += escape_objective;
	} else {
		(identity_theft_3 = (yield* new_(T("/datum/objective/escape/escape_with_identity")))).owner = changeling;
		if (team_mode) {
			yield* identity_theft_3.find_target_by_role({ role: "Changeling", role_type: 1, invert: 1 });
		} else {
			yield* identity_theft_3.find_target();
		}
		changeling.objectives += identity_theft_3;
	}
	escape_objective_possible = 0;
	return f.dot;
}, true);

// changeling.dm:189
rt.def("/datum/game_mode/changeling/proc/forge_changeling_objectives", function* forge_changeling_objectives(f: Frame, changeling: Value) {
	let team_objective: Value = null;
	if (this.changeling_team_objective_type) {
		(team_objective = (yield* new_(this.changeling_team_objective_type))).owner = changeling;
		changeling.objectives += team_objective;
		yield* parent_proc(changeling, 1);
	} else {
		yield* parent_proc(changeling, 0);
	}
	return f.dot;
}, true);

// changeling.dm:200
rt.def("/datum/game_mode/proc/greet_changeling", function* greet_changeling(f: Frame, changeling: Value, you_are: Value) {
	let H: Value = null, objective: Value = null;
	you_are ??= 1;
	if (you_are) {
		to_chat(changeling.current, `<span class='boldannounce'>You are ${changeling.changeling.changelingID}, a changeling! You have absorbed and taken the form of a human.</span>`);
	}
	to_chat(changeling.current, "<span class='boldannounce'>Use say \":g message\" to communicate with your fellow changelings.</span>");
	to_chat(changeling.current, "<b>You must complete the following tasks:</b>");
	yield* changeling.current.playsound_local(rt.getStep(f, changeling.current, 0), rt.rsc("sound/ambience/antag/ling_aler.ogg"), 100, 0, { pressure_affected: 0 });
	if (changeling.current.mind) {
		if ((H = changeling.current).mind.assigned_role == "Clown") {
			to_chat(H, "You have evolved beyond your clownish nature, allowing you to wield weapons without harming yourself.");
			yield* H.dna.remove_mutation("Clumsiness");
		}
	}
	let obj_count: Value = 1;
	for (objective of each(changeling.objectives, T("/datum/objective"))) {
		to_chat(changeling.current, `<b>Objective #${obj_count}</b>: ${objective.explanation_text}`);
		obj_count++;
	}
	return f.dot;
}, true);

// changeling.dm:240
rt.def("/datum/game_mode/proc/auto_declare_completion_changeling", function auto_declare_completion_changeling(f: Frame) {
	let text: Value = null, changeling: Value = null, changelingwin: Value = null, count: Value = null, objective: Value = null;
	if (rt.len(f, this.changelings)) {
		text = "<br><font size=3><b>The changelings were:</b></font>";
		for (changeling of each(this.changelings, T("/datum/mind"))) {
			changelingwin = 1;
			if (!changeling.current) {
				changelingwin = 0;
			}
			text += this.printplayer(changeling);
			text += `<br><b>Changeling ID:</b> ${changeling.changeling.changelingID}.`;
			text += `<br><b>Genomes Extracted:</b> ${changeling.changeling.absorbedcount}`;
			if (rt.len(f, changeling.objectives)) {
				count = 1;
				objective = null;
				for (objective of each(changeling.objectives, T("/datum/objective"))) {
					if (objective.check_completion()) {
						text += `<br><b>Objective #${count}</b>: ${objective.explanation_text} <font color='green'><b>Success!</b></font>`;
					} else {
						text += `<br><b>Objective #${count}</b>: ${objective.explanation_text} <span class='danger'>Fail.</span>`;
						changelingwin = 0;
					}
					count++;
				}
			}
			if (changelingwin) {
				text += "<br><font color='green'><b>The changeling was successful!</b></font>";
			} else {
				text += "<br><span class='boldannounce'>The changeling has failed.</span>";
			}
			text += "<br>";
		}
		to_chat(rt.world(), text);
	}
	return 1;
});

rt.type(1195, "/datum/changeling", "/datum", {
	stored_profiles: null,
	first_prof: null,
	dna_max: 6,
	absorbedcount: 0,
	chem_charges: 20,
	chem_storage: 75,
	chem_recharge_rate: 1,
	chem_recharge_slowdown: 0,
	sting_range: 2,
	changelingID: "Changeling",
	geneticdamage: 0,
	isabsorbing: 0,
	islinking: 0,
	geneticpoints: 10,
	purchasedpowers: null,
	mimicing: "",
	canrespec: 0,
	changeling_speak: 0,
	chosen_dna: null,
	chosen_sting: null,
	cellular_emporium: null,
	emporium_action: null,
});

// changeling.dm:279
rt.def("/datum/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_profiles = list();

	this.purchasedpowers = list();
	return f.dot;
});

// changeling.dm:305
rt.def("/datum/changeling/proc/New", function* New(f: Frame) {
	let honorific: Value = null;
	if (f.args[0] === null) {
		f.args[0] = "female";
	}
	yield* parent_proc();
	if (f.args[0] == "female") {
		honorific = "Ms.";
	} else {
		honorific = "Mr.";
	}
	if (rt.len(f, GLOB.possible_changeling_IDs)) {
		this.changelingID = pick(GLOB.possible_changeling_IDs);
		GLOB.possible_changeling_IDs -= this.changelingID;
		this.changelingID = `${honorific} ${this.changelingID}`;
	} else {
		this.changelingID = `${honorific} ${rand(1, 999)}`;
	}
	this.cellular_emporium = (yield* new_(T("/datum/cellular_emporium"), this));
	this.emporium_action = (yield* new_(T("/datum/action/innate/cellular_emporium"), this.cellular_emporium));
	return f.dot;
}, true, { args: ["gender"] });

// changeling.dm:322
rt.def("/datum/changeling/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.cellular_emporium);
	this.cellular_emporium = null;
	yield* qdel(this.emporium_action);
	this.emporium_action = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// changeling.dm:329
rt.def("/datum/changeling/proc/regenerate", function* regenerate(f: Frame, the_ling: Value) {
	if (!rt.istype(the_ling, T("/mob/living/carbon"))) return f.dot;
	yield* this.emporium_action.Grant(the_ling);
	if (the_ling.stat == 2) {
		this.chem_charges = min(max(0, this.chem_charges + this.chem_recharge_rate - this.chem_recharge_slowdown), this.chem_storage * 0.5);
		this.geneticdamage = max(LING_DEAD_GENETICDAMAGE_HEAL_CAP, this.geneticdamage - 1);
	} else {
		this.chem_charges = min(max(0, this.chem_charges + this.chem_recharge_rate - this.chem_recharge_slowdown), this.chem_storage);
		this.geneticdamage = max(0, this.geneticdamage - 1);
	}
	return f.dot;
}, true);

// changeling.dm:340
rt.def("/datum/changeling/proc/get_dna", function get_dna(f: Frame, dna_owner: Value) {
	let prof: Value = null;
	for (prof of each(this.stored_profiles, T("/datum/changelingprofile"))) {
		if (dna_owner == prof.name) {
			return prof;
		}
	}
	return f.dot;
});

// changeling.dm:345
rt.def("/datum/changeling/proc/has_dna", function has_dna(f: Frame, tDNA: Value) {
	let prof: Value = null;
	for (prof of each(this.stored_profiles, T("/datum/changelingprofile"))) {
		if (tDNA.is_same_as(prof.dna)) {
			return 1;
		}
	}
	return 0;
});

// changeling.dm:351
rt.def("/datum/changeling/proc/can_absorb_dna", function can_absorb_dna(f: Frame, user: Value, target: Value, verbose: Value) {
	let prof: Value = null;
	verbose ??= 1;
	if (rt.len(f, this.stored_profiles)) {
		if ((prof = rt.index(this.stored_profiles, 1)).dna == user.dna && rt.len(f, this.stored_profiles) >= this.dna_max) {
			if (verbose) {
				to_chat(user, "<span class='warning'>We have reached our capacity to store genetic information! We must transform before absorbing more.</span>");
			}
			return f.dot;
		}
	}
	if (!target) {
		return f.dot;
	}
	if (rt.bitAnd(target.disabilities, 128) || rt.bitAnd(target.disabilities, 64)) {
		if (verbose) {
			to_chat(user, `<span class='warning'>DNA of ${target} is ruined beyond usability!</span>`);
		}
		return f.dot;
	}
	if (!rt.istype(target, T("/mob/living/carbon/human"))) {
		if (verbose) {
			to_chat(user, "<span class='warning'>We could gain no benefit from absorbing a lesser creature.</span>");
		}
		return f.dot;
	}
	if (this.has_dna(target.dna)) {
		if (verbose) {
			to_chat(user, "<span class='warning'>We already have this DNA in storage!</span>");
		}
		return f.dot;
	}
	if (!target.has_dna()) {
		if (verbose) {
			to_chat(user, `<span class='warning'>${target} is not compatible with our biology.</span>`);
		}
		return f.dot;
	}
	return 1;
});

// changeling.dm:378
rt.def("/datum/changeling/proc/create_profile", function* create_profile(f: Frame, H: Value, user: Value, protect: Value) {
	let slot: Value = null, I: Value = null;
	protect ??= 0;
	let prof: Value = (yield* new_(T("/datum/changelingprofile")));
	H.dna.real_name = H.real_name;
	let new_dna: Value = (yield* new_(H.dna.type));
	yield* H.dna.copy_dna(new_dna);
	prof.dna = new_dna;
	prof.name = H.real_name;
	prof.protected = protect;
	prof.underwear = H.underwear;
	prof.undershirt = H.undershirt;
	prof.socks = H.socks;
	let slots: Value = list("head", "wear_mask", "back", "wear_suit", "w_uniform", "shoes", "belt", "gloves", "glasses", "ears", "wear_id", "s_store");
	for (slot of each(slots)) {
		if (rt.isIn(f, slot, H.vars)) {
			if (!(I = rt.index(H.vars, slot))) {
				continue;
			}
			rt.setAt(prof.name_list, slot, I.name);
			rt.setAt(prof.appearance_list, slot, I.appearance);
			rt.setAt(prof.flags_cover_list, slot, I.flags_cover);
			rt.setAt(prof.item_color_list, slot, I.item_color);
			rt.setAt(prof.item_state_list, slot, I.item_state);
			rt.setAt(prof.exists_list, slot, 1);
		} else {
			continue;
		}
	}
	return prof;
}, true);

// changeling.dm:409
rt.def("/datum/changeling/proc/add_profile", function add_profile(f: Frame, prof: Value) {
	if (rt.len(f, this.stored_profiles) > this.dna_max) {
		if (!this.push_out_profile()) {
			return f.dot;
		}
	}
	this.stored_profiles += prof;
	this.absorbedcount++;
	return f.dot;
});

// changeling.dm:417
rt.def("/datum/changeling/proc/add_new_profile", function* add_new_profile(f: Frame, H: Value, user: Value, protect: Value) {
	let prof: Value = null;
	protect ??= 0;
	this.add_profile((prof = (yield* this.create_profile(H, protect))));
	return prof;
}, true);

// changeling.dm:430
rt.def("/datum/changeling/proc/get_profile_to_remove", function get_profile_to_remove(f: Frame) {
	let prof: Value = null;
	for (prof of each(this.stored_profiles, T("/datum/changelingprofile"))) {
		if (!prof.protected) {
			return prof;
		}
	}
	return f.dot;
});

// changeling.dm:435
rt.def("/datum/changeling/proc/push_out_profile", function push_out_profile(f: Frame) {
	let removeprofile: Value = null;
	if (removeprofile = this.get_profile_to_remove()) {
		this.stored_profiles -= removeprofile;
		return 1;
	}
	return 0;
});

// changeling.dm:443
rt.def("/proc/changeling_transform", function* changeling_transform(f: Frame, user: Value, chosen_prof: Value) {
	let slot: Value = null, C: Value = null, equip: Value = null, thetype: Value = null;
	let chosen_dna: Value = chosen_prof.dna;
	user.real_name = chosen_prof.name;
	user.underwear = chosen_prof.underwear;
	user.undershirt = chosen_prof.undershirt;
	user.socks = chosen_prof.socks;
	yield* chosen_dna.transfer_identity(user, 1);
	yield* user.updateappearance({ mutcolor_update: 1 });
	yield* user.update_body();
	yield* user.domutcheck();
	for (slot of each(GLOB.slots)) {
		if (rt.op(f, "IsType", [], [rt.index(user.vars, slot), rt.index(GLOB.slot2type, slot)]) && !rt.index(chosen_prof.exists_list, slot)) {
			yield* qdel(rt.index(user.vars, slot));
			continue;
		}
		if (rt.index(user.vars, slot) && !rt.op(f, "IsType", [], [rt.index(user.vars, slot), rt.index(GLOB.slot2type, slot)]) || !rt.index(chosen_prof.exists_list, slot)) {
			continue;
		}
		C = null;
		equip = 0;
		if (!rt.index(user.vars, slot)) {
			thetype = rt.index(GLOB.slot2type, slot);
			equip = 1;
			C = (yield* new_(thetype, user));
		} else if (rt.op(f, "IsType", [], [rt.index(user.vars, slot), rt.index(GLOB.slot2type, slot)])) {
			C = rt.index(user.vars, slot);
		}
		C.appearance = rt.index(chosen_prof.appearance_list, slot);
		C.name = rt.index(chosen_prof.name_list, slot);
		C.flags_cover = rt.index(chosen_prof.flags_cover_list, slot);
		C.item_color = rt.index(chosen_prof.item_color_list, slot);
		C.item_state = rt.index(chosen_prof.item_state_list, slot);
		if (equip) {
			yield* user.equip_to_slot_or_del(C, rt.index(GLOB.slot2slot, slot));
		}
	}
	yield* user.regenerate_icons();
	return f.dot;
}, true);

rt.type(1196, "/datum/changelingprofile", "/datum", {
	name: "a bug",
	protected: 0,
	dna: null,
	name_list: null,
	appearance_list: null,
	flags_cover_list: null,
	exists_list: null,
	item_color_list: null,
	item_state_list: null,
	underwear: null,
	undershirt: null,
	socks: null,
});

// changeling.dm:488
rt.def("/datum/changelingprofile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.name_list = list();

	this.appearance_list = list();

	this.flags_cover_list = list();

	this.exists_list = list();

	this.item_color_list = list();

	this.item_state_list = list();
	return f.dot;
});

// changeling.dm:500
rt.def("/datum/changelingprofile/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.dna);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// changeling.dm:506
rt.def("/datum/changelingprofile/proc/copy_profile", function* copy_profile(f: Frame, newprofile: Value) {
	newprofile.name = this.name;
	newprofile.protected = this.protected;
	newprofile.dna = (yield* new_(this.dna.type));
	yield* this.dna.copy_dna(newprofile.dna);
	newprofile.name_list = (yield* this.name_list.Copy());
	newprofile.appearance_list = (yield* this.appearance_list.Copy());
	newprofile.flags_cover_list = (yield* this.flags_cover_list.Copy());
	newprofile.exists_list = (yield* this.exists_list.Copy());
	newprofile.item_color_list = (yield* this.item_color_list.Copy());
	newprofile.item_state_list = (yield* this.item_state_list.Copy());
	newprofile.underwear = this.underwear;
	newprofile.undershirt = this.undershirt;
	newprofile.socks = this.socks;
	return f.dot;
}, true);

// changeling.dm:519
rt.def("/datum/game_mode/proc/update_changeling_icons_added", function update_changeling_icons_added(f: Frame, changling_mind: Value) {
	let hud: Value = null;
	(hud = rt.index(GLOB.huds, ANTAG_HUD_CHANGELING)).join_hud(changling_mind.current);
	this.set_antag_hud(changling_mind.current, "changling");
	return f.dot;
});

// changeling.dm:524
rt.def("/datum/game_mode/proc/update_changeling_icons_removed", function update_changeling_icons_removed(f: Frame, changling_mind: Value) {
	let hud: Value = null;
	(hud = rt.index(GLOB.huds, ANTAG_HUD_CHANGELING)).leave_hud(changling_mind.current);
	this.set_antag_hud(changling_mind.current, null);
	return f.dot;
});
