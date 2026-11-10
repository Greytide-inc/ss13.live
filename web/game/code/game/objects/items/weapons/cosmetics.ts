// Based on /tg/station's code/game/objects/items/weapons/cosmetics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7148, "/obj/item/weapon/lipstick/random", "/obj/item/weapon/lipstick", {
	name: "lipstick",
});

// cosmetics.dm:30
rt.def("/obj/item/weapon/lipstick/random/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.colour = pick("red", "purple", "lime", "black", "green", "blue", "white");
	this.name = `${this.colour} lipstick`;
	return f.dot;
}, true);

rt.type(7144, "/obj/item/weapon/lipstick", "/obj/item/weapon", {
	colour: "red",
	open: 0,
	gender: "plural",
	name: "red lipstick",
	desc: "A generic brand of lipstick.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "lipstick",
	w_class: 1,
});

// cosmetics.dm:37
rt.def("/obj/item/weapon/lipstick/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let colored_overlay: Value = null;
	let $2: any;
	this.cut_overlays();
	let $0: any = user;
	let $1: any = this;
	if (this.open) {

		$2 = "closed";
	} else {
		$2 = "open";
	}
	to_chat($0, fmt("<span class='notice'>You twist ％！ ＀.</span>", [$1, $2]));
	this.open = (!this.open ? 1 : 0);
	if (this.open) {
		(colored_overlay = mutable_appearance(this.icon, "lipstick_uncap_color")).color = this.colour;
		this.icon_state = "lipstick_uncap";
		this.add_overlay(colored_overlay);
	} else {
		this.icon_state = "lipstick";
	}
	return f.dot;
});

// cosmetics.dm:49
rt.def("/obj/item/weapon/lipstick/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null;
	if (!this.open) {
		return f.dot;
	}
	if (!ismob(M)) {
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = M).is_mouth_covered()) {
			to_chat(user, `<span class='warning'>Remove ${H == user ? "your" : "their"} mask!</span>`);
			return f.dot;
		}
		if (H.lip_style) {
			to_chat(user, "<span class='warning'>You need to wipe off the old lipstick first!</span>");
			return f.dot;
		}
		if (H == user) {
			user.visible_message(fmt("<span class='notice'>＀ does their lips with ％！.</span>", [user, this]), fmt("<span class='notice'>You take a moment to apply ％！. Perfect!</span>", [this]));
			H.lip_style = "lipstick";
			H.lip_color = this.colour;
			yield* H.update_body();
		} else {
			user.visible_message(fmt("<span class='warning'>＀ begins to do ＀'s lips with ％！.</span>", [user, H, this]), fmt("<span class='notice'>You begin to apply ％！ on ＀'s lips...</span>", [this, H]));
			if (yield* do_after(user, 20, { target: H })) {
				user.visible_message(fmt("＀ does ＀'s lips with ％！.", [user, H, this]), fmt("<span class='notice'>You apply ％！ on ＀'s lips.</span>", [this, H]));
				H.lip_style = "lipstick";
				H.lip_color = this.colour;
				yield* H.update_body();
			}
		}
	} else {
		to_chat(user, "<span class='warning'>Where are the lips on that?</span>");
	}
	return f.dot;
}, true);

