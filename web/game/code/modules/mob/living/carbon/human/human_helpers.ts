// Based on /tg/station's code/modules/mob/living/carbon/human/human_helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// human_helpers.dm:3
rt.def("/mob/living/carbon/human/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = ((this.wear_suit && this.wear_suit.breakouttime) || parent_proc());
	return f.dot;
}, false);

// human_helpers.dm:7
rt.def("/mob/living/carbon/human/proc/canBeHandcuffed", function canBeHandcuffed(f: Frame) {
	if (this.get_num_arms() >= 2) {
		return 1;
	} else {
		return 0;
	}
});

// human_helpers.dm:15
rt.def("/mob/living/carbon/human/proc/get_assignment", function get_assignment(f: Frame, if_no_id: Value, if_no_job: Value) {
	let id: Value = null, pda: Value = null;
	if_no_id ??= "No id";
	if_no_job ??= "No job";
	if (id = this.get_idcard()) {
		f.dot = id.assignment;
	} else if (rt.istype((pda = this.wear_id), T("/obj/item/device/pda"))) {
		f.dot = pda.ownjob;
	} else {
		return if_no_id;
	}
	if (f.dot) return f.dot;
	return if_no_job;
});

// human_helpers.dm:30
rt.def("/mob/living/carbon/human/proc/get_authentification_name", function get_authentification_name(f: Frame, if_no_id: Value) {
	let id: Value = null, pda: Value = null;
	if_no_id ??= "Unknown";
	if (id = this.get_idcard()) {
		return id.registered_name;
	}
	if (rt.istype((pda = this.wear_id), T("/obj/item/device/pda"))) {
		return pda.owner;
	}
	return if_no_id;
});

// human_helpers.dm:40
rt.def("/mob/living/carbon/human/proc/get_visible_name", function get_visible_name(f: Frame) {
	let face_name: Value = this.get_face_name("");
	let id_name: Value = this.get_id_name("");
	if (this.name_override) {
		return this.name_override;
	}
	if (face_name) {
		if (id_name && id_name != face_name) {
			return `${face_name} (as ${id_name})`;
		}
		return face_name;
	}
	if (id_name) {
		return id_name;
	}
	return "Unknown";
});

// human_helpers.dm:54
rt.def("/mob/living/carbon/human/proc/get_face_name", function get_face_name(f: Frame, if_no_face: Value) {
	let O: Value = null;
	if_no_face ??= "Unknown";
	if (this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) {
		return if_no_face;
	}
	if (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)) {
		return if_no_face;
	}
	if (!(O = this.get_bodypart("head")) || rt.bitAnd(this.status_flags, DISFIGURED) || O.brutestate + O.burnstate > 2 || this.cloneloss > 50 || !this.real_name) {
		return if_no_face;
	}
	return this.real_name;
});

// human_helpers.dm:66
rt.def("/mob/living/carbon/human/proc/get_id_name", function get_id_name(f: Frame, if_no_id: Value) {
	let card_slot: Value = null;
	if_no_id ??= "Unknown";
	let wallet: Value = this.wear_id;
	let pda: Value = this.wear_id;
	let id: Value = this.wear_id;
	let tablet: Value = this.wear_id;
	if (rt.istype(wallet, T("/obj/item/weapon/storage/wallet"))) {
		id = wallet.front_id;
	}
	if (rt.istype(id, T("/obj/item/weapon/card/id"))) {
		f.dot = id.registered_name;
	} else if (rt.istype(pda, T("/obj/item/device/pda"))) {
		f.dot = pda.owner;
	} else if (rt.istype(tablet, T("/obj/item/device/modular_computer/tablet"))) {
		if ((card_slot = rt.index(tablet.all_components, "CARD")) && (card_slot.stored_card2 || card_slot.stored_card)) {
			if (card_slot.stored_card2) {
				f.dot = card_slot.stored_card2.registered_name;
			} else if (card_slot.stored_card) {
				f.dot = card_slot.stored_card.registered_name;
			}
		}
	}
	if (!f.dot) {
		f.dot = if_no_id;
	}
	return f.dot;
});

// human_helpers.dm:91
rt.def("/mob/living/carbon/human/proc/get_idcard", function get_idcard(f: Frame) {
	if (!this.wear_id) return f.dot;
	return this.wear_id.GetID();
});

// human_helpers.dm:96
rt.def("/mob/living/carbon/human/proc/abiotic", function abiotic(f: Frame, full_body: Value) {
	let I: Value = null;
	full_body ??= 0;
	let abiotic_hands: Value = 0;
	for (I of each(this.held_items, T("/obj/item"))) {
		if (!rt.bitAnd(I.flags, NODROP)) {
			abiotic_hands = 1;
			break;
		}
	}
	if (full_body && abiotic_hands && (this.back && !rt.bitAnd(this.back.flags, NODROP) || this.wear_mask && !rt.bitAnd(this.wear_mask.flags, NODROP) || this.head && !rt.bitAnd(this.head.flags, NODROP) || this.shoes && !rt.bitAnd(this.shoes.flags, NODROP) || this.w_uniform && !rt.bitAnd(this.w_uniform.flags, NODROP) || this.wear_suit && !rt.bitAnd(this.wear_suit.flags, NODROP) || this.glasses && !rt.bitAnd(this.glasses.flags, NODROP) || this.ears && !rt.bitAnd(this.ears.flags, NODROP) || this.gloves && !rt.bitAnd(this.gloves.flags, NODROP))) {
		return 1;
	}
	return abiotic_hands;
});

// human_helpers.dm:109
rt.def("/mob/living/carbon/human/proc/InCritical", function InCritical(f: Frame) {
	return ((this.health <= 0 ? 1 : 0) && (this.stat == 1 ? 1 : 0));
});

// human_helpers.dm:112
rt.def("/mob/living/carbon/human/proc/reagent_check", function* reagent_check(f: Frame, R: Value) {
	return (yield* this.dna.species.handle_chemicals(R, this));
}, true);

// human_helpers.dm:117
rt.def("/mob/living/carbon/human/proc/can_track", function can_track(f: Frame, user: Value) {
	let hat: Value = null;
	if (this.wear_id && rt.istype(this.wear_id.GetID(), T("/obj/item/weapon/card/id/syndicate"))) {
		return 0;
	}
	if (rt.istype(this.head, T("/obj/item/clothing/head"))) {
		if ((hat = this.head).blockTracking) {
			return 0;
		}
	}
	return parent_proc();
}, false);

// human_helpers.dm:127
rt.def("/mob/living/carbon/human/proc/get_permeability_protection", function get_permeability_protection(f: Frame) {
	let I: Value = null, protection: Value = null;
	let prot: Value = rt.alist(f, ["hands", 0, "chest", 0, "groin", 0, "legs", 0, "feet", 0, "arms", 0, "head", 0]);
	for (I of each(this.get_equipped_items(), T("/obj/item"))) {
		if (rt.bitAnd(I.body_parts_covered, HANDS)) {
			rt.setAt(prot, "hands", max(1 - I.permeability_coefficient, rt.at(prot, "hands")));
		}
		if (rt.bitAnd(I.body_parts_covered, CHEST)) {
			rt.setAt(prot, "chest", max(1 - I.permeability_coefficient, rt.at(prot, "chest")));
		}
		if (rt.bitAnd(I.body_parts_covered, GROIN)) {
			rt.setAt(prot, "groin", max(1 - I.permeability_coefficient, rt.at(prot, "groin")));
		}
		if (rt.bitAnd(I.body_parts_covered, LEGS)) {
			rt.setAt(prot, "legs", max(1 - I.permeability_coefficient, rt.at(prot, "legs")));
		}
		if (rt.bitAnd(I.body_parts_covered, FEET)) {
			rt.setAt(prot, "feet", max(1 - I.permeability_coefficient, rt.at(prot, "feet")));
		}
		if (rt.bitAnd(I.body_parts_covered, ARMS)) {
			rt.setAt(prot, "arms", max(1 - I.permeability_coefficient, rt.at(prot, "arms")));
		}
		if (rt.bitAnd(I.body_parts_covered, HEAD)) {
			rt.setAt(prot, "head", max(1 - I.permeability_coefficient, rt.at(prot, "head")));
		}
	}
	return (protection = (rt.at(prot, "head") + rt.at(prot, "arms") + rt.at(prot, "feet") + rt.at(prot, "legs") + rt.at(prot, "groin") + rt.at(prot, "chest") + rt.at(prot, "hands")) / 7);
});

// human_helpers.dm:147
rt.def("/mob/living/carbon/human/proc/can_use_guns", function can_use_guns(f: Frame, G: Value) {
	f.dot = parent_proc();
	if (G.trigger_guard == 1) {
		if (this.dna.check_mutation("Hulk")) {
			to_chat(this, "<span class='warning'>Your meaty finger is much too large for the trigger guard!</span>");
			return 0;
		}
		if (rt.isIn(f, NOGUNS, this.dna.species.species_traits)) {
			to_chat(this, "<span class='warning'>Your fingers don't fit in the trigger guard!</span>");
			return 0;
		}
	}
	if (this.mind) {
		if (this.mind.martial_art && this.mind.martial_art.no_guns) {
			to_chat(this, "<span class='warning'>Use of ranged weaponry would bring dishonor to the clan.</span>");
			return 0;
		}
	}
	return f.dot;
}, false);
