// Based on /tg/station's code/modules/reagents/chemistry/reagents/medicine_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3547, "/datum/reagent/medicine", "/datum/reagent", {
	name: "Medicine",
	id: "medicine",
	taste_description: "bitterness",
});

// medicine_reagents.dm:14
rt.def("/datum/reagent/medicine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	this.current_cycle++;
	yield* this.holder.remove_reagent(this.id, this.metabolization_rate / M.metabolism_efficiency);
	return f.dot;
}, true);

rt.type(3548, "/datum/reagent/medicine/leporazine", "/datum/reagent/medicine", {
	name: "Leporazine",
	id: "leporazine",
	description: "Leporazine will effectively regulate a patient's body temperature, ensuring it never leaves safe levels.",
	color: "#C8A5DC",
});

// medicine_reagents.dm:24
rt.def("/datum/reagent/medicine/leporazine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 60);
	} else if (M.bodytemperature < 311) {
		M.bodytemperature = min(310, M.bodytemperature + 60);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3549, "/datum/reagent/medicine/adminordrazine", "/datum/reagent/medicine", {
	name: "Adminordrazine",
	id: "adminordrazine",
	description: "It's magic. We don't have to explain it.",
	color: "#C8A5DC",
	can_synth: 0,
	taste_description: "badmins",
});

