// Based on /tg/station's code/game/area/ai_monitored.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13075, "/area/ai_monitored", "/area", {
	motioncameras: null,
	motionTargets: null,
	name: "AI Monitored Area",
});

// ai_monitored.dm:3
rt.def("/area/ai_monitored/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.motioncameras = list();

	this.motionTargets = list();
	return f.dot;
});

// ai_monitored.dm:7
rt.def("/area/ai_monitored/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let M: Value = null;
	yield* parent_proc();
	if (!mapload) return f.dot;
	for (M of each(this, T("/obj/machinery/camera"))) {
		if (M.isMotion()) {
			this.motioncameras.Add(M);
			M.area_motion = this;
		}
	}
	return f.dot;
}, true);

// ai_monitored.dm:17
rt.def("/area/ai_monitored/proc/Entered", function Entered(f: Frame, O: Value) {
	let X: Value = null, cam: Value = null;
	parent_proc();
	if (!(ismob(O) && rt.len(f, this.motioncameras))) return f.dot;
	for (X of each(this.motioncameras)) {
		(cam = X).newTarget(O);
		return f.dot;
	}
	return f.dot;
}, false, { waitfor: false });

// ai_monitored.dm:25
rt.def("/area/ai_monitored/proc/Exited", function Exited(f: Frame, O: Value) {
	let X: Value = null, cam: Value = null;
	parent_proc();
	if (!(ismob(O) && rt.len(f, this.motioncameras))) return f.dot;
	for (X of each(this.motioncameras)) {
		(cam = X).lostTarget(O);
		return f.dot;
	}
	return f.dot;
}, false);
