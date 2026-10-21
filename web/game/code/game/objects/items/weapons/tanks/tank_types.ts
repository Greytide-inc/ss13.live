// From code/game/objects/items/weapons/tanks/tank_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7456, "/obj/item/weapon/tank/internals/oxygen", "/obj/item/weapon/tank/internals", {
	name: "oxygen tank",
	desc: "A tank of oxygen.",
	icon_state: "oxygen",
	distribute_pressure: 16,
	force: 10,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});

// /obj/item/weapon/tank/internals/oxygen/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:23)  may sleep
rt.def("/obj/item/weapon/tank/internals/oxygen/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["o2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1, divide(multiply(607.949951171875, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);

rt.type(7459, "/obj/item/weapon/tank/internals/anesthetic", "/obj/item/weapon/tank/internals", {
	name: "anesthetic tank",
	desc: "A tank with an N2O/O2 gas mix.",
	icon_state: "anesthetic",
	item_state: "an_tank",
	force: 10,
});

// /obj/item/weapon/tank/internals/anesthetic/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:51)  may sleep
rt.def("/obj/item/weapon/tank/internals/anesthetic/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gases", ["o2", "n2o"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1, multiply(divide(multiply(303.9749755859375, rt.sv(f, "volume")), 2436.07666015625), 0.20999999344348907));
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "n2o"), 1, multiply(divide(multiply(303.9749755859375, rt.sv(f, "volume")), 2436.07666015625), 0.7900000214576721));
	return live(f.dot);
}, true);

rt.type(7460, "/obj/item/weapon/tank/internals/air", "/obj/item/weapon/tank/internals", {
	name: "air tank",
	desc: "Mixed anyone?",
	icon_state: "oxygen",
	force: 10,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});

// /obj/item/weapon/tank/internals/air/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:68)  may sleep
rt.def("/obj/item/weapon/tank/internals/air/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gases", ["o2", "n2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1, multiply(divide(multiply(607.949951171875, rt.sv(f, "volume")), 2436.07666015625), 0.20999999344348907));
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "n2"), 1, multiply(divide(multiply(607.949951171875, rt.sv(f, "volume")), 2436.07666015625), 0.7900000214576721));
	return live(f.dot);
}, true);

rt.type(7461, "/obj/item/weapon/tank/internals/plasma", "/obj/item/weapon/tank/internals", {
	flags: 64,
	name: "plasma tank",
	desc: "Contains dangerous plasma. Do not inhale. Warning: extremely flammable.",
	icon_state: "plasma",
	slot_flags: null,
	force: 8,
});

// /obj/item/weapon/tank/internals/plasma/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:88)  may sleep
rt.def("/obj/item/weapon/tank/internals/plasma/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["plasma"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma"), 1, divide(multiply(303.9749755859375, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);

// /obj/item/weapon/tank/internals/plasma/proc/attackby  (code/game/objects/items/weapons/tanks/tank_types.dm:94)  may sleep
rt.def("/obj/item/weapon/tank/internals/plasma/proc/attackby", function* attackby(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/flamethrower")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "status", (F = live(f.args[0])))) || truthy(rt.fv(f, "ptank", live(F))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.src), live(F)])))) {
			return live(f.dot);
		}
		rt.setFv(f, "master", live(f.src), live(F));
		rt.setFv(f, "ptank", live(F), live(f.src));
		yield* g.callName(f, live(F), "update_icon", []);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(7462, "/obj/item/weapon/tank/internals/plasma/full", "/obj/item/weapon/tank/internals/plasma", {});

// /obj/item/weapon/tank/internals/plasma/full/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:107)  may sleep
rt.def("/obj/item/weapon/tank/internals/plasma/full/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["plasma"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma"), 1, divide(multiply(1013.25, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);

rt.type(7463, "/obj/item/weapon/tank/internals/plasmaman", "/obj/item/weapon/tank/internals", {
	name: "plasma internals tank",
	desc: "A tank of plasma gas designed specifically for use as internals, particularly for plasma-based lifeforms. If you're not a Plasmaman, you probably shouldn't use this.",
	icon_state: "plasmaman_tank",
	item_state: "plasmaman_tank",
	force: 10,
	distribute_pressure: 16,
});

// /obj/item/weapon/tank/internals/plasmaman/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:126)  may sleep
rt.def("/obj/item/weapon/tank/internals/plasmaman/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["plasma"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma"), 1, divide(multiply(303.9749755859375, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);

rt.type(7464, "/obj/item/weapon/tank/internals/plasmaman/full", "/obj/item/weapon/tank/internals/plasmaman", {});

// /obj/item/weapon/tank/internals/plasmaman/full/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:132)  may sleep
rt.def("/obj/item/weapon/tank/internals/plasmaman/full/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["plasma"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma"), 1, divide(multiply(1013.25, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);

rt.type(7466, "/obj/item/weapon/tank/internals/plasmaman/belt/full", "/obj/item/weapon/tank/internals/plasmaman/belt", {});

// /obj/item/weapon/tank/internals/plasmaman/belt/full/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:147)  may sleep
rt.def("/obj/item/weapon/tank/internals/plasmaman/belt/full/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["plasma"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "plasma"), 1, divide(multiply(1013.25, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);

rt.type(7467, "/obj/item/weapon/tank/internals/emergency_oxygen", "/obj/item/weapon/tank/internals", {
	flags: 64,
	name: "emergency oxygen tank",
	desc: "Used for emergencies. Contains very little oxygen, so try to conserve it until you actually need it.",
	icon_state: "emergency",
	slot_flags: 512,
	w_class: 2,
	force: 4,
	distribute_pressure: 16,
	volume: 3,
});

// /obj/item/weapon/tank/internals/emergency_oxygen/proc/New  (code/game/objects/items/weapons/tanks/tank_types.dm:170)  may sleep
rt.def("/obj/item/weapon/tank/internals/emergency_oxygen/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "air_contents"), "assert_gas", ["o2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", rt.sv(f, "air_contents")), "o2"), 1, divide(multiply(303.9749755859375, rt.sv(f, "volume")), 2436.07666015625));
	return live(f.dot);
}, true);
