// From code/game/machinery/camera/tracking.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/get_camera_list  (code/game/machinery/camera/tracking.dm:3)
rt.def("/mob/living/silicon/ai/proc/get_camera_list", function get_camera_list(f: Frame) {
	let L: Value = null, C: Value = null, _T: Value = null, C_2: Value = null, tempnetwork: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [L, C, _T, C_2, tempnetwork, $0, $1, $2, $e];
	rt.callName(f, rt.fv(f, "cameras", rt.sv(f, "track")), "Cut", []);
	if (isEqual(rt.fv(f, "stat", live(f.src)), 2)) {
		return live(f.dot);
	}
	L = rt.list();
	C = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.callName(f, live(L), "Add", [live(C)]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/camera_sort"), null, [live(L)]);
	_T = rt.list();
	C_2 = null;
	rt.forList(f, 0, live(L), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C_2 = $e;
		if (truthy(rt.getLen(f, (tempnetwork = rt.bitAnd(rt.fv(f, "network", live(C_2)), rt.fv(f, "network", live(f.src))))))) {
			$0 = live(_T);
			$1 = rt.fv(f, "c_tag", live(C_2));
			if (truthy(rt.callName(f, live(C_2), "can_use", []))) {
				$2 = null;
			} else {
				$2 = " (Deactivated)";
			}
			rt.setAt($0, fmt("＀＀", [$1, $2]), live(C_2));
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "cameras", rt.sv(f, "track"), live(_T));
	return live(_T);
});

// /mob/living/silicon/ai/proc/ai_camera_list  (code/game/machinery/camera/tracking.dm:26)  may sleep
rt.def("/mob/living/silicon/ai/proc/ai_camera_list", function* ai_camera_list(f: Frame, camera: Value) {
	let C: Value = null;
	f.vars = () => [camera, C];
	if (!truthy(live(camera))) {
		return 0;
	}
	C = rt.index(rt.fv(f, "cameras", rt.sv(f, "track")), live(camera));
	yield* g.callName(f, rt.fv(f, "eyeobj", live(f.src)), "setLoc", [live(C)]);
	return live(f.dot);
}, true);

rt.type(1498, "/datum/trackable", "/datum", {
	names: null,
	namecounts: null,
	humans: null,
	others: null,
	cameras: null,
});

// /datum/trackable/proc/<init>  (code/game/machinery/camera/tracking.dm:35)
rt.def("/datum/trackable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "names", rt.list());
	$0 = $0;
	rt.setSv(f, "namecounts", rt.list());
	$0 = $0;
	rt.setSv(f, "humans", rt.list());
	$0 = $0;
	rt.setSv(f, "others", rt.list());
	$0 = $0;
	rt.setSv(f, "cameras", rt.list());
	return f.dot;
});

// /mob/living/silicon/ai/proc/trackable_mobs  (code/game/machinery/camera/tracking.dm:43)  may sleep
rt.def("/mob/living/silicon/ai/proc/trackable_mobs", function* trackable_mobs(f: Frame) {
	let M: Value = null, human: Value = null, name: Value = null, targets: Value = null;
	let $e: any;
	f.vars = () => [M, human, name, targets, $e];
	yield* g.callName(f, rt.fv(f, "names", rt.sv(f, "track")), "Cut", []);
	yield* g.callName(f, rt.fv(f, "namecounts", rt.sv(f, "track")), "Cut", []);
	yield* g.callName(f, rt.fv(f, "humans", rt.sv(f, "track")), "Cut", []);
	yield* g.callName(f, rt.fv(f, "others", rt.sv(f, "track")), "Cut", []);
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return rt.list();
	}
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy((yield* g.callName(f, live(M), "can_track", [live(f.usr)])))) {
			continue;
		}
		human = 0;
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			human = 1;
		}
		if (truthy((rt.isIn(f, (name = rt.fv(f, "name", live(M))), rt.fv(f, "names", rt.sv(f, "track"))) ? 1 : 0))) {
			rt.incAt(rt.fv(f, "namecounts", rt.sv(f, "track")), live(name), 1, true);
			name = fmt("＀ (＀)", [live(name), rt.index(rt.fv(f, "namecounts", rt.sv(f, "track")), live(name))]);
		} else {
			yield* g.callName(f, rt.fv(f, "names", rt.sv(f, "track")), "Add", [live(name)]);
			rt.setAt(rt.fv(f, "namecounts", rt.sv(f, "track")), live(name), 1);
		}
		if (truthy(live(human))) {
			rt.setAt(rt.fv(f, "humans", rt.sv(f, "track")), live(name), live(M));
		} else {
			rt.setAt(rt.fv(f, "others", rt.sv(f, "track")), live(name), live(M));
		}
	}
	rt.endFor(f, 0);
	return (targets = add((yield* g.call(f, P("/proc/sortList"), null, [rt.fv(f, "humans", rt.sv(f, "track"))])), (yield* g.call(f, P("/proc/sortList"), null, [rt.fv(f, "others", rt.sv(f, "track"))]))));
}, true);

// /mob/living/silicon/ai/verb/ai_camera_track  (code/game/machinery/camera/tracking.dm:80)
rt.def("/mob/living/silicon/ai/verb/ai_camera_track", function ai_camera_track(f: Frame, target_name: Value) {
	let target: Value = null;
	let $0: any;
	f.vars = () => [target, $0];
	if (!truthy(live(target_name))) {
		return live(f.dot);
	}
	if (rt.index(rt.fv(f, "humans", rt.sv(f, "track")), live(target_name)) === null) {
		$0 = rt.index(rt.fv(f, "others", rt.sv(f, "track")), live(target_name));
	} else {
		$0 = rt.index(rt.fv(f, "humans", rt.sv(f, "track")), live(target_name));
	}
	rt.callSrc(f, "ai_actual_track", [(target = $0)]);
	return f.dot;
}, false, { hidden: true, verb: { name: "track" }, argTypes: [{ source: "trackable_mobs" }] });

