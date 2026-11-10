// Based on /tg/station's code/game/gamemodes/changeling/powers/mutations.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// mutations.dm:25
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/try_to_sting", function* try_to_sting(f: Frame, user: Value, target: Value) {
	let I: Value = null;
	for (I of each(user.held_items, T("/obj/item"))) {
		if (yield* this.check_weapon(user, I)) {
			return f.dot;
		}
	}
	yield* parent_proc(user, target);
	return f.dot;
}, true);

// mutations.dm:31
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/check_weapon", function* check_weapon(f: Frame, user: Value, hand_item: Value) {
	if (!rt.op(f, "IsType", [], [hand_item, this.weapon_type])) return f.dot;
	yield* user.temporarilyRemoveItemFromInventory(hand_item, 1);
	if (!this.silent) {
		playsound(user, rt.rsc("sound/effects/blobattack.ogg"), 30, 1);
		user.visible_message(`<span class='warning'>With a sickening crunch, ${user} reforms their ${this.weapon_name_simple} into an arm!</span>`, `<span class='notice'>We assimilate the ${this.weapon_name_simple} back into our body.</span>`, "<span class='italics>You hear organic matter ripping and tearing!</span>");
	}
	yield* user.update_inv_hands();
	return 1;
}, true);

// mutations.dm:40
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	if (!(yield* user.drop_item())) {
		to_chat(user, `<span class='warning'>The ${user.get_active_held_item()} is stuck to your hand, you cannot grow a ${this.weapon_name_simple} over it!</span>`);
		return f.dot;
	}
	let limb_regen: Value = 0;
	if (user.active_hand_index % 2 == 0) {
		limb_regen = (yield* user.regenerate_limb("r_arm", 1));
	} else {
		limb_regen = (yield* user.regenerate_limb("l_arm", 1));
	}
	if (limb_regen) {
		user.visible_message(`<span class='warning'>${user}'s missing arm reforms, making a loud, grotesque sound!</span>`, "<span class='userdanger'>Your arm regrows, making a loud, crunchy sound and giving you great pain!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
		yield* user.emote("scream");
	}
	let W: Value = (yield* new_(this.weapon_type, user, this.silent));
	yield* user.put_in_hands(W);
	if (!this.silent) {
		playsound(user, rt.rsc("sound/effects/blobattack.ogg"), 30, 1);
	}
	return W;
}, true);

