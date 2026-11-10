// Based on /tg/station's code/game/objects/effects/decals/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11534, "/obj/effect/temp_visual/point", "/obj/effect/temp_visual", {
	name: "pointer",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "arrow",
	layer: 12,
	duration: 25,
});

// misc.dm:9
rt.def("/obj/effect/temp_visual/point/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	let old_loc: Value = this.loc;
	this.loc = rt.getStep(f, this, 0);
	this.pixel_x = old_loc.pixel_x;
	this.pixel_y = old_loc.pixel_y;
	this.invisibility = f.args[1];
	return f.dot;
}, true, { args: ["mapload", "set_invis"] });