// cosmetics.dm:83
rt.def("/obj/item/weapon/paper/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null;
	if (user.zone_selected == "mouth") {
		if (!ismob(M)) {
			return f.dot;
		}
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			if ((H = M) == user) {
				to_chat(user, `<span class='notice'>You wipe off the lipstick with ${this}.</span>`);
				H.lip_style = null;
				yield* H.update_body();
			} else {
				user.visible_message(fmt("<span class='warning'>＀ begins to wipe ＀'s lipstick off with ％！.</span>", [user, H, this]), `<span class='notice'>You begin to wipe off ${H}'s lipstick...</span>`);
				if (yield* do_after(user, 10, { target: H })) {
					user.visible_message(fmt("＀ wipes ＀'s lipstick off with ％！.", [user, H, this]), `<span class='notice'>You wipe off ${H}'s lipstick.</span>`);
					H.lip_style = null;
					yield* H.update_body();
				}
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(7149, "/obj/item/weapon/razor", "/obj/item/weapon", {
	flags: 64,
	name: "electric razor",
	desc: "The latest and greatest power razor born from the science of shaving.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "razor",
	w_class: 1,
});

// cosmetics.dm:115
rt.def("/obj/item/weapon/razor/proc/shave", function* shave(f: Frame, H: Value, location: Value) {
	location ??= "mouth";
	if (location == "mouth") {
		H.facial_hair_style = "Shaved";
	} else {
		H.hair_style = "Skinhead";
	}
	yield* H.update_hair();
	playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 20, 1);
	return f.dot;
}, true);

// cosmetics.dm:125
rt.def("/obj/item/weapon/razor/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null, location: Value = null, H_loc: Value = null;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		H = M;
		if ((location = user.zone_selected) == "mouth") {
			if (!rt.isIn(f, FACEHAIR, H.dna.species.species_traits)) {
				to_chat(user, "<span class='warning'>There is no facial hair to shave!</span>");
				return f.dot;
			}
			if (!get_location_accessible(H, location)) {
				to_chat(user, "<span class='warning'>The mask is in the way!</span>");
				return f.dot;
			}
			if (H.facial_hair_style == "Shaved") {
				to_chat(user, "<span class='warning'>Already clean-shaven!</span>");
				return f.dot;
			}
			if (H == user) {
				user.visible_message(`${user} starts to shave their facial hair with ${this}.`, `<span class='notice'>You take a moment to shave your facial hair with ${this}...</span>`);
				if (yield* do_after(user, 50, { target: H })) {
					user.visible_message(`${user} shaves his facial hair clean with ${this}.`, `<span class='notice'>You finish shaving with ${this}. Fast and clean!</span>`);
					yield* this.shave(H, location);
				}
			} else {
				H_loc = H.loc;
				user.visible_message(`<span class='warning'>${user} tries to shave ${H}'s facial hair with ${this}.</span>`, `<span class='notice'>You start shaving ${H}'s facial hair...</span>`);
				if (yield* do_after(user, 50, { target: H })) {
					if (H_loc == H.loc) {
						user.visible_message(`<span class='warning'>${user} shaves off ${H}'s facial hair with ${this}.</span>`, `<span class='notice'>You shave ${H}'s facial hair clean off.</span>`);
						yield* this.shave(H, location);
					}
				}
			}
		} else if (location == "head") {
			if (!rt.isIn(f, HAIR, H.dna.species.species_traits)) {
				to_chat(user, "<span class='warning'>There is no hair to shave!</span>");
				return f.dot;
			}
			if (!get_location_accessible(H, location)) {
				to_chat(user, "<span class='warning'>The headgear is in the way!</span>");
				return f.dot;
			}
			if (H.hair_style == "Bald" || H.hair_style == "Balding Hair" || H.hair_style == "Skinhead") {
				to_chat(user, "<span class='warning'>There is not enough hair left to shave!</span>");
				return f.dot;
			}
			if (H == user) {
				user.visible_message(`${user} starts to shave their head with ${this}.`, `<span class='notice'>You start to shave your head with ${this}...</span>`);
				if (yield* do_after(user, 5, { target: H })) {
					user.visible_message(`${user} shaves his head with ${this}.`, `<span class='notice'>You finish shaving with ${this}.</span>`);
					yield* this.shave(H, location);
				}
			} else {
				H_loc = H.loc;
				user.visible_message(`<span class='warning'>${user} tries to shave ${H}'s head with ${this}!</span>`, `<span class='notice'>You start shaving ${H}'s head...</span>`);
				if (yield* do_after(user, 50, { target: H })) {
					if (H_loc == H.loc) {
						user.visible_message(`<span class='warning'>${user} shaves ${H}'s head bald with ${this}!</span>`, `<span class='notice'>You shave ${H}'s head bald.</span>`);
						yield* this.shave(H, location);
					}
				}
			}
		} else {
			yield* parent_proc();
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
