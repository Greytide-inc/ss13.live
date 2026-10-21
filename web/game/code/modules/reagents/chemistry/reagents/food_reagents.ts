// From code/modules/reagents/chemistry/reagents/food_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3358, "/datum/reagent/consumable", "/datum/reagent", {
	nutriment_factor: 0.4,
	name: "Consumable",
	id: "consumable",
	taste_description: "generic food",
	taste_mult: 4,
});

// /datum/reagent/consumable/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:18)  may sleep
rt.def("/datum/reagent/consumable/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	f.vars = () => [M];
	rt.incSrcVar(f, "current_cycle", 1, true);
	rt.modField(f, live(M), "nutrition", rt.sv(f, "nutriment_factor"), add);
	yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", [rt.fv(f, "id", live(f.src)), rt.sv(f, "metabolization_rate")]);
	return f.dot;
}, true);

rt.type(3489, "/datum/reagent/consumable/nutriment", "/datum/reagent/consumable", {
	brute_heal: 1,
	burn_heal: 0,
	name: "Nutriment",
	id: "nutriment",
	description: "All the vitamins, minerals, and carbohydrates the body needs in pure form.",
	reagent_state: 1,
	nutriment_factor: 6,
	color: "#664330",
});

// /datum/reagent/consumable/nutriment/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:34)  may sleep
rt.def("/datum/reagent/consumable/nutriment/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [rt.sv(f, "brute_heal"), rt.sv(f, "burn_heal"), 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/consumable/nutriment/proc/on_new  (code/modules/reagents/chemistry/reagents/food_reagents.dm:43)
rt.def("/datum/reagent/consumable/nutriment/proc/on_new", function on_new(f: Frame, supplied_data: Value) {
	f.vars = () => [supplied_data];
	if (!truthy(live(supplied_data))) {
		supplied_data = rt.sv(f, "data");
	}
	rt.setSv(f, "data", rt.call(f, P("/proc/counterlist_normalise"), null, [live(supplied_data)]));
	return f.dot;
});

// /datum/reagent/consumable/nutriment/proc/on_merge  (code/modules/reagents/chemistry/reagents/food_reagents.dm:52)
rt.def("/datum/reagent/consumable/nutriment/proc/on_merge", function on_merge(f: Frame, newdata: Value, newvolume: Value) {
	let taste_amounts: Value = null, other_taste_amounts: Value = null;
	f.vars = () => [taste_amounts, other_taste_amounts];
	if ((!truthy((rt.istype(live(newdata), T("/list")) ? 1 : 0)) || !truthy(rt.len(f, live(newdata))))) {
		return live(f.dot);
	}
	taste_amounts = rt.list();
	if (truthy(rt.sv(f, "data"))) {
		taste_amounts = rt.callName(f, rt.sv(f, "data"), "Copy", []);
	}
	rt.call(f, P("/proc/counterlist_scale"), null, [live(taste_amounts), rt.sv(f, "volume")]);
	rt.call(f, P("/proc/counterlist_scale"), null, [(other_taste_amounts = rt.callName(f, live(newdata), "Copy", [])), live(newvolume)]);
	rt.call(f, P("/proc/counterlist_combine"), null, [live(taste_amounts), live(other_taste_amounts)]);
	rt.call(f, P("/proc/counterlist_normalise"), null, [live(taste_amounts)]);
	rt.setSv(f, "data", live(taste_amounts));
	return f.dot;
});

rt.type(3490, "/datum/reagent/consumable/nutriment/vitamin", "/datum/reagent/consumable/nutriment", {
	name: "Vitamin",
	id: "vitamin",
	description: "All the best vitamins, minerals, and carbohydrates the body needs in pure form.",
	brute_heal: 1,
	burn_heal: 1,
});

// /datum/reagent/consumable/nutriment/vitamin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:82)  may sleep
rt.def("/datum/reagent/consumable/nutriment/vitamin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "satiety", live(f.args[0])), 600)) {
		rt.modField(f, live(f.args[0]), "satiety", 30, add);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["M"] });

rt.type(3491, "/datum/reagent/consumable/sugar", "/datum/reagent/consumable", {
	name: "Sugar",
	id: "sugar",
	description: "The organic compound commonly known as table sugar and sometimes called saccharose. This white, odorless, crystalline powder has a pleasing, sweet taste.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_mult: 1.5,
	nutriment_factor: 4,
	metabolization_rate: 0.8,
	overdose_threshold: 200,
	taste_description: "sweetness",
});

// /datum/reagent/consumable/sugar/proc/overdose_start  (code/modules/reagents/chemistry/reagents/food_reagents.dm:99)  may sleep
rt.def("/datum/reagent/consumable/sugar/proc/overdose_start", function* overdose_start(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You go into hyperglycaemic shock! Lay off the twinkies!</span>"]);
	yield* g.callName(f, live(M), "AdjustSleeping", [600, 0]);
	f.dot = 1;
	return f.dot;
}, true);

// /datum/reagent/consumable/sugar/proc/overdose_process  (code/modules/reagents/chemistry/reagents/food_reagents.dm:104)  may sleep
rt.def("/datum/reagent/consumable/sugar/proc/overdose_process", function* overdose_process(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [40, 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3495, "/datum/reagent/consumable/capsaicin", "/datum/reagent/consumable", {
	name: "Capsaicin Oil",
	id: "capsaicin",
	description: "This is what makes chilis hot.",
	color: "#B31008",
	taste_description: "hot peppers",
	taste_mult: 1.5,
});

// /datum/reagent/consumable/capsaicin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:142)  may sleep
rt.def("/datum/reagent/consumable/capsaicin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 15)) {
		rt.modField(f, live(f.args[0]), "bodytemperature", 7.5, add);
		if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["cryostylane"])))) {
			yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["cryostylane", 5]);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [5, 20])), add);
		}
	} else if (rt.inRange($0, 15, 25)) {
		rt.modField(f, live(f.args[0]), "bodytemperature", 15, add);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [10, 20])), add);
		}
	} else if (rt.inRange($0, 25, 35)) {
		rt.modField(f, live(f.args[0]), "bodytemperature", 22.5, add);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [15, 20])), add);
		}
	} else if (rt.inRange($0, 35, 9.999999848243207e+30)) {
		rt.modField(f, live(f.args[0]), "bodytemperature", 30, add);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [20, 25])), add);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3496, "/datum/reagent/consumable/frostoil", "/datum/reagent/consumable", {
	name: "Frost Oil",
	id: "frostoil",
	description: "A special oil that noticably chills the body. Extracted from Icepeppers and slimes.",
	color: "#8BA6E9",
	taste_description: "mint",
});

// /datum/reagent/consumable/frostoil/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:171)  may sleep
rt.def("/datum/reagent/consumable/frostoil/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 15)) {
		(rt.modField(f, live(f.args[0]), "bodytemperature", 15, subtract));
		if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["capsaicin"])))) {
			yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["capsaicin", 5]);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			(rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [5, 20])), subtract));
		}
	} else if (rt.inRange($0, 15, 25)) {
		(rt.modField(f, live(f.args[0]), "bodytemperature", 30, subtract));
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			(rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [10, 20])), subtract));
		}
	} else if (rt.inRange($0, 25, 35)) {
		(rt.modField(f, live(f.args[0]), "bodytemperature", 45, subtract));
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.callName(f, live(f.args[0]), "emote", ["shiver"]);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			(rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [15, 20])), subtract));
		}
	} else if (rt.inRange($0, 35, 9.999999848243207e+30)) {
		(rt.modField(f, live(f.args[0]), "bodytemperature", 60, subtract));
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.callName(f, live(f.args[0]), "emote", ["shiver"]);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			(rt.modField(f, live(f.args[0]), "bodytemperature", (yield* g.call(f, P("/proc/rand"), null, [20, 25])), subtract));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /datum/reagent/consumable/frostoil/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/food_reagents.dm:197)  may sleep
rt.def("/datum/reagent/consumable/frostoil/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let M: Value = null, OT: Value = null;
	let $e: any;
	f.vars = () => [_T, reac_volume, M, OT, $e];
	if (rt.ge(live(reac_volume), 5)) {
		M = null;
		rt.forList(f, 0, live(_T), T("/mob/living/simple_animal/slime"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "adjustToxLoss", [(yield* g.call(f, P("/proc/rand"), null, [15, 30]))]);
		}
		rt.endFor(f, 0);
	}
	if (!rt.ge(live(reac_volume), 1)) return f.dot;
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (OT = live(_T)), "MakeSlippery", ["wet_setting", 3, "min_wet_time", 10, "wet_time_to_add", live(reac_volume)], rt.Args.Named);
	(rt.modField(f, rt.fv(f, "air", live(OT)), "temperature", divide(multiply(10398.3798828125, live(reac_volume)), (yield* g.callName(f, rt.fv(f, "air", live(OT)), "heat_capacity", []))), subtract));
	return f.dot;
}, true);

rt.type(3497, "/datum/reagent/consumable/condensedcapsaicin", "/datum/reagent/consumable", {
	name: "Condensed Capsaicin",
	id: "condensedcapsaicin",
	description: "A chemical agent used for self-defense and in police work.",
	color: "#B31008",
	taste_description: "scorching agony",
});

// /datum/reagent/consumable/condensedcapsaicin/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/food_reagents.dm:214)  may sleep
rt.def("/datum/reagent/consumable/condensedcapsaicin/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let victim: Value = null, mouth_covered: Value = null, eyes_covered: Value = null, safe_thing: Value = null, H: Value = null;
	f.vars = () => [M, method, reac_volume, victim, mouth_covered, eyes_covered, safe_thing, H];
	if (live(method) === null) {
		method = 1;
	}
	if ((!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		return live(f.dot);
	}
	victim = live(M);
	if (!(isEqual(live(method), 1) || isEqual(live(method), 3))) return f.dot;
	mouth_covered = 0;
	eyes_covered = 0;
	safe_thing = null;
	if (truthy(rt.fv(f, "wear_mask", live(victim)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(victim))), 2))) {
			eyes_covered = 1;
			safe_thing = rt.fv(f, "wear_mask", live(victim));
		}
		if (truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(victim))), 8))) {
			mouth_covered = 1;
			safe_thing = rt.fv(f, "wear_mask", live(victim));
		}
	}
	if (truthy((rt.istype(live(victim), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "head", (H = live(victim))))) {
			if (truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(H))), 2))) {
				eyes_covered = 1;
				safe_thing = rt.fv(f, "head", live(H));
			}
			if (truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(H))), 8))) {
				mouth_covered = 1;
				safe_thing = rt.fv(f, "head", live(H));
			}
		}
		if (truthy(rt.fv(f, "glasses", live(H)))) {
			eyes_covered = 1;
			if (!truthy(live(safe_thing))) {
				safe_thing = rt.fv(f, "glasses", live(H));
			}
		}
	}
	if ((truthy(live(eyes_covered)) && truthy(live(mouth_covered)))) {
		return live(f.dot);
	} else {
		if (truthy(live(mouth_covered))) {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.callName(f, live(victim), "emote", ["scream"]);
			}
			yield* g.callName(f, live(victim), "blur_eyes", [3]);
			yield* g.callName(f, live(victim), "blind_eyes", [2]);
			rt.setFv(f, "confused", live(victim), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "confused", live(M)), 3])));
			rt.setFv(f, "damageoverlaytemp", live(victim), 60);
			yield* g.callName(f, live(victim), "Knockdown", [60]);
			yield* g.callName(f, live(victim), "drop_item", []);
			return live(f.dot);
		} else {
			if (truthy(live(eyes_covered))) {
				yield* g.callName(f, live(victim), "blur_eyes", [3]);
				rt.setFv(f, "damageoverlaytemp", live(victim), 30);
				return live(f.dot);
			} else {
				if (truthy(rt.op(f, "Prob", [], [5]))) {
					yield* g.callName(f, live(victim), "emote", ["scream"]);
				}
				yield* g.callName(f, live(victim), "blur_eyes", [5]);
				yield* g.callName(f, live(victim), "blind_eyes", [3]);
				rt.setFv(f, "confused", live(victim), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "confused", live(M)), 6])));
				rt.setFv(f, "damageoverlaytemp", live(victim), 75);
				yield* g.callName(f, live(victim), "Knockdown", [100]);
				yield* g.callName(f, live(victim), "drop_item", []);
			}
		}
	}
	yield* g.callName(f, live(victim), "update_damage_hud", []);
	return f.dot;
}, true);

