// Based on /tg/station's code/modules/reagents/chemistry/reagents/food_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3358, "/datum/reagent/consumable", "/datum/reagent", {
	nutriment_factor: 0.4,
	name: "Consumable",
	id: "consumable",
	taste_description: "generic food",
	taste_mult: 4,
});

// food_reagents.dm:18
rt.def("/datum/reagent/consumable/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	this.current_cycle++;
	M.nutrition += this.nutriment_factor;
	yield* this.holder.remove_reagent(this.id, this.metabolization_rate);
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

// food_reagents.dm:34
rt.def("/datum/reagent/consumable/nutriment/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(50)) {
		yield* M.heal_bodypart_damage(this.brute_heal, this.burn_heal, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// food_reagents.dm:43
rt.def("/datum/reagent/consumable/nutriment/proc/on_new", function on_new(f: Frame, supplied_data: Value) {
	if (!supplied_data) {
		supplied_data = this.data;
	}
	this.data = counterlist_normalise(supplied_data);
	return f.dot;
});

// food_reagents.dm:52
rt.def("/datum/reagent/consumable/nutriment/proc/on_merge", function on_merge(f: Frame, newdata: Value, newvolume: Value) {
	let other_taste_amounts: Value = null;
	if (!rt.istype(newdata, T("/list")) || !rt.len(f, newdata)) {
		return f.dot;
	}
	let taste_amounts: Value = list();
	if (this.data) {
		taste_amounts = this.data.Copy();
	}
	counterlist_scale(taste_amounts, this.volume);
	counterlist_scale((other_taste_amounts = newdata.Copy()), newvolume);
	counterlist_combine(taste_amounts, other_taste_amounts);
	counterlist_normalise(taste_amounts);
	this.data = taste_amounts;
	return f.dot;
});

rt.type(3490, "/datum/reagent/consumable/nutriment/vitamin", "/datum/reagent/consumable/nutriment", {
	name: "Vitamin",
	id: "vitamin",
	description: "All the best vitamins, minerals, and carbohydrates the body needs in pure form.",
	brute_heal: 1,
	burn_heal: 1,
});

// food_reagents.dm:82
rt.def("/datum/reagent/consumable/nutriment/vitamin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.satiety < 600) {
		M.satiety += 30;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

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

// food_reagents.dm:99
rt.def("/datum/reagent/consumable/sugar/proc/overdose_start", function* overdose_start(f: Frame, M: Value) {
	to_chat(M, "<span class='userdanger'>You go into hyperglycaemic shock! Lay off the twinkies!</span>");
	yield* M.AdjustSleeping(600, 0);
	f.dot = 1;
	return f.dot;
}, true);

// food_reagents.dm:104
rt.def("/datum/reagent/consumable/sugar/proc/overdose_process", function* overdose_process(f: Frame, M: Value) {
	yield* M.AdjustSleeping(40, 0);
	yield* parent_proc();
	f.dot = 1;
	return f.dot;
}, true);

rt.type(3495, "/datum/reagent/consumable/capsaicin", "/datum/reagent/consumable", {
	name: "Capsaicin Oil",
	id: "capsaicin",
	description: "This is what makes chilis hot.",
	color: "#B31008",
	taste_description: "hot peppers",
	taste_mult: 1.5,
});

// food_reagents.dm:142
rt.def("/datum/reagent/consumable/capsaicin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(this.current_cycle, 1, 15)) {
		M.bodytemperature += 7.5;
		if (this.holder.has_reagent("cryostylane")) {
			yield* this.holder.remove_reagent("cryostylane", 5);
		}
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature += rand(5, 20);
		}
	} else if (rt.inRange(this.current_cycle, 15, 25)) {
		M.bodytemperature += 15;
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature += rand(10, 20);
		}
	} else if (rt.inRange(this.current_cycle, 25, 35)) {
		M.bodytemperature += 22.5;
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature += rand(15, 20);
		}
	} else if (rt.inRange(this.current_cycle, 35, 1e+31)) {
		M.bodytemperature += 30;
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature += rand(20, 25);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3496, "/datum/reagent/consumable/frostoil", "/datum/reagent/consumable", {
	name: "Frost Oil",
	id: "frostoil",
	description: "A special oil that noticably chills the body. Extracted from Icepeppers and slimes.",
	color: "#8BA6E9",
	taste_description: "mint",
});

// food_reagents.dm:171
rt.def("/datum/reagent/consumable/frostoil/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.inRange(this.current_cycle, 1, 15)) {
		M.bodytemperature -= 15;
		if (this.holder.has_reagent("capsaicin")) {
			yield* this.holder.remove_reagent("capsaicin", 5);
		}
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature -= rand(5, 20);
		}
	} else if (rt.inRange(this.current_cycle, 15, 25)) {
		M.bodytemperature -= 30;
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature -= rand(10, 20);
		}
	} else if (rt.inRange(this.current_cycle, 25, 35)) {
		M.bodytemperature -= 45;
		if (prob(1)) {
			yield* M.emote("shiver");
		}
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature -= rand(15, 20);
		}
	} else if (rt.inRange(this.current_cycle, 35, 1e+31)) {
		M.bodytemperature -= 60;
		if (prob(5)) {
			yield* M.emote("shiver");
		}
		if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
			M.bodytemperature -= rand(20, 25);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// food_reagents.dm:197
rt.def("/datum/reagent/consumable/frostoil/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let M: Value = null, OT: Value = null;
	if (reac_volume >= 5) {
		for (M of each(_T, T("/mob/living/simple_animal/slime"))) {
			yield* M.adjustToxLoss(rand(15, 30));
		}
	}
	if (!(reac_volume >= 1)) return f.dot;
	if (!rt.istype(_T, T("/turf/open"))) return f.dot;
	yield* (OT = _T).MakeSlippery({ wet_setting: TURF_WET_ICE, min_wet_time: 10, wet_time_to_add: reac_volume });
	OT.air.temperature -= 10398.38 * reac_volume / OT.air.heat_capacity();
	return f.dot;
}, true);

