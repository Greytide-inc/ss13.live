// From code/modules/zombie/items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10207, "/obj/item/zombie_hand", "/obj/item", {
	icon_left: "bloodhand_left",
	icon_right: "bloodhand_right",
	removing_airlock: 0,
	flags: 16514,
	hitsound: rt.rsc("sound/hallucinations/growl1.ogg"),
	name: "zombie claw",
	desc: "A zombie's claw is its primary tool, capable of infecting humans, butchering all other living things to sustain the zombie, smashing open airlock doors and opening child-safe caps on bottles.",
	resistance_flags: 115,
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "bloodhand_left",
	force: 20,
	damtype: "brute",
});

// /obj/item/zombie_hand/proc/equipped  (code/modules/zombie/items.dm:20)  may sleep
rt.def("/obj/item/zombie_hand/proc/equipped", function* equipped(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.modulus((i = (yield* g.callName(f, live(f.args[0]), "get_held_index_of_item", [live(f.src)]))), 2))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_left"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_right"));
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/zombie_hand/proc/afterattack  (code/modules/zombie/items.dm:29)  may sleep
rt.def("/obj/item/zombie_hand/proc/afterattack", function* afterattack(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.srcCall(f, "check_infection", live(f.args[0]), live(f.args[1]));
		} else {
			yield* g.srcCall(f, "check_feast", live(f.args[0]), live(f.args[1]));
		}
	}
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag"] });

// /obj/item/zombie_hand/proc/check_infection  (code/modules/zombie/items.dm:39)  may sleep
rt.def("/obj/item/zombie_hand/proc/check_infection", function* check_infection(f: Frame, target: Value, user: Value) {
	let infection: Value = null;
	f.vars = () => [target, user, infection];
	if ((!truthy(rt.fv(f, "dna", live(target))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(target)))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, 21, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(target))))) ? 1 : 0))) {
		return live(f.dot);
	}
	infection = null;
	if (truthy((infection = (yield* g.callName(f, live(target), "getorganslot", ["zombie_infection"]))))) return f.dot;
	yield* g.callName(f, (infection = (yield* g.new_(f, T("/obj/item/organ/zombie_infection"), []))), "Insert", [live(target)]);
	return f.dot;
}, true);

// /obj/item/zombie_hand/proc/check_feast  (code/modules/zombie/items.dm:53)  may sleep
rt.def("/obj/item/zombie_hand/proc/check_feast", function* check_feast(f: Frame, target: Value, user: Value) {
	let hp_gained: Value = null;
	f.vars = () => [target, user, hp_gained];
	if (!isEqual(rt.fv(f, "stat", live(target)), 2)) return f.dot;
	hp_gained = rt.fv(f, "maxHealth", live(target));
	yield* g.callName(f, live(target), "gib", []);
	yield* g.callName(f, live(user), "adjustBruteLoss", [rt.neg(live(hp_gained)), 0]);
	yield* g.callName(f, live(user), "adjustToxLoss", [rt.neg(live(hp_gained)), 0]);
	yield* g.callName(f, live(user), "adjustFireLoss", [rt.neg(live(hp_gained)), 0]);
	yield* g.callName(f, live(user), "adjustCloneLoss", [rt.neg(live(hp_gained)), 0]);
	yield* g.callName(f, live(user), "updatehealth", []);
	yield* g.callName(f, live(user), "adjustBrainLoss", [rt.neg(live(hp_gained))]);
	rt.setFv(f, "nutrition", live(user), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "nutrition", live(user)), live(hp_gained)), 550])));
	return f.dot;
}, true);
