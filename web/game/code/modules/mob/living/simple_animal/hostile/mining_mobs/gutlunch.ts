// From code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5011, "/mob/living/simple_animal/hostile/asteroid/gutlunch", "/mob/living/simple_animal/hostile/asteroid", {
	udder: null,
	move_to_delay: 15,
	stat_attack: 1,
	stat_exclusive: 1,
	robust_searching: 1,
	search_objects: 1,
	name: "gutlunch",
	desc: "A scavenger that eats raw meat, often found alongside ash walkers. Produces a thick, nutritious milk.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "gutlunch",
	icon_living: "gutlunch",
	icon_dead: "gutlunch",
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	weather_immunities: null,
	faction: null,
	density: 0,
	speak_chance: 1,
	turns_per_move: 8,
	obj_damage: 0,
	environment_smash: 0,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "squishes",
	friendly: "pinches",
	a_intent: "help",
	ventcrawler: 2,
	gold_core_spawnable: 2,
	gender: "neuter",
	stop_automated_movement: 0,
	stop_automated_movement_when_pulled: 1,
	del_on_death: 1,
	loot: null,
	deathmessage: "is pulped into bugmash.",
	animal_species: rt.typePath("/mob/living/simple_animal/hostile/asteroid/gutlunch"),
	childtype: null,
	wanted_objects: null,
});

// /mob/living/simple_animal/hostile/asteroid/gutlunch/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:10)
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("warbles", "quavers"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("trills."));
	rt.setSv(f, "emote_see", rt.list("sniffs.", "burps."));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	rt.setSv(f, "faction", rt.list("mining", "ashwalker"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/cleanable/blood/gibs")));
	$0 = $0;
	rt.setSv(f, "childtype", rt.alist(f, [T("/mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck"), 45, T("/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen"), 55]));
	$0 = $0;
	rt.setSv(f, "wanted_objects", rt.list(T("/obj/effect/decal/cleanable/xenoblood/xgibs"), T("/obj/effect/decal/cleanable/blood/gibs")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/gutlunch/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:45)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "udder", (yield* g.new_(f, T("/obj/item/udder/gutlunch"), [])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/gutlunch/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:49)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "udder")]);
	rt.setSv(f, "udder", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/asteroid/gutlunch/proc/regenerate_icons  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:53)
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (isEqual(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "udder"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "udder"))))) {
		rt.callSrc(f, "add_overlay", ["gl_full"]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/gutlunch/proc/attackby  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:59)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/attackby", function* attackby(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 0) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "udder"), "milkAnimal", [live(f.args[0]), live(f.args[1])]);
		yield* g.srcCall(f, "regenerate_icons");
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /mob/living/simple_animal/hostile/asteroid/gutlunch/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:66)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [rt.sv(f, "target"), rt.sv(f, "wanted_objects")])))) {
		yield* g.callName(f, rt.sv(f, "udder"), "generateMilk", []);
		yield* g.srcCall(f, "regenerate_icons");
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ slurps up ＀.</span>", [live(f.src), rt.sv(f, "target")]));
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "target")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(5012, "/mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck", "/mob/living/simple_animal/hostile/asteroid/gutlunch", {
	name: "gubbuck",
	gender: "male",
});

// /mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/gubbuck/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_atom_colour", rt.op(f, "PickUnweighted", [3], ["#E39FBB", "#D97D64", "#CF8C4A"]), 4);
	rt.setSv(f, "resize", 0.8500000238418579);
	yield* g.srcCall(f, "update_transform");
	return f.dot;
}, true);

rt.type(5013, "/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen", "/mob/living/simple_animal/hostile/asteroid/gutlunch", {
	name: "guthen",
	gender: "female",
});

// /mob/living/simple_animal/hostile/asteroid/gutlunch/guthen/proc/Life  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:90)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen/proc/Life", function* Life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "udder"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "udder"))))) return f.dot;
	yield* g.srcCall(f, "make_babies");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/asteroid/gutlunch/guthen/proc/make_babies  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:95)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/gutlunch/guthen/proc/make_babies", function* make_babies(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "udder")), "clear_reagents", []);
	yield* g.srcCall(f, "regenerate_icons");
	return f.dot;
}, true);

rt.type(10122, "/obj/item/udder/gutlunch", "/obj/item/udder", {
	name: "nutrient sac",
});

// /obj/item/udder/gutlunch/proc/New  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:105)  may sleep
rt.def("/obj/item/udder/gutlunch/proc/New", function* New(f: Frame) {
	rt.setSv(f, "reagents", (yield* g.new_(f, T("/datum/reagents"), [50])));
	rt.setFv(f, "my_atom", rt.sv(f, "reagents"), live(f.src));
	return f.dot;
}, true);

// /obj/item/udder/gutlunch/proc/generateMilk  (code/modules/mob/living/simple_animal/hostile/mining_mobs/gutlunch.dm:109)  may sleep
rt.def("/obj/item/udder/gutlunch/proc/generateMilk", function* generateMilk(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [60]))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["cream", (yield* g.call(f, P("/proc/rand"), null, [2, 5]))]);
	}
	if (!truthy(rt.op(f, "Prob", [], [45]))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["salglu_solution", (yield* g.call(f, P("/proc/rand"), null, [2, 5]))]);
	return f.dot;
}, true);
