// Based on /tg/station's code/modules/mob/living/simple_animal/simple_animal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4840, "/mob/living/simple_animal", "/mob/living", {
	icon_living: "",
	icon_dead: "",
	icon_gib: null,
	speak: null,
	speak_emote: null,
	speak_chance: 0,
	emote_hear: null,
	emote_see: null,
	turns_per_move: 1,
	turns_since_move: 0,
	stop_automated_movement: 0,
	wander: 1,
	stop_automated_movement_when_pulled: 1,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	harm_intent_damage: 3,
	force_threshold: 0,
	minbodytemp: 250,
	maxbodytemp: 350,
	healable: 1,
	atmos_requirements: null,
	unsuitable_atmos_damage: 2,
	melee_damage_lower: 0,
	melee_damage_upper: 0,
	obj_damage: 0,
	armour_penetration: 0,
	melee_damage_type: "brute",
	damage_coeff: null,
	attacktext: "attacks",
	attack_sound: null,
	friendly: "nuzzles",
	environment_smash: 0,
	speed: 1,
	childtype: null,
	next_scan_time: 0,
	animal_species: null,
	access_card: null,
	buffed: 0,
	gold_core_spawnable: 0,
	nest: null,
	sentience_type: 1,
	loot: null,
	del_on_death: 0,
	deathmessage: "",
	death_sound: null,
	allow_movement_on_non_turfs: 0,
	attacked_sound: "punch",
	dextrous: 0,
	dextrous_hud_type: rt.typePath("/datum/hud/dextrous"),
	handcrafting: null,
	tame: 0,
	name: "animal",
	icon: rt.rsc("icons/mob/animal.dmi"),
	health: 20,
	maxHealth: 20,
	gender: "plural",
	status_flags: 8,
});

// simple_animal.dm:14
rt.def("/mob/living/simple_animal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list();

	this.speak_emote = list();

	this.emote_hear = list();

	this.emote_see = list();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]);
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]);

	this.loot = list();
	return f.dot;
});

// simple_animal.dm:89
rt.def("/mob/living/simple_animal/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.simple_animals += this;
	this.handcrafting = (yield* new_(T("/datum/personal_crafting")));
	if (this.gender == "plural") {
		this.gender = pick("male", "female");
	}
	if (!this.real_name) {
		this.real_name = this.name;
	}
	if (this.loc) return f.dot;
	stack_trace("Simple animal being instantiated in nullspace");
	return f.dot;
}, true);

