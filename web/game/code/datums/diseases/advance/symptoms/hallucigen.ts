// From code/datums/diseases/advance/symptoms/hallucigen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(995, "/datum/symptom/hallucigen", "/datum/symptom", {
	name: "Hallucigen",
	stealth: -2,
	resistance: -3,
	stage_speed: -3,
	transmittable: -1,
	level: 5,
	severity: 3,
});

// /datum/symptom/hallucigen/proc/Activate  (code/datums/diseases/advance/symptoms/hallucigen.dm:29)
rt.def("/datum/symptom/hallucigen/proc/Activate", function Activate(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.op(f, "Prob", [], [rt.gl("SYMPTOM_ACTIVATION_PROB")]))) {
		M = rt.fv(f, "affected_mob", live(f.args[0]));
		$0 = rt.fv(f, "stage", live(f.args[0]));
		if ($0 === 1 || $0 === 2) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [3], ["Something appears in your peripheral vision, then winks out.", "You hear a faint whispher with no source.", "Your head aches."])])]);
		} else if ($0 === 3 || $0 === 4) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='danger'>＀</span>", [rt.op(f, "PickUnweighted", [4], ["Something is following you.", "You are being watched.", "You hear a whisper in your ear.", "Thumping footsteps slam toward you from nowhere."])])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [4], ["Oh, your head...", "Your head pounds.", "They're everywhere! Run!", "Something in the shadows..."])])]);
			rt.modField(f, live(M), "hallucination", 25, add);
		}
	}
	return live(f.dot);
}, false, { args: ["A"] });
