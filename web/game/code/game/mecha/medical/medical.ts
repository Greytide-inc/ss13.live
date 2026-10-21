// From code/game/mecha/medical/medical.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12117, "/obj/mecha/medical", "/obj/mecha", {});

// /obj/mecha/medical/proc/New  (code/game/mecha/medical/medical.dm:2)  may sleep
rt.def("/obj/mecha/medical/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "trackers", (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_tracking"), [live(f.src)])), add);
	return f.dot;
}, true);

// /obj/mecha/medical/proc/mechturn  (code/game/mecha/medical/medical.dm:7)
rt.def("/obj/mecha/medical/proc/mechturn", function mechturn(f: Frame, direction: Value) {
	rt.callSrc(f, "setDir", [live(direction)]);
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechmove01.ogg"), 40, 1]);
	return 1;
});

// /obj/mecha/medical/proc/mechstep  (code/game/mecha/medical/medical.dm:12)  may sleep
rt.def("/obj/mecha/medical/proc/mechstep", function* mechstep(f: Frame, direction: Value) {
	let result: Value = null;
	f.vars = () => [direction, result];
	if (truthy((result = (yield* g.call(f, P("/proc/step"), null, [live(f.src), live(direction)]))))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechstep.ogg"), 25, 1]);
	}
	return live(result);
}, true);

// /obj/mecha/medical/proc/mechsteprand  (code/game/mecha/medical/medical.dm:18)  may sleep
rt.def("/obj/mecha/medical/proc/mechsteprand", function* mechsteprand(f: Frame) {
	let result: Value = null;
	f.vars = () => [result];
	if (truthy((result = (yield* g.call(f, P("/proc/step_rand"), null, [live(f.src)]))))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechstep.ogg"), 25, 1]);
	}
	return live(result);
}, true);
