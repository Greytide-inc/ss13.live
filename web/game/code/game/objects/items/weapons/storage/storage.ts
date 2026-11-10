// Based on /tg/station's code/game/objects/items/weapons/storage/storage.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5286, "/obj/item/weapon/storage", "/obj/item/weapon", {
	silent: 0,
	max_w_class: 2,
	max_combined_w_class: 14,
	storage_slots: 7,
	boxes: null,
	closer: null,
	use_to_pickup: null,
	display_contents_with_number: null,
	allow_quick_empty: null,
	allow_quick_gather: null,
	collection_mode: 1,
	preposition: "in",
	rustle_jimmies: 1,
	can_hold: null,
	cant_hold: null,
	is_seeing: null,
	name: "storage",
	icon: rt.rsc("icons/obj/storage.dmi"),
	w_class: 3,
});

// storage.dm:13
rt.def("/obj/item/weapon/storage/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = new_(T("/list"));

	this.cant_hold = new_(T("/list"));

	this.is_seeing = new_(T("/list"));
	return f.dot;
});

// storage.dm:31
rt.def("/obj/item/weapon/storage/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let H: Value = null;
	if (!ismob(f.usr)) return f.dot;
	let M: Value = f.usr;
	if (!over_object) {
		return f.dot;
	}
	if (rt.istype(f.usr.loc, T("/obj/mecha"))) {
		return f.dot;
	}
	if (over_object == M && (yield* M.CanReach(this, { view_only: 1 }))) {
		yield* this.orient2hud(M);
		if (M.s_active) {
			yield* M.s_active.close(M);
		}
		yield* this.show_to(M);
		return f.dot;
	}
	if (M.incapacitated()) return f.dot;
	if (!rt.istype(over_object, T("/obj/screen"))) {
		return (yield* this.content_can_dump(over_object, M));
	}
	if (this.loc != f.usr || this.loc && this.loc.loc == f.usr) {
		return f.dot;
	}
	playsound(this.loc, "rustle", 50, 1, -5);
	if (rt.istype(over_object, T("/obj/screen/inventory/hand"))) {
		H = over_object;
		yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	}
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// storage.dm:65
rt.def("/obj/item/weapon/storage/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, O: Value, user: Value) {
	let L: Value = null;
	if (!rt.istype(O, T("/obj/item"))) return f.dot;
	let I: Value = O;
	if (!(rt.istype(user, T("/mob/living/carbon")) || rt.istype(user, T("/mob/living/simple_animal/drone")))) return f.dot;
	if (!(!(L = user).incapacitated() && I == L.get_active_held_item())) return f.dot;
	if (!this.can_be_inserted(I, 0)) return f.dot;
	yield* this.handle_item_insertion(I, 0, L);
	return f.dot;
}, true);

// storage.dm:76
rt.def("/obj/item/weapon/storage/proc/content_can_dump", function* content_can_dump(f: Frame, dest_object: Value, user: Value) {
	if (this.Adjacent(user) && dest_object.Adjacent(user)) {
		if (yield* dest_object.storage_contents_dump_act(this, user)) {
			playsound(this.loc, "rustle", 50, 1, -5);
			return 1;
		}
	}
	return 0;
}, true);

// storage.dm:84
rt.def("/obj/item/weapon/storage/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let things: Value = (yield* src_object.contents.Copy());
	let progress: Value = (yield* new_(T("/datum/progressbar"), user, rt.len(f, things), this));
	while (yield* do_after(user, 10, 1, this, 0, (yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/storage/proc/handle_mass_item_insertion"), things, src_object, user, progress)))) {
		yield* sleep(1);
	}
	yield* qdel(progress);
	yield* this.orient2hud(user);
	yield* src_object.orient2hud(user);
	if (user.s_active) {
		yield* user.s_active.close(user);
		yield* user.s_active.show_to(user);
	}
	return 1;
}, true);

// storage.dm:97
rt.def("/obj/item/weapon/storage/proc/handle_mass_item_insertion", function* handle_mass_item_insertion(f: Frame, things: Value, src_object: Value, user: Value, progress: Value) {
	let I: Value = null;
	for (I of each(things, T("/obj/item"))) {
		things -= I;
		if (I.loc != src_object) {
			continue;
		}
		if (user.s_active != src_object) {
			if (yield* I.on_found(user)) {
				break;
			}
		}
		if (this.can_be_inserted(I, 0, user)) {
			yield* this.handle_item_insertion(I, 1, user);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* progress.update(progress.goal - rt.len(f, things));
			return 1;
		}
	}
	yield* progress.update(progress.goal - rt.len(f, things));
	return 0;
}, true, { argTypes: [{ path: "/list" }, { type: 4, path: "/obj/item/weapon/storage" }, { type: 8, path: "/mob" }, { path: "/datum/progressbar" }] });

// storage.dm:114
rt.def("/obj/item/weapon/storage/proc/return_inv", function return_inv(f: Frame) {
	let S: Value = null;
	let L: Value = list();
	L += this.contents;
	for (S of each(this, T("/obj/item/weapon/storage"))) {
		L += S.return_inv();
	}
	return L;
});

// storage.dm:123
rt.def("/obj/item/weapon/storage/proc/show_to", function* show_to(f: Frame, user: Value) {
	let I: Value = null;
	if (!user.client) {
		return f.dot;
	}
	if (user.s_active != this && user.stat == 0) {
		for (I of each(this, T("/obj/item"))) {
			if (yield* I.on_found(user)) {
				return f.dot;
			}
		}
	}
	if (user.s_active) {
		user.s_active.hide_from(user);
	}
	(rt.modField(f, user.client, "screen", this.boxes, rt.bitOr));
	(rt.modField(f, user.client, "screen", this.closer, rt.bitOr));
	(rt.modField(f, user.client, "screen", this.contents, rt.bitOr));
	user.s_active = this;
	(rt.modSrcVar(f, "is_seeing", user, rt.bitOr));
	return f.dot;
}, true);

// storage.dm:139
rt.def("/obj/item/weapon/storage/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	this.close_all();
	return (yield* parent_proc());
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// storage.dm:143
rt.def("/obj/item/weapon/storage/proc/hide_from", function hide_from(f: Frame, user: Value) {
	if (!user.client) {
		return f.dot;
	}
	user.client.screen -= this.boxes;
	user.client.screen -= this.closer;
	user.client.screen -= this.contents;
	if (user.s_active == this) {
		user.s_active = null;
	}
	this.is_seeing -= user;
	return f.dot;
});

// storage.dm:154
rt.def("/obj/item/weapon/storage/proc/can_see_contents", function can_see_contents(f: Frame) {
	let M: Value = null;
	let cansee: Value = list();
	for (M of each(this.is_seeing, T("/mob"))) {
		if (M.s_active == this && M.client) {
			(cansee = rt.modify(cansee, M, rt.bitOr));
		} else {
			this.is_seeing -= M;
		}
	}
	return cansee;
});

// storage.dm:164
rt.def("/obj/item/weapon/storage/proc/close", function close(f: Frame, user: Value) {
	this.hide_from(user);
	user.s_active = null;
	return f.dot;
});

// storage.dm:169
rt.def("/obj/item/weapon/storage/proc/close_all", function close_all(f: Frame) {
	let M: Value = null;
	for (M of each(this.can_see_contents(), T("/mob"))) {
		this.close(M);
		f.dot = 1;
	}
	return f.dot;
});

// storage.dm:194
rt.def("/obj/item/weapon/storage/proc/standard_orient_objs", function standard_orient_objs(f: Frame, rows: Value, cols: Value, display_contents: Value) {
	let ND: Value = null, O: Value = null;
	let $e: any;
	let cx: Value = 4;
	let cy: Value = 2 + rows;
	this.boxes.screen_loc = `4:16,2:16 to ${4 + cols}:16,${2 + rows}:16`;
	if (this.display_contents_with_number) {
		for (ND of each(display_contents, T("/datum/numbered_display"))) {
			ND.sample_object.mouse_opacity = 2;
			ND.sample_object.screen_loc = `${cx}:16,${cy}:16`;
			ND.sample_object.maptext = `<font color='white'>${ND.number > 1 ? `${ND.number}` : ""}</font>`;
			ND.sample_object.layer = ABOVE_HUD_LAYER;
			ND.sample_object.plane = ABOVE_HUD_PLANE;
			cx++;
			if (cx > 4 + cols) {
				cx = 4;
				cy--;
			}
		}
	} else {
		for (O of each(this.contents, T("/obj"))) {
			O.mouse_opacity = 2;
			O.screen_loc = `${cx}:16,${cy}:16`;
			O.maptext = "";
			O.layer = ABOVE_HUD_LAYER;
			O.plane = ABOVE_HUD_PLANE;
			cx++;
			if (cx > 4 + cols) {
				cx = 4;
				cy--;
			}
		}
	}
	this.closer.screen_loc = `${4 + cols + 1}:16,2:16`;
	return f.dot;
});

rt.type(1804, "/datum/numbered_display", "/datum", {
	sample_object: null,
	number: null,
});

// storage.dm:227
rt.def("/datum/numbered_display/proc/New", function* New(f: Frame, sample: Value) {
	if (!rt.istype(sample, T("/obj/item"))) {
		yield* qdel(this);
	}
	this.sample_object = sample;
	this.number = 1;
	return f.dot;
}, true);

// storage.dm:240
rt.def("/obj/item/weapon/storage/proc/orient2hud", function* orient2hud(f: Frame, user: Value) {
	let numbered_contents: Value = null, I: Value = null, found: Value = null, ND: Value = null;
	let adjusted_contents: Value = rt.len(f, this.contents);
	if (this.display_contents_with_number) {
		numbered_contents = list();
		adjusted_contents = 0;
		for (I of each(this.contents, T("/obj/item"))) {
			found = 0;
			ND = null;
			for (ND of each(numbered_contents, T("/datum/numbered_display"))) {
				if (ND.sample_object.type == I.type) {
					ND.number++;
					found = 1;
					break;
				}
			}
			if (!found) {
				adjusted_contents++;
				numbered_contents.Add((yield* new_(T("/datum/numbered_display"), I)));
			}
		}
	}
	let row_num: Value = 0;
	let col_count: Value = min(7, this.storage_slots) - 1;
	if (adjusted_contents > 7) {
		row_num = round((adjusted_contents - 1) / 7);
	}
	this.standard_orient_objs(row_num, col_count, numbered_contents);
	return f.dot;
}, true);

// storage.dm:264
rt.def("/obj/item/weapon/storage/proc/can_be_inserted", function can_be_inserted(f: Frame, W: Value, stop_messages: Value, user: Value) {
	let I: Value = null;
	stop_messages ??= 0;
	if (!rt.istype(W, T("/obj/item")) || rt.bitAnd(W.flags, ABSTRACT)) {
		return f.dot;
	}
	if (this.loc == W) {
		return 0;
	}
	if (rt.len(f, this.contents) >= this.storage_slots) {
		if (!stop_messages) {
			to_chat(f.usr, `<span class='warning'>${this} is full, make some space!</span>`);
		}
		return 0;
	}
	if (rt.len(f, this.can_hold)) {
		if (!is_type_in_typecache(W, this.can_hold)) {
			if (!stop_messages) {
				to_chat(f.usr, `<span class='warning'>${this} cannot hold ${W}!</span>`);
			}
			return 0;
		}
	}
	if (is_type_in_typecache(W, this.cant_hold)) {
		if (!stop_messages) {
			to_chat(f.usr, `<span class='warning'>${this} cannot hold ${W}!</span>`);
		}
		return 0;
	}
	if (W.w_class > this.max_w_class) {
		if (!stop_messages) {
			to_chat(f.usr, `<span class='warning'>${W} is too big for ${this}!</span>`);
		}
		return 0;
	}
	let sum_w_class: Value = W.w_class;
	for (I of each(this.contents, T("/obj/item"))) {
		sum_w_class += I.w_class;
	}
	if (sum_w_class > this.max_combined_w_class) {
		if (!stop_messages) {
			to_chat(f.usr, `<span class='warning'>${W} won't fit in ${this}, make some space!</span>`);
		}
		return 0;
	}
	if (W.w_class >= this.w_class && rt.istype(W, T("/obj/item/weapon/storage"))) {
		if (!rt.istype(this, T("/obj/item/weapon/storage/backpack/holding"))) {
			if (!stop_messages) {
				to_chat(f.usr, `<span class='warning'>${this} cannot hold ${W} as it's a storage item of the same size!</span>`);
			}
			return 0;
		}
	}
	if (rt.bitAnd(W.flags, NODROP)) {
		to_chat(f.usr, fmt("<span class='warning'>％！ is stuck to your hand, you can't put it in ％！!</span>", [W, this]));
		return 0;
	}
	return 1;
});

// storage.dm:316
rt.def("/obj/item/weapon/storage/proc/handle_item_insertion", function* handle_item_insertion(f: Frame, W: Value, prevent_warning: Value, user: Value) {
	let M: Value = null, observe: Value = null;
	prevent_warning ??= 0;
	if (!rt.istype(W, T("/obj/item"))) {
		return 0;
	}
	if (f.usr) {
		if (!(yield* f.usr.transferItemToLoc(W, this))) {
			return 0;
		}
	} else {
		yield* W.forceMove(this);
	}
	if (this.silent) {
		prevent_warning = 1;
	}
	if (W.pulledby) {
		yield* W.pulledby.stop_pulling();
	}
	W.on_enter_storage(this);
	if (f.usr) {
		if (f.usr.client && f.usr.s_active != this) {
			f.usr.client.screen -= W;
		}
		if (f.usr.observers && rt.len(f, f.usr.observers)) {
			for (M of each(f.usr.observers)) {
				if ((observe = M).client && observe.s_active != this) {
					observe.client.screen -= W;
				}
			}
		}
		yield* this.add_fingerprint(f.usr);
		if (this.rustle_jimmies && !prevent_warning) {
			playsound(this.loc, "rustle", 50, 1, -5);
		}
		if (!prevent_warning) {
			M = null;
			for (M of each(viewers(f.usr, null), T("/mob"))) {
				if (M == f.usr) {
					to_chat(f.usr, `<span class='notice'>You put ${W} ${this.preposition}to ${this}.</span>`);
				} else if (get_dist(M, f.usr) <= 1) {
					M.show_message(`<span class='notice'>${f.usr} puts ${W} ${this.preposition}to ${this}.</span>`, 1);
				} else if (W && W.w_class >= 3) {
					M.show_message(`<span class='notice'>${f.usr} puts ${W} ${this.preposition}to ${this}.</span>`, 1);
				}
			}
		}
		yield* this.orient2hud(f.usr);
		M = null;
		for (M of each(this.can_see_contents(), T("/mob"))) {
			yield* this.show_to(M);
		}
	}
	W.mouse_opacity = 2;
	yield* this.update_icon();
	return 1;
}, true);

// storage.dm:360
rt.def("/obj/item/weapon/storage/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	let F: Value = null, M: Value = null;
	if (!rt.istype(W, T("/obj/item"))) {
		return 0;
	}
	if (rt.istype(this, T("/obj/item/weapon/storage/fancy"))) {
		yield* (F = this).update_icon(1);
	}
	for (M of each(this.can_see_contents(), T("/mob"))) {
		if (M.client) {
			M.client.screen -= W;
		}
	}
	if (ismob(this.loc)) {
		M = this.loc;
		yield* W.dropped(M);
	}
	W.layer = rt.initial(f, W, "layer");
	W.plane = rt.initial(f, W, "plane");
	yield* W.forceMove(new_location);
	M = null;
	for (M of each(this.can_see_contents(), T("/mob"))) {
		yield* this.orient2hud(M);
		yield* this.show_to(M);
	}
	if (W.maptext) {
		W.maptext = "";
	}
	W.on_exit_storage(this);
	yield* this.update_icon();
	W.mouse_opacity = rt.initial(f, W, "mouse_opacity");
	return 1;
}, true);

// storage.dm:390
rt.def("/obj/item/weapon/storage/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	disassembled ??= 1;
	let drop_loc: Value = this.loc;
	if (ismob(this.loc)) {
		drop_loc = rt.getStep(f, this, 0);
	}
	for (I of each(this.contents, T("/obj/item"))) {
		yield* this.remove_from_storage(I, drop_loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// storage.dm:399
rt.def("/obj/item/weapon/storage/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let labeler: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/hand_labeler"))) {
		if ((labeler = W).mode) {
			return 0;
		}
	}
	f.dot = 1;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	if (!this.can_be_inserted(W, 0, user)) {
		if (rt.len(f, this.contents) >= this.storage_slots) {
			return 1;
		}
		return 0;
	}
	yield* this.handle_item_insertion(W, 0, user);
	return f.dot;
}, true);

// storage.dm:417
rt.def("/obj/item/weapon/storage/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, M: Value = null;
	if (user.s_active == this && this.loc == user) {
		yield* user.s_active.close(user);
		yield* this.close(user);
		return f.dot;
	}
	if (this.rustle_jimmies) {
		playsound(this.loc, "rustle", 50, 1, -5);
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((H = user).l_store == this && !H.get_active_held_item()) {
			yield* H.put_in_hands(this);
			H.l_store = null;
			return f.dot;
		}
		if (H.r_store == this && !H.get_active_held_item()) {
			yield* H.put_in_hands(this);
			H.r_store = null;
			return f.dot;
		}
	}
	yield* this.orient2hud(user);
	if (this.loc == user) {
		if (user.s_active) {
			yield* user.s_active.close(user);
		}
		yield* this.show_to(user);
	} else {
		yield* parent_proc();
		for (M of each(range(1), T("/mob"))) {
			if (M.s_active == this) {
				yield* this.close(M);
			}
		}
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// storage.dm:449
rt.def("/obj/item/weapon/storage/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// storage.dm:455
rt.def("/obj/item/weapon/storage/verb/toggle_gathering_mode", function toggle_gathering_mode(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	this.collection_mode = (this.collection_mode + 1) % 3;
	if (this.collection_mode === 2) {
		to_chat(f.usr, `${this} now picks up all items of a single type at once.`);
	} else if (this.collection_mode === 1) {
		to_chat(f.usr, `${this} now picks up all items in a tile at once.`);
	} else if (this.collection_mode === 0) {
		to_chat(f.usr, `${this} now picks up one item at a time.`);
	}
	return f.dot;
}, false, { verb: { name: "Switch Gathering Method", category: "Object" } });

// storage.dm:472
rt.def("/obj/item/weapon/storage/verb/quick_empty", function* quick_empty(f: Frame) {
	if (!rt.istype(f.usr, T("/mob/living/carbon/human")) && this.loc != f.usr || f.usr.stat || f.usr.restrained() || !f.usr.canmove) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	let things: Value = (yield* this.contents.Copy());
	let progress: Value = (yield* new_(T("/datum/progressbar"), f.usr, rt.len(f, things), _T));
	while (yield* do_after(f.usr, 10, 1, _T, 0, (yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/storage/proc/mass_remove_from_storage"), _T, things, progress)))) {
		yield* sleep(1);
	}
	yield* qdel(progress);
	return f.dot;
}, true, { verb: { name: "Empty Contents", category: "Object" } });

// storage.dm:482
rt.def("/obj/item/weapon/storage/proc/mass_remove_from_storage", function* mass_remove_from_storage(f: Frame, target: Value, things: Value, progress: Value) {
	let I: Value = null;
	for (I of each(things, T("/obj/item"))) {
		things -= I;
		if (I.loc != this) {
			continue;
		}
		yield* this.remove_from_storage(I, target);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* progress.update(progress.goal - rt.len(f, things));
			return 1;
		}
	}
	yield* progress.update(progress.goal - rt.len(f, things));
	return 0;
}, true, { argTypes: [{ path: "/atom" }, { path: "/list" }, { path: "/datum/progressbar" }] });

// storage.dm:496
rt.def("/obj/item/weapon/storage/proc/do_quick_empty", function* do_quick_empty(f: Frame) {
	let I: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (f.usr) {
		this.hide_from(f.usr);
	}
	for (I of each(this.contents, T("/obj/item"))) {
		yield* this.remove_from_storage(I, _T);
	}
	return f.dot;
}, true);

// storage.dm:504
rt.def("/obj/item/weapon/storage/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.can_hold = typecacheof(this.can_hold);
	this.cant_hold = typecacheof(this.cant_hold);
	if (this.allow_quick_empty) {
		this.verbs += P("/obj/item/weapon/storage/verb/quick_empty");
	} else {
		this.verbs -= P("/obj/item/weapon/storage/verb/quick_empty");
	}
	if (this.allow_quick_gather) {
		this.verbs += P("/obj/item/weapon/storage/verb/toggle_gathering_mode");
	} else {
		this.verbs -= P("/obj/item/weapon/storage/verb/toggle_gathering_mode");
	}
	this.boxes = (yield* new_(T("/obj/screen/storage")));
	this.boxes.name = "storage";
	this.boxes.master = this;
	this.boxes.icon_state = "block";
	this.boxes.screen_loc = "7,7 to 10,8";
	this.boxes.layer = HUD_LAYER;
	this.boxes.plane = HUD_PLANE;
	this.closer = (yield* new_(T("/obj/screen/close")));
	this.closer.master = this;
	this.closer.icon_state = "backpack_close";
	this.closer.layer = ABOVE_HUD_LAYER;
	this.closer.plane = ABOVE_HUD_PLANE;
	yield* this.orient2hud();
	yield* this.PopulateContents();
	return f.dot;
}, true);

// storage.dm:537
rt.def("/obj/item/weapon/storage/proc/Destroy", function* Destroy(f: Frame) {
	let O: Value = null;
	for (O of each(this.contents, T("/obj"))) {
		O.mouse_opacity = rt.initial(f, O, "mouse_opacity");
	}
	this.close_all();
	yield* qdel(this.boxes);
	yield* qdel(this.closer);
	return (yield* parent_proc());
}, true);

// storage.dm:547
rt.def("/obj/item/weapon/storage/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	if (!rt.istype(this.loc, T("/mob/living"))) {
		for (O of each(this.contents, T("/obj"))) {
			yield* O.emp_act(severity);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// storage.dm:555
rt.def("/obj/item/weapon/storage/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (user.get_active_held_item() != this) return f.dot;
	if (!this.verbs.Find(P("/obj/item/weapon/storage/verb/quick_empty"))) return f.dot;
	yield* this.quick_empty();
	return f.dot;
}, true);

// storage.dm:560
rt.def("/obj/item/weapon/storage/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	if (!rt.isIn(f, A, this.contents)) return f.dot;
	f.usr = null;
	yield* this.remove_from_storage(A, null);
	return f.dot;
}, true);

// storage.dm:565
rt.def("/obj/item/weapon/storage/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let A: Value = null;
	for (A of each(this.contents, T("/atom"))) {
		yield* A.ex_act(severity, target);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);
