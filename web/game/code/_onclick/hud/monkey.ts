// Based on /tg/station's code/_onclick/hud/monkey.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(76, "/datum/hud/monkey", "/datum/hud", {});

// monkey.dm:2
rt.def("/datum/hud/monkey/proc/New", function* New(f: Frame) {
	let using: Value = null, inv_box: Value = null, inv: Value = null;
	let $e: any;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* parent_proc();
	this.action_intent = (yield* new_(T("/obj/screen/act_intent")));
	this.action_intent.icon = f.args[1];
	this.action_intent.icon_state = this.mymob.a_intent;
	this.action_intent.screen_loc = "EAST-3:24,SOUTH:5";
	this.static_inventory += this.action_intent;
	(using = (yield* new_(T("/obj/screen/mov_intent")))).icon = f.args[1];
	let $0: any = using;
	$0.icon_state = this.mymob.m_intent == "run" ? "running" : "walking";
	using.screen_loc = "EAST-2:26,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/language_menu")))).icon = f.args[1];
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/drop")))).icon = f.args[1];
	using.screen_loc = "EAST-1:28,SOUTH+1:7";
	this.static_inventory += using;
	yield* this.build_hand_slots(f.args[1]);
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_1_m";
	using.screen_loc = ui_swaphand_position(f.args[0], 1);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_2";
	using.screen_loc = ui_swaphand_position(f.args[0], 2);
	this.static_inventory += using;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "mask";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "mask";
	inv_box.screen_loc = "CENTER-4:14,SOUTH:5";
	inv_box.slot_id = slot_wear_mask;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "neck";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "neck";
	inv_box.screen_loc = "CENTER-3:15,SOUTH:5";
	inv_box.slot_id = slot_neck;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "head";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "head";
	inv_box.screen_loc = "CENTER-5:13,SOUTH:5";
	inv_box.slot_id = slot_head;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "back";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "back";
	inv_box.screen_loc = "CENTER-2:16,SOUTH:5";
	inv_box.slot_id = slot_back;
	this.static_inventory += inv_box;
	this.throw_icon = (yield* new_(T("/obj/screen/throw_catch")));
	this.throw_icon.icon = f.args[1];
	this.throw_icon.screen_loc = "EAST-1:28,SOUTH+1:7";
	this.hotkeybuttons += this.throw_icon;
	this.internals = (yield* new_(T("/obj/screen/internals")));
	this.infodisplay += this.internals;
	this.healths = (yield* new_(T("/obj/screen/healths")));
	this.infodisplay += this.healths;
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = f.args[1];
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.static_inventory += this.pull_icon;
	this.lingchemdisplay = (yield* new_(T("/obj/screen/ling/chems")));
	this.infodisplay += this.lingchemdisplay;
	this.lingstingdisplay = (yield* new_(T("/obj/screen/ling/sting")));
	this.infodisplay += this.lingstingdisplay;
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel")));
	this.zone_select.icon = f.args[1];
	yield* this.zone_select.update_icon(this.mymob);
	this.static_inventory += this.zone_select;
	this.mymob.client.screen = list();
	(using = (yield* new_(T("/obj/screen/resist")))).icon = f.args[1];
	using.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.hotkeybuttons += using;
	for (inv of each(this.static_inventory + this.toggleable_inventory, T("/obj/screen/inventory"))) {
		if (inv.slot_id) {
			inv.hud = this;
			rt.setAt(this.inv_slots, inv.slot_id, inv);
			yield* inv.update_icon();
		}
	}
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// monkey.dm:119
rt.def("/datum/hud/monkey/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let I: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	let M: Value = this.mymob;
	if (this.hud_shown) {
		if (M.back) {
			M.back.screen_loc = "CENTER-2:16,SOUTH:5";
			M.client.screen += M.back;
		}
		if (M.wear_mask) {
			M.wear_mask.screen_loc = "CENTER-4:14,SOUTH:5";
			M.client.screen += M.wear_mask;
		}
		if (M.wear_neck) {
			M.wear_neck.screen_loc = "CENTER-3:15,SOUTH:5";
			M.client.screen += M.wear_neck;
		}
		if (M.head) {
			M.head.screen_loc = "CENTER-5:13,SOUTH:5";
			M.client.screen += M.head;
		}
	} else {
		if (M.back) {
			M.back.screen_loc = null;
		}
		if (M.wear_mask) {
			M.wear_mask.screen_loc = null;
		}
		if (M.head) {
			M.head.screen_loc = null;
		}
	}
	if (this.hud_version != HUD_STYLE_NOHUD) {
		for (I of each(M.held_items, T("/obj/item"))) {
			I.screen_loc = ui_hand_position(M.get_held_index_of_item(I));
			M.client.screen += I;
		}
	} else {
		I = null;
		for (I of each(M.held_items, T("/obj/item"))) {
			I.screen_loc = null;
			M.client.screen -= I;
		}
	}
	return f.dot;
});

// monkey.dm:154
rt.def("/mob/living/carbon/monkey/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/monkey"), this, ui_style2icon(this.client.prefs.UI_style)));
	return f.dot;
}, true);
