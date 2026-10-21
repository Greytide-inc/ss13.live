// From code/modules/shuttle/ripple.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11696, "/obj/effect/temp_visual/ripple", "/obj/effect/temp_visual", {
	anchored: 1,
	duration: 300,
	name: "hyperspace ripple",
	desc: "Something is coming through hyperspace, you can see the visual disturbances. It's probably best not to be on top of these when whatever is tunneling comes through.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "medi_holo",
	density: 0,
	layer: 5.1,
	mouse_opacity: 1,
	alpha: 0,
});

// /obj/effect/temp_visual/ripple/proc/Initialize  (code/modules/shuttle/ripple.dm:17)  may sleep
rt.def("/obj/effect/temp_visual/ripple/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 255, "time", live(f.args[1])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/temp_visual/ripple/proc/stop_animation")])), 8, 4]);
	return f.dot;
}, true, { args: ["mapload", "time_left"] });

// /obj/effect/temp_visual/ripple/proc/stop_animation  (code/modules/shuttle/ripple.dm:22)
rt.def("/obj/effect/temp_visual/ripple/proc/stop_animation", function stop_animation(f: Frame) {
	rt.setSv(f, "icon_state", "medi_holo_no_anim");
	return f.dot;
});
