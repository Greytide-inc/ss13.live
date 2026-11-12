// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/golems.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// golems.dm:6
rt.def("/datum/species/golem/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(10, 6, 7, 8, 13, 11, 12, 9, 14, 15, 18, 1, 26);
	this.no_equip = list(2, 13, 9, 12, 14, 17);

	this.mutant_organs = list(T("/obj/item/organ/adamantine_resonator"));
	return f.dot;
});

// golems.dm:32
rt.def("/datum/species/golem/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let golem_name: Value = null;
	let golem_surname: Value = pick(GLOB.golem_names);
	if (prob(this.human_surname_chance)) {
		golem_surname = pick(GLOB.last_names);
	} else if (this.special_names && rt.len(f, this.special_names) && prob(this.special_name_chance)) {
		golem_surname = pick(this.special_names);
	}
	return (golem_name = `${this.prefix} ${golem_surname}`);
});

rt.type(4081, "/datum/species/golem/random", "/datum/species/golem", {
	name: "Random Golem",
	blacklisted: 0,
	dangerous_existence: 0,
});

// golems.dm:49
rt.def("/datum/species/golem/random/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	let H: Value = null;
	yield* parent_proc();
	let golem_types: Value = typesof(T("/datum/species/golem")) - this.type;
	let golem_type: Value = pick(golem_types);
	yield* (H = C).set_species(golem_type);
	to_chat(H, `${rt.initial(f, golem_type, "info_text")}`);
	return f.dot;
}, true);

rt.type(4082, "/datum/species/golem/adamantine", "/datum/species/golem", {
	name: "Adamantine Golem",
	id: "adamantine golem",
	fixed_mut_color: "4ed",
	info_text: "As an <span class='danger'>Adamantine Golem</span>, you possess special vocal cords allowing you to \"resonate\" messages to all golems.",
	prefix: "Adamantine",
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/golem/adamantine"),
	mutant_organs: null,
});

// golems.dm:60
rt.def("/datum/species/golem/adamantine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutant_organs = list(T("/obj/item/organ/adamantine_resonator"), T("/obj/item/organ/vocal_cords/adamantine"));
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

// golems.dm:81
rt.def("/datum/species/golem/plasma/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (H.bodytemperature > 750) {
		if (!this.boom_warning && H.on_fire) {
			to_chat(H, "<span class='userdanger'>You feel like you could blow up at any moment!<span>");
			this.boom_warning = 1;
		}
	} else if (this.boom_warning) {
		to_chat(H, "<span class='notice'>You feel more stable.<span>");
		this.boom_warning = 0;
	}
	if (H.bodytemperature > 850 && H.on_fire && prob(25)) {
		yield* explosion(rt.getStep(f, H, 0), 1, 2, 4, { flame_range: 5 });
		if (H) {
			yield* H.gib();
		}
	}
	if (H.fire_stacks < 2) {
		yield* H.adjust_fire_stacks(1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// golems.dm:99
rt.def("/datum/species/golem/plasma/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	yield* parent_proc();
	if (!rt.istype(C, T("/mob/living/carbon/human"))) return f.dot;
	this.ignite = (yield* new_(T("/datum/action/innate/ignite")));
	yield* this.ignite.Grant(C);
	return f.dot;
}, true);

// golems.dm:106
rt.def("/datum/species/golem/plasma/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	if (this.ignite) {
		yield* this.ignite.Remove(C);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(150, "/datum/action/innate/ignite", "/datum/action/innate", {
	name: "Ignite",
	desc: "Set yourself aflame, bringing yourself closer to exploding!",
	check_flags: 8,
	button_icon_state: "sacredflame",
});

// golems.dm:116
rt.def("/datum/action/innate/ignite/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null;
	if (!rt.istype(this.owner, T("/mob/living/carbon/human"))) return f.dot;
	if ((H = this.owner).fire_stacks) {
		to_chat(this.owner, "<span class='notice'>You ignite yourself!</span>");
	} else {
		to_chat(this.owner, "<span class='warning'>You try ignite yourself, but fail!</span>");
	}
	yield* H.IgniteMob();
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

// golems.dm:133
rt.def("/datum/species/golem/diamond/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.special_names = list("Back");
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

// golems.dm:184
rt.def("/datum/species/golem/titanium/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, C, "weather_immunities", "ash", rt.bitOr));
	return f.dot;
}, true);

// golems.dm:188
rt.def("/datum/species/golem/titanium/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.weather_immunities -= "ash";
	return f.dot;
}, true);

rt.type(4089, "/datum/species/golem/plastitanium", "/datum/species/golem", {
	name: "Plastitanium Golem",
	id: "plastitanium golem",
	fixed_mut_color: "888",
	info_text: "As a <span class='danger'>Plastitanium Golem</span>, you are immune to both ash storms and lava, and slightly more resistant to burn damage.",
	burnmod: 0.8,
	prefix: "Plastitanium",
	meat: rt.typePath("/obj/item/weapon/ore/titanium"),
});

// golems.dm:202
rt.def("/datum/species/golem/plastitanium/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, C, "weather_immunities", "lava", rt.bitOr));
	(rt.modField(f, C, "weather_immunities", "ash", rt.bitOr));
	return f.dot;
}, true);

// golems.dm:207
rt.def("/datum/species/golem/plastitanium/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.weather_immunities -= "ash";
	C.weather_immunities -= "lava";
	return f.dot;
}, true);

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

// golems.dm:225
rt.def("/datum/species/golem/alloy/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (H.stat == 2) {
		return f.dot;
	}
	yield* H.heal_overall_damage(2, 2);
	yield* H.adjustToxLoss(-2);
	yield* H.adjustOxyLoss(-2);
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

// golems.dm:249
rt.def("/datum/species/golem/wood/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, C, "faction", "plants", rt.bitOr));
	(rt.modField(f, C, "faction", "vines", rt.bitOr));
	return f.dot;
}, true);

