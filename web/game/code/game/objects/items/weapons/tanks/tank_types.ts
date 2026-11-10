// Based on /tg/station's code/game/objects/items/weapons/tanks/tank_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7456, "/obj/item/weapon/tank/internals/oxygen", "/obj/item/weapon/tank/internals", {
	name: "oxygen tank",
	desc: "A tank of oxygen.",
	icon_state: "oxygen",
	distribute_pressure: 16,
	force: 10,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});

// tank_types.dm:23
rt.def("/obj/item/weapon/tank/internals/oxygen/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("o2");
	rt.setAt(rt.index(this.air_contents.gases, "o2"), 1, 607.94995 * this.volume / 2436.0767);
	return f.dot;
}, true);

rt.type(7459, "/obj/item/weapon/tank/internals/anesthetic", "/obj/item/weapon/tank/internals", {
	name: "anesthetic tank",
	desc: "A tank with an N2O/O2 gas mix.",
	icon_state: "anesthetic",
	item_state: "an_tank",
	force: 10,
});

// tank_types.dm:51
rt.def("/obj/item/weapon/tank/internals/anesthetic/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gases("o2", "n2o");
	rt.setAt(rt.index(this.air_contents.gases, "o2"), 1, 303.97498 * this.volume / 2436.0767 * 0.21);
	rt.setAt(rt.index(this.air_contents.gases, "n2o"), 1, 303.97498 * this.volume / 2436.0767 * 0.79);
	return f.dot;
}, true);

rt.type(7460, "/obj/item/weapon/tank/internals/air", "/obj/item/weapon/tank/internals", {
	name: "air tank",
	desc: "Mixed anyone?",
	icon_state: "oxygen",
	force: 10,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});

// tank_types.dm:68
rt.def("/obj/item/weapon/tank/internals/air/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gases("o2", "n2");
	rt.setAt(rt.index(this.air_contents.gases, "o2"), 1, 607.94995 * this.volume / 2436.0767 * 0.21);
	rt.setAt(rt.index(this.air_contents.gases, "n2"), 1, 607.94995 * this.volume / 2436.0767 * 0.79);
	return f.dot;
}, true);

rt.type(7461, "/obj/item/weapon/tank/internals/plasma", "/obj/item/weapon/tank/internals", {
	flags: 64,
	name: "plasma tank",
	desc: "Contains dangerous plasma. Do not inhale. Warning: extremely flammable.",
	icon_state: "plasma",
	slot_flags: null,
	force: 8,
});

// tank_types.dm:88
rt.def("/obj/item/weapon/tank/internals/plasma/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("plasma");
	rt.setAt(rt.index(this.air_contents.gases, "plasma"), 1, 303.97498 * this.volume / 2436.0767);
	return f.dot;
}, true);

// tank_types.dm:94
rt.def("/obj/item/weapon/tank/internals/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let F: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/flamethrower"))) {
		if (!(F = W).status || F.ptank) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(this, F))) {
			return f.dot;
		}
		this.master = F;
		F.ptank = this;
		yield* F.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(7462, "/obj/item/weapon/tank/internals/plasma/full", "/obj/item/weapon/tank/internals/plasma", {});

// tank_types.dm:107
rt.def("/obj/item/weapon/tank/internals/plasma/full/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("plasma");
	rt.setAt(rt.index(this.air_contents.gases, "plasma"), 1, 1013.25 * this.volume / 2436.0767);
	return f.dot;
}, true);

rt.type(7463, "/obj/item/weapon/tank/internals/plasmaman", "/obj/item/weapon/tank/internals", {
	name: "plasma internals tank",
	desc: "A tank of plasma gas designed specifically for use as internals, particularly for plasma-based lifeforms. If you're not a Plasmaman, you probably shouldn't use this.",
	icon_state: "plasmaman_tank",
	item_state: "plasmaman_tank",
	force: 10,
	distribute_pressure: 16,
});

// tank_types.dm:126
rt.def("/obj/item/weapon/tank/internals/plasmaman/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("plasma");
	rt.setAt(rt.index(this.air_contents.gases, "plasma"), 1, 303.97498 * this.volume / 2436.0767);
	return f.dot;
}, true);

rt.type(7464, "/obj/item/weapon/tank/internals/plasmaman/full", "/obj/item/weapon/tank/internals/plasmaman", {});

// tank_types.dm:132
rt.def("/obj/item/weapon/tank/internals/plasmaman/full/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("plasma");
	rt.setAt(rt.index(this.air_contents.gases, "plasma"), 1, 1013.25 * this.volume / 2436.0767);
	return f.dot;
}, true);

rt.type(7466, "/obj/item/weapon/tank/internals/plasmaman/belt/full", "/obj/item/weapon/tank/internals/plasmaman/belt", {});

// tank_types.dm:147
rt.def("/obj/item/weapon/tank/internals/plasmaman/belt/full/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("plasma");
	rt.setAt(rt.index(this.air_contents.gases, "plasma"), 1, 1013.25 * this.volume / 2436.0767);
	return f.dot;
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

// tank_types.dm:170
rt.def("/obj/item/weapon/tank/internals/emergency_oxygen/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents.assert_gas("o2");
	rt.setAt(rt.index(this.air_contents.gases, "o2"), 1, 303.97498 * this.volume / 2436.0767);
	return f.dot;
}, true);
