// Based on /tg/station's code/game/mecha/combat/gygax.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// gygax.dm:9
rt.def("/obj/mecha/combat/gygax/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 20, "laser", 30, "energy", 15, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
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

// gygax.dm:23
rt.def("/obj/mecha/combat/gygax/dark/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 40, "laser", 50, "energy", 35, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.operation_req_access = list(150);
	return f.dot;
}, true);

rt.type(12107, "/obj/mecha/combat/gygax/dark/loaded", "/obj/mecha/combat/gygax/dark", {});

// gygax.dm:31
rt.def("/obj/mecha/combat/gygax/dark/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	yield* parent_proc();
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/carbine")))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang")))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/teleporter")))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay")))).attach(this);
	return f.dot;
}, true);

// gygax.dm:44
rt.def("/obj/mecha/combat/gygax/dark/proc/add_cell", function* add_cell(f: Frame, C: Value) {
	if (C) {
		yield* C.forceMove(this);
		this.cell = C;
		return f.dot;
	}
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
	this.cell.charge = 30000;
	this.cell.maxcharge = 30000;
	return f.dot;
}, true);

// gygax.dm:53
rt.def("/obj/mecha/combat/gygax/proc/GrantActions", function* GrantActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.overload_action.Grant(f.args[0], this);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// gygax.dm:57
rt.def("/obj/mecha/combat/gygax/dark/proc/GrantActions", function* GrantActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.thrusters_action.Grant(f.args[0], this);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// gygax.dm:62
rt.def("/obj/mecha/combat/gygax/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.overload_action.Remove(f.args[0]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// gygax.dm:66
rt.def("/obj/mecha/combat/gygax/dark/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.thrusters_action.Remove(f.args[0]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });
