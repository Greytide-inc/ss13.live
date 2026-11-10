// Based on /tg/station's code/game/machinery/computer/camera_advanced.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10350, "/obj/machinery/computer/camera_advanced", "/obj/machinery/computer", {
	z_lock: null,
	eyeobj: null,
	current_user: null,
	networks: null,
	off_action: null,
	jump_action: null,
	actions: null,
	light_color: "#FA8282",
	name: "advanced camera console",
	desc: "Used to access the various cameras on the station.",
	icon_screen: "cameras",
	icon_keyboard: "security_key",
});

// camera_advanced.dm:9
rt.def("/obj/machinery/computer/camera_advanced/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.networks = list("SS13");

	this.off_action = (yield* new_(T("/datum/action/innate/camera_off")));

	this.jump_action = (yield* new_(T("/datum/action/innate/camera_jump")));

	this.actions = list();
	return f.dot;
}, true);

// camera_advanced.dm:17
rt.def("/obj/machinery/computer/camera_advanced/proc/CreateEye", function* CreateEye(f: Frame) {
	this.eyeobj = (yield* new_(T("/mob/camera/aiEye/remote")));
	this.eyeobj.origin = this;
	return f.dot;
}, true);

// camera_advanced.dm:23
rt.def("/obj/machinery/computer/camera_advanced/proc/GrantActions", function* GrantActions(f: Frame, user: Value) {
	if (this.off_action) {
		this.off_action.target = user;
		yield* this.off_action.Grant(user);
		this.actions += this.off_action;
	}
	if (!this.jump_action) return f.dot;
	this.jump_action.target = user;
	yield* this.jump_action.Grant(user);
	this.actions += this.jump_action;
	return f.dot;
}, true);

// camera_advanced.dm:32
rt.def("/obj/machinery/computer/camera_advanced/proc/remove_eye_control", function* remove_eye_control(f: Frame, user: Value) {
	let V: Value = null, A: Value = null;
	if (!user) {
		return f.dot;
	}
	for (V of each(this.actions)) {
		yield* (A = V).Remove(user);
	}
	if (user.client) {
		yield* user.reset_perspective(null);
		this.eyeobj.RemoveImages();
	}
	this.eyeobj.eye_user = null;
	user.remote_control = null;
	this.current_user = null;
	yield* user.unset_machine();
	playsound(this, rt.rsc("sound/machines/terminal_off.ogg"), 25, 0);
	return f.dot;
}, true);

// camera_advanced.dm:48
rt.def("/obj/machinery/computer/camera_advanced/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	if (!(rt.bitAnd(this.stat, 3) || !this.Adjacent(user) && !user.has_unlimited_silicon_privilege || user.eye_blind || user.incapacitated())) return f.dot;
	yield* user.unset_machine();
	return f.dot;
}, true);

// camera_advanced.dm:53
rt.def("/obj/machinery/computer/camera_advanced/proc/Destroy", function* Destroy(f: Frame) {
	if (this.current_user) {
		yield* this.current_user.unset_machine();
	}
	if (this.eyeobj) {
		yield* qdel(this.eyeobj);
	}
	return (yield* parent_proc());
}, true);

// camera_advanced.dm:59
rt.def("/obj/machinery/computer/camera_advanced/proc/on_unset_machine", function* on_unset_machine(f: Frame, M: Value) {
	if (M != this.current_user) return f.dot;
	yield* this.remove_eye_control(M);
	return f.dot;
}, true);

// camera_advanced.dm:64
rt.def("/obj/machinery/computer/camera_advanced/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let camera_location: Value = null, C: Value = null;
	if (this.current_user) {
		to_chat(user, "The console is already in use!");
		return f.dot;
	}
	if (yield* parent_proc()) {
		return f.dot;
	}
	let L: Value = user;
	if (!this.eyeobj) {
		yield* this.CreateEye();
	}
	if (!this.eyeobj.eye_initialized) {
		for (C of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
			if (!C.can_use() || this.z_lock && C.z != this.z_lock) {
				continue;
			}
			if (rt.bitAnd(C.network, this.networks)) {
				camera_location = rt.getStep(f, C, 0);
				break;
			}
		}
		if (camera_location) {
			this.eyeobj.eye_initialized = 1;
			yield* this.give_eye_control(L);
			yield* this.eyeobj.setLoc(camera_location);
		} else {
			yield* user.unset_machine();
		}
	} else {
		yield* this.give_eye_control(L);
		yield* this.eyeobj.setLoc(this.eyeobj.loc);
	}
	return f.dot;
}, true);

// camera_advanced.dm:92
rt.def("/obj/machinery/computer/camera_advanced/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// camera_advanced.dm:99
rt.def("/obj/machinery/computer/camera_advanced/proc/give_eye_control", function* give_eye_control(f: Frame, user: Value) {
	yield* this.GrantActions(user);
	this.current_user = user;
	this.eyeobj.eye_user = user;
	this.eyeobj.name = `Camera Eye (${user.name})`;
	user.remote_control = this.eyeobj;
	yield* user.reset_perspective(this.eyeobj);
	yield* this.eyeobj.setLoc(this.eyeobj.loc);
	return f.dot;
}, true);

rt.type(5102, "/mob/camera/aiEye/remote", "/mob/camera/aiEye", {
	sprint: 10,
	cooldown: 0,
	acceleration: 1,
	eye_user: null,
	origin: null,
	eye_initialized: 0,
	visible_icon: 0,
	user_image: null,
	name: "Inactive Camera Eye",
});

// camera_advanced.dm:119
rt.def("/mob/camera/aiEye/remote/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	user.see_invisible = 25;
	user.sight = 0;
	user.see_in_dark = 2;
	return 1;
});