// golems.dm:254
rt.def("/datum/species/golem/wood/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.faction -= "plants";
	C.faction -= "vines";
	return f.dot;
}, true);

// golems.dm:259
rt.def("/datum/species/golem/wood/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let _T: Value = null;
	if (H.stat == 2) {
		return f.dot;
	}
	let light_amount: Value = 0;
	if (isturf(H.loc)) {
		_T = H.loc;
		light_amount = min(1, _T.get_lumcount()) - 0.5;
		H.nutrition += light_amount * 10;
		if (H.nutrition > NUTRITION_LEVEL_FULL) {
			H.nutrition = NUTRITION_LEVEL_FULL;
		}
		if (light_amount > 0.2) {
			yield* H.heal_overall_damage(1, 1);
			yield* H.adjustToxLoss(-1);
			yield* H.adjustOxyLoss(-1);
		}
	}
	if (!(H.nutrition < 200)) return f.dot;
	yield* H.take_overall_damage(2, 0);
	return f.dot;
}, true);

// golems.dm:277
rt.def("/datum/species/golem/wood/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	if (chem.id != "plantbgone") return f.dot;
	yield* H.adjustToxLoss(3);
	yield* H.reagents.remove_reagent(chem.id, REAGENTS_METABOLISM);
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

// golems.dm:295
rt.def("/datum/species/golem/uranium/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (!this.active) {
		if (rt.worldTime(f) > this.last_event + 30) {
			this.active = 1;
			yield* radiation_pulse(rt.getStep(f, H, 0), 3, 3, 5, 0);
			this.last_event = rt.worldTime(f);
			this.active = null;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

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

// golems.dm:317
rt.def("/datum/species/golem/sand/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	let W: Value = null;
	H.visible_message(`<span class='danger'>${H} turns into a pile of sand!</span>`);
	for (W of each(H, T("/obj/item"))) {
		yield* H.dropItemToGround(W);
	}
	let i: Value = 1;
	while (i <= rand(3, 5)) {
		yield* new_(T("/obj/item/weapon/ore/glass"), rt.getStep(f, H, 0));
		i++;
	}
	yield* qdel(H);
	return f.dot;
}, true);

// golems.dm:325
rt.def("/datum/species/golem/sand/proc/bullet_act", function bullet_act(f: Frame, _P: Value, H: Value) {
	if (!(_P.original == H && _P.firer == H)) {
		if (_P.flag == "bullet" || _P.flag == "bomb") {
			playsound(H, rt.rsc("sound/effects/shovel_dig.ogg"), 70, 1);
			H.visible_message(`<span class='danger'>The ${_P.name} sinks harmlessly in ${H}'s sandy body!</span>`, `<span class='userdanger'>The ${_P.name} sinks harmlessly in ${H}'s sandy body!</span>`);
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

// golems.dm:347
rt.def("/datum/species/golem/glass/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	let W: Value = null;
	playsound(H, "shatter", 70, 1);
	H.visible_message(`<span class='danger'>${H} shatters!</span>`);
	for (W of each(H, T("/obj/item"))) {
		yield* H.dropItemToGround(W);
	}
	let i: Value = 1;
	while (i <= rand(3, 5)) {
		yield* new_(T("/obj/item/weapon/shard"), rt.getStep(f, H, 0));
		i++;
	}
	yield* qdel(H);
	return f.dot;
}, true);

// golems.dm:356
rt.def("/datum/species/golem/glass/proc/bullet_act", function bullet_act(f: Frame, _P: Value, H: Value) {
	let new_x: Value = null, new_y: Value = null, curloc: Value = null;
	if (!(_P.original == H && _P.firer == H)) {
		if (_P.flag == "laser" || _P.flag == "energy") {
			H.visible_message(`<span class='danger'>The ${_P.name} gets reflected by ${H}'s glass skin!</span>`, `<span class='userdanger'>The ${_P.name} gets reflected by ${H}'s glass skin!</span>`);
			if (_P.starting) {
				new_x = _P.starting.x + pick(0, 0, 0, 0, 0, -1, 1, -2, 2);
				new_y = _P.starting.y + pick(0, 0, 0, 0, 0, -1, 1, -2, 2);
				curloc = rt.getStep(f, H, 0);
				_P.original = rt.locate(new_x, new_y, _P.z);
				_P.starting = curloc;
				_P.current = curloc;
				_P.firer = H;
				_P.yo = new_y - curloc.y;
				_P.xo = new_x - curloc.x;
				_P.Angle = null;
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

// golems.dm:393
rt.def("/datum/species/golem/bluespace/proc/reactive_teleport", function* reactive_teleport(f: Frame, H: Value) {
	H.visible_message(`<span class='warning'>${H} teleports!</span>`, "<span class='danger'>You destabilize and teleport!</span>");
	yield* new_(T("/obj/effect/particle_effect/sparks"), rt.getStep(f, H, 0));
	playsound(rt.getStep(f, H, 0), "sparks", 50, 1);
	yield* do_teleport(H, rt.getStep(f, H, 0), 6, { asoundin: rt.rsc("sound/weapons/emitter2.ogg") });
	this.last_teleport = rt.worldTime(f);
	return f.dot;
}, true);

// golems.dm:400
rt.def("/datum/species/golem/bluespace/proc/spec_hitby", function* spec_hitby(f: Frame, AM: Value, H: Value) {
	let I: Value = null;
	yield* parent_proc();
	if (!rt.istype(AM, T("/obj/item"))) return f.dot;
	if ((I = AM).thrownby == H) {
		return 0;
	} else {
		yield* this.reactive_teleport(H);
	}
	return f.dot;
}, true);

// golems.dm:410
rt.def("/datum/species/golem/bluespace/proc/spec_attack_hand", function* spec_attack_hand(f: Frame, M: Value, H: Value, attacker_style: Value) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.last_teleport + this.teleport_cooldown && M != H && M.a_intent != "help")) return f.dot;
	yield* this.reactive_teleport(H);
	return f.dot;
}, true);

// golems.dm:415
rt.def("/datum/species/golem/bluespace/proc/spec_attacked_by", function* spec_attacked_by(f: Frame, I: Value, user: Value, affecting: Value, intent: Value, H: Value) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.last_teleport + this.teleport_cooldown && user != H)) return f.dot;
	yield* this.reactive_teleport(H);
	return f.dot;
}, true);

// golems.dm:420
rt.def("/datum/species/golem/bluespace/proc/on_hit", function* on_hit(f: Frame, P: Value, H: Value) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.last_teleport + this.teleport_cooldown)) return f.dot;
	yield* this.reactive_teleport(H);
	return f.dot;
}, true);

// golems.dm:425
rt.def("/datum/species/golem/bluespace/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	yield* parent_proc();
	if (!rt.istype(C, T("/mob/living/carbon/human"))) return f.dot;
	this.unstable_teleport = (yield* new_(T("/datum/action/innate/unstable_teleport")));
	yield* this.unstable_teleport.Grant(C);
	return f.dot;
}, true);

// golems.dm:432
rt.def("/datum/species/golem/bluespace/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	if (this.unstable_teleport) {
		yield* this.unstable_teleport.Remove(C);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(151, "/datum/action/innate/unstable_teleport", "/datum/action/innate", {
	cooldown: 150,
	last_teleport: 0,
	charging: 0, // 1 from the button press until the teleport (tg: a second press in the 1.5 s charge teleported twice)
	name: "Unstable Teleport",
	check_flags: 8,
	button_icon_state: "jaunt",
});

// golems.dm:443
rt.def("/datum/action/innate/unstable_teleport/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!parent_proc()) return f.dot;
	if (this.charging) {
		return 0;
	}
	if (rt.worldTime(f) > this.last_teleport + this.cooldown) {
		return 1;
	}
	return 0;
});

// golems.dm:449
rt.def("/datum/action/innate/unstable_teleport/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null;
	if (this.charging) {
		return f.dot;
	}
	this.charging = 1;
	(H = this.owner).visible_message(`<span class='warning'>${H} starts vibrating!</span>`, "<span class='danger'>You start charging your bluespace core...</span>");
	playsound(rt.getStep(f, H, 0), rt.rsc("sound/weapons/flash.ogg"), 25, 1);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/action/innate/unstable_teleport/proc/teleport"), H)), 15);
	return f.dot;
}, true);

