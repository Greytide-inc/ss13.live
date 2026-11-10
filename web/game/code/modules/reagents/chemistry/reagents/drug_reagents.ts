// Based on /tg/station's code/modules/reagents/chemistry/reagents/drug_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3537, "/datum/reagent/drug/space_drugs", "/datum/reagent/drug", {
	name: "Space drugs",
	id: "space_drugs",
	description: "An illegal chemical compound used as drug.",
	color: "#60A584",
	overdose_threshold: 30,
});

// drug_reagents.dm:15
rt.def("/datum/reagent/drug/space_drugs/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.set_drugginess(15);
	if (isturf(M.loc) && !rt.istype(M.loc, T("/turf/open/space"))) {
		if (M.canmove) {
			if (prob(10)) {
				yield* step(M, pick(GLOB.cardinal));
			}
		}
	}
	if (prob(7)) {
		yield* M.emote(pick("twitch", "drool", "moan", "giggle"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:24
rt.def("/datum/reagent/drug/space_drugs/proc/overdose_start", function overdose_start(f: Frame, M: Value) {
	to_chat(M, "<span class='userdanger'>You start tripping hard!</span>");
	return f.dot;
});

// drug_reagents.dm:28
rt.def("/datum/reagent/drug/space_drugs/proc/overdose_process", function overdose_process(f: Frame, M: Value) {
	if (M.hallucination < this.volume && prob(20)) {
		M.hallucination += 5;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(3538, "/datum/reagent/drug/nicotine", "/datum/reagent/drug", {
	name: "Nicotine",
	id: "nicotine",
	description: "Slightly reduces stun times. If overdosed it will deal toxin and oxygen damage.",
	reagent_state: 2,
	color: "#60A584",
	addiction_threshold: 30,
	taste_description: "smoke",
});

// drug_reagents.dm:42
rt.def("/datum/reagent/drug/nicotine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let smoke_message: Value = null;
	if (prob(1)) {
		smoke_message = pick("You feel relaxed.", "You feel calmed.", "You feel alert.", "You feel rugged.");
		to_chat(M, `<span class='notice'>${smoke_message}</span>`);
	}
	yield* M.AdjustStun(-20, 0);
	yield* M.AdjustKnockdown(-20, 0);
	yield* M.AdjustUnconscious(-20, 0);
	yield* M.adjustStaminaLoss(-0.5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3540, "/datum/reagent/drug/crank", "/datum/reagent/drug", {
	name: "Crank",
	id: "crank",
	description: "Reduces stun times by about 200%. If overdosed or addicted it will deal significant Toxin, Brute and Brain damage.",
	reagent_state: 2,
	color: "#FA00C8",
	overdose_threshold: 20,
	addiction_threshold: 10,
});

// drug_reagents.dm:70
rt.def("/datum/reagent/drug/crank/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let high_message: Value = null;
	if (prob(5)) {
		high_message = pick("You feel jittery.", "You feel like you gotta go fast.", "You feel like you need to step it up.");
		to_chat(M, `<span class='notice'>${high_message}</span>`);
	}
	yield* M.AdjustStun(-20, 0);
	yield* M.AdjustKnockdown(-20, 0);
	yield* M.AdjustUnconscious(-20, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:80
rt.def("/datum/reagent/drug/crank/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustBrainLoss(2);
	yield* M.adjustToxLoss(2, 0);
	yield* M.adjustBruteLoss(2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:87
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame, M: Value) {
	yield* M.adjustBrainLoss(5);
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:91
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame, M: Value) {
	yield* M.adjustToxLoss(5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:96
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:101
rt.def("/datum/reagent/drug/crank/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame, M: Value) {
	yield* M.adjustBrainLoss(5);
	yield* M.adjustToxLoss(5, 0);
	yield* M.adjustBruteLoss(5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3541, "/datum/reagent/drug/krokodil", "/datum/reagent/drug", {
	name: "Krokodil",
	id: "krokodil",
	description: "Cools and calms you down. If overdosed it will deal significant Brain and Toxin damage. If addicted it will begin to deal fatal amounts of Brute damage as the subject's skin falls off.",
	reagent_state: 2,
	color: "#0064B4",
	overdose_threshold: 20,
	addiction_threshold: 15,
});

// drug_reagents.dm:118
rt.def("/datum/reagent/drug/krokodil/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let high_message: Value = pick("You feel calm.", "You feel collected.", "You feel like you need to relax.");
	if (prob(5)) {
		to_chat(M, `<span class='notice'>${high_message}</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:124
rt.def("/datum/reagent/drug/krokodil/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustBrainLoss(0.25);
	yield* M.adjustToxLoss(0.25, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:130
rt.def("/datum/reagent/drug/krokodil/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame, M: Value) {
	yield* M.adjustBrainLoss(2);
	yield* M.adjustToxLoss(2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3545, "/datum/reagent/krokodil", "/datum/reagent", {});

// drug_reagents.dm:136
rt.def("/datum/reagent/krokodil/proc/addiction_act_stage2", function addiction_act_stage2(f: Frame, M: Value) {
	if (prob(25)) {
		to_chat(M, "<span class='danger'>Your skin feels loose...</span>");
	}
	parent_proc();
	return f.dot;
}, false);

// drug_reagents.dm:141
rt.def("/datum/reagent/drug/krokodil/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame, M: Value) {
	if (prob(25)) {
		to_chat(M, "<span class='danger'>Your skin starts to peel away...</span>");
	}
	yield* M.adjustBruteLoss(3, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:148
rt.def("/datum/reagent/drug/krokodil/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame, M: Value) {
	if (!M.dna || !M.dna.species) {
		return f.dot;
	}
	if (!rt.istype(M.dna.species, T("/datum/species/krokodil_addict"))) {
		to_chat(M, "<span class='userdanger'>Your skin falls off easily!</span>");
		yield* M.adjustBruteLoss(50, 0);
		yield* M.set_species(T("/datum/species/krokodil_addict"));
	} else {
		yield* M.adjustBruteLoss(5, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3542, "/datum/reagent/drug/methamphetamine", "/datum/reagent/drug", {
	name: "Methamphetamine",
	id: "methamphetamine",
	description: "Reduces stun times by about 300%, speeds the user up, and allows the user to quickly recover stamina while dealing a small amount of Brain damage. If overdosed the subject will move randomly, laugh randomly, drop items and suffer from Toxin and Brain damage. If addicted the subject will constantly jitter and drool, before becoming dizzy and losing motor control and eventually suffer heavy toxin damage.",
	reagent_state: 2,
	color: "#FAFAFA",
	overdose_threshold: 20,
	addiction_threshold: 10,
	metabolization_rate: 0.3,
});

// drug_reagents.dm:169
rt.def("/datum/reagent/drug/methamphetamine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let high_message: Value = pick("You feel hyper.", "You feel like you need to go faster.", "You feel like you can run the world.");
	if (prob(5)) {
		to_chat(M, `<span class='notice'>${high_message}</span>`);
	}
	yield* M.AdjustStun(-40, 0);
	yield* M.AdjustKnockdown(-40, 0);
	yield* M.AdjustUnconscious(-40, 0);
	yield* M.adjustStaminaLoss(-2, 0);
	(rt.modField(f, M, "status_flags", 64, rt.bitOr));
	M.Jitter(2);
	yield* M.adjustBrainLoss(0.25);
	if (prob(5)) {
		yield* M.emote(pick("twitch", "shiver"));
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:185
rt.def("/datum/reagent/drug/methamphetamine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	let i: Value = null, I: Value = null;
	let $e: any;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		rt.forRange(f, 0, 1, 4, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* step(M, pick(GLOB.cardinal));
		}
		rt.endFor(f, 0);
	}
	if (prob(20)) {
		yield* M.emote("laugh");
	}
	if (prob(33)) {
		M.visible_message(`<span class='danger'>${M}'s hands flip out and flail everywhere!</span>`);
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
	}
	yield* parent_proc();
	yield* M.adjustToxLoss(1, 0);
	yield* M.adjustBrainLoss(pick(0.5, 0.6, 0.7, 0.8, 0.9, 1));
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:201
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame, M: Value) {
	M.Jitter(5);
	if (prob(20)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:207
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame, M: Value) {
	M.Jitter(10);
	M.Dizzy(10);
	if (prob(30)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:214
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame, M: Value) {
	let i: Value = null;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		i = 0;
		while (i < 4) {
			yield* step(M, pick(GLOB.cardinal));
			i++;
		}
	}
	M.Jitter(15);
	M.Dizzy(15);
	if (prob(40)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:224
rt.def("/datum/reagent/drug/methamphetamine/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame, M: Value) {
	let i: Value = null;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		i = 0;
		while (i < 8) {
			yield* step(M, pick(GLOB.cardinal));
			i++;
		}
	}
	M.Jitter(20);
	M.Dizzy(20);
	yield* M.adjustToxLoss(5, 0);
	if (prob(50)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3543, "/datum/reagent/drug/bath_salts", "/datum/reagent/drug", {
	name: "Bath Salts",
	id: "bath_salts",
	description: "Makes you nearly impervious to stuns and grants a stamina regeneration buff, but you will be a nearly uncontrollable tramp-bearded raving lunatic.",
	reagent_state: 2,
	color: "#FAFAFA",
	overdose_threshold: 20,
	addiction_threshold: 10,
	taste_description: "salt",
});

// drug_reagents.dm:247
rt.def("/datum/reagent/drug/bath_salts/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let high_message: Value = pick("You feel amped up.", "You feel ready.", "You feel like you can push it to the limit.");
	if (prob(5)) {
		to_chat(M, `<span class='notice'>${high_message}</span>`);
	}
	yield* M.AdjustStun(-60, 0);
	yield* M.AdjustKnockdown(-60, 0);
	yield* M.AdjustUnconscious(-60, 0);
	yield* M.adjustStaminaLoss(-5, 0);
	yield* M.adjustBrainLoss(0.5);
	yield* M.adjustToxLoss(0.1, 0);
	M.hallucination += 10;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		yield* step(M, pick(GLOB.cardinal));
		yield* step(M, pick(GLOB.cardinal));
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// drug_reagents.dm:264
rt.def("/datum/reagent/drug/bath_salts/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	let i: Value = null, I: Value = null;
	let $e: any;
	M.hallucination += 10;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		rt.forRange(f, 0, 1, 8, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* step(M, pick(GLOB.cardinal));
		}
		rt.endFor(f, 0);
	}
	if (prob(20)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	if (prob(33)) {
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:277
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame, M: Value) {
	let i: Value = null;
	M.hallucination += 10;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		i = 0;
		while (i < 8) {
			yield* step(M, pick(GLOB.cardinal));
			i++;
		}
	}
	M.Jitter(5);
	yield* M.adjustBrainLoss(10);
	if (prob(20)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:288
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame, M: Value) {
	let i: Value = null;
	M.hallucination += 20;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		i = 0;
		while (i < 8) {
			yield* step(M, pick(GLOB.cardinal));
			i++;
		}
	}
	M.Jitter(10);
	M.Dizzy(10);
	yield* M.adjustBrainLoss(10);
	if (prob(30)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:300
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame, M: Value) {
	let i: Value = null;
	M.hallucination += 30;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		i = 0;
		while (i < 12) {
			yield* step(M, pick(GLOB.cardinal));
			i++;
		}
	}
	M.Jitter(15);
	M.Dizzy(15);
	yield* M.adjustBrainLoss(10);
	if (prob(40)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drug_reagents.dm:312
rt.def("/datum/reagent/drug/bath_salts/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame, M: Value) {
	let i: Value = null;
	M.hallucination += 40;
	if (M.canmove && !rt.istype(M.loc, T("/atom/movable"))) {
		i = 0;
		while (i < 16) {
			yield* step(M, pick(GLOB.cardinal));
			i++;
		}
	}
	M.Jitter(50);
	M.Dizzy(50);
	yield* M.adjustToxLoss(5, 0);
	yield* M.adjustBrainLoss(10);
	if (prob(50)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3544, "/datum/reagent/drug/aranesp", "/datum/reagent/drug", {
	name: "Aranesp",
	id: "aranesp",
	description: "Amps you up and gets you going, fixes all stamina damage you might have but can cause toxin and oxygen damage..",
	reagent_state: 2,
	color: "#78FFF0",
});

// drug_reagents.dm:333
rt.def("/datum/reagent/drug/aranesp/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let high_message: Value = pick("You feel amped up.", "You feel ready.", "You feel like you can push it to the limit.");
	if (prob(5)) {
		to_chat(M, `<span class='notice'>${high_message}</span>`);
	}
	yield* M.adjustStaminaLoss(-18, 0);
	yield* M.adjustToxLoss(0.5, 0);
	if (prob(50)) {
		M.losebreath++;
		yield* M.adjustOxyLoss(1, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);
