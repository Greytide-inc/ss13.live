// From code/modules/mob/living/carbon/human/species_types/golems.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4080, "/datum/species/golem", "/datum/species", {
	info_text: "As an <span class='danger'>Iron Golem</span>, you don't have any special traits.",
	prefix: "Iron",
	special_names: null,
	human_surname_chance: 3,
	special_name_chance: 5,
	name: "Golem",
	id: "iron golem",
	species_traits: null,
	speedmod: 2,
	armor: 55,
	siemens_coeff: 0,
	punchdamagelow: 5,
	punchdamagehigh: 14,
	punchstunthreshold: 11,
	no_equip: null,
	nojumpsuit: 1,
	sexes: 1,
	damage_overlay_type: "",
	blacklisted: 1,
	dangerous_existence: 1,
	limbs_id: "golem",
	fixed_mut_color: "aaa",
	mutant_organs: null,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem"),
});

// /datum/species/golem/proc/<init>  (code/modules/mob/living/carbon/human/species_types/golems.dm:6)
rt.def("/datum/species/golem/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_traits", rt.list(10, 6, 7, 8, 13, 11, 12, 9, 14, 15, 18, 1, 26));
	rt.setSv(f, "no_equip", rt.list(2, 13, 9, 12, 14, 17));
	$0 = $0;
	rt.setSv(f, "mutant_organs", rt.list(T("/obj/item/organ/adamantine_resonator")));
	return f.dot;
});

// /datum/species/golem/proc/random_name  (code/modules/mob/living/carbon/human/species_types/golems.dm:32)
rt.def("/datum/species/golem/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let golem_surname: Value = null, golem_name: Value = null;
	f.vars = () => [golem_surname, golem_name];
	golem_surname = rt.op(f, "PickUnweighted", [1], [rt.gl("golem_names")]);
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "human_surname_chance")]))) {
		golem_surname = rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")]);
	} else {
		if (((truthy(rt.sv(f, "special_names")) && truthy(rt.len(f, rt.sv(f, "special_names")))) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "special_name_chance")])))) {
			golem_surname = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "special_names")]);
		}
	}
	return (golem_name = fmt("＀ ＀", [rt.sv(f, "prefix"), live(golem_surname)]));
});

rt.type(4081, "/datum/species/golem/random", "/datum/species/golem", {
	name: "Random Golem",
	blacklisted: 0,
	dangerous_existence: 0,
});

// /datum/species/golem/random/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:49)  may sleep
rt.def("/datum/species/golem/random/proc/on_species_gain", function* on_species_gain(f: Frame) {
	let golem_types: Value = null, golem_type: Value = null, H: Value = null;
	f.vars = () => [golem_types, golem_type, H];
	yield* g.callSuper(f, [], rt.Args.Same);
	golem_types = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species/golem")])), rt.fv(f, "type", live(f.src)));
	golem_type = rt.op(f, "PickUnweighted", [1], [live(golem_types)]);
	yield* g.callName(f, (H = live(f.args[0])), "set_species", [live(golem_type)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("＀", [rt.initial(f, live(golem_type), "info_text")])]);
	return f.dot;
}, true, { args: ["C", "old_species"] });

rt.type(4082, "/datum/species/golem/adamantine", "/datum/species/golem", {
	name: "Adamantine Golem",
	id: "adamantine golem",
	fixed_mut_color: "4ed",
	info_text: "As an <span class='danger'>Adamantine Golem</span>, you possess special vocal cords allowing you to \"resonate\" messages to all golems.",
	prefix: "Adamantine",
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem/adamantine"),
	mutant_organs: null,
});

// /datum/species/golem/adamantine/proc/<init>  (code/modules/mob/living/carbon/human/species_types/golems.dm:60)
rt.def("/datum/species/golem/adamantine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutant_organs", rt.list(T("/obj/item/organ/adamantine_resonator"), T("/obj/item/organ/vocal_cords/adamantine")));
	return f.dot;
});

rt.type(4083, "/datum/species/golem/plasma", "/datum/species/golem", {
	boom_warning: 0,
	ignite: null,
	name: "Plasma Golem",
	id: "plasma golem",
	fixed_mut_color: "a3d",
	species_traits: null,
	info_text: "As a <span class='danger'>Plasma Golem</span>, you burn easily. Be careful, if you get hot enough while burning, you'll blow up!",
	heatmod: 0,
	prefix: "Plasma",
	special_names: null,
	meat: rt.typePath("/obj/item/weapon/ore/plasma"),
});

// /datum/species/golem/plasma/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/golems.dm:81)  may sleep
rt.def("/datum/species/golem/plasma/proc/spec_life", function* spec_life(f: Frame) {
	if (rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 750)) {
		if ((!truthy(rt.sv(f, "boom_warning")) && truthy(rt.fv(f, "on_fire", live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>You feel like you could blow up at any moment!<span>"]);
			rt.setSv(f, "boom_warning", 1);
		}
	} else {
		if (truthy(rt.sv(f, "boom_warning"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You feel more stable.<span>"]);
			rt.setSv(f, "boom_warning", 0);
		}
	}
	if (((rt.gt(rt.fv(f, "bodytemperature", live(f.args[0])), 850) && truthy(rt.fv(f, "on_fire", live(f.args[0])))) && truthy(rt.op(f, "Prob", [], [25])))) {
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.getStep(f, live(f.args[0]), 0), null, 1, null, 2, null, 4, "flame_range", 5], rt.Args.Named);
		if (truthy(live(f.args[0]))) {
			yield* g.callName(f, live(f.args[0]), "gib", []);
		}
	}
	if (rt.lt(rt.fv(f, "fire_stacks", live(f.args[0])), 2)) {
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

// /datum/species/golem/plasma/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:99)  may sleep
rt.def("/datum/species/golem/plasma/proc/on_species_gain", function* on_species_gain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "ignite", (yield* g.new_(f, T("/datum/action/innate/ignite"), [])));
	yield* g.callName(f, rt.sv(f, "ignite"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/plasma/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:106)  may sleep
rt.def("/datum/species/golem/plasma/proc/on_species_loss", function* on_species_loss(f: Frame) {
	if (truthy(rt.sv(f, "ignite"))) {
		yield* g.callName(f, rt.sv(f, "ignite"), "Remove", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

rt.type(150, "/datum/action/innate/ignite", "/datum/action/innate", {
	name: "Ignite",
	desc: "Set yourself aflame, bringing yourself closer to exploding!",
	check_flags: 8,
	button_icon_state: "sacredflame",
});

// /datum/action/innate/ignite/proc/Activate  (code/modules/mob/living/carbon/human/species_types/golems.dm:116)  may sleep
rt.def("/datum/action/innate/ignite/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (truthy(rt.gv(f, "fire_stacks", (H = rt.sv(f, "owner"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You ignite yourself!</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You try ignite yourself, but fail!</span>"]);
	}
	yield* g.callName(f, live(H), "IgniteMob", []);
	return f.dot;
}, true);

rt.type(4084, "/datum/species/golem/diamond", "/datum/species/golem", {
	name: "Diamond Golem",
	id: "diamond golem",
	fixed_mut_color: "0ff",
	armor: 70,
	info_text: "As a <span class='danger'>Diamond Golem</span>, you are more resistant than the average golem.",
	prefix: "Diamond",
	special_names: null,
	meat: rt.typePath("/obj/item/weapon/ore/diamond"),
});

// /datum/species/golem/diamond/proc/<init>  (code/modules/mob/living/carbon/human/species_types/golems.dm:133)
rt.def("/datum/species/golem/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "special_names", rt.list("Back"));
	return f.dot;
});

rt.type(4088, "/datum/species/golem/titanium", "/datum/species/golem", {
	name: "Titanium Golem",
	id: "titanium golem",
	fixed_mut_color: "fff",
	info_text: "As a <span class='danger'>Titanium Golem</span>, you are immune to ash storms, and slightly more resistant to burn damage.",
	burnmod: 0.9,
	prefix: "Titanium",
	meat: rt.typePath("/obj/item/weapon/ore/titanium"),
});

// /datum/species/golem/titanium/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:184)  may sleep
rt.def("/datum/species/golem/titanium/proc/on_species_gain", function* on_species_gain(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "weather_immunities", "ash", rt.bitOr));
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/titanium/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:188)  may sleep
rt.def("/datum/species/golem/titanium/proc/on_species_loss", function* on_species_loss(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "weather_immunities", "ash", subtract));
	return f.dot;
}, true, { args: ["C"] });

rt.type(4089, "/datum/species/golem/plastitanium", "/datum/species/golem", {
	name: "Plastitanium Golem",
	id: "plastitanium golem",
	fixed_mut_color: "888",
	info_text: "As a <span class='danger'>Plastitanium Golem</span>, you are immune to both ash storms and lava, and slightly more resistant to burn damage.",
	burnmod: 0.8,
	prefix: "Plastitanium",
	meat: rt.typePath("/obj/item/weapon/ore/titanium"),
});

// /datum/species/golem/plastitanium/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:202)  may sleep
rt.def("/datum/species/golem/plastitanium/proc/on_species_gain", function* on_species_gain(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "weather_immunities", "lava", rt.bitOr));
	(rt.modField(f, live(f.args[0]), "weather_immunities", "ash", rt.bitOr));
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/plastitanium/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:207)  may sleep
rt.def("/datum/species/golem/plastitanium/proc/on_species_loss", function* on_species_loss(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "weather_immunities", "ash", subtract));
	(rt.modField(f, live(f.args[0]), "weather_immunities", "lava", subtract));
	return f.dot;
}, true, { args: ["C"] });

rt.type(4090, "/datum/species/golem/alloy", "/datum/species/golem", {
	name: "Alien Alloy Golem",
	id: "alloy golem",
	fixed_mut_color: "333",
	speedmod: 1,
	info_text: "As an <span class='danger'>Alloy Golem</span>, you are made of advanced alien materials: you are faster and regenerate over time. You are, however, only able to be heard by other alloy golems.",
	prefix: "Alien",
	special_names: null,
	meat: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	mutanttongue: rt.typePath("/obj/item/organ/tongue/abductor"),
});

// /datum/species/golem/alloy/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/golems.dm:225)  may sleep
rt.def("/datum/species/golem/alloy/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	f.vars = () => [H];
	if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(H), "heal_overall_damage", [2, 2]);
	yield* g.callName(f, live(H), "adjustToxLoss", [-2]);
	yield* g.callName(f, live(H), "adjustOxyLoss", [-2]);
	return f.dot;
}, true);

rt.type(4091, "/datum/species/golem/wood", "/datum/species/golem", {
	name: "Wood Golem",
	id: "wood golem",
	fixed_mut_color: "49311c",
	species_traits: null,
	armor: 30,
	burnmod: 1.25,
	heatmod: 1.5,
	info_text: "As a <span class='danger'>Wooden Golem</span>, you have plant-like traits: you take damage from extreme temperatures, can be set on fire, and have lower armor than a normal golem. You regenerate when in the light and wither in the darkness.",
	prefix: "Wooden",
	special_names: null,
	human_surname_chance: 0,
	special_name_chance: 100,
	meat: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
});

