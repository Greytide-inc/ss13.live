// From code/modules/reagents/chemistry/reagents/drink_reagents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3442, "/datum/reagent/consumable/orangejuice", "/datum/reagent/consumable", {
	name: "Orange Juice",
	id: "orangejuice",
	description: "Both delicious AND rich in Vitamin C, what more do you need?",
	color: "#E78108",
	taste_description: "oranges",
	glass_icon_state: "glass_orange",
	glass_name: "glass of orange juice",
	glass_desc: "Vitamins! Yay!",
});

// /datum/reagent/consumable/orangejuice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:18)  may sleep
rt.def("/datum/reagent/consumable/orangejuice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getOxyLoss", []))) && truthy(rt.op(f, "Prob", [], [30])))) {
		yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3443, "/datum/reagent/consumable/tomatojuice", "/datum/reagent/consumable", {
	name: "Tomato Juice",
	id: "tomatojuice",
	description: "Tomatoes made into juice. What a waste of big, juicy tomatoes, huh?",
	color: "#731008",
	taste_description: "tomatoes",
	glass_icon_state: "glass_red",
	glass_name: "glass of tomato juice",
	glass_desc: "Are you sure this is tomato juice?",
});

// /datum/reagent/consumable/tomatojuice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:34)  may sleep
rt.def("/datum/reagent/consumable/tomatojuice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getFireLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [0, 1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3444, "/datum/reagent/consumable/limejuice", "/datum/reagent/consumable", {
	name: "Lime Juice",
	id: "limejuice",
	description: "The sweet-sour juice of limes.",
	color: "#365E30",
	taste_description: "unbearable sourness",
	glass_icon_state: "glass_green",
	glass_name: "glass of lime juice",
	glass_desc: "A glass of sweet-sour lime juice.",
});

// /datum/reagent/consumable/limejuice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:50)  may sleep
rt.def("/datum/reagent/consumable/limejuice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getToxLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3445, "/datum/reagent/consumable/carrotjuice", "/datum/reagent/consumable", {
	name: "Carrot Juice",
	id: "carrotjuice",
	description: "It is just like a carrot but without crunching.",
	color: "#973800",
	taste_description: "carrots",
	glass_icon_state: "carrotjuice",
	glass_name: "glass of  carrot juice",
	glass_desc: "It's just like a carrot but without crunching.",
});

// /datum/reagent/consumable/carrotjuice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:66)  may sleep
rt.def("/datum/reagent/consumable/carrotjuice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callName(f, live(f.args[0]), "adjust_blurriness", [-1]);
	yield* g.callName(f, live(f.args[0]), "adjust_blindness", [-1]);
	$0 = rt.sv(f, "current_cycle");
	if (rt.inRange($0, 1, 20)) {
	} else if (rt.inRange($0, 21, 9.999999848243207e+30)) {
		if (truthy(rt.op(f, "Prob", [], [subtract(rt.sv(f, "current_cycle"), 10)]))) {
			yield* g.callName(f, live(f.args[0]), "cure_nearsighted", []);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true, { args: ["M"] });

rt.type(3448, "/datum/reagent/consumable/poisonberryjuice", "/datum/reagent/consumable", {
	name: "Poison Berry Juice",
	id: "poisonberryjuice",
	description: "A tasty juice blended from various kinds of very deadly and toxic berries.",
	color: "#863353",
	taste_description: "berries",
	glass_icon_state: "poisonberryjuice",
	glass_name: "glass of berry juice",
	glass_desc: "Berry juice. Or maybe it's poison. Who cares?",
});

// /datum/reagent/consumable/poisonberryjuice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:105)  may sleep
rt.def("/datum/reagent/consumable/poisonberryjuice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [1, 0]);
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3451, "/datum/reagent/consumable/banana", "/datum/reagent/consumable", {
	name: "Banana Juice",
	id: "banana",
	description: "The raw essence of a banana. HONK",
	color: "#863333",
	taste_description: "banana",
	glass_icon_state: "banana",
	glass_name: "glass of banana juice",
	glass_desc: "The raw essence of a banana. HONK.",
});

// /datum/reagent/consumable/banana/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:140)  may sleep
rt.def("/datum/reagent/consumable/banana/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((rt.isIn(f, ((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0) && rt.fv(f, "job", live(f.args[0]))), rt.list("Clown")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3452, "/datum/reagent/consumable/nothing", "/datum/reagent/consumable", {
	name: "Nothing",
	id: "nothing",
	description: "Absolutely nothing.",
	taste_description: "nothing",
	glass_icon_state: "nothing",
	glass_name: "Nothing",
	glass_desc: "Absolutely nothing.",
	shot_glass_icon_state: "shotglass",
});

// /datum/reagent/consumable/nothing/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:156)  may sleep
rt.def("/datum/reagent/consumable/nothing/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy((rt.isIn(f, ((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0) && rt.fv(f, "job", live(f.args[0]))), rt.list("Mime")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 1, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3453, "/datum/reagent/consumable/laughter", "/datum/reagent/consumable", {
	name: "Laughter",
	id: "laughter",
	description: "Some say that this is the best medicine, but recent studies have proven that to be untrue.",
	metabolization_rate: 1e+31,
	color: "#FF4DD2",
	taste_description: "laughter",
});

