// From code/_onclick/observer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/dead/observer/proc/DblClickOn  (code/_onclick/observer.dm:2)  may sleep
rt.def("/mob/dead/observer/proc/DblClickOn", function* DblClickOn(f: Frame, A: Value, params: Value) {
	f.vars = () => [A, params];
	if (truthy(rt.fv(f, "click_intercept", rt.sv(f, "client")))) {
		if (truthy((yield* g.callDyn(f, rt.fv(f, "click_intercept", rt.sv(f, "client")), "InterceptClickOn", [live(f.src), live(params), live(A)])))) {
			return live(f.dot);
		}
	}
	if (((truthy(rt.sv(f, "can_reenter_corpse")) && truthy(rt.sv(f, "mind"))) && truthy(rt.fv(f, "current", rt.sv(f, "mind"))))) {
		if ((isEqual(live(A), rt.fv(f, "current", rt.sv(f, "mind"))) || truthy((rt.isIn(f, rt.fv(f, "current", rt.sv(f, "mind")), live(A)) ? 1 : 0)))) {
			yield* g.srcCall(f, "reenter_corpse");
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		yield* g.srcCall(f, "ManualFollow", live(A));
	} else {
		if (!truthy(rt.fv(f, "loc", live(A)))) return f.dot;
		rt.setSv(f, "loc", rt.getStep(f, live(A), 0));
		yield* g.srcCall(f, "update_parallax_contents");
	}
	return f.dot;
}, true);

// /mob/dead/observer/proc/ClickOn  (code/_onclick/observer.dm:21)  may sleep
rt.def("/mob/dead/observer/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	let modifiers: Value = null;
	f.vars = () => [A, params, modifiers];
	if (truthy(rt.fv(f, "click_intercept", rt.sv(f, "client")))) {
		if (truthy((yield* g.callDyn(f, rt.fv(f, "click_intercept", rt.sv(f, "client")), "InterceptClickOn", [live(f.src), live(params), live(A)])))) {
			return live(f.dot);
		}
	}
	if ((truthy(rt.index((modifiers = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift")) && truthy(rt.at(live(modifiers), "middle")))) {
		yield* g.srcCall(f, "ShiftMiddleClickOn", live(A));
		return live(f.dot);
	}
	if ((truthy(rt.at(live(modifiers), "shift")) && truthy(rt.at(live(modifiers), "ctrl")))) {
		yield* g.srcCall(f, "CtrlShiftClickOn", live(A));
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
	if (rt.le(rt.worldTime(f), rt.sv(f, "next_move"))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "attack_ghost", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/attack_ghost  (code/_onclick/observer.dm:53)  may sleep
rt.def("/atom/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.fv(f, "client", live(user)))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		yield* g.srcCall(f, "attack_ai", live(user));
	}
	if (!truthy(rt.gv(f, "inquisitive_ghost", rt.gv(f, "prefs", rt.fv(f, "client", live(user)))))) return f.dot;
	yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/teleport/hub/proc/attack_ghost  (code/_onclick/observer.dm:64)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let l: Value = null, com: Value = null;
	f.vars = () => [user, l, com];
	l = rt.sv(f, "loc");
	if (!(truthy((com = rt.locateIn(f, T("/obj/machinery/computer/teleporter"), rt.locate(subtract(rt.fv(f, "x", live(l)), 2), rt.fv(f, "y", live(l)), rt.fv(f, "z", live(l)))))) && truthy(rt.fv(f, "locked", live(com))))) return f.dot;
	yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, rt.fv(f, "locked", live(com)), 0)]);
	return f.dot;
}, true);

// /obj/effect/portal/proc/attack_ghost  (code/_onclick/observer.dm:71)  may sleep
rt.def("/obj/effect/portal/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "linked"))) return f.dot;
	yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, rt.sv(f, "linked"), 0)]);
	return f.dot;
}, true);

// /obj/machinery/gateway/centerstation/proc/attack_ghost  (code/_onclick/observer.dm:75)  may sleep
rt.def("/obj/machinery/gateway/centerstation/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "awaygate"))) {
		yield* g.callName(f, live(user), "forceMove", [rt.fv(f, "loc", rt.sv(f, "awaygate"))]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ has no destination.", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/machinery/gateway/centeraway/proc/attack_ghost  (code/_onclick/observer.dm:81)  may sleep
rt.def("/obj/machinery/gateway/centeraway/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "stationgate"))) {
		yield* g.callName(f, live(user), "forceMove", [rt.fv(f, "loc", rt.sv(f, "stationgate"))]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ has no destination.", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/attack_ghost  (code/_onclick/observer.dm:86)  may sleep
rt.def("/obj/item/weapon/storage/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "orient2hud", live(user));
	yield* g.srcCall(f, "show_to", live(user));
	return f.dot;
}, true);

// /obj/machinery/teleport/hub/proc/attack_ghost  (code/_onclick/observer.dm:90)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((truthy(rt.sv(f, "power_station")) && truthy(rt.fv(f, "engaged", rt.sv(f, "power_station")))) && truthy(rt.fv(f, "teleporter_console", rt.sv(f, "power_station")))) && truthy(rt.gv(f, "target", rt.fv(f, "teleporter_console", rt.sv(f, "power_station")))))) return f.dot;
	yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, rt.gv(f, "target", rt.fv(f, "teleporter_console", rt.sv(f, "power_station"))), 0)]);
	return f.dot;
}, true);
