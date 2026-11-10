// Based on /tg/station's code/modules/mob/living/silicon/ai/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/silicon/ai/proc/death", function* death(f: Frame, gibbed: Value) {
	let O: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (rt.isIn(f, `${this.icon_state}_dead`, icon_states(this.icon, 1))) {
		this.icon_state = `${this.icon_state}_dead`;
	} else {
		this.icon_state = "ai_dead";
	}
	this.cameraFollow = null;
	this.anchored = 0;
	yield* this.update_canmove();
	if (this.eyeobj) {
		yield* this.eyeobj.setLoc(rt.getStep(f, this, 0));
	}
	GLOB.shuttle_caller_list -= this;
	yield* GLOB.SSshuttle.autoEvac();
	yield* this.ShutOffDoomsdayDevice();
	if (this.explosive) {
		rt.spawnTail(f, 10, "/mob/living/silicon/ai/proc/death: spawn at modules/mob/living/silicon/ai/death.dm:25", O);
	}
	for (O of each(GLOB.ai_status_displays, T("/obj/machinery/ai_status_display"))) {
		if (this.key) {
			O.mode = 2;
			if (rt.istype(this.loc, T("/obj/item/device/aicard"))) {
				this.loc.icon_state = "aicard-404";
			}
		}
	}
	return f.dot;
}, true);

// a spawn(10) body of /mob/living/silicon/ai/proc/death, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/ai/proc/death: spawn at modules/mob/living/silicon/ai/death.dm:25", function* (f: Frame, O: Value) {
	yield* explosion(this.loc, 3, 6, 12, 15);
	return null;
});

// death.dm:36
rt.def("/mob/living/silicon/ai/proc/ShutOffDoomsdayDevice", function* ShutOffDoomsdayDevice(f: Frame) {
	let _P: Value = null;
	if (this.nuking) {
		set_security_level("red");
		this.nuking = 0;
		for (_P of each(GLOB.pinpointer_list, T("/obj/item/weapon/pinpointer"))) {
			_P.switch_mode_to(TRACK_NUKE_DISK);
			_P.nuke_warning = 0;
		}
	}
	if (!this.doomsday_device) return f.dot;
	this.doomsday_device.timing = 0;
	yield* GLOB.SSshuttle.clearHostileEnvironment(this.doomsday_device);
	yield* qdel(this.doomsday_device);
	return f.dot;
}, true);
