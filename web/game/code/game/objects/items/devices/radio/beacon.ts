// From code/game/objects/items/devices/radio/beacon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9204, "/obj/item/device/radio/beacon", "/obj/item/device/radio", {
	code: "electronic",
	name: "tracking beacon",
	desc: "A beacon used by a teleporter.",
	icon_state: "beacon",
	item_state: "beacon",
	origin_tech: "bluespace=1",
	dog_fashion: null,
});

// /obj/item/device/radio/beacon/proc/Initialize  (code/game/objects/items/devices/radio/beacon.dm:11)  may sleep
rt.def("/obj/item/device/radio/beacon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("teleportbeacons", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/radio/beacon/proc/Destroy  (code/game/objects/items/devices/radio/beacon.dm:15)  may sleep
rt.def("/obj/item/device/radio/beacon/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("teleportbeacons"), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/radio/beacon/proc/send_hear  (code/game/objects/items/devices/radio/beacon.dm:22)
rt.def("/obj/item/device/radio/beacon/proc/send_hear", function send_hear(f: Frame) {
	return null;
});

// /obj/item/device/radio/beacon/verb/alter_signal  (code/game/objects/items/devices/radio/beacon.dm:30)  may sleep
rt.def("/obj/item/device/radio/beacon/verb/alter_signal", function* alter_signal(f: Frame, t: Value) {
	f.vars = () => [t];
	if ((truthy(rt.fv(f, "canmove", live(f.usr))) && !truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		rt.setFv(f, "code", live(f.src), live(t));
	}
	if (!truthy(rt.fv(f, "code", live(f.src)))) {
		rt.setFv(f, "code", live(f.src), "beacon");
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	return live(f.dot);
}, true, { verb: { name: "Alter Beacon's Signal", category: "Object", src: 11 }, argTypes: [{ type: 2 }] });
