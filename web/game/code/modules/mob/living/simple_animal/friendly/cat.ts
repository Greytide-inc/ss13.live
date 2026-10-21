// From code/modules/mob/living/simple_animal/friendly/cat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5057, "/mob/living/simple_animal/pet/cat", "/mob/living/simple_animal/pet", {
	turns_since_scan: 0,
	movement_target: null,
	pass_flags: 1,
	name: "cat",
	desc: "Kitty!!",
	icon: rt.rsc("icons/mob/pets.dmi"),
	icon_state: "cat2",
	icon_living: "cat2",
	icon_dead: "cat2_dead",
	gender: "male",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	see_in_dark: 6,
	ventcrawler: 2,
	mob_size: 1,
	minbodytemp: 200,
	maxbodytemp: 400,
	unsuitable_atmos_damage: 1,
	animal_species: rt.typePath("/mob/living/simple_animal/pet/cat"),
	childtype: null,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	gold_core_spawnable: 2,
});

// /mob/living/simple_animal/pet/cat/proc/<init>  (code/modules/mob/living/simple_animal/friendly/cat.dm:24)
rt.def("/mob/living/simple_animal/pet/cat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Meow!", "Esp!", "Purr!", "HSSSSS"));
	rt.setSv(f, "speak_emote", rt.list("purrs", "meows"));
	rt.setSv(f, "emote_hear", rt.list("meows", "mews"));
	rt.setSv(f, "emote_see", rt.list("shakes its head", "shivers"));
	$0 = $0;
	rt.setSv(f, "childtype", rt.list(T("/mob/living/simple_animal/pet/cat/kitten")));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]));
	return f.dot;
});

// /mob/living/simple_animal/pet/cat/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/cat.dm:34)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/lay_down"), add);
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/cat/proc/update_canmove  (code/modules/mob/living/simple_animal/friendly/cat.dm:38)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/proc/update_canmove", function* update_canmove(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	if (truthy(rt.sv(f, "resting"))) {
		rt.setSv(f, "icon_state", fmt("＀_rest", [rt.sv(f, "icon_living")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "icon_living")]));
	}
	return f.dot;
}, true);

rt.type(5061, "/mob/living/simple_animal/pet/cat/Runtime", "/mob/living/simple_animal/pet/cat", {
	family: null,
	children: null,
	cats_deployed: 0,
	memory_saved: 0,
	name: "Runtime",
	desc: "GCAT",
	icon_state: "cat",
	icon_living: "cat",
	icon_dead: "cat_dead",
	gender: "female",
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/pet/cat/Runtime/proc/<init>  (code/modules/mob/living/simple_animal/friendly/cat.dm:83)
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "family", rt.list());
	$0 = $0;
	rt.setSv(f, "children", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/pet/cat/Runtime/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/cat.dm:89)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		rt.setSv(f, "icon_state", "original");
		rt.setSv(f, "icon_living", "original");
		rt.setSv(f, "icon_dead", "original_dead");
	}
	yield* g.srcCall(f, "Read_Memory");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/cat/Runtime/proc/Life  (code/modules/mob/living/simple_animal/friendly/cat.dm:97)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Life", function* Life(f: Frame) {
	if ((!truthy(rt.sv(f, "cats_deployed")) && rt.ge(rt.fv(f, "current_state", rt.gl("SSticker")), 2))) {
		yield* g.srcCall(f, "Deploy_The_Cats");
	}
	if (((!truthy(rt.sv(f, "stat")) && isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 4)) && !truthy(rt.sv(f, "memory_saved")))) {
		yield* g.srcCall(f, "Write_Memory");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/pet/cat/Runtime/proc/make_babies  (code/modules/mob/living/simple_animal/friendly/cat.dm:104)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/make_babies", function* make_babies(f: Frame) {
	let baby: Value = null;
	f.vars = () => [baby];
	if (!truthy((baby = (yield* g.callSuper(f, [], rt.Args.Same))))) return f.dot;
	rt.modSrcVar(f, "children", live(baby), add);
	return live(baby);
}, true);

