// Based on /tg/station's code/game/gamemodes/wizard/wizard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(1100, "/datum/game_mode/wizard", "/datum/game_mode", {
	use_huds: 0,
	finished: 0,
	name: "wizard",
	config_tag: "wizard",
	antag_flag: "wizard",
	required_players: 20,
	required_enemies: 1,
	recommended_enemies: 1,
	round_ends_with_antag_death: 1,
	announce_span: "danger",
	announce_text: "There is a space wizard attacking the station!\n<span class='danger'>Wizard</span>: Accomplish your objectives and cause mayhem on the station.\n<span class='notice'>Crew</span>: Eliminate the wizard before they can succeed!",
});

// wizard.dm:23
rt.def("/datum/game_mode/wizard/proc/pre_setup", function pre_setup(f: Frame) {
	let wizard: Value = null, wiz: Value = null;
	this.wizards += (wizard = pick(this.antag_candidates));
	this.modePlayer += wizard;
	wizard.assigned_role = "Wizard";
	wizard.special_role = "Wizard";
	if (rt.len(f, GLOB.wizardstart) == 0) {
		to_chat(wizard.current, "<span class='boldannounce'>A starting location for you could not be found, please report this bug!</span>");
		return 0;
	}
	for (wiz of each(this.wizards, T("/datum/mind"))) {
		wiz.current.loc = pick(GLOB.wizardstart);
	}
	return 1;
});

// wizard.dm:38
rt.def("/datum/game_mode/wizard/proc/post_setup", function* post_setup(f: Frame) {
	let wizard: Value = null;
	for (wizard of each(this.wizards, T("/datum/mind"))) {
		log_game(`${wizard.key} (ckey) has been selected as a Wizard`);
		yield* this.equip_wizard(wizard.current);
		yield* this.forge_wizard_objectives(wizard);
		if (this.use_huds) {
			this.update_wiz_icons_added(wizard);
		}
		this.greet_wizard(wizard);
		this.name_wizard(wizard.current);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// wizard.dm:51
rt.def("/datum/game_mode/proc/forge_wizard_objectives", function* forge_wizard_objectives(f: Frame, wizard: Value) {
	let hijack_objective: Value = null, kill_objective: Value = null, escape_objective: Value = null, steal_objective: Value = null, steal_objective_1: Value = null, survive_objective: Value = null;
	const die = rand(1, 100);
	if (rt.inRange(die, 1, 30)) {
		(kill_objective = (yield* new_(T("/datum/objective/assassinate")))).owner = wizard;
		yield* kill_objective.find_target();
		wizard.objectives += kill_objective;
		if (!rt.locateIn(f, T("/datum/objective/escape"), wizard.objectives)) {
			(escape_objective = (yield* new_(T("/datum/objective/escape")))).owner = wizard;
			wizard.objectives += escape_objective;
		}
	} else if (rt.inRange(die, 31, 60)) {
		(steal_objective = (yield* new_(T("/datum/objective/steal")))).owner = wizard;
		yield* steal_objective.find_target();
		wizard.objectives += steal_objective;
		if (!rt.locateIn(f, T("/datum/objective/escape"), wizard.objectives)) {
			(escape_objective = (yield* new_(T("/datum/objective/escape")))).owner = wizard;
			wizard.objectives += escape_objective;
		}
	} else if (rt.inRange(die, 61, 85)) {
		(kill_objective = (yield* new_(T("/datum/objective/assassinate")))).owner = wizard;
		yield* kill_objective.find_target();
		wizard.objectives += kill_objective;
		(steal_objective_1 = (yield* new_(T("/datum/objective/steal")))).owner = wizard;
		yield* steal_objective_1.find_target();
		wizard.objectives += steal_objective_1;
		if (!rt.locateIn(f, T("/datum/objective/survive"), wizard.objectives)) {
			(survive_objective = (yield* new_(T("/datum/objective/survive")))).owner = wizard;
			wizard.objectives += survive_objective;
		}
	} else if (!rt.locateIn(f, T("/datum/objective/hijack"), wizard.objectives)) {
		(hijack_objective = (yield* new_(T("/datum/objective/hijack")))).owner = wizard;
		wizard.objectives += hijack_objective;
	}
	return f.dot;
}, true);

// wizard.dm:100
rt.def("/datum/game_mode/proc/name_wizard", function name_wizard(f: Frame, wizard_mob: Value) {
	let newname: Value = null;
	let wizard_name_first: Value = pick(GLOB.wizard_first);
	let wizard_name_second: Value = pick(GLOB.wizard_second);
	let randomname: Value = `${wizard_name_first} ${wizard_name_second}`;
	rt.spawnTail(f, 0, "/datum/game_mode/proc/name_wizard: spawn at game/gamemodes/wizard/wizard.dm:103", wizard_mob, wizard_name_first, wizard_name_second, randomname, newname);
	return f.dot;
});

// a spawn(0) body of /datum/game_mode/proc/name_wizard, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/proc/name_wizard: spawn at game/gamemodes/wizard/wizard.dm:103", function* (f: Frame, wizard_mob: Value, wizard_name_first: Value, wizard_name_second: Value, randomname: Value, newname: Value) {
	if (!(newname = copytext(sanitize((yield* g.op(f, "Prompt", [3], [randomname, "Name change", "You are the Space Wizard. Would you like to change your name to something else?", wizard_mob, null]))), 1, 42))) {
		newname = randomname;
	}
	wizard_mob.real_name = newname;
	wizard_mob.name = newname;
	if (wizard_mob.mind) {
		wizard_mob.mind.name = newname;
	}
	if (wizard_mob.age < 30) {
		wizard_mob.age = 30;
	}
	return null;
});

// wizard.dm:122
rt.def("/datum/game_mode/proc/greet_wizard", function greet_wizard(f: Frame, wizard: Value, you_are: Value) {
	you_are ??= 1;
	if (you_are) {
		to_chat(wizard.current, "<span class='boldannounce'>You are the Space Wizard!</span>");
	}
	to_chat(wizard.current, "<B>The Space Wizards Federation has given you the following tasks:</B>");
	wizard.announce_objectives();
	return f.dot;
});

// wizard.dm:137
rt.def("/datum/game_mode/proc/equip_wizard", function* equip_wizard(f: Frame, wizard_mob: Value) {
	let I: Value = null, spellbook: Value = null;
	if (!rt.istype(wizard_mob, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	yield* qdel(wizard_mob.wear_suit);
	yield* qdel(wizard_mob.head);
	yield* qdel(wizard_mob.shoes);
	for (I of each(wizard_mob.held_items, T("/obj/item"))) {
		yield* qdel(I);
	}
	yield* qdel(wizard_mob.r_store);
	yield* qdel(wizard_mob.l_store);
	yield* wizard_mob.set_species(T("/datum/species/human"));
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), wizard_mob)), slot_ears);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/lightpurple"), wizard_mob)), slot_w_uniform);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal/magic"), wizard_mob)), slot_shoes);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/wizrobe"), wizard_mob)), slot_wear_suit);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/wizard"), wizard_mob)), slot_head);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/backpack"), wizard_mob)), slot_back);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/box/survival"), wizard_mob)), slot_in_backpack);
	yield* wizard_mob.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/teleportation_scroll"), wizard_mob)), slot_r_store);
	(spellbook = (yield* new_(T("/obj/item/weapon/spellbook"), wizard_mob))).owner = wizard_mob;
	yield* wizard_mob.put_in_hands_or_del(spellbook);
	to_chat(wizard_mob, "You will find a list of available spells in your spell book. Choose your magic arsenal carefully.");
	to_chat(wizard_mob, "The spellbook is bound to you, and others cannot use it.");
	to_chat(wizard_mob, "In your pockets you will find a teleport scroll. Use it as needed.");
	wizard_mob.mind.store_memory("<B>Remember:</B> do not forget to prepare your spells.");
	return 1;
}, true);

// wizard.dm:171
rt.def("/datum/game_mode/wizard/proc/check_finished", function* check_finished(f: Frame) {
	let wizard: Value = null;
	for (wizard of each(this.wizards, T("/datum/mind"))) {
		if (rt.istype(wizard.current, T("/mob/living")) && wizard.current.stat != 2) {
			return (yield* parent_proc());
		}
	}
	if (GLOB.SSevents.wizardmode) {
		GLOB.SSevents.toggleWizardmode();
		GLOB.SSevents.resetFrequency();
	}
	return (yield* parent_proc());
}, true);

// wizard.dm:183
rt.def("/datum/game_mode/wizard/proc/declare_completion", function declare_completion(f: Frame) {
	let $0: any, $1: any;
	if (this.finished) {
		GLOB.SSticker.mode_result = "loss - wizard killed";
		$0 = rt.world();
		if (rt.len(f, this.wizards) > 1) {
			$1 = "s";
		} else {
			$1 = "";
		}
		to_chat($0, `<span class='userdanger'>The wizard${$1} has been killed by the crew! The Space Wizards Federation has been taught a lesson they will not soon forget!</span>`);
		GLOB.SSticker.news_report = WIZARD_KILLED;
	}
	parent_proc();
	return 1;
});

// wizard.dm:193
rt.def("/datum/game_mode/proc/auto_declare_completion_wizard", function auto_declare_completion_wizard(f: Frame) {
	let text: Value = null, wizard: Value = null, count: Value = null, wizardwin: Value = null, objective: Value = null, i: Value = null, S: Value = null;
	if (rt.len(f, this.wizards)) {
		text = "<br><font size=3><b>the wizards/witches were:</b></font>";
		for (wizard of each(this.wizards, T("/datum/mind"))) {
			text += `<br><b>${wizard.key}</b> was <b>${wizard.name}</b> (`;
			if (wizard.current) {
				if (wizard.current.stat == 2) {
					text += "died";
				} else {
					text += "survived";
				}
				if (wizard.current.real_name != wizard.name) {
					text += ` as <b>${wizard.current.real_name}</b>`;
				}
			} else {
				text += "body destroyed";
			}
			text += ")";
			count = 1;
			wizardwin = 1;
			objective = null;
			for (objective of each(wizard.objectives, T("/datum/objective"))) {
				if (objective.check_completion()) {
					text += `<br><B>Objective #${count}</B>: ${objective.explanation_text} <font color='green'><B>Success!</B></font>`;
				} else {
					text += `<br><B>Objective #${count}</B>: ${objective.explanation_text} <font color='red'>Fail.</font>`;
					wizardwin = 0;
				}
				count++;
			}
			if (wizard.current && wizard.current.stat != 2 && wizardwin) {
				text += "<br><font color='green'><B>The wizard was successful!</B></font>";
			} else {
				text += "<br><font color='red'><B>The wizard has failed!</B></font>";
			}
			if (rt.len(f, wizard.spell_list) > 0) {
				text += `<br><B>${wizard.name} used the following spells: </B>`;
				i = 1;
				S = null;
				for (S of each(wizard.spell_list, T("/obj/effect/proc_holder/spell"))) {
					text += `${S.name}`;
					if (rt.len(f, wizard.spell_list) > i) {
						text += ", ";
					}
					i++;
				}
			}
			text += "<br>";
		}
		to_chat(rt.world(), text);
	}
	return 1;
});

// wizard.dm:245
rt.def("/mob/proc/spellremove", function* spellremove(f: Frame, M: Value) {
	let X: Value = null, spell_to_remove: Value = null;
	if (!this.mind) {
		return f.dot;
	}
	for (X of each(this.mind.spell_list)) {
		yield* qdel((spell_to_remove = X));
		this.mind.spell_list -= spell_to_remove;
	}
	return f.dot;
}, true);

// wizard.dm:254
rt.def("/proc/iswizard", function iswizard(f: Frame, M: Value) {
	return (((((rt.istype(M, T("/mob/living")) ? 1 : 0) && M.mind) && GLOB.SSticker) && GLOB.SSticker.mode) && ((rt.isIn(f, M.mind, GLOB.SSticker.mode.wizards) ? 1 : 0) || (rt.isIn(f, M.mind, GLOB.SSticker.mode.apprentices) ? 1 : 0)));
});

// wizard.dm:258
rt.def("/datum/game_mode/proc/update_wiz_icons_added", function update_wiz_icons_added(f: Frame, wiz_mind: Value) {
	let wizhud: Value = null;
	(wizhud = rt.index(GLOB.huds, ANTAG_HUD_WIZ)).join_hud(wiz_mind.current);
	let $0: any = wiz_mind.current;
	this.set_antag_hud($0, rt.isIn(f, wiz_mind, this.wizards) ? "wizard" : "apprentice");
	return f.dot;
});

// wizard.dm:263
rt.def("/datum/game_mode/proc/update_wiz_icons_removed", function update_wiz_icons_removed(f: Frame, wiz_mind: Value) {
	let wizhud: Value = null;
	(wizhud = rt.index(GLOB.huds, ANTAG_HUD_WIZ)).leave_hud(wiz_mind.current);
	this.set_antag_hud(wiz_mind.current, null);
	return f.dot;
});
