// Based on /tg/station's code/game/gamemodes/devil/imp/imp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5046, "/mob/living/simple_animal/imp", "/mob/living/simple_animal", {
	boost: 0,
	consumed_mobs: null,
	playstyle_string: "<B><font size=3 color='red'>You are an imp,</font> a mischevious creature from hell. You are the lowest rank on the hellish totem pole  Though you are not obligated to help, perhaps by aiding a higher ranking devil, you might just get a promotion.  However, you are incapable\tof intentionally harming a fellow devil.</B>",
	name: "imp",
	real_name: "imp",
	desc: "A large, menacing creature covered in armored black scales.",
	speak_emote: null,
	emote_hear: null,
	response_help: "thinks better of touching",
	response_disarm: "flails at",
	response_harm: "punches",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "imp",
	icon_living: "imp",
	speed: 1,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	atmos_requirements: null,
	minbodytemp: 250,
	maxbodytemp: 1e+31,
	faction: null,
	attacktext: "wildly tears into",
	maxHealth: 200,
	health: 200,
	healable: 0,
	environment_smash: 1,
	obj_damage: 40,
	melee_damage_lower: 10,
	melee_damage_upper: 15,
	see_in_dark: 8,
	lighting_alpha: 128,
	bloodcrawl: 2,
});

// imp.dm:36
rt.def("/mob/living/simple_animal/imp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.consumed_mobs = list();

	this.speak_emote = list("cackles");
	this.emote_hear = list("cackles", "screeches");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("hell");
	return f.dot;
});

// imp.dm:42
rt.def("/mob/living/simple_animal/imp/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.boost = rt.worldTime(f) + 30;
	return f.dot;
}, true);

// imp.dm:46
rt.def("/mob/living/simple_animal/imp/proc/Life", function Life(f: Frame) {
	parent_proc();
	if (this.boost < rt.worldTime(f)) {
		this.speed = 1;
	} else {
		this.speed = 0;
	}
	return f.dot;
}, false, { waitfor: false });

// imp.dm:53
rt.def("/mob/living/simple_animal/imp/proc/death", function* death(f: Frame) {
	yield* parent_proc(1);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/demon_dies.ogg"), 200, 1);
	this.visible_message(`<span class='danger'>${this} screams in agony as it sublimates into a sulfurous smoke.</span>`);
	yield* this.ghostize();
	yield* qdel(this);
	return f.dot;
}, true);
