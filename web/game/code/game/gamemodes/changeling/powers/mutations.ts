// From code/game/gamemodes/changeling/powers/mutations.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11239, "/obj/effect/proc_holder/changeling/weapon", "/obj/effect/proc_holder/changeling", {
	silent: 0,
	weapon_type: null,
	weapon_name_simple: null,
	helptext: "Yell at Miauw and/or Perakp",
	chemical_cost: 1000,
	dna_cost: -1,
	name: "Organic Weapon",
	desc: "Go tell a coder if you see this",
});

// /obj/effect/proc_holder/changeling/weapon/proc/try_to_sting  (code/game/gamemodes/changeling/powers/mutations.dm:25)  may sleep
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/try_to_sting", function* try_to_sting(f: Frame, user: Value, target: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [user, target, I, $e];
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(user)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((yield* g.srcCall(f, "check_weapon", live(user), live(I))))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [live(user), live(target)]);
	return f.dot;
}, true);

// /obj/effect/proc_holder/changeling/weapon/proc/check_weapon  (code/game/gamemodes/changeling/powers/mutations.dm:31)  may sleep
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/check_weapon", function* check_weapon(f: Frame, user: Value, hand_item: Value) {
	f.vars = () => [user, hand_item];
	if (!truthy(rt.op(f, "IsType", [], [live(hand_item), rt.sv(f, "weapon_type")]))) return f.dot;
	yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(hand_item), 1]);
	if (!truthy(rt.sv(f, "silent"))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/effects/blobattack.ogg"), 30, 1]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>With a sickening crunch, ＀ reforms their ＀ into an arm!</span>", [live(user), rt.sv(f, "weapon_name_simple")]), fmt("<span class='notice'>We assimilate the ＀ back into our body.</span>", [rt.sv(f, "weapon_name_simple")]), "<span class='italics>You hear organic matter ripping and tearing!</span>"]);
	}
	yield* g.callName(f, live(user), "update_inv_hands", []);
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/weapon/proc/sting_action  (code/game/gamemodes/changeling/powers/mutations.dm:40)  may sleep
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let limb_regen: Value = null, W: Value = null;
	f.vars = () => [user, limb_regen, W];
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is stuck to your hand, you cannot grow a ＀ over it!</span>", [(yield* g.callName(f, live(user), "get_active_held_item", [])), rt.sv(f, "weapon_name_simple")])]);
		return live(f.dot);
	}
	limb_regen = 0;
	if (isEqual(rt.modulus(rt.fv(f, "active_hand_index", live(user)), 2), 0)) {
		limb_regen = (yield* g.callName(f, live(user), "regenerate_limb", ["r_arm", 1]));
	} else {
		limb_regen = (yield* g.callName(f, live(user), "regenerate_limb", ["l_arm", 1]));
	}
	if (truthy(live(limb_regen))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s missing arm reforms, making a loud, grotesque sound!</span>", [live(user)]), "<span class='userdanger'>Your arm regrows, making a loud, crunchy sound and giving you great pain!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
		yield* g.callName(f, live(user), "emote", ["scream"]);
	}
	W = (yield* g.new_(f, rt.sv(f, "weapon_type"), [live(user), rt.sv(f, "silent")]));
	yield* g.callName(f, live(user), "put_in_hands", [live(W)]);
	if (!truthy(rt.sv(f, "silent"))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/effects/blobattack.ogg"), 30, 1]);
	}
	return live(W);
}, true);

// /obj/effect/proc_holder/changeling/weapon/proc/on_refund  (code/game/gamemodes/changeling/powers/mutations.dm:58)  may sleep
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/on_refund", function* on_refund(f: Frame, user: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [user, I, $e];
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(user)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "check_weapon", live(user), live(I));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11243, "/obj/effect/proc_holder/changeling/suit", "/obj/effect/proc_holder/changeling", {
	helmet_type: rt.typePath("/obj/item"),
	suit_type: rt.typePath("/obj/item"),
	suit_name_simple: "    ",
	helmet_name_simple: "     ",
	recharge_slowdown: 0,
	blood_on_castoff: 0,
	helptext: "Yell at Miauw and/or Perakp",
	chemical_cost: 1000,
	dna_cost: -1,
	name: "Organic Suit",
	desc: "Go tell a coder if you see this",
});

