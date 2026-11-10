// Based on /tg/station's code/game/gamemodes/miniantags/morph/morph.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4888, "/mob/living/simple_animal/hostile/morph", "/mob/living/simple_animal/hostile", {
	morphed: 0,
	form: null,
	morph_time: 0,
	playstyle_string: "<b><font size=3 color='red'>You are a morph,</font> an abomination of science created primarily with changeling cells. You may take the form of anything nearby by shift-clicking it. This process will alert any nearby observers, and can only be performed once every five seconds. While morphed, you move faster, but do less damage. In addition, anyone within three tiles will note an uncanny wrongness if examining you. You can attack any item or dead creature to consume it - creatures will fully restore your health. Finally, you can restore yourself to your original form while morphed by shift-clicking yourself.</b>",
	pass_flags: 1,
	name: "morph",
	real_name: "morph",
	desc: "A revolting, pulsating pile of flesh.",
	speak_emote: null,
	emote_hear: null,
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "morph",
	icon_living: "morph",
	icon_dead: "morph_dead",
	speed: 2,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	ventcrawler: 2,
	atmos_requirements: null,
	minbodytemp: 0,
	maxHealth: 150,
	health: 150,
	healable: 0,
	obj_damage: 50,
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	see_in_dark: 8,
	lighting_alpha: 128,
	idle_vision_range: 1,
	wander: 0,
	attacktext: "glomps",
	attack_sound: rt.rsc("sound/effects/blobattack.ogg"),
	butcher_results: null,
}, { global: { blacklist_typecache: 1045 } });

// morph.dm:7
rt.def("/mob/living/simple_animal/hostile/morph/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("gurgles");

	this.emote_hear = list("gurgles");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]);
	return f.dot;
});

// morph.dm:53
rt.def("/mob/living/simple_animal/hostile/morph/proc/examine", function* examine(f: Frame, user: Value) {
	if (this.morphed) {
		yield* this.form.examine(user);
		if (get_dist(user, this) <= 3) {
			to_chat(user, "<span class='warning'>It doesn't look quite right...</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// morph.dm:61
rt.def("/mob/living/simple_animal/hostile/morph/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null;
	if (this.morphed && !rt.istype(this.form, T("/mob/living"))) {
		(holder = rt.at(this.hud_list, "1")).icon_state = null;
		return f.dot;
	}
	parent_proc();
	return f.dot;
});

// morph.dm:68
rt.def("/mob/living/simple_animal/hostile/morph/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null;
	if (this.morphed && !rt.istype(this.form, T("/mob/living"))) {
		(holder = rt.at(this.hud_list, "2")).icon_state = null;
		return f.dot;
	}
	parent_proc();
	return f.dot;
});

// morph.dm:75
rt.def("/mob/living/simple_animal/hostile/morph/proc/allowed", function allowed(f: Frame, A: Value) {
	return ((!is_type_in_typecache(A, GLOB.blacklist_typecache) ? 1 : 0) && ((rt.istype(A, T("/obj")) ? 1 : 0) || ismob(A)));
});

// morph.dm:78
rt.def("/mob/living/simple_animal/hostile/morph/proc/eat", function eat(f: Frame, A: Value) {
	if (A && A.loc != this) {
		this.visible_message(`<span class='warning'>${this} swallows ${A} whole!</span>`);
		A.loc = this;
		return 1;
	}
	return 0;
});

// morph.dm:85
rt.def("/mob/living/simple_animal/hostile/morph/proc/ShiftClickOn", function* ShiftClickOn(f: Frame, A: Value) {
	if (this.morph_time <= rt.worldTime(f) && !this.stat) {
		if (A == this) {
			this.restore();
			return f.dot;
		}
		if (rt.istype(A, T("/atom/movable")) && (yield* this.allowed(A))) {
			this.assume(A);
		}
	} else {
		to_chat(this, "<span class='warning'>Your chameleon skin is still repairing itself!</span>");
		yield* parent_proc();
	}
	return f.dot;
}, true);

// morph.dm:97
rt.def("/mob/living/simple_animal/hostile/morph/proc/assume", function assume(f: Frame, target: Value) {
	this.morphed = 1;
	this.form = target;
	this.visible_message(`<span class='warning'>${this} suddenly twists and changes shape, becoming a copy of ${target}!</span>`, `<span class='notice'>You twist your body and assume the form of ${target}.</span>`);
	this.appearance = target.appearance;
	this.copy_overlays(target);
	this.alpha = max(this.alpha, 150);
	this.transform = rt.initial(f, this, "transform");
	this.pixel_y = rt.initial(f, this, "pixel_y");
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.melee_damage_lower = 5;
	this.melee_damage_upper = 5;
	this.speed = 0;
	this.morph_time = rt.worldTime(f) + MORPH_COOLDOWN;
	this.med_hud_set_health();
	this.med_hud_set_status();
	return f.dot;
});

// morph.dm:119
rt.def("/mob/living/simple_animal/hostile/morph/proc/restore", function restore(f: Frame) {
	if (!this.morphed) {
		return f.dot;
	}
	this.morphed = 0;
	this.form = null;
	this.alpha = rt.initial(f, this, "alpha");
	this.color = rt.initial(f, this, "color");
	this.visible_message(`<span class='warning'>${this} suddenly collapses in on itself, dissolving into a pile of green flesh!</span>`, "<span class='notice'>You reform to your normal body.</span>");
	this.name = rt.initial(f, this, "name");
	this.icon = rt.initial(f, this, "icon");
	this.icon_state = rt.initial(f, this, "icon_state");
	this.cut_overlays();
	this.melee_damage_lower = rt.initial(f, this, "melee_damage_lower");
	this.melee_damage_upper = rt.initial(f, this, "melee_damage_upper");
	this.speed = rt.initial(f, this, "speed");
	this.morph_time = rt.worldTime(f) + MORPH_COOLDOWN;
	this.med_hud_set_health();
	this.med_hud_set_status();
	return f.dot;
});

// morph.dm:144
rt.def("/mob/living/simple_animal/hostile/morph/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.morphed) {
		this.visible_message(`<span class='warning'>${this} twists and dissolves into a pile of green flesh!</span>`, "<span class='userdanger'>Your skin ruptures! Your flesh breaks apart! No disguise can ward off de--</span>");
		this.restore();
	}
	yield* this.barf_contents();
	yield* parent_proc();
	return f.dot;
}, true);

// morph.dm:151
rt.def("/mob/living/simple_animal/hostile/morph/proc/barf_contents", function* barf_contents(f: Frame) {
	let AM: Value = null;
	for (AM of each(this, T("/atom/movable"))) {
		AM.loc = this.loc;
		if (prob(90)) {
			yield* step(AM, pick(GLOB.alldirs));
		}
	}
	return f.dot;
}, true);

// morph.dm:157
rt.def("/mob/living/simple_animal/hostile/morph/proc/wabbajack_act", function* wabbajack_act(f: Frame, new_mob: Value) {
	yield* this.barf_contents();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// morph.dm:161
rt.def("/mob/living/simple_animal/hostile/morph/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	this.restore();
	return f.dot;
}, true);

// morph.dm:165
rt.def("/mob/living/simple_animal/hostile/morph/proc/LoseAggro", function LoseAggro(f: Frame) {
	this.vision_range = this.idle_vision_range;
	return f.dot;
});

// morph.dm:168
rt.def("/mob/living/simple_animal/hostile/morph/proc/AIShouldSleep", function* AIShouldSleep(f: Frame, possible_targets: Value) {
	let A: Value = null, _T: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	let things: Value = list();
	for (A of each(view(this), T("/atom/movable"))) {
		if (yield* this.allowed(A)) {
			things += A;
		}
	}
	this.assume((_T = pick(things)));
	return f.dot;
}, true);

// morph.dm:180
rt.def("/mob/living/simple_animal/hostile/morph/proc/can_track", function can_track(f: Frame, user: Value) {
	if (this.morphed) {
		return 0;
	}
	return parent_proc();
}, false);

// morph.dm:183
rt.def("/mob/living/simple_animal/hostile/morph/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, I: Value = null;
	if (rt.istype(this.target, T("/mob/living"))) {
		if ((L = this.target).stat == 2) {
			if (yield* do_after(this, 30, { target: L })) {
				if (yield* this.eat(L)) {
					yield* this.adjustHealth(-50);
				}
			}
			return f.dot;
		}
	} else if (rt.istype(this.target, T("/obj/item"))) {
		if (!(I = this.target).anchored) {
			if (yield* do_after(this, 20, { target: I })) {
				yield* this.eat(I);
			}
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(275, "/datum/round_event/ghost_role/morph", "/datum/round_event/ghost_role", {
	minimum_required: 1,
	role_name: "morphling",
});

// morph.dm:211
rt.def("/datum/round_event/ghost_role/morph/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, player_mind: Value = null;
	if (!rt.len(f, (candidates = (yield* this.get_candidates("alien", null, "xenomorph"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let selected: Value = pick_n_take(candidates);
	(player_mind = (yield* new_(T("/datum/mind"), selected.key))).active = 1;
	if (!GLOB.xeno_spawn) {
		return MAP_ERROR;
	}
	let S: Value = (yield* new_(T("/mob/living/simple_animal/hostile/morph"), pick(GLOB.xeno_spawn)));
	yield* player_mind.transfer_to(S);
	player_mind.assigned_role = "Morph";
	player_mind.special_role = "Morph";
	(rt.modField(f, GLOB.SSticker.mode, "traitors", player_mind, rt.bitOr));
	to_chat(S, S.playstyle_string);
	rt.op(f, "Output", [], [S, rt.rsc("sound/magic/mutate.ogg")], false);
	message_admins(`${key_name_admin(S)} has been made into a morph by an event.`);
	log_game(`${key_name(S)} was spawned as a morph by an event.`);
	this.spawned_mobs += S;
	return SUCCESSFUL_SPAWN;
}, true);
