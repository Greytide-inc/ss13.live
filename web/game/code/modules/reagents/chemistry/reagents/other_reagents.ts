// Based on /tg/station's code/modules/reagents/chemistry/reagents/other_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(3599, "/datum/reagent/blood", "/datum/reagent", {
	data: null,
	name: "Blood",
	id: "blood",
	color: "#C80000",
	metabolization_rate: 5,
	taste_description: "iron",
	taste_mult: 1.3,
	glass_icon_state: "glass_red",
	glass_name: "glass of tomato juice",
	glass_desc: "Are you sure this is tomato juice?",
	shot_glass_icon_state: "shotglassred",
});

// other_reagents.dm:2
rt.def("/datum/reagent/blood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.data = rt.alist(f, ["donor", null, "viruses", null, "blood_DNA", null, "blood_type", null, "resistances", null, "trace_chem", null, "mind", null, "ckey", null, "gender", null, "real_name", null, "cloneable", null, "factions", null]);
	return f.dot;
});

// other_reagents.dm:15
rt.def("/datum/reagent/blood/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let D: Value = null, C: Value = null;
	method ??= TOUCH;
	if (this.data && rt.at(this.data, "viruses")) {
		for (D of each(rt.at(this.data, "viruses"), T("/datum/disease"))) {
			if (rt.bitAnd(D.spread_flags, SPECIAL) || rt.bitAnd(D.spread_flags, NON_CONTAGIOUS)) {
				continue;
			}
			if (method == TOUCH || method == VAPOR) {
				yield* M.ContractDisease(D);
			} else {
				yield* M.ForceContractDisease(D);
			}
		}
	}
	if (!(method == INJECT && rt.istype(M, T("/mob/living/carbon")))) return f.dot;
	if ((C = M).get_blood_id() != "blood") return f.dot;
	if (!this.data || !rt.isIn(f, rt.at(this.data, "blood_type"), get_safe_blood(C.dna.blood_type))) {
		yield* C.reagents.add_reagent("toxin", reac_volume * 0.5);
	} else {
		C.blood_volume = min(C.blood_volume + round(reac_volume, 0.1), BLOOD_VOLUME_MAXIMUM);
	}
	return f.dot;
}, true);

// other_reagents.dm:36
rt.def("/datum/reagent/blood/proc/on_new", function* on_new(f: Frame, data: Value) {
	if (!rt.istype(data, T("/list"))) return f.dot;
	yield* SetViruses(this, data);
	return f.dot;
}, true);

// other_reagents.dm:40
rt.def("/datum/reagent/blood/proc/on_merge", function* on_merge(f: Frame, mix_data: Value) {
	let mix1: Value = null, mix2: Value = null, to_mix: Value = null, AD: Value = null, preserve: Value = null, D: Value = null;
	if (this.data && mix_data) {
		rt.setAt(this.data, "cloneable", 0);
		if (rt.at(this.data, "viruses") || rt.at(mix_data, "viruses")) {
			mix1 = rt.at(this.data, "viruses");
			mix2 = rt.at(mix_data, "viruses");
			to_mix = list();
			for (AD of each(mix1, T("/datum/disease/advance"))) {
				to_mix += AD;
			}
			AD = null;
			for (AD of each(mix2, T("/datum/disease/advance"))) {
				to_mix += AD;
			}
			if (AD = (yield* Advance_Mix(to_mix))) {
				preserve = list(AD);
				for (D of each(rt.at(this.data, "viruses"))) {
					if (!rt.istype(D, T("/datum/disease/advance"))) {
						preserve += D;
					}
				}
				rt.setAt(this.data, "viruses", preserve);
			}
		}
	}
	return 1;
}, true);

// other_reagents.dm:65
rt.def("/datum/reagent/blood/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let B: Value = null, D: Value = null, newVirus: Value = null;
	if (!rt.istype(_T, T("/turf"))) {
		return f.dot;
	}
	if (reac_volume < 3) {
		return f.dot;
	}
	if (!(B = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood"), _T))) {
		B = (yield* new_(T("/obj/effect/decal/cleanable/blood"), _T));
	}
	if (rt.at(this.data, "blood_DNA")) {
		rt.setAt(B.blood_DNA, rt.at(this.data, "blood_DNA"), rt.at(this.data, "blood_type"));
	}
	for (D of each(rt.at(this.data, "viruses"), T("/datum/disease"))) {
		newVirus = (yield* D.Copy(1));
		B.viruses += newVirus;
		newVirus.holder = B;
	}
	return f.dot;
}, true);

rt.type(3601, "/datum/reagent/vaccine", "/datum/reagent", {
	name: "Vaccine",
	id: "vaccine",
	color: "#C81040",
	taste_description: "slime",
});

// other_reagents.dm:98
rt.def("/datum/reagent/vaccine/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let D: Value = null;
	method ??= TOUCH;
	if (!(rt.istype(this.data, T("/list")) && (method == INGEST || method == INJECT))) return f.dot;
	for (D of each(M.viruses, T("/datum/disease"))) {
		if (rt.isIn(f, (yield* D.GetDiseaseID()), this.data)) {
			yield* D.cure();
		}
	}
	(rt.modField(f, M, "resistances", this.data, rt.bitOr));
	return f.dot;
}, true);

// other_reagents.dm:105
rt.def("/datum/reagent/vaccine/proc/on_merge", function on_merge(f: Frame, data: Value) {
	if (!rt.istype(data, T("/list"))) return f.dot;
	(rt.modField(f, this, "data", data.Copy(), rt.bitOr));
	return f.dot;
});

rt.type(3602, "/datum/reagent/water", "/datum/reagent", {
	cooling_temperature: 2,
	name: "Water",
	id: "water",
	description: "A ubiquitous chemical substance that is composed of hydrogen and oxygen.",
	color: "#AAAAAA77",
	taste_description: "water",
	glass_icon_state: "glass_clear",
	glass_name: "glass of Water",
	glass_desc: "The father of all refreshments.",
	shot_glass_icon_state: "shotglassclear",
});

// other_reagents.dm:125
rt.def("/datum/reagent/water/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let M: Value = null, hotspot: Value = null, G: Value = null, A: Value = null;
	if (!rt.istype(_T, T("/turf/open"))) {
		return f.dot;
	}
	let CT: Value = this.cooling_temperature;
	if (reac_volume >= 5) {
		yield* _T.MakeSlippery({ min_wet_time: 10, wet_time_to_add: min(reac_volume * 1.5, 60) });
	}
	for (M of each(_T, T("/mob/living/simple_animal/slime"))) {
		yield* M.apply_water();
	}
	if ((hotspot = rt.locateIn(f, T("/obj/effect/hotspot"), _T)) && !rt.istype(_T, T("/turf/open/space"))) {
		if (_T.air) {
			(G = _T.air).temperature = max(min(G.temperature - CT * 1000, G.temperature / CT), 0);
			yield* G.react();
			yield* qdel(hotspot);
		}
	}
	if (!(A = rt.locateIn(f, T("/obj/effect/acid"), _T))) return f.dot;
	A.acid_level = max(A.acid_level - reac_volume * 50, 0);
	return f.dot;
}, true);