// golems.dm:455
rt.def("/datum/action/innate/unstable_teleport/proc/teleport", function* teleport(f: Frame, H: Value) {
	let spark_system: Value = null;
	this.charging = 0;
	H.visible_message(`<span class='warning'>${H} disappears in a shower of sparks!</span>`, "<span class='danger'>You teleport!</span>");
	yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(10, 0, this);
	yield* spark_system.attach(H);
	yield* spark_system.start();
	yield* do_teleport(H, rt.getStep(f, H, 0), 12, { asoundin: rt.rsc("sound/weapons/emitter2.ogg") });
	this.last_teleport = rt.worldTime(f);
	yield* this.UpdateButtonIcon();
	yield* sleep(this.cooldown + 5);
	yield* this.UpdateButtonIcon();
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

// golems.dm:489
rt.def("/datum/species/golem/bananium/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let golem_name: Value = null;
	let clown_name: Value = pick(GLOB.clown_names);
	return (golem_name = `${uppertext(clown_name)}`);
});

// golems.dm:494
rt.def("/datum/species/golem/bananium/proc/spec_attack_hand", function* spec_attack_hand(f: Frame, M: Value, H: Value, attacker_style: Value) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.last_banana + this.banana_cooldown && M != H && M.a_intent != "help")) return f.dot;
	yield* new_(T("/obj/item/weapon/grown/bananapeel/specialpeel"), rt.getStep(f, H, 0));
	this.last_banana = rt.worldTime(f);
	return f.dot;
}, true);

// golems.dm:500
rt.def("/datum/species/golem/bananium/proc/spec_attacked_by", function* spec_attacked_by(f: Frame, I: Value, user: Value, affecting: Value, intent: Value, H: Value) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.last_banana + this.banana_cooldown && user != H)) return f.dot;
	yield* new_(T("/obj/item/weapon/grown/bananapeel/specialpeel"), rt.getStep(f, H, 0));
	this.last_banana = rt.worldTime(f);
	return f.dot;
}, true);

// golems.dm:506
rt.def("/datum/species/golem/bananium/proc/on_hit", function* on_hit(f: Frame, P: Value, H: Value) {
	yield* parent_proc();
	if (!(rt.worldTime(f) > this.last_banana + this.banana_cooldown)) return f.dot;
	yield* new_(T("/obj/item/weapon/grown/bananapeel/specialpeel"), rt.getStep(f, H, 0));
	this.last_banana = rt.worldTime(f);
	return f.dot;
}, true);

