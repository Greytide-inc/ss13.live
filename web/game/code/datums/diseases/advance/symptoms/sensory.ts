// Based on /tg/station's code/datums/diseases/advance/symptoms/sensory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1006, "/datum/symptom/sensory_restoration", "/datum/symptom", {
	name: "Sensory Restoration",
	stealth: -1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -3,
	level: 5,
	severity: 0,
});

// sensory.dm:28
rt.def("/datum/symptom/sensory_restoration/proc/Activate", function* Activate(f: Frame, A: Value) {
	let H: Value = null;
	yield* parent_proc();
	let M: Value = A.affected_mob;
	if (A.stage >= 2) {
		M.restoreEars();
	}
	if (A.stage >= 3) {
		M.dizziness = 0;
		M.drowsyness = 0;
		M.slurring = 0;
		M.confused = 0;
		yield* M.reagents.remove_all_type(T("/datum/reagent/consumable/ethanol"), 3);
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			(H = M).drunkenness = max(H.drunkenness - 10, 0);
		}
	}
	if (A.stage >= 4) {
		M.drowsyness = max(M.drowsyness - 5, 0);
		if (M.reagents.has_reagent("mindbreaker")) {
			yield* M.reagents.remove_reagent("mindbreaker", 5);
		}
		if (M.reagents.has_reagent("histamine")) {
			yield* M.reagents.remove_reagent("histamine", 5);
		}
		M.hallucination = max(0, M.hallucination - 10);
	}
	if (!(A.stage >= 5)) return f.dot;
	yield* M.adjustBrainLoss(-3);
	return f.dot;
}, true);

rt.type(1007, "/datum/symptom/sensory_destruction", "/datum/symptom", {
	sleepy: 0,
	sleepy_ticks: 0,
	name: "Sensory destruction",
	stealth: -1,
	resistance: -2,
	stage_speed: -3,
	transmittable: -4,
	level: 6,
	severity: 5,
});

// sensory.dm:84
rt.def("/datum/symptom/sensory_destruction/proc/Activate", function* Activate(f: Frame, A: Value) {
	yield* parent_proc();
	let M: Value = A.affected_mob;
	if (prob(GLOB.SYMPTOM_ACTIVATION_PROB)) {
		if (A.stage === 1) {
			to_chat(M, "<span class='warning'>You can't feel anything.</span>");
		} else if (A.stage === 2) {
			to_chat(M, "<span class='warning'>You feel absolutely hammered.</span>");
			if (prob(10)) {
				this.sleepy_ticks += rand(10, 14);
			}
		} else if (A.stage === 3) {
			yield* M.reagents.add_reagent("ethanol", rand(5, 7));
			to_chat(M, "<span class='warning'>You try to focus on not dying.</span>");
			if (prob(15)) {
				this.sleepy_ticks += rand(10, 14);
			}
		} else if (A.stage === 4) {
			yield* M.reagents.add_reagent("ethanol", rand(6, 10));
			to_chat(M, "<span class='warning'>u can count 2 potato!</span>");
			if (prob(20)) {
				this.sleepy_ticks += rand(10, 14);
			}
		} else if (A.stage === 5) {
			yield* M.reagents.add_reagent("ethanol", rand(7, 13));
			if (prob(25)) {
				this.sleepy_ticks += rand(10, 14);
			}
		}
	}
	if (this.sleepy_ticks) {
		if (A.stage >= 4) {
			M.hallucination = min(M.hallucination + 10, 50);
		}
		if (A.stage >= 5) {
			if (prob(80)) {
				yield* M.adjustBrainLoss(1);
			}
			if (prob(50)) {
				M.drowsyness = max(M.drowsyness, 3);
			}
		}
		this.sleepy++;
		this.sleepy_ticks--;
	} else {
		this.sleepy = 0;
	}
	if (this.sleepy === 11) {
		to_chat(M, "<span class='warning'>You start to feel tired...</span>");
	} else if (rt.inRange(this.sleepy, 12, 24)) {
		M.drowsyness += 1;
	} else if (rt.inRange(this.sleepy, 24, 1e+31)) {
		yield* M.Sleeping(40);
	}
	return f.dot;
}, true);