// other_reagents.dm:151
rt.def("/datum/reagent/water/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let cube: Value = null, dehy: Value = null, HH: Value = null, WL: Value = null;
	yield* O.extinguish();
	O.acid_level = 0;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"))) {
		yield* (cube = O).Expand();
	} else if (rt.istype(O, T("/obj/item/toy/carpplushie/dehy_carp"))) {
		yield* (dehy = O).Swell();
	} else {
		if (!rt.istype(O, T("/obj/item/stack/sheet/hairlesshide"))) return f.dot;
		HH = O;
		(WL = (yield* new_(T("/obj/item/stack/sheet/wetleather"), rt.getStep(f, HH, 0)))).amount = HH.amount;
		yield* qdel(HH);
	}
	return f.dot;
}, true);

// other_reagents.dm:174
rt.def("/datum/reagent/water/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (f.args[1] == TOUCH) {
		yield* f.args[0].adjust_fire_stacks(-(f.args[2] / 10));
		yield* f.args[0].ExtinguishMob();
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3603, "/datum/reagent/water/holywater", "/datum/reagent/water", {
	name: "Holy Water",
	id: "holywater",
	description: "Water blessed by some deity.",
	color: "#E0E8EF",
	glass_icon_state: "glass_clear",
	glass_name: "glass of Holy Water",
	glass_desc: "A glass of holy water.",
});

// other_reagents.dm:191
rt.def("/datum/reagent/water/holywater/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (is_servant_of_ratvar(f.args[0])) {
		to_chat(f.args[0], "<span class='userdanger'>A darkness begins to spread its unholy tendrils through your mind, purging the Justiciar's influence!</span>");
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// other_reagents.dm:196
rt.def("/datum/reagent/water/holywater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (!this.data) {
		this.data = 1;
	}
	this.data++;
	M.jitteriness = min(M.jitteriness + 4, 10);
	if (this.data >= 30) {
		if (!M.stuttering) {
			M.stuttering = 1;
		}
		M.stuttering = min(M.stuttering + 4, 10);
		M.Dizzy(5);
		if (iscultist(M) && prob(5)) {
			yield* M.say(pick("Av'te Nar'sie", "Pa'lid Mors", "INO INO ORA ANA", "SAT ANA!", "Daim'niodeis Arc'iai Le'eones", "R'ge Na'sie", "Diabo us Vo'iscum", "Eld' Mon Nobis"));
		} else if (is_servant_of_ratvar(M) && prob(8)) {
			const chosen = pick("speech", "message", "emote");
			if (chosen === "speech") {
				yield* clockwork_say(M, `...${text2ratvar(pick("Engine... your light grows dark...", "Where are you, master?", "He lies rusting in Error...", "Purge all untruths and... and... something..."))}`);
			} else if (chosen === "message") {
				to_chat(M, `<span class='boldwarning'>${pick("Ratvar's illumination of your mind has begun to flicker", "He lies rusting in Reebe, derelict and forgotten. And there he shall stay", "You can't save him. Nothing can save him now", "It seems that Nar-Sie will triumph after all")}.</span>`);
			} else if (chosen === "emote") {
				M.visible_message(`<span class='warning'>${M} ${pick("whimpers quietly", "shivers as though cold", "glances around in paranoia")}.</span>`);
			}
		}
	}
	if (this.data >= 75) {
		if (iscultist(M) || is_servant_of_ratvar(M)) {
			if (iscultist(M)) {
				yield* GLOB.SSticker.mode.remove_cultist(M.mind, 1, 1);
			} else if (is_servant_of_ratvar(M)) {
				yield* remove_servant_of_ratvar(M);
			}
			M.jitteriness = 0;
			M.stuttering = 0;
			yield* this.holder.remove_reagent(this.id, this.volume);
			return f.dot;
		}
	}
	yield* this.holder.remove_reagent(this.id, 0.4);
	return f.dot;
}, true);

// other_reagents.dm:228
rt.def("/datum/reagent/water/holywater/proc/reaction_turf", function* reaction_turf(f: Frame) {
	let R: Value = null;
	yield* parent_proc();
	if (!rt.istype(f.args[0], T("/turf"))) {
		return f.dot;
	}
	if (f.args[1] >= 10) {
		for (R of each(f.args[0], T("/obj/effect/rune"))) {
			yield* qdel(R);
		}
	}
	f.args[0].Bless();
	return f.dot;
}, true, { args: ["T", "reac_volume"] });

rt.type(3605, "/datum/reagent/fuel/unholywater", "/datum/reagent/fuel", {
	name: "Unholy Water",
	id: "unholywater",
	description: "Something that shouldn't exist on this plane of existence.",
	taste_description: "suffering",
});

// other_reagents.dm:242
rt.def("/datum/reagent/fuel/unholywater/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[1] == TOUCH || f.args[1] == VAPOR) {
		yield* f.args[0].reagents.add_reagent("unholywater", f.args[2] / 4);
		return f.dot;
	}
	return (yield* parent_proc());
}, true, { args: ["M", "method", "reac_volume"] });

// other_reagents.dm:248
rt.def("/datum/reagent/fuel/unholywater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (iscultist(M)) {
		M.drowsyness = max(M.drowsyness - 5, 0);
		yield* M.AdjustUnconscious(-20, 0);
		yield* M.AdjustStun(-40, 0);
		yield* M.AdjustKnockdown(-40, 0);
		yield* M.adjustToxLoss(-2, 0);
		yield* M.adjustOxyLoss(-2, 0);
		yield* M.adjustBruteLoss(-2, 0);
		yield* M.adjustFireLoss(-2, 0);
	} else {
		yield* M.adjustBrainLoss(3);
		yield* M.adjustToxLoss(1, 0);
		yield* M.adjustFireLoss(2, 0);
		yield* M.adjustOxyLoss(2, 0);
		yield* M.adjustBruteLoss(2, 0);
	}
	yield* this.holder.remove_reagent(this.id, 1);
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3606, "/datum/reagent/hellwater", "/datum/reagent", {
	name: "Hell Water",
	id: "hell_water",
	description: "YOUR FLESH! IT BURNS!",
	taste_description: "burning",
});

// other_reagents.dm:273
rt.def("/datum/reagent/hellwater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.fire_stacks = min(5, M.fire_stacks + 3);
	yield* M.IgniteMob();
	yield* M.adjustToxLoss(1, 0);
	yield* M.adjustFireLoss(1, 0);
	yield* M.adjustBrainLoss(5);
	yield* this.holder.remove_reagent(this.id, 1);
	return f.dot;
}, true);

rt.type(3607, "/datum/reagent/lube", "/datum/reagent", {
	name: "Space Lube",
	id: "lube",
	description: "Lubricant is a substance introduced between two moving surfaces to reduce the friction and wear between them. giggity.",
	color: "#009CA8",
	taste_description: "cherry",
});

