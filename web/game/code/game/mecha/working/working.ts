// From code/game/mecha/working/working.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12119, "/obj/mecha/working", "/obj/mecha", {
	internal_damage_threshold: 60,
});

// /obj/mecha/working/proc/New  (code/game/mecha/working/working.dm:5)  may sleep
rt.def("/obj/mecha/working/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "trackers", (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)])), add);
	return f.dot;
}, true);
