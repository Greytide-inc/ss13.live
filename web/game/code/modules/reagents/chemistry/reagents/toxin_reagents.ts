// Based on /tg/station's code/modules/reagents/chemistry/reagents/toxin_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3696, "/datum/reagent/toxin", "/datum/reagent", {
	toxpwr: 1.5,
	name: "Toxin",
	id: "toxin",
	description: "A toxic chemical.",
	color: "#CF3600",
	taste_description: "bitterness",
	taste_mult: 1.2,
});

// toxin_reagents.dm:15
rt.def("/datum/reagent/toxin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.toxpwr) {
		yield* M.adjustToxLoss(this.toxpwr * REM, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3697, "/datum/reagent/toxin/mutagen", "/datum/reagent/toxin", {
	name: "Unstable mutagen",
	id: "mutagen",
	description: "Might cause unpredictable mutations. Keep away from children.",
	color: "#00FF00",
	taste_description: "slime",
	taste_mult: 0.9,
	toxpwr: 0,
});

// toxin_reagents.dm:37
rt.def("/datum/reagent/toxin/mutagen/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (!f.args[0].has_dna()) {
		return f.dot;
	}
	if (f.args[1] == VAPOR && prob(min(33, f.args[2])) || f.args[1] == INGEST || f.args[1] == PATCH || f.args[1] == INJECT) {
		yield* f.args[0].randmuti();
		if (prob(98)) {
			yield* f.args[0].randmutb();
		} else {
			yield* f.args[0].randmutg();
		}
		yield* f.args[0].updateappearance();
		yield* f.args[0].domutcheck();
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// toxin_reagents.dm:52
rt.def("/datum/reagent/toxin/mutagen/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.istype(M, T("/mob/living/carbon"))) {
		yield* M.apply_effect(5, "irradiate", 0);
	}
	return (yield* parent_proc());
}, true);

rt.type(3700, "/datum/reagent/toxin/plasma", "/datum/reagent/toxin", {
	name: "Plasma",
	id: "plasma",
	description: "Plasma in its liquid form.",
	taste_description: "bitterness",
	taste_mult: 1.5,
	color: "#8228A0",
	toxpwr: 3,
});

// toxin_reagents.dm:66
rt.def("/datum/reagent/toxin/plasma/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let C: Value = null;
	if (this.holder.has_reagent("epinephrine")) {
		yield* this.holder.remove_reagent("epinephrine", 2);
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		yield* (C = M).adjustPlasma(20);
	}
	return (yield* parent_proc());
}, true);

// toxin_reagents.dm:74
rt.def("/datum/reagent/toxin/plasma/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (!O || !reac_volume) {
		return 0;
	}
	O.atmos_spawn_air(`plasma=${reac_volume};TEMP=${T20C}`);
	return f.dot;
});

// toxin_reagents.dm:79
rt.def("/datum/reagent/toxin/plasma/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (rt.istype(_T, T("/turf/open"))) {
		_T.atmos_spawn_air(`plasma=${reac_volume};TEMP=${T20C}`);
	}
	return f.dot;
});

// toxin_reagents.dm:84
rt.def("/datum/reagent/toxin/plasma/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (f.args[1] == TOUCH || f.args[1] == VAPOR) {
		yield* f.args[0].adjust_fire_stacks(f.args[2] / 5);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3704, "/datum/reagent/toxin/lexorin", "/datum/reagent/toxin", {
	name: "Lexorin",
	id: "lexorin",
	description: "A powerful poison used to stop respiration.",
	color: "#7DC3A0",
	toxpwr: 0,
	taste_description: "acid",
});

// toxin_reagents.dm:102
rt.def("/datum/reagent/toxin/lexorin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let C: Value = null;
	f.dot = 1;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (!(C = M).dna || !C.dna.species) {
			return f.dot;
		}
		if (rt.isIn(f, NOBREATH, C.dna.species.species_traits)) {
			f.dot = 0;
		}
	}
	if (f.dot) {
		yield* M.adjustOxyLoss(5, 0);
		if (C) {
			C.losebreath += 2;
		}
		if (prob(20)) {
			yield* M.emote("gasp");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3705, "/datum/reagent/toxin/slimejelly", "/datum/reagent/toxin", {
	name: "Slime Jelly",
	id: "slimejelly",
	description: "A gooey semi-liquid produced from one of the deadliest lifeforms in existence. SO REAL.",
	color: "#801E28",
	toxpwr: 0,
	taste_description: "slime",
	taste_mult: 1.3,
});

// toxin_reagents.dm:126
rt.def("/datum/reagent/toxin/slimejelly/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(10)) {
		to_chat(M, "<span class='danger'>Your insides are burning!</span>");
		yield* M.adjustToxLoss(rand(20, 60) * REM, 0);
		f.dot = 1;
	} else if (prob(40)) {
		yield* M.heal_bodypart_damage(5, 0, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3706, "/datum/reagent/toxin/minttoxin", "/datum/reagent/toxin", {
	name: "Mint Toxin",
	id: "minttoxin",
	description: "Useful for dealing with undesirable customers.",
	color: "#CF3600",
	toxpwr: 0,
	taste_description: "mint",
});

// toxin_reagents.dm:144
rt.def("/datum/reagent/toxin/minttoxin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.bitAnd(M.disabilities, 32)) {
		yield* M.gib();
	}
	return (yield* parent_proc());
}, true);

