// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/support.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4882, "/mob/living/simple_animal/hostile/guardian/healer", "/mob/living/simple_animal/hostile/guardian", {
	beacon: null,
	beacon_cooldown: 0,
	toggle: 0,
	playstyle_string: "<span class='holoparasite'>As a <b>support</b> type, you may toggle your basic attacks to a healing mode. In addition, Alt-Clicking on an adjacent object or mob will warp them to your bluespace beacon after a short delay.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the CMO, a potent force of life... and death.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught a support carp. It's a kleptocarp!</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Support modules active. Holoparasite swarm online.</span>",
	a_intent: "harm",
	friendly: "heals",
	speed: 0,
	damage_coeff: null,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode"),
});

// support.dm:6
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.7, "fire", 0.7, "tox", 0.7, "clone", 0.7, "stamina", 0, "oxy", 0.7]);
	return f.dot;
});

// support.dm:19
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/Initialize", function* Initialize(f: Frame) {
	let medsensor: Value = null;
	f.dot = (yield* parent_proc());
	(medsensor = rt.index(GLOB.huds, DATA_HUD_MEDICAL_ADVANCED)).add_hud_to(this);
	return f.dot;
}, true);

// support.dm:24
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!(this.beacon_cooldown >= rt.worldTime(f))) return f.dot;
	stat(null, `Beacon Cooldown Remaining: ${max(round((this.beacon_cooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds`);
	return f.dot;
}, true);

// support.dm:30
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.toggle && rt.istype(this.target, T("/mob/living/carbon")))) return f.dot;
	yield* (C = this.target).adjustBruteLoss(-5);
	yield* C.adjustFireLoss(-5);
	yield* C.adjustOxyLoss(-5);
	yield* C.adjustToxLoss(-5);
	let H: Value = (yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, C, 0)));
	if (this.namedatum) {
		H.color = this.namedatum.colour;
	}
	if (C != this.summoner) return f.dot;
	this.update_health_hud();
	yield* this.med_hud_set_health();
	this.med_hud_set_status();
	return f.dot;
}, true);

// support.dm:46
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/ToggleMode", function ToggleMode(f: Frame) {
	if (this.loc == this.summoner) {
		if (this.toggle) {
			this.a_intent = "harm";
			this.speed = 0;
			this.damage_coeff = rt.alist(f, ["brute", 0.7, "fire", 0.7, "tox", 0.7, "clone", 0.7, "stamina", 0, "oxy", 0.7]);
			this.melee_damage_lower = 15;
			this.melee_damage_upper = 15;
			to_chat(this, "<span class='danger'><B>You switch to combat mode.</span></B>");
			this.toggle = 0;
		} else {
			this.a_intent = "help";
			this.speed = 1;
			this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]);
			this.melee_damage_lower = 0;
			this.melee_damage_upper = 0;
			to_chat(this, "<span class='danger'><B>You switch to healing mode.</span></B>");
			this.toggle = 1;
		}
	} else {
		to_chat(this, "<span class='danger'><B>You have to be recalled to toggle modes!</span></B>");
	}
	return f.dot;
});

// support.dm:72
rt.def("/mob/living/simple_animal/hostile/guardian/healer/verb/Beacon", function* Beacon(f: Frame) {
	let beacon_loc: Value = null;
	if (this.beacon_cooldown >= rt.worldTime(f)) {
		to_chat(this, "<span class='danger'><B>Your power is on cooldown. You must wait five minutes between placing beacons.</span></B>");
		return f.dot;
	}
	if (!rt.istype((beacon_loc = rt.getStep(f, this.loc, 0)), T("/turf/open/floor"))) {
		return f.dot;
	}
	if (this.beacon) {
		yield* this.beacon.disappear();
		this.beacon = null;
	}
	this.beacon = (yield* new_(T("/obj/structure/recieving_pad"), beacon_loc, this));
	to_chat(this, "<span class='danger'><B>Beacon placed! You may now warp targets and objects to it, including your user, via Alt+Click.</span></B>");
	this.beacon_cooldown = rt.worldTime(f) + 3000;
	return f.dot;
}, true, { verb: { name: "Place Bluespace Beacon", category: "Guardian", desc: "Mark a floor as your beacon point, allowing you to warp targets to it. Your beacon will not work at extreme distances." } });

rt.type(12966, "/obj/structure/recieving_pad", "/obj/structure", {
	light_range: 1,
	anchored: 1,
	name: "bluespace recieving pad",
	icon: rt.rsc("icons/turf/floors.dmi"),
	desc: "A recieving zone for bluespace teleportations.",
	icon_state: "light_on-w",
	density: 0,
	layer: 2.04,
});

// support.dm:101
rt.def("/obj/structure/recieving_pad/proc/New", function* New(f: Frame, loc: Value, G: Value) {
	f.dot = (yield* parent_proc());
	if (!G.namedatum) return f.dot;
	this.add_atom_colour(G.namedatum.colour, FIXED_COLOUR_PRIORITY);
	return f.dot;
}, true);

// support.dm:106
rt.def("/obj/structure/recieving_pad/proc/disappear", function* disappear(f: Frame) {
	this.visible_message(`${this} vanishes!`);
	yield* qdel(this);
	return f.dot;
}, true);

// support.dm:110
rt.def("/mob/living/simple_animal/hostile/guardian/healer/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	let L: Value = null;
	if (!rt.istype(A, T("/atom/movable"))) {
		return f.dot;
	}
	if (this.loc == this.summoner) {
		to_chat(this, "<span class='danger'><B>You must be manifested to warp a target!</span></B>");
		return f.dot;
	}
	if (!this.beacon) {
		to_chat(this, "<span class='danger'><B>You need a beacon placed to warp things!</span></B>");
		return f.dot;
	}
	if (!this.Adjacent(A)) {
		to_chat(this, "<span class='danger'><B>You must be adjacent to your target!</span></B>");
		return f.dot;
	}
	if (A.anchored) {
		to_chat(this, "<span class='danger'><B>Your target cannot be anchored!</span></B>");
		return f.dot;
	}
	let _T: Value = rt.getStep(f, A, 0);
	if (this.beacon.z != _T.z) {
		to_chat(this, "<span class='danger'><B>The beacon is too far away to warp to!</span></B>");
		return f.dot;
	}
	to_chat(this, `<span class='danger'><B>You begin to warp ${A}.</span></B>`);
	A.visible_message(`<span class='danger'>${A} starts to glow faintly!</span>`, "<span class='userdanger'>You start to faintly glow, and you feel strangely weightless!</span>");
	yield* this.do_attack_animation(A, null, 1);
	if (!(yield* do_mob(this, A, 60))) {
		to_chat(this, "<span class='danger'><B>You need to hold still!</span></B>");
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/guardian/phase/out"), _T);
	if (rt.istype(A, T("/mob/living"))) {
		yield* (L = A).flash_act();
	}
	A.visible_message(`<span class='danger'>${A} disappears in a flash of light!</span>`, "<span class='userdanger'>Your vision is obscured by a flash of light!</span>");
	yield* do_teleport(A, this.beacon, 0);
	yield* new_(T("/obj/effect/temp_visual/guardian/phase"), rt.getStep(f, A, 0));
	return f.dot;
}, true);
