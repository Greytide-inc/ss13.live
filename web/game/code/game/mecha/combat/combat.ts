// Based on /tg/station's code/game/mecha/combat/combat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(12103, "/obj/mecha/combat", "/obj/mecha", {
	internal_damage_threshold: 50,
	force: 30,
	armor: null,
});

// combat.dm:4
rt.def("/obj/mecha/combat/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 15, "energy", 20, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
}, true);

// combat.dm:7
rt.def("/obj/mecha/combat/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	yield* parent_proc();
	let C: Value = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), this.contents);
	let SM: Value = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), this.contents);
	this.step_energy_drain = 20 - 5 * SM.rating;
	rt.modAt(this.armor, "energy", C.rating * 10, add);
	yield* qdel(C);
	yield* qdel(SM);
	return f.dot;
}, true);

// combat.dm:16
rt.def("/obj/mecha/combat/proc/moved_inside", function* moved_inside(f: Frame, H: Value) {
	if (yield* parent_proc()) {
		if (H.client && H.client.mouse_pointer_icon == rt.initial(f, H.client, "mouse_pointer_icon")) {
			H.client.mouse_pointer_icon = rt.rsc("icons/mecha/mecha_mouse.dmi");
		}
		return 1;
	} else {
		return 0;
	}
}, true);

// combat.dm:24
rt.def("/obj/mecha/combat/proc/mmi_moved_inside", function* mmi_moved_inside(f: Frame, mmi_as_oc: Value, user: Value) {
	if (yield* parent_proc()) {
		if (this.occupant.client && this.occupant.client.mouse_pointer_icon == rt.initial(f, this.occupant.client, "mouse_pointer_icon")) {
			this.occupant.client.mouse_pointer_icon = rt.rsc("icons/mecha/mecha_mouse.dmi");
		}
		return 1;
	} else {
		return 0;
	}
}, true);

// combat.dm:33
rt.def("/obj/mecha/combat/proc/go_out", function* go_out(f: Frame) {
	if (this.occupant && this.occupant.client && this.occupant.client.mouse_pointer_icon == rt.rsc("icons/mecha/mecha_mouse.dmi")) {
		this.occupant.client.mouse_pointer_icon = rt.initial(f, this.occupant.client, "mouse_pointer_icon");
	}
	yield* parent_proc();
	return f.dot;
}, true);