// medicine_reagents.dm:39
rt.def("/datum/reagent/medicine/adminordrazine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let D: Value = null;
	yield* M.reagents.remove_all_type(T("/datum/reagent/toxin"), 5, 0, 1);
	yield* M.setCloneLoss(0, 0);
	yield* M.setOxyLoss(0, 0);
	M.radiation = 0;
	yield* M.heal_bodypart_damage(5, 5, 0);
	yield* M.adjustToxLoss(-5, 0);
	M.hallucination = 0;
	M.setBrainLoss(0);
	M.disabilities = 0;
	yield* M.set_blurriness(0);
	yield* M.set_blindness(0);
	yield* M.SetKnockdown(0, 0);
	yield* M.SetStun(0, 0);
	yield* M.SetUnconscious(0, 0);
	M.silent = 0;
	M.dizziness = 0;
	M.drowsyness = 0;
	M.stuttering = 0;
	M.slurring = 0;
	M.confused = 0;
	yield* M.SetSleeping(0, 0);
	M.jitteriness = 0;
	for (D of each(M.viruses, T("/datum/disease"))) {
		if (D.severity == "No threat") {
			continue;
		}
		D.spread_text = "Remissive";
		D.stage--;
		if (D.stage < 1) {
			yield* D.cure();
		}
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3551, "/datum/reagent/medicine/synaptizine", "/datum/reagent/medicine", {
	name: "Synaptizine",
	id: "synaptizine",
	description: "Increases resistance to stuns as well as reducing drowsiness and hallucinations.",
	color: "#FF00FF",
});

// medicine_reagents.dm:84
rt.def("/datum/reagent/medicine/synaptizine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.drowsyness = max(M.drowsyness - 5, 0);
	yield* M.AdjustStun(-20, 0);
	yield* M.AdjustKnockdown(-20, 0);
	yield* M.AdjustUnconscious(-20, 0);
	if (this.holder.has_reagent("mindbreaker")) {
		yield* this.holder.remove_reagent("mindbreaker", 5);
	}
	M.hallucination = max(0, M.hallucination - 10);
	if (prob(30)) {
		yield* M.adjustToxLoss(1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3553, "/datum/reagent/medicine/synaphydramine", "/datum/reagent/medicine", {
	name: "Diphen-Synaptizine",
	id: "synaphydramine",
	description: "Reduces drowsiness, hallucinations, and Histamine from body.",
	color: "#EC536D",
});

// medicine_reagents.dm:103
rt.def("/datum/reagent/medicine/synaphydramine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.drowsyness = max(M.drowsyness - 5, 0);
	if (this.holder.has_reagent("mindbreaker")) {
		yield* this.holder.remove_reagent("mindbreaker", 5);
	}
	if (this.holder.has_reagent("histamine")) {
		yield* this.holder.remove_reagent("histamine", 5);
	}
	M.hallucination = max(0, M.hallucination - 10);
	if (prob(30)) {
		yield* M.adjustToxLoss(1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3554, "/datum/reagent/medicine/inacusiate", "/datum/reagent/medicine", {
	name: "Inacusiate",
	id: "inacusiate",
	description: "Instantly restores all hearing to the patient, but does not cure deafness.",
	color: "#6600FF",
});

// medicine_reagents.dm:121
rt.def("/datum/reagent/medicine/inacusiate/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.restoreEars();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3555, "/datum/reagent/medicine/cryoxadone", "/datum/reagent/medicine", {
	name: "Cryoxadone",
	id: "cryoxadone",
	description: "A chemical mixture with almost magical healing powers. Its main limitation is that the patient's body temperature must be under 270K for it to metabolise correctly.",
	color: "#0000C8",
	taste_description: "sludge",
});

// medicine_reagents.dm:132
rt.def("/datum/reagent/medicine/cryoxadone/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(M.bodytemperature, 0, 100)) {
		(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
		yield* M.adjustCloneLoss(-1, 0);
		yield* M.adjustOxyLoss(-9, 0);
		yield* M.adjustBruteLoss(-5, 0);
		yield* M.adjustFireLoss(-5, 0);
		yield* M.adjustToxLoss(-5, 0);
		f.dot = 1;
	} else if (rt.inRange(M.bodytemperature, 100, 225)) {
		(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
		yield* M.adjustCloneLoss(-1, 0);
		yield* M.adjustOxyLoss(-7, 0);
		yield* M.adjustBruteLoss(-3, 0);
		yield* M.adjustFireLoss(-3, 0);
		yield* M.adjustToxLoss(-3, 0);
		f.dot = 1;
	} else if (rt.inRange(M.bodytemperature, 225, T0C)) {
		(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
		yield* M.adjustCloneLoss(-1, 0);
		yield* M.adjustOxyLoss(-5, 0);
		yield* M.adjustBruteLoss(-1, 0);
		yield* M.adjustFireLoss(-1, 0);
		yield* M.adjustToxLoss(-1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3556, "/datum/reagent/medicine/clonexadone", "/datum/reagent/medicine", {
	name: "Clonexadone",
	id: "clonexadone",
	description: "A chemical that derives from Cryoxadone. It specializes in healing clone damage, but nothing else. Requires very cold temperatures to properly metabolize, and metabolizes quicker than cryoxadone.",
	color: "#0000C8",
	taste_description: "muscle",
	metabolization_rate: 0.6,
});

// medicine_reagents.dm:168
rt.def("/datum/reagent/medicine/clonexadone/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(M.bodytemperature, 0, 100)) {
		(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
		yield* M.adjustCloneLoss(-7, 0);
		f.dot = 1;
	} else if (rt.inRange(M.bodytemperature, 100, 225)) {
		(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
		yield* M.adjustCloneLoss(-3, 0);
		f.dot = 1;
	} else if (rt.inRange(M.bodytemperature, 225, T0C)) {
		(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
		yield* M.adjustCloneLoss(-2, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3557, "/datum/reagent/medicine/rezadone", "/datum/reagent/medicine", {
	name: "Rezadone",
	id: "rezadone",
	description: "A powder derived from fish toxin, Rezadone can effectively treat genetic damage as well as restoring minor wounds. Overdose will cause intense nausea and minor toxin damage.",
	reagent_state: 1,
	color: "#669900",
	overdose_threshold: 30,
	taste_description: "fish",
});

// medicine_reagents.dm:193
rt.def("/datum/reagent/medicine/rezadone/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.setCloneLoss(0);
	yield* M.heal_bodypart_damage(1, 1, 0);
	(rt.modField(f, M, "status_flags", 16760831, rt.bitAnd));
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:200
rt.def("/datum/reagent/medicine/rezadone/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustToxLoss(1, 0);
	M.Dizzy(5);
	M.Jitter(5);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3559, "/datum/reagent/medicine/silver_sulfadiazine", "/datum/reagent/medicine", {
	name: "Silver Sulfadiazine",
	id: "silver_sulfadiazine",
	description: "If used in touch-based applications, immediately restores burn wounds as well as restoring more over time. If ingested through other means, deals minor toxin damage.",
	reagent_state: 2,
	color: "#C8A5DC",
});

// medicine_reagents.dm:222
rt.def("/datum/reagent/medicine/silver_sulfadiazine/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon")) && f.args[0].stat != 2) {
		if (rt.isIn(f, f.args[1], list(2, VAPOR, INJECT))) {
			yield* f.args[0].adjustToxLoss(0.5 * f.args[2]);
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='warning'>You don't feel so good...</span>");
			}
		} else if (f.args[0].getFireLoss()) {
			yield* f.args[0].adjustFireLoss(-f.args[2]);
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='danger'>You feel your burns healing! It stings like hell!</span>");
			}
			yield* f.args[0].emote("scream");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// medicine_reagents.dm:235
rt.def("/datum/reagent/medicine/silver_sulfadiazine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustFireLoss(-2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3560, "/datum/reagent/medicine/oxandrolone", "/datum/reagent/medicine", {
	name: "Oxandrolone",
	id: "oxandrolone",
	description: "Stimulates the healing of severe burns. Extremely rapidly heals severe burns and slowly heals minor ones. Overdose will worsen existing burns.",
	reagent_state: 2,
	color: "#f7ffa5",
	metabolization_rate: 0.2,
	overdose_threshold: 25,
});

// medicine_reagents.dm:249
rt.def("/datum/reagent/medicine/oxandrolone/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getFireLoss() > 50) {
		yield* M.adjustFireLoss(-4, 0);
	} else {
		yield* M.adjustFireLoss(-0.5, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:257
rt.def("/datum/reagent/medicine/oxandrolone/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	if (M.getFireLoss()) {
		yield* M.adjustFireLoss(4.5, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3561, "/datum/reagent/medicine/styptic_powder", "/datum/reagent/medicine", {
	name: "Styptic Powder",
	id: "styptic_powder",
	description: "If used in touch-based applications, immediately restores bruising as well as restoring more over time. If ingested through other means, deals minor toxin damage.",
	reagent_state: 2,
	color: "#FF9696",
});

// medicine_reagents.dm:270
rt.def("/datum/reagent/medicine/styptic_powder/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon")) && f.args[0].stat != 2) {
		if (rt.isIn(f, f.args[1], list(2, VAPOR, INJECT))) {
			yield* f.args[0].adjustToxLoss(0.5 * f.args[2]);
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='warning'>You don't feel so good...</span>");
			}
		} else if (f.args[0].getBruteLoss()) {
			yield* f.args[0].adjustBruteLoss(-f.args[2]);
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='danger'>You feel your bruises healing! It stings like hell!</span>");
			}
			yield* f.args[0].emote("scream");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// medicine_reagents.dm:284
rt.def("/datum/reagent/medicine/styptic_powder/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(-2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3562, "/datum/reagent/medicine/salglu_solution", "/datum/reagent/medicine", {
	last_added: 0,
	maximum_reachable: 550,
	name: "Saline-Glucose Solution",
	id: "salglu_solution",
	description: "Has a 33% chance per metabolism cycle to heal brute and burn damage. Can be used as a temporary blood substitute.",
	reagent_state: 2,
	color: "#DCDCDC",
	metabolization_rate: 0.2,
	overdose_threshold: 60,
	taste_description: "sweetness and salt",
});

// medicine_reagents.dm:302
rt.def("/datum/reagent/medicine/salglu_solution/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let amount_to_add: Value = null, new_blood_level: Value = null;
	if (this.last_added) {
		M.blood_volume -= this.last_added;
		this.last_added = 0;
	}
	if (M.blood_volume < this.maximum_reachable) {
		amount_to_add = min(M.blood_volume, this.volume * 5);
		this.last_added = (new_blood_level = min(M.blood_volume + amount_to_add, this.maximum_reachable)) - M.blood_volume;
		M.blood_volume = new_blood_level;
	}
	if (prob(33)) {
		yield* M.adjustBruteLoss(-0.5, 0);
		yield* M.adjustFireLoss(-0.5, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:316
rt.def("/datum/reagent/medicine/salglu_solution/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	if (prob(3)) {
		to_chat(M, "<span class = 'warning'>You feel salty.</span>");
		yield* this.holder.add_reagent("sodiumchloride", 1);
		yield* this.holder.remove_reagent("salglu_solution", 0.5);
	} else if (prob(3)) {
		to_chat(M, "<span class = 'warning'>You feel sweet.</span>");
		yield* this.holder.add_reagent("sugar", 1);
		yield* this.holder.remove_reagent("salglu_solution", 0.5);
	}
	if (prob(33)) {
		yield* M.adjustBruteLoss(0.5, 0);
		yield* M.adjustFireLoss(0.5, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3563, "/datum/reagent/medicine/mine_salve", "/datum/reagent/medicine", {
	name: "Miner's Salve",
	id: "mine_salve",
	description: "A powerful painkiller. Restores bruising and burns in addition to making the patient believe they are fully healed.",
	reagent_state: 2,
	color: "#6D6374",
	metabolization_rate: 0.16000001,
});

// medicine_reagents.dm:339
rt.def("/datum/reagent/medicine/mine_salve/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let N: Value = null;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		(N = M).hal_screwyhud = SCREWYHUD_HEALTHY;
	}
	yield* M.adjustBruteLoss(-0.25, 0);
	yield* M.adjustFireLoss(-0.25, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:348
rt.def("/datum/reagent/medicine/mine_salve/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let C: Value = null, s: Value = null, S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon")) && f.args[0].stat != 2) {
		if (rt.isIn(f, f.args[1], list(2, VAPOR, INJECT))) {
			f.args[0].nutrition -= 5;
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='warning'>Your stomach feels empty and cramps!</span>");
			}
		} else {
			C = f.args[0];
			for (s of each(C.surgeries)) {
				(S = s).success_multiplier = max(0.1, S.success_multiplier);
			}
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='danger'>You feel your wounds fade away to nothing!</span>");
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// medicine_reagents.dm:365
rt.def("/datum/reagent/medicine/mine_salve/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	let N: Value = null;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		(N = M).hal_screwyhud = SCREWYHUD_NONE;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(3564, "/datum/reagent/medicine/synthflesh", "/datum/reagent/medicine", {
	name: "Synthflesh",
	id: "synthflesh",
	description: "Has a 100% chance of instantly healing brute and burn damage. One unit of the chemical will heal one point of damage. Touch application only.",
	reagent_state: 2,
	color: "#FFEBEB",
});

// medicine_reagents.dm:378
rt.def("/datum/reagent/medicine/synthflesh/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		if (f.args[0].stat == 2) {
			f.args[3] = 0;
		}
		if (rt.isIn(f, f.args[1], list(PATCH, TOUCH))) {
			yield* f.args[0].adjustBruteLoss(-1.25 * f.args[2]);
			yield* f.args[0].adjustFireLoss(-1.25 * f.args[2]);
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='danger'>You feel your burns and bruises healing! It stings like hell!</span>");
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

rt.type(3565, "/datum/reagent/medicine/charcoal", "/datum/reagent/medicine", {
	name: "Charcoal",
	id: "charcoal",
	description: "Heals toxin damage as well as slowly removing any other chemicals the patient has in their bloodstream.",
	reagent_state: 2,
	color: "#000000",
	metabolization_rate: 0.2,
	taste_description: "ash",
});

// medicine_reagents.dm:398
rt.def("/datum/reagent/medicine/charcoal/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let R: Value = null;
	yield* M.adjustToxLoss(-2, 0);
	f.dot = 1;
	for (R of each(M.reagents.reagent_list, T("/datum/reagent"))) {
		if (R != this) {
			yield* M.reagents.remove_reagent(R.id, 1);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3566, "/datum/reagent/medicine/omnizine", "/datum/reagent/medicine", {
	name: "Omnizine",
	id: "omnizine",
	description: "Slowly heals all damage types. Overdose will cause damage in all types instead.",
	reagent_state: 2,
	color: "#DCDCDC",
	metabolization_rate: 0.1,
	overdose_threshold: 30,
});

// medicine_reagents.dm:415
rt.def("/datum/reagent/medicine/omnizine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustToxLoss(-0.5, 0);
	yield* M.adjustOxyLoss(-0.5, 0);
	yield* M.adjustBruteLoss(-0.5, 0);
	yield* M.adjustFireLoss(-0.5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:423
rt.def("/datum/reagent/medicine/omnizine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustToxLoss(1.5, 0);
	yield* M.adjustOxyLoss(1.5, 0);
	yield* M.adjustBruteLoss(1.5, 0);
	yield* M.adjustFireLoss(1.5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3568, "/datum/reagent/medicine/calomel", "/datum/reagent/medicine", {
	name: "Calomel",
	id: "calomel",
	description: "Quickly purges the body of all chemicals. Toxin damage is dealt if the patient is in good condition.",
	reagent_state: 2,
	color: "#19C832",
	metabolization_rate: 0.2,
	taste_description: "acid",
});

// medicine_reagents.dm:440
rt.def("/datum/reagent/medicine/calomel/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let R: Value = null;
	for (R of each(M.reagents.reagent_list, T("/datum/reagent"))) {
		if (R != this) {
			yield* M.reagents.remove_reagent(R.id, 2.5);
		}
	}
	if (M.health > 20) {
		yield* M.adjustToxLoss(2.5, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3569, "/datum/reagent/medicine/potass_iodide", "/datum/reagent/medicine", {
	name: "Potassium Iodide",
	id: "potass_iodide",
	description: "Efficiently restores low radiation damage.",
	reagent_state: 2,
	color: "#14FF3C",
	metabolization_rate: 0.8,
});

// medicine_reagents.dm:457
rt.def("/datum/reagent/medicine/potass_iodide/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.radiation > 0) {
		M.radiation--;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3570, "/datum/reagent/medicine/pen_acid", "/datum/reagent/medicine", {
	name: "Pentetic Acid",
	id: "pen_acid",
	description: "Reduces massive amounts of radiation and toxin damage while purging other chemicals from the body.",
	reagent_state: 2,
	color: "#E6FFF0",
	metabolization_rate: 0.2,
});

// medicine_reagents.dm:470
rt.def("/datum/reagent/medicine/pen_acid/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let R: Value = null;
	if (M.radiation > 0) {
		M.radiation -= 4;
	}
	yield* M.adjustToxLoss(-2, 0);
	if (M.radiation < 0) {
		M.radiation = 0;
	}
	for (R of each(M.reagents.reagent_list, T("/datum/reagent"))) {
		if (R != this) {
			yield* M.reagents.remove_reagent(R.id, 2);
		}
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3571, "/datum/reagent/medicine/sal_acid", "/datum/reagent/medicine", {
	name: "Salicyclic Acid",
	id: "sal_acid",
	description: "Stimulates the healing of severe bruises. Extremely rapidly heals severe bruising and slowly heals minor ones. Overdose will worsen existing bruising.",
	reagent_state: 2,
	color: "#D2D2D2",
	metabolization_rate: 0.2,
	overdose_threshold: 25,
});

// medicine_reagents.dm:492
rt.def("/datum/reagent/medicine/sal_acid/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getBruteLoss() > 50) {
		yield* M.adjustBruteLoss(-4, 0);
	} else {
		yield* M.adjustBruteLoss(-0.5, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:500
rt.def("/datum/reagent/medicine/sal_acid/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	if (M.getBruteLoss()) {
		yield* M.adjustBruteLoss(4.5, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3572, "/datum/reagent/medicine/salbutamol", "/datum/reagent/medicine", {
	name: "Salbutamol",
	id: "salbutamol",
	description: "Rapidly restores oxygen deprivation as well as preventing more of it to an extent.",
	reagent_state: 2,
	color: "#00FFFF",
	metabolization_rate: 0.1,
});

// medicine_reagents.dm:514
rt.def("/datum/reagent/medicine/salbutamol/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustOxyLoss(-3, 0);
	if (M.losebreath >= 4) {
		M.losebreath -= 2;
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3573, "/datum/reagent/medicine/perfluorodecalin", "/datum/reagent/medicine", {
	name: "Perfluorodecalin",
	id: "perfluorodecalin",
	description: "Extremely rapidly restores oxygen deprivation, but inhibits speech. May also heal small amounts of bruising and burns.",
	reagent_state: 2,
	color: "#FF6464",
	metabolization_rate: 0.1,
});

// medicine_reagents.dm:529
rt.def("/datum/reagent/medicine/perfluorodecalin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustOxyLoss(-12, 0);
	M.silent = max(M.silent, 5);
	if (prob(33)) {
		yield* M.adjustBruteLoss(-0.5, 0);
		yield* M.adjustFireLoss(-0.5, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3574, "/datum/reagent/medicine/ephedrine", "/datum/reagent/medicine", {
	name: "Ephedrine",
	id: "ephedrine",
	description: "Increases stun resistance and movement speed. Overdose deals toxin damage and inhibits breathing.",
	reagent_state: 2,
	color: "#D2FFFA",
	metabolization_rate: 0.2,
	overdose_threshold: 45,
	addiction_threshold: 30,
});

// medicine_reagents.dm:548
rt.def("/datum/reagent/medicine/ephedrine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	(rt.modField(f, M, "status_flags", 32, rt.bitOr));
	yield* M.AdjustStun(-20, 0);
	yield* M.AdjustKnockdown(-20, 0);
	yield* M.AdjustUnconscious(-20, 0);
	yield* M.adjustStaminaLoss(-1, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:557
rt.def("/datum/reagent/medicine/ephedrine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustToxLoss(0.5, 0);
		M.losebreath++;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:564
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustToxLoss(2, 0);
		M.losebreath += 2;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:571
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustToxLoss(3, 0);
		M.losebreath += 3;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:578
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustToxLoss(4, 0);
		M.losebreath += 4;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:585
rt.def("/datum/reagent/medicine/ephedrine/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustToxLoss(5, 0);
		M.losebreath += 5;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3575, "/datum/reagent/medicine/diphenhydramine", "/datum/reagent/medicine", {
	name: "Diphenhydramine",
	id: "diphenhydramine",
	description: "Rapidly purges the body of Histamine and reduces jitteriness. Slight chance of causing drowsiness.",
	reagent_state: 2,
	color: "#64FFE6",
	metabolization_rate: 0.2,
});

// medicine_reagents.dm:600
rt.def("/datum/reagent/medicine/diphenhydramine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(10)) {
		M.drowsyness += 1;
	}
	M.jitteriness -= 1;
	yield* M.reagents.remove_reagent("histamine", 3);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3576, "/datum/reagent/medicine/morphine", "/datum/reagent/medicine", {
	name: "Morphine",
	id: "morphine",
	description: "A painkiller that allows the patient to move at full speed even in bulky objects. Causes drowsiness and eventually unconsciousness in high doses. Overdose will cause a variety of effects, ranging from minor to lethal.",
	reagent_state: 2,
	color: "#A9FBFB",
	metabolization_rate: 0.2,
	overdose_threshold: 30,
	addiction_threshold: 25,
});

// medicine_reagents.dm:617
rt.def("/datum/reagent/medicine/morphine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	(rt.modField(f, M, "status_flags", 16, rt.bitOr));
	if (this.current_cycle === 11) {
		to_chat(M, "<span class='warning'>You start to feel tired...</span>");
	} else if (rt.inRange(this.current_cycle, 12, 24)) {
		M.drowsyness += 1;
	} else if (rt.inRange(this.current_cycle, 24, 1e+31)) {
		yield* M.Sleeping(40, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:629
rt.def("/datum/reagent/medicine/morphine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	let I: Value = null;
	if (prob(33)) {
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
		M.Dizzy(2);
		M.Jitter(2);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:638
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage1", function* addiction_act_stage1(f: Frame, M: Value) {
	let I: Value = null;
	if (prob(33)) {
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
		M.Dizzy(2);
		M.Jitter(2);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:647
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage2", function* addiction_act_stage2(f: Frame, M: Value) {
	let I: Value = null;
	if (prob(33)) {
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
		yield* M.adjustToxLoss(1, 0);
		f.dot = 1;
		M.Dizzy(3);
		M.Jitter(3);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:658
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage3", function* addiction_act_stage3(f: Frame, M: Value) {
	let I: Value = null;
	if (prob(33)) {
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
		yield* M.adjustToxLoss(2, 0);
		f.dot = 1;
		M.Dizzy(4);
		M.Jitter(4);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:669
rt.def("/datum/reagent/medicine/morphine/proc/addiction_act_stage4", function* addiction_act_stage4(f: Frame, M: Value) {
	let I: Value = null;
	if (prob(33)) {
		if (I = M.get_active_held_item()) {
			yield* M.drop_item();
		}
		yield* M.adjustToxLoss(3, 0);
		f.dot = 1;
		M.Dizzy(5);
		M.Jitter(5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3577, "/datum/reagent/medicine/oculine", "/datum/reagent/medicine", {
	name: "Oculine",
	id: "oculine",
	description: "Quickly restores eye damage, cures nearsightedness, and has a chance to restore vision to the blind.",
	reagent_state: 2,
	color: "#FFFFFF",
	metabolization_rate: 0.1,
	taste_description: "dull toxin",
});

// medicine_reagents.dm:689
rt.def("/datum/reagent/medicine/oculine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let eyes: Value = null;
	if (!(eyes = M.getorganslot("eyes_sight"))) {
		return f.dot;
	}
	if (rt.bitAnd(M.disabilities, 1)) {
		if (prob(20)) {
			to_chat(M, "<span class='warning'>Your vision slowly returns...</span>");
			yield* M.cure_blind();
			yield* M.cure_nearsighted();
			yield* M.blur_eyes(35);
		}
	} else if (rt.bitAnd(M.disabilities, 8)) {
		to_chat(M, "<span class='warning'>The blackness in your peripheral vision fades.</span>");
		yield* M.cure_nearsighted();
		yield* M.blur_eyes(10);
	} else if (M.eye_blind || M.eye_blurry) {
		yield* M.set_blindness(0);
		yield* M.set_blurriness(0);
	} else if (eyes.eye_damage > 0) {
		yield* M.adjust_eye_damage(-1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3578, "/datum/reagent/medicine/atropine", "/datum/reagent/medicine", {
	name: "Atropine",
	id: "atropine",
	description: "If a patient is in critical condition, rapidly heals all damage types as well as regulating oxygen in the body. Excellent for stabilizing wounded patients.",
	reagent_state: 2,
	color: "#000000",
	metabolization_rate: 0.1,
	overdose_threshold: 35,
});

// medicine_reagents.dm:720
rt.def("/datum/reagent/medicine/atropine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.health < 0) {
		yield* M.adjustToxLoss(-2, 0);
		yield* M.adjustBruteLoss(-2, 0);
		yield* M.adjustFireLoss(-2, 0);
		yield* M.adjustOxyLoss(-5, 0);
		f.dot = 1;
	}
	M.losebreath = 0;
	if (prob(20)) {
		M.Dizzy(5);
		M.Jitter(5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:733
rt.def("/datum/reagent/medicine/atropine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustToxLoss(0.5, 0);
	f.dot = 1;
	M.Dizzy(1);
	M.Jitter(1);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3579, "/datum/reagent/medicine/epinephrine", "/datum/reagent/medicine", {
	name: "Epinephrine",
	id: "epinephrine",
	description: "Minor boost to stun resistance. Slowly heals damage if a patient is in critical condition, as well as regulating oxygen loss. Overdose causes weakness and toxin damage.",
	reagent_state: 2,
	color: "#D2FFFA",
	metabolization_rate: 0.1,
	overdose_threshold: 30,
});

// medicine_reagents.dm:749
rt.def("/datum/reagent/medicine/epinephrine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.health < 0) {
		yield* M.adjustToxLoss(-0.5, 0);
		yield* M.adjustBruteLoss(-0.5, 0);
		yield* M.adjustFireLoss(-0.5, 0);
	}
	if (M.oxyloss > 35) {
		yield* M.setOxyLoss(35, 0);
	}
	if (M.losebreath >= 4) {
		M.losebreath -= 2;
	}
	if (M.losebreath < 0) {
		M.losebreath = 0;
	}
	yield* M.adjustStaminaLoss(-0.5, 0);
	f.dot = 1;
	if (prob(20)) {
		yield* M.AdjustStun(-20, 0);
		yield* M.AdjustKnockdown(-20, 0);
		yield* M.AdjustUnconscious(-20, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:768
rt.def("/datum/reagent/medicine/epinephrine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustStaminaLoss(2.5, 0);
		yield* M.adjustToxLoss(1, 0);
		M.losebreath++;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3580, "/datum/reagent/medicine/strange_reagent", "/datum/reagent/medicine", {
	name: "Strange Reagent",
	id: "strange_reagent",
	description: "A miracle drug capable of bringing the dead back to life. Only functions if the target has less than 100 brute and burn damage (independent of one another), and causes slight damage to the living.",
	reagent_state: 2,
	color: "#A0E85E",
	metabolization_rate: 0.2,
	taste_description: "magnets",
});

// medicine_reagents.dm:785
rt.def("/datum/reagent/medicine/strange_reagent/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[0].stat == 2) {
		if (f.args[0].getBruteLoss() >= 100 || f.args[0].getFireLoss() >= 100) {
			f.args[0].visible_message(`<span class='warning'>${f.args[0]}'s body convulses a bit, and then falls still once more.</span>`);
			return f.dot;
		}
		f.args[0].visible_message(`<span class='warning'>${f.args[0]}'s body convulses a bit.</span>`);
		if (!f.args[0].suiciding && !rt.bitAnd(f.args[0].disabilities, 128) && !f.args[0].hellbound) {
			if (!f.args[0]) {
				return f.dot;
			}
			if (yield* f.args[0].notify_ghost_cloning({ source: f.args[0] })) {
				rt.spawnTail(f, 100, "/datum/reagent/medicine/strange_reagent/proc/reaction_mob: spawn at modules/reagents/chemistry/reagents/medicine_reagents.dm:794");
			} else {
				yield* f.args[0].adjustOxyLoss(-20, 0);
				yield* f.args[0].adjustToxLoss(-20, 0);
				yield* f.args[0].updatehealth();
				if (yield* f.args[0].revive()) {
					yield* f.args[0].emote("gasp");
					add_logs(f.args[0], f.args[0], "revived", this);
				}
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// a spawn(100) body of /datum/reagent/medicine/strange_reagent/proc/reaction_mob, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/reagent/medicine/strange_reagent/proc/reaction_mob: spawn at modules/reagents/chemistry/reagents/medicine_reagents.dm:794", function* (f: Frame) {
	return f.dot;
});

// medicine_reagents.dm:806
rt.def("/datum/reagent/medicine/strange_reagent/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(0.5, 0);
	yield* M.adjustFireLoss(0.5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3581, "/datum/reagent/medicine/mannitol", "/datum/reagent/medicine", {
	name: "Mannitol",
	id: "mannitol",
	description: "Efficiently restores brain damage.",
	color: "#DCDCFF",
});

// medicine_reagents.dm:818
rt.def("/datum/reagent/medicine/mannitol/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBrainLoss(-3);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3582, "/datum/reagent/medicine/mutadone", "/datum/reagent/medicine", {
	name: "Mutadone",
	id: "mutadone",
	description: "Removes jitteriness and restores genetic defects.",
	color: "#5096C8",
	taste_description: "acid",
});

// medicine_reagents.dm:829
rt.def("/datum/reagent/medicine/mutadone/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.jitteriness = 0;
	if (M.has_dna()) {
		yield* M.dna.remove_all_mutations();
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3583, "/datum/reagent/medicine/antihol", "/datum/reagent/medicine", {
	name: "Antihol",
	id: "antihol",
	description: "Purges alcoholic substance from the patient's body and eliminates its side effects.",
	color: "#00B4C8",
	taste_description: "raw egg",
});

// medicine_reagents.dm:842
rt.def("/datum/reagent/medicine/antihol/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let H: Value = null;
	M.dizziness = 0;
	M.drowsyness = 0;
	M.slurring = 0;
	M.confused = 0;
	yield* M.reagents.remove_all_type(T("/datum/reagent/consumable/ethanol"), 3, 0, 1);
	yield* M.adjustToxLoss(-0.2, 0);
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		(H = M).drunkenness = max(H.drunkenness - 10, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3584, "/datum/reagent/medicine/stimulants", "/datum/reagent/medicine", {
	name: "Stimulants",
	id: "stimulants",
	description: "Increases stun resistance and movement speed in addition to restoring minor damage and weakness. Overdose causes weakness and toxin damage.",
	color: "#78008C",
	metabolization_rate: 0.2,
	overdose_threshold: 60,
});

// medicine_reagents.dm:863
rt.def("/datum/reagent/medicine/stimulants/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	(rt.modField(f, M, "status_flags", 32, rt.bitOr));
	if (M.health < 50 && M.health > 0) {
		yield* M.adjustOxyLoss(-1, 0);
		yield* M.adjustToxLoss(-1, 0);
		yield* M.adjustBruteLoss(-1, 0);
		yield* M.adjustFireLoss(-1, 0);
	}
	yield* M.AdjustStun(-60, 0);
	yield* M.AdjustKnockdown(-60, 0);
	yield* M.AdjustUnconscious(-60, 0);
	yield* M.adjustStaminaLoss(-5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:877
rt.def("/datum/reagent/medicine/stimulants/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	if (prob(33)) {
		yield* M.adjustStaminaLoss(2.5, 0);
		yield* M.adjustToxLoss(1, 0);
		M.losebreath++;
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3585, "/datum/reagent/medicine/insulin", "/datum/reagent/medicine", {
	name: "Insulin",
	id: "insulin",
	description: "Increases sugar depletion rates.",
	reagent_state: 2,
	color: "#FFFFF0",
	metabolization_rate: 0.2,
});

// medicine_reagents.dm:893
rt.def("/datum/reagent/medicine/insulin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (yield* M.AdjustSleeping(-20, 0)) {
		f.dot = 1;
	}
	yield* M.reagents.remove_reagent("sugar", 3);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3586, "/datum/reagent/medicine/bicaridine", "/datum/reagent/medicine", {
	name: "Bicaridine",
	id: "bicaridine",
	description: "Restores bruising. Overdose causes it instead.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// medicine_reagents.dm:908
rt.def("/datum/reagent/medicine/bicaridine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(-2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:913
rt.def("/datum/reagent/medicine/bicaridine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(4, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3587, "/datum/reagent/medicine/dexalin", "/datum/reagent/medicine", {
	name: "Dexalin",
	id: "dexalin",
	description: "Restores oxygen loss. Overdose causes it instead.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// medicine_reagents.dm:926
rt.def("/datum/reagent/medicine/dexalin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustOxyLoss(-2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:931
rt.def("/datum/reagent/medicine/dexalin/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustOxyLoss(4, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3588, "/datum/reagent/medicine/kelotane", "/datum/reagent/medicine", {
	name: "Kelotane",
	id: "kelotane",
	description: "Restores fire damage. Overdose causes it instead.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// medicine_reagents.dm:944
rt.def("/datum/reagent/medicine/kelotane/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustFireLoss(-2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:949
rt.def("/datum/reagent/medicine/kelotane/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustFireLoss(4, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3589, "/datum/reagent/medicine/antitoxin", "/datum/reagent/medicine", {
	name: "Anti-Toxin",
	id: "antitoxin",
	description: "Heals toxin damage and removes toxins in the bloodstream. Overdose causes toxin damage.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
	taste_description: "a roll of gauze",
});

// medicine_reagents.dm:963
rt.def("/datum/reagent/medicine/antitoxin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let R: Value = null;
	yield* M.adjustToxLoss(-2, 0);
	for (R of each(M.reagents.reagent_list, T("/datum/reagent/toxin"))) {
		yield* M.reagents.remove_reagent(R.id, 1);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:970
rt.def("/datum/reagent/medicine/antitoxin/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustToxLoss(4, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3590, "/datum/reagent/medicine/inaprovaline", "/datum/reagent/medicine", {
	name: "Inaprovaline",
	id: "inaprovaline",
	description: "Stabilizes the breathing of patients. Good for those in critical condition.",
	reagent_state: 2,
	color: "#C8A5DC",
});

// medicine_reagents.dm:982
rt.def("/datum/reagent/medicine/inaprovaline/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.losebreath >= 5) {
		M.losebreath -= 5;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3591, "/datum/reagent/medicine/tricordrazine", "/datum/reagent/medicine", {
	name: "Tricordrazine",
	id: "tricordrazine",
	description: "Has a high chance to heal all types of damage. Overdose instead causes it.",
	reagent_state: 2,
	color: "#C8A5DC",
	overdose_threshold: 30,
	taste_description: "grossness",
});

// medicine_reagents.dm:996
rt.def("/datum/reagent/medicine/tricordrazine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(80)) {
		yield* M.adjustBruteLoss(-1, 0);
		yield* M.adjustFireLoss(-1, 0);
		yield* M.adjustOxyLoss(-1, 0);
		yield* M.adjustToxLoss(-1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:1005
rt.def("/datum/reagent/medicine/tricordrazine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustToxLoss(2, 0);
	yield* M.adjustOxyLoss(2, 0);
	yield* M.adjustBruteLoss(2, 0);
	yield* M.adjustFireLoss(2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3592, "/datum/reagent/medicine/syndicate_nanites", "/datum/reagent/medicine", {
	name: "Restorative Nanites",
	id: "syndicate_nanites",
	description: "Miniature medical robots that swiftly restore bodily damage.",
	reagent_state: 1,
	color: "#555555",
});

// medicine_reagents.dm:1020
rt.def("/datum/reagent/medicine/syndicate_nanites/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(-5, 0);
	yield* M.adjustFireLoss(-5, 0);
	yield* M.adjustOxyLoss(-15, 0);
	yield* M.adjustToxLoss(-5, 0);
	yield* M.adjustBrainLoss(-15);
	yield* M.adjustCloneLoss(-3, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3593, "/datum/reagent/medicine/earthsblood", "/datum/reagent/medicine", {
	name: "Earthsblood",
	id: "earthsblood",
	description: "Ichor from an extremely powerful plant. Great for restoring wounds, but it's a little heavy on the brain.",
	color: "#ffaf00",
	overdose_threshold: 25,
});

// medicine_reagents.dm:1037
rt.def("/datum/reagent/medicine/earthsblood/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(-3, 0);
	yield* M.adjustFireLoss(-3, 0);
	yield* M.adjustOxyLoss(-15, 0);
	yield* M.adjustToxLoss(-3, 0);
	yield* M.adjustBrainLoss(2);
	yield* M.adjustCloneLoss(-1, 0);
	yield* M.adjustStaminaLoss(-30, 0);
	M.jitteriness = min(max(0, M.jitteriness + 3), 30);
	M.druggy = min(max(0, M.druggy + 10), 15);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:1050
rt.def("/datum/reagent/medicine/earthsblood/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	M.hallucination = min(max(0, M.hallucination + 10), 50);
	yield* M.adjustToxLoss(5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3594, "/datum/reagent/medicine/haloperidol", "/datum/reagent/medicine", {
	name: "Haloperidol",
	id: "haloperidol",
	description: "Increases depletion rates for most stimulating/hallucinogenic drugs. Reduces druggy effects and jitteriness. Severe stamina regeneration penalty, causes drowsiness. Small chance of brain damage.",
	reagent_state: 2,
	color: "#27870a",
	metabolization_rate: 0.16000001,
});

// medicine_reagents.dm:1064
rt.def("/datum/reagent/medicine/haloperidol/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let R: Value = null;
	for (R of each(M.reagents.reagent_list, T("/datum/reagent/drug"))) {
		yield* M.reagents.remove_reagent(R.id, 5);
	}
	M.drowsyness += 2;
	if (M.jitteriness >= 3) {
		M.jitteriness -= 3;
	}
	if (M.hallucination >= 5) {
		M.hallucination -= 5;
	}
	if (prob(20)) {
		yield* M.adjustBrainLoss(1);
	}
	yield* M.adjustStaminaLoss(2.5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3595, "/datum/reagent/medicine/miningnanites", "/datum/reagent/medicine", {
	name: "Nanites",
	id: "miningnanites",
	description: "It's mining magic. We don't have to explain it.",
	color: "#C8A5DC",
	overdose_threshold: 3,
	can_synth: 0,
});

// medicine_reagents.dm:1086
rt.def("/datum/reagent/medicine/miningnanites/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.heal_bodypart_damage(5, 5, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// medicine_reagents.dm:1091
rt.def("/datum/reagent/medicine/miningnanites/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(3, 0);
	yield* M.adjustFireLoss(3, 0);
	yield* M.adjustToxLoss(3, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3596, "/datum/reagent/medicine/changelingAdrenaline", "/datum/reagent/medicine", {
	name: "Adrenaline",
	id: "changelingAdrenaline",
	description: "Reduces stun times. Also deals toxin damage at high amounts.",
	color: "#C8A5DC",
	overdose_threshold: 30,
});

// medicine_reagents.dm:1106
rt.def("/datum/reagent/medicine/changelingAdrenaline/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.AdjustUnconscious(-20, 0);
	yield* M.AdjustStun(-20, 0);
	yield* M.AdjustKnockdown(-20, 0);
	yield* M.adjustStaminaLoss(-1, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

// medicine_reagents.dm:1114
rt.def("/datum/reagent/medicine/changelingAdrenaline/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustToxLoss(1, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3597, "/datum/reagent/medicine/changelingAdrenaline2", "/datum/reagent/medicine", {
	name: "Adrenaline",
	id: "changelingAdrenaline2",
	description: "Drastically increases movement speed.",
	color: "#C8A5DC",
	metabolization_rate: 1,
});

// medicine_reagents.dm:1126
rt.def("/datum/reagent/medicine/changelingAdrenaline2/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	(rt.modField(f, M, "status_flags", 64, rt.bitOr));
	yield* M.adjustToxLoss(2, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);
