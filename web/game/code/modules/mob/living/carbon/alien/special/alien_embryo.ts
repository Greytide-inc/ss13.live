// From code/modules/mob/living/carbon/alien/special/alien_embryo.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9458, "/obj/item/organ/body_egg/alien_embryo", "/obj/item/organ/body_egg", {
	stage: 0,
	bursting: 0,
	name: "alien embryo",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "larva0_dead",
});

// /obj/item/organ/body_egg/alien_embryo/proc/on_find  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:11)  may sleep
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/on_find", function* on_find(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (rt.lt(rt.sv(f, "stage"), 4)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's small and weak, barely the size of a foetus."]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's grown quite large, and writhes slightly as you look at it."]);
		if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
		yield* g.srcCall(f, "AttemptGrow", 0);
	}
	return f.dot;
}, true, { args: ["finder"] });

// /obj/item/organ/body_egg/alien_embryo/proc/prepare_eat  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:20)  may sleep
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, rt.gv(f, "reagents", (S = (yield* g.callSuper(f, [], rt.Args.Same)))), "add_reagent", ["sacid", 10]);
	return live(S);
}, true);

// /obj/item/organ/body_egg/alien_embryo/proc/on_life  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:25)  may sleep
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/on_life", function* on_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "stage");
	if ($0 === 2 || $0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "owner"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "owner"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>Your throat feels sore.</span>"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>Mucous runs down the back of your throat.</span>"]);
		}
	} else if ($0 === 4) {
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "owner"), "emote", ["sneeze"]);
		}
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.callName(f, rt.sv(f, "owner"), "emote", ["cough"]);
		}
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>Your muscles ache.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "owner"), "take_bodypart_damage", [1]);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [4]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>Your stomach hurts.</span>"]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [1]);
			}
		}
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>You feel something tearing its way out of your stomach...</span>"]);
		yield* g.callName(f, rt.sv(f, "owner"), "adjustToxLoss", [10]);
	}
	return f.dot;
}, true);

// /obj/item/organ/body_egg/alien_embryo/proc/egg_process  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:53)  may sleep
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/egg_process", function* egg_process(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if ((rt.lt(rt.sv(f, "stage"), 5) && truthy(rt.op(f, "Prob", [], [3])))) {
		rt.incSrcVar(f, "stage", 1, true);
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/organ/body_egg/proc/RefreshInfectionImage")]);
	}
	if (!(isEqual(rt.sv(f, "stage"), 5) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	S = null;
	rt.forList(f, 0, rt.fv(f, "surgeries", rt.sv(f, "owner")), T("/datum/surgery"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((isEqual(rt.fv(f, "location", live(S)), "chest") && truthy((rt.istype((yield* g.callName(f, live(S), "get_surgery_step", [])), T("/datum/surgery_step/manipulate_organs")) ? 1 : 0)))) {
			yield* g.srcCall(f, "AttemptGrow", 0);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "AttemptGrow");
	return f.dot;
}, true);

// /obj/item/organ/body_egg/alien_embryo/proc/AttemptGrow  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:67)  may sleep
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/AttemptGrow", function* AttemptGrow(f: Frame, gib_on_success: Value) {
	let candidates: Value = null, ghost: Value = null, overlay: Value = null, xeno_loc: Value = null, new_xeno: Value = null;
	f.vars = () => [gib_on_success, candidates, ghost, overlay, xeno_loc, new_xeno];
	if (live(gib_on_success) === null) {
		gib_on_success = 1;
	}
	if ((!truthy(rt.sv(f, "owner")) || truthy(rt.sv(f, "bursting")))) {
		return live(f.dot);
	}
	rt.setSv(f, "bursting", 1);
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you want to play as an alien larva that will burst out of ＀?", [rt.sv(f, "owner")]), "xenomorph", null, "xenomorph", 100, "alien_larva"]));
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.len(f, live(candidates))) || !truthy(rt.sv(f, "owner")))) {
		rt.setSv(f, "bursting", 0);
		rt.setSv(f, "stage", 4);
		return live(f.dot);
	}
	ghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
	overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/alien.dmi"), "burst_lie"]));
	yield* g.callName(f, rt.sv(f, "owner"), "add_overlay", [live(overlay)]);
	xeno_loc = rt.getStep(f, rt.sv(f, "owner"), 0);
	rt.setFv(f, "key", (new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/larva"), [live(xeno_loc)]))), rt.fv(f, "key", live(ghost)));
	rt.op(f, "Output", [], [live(new_xeno), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/voice/hiss5.ogg"), 0, 0, 0, 100]))], false);
	rt.setFv(f, "canmove", live(new_xeno), 0);
	rt.setFv(f, "notransform", live(new_xeno), 1);
	rt.setFv(f, "invisibility", live(new_xeno), 100);
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(rt.sv(f, "owner")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))))) {
		return live(f.dot);
	}
	if (truthy(live(new_xeno))) {
		rt.setFv(f, "canmove", live(new_xeno), 1);
		rt.setFv(f, "notransform", live(new_xeno), 0);
		rt.setFv(f, "invisibility", live(new_xeno), 0);
	}
	if (truthy(live(gib_on_success))) {
		yield* g.callName(f, live(new_xeno), "visible_message", [fmt("<span class='danger'>＀ bursts out of ＀ in a shower of gore!</span>", [live(new_xeno), rt.sv(f, "owner")]), fmt("<span class='userdanger'>You exit ＀, your previous host.</span>", [rt.sv(f, "owner")]), "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
		yield* g.callName(f, rt.sv(f, "owner"), "gib", [1]);
	} else {
		yield* g.callName(f, live(new_xeno), "visible_message", [fmt("<span class='danger'>＀ wriggles out of ＀!</span>", [live(new_xeno), rt.sv(f, "owner")]), fmt("<span class='userdanger'>You exit ＀, your previous host.</span>", [rt.sv(f, "owner")])]);
		yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [40]);
		yield* g.callName(f, rt.sv(f, "owner"), "cut_overlay", [live(overlay)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/organ/body_egg/alien_embryo/proc/AddInfectionImages  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:120)
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/AddInfectionImages", function AddInfectionImages(f: Frame) {
	let alien: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [alien, I, $e];
	alien = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/alien"));
	while (($e = rt.next(f, 0)) !== undefined) {
		alien = $e;
		if (truthy(rt.fv(f, "client", live(alien)))) {
			I = rt.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/alien.dmi"), "loc", rt.sv(f, "owner"), "icon_state", fmt("infected＀", [rt.sv(f, "stage")])], rt.Args.Named);
			rt.modField(f, rt.fv(f, "client", live(alien)), "images", live(I), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/organ/body_egg/alien_embryo/proc/RemoveInfectionImages  (code/modules/mob/living/carbon/alien/special/alien_embryo.dm:130)  may sleep
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/RemoveInfectionImages", function* RemoveInfectionImages(f: Frame) {
	let alien: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [alien, I, $e];
	alien = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/alien"));
	while (($e = rt.next(f, 0)) !== undefined) {
		alien = $e;
		if (truthy(rt.fv(f, "client", live(alien)))) {
			I = null;
			rt.forList(f, 1, rt.gv(f, "images", rt.fv(f, "client", live(alien))), T("/image"));
			while (($e = rt.next(f, 1)) !== undefined) {
				I = $e;
				if ((truthy((yield* g.call(f, P("/proc/dd_hasprefix_case"), null, [rt.fv(f, "icon_state", live(I)), "infected"]))) && isEqual(rt.fv(f, "loc", live(I)), rt.sv(f, "owner")))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
