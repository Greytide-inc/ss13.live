// Based on /tg/station's code/modules/mob/living/silicon/ai/freelook/eye.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5101, "/mob/camera/aiEye", "/mob/camera", {
	visibleCameraChunks: null,
	ai: null,
	relay_speech: 0,
	use_static: 1,
	name: "Inactive AI Eye",
	invisibility: 100,
});

// eye.dm:10
rt.def("/mob/camera/aiEye/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.visibleCameraChunks = list();
	return f.dot;
});

// eye.dm:21
rt.def("/mob/camera/aiEye/proc/setLoc", function* setLoc(f: Frame, _T: Value) {
	let H: Value = null;
	if (!this.ai) return f.dot;
	if (!isturf(this.ai.loc)) {
		return f.dot;
	}
	this.loc = (_T = rt.getStep(f, _T, 0));
	if (this.use_static) {
		GLOB.cameranet.visibility(this);
	}
	if (this.ai.client) {
		this.ai.client.eye = this;
	}
	yield* this.update_parallax_contents();
	if (!rt.istype(this.ai.current, T("/obj/machinery/holopad"))) return f.dot;
	yield* (H = this.ai.current).move_hologram(this.ai, _T);
	return f.dot;
}, true);

// eye.dm:40
rt.def("/mob/camera/aiEye/proc/GetViewerClient", function GetViewerClient(f: Frame) {
	if (this.ai) {
		return this.ai.client;
	}
	return null;
});

// eye.dm:45
rt.def("/mob/camera/aiEye/proc/RemoveImages", function RemoveImages(f: Frame) {
	let chunk: Value = null;
	if (!this.use_static) return f.dot;
	for (chunk of each(this.visibleCameraChunks, T("/datum/camerachunk"))) {
		chunk.remove(this);
	}
	return f.dot;
});

// eye.dm:50
rt.def("/mob/camera/aiEye/proc/Destroy", function* Destroy(f: Frame) {
	this.ai = null;
	return (yield* parent_proc());
}, true);

// eye.dm:53
rt.def("/atom/proc/move_camera_by_click", function* move_camera_by_click(f: Frame) {
	let AI: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/silicon/ai"))) return f.dot;
	if (!((AI = f.usr).eyeobj && AI.client.eye == AI.eyeobj)) return f.dot;
	AI.cameraFollow = null;
	if (!(isturf(this.loc) || isturf(this))) return f.dot;
	yield* AI.eyeobj.setLoc(this);
	return f.dot;
}, true);

// eye.dm:65
rt.def("/client/proc/AIMove", function* AIMove(f: Frame, n: Value, direct: Value, user: Value) {
	let step: Value = null;
	let initial: Value = rt.initial(f, user, "sprint");
	let max_sprint: Value = 50;
	if (user.cooldown && user.cooldown < rt.world().timeofday) {
		user.sprint = initial;
	}
	let i: Value = 0;
	while (i < max(user.sprint, initial)) {
		if (step = rt.getStep(f, rt.getStep(f, user.eyeobj, direct), 0)) {
			yield* user.eyeobj.setLoc(step);
		}
		i += 20;
	}
	user.cooldown = rt.world().timeofday + 5;
	if (user.acceleration) {
		user.sprint = min(user.sprint + 0.5, max_sprint);
	} else {
		user.sprint = initial;
	}
	if (!user.tracking) {
		user.cameraFollow = null;
	}
	if (!user.camera_light_on) return f.dot;
	user.light_cameras();
	return f.dot;
}, true);

// eye.dm:95
rt.def("/mob/living/silicon/ai/proc/view_core", function* view_core(f: Frame) {
	this.current = null;
	this.cameraFollow = null;
	yield* this.unset_machine();
	if (!this.eyeobj || !this.eyeobj.loc || !this.eyeobj || this.eyeobj.gc_destroyed) {
		to_chat(this, "ERROR: Eyeobj not found. Creating new eye...");
		this.eyeobj = (yield* new_(T("/mob/camera/aiEye"), this.loc));
		this.eyeobj.ai = this;
		this.eyeobj.name = `${this.name} (AI Eye)`;
	}
	yield* this.eyeobj.setLoc(this.loc);
	return f.dot;
}, true);

// eye.dm:109
rt.def("/mob/living/silicon/ai/verb/toggle_acceleration", function toggle_acceleration(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	this.acceleration = (!this.acceleration ? 1 : 0);
	let $0: any = f.usr;
	to_chat($0, `Camera acceleration has been toggled ${this.acceleration ? "on" : "off"}.`);
	return f.dot;
}, false, { verb: { name: "Toggle Camera Acceleration", category: "AI Commands" } });

// eye.dm:115
rt.def("/mob/camera/aiEye/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (!(this.relay_speech && speaker && this.ai && !radio_freq && speaker != this.ai && near_camera(speaker))) return f.dot;
	yield* this.ai.relay_speech(message, speaker, message_language, raw_message, radio_freq, spans, message_mode);
	return f.dot;
}, true);