// other_reagents.dm:294
rt.def("/datum/reagent/lube/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!rt.istype(_T, T("/turf/open"))) {
		return f.dot;
	}
	if (!(reac_volume >= 1)) return f.dot;
	yield* _T.MakeSlippery(TURF_WET_LUBE, 15, min(reac_volume * 2, 120));
	return f.dot;
}, true);

rt.type(3608, "/datum/reagent/spraytan", "/datum/reagent", {
	name: "Spray Tan",
	id: "spraytan",
	description: "A substance applied to the skin to darken the skin.",
	color: "#FFC080",
	metabolization_rate: 4,
	overdose_threshold: 11,
	taste_description: "sour oranges",
});

// other_reagents.dm:309
rt.def("/datum/reagent/spraytan/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let N: Value = null, newcolor: Value = null, len: Value = null, i: Value = null, ascii: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon/human"))) {
		if (f.args[1] == PATCH || f.args[1] == VAPOR) {
			if ((N = f.args[0]).dna.species.id == "human") {
				if (N.skin_tone === "african1") {
					N.skin_tone = "african2";
				} else if (N.skin_tone === "indian") {
					N.skin_tone = "african1";
				} else if (N.skin_tone === "arab") {
					N.skin_tone = "indian";
				} else if (N.skin_tone === "asian2") {
					N.skin_tone = "arab";
				} else if (N.skin_tone === "asian1") {
					N.skin_tone = "asian2";
				} else if (N.skin_tone === "mediterranean") {
					N.skin_tone = "african1";
				} else if (N.skin_tone === "latino") {
					N.skin_tone = "mediterranean";
				} else if (N.skin_tone === "caucasian3") {
					N.skin_tone = "mediterranean";
				} else if (N.skin_tone === "caucasian2") {
					N.skin_tone = pick("caucasian3", "latino");
				} else if (N.skin_tone === "caucasian1") {
					N.skin_tone = "caucasian2";
				} else if (N.skin_tone === "albino") {
					N.skin_tone = "caucasian1";
				}
			}
			if (rt.isIn(f, 1, N.dna.species.species_traits)) {
				newcolor = "";
				len = rt.length(rt.index(N.dna.features, "mcolor"));
				i = 1;
				while (i <= len) {
					const subject = (ascii = text2ascii(rt.index(N.dna.features, "mcolor"), i));
					if (subject === 48) {
						newcolor += "0";
					} else if (rt.inRange(subject, 49, 57)) {
						newcolor += ascii2text(ascii - 1);
					} else if (subject === 97) {
						newcolor += "9";
					} else if (rt.inRange(subject, 98, 102)) {
						newcolor += ascii2text(ascii - 1);
					} else if (subject === 65) {
						newcolor += "9";
					} else if (rt.inRange(subject, 66, 70)) {
						newcolor += ascii2text(ascii + 31);
					} else {
						break;
					}
					i += 1;
				}
				if (rt.index(ReadHSV(newcolor), 3) >= rt.index(ReadHSV("#7F7F7F"), 3)) {
					rt.setAt(N.dna.features, "mcolor", newcolor);
				}
			}
			yield* N.regenerate_icons();
		}
		if (f.args[1] == INGEST) {
			if (f.args[3]) {
				to_chat(f.args[0], "<span class='notice'>That tasted horrible.</span>");
			}
			yield* f.args[0].AdjustStun(40);
			yield* f.args[0].AdjustKnockdown(40);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

// other_reagents.dm:374
rt.def("/datum/reagent/spraytan/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	let N: Value = null;
	this.metabolization_rate = REAGENTS_METABOLISM;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		(N = M).hair_style = "Spiky";
		N.facial_hair_style = "Shaved";
		N.facial_hair_color = "000";
		N.hair_color = "000";
		if (!rt.isIn(f, HAIR, N.dna.species.species_traits)) {
			N.dna.species.species_traits += HAIR;
		}
		if (N.dna.species.use_skintones) {
			N.skin_tone = "orange";
		} else if (rt.isIn(f, MUTCOLORS, N.dna.species.species_traits)) {
			rt.setAt(N.dna.features, "mcolor", "f80");
		}
		yield* N.regenerate_icons();
		if (prob(7)) {
			if (N.w_uniform) {
				M.visible_message(pick(`<b>${M}</b>'s collar pops up without warning.</span>`, `<b>${M}</b> flexes ${M.p_their()} arms.`));
			} else {
				M.visible_message(`<b>${M}</b> flexes ${M.p_their()} arms.`);
			}
		}
	}
	if (prob(10)) {
		yield* M.say(pick("Shit was SO cash.", "You are everything bad in the world.", "What sports do you play, other than 'jack off to naked drawn Japanese people?'", "Don’t be a stranger. Just hit me with your best shot.", "My name is John and I hate every single one of you."));
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3609, "/datum/reagent/stableslimetoxin", "/datum/reagent", {
	mutationtext: "<span class='danger'>The pain subsides. You feel... human.</span>",
	race: rt.typePath("/datum/species/human"),
	name: "Stable Mutation Toxin",
	id: "stablemutationtoxin",
	description: "A humanizing toxin produced by slimes.",
	color: "#5EFF3B",
	metabolization_rate: 1e+31,
	taste_description: "slime",
});

// other_reagents.dm:408
rt.def("/datum/reagent/stableslimetoxin/proc/on_mob_life", function* on_mob_life(f: Frame, H: Value) {
	yield* parent_proc();
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	to_chat(H, "<span class='warning'><b>You crumple in agony as your flesh wildly morphs into new forms!</b></span>");
	H.visible_message(`<b>${H}</b> falls to the ground and screams as ${H.p_their()} skin bubbles and froths!`);
	yield* H.Knockdown(60, 0);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/reagent/stableslimetoxin/proc/mutate"), H)), 30);
	return f.dot;
}, true);

// other_reagents.dm:418
rt.def("/datum/reagent/stableslimetoxin/proc/mutate", function* mutate(f: Frame, H: Value) {
	let mutation: Value = null;
	if (!H || H.gc_destroyed) {
		return f.dot;
	}
	let current_species: Value = H.dna.species.type;
	if ((mutation = this.race) && mutation != current_species) {
		to_chat(H, this.mutationtext);
		yield* H.set_species(mutation);
	} else {
		to_chat(H, "<span class='danger'>The pain vanishes suddenly. You feel no different.</span>");
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

rt.type(3623, "/datum/reagent/stableslimetoxin/unstable", "/datum/reagent/stableslimetoxin", {
	name: "Unstable Mutation Toxin",
	id: "unstablemutationtoxin",
	description: "An unstable and unpredictable corruptive toxin produced by slimes.",
	color: "#5EFF3B",
	mutationtext: "<span class='danger'>The pain subsides. You feel... different.</span>",
});

// other_reagents.dm:544
rt.def("/datum/reagent/stableslimetoxin/unstable/proc/on_mob_life", function* on_mob_life(f: Frame, H: Value) {
	let type: Value = null, S: Value = null;
	let possible_morphs: Value = list();
	for (type of each(typesof(T("/datum/species")) - T("/datum/species"))) {
		if (rt.initial(f, (S = type), "blacklisted")) {
			continue;
		}
		possible_morphs += S;
	}
	this.race = pick(possible_morphs);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3624, "/datum/reagent/mulligan", "/datum/reagent", {
	name: "Mulligan Toxin",
	id: "mulligan",
	description: "This toxin will rapidly change the DNA of human beings. Commonly used by Syndicate spies and assassins in need of an emergency ID change.",
	color: "#5EFF3B",
	metabolization_rate: 1e+31,
	taste_description: "slime",
});

// other_reagents.dm:562
rt.def("/datum/reagent/mulligan/proc/on_mob_life", function* on_mob_life(f: Frame, H: Value) {
	to_chat(H, "<span class='warning'><b>You grit your teeth in pain as your body rapidly mutates!</b></span>");
	H.visible_message(`<b>${H}</b> suddenly transforms!`);
	yield* randomize_human(H);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3625, "/datum/reagent/aslimetoxin", "/datum/reagent", {
	name: "Advanced Mutation Toxin",
	id: "amutationtoxin",
	description: "An advanced corruptive toxin produced by slimes.",
	color: "#13BC5E",
	taste_description: "slime",
});

// other_reagents.dm:575
rt.def("/datum/reagent/aslimetoxin/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (method == TOUCH) return f.dot;
	yield* M.ForceContractDisease((yield* new_(T("/datum/disease/transformation/slime"), 0)));
	return f.dot;
}, true);

rt.type(3626, "/datum/reagent/gluttonytoxin", "/datum/reagent", {
	name: "Gluttony's Blessing",
	id: "gluttonytoxin",
	description: "An advanced corruptive toxin produced by something terrible.",
	color: "#5EFF3B",
	can_synth: 0,
	taste_description: "decay",
});

// other_reagents.dm:587
rt.def("/datum/reagent/gluttonytoxin/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	yield* M.ForceContractDisease((yield* new_(T("/datum/disease/transformation/morph"), 0)));
	return f.dot;
}, true);

rt.type(3627, "/datum/reagent/serotrotium", "/datum/reagent", {
	name: "Serotrotium",
	id: "serotrotium",
	description: "A chemical compound that promotes concentrated production of the serotonin neurotransmitter in humans.",
	color: "#202040",
	metabolization_rate: 0.1,
	taste_description: "bitterness",
});

// other_reagents.dm:598
rt.def("/datum/reagent/serotrotium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (prob(7)) {
			yield* M.emote(pick("twitch", "drool", "moan", "gasp"));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3628, "/datum/reagent/oxygen", "/datum/reagent", {
	name: "Oxygen",
	id: "oxygen",
	description: "A colorless, odorless gas. Grows on trees but is still pretty valuable.",
	reagent_state: 3,
	color: "#808080",
	taste_mult: 0,
});

// other_reagents.dm:612
rt.def("/datum/reagent/oxygen/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (!O || !reac_volume) {
		return 0;
	}
	O.atmos_spawn_air(`o2=${reac_volume / 2};TEMP=${T20C}`);
	return f.dot;
});

// other_reagents.dm:617
rt.def("/datum/reagent/oxygen/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (rt.istype(_T, T("/turf/open"))) {
		_T.atmos_spawn_air(`o2=${reac_volume / 2};TEMP=${T20C}`);
	}
	return f.dot;
});

rt.type(3630, "/datum/reagent/nitrogen", "/datum/reagent", {
	name: "Nitrogen",
	id: "nitrogen",
	description: "A colorless, odorless, tasteless gas. A simple asphyxiant that can silently displace vital oxygen.",
	reagent_state: 3,
	color: "#808080",
	taste_mult: 0,
});

// other_reagents.dm:638
rt.def("/datum/reagent/nitrogen/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (!O || !reac_volume) {
		return 0;
	}
	O.atmos_spawn_air(`n2=${reac_volume / 2};TEMP=${T20C}`);
	return f.dot;
});

