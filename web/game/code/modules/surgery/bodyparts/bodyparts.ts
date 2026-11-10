// Based on /tg/station's code/modules/surgery/bodyparts/bodyparts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10165, "/obj/item/bodypart", "/obj/item", {
	owner: null,
	original_owner: null,
	status: 1,
	body_zone: null,
	body_part: null,
	use_digitigrade: 0,
	brutestate: 0,
	burnstate: 0,
	brute_dam: 0,
	burn_dam: 0,
	max_damage: 0,
	embedded_objects: null,
	held_index: 0,
	is_pseudopart: 0,
	skin_tone: "",
	body_gender: "",
	species_id: "",
	should_draw_gender: 0,
	should_draw_greyscale: 0,
	species_color: "",
	mutation_color: "",
	no_update: 0,
	animal_origin: null,
	dismemberable: 1,
	px_x: 0,
	px_y: 0,
	species_flags_list: null,
	dmg_overlay_type: null,
	name: "limb",
	desc: "why is it detached...",
	force: 3,
	throwforce: 3,
	icon: rt.rsc("icons/mob/human_parts.dmi"),
	icon_state: "",
	layer: 3.7,
});

// bodyparts.dm:21
rt.def("/obj/item/bodypart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.embedded_objects = list();

	this.species_flags_list = list();
	return f.dot;
});

// bodyparts.dm:45
rt.def("/obj/item/bodypart/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.brute_dam > 0) {
		to_chat(user, `<span class='warning'>This limb has ${this.brute_dam > 30 ? "severe" : "minor"} bruising.</span>`);
	}
	if (!(this.burn_dam > 0)) return f.dot;
	to_chat(user, `<span class='warning'>This limb has ${this.burn_dam > 30 ? "severe" : "minor"} burns.</span>`);
	return f.dot;
}, false);

// bodyparts.dm:52
rt.def("/obj/item/bodypart/proc/blob_act", function* blob_act(f: Frame) {
	yield* this.take_damage(this.max_damage);
	return f.dot;
}, true);

// bodyparts.dm:56
rt.def("/obj/item/bodypart/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner) {
		this.owner.bodyparts -= this;
		this.owner = null;
	}
	return (yield* parent_proc());
}, true);

