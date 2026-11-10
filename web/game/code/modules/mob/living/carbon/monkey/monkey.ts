// Based on /tg/station's code/modules/mob/living/carbon/monkey/monkey.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// monkey.dm:21
rt.def("/mob/living/carbon/monkey/proc/Initialize", function* Initialize(f: Frame) {
	this.verbs += P("/mob/living/proc/mob_sleep");
	this.verbs += P("/mob/living/proc/lay_down");
	if (this.unique_name) {
		this.gender = pick("male", "female");
	}
	this.real_name = this.name;
	yield* this.create_bodyparts();
	yield* this.create_internal_organs();
	f.dot = (yield* parent_proc());
	yield* this.create_dna(this);
	yield* this.dna.initialize_dna(random_blood_type());
	return f.dot;
}, true);

// monkey.dm:39
rt.def("/mob/living/carbon/monkey/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/appendix")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/lungs")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/heart")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/brain")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/tongue")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/eyes")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/ears")));
	yield* parent_proc();
	return f.dot;
}, true);

// monkey.dm:50
rt.def("/mob/living/carbon/monkey/proc/movement_delay", function movement_delay(f: Frame) {
	let health_deficiency: Value = null;
	if (this.reagents) {
		if (this.reagents.has_reagent("morphine")) {
			return -1;
		}
		if (this.reagents.has_reagent("nuka_cola")) {
			return -1;
		}
	}
	f.dot = parent_proc();
	if ((health_deficiency = 100 - this.health) >= 45) {
		f.dot += health_deficiency / 25;
	}
	if (this.bodytemperature < 283.222) {
		f.dot += (283.222 - this.bodytemperature) / 10 * 1.75;
	}
	return f.dot + GLOB.config.monkey_delay;
});

// monkey.dm:66
rt.def("/mob/living/carbon/monkey/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (statpanel("Status")) {
		stat(null, `Intent: ${this.a_intent}`);
		stat(null, `Move Mode: ${this.m_intent}`);
		if (this.client && this.mind) {
			if (this.mind.changeling) {
				stat("Chemical Storage", `${this.mind.changeling.chem_charges}/${this.mind.changeling.chem_storage}`);
				stat("Absorbed DNA", this.mind.changeling.absorbedcount);
			}
		}
	}
	return f.dot;
}, true);

// monkey.dm:94
rt.def("/mob/living/carbon/monkey/proc/assess_threat", function* assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	let I: Value = null;
	lasercolor ??= "";
	if (rt.bitAnd(judgement_criteria, JUDGE_EMAGGED)) {
		return 10;
	}
	let threatcount: Value = 0;
	if (!rt.bitAnd(judgement_criteria, JUDGE_IGNOREMONKEYS) && rt.bitAnd(judgement_criteria, JUDGE_IDCHECK)) {
		threatcount += 4;
	}
	if (lasercolor) {
		if (lasercolor == "b") {
			if (this.is_holding_item_of_type(T("/obj/item/weapon/gun/energy/laser/redtag"))) {
				threatcount += 4;
			}
		}
		if (lasercolor == "r") {
			if (this.is_holding_item_of_type(T("/obj/item/weapon/gun/energy/laser/bluetag"))) {
				threatcount += 4;
			}
		}
		return threatcount;
	}
	if (rt.bitAnd(judgement_criteria, JUDGE_WEAPONCHECK) && weaponcheck) {
		for (I of each(this.held_items, T("/obj/item"))) {
			if (yield* weaponcheck.Invoke(I)) {
				threatcount += 4;
			}
		}
	}
	if (this.isloyal()) {
		threatcount -= 1;
	}
	return threatcount;
}, true);

// monkey.dm:130
rt.def("/mob/living/carbon/monkey/proc/get_permeability_protection", function get_permeability_protection(f: Frame) {
	let protection: Value = 0;
	if (this.head) {
		protection = 1 - this.head.permeability_coefficient;
	}
	if (this.wear_mask) {
		protection = max(1 - this.wear_mask.permeability_coefficient, protection);
	}
	return (protection = protection / 7);
});

// monkey.dm:137
rt.def("/mob/living/carbon/monkey/proc/IsVocal", function IsVocal(f: Frame) {
	if (!this.getorganslot("lungs")) {
		return 0;
	}
	return 1;
});

rt.type(4820, "/mob/living/carbon/monkey/angry", "/mob/living/carbon/monkey", {
	aggressive: 1,
});

// monkey.dm:148
rt.def("/mob/living/carbon/monkey/angry/proc/Initialize", function* Initialize(f: Frame) {
	let helmet: Value = null;
	yield* parent_proc();
	if (!prob(10)) return f.dot;
	yield* this.equip_to_slot_or_del((helmet = (yield* new_(T("/obj/item/clothing/head/helmet/justice/escape"), this))), slot_head);
	yield* helmet.attack_self(this);
	return f.dot;
}, true);
