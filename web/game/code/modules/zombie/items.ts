// Based on /tg/station's code/modules/zombie/items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10207, "/obj/item/zombie_hand", "/obj/item", {
	icon_left: "bloodhand_left",
	icon_right: "bloodhand_right",
	removing_airlock: 0,
	flags: 16514,
	hitsound: rt.rsc("sound/hallucinations/growl1.ogg"),
	name: "zombie claw",
	desc: "A zombie's claw is its primary tool, capable of infecting humans, butchering all other living things to sustain the zombie, smashing open airlock doors and opening child-safe caps on bottles.",
	resistance_flags: 115,
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "bloodhand_left",
	force: 20,
	damtype: "brute",
});

// items.dm:20
rt.def("/obj/item/zombie_hand/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let i: Value = null;
	f.dot = (yield* parent_proc());
	if (!((i = user.get_held_index_of_item(this)) % 2)) {
		this.icon_state = this.icon_left;
	} else {
		this.icon_state = this.icon_right;
	}
	return f.dot;
}, true);

// items.dm:29
rt.def("/obj/item/zombie_hand/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	f.dot = (yield* parent_proc());
	if (!proximity_flag) {
		return f.dot;
	} else {
		if (!rt.istype(target, T("/mob/living"))) return f.dot;
		if (rt.istype(target, T("/mob/living/carbon/human"))) {
			yield* this.check_infection(target, user);
		} else {
			yield* this.check_feast(target, user);
		}
	}
	return f.dot;
}, true);

// items.dm:39
rt.def("/obj/item/zombie_hand/proc/check_infection", function* check_infection(f: Frame, target: Value, user: Value) {
	let infection: Value = null;
	if (!target.dna || !target.dna.species) {
		return f.dot;
	}
	if (rt.isIn(f, NOZOMBIE, target.dna.species.species_traits)) {
		return f.dot;
	}
	if (infection = target.getorganslot("zombie_infection")) return f.dot;
	yield* (infection = (yield* new_(T("/obj/item/organ/zombie_infection")))).Insert(target);
	return f.dot;
}, true);

// items.dm:53
rt.def("/obj/item/zombie_hand/proc/check_feast", function* check_feast(f: Frame, target: Value, user: Value) {
	if (target.stat != 2) return f.dot;
	let hp_gained: Value = target.maxHealth;
	yield* target.gib();
	yield* user.adjustBruteLoss(-hp_gained, 0);
	yield* user.adjustToxLoss(-hp_gained, 0);
	yield* user.adjustFireLoss(-hp_gained, 0);
	yield* user.adjustCloneLoss(-hp_gained, 0);
	yield* user.updatehealth();
	yield* user.adjustBrainLoss(-hp_gained);
	user.nutrition = min(user.nutrition + hp_gained, NUTRITION_LEVEL_FULL);
	return f.dot;
}, true);