// /datum/reagent/consumable/condensedcapsaicin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:277)  may sleep
rt.def("/datum/reagent/consumable/condensedcapsaicin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ ＀</span>", [live(f.args[0]), rt.op(f, "PickUnweighted", [3], ["dry heaves!", "coughs!", "splutters!"])])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3498, "/datum/reagent/consumable/sodiumchloride", "/datum/reagent/consumable", {
	name: "Table Salt",
	id: "sodiumchloride",
	description: "A salt made of sodium chloride. Commonly used to season food.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_description: "salt",
});

// /datum/reagent/consumable/sodiumchloride/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/food_reagents.dm:290)  may sleep
rt.def("/datum/reagent/consumable/sodiumchloride/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	f.vars = () => [M, method, reac_volume];
	if (live(method) === null) {
		method = 1;
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(M), "has_bane", ["salt"])))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(M)), "disrupt_spells", [-200]);
	return f.dot;
}, true);

// /datum/reagent/consumable/sodiumchloride/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/food_reagents.dm:296)  may sleep
rt.def("/datum/reagent/consumable/sodiumchloride/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	f.vars = () => [_T, reac_volume];
	if (!truthy((rt.istype(live(_T), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (rt.lt(live(reac_volume), 1)) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/decal/cleanable/salt"), [live(_T)]);
	return f.dot;
}, true);

rt.type(3501, "/datum/reagent/consumable/hot_coco", "/datum/reagent/consumable", {
	name: "Hot Chocolate",
	id: "hot_coco",
	description: "Made with love! And coco beans.",
	nutriment_factor: 1.2,
	color: "#403010",
	taste_description: "creamy chocolate",
	glass_icon_state: "chocolateglass",
	glass_name: "glass of chocolate",
	glass_desc: "Tasty.",
});

// /datum/reagent/consumable/hot_coco/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:331)  may sleep
rt.def("/datum/reagent/consumable/hot_coco/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3546, "/datum/reagent/mushroomhallucinogen", "/datum/reagent", {
	name: "Mushroom Hallucinogen",
	id: "mushroomhallucinogen",
	description: "A strong hallucinogenic drug derived from certain species of mushroom.",
	color: "#E700E7",
	metabolization_rate: 0.080000006,
	taste_description: "mushroom",
});

// /datum/reagent/mushroomhallucinogen/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:344)  may sleep
rt.def("/datum/reagent/mushroomhallucinogen/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.fv(f, "slurring", live(f.args[0])))) {
		rt.setFv(f, "slurring", live(f.args[0]), 1);
	}
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 5)) {
		yield* g.callName(f, live(f.args[0]), "Dizzy", [5]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [30]);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
	} else if (rt.inRange($0, 5, 10)) {
		yield* g.callName(f, live(f.args[0]), "Jitter", [10]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [10]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [35]);
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
	} else if (rt.inRange($0, 10, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "Jitter", [20]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [20]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [40]);
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3502, "/datum/reagent/consumable/sprinkles", "/datum/reagent/consumable", {
	name: "Sprinkles",
	id: "sprinkles",
	description: "Multi-colored little bits of sugar, commonly found on donuts. Loved by cops.",
	color: "#FF00FF",
	taste_description: "childhood whimsy",
});

// /datum/reagent/consumable/sprinkles/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:374)  may sleep
rt.def("/datum/reagent/consumable/sprinkles/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.isIn(f, ((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0) && rt.fv(f, "job", live(f.args[0]))), rt.list("Security Officer", "Head of Security", "Detective", "Warden")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3503, "/datum/reagent/consumable/cornoil", "/datum/reagent/consumable", {
	name: "Corn Oil",
	id: "cornoil",
	description: "An oil derived from various types of corn.",
	nutriment_factor: 8,
	color: "#302000",
	taste_description: "slime",
});