// bodyparts.dm:61
rt.def("/obj/item/bodypart/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	let H: Value = null;
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		H = C;
		if (rt.isIn(f, EASYLIMBATTACHMENT, H.dna.species.species_traits)) {
			if (!H.get_bodypart(this.body_zone) && !this.animal_origin) {
				if (H == user) {
					H.visible_message(`<span class='warning'>${H} jams ${this} into ${H.p_their()} empty socket!</span>`, `<span class='notice'>You force ${this} into your empty socket, and it locks into place!</span>`);
				} else {
					H.visible_message(`<span class='warning'>${user} jams ${this} into ${H}'s empty socket!</span>`, `<span class='notice'>${user} forces ${this} into your empty socket, and it locks into place!</span>`);
				}
				yield* user.temporarilyRemoveItemFromInventory(this, 1);
				yield* this.attach_limb(C);
				return f.dot;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// bodyparts.dm:77
rt.def("/obj/item/bodypart/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W.sharpness) {
		yield* this.add_fingerprint(user);
		if (!rt.len(f, this.contents)) {
			to_chat(user, `<span class='warning'>There is nothing left inside ${this}!</span>`);
			return f.dot;
		}
		playsound(this.loc, rt.rsc("sound/weapons/slice.ogg"), 50, 1, -1);
		user.visible_message(`<span class='warning'>${user} begins to cut open ${this}.</span>`, `<span class='notice'>You begin to cut open ${this}...</span>`);
		if (yield* do_after(user, 54, { target: this })) {
			yield* this.drop_organs(user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// bodyparts.dm:91
rt.def("/obj/item/bodypart/proc/throw_impact", function throw_impact(f: Frame, hit_atom: Value) {
	parent_proc();
	if (this.status != BODYPART_ROBOTIC) {
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/misc/splort.ogg"), 50, 1, -1);
	}
	this.pixel_x = rand(-3, 3);
	this.pixel_y = rand(-3, 3);
	return f.dot;
}, false, { waitfor: false });

// bodyparts.dm:99
rt.def("/obj/item/bodypart/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	let I: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (this.status != BODYPART_ROBOTIC) {
		playsound(_T, rt.rsc("sound/misc/splort.ogg"), 50, 1, -1);
	}
	for (I of each(this, T("/obj/item"))) {
		yield* I.forceMove(_T);
	}
	return f.dot;
}, true);

// bodyparts.dm:109
rt.def("/obj/item/bodypart/proc/receive_damage", function* receive_damage(f: Frame, brute: Value, burn: Value, updating_health: Value) {
	let can_inflict: Value = null;
	updating_health ??= 1;
	if (this.owner && rt.bitAnd(this.owner.status_flags, 4096)) {
		return 0;
	}
	brute = max(brute * GLOB.config.damage_multiplier, 0);
	burn = max(burn * GLOB.config.damage_multiplier, 0);
	if (this.status == BODYPART_ROBOTIC) {
		brute = max(0, brute - 5);
		burn = max(0, burn - 4);
	}
	if (this.animal_origin === "alien" || this.animal_origin === "larva") {
		burn *= 2;
	}
	if (!(can_inflict = this.max_damage - (this.brute_dam + this.burn_dam))) {
		return 0;
	}
	if (brute + burn < can_inflict) {
		this.brute_dam += brute;
		this.burn_dam += burn;
	} else if (brute > 0) {
		if (burn > 0) {
			brute = round(brute / (brute + burn) * can_inflict, 1);
			burn = can_inflict - brute;
			this.brute_dam += brute;
			this.burn_dam += burn;
		} else {
			this.brute_dam += can_inflict;
		}
	} else if (burn > 0) {
		this.burn_dam += can_inflict;
	} else {
		return 0;
	}
	if (this.owner && updating_health) {
		yield* this.owner.updatehealth();
	}
	return this.update_bodypart_damage_state();
}, true);

// bodyparts.dm:154
rt.def("/obj/item/bodypart/proc/heal_damage", function* heal_damage(f: Frame, brute: Value, burn: Value, only_robotic: Value, only_organic: Value, updating_health: Value) {
	only_robotic ??= 0;
	only_organic ??= 1;
	updating_health ??= 1;
	if (only_robotic && this.status != BODYPART_ROBOTIC) {
		return f.dot;
	}
	if (only_organic && this.status != BODYPART_ORGANIC) {
		return f.dot;
	}
	this.brute_dam = max(this.brute_dam - brute, 0);
	this.burn_dam = max(this.burn_dam - burn, 0);
	if (this.owner && updating_health) {
		yield* this.owner.updatehealth();
	}
	return this.update_bodypart_damage_state();
}, true);

// bodyparts.dm:169
rt.def("/obj/item/bodypart/proc/get_damage", function get_damage(f: Frame) {
	return this.brute_dam + this.burn_dam;
});

// bodyparts.dm:175
rt.def("/obj/item/bodypart/proc/update_bodypart_damage_state", function update_bodypart_damage_state(f: Frame) {
	let tbrute: Value = round(this.brute_dam / this.max_damage * 3, 1);
	let tburn: Value = round(this.burn_dam / this.max_damage * 3, 1);
	if (tbrute != this.brutestate || tburn != this.burnstate) {
		this.brutestate = tbrute;
		this.burnstate = tburn;
		return 1;
	}
	return 0;
});

// bodyparts.dm:187
rt.def("/obj/item/bodypart/proc/change_bodypart_status", function* change_bodypart_status(f: Frame, new_limb_status: Value, heal_limb: Value, change_icon_to_default: Value) {
	this.status = new_limb_status;
	if (heal_limb) {
		this.burn_dam = 0;
		this.brute_dam = 0;
		this.brutestate = 0;
		this.burnstate = 0;
	}
	if (change_icon_to_default) {
		if (this.status == BODYPART_ORGANIC) {
			this.icon = rt.rsc("icons/mob/human_parts_greyscale.dmi");
		} else if (this.status == BODYPART_ROBOTIC) {
			this.icon = rt.rsc("icons/mob/augments.dmi");
		}
	}
	if (!this.owner) return f.dot;
	yield* this.owner.updatehealth();
	yield* this.owner.update_body();
	yield* this.owner.update_hair();
	this.owner.update_damage_overlays();
	return f.dot;
}, true);

// bodyparts.dm:210
rt.def("/obj/item/bodypart/proc/update_limb", function update_limb(f: Frame, dropping_limb: Value, source: Value) {
	let C: Value = null, H: Value = null, S: Value = null;
	if (source) {
		C = source;
		if (!this.original_owner) {
			this.original_owner = source;
		}
	} else if (this.original_owner && this.owner != this.original_owner) {
		this.no_update = 1;
	} else {
		C = this.owner;
		this.no_update = 0;
	}
	if (rt.bitAnd(C.disabilities, 64)) {
		this.species_id = "husk";
		this.dmg_overlay_type = "";
		this.should_draw_gender = 0;
		this.should_draw_greyscale = 0;
		this.no_update = 1;
	}
	if (this.no_update) {
		return f.dot;
	}
	if (!this.animal_origin) {
		H = C;
		this.should_draw_greyscale = 0;
		this.species_id = (S = H.dna.species).limbs_id;
		this.species_flags_list = H.dna.species.species_traits;
		if (S.use_skintones) {
			this.skin_tone = H.skin_tone;
			this.should_draw_greyscale = 1;
		} else {
			this.skin_tone = "";
		}
		this.body_gender = H.gender;
		this.should_draw_gender = S.sexes;
		if (rt.isIn(f, 1, S.species_traits)) {
			if (S.fixed_mut_color) {
				this.species_color = S.fixed_mut_color;
			} else {
				this.species_color = rt.index(H.dna.features, "mcolor");
			}
			this.should_draw_greyscale = 1;
		} else {
			this.species_color = "";
		}
		if (!dropping_limb && H.dna.check_mutation("Hulk")) {
			this.mutation_color = "00aa00";
		} else {
			this.mutation_color = "";
		}
		this.dmg_overlay_type = S.damage_overlay_type;
	} else if (this.animal_origin == "monkey") {
		this.dmg_overlay_type = this.animal_origin;
	}
	if (this.status == 2) {
		this.dmg_overlay_type = "robotic";
	}
	if (!dropping_limb) return f.dot;
	this.no_update = 1;
	return f.dot;
});

// bodyparts.dm:273
rt.def("/obj/item/bodypart/proc/update_icon_dropped", function update_icon_dropped(f: Frame) {
	let standing: Value = null, I: Value = null;
	this.cut_overlays();
	if (!rt.len(f, (standing = this.get_limb_icon(1)))) {
		this.icon_state = rt.initial(f, this, "icon_state");
		return f.dot;
	}
	for (I of each(standing, T("/image"))) {
		I.pixel_x = this.px_x;
		I.pixel_y = this.px_y;
	}
	this.add_overlay(standing);
	return f.dot;
});

// bodyparts.dm:285
rt.def("/obj/item/bodypart/proc/get_limb_icon", function get_limb_icon(f: Frame, dropped: Value) {
	let limb: Value = null, draw_color: Value = null;
	this.icon_state = "";
	f.dot = list();
	let image_dir: Value = 0;
	if (dropped) {
		image_dir = 2;
		if (this.dmg_overlay_type) {
			if (this.brutestate) {
				f.dot += image(rt.rsc("icons/mob/dam_mob.dmi"), `${this.dmg_overlay_type}_${this.body_zone}_${this.brutestate}0`, -20, image_dir);
			}
			if (this.burnstate) {
				f.dot += image(rt.rsc("icons/mob/dam_mob.dmi"), `${this.dmg_overlay_type}_${this.body_zone}_0${this.burnstate}`, -20, image_dir);
			}
		}
	}
	f.dot += (limb = image({ layer: -24, dir: image_dir }));
	if (this.animal_origin) {
		if (this.status == BODYPART_ORGANIC) {
			limb.icon = rt.rsc("icons/mob/animal_parts.dmi");
			if (this.species_id == "husk") {
				limb.icon_state = `${this.animal_origin}_husk_${this.body_zone}`;
			} else {
				limb.icon_state = `${this.animal_origin}_${this.body_zone}`;
			}
		} else {
			limb.icon = rt.rsc("icons/mob/augments.dmi");
			limb.icon_state = `${this.animal_origin}_${this.body_zone}`;
		}
		return f.dot;
	}
	let icon_gender: Value = this.body_gender == "female" ? "f" : "m";
	if (this.body_zone != "head" && this.body_zone != "chest") {
		this.should_draw_gender = 0;
	}
	if (this.status == BODYPART_ORGANIC) {
		if (this.should_draw_greyscale) {
			limb.icon = rt.rsc("icons/mob/human_parts_greyscale.dmi");
			if (this.should_draw_gender) {
				limb.icon_state = `${this.species_id}_${this.body_zone}_${icon_gender}`;
			} else if (this.use_digitigrade) {
				limb.icon_state = `digitigrade_${this.use_digitigrade}_${this.body_zone}`;
			} else {
				limb.icon_state = `${this.species_id}_${this.body_zone}`;
			}
		} else {
			limb.icon = rt.rsc("icons/mob/human_parts.dmi");
			if (this.should_draw_gender) {
				limb.icon_state = `${this.species_id}_${this.body_zone}_${icon_gender}`;
			} else {
				limb.icon_state = `${this.species_id}_${this.body_zone}`;
			}
		}
	} else {
		limb.icon = this.icon;
		if (this.should_draw_gender) {
			limb.icon_state = `${this.body_zone}_${icon_gender}`;
		} else {
			limb.icon_state = `${this.body_zone}`;
		}
		return f.dot;
	}
	if (!this.should_draw_greyscale) return f.dot;
	if (!(draw_color = ((this.mutation_color || this.species_color) || (this.skin_tone && skintone2hex(this.skin_tone))))) return f.dot;
	limb.color = `#${draw_color}`;
	return f.dot;
});

// bodyparts.dm:349
rt.def("/obj/item/bodypart/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* this.drop_organs();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10166, "/obj/item/bodypart/chest", "/obj/item/bodypart", {
	cavity_item: null,
	max_damage: 200,
	body_zone: "chest",
	body_part: 2,
	px_x: 0,
	px_y: 0,
	name: "chest",
	desc: "It's impolite to stare at a person's chest.",
	icon_state: "default_human_chest",
});

// bodyparts.dm:365
rt.def("/obj/item/bodypart/chest/proc/Destroy", function* Destroy(f: Frame) {
	if (this.cavity_item) {
		yield* qdel(this.cavity_item);
	}
	return (yield* parent_proc());
}, true);

// bodyparts.dm:370
rt.def("/obj/item/bodypart/chest/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	if (this.cavity_item) {
		yield* this.cavity_item.forceMove(user.loc);
		this.cavity_item = null;
	}
	yield* parent_proc();
	return f.dot;
}, true);
