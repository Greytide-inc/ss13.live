// Based on /tg/station's code/game/machinery/camera/motion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// motion.dm:10
rt.def("/obj/machinery/camera/proc/process", function process(f: Frame) {
	let elapsed: Value = null, target: Value = null;
	if (!this.isMotion()) {
		f.dot = PROCESS_KILL;
		return f.dot;
	}
	if (this.detectTime > 0) {
		if ((elapsed = rt.worldTime(f) - this.detectTime) > this.alarm_delay) {
			this.triggerAlarm();
		}
	} else {
		if (this.detectTime != -1) return f.dot;
		for (target of each(this.getTargetList(), T("/mob"))) {
			if (target.stat == 2 || !this.area_motion && !(get_dist(this, target) <= 1)) {
				this.lostTarget(target);
			}
		}
	}
	return f.dot;
}, false, { waitfor: false });

// motion.dm:25
rt.def("/obj/machinery/camera/proc/getTargetList", function getTargetList(f: Frame) {
	if (this.area_motion) {
		return this.area_motion.motionTargets;
	}
	return this.localMotionTargets;
});

// motion.dm:29
rt.def("/obj/machinery/camera/proc/newTarget", function newTarget(f: Frame, target: Value) {
	if (rt.istype(target, T("/mob/living/silicon/ai"))) {
		return 0;
	}
	if (this.detectTime == 0) {
		this.detectTime = rt.worldTime(f);
	}
	let targets: Value = this.getTargetList();
	if (!rt.isIn(f, target, targets)) {
		targets += target;
	}
	return 1;
});

// motion.dm:39
rt.def("/obj/machinery/camera/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	if (rt.istype((A = get_area(this)), T("/area/ai_monitored"))) {
		A.motioncameras -= this;
	}
	return (yield* parent_proc());
}, true);

// motion.dm:45
rt.def("/obj/machinery/camera/proc/lostTarget", function lostTarget(f: Frame, target: Value) {
	let targets: Value = this.getTargetList();
	if (rt.isIn(f, target, targets)) {
		targets -= target;
	}
	if (rt.len(f, targets) != 0) return f.dot;
	this.cancelAlarm();
	return f.dot;
});

// motion.dm:52
rt.def("/obj/machinery/camera/proc/cancelAlarm", function cancelAlarm(f: Frame) {
	let aiPlayer: Value = null;
	if (this.detectTime == -1) {
		for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon"))) {
			if (this.status) {
				aiPlayer.cancelAlarm("Motion", get_area(this), this);
			}
		}
	}
	this.detectTime = 0;
	return 1;
});

// motion.dm:60
rt.def("/obj/machinery/camera/proc/triggerAlarm", function triggerAlarm(f: Frame) {
	let aiPlayer: Value = null;
	if (!this.detectTime) {
		return 0;
	}
	for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon"))) {
		if (this.status) {
			aiPlayer.triggerAlarm("Motion", get_area(this), list(this), this);
		}
	}
	this.detectTime = -1;
	return 1;
});

// motion.dm:69
rt.def("/obj/machinery/camera/proc/HasProximity", function HasProximity(f: Frame, AM: Value) {
	if (this.area_motion) return f.dot;
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	this.newTarget(AM);
	return f.dot;
});
