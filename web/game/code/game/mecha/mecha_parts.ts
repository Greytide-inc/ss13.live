// From code/game/mecha/mecha_parts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9559, "/obj/item/mecha_parts/chassis", "/obj/item/mecha_parts", {
	construct: null,
	name: "Mecha Chassis",
	icon_state: "backbone",
});

// /obj/item/mecha_parts/chassis/proc/attackby  (code/game/mecha/mecha_parts.dm:19)  may sleep
rt.def("/obj/item/mecha_parts/chassis/proc/attackby", function* attackby(f: Frame) {
	if (!(!truthy(rt.sv(f, "construct")) || !truthy((yield* g.callName(f, rt.sv(f, "construct"), "action", [live(f.args[0]), live(f.args[1])]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

rt.type(9560, "/obj/item/mecha_parts/chassis/ripley", "/obj/item/mecha_parts/chassis", {
	name: "１Ripley chassis",
});

// /obj/item/mecha_parts/chassis/ripley/proc/New  (code/game/mecha/mecha_parts.dm:31)  may sleep
rt.def("/obj/item/mecha_parts/chassis/ripley/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/ripley_chassis"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(9561, "/obj/item/mecha_parts/chassis/odysseus", "/obj/item/mecha_parts/chassis", {
	name: "１Odysseus chassis",
});

// /obj/item/mecha_parts/chassis/odysseus/proc/New  (code/game/mecha/mecha_parts.dm:66)  may sleep
rt.def("/obj/item/mecha_parts/chassis/odysseus/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/odysseus_chassis"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(9562, "/obj/item/mecha_parts/chassis/gygax", "/obj/item/mecha_parts/chassis", {
	name: "１Gygax chassis",
});

// /obj/item/mecha_parts/chassis/gygax/proc/New  (code/game/mecha/mecha_parts.dm:106)  may sleep
rt.def("/obj/item/mecha_parts/chassis/gygax/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/gygax_chassis"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(9563, "/obj/item/mecha_parts/chassis/durand", "/obj/item/mecha_parts/chassis", {
	name: "１Durand chassis",
});

// /obj/item/mecha_parts/chassis/durand/proc/New  (code/game/mecha/mecha_parts.dm:159)  may sleep
rt.def("/obj/item/mecha_parts/chassis/durand/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/durand_chassis"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(9564, "/obj/item/mecha_parts/chassis/firefighter", "/obj/item/mecha_parts/chassis", {
	name: "Firefighter chassis",
});

// /obj/item/mecha_parts/chassis/firefighter/proc/New  (code/game/mecha/mecha_parts.dm:211)  may sleep
rt.def("/obj/item/mecha_parts/chassis/firefighter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/firefighter_chassis"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(9565, "/obj/item/mecha_parts/chassis/honker", "/obj/item/mecha_parts/chassis", {
	name: "１H.O.N.K chassis",
});

// /obj/item/mecha_parts/chassis/honker/proc/New  (code/game/mecha/mecha_parts.dm:221)  may sleep
rt.def("/obj/item/mecha_parts/chassis/honker/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/honker_chassis"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(9566, "/obj/item/mecha_parts/chassis/phazon", "/obj/item/mecha_parts/chassis", {
	name: "１Phazon chassis",
});

// /obj/item/mecha_parts/chassis/phazon/proc/New  (code/game/mecha/mecha_parts.dm:261)  may sleep
rt.def("/obj/item/mecha_parts/chassis/phazon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "construct", (yield* g.new_(f, T("/datum/construction/mecha/phazon_chassis"), [live(f.src)])));
	return f.dot;
}, true);
