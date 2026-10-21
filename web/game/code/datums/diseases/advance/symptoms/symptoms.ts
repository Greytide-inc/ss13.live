// From code/datums/diseases/advance/symptoms/symptoms.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(981, "/datum/symptom", "/datum", {
	name: "",
	stealth: 0,
	resistance: 0,
	stage_speed: 0,
	transmittable: 0,
	level: 0,
	severity: 0,
	id: "",
}, { global: { SYMPTOM_ACTIVATION_PROB: 642 } });

// /datum/symptom/proc/New  (code/datums/diseases/advance/symptoms/symptoms.dm:19)
rt.def("/datum/symptom/proc/New", function New(f: Frame) {
	let S: Value = null, i: Value = null;
	f.vars = () => [S, i];
	S = rt.gl("list_symptoms");
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, live(S)))) {
		if (isEqual(rt.fv(f, "type", live(f.src)), rt.index(live(S), live(i)))) {
			rt.setSv(f, "id", fmt("＀", [live(i)]));
			return live(f.dot);
		}
		i = rt.inc(live(i), 1);
	}
	rt.call(f, P("/proc/CRASH"), null, ["We couldn't assign an ID!"]);
	return f.dot;
});