// /datum/reagent/consumable/cornoil/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/food_reagents.dm:388)  may sleep
rt.def("/datum/reagent/consumable/cornoil/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let hotspot: Value = null, lowertemp: Value = null;
	f.vars = () => [_T, reac_volume, hotspot, lowertemp];
	if (!truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(_T), "MakeSlippery", ["min_wet_time", 10, "wet_time_to_add", multiply(live(reac_volume), 2)], rt.Args.Named);
	if (!truthy((hotspot = rt.locateIn(f, T("/obj/effect/hotspot"), live(_T))))) return f.dot;
	rt.setFv(f, "temperature", (lowertemp = (yield* g.callName(f, live(_T), "remove_air", [(yield* g.callName(f, rt.fv(f, "air", live(_T)), "total_moles", []))]))), (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "temperature", live(lowertemp)), 2000), divide(rt.fv(f, "temperature", live(lowertemp)), 2)])), 0])));
	yield* g.callName(f, live(lowertemp), "react", []);
	yield* g.callName(f, live(_T), "assume_air", [live(lowertemp)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(hotspot)]);
	return f.dot;
}, true);

rt.type(3506, "/datum/reagent/consumable/hot_ramen", "/datum/reagent/consumable", {
	name: "Hot Ramen",
	id: "hot_ramen",
	description: "The noodles are boiled, the flavors are artificial, just like being back in school.",
	nutriment_factor: 2,
	color: "#302000",
	taste_description: "wet and cheap noodles",
});

// /datum/reagent/consumable/hot_ramen/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:423)  may sleep
rt.def("/datum/reagent/consumable/hot_ramen/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 15)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3507, "/datum/reagent/consumable/hell_ramen", "/datum/reagent/consumable", {
	name: "Hell Ramen",
	id: "hell_ramen",
	description: "The noodles are boiled, the flavors are artificial, just like being back in school.",
	nutriment_factor: 2,
	color: "#302000",
	taste_description: "wet and cheap noodles on fire",
});

// /datum/reagent/consumable/hell_ramen/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:436)  may sleep
rt.def("/datum/reagent/consumable/hell_ramen/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.modField(f, live(f.args[0]), "bodytemperature", 15, add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3508, "/datum/reagent/consumable/flour", "/datum/reagent/consumable", {
	name: "Flour",
	id: "flour",
	description: "This is what you rub all over yourself to pretend to be a ghost.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_description: "chalky wheat",
});

// /datum/reagent/consumable/flour/proc/reaction_turf  (code/modules/reagents/chemistry/reagents/food_reagents.dm:448)  may sleep
rt.def("/datum/reagent/consumable/flour/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let reagentdecal: Value = null;
	f.vars = () => [_T, reac_volume, reagentdecal];
	if (truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.gv(f, "reagents", (reagentdecal = (yield* g.new_(f, T("/obj/effect/decal/cleanable/flour"), [live(_T)])))), "add_reagent", ["flour", live(reac_volume)]);
	return f.dot;
}, true);

rt.type(3515, "/datum/reagent/consumable/corn_syrup", "/datum/reagent/consumable", {
	name: "Corn Syrup",
	id: "corn_syrup",
	description: "Decays into sugar.",
	color: "#C8A5DC",
	metabolization_rate: 1.2,
	taste_description: "sweet slime",
});

// /datum/reagent/consumable/corn_syrup/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:507)  may sleep
rt.def("/datum/reagent/consumable/corn_syrup/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, rt.sv(f, "holder"), "add_reagent", ["sugar", 3]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3516, "/datum/reagent/consumable/honey", "/datum/reagent/consumable", {
	name: "honey",
	id: "honey",
	description: "Sweet sweet honey, decays into sugar and has natural healing properties.",
	color: "#d3a308",
	nutriment_factor: 6,
	metabolization_rate: 0.4,
	taste_description: "sweetness",
});