// simple_animal.dm:101
rt.def("/mob/living/simple_animal/proc/Login", function* Login(f: Frame) {
	if (this && this.client) {
		this.client.screen = list();
		this.client.screen += GLOB.void;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// simple_animal.dm:107
rt.def("/mob/living/simple_animal/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* parent_proc();
	this.health = max(0, min(this.health, this.maxHealth));
	return f.dot;
}, true);

// simple_animal.dm:111
rt.def("/mob/living/simple_animal/proc/update_stat", function* update_stat(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.stat != 2) {
		if (this.health <= 0) {
			yield* this.death();
		} else {
			this.stat = 0;
		}
	}
	this.med_hud_set_status();
	return f.dot;
}, true);

// simple_animal.dm:122
rt.def("/mob/living/simple_animal/proc/handle_status_effects", function handle_status_effects(f: Frame) {
	parent_proc();
	if (!this.stuttering) return f.dot;
	this.stuttering = 0;
	return f.dot;
});

// simple_animal.dm:132
rt.def("/mob/living/simple_animal/proc/handle_automated_movement", function* handle_automated_movement(f: Frame) {
	let anydir: Value = null;
	if (!(!this.stop_automated_movement && this.wander)) return f.dot;
	if (!((isturf(this.loc) || this.allow_movement_on_non_turfs) && !this.resting && !this.buckled && this.canmove)) return f.dot;
	this.turns_since_move++;
	if (this.turns_since_move >= this.turns_per_move) {
		if (!(this.stop_automated_movement_when_pulled && this.pulledby)) {
			if (yield* this.Process_Spacemove((anydir = pick(GLOB.cardinal)))) {
				yield* this.Move(rt.getStep(f, this, anydir), anydir);
				this.turns_since_move = 0;
			}
		}
	}
	return 1;
}, true, { waitfor: false });

// simple_animal.dm:146
rt.def("/mob/living/simple_animal/proc/handle_automated_speech", function* handle_automated_speech(f: Frame, override: Value) {
	let length: Value = null, randomValue: Value = null, pick: Value = null;
	if (!this.speak_chance) return f.dot;
	if (!(prob(this.speak_chance) || override)) return f.dot;
	if (this.speak && rt.len(f, this.speak)) {
		if (this.emote_hear && rt.len(f, this.emote_hear) || this.emote_see && rt.len(f, this.emote_see)) {
			length = rt.len(f, this.speak);
			if (this.emote_hear && rt.len(f, this.emote_hear)) {
				length += rt.len(f, this.emote_hear);
			}
			if (this.emote_see && rt.len(f, this.emote_see)) {
				length += rt.len(f, this.emote_see);
			}
			if ((randomValue = rand(1, length)) <= rt.len(f, this.speak)) {
				yield* this.say(rt.op(f, "PickUnweighted", [1], [this.speak]));
			} else {
				randomValue -= rt.len(f, this.speak);
				if (this.emote_see && randomValue <= rt.len(f, this.emote_see)) {
					yield* this.emote(`me ${rt.op(f, "PickUnweighted", [1], [this.emote_see])}`, 1);
				} else {
					yield* this.emote(`me ${rt.op(f, "PickUnweighted", [1], [this.emote_hear])}`, 2);
				}
			}
		} else {
			yield* this.say(rt.op(f, "PickUnweighted", [1], [this.speak]));
		}
	} else {
		if (!(this.emote_hear && rt.len(f, this.emote_hear)) && this.emote_see && rt.len(f, this.emote_see)) {
			yield* this.emote("me", 1, rt.op(f, "PickUnweighted", [1], [this.emote_see]));
		}
		if (this.emote_hear && rt.len(f, this.emote_hear) && !(this.emote_see && rt.len(f, this.emote_see))) {
			yield* this.emote("me", 2, rt.op(f, "PickUnweighted", [1], [this.emote_hear]));
		}
		if (!(this.emote_hear && rt.len(f, this.emote_hear) && this.emote_see && rt.len(f, this.emote_see))) return f.dot;
		length = rt.len(f, this.emote_hear) + rt.len(f, this.emote_see);
		if ((pick = rand(1, length)) <= rt.len(f, this.emote_see)) {
			yield* this.emote("me", 1, rt.op(f, "PickUnweighted", [1], [this.emote_see]));
		} else {
			yield* this.emote("me", 2, rt.op(f, "PickUnweighted", [1], [this.emote_hear]));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// simple_animal.dm:182
rt.def("/mob/living/simple_animal/proc/environment_is_safe", function environment_is_safe(f: Frame, environment: Value, check_temp: Value) {
	let ST: Value = null, ST_gases: Value = null, tox: Value = null, oxy: Value = null, n2: Value = null, co2: Value = null, areatemp: Value = null;
	check_temp ??= 0;
	f.dot = 1;
	if (this.pulledby && this.pulledby.grab_state >= 3 && rt.at(this.atmos_requirements, "min_oxy")) {
		f.dot = 0;
	}
	if (isturf(this.loc) && rt.istype(this.loc, T("/turf/open"))) {
		if ((ST = this.loc).air) {
			ST_gases = ST.air.gases;
			rt.callName(f, ST.air, "assert_gases", [GLOB.hardcoded_gases], rt.Args.List);
			tox = rt.index(rt.at(ST_gases, "plasma"), 1);
			oxy = rt.index(rt.at(ST_gases, "o2"), 1);
			n2 = rt.index(rt.at(ST_gases, "n2"), 1);
			co2 = rt.index(rt.at(ST_gases, "co2"), 1);
			ST.air.garbage_collect();
			if (rt.at(this.atmos_requirements, "min_oxy") && oxy < rt.at(this.atmos_requirements, "min_oxy")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "max_oxy") && oxy > rt.at(this.atmos_requirements, "max_oxy")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "min_tox") && tox < rt.at(this.atmos_requirements, "min_tox")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "max_tox") && tox > rt.at(this.atmos_requirements, "max_tox")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "min_n2") && n2 < rt.at(this.atmos_requirements, "min_n2")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "max_n2") && n2 > rt.at(this.atmos_requirements, "max_n2")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "min_co2") && co2 < rt.at(this.atmos_requirements, "min_co2")) {
				f.dot = 0;
			} else if (rt.at(this.atmos_requirements, "max_co2") && co2 > rt.at(this.atmos_requirements, "max_co2")) {
				f.dot = 0;
			}
		} else if (rt.at(this.atmos_requirements, "min_oxy") || rt.at(this.atmos_requirements, "min_tox") || rt.at(this.atmos_requirements, "min_n2") || rt.at(this.atmos_requirements, "min_co2")) {
			f.dot = 0;
		}
	}
	if (!check_temp) return f.dot;
	if (!((areatemp = this.get_temperature(environment)) < this.minbodytemp || areatemp > this.maxbodytemp)) return f.dot;
	f.dot = 0;
	return f.dot;
});

