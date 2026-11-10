// Based on /tg/station's code/modules/spells/spell_types/the_traps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// the_traps.dm:13
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/obj/structure/trap/stun"), T("/obj/structure/trap/fire"), T("/obj/structure/trap/chill"), T("/obj/structure/trap/damage"));
	return f.dot;
});

// the_traps.dm:25
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps/proc/post_summon", function post_summon(f: Frame, _T: Value, user: Value) {
	_T.immune_minds += user.mind;
	_T.charges = 1;
	return f.dot;
});
