// From code/datums/diseases/advance/symptoms/sensory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1006, "/datum/symptom/sensory_restoration", "/datum/symptom", {
	name: "Sensory Restoration",
	stealth: -1,
	resistance: -4,
	stage_speed: -4,
	transmittable: -3,
	level: 5,
	severity: 0,
});

// /datum/symptom/sensory_restoration/proc/Activate  (code/datums/diseases/advance/symptoms/sensory.dm:28)  may sleep
rt.def("/datum/symptom/sensory_restoration/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	f.vars = () => [M, H];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	if (rt.ge(rt.fv(f, "stage", live(f.args[0])), 2)) {
		yield* g.callName(f, live(M), "restoreEars", []);
	}
	if (rt.ge(rt.fv(f, "stage", live(f.args[0])), 3)) {
		rt.setFv(f, "dizziness", live(M), 0);
		rt.setFv(f, "drowsyness", live(M), 0);
		rt.setFv(f, "slurring", live(M), 0);
		rt.setFv(f, "confused", live(M), 0);
		yield* g.callName(f, rt.fv(f, "reagents", live(M)), "remove_all_type", [T("/datum/reagent/consumable/ethanol"), 3]);
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			rt.setFv(f, "drunkenness", (H = live(M)), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drunkenness", live(H)), 10), 0])));
		}
	}
	if (rt.ge(rt.fv(f, "stage", live(f.args[0])), 4)) {
		rt.setFv(f, "drowsyness", live(M), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drowsyness", live(M)), 5), 0])));
		if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["mindbreaker"])))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(M)), "remove_reagent", ["mindbreaker", 5]);
		}
		if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["histamine"])))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(M)), "remove_reagent", ["histamine", 5]);
		}
		rt.setFv(f, "hallucination", live(M), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "hallucination", live(M)), 10)])));
	}
	if (!rt.ge(rt.fv(f, "stage", live(f.args[0])), 5)) return f.dot;
	yield* g.callName(f, live(M), "adjustBrainLoss", [-3]);
	return f.dot;
}, true, { args: ["A"] });

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

// /datum/symptom/sensory_destruction/proc/Activate  (code/datums/diseases/advance/symptoms/sensory.dm:84)  may sleep
rt.def("/datum/symptom/sensory_destruction/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = rt.fv(f, "affected_mob", live(f.args[0]));
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You can't feel anything.</span>"]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You feel absolutely hammered.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				rt.modSrcVar(f, "sleepy_ticks", (yield* g.call(f, P("/proc/rand"), null, [10, 14])), add);
			}
		} else if ($0 === 3) {
			yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", ["ethanol", (yield* g.call(f, P("/proc/rand"), null, [5, 7]))]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You try to focus on not dying.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [15]))) {
				rt.modSrcVar(f, "sleepy_ticks", (yield* g.call(f, P("/proc/rand"), null, [10, 14])), add);
			}
		} else if ($0 === 4) {
			yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", ["ethanol", (yield* g.call(f, P("/proc/rand"), null, [6, 10]))]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>u can count 2 potato!</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				rt.modSrcVar(f, "sleepy_ticks", (yield* g.call(f, P("/proc/rand"), null, [10, 14])), add);
			}
		} else if ($0 === 5) {
			yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", ["ethanol", (yield* g.call(f, P("/proc/rand"), null, [7, 13]))]);
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				rt.modSrcVar(f, "sleepy_ticks", (yield* g.call(f, P("/proc/rand"), null, [10, 14])), add);
			}
		}
	}
	if (truthy(rt.sv(f, "sleepy_ticks"))) {
		if (rt.ge(rt.fv(f, "stage", live(f.args[0])), 4)) {
			rt.setFv(f, "hallucination", live(M), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "hallucination", live(M)), 10), 50])));
		}
		if (rt.ge(rt.fv(f, "stage", live(f.args[0])), 5)) {
			if (truthy(rt.op(f, "Prob", [], [80]))) {
				yield* g.callName(f, live(M), "adjustBrainLoss", [1]);
			}
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				rt.setFv(f, "drowsyness", live(M), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "drowsyness", live(M)), 3])));
			}
		}
		rt.incSrcVar(f, "sleepy", 1, true);
		rt.incSrcVar(f, "sleepy_ticks", -1, true);
	} else {
		rt.setSv(f, "sleepy", 0);
	}
	$0 = rt.sv(f, "sleepy");
	if ($0 === 11) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You start to feel tired...</span>"]);
	} else if (rt.inRange($0, 12, 24)) {
		rt.modField(f, live(M), "drowsyness", 1, add);
	} else if (rt.inRange($0, 24, 9.999999848243207e+30)) {
		yield* g.callName(f, live(M), "Sleeping", [40]);
	}
	return f.dot;
}, true, { args: ["A"] });
