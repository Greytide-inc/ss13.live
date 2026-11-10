// Based on /tg/station's code/modules/reagents/chemistry/reagents/alcohol_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3359, "/datum/reagent/consumable/ethanol", "/datum/reagent/consumable", {
	boozepwr: 65,
	name: "Ethanol",
	id: "ethanol",
	description: "A well-known alcohol with a variety of applications.",
	color: "#404030",
	taste_description: "alcohol",
	nutriment_factor: 0,
});

// alcohol_reagents.dm:37
rt.def("/datum/reagent/consumable/ethanol/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let H: Value = null;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = M).drunkenness < this.volume * this.boozepwr * ALCOHOL_THRESHOLD_MODIFIER) {
			H.drunkenness = max(H.drunkenness + rt.op(f, "Sqrt", [], [this.volume]) * this.boozepwr * ALCOHOL_RATE, 0);
		}
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

// alcohol_reagents.dm:44
rt.def("/datum/reagent/consumable/ethanol/proc/reaction_obj", function reaction_obj(f: Frame, O: Value, reac_volume: Value) {
	let paperaffected: Value = null, affectedbook: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/paper"))) {
		(paperaffected = O).clearpaper();
		to_chat(f.usr, `<span class='notice'>${paperaffected}'s ink washes away.</span>`);
	}
	if (rt.istype(O, T("/obj/item/weapon/book"))) {
		if (reac_volume >= 5) {
			(affectedbook = O).dat = null;
			to_chat(f.usr, `<span class='notice'>Through thorough application, you wash away ${affectedbook}'s writing.</span>`);
		} else {
			to_chat(f.usr, "<span class='warning'>The ink smears, but doesn't wash away!</span>");
		}
	}
	return f.dot;
});

// alcohol_reagents.dm:58
rt.def("/datum/reagent/consumable/ethanol/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let C: Value = null, power_multiplier: Value = null, s: Value = null, S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	if (rt.isIn(f, f.args[1], list(TOUCH, VAPOR, PATCH))) {
		yield* f.args[0].adjust_fire_stacks(f.args[2] / 15);
		if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
			C = f.args[0];
			power_multiplier = this.boozepwr / 65;
			for (s of each(C.surgeries)) {
				(S = s).success_multiplier = max(0.1 * power_multiplier, S.success_multiplier);
			}
		}
	}
	return (yield* parent_proc());
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

// alcohol_reagents.dm:96
rt.def("/datum/reagent/consumable/ethanol/beer/green/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.color != this.color) {
		M.add_atom_colour(this.color, TEMPORARY_COLOUR_PRIORITY);
	}
	return (yield* parent_proc());
}, true);

