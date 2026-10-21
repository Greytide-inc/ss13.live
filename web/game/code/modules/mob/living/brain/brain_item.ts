// From code/modules/mob/living/brain/brain_item.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9462, "/obj/item/organ/brain", "/obj/item/organ", {
	brainmob: null,
	damaged_brain: 0,
	decoy_override: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "brain",
	desc: "A piece of juicy meat found in a person's head.",
	icon_state: "brain",
	layer: 4.1,
	zone: "head",
	slot: "brain",
	vital: 1,
	origin_tech: "biotech=5",
	attack_verb: null,
});

// /obj/item/organ/brain/proc/Insert  (code/modules/mob/living/brain/brain_item.dm:22)  may sleep
rt.def("/obj/item/organ/brain/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", "brain");
	if ((truthy(rt.fv(f, "mind", live(f.args[0]))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		if ((truthy(rt.sv(f, "brainmob")) && !(isEqual(rt.fv(f, "stat", live(f.args[0])), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(f.args[0])), 8192))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "brainmob"), "<span class = danger>You can't feel your body! You're still just a brain!</span>"]);
		}
		rt.setSv(f, "loc", live(f.args[0]));
		yield* g.callName(f, live(f.args[0]), "update_hair", []);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "brainmob"))) {
		if (truthy(rt.fv(f, "key", live(f.args[0])))) {
			yield* g.callName(f, live(f.args[0]), "ghostize", []);
		}
		if (truthy(rt.fv(f, "mind", rt.sv(f, "brainmob")))) {
			yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "brainmob")), "transfer_to", [live(f.args[0])]);
		} else {
			rt.setFv(f, "key", live(f.args[0]), rt.fv(f, "key", rt.sv(f, "brainmob")));
		}
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "brainmob")]);
		rt.setSv(f, "brainmob", null);
	}
	yield* g.callName(f, live(f.args[0]), "update_hair", []);
	return f.dot;
}, true, { args: ["C", "special"] });

// /obj/item/organ/brain/proc/Remove  (code/modules/mob/living/brain/brain_item.dm:48)  may sleep
rt.def("/obj/item/organ/brain/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "gc_destroyed")) || (truthy(rt.sv(f, "owner")) && !truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "owner")))))) {
		yield* g.srcCall(f, "transfer_identity", live(f.args[0]));
	}
	yield* g.callName(f, live(f.args[0]), "update_hair", []);
	return f.dot;
}, true, { args: ["C", "special"] });

// /obj/item/organ/brain/proc/transfer_identity  (code/modules/mob/living/brain/brain_item.dm:57)  may sleep
rt.def("/obj/item/organ/brain/proc/transfer_identity", function* transfer_identity(f: Frame, L: Value) {
	let C: Value = null, ZI: Value = null;
	f.vars = () => [L, C, ZI];
	rt.setSv(f, "name", fmt("＀'s brain", [rt.fv(f, "name", live(L))]));
	if ((truthy(rt.sv(f, "brainmob")) || truthy(rt.sv(f, "decoy_override")))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "mind", live(L)))) {
		return live(f.dot);
	}
	rt.setSv(f, "brainmob", (yield* g.new_(f, T("/mob/living/brain"), [live(f.src)])));
	rt.setFv(f, "name", rt.sv(f, "brainmob"), rt.fv(f, "real_name", live(L)));
	rt.setFv(f, "real_name", rt.sv(f, "brainmob"), rt.fv(f, "real_name", live(L)));
	rt.setFv(f, "timeofhostdeath", rt.sv(f, "brainmob"), rt.fv(f, "timeofdeath", live(L)));
	if (truthy((yield* g.callName(f, live(L), "has_dna", [])))) {
		C = live(L);
		if (!truthy(rt.fv(f, "stored_dna", rt.sv(f, "brainmob")))) {
			rt.setFv(f, "stored_dna", rt.sv(f, "brainmob"), (yield* g.new_(f, T("/datum/dna/stored"), [rt.sv(f, "brainmob")])));
		}
		yield* g.callName(f, rt.fv(f, "dna", live(C)), "copy_dna", [rt.fv(f, "stored_dna", rt.sv(f, "brainmob"))]);
		if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(L)), 128))) {
			(rt.modField(f, rt.sv(f, "brainmob"), "disabilities", 128, rt.bitOr));
		}
		if (truthy((ZI = (yield* g.callName(f, live(L), "getorganslot", ["zombie_infection"]))))) {
			yield* g.callName(f, rt.sv(f, "brainmob"), "set_species", [rt.fv(f, "old_species", live(ZI))]);
		}
	}
	if ((truthy(rt.fv(f, "mind", live(L))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(L)))))) {
		yield* g.callName(f, rt.fv(f, "mind", live(L)), "transfer_to", [rt.sv(f, "brainmob")]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "brainmob"), "<span class='notice'>You feel slightly disoriented. That's normal when you're just a brain.</span>"]);
	return f.dot;
}, true);

