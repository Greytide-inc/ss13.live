// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/protector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4879, "/mob/living/simple_animal/hostile/guardian/protector", "/mob/living/simple_animal/hostile/guardian", {
	toggle: 0,
	range: 15,
	playstyle_string: "<span class='holoparasite'>As a <b>protector</b> type you cause your summoner to leash to you instead of you leashing to them and have two modes; Combat Mode, where you do and take medium damage, and Protection Mode, where you do and take almost no damage, but move slightly slower.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Guardian, a stalwart protector that never leaves the side of its charge.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Protector modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! You caught one! Wait, no... it caught you! The fisher has become the fishy.</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	damage_coeff: null,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode"),
});

// protector.dm:6
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.4, "fire", 0.4, "tox", 0.4, "clone", 0.4, "stamina", 0, "oxy", 0.4]);
	return f.dot;
});

// protector.dm:15
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	if (severity == 1) {
		yield* this.adjustBruteLoss(400);
	} else {
		yield* parent_proc();
	}
	if (!this.toggle) return f.dot;
	this.visible_message(`<span class='danger'>The explosion glances off ${this}'s energy shielding!</span>`);
	return f.dot;
}, true, { waitfor: false });

// protector.dm:23
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot > 0 && this.toggle)) return f.dot;
	let I: Value = (yield* new_(T("/image"), rt.rsc("icons/effects/effects.dmi"), this, "shield-flash", 4.01, { dir: pick(GLOB.cardinal) }));
	if (this.namedatum) {
		I.color = this.namedatum.colour;
	}
	yield* flick_overlay_view(I, this, 5);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// protector.dm:31
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/ToggleMode", function ToggleMode(f: Frame) {
	let shield_overlay: Value = null;
	if (this.cooldown > rt.worldTime(f)) {
		return 0;
	}
	this.cooldown = rt.worldTime(f) + 10;
	if (this.toggle) {
		this.cut_overlays();
		this.melee_damage_lower = rt.initial(f, this, "melee_damage_lower");
		this.melee_damage_upper = rt.initial(f, this, "melee_damage_upper");
		this.speed = rt.initial(f, this, "speed");
		this.damage_coeff = rt.alist(f, ["brute", 0.4, "fire", 0.4, "tox", 0.4, "clone", 0.4, "stamina", 0, "oxy", 0.4]);
		to_chat(this, "<span class='danger'><B>You switch to combat mode.</span></B>");
		this.toggle = 0;
	} else {
		shield_overlay = mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "shield-grey");
		if (this.namedatum) {
			shield_overlay.color = this.namedatum.colour;
		}
		this.add_overlay(shield_overlay);
		this.melee_damage_lower = 2;
		this.melee_damage_upper = 2;
		this.speed = 1;
		this.damage_coeff = rt.alist(f, ["brute", 0.05, "fire", 0.05, "tox", 0.05, "clone", 0.05, "stamina", 0, "oxy", 0.05]);
		to_chat(this, "<span class='danger'><B>You switch to protection mode.</span></B>");
		this.toggle = 1;
	}
	return f.dot;
});

// protector.dm:56
rt.def("/mob/living/simple_animal/hostile/guardian/protector/proc/snapback", function* snapback(f: Frame) {
	if (!this.summoner) return f.dot;
	if (get_dist(rt.getStep(f, this.summoner, 0), rt.getStep(f, this, 0)) <= this.range) {
		return f.dot;
	} else if (rt.istype(this.summoner.loc, T("/obj/effect"))) {
		to_chat(this, `<span class='holoparasite'>You moved out of range, and were pulled back! You can only move ${this.range} meters from ${this.summoner.real_name}!</span>`);
		this.visible_message(fmt("<span class='danger'>＄！ jumps back to its user.</span>", [this]));
		yield* this.Recall(1);
	} else {
		to_chat(this.summoner, `<span class='holoparasite'>You moved out of range, and were pulled back! You can only move ${this.range} meters from <font color="${this.namedatum.colour}"><b>${this.real_name}</b></font>!</span>`);
		this.summoner.visible_message(fmt("<span class='danger'>＄！ jumps back to ＀ protector.</span>", [this.summoner, this.summoner.p_their()]));
		yield* new_(T("/obj/effect/temp_visual/guardian/phase/out"), rt.getStep(f, this.summoner, 0));
		yield* this.summoner.forceMove(rt.getStep(f, this, 0));
		yield* new_(T("/obj/effect/temp_visual/guardian/phase"), rt.getStep(f, this.summoner, 0));
	}
	return f.dot;
}, true);