// other_reagents.dm:643
rt.def("/datum/reagent/nitrogen/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (rt.istype(_T, T("/turf/open"))) {
		_T.atmos_spawn_air(`n2=${reac_volume / 2};TEMP=${T20C}`);
	}
	return f.dot;
});

rt.type(3633, "/datum/reagent/mercury", "/datum/reagent", {
	name: "Mercury",
	id: "mercury",
	description: "A curious metal that's a liquid at room temperature. Neurodegenerative and very bad for the mind.",
	color: "#484848",
	taste_mult: 0,
});

// other_reagents.dm:671
rt.def("/datum/reagent/mercury/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.canmove && !rt.istype(M.loc, T("/turf/open/space"))) {
		yield* step(M, pick(GLOB.cardinal));
	}
	if (prob(5)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* M.adjustBrainLoss(2);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3635, "/datum/reagent/carbon", "/datum/reagent", {
	name: "Carbon",
	id: "carbon",
	description: "A crumbly black solid that, while unexciting on an physical level, forms the base of all known life. Kind of a big deal.",
	reagent_state: 1,
	color: "#1C1300",
	taste_description: "sour chalk",
});

// other_reagents.dm:695
rt.def("/datum/reagent/carbon/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let D: Value = null;
	if (rt.istype(_T, T("/turf/open/space"))) return f.dot;
	if (D = rt.locateIn(f, T("/obj/effect/decal/cleanable/dirt"), _T.contents)) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/dirt"), _T);
	return f.dot;
}, true);

rt.type(3636, "/datum/reagent/chlorine", "/datum/reagent", {
	name: "Chlorine",
	id: "chlorine",
	description: "A pale yellow gas that's well known as an oxidizer. While it forms many harmless molecules in its elemental form it is far from harmless.",
	reagent_state: 3,
	color: "#808080",
	taste_description: "chlorine",
});

// other_reagents.dm:709
rt.def("/datum/reagent/chlorine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.take_bodypart_damage(1, 0, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3637, "/datum/reagent/fluorine", "/datum/reagent", {
	name: "Fluorine",
	id: "fluorine",
	description: "A comically-reactive chemical element. The universe does not want this stuff to exist in this form in the slightest.",
	reagent_state: 3,
	color: "#808080",
	taste_description: "acid",
});

// other_reagents.dm:722
rt.def("/datum/reagent/fluorine/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustToxLoss(1, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3640, "/datum/reagent/lithium", "/datum/reagent", {
	name: "Lithium",
	id: "lithium",
	description: "A silver metal, its claim to fame is its remarkably low density. Using it is a bit too effective in calming oneself down.",
	reagent_state: 1,
	color: "#808080",
	taste_description: "metal",
});

// other_reagents.dm:751
rt.def("/datum/reagent/lithium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.canmove && !rt.istype(M.loc, T("/turf/open/space"))) {
		yield* step(M, pick(GLOB.cardinal));
	}
	if (prob(5)) {
		yield* M.emote(pick("twitch", "drool", "moan"));
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3642, "/datum/reagent/radium", "/datum/reagent", {
	name: "Radium",
	id: "radium",
	description: "Radium is an alkaline earth metal. It is extremely radioactive.",
	reagent_state: 1,
	color: "#C7C7C7",
	taste_description: "the colour blue and regret",
});