// /obj/item/organ/brain/proc/attackby  (code/modules/mob/living/brain/brain_item.dm:81)  may sleep
rt.def("/obj/item/organ/brain/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	f.vars = () => [O, user, params];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	if (!truthy(rt.sv(f, "brainmob"))) return f.dot;
	yield* g.callName(f, live(O), "attack", [rt.sv(f, "brainmob"), live(user)]);
	return f.dot;
}, true);

// /obj/item/organ/brain/proc/examine  (code/modules/mob/living/brain/brain_item.dm:86)
rt.def("/obj/item/organ/brain/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "brainmob"))) {
		if (truthy(rt.fv(f, "client", rt.sv(f, "brainmob")))) {
			if (rt.le(rt.fv(f, "health", rt.sv(f, "brainmob")), -100)) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's lifeless and severely damaged."]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You can feel the small spark of life still left in this one."]);
			}
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "This one seems particularly lifeless. Perhaps it will regain some of its luster later."]);
		}
	} else {
		if (truthy(rt.sv(f, "decoy_override"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "This one seems particularly lifeless. Perhaps it will regain some of its luster later."]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "This one is completely devoid of life."]);
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/organ/brain/proc/attack  (code/modules/mob/living/brain/brain_item.dm:103)  may sleep
rt.def("/obj/item/organ/brain/proc/attack", function* attack(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (!isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "head")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((((truthy(rt.fv(f, "head", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(f.args[0]))), 4))) || (truthy(rt.fv(f, "wear_mask", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(f.args[0]))), 2)))) || (truthy(rt.fv(f, "glasses", live(f.args[0]))) && truthy(rt.bitAnd(rt.gv(f, "flags", rt.fv(f, "glasses", live(f.args[0]))), 1))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You're going to need to remove their head cover first!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.args[0]), "getorgan", [T("/obj/item/organ/brain")])))) {
		if (!truthy((yield* g.callName(f, live(f.args[0]), "get_bodypart", ["head"])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		msg = fmt("＀ has ＀ inserted into ＀ head by ＀.", [live(f.args[0]), live(f.src), (yield* g.callName(f, live(f.args[0]), "p_their", [])), live(f.args[1])]);
		if (isEqual(live(f.args[0]), live(f.args[1]))) {
			msg = fmt("＀ inserts ＀ into ＀ head!", [live(f.args[1]), live(f.src), (yield* g.callName(f, live(f.args[1]), "p_their", []))]);
		}
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀</span>", [live(msg)]), fmt("<span class='userdanger'>＀</span>", [live(msg)])]);
		if (!isEqual(live(f.args[0]), live(f.args[1]))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ inserts ＀ into your head.</span>", [live(f.args[1]), live(f.src)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀'s head.</span>", [live(f.src), live(f.args[0])])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into your head.</span>", [live(f.src)])]);
		}
		yield* g.srcCall(f, "Insert", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["C", "user"] });

// /obj/item/organ/brain/proc/Destroy  (code/modules/mob/living/brain/brain_item.dm:140)  may sleep
rt.def("/obj/item/organ/brain/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "brainmob"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "brainmob")]);
		rt.setSv(f, "brainmob", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
