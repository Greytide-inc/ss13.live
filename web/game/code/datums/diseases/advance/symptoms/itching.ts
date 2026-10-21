// From code/datums/diseases/advance/symptoms/itching.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1004, "/datum/symptom/itching", "/datum/symptom", {
	name: "Itching",
	stealth: 0,
	resistance: 3,
	stage_speed: 3,
	transmittable: 1,
	level: 1,
	severity: 1,
});

// /datum/symptom/itching/proc/Activate  (code/datums/diseases/advance/symptoms/itching.dm:30)
rt.def("/datum/symptom/itching/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		rt.call(f, P("/proc/to_chat"), null, [(M = rt.fv(f, "affected_mob", live(f.args[0]))), fmt("<span class='warning'>Your ＀ itches.</span>", [rt.op(f, "PickUnweighted", [5], ["back", "arm", "leg", "elbow", "head"])])]);
	}
	return live(f.dot);
}, false, { args: ["A"] });