// other_reagents.dm:773
rt.def("/datum/reagent/radium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.apply_effect(2 / M.metabolism_efficiency, "irradiate", 0);
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:777
rt.def("/datum/reagent/radium/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let GG: Value = null;
	if (!(reac_volume >= 3)) return f.dot;
	if (rt.istype(_T, T("/turf/open/space"))) return f.dot;
	if (!(GG = rt.locateIn(f, T("/obj/effect/decal/cleanable/greenglow"), _T.contents))) {
		GG = (yield* new_(T("/obj/effect/decal/cleanable/greenglow"), _T));
	}
	yield* GG.reagents.add_reagent("radium", reac_volume);
	return f.dot;
}, true);

rt.type(3644, "/datum/reagent/space_cleaner/sterilizine", "/datum/reagent/space_cleaner", {
	name: "Sterilizine",
	id: "sterilizine",
	description: "Sterilizes wounds in preparation for surgery.",
	color: "#C8A5DC",
	taste_description: "bitterness",
});

// other_reagents.dm:792
rt.def("/datum/reagent/space_cleaner/sterilizine/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let C: Value = null, s: Value = null, S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon")) && rt.isIn(f, f.args[1], list(TOUCH, VAPOR, PATCH))) {
		C = f.args[0];
		for (s of each(C.surgeries)) {
			(S = s).success_multiplier = max(0.2, S.success_multiplier);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3646, "/datum/reagent/iron", "/datum/reagent", {
	name: "Iron",
	id: "iron",
	description: "Pure iron is a metal.",
	reagent_state: 1,
	taste_description: "iron",
	color: "#C8A5DC",
});

// other_reagents.dm:810
rt.def("/datum/reagent/iron/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let C: Value = null;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if ((C = M).blood_volume < BLOOD_VOLUME_NORMAL) {
			C.blood_volume += 0.5;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:817
rt.def("/datum/reagent/iron/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (f.args[0].has_bane("iron")) {
		if (this.holder && this.holder.chem_temp < 100) {
			yield* f.args[0].reagents.add_reagent("toxin", f.args[2]);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3648, "/datum/reagent/silver", "/datum/reagent", {
	name: "Silver",
	id: "silver",
	description: "A soft, white, lustrous transition metal, it has the highest electrical conductivity of any element and the highest thermal conductivity of any metal.",
	reagent_state: 1,
	color: "#D0D0D0",
	taste_description: "expensive yet reasonable metal",
});

// other_reagents.dm:841
rt.def("/datum/reagent/silver/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (f.args[0].has_bane("silver")) {
		yield* f.args[0].reagents.add_reagent("toxin", f.args[2]);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3649, "/datum/reagent/uranium", "/datum/reagent", {
	name: "Uranium",
	id: "uranium",
	description: "A silvery-white metallic chemical element in the actinide series, weakly radioactive.",
	reagent_state: 1,
	color: "#B8B8C0",
	taste_description: "the inside of a reactor",
});

// other_reagents.dm:856
rt.def("/datum/reagent/uranium/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.apply_effect(1 / M.metabolism_efficiency, "irradiate", 0);
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:860
rt.def("/datum/reagent/uranium/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let GG: Value = null;
	if (!(reac_volume >= 3)) return f.dot;
	if (rt.istype(_T, T("/turf/open/space"))) return f.dot;
	if (!(GG = rt.locateIn(f, T("/obj/effect/decal/cleanable/greenglow"), _T.contents))) {
		GG = (yield* new_(T("/obj/effect/decal/cleanable/greenglow"), _T));
	}
	yield* GG.reagents.add_reagent("uranium", reac_volume);
	return f.dot;
}, true);

rt.type(3653, "/datum/reagent/bluespace", "/datum/reagent", {
	name: "Bluespace Dust",
	id: "bluespace",
	description: "A dust composed of microscopic bluespace crystals, with minor space-warping properties.",
	reagent_state: 1,
	color: "#0000CC",
	taste_description: "fizzling blue",
});

// other_reagents.dm:876
rt.def("/datum/reagent/bluespace/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (f.args[1] == TOUCH || f.args[1] == VAPOR) {
		yield* do_teleport(f.args[0], rt.getStep(f, f.args[0], 0), f.args[2] / 5, { asoundin: rt.rsc("sound/effects/phasein.ogg") });
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// other_reagents.dm:881
rt.def("/datum/reagent/bluespace/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle > 10 && prob(15)) {
		to_chat(M, "<span class='warning'>You feel unstable...</span>");
		M.Jitter(2);
		this.current_cycle = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/do_teleport"), M, rt.getStep(f, M, 0), 5, null, null, null, rt.rsc("sound/effects/phasein.ogg"))), 30);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3604, "/datum/reagent/fuel", "/datum/reagent", {
	name: "Welding fuel",
	id: "welding_fuel",
	description: "Required for welders. Flamable.",
	color: "#660000",
	taste_description: "gross metal",
	glass_icon_state: "dr_gibb_glass",
	glass_name: "glass of welder fuel",
	glass_desc: "Unless you're an industrial tool, this is probably not safe for consumption.",
});

// other_reagents.dm:915
rt.def("/datum/reagent/fuel/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (f.args[1] == TOUCH || f.args[1] == VAPOR) {
		yield* f.args[0].adjust_fire_stacks(f.args[2] / 10);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// other_reagents.dm:923
rt.def("/datum/reagent/fuel/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustToxLoss(1, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3643, "/datum/reagent/space_cleaner", "/datum/reagent", {
	name: "Space cleaner",
	id: "cleaner",
	description: "A compound used to clean things. Now with 50% more sodium hypochlorite!",
	color: "#A5F0EE",
	taste_description: "sourness",
});

// other_reagents.dm:935
rt.def("/datum/reagent/space_cleaner/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (rt.istype(O, T("/obj/effect/decal/cleanable"))) {
		yield* qdel(O);
	} else {
		if (!O) return f.dot;
		O.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
		O.clean_blood();
	}
	return f.dot;
}, true);

// other_reagents.dm:943
rt.def("/datum/reagent/space_cleaner/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let C: Value = null, M: Value = null;
	if (!(reac_volume >= 1)) return f.dot;
	_T.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
	_T.clean_blood();
	for (C of each(_T, T("/obj/effect/decal/cleanable"))) {
		yield* qdel(C);
	}
	for (M of each(_T, T("/mob/living/simple_animal/slime"))) {
		yield* M.adjustToxLoss(rand(5, 10));
	}
	return f.dot;
}, true);

