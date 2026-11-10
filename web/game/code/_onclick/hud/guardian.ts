// Based on /tg/station's code/_onclick/hud/guardian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(73, "/datum/hud/guardian", "/datum/hud", {});

// guardian.dm:3
rt.def("/datum/hud/guardian/proc/New", function* New(f: Frame, owner: Value) {
	let using: Value = null;
	yield* parent_proc();
	this.healths = (yield* new_(T("/obj/screen/healths/guardian")));
	this.infodisplay += this.healths;
	(using = (yield* new_(T("/obj/screen/guardian/Manifest")))).screen_loc = ui_hand_position(2);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/guardian/Recall")))).screen_loc = ui_hand_position(1);
	this.static_inventory += using;
	(using = (yield* new_(owner.toggle_button_type))).screen_loc = "CENTER+1:18,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/guardian/ToggleLight")))).screen_loc = "WEST:6,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/guardian/Communicate")))).screen_loc = "CENTER-2:14,SOUTH:5";
	this.static_inventory += using;
	return f.dot;
}, true);

// guardian.dm:31
rt.def("/mob/living/simple_animal/hostile/guardian/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	if (this.dextrous) {
		yield* parent_proc();
	} else {
		this.hud_used = (yield* new_(T("/datum/hud/guardian"), this, ui_style2icon(this.client.prefs.UI_style)));
	}
	return f.dot;
}, true);

rt.type(71, "/datum/hud/dextrous/guardian", "/datum/hud/dextrous", {});

// guardian.dm:38
rt.def("/datum/hud/dextrous/guardian/proc/New", function* New(f: Frame) {
	let using: Value = null, inv_box: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* parent_proc();
	if (rt.istype(f.args[0], T("/mob/living/simple_animal/hostile/guardian/dextrous"))) {
		(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "internal storage";
		inv_box.icon = f.args[1];
		inv_box.icon_state = "suit_storage";
		inv_box.screen_loc = "CENTER-4:12,SOUTH:5";
		inv_box.slot_id = slot_generic_dextrous_storage;
		this.static_inventory += inv_box;
		(using = (yield* new_(T("/obj/screen/guardian/Communicate")))).screen_loc = "CENTER-5:10,SOUTH:5";
		this.static_inventory += using;
	} else {
		(using = (yield* new_(T("/obj/screen/guardian/Communicate")))).screen_loc = "CENTER-4:12,SOUTH:5";
		this.static_inventory += using;
	}
	this.healths = (yield* new_(T("/obj/screen/healths/guardian")));
	this.infodisplay += this.healths;
	(using = (yield* new_(T("/obj/screen/guardian/Manifest")))).screen_loc = "CENTER-3:14,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/guardian/Recall")))).screen_loc = "CENTER-2:14,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(f.args[0].toggle_button_type))).screen_loc = "CENTER+2:20,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/guardian/ToggleLight")))).screen_loc = "WEST:6,SOUTH:5";
	this.static_inventory += using;
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// guardian.dm:81
rt.def("/datum/hud/dextrous/guardian/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let D: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	if (rt.istype(this.mymob, T("/mob/living/simple_animal/hostile/guardian/dextrous"))) {
		D = this.mymob;
		if (this.hud_shown) {
			if (D.internal_storage) {
				D.internal_storage.screen_loc = "CENTER-4:12,SOUTH:5";
				D.client.screen += D.internal_storage;
			}
		} else if (D.internal_storage) {
			D.internal_storage.screen_loc = null;
		}
	}
	parent_proc();
	return f.dot;
});

rt.type(11122, "/obj/screen/guardian/Manifest", "/obj/screen/guardian", {
	icon_state: "manifest",
	name: "Manifest",
	desc: "Spring forth into battle!",
});

// guardian.dm:105
rt.def("/obj/screen/guardian/Manifest/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/guardian"))) return f.dot;
	yield* (G = f.usr).Manifest();
	return f.dot;
}, true);

rt.type(11123, "/obj/screen/guardian/Recall", "/obj/screen/guardian", {
	icon_state: "recall",
	name: "Recall",
	desc: "Return to your user.",
});

// guardian.dm:116
rt.def("/obj/screen/guardian/Recall/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/guardian"))) return f.dot;
	yield* (G = f.usr).Recall();
	return f.dot;
}, true);

rt.type(11124, "/obj/screen/guardian/ToggleMode", "/obj/screen/guardian", {
	icon_state: "toggle",
	name: "Toggle Mode",
	desc: "Switch between ability modes.",
});

// guardian.dm:126
rt.def("/obj/screen/guardian/ToggleMode/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/guardian"))) return f.dot;
	yield* (G = f.usr).ToggleMode();
	return f.dot;
}, true);

rt.type(11127, "/obj/screen/guardian/Communicate", "/obj/screen/guardian", {
	icon_state: "communicate",
	name: "Communicate",
	desc: "Communicate telepathically with your user.",
});

// guardian.dm:144
rt.def("/obj/screen/guardian/Communicate/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/guardian"))) return f.dot;
	yield* (G = f.usr).Communicate();
	return f.dot;
}, true);

rt.type(11128, "/obj/screen/guardian/ToggleLight", "/obj/screen/guardian", {
	icon_state: "light",
	name: "Toggle Light",
	desc: "Glow like star dust.",
});

// guardian.dm:155
rt.def("/obj/screen/guardian/ToggleLight/proc/Click", function Click(f: Frame) {
	let G: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/guardian"))) return f.dot;
	(G = f.usr).ToggleLight();
	return f.dot;
});
