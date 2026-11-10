// Based on /tg/station's code/modules/mob/living/carbon/human/species.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(4074, "/datum/species", "/datum", {
	id: null,
	limbs_id: null,
	name: null,
	roundstart: 0,
	default_color: "#FFF",
	sexes: 1,
	face_y_offset: 0,
	hair_y_offset: 0,
	hair_color: null,
	hair_alpha: 255,
	use_skintones: 0,
	exotic_blood: "",
	exotic_bloodtype: "",
	skinned_type: null,
	no_equip: null,
	nojumpsuit: 0,
	blacklisted: 0,
	dangerous_existence: null,
	say_mod: "says",
	default_features: null,
	mutant_bodyparts: null,
	mutant_organs: null,
	speedmod: 0,
	armor: 0,
	brutemod: 1,
	burnmod: 1,
	coldmod: 1,
	heatmod: 1,
	stunmod: 1,
	punchdamagelow: 0,
	punchdamagehigh: 9,
	punchstunthreshold: 9,
	siemens_coeff: 1,
	damage_overlay_type: "human",
	fixed_mut_color: "",
	species_traits: null,
	attack_verb: "punch",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	miss_sound: rt.rsc("sound/weapons/punchmiss.ogg"),
	ignored_by: null,
	mutantlungs: null,
	breathid: "o2",
	override_float: 0,
	mutanthands: null,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human"),
	mutanteyes: rt.typePath("/obj/item/organ/eyes"),
	mutantears: rt.typePath("/obj/item/organ/ears"),
	mutanttongue: rt.typePath("/obj/item/organ/tongue"),
});

// species.dm:32
rt.def("/datum/species/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.no_equip = list();

	this.default_features = list();

	this.mutant_bodyparts = list();

	this.mutant_organs = list();

	this.species_traits = list();

	this.ignored_by = list();
	return f.dot;
});

// species.dm:81
rt.def("/datum/species/proc/New", function New(f: Frame) {
	if (!this.limbs_id) {
		this.limbs_id = this.id;
	}
	parent_proc();
	return f.dot;
});

// species.dm:88
rt.def("/datum/species/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let randname: Value = null;
	if (unique) {
		return random_unique_name(gender);
	}
	if (gender == "male") {
		randname = pick(GLOB.first_names_male);
	} else {
		randname = pick(GLOB.first_names_female);
	}
	if (lastname) {
		randname += ` ${lastname}`;
	} else {
		randname += ` ${pick(GLOB.last_names)}`;
	}
	return randname;
});

// species.dm:106
rt.def("/datum/species/proc/qualifies_for_rank", function qualifies_for_rank(f: Frame, rank: Value, features: Value) {
	if (rt.isIn(f, rank, GLOB.command_positions)) {
		return 0;
	}
	return 1;
});

// species.dm:112
rt.def("/datum/species/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	let slot_id: Value = null, thing: Value = null, path: Value = null, I: Value = null, I_6: Value = null, V: Value = null;
	for (slot_id of each(this.no_equip)) {
		if ((thing = C.get_item_by_slot(slot_id)) && (!thing.species_exception || !is_type_in_list(this, thing.species_exception))) {
			yield* C.dropItemToGround(thing);
		}
	}
	if (C.hud_used) {
		C.hud_used.update_locked_slots();
	}
	if (rt.isIn(f, "legs", C.dna.species.mutant_bodyparts) && rt.index(C.dna.features, "legs") == "Digitigrade Legs") {
		this.species_traits += DIGITIGRADE;
	}
	if (rt.isIn(f, DIGITIGRADE, this.species_traits)) {
		yield* C.Digitigrade_Leg_Swap(0);
	}
	let heart: Value = C.getorganslot("heart");
	let lungs: Value = C.getorganslot("lungs");
	let appendix: Value = C.getorganslot("appendix");
	let eyes: Value = C.getorganslot("eye_sight");
	let ears: Value = C.getorganslot("ears");
	let tongue: Value = C.getorganslot("tongue");
	if (rt.isIn(f, NOBLOOD, this.species_traits) && heart) {
		yield* heart.Remove(C);
		yield* qdel(heart);
	} else if (!rt.isIn(f, NOBLOOD, this.species_traits) && !heart) {
		yield* (heart = (yield* new_(T("/obj/item/organ/heart")))).Insert(C);
	}
	if (lungs) {
		yield* qdel(lungs);
		lungs = null;
	}
	if (C.get_bodypart("head")) {
		if (eyes) {
			yield* qdel(eyes);
			yield* (eyes = (yield* new_(this.mutanteyes))).Insert(C);
		}
		if (ears) {
			yield* qdel(ears);
			yield* (ears = (yield* new_(this.mutantears))).Insert(C);
		}
		if (tongue) {
			yield* qdel(tongue);
			yield* (tongue = (yield* new_(this.mutanttongue))).Insert(C);
		}
	}
	if (!rt.isIn(f, NOBREATH, this.species_traits) && !lungs) {
		if (this.mutantlungs) {
			lungs = (yield* new_(this.mutantlungs));
		} else {
			lungs = (yield* new_(T("/obj/item/organ/lungs")));
		}
		yield* lungs.Insert(C);
	}
	if (rt.isIn(f, NOHUNGER, this.species_traits) && appendix) {
		yield* qdel(appendix);
	} else if (!rt.isIn(f, NOHUNGER, this.species_traits) && !appendix) {
		yield* (appendix = (yield* new_(T("/obj/item/organ/appendix")))).Insert(C);
	}
	for (path of each(this.mutant_organs)) {
		yield* (I = (yield* new_(path))).Insert(C);
	}
	if (this.exotic_bloodtype && C.dna.blood_type != this.exotic_bloodtype) {
		C.dna.blood_type = this.exotic_bloodtype;
	}
	if (old_species.mutanthands) {
		for (I_6 of each(C.held_items, T("/obj/item"))) {
			if (rt.op(f, "IsType", [], [I_6, old_species.mutanthands])) {
				yield* qdel(I_6);
			}
		}
	}
	if (!this.mutanthands) return f.dot;
	for (V of each(C.held_items)) {
		if (rt.istype((I = V), T("/obj/item"))) {
			yield* C.dropItemToGround(I);
		} else {
			yield* C.put_in_hands((yield* new_(this.mutanthands)));
		}
	}
	return f.dot;
}, true);

// species.dm:195
rt.def("/datum/species/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	if (C.dna.species.exotic_bloodtype) {
		C.dna.blood_type = random_blood_type();
	}
	if (!rt.isIn(f, DIGITIGRADE, this.species_traits)) return f.dot;
	yield* C.Digitigrade_Leg_Swap(1);
	return f.dot;
}, true);

