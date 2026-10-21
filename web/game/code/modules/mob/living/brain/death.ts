// From code/modules/mob/living/brain/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/brain/proc/death  (code/modules/mob/living/brain/death.dm:2)  may sleep
rt.def("/mob/living/brain/proc/death", function* death(f: Frame) {
	let mmi: Value = null;
	f.vars = () => [mmi];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "stat", 2);
	if ((!truthy(live(f.args[0])) && truthy(rt.sv(f, "container")))) {
		yield* g.callName(f, (mmi = rt.sv(f, "container")), "visible_message", [fmt("<span class='warning'>＀'s MMI flatlines!</span>", [live(f.src)]), "<span class='italics'>You hear something flatline.</span>"]);
		yield* g.callName(f, live(mmi), "update_icon", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["gibbed"] });

// /mob/living/brain/proc/gib  (code/modules/mob/living/brain/death.dm:16)  may sleep
rt.def("/mob/living/brain/proc/gib", function* gib(f: Frame) {
	if (truthy(rt.sv(f, "container"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "container")]);
	}
	if (truthy(rt.sv(f, "loc"))) {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/organ/brain")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "loc")]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