// /datum/species/golem/wood/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:249)  may sleep
rt.def("/datum/species/golem/wood/proc/on_species_gain", function* on_species_gain(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "faction", "plants", rt.bitOr));
	(rt.modField(f, live(f.args[0]), "faction", "vines", rt.bitOr));
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/wood/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:254)  may sleep
rt.def("/datum/species/golem/wood/proc/on_species_loss", function* on_species_loss(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "faction", "plants", subtract));
	(rt.modField(f, live(f.args[0]), "faction", "vines", subtract));
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/golem/wood/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/golems.dm:259)  may sleep
rt.def("/datum/species/golem/wood/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let light_amount: Value = null, _T: Value = null;
	f.vars = () => [H, light_amount, _T];
	if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
		return live(f.dot);
	}
	light_amount = 0;
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(H))])))) {
		_T = rt.fv(f, "loc", live(H));
		light_amount = subtract((yield* g.call(f, P("/proc/min"), null, [1, (yield* g.callName(f, live(_T), "get_lumcount", []))])), 0.5);
		rt.modField(f, live(H), "nutrition", multiply(live(light_amount), 10), add);
		if (rt.gt(rt.fv(f, "nutrition", live(H)), 550)) {
			rt.setFv(f, "nutrition", live(H), 550);
		}
		if (rt.gt(live(light_amount), 0.20000000298023224)) {
			yield* g.callName(f, live(H), "heal_overall_damage", [1, 1]);
			yield* g.callName(f, live(H), "adjustToxLoss", [-1]);
			yield* g.callName(f, live(H), "adjustOxyLoss", [-1]);
		}
	}
	if (!rt.lt(rt.fv(f, "nutrition", live(H)), 200)) return f.dot;
	yield* g.callName(f, live(H), "take_overall_damage", [2, 0]);
	return f.dot;
}, true);

// /datum/species/golem/wood/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species_types/golems.dm:277)  may sleep
rt.def("/datum/species/golem/wood/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	f.vars = () => [chem, H];
	if (!isEqual(rt.fv(f, "id", live(chem)), "plantbgone")) return f.dot;
	yield* g.callName(f, live(H), "adjustToxLoss", [3]);
	yield* g.callName(f, rt.fv(f, "reagents", live(H)), "remove_reagent", [rt.fv(f, "id", live(chem)), 0.4000000059604645]);
	return 1;
}, true);

rt.type(4092, "/datum/species/golem/uranium", "/datum/species/golem", {
	last_event: 0,
	active: null,
	name: "Uranium Golem",
	id: "uranium golem",
	fixed_mut_color: "7f0",
	info_text: "As an <span class='danger'>Uranium Golem</span>, you emit radiation pulses every once in a while. It won't harm fellow golems, but organic lifeforms will be affected.",
	prefix: "Uranium",
	meat: rt.typePath("/obj/item/weapon/ore/uranium"),
});

// /datum/species/golem/uranium/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/golems.dm:295)  may sleep
rt.def("/datum/species/golem/uranium/proc/spec_life", function* spec_life(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) {
		if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_event"), 30))) {
			rt.setSv(f, "active", 1);
			yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.args[0]), 0), 3, 3, 5, 0]);
			rt.setSv(f, "last_event", rt.worldTime(f));
			rt.setSv(f, "active", null);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

rt.type(4093, "/datum/species/golem/sand", "/datum/species/golem", {
	name: "Sand Golem",
	id: "sand golem",
	fixed_mut_color: "ffdc8f",
	armor: 0,
	burnmod: 3,
	brutemod: 0.25,
	info_text: "As a <span class='danger'>Sand Golem</span>, you are immune to physical bullets and take very little brute damage, but are extremely vulnerable to burn damage. You will also turn to sand when dying, preventing any form of recovery.",
	attack_sound: rt.rsc("sound/effects/shovel_dig.ogg"),
	prefix: "Sand",
	meat: rt.typePath("/obj/item/weapon/ore/glass"),
});

// /datum/species/golem/sand/proc/spec_death  (code/modules/mob/living/carbon/human/species_types/golems.dm:317)  may sleep
rt.def("/datum/species/golem/sand/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	let W: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [gibbed, H, W, i, $e];
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ turns into a pile of sand!</span>", [live(H)])]);
	W = null;
	rt.forList(f, 0, live(H), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.callName(f, live(H), "dropItemToGround", [live(W)]);
	}
	rt.endFor(f, 0);
	i = null;
	i = 1;
	while (rt.le(live(i), (yield* g.call(f, P("/proc/rand"), null, [3, 5])))) {
		yield* g.new_(f, T("/obj/item/weapon/ore/glass"), [rt.getStep(f, live(H), 0)]);
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	return f.dot;
}, true);

// /datum/species/golem/sand/proc/bullet_act  (code/modules/mob/living/carbon/human/species_types/golems.dm:325)
rt.def("/datum/species/golem/sand/proc/bullet_act", function bullet_act(f: Frame, _P: Value, H: Value) {
	if (!(isEqual(rt.fv(f, "original", live(_P)), live(H)) && isEqual(rt.fv(f, "firer", live(_P)), live(H)))) {
		if ((isEqual(rt.fv(f, "flag", live(_P)), "bullet") || isEqual(rt.fv(f, "flag", live(_P)), "bomb"))) {
			rt.call(f, P("/proc/playsound"), null, [live(H), rt.rsc("sound/effects/shovel_dig.ogg"), 70, 1]);
			rt.callName(f, live(H), "visible_message", [fmt("<span class='danger'>The ＀ sinks harmlessly in ＀'s sandy body!</span>", [rt.fv(f, "name", live(_P)), live(H)]), fmt("<span class='userdanger'>The ＀ sinks harmlessly in ＀'s sandy body!</span>", [rt.fv(f, "name", live(_P)), live(H)])]);
			return 2;
		}
	}
	return 0;
});

