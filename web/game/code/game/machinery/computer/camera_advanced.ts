// From code/game/machinery/computer/camera_advanced.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/camera_advanced/proc/<init>  (code/game/machinery/computer/camera_advanced.dm:9)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "networks", rt.list("SS13"));
	$0 = $0;
	rt.setSv(f, "off_action", (yield* g.new_(f, T("/datum/action/innate/camera_off"), [])));
	$0 = $0;
	rt.setSv(f, "jump_action", (yield* g.new_(f, T("/datum/action/innate/camera_jump"), [])));
	$0 = $0;
	rt.setSv(f, "actions", rt.list());
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/proc/CreateEye  (code/game/machinery/computer/camera_advanced.dm:17)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/CreateEye", function* CreateEye(f: Frame) {
	rt.setSv(f, "eyeobj", (yield* g.new_(f, T("/mob/camera/aiEye/remote"), [])));
	rt.setFv(f, "origin", rt.sv(f, "eyeobj"), live(f.src));
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/proc/GrantActions  (code/game/machinery/computer/camera_advanced.dm:23)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/GrantActions", function* GrantActions(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "off_action"))) {
		rt.setFv(f, "target", rt.sv(f, "off_action"), live(user));
		yield* g.callName(f, rt.sv(f, "off_action"), "Grant", [live(user)]);
		rt.modSrcVar(f, "actions", rt.sv(f, "off_action"), add);
	}
	if (!truthy(rt.sv(f, "jump_action"))) return f.dot;
	rt.setFv(f, "target", rt.sv(f, "jump_action"), live(user));
	yield* g.callName(f, rt.sv(f, "jump_action"), "Grant", [live(user)]);
	rt.modSrcVar(f, "actions", rt.sv(f, "jump_action"), add);
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/proc/remove_eye_control  (code/game/machinery/computer/camera_advanced.dm:32)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/remove_eye_control", function* remove_eye_control(f: Frame, user: Value) {
	let V: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, V, A, $e];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	V = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		yield* g.callName(f, (A = live(V)), "Remove", [live(user)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "client", live(user)))) {
		yield* g.callName(f, live(user), "reset_perspective", [null]);
		yield* g.callName(f, rt.sv(f, "eyeobj"), "RemoveImages", []);
	}
	rt.setFv(f, "eye_user", rt.sv(f, "eyeobj"), null);
	rt.setFv(f, "remote_control", live(user), null);
	rt.setSv(f, "current_user", null);
	yield* g.callName(f, live(user), "unset_machine", []);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_off.ogg"), 25, 0]);
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/proc/check_eye  (code/game/machinery/computer/camera_advanced.dm:48)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || (!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) && !truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(user))))) || truthy(rt.fv(f, "eye_blind", live(user)))) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) return f.dot;
	yield* g.callName(f, live(user), "unset_machine", []);
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/proc/Destroy  (code/game/machinery/computer/camera_advanced.dm:53)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "current_user"))) {
		yield* g.callName(f, rt.sv(f, "current_user"), "unset_machine", []);
	}
	if (truthy(rt.sv(f, "eyeobj"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "eyeobj")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/camera_advanced/proc/on_unset_machine  (code/game/machinery/computer/camera_advanced.dm:59)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/on_unset_machine", function* on_unset_machine(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!isEqual(live(M), rt.sv(f, "current_user"))) return f.dot;
	yield* g.srcCall(f, "remove_eye_control", live(M));
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/proc/attack_hand  (code/game/machinery/computer/camera_advanced.dm:64)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/attack_hand", function* attack_hand(f: Frame) {
	let L: Value = null, camera_location: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [L, camera_location, C, $e];
	if (truthy(rt.sv(f, "current_user"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The console is already in use!"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	L = live(f.args[0]);
	if (!truthy(rt.sv(f, "eyeobj"))) {
		yield* g.srcCall(f, "CreateEye");
	}
	if (!truthy(rt.fv(f, "eye_initialized", rt.sv(f, "eyeobj")))) {
		camera_location = null;
		C = null;
		rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((!truthy((yield* g.callName(f, live(C), "can_use", []))) || (truthy(rt.sv(f, "z_lock")) && !isEqual(rt.fv(f, "z", live(C)), rt.sv(f, "z_lock"))))) {
				continue;
			}
			if (truthy(rt.bitAnd(rt.fv(f, "network", live(C)), rt.sv(f, "networks")))) {
				camera_location = rt.getStep(f, live(C), 0);
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(camera_location))) {
			rt.setFv(f, "eye_initialized", rt.sv(f, "eyeobj"), 1);
			yield* g.srcCall(f, "give_eye_control", live(L));
			yield* g.callName(f, rt.sv(f, "eyeobj"), "setLoc", [live(camera_location)]);
		} else {
			yield* g.callName(f, live(f.args[0]), "unset_machine", []);
		}
	} else {
		yield* g.srcCall(f, "give_eye_control", live(L));
		yield* g.callName(f, rt.sv(f, "eyeobj"), "setLoc", [rt.fv(f, "loc", rt.sv(f, "eyeobj"))]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/camera_advanced/proc/attack_robot  (code/game/machinery/computer/camera_advanced.dm:92)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/computer/camera_advanced/proc/give_eye_control  (code/game/machinery/computer/camera_advanced.dm:99)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/proc/give_eye_control", function* give_eye_control(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "GrantActions", live(user));
	rt.setSv(f, "current_user", live(user));
	rt.setFv(f, "eye_user", rt.sv(f, "eyeobj"), live(user));
	rt.setFv(f, "name", rt.sv(f, "eyeobj"), fmt("Camera Eye (＀)", [rt.fv(f, "name", live(user))]));
	rt.setFv(f, "remote_control", live(user), rt.sv(f, "eyeobj"));
	yield* g.callName(f, live(user), "reset_perspective", [rt.sv(f, "eyeobj")]);
	yield* g.callName(f, rt.sv(f, "eyeobj"), "setLoc", [rt.fv(f, "loc", rt.sv(f, "eyeobj"))]);
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

// /mob/camera/aiEye/remote/proc/update_remote_sight  (code/game/machinery/computer/camera_advanced.dm:119)
rt.def("/mob/camera/aiEye/remote/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	rt.setFv(f, "see_invisible", live(user), 25);
	rt.setFv(f, "sight", live(user), 0);
	rt.setFv(f, "see_in_dark", live(user), 2);
	return 1;
});

// /mob/camera/aiEye/remote/proc/RemoveImages  (code/game/machinery/computer/camera_advanced.dm:125)
rt.def("/mob/camera/aiEye/remote/proc/RemoveImages", function RemoveImages(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "visible_icon"))) return f.dot;
	if (!truthy((C = rt.callSrc(f, "GetViewerClient", [])))) return f.dot;
	(rt.modField(f, live(C), "images", rt.sv(f, "user_image"), subtract));
	return f.dot;
});

// /mob/camera/aiEye/remote/proc/Destroy  (code/game/machinery/computer/camera_advanced.dm:134)  may sleep
rt.def("/mob/camera/aiEye/remote/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "eye_user", null);
	rt.setSv(f, "origin", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/camera/aiEye/remote/proc/GetViewerClient  (code/game/machinery/computer/camera_advanced.dm:138)
rt.def("/mob/camera/aiEye/remote/proc/GetViewerClient", function GetViewerClient(f: Frame) {
	if (truthy(rt.sv(f, "eye_user"))) {
		return rt.fv(f, "client", rt.sv(f, "eye_user"));
	}
	return null;
});

// /mob/camera/aiEye/remote/proc/setLoc  (code/game/machinery/computer/camera_advanced.dm:143)
rt.def("/mob/camera/aiEye/remote/proc/setLoc", function setLoc(f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (!truthy(rt.sv(f, "eye_user"))) return f.dot;
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "eye_user"))]))) {
		return live(f.dot);
	}
	rt.setSv(f, "loc", (_T = rt.getStep(f, live(_T), 0)));
	if (truthy(rt.sv(f, "use_static"))) {
		rt.callName(f, rt.gl("cameranet"), "visibility", [live(f.src)]);
	}
	if (!truthy(rt.sv(f, "visible_icon"))) return f.dot;
	if (!truthy(rt.fv(f, "client", rt.sv(f, "eye_user")))) return f.dot;
	(rt.modField(f, rt.fv(f, "client", rt.sv(f, "eye_user")), "images", rt.sv(f, "user_image"), subtract));
	rt.setSv(f, "user_image", rt.call(f, P("/proc/image"), null, [rt.sv(f, "icon"), rt.sv(f, "loc"), rt.sv(f, "icon_state"), 5]));
	rt.modField(f, rt.fv(f, "client", rt.sv(f, "eye_user")), "images", rt.sv(f, "user_image"), add);
	return f.dot;
});

