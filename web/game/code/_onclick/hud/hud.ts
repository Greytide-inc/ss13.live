// Based on /tg/station's code/_onclick/hud/hud.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(60, "/datum/hud", "/datum", {
	mymob: null,
	hud_shown: 1,
	hud_version: 1,
	inventory_shown: 0,
	show_intent_icons: 0,
	hotkey_ui_hidden: 0,
	lingchemdisplay: null,
	lingstingdisplay: null,
	blobpwrdisplay: null,
	alien_plasma_display: null,
	alien_queen_finder: null,
	devilsouldisplay: null,
	deity_power_display: null,
	deity_follower_display: null,
	nightvisionicon: null,
	action_intent: null,
	zone_select: null,
	pull_icon: null,
	throw_icon: null,
	module_store_icon: null,
	static_inventory: null,
	toggleable_inventory: null,
	hotkeybuttons: null,
	infodisplay: null,
	screenoverlays: null,
	inv_slots: null,
	hand_slots: null,
	plane_masters: null,
	screentip_text: null,
	hide_actions_toggle: null,
	action_buttons_hidden: 0,
	healths: null,
	healthdoll: null,
	internals: null,
	ui_style_icon: rt.rsc("icons/mob/screen_midnight.dmi"),
});

// hud.dm:36
rt.def("/datum/hud/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.static_inventory = list();

	this.toggleable_inventory = list();

	this.hotkeybuttons = list();

	this.infodisplay = list();

	this.screenoverlays = list();

	this.inv_slots = rt.op(f, "CreateMultidimensionalList", [1], [20]);

	this.plane_masters = list();
	return f.dot;
});

// hud.dm:56
rt.def("/datum/hud/proc/New", function* New(f: Frame, owner: Value, ui_style: Value) {
	let mytype: Value = null, instance: Value = null;
	ui_style ??= rt.rsc("icons/mob/screen_midnight.dmi");
	this.mymob = owner;
	this.ui_style_icon = ui_style;
	this.hide_actions_toggle = (yield* new_(T("/obj/screen/movable/action_button/hide_toggle")));
	this.hide_actions_toggle.InitialiseIcon(this);
	this.hand_slots = list();
	this.screentip_text = (yield* new_(T("/obj/screen/screentip")));
	this.static_inventory += this.screentip_text;
	for (mytype of each(typesof(T("/obj/screen/plane_master")) - T("/obj/screen/plane_master"))) {
		instance = (yield* new_(mytype));
		rt.setAt(this.plane_masters, `${instance.plane}`, instance);
		yield* instance.backdrop(this.mymob);
	}
	return f.dot;
}, true);

// hud.dm:74
rt.def("/datum/hud/proc/Destroy", function* Destroy(f: Frame) {
	let thing: Value = null;
	if (this.mymob.hud_used == this) {
		this.mymob.hud_used = null;
	}
	yield* qdel(this.hide_actions_toggle);
	this.hide_actions_toggle = null;
	this.screentip_text = null;
	yield* qdel(this.module_store_icon);
	this.module_store_icon = null;
	if (rt.len(f, this.static_inventory)) {
		for (thing of each(this.static_inventory)) {
			yield* qdel(thing);
		}
		this.static_inventory.Cut();
	}
	this.inv_slots.Cut();
	this.action_intent = null;
	this.zone_select = null;
	this.pull_icon = null;
	if (rt.len(f, this.toggleable_inventory)) {
		thing = null;
		for (thing of each(this.toggleable_inventory)) {
			yield* qdel(thing);
		}
		this.toggleable_inventory.Cut();
	}
	if (rt.len(f, this.hotkeybuttons)) {
		thing = null;
		for (thing of each(this.hotkeybuttons)) {
			yield* qdel(thing);
		}
		this.hotkeybuttons.Cut();
	}
	this.throw_icon = null;
	if (rt.len(f, this.infodisplay)) {
		thing = null;
		for (thing of each(this.infodisplay)) {
			yield* qdel(thing);
		}
		this.infodisplay.Cut();
	}
	this.healths = null;
	this.healthdoll = null;
	this.internals = null;
	this.lingchemdisplay = null;
	this.devilsouldisplay = null;
	this.lingstingdisplay = null;
	this.blobpwrdisplay = null;
	this.alien_plasma_display = null;
	this.alien_queen_finder = null;
	this.deity_power_display = null;
	this.deity_follower_display = null;
	this.nightvisionicon = null;
	if (rt.len(f, this.plane_masters)) {
		thing = null;
		for (thing of each(this.plane_masters)) {
			yield* qdel(rt.index(this.plane_masters, thing));
		}
		this.plane_masters.Cut();
	}
	if (rt.len(f, this.screenoverlays)) {
		thing = null;
		for (thing of each(this.screenoverlays)) {
			yield* qdel(thing);
		}
		this.screenoverlays.Cut();
	}
	this.mymob = null;
	return (yield* parent_proc());
}, true);

// hud.dm:138
rt.def("/mob/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud"), this));
	yield* this.update_sight();
	return f.dot;
}, true);

// hud.dm:144
rt.def("/datum/hud/proc/show_hud", function* show_hud(f: Frame, version: Value, viewmob: Value) {
	let screenmob: Value = null, display_hud_version: Value = null, h: Value = null, hand: Value = null, thing: Value = null;
	let $e: any;
	version ??= 0;
	if (!ismob(this.mymob)) {
		return 0;
	}
	if (!(screenmob = (viewmob || this.mymob)).client) {
		return 0;
	}
	screenmob.client.screen = list();
	if (!(display_hud_version = version)) {
		display_hud_version = this.hud_version + 1;
	}
	if (display_hud_version > HUD_VERSIONS) {
		display_hud_version = 1;
	}
	if (display_hud_version === HUD_STYLE_STANDARD) {
		this.hud_shown = 1;
		if (rt.len(f, this.static_inventory)) {
			screenmob.client.screen += this.static_inventory;
		}
		if (rt.len(f, this.toggleable_inventory) && screenmob.hud_used && screenmob.hud_used.inventory_shown) {
			screenmob.client.screen += this.toggleable_inventory;
		}
		if (rt.len(f, this.hotkeybuttons) && !this.hotkey_ui_hidden) {
			screenmob.client.screen += this.hotkeybuttons;
		}
		if (rt.len(f, this.infodisplay)) {
			screenmob.client.screen += this.infodisplay;
		}
		screenmob.client.screen += this.hide_actions_toggle;
		if (this.action_intent) {
			this.action_intent.screen_loc = rt.initial(f, this.action_intent, "screen_loc");
		}
	} else if (display_hud_version === HUD_STYLE_REDUCED) {
		this.hud_shown = 0;
		if (rt.len(f, this.static_inventory)) {
			screenmob.client.screen -= this.static_inventory;
		}
		if (rt.len(f, this.toggleable_inventory)) {
			screenmob.client.screen -= this.toggleable_inventory;
		}
		if (rt.len(f, this.hotkeybuttons)) {
			screenmob.client.screen -= this.hotkeybuttons;
		}
		if (rt.len(f, this.infodisplay)) {
			screenmob.client.screen += this.infodisplay;
		}
		for (h of each(this.hand_slots)) {
			if (hand = rt.index(this.hand_slots, h)) {
				screenmob.client.screen += hand;
			}
		}
		if (this.action_intent) {
			screenmob.client.screen += this.action_intent;
			this.action_intent.screen_loc = "EAST-1:28,SOUTH:5";
		}
	} else if (display_hud_version === HUD_STYLE_NOHUD) {
		this.hud_shown = 0;
		if (rt.len(f, this.static_inventory)) {
			screenmob.client.screen -= this.static_inventory;
		}
		if (rt.len(f, this.toggleable_inventory)) {
			screenmob.client.screen -= this.toggleable_inventory;
		}
		if (rt.len(f, this.hotkeybuttons)) {
			screenmob.client.screen -= this.hotkeybuttons;
		}
		if (rt.len(f, this.infodisplay)) {
			screenmob.client.screen -= this.infodisplay;
		}
	}
	for (thing of each(this.plane_masters)) {
		screenmob.client.screen += rt.index(this.plane_masters, thing);
	}
	this.hud_version = display_hud_version;
	this.persistent_inventory_update(screenmob);
	yield* this.mymob.update_action_buttons(1);
	this.reorganize_alerts();
	this.mymob.reload_fullscreen();
	yield* this.update_parallax_pref(screenmob);
	return f.dot;
}, true);

// hud.dm:217
rt.def("/datum/hud/human/proc/show_hud", function* show_hud(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	this.hidden_inventory_update(f.args[1]);
	return f.dot;
}, true, { args: ["version", "viewmob"] });

// hud.dm:221
rt.def("/datum/hud/robot/proc/show_hud", function* show_hud(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	this.update_robot_modules_display();
	return f.dot;
}, true, { args: ["version", "viewmob"] });

// hud.dm:228
rt.def("/datum/hud/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame, viewer: Value) {
	if (this.mymob) return f.dot;
	return f.dot;
});

// hud.dm:236
rt.def("/mob/verb/button_pressed_F12", function* button_pressed_F12(f: Frame) {
	if (this.hud_used && this.client) {
		yield* this.hud_used.show_hud();
		to_chat(f.usr, "<span class ='info'>Switched HUD mode. Press F12 to toggle.</span>");
	} else {
		to_chat(f.usr, "<span class ='warning'>This mob type does not use a HUD.</span>");
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "F12" } });

// hud.dm:247
rt.def("/datum/hud/proc/build_hand_slots", function* build_hand_slots(f: Frame, ui_style: Value) {
	let h: Value = null, H: Value = null, hand_box: Value = null, i: Value = null, SH: Value = null, E: Value = null;
	let $e: any;
	ui_style ??= rt.rsc("icons/mob/screen_midnight.dmi");
	for (h of each(this.hand_slots)) {
		if (H = rt.index(this.hand_slots, h)) {
			this.static_inventory -= H;
		}
	}
	this.hand_slots = list();
	rt.forRange(f, 0, 1, rt.len(f, this.mymob.held_items), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(hand_box = (yield* new_(T("/obj/screen/inventory/hand")))).name = this.mymob.get_held_index_name(i);
		hand_box.icon = ui_style;
		hand_box.icon_state = `hand_${this.mymob.held_index_to_dir(i)}`;
		hand_box.screen_loc = ui_hand_position(i);
		hand_box.held_index = i;
		rt.setAt(this.hand_slots, `${i}`, hand_box);
		hand_box.hud = this;
		this.static_inventory += hand_box;
		yield* hand_box.update_icon();
	}
	rt.endFor(f, 0);
	i = 1;
	for (SH of each(this.static_inventory, T("/obj/screen/swap_hand"))) {
		SH.screen_loc = ui_swaphand_position(this.mymob, !(i % 2) ? 2 : 1);
		i++;
	}
	for (E of each(this.static_inventory, T("/obj/screen/human/equip"))) {
		E.screen_loc = ui_equip_position(this.mymob);
	}
	if (!this.mymob.hud_used) return f.dot;
	yield* this.show_hud(HUD_STYLE_STANDARD, this.mymob);
	return f.dot;
}, true);
