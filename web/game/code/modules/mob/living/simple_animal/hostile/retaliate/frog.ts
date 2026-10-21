// From code/modules/mob/living/simple_animal/hostile/retaliate/frog.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4937, "/mob/living/simple_animal/hostile/retaliate/frog", "/mob/living/simple_animal/hostile/retaliate", {
	pass_flags: 21,
	name: "frog",
	desc: "It seems a little sad.",
	icon_state: "frog",
	icon_living: "frog",
	icon_dead: "frog_dead",
	speak: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	maxHealth: 15,
	health: 15,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	attacktext: "bites",
	response_help: "pets",
	response_disarm: "pokes",
	response_harm: "splats",
	density: 0,
	ventcrawler: 2,
	faction: null,
	attack_sound: rt.rsc("sound/effects/reee.ogg"),
	butcher_results: null,
	mob_size: 0,
	gold_core_spawnable: 1,
});

// /mob/living/simple_animal/hostile/retaliate/frog/proc/<init>  (code/modules/mob/living/simple_animal/hostile/retaliate/frog.dm:21)
rt.def("/mob/living/simple_animal/hostile/retaliate/frog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("ribbit", "croak"));
	rt.setSv(f, "emote_see", rt.list("hops in a circle.", "shakes."));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("hostile"));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/nugget"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/frog/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/retaliate/frog.dm:29)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/frog/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	rt.setSv(f, "name", "rare frog");
	rt.setSv(f, "desc", "It seems a little smug.");
	rt.setSv(f, "icon_state", "rare_frog");
	rt.setSv(f, "icon_living", "rare_frog");
	rt.setSv(f, "icon_dead", "rare_frog_dead");
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/nugget"), 5]));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/retaliate/frog/proc/Crossed  (code/modules/mob/living/simple_animal/hostile/retaliate/frog.dm:39)
rt.def("/mob/living/simple_animal/hostile/retaliate/frog/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (!(!truthy(rt.sv(f, "stat")) && truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if (!rt.gt(rt.gv(f, "mob_size", (L = live(AM))), 0)) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/huuu.ogg"), 50, 1]);
	return f.dot;
});
