// From code/datums/diseases/advance/symptoms/headache.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(996, "/datum/symptom/headache", "/datum/symptom", {
	name: "Headache",
	stealth: -1,
	resistance: 4,
	stage_speed: 2,
	transmittable: 0,
	level: 1,
	severity: 1,
});

// /datum/symptom/headache/proc/Activate  (code/datums/diseases/advance/symptoms/headache.dm:30)
rt.def("/datum/symptom/headache/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		rt.call(f, P("/proc/to_chat"), null, [(M = rt.fv(f, "affected_mob", live(f.args[0]))), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [2], ["Your head hurts.", "Your head starts pounding."])])]);
	}
	return live(f.dot);
}, false, { args: ["A"] });
