// From code/modules/events/wizard/blobies.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(336, "/datum/round_event/wizard/blobies", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/blobies/proc/start  (code/modules/events/wizard/blobies.dm:10)  may sleep
rt.def("/datum/round_event/wizard/blobies/proc/start", function* start(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	H = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.new_(f, T("/mob/living/simple_animal/hostile/blob/blobspore"), [rt.fv(f, "loc", live(H))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