// /datum/reagent/consumable/laughter/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:170)  may sleep
rt.def("/datum/reagent/consumable/laughter/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let laughnum: Value = null;
	f.vars = () => [laughnum];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "silent", live(f.args[0])))) {
		yield* g.callName(f, live(f.args[0]), "emote", ["laugh"]);
		laughnum = (yield* g.call(f, P("/proc/rand"), null, [1, 2]));
		if (isEqual(rt.fv(f, "gender", live(f.args[0])), "male")) {
			if (isEqual(live(laughnum), 1)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/voice/human/manlaugh1.ogg"), 50, 1]);
			}
			if (isEqual(live(laughnum), 2)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/voice/human/manlaugh2.ogg"), 50, 1]);
			}
		} else {
			if (isEqual(rt.fv(f, "gender", live(f.args[0])), "female")) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/voice/human/womanlaugh.ogg"), 65, 1]);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/voice/human/manlaugh1.ogg"), 50, 1]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3456, "/datum/reagent/consumable/milk", "/datum/reagent/consumable", {
	name: "Milk",
	id: "milk",
	description: "An opaque white liquid produced by the mammary glands of mammals.",
	color: "#DFDFDF",
	taste_description: "milk",
	glass_icon_state: "glass_white",
	glass_name: "glass of milk",
	glass_desc: "White and nutritious goodness!",
});

// /datum/reagent/consumable/milk/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:215)  may sleep
rt.def("/datum/reagent/consumable/milk/proc/on_mob_life", function* on_mob_life(f: Frame) {
	let Mdna: Value = null;
	f.vars = () => [Mdna];
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
		f.dot = 1;
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["capsaicin"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["capsaicin", 2]);
	}
	if (((truthy((Mdna = (yield* g.callName(f, live(f.args[0]), "has_dna", [])))) && truthy(rt.fv(f, "species", live(Mdna)))) && (isEqual(rt.gv(f, "id", rt.fv(f, "species", live(Mdna))), "plasmaman") || isEqual(rt.gv(f, "id", rt.fv(f, "species", live(Mdna))), "skeleton")))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3458, "/datum/reagent/consumable/soymilk", "/datum/reagent/consumable", {
	name: "Soy Milk",
	id: "soymilk",
	description: "An opaque white liquid made from soybeans.",
	color: "#DFDFC7",
	taste_description: "soy milk",
	glass_icon_state: "glass_white",
	glass_name: "glass of soy milk",
	glass_desc: "White and nutritious soy goodness!",
});

// /datum/reagent/consumable/soymilk/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:237)  may sleep
rt.def("/datum/reagent/consumable/soymilk/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3459, "/datum/reagent/consumable/cream", "/datum/reagent/consumable", {
	name: "Cream",
	id: "cream",
	description: "The fatty, still liquid part of milk. Why don't you mix this with sum scotch, eh?",
	color: "#DFD7AF",
	taste_description: "creamy milk",
	glass_icon_state: "glass_white",
	glass_name: "glass of cream",
	glass_desc: "Ewwww...",
});

// /datum/reagent/consumable/cream/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:253)  may sleep
rt.def("/datum/reagent/consumable/cream/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
		f.dot = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3460, "/datum/reagent/consumable/coffee", "/datum/reagent/consumable", {
	name: "Coffee",
	id: "coffee",
	description: "Coffee is a brewed drink prepared from roasted seeds, commonly called coffee beans, of the coffee plant.",
	color: "#482000",
	overdose_threshold: 80,
	taste_description: "bitterness",
	glass_icon_state: "glass_brown",
	glass_name: "glass of coffee",
	glass_desc: "Don't drop it, or you'll send scalding liquid and glass shards everywhere.",
	nutriment_factor: 0,
});

