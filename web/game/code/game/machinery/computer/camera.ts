// From code/game/machinery/computer/camera.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/security/proc/<init>  (code/game/machinery/computer/camera.dm:8)
rt.def("/obj/machinery/computer/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "network", rt.list("SS13"));
	$0 = $0;
	rt.setSv(f, "watchers", rt.list());
	return f.dot;
});

// /obj/machinery/computer/security/proc/check_eye  (code/game/machinery/computer/camera.dm:15)  may sleep
rt.def("/obj/machinery/computer/security/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	let C: Value = null, viewing: Value = null;
	f.vars = () => [user, C, viewing];
	if (((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || truthy(rt.fv(f, "eye_blind", live(user))))) {
		yield* g.callName(f, live(user), "unset_machine", []);
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(user), rt.sv(f, "watchers")) ? 1 : 0))) {
		yield* g.callName(f, live(user), "unset_machine", []);
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.sv(f, "watchers"), live(user)))) {
		yield* g.callName(f, live(user), "unset_machine", []);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, (C = rt.index(rt.sv(f, "watchers"), live(user))), "can_use", [])))) {
		yield* g.callName(f, live(user), "unset_machine", []);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
			yield* g.callName(f, live(user), "unset_machine", []);
			return live(f.dot);
		}
	} else {
		if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
		if (truthy((yield* g.callName(f, (viewing = (yield* g.call(f, P("/proc/viewers"), null, [live(f.src)]))), "Find", [live(user)])))) return f.dot;
		yield* g.callName(f, live(user), "unset_machine", []);
	}
	return f.dot;
}, true);

// /obj/machinery/computer/security/proc/on_unset_machine  (code/game/machinery/computer/camera.dm:38)  may sleep
rt.def("/obj/machinery/computer/security/proc/on_unset_machine", function* on_unset_machine(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "watchers"), "Remove", [live(user)]);
	yield* g.callName(f, live(user), "reset_perspective", [null]);
	return f.dot;
}, true);

