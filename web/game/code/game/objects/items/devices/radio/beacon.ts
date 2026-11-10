// Based on /tg/station's code/game/objects/items/devices/radio/beacon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9204, "/obj/item/device/radio/beacon", "/obj/item/device/radio", {
	code: "electronic",
	name: "tracking beacon",
	desc: "A beacon used by a teleporter.",
	icon_state: "beacon",
	item_state: "beacon",
	origin_tech: "bluespace=1",
	dog_fashion: null,
});

// beacon.dm:11
rt.def("/obj/item/device/radio/beacon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.teleportbeacons += this;
	return f.dot;
}, true);

// beacon.dm:15
rt.def("/obj/item/device/radio/beacon/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.teleportbeacons.Remove(this);
	return (yield* parent_proc());
}, true);

// beacon.dm:30
rt.def("/obj/item/device/radio/beacon/verb/alter_signal", function* alter_signal(f: Frame, t: Value) {
	if (f.usr.canmove && !f.usr.restrained()) {
		this.code = t;
	}
	if (!this.code) {
		this.code = "beacon";
	}
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true, { verb: { name: "Alter Beacon's Signal", category: "Object", src: 11 }, argTypes: [{ type: 2 }] });
