// From code/modules/mob/living/carbon/human/species_types/angel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4077, "/datum/species/angel", "/datum/species", {
	fly: null,
	name: "Angel",
	id: "angel",
	default_color: "FFFFFF",
	species_traits: null,
	mutant_bodyparts: null,
	default_features: null,
	use_skintones: 1,
	no_equip: null,
	blacklisted: 1,
	limbs_id: "human",
	skinned_type: rt.typePath("/obj/item/stack/sheet/animalhide/human"),
});

// /datum/species/angel/proc/<init>  (code/modules/mob/living/carbon/human/species_types/angel.dm:7)
rt.def("/datum/species/angel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(4, 2, 3, 5));
	rt.setSv(f, "mutant_bodyparts", rt.list("tail_human", "ears", "wings"));
	rt.setSv(f, "default_features", rt.alist(f, ["mcolor", "FFF", "tail_human", "None", "ears", "None", "wings", "Angel"]));
	$0 = $0;
	rt.setSv(f, "no_equip", rt.list(1));
	return f.dot;
});

// /datum/species/angel/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/angel.dm:17)  may sleep
rt.def("/datum/species/angel/proc/on_species_gain", function* on_species_gain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.fv(f, "dna", live(f.args[0]))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))))) && (!isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "wings"), "Angel") && truthy((rt.isIn(f, "wings", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))))) ? 1 : 0))))) {
		rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "wings", "Angel");
		yield* g.callName(f, live(f.args[0]), "update_body", []);
	}
	if (!(truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(rt.sv(f, "fly")))) return f.dot;
	rt.setSv(f, "fly", (yield* g.new_(f, T("/datum/action/innate/flight"), [])));
	yield* g.callName(f, rt.sv(f, "fly"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["H", "old_species"] });

// /datum/species/angel/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/angel.dm:28)  may sleep
rt.def("/datum/species/angel/proc/on_species_loss", function* on_species_loss(f: Frame) {
	if (truthy(rt.sv(f, "fly"))) {
		yield* g.callName(f, rt.sv(f, "fly"), "Remove", [live(f.args[0])]);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(f.args[0])), 2))) {
		(rt.modField(f, live(f.args[0]), "movement_type", 16777213, rt.bitAnd));
	}
	yield* g.srcCall(f, "ToggleFlight", live(f.args[0]), 0);
	if (((truthy(rt.fv(f, "dna", live(f.args[0]))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))))) && (!isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "wings"), "None") && truthy((rt.isIn(f, "wings", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))))) ? 1 : 0))))) {
		rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(f.args[0]))), "wings", "None");
		yield* g.callName(f, live(f.args[0]), "update_body", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

// /datum/species/angel/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/angel.dm:38)  may sleep
rt.def("/datum/species/angel/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	f.vars = () => [H];
	yield* g.srcCall(f, "HandleFlight", live(H));
	return f.dot;
}, true);

// /datum/species/angel/proc/HandleFlight  (code/modules/mob/living/carbon/human/species_types/angel.dm:41)  may sleep
rt.def("/datum/species/angel/proc/HandleFlight", function* HandleFlight(f: Frame, H: Value) {
	f.vars = () => [H];
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(H)), 2))) {
		if (!truthy((yield* g.srcCall(f, "CanFly", live(H))))) {
			yield* g.srcCall(f, "ToggleFlight", live(H), 0);
			return 0;
		}
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /datum/species/angel/proc/CanFly  (code/modules/mob/living/carbon/human/species_types/angel.dm:50)
rt.def("/datum/species/angel/proc/CanFly", function CanFly(f: Frame, H: Value) {
	let _T: Value = null, environment: Value = null;
	f.vars = () => [_T, environment];
	if (((truthy(rt.fv(f, "stat", live(H))) || truthy(rt.callName(f, live(H), "IsStun", []))) || truthy(rt.callName(f, live(H), "IsKnockdown", [])))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "wear_suit", live(H))) && (truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4)) && (!truthy(rt.gv(f, "species_exception", rt.fv(f, "wear_suit", live(H)))) || !truthy(rt.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.gv(f, "species_exception", rt.fv(f, "wear_suit", live(H)))])))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "Your suit blocks your wings from extending!"]);
		return 0;
	}
	if (!truthy((_T = rt.getStep(f, live(H), 0)))) {
		return 0;
	}
	if ((truthy((environment = rt.callName(f, live(_T), "return_air", []))) && !rt.gt(rt.callName(f, live(environment), "return_pressure", []), 30))) {
		rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>The atmosphere is too thin for you to fly!</span>"]);
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

rt.type(149, "/datum/action/innate/flight", "/datum/action/innate", {
	name: "Toggle Flight",
	check_flags: 10,
	button_icon_state: "flight",
});

// /datum/action/innate/flight/proc/Activate  (code/modules/mob/living/carbon/human/species_types/angel.dm:72)  may sleep
rt.def("/datum/action/innate/flight/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null, A: Value = null;
	f.vars = () => [H, A];
	H = rt.sv(f, "owner");
	if (!truthy((yield* g.callName(f, (A = rt.gv(f, "species", rt.fv(f, "dna", live(H)))), "CanFly", [live(H)])))) return f.dot;
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(H)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You settle gently back onto the ground...</span>"]);
		yield* g.callName(f, live(A), "ToggleFlight", [live(H), 0]);
		yield* g.callName(f, live(H), "update_canmove", []);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You beat your wings and begin to hover gently above the ground...</span>"]);
		rt.setFv(f, "resting", live(H), 0);
		yield* g.callName(f, live(A), "ToggleFlight", [live(H), 1]);
		yield* g.callName(f, live(H), "update_canmove", []);
	}
	return f.dot;
}, true);

