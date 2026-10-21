// From code/modules/mob/dead/dead.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5095, "/mob/dead", "/mob", {});

// /mob/dead/proc/New  (code/modules/mob/dead/dead.dm:3)  may sleep
rt.def("/mob/dead/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "initialized"))) return f.dot;
	rt.setAt(f.argsList, 1, 1);
	yield* g.callName(f, rt.gl("SSatoms"), "InitAtom", [live(f.src), f.argsList]);
	return f.dot;
}, true, { args: ["loc"] });

// /mob/dead/proc/Initialize  (code/modules/mob/dead/dead.dm:7)
rt.def("/mob/dead/proc/Initialize", function Initialize(f: Frame) {
	if (truthy(rt.sv(f, "initialized"))) {
		rt.call(f, P("/proc/stack_trace"), null, [fmt("Warning: ＀(＀) initialized multiple times!", [live(f.src), rt.sv(f, "type")])]);
	}
	rt.setSv(f, "initialized", 1);
	rt.setSv(f, "tag", fmt("mob_＀", [rt.incGl("next_mob_id", 1, true)]));
	rt.modGl("mob_list", live(f.src), add);
	rt.callSrc(f, "prepare_huds", []);
	return 0;
});