// /obj/effect/proc_holder/changeling/suit/proc/try_to_sting  (code/game/gamemodes/changeling/powers/mutations.dm:78)  may sleep
rt.def("/obj/effect/proc_holder/changeling/suit/proc/try_to_sting", function* try_to_sting(f: Frame, user: Value, target: Value) {
	let H: Value = null;
	f.vars = () => [user, target, H];
	if (truthy((yield* g.srcCall(f, "check_suit", live(user))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [(H = live(user)), live(target)]);
	return f.dot;
}, true);

// /obj/effect/proc_holder/changeling/suit/proc/check_suit  (code/game/gamemodes/changeling/powers/mutations.dm:85)  may sleep
rt.def("/obj/effect/proc_holder/changeling/suit/proc/check_suit", function* check_suit(f: Frame, user: Value) {
	let changeling: Value = null, H: Value = null;
	f.vars = () => [user, changeling, H];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(live(changeling)))) {
		return 1;
	}
	if (!(truthy(rt.op(f, "IsType", [], [rt.gv(f, "wear_suit", (H = live(user))), rt.sv(f, "suit_type")])) || truthy(rt.op(f, "IsType", [], [rt.fv(f, "head", live(H)), rt.sv(f, "helmet_type")])))) return f.dot;
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ casts off their ＀!</span>", [live(H), rt.sv(f, "suit_name_simple")]), fmt("<span class='warning'>We cast off our ＀.</span>", [rt.sv(f, "suit_name_simple")]), "<span class='italics'>You hear the organic matter ripping and tearing!</span>"]);
	yield* g.callName(f, live(H), "temporarilyRemoveItemFromInventory", [rt.fv(f, "head", live(H)), 1]);
	yield* g.callName(f, live(H), "temporarilyRemoveItemFromInventory", [rt.fv(f, "wear_suit", live(H)), 1]);
	yield* g.callName(f, live(H), "update_inv_wear_suit", []);
	yield* g.callName(f, live(H), "update_inv_head", []);
	yield* g.callName(f, live(H), "update_hair", []);
	if (truthy(rt.sv(f, "blood_on_castoff"))) {
		yield* g.callName(f, live(H), "add_splatter_floor", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(H)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	}
	(rt.modField(f, live(changeling), "chem_recharge_slowdown", rt.sv(f, "recharge_slowdown"), subtract));
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/suit/proc/on_refund  (code/game/gamemodes/changeling/powers/mutations.dm:105)  may sleep
rt.def("/obj/effect/proc_holder/changeling/suit/proc/on_refund", function* on_refund(f: Frame, user: Value) {
	let H: Value = null;
	f.vars = () => [user, H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "check_suit", (H = live(user)));
	return f.dot;
}, true);

// /obj/effect/proc_holder/changeling/suit/proc/sting_action  (code/game/gamemodes/changeling/powers/mutations.dm:111)  may sleep
rt.def("/obj/effect/proc_holder/changeling/suit/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null;
	f.vars = () => [user, changeling];
	if (!truthy((yield* g.callName(f, live(user), "canUnEquip", [rt.fv(f, "wear_suit", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("％！ is stuck to your body, you cannot grow a ＀ over it!", [rt.fv(f, "wear_suit", live(user)), rt.sv(f, "suit_name_simple")])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "canUnEquip", [rt.fv(f, "head", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("％！ is stuck on your head, you cannot grow a ＀ over it!", [rt.fv(f, "head", live(user)), rt.sv(f, "helmet_name_simple")])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "dropItemToGround", [rt.fv(f, "head", live(user))]);
	yield* g.callName(f, live(user), "dropItemToGround", [rt.fv(f, "wear_suit", live(user))]);
	yield* g.callName(f, live(user), "equip_to_slot_if_possible", [(yield* g.new_(f, rt.sv(f, "suit_type"), [live(user)])), 13, 1, 1, 1]);
	yield* g.callName(f, live(user), "equip_to_slot_if_possible", [(yield* g.new_(f, rt.sv(f, "helmet_type"), [live(user)])), 11, 1, 1, 1]);
	rt.modField(f, (changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)))), "chem_recharge_slowdown", rt.sv(f, "recharge_slowdown"), add);
	return 1;
}, true);

rt.type(5655, "/obj/item/weapon/melee/arm_blade", "/obj/item/weapon/melee", {
	can_drop: 0,
	flags: 16514,
	throw_range: 0,
	throw_speed: 0,
	name: "arm blade",
	desc: "A grotesque blade made out of bone and flesh that cleaves through people as a hot knife through butter.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "arm_blade",
	item_state: "arm_blade",
	w_class: 5,
	force: 25,
	throwforce: 0,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// /obj/item/weapon/melee/arm_blade/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:161)  may sleep
rt.def("/obj/item/weapon/melee/arm_blade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) && !truthy(live(f.args[1])))) {
		yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>A grotesque blade forms around ＀'s arm!</span>", [rt.fv(f, "name", rt.sv(f, "loc"))]), "<span class='warning'>Our arm twists and mutates, transforming it into a deadly blade.</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	rt.setSv(f, "can_drop", 1);
	return f.dot;
}, true, { args: ["mapload", "silent", "synthetic"] });

// /obj/item/weapon/melee/arm_blade/proc/afterattack  (code/game/gamemodes/changeling/powers/mutations.dm:168)  may sleep
rt.def("/obj/item/weapon/melee/arm_blade/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let _T: Value = null, C: Value = null, A: Value = null;
	f.vars = () => [target, user, proximity, _T, C, A];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/structure/table")) ? 1 : 0))) {
		yield* g.callName(f, (_T = live(target)), "deconstruct", [0]);
	} else {
		if (truthy((rt.istype(live(target), T("/obj/machinery/computer")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(target)), "attack_alien", [live(user)]);
		} else {
			if (!truthy((rt.istype(live(target), T("/obj/machinery/door/airlock")) ? 1 : 0))) return f.dot;
			if ((!truthy((yield* g.callName(f, (A = live(target)), "requiresID", []))) || truthy((yield* g.callName(f, live(A), "allowed", [live(user)]))))) {
				return live(f.dot);
			}
			if (truthy(rt.fv(f, "locked", live(A)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The airlock's bolts prevent it from being forced!</span>"]);
				return live(f.dot);
			}
			if (truthy((yield* g.callName(f, live(A), "hasPower", [])))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ jams ＀ into the airlock and starts prying it open!</span>", [live(user), live(f.src)]), "<span class='warning'>We start forcing the airlock open.</span>", "<span class='italics'>You hear a metal screeching sound.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(A), rt.rsc("sound/machines/airlock_alien_prying.ogg"), 100, 1]);
				if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 100, "target", live(A)], rt.Args.Named)))) {
					return live(f.dot);
				}
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ forces the airlock to open with their ＀!</span>", [live(user), live(f.src)]), "<span class='warning'>We force the airlock to open.</span>", "<span class='italics'>You hear a metal screeching sound.</span>"]);
			yield* g.callName(f, live(A), "open", [2]);
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/melee/arm_blade/proc/dropped  (code/game/gamemodes/changeling/powers/mutations.dm:199)  may sleep
rt.def("/obj/item/weapon/melee/arm_blade/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "can_drop"))) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/melee/synthetic_arm_blade"), [rt.getStep(f, live(f.args[0]), 0)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5112, "/obj/item/weapon/gun/magic/tentacle", "/obj/item/weapon/gun/magic", {
	flags: 16518,
	throw_range: 0,
	throw_speed: 0,
	name: "tentacle",
	desc: "A fleshy tentacle that can stretch out and grab things or people.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "tentacle",
	item_state: "tentacle",
	w_class: 5,
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/tentacle"),
	fire_sound: rt.rsc("sound/effects/splat.ogg"),
	force: 0,
	max_charges: 1,
	throwforce: 0,
});

// /obj/item/weapon/gun/magic/tentacle/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:237)  may sleep
rt.def("/obj/item/weapon/gun/magic/tentacle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	if (!truthy(live(f.args[1]))) {
		yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>＀'s arm starts stretching inhumanly!</span>", [rt.fv(f, "name", rt.sv(f, "loc"))]), "<span class='warning'>Our arm twists and mutates, transforming it into a tentacle.</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='notice'>You prepare to extend a tentacle.</span>"]);
	}
	return f.dot;
}, true, { args: ["mapload", "silent"] });

// /obj/item/weapon/gun/magic/tentacle/proc/shoot_with_empty_chamber  (code/game/gamemodes/changeling/powers/mutations.dm:246)
rt.def("/obj/item/weapon/gun/magic/tentacle/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is not ready yet.<span>", [rt.sv(f, "name")])]);
	return f.dot;
});

// /obj/item/weapon/gun/magic/tentacle/proc/suicide_act  (code/game/gamemodes/changeling/powers/mutations.dm:249)
rt.def("/obj/item/weapon/gun/magic/tentacle/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ coils ＀ tightly around ＀ neck! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 8;
});

rt.type(8656, "/obj/item/ammo_casing/magic/tentacle", "/obj/item/ammo_casing/magic", {
	gun: null,
	name: "tentacle",
	desc: "a tentacle.",
	projectile_type: rt.typePath("/obj/item/projectile/tentacle"),
	caliber: "tentacle",
	icon_state: "tentacle_end",
	firing_effect_type: null,
});

// /obj/item/ammo_casing/magic/tentacle/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:263)  may sleep
rt.def("/obj/item/ammo_casing/magic/tentacle/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "gun", rt.sv(f, "loc"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/ammo_casing/magic/tentacle/proc/Destroy  (code/game/gamemodes/changeling/powers/mutations.dm:268)  may sleep
rt.def("/obj/item/ammo_casing/magic/tentacle/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "gun", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(8789, "/obj/item/projectile/tentacle", "/obj/item/projectile", {
	chain: null,
	source: null,
	pass_flags: 1,
	name: "tentacle",
	icon_state: "tentacle_end",
	damage: 0,
	damage_type: "brute",
	range: 8,
	hitsound: rt.rsc("sound/weapons/thudswoosh.ogg"),
});

