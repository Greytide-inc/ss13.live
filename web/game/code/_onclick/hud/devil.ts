// Based on /tg/station's code/_onclick/hud/devil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(68, "/datum/hud/devil", "/datum/hud", {});

// devil.dm:6
rt.def("/datum/hud/devil/proc/New", function* New(f: Frame) {
	let using: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* parent_proc();
	(using = (yield* new_(T("/obj/screen/drop")))).icon = f.args[1];
	using.screen_loc = "CENTER+1:18,SOUTH:5";
	this.static_inventory += using;
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = f.args[1];
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "CENTER+2:2,SOUTH:5";
	this.static_inventory += this.pull_icon;
	yield* this.build_hand_slots(f.args[1]);
	(using = (yield* new_(T("/obj/screen/inventory")))).name = "hand";
	using.icon = f.args[1];
	using.icon_state = "swap_1_m";
	using.screen_loc = ui_swaphand_position(f.args[0], 1);
	using.layer = HUD_LAYER;
	using.plane = HUD_PLANE;
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/inventory")))).name = "hand";
	using.icon = f.args[1];
	using.icon_state = "swap_2";
	using.screen_loc = ui_swaphand_position(f.args[0], 2);
	using.layer = HUD_LAYER;
	using.plane = HUD_PLANE;
	this.static_inventory += using;
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel")));
	this.zone_select.icon = f.args[1];
	yield* this.zone_select.update_icon(this.mymob);
	this.lingchemdisplay = (yield* new_(T("/obj/screen/ling/chems")));
	this.devilsouldisplay = (yield* new_(T("/obj/screen/devil/soul_counter")));
	this.infodisplay += this.devilsouldisplay;
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// devil.dm:50
rt.def("/datum/hud/devil/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let I: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	let D: Value = this.mymob;
	if (this.hud_version != HUD_STYLE_NOHUD) {
		for (I of each(D.held_items, T("/obj/item"))) {
			I.screen_loc = ui_hand_position(D.get_held_index_of_item(I));
			D.client.screen += I;
		}
	} else {
		I = null;
		for (I of each(D.held_items, T("/obj/item"))) {
			I.screen_loc = null;
			D.client.screen -= I;
		}
	}
	return f.dot;
});

// devil.dm:64
rt.def("/mob/living/carbon/true_devil/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/devil"), this, ui_style2icon(this.client.prefs.UI_style)));
	return f.dot;
}, true);