// other_reagents.dm:953
rt.def("/datum/reagent/space_cleaner/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let H: Value = null, I: Value = null;
	method ??= TOUCH;
	if (!(method == TOUCH || method == VAPOR)) return f.dot;
	M.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
	if (!rt.istype(M, T("/mob/living/carbon"))) return f.dot;
	let C: Value = M;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = M).lip_style) {
			H.lip_style = null;
			yield* H.update_body();
		}
	}
	for (I of each(C.held_items, T("/obj/item"))) {
		I.clean_blood();
	}
	if (C.wear_mask) {
		if (C.wear_mask.clean_blood()) {
			yield* C.update_inv_wear_mask();
		}
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = C).head) {
			if (H.head.clean_blood()) {
				yield* H.update_inv_head();
			}
		}
		if (H.wear_suit) {
			if (H.wear_suit.clean_blood()) {
				yield* H.update_inv_wear_suit();
			}
		} else if (H.w_uniform) {
			if (H.w_uniform.clean_blood()) {
				yield* H.update_inv_w_uniform();
			}
		}
		if (H.shoes) {
			if (H.shoes.clean_blood()) {
				H.update_inv_shoes();
			}
		}
		H.wash_cream();
	}
	M.clean_blood();
	return f.dot;
}, true);

rt.type(3645, "/datum/reagent/space_cleaner/ez_clean", "/datum/reagent/space_cleaner", {
	name: "EZ Clean",
	id: "ez_clean",
	description: "A powerful, acidic cleaner sold by Waffle Co. Affects organic matter while leaving other objects unaffected.",
	metabolization_rate: 0.6,
	taste_description: "acid",
});

// other_reagents.dm:992
rt.def("/datum/reagent/space_cleaner/ez_clean/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(3.33);
	yield* M.adjustFireLoss(3.33);
	yield* M.adjustToxLoss(3.33);
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:998
rt.def("/datum/reagent/space_cleaner/ez_clean/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	yield* parent_proc();
	if (!((f.args[1] == TOUCH || f.args[1] == VAPOR) && !rt.istype(f.args[0], T("/mob/living/silicon")))) return f.dot;
	yield* f.args[0].adjustBruteLoss(1);
	yield* f.args[0].adjustFireLoss(1);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3656, "/datum/reagent/cryptobiolin", "/datum/reagent", {
	name: "Cryptobiolin",
	id: "cryptobiolin",
	description: "Cryptobiolin causes confusion and dizziness.",
	color: "#C8A5DC",
	metabolization_rate: 0.6,
	taste_description: "sourness",
});

// other_reagents.dm:1012
rt.def("/datum/reagent/cryptobiolin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.Dizzy(1);
	if (!M.confused) {
		M.confused = 1;
	}
	M.confused = max(M.confused, 20);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3657, "/datum/reagent/impedrezene", "/datum/reagent", {
	name: "Impedrezene",
	id: "impedrezene",
	description: "Impedrezene is a narcotic that impedes one's ability by slowing down the higher brain cell functions.",
	color: "#C8A5DC",
	taste_description: "numbness",
});

// other_reagents.dm:1026
rt.def("/datum/reagent/impedrezene/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.jitteriness = max(M.jitteriness - 5, 0);
	if (prob(80)) {
		yield* M.adjustBrainLoss(1);
	}
	if (prob(50)) {
		M.drowsyness = max(M.drowsyness, 3);
	}
	if (prob(10)) {
		yield* M.emote("drool");
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3658, "/datum/reagent/nanites", "/datum/reagent", {
	name: "Nanomachines",
	id: "nanomachines",
	description: "Microscopic construction robots.",
	color: "#535E66",
	can_synth: 0,
	taste_description: "sludge",
});

// other_reagents.dm:1044
rt.def("/datum/reagent/nanites/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	method ??= TOUCH;
	show_message ??= 1;
	touch_protection ??= 0;
	if (!(method == PATCH || method == INGEST || method == INJECT || method == VAPOR && prob(min(reac_volume, 100) * (1 - touch_protection)))) return f.dot;
	yield* M.ForceContractDisease((yield* new_(T("/datum/disease/transformation/robot"), 0)));
	return f.dot;
}, true);

rt.type(3659, "/datum/reagent/xenomicrobes", "/datum/reagent", {
	name: "Xenomicrobes",
	id: "xenomicrobes",
	description: "Microbes with an entirely alien cellular structure.",
	color: "#535E66",
	can_synth: 0,
	taste_description: "sludge",
});

// other_reagents.dm:1056
rt.def("/datum/reagent/xenomicrobes/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	method ??= TOUCH;
	show_message ??= 1;
	touch_protection ??= 0;
	if (!(method == PATCH || method == INGEST || method == INJECT || method == VAPOR && prob(min(reac_volume, 100) * (1 - touch_protection)))) return f.dot;
	yield* M.ContractDisease((yield* new_(T("/datum/disease/transformation/xeno"), 0)));
	return f.dot;
}, true);

rt.type(3660, "/datum/reagent/fungalspores", "/datum/reagent", {
	name: "Tubercle bacillus Cosmosis microbes",
	id: "fungalspores",
	description: "Active fungal spores.",
	color: "#92D17D",
	taste_description: "slime",
});

// other_reagents.dm:1067
rt.def("/datum/reagent/fungalspores/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	method ??= TOUCH;
	show_message ??= 1;
	touch_protection ??= 0;
	if (!(method == PATCH || method == INGEST || method == INJECT || method == VAPOR && prob(min(reac_volume, 100) * (1 - touch_protection)))) return f.dot;
	yield* M.ForceContractDisease((yield* new_(T("/datum/disease/tuberculosis"), 0)));
	return f.dot;
}, true);

rt.type(3665, "/datum/reagent/carbondioxide", "/datum/reagent", {
	name: "Carbon Dioxide",
	id: "co2",
	reagent_state: 3,
	description: "A gas commonly produced by burning carbon fuels. You're constantly producing this in your lungs.",
	color: "#B0B0B0",
	taste_description: "something unknowable",
});

// other_reagents.dm:1109
rt.def("/datum/reagent/carbondioxide/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (!O || !reac_volume) {
		return 0;
	}
	O.atmos_spawn_air(`co2=${reac_volume / 5};TEMP=${T20C}`);
	return f.dot;
});

// other_reagents.dm:1114
rt.def("/datum/reagent/carbondioxide/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (rt.istype(_T, T("/turf/open"))) {
		_T.atmos_spawn_air(`co2=${reac_volume / 5};TEMP=${T20C}`);
	}
	return f.dot;
});

rt.type(3666, "/datum/reagent/nitrous_oxide", "/datum/reagent", {
	name: "Nitrous Oxide",
	id: "nitrous_oxide",
	description: "A potent oxidizer used as fuel in rockets and as an anaesthetic during surgery.",
	reagent_state: 2,
	metabolization_rate: 0.6,
	color: "#808080",
	taste_description: "sweetness",
});

// other_reagents.dm:1128
rt.def("/datum/reagent/nitrous_oxide/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (!O || !reac_volume) {
		return 0;
	}
	O.atmos_spawn_air(`n2o=${reac_volume / 5};TEMP=${T20C}`);
	return f.dot;
});

// other_reagents.dm:1133
rt.def("/datum/reagent/nitrous_oxide/proc/reaction_turf", function reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!rt.istype(_T, T("/turf/open"))) return f.dot;
	_T.atmos_spawn_air(`n2o=${reac_volume / 5};TEMP=${T20C}`);
	return f.dot;
});

