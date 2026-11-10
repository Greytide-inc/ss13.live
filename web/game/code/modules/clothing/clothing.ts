// Based on /tg/station's code/modules/clothing/clothing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(7652, "/obj/item/clothing", "/obj/item", {
	damaged_clothes: 0,
	flash_protect: 0,
	tint: 0,
	up: 0,
	visor_flags: 0,
	visor_flags_inv: 0,
	visor_flags_cover: 0,
	visor_vars_to_toggle: 31,
	alt_desc: null,
	toggle_message: null,
	alt_toggle_message: null,
	active_sound: null,
	toggle_cooldown: null,
	cooldown: 0,
	F: null,
	can_flashlight: 0,
	gang: null,
	scan_reagents: 0,
	user_vars_to_edit: null,
	user_vars_remembered: null,
	pockets: null,
	dynamic_hair_suffix: "",
	dynamic_fhair_suffix: "",
	name: "clothing",
	resistance_flags: 4,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 80,
	lefthand_file: rt.rsc("icons/mob/inhands/clothing_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/clothing_righthand.dmi"),
});

// clothing.dm:30
rt.def("/obj/item/clothing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.user_vars_to_edit = list();

	this.user_vars_remembered = list();
	return f.dot;
});

// clothing.dm:43
rt.def("/obj/item/clothing/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!ispath(this.pockets)) return f.dot;
	this.pockets = (yield* new_(this.pockets, this));
	return f.dot;
}, true);

// clothing.dm:48
rt.def("/obj/item/clothing/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = f.usr;
	if (this.pockets && over_object == M) {
		return (yield* this.pockets.MouseDrop(over_object));
	}
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return f.dot;
	}
	if (!(!M.incapacitated() && this.loc == M && rt.istype(over_object, T("/obj/screen/inventory/hand")))) return f.dot;
	let H: Value = over_object;
	if (!(yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index))) return f.dot;
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// clothing.dm:63
rt.def("/obj/item/clothing/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	if (this.pockets) {
		this.pockets.close_all();
	}
	return (yield* parent_proc());
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// clothing.dm:67
rt.def("/obj/item/clothing/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.pockets && this.pockets.priority && ismob(this.loc)) {
		if (user.s_active == this.pockets) {
			yield* this.pockets.close(user);
		} else {
			if (user.s_active) {
				yield* user.s_active.close(user);
			}
			yield* this.pockets.orient2hud(user);
			yield* this.pockets.show_to(user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// clothing.dm:81
rt.def("/obj/item/clothing/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null, i: Value = null;
	if (this.damaged_clothes && rt.istype(W, T("/obj/item/stack/sheet/cloth"))) {
		yield* (C = W).use(1);
		yield* this.update_clothes_damaged_state(0);
		this.obj_integrity = this.max_integrity;
		to_chat(user, `<span class='notice'>You fix the damage on ${this} with ${C}.</span>`);
		return 1;
	}
	if (this.pockets) {
		if (i = (yield* this.pockets.attackby(W, user, params))) {
			return i;
		}
	}
	return (yield* parent_proc());
}, true);

// clothing.dm:95
rt.def("/obj/item/clothing/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let I: Value = null;
	if (this.pockets && this.pockets.quickdraw && rt.len(f, this.pockets.contents) && !user.incapacitated()) {
		if (!(I = rt.index(this.pockets.contents, 1))) {
			return f.dot;
		}
		yield* this.pockets.remove_from_storage(I, rt.getStep(f, this, 0));
		if (!(yield* user.put_in_hands(I))) {
			to_chat(user, `<span class='notice'>You fumble for ${I} and it falls on the floor.</span>`);
			return 1;
		}
		user.visible_message(`<span class='warning'>${user} draws ${I} from ${this}!</span>`, `<span class='notice'>You draw ${I} from ${this}.</span>`);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// clothing.dm:111
rt.def("/obj/item/clothing/proc/Destroy", function* Destroy(f: Frame) {
	if (rt.istype(this.loc, T("/mob/living"))) {
		yield* this.dropped(this.loc);
	}
	if (this.pockets) {
		yield* qdel(this.pockets);
		this.pockets = null;
	}
	this.user_vars_remembered = null;
	return (yield* parent_proc());
}, true);

// clothing.dm:121
rt.def("/obj/item/clothing/proc/dropped", function* dropped(f: Frame, user: Value) {
	let variable: Value = null;
	yield* parent_proc();
	if (!rt.istype(user, T("/mob"))) {
		return f.dot;
	}
	if (!(this.user_vars_remembered && rt.len(f, this.user_vars_remembered))) return f.dot;
	for (variable of each(this.user_vars_remembered)) {
		if (rt.isIn(f, variable, user.vars)) {
			if (rt.index(user.vars, variable) == rt.index(this.user_vars_to_edit, variable)) {
				rt.setAt(user.vars, variable, rt.index(this.user_vars_remembered, variable));
			}
		}
	}
	this.user_vars_remembered = list();
	return f.dot;
}, true);

// clothing.dm:133
rt.def("/obj/item/clothing/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let variable: Value = null;
	yield* parent_proc();
	if (!rt.bitAnd(this.slot_flags, slotdefine2slotbit(slot))) return f.dot;
	for (variable of each(this.user_vars_to_edit)) {
		if (rt.isIn(f, variable, user.vars)) {
			rt.setAt(this.user_vars_remembered, variable, rt.index(user.vars, variable));
			rt.setAt(user.vars, variable, rt.index(this.user_vars_to_edit, variable));
		}
	}
	return f.dot;
}, true);

// clothing.dm:143
rt.def("/obj/item/clothing/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.damaged_clothes) {
		to_chat(user, "<span class='warning'>It looks damaged!</span>");
	}
	if (!this.pockets) return f.dot;
	let how_cool_are_your_threads: Value = list("<span class='notice'>");
	if (this.pockets.priority) {
		how_cool_are_your_threads += `Your ${this}'s storage opens when clicked.\n`;
	} else {
		how_cool_are_your_threads += `Your ${this}'s storage opens when dragged to yourself.\n`;
	}
	let $0: any = this;
	let $1: any = this.pockets.storage_slots;
	how_cool_are_your_threads += `Your ${$0} can store ${$1} item${this.pockets.storage_slots > 1 ? "s" : ""}.\n`;
	how_cool_are_your_threads += `Your ${this} can store items that are ${weightclass2text(this.pockets.max_w_class)} or smaller.\n`;
	if (this.pockets.quickdraw) {
		how_cool_are_your_threads += `You can quickly remove an item from your ${this} using Alt-Click.\n`;
	}
	if (this.pockets.silent) {
		how_cool_are_your_threads += `Adding or Removing items from your ${this} makes no noise.\n`;
	}
	how_cool_are_your_threads += "</span>";
	to_chat(user, how_cool_are_your_threads.Join());
	return f.dot;
}, false);

// clothing.dm:162
rt.def("/obj/item/clothing/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	let M: Value = null;
	if (!this.damaged_clothes) {
		yield* this.update_clothes_damaged_state(1);
	}
	if (!ismob(this.loc)) return f.dot;
	(M = this.loc).visible_message(`<span class='warning'>${M}'s ${this.name} starts to fall apart!`, `<span class='warning'>Your ${this.name} starts to fall apart!`);
	return f.dot;
}, true);

// clothing.dm:169
rt.def("/obj/item/clothing/proc/update_clothes_damaged_state", function update_clothes_damaged_state(f: Frame, damaging: Value) {
	let damaged_clothes_icon: Value = null;
	damaging ??= 1;
	let index: Value = fmt("＃-＀", [rt.initial(f, this, "icon"), rt.initial(f, this, "icon_state")]);
	if (damaging) {
		this.damaged_clothes = 1;
		if (!(damaged_clothes_icon = rt.index(GLOB.damaged_clothes_icons, index))) {
			(damaged_clothes_icon = icon(rt.initial(f, this, "icon"), rt.initial(f, this, "icon_state"), null, 1)).Blend("#fff", 0);
			damaged_clothes_icon.Blend(icon(rt.rsc("icons/effects/item_damage.dmi"), "itemdamaged"), 2);
			damaged_clothes_icon = fcopy_rsc(damaged_clothes_icon);
			rt.setAt(GLOB.damaged_clothes_icons, index, damaged_clothes_icon);
		}
		this.add_overlay(damaged_clothes_icon, 1);
	} else {
		this.damaged_clothes = 0;
		this.cut_overlay(rt.index(GLOB.damaged_clothes_icons, index), 1);
	}
	return f.dot;
});

rt.type(8593, "/obj/item/clothing/ears/earmuffs", "/obj/item/clothing/ears", {
	name: "earmuffs",
	desc: "Protects your hearing from loud noises, and quiet ones as well.",
	icon_state: "earmuffs",
	item_state: "earmuffs",
	strip_delay: 15,
	equip_delay_other: 25,
	resistance_flags: 4,
});

// clothing.dm:204
rt.def("/obj/item/clothing/ears/earmuffs/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "heals_ears", 1);
	return f.dot;
}, true);

rt.type(8204, "/obj/item/clothing/glasses", "/obj/item/clothing", {
	vision_flags: 0,
	darkness_view: 2,
	invis_view: 25,
	invis_override: 0,
	lighting_alpha: null,
	emagged: 0,
	current: null,
	vision_correction: 0,
	glass_colour_type: null,
	name: "glasses",
	icon: rt.rsc("icons/obj/clothing/glasses.dmi"),
	w_class: 2,
	flags_cover: 1,
	slot_flags: 8,
	strip_delay: 20,
	equip_delay_other: 25,
	resistance_flags: 0,
	materials: null,
});

// clothing.dm:221
rt.def("/obj/item/clothing/glasses/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.current = list();
	this.materials = rt.alist(f, ["$glass", 250]);
	return f.dot;
});

rt.type(7653, "/obj/item/clothing/gloves", "/obj/item/clothing", {
	transfer_prints: 0,
	transfer_blood: 0,
	name: "gloves",
	gender: "plural",
	w_class: 2,
	icon: rt.rsc("icons/obj/clothing/gloves.dmi"),
	siemens_coefficient: 0.5,
	body_parts_covered: 1536,
	slot_flags: 4,
	attack_verb: null,
	strip_delay: 20,
	equip_delay_other: 40,
});

// clothing.dm:246
rt.def("/obj/item/clothing/gloves/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("challenged");
	return f.dot;
});

// clothing.dm:253
rt.def("/obj/item/clothing/gloves/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), "damagedgloves");
	}
	if (!this.blood_DNA) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "bloodyhands");
	return f.dot;
});

// clothing.dm:261
rt.def("/obj/item/clothing/gloves/proc/update_clothes_damaged_state", function update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	parent_proc();
	if (!ismob(this.loc)) return f.dot;
	(M = this.loc).update_inv_gloves();
	return f.dot;
}, false, { args: ["damaging"] });

rt.type(7931, "/obj/item/clothing/head", "/obj/item/clothing", {
	blockTracking: 0,
	can_toggle: null,
	name: "head",
	icon: rt.rsc("icons/obj/clothing/hats.dmi"),
	icon_state: "top_hat",
	item_state: "that",
	body_parts_covered: 1,
	slot_flags: 64,
});

// clothing.dm:282
rt.def("/obj/item/clothing/head/proc/Initialize", function* Initialize(f: Frame) {
	let H: Value = null;
	f.dot = (yield* parent_proc());
	if (!(rt.istype(this.loc, T("/mob/living/carbon/human")) && this.dynamic_hair_suffix)) return f.dot;
	yield* (H = this.loc).update_hair();
	return f.dot;
}, true);

// clothing.dm:288
rt.def("/obj/item/clothing/head/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), "damagedhelmet");
	}
	if (!this.blood_DNA) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "helmetblood");
	return f.dot;
});

// clothing.dm:296
rt.def("/obj/item/clothing/head/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	yield* parent_proc();
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).update_inv_head();
	return f.dot;
}, true, { args: ["damaging"] });

// clothing.dm:302
rt.def("/obj/item/clothing/head/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (!this.dynamic_hair_suffix) return f.dot;
	yield* user.update_hair();
	return f.dot;
}, true);

// clothing.dm:307
rt.def("/obj/item/clothing/head/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	if (!this.dynamic_hair_suffix) return f.dot;
	yield* user.update_hair();
	return f.dot;
}, true);

rt.type(8594, "/obj/item/clothing/neck", "/obj/item/clothing", {
	name: "necklace",
	icon: rt.rsc("icons/obj/clothing/neck.dmi"),
	body_parts_covered: 2048,
	slot_flags: 8192,
	strip_delay: 40,
	equip_delay_other: 40,
});

// clothing.dm:322
rt.def("/obj/item/clothing/neck/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	if (!rt.bitAnd(this.body_parts_covered, HEAD)) return f.dot;
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), "damagedmask");
	}
	if (!this.blood_DNA) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "maskblood");
	return f.dot;
});

rt.type(8515, "/obj/item/clothing/mask", "/obj/item/clothing", {
	mask_adjusted: 0,
	adjusted_flags: null,
	name: "mask",
	icon: rt.rsc("icons/obj/clothing/masks.dmi"),
	body_parts_covered: 1,
	slot_flags: 32,
	strip_delay: 40,
	equip_delay_other: 40,
});

// clothing.dm:344
rt.def("/obj/item/clothing/mask/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	if (!rt.bitAnd(this.body_parts_covered, HEAD)) return f.dot;
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), "damagedmask");
	}
	if (!this.blood_DNA) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "maskblood");
	return f.dot;
});

// clothing.dm:353
rt.def("/obj/item/clothing/mask/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	yield* parent_proc();
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).update_inv_wear_mask();
	return f.dot;
}, true, { args: ["damaging"] });