rt.type(4094, "/datum/species/golem/glass", "/datum/species/golem", {
	name: "Glass Golem",
	id: "glass golem",
	fixed_mut_color: "5a96b4aa",
	armor: 0,
	brutemod: 3,
	burnmod: 0.25,
	info_text: "As a <span class='danger'>Glass Golem</span>, you reflect lasers and energy weapons, and are very resistant to burn damage, but you are extremely vulnerable to brute damage. On death, you'll shatter beyond any hope of recovery.",
	attack_sound: rt.rsc("sound/effects/glassbr2.ogg"),
	prefix: "Glass",
	meat: rt.typePath("/obj/item/weapon/shard"),
});

// /datum/species/golem/glass/proc/spec_death  (code/modules/mob/living/carbon/human/species_types/golems.dm:347)  may sleep
rt.def("/datum/species/golem/glass/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	let W: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [gibbed, H, W, i, $e];
	yield* g.call(f, P("/proc/playsound"), null, [live(H), "shatter", 70, 1]);
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ shatters!</span>", [live(H)])]);
	W = null;
	rt.forList(f, 0, live(H), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.callName(f, live(H), "dropItemToGround", [live(W)]);
	}
	rt.endFor(f, 0);
	i = null;
	i = 1;
	while (rt.le(live(i), (yield* g.call(f, P("/proc/rand"), null, [3, 5])))) {
		yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.getStep(f, live(H), 0)]);
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	return f.dot;
}, true);

// /datum/species/golem/glass/proc/bullet_act  (code/modules/mob/living/carbon/human/species_types/golems.dm:356)
rt.def("/datum/species/golem/glass/proc/bullet_act", function bullet_act(f: Frame, _P: Value, H: Value) {
	let new_x: Value = null, new_y: Value = null, curloc: Value = null;
	f.vars = () => [new_x, new_y, curloc];
	if (!(isEqual(rt.fv(f, "original", live(_P)), live(H)) && isEqual(rt.fv(f, "firer", live(_P)), live(H)))) {
		if ((isEqual(rt.fv(f, "flag", live(_P)), "laser") || isEqual(rt.fv(f, "flag", live(_P)), "energy"))) {
			rt.callName(f, live(H), "visible_message", [fmt("<span class='danger'>The ＀ gets reflected by ＀'s glass skin!</span>", [rt.fv(f, "name", live(_P)), live(H)]), fmt("<span class='userdanger'>The ＀ gets reflected by ＀'s glass skin!</span>", [rt.fv(f, "name", live(_P)), live(H)])]);
			if (truthy(rt.fv(f, "starting", live(_P)))) {
				new_x = add(rt.gv(f, "x", rt.fv(f, "starting", live(_P))), rt.op(f, "PickUnweighted", [9], [0, 0, 0, 0, 0, -1, 1, -2, 2]));
				new_y = add(rt.gv(f, "y", rt.fv(f, "starting", live(_P))), rt.op(f, "PickUnweighted", [9], [0, 0, 0, 0, 0, -1, 1, -2, 2]));
				curloc = rt.getStep(f, live(H), 0);
				rt.setFv(f, "original", live(_P), rt.locate(live(new_x), live(new_y), rt.fv(f, "z", live(_P))));
				rt.setFv(f, "starting", live(_P), live(curloc));
				rt.setFv(f, "current", live(_P), live(curloc));
				rt.setFv(f, "firer", live(_P), live(H));
				rt.setFv(f, "yo", live(_P), subtract(live(new_y), rt.fv(f, "y", live(curloc))));
				rt.setFv(f, "xo", live(_P), subtract(live(new_x), rt.fv(f, "x", live(curloc))));
				rt.setFv(f, "Angle", live(_P), null);
			}
			return -1;
		}
	}
	return 0;
});

rt.type(4095, "/datum/species/golem/bluespace", "/datum/species/golem", {
	unstable_teleport: null,
	teleport_cooldown: 100,
	last_teleport: 0,
	name: "Bluespace Golem",
	id: "bluespace golem",
	fixed_mut_color: "33f",
	info_text: "As a <span class='danger'>Bluespace Golem</span>, are spatially unstable: you will teleport when hit, and you can teleport manually at a long distance.",
	attack_verb: "bluespace punch",
	attack_sound: rt.rsc("sound/effects/phasein.ogg"),
	prefix: "Bluespace",
	special_names: null,
	meat: rt.typePath("/obj/item/weapon/ore/bluespace_crystal"),
});

// /datum/species/golem/bluespace/proc/reactive_teleport  (code/modules/mob/living/carbon/human/species_types/golems.dm:393)  may sleep
rt.def("/datum/species/golem/bluespace/proc/reactive_teleport", function* reactive_teleport(f: Frame, H: Value) {
	f.vars = () => [H];
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ teleports!</span>", [live(H)]), "<span class='danger'>You destabilize and teleport!</span>"]);
	yield* g.new_(f, T("/obj/effect/particle_effect/sparks"), [rt.getStep(f, live(H), 0)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), "sparks", 50, 1]);
	yield* g.call(f, P("/proc/do_teleport"), null, [null, live(H), null, rt.getStep(f, live(H), 0), null, 6, "asoundin", rt.rsc("sound/weapons/emitter2.ogg")], rt.Args.Named);
	rt.setSv(f, "last_teleport", rt.worldTime(f));
	return f.dot;
}, true);

