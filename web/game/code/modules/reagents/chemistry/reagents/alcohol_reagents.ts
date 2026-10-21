// From code/modules/reagents/chemistry/reagents/alcohol_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3359, "/datum/reagent/consumable/ethanol", "/datum/reagent/consumable", {
	boozepwr: 65,
	name: "Ethanol",
	id: "ethanol",
	description: "A well-known alcohol with a variety of applications.",
	color: "#404030",
	taste_description: "alcohol",
	nutriment_factor: 0,
});

// /datum/reagent/consumable/ethanol/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:37)  may sleep
rt.def("/datum/reagent/consumable/ethanol/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (rt.lt(rt.gv(f, "drunkenness", (H = live(f.args[0]))), multiply(multiply(rt.sv(f, "volume"), rt.sv(f, "boozepwr")), 0.05000000074505806))) {
			rt.setFv(f, "drunkenness", live(H), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "drunkenness", live(H)), multiply(multiply(rt.op(f, "Sqrt", [], [rt.sv(f, "volume")]), rt.sv(f, "boozepwr")), 0.004999999888241291)), 0])));
		}
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

// /datum/reagent/consumable/ethanol/proc/reaction_obj  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:44)
rt.def("/datum/reagent/consumable/ethanol/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let paperaffected: Value = null, affectedbook: Value = null;
	f.vars = () => [paperaffected, affectedbook];
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/paper")) ? 1 : 0))) {
		rt.callName(f, (paperaffected = live(O)), "clearpaper", []);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＀'s ink washes away.</span>", [live(paperaffected)])]);
	}
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/book")) ? 1 : 0))) {
		if (rt.ge(live(reac_volume), 5)) {
			rt.setFv(f, "dat", (affectedbook = live(O)), null);
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>Through thorough application, you wash away ＀'s writing.</span>", [live(affectedbook)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The ink smears, but doesn't wash away!</span>"]);
		}
	}
	return live(f.dot);
});

// /datum/reagent/consumable/ethanol/proc/reaction_mob  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:58)  may sleep
rt.def("/datum/reagent/consumable/ethanol/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let C: Value = null, power_multiplier: Value = null, s: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [C, power_multiplier, s, S, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, live(f.args[1]), rt.list(1, 3, 4)) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [divide(live(f.args[2]), 15)]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(f.args[0]);
			power_multiplier = divide(rt.sv(f, "boozepwr"), 65);
			s = null;
			rt.forList(f, 0, rt.fv(f, "surgeries", live(C)));
			while (($e = rt.next(f, 0)) !== undefined) {
				s = $e;
				rt.setFv(f, "success_multiplier", (S = live(s)), (yield* g.call(f, P("/proc/max"), null, [multiply(0.10000000149011612, live(power_multiplier)), rt.fv(f, "success_multiplier", live(S))])));
			}
			rt.endFor(f, 0);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "method", "reac_volume"] });

rt.type(3361, "/datum/reagent/consumable/ethanol/beer/green", "/datum/reagent/consumable/ethanol/beer", {
	name: "Green Beer",
	id: "greenbeer",
	description: "An alcoholic beverage brewed since ancient times on Old Earth. This variety is dyed a festive green.",
	color: "#A8E61D",
	taste_description: "green piss water",
	glass_icon_state: "greenbeerglass",
	glass_name: "glass of green beer",
	glass_desc: "A freezing pint of green beer. Festive.",
});

// /datum/reagent/consumable/ethanol/beer/green/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:96)  may sleep
rt.def("/datum/reagent/consumable/ethanol/beer/green/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (!isEqual(rt.fv(f, "color", live(f.args[0])), rt.sv(f, "color"))) {
		yield* g.callName(f, live(f.args[0]), "add_atom_colour", [rt.sv(f, "color"), 2]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /datum/reagent/consumable/ethanol/beer/green/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:101)
rt.def("/datum/reagent/consumable/ethanol/beer/green/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	rt.callName(f, live(M), "remove_atom_colour", [2, rt.sv(f, "color")]);
	return f.dot;
});

