// Based on /tg/station's code/modules/reagents/reagent_containers/dropper.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6516, "/obj/item/weapon/reagent_containers/dropper", "/obj/item/weapon/reagent_containers", {
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 5,
	container_type: 8192,
	name: "dropper",
	desc: "A dropper. Holds up to 5 units.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "dropper0",
});

// dropper.dm:12
rt.def("/obj/item/weapon/reagent_containers/dropper/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null, fraction: Value = null, victim: Value = null, safe_thing: Value = null, M: Value = null, R: Value = null, A: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!target.reagents) {
		return f.dot;
	}
	if (this.reagents.total_volume > 0) {
		if (target.reagents.total_volume >= target.reagents.maximum_volume) {
			to_chat(user, `<span class='notice'>${target} is full.</span>`);
			return f.dot;
		}
		if (!(yield* target.is_injectable())) {
			to_chat(user, `<span class='warning'>You cannot directly fill ${target}!</span>`);
			return f.dot;
		}
		trans = 0;
		fraction = min(this.amount_per_transfer_from_this / this.reagents.total_volume, 1);
		if (ismob(target)) {
			if (rt.istype(target, T("/mob/living/carbon/human"))) {
				victim = target;
				if (victim.wear_mask) {
					if (rt.bitAnd(victim.wear_mask.flags_cover, MASKCOVERSEYES)) {
						safe_thing = victim.wear_mask;
					}
				}
				if (victim.head) {
					if (rt.bitAnd(victim.head.flags_cover, MASKCOVERSEYES)) {
						safe_thing = victim.head;
					}
				}
				if (victim.glasses) {
					if (!safe_thing) {
						safe_thing = victim.glasses;
					}
				}
				if (safe_thing) {
					if (!safe_thing.reagents) {
						yield* safe_thing.create_reagents(100);
					}
					yield* this.reagents.reaction(safe_thing, TOUCH, fraction);
					trans = (yield* this.reagents.trans_to(safe_thing, this.amount_per_transfer_from_this));
					target.visible_message(`<span class='danger'>${user} tries to squirt something into ${target}'s eyes, but fails!</span>`, `<span class='userdanger'>${user} tries to squirt something into ${target}'s eyes, but fails!</span>`);
					to_chat(user, fmt("<span class='notice'>You transfer ＀ unit５ of the solution.</span>", [trans]));
					yield* this.update_icon();
					return f.dot;
				}
			} else if (rt.istype(target, T("/mob/living/carbon/alien"))) {
				to_chat(target, `<span class='danger'>${target} does not seem to have any eyes!</span>`);
				return f.dot;
			}
			target.visible_message(`<span class='danger'>${user} squirts something into ${target}'s eyes!</span>`, `<span class='userdanger'>${user} squirts something into ${target}'s eyes!</span>`);
			yield* this.reagents.reaction(target, TOUCH, fraction);
			M = target;
			if (this.reagents) {
				for (A of each(this.reagents.reagent_list, T("/datum/reagent"))) {
					R += A.id + " (";
					R += num2text(A.volume) + "),";
				}
			}
			add_logs(user, M, "squirted", R);
		}
		trans = (yield* this.reagents.trans_to(target, this.amount_per_transfer_from_this));
		to_chat(user, fmt("<span class='notice'>You transfer ＀ unit５ of the solution.</span>", [trans]));
		yield* this.update_icon();
	} else {
		if (!(yield* target.is_drawable(0))) {
			to_chat(user, `<span class='notice'>You cannot directly remove reagents from ${target}.</span>`);
			return f.dot;
		}
		if (!target.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${target} is empty!</span>`);
			return f.dot;
		}
		trans = (yield* target.reagents.trans_to(this, this.amount_per_transfer_from_this));
		to_chat(user, fmt("<span class='notice'>You fill ＀ with ＀ unit５ of the solution.</span>", [this, trans]));
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// dropper.dm:92
rt.def("/obj/item/weapon/reagent_containers/dropper/proc/update_icon", function update_icon(f: Frame) {
	let filling: Value = null;
	this.cut_overlays();
	if (!this.reagents.total_volume) return f.dot;
	(filling = mutable_appearance(rt.rsc("icons/obj/reagentfillings.dmi"), "dropper")).color = mix_color_from_reagents(this.reagents.reagent_list);
	this.add_overlay(filling);
	return f.dot;
});
