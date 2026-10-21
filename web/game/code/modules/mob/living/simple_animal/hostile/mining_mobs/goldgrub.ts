// From code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5007, "/mob/living/simple_animal/hostile/asteroid/goldgrub", "/mob/living/simple_animal/hostile/asteroid", {
	chase_time: 100,
	will_burrow: 1,
	vision_range: 2,
	aggro_vision_range: 9,
	idle_vision_range: 2,
	move_to_delay: 5,
	search_objects: 1,
	name: "goldgrub",
	desc: "A worm that grows fat from eating everything in its sight. Seems to enjoy precious metals and other shiny things, hence the name.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Goldgrub",
	icon_living: "Goldgrub",
	icon_aggro: "Goldgrub_alert",
	icon_dead: "Goldgrub_dead",
	icon_gib: "syndicate_gib",
	friendly: "harmlessly rolls into",
	maxHealth: 45,
	health: 45,
	harm_intent_damage: 5,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	attacktext: "barrels into",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "help",
	speak_emote: null,
	throw_message: "sinks in slowly, before being pushed out of ",
	deathmessage: "spits up the contents of its stomach before dying!",
	status_flags: 8,
	wanted_objects: null,
});

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:24)
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("screeches"));
	$0 = $0;
	rt.setSv(f, "wanted_objects", rt.list(T("/obj/item/weapon/ore/diamond"), T("/obj/item/weapon/ore/gold"), T("/obj/item/weapon/ore/silver"), T("/obj/item/weapon/ore/uranium")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:36)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	while (truthy(live(i))) {
		rt.modSrcVar(f, "loot", rt.op(f, "PickUnweighted", [4], [T("/obj/item/weapon/ore/silver"), T("/obj/item/weapon/ore/gold"), T("/obj/item/weapon/ore/uranium"), T("/obj/item/weapon/ore/diamond")]), add);
		i = rt.inc(live(i), -1);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/GiveTarget  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:43)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	f.vars = () => [new_target];
	rt.setSv(f, "target", live(new_target));
	if (rt.sv(f, "target") === null) return f.dot;
	if ((truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/ore")) ? 1 : 0)) && rt.lt(rt.len(f, rt.sv(f, "loot")), 10))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>The ＀ looks at ＀ with hungry eyes.</span>", [rt.fv(f, "name", live(f.src)), rt.fv(f, "name", rt.sv(f, "target"))]));
	} else {
		if (!truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) return f.dot;
		yield* g.srcCall(f, "Aggro");
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ tries to flee from ＀!</span>", [rt.fv(f, "name", live(f.src)), rt.fv(f, "name", rt.sv(f, "target"))]));
		rt.setSv(f, "retreat_distance", 10);
		rt.setSv(f, "minimum_distance", 10);
		if (!truthy(rt.sv(f, "will_burrow"))) return f.dot;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Burrow")])), rt.sv(f, "chase_time")]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:56)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/ore")) ? 1 : 0))) {
		yield* g.srcCall(f, "EatOre", rt.sv(f, "target"));
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/EatOre  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:62)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/EatOre", function* EatOre(f: Frame, targeted_ore: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [targeted_ore, O, $e];
	O = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(targeted_ore)), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.lt(rt.len(f, rt.sv(f, "loot")), 10)) {
			rt.modSrcVar(f, "loot", rt.fv(f, "type", live(O)), add);
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "visible_message", "<span class='notice'>The ore was swallowed whole!</span>");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Burrow  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:69)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/Burrow", function* Burrow(f: Frame) {
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ buries into the ground, vanishing from sight!</span>", [rt.fv(f, "name", live(f.src))]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:74)
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	rt.callSrc(f, "visible_message", [fmt("<span class='danger'>The ＀ was repelled by ＀'s girth!</span>", [rt.fv(f, "name", live(_P)), rt.fv(f, "name", live(f.src))])]);
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/asteroid/goldgrub/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goldgrub.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goldgrub/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	rt.setSv(f, "idle_vision_range", 9);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });
