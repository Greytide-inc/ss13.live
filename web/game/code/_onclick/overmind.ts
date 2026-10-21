// From code/_onclick/overmind.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/camera/blob/proc/ClickOn  (code/_onclick/overmind.dm:5)  may sleep
rt.def("/mob/camera/blob/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null, _T: Value = null;
	f.vars = () => [A, params, modifiers, _T];
	if (truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "middle"))) {
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
	if (!truthy((_T = rt.getStep(f, live(A), 0)))) return f.dot;
	yield* g.srcCall(f, "expand_blob", live(_T));
	return f.dot;
}, true);

// /mob/camera/blob/proc/MiddleClickOn  (code/_onclick/overmind.dm:23)
rt.def("/mob/camera/blob/proc/MiddleClickOn", function MiddleClickOn(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, live(A), 0)))) return f.dot;
	rt.callSrc(f, "rally_spores", [live(_T)]);
	return f.dot;
});

// /mob/camera/blob/proc/CtrlClickOn  (code/_onclick/overmind.dm:28)  may sleep
rt.def("/mob/camera/blob/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [A, _T];
	if (!truthy((_T = rt.getStep(f, live(A), 0)))) return f.dot;
	yield* g.srcCall(f, "create_shield", live(_T));
	return f.dot;
}, true);

// /mob/camera/blob/proc/AltClickOn  (code/_onclick/overmind.dm:33)  may sleep
rt.def("/mob/camera/blob/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [A, _T];
	if (!truthy((_T = rt.getStep(f, live(A), 0)))) return f.dot;
	yield* g.srcCall(f, "remove_blob", live(_T));
	return f.dot;
}, true);