rt.type(3708, "/datum/reagent/toxin/zombiepowder", "/datum/reagent/toxin", {
	name: "Zombie Powder",
	id: "zombiepowder",
	description: "A strong neurotoxin that puts the subject into a death-like state.",
	reagent_state: 1,
	color: "#669900",
	toxpwr: 0.5,
	taste_description: "death",
});

// toxin_reagents.dm:166
rt.def("/datum/reagent/toxin/zombiepowder/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	(rt.modField(f, M, "status_flags", FAKEDEATH, rt.bitOr));
	yield* M.adjustOxyLoss(0.5, 0);
	yield* M.Knockdown(100, 0);
	M.silent = max(M.silent, 5);
	M.tod = worldtime2text();
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

// toxin_reagents.dm:175
rt.def("/datum/reagent/toxin/zombiepowder/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	(rt.modField(f, M, "status_flags", 16769023, rt.bitAnd));
	parent_proc();
	return f.dot;
}, false);

rt.type(3709, "/datum/reagent/toxin/mindbreaker", "/datum/reagent/toxin", {
	name: "Mindbreaker Toxin",
	id: "mindbreaker",
	description: "A powerful hallucinogen. Not a thing to be messed with.",
	color: "#B31008",
	toxpwr: 0,
	taste_description: "sourness",
});

// toxin_reagents.dm:187
rt.def("/datum/reagent/toxin/mindbreaker/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.hallucination += 10;
	return (yield* parent_proc());
}, true);

rt.type(3710, "/datum/reagent/toxin/plantbgone", "/datum/reagent/toxin", {
	name: "Plant-B-Gone",
	id: "plantbgone",
	description: "A harmful toxic mixture to kill plantlife. Do not ingest!",
	color: "#49002E",
	toxpwr: 1,
	taste_mult: 1,
});

// toxin_reagents.dm:199
rt.def("/datum/reagent/toxin/plantbgone/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let alien_weeds: Value = null, SV: Value = null;
	if (rt.istype(O, T("/obj/structure/alien/weeds"))) {
		yield* (alien_weeds = O).take_damage(rand(15, 35), "brute", 0);
	} else if (rt.istype(O, T("/obj/structure/glowshroom"))) {
		yield* qdel(O);
	} else {
		if (!rt.istype(O, T("/obj/structure/spacevine"))) return f.dot;
		yield* (SV = O).on_chem_effect(this);
	}
	return f.dot;
}, true);

// toxin_reagents.dm:209
rt.def("/datum/reagent/toxin/plantbgone/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let C: Value = null;
	method ??= TOUCH;
	if (method != VAPOR) return f.dot;
	if (!rt.istype(M, T("/mob/living/carbon"))) return f.dot;
	if ((C = M).wear_mask) return f.dot;
	let damage: Value = min(round(0.4 * reac_volume, 0.1), 10);
	yield* C.adjustToxLoss(damage);
	return f.dot;
}, true);

rt.type(3712, "/datum/reagent/toxin/pestkiller", "/datum/reagent/toxin", {
	name: "Pest Killer",
	id: "pestkiller",
	description: "A harmful toxic mixture to kill pests. Do not ingest!",
	color: "#4B004B",
	toxpwr: 1,
});

// toxin_reagents.dm:230
rt.def("/datum/reagent/toxin/pestkiller/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let C: Value = null;
	method ??= TOUCH;
	if (method != VAPOR) return f.dot;
	if (!rt.istype(M, T("/mob/living/carbon"))) return f.dot;
	if ((C = M).wear_mask) return f.dot;
	let damage: Value = min(round(0.4 * reac_volume, 0.1), 10);
	yield* C.adjustToxLoss(damage);
	return f.dot;
}, true);

rt.type(3713, "/datum/reagent/toxin/spore", "/datum/reagent/toxin", {
	name: "Spore Toxin",
	id: "spore",
	description: "A natural toxin produced by blob spores that inhibits vision when ingested.",
	color: "#9ACD32",
	toxpwr: 1,
});

