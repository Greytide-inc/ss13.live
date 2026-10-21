// From code/modules/events/wizard/magicarp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(346, "/datum/round_event/wizard/magicarp", "/datum/round_event/wizard", {
	announceWhen: 3,
	startWhen: 50,
});

// /datum/round_event/wizard/magicarp/proc/setup  (code/modules/events/wizard/magicarp.dm:13)
rt.def("/datum/round_event/wizard/magicarp/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "startWhen", rt.call(f, P("/proc/rand"), null, [40, 60]));
	return f.dot;
});

// /datum/round_event/wizard/magicarp/proc/announce  (code/modules/events/wizard/magicarp.dm:16)  may sleep
rt.def("/datum/round_event/wizard/magicarp/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Unknown magical entities have been detected near ＀, please stand-by.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Lifesign Alert"]);
	return f.dot;
}, true);

// /datum/round_event/wizard/magicarp/proc/start  (code/modules/events/wizard/magicarp.dm:19)  may sleep
rt.def("/datum/round_event/wizard/magicarp/proc/start", function* start(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "name", live(C)), "carpspawn")) {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.new_(f, T("/mob/living/simple_animal/hostile/carp/ranged/chaos"), [rt.fv(f, "loc", live(C))]);
			} else {
				yield* g.new_(f, T("/mob/living/simple_animal/hostile/carp/ranged"), [rt.fv(f, "loc", live(C))]);
			}
		}
	}
	rt.endFor(f, 0);
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

// /mob/living/simple_animal/hostile/carp/ranged/proc/<init>  (code/modules/events/wizard/magicarp.dm:40)
rt.def("/mob/living/simple_animal/hostile/carp/ranged/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed_projectile_types", rt.list(T("/obj/item/projectile/magic/change"), T("/obj/item/projectile/magic/animate"), T("/obj/item/projectile/magic/resurrection"), T("/obj/item/projectile/magic/death"), T("/obj/item/projectile/magic/teleport"), T("/obj/item/projectile/magic/door"), T("/obj/item/projectile/magic/aoe/fireball"), T("/obj/item/projectile/magic/spellblade"), T("/obj/item/projectile/magic/arcane_barrage")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/carp/ranged/proc/Initialize  (code/modules/events/wizard/magicarp.dm:45)  may sleep
rt.def("/mob/living/simple_animal/hostile/carp/ranged/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "projectiletype", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "allowed_projectile_types")]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(4904, "/mob/living/simple_animal/hostile/carp/ranged/chaos", "/mob/living/simple_animal/hostile/carp/ranged", {
	name: "chaos magicarp",
	desc: "50% carp, 100% magic, 150% horrible.",
	color: "#00FFFF",
	maxHealth: 75,
	health: 75,
});

// /mob/living/simple_animal/hostile/carp/ranged/chaos/proc/Shoot  (code/modules/events/wizard/magicarp.dm:56)  may sleep
rt.def("/mob/living/simple_animal/hostile/carp/ranged/chaos/proc/Shoot", function* Shoot(f: Frame) {
	rt.setSv(f, "projectiletype", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "allowed_projectile_types")]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
