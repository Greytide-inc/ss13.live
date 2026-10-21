// From code/modules/mining/aux_base_camera.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5104, "/mob/camera/aiEye/remote/base_construction", "/mob/camera/aiEye/remote", {
	starting_area: null,
	name: "construction holo-drone",
	move_on_shuttle: 1,
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "construction_drone",
});

// /mob/camera/aiEye/remote/base_construction/proc/Initialize  (code/modules/mining/aux_base_camera.dm:10)  may sleep
rt.def("/mob/camera/aiEye/remote/base_construction/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "starting_area", (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")])));
	return f.dot;
}, true);

// /mob/camera/aiEye/remote/base_construction/proc/setLoc  (code/modules/mining/aux_base_camera.dm:14)
rt.def("/mob/camera/aiEye/remote/base_construction/proc/setLoc", function setLoc(f: Frame) {
	let curr_area: Value = null;
	f.vars = () => [curr_area];
	if (!(isEqual((curr_area = rt.call(f, P("/proc/get_area"), null, [live(f.args[0])])), rt.sv(f, "starting_area")) || truthy((rt.istype(live(curr_area), T("/area/shuttle/auxillary_base")) ? 1 : 0)))) return f.dot;
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["t"] });

// /mob/camera/aiEye/remote/base_construction/proc/relaymove  (code/modules/mining/aux_base_camera.dm:20)  may sleep
rt.def("/mob/camera/aiEye/remote/base_construction/proc/relaymove", function* relaymove(f: Frame) {
	rt.setSv(f, "dir", live(f.args[1]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "direct"] });

rt.type(10352, "/obj/machinery/computer/camera_advanced/base_construction", "/obj/machinery/computer/camera_advanced", {
	RCD: null,
	switch_mode_action: null,
	build_action: null,
	airlock_mode_action: null,
	window_action: null,
	fan_action: null,
	fans_remaining: 0,
	turret_action: null,
	turret_stock: 0,
	found_aux_console: null,
	networks: null,
	off_action: null,
	jump_action: null,
	light_color: "#E17DE1",
	name: "base contruction console",
	desc: "An industrial computer integrated with a camera-assisted rapid construction drone.",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/base_construction"),
	icon_screen: "mining",
	icon_keyboard: "rd_key",
});

// /obj/machinery/computer/camera_advanced/base_construction/proc/<init>  (code/modules/mining/aux_base_camera.dm:32)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "networks", rt.list("SS13"));
	$0 = $0;
	rt.setSv(f, "off_action", (yield* g.new_(f, T("/datum/action/innate/camera_off/base_construction"), [])));
	rt.setSv(f, "jump_action", null);
	$0 = $0;
	rt.setSv(f, "switch_mode_action", (yield* g.new_(f, T("/datum/action/innate/aux_base/switch_mode"), [])));
	$0 = $0;
	rt.setSv(f, "build_action", (yield* g.new_(f, T("/datum/action/innate/aux_base/build"), [])));
	$0 = $0;
	rt.setSv(f, "airlock_mode_action", (yield* g.new_(f, T("/datum/action/innate/aux_base/airlock_type"), [])));
	$0 = $0;
	rt.setSv(f, "window_action", (yield* g.new_(f, T("/datum/action/innate/aux_base/window_type"), [])));
	$0 = $0;
	rt.setSv(f, "fan_action", (yield* g.new_(f, T("/datum/action/innate/aux_base/place_fan"), [])));
	$0 = $0;
	rt.setSv(f, "turret_action", (yield* g.new_(f, T("/datum/action/innate/aux_base/install_turret"), [])));
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/base_construction/proc/New  (code/modules/mining/aux_base_camera.dm:53)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "RCD", (yield* g.new_(f, T("/obj/item/weapon/construction/rcd/internal"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/base_construction/proc/Initialize  (code/modules/mining/aux_base_camera.dm:57)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.setFv(f, "matter", rt.sv(f, "RCD"), rt.fv(f, "max_matter", rt.sv(f, "RCD")));
	rt.setSv(f, "fans_remaining", 4);
	rt.setSv(f, "turret_stock", 4);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/computer/camera_advanced/base_construction/proc/CreateEye  (code/modules/mining/aux_base_camera.dm:66)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/CreateEye", function* CreateEye(f: Frame) {
	let spawn_spot: Value = null, ABC: Value = null;
	let $e: any;
	f.vars = () => [spawn_spot, ABC, $e];
	spawn_spot = null;
	ABC = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/auxillary_base"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ABC = $e;
		if (truthy((rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(ABC)])), T("/area/shuttle/auxillary_base")) ? 1 : 0))) {
			rt.setSv(f, "found_aux_console", live(ABC));
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "found_aux_console"))) {
		spawn_spot = rt.sv(f, "found_aux_console");
	} else {
		spawn_spot = live(f.src);
	}
	rt.setSv(f, "eyeobj", (yield* g.new_(f, T("/mob/camera/aiEye/remote/base_construction"), [rt.getStep(f, live(spawn_spot), 0)])));
	rt.setFv(f, "origin", rt.sv(f, "eyeobj"), live(f.src));
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/base_construction/proc/attackby  (code/modules/mining/aux_base_camera.dm:82)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/rcd_ammo")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "RCD"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/computer/camera_advanced/base_construction/proc/Destroy  (code/modules/mining/aux_base_camera.dm:88)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "RCD")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/camera_advanced/base_construction/proc/GrantActions  (code/modules/mining/aux_base_camera.dm:92)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/GrantActions", function* GrantActions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "switch_mode_action"))) {
		rt.setFv(f, "target", rt.sv(f, "switch_mode_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "switch_mode_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "switch_mode_action"), add);
	}
	if (truthy(rt.sv(f, "build_action"))) {
		rt.setFv(f, "target", rt.sv(f, "build_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "build_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "build_action"), add);
	}
	if (truthy(rt.sv(f, "airlock_mode_action"))) {
		rt.setFv(f, "target", rt.sv(f, "airlock_mode_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "airlock_mode_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "airlock_mode_action"), add);
	}
	if (truthy(rt.sv(f, "window_action"))) {
		rt.setFv(f, "target", rt.sv(f, "window_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "window_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "window_action"), add);
	}
	if (truthy(rt.sv(f, "fan_action"))) {
		rt.setFv(f, "target", rt.sv(f, "fan_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "fan_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "fan_action"), add);
	}
	if (truthy(rt.sv(f, "turret_action"))) {
		rt.setFv(f, "target", rt.sv(f, "turret_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "turret_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "turret_action"), add);
	}
	rt.setFv(f, "invisibility", rt.sv(f, "eyeobj"), 0);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/camera_advanced/base_construction/proc/remove_eye_control  (code/modules/mining/aux_base_camera.dm:127)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/remove_eye_control", function* remove_eye_control(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "invisibility", rt.sv(f, "eyeobj"), 100);
	return f.dot;
}, true, { args: ["user"] });

rt.type(138, "/datum/action/innate/aux_base", "/datum/action/innate", {
	C: null,
	remote_eye: null,
	B: null,
});

// /datum/action/innate/aux_base/proc/Activate  (code/modules/mining/aux_base_camera.dm:136)  may sleep
rt.def("/datum/action/innate/aux_base/proc/Activate", function* Activate(f: Frame) {
	if (!truthy(rt.sv(f, "target"))) {
		return 1;
	}
	rt.setSv(f, "C", rt.sv(f, "owner"));
	rt.setSv(f, "remote_eye", rt.fv(f, "remote_control", rt.sv(f, "C")));
	rt.setSv(f, "B", rt.sv(f, "target"));
	if (truthy(rt.fv(f, "RCD", rt.sv(f, "B")))) return f.dot;
	rt.setFv(f, "RCD", rt.sv(f, "B"), (yield* g.new_(f, T("/obj/item/weapon/construction/rcd/internal"), [live(f.src)])));
	return f.dot;
}, true);

// /datum/action/innate/aux_base/proc/check_spot  (code/modules/mining/aux_base_camera.dm:146)
rt.def("/datum/action/innate/aux_base/proc/check_spot", function check_spot(f: Frame) {
	let build_target: Value = null, build_area: Value = null;
	f.vars = () => [build_target, build_area];
	build_target = rt.getStep(f, rt.sv(f, "remote_eye"), 0);
	if (!truthy((rt.istype((build_area = rt.call(f, P("/proc/get_area"), null, [live(build_target)])), T("/area/shuttle/auxillary_base")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can only build within the mining base!</span>"]);
		return 0;
	}
	if (!isEqual(rt.fv(f, "z", live(build_target)), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>The mining base has launched and can no longer be modified.</span>"]);
		return 0;
	}
	return 1;
});

rt.type(139, "/datum/action/innate/aux_base/build", "/datum/action/innate/aux_base", {
	name: "Build",
	button_icon_state: "build",
});

// /datum/action/innate/aux_base/build/proc/Activate  (code/modules/mining/aux_base_camera.dm:170)  may sleep
rt.def("/datum/action/innate/aux_base/build/proc/Activate", function* Activate(f: Frame) {
	let rcd_target: Value = null, target_turf: Value = null;
	f.vars = () => [rcd_target, target_turf];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_spot")))) {
		return live(f.dot);
	}
	rcd_target = null;
	target_turf = rt.getStep(f, rt.sv(f, "remote_eye"), 0);
	if (!truthy((rcd_target = rt.locateIn(f, T("/obj/machinery/door/airlock"), live(target_turf))))) {
		rcd_target = rt.locateIn(f, T("/obj/structure"), live(target_turf));
	}
	if ((!truthy(live(rcd_target)) || !truthy(rt.fv(f, "anchored", live(rcd_target))))) {
		rcd_target = live(target_turf);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "changeNext_move", [4]);
	yield* g.callName(f, rt.fv(f, "RCD", rt.sv(f, "B")), "afterattack", [live(rcd_target), rt.sv(f, "owner"), 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(target_turf), rt.rsc("sound/items/deconstruct.ogg"), 60, 1]);
	return f.dot;
}, true);

rt.type(140, "/datum/action/innate/aux_base/switch_mode", "/datum/action/innate/aux_base", {
	name: "Switch Mode",
	button_icon_state: "builder_mode",
});

// /datum/action/innate/aux_base/switch_mode/proc/Activate  (code/modules/mining/aux_base_camera.dm:198)  may sleep
rt.def("/datum/action/innate/aux_base/switch_mode/proc/Activate", function* Activate(f: Frame) {
	let buildlist: Value = null, buildmode: Value = null;
	f.vars = () => [buildlist, buildmode];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	buildlist = rt.alist(f, ["Walls and Floors", 1, "Airlocks", 2, "Deconstruction", 3, "Windows and Grilles", 4]);
	buildmode = (yield* g.op(f, "Prompt", [0], [null, null, "Base Console", "Set construction mode.", live(buildlist)]));
	rt.setFv(f, "mode", rt.fv(f, "RCD", rt.sv(f, "B")), rt.index(live(buildlist), live(buildmode)));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("Build mode is now ＀.", [live(buildmode)])]);
	return f.dot;
}, true);

rt.type(141, "/datum/action/innate/aux_base/airlock_type", "/datum/action/innate/aux_base", {
	name: "Select Airlock Type",
	button_icon_state: "airlock_select",
});

// /datum/action/innate/aux_base/airlock_type/proc/Activate  (code/modules/mining/aux_base_camera.dm:211)  may sleep
rt.def("/datum/action/innate/aux_base/airlock_type/proc/Activate", function* Activate(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "RCD", rt.sv(f, "B")), "change_airlock_setting", []);
	return f.dot;
}, true);

