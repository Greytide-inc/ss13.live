// From code/modules/mob/living/simple_animal/friendly/farm_animals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4934, "/mob/living/simple_animal/hostile/retaliate/goat", "/mob/living/simple_animal/hostile/retaliate", {
	udder: null,
	name: "goat",
	desc: "Not known for their pleasant disposition.",
	icon_state: "goat",
	icon_living: "goat",
	icon_dead: "goat_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	see_in_dark: 6,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	faction: null,
	attack_same: 1,
	attacktext: "kicks",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	health: 40,
	maxHealth: 40,
	melee_damage_lower: 1,
	melee_damage_upper: 2,
	environment_smash: 0,
	stop_automated_movement_when_pulled: 1,
	blood_volume: 560,
});

// /mob/living/simple_animal/hostile/retaliate/goat/proc/<init>  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:9)
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("EHEHEHEHEH", "eh?"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("brays"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("brays."));
	rt.setSv(f, "emote_see", rt.list("shakes its head.", "stamps a foot.", "glares around."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 4]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("neutral"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/goat/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:33)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "udder", (yield* g.new_(f, T("/obj/item/udder"), [])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/retaliate/goat/proc/Destroy  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:37)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "udder")]);
	rt.setSv(f, "udder", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/retaliate/goat/proc/Life  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:42)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Life", function* Life(f: Frame) {
	let direction: Value = null, step: Value = null;
	let $e: any;
	f.vars = () => [direction, step, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		if ((!truthy(rt.len(f, rt.sv(f, "enemies"))) && truthy(rt.op(f, "Prob", [], [1])))) {
			yield* g.srcCall(f, "Retaliate");
		}
		if ((truthy(rt.len(f, rt.sv(f, "enemies"))) && truthy(rt.op(f, "Prob", [], [10])))) {
			rt.setSv(f, "enemies", rt.list());
			yield* g.srcCall(f, "LoseTarget");
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>＀ calms down.</span>", [live(f.src)])]);
		}
	}
	if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
	yield* g.callName(f, rt.sv(f, "udder"), "generateMilk", []);
	yield* g.srcCall(f, "eat_plants");
	if (truthy(rt.sv(f, "pulledby"))) return f.dot;
	direction = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [rt.list(1, 2, 4, 8, 5, 6, 9, 10)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (truthy((step = rt.getStep(f, live(f.src), live(direction))))) {
			if (truthy(rt.locateIn(f, T("/obj/structure/spacevine"), (live(step) || rt.locateIn(f, T("/obj/structure/glowshroom"), live(step)))))) {
				yield* g.srcCall(f, "Move", live(step), rt.getDir(f, live(f.src), live(step)));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/retaliate/goat/proc/Retaliate  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:63)
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Retaliate", function Retaliate(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, live(f.src), "visible_message", [fmt("<span class='danger'>＀ gets an evil-looking gleam in ＀ eye.</span>", [live(f.src), rt.callSrc(f, "p_their", [])])]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/retaliate/goat/proc/Move  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:67)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "eat_plants");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/retaliate/goat/proc/eat_plants  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:73)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/eat_plants", function* eat_plants(f: Frame) {
	let eaten: Value = null, SV: Value = null, GS: Value = null;
	f.vars = () => [eaten, SV, GS];
	eaten = 0;
	if (truthy((SV = rt.locateIn(f, T("/obj/structure/spacevine"), rt.sv(f, "loc"))))) {
		yield* g.callName(f, live(SV), "eat", [live(f.src)]);
		eaten = 1;
	}
	if (truthy((GS = rt.locateIn(f, T("/obj/structure/glowshroom"), rt.sv(f, "loc"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(GS)]);
		eaten = 1;
	}
	if (!(truthy(live(eaten)) && truthy(rt.op(f, "Prob", [], [10])))) return f.dot;
	yield* g.srcCall(f, "say", "Nom");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/retaliate/goat/proc/attackby  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:87)  may sleep
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/attackby", function* attackby(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 0) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "udder"), "milkAnimal", [live(f.args[0]), live(f.args[1])]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

rt.type(5082, "/mob/living/simple_animal/cow", "/mob/living/simple_animal", {
	udder: null,
	icon_living: "cow",
	icon_dead: "cow_dead",
	icon_gib: "cow_gib",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	attacktext: "kicks",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	gold_core_spawnable: 2,
	name: "cow",
	desc: "Known for their milk, just don't tip them over.",
	icon_state: "cow",
	gender: "female",
	see_in_dark: 6,
	butcher_results: null,
	health: 50,
	maxHealth: 50,
	blood_volume: 560,
});

// /mob/living/simple_animal/cow/proc/<init>  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:104)
rt.def("/mob/living/simple_animal/cow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("moo?", "moo", "MOOOOOO"));
	rt.setSv(f, "speak_emote", rt.list("moos", "moos hauntingly"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("brays."));
	$0 = $0;
	rt.setSv(f, "emote_see", rt.list("shakes its head."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 6]));
	return f.dot;
});

// /mob/living/simple_animal/cow/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:122)  may sleep
rt.def("/mob/living/simple_animal/cow/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "udder", (yield* g.new_(f, T("/obj/item/udder"), [])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/cow/proc/Destroy  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:126)  may sleep
rt.def("/mob/living/simple_animal/cow/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "udder")]);
	rt.setSv(f, "udder", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/cow/proc/attackby  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:131)  may sleep
rt.def("/mob/living/simple_animal/cow/proc/attackby", function* attackby(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 0) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "udder"), "milkAnimal", [live(f.args[0]), live(f.args[1])]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /mob/living/simple_animal/cow/proc/Life  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:138)  may sleep
rt.def("/mob/living/simple_animal/cow/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(rt.sv(f, "stat"), 0)) return f.dot;
	yield* g.callName(f, rt.sv(f, "udder"), "generateMilk", []);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/cow/proc/attack_hand  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:143)  may sleep
rt.def("/mob/living/simple_animal/cow/proc/attack_hand", function* attack_hand(f: Frame) {
	let external: Value = null, internal: Value = null, text: Value = null;
	f.vars = () => [external, internal, text];
	if (((!truthy(rt.sv(f, "stat")) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm")) && !isEqual(rt.sv(f, "icon_state"), rt.sv(f, "icon_dead")))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ tips over ＀.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You tip over ＀.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='userdanger'>You are tipped over by ＀!</span>", [live(f.args[0])])]);
		yield* g.srcCall(f, "Knockdown", 60);
		rt.setSv(f, "icon_state", rt.sv(f, "icon_dead"));
		rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [20, 50])), "/mob/living/simple_animal/cow/proc/attack_hand: spawn at modules/mob/living/simple_animal/friendly/farm_animals.dm:148", external, internal, text);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M"] });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [20, 50]))) body of /mob/living/simple_animal/cow/proc/attack_hand, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/cow/proc/attack_hand: spawn at modules/mob/living/simple_animal/friendly/farm_animals.dm:148", function* (f: Frame, external: Value, internal: Value, text: Value) {
	let $0: any;
	f.vars = () => [external, internal, text, $0];
	if ((!truthy(rt.sv(f, "stat")) && truthy(live(f.args[0])))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_living"));
		external = null;
		internal = null;
		$0 = rt.op(f, "PickUnweighted", [4], [1, 2, 3, 4]);
		if ($0 === 1 || $0 === 2 || $0 === 3) {
			text = rt.op(f, "PickUnweighted", [3], ["imploringly.", "pleadingly.", "with a resigned expression."]);
			external = fmt("＀ looks at ＀ ＀", [live(f.src), live(f.args[0]), live(text)]);
			internal = fmt("You look at ＀ ＀", [live(f.args[0]), live(text)]);
		} else if ($0 === 4) {
			external = fmt("＀ seems resigned to its fate.", [live(f.src)]);
			internal = "You resign yourself to your fate.";
		}
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀</span>", [live(external)]), fmt("<span class='revennotice'>＀</span>", [live(internal)]));
	}
	return null;
});

rt.type(5083, "/mob/living/simple_animal/chick", "/mob/living/simple_animal", {
	amount_grown: 0,
	icon_living: "chick",
	icon_dead: "chick_dead",
	icon_gib: "chick_gib",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 2,
	turns_per_move: 2,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	attacktext: "kicks",
	pass_flags: 21,
	gold_core_spawnable: 2,
	name: "１chick",
	desc: "Adorable! They make such a racket though.",
	icon_state: "chick",
	gender: "female",
	density: 0,
	butcher_results: null,
	health: 3,
	maxHealth: 3,
	ventcrawler: 2,
	mob_size: 0,
});

// /mob/living/simple_animal/chick/proc/<init>  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:177)
rt.def("/mob/living/simple_animal/chick/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Cherp.", "Cherp?", "Chirrup.", "Cheep!"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("cheeps"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("cheeps."));
	rt.setSv(f, "emote_see", rt.list("pecks at the ground.", "flaps its tiny wings."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/chick/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:197)  may sleep
rt.def("/mob/living/simple_animal/chick/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-6, 6])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [0, 10])));
	return f.dot;
}, true);

// /mob/living/simple_animal/chick/proc/Life  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:202)  may sleep
rt.def("/mob/living/simple_animal/chick/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!(!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "ckey")))) return f.dot;
	if (!rt.ge((rt.modSrcVar(f, "amount_grown", (yield* g.call(f, P("/proc/rand"), null, [1, 2])), add)), 100)) return f.dot;
	yield* g.new_(f, T("/mob/living/simple_animal/chicken"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(5084, "/mob/living/simple_animal/chick/holo", "/mob/living/simple_animal/chick", {});

// /mob/living/simple_animal/chick/holo/proc/Life  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:212)
rt.def("/mob/living/simple_animal/chick/holo/proc/Life", function Life(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "amount_grown", 0);
	return f.dot;
}, false, { waitfor: false });

rt.type(5069, "/mob/living/simple_animal/chicken", "/mob/living/simple_animal", {
	eggsleft: 0,
	eggsFertile: 1,
	body_color: null,
	icon_prefix: "chicken",
	feedMessages: null,
	layMessage: null,
	validColors: null,
	egg_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/egg"),
	food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"),
	pass_flags: 17,
	name: "１chicken",
	desc: "Hopefully the eggs are good this season.",
	gender: "female",
	icon_state: "chicken_brown",
	icon_living: "chicken_brown",
	icon_dead: "chicken_brown_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	density: 0,
	speak_chance: 2,
	turns_per_move: 3,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	attacktext: "kicks",
	health: 15,
	maxHealth: 15,
	ventcrawler: 2,
	mob_size: 1,
	gold_core_spawnable: 2,
}, { global: { chicken_count: 725 } });

// /mob/living/simple_animal/chicken/proc/<init>  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:224)
rt.def("/mob/living/simple_animal/chicken/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "feedMessages", rt.list("It clucks happily.", "It clucks happily."));
	rt.setSv(f, "layMessage", rt.list("lays an egg.", "squats down and croons.", "begins making a huge racket.", "begins clucking raucously."));
	rt.setSv(f, "validColors", rt.list("brown", "black", "white"));
	rt.setSv(f, "speak", rt.list("Cluck!", "BWAAAAARK BWAK BWAK BWAK!", "Bwaak bwak."));
	rt.setSv(f, "speak_emote", rt.list("clucks", "croons"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("clucks."));
	rt.setSv(f, "emote_see", rt.list("pecks at the ground.", "flaps its wings viciously."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]));
	return f.dot;
});

// /mob/living/simple_animal/chicken/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:252)  may sleep
rt.def("/mob/living/simple_animal/chicken/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "body_color"))) {
		rt.setSv(f, "body_color", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "validColors")]));
	}
	rt.setSv(f, "icon_state", fmt("＀_＀", [rt.sv(f, "icon_prefix"), rt.sv(f, "body_color")]));
	rt.setSv(f, "icon_living", fmt("＀_＀", [rt.sv(f, "icon_prefix"), rt.sv(f, "body_color")]));
	rt.setSv(f, "icon_dead", fmt("＀_＀_dead", [rt.sv(f, "icon_prefix"), rt.sv(f, "body_color")]));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-6, 6])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [0, 10])));
	rt.incGl("chicken_count", 1, false);
	return f.dot;
}, true);

