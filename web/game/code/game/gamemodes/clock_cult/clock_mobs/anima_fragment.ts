// Based on /tg/station's code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4862, "/mob/living/simple_animal/hostile/clockwork/fragment", "/mob/living/simple_animal/hostile/clockwork", {
	movement_delay_time: null,
	light_range: 2,
	light_power: 0.8,
	playstyle_string: "<span class='heavy_brass'>You are an anima fragment</span><b>, a clockwork creation of Ratvar. As a fragment, you have decent health that very gradually regenerates, do decent damage, and move at extreme speed in addition to being immune to extreme temperatures and pressures. Taking damage, and slamming into non-Servants, will temporarily slow you down, however.\nYour goal is to serve the Justiciar and his servants in any way you can. You yourself are one of these servants, and will be able to utilize anything they can, assuming it doesn't require opposable thumbs.</b>",
	name: "anima fragment",
	desc: "An ominous humanoid shell with a spinning cogwheel as its head, lifted by a jet of blazing red flame.",
	icon_state: "anime_fragment",
	health: 90,
	maxHealth: 90,
	speed: -1,
	melee_damage_lower: 18,
	melee_damage_upper: 18,
	attacktext: "crushes",
	attack_sound: rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"),
	loot: null,
	weather_immunities: null,
	movement_type: 2,
});

// anima_fragment.dm:13
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = list(T("/obj/item/clockwork/component/replicant_alloy/smashed_anima_fragment"));

	this.weather_immunities = list("lava");
	return f.dot;
});

// anima_fragment.dm:25
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!prob(1)) return f.dot;
	this.name = "anime fragment";
	this.desc = "I-it's not like I want to show you the light of the Justiciar or anything, B-BAKA!";
	return f.dot;
}, true);

// anima_fragment.dm:31
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (GLOB.ratvar_awakens) {
		yield* this.adjustHealth(-5);
	} else if (this.movement_delay_time > rt.worldTime(f)) {
		yield* this.adjustHealth(-0.2);
	} else {
		yield* this.adjustHealth(-1);
	}
	return f.dot;
}, true, { waitfor: false });

// anima_fragment.dm:40
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!(statpanel("Status") && this.movement_delay_time > rt.worldTime(f) && !GLOB.ratvar_awakens)) return f.dot;
	stat(null, `Movement delay(seconds): ${max(round((this.movement_delay_time - rt.worldTime(f)) * 0.1, 0.1), 0)}`);
	return f.dot;
}, true);

// anima_fragment.dm:45
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/death", function* death(f: Frame, gibbed: Value) {
	this.visible_message(`<span class='warning'>${this}'s flame jets cut out as it falls to the floor with a tremendous crash.</span>`, "<span class='userdanger'>Your gears seize up. Your flame jets flicker out. Your soul vessel belches smoke as you helplessly crash down.</span>");
	yield* parent_proc();
	return f.dot;
}, true);

// anima_fragment.dm:53
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Bump", function* Bump(f: Frame, AM: Value) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.movement_delay_time <= rt.worldTime(f) && this.next_move <= rt.worldTime(f) && rt.istype(AM, T("/mob/living")) && !is_servant_of_ratvar(AM))) return f.dot;
	if ((L = AM).stat) {
		return f.dot;
	}
	let previousattacktext: Value = this.attacktext;
	this.attacktext = "slams into";
	yield* this.UnarmedAttack(L);
	this.attacktext = previousattacktext;
	this.changeNext_move(8);
	if (GLOB.ratvar_awakens) return f.dot;
	yield* this.adjustHealth(4);
	this.adjust_movement_delay(10);
	return f.dot;
}, true);

// anima_fragment.dm:68
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	this.adjust_movement_delay(50 / severity);
	return f.dot;
});

// anima_fragment.dm:71
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	if (!(this.movement_delay_time > rt.worldTime(f) && !GLOB.ratvar_awakens)) return f.dot;
	f.dot += min((this.movement_delay_time - rt.worldTime(f)) * 0.1, 10);
	return f.dot;
});

// anima_fragment.dm:76
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value) {
	f.dot = (yield* parent_proc());
	if (!(amount > 0)) return f.dot;
	this.adjust_movement_delay(amount * 2.5);
	return f.dot;
}, true);

// anima_fragment.dm:82
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/adjust_movement_delay", function adjust_movement_delay(f: Frame, amount: Value) {
	if (GLOB.ratvar_awakens) {
		this.movement_delay_time = 0;
	} else if (this.movement_delay_time > rt.worldTime(f)) {
		this.movement_delay_time = this.movement_delay_time + amount;
	} else {
		this.movement_delay_time = rt.worldTime(f) + amount;
	}
	return f.dot;
});

// anima_fragment.dm:89
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* parent_proc();
	if (this.health == this.maxHealth) {
		this.speed = rt.initial(f, this, "speed");
	} else {
		this.speed = 0;
	}
	return f.dot;
}, true);
