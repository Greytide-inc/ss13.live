// Based on /tg/station's code/game/machinery/gulag_item_reclaimer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract, fmt } = rt;


rt.type(10794, "/obj/machinery/gulag_item_reclaimer", "/obj/machinery", {
	stored_items: null,
	inserted_id: null,
	linked_teleporter: null,
	anchored: 1,
	name: "equipment reclaimer station",
	desc: "Used to reclaim your items after you finish your sentence at the labor camp",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_taken",
	req_access: null,
	density: 0,
	use_power: 1,
	idle_power_usage: 100,
	active_power_usage: 2500,
});

// gulag_item_reclaimer.dm:12
rt.def("/obj/machinery/gulag_item_reclaimer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_items = list();

	this.req_access = list(1);
	return f.dot;
});

// gulag_item_reclaimer.dm:17
rt.def("/obj/machinery/gulag_item_reclaimer/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null, I: Value = null;
	for (i of each(this.contents)) {
		yield* (I = i).forceMove(rt.getStep(f, this, 0));
	}
	if (this.linked_teleporter) {
		this.linked_teleporter.linked_reclaimer = null;
	}
	if (this.inserted_id) {
		yield* this.inserted_id.forceMove(rt.getStep(f, this, 0));
		this.inserted_id = null;
	}
	return (yield* parent_proc());
}, true);

// gulag_item_reclaimer.dm:28
rt.def("/obj/machinery/gulag_item_reclaimer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.req_access = list();
	this.emagged = 1;
	return f.dot;
});

// gulag_item_reclaimer.dm:33
rt.def("/obj/machinery/gulag_item_reclaimer/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (rt.istype(I, T("/obj/item/weapon/card/id/prisoner"))) {
		if (!this.inserted_id) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			this.inserted_id = I;
			to_chat(user, `<span class='notice'>You insert ${I}.</span>`);
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>There's an ID inserted already.</span>");
		}
	}
	return (yield* parent_proc());
}, true);

// gulag_item_reclaimer.dm:47
rt.def("/obj/machinery/gulag_item_reclaimer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "gulag_item_reclaimer", this.name, 455, 440, master_ui, state))).open();
	return f.dot;
}, true);

// gulag_item_reclaimer.dm:53
rt.def("/obj/machinery/gulag_item_reclaimer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let i: Value = null, thismob: Value = null, mob_info: Value = null;
	let data: Value = list();
	let can_reclaim: Value = 0;
	if (this.allowed(user)) {
		can_reclaim = 1;
	}
	if (this.inserted_id) {
		rt.setAt(data, "id", this.inserted_id);
		rt.setAt(data, "id_name", this.inserted_id.registered_name);
		if (this.inserted_id.points >= this.inserted_id.goal) {
			can_reclaim = 1;
		}
	}
	let mobs: Value = list();
	for (i of each(this.stored_items)) {
		thismob = i;
		rt.setAt((mob_info = list()), "name", thismob.real_name);
		rt.setAt(mob_info, "mob", fmt("＃", [thismob]));
		mobs += list(mob_info);
	}
	rt.setAt(data, "mobs", mobs);
	rt.setAt(data, "can_reclaim", can_reclaim);
	return data;
});

// gulag_item_reclaimer.dm:81
rt.def("/obj/machinery/gulag_item_reclaimer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let I: Value = null, M: Value = null;
	// An href can reach this with the window closed or out of reach: only an interactive window may act.
	if (!ui || ui.status != 2) {
		return 1;
	}
	if (action === "handle_id") {
		if (this.inserted_id) {
			if (!f.usr.get_active_held_item()) {
				yield* f.usr.put_in_hands(this.inserted_id);
				this.inserted_id = null;
			} else {
				yield* this.inserted_id.forceMove(rt.getStep(f, this, 0));
				this.inserted_id = null;
			}
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id/prisoner"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			this.inserted_id = I;
		}
	} else if (action === "release_items") {
		if ((M = rt.locateIn(f, rt.at(params, "mobref"), rt.world())) == f.usr || (yield* this.allowed(f.usr))) {
			yield* this.drop_items(M);
		} else {
			to_chat(f.usr, "Access denied.");
		}
	}
	return f.dot;
}, true);

// gulag_item_reclaimer.dm:105
rt.def("/obj/machinery/gulag_item_reclaimer/proc/drop_items", function* drop_items(f: Frame, user: Value) {
	let i: Value = null, W: Value = null;
	if (!rt.index(this.stored_items, user)) {
		return f.dot;
	}
	for (i of each(rt.index(this.stored_items, user))) {
		W = i;
		(rt.modAt(this.stored_items, user, W, subtract));
		yield* W.forceMove(rt.getStep(f, this, 0));
	}
	this.stored_items -= user;
	return f.dot;
}, true);
