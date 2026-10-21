// From code/game/objects/effects/temporary_visuals/temporary_visual.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11527, "/obj/effect/temp_visual", "/obj/effect", {
	duration: 10,
	randomdir: 1,
	timerid: null,
	anchored: 1,
	icon_state: "nothing",
	layer: 4.1,
	mouse_opacity: 0,
});

// /obj/effect/temp_visual/proc/Initialize  (code/game/objects/effects/temporary_visuals/temporary_visual.dm:12)  may sleep
rt.def("/obj/effect/temp_visual/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "randomdir"))) {
		yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
	}
	rt.setSv(f, "timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), rt.sv(f, "duration"), 8])));
	return f.dot;
}, true);

// /obj/effect/temp_visual/proc/Destroy  (code/game/objects/effects/temporary_visuals/temporary_visual.dm:19)  may sleep
rt.def("/obj/effect/temp_visual/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
	return f.dot;
}, true);

rt.type(11600, "/obj/effect/temp_visual/dir_setting", "/obj/effect/temp_visual", {
	randomdir: 0,
});

// /obj/effect/temp_visual/dir_setting/proc/Initialize  (code/game/objects/effects/temporary_visuals/temporary_visual.dm:36)  may sleep
rt.def("/obj/effect/temp_visual/dir_setting/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "set_dir"] });