// /datum/reagent/consumable/coffee/proc/overdose_process  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:271)
rt.def("/datum/reagent/consumable/coffee/proc/overdose_process", function overdose_process(f: Frame) {
	rt.callName(f, live(f.args[0]), "Jitter", [5]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

// /datum/reagent/consumable/coffee/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:275)  may sleep
rt.def("/datum/reagent/consumable/coffee/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40, 0]);
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 37.5)])));
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "holder"), "has_reagent", ["frostoil"])))) {
		yield* g.callName(f, rt.sv(f, "holder"), "remove_reagent", ["frostoil", 5]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3461, "/datum/reagent/consumable/tea", "/datum/reagent/consumable", {
	name: "Tea",
	id: "tea",
	description: "Tasty black tea, it has antioxidants, it's good for you!",
	color: "#101000",
	taste_description: "tart black tea",
	glass_icon_state: "teaglass",
	glass_name: "glass of tea",
	glass_desc: "Drinking it from here would not seem right.",
	nutriment_factor: 0,
});

// /datum/reagent/consumable/tea/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:297)  may sleep
rt.def("/datum/reagent/consumable/tea/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 2)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 1)])));
	rt.setFv(f, "jitteriness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "jitteriness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-20, 0]);
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getToxLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
	}
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 30)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3462, "/datum/reagent/consumable/tea/arnold_palmer", "/datum/reagent/consumable/tea", {
	name: "Arnold Palmer",
	id: "arnold_palmer",
	description: "Encourages the patient to go golfing.",
	color: "#FFB766",
	taste_description: "bitter tea",
	glass_icon_state: "arnold_palmer",
	glass_name: "Arnold Palmer",
	glass_desc: "You feel like taking a few golf swings after a few swigs of this.",
	nutriment_factor: 2,
});

// /datum/reagent/consumable/tea/arnold_palmer/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:320)  may sleep
rt.def("/datum/reagent/consumable/tea/arnold_palmer/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class = 'notice'>＀</span>", [rt.op(f, "PickUnweighted", [5], ["You remember to square your shoulders.", "You remember to keep your head down.", "You can't decide between squaring your shoulders and keeping your head down.", "You remember to relax.", "You think about how someday you'll get two strokes off your golf game."])])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3463, "/datum/reagent/consumable/icecoffee", "/datum/reagent/consumable", {
	name: "Iced Coffee",
	id: "icecoffee",
	description: "Coffee and ice, refreshing and cool.",
	color: "#102838",
	taste_description: "bitter coldness",
	glass_icon_state: "icedcoffeeglass",
	glass_name: "Iced Coffee",
	glass_desc: "A drink to perk you up and refresh you!",
	nutriment_factor: 0,
});

// /datum/reagent/consumable/icecoffee/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:337)  may sleep
rt.def("/datum/reagent/consumable/icecoffee/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40, 0]);
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3464, "/datum/reagent/consumable/icetea", "/datum/reagent/consumable", {
	name: "Iced Tea",
	id: "icetea",
	description: "No relation to a certain rap artist/actor.",
	color: "#104038",
	taste_description: "sweet tea",
	glass_icon_state: "icedteaglass",
	glass_name: "Iced Tea",
	glass_desc: "All natural, antioxidant-rich flavour sensation.",
	nutriment_factor: 0,
});

// /datum/reagent/consumable/icetea/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:358)  may sleep
rt.def("/datum/reagent/consumable/icetea/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 2)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 1)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40, 0]);
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getToxLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-1, 0]);
	}
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3465, "/datum/reagent/consumable/space_cola", "/datum/reagent/consumable", {
	name: "Cola",
	id: "cola",
	description: "A refreshing beverage.",
	color: "#100800",
	taste_description: "cola",
	glass_icon_state: "glass_brown",
	glass_name: "glass of space Cola",
	glass_desc: "A glass of refreshing Space Cola.",
});

// /datum/reagent/consumable/space_cola/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:379)  may sleep
rt.def("/datum/reagent/consumable/space_cola/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 5)])));
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3466, "/datum/reagent/consumable/nuka_cola", "/datum/reagent/consumable", {
	name: "Nuka Cola",
	id: "nuka_cola",
	description: "Cola, cola never changes.",
	color: "#100800",
	taste_description: "the future",
	glass_icon_state: "nuka_colaglass",
	glass_name: "Nuka Cola",
	glass_desc: "Don't cry, Don't raise your eye, It's only nuclear wasteland.",
});

