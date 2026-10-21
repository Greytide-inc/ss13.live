// From code/modules/mob/living/simple_animal/spawner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/simple_animal/hostile/spawner/proc/<init>  (code/modules/mob/living/simple_animal/spawner.dm:7)
rt.def("/mob/living/simple_animal/hostile/spawner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawned_mobs", rt.list());
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/spawner/proc/Destroy  (code/modules/mob/living/simple_animal/spawner.dm:27)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/proc/Destroy", function* Destroy(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	L = null;
	rt.forList(f, 0, rt.sv(f, "spawned_mobs"), T("/mob/living/simple_animal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (isEqual(rt.fv(f, "nest", live(L)), live(f.src))) {
			rt.setFv(f, "nest", live(L), null);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "spawned_mobs", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/spawner/proc/Life  (code/modules/mob/living/simple_animal/spawner.dm:34)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/proc/Life", function* Life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "spawn_mob");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/spawner/proc/spawn_mob  (code/modules/mob/living/simple_animal/spawner.dm:39)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/proc/spawn_mob", function* spawn_mob(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (rt.ge(rt.len(f, rt.sv(f, "spawned_mobs")), rt.sv(f, "max_mobs"))) {
		return 0;
	}
	if (rt.gt(rt.sv(f, "spawn_delay"), rt.worldTime(f))) {
		return 0;
	}
	rt.setSv(f, "spawn_delay", add(rt.worldTime(f), rt.sv(f, "spawn_time")));
	rt.setFv(f, "admin_spawned", (L = (yield* g.new_(f, rt.sv(f, "mob_type"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "admin_spawned"));
	rt.modSrcVar(f, "spawned_mobs", live(L), add);
	rt.setFv(f, "nest", live(L), live(f.src));
	rt.setFv(f, "faction", live(L), rt.fv(f, "faction", live(f.src)));
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ ＀ ＀.</span>", [live(L), rt.sv(f, "spawn_text"), live(f.src)]));
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

// /mob/living/simple_animal/hostile/spawner/syndicate/proc/<init>  (code/modules/mob/living/simple_animal/spawner.dm:57)
rt.def("/mob/living/simple_animal/hostile/spawner/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("syndicate"));
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

// /mob/living/simple_animal/hostile/spawner/skeleton/proc/<init>  (code/modules/mob/living/simple_animal/spawner.dm:71)
rt.def("/mob/living/simple_animal/hostile/spawner/skeleton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("skeleton"));
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

// /mob/living/simple_animal/hostile/spawner/mining/proc/<init>  (code/modules/mob/living/simple_animal/spawner.dm:85)
rt.def("/mob/living/simple_animal/hostile/spawner/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("mining"));
	return f.dot;
});
