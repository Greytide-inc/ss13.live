// From code/game/mecha/combat/phazon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12114, "/obj/mecha/combat/phazon", "/obj/mecha/combat", {
	step_in: 2,
	dir_in: 2,
	step_energy_drain: 3,
	deflect_chance: 30,
	max_temperature: 25000,
	add_req_access: 1,
	internal_damage_threshold: 25,
	max_equip: 3,
	phase_state: "phazon-phase",
	desc: "This is a Phazon exosuit. The pinnacle of scientific research and pride of Nanotrasen, it uses cutting edge bluespace technology and expensive materials.",
	name: "１Phazon",
	icon_state: "phazon",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	infra_luminosity: 3,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/phazon"),
	force: 15,
});

// /obj/mecha/combat/phazon/proc/<init>  (code/game/mecha/combat/phazon.dm:11)  may sleep
rt.def("/obj/mecha/combat/phazon/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 30, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
}, true);

// /obj/mecha/combat/phazon/proc/GrantActions  (code/game/mecha/combat/phazon.dm:22)  may sleep
rt.def("/obj/mecha/combat/phazon/proc/GrantActions", function* GrantActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "switch_damtype_action"), "Grant", [live(f.args[0]), live(f.src)]);
	yield* g.callName(f, rt.sv(f, "phasing_action"), "Grant", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// /obj/mecha/combat/phazon/proc/RemoveActions  (code/game/mecha/combat/phazon.dm:28)  may sleep
rt.def("/obj/mecha/combat/phazon/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "switch_damtype_action"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "phasing_action"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });
