// Based on /tg/station's code/game/objects/effects/temporary_visuals/cult.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11578, "/obj/effect/temp_visual/cult/rune_spawn", "/obj/effect/temp_visual/cult", {
	turnedness: 179,
	icon_state: "runeouter",
	alpha: 0,
});

// cult.dm:58
rt.def("/obj/effect/temp_visual/cult/rune_spawn/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_duration: Value, set_color: Value) {
	let M: Value = null;
	if (isnum(set_duration)) {
		this.duration = set_duration;
	}
	if (set_color) {
		this.add_atom_colour(set_color, FIXED_COLOUR_PRIORITY);
	}
	f.dot = (yield* parent_proc());
	let oldtransform: Value = this.transform;
	this.transform = matrix() * 2;
	(M = this.transform).Turn(this.turnedness);
	this.transform = M;
	rt.op(f, "Animate", [2, 10], [null, this, "alpha", 255, "time", this.duration, "easing", 4, "flags", 4]);
	rt.op(f, "Animate", [2, 8], [null, this, "transform", oldtransform, "time", this.duration, "flags", 4]);
	return f.dot;
}, true);
