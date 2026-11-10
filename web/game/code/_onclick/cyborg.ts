// Based on /tg/station's code/_onclick/cyborg.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// cyborg.dm:10
rt.def("/mob/living/silicon/robot/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null, W: Value = null;
	if (rt.worldTime(f) <= this.next_click) {
		return f.dot;
	}
	this.next_click = rt.worldTime(f) + 1;
	if (this.client.click_intercept) {
		if (yield* g.callDyn(f, this.client.click_intercept, "InterceptClickOn", [this, params, A])) {
			return f.dot;
		}
	}
	if (this.stat || this.lockcharge || this.IsKnockdown() || this.IsStun() || this.IsUnconscious()) {
		return f.dot;
	}
	if (rt.index((modifiers = params2list(params)), "shift") && rt.at(modifiers, "ctrl")) {
		yield* this.CtrlShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "shift") && rt.at(modifiers, "middle")) {
		yield* this.ShiftMiddleClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "middle")) {
		yield* this.MiddleClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "shift")) {
		yield* this.ShiftClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "alt")) {
		yield* this.AltClickOn(A);
		return f.dot;
	}
	if (rt.at(modifiers, "ctrl")) {
		yield* this.CtrlClickOn(A);
		return f.dot;
	}
	if (this.next_move >= rt.worldTime(f)) {
		return f.dot;
	}
	yield* this.face_atom(A);
	if (this.aicamera.in_camera_mode) {
		this.aicamera.camera_mode_off();
		yield* this.aicamera.captureimage(A, f.usr);
		return f.dot;
	}
	if (!(W = this.get_active_held_item())) {
		yield* A.attack_robot(this);
		return f.dot;
	}
	if (this.buckled || this.incapacitated()) {
		return f.dot;
	}
	if (W == A) {
		yield* W.attack_self(this);
		return f.dot;
	}
	if (A == this.loc || rt.isIn(f, A, this.loc) || rt.isIn(f, A, this.contents)) {
		yield* W.melee_attack_chain(this, A, params);
		return f.dot;
	}
	if (!isturf(this.loc)) {
		return f.dot;
	}
	if (isturf(A) || isturf(A.loc)) {
		if (A.Adjacent(this)) {
			yield* W.melee_attack_chain(this, A, params);
			return f.dot;
		} else {
			yield* W.afterattack(A, this, 0, params);
			return f.dot;
		}
	}
	return f.dot;
}, true);

// cyborg.dm:92
rt.def("/mob/living/silicon/robot/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	this.cycle_modules();
	return f.dot;
});

// cyborg.dm:98
rt.def("/mob/living/silicon/robot/proc/CtrlShiftClickOn", function* CtrlShiftClickOn(f: Frame, A: Value) {
	yield* A.BorgCtrlShiftClick(this);
	return f.dot;
}, true);

// cyborg.dm:100
rt.def("/mob/living/silicon/robot/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	yield* A.BorgShiftClick(this);
	return f.dot;
}, true);

// cyborg.dm:102
rt.def("/mob/living/silicon/robot/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	yield* A.BorgCtrlClick(this);
	return f.dot;
}, true);

// cyborg.dm:104
rt.def("/mob/living/silicon/robot/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	yield* A.BorgAltClick(this);
	return f.dot;
}, true);

// cyborg.dm:107
rt.def("/atom/proc/BorgCtrlShiftClick", function* BorgCtrlShiftClick(f: Frame, user: Value) {
	yield* this.CtrlShiftClick(user);
	return f.dot;
}, true);

// cyborg.dm:110
rt.def("/obj/machinery/door/airlock/proc/BorgCtrlShiftClick", function* BorgCtrlShiftClick(f: Frame) {
	yield* this.AICtrlShiftClick();
	return f.dot;
}, true);

// cyborg.dm:114
rt.def("/atom/proc/BorgShiftClick", function* BorgShiftClick(f: Frame, user: Value) {
	yield* this.ShiftClick(user);
	return f.dot;
}, true);

// cyborg.dm:117
rt.def("/obj/machinery/door/airlock/proc/BorgShiftClick", function* BorgShiftClick(f: Frame) {
	yield* this.AIShiftClick();
	return f.dot;
}, true);

// cyborg.dm:121
rt.def("/atom/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame, user: Value) {
	yield* this.CtrlClick(user);
	return f.dot;
}, true);

// cyborg.dm:124
rt.def("/obj/machinery/door/airlock/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame) {
	yield* this.AICtrlClick();
	return f.dot;
}, true);

// cyborg.dm:127
rt.def("/obj/machinery/power/apc/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame) {
	yield* this.AICtrlClick();
	return f.dot;
}, true);

// cyborg.dm:130
rt.def("/obj/machinery/turretid/proc/BorgCtrlClick", function* BorgCtrlClick(f: Frame) {
	yield* this.AICtrlClick();
	return f.dot;
}, true);

// cyborg.dm:133
rt.def("/atom/proc/BorgAltClick", function* BorgAltClick(f: Frame, user: Value) {
	yield* this.AltClick(user);
	return f.dot;
}, true);

// cyborg.dm:137
rt.def("/obj/machinery/door/airlock/proc/BorgAltClick", function* BorgAltClick(f: Frame) {
	yield* this.AIAltClick();
	return f.dot;
}, true);

// cyborg.dm:140
rt.def("/obj/machinery/turretid/proc/BorgAltClick", function* BorgAltClick(f: Frame) {
	yield* this.AIAltClick();
	return f.dot;
}, true);

// cyborg.dm:151
rt.def("/mob/living/silicon/robot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	yield* A.attack_robot(this);
	return f.dot;
}, true);

// cyborg.dm:153
rt.def("/mob/living/silicon/robot/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	yield* A.attack_robot(this);
	return f.dot;
}, true);

// cyborg.dm:156
rt.def("/atom/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	yield* this.attack_ai(user);
	return f.dot;
}, true);
