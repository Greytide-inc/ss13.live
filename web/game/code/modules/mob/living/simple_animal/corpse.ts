// Based on /tg/station's code/modules/mob/living/simple_animal/corpse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11980, "/obj/effect/mob_spawn/human/corpse/syndicatesoldier", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Operative",
	outfit: rt.typePath("/datum/outfit/syndicatesoldiercorpse"),
	name: "Syndicate Operative",
	id_access_list: null,
});

// corpse.dm:14
rt.def("/obj/effect/mob_spawn/human/corpse/syndicatesoldier/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(150);
	return f.dot;
});

rt.type(11981, "/obj/effect/mob_spawn/human/corpse/syndicatecommando", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Operative",
	outfit: rt.typePath("/datum/outfit/syndicatecommandocorpse"),
	name: "Syndicate Commando",
	id_access_list: null,
});

// corpse.dm:33
rt.def("/obj/effect/mob_spawn/human/corpse/syndicatecommando/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(150);
	return f.dot;
});

rt.type(11982, "/obj/effect/mob_spawn/human/corpse/syndicatestormtrooper", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Operative",
	outfit: rt.typePath("/datum/outfit/syndicatestormtroopercorpse"),
	name: "Syndicate Stormtrooper",
	id_access_list: null,
});

// corpse.dm:52
rt.def("/obj/effect/mob_spawn/human/corpse/syndicatestormtrooper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(150);
	return f.dot;
});
