// From code/game/mecha/combat/durand.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12104, "/obj/mecha/combat/durand", "/obj/mecha/combat", {
	step_in: 4,
	dir_in: 1,
	deflect_chance: 20,
	max_temperature: 30000,
	desc: "An aging combat exosuit utilized by the Nanotrasen corporation. Originally developed to combat hostile alien lifeforms.",
	name: "１Durand",
	icon_state: "durand",
	obj_integrity: 400,
	max_integrity: 400,
	armor: null,
	infra_luminosity: 8,
	force: 40,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/durand"),
});

// /obj/mecha/combat/durand/proc/<init>  (code/game/mecha/combat/durand.dm:10)  may sleep
rt.def("/obj/mecha/combat/durand/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 35, "laser", 15, "energy", 10, "bomb", 20, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
}, true);

// /obj/mecha/combat/durand/proc/GrantActions  (code/game/mecha/combat/durand.dm:17)  may sleep
rt.def("/obj/mecha/combat/durand/proc/GrantActions", function* GrantActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "defense_action"), "Grant", [live(f.args[0]), live(f.src)]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });

// /obj/mecha/combat/durand/proc/RemoveActions  (code/game/mecha/combat/durand.dm:21)  may sleep
rt.def("/obj/mecha/combat/durand/proc/RemoveActions", function* RemoveActions(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "defense_action"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user", "human_occupant"] });