// species.dm:201
rt.def("/datum/species/proc/handle_hair", function* handle_hair(f: Frame, H: Value, forced_colour: Value) {
	let HD: Value = null, S: Value = null, I: Value = null, C: Value = null, M: Value = null, fhair_extensions: Value = null, s: Value = null, fhair_state: Value = null, fhair_file: Value = null, facial_overlay: Value = null, hair_overlay: Value = null, hair_extensions: Value = null, s_9: Value = null, hair_state: Value = null, hair_file: Value = null;
	H.remove_overlay(HAIR_LAYER);
	if (!(HD = H.get_bodypart("head"))) {
		return f.dot;
	}
	if (rt.bitAnd(H.disabilities, 64)) {
		return f.dot;
	}
	let standing: Value = list();
	let hair_hidden: Value = 0;
	let facialhair_hidden: Value = 0;
	let dynamic_hair_suffix: Value = "";
	let dynamic_fhair_suffix: Value = "";
	if (H.head) {
		if (rt.istype((I = H.head), T("/obj/item/clothing"))) {
			dynamic_fhair_suffix = (C = I).dynamic_fhair_suffix;
		}
		if (rt.bitAnd(I.flags_inv, HIDEFACIALHAIR)) {
			facialhair_hidden = 1;
		}
	}
	if (H.wear_mask) {
		dynamic_fhair_suffix = (M = H.wear_mask).dynamic_fhair_suffix;
		if (rt.bitAnd(M.flags_inv, HIDEFACIALHAIR)) {
			facialhair_hidden = 1;
		}
	}
	if (H.facial_hair_style && rt.isIn(f, FACEHAIR, this.species_traits) && (!facialhair_hidden || dynamic_fhair_suffix)) {
		if (S = rt.index(GLOB.facial_hair_styles_list, H.facial_hair_style)) {
			if (!GLOB.fextensions) {
				fhair_extensions = icon(rt.rsc("icons/mob/facialhair_extensions.dmi"));
				GLOB.fextensions = list();
				for (s of each(fhair_extensions.IconStates(1))) {
					rt.setAt(GLOB.fextensions, s, 1);
				}
				yield* qdel(fhair_extensions);
			}
			fhair_state = S.icon_state;
			fhair_file = S.icon;
			if (rt.index(GLOB.fextensions, fhair_state + dynamic_fhair_suffix)) {
				fhair_state += dynamic_fhair_suffix;
				fhair_file = rt.rsc("icons/mob/facialhair_extensions.dmi");
			}
			facial_overlay = mutable_appearance(fhair_file, fhair_state, -8);
			if (!forced_colour) {
				if (this.hair_color) {
					if (this.hair_color == "mutcolor") {
						facial_overlay.color = "#" + rt.index(H.dna.features, "mcolor");
					} else {
						facial_overlay.color = "#" + this.hair_color;
					}
				} else {
					facial_overlay.color = "#" + H.facial_hair_color;
				}
			} else {
				facial_overlay.color = forced_colour;
			}
			facial_overlay.alpha = this.hair_alpha;
			standing += facial_overlay;
		}
	}
	if (H.head) {
		if (rt.istype((I = H.head), T("/obj/item/clothing"))) {
			dynamic_hair_suffix = (C = I).dynamic_hair_suffix;
		}
		if (rt.bitAnd(I.flags_inv, HIDEHAIR)) {
			hair_hidden = 1;
		}
	}
	if (H.wear_mask) {
		M = H.wear_mask;
		if (!dynamic_hair_suffix) {
			dynamic_hair_suffix = M.dynamic_hair_suffix;
		}
		if (rt.bitAnd(M.flags_inv, HIDEHAIR)) {
			hair_hidden = 1;
		}
	}
	if (!hair_hidden || dynamic_hair_suffix) {
		hair_overlay = (yield* mutable_appearance({ layer: -8 }));
		if (!hair_hidden && !H.getorgan(T("/obj/item/organ/brain"))) {
			if (!rt.isIn(f, NOBLOOD, this.species_traits)) {
				hair_overlay.icon = rt.rsc("icons/mob/human_face.dmi");
				hair_overlay.icon_state = "debrained";
			}
		} else if (H.hair_style && rt.isIn(f, HAIR, this.species_traits)) {
			if (S = rt.index(GLOB.hair_styles_list, H.hair_style)) {
				if (!GLOB.extensions) {
					hair_extensions = icon(rt.rsc("icons/mob/hair_extensions.dmi"));
					GLOB.extensions = list();
					for (s_9 of each(hair_extensions.IconStates(1))) {
						rt.setAt(GLOB.extensions, s_9, 1);
					}
					yield* qdel(hair_extensions);
				}
				hair_state = S.icon_state;
				hair_file = S.icon;
				if (rt.index(GLOB.extensions, hair_state + dynamic_hair_suffix)) {
					hair_state += dynamic_hair_suffix;
					hair_file = rt.rsc("icons/mob/hair_extensions.dmi");
				}
				hair_overlay.icon = hair_file;
				hair_overlay.icon_state = hair_state;
				if (!forced_colour) {
					if (this.hair_color) {
						if (this.hair_color == "mutcolor") {
							hair_overlay.color = "#" + rt.index(H.dna.features, "mcolor");
						} else {
							hair_overlay.color = "#" + this.hair_color;
						}
					} else {
						hair_overlay.color = "#" + H.hair_color;
					}
				} else {
					hair_overlay.color = forced_colour;
				}
				hair_overlay.alpha = this.hair_alpha;
				hair_overlay.pixel_y += this.hair_y_offset;
			}
		}
		if (hair_overlay.icon) {
			standing += hair_overlay;
		}
	}
	if (rt.len(f, standing)) {
		rt.setAt(H.overlays_standing, HAIR_LAYER, standing);
	}
	H.apply_overlay(HAIR_LAYER);
	return f.dot;
}, true);

// species.dm:336
rt.def("/datum/species/proc/handle_body", function* handle_body(f: Frame, H: Value) {
	let lip_overlay: Value = null, eye_overlay: Value = null, underwear: Value = null, undershirt: Value = null, socks: Value = null;
	H.remove_overlay(BODY_LAYER);
	let standing: Value = list();
	let HD: Value = H.get_bodypart("head");
	if (!rt.bitAnd(H.disabilities, 64)) {
		if (H.lip_style && rt.isIn(f, LIPS, this.species_traits) && HD) {
			(lip_overlay = mutable_appearance(rt.rsc("icons/mob/human_face.dmi"), `lips_${H.lip_style}`, -22)).color = H.lip_color;
			lip_overlay.pixel_y += this.face_y_offset;
			standing += lip_overlay;
		}
		if (rt.isIn(f, EYECOLOR, this.species_traits) && HD) {
			(eye_overlay = mutable_appearance(rt.rsc("icons/mob/human_face.dmi"), "eyes", -22)).color = "#" + H.eye_color;
			eye_overlay.pixel_y += this.face_y_offset;
			standing += eye_overlay;
		}
	}
	if (!rt.isIn(f, NO_UNDERWEAR, this.species_traits)) {
		if (H.underwear) {
			if (underwear = rt.index(GLOB.underwear_list, H.underwear)) {
				standing += mutable_appearance(underwear.icon, underwear.icon_state, -22);
			}
		}
		if (H.undershirt) {
			if (undershirt = rt.index(GLOB.undershirt_list, H.undershirt)) {
				if (H.dna.species.sexes && H.gender == "female") {
					standing += wear_female_version(undershirt.icon_state, undershirt.icon, BODY_LAYER);
				} else {
					standing += mutable_appearance(undershirt.icon, undershirt.icon_state, -22);
				}
			}
		}
		if (H.socks && H.get_num_legs() >= 2 && !rt.isIn(f, DIGITIGRADE, this.species_traits)) {
			if (socks = rt.index(GLOB.socks_list, H.socks)) {
				standing += mutable_appearance(socks.icon, socks.icon_state, -22);
			}
		}
	}
	if (rt.len(f, standing)) {
		rt.setAt(H.overlays_standing, BODY_LAYER, standing);
	}
	H.apply_overlay(BODY_LAYER);
	yield* this.handle_mutant_bodyparts(H);
	return f.dot;
}, true);

// species.dm:384
rt.def("/datum/species/proc/handle_mutant_bodyparts", function* handle_mutant_bodyparts(f: Frame, H: Value, forced_colour: Value) {
	let X: Value = null, O: Value = null, should_be_squished: Value = null, layer: Value = null, layertext: Value = null, bodypart: Value = null, S: Value = null, accessory_overlay: Value = null, inner_accessory_overlay: Value = null;
	let $e: any;
	let bodyparts_to_add: Value = (yield* this.mutant_bodyparts.Copy());
	let relevent_layers: Value = list(BODY_BEHIND_LAYER, BODY_ADJ_LAYER, BODY_FRONT_LAYER);
	let standing: Value = list();
	H.remove_overlay(BODY_BEHIND_LAYER);
	H.remove_overlay(BODY_ADJ_LAYER);
	H.remove_overlay(BODY_FRONT_LAYER);
	if (!this.mutant_bodyparts) {
		return f.dot;
	}
	let HD: Value = H.get_bodypart("head");
	if (rt.isIn(f, "tail_lizard", this.mutant_bodyparts)) {
		if (H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			bodyparts_to_add -= "tail_lizard";
		}
	}
	if (rt.isIn(f, "waggingtail_lizard", this.mutant_bodyparts)) {
		if (H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			bodyparts_to_add -= "waggingtail_lizard";
		} else if (rt.isIn(f, "tail_lizard", this.mutant_bodyparts)) {
			bodyparts_to_add -= "waggingtail_lizard";
		}
	}
	if (rt.isIn(f, "tail_human", this.mutant_bodyparts)) {
		if (H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			bodyparts_to_add -= "tail_human";
		}
	}
	if (rt.isIn(f, "waggingtail_human", this.mutant_bodyparts)) {
		if (H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			bodyparts_to_add -= "waggingtail_human";
		} else if (rt.isIn(f, "tail_human", this.mutant_bodyparts)) {
			bodyparts_to_add -= "waggingtail_human";
		}
	}
	if (rt.isIn(f, "spines", this.mutant_bodyparts)) {
		if (!rt.index(H.dna.features, "spines") || rt.index(H.dna.features, "spines") == "None" || H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			bodyparts_to_add -= "spines";
		}
	}
	if (rt.isIn(f, "waggingspines", this.mutant_bodyparts)) {
		if (!rt.index(H.dna.features, "spines") || rt.index(H.dna.features, "spines") == "None" || H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			bodyparts_to_add -= "waggingspines";
		} else if (rt.isIn(f, "tail", this.mutant_bodyparts)) {
			bodyparts_to_add -= "waggingspines";
		}
	}
	if (rt.isIn(f, "snout", this.mutant_bodyparts)) {
		if (H.wear_mask && rt.bitAnd(H.wear_mask.flags_inv, HIDEFACE) || H.head && rt.bitAnd(H.head.flags_inv, HIDEFACE) || !HD || HD.status == BODYPART_ROBOTIC) {
			bodyparts_to_add -= "snout";
		}
	}
	if (rt.isIn(f, "frills", this.mutant_bodyparts)) {
		if (!rt.index(H.dna.features, "frills") || rt.index(H.dna.features, "frills") == "None" || H.head && rt.bitAnd(H.head.flags_inv, HIDEEARS) || !HD || HD.status == BODYPART_ROBOTIC) {
			bodyparts_to_add -= "frills";
		}
	}
	if (rt.isIn(f, "horns", this.mutant_bodyparts)) {
		if (!rt.index(H.dna.features, "horns") || rt.index(H.dna.features, "horns") == "None" || H.head && rt.bitAnd(H.head.flags_inv, HIDEHAIR) || H.wear_mask && rt.bitAnd(H.wear_mask.flags_inv, HIDEHAIR) || !HD || HD.status == BODYPART_ROBOTIC) {
			bodyparts_to_add -= "horns";
		}
	}
	if (rt.isIn(f, "ears", this.mutant_bodyparts)) {
		if (!rt.index(H.dna.features, "ears") || rt.index(H.dna.features, "ears") == "None" || H.head && rt.bitAnd(H.head.flags_inv, HIDEHAIR) || H.wear_mask && rt.bitAnd(H.wear_mask.flags_inv, HIDEHAIR) || !HD || HD.status == BODYPART_ROBOTIC) {
			bodyparts_to_add -= "ears";
		}
	}
	if (rt.isIn(f, "wings", this.mutant_bodyparts)) {
		if (!rt.index(H.dna.features, "wings") || rt.index(H.dna.features, "wings") == "None" || H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT) && (!H.wear_suit.species_exception || !is_type_in_list(this, H.wear_suit.species_exception))) {
			bodyparts_to_add -= "wings";
		}
	}
	if (rt.isIn(f, "wings_open", this.mutant_bodyparts)) {
		if (H.wear_suit && rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT) && (!H.wear_suit.species_exception || !is_type_in_list(this, H.wear_suit.species_exception))) {
			bodyparts_to_add -= "wings_open";
		} else if (rt.isIn(f, "wings", this.mutant_bodyparts)) {
			bodyparts_to_add -= "wings_open";
		}
	}
	let update_needed: Value = 0;
	let not_digitigrade: Value = 1;
	for (X of each(H.bodyparts)) {
		if (!(O = X).use_digitigrade) {
			continue;
		}
		not_digitigrade = 0;
		if (!rt.isIn(f, DIGITIGRADE, this.species_traits)) {
			this.species_traits += DIGITIGRADE;
		}
		should_be_squished = 0;
		if (H.wear_suit && (rt.bitAnd(H.wear_suit.flags_inv, HIDEJUMPSUIT) || rt.bitAnd(H.wear_suit.body_parts_covered, LEGS)) || H.w_uniform && rt.bitAnd(H.w_uniform.body_parts_covered, LEGS)) {
			should_be_squished = 1;
		}
		if (O.use_digitigrade == 1 && should_be_squished) {
			O.use_digitigrade = SQUISHED_DIGITIGRADE;
			update_needed = 1;
		} else if (O.use_digitigrade == SQUISHED_DIGITIGRADE && !should_be_squished) {
			O.use_digitigrade = 1;
			update_needed = 1;
		}
	}
	if (update_needed) {
		yield* H.update_body_parts();
	}
	if (not_digitigrade && rt.isIn(f, DIGITIGRADE, this.species_traits)) {
		this.species_traits -= DIGITIGRADE;
	}
	if (!bodyparts_to_add) {
		return f.dot;
	}
	let _g: Value = H.gender == "female" ? "f" : "m";
	for (layer of each(relevent_layers)) {
		layertext = this.mutant_bodyparts_layertext(layer);
		bodypart = null;
		for (bodypart of each(bodyparts_to_add)) {
			S = null;
			if (bodypart === "tail_lizard") {
				S = rt.index(GLOB.tails_list_lizard, rt.index(H.dna.features, "tail_lizard"));
			} else if (bodypart === "waggingtail_lizard") {
				S = rt.index(GLOB.animated_tails_list_lizard, rt.index(H.dna.features, "tail_lizard"));
			} else if (bodypart === "tail_human") {
				S = rt.index(GLOB.tails_list_human, rt.index(H.dna.features, "tail_human"));
			} else if (bodypart === "waggingtail_human") {
				S = rt.index(GLOB.animated_tails_list_human, rt.index(H.dna.features, "tail_human"));
			} else if (bodypart === "spines") {
				S = rt.index(GLOB.spines_list, rt.index(H.dna.features, "spines"));
			} else if (bodypart === "waggingspines") {
				S = rt.index(GLOB.animated_spines_list, rt.index(H.dna.features, "spines"));
			} else if (bodypart === "snout") {
				S = rt.index(GLOB.snouts_list, rt.index(H.dna.features, "snout"));
			} else if (bodypart === "frills") {
				S = rt.index(GLOB.frills_list, rt.index(H.dna.features, "frills"));
			} else if (bodypart === "horns") {
				S = rt.index(GLOB.horns_list, rt.index(H.dna.features, "horns"));
			} else if (bodypart === "ears") {
				S = rt.index(GLOB.ears_list, rt.index(H.dna.features, "ears"));
			} else if (bodypart === "body_markings") {
				S = rt.index(GLOB.body_markings_list, rt.index(H.dna.features, "body_markings"));
			} else if (bodypart === "wings") {
				S = rt.index(GLOB.wings_list, rt.index(H.dna.features, "wings"));
			} else if (bodypart === "wingsopen") {
				S = rt.index(GLOB.wings_open_list, rt.index(H.dna.features, "wings"));
			} else if (bodypart === "legs") {
				S = rt.index(GLOB.legs_list, rt.index(H.dna.features, "legs"));
			}
			if (!S || S.icon_state == "none") {
				continue;
			}
			accessory_overlay = (yield* mutable_appearance(S.icon, { layer: -layer }));
			if (bodypart == "tail_lizard" || bodypart == "tail_human") {
				bodypart = "tail";
			} else if (bodypart == "waggingtail_lizard" || bodypart == "waggingtail_human") {
				bodypart = "waggingtail";
			}
			if (S.gender_specific) {
				accessory_overlay.icon_state = `${_g}_${bodypart}_${S.icon_state}_${layertext}`;
			} else {
				accessory_overlay.icon_state = `m_${bodypart}_${S.icon_state}_${layertext}`;
			}
			if (S.center) {
				accessory_overlay = center_image(accessory_overlay, S.dimension_x, S.dimension_y);
			}
			if (!rt.bitAnd(H.disabilities, 64)) {
				if (!forced_colour) {
					if (S.color_src === MUTCOLORS) {
						if (this.fixed_mut_color) {
							accessory_overlay.color = `#${this.fixed_mut_color}`;
						} else {
							accessory_overlay.color = `#${rt.index(H.dna.features, "mcolor")}`;
						}
					} else if (S.color_src === HAIR) {
						if (this.hair_color == "mutcolor") {
							accessory_overlay.color = `#${rt.index(H.dna.features, "mcolor")}`;
						} else {
							accessory_overlay.color = `#${H.hair_color}`;
						}
					} else if (S.color_src === FACEHAIR) {
						accessory_overlay.color = `#${H.facial_hair_color}`;
					} else if (S.color_src === EYECOLOR) {
						accessory_overlay.color = `#${H.eye_color}`;
					}
				} else {
					accessory_overlay.color = forced_colour;
				}
			}
			standing += accessory_overlay;
			if (S.hasinner) {
				inner_accessory_overlay = (yield* mutable_appearance(S.icon, { layer: -layer }));
				if (S.gender_specific) {
					inner_accessory_overlay.icon_state = `${_g}_${bodypart}inner_${S.icon_state}_${layertext}`;
				} else {
					inner_accessory_overlay.icon_state = `m_${bodypart}inner_${S.icon_state}_${layertext}`;
				}
				if (S.center) {
					inner_accessory_overlay = center_image(inner_accessory_overlay, S.dimension_x, S.dimension_y);
				}
				standing += inner_accessory_overlay;
			}
		}
		rt.setAt(H.overlays_standing, layer, (yield* standing.Copy()));
		standing = list();
	}
	H.apply_overlay(BODY_BEHIND_LAYER);
	H.apply_overlay(BODY_ADJ_LAYER);
	H.apply_overlay(BODY_FRONT_LAYER);
	return f.dot;
}, true);

