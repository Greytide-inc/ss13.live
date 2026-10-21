// From code/modules/mob/living/silicon/ai/freelook/eye.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5101, "/mob/camera/aiEye", "/mob/camera", {
	visibleCameraChunks: null,
	ai: null,
	relay_speech: 0,
	use_static: 1,
	name: "Inactive AI Eye",
	invisibility: 100,
});

// /mob/camera/aiEye/proc/<init>  (code/modules/mob/living/silicon/ai/freelook/eye.dm:10)
rt.def("/mob/camera/aiEye/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "visibleCameraChunks", rt.list());
	return f.dot;
});

// /mob/camera/aiEye/proc/setLoc  (code/modules/mob/living/silicon/ai/freelook/eye.dm:21)  may sleep
rt.def("/mob/camera/aiEye/proc/setLoc", function* setLoc(f: Frame, _T: Value) {
	let H: Value = null;
	f.vars = () => [_T, H];
	if (!truthy(rt.sv(f, "ai"))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "ai"))])))) {
		return live(f.dot);
	}
	rt.setSv(f, "loc", (_T = rt.getStep(f, live(_T), 0)));
	if (truthy(rt.sv(f, "use_static"))) {
		yield* g.callName(f, rt.gl("cameranet"), "visibility", [live(f.src)]);
	}
	if (truthy(rt.fv(f, "client", rt.sv(f, "ai")))) {
		rt.setFv(f, "eye", rt.fv(f, "client", rt.sv(f, "ai")), live(f.src));
	}
	yield* g.srcCall(f, "update_parallax_contents");
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "ai")), T("/obj/machinery/holopad")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (H = rt.fv(f, "current", rt.sv(f, "ai"))), "move_hologram", [rt.sv(f, "ai"), live(_T)]);
	return f.dot;
}, true);

// /mob/camera/aiEye/proc/GetViewerClient  (code/modules/mob/living/silicon/ai/freelook/eye.dm:40)
rt.def("/mob/camera/aiEye/proc/GetViewerClient", function GetViewerClient(f: Frame) {
	if (truthy(rt.sv(f, "ai"))) {
		return rt.fv(f, "client", rt.sv(f, "ai"));
	}
	return null;
});

// /mob/camera/aiEye/proc/RemoveImages  (code/modules/mob/living/silicon/ai/freelook/eye.dm:45)
rt.def("/mob/camera/aiEye/proc/RemoveImages", function RemoveImages(f: Frame) {
	let chunk: Value = null;
	let $e: any;
	f.vars = () => [chunk, $e];
	if (!truthy(rt.sv(f, "use_static"))) return f.dot;
	chunk = null;
	rt.forList(f, 0, rt.sv(f, "visibleCameraChunks"), T("/datum/camerachunk"));
	while (($e = rt.next(f, 0)) !== undefined) {
		chunk = $e;
		rt.callName(f, live(chunk), "remove", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/camera/aiEye/proc/Destroy  (code/modules/mob/living/silicon/ai/freelook/eye.dm:50)  may sleep
rt.def("/mob/camera/aiEye/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "ai", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /atom/proc/move_camera_by_click  (code/modules/mob/living/silicon/ai/freelook/eye.dm:53)  may sleep
rt.def("/atom/proc/move_camera_by_click", function* move_camera_by_click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.gv(f, "eyeobj", (AI = live(f.usr)))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(AI))), rt.fv(f, "eyeobj", live(AI))))) return f.dot;
	rt.setFv(f, "cameraFollow", live(AI), null);
	if (!(truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))) || truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.src)]))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "eyeobj", live(AI)), "setLoc", [live(f.src)]);
	return f.dot;
}, true);

// /client/proc/AIMove  (code/modules/mob/living/silicon/ai/freelook/eye.dm:65)  may sleep
rt.def("/client/proc/AIMove", function* AIMove(f: Frame, n: Value, direct: Value, user: Value) {
	let initial: Value = null, max_sprint: Value = null, i: Value = null, step: Value = null;
	f.vars = () => [n, direct, user, initial, max_sprint, i, step];
	initial = rt.initial(f, live(user), "sprint");
	max_sprint = 50;
	if ((truthy(rt.fv(f, "cooldown", live(user))) && rt.lt(rt.fv(f, "cooldown", live(user)), rt.fv(f, "timeofday", rt.world())))) {
		rt.setFv(f, "sprint", live(user), live(initial));
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "sprint", live(user)), live(initial)])))) {
		if (truthy((step = rt.getStep(f, rt.getStep(f, rt.fv(f, "eyeobj", live(user)), live(direct)), 0)))) {
			yield* g.callName(f, rt.fv(f, "eyeobj", live(user)), "setLoc", [live(step)]);
		}
		i = rt.modify(live(i), 20, add);
	}
	rt.setFv(f, "cooldown", live(user), add(rt.fv(f, "timeofday", rt.world()), 5));
	if (truthy(rt.fv(f, "acceleration", live(user)))) {
		rt.setFv(f, "sprint", live(user), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "sprint", live(user)), 0.5), live(max_sprint)])));
	} else {
		rt.setFv(f, "sprint", live(user), live(initial));
	}
	if (!truthy(rt.fv(f, "tracking", live(user)))) {
		rt.setFv(f, "cameraFollow", live(user), null);
	}
	if (!truthy(rt.fv(f, "camera_light_on", live(user)))) return f.dot;
	yield* g.callName(f, live(user), "light_cameras", []);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/view_core  (code/modules/mob/living/silicon/ai/freelook/eye.dm:95)  may sleep
rt.def("/mob/living/silicon/ai/proc/view_core", function* view_core(f: Frame) {
	rt.setSv(f, "current", null);
	rt.setSv(f, "cameraFollow", null);
	yield* g.srcCall(f, "unset_machine");
	if (((!truthy(rt.sv(f, "eyeobj")) || !truthy(rt.fv(f, "loc", rt.sv(f, "eyeobj")))) || (!truthy(rt.sv(f, "eyeobj")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "eyeobj")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "ERROR: Eyeobj not found. Creating new eye..."]);
		rt.setSv(f, "eyeobj", (yield* g.new_(f, T("/mob/camera/aiEye"), [rt.sv(f, "loc")])));
		rt.setFv(f, "ai", rt.sv(f, "eyeobj"), live(f.src));
		rt.setFv(f, "name", rt.sv(f, "eyeobj"), fmt("＀ (AI Eye)", [rt.fv(f, "name", live(f.src))]));
	}
	yield* g.callName(f, rt.sv(f, "eyeobj"), "setLoc", [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/verb/toggle_acceleration  (code/modules/mob/living/silicon/ai/freelook/eye.dm:109)
rt.def("/mob/living/silicon/ai/verb/toggle_acceleration", function toggle_acceleration(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "acceleration", (!truthy(rt.sv(f, "acceleration")) ? 1 : 0));
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "acceleration"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("Camera acceleration has been toggled ＀.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle Camera Acceleration", category: "AI Commands" } });

// /mob/camera/aiEye/proc/Hear  (code/modules/mob/living/silicon/ai/freelook/eye.dm:115)  may sleep
rt.def("/mob/camera/aiEye/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode];
	if (!(((((truthy(rt.sv(f, "relay_speech")) && truthy(live(speaker))) && truthy(rt.sv(f, "ai"))) && !truthy(live(radio_freq))) && !isEqual(live(speaker), rt.sv(f, "ai"))) && truthy((yield* g.call(f, P("/proc/near_camera"), null, [live(speaker)]))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "ai"), "relay_speech", [live(message), live(speaker), live(message_language), live(raw_message), live(radio_freq), live(spans), live(message_mode)]);
	return f.dot;
}, true);
