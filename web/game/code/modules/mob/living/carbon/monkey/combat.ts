// Based on /tg/station's code/modules/mob/living/carbon/monkey/combat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


rt.type(4819, "/mob/living/carbon/monkey", "/mob/living/carbon", {
	aggressive: 0,
	frustration: 0,
	pickupTimer: 0,
	enemies: null,
	target: null,
	pickupTarget: null,
	mode: 0,
	myPath: null,
	blacklistItems: null,
	maxStepsTick: 6,
	best_force: 0,
	martial_art: null,
	resisting: 0,
	pickpocketing: 0,
	disposing_body: 0,
	bodyDisposal: null,
	next_battle_screech: 0,
	battle_screech_cooldown: 50,
	verb_say: "chimpers",
	initial_language_holder: rt.typePath("/datum/language_holder/monkey"),
	pass_flags: 1,
	name: "monkey",
	voice_name: "monkey",
	icon: rt.rsc("icons/mob/monkey.dmi"),
	icon_state: "",
	gender: "neuter",
	ventcrawler: 1,
	butcher_results: null,
	unique_name: 1,
	type_of_meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"),
	gib_type: rt.typePath("/obj/effect/decal/cleanable/blood/gibs"),
	bodyparts: null,
});

// combat.dm:6
rt.def("/mob/living/carbon/monkey/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.enemies = list();

	this.myPath = list();

	this.blacklistItems = list();

	this.martial_art = new_(T("/datum/martial_art"));
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/monkey"), 5, T("/obj/item/stack/sheet/animalhide/monkey"), 1]);

	this.bodyparts = list(T("/obj/item/bodypart/chest/monkey"), T("/obj/item/bodypart/head/monkey"), T("/obj/item/bodypart/l_arm/monkey"), T("/obj/item/bodypart/r_arm/monkey"), T("/obj/item/bodypart/r_leg/monkey"), T("/obj/item/bodypart/l_leg/monkey"));
	return f.dot;
});

// combat.dm:23
rt.def("/mob/living/carbon/monkey/proc/IsStandingStill", function IsStandingStill(f: Frame) {
	return ((this.resisting || this.pickpocketing) || this.disposing_body);
});

// combat.dm:28
rt.def("/mob/living/carbon/monkey/proc/walk2derpless", function* walk2derpless(f: Frame, target: Value) {
	let i: Value = null;
	if (!target || this.IsStandingStill()) {
		return 0;
	}
	if (rt.len(f, this.myPath) <= 0) {
		this.myPath = (yield* get_path_to(this, rt.getStep(f, target, 0), P("/turf/proc/Distance"), 33, 250, 1));
	}
	if (this.myPath) {
		if (rt.len(f, this.myPath) > 0) {
			i = 0;
			while (i < this.maxStepsTick) {
				if (!this.IsDeadOrIncap()) {
					if (rt.len(f, this.myPath) >= 1) {
						walk_to(this, rt.index(this.myPath, 1), 0, 5);
						this.myPath -= rt.index(this.myPath, 1);
					}
				}
				i++;
			}
			return 1;
		}
	}
	walk_to(this, rt.getStep(f, target, 0), 0, 5);
	yield* sleep(1);
	walk_to(this, 0);
	return 0;
}, true);

// combat.dm:52
rt.def("/mob/living/carbon/monkey/proc/IsDeadOrIncap", function IsDeadOrIncap(f: Frame, checkDead: Value) {
	checkDead ??= 1;
	if (!this.canmove) {
		return 1;
	}
	if (this.health <= 0 && checkDead) {
		return 1;
	}
	if (this.IsUnconscious()) {
		return 1;
	}
	if (this.IsStun()) {
		return 1;
	}
	if (this.stat) {
		return 1;
	}
	return 0;
});

// combat.dm:65
rt.def("/mob/living/carbon/monkey/proc/battle_screech", function* battle_screech(f: Frame) {
	let M: Value = null;
	if (!(this.next_battle_screech < rt.worldTime(f))) return f.dot;
	yield* this.emote(pick("roar", "screech"));
	for (M of each(view(7, this), T("/mob/living/carbon/monkey"))) {
		M.next_battle_screech = rt.worldTime(f) + this.battle_screech_cooldown;
	}
	return f.dot;
}, true);

// combat.dm:72
rt.def("/mob/living/carbon/monkey/proc/equip_item", function* equip_item(f: Frame, I: Value) {
	let W: Value = null, C: Value = null;
	if (I.loc == this) {
		return 1;
	}
	if (I.anchored) {
		rt.incAt(this.blacklistItems, I, 1, true);
		return 0;
	}
	if (rt.istype(I, T("/obj/item/weapon"))) {
		if ((W = I).force >= this.best_force) {
			yield* this.put_in_hands(W);
			this.best_force = W.force;
			return 1;
		}
	} else if (rt.istype(I, T("/obj/item/clothing"))) {
		yield* this.monkeyDrop((C = I));
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/carbon/monkey/proc/pickup_and_wear"), C)), 5);
		return 1;
	} else if (!this.get_item_for_held_index(1) || !this.get_item_for_held_index(2)) {
		yield* this.put_in_hands(I);
		return 1;
	}
	rt.incAt(this.blacklistItems, I, 1, true);
	return 0;
}, true);

// combat.dm:104
rt.def("/mob/living/carbon/monkey/proc/pickup_and_wear", function* pickup_and_wear(f: Frame, C: Value) {
	if (yield* this.equip_to_appropriate_slot(C)) return f.dot;
	yield* this.monkeyDrop(this.get_item_by_slot(C));
	yield* sleep(5);
	yield* this.equip_to_appropriate_slot(C);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/item/clothing" }] });

// combat.dm:112
rt.def("/mob/living/carbon/monkey/proc/resist_restraints", function* resist_restraints(f: Frame) {
	let I: Value = null;
	if (this.handcuffed) {
		I = this.handcuffed;
	} else if (this.legcuffed) {
		I = this.legcuffed;
	}
	if (!I) return f.dot;
	this.changeNext_move(100);
	this.last_special = rt.worldTime(f) + 100;
	yield* this.cuff_resist(I);
	return f.dot;
}, true);

// combat.dm:122
rt.def("/mob/living/carbon/monkey/proc/should_target", function should_target(f: Frame, L: Value) {
	if (L == this) {
		return 0;
	}
	if (rt.index(this.enemies, L)) {
		return 1;
	}
	if (this.aggressive && (!rt.istype(L, T("/mob/living/carbon/monkey")) || prob(MONKEY_AGGRESSIVE_MVM_PROB))) {
		return 1;
	}
	return 0;
});

// combat.dm:136
rt.def("/mob/living/carbon/monkey/proc/handle_combat", function* handle_combat(f: Frame) {
	let M: Value = null, around: Value = null, L: Value = null, I: Value = null, H: Value = null, W: Value = null, M_1: Value = null, W_1: Value = null, olddist: Value = null, olddist_0: Value = null;
	let $e: any;
	if (ismob(this.loc)) {
		return 1;
	}
	if (this.on_fire || this.buckled || this.restrained()) {
		if (!this.resisting && prob(MONKEY_RESIST_PROB)) {
			this.resisting = 1;
			walk_to(this, 0);
			yield* this.resist();
		}
	} else {
		this.resisting = 0;
	}
	if (this.IsDeadOrIncap()) {
		return 1;
	}
	if (!rt.locateIn(f, T("/obj/item/weapon"), this.held_items)) {
		this.best_force = 0;
	}
	if (this.restrained() || rt.index(this.blacklistItems, this.pickupTarget) || this.pickupTarget && rt.bitAnd(this.pickupTarget.flags, NODROP)) {
		this.pickupTarget = null;
	}
	if (!this.resisting && this.pickupTarget) {
		this.pickupTimer++;
		if (this.Adjacent(this.pickupTarget) || this.Adjacent(this.pickupTarget.loc)) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/carbon/monkey/proc/walk2derpless"), this.pickupTarget.loc);
			yield* this.drop_all_held_items();
			if (isturf(this.pickupTarget.loc)) {
				yield* this.equip_item(this.pickupTarget);
				this.pickupTarget = null;
				this.pickupTimer = MONKEY_IDLE;
			} else if (ismob(this.pickupTarget.loc)) {
				M = this.pickupTarget.loc;
				if (!this.pickpocketing) {
					this.pickpocketing = 1;
					M.visible_message(`${this} starts trying to take ${this.pickupTarget} from ${M}`, `${this} tries to take ${this.pickupTarget}!`);
					yield* ImmediateInvokeAsync(this, P("/mob/living/carbon/monkey/proc/pickpocket"), M);
				}
			}
		} else if (this.pickupTimer >= 8) {
			rt.incAt(this.blacklistItems, this.pickupTarget, 1, true);
			this.pickupTarget = null;
			this.pickupTimer = MONKEY_IDLE;
		} else {
			yield* ImmediateInvokeAsync(this, P("/mob/living/carbon/monkey/proc/walk2derpless"), this.pickupTarget.loc);
		}
		return 1;
	}
	if (this.pulledby && (this.mode != MONKEY_IDLE || prob(MONKEY_PULL_AGGRO_PROB))) {
		if (this.Adjacent(this.pulledby)) {
			this.a_intent = "disarm";
			yield* this.monkey_attack(this.pulledby);
			yield* this.retaliate(this.pulledby);
			return 1;
		}
	}
	if (this.mode === MONKEY_IDLE) {
		around = view(this, MONKEY_ENEMY_VISION);
		this.bodyDisposal = rt.locateIn(f, T("/obj/machinery/disposal"), around);
		for (L of each(around, T("/mob/living"))) {
			if (this.should_target(L)) {
				if (L.stat == MONKEY_IDLE) {
					yield* this.battle_screech();
					yield* this.retaliate(L);
					return 1;
				} else if (this.bodyDisposal) {
					this.target = L;
					this.mode = MONKEY_DISPOSE;
					return 1;
				}
			}
		}
		if (!this.pickupTarget && prob(MONKEY_PICKUP_PROB)) {
			if ((I = rt.locateIn(f, T("/obj/item"), oview(MONKEY_STEAL_PROB, this))) && !rt.index(this.blacklistItems, I)) {
				this.pickupTarget = I;
			}
		}
		if (!this.pickupTarget && prob(MONKEY_STEAL_PROB)) {
			if (H = rt.locateIn(f, T("/mob/living/carbon/human"), oview(MONKEY_PULL_AGGRO_PROB, this))) {
				this.pickupTarget = pick(H.held_items);
			}
		}
		if (!this.resisting) {
			walk_to(this, MONKEY_IDLE);
		}
		return this.IsStandingStill();
	} else if (this.mode === MONKEY_HUNT) {
		if (this.health < MONKEY_FLEE_HEALTH) {
			this.mode = MONKEY_FLEE;
			return MONKEY_HUNT;
		}
		if (this.target !== null) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/carbon/monkey/proc/walk2derpless"), this.target);
		}
		if (!this.pickupTarget && prob(MONKEY_WEAPON_PROB)) {
			if ((W = rt.locateIn(f, T("/obj/item/weapon"), oview(2, this))) && !rt.index(this.blacklistItems, W) && W.force > this.best_force) {
				this.pickupTarget = W;
			}
		}
		around = view(this, MONKEY_ENEMY_VISION);
		for (M_1 of each(around, T("/mob/living/carbon/monkey"))) {
			if (M_1.mode == MONKEY_IDLE && prob(MONKEY_RECRUIT_PROB)) {
				yield* M_1.battle_screech();
				M_1.target = this.target;
				M_1.mode = MONKEY_HUNT;
			}
		}
		L = null;
		for (L of each(around, T("/mob/living"))) {
			if (L != this.target && this.should_target(L) && L.stat == MONKEY_IDLE && prob(MONKEY_SWITCH_TARGET_PROB)) {
				this.target = L;
				return 1;
			}
		}
		if (this.frustration >= MONKEY_HUNT_FRUSTRATION_LIMIT) {
			yield* this.back_to_idle();
			return 1;
		}
		if (this.target && this.target.stat == MONKEY_IDLE) {
			if (this.Adjacent(this.target) && isturf(this.target.loc)) {
				if ((W_1 = rt.locateIn(f, T("/obj/item/weapon"), this.target.held_items)) && prob(MONKEY_ATTACK_DISARM_PROB)) {
					this.pickupTarget = W_1;
					this.a_intent = "disarm";
					yield* this.monkey_attack(this.target);
				} else {
					this.a_intent = "harm";
					yield* this.monkey_attack(this.target);
				}
				return MONKEY_HUNT;
			} else {
				olddist = get_dist(this, this.target);
				if (get_dist(this, this.target) >= olddist) {
					this.frustration++;
				} else {
					this.frustration = 0;
				}
			}
		} else {
			yield* this.back_to_idle();
		}
	} else if (this.mode === MONKEY_FLEE) {
		around = view(this, MONKEY_FLEE_VISION);
		this.target = null;
		L = null;
		for (L of each(around, T("/mob/living"))) {
			if (rt.index(this.enemies, L) && L.stat == 0) {
				this.target = L;
			}
		}
		if (this.target !== null) {
			walk_away(this, this.target, MONKEY_ENEMY_VISION, 5);
		} else {
			yield* this.back_to_idle();
		}
		return 1;
	} else if (this.mode === MONKEY_DISPOSE) {
		if (!this.target || !this.bodyDisposal || this.frustration >= MONKEY_DISPOSE_FRUSTRATION_LIMIT) {
			yield* this.back_to_idle();
			return 1;
		}
		if (this.target.pulledby != this && !rt.istype(this.target.pulledby, T("/mob/living/carbon/monkey"))) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/carbon/monkey/proc/walk2derpless"), this.target.loc);
			if (this.Adjacent(this.target) && isturf(this.target.loc)) {
				this.a_intent = "grab";
				yield* this.target.grabbedby(this);
			} else {
				olddist_0 = get_dist(this, this.target);
				if (get_dist(this, this.target) >= olddist_0) {
					this.frustration++;
				} else {
					this.frustration = 0;
				}
			}
		} else if (!this.disposing_body) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/carbon/monkey/proc/walk2derpless"), this.bodyDisposal.loc);
			if (this.Adjacent(this.bodyDisposal)) {
				this.disposing_body = 1;
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/carbon/monkey/proc/stuff_mob_in"))), 5);
			} else {
				olddist_0 = get_dist(this, this.bodyDisposal);
				if (get_dist(this, this.bodyDisposal) >= olddist_0) {
					this.frustration++;
				} else {
					this.frustration = 0;
				}
			}
		}
		return 1;
	}
	return this.IsStandingStill();
}, true);