// species.dm:581
rt.def("/datum/species/proc/mutant_bodyparts_layertext", function mutant_bodyparts_layertext(f: Frame, layer: Value) {
	if (layer === BODY_BEHIND_LAYER) {
		return "BEHIND";
	} else if (layer === BODY_ADJ_LAYER) {
		return "ADJ";
	} else if (layer === BODY_FRONT_LAYER) {
		return "FRONT";
	}
	return f.dot;
});

// species.dm:591
rt.def("/datum/species/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (!rt.isIn(f, NOBREATH, this.species_traits)) return f.dot;
	yield* H.setOxyLoss(0);
	H.losebreath = 0;
	let takes_crit_damage: Value = (!rt.isIn(f, NOCRITDAMAGE, this.species_traits) ? 1 : 0);
	if (!(H.health < 0 && takes_crit_damage)) return f.dot;
	yield* H.adjustBruteLoss(1);
	return f.dot;
}, true);

// species.dm:607
rt.def("/datum/species/proc/can_equip", function* can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value, H: Value, bypass_equip_delay_self: Value) {
	let O: Value = null, B: Value = null;
	bypass_equip_delay_self ??= 0;
	if (rt.isIn(f, slot, this.no_equip)) {
		if (!I.species_exception || !is_type_in_list(this, I.species_exception)) {
			return 0;
		}
	}
	let num_arms: Value = H.get_num_arms();
	let num_legs: Value = H.get_num_legs();
	if (slot === slot_hands) {
		if (H.get_empty_held_indexes()) {
			return 1;
		}
		return 0;
	} else if (slot === slot_wear_mask) {
		if (H.wear_mask) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_MASK)) {
			return 0;
		}
		if (!H.get_bodypart("head")) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_neck) {
		if (H.wear_neck) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_NECK)) {
			return 0;
		}
		return slot_back;
	} else if (slot === slot_back) {
		if (H.back) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_BACK)) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_wear_suit) {
		if (H.wear_suit) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_OCLOTHING)) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_gloves) {
		if (H.gloves) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_GLOVES)) {
			return 0;
		}
		if (num_arms < 2) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_shoes) {
		if (H.shoes) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_FEET)) {
			return 0;
		}
		if (num_legs < 2) {
			return 0;
		}
		if (rt.isIn(f, DIGITIGRADE, this.species_traits)) {
			if (!disable_warning) {
				to_chat(H, "<span class='warning'>The footwear around here isn't compatible with your feet!</span>");
			}
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_belt) {
		if (H.belt) {
			return 0;
		}
		O = H.get_bodypart("chest");
		if (!H.w_uniform && !this.nojumpsuit && (!O || O.status != BODYPART_ROBOTIC)) {
			if (!disable_warning) {
				to_chat(H, `<span class='warning'>You need a jumpsuit before you can attach this ${I.name}!</span>`);
			}
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_BELT)) {
			return f.dot;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_glasses) {
		if (H.glasses) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_EYES)) {
			return 0;
		}
		if (!H.get_bodypart("head")) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_head) {
		if (H.head) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_HEAD)) {
			return 0;
		}
		if (!H.get_bodypart("head")) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_ears) {
		if (H.ears) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_EARS)) {
			return 0;
		}
		if (!H.get_bodypart("head")) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_w_uniform) {
		if (H.w_uniform) {
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_ICLOTHING)) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_wear_id) {
		if (H.wear_id) {
			return 0;
		}
		O = H.get_bodypart("chest");
		if (!H.w_uniform && !this.nojumpsuit && (!O || O.status != BODYPART_ROBOTIC)) {
			if (!disable_warning) {
				to_chat(H, `<span class='warning'>You need a jumpsuit before you can attach this ${I.name}!</span>`);
			}
			return 0;
		}
		if (!rt.bitAnd(I.slot_flags, SLOT_ID)) {
			return 0;
		}
		return (yield* this.equip_delay_self_check(I, H, bypass_equip_delay_self));
	} else if (slot === slot_l_store) {
		if (rt.bitAnd(I.flags, NODROP)) {
			return 0;
		}
		if (H.l_store) {
			return 0;
		}
		O = H.get_bodypart("l_leg");
		if (!H.w_uniform && !this.nojumpsuit && (!O || O.status != BODYPART_ROBOTIC)) {
			if (!disable_warning) {
				to_chat(H, `<span class='warning'>You need a jumpsuit before you can attach this ${I.name}!</span>`);
			}
			return 0;
		}
		if (rt.bitAnd(I.slot_flags, SLOT_DENYPOCKET)) {
			return f.dot;
		}
		if (I.w_class <= WEIGHT_CLASS_SMALL || rt.bitAnd(I.slot_flags, SLOT_POCKET)) {
			return 1;
		}
	} else if (slot === slot_r_store) {
		if (rt.bitAnd(I.flags, NODROP)) {
			return 0;
		}
		if (H.r_store) {
			return 0;
		}
		O = H.get_bodypart("r_leg");
		if (!H.w_uniform && !this.nojumpsuit && (!O || O.status != BODYPART_ROBOTIC)) {
			if (!disable_warning) {
				to_chat(H, `<span class='warning'>You need a jumpsuit before you can attach this ${I.name}!</span>`);
			}
			return 0;
		}
		if (rt.bitAnd(I.slot_flags, SLOT_DENYPOCKET)) {
			return 0;
		}
		if (I.w_class <= WEIGHT_CLASS_SMALL || rt.bitAnd(I.slot_flags, SLOT_POCKET)) {
			return 1;
		}
		return 0;
	} else if (slot === slot_s_store) {
		if (rt.bitAnd(I.flags, NODROP)) {
			return 0;
		}
		if (H.s_store) {
			return 0;
		}
		if (!H.wear_suit) {
			if (!disable_warning) {
				to_chat(H, `<span class='warning'>You need a suit before you can attach this ${I.name}!</span>`);
			}
			return 0;
		}
		if (!H.wear_suit.allowed) {
			if (!disable_warning) {
				to_chat(H, "You somehow have a suit with no defined allowed items for suit storage, stop that.");
			}
			return 0;
		}
		if (I.w_class > WEIGHT_CLASS_BULKY) {
			if (!disable_warning) {
				to_chat(H, `The ${I.name} is too big to attach.`);
			}
			return 0;
		}
		if (rt.istype(I, T("/obj/item/device/pda")) || rt.istype(I, T("/obj/item/weapon/pen")) || is_type_in_list(I, H.wear_suit.allowed)) {
			return 1;
		}
		return 0;
	} else if (slot === slot_handcuffed) {
		if (H.handcuffed) {
			return 0;
		}
		if (!rt.istype(I, T("/obj/item/weapon/restraints/handcuffs"))) {
			return 0;
		}
		if (num_arms < 2) {
			return 0;
		}
		return 1;
	} else if (slot === slot_legcuffed) {
		if (H.legcuffed) {
			return 0;
		}
		if (!rt.istype(I, T("/obj/item/weapon/restraints/legcuffs"))) {
			return 0;
		}
		if (num_legs < 2) {
			return 0;
		}
		return 1;
	} else if (slot === slot_in_backpack) {
		if (H.back && rt.istype(H.back, T("/obj/item/weapon/storage"))) {
			if ((B = H.back).can_be_inserted(I, 1, H)) {
				return 1;
			}
		}
		return 0;
	}
	return 0;
}, true);

