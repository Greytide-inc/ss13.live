// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mining_mobs/mining_mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4998, "/mob/living/simple_animal/hostile/asteroid", "/mob/living/simple_animal/hostile", {
	crusher_loot: null,
	throw_message: "bounces off of",
	icon_aggro: null,
	fromtendril: 0,
	vision_range: 2,
	atmos_requirements: null,
	faction: null,
	weather_immunities: null,
	obj_damage: 30,
	environment_smash: 2,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "strikes",
	status_flags: 0,
	a_intent: "harm",
	see_in_dark: 8,
	lighting_alpha: 128,
	mob_size: 3,
});

// mining_mobs.dm:4
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("mining");
	this.weather_immunities = list("lava", "ash");
	return f.dot;
});

// mining_mobs.dm:25
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	yield* this.apply_status_effect(T("/datum/status_effect/crusher_damage"));
	return f.dot;
}, true);

// mining_mobs.dm:29
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	if (this.vision_range == this.aggro_vision_range) return f.dot;
	this.icon_state = this.icon_aggro;
	return f.dot;
}, true);

// mining_mobs.dm:34
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/LoseAggro", function LoseAggro(f: Frame) {
	parent_proc();
	if (this.stat == 2) {
		return f.dot;
	}
	this.icon_state = this.icon_living;
	return f.dot;
});

// mining_mobs.dm:40
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/bullet_act", function* bullet_act(f: Frame, P: Value) {
	if (!this.stat) {
		yield* this.Aggro();
	}
	if (P.damage < 30 && P.damage_type != "brute") {
		P.damage = P.damage / 3;
		this.visible_message(`<span class='danger'>${P} has a reduced effect on ${this}!</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mining_mobs.dm:48
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/hitby", function* hitby(f: Frame, AM: Value) {
	let _T: Value = null;
	if (rt.istype(AM, T("/obj/item"))) {
		_T = AM;
		if (!this.stat) {
			yield* this.Aggro();
		}
		if (_T.throwforce <= 20) {
			this.visible_message(`<span class='notice'>The ${_T.name} ${this.throw_message} ${this.name}!</span>`);
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mining_mobs.dm:58
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/death", function* death(f: Frame, gibbed: Value) {
	let C: Value = null;
	if ((C = this.has_status_effect(T("/datum/status_effect/crusher_damage"))) && this.crusher_loot && prob(C.total_damage / this.maxHealth) * 5) {
		yield* this.spawn_crusher_loot();
	}
	yield* parent_proc(gibbed);
	return f.dot;
}, true);

// mining_mobs.dm:68
rt.def("/mob/living/simple_animal/hostile/asteroid/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (this.bodytemperature < this.minbodytemp) {
		yield* this.adjustBruteLoss(2);
	} else {
		if (!(this.bodytemperature > this.maxbodytemp)) return f.dot;
		yield* this.adjustBruteLoss(20);
	}
	return f.dot;
}, true);
