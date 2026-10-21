// From code/modules/mob/living/carbon/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/death  (code/modules/mob/living/carbon/death.dm:2)  may sleep
rt.def("/mob/living/carbon/proc/death", function* death(f: Frame) {
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	rt.setSv(f, "silent", 0);
	rt.setSv(f, "losebreath", 0);
	if (!truthy(live(f.args[0]))) {
		yield* g.srcCall(f, "emote", "deathgasp");
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.gl("SSticker")) && truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "check_win", []);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/carbon/proc/gib  (code/modules/mob/living/carbon/death.dm:16)  may sleep
rt.def("/mob/living/carbon/proc/gib", function* gib(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, live(f.src), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "stomach_contents")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "stomach_contents"), "Remove", [live(M)]);
		}
		yield* g.callName(f, live(M), "forceMove", [rt.sv(f, "loc")]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bursts out of ＀!</span>", [live(M), live(f.src)]));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["no_brain", "no_organs", "no_bodyparts"] });

// /mob/living/carbon/proc/spill_organs  (code/modules/mob/living/carbon/death.dm:24)  may sleep
rt.def("/mob/living/carbon/proc/spill_organs", function* spill_organs(f: Frame, no_brain: Value, no_organs: Value, no_bodyparts: Value) {
	let X: Value = null, O: Value = null, org_zone: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [no_brain, no_organs, no_bodyparts, X, O, org_zone, I, $e];
	if (!truthy(live(no_bodyparts))) {
		if (truthy(live(no_organs))) {
			X = null;
			rt.forList(f, 0, rt.sv(f, "internal_organs"));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				if ((truthy(live(no_brain)) || !truthy((rt.istype(live(X), T("/obj/item/organ/brain")) ? 1 : 0)))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(X)]);
				}
			}
			rt.endFor(f, 0);
		} else {
			X = null;
			rt.forList(f, 0, rt.sv(f, "internal_organs"));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				O = live(X);
				if ((truthy(live(no_brain)) && truthy((rt.istype(live(O), T("/obj/item/organ/brain")) ? 1 : 0)))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
					continue;
				}
				if (isEqual((org_zone = (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone", live(O))]))), "chest")) {
					yield* g.callName(f, live(O), "Remove", [live(f.src)]);
					yield* g.callName(f, live(O), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					yield* g.callName(f, live(O), "throw_at", [(yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])])), (yield* g.call(f, P("/proc/rand"), null, [1, 3])), 5]);
				}
			}
			rt.endFor(f, 0);
		}
	} else {
		X = null;
		rt.forList(f, 0, rt.sv(f, "internal_organs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			I = live(X);
			if ((truthy(live(no_brain)) && truthy((rt.istype(live(I), T("/obj/item/organ/brain")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
				continue;
			}
			if ((truthy(live(no_organs)) && !truthy((rt.istype(live(I), T("/obj/item/organ/brain")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
				continue;
			}
			yield* g.callName(f, live(I), "Remove", [live(f.src)]);
			yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			yield* g.callName(f, live(I), "throw_at", [(yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])])), (yield* g.call(f, P("/proc/rand"), null, [1, 3])), 5]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/spread_bodyparts  (code/modules/mob/living/carbon/death.dm:55)  may sleep
rt.def("/mob/living/carbon/proc/spread_bodyparts", function* spread_bodyparts(f: Frame) {
	let X: Value = null, BP: Value = null;
	let $e: any;
	f.vars = () => [X, BP, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (BP = live(X)), "drop_limb", []);
		yield* g.callName(f, live(BP), "throw_at", [(yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])])), (yield* g.call(f, P("/proc/rand"), null, [1, 3])), 5]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
