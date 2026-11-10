// Based on /tg/station's code/_onclick/hud/drones.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(70, "/datum/hud/dextrous/drone", "/datum/hud/dextrous", {});

// drones.dm:2
rt.def("/datum/hud/dextrous/drone/proc/New", function* New(f: Frame) {
	let inv_box: Value = null, inv: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* parent_proc();
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "internal storage";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "suit_storage";
	inv_box.screen_loc = "CENTER-2:14,SOUTH:5";
	inv_box.slot_id = slot_generic_dextrous_storage;
	this.static_inventory += inv_box;
	(inv_box = (yield* new_(T("/obj/screen/inventory")))).name = "head/mask";
	inv_box.icon = f.args[1];
	inv_box.icon_state = "mask";
	inv_box.screen_loc = "CENTER-3:14,SOUTH:5";
	inv_box.slot_id = slot_head;
	this.static_inventory += inv_box;
	for (inv of each(this.static_inventory + this.toggleable_inventory, T("/obj/screen/inventory"))) {
		if (inv.slot_id) {
			inv.hud = this;
			rt.setAt(this.inv_slots, inv.slot_id, inv);
			yield* inv.update_icon();
		}
	}
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// drones.dm:31
rt.def("/datum/hud/dextrous/drone/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	if (!this.mymob) {
		return f.dot;
	}
	let D: Value = this.mymob;
	if (this.hud_shown) {
		if (D.internal_storage) {
			D.internal_storage.screen_loc = "CENTER-2:14,SOUTH:5";
			D.client.screen += D.internal_storage;
		}
		if (D.head) {
			D.head.screen_loc = "CENTER-3:14,SOUTH:5";
			D.client.screen += D.head;
		}
	} else {
		if (D.internal_storage) {
			D.internal_storage.screen_loc = null;
		}
		if (D.head) {
			D.head.screen_loc = null;
		}
	}
	parent_proc();
	return f.dot;
});
