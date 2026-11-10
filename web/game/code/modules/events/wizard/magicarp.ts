// Based on /tg/station's code/modules/events/wizard/magicarp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(346, "/datum/round_event/wizard/magicarp", "/datum/round_event/wizard", {
	announceWhen: 3,
	startWhen: 50,
});

// magicarp.dm:13
rt.def("/datum/round_event/wizard/magicarp/proc/setup", function setup(f: Frame) {
	this.startWhen = rand(40, 60);
	return f.dot;
});

// magicarp.dm:16
rt.def("/datum/round_event/wizard/magicarp/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Unknown magical entities have been detected near ${station_name()}, please stand-by.`, "Lifesign Alert");
	return f.dot;
}, true);

// magicarp.dm:19
rt.def("/datum/round_event/wizard/magicarp/proc/start", function* start(f: Frame) {
	let C: Value = null;
	for (C of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (C.name == "carpspawn") {
			if (prob(5)) {
				yield* new_(T("/mob/living/simple_animal/hostile/carp/ranged/chaos"), C.loc);
			} else {
				yield* new_(T("/mob/living/simple_animal/hostile/carp/ranged"), C.loc);
			}
		}
	}
	return f.dot;
}, true);

rt.type(4903, "/mob/living/simple_animal/hostile/carp/ranged", "/mob/living/simple_animal/hostile/carp", {
	allowed_projectile_types: null,
	name: "magicarp",
	desc: "50% magic, 50% carp, 100% horrible.",
	icon_state: "magicarp",
	icon_living: "magicarp",
	icon_dead: "magicarp_dead",
	icon_gib: "magicarp_gib",
	ranged: 1,
	retreat_distance: 2,
	minimum_distance: 0,
	projectiletype: rt.typePath("/obj/item/projectile/magic"),
	projectilesound: rt.rsc("sound/weapons/emitter.ogg"),
	maxHealth: 50,
	health: 50,
});

// magicarp.dm:40
rt.def("/mob/living/simple_animal/hostile/carp/ranged/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed_projectile_types = list(T("/obj/item/projectile/magic/change"), T("/obj/item/projectile/magic/animate"), T("/obj/item/projectile/magic/resurrection"), T("/obj/item/projectile/magic/death"), T("/obj/item/projectile/magic/teleport"), T("/obj/item/projectile/magic/door"), T("/obj/item/projectile/magic/aoe/fireball"), T("/obj/item/projectile/magic/spellblade"), T("/obj/item/projectile/magic/arcane_barrage"));
	return f.dot;
});

// magicarp.dm:45
rt.def("/mob/living/simple_animal/hostile/carp/ranged/proc/Initialize", function* Initialize(f: Frame) {
	this.projectiletype = pick(this.allowed_projectile_types);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4904, "/mob/living/simple_animal/hostile/carp/ranged/chaos", "/mob/living/simple_animal/hostile/carp/ranged", {
	name: "chaos magicarp",
	desc: "50% carp, 100% magic, 150% horrible.",
	color: "#00FFFF",
	maxHealth: 75,
	health: 75,
});

// magicarp.dm:56
rt.def("/mob/living/simple_animal/hostile/carp/ranged/chaos/proc/Shoot", function* Shoot(f: Frame) {
	this.projectiletype = pick(this.allowed_projectile_types);
	yield* parent_proc();
	return f.dot;
}, true);
