// Based on /tg/station's code/modules/mob/living/carbon/human/update_icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// update_icons.dm:53
rt.def("/mob/living/carbon/human/proc/update_hair", function* update_hair(f: Frame) {
	yield* this.dna.species.handle_hair(this);
	return f.dot;
}, true);

// update_icons.dm:57
rt.def("/mob/living/carbon/human/proc/update_mutant_bodyparts", function* update_mutant_bodyparts(f: Frame) {
	yield* this.dna.species.handle_mutant_bodyparts(this);
	return f.dot;
}, true);

// update_icons.dm:61
rt.def("/mob/living/carbon/human/proc/update_body", function* update_body(f: Frame) {
	this.remove_overlay(BODY_LAYER);
	yield* this.dna.species.handle_body(this);
	yield* parent_proc();
	return f.dot;
}, true);

// update_icons.dm:66
rt.def("/mob/living/carbon/human/proc/update_fire", function update_fire(f: Frame) {
	parent_proc("Standing");
	return f.dot;
});

// update_icons.dm:73
rt.def("/mob/living/carbon/human/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	if (yield* parent_proc()) return f.dot;
	this.icon_render_key = null;
	yield* this.update_body();
	yield* this.update_hair();
	yield* this.update_inv_w_uniform();
	this.update_inv_wear_id();
	this.update_inv_gloves();
	this.update_inv_glasses();
	this.update_inv_ears();
	this.update_inv_shoes();
	this.update_inv_s_store();
	yield* this.update_inv_wear_mask();
	yield* this.update_inv_head();
	this.update_inv_belt();
	this.update_inv_back();
	yield* this.update_inv_wear_suit();
	this.update_inv_pockets();
	this.update_inv_neck();
	yield* this.update_transform();
	yield* this.update_mutations_overlay();
	this.update_damage_overlays();
	return f.dot;
}, true);

// update_icons.dm:101
rt.def("/mob/living/carbon/human/proc/update_inv_w_uniform", function* update_inv_w_uniform(f: Frame, invdrop: Value) {
	let inv: Value = null, U: Value = null, t_color: Value = null, uniform_overlay: Value = null, G: Value = null, thing: Value = null;
	let $e: any;
	invdrop ??= 1;
	this.remove_overlay(UNIFORM_LAYER);
	if (this.client && this.hud_used) {
		yield* (inv = rt.index(this.hud_used.inv_slots, slot_w_uniform)).update_icon();
	}
	if (rt.istype(this.w_uniform, T("/obj/item/clothing/under"))) {
		(U = this.w_uniform).screen_loc = "WEST:6,SOUTH+1:7";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			if (this.hud_used.inventory_shown) {
				this.client.screen += this.w_uniform;
			}
		}
		this.update_observer_view(this.w_uniform, ALT_STYLE);
		if (this.wear_suit && rt.bitAnd(this.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			return f.dot;
		}
		if (!(t_color = U.item_color)) {
			t_color = U.icon_state;
		}
		if (U.adjusted == ALT_STYLE) {
			t_color = `${t_color}_d`;
		} else if (U.adjusted == DIGITIGRADE_STYLE) {
			t_color = `${t_color}_l`;
		}
		if (this.dna && this.dna.species.sexes) {
			if ((G = this.gender == "female" ? "f" : "m") == "f" && U.fitted != NO_FEMALE_UNIFORM) {
				uniform_overlay = (yield* U.build_worn_icon({ state: `${t_color}`, default_layer: UNIFORM_LAYER, default_icon_file: rt.rsc("icons/mob/uniform.dmi"), isinhands: 0, femaleuniform: U.fitted }));
			}
		}
		if (!uniform_overlay) {
			uniform_overlay = (yield* U.build_worn_icon({ state: `${t_color}`, default_layer: UNIFORM_LAYER, default_icon_file: rt.rsc("icons/mob/uniform.dmi"), isinhands: 0 }));
		}
		rt.setAt(this.overlays_standing, UNIFORM_LAYER, uniform_overlay);
	} else if (!(this.dna && this.dna.species.nojumpsuit) && invdrop) {
		for (thing of each(list(this.r_store, this.l_store, this.wear_id, this.belt), T("/obj/item"))) {
			yield* this.dropItemToGround(thing);
		}
	}
	this.apply_overlay(UNIFORM_LAYER);
	yield* this.update_mutant_bodyparts();
	return f.dot;
}, true);