// species.dm:798
rt.def("/datum/species/proc/equip_delay_self_check", function* equip_delay_self_check(f: Frame, I: Value, H: Value, bypass_equip_delay_self: Value) {
	if (!I.equip_delay_self || bypass_equip_delay_self) {
		return 1;
	}
	H.visible_message(`<span class='notice'>${H} start putting on ${I}...</span>`, `<span class='notice'>You start putting on ${I}...</span>`);
	return (yield* do_after(H, I.equip_delay_self, { target: H }));
}, true);

// species.dm:807
rt.def("/datum/species/proc/after_equip_job", function* after_equip_job(f: Frame, J: Value, H: Value) {
	yield* H.update_mutant_bodyparts();
	return f.dot;
}, true);

// species.dm:810
rt.def("/datum/species/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	if (chem.id == this.exotic_blood) {
		H.blood_volume = min(H.blood_volume + round(chem.volume, 0.1), BLOOD_VOLUME_MAXIMUM);
		yield* H.reagents.del_reagent(chem.id);
		return 1;
	}
	return 0;
}, true);

// species.dm:821
rt.def("/datum/species/proc/get_spans", function get_spans(f: Frame) {
	return list();
});

// species.dm:833
rt.def("/datum/species/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame, H: Value) {
	let hunger_rate: Value = null;
	if (rt.bitAnd(H.disabilities, 32)) {
		if (H.overeatduration < 100) {
			to_chat(H, "<span class='notice'>You feel fit again!</span>");
			(rt.modField(f, H, "disabilities", 16777183, rt.bitAnd));
			yield* H.update_inv_w_uniform();
			yield* H.update_inv_wear_suit();
		}
	} else if (H.overeatduration > 500) {
		to_chat(H, "<span class='danger'>You suddenly feel blubbery!</span>");
		(rt.modField(f, H, "disabilities", 32, rt.bitOr));
		yield* H.update_inv_w_uniform();
		yield* H.update_inv_wear_suit();
	}
	if (H.nutrition > 0 && H.stat != 2 && H.dna && H.dna.species && !rt.isIn(f, NOHUNGER, H.dna.species.species_traits)) {
		hunger_rate = HUNGER_FACTOR;
		if (H.satiety > 0) {
			H.satiety--;
		}
		if (H.satiety < 0) {
			H.satiety++;
			if (prob(round(-H.satiety / 40))) {
				H.Jitter(5);
			}
			hunger_rate = 0.3;
		}
		H.nutrition = max(0, H.nutrition - hunger_rate);
	}
	if (H.nutrition > NUTRITION_LEVEL_FULL) {
		if (H.overeatduration < 600) {
			H.overeatduration++;
		}
	} else if (H.overeatduration > 1) {
		H.overeatduration -= 2;
	}
	if (H.nutrition > NUTRITION_LEVEL_FAT) {
		H.metabolism_efficiency = 1;
	} else if (H.nutrition > NUTRITION_LEVEL_FED && H.satiety > 80) {
		if (H.metabolism_efficiency != 1.25 && H.dna && H.dna.species && !rt.isIn(f, NOHUNGER, H.dna.species.species_traits)) {
			to_chat(H, "<span class='notice'>You feel vigorous.</span>");
			H.metabolism_efficiency = 1.25;
		}
	} else if (H.nutrition < 200) {
		if (H.metabolism_efficiency != 0.8) {
			to_chat(H, "<span class='notice'>You feel sluggish.</span>");
		}
		H.metabolism_efficiency = 0.8;
	} else {
		if (H.metabolism_efficiency == 1.25) {
			to_chat(H, "<span class='notice'>You no longer feel vigorous.</span>");
		}
		H.metabolism_efficiency = 1;
	}
	if (rt.inRange(H.nutrition, NUTRITION_LEVEL_FULL, 1e+31)) {
		yield* H.throw_alert("nutrition", T("/obj/screen/alert/fat"));
	} else if (rt.inRange(H.nutrition, NUTRITION_LEVEL_HUNGRY, NUTRITION_LEVEL_FULL)) {
		yield* H.clear_alert("nutrition");
	} else if (rt.inRange(H.nutrition, NUTRITION_LEVEL_STARVING, NUTRITION_LEVEL_HUNGRY)) {
		yield* H.throw_alert("nutrition", T("/obj/screen/alert/hungry"));
	} else {
		yield* H.throw_alert("nutrition", T("/obj/screen/alert/starving"));
	}
	return f.dot;
}, true);

// species.dm:899
rt.def("/datum/species/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame, H: Value) {
	if (!rt.isIn(f, RADIMMUNE, this.species_traits)) {
		if (H.radiation) {
			if (H.radiation > 100) {
				if (!H.IsKnockdown()) {
					yield* H.emote("collapse");
				}
				yield* H.Knockdown(200);
				to_chat(H, "<span class='danger'>You feel weak.</span>");
			}
			if (rt.inRange(H.radiation, 50, 75)) {
				if (prob(5)) {
					if (!H.IsKnockdown()) {
						yield* H.emote("collapse");
					}
					yield* H.Knockdown(60);
					to_chat(H, "<span class='danger'>You feel weak.</span>");
				}
				if (prob(15)) {
					if (H.hair_style != "Shaved" || H.hair_style != "Bald" || rt.isIn(f, HAIR, this.species_traits)) {
						to_chat(H, "<span class='danger'>Your hair starts to fall out in clumps...<span>");
						yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/species/proc/go_bald"), H)), 50);
					}
				}
			} else if (rt.inRange(H.radiation, 75, 100)) {
				if (prob(1)) {
					to_chat(H, "<span class='danger'>You mutate!</span>");
					yield* H.randmutb();
					yield* H.emote("gasp");
					yield* H.domutcheck();
				}
			}
		}
		return 0;
	}
	H.radiation = 0;
	return 1;
}, true);

