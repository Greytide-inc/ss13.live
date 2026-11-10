// Based on /tg/station's code/_onclick/hud/human.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11130, "/obj/screen/human/toggle", "/obj/screen/human", {
	name: "toggle",
	icon_state: "toggle",
});

// human.dm:10
rt.def("/obj/screen/human/toggle/proc/Click", function Click(f: Frame) {
	let M: Value = null;
	let targetmob: Value = f.usr;
	if (rt.istype(f.usr, T("/mob/dead/observer"))) {
		if (rt.istype(f.usr.client.eye, T("/mob/living/carbon/human")) && f.usr.client.eye != f.usr) {
			targetmob = (M = f.usr.client.eye);
		}
	}
	if (f.usr.hud_used.inventory_shown && targetmob.hud_used) {
		f.usr.hud_used.inventory_shown = 0;
		f.usr.client.screen -= targetmob.hud_used.toggleable_inventory;
	} else {
		f.usr.hud_used.inventory_shown = 1;
		f.usr.client.screen += targetmob.hud_used.toggleable_inventory;
	}
	targetmob.hud_used.hidden_inventory_update(f.usr);
	return f.dot;
});

rt.type(11131, "/obj/screen/human/equip", "/obj/screen/human", {
	name: "equip",
	icon_state: "act_equip",
});

// human.dm:31
rt.def("/obj/screen/human/equip/proc/Click", function* Click(f: Frame) {
	let H: Value = null;
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return 1;
	}
	yield* (H = f.usr).quick_equip();
	return f.dot;
}, true);

rt.type(11133, "/obj/screen/devil/soul_counter", "/obj/screen/devil", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	name: "souls owned",
	icon_state: "Devil-6",
	screen_loc: "WEST:6,CENTER-1:15",
});

// human.dm:47
rt.def("/obj/screen/devil/soul_counter/proc/update_counter", function update_counter(f: Frame, souls: Value) {
	souls ??= 0;
	this.invisibility = 0;
	this.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#FF0000'>${souls}</font></div>`;
	if (souls === 0 || souls == null) {
		this.icon_state = "Devil-1";
	} else if (souls === 1 || souls === 2) {
		this.icon_state = "Devil-2";
	} else if (rt.inRange(souls, 3, 5)) {
		this.icon_state = "Devil-3";
	} else if (rt.inRange(souls, 6, 8)) {
		this.icon_state = "Devil-4";
	} else if (rt.inRange(souls, 9, 1e+31)) {
		this.icon_state = "Devil-5";
	} else {
		this.icon_state = "Devil-6";
	}
	return f.dot;
});

rt.type(11135, "/obj/screen/ling/sting", "/obj/screen/ling", {
	name: "current sting",
	screen_loc: "WEST:6,CENTER-3:11",
});

// human.dm:73
rt.def("/obj/screen/ling/sting/proc/Click", function Click(f: Frame) {
	let U: Value = null;
	if (rt.istype(f.usr, T("/mob/dead/observer"))) {
		return f.dot;
	}
	(U = f.usr).unset_sting();
	return f.dot;
});

// human.dm:84
rt.def("/mob/living/carbon/human/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/human"), this, ui_style2icon(this.client.prefs.UI_style)));
	return f.dot;
}, true);

rt.type(74, "/datum/hud/human", "/datum/hud", {});