// other_reagents.dm:1137
rt.def("/datum/reagent/nitrous_oxide/proc/reaction_mob", function reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (method != VAPOR) return f.dot;
	M.drowsyness += max(round(reac_volume, 1), 2);
	return f.dot;
});

// other_reagents.dm:1141
rt.def("/datum/reagent/nitrous_oxide/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let H: Value = null;
	M.drowsyness += 2;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		(H = M).blood_volume = max(H.blood_volume - 2.5, 0);
	}
	if (prob(20)) {
		M.losebreath += 2;
		M.confused = min(M.confused + 2, 5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3668, "/datum/reagent/colorful_reagent/crayonpowder", "/datum/reagent/colorful_reagent", {
	colorname: "none",
	name: "Crayon Powder",
	id: "crayon powder",
	description: "A powder made by grinding down crayons, good for colouring chemical reagents.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_description: "the back of class",
});

// other_reagents.dm:1164
rt.def("/datum/reagent/colorful_reagent/crayonpowder/proc/New", function New(f: Frame) {
	this.description = fmt("＇！ powder made by grinding down crayons, good for colouring chemical reagents.", [this.colorname]);
	return f.dot;
});

rt.type(3669, "/datum/reagent/colorful_reagent/crayonpowder/red", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Red Crayon Powder",
	id: "redcrayonpowder",
	colorname: "red",
	color: "#DA0000",
	random_color_list: null,
});

// other_reagents.dm:1172
rt.def("/datum/reagent/colorful_reagent/crayonpowder/red/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#DA0000");
	return f.dot;
});

rt.type(3670, "/datum/reagent/colorful_reagent/crayonpowder/orange", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Orange Crayon Powder",
	id: "orangecrayonpowder",
	colorname: "orange",
	color: "#FF9300",
	random_color_list: null,
});

// other_reagents.dm:1179
rt.def("/datum/reagent/colorful_reagent/crayonpowder/orange/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#FF9300");
	return f.dot;
});

rt.type(3671, "/datum/reagent/colorful_reagent/crayonpowder/yellow", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Yellow Crayon Powder",
	id: "yellowcrayonpowder",
	colorname: "yellow",
	color: "#FFF200",
	random_color_list: null,
});

// other_reagents.dm:1186
rt.def("/datum/reagent/colorful_reagent/crayonpowder/yellow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#FFF200");
	return f.dot;
});

rt.type(3672, "/datum/reagent/colorful_reagent/crayonpowder/green", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Green Crayon Powder",
	id: "greencrayonpowder",
	colorname: "green",
	color: "#A8E61D",
	random_color_list: null,
});

// other_reagents.dm:1193
rt.def("/datum/reagent/colorful_reagent/crayonpowder/green/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#A8E61D");
	return f.dot;
});

rt.type(3673, "/datum/reagent/colorful_reagent/crayonpowder/blue", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Blue Crayon Powder",
	id: "bluecrayonpowder",
	colorname: "blue",
	color: "#00B7EF",
	random_color_list: null,
});

// other_reagents.dm:1200
rt.def("/datum/reagent/colorful_reagent/crayonpowder/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#00B7EF");
	return f.dot;
});

rt.type(3674, "/datum/reagent/colorful_reagent/crayonpowder/purple", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Purple Crayon Powder",
	id: "purplecrayonpowder",
	colorname: "purple",
	color: "#DA00FF",
	random_color_list: null,
});

// other_reagents.dm:1207
rt.def("/datum/reagent/colorful_reagent/crayonpowder/purple/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#DA00FF");
	return f.dot;
});

rt.type(3675, "/datum/reagent/colorful_reagent/crayonpowder/invisible", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Invisible Crayon Powder",
	id: "invisiblecrayonpowder",
	colorname: "invisible",
	color: "#FFFFFF00",
	random_color_list: null,
});

// other_reagents.dm:1214
rt.def("/datum/reagent/colorful_reagent/crayonpowder/invisible/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list(null);
	return f.dot;
});

rt.type(3676, "/datum/reagent/colorful_reagent/crayonpowder/black", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "Black Crayon Powder",
	id: "blackcrayonpowder",
	colorname: "black",
	color: "#1C1C1C",
	random_color_list: null,
});

// other_reagents.dm:1221
rt.def("/datum/reagent/colorful_reagent/crayonpowder/black/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#404040");
	return f.dot;
});

rt.type(3677, "/datum/reagent/colorful_reagent/crayonpowder/white", "/datum/reagent/colorful_reagent/crayonpowder", {
	name: "White Crayon Powder",
	id: "whitecrayonpowder",
	colorname: "white",
	color: "#FFFFFF",
	random_color_list: null,
});

// other_reagents.dm:1228
rt.def("/datum/reagent/colorful_reagent/crayonpowder/white/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_color_list = list("#FFFFFF");
	return f.dot;
});

rt.type(3678, "/datum/reagent/plantnutriment", "/datum/reagent", {
	tox_prob: 0,
	name: "Generic nutriment",
	id: "plantnutriment",
	description: "Some kind of nutriment. You can't really tell what it is. You should probably report it, along with how you obtained it.",
	color: "#000000",
	taste_description: "plant food",
});

// other_reagents.dm:1244
rt.def("/datum/reagent/plantnutriment/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(this.tox_prob)) {
		yield* M.adjustToxLoss(1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3683, "/datum/reagent/stable_plasma", "/datum/reagent", {
	name: "Stable Plasma",
	id: "stable_plasma",
	description: "Non-flammable plasma locked into a liquid form that cannot ignite or become gaseous/solid.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "bitterness",
	taste_mult: 1.5,
});

// other_reagents.dm:1298
rt.def("/datum/reagent/stable_plasma/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let C: Value = null;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		yield* (C = M).adjustPlasma(10);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3685, "/datum/reagent/carpet", "/datum/reagent", {
	name: "Carpet",
	id: "carpet",
	description: "For those that need a more creative way to roll out a red carpet.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "carpet",
});