// /mob/living/simple_animal/pet/cat/Runtime/proc/death  (code/modules/mob/living/simple_animal/friendly/cat.dm:110)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/death", function* death(f: Frame) {
	if (!truthy(rt.sv(f, "memory_saved"))) {
		yield* g.srcCall(f, "Write_Memory", 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/cat/Runtime/proc/Read_Memory  (code/modules/mob/living/simple_animal/friendly/cat.dm:115)
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Read_Memory", function Read_Memory(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setSv(f, "family", rt.input(f, rt.R.index, null, [(S = rt.new_(f, T("/savefile"), ["data/npc_saves/Runtime.sav"])), "family"]));
	if (rt.sv(f, "family") !== null) return f.dot;
	rt.setSv(f, "family", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/pet/cat/Runtime/proc/Write_Memory  (code/modules/mob/living/simple_animal/friendly/cat.dm:122)
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Write_Memory", function Write_Memory(f: Frame, dead: Value) {
	let S: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [S, C, $e];
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/Runtime.sav"]);
	rt.setSv(f, "family", rt.list());
	if (!truthy(live(dead))) {
		C = null;
		rt.forList(f, 0, rt.sv(f, "children"), T("/mob/living/simple_animal/pet/cat/kitten"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((((truthy(rt.op(f, "IsType", [], [live(C), rt.sv(f, "type")])) || truthy(rt.fv(f, "stat", live(C)))) || !truthy(rt.fv(f, "z", live(C)))) || !truthy(rt.fv(f, "butcher_results", live(C))))) {
				continue;
			}
			if (truthy((rt.isIn(f, rt.fv(f, "type", live(C)), rt.sv(f, "family")) ? 1 : 0))) {
				rt.modAt(rt.sv(f, "family"), rt.fv(f, "type", live(C)), 1, add);
			} else {
				rt.setAt(rt.sv(f, "family"), rt.fv(f, "type", live(C)), 1);
			}
		}
		rt.endFor(f, 0);
	}
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "family", rt.sv(f, "family")], false);
	rt.setSv(f, "memory_saved", 1);
	return f.dot;
});

