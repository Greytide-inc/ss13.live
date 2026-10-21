// From code/_onclick/cyborg.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/ClickOn  (code/_onclick/cyborg.dm:10)  may sleep
rt.def("/mob/living/silicon/robot/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null, W: Value = null;
	f.vars = () => [A, params, modifiers, W];
	if (rt.le(rt.worldTime(f), rt.sv(f, "next_click"))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_click", add(rt.worldTime(f), 1));
	if (truthy(rt.fv(f, "click_intercept", rt.sv(f, "client")))) {
		if (truthy((yield* g.callDyn(f, rt.fv(f, "click_intercept", rt.sv(f, "client")), "InterceptClickOn", [live(f.src), live(params), live(A)])))) {
			return live(f.dot);
		}
	}
	if (((((truthy(rt.sv(f, "stat")) || truthy(rt.sv(f, "lockcharge"))) || truthy((yield* g.srcCall(f, "IsKnockdown")))) || truthy((yield* g.srcCall(f, "IsStun")))) || truthy((yield* g.srcCall(f, "IsUnconscious"))))) {
		return live(f.dot);
	}
	if ((truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift")) && truthy(rt.at(live(modifiers), "ctrl")))) {
		yield* g.srcCall(f, "CtrlShiftClickOn", live(A));
		return live(f.dot);
	}
	if ((truthy(rt.at(live(modifiers), "shift")) && truthy(rt.at(live(modifiers), "middle")))) {
		yield* g.srcCall(f, "ShiftMiddleClickOn", live(A));
		return live(f.dot);
	}
	if (truthy(rt.at(live(modifiers), "middle"))) {
		yield* g.srcCall(f, "MiddleClickOn", live(A));
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
	if (rt.ge(rt.sv(f, "next_move"), rt.worldTime(f))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "face_atom", live(A));
	if (truthy(rt.fv(f, "in_camera_mode", rt.sv(f, "aicamera")))) {
		yield* g.callName(f, rt.sv(f, "aicamera"), "camera_mode_off", []);
		yield* g.callName(f, rt.sv(f, "aicamera"), "captureimage", [live(A), live(f.usr)]);
		return live(f.dot);
	}
	if (!truthy((W = (yield* g.srcCall(f, "get_active_held_item"))))) {
		yield* g.callName(f, live(A), "attack_robot", [live(f.src)]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "buckled")) || truthy((yield* g.srcCall(f, "incapacitated"))))) {
		return live(f.dot);
	}
	if (isEqual(live(W), live(A))) {
		yield* g.callName(f, live(W), "attack_self", [live(f.src)]);
		return live(f.dot);
	}
	if (((isEqual(live(A), rt.sv(f, "loc")) || truthy((rt.isIn(f, live(A), rt.sv(f, "loc")) ? 1 : 0))) || truthy((rt.isIn(f, live(A), rt.sv(f, "contents")) ? 1 : 0)))) {
		yield* g.callName(f, live(W), "melee_attack_chain", [live(f.src), live(A), live(params)]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)]))) || truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))))) {
		if (truthy((yield* g.callName(f, live(A), "Adjacent", [live(f.src)])))) {
			yield* g.callName(f, live(W), "melee_attack_chain", [live(f.src), live(A), live(params)]);
			return live(f.dot);
		} else {
			yield* g.callName(f, live(W), "afterattack", [live(A), live(f.src), 0, live(params)]);
			return live(f.dot);
		}
	}
	return live(f.dot);
}, true);

// /mob/living/silicon/robot/proc/MiddleClickOn  (code/_onclick/cyborg.dm:92)
rt.def("/mob/living/silicon/robot/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	rt.callSrc(f, "cycle_modules", []);
	return live(f.dot);
});