// human.dm:89
rt.def("/datum/hud/human/proc/New", function* New(f: Frame) {
	let using: Value = null, inv_box: Value = null, inv: Value = null;
	let $e: any;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* parent_proc();
	yield* f.args[0].overlay_fullscreen("see_through_darkness", T("/obj/screen/fullscreen/see_through_darkness"));
	(using = (yield* new_(T("/obj/screen/craft")))).icon = f.args[1];
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/language_menu")))).icon = f.args[1];
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/area_creator")))).icon = f.args[1];
	this.static_inventory += using;
	this.action_intent = (yield* new_(T("/obj/screen/act_intent/segmented")));
	this.action_intent.icon_state = this.mymob.a_intent;
	this.static_inventory += this.action_intent;
	(using = (yield* new_(T("/obj/screen/mov_intent")))).icon = f.args[1];
	let $0: any = using;
	$0.icon_state = this.mymob.m_intent == "run" ? "running" : "walking";
	using.screen_loc = "EAST-2:26,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/drop")))).icon = f.args[1];
	using.screen_loc = "EAST-1:28,SOUTH+1:7";
	this.static_inventory += using;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "i_clothing";
	inv_box.icon = f.args[1];
	inv_box.slot_id = slot_w_uniform;
	inv_box.icon_state = "uniform";
	inv_box.screen_loc = "WEST:6,SOUTH+1:7";
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "o_clothing";
	inv_box.icon = f.args[1];
	inv_box.slot_id = slot_wear_suit;
	inv_box.icon_state = "suit";
	inv_box.screen_loc = "WEST+1:8,SOUTH+1:7";
	this.toggleable_inventory += inv_box;
	yield* this.build_hand_slots(f.args[1]);
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_1";
	using.screen_loc = ui_swaphand_position(f.args[0], 1);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_2";
	using.screen_loc = ui_swaphand_position(f.args[0], 2);
	this.static_inventory += using;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "id";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "id";
	inv_box.screen_loc = "CENTER-4:12,SOUTH:5";
	inv_box.slot_id = slot_wear_id;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "mask";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "mask";
	inv_box.screen_loc = "WEST+1:8,SOUTH+2:9";
	inv_box.slot_id = slot_wear_mask;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "neck";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "neck";
	inv_box.screen_loc = "WEST:6,SOUTH+2:9";
	inv_box.slot_id = slot_neck;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "back";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "back";
	inv_box.screen_loc = "CENTER-2:14,SOUTH:5";
	inv_box.slot_id = slot_back;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "storage1";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "pocket";
	inv_box.screen_loc = "CENTER+1:18,SOUTH:5";
	inv_box.slot_id = slot_l_store;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "storage2";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "pocket";
	inv_box.screen_loc = "CENTER+2:20,SOUTH:5";
	inv_box.slot_id = slot_r_store;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "suit storage";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "suit_storage";
	inv_box.screen_loc = "CENTER-5:10,SOUTH:5";
	inv_box.slot_id = slot_s_store;
	this.static_inventory += inv_box;
	(using = (yield* new_(T("/obj/screen/resist")))).icon = f.args[1];
	using.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.hotkeybuttons += using;
	(using = (yield* new_(T("/obj/screen/human/toggle")))).icon = f.args[1];
	using.screen_loc = "WEST:6,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/human/equip")))).icon = f.args[1];
	using.screen_loc = ui_equip_position(this.mymob);
	this.static_inventory += using;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "gloves";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "gloves";
	inv_box.screen_loc = "WEST+2:10,SOUTH+1:7";
	inv_box.slot_id = slot_gloves;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "eyes";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "glasses";
	inv_box.screen_loc = "WEST:6,SOUTH+3:11";
	inv_box.slot_id = slot_glasses;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "ears";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "ears";
	inv_box.screen_loc = "WEST+2:10,SOUTH+2:9";
	inv_box.slot_id = slot_ears;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "head";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "head";
	inv_box.screen_loc = "WEST+1:8,SOUTH+3:11";
	inv_box.slot_id = slot_head;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "shoes";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "shoes";
	inv_box.screen_loc = "WEST+1:8,SOUTH:5";
	inv_box.slot_id = slot_shoes;
	this.toggleable_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "belt";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "belt";
	inv_box.screen_loc = "CENTER-3:14,SOUTH:5";
	inv_box.slot_id = slot_belt;
	this.static_inventory += inv_box;
	this.throw_icon = (yield* new_(T("/obj/screen/throw_catch")));
	this.throw_icon.icon = f.args[1];
	this.throw_icon.screen_loc = "EAST-1:28,SOUTH+1:7";
	this.hotkeybuttons += this.throw_icon;
	this.internals = (yield* new_(T("/obj/screen/internals")));
	this.infodisplay += this.internals;
	this.healths = (yield* new_(T("/obj/screen/healths")));
	this.infodisplay += this.healths;
	this.healthdoll = (yield* new_(T("/obj/screen/healthdoll")));
	this.infodisplay += this.healthdoll;
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = f.args[1];
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.static_inventory += this.pull_icon;
	this.lingchemdisplay = (yield* new_(T("/obj/screen/ling/chems")));
	this.infodisplay += this.lingchemdisplay;
	this.lingstingdisplay = (yield* new_(T("/obj/screen/ling/sting")));
	this.infodisplay += this.lingstingdisplay;
	this.devilsouldisplay = (yield* new_(T("/obj/screen/devil/soul_counter")));
	this.infodisplay += this.devilsouldisplay;
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel")));
	this.zone_select.icon = f.args[1];
	yield* this.zone_select.update_icon(this.mymob);
	this.static_inventory += this.zone_select;
	for (inv of each(this.static_inventory + this.toggleable_inventory, T("/obj/screen/inventory"))) {
		if (inv.slot_id) {
			inv.hud = this;
			rt.setAt(this.inv_slots, inv.slot_id, inv);
			yield* inv.update_icon();
		}
	}
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// human.dm:313
rt.def("/datum/hud/human/proc/update_locked_slots", function update_locked_slots(f: Frame) {
	let inv: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	let H: Value = this.mymob;
	let S: Value = H.dna.species;
	for (inv of each(this.static_inventory + this.toggleable_inventory, T("/obj/screen/inventory"))) {
		if (inv.slot_id) {
			if (rt.isIn(f, inv.slot_id, S.no_equip)) {
				inv.alpha = 128;
			} else {
				inv.alpha = rt.initial(f, inv, "alpha");
			}
		}
	}
	return f.dot;
});

// human.dm:325
rt.def("/datum/hud/human/proc/hidden_inventory_update", function hidden_inventory_update(f: Frame, viewer: Value) {
	let screenmob: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	let H: Value = this.mymob;
	if ((screenmob = (viewer || H)).hud_used.inventory_shown && screenmob.hud_used.hud_shown) {
		if (H.shoes) {
			H.shoes.screen_loc = "WEST+1:8,SOUTH:5";
			screenmob.client.screen += H.shoes;
		}
		if (H.gloves) {
			H.gloves.screen_loc = "WEST+2:10,SOUTH+1:7";
			screenmob.client.screen += H.gloves;
		}
		if (H.ears) {
			H.ears.screen_loc = "WEST+2:10,SOUTH+2:9";
			screenmob.client.screen += H.ears;
		}
		if (H.glasses) {
			H.glasses.screen_loc = "WEST:6,SOUTH+3:11";
			screenmob.client.screen += H.glasses;
		}
		if (H.w_uniform) {
			H.w_uniform.screen_loc = "WEST:6,SOUTH+1:7";
			screenmob.client.screen += H.w_uniform;
		}
		if (H.wear_suit) {
			H.wear_suit.screen_loc = "WEST+1:8,SOUTH+1:7";
			screenmob.client.screen += H.wear_suit;
		}
		if (H.wear_mask) {
			H.wear_mask.screen_loc = "WEST+1:8,SOUTH+2:9";
			screenmob.client.screen += H.wear_mask;
		}
		if (H.wear_neck) {
			H.wear_neck.screen_loc = "WEST:6,SOUTH+2:9";
			screenmob.client.screen += H.wear_neck;
		}
		if (H.head) {
			H.head.screen_loc = "WEST+1:8,SOUTH+3:11";
			screenmob.client.screen += H.head;
		}
	} else {
		if (H.shoes) {
			screenmob.client.screen -= H.shoes;
		}
		if (H.gloves) {
			screenmob.client.screen -= H.gloves;
		}
		if (H.ears) {
			screenmob.client.screen -= H.ears;
		}
		if (H.glasses) {
			screenmob.client.screen -= H.glasses;
		}
		if (H.w_uniform) {
			screenmob.client.screen -= H.w_uniform;
		}
		if (H.wear_suit) {
			screenmob.client.screen -= H.wear_suit;
		}
		if (H.wear_mask) {
			screenmob.client.screen -= H.wear_mask;
		}
		if (H.wear_neck) {
			screenmob.client.screen -= H.wear_neck;
		}
		if (!H.head) return f.dot;
		screenmob.client.screen -= H.head;
	}
	return f.dot;
});

// human.dm:373
rt.def("/datum/hud/human/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame, viewer: Value) {
	let screenmob: Value = null, I: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	parent_proc();
	let H: Value = this.mymob;
	if ((screenmob = (viewer || H)).hud_used) {
		if (screenmob.hud_used.hud_shown) {
			if (H.s_store) {
				H.s_store.screen_loc = "CENTER-5:10,SOUTH:5";
				screenmob.client.screen += H.s_store;
			}
			if (H.wear_id) {
				H.wear_id.screen_loc = "CENTER-4:12,SOUTH:5";
				screenmob.client.screen += H.wear_id;
			}
			if (H.belt) {
				H.belt.screen_loc = "CENTER-3:14,SOUTH:5";
				screenmob.client.screen += H.belt;
			}
			if (H.back) {
				H.back.screen_loc = "CENTER-2:14,SOUTH:5";
				screenmob.client.screen += H.back;
			}
			if (H.l_store) {
				H.l_store.screen_loc = "CENTER+1:18,SOUTH:5";
				screenmob.client.screen += H.l_store;
			}
			if (H.r_store) {
				H.r_store.screen_loc = "CENTER+2:20,SOUTH:5";
				screenmob.client.screen += H.r_store;
			}
		} else {
			if (H.s_store) {
				screenmob.client.screen -= H.s_store;
			}
			if (H.wear_id) {
				screenmob.client.screen -= H.wear_id;
			}
			if (H.belt) {
				screenmob.client.screen -= H.belt;
			}
			if (H.back) {
				screenmob.client.screen -= H.back;
			}
			if (H.l_store) {
				screenmob.client.screen -= H.l_store;
			}
			if (H.r_store) {
				screenmob.client.screen -= H.r_store;
			}
		}
	}
	if (this.hud_version != HUD_STYLE_NOHUD) {
		for (I of each(H.held_items, T("/obj/item"))) {
			I.screen_loc = ui_hand_position(H.get_held_index_of_item(I));
			screenmob.client.screen += I;
		}
	} else {
		I = null;
		for (I of each(H.held_items, T("/obj/item"))) {
			I.screen_loc = null;
			screenmob.client.screen -= I;
		}
	}
	return f.dot;
}, false);

// human.dm:429
rt.def("/mob/living/carbon/human/verb/toggle_hotkey_verbs", function toggle_hotkey_verbs(f: Frame) {
	if (this.hud_used.hotkey_ui_hidden) {
		this.client.screen += this.hud_used.hotkeybuttons;
		this.hud_used.hotkey_ui_hidden = 0;
	} else {
		this.client.screen -= this.hud_used.hotkeybuttons;
		this.hud_used.hotkey_ui_hidden = 1;
	}
	return f.dot;
}, false, { verb: { name: "Toggle hotkey buttons", category: "OOC", desc: "This disables or enables the user interface buttons which can be used with hotkeys." } });