// clothing.dm:365
rt.def("/obj/item/clothing/mask/proc/adjustmask", function* adjustmask(f: Frame, user: Value) {
	if (user && user.incapacitated()) {
		return f.dot;
	}
	this.mask_adjusted = (!this.mask_adjusted ? 1 : 0);
	if (!this.mask_adjusted) {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.gas_transfer_coefficient = rt.initial(f, this, "gas_transfer_coefficient");
		this.permeability_coefficient = rt.initial(f, this, "permeability_coefficient");
		(rt.modSrcVar(f, "flags", this.visor_flags, rt.bitOr));
		(rt.modSrcVar(f, "flags_inv", this.visor_flags_inv, rt.bitOr));
		(rt.modSrcVar(f, "flags_cover", this.visor_flags_cover, rt.bitOr));
		to_chat(user, fmt("<span class='notice'>You push ％！ back into place.</span>", [this]));
		this.slot_flags = rt.initial(f, this, "slot_flags");
	} else {
		this.icon_state += "_up";
		to_chat(user, fmt("<span class='notice'>You push ％！ out of the way.</span>", [this]));
		this.gas_transfer_coefficient = null;
		this.permeability_coefficient = null;
		(rt.modSrcVar(f, "flags", rt.op(f, "BitNot", [], [this.visor_flags]), rt.bitAnd));
		(rt.modSrcVar(f, "flags_inv", rt.op(f, "BitNot", [], [this.visor_flags_inv]), rt.bitAnd));
		(rt.modSrcVar(f, "flags_cover", rt.op(f, "BitNot", [], [this.visor_flags_cover]), rt.bitAnd));
		if (this.adjusted_flags) {
			this.slot_flags = this.adjusted_flags;
		}
	}
	if (!user) return f.dot;
	yield* user.wear_mask_update(this, { toggle_off: this.mask_adjusted });
	yield* user.update_action_buttons_icon();
	return f.dot;
}, true);

rt.type(8456, "/obj/item/clothing/shoes", "/obj/item/clothing", {
	chained: 0,
	blood_state: "no blood whatsoever",
	bloody_shoes: null,
	offset: 0,
	equipped_before_drop: 0,
	name: "shoes",
	icon: rt.rsc("icons/obj/clothing/shoes.dmi"),
	desc: "Comfortable-looking shoes.",
	gender: "plural",
	body_parts_covered: 96,
	slot_flags: 128,
	permeability_coefficient: 0.5,
	slowdown: 0,
});

// Empty in tg.
rt.def("/obj/item/clothing/shoes/proc/step_action");

// clothing.dm:408
rt.def("/obj/item/clothing/shoes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bloody_shoes = rt.alist(f, ["blood", 0, "xeno", 0, "oil", 0, "no blood whatsoever", 0]);
	return f.dot;
});

// clothing.dm:413
rt.def("/obj/item/clothing/shoes/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	let bloody: Value = 0;
	if (this.blood_DNA) {
		bloody = 1;
	} else {
		bloody = rt.at(this.bloody_shoes, "blood");
	}
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), "damagedshoe");
	}
	if (!bloody) return f.dot;
	f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "shoeblood");
	return f.dot;
});

// clothing.dm:427
rt.def("/obj/item/clothing/shoes/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	f.dot = (yield* parent_proc());
	if (!(this.offset && rt.bitAnd(this.slot_flags, slotdefine2slotbit(slot)))) return f.dot;
	user.pixel_y += this.offset;
	this.worn_y_dimension -= this.offset * 2;
	user.update_inv_shoes();
	this.equipped_before_drop = 1;
	return f.dot;
}, true);

// clothing.dm:436
rt.def("/obj/item/clothing/shoes/proc/restore_offsets", function restore_offsets(f: Frame, user: Value) {
	this.equipped_before_drop = 0;
	user.pixel_y -= this.offset;
	this.worn_y_dimension = rt.world().icon_size;
	return f.dot;
});