// /datum/species/golem/bluespace/proc/spec_hitby  (code/modules/mob/living/carbon/human/species_types/golems.dm:400)  may sleep
rt.def("/datum/species/golem/bluespace/proc/spec_hitby", function* spec_hitby(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	yield* g.callSuper(f, [], rt.Args.Same);
	I = null;
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) return f.dot;
	if (isEqual(rt.gv(f, "thrownby", (I = live(f.args[0]))), live(f.args[1]))) {
		return 0;
	} else {
		yield* g.srcCall(f, "reactive_teleport", live(f.args[1]));
	}
	return f.dot;
}, true, { args: ["AM", "H"] });

// /datum/species/golem/bluespace/proc/spec_attack_hand  (code/modules/mob/living/carbon/human/species_types/golems.dm:410)  may sleep
rt.def("/datum/species/golem/bluespace/proc/spec_attack_hand", function* spec_attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((rt.gt(rt.worldTime(f), add(rt.sv(f, "last_teleport"), rt.sv(f, "teleport_cooldown"))) && !isEqual(live(f.args[0]), live(f.args[1]))) && !isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help"))) return f.dot;
	yield* g.srcCall(f, "reactive_teleport", live(f.args[1]));
	return f.dot;
}, true, { args: ["M", "H", "attacker_style"] });

// /datum/species/golem/bluespace/proc/spec_attacked_by  (code/modules/mob/living/carbon/human/species_types/golems.dm:415)  may sleep
rt.def("/datum/species/golem/bluespace/proc/spec_attacked_by", function* spec_attacked_by(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(rt.gt(rt.worldTime(f), add(rt.sv(f, "last_teleport"), rt.sv(f, "teleport_cooldown"))) && !isEqual(live(f.args[1]), live(f.args[4])))) return f.dot;
	yield* g.srcCall(f, "reactive_teleport", live(f.args[4]));
	return f.dot;
}, true, { args: ["I", "user", "affecting", "intent", "H"] });

// /datum/species/golem/bluespace/proc/on_hit  (code/modules/mob/living/carbon/human/species_types/golems.dm:420)  may sleep
rt.def("/datum/species/golem/bluespace/proc/on_hit", function* on_hit(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.gt(rt.worldTime(f), add(rt.sv(f, "last_teleport"), rt.sv(f, "teleport_cooldown")))) return f.dot;
	yield* g.srcCall(f, "reactive_teleport", live(f.args[1]));
	return f.dot;
}, true, { args: ["P", "H"] });

// /datum/species/golem/bluespace/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:425)  may sleep
rt.def("/datum/species/golem/bluespace/proc/on_species_gain", function* on_species_gain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "unstable_teleport", (yield* g.new_(f, T("/datum/action/innate/unstable_teleport"), [])));
	yield* g.callName(f, rt.sv(f, "unstable_teleport"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/bluespace/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:432)  may sleep
rt.def("/datum/species/golem/bluespace/proc/on_species_loss", function* on_species_loss(f: Frame) {
	if (truthy(rt.sv(f, "unstable_teleport"))) {
		yield* g.callName(f, rt.sv(f, "unstable_teleport"), "Remove", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

rt.type(151, "/datum/action/innate/unstable_teleport", "/datum/action/innate", {
	cooldown: 150,
	last_teleport: 0,
	name: "Unstable Teleport",
	check_flags: 8,
	button_icon_state: "jaunt",
});

// /datum/action/innate/unstable_teleport/proc/IsAvailable  (code/modules/mob/living/carbon/human/species_types/golems.dm:443)
rt.def("/datum/action/innate/unstable_teleport/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_teleport"), rt.sv(f, "cooldown")))) {
		return 1;
	}
	return 0;
});

// /datum/action/innate/unstable_teleport/proc/Activate  (code/modules/mob/living/carbon/human/species_types/golems.dm:449)  may sleep
rt.def("/datum/action/innate/unstable_teleport/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callName(f, (H = rt.sv(f, "owner")), "visible_message", [fmt("<span class='warning'>＀ starts vibrating!</span>", [live(H)]), "<span class='danger'>You start charging your bluespace core...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), rt.rsc("sound/weapons/flash.ogg"), 25, 1]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/action/innate/unstable_teleport/proc/teleport"), live(H)])), 15]);
	return f.dot;
}, true);