// mutations.dm:58
rt.def("/obj/effect/proc_holder/changeling/weapon/proc/on_refund", function* on_refund(f: Frame, user: Value) {
	let I: Value = null;
	for (I of each(user.held_items, T("/obj/item"))) {
		yield* this.check_weapon(user, I);
	}
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

// mutations.dm:78
rt.def("/obj/effect/proc_holder/changeling/suit/proc/try_to_sting", function* try_to_sting(f: Frame, user: Value, target: Value) {
	let H: Value = null;
	if (yield* this.check_suit(user)) {
		return f.dot;
	}
	yield* parent_proc((H = user), target);
	return f.dot;
}, true);

// mutations.dm:85
rt.def("/obj/effect/proc_holder/changeling/suit/proc/check_suit", function* check_suit(f: Frame, user: Value) {
	let H: Value = null;
	let changeling: Value = user.mind.changeling;
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !changeling) {
		return 1;
	}
	if (!(rt.op(f, "IsType", [], [(H = user).wear_suit, this.suit_type]) || rt.op(f, "IsType", [], [H.head, this.helmet_type]))) return f.dot;
	H.visible_message(`<span class='warning'>${H} casts off their ${this.suit_name_simple}!</span>`, `<span class='warning'>We cast off our ${this.suit_name_simple}.</span>`, "<span class='italics'>You hear the organic matter ripping and tearing!</span>");
	yield* H.temporarilyRemoveItemFromInventory(H.head, 1);
	yield* H.temporarilyRemoveItemFromInventory(H.wear_suit, 1);
	yield* H.update_inv_wear_suit();
	yield* H.update_inv_head();
	yield* H.update_hair();
	if (this.blood_on_castoff) {
		yield* H.add_splatter_floor();
		playsound(H.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	}
	changeling.chem_recharge_slowdown -= this.recharge_slowdown;
	return 1;
}, true);

// mutations.dm:105
rt.def("/obj/effect/proc_holder/changeling/suit/proc/on_refund", function* on_refund(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	yield* this.check_suit((H = user));
	return f.dot;
}, true);

// mutations.dm:111
rt.def("/obj/effect/proc_holder/changeling/suit/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null;
	if (!user.canUnEquip(user.wear_suit)) {
		to_chat(user, fmt("％！ is stuck to your body, you cannot grow a ＀ over it!", [user.wear_suit, this.suit_name_simple]));
		return f.dot;
	}
	if (!user.canUnEquip(user.head)) {
		to_chat(user, fmt("％！ is stuck on your head, you cannot grow a ＀ over it!", [user.head, this.helmet_name_simple]));
		return f.dot;
	}
	yield* user.dropItemToGround(user.head);
	yield* user.dropItemToGround(user.wear_suit);
	yield* user.equip_to_slot_if_possible((yield* new_(this.suit_type, user)), slot_wear_suit, 1, 1, 1);
	yield* user.equip_to_slot_if_possible((yield* new_(this.helmet_type, user)), slot_head, 1, 1, 1);
	(changeling = user.mind.changeling).chem_recharge_slowdown += this.recharge_slowdown;
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

// mutations.dm:161
rt.def("/obj/item/weapon/melee/arm_blade/proc/Initialize", function* Initialize(f: Frame, mapload: Value, silent: Value, synthetic: Value) {
	f.dot = (yield* parent_proc());
	if (ismob(this.loc) && !silent) {
		this.loc.visible_message(`<span class='warning'>A grotesque blade forms around ${this.loc.name}'s arm!</span>`, "<span class='warning'>Our arm twists and mutates, transforming it into a deadly blade.</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
	}
	if (!synthetic) return f.dot;
	this.can_drop = 1;
	return f.dot;
}, true);

// mutations.dm:168
rt.def("/obj/item/weapon/melee/arm_blade/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let _T: Value = null, C: Value = null, A: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/structure/table"))) {
		yield* (_T = target).deconstruct(0);
	} else if (rt.istype(target, T("/obj/machinery/computer"))) {
		yield* (C = target).attack_alien(user);
	} else {
		if (!rt.istype(target, T("/obj/machinery/door/airlock"))) return f.dot;
		if (!(A = target).requiresID() || (yield* A.allowed(user))) {
			return f.dot;
		}
		if (A.locked) {
			to_chat(user, "<span class='warning'>The airlock's bolts prevent it from being forced!</span>");
			return f.dot;
		}
		if (A.hasPower()) {
			user.visible_message(`<span class='warning'>${user} jams ${this} into the airlock and starts prying it open!</span>`, "<span class='warning'>We start forcing the airlock open.</span>", "<span class='italics'>You hear a metal screeching sound.</span>");
			playsound(A, rt.rsc("sound/machines/airlock_alien_prying.ogg"), 100, 1);
			if (!(yield* do_after(user, 100, { target: A }))) {
				return f.dot;
			}
		}
		user.visible_message(`<span class='warning'>${user} forces the airlock to open with their ${this}!</span>`, "<span class='warning'>We force the airlock to open.</span>", "<span class='italics'>You hear a metal screeching sound.</span>");
		yield* A.open(2);
	}
	return f.dot;
}, true);

// mutations.dm:199
rt.def("/obj/item/weapon/melee/arm_blade/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	if (!this.can_drop) return f.dot;
	yield* new_(T("/obj/item/weapon/melee/synthetic_arm_blade"), rt.getStep(f, user, 0));
	return f.dot;
}, true);

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

// mutations.dm:237
rt.def("/obj/item/weapon/gun/magic/tentacle/proc/Initialize", function* Initialize(f: Frame, mapload: Value, silent: Value) {
	f.dot = (yield* parent_proc());
	if (!ismob(this.loc)) return f.dot;
	if (!silent) {
		this.loc.visible_message(`<span class='warning'>${this.loc.name}'s arm starts stretching inhumanly!</span>`, "<span class='warning'>Our arm twists and mutates, transforming it into a tentacle.</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
	} else {
		to_chat(this.loc, "<span class='notice'>You prepare to extend a tentacle.</span>");
	}
	return f.dot;
}, true);

// mutations.dm:246
rt.def("/obj/item/weapon/gun/magic/tentacle/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	to_chat(user, `<span class='warning'>The ${this.name} is not ready yet.<span>`);
	return f.dot;
});