// camera_advanced.dm:125
rt.def("/mob/camera/aiEye/remote/proc/RemoveImages", function RemoveImages(f: Frame) {
	let C: Value = null;
	parent_proc();
	if (!this.visible_icon) return f.dot;
	if (!(C = this.GetViewerClient())) return f.dot;
	C.images -= this.user_image;
	return f.dot;
});

// camera_advanced.dm:134
rt.def("/mob/camera/aiEye/remote/proc/Destroy", function* Destroy(f: Frame) {
	this.eye_user = null;
	this.origin = null;
	return (yield* parent_proc());
}, true);

// camera_advanced.dm:138
rt.def("/mob/camera/aiEye/remote/proc/GetViewerClient", function GetViewerClient(f: Frame) {
	if (this.eye_user) {
		return this.eye_user.client;
	}
	return null;
});

// camera_advanced.dm:143
rt.def("/mob/camera/aiEye/remote/proc/setLoc", function setLoc(f: Frame, _T: Value) {
	if (!this.eye_user) return f.dot;
	if (!isturf(this.eye_user.loc)) {
		return f.dot;
	}
	this.loc = (_T = rt.getStep(f, _T, 0));
	if (this.use_static) {
		GLOB.cameranet.visibility(this);
	}
	if (!this.visible_icon) return f.dot;
	if (!this.eye_user.client) return f.dot;
	this.eye_user.client.images -= this.user_image;
	this.user_image = image(this.icon, this.loc, this.icon_state, 5);
	this.eye_user.client.images += this.user_image;
	return f.dot;
});

// camera_advanced.dm:156
rt.def("/mob/camera/aiEye/remote/proc/relaymove", function* relaymove(f: Frame, user: Value, direct: Value) {
	let step: Value = null;
	let initial: Value = rt.initial(f, this, "sprint");
	let max_sprint: Value = 50;
	if (this.cooldown && this.cooldown < rt.world().timeofday) {
		this.sprint = initial;
	}
	let i: Value = 0;
	while (i < max(this.sprint, initial)) {
		if (step = rt.getStep(f, rt.getStep(f, this, direct), 0)) {
			yield* this.setLoc(step);
		}
		i += 20;
	}
	this.cooldown = rt.world().timeofday + 5;
	if (this.acceleration) {
		this.sprint = min(this.sprint + 0.5, max_sprint);
	} else {
		this.sprint = initial;
	}
	return f.dot;
}, true);

rt.type(120, "/datum/action/innate/camera_off", "/datum/action/innate", {
	name: "End Camera View",
	button_icon_state: "camera_off",
});

// camera_advanced.dm:178
rt.def("/datum/action/innate/camera_off/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	if (!this.target || !rt.istype(this.target, T("/mob/living"))) {
		return f.dot;
	}
	let C: Value = this.target;
	let remote_eye: Value = C.remote_control;
	yield* (console = remote_eye.origin).remove_eye_control(this.target);
	return f.dot;
}, true);

rt.type(122, "/datum/action/innate/camera_jump", "/datum/action/innate", {
	name: "Jump To Camera",
	button_icon_state: "camera_jump",
});

// camera_advanced.dm:190
rt.def("/datum/action/innate/camera_jump/proc/Activate", function* Activate(f: Frame) {
	let cam: Value = null, netcam: Value = null, tempnetwork: Value = null;
	let $e: any;
	if (!this.target || !rt.istype(this.target, T("/mob/living"))) {
		return f.dot;
	}
	let C: Value = this.target;
	let remote_eye: Value = C.remote_control;
	let origin: Value = remote_eye.origin;
	let L: Value = list();
	for (cam of each(GLOB.cameranet.cameras, T("/obj/machinery/camera"))) {
		if (origin.z_lock && cam.z != origin.z_lock) {
			continue;
		}
		L.Add(cam);
	}
	camera_sort(L);
	let _T: Value = list();
	for (netcam of each(L, T("/obj/machinery/camera"))) {
		if (rt.len(f, (tempnetwork = rt.bitAnd(netcam.network, origin.networks)))) {
			rt.setAt(_T, `${netcam.c_tag}${netcam.can_use() ? null : " (Deactivated)"}`, netcam);
		}
	}
	playsound(origin, rt.rsc("sound/machines/terminal_prompt.ogg"), 25, 0);
	let camera: Value = (yield* g.op(f, "Prompt", [1], [null, null, "Cameras", "Choose which camera you want to view", _T]));
	let final: Value = rt.index(_T, camera);
	playsound(this, "terminal_type", 25, 0);
	if (final) {
		playsound(origin, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 25, 0);
		yield* remote_eye.setLoc(rt.getStep(f, final, 0));
		yield* C.overlay_fullscreen("flash", T("/obj/screen/fullscreen/flash/static"));
		yield* C.clear_fullscreen("flash", 3);
	} else {
		playsound(origin, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 25, 0);
	}
	return f.dot;
}, true);