// toxin_reagents.dm:245
rt.def("/datum/reagent/toxin/spore/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.damageoverlaytemp = 60;
	yield* M.update_damage_hud();
	yield* M.blur_eyes(3);
	return (yield* parent_proc());
}, true);

rt.type(3714, "/datum/reagent/toxin/spore_burning", "/datum/reagent/toxin", {
	name: "Burning Spore Toxin",
	id: "spore_burning",
	description: "A natural toxin produced by blob spores that induces combustion in its victim.",
	color: "#9ACD32",
	toxpwr: 0.5,
	taste_description: "burning",
});

// toxin_reagents.dm:259
rt.def("/datum/reagent/toxin/spore_burning/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjust_fire_stacks(2);
	yield* M.IgniteMob();
	return (yield* parent_proc());
}, true);

rt.type(3715, "/datum/reagent/toxin/chloralhydrate", "/datum/reagent/toxin", {
	name: "Chloral Hydrate",
	id: "chloralhydrate",
	description: "A powerful sedative that induces confusion and drowsiness before putting its target to sleep.",
	reagent_state: 1,
	color: "#000067",
	toxpwr: 0,
	metabolization_rate: 0.6,
});

// toxin_reagents.dm:273
rt.def("/datum/reagent/toxin/chloralhydrate/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(this.current_cycle, 1, 10)) {
		M.confused += 2;
		M.drowsyness += 2;
	} else if (rt.inRange(this.current_cycle, 10, 50)) {
		yield* M.Sleeping(40, 0);
		f.dot = 1;
	} else if (rt.inRange(this.current_cycle, 51, 1e+31)) {
		yield* M.Sleeping(40, 0);
		yield* M.adjustToxLoss((this.current_cycle - 50) * REM, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3716, "/datum/reagent/toxin/chloralhydrate/delayed", "/datum/reagent/toxin/chloralhydrate", {
	id: "chloralhydrate2",
});

// toxin_reagents.dm:290
rt.def("/datum/reagent/toxin/chloralhydrate/delayed/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(this.current_cycle, 1, 10)) {
		return f.dot;
	} else if (rt.inRange(this.current_cycle, 10, 20)) {
		M.confused += 1;
		M.drowsyness += 1;
	} else if (rt.inRange(this.current_cycle, 20, 1e+31)) {
		yield* M.Sleeping(40, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3717, "/datum/reagent/toxin/beer2", "/datum/reagent/toxin", {
	name: "Beer",
	id: "beer2",
	description: "A specially-engineered sedative disguised as beer. It induces instant sleep in its target.",
	color: "#664300",
	metabolization_rate: 0.6,
	taste_description: "piss water",
	glass_icon_state: "beerglass",
	glass_name: "glass of beer",
	glass_desc: "A freezing pint of beer.",
});

// toxin_reagents.dm:312
rt.def("/datum/reagent/toxin/beer2/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(this.current_cycle, 1, 50)) {
		yield* M.Sleeping(40, 0);
	} else if (rt.inRange(this.current_cycle, 51, 1e+31)) {
		yield* M.Sleeping(40, 0);
		yield* M.adjustToxLoss((this.current_cycle - 50) * REM, 0);
	}
	return (yield* parent_proc());
}, true);

rt.type(3720, "/datum/reagent/toxin/mutetoxin", "/datum/reagent/toxin", {
	name: "Mute Toxin",
	id: "mutetoxin",
	description: "A nonlethal poison that inhibits speech in its victim.",
	color: "#F0F8FF",
	toxpwr: 0,
	taste_description: "silence",
});

// toxin_reagents.dm:345
rt.def("/datum/reagent/toxin/mutetoxin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.silent = max(M.silent, 3);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3721, "/datum/reagent/toxin/staminatoxin", "/datum/reagent/toxin", {
	name: "Tirizene",
	id: "tirizene",
	description: "A nonlethal poison that causes extreme fatigue and weakness in its victim.",
	color: "#6E2828",
	data: 13,
	toxpwr: 0,
});

// toxin_reagents.dm:357
rt.def("/datum/reagent/toxin/staminatoxin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustStaminaLoss(REM * this.data, 0);
	this.data = max(this.data - 1, 3);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3722, "/datum/reagent/toxin/polonium", "/datum/reagent/toxin", {
	name: "Polonium",
	id: "polonium",
	description: "An extremely radioactive material in liquid form. Ingestion results in fatal irradiation.",
	reagent_state: 2,
	color: "#787878",
	metabolization_rate: 0.05,
	toxpwr: 0,
});

