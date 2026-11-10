// Based on /tg/station's code/game/objects/items/control_wand.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6986, "/obj/item/weapon/door_remote", "/obj/item/weapon", {
	mode: "Open Door",
	region_access: 1,
	ID: null,
	icon_state: "gangtool-white",
	item_state: "electronic",
	icon: rt.rsc("icons/obj/device.dmi"),
	name: "control wand",
	desc: "Remotely controls airlocks.",
	w_class: 1,
});

// control_wand.dm:17
rt.def("/obj/item/weapon/door_remote/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.ID = (yield* new_(T("/obj/item/weapon/card/id")));
	this.ID.access = get_region_accesses(this.region_access);
	return f.dot;
}, true);

// control_wand.dm:22
rt.def("/obj/item/weapon/door_remote/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.mode === "Open Door") {
		this.mode = "Toggle Bolts";
	} else if (this.mode === "Toggle Bolts") {
		this.mode = "Toggle Emergency Access";
	} else if (this.mode === "Toggle Emergency Access") {
		this.mode = "Open Door";
	}
	to_chat(user, `Now in mode: ${this.mode}.`);
	return f.dot;
});

// control_wand.dm:32
rt.def("/obj/item/weapon/door_remote/proc/afterattack", function* afterattack(f: Frame, D: Value, user: Value) {
	if (!rt.istype(D, T("/obj/machinery/door/airlock"))) {
		return f.dot;
	}
	if (!D.hasPower()) {
		to_chat(user, `<span class='danger'>${D} has no power!</span>`);
		return f.dot;
	}
	if (!D.requiresID()) {
		to_chat(user, `<span class='danger'>${D}'s ID scan is disabled!</span>`);
		return f.dot;
	}
	if (D.check_access(this.ID) && D.canAIControl(user)) {
		if (this.mode === "Open Door") {
			if (D.density) {
				yield* D.open();
			} else {
				yield* D.close();
			}
		} else if (this.mode === "Toggle Bolts") {
			if (D.locked) {
				D.unbolt();
			} else {
				D.bolt();
			}
		} else if (this.mode === "Toggle Emergency Access") {
			if (D.emergency) {
				D.emergency = 0;
			} else {
				D.emergency = 1;
			}
			yield* D.update_icon();
		}
	} else {
		to_chat(user, `<span class='danger'>${this} does not have access to this door.</span>`);
	}
	return f.dot;
}, true);
