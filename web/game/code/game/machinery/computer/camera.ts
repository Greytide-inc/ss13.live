// Based on /tg/station's code/game/machinery/computer/camera.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(10355, "/obj/machinery/computer/security", "/obj/machinery/computer", {
	last_pic: 1,
	network: null,
	mapping: 0,
	watchers: null,
	light_color: "#FA8282",
	name: "security camera console",
	desc: "Used to access the various cameras on the station.",
	icon_screen: "cameras",
	icon_keyboard: "security_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/security"),
});

// camera.dm:8
rt.def("/obj/machinery/computer/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.network = list("SS13");

	this.watchers = list();
	return f.dot;
});

// camera.dm:15
rt.def("/obj/machinery/computer/security/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	let C: Value = null, viewing: Value = null;
	if (rt.bitAnd(this.stat, 3) || user.incapacitated() || user.eye_blind) {
		yield* user.unset_machine();
		return f.dot;
	}
	if (!rt.isIn(f, user, this.watchers)) {
		yield* user.unset_machine();
		return f.dot;
	}
	if (!rt.index(this.watchers, user)) {
		yield* user.unset_machine();
		return f.dot;
	}
	if (!(C = rt.index(this.watchers, user)).can_use()) {
		yield* user.unset_machine();
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/silicon"))) {
		if (!this.Adjacent(user)) {
			yield* user.unset_machine();
			return f.dot;
		}
	} else {
		if (!rt.istype(user, T("/mob/living/silicon/robot"))) return f.dot;
		if ((viewing = viewers(this)).Find(user)) return f.dot;
		yield* user.unset_machine();
	}
	return f.dot;
}, true);

// camera.dm:38
rt.def("/obj/machinery/computer/security/proc/on_unset_machine", function* on_unset_machine(f: Frame, user: Value) {
	yield* this.watchers.Remove(user);
	yield* user.reset_perspective(null);
	return f.dot;
}, true);

// camera.dm:42
rt.def("/obj/machinery/computer/security/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	if (rt.len(f, this.watchers)) {
		for (M of each(this.watchers, T("/mob"))) {
			yield* M.unset_machine();
		}
	}
	return (yield* parent_proc());
}, true);

// camera.dm:50
rt.def("/obj/machinery/computer/security/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let Num: Value = null, CAM: Value = null;
	if (this.stat) {
		return f.dot;
	}
	if (!this.network) {
		rt.throw_(f, (yield* new_(T("/exception"), "No camera network", "code/game/machinery/computer/camera.dm", 51)));
		yield* user.unset_machine();
		return f.dot;
	}
	if (!rt.istype(this.network, T("/list"))) {
		rt.throw_(f, (yield* new_(T("/exception"), "Camera network is not a list", "code/game/machinery/computer/camera.dm", 55)));
		yield* user.unset_machine();
		return f.dot;
	}
	if (yield* parent_proc()) {
		yield* user.unset_machine();
		return f.dot;
	}
	let camera_list: Value = this.get_available_cameras();
	if (!rt.isIn(f, user, this.watchers)) {
		for (Num of each(camera_list)) {
			if (rt.istype((CAM = rt.index(camera_list, Num)), T("/obj/machinery/camera"))) {
				if (CAM.can_use()) {
					rt.setAt(this.watchers, user, CAM);
					break;
				}
			}
		}
		if (!rt.isIn(f, user, this.watchers)) {
			yield* user.unset_machine();
			return f.dot;
		}
	}
	playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 25, 0);
	yield* this.use_camera_console(user);
	return f.dot;
}, true);

