// Based on /tg/station's code/datums/antagonists/ninja.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(913, "/datum/antagonist/ninja", "/datum/antagonist", {
	team: null,
	helping_station: 0,
	give_objectives: 1,
	name: "Ninja",
});

// ninja.dm:14
rt.def("/datum/antagonist/ninja/proc/New", function New(f: Frame, new_owner: Value) {
	if (new_owner && !rt.istype(new_owner.current, T("/mob/living/carbon/human"))) {
		rt.throw_(f, new_(T("/exception"), "Only humans and/or humanoids may be ninja'ed", "code/datums/antagonists/ninja.dm", 15));
	}
	parent_proc(new_owner);
	return f.dot;
});

rt.type(916, "/datum/antagonist/ninja/randomAllegiance", "/datum/antagonist/ninja", {});

// ninja.dm:19
rt.def("/datum/antagonist/ninja/randomAllegiance/proc/New", function New(f: Frame, new_owner: Value) {
	parent_proc(new_owner);
	this.helping_station = rand(0, 1);
	return f.dot;
});

// ninja.dm:24
rt.def("/datum/antagonist/ninja/proc/equip_space_ninja", function* equip_space_ninja(f: Frame, H: Value, safety: Value) {
	let E: Value = null;
	H ??= this.owner.current;
	safety ??= 0;
	if (safety) {
		yield* qdel(H.w_uniform);
		yield* qdel(H.wear_suit);
		yield* qdel(H.wear_mask);
		yield* qdel(H.head);
		yield* qdel(H.shoes);
		yield* qdel(H.gloves);
	}
	let theSuit: Value = (yield* new_(T("/obj/item/clothing/suit/space/space_ninja"), H));
	let EK: Value = (yield* new_(T("/obj/item/weapon/dash/energy_katana"), H));
	theSuit.energyKatana = EK;
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), H)), 7);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/black"), H)), 14);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/space_ninja"), H)), 12);
	yield* H.equip_to_slot_or_del(theSuit, 13);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/space_ninja"), H)), 9);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/helmet/space/space_ninja"), H)), 11);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/gas/space_ninja"), H)), 2);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/glasses/night"), H)), 8);
	yield* H.equip_to_slot_or_del(EK, 5);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/device/flashlight"), H)), 16);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/grenade/plastic/x4"), H)), 15);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen"), H)), 17);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/tank/jetpack/carbondioxide"), H)), 1);
	theSuit.randomize_param();
	yield* (E = (yield* new_(T("/obj/item/weapon/implant/explosive"), H))).implant(H);
	return 1;
}, true);

// ninja.dm:55
rt.def("/datum/antagonist/ninja/proc/addMemories", function addMemories(f: Frame) {
	this.owner.store_memory("I am an elite mercenary assassin of the mighty Spider Clan. A <font color='red'><B>SPACE NINJA</B></font>!");
	this.owner.store_memory("Surprise is my weapon. Shadows are my armor. Without them, I am nothing. (//initialize your suit by right clicking on it, to use abilities like stealth)!");
	let $0: any = this.owner;
	$0.store_memory(`Officially, ${this.helping_station ? "Nanotrasen" : "The Syndicate"} are my employer.`);
	return f.dot;
});