// /mob/camera/aiEye/remote/proc/relaymove  (code/game/machinery/computer/camera_advanced.dm:156)  may sleep
rt.def("/mob/camera/aiEye/remote/proc/relaymove", function* relaymove(f: Frame, user: Value, direct: Value) {
	let initial: Value = null, max_sprint: Value = null, i: Value = null, step: Value = null;
	f.vars = () => [user, direct, initial, max_sprint, i, step];
	initial = rt.initial(f, live(f.src), "sprint");
	max_sprint = 50;
	if ((truthy(rt.sv(f, "cooldown")) && rt.lt(rt.sv(f, "cooldown"), rt.fv(f, "timeofday", rt.world())))) {
		rt.setSv(f, "sprint", live(initial));
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "sprint"), live(initial)])))) {
		if (truthy((step = rt.getStep(f, rt.getStep(f, live(f.src), live(direct)), 0)))) {
			yield* g.srcCall(f, "setLoc", live(step));
		}
		i = rt.modify(live(i), 20, add);
	}
	rt.setSv(f, "cooldown", add(rt.fv(f, "timeofday", rt.world()), 5));
	if (truthy(rt.sv(f, "acceleration"))) {
		rt.setSv(f, "sprint", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "sprint"), 0.5), live(max_sprint)])));
	} else {
		rt.setSv(f, "sprint", live(initial));
	}
	return f.dot;
}, true);