// toxin_reagents.dm:372
rt.def("/datum/reagent/toxin/polonium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.radiation += 4;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3723, "/datum/reagent/toxin/histamine", "/datum/reagent/toxin", {
	name: "Histamine",
	id: "histamine",
	description: "Histamine's effects become more dangerous depending on the dosage amount. They range from mildly annoying to incredibly lethal.",
	reagent_state: 2,
	color: "#FA6464",
	metabolization_rate: 0.1,
	overdose_threshold: 30,
	toxpwr: 0,
});

// toxin_reagents.dm:386
rt.def("/datum/reagent/toxin/histamine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(50)) {
		const chosen = pick(1, 2, 3, 4);
		if (chosen === 1) {
			to_chat(M, "<span class='danger'>You can barely see!</span>");
			yield* M.blur_eyes(3);
		} else if (chosen === 2) {
			yield* M.emote("cough");
		} else if (chosen === 3) {
			yield* M.emote("sneeze");
		} else if (chosen === 4) {
			if (prob(75)) {
				to_chat(M, "You scratch at an itch.");
				yield* M.adjustBruteLoss(2, 0);
				f.dot = 1;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// toxin_reagents.dm:403
rt.def("/datum/reagent/toxin/histamine/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.adjustOxyLoss(2, 0);
	yield* M.adjustBruteLoss(2, 0);
	yield* M.adjustToxLoss(2, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3724, "/datum/reagent/toxin/formaldehyde", "/datum/reagent/toxin", {
	name: "Formaldehyde",
	id: "formaldehyde",
	description: "Formaldehyde, on its own, is a fairly weak toxin. It contains trace amounts of Histamine, very rarely making it decay into Histamine..",
	reagent_state: 2,
	color: "#B4004B",
	metabolization_rate: 0.2,
	toxpwr: 1,
});

// toxin_reagents.dm:419
rt.def("/datum/reagent/toxin/formaldehyde/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(5)) {
		yield* this.holder.add_reagent("histamine", pick(5, 15));
		yield* this.holder.remove_reagent("formaldehyde", 1.2);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(3725, "/datum/reagent/toxin/venom", "/datum/reagent/toxin", {
	name: "Venom",
	id: "venom",
	description: "An exotic poison extracted from highly toxic fauna. Causes scaling amounts of toxin damage and bruising depending and dosage. Often decays into Histamine.",
	reagent_state: 2,
	color: "#F0FFF0",
	metabolization_rate: 0.1,
	toxpwr: 0,
});

// toxin_reagents.dm:435
rt.def("/datum/reagent/toxin/venom/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	this.toxpwr = 0.2 * this.volume;
	yield* M.adjustBruteLoss(0.3 * this.volume * REM, 0);
	f.dot = 1;
	if (prob(15)) {
		yield* M.reagents.add_reagent("histamine", pick(5, 10));
		yield* M.reagents.remove_reagent("venom", 1.1);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(3726, "/datum/reagent/toxin/neurotoxin2", "/datum/reagent/toxin", {
	name: "Neurotoxin",
	id: "neurotoxin2",
	description: "Neurotoxin will inhibit brain function and cause toxin damage before eventually knocking out its victim.",
	reagent_state: 2,
	color: "#64916E",
	metabolization_rate: 0.2,
	toxpwr: 0,
});

// toxin_reagents.dm:454
rt.def("/datum/reagent/toxin/neurotoxin2/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.brainloss + M.toxloss <= 60) {
		yield* M.adjustBrainLoss(1);
		yield* M.adjustToxLoss(1, 0);
		f.dot = 1;
	}
	if (this.current_cycle >= 18) {
		yield* M.Sleeping(40, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3727, "/datum/reagent/toxin/cyanide", "/datum/reagent/toxin", {
	name: "Cyanide",
	id: "cyanide",
	description: "An infamous poison known for its use in assassination. Causes small amounts of toxin damage with a small chance of oxygen damage or a stun.",
	reagent_state: 2,
	color: "#00B4FF",
	metabolization_rate: 0.05,
	toxpwr: 1.25,
});

// toxin_reagents.dm:473
rt.def("/datum/reagent/toxin/cyanide/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(5)) {
		M.losebreath += 1;
	}
	if (prob(8)) {
		to_chat(M, "You feel horrendously weak!");
		yield* M.Stun(40, 0);
		yield* M.adjustToxLoss(2, 0);
	}
	return (yield* parent_proc());
}, true);

rt.type(3729, "/datum/reagent/toxin/itching_powder", "/datum/reagent/toxin", {
	name: "Itching Powder",
	id: "itching_powder",
	description: "A powder that induces itching upon contact with the skin. Causes the victim to scratch at their itches and has a very low chance to decay into Histamine.",
	reagent_state: 2,
	color: "#C8C8C8",
	metabolization_rate: 0.16000001,
	toxpwr: 0,
});

// toxin_reagents.dm:501
rt.def("/datum/reagent/toxin/itching_powder/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (!(method == TOUCH || method == VAPOR)) return f.dot;
	yield* M.reagents.add_reagent("itching_powder", reac_volume);
	return f.dot;
}, true);

// toxin_reagents.dm:505
rt.def("/datum/reagent/toxin/itching_powder/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(15)) {
		to_chat(M, "You scratch at your head.");
		yield* M.adjustBruteLoss(0.2, 0);
		f.dot = 1;
	}
	if (prob(15)) {
		to_chat(M, "You scratch at your leg.");
		yield* M.adjustBruteLoss(0.2, 0);
		f.dot = 1;
	}
	if (prob(15)) {
		to_chat(M, "You scratch at your arm.");
		yield* M.adjustBruteLoss(0.2, 0);
		f.dot = 1;
	}
	if (prob(3)) {
		yield* M.reagents.add_reagent("histamine", rand(1, 3));
		yield* M.reagents.remove_reagent("itching_powder", 1.2);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3730, "/datum/reagent/toxin/initropidril", "/datum/reagent/toxin", {
	name: "Initropidril",
	id: "initropidril",
	description: "A powerful poison with insidious effects. It can cause stuns, lethal breathing failure, and cardiac arrest.",
	reagent_state: 2,
	color: "#7F10C0",
	metabolization_rate: 0.2,
	toxpwr: 2.5,
});

// toxin_reagents.dm:533
rt.def("/datum/reagent/toxin/initropidril/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let picked_option: Value = null, H: Value = null;
	if (prob(25)) {
		const subject = (picked_option = rand(1, 3));
		if (subject === 1) {
			yield* M.Knockdown(60, 0);
			f.dot = 1;
		} else if (subject === 2) {
			M.losebreath += 10;
			yield* M.adjustOxyLoss(rand(5, 25), 0);
			f.dot = 1;
		} else if (subject === 3) {
			if (rt.istype(M, T("/mob/living/carbon/human"))) {
				if (!(H = M).undergoing_cardiac_arrest() && H.can_heartattack()) {
					H.set_heartattack(1);
					if (H.stat == 0) {
						H.visible_message(`<span class='userdanger'>${H} clutches at ${H.p_their()} chest as if ${H.p_their()} heart stopped!</span>`);
					}
				} else {
					H.losebreath += 10;
					yield* H.adjustOxyLoss(rand(5, 25), 0);
					f.dot = 1;
				}
			}
		}
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

rt.type(3731, "/datum/reagent/toxin/pancuronium", "/datum/reagent/toxin", {
	name: "Pancuronium",
	id: "pancuronium",
	description: "An undetectable toxin that swiftly incapacitates its victim. May also cause breathing failure.",
	reagent_state: 2,
	color: "#195096",
	metabolization_rate: 0.1,
	toxpwr: 0,
	taste_mult: 0,
});

// toxin_reagents.dm:567
rt.def("/datum/reagent/toxin/pancuronium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle >= 10) {
		yield* M.Stun(40, 0);
		f.dot = 1;
	}
	if (prob(20)) {
		M.losebreath += 4;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3732, "/datum/reagent/toxin/sodium_thiopental", "/datum/reagent/toxin", {
	name: "Sodium Thiopental",
	id: "sodium_thiopental",
	description: "Sodium Thiopental induces heavy weakness in its target as well as unconsciousness.",
	reagent_state: 2,
	color: "#6496FA",
	metabolization_rate: 0.3,
	toxpwr: 0,
});

// toxin_reagents.dm:584
rt.def("/datum/reagent/toxin/sodium_thiopental/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle >= 10) {
		yield* M.Sleeping(40, 0);
	}
	yield* M.adjustStaminaLoss(10, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3733, "/datum/reagent/toxin/sulfonal", "/datum/reagent/toxin", {
	name: "Sulfonal",
	id: "sulfonal",
	description: "A stealthy poison that deals minor toxin damage and eventually puts the target to sleep.",
	reagent_state: 2,
	color: "#7DC3A0",
	metabolization_rate: 0.05,
	toxpwr: 0.5,
});

// toxin_reagents.dm:600
rt.def("/datum/reagent/toxin/sulfonal/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle >= 22) {
		yield* M.Sleeping(40, 0);
	}
	return (yield* parent_proc());
}, true);

rt.type(3734, "/datum/reagent/toxin/amanitin", "/datum/reagent/toxin", {
	name: "Amanitin",
	id: "amanitin",
	description: "A very powerful delayed toxin. Upon full metabolization, a massive amount of toxin damage will be dealt depending on how long it has been in the victim's bloodstream.",
	reagent_state: 2,
	color: "#FFFFFF",
	toxpwr: 0,
	metabolization_rate: 0.2,
});

// toxin_reagents.dm:614
rt.def("/datum/reagent/toxin/amanitin/proc/on_mob_delete", function* on_mob_delete(f: Frame, M: Value) {
	let toxdamage: Value = this.current_cycle * 3 * REM;
	M.log_message(`has taken ${toxdamage} toxin damage from amanitin toxin`, "Attack log");
	yield* M.adjustToxLoss(toxdamage);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3735, "/datum/reagent/toxin/lipolicide", "/datum/reagent/toxin", {
	name: "Lipolicide",
	id: "lipolicide",
	description: "A powerful toxin that will destroy fat cells, massively reducing body weight in a short time. More deadly to those without nutriment in their body.",
	taste_description: "mothballs",
	reagent_state: 2,
	color: "#F0FFF0",
	metabolization_rate: 0.2,
	toxpwr: 0.5,
});

// toxin_reagents.dm:630
rt.def("/datum/reagent/toxin/lipolicide/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.nutrition <= NUTRITION_LEVEL_STARVING) {
		yield* M.adjustToxLoss(0.5, 0);
	}
	M.nutrition = max(M.nutrition - 3, 0);
	M.overeatduration = 0;
	return (yield* parent_proc());
}, true);

rt.type(3736, "/datum/reagent/toxin/coniine", "/datum/reagent/toxin", {
	name: "Coniine",
	id: "coniine",
	description: "Coniine metabolizes extremely slowly, but deals high amounts of toxin damage and stops breathing.",
	reagent_state: 2,
	color: "#7DC3A0",
	metabolization_rate: 0.024,
	toxpwr: 1.75,
});

// toxin_reagents.dm:646
rt.def("/datum/reagent/toxin/coniine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.losebreath += 5;
	return (yield* parent_proc());
}, true);

rt.type(3737, "/datum/reagent/toxin/spewium", "/datum/reagent/toxin", {
	name: "Spewium",
	id: "spewium",
	description: "A powerful emetic, causes uncontrollable vomiting.  May result in vomiting organs at high doses.",
	reagent_state: 2,
	color: "#2f6617",
	metabolization_rate: 0.4,
	overdose_threshold: 29,
	toxpwr: 0,
	taste_description: "vomit",
});

// toxin_reagents.dm:661
rt.def("/datum/reagent/toxin/spewium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let H: Value = null, R: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.current_cycle >= 11 && prob(min(50, this.current_cycle)) && rt.istype(M, T("/mob/living/carbon/human")))) return f.dot;
	yield* (H = M).vomit(10, prob(10), prob(50), rand(0, 4), 1, prob(30));
	for (R of each(M.reagents.reagent_list, T("/datum/reagent/toxin"))) {
		if (R != this) {
			yield* H.reagents.remove_reagent(R.id, 1);
		}
	}
	return f.dot;
}, true);

// toxin_reagents.dm:670
rt.def("/datum/reagent/toxin/spewium/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	let H: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.current_cycle >= 33 && prob(15) && rt.istype(M, T("/mob/living/carbon/human")))) return f.dot;
	yield* (H = M).spew_organ();
	yield* H.vomit(0, 1, 1, 4);
	to_chat(H, "<span class='userdanger'>You feel something lumpy come up as you vomit.</span>");
	return f.dot;
}, true);

rt.type(3738, "/datum/reagent/toxin/curare", "/datum/reagent/toxin", {
	name: "Curare",
	id: "curare",
	description: "Causes slight toxin damage followed by chain-stunning and oxygen damage.",
	reagent_state: 2,
	color: "#191919",
	metabolization_rate: 0.05,
	toxpwr: 1,
});

// toxin_reagents.dm:687
rt.def("/datum/reagent/toxin/curare/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle >= 11) {
		yield* M.Knockdown(60, 0);
	}
	yield* M.adjustOxyLoss(1, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3739, "/datum/reagent/toxin/heparin", "/datum/reagent/toxin", {
	name: "Heparin",
	id: "heparin",
	description: "A powerful anticoagulant. Victims will bleed uncontrollably and suffer scaling bruising.",
	reagent_state: 2,
	color: "#C8C8C8",
	metabolization_rate: 0.080000006,
	toxpwr: 0,
});

// toxin_reagents.dm:703
rt.def("/datum/reagent/toxin/heparin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let H: Value = null;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		(H = M).bleed_rate = min(H.bleed_rate + 2, 8);
		yield* H.adjustBruteLoss(1, 0);
		f.dot = 1;
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

rt.type(3740, "/datum/reagent/toxin/rotatium", "/datum/reagent/toxin", {
	name: "Rotatium",
	id: "rotatium",
	description: "A constantly swirling, oddly colourful fluid. Causes the consumer's sense of direction and hand-eye coordination to become wild.",
	reagent_state: 2,
	color: "#AC88CA",
	metabolization_rate: 0.24000001,
	toxpwr: 0.5,
	taste_description: "spinning",
});

// toxin_reagents.dm:722
rt.def("/datum/reagent/toxin/rotatium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let screens: Value = null, rotation: Value = null, whole_screen: Value = null;
	if (M.hud_used) {
		if (this.current_cycle >= 20 && this.current_cycle % 20 == 0) {
			screens = list(rt.index(M.hud_used.plane_masters, `${GAME_PLANE}`), rt.index(M.hud_used.plane_masters, `${LIGHTING_PLANE}`));
			rotation = min(round(this.current_cycle / 20), 89);
			for (whole_screen of each(screens)) {
				rt.op(f, "Animate", [2, 10], [null, whole_screen, "transform", matrix(rotation, 5), "time", 5, "easing", 7, "loop", -1]);
				rt.op(f, "Animate", [2, 6], ["transform", matrix(-rotation, 5), "time", 5, "easing", 7]);
			}
		}
	}
	return (yield* parent_proc());
}, true);

// toxin_reagents.dm:732
rt.def("/datum/reagent/toxin/rotatium/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	let screens: Value = null, whole_screen: Value = null;
	if (M && M.hud_used) {
		screens = list(rt.index(M.hud_used.plane_masters, `${GAME_PLANE}`), rt.index(M.hud_used.plane_masters, `${LIGHTING_PLANE}`));
		for (whole_screen of each(screens)) {
			rt.op(f, "Animate", [2, 8], [null, whole_screen, "transform", matrix(), "time", 5, "easing", 7]);
		}
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(3741, "/datum/reagent/toxin/skewium", "/datum/reagent/toxin", {
	name: "Skewium",
	id: "skewium",
	description: "A strange, dull coloured liquid that appears to warp back and forth inside its container. Causes any consumer to experience a visual phenomena similar to said warping.",
	reagent_state: 2,
	color: "#ADBDCD",
	metabolization_rate: 0.32000002,
	toxpwr: 0.25,
	taste_description: "skewing",
});

// toxin_reagents.dm:749
rt.def("/datum/reagent/toxin/skewium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let screens: Value = null, skew: Value = null, intensity: Value = null, newmatrix: Value = null, PM: Value = null, whole_screen: Value = null;
	if (M.hud_used) {
		if (this.current_cycle >= 5 && this.current_cycle % 3 == 0) {
			screens = list(rt.index(M.hud_used.plane_masters, `${GAME_PLANE}`), rt.index(M.hud_used.plane_masters, `${LIGHTING_PLANE}`));
			skew = matrix();
			intensity = 8;
			skew.set_skew(rand(-intensity, intensity), rand(-intensity, intensity));
			newmatrix = skew;
			if (prob(33)) {
				PM = rt.index(M.hud_used.plane_masters, `${GAME_PLANE}`);
				newmatrix = skew * PM.transform;
			}
			for (whole_screen of each(screens)) {
				rt.op(f, "Animate", [2, 10], [null, whole_screen, "transform", newmatrix, "time", 5, "easing", 7, "loop", -1]);
				rt.op(f, "Animate", [2, 6], ["transform", -newmatrix, "time", 5, "easing", 7]);
			}
		}
	}
	return (yield* parent_proc());
}, true);

// toxin_reagents.dm:767
rt.def("/datum/reagent/toxin/skewium/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	let screens: Value = null, whole_screen: Value = null;
	if (M && M.hud_used) {
		screens = list(rt.index(M.hud_used.plane_masters, `${GAME_PLANE}`), rt.index(M.hud_used.plane_masters, `${LIGHTING_PLANE}`));
		for (whole_screen of each(screens)) {
			rt.op(f, "Animate", [2, 8], [null, whole_screen, "transform", matrix(), "time", 5, "easing", 7]);
		}
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(3742, "/datum/reagent/toxin/anacea", "/datum/reagent/toxin", {
	name: "Anacea",
	id: "anacea",
	description: "A toxin that quickly purges medicines and metabolizes very slowly.",
	reagent_state: 2,
	color: "#3C5133",
	metabolization_rate: 0.032,
	toxpwr: 0.15,
});

// toxin_reagents.dm:785
rt.def("/datum/reagent/toxin/anacea/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let R: Value = null;
	let remove_amt: Value = 5;
	if (this.holder.has_reagent("calomel") || this.holder.has_reagent("pen_acid")) {
		remove_amt = 0.5;
	}
	for (R of each(M.reagents.reagent_list, T("/datum/reagent/medicine"))) {
		yield* M.reagents.remove_reagent(R.id, remove_amt);
	}
	return (yield* parent_proc());
}, true);

rt.type(3743, "/datum/reagent/toxin/acid", "/datum/reagent/toxin", {
	acidpwr: 10,
	name: "Sulphuric acid",
	id: "sacid",
	description: "A strong mineral acid with the molecular formula H2SO4.",
	color: "#00FF32",
	toxpwr: 1,
	taste_description: "acid",
});

// toxin_reagents.dm:804
rt.def("/datum/reagent/toxin/acid/proc/reaction_mob", function* reaction_mob(f: Frame, C: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		return f.dot;
	}
	reac_volume = round(reac_volume, 0.1);
	if (method == INGEST) {
		yield* C.adjustBruteLoss(min(6 * this.toxpwr, reac_volume * this.toxpwr));
		return f.dot;
	}
	if (method == INJECT) {
		yield* C.adjustBruteLoss(1.5 * min(6 * this.toxpwr, reac_volume * this.toxpwr));
		return f.dot;
	}
	yield* C.acid_act(this.acidpwr, reac_volume);
	return f.dot;
}, true);

// toxin_reagents.dm:816
rt.def("/datum/reagent/toxin/acid/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (ismob(O.loc)) {
		return f.dot;
	}
	reac_volume = round(reac_volume, 0.1);
	yield* O.acid_act(this.acidpwr, reac_volume);
	return f.dot;
}, true);