// camera.dm:77
rt.def("/obj/machinery/computer/security/proc/use_camera_console", function* use_camera_console(f: Frame, user: Value) {
	let camera_fail: Value = null, viewing: Value = null, A: Value = null;
	let camera_list: Value = this.get_available_cameras();
	let t: Value = (yield* g.op(f, "Prompt", [1], [null, null, "Which camera should you change to?", user, camera_list]));
	if (user.machine != this) {
		return f.dot;
	}
	if (!t) {
		yield* user.unset_machine();
		playsound(this, rt.rsc("sound/machines/terminal_off.ogg"), 25, 0);
		return f.dot;
	}
	let C: Value = rt.index(camera_list, t);
	if (t == "Cancel") {
		yield* user.unset_machine();
		playsound(this, rt.rsc("sound/machines/terminal_off.ogg"), 25, 0);
		return f.dot;
	}
	if (C) {
		camera_fail = 0;
		if (!C.can_use() || user.machine != this || user.eye_blind || user.incapacitated()) {
			camera_fail = 1;
		} else if (rt.istype(user, T("/mob/living/silicon/robot"))) {
			if (!(viewing = viewers(this)).Find(user)) {
				camera_fail = 1;
			}
		} else if (!rt.istype(user, T("/mob/living/silicon"))) {
			if (!this.Adjacent(user)) {
				camera_fail = 1;
			}
		}
		if (camera_fail) {
			yield* user.unset_machine();
			return 0;
		}
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 25, 0);
		if (rt.istype(user, T("/mob/living/silicon/ai"))) {
			yield* (A = user).eyeobj.setLoc(rt.getStep(f, C, 0));
			A.client.eye = A.eyeobj;
		} else {
			yield* user.reset_perspective(C);
			yield* user.overlay_fullscreen("flash", T("/obj/screen/fullscreen/flash/static"));
			yield* user.clear_fullscreen("flash", 5);
		}
		rt.setAt(this.watchers, user, C);
		yield* this.use_power(50);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/computer/security/proc/use_camera_console"), user)), 5);
	} else {
		yield* user.unset_machine();
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// camera.dm:125
rt.def("/obj/machinery/computer/security/proc/get_available_cameras", function get_available_cameras(f: Frame) {
	let C: Value = null, D: Value = null, C_2: Value = null, tempnetwork: Value = null;
	let $e: any;
	let L: Value = list();
	for (C of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
		if ((this.z > ZLEVEL_SPACEMAX || C.z > ZLEVEL_SPACEMAX) && C.z != this.z) {
			continue;
		}
		L.Add(C);
	}
	camera_sort(L);
	rt.setAt((D = list()), "Cancel", "Cancel");
	for (C_2 of each(L, T("/obj/machinery/camera"))) {
		if (!C_2.network) {
			stack_trace("Camera in a cameranet has no camera network");
			continue;
		}
		if (!rt.istype(C_2.network, T("/list"))) {
			stack_trace("Camera in a cameranet has a non-list camera network");
			continue;
		}
		if (rt.len(f, (tempnetwork = rt.bitAnd(C_2.network, this.network)))) {
			rt.setAt(D, `${C_2.c_tag}${C_2.status ? null : " (Deactivated)"}`, C_2);
		}
	}
	return D;
});

rt.type(10356, "/obj/machinery/computer/security/telescreen", "/obj/machinery/computer/security", {
	network: null,
	light_power: 0,
	name: "１Telescreen",
	desc: "Used for watching an empty arena.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "telescreen",
	density: 0,
	circuit: null,
	clockwork: 1,
});

// camera.dm:152
rt.def("/obj/machinery/computer/security/telescreen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.network = list("thunder");
	return f.dot;
});

// camera.dm:160
rt.def("/obj/machinery/computer/security/telescreen/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = rt.initial(f, this, "icon_state");
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state += "b";
	}
	return f.dot;
});

rt.type(10357, "/obj/machinery/computer/security/telescreen/entertainment", "/obj/machinery/computer/security/telescreen", {
	network: null,
	name: "entertainment monitor",
	desc: "Damn, they better have the /tg/ channel on these things.",
	icon: rt.rsc("icons/obj/status_display.dmi"),
	icon_state: "entertainment",
	density: 0,
	circuit: null,
});

// camera.dm:170
rt.def("/obj/machinery/computer/security/telescreen/entertainment/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.network = list("thunder");
	return f.dot;
});

rt.type(10359, "/obj/machinery/computer/security/mining", "/obj/machinery/computer/security", {
	network: null,
	name: "outpost camera console",
	desc: "Used to access the various cameras on the outpost.",
	icon_screen: "mining",
	icon_keyboard: "mining_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/mining"),
});

// camera.dm:188
rt.def("/obj/machinery/computer/security/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.network = list("MINE");
	return f.dot;
});
