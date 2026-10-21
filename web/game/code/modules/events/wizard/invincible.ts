// From code/modules/events/wizard/invincible.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(344, "/datum/round_event/wizard/invincible", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/invincible/proc/start  (code/modules/events/wizard/invincible.dm:10)  may sleep
rt.def("/datum/round_event/wizard/invincible/proc/start", function* start(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(H)), "add_reagent", ["adminordrazine", 40]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel invincible, nothing can hurt you!</span>"]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