// /mob/living/simple_animal/pet/cat/Runtime/proc/Deploy_The_Cats  (code/modules/mob/living/simple_animal/friendly/cat.dm:137)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Deploy_The_Cats", function* Deploy_The_Cats(f: Frame) {
	let cat_type: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [cat_type, i, $e];
	rt.setSv(f, "cats_deployed", 1);
	cat_type = null;
	rt.forList(f, 0, rt.sv(f, "family"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cat_type = $e;
		if (rt.gt(rt.index(rt.sv(f, "family"), live(cat_type)), 0)) {
			i = null;
			rt.forRange(f, 1, 1, (yield* g.call(f, P("/proc/min"), null, [rt.index(rt.sv(f, "family"), live(cat_type)), 100])), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				yield* g.new_(f, live(cat_type), [rt.sv(f, "loc")]);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/cat/proc/Life  (code/modules/mob/living/simple_animal/friendly/cat.dm:148)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/proc/Life", function* Life(f: Frame) {
	let M: Value = null, _T: Value = null, snack: Value = null;
	let $e: any;
	f.vars = () => [M, _T, snack, $e];
	if (((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "buckled"))) && !truthy(rt.sv(f, "client")))) {
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [3], ["stretches out for a belly rub.", "wags its tail.", "lies down."]));
			rt.setSv(f, "icon_state", fmt("＀_rest", [rt.sv(f, "icon_living")]));
			rt.setSv(f, "resting", 1);
			yield* g.srcCall(f, "update_canmove");
		} else {
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [3], ["sits down.", "crouches on its hind legs.", "looks alert."]));
				rt.setSv(f, "icon_state", fmt("＀_sit", [rt.sv(f, "icon_living")]));
				rt.setSv(f, "resting", 1);
				yield* g.srcCall(f, "update_canmove");
			} else {
				if (truthy(rt.op(f, "Prob", [], [1]))) {
					if (truthy(rt.sv(f, "resting"))) {
						yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [3], ["gets up and meows.", "walks around.", "stops resting."]));
						rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "icon_living")]));
						rt.setSv(f, "resting", 0);
						yield* g.srcCall(f, "update_canmove");
					} else {
						yield* g.srcCall(f, "emote", "me", 1, rt.op(f, "PickUnweighted", [3], ["grooms its fur.", "twitches its whiskers.", "shakes out its coat."]));
					}
				}
			}
		}
	}
	if ((truthy(rt.fv(f, "loc", live(f.src))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))))) {
		if (((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled")))) {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)])), T("/mob/living/simple_animal/mouse"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((!truthy(rt.fv(f, "stat", live(M))) && truthy((yield* g.srcCall(f, "Adjacent", live(M)))))) {
					yield* g.srcCall(f, "emote", "me", 1, fmt("splats ％！!", [live(M)]));
					yield* g.callName(f, live(M), "splat", []);
					rt.setSv(f, "movement_target", null);
					rt.setSv(f, "stop_automated_movement", 0);
					break;
				}
			}
			rt.endFor(f, 0);
			_T = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)])), T("/obj/item/toy/cattoy"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (rt.lt(rt.fv(f, "cooldown", live(_T)), subtract(rt.worldTime(f), 400))) {
					yield* g.srcCall(f, "emote", "me", 1, fmt("bats ％！ around with its paw!", [live(_T)]));
					rt.setFv(f, "cooldown", live(_T), rt.worldTime(f));
				}
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "make_babies");
	if (!((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "resting"))) && !truthy(rt.sv(f, "buckled")))) return f.dot;
	rt.incSrcVar(f, "turns_since_scan", 1, true);
	if (!rt.gt(rt.sv(f, "turns_since_scan"), 5)) return f.dot;
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	rt.setSv(f, "turns_since_scan", 0);
	if ((truthy(rt.sv(f, "movement_target")) && !(truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "movement_target"))]))) || truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "movement_target")), T("/mob/living/carbon/human")) ? 1 : 0))))) {
		rt.setSv(f, "movement_target", null);
		rt.setSv(f, "stop_automated_movement", 0);
	}
	if ((!truthy(rt.sv(f, "movement_target")) || !truthy((rt.isIn(f, rt.fv(f, "loc", rt.sv(f, "movement_target")), (yield* g.call(f, P("/proc/oview"), null, [live(f.src), 3]))) ? 1 : 0)))) {
		rt.setSv(f, "movement_target", null);
		rt.setSv(f, "stop_automated_movement", 0);
		snack = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [live(f.src), 3])), T("/mob/living/simple_animal/mouse"));
		while (($e = rt.next(f, 0)) !== undefined) {
			snack = $e;
			if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(snack))]))) && !truthy(rt.fv(f, "stat", live(snack))))) {
				rt.setSv(f, "movement_target", live(snack));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "movement_target"))) return f.dot;
	rt.setSv(f, "stop_automated_movement", 1);
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "movement_target"), 0, 3]);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/pet/cat/proc/attack_hand  (code/modules/mob/living/simple_animal/friendly/cat.dm:207)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/proc/attack_hand", function* attack_hand(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "help") {
		yield* g.srcCall(f, "wuv", 1, live(f.args[0]));
	} else if ($0 === "harm") {
		yield* g.srcCall(f, "wuv", -1, live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/pet/cat/proc/wuv  (code/modules/mob/living/simple_animal/friendly/cat.dm:216)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/proc/wuv", function* wuv(f: Frame, change: Value, M: Value) {
	f.vars = () => [change, M];
	if (!truthy(live(change))) return f.dot;
	if (rt.gt(live(change), 0)) {
		if ((truthy(live(M)) && !isEqual(rt.sv(f, "stat"), 2))) {
			yield* g.new_(f, T("/obj/effect/temp_visual/heart"), [rt.sv(f, "loc")]);
			yield* g.srcCall(f, "emote", "me", 1, "purrs!");
		}
	} else {
		if (!(truthy(live(M)) && !isEqual(rt.sv(f, "stat"), 2))) return f.dot;
		yield* g.srcCall(f, "emote", "me", 1, "hisses!");
	}
	return f.dot;
}, true);

