// From code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5008, "/mob/living/simple_animal/hostile/asteroid/goliath", "/mob/living/simple_animal/hostile/asteroid", {
	pre_attack: 0,
	pre_attack_icon: "Goliath_preattack",
	move_to_delay: 40,
	ranged: 1,
	ranged_cooldown_time: 120,
	vision_range: 4,
	aggro_vision_range: 9,
	idle_vision_range: 5,
	anchored: 1,
	name: "goliath",
	desc: "A massive beast that uses long tentacles to ensare its prey, threatening them is not advised under any conditions.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Goliath",
	icon_living: "Goliath",
	icon_aggro: "Goliath_alert",
	icon_dead: "Goliath_dead",
	icon_gib: "syndicate_gib",
	mouse_opacity: 2,
	friendly: "wails at",
	speak_emote: null,
	speed: 3,
	maxHealth: 300,
	health: 300,
	harm_intent_damage: 0,
	obj_damage: 100,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	attacktext: "pulverizes",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	throw_message: "does nothing to the rocky hide of the",
	loot: null,
});

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:16)
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("bellows"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/stack/sheet/animalhide/goliath_hide")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/Life  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:36)
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/Life", function Life(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "handle_preattack", []);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/handle_preattack  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:40)
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/handle_preattack", function handle_preattack(f: Frame) {
	if ((rt.le(rt.sv(f, "ranged_cooldown"), add(rt.worldTime(f), multiply(rt.sv(f, "ranged_cooldown_time"), 0.25))) && !truthy(rt.sv(f, "pre_attack")))) {
		rt.incSrcVar(f, "pre_attack", 1, true);
	}
	if (((!truthy(rt.sv(f, "pre_attack")) || truthy(rt.sv(f, "stat"))) || isEqual(rt.sv(f, "AIStatus"), 2))) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", rt.sv(f, "pre_attack_icon"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/revive  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:47)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "anchored", 1);
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/death  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:53)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	rt.setSv(f, "anchored", 0);
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:56)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/OpenFire", function* OpenFire(f: Frame) {
	let tturf: Value = null;
	f.vars = () => [tturf];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(tturf = rt.getStep(f, rt.sv(f, "target"), 0))])))) {
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), 7)) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The ＀ digs its tentacles under ＀!</span>", [rt.fv(f, "name", live(f.src)), rt.fv(f, "name", rt.sv(f, "target"))]));
	yield* g.new_(f, T("/obj/effect/goliath_tentacle/original"), [live(tturf)]);
	rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	rt.setSv(f, "icon_state", rt.sv(f, "icon_aggro"));
	rt.setSv(f, "pre_attack", 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:67)  may sleep
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	(rt.modSrcVar(f, "ranged_cooldown", 10, subtract));
	yield* g.srcCall(f, "handle_preattack");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/asteroid/goliath/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:72)
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/proc/Aggro", function Aggro(f: Frame) {
	rt.setSv(f, "vision_range", rt.sv(f, "aggro_vision_range"));
	rt.callSrc(f, "handle_preattack", []);
	if (isEqual(rt.sv(f, "icon_state"), rt.sv(f, "icon_aggro"))) return f.dot;
	rt.setSv(f, "icon_state", rt.sv(f, "icon_aggro"));
	return f.dot;
});

rt.type(5009, "/mob/living/simple_animal/hostile/asteroid/goliath/beast", "/mob/living/simple_animal/hostile/asteroid/goliath", {
	pre_attack_icon: "goliath2",
	stat_attack: 1,
	robust_searching: 1,
	name: "goliath",
	desc: "A hulking, armor-plated beast with long tendrils arching from its back.",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "goliath",
	icon_living: "goliath",
	icon_aggro: "goliath",
	icon_dead: "goliath_dead",
	throw_message: "does nothing to the tough hide of the",
	crusher_loot: rt.typePath("/obj/item/crusher_trophy/goliath_tentacle"),
	butcher_results: null,
	loot: null,
});

// /mob/living/simple_animal/hostile/asteroid/goliath/beast/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:89)
rt.def("/mob/living/simple_animal/hostile/asteroid/goliath/beast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/goliath"), 2, T("/obj/item/stack/sheet/animalhide/goliath_hide"), 1, T("/obj/item/stack/sheet/bone"), 2]));
	$0 = $0;
	rt.setSv(f, "loot", rt.list());
	return f.dot;
});

rt.type(12087, "/obj/effect/goliath_tentacle", "/obj/effect", {
	latched: 0,
	anchored: 1,
	name: "Goliath tentacle",
	icon: rt.rsc("icons/mob/lavaland/lavaland_monsters.dmi"),
	icon_state: "Goliath_tentacle",
});

// /obj/effect/goliath_tentacle/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:106)  may sleep
rt.def("/obj/effect/goliath_tentacle/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/turf/closed/mineral")) ? 1 : 0))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "gets_drilled", []);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/goliath_tentacle/proc/Trip")])), 10]);
	return f.dot;
}, true);

rt.type(12088, "/obj/effect/goliath_tentacle/original", "/obj/effect/goliath_tentacle", {});

// /obj/effect/goliath_tentacle/original/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:113)  may sleep
rt.def("/obj/effect/goliath_tentacle/original/proc/Initialize", function* Initialize(f: Frame) {
	let O: Value = null, directions: Value = null, i: Value = null, spawndir: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [O, directions, i, spawndir, _T, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	O = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/effect/goliath_tentacle/original"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!isEqual(live(O), live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	directions = (yield* g.callName(f, rt.gl("cardinal"), "Copy", []));
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(directions = rt.modify(live(directions), (spawndir = rt.op(f, "PickUnweighted", [1], [live(directions)])), subtract));
		if (truthy((_T = rt.getStep(f, live(f.src), live(spawndir))))) {
			yield* g.new_(f, T("/obj/effect/goliath_tentacle"), [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/goliath_tentacle/proc/Trip  (code/modules/mob/living/simple_animal/hostile/mining_mobs/goliath.dm:126)  may sleep
rt.def("/obj/effect/goliath_tentacle/proc/Trip", function* Trip(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ grabs hold of ＀!</span>", [rt.fv(f, "name", live(f.src)), rt.fv(f, "name", live(M))]));
		yield* g.callName(f, live(M), "Stun", [100]);
		yield* g.callName(f, live(M), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [10, 15]))]);
		rt.setSv(f, "latched", 1);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "latched"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 50, 8]);
	}
	return f.dot;
}, true);
