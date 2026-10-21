// From code/datums/diseases/advance/symptoms/shedding.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1008, "/datum/symptom/shedding", "/datum/symptom", {
	name: "Alopecia",
	stealth: -1,
	resistance: -1,
	stage_speed: -1,
	transmittable: 2,
	level: 4,
	severity: 1,
});

// /datum/symptom/shedding/proc/Activate  (code/datums/diseases/advance/symptoms/shedding.dm:28)  may sleep
rt.def("/datum/symptom/shedding/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [M, H, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [(M = rt.fv(f, "affected_mob", live(f.args[0]))), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your scalp itches.", "Your skin feels flakey."])])]);
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = live(M);
	$0 = rt.fv(f, "stage", live(f.args[0]));
	if ($0 === 3 || $0 === 4) {
		if ((!isEqual(rt.fv(f, "hair_style", live(H)), "Bald") && !isEqual(rt.fv(f, "hair_style", live(H)), "Balding Hair"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>Your hair starts to fall out in clumps...</span>"]);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/symptom/shedding/proc/Shed"), live(H), 0])), 50]);
		}
	} else if ($0 === 5) {
		if (!(!isEqual(rt.fv(f, "facial_hair_style", live(H)), "Shaved") || !isEqual(rt.fv(f, "hair_style", live(H)), "Bald"))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>Your hair starts to fall out in clumps...</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/symptom/shedding/proc/Shed"), live(H), 1])), 50]);
	}
	return f.dot;
}, true, { args: ["A"] });

// /datum/symptom/shedding/proc/Shed  (code/datums/diseases/advance/symptoms/shedding.dm:46)  may sleep
rt.def("/datum/symptom/shedding/proc/Shed", function* Shed(f: Frame, H: Value, fullbald: Value) {
	f.vars = () => [H, fullbald];
	if (truthy(live(fullbald))) {
		rt.setFv(f, "facial_hair_style", live(H), "Shaved");
		rt.setFv(f, "hair_style", live(H), "Bald");
	} else {
		rt.setFv(f, "hair_style", live(H), "Balding Hair");
	}
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, {  }] });