// /datum/action/innate/unstable_teleport/proc/teleport  (code/modules/mob/living/carbon/human/species_types/golems.dm:455)  may sleep
rt.def("/datum/action/innate/unstable_teleport/proc/teleport", function* teleport(f: Frame, H: Value) {
	let spark_system: Value = null;
	f.vars = () => [H, spark_system];
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ disappears in a shower of sparks!</span>", [live(H)]), "<span class='danger'>You teleport!</span>"]);
	yield* g.callName(f, (spark_system = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [10, 0, live(f.src)]);
	yield* g.callName(f, live(spark_system), "attach", [live(H)]);
	yield* g.callName(f, live(spark_system), "start", []);
	yield* g.call(f, P("/proc/do_teleport"), null, [null, live(H), null, rt.getStep(f, live(H), 0), null, 12, "asoundin", rt.rsc("sound/weapons/emitter2.ogg")], rt.Args.Named);
	rt.setSv(f, "last_teleport", rt.worldTime(f));
	yield* g.srcCall(f, "UpdateButtonIcon");
	yield* g.call(f, P("/proc/sleep"), null, [add(rt.sv(f, "cooldown"), 5)]);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

rt.type(4096, "/datum/species/golem/bananium", "/datum/species/golem", {
	last_honk: 0,
	honkooldown: 0,
	last_banana: 0,
	banana_cooldown: 100,
	active: null,
	name: "Bananium Golem",
	id: "bananium golem",
	fixed_mut_color: "ff0",
	say_mod: "honks",
	punchdamagelow: 0,
	punchdamagehigh: 1,
	punchstunthreshold: 2,
	info_text: "As a <span class='danger'>Bananium Golem</span>, you are made for pranking. Your body emits natural honks, and you cannot hurt people when punching them. Your skin also emits bananas when damaged.",
	attack_verb: "honk",
	attack_sound: rt.rsc("sound/items/airhorn2.ogg"),
	prefix: "Bananium",
	meat: rt.typePath("/obj/item/weapon/ore/bananium"),
});

// /datum/species/golem/bananium/proc/random_name  (code/modules/mob/living/carbon/human/species_types/golems.dm:489)
rt.def("/datum/species/golem/bananium/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let clown_name: Value = null, golem_name: Value = null;
	f.vars = () => [clown_name, golem_name];
	clown_name = rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")]);
	return (golem_name = fmt("＀", [rt.call(f, P("/proc/uppertext"), null, [live(clown_name)])]));
});

// /datum/species/golem/bananium/proc/spec_attack_hand  (code/modules/mob/living/carbon/human/species_types/golems.dm:494)  may sleep
rt.def("/datum/species/golem/bananium/proc/spec_attack_hand", function* spec_attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((rt.gt(rt.worldTime(f), add(rt.sv(f, "last_banana"), rt.sv(f, "banana_cooldown"))) && !isEqual(live(f.args[0]), live(f.args[1]))) && !isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help"))) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/grown/bananapeel/specialpeel"), [rt.getStep(f, live(f.args[1]), 0)]);
	rt.setSv(f, "last_banana", rt.worldTime(f));
	return f.dot;
}, true, { args: ["M", "H", "attacker_style"] });

// /datum/species/golem/bananium/proc/spec_attacked_by  (code/modules/mob/living/carbon/human/species_types/golems.dm:500)  may sleep
rt.def("/datum/species/golem/bananium/proc/spec_attacked_by", function* spec_attacked_by(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(rt.gt(rt.worldTime(f), add(rt.sv(f, "last_banana"), rt.sv(f, "banana_cooldown"))) && !isEqual(live(f.args[1]), live(f.args[4])))) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/grown/bananapeel/specialpeel"), [rt.getStep(f, live(f.args[4]), 0)]);
	rt.setSv(f, "last_banana", rt.worldTime(f));
	return f.dot;
}, true, { args: ["I", "user", "affecting", "intent", "H"] });

// /datum/species/golem/bananium/proc/on_hit  (code/modules/mob/living/carbon/human/species_types/golems.dm:506)  may sleep
rt.def("/datum/species/golem/bananium/proc/on_hit", function* on_hit(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.gt(rt.worldTime(f), add(rt.sv(f, "last_banana"), rt.sv(f, "banana_cooldown")))) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/grown/bananapeel/specialpeel"), [rt.getStep(f, live(f.args[1]), 0)]);
	rt.setSv(f, "last_banana", rt.worldTime(f));
	return f.dot;
}, true, { args: ["P", "H"] });

// /datum/species/golem/bananium/proc/spec_hitby  (code/modules/mob/living/carbon/human/species_types/golems.dm:512)  may sleep
rt.def("/datum/species/golem/bananium/proc/spec_hitby", function* spec_hitby(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	yield* g.callSuper(f, [], rt.Args.Same);
	I = null;
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) return f.dot;
	if (isEqual(rt.gv(f, "thrownby", (I = live(f.args[0]))), live(f.args[1]))) {
		return 0;
	} else {
		yield* g.new_(f, T("/obj/item/weapon/grown/bananapeel/specialpeel"), [rt.getStep(f, live(f.args[1]), 0)]);
		rt.setSv(f, "last_banana", rt.worldTime(f));
	}
	return f.dot;
}, true, { args: ["AM", "H"] });

// /datum/species/golem/bananium/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/golems.dm:523)  may sleep
rt.def("/datum/species/golem/bananium/proc/spec_life", function* spec_life(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) {
		if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_honk"), rt.sv(f, "honkooldown")))) {
			rt.setSv(f, "active", 1);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
			rt.setSv(f, "last_honk", rt.worldTime(f));
			rt.setSv(f, "honkooldown", (yield* g.call(f, P("/proc/rand"), null, [20, 80])));
			rt.setSv(f, "active", null);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

// /datum/species/golem/bananium/proc/spec_death  (code/modules/mob/living/carbon/human/species_types/golems.dm:533)
rt.def("/datum/species/golem/bananium/proc/spec_death", function spec_death(f: Frame, gibbed: Value, H: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), rt.rsc("sound/misc/sadtrombone.ogg"), 70, 0]);
	return f.dot;
});

// /datum/species/golem/bananium/proc/get_spans  (code/modules/mob/living/carbon/human/species_types/golems.dm:536)
rt.def("/datum/species/golem/bananium/proc/get_spans", function get_spans(f: Frame) {
	return rt.list("clown");
});