// simple_animal.dm:226
rt.def("/mob/living/simple_animal/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let A: Value = null, areatemp: Value = null, diff: Value = null;
	if (isturf((A = this.loc))) {
		if (rt.op(f, "Abs", [], [(areatemp = this.get_temperature(environment)) - this.bodytemperature]) > 40) {
			this.bodytemperature += (diff = (diff = areatemp - this.bodytemperature) / 5);
		}
	}
	if (!this.environment_is_safe(environment)) {
		yield* this.adjustHealth(this.unsuitable_atmos_damage);
	}
	yield* this.handle_temperature_damage();
	return f.dot;
}, true);

// simple_animal.dm:240
rt.def("/mob/living/simple_animal/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (!(this.bodytemperature < this.minbodytemp || this.bodytemperature > this.maxbodytemp)) return f.dot;
	yield* this.adjustHealth(this.unsuitable_atmos_damage);
	return f.dot;
}, true);

// simple_animal.dm:245
rt.def("/mob/living/simple_animal/proc/gib", function* gib(f: Frame) {
	let path: Value = null, i: Value = null;
	if (this.butcher_results) {
		for (path of each(this.butcher_results)) {
			i = 1;
			while (i <= rt.index(this.butcher_results, path)) {
				yield* new_(path, this.loc);
				i++;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// simple_animal.dm:252
rt.def("/mob/living/simple_animal/proc/gib_animation", function* gib_animation(f: Frame) {
	if (!this.icon_gib) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/gib_animation/animal"), this.loc, this.icon_gib);
	return f.dot;
}, true);

// simple_animal.dm:255
rt.def("/mob/living/simple_animal/proc/say_mod", function say_mod(f: Frame, input: Value, message_mode: Value) {
	if (this.speak_emote && rt.len(f, this.speak_emote)) {
		this.verb_say = pick(this.speak_emote);
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// simple_animal.dm:262
rt.def("/mob/living/simple_animal/proc/emote", function* emote(f: Frame, act: Value, m_type: Value, message: Value) {
	m_type ??= 1;
	if (this.stat) {
		return f.dot;
	}
	if (act == "scream") {
		message = "makes a loud and pained whimper.";
		act = "me";
	}
	yield* parent_proc(act, m_type, message);
	return f.dot;
}, true);

// simple_animal.dm:270
rt.def("/mob/living/simple_animal/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot = this.speed;
	f.dot += GLOB.config.animal_delay;
	return f.dot;
});

// simple_animal.dm:277
rt.def("/mob/living/simple_animal/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat(null, `Health: ${round(this.health / this.maxHealth * 100)}%`);
	return 1;
}, true);

// simple_animal.dm:284
rt.def("/mob/living/simple_animal/proc/death", function* death(f: Frame, gibbed: Value) {
	let i: Value = null;
	if (this.nest) {
		this.nest.spawned_mobs -= this;
		this.nest = null;
	}
	if (rt.len(f, this.loot)) {
		for (i of each(this.loot)) {
			yield* new_(i, this.loc);
		}
	}
	if (this.dextrous) {
		yield* this.drop_all_held_items();
	}
	if (!gibbed) {
		if (this.death_sound) {
			playsound(rt.getStep(f, this, 0), this.death_sound, 200, 1);
		}
		if (this.deathmessage || !this.del_on_death) {
			yield* this.emote("deathgasp");
		}
	}
	if (this.del_on_death) {
		yield* parent_proc();
		this.del_on_death = 0;
		yield* qdel(this);
	} else {
		this.health = 0;
		this.icon_state = this.icon_dead;
		this.density = 0;
		this.lying = 1;
		yield* parent_proc();
	}
	return f.dot;
}, true);

// simple_animal.dm:310
rt.def("/mob/living/simple_animal/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let L: Value = null, M: Value = null;
	if (this.see_invisible < the_target.invisibility) {
		return 0;
	}
	if (rt.istype(the_target, T("/mob/living"))) {
		if ((L = the_target).stat != 0) {
			return 0;
		}
	}
	if (rt.istype(the_target, T("/obj/mecha"))) {
		if ((M = the_target).occupant) {
			return 0;
		}
	}
	return 1;
});

// simple_animal.dm:332
rt.def("/mob/living/simple_animal/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	this.icon = rt.initial(f, this, "icon");
	this.icon_state = this.icon_living;
	this.density = rt.initial(f, this, "density");
	this.lying = 0;
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// simple_animal.dm:340
rt.def("/mob/living/simple_animal/proc/make_babies", function* make_babies(f: Frame) {
	let partner: Value = null, M: Value = null, target: Value = null;
	if (this.gender != "female" || this.stat || this.next_scan_time > rt.worldTime(f) || !this.childtype || !this.animal_species || !GLOB.SSticker.IsRoundInProgress()) {
		return f.dot;
	}
	this.next_scan_time = rt.worldTime(f) + 400;
	let alone: Value = 1;
	let children: Value = 0;
	for (M of each(view(7, this), T("/mob"))) {
		if (M.stat != 0) {
			continue;
		}
		if (rt.op(f, "IsType", [], [M, this.childtype])) {
			children++;
		} else if (rt.op(f, "IsType", [], [M, this.animal_species])) {
			if (M.ckey) {
				continue;
			}
			if (!rt.op(f, "IsType", [], [M, this.childtype]) && M.gender == "male") {
				partner = M;
			}
		} else if (rt.istype(M, T("/mob/living")) && !this.faction_check_mob(M)) {
			return f.dot;
		}
	}
	if (!(alone && partner && children < 3)) return f.dot;
	let childspawn: Value = pickweight(this.childtype);
	if (!(target = rt.getStep(f, this.loc, 0))) return f.dot;
	return (yield* new_(childspawn, target));
}, true);

// simple_animal.dm:367
rt.def("/mob/living/simple_animal/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value, no_dextery: Value) {
	be_close ??= 0;
	no_dextery ??= 0;
	if (this.incapacitated()) {
		return 0;
	}
	if (no_dextery || this.dextrous) {
		if (be_close && !(get_dist(M, this) <= 1)) {
			return 0;
		}
	} else {
		to_chat(this, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return 0;
	}
	return 1;
});

// simple_animal.dm:378
rt.def("/mob/living/simple_animal/proc/stripPanelUnequip", function* stripPanelUnequip(f: Frame, what: Value, who: Value, where: Value) {
	if (!this.canUseTopic(who, 1)) {
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// simple_animal.dm:384
rt.def("/mob/living/simple_animal/proc/stripPanelEquip", function* stripPanelEquip(f: Frame, what: Value, who: Value, where: Value) {
	if (!this.canUseTopic(who, 1)) {
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// simple_animal.dm:390
rt.def("/mob/living/simple_animal/proc/update_canmove", function* update_canmove(f: Frame) {
	if (this.IsUnconscious() || this.IsStun() || this.IsKnockdown() || this.stat || this.resting) {
		yield* this.drop_all_held_items();
		this.canmove = 0;
	} else if (this.buckled) {
		this.canmove = 0;
	} else {
		this.canmove = 1;
	}
	yield* this.update_transform();
	yield* this.update_action_buttons_icon();
	return this.canmove;
}, true);

// simple_animal.dm:402
rt.def("/mob/living/simple_animal/proc/update_transform", function update_transform(f: Frame) {
	let ntransform: Value = matrix(this.transform);
	let changed: Value = 0;
	if (this.resize != RESIZE_DEFAULT_SIZE) {
		changed++;
		ntransform.Scale(this.resize);
		this.resize = RESIZE_DEFAULT_SIZE;
	}
	if (!changed) return f.dot;
	rt.op(f, "Animate", [2, 8], [null, this, "transform", ntransform, "time", 2, "easing", 192]);
	return f.dot;
});

// simple_animal.dm:417
rt.def("/mob/living/simple_animal/proc/Destroy", function* Destroy(f: Frame) {
	if (this.nest) {
		this.nest.spawned_mobs -= this;
	}
	this.nest = null;
	GLOB.simple_animals -= this;
	return (yield* parent_proc());
}, true);

// simple_animal.dm:427
rt.def("/mob/living/simple_animal/proc/update_sight", function update_sight(f: Frame) {
	let A: Value = null;
	if (!this.client) {
		return f.dot;
	}
	if (this.stat == 2) {
		this.sight = 28;
		this.see_in_dark = 8;
		this.see_invisible = 60;
		return f.dot;
	}
	this.see_invisible = rt.initial(f, this, "see_invisible");
	this.see_in_dark = rt.initial(f, this, "see_in_dark");
	this.sight = rt.initial(f, this, "sight");
	if (this.client.eye != this) {
		if ((A = this.client.eye).update_remote_sight(this)) {
			return f.dot;
		}
	}
	this.sync_lighting_plane_alpha();
	return f.dot;
});

// simple_animal.dm:450
rt.def("/mob/living/simple_animal/proc/OpenCraftingMenu", function* OpenCraftingMenu(f: Frame) {
	if (!this.dextrous) return f.dot;
	yield* this.handcrafting.ui_interact(this);
	return f.dot;
}, true);

// simple_animal.dm:475
rt.def("/mob/living/simple_animal/proc/swap_hand", function swap_hand(f: Frame) {
	let held_item: Value = null, _T: Value = null, H: Value = null;
	if (!this.dextrous) {
		return parent_proc();
	}
	if (!f.args[0]) {
		f.args[0] = this.active_hand_index % rt.len(f, this.held_items) + 1;
	}
	if (held_item = this.get_active_held_item()) {
		if (rt.istype(held_item, T("/obj/item/weapon/twohanded"))) {
			if ((_T = held_item).wielded == 1) {
				to_chat(f.usr, `<span class='warning'>Your other hand is too busy holding the ${_T.name}.</span>`);
				return f.dot;
			}
		}
	}
	let oindex: Value = this.active_hand_index;
	this.active_hand_index = f.args[0];
	if (!this.hud_used) return f.dot;
	if (H = rt.index(this.hud_used.hand_slots, `${f.args[0]}`)) {
		H.update_icon();
	}
	if (!(H = rt.index(this.hud_used.hand_slots, `${oindex}`))) return f.dot;
	H.update_icon();
	return f.dot;
}, false, { args: ["hand_index"] });

// simple_animal.dm:498
rt.def("/mob/living/simple_animal/proc/put_in_hands", function* put_in_hands(f: Frame, I: Value) {
	yield* parent_proc();
	yield* this.update_inv_hands();
	return f.dot;
}, true);

// simple_animal.dm:502
rt.def("/mob/living/simple_animal/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let r_hand: Value = null;
	if (!(this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD)) return f.dot;
	let l_hand: Value = this.get_item_for_held_index(1);
	if (r_hand = this.get_item_for_held_index(2)) {
		r_hand.layer = ABOVE_HUD_LAYER;
		r_hand.plane = ABOVE_HUD_PLANE;
		r_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(r_hand));
		(rt.modField(f, this.client, "screen", r_hand, rt.bitOr));
	}
	if (!l_hand) return f.dot;
	l_hand.layer = ABOVE_HUD_LAYER;
	l_hand.plane = ABOVE_HUD_PLANE;
	l_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(l_hand));
	(rt.modField(f, this.client, "screen", l_hand, rt.bitOr));
	return f.dot;
});

// simple_animal.dm:519
rt.def("/mob/living/simple_animal/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (this.riding_datum) {
		yield* this.riding_datum.restore_position(f.args[0]);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });

// simple_animal.dm:525
rt.def("/mob/living/simple_animal/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value) {
	let A: Value = null;
	if (!this.riding_datum) return f.dot;
	if (user.incapacitated()) {
		return f.dot;
	}
	for (A of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
		if (A != this && A != M && A.density) {
			return f.dot;
		}
	}
	M.loc = rt.getStep(f, this, 0);
	yield* this.riding_datum.handle_vehicle_offsets();
	this.riding_datum.ridden = this;
	return f.dot;
}, true);

// simple_animal.dm:535
rt.def("/mob/living/simple_animal/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	if (!(this.tame && this.riding_datum)) return f.dot;
	yield* this.riding_datum.handle_ride(user, direction);
	return f.dot;
}, true);

// simple_animal.dm:539
rt.def("/mob/living/simple_animal/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.riding_datum) return f.dot;
	yield* this.riding_datum.on_vehicle_move();
	return f.dot;
}, true);

// simple_animal.dm:545
rt.def("/mob/living/simple_animal/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/animal")));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });
