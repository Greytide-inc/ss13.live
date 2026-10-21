// From code/modules/mob/living/carbon/alien/humanoid/queen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4825, "/mob/living/carbon/alien/humanoid/royal", "/mob/living/carbon/alien/humanoid", {
	alt_inhands_file: rt.rsc("icons/mob/alienqueen.dmi"),
	pressure_resistance: 200,
	icon: rt.rsc("icons/mob/alienqueen.dmi"),
	status_flags: 0,
	ventcrawler: 0,
	unique_name: 0,
	pixel_x: -16,
	bubble_icon: "alienroyal",
	mob_size: 3,
	layer: 4.4,
	butcher_results: null,
});

// /mob/living/carbon/alien/humanoid/royal/proc/<init>  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:12)
rt.def("/mob/living/carbon/alien/humanoid/royal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 20, T("/obj/item/stack/sheet/animalhide/xeno"), 3]));
	return f.dot;
});

rt.type(4826, "/mob/living/carbon/alien/humanoid/royal/queen", "/mob/living/carbon/alien/humanoid/royal", {
	smallsprite: null,
	name: "alien queen",
	caste: "q",
	maxHealth: 400,
	health: 400,
	icon_state: "alienq",
});

// /mob/living/carbon/alien/humanoid/royal/queen/proc/<init>  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:25)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "smallsprite", (yield* g.new_(f, T("/datum/action/small_sprite"), [])));
	return f.dot;
}, true);

rt.type(266, "/datum/action/small_sprite", "/datum/action", {
	small: 0,
	name: "Toggle Giant Sprite - Others will always see you as giant",
	button_icon_state: "smallqueen",
	background_icon_state: "bg_alien",
});