// mutations.dm:249
rt.def("/obj/item/weapon/gun/magic/tentacle/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} coils ${this} tightly around ${user.p_their()} neck! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
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

// mutations.dm:263
rt.def("/obj/item/ammo_casing/magic/tentacle/proc/Initialize", function* Initialize(f: Frame) {
	this.gun = this.loc;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mutations.dm:268
rt.def("/obj/item/ammo_casing/magic/tentacle/proc/Destroy", function* Destroy(f: Frame) {
	this.gun = null;
	return (yield* parent_proc());
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

// mutations.dm:282
rt.def("/obj/item/projectile/tentacle/proc/Initialize", function* Initialize(f: Frame) {
	this.source = this.loc;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mutations.dm:287
rt.def("/obj/item/projectile/tentacle/proc/fire", function* fire(f: Frame, setAngle: Value) {
	if (this.firer) {
		this.chain = (yield* this.firer.Beam(this, { icon_state: "tentacle", time: 1e+31, maxdistance: 1e+31, beam_sleep_time: 1 }));
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// mutations.dm:295
rt.def("/obj/item/projectile/tentacle/proc/tentacle_grab", function* tentacle_grab(f: Frame, H: Value, C: Value) {
	if (!H.Adjacent(C)) return f.dot;
	yield* C.grabbedby(H);
	yield* C.grippedby(H);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 8, path: "/mob/living/carbon" }] });

// mutations.dm:300
rt.def("/obj/item/projectile/tentacle/proc/tentacle_stab", function* tentacle_stab(f: Frame, H: Value, C: Value) {
	let I: Value = null;
	if (!H.Adjacent(C)) return f.dot;
	for (I of each(H.held_items, T("/obj/item"))) {
		if (I.is_sharp()) {
			C.visible_message(`<span class='danger'>${H} impales ${C} with ${H.p_their()} ${I.name}!</span>`, `<span class='userdanger'>${H} impales you with ${H.p_their()} ${I.name}!</span>`);
			yield* C.apply_damage(I.force, "brute", "chest");
			yield* H.do_item_attack_animation(C, { used_item: I });
			yield* H.add_mob_blood(C);
			playsound(rt.getStep(f, H, 0), I.hitsound, 75, 1);
			return f.dot;
		}
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { type: 8, path: "/mob/living/carbon" }] });

// mutations.dm:311
rt.def("/obj/item/projectile/tentacle/proc/on_hit", function* on_hit(f: Frame, target: Value, blocked: Value) {
	let H: Value = null, I: Value = null, L: Value = null, C: Value = null, I_3: Value = null;
	blocked ??= 0;
	yield* (H = this.firer).dropItemToGround(this.source.gun, 1);
	if (blocked >= 100) {
		return 0;
	}
	if (rt.istype(target, T("/obj/item"))) {
		if (!(I = target).anchored) {
			to_chat(this.firer, `<span class='notice'>You pull ${I} towards yourself.</span>`);
			H.throw_mode_on();
			yield* I.throw_at(H, 10, 2);
			f.dot = 1;
		}
	} else {
		if (!rt.istype(target, T("/mob/living"))) return f.dot;
		if (!(!(L = target).anchored && !L.throwing)) return f.dot;
		if (rt.istype(L, T("/mob/living/carbon"))) {
			C = L;
			if (this.firer.a_intent === "help") {
				C.visible_message(`<span class='danger'>${L} is pulled by ${H}'s tentacle!</span>`, `<span class='userdanger'>A tentacle grabs you and pulls you towards ${H}!</span>`);
				yield* C.throw_at(get_step_towards(H, C), 8, 2);
				return 1;
			} else if (this.firer.a_intent === "disarm") {
				if (I_3 = C.get_active_held_item()) {
					if (yield* C.drop_item()) {
						C.visible_message(`<span class='danger'>${I_3} is yanked off ${C}'s hand by ${this}!</span>`, `<span class='userdanger'>A tentacle pulls ${I_3} away from you!</span>`);
						yield* this.on_hit(I_3);
						return 1;
					} else {
						to_chat(this.firer, `<span class='danger'>You can't seem to pry ${I_3} off ${C}'s hands!<span>`);
						return 0;
					}
				} else {
					to_chat(this.firer, `<span class='danger'>${C} has nothing in hand to disarm!<span>`);
					return 0;
				}
			} else if (this.firer.a_intent === "grab") {
				C.visible_message(`<span class='danger'>${L} is grabbed by ${H}'s tentacle!</span>`, `<span class='userdanger'>A tentacle grabs you and pulls you towards ${H}!</span>`);
				yield* C.throw_at(get_step_towards(H, C), 8, 2, { callback: (yield* new_(T("/datum/callback"), this, P("/obj/item/projectile/tentacle/proc/tentacle_grab"), H, C)) });
				return 1;
			} else if (this.firer.a_intent === "harm") {
				C.visible_message(`<span class='danger'>${L} is thrown towards ${H} by a tentacle!</span>`, `<span class='userdanger'>A tentacle grabs you and throws you towards ${H}!</span>`);
				yield* C.throw_at(get_step_towards(H, C), 8, 2, { callback: (yield* new_(T("/datum/callback"), this, P("/obj/item/projectile/tentacle/proc/tentacle_stab"), H, C)) });
				return 1;
			}
		} else {
			L.visible_message(`<span class='danger'>${L} is pulled by ${H}'s tentacle!</span>`, `<span class='userdanger'>A tentacle grabs you and pulls you towards ${H}!</span>`);
			yield* L.throw_at(get_step_towards(H, L), 8, 2);
			f.dot = 1;
		}
	}
	return f.dot;
}, true);

// mutations.dm:363
rt.def("/obj/item/projectile/tentacle/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.chain);
	this.source = null;
	return (yield* parent_proc());
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

// mutations.dm:383
rt.def("/obj/effect/proc_holder/changeling/weapon/shield/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, S: Value = null;
	if (!(changeling = user.mind.changeling)) {
		return f.dot;
	}
	(S = (yield* parent_proc(user))).remaining_uses = round(changeling.absorbedcount * 3);
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

// mutations.dm:402
rt.def("/obj/item/weapon/shield/changeling/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!ismob(this.loc)) return f.dot;
	this.loc.visible_message(`<span class='warning'>The end of ${this.loc.name}'s hand inflates rapidly, forming a huge shield-like mass!</span>`, "<span class='warning'>We inflate our hand into a strong shield.</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
	return f.dot;
}, true);

// mutations.dm:407
rt.def("/obj/item/weapon/shield/changeling/proc/hit_reaction", function* hit_reaction(f: Frame) {
	let H: Value = null;
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (this.remaining_uses < 1) {
		if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
			(H = this.loc).visible_message(`<span class='warning'>With a sickening crunch, ${H} reforms his shield into an arm!</span>`, "<span class='notice'>We assimilate our shield into our body</span>", "<span class='italics>You hear organic matter ripping and tearing!</span>");
		}
		yield* qdel(this);
		return 0;
	} else {
		this.remaining_uses--;
		return (yield* parent_proc());
	}
}, true, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(7701, "/obj/item/clothing/suit/space/changeling", "/obj/item/clothing/suit/space", {
	flags: 16387,
	name: "flesh mass",
	icon_state: "lingspacesuit",
	desc: "A huge, bulky mass of pressure and temperature-resistant organic tissue, evolved to facilitate space travel.",
	allowed: null,
	armor: null,
});

// mutations.dm:441
rt.def("/obj/item/clothing/suit/space/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/tank/internals/oxygen"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]);
	return f.dot;
});

// mutations.dm:445
rt.def("/obj/item/clothing/suit/space/changeling/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (ismob(this.loc)) {
		this.loc.visible_message(`<span class='warning'>${this.loc.name}'s flesh rapidly inflates, forming a bloated mass around their body!</span>`, "<span class='warning'>We inflate our flesh, creating a spaceproof suit!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// mutations.dm:451
rt.def("/obj/item/clothing/suit/space/changeling/proc/process", function* process(f: Frame) {
	let H: Value = null;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = this.loc).reagents.add_reagent("salbutamol", REAGENTS_METABOLISM);
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

// mutations.dm:460
rt.def("/obj/item/clothing/head/helmet/space/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]);
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

// mutations.dm:486
rt.def("/obj/item/clothing/suit/armor/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 10, "bio", 4, "rad", 0, "fire", 90, "acid", 90]);
	return f.dot;
});

// mutations.dm:492
rt.def("/obj/item/clothing/suit/armor/changeling/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!ismob(this.loc)) return f.dot;
	this.loc.visible_message(`<span class='warning'>${this.loc.name}'s flesh turns black, quickly transforming into a hard, chitinous mass!</span>`, "<span class='warning'>We harden our flesh, creating a suit of armor!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
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

// mutations.dm:501
rt.def("/obj/item/clothing/head/helmet/changeling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 40, "laser", 40, "energy", 20, "bomb", 10, "bio", 4, "rad", 0, "fire", 90, "acid", 90]);
	return f.dot;
});