// golems.dm:512
rt.def("/datum/species/golem/bananium/proc/spec_hitby", function* spec_hitby(f: Frame, AM: Value, H: Value) {
	let I: Value = null;
	yield* parent_proc();
	if (!rt.istype(AM, T("/obj/item"))) return f.dot;
	if ((I = AM).thrownby == H) {
		return 0;
	} else {
		yield* new_(T("/obj/item/weapon/grown/bananapeel/specialpeel"), rt.getStep(f, H, 0));
		this.last_banana = rt.worldTime(f);
	}
	return f.dot;
}, true);

// golems.dm:523
rt.def("/datum/species/golem/bananium/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (!this.active) {
		if (rt.worldTime(f) > this.last_honk + this.honkooldown) {
			this.active = 1;
			playsound(rt.getStep(f, H, 0), rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
			this.last_honk = rt.worldTime(f);
			this.honkooldown = rand(20, 80);
			this.active = null;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// golems.dm:533
rt.def("/datum/species/golem/bananium/proc/spec_death", function spec_death(f: Frame, gibbed: Value, H: Value) {
	playsound(rt.getStep(f, H, 0), rt.rsc("sound/misc/sadtrombone.ogg"), 70, 0);
	return f.dot;
});

// golems.dm:536
rt.def("/datum/species/golem/bananium/proc/get_spans", function get_spans(f: Frame) {
	return list("clown");
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

// golems.dm:553
rt.def("/datum/species/golem/runic/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let golem_name: Value = null;
	let edgy_first_name: Value = pick("Razor", "Blood", "Dark", "Evil", "Cold", "Pale", "Black", "Silent", "Chaos", "Deadly");
	let edgy_last_name: Value = pick("Edge", "Night", "Death", "Razor", "Blade", "Steel", "Calamity", "Twilight", "Shadow", "Nightmare");
	return (golem_name = `${edgy_first_name} ${edgy_last_name}`);
});

// golems.dm:559
rt.def("/datum/species/golem/runic/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, C, "faction", "cult", rt.bitOr));
	this.phase_shift = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift/golem")));
	yield* C.AddSpell(this.phase_shift);
	this.abyssal_gaze = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/abyssal_gaze")));
	yield* C.AddSpell(this.abyssal_gaze);
	this.dominate = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/dominate")));
	yield* C.AddSpell(this.dominate);
	return f.dot;
}, true);

// golems.dm:569
rt.def("/datum/species/golem/runic/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.faction -= "cult";
	if (this.phase_shift) {
		yield* C.RemoveSpell(this.phase_shift);
	}
	if (this.abyssal_gaze) {
		yield* C.RemoveSpell(this.abyssal_gaze);
	}
	if (!this.dominate) return f.dot;
	yield* C.RemoveSpell(this.dominate);
	return f.dot;
}, true);

// golems.dm:579
rt.def("/datum/species/golem/runic/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	if (chem.id == "holywater") {
		yield* H.adjustFireLoss(4);
		yield* H.reagents.remove_reagent(chem.id, REAGENTS_METABOLISM);
	}
	if (chem.id != "unholywater") return f.dot;
	yield* H.adjustBruteLoss(-4);
	yield* H.adjustFireLoss(-4);
	yield* H.reagents.remove_reagent(chem.id, REAGENTS_METABOLISM);
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

// golems.dm:604
rt.def("/datum/species/golem/cloth/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let golem_name: Value = null;
	let pharaoh_name: Value = pick("Neferkare", "Hudjefa", "Khufu", "Mentuhotep", "Ahmose", "Amenhotep", "Thutmose", "Hatshepsut", "Tutankhamun", "Ramses", "Seti", "Merenptah", "Djer", "Semerkhet", "Nynetjer", "Khafre", "Pepi", "Intef", "Ay");
	return (golem_name = fmt("＀ ３！", [pharaoh_name, rand(1, 99)]));
});

// golems.dm:610
rt.def("/datum/species/golem/cloth/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (H.fire_stacks < 1) {
		yield* H.adjust_fire_stacks(1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// golems.dm:617
rt.def("/datum/species/golem/cloth/proc/spec_death", function* spec_death(f: Frame, gibbed: Value, H: Value) {
	if (gibbed) {
		return f.dot;
	}
	if (H.on_fire) {
		H.visible_message(`<span class='danger'>${H} burns into ash!</span>`);
		yield* H.dust({ just_ash: 1 });
		return f.dot;
	}
	H.visible_message(`<span class='danger'>${H} falls apart into a pile of bandages!</span>`);
	yield* new_(T("/obj/structure/cloth_pile"), rt.getStep(f, H, 0), H);
	yield* parent_proc();
	return f.dot;
}, true);

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

// golems.dm:631
rt.def("/obj/structure/cloth_pile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 90, "bullet", 90, "laser", 25, "energy", 80, "bomb", 50, "bio", 100, "fire", -50, "acid", -50]);
	return f.dot;
});

// golems.dm:640
rt.def("/obj/structure/cloth_pile/proc/Initialize", function* Initialize(f: Frame, mapload: Value, H: Value) {
	if (!(!H || H.gc_destroyed) && is_species(H, T("/datum/species/golem/cloth"))) {
		yield* H.unequip_everything();
		yield* H.forceMove(this);
		this.cloth_golem = H;
		to_chat(this.cloth_golem, "<span class='notice'>You start gathering your life energy, preparing to rise again...</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/cloth_pile/proc/revive"))), this.revive_time);
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// golems.dm:651
rt.def("/obj/structure/cloth_pile/proc/Destroy", function* Destroy(f: Frame) {
	if (this.cloth_golem) {
		yield* qdel(this.cloth_golem);
		this.cloth_golem = null;
	}
	return (yield* parent_proc());
}, true);

// golems.dm:655
rt.def("/obj/structure/cloth_pile/proc/burn", function* burn(f: Frame) {
	this.visible_message(`<span class='danger'>${this} burns into ash!</span>`);
	yield* new_(T("/obj/effect/decal/cleanable/ash"), rt.getStep(f, this, 0));
	yield* parent_proc();
	return f.dot;
}, true);

// golems.dm:660
rt.def("/obj/structure/cloth_pile/proc/revive", function* revive(f: Frame) {
	if (!this || this.gc_destroyed || !this.cloth_golem || this.cloth_golem.gc_destroyed) {
		return f.dot;
	}
	if (this.cloth_golem.suiciding || rt.bitAnd(this.cloth_golem.disabilities, 128)) {
		yield* qdel(this.cloth_golem);
		this.cloth_golem = null;
		return f.dot;
	}
	this.invisibility = INVISIBILITY_MAXIMUM;
	yield* new_(T("/obj/effect/temp_visual/mummy_animation"), rt.getStep(f, this, 0));
	if (yield* this.cloth_golem.revive({ full_heal: 1, admin_revive: 1 })) {
		yield* this.cloth_golem.grab_ghost();
	}
	yield* sleep(20);
	yield* this.cloth_golem.forceMove(rt.getStep(f, this, 0));
	this.cloth_golem.visible_message(`<span class='danger'>${this} rises and reforms into ${this.cloth_golem}!</span>`, "<span class='userdanger'>You reform into yourself!</span>");
	this.cloth_golem = null;
	yield* qdel(this);
	return f.dot;
}, true);

// golems.dm:677
rt.def("/obj/structure/cloth_pile/proc/attackby", function* attackby(f: Frame, P: Value, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (rt.bitAnd(this.resistance_flags, 8)) {
		return f.dot;
	}
	if (!P.is_hot()) return f.dot;
	this.visible_message(`<span class='danger'>${this} bursts into flames!</span>`);
	yield* this.fire_act();
	return f.dot;
}, true);

rt.type(4099, "/datum/species/golem/plastic", "/datum/species/golem", {
	name: "Plastic",
	id: "plastic golem",
	prefix: "Plastic",
	fixed_mut_color: "fff",
	info_text: "As a <span class='danger'>Plastic Golem</span>, you are capable of ventcrawling, and passing through plastic flaps.",
});

// golems.dm:694
rt.def("/datum/species/golem/plastic/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	f.dot = (yield* parent_proc());
	C.ventcrawler = VENTCRAWLER_NUDE;
	return f.dot;
}, true);

// golems.dm:698
rt.def("/datum/species/golem/plastic/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.ventcrawler = rt.initial(f, C, "ventcrawler");
	return f.dot;
}, true);
