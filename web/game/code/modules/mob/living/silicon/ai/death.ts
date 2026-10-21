// From code/modules/mob/living/silicon/ai/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/death  (code/modules/mob/living/silicon/ai/death.dm:2)  may sleep
rt.def("/mob/living/silicon/ai/proc/death", function* death(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.isIn(f, fmt("＀_dead", [rt.sv(f, "icon_state")]), (yield* g.call(f, P("/proc/icon_states"), null, [rt.fv(f, "icon", live(f.src)), 1]))) ? 1 : 0))) {
		rt.setSv(f, "icon_state", fmt("＀_dead", [rt.sv(f, "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", "ai_dead");
	}
	rt.setSv(f, "cameraFollow", null);
	rt.setSv(f, "anchored", 0);
	yield* g.srcCall(f, "update_canmove");
	if (truthy(rt.sv(f, "eyeobj"))) {
		yield* g.callName(f, rt.sv(f, "eyeobj"), "setLoc", [rt.getStep(f, live(f.src), 0)]);
	}
	(rt.modGl("shuttle_caller_list", live(f.src), subtract));
	yield* g.callName(f, rt.gl("SSshuttle"), "autoEvac", []);
	yield* g.srcCall(f, "ShutOffDoomsdayDevice");
	if (truthy(rt.sv(f, "explosive"))) {
		rt.spawnTail(f, 10, "/mob/living/silicon/ai/proc/death: spawn at modules/mob/living/silicon/ai/death.dm:25", O);
	}
	O = null;
	rt.forList(f, 0, rt.gl("ai_status_displays"), T("/obj/machinery/ai_status_display"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.fv(f, "key", live(f.src)))) {
			rt.setFv(f, "mode", live(O), 2);
			if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/device/aicard")) ? 1 : 0))) {
				rt.setFv(f, "icon_state", rt.sv(f, "loc"), "aicard-404");
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["gibbed"] });

// a spawn(10) body of /mob/living/silicon/ai/proc/death, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/ai/proc/death: spawn at modules/mob/living/silicon/ai/death.dm:25", function* (f: Frame, O: Value) {
	f.vars = () => [O];
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 3, 6, 12, 15]);
	return null;
});

// /mob/living/silicon/ai/proc/ShutOffDoomsdayDevice  (code/modules/mob/living/silicon/ai/death.dm:36)  may sleep
rt.def("/mob/living/silicon/ai/proc/ShutOffDoomsdayDevice", function* ShutOffDoomsdayDevice(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	if (truthy(rt.sv(f, "nuking"))) {
		yield* g.call(f, P("/proc/set_security_level"), null, ["red"]);
		rt.setSv(f, "nuking", 0);
		_P = null;
		rt.forList(f, 0, rt.gl("pinpointer_list"), T("/obj/item/weapon/pinpointer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			yield* g.callName(f, live(_P), "switch_mode_to", [1]);
			rt.setFv(f, "nuke_warning", live(_P), 0);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "doomsday_device"))) return f.dot;
	rt.setFv(f, "timing", rt.sv(f, "doomsday_device"), 0);
	yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [rt.sv(f, "doomsday_device")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "doomsday_device")]);
	return f.dot;
}, true);
