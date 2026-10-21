// From code/modules/mob/living/silicon/ai/freelook/cameranet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalcameranet  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalcameranet", function InitGlobalcameranet(f: Frame) {
	rt.setGl("cameranet", rt.new_(f, T("/datum/cameranet"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "cameranet", add);
	return f.dot;
});

rt.type(4114, "/datum/cameranet", "/datum", {
	name: "Camera Net",
	cameras: null,
	chunks: null,
	ready: 0,
	statclick: null,
});

// /datum/cameranet/proc/<init>  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:13)
rt.def("/datum/cameranet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cameras", rt.list());
	$0 = $0;
	rt.setSv(f, "chunks", rt.list());
	return f.dot;
});

// /datum/cameranet/proc/chunkGenerated  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:23)
rt.def("/datum/cameranet/proc/chunkGenerated", function chunkGenerated(f: Frame, x: Value, y: Value, z: Value) {
	let key: Value = null;
	f.vars = () => [x, y, key];
	(x = rt.modify(live(x), 16777200, rt.bitAnd));
	(y = rt.modify(live(y), 16777200, rt.bitAnd));
	key = fmt("＀,＀,＀", [live(x), live(y), live(z)]);
	return rt.index(rt.sv(f, "chunks"), live(key));
});

// /datum/cameranet/proc/getCameraChunk  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:31)
rt.def("/datum/cameranet/proc/getCameraChunk", function getCameraChunk(f: Frame, x: Value, y: Value, z: Value) {
	let key: Value = null;
	f.vars = () => [x, y, key];
	(x = rt.modify(live(x), 16777200, rt.bitAnd));
	(y = rt.modify(live(y), 16777200, rt.bitAnd));
	key = fmt("＀,＀,＀", [live(x), live(y), live(z)]);
	if (!truthy(rt.index(rt.sv(f, "chunks"), live(key)))) {
		rt.setAt(rt.sv(f, "chunks"), live(key), rt.new_(f, T("/datum/camerachunk"), [null, live(x), live(y), live(z)]));
	}
	return rt.index(rt.sv(f, "chunks"), live(key));
});

// /datum/cameranet/proc/visibility  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:43)
rt.def("/datum/cameranet/proc/visibility", function visibility(f: Frame, ai: Value) {
	let x1: Value = null, y1: Value = null, x2: Value = null, y2: Value = null, visibleChunks: Value = null, x: Value = null, y: Value = null, remove: Value = null, _add: Value = null, chunk: Value = null, c: Value = null;
	let $e: any;
	f.vars = () => [x1, y1, x2, y2, visibleChunks, x, y, remove, _add, chunk, c, $e];
	x1 = rt.bitAnd(rt.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "x", live(ai)), 16)]), 16777200);
	y1 = rt.bitAnd(rt.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "y", live(ai)), 16)]), 16777200);
	x2 = rt.bitAnd(rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxx", rt.world()), add(rt.fv(f, "x", live(ai)), 16)]), 16777200);
	y2 = rt.bitAnd(rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxy", rt.world()), add(rt.fv(f, "y", live(ai)), 16)]), 16777200);
	visibleChunks = rt.list();
	x = null;
	x = live(x1);
	while (rt.le(live(x), live(x2))) {
		y = null;
		y = live(y1);
		while (rt.le(live(y), live(y2))) {
			(visibleChunks = rt.modify(live(visibleChunks), rt.callSrc(f, "getCameraChunk", [live(x), live(y), rt.fv(f, "z", live(ai))]), rt.bitOr));
			y = rt.modify(live(y), 16, add);
		}
		x = rt.modify(live(x), 16, add);
	}
	remove = subtract(rt.fv(f, "visibleCameraChunks", live(ai)), live(visibleChunks));
	_add = subtract(live(visibleChunks), rt.fv(f, "visibleCameraChunks", live(ai)));
	chunk = null;
	rt.forList(f, 0, live(remove));
	while (($e = rt.next(f, 0)) !== undefined) {
		chunk = $e;
		rt.callName(f, (c = live(chunk)), "remove", [live(ai)]);
	}
	rt.endFor(f, 0);
	chunk = null;
	rt.forList(f, 0, live(_add));
	while (($e = rt.next(f, 0)) !== undefined) {
		chunk = $e;
		rt.callName(f, (c = live(chunk)), "add", [live(ai)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/cameranet/proc/updateVisibility  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:69)
rt.def("/datum/cameranet/proc/updateVisibility", function updateVisibility(f: Frame, A: Value, opacity_check: Value) {
	f.vars = () => [opacity_check];
	if (live(opacity_check) === null) {
		opacity_check = 1;
	}
	if ((!truthy(rt.gl("SSticker")) || (truthy(live(opacity_check)) && !truthy(rt.fv(f, "opacity", live(A)))))) {
		return live(f.dot);
	}
	rt.callSrc(f, "majorChunkChange", [live(A), 2]);
	return f.dot;
});

// /datum/cameranet/proc/updateChunk  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:75)
rt.def("/datum/cameranet/proc/updateChunk", function updateChunk(f: Frame, x: Value, y: Value, z: Value) {
	let chunk: Value = null;
	f.vars = () => [chunk];
	if (!truthy(rt.callSrc(f, "chunkGenerated", [live(x), live(y), live(z)]))) {
		return live(f.dot);
	}
	rt.callName(f, (chunk = rt.callSrc(f, "getCameraChunk", [live(x), live(y), live(z)])), "hasChanged", []);
	return f.dot;
});

// /datum/cameranet/proc/removeCamera  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:83)
rt.def("/datum/cameranet/proc/removeCamera", function removeCamera(f: Frame, c: Value) {
	if (!truthy(rt.callName(f, live(c), "can_use", []))) return f.dot;
	rt.callSrc(f, "majorChunkChange", [live(c), 0]);
	return f.dot;
});

// /datum/cameranet/proc/addCamera  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:89)
rt.def("/datum/cameranet/proc/addCamera", function addCamera(f: Frame, c: Value) {
	if (!truthy(rt.callName(f, live(c), "can_use", []))) return f.dot;
	rt.callSrc(f, "majorChunkChange", [live(c), 1]);
	return f.dot;
});

// /datum/cameranet/proc/updatePortableCamera  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:95)
rt.def("/datum/cameranet/proc/updatePortableCamera", function updatePortableCamera(f: Frame, c: Value) {
	if (!truthy(rt.callName(f, live(c), "can_use", []))) return f.dot;
	rt.callSrc(f, "majorChunkChange", [live(c), 1]);
	return f.dot;
});

// /datum/cameranet/proc/majorChunkChange  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:108)
rt.def("/datum/cameranet/proc/majorChunkChange", function majorChunkChange(f: Frame, c: Value, choice: Value) {
	let _T: Value = null, x1: Value = null, y1: Value = null, x2: Value = null, y2: Value = null, x: Value = null, y: Value = null, chunk: Value = null;
	f.vars = () => [_T, x1, y1, x2, y2, x, y, chunk];
	if (!truthy(live(c))) {
		return live(f.dot);
	}
	if (!truthy((_T = rt.getStep(f, live(c), 0)))) return f.dot;
	x1 = rt.bitAnd(rt.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "x", live(_T)), 8)]), 16777200);
	y1 = rt.bitAnd(rt.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "y", live(_T)), 8)]), 16777200);
	x2 = rt.bitAnd(rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxx", rt.world()), add(rt.fv(f, "x", live(_T)), 8)]), 16777200);
	y2 = rt.bitAnd(rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxy", rt.world()), add(rt.fv(f, "y", live(_T)), 8)]), 16777200);
	x = null;
	x = live(x1);
	while (rt.le(live(x), live(x2))) {
		y = null;
		y = live(y1);
		while (rt.le(live(y), live(y2))) {
			if (truthy(rt.callSrc(f, "chunkGenerated", [live(x), live(y), rt.fv(f, "z", live(_T))]))) {
				chunk = rt.callSrc(f, "getCameraChunk", [live(x), live(y), rt.fv(f, "z", live(_T))]);
				if (isEqual(live(choice), 0)) {
					(rt.modField(f, live(chunk), "cameras", live(c), subtract));
				} else {
					if (isEqual(live(choice), 1)) {
						(rt.modField(f, live(chunk), "cameras", live(c), rt.bitOr));
					}
				}
				rt.callName(f, live(chunk), "hasChanged", []);
			}
			y = rt.modify(live(y), 16, add);
		}
		x = rt.modify(live(x), 16, add);
	}
	return f.dot;
});

// /datum/cameranet/proc/checkCameraVis  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:137)
rt.def("/datum/cameranet/proc/checkCameraVis", function checkCameraVis(f: Frame, target: Value) {
	let position: Value = null;
	f.vars = () => [position];
	return rt.callSrc(f, "checkTurfVis", [(position = rt.getStep(f, live(target), 0))]);
});

// /datum/cameranet/proc/checkTurfVis  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:142)
rt.def("/datum/cameranet/proc/checkTurfVis", function checkTurfVis(f: Frame, position: Value) {
	let chunk: Value = null;
	f.vars = () => [chunk];
	if (truthy((chunk = rt.callSrc(f, "getCameraChunk", [rt.fv(f, "x", live(position)), rt.fv(f, "y", live(position)), rt.fv(f, "z", live(position))])))) {
		if (truthy(rt.fv(f, "changed", live(chunk)))) {
			rt.callName(f, live(chunk), "hasChanged", [1]);
		}
		if (truthy(rt.index(rt.fv(f, "visibleTurfs", live(chunk)), live(position)))) {
			return 1;
		}
	}
	return 0;
});

// /datum/cameranet/proc/stat_entry  (code/modules/mob/living/silicon/ai/freelook/cameranet.dm:151)  may sleep
rt.def("/datum/cameranet/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!truthy(rt.sv(f, "statclick"))) {
		rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/debug"), [null, "Initializing...", live(f.src)])));
	}
	yield* g.call(f, P("/proc/stat"), null, [rt.sv(f, "name"), (yield* g.callName(f, rt.sv(f, "statclick"), "update", [fmt("Cameras: ＀ | Chunks: ＀", [rt.getLen(f, rt.fv(f, "cameras", rt.gl("cameranet"))), rt.getLen(f, rt.fv(f, "chunks", rt.gl("cameranet")))])]))]);
	return f.dot;
}, true);
