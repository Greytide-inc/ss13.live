// Based on /tg/station's code/game/mecha/working/working.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12119, "/obj/mecha/working", "/obj/mecha", {
	internal_damage_threshold: 60,
});

// working.dm:5
rt.def("/obj/mecha/working/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.trackers += (yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this));
	return f.dot;
}, true);
