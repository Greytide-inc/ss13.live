// From code/modules/awaymissions/mission_code/wildwest.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10891, "/obj/machinery/wish_granter_dark", "/obj/machinery", {
	chargesa: 1,
	insistinga: 0,
	anchored: 1,
	use_power: 0,
	name: "Wish Granter",
	desc: "You're not so sure about this, anymore...",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	density: 1,
});

// /obj/machinery/wish_granter_dark/proc/attack_hand  (code/modules/awaymissions/mission_code/wildwest.dm:25)  may sleep
rt.def("/obj/machinery/wish_granter_dark/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let wish: Value = null, hijack: Value = null, F: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, wish, hijack, F, $0, $e];
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (rt.le(rt.sv(f, "chargesa"), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The Wish Granter lies silent."]);
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You feel a dark stirring inside of the Wish Granter, something you want nothing of. Your instincts are better than any man's."]);
			return live(f.dot);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Even to a heart as dark as yours, you know nothing good will come of this.  Something instinctual makes you pull away."]);
			} else {
				if (!truthy(rt.sv(f, "insistinga"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Your first touch makes the Wish Granter stir, listening to you.  Are you really sure you want to do this?"]);
					rt.incSrcVar(f, "insistinga", 1, true);
				} else {
					rt.incSrcVar(f, "chargesa", -1, true);
					rt.setSv(f, "insistinga", 0);
					$0 = (wish = (yield* g.op(f, "Prompt", [1], [null, null, "Wish", "You want...", rt.list("Power", "Wealth", "Immortality", "To Kill", "Peace")])));
					if ($0 === "Power") {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<B>Your wish is granted, but at a terrible cost...</B>"]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The Wish Granter punishes you for your selfishness, claiming your soul and warping your body to match the darkness in your heart."]);
						yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["Laser Eyes"]);
						yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["Cold Resistance"]);
						yield* g.callName(f, rt.fv(f, "dna", live(user)), "add_mutation", ["X Ray Vision"]);
						yield* g.callName(f, live(user), "set_species", [T("/datum/species/shadow")]);
					} else if ($0 === "Wealth") {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<B>Your wish is granted, but at a terrible cost...</B>"]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The Wish Granter punishes you for your selfishness, claiming your soul and warping your body to match the darkness in your heart."]);
						yield* g.new_(f, T("/obj/structure/closet/syndicate/resources/everything"), [rt.sv(f, "loc")]);
						yield* g.callName(f, live(user), "set_species", [T("/datum/species/shadow")]);
					} else if ($0 === "Immortality") {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<B>Your wish is granted, but at a terrible cost...</B>"]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The Wish Granter punishes you for your selfishness, claiming your soul and warping your body to match the darkness in your heart."]);
						rt.modField(f, live(user), "verbs", P("/mob/living/carbon/proc/immortality"), add);
						yield* g.callName(f, live(user), "set_species", [T("/datum/species/shadow")]);
					} else if ($0 === "To Kill") {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<B>Your wish is granted, but at a terrible cost...</B>"]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The Wish Granter punishes you for your wickedness, claiming your soul and warping your body to match the darkness in your heart."]);
						rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(user)), add);
						rt.setFv(f, "special_role", rt.fv(f, "mind", live(user)), "traitor");
						rt.setFv(f, "owner", (hijack = (yield* g.new_(f, T("/datum/objective/hijack"), []))), rt.fv(f, "mind", live(user)));
						rt.modField(f, rt.fv(f, "mind", live(user)), "objectives", live(hijack), add);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<B>Your inhibitions are swept away, the bonds of loyalty broken, you are free to murder as you please!</B>"]);
						yield* g.callName(f, rt.fv(f, "mind", live(user)), "announce_objectives", []);
						yield* g.callName(f, live(user), "set_species", [T("/datum/species/shadow")]);
					} else if ($0 === "Peace") {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<B>Whatever alien sentience that the Wish Granter possesses is satisfied with your wish. There is a distant wailing as the last of the Faithless begin to die, then silence.</B>"]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You feel as if you just narrowly avoided a terrible fate..."]);
						F = null;
						rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/hostile/faithless"));
						while (($e = rt.next(f, 0)) !== undefined) {
							F = $e;
							yield* g.callName(f, live(F), "death", []);
						}
						rt.endFor(f, 0);
					}
				}
			}
		}
	}
	return f.dot;
}, true);

rt.type(12046, "/obj/effect/meatgrinder", "/obj/effect", {
	triggered: 0,
	anchored: 1,
	name: "Meat Grinder",
	desc: "What is that thing?",
	density: 1,
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blobpod",
});

// /obj/effect/meatgrinder/proc/Crossed  (code/modules/awaymissions/mission_code/wildwest.dm:95)  may sleep
rt.def("/obj/effect/meatgrinder/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	yield* g.srcCall(f, "Bumped", live(AM));
	return f.dot;
}, true);

// /obj/effect/meatgrinder/proc/Bumped  (code/modules/awaymissions/mission_code/wildwest.dm:102)  may sleep
rt.def("/obj/effect/meatgrinder/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	let O: Value = null, s: Value = null;
	let $e: any;
	f.vars = () => [M, O, s, $e];
	if (truthy(rt.sv(f, "triggered"))) {
		return live(f.dot);
	}
	if (!((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(M)), 2)) && truthy(rt.fv(f, "ckey", live(M))))) return f.dot;
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [rt.fv(f, "view", rt.world()), rt.fv(f, "loc", live(f.src))])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ triggered the ＀!</span>", [live(M), live(f.src)]));
	rt.setSv(f, "triggered", 1);
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.call(f, P("/proc/explosion"), null, [live(M), 1, 0, 0, 0]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/proc/immortality  (code/modules/awaymissions/mission_code/wildwest.dm:119)  may sleep
rt.def("/mob/living/carbon/proc/immortality", function* immortality(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (!truthy(rt.gv(f, "stat", (C = live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='notice'>You're not dead yet!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(C), "has_status_effect", [T("/datum/status_effect/wish_granters_gift")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>You're already resurrecting!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(C), "apply_status_effect", [T("/datum/status_effect/wish_granters_gift")]);
	return 1;
}, true, { verb: { name: "Resurrection", category: "Immortality" } });