// /mob/living/simple_animal/chicken/proc/Destroy  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:263)  may sleep
rt.def("/mob/living/simple_animal/chicken/proc/Destroy", function* Destroy(f: Frame) {
	rt.incGl("chicken_count", -1, false);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/chicken/proc/attackby  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:267)  may sleep
rt.def("/mob/living/simple_animal/chicken/proc/attackby", function* attackby(f: Frame) {
	let feedmsg: Value = null;
	f.vars = () => [feedmsg];
	if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "food_type")]))) {
		if ((!truthy(rt.sv(f, "stat")) && rt.lt(rt.sv(f, "eggsleft"), 8))) {
			feedmsg = fmt("＀ feeds ＀ to ＀! ＀", [live(f.args[1]), live(f.args[0]), rt.sv(f, "name"), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "feedMessages")])]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [live(feedmsg)]);
			yield* g.callName(f, live(f.args[1]), "drop_item", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			rt.modSrcVar(f, "eggsleft", (yield* g.call(f, P("/proc/rand"), null, [1, 4])), add);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't seem hungry!</span>", [rt.sv(f, "name")])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /mob/living/simple_animal/chicken/proc/Life  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:281)  may sleep
rt.def("/mob/living/simple_animal/chicken/proc/Life", function* Life(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!(((!truthy(rt.sv(f, "stat")) && truthy(rt.op(f, "Prob", [], [3]))) && rt.gt(rt.sv(f, "eggsleft"), 0)) && truthy(rt.sv(f, "egg_type")))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("＀ ＀", [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "layMessage")])]));
	rt.incSrcVar(f, "eggsleft", -1, true);
	rt.setFv(f, "pixel_x", (E = (yield* g.new_(f, rt.sv(f, "egg_type"), [rt.getStep(f, live(f.src), 0)]))), (yield* g.call(f, P("/proc/rand"), null, [-6, 6])));
	rt.setFv(f, "pixel_y", live(E), (yield* g.call(f, P("/proc/rand"), null, [-6, 6])));
	if (!truthy(rt.sv(f, "eggsFertile"))) return f.dot;
	if (!(rt.lt(rt.gl("chicken_count"), 50) && truthy(rt.op(f, "Prob", [], [25])))) return f.dot;
	if (truthy(rt.fv(f, "isprocessing", live(E)))) return f.dot;
	rt.setFv(f, "isprocessing", live(E), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(E), add);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/reagent_containers/food/snacks/egg/proc/process  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:296)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/process", function* process(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		if (rt.ge((rt.modSrcVar(f, "amount_grown", (yield* g.call(f, P("/proc/rand"), null, [1, 2])), add)), 100)) {
			yield* g.srcCall(f, "visible_message", fmt("＀ hatches with a quiet cracking sound.", [live(f.src)]));
			yield* g.new_(f, T("/mob/living/simple_animal/chick"), [rt.getStep(f, live(f.src), 0)]);
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(10121, "/obj/item/udder", "/obj/item", {
	name: "udder",
});