// /mob/living/silicon/ai/proc/ai_actual_track  (code/game/machinery/camera/tracking.dm:88)
rt.def("/mob/living/silicon/ai/proc/ai_actual_track", function ai_actual_track(f: Frame, target: Value) {
	let U: Value = null, cameraticks: Value = null;
	f.vars = () => [U, cameraticks];
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "cameraFollow", (U = live(f.usr)), live(target));
	rt.setFv(f, "tracking", live(U), 1);
	if ((!truthy(live(target)) || !truthy(rt.callName(f, live(target), "can_track", [live(f.usr)])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(U), "<span class='warning'>Target is not near any active cameras.</span>"]);
		rt.setFv(f, "cameraFollow", live(U), null);
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>Now tracking ＀ on camera.</span>", [rt.callName(f, live(target), "get_visible_name", [])])]);
	cameraticks = 0;
	rt.spawnTail(f, 0, "/mob/living/silicon/ai/proc/ai_actual_track: spawn at game/machinery/camera/tracking.dm:103", target, U, cameraticks);
	return f.dot;
});

// a spawn(0) body of /mob/living/silicon/ai/proc/ai_actual_track, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/ai/proc/ai_actual_track: spawn at game/machinery/camera/tracking.dm:103", function* (f: Frame, target: Value, U: Value, cameraticks: Value) {
	f.vars = () => [target, U, cameraticks];
	while (isEqual(rt.fv(f, "cameraFollow", live(U)), live(target))) {
		if (rt.fv(f, "cameraFollow", live(U)) === null) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(target), "can_track", [live(f.usr)])))) {
			rt.setFv(f, "tracking", live(U), 1);
			if (!truthy(live(cameraticks))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='warning'>Target is not near any active cameras. Attempting to reacquire...</span>"]);
			}
			cameraticks = rt.inc(live(cameraticks), 1);
			if (rt.gt(live(cameraticks), 9)) {
				rt.setFv(f, "cameraFollow", live(U), null);
				yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='warning'>Unable to reacquire, cancelling track...</span>"]);
				rt.setSv(f, "tracking", 0);
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/sleep"), null, [10]);
				continue;
			}
		} else {
			cameraticks = 0;
			rt.setFv(f, "tracking", live(U), 0);
		}
		if (truthy(rt.fv(f, "eyeobj", live(U)))) {
			yield* g.callName(f, rt.fv(f, "eyeobj", live(U)), "setLoc", [rt.getStep(f, live(target), 0)]);
		} else {
			yield* g.srcCall(f, "view_core");
			rt.setFv(f, "cameraFollow", live(U), null);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	return null;
});

// /proc/near_camera  (code/game/machinery/camera/tracking.dm:137)
rt.def("/proc/near_camera", function near_camera(f: Frame, M: Value) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(M))]))) {
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if ((!(truthy(rt.gv(f, "camera", (R = live(M)))) && truthy(rt.callName(f, rt.fv(f, "camera", live(R)), "can_use", []))) && !truthy(rt.callName(f, rt.gl("cameranet"), "checkCameraVis", [live(M)])))) {
			return 0;
		}
	} else {
		if (!truthy(rt.callName(f, rt.gl("cameranet"), "checkCameraVis", [live(M)]))) {
			return 0;
		}
	}
	return 1;
});

// /obj/machinery/camera/proc/attack_ai  (code/game/machinery/camera/tracking.dm:148)  may sleep
rt.def("/obj/machinery/camera/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.src), "can_use", [])))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "eyeobj", live(user)), "setLoc", [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/attack_ai  (code/game/machinery/camera/tracking.dm:156)  may sleep
rt.def("/mob/living/silicon/ai/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "ai_camera_list");
	return f.dot;
}, true);

// /proc/camera_sort  (code/game/machinery/camera/tracking.dm:162)
rt.def("/proc/camera_sort", function camera_sort(f: Frame, L: Value) {
	let a: Value = null, b: Value = null, i: Value = null, j: Value = null;
	let $e: any;
	f.vars = () => [a, b, i, j, $e];
	a = null;
	b = null;
	i = null;
	i = rt.len(f, live(L));
	while (rt.gt(live(i), 0)) {
		j = null;
		rt.forRange(f, 0, 1, subtract(live(i), 1), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			j = $e;
			a = rt.index(live(L), live(j));
			b = rt.index(live(L), add(live(j), 1));
			if (!isEqual(rt.fv(f, "c_tag_order", live(a)), rt.fv(f, "c_tag_order", live(b)))) {
				if (rt.gt(rt.fv(f, "c_tag_order", live(a)), rt.fv(f, "c_tag_order", live(b)))) {
					rt.callName(f, live(L), "Swap", [live(j), add(live(j), 1)]);
				}
			} else {
				if (rt.lt(rt.call(f, P("/proc/sorttext"), null, [rt.fv(f, "c_tag", live(a)), rt.fv(f, "c_tag", live(b))]), 0)) {
					rt.callName(f, live(L), "Swap", [live(j), add(live(j), 1)]);
				}
			}
		}
		rt.endFor(f, 0);
		i = rt.inc(live(i), -1);
	}
	return live(L);
});
