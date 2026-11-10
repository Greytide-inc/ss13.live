// Based on /tg/station's code/datums/diseases/advance/symptoms/flesh_eating.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(992, "/datum/symptom/flesh_eating", "/datum/symptom", {
	name: "Necrotizing Fasciitis",
	stealth: -3,
	resistance: -4,
	stage_speed: 0,
	transmittable: -4,
	level: 6,
	severity: 5,
});

// flesh_eating.dm:29
rt.def("/datum/symptom/flesh_eating/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 2 || A.stage === 3) {
			to_chat(M, `<span class='warning'>${pick("You feel a sudden pain across your body.", "Drops of blood appear suddenly on your skin.")}</span>`);
		} else if (A.stage === 4 || A.stage === 5) {
			to_chat(M, `<span class='userdanger'>${pick("You cringe as a violent pain takes over your body.", "It feels like your body is eating itself inside out.", "IT HURTS.")}</span>`);
			yield* this.Flesheat(M, A);
		}
	}
	return f.dot;
}, true);

// flesh_eating.dm:41
rt.def("/datum/symptom/flesh_eating/proc/Flesheat", function* Flesheat(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [16 - A.totalStealth()]) * 5;
	yield* M.adjustBruteLoss(get_damage);
	return 1;
}, true);

rt.type(993, "/datum/symptom/flesh_death", "/datum/symptom", {
	name: "Autophagocytosis Necrosis",
	stealth: -2,
	resistance: -2,
	stage_speed: 1,
	transmittable: -2,
	level: 7,
	severity: 6,
});

// flesh_eating.dm:73
rt.def("/datum/symptom/flesh_death/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 2 || A.stage === 3) {
			to_chat(M, `<span class='warning'>${pick("You feel your body break apart.", "Your skin rubs off like dust.")}</span>`);
		} else if (A.stage === 4 || A.stage === 5) {
			to_chat(M, `<span class='userdanger'>${pick("You feel your muscles weakening.", "Your skin begins detaching itself.", "You feel sandy.")}</span>`);
			yield* this.Flesh_death(M, A);
		}
	}
	return f.dot;
}, true);

// flesh_eating.dm:85
rt.def("/datum/symptom/flesh_death/proc/Flesh_death", function* Flesh_death(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [16 - A.totalStealth()]) * 6;
	yield* M.adjustBruteLoss(get_damage);
	yield* M.reagents.add_reagent_list(rt.alist(f, ["heparin", 5, "lipolicide", 5]));
	return 1;
}, true);