rt.type(4097, "/datum/species/golem/runic", "/datum/species/golem", {
	phase_shift: null,
	abyssal_gaze: null,
	dominate: null,
	name: "Runic Golem",
	id: "runic golem",
	limbs_id: "cultgolem",
	sexes: 0,
	info_text: "As a <span class='danger'>Runic Golem</span>, you possess eldritch powers granted by the Elder God Nar'Sie.",
	species_traits: null,
	prefix: "Runic",
});

// /datum/species/golem/runic/proc/random_name  (code/modules/mob/living/carbon/human/species_types/golems.dm:553)
rt.def("/datum/species/golem/runic/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let edgy_first_name: Value = null, edgy_last_name: Value = null, golem_name: Value = null;
	f.vars = () => [edgy_first_name, edgy_last_name, golem_name];
	edgy_first_name = rt.op(f, "PickUnweighted", [10], ["Razor", "Blood", "Dark", "Evil", "Cold", "Pale", "Black", "Silent", "Chaos", "Deadly"]);
	edgy_last_name = rt.op(f, "PickUnweighted", [10], ["Edge", "Night", "Death", "Razor", "Blade", "Steel", "Calamity", "Twilight", "Shadow", "Nightmare"]);
	return (golem_name = fmt("＀ ＀", [live(edgy_first_name), live(edgy_last_name)]));
});

// /datum/species/golem/runic/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:559)  may sleep
rt.def("/datum/species/golem/runic/proc/on_species_gain", function* on_species_gain(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "faction", "cult", rt.bitOr));
	rt.setSv(f, "phase_shift", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift/golem"), [])));
	yield* g.callName(f, live(f.args[0]), "AddSpell", [rt.sv(f, "phase_shift")]);
	rt.setSv(f, "abyssal_gaze", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/abyssal_gaze"), [])));
	yield* g.callName(f, live(f.args[0]), "AddSpell", [rt.sv(f, "abyssal_gaze")]);
	rt.setSv(f, "dominate", (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/dominate"), [])));
	yield* g.callName(f, live(f.args[0]), "AddSpell", [rt.sv(f, "dominate")]);
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/runic/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:569)  may sleep
rt.def("/datum/species/golem/runic/proc/on_species_loss", function* on_species_loss(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "faction", "cult", subtract));
	if (truthy(rt.sv(f, "phase_shift"))) {
		yield* g.callName(f, live(f.args[0]), "RemoveSpell", [rt.sv(f, "phase_shift")]);
	}
	if (truthy(rt.sv(f, "abyssal_gaze"))) {
		yield* g.callName(f, live(f.args[0]), "RemoveSpell", [rt.sv(f, "abyssal_gaze")]);
	}
	if (!truthy(rt.sv(f, "dominate"))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "RemoveSpell", [rt.sv(f, "dominate")]);
	return f.dot;
}, true, { args: ["C"] });

// /datum/species/golem/runic/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species_types/golems.dm:579)  may sleep
rt.def("/datum/species/golem/runic/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	f.vars = () => [chem, H];
	if (isEqual(rt.fv(f, "id", live(chem)), "holywater")) {
		yield* g.callName(f, live(H), "adjustFireLoss", [4]);
		yield* g.callName(f, rt.fv(f, "reagents", live(H)), "remove_reagent", [rt.fv(f, "id", live(chem)), 0.4000000059604645]);
	}
	if (!isEqual(rt.fv(f, "id", live(chem)), "unholywater")) return f.dot;
	yield* g.callName(f, live(H), "adjustBruteLoss", [-4]);
	yield* g.callName(f, live(H), "adjustFireLoss", [-4]);
	yield* g.callName(f, rt.fv(f, "reagents", live(H)), "remove_reagent", [rt.fv(f, "id", live(chem)), 0.4000000059604645]);
	return f.dot;
}, true);

rt.type(4098, "/datum/species/golem/cloth", "/datum/species/golem", {
	name: "Cloth Golem",
	id: "cloth golem",
	limbs_id: "clothgolem",
	sexes: 0,
	info_text: "As a <span class='danger'>Cloth Golem</span>, you are able to reform yourself after death, provided your remains aren't burned or destroyed. You are, of course, very flammable.",
	species_traits: null,
	armor: 15,
	burnmod: 2,
	speedmod: 1,
	punchdamagelow: 4,
	punchstunthreshold: 7,
	punchdamagehigh: 8,
	prefix: "Cloth",
});

// /datum/species/golem/cloth/proc/random_name  (code/modules/mob/living/carbon/human/species_types/golems.dm:604)
rt.def("/datum/species/golem/cloth/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let pharaoh_name: Value = null, golem_name: Value = null;
	f.vars = () => [pharaoh_name, golem_name];
	pharaoh_name = rt.op(f, "PickUnweighted", [19], ["Neferkare", "Hudjefa", "Khufu", "Mentuhotep", "Ahmose", "Amenhotep", "Thutmose", "Hatshepsut", "Tutankhamun", "Ramses", "Seti", "Merenptah", "Djer", "Semerkhet", "Nynetjer", "Khafre", "Pepi", "Intef", "Ay"]);
	return (golem_name = fmt("＀ ３！", [live(pharaoh_name), rt.call(f, P("/proc/rand"), null, [1, 99])]));
});