// update_icons.dm:149
rt.def("/mob/living/carbon/human/proc/update_inv_wear_id", function update_inv_wear_id(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(ID_LAYER);
	if (this.client && this.hud_used) {
		(inv = rt.index(this.hud_used.inv_slots, slot_wear_id)).update_icon();
	}
	if (this.wear_id) {
		this.wear_id.screen_loc = "CENTER-4:12,SOUTH:5";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			this.client.screen += this.wear_id;
		}
		this.update_observer_view(this.wear_id);
		rt.setAt(this.overlays_standing, ID_LAYER, this.wear_id.build_worn_icon({ state: this.wear_id.item_state, default_layer: ID_LAYER, default_icon_file: rt.rsc("icons/mob/mob.dmi") }));
	}
	this.apply_overlay(ID_LAYER);
	return f.dot;
});

// update_icons.dm:168
rt.def("/mob/living/carbon/human/proc/update_inv_gloves", function update_inv_gloves(f: Frame) {
	let inv: Value = null, bloody_overlay: Value = null, t_state: Value = null;
	this.remove_overlay(GLOVES_LAYER);
	if (this.client && this.hud_used && rt.index(this.hud_used.inv_slots, slot_gloves)) {
		(inv = rt.index(this.hud_used.inv_slots, slot_gloves)).update_icon();
	}
	if (!this.gloves && this.blood_DNA) {
		bloody_overlay = mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "bloodyhands", -16);
		if (this.get_num_arms() < 2) {
			if (this.has_left_hand()) {
				bloody_overlay.icon_state = "bloodyhands_left";
			} else if (this.has_right_hand()) {
				bloody_overlay.icon_state = "bloodyhands_right";
			}
		}
		rt.setAt(this.overlays_standing, GLOVES_LAYER, bloody_overlay);
	}
	if (this.gloves) {
		this.gloves.screen_loc = "WEST+2:10,SOUTH+1:7";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			if (this.hud_used.inventory_shown) {
				this.client.screen += this.gloves;
			}
		}
		this.update_observer_view(this.gloves, 1);
		if (!(t_state = this.gloves.item_state)) {
			t_state = this.gloves.icon_state;
		}
		rt.setAt(this.overlays_standing, GLOVES_LAYER, this.gloves.build_worn_icon({ state: t_state, default_layer: GLOVES_LAYER, default_icon_file: rt.rsc("icons/mob/hands.dmi") }));
	}
	this.apply_overlay(GLOVES_LAYER);
	return f.dot;
});

// update_icons.dm:199
rt.def("/mob/living/carbon/human/proc/update_inv_glasses", function update_inv_glasses(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(GLASSES_LAYER);
	if (!this.get_bodypart("head")) {
		return f.dot;
	}
	if (this.client && this.hud_used) {
		(inv = rt.index(this.hud_used.inv_slots, slot_glasses)).update_icon();
	}
	if (this.glasses) {
		this.glasses.screen_loc = "WEST:6,SOUTH+3:11";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			if (this.hud_used.inventory_shown) {
				this.client.screen += this.glasses;
			}
		}
		this.update_observer_view(this.glasses, 1);
		if (!(this.head && rt.bitAnd(this.head.flags_inv, HIDEEYES)) && !(this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEEYES))) {
			rt.setAt(this.overlays_standing, GLASSES_LAYER, this.glasses.build_worn_icon({ state: this.glasses.icon_state, default_layer: GLASSES_LAYER, default_icon_file: rt.rsc("icons/mob/eyes.dmi") }));
		}
	}
	this.apply_overlay(GLASSES_LAYER);
	return f.dot;
});

// update_icons.dm:222
rt.def("/mob/living/carbon/human/proc/update_inv_ears", function update_inv_ears(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(EARS_LAYER);
	if (!this.get_bodypart("head")) {
		return f.dot;
	}
	if (this.client && this.hud_used) {
		(inv = rt.index(this.hud_used.inv_slots, slot_ears)).update_icon();
	}
	if (this.ears) {
		this.ears.screen_loc = "WEST+2:10,SOUTH+2:9";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			if (this.hud_used.inventory_shown) {
				this.client.screen += this.ears;
			}
		}
		this.update_observer_view(this.ears, 1);
		rt.setAt(this.overlays_standing, EARS_LAYER, this.ears.build_worn_icon({ state: this.ears.icon_state, default_layer: EARS_LAYER, default_icon_file: rt.rsc("icons/mob/ears.dmi") }));
	}
	this.apply_overlay(EARS_LAYER);
	return f.dot;
});

// update_icons.dm:244
rt.def("/mob/living/carbon/human/proc/update_inv_shoes", function update_inv_shoes(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(SHOES_LAYER);
	if (this.get_num_legs() < 2) {
		return f.dot;
	}
	if (this.client && this.hud_used) {
		(inv = rt.index(this.hud_used.inv_slots, slot_shoes)).update_icon();
	}
	if (this.shoes) {
		this.shoes.screen_loc = "WEST+1:8,SOUTH:5";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			if (this.hud_used.inventory_shown) {
				this.client.screen += this.shoes;
			}
		}
		this.update_observer_view(this.shoes, 1);
		rt.setAt(this.overlays_standing, SHOES_LAYER, this.shoes.build_worn_icon({ state: this.shoes.icon_state, default_layer: SHOES_LAYER, default_icon_file: rt.rsc("icons/mob/feet.dmi") }));
	}
	this.apply_overlay(SHOES_LAYER);
	return f.dot;
});

// update_icons.dm:265
rt.def("/mob/living/carbon/human/proc/update_inv_s_store", function update_inv_s_store(f: Frame) {
	let inv: Value = null, t_state: Value = null;
	this.remove_overlay(SUIT_STORE_LAYER);
	if (this.client && this.hud_used) {
		(inv = rt.index(this.hud_used.inv_slots, slot_s_store)).update_icon();
	}
	if (this.s_store) {
		this.s_store.screen_loc = "CENTER-5:10,SOUTH:5";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			this.client.screen += this.s_store;
		}
		this.update_observer_view(this.s_store);
		if (!(t_state = this.s_store.item_state)) {
			t_state = this.s_store.icon_state;
		}
		rt.setAt(this.overlays_standing, SUIT_STORE_LAYER, mutable_appearance(rt.rsc("icons/mob/belt_mirror.dmi"), t_state, -11));
	}
	this.apply_overlay(SUIT_STORE_LAYER);
	return f.dot;
});

// update_icons.dm:285
rt.def("/mob/living/carbon/human/proc/update_inv_head", function* update_inv_head(f: Frame) {
	yield* parent_proc();
	yield* this.update_mutant_bodyparts();
	return f.dot;
}, true);

