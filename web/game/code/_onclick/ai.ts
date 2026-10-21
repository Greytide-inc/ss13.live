// From code/_onclick/ai.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/DblClickOn  (code/_onclick/ai.dm:13)  may sleep
rt.def("/mob/living/silicon/ai/proc/DblClickOn", function* DblClickOn(f: Frame, A: Value, params: Value) {
	f.vars = () => [A, params];
	if (truthy(rt.fv(f, "click_intercept", rt.sv(f, "client")))) {
		if (truthy((yield* g.callDyn(f, rt.fv(f, "click_intercept", rt.sv(f, "client")), "InterceptClickOn", [live(f.src), live(params), live(A)])))) {
			return live(f.dot);
		}
	}
	if ((truthy(rt.sv(f, "control_disabled")) || truthy(rt.sv(f, "stat")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) {
		yield* g.srcCall(f, "ai_actual_track", live(A));
	} else {
		yield* g.callName(f, live(A), "move_camera_by_click", []);
	}
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/ClickOn  (code/_onclick/ai.dm:26)  may sleep
rt.def("/mob/living/silicon/ai/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let pixel_turf: Value = null, turf_visible: Value = null, modifiers: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [A, params, pixel_turf, turf_visible, modifiers, $0, $1, $2];
	if (rt.le(rt.worldTime(f), rt.sv(f, "next_click"))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_click", add(rt.worldTime(f), 1));
	if (truthy(rt.fv(f, "click_intercept", rt.sv(f, "client")))) {
		if (truthy((yield* g.callDyn(f, rt.fv(f, "click_intercept", rt.sv(f, "client")), "InterceptClickOn", [live(f.src), live(params), live(A)])))) {
			return live(f.dot);
		}
	}
	if ((truthy(rt.sv(f, "control_disabled")) || truthy(rt.sv(f, "stat")))) {
		return live(f.dot);
	}
	pixel_turf = (yield* g.call(f, P("/proc/get_turf_pixel"), null, [live(A)]));
	turf_visible = null;
	if (truthy(live(pixel_turf))) {
		if (!truthy((turf_visible = (yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [live(pixel_turf)]))))) {
			if ((truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/device/aicard")) ? 1 : 0)) && truthy((rt.isIn(f, live(pixel_turf), (yield* g.call(f, P("/proc/view"), null, [rt.fv(f, "view", rt.sv(f, "client")), rt.sv(f, "loc")]))) ? 1 : 0)))) {
				turf_visible = 1;
			} else {
				if (truthy(rt.fv(f, "obscured", live(pixel_turf)))) {
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ might be running a modified client! (failed checkTurfVis on AI click of ＀(＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(pixel_turf)), rt.fv(f, "y", live(pixel_turf)), rt.fv(f, "z", live(pixel_turf))])])]);
					$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]));
					$1 = live(A);
					if (truthy(live(pixel_turf))) {
						$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(pixel_turf)), rt.fv(f, "y", live(pixel_turf)), rt.fv(f, "z", live(pixel_turf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(pixel_turf)), rt.fv(f, "y", live(pixel_turf)), rt.fv(f, "z", live(pixel_turf))])]);
					} else {
						$2 = "nonexistent location";
					}
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ might be running a modified client! (failed checkTurfVis on AI click of ＀(＀))", [$0, $1, fmt("＀", [$2])])]);
					$0 = rt.fv(f, "timeofday", rt.world());
					$1 = 864000;
					if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
						$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
					} else {
						$2 = rt.gl("midnight_rollovers");
					}
					if (rt.ge(add($0, multiply($1, $2)), add(rt.sv(f, "chnotify"), 9000))) {
						$0 = rt.fv(f, "timeofday", rt.world());
						$1 = 864000;
						if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
							$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
						} else {
							$2 = rt.gl("midnight_rollovers");
						}
						rt.setSv(f, "chnotify", add($0, multiply($1, $2)));
					}
				}
				return live(f.dot);
			}
		}
	}
	if ((truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift")) && truthy(rt.at(live(modifiers), "ctrl")))) {
		yield* g.srcCall(f, "CtrlShiftClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "middle"))) {
		if (truthy(rt.sv(f, "controlled_mech"))) {
			yield* g.callName(f, rt.sv(f, "controlled_mech"), "click_action", [live(A), live(f.src), live(params)]);
		}
		return live(f.dot);
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "shift"))) {
		yield* g.srcCall(f, "ShiftClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "alt"))) {
		yield* g.srcCall(f, "AltClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "ctrl"))) {
		yield* g.srcCall(f, "CtrlClickOn", live(A));
		return live(f.dot);
	}
	if (rt.le(rt.worldTime(f), rt.sv(f, "next_move"))) {
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "in_camera_mode", rt.sv(f, "aicamera"))) && truthy(live(pixel_turf))) && truthy(live(turf_visible)))) {
		yield* g.callName(f, rt.sv(f, "aicamera"), "camera_mode_off", []);
		yield* g.callName(f, rt.sv(f, "aicamera"), "captureimage", [live(pixel_turf), live(f.usr)]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "waypoint_mode"))) {
		rt.setSv(f, "waypoint_mode", 0);
		yield* g.srcCall(f, "set_waypoint", live(A));
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "attack_ai", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/UnarmedAttack  (code/_onclick/ai.dm:100)  may sleep
rt.def("/mob/living/silicon/ai/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_ai", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/RangedAttack  (code/_onclick/ai.dm:102)  may sleep
rt.def("/mob/living/silicon/ai/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_ai", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/CtrlShiftClickOn  (code/_onclick/ai.dm:114)  may sleep
rt.def("/mob/living/silicon/ai/proc/CtrlShiftClickOn", function* CtrlShiftClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "AICtrlShiftClick", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/ShiftClickOn  (code/_onclick/ai.dm:116)  may sleep
rt.def("/mob/living/silicon/ai/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "AIShiftClick", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/CtrlClickOn  (code/_onclick/ai.dm:118)  may sleep
rt.def("/mob/living/silicon/ai/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "AICtrlClick", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/AltClickOn  (code/_onclick/ai.dm:120)  may sleep
rt.def("/mob/living/silicon/ai/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "AIAltClick", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/AIAltClick  (code/_onclick/ai.dm:132)  may sleep
rt.def("/atom/proc/AIAltClick", function* AIAltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "AltClick", live(user));
	return live(f.dot);
}, true);

// /obj/machinery/door/airlock/proc/AICtrlClick  (code/_onclick/ai.dm:144)  may sleep
rt.def("/obj/machinery/door/airlock/proc/AICtrlClick", function* AICtrlClick(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.srcCall(f, "Topic", "aiEnable=4", rt.alist(f, ["aiEnable", "4"]), 1);
	} else {
		yield* g.srcCall(f, "Topic", "aiDisable=4", rt.alist(f, ["aiDisable", "4"]), 1);
	}
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/AIAltClick  (code/_onclick/ai.dm:151)  may sleep
rt.def("/obj/machinery/door/airlock/proc/AIAltClick", function* AIAltClick(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "secondsElectrified"))) {
		yield* g.srcCall(f, "Topic", "aiEnable=6", rt.alist(f, ["aiEnable", "6"]), 1);
	} else {
		yield* g.srcCall(f, "Topic", "aiDisable=5", rt.alist(f, ["aiDisable", "5"]), 1);
	}
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/AIShiftClick  (code/_onclick/ai.dm:162)  may sleep
rt.def("/obj/machinery/door/airlock/proc/AIShiftClick", function* AIShiftClick(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "Topic", "aiEnable=7", rt.alist(f, ["aiEnable", "7"]), 1);
	} else {
		yield* g.srcCall(f, "Topic", "aiDisable=7", rt.alist(f, ["aiDisable", "7"]), 1);
	}
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/AICtrlShiftClick  (code/_onclick/ai.dm:169)  may sleep
rt.def("/obj/machinery/door/airlock/proc/AICtrlShiftClick", function* AICtrlShiftClick(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "emergency"))) {
		yield* g.srcCall(f, "Topic", "aiEnable=11", rt.alist(f, ["aiEnable", "11"]), 1);
	} else {
		yield* g.srcCall(f, "Topic", "aiDisable=11", rt.alist(f, ["aiDisable", "11"]), 1);
	}
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/AICtrlClick  (code/_onclick/ai.dm:176)  may sleep
rt.def("/obj/machinery/power/apc/proc/AICtrlClick", function* AICtrlClick(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr), 1)))) return f.dot;
	yield* g.srcCall(f, "toggle_breaker");
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/AIAltClick  (code/_onclick/ai.dm:182)  may sleep
rt.def("/obj/machinery/turretid/proc/AIAltClick", function* AIAltClick(f: Frame) {
	yield* g.srcCall(f, "toggle_lethal");
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/AICtrlClick  (code/_onclick/ai.dm:185)  may sleep
rt.def("/obj/machinery/turretid/proc/AICtrlClick", function* AICtrlClick(f: Frame) {
	yield* g.srcCall(f, "toggle_on");
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/TurfAdjacent  (code/_onclick/ai.dm:193)
rt.def("/mob/living/silicon/ai/proc/TurfAdjacent", function TurfAdjacent(f: Frame, _T: Value) {
	return (rt.gl("cameranet") && rt.callName(f, rt.gl("cameranet"), "checkTurfVis", [live(_T)]));
});
