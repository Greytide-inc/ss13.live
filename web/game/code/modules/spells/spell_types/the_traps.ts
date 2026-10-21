// From code/modules/spells/spell_types/the_traps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11366, "/obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_lifespan: 3000,
	summon_amt: 5,
	name: "The Traps!",
	desc: "Summon a number of traps to confuse and knockdown your enemies, and possibly you.",
	charge_max: 250,
	cooldown_min: 50,
	clothes_req: 1,
	invocation: "CAVERE INSIDIAS",
	invocation_type: "shout",
	range: 3,
	summon_type: null,
	action_icon_state: "the_traps",
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps/proc/<init>  (code/modules/spells/spell_types/the_traps.dm:13)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/structure/trap/stun"), T("/obj/structure/trap/fire"), T("/obj/structure/trap/chill"), T("/obj/structure/trap/damage")));
	return f.dot;
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps/proc/post_summon  (code/modules/spells/spell_types/the_traps.dm:25)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps/proc/post_summon", function post_summon(f: Frame, _T: Value, user: Value) {
	rt.modField(f, live(_T), "immune_minds", rt.fv(f, "mind", live(user)), add);
	rt.setFv(f, "charges", live(_T), 1);
	return f.dot;
});
