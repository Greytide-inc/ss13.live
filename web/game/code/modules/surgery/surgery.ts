// From code/modules/surgery/surgery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1308, "/datum/surgery", "/datum", {
	name: "surgery",
	status: 1,
	steps: null,
	step_in_progress: 0,
	can_cancel: 1,
	location: "chest",
	requires_organic_bodypart: 1,
	possible_locs: null,
	ignore_clothes: 0,
	target: null,
	operated_bodypart: null,
	requires_bodypart: 1,
	success_multiplier: 0,
	requires_real_bodypart: 0,
	species: null,
});

// /datum/surgery/proc/<init>  (code/modules/surgery/surgery.dm:4)
rt.def("/datum/surgery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list());
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list());
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/surgery/proc/New  (code/modules/surgery/surgery.dm:19)
rt.def("/datum/surgery/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.setSv(f, "target", live(f.args[0]));
	rt.modField(f, rt.sv(f, "target"), "surgeries", live(f.src), add);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "location", live(f.args[1]));
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	rt.setSv(f, "operated_bodypart", live(f.args[2]));
	return f.dot;
}, false, { args: ["surgery_target", "surgery_location", "surgery_bodypart"] });

// /datum/surgery/proc/Destroy  (code/modules/surgery/surgery.dm:30)  may sleep
rt.def("/datum/surgery/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "target"))) {
		(rt.modField(f, rt.sv(f, "target"), "surgeries", live(f.src), subtract));
	}
	rt.setSv(f, "target", null);
	rt.setSv(f, "operated_bodypart", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/surgery/proc/next_step  (code/modules/surgery/surgery.dm:46)  may sleep
rt.def("/datum/surgery/proc/next_step", function* next_step(f: Frame, user: Value) {
	let S: Value = null;
	f.vars = () => [user, S];
	if (truthy(rt.sv(f, "step_in_progress"))) {
		return 1;
	}
	if (truthy((S = (yield* g.srcCall(f, "get_surgery_step"))))) {
		if (truthy((yield* g.callName(f, live(S), "try_op", [live(user), rt.sv(f, "target"), rt.fv(f, "zone_selected", live(user)), (yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src)])))) {
			return 1;
		}
	}
	return 0;
}, true);

// /datum/surgery/proc/get_surgery_step  (code/modules/surgery/surgery.dm:53)  may sleep
rt.def("/datum/surgery/proc/get_surgery_step", function* get_surgery_step(f: Frame) {
	let step_type: Value = null;
	f.vars = () => [step_type];
	step_type = rt.index(rt.sv(f, "steps"), rt.sv(f, "status"));
	return (yield* g.new_(f, live(step_type), []));
}, true);

// /datum/surgery/proc/complete  (code/modules/surgery/surgery.dm:57)  may sleep
rt.def("/datum/surgery/proc/complete", function* complete(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/surgery/proc/get_propability_multiplier  (code/modules/surgery/surgery.dm:63)
rt.def("/datum/surgery/proc/get_propability_multiplier", function get_propability_multiplier(f: Frame) {
	let propability: Value = null, _T: Value = null;
	f.vars = () => [propability, _T];
	propability = 0.5;
	_T = rt.getStep(f, rt.sv(f, "target"), 0);
	if (truthy(rt.locateIn(f, T("/obj/structure/table/optable"), live(_T)))) {
		propability = 1;
	} else {
		if (truthy(rt.locateIn(f, T("/obj/structure/table"), live(_T)))) {
			propability = 0.800000011920929;
		} else {
			if (truthy(rt.locateIn(f, T("/obj/structure/bed"), live(_T)))) {
				propability = 0.699999988079071;
			}
		}
	}
	return add(live(propability), rt.sv(f, "success_multiplier"));
});
