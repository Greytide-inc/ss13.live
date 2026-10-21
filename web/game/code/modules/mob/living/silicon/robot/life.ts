// From code/modules/mob/living/silicon/robot/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/Life  (code/modules/mob/living/silicon/robot/life.dm:5)  may sleep
rt.def("/mob/living/silicon/robot/proc/Life", function* Life(f: Frame) {
	if (truthy(rt.fv(f, "notransform", live(f.src)))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "handle_robot_hud_updates");
	yield* g.srcCall(f, "handle_robot_cell");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/silicon/robot/proc/handle_robot_cell  (code/modules/mob/living/silicon/robot/life.dm:13)  may sleep
rt.def("/mob/living/silicon/robot/proc/handle_robot_cell", function* handle_robot_cell(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	if (truthy(rt.sv(f, "low_power_mode"))) {
		if ((truthy(rt.sv(f, "cell")) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) {
			rt.setSv(f, "low_power_mode", 0);
			yield* g.srcCall(f, "update_headlamp");
		}
	} else {
		if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
		yield* g.srcCall(f, "use_power");
	}
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/use_power  (code/modules/mob/living/silicon/robot/life.dm:22)  may sleep
rt.def("/mob/living/silicon/robot/proc/use_power", function* use_power(f: Frame) {
	let amt: Value = null;
	f.vars = () => [amt];
	if ((truthy(rt.sv(f, "cell")) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) {
		if (rt.le(rt.fv(f, "charge", rt.sv(f, "cell")), 100)) {
			yield* g.srcCall(f, "uneq_all");
		}
		amt = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [multiply(subtract(rt.sv(f, "lamp_intensity"), 2), 2), rt.fv(f, "charge", rt.sv(f, "cell"))]))]));
		yield* g.callName(f, rt.sv(f, "cell"), "use", [live(amt)]);
	} else {
		yield* g.srcCall(f, "uneq_all");
		rt.setSv(f, "low_power_mode", 1);
		yield* g.srcCall(f, "update_headlamp");
	}
	yield* g.srcCall(f, "diag_hud_set_borgcell");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/handle_robot_hud_updates  (code/modules/mob/living/silicon/robot/life.dm:34)  may sleep
rt.def("/mob/living/silicon/robot/proc/handle_robot_hud_updates", function* handle_robot_hud_updates(f: Frame) {
	let tra: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [tra, I, $e];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "update_cell_hud_icon");
	if (!truthy(rt.sv(f, "syndicate"))) return f.dot;
	if (isEqual(rt.gv(f, "name", rt.fv(f, "mode", rt.gl("SSticker"))), "traitor")) {
		tra = null;
		rt.forList(f, 0, rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			tra = $e;
			if (truthy(rt.fv(f, "current", live(tra)))) {
				I = (yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/mob.dmi"), "loc", rt.fv(f, "current", live(tra)), "icon_state", "traitor"], rt.Args.Named));
				rt.modField(f, rt.fv(f, "client", live(f.src)), "images", live(I), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "connected_ai"))) {
		(rt.modField(f, rt.sv(f, "connected_ai"), "connected_robots", live(f.src), subtract));
		rt.setSv(f, "connected_ai", null);
	}
	if (!truthy(rt.sv(f, "mind"))) return f.dot;
	if (truthy(rt.fv(f, "special_role", rt.sv(f, "mind")))) return f.dot;
	rt.setFv(f, "special_role", rt.sv(f, "mind"), "traitor");
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.sv(f, "mind"), add);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/update_health_hud  (code/modules/mob/living/silicon/robot/life.dm:55)
rt.def("/mob/living/silicon/robot/proc/update_health_hud", function update_health_hud(f: Frame) {
	if ((!truthy(rt.sv(f, "client")) || !truthy(rt.sv(f, "hud_used")))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "healths", rt.sv(f, "hud_used")))) return f.dot;
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if (rt.ge(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
			rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health0");
		} else {
			if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.6000000238418579))) {
				rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health2");
			} else {
				if (rt.gt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.20000000298023224))) {
					rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health3");
				} else {
					if (rt.gt(rt.sv(f, "health"), multiply(rt.neg(rt.sv(f, "maxHealth")), 0.20000000298023224))) {
						rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health4");
					} else {
						if (rt.gt(rt.sv(f, "health"), multiply(rt.neg(rt.sv(f, "maxHealth")), 0.6000000238418579))) {
							rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health5");
						} else {
							rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health6");
						}
					}
				}
			}
		}
	} else {
		rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health7");
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/update_cell_hud_icon  (code/modules/mob/living/silicon/robot/life.dm:76)  may sleep
rt.def("/mob/living/silicon/robot/proc/update_cell_hud_icon", function* update_cell_hud_icon(f: Frame) {
	let cellcharge: Value = null;
	let $0: any;
	f.vars = () => [cellcharge, $0];
	if (truthy(rt.sv(f, "cell"))) {
		$0 = (cellcharge = divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell"))));
		if (rt.inRange($0, 0.75, 9.999999848243207e+30)) {
			yield* g.srcCall(f, "clear_alert", "charge");
		} else if (rt.inRange($0, 0.5, 0.75)) {
			yield* g.srcCall(f, "throw_alert", "charge", T("/obj/screen/alert/lowcell"), 1);
		} else if (rt.inRange($0, 0.25, 0.5)) {
			yield* g.srcCall(f, "throw_alert", "charge", T("/obj/screen/alert/lowcell"), 2);
		} else if (rt.inRange($0, 0.009999999776482582, 0.25)) {
			yield* g.srcCall(f, "throw_alert", "charge", T("/obj/screen/alert/lowcell"), 3);
		} else {
			yield* g.srcCall(f, "throw_alert", "charge", T("/obj/screen/alert/emptycell"));
		}
	} else {
		yield* g.srcCall(f, "throw_alert", "charge", T("/obj/screen/alert/nocell"));
	}
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/handle_fire  (code/modules/mob/living/silicon/robot/life.dm:93)  may sleep
rt.def("/mob/living/silicon/robot/proc/handle_fire", function* handle_fire(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "fire_stacks"), 0)) {
		rt.incSrcVar(f, "fire_stacks", -1, true);
		rt.setSv(f, "fire_stacks", (yield* g.call(f, P("/proc/max"), null, [0, rt.sv(f, "fire_stacks")])));
	} else {
		yield* g.srcCall(f, "ExtinguishMob");
	}
	return live(f.dot);
}, true);

// /mob/living/silicon/robot/proc/update_fire  (code/modules/mob/living/silicon/robot/life.dm:105)
rt.def("/mob/living/silicon/robot/proc/update_fire", function update_fire(f: Frame) {
	let fire_overlay: Value = null;
	f.vars = () => [fire_overlay];
	fire_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/onfire.dmi"), "Generic_mob_burning"]);
	if (truthy(rt.sv(f, "on_fire"))) {
		rt.callSrc(f, "add_overlay", [live(fire_overlay)]);
	} else {
		rt.callSrc(f, "cut_overlay", [live(fire_overlay)]);
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/update_canmove  (code/modules/mob/living/silicon/robot/life.dm:112)  may sleep
rt.def("/mob/living/silicon/robot/proc/update_canmove", function* update_canmove(f: Frame) {
	if (((truthy(rt.sv(f, "stat")) || truthy(rt.sv(f, "buckled"))) || truthy(rt.sv(f, "lockcharge")))) {
		rt.setSv(f, "canmove", 0);
	} else {
		rt.setSv(f, "canmove", 1);
	}
	yield* g.srcCall(f, "update_transform");
	yield* g.srcCall(f, "update_action_buttons_icon");
	return rt.sv(f, "canmove");
}, true);