rt.type(5063, "/mob/living/simple_animal/pet/cat/cak", "/mob/living/simple_animal/pet/cat", {
	name: "Keeki",
	desc: "It's a cat made out of cake.",
	icon_state: "cak",
	icon_living: "cak",
	icon_dead: "cak_dead",
	health: 50,
	maxHealth: 50,
	gender: "female",
	harm_intent_damage: 10,
	butcher_results: null,
	response_harm: "takes a bite out of",
	attacked_sound: rt.rsc("sound/items/eatfood.ogg"),
	deathmessage: "loses its false life and collapses!",
	death_sound: "bodyfall",
});

// /mob/living/simple_animal/pet/cat/cak/proc/<init>  (code/modules/mob/living/simple_animal/friendly/cat.dm:234)
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/organ/brain"), 1, T("/obj/item/organ/heart"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/birthday"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]));
	return f.dot;
});

// /mob/living/simple_animal/pet/cat/cak/proc/CheckParts  (code/modules/mob/living/simple_animal/friendly/cat.dm:242)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/CheckParts", function* CheckParts(f: Frame) {
	let B: Value = null, new_name: Value = null;
	f.vars = () => [B, new_name];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((!truthy((B = rt.locateIn(f, T("/obj/item/organ/brain"), rt.sv(f, "contents")))) || !truthy(rt.fv(f, "brainmob", live(B)))) || !truthy(rt.gv(f, "mind", rt.fv(f, "brainmob", live(B)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gv(f, "mind", rt.fv(f, "brainmob", live(B))), "transfer_to", [live(f.src)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<font size=3><b>Y</b></font><b>ou are a cak! You're a harmless cat/cake hybrid that everyone loves. People can take bites out of you if they're hungry, but you regenerate health so quickly that it generally doesn't matter. You're remarkably resilient to any damage besides this and it's hard for you to really die at all. You should go around and bring happiness and free cake to the station!</b>"]);
	if (!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.src), "Enter your name, or press \"Cancel\" to stick with Keeki.", "Name Change"]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Your name is now <b>\"new_name\"</b>!</span>"]);
	rt.setSv(f, "name", live(new_name));
	return f.dot;
}, true, { args: ["parts"] });

// /mob/living/simple_animal/pet/cat/cak/proc/Life  (code/modules/mob/living/simple_animal/friendly/cat.dm:256)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/Life", function* Life(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		yield* g.srcCall(f, "adjustBruteLoss", -8);
	}
	D = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/item/weapon/reagent_containers/food/snacks/donut"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!isEqual(rt.fv(f, "icon_state", live(D)), "donut2")) {
			rt.setFv(f, "name", live(D), "frosted donut");
			rt.setFv(f, "icon_state", live(D), "donut2");
			yield* g.callName(f, rt.fv(f, "reagents", live(D)), "add_reagent", ["sprinkles", 2]);
			rt.setFv(f, "bonus_reagents", live(D), rt.alist(f, ["sprinkles", 2, "sugar", 1]));
			rt.setFv(f, "filling_color", live(D), "#FF69B4");
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/pet/cat/cak/proc/attack_hand  (code/modules/mob/living/simple_animal/friendly/cat.dm:270)  may sleep
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm") && truthy(rt.fv(f, "reagents", live(f.args[0])))) && !truthy(rt.sv(f, "stat")))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["nutriment", 0.4000000059604645]);
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["vitamin", 0.4000000059604645]);
	return f.dot;
}, true, { args: ["L"] });
