// Based on /tg/station's code/datums/diseases/advance/symptoms/fire.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(990, "/datum/symptom/fire", "/datum/symptom", {
	name: "Spontaneous Combustion",
	stealth: 1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -4,
	level: 6,
	severity: 5,
});

// fire.dm:29
rt.def("/datum/symptom/fire/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 3) {
			to_chat(M, `<span class='warning'>${pick("You feel hot.", "You hear a crackling noise.", "You smell smoke.")}</span>`);
		} else if (A.stage === 4) {
			yield* this.Firestacks_stage_4(M, A);
			yield* M.IgniteMob();
			to_chat(M, "<span class='userdanger'>Your skin bursts into flames!</span>");
			yield* M.emote("scream");
		} else if (A.stage === 5) {
			yield* this.Firestacks_stage_5(M, A);
			yield* M.IgniteMob();
			to_chat(M, "<span class='userdanger'>Your skin erupts into an inferno!</span>");
			yield* M.emote("scream");
		}
	}
	return f.dot;
}, true);

// fire.dm:48
rt.def("/datum/symptom/fire/proc/Firestacks_stage_4", function* Firestacks_stage_4(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = rt.op(f, "Sqrt", [], [20 + A.totalStageSpeed() * 2]) - rt.op(f, "Sqrt", [], [max(0, 16 + A.totalStealth())]);
	yield* M.adjust_fire_stacks(get_stacks);
	yield* M.adjustFireLoss(get_stacks / 2);
	return 1;
}, true);

// fire.dm:54
rt.def("/datum/symptom/fire/proc/Firestacks_stage_5", function* Firestacks_stage_5(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = rt.op(f, "Sqrt", [], [max(0, 20 + A.totalStageSpeed() * 3)]) - rt.op(f, "Sqrt", [], [max(0, 16 + A.totalStealth())]);
	yield* M.adjust_fire_stacks(get_stacks);
	yield* M.adjustFireLoss(get_stacks);
	return 1;
}, true);

rt.type(991, "/datum/symptom/alkali", "/datum/symptom", {
	name: "Alkali perspiration",
	stealth: 2,
	resistance: -2,
	stage_speed: -2,
	transmittable: -2,
	level: 7,
	severity: 6,
});

// fire.dm:88
rt.def("/datum/symptom/alkali/proc/Activate", function* Activate(f: Frame, A: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		M = A.affected_mob;
		if (A.stage === 3) {
			to_chat(M, `<span class='warning'>${pick("Your veins boil.", "You feel hot.", "You smell meat cooking.")}</span>`);
		} else if (A.stage === 4) {
			yield* this.Alkali_fire_stage_4(M, A);
			yield* M.IgniteMob();
			to_chat(M, "<span class='userdanger'>Your sweat bursts into flames!</span>");
			yield* M.emote("scream");
		} else if (A.stage === 5) {
			yield* this.Alkali_fire_stage_5(M, A);
			yield* M.IgniteMob();
			to_chat(M, "<span class='userdanger'>Your skin erupts into an inferno!</span>");
			yield* M.emote("scream");
			if (M.fire_stacks < 0) {
				M.visible_message(`<span class='warning'>${M}'s sweat sizzles and pops on contact with water!</span>`);
				yield* explosion(M.loc, 0, 0, 2);
				yield* this.Alkali_fire_stage_5(M, A);
			}
		}
	}
	return f.dot;
}, true);

// fire.dm:111
rt.def("/datum/symptom/alkali/proc/Alkali_fire_stage_4", function* Alkali_fire_stage_4(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = rt.op(f, "Sqrt", [], [20 + A.totalStageSpeed() * 5]);
	yield* M.adjust_fire_stacks(get_stacks);
	yield* M.adjustFireLoss(get_stacks / 2);
	yield* M.reagents.add_reagent("clf3", 1);
	return 1;
}, true);

// fire.dm:118
rt.def("/datum/symptom/alkali/proc/Alkali_fire_stage_5", function* Alkali_fire_stage_5(f: Frame, M: Value, A: Value) {
	let get_stacks: Value = rt.op(f, "Sqrt", [], [20 + A.totalStageSpeed() * 8]);
	yield* M.adjust_fire_stacks(get_stacks);
	yield* M.adjustFireLoss(get_stacks);
	yield* M.reagents.add_reagent_list(rt.alist(f, ["napalm", 3, "clf3", 3]));
	return 1;
}, true);
