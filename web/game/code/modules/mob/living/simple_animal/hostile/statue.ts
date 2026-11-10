// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/statue.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4989, "/mob/living/simple_animal/hostile/statue", "/mob/living/simple_animal/hostile", {
	cannot_be_seen: 1,
	creator: null,
	move_to_delay: 0,
	hud_possible: null,
	vision_range: 12,
	aggro_vision_range: 12,
	idle_vision_range: 12,
	search_objects: 1,
	anchored: 1,
	name: "statue",
	desc: "An incredibly lifelike marble carving. Its eyes seems to follow you..",
	icon: rt.rsc("icons/obj/statue.dmi"),
	icon_state: "human_male",
	icon_living: "human_male",
	icon_dead: "human_male",
	gender: "neuter",
	a_intent: "harm",
	response_help: "touches",
	response_disarm: "pushes",
	speed: -1,
	maxHealth: 50000,
	health: 50000,
	healable: 0,
	harm_intent_damage: 10,
	obj_damage: 100,
	melee_damage_lower: 68,
	melee_damage_upper: 83,
	attacktext: "claws",
	attack_sound: rt.rsc("sound/hallucinations/growl1.ogg"),
	atmos_requirements: null,
	minbodytemp: 0,
	faction: null,
	animate_movement: 0,
	see_in_dark: 13,
	lighting_alpha: 192,
	sight: 60,
	gold_core_spawnable: 1,
});

// statue.dm:35
rt.def("/mob/living/simple_animal/hostile/statue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("15");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("statue");
	return f.dot;
});