// update_icons.dm:289
rt.def("/mob/living/carbon/human/proc/update_inv_belt", function update_inv_belt(f: Frame) {
	let inv: Value = null, t_state: Value = null;
	this.remove_overlay(BELT_LAYER);
	if (this.client && this.hud_used) {
		(inv = rt.index(this.hud_used.inv_slots, slot_belt)).update_icon();
	}
	if (this.belt) {
		this.belt.screen_loc = "CENTER-3:14,SOUTH:5";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			this.client.screen += this.belt;
		}
		this.update_observer_view(this.belt);
		if (!(t_state = this.belt.item_state)) {
			t_state = this.belt.icon_state;
		}
		rt.setAt(this.overlays_standing, BELT_LAYER, this.belt.build_worn_icon({ state: t_state, default_layer: BELT_LAYER, default_icon_file: rt.rsc("icons/mob/belt.dmi") }));
	}
	this.apply_overlay(BELT_LAYER);
	return f.dot;
});

// update_icons.dm:313
rt.def("/mob/living/carbon/human/proc/update_inv_wear_suit", function* update_inv_wear_suit(f: Frame) {
	let inv: Value = null;
	this.remove_overlay(SUIT_LAYER);
	if (this.client && this.hud_used) {
		yield* (inv = rt.index(this.hud_used.inv_slots, slot_wear_suit)).update_icon();
	}
	if (rt.istype(this.wear_suit, T("/obj/item/clothing/suit"))) {
		this.wear_suit.screen_loc = "WEST+1:8,SOUTH+1:7";
		if (this.client && this.hud_used && this.hud_used.hud_shown) {
			if (this.hud_used.inventory_shown) {
				this.client.screen += this.wear_suit;
			}
		}
		this.update_observer_view(this.wear_suit, 1);
		rt.setAt(this.overlays_standing, SUIT_LAYER, (yield* this.wear_suit.build_worn_icon({ state: this.wear_suit.icon_state, default_layer: SUIT_LAYER, default_icon_file: rt.rsc("icons/mob/suit.dmi") })));
		if (this.wear_suit.breakouttime) {
			yield* this.drop_all_held_items();
		}
	}
	yield* this.update_hair();
	yield* this.update_mutant_bodyparts();
	this.apply_overlay(SUIT_LAYER);
	return f.dot;
}, true);

// update_icons.dm:338
rt.def("/mob/living/carbon/human/proc/update_inv_pockets", function update_inv_pockets(f: Frame) {
	let inv: Value = null;
	if (!(this.client && this.hud_used)) return f.dot;
	(inv = rt.index(this.hud_used.inv_slots, slot_l_store)).update_icon();
	(inv = rt.index(this.hud_used.inv_slots, slot_r_store)).update_icon();
	if (this.l_store) {
		this.l_store.screen_loc = "CENTER+1:18,SOUTH:5";
		if (this.hud_used.hud_shown) {
			this.client.screen += this.l_store;
		}
		this.update_observer_view(this.l_store);
	}
	if (!this.r_store) return f.dot;
	this.r_store.screen_loc = "CENTER+2:20,SOUTH:5";
	if (this.hud_used.hud_shown) {
		this.client.screen += this.r_store;
	}
	this.update_observer_view(this.r_store);
	return f.dot;
});

// update_icons.dm:361
rt.def("/mob/living/carbon/human/proc/update_inv_wear_mask", function* update_inv_wear_mask(f: Frame) {
	yield* parent_proc();
	yield* this.update_mutant_bodyparts();
	return f.dot;
}, true);

// update_icons.dm:366
rt.def("/mob/living/carbon/human/proc/update_inv_legcuffed", function* update_inv_legcuffed(f: Frame) {
	this.remove_overlay(LEGCUFF_LAYER);
	yield* this.clear_alert("legcuffed");
	if (!this.legcuffed) return f.dot;
	rt.setAt(this.overlays_standing, LEGCUFF_LAYER, mutable_appearance(rt.rsc("icons/mob/mob.dmi"), "legcuff1", -4));
	this.apply_overlay(LEGCUFF_LAYER);
	yield* this.throw_alert("legcuffed", T("/obj/screen/alert/restrained/legcuffed"), { new_master: this.legcuffed });
	return f.dot;
}, true);

// update_icons.dm:374
rt.def("/proc/wear_female_version", function wear_female_version(f: Frame, t_color: Value, icon: Value, layer: Value, type: Value) {
	let female_clothing_icon: Value = null;
	let index: Value = t_color;
	if (!(female_clothing_icon = rt.index(GLOB.female_clothing_icons, index))) {
		generate_female_clothing(index, t_color, icon, type);
	}
	return mutable_appearance(rt.index(GLOB.female_clothing_icons, t_color), { layer: -layer });
});

// update_icons.dm:381
rt.def("/mob/living/carbon/human/proc/get_overlays_copy", function get_overlays_copy(f: Frame, unwantedLayers: Value) {
	let i: Value = null;
	let $e: any;
	let out: Value = new_(T("/list"));
	rt.forRange(f, 0, 1, TOTAL_LAYERS, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.index(this.overlays_standing, i)) {
			if (rt.isIn(f, i, unwantedLayers)) {
				continue;
			}
			out += rt.index(this.overlays_standing, i);
		}
	}
	rt.endFor(f, 0);
	return out;
});

// update_icons.dm:394
rt.def("/mob/living/carbon/human/proc/update_hud_head", function update_hud_head(f: Frame, I: Value) {
	I.screen_loc = "WEST+1:8,SOUTH+3:11";
	if (this.client && this.hud_used && this.hud_used.hud_shown) {
		if (this.hud_used.inventory_shown) {
			this.client.screen += I;
		}
	}
	this.update_observer_view(I, 1);
	return f.dot;
});

// update_icons.dm:402
rt.def("/mob/living/carbon/human/proc/update_hud_wear_mask", function update_hud_wear_mask(f: Frame, I: Value) {
	I.screen_loc = "WEST+1:8,SOUTH+2:9";
	if (this.client && this.hud_used && this.hud_used.hud_shown) {
		if (this.hud_used.inventory_shown) {
			this.client.screen += I;
		}
	}
	this.update_observer_view(I, 1);
	return f.dot;
});

// update_icons.dm:410
rt.def("/mob/living/carbon/human/proc/update_hud_neck", function update_hud_neck(f: Frame, I: Value) {
	I.screen_loc = "WEST:6,SOUTH+2:9";
	if (this.client && this.hud_used && this.hud_used.hud_shown) {
		if (this.hud_used.inventory_shown) {
			this.client.screen += I;
		}
	}
	this.update_observer_view(I, 1);
	return f.dot;
});

// update_icons.dm:418
rt.def("/mob/living/carbon/human/proc/update_hud_back", function update_hud_back(f: Frame, I: Value) {
	I.screen_loc = "CENTER-2:14,SOUTH:5";
	if (this.client && this.hud_used && this.hud_used.hud_shown) {
		this.client.screen += I;
	}
	this.update_observer_view(I);
	return f.dot;
});

// update_icons.dm:455
rt.def("/obj/item/proc/build_worn_icon", function build_worn_icon(f: Frame, state: Value, default_layer: Value, default_icon_file: Value, isinhands: Value, femaleuniform: Value) {
	let file2use: Value = null, layer2use: Value = null, standing: Value = null, worn_overlays: Value = null, M: Value = null, L: Value = null;
	let $1: any;
	state ??= "";
	default_layer ??= 0;
	isinhands ??= 0;
	femaleuniform ??= 0;
	if (!isinhands && this.alternate_worn_icon) {
		file2use = this.alternate_worn_icon;
	}
	if (!file2use) {
		file2use = default_icon_file;
	}
	if (this.alternate_worn_layer) {
		layer2use = this.alternate_worn_layer;
	}
	if (!layer2use) {
		layer2use = default_layer;
	}
	if (femaleuniform) {
		standing = wear_female_version(state, file2use, layer2use, femaleuniform);
	}
	if (!standing) {
		standing = mutable_appearance(file2use, state, -layer2use);
	}
	if ((worn_overlays = this.worn_overlays(isinhands)) && rt.len(f, worn_overlays)) {
		standing.overlays.Add(worn_overlays);
	}
	let $0: any = standing;
	if (isinhands) {
		$1 = this.inhand_x_dimension;
	} else {
		$1 = this.worn_x_dimension;
	}
	standing = center_image($0, $1, isinhands ? this.inhand_y_dimension : this.worn_y_dimension);
	if (rt.istype((M = this.loc), T("/mob"))) {
		if (L = this.get_held_offsets()) {
			standing.pixel_x += rt.at(L, "x");
			standing.pixel_y += rt.at(L, "y");
		}
	}
	standing.alpha = this.alpha;
	standing.color = this.color;
	return standing;
});

