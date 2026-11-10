// Based on /tg/station's code/modules/spells/spell_types/santa.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// santa.dm:13
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/presents/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list("/obj/item/weapon/a_gift");
	return f.dot;
});