// /datum/action/small_sprite/proc/Trigger  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:34)  may sleep
rt.def("/datum/action/small_sprite/proc/Trigger", function* Trigger(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "small"))) {
		rt.setFv(f, "override", (I = (yield* g.call(f, P("/proc/image"), null, ["icon", rt.rsc("icons/mob/alien.dmi"), "icon_state", "alienq", "loc", rt.sv(f, "owner")], rt.Args.Named))), 1);
		(rt.modField(f, live(I), "pixel_x", rt.fv(f, "pixel_x", rt.sv(f, "owner")), subtract));
		(rt.modField(f, live(I), "pixel_y", rt.fv(f, "pixel_y", rt.sv(f, "owner")), subtract));
		yield* g.callName(f, rt.sv(f, "owner"), "add_alt_appearance", [T("/datum/atom_hud/alternate_appearance/basic"), "smallqueen", live(I)]);
		rt.setSv(f, "small", 1);
	} else {
		yield* g.callName(f, rt.sv(f, "owner"), "remove_alt_appearance", ["smallqueen"]);
		rt.setSv(f, "small", 0);
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/royal/queen/proc/Initialize  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:49)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/Initialize", function* Initialize(f: Frame) {
	let Q: Value = null;
	let $e: any;
	f.vars = () => [Q, $e];
	Q = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/alien/humanoid/royal/queen"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Q = $e;
		if (isEqual(live(Q), live(f.src))) {
			continue;
		}
		if (isEqual(rt.fv(f, "stat", live(Q)), 2)) {
			continue;
		}
		if (truthy(rt.fv(f, "client", live(Q)))) {
			rt.setSv(f, "name", fmt("alien princess (＀)", [(yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "real_name", rt.fv(f, "name", live(f.src)));
	yield* g.srcCall(f, "AddSpell", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno"), [live(f.src)])));
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/royal/queen/promote"), [])));
	yield* g.callName(f, rt.sv(f, "smallsprite"), "Grant", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/royal/queen/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:66)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/plasmavessel/large/queen"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/resinspinner"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/acid"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/neurotoxin"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/eggsac"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/royal/queen/proc/movement_delay  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:74)
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), 3, add);
	return f.dot;
});

rt.type(11396, "/obj/effect/proc_holder/alien/lay_egg", "/obj/effect/proc_holder/alien", {
	plasma_cost: 75,
	check_turf: 1,
	action_icon_state: "alien_egg",
	name: "Lay Egg",
	desc: "Lay an egg to produce huggers to impregnate prey with.",
});

// /obj/effect/proc_holder/alien/lay_egg/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:86)  may sleep
rt.def("/obj/effect/proc_holder/alien/lay_egg/proc/fire", function* fire(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.locateIn(f, T("/obj/structure/alien/egg"), rt.getStep(f, live(user), 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "There's already an egg here."]);
		return 0;
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='alertalien'>＀ has laid an egg!</span>", [live(user)])]);
	yield* g.new_(f, T("/obj/structure/alien/egg"), [rt.fv(f, "loc", live(user))]);
	return 1;
}, true);

rt.type(11399, "/obj/effect/proc_holder/alien/royal/queen/promote", "/obj/effect/proc_holder/alien/royal/queen", {
	plasma_cost: 500,
	action_icon_state: "alien_queen_promote",
	name: "Create Royal Parasite",
	desc: "Produce a royal parasite to grant one of your children the honor of being your Praetorian.",
});

// /obj/effect/proc_holder/alien/royal/queen/promote/proc/fire  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:105)  may sleep
rt.def("/obj/effect/proc_holder/alien/royal/queen/promote/proc/fire", function* fire(f: Frame, user: Value) {
	let prom: Value = null;
	let $e: any;
	f.vars = () => [user, prom, $e];
	prom = null;
	if (truthy((yield* g.call(f, P("/proc/get_alien_type"), null, [T("/mob/living/carbon/alien/humanoid/royal/praetorian")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You already have a Praetorian!</span>"]);
		return 0;
	} else {
		rt.forList(f, 0, live(user), T("/obj/item/queenpromote"));
		while (($e = rt.next(f, 0)) !== undefined) {
			prom = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='noticealien'>You discard ＀.</span>", [live(prom)])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(prom)]);
			return 0;
		}
		rt.endFor(f, 0);
		prom = (yield* g.new_(f, T("/obj/item/queenpromote"), [rt.fv(f, "loc", live(user))]));
		if (!truthy((yield* g.callName(f, live(user), "put_in_active_hand", [live(prom), 1])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You must empty your hands before preparing the parasite.</span>"]);
			return 0;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>Use the royal parasite on one of your children to promote her to Praetorian!</span>"]);
		}
	}
	return 0;
}, true);

rt.type(10120, "/obj/item/queenpromote", "/obj/item", {
	flags: 16514,
	name: "１royal parasite",
	desc: "Inject this into one of your grown children to promote her to a Praetorian!",
	icon_state: "alien_medal",
	icon: rt.rsc("icons/mob/alien.dmi"),
});

// /obj/item/queenpromote/proc/attack  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:130)  may sleep
rt.def("/obj/item/queenpromote/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let A: Value = null, new_prae: Value = null;
	f.vars = () => [M, user, A, new_prae];
	if ((!truthy((rt.istype(live(M), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/carbon/alien/humanoid/royal")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You may only use this with your adult, non-royal children!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/get_alien_type"), null, [T("/mob/living/carbon/alien/humanoid/royal/praetorian")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You already have a Praetorian!</span>"]);
		return live(f.dot);
	}
	if (((isEqual(rt.gv(f, "stat", (A = live(M))), 0) && truthy(rt.fv(f, "mind", live(A)))) && truthy(rt.fv(f, "key", live(A))))) {
		if (!truthy((yield* g.callName(f, live(user), "usePlasma", [500])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='noticealien'>You must have 500 plasma stored to use this!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), "<span class='noticealien'>The queen has granted you a promotion to Praetorian!</span>"]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='alertalien'>＀ begins to expand, twist and contort!</span>", [live(A)])]);
		new_prae = (yield* g.new_(f, T("/mob/living/carbon/alien/humanoid/royal/praetorian"), [rt.fv(f, "loc", live(A))]));
		yield* g.callName(f, rt.fv(f, "mind", live(A)), "transfer_to", [live(new_prae)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This child must be alert and responsive to become a Praetorian!</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/queenpromote/proc/attack_self  (code/modules/mob/living/carbon/alien/humanoid/queen.dm:154)  may sleep
rt.def("/obj/item/queenpromote/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='noticealien'>You discard ＀.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