// /obj/item/projectile/tentacle/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:282)  may sleep
rt.def("/obj/item/projectile/tentacle/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "source", rt.sv(f, "loc"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/projectile/tentacle/proc/fire  (code/game/gamemodes/changeling/powers/mutations.dm:287)  may sleep
rt.def("/obj/item/projectile/tentacle/proc/fire", function* fire(f: Frame) {
	if (truthy(rt.sv(f, "firer"))) {
		rt.setSv(f, "chain", (yield* g.callName(f, rt.sv(f, "firer"), "Beam", [null, live(f.src), "icon_state", "tentacle", "time", 9.999999848243207e+30, "maxdistance", 9.999999848243207e+30, "beam_sleep_time", 1], rt.Args.Named)));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["setAngle"], waitfor: false });

// /obj/item/projectile/tentacle/proc/reset_throw  (code/game/gamemodes/changeling/powers/mutations.dm:291)
rt.def("/obj/item/projectile/tentacle/proc/reset_throw", function reset_throw(f: Frame, H: Value) {
	if (!truthy(rt.fv(f, "in_throw_mode", live(H)))) return f.dot;
	rt.callName(f, live(H), "throw_mode_off", []);
	return f.dot;
});

// /obj/item/projectile/tentacle/proc/tentacle_grab  (code/game/gamemodes/changeling/powers/mutations.dm:295)  may sleep
rt.def("/obj/item/projectile/tentacle/proc/tentacle_grab", function* tentacle_grab(f: Frame, H: Value, C: Value) {
	f.vars = () => [H, C];
	if (!truthy((yield* g.callName(f, live(H), "Adjacent", [live(C)])))) return f.dot;
	yield* g.callName(f, live(C), "grabbedby", [live(H)]);
	yield* g.callName(f, live(C), "grippedby", [live(H)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 8, path: "/mob/living/carbon" }] });

// /obj/item/projectile/tentacle/proc/tentacle_stab  (code/game/gamemodes/changeling/powers/mutations.dm:300)  may sleep
rt.def("/obj/item/projectile/tentacle/proc/tentacle_stab", function* tentacle_stab(f: Frame, H: Value, C: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [H, C, I, $e];
	if (!truthy((yield* g.callName(f, live(H), "Adjacent", [live(C)])))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((yield* g.callName(f, live(I), "is_sharp", [])))) {
			yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ impales ＀ with ＀ ＀!</span>", [live(H), live(C), (yield* g.callName(f, live(H), "p_their", [])), rt.fv(f, "name", live(I))]), fmt("<span class='userdanger'>＀ impales you with ＀ ＀!</span>", [live(H), (yield* g.callName(f, live(H), "p_their", [])), rt.fv(f, "name", live(I))])]);
			yield* g.callName(f, live(C), "apply_damage", [rt.fv(f, "force", live(I)), "brute", "chest"]);
			yield* g.callName(f, live(H), "do_item_attack_animation", [null, live(C), "used_item", live(I)], rt.Args.Named);
			yield* g.callName(f, live(H), "add_mob_blood", [live(C)]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), rt.fv(f, "hitsound", live(I)), 75, 1]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 8, path: "/mob/living/carbon" }] });

// /obj/item/projectile/tentacle/proc/on_hit  (code/game/gamemodes/changeling/powers/mutations.dm:311)  may sleep
rt.def("/obj/item/projectile/tentacle/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let H: Value = null, I: Value = null, L: Value = null, C: Value = null, I_3: Value = null;
	let $0: any;
	f.vars = () => [target, blocked, H, I, L, C, I_3, $0];
	if (live(blocked) === null) {
		blocked = 0;
	}
	yield* g.callName(f, (H = rt.sv(f, "firer")), "dropItemToGround", [rt.fv(f, "gun", rt.sv(f, "source")), 1]);
	if (rt.ge(live(blocked), 100)) {
		return 0;
	}
	if (truthy((rt.istype(live(target), T("/obj/item")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "anchored", (I = live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "firer"), fmt("<span class='notice'>You pull ＀ towards yourself.</span>", [live(I)])]);
			yield* g.callName(f, live(H), "throw_mode_on", []);
			yield* g.callName(f, live(I), "throw_at", [live(H), 10, 2]);
			f.dot = 1;
		}
	} else {
		if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
		if (!(!truthy(rt.gv(f, "anchored", (L = live(target)))) && !truthy(rt.fv(f, "throwing", live(L))))) return f.dot;
		if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(L);
			$0 = rt.fv(f, "a_intent", rt.sv(f, "firer"));
			if ($0 === "help") {
				yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is pulled by ＀'s tentacle!</span>", [live(L), live(H)]), fmt("<span class='userdanger'>A tentacle grabs you and pulls you towards ＀!</span>", [live(H)])]);
				yield* g.callName(f, live(C), "throw_at", [(yield* g.call(f, P("/proc/get_step_towards"), null, [live(H), live(C)])), 8, 2]);
				return 1;
			} else if ($0 === "disarm") {
				if (truthy((I_3 = (yield* g.callName(f, live(C), "get_active_held_item", []))))) {
					if (truthy((yield* g.callName(f, live(C), "drop_item", [])))) {
						yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is yanked off ＀'s hand by ＀!</span>", [live(I_3), live(C), live(f.src)]), fmt("<span class='userdanger'>A tentacle pulls ＀ away from you!</span>", [live(I_3)])]);
						yield* g.srcCall(f, "on_hit", live(I_3));
						return 1;
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "firer"), fmt("<span class='danger'>You can't seem to pry ＀ off ＀'s hands!<span>", [live(I_3), live(C)])]);
						return 0;
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "firer"), fmt("<span class='danger'>＀ has nothing in hand to disarm!<span>", [live(C)])]);
					return 0;
				}
			} else if ($0 === "grab") {
				yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is grabbed by ＀'s tentacle!</span>", [live(L), live(H)]), fmt("<span class='userdanger'>A tentacle grabs you and pulls you towards ＀!</span>", [live(H)])]);
				yield* g.callName(f, live(C), "throw_at", [null, (yield* g.call(f, P("/proc/get_step_towards"), null, [live(H), live(C)])), null, 8, null, 2, "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/projectile/tentacle/proc/tentacle_grab"), live(H), live(C)]))], rt.Args.Named);
				return 1;
			} else if ($0 === "harm") {
				yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is thrown towards ＀ by a tentacle!</span>", [live(L), live(H)]), fmt("<span class='userdanger'>A tentacle grabs you and throws you towards ＀!</span>", [live(H)])]);
				yield* g.callName(f, live(C), "throw_at", [null, (yield* g.call(f, P("/proc/get_step_towards"), null, [live(H), live(C)])), null, 8, null, 2, "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/projectile/tentacle/proc/tentacle_stab"), live(H), live(C)]))], rt.Args.Named);
				return 1;
			}
		} else {
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ is pulled by ＀'s tentacle!</span>", [live(L), live(H)]), fmt("<span class='userdanger'>A tentacle grabs you and pulls you towards ＀!</span>", [live(H)])]);
			yield* g.callName(f, live(L), "throw_at", [(yield* g.call(f, P("/proc/get_step_towards"), null, [live(H), live(L)])), 8, 2]);
			f.dot = 1;
		}
	}
	return f.dot;
}, true);

// /obj/item/projectile/tentacle/proc/Destroy  (code/game/gamemodes/changeling/powers/mutations.dm:363)  may sleep
rt.def("/obj/item/projectile/tentacle/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chain")]);
	rt.setSv(f, "source", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11242, "/obj/effect/proc_holder/changeling/weapon/shield", "/obj/effect/proc_holder/changeling/weapon", {
	helptext: "Organic tissue cannot resist damage forever; the shield will break after it is hit too much. The more genomes we absorb, the stronger it is. Cannot be used while in lesser form.",
	chemical_cost: 20,
	dna_cost: 1,
	req_human: 1,
	weapon_type: rt.typePath("/obj/item/weapon/shield/changeling"),
	weapon_name_simple: "shield",
	name: "Organic Shield",
	desc: "We reform one of our arms into a hard shield.",
});

// /obj/effect/proc_holder/changeling/weapon/shield/proc/sting_action  (code/game/gamemodes/changeling/powers/mutations.dm:383)  may sleep
rt.def("/obj/effect/proc_holder/changeling/weapon/shield/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, S: Value = null;
	f.vars = () => [user, changeling, S];
	if (!truthy((changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)))))) {
		return live(f.dot);
	}
	rt.setFv(f, "remaining_uses", (S = (yield* g.callSuper(f, [live(user)]))), (yield* g.call(f, P("/proc/round"), null, [multiply(rt.fv(f, "absorbedcount", live(changeling)), 3)])));
	return 1;
}, true);

rt.type(5700, "/obj/item/weapon/shield/changeling", "/obj/item/weapon/shield", {
	remaining_uses: null,
	flags: 16514,
	name: "shield-like mass",
	desc: "A mass of tough, boney tissue. You can still see the fingers as a twisted pattern in the shield.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "ling_shield",
	block_chance: 50,
});

// /obj/item/weapon/shield/changeling/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:402)  may sleep
rt.def("/obj/item/weapon/shield/changeling/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>The end of ＀'s hand inflates rapidly, forming a huge shield-like mass!</span>", [rt.fv(f, "name", rt.sv(f, "loc"))]), "<span class='warning'>We inflate our hand into a strong shield.</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
	return f.dot;
}, true);