// statue.dm:58
rt.def("/mob/living/simple_animal/hostile/statue/proc/Initialize", function* Initialize(f: Frame, mapload: Value, creator: Value) {
	yield* parent_proc();
	this.mob_spell_list += (yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/flicker_lights"), this));
	this.mob_spell_list += (yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/blindness"), this));
	this.mob_spell_list += (yield* new_(T("/obj/effect/proc_holder/spell/targeted/night_vision"), this));
	if (!creator) return f.dot;
	this.creator = creator;
	return f.dot;
}, true);

// statue.dm:75
rt.def("/mob/living/simple_animal/hostile/statue/proc/Move", function* Move(f: Frame, NewLoc: Value) {
	if (this.can_be_seen(NewLoc)) {
		if (this.client) {
			to_chat(this, "<span class='warning'>You cannot move, there are eyes on you!</span>");
		}
		return 0;
	}
	return (yield* parent_proc());
}, true);

// statue.dm:82
rt.def("/mob/living/simple_animal/hostile/statue/proc/Life", function* Life(f: Frame) {
	let watching: Value = null;
	yield* parent_proc();
	if (!(!this.client && this.target)) return f.dot;
	if (!((watching = this.can_be_seen()) && watching != this.target)) return f.dot;
	if (!(get_dist(watching, this) > get_dist(this.target, this))) return f.dot;
	yield* this.LoseTarget();
	yield* this.GiveTarget(watching);
	return f.dot;
}, true, { waitfor: false });

// statue.dm:93
rt.def("/mob/living/simple_animal/hostile/statue/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (this.can_be_seen(rt.getStep(f, this.loc, 0))) {
		if (this.client) {
			to_chat(this, "<span class='warning'>You cannot attack, there are eyes on you!</span>");
		}
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// statue.dm:101
rt.def("/mob/living/simple_animal/hostile/statue/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (this.can_be_seen(rt.getStep(f, this.loc, 0))) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// statue.dm:105
rt.def("/mob/living/simple_animal/hostile/statue/proc/face_atom", function* face_atom(f: Frame) {
	if (this.can_be_seen(rt.getStep(f, this.loc, 0))) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// statue.dm:109
rt.def("/mob/living/simple_animal/hostile/statue/proc/can_be_seen", function can_be_seen(f: Frame, destination: Value) {
	let _T: Value = null, check: Value = null, M: Value = null;
	if (!this.cannot_be_seen) {
		return null;
	}
	if ((_T = rt.getStep(f, this.loc, 0)) && destination && _T.lighting_object) {
		if (_T.get_lumcount() < 0.1 && destination.get_lumcount() < 0.1) {
			return null;
		}
		if (_T == destination) {
			destination = null;
		}
	}
	let check_list: Value = list(this);
	if (destination) {
		check_list += destination;
	}
	for (check of each(check_list, T("/atom"))) {
		M = null;
		for (M of each(viewers(rt.world().view + 1, check) - this, T("/mob/living"))) {
			if (M.client && this.CanAttack(M) && !M.has_unlimited_silicon_privilege) {
				if (!M.eye_blind) {
					return M;
				}
			}
		}
		M = null;
		for (M of each(view(rt.world().view + 1, check), T("/obj/mecha"))) {
			if (M.occupant && M.occupant.client) {
				if (!M.occupant.eye_blind) {
					return M.occupant;
				}
			}
		}
	}
	return null;
});

// statue.dm:144
rt.def("/mob/living/simple_animal/hostile/statue/proc/gib", function* gib(f: Frame) {
	yield* this.dust();
	return f.dot;
}, true);

// statue.dm:150
rt.def("/mob/living/simple_animal/hostile/statue/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let L: Value = null;
	if (rt.istype(the_target, T("/mob/living"))) {
		if (!(L = the_target).client && !L.ckey) {
			return 0;
		}
	}
	return parent_proc();
}, false);

// statue.dm:159
rt.def("/mob/living/simple_animal/hostile/statue/proc/ListTargets", function ListTargets(f: Frame) {
	f.dot = parent_proc();
	return f.dot - this.creator;
});

rt.type(11350, "/obj/effect/proc_holder/spell/aoe_turf/flicker_lights", "/obj/effect/proc_holder/spell/aoe_turf", {
	name: "Flicker Lights",
	desc: "You will trigger a large amount of lights around you to flicker.",
	charge_max: 300,
	clothes_req: 0,
	range: 14,
});

// statue.dm:174
rt.def("/obj/effect/proc_holder/spell/aoe_turf/flicker_lights/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null, L: Value = null;
	user ??= f.usr;
	for (_T of each(targets, T("/turf"))) {
		L = null;
		for (L of each(_T, T("/obj/machinery/light"))) {
			L.flicker();
		}
	}
	return f.dot;
});

rt.type(11351, "/obj/effect/proc_holder/spell/aoe_turf/blindness", "/obj/effect/proc_holder/spell/aoe_turf", {
	name: "Blindness",
	desc: "Your prey will be momentarily blind for you to advance on them.",
	message: "<span class='notice'>You glare your eyes.</span>",
	charge_max: 600,
	clothes_req: 0,
	range: 10,
});

// statue.dm:190
rt.def("/obj/effect/proc_holder/spell/aoe_turf/blindness/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let L: Value = null, _T: Value = null;
	user ??= f.usr;
	for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (rt.isIn(f, ((_T = rt.getStep(f, L.loc, 0)) && _T), targets)) {
			yield* L.blind_eyes(4);
		}
	}
	return f.dot;
}, true);

rt.type(11276, "/obj/effect/proc_holder/spell/targeted/night_vision", "/obj/effect/proc_holder/spell/targeted", {
	name: "Toggle Nightvision [ON]",
	desc: "Toggle your nightvision mode.",
	charge_max: 10,
	clothes_req: 0,
	message: "<span class='notice'>You toggle your night vision!</span>",
	range: -1,
	include_user: 1,
});

// statue.dm:209
rt.def("/obj/effect/proc_holder/spell/targeted/night_vision/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $e: any;
	user ??= f.usr;
	for (target of each(targets, T("/mob/living"))) {
		if (target.lighting_alpha === LIGHTING_PLANE_ALPHA_VISIBLE) {
			target.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE;
			this.name = "Toggle Nightvision [More]";
		} else if (target.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE) {
			target.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE;
			this.name = "Toggle Nightvision [Full]";
		} else if (target.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE) {
			target.lighting_alpha = LIGHTING_PLANE_ALPHA_INVISIBLE;
			this.name = "Toggle Nightvision [OFF]";
		} else {
			target.lighting_alpha = LIGHTING_PLANE_ALPHA_VISIBLE;
			this.name = "Toggle Nightvision [ON]";
		}
		yield* target.update_sight();
	}
	return f.dot;
}, true);

// statue.dm:226
rt.def("/mob/living/simple_animal/hostile/statue/proc/sentience_act", function sentience_act(f: Frame) {
	this.faction -= "neutral";
	return f.dot;
});

// statue.dm:229
rt.def("/mob/living/simple_animal/hostile/statue/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = parent_proc();
	if (!this.can_be_seen(this.loc)) return f.dot;
	return 1;
}, false);
