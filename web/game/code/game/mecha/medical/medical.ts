// Based on /tg/station's code/game/mecha/medical/medical.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12117, "/obj/mecha/medical", "/obj/mecha", {});

// medical.dm:2
rt.def("/obj/mecha/medical/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.trackers += (yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this));
	return f.dot;
}, true);

// medical.dm:7
rt.def("/obj/mecha/medical/proc/mechturn", function mechturn(f: Frame, direction: Value) {
	this.setDir(direction);
	playsound(this, rt.rsc("sound/mecha/mechmove01.ogg"), 40, 1);
	return 1;
});

// medical.dm:12
rt.def("/obj/mecha/medical/proc/mechstep", function* mechstep(f: Frame, direction: Value) {
	let result: Value = null;
	if (result = (yield* step(this, direction))) {
		playsound(this, rt.rsc("sound/mecha/mechstep.ogg"), 25, 1);
	}
	return result;
}, true);

// medical.dm:18
rt.def("/obj/mecha/medical/proc/mechsteprand", function* mechsteprand(f: Frame) {
	let result: Value = null;
	if (result = (yield* step_rand(this))) {
		playsound(this, rt.rsc("sound/mecha/mechstep.ogg"), 25, 1);
	}
	return result;
}, true);
