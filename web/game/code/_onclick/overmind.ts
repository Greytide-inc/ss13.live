// Based on /tg/station's code/_onclick/overmind.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// overmind.dm:5
rt.def("/mob/camera/blob/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null, _T: Value = null;
	if (rt.index((modifiers = params2list(params)), "middle")) {
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
	if (!(_T = rt.getStep(f, A, 0))) return f.dot;
	yield* this.expand_blob(_T);
	return f.dot;
}, true);

// overmind.dm:23
rt.def("/mob/camera/blob/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, A, 0))) return f.dot;
	this.rally_spores(_T);
	return f.dot;
});

// overmind.dm:28
rt.def("/mob/camera/blob/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, A, 0))) return f.dot;
	yield* this.create_shield(_T);
	return f.dot;
}, true);

// overmind.dm:33
rt.def("/mob/camera/blob/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, A, 0))) return f.dot;
	yield* this.remove_blob(_T);
	return f.dot;
}, true);
