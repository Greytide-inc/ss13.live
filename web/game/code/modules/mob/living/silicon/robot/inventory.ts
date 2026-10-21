// From code/modules/mob/living/silicon/robot/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/uneq_module  (code/modules/mob/living/silicon/robot/inventory.dm:12)  may sleep
rt.def("/mob/living/silicon/robot/proc/uneq_module", function* uneq_module(f: Frame, O: Value) {
	let S: Value = null, _T: Value = null;
	f.vars = () => [O, S, _T];
	if (!truthy(live(O))) {
		return 0;
	}
	rt.setFv(f, "mouse_opacity", live(O), 2);
	if (truthy((rt.istype(live(O), T("/obj/item/borg/sight")) ? 1 : 0))) {
		(rt.modSrcVar(f, "sight_mode", rt.op(f, "BitNot", [], [rt.gv(f, "sight_mode", (S = live(O)))]), rt.bitAnd));
		yield* g.srcCall(f, "update_sight");
	} else {
		if (truthy((rt.istype(live(O), T("/obj/item/weapon/storage/bag/tray")) ? 1 : 0))) {
			yield* g.callName(f, (_T = live(O)), "do_quick_empty", []);
		}
	}
	if (truthy(rt.sv(f, "client"))) {
		(rt.modField(f, rt.sv(f, "client"), "screen", live(O), subtract));
	}
	yield* g.srcCall(f, "observer_screen_update", live(O), 0);
	yield* g.callName(f, live(O), "forceMove", [rt.sv(f, "module")]);
	if (truthy(rt.bitAnd(16384, rt.fv(f, "flags", live(O))))) {
		(rt.modField(f, live(O), "flags", 16760831, rt.bitAnd));
	}
	yield* g.callName(f, live(O), "dropped", [live(f.src)]);
	if (isEqual(rt.sv(f, "module_active"), live(O))) {
		rt.setSv(f, "module_active", null);
	}
	if (isEqual(rt.index(rt.sv(f, "held_items"), 1), live(O))) {
		rt.setFv(f, "icon_state", rt.sv(f, "inv1"), "inv1");
		rt.setAt(rt.sv(f, "held_items"), 1, null);
	} else {
		if (isEqual(rt.index(rt.sv(f, "held_items"), 2), live(O))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv2"), "inv2");
			rt.setAt(rt.sv(f, "held_items"), 2, null);
		} else {
			if (isEqual(rt.index(rt.sv(f, "held_items"), 3), live(O))) {
				rt.setFv(f, "icon_state", rt.sv(f, "inv3"), "inv3");
				rt.setAt(rt.sv(f, "held_items"), 3, null);
			}
		}
	}
	yield* g.callName(f, rt.sv(f, "hud_used"), "update_robot_modules_display", []);
	return 1;
}, true);

// /mob/living/silicon/robot/proc/activate_module  (code/modules/mob/living/silicon/robot/inventory.dm:48)  may sleep
rt.def("/mob/living/silicon/robot/proc/activate_module", function* activate_module(f: Frame, O: Value) {
	let S: Value = null;
	f.vars = () => [O, S];
	f.dot = 0;
	if (!truthy((rt.isIn(f, live(O), rt.fv(f, "modules", rt.sv(f, "module"))) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "activated", live(O))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>That module is already activated.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.sv(f, "held_items"), 1))) {
		rt.setAt(rt.sv(f, "held_items"), 1, live(O));
		rt.setFv(f, "screen_loc", live(O), rt.fv(f, "screen_loc", rt.sv(f, "inv1")));
		f.dot = 1;
	} else {
		if (!truthy(rt.index(rt.sv(f, "held_items"), 2))) {
			rt.setAt(rt.sv(f, "held_items"), 2, live(O));
			rt.setFv(f, "screen_loc", live(O), rt.fv(f, "screen_loc", rt.sv(f, "inv2")));
			f.dot = 1;
		} else {
			if (!truthy(rt.index(rt.sv(f, "held_items"), 3))) {
				rt.setAt(rt.sv(f, "held_items"), 3, live(O));
				rt.setFv(f, "screen_loc", live(O), rt.fv(f, "screen_loc", rt.sv(f, "inv3")));
				f.dot = 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You need to disable a module first!</span>"]);
			}
		}
	}
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, live(O), "equipped", [live(f.src), 4]);
	rt.setFv(f, "mouse_opacity", live(O), rt.initial(f, live(O), "mouse_opacity"));
	rt.setFv(f, "layer", live(O), 20);
	rt.setFv(f, "plane", live(O), 20);
	yield* g.srcCall(f, "observer_screen_update", live(O), 1);
	yield* g.callName(f, live(O), "forceMove", [live(f.src)]);
	if (!truthy((rt.istype(live(O), T("/obj/item/borg/sight")) ? 1 : 0))) return f.dot;
	(rt.modSrcVar(f, "sight_mode", rt.gv(f, "sight_mode", (S = live(O))), rt.bitOr));
	yield* g.srcCall(f, "update_sight");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/observer_screen_update  (code/modules/mob/living/silicon/robot/inventory.dm:81)