rt.type(120, "/datum/action/innate/camera_off", "/datum/action/innate", {
	name: "End Camera View",
	button_icon_state: "camera_off",
});

// /datum/action/innate/camera_off/proc/Activate  (code/game/machinery/computer/camera_advanced.dm:178)  may sleep
rt.def("/datum/action/innate/camera_off/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, console: Value = null;
	f.vars = () => [C, remote_eye, console];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "target");
	remote_eye = rt.fv(f, "remote_control", live(C));
	yield* g.callName(f, (console = rt.fv(f, "origin", live(remote_eye))), "remove_eye_control", [rt.sv(f, "target")]);
	return f.dot;
}, true);

rt.type(122, "/datum/action/innate/camera_jump", "/datum/action/innate", {
	name: "Jump To Camera",
	button_icon_state: "camera_jump",
});

// /datum/action/innate/camera_jump/proc/Activate  (code/game/machinery/computer/camera_advanced.dm:190)  may sleep
rt.def("/datum/action/innate/camera_jump/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, origin: Value = null, L: Value = null, cam: Value = null, _T: Value = null, netcam: Value = null, tempnetwork: Value = null, camera: Value = null, final: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [C, remote_eye, origin, L, cam, _T, netcam, tempnetwork, camera, final, $0, $1, $2, $e];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "target");
	remote_eye = rt.fv(f, "remote_control", live(C));
	origin = rt.fv(f, "origin", live(remote_eye));
	L = rt.list();
	cam = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cam = $e;
		if ((truthy(rt.fv(f, "z_lock", live(origin))) && !isEqual(rt.fv(f, "z", live(cam)), rt.fv(f, "z_lock", live(origin))))) {
			continue;
		}
		yield* g.callName(f, live(L), "Add", [live(cam)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/camera_sort"), null, [live(L)]);
	_T = rt.list();
	netcam = null;
	rt.forList(f, 0, live(L), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		netcam = $e;
		if (truthy(rt.getLen(f, (tempnetwork = rt.bitAnd(rt.fv(f, "network", live(netcam)), rt.fv(f, "networks", live(origin))))))) {
			$0 = live(_T);
			$1 = rt.fv(f, "c_tag", live(netcam));
			if (truthy((yield* g.callName(f, live(netcam), "can_use", [])))) {
				$2 = null;
			} else {
				$2 = " (Deactivated)";
			}
			rt.setAt($0, fmt("＀＀", [$1, $2]), live(netcam));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [live(origin), rt.rsc("sound/machines/terminal_prompt.ogg"), 25, 0]);
	camera = (yield* g.op(f, "Prompt", [1], [null, null, "Cameras", "Choose which camera you want to view", live(_T)]));
	final = rt.index(live(_T), live(camera));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 25, 0]);
	if (truthy(live(final))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(origin), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 25, 0]);
		yield* g.callName(f, live(remote_eye), "setLoc", [rt.getStep(f, live(final), 0)]);
		yield* g.callName(f, live(C), "overlay_fullscreen", ["flash", T("/obj/screen/fullscreen/flash/static")]);
		yield* g.callName(f, live(C), "clear_fullscreen", ["flash", 3]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(origin), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 25, 0]);
	}
	return f.dot;
}, true);
