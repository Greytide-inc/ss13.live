// From code/game/mecha/combat/marauder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/mecha/combat/marauder/proc/<init>  (code/game/mecha/combat/marauder.dm:9)  may sleep
rt.def("/obj/mecha/combat/marauder/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 55, "laser", 40, "energy", 30, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "operation_req_access", rt.list(103));
	return f.dot;
}, true);

// /obj/mecha/combat/marauder/proc/GrantActions  (code/game/mecha/combat/marauder.dm:22)  may sleep
rt.def("/obj/mecha/combat/marauder/proc/GrantActions", function* GrantActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "smoke_action"), "Grant", [live(f.args[0]), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "thrusters_action"), "Grant", [live(f.args[0]), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "zoom_action"), "Grant", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// /obj/mecha/combat/marauder/proc/RemoveActions  (code/game/mecha/combat/marauder.dm:28)  may sleep
rt.def("/obj/mecha/combat/marauder/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "smoke_action"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "thrusters_action"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "zoom_action"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

rt.type(12110, "/obj/mecha/combat/marauder/loaded", "/obj/mecha/combat/marauder", {});

// /obj/mecha/combat/marauder/loaded/proc/New  (code/game/mecha/combat/marauder.dm:34)  may sleep
rt.def("/obj/mecha/combat/marauder/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/energy/pulse"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"), [live(f.src)]))), "attach", [live(f.src)]);
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

// /obj/mecha/combat/marauder/seraph/proc/<init>  (code/game/mecha/combat/marauder.dm:48)  may sleep
rt.def("/obj/mecha/combat/marauder/seraph/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "operation_req_access", rt.list(103));
	return f.dot;
}, true);

// /obj/mecha/combat/marauder/seraph/proc/New  (code/game/mecha/combat/marauder.dm:57)  may sleep
rt.def("/obj/mecha/combat/marauder/seraph/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	yield* g.callSuper(f, [], rt.Args.Same);
	ME = null;
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/scattershot"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/teleporter"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"), [live(f.src)]))), "attach", [live(f.src)]);
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

// /obj/mecha/combat/marauder/mauler/proc/<init>  (code/game/mecha/combat/marauder.dm:74)  may sleep
rt.def("/obj/mecha/combat/marauder/mauler/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "operation_req_access", rt.list(150));
	return f.dot;
}, true);

rt.type(12113, "/obj/mecha/combat/marauder/mauler/loaded", "/obj/mecha/combat/marauder/mauler", {});

// /obj/mecha/combat/marauder/mauler/loaded/proc/New  (code/game/mecha/combat/marauder.dm:79)  may sleep
rt.def("/obj/mecha/combat/marauder/mauler/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/lmg"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/scattershot"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay"), [live(f.src)]))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"), [live(f.src)]))), "attach", [live(f.src)]);
	return f.dot;
}, true);
