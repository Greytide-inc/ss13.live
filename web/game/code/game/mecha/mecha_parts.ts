// Based on /tg/station's code/game/mecha/mecha_parts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9559, "/obj/item/mecha_parts/chassis", "/obj/item/mecha_parts", {
	construct: null,
	name: "Mecha Chassis",
	icon_state: "backbone",
});

// mecha_parts.dm:19
rt.def("/obj/item/mecha_parts/chassis/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!(!this.construct || !(yield* this.construct.action(W, user)))) return f.dot;
	return (yield* parent_proc());
}, true);

rt.type(9560, "/obj/item/mecha_parts/chassis/ripley", "/obj/item/mecha_parts/chassis", {
	name: "１Ripley chassis",
});

// mecha_parts.dm:31
rt.def("/obj/item/mecha_parts/chassis/ripley/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/ripley_chassis"), this));
	return f.dot;
}, true);

rt.type(9561, "/obj/item/mecha_parts/chassis/odysseus", "/obj/item/mecha_parts/chassis", {
	name: "１Odysseus chassis",
});

// mecha_parts.dm:66
rt.def("/obj/item/mecha_parts/chassis/odysseus/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/odysseus_chassis"), this));
	return f.dot;
}, true);

rt.type(9562, "/obj/item/mecha_parts/chassis/gygax", "/obj/item/mecha_parts/chassis", {
	name: "１Gygax chassis",
});

// mecha_parts.dm:106
rt.def("/obj/item/mecha_parts/chassis/gygax/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/gygax_chassis"), this));
	return f.dot;
}, true);

rt.type(9563, "/obj/item/mecha_parts/chassis/durand", "/obj/item/mecha_parts/chassis", {
	name: "１Durand chassis",
});

// mecha_parts.dm:159
rt.def("/obj/item/mecha_parts/chassis/durand/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/durand_chassis"), this));
	return f.dot;
}, true);

rt.type(9564, "/obj/item/mecha_parts/chassis/firefighter", "/obj/item/mecha_parts/chassis", {
	name: "Firefighter chassis",
});

// mecha_parts.dm:211
rt.def("/obj/item/mecha_parts/chassis/firefighter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/firefighter_chassis"), this));
	return f.dot;
}, true);

rt.type(9565, "/obj/item/mecha_parts/chassis/honker", "/obj/item/mecha_parts/chassis", {
	name: "１H.O.N.K chassis",
});

// mecha_parts.dm:221
rt.def("/obj/item/mecha_parts/chassis/honker/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/honker_chassis"), this));
	return f.dot;
}, true);

rt.type(9566, "/obj/item/mecha_parts/chassis/phazon", "/obj/item/mecha_parts/chassis", {
	name: "１Phazon chassis",
});

// mecha_parts.dm:261
rt.def("/obj/item/mecha_parts/chassis/phazon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.construct = (yield* new_(T("/datum/construction/mecha/phazon_chassis"), this));
	return f.dot;
}, true);