// update_icons.dm:497
rt.def("/obj/item/proc/get_held_offsets", function get_held_offsets(f: Frame) {
	let L: Value = null, M: Value = null;
	if (ismob(this.loc)) {
		L = (M = this.loc).get_item_offsets_for_index(M.get_held_index_of_item(this));
	}
	return L;
});

// update_icons.dm:505
rt.def("/mob/proc/get_item_offsets_for_index", function get_item_offsets_for_index(f: Frame, i: Value) {
	if (i === 3) {
		return rt.alist(f, ["x", 0, "y", 16]);
	} else if (i === 4) {
		return rt.alist(f, ["x", 0, "y", 16]);
	} else {
		return rt.alist(f, ["x", 0, "y", 0]);
	}
});

// update_icons.dm:517
rt.def("/mob/living/carbon/human/proc/generate_icon_render_key", function generate_icon_render_key(f: Frame) {
	let X: Value = null, BP: Value = null;
	f.dot = `${this.dna.species.limbs_id}`;
	if (this.dna.check_mutation("Hulk")) {
		f.dot += "-coloured-hulk";
	} else if (this.dna.species.use_skintones) {
		f.dot += `-coloured-${this.skin_tone}`;
	} else if (this.dna.species.fixed_mut_color) {
		f.dot += `-coloured-${this.dna.species.fixed_mut_color}`;
	} else if (rt.index(this.dna.features, "mcolor")) {
		f.dot += `-coloured-${rt.index(this.dna.features, "mcolor")}`;
	} else {
		f.dot += "-not_coloured";
	}
	f.dot += `-${this.gender}`;
	for (X of each(this.bodyparts)) {
		f.dot += `-${(BP = X).body_zone}`;
		if (BP.status == BODYPART_ORGANIC) {
			f.dot += "-organic";
		} else {
			f.dot += "-robotic";
		}
		if (BP.use_digitigrade) {
			f.dot += `-digitigrade${BP.use_digitigrade}`;
		}
		if (BP.dmg_overlay_type) {
			f.dot += `-${BP.dmg_overlay_type}`;
		}
	}
	if (!rt.bitAnd(this.disabilities, 64)) return f.dot;
	f.dot += "-husk";
	return f.dot;
});

// update_icons.dm:548
rt.def("/mob/living/carbon/human/proc/load_limb_from_cache", function* load_limb_from_cache(f: Frame) {
	yield* parent_proc();
	yield* this.update_hair();
	return f.dot;
}, true);

// update_icons.dm:554
rt.def("/mob/living/carbon/human/proc/update_observer_view", function update_observer_view(f: Frame, I: Value, inventory: Value) {
	let M: Value = null, observe: Value = null;
	if (!(this.observers && rt.len(f, this.observers))) return f.dot;
	for (M of each(this.observers)) {
		if ((observe = M).client && observe.client.eye == this) {
			if (observe.hud_used) {
				if (inventory && !observe.hud_used.inventory_shown) {
					continue;
				}
				observe.client.screen += I;
			}
		} else {
			this.observers -= observe;
			if (!rt.len(f, this.observers)) {
				this.observers = null;
				break;
			}
		}
	}
	return f.dot;
});
