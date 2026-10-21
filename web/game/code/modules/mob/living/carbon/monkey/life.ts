// From code/modules/mob/living/carbon/monkey/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/monkey/proc/Life  (code/modules/mob/living/carbon/monkey/life.dm:13)  may sleep
rt.def("/mob/living/carbon/monkey/proc/Life", function* Life(f: Frame) {
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy(rt.sv(f, "client"))) return f.dot;
	if (isEqual(rt.sv(f, "stat"), 0)) {
		if (!truthy((yield* g.srcCall(f, "handle_combat")))) {
			if ((((truthy(rt.op(f, "Prob", [], [33])) && truthy(rt.sv(f, "canmove"))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) && !truthy(rt.sv(f, "pulledby")))) {
				yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
			}
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				yield* g.srcCall(f, "emote", rt.op(f, "PickUnweighted", [4], ["scratch", "jump", "roll", "tail"]));
			}
		}
	} else {
		yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/carbon/monkey/proc/handle_mutations_and_radiation  (code/modules/mob/living/carbon/monkey/life.dm:28)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "radiation"))) return f.dot;
	if (rt.gt(rt.sv(f, "radiation"), 100)) {
		if (!truthy((yield* g.srcCall(f, "IsKnockdown")))) {
			yield* g.srcCall(f, "emote", "collapse");
		}
		yield* g.srcCall(f, "Knockdown", 200);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You feel weak.</span>"]);
	}
	$0 = rt.sv(f, "radiation");
	if (rt.inRange($0, 50, 75)) {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			if (!truthy((yield* g.srcCall(f, "IsKnockdown")))) {
				yield* g.srcCall(f, "emote", "collapse");
			}
			yield* g.srcCall(f, "Knockdown", 60);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You feel weak.</span>"]);
		}
	} else if (rt.inRange($0, 75, 100)) {
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You mutate!</span>"]);
			yield* g.srcCall(f, "randmutb");
			yield* g.srcCall(f, "emote", "gasp");
			yield* g.srcCall(f, "domutcheck");
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/handle_chemicals_in_body  (code/modules/mob/living/carbon/monkey/life.dm:53)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame) {
	if (!truthy(rt.sv(f, "reagents"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "metabolize", [null, live(f.src), "can_overdose", 1], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/handle_breath_temperature  (code/modules/mob/living/carbon/monkey/life.dm:56)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_breath_temperature", function* handle_breath_temperature(f: Frame, breath: Value) {
	let $0: any;
	f.vars = () => [breath, $0];
	if (!rt.gt(rt.op(f, "Abs", [], [subtract(310.1499938964844, rt.fv(f, "temperature", live(breath)))]), 50)) return f.dot;
	$0 = rt.fv(f, "temperature", live(breath));
	if (rt.inRange($0, -9.999999848243207e+30, 120)) {
		yield* g.srcCall(f, "adjustFireLoss", 3);
	} else if (rt.inRange($0, 120, 200)) {
		yield* g.srcCall(f, "adjustFireLoss", 1.5);
	} else if (rt.inRange($0, 200, 260)) {
		yield* g.srcCall(f, "adjustFireLoss", 0.5);
	} else if (rt.inRange($0, 360, 400)) {
		yield* g.srcCall(f, "adjustFireLoss", 2);
	} else if (rt.inRange($0, 400, 1000)) {
		yield* g.srcCall(f, "adjustFireLoss", 3);
	} else if (rt.inRange($0, 1000, 9.999999848243207e+30)) {
		yield* g.srcCall(f, "adjustFireLoss", 8);
	}
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/handle_environment  (code/modules/mob/living/carbon/monkey/life.dm:72)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let loc_temp: Value = null, pressure: Value = null, adjusted_pressure: Value = null;
	let $0: any;
	f.vars = () => [environment, loc_temp, pressure, adjusted_pressure, $0];
	if (!truthy(live(environment))) {
		return live(f.dot);
	}
	loc_temp = (yield* g.srcCall(f, "get_temperature", live(environment)));
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "natural_bodytemperature_stabilization");
	}
	if (!truthy(rt.sv(f, "on_fire"))) {
		if (rt.lt(live(loc_temp), rt.sv(f, "bodytemperature"))) {
			rt.modSrcVar(f, "bodytemperature", (yield* g.call(f, P("/proc/min"), null, [divide(subtract(live(loc_temp), rt.sv(f, "bodytemperature")), 6), 30])), add);
		} else {
			rt.modSrcVar(f, "bodytemperature", (yield* g.call(f, P("/proc/min"), null, [divide(subtract(live(loc_temp), rt.sv(f, "bodytemperature")), 6), 30])), add);
		}
	}
	if (rt.gt(rt.sv(f, "bodytemperature"), 360.1499938964844)) {
		$0 = rt.sv(f, "bodytemperature");
		if (rt.inRange($0, 360, 400)) {
			yield* g.srcCall(f, "throw_alert", "temp", T("/obj/screen/alert/hot"), 1);
			yield* g.srcCall(f, "apply_damage", 2, "fire");
		} else if (rt.inRange($0, 400, 460)) {
			yield* g.srcCall(f, "throw_alert", "temp", T("/obj/screen/alert/hot"), 2);
			yield* g.srcCall(f, "apply_damage", 3, "fire");
		} else if (rt.inRange($0, 460, 9.999999848243207e+30)) {
			yield* g.srcCall(f, "throw_alert", "temp", T("/obj/screen/alert/hot"), 3);
			if (truthy(rt.sv(f, "on_fire"))) {
				yield* g.srcCall(f, "apply_damage", 10, "fire");
			} else {
				yield* g.srcCall(f, "apply_damage", 3, "fire");
			}
		}
	} else {
		if (rt.lt(rt.sv(f, "bodytemperature"), 260.1499938964844)) {
			if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/atmospherics/components/unary/cryo_cell")) ? 1 : 0))) {
				$0 = rt.sv(f, "bodytemperature");
				if (rt.inRange($0, 200, 260)) {
					yield* g.srcCall(f, "throw_alert", "temp", T("/obj/screen/alert/cold"), 1);
					yield* g.srcCall(f, "apply_damage", 0.5, "fire");
				} else if (rt.inRange($0, 120, 200)) {
					yield* g.srcCall(f, "throw_alert", "temp", T("/obj/screen/alert/cold"), 2);
					yield* g.srcCall(f, "apply_damage", 1.5, "fire");
				} else if (rt.inRange($0, -9.999999848243207e+30, 120)) {
					yield* g.srcCall(f, "throw_alert", "temp", T("/obj/screen/alert/cold"), 3);
					yield* g.srcCall(f, "apply_damage", 3, "fire");
				}
			} else {
				yield* g.srcCall(f, "clear_alert", "temp");
			}
		} else {
			yield* g.srcCall(f, "clear_alert", "temp");
		}
	}
	pressure = (yield* g.callName(f, live(environment), "return_pressure", []));
	$0 = (adjusted_pressure = (yield* g.srcCall(f, "calculate_affecting_pressure", live(pressure))));
	if (rt.inRange($0, 550, 9.999999848243207e+30)) {
		yield* g.srcCall(f, "adjustBruteLoss", (yield* g.call(f, P("/proc/min"), null, [multiply(subtract(divide(live(adjusted_pressure), 550), 1), 4), 4])));
		yield* g.srcCall(f, "throw_alert", "pressure", T("/obj/screen/alert/highpressure"), 2);
	} else if (rt.inRange($0, 325, 550)) {
		yield* g.srcCall(f, "throw_alert", "pressure", T("/obj/screen/alert/highpressure"), 1);
	} else if (rt.inRange($0, 50, 325)) {
		yield* g.srcCall(f, "clear_alert", "pressure");
	} else if (rt.inRange($0, 20, 50)) {
		yield* g.srcCall(f, "throw_alert", "pressure", T("/obj/screen/alert/lowpressure"), 1);
	} else {
		yield* g.srcCall(f, "adjustBruteLoss", 2);
		yield* g.srcCall(f, "throw_alert", "pressure", T("/obj/screen/alert/lowpressure"), 2);
	}
	return live(f.dot);
}, true);

// /mob/living/carbon/monkey/proc/handle_random_events  (code/modules/mob/living/carbon/monkey/life.dm:140)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_random_events", function* handle_random_events(f: Frame) {
	if (!(truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [2])))) return f.dot;
	yield* g.srcCall(f, "emote", "scratch");
	return f.dot;
}, true);

// /mob/living/carbon/monkey/proc/has_smoke_protection  (code/modules/mob/living/carbon/monkey/life.dm:145)
rt.def("/mob/living/carbon/monkey/proc/has_smoke_protection", function has_smoke_protection(f: Frame) {
	if (!truthy(rt.sv(f, "wear_mask"))) return f.dot;
	if (!truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_mask")), 4096))) return f.dot;
	return 1;
});

// /mob/living/carbon/monkey/proc/handle_fire  (code/modules/mob/living/carbon/monkey/life.dm:149)  may sleep
rt.def("/mob/living/carbon/monkey/proc/handle_fire", function* handle_fire(f: Frame) {
	let burning_items: Value = null, head_clothes: Value = null, X: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [burning_items, head_clothes, X, I, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "on_fire"))) return f.dot;
	burning_items = rt.list();
	head_clothes = null;
	if (truthy(rt.sv(f, "wear_mask"))) {
		head_clothes = rt.sv(f, "wear_mask");
	}
	if (truthy(rt.sv(f, "wear_neck"))) {
		head_clothes = rt.sv(f, "wear_neck");
	}
	if (truthy(rt.sv(f, "head"))) {
		head_clothes = rt.sv(f, "head");
	}
	if (truthy(live(head_clothes))) {
		burning_items = rt.modify(live(burning_items), live(head_clothes), add);
	}
	if (truthy(rt.sv(f, "back"))) {
		burning_items = rt.modify(live(burning_items), rt.sv(f, "back"), add);
	}
	X = null;
	rt.forList(f, 0, live(burning_items));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (!truthy(rt.bitAnd(rt.gv(f, "resistance_flags", (I = live(X))), 2))) {
			yield* g.callName(f, live(I), "take_damage", [rt.sv(f, "fire_stacks"), "fire", "fire", 0]);
		}
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "bodytemperature", 30, add);
	return f.dot;
}, true);