rt.type(3362, "/datum/reagent/consumable/ethanol/kahlua", "/datum/reagent/consumable/ethanol", {
	name: "Kahlua",
	id: "kahlua",
	description: "A widely known, Mexican coffee-flavoured liqueur. In production since 1936!",
	color: "#664300",
	boozepwr: 45,
	glass_icon_state: "kahluaglass",
	glass_name: "glass of RR Coffee Liquor",
	glass_desc: "DAMN, THIS THING LOOKS ROBUST!",
	shot_glass_icon_state: "shotglasscream",
});

// /datum/reagent/consumable/ethanol/kahlua/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:115)  may sleep
rt.def("/datum/reagent/consumable/ethanol/kahlua/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40, 0]);
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3364, "/datum/reagent/consumable/ethanol/thirteenloko", "/datum/reagent/consumable/ethanol", {
	name: "Thirteen Loko",
	id: "thirteenloko",
	description: "A potent mixture of caffeine and alcohol.",
	color: "#102000",
	boozepwr: 80,
	taste_description: "jitters and death",
	glass_icon_state: "thirteen_loko_glass",
	glass_name: "glass of Thirteen Loko",
	glass_desc: "This is a glass of Thirteen Loko, it appears to be of the highest quality. The drink, not the glass.",
	nutriment_factor: 0.4,
});

// /datum/reagent/consumable/ethanol/thirteenloko/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:148)  may sleep
rt.def("/datum/reagent/consumable/ethanol/thirteenloko/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 7)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40]);
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3365, "/datum/reagent/consumable/ethanol/vodka", "/datum/reagent/consumable/ethanol", {
	name: "Vodka",
	id: "vodka",
	description: "Number one drink AND fueling choice for Russians worldwide.",
	color: "#0064C8",
	boozepwr: 65,
	taste_description: "grain alcohol",
	glass_icon_state: "ginvodkaglass",
	glass_name: "glass of vodka",
	glass_desc: "The glass contain wodka. Xynta.",
	shot_glass_icon_state: "shotglassclear",
});

// /datum/reagent/consumable/ethanol/vodka/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:168)  may sleep
rt.def("/datum/reagent/consumable/ethanol/vodka/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "radiation", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "radiation", live(f.args[0])), 2), 0])));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3366, "/datum/reagent/consumable/ethanol/bilk", "/datum/reagent/consumable/ethanol", {
	name: "Bilk",
	id: "bilk",
	description: "This appears to be beer mixed with milk. Disgusting.",
	color: "#895C4C",
	boozepwr: 15,
	taste_description: "desperation and lactate",
	glass_icon_state: "glass_brown",
	glass_name: "glass of bilk",
	glass_desc: "A brew of milk and beer. For those alcoholics who fear osteoporosis.",
	nutriment_factor: 0.8,
});

// /datum/reagent/consumable/ethanol/bilk/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:184)  may sleep
rt.def("/datum/reagent/consumable/ethanol/bilk/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", []))) && truthy(rt.op(f, "Prob", [], [10])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
		f.dot = 1;
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3367, "/datum/reagent/consumable/ethanol/threemileisland", "/datum/reagent/consumable/ethanol", {
	name: "Three Mile Island Iced Tea",
	id: "threemileisland",
	description: "Made for a woman, strong enough for a man.",
	color: "#666340",
	boozepwr: 10,
	taste_description: "dryness",
	glass_icon_state: "threemileislandglass",
	glass_name: "Three Mile Island Ice Tea",
	glass_desc: "A glass of this is sure to prevent a meltdown.",
});

// /datum/reagent/consumable/ethanol/threemileisland/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:201)  may sleep
rt.def("/datum/reagent/consumable/ethanol/threemileisland/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "set_drugginess", [50]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3376, "/datum/reagent/consumable/ethanol/absinthe", "/datum/reagent/consumable/ethanol", {
	name: "Absinthe",
	id: "absinthe",
	description: "A powerful alcoholic drink. Rumored to cause hallucinations but does not.",
	color: "#0ace00",
	boozepwr: 80,
	taste_description: "death and licorice",
	glass_icon_state: "absinthe",
	glass_name: "glass of absinthe",
	glass_desc: "It's as strong as it smells.",
	shot_glass_icon_state: "shotglassgreen",
});