// alcohol_reagents.dm:101
rt.def("/datum/reagent/consumable/ethanol/beer/green/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	M.remove_atom_colour(TEMPORARY_COLOUR_PRIORITY, this.color);
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

// alcohol_reagents.dm:115
rt.def("/datum/reagent/consumable/ethanol/kahlua/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness = max(0, M.dizziness - 5);
	M.drowsyness = max(0, M.drowsyness - 3);
	yield* M.AdjustSleeping(-40, 0);
	M.Jitter(5);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// alcohol_reagents.dm:148
rt.def("/datum/reagent/consumable/ethanol/thirteenloko/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.drowsyness = max(0, M.drowsyness - 7);
	yield* M.AdjustSleeping(-40);
	if (M.bodytemperature > 310) {
		M.bodytemperature = max(310, M.bodytemperature - 7.5);
	}
	M.Jitter(5);
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:168
rt.def("/datum/reagent/consumable/ethanol/vodka/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.radiation = max(M.radiation - 2, 0);
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:184
rt.def("/datum/reagent/consumable/ethanol/bilk/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.getBruteLoss() && prob(10)) {
		yield* M.heal_bodypart_damage(1, 0, 0);
		f.dot = 1;
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

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

// alcohol_reagents.dm:201
rt.def("/datum/reagent/consumable/ethanol/threemileisland/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.set_drugginess(50);
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:307
rt.def("/datum/reagent/consumable/ethanol/absinthe/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(10)) {
		M.hallucination += 4;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// alcohol_reagents.dm:381
rt.def("/datum/reagent/consumable/ethanol/cuba_libre/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, (M.mind && M.mind.special_role), list("Revolutionary", "Head Revolutionary"))) {
		yield* M.adjustBruteLoss(-1, 0);
		yield* M.adjustFireLoss(-1, 0);
		yield* M.adjustToxLoss(-1, 0);
		yield* M.adjustOxyLoss(-5, 0);
		f.dot = 1;
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

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

// alcohol_reagents.dm:445
rt.def("/datum/reagent/consumable/ethanol/screwdrivercocktail/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, (M.mind && M.mind.assigned_role), list("Station Engineer", "Atmospheric Technician", "Chief Engineer"))) {
		M.radiation = max(M.radiation - 25, 0);
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:483
rt.def("/datum/reagent/consumable/ethanol/brave_bull/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.maxHealth == rt.initial(f, M, "maxHealth")) {
		M.maxHealth += 5;
		M.health += 5;
	}
	return (yield* parent_proc());
}, true);

// alcohol_reagents.dm:489
rt.def("/datum/reagent/consumable/ethanol/brave_bull/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	if (M.maxHealth == rt.initial(f, M, "maxHealth")) return f.dot;
	M.maxHealth = rt.initial(f, M, "maxHealth");
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

// alcohol_reagents.dm:516
rt.def("/datum/reagent/consumable/ethanol/toxins_special/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature < 330) {
		M.bodytemperature = min(330, M.bodytemperature + 22.5);
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:533
rt.def("/datum/reagent/consumable/ethanol/beepsky_smash/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.Stun(40, 0);
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:652
rt.def("/datum/reagent/consumable/ethanol/manhattan_proj/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.set_drugginess(30);
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:678
rt.def("/datum/reagent/consumable/ethanol/antifreeze/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature < 330) {
		M.bodytemperature = min(330, M.bodytemperature + 30);
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:694
rt.def("/datum/reagent/consumable/ethanol/barefoot/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let H: Value = null;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (!(H = M).shoes) {
			yield* H.adjustBruteLoss(-3, 0);
			f.dot = 1;
		}
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

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

// alcohol_reagents.dm:792
rt.def("/datum/reagent/consumable/ethanol/sbiten/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature < 360) {
		M.bodytemperature = min(360, M.bodytemperature + 75);
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:831
rt.def("/datum/reagent/consumable/ethanol/iced_beer/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature > 270) {
		M.bodytemperature = max(270, M.bodytemperature - 30);
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:914
rt.def("/datum/reagent/consumable/ethanol/changelingsting/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.mind && M.mind.changeling) {
		M.mind.changeling.chem_charges += this.metabolization_rate;
		M.mind.changeling.chem_charges = max(0, min(M.mind.changeling.chem_charges, M.mind.changeling.chem_storage));
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:942
rt.def("/datum/reagent/consumable/ethanol/syndicatebomb/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(5)) {
		playsound(rt.getStep(f, M, 0), rt.rsc("sound/effects/explosionfar.ogg"), 100, 1);
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:982
rt.def("/datum/reagent/consumable/ethanol/bananahonk/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, ((rt.istype(M, T("/mob/living/carbon/human")) ? 1 : 0) && M.job), list("Clown")) || rt.istype(M, T("/mob/living/carbon/monkey"))) {
		yield* M.heal_bodypart_damage(1, 1, 0);
		f.dot = 1;
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

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

// alcohol_reagents.dm:1000
rt.def("/datum/reagent/consumable/ethanol/silencer/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, ((rt.istype(M, T("/mob/living/carbon/human")) ? 1 : 0) && M.job), list("Mime"))) {
		yield* M.heal_bodypart_damage(1, 1);
		f.dot = 1;
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

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

// alcohol_reagents.dm:1055
rt.def("/datum/reagent/consumable/ethanol/fetching_fizz/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let O: Value = null;
	for (O of each(orange(3, M), T("/obj/item/weapon/ore"))) {
		yield* step_towards(O, rt.getStep(f, M, 0));
	}
	return (yield* parent_proc());
}, true);

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

// alcohol_reagents.dm:1073
rt.def("/datum/reagent/consumable/ethanol/hearty_punch/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.stat == 1 && M.health <= 0) {
		yield* M.adjustBruteLoss(-7, 0);
		yield* M.adjustFireLoss(-7, 0);
		yield* M.adjustToxLoss(-7, 0);
		yield* M.adjustOxyLoss(-7, 0);
		yield* M.adjustCloneLoss(-7, 0);
		f.dot = 1;
	}
	return ((yield* parent_proc()) || f.dot);
}, true);

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

// alcohol_reagents.dm:1107
rt.def("/datum/reagent/consumable/ethanol/atomicbomb/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.set_drugginess(50);
	M.confused = max(M.confused + 2, 0);
	M.Dizzy(10);
	if (!M.slurring) {
		M.slurring = 1;
	}
	M.slurring += 3;
	if (rt.inRange(this.current_cycle, 51, 200)) {
		yield* M.Sleeping(100, 0);
		f.dot = 1;
	} else if (rt.inRange(this.current_cycle, 201, 1e+31)) {
		yield* M.AdjustSleeping(40, 0);
		yield* M.adjustToxLoss(2, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// alcohol_reagents.dm:1135
rt.def("/datum/reagent/consumable/ethanol/gargle_blaster/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.dizziness += 6;
	if (rt.inRange(this.current_cycle, 15, 45)) {
		if (!M.slurring) {
			M.slurring = 1;
		}
		M.slurring += 3;
	} else if (rt.inRange(this.current_cycle, 45, 55)) {
		if (prob(50)) {
			M.confused = max(M.confused + 3, 0);
		}
	} else if (rt.inRange(this.current_cycle, 55, 200)) {
		yield* M.set_drugginess(55);
	} else if (rt.inRange(this.current_cycle, 200, 1e+31)) {
		yield* M.adjustToxLoss(2, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// alcohol_reagents.dm:1163
rt.def("/datum/reagent/consumable/ethanol/neurotoxin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.Knockdown(60, 1, 0);
	M.dizziness += 6;
	if (rt.inRange(this.current_cycle, 15, 45)) {
		if (!M.slurring) {
			M.slurring = 1;
		}
		M.slurring += 3;
	} else if (rt.inRange(this.current_cycle, 45, 55)) {
		if (prob(50)) {
			M.confused = max(M.confused + 3, 0);
		}
	} else if (rt.inRange(this.current_cycle, 55, 200)) {
		yield* M.set_drugginess(55);
	} else if (rt.inRange(this.current_cycle, 200, 1e+31)) {
		yield* M.adjustToxLoss(2, 0);
	}
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

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

// alcohol_reagents.dm:1194
rt.def("/datum/reagent/consumable/ethanol/hippies_delight/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (!M.slurring) {
		M.slurring = 1;
	}
	if (rt.inRange(this.current_cycle, 1, 5)) {
		M.Dizzy(10);
		yield* M.set_drugginess(30);
		if (prob(10)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
	} else if (rt.inRange(this.current_cycle, 5, 10)) {
		M.Jitter(20);
		M.Dizzy(20);
		yield* M.set_drugginess(45);
		if (prob(20)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
	} else if (rt.inRange(this.current_cycle, 10, 200)) {
		M.Jitter(40);
		M.Dizzy(40);
		yield* M.set_drugginess(60);
		if (prob(30)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
	} else if (rt.inRange(this.current_cycle, 200, 1e+31)) {
		M.Jitter(60);
		M.Dizzy(60);
		yield* M.set_drugginess(75);
		if (prob(40)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
		if (prob(30)) {
			yield* M.adjustToxLoss(2, 0);
			f.dot = 1;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
