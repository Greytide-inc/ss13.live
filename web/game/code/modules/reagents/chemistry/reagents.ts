// From code/modules/reagents/chemistry/reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3356, "/datum/reagent", "/datum", {
	name: "Reagent",
	id: "reagent",
	description: "",
	taste_description: "metaphorical salt",
	taste_mult: 1,
	glass_name: "glass of ...what?",
	glass_desc: "You can't really tell what this is.",
	glass_icon_state: null,
	shot_glass_icon_state: null,
	holder: null,
	reagent_state: 2,
	data: null,
	current_cycle: 0,
	volume: 0,
	color: "#000000",
	can_synth: 1,
	metabolization_rate: 0.4,
	overrides_metab: 0,
	overdose_threshold: 0,
	addiction_threshold: 0,
	addiction_stage: 0,
	overdosed: 0,
});

// /datum/reagent/proc/Destroy  (code/modules/reagents/chemistry/reagents.dm:36)  may sleep
rt.def("/datum/reagent/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "holder", null);
	return f.dot;
}, true);

// /datum/reagent/proc/reaction_mob  (code/modules/reagents/chemistry/reagents.dm:40)  may sleep
rt.def("/datum/reagent/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	let modifier: Value = null, amount: Value = null;
	f.vars = () => [M, method, reac_volume, show_message, touch_protection, modifier, amount];
	if (live(method) === null) {
		method = 1;
	}
	if (live(show_message) === null) {
		show_message = 1;
	}
	if (live(touch_protection) === null) {
		touch_protection = 0;
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	if (isEqual(live(method), 3)) {
		if (truthy(rt.fv(f, "reagents", live(M)))) {
			modifier = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [subtract(1, live(touch_protection)), 1]))]));
			if (rt.ge((amount = (yield* g.call(f, P("/proc/round"), null, [multiply(live(reac_volume), live(modifier)), 0.10000000149011612]))), 0.5)) {
				yield* g.callName(f, rt.fv(f, "reagents", live(M)), "add_reagent", [rt.sv(f, "id"), live(amount)]);
			}
		}
	}
	return 1;
}, true);

// /datum/reagent/proc/on_mob_life  (code/modules/reagents/chemistry/reagents.dm:57)  may sleep
rt.def("/datum/reagent/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	f.vars = () => [M];
	rt.incSrcVar(f, "current_cycle", 1, true);
	yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.fv(f, "id", live(f.src)), multiply(rt.sv(f, "metabolization_rate"), rt.fv(f, "metabolism_efficiency", live(M)))]);
	return live(f.dot);
}, true);

// /datum/reagent/proc/overdose_start  (code/modules/reagents/chemistry/reagents.dm:92)
rt.def("/datum/reagent/proc/overdose_start", function overdose_start(f: Frame, M: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>You feel like you took too much of ＀!</span>", [rt.sv(f, "name")])]);
	return live(f.dot);
});

// /datum/reagent/proc/addiction_act_stage1  (code/modules/reagents/chemistry/reagents.dm:96)
rt.def("/datum/reagent/proc/addiction_act_stage1", function addiction_act_stage1(f: Frame, M: Value) {
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>You feel like some ＀ right about now.</span>", [rt.sv(f, "name")])]);
	}
	return live(f.dot);
});

// /datum/reagent/proc/addiction_act_stage2  (code/modules/reagents/chemistry/reagents.dm:101)
rt.def("/datum/reagent/proc/addiction_act_stage2", function addiction_act_stage2(f: Frame, M: Value) {
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>You feel like you need ＀. You just can't get enough.</span>", [rt.sv(f, "name")])]);
	}
	return live(f.dot);
});

// /datum/reagent/proc/addiction_act_stage3  (code/modules/reagents/chemistry/reagents.dm:106)
rt.def("/datum/reagent/proc/addiction_act_stage3", function addiction_act_stage3(f: Frame, M: Value) {
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='danger'>You have an intense craving for ＀.</span>", [rt.sv(f, "name")])]);
	}
	return live(f.dot);
});

// /datum/reagent/proc/addiction_act_stage4  (code/modules/reagents/chemistry/reagents.dm:111)
rt.def("/datum/reagent/proc/addiction_act_stage4", function addiction_act_stage4(f: Frame, M: Value) {
	if (truthy(rt.op(f, "Prob", [], [30]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='boldannounce'>You're not feeling good at all! You really need some ＀.</span>", [rt.sv(f, "name")])]);
	}
	return live(f.dot);
});

// /proc/pretty_string_from_reagent_list  (code/modules/reagents/chemistry/reagents.dm:117)
rt.def("/proc/pretty_string_from_reagent_list", function pretty_string_from_reagent_list(f: Frame, reagent_list: Value) {
	let result: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [result, R, $e];
	result = "| ";
	R = null;
	rt.forList(f, 0, live(reagent_list), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		result = rt.modify(live(result), fmt("＀, ＀ | ", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
	}
	rt.endFor(f, 0);
	return live(result);
});
