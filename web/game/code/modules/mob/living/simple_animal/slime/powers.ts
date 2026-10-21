// From code/modules/mob/living/simple_animal/slime/powers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(165, "/datum/action/innate/slime", "/datum/action/innate", {
	needs_growth: 0,
	check_flags: 8,
	background_icon_state: "bg_alien",
});

// /datum/action/innate/slime/proc/IsAvailable  (code/modules/mob/living/simple_animal/slime/powers.dm:14)
rt.def("/datum/action/innate/slime/proc/IsAvailable", function IsAvailable(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	S = rt.sv(f, "owner");
	if (isEqual(rt.sv(f, "needs_growth"), 1)) {
		if (rt.ge(rt.fv(f, "amount_grown", live(S)), 10)) {
			return 1;
		}
		return 0;
	}
	return 1;
});

// /mob/living/simple_animal/slime/verb/Feed  (code/modules/mob/living/simple_animal/slime/powers.dm:29)  may sleep
rt.def("/mob/living/simple_animal/slime/verb/Feed", function* Feed(f: Frame) {
	let choices: Value = null, C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [choices, C, M, $e];
	if (truthy(rt.sv(f, "stat"))) {
		return 0;
	}
	choices = rt.list();
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((!isEqual(live(C), live(f.src)) && truthy((yield* g.srcCall(f, "Adjacent", live(C)))))) {
			choices = rt.modify(live(choices), live(C), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((M = (yield* g.op(f, "Prompt", [0], [null, null, "Who do you wish to feed on?", live(f.src), rt.bitOr(null, live(choices))]))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "CanFeedon", live(M))))) return f.dot;
	yield* g.srcCall(f, "Feedon", live(M));
	return 1;
}, true, { verb: { category: "Slime", desc: "This will let you feed on any valid creature in the surrounding area. This should also be used to halt the feeding process." } });

rt.type(166, "/datum/action/innate/slime/feed", "/datum/action/innate/slime", {
	name: "Feed",
	button_icon_state: "slimeeat",
});