// species.dm:930
rt.def("/datum/species/proc/go_bald", function* go_bald(f: Frame, H: Value) {
	if (!H || H.gc_destroyed) {
		return f.dot;
	}
	H.facial_hair_style = "Shaved";
	H.hair_style = "Bald";
	yield* H.update_hair();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

// species.dm:946
rt.def("/datum/species/proc/movement_delay", function* movement_delay(f: Frame, H: Value) {
	let F: Value = null, J: Value = null, C: Value = null, _T: Value = null, I: Value = null, health_deficiency: Value = null, hungry: Value = null;
	let $e: any;
	f.dot = 0;
	let flight: Value = 0;
	let flightpack: Value = 0;
	let ignoreslow: Value = 0;
	let gravity: Value = 0;
	if (rt.istype((F = H.get_flightpack()), T("/obj/item/device/flightpack")) && F.flight) {
		flightpack = 1;
	}
	if (rt.bitAnd(H.movement_type, 2)) {
		flight = 1;
	}
	if (!flightpack) {
		if (rt.bitAnd(H.status_flags, 32)) {
			f.dot -= 1;
		}
		if (rt.bitAnd(H.status_flags, 64)) {
			f.dot -= 2;
		}
		f.dot += this.speedmod;
	}
	if (rt.bitAnd(H.status_flags, 16)) {
		ignoreslow = 1;
	}
	if (H.has_gravity()) {
		gravity = 1;
	}
	if (!gravity) {
		J = H.back;
		C = H.wear_suit;
		_T = H.getorganslot("thrusters");
		if (!rt.istype(J, T("/obj/item/weapon/tank/jetpack")) && rt.istype(C, T("/obj/item/clothing/suit/space/hardsuit"))) {
			J = C.jetpack;
		}
		if (rt.istype(J, T("/obj/item/weapon/tank/jetpack")) && J.full_speed && (yield* J.allow_thrust(0.01, H))) {
			f.dot -= 2;
		} else if (rt.istype(_T, T("/obj/item/organ/cyberimp/chest/thrusters")) && (yield* _T.allow_thrust(0.01, H))) {
			f.dot -= 2;
		} else if (flightpack && (yield* F.allow_thrust(0.01, this))) {
			f.dot -= 2;
		}
	}
	if (flightpack && F.boost) {
		f.dot -= F.boost_speed;
	} else if (flightpack && F.brake) {
		f.dot += 2;
	}
	if (!ignoreslow && !flightpack && gravity) {
		if (H.wear_suit) {
			f.dot += H.wear_suit.slowdown;
		}
		if (H.shoes) {
			f.dot += H.shoes.slowdown;
		}
		if (H.back) {
			f.dot += H.back.slowdown;
		}
		for (I of each(H.held_items, T("/obj/item"))) {
			if (I.secondary_flags ? rt.index(I.secondary_flags, "slows_while_in_hand") : 0) {
				f.dot += I.slowdown;
			}
		}
		health_deficiency = 100 - H.health + H.staminaloss;
		hungry = (500 - H.nutrition) / 5;
		if (health_deficiency >= 40) {
			if (flight) {
				f.dot += health_deficiency / 75;
			} else {
				f.dot += health_deficiency / 25;
			}
		}
		if (hungry >= 70 && !flight) {
			f.dot += hungry / 50;
		}
		if (rt.bitAnd(H.disabilities, 32)) {
			f.dot += 1.5 - flight;
		}
		if (H.bodytemperature < BODYTEMP_COLD_DAMAGE_LIMIT) {
			f.dot += (BODYTEMP_COLD_DAMAGE_LIMIT - H.bodytemperature) / COLD_SLOWDOWN_FACTOR;
		}
	}
	return f.dot;
}, true);

// species.dm:1017
rt.def("/datum/species/proc/help", function* help(f: Frame, user: Value, target: Value, attacker_style: Value) {
	let we_breathe: Value = null, we_lung: Value = null;
	if (target.health >= 0 && !rt.bitAnd(target.status_flags, FAKEDEATH)) {
		yield* target.help_shake_act(user);
		if (target != user) {
			add_logs(user, target, "shaked");
		}
		return 1;
	} else {
		we_breathe = (!rt.isIn(f, NOBREATH, user.dna.species.species_traits) ? 1 : 0);
		we_lung = user.getorganslot("lungs");
		if (we_breathe && we_lung) {
			yield* user.do_cpr(target);
		} else if (we_breathe && !we_lung) {
			to_chat(user, "<span class='warning'>You have no lungs to breathe with, so you cannot peform CPR.</span>");
		} else {
			to_chat(user, "<span class='notice'>You do not breathe, so you cannot perform CPR.</span>");
		}
	}
	return f.dot;
}, true);

// species.dm:1034
rt.def("/datum/species/proc/grab", function* grab(f: Frame, user: Value, target: Value, attacker_style: Value) {
	if (yield* target.check_block()) {
		target.visible_message(`<span class='warning'>${target} blocks ${user}'s grab attempt!</span>`);
		return 0;
	}
	if (attacker_style && (yield* attacker_style.grab_act(user, target))) {
		return 1;
	} else {
		yield* target.grabbedby(user);
		return 1;
	}
}, true);

// species.dm:1048
rt.def("/datum/species/proc/harm", function* harm(f: Frame, user: Value, target: Value, attacker_style: Value) {
	let atk_verb: Value = null, damage: Value = null, affecting: Value = null, armor_block: Value = null;
	if (yield* target.check_block()) {
		target.visible_message(`<span class='warning'>${target} blocks ${user}'s attack!</span>`);
		return 0;
	}
	if (attacker_style && (yield* attacker_style.harm_act(user, target))) {
		return 1;
	} else {
		atk_verb = user.dna.species.attack_verb;
		if (target.lying) {
			atk_verb = "kick";
		}
		if (atk_verb === "kick") {
			yield* user.do_attack_animation(target, "kick");
		} else if (atk_verb === "slash") {
			yield* user.do_attack_animation(target, "claw");
		} else if (atk_verb === "smash") {
			yield* user.do_attack_animation(target, "smash");
		} else {
			yield* user.do_attack_animation(target, "punch");
		}
		damage = rand(user.dna.species.punchdamagelow, user.dna.species.punchdamagehigh);
		affecting = target.get_bodypart(ran_zone(user.zone_selected));
		if (!damage || !affecting) {
			playsound(target.loc, user.dna.species.miss_sound, 25, 1, -1);
			target.visible_message(`<span class='danger'>${user} has attempted to ${atk_verb} ${target}!</span>`, `<span class='userdanger'>${user} has attempted to ${atk_verb} ${target}!</span>`, null, 3);
			return 0;
		}
		armor_block = target.run_armor_check(affecting, "melee");
		playsound(target.loc, user.dna.species.attack_sound, 25, 1, -1);
		target.visible_message(`<span class='danger'>${user} has ${atk_verb}ed ${target}!</span>`, `<span class='userdanger'>${user} has ${atk_verb}ed ${target}!</span>`, null, 3);
		if (user.limb_destroyer) {
			yield* target.dismembering_strike(user, affecting.body_zone);
		}
		yield* target.apply_damage(damage, "brute", affecting, armor_block);
		add_logs(user, target, "punched");
		if (target.stat != 2 && damage >= user.dna.species.punchstunthreshold) {
			target.visible_message(`<span class='danger'>${user} has knocked  ${target} down!</span>`, `<span class='userdanger'>${user} has knocked ${target} down!</span>`);
			yield* target.apply_effect(80, "knockdown", armor_block);
			yield* target.forcesay(GLOB.hit_appends);
		} else {
			if (!target.lying) return f.dot;
			yield* target.forcesay(GLOB.hit_appends);
		}
	}
	return f.dot;
}, true);

// species.dm:1102
rt.def("/datum/species/proc/disarm", function* disarm(f: Frame, user: Value, target: Value, attacker_style: Value) {
	let affecting: Value = null, randn: Value = null, I: Value = null;
	if (yield* target.check_block()) {
		target.visible_message(`<span class='warning'>${target} blocks ${user}'s disarm attempt!</span>`);
		return 0;
	}
	if (attacker_style && (yield* attacker_style.disarm_act(user, target))) {
		return 1;
	} else {
		yield* user.do_attack_animation(target, "disarm");
		if (target.w_uniform) {
			yield* target.w_uniform.add_fingerprint(user);
		}
		affecting = target.get_bodypart(ran_zone(user.zone_selected));
		if ((randn = rand(1, 100)) <= 25) {
			playsound(target, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			target.visible_message(`<span class='danger'>${user} has pushed ${target}!</span>`, `<span class='userdanger'>${user} has pushed ${target}!</span>`, null, 3);
			yield* target.apply_effect(40, "knockdown", target.run_armor_check(affecting, "melee", "Your armor prevents your fall!", "Your armor softens your fall!"));
			yield* target.forcesay(GLOB.hit_appends);
			add_logs(user, target, "disarmed", " pushing them to the ground");
			return f.dot;
		}
		if (randn <= 60) {
			if (target.pulling) {
				to_chat(target, `<span class='warning'>${user} has broken ${target}'s grip on ${target.pulling}!</span>`);
				yield* target.stop_pulling();
			} else {
				I = target.get_active_held_item();
				if (yield* target.drop_item()) {
					target.visible_message(`<span class='danger'>${user} has disarmed ${target}!</span>`, `<span class='userdanger'>${user} has disarmed ${target}!</span>`, null, 3);
				} else {
					I = null;
				}
			}
			playsound(target, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			add_logs(user, target, "disarmed", `${I ? fmt(" removing ％！", [I]) : ""}`);
			return f.dot;
		}
		playsound(target, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
		target.visible_message(`<span class='danger'>${user} attempted to disarm ${target}!</span>`, `<span class='userdanger'>${user} attemped to disarm ${target}!</span>`, null, 3);
	}
	return f.dot;
}, true);

// species.dm:1150
rt.def("/datum/species/proc/spec_attack_hand", function* spec_attack_hand(f: Frame, M: Value, H: Value, attacker_style: Value) {
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (!M.dna || !M.dna.species) {
		return f.dot;
	}
	if (!H.dna || !H.dna.species) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (M.mind) {
		attacker_style = M.mind.martial_art;
	}
	if (M != H && M.a_intent != "help" && (yield* H.check_shields(M, 0, M.name, { attack_type: 2 }))) {
		add_logs(M, H, "attempted to touch");
		H.visible_message(`<span class='warning'>${M} attempted to touch ${H}!</span>`);
		return 0;
	}
	if (M.a_intent === "help") {
		yield* this.help(M, H, attacker_style);
	} else if (M.a_intent === "grab") {
		yield* this.grab(M, H, attacker_style);
	} else if (M.a_intent === "harm") {
		yield* this.harm(M, H, attacker_style);
	} else if (M.a_intent === "disarm") {
		yield* this.disarm(M, H, attacker_style);
	}
	return f.dot;
}, true);

// species.dm:1178
rt.def("/datum/species/proc/spec_attacked_by", function* spec_attacked_by(f: Frame, I: Value, user: Value, affecting: Value, intent: Value, H: Value) {
	let probability: Value = null, location: Value = null;
	if (user != H) {
		if (yield* H.check_shields(I, I.force, `the ${I.name}`, 1, I.armour_penetration)) {
			return 0;
		}
	}
	if (yield* H.check_block()) {
		H.visible_message(`<span class='warning'>${H} blocks ${I}!</span>`);
		return 0;
	}
	if (!affecting) {
		affecting = rt.index(H.bodyparts, 1);
	}
	let hit_area: Value = affecting.name;
	let def_zone: Value = affecting.body_zone;
	let armor_block: Value = H.run_armor_check(affecting, "melee", `<span class='notice'>Your armor has protected your ${hit_area}.</span>`, `<span class='notice'>Your armor has softened a hit to your ${hit_area}.</span>`, I.armour_penetration);
	armor_block = min(90, armor_block);
	let Iforce: Value = I.force;
	let weakness: Value = (yield* H.check_weakness(I, user));
	yield* this.apply_damage(I.force * weakness, I.damtype, def_zone, armor_block, H);
	yield* H.damage_clothes(I.force, I.damtype, "melee", affecting.body_zone);
	H.send_item_attack_message(I, user, hit_area);
	if (!I.force) {
		return 0;
	}
	if (prob((probability = I.get_dismemberment_chance(affecting))) || rt.isIn(f, EASYDISMEMBER, this.species_traits) && prob(2 * probability)) {
		if (yield* affecting.dismember(I.damtype)) {
			yield* I.add_mob_blood(H);
			playsound(rt.getStep(f, H, 0), I.get_dismember_sound(), 80, 1);
		}
	}
	let bloody: Value = 0;
	if (I.damtype == "brute" && I.force && prob(25 + I.force * 2)) {
		if (affecting.status == BODYPART_ORGANIC) {
			yield* I.add_mob_blood(H);
			if (prob(I.force * 2)) {
				bloody = 1;
				if (rt.istype((location = H.loc), T("/turf"))) {
					yield* H.add_splatter_floor(location);
				}
				if (get_dist(user, H) <= 1) {
					yield* user.add_mob_blood(H);
				}
			}
		}
		if (hit_area === "head") {
			if (H.stat == 0 && armor_block < 50) {
				if (prob(I.force)) {
					H.visible_message(`<span class='danger'>${H} has been knocked senseless!</span>`, `<span class='userdanger'>${H} has been knocked senseless!</span>`);
					H.confused = max(H.confused, 20);
					yield* H.adjust_blurriness(10);
				}
				if (prob(I.force + (100 - H.health) / 2) && H != user) {
					yield* GLOB.SSticker.mode.remove_revolutionary(H.mind);
				}
			}
			if (bloody) {
				if (H.wear_mask) {
					yield* H.wear_mask.add_mob_blood(H);
					yield* H.update_inv_wear_mask();
				}
				if (H.head) {
					yield* H.head.add_mob_blood(H);
					yield* H.update_inv_head();
				}
				if (H.glasses && prob(33)) {
					yield* H.glasses.add_mob_blood(H);
					H.update_inv_glasses();
				}
			}
		} else if (hit_area === "chest") {
			if (H.stat == 0 && armor_block < 50) {
				if (prob(I.force)) {
					H.visible_message(`<span class='danger'>${H} has been knocked down!</span>`, `<span class='userdanger'>${H} has been knocked down!</span>`);
					yield* H.apply_effect(60, "knockdown", armor_block);
				}
			}
			if (bloody) {
				if (H.wear_suit) {
					yield* H.wear_suit.add_mob_blood(H);
					yield* H.update_inv_wear_suit();
				}
				if (H.w_uniform) {
					yield* H.w_uniform.add_mob_blood(H);
					yield* H.update_inv_w_uniform();
				}
			}
		}
		if (Iforce > 10 || Iforce >= 5 && prob(33)) {
			yield* H.forcesay(GLOB.hit_appends);
		}
	}
	return 1;
}, true);

// species.dm:1267
rt.def("/datum/species/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value, H: Value) {
	let BP: Value = null;
	damagetype ??= "brute";
	let hit_percent: Value = (100 - (blocked + this.armor)) / 100;
	if (!damage || hit_percent <= 0) {
		return 0;
	}
	if (rt.istype(def_zone, T("/obj/item/bodypart"))) {
		BP = def_zone;
	} else {
		if (!def_zone) {
			def_zone = ran_zone(def_zone);
		}
		if (!(BP = H.get_bodypart(check_zone(def_zone)))) {
			BP = rt.index(H.bodyparts, 1);
		}
	}
	if (damagetype === "brute") {
		H.damageoverlaytemp = 20;
		if (BP) {
			if (yield* BP.receive_damage(damage * hit_percent * this.brutemod, 0)) {
				H.update_damage_overlays();
			}
		} else {
			yield* H.adjustBruteLoss(damage * hit_percent * this.brutemod);
		}
	} else if (damagetype === "fire") {
		H.damageoverlaytemp = 20;
		if (BP) {
			if (yield* BP.receive_damage(0, damage * hit_percent * this.burnmod)) {
				H.update_damage_overlays();
			}
		} else {
			yield* H.adjustFireLoss(damage * hit_percent * this.burnmod);
		}
	} else if (damagetype === "tox") {
		yield* H.adjustToxLoss(damage * hit_percent);
	} else if (damagetype === "oxy") {
		yield* H.adjustOxyLoss(damage * hit_percent);
	} else if (damagetype === "clone") {
		yield* H.adjustCloneLoss(damage * hit_percent);
	} else if (damagetype === "stamina") {
		yield* H.adjustStaminaLoss(damage * hit_percent);
	}
	return 1;
}, true);

// species.dm:1308
rt.def("/datum/species/proc/on_hit", function on_hit(f: Frame, _P: Value, H: Value) {
	let $0: any = _P.type;
	if ($0 == T("/obj/item/projectile/energy/floramut")) {
		H.show_message("<span class='notice'>The radiation beam dissipates harmlessly through your body.</span>");
	} else if ($0 == T("/obj/item/projectile/energy/florayield")) {
		H.show_message("<span class='notice'>The radiation beam dissipates harmlessly through your body.</span>");
	}
	return f.dot;
});

// species.dm:1323
rt.def("/datum/species/proc/breathe", function breathe(f: Frame, H: Value) {
	if (!rt.isIn(f, NOBREATH, this.species_traits)) return f.dot;
	return 1;
});

// species.dm:1327
rt.def("/datum/species/proc/handle_environment", function* handle_environment(f: Frame, environment: Value, H: Value) {
	let thermal_protection: Value = null, burn_damage: Value = null, adjusted_pressure: Value = null;
	if (!environment) {
		return f.dot;
	}
	if (rt.istype(H.loc, T("/obj/machinery/atmospherics/components/unary/cryo_cell"))) {
		return f.dot;
	}
	let loc_temp: Value = H.get_temperature(environment);
	if (H.stat != 2) {
		H.natural_bodytemperature_stabilization();
	}
	if (!H.on_fire) {
		if (loc_temp < H.bodytemperature) {
			if ((thermal_protection = H.get_cold_protection(loc_temp)) < 1) {
				H.bodytemperature += min((1 - thermal_protection) * ((loc_temp - H.bodytemperature) / BODYTEMP_COLD_DIVISOR), BODYTEMP_COOLING_MAX);
			}
		} else if ((thermal_protection = H.get_heat_protection(loc_temp)) < 1) {
			H.bodytemperature += min((1 - thermal_protection) * ((loc_temp - H.bodytemperature) / BODYTEMP_HEAT_DIVISOR), BODYTEMP_HEATING_MAX);
		}
	}
	if (H.bodytemperature > BODYTEMP_HEAT_DAMAGE_LIMIT && !rt.isIn(f, RESISTHOT, this.species_traits)) {
		if (rt.inRange(H.bodytemperature, 360, 400)) {
			yield* H.throw_alert("temp", T("/obj/screen/alert/hot"), 1);
			burn_damage = HEAT_DAMAGE_LEVEL_1;
		} else if (rt.inRange(H.bodytemperature, 400, 460)) {
			yield* H.throw_alert("temp", T("/obj/screen/alert/hot"), 2);
			burn_damage = HEAT_DAMAGE_LEVEL_2;
		} else if (rt.inRange(H.bodytemperature, 460, 1e+31)) {
			yield* H.throw_alert("temp", T("/obj/screen/alert/hot"), 3);
			if (H.on_fire) {
				burn_damage = HEAT_DAMAGE_LEVEL_3;
			} else {
				burn_damage = HEAT_DAMAGE_LEVEL_2;
			}
		}
		burn_damage *= this.heatmod;
		if (prob(burn_damage) * 10 / 4) {
			yield* H.emote("scream");
		}
		yield* H.apply_damage(burn_damage, "fire");
	} else if (H.bodytemperature < BODYTEMP_COLD_DAMAGE_LIMIT && !rt.isIn(f, rt.at(GLOB.mutations_list, "Cold Resistance"), H.dna.mutations)) {
		if (rt.inRange(H.bodytemperature, 200, 260)) {
			yield* H.throw_alert("temp", T("/obj/screen/alert/cold"), 1);
			yield* H.apply_damage(COLD_DAMAGE_LEVEL_1 * this.coldmod, "fire");
		} else if (rt.inRange(H.bodytemperature, 120, 200)) {
			yield* H.throw_alert("temp", T("/obj/screen/alert/cold"), 2);
			yield* H.apply_damage(COLD_DAMAGE_LEVEL_2 * this.coldmod, "fire");
		} else if (rt.inRange(H.bodytemperature, -1e+31, 120)) {
			yield* H.throw_alert("temp", T("/obj/screen/alert/cold"), 3);
			yield* H.apply_damage(COLD_DAMAGE_LEVEL_3 * this.coldmod, "fire");
		} else {
			yield* H.clear_alert("temp");
		}
	} else {
		yield* H.clear_alert("temp");
	}
	let pressure: Value = environment.return_pressure();
	const subject = (adjusted_pressure = H.calculate_affecting_pressure(pressure));
	if (rt.inRange(subject, HAZARD_HIGH_PRESSURE, 1e+31)) {
		if (!rt.isIn(f, RESISTPRESSURE, this.species_traits)) {
			yield* H.adjustBruteLoss(min((adjusted_pressure / HAZARD_HIGH_PRESSURE - 1) * PRESSURE_DAMAGE_COEFFICIENT, MAX_HIGH_PRESSURE_DAMAGE));
			yield* H.throw_alert("pressure", T("/obj/screen/alert/highpressure"), 2);
		} else {
			yield* H.clear_alert("pressure");
		}
	} else if (rt.inRange(subject, WARNING_HIGH_PRESSURE, HAZARD_HIGH_PRESSURE)) {
		yield* H.throw_alert("pressure", T("/obj/screen/alert/highpressure"), 1);
	} else if (rt.inRange(subject, WARNING_LOW_PRESSURE, WARNING_HIGH_PRESSURE)) {
		yield* H.clear_alert("pressure");
	} else if (rt.inRange(subject, HAZARD_LOW_PRESSURE, WARNING_LOW_PRESSURE)) {
		yield* H.throw_alert("pressure", T("/obj/screen/alert/lowpressure"), 1);
	} else if (H.dna.check_mutation("Cold Resistance") || rt.isIn(f, RESISTPRESSURE, this.species_traits)) {
		yield* H.clear_alert("pressure");
	} else {
		yield* H.adjustBruteLoss(LOW_PRESSURE_DAMAGE);
		yield* H.throw_alert("pressure", T("/obj/screen/alert/lowpressure"), 2);
	}
	return f.dot;
}, true);

// species.dm:1419
rt.def("/datum/species/proc/handle_fire", function* handle_fire(f: Frame, H: Value, no_protection: Value) {
	let head_clothes: Value = null, chest_clothes: Value = null, arm_clothes: Value = null, leg_clothes: Value = null, X: Value = null, I: Value = null, thermal_protection: Value = null;
	no_protection ??= 0;
	if (rt.isIn(f, NOFIRE, this.species_traits)) {
		return f.dot;
	}
	if (!H.on_fire) return f.dot;
	let burning_items: Value = list();
	if (H.glasses) {
		head_clothes = H.glasses;
	}
	if (H.wear_mask) {
		head_clothes = H.wear_mask;
	}
	if (H.wear_neck) {
		head_clothes = H.wear_neck;
	}
	if (H.head) {
		head_clothes = H.head;
	}
	if (head_clothes) {
		burning_items += head_clothes;
	} else if (H.ears) {
		burning_items += H.ears;
	}
	if (H.w_uniform) {
		chest_clothes = H.w_uniform;
	}
	if (H.wear_suit) {
		chest_clothes = H.wear_suit;
	}
	if (chest_clothes) {
		burning_items += chest_clothes;
	}
	if (H.gloves) {
		arm_clothes = H.gloves;
	}
	if (H.w_uniform && (rt.bitAnd(H.w_uniform.body_parts_covered, HANDS) || rt.bitAnd(H.w_uniform.body_parts_covered, ARMS))) {
		arm_clothes = H.w_uniform;
	}
	if (H.wear_suit && (rt.bitAnd(H.wear_suit.body_parts_covered, HANDS) || rt.bitAnd(H.wear_suit.body_parts_covered, ARMS))) {
		arm_clothes = H.wear_suit;
	}
	if (arm_clothes) {
		burning_items += arm_clothes;
	}
	if (H.shoes) {
		leg_clothes = H.shoes;
	}
	if (H.w_uniform && (rt.bitAnd(H.w_uniform.body_parts_covered, FEET) || rt.bitAnd(H.w_uniform.body_parts_covered, LEGS))) {
		leg_clothes = H.w_uniform;
	}
	if (H.wear_suit && (rt.bitAnd(H.wear_suit.body_parts_covered, FEET) || rt.bitAnd(H.wear_suit.body_parts_covered, LEGS))) {
		leg_clothes = H.wear_suit;
	}
	if (leg_clothes) {
		burning_items += leg_clothes;
	}
	for (X of each(burning_items)) {
		if (!rt.bitAnd((I = X).resistance_flags, FIRE_PROOF)) {
			yield* I.take_damage(H.fire_stacks, "fire", "fire", 0);
		}
	}
	if ((thermal_protection = H.get_thermal_protection()) >= FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT && !no_protection) {
		return f.dot;
	}
	if (thermal_protection >= FIRE_SUIT_MAX_TEMP_PROTECT && !no_protection) {
		H.bodytemperature += 11;
	} else {
		H.bodytemperature += BODYTEMP_HEATING_MAX + H.fire_stacks * 12;
	}
	return f.dot;
}, true);

// species.dm:1486
rt.def("/datum/species/proc/CanIgniteMob", function CanIgniteMob(f: Frame, H: Value) {
	if (rt.isIn(f, NOFIRE, this.species_traits)) {
		return 0;
	}
	return 1;
});

// species.dm:1499
rt.def("/datum/species/proc/spec_stun", function spec_stun(f: Frame, H: Value, amount: Value) {
	f.dot = this.stunmod * amount;
	return f.dot;
});
