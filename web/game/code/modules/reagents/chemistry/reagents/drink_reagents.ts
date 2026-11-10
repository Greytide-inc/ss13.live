// Based on /tg/station's code/modules/reagents/chemistry/reagents/drink_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// drink_reagents.dm:18
rt.def("/datum/reagent/consumable/orangejuice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getOxyLoss() && prob(30)) {
		yield* M.adjustOxyLoss(-1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:34
rt.def("/datum/reagent/consumable/tomatojuice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getFireLoss() && prob(20)) {
		yield* M.heal_bodypart_damage(0, 1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:50
rt.def("/datum/reagent/consumable/limejuice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getToxLoss() && prob(20)) {
		yield* M.adjustToxLoss(-1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:66
rt.def("/datum/reagent/consumable/carrotjuice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjust_blurriness(-1);
	yield* M.adjust_blindness(-1);
	if (rt.inRange(this.current_cycle, 1, 20)) {
	} else if (rt.inRange(this.current_cycle, 21, 1e+31)) {
		if (prob(this.current_cycle - 10)) {
			yield* M.cure_nearsighted();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:105
rt.def("/datum/reagent/consumable/poisonberryjuice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustToxLoss(1, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:140
rt.def("/datum/reagent/consumable/banana/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, ((rt.istype(M, T("/mob/living/carbon/human")) ? 1 : 0) && M.job), list("Clown")) || rt.istype(M, T("/mob/living/carbon/monkey"))) {
		yield* M.heal_bodypart_damage(1, 1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:156
rt.def("/datum/reagent/consumable/nothing/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, ((rt.istype(M, T("/mob/living/carbon/human")) ? 1 : 0) && M.job), list("Mime"))) {
		yield* M.heal_bodypart_damage(1, 1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3453, "/datum/reagent/consumable/laughter", "/datum/reagent/consumable", {
	name: "Laughter",
	id: "laughter",
	description: "Some say that this is the best medicine, but recent studies have proven that to be untrue.",
	metabolization_rate: 1e+31,
	color: "#FF4DD2",
	taste_description: "laughter",
});

// drink_reagents.dm:170
rt.def("/datum/reagent/consumable/laughter/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let laughnum: Value = null;
	if (!rt.istype(M, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!M.silent) {
		yield* M.emote("laugh");
		laughnum = rand(1, 2);
		if (M.gender == "male") {
			if (laughnum == 1) {
				playsound(rt.getStep(f, M, 0), rt.rsc("sound/voice/human/manlaugh1.ogg"), 50, 1);
			}
			if (laughnum == 2) {
				playsound(rt.getStep(f, M, 0), rt.rsc("sound/voice/human/manlaugh2.ogg"), 50, 1);
			}
		} else if (M.gender == "female") {
			playsound(rt.getStep(f, M, 0), rt.rsc("sound/voice/human/womanlaugh.ogg"), 65, 1);
		} else {
			playsound(rt.getStep(f, M, 0), rt.rsc("sound/voice/human/manlaugh1.ogg"), 50, 1);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:215
rt.def("/datum/reagent/consumable/milk/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let Mdna: Value = null;
	if (M.getBruteLoss() && prob(20)) {
		yield* M.heal_bodypart_damage(1, 0, 0);
		f.dot = 1;
	}
	if (this.holder.has_reagent("capsaicin")) {
		yield* this.holder.remove_reagent("capsaicin", 2);
	}
	if ((Mdna = M.has_dna()) && Mdna.species && (Mdna.species.id == "plasmaman" || Mdna.species.id == "skeleton")) {
		yield* M.heal_bodypart_damage(1, 0, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:237
rt.def("/datum/reagent/consumable/soymilk/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getBruteLoss() && prob(20)) {
		yield* M.heal_bodypart_damage(1, 0, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:253
rt.def("/datum/reagent/consumable/cream/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getBruteLoss() && prob(20)) {
		yield* M.heal_bodypart_damage(1, 0, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:271
rt.def("/datum/reagent/consumable/coffee/proc/overdose_process", function overdose_process(f: Frame, M: Value) {
	M.Jitter(5);
	parent_proc();
	return f.dot;
}, false);

// drink_reagents.dm:275
rt.def("/datum/reagent/consumable/coffee/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	yield* M.AdjustSleeping(-40, 0);
	if (M.bodytemperature < 310) {
		M.bodytemperature = min(310, M.bodytemperature + 37.5);
	}
	if (this.holder.has_reagent("frostoil")) {
		yield* this.holder.remove_reagent("frostoil", 5);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:297
rt.def("/datum/reagent/consumable/tea/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 2);
	M.drowsyness = max(0, M.drowsyness - 1);
	M.jitteriness = max(0, M.jitteriness - 3);
	yield* M.AdjustSleeping(-20, 0);
	if (M.getToxLoss() && prob(20)) {
		yield* M.adjustToxLoss(-1, 0);
	}
	if (M.bodytemperature < 310) {
		M.bodytemperature = min(310, M.bodytemperature + 30);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:320
rt.def("/datum/reagent/consumable/tea/arnold_palmer/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(5)) {
		to_chat(M, `<span class = 'notice'>${pick("You remember to square your shoulders.", "You remember to keep your head down.", "You can't decide between squaring your shoulders and keeping your head down.", "You remember to relax.", "You think about how someday you'll get two strokes off your golf game.")}</span>`);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:337
rt.def("/datum/reagent/consumable/icecoffee/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	yield* M.AdjustSleeping(-40, 0);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	M.Jitter(5);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:358
rt.def("/datum/reagent/consumable/icetea/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 2);
	M.drowsyness = max(0, M.drowsyness - 1);
	yield* M.AdjustSleeping(-40, 0);
	if (M.getToxLoss() && prob(20)) {
		yield* M.adjustToxLoss(-1, 0);
	}
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:379
rt.def("/datum/reagent/consumable/space_cola/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.drowsyness = max(0, M.drowsyness - 5);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:395
rt.def("/datum/reagent/consumable/nuka_cola/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.Jitter(20);
	yield* M.set_drugginess(30);
	M.dizziness += 5;
	M.drowsyness = 0;
	yield* M.AdjustSleeping(-40, 0);
	(rt.modField(f, M, "status_flags", 32, rt.bitOr));
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:417
rt.def("/datum/reagent/consumable/spacemountainwind/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.drowsyness = max(0, M.drowsyness - 7);
	yield* M.AdjustSleeping(-20, 0);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	M.Jitter(5);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:436
rt.def("/datum/reagent/consumable/dr_gibb/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.drowsyness = max(0, M.drowsyness - 6);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:453
rt.def("/datum/reagent/consumable/space_up/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 12);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:469
rt.def("/datum/reagent/consumable/lemon_lime/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 12);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:484
rt.def("/datum/reagent/consumable/pwr_game/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 12);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:499
rt.def("/datum/reagent/consumable/shamblers/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 12);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:513
rt.def("/datum/reagent/consumable/sodawater/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:530
rt.def("/datum/reagent/consumable/tonic/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	yield* M.AdjustSleeping(-40, 0);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:550
rt.def("/datum/reagent/consumable/ice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.bodytemperature = max(M.bodytemperature - 7.5, 0);
	yield* parent_proc();
	return f.dot;
}, true);

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

// drink_reagents.dm:564
rt.def("/datum/reagent/consumable/soy_latte/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	yield* M.SetSleeping(0, 0);
	if (M.bodytemperature < 310) {
		M.bodytemperature = min(310, M.bodytemperature + 7.5);
	}
	M.Jitter(5);
	if (M.getBruteLoss() && prob(20)) {
		yield* M.heal_bodypart_damage(1, 0, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:586
rt.def("/datum/reagent/consumable/cafe_latte/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	yield* M.SetSleeping(0, 0);
	if (M.bodytemperature < 310) {
		M.bodytemperature = min(310, M.bodytemperature + 7.5);
	}
	M.Jitter(5);
	if (M.getBruteLoss() && prob(20)) {
		yield* M.heal_bodypart_damage(1, 0, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// drink_reagents.dm:608
rt.def("/datum/reagent/consumable/doctor_delight/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(-0.5, 0);
	yield* M.adjustFireLoss(-0.5, 0);
	yield* M.adjustToxLoss(-0.5, 0);
	yield* M.adjustOxyLoss(-0.5, 0);
	if (M.nutrition && M.nutrition - 2 > 0) {
		if (!(M.mind && M.mind.assigned_role == "Medical Doctor")) {
			M.nutrition -= 2;
		}
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);
