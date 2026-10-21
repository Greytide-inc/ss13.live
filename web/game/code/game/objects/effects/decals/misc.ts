// From code/game/objects/effects/decals/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11534, "/obj/effect/temp_visual/point", "/obj/effect/temp_visual", {
	name: "pointer",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "arrow",
	layer: 12,
	duration: 25,
});

// /obj/effect/temp_visual/point/proc/Initialize  (code/game/objects/effects/decals/misc.dm:9)  may sleep
rt.def("/obj/effect/temp_visual/point/proc/Initialize", function* Initialize(f: Frame) {
	let old_loc: Value = null;
	f.vars = () => [old_loc];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	old_loc = rt.sv(f, "loc");
	rt.setSv(f, "loc", rt.getStep(f, live(f.src), 0));
	rt.setSv(f, "pixel_x", rt.fv(f, "pixel_x", live(old_loc)));
	rt.setSv(f, "pixel_y", rt.fv(f, "pixel_y", live(old_loc)));
	rt.setSv(f, "invisibility", live(f.args[1]));
	return f.dot;
}, true, { args: ["mapload", "set_invis"] });