// clothing.dm:440
rt.def("/obj/item/clothing/shoes/proc/dropped", function* dropped(f: Frame, user: Value) {
	if (this.offset && this.equipped_before_drop) {
		this.restore_offsets(user);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// clothing.dm:445
rt.def("/obj/item/clothing/shoes/proc/update_clothes_damaged_state", function update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	parent_proc();
	if (!ismob(this.loc)) return f.dot;
	(M = this.loc).update_inv_shoes();
	return f.dot;
}, false, { args: ["damaging"] });

// clothing.dm:451
rt.def("/obj/item/clothing/shoes/proc/clean_blood", function clean_blood(f: Frame) {
	let M: Value = null;
	parent_proc();
	this.bloody_shoes = rt.alist(f, ["blood", 0, "xeno", 0, "oil", 0, "no blood whatsoever", 0]);
	this.blood_state = "no blood whatsoever";
	if (!ismob(this.loc)) return f.dot;
	(M = this.loc).update_inv_shoes();
	return f.dot;
});

rt.type(7699, "/obj/item/clothing/suit", "/obj/item/clothing", {
	fire_resist: 373.15,
	blood_overlay_type: "suit",
	togglename: null,
	icon: rt.rsc("icons/obj/clothing/suits.dmi"),
	name: "suit",
	allowed: null,
	armor: null,
	slot_flags: 1,
});

// clothing.dm:466
rt.def("/obj/item/clothing/suit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tank/internals/emergency_oxygen"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// clothing.dm:474
rt.def("/obj/item/clothing/suit/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	let M: Value = null, U: Value = null, A: Value = null;
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), `damaged${this.blood_overlay_type}`);
	}
	if (this.blood_DNA) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), `${this.blood_overlay_type}blood`);
	}
	if (!(rt.istype((M = this.loc), T("/mob/living/carbon/human")) && M.w_uniform)) return f.dot;
	if (!(rt.istype((U = M.w_uniform), T("/obj/item/clothing/under")) && U.attached_accessory)) return f.dot;
	if (!(A = U.attached_accessory).above_suit) return f.dot;
	f.dot += U.accessory_overlay;
	return f.dot;
});

// clothing.dm:489
rt.def("/obj/item/clothing/suit/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	yield* parent_proc();
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).update_inv_wear_suit();
	return f.dot;
}, true, { args: ["damaging"] });

rt.type(7933, "/obj/item/clothing/head/helmet/space", "/obj/item/clothing/head/helmet", {
	flags: 8193,
	name: "space helmet",
	icon_state: "spaceold",
	desc: "A special helmet with solar UV shielding to protect your eyes from harmful rays.",
	item_state: "spaceold",
	permeability_coefficient: 0.01,
	armor: null,
	flags_inv: 1008,
	cold_protection: 1,
	min_cold_protection_temperature: 2,
	heat_protection: 1,
	max_heat_protection_temperature: 1500,
	flash_protect: 2,
	strip_delay: 50,
	equip_delay_other: 50,
	flags_cover: 20,
	resistance_flags: 0,
});

// clothing.dm:504
rt.def("/obj/item/clothing/head/helmet/space/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 50, "fire", 80, "acid", 70]);
	return f.dot;
});

rt.type(7700, "/obj/item/clothing/suit/space", "/obj/item/clothing/suit", {
	flags: 8193,
	name: "space suit",
	desc: "A suit that protects against low pressure environments. Has a big 13 on the back.",
	icon_state: "spaceold",
	item_state: "s_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.02,
	body_parts_covered: 2046,
	allowed: null,
	slowdown: 1,
	armor: null,
	flags_inv: 13,
	cold_protection: 2046,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	strip_delay: 80,
	equip_delay_other: 80,
	resistance_flags: 0,
});

// clothing.dm:526
rt.def("/obj/item/clothing/suit/space/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 50, "fire", 80, "acid", 70]);
	return f.dot;
});

rt.type(8259, "/obj/item/clothing/under", "/obj/item/clothing", {
	fitted: 1,
	has_sensor: 1,
	random_sensor: 1,
	sensor_mode: 0,
	can_adjust: 1,
	adjusted: 0,
	alt_covers_chest: 0,
	attached_accessory: null,
	accessory_overlay: null,
	mutantrace_variation: 0,
	icon: rt.rsc("icons/obj/clothing/uniforms.dmi"),
	name: "under",
	body_parts_covered: 414,
	permeability_coefficient: 0.9,
	slot_flags: 2,
	armor: null,
});

// clothing.dm:546
rt.def("/obj/item/clothing/under/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// clothing.dm:559
rt.def("/obj/item/clothing/under/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	isinhands ??= 0;
	f.dot = list();
	if (isinhands) return f.dot;
	if (this.damaged_clothes) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/item_damage.dmi"), "damageduniform");
	}
	if (this.blood_DNA) {
		f.dot += mutable_appearance(rt.rsc("icons/effects/blood.dmi"), "uniformblood");
	}
	if (!this.accessory_overlay) return f.dot;
	f.dot += this.accessory_overlay;
	return f.dot;
});

// clothing.dm:570
rt.def("/obj/item/clothing/under/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	if (!(this.has_sensor == BROKEN_SENSORS && rt.istype(W, T("/obj/item/stack/cable_coil")))) return f.dot;
	yield* (C = W).use(1);
	this.has_sensor = HAS_SENSORS;
	to_chat(user, `<span class='notice'>You repair the suit sensors on ${this} with ${C}.</span>`);
	return 1;
}, true);

// clothing.dm:578
rt.def("/obj/item/clothing/under/proc/update_clothes_damaged_state", function* update_clothes_damaged_state(f: Frame) {
	let M: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	yield* parent_proc();
	if (ismob(this.loc)) {
		yield* (M = this.loc).update_inv_w_uniform();
	}
	if (!(this.has_sensor > NO_SENSORS)) return f.dot;
	this.has_sensor = BROKEN_SENSORS;
	return f.dot;
}, true, { args: ["damaging"] });

// clothing.dm:588
rt.def("/obj/item/clothing/under/proc/New", function* New(f: Frame) {
	if (this.random_sensor) {
		this.sensor_mode = pick(SENSOR_OFF, SENSOR_LIVING, SENSOR_LIVING, SENSOR_VITALS, SENSOR_VITALS, SENSOR_VITALS, SENSOR_COORDS, SENSOR_COORDS);
	}
	this.adjusted = SENSOR_OFF;
	yield* parent_proc();
	return f.dot;
}, true);

// clothing.dm:593
rt.def("/obj/item/clothing/under/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	yield* parent_proc();
	if (this.adjusted) {
		this.adjusted = NORMAL_STYLE;
		this.fitted = rt.initial(f, this, "fitted");
		if (!this.alt_covers_chest) {
			(rt.modSrcVar(f, "body_parts_covered", CHEST, rt.bitOr));
		}
	}
	if (this.mutantrace_variation && rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		if (rt.isIn(f, DIGITIGRADE, H.dna.species.species_traits)) {
			this.adjusted = DIGITIGRADE_STYLE;
		}
		yield* H.update_inv_w_uniform();
	}
	if (!(this.attached_accessory && slot != slot_hands && rt.istype(user, T("/mob/living/carbon/human")))) return f.dot;
	H = user;
	this.attached_accessory.on_uniform_equip(this, user);
	if (!this.attached_accessory.above_suit) return f.dot;
	yield* H.update_inv_wear_suit();
	return f.dot;
}, true);

// clothing.dm:614
rt.def("/obj/item/clothing/under/proc/dropped", function* dropped(f: Frame, user: Value) {
	let H: Value = null;
	if (this.attached_accessory) {
		this.attached_accessory.on_uniform_dropped(this, user);
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			H = user;
			if (this.attached_accessory.above_suit) {
				yield* H.update_inv_wear_suit();
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// clothing.dm:623
rt.def("/obj/item/clothing/under/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (yield* this.attach_accessory(I, user)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// clothing.dm:628
rt.def("/obj/item/clothing/under/proc/attach_accessory", function* attach_accessory(f: Frame, I: Value, user: Value, notifyAttach: Value) {
	let accessory_color: Value = null, H: Value = null;
	notifyAttach ??= 1;
	f.dot = 0;
	if (!rt.istype(I, T("/obj/item/clothing/accessory"))) return f.dot;
	let A: Value = I;
	if (this.attached_accessory) {
		if (user) {
			to_chat(user, `<span class='warning'>${this} already has an accessory.</span>`);
		}
		return f.dot;
	} else {
		if (user && !(yield* user.drop_item())) {
			return f.dot;
		}
		if (!(yield* A.attach(this, user))) {
			return f.dot;
		}
		if (user && notifyAttach) {
			to_chat(user, `<span class='notice'>You attach ${I} to ${this}.</span>`);
		}
		if (!(accessory_color = this.attached_accessory.item_color)) {
			accessory_color = this.attached_accessory.icon_state;
		}
		this.accessory_overlay = mutable_appearance(rt.rsc("icons/mob/accessories.dmi"), `${accessory_color}`);
		this.accessory_overlay.alpha = this.attached_accessory.alpha;
		this.accessory_overlay.color = this.attached_accessory.color;
		if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
			yield* (H = this.loc).update_inv_w_uniform();
			yield* H.update_inv_wear_suit();
		}
		return 1;
	}
}, true);

// clothing.dm:658
rt.def("/obj/item/clothing/under/proc/remove_accessory", function* remove_accessory(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	if (!this.can_use(user)) {
		return f.dot;
	}
	if (!this.attached_accessory) return f.dot;
	let A: Value = this.attached_accessory;
	yield* this.attached_accessory.detach(this, user);
	if (yield* user.put_in_hands(A)) {
		to_chat(user, `<span class='notice'>You detach ${A} from ${this}.</span>`);
	} else {
		to_chat(user, `<span class='notice'>You detach ${A} from ${this} and it falls on the floor.</span>`);
	}
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = this.loc).update_inv_w_uniform();
	yield* H.update_inv_wear_suit();
	return f.dot;
}, true);

// clothing.dm:678
rt.def("/obj/item/clothing/under/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.can_adjust) {
		if (this.adjusted == ALT_STYLE) {
			to_chat(user, `Alt-click on ${this} to wear it normally.`);
		} else {
			to_chat(user, `Alt-click on ${this} to wear it casually.`);
		}
	}
	if (this.has_sensor == BROKEN_SENSORS) {
		to_chat(user, "Its sensors appear to be shorted out.");
	} else if (this.has_sensor > NO_SENSORS) {
		if (this.sensor_mode === SENSOR_OFF) {
			to_chat(user, "Its sensors appear to be disabled.");
		} else if (this.sensor_mode === SENSOR_LIVING) {
			to_chat(user, "Its binary life sensors appear to be enabled.");
		} else if (this.sensor_mode === SENSOR_VITALS) {
			to_chat(user, "Its vital tracker appears to be enabled.");
		} else if (this.sensor_mode === SENSOR_COORDS) {
			to_chat(user, "Its vital tracker and tracking beacon appear to be enabled.");
		}
	}
	if (!this.attached_accessory) return f.dot;
	to_chat(user, fmt("＆！ is attached to it.", [this.attached_accessory]));
	return f.dot;
}, false);

// clothing.dm:700
rt.def("/proc/generate_female_clothing", function generate_female_clothing(f: Frame, index: Value, t_color: Value, icon: Value, type: Value) {
	let $3: any;
	let female_clothing_icon: Value = rt.call(f, P("/proc/icon"), null, ["icon", icon, "icon_state", t_color], rt.Args.Named);
	let $0: any = "icon";
	let $1: any = rt.rsc("icons/mob/uniform.dmi");
	let $2: any = "icon_state";
	if (type == FEMALE_UNIFORM_FULL) {
		$3 = "female_full";
	} else {
		$3 = "female_top";
	}
	let female_s: Value = rt.call(f, P("/proc/icon"), null, [$0, $1, $2, `${$3}`], rt.Args.Named);
	female_clothing_icon.Blend(female_s, 2);
	female_clothing_icon = fcopy_rsc(female_clothing_icon);
	rt.setAt(GLOB.female_clothing_icons, index, female_clothing_icon);
	return f.dot;
});

// clothing.dm:710
rt.def("/obj/item/clothing/under/verb/toggle", function* toggle(f: Frame) {
	let M: Value = null, H: Value = null;
	if (rt.istype((M = f.usr), T("/mob/dead"))) {
		return f.dot;
	}
	if (!this.can_use(M)) {
		return f.dot;
	}
	if (this.has_sensor == LOCKED_SENSORS) {
		to_chat(f.usr, "The controls are locked.");
		return 0;
	}
	if (this.has_sensor == BROKEN_SENSORS) {
		to_chat(f.usr, "The sensors have shorted out!");
		return 0;
	}
	if (this.has_sensor <= 0) {
		to_chat(f.usr, "This suit does not have any sensors.");
		return 0;
	}
	let modes: Value = list("Off", "Binary vitals", "Exact vitals", "Tracking beacon");
	let switchMode: Value = (yield* g.op(f, "Prompt", [0], [null, rt.index(modes, this.sensor_mode + 1), "Suit Sensor Mode", "Select a sensor mode:", modes]));
	if (get_dist(f.usr, this) > 1) {
		to_chat(f.usr, "<span class='warning'>You have moved too far away!</span>");
		return f.dot;
	}
	this.sensor_mode = modes.Find(switchMode) - 1;
	if (this.loc == f.usr) {
		if (this.sensor_mode === 0) {
			to_chat(f.usr, "<span class='notice'>You disable your suit's remote sensing equipment.</span>");
		} else if (this.sensor_mode === 1) {
			to_chat(f.usr, "<span class='notice'>Your suit will now only report whether you are alive or dead.</span>");
		} else if (this.sensor_mode === 2) {
			to_chat(f.usr, "<span class='notice'>Your suit will now only report your exact vital lifesigns.</span>");
		} else if (this.sensor_mode === 3) {
			to_chat(f.usr, "<span class='notice'>Your suit will now report your exact vital lifesigns as well as your coordinate position.</span>");
		}
	}
	if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		if ((H = this.loc).w_uniform == this) {
			yield* H.update_suit_sensors();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { verb: { name: "Adjust Suit Sensors", category: "Object", src: 11 } });

// clothing.dm:751
rt.def("/obj/item/clothing/under/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	if (!(yield* user.canUseTopic(this, { be_close: 1 }))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	} else if (this.attached_accessory) {
		yield* this.remove_accessory(user);
	} else {
		yield* this.rolldown();
	}
	return f.dot;
}, true);

// clothing.dm:767
rt.def("/obj/item/clothing/under/verb/jumpsuit_adjust", function* jumpsuit_adjust(f: Frame) {
	yield* this.rolldown();
	return f.dot;
}, true, { verb: { name: "Adjust Jumpsuit Style", category: "", src: 11 } });

// clothing.dm:770
rt.def("/obj/item/clothing/under/proc/rolldown", function* rolldown(f: Frame) {
	let H: Value = null;
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (!this.can_adjust) {
		to_chat(f.usr, "<span class='warning'>You cannot wear this suit any differently!</span>");
		return f.dot;
	}
	if (this.toggle_jumpsuit_adjust()) {
		to_chat(f.usr, "<span class='notice'>You adjust the suit to wear it more casually.</span>");
	} else {
		to_chat(f.usr, "<span class='notice'>You adjust the suit back to normal.</span>");
	}
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) return f.dot;
	yield* (H = f.usr).update_inv_w_uniform();
	yield* H.update_body();
	return f.dot;
}, true);

// clothing.dm:785
rt.def("/obj/item/clothing/under/proc/toggle_jumpsuit_adjust", function toggle_jumpsuit_adjust(f: Frame) {
	if (this.adjusted == 2) {
		return f.dot;
	}
	this.adjusted = (!this.adjusted ? 1 : NO_FEMALE_UNIFORM);
	if (this.adjusted) {
		if (this.fitted != CHEST) {
			this.fitted = NO_FEMALE_UNIFORM;
		}
		if (!this.alt_covers_chest) {
			(rt.modSrcVar(f, "body_parts_covered", 16777213, rt.bitAnd));
		}
	} else {
		this.fitted = rt.initial(f, this, "fitted");
		if (!this.alt_covers_chest) {
			(rt.modSrcVar(f, "body_parts_covered", CHEST, rt.bitOr));
		}
	}
	return this.adjusted;
});

// clothing.dm:800
rt.def("/obj/item/clothing/proc/weldingvisortoggle", function* weldingvisortoggle(f: Frame, user: Value) {
	let C: Value = null, X: Value = null, A: Value = null;
	let $2: any, $e: any;
	if (!this.can_use(user)) {
		return 0;
	}
	yield* this.visor_toggling();
	let $0: any = user;
	let $1: any = this;
	if (this.up) {

		$2 = "up";
	} else {
		$2 = "down";
	}
	to_chat($0, fmt("<span class='notice'>You adjust ％！ ＀.</span>", [$1, $2]));
	if (rt.istype(user, T("/mob/living/carbon"))) {
		yield* (C = user).head_update(this, { forced: 1 });
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return 1;
}, true);

// clothing.dm:816
rt.def("/obj/item/clothing/proc/visor_toggling", function visor_toggling(f: Frame) {
	this.up = (!this.up ? 1 : 0);
	(rt.modSrcVar(f, "flags", this.visor_flags, rt.bitXor));
	(rt.modSrcVar(f, "flags_inv", this.visor_flags_inv, rt.bitXor));
	(rt.modSrcVar(f, "flags_cover", rt.initial(f, this, "flags_cover"), rt.bitXor));
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.up ? "up" : ""}`;
	if (rt.bitAnd(this.visor_vars_to_toggle, 1)) {
		(rt.modSrcVar(f, "flash_protect", rt.initial(f, this, "flash_protect"), rt.bitXor));
	}
	if (!rt.bitAnd(this.visor_vars_to_toggle, 2)) return f.dot;
	(rt.modSrcVar(f, "tint", rt.initial(f, this, "tint"), rt.bitXor));
	return f.dot;
});

// clothing.dm:828
rt.def("/obj/item/clothing/proc/can_use", function can_use(f: Frame, user: Value) {
	if (user && ismob(user)) {
		if (!user.incapacitated()) {
			return 1;
		}
	}
	return 0;
});

// clothing.dm:835
rt.def("/obj/item/clothing/proc/obj_destruction", function* obj_destruction(f: Frame, damage_flag: Value) {
	let _T: Value = null, Shreds: Value = null;
	if (damage_flag == "bomb" || damage_flag == "melee") {
		_T = rt.getStep(f, this, 0);
		rt.spawnTail(f, 1, "/obj/item/clothing/proc/obj_destruction: spawn at modules/clothing/clothing.dm:837", _T, Shreds);
		yield* this.deconstruct(0);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// a spawn(1) body of /obj/item/clothing/proc/obj_destruction, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/proc/obj_destruction: spawn at modules/clothing/clothing.dm:837", function* (f: Frame, _T: Value, Shreds: Value) {
	(Shreds = (yield* new_(T("/obj/effect/decal/cleanable/shreds"), _T))).desc = `The sad remains of what used to be ${this.name}.`;
	return null;
});
