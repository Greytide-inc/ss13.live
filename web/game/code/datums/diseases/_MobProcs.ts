// Based on /tg/station's code/datums/diseases/_MobProcs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// _MobProcs.dm:3
rt.def("/mob/proc/HasDisease", function* HasDisease(f: Frame, D: Value) {
	let DD: Value = null;
	for (DD of each(this.viruses, T("/datum/disease"))) {
		if (yield* D.IsSame(DD)) {
			return 1;
		}
	}
	return 0;
}, true);

// _MobProcs.dm:10
rt.def("/mob/proc/CanContractDisease", function* CanContractDisease(f: Frame, D: Value) {
	if (this.stat == 2) {
		return 0;
	}
	if (rt.isIn(f, (yield* D.GetDiseaseID()), this.resistances)) {
		return 0;
	}
	if (yield* this.HasDisease(D)) {
		return 0;
	}
	if (!rt.isIn(f, this.type, D.viable_mobtypes)) {
		return 0;
	}
	return 1;
}, true);

// _MobProcs.dm:26
rt.def("/mob/proc/ContractDisease", function* ContractDisease(f: Frame, D: Value) {
	if (!(yield* this.CanContractDisease(D))) {
		return 0;
	}
	yield* this.AddDisease(D);
	return f.dot;
}, true);

// _MobProcs.dm:32
rt.def("/mob/proc/AddDisease", function* AddDisease(f: Frame, D: Value) {
	let _P: Value = null, DD: Value = null, DD_0: Value = null, V: Value = null, L: Value = null;
	for (_P of each(this.viruses, T("/datum/disease/advance"))) {
		if (rt.istype(D, T("/datum/disease/advance"))) {
			DD = D;
			if (_P.totalResistance() < DD.totalTransmittable()) {
				_P.remove_virus();
			}
		}
	}
	if (rt.len(f, this.viruses)) return f.dot;
	this.viruses += (DD_0 = (yield* new_(D.type, 1, D, 0)));
	DD_0.affected_mob = this;
	DD_0.holder = this;
	let skipped: Value = list("affected_mob", "holder", "carrier", "stage", "type", "parent_type", "vars", "transformed");
	for (V of each(DD_0.vars)) {
		if (rt.isIn(f, V, skipped)) {
			continue;
		}
		if (rt.istype(rt.index(DD_0.vars, V), T("/list"))) {
			L = rt.index(D.vars, V);
			rt.setAt(DD_0.vars, V, (yield* L.Copy()));
		} else {
			rt.setAt(DD_0.vars, V, rt.index(D.vars, V));
		}
	}
	DD_0.affected_mob.med_hud_set_status();
	return f.dot;
}, true);

// _MobProcs.dm:59
rt.def("/mob/living/carbon/proc/ContractDisease", function* ContractDisease(f: Frame, D: Value) {
	let Cl: Value = null, H: Value = null, M: Value = null;
	if (!(yield* this.CanContractDisease(D))) {
		return 0;
	}
	let passed: Value = 1;
	let head_ch: Value = 100;
	let body_ch: Value = 100;
	let hands_ch: Value = 25;
	let feet_ch: Value = 25;
	if (rt.bitAnd(D.spread_flags, CONTACT_HANDS)) {
		head_ch = 0;
		body_ch = 0;
		hands_ch = 100;
		feet_ch = 0;
	}
	if (rt.bitAnd(D.spread_flags, CONTACT_FEET)) {
		head_ch = 0;
		body_ch = 0;
		hands_ch = 0;
		feet_ch = 100;
	}
	if (prob(15 / D.permeability_mod)) {
		return f.dot;
	}
	if (this.satiety > 0 && prob(this.satiety / 10)) {
		return f.dot;
	}
	let target_zone: Value = rt.op(f, "PickWeighted", [4], [head_ch, 1, body_ch, 2, hands_ch, 3, feet_ch, 4]);
	if (rt.istype(this, T("/mob/living/carbon/human"))) {
		H = this;
		if (target_zone === 1) {
			if (rt.istype(H.head, T("/obj")) && !rt.istype(H.head, T("/obj/item/weapon/paper"))) {
				passed = prob((Cl = H.head).permeability_coefficient * 100 - 1);
			}
			if (passed && rt.istype(H.wear_mask, T("/obj"))) {
				passed = prob((Cl = H.wear_mask).permeability_coefficient * 100 - 1);
			}
			if (passed && rt.istype(H.wear_neck, T("/obj"))) {
				passed = prob((Cl = H.wear_neck).permeability_coefficient * 100 - 1);
			}
		} else if (target_zone === 2) {
			if (rt.istype(H.wear_suit, T("/obj"))) {
				passed = prob((Cl = H.wear_suit).permeability_coefficient * 100 - 1);
			}
			if (passed && rt.istype(slot_w_uniform, T("/obj"))) {
				passed = prob((Cl = slot_w_uniform).permeability_coefficient * 100 - 1);
			}
		} else if (target_zone === 3) {
			if (rt.istype(H.wear_suit, T("/obj")) && rt.bitAnd(H.wear_suit.body_parts_covered, HANDS)) {
				passed = prob((Cl = H.wear_suit).permeability_coefficient * 100 - 1);
			}
			if (passed && rt.istype(H.gloves, T("/obj"))) {
				passed = prob((Cl = H.gloves).permeability_coefficient * 100 - 1);
			}
		} else if (target_zone === 4) {
			if (rt.istype(H.wear_suit, T("/obj")) && rt.bitAnd(H.wear_suit.body_parts_covered, FEET)) {
				passed = prob((Cl = H.wear_suit).permeability_coefficient * 100 - 1);
			}
			if (passed && rt.istype(H.shoes, T("/obj"))) {
				passed = prob((Cl = H.shoes).permeability_coefficient * 100 - 1);
			}
		}
	} else if (rt.istype(this, T("/mob/living/carbon/monkey"))) {
		M = this;
		if (target_zone === 1) {
			if (M.wear_mask && rt.istype(M.wear_mask, T("/obj"))) {
				passed = prob((Cl = M.wear_mask).permeability_coefficient * 100 - 1);
			}
		}
	}
	if (!passed && rt.bitAnd(D.spread_flags, AIRBORNE) && !this.internal) {
		passed = prob(50 * D.permeability_mod - 1);
	}
	if (!passed) return f.dot;
	yield* this.AddDisease(D);
	return f.dot;
}, true);

// _MobProcs.dm:144
rt.def("/mob/proc/ForceContractDisease", function* ForceContractDisease(f: Frame, D: Value) {
	if (!(yield* this.CanContractDisease(D))) {
		return 0;
	}
	yield* this.AddDisease(D);
	return f.dot;
}, true);

// _MobProcs.dm:150
rt.def("/mob/living/carbon/human/proc/CanContractDisease", function* CanContractDisease(f: Frame, D: Value) {
	if (this.dna && rt.isIn(f, VIRUSIMMUNE, this.dna.species.species_traits)) {
		return 0;
	}
	return (yield* parent_proc());
}, true);
