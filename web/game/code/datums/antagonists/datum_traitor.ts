// Based on /tg/station's code/datums/antagonists/datum_traitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(900, "/datum/antagonist/traitor", "/datum/antagonist", {
	should_specialise: 1,
	ai_datum: rt.typePath("/datum/antagonist/traitor/AI"),
	human_datum: rt.typePath("/datum/antagonist/traitor/human"),
	special_role: "traitor",
	employer: "The Syndicate",
	give_objectives: 1,
	should_give_codewords: 1,
	objectives_given: null,
	base_datum_custom: rt.typePath("/datum/antagonist/traitor/custom"),
	name: "Traitor",
});

// datum_traitor.dm:11
rt.def("/datum/antagonist/traitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.objectives_given = list();
	return f.dot;
});

// datum_traitor.dm:41
rt.def("/datum/antagonist/traitor/proc/on_body_transfer", function* on_body_transfer(f: Frame, old_body: Value, new_body: Value) {
	let new_datum: Value = null;
	if (rt.istype(new_body, T("/mob/living/silicon")) && rt.istype(old_body, T("/mob/living/silicon"))) {
		yield* parent_proc();
	} else {
		this.silent = 1;
		yield* this.owner.add_antag_datum(this.base_datum_custom);
		for (new_datum of each(this.owner.antag_datums, T("/datum/antagonist/traitor"))) {
			if (new_datum == this) {
				continue;
			}
			this.transfer_important_variables(new_datum);
			break;
		}
		yield* this.on_removal();
	}
	return f.dot;
}, true);

// datum_traitor.dm:66
rt.def("/datum/antagonist/traitor/proc/specialise", function* specialise(f: Frame) {
	this.silent = 1;
	if (this.owner.current && rt.istype(this.owner.current, T("/mob/living/silicon/ai"))) {
		yield* this.owner.add_antag_datum(this.ai_datum);
	} else {
		yield* this.owner.add_antag_datum(this.human_datum);
	}
	yield* this.on_removal();
	return f.dot;
}, true);

// datum_traitor.dm:73
rt.def("/datum/antagonist/traitor/proc/on_gain", function* on_gain(f: Frame) {
	if (this.should_specialise) {
		yield* this.specialise();
		return f.dot;
	}
	GLOB.SSticker.mode.traitors += this.owner;
	this.owner.special_role = this.special_role;
	if (this.give_objectives) {
		yield* this.forge_traitor_objectives();
	}
	yield* this.finalize_traitor();
	yield* parent_proc();
	return f.dot;
}, true);

// datum_traitor.dm:83
rt.def("/datum/antagonist/traitor/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	let traitor_mob: Value = null;
	if (this.owner.assigned_role != "Clown") return f.dot;
	if (!((traitor_mob = this.owner.current) && rt.istype(traitor_mob, T("/mob/living/carbon/human")))) return f.dot;
	if (!this.silent) {
		to_chat(traitor_mob, "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself.");
	}
	yield* traitor_mob.dna.remove_mutation("Clumsiness");
	return f.dot;
}, true);

// datum_traitor.dm:90
rt.def("/datum/antagonist/traitor/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	let traitor_mob: Value = null;
	if (this.owner.assigned_role != "Clown") return f.dot;
	if (!((traitor_mob = this.owner.current) && rt.istype(traitor_mob, T("/mob/living/carbon/human")))) return f.dot;
	yield* traitor_mob.dna.add_mutation("Clumsiness");
	return f.dot;
}, true);

// datum_traitor.dm:97
rt.def("/datum/antagonist/traitor/proc/on_removal", function* on_removal(f: Frame) {
	let O: Value = null;
	if (this.should_specialise) {
		return (yield* parent_proc());
	}
	GLOB.SSticker.mode.traitors -= this.owner;
	for (O of each(this.objectives_given)) {
		this.owner.objectives -= O;
	}
	this.objectives_given = list();
	if (!this.silent && this.owner.current) {
		to_chat(this.owner.current, `<span class='userdanger'> You are no longer the ${this.special_role}! </span>`);
	}
	this.owner.special_role = null;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(903, "/datum/antagonist/traitor/AI", "/datum/antagonist/traitor", {
	should_specialise: 0,
});

// datum_traitor.dm:108
rt.def("/datum/antagonist/traitor/AI/proc/on_removal", function* on_removal(f: Frame) {
	let A: Value = null;
	if (this.owner.current && rt.istype(this.owner.current, T("/mob/living/silicon/ai"))) {
		yield* (A = this.owner.current).set_zeroth_law("");
		A.verbs -= P("/mob/living/silicon/ai/proc/choose_modules");
		yield* A.malf_picker.remove_malf_verbs(A);
		yield* qdel(A.malf_picker);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// datum_traitor.dm:118
rt.def("/datum/antagonist/traitor/proc/add_objective", function add_objective(f: Frame, O: Value) {
	this.owner.objectives += O;
	this.objectives_given += O;
	return f.dot;
});

// datum_traitor.dm:121
rt.def("/datum/antagonist/traitor/proc/remove_objective", function remove_objective(f: Frame, O: Value) {
	this.owner.objectives -= O;
	this.objectives_given -= O;
	return f.dot;
});

rt.type(907, "/datum/antagonist/traitor/human", "/datum/antagonist/traitor", {
	should_equip: 1,
	should_specialise: 0,
});

// datum_traitor.dm:127
rt.def("/datum/antagonist/traitor/human/proc/forge_traitor_objectives", function* forge_traitor_objectives(f: Frame) {
	let hijack_objective: Value = null, O: Value = null, martyr_objective: Value = null, escape_objective: Value = null;
	let is_hijacker: Value = prob(10);
	let martyr_chance: Value = prob(20);
	let objective_count: Value = is_hijacker;
	if (!GLOB.SSticker.mode.exchange_blue && rt.len(f, GLOB.SSticker.mode.traitors) >= 8) {
		if (!GLOB.SSticker.mode.exchange_red) {
			GLOB.SSticker.mode.exchange_red = this.owner;
		} else {
			GLOB.SSticker.mode.exchange_blue = this.owner;
			yield* this.assign_exchange_role(GLOB.SSticker.mode.exchange_red);
			yield* this.assign_exchange_role(GLOB.SSticker.mode.exchange_blue);
		}
		objective_count += 1;
	}
	let i: Value = objective_count;
	while (i < GLOB.config.traitor_objectives_amount) {
		yield* this.forge_single_objective();
		i++;
	}
	if (is_hijacker && objective_count <= GLOB.config.traitor_objectives_amount) {
		if (!rt.locateIn(f, T("/datum/objective/hijack"), this.owner.objectives)) {
			(hijack_objective = (yield* new_(T("/datum/objective/hijack")))).owner = this.owner;
			this.add_objective(hijack_objective);
			return f.dot;
		}
	}
	let martyr_compatibility: Value = 1;
	for (O of each(this.owner.objectives, T("/datum/objective"))) {
		if (!O.martyr_compatible) {
			martyr_compatibility = 0;
			break;
		}
	}
	if (martyr_compatibility && martyr_chance) {
		(martyr_objective = (yield* new_(T("/datum/objective/martyr")))).owner = this.owner;
		this.add_objective(martyr_objective);
		return f.dot;
	} else {
		if (rt.locateIn(f, T("/datum/objective/escape"), this.owner.objectives)) return f.dot;
		(escape_objective = (yield* new_(T("/datum/objective/escape")))).owner = this.owner;
		this.add_objective(escape_objective);
		return f.dot;
	}
}, true);

// datum_traitor.dm:171
rt.def("/datum/antagonist/traitor/AI/proc/forge_traitor_objectives", function forge_traitor_objectives(f: Frame) {
	let kill_objective: Value = null, survive_objective: Value = null;
	let objective_count: Value = 0;
	if (prob(30)) {
		objective_count += this.forge_single_objective();
	}
	let i: Value = objective_count;
	while (i < GLOB.config.traitor_objectives_amount) {
		(kill_objective = new_(T("/datum/objective/assassinate"))).owner = this.owner;
		kill_objective.find_target();
		this.add_objective(kill_objective);
		i++;
	}
	(survive_objective = new_(T("/datum/objective/survive"))).owner = this.owner;
	this.add_objective(survive_objective);
	return f.dot;
});

// datum_traitor.dm:187
rt.def("/datum/antagonist/traitor/human/proc/forge_single_objective", function* forge_single_objective(f: Frame) {
	let active_ais: Value = null, destroy_objective: Value = null, maroon_objective: Value = null, kill_objective: Value = null, steal_objective: Value = null;
	f.dot = 1;
	if (prob(50)) {
		if (rt.len(f, (active_ais = (yield* g.call(f, P("/proc/active_ais"), null, [])))) && prob(100 / rt.len(f, GLOB.joined_player_list))) {
			(destroy_objective = (yield* new_(T("/datum/objective/destroy")))).owner = this.owner;
			yield* destroy_objective.find_target();
			this.add_objective(destroy_objective);
		} else if (prob(30)) {
			(maroon_objective = (yield* new_(T("/datum/objective/maroon")))).owner = this.owner;
			yield* maroon_objective.find_target();
			this.add_objective(maroon_objective);
		} else {
			(kill_objective = (yield* new_(T("/datum/objective/assassinate")))).owner = this.owner;
			yield* kill_objective.find_target();
			this.add_objective(kill_objective);
		}
	} else {
		(steal_objective = (yield* new_(T("/datum/objective/steal")))).owner = this.owner;
		yield* steal_objective.find_target();
		this.add_objective(steal_objective);
	}
	return f.dot;
}, true);

// datum_traitor.dm:212
rt.def("/datum/antagonist/traitor/AI/proc/forge_single_objective", function forge_single_objective(f: Frame) {
	let special_pick: Value = null, block_objective: Value = null, purge_objective: Value = null, robot_objective: Value = null, yandere_one: Value = null, yandere_two: Value = null;
	f.dot = 1;
	const subject = (special_pick = rand(1, 4));
	if (subject === 1) {
		(block_objective = new_(T("/datum/objective/block"))).owner = this.owner;
		this.add_objective(block_objective);
	} else if (subject === 2) {
		(purge_objective = new_(T("/datum/objective/purge"))).owner = this.owner;
		this.add_objective(purge_objective);
	} else if (subject === 3) {
		(robot_objective = new_(T("/datum/objective/robot_army"))).owner = this.owner;
		this.add_objective(robot_objective);
	} else if (subject === 4) {
		(yandere_one = new_(T("/datum/objective/protect"))).owner = this.owner;
		this.add_objective(yandere_one);
		yandere_one.find_target();
		(yandere_two = new_(T("/datum/objective/maroon"))).owner = this.owner;
		yandere_two.target = yandere_one.target;
		yandere_two.update_explanation_text();
		this.add_objective(yandere_two);
		f.dot = 2;
	}
	return f.dot;
});

// datum_traitor.dm:238
rt.def("/datum/antagonist/traitor/proc/greet", function greet(f: Frame) {
	to_chat(this.owner.current, `<B><font size=3 color=red>You are the ${this.owner.special_role}.</font></B>`);
	this.owner.announce_objectives();
	if (!this.should_give_codewords) return f.dot;
	this.give_codewords();
	return f.dot;
});

// datum_traitor.dm:244
rt.def("/datum/antagonist/traitor/proc/finalize_traitor", function finalize_traitor(f: Frame) {
	GLOB.SSticker.mode.update_traitor_icons_added(this.owner);
	return f.dot;
});

// datum_traitor.dm:248
rt.def("/datum/antagonist/traitor/AI/proc/finalize_traitor", function* finalize_traitor(f: Frame) {
	yield* parent_proc();
	yield* this.add_law_zero();
	yield* this.owner.current.playsound_local(rt.getStep(f, this.owner.current, 0), rt.rsc("sound/ambience/antag/malf.ogg"), 100, 0, { pressure_affected: 0 });
	yield* this.owner.current.grant_language(T("/datum/language/codespeak"));
	return f.dot;
}, true);

// datum_traitor.dm:254
rt.def("/datum/antagonist/traitor/human/proc/finalize_traitor", function* finalize_traitor(f: Frame) {
	yield* parent_proc();
	if (this.should_equip) {
		yield* this.equip(this.silent);
	}
	yield* this.owner.current.playsound_local(rt.getStep(f, this.owner.current, 0), rt.rsc("sound/ambience/antag/tatoralert.ogg"), 100, 0, { pressure_affected: 0 });
	return f.dot;
}, true);

// datum_traitor.dm:260
rt.def("/datum/antagonist/traitor/proc/give_codewords", function give_codewords(f: Frame) {
	let traitor_mob: Value = null;
	if (!this.owner.current) {
		return f.dot;
	}
	to_chat((traitor_mob = this.owner.current), "<U><B>The Syndicate provided you with the following information on how to identify their agents:</B></U>");
	to_chat(traitor_mob, `<B>Code Phrase</B>: <span class='danger'>${GLOB.syndicate_code_phrase}</span>`);
	to_chat(traitor_mob, `<B>Code Response</B>: <span class='danger'>${GLOB.syndicate_code_response}</span>`);
	traitor_mob.mind.store_memory(`<b>Code Phrase</b>: ${GLOB.syndicate_code_phrase}`);
	traitor_mob.mind.store_memory(`<b>Code Response</b>: ${GLOB.syndicate_code_response}`);
	to_chat(traitor_mob, "Use the code words in the order provided, during regular conversation, to identify other agents. Proceed with caution, however, as everyone is a potential foe.");
	return f.dot;
});

// datum_traitor.dm:275
rt.def("/datum/antagonist/traitor/AI/proc/add_law_zero", function* add_law_zero(f: Frame) {
	let killer: Value = null;
	if (!(killer = this.owner.current) || !rt.istype(killer, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	let law: Value = "Accomplish your objectives at all costs.";
	let law_borg: Value = "Accomplish your AI's objectives at all costs.";
	yield* killer.set_zeroth_law(law, law_borg);
	yield* killer.set_syndie_radio();
	to_chat(killer, "Your radio has been upgraded! Use :t to speak on an encrypted channel with Syndicate Agents!");
	yield* killer.add_malf_picker();
	return f.dot;
}, true);

// datum_traitor.dm:286
rt.def("/datum/antagonist/traitor/human/proc/equip", function* equip(f: Frame, silent: Value) {
	silent ??= 0;
	yield* this.owner.equip_traitor(this.employer, silent);
	return f.dot;
}, true);

// datum_traitor.dm:290
rt.def("/datum/antagonist/traitor/human/proc/assign_exchange_role", function* assign_exchange_role(f: Frame) {
	let exchange_objective: Value = null, backstab_objective: Value = null, folder: Value = null, equipped_slot: Value = null;
	let faction: Value = "red";
	if (this.owner == GLOB.SSticker.mode.exchange_blue) {
		faction = "blue";
	}
	let $0: any = (exchange_objective = (yield* new_(T("/datum/objective/steal/exchange"))));
	let $1: any = faction;
	$0.set_faction($1, faction == "red" ? GLOB.SSticker.mode.exchange_blue : GLOB.SSticker.mode.exchange_red);
	exchange_objective.owner = this.owner;
	this.add_objective(exchange_objective);
	if (prob(20)) {
		(backstab_objective = (yield* new_(T("/datum/objective/steal/exchange/backstab")))).set_faction(faction);
		backstab_objective.owner = this.owner;
		this.add_objective(backstab_objective);
	}
	let mob: Value = this.owner.current;
	if (this.owner == GLOB.SSticker.mode.exchange_red) {
		folder = (yield* new_(T("/obj/item/weapon/folder/syndicate/red"), mob.loc));
	} else {
		folder = (yield* new_(T("/obj/item/weapon/folder/syndicate/blue"), mob.loc));
	}
	let slots: Value = rt.alist(f, ["backpack", slot_in_backpack, "left pocket", slot_l_store, "right pocket", slot_r_store]);
	let where: Value = "At your feet";
	if (equipped_slot = (yield* mob.equip_in_one_of_slots(folder, slots))) {
		where = `In your ${equipped_slot}`;
	}
	to_chat(mob, `<BR><BR><span class='info'>${where} is a folder containing <b>secret documents</b> that another Syndicate group wants. We have set up a meeting with one of their agents on station to make an exchange. Exercise extreme caution as they cannot be trusted and may be hostile.</span><BR>`);
	return f.dot;
}, true);