// combat.dm:356
rt.def("/mob/living/carbon/monkey/proc/pickpocket", function* pickpocket(f: Frame, M: Value) {
	let I: Value = null;
	if ((yield* do_mob(this, M, MONKEY_ITEM_SNATCH_DELAY)) && this.pickupTarget) {
		for (I of each(M.held_items, T("/obj/item"))) {
			if (I == this.pickupTarget) {
				M.visible_message(`<span class='danger'>${this} snatches ${this.pickupTarget} from ${M}.</span>`, `<span class='userdanger'>${this} snatched ${this.pickupTarget}!</span>`);
				if ((yield* M.temporarilyRemoveItemFromInventory(this.pickupTarget)) && !(!this.pickupTarget || this.pickupTarget.gc_destroyed)) {
					yield* this.equip_item(this.pickupTarget);
				} else {
					M.visible_message(`<span class='danger'>${this} tried to snatch ${this.pickupTarget} from ${M}, but failed!</span>`, `<span class='userdanger'>${this} tried to grab ${this.pickupTarget}!</span>`);
				}
			}
		}
	}
	this.pickpocketing = 0;
	this.pickupTarget = null;
	this.pickupTimer = 0;
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// combat.dm:369
rt.def("/mob/living/carbon/monkey/proc/stuff_mob_in", function* stuff_mob_in(f: Frame) {
	if (this.bodyDisposal && this.target && this.Adjacent(this.bodyDisposal)) {
		yield* this.bodyDisposal.stuff_mob_in(this.target, this);
	}
	this.disposing_body = 0;
	yield* this.back_to_idle();
	return f.dot;
}, true);

// combat.dm:377
rt.def("/mob/living/carbon/monkey/proc/back_to_idle", function* back_to_idle(f: Frame) {
	if (this.pulling) {
		yield* this.stop_pulling();
	}
	this.mode = 0;
	this.target = null;
	this.a_intent = "help";
	this.frustration = 0;
	walk_to(this, 0);
	return f.dot;
}, true);

// combat.dm:387
rt.def("/mob/living/carbon/monkey/proc/monkey_attack", function* monkey_attack(f: Frame, L: Value) {
	let Weapon: Value = null;
	if (Weapon = rt.locateIn(f, T("/obj/item/weapon"), this.held_items)) {
		yield* L.attackby(Weapon, this);
	} else {
		yield* L.attack_paw(this);
	}
	if (this.aggressive) {
		return f.dot;
	}
	if (!rt.index(this.enemies, L)) {
		if (this.target == L && prob(MONKEY_HATRED_REDUCTION_PROB)) {
			yield* this.back_to_idle();
		}
		return f.dot;
	}
	if (prob(MONKEY_HATRED_REDUCTION_PROB)) {
		rt.incAt(this.enemies, L, -1, true);
	}
	if (!(rt.index(this.enemies, L) <= 0)) return f.dot;
	yield* this.enemies.Remove(L);
	if (this.target != L) return f.dot;
	yield* this.back_to_idle();
	return f.dot;
}, true);

// combat.dm:417
rt.def("/mob/living/carbon/monkey/proc/retaliate", function* retaliate(f: Frame, L: Value) {
	this.mode = MONKEY_HUNT;
	this.target = L;
	rt.modAt(this.enemies, L, MONKEY_HATRED_AMOUNT, add);
	if (this.a_intent == "harm") return f.dot;
	yield* this.battle_screech();
	this.a_intent = "harm";
	return f.dot;
}, true);

// combat.dm:425
rt.def("/mob/living/carbon/monkey/proc/attack_hand", function* attack_hand(f: Frame, L: Value) {
	if (L.a_intent == "harm" && prob(MONKEY_RETALIATE_HARM_PROB)) {
		yield* this.retaliate(L);
	} else if (L.a_intent == "disarm" && prob(MONKEY_RETALIATE_DISARM_PROB)) {
		yield* this.retaliate(L);
	}
	return (yield* parent_proc());
}, true);

// combat.dm:432
rt.def("/mob/living/carbon/monkey/proc/attack_paw", function* attack_paw(f: Frame, L: Value) {
	if (L.a_intent == "harm" && prob(MONKEY_RETALIATE_HARM_PROB)) {
		yield* this.retaliate(L);
	} else if (L.a_intent == "disarm" && prob(MONKEY_RETALIATE_DISARM_PROB)) {
		yield* this.retaliate(L);
	}
	return (yield* parent_proc());
}, true);

// combat.dm:439
rt.def("/mob/living/carbon/monkey/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!(W.force && !this.target && W.damtype != "stamina")) return f.dot;
	yield* this.retaliate(user);
	return f.dot;
}, true);

// combat.dm:444
rt.def("/mob/living/carbon/monkey/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (rt.istype(Proj, T("/obj/item/projectile/beam")) || rt.istype(Proj, T("/obj/item/projectile/bullet"))) {
		if (Proj.damage_type == "fire" || Proj.damage_type == "brute") {
			if (!Proj.nodamage && Proj.damage < this.health) {
				yield* this.retaliate(Proj.firer);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// combat.dm:451
rt.def("/mob/living/carbon/monkey/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null, H: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (rt.istype(f.args[0], T("/obj/item"))) {
		if ((I = f.args[0]).throwforce < this.health && I.thrownby && rt.istype(I.thrownby, T("/mob/living/carbon/human"))) {
			yield* this.retaliate((H = I.thrownby));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// combat.dm:459
rt.def("/mob/living/carbon/monkey/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	if (!this.IsDeadOrIncap() && ismob(AM) && this.target) {
		if (!rt.istype((M = AM), T("/mob/living/carbon/monkey")) || !M) {
			return f.dot;
		}
		yield* this.knockOver(M);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// combat.dm:469
rt.def("/mob/living/carbon/monkey/proc/monkeyDrop", function* monkeyDrop(f: Frame, A: Value) {
	if (!A) return f.dot;
	yield* this.dropItemToGround(A, 1);
	yield* this.update_icons();
	return f.dot;
}, true);