// /mob/living/silicon/robot/proc/CtrlShiftClickOn  (code/_onclick/cyborg.dm:98)  may sleep
rt.def("/mob/living/silicon/robot/proc/CtrlShiftClickOn", function* CtrlShiftClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "BorgCtrlShiftClick", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/ShiftClickOn  (code/_onclick/cyborg.dm:100)  may sleep
rt.def("/mob/living/silicon/robot/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "BorgShiftClick", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/CtrlClickOn  (code/_onclick/cyborg.dm:102)  may sleep
rt.def("/mob/living/silicon/robot/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "BorgCtrlClick", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/AltClickOn  (code/_onclick/cyborg.dm:104)  may sleep
rt.def("/mob/living/silicon/robot/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "BorgAltClick", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/BorgCtrlShiftClick  (code/_onclick/cyborg.dm:107)  may sleep
rt.def("/atom/proc/BorgCtrlShiftClick", function* BorgCtrlShiftClick(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "CtrlShiftClick", live(user));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/BorgCtrlShiftClick  (code/_onclick/cyborg.dm:110)  may sleep
rt.def("/obj/machinery/door/airlock/proc/BorgCtrlShiftClick", function* BorgCtrlShiftClick(f: Frame) {
	yield* g.srcCall(f, "AICtrlShiftClick");
	return f.dot;
}, true);

// /atom/proc/BorgShiftClick  (code/_onclick/cyborg.dm:114)  may sleep
rt.def("/atom/proc/BorgShiftClick", function* BorgShiftClick(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "ShiftClick", live(user));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/BorgShiftClick  (code/_onclick/cyborg.dm:117)  may sleep
rt.def("/obj/machinery/door/airlock/proc/BorgShiftClick", function* BorgShiftClick(f: Frame) {
	yield* g.srcCall(f, "AIShiftClick");
	return f.dot;
}, true);

// /atom/proc/BorgCtrlClick  (code/_onclick/cyborg.dm:121)  may sleep
rt.def("/atom/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "CtrlClick", live(user));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/proc/BorgCtrlClick  (code/_onclick/cyborg.dm:124)  may sleep
rt.def("/obj/machinery/door/airlock/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame) {
	yield* g.srcCall(f, "AICtrlClick");
	return f.dot;
}, true);

// /obj/machinery/power/apc/proc/BorgCtrlClick  (code/_onclick/cyborg.dm:127)  may sleep
rt.def("/obj/machinery/power/apc/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame) {
	yield* g.srcCall(f, "AICtrlClick");
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/BorgCtrlClick  (code/_onclick/cyborg.dm:130)  may sleep
rt.def("/obj/machinery/turretid/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame) {
	yield* g.srcCall(f, "AICtrlClick");
	return f.dot;
}, true);

// /atom/proc/BorgAltClick  (code/_onclick/cyborg.dm:133)  may sleep
rt.def("/atom/proc/BorgAltClick", function* BorgAltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "AltClick", live(user));
	return live(f.dot);
}, true);

// /obj/machinery/door/airlock/proc/BorgAltClick  (code/_onclick/cyborg.dm:137)  may sleep
rt.def("/obj/machinery/door/airlock/proc/BorgAltClick", function* BorgAltClick(f: Frame) {
	yield* g.srcCall(f, "AIAltClick");
	return f.dot;
}, true);

// /obj/machinery/turretid/proc/BorgAltClick  (code/_onclick/cyborg.dm:140)  may sleep
rt.def("/obj/machinery/turretid/proc/BorgAltClick", function* BorgAltClick(f: Frame) {
	yield* g.srcCall(f, "AIAltClick");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/UnarmedAttack  (code/_onclick/cyborg.dm:151)  may sleep
rt.def("/mob/living/silicon/robot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_robot", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/RangedAttack  (code/_onclick/cyborg.dm:153)  may sleep
rt.def("/mob/living/silicon/robot/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.callName(f, live(A), "attack_robot", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/attack_robot  (code/_onclick/cyborg.dm:156)  may sleep
rt.def("/atom/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_ai", live(user));
	return live(f.dot);
}, true);