// /obj/item/udder/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:311)  may sleep
rt.def("/obj/item/udder/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 50);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["milk", 20]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/udder/proc/generateMilk  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:316)  may sleep
rt.def("/obj/item/udder/proc/generateMilk", function* generateMilk(f: Frame) {
	if (!truthy(rt.op(f, "Prob", [], [5]))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["milk", (yield* g.call(f, P("/proc/rand"), null, [5, 10]))]);
	return f.dot;
}, true);

// /obj/item/udder/proc/milkAnimal  (code/modules/mob/living/simple_animal/friendly/farm_animals.dm:320)  may sleep
rt.def("/obj/item/udder/proc/milkAnimal", function* milkAnimal(f: Frame, O: Value, user: Value) {
	let G: Value = null, transfered: Value = null;
	f.vars = () => [O, user, G, transfered];
	if (rt.ge(rt.gv(f, "total_volume", rt.gv(f, "reagents", (G = live(O)))), rt.fv(f, "volume", live(G)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ is full.</span>", [live(O)])]);
		return live(f.dot);
	}
	if (truthy((transfered = (yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(O), (yield* g.call(f, P("/proc/rand"), null, [5, 10]))]))))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ milks ＀ using ％！.", [live(user), live(f.src), live(O)]), fmt("<span class='notice'>You milk ＀ using ％！.</span>", [live(f.src), live(O)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The udder is dry. Wait a bit longer...</span>"]);
	}
	return f.dot;
}, true);
