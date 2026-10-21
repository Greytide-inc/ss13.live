// From code/modules/spells/spell_types/santa.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11365, "/obj/effect/proc_holder/spell/aoe_turf/conjure/presents", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_type: null,
	summon_lifespan: 0,
	summon_amt: 5,
	name: "Conjure Presents!",
	desc: "This spell lets you reach into S-space and retrieve presents! Yay!",
	school: "santa",
	charge_max: 600,
	clothes_req: 0,
	invocation: "HO HO HO",
	invocation_type: "shout",
	range: 3,
	cooldown_min: 50,
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/presents/proc/<init>  (code/modules/spells/spell_types/santa.dm:13)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/presents/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list("/obj/item/weapon/a_gift"));
	return f.dot;
});
