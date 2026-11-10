// Based on /tg/station's code/datums/diseases/advance/symptoms/choking.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(983, "/datum/symptom/choking", "/datum/symptom", {
	name: "Choking",
	stealth: -3,
	resistance: -2,
	stage_speed: -2,
	transmittable: -4,
	level: 3,
	severity: 3,
});

// choking.dm:29
rt.def("/datum/symptom/choking/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 1 || A.stage === 2) {
			to_chat(M, `<span class='warning'>${pick("You're having difficulty breathing.", "Your breathing becomes heavy.")}</span>`);
		} else if (A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'><b>${pick("Your windpipe feels like a straw.", "Your breathing becomes tremendously difficult.")}</span>`);
			yield* this.Choke_stage_3_4(M, A);
			yield* M.emote("gasp");
		} else {
			to_chat(M, `<span class='userdanger'>${pick("You're choking!", "You can't breathe!")}</span>`);
			yield* this.Choke(M, A);
			yield* M.emote("gasp");
		}
	}
	return f.dot;
}, true);

// choking.dm:46
rt.def("/datum/symptom/choking/proc/Choke_stage_3_4", function* Choke_stage_3_4(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [21 + A.totalStageSpeed() * 0.5]) + rt.op(f, "Sqrt", [], [max(16 + A.totalStealth(), 0)]);
	yield* M.adjustOxyLoss(get_damage);
	return 1;
}, true);

// choking.dm:51
rt.def("/datum/symptom/choking/proc/Choke", function* Choke(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [21 + A.totalStageSpeed() * 0.5]) + rt.op(f, "Sqrt", [], [max(16 + A.totalStealth() * 5, 0)]);
	yield* M.adjustOxyLoss(get_damage);
	return 1;
}, true);

rt.type(984, "/datum/symptom/asphyxiation", "/datum/symptom", {
	name: "Acute respiratory distress syndrome",
	stealth: -2,
	resistance: 0,
	stage_speed: -1,
	transmittable: -2,
	level: 7,
	severity: 3,
});

// choking.dm:83
rt.def("/datum/symptom/asphyxiation/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 3 || A.stage === 4) {
			to_chat(M, `<span class='warning'><b>${pick("Your windpipe feels thin.", "Your lungs feel small.")}</span>`);
			yield* this.Asphyxiate_stage_3_4(M, A);
			yield* M.emote("gasp");
		} else {
			to_chat(M, `<span class='userdanger'>${pick("Your lungs hurt!", "It hurts to breathe!")}</span>`);
			yield* this.Asphyxiate(M, A);
			yield* M.emote("gasp");
			if (M.getOxyLoss() >= 120) {
				M.visible_message(`<span class='warning'>${M} stops breathing, as if their lungs have totally collapsed!</span>`);
				yield* this.Asphyxiate_death(M, A);
			}
		}
	}
	return f.dot;
}, true);

// choking.dm:101
rt.def("/datum/symptom/asphyxiation/proc/Asphyxiate_stage_3_4", function* Asphyxiate_stage_3_4(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [21 + A.totalStageSpeed() * 0.7])]) + rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [16 + A.totalStealth()])]);
	yield* M.adjustOxyLoss(get_damage);
	return 1;
}, true);

// choking.dm:106
rt.def("/datum/symptom/asphyxiation/proc/Asphyxiate", function* Asphyxiate(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [21 + A.totalStageSpeed()])]) + rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [16 + A.totalStealth() * 5])]);
	yield* M.adjustOxyLoss(get_damage);
	yield* M.reagents.add_reagent_list(rt.alist(f, ["pancuronium", 2, "sodium_thiopental", 2]));
	return 1;
}, true);

// choking.dm:112
rt.def("/datum/symptom/asphyxiation/proc/Asphyxiate_death", function* Asphyxiate_death(f: Frame, M: Value, A: Value) {
	let get_damage: Value = rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [21 + A.totalStageSpeed() * 1.5])]) + rt.op(f, "Sqrt", [], [rt.op(f, "Abs", [], [16 + A.totalStealth() * 7])]);
	yield* M.adjustOxyLoss(get_damage);
	yield* M.adjustBrainLoss(get_damage / 2);
	return 1;
}, true);