rt.type(3497, "/datum/reagent/consumable/condensedcapsaicin", "/datum/reagent/consumable", {
	name: "Condensed Capsaicin",
	id: "condensedcapsaicin",
	description: "A chemical agent used for self-defense and in police work.",
	color: "#B31008",
	taste_description: "scorching agony",
});

// food_reagents.dm:214
rt.def("/datum/reagent/consumable/condensedcapsaicin/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	let safe_thing: Value = null, H: Value = null;
	method ??= TOUCH;
	if (!rt.istype(M, T("/mob/living/carbon/human")) && !rt.istype(M, T("/mob/living/carbon/monkey"))) {
		return f.dot;
	}
	let victim: Value = M;
	if (!(method == TOUCH || method == VAPOR)) return f.dot;
	let mouth_covered: Value = 0;
	let eyes_covered: Value = 0;
	if (victim.wear_mask) {
		if (rt.bitAnd(victim.wear_mask.flags_cover, MASKCOVERSEYES)) {
			eyes_covered = 1;
			safe_thing = victim.wear_mask;
		}
		if (rt.bitAnd(victim.wear_mask.flags_cover, MASKCOVERSMOUTH)) {
			mouth_covered = 1;
			safe_thing = victim.wear_mask;
		}
	}
	if (rt.istype(victim, T("/mob/living/carbon/human"))) {
		if ((H = victim).head) {
			if (rt.bitAnd(H.head.flags_cover, MASKCOVERSEYES)) {
				eyes_covered = 1;
				safe_thing = H.head;
			}
			if (rt.bitAnd(H.head.flags_cover, MASKCOVERSMOUTH)) {
				mouth_covered = 1;
				safe_thing = H.head;
			}
		}
		if (H.glasses) {
			eyes_covered = 1;
			if (!safe_thing) {
				safe_thing = H.glasses;
			}
		}
	}
	if (eyes_covered && mouth_covered) {
		return f.dot;
	} else if (mouth_covered) {
		if (prob(5)) {
			yield* victim.emote("scream");
		}
		yield* victim.blur_eyes(3);
		yield* victim.blind_eyes(2);
		victim.confused = max(M.confused, 3);
		victim.damageoverlaytemp = 60;
		yield* victim.Knockdown(60);
		yield* victim.drop_item();
		return f.dot;
	} else if (eyes_covered) {
		yield* victim.blur_eyes(3);
		victim.damageoverlaytemp = 30;
		return f.dot;
	} else {
		if (prob(5)) {
			yield* victim.emote("scream");
		}
		yield* victim.blur_eyes(5);
		yield* victim.blind_eyes(3);
		victim.confused = max(M.confused, 6);
		victim.damageoverlaytemp = 75;
		yield* victim.Knockdown(100);
		yield* victim.drop_item();
	}
	yield* victim.update_damage_hud();
	return f.dot;
}, true);