rt.def("/mob/living/silicon/robot/proc/observer_screen_update", function observer_screen_update(f: Frame, I: Value, _add: Value) {
	let M: Value = null, observe: Value = null;
	let $e: any;
	f.vars = () => [_add, M, observe, $e];
	if (live(_add) === null) {
		_add = 1;
	}
	if (!(truthy(rt.sv(f, "observers")) && truthy(rt.len(f, rt.sv(f, "observers"))))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.sv(f, "observers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.gv(f, "client", (observe = live(M)))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(observe))), live(f.src)))) {
			if (truthy(live(_add))) {
				rt.modField(f, rt.fv(f, "client", live(observe)), "screen", live(I), add);
			} else {
				(rt.modField(f, rt.fv(f, "client", live(observe)), "screen", live(I), subtract));
			}
		} else {
			(rt.modSrcVar(f, "observers", live(observe), subtract));
			if (!truthy(rt.len(f, rt.sv(f, "observers")))) {
				rt.setSv(f, "observers", null);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/silicon/robot/proc/uneq_active  (code/modules/mob/living/silicon/robot/inventory.dm:96)  may sleep
rt.def("/mob/living/silicon/robot/proc/uneq_active", function* uneq_active(f: Frame) {
	yield* g.srcCall(f, "uneq_module", rt.sv(f, "module_active"));
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/uneq_all  (code/modules/mob/living/silicon/robot/inventory.dm:99)  may sleep
rt.def("/mob/living/silicon/robot/proc/uneq_all", function* uneq_all(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "uneq_module", live(I));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/activated  (code/modules/mob/living/silicon/robot/inventory.dm:103)
rt.def("/mob/living/silicon/robot/proc/activated", function activated(f: Frame, O: Value) {
	if (truthy((rt.isIn(f, live(O), rt.sv(f, "held_items")) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

// /mob/living/silicon/robot/proc/module_selected  (code/modules/mob/living/silicon/robot/inventory.dm:112)
rt.def("/mob/living/silicon/robot/proc/module_selected", function module_selected(f: Frame, module: Value) {
	return (isEqual(live(module), rt.callSrc(f, "get_selected_module", [])) ? 1 : 0);
});

// /mob/living/silicon/robot/proc/module_active  (code/modules/mob/living/silicon/robot/inventory.dm:116)
rt.def("/mob/living/silicon/robot/proc/module_active", function module_active(f: Frame, module: Value) {
	if ((rt.lt(live(module), 1) || rt.gt(live(module), 3))) {
		return 0;
	}
	if (rt.ge(rt.length(rt.sv(f, "held_items")), live(module))) {
		if (truthy(rt.index(rt.sv(f, "held_items"), live(module)))) {
			return 1;
		}
	}
	return 0;
});

// /mob/living/silicon/robot/proc/get_selected_module  (code/modules/mob/living/silicon/robot/inventory.dm:127)
rt.def("/mob/living/silicon/robot/proc/get_selected_module", function get_selected_module(f: Frame) {
	if (truthy(rt.sv(f, "module_active"))) {
		return rt.callName(f, rt.sv(f, "held_items"), "Find", [rt.sv(f, "module_active")]);
	}
	return 0;
});

// /mob/living/silicon/robot/proc/select_module  (code/modules/mob/living/silicon/robot/inventory.dm:133)
rt.def("/mob/living/silicon/robot/proc/select_module", function select_module(f: Frame, module: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((rt.lt(live(module), 1) || rt.gt(live(module), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "module_active", [live(module)]))) {
		return live(f.dot);
	}
	$0 = live(module);
	if ($0 === 1) {
		if (!isEqual(rt.sv(f, "module_active"), rt.index(rt.sv(f, "held_items"), live(module)))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv1"), "inv1 +a");
			rt.setFv(f, "icon_state", rt.sv(f, "inv2"), "inv2");
			rt.setFv(f, "icon_state", rt.sv(f, "inv3"), "inv3");
		}
	} else if ($0 === 2) {
		if (!isEqual(rt.sv(f, "module_active"), rt.index(rt.sv(f, "held_items"), live(module)))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv1"), "inv1");
			rt.setFv(f, "icon_state", rt.sv(f, "inv2"), "inv2 +a");
			rt.setFv(f, "icon_state", rt.sv(f, "inv3"), "inv3");
		}
	} else if ($0 === 3) {
		if (!isEqual(rt.sv(f, "module_active"), rt.index(rt.sv(f, "held_items"), live(module)))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv1"), "inv1");
			rt.setFv(f, "icon_state", rt.sv(f, "inv2"), "inv2");
			rt.setFv(f, "icon_state", rt.sv(f, "inv3"), "inv3 +a");
		}
	}
	rt.setSv(f, "module_active", rt.index(rt.sv(f, "held_items"), live(module)));
	return f.dot;
});

// /mob/living/silicon/robot/proc/deselect_module  (code/modules/mob/living/silicon/robot/inventory.dm:159)
rt.def("/mob/living/silicon/robot/proc/deselect_module", function deselect_module(f: Frame, module: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((rt.lt(live(module), 1) || rt.gt(live(module), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "module_active", [live(module)]))) {
		return live(f.dot);
	}
	$0 = live(module);
	if ($0 === 1) {
		if (isEqual(rt.sv(f, "module_active"), rt.index(rt.sv(f, "held_items"), live(module)))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv1"), "inv1");
		}
	} else if ($0 === 2) {
		if (isEqual(rt.sv(f, "module_active"), rt.index(rt.sv(f, "held_items"), live(module)))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv2"), "inv2");
		}
	} else if ($0 === 3) {
		if (isEqual(rt.sv(f, "module_active"), rt.index(rt.sv(f, "held_items"), live(module)))) {
			rt.setFv(f, "icon_state", rt.sv(f, "inv3"), "inv3");
		}
	}
	rt.setSv(f, "module_active", null);
	return f.dot;
});

// /mob/living/silicon/robot/proc/toggle_module  (code/modules/mob/living/silicon/robot/inventory.dm:179)
rt.def("/mob/living/silicon/robot/proc/toggle_module", function toggle_module(f: Frame, module: Value) {
	if ((rt.lt(live(module), 1) || rt.gt(live(module), 3))) {
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "module_selected", [live(module)]))) {
		rt.callSrc(f, "deselect_module", [live(module)]);
	} else {
		if (truthy(rt.callSrc(f, "module_active", [live(module)]))) {
			rt.callSrc(f, "select_module", [live(module)]);
		} else {
			rt.callSrc(f, "deselect_module", [rt.callSrc(f, "get_selected_module", [])]);
		}
	}
	return live(f.dot);
});

// /mob/living/silicon/robot/proc/cycle_modules  (code/modules/mob/living/silicon/robot/inventory.dm:192)
rt.def("/mob/living/silicon/robot/proc/cycle_modules", function cycle_modules(f: Frame) {
	let slot_start: Value = null, slot_num: Value = null;
	f.vars = () => [slot_start, slot_num];
	if (truthy((slot_start = rt.callSrc(f, "get_selected_module", [])))) {
		rt.callSrc(f, "deselect_module", [live(slot_start)]);
	}
	slot_num = null;
	if (isEqual(live(slot_start), 0)) {
		slot_num = 1;
		slot_start = 4;
	} else {
		slot_num = add(live(slot_start), 1);
	}
	while (!isEqual(live(slot_num), live(slot_start))) {
		if (truthy(rt.callSrc(f, "module_active", [live(slot_num)]))) {
			rt.callSrc(f, "select_module", [live(slot_num)]);
			return live(f.dot);
		}
		slot_num = rt.inc(live(slot_num), 1);
		if (rt.gt(live(slot_num), 4)) {
			slot_num = 1;
		}
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/swap_hand  (code/modules/mob/living/silicon/robot/inventory.dm:214)
rt.def("/mob/living/silicon/robot/proc/swap_hand", function swap_hand(f: Frame) {
	rt.callSrc(f, "cycle_modules", []);
	return f.dot;
});