// toxin_reagents.dm:822
rt.def("/datum/reagent/toxin/acid/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!rt.istype(_T, T("/turf"))) {
		return f.dot;
	}
	reac_volume = round(reac_volume, 0.1);
	yield* _T.acid_act(this.acidpwr, reac_volume);
	return f.dot;
}, true);

rt.type(3744, "/datum/reagent/toxin/acid/fluacid", "/datum/reagent/toxin/acid", {
	name: "Fluorosulfuric acid",
	id: "facid",
	description: "Fluorosulfuric acid is a an extremely corrosive chemical substance.",
	color: "#5050FF",
	toxpwr: 2,
	acidpwr: 42,
});

// toxin_reagents.dm:836
rt.def("/datum/reagent/toxin/acid/fluacid/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustFireLoss(this.current_cycle / 10, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3746, "/datum/reagent/toxin/peaceborg/confuse", "/datum/reagent/toxin/peaceborg", {
	name: "Dizzying Solution",
	id: "dizzysolution",
	description: "Makes the target off balance and dizzy",
	toxpwr: 0,
	metabolization_rate: 0.6,
	taste_description: "dizziness",
});

// toxin_reagents.dm:849
rt.def("/datum/reagent/toxin/peaceborg/confuse/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.confused < 6) {
		M.confused = max(0, min(M.confused + 3, 5));
	}
	if (M.dizziness < 6) {
		M.dizziness = max(0, min(M.dizziness + 3, 5));
	}
	if (prob(20)) {
		to_chat(M, "You feel confused and disorientated.");
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3747, "/datum/reagent/toxin/peaceborg/tire", "/datum/reagent/toxin/peaceborg", {
	name: "Tiring Solution",
	id: "tiresolution",
	description: "An extremely weak stamina-toxin that tires out the target. Completely harmless.",
	toxpwr: 0,
	metabolization_rate: 0.6,
	taste_description: "tiredness",
});

// toxin_reagents.dm:866
rt.def("/datum/reagent/toxin/peaceborg/tire/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let healthcomp: Value = 100 - M.health;
	if (M.staminaloss < 45 - healthcomp) {
		yield* M.adjustStaminaLoss(10);
	}
	if (prob(30)) {
		to_chat(M, "You should sit down and take a rest...");
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3748, "/datum/reagent/toxin/delayed", "/datum/reagent/toxin", {
	actual_metaboliztion_rate: 0.4,
	actual_toxpwr: 5,
	delay: 30,
	name: "Toxin Microcapsules",
	id: "delayed_toxin",
	description: "Causes heavy toxin damage after a brief time of inactivity.",
	reagent_state: 2,
	metabolization_rate: 0,
	toxpwr: 0,
});

// toxin_reagents.dm:885
rt.def("/datum/reagent/toxin/delayed/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle > this.delay) {
		yield* this.holder.remove_reagent(this.id, this.actual_metaboliztion_rate * M.metabolism_efficiency);
		yield* M.adjustToxLoss(this.actual_toxpwr * REM, 0);
		if (prob(10)) {
			yield* M.Knockdown(20, 0);
		}
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);