// food_reagents.dm:277
rt.def("/datum/reagent/consumable/condensedcapsaicin/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(5)) {
		M.visible_message(`<span class='warning'>${M} ${pick("dry heaves!", "coughs!", "splutters!")}</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3498, "/datum/reagent/consumable/sodiumchloride", "/datum/reagent/consumable", {
	name: "Table Salt",
	id: "sodiumchloride",
	description: "A salt made of sodium chloride. Commonly used to season food.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_description: "salt",
});

// food_reagents.dm:290
rt.def("/datum/reagent/consumable/sodiumchloride/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value) {
	method ??= TOUCH;
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	if (!M.has_bane("salt")) return f.dot;
	yield* M.mind.disrupt_spells(-200);
	return f.dot;
}, true);

// food_reagents.dm:296
rt.def("/datum/reagent/consumable/sodiumchloride/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	if (!rt.istype(_T, T("/turf"))) {
		return f.dot;
	}
	if (reac_volume < 1) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/decal/cleanable/salt"), _T);
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

// food_reagents.dm:331
rt.def("/datum/reagent/consumable/hot_coco/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature < 310) {
		M.bodytemperature = min(310, M.bodytemperature + 7.5);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3546, "/datum/reagent/mushroomhallucinogen", "/datum/reagent", {
	name: "Mushroom Hallucinogen",
	id: "mushroomhallucinogen",
	description: "A strong hallucinogenic drug derived from certain species of mushroom.",
	color: "#E700E7",
	metabolization_rate: 0.080000006,
	taste_description: "mushroom",
});

// food_reagents.dm:344
rt.def("/datum/reagent/mushroomhallucinogen/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (!M.slurring) {
		M.slurring = 1;
	}
	if (rt.inRange(this.current_cycle, 1, 5)) {
		M.Dizzy(5);
		yield* M.set_drugginess(30);
		if (prob(10)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
	} else if (rt.inRange(this.current_cycle, 5, 10)) {
		M.Jitter(10);
		M.Dizzy(10);
		yield* M.set_drugginess(35);
		if (prob(20)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
	} else if (rt.inRange(this.current_cycle, 10, 1e+31)) {
		M.Jitter(20);
		M.Dizzy(20);
		yield* M.set_drugginess(40);
		if (prob(30)) {
			yield* M.emote(pick("twitch", "giggle"));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3502, "/datum/reagent/consumable/sprinkles", "/datum/reagent/consumable", {
	name: "Sprinkles",
	id: "sprinkles",
	description: "Multi-colored little bits of sugar, commonly found on donuts. Loved by cops.",
	color: "#FF00FF",
	taste_description: "childhood whimsy",
});

// food_reagents.dm:374
rt.def("/datum/reagent/consumable/sprinkles/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (rt.isIn(f, ((rt.istype(M, T("/mob/living/carbon/human")) ? 1 : 0) && M.job), list("Security Officer", "Head of Security", "Detective", "Warden"))) {
		yield* M.heal_bodypart_damage(1, 1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3503, "/datum/reagent/consumable/cornoil", "/datum/reagent/consumable", {
	name: "Corn Oil",
	id: "cornoil",
	description: "An oil derived from various types of corn.",
	nutriment_factor: 8,
	color: "#302000",
	taste_description: "slime",
});

// food_reagents.dm:388
rt.def("/datum/reagent/consumable/cornoil/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let hotspot: Value = null, lowertemp: Value = null;
	if (!rt.istype(_T, T("/turf/open"))) {
		return f.dot;
	}
	yield* _T.MakeSlippery({ min_wet_time: 10, wet_time_to_add: reac_volume * 2 });
	if (!(hotspot = rt.locateIn(f, T("/obj/effect/hotspot"), _T))) return f.dot;
	(lowertemp = (yield* _T.remove_air(_T.air.total_moles()))).temperature = max(min(lowertemp.temperature - 2000, lowertemp.temperature / 2), 0);
	yield* lowertemp.react();
	yield* _T.assume_air(lowertemp);
	yield* qdel(hotspot);
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

// food_reagents.dm:423
rt.def("/datum/reagent/consumable/hot_ramen/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (M.bodytemperature < 310) {
		M.bodytemperature = min(310, M.bodytemperature + 15);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3507, "/datum/reagent/consumable/hell_ramen", "/datum/reagent/consumable", {
	name: "Hell Ramen",
	id: "hell_ramen",
	description: "The noodles are boiled, the flavors are artificial, just like being back in school.",
	nutriment_factor: 2,
	color: "#302000",
	taste_description: "wet and cheap noodles on fire",
});

// food_reagents.dm:436
rt.def("/datum/reagent/consumable/hell_ramen/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	M.bodytemperature += 15;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3508, "/datum/reagent/consumable/flour", "/datum/reagent/consumable", {
	name: "Flour",
	id: "flour",
	description: "This is what you rub all over yourself to pretend to be a ghost.",
	reagent_state: 1,
	color: "#FFFFFF",
	taste_description: "chalky wheat",
});

// food_reagents.dm:448
rt.def("/datum/reagent/consumable/flour/proc/reaction_turf", function* reaction_turf(f: Frame, _T: Value, reac_volume: Value) {
	let reagentdecal: Value = null;
	if (rt.istype(_T, T("/turf/open/space"))) return f.dot;
	yield* (reagentdecal = (yield* new_(T("/obj/effect/decal/cleanable/flour"), _T))).reagents.add_reagent("flour", reac_volume);
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

// food_reagents.dm:507
rt.def("/datum/reagent/consumable/corn_syrup/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* this.holder.add_reagent("sugar", 3);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3516, "/datum/reagent/consumable/honey", "/datum/reagent/consumable", {
	name: "honey",
	id: "honey",
	description: "Sweet sweet honey, decays into sugar and has natural healing properties.",
	color: "#d3a308",
	nutriment_factor: 6,
	metabolization_rate: 0.4,
	taste_description: "sweetness",
});

// food_reagents.dm:520
rt.def("/datum/reagent/consumable/honey/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.reagents.add_reagent("sugar", 3);
	if (prob(55)) {
		yield* M.adjustBruteLoss(-1, 0);
		yield* M.adjustFireLoss(-1, 0);
		yield* M.adjustOxyLoss(-1, 0);
		yield* M.adjustToxLoss(-1, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3518, "/datum/reagent/consumable/tearjuice", "/datum/reagent/consumable", {
	name: "Tear Juice",
	id: "tearjuice",
	description: "A blinding substance extracted from certain onions.",
	color: "#c0c9a0",
	taste_description: "bitterness",
});

// food_reagents.dm:543
rt.def("/datum/reagent/consumable/tearjuice/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (!rt.istype(f.args[0], T("/mob/living"))) {
		return f.dot;
	}
	let unprotected: Value = 0;
	const subject = f.args[1];
	if (subject === INGEST) {
		unprotected = 1;
	} else if (subject === INJECT) {
		unprotected = 0;
	} else if (!f.args[0].is_mouth_covered() && !f.args[0].is_eyes_covered()) {
		unprotected = 1;
	}
	if (unprotected) {
		if (!f.args[0].getorganslot("eye_sight")) {
			to_chat(f.args[0], "<span class = 'notice'>Your eye sockets feel wet.</span>");
		} else {
			if (!f.args[0].eye_blurry) {
				to_chat(f.args[0], "<span class = 'warning'>Tears well up in your eyes!</span>");
			}
			yield* f.args[0].blind_eyes(2);
			yield* f.args[0].blur_eyes(5);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "method", "reac_volume"] });

// food_reagents.dm:565
rt.def("/datum/reagent/consumable/tearjuice/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* parent_proc();
	if (!M.eye_blurry) return f.dot;
	yield* M.blur_eyes(4);
	if (!prob(10)) return f.dot;
	to_chat(M, "<span class = 'warning'>Your eyes sting!</span>");
	yield* M.blind_eyes(2);
	return f.dot;
}, true);

rt.type(3519, "/datum/reagent/consumable/entpoly", "/datum/reagent/consumable", {
	name: "Entropic Polypnium",
	id: "entpoly",
	description: "An ichor, derived from a certain mushroom, makes for a bad time.",
	color: "#1d043d",
	taste_description: "bitter mushroom",
});

// food_reagents.dm:584
rt.def("/datum/reagent/consumable/entpoly/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (this.current_cycle >= 10) {
		yield* M.Unconscious(40, 0);
		f.dot = 1;
	}
	if (prob(20)) {
		M.losebreath += 4;
		yield* M.adjustBrainLoss(2);
		yield* M.adjustToxLoss(3, 0);
		yield* M.adjustStaminaLoss(10, 0);
		yield* M.blur_eyes(5);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3520, "/datum/reagent/consumable/tinlux", "/datum/reagent/consumable", {
	name: "Tinea Luxor",
	id: "tinlux",
	description: "A stimulating ichor which causes luminescent fungi to grow on the skin. ",
	color: "#b5a213",
	taste_description: "tingling mushroom",
});

// food_reagents.dm:604
rt.def("/datum/reagent/consumable/tinlux/proc/reaction_mob", function reaction_mob(f: Frame, M: Value) {
	M.set_light(2);
	return f.dot;
});

// food_reagents.dm:607
rt.def("/datum/reagent/consumable/tinlux/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	M.set_light(-2);
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

// food_reagents.dm:618
rt.def("/datum/reagent/consumable/vitfro/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	if (prob(80)) {
		yield* M.adjustBruteLoss(-1, 0);
		yield* M.adjustFireLoss(-1, 0);
		f.dot = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);
