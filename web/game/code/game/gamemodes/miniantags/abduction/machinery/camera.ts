// From code/game/gamemodes/miniantags/abduction/machinery/camera.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10351, "/obj/machinery/computer/camera_advanced/abductor", "/obj/machinery/computer/camera_advanced", {
	team: 0,
	tele_in_action: null,
	tele_out_action: null,
	tele_self_action: null,
	vest_mode_action: null,
	vest_disguise_action: null,
	set_droppoint_action: null,
	console: null,
	name: "Human Observation Console",
	networks: null,
	z_lock: 2,
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "camera",
	resistance_flags: 99,
});

// /obj/machinery/computer/camera_advanced/abductor/proc/<init>  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:5)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "tele_in_action", (yield* g.new_(f, T("/datum/action/innate/teleport_in"), [])));
	$0 = $0;
	rt.setSv(f, "tele_out_action", (yield* g.new_(f, T("/datum/action/innate/teleport_out"), [])));
	$0 = $0;
	rt.setSv(f, "tele_self_action", (yield* g.new_(f, T("/datum/action/innate/teleport_self"), [])));
	$0 = $0;
	rt.setSv(f, "vest_mode_action", (yield* g.new_(f, T("/datum/action/innate/vest_mode_swap"), [])));
	$0 = $0;
	rt.setSv(f, "vest_disguise_action", (yield* g.new_(f, T("/datum/action/innate/vest_disguise_swap"), [])));
	$0 = $0;
	rt.setSv(f, "set_droppoint_action", (yield* g.new_(f, T("/datum/action/innate/set_droppoint"), [])));
	rt.setSv(f, "networks", rt.list("SS13", "Abductor"));
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/abductor/proc/CreateEye  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:19)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/CreateEye", function* CreateEye(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "visible_icon", rt.sv(f, "eyeobj"), 1);
	rt.setFv(f, "icon", rt.sv(f, "eyeobj"), rt.rsc("icons/obj/abductor.dmi"));
	rt.setFv(f, "icon_state", rt.sv(f, "eyeobj"), "camera_target");
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/abductor/proc/GrantActions  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:25)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/GrantActions", function* GrantActions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "tele_in_action"))) {
		rt.setFv(f, "target", rt.sv(f, "tele_in_action"), rt.fv(f, "pad", rt.sv(f, "console")));
		yield* g.callName(f, rt.sv(f, "tele_in_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "tele_in_action"), add);
	}
	if (truthy(rt.sv(f, "tele_out_action"))) {
		rt.setFv(f, "target", rt.sv(f, "tele_out_action"), rt.sv(f, "console"));
		yield* g.callName(f, rt.sv(f, "tele_out_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "tele_out_action"), add);
	}
	if (truthy(rt.sv(f, "tele_self_action"))) {
		rt.setFv(f, "target", rt.sv(f, "tele_self_action"), rt.fv(f, "pad", rt.sv(f, "console")));
		yield* g.callName(f, rt.sv(f, "tele_self_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "tele_self_action"), add);
	}
	if (truthy(rt.sv(f, "vest_mode_action"))) {
		rt.setFv(f, "target", rt.sv(f, "vest_mode_action"), rt.sv(f, "console"));
		yield* g.callName(f, rt.sv(f, "vest_mode_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "vest_mode_action"), add);
	}
	if (truthy(rt.sv(f, "vest_disguise_action"))) {
		rt.setFv(f, "target", rt.sv(f, "vest_disguise_action"), rt.sv(f, "console"));
		yield* g.callName(f, rt.sv(f, "vest_disguise_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "vest_disguise_action"), add);
	}
	if (!truthy(rt.sv(f, "set_droppoint_action"))) return f.dot;
	rt.setFv(f, "target", rt.sv(f, "set_droppoint_action"), rt.sv(f, "console"));
	yield* g.callName(f, rt.sv(f, "set_droppoint_action"), "Grant", [live(f.args[0])]);
	rt.modSrcVar(f, "actions", rt.sv(f, "set_droppoint_action"), add);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/camera_advanced/abductor/proc/IsScientist  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:58)
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/IsScientist", function IsScientist(f: Frame, H: Value) {
	let S: Value = null;
	f.vars = () => [S];
	return rt.gv(f, "scientist", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H)))));
});

// /obj/machinery/computer/camera_advanced/abductor/proc/attack_hand  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:62)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[0]), T("/datum/species/abductor")])))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

rt.type(114, "/datum/action/innate/teleport_in", "/datum/action/innate", {
	name: "Send To",
	button_icon_state: "beam_down",
});

// /datum/action/innate/teleport_in/proc/Activate  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:71)  may sleep
rt.def("/datum/action/innate/teleport_in/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, _P: Value = null;
	f.vars = () => [C, remote_eye, _P];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	_P = rt.sv(f, "target");
	if (!truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.fv(f, "loc", live(remote_eye))])))) return f.dot;
	yield* g.callName(f, live(_P), "PadToLoc", [rt.fv(f, "loc", live(remote_eye))]);
	return f.dot;
}, true);

rt.type(115, "/datum/action/innate/teleport_out", "/datum/action/innate", {
	name: "Retrieve",
	button_icon_state: "beam_up",
});

// /datum/action/innate/teleport_out/proc/Activate  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:85)  may sleep
rt.def("/datum/action/innate/teleport_out/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	f.vars = () => [console];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (console = rt.sv(f, "target")), "TeleporterRetrieve", []);
	return f.dot;
}, true);

rt.type(116, "/datum/action/innate/teleport_self", "/datum/action/innate", {
	name: "Send Self",
	button_icon_state: "beam_down",
});

// /datum/action/innate/teleport_self/proc/Activate  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:96)  may sleep
rt.def("/datum/action/innate/teleport_self/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, _P: Value = null;
	f.vars = () => [C, remote_eye, _P];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	_P = rt.sv(f, "target");
	if (!truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.fv(f, "loc", live(remote_eye))])))) return f.dot;
	yield* g.callName(f, live(_P), "MobToLoc", [rt.fv(f, "loc", live(remote_eye)), live(C)]);
	return f.dot;
}, true);

rt.type(117, "/datum/action/innate/vest_mode_swap", "/datum/action/innate", {
	name: "Switch Vest Mode",
	button_icon_state: "vest_mode",
});

// /datum/action/innate/vest_mode_swap/proc/Activate  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:110)  may sleep
rt.def("/datum/action/innate/vest_mode_swap/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	f.vars = () => [console];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (console = rt.sv(f, "target")), "FlipVest", []);
	return f.dot;
}, true);

rt.type(118, "/datum/action/innate/vest_disguise_swap", "/datum/action/innate", {
	name: "Switch Vest Disguise",
	button_icon_state: "vest_disguise",
});

// /datum/action/innate/vest_disguise_swap/proc/Activate  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:121)  may sleep
rt.def("/datum/action/innate/vest_disguise_swap/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	f.vars = () => [console];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (console = rt.sv(f, "target")), "SelectDisguise", ["remote", 1], rt.Args.Named);
	return f.dot;
}, true);

rt.type(119, "/datum/action/innate/set_droppoint", "/datum/action/innate", {
	name: "Set Experiment Release Point",
	button_icon_state: "set_drop",
});

// /datum/action/innate/set_droppoint/proc/Activate  (code/game/gamemodes/miniantags/abduction/machinery/camera.dm:131)
rt.def("/datum/action/innate/set_droppoint/proc/Activate", function Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, console: Value = null;
	f.vars = () => [C, remote_eye, console];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	rt.callName(f, (console = rt.sv(f, "target")), "SetDroppoint", [rt.fv(f, "loc", live(remote_eye)), rt.sv(f, "owner")]);
	return f.dot;
});
