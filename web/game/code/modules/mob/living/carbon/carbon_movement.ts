// From code/modules/mob/living/carbon/carbon_movement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/movement_delay  (code/modules/mob/living/carbon/carbon_movement.dm:3)
rt.def("/mob/living/carbon/proc/movement_delay", function movement_delay(f: Frame) {
	let FP: Value = null, C: Value = null, F: Value = null, leg_amount: Value = null;
	f.vars = () => [FP, C, F, leg_amount];
	FP = null;
	if (truthy((rt.istype(live(f.src), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(f.src);
		if ((truthy((rt.istype((F = rt.callName(f, live(C), "get_flightpack", [])), T("/obj/item/device/flightpack")) ? 1 : 0)) && truthy(rt.fv(f, "flight", live(F))))) {
			FP = 1;
		}
	}
	f.dot = rt.callSuper(f, [live(FP)]);
	if (!truthy(live(FP))) {
		f.dot = rt.modify(live(f.dot), multiply(rt.sv(f, "grab_state"), 1), add);
	} else {
		f.dot = rt.modify(live(f.dot), multiply(rt.sv(f, "grab_state"), 3), add);
	}
	if (truthy(rt.callSrc(f, "get_leg_ignore", []))) return f.dot;
	leg_amount = rt.callSrc(f, "get_num_legs", []);
	f.dot = rt.modify(live(f.dot), subtract(6, multiply(3, live(leg_amount))), add);
	if (!truthy(live(leg_amount))) {
		f.dot = rt.modify(live(f.dot), subtract(6, multiply(3, rt.callSrc(f, "get_num_arms", []))), add);
	}
	if (!truthy(rt.sv(f, "legcuffed"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.fv(f, "slowdown", rt.sv(f, "legcuffed")), add);
	return f.dot;
});

// /mob/living/carbon/proc/slip  (code/modules/mob/living/carbon/carbon_movement.dm:23)  may sleep
rt.def("/mob/living/carbon/proc/slip", function* slip(f: Frame, knockdown_amount: Value, O: Value, lube: Value) {
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [knockdown_amount, O, lube, $0, $1, $2, $3, $4];
	if (truthy(rt.bitAnd(rt.sv(f, "movement_type"), 2))) {
		return 0;
	}
	if (!truthy(rt.bitAnd(live(lube), 8))) {
		$0 = live(f.src);
		$1 = null;
		$2 = "slipped";
		$3 = null;
		if (truthy(live(O))) {
			$4 = rt.fv(f, "name", live(O));
		} else {
			$4 = "floor";
		}
		yield* g.call(f, P("/proc/add_logs"), null, [$0, $1, $2, $3, fmt("on ＀", [$4])]);
	}
	return (yield* g.callName(f, rt.sv(f, "loc"), "handle_slip", [live(f.src), live(knockdown_amount), live(O), live(lube)]));
}, true);

// /mob/living/carbon/proc/Process_Spacemove  (code/modules/mob/living/carbon/carbon_movement.dm:31)  may sleep
rt.def("/mob/living/carbon/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let F: Value = null, _T: Value = null, J: Value = null;
	f.vars = () => [F, _T, J];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return 0;
	}
	if (((truthy((rt.istype((F = (yield* g.srcCall(f, "get_flightpack"))), T("/obj/item/device/flightpack")) ? 1 : 0)) && truthy(rt.fv(f, "flight", live(F)))) && truthy((yield* g.callName(f, live(F), "allow_thrust", [0.009999999776482582, live(f.src)]))))) {
		return 1;
	}
	if (((truthy((rt.istype((_T = (yield* g.srcCall(f, "getorganslot", "thrusters"))), T("/obj/item/organ/cyberimp/chest/thrusters")) ? 1 : 0)) && truthy(live(f.args[0]))) && truthy((yield* g.callName(f, live(_T), "allow_thrust", [0.009999999776482582]))))) {
		return 1;
	}
	if (!((truthy((rt.istype((J = (yield* g.srcCall(f, "get_jetpack"))), T("/obj/item/weapon/tank/jetpack")) ? 1 : 0)) && (truthy(live(f.args[0])) || truthy(rt.fv(f, "stabilizers", live(J))))) && truthy((yield* g.callName(f, live(J), "allow_thrust", [0.009999999776482582, live(f.src)]))))) return f.dot;
	return 1;
}, true, { args: ["movement_dir"] });

// /mob/living/carbon/proc/Move  (code/modules/mob/living/carbon/carbon_movement.dm:50)  may sleep
rt.def("/mob/living/carbon/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((yield* g.srcCall(f, "mob_has_gravity"))))) return f.dot;
	if (((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna")))) && truthy((rt.isIn(f, 19, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		rt.setSv(f, "nutrition", 349);
	} else {
		if ((truthy(rt.sv(f, "nutrition")) && !isEqual(rt.sv(f, "stat"), 2))) {
			(rt.modSrcVar(f, "nutrition", 0.009999999776482582, subtract));
			if (isEqual(rt.sv(f, "m_intent"), "run")) {
				(rt.modSrcVar(f, "nutrition", 0.009999999776482582, subtract));
			}
		}
	}
	if (!((truthy(rt.bitAnd(rt.sv(f, "disabilities"), 32)) && isEqual(rt.sv(f, "m_intent"), "run")) && rt.le(rt.sv(f, "bodytemperature"), 360))) return f.dot;
	rt.modSrcVar(f, "bodytemperature", 2, add);
	return f.dot;
}, true, { args: ["NewLoc", "direct"] });

// /mob/living/carbon/proc/Moved  (code/modules/mob/living/carbon/carbon_movement.dm:62)  may sleep
rt.def("/mob/living/carbon/proc/Moved", function* Moved(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	O = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "on_mob_move", [rt.sv(f, "dir"), live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["oldLoc", "Dir"] });

// /mob/living/carbon/proc/setDir  (code/modules/mob/living/carbon/carbon_movement.dm:67)  may sleep
rt.def("/mob/living/carbon/proc/setDir", function* setDir(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	O = null;
	rt.forList(f, 0, rt.sv(f, "internal_organs"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "on_mob_turn", [live(f.args[0]), live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["newdir"] });
