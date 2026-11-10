// Based on /tg/station's code/modules/mob/living/blood.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


// blood.dm:7
rt.def("/mob/living/carbon/human/proc/suppress_bloodloss", function* suppress_bloodloss(f: Frame, amount: Value) {
	if (this.bleedsuppress) {
		return f.dot;
	} else {
		this.bleedsuppress = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/carbon/human/proc/resume_bleeding"))), amount);
	}
	return f.dot;
}, true);

// blood.dm:14
rt.def("/mob/living/carbon/human/proc/resume_bleeding", function resume_bleeding(f: Frame) {
	this.bleedsuppress = 0;
	if (!(this.stat != 2 && this.bleed_rate)) return f.dot;
	to_chat(this, "<span class='warning'>The blood soaks through your bandage.</span>");
	return f.dot;
});

// blood.dm:19
rt.def("/mob/living/carbon/monkey/proc/handle_blood", function handle_blood(f: Frame) {
	if (!(this.bodytemperature >= 225 && !rt.bitAnd(this.disabilities, 128))) return f.dot;
	if (!(this.blood_volume < BLOOD_VOLUME_NORMAL)) return f.dot;
	this.blood_volume += 0.1;
	return f.dot;
});

// blood.dm:27
rt.def("/mob/living/carbon/human/proc/handle_blood", function* handle_blood(f: Frame) {
	let nutrition_ratio: Value = null, X: Value = null, BP: Value = null, brutedamage: Value = null;
	let $e: any;
	if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) {
		this.bleed_rate = 0;
		return f.dot;
	}
	if (!(this.bodytemperature >= 225 && !rt.bitAnd(this.disabilities, 128))) return f.dot;
	if (this.blood_volume < BLOOD_VOLUME_NORMAL && !rt.isIn(f, NOHUNGER, this.dna.species.species_traits)) {
		nutrition_ratio = 0;
		if (rt.inRange(this.nutrition, 0, NUTRITION_LEVEL_STARVING)) {
			nutrition_ratio = 0.2;
		} else if (rt.inRange(this.nutrition, NUTRITION_LEVEL_STARVING, NUTRITION_LEVEL_HUNGRY)) {
			nutrition_ratio = 0.4;
		} else if (rt.inRange(this.nutrition, NUTRITION_LEVEL_HUNGRY, NUTRITION_LEVEL_FED)) {
			nutrition_ratio = 0.6;
		} else if (rt.inRange(this.nutrition, NUTRITION_LEVEL_FED, NUTRITION_LEVEL_WELL_FED)) {
			nutrition_ratio = 0.8;
		} else {
			nutrition_ratio = 1;
		}
		if (this.satiety > 80) {
			nutrition_ratio *= 1.25;
		}
		this.nutrition = max(0, this.nutrition - nutrition_ratio * HUNGER_FACTOR);
		this.blood_volume = min(BLOOD_VOLUME_NORMAL, this.blood_volume + 0.5 * nutrition_ratio);
	}
	let word: Value = pick("dizzy", "woozy", "faint");
	if (rt.inRange(this.blood_volume, BLOOD_VOLUME_OKAY, BLOOD_VOLUME_SAFE)) {
		if (prob(5)) {
			to_chat(this, `<span class='warning'>You feel ${word}.</span>`);
		}
		yield* this.adjustOxyLoss(round((BLOOD_VOLUME_NORMAL - this.blood_volume) * 0.01, 1));
	} else if (rt.inRange(this.blood_volume, BLOOD_VOLUME_BAD, BLOOD_VOLUME_OKAY)) {
		yield* this.adjustOxyLoss(round((BLOOD_VOLUME_NORMAL - this.blood_volume) * 0.02, 1));
		if (prob(5)) {
			yield* this.blur_eyes(6);
			to_chat(this, `<span class='warning'>You feel very ${word}.</span>`);
		}
	} else if (rt.inRange(this.blood_volume, BLOOD_VOLUME_SURVIVE, BLOOD_VOLUME_BAD)) {
		yield* this.adjustOxyLoss(5);
		if (prob(15)) {
			yield* this.Unconscious(rand(20, 60));
			to_chat(this, `<span class='warning'>You feel extremely ${word}.</span>`);
		}
	} else if (rt.inRange(this.blood_volume, 0, BLOOD_VOLUME_SURVIVE)) {
		yield* this.death();
	}
	let temp_bleed: Value = 0;
	for (X of each(this.bodyparts)) {
		BP = X;
		brutedamage = BP.brute_dam;
		listclearnulls(BP.embedded_objects);
		temp_bleed += 0.5 * rt.len(f, BP.embedded_objects);
		if (brutedamage >= 20) {
			temp_bleed += brutedamage * 0.013;
		}
	}
	this.bleed_rate = max(this.bleed_rate - 0.5, temp_bleed);
	if (!(this.bleed_rate && !this.bleedsuppress && !rt.bitAnd(this.status_flags, FAKEDEATH))) return f.dot;
	yield* this.bleed(this.bleed_rate);
	return f.dot;
}, true);

