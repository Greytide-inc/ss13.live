// From code/game/objects/items/devices/multitool.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9268, "/obj/item/device/multitool", "/obj/item/device", {
	buffer: null,
	throw_range: 7,
	throw_speed: 3,
	name: "multitool",
	desc: "Used for pulsing wires to test which to cut. Not recommended by doctors.",
	icon_state: "multitool",
	force: 5,
	w_class: 2,
	throwforce: 0,
	materials: null,
	origin_tech: "magnets=1;engineering=2",
	hitsound: rt.rsc("sound/weapons/tap.ogg"),
	toolspeed: 1,
});

// /obj/item/device/multitool/proc/<init>  (code/game/objects/items/devices/multitool.dm:20)
rt.def("/obj/item/device/multitool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 20]));
	return f.dot;
});

rt.type(9269, "/obj/item/device/multitool/ai_detect", "/obj/item/device/multitool", {
	track_cooldown: 0,
	track_delay: 10,
	detect_state: "",
	rangealert: 8,
	rangewarning: 20,
	origin_tech: "magnets=1;engineering=2;syndicate=1",
});

// /obj/item/device/multitool/ai_detect/proc/New  (code/game/objects/items/devices/multitool.dm:39)  may sleep
rt.def("/obj/item/device/multitool/ai_detect/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/multitool/ai_detect/proc/Destroy  (code/game/objects/items/devices/multitool.dm:43)  may sleep
rt.def("/obj/item/device/multitool/ai_detect/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/multitool/ai_detect/proc/process  (code/game/objects/items/devices/multitool.dm:47)
rt.def("/obj/item/device/multitool/ai_detect/proc/process", function process(f: Frame) {
	if (rt.gt(rt.sv(f, "track_cooldown"), rt.worldTime(f))) {
		return live(f.dot);
	}
	rt.setSv(f, "detect_state", "");
	rt.callSrc(f, "multitool_detect", []);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "detect_state")]));
	rt.setSv(f, "track_cooldown", add(rt.worldTime(f), rt.sv(f, "track_delay")));
	return f.dot;
}, false, { waitfor: false });

// /obj/item/device/multitool/ai_detect/proc/multitool_detect  (code/game/objects/items/devices/multitool.dm:55)
rt.def("/obj/item/device/multitool/ai_detect/proc/multitool_detect", function multitool_detect(f: Frame) {
	let our_turf: Value = null, AI: Value = null, chunk: Value = null, A: Value = null, detect_turf: Value = null;
	let $e: any;
	f.vars = () => [our_turf, AI, chunk, A, detect_turf, $e];
	our_turf = rt.getStep(f, live(f.src), 0);
	AI = null;
	rt.forList(f, 0, rt.gl("ai_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AI = $e;
		if (isEqual(rt.fv(f, "cameraFollow", live(AI)), live(f.src))) {
			rt.setSv(f, "detect_state", "_red");
			break;
		}
	}
	rt.endFor(f, 0);
	if (!(!truthy(rt.sv(f, "detect_state")) && truthy(rt.callName(f, rt.gl("cameranet"), "chunkGenerated", [rt.fv(f, "x", live(our_turf)), rt.fv(f, "y", live(our_turf)), rt.fv(f, "z", live(our_turf))])))) return f.dot;
	if (!truthy((chunk = rt.callName(f, rt.gl("cameranet"), "getCameraChunk", [rt.fv(f, "x", live(our_turf)), rt.fv(f, "y", live(our_turf)), rt.fv(f, "z", live(our_turf))])))) return f.dot;
	if (!truthy(rt.getLen(f, rt.fv(f, "seenby", live(chunk))))) return f.dot;
	A = null;
	rt.forList(f, 0, rt.fv(f, "seenby", live(chunk)), T("/mob/camera/aiEye"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		detect_turf = rt.getStep(f, live(A), 0);
		if (rt.lt(rt.call(f, P("/proc/get_dist"), null, [live(our_turf), live(detect_turf)]), rt.sv(f, "rangealert"))) {
			rt.setSv(f, "detect_state", "_red");
			break;
		}
		if (rt.lt(rt.call(f, P("/proc/get_dist"), null, [live(our_turf), live(detect_turf)]), rt.sv(f, "rangewarning"))) {
			rt.setSv(f, "detect_state", "_yellow");
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(9270, "/obj/item/device/multitool/ai_detect/admin", "/obj/item/device/multitool/ai_detect", {
	track_delay: 5,
	desc: "Used for pulsing wires to test which to cut. Not recommended by doctors. Has a strange tag that says 'Grief in Safety'",
});

// /obj/item/device/multitool/ai_detect/admin/proc/multitool_detect  (code/game/objects/items/devices/multitool.dm:79)
rt.def("/obj/item/device/multitool/ai_detect/admin/proc/multitool_detect", function multitool_detect(f: Frame) {
	let our_turf: Value = null, J: Value = null, detect_turf: Value = null;
	let $e: any;
	f.vars = () => [our_turf, J, detect_turf, $e];
	our_turf = rt.getStep(f, live(f.src), 0);
	J = null;
	rt.forList(f, 0, rt.call(f, P("/proc/urange"), null, [rt.sv(f, "rangewarning"), live(our_turf)]), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		J = $e;
		if (truthy(rt.index(rt.gl("admin_datums"), rt.fv(f, "ckey", live(J))))) {
			rt.setSv(f, "detect_state", "_yellow");
			detect_turf = rt.getStep(f, live(J), 0);
			if (rt.lt(rt.call(f, P("/proc/get_dist"), null, [live(our_turf), live(detect_turf)]), rt.sv(f, "rangealert"))) {
				rt.setSv(f, "detect_state", "_red");
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
