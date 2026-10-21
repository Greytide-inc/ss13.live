// From code/modules/mob/living/simple_animal/corpse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11980, "/obj/effect/mob_spawn/human/corpse/syndicatesoldier", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Operative",
	outfit: rt.typePath("/datum/outfit/syndicatesoldiercorpse"),
	name: "Syndicate Operative",
	id_access_list: null,
});

// /obj/effect/mob_spawn/human/corpse/syndicatesoldier/proc/<init>  (code/modules/mob/living/simple_animal/corpse.dm:14)
rt.def("/obj/effect/mob_spawn/human/corpse/syndicatesoldier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(150));
	return f.dot;
});

rt.type(11981, "/obj/effect/mob_spawn/human/corpse/syndicatecommando", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Operative",
	outfit: rt.typePath("/datum/outfit/syndicatecommandocorpse"),
	name: "Syndicate Commando",
	id_access_list: null,
});

// /obj/effect/mob_spawn/human/corpse/syndicatecommando/proc/<init>  (code/modules/mob/living/simple_animal/corpse.dm:33)
rt.def("/obj/effect/mob_spawn/human/corpse/syndicatecommando/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(150));
	return f.dot;
});

rt.type(11982, "/obj/effect/mob_spawn/human/corpse/syndicatestormtrooper", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Operative",
	outfit: rt.typePath("/datum/outfit/syndicatestormtroopercorpse"),
	name: "Syndicate Stormtrooper",
	id_access_list: null,
});

// /obj/effect/mob_spawn/human/corpse/syndicatestormtrooper/proc/<init>  (code/modules/mob/living/simple_animal/corpse.dm:52)
rt.def("/obj/effect/mob_spawn/human/corpse/syndicatestormtrooper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(150));
	return f.dot;
});