// blood.dm:93
rt.def("/mob/living/carbon/proc/bleed", function* bleed(f: Frame, amt: Value) {
	if (!this.blood_volume) return f.dot;
	this.blood_volume = max(this.blood_volume - amt, 0);
	if (!isturf(this.loc)) return f.dot;
	if (amt >= 10) {
		yield* this.add_splatter_floor(this.loc);
	} else {
		yield* this.add_splatter_floor(this.loc, 1);
	}
	return f.dot;
}, true);

// blood.dm:101
rt.def("/mob/living/carbon/human/proc/bleed", function* bleed(f: Frame, amt: Value) {
	if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// blood.dm:107
rt.def("/mob/living/proc/restore_blood", function restore_blood(f: Frame) {
	this.blood_volume = rt.initial(f, this, "blood_volume");
	return f.dot;
});

// blood.dm:119
rt.def("/mob/living/proc/transfer_blood_to", function* transfer_blood_to(f: Frame, AM: Value, amount: Value, forced: Value) {
	let blood_id: Value = null, C: Value = null, D: Value = null;
	if (!this.blood_volume || !AM.reagents) {
		return 0;
	}
	if (this.blood_volume < BLOOD_VOLUME_BAD && !forced) {
		return 0;
	}
	if (this.blood_volume < amount) {
		amount = this.blood_volume;
	}
	if (!(blood_id = this.get_blood_id())) {
		return 0;
	}
	this.blood_volume -= amount;
	let blood_data: Value = (yield* this.get_blood_data(blood_id));
	if (rt.istype(AM, T("/mob/living/carbon"))) {
		C = AM;
		if (blood_id == C.get_blood_id()) {
			if (blood_id == "blood") {
				if (rt.at(blood_data, "viruses")) {
					for (D of each(rt.at(blood_data, "viruses"), T("/datum/disease"))) {
						if (rt.bitAnd(D.spread_flags, SPECIAL) || rt.bitAnd(D.spread_flags, NON_CONTAGIOUS)) {
							continue;
						}
						yield* C.ForceContractDisease(D);
					}
				}
				if (!rt.isIn(f, rt.at(blood_data, "blood_type"), get_safe_blood(C.dna.blood_type))) {
					yield* C.reagents.add_reagent("toxin", amount * 0.5);
					return 1;
				}
			}
			C.blood_volume = min(C.blood_volume + round(amount, 0.1), BLOOD_VOLUME_MAXIMUM);
			return 1;
		}
	}
	yield* AM.reagents.add_reagent(blood_id, amount, blood_data, this.bodytemperature);
	return 1;
}, true);

// blood.dm:159
rt.def("/mob/living/carbon/proc/get_blood_data", function* get_blood_data(f: Frame, blood_id: Value) {
	let blood_data: Value = null, D: Value = null, R: Value = null;
	if (blood_id != "blood") return f.dot;
	rt.setAt((blood_data = list()), "donor", this);
	rt.setAt(blood_data, "viruses", list());
	for (D of each(this.viruses, T("/datum/disease"))) {
		rt.modAt(blood_data, "viruses", (yield* D.Copy()), add);
	}
	rt.setAt(blood_data, "blood_DNA", copytext(this.dna.unique_enzymes, 1, 0));
	if (this.resistances && rt.len(f, this.resistances)) {
		rt.setAt(blood_data, "resistances", (yield* this.resistances.Copy()));
	}
	let temp_chem: Value = list();
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		rt.setAt(temp_chem, R.id, R.volume);
	}
	rt.setAt(blood_data, "trace_chem", list2params(temp_chem));
	if (this.mind) {
		rt.setAt(blood_data, "mind", this.mind);
	} else if (this.last_mind) {
		rt.setAt(blood_data, "mind", this.last_mind);
	}
	if (this.ckey) {
		rt.setAt(blood_data, "ckey", this.ckey);
	} else if (this.last_mind) {
		rt.setAt(blood_data, "ckey", ckey(this.last_mind.key));
	}
	if (!this.suiciding) {
		rt.setAt(blood_data, "cloneable", 1);
	}
	rt.setAt(blood_data, "blood_type", copytext(this.dna.blood_type, 1, 0));
	rt.setAt(blood_data, "gender", this.gender);
	rt.setAt(blood_data, "real_name", this.real_name);
	rt.setAt(blood_data, "features", this.dna.features);
	rt.setAt(blood_data, "factions", this.faction);
	return blood_data;
}, true);

// blood.dm:199
rt.def("/mob/living/simple_animal/proc/get_blood_id", function get_blood_id(f: Frame) {
	if (!this.blood_volume) return f.dot;
	return "blood";
});

// blood.dm:202
rt.def("/mob/living/carbon/monkey/proc/get_blood_id", function get_blood_id(f: Frame) {
	if (rt.bitAnd(this.disabilities, 128)) return f.dot;
	return "blood";
});

// blood.dm:206
rt.def("/mob/living/carbon/human/proc/get_blood_id", function get_blood_id(f: Frame) {
	if (this.dna.species.exotic_blood) {
		return this.dna.species.exotic_blood;
	}
	if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits) || rt.bitAnd(this.disabilities, 128)) {
		return f.dot;
	}
	return "blood";
});

