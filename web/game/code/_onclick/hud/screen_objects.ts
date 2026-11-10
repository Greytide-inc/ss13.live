// Based on /tg/station's code/_onclick/hud/screen_objects.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10999, "/obj/screen", "/obj", {
	master: null,
	hud: null,
	name: "",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	layer: 20,
	plane: 20,
	resistance_flags: 115,
	appearance_flags: 26,
});

// screen_objects.dm:25
rt.def("/obj/screen/proc/Destroy", function* Destroy(f: Frame) {
	this.master = null;
	this.hud = null;
	return (yield* parent_proc());
}, true);

rt.type(11156, "/obj/screen/swap_hand", "/obj/screen", {
	layer: 19,
	plane: 19,
	name: "swap hand",
});

// screen_objects.dm:49
rt.def("/obj/screen/swap_hand/proc/Click", function Click(f: Frame) {
	let M: Value = null;
	if (rt.worldTime(f) <= f.usr.next_move) {
		return 1;
	}
	if (f.usr.incapacitated()) {
		return 1;
	}
	if (ismob(f.usr)) {
		(M = f.usr).swap_hand();
	}
	return 1;
});

rt.type(11157, "/obj/screen/craft", "/obj/screen", {
	name: "crafting menu",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "craft",
	screen_loc: "EAST-4:22,SOUTH:5",
});

// screen_objects.dm:67
rt.def("/obj/screen/craft/proc/Click", function* Click(f: Frame) {
	let M: Value = f.usr;
	if (rt.istype(f.usr, T("/mob/dead/observer"))) {
		return f.dot;
	}
	yield* M.OpenCraftingMenu();
	return f.dot;
}, true);

rt.type(11158, "/obj/screen/area_creator", "/obj/screen", {
	name: "create new area",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "area_edit",
	screen_loc: "EAST-4:22,SOUTH:21",
});

// screen_objects.dm:79
rt.def("/obj/screen/area_creator/proc/Click", function* Click(f: Frame) {
	let A: Value = null;
	if (f.usr.incapacitated()) {
		return 1;
	}
	if (!(A = get_area(f.usr)).outdoors) {
		to_chat(f.usr, "<span class='warning'>There is already a defined structure here.</span>");
		return 1;
	}
	yield* create_area(f.usr);
	return f.dot;
}, true);

rt.type(11159, "/obj/screen/language_menu", "/obj/screen", {
	name: "language menu",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "talk_wheel",
	screen_loc: "EAST-4:6,SOUTH+1:-11",
});

// screen_objects.dm:94
rt.def("/obj/screen/language_menu/proc/Click", function* Click(f: Frame) {
	let H: Value = null;
	let M: Value = f.usr;
	yield* (H = (yield* M.get_language_holder())).open_language_menu(f.usr);
	return f.dot;
}, true);

rt.type(11160, "/obj/screen/inventory", "/obj/screen", {
	slot_id: null,
	icon_empty: null,
	icon_full: null,
	layer: 19,
	plane: 19,
});

// screen_objects.dm:108
rt.def("/obj/screen/inventory/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let inv_item: Value = null;
	if (rt.worldTime(f) <= f.usr.next_move) {
		return 1;
	}
	if (f.usr.incapacitated()) {
		return 1;
	}
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return 1;
	}
	if (this.hud && this.hud.mymob && this.slot_id) {
		if (inv_item = this.hud.mymob.get_item_by_slot(this.slot_id)) {
			return (yield* inv_item.Click(location, control, params));
		}
	}
	if (yield* f.usr.attack_ui(this.slot_id)) {
		yield* f.usr.update_inv_hands();
	}
	return 1;
}, true);

// screen_objects.dm:126
rt.def("/obj/screen/inventory/proc/update_icon", function update_icon(f: Frame) {
	if (!this.icon_empty) {
		this.icon_empty = this.icon_state;
	}
	if (!(this.hud && this.hud.mymob && this.slot_id && this.icon_full)) return f.dot;
	if (this.hud.mymob.get_item_by_slot(this.slot_id)) {
		this.icon_state = this.icon_full;
	} else {
		this.icon_state = this.icon_empty;
	}
	return f.dot;
});