rt.type(142, "/datum/action/innate/aux_base/window_type", "/datum/action/innate/aux_base", {
	name: "Select Window Type",
	button_icon_state: "window_select",
});

// /datum/action/innate/aux_base/window_type/proc/Activate  (code/modules/mining/aux_base_camera.dm:222)  may sleep
rt.def("/datum/action/innate/aux_base/window_type/proc/Activate", function* Activate(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "RCD", rt.sv(f, "B")), "toggle_window_type", []);
	return f.dot;
}, true);

rt.type(143, "/datum/action/innate/aux_base/place_fan", "/datum/action/innate/aux_base", {
	name: "Place Tiny Fan",
	button_icon_state: "build_fan",
});

// /datum/action/innate/aux_base/place_fan/proc/Activate  (code/modules/mining/aux_base_camera.dm:231)  may sleep
rt.def("/datum/action/innate/aux_base/place_fan/proc/Activate", function* Activate(f: Frame) {
	let fan_turf: Value = null;
	f.vars = () => [fan_turf];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	fan_turf = rt.getStep(f, rt.sv(f, "remote_eye"), 0);
	if (!truthy(rt.fv(f, "fans_remaining", rt.sv(f, "B")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>＀ is out of fans!</span>", [rt.sv(f, "B")])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_spot")))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "density", live(fan_turf)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Fans may only be placed on a floor.</span>"]);
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/structure/fans/tiny"), [live(fan_turf)]);
	rt.incField(f, rt.sv(f, "B"), "fans_remaining", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>Tiny fan placed. ＀ remaining.</span>", [rt.fv(f, "fans_remaining", rt.sv(f, "B"))])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(fan_turf), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	return f.dot;
}, true);

rt.type(144, "/datum/action/innate/aux_base/install_turret", "/datum/action/innate/aux_base", {
	name: "Install Plasma Anti-Wildlife Turret",
	button_icon_state: "build_turret",
});

// /datum/action/innate/aux_base/install_turret/proc/Activate  (code/modules/mining/aux_base_camera.dm:257)  may sleep
rt.def("/datum/action/innate/aux_base/install_turret/proc/Activate", function* Activate(f: Frame) {
	let turret_turf: Value = null, _T: Value = null;
	f.vars = () => [turret_turf, _T];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_spot")))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "turret_stock", rt.sv(f, "B")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Unable to construct additional turrets.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(turret_turf = rt.getStep(f, rt.sv(f, "remote_eye"), 0))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Location is obtructed by something. Please clear the location and try again.</span>"]);
		return live(f.dot);
	}
	_T = (yield* g.new_(f, T("/obj/machinery/porta_turret/aux_base"), [live(turret_turf)]));
	if (truthy(rt.fv(f, "found_aux_console", rt.sv(f, "B")))) {
		rt.modField(f, rt.fv(f, "found_aux_console", rt.sv(f, "B")), "turrets", live(_T), add);
	}
	rt.incField(f, rt.sv(f, "B"), "turret_stock", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Turret installation complete!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(turret_turf), rt.rsc("sound/items/drill_use.ogg"), 65, 1]);
	return f.dot;
}, true);
