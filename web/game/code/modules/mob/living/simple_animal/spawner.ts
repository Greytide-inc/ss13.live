// Based on /tg/station's code/modules/mob/living/simple_animal/spawner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4920, "/mob/living/simple_animal/hostile/spawner", "/mob/living/simple_animal/hostile", {
	spawned_mobs: null,
	max_mobs: 5,
	spawn_delay: 0,
	spawn_time: 300,
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/carp"),
	spawn_text: "emerges from",
	anchored: 1,
	name: "monster nest",
	icon: rt.rsc("icons/mob/animal.dmi"),
	health: 100,
	maxHealth: 100,
	gender: "neuter",
	status_flags: 0,
	AIStatus: 3,
	a_intent: "harm",
	stop_automated_movement: 1,
	wander: 0,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 350,
	layer: 3.7,
	sentience_type: 5,
});

// spawner.dm:7
rt.def("/mob/living/simple_animal/hostile/spawner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawned_mobs = list();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// spawner.dm:27
rt.def("/mob/living/simple_animal/hostile/spawner/proc/Destroy", function* Destroy(f: Frame) {
	let L: Value = null;
	for (L of each(this.spawned_mobs, T("/mob/living/simple_animal"))) {
		if (L.nest == this) {
			L.nest = null;
		}
	}
	this.spawned_mobs = null;
	return (yield* parent_proc());
}, true);

// spawner.dm:34
rt.def("/mob/living/simple_animal/hostile/spawner/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (this.stat) return f.dot;
	yield* this.spawn_mob();
	return f.dot;
}, true, { waitfor: false });

// spawner.dm:39
rt.def("/mob/living/simple_animal/hostile/spawner/proc/spawn_mob", function* spawn_mob(f: Frame) {
	let L: Value = null;
	if (rt.len(f, this.spawned_mobs) >= this.max_mobs) {
		return 0;
	}
	if (this.spawn_delay > rt.worldTime(f)) {
		return 0;
	}
	this.spawn_delay = rt.worldTime(f) + this.spawn_time;
	(L = (yield* new_(this.mob_type, this.loc))).admin_spawned = this.admin_spawned;
	this.spawned_mobs += L;
	L.nest = this;
	L.faction = this.faction;
	this.visible_message(`<span class='danger'>${L} ${this.spawn_text} ${this}.</span>`);
	return f.dot;
}, true);

rt.type(4921, "/mob/living/simple_animal/hostile/spawner/syndicate", "/mob/living/simple_animal/hostile/spawner", {
	spawn_text: "warps in from",
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/syndicate/ranged"),
	name: "warp beacon",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	faction: null,
});

// spawner.dm:57
rt.def("/mob/living/simple_animal/hostile/spawner/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("syndicate");
	return f.dot;
});

rt.type(4922, "/mob/living/simple_animal/hostile/spawner/skeleton", "/mob/living/simple_animal/hostile/spawner", {
	max_mobs: 15,
	spawn_time: 150,
	spawn_text: "climbs out of",
	name: "bone pit",
	desc: "A pit full of bones, some still seem to be moving..",
	icon_state: "hole",
	icon_living: "hole",
	icon: rt.rsc("icons/mob/nest.dmi"),
	health: 150,
	maxHealth: 150,
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/skeleton"),
	atmos_requirements: null,
	faction: null,
});

// spawner.dm:71
rt.def("/mob/living/simple_animal/hostile/spawner/skeleton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("skeleton");
	return f.dot;
});

rt.type(4923, "/mob/living/simple_animal/hostile/spawner/mining", "/mob/living/simple_animal/hostile/spawner", {
	max_mobs: 3,
	spawn_text: "crawls out of",
	name: "monster den",
	desc: "A hole dug into the ground, harboring all kinds of monsters found within most caves or mining asteroids.",
	icon_state: "hole",
	icon_living: "hole",
	health: 200,
	maxHealth: 200,
	icon: rt.rsc("icons/mob/nest.dmi"),
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/goldgrub"),
	atmos_requirements: null,
	faction: null,
});

// spawner.dm:85
rt.def("/mob/living/simple_animal/hostile/spawner/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("mining");
	return f.dot;
});