// /datum/action/innate/slime/feed/proc/Activate  (code/modules/mob/living/simple_animal/slime/powers.dm:47)  may sleep
rt.def("/datum/action/innate/slime/feed/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, (S = rt.sv(f, "owner")), "Feed", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/CanFeedon  (code/modules/mob/living/simple_animal/slime/powers.dm:51)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/CanFeedon", function* CanFeedon(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(M))))) {
		return 0;
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.srcCall(f, "Feedstop");
		return 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'><i>I can't latch onto another slime...</i></span>"]);
		return 0;
	}
	if (truthy(rt.sv(f, "docile"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'><i>I'm not hungry anymore...</i></span>"]);
		return 0;
	}
	if (truthy(rt.sv(f, "stat"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'><i>I must be conscious to do this...</i></span>"]);
		return 0;
	}
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'><i>This subject does not have a strong enough life energy...</i></span>"]);
		return 0;
	}
	if (truthy(rt.locateIn(f, T("/mob/living/simple_animal/slime"), rt.fv(f, "buckled_mobs", live(M))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'><i>Another slime is already feeding on this subject...</i></span>"]);
		return 0;
	}
	return 1;
}, true);

// /mob/living/simple_animal/slime/proc/Feedon  (code/modules/mob/living/simple_animal/slime/powers.dm:80)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Feedon", function* Feedon(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "unbuckle_all_mobs", ["force", 1], rt.Args.Named);
	if (truthy((yield* g.callName(f, live(M), "buckle_mob", [null, live(f.src), "force", 1], rt.Args.Named)))) {
		rt.setSv(f, "layer", add(rt.fv(f, "layer", live(M)), 0.009999999776482582));
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ has latched onto ＀!</span>", [rt.sv(f, "name"), live(M)]), fmt("<span class='userdanger'>＀ has latched onto ＀!</span>", [rt.sv(f, "name"), live(M)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'><i>I have failed to latch onto the subject!</i></span>"]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/Feedstop  (code/modules/mob/living/simple_animal/slime/powers.dm:90)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Feedstop", function* Feedstop(f: Frame, silent: Value, living: Value) {
	f.vars = () => [silent, living];
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(living) === null) {
		living = 1;
	}
	if (!truthy(rt.sv(f, "buckled"))) return f.dot;
	if (!truthy(live(living))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＀!</span>", [rt.op(f, "PickUnweighted", [7], ["This subject is incompatible", "This subject does not have life energy", "This subject is empty", "I am not satisified", "I can not feed from this subject", "I do not feel nourished", "This subject is not food"])])]);
	}
	if (!truthy(live(silent))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ has let go of ＀!</span>", [live(f.src), rt.sv(f, "buckled")]), "<span class='notice'><i>I stopped feeding.</i></span>");
	}
	rt.setSv(f, "layer", rt.initial(f, live(f.src), "layer"));
	yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/verb/Evolve  (code/modules/mob/living/simple_animal/slime/powers.dm:106)  may sleep
rt.def("/mob/living/simple_animal/slime/verb/Evolve", function* Evolve(f: Frame) {
	let E: Value = null;
	let $e: any;
	f.vars = () => [E, $e];
	if (truthy(rt.sv(f, "stat"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I must be conscious to do this...</i>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "is_adult"))) {
		if (rt.ge(rt.sv(f, "amount_grown"), 10)) {
			rt.setSv(f, "is_adult", 1);
			rt.setSv(f, "maxHealth", 200);
			rt.setSv(f, "amount_grown", 0);
			E = null;
			rt.forList(f, 0, rt.sv(f, "actions"), T("/datum/action/innate/slime/evolve"));
			while (($e = rt.next(f, 0)) !== undefined) {
				E = $e;
				yield* g.callName(f, live(E), "Remove", [live(f.src)]);
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "regenerate_icons");
			yield* g.srcCall(f, "update_name");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I am not ready to evolve yet...</i>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I have already evolved...</i>"]);
	}
	return f.dot;
}, true, { verb: { category: "Slime", desc: "This will let you evolve from baby to adult slime." } });

rt.type(167, "/datum/action/innate/slime/evolve", "/datum/action/innate/slime", {
	needs_growth: 1,
	name: "Evolve",
	button_icon_state: "slimegrow",
});

// /datum/action/innate/slime/evolve/proc/Activate  (code/modules/mob/living/simple_animal/slime/powers.dm:128)  may sleep
rt.def("/datum/action/innate/slime/evolve/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null, A: Value = null;
	f.vars = () => [S, A];
	yield* g.callName(f, (S = rt.sv(f, "owner")), "Evolve", []);
	if (!truthy(rt.fv(f, "is_adult", live(S)))) return f.dot;
	yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/action/innate/slime/reproduce"), []))), "Grant", [live(S)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/verb/Reproduce  (code/modules/mob/living/simple_animal/slime/powers.dm:139)  may sleep
rt.def("/mob/living/simple_animal/slime/verb/Reproduce", function* Reproduce(f: Frame) {
	let babies: Value = null, new_nutrition: Value = null, new_powerlevel: Value = null, i: Value = null, child_colour: Value = null, M: Value = null, new_slime: Value = null;
	f.vars = () => [babies, new_nutrition, new_powerlevel, i, child_colour, M, new_slime];
	if (truthy(rt.sv(f, "stat"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I must be conscious to do this...</i>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "is_adult"))) {
		if (rt.ge(rt.sv(f, "amount_grown"), 10)) {
			if (truthy(rt.sv(f, "stat"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I must be conscious to do this...</i>"]);
				return live(f.dot);
			}
			babies = rt.list();
			new_nutrition = (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "nutrition"), 0.8999999761581421)]));
			new_powerlevel = (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "powerlevel"), 4)]));
			i = null;
			i = 1;
			while (rt.le(live(i), 4)) {
				child_colour = null;
				if (rt.ge(rt.sv(f, "mutation_chance"), 100)) {
					child_colour = "rainbow";
				} else {
					if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "mutation_chance")]))) {
						child_colour = rt.index(rt.sv(f, "slime_mutation"), (yield* g.call(f, P("/proc/rand"), null, [1, 4])));
					} else {
						child_colour = rt.sv(f, "colour");
					}
				}
				M = null;
				M = (yield* g.new_(f, T("/mob/living/simple_animal/slime"), [rt.sv(f, "loc"), live(child_colour)]));
				if (truthy(rt.sv(f, "ckey"))) {
					rt.setFv(f, "nutrition", live(M), live(new_nutrition));
				}
				rt.setFv(f, "powerlevel", live(M), live(new_powerlevel));
				if (!isEqual(live(i), 1)) {
					yield* g.call(f, P("/proc/step_away"), null, [live(M), live(f.src)]);
				}
				rt.setFv(f, "Friends", live(M), (yield* g.callName(f, rt.sv(f, "Friends"), "Copy", [])));
				babies = rt.modify(live(babies), live(M), add);
				rt.setFv(f, "mutation_chance", live(M), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "mutation_chance"), (yield* g.call(f, P("/proc/rand"), null, [5, -5]))), 100]))])));
				i = rt.inc(live(i), 1);
			}
			rt.setFv(f, "a_intent", (new_slime = rt.op(f, "PickUnweighted", [1], [live(babies)])), "harm");
			if (truthy(rt.fv(f, "mind", live(f.src)))) {
				yield* g.callName(f, rt.fv(f, "mind", live(f.src)), "transfer_to", [live(new_slime)]);
			} else {
				rt.setFv(f, "key", live(new_slime), rt.fv(f, "key", live(f.src)));
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I am not ready to reproduce yet...</i>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I am not old enough to reproduce yet...</i>"]);
	}
	return f.dot;
}, true, { verb: { category: "Slime", desc: "This will make you split into four Slimes." } });

rt.type(168, "/datum/action/innate/slime/reproduce", "/datum/action/innate/slime", {
	needs_growth: 1,
	name: "Reproduce",
	button_icon_state: "slimesplit",
});

// /datum/action/innate/slime/reproduce/proc/Activate  (code/modules/mob/living/simple_animal/slime/powers.dm:189)  may sleep
rt.def("/datum/action/innate/slime/reproduce/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, (S = rt.sv(f, "owner")), "Reproduce", []);
	return f.dot;
}, true);
