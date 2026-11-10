// Based on /tg/station's code/modules/shuttle/ripple.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// ripple.dm:17
rt.def("/obj/effect/temp_visual/ripple/proc/Initialize", function* Initialize(f: Frame, mapload: Value, time_left: Value) {
	f.dot = (yield* parent_proc());
	rt.op(f, "Animate", [2, 6], [null, this, "alpha", 255, "time", time_left]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/temp_visual/ripple/proc/stop_animation"))), 8, 4);
	return f.dot;
}, true);

// ripple.dm:22
rt.def("/obj/effect/temp_visual/ripple/proc/stop_animation", function stop_animation(f: Frame) {
	this.icon_state = "medi_holo_no_anim";
	return f.dot;
});
