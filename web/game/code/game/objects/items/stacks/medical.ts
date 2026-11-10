// Based on /tg/station's code/game/objects/items/stacks/medical.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(9099, "/obj/item/stack/medical", "/obj/item/stack", {
	heal_brute: 0,
	heal_burn: 0,
	stop_bleeding: 0,
	self_delay: 50,
	throw_speed: 3,
	throw_range: 7,
	name: "medical pack",
	singular_name: "medical pack",
	icon: rt.rsc("icons/obj/items.dmi"),
	amount: 6,
	max_amount: 6,
	w_class: 1,
	full_w_class: 1,
	resistance_flags: 4,
	obj_integrity: 40,
	max_integrity: 40,
	novariants: 0,
});

// medical.dm:22
rt.def("/obj/item/stack/medical/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let t_him: Value = null, affecting: Value = null, C: Value = null, H: Value = null, critter: Value = null, t_himself: Value = null;
	if (M.stat == 2) {
		t_him = "it";
		if (M.gender == "male") {
			t_him = "him";
		} else if (M.gender == "female") {
			t_him = "her";
		}
		to_chat(user, fmt("<span class='danger'>＄！ is dead, you cannot help ＀!</span>", [M, t_him]));
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/carbon")) && !rt.istype(M, T("/mob/living/simple_animal"))) {
		to_chat(user, fmt("<span class='danger'>You don't know how to apply ％！ to ＀!</span>", [this, M]));
		return 1;
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (!(affecting = (C = M).get_bodypart(check_zone(user.zone_selected)))) {
			to_chat(user, fmt("<span class='warning'>＀ doesn't have ＇！!</span>", [C, parse_zone(user.zone_selected)]));
			return f.dot;
		}
		if (rt.istype(C, T("/mob/living/carbon/human"))) {
			H = C;
			if (this.stop_bleeding) {
				if (H.bleedsuppress) {
					to_chat(user, `<span class='warning'>${H}'s bleeding is already bandaged!</span>`);
					return f.dot;
				} else if (!H.bleed_rate) {
					to_chat(user, `<span class='warning'>${H} isn't bleeding!</span>`);
					return f.dot;
				}
			}
		}
	}
	if (rt.istype(M, T("/mob/living"))) {
		if (!(yield* M.can_inject(user, 1))) {
			return f.dot;
		}
	}
	if (user) {
		if (M != user) {
			if (rt.istype(M, T("/mob/living/simple_animal"))) {
				if (!(critter = M).healable) {
					to_chat(user, `<span class='notice'> You cannot use ${this} on ${M}!</span>`);
					return f.dot;
				} else if (critter.health == critter.maxHealth) {
					to_chat(user, `<span class='notice'> ${M} is at full health.</span>`);
					return f.dot;
				} else if (this.heal_brute < 1) {
					to_chat(user, `<span class='notice'> ${this} won't help ${M} at all.</span>`);
					return f.dot;
				}
			}
			user.visible_message(`<span class='green'>${user} applies ${this} on ${M}.</span>`, `<span class='green'>You apply ${this} on ${M}.</span>`);
		} else {
			t_himself = "itself";
			if (user.gender == "male") {
				t_himself = "himself";
			} else if (user.gender == "female") {
				t_himself = "herself";
			}
			user.visible_message(`<span class='notice'>${user} starts to apply ${this} on ${t_himself}...</span>`, `<span class='notice'>You begin applying ${this} on yourself...</span>`);
			if (!(yield* do_mob(user, M, this.self_delay, { extra_checks: (yield* new_(T("/datum/callback"), M, P("/mob/living/proc/can_inject"), user, 1)) }))) {
				return f.dot;
			}
			user.visible_message(`<span class='green'>${user} applies ${this} on ${t_himself}.</span>`, `<span class='green'>You apply ${this} on yourself.</span>`);
		}
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (!(affecting = (C = M).get_bodypart(check_zone(user.zone_selected)))) {
			to_chat(user, fmt("<span class='warning'>＀ doesn't have ＇！!</span>", [C, parse_zone(user.zone_selected)]));
			return f.dot;
		}
		if (rt.istype(C, T("/mob/living/carbon/human"))) {
			H = C;
			if (this.stop_bleeding) {
				if (!H.bleedsuppress) {
					yield* H.suppress_bloodloss(this.stop_bleeding);
				}
			}
		}
		if (affecting.status == BODYPART_ORGANIC) {
			if (yield* affecting.heal_damage(this.heal_brute, this.heal_burn)) {
				C.update_damage_overlays();
			}
		} else {
			to_chat(user, "<span class='notice'>Medicine won't work on a robotic limb!</span>");
		}
	} else {
		yield* M.heal_bodypart_damage(this.heal_brute / 2, this.heal_burn / 2);
	}
	yield* this.use(1);
	return f.dot;
}, true);

rt.type(9103, "/obj/item/stack/medical/gauze/cyborg", "/obj/item/stack/medical/gauze", {
	materials: null,
	is_cyborg: 1,
	cost: 250,
});

// medical.dm:132
rt.def("/obj/item/stack/medical/gauze/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});