// /datum/species/angel/proc/flyslip  (code/modules/mob/living/carbon/human/species_types/angel.dm:87)  may sleep
rt.def("/datum/species/angel/proc/flyslip", function* flyslip(f: Frame, H: Value) {
	let buckled_obj: Value = null, I: Value = null, olddir: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [H, buckled_obj, I, olddir, i, $e];
	buckled_obj = null;
	if (truthy(rt.fv(f, "buckled", live(H)))) {
		buckled_obj = rt.fv(f, "buckled", live(H));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Your wings spazz out and launch you!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(H)), rt.rsc("sound/misc/slip.ogg"), 50, 1, -3]);
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(H), "accident", [live(I)]);
	}
	rt.endFor(f, 0);
	olddir = rt.fv(f, "dir", live(H));
	yield* g.callName(f, live(H), "stop_pulling", []);
	if (truthy(live(buckled_obj))) {
		yield* g.callName(f, live(buckled_obj), "unbuckle_mob", [live(H)]);
		yield* g.call(f, P("/proc/step"), null, [live(buckled_obj), live(olddir)]);
	} else {
		i = null;
		i = 1;
		while (rt.lt(live(i), 5)) {
			rt.spawnTail(f, live(i), "/datum/species/angel/proc/flyslip: spawn at modules/mob/living/carbon/human/species_types/angel.dm:105", H, buckled_obj, I, olddir, i);
			i = rt.inc(live(i), 1);
		}
	}
	return 1;
}, true);

// a spawn(live(i)) body of /datum/species/angel/proc/flyslip, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/species/angel/proc/flyslip: spawn at modules/mob/living/carbon/human/species_types/angel.dm:105", function* (f: Frame, H: Value, buckled_obj: Value, I: Value, olddir: Value, i: Value) {
	f.vars = () => [H, buckled_obj, I, olddir, i];
	yield* g.call(f, P("/proc/step"), null, [live(H), live(olddir)]);
	yield* g.callName(f, live(H), "spin", [1, 1]);
	return null;
});

// /datum/species/angel/proc/spec_stun  (code/modules/mob/living/carbon/human/species_types/angel.dm:112)  may sleep
rt.def("/datum/species/angel/proc/spec_stun", function* spec_stun(f: Frame) {
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(f.args[0])), 2))) {
		yield* g.srcCall(f, "ToggleFlight", live(f.args[0]), 0);
		yield* g.srcCall(f, "flyslip", live(f.args[0]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["H", "amount"] });

// /datum/species/angel/proc/negates_gravity  (code/modules/mob/living/carbon/human/species_types/angel.dm:118)
rt.def("/datum/species/angel/proc/negates_gravity", function negates_gravity(f: Frame, H: Value) {
	if (!truthy(rt.bitAnd(rt.fv(f, "movement_type", live(H)), 2))) return f.dot;
	return 1;
});

// /datum/species/angel/proc/space_move  (code/modules/mob/living/carbon/human/species_types/angel.dm:122)
rt.def("/datum/species/angel/proc/space_move", function space_move(f: Frame, H: Value) {
	if (!truthy(rt.bitAnd(rt.fv(f, "movement_type", live(H)), 2))) return f.dot;
	return 1;
});

// /datum/species/angel/proc/ToggleFlight  (code/modules/mob/living/carbon/human/species_types/angel.dm:126)  may sleep
rt.def("/datum/species/angel/proc/ToggleFlight", function* ToggleFlight(f: Frame, H: Value, flight: Value) {
	f.vars = () => [H, flight];
	if ((truthy(live(flight)) && truthy((yield* g.srcCall(f, "CanFly", live(H)))))) {
		rt.setSv(f, "stunmod", 2);
		rt.setSv(f, "speedmod", -1);
		(rt.modField(f, live(H), "movement_type", 2, rt.bitOr));
		rt.setSv(f, "override_float", 1);
		(rt.modField(f, live(H), "pass_flags", 1, rt.bitOr));
		yield* g.callName(f, live(H), "OpenWings", []);
	} else {
		rt.setSv(f, "stunmod", 1);
		rt.setSv(f, "speedmod", 0);
		(rt.modField(f, live(H), "movement_type", 16777213, rt.bitAnd));
		rt.setSv(f, "override_float", 0);
		(rt.modField(f, live(H), "pass_flags", 16777214, rt.bitAnd));
		yield* g.callName(f, live(H), "CloseWings", []);
	}
	return f.dot;
}, true);
