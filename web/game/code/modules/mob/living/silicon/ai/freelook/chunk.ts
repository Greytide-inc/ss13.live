// From code/modules/mob/living/silicon/ai/freelook/chunk.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4115, "/datum/camerachunk", "/datum", {
	obscuredTurfs: null,
	visibleTurfs: null,
	obscured: null,
	cameras: null,
	turfs: null,
	seenby: null,
	visible: 0,
	changed: 0,
	updating: 0,
	x: 0,
	y: 0,
	z: 0,
});

// /datum/camerachunk/proc/<init>  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:9)
rt.def("/datum/camerachunk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "obscuredTurfs", rt.list());
	$0 = $0;
	rt.setSv(f, "visibleTurfs", rt.list());
	$0 = $0;
	rt.setSv(f, "obscured", rt.list());
	$0 = $0;
	rt.setSv(f, "cameras", rt.list());
	$0 = $0;
	rt.setSv(f, "turfs", rt.list());
	$0 = $0;
	rt.setSv(f, "seenby", rt.list());
	return f.dot;
});

// /datum/camerachunk/proc/add  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:25)
rt.def("/datum/camerachunk/proc/add", function _add(f: Frame, eye: Value) {
	let client: Value = null;
	f.vars = () => [client];
	if (truthy((client = rt.callName(f, live(eye), "GetViewerClient", [])))) {
		rt.modField(f, live(client), "images", rt.sv(f, "obscured"), add);
	}
	rt.modField(f, live(eye), "visibleCameraChunks", live(f.src), add);
	rt.incSrcVar(f, "visible", 1, true);
	rt.modSrcVar(f, "seenby", live(eye), add);
	if (!(truthy(rt.sv(f, "changed")) && !truthy(rt.sv(f, "updating")))) return f.dot;
	rt.callSrc(f, "update", []);
	return f.dot;
});

// /datum/camerachunk/proc/remove  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:37)
rt.def("/datum/camerachunk/proc/remove", function remove(f: Frame, eye: Value) {
	let client: Value = null;
	f.vars = () => [client];
	if (truthy((client = rt.callName(f, live(eye), "GetViewerClient", [])))) {
		(rt.modField(f, live(client), "images", rt.sv(f, "obscured"), subtract));
	}
	(rt.modField(f, live(eye), "visibleCameraChunks", live(f.src), subtract));
	(rt.modSrcVar(f, "seenby", live(eye), subtract));
	if (!rt.gt(rt.sv(f, "visible"), 0)) return f.dot;
	rt.incSrcVar(f, "visible", -1, true);
	return f.dot;
});

// /datum/camerachunk/proc/visibilityChanged  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:48)
rt.def("/datum/camerachunk/proc/visibilityChanged", function visibilityChanged(f: Frame, loc: Value) {
	if (!truthy(rt.index(rt.sv(f, "visibleTurfs"), live(loc)))) {
		return live(f.dot);
	}
	rt.callSrc(f, "hasChanged", []);
	return f.dot;
});

// /datum/camerachunk/proc/hasChanged  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:56)
rt.def("/datum/camerachunk/proc/hasChanged", function hasChanged(f: Frame, update_now: Value) {
	f.vars = () => [update_now];
	if (live(update_now) === null) {
		update_now = 0;
	}
	if ((truthy(rt.sv(f, "visible")) || truthy(live(update_now)))) {
		if (!truthy(rt.sv(f, "updating"))) {
			rt.setSv(f, "updating", 1);
			rt.spawnTail(f, 25, "/datum/camerachunk/proc/hasChanged: spawn at modules/mob/living/silicon/ai/freelook/chunk.dm:59", update_now);
		}
	} else {
		rt.setSv(f, "changed", 1);
	}
	return f.dot;
});

// a spawn(25) body of /datum/camerachunk/proc/hasChanged, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/camerachunk/proc/hasChanged: spawn at modules/mob/living/silicon/ai/freelook/chunk.dm:59", function* (f: Frame, update_now: Value) {
	f.vars = () => [update_now];
	yield* g.srcCall(f, "update");
	rt.setSv(f, "updating", 0);
	return null;
});

// /datum/camerachunk/proc/update  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:71)
rt.def("/datum/camerachunk/proc/update", function update(f: Frame) {
	let newVisibleTurfs: Value = null, camera: Value = null, c: Value = null, point: Value = null, t: Value = null, visAdded: Value = null, visRemoved: Value = null, turf: Value = null, eye: Value = null, m: Value = null, client: Value = null;
	let $e: any;
	f.vars = () => [newVisibleTurfs, camera, c, point, t, visAdded, visRemoved, turf, eye, m, client, $e];
	newVisibleTurfs = rt.list();
	camera = null;
	rt.forList(f, 0, rt.sv(f, "cameras"));
	while (($e = rt.next(f, 0)) !== undefined) {
		camera = $e;
		if (!truthy((c = live(camera)))) {
			continue;
		}
		if (!truthy(rt.callName(f, live(c), "can_use", []))) {
			continue;
		}
		if (rt.gt(rt.call(f, P("/proc/get_dist"), null, [(point = rt.locate(add(rt.fv(f, "x", live(f.src)), 8), add(rt.fv(f, "y", live(f.src)), 8), rt.fv(f, "z", live(f.src)))), live(c)]), 24)) {
			continue;
		}
		t = null;
		rt.forList(f, 1, rt.callName(f, live(c), "can_see", []), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			t = $e;
			rt.setAt(live(newVisibleTurfs), live(t), live(t));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	(newVisibleTurfs = rt.modify(live(newVisibleTurfs), rt.sv(f, "turfs"), rt.bitAnd));
	visAdded = subtract(live(newVisibleTurfs), rt.sv(f, "visibleTurfs"));
	visRemoved = subtract(rt.sv(f, "visibleTurfs"), live(newVisibleTurfs));
	rt.setSv(f, "visibleTurfs", live(newVisibleTurfs));
	rt.setSv(f, "obscuredTurfs", subtract(rt.sv(f, "turfs"), live(newVisibleTurfs)));
	turf = null;
	rt.forList(f, 0, live(visAdded));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		if (truthy(rt.gv(f, "obscured", (t = live(turf))))) {
			(rt.modSrcVar(f, "obscured", rt.fv(f, "obscured", live(t)), subtract));
			eye = null;
			rt.forList(f, 1, rt.sv(f, "seenby"));
			while (($e = rt.next(f, 1)) !== undefined) {
				eye = $e;
				if (!truthy((m = live(eye)))) {
					continue;
				}
				if (truthy((client = rt.callName(f, live(m), "GetViewerClient", [])))) {
					(rt.modField(f, live(client), "images", rt.fv(f, "obscured", live(t)), subtract));
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	turf = null;
	rt.forList(f, 0, live(visRemoved));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		t = live(turf);
		if (truthy(rt.index(rt.sv(f, "obscuredTurfs"), live(t)))) {
			if (!truthy(rt.fv(f, "obscured", live(t)))) {
				rt.setFv(f, "obscured", live(t), rt.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/cameravis.dmi"), live(t), null, 16]));
				rt.setFv(f, "plane", rt.fv(f, "obscured", live(t)), 16);
			}
			rt.modSrcVar(f, "obscured", rt.fv(f, "obscured", live(t)), add);
			eye = null;
			rt.forList(f, 1, rt.sv(f, "seenby"));
			while (($e = rt.next(f, 1)) !== undefined) {
				eye = $e;
				if (!truthy((m = live(eye)))) {
					(rt.modSrcVar(f, "seenby", live(m), subtract));
					continue;
				}
				if (truthy((client = rt.callName(f, live(m), "GetViewerClient", [])))) {
					rt.modField(f, live(client), "images", rt.fv(f, "obscured", live(t)), add);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "changed", 0);
	return f.dot;
});

// /datum/camerachunk/proc/New  (code/modules/mob/living/silicon/ai/freelook/chunk.dm:136)
rt.def("/datum/camerachunk/proc/New", function New(f: Frame, loc: Value, x: Value, y: Value, z: Value) {
	let c: Value = null, t: Value = null, camera: Value = null, c_1: Value = null, t_2: Value = null, turf: Value = null, t_1: Value = null;
	let $e: any;
	f.vars = () => [x, y, c, t, camera, c_1, t_2, turf, t_1, $e];
	(x = rt.modify(live(x), 16777200, rt.bitAnd));
	(y = rt.modify(live(y), 16777200, rt.bitAnd));
	rt.setFv(f, "x", live(f.src), live(x));
	rt.setFv(f, "y", live(f.src), live(y));
	rt.setFv(f, "z", live(f.src), live(z));
	c = null;
	rt.forList(f, 0, rt.call(f, P("/proc/urange"), null, [16, rt.locate(add(live(x), 8), add(live(y), 8), live(z))]), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if (truthy(rt.callName(f, live(c), "can_use", []))) {
			rt.modSrcVar(f, "cameras", live(c), add);
		}
	}
	rt.endFor(f, 0);
	t = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(rt.call(f, P("/proc/max"), null, [live(x), 1]), rt.call(f, P("/proc/max"), null, [live(y), 1]), live(z)), rt.locate(rt.call(f, P("/proc/min"), null, [subtract(add(live(x), 16), 1), rt.fv(f, "maxx", rt.world())]), rt.call(f, P("/proc/min"), null, [subtract(add(live(y), 16), 1), rt.fv(f, "maxy", rt.world())]), live(z))]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setAt(rt.sv(f, "turfs"), live(t), live(t));
	}
	rt.endFor(f, 0);
	camera = null;
	rt.forList(f, 0, rt.sv(f, "cameras"));
	while (($e = rt.next(f, 0)) !== undefined) {
		camera = $e;
		if (!truthy((c_1 = live(camera)))) {
			continue;
		}
		if (!truthy(rt.callName(f, live(c_1), "can_use", []))) {
			continue;
		}
		t_2 = null;
		rt.forList(f, 1, rt.callName(f, live(c_1), "can_see", []), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			t_2 = $e;
			rt.setAt(rt.sv(f, "visibleTurfs"), live(t_2), live(t_2));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "visibleTurfs", rt.sv(f, "turfs"), rt.bitAnd));
	rt.setSv(f, "obscuredTurfs", subtract(rt.sv(f, "turfs"), rt.sv(f, "visibleTurfs")));
	turf = null;
	rt.forList(f, 0, rt.sv(f, "obscuredTurfs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		if (!truthy(rt.gv(f, "obscured", (t_1 = live(turf))))) {
			rt.setFv(f, "obscured", live(t_1), rt.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/cameravis.dmi"), live(t_1), null, 16]));
			rt.setFv(f, "plane", rt.fv(f, "obscured", live(t_1)), 16);
		}
		rt.modSrcVar(f, "obscured", rt.fv(f, "obscured", live(t_1)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});
