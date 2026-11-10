// Based on /tg/station's code/_onclick/hud/alien.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11082, "/obj/screen/alien/leap", "/obj/screen/alien", {
	name: "toggle leap",
	icon_state: "leap_off",
});

// alien.dm:9
rt.def("/obj/screen/alien/leap/proc/Click", function* Click(f: Frame) {
	let AH: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/carbon/alien/humanoid/hunter"))) return f.dot;
	yield* (AH = f.usr).toggle_leap();
	return f.dot;
}, true);

rt.type(62, "/datum/hud/alien", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_alien.dmi"),
});

// alien.dm:32
rt.def("/datum/hud/alien/proc/New", function* New(f: Frame) {
	let using: Value = null, H: Value = null, inv: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_alien.dmi");
	}
	yield* parent_proc();
	yield* this.build_hand_slots(f.args[1]);
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_1";
	using.screen_loc = ui_swaphand_position(f.args[0], 1);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swap_hand")))).icon = f.args[1];
	using.icon_state = "swap_2";
	using.screen_loc = ui_swaphand_position(f.args[0], 2);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/act_intent/alien")))).icon_state = this.mymob.a_intent;
	this.static_inventory += using;
	this.action_intent = using;
	if (rt.istype(this.mymob, T("/mob/living/carbon/alien/humanoid/hunter"))) {
		(H = this.mymob).leap_icon = (yield* new_(T("/obj/screen/alien/leap")));
		H.leap_icon.screen_loc = "CENTER+1:18,SOUTH:5";
		this.static_inventory += H.leap_icon;
	}
	(using = (yield* new_(T("/obj/screen/language_menu")))).screen_loc = "EAST-3:26,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/drop")))).icon = f.args[1];
	using.screen_loc = "EAST-1:28,SOUTH+1:7";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/resist")))).icon = f.args[1];
	using.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.hotkeybuttons += using;
	this.throw_icon = (yield* new_(T("/obj/screen/throw_catch")));
	this.throw_icon.icon = f.args[1];
	this.throw_icon.screen_loc = "EAST-1:28,SOUTH+1:7";
	this.hotkeybuttons += this.throw_icon;
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = f.args[1];
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.static_inventory += this.pull_icon;
	this.healths = (yield* new_(T("/obj/screen/healths/alien")));
	this.infodisplay += this.healths;
	this.alien_plasma_display = (yield* new_(T("/obj/screen/alien/plasma_display")));
	this.infodisplay += this.alien_plasma_display;
	if (!rt.istype(this.mymob, T("/mob/living/carbon/alien/humanoid/royal/queen"))) {
		this.alien_queen_finder = (yield* new_(T("/obj/screen/alien/alien_queen_finder")));
		this.infodisplay += this.alien_queen_finder;
	}
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel/alien")));
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

// alien.dm:114
rt.def("/datum/hud/alien/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let I: Value = null;
	if (!this.mymob) {
		return f.dot;
	}
	let H: Value = this.mymob;
	if (this.hud_version != HUD_STYLE_NOHUD) {
		for (I of each(H.held_items, T("/obj/item"))) {
			I.screen_loc = ui_hand_position(H.get_held_index_of_item(I));
			H.client.screen += I;
		}
	} else {
		I = null;
		for (I of each(H.held_items, T("/obj/item"))) {
			I.screen_loc = null;
			H.client.screen -= I;
		}
	}
	return f.dot;
});

// alien.dm:127
rt.def("/mob/living/carbon/alien/humanoid/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/alien"), this));
	return f.dot;
}, true);