// /datum/reagent/consumable/ethanol/absinthe/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:307)  may sleep
rt.def("/datum/reagent/consumable/ethanol/absinthe/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		rt.modField(f, live(f.args[0]), "hallucination", 4, add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3382, "/datum/reagent/consumable/ethanol/cuba_libre", "/datum/reagent/consumable/ethanol", {
	name: "Cuba Libre",
	id: "cubalibre",
	description: "Rum, mixed with cola. Viva la revolucion.",
	color: "#3E1B00",
	boozepwr: 50,
	taste_description: "cola",
	glass_icon_state: "cubalibreglass",
	glass_name: "Cuba Libre",
	glass_desc: "A classic mix of rum and cola.",
});

// /datum/reagent/consumable/ethanol/cuba_libre/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:381)  may sleep
rt.def("/datum/reagent/consumable/ethanol/cuba_libre/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.isIn(f, (rt.fv(f, "mind", live(f.args[0])) && rt.gv(f, "special_role", rt.fv(f, "mind", live(f.args[0])))), rt.list("Revolutionary", "Head Revolutionary")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-5, 0]);
		f.dot = 1;
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3387, "/datum/reagent/consumable/ethanol/screwdrivercocktail", "/datum/reagent/consumable/ethanol", {
	name: "Screwdriver",
	id: "screwdrivercocktail",
	description: "Vodka, mixed with plain ol' orange juice. The result is surprisingly delicious.",
	color: "#A68310",
	boozepwr: 55,
	taste_description: "oranges",
	glass_icon_state: "screwdriverglass",
	glass_name: "Screwdriver",
	glass_desc: "A simple, yet superb mixture of Vodka and orange juice. Just the thing for the tired engineer.",
});

// /datum/reagent/consumable/ethanol/screwdrivercocktail/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:445)  may sleep
rt.def("/datum/reagent/consumable/ethanol/screwdrivercocktail/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.isIn(f, (rt.fv(f, "mind", live(f.args[0])) && rt.gv(f, "assigned_role", rt.fv(f, "mind", live(f.args[0])))), rt.list("Station Engineer", "Atmospheric Technician", "Chief Engineer")) ? 1 : 0))) {
		rt.setFv(f, "radiation", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "radiation", live(f.args[0])), 25), 0])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3390, "/datum/reagent/consumable/ethanol/brave_bull", "/datum/reagent/consumable/ethanol", {
	name: "Brave Bull",
	id: "bravebull",
	description: "It's just as effective as Dutch-Courage!",
	color: "#664300",
	boozepwr: 80,
	taste_description: "alcoholic bravery",
	glass_icon_state: "bravebullglass",
	glass_name: "Brave Bull",
	glass_desc: "Tequila and Coffee liqueur, brought together in a mouthwatering mixture. Drink up.",
});

// /datum/reagent/consumable/ethanol/brave_bull/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:483)  may sleep
rt.def("/datum/reagent/consumable/ethanol/brave_bull/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (isEqual(rt.fv(f, "maxHealth", live(f.args[0])), rt.initial(f, live(f.args[0]), "maxHealth"))) {
		rt.modField(f, live(f.args[0]), "maxHealth", 5, add);
		rt.modField(f, live(f.args[0]), "health", 5, add);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /datum/reagent/consumable/ethanol/brave_bull/proc/on_mob_delete  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:489)
rt.def("/datum/reagent/consumable/ethanol/brave_bull/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	if (isEqual(rt.fv(f, "maxHealth", live(M)), rt.initial(f, live(M), "maxHealth"))) return f.dot;
	rt.setFv(f, "maxHealth", live(M), rt.initial(f, live(M), "maxHealth"));
	return f.dot;
});

rt.type(3392, "/datum/reagent/consumable/ethanol/toxins_special", "/datum/reagent/consumable/ethanol", {
	name: "Toxins Special",
	id: "toxinsspecial",
	description: "This thing is ON FIRE! CALL THE DAMN SHUTTLE!",
	color: "#664300",
	boozepwr: 25,
	taste_description: "spicy toxins",
	glass_icon_state: "toxinsspecialglass",
	glass_name: "Toxins Special",
	glass_desc: "Whoah, this thing is on FIRE!",
	shot_glass_icon_state: "toxinsspecialglass",
});

// /datum/reagent/consumable/ethanol/toxins_special/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:516)  may sleep
rt.def("/datum/reagent/consumable/ethanol/toxins_special/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 330)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [330, add(rt.fv(f, "bodytemperature", live(f.args[0])), 22.5)])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3393, "/datum/reagent/consumable/ethanol/beepsky_smash", "/datum/reagent/consumable/ethanol", {
	name: "Beepsky Smash",
	id: "beepskysmash",
	description: "Drink this and prepare for the LAW.",
	color: "#664300",
	boozepwr: 90,
	metabolization_rate: 0.8,
	taste_description: "JUSTICE",
	glass_icon_state: "beepskysmashglass",
	glass_name: "Beepsky Smash",
	glass_desc: "Heavy, hot and strong. Just like the Iron fist of the LAW.",
});

// /datum/reagent/consumable/ethanol/beepsky_smash/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:533)  may sleep
rt.def("/datum/reagent/consumable/ethanol/beepsky_smash/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "Stun", [40, 0]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3403, "/datum/reagent/consumable/ethanol/manhattan_proj", "/datum/reagent/consumable/ethanol", {
	name: "Manhattan Project",
	id: "manhattan_proj",
	description: "A scientist's drink of choice, for pondering ways to blow up the station.",
	color: "#664300",
	boozepwr: 45,
	taste_description: "death, the destroyer of worlds",
	glass_icon_state: "proj_manhattanglass",
	glass_name: "Manhattan Project",
	glass_desc: "A scientist's drink of choice, for thinking how to blow up the station.",
});

// /datum/reagent/consumable/ethanol/manhattan_proj/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:652)  may sleep
rt.def("/datum/reagent/consumable/ethanol/manhattan_proj/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "set_drugginess", [30]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3405, "/datum/reagent/consumable/ethanol/antifreeze", "/datum/reagent/consumable/ethanol", {
	name: "Anti-freeze",
	id: "antifreeze",
	description: "The ultimate refreshment. Not what it sounds like.",
	color: "#664300",
	boozepwr: 35,
	taste_description: "Jack Frost's piss",
	glass_icon_state: "antifreeze",
	glass_name: "Anti-freeze",
	glass_desc: "The ultimate refreshment.",
});

// /datum/reagent/consumable/ethanol/antifreeze/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:678)  may sleep
rt.def("/datum/reagent/consumable/ethanol/antifreeze/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 330)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [330, add(rt.fv(f, "bodytemperature", live(f.args[0])), 30)])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3406, "/datum/reagent/consumable/ethanol/barefoot", "/datum/reagent/consumable/ethanol", {
	name: "Barefoot",
	id: "barefoot",
	description: "Barefoot and pregnant.",
	color: "#664300",
	boozepwr: 45,
	taste_description: "creamy berries",
	glass_icon_state: "b&p",
	glass_name: "Barefoot",
	glass_desc: "Barefoot and pregnant.",
});

// /datum/reagent/consumable/ethanol/barefoot/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:694)  may sleep
rt.def("/datum/reagent/consumable/ethanol/barefoot/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "shoes", (H = live(f.args[0]))))) {
			yield* g.callName(f, live(H), "adjustBruteLoss", [-3, 0]);
			f.dot = 1;
		}
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3414, "/datum/reagent/consumable/ethanol/sbiten", "/datum/reagent/consumable/ethanol", {
	name: "Sbiten",
	id: "sbiten",
	description: "A spicy Vodka! Might be a little hot for the little guys!",
	color: "#664300",
	boozepwr: 70,
	taste_description: "hot and spice",
	glass_icon_state: "sbitenglass",
	glass_name: "Sbiten",
	glass_desc: "A spicy mix of Vodka and Spice. Very hot.",
});

// /datum/reagent/consumable/ethanol/sbiten/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:792)  may sleep
rt.def("/datum/reagent/consumable/ethanol/sbiten/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 360)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [360, add(rt.fv(f, "bodytemperature", live(f.args[0])), 75)])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3417, "/datum/reagent/consumable/ethanol/iced_beer", "/datum/reagent/consumable/ethanol", {
	name: "Iced Beer",
	id: "iced_beer",
	description: "A beer which is so cold the air around it freezes.",
	color: "#664300",
	boozepwr: 15,
	taste_description: "refreshingly cold",
	glass_icon_state: "iced_beerglass",
	glass_name: "Iced Beer",
	glass_desc: "A beer so frosty, the air around it freezes.",
});

// /datum/reagent/consumable/ethanol/iced_beer/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:831)  may sleep
rt.def("/datum/reagent/consumable/ethanol/iced_beer/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 270)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [270, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 30)])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3424, "/datum/reagent/consumable/ethanol/changelingsting", "/datum/reagent/consumable/ethanol", {
	name: "Changeling Sting",
	id: "changelingsting",
	description: "You take a tiny sip and feel a burning sensation...",
	color: "#2E6671",
	boozepwr: 95,
	taste_description: "your brain coming out your nose",
	glass_icon_state: "changelingsting",
	glass_name: "Changeling Sting",
	glass_desc: "A stingy drink.",
});

// /datum/reagent/consumable/ethanol/changelingsting/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:914)  may sleep
rt.def("/datum/reagent/consumable/ethanol/changelingsting/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy(rt.fv(f, "mind", live(f.args[0]))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))), "chem_charges", rt.sv(f, "metabolization_rate"), add);
		rt.setFv(f, "chem_charges", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "chem_charges", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))), rt.gv(f, "chem_storage", rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))))]))])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3426, "/datum/reagent/consumable/ethanol/syndicatebomb", "/datum/reagent/consumable/ethanol", {
	name: "Syndicate Bomb",
	id: "syndicatebomb",
	description: "Tastes like terrorism!",
	color: "#2E6671",
	boozepwr: 90,
	taste_description: "purified antagonism",
	glass_icon_state: "syndicatebomb",
	glass_name: "Syndicate Bomb",
	glass_desc: "A syndicate bomb.",
});

// /datum/reagent/consumable/ethanol/syndicatebomb/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:942)  may sleep
rt.def("/datum/reagent/consumable/ethanol/syndicatebomb/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/effects/explosionfar.ogg"), 100, 1]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3429, "/datum/reagent/consumable/ethanol/bananahonk", "/datum/reagent/consumable/ethanol", {
	name: "Banana Honk",
	id: "bananahonk",
	description: "A drink from Clown Heaven.",
	color: "#FFFF91",
	boozepwr: 60,
	taste_description: "a bad joke",
	glass_icon_state: "bananahonkglass",
	glass_name: "Banana Honk",
	glass_desc: "A drink from Clown Heaven.",
	nutriment_factor: 0.4,
});

// /datum/reagent/consumable/ethanol/bananahonk/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:982)  may sleep
rt.def("/datum/reagent/consumable/ethanol/bananahonk/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((rt.isIn(f, ((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0) && rt.fv(f, "job", live(f.args[0]))), rt.list("Clown")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 1, 0]);
		f.dot = 1;
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3430, "/datum/reagent/consumable/ethanol/silencer", "/datum/reagent/consumable/ethanol", {
	name: "Silencer",
	id: "silencer",
	description: "A drink from Mime Heaven.",
	color: "#664300",
	boozepwr: 59,
	taste_description: "a pencil eraser",
	glass_icon_state: "silencerglass",
	glass_name: "Silencer",
	glass_desc: "A drink from Mime Heaven.",
	nutriment_factor: 0.4,
});

// /datum/reagent/consumable/ethanol/silencer/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1000)  may sleep
rt.def("/datum/reagent/consumable/ethanol/silencer/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.isIn(f, ((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0) && rt.fv(f, "job", live(f.args[0]))), rt.list("Mime")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 1]);
		f.dot = 1;
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3434, "/datum/reagent/consumable/ethanol/fetching_fizz", "/datum/reagent/consumable/ethanol", {
	name: "Fetching Fizz",
	id: "fetching_fizz",
	description: "Whiskey sour/iron/uranium mixture resulting in a highly magnetic slurry. Mild alcohol content.",
	color: "#ff5b0f",
	boozepwr: 10,
	metabolization_rate: 0.040000003,
	taste_description: "charged metal",
	glass_icon_state: "fetching_fizz",
	glass_name: "Fetching Fizz",
	glass_desc: "Induces magnetism in the imbiber. Started as a barroom prank but evolved to become popular with miners and scrappers. Metallic aftertaste.",
});

// /datum/reagent/consumable/ethanol/fetching_fizz/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1055)  may sleep
rt.def("/datum/reagent/consumable/ethanol/fetching_fizz/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [3, live(f.args[0])])), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.call(f, P("/proc/step_towards"), null, [live(O), rt.getStep(f, live(f.args[0]), 0)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(3435, "/datum/reagent/consumable/ethanol/hearty_punch", "/datum/reagent/consumable/ethanol", {
	name: "Hearty Punch",
	id: "hearty_punch",
	description: "Brave bull/syndicate bomb/absinthe mixture resulting in an energizing beverage. Mild alcohol content.",
	color: "#8c0000",
	boozepwr: 10,
	metabolization_rate: 0.040000003,
	taste_description: "bravado in the face of disaster",
	glass_icon_state: "hearty_punch",
	glass_name: "Hearty Punch",
	glass_desc: "Aromatic beverage served piping hot. According to folk tales it can almost wake the dead.",
});

// /datum/reagent/consumable/ethanol/hearty_punch/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1073)  may sleep
rt.def("/datum/reagent/consumable/ethanol/hearty_punch/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((isEqual(rt.fv(f, "stat", live(f.args[0])), 1) && rt.le(rt.fv(f, "health", live(f.args[0])), 0))) {
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-7, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-7, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-7, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-7, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustCloneLoss", [-7, 0]);
		f.dot = 1;
	}
	return ((yield* g.callSuper(f, [], rt.Args.Same)) || live(f.dot));
}, true, { args: ["M"] });

rt.type(3437, "/datum/reagent/consumable/ethanol/atomicbomb", "/datum/reagent/consumable/ethanol", {
	name: "Atomic Bomb",
	id: "atomicbomb",
	description: "Nuclear proliferation never tasted so good.",
	color: "#666300",
	boozepwr: 0,
	taste_description: "da bomb",
	glass_icon_state: "atomicbombglass",
	glass_name: "Atomic Bomb",
	glass_desc: "Nanotrasen cannot take legal responsibility for your actions after imbibing.",
});

// /datum/reagent/consumable/ethanol/atomicbomb/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1107)  may sleep
rt.def("/datum/reagent/consumable/ethanol/atomicbomb/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callName(f, live(f.args[0]), "set_drugginess", [50]);
	rt.setFv(f, "confused", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "confused", live(f.args[0])), 2), 0])));
	yield* g.callName(f, live(f.args[0]), "Dizzy", [10]);
	if (!truthy(rt.fv(f, "slurring", live(f.args[0])))) {
		rt.setFv(f, "slurring", live(f.args[0]), 1);
	}
	rt.modField(f, live(f.args[0]), "slurring", 3, add);
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 51, 200)) {
		yield* g.callName(f, live(f.args[0]), "Sleeping", [100, 0]);
		f.dot = 1;
	} else if (rt.inRange($0, 201, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [40, 0]);
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3438, "/datum/reagent/consumable/ethanol/gargle_blaster", "/datum/reagent/consumable/ethanol", {
	name: "Pan-Galactic Gargle Blaster",
	id: "gargleblaster",
	description: "Whoah, this stuff looks volatile!",
	color: "#664300",
	boozepwr: 0,
	taste_description: "your brains smashed out by a lemon wrapped around a gold brick",
	glass_icon_state: "gargleblasterglass",
	glass_name: "Pan-Galactic Gargle Blaster",
	glass_desc: "Like having your brain smashed out by a slice of lemon wrapped around a large gold brick.",
});

