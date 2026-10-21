// From code/game/mecha/combat/gygax.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12105, "/obj/mecha/combat/gygax", "/obj/mecha/combat", {
	step_in: 3,
	dir_in: 1,
	deflect_chance: 5,
	max_temperature: 25000,
	internal_damage_threshold: 35,
	max_equip: 3,
	step_energy_drain: 3,
	desc: "A lightweight, security exosuit. Popular among private and corporate security.",
	name: "１Gygax",
	icon_state: "gygax",
	obj_integrity: 250,
	armor: null,
	infra_luminosity: 6,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/gygax"),
});

// /obj/mecha/combat/gygax/proc/<init>  (code/game/mecha/combat/gygax.dm:9)  may sleep
rt.def("/obj/mecha/combat/gygax/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 20, "laser", 30, "energy", 15, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
}, true);

rt.type(12106, "/obj/mecha/combat/gygax/dark", "/obj/mecha/combat/gygax", {
	deflect_chance: 15,
	max_temperature: 35000,
	leg_overload_coeff: 100,
	max_equip: 4,
	desc: "A lightweight exosuit, painted in a dark scheme. This model appears to have some modifications.",
	name: "１Dark Gygax",
	icon_state: "darkgygax",
	obj_integrity: 300,
	armor: null,
	operation_req_access: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/gygax/dark"),
});

// /obj/mecha/combat/gygax/dark/proc/<init>  (code/game/mecha/combat/gygax.dm:23)  may sleep
rt.def("/obj/mecha/combat/gygax/dark/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 40, "laser", 50, "energy", 35, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "operation_req_access", rt.list(150));
	return f.dot;
}, true);

rt.type(12107, "/obj/mecha/combat/gygax/dark/loaded", "/obj/mecha/combat/gygax/dark", {});

// /obj/mecha/combat/gygax/dark/loaded/proc/New  (code/game/mecha/combat/gygax.dm:31)  may sleep
rt.def("/obj/mecha/combat/gygax/dark/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/carbine"), []))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang"), []))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/teleporter"), []))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), []))), "attach", [live(f.src)]);
	return live(f.dot);
}, true);

// /obj/mecha/combat/gygax/dark/proc/add_cell  (code/game/mecha/combat/gygax.dm:44)  may sleep
rt.def("/obj/mecha/combat/gygax/dark/proc/add_cell", function* add_cell(f: Frame, C: Value) {
	f.vars = () => [C];
	if (live(C) === null) {
		C = null;
	}
	if (truthy(live(C))) {
		yield* g.callName(f, live(C), "forceMove", [live(f.src)]);
		rt.setSv(f, "cell", live(C));
		return live(f.dot);
	}
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
	rt.setFv(f, "charge", rt.sv(f, "cell"), 30000);
	rt.setFv(f, "maxcharge", rt.sv(f, "cell"), 30000);
	return f.dot;
}, true);

// /obj/mecha/combat/gygax/proc/GrantActions  (code/game/mecha/combat/gygax.dm:53)  may sleep
rt.def("/obj/mecha/combat/gygax/proc/GrantActions", function* GrantActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "overload_action"), "Grant", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// /obj/mecha/combat/gygax/dark/proc/GrantActions  (code/game/mecha/combat/gygax.dm:57)  may sleep
rt.def("/obj/mecha/combat/gygax/dark/proc/GrantActions", function* GrantActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "thrusters_action"), "Grant", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// /obj/mecha/combat/gygax/proc/RemoveActions  (code/game/mecha/combat/gygax.dm:62)  may sleep
rt.def("/obj/mecha/combat/gygax/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "overload_action"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// /obj/mecha/combat/gygax/dark/proc/RemoveActions  (code/game/mecha/combat/gygax.dm:66)  may sleep
rt.def("/obj/mecha/combat/gygax/dark/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "thrusters_action"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });
