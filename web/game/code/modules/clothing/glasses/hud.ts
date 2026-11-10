// Based on /tg/station's code/modules/clothing/glasses/hud.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8244, "/obj/item/clothing/glasses/hud", "/obj/item/clothing/glasses", {
	hud_type: null,
	flags: null,
	name: "HUD",
	desc: "A heads-up display that provides important info in (almost) real time.",
	origin_tech: "magnets=3;biotech=2",
});

// hud.dm:9
rt.def("/obj/item/clothing/glasses/hud/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	yield* parent_proc();
	if (!(this.hud_type && slot == slot_glasses)) return f.dot;
	(H = rt.index(GLOB.huds, this.hud_type)).add_hud_to(user);
	return f.dot;
}, true);

// hud.dm:15
rt.def("/obj/item/clothing/glasses/hud/proc/dropped", function* dropped(f: Frame, user: Value) {
	let H: Value = null;
	yield* parent_proc();
	if (!(this.hud_type && rt.istype(user, T("/mob/living/carbon/human")) && user.glasses == this)) return f.dot;
	(H = rt.index(GLOB.huds, this.hud_type)).remove_hud_from(user);
	return f.dot;
}, true);

// hud.dm:21
rt.def("/obj/item/clothing/glasses/hud/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	if (this.emagged != 0) return f.dot;
	this.emagged = 1;
	this.desc = `${this.desc} The display is flickering slightly.`;
	return f.dot;
});

// hud.dm:26
rt.def("/obj/item/clothing/glasses/hud/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged != 0) return f.dot;
	this.emagged = 1;
	to_chat(user, "<span class='warning'>PZZTTPFFFT</span>");
	this.desc = `${this.desc} The display is flickering slightly.`;
	return f.dot;
});

rt.type(8251, "/obj/item/clothing/glasses/hud/security/chameleon", "/obj/item/clothing/glasses/hud/security", {
	chameleon_action: null,
	name: "chameleon security HUD",
	desc: "A stolen security HUD integrated with Syndicate chameleon technology. Provides flash protection.",
	flash_protect: 1,
});

// hud.dm:95
rt.def("/obj/item/clothing/glasses/hud/security/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/glasses");
	this.chameleon_action.chameleon_name = "Glasses";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/clothing/glasses/changeling"), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// hud.dm:103
rt.def("/obj/item/clothing/glasses/hud/security/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.dot = (yield* parent_proc());
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(8254, "/obj/item/clothing/glasses/hud/security/sunglasses/gars", "/obj/item/clothing/glasses/hud/security/sunglasses", {
	throw_speed: 4,
	name: "１HUD gar glasses",
	desc: "GAR glasses with a HUD.",
	icon_state: "gars",
	item_state: "garb",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// hud.dm:139
rt.def("/obj/item/clothing/glasses/hud/security/sunglasses/gars/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("sliced");
	return f.dot;
});

rt.type(8257, "/obj/item/clothing/glasses/hud/toggle", "/obj/item/clothing/glasses/hud", {
	name: "Toggle HUD",
	desc: "A hud with multiple functions.",
	actions_types: null,
});

// hud.dm:154
rt.def("/obj/item/clothing/glasses/hud/toggle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/switch_hud"));
	return f.dot;
});

// hud.dm:157
rt.def("/obj/item/clothing/glasses/hud/toggle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let wearer: Value = null, H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((wearer = user).glasses != this) {
		return f.dot;
	}
	if (this.hud_type) {
		(H = rt.index(GLOB.huds, this.hud_type)).remove_hud_from(user);
	}
	if (this.hud_type == DATA_HUD_MEDICAL_ADVANCED) {
		this.hud_type = null;
	} else if (this.hud_type == DATA_HUD_SECURITY_ADVANCED) {
		this.hud_type = DATA_HUD_MEDICAL_ADVANCED;
	} else {
		this.hud_type = DATA_HUD_SECURITY_ADVANCED;
	}
	if (!this.hud_type) return f.dot;
	(H = rt.index(GLOB.huds, this.hud_type)).add_hud_to(user);
	return f.dot;
});

rt.type(8258, "/obj/item/clothing/glasses/hud/toggle/thermal", "/obj/item/clothing/glasses/hud/toggle", {
	hud_type: 2,
	vision_flags: 4,
	invis_view: 2,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "thermal HUD scanner",
	desc: "Thermal imaging HUD in the shape of glasses.",
	icon_state: "thermal",
});

// hud.dm:188
rt.def("/obj/item/clothing/glasses/hud/toggle/thermal/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.hud_type === DATA_HUD_MEDICAL_ADVANCED) {
		this.icon_state = "meson";
		yield* this.change_glass_color(user, T("/datum/client_colour/glass_colour/green"));
	} else if (this.hud_type === DATA_HUD_SECURITY_ADVANCED) {
		this.icon_state = "thermal";
		yield* this.change_glass_color(user, T("/datum/client_colour/glass_colour/red"));
	} else {
		this.icon_state = "purple";
		yield* this.change_glass_color(user, T("/datum/client_colour/glass_colour/purple"));
	}
	user.update_inv_glasses();
	return f.dot;
}, true);

// hud.dm:202
rt.def("/obj/item/clothing/glasses/hud/toggle/thermal/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.thermal_overload();
	yield* parent_proc();
	return f.dot;
}, true);