// /datum/species/golem/cloth/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/golems.dm:610)  may sleep
rt.def("/datum/species/golem/cloth/proc/spec_life", function* spec_life(f: Frame) {
	if (rt.lt(rt.fv(f, "fire_stacks", live(f.args[0])), 1)) {
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H"] });

// /datum/species/golem/cloth/proc/spec_death  (code/modules/mob/living/carbon/human/species_types/golems.dm:617)  may sleep
rt.def("/datum/species/golem/cloth/proc/spec_death", function* spec_death(f: Frame) {
	if (truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "on_fire", live(f.args[1])))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ burns into ash!</span>", [live(f.args[1])])]);
		yield* g.callName(f, live(f.args[1]), "dust", ["just_ash", 1], rt.Args.Named);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ falls apart into a pile of bandages!</span>", [live(f.args[1])])]);
	yield* g.new_(f, T("/obj/structure/cloth_pile"), [rt.getStep(f, live(f.args[1]), 0), live(f.args[1])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed", "H"] });

rt.type(12965, "/obj/structure/cloth_pile", "/obj/structure", {
	revive_time: 900,
	cloth_golem: null,
	name: "pile of bandages",
	desc: "It emits a strange aura, as if there was still life within it...",
	obj_integrity: 50,
	max_integrity: 50,
	armor: null,
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "pile_bandages",
	resistance_flags: 4,
});

// /obj/structure/cloth_pile/proc/<init>  (code/modules/mob/living/carbon/human/species_types/golems.dm:631)
rt.def("/obj/structure/cloth_pile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 90, "bullet", 90, "laser", 25, "energy", 80, "bomb", 50, "bio", 100, "fire", -50, "acid", -50]));
	return f.dot;
});

// /obj/structure/cloth_pile/proc/Initialize  (code/modules/mob/living/carbon/human/species_types/golems.dm:640)  may sleep
rt.def("/obj/structure/cloth_pile/proc/Initialize", function* Initialize(f: Frame, mapload: Value, H: Value) {
	f.vars = () => [mapload, H];
	if ((!(!truthy(live(H)) || truthy(rt.fv(f, "gc_destroyed", live(H)))) && truthy((yield* g.call(f, P("/proc/is_species"), null, [live(H), T("/datum/species/golem/cloth")]))))) {
		yield* g.callName(f, live(H), "unequip_everything", []);
		yield* g.callName(f, live(H), "forceMove", [live(f.src)]);
		rt.setSv(f, "cloth_golem", live(H));
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "cloth_golem"), "<span class='notice'>You start gathering your life energy, preparing to rise again...</span>"]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/cloth_pile/proc/revive")])), rt.sv(f, "revive_time")]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/structure/cloth_pile/proc/Destroy  (code/modules/mob/living/carbon/human/species_types/golems.dm:651)  may sleep
rt.def("/obj/structure/cloth_pile/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "cloth_golem"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cloth_golem")]);
		rt.setSv(f, "cloth_golem", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/cloth_pile/proc/burn  (code/modules/mob/living/carbon/human/species_types/golems.dm:655)  may sleep
rt.def("/obj/structure/cloth_pile/proc/burn", function* burn(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ burns into ash!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/cloth_pile/proc/revive  (code/modules/mob/living/carbon/human/species_types/golems.dm:660)  may sleep
rt.def("/obj/structure/cloth_pile/proc/revive", function* revive(f: Frame) {
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || (!truthy(rt.sv(f, "cloth_golem")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "cloth_golem")))))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "suiciding", rt.sv(f, "cloth_golem"))) || truthy(rt.bitAnd(rt.fv(f, "disabilities", rt.sv(f, "cloth_golem")), 128)))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cloth_golem")]);
		rt.setSv(f, "cloth_golem", null);
		return live(f.dot);
	}
	rt.setSv(f, "invisibility", 100);
	yield* g.new_(f, T("/obj/effect/temp_visual/mummy_animation"), [rt.getStep(f, live(f.src), 0)]);
	if (truthy((yield* g.callName(f, rt.sv(f, "cloth_golem"), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named)))) {
		yield* g.callName(f, rt.sv(f, "cloth_golem"), "grab_ghost", []);
	}
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	yield* g.callName(f, rt.sv(f, "cloth_golem"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.callName(f, rt.sv(f, "cloth_golem"), "visible_message", [fmt("<span class='danger'>＀ rises and reforms into ＀!</span>", [live(f.src), rt.sv(f, "cloth_golem")]), "<span class='userdanger'>You reform into yourself!</span>"]);
	rt.setSv(f, "cloth_golem", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/cloth_pile/proc/attackby  (code/modules/mob/living/carbon/human/species_types/golems.dm:677)  may sleep
rt.def("/obj/structure/cloth_pile/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bursts into flames!</span>", [live(f.src)]));
	yield* g.srcCall(f, "fire_act");
	return f.dot;
}, true, { args: ["P", "user", "params"] });

rt.type(4099, "/datum/species/golem/plastic", "/datum/species/golem", {
	name: "Plastic",
	id: "plastic golem",
	prefix: "Plastic",
	fixed_mut_color: "fff",
	info_text: "As a <span class='danger'>Plastic Golem</span>, you are capable of ventcrawling, and passing through plastic flaps.",
});

// /datum/species/golem/plastic/proc/on_species_gain  (code/modules/mob/living/carbon/human/species_types/golems.dm:694)  may sleep
rt.def("/datum/species/golem/plastic/proc/on_species_gain", function* on_species_gain(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "ventcrawler", live(f.args[0]), 1);
	return f.dot;
}, true, { args: ["C", "old_species"] });

// /datum/species/golem/plastic/proc/on_species_loss  (code/modules/mob/living/carbon/human/species_types/golems.dm:698)  may sleep
rt.def("/datum/species/golem/plastic/proc/on_species_loss", function* on_species_loss(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "ventcrawler", live(f.args[0]), rt.initial(f, live(f.args[0]), "ventcrawler"));
	return f.dot;
}, true, { args: ["C"] });
