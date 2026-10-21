// From code/modules/mob/living/simple_animal/slime/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/slime/proc/Hear  (code/modules/mob/living/simple_animal/slime/say.dm:2)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Hear", function* Hear(f: Frame) {
	if (((!isEqual(live(f.args[1]), live(f.src)) && !truthy(live(f.args[4]))) && !truthy(rt.sv(f, "stat")))) {
		if (truthy((rt.isIn(f, live(f.args[1]), rt.sv(f, "Friends")) ? 1 : 0))) {
			rt.setSv(f, "speech_buffer", rt.list());
			rt.modSrcVar(f, "speech_buffer", live(f.args[1]), add);
			rt.modSrcVar(f, "speech_buffer", (yield* g.call(f, P("/proc/lowertext"), null, [(yield* g.call(f, P("/proc/html_decode"), null, [live(f.args[0])]))])), add);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["message", "speaker", "message_langs", "raw_message", "radio_freq", "spans", "message_mode"] });
