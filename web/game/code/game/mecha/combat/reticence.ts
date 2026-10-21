// From code/game/mecha/combat/reticence.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12115, "/obj/mecha/combat/reticence", "/obj/mecha/combat", {
	step_in: 2,
	dir_in: 1,
	deflect_chance: 3,
	max_temperature: 15000,
	add_req_access: 0,
	internal_damage_threshold: 25,
	max_equip: 2,
	step_energy_drain: 3,
	stepsound: null,
	turnsound: null,
	desc: "A silent, fast, and nigh-invisible miming exosuit. Popular among mimes and mime assassins.",
	name: "１reticence",
	icon_state: "reticence",
	obj_integrity: 100,
	max_integrity: 100,
	armor: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/reticence"),
	operation_req_access: null,
	color: "#87878715",
	opacity: 0,
});

// /obj/mecha/combat/reticence/proc/<init>  (code/game/mecha/combat/reticence.dm:10)  may sleep
rt.def("/obj/mecha/combat/reticence/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 20, "laser", 30, "energy", 15, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "operation_req_access", rt.list(46));
	return f.dot;
}, true);

rt.type(12116, "/obj/mecha/combat/reticence/loaded", "/obj/mecha/combat/reticence", {});

// /obj/mecha/combat/reticence/loaded/proc/New  (code/game/mecha/combat/reticence.dm:24)  may sleep
rt.def("/obj/mecha/combat/reticence/loaded/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/silenced"), []))), "attach", [live(f.src)]);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/rcd"), []))), "attach", [live(f.src)]);
	return live(f.dot);
}, true);
