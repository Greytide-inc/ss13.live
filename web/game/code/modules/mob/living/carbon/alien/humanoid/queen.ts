// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/queen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// queen.dm:12
rt.def("/mob/living/carbon/alien/humanoid/royal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 20, T("/obj/item/stack/sheet/animalhide/xeno"), 3]);
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

// queen.dm:25
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.smallsprite = (yield* new_(T("/datum/action/small_sprite")));
	return f.dot;
}, true);

rt.type(266, "/datum/action/small_sprite", "/datum/action", {
	small: 0,
	name: "Toggle Giant Sprite - Others will always see you as giant",
	button_icon_state: "smallqueen",
	background_icon_state: "bg_alien",
});

// queen.dm:34
rt.def("/datum/action/small_sprite/proc/Trigger", function* Trigger(f: Frame) {
	let I: Value = null;
	yield* parent_proc();
	if (!this.small) {
		(I = (yield* image({ icon: rt.rsc("icons/mob/alien.dmi"), icon_state: "alienq", loc: this.owner }))).override = 1;
		I.pixel_x -= this.owner.pixel_x;
		I.pixel_y -= this.owner.pixel_y;
		yield* this.owner.add_alt_appearance(T("/datum/atom_hud/alternate_appearance/basic"), "smallqueen", I);
		this.small = 1;
	} else {
		yield* this.owner.remove_alt_appearance("smallqueen");
		this.small = 0;
	}
	return f.dot;
}, true);

// queen.dm:49
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/Initialize", function* Initialize(f: Frame) {
	let Q: Value = null;
	for (Q of each(GLOB.living_mob_list, T("/mob/living/carbon/alien/humanoid/royal/queen"))) {
		if (Q == this) {
			continue;
		}
		if (Q.stat == 2) {
			continue;
		}
		if (Q.client) {
			this.name = `alien princess (${rand(1, 999)})`;
			break;
		}
	}
	this.real_name = this.name;
	yield* this.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/repulse/xeno"), this)));
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/royal/queen/promote"))));
	yield* this.smallsprite.Grant(this);
	yield* parent_proc();
	return f.dot;
}, true);

// queen.dm:66
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/plasmavessel/large/queen")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/resinspinner")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/acid")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/neurotoxin")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/eggsac")));
	yield* parent_proc();
	return f.dot;
}, true);

// queen.dm:74
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot += 3;
	return f.dot;
});

rt.type(11396, "/obj/effect/proc_holder/alien/lay_egg", "/obj/effect/proc_holder/alien", {
	plasma_cost: 75,
	check_turf: 1,
	action_icon_state: "alien_egg",
	name: "Lay Egg",
	desc: "Lay an egg to produce huggers to impregnate prey with.",
});

// queen.dm:86
rt.def("/obj/effect/proc_holder/alien/lay_egg/proc/fire", function* fire(f: Frame, user: Value) {
	if (rt.locateIn(f, T("/obj/structure/alien/egg"), rt.getStep(f, user, 0))) {
		to_chat(user, "There's already an egg here.");
		return 0;
	}
	user.visible_message(`<span class='alertalien'>${user} has laid an egg!</span>`);
	yield* new_(T("/obj/structure/alien/egg"), user.loc);
	return 1;
}, true);

rt.type(11399, "/obj/effect/proc_holder/alien/royal/queen/promote", "/obj/effect/proc_holder/alien/royal/queen", {
	plasma_cost: 500,
	action_icon_state: "alien_queen_promote",
	name: "Create Royal Parasite",
	desc: "Produce a royal parasite to grant one of your children the honor of being your Praetorian.",
});

// queen.dm:105
rt.def("/obj/effect/proc_holder/alien/royal/queen/promote/proc/fire", function* fire(f: Frame, user: Value) {
	let prom: Value = null;
	if (get_alien_type(T("/mob/living/carbon/alien/humanoid/royal/praetorian"))) {
		to_chat(user, "<span class='noticealien'>You already have a Praetorian!</span>");
		return 0;
	} else {
		for (prom of each(user, T("/obj/item/queenpromote"))) {
			to_chat(user, `<span class='noticealien'>You discard ${prom}.</span>`);
			yield* qdel(prom);
			return 0;
		}
		prom = (yield* new_(T("/obj/item/queenpromote"), user.loc));
		if (!(yield* user.put_in_active_hand(prom, 1))) {
			to_chat(user, "<span class='warning'>You must empty your hands before preparing the parasite.</span>");
			return 0;
		} else {
			to_chat(user, "<span class='noticealien'>Use the royal parasite on one of your children to promote her to Praetorian!</span>");
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

// queen.dm:130
rt.def("/obj/item/queenpromote/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let A: Value = null, new_prae: Value = null;
	if (!rt.istype(M, T("/mob/living/carbon/alien/humanoid")) || rt.istype(M, T("/mob/living/carbon/alien/humanoid/royal"))) {
		to_chat(user, "<span class='noticealien'>You may only use this with your adult, non-royal children!</span>");
		return f.dot;
	}
	if (get_alien_type(T("/mob/living/carbon/alien/humanoid/royal/praetorian"))) {
		to_chat(user, "<span class='noticealien'>You already have a Praetorian!</span>");
		return f.dot;
	}
	if ((A = M).stat == 0 && A.mind && A.key) {
		if (!(yield* user.usePlasma(500))) {
			to_chat(user, "<span class='noticealien'>You must have 500 plasma stored to use this!</span>");
			return f.dot;
		}
		to_chat(A, "<span class='noticealien'>The queen has granted you a promotion to Praetorian!</span>");
		user.visible_message(`<span class='alertalien'>${A} begins to expand, twist and contort!</span>`);
		new_prae = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/praetorian"), A.loc));
		yield* A.mind.transfer_to(new_prae);
		yield* qdel(A);
		yield* qdel(this);
		return f.dot;
	} else {
		to_chat(user, "<span class='warning'>This child must be alert and responsive to become a Praetorian!</span>");
	}
	return f.dot;
}, true);

// queen.dm:154
rt.def("/obj/item/queenpromote/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	to_chat(user, `<span class='noticealien'>You discard ${this}.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);
