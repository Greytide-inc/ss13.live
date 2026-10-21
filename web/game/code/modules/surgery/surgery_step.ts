// From code/modules/surgery/surgery_step.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1326, "/datum/surgery_step", "/datum", {
	name: null,
	implements: null,
	implement_type: null,
	accept_hand: 0,
	accept_any_item: 0,
	time: 10,
});

// /datum/surgery_step/proc/<init>  (code/modules/surgery/surgery_step.dm:3)
rt.def("/datum/surgery_step/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.list());
	return f.dot;
});

// /datum/surgery_step/proc/try_op  (code/modules/surgery/surgery_step.dm:13)  may sleep
rt.def("/datum/surgery_step/proc/try_op", function* try_op(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let success: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [user, target, target_zone, tool, surgery, success, path, $e];
	success = 0;
	if (truthy(rt.sv(f, "accept_hand"))) {
		if (!truthy(live(tool))) {
			success = 1;
		}
	}
	if (truthy(rt.sv(f, "accept_any_item"))) {
		if ((truthy(live(tool)) && truthy((yield* g.srcCall(f, "tool_check", live(user), live(tool)))))) {
			success = 1;
		}
	} else {
		path = null;
		rt.forList(f, 0, rt.sv(f, "implements"));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			if (truthy(rt.op(f, "IsType", [], [live(tool), live(path)]))) {
				rt.setSv(f, "implement_type", live(path));
				if (truthy((yield* g.srcCall(f, "tool_check", live(user), live(tool))))) {
					success = 1;
					break;
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(success))) {
		if (isEqual(live(target_zone), rt.fv(f, "location", live(surgery)))) {
			if ((truthy((yield* g.call(f, P("/proc/get_location_accessible"), null, [live(target), live(target_zone)]))) || truthy(rt.fv(f, "ignore_clothes", live(surgery))))) {
				yield* g.srcCall(f, "initiate", live(user), live(target), live(target_zone), live(tool), live(surgery));
				return 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to expose ＀'s ＀ to perform surgery on it!</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
				return 1;
			}
		}
	}
	if ((truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(user)), "harm"))) {
		return 1;
	}
	return 0;
}, true);

// /datum/surgery_step/proc/initiate  (code/modules/surgery/surgery_step.dm:40)  may sleep
rt.def("/datum/surgery_step/proc/initiate", function* initiate(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let speed_mod: Value = null, advance: Value = null, prob_chance: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, speed_mod, advance, prob_chance];
	rt.setFv(f, "step_in_progress", live(surgery), 1);
	speed_mod = 1;
	if (isEqual((yield* g.srcCall(f, "preop", live(user), live(target), live(target_zone), live(tool), live(surgery))), -1)) {
		rt.setFv(f, "step_in_progress", live(surgery), 0);
		return live(f.dot);
	}
	if (truthy(live(tool))) {
		speed_mod = rt.fv(f, "toolspeed", live(tool));
	}
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(rt.sv(f, "time"), live(speed_mod)), "target", live(target)], rt.Args.Named)))) {
		advance = 0;
		prob_chance = 100;
		if (truthy(rt.sv(f, "implement_type"))) {
			prob_chance = rt.index(rt.sv(f, "implements"), rt.sv(f, "implement_type"));
		}
		(prob_chance = rt.modify(live(prob_chance), (yield* g.callName(f, live(surgery), "get_propability_multiplier", [])), multiply));
		if ((truthy(rt.op(f, "Prob", [], [live(prob_chance)])) || truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
			if (truthy((yield* g.srcCall(f, "success", live(user), live(target), live(target_zone), live(tool), live(surgery))))) {
				advance = 1;
			}
		} else {
			if (truthy((yield* g.srcCall(f, "failure", live(user), live(target), live(target_zone), live(tool), live(surgery))))) {
				advance = 1;
			}
		}
		if (truthy(live(advance))) {
			rt.incField(f, live(surgery), "status", 1, true);
			if (rt.gt(rt.fv(f, "status", live(surgery)), rt.getLen(f, rt.fv(f, "steps", live(surgery))))) {
				yield* g.callName(f, live(surgery), "complete", []);
			}
		}
	}
	rt.setFv(f, "step_in_progress", live(surgery), 0);
	return f.dot;
}, true);

// /datum/surgery_step/proc/preop  (code/modules/surgery/surgery_step.dm:75)
rt.def("/datum/surgery_step/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to perform surgery on ＀.", [live(user), live(target)]), fmt("<span class='notice'>You begin to perform surgery on ＀...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/proc/success  (code/modules/surgery/surgery_step.dm:79)
rt.def("/datum/surgery_step/proc/success", function success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ succeeds!", [live(user)]), "<span class='notice'>You succeed.</span>"]);
	return 1;
});

// /datum/surgery_step/proc/failure  (code/modules/surgery/surgery_step.dm:83)
rt.def("/datum/surgery_step/proc/failure", function failure(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ screws up!</span>", [live(user)]), "<span class='warning'>You screw up!</span>"]);
	return 0;
});
