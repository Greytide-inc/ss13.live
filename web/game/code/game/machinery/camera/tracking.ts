// Based on /tg/station's code/game/machinery/camera/tracking.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// tracking.dm:3
rt.def("/mob/living/silicon/ai/proc/get_camera_list", function get_camera_list(f: Frame) {
	let C: Value = null, C_2: Value = null, tempnetwork: Value = null;
	let $e: any;
	this.track.cameras.Cut();
	if (this.stat == 2) {
		return f.dot;
	}
	let L: Value = list();
	for (C of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
		L.Add(C);
	}
	camera_sort(L);
	let _T: Value = list();
	for (C_2 of each(L, T("/obj/machinery/camera"))) {
		if (rt.len(f, (tempnetwork = rt.bitAnd(C_2.network, this.network)))) {
			rt.setAt(_T, `${C_2.c_tag}${C_2.can_use() ? null : " (Deactivated)"}`, C_2);
		}
	}
	this.track.cameras = _T;
	return _T;
});

// tracking.dm:26
rt.def("/mob/living/silicon/ai/proc/ai_camera_list", function* ai_camera_list(f: Frame, camera: Value) {
	if (!camera) {
		return 0;
	}
	let C: Value = rt.index(this.track.cameras, camera);
	yield* this.eyeobj.setLoc(C);
	return f.dot;
}, true);

rt.type(1498, "/datum/trackable", "/datum", {
	names: null,
	namecounts: null,
	humans: null,
	others: null,
	cameras: null,
});

// tracking.dm:35
rt.def("/datum/trackable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.names = list();

	this.namecounts = list();

	this.humans = list();

	this.others = list();

	this.cameras = list();
	return f.dot;
});

// tracking.dm:43
rt.def("/mob/living/silicon/ai/proc/trackable_mobs", function* trackable_mobs(f: Frame) {
	let M: Value = null, human: Value = null, name: Value = null, targets: Value = null;
	this.track.names.Cut();
	this.track.namecounts.Cut();
	this.track.humans.Cut();
	this.track.others.Cut();
	if (f.usr.stat == 2) {
		return list();
	}
	for (M of each(GLOB.mob_list, T("/mob/living"))) {
		if (!M.can_track(f.usr)) {
			continue;
		}
		human = 0;
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			human = 1;
		}
		if (rt.isIn(f, (name = M.name), this.track.names)) {
			rt.incAt(this.track.namecounts, name, 1, true);
			name = `${name} (${rt.index(this.track.namecounts, name)})`;
		} else {
			this.track.names.Add(name);
			rt.setAt(this.track.namecounts, name, 1);
		}
		if (human) {
			rt.setAt(this.track.humans, name, M);
		} else {
			rt.setAt(this.track.others, name, M);
		}
	}
	return (targets = (yield* sortList(this.track.humans)) + (yield* sortList(this.track.others)));
}, true);

// tracking.dm:80
rt.def("/mob/living/silicon/ai/verb/ai_camera_track", function ai_camera_track(f: Frame, target_name: Value) {
	let target: Value = null;
	let $0: any;
	if (!target_name) {
		return f.dot;
	}
	if (rt.index(this.track.humans, target_name) === null) {
		$0 = rt.index(this.track.others, target_name);
	} else {
		$0 = rt.index(this.track.humans, target_name);
	}
	this.ai_actual_track((target = $0));
	return f.dot;
}, false, { hidden: true, verb: { name: "track" }, argTypes: [{ source: "trackable_mobs" }] });

// tracking.dm:88
rt.def("/mob/living/silicon/ai/proc/ai_actual_track", function ai_actual_track(f: Frame, target: Value) {
	let U: Value = null;
	if (!rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	(U = f.usr).cameraFollow = target;
	U.tracking = 1;
	if (!target || !target.can_track(f.usr)) {
		to_chat(U, "<span class='warning'>Target is not near any active cameras.</span>");
		U.cameraFollow = null;
		return f.dot;
	}
	to_chat(U, `<span class='notice'>Now tracking ${target.get_visible_name()} on camera.</span>`);
	let cameraticks: Value = 0;
	rt.spawnTail(f, 0, "/mob/living/silicon/ai/proc/ai_actual_track: spawn at game/machinery/camera/tracking.dm:103", target, U, cameraticks);
	return f.dot;
});

// a spawn(0) body of /mob/living/silicon/ai/proc/ai_actual_track, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/ai/proc/ai_actual_track: spawn at game/machinery/camera/tracking.dm:103", function* (f: Frame, target: Value, U: Value, cameraticks: Value) {
	while (U.cameraFollow == target) {
		if (U.cameraFollow === null) {
			return f.dot;
		}
		if (!target.can_track(f.usr)) {
			U.tracking = 1;
			if (!cameraticks) {
				to_chat(U, "<span class='warning'>Target is not near any active cameras. Attempting to reacquire...</span>");
			}
			cameraticks++;
			if (cameraticks > 9) {
				U.cameraFollow = null;
				to_chat(U, "<span class='warning'>Unable to reacquire, cancelling track...</span>");
				this.tracking = 0;
				return f.dot;
			} else {
				yield* sleep(10);
				continue;
			}
		} else {
			cameraticks = 0;
			U.tracking = 0;
		}
		if (U.eyeobj) {
			yield* U.eyeobj.setLoc(rt.getStep(f, target, 0));
		} else {
			yield* this.view_core();
			U.cameraFollow = null;
			return f.dot;
		}
		yield* sleep(10);
	}
	return null;
});

// tracking.dm:137
rt.def("/proc/near_camera", function near_camera(f: Frame, M: Value) {
	let R: Value = null;
	if (!isturf(M.loc)) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/silicon/robot"))) {
		if (!((R = M).camera && R.camera.can_use()) && !GLOB.cameranet.checkCameraVis(M)) {
			return 0;
		}
	} else if (!GLOB.cameranet.checkCameraVis(M)) {
		return 0;
	}
	return 1;
});

// tracking.dm:148
rt.def("/obj/machinery/camera/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (!this.can_use()) {
		return f.dot;
	}
	yield* user.eyeobj.setLoc(rt.getStep(f, this, 0));
	return f.dot;
}, true);

// tracking.dm:156
rt.def("/mob/living/silicon/ai/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.ai_camera_list();
	return f.dot;
}, true);

// tracking.dm:162
rt.def("/proc/camera_sort", function camera_sort(f: Frame, L: Value) {
	let a: Value = null, b: Value = null, j: Value = null;
	let $e: any;
	let i: Value = rt.len(f, L);
	while (i > 0) {
		j = null;
		rt.forRange(f, 0, 1, i - 1, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			j = $e;
			a = rt.index(L, j);
			b = rt.index(L, j + 1);
			if (a.c_tag_order != b.c_tag_order) {
				if (a.c_tag_order > b.c_tag_order) {
					L.Swap(j, j + 1);
				}
			} else if (sorttext(a.c_tag, b.c_tag) < 0) {
				L.Swap(j, j + 1);
			}
		}
		rt.endFor(f, 0);
		i--;
	}
	return L;
});