// other_reagents.dm:1321
rt.def("/datum/reagent/carpet/proc/reaction_turf", function* reaction_turf(f: Frame) {
	let F: Value = null;
	if (rt.istype(f.args[0], T("/turf/open/floor/plating")) || rt.istype(f.args[0], T("/turf/open/floor/plasteel"))) {
		yield* (F = f.args[0]).ChangeTurf(T("/turf/open/floor/carpet"));
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["T", "reac_volume"] });

rt.type(3667, "/datum/reagent/colorful_reagent", "/datum/reagent", {
	random_color_list: null,
	name: "Colorful Reagent",
	id: "colorful_reagent",
	description: "Thoroughly sample the rainbow.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "rainbows",
});

// other_reagents.dm:1370
rt.def("/datum/reagent/colorful_reagent/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M && rt.istype(M, T("/mob/living"))) {
		M.add_atom_colour(pick(this.random_color_list), WASHABLE_COLOUR_PRIORITY);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:1375
rt.def("/datum/reagent/colorful_reagent/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, reac_volume: Value) {
	if (M && rt.istype(M, T("/mob/living"))) {
		M.add_atom_colour(pick(this.random_color_list), WASHABLE_COLOUR_PRIORITY);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:1381
rt.def("/datum/reagent/colorful_reagent/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (O) {
		O.add_atom_colour(pick(this.random_color_list), WASHABLE_COLOUR_PRIORITY);
	}
	parent_proc();
	return f.dot;
}, false);

// other_reagents.dm:1386
rt.def("/datum/reagent/colorful_reagent/proc/reaction_turf", function reaction_turf(f: Frame, T: Value, reac_volume: Value) {
	if (T) {
		T.add_atom_colour(pick(this.random_color_list), WASHABLE_COLOUR_PRIORITY);
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(3690, "/datum/reagent/hair_dye", "/datum/reagent", {
	potential_colors: null,
	name: "Quantum Hair Dye",
	id: "hair_dye",
	description: "Has a high chance of making you look like a mad scientist.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "sourness",
});

// other_reagents.dm:1399
rt.def("/datum/reagent/hair_dye/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let H: Value = null;
	method ??= TOUCH;
	if (!(method == TOUCH || method == VAPOR)) return f.dot;
	if (!(M && rt.istype(M, T("/mob/living/carbon/human")))) return f.dot;
	(H = M).hair_color = pick(this.potential_colors);
	H.facial_hair_color = pick(this.potential_colors);
	yield* H.update_hair();
	return f.dot;
}, true);

rt.type(3691, "/datum/reagent/barbers_aid", "/datum/reagent", {
	name: "Barber's Aid",
	id: "barbers_aid",
	description: "A solution to hair loss across the world.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "sourness",
});

// other_reagents.dm:1415
rt.def("/datum/reagent/barbers_aid/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (!(method == TOUCH || method == VAPOR)) return f.dot;
	if (!(M && rt.istype(M, T("/mob/living/carbon/human")))) return f.dot;
	let H: Value = M;
	let picked_hair: Value = pick(GLOB.hair_styles_list);
	let picked_beard: Value = pick(GLOB.facial_hair_styles_list);
	H.hair_style = picked_hair;
	H.facial_hair_style = picked_beard;
	yield* H.update_hair();
	return f.dot;
}, true);

rt.type(3692, "/datum/reagent/concentrated_barbers_aid", "/datum/reagent", {
	name: "Concentrated Barber's Aid",
	id: "concentrated_barbers_aid",
	description: "A concentrated solution to hair loss across the world.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "sourness",
});

// other_reagents.dm:1433
rt.def("/datum/reagent/concentrated_barbers_aid/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let H: Value = null;
	method ??= TOUCH;
	if (!(method == TOUCH || method == VAPOR)) return f.dot;
	if (!(M && rt.istype(M, T("/mob/living/carbon/human")))) return f.dot;
	(H = M).hair_style = "Very Long Hair";
	H.facial_hair_style = "Very Long Beard";
	yield* H.update_hair();
	return f.dot;
}, true);

rt.type(3695, "/datum/reagent/drying_agent", "/datum/reagent", {
	name: "Drying agent",
	id: "drying_agent",
	description: "A desiccant. Can be used to dry things.",
	reagent_state: 2,
	color: "#A70FFF",
	taste_description: "dryness",
});

// other_reagents.dm:1465
rt.def("/datum/reagent/drying_agent/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!(rt.istype(_T, T("/turf/open")) && _T.wet)) return f.dot;
	_T.wet_time = max(0, _T.wet_time - reac_volume * 5);
	yield* _T.HandleWet();
	return f.dot;
}, true);

// other_reagents.dm:1470
rt.def("/datum/reagent/drying_agent/proc/reaction_obj", function* reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	if (O.type != T("/obj/item/clothing/shoes/galoshes")) return f.dot;
	let t_loc: Value = rt.getStep(f, O, 0);
	yield* qdel(O);
	yield* new_(T("/obj/item/clothing/shoes/galoshes/dry"), t_loc);
	return f.dot;
}, true);

rt.type(3750, "/datum/reagent/royal_bee_jelly", "/datum/reagent", {
	name: "royal bee jelly",
	id: "royal_bee_jelly",
	description: "Royal Bee Jelly, if injected into a Queen Space Bee said bee will split into two bees.",
	color: "#00ff80",
	taste_description: "strange honey",
});

// other_reagents.dm:1537
rt.def("/datum/reagent/royal_bee_jelly/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(2)) {
		yield* M.say(pick("Bzzz...", "BZZ BZZ", "Bzzzzzzzzzzz..."));
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3751, "/datum/reagent/romerol", "/datum/reagent", {
	name: "Romerol",
	id: "romerol",
	description: "Romerol is a highly experimental bioterror agent which causes dormant nodules to be etched into the grey matter of the subject. These nodules only become active upon death of the host, upon which, the secondary structures activate and take control of the host body.",
	color: "#123524",
	metabolization_rate: 1e+31,
	can_synth: 0,
	taste_description: "brains",
});

// other_reagents.dm:1559
rt.def("/datum/reagent/romerol/proc/on_mob_life", function* on_mob_life(f: Frame, H: Value) {
	let ZI: Value = null;
	if (!H.getorganslot("zombie_infection")) {
		yield* (ZI = (yield* new_(T("/obj/item/organ/zombie_infection")))).Insert(H);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3752, "/datum/reagent/growthserum", "/datum/reagent", {
	current_size: 1,
	name: "Growth Serum",
	id: "growthserum",
	description: "A commercial chemical designed to help older men in the bedroom.",
	color: "#ff0000",
	taste_description: "bitterness",
});

// other_reagents.dm:1573
rt.def("/datum/reagent/growthserum/proc/on_mob_life", function* on_mob_life(f: Frame, H: Value) {
	let newsize: Value = this.current_size;
	if (rt.inRange(this.volume, 0, 19)) {
		newsize = 1.25;
	} else if (rt.inRange(this.volume, 20, 49)) {
		newsize = 1.5;
	} else if (rt.inRange(this.volume, 50, 99)) {
		newsize = 2;
	} else if (rt.inRange(this.volume, 100, 199)) {
		newsize = 2.5;
	} else if (rt.inRange(this.volume, 200, 1e+31)) {
		newsize = 3.5;
	}
	H.resize = newsize / this.current_size;
	this.current_size = newsize;
	yield* H.update_transform();
	yield* parent_proc();
	return f.dot;
}, true);

// other_reagents.dm:1592
rt.def("/datum/reagent/growthserum/proc/on_mob_delete", function* on_mob_delete(f: Frame, M: Value) {
	M.resize = 1 / this.current_size;
	yield* M.update_transform();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3754, "/datum/reagent/glitter", "/datum/reagent", {
	glitter_type: rt.typePath("/obj/effect/decal/cleanable/glitter"),
	name: "generic glitter",
	id: "glitter",
	description: "if you can see this description, contact a coder.",
	color: "#FFFFFF",
	taste_description: "plastic",
	reagent_state: 1,
});

// other_reagents.dm:1613
rt.def("/datum/reagent/glitter/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!rt.istype(_T, T("/turf"))) {
		return f.dot;
	}
	yield* new_(this.glitter_type, _T);
	return f.dot;
}, true);
