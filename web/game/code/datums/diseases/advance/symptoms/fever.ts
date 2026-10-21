// From code/datums/diseases/advance/symptoms/fever.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(989, "/datum/symptom/fever", "/datum/symptom", {
	name: "Fever",
	stealth: 0,
	resistance: 3,
	stage_speed: 3,
	transmittable: 2,
	level: 2,
	severity: 2,
});

// /datum/symptom/fever/proc/Activate  (code/datums/diseases/advance/symptoms/fever.dm:29)
rt.def("/datum/symptom/fever/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		rt.call(f, P("/proc/to_chat"), null, [(M = rt.fv(f, "affected_mob", live(f.args[0]))), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["You feel hot.", "You feel like you're burning."])])]);
		if (rt.lt(rt.fv(f, "bodytemperature", live(M)), 360.1499938964844)) {
			rt.callSrc(f, "Heat", [live(M), live(f.args[0])]);
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });

// /datum/symptom/fever/proc/Heat  (code/datums/diseases/advance/symptoms/fever.dm:39)
rt.def("/datum/symptom/fever/proc/Heat", function Heat(f: Frame, M: Value, A: Value) {
	let get_heat: Value = null;
	f.vars = () => [get_heat];
	get_heat = add(rt.op(f, "Sqrt", [], [rt.call(f, P("/proc/max"), null, [21, add(21, multiply(rt.callName(f, live(A), "totalTransmittable", []), 2))])]), rt.op(f, "Sqrt", [], [rt.call(f, P("/proc/max"), null, [21, add(20, multiply(rt.callName(f, live(A), "totalStageSpeed", []), 3))])]));
	rt.setFv(f, "bodytemperature", live(M), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "bodytemperature", live(M)), multiply(live(get_heat), rt.fv(f, "stage", live(A)))), 359.1499938964844]));
	return 1;
});