// /obj/item/weapon/shield/changeling/proc/hit_reaction  (code/game/gamemodes/changeling/powers/mutations.dm:407)  may sleep
rt.def("/obj/item/weapon/shield/changeling/proc/hit_reaction", function* hit_reaction(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (rt.lt(rt.sv(f, "remaining_uses"), 1)) {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (H = rt.sv(f, "loc")), "visible_message", [fmt("<span class='warning'>With a sickening crunch, ＀ reforms his shield into an arm!</span>", [live(H)]), "<span class='notice'>We assimilate our shield into our body</span>", "<span class='italics>You hear organic matter ripping and tearing!</span>"]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	} else {
		rt.incSrcVar(f, "remaining_uses", -1, true);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(7701, "/obj/item/clothing/suit/space/changeling", "/obj/item/clothing/suit/space", {
	flags: 16387,
	name: "flesh mass",
	icon_state: "lingspacesuit",
	desc: "A huge, bulky mass of pressure and temperature-resistant organic tissue, evolved to facilitate space travel.",
	allowed: null,
	armor: null,
});

// /obj/item/clothing/suit/space/changeling/proc/<init>  (code/game/gamemodes/changeling/powers/mutations.dm:441)
rt.def("/obj/item/clothing/suit/space/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/tank/internals/oxygen")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});

// /obj/item/clothing/suit/space/changeling/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:445)  may sleep
rt.def("/obj/item/clothing/suit/space/changeling/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>＀'s flesh rapidly inflates, forming a bloated mass around their body!</span>", [rt.fv(f, "name", rt.sv(f, "loc"))]), "<span class='warning'>We inflate our flesh, creating a spaceproof suit!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
	}
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/changeling/proc/process  (code/game/gamemodes/changeling/powers/mutations.dm:451)  may sleep
rt.def("/obj/item/clothing/suit/space/changeling/proc/process", function* process(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.gv(f, "reagents", (H = rt.sv(f, "loc"))), "add_reagent", ["salbutamol", 0.4000000059604645]);
	return f.dot;
}, true, { waitfor: false });

rt.type(7934, "/obj/item/clothing/head/helmet/space/changeling", "/obj/item/clothing/head/helmet/space", {
	flags: 16387,
	name: "flesh mass",
	icon_state: "lingspacehelmet",
	desc: "A covering of pressure and temperature-resistant organic tissue with a glass-like chitin front.",
	armor: null,
	flags_cover: 20,
});

// /obj/item/clothing/head/helmet/space/changeling/proc/<init>  (code/game/gamemodes/changeling/powers/mutations.dm:460)
rt.def("/obj/item/clothing/head/helmet/space/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});

rt.type(7763, "/obj/item/clothing/suit/armor/changeling", "/obj/item/clothing/suit/armor", {
	flags: 16386,
	name: "chitinous mass",
	desc: "A tough, hard covering of black chitin.",
	icon_state: "lingarmor",
	body_parts_covered: 2046,
	armor: null,
	flags_inv: 4,
	cold_protection: 0,
	heat_protection: 0,
});

// /obj/item/clothing/suit/armor/changeling/proc/<init>  (code/game/gamemodes/changeling/powers/mutations.dm:486)
rt.def("/obj/item/clothing/suit/armor/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 10, "bio", 4, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});

// /obj/item/clothing/suit/armor/changeling/proc/Initialize  (code/game/gamemodes/changeling/powers/mutations.dm:492)  may sleep
rt.def("/obj/item/clothing/suit/armor/changeling/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>＀'s flesh turns black, quickly transforming into a hard, chitinous mass!</span>", [rt.fv(f, "name", rt.sv(f, "loc"))]), "<span class='warning'>We harden our flesh, creating a suit of armor!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>"]);
	return f.dot;
}, true);

rt.type(7993, "/obj/item/clothing/head/helmet/changeling", "/obj/item/clothing/head/helmet", {
	flags: 16386,
	name: "chitinous mass",
	desc: "A tough, hard covering of black chitin with transparent chitin in front.",
	icon_state: "lingarmorhelmet",
	armor: null,
	flags_inv: 992,
});

// /obj/item/clothing/head/helmet/changeling/proc/<init>  (code/game/gamemodes/changeling/powers/mutations.dm:501)
rt.def("/obj/item/clothing/head/helmet/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 10, "bio", 4, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});