// ninja.dm:60
rt.def("/datum/antagonist/ninja/proc/addObjectives", function* addObjectives(f: Frame, quantity: Value) {
	let M: Value = null, O: Value = null, index: Value = null, M_3: Value = null, is_bad_guy: Value = null, O_5: Value = null, selected: Value = null;
	let $e: any;
	quantity ??= 6;
	let possible_targets: Value = list();
	for (M of each(GLOB.SSticker.minds, T("/datum/mind"))) {
		if (M.current && M.current.stat != 2) {
			if (rt.istype(M.current, T("/mob/living/carbon/human"))) {
				if (M.special_role) {
					rt.setAt(possible_targets, M, 0);
				} else if (rt.isIn(f, M.assigned_role, GLOB.command_positions)) {
					rt.setAt(possible_targets, M, 1);
				}
			}
		}
	}
	let objectives: Value = list(1, 2, 3, 4);
	while (rt.len(f, this.owner.objectives) < quantity) {
		const pick_n_take_2 = pick_n_take(objectives);
		if (pick_n_take_2 === 1) {
			(O = (yield* new_(T("/datum/objective/download")))).owner = this.owner;
			O.gen_amount_goal();
			this.owner.objectives += O;
		} else if (pick_n_take_2 === 2) {
			(O = (yield* new_(T("/datum/objective/steal/special")))).owner = this.owner;
			this.owner.objectives += O;
		} else if (pick_n_take_2 === 3) {
			if (!rt.len(f, possible_targets)) {
				continue;
			}
			index = rand(1, rt.len(f, possible_targets));
			M_3 = rt.index(possible_targets, index);
			is_bad_guy = rt.index(possible_targets, M_3);
			possible_targets.Cut(index, index + 1);
			if (rt.bitXor(is_bad_guy, this.helping_station)) {
				(O_5 = (yield* new_(T("/datum/objective/assassinate")))).owner = this.owner;
				O_5.target = M_3;
				O_5.explanation_text = fmt("Slay ％！, the ＀.", [M_3.current.real_name, M_3.assigned_role]);
				this.owner.objectives += O_5;
			} else {
				(O_5 = (yield* new_(T("/datum/objective/protect")))).owner = this.owner;
				O_5.target = M_3;
				O_5.explanation_text = fmt("Protect ％！, the ＀, from harm.", [M_3.current.real_name, M_3.assigned_role]);
				this.owner.objectives += O_5;
			}
		} else if (pick_n_take_2 === 4) {
			if (!rt.len(f, possible_targets)) {
				continue;
			}
			selected = rand(1, rt.len(f, possible_targets));
			M_3 = rt.index(possible_targets, selected);
			is_bad_guy = rt.index(possible_targets, M_3);
			possible_targets.Cut(selected, selected + 1);
			if (rt.bitXor(is_bad_guy, this.helping_station)) {
				(O_5 = (yield* new_(T("/datum/objective/debrain")))).owner = this.owner;
				O_5.target = M_3;
				O_5.explanation_text = `Steal the brain of ${M_3.current.real_name}.`;
				this.owner.objectives += O_5;
			} else {
				(O_5 = (yield* new_(T("/datum/objective/capture")))).owner = this.owner;
				O_5.gen_amount_goal();
				this.owner.objectives += O_5;
			}
		} else {
			break;
		}
	}
	(O = (yield* new_(T("/datum/objective/survive")))).owner = this.owner;
	this.owner.objectives += O;
	return f.dot;
}, true);

// ninja.dm:128
rt.def("/proc/remove_ninja", function* remove_ninja(f: Frame, L: Value) {
	let datum: Value = null;
	if (!L || !L.mind) {
		return 0;
	}
	yield* (datum = L.mind.has_antag_datum(T("/datum/antagonist/ninja"))).on_removal();
	return 1;
}, true);

// ninja.dm:135
rt.def("/proc/add_ninja", function* add_ninja(f: Frame, H: Value, type: Value) {
	type ??= T("/datum/antagonist/ninja/randomAllegiance");
	if (!H || !H.mind) {
		return 0;
	}
	return (yield* H.mind.add_antag_datum(type));
}, true);

// ninja.dm:140
rt.def("/proc/is_ninja", function is_ninja(f: Frame, M: Value) {
	return ((M && M.mind) && M.mind.has_antag_datum(T("/datum/antagonist/ninja")));
});

// ninja.dm:144
rt.def("/datum/antagonist/ninja/proc/greet", function greet(f: Frame) {
	let $1: any;
	rt.op(f, "OutputReference", [rt.R.field("current")], [this.owner, sound(rt.rsc("sound/effects/ninja_greeting.ogg"))], false);
	to_chat(this.owner.current, "I am an elite mercenary assassin of the mighty Spider Clan. A <font color='red'><B>SPACE NINJA</B></font>!");
	to_chat(this.owner.current, "Surprise is my weapon. Shadows are my armor. Without them, I am nothing. (//initialize your suit by right clicking on it, to use abilities like stealth)!");
	let $0: any = this.owner.current;
	if (this.helping_station) {

		$1 = "Nanotrasen";
	} else {
		$1 = "The Syndicate";
	}
	to_chat($0, `Officially, ${$1} are my employer.`);
	return f.dot;
});

// ninja.dm:152
rt.def("/datum/antagonist/ninja/proc/on_gain", function* on_gain(f: Frame) {
	if (this.give_objectives) {
		yield* this.addObjectives();
	}
	this.addMemories();
	return f.dot;
}, true);
