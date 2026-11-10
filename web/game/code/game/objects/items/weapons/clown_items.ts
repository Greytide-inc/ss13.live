// Based on /tg/station's code/game/objects/items/weapons/clown_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7135, "/obj/item/weapon/soap", "/obj/item/weapon", {
	cleanspeed: 50,
	flags: 4,
	throw_speed: 3,
	throw_range: 7,
	name: "soap",
	desc: "A cheap bar of soap. Doesn't smell.",
	gender: "plural",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "soap",
	w_class: 1,
	throwforce: 0,
	force_string: "robust... against germs",
});

// clown_items.dm:46
rt.def("/obj/item/weapon/soap/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	yield* user.say(";FFFFFFFFFFFFFFFFUUUUUUUDGE!!");
	user.visible_message(`<span class='suicide'>${user} lifts ${this} to their mouth and gnaws on it furiously, producing a thick froth! ${user.p_they(1)}'ll never get that BB gun now!`);
	yield* new_(T("/obj/effect/particle_effect/foam"), this.loc);
	return 4;
}, true);

// clown_items.dm:52
rt.def("/obj/item/weapon/soap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	if (!rt.istype(AM, T("/mob/living/carbon"))) return f.dot;
	yield* (M = AM).slip(80, this);
	return f.dot;
}, true);

// clown_items.dm:57
rt.def("/obj/item/weapon/soap/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let H: Value = null, C: Value = null;
	if (!proximity || !this.check_allowed_items(target)) {
		return f.dot;
	}
	if (user.client && rt.isIn(f, target, user.client.screen)) {
		to_chat(user, `<span class='warning'>You need to take that ${target.name} off before cleaning it!</span>`);
	} else if (rt.istype(target, T("/obj/effect/decal/cleanable"))) {
		user.visible_message(fmt("＀ begins to scrub ％！ out with ＀.", [user, target.name, this]), fmt("<span class='warning'>You begin to scrub ％！ out with ＀...</span>", [target.name, this]));
		if (yield* do_after(user, this.cleanspeed, { target: target })) {
			to_chat(user, fmt("<span class='notice'>You scrub ％！ out.</span>", [target.name]));
			yield* qdel(target);
		}
	} else if (rt.istype(target, T("/mob/living/carbon/human")) && user.zone_selected == "mouth") {
		H = user;
		user.visible_message(fmt("<span class='warning'>％！ washes ％！'s mouth out with ＀!</span>", [user, target, this.name]), fmt("<span class='notice'>You wash ％！'s mouth out with ＀!</span>", [target, this.name]));
		H.lip_style = null;
		yield* H.update_body();
		return f.dot;
	} else if (rt.istype(target, T("/obj/structure/window"))) {
		user.visible_message(fmt("＀ begins to clean ％！ with ＀...", [user, target.name, this]), fmt("<span class='notice'>You begin to clean ％！ with ＀...</span>", [target.name, this]));
		if (yield* do_after(user, this.cleanspeed, { target: target })) {
			to_chat(user, fmt("<span class='notice'>You clean ％！.</span>", [target.name]));
			target.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
			target.set_opacity(rt.initial(f, target, "opacity"));
		}
	} else {
		user.visible_message(fmt("＀ begins to clean ％！ with ＀...", [user, target.name, this]), fmt("<span class='notice'>You begin to clean ％！ with ＀...</span>", [target.name, this]));
		if (yield* do_after(user, this.cleanspeed, { target: target })) {
			to_chat(user, fmt("<span class='notice'>You clean ％！.</span>", [target.name]));
			yield* qdel((C = rt.locateIn(f, T("/obj/effect/decal/cleanable"), target)));
			target.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
			target.clean_blood();
			target.wash_cream();
		}
	}
	return f.dot;
}, true);

rt.type(7140, "/obj/item/weapon/bikehorn", "/obj/item/weapon", {
	next_usable: 0,
	honksound: rt.rsc("sound/items/bikehorn.ogg"),
	cooldowntime: 20,
	throw_speed: 3,
	throw_range: 7,
	name: "bike horn",
	desc: "A horn off of a bicycle.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "bike_horn",
	item_state: "bike_horn",
	throwforce: 0,
	hitsound: null,
	w_class: 1,
	attack_verb: null,
});

// clown_items.dm:108
rt.def("/obj/item/weapon/bikehorn/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("HONKED");
	return f.dot;
});

// clown_items.dm:114
rt.def("/obj/item/weapon/bikehorn/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} solemnly points the horn at ${user.p_their()} temple! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, this.honksound, 50, 1);
	return 1;
});

// clown_items.dm:119
rt.def("/obj/item/weapon/bikehorn/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!(this.next_usable > rt.worldTime(f))) {
		playsound(this.loc, this.honksound, 50, 1, -1);
	}
	return (yield* parent_proc());
}, true);

// clown_items.dm:124
rt.def("/obj/item/weapon/bikehorn/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.next_usable > rt.worldTime(f)) return f.dot;
	this.next_usable = rt.worldTime(f) + this.cooldowntime;
	playsound(this.loc, this.honksound, 50, 1);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// clown_items.dm:130
rt.def("/obj/item/weapon/bikehorn/proc/Crossed", function Crossed(f: Frame, L: Value) {
	if (rt.istype(L, T("/mob/living"))) {
		playsound(this.loc, this.honksound, 50, 1, -1);
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(7142, "/obj/item/weapon/bikehorn/golden", "/obj/item/weapon/bikehorn", {
	name: "golden bike horn",
	desc: "Golden? Clearly, it's made with bananium! Honk!",
	icon_state: "gold_horn",
	item_state: "gold_horn",
});

// clown_items.dm:149
rt.def("/obj/item/weapon/bikehorn/golden/proc/attack", function* attack(f: Frame) {
	yield* this.flip_mobs();
	return (yield* parent_proc());
}, true);

// clown_items.dm:153
rt.def("/obj/item/weapon/bikehorn/golden/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.flip_mobs();
	yield* parent_proc();
	return f.dot;
}, true);

// clown_items.dm:157
rt.def("/obj/item/weapon/bikehorn/golden/proc/flip_mobs", function* flip_mobs(f: Frame, M: Value, user: Value) {
	let H: Value = null;
	if (this.next_usable > rt.worldTime(f)) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	for (M of each(ohearers(7, _T), T("/mob/living/carbon"))) {
		if (rt.istype(M, T("/mob/living/carbon/human")) && M.can_hear()) {
			if (rt.istype((H = M).ears, T("/obj/item/clothing/ears/earmuffs"))) {
				continue;
			}
		}
		yield* M.emote("flip");
	}
	return f.dot;
}, true);

rt.type(5830, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Canned Laughter",
	desc: "Just looking at this makes you want to giggle.",
	icon_state: "laughter",
	list_reagents: null,
});

// clown_items.dm:170
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["laughter", 50]);
	return f.dot;
});