// /datum/reagent/consumable/nuka_cola/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:395)  may sleep
rt.def("/datum/reagent/consumable/nuka_cola/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "Jitter", [20]);
	yield* g.callName(f, live(f.args[0]), "set_drugginess", [30]);
	rt.modField(f, live(f.args[0]), "dizziness", 5, add);
	rt.setFv(f, "drowsyness", live(f.args[0]), 0);
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40, 0]);
	(rt.modField(f, live(f.args[0]), "status_flags", 32, rt.bitOr));
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3467, "/datum/reagent/consumable/spacemountainwind", "/datum/reagent/consumable", {
	name: "SM Wind",
	id: "spacemountainwind",
	description: "Blows right through you like a space wind.",
	color: "#102000",
	taste_description: "sweet citrus soda",
	glass_icon_state: "Space_mountain_wind_glass",
	glass_name: "glass of Space Mountain Wind",
	glass_desc: "Space Mountain Wind. As you know, there are no mountains in space, only wind.",
});

// /datum/reagent/consumable/spacemountainwind/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:417)  may sleep
rt.def("/datum/reagent/consumable/spacemountainwind/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 7)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-20, 0]);
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3468, "/datum/reagent/consumable/dr_gibb", "/datum/reagent/consumable", {
	name: "Dr. Gibb",
	id: "dr_gibb",
	description: "A delicious blend of 42 different flavours.",
	color: "#102000",
	taste_description: "cherry soda",
	glass_icon_state: "dr_gibb_glass",
	glass_name: "glass of Dr. Gibb",
	glass_desc: "Dr. Gibb. Not as dangerous as the glass_name might imply.",
});

// /datum/reagent/consumable/dr_gibb/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:436)  may sleep
rt.def("/datum/reagent/consumable/dr_gibb/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 6)])));
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3469, "/datum/reagent/consumable/space_up", "/datum/reagent/consumable", {
	name: "Space-Up",
	id: "space_up",
	description: "Tastes like a hull breach in your mouth.",
	color: "#00FF00",
	taste_description: "cherry soda",
	glass_icon_state: "space-up_glass",
	glass_name: "glass of Space-up",
	glass_desc: "Space-up. It helps you keep your cool.",
});

// /datum/reagent/consumable/space_up/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:453)  may sleep
rt.def("/datum/reagent/consumable/space_up/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 12)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3470, "/datum/reagent/consumable/lemon_lime", "/datum/reagent/consumable", {
	name: "Lemon Lime",
	description: "A tangy substance made of 0.5% natural citrus!",
	id: "lemon_lime",
	color: "#8CFF00",
	taste_description: "tangy lime and lemon soda",
	glass_icon_state: "glass_yellow",
	glass_name: "glass of Lemon-Lime",
	glass_desc: "You're pretty certain a real fruit has never actually touched this.",
});

// /datum/reagent/consumable/lemon_lime/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:469)  may sleep
rt.def("/datum/reagent/consumable/lemon_lime/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 12)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3471, "/datum/reagent/consumable/pwr_game", "/datum/reagent/consumable", {
	name: "Pwr Game",
	description: "The only drink with the PWR that true gamers crave.",
	id: "pwr_game",
	color: "#9385bf",
	taste_description: "sweet and salty tang",
	glass_icon_state: "glass_red",
	glass_name: "glass of Pwr Game",
	glass_desc: "Goes well with a Vlad's salad.",
});

// /datum/reagent/consumable/pwr_game/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:484)  may sleep
rt.def("/datum/reagent/consumable/pwr_game/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 12)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3472, "/datum/reagent/consumable/shamblers", "/datum/reagent/consumable", {
	name: "Shambler's Juice",
	description: "~Shake me up some of that Shambler's Juice!~",
	id: "shamblers",
	color: "#f00060",
	taste_description: "carbonated metallic soda",
	glass_icon_state: "glass_red",
	glass_name: "glass of Shambler's Juice",
	glass_desc: "Mmm mm, shambly.",
});

// /datum/reagent/consumable/shamblers/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:499)  may sleep
rt.def("/datum/reagent/consumable/shamblers/proc/on_mob_life", function* on_mob_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 12)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3473, "/datum/reagent/consumable/sodawater", "/datum/reagent/consumable", {
	name: "Soda Water",
	id: "sodawater",
	description: "A can of club soda. Why not make a scotch and soda?",
	color: "#619494",
	taste_description: "carbonated water",
	glass_icon_state: "glass_clear",
	glass_name: "glass of Soda Water",
	glass_desc: "Soda water. Why not make a scotch and soda?",
});

// /datum/reagent/consumable/sodawater/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:513)  may sleep
rt.def("/datum/reagent/consumable/sodawater/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3474, "/datum/reagent/consumable/tonic", "/datum/reagent/consumable", {
	name: "Tonic Water",
	id: "tonic",
	description: "It tastes strange but at least the quinine keeps the Space Malaria at bay.",
	color: "#0064C8",
	taste_description: "tart and fresh",
	glass_icon_state: "glass_clear",
	glass_name: "glass of Tonic Water",
	glass_desc: "Quinine tastes funny, but at least it'll keep that Space Malaria away.",
});

