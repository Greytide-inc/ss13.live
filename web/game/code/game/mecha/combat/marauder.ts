// Based on /tg/station's code/game/mecha/combat/marauder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12109, "/obj/mecha/combat/marauder", "/obj/mecha/combat", {
	step_in: 5,
	deflect_chance: 25,
	max_temperature: 60000,
	add_req_access: 0,
	internal_damage_threshold: 25,
	max_equip: 4,
	bumpsmash: 1,
	desc: "Heavy-duty, combat exosuit, developed after the Durand model. Rarely found among civilian populations.",
	name: "１Marauder",
	icon_state: "marauder",
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
	resistance_flags: 35,
	infra_luminosity: 3,
	operation_req_access: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/marauder"),
	force: 45,
});

// marauder.dm:9
rt.def("/obj/mecha/combat/marauder/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 55, "laser", 40, "energy", 30, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.operation_req_access = list(103);
	return f.dot;
}, true);

// marauder.dm:22
rt.def("/obj/mecha/combat/marauder/proc/GrantActions", function* GrantActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.smoke_action.Grant(f.args[0], this);
	yield* this.thrusters_action.Grant(f.args[0], this);
	yield* this.zoom_action.Grant(f.args[0], this);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// marauder.dm:28
rt.def("/obj/mecha/combat/marauder/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* this.smoke_action.Remove(f.args[0]);
	yield* this.thrusters_action.Remove(f.args[0]);
	yield* this.zoom_action.Remove(f.args[0]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

rt.type(12110, "/obj/mecha/combat/marauder/loaded", "/obj/mecha/combat/marauder", {});

// marauder.dm:34
rt.def("/obj/mecha/combat/marauder/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	yield* parent_proc();
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/energy/pulse"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"), this))).attach(this);
	return f.dot;
}, true);

rt.type(12111, "/obj/mecha/combat/marauder/seraph", "/obj/mecha/combat/marauder", {
	step_in: 3,
	internal_damage_threshold: 20,
	max_equip: 5,
	desc: "Heavy-duty, command-type exosuit. This is a custom model, utilized only by high-ranking military personnel.",
	name: "１Seraph",
	icon_state: "seraph",
	operation_req_access: null,
	obj_integrity: 550,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/seraph"),
	force: 55,
});

// marauder.dm:48
rt.def("/obj/mecha/combat/marauder/seraph/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.operation_req_access = list(103);
	return f.dot;
}, true);

// marauder.dm:57
rt.def("/obj/mecha/combat/marauder/seraph/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	yield* parent_proc();
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/scattershot"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/teleporter"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"), this))).attach(this);
	return f.dot;
}, true);

rt.type(12112, "/obj/mecha/combat/marauder/mauler", "/obj/mecha/combat/marauder", {
	max_equip: 5,
	desc: "Heavy-duty, combat exosuit, developed off of the existing Marauder model.",
	name: "１Mauler",
	icon_state: "mauler",
	operation_req_access: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/mauler"),
});

// marauder.dm:74
rt.def("/obj/mecha/combat/marauder/mauler/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.operation_req_access = list(150);
	return f.dot;
}, true);

rt.type(12113, "/obj/mecha/combat/marauder/mauler/loaded", "/obj/mecha/combat/marauder/mauler", {});

// marauder.dm:79
rt.def("/obj/mecha/combat/marauder/mauler/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	yield* parent_proc();
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/lmg"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/scattershot"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), this))).attach(this);
	yield* (ME = (yield* new_(T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"), this))).attach(this);
	return f.dot;
}, true);
