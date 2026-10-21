// From code/modules/events/mass_hallucination.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(312, "/datum/round_event/mass_hallucination", "/datum/round_event", {});

// /datum/round_event/mass_hallucination/proc/start  (code/modules/events/mass_hallucination.dm:9)
rt.def("/datum/round_event/mass_hallucination/proc/start", function start(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.modField(f, live(C), "hallucination", rt.call(f, P("/proc/rand"), null, [20, 50]), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});
