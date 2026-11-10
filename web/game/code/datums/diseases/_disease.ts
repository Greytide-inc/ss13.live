// Based on /tg/station's code/datums/diseases/_disease.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(945, "/datum/disease", "/datum", {
	visibility_flags: 0,
	disease_flags: 7,
	spread_flags: 64,
	form: "Virus",
	name: "No disease",
	desc: "",
	agent: "some microbes",
	spread_text: "",
	cure_text: "",
	stage: 1,
	max_stages: 0,
	stage_prob: 4,
	longevity: 150,
	viable_mobtypes: null,
	affected_mob: null,
	holder: null,
	cures: null,
	infectivity: 65,
	cure_chance: 8,
	carrier: 0,
	permeability_mod: 1,
	severity: "No threat",
	required_organs: null,
	needs_all_cures: 1,
	strain_data: null,
});

// _disease.dm:50
rt.def("/datum/disease/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.viable_mobtypes = list();

	this.cures = list();

	this.required_organs = list();

	this.strain_data = list();
	return f.dot;
});

// _disease.dm:66
rt.def("/datum/disease/proc/stage_act", function* stage_act(f: Frame) {
	let cure: Value = this.has_cure();
	if (this.carrier && !cure) {
		return f.dot;
	}
	this.stage = min(this.stage, this.max_stages);
	if (!cure) {
		if (prob(this.stage_prob)) {
			this.stage = min(this.stage + 1, this.max_stages);
		}
	} else if (prob(this.cure_chance)) {
		this.stage = max(this.stage - 1, 1);
	}
	if (!rt.bitAnd(this.disease_flags, CURABLE)) return f.dot;
	if (!(cure && prob(this.cure_chance))) return f.dot;
	yield* this.cure();
	return f.dot;
}, true);

// _disease.dm:86
rt.def("/datum/disease/proc/has_cure", function has_cure(f: Frame) {
	let C_id: Value = null;
	if (!rt.bitAnd(this.disease_flags, CURABLE)) {
		return 0;
	}
	f.dot = rt.len(f, this.cures);
	for (C_id of each(this.cures)) {
		if (!this.affected_mob.reagents.has_reagent(C_id)) {
			f.dot--;
		}
	}
	if (!(!f.dot || this.needs_all_cures && f.dot < rt.len(f, this.cures))) return f.dot;
	return 0;
});

// _disease.dm:97
rt.def("/datum/disease/proc/spread", function* spread(f: Frame, source: Value, force_spread: Value) {
	let _T: Value = null, C: Value = null, V: Value = null, Temp: Value = null;
	let $0: any, $e: any;
	force_spread ??= 0;
	if ((rt.bitAnd(this.spread_flags, SPECIAL) || rt.bitAnd(this.spread_flags, NON_CONTAGIOUS) || rt.bitAnd(this.spread_flags, BLOOD)) && !force_spread) {
		return f.dot;
	}
	if (this.affected_mob) {
		if (this.affected_mob.reagents.has_reagent("spaceacillin") || this.affected_mob.satiety > 0 && prob(this.affected_mob.satiety / 10)) {
			return f.dot;
		}
	}
	let spread_range: Value = 1;
	if (force_spread) {
		spread_range = force_spread;
	}
	if (rt.bitAnd(this.spread_flags, AIRBORNE)) {
		spread_range++;
	}
	if (!source) {
		if (this.affected_mob) {
			source = this.affected_mob;
		} else {
			return f.dot;
		}
	}
	if (!rt.istype((_T = source.loc), T("/turf"))) return f.dot;
	for (C of each(oview(spread_range, source), T("/mob/living/carbon"))) {
		if (V = rt.getStep(f, C, 0)) {
			while (true) {
				if (V == _T) {
					yield* C.ContractDisease(this);
					break;
				}
				Temp = get_step_towards(V, _T);
				if (V.CanAtmosPass == -1) {
					$0 = V.CanAtmosPass(Temp);
				} else if (V.CanAtmosPass == -2) {
					$0 = (!V.density ? 1 : 0);
				} else {
					$0 = V.CanAtmosPass;
				}
				if (!$0) {
					break;
				}
				V = Temp;
			}
		}
	}
	return f.dot;
}, true);

// _disease.dm:133
rt.def("/datum/disease/proc/process", function* process(f: Frame) {
	let D: Value = null;
	if (!this.holder) {
		GLOB.SSdisease.processing -= this;
		return f.dot;
	}
	if (prob(this.infectivity)) {
		yield* this.spread(this.holder);
	}
	if (this.affected_mob) {
		for (D of each(this.affected_mob.viruses, T("/datum/disease"))) {
			if (D != this) {
				if (yield* this.IsSame(D)) {
					yield* qdel(D);
				}
			}
		}
		if (this.holder == this.affected_mob) {
			if (this.affected_mob.stat != 2) {
				yield* this.stage_act();
			}
		}
	}
	if (this.affected_mob) return f.dot;
	if (!prob(70)) return f.dot;
	if (!(--this.longevity <= 0)) return f.dot;
	yield* this.cure();
	return f.dot;
}, true, { waitfor: false });

// _disease.dm:158
rt.def("/datum/disease/proc/cure", function* cure(f: Frame) {
	if (this.affected_mob) {
		if (rt.bitAnd(this.disease_flags, CAN_RESIST)) {
			if (!rt.isIn(f, this.type, this.affected_mob.resistances)) {
				this.affected_mob.resistances += this.type;
			}
		}
		this.remove_virus();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// _disease.dm:166
rt.def("/datum/disease/proc/New", function* New(f: Frame) {
	let H: Value = null, O: Value = null;
	if (this.required_organs && rt.len(f, this.required_organs)) {
		if (rt.istype(this.affected_mob, T("/mob/living/carbon/human"))) {
			H = this.affected_mob;
			for (O of each(this.required_organs, T("/obj/item/organ"))) {
				if (!rt.locateIn(f, O, H.bodyparts)) {
					if (!rt.locateIn(f, O, H.internal_organs)) {
						yield* this.cure();
						return f.dot;
					}
				}
			}
		}
	}
	GLOB.SSdisease.processing += this;
	return f.dot;
}, true);

// _disease.dm:179
rt.def("/datum/disease/proc/IsSame", function IsSame(f: Frame, D: Value) {
	if (rt.op(f, "IsType", [], [this, D.type])) {
		return 1;
	}
	return 0;
});

// _disease.dm:185
rt.def("/datum/disease/proc/Copy", function* Copy(f: Frame) {
	let D: Value = null;
	(D = (yield* new_(this.type))).strain_data = (yield* this.strain_data.Copy());
	return D;
}, true);

// _disease.dm:195
rt.def("/datum/disease/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.SSdisease.processing.Remove(this);
	return (yield* parent_proc());
}, true);

// _disease.dm:200
rt.def("/datum/disease/proc/IsSpreadByTouch", function IsSpreadByTouch(f: Frame) {
	if (rt.bitAnd(this.spread_flags, CONTACT_FEET) || rt.bitAnd(this.spread_flags, CONTACT_HANDS) || rt.bitAnd(this.spread_flags, CONTACT_GENERAL)) {
		return 1;
	}
	return 0;
});

// _disease.dm:206
rt.def("/datum/disease/proc/remove_virus", function remove_virus(f: Frame) {
	this.affected_mob.viruses -= this;
	this.affected_mob.med_hud_set_status();
	return f.dot;
});
