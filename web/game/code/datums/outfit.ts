// Based on /tg/station's code/datums/outfit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(615, "/datum/outfit", "/datum", {
	name: "Naked",
	uniform: null,
	suit: null,
	toggle_helmet: 1,
	back: null,
	belt: null,
	gloves: null,
	shoes: null,
	head: null,
	mask: null,
	neck: null,
	ears: null,
	glasses: null,
	id: null,
	l_pocket: null,
	r_pocket: null,
	suit_store: null,
	r_hand: null,
	l_hand: null,
	internals_slot: null,
	backpack_contents: null,
	implants: null,
	accessory: null,
	can_be_admin_equipped: 1,
});

// outfit.dm:38
rt.def("/datum/outfit/proc/equip", function* equip(f: Frame, H: Value, visualsOnly: Value) {
	let U: Value = null, path: Value = null, number: Value = null, i: Value = null, HS: Value = null, implant_type: Value = null, I: Value = null;
	visualsOnly ??= 0;
	yield* this.pre_equip(H, visualsOnly);
	if (this.uniform) {
		yield* H.equip_to_slot_or_del((yield* new_(this.uniform, H)), slot_w_uniform);
	}
	if (this.suit) {
		yield* H.equip_to_slot_or_del((yield* new_(this.suit, H)), slot_wear_suit);
	}
	if (this.back) {
		yield* H.equip_to_slot_or_del((yield* new_(this.back, H)), slot_back);
	}
	if (this.belt) {
		yield* H.equip_to_slot_or_del((yield* new_(this.belt, H)), slot_belt);
	}
	if (this.gloves) {
		yield* H.equip_to_slot_or_del((yield* new_(this.gloves, H)), slot_gloves);
	}
	if (this.shoes) {
		yield* H.equip_to_slot_or_del((yield* new_(this.shoes, H)), slot_shoes);
	}
	if (this.head) {
		yield* H.equip_to_slot_or_del((yield* new_(this.head, H)), slot_head);
	}
	if (this.mask) {
		yield* H.equip_to_slot_or_del((yield* new_(this.mask, H)), slot_wear_mask);
	}
	if (this.neck) {
		yield* H.equip_to_slot_or_del((yield* new_(this.neck, H)), slot_neck);
	}
	if (this.ears) {
		yield* H.equip_to_slot_or_del((yield* new_(this.ears, H)), slot_ears);
	}
	if (this.glasses) {
		yield* H.equip_to_slot_or_del((yield* new_(this.glasses, H)), slot_glasses);
	}
	if (this.id) {
		yield* H.equip_to_slot_or_del((yield* new_(this.id, H)), slot_wear_id);
	}
	if (this.suit_store) {
		yield* H.equip_to_slot_or_del((yield* new_(this.suit_store, H)), slot_s_store);
	}
	if (this.accessory) {
		if (U = H.w_uniform) {
			yield* U.attach_accessory((yield* new_(this.accessory, H)));
		} else {
			warning(`${`Unable to equip accessory ${this.accessory} in outfit ${this.name}. No uniform present!`} in ${"code/datums/outfit.dm"} at line ${73} src: ${this} usr: ${f.usr}.`);
		}
	}
	if (this.l_hand) {
		yield* H.put_in_l_hand((yield* new_(this.l_hand, H)));
	}
	if (this.r_hand) {
		yield* H.put_in_r_hand((yield* new_(this.r_hand, H)));
	}
	if (!visualsOnly) {
		if (this.l_pocket) {
			yield* H.equip_to_slot_or_del((yield* new_(this.l_pocket, H)), slot_l_store);
		}
		if (this.r_pocket) {
			yield* H.equip_to_slot_or_del((yield* new_(this.r_pocket, H)), slot_r_store);
		}
		if (this.backpack_contents) {
			for (path of each(this.backpack_contents)) {
				number = rt.index(this.backpack_contents, path);
				i = 0;
				while (i < number) {
					yield* H.equip_to_slot_or_del((yield* new_(path, H)), slot_in_backpack);
					i++;
				}
			}
		}
	}
	if (!H.head && this.toggle_helmet && rt.istype(H.wear_suit, T("/obj/item/clothing/suit/space/hardsuit"))) {
		yield* (HS = H.wear_suit).ToggleHelmet();
	}
	yield* this.post_equip(H, visualsOnly);
	if (!visualsOnly) {
		yield* this.apply_fingerprints(H);
		if (this.internals_slot) {
			H.internal = H.get_item_by_slot(this.internals_slot);
			yield* H.update_action_buttons_icon();
		}
		if (this.implants) {
			for (implant_type of each(this.implants)) {
				yield* (I = (yield* new_(implant_type, H))).implant(H, null, { silent: 1 });
			}
		}
	}
	yield* H.update_body();
	return 1;
}, true);

// outfit.dm:111
rt.def("/datum/outfit/proc/apply_fingerprints", function* apply_fingerprints(f: Frame, H: Value) {
	let I: Value = null;
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (H.back) {
		yield* H.back.add_fingerprint(H, 1);
		for (I of each(H.back.contents, T("/obj/item"))) {
			yield* I.add_fingerprint(H, 1);
		}
	}
	if (H.wear_id) {
		yield* H.wear_id.add_fingerprint(H, 1);
	}
	if (H.w_uniform) {
		yield* H.w_uniform.add_fingerprint(H, 1);
	}
	if (H.wear_suit) {
		yield* H.wear_suit.add_fingerprint(H, 1);
	}
	if (H.wear_mask) {
		yield* H.wear_mask.add_fingerprint(H, 1);
	}
	if (H.wear_neck) {
		yield* H.wear_neck.add_fingerprint(H, 1);
	}
	if (H.head) {
		yield* H.head.add_fingerprint(H, 1);
	}
	if (H.shoes) {
		yield* H.shoes.add_fingerprint(H, 1);
	}
	if (H.gloves) {
		yield* H.gloves.add_fingerprint(H, 1);
	}
	if (H.ears) {
		yield* H.ears.add_fingerprint(H, 1);
	}
	if (H.glasses) {
		yield* H.glasses.add_fingerprint(H, 1);
	}
	if (H.belt) {
		yield* H.belt.add_fingerprint(H, 1);
		I = null;
		for (I of each(H.belt.contents, T("/obj/item"))) {
			yield* I.add_fingerprint(H, 1);
		}
	}
	if (H.s_store) {
		yield* H.s_store.add_fingerprint(H, 1);
	}
	if (H.l_store) {
		yield* H.l_store.add_fingerprint(H, 1);
	}
	if (H.r_store) {
		yield* H.r_store.add_fingerprint(H, 1);
	}
	I = null;
	for (I of each(H.held_items, T("/obj/item"))) {
		yield* I.add_fingerprint(H, 1);
	}
	return 1;
}, true);
