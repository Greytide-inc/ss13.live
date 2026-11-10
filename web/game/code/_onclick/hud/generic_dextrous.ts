// Based on /tg/station's code/_onclick/hud/generic_dextrous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(69, "/datum/hud/dextrous", "/datum/hud", {});

// generic_dextrous.dm:3
rt.def("/datum/hud/dextrous/proc/New", function* New(f: Frame) {
	let using: Value = null, inv: Value = null;
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
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_1_m";
	using.screen_loc = ui_swaphand_position(f.args[0], 1);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_2";
	using.screen_loc = ui_swaphand_position(f.args[0], 2);
	this.static_inventory += using;
	if (this.mymob.possible_a_intents) {
		if (rt.len(f, this.mymob.possible_a_intents) == 4) {
			this.action_intent = (yield* new_(T("/obj/screen/act_intent/segmented")));
		} else {
			this.action_intent = (yield* new_(T("/obj/screen/act_intent")));
			this.action_intent.icon = f.args[1];
		}
		this.action_intent.icon_state = this.mymob.a_intent;
		this.static_inventory += this.action_intent;
	}
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel")));
	this.zone_select.icon = f.args[1];
	yield* this.zone_select.update_icon(this.mymob);
	this.static_inventory += this.zone_select;
	(using = (yield* new_(T("/obj/screen/craft")))).icon = f.args[1];
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/area_creator")))).icon = f.args[1];
	this.static_inventory += using;
	this.mymob.client.screen = list();
	for (inv of each(this.static_inventory + this.toggleable_inventory, T("/obj/screen/inventory"))) {
		if (inv.slot_id) {
			inv.hud = this;
			rt.setAt(this.inv_slots, inv.slot_id, inv);
			yield* inv.update_icon();
		}
	}
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// generic_dextrous.dm:64
rt.def("/datum/hud/dextrous/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
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

// generic_dextrous.dm:79
rt.def("/mob/living/simple_animal/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	if (this.dextrous) {
		this.hud_used = (yield* new_(this.dextrous_hud_type, this, ui_style2icon(this.client.prefs.UI_style)));
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