rt.type(11161, "/obj/screen/inventory/hand", "/obj/screen/inventory", {
	handcuff_overlay: null,
	held_index: 0,
}, { global: { blocked_overlay: 774 } });

// screen_objects.dm:141
rt.def("/obj/screen/inventory/hand/proc/update_icon", function update_icon(f: Frame) {
	let state: Value = null, C: Value = null;
	parent_proc();
	if (!this.handcuff_overlay) {
		state = !(this.held_index % 2) ? "markus" : "gabrielle";
		this.handcuff_overlay = mutable_appearance(rt.rsc("icons/mob/screen_gen.dmi"), state);
	}
	this.cut_overlays();
	if (!(this.hud && this.hud.mymob)) return f.dot;
	if (rt.istype(this.hud.mymob, T("/mob/living/carbon"))) {
		if ((C = this.hud.mymob).handcuffed) {
			this.add_overlay(this.handcuff_overlay);
		}
		if (this.held_index) {
			if (!C.has_hand_for_held_index(this.held_index)) {
				this.add_overlay(GLOB.blocked_overlay);
			}
		}
	}
	if (this.held_index != this.hud.mymob.active_hand_index) return f.dot;
	this.add_overlay("hand_active");
	return f.dot;
});

// screen_objects.dm:166
rt.def("/obj/screen/inventory/hand/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let I: Value = null;
	if (rt.worldTime(f) <= f.usr.next_move) {
		return 1;
	}
	if (f.usr.incapacitated() || rt.istype(f.usr, T("/mob/dead/observer"))) {
		return 1;
	}
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return 1;
	}
	if (this.hud.mymob.active_hand_index == this.held_index) {
		if (I = this.hud.mymob.get_active_held_item()) {
			yield* I.Click(location, control, params);
		}
	} else {
		this.hud.mymob.swap_hand(this.held_index);
	}
	return 1;
}, true);

rt.type(11162, "/obj/screen/close", "/obj/screen", {
	name: "close",
});

// screen_objects.dm:185
rt.def("/obj/screen/close/proc/Click", function Click(f: Frame) {
	let S: Value = null;
	if (rt.istype(this.master, T("/obj/item/weapon/storage"))) {
		(S = this.master).close(f.usr);
	}
	return 1;
});

rt.type(11163, "/obj/screen/drop", "/obj/screen", {
	name: "drop",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "act_drop",
	layer: 19,
	plane: 19,
});

// screen_objects.dm:199
rt.def("/obj/screen/drop/proc/Click", function* Click(f: Frame) {
	yield* f.usr.drop_item_v();
	return f.dot;
}, true);

rt.type(11164, "/obj/screen/act_intent", "/obj/screen", {
	name: "intent",
	icon_state: "help",
	screen_loc: "EAST-3:24,SOUTH:5",
});

// screen_objects.dm:207
rt.def("/obj/screen/act_intent/proc/Click", function Click(f: Frame, location: Value, control: Value, params: Value) {
	f.usr.a_intent_change("right");
	return f.dot;
});

rt.type(11165, "/obj/screen/act_intent/segmented", "/obj/screen/act_intent", {});

// screen_objects.dm:210
rt.def("/obj/screen/act_intent/segmented/proc/Click", function Click(f: Frame, location: Value, control: Value, params: Value) {
	let _x: Value = null, _y: Value = null;
	if (rt.bitAnd(f.usr.client.prefs.toggles, 32)) {
		_x = text2num(rt.index(params2list(params), "icon-x"));
		_y = text2num(rt.index(params2list(params), "icon-y"));
		if (_x <= 16 && _y <= 16) {
			f.usr.a_intent_change("harm");
		} else if (_x <= 16 && _y >= 17) {
			f.usr.a_intent_change("help");
		} else if (_x >= 17 && _y <= 16) {
			f.usr.a_intent_change("grab");
		} else if (_x >= 17 && _y >= 17) {
			f.usr.a_intent_change("disarm");
		}
	} else {
		return parent_proc();
	}
	return f.dot;
}, false);

rt.type(11168, "/obj/screen/internals", "/obj/screen", {
	name: "toggle internals",
	icon_state: "internal0",
	screen_loc: "EAST-1:28,CENTER:17",
});

// screen_objects.dm:242
rt.def("/obj/screen/internals/proc/Click", function* Click(f: Frame) {
	let C: Value = null, M: Value = null, I: Value = null, H: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if ((C = f.usr).incapacitated()) {
		return f.dot;
	}
	if (C.internal) {
		C.internal = null;
		to_chat(C, "<span class='notice'>You are no longer running on internals.</span>");
		this.icon_state = "internal0";
	} else {
		if (!C.getorganslot("breathing_tube")) {
			if (!rt.istype(C.wear_mask, T("/obj/item/clothing/mask"))) {
				to_chat(C, "<span class='warning'>You are not wearing an internals mask!</span>");
				return 1;
			} else {
				if ((M = C.wear_mask).mask_adjusted) {
					yield* M.adjustmask(C);
				}
				if (!rt.bitAnd(M.flags, MASKINTERNALS)) {
					to_chat(C, "<span class='warning'>You are not wearing an internals mask!</span>");
					return f.dot;
				}
			}
		}
		if (I = C.is_holding_item_of_type(T("/obj/item/weapon/tank"))) {
			to_chat(C, `<span class='notice'>You are now running on internals from the ${I} on your ${C.get_held_index_name(C.get_held_index_of_item(I))}.</span>`);
			C.internal = I;
		} else if (rt.istype(C, T("/mob/living/carbon/human"))) {
			if (rt.istype((H = C).s_store, T("/obj/item/weapon/tank"))) {
				to_chat(H, `<span class='notice'>You are now running on internals from the ${H.s_store} on your ${H.wear_suit}.</span>`);
				H.internal = H.s_store;
			} else if (rt.istype(H.belt, T("/obj/item/weapon/tank"))) {
				to_chat(H, `<span class='notice'>You are now running on internals from the ${H.belt} on your belt.</span>`);
				H.internal = H.belt;
			} else if (rt.istype(H.l_store, T("/obj/item/weapon/tank"))) {
				to_chat(H, `<span class='notice'>You are now running on internals from the ${H.l_store} in your left pocket.</span>`);
				H.internal = H.l_store;
			} else if (rt.istype(H.r_store, T("/obj/item/weapon/tank"))) {
				to_chat(H, `<span class='notice'>You are now running on internals from the ${H.r_store} in your right pocket.</span>`);
				H.internal = H.r_store;
			}
		}
		if (!C.internal && rt.istype(C.back, T("/obj/item/weapon/tank"))) {
			to_chat(C, `<span class='notice'>You are now running on internals from the ${C.back} on your back.</span>`);
			C.internal = C.back;
		}
		if (C.internal) {
			this.icon_state = "internal1";
		} else {
			to_chat(C, "<span class='warning'>You don't have an oxygen tank!</span>");
			return f.dot;
		}
	}
	yield* C.update_action_buttons_icon();
	return f.dot;
}, true);

rt.type(11169, "/obj/screen/mov_intent", "/obj/screen", {
	name: "run/walk toggle",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "running",
});

// screen_objects.dm:302
rt.def("/obj/screen/mov_intent/proc/Click", function* Click(f: Frame) {
	yield* this.toggle(f.usr);
	return f.dot;
}, true);

// screen_objects.dm:305
rt.def("/obj/screen/mov_intent/proc/toggle", function* toggle(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/dead/observer"))) {
		return f.dot;
	}
	if (user.m_intent === "run") {
		user.m_intent = "walk";
		this.icon_state = "walking";
	} else if (user.m_intent === "walk") {
		user.m_intent = "run";
		this.icon_state = "running";
	}
	yield* user.update_icons();
	return f.dot;
}, true);

rt.type(11170, "/obj/screen/pull", "/obj/screen", {
	name: "stop pulling",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "pull",
});

// screen_objects.dm:322
rt.def("/obj/screen/pull/proc/Click", function* Click(f: Frame) {
	if (rt.istype(f.usr, T("/mob/dead/observer"))) {
		return f.dot;
	}
	yield* f.usr.stop_pulling();
	return f.dot;
}, true);

// screen_objects.dm:327
rt.def("/obj/screen/pull/proc/update_icon", function update_icon(f: Frame, mymob: Value) {
	if (!mymob) {
		return f.dot;
	}
	if (mymob.pulling) {
		this.icon_state = "pull";
	} else {
		this.icon_state = "pull0";
	}
	return f.dot;
});

rt.type(11171, "/obj/screen/resist", "/obj/screen", {
	name: "resist",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "act_resist",
	layer: 19,
	plane: 19,
});

// screen_objects.dm:341
rt.def("/obj/screen/resist/proc/Click", function* Click(f: Frame) {
	let L: Value = null;
	if (!rt.istype(f.usr, T("/mob/living"))) return f.dot;
	yield* (L = f.usr).resist();
	return f.dot;
}, true);

rt.type(11172, "/obj/screen/storage", "/obj/screen", {
	name: "storage",
});

// screen_objects.dm:349
rt.def("/obj/screen/storage/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let I: Value = null;
	if (rt.worldTime(f) <= f.usr.next_move) {
		return 1;
	}
	if (f.usr.stat || f.usr.IsUnconscious() || f.usr.IsKnockdown() || f.usr.IsStun()) {
		return 1;
	}
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return 1;
	}
	if (this.master) {
		if (I = f.usr.get_active_held_item()) {
			yield* this.master.attackby(I, f.usr, params);
		}
	}
	return 1;
}, true);

rt.type(11173, "/obj/screen/throw_catch", "/obj/screen", {
	name: "throw/catch",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "act_throw_off",
});

// screen_objects.dm:367
rt.def("/obj/screen/throw_catch/proc/Click", function Click(f: Frame) {
	let C: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/carbon"))) return f.dot;
	(C = f.usr).toggle_throw_mode();
	return f.dot;
});

rt.type(11174, "/obj/screen/zone_sel", "/obj/screen", {
	selecting: "chest",
	name: "damage zone",
	icon_state: "zone_sel",
	screen_loc: "EAST-1:28,SOUTH:5",
});

// screen_objects.dm:378
rt.def("/obj/screen/zone_sel/proc/Click", function Click(f: Frame, location: Value, control: Value, params: Value) {
	let choice: Value = null;
	if (rt.istype(f.usr, T("/mob/dead/observer"))) {
		return f.dot;
	}
	let PL: Value = params2list(params);
	let icon_x: Value = text2num(rt.at(PL, "icon-x"));
	let icon_y: Value = text2num(rt.at(PL, "icon-y"));
	if (rt.inRange(icon_y, 1, 9)) {
		if (rt.inRange(icon_x, 10, 15)) {
			choice = "r_leg";
		} else if (rt.inRange(icon_x, 17, 22)) {
			choice = "l_leg";
		} else {
			return 1;
		}
	} else if (rt.inRange(icon_y, 10, 13)) {
		if (rt.inRange(icon_x, 8, 11)) {
			choice = "r_arm";
		} else if (rt.inRange(icon_x, 12, 20)) {
			choice = "groin";
		} else if (rt.inRange(icon_x, 21, 24)) {
			choice = "l_arm";
		} else {
			return 1;
		}
	} else if (rt.inRange(icon_y, 14, 22)) {
		if (rt.inRange(icon_x, 8, 11)) {
			choice = "r_arm";
		} else if (rt.inRange(icon_x, 12, 20)) {
			choice = "chest";
		} else if (rt.inRange(icon_x, 21, 24)) {
			choice = "l_arm";
		} else {
			return 1;
		}
	} else if (rt.inRange(icon_y, 23, 30)) {
		if (rt.op(f, "IsInRange", [], [icon_x, 12, 20])) {
			choice = "head";
			if (rt.inRange(icon_y, 23, 24)) {
				if (rt.op(f, "IsInRange", [], [icon_x, 15, 17])) {
					choice = "mouth";
				}
			} else if (icon_y === 26) {
				if (rt.op(f, "IsInRange", [], [icon_x, 14, 18])) {
					choice = "eyes";
				}
			} else if (rt.inRange(icon_y, 25, 27)) {
				if (rt.op(f, "IsInRange", [], [icon_x, 15, 17])) {
					choice = "eyes";
				}
			}
		}
	}
	return this.set_selected_zone(choice, f.usr);
});

// screen_objects.dm:432
rt.def("/obj/screen/zone_sel/proc/set_selected_zone", function set_selected_zone(f: Frame, choice: Value, user: Value) {
	if (rt.istype(user, T("/mob/dead/observer"))) {
		return f.dot;
	}
	if (choice != this.selecting) {
		this.selecting = choice;
		this.update_icon(f.usr);
	}
	return 1;
});

// screen_objects.dm:441
rt.def("/obj/screen/zone_sel/proc/update_icon", function update_icon(f: Frame, user: Value) {
	this.cut_overlays();
	this.add_overlay(mutable_appearance(rt.rsc("icons/mob/screen_gen.dmi"), `${this.selecting}`));
	user.zone_selected = this.selecting;
	return f.dot;
});

rt.type(11175, "/obj/screen/zone_sel/alien", "/obj/screen/zone_sel", {
	icon: rt.rsc("icons/mob/screen_alien.dmi"),
});

// screen_objects.dm:449
rt.def("/obj/screen/zone_sel/alien/proc/update_icon", function update_icon(f: Frame, user: Value) {
	this.cut_overlays();
	this.add_overlay(mutable_appearance(rt.rsc("icons/mob/screen_alien.dmi"), `${this.selecting}`));
	user.zone_selected = this.selecting;
	return f.dot;
});

rt.type(11192, "/obj/screen/splash", "/obj/screen", {
	holder: null,
	icon: rt.rsc("config/title_screens/images/blank.png"),
	icon_state: "",
	screen_loc: "CENTER-7,CENTER-7",
	layer: 21,
	plane: 21,
});

// screen_objects.dm:553
rt.def("/obj/screen/splash/proc/New", function* New(f: Frame, C: Value, visible: Value, use_previous_title: Value) {
	let scale: Value = null;
	this.holder = C;
	if (!visible) {
		this.alpha = 0;
	}
	if (!use_previous_title) {
		if (GLOB.SStitle.icon) {
			this.icon = GLOB.SStitle.icon;
		}
	} else {
		if (!GLOB.SStitle.previous_icon) {
			yield* qdel(this);
			return f.dot;
		}
		this.icon = GLOB.SStitle.previous_icon;
	}
	let actualview: Value = getviewsize(C.view);
	if ((scale = max(rt.index(actualview, 1) / FULLSCREEN_OVERLAY_RESOLUTION_X, rt.index(actualview, 2) / FULLSCREEN_OVERLAY_RESOLUTION_Y)) != 1) {
		this.transform = matrix(scale, 0, 0, 0, scale, 0);
	}
	this.holder.screen += this;
	yield* parent_proc();
	return f.dot;
}, true);

// screen_objects.dm:577
rt.def("/obj/screen/splash/proc/Fade", function* Fade(f: Frame, out: Value, qdel_after: Value) {
	qdel_after ??= 1;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (out) {
		rt.op(f, "Animate", [2, 6], [null, this, "alpha", 0, "time", 30]);
	} else {
		this.alpha = 0;
		rt.op(f, "Animate", [2, 6], [null, this, "alpha", 255, "time", 30]);
	}
	if (!qdel_after) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 30, 8);
	return f.dot;
}, true);

// screen_objects.dm:589
rt.def("/obj/screen/splash/proc/Destroy", function* Destroy(f: Frame) {
	if (this.holder) {
		this.holder.screen -= this;
		this.holder = null;
	}
	return (yield* parent_proc());
}, true);