// /datum/reagent/consumable/ethanol/gargle_blaster/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1135)  may sleep
rt.def("/datum/reagent/consumable/ethanol/gargle_blaster/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.modField(f, live(f.args[0]), "dizziness", 6, add);
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 15, 45)) {
		if (!truthy(rt.fv(f, "slurring", live(f.args[0])))) {
			rt.setFv(f, "slurring", live(f.args[0]), 1);
		}
		rt.modField(f, live(f.args[0]), "slurring", 3, add);
	} else if (rt.inRange($0, 45, 55)) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			rt.setFv(f, "confused", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "confused", live(f.args[0])), 3), 0])));
		}
	} else if (rt.inRange($0, 55, 200)) {
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [55]);
	} else if (rt.inRange($0, 200, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3439, "/datum/reagent/consumable/ethanol/neurotoxin", "/datum/reagent/consumable/ethanol", {
	name: "Neurotoxin",
	id: "neurotoxin",
	description: "A strong neurotoxin that puts the subject into a death-like state.",
	color: "#2E2E61",
	boozepwr: 0,
	taste_description: "a numbing sensation",
	glass_icon_state: "neurotoxinglass",
	glass_name: "Neurotoxin",
	glass_desc: "A drink that is guaranteed to knock you silly.",
});

// /datum/reagent/consumable/ethanol/neurotoxin/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1163)  may sleep
rt.def("/datum/reagent/consumable/ethanol/neurotoxin/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callName(f, live(f.args[0]), "Knockdown", [60, 1, 0]);
	rt.modField(f, live(f.args[0]), "dizziness", 6, add);
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 15, 45)) {
		if (!truthy(rt.fv(f, "slurring", live(f.args[0])))) {
			rt.setFv(f, "slurring", live(f.args[0]), 1);
		}
		rt.modField(f, live(f.args[0]), "slurring", 3, add);
	} else if (rt.inRange($0, 45, 55)) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			rt.setFv(f, "confused", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "confused", live(f.args[0])), 3), 0])));
		}
	} else if (rt.inRange($0, 55, 200)) {
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [55]);
	} else if (rt.inRange($0, 200, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3440, "/datum/reagent/consumable/ethanol/hippies_delight", "/datum/reagent/consumable/ethanol", {
	name: "Hippie's Delight",
	id: "hippiesdelight",
	description: "You just don't get it maaaan.",
	color: "#664300",
	boozepwr: 0,
	metabolization_rate: 0.080000006,
	taste_description: "giving peace a chance",
	glass_icon_state: "hippiesdelightglass",
	glass_name: "Hippie's Delight",
	glass_desc: "A drink enjoyed by people during the 1960's.",
	nutriment_factor: 0,
});

// /datum/reagent/consumable/ethanol/hippies_delight/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/alcohol_reagents.dm:1194)  may sleep
rt.def("/datum/reagent/consumable/ethanol/hippies_delight/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.fv(f, "slurring", live(f.args[0])))) {
		rt.setFv(f, "slurring", live(f.args[0]), 1);
	}
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 5)) {
		yield* g.callName(f, live(f.args[0]), "Dizzy", [10]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [30]);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
	} else if (rt.inRange($0, 5, 10)) {
		yield* g.callName(f, live(f.args[0]), "Jitter", [20]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [20]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [45]);
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
	} else if (rt.inRange($0, 10, 200)) {
		yield* g.callName(f, live(f.args[0]), "Jitter", [40]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [40]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [60]);
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
	} else if (rt.inRange($0, 200, 9.999999848243207e+30)) {
		yield* g.callName(f, live(f.args[0]), "Jitter", [60]);
		yield* g.callName(f, live(f.args[0]), "Dizzy", [60]);
		yield* g.callName(f, live(f.args[0]), "set_drugginess", [75]);
		if (truthy(rt.op(f, "Prob", [], [40]))) {
			yield* g.callName(f, live(f.args[0]), "emote", [rt.op(f, "PickUnweighted", [2], ["twitch", "giggle"])]);
		}
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [2, 0]);
			f.dot = 1;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });
