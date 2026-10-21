// From code/game/gamemodes/wizard/wizard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/game_mode/wizard/proc/pre_setup  (code/game/gamemodes/wizard/wizard.dm:23)
rt.def("/datum/game_mode/wizard/proc/pre_setup", function pre_setup(f: Frame) {
	let wizard: Value = null, wiz: Value = null;
	let $e: any;
	f.vars = () => [wizard, wiz, $e];
	rt.modSrcVar(f, "wizards", (wizard = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
	rt.modSrcVar(f, "modePlayer", live(wizard), add);
	rt.setFv(f, "assigned_role", live(wizard), "Wizard");
	rt.setFv(f, "special_role", live(wizard), "Wizard");
	if (isEqual(rt.len(f, rt.gl("wizardstart")), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(wizard)), "<span class='boldannounce'>A starting location for you could not be found, please report this bug!</span>"]);
		return 0;
	}
	wiz = null;
	rt.forList(f, 0, rt.sv(f, "wizards"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		wiz = $e;
		rt.setFv(f, "loc", rt.fv(f, "current", live(wiz)), rt.op(f, "PickUnweighted", [1], [rt.gl("wizardstart")]));
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/game_mode/wizard/proc/post_setup  (code/game/gamemodes/wizard/wizard.dm:38)  may sleep
rt.def("/datum/game_mode/wizard/proc/post_setup", function* post_setup(f: Frame) {
	let wizard: Value = null;
	let $e: any;
	f.vars = () => [wizard, $e];
	wizard = null;
	rt.forList(f, 0, rt.sv(f, "wizards"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		wizard = $e;
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a Wizard", [rt.fv(f, "key", live(wizard))])]);
		yield* g.srcCall(f, "equip_wizard", rt.fv(f, "current", live(wizard)));
		yield* g.srcCall(f, "forge_wizard_objectives", live(wizard));
		if (truthy(rt.sv(f, "use_huds"))) {
			yield* g.srcCall(f, "update_wiz_icons_added", live(wizard));
		}
		yield* g.srcCall(f, "greet_wizard", live(wizard));
		yield* g.srcCall(f, "name_wizard", rt.fv(f, "current", live(wizard)));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

// /datum/game_mode/proc/forge_wizard_objectives  (code/game/gamemodes/wizard/wizard.dm:51)  may sleep
rt.def("/datum/game_mode/proc/forge_wizard_objectives", function* forge_wizard_objectives(f: Frame, wizard: Value) {
	let hijack_objective: Value = null, kill_objective: Value = null, escape_objective: Value = null, steal_objective: Value = null, steal_objective_1: Value = null, survive_objective: Value = null;
	let $0: any;
	f.vars = () => [wizard, hijack_objective, kill_objective, escape_objective, steal_objective, steal_objective_1, survive_objective, $0];
	$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 100]));
	if (rt.inRange($0, 1, 30)) {
		rt.setFv(f, "owner", (kill_objective = (yield* g.new_(f, T("/datum/objective/assassinate"), []))), live(wizard));
		yield* g.callName(f, live(kill_objective), "find_target", []);
		rt.modField(f, live(wizard), "objectives", live(kill_objective), add);
		if (!truthy(rt.locateIn(f, T("/datum/objective/escape"), rt.fv(f, "objectives", live(wizard))))) {
			rt.setFv(f, "owner", (escape_objective = (yield* g.new_(f, T("/datum/objective/escape"), []))), live(wizard));
			rt.modField(f, live(wizard), "objectives", live(escape_objective), add);
		}
	} else if (rt.inRange($0, 31, 60)) {
		rt.setFv(f, "owner", (steal_objective = (yield* g.new_(f, T("/datum/objective/steal"), []))), live(wizard));
		yield* g.callName(f, live(steal_objective), "find_target", []);
		rt.modField(f, live(wizard), "objectives", live(steal_objective), add);
		if (!truthy(rt.locateIn(f, T("/datum/objective/escape"), rt.fv(f, "objectives", live(wizard))))) {
			rt.setFv(f, "owner", (escape_objective = (yield* g.new_(f, T("/datum/objective/escape"), []))), live(wizard));
			rt.modField(f, live(wizard), "objectives", live(escape_objective), add);
		}
	} else if (rt.inRange($0, 61, 85)) {
		rt.setFv(f, "owner", (kill_objective = (yield* g.new_(f, T("/datum/objective/assassinate"), []))), live(wizard));
		yield* g.callName(f, live(kill_objective), "find_target", []);
		rt.modField(f, live(wizard), "objectives", live(kill_objective), add);
		rt.setFv(f, "owner", (steal_objective_1 = (yield* g.new_(f, T("/datum/objective/steal"), []))), live(wizard));
		yield* g.callName(f, live(steal_objective_1), "find_target", []);
		rt.modField(f, live(wizard), "objectives", live(steal_objective_1), add);
		if (!truthy(rt.locateIn(f, T("/datum/objective/survive"), rt.fv(f, "objectives", live(wizard))))) {
			rt.setFv(f, "owner", (survive_objective = (yield* g.new_(f, T("/datum/objective/survive"), []))), live(wizard));
			rt.modField(f, live(wizard), "objectives", live(survive_objective), add);
		}
	} else {
		if (!truthy(rt.locateIn(f, T("/datum/objective/hijack"), rt.fv(f, "objectives", live(wizard))))) {
			rt.setFv(f, "owner", (hijack_objective = (yield* g.new_(f, T("/datum/objective/hijack"), []))), live(wizard));
			rt.modField(f, live(wizard), "objectives", live(hijack_objective), add);
		}
	}
	return live(f.dot);
}, true);

// /datum/game_mode/proc/name_wizard  (code/game/gamemodes/wizard/wizard.dm:100)
rt.def("/datum/game_mode/proc/name_wizard", function name_wizard(f: Frame, wizard_mob: Value) {
	let wizard_name_first: Value = null, wizard_name_second: Value = null, randomname: Value = null, newname: Value = null;
	f.vars = () => [wizard_name_first, wizard_name_second, randomname, newname];
	wizard_name_first = rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_first")]);
	wizard_name_second = rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_second")]);
	randomname = fmt("＀ ＀", [live(wizard_name_first), live(wizard_name_second)]);
	rt.spawnTail(f, 0, "/datum/game_mode/proc/name_wizard: spawn at game/gamemodes/wizard/wizard.dm:103", wizard_mob, wizard_name_first, wizard_name_second, randomname, newname);
	return live(f.dot);
});

// a spawn(0) body of /datum/game_mode/proc/name_wizard, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/proc/name_wizard: spawn at game/gamemodes/wizard/wizard.dm:103", function* (f: Frame, wizard_mob: Value, wizard_name_first: Value, wizard_name_second: Value, randomname: Value, newname: Value) {
	f.vars = () => [wizard_mob, wizard_name_first, wizard_name_second, randomname, newname];
	if (!truthy((newname = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [live(randomname), "Name change", "You are the Space Wizard. Would you like to change your name to something else?", live(wizard_mob), null]))])), 1, 42]))))) {
		newname = live(randomname);
	}
	rt.setFv(f, "real_name", live(wizard_mob), live(newname));
	rt.setFv(f, "name", live(wizard_mob), live(newname));
	if (truthy(rt.fv(f, "mind", live(wizard_mob)))) {
		rt.setFv(f, "name", rt.fv(f, "mind", live(wizard_mob)), live(newname));
	}
	if (rt.lt(rt.fv(f, "age", live(wizard_mob)), 30)) {
		rt.setFv(f, "age", live(wizard_mob), 30);
	}
	return null;
});

// /datum/game_mode/proc/greet_wizard  (code/game/gamemodes/wizard/wizard.dm:122)
rt.def("/datum/game_mode/proc/greet_wizard", function greet_wizard(f: Frame, wizard: Value, you_are: Value) {
	f.vars = () => [you_are];
	if (live(you_are) === null) {
		you_are = 1;
	}
	if (truthy(live(you_are))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(wizard)), "<span class='boldannounce'>You are the Space Wizard!</span>"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(wizard)), "<B>The Space Wizards Federation has given you the following tasks:</B>"]);
	rt.callName(f, live(wizard), "announce_objectives", []);
	return live(f.dot);
});

// /datum/game_mode/proc/learn_basic_spells  (code/game/gamemodes/wizard/wizard.dm:130)  may sleep
rt.def("/datum/game_mode/proc/learn_basic_spells", function* learn_basic_spells(f: Frame, wizard_mob: Value) {
	f.vars = () => [wizard_mob];
	if ((!truthy((rt.istype(live(wizard_mob), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(wizard_mob))))) {
		return 0;
	}
	yield* g.callName(f, rt.fv(f, "mind", live(wizard_mob)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"), [null]))]);
	yield* g.callName(f, rt.fv(f, "mind", live(wizard_mob)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"), [null]))]);
	return f.dot;
}, true);

// /datum/game_mode/proc/equip_wizard  (code/game/gamemodes/wizard/wizard.dm:137)  may sleep
rt.def("/datum/game_mode/proc/equip_wizard", function* equip_wizard(f: Frame, wizard_mob: Value) {
	let I: Value = null, spellbook: Value = null;
	let $e: any;
	f.vars = () => [wizard_mob, I, spellbook, $e];
	if (!truthy((rt.istype(live(wizard_mob), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_suit", live(wizard_mob))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "head", live(wizard_mob))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "shoes", live(wizard_mob))]);
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(wizard_mob)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "r_store", live(wizard_mob))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "l_store", live(wizard_mob))]);
	yield* g.callName(f, live(wizard_mob), "set_species", [T("/datum/species/human")]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(wizard_mob)])), 7]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/lightpurple"), [live(wizard_mob)])), 14]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal/magic"), [live(wizard_mob)])), 12]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe"), [live(wizard_mob)])), 13]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/wizard"), [live(wizard_mob)])), 11]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/backpack"), [live(wizard_mob)])), 1]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/box/survival"), [live(wizard_mob)])), 18]);
	yield* g.callName(f, live(wizard_mob), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/teleportation_scroll"), [live(wizard_mob)])), 16]);
	rt.setFv(f, "owner", (spellbook = (yield* g.new_(f, T("/obj/item/weapon/spellbook"), [live(wizard_mob)]))), live(wizard_mob));
	yield* g.callName(f, live(wizard_mob), "put_in_hands_or_del", [live(spellbook)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(wizard_mob), "You will find a list of available spells in your spell book. Choose your magic arsenal carefully."]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(wizard_mob), "The spellbook is bound to you, and others cannot use it."]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(wizard_mob), "In your pockets you will find a teleport scroll. Use it as needed."]);
	yield* g.callName(f, rt.fv(f, "mind", live(wizard_mob)), "store_memory", ["<B>Remember:</B> do not forget to prepare your spells."]);
	return 1;
}, true);

// /datum/game_mode/wizard/proc/check_finished  (code/game/gamemodes/wizard/wizard.dm:171)  may sleep
rt.def("/datum/game_mode/wizard/proc/check_finished", function* check_finished(f: Frame) {
	let wizard: Value = null;
	let $e: any;
	f.vars = () => [wizard, $e];
	wizard = null;
	rt.forList(f, 0, rt.sv(f, "wizards"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		wizard = $e;
		if ((truthy((rt.istype(rt.fv(f, "current", live(wizard)), T("/mob/living")) ? 1 : 0)) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(wizard))), 2))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "wizardmode", rt.gl("SSevents")))) {
		yield* g.callName(f, rt.gl("SSevents"), "toggleWizardmode", []);
		yield* g.callName(f, rt.gl("SSevents"), "resetFrequency", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/game_mode/wizard/proc/declare_completion  (code/game/gamemodes/wizard/wizard.dm:183)
rt.def("/datum/game_mode/wizard/proc/declare_completion", function declare_completion(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.sv(f, "finished"))) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - wizard killed");
		$0 = rt.world();
		if (rt.gt(rt.len(f, rt.sv(f, "wizards")), 1)) {
			$1 = "s";
		} else {
			$1 = "";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='userdanger'>The wizard＀ has been killed by the crew! The Space Wizards Federation has been taught a lesson they will not soon forget!</span>", [$1])]);
		rt.setFv(f, "news_report", rt.gl("SSticker"), 19);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
});

// /datum/game_mode/proc/auto_declare_completion_wizard  (code/game/gamemodes/wizard/wizard.dm:193)
rt.def("/datum/game_mode/proc/auto_declare_completion_wizard", function auto_declare_completion_wizard(f: Frame) {
	let text: Value = null, wizard: Value = null, count: Value = null, wizardwin: Value = null, objective: Value = null, i: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [text, wizard, count, wizardwin, objective, i, S, $e];
	if (truthy(rt.len(f, rt.sv(f, "wizards")))) {
		text = "<br><font size=3><b>the wizards/witches were:</b></font>";
		wizard = null;
		rt.forList(f, 0, rt.sv(f, "wizards"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			wizard = $e;
			text = rt.modify(live(text), fmt("<br><b>＀</b> was <b>＀</b> (", [rt.fv(f, "key", live(wizard)), rt.fv(f, "name", live(wizard))]), add);
			if (truthy(rt.fv(f, "current", live(wizard)))) {
				if (isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(wizard))), 2)) {
					text = rt.modify(live(text), "died", add);
				} else {
					text = rt.modify(live(text), "survived", add);
				}
				if (!isEqual(rt.gv(f, "real_name", rt.fv(f, "current", live(wizard))), rt.fv(f, "name", live(wizard)))) {
					text = rt.modify(live(text), fmt(" as <b>＀</b>", [rt.gv(f, "real_name", rt.fv(f, "current", live(wizard)))]), add);
				}
			} else {
				text = rt.modify(live(text), "body destroyed", add);
			}
			text = rt.modify(live(text), ")", add);
			count = 1;
			wizardwin = 1;
			objective = null;
			rt.forList(f, 1, rt.fv(f, "objectives", live(wizard)), T("/datum/objective"));
			while (($e = rt.next(f, 1)) !== undefined) {
				objective = $e;
				if (truthy(rt.callName(f, live(objective), "check_completion", []))) {
					text = rt.modify(live(text), fmt("<br><B>Objective #＀</B>: ＀ <font color='green'><B>Success!</B></font>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
				} else {
					text = rt.modify(live(text), fmt("<br><B>Objective #＀</B>: ＀ <font color='red'>Fail.</font>", [live(count), rt.fv(f, "explanation_text", live(objective))]), add);
					wizardwin = 0;
				}
				count = rt.inc(live(count), 1);
			}
			rt.endFor(f, 1);
			if (((truthy(rt.fv(f, "current", live(wizard))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(wizard))), 2)) && truthy(live(wizardwin)))) {
				text = rt.modify(live(text), "<br><font color='green'><B>The wizard was successful!</B></font>", add);
			} else {
				text = rt.modify(live(text), "<br><font color='red'><B>The wizard has failed!</B></font>", add);
			}
			if (rt.gt(rt.getLen(f, rt.fv(f, "spell_list", live(wizard))), 0)) {
				text = rt.modify(live(text), fmt("<br><B>＀ used the following spells: </B>", [rt.fv(f, "name", live(wizard))]), add);
				i = 1;
				S = null;
				rt.forList(f, 1, rt.fv(f, "spell_list", live(wizard)), T("/obj/effect/proc_holder/spell"));
				while (($e = rt.next(f, 1)) !== undefined) {
					S = $e;
					text = rt.modify(live(text), fmt("＀", [rt.fv(f, "name", live(S))]), add);
					if (rt.gt(rt.getLen(f, rt.fv(f, "spell_list", live(wizard))), live(i))) {
						text = rt.modify(live(text), ", ", add);
					}
					i = rt.inc(live(i), 1);
				}
				rt.endFor(f, 1);
			}
			text = rt.modify(live(text), "<br>", add);
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	return 1;
});

// /mob/proc/spellremove  (code/game/gamemodes/wizard/wizard.dm:245)  may sleep
rt.def("/mob/proc/spellremove", function* spellremove(f: Frame, M: Value) {
	let X: Value = null, spell_to_remove: Value = null;
	let $e: any;
	f.vars = () => [M, X, spell_to_remove, $e];
	if (!truthy(rt.sv(f, "mind"))) {
		return live(f.dot);
	}
	X = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(f.src))));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.call(f, P("/proc/qdel"), null, [(spell_to_remove = live(X))]);
		(rt.modField(f, rt.sv(f, "mind"), "spell_list", live(spell_to_remove), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/iswizard  (code/game/gamemodes/wizard/wizard.dm:254)
rt.def("/proc/iswizard", function iswizard(f: Frame, M: Value) {
	return (((((rt.istype(live(M), T("/mob/living")) ? 1 : 0) && rt.fv(f, "mind", live(M))) && rt.gl("SSticker")) && rt.fv(f, "mode", rt.gl("SSticker"))) && ((rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0) || (rt.isIn(f, rt.fv(f, "mind", live(M)), rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)));
});

// /datum/game_mode/proc/update_wiz_icons_added  (code/game/gamemodes/wizard/wizard.dm:258)
rt.def("/datum/game_mode/proc/update_wiz_icons_added", function update_wiz_icons_added(f: Frame, wiz_mind: Value) {
	let wizhud: Value = null;
	let $0: any, $1: any;
	f.vars = () => [wizhud, $0, $1];
	rt.callName(f, (wizhud = rt.index(rt.gl("huds"), 9)), "join_hud", [rt.fv(f, "current", live(wiz_mind))]);
	$0 = rt.fv(f, "current", live(wiz_mind));
	if (truthy((rt.isIn(f, live(wiz_mind), rt.sv(f, "wizards")) ? 1 : 0))) {
		$1 = "wizard";
	} else {
		$1 = "apprentice";
	}
	rt.callSrc(f, "set_antag_hud", [$0, $1]);
	return f.dot;
});

// /datum/game_mode/proc/update_wiz_icons_removed  (code/game/gamemodes/wizard/wizard.dm:263)
rt.def("/datum/game_mode/proc/update_wiz_icons_removed", function update_wiz_icons_removed(f: Frame, wiz_mind: Value) {
	let wizhud: Value = null;
	f.vars = () => [wizhud];
	rt.callName(f, (wizhud = rt.index(rt.gl("huds"), 9)), "leave_hud", [rt.fv(f, "current", live(wiz_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(wiz_mind)), null]);
	return f.dot;
});