// /datum/reagent/consumable/tonic/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:530)  may sleep
rt.def("/datum/reagent/consumable/tonic/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "AdjustSleeping", [-40, 0]);
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [310, subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3475, "/datum/reagent/consumable/ice", "/datum/reagent/consumable", {
	name: "Ice",
	id: "ice",
	description: "Frozen water, your dentist wouldn't like you chewing this.",
	reagent_state: 1,
	color: "#619494",
	taste_description: "ice",
	glass_icon_state: "iceglass",
	glass_name: "glass of ice",
	glass_desc: "Generally, you're supposed to put something else in there too...",
});

// /datum/reagent/consumable/ice/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:550)  may sleep
rt.def("/datum/reagent/consumable/ice/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5), 0])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

rt.type(3476, "/datum/reagent/consumable/soy_latte", "/datum/reagent/consumable", {
	name: "Soy Latte",
	id: "soy_latte",
	description: "A nice and tasty beverage while you are reading your hippie books.",
	color: "#664300",
	taste_description: "creamy coffee",
	glass_icon_state: "soy_latte",
	glass_name: "Soy Latte",
	glass_desc: "A nice and refreshing beverage while you're reading.",
});

// /datum/reagent/consumable/soy_latte/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:564)  may sleep
rt.def("/datum/reagent/consumable/soy_latte/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "SetSleeping", [0, 0]);
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3477, "/datum/reagent/consumable/cafe_latte", "/datum/reagent/consumable", {
	name: "Cafe Latte",
	id: "cafe_latte",
	description: "A nice, strong and tasty beverage while you are reading.",
	color: "#664300",
	taste_description: "bitter cream",
	glass_icon_state: "cafe_latte",
	glass_name: "Cafe Latte",
	glass_desc: "A nice, strong and refreshing beverage while you're reading.",
});

// /datum/reagent/consumable/cafe_latte/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:586)  may sleep
rt.def("/datum/reagent/consumable/cafe_latte/proc/on_mob_life", function* on_mob_life(f: Frame) {
	rt.setFv(f, "dizziness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "dizziness", live(f.args[0])), 5)])));
	rt.setFv(f, "drowsyness", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "drowsyness", live(f.args[0])), 3)])));
	yield* g.callName(f, live(f.args[0]), "SetSleeping", [0, 0]);
	if (rt.lt(rt.fv(f, "bodytemperature", live(f.args[0])), 310)) {
		rt.setFv(f, "bodytemperature", live(f.args[0]), (yield* g.call(f, P("/proc/min"), null, [310, add(rt.fv(f, "bodytemperature", live(f.args[0])), 7.5)])));
	}
	yield* g.callName(f, live(f.args[0]), "Jitter", [5]);
	if ((truthy((yield* g.callName(f, live(f.args[0]), "getBruteLoss", []))) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(f.args[0]), "heal_bodypart_damage", [1, 0, 0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });

rt.type(3478, "/datum/reagent/consumable/doctor_delight", "/datum/reagent/consumable", {
	name: "The Doctor's Delight",
	id: "doctorsdelight",
	description: "A gulp a day keeps the Medibot away! A mixture of juices that heals most damage types fairly quickly at the cost of hunger.",
	color: "#FF8CFF",
	taste_description: "homely fruit",
	glass_icon_state: "doctorsdelightglass",
	glass_name: "Doctor's Delight",
	glass_desc: "The space doctor's favorite. Guaranteed to restore bodily injury; side effects include cravings and hunger.",
});

// /datum/reagent/consumable/doctor_delight/proc/on_mob_life  (code/modules/reagents/chemistry/reagents/drink_reagents.dm:608)  may sleep
rt.def("/datum/reagent/consumable/doctor_delight/proc/on_mob_life", function* on_mob_life(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [-0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustFireLoss", [-0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustToxLoss", [-0.5, 0]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [-0.5, 0]);
	if ((truthy(rt.fv(f, "nutrition", live(f.args[0]))) && rt.gt(subtract(rt.fv(f, "nutrition", live(f.args[0])), 2), 0))) {
		if (!(truthy(rt.fv(f, "mind", live(f.args[0]))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(f.args[0]))), "Medical Doctor"))) {
			(rt.modField(f, live(f.args[0]), "nutrition", 2, subtract));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	f.dot = 1;
	return f.dot;
}, true, { args: ["M"] });
