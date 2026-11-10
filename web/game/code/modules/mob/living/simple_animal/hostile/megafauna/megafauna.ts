// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/megafauna.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5021, "/mob/living/simple_animal/hostile/megafauna", "/mob/living/simple_animal/hostile", {
	crusher_loot: null,
	medal_type: "Boss",
	score_type: "Bosses Killed",
	elimination: 0,
	anger_modifier: 0,
	internal: null,
	recovery_time: 0,
	light_range: 3,
	robust_searching: 1,
	ranged_ignores_vision: 1,
	stat_attack: 2,
	aggro_vision_range: 18,
	idle_vision_range: 5,
	anchored: 1,
	name: "boss of this gym",
	desc: "Attack the weak point for massive damage.",
	health: 1000,
	maxHealth: 1000,
	a_intent: "harm",
	sentience_type: 5,
	environment_smash: 3,
	obj_damage: 400,
	faction: null,
	weather_immunities: null,
	movement_type: 2,
	atmos_requirements: null,
	damage_coeff: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	environment_target_typecache: null,
	mob_size: 3,
	layer: 4.4,
	mouse_opacity: 2,
});

// megafauna.dm:20
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("mining", "boss");
	this.weather_immunities = list("lava", "ash");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 0.5, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]);

	this.environment_target_typecache = list(T("/obj/machinery/door/window"), T("/obj/structure/window"), T("/obj/structure/closet"), T("/obj/structure/table"), T("/obj/structure/grille"), T("/obj/structure/girder"), T("/obj/structure/rack"), T("/obj/structure/barricade"), T("/obj/machinery/field"), T("/obj/machinery/power/emitter"));
	return f.dot;
});

// megafauna.dm:50
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	yield* this.apply_status_effect(T("/datum/status_effect/crusher_damage"));
	return f.dot;
}, true);

// megafauna.dm:54
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.internal);
	this.internal = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// megafauna.dm:58
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/death", function* death(f: Frame, gibbed: Value) {
	let C: Value = null;
	if (this.health > 0) {
		return f.dot;
	} else {
		if ((C = this.has_status_effect(T("/datum/status_effect/crusher_damage"))) && this.crusher_loot) {
			if (C.total_damage >= this.maxHealth * 0.6) {
				yield* this.spawn_crusher_loot();
			}
		}
		if (!this.admin_spawned) {
			if (!this.elimination) {
				this.grant_achievement(this.medal_type, this.score_type);
			}
		}
		yield* parent_proc();
	}
	return f.dot;
}, true);

// megafauna.dm:72
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/spawn_crusher_loot", function spawn_crusher_loot(f: Frame) {
	this.loot = this.crusher_loot;
	return f.dot;
});

// megafauna.dm:75
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/gib", function* gib(f: Frame) {
	if (this.health > 0) {
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// megafauna.dm:81
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/dust", function* dust(f: Frame) {
	if (this.health > 0) {
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// megafauna.dm:87
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	if (this.recovery_time >= rt.worldTime(f)) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living")))) return f.dot;
	if ((L = this.target).stat != 2) {
		if (!this.client && this.ranged && this.ranged_cooldown <= rt.worldTime(f)) {
			yield* this.OpenFire();
		}
	} else {
		yield* this.devour(L);
	}
	return f.dot;
}, true);

// megafauna.dm:99
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	let $2: any, $3: any;
	let oldloc: Value = this.loc;
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	let newloc: Value = this.loc;
	let $0: any = this;
	let $1: any = fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this]);
	if (oldloc) {
		$2 = `${`(${oldloc.x},${oldloc.y},${oldloc.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${oldloc.x};Y=${oldloc.y};Z=${oldloc.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	$2 = `${$2}`;
	if (newloc) {
		$3 = `${`(${newloc.x},${newloc.y},${newloc.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${newloc.x};Y=${newloc.y};Z=${newloc.z}'>JMP</a>)`}`;
	} else {
		$3 = "nonexistent location";
	}
	message_admins(`Megafauna ${$0} ${$1} moved via shuttle from ${$2} to ${`${$3}`}`);
	return f.dot;
}, true);

// megafauna.dm:107
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/devour", function* devour(f: Frame, L: Value) {
	if (!L) {
		return f.dot;
	}
	this.visible_message(`<span class='danger'>${this} devours ${L}!</span>`, `<span class='userdanger'>You feast on ${L}, restoring your health!</span>`);
	if (this.z != ZLEVEL_STATION && !this.client) {
		yield* this.adjustBruteLoss(-L.maxHealth / 2);
	}
	yield* L.gib();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// megafauna.dm:117
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		yield* this.adjustBruteLoss(250);
	} else if (severity === 2) {
		yield* this.adjustBruteLoss(100);
	} else if (severity === 3) {
		yield* this.adjustBruteLoss(50);
	}
	return f.dot;
}, true, { waitfor: false });

// megafauna.dm:128
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/SetRecoveryTime", function SetRecoveryTime(f: Frame, buffer_time: Value) {
	this.recovery_time = rt.worldTime(f) + buffer_time;
	return f.dot;
});

// megafauna.dm:131
// The medals and scores it used to award are gone; the return value (1 = counts as a kill) stays: bubblegum's shuttle unlock needs it.
rt.def("/mob/living/simple_animal/hostile/megafauna/proc/grant_achievement", function grant_achievement(f: Frame, medaltype: Value, scoretype: Value) {
	if (this.medal_type == "Boss") {
		return 0;
	}
	if (this.admin_spawned) {
		return 0;
	}
	return 1;
});
