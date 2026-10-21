// From code/modules/mob/living/carbon/alien/humanoid/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/humanoid/proc/death  (code/modules/mob/living/carbon/alien/humanoid/death.dm:2)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/death", function* death(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_canmove");
	yield* g.srcCall(f, "update_icons");
	(rt.modSrcVar(f, "status_flags", 8, rt.bitOr));
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/carbon/alien/humanoid/royal/queen/proc/death  (code/modules/mob/living/carbon/alien/humanoid/death.dm:13)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/death", function* death(f: Frame) {
	let C: Value = null, node: Value = null;
	let $e: any;
	f.vars = () => [C, node, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	C = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(live(C), live(f.src))) {
			continue;
		}
		if (truthy((rt.istype((node = (yield* g.callName(f, live(C), "getorgan", [T("/obj/item/organ/alien/hivenode")]))), T("/obj/item/organ/alien/hivenode")) ? 1 : 0))) {
			yield* g.callName(f, live(node), "queen_death", []);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["gibbed"] });
