// From code/datums/diseases/advance/symptoms/shivering.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1009, "/datum/symptom/shivering", "/datum/symptom", {
	name: "Shivering",
	stealth: 0,
	resistance: 2,
	stage_speed: 2,
	transmittable: 2,
	level: 2,
	severity: 2,
});

// /datum/symptom/shivering/proc/Activate  (code/datums/diseases/advance/symptoms/shivering.dm:29)
rt.def("/datum/symptom/shivering/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		rt.call(f, P("/proc/to_chat"), null, [(M = rt.fv(f, "affected_mob", live(f.args[0]))), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel cold.", "You start shivering."])])]);
		if (rt.lt(rt.fv(f, "bodytemperature", live(M)), 260.1499938964844)) {
			rt.callSrc(f, "Chill", [live(M), live(f.args[0])]);
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });

// /datum/symptom/shivering/proc/Chill  (code/datums/diseases/advance/symptoms/shivering.dm:38)
rt.def("/datum/symptom/shivering/proc/Chill", function Chill(f: Frame, M: Value, A: Value) {
	let get_cold: Value = null;
	f.vars = () => [get_cold];
	get_cold = add(rt.op(f, "Sqrt", [], [add(16, multiply(rt.callName(f, live(A), "totalStealth", []), 2))]), rt.op(f, "Sqrt", [], [add(21, multiply(rt.callName(f, live(A), "totalResistance", []), 2))]));
	rt.setFv(f, "bodytemperature", live(M), rt.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "bodytemperature", live(M)), multiply(live(get_cold), rt.fv(f, "stage", live(A)))), 261.1499938964844]));
	return 1;
});