// blood.dm:214
rt.def("/proc/get_safe_blood", function get_safe_blood(f: Frame, bloodtype: Value) {
	f.dot = list();
	if (!bloodtype) {
		return f.dot;
	}
	if (bloodtype === "A-") {
		return list("A-", "O-");
	} else if (bloodtype === "A+") {
		return list("A-", "A+", "O-", "O+");
	} else if (bloodtype === "B-") {
		return list("B-", "O-");
	} else if (bloodtype === "B+") {
		return list("B-", "B+", "O-", "O+");
	} else if (bloodtype === "AB-") {
		return list("A-", "B-", "O-", "AB-");
	} else if (bloodtype === "AB+") {
		return list("A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+");
	} else if (bloodtype === "O-") {
		return list("O-");
	} else if (bloodtype === "O+") {
		return list("O-", "O+");
	} else if (bloodtype === "L") {
		return list("L");
	}
	return f.dot;
});

// blood.dm:239
rt.def("/mob/living/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, _T: Value, small_drip: Value) {
	let temp_blood_DNA: Value = null, drop: Value = null, B: Value = null;
	if (this.get_blood_id() != "blood") {
		return f.dot;
	}
	if (!_T) {
		_T = rt.getStep(f, this, 0);
	}
	if (small_drip) {
		if (drop = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood/drip"), _T)) {
			if (drop.drips < 3) {
				drop.drips++;
				drop.add_overlay(pick(drop.random_icon_states));
				drop.transfer_mob_blood_dna(this);
				return f.dot;
			} else {
				temp_blood_DNA = list();
				(temp_blood_DNA = rt.modify(temp_blood_DNA, (yield* drop.blood_DNA.Copy()), rt.bitOr));
				yield* qdel(drop);
			}
		} else {
			(drop = (yield* new_(T("/obj/effect/decal/cleanable/blood/drip"), _T))).transfer_mob_blood_dna(this);
			return f.dot;
		}
	}
	if (!(B = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood"), _T))) {
		B = (yield* new_(T("/obj/effect/decal/cleanable/blood/splatter"), _T));
	}
	B.transfer_mob_blood_dna(this);
	if (!temp_blood_DNA) return f.dot;
	(rt.modField(f, B, "blood_DNA", temp_blood_DNA, rt.bitOr));
	return f.dot;
}, true);

// blood.dm:272
rt.def("/mob/living/carbon/human/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, T: Value, small_drip: Value) {
	if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// blood.dm:276
rt.def("/mob/living/carbon/alien/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, _T: Value, small_drip: Value) {
	let B: Value = null;
	if (!_T) {
		_T = rt.getStep(f, this, 0);
	}
	if (!(B = rt.locateIn(f, T("/obj/effect/decal/cleanable/xenoblood"), _T.contents))) {
		B = (yield* new_(T("/obj/effect/decal/cleanable/xenoblood"), _T));
	}
	rt.setAt(B.blood_DNA, "UNKNOWN DNA", "X*");
	return f.dot;
}, true);

// blood.dm:284
rt.def("/mob/living/silicon/robot/proc/add_splatter_floor", function* add_splatter_floor(f: Frame, _T: Value, small_drip: Value) {
	let B: Value = null;
	if (!_T) {
		_T = rt.getStep(f, this, 0);
	}
	if (B = rt.locateIn(f, T("/obj/effect/decal/cleanable/oil"), _T.contents)) return f.dot;
	B = (yield* new_(T("/obj/effect/decal/cleanable/oil"), _T));
	return f.dot;
}, true);
