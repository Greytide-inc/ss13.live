// Based on /tg/station's code/modules/mob/living/silicon/robot/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:3
rt.def("/mob/living/silicon/robot/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/gib_animation"), this.loc, "gibbed-r");
	return f.dot;
}, true);

// death.dm:7
rt.def("/mob/living/silicon/robot/proc/dust", function* dust(f: Frame) {
	if (this.mmi) {
		yield* qdel(this.mmi);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// death.dm:11
rt.def("/mob/living/silicon/robot/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* new_(T("/obj/effect/decal/remains/robot"), this.loc);
	return f.dot;
}, true);

// death.dm:14
rt.def("/mob/living/silicon/robot/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/dust_animation"), this.loc, "dust-r");
	return f.dot;
}, true);

// death.dm:17
rt.def("/mob/living/silicon/robot/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.stat == 2) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	this.locked = 0;
	yield* this.update_canmove();
	if (this.camera && this.camera.status) {
		yield* this.camera.toggle_cam(this, 0);
	}
	yield* this.update_headlamp(1);
	yield* this.uneq_all();
	yield* this.update_icons();
	yield* this.unbuckle_all_mobs(1);
	return f.dot;
}, true);
