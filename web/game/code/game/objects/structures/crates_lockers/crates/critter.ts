// Based on /tg/station's code/game/objects/structures/crates_lockers/crates/critter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12267, "/obj/structure/closet/crate/critter", "/obj/structure/closet/crate", {
	tank: null,
	horizontal: 0,
	allow_objects: 0,
	breakout_time: 1,
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	material_drop_amount: 4,
	delivery_icon: "deliverybox",
	name: "critter crate",
	desc: "A crate designed for safe transport of animals. It has an oxygen tank for safe transport in space.",
	icon_state: "crittercrate",
});

// critter.dm:14
rt.def("/obj/structure/closet/crate/critter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.tank = (yield* new_(T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
}, true);

// critter.dm:18
rt.def("/obj/structure/closet/crate/critter/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = rt.getStep(f, this, 0);
	if (this.tank) {
		yield* this.tank.forceMove(_T);
		this.tank = null;
	}
	return (yield* parent_proc());
}, true);

// critter.dm:26
rt.def("/obj/structure/closet/crate/critter/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.opened) {
		this.add_overlay("crittercrate_door_open");
	} else {
		this.add_overlay("crittercrate_door");
		if (!this.manifest) return f.dot;
		this.add_overlay("manifest");
	}
	return f.dot;
});

// critter.dm:36
rt.def("/obj/structure/closet/crate/critter/proc/return_air", function return_air(f: Frame) {
	if (this.tank) {
		return this.tank.air_contents;
	}
	return this.loc.return_air();
});
