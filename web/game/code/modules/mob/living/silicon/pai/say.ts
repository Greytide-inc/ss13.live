// From code/modules/mob/living/silicon/pai/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/pai/proc/say  (code/modules/mob/living/silicon/pai/say.dm:3)  may sleep
rt.def("/mob/living/silicon/pai/proc/say", function* say(f: Frame, msg: Value) {
	f.vars = () => [msg];
	if (truthy(rt.sv(f, "silent"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Communication circuits remain unitialized.</span>"]);
	} else {
		yield* g.callSuper(f, [live(msg)]);
	}
	return f.dot;
}, true);
