// Based on /tg/station's code/game/objects/structures/beds_chairs/alien_nest.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12246, "/obj/structure/bed/nest", "/obj/structure/bed", {
	smooth: 1,
	can_be_unanchored: 0,
	canSmoothWith: null,
	flags: 128,
	name: "alien nest",
	desc: "It's a gruesome pile of thick, sticky resin shaped like a nest.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/nest.dmi"),
	icon_state: "nest",
	obj_integrity: 120,
	max_integrity: 120,
	buildstacktype: null,
}, { global: { nest_overlay: 797 } });

// alien_nest.dm:18
rt.def("/obj/structure/bed/nest/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	let buck: Value = null, M: Value = null;
	if (!this.has_buckled_mobs()) return f.dot;
	for (buck of each(this.buckled_mobs)) {
		M = buck;
		if (user.getorgan(T("/obj/item/organ/alien/plasmavessel"))) {
			yield* this.unbuckle_mob(M);
			yield* this.add_fingerprint(user);
			return f.dot;
		}
		if (M != user) {
			M.visible_message(`${user.name} pulls ${M.name} free from the sticky nest!`, `<span class='notice'>${user.name} pulls you free from the gelatinous resin.</span>`, "<span class='italics'>You hear squelching...</span>");
		} else {
			M.visible_message(`<span class='warning'>${M.name} struggles to break free from the gelatinous resin!</span>`, "<span class='notice'>You struggle to break free from the gelatinous resin... (Stay still for two minutes.)</span>", "<span class='italics'>You hear squelching...</span>");
			if (!(yield* do_after(M, 1200, { target: this }))) {
				if (M && M.buckled) {
					to_chat(M, "<span class='warning'>You fail to unbuckle yourself!</span>");
				}
				return f.dot;
			}
			if (!M.buckled) {
				return f.dot;
			}
			M.visible_message(`<span class='warning'>${M.name} breaks free from the gelatinous resin!</span>`, "<span class='notice'>You break free from the gelatinous resin!</span>", "<span class='italics'>You hear squelching...</span>");
		}
		yield* this.unbuckle_mob(M);
		yield* this.add_fingerprint(user);
	}
	return f.dot;
}, true);

// alien_nest.dm:52
rt.def("/obj/structure/bed/nest/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	if (!ismob(M) || get_dist(this, user) > 1 || M.loc != this.loc || user.incapacitated() || M.buckled) {
		return f.dot;
	}
	if (M.getorgan(T("/obj/item/organ/alien/plasmavessel"))) {
		return f.dot;
	}
	if (!user.getorgan(T("/obj/item/organ/alien/plasmavessel"))) {
		return f.dot;
	}
	if (this.has_buckled_mobs()) {
		yield* this.unbuckle_all_mobs();
	}
	if (!(yield* this.buckle_mob(M))) return f.dot;
	M.visible_message(`${user.name} secretes a thick vile goo, securing ${M.name} into ${this}!`, `<span class='danger'>${user.name} drenches you in a foul-smelling resin, trapping you in ${this}!</span>`, "<span class='italics'>You hear squelching...</span>");
	return f.dot;
}, true);

// alien_nest.dm:70
rt.def("/obj/structure/bed/nest/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (rt.isIn(f, M, this.buckled_mobs)) {
		M.pixel_y = 0;
		M.pixel_x = rt.initial(f, M, "pixel_x") + 2;
		M.layer = BELOW_MOB_LAYER;
		this.add_overlay(GLOB.nest_overlay);
	} else {
		M.pixel_x = M.get_standard_pixel_x_offset(M.lying);
		M.pixel_y = M.get_standard_pixel_y_offset(M.lying);
		M.layer = rt.initial(f, M, "layer");
		this.cut_overlay(GLOB.nest_overlay);
	}
	return f.dot;
});

// alien_nest.dm:82
rt.def("/obj/structure/bed/nest/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/attackblob.ogg"), 100, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// alien_nest.dm:89
rt.def("/obj/structure/bed/nest/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	if (user.a_intent != "harm") {
		return (yield* this.attack_hand(user));
	}
	return (yield* parent_proc());
}, true);