// /obj/machinery/computer/security/proc/Destroy  (code/game/machinery/computer/camera.dm:42)  may sleep
rt.def("/obj/machinery/computer/security/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (truthy(rt.len(f, rt.sv(f, "watchers")))) {
		M = null;
		rt.forList(f, 0, rt.sv(f, "watchers"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "unset_machine", []);
		}
		rt.endFor(f, 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/security/proc/attack_hand  (code/game/machinery/computer/camera.dm:50)  may sleep
rt.def("/obj/machinery/computer/security/proc/attack_hand", function* attack_hand(f: Frame) {
	let camera_list: Value = null, Num: Value = null, CAM: Value = null;
	let $e: any;
	f.vars = () => [camera_list, Num, CAM, $e];
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "network"))) {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["No camera network", "code/game/machinery/computer/camera.dm", 51])));
		yield* g.callName(f, live(f.args[0]), "unset_machine", []);
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.sv(f, "network"), T("/list")) ? 1 : 0))) {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Camera network is not a list", "code/game/machinery/computer/camera.dm", 55])));
		yield* g.callName(f, live(f.args[0]), "unset_machine", []);
		return live(f.dot);
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		yield* g.callName(f, live(f.args[0]), "unset_machine", []);
		return live(f.dot);
	}
	camera_list = (yield* g.srcCall(f, "get_available_cameras"));
	if (!truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "watchers")) ? 1 : 0))) {
		Num = null;
		rt.forList(f, 0, live(camera_list));
		while (($e = rt.next(f, 0)) !== undefined) {
			Num = $e;
			if (truthy((rt.istype((CAM = rt.index(live(camera_list), live(Num))), T("/obj/machinery/camera")) ? 1 : 0))) {
				if (truthy((yield* g.callName(f, live(CAM), "can_use", [])))) {
					rt.setAt(rt.sv(f, "watchers"), live(f.args[0]), live(CAM));
					break;
				}
			}
		}
		rt.endFor(f, 0);
		if (!truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "watchers")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[0]), "unset_machine", []);
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 25, 0]);
	yield* g.srcCall(f, "use_camera_console", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/security/proc/use_camera_console  (code/game/machinery/computer/camera.dm:77)  may sleep
rt.def("/obj/machinery/computer/security/proc/use_camera_console", function* use_camera_console(f: Frame, user: Value) {
	let camera_list: Value = null, t: Value = null, C: Value = null, camera_fail: Value = null, viewing: Value = null, A: Value = null;
	f.vars = () => [user, camera_list, t, C, camera_fail, viewing, A];
	camera_list = (yield* g.srcCall(f, "get_available_cameras"));
	t = (yield* g.op(f, "Prompt", [1], [null, null, "Which camera should you change to?", live(user), live(camera_list)]));
	if (!isEqual(rt.fv(f, "machine", live(user)), live(f.src))) {
		return live(f.dot);
	}
	if (!truthy(live(t))) {
		yield* g.callName(f, live(user), "unset_machine", []);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_off.ogg"), 25, 0]);
		return live(f.dot);
	}
	C = rt.index(live(camera_list), live(t));
	if (isEqual(live(t), "Cancel")) {
		yield* g.callName(f, live(user), "unset_machine", []);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_off.ogg"), 25, 0]);
		return live(f.dot);
	}
	if (truthy(live(C))) {
		camera_fail = 0;
		if ((((!truthy((yield* g.callName(f, live(C), "can_use", []))) || !isEqual(rt.fv(f, "machine", live(user)), live(f.src))) || truthy(rt.fv(f, "eye_blind", live(user)))) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
			camera_fail = 1;
		} else {
			if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (viewing = (yield* g.call(f, P("/proc/viewers"), null, [live(f.src)]))), "Find", [live(user)])))) {
					camera_fail = 1;
				}
			} else {
				if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
					if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
						camera_fail = 1;
					}
				}
			}
		}
		if (truthy(live(camera_fail))) {
			yield* g.callName(f, live(user), "unset_machine", []);
			return 0;
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 25, 0]);
		if (truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			yield* g.callName(f, rt.gv(f, "eyeobj", (A = live(user))), "setLoc", [rt.getStep(f, live(C), 0)]);
			rt.setFv(f, "eye", rt.fv(f, "client", live(A)), rt.fv(f, "eyeobj", live(A)));
		} else {
			yield* g.callName(f, live(user), "reset_perspective", [live(C)]);
			yield* g.callName(f, live(user), "overlay_fullscreen", ["flash", T("/obj/screen/fullscreen/flash/static")]);
			yield* g.callName(f, live(user), "clear_fullscreen", ["flash", 5]);
		}
		rt.setAt(rt.sv(f, "watchers"), live(user), live(C));
		yield* g.srcCall(f, "use_power", 50);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/computer/security/proc/use_camera_console"), live(user)])), 5]);
	} else {
		yield* g.callName(f, live(user), "unset_machine", []);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/machinery/computer/security/proc/get_available_cameras  (code/game/machinery/computer/camera.dm:125)
rt.def("/obj/machinery/computer/security/proc/get_available_cameras", function get_available_cameras(f: Frame) {
	let L: Value = null, C: Value = null, D: Value = null, C_2: Value = null, tempnetwork: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [L, C, D, C_2, tempnetwork, $0, $1, $2, $e];
	L = rt.list();
	C = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (((rt.gt(rt.sv(f, "z"), 12) || rt.gt(rt.fv(f, "z", live(C)), 12)) && !isEqual(rt.fv(f, "z", live(C)), rt.sv(f, "z")))) {
			continue;
		}
		rt.callName(f, live(L), "Add", [live(C)]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/camera_sort"), null, [live(L)]);
	rt.setAt((D = rt.list()), "Cancel", "Cancel");
	C_2 = null;
	rt.forList(f, 0, live(L), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C_2 = $e;
		if (!truthy(rt.fv(f, "network", live(C_2)))) {
			rt.call(f, P("/proc/stack_trace"), null, ["Camera in a cameranet has no camera network"]);
			continue;
		}
		if (!truthy((rt.istype(rt.fv(f, "network", live(C_2)), T("/list")) ? 1 : 0))) {
			rt.call(f, P("/proc/stack_trace"), null, ["Camera in a cameranet has a non-list camera network"]);
			continue;
		}
		if (truthy(rt.getLen(f, (tempnetwork = rt.bitAnd(rt.fv(f, "network", live(C_2)), rt.sv(f, "network")))))) {
			$0 = live(D);
			$1 = rt.fv(f, "c_tag", live(C_2));
			if (truthy(rt.fv(f, "status", live(C_2)))) {
				$2 = null;
			} else {
				$2 = " (Deactivated)";
			}
			rt.setAt($0, fmt("＀＀", [$1, $2]), live(C_2));
		}
	}
	rt.endFor(f, 0);
	return live(D);
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

// /obj/machinery/computer/security/telescreen/proc/<init>  (code/game/machinery/computer/camera.dm:152)
rt.def("/obj/machinery/computer/security/telescreen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "network", rt.list("thunder"));
	return f.dot;
});

// /obj/machinery/computer/security/telescreen/proc/update_icon  (code/game/machinery/computer/camera.dm:160)
rt.def("/obj/machinery/computer/security/telescreen/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.modSrcVar(f, "icon_state", "b", add);
	}
	return live(f.dot);
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

// /obj/machinery/computer/security/telescreen/entertainment/proc/<init>  (code/game/machinery/computer/camera.dm:170)
rt.def("/obj/machinery/computer/security/telescreen/entertainment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "network", rt.list("thunder"));
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

// /obj/machinery/computer/security/mining/proc/<init>  (code/game/machinery/computer/camera.dm:188)
rt.def("/obj/machinery/computer/security/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "network", rt.list("MINE"));
	return f.dot;
});