// /datum/reagent/consumable/honey/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:520)  may sleep
rt.def("/datum/reagent/consumable/honey/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", ["sugar", 3]);
	if (truthy(rt.op(f, "Prob", [], [55]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3518, "/datum/reagent/consumable/tearjuice", "/datum/reagent/consumable", {
	name: "Tear Juice",
	id: "tearjuice",
	description: "A blinding substance extracted from certain onions.",
	color: "#c0c9a0",
	taste_description: "bitterness",
});

// /datum/reagent/consumable/tearjuice/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/food_reagents.dm:543)  may sleep
rt.def("/datum/reagent/consumable/tearjuice/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let unprotected: Value = null;
	let $0: any;
	f.vars = () => [unprotected, $0];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	unprotected = 0;
	$0 = live(f.args[1]);
	if ($0 === 2) {
		unprotected = 1;
	} else if ($0 === 5) {
		unprotected = 0;
	} else {
		if ((!truthy((yield* g.callName(f, live(f.args[0]), "is_mouth_covered", []))) && !truthy((yield* g.callName(f, live(f.args[0]), "is_eyes_covered", []))))) {
			unprotected = 1;
		}
	}
	if (truthy(live(unprotected))) {
		if (!truthy((yield* g.callName(f, live(f.args[0]), "getorganslot", ["eye_sight"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'notice'>Your eye sockets feel wet.</span>"]);
		} else {
			if (!truthy(rt.fv(f, "eye_blurry", live(f.args[0])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'warning'>Tears well up in your eyes!</span>"]);
			}
			yield* g.callName(f, live(f.args[0]), "blind_eyes", [2]);
			yield* g.callName(f, live(f.args[0]), "blur_eyes", [5]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// /datum/reagent/consumable/tearjuice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:565)  may sleep
rt.def("/datum/reagent/consumable/tearjuice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "eye_blurry", live(f.args[0])))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "blur_eyes", [4]);
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'warning'>Your eyes sting!</span>"]);
	yield* g.callName(f, live(f.args[0]), "blind_eyes", [2]);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3519, "/datum/reagent/consumable/entpoly", "/datum/reagent/consumable", {
	name: "Entropic Polypnium",
	id: "entpoly",
	description: "An ichor, derived from a certain mushroom, makes for a bad time.",
	color: "#1d043d",
	taste_description: "bitter mushroom",
});

// /datum/reagent/consumable/entpoly/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:584)  may sleep
rt.def("/datum/reagent/consumable/entpoly/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.ge(rt.sv(f, "current_cycle"), 10)) {
		yield* g.callName(f, live(f.args[0]), "Unconscious", [40, 0]);
		f.dot = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		rt.modField(f, live(f.args[0]), "losebreath", 4, add);
		yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [2]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [3, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustStaminaLoss", [10, 0]);
		yield* g.callName(f, live(f.args[0]), "blur_eyes", [5]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3520, "/datum/reagent/consumable/tinlux", "/datum/reagent/consumable", {
	name: "Tinea Luxor",
	id: "tinlux",
	description: "A stimulating ichor which causes luminescent fungi to grow on the skin. ",
	color: "#b5a213",
	taste_description: "tingling mushroom",
});

// /datum/reagent/consumable/tinlux/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/food_reagents.dm:604)
rt.def("/datum/reagent/consumable/tinlux/proc/reaction_mob", function reaction_mob(f: Frame, M: Value) {
	rt.callName(f, live(M), "set_light", [2]);
	return f.dot;
});

// /datum/reagent/consumable/tinlux/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/food_reagents.dm:607)
rt.def("/datum/reagent/consumable/tinlux/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	rt.callName(f, live(M), "set_light", [-2]);
	return f.dot;
});

rt.type(3521, "/datum/reagent/consumable/vitfro", "/datum/reagent/consumable", {
	name: "Vitrium Froth",
	id: "vitfro",
	description: "A bubbly paste that heals wounds of the skin.",
	color: "#d3a308",
	nutriment_factor: 1.2,
	taste_description: "fruity mushroom",
});

// /datum/reagent/consumable/vitfro/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/food_reagents.dm:618)  may sleep
rt.def("/datum/reagent/consumable/vitfro/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [80]))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });
