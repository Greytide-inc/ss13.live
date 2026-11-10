// Based on /tg/station's code/modules/clothing/glasses/glasses.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// glasses.dm:7
rt.def("/obj/item/clothing/glasses/proc/visor_toggling", function visor_toggling(f: Frame) {
	parent_proc();
	if (rt.bitAnd(this.visor_vars_to_toggle, VISOR_VISIONFLAGS)) {
		(rt.modSrcVar(f, "vision_flags", rt.initial(f, this, "vision_flags"), rt.bitXor));
	}
	if (rt.bitAnd(this.visor_vars_to_toggle, 8)) {
		(rt.modSrcVar(f, "darkness_view", rt.initial(f, this, "darkness_view"), rt.bitXor));
	}
	if (!rt.bitAnd(this.visor_vars_to_toggle, 16)) return f.dot;
	(rt.modSrcVar(f, "invis_view", rt.initial(f, this, "invis_view"), rt.bitXor));
	return f.dot;
});

// glasses.dm:16
rt.def("/obj/item/clothing/glasses/proc/weldingvisortoggle", function* weldingvisortoggle(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && user)) return f.dot;
	yield* user.update_sight();
	return f.dot;
}, true);

// glasses.dm:22
rt.def("/obj/item/clothing/glasses/proc/thermal_overload", function* thermal_overload(f: Frame) {
	let H: Value = null;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	if (rt.bitAnd((H = this.loc).disabilities, 1)) return f.dot;
	if (H.glasses != this) return f.dot;
	to_chat(H, `<span class='danger'>The ${this} overloads and blinds you!</span>`);
	yield* H.flash_act({ visual: 1 });
	yield* H.blind_eyes(3);
	yield* H.blur_eyes(5);
	yield* H.adjust_eye_damage(5);
	return f.dot;
}, true);

rt.type(8215, "/obj/item/clothing/glasses/meson/gar", "/obj/item/clothing/glasses/meson", {
	throw_speed: 4,
	name: "gar mesons",
	icon_state: "garm",
	item_state: "garm",
	desc: "Do the impossible, see the invisible!",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// glasses.dm:61
rt.def("/obj/item/clothing/glasses/meson/gar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("sliced");
	return f.dot;
});

rt.type(8217, "/obj/item/clothing/glasses/science", "/obj/item/clothing/glasses", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/purple"),
	name: "science goggles",
	desc: "A pair of snazzy goggles used to protect against chemical spills. Fitted with an analyzer for scanning items and reagents.",
	icon_state: "purple",
	item_state: "glasses",
	origin_tech: "magnets=2;engineering=1",
	scan_reagents: 1,
	actions_types: null,
	resistance_flags: 32,
	armor: null,
});

// glasses.dm:72
rt.def("/obj/item/clothing/glasses/science/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_research_scanner"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 100]);
	return f.dot;
});

// glasses.dm:78
rt.def("/obj/item/clothing/glasses/science/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value) {
	if (slot != slot_glasses) return f.dot;
	return 1;
});

rt.type(8222, "/obj/item/clothing/glasses/material/mining/gar", "/obj/item/clothing/glasses/material/mining", {
	throw_speed: 4,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/lightgreen"),
	name: "gar material scanner",
	icon_state: "garm",
	item_state: "garm",
	desc: "Do the impossible, see the invisible!",
	force: 10,
	throwforce: 20,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// glasses.dm:128
rt.def("/obj/item/clothing/glasses/material/mining/gar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("sliced");
	return f.dot;
});

rt.type(8228, "/obj/item/clothing/glasses/sunglasses/garb", "/obj/item/clothing/glasses/sunglasses", {
	throw_speed: 4,
	name: "black gar glasses",
	desc: "Go beyond impossible and kick reason to the curb!",
	icon_state: "garb",
	item_state: "garb",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// glasses.dm:179
rt.def("/obj/item/clothing/glasses/sunglasses/garb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("sliced");
	return f.dot;
});

rt.type(8230, "/obj/item/clothing/glasses/sunglasses/gar", "/obj/item/clothing/glasses/sunglasses", {
	throw_speed: 4,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/orange"),
	name: "gar glasses",
	desc: "Just who the hell do you think I am?!",
	icon_state: "gar",
	item_state: "gar",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// glasses.dm:199
rt.def("/obj/item/clothing/glasses/sunglasses/gar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("sliced");
	return f.dot;
});

rt.type(8234, "/obj/item/clothing/glasses/welding", "/obj/item/clothing/glasses", {
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/gray"),
	name: "welding goggles",
	desc: "Protects the eyes from welders; approved by the mad scientist association.",
	icon_state: "welding-g",
	item_state: "welding-g",
	actions_types: null,
	materials: null,
	flash_protect: 2,
	tint: 2,
	visor_vars_to_toggle: 3,
	flags_cover: 1,
	visor_flags_inv: 64,
});

// glasses.dm:218
rt.def("/obj/item/clothing/glasses/welding/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle"));
	this.materials = rt.alist(f, ["$metal", 250]);
	return f.dot;
});

// glasses.dm:228
rt.def("/obj/item/clothing/glasses/welding/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.weldingvisortoggle(user);
	return f.dot;
}, true);

rt.type(8235, "/obj/item/clothing/glasses/thermal", "/obj/item/clothing/glasses", {
	vision_flags: 4,
	invis_view: 2,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "optical thermal scanner",
	desc: "Thermals in the shape of glasses.",
	icon_state: "thermal",
	item_state: "glasses",
	origin_tech: "magnets=3",
	flash_protect: 0,
});

// glasses.dm:256
rt.def("/obj/item/clothing/glasses/thermal/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.thermal_overload();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8236, "/obj/item/clothing/glasses/thermal/syndi", "/obj/item/clothing/glasses/thermal", {
	chameleon_action: null,
	name: "chameleon thermals",
	desc: "A pair of thermal optic goggles with an onboard chameleon generator.",
	origin_tech: "magnets=3;syndicate=4",
	flash_protect: -1,
});

// glasses.dm:268
rt.def("/obj/item/clothing/glasses/thermal/syndi/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/glasses");
	this.chameleon_action.chameleon_name = "Glasses";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/clothing/glasses/changeling"), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// glasses.dm:276
rt.def("/obj/item/clothing/glasses/thermal/syndi/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* parent_proc();
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(8237, "/obj/item/clothing/glasses/thermal/monocle", "/obj/item/clothing/glasses/thermal", {
	flags: null,
	name: "thermoncle",
	desc: "Never before has seeing through walls felt so gentlepersonly.",
	icon_state: "thermoncle",
});

// glasses.dm:286
rt.def("/obj/item/clothing/glasses/thermal/monocle/proc/examine", function examine(f: Frame, user: Value) {
	let desk: Value = this.desc;
	if (user.gender == "male") {
		this.desc = replacetext(this.desc, "person", "man");
	} else if (user.gender == "female") {
		this.desc = replacetext(this.desc, "person", "woman");
	}
	parent_proc();
	this.desc = desk;
	return f.dot;
}, false);

rt.type(8243, "/obj/item/clothing/glasses/godeye", "/obj/item/clothing/glasses", {
	vision_flags: 28,
	darkness_view: 8,
	flags: 2,
	lighting_alpha: 128,
	name: "eye of god",
	desc: "A strange eye, said to have been torn from an omniscient creature that used to roam the wastes.",
	icon_state: "godeye",
	item_state: "godeye",
	scan_reagents: 1,
});

// glasses.dm:338
rt.def("/obj/item/clothing/glasses/godeye/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.op(f, "IsType", [], [W, this]) && W != this && W.loc == user) {
		if (W.icon_state == "godeye") {
			W.icon_state = "doublegodeye";
			W.item_state = "doublegodeye";
			W.desc = "A pair of strange eyes, said to have been torn from an omniscient creature that used to roam the wastes. There's no real reason to have two, but that isn't stopping you.";
			if (rt.istype(user, T("/mob/living/carbon"))) {
				yield* (C = user).update_inv_wear_mask();
			}
		} else {
			to_chat(user, "<span class='notice'>The eye winks at you and vanishes into the abyss, you feel really unlucky.</span>");
		}
		yield* qdel(this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// glasses.dm:352
rt.def("/obj/item/clothing/glasses/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let H: Value = null;
	if (this.glass_colour_type && rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((H = user).client) {
			if (H.client.prefs) {
				if (this == H.glasses) {
					H.client.prefs.uses_glasses_colour = (!H.client.prefs.uses_glasses_colour ? 1 : 0);
					if (H.client.prefs.uses_glasses_colour) {
						to_chat(H, "You will now see glasses colors.");
					} else {
						to_chat(H, "You will no longer see glasses colors.");
					}
					yield* H.update_glasses_color(this, 1);
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// glasses.dm:367
rt.def("/obj/item/clothing/glasses/proc/change_glass_color", function* change_glass_color(f: Frame, H: Value, new_color_type: Value) {
	let old_colour_type: Value = this.glass_colour_type;
	if (!(!new_color_type || ispath(new_color_type))) return f.dot;
	this.glass_colour_type = new_color_type;
	if (!(H && H.glasses == this)) return f.dot;
	if (old_colour_type) {
		yield* H.remove_client_colour(old_colour_type);
	}
	if (!this.glass_colour_type) return f.dot;
	yield* H.update_glasses_color(this, 1);
	return f.dot;
}, true);

// glasses.dm:378
rt.def("/mob/living/carbon/human/proc/update_glasses_color", function* update_glasses_color(f: Frame, G: Value, glasses_equipped: Value) {
	if (this.client && this.client.prefs.uses_glasses_colour && glasses_equipped) {
		yield* this.add_client_colour(G.glass_colour_type);
	} else {
		yield* this.remove_client_colour(G.glass_colour_type);
	}
	return f.dot;
}, true);
