// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/dragon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5025, "/mob/living/simple_animal/hostile/megafauna/dragon", "/mob/living/simple_animal/hostile/megafauna", {
	swooping: 0,
	swoop_cooldown: 0,
	move_to_delay: 10,
	ranged: 1,
	name: "ash drake",
	desc: "Guardians of the necropolis.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	icon_state: "dragon",
	icon_living: "dragon",
	icon_dead: "dragon_dead",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/64x64megafauna.dmi"),
	speak_emote: null,
	armour_penetration: 40,
	melee_damage_lower: 40,
	melee_damage_upper: 40,
	speed: 1,
	pixel_x: -16,
	crusher_loot: null,
	loot: null,
	butcher_results: null,
	medal_type: "Drake",
	score_type: "Drakes Killed",
	deathmessage: "collapses into a pile of bones, its flesh sloughing away.",
	death_sound: rt.rsc("sound/magic/demon_dies.ogg"),
});

// dragon.dm:46
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("roars");

	this.crusher_loot = list(T("/obj/structure/closet/crate/necropolis/dragon/crusher"));

	this.loot = list(T("/obj/structure/closet/crate/necropolis/dragon"));

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/ore/diamond"), 5, T("/obj/item/stack/sheet/sinew"), 5, T("/obj/item/stack/sheet/animalhide/ashdrake"), 10, T("/obj/item/stack/sheet/bone"), 30]);
	return f.dot;
});

// dragon.dm:65
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/dragon"), this));
	return f.dot;
}, true);

// dragon.dm:69
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	if (severity == 3) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// dragon.dm:74
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2] && rt.bitAnd(this.swooping, SWOOP_INVULNERABLE)) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["amount", "updating_health", "forced"] });

// dragon.dm:79
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/visible_message", function visible_message(f: Frame) {
	if (rt.bitAnd(this.swooping, SWOOP_INVULNERABLE)) {
		return f.dot;
	}
	return parent_proc();
});

// dragon.dm:84
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (this.swooping) return f.dot;
	return (yield* parent_proc());
}, true);

// dragon.dm:88
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (this.swooping) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// dragon.dm:92
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Move", function* Move(f: Frame) {
	if (this.swooping) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// dragon.dm:96
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/Goto", function Goto(f: Frame, target: Value, delay: Value, minimum_distance: Value) {
	if (this.swooping) return f.dot;
	parent_proc();
	return f.dot;
}, false);

// dragon.dm:105
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/OpenFire", function* OpenFire(f: Frame) {
	if (this.swooping) {
		return f.dot;
	}
	this.anger_modifier = max(0, min((this.maxHealth - this.health) / 50, 20));
	this.ranged_cooldown = rt.worldTime(f) + this.ranged_cooldown_time;
	if (prob(15 + this.anger_modifier) && !this.client) {
		if (this.health < this.maxHealth / 2) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack"), 1, null, 50);
		} else {
			yield* this.fire_rain();
		}
	} else if (prob(10 + this.anger_modifier) && !this.client) {
		if (this.health > this.maxHealth / 2) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack"));
		} else {
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/triple_swoop"));
		}
	} else {
		this.fire_walls();
	}
	return f.dot;
}, true);

// dragon.dm:123
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_rain", function* fire_rain(f: Frame) {
	let turf: Value = null;
	if (!this.target) {
		return f.dot;
	}
	this.target.visible_message("<span class='boldwarning'>Fire rains from the sky!</span>");
	for (turf of each(range(9, rt.getStep(f, this.target, 0)), T("/turf"))) {
		if (prob(11)) {
			yield* new_(T("/obj/effect/temp_visual/target"), turf);
		}
	}
	return f.dot;
}, true);

// dragon.dm:131
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_walls", function fire_walls(f: Frame) {
	let d: Value = null;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/fireball.ogg"), 200, 1);
	for (d of each(GLOB.cardinal)) {
		ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_wall"), d);
	}
	return f.dot;
});

// dragon.dm:137
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/fire_wall", function* fire_wall(f: Frame, dir: Value) {
	let J: Value = null, L: Value = null;
	let hit_things: Value = list(this);
	let E: Value = get_edge_target_turf(this, dir);
	let range: Value = 10;
	let previousturf: Value = rt.getStep(f, this, 0);
	for (J of each(getline(this, E), T("/turf"))) {
		if (!range || J != previousturf && (!previousturf.atmos_adjacent_turfs || !rt.index(previousturf.atmos_adjacent_turfs, J))) {
			break;
		}
		range--;
		yield* new_(T("/obj/effect/hotspot"), J);
		yield* J.hotspot_expose(700, 50, 1);
		L = null;
		for (L of each(J.contents - hit_things, T("/mob/living"))) {
			if (rt.istype(L, T("/mob/living/simple_animal/hostile/megafauna/dragon"))) {
				continue;
			}
			yield* L.adjustFireLoss(20);
			to_chat(L, "<span class='userdanger'>You're hit by the drake's fire breath!</span>");
			hit_things += L;
		}
		previousturf = J;
		yield* sleep(1);
	}
	return f.dot;
}, true);

// dragon.dm:157
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/triple_swoop", function* triple_swoop(f: Frame) {
	yield* this.swoop_attack({ swoop_duration: 30 });
	yield* this.swoop_attack({ swoop_duration: 30 });
	yield* this.swoop_attack({ swoop_duration: 30 });
	return f.dot;
}, true);

// dragon.dm:162
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/swoop_attack", function* swoop_attack(f: Frame, fire_rain: Value, manual_target: Value, swoop_duration: Value) {
	let negative: Value = null, i: Value = null, L: Value = null, swoop_speed: Value = null, throw_dir: Value = null, throwtarget: Value = null, M: Value = null;
	let $e: any;
	swoop_duration ??= 40;
	if (this.stat || this.swooping) {
		return f.dot;
	}
	if (manual_target) {
		this.target = manual_target;
	}
	if (!this.target) {
		return f.dot;
	}
	this.swoop_cooldown = rt.worldTime(f) + 200;
	this.stop_automated_movement = 1;
	(rt.modSrcVar(f, "swooping", 1, rt.bitOr));
	this.density = 0;
	this.icon_state = "shadow";
	this.visible_message(`<span class='boldwarning'>${this} swoops up high!</span>`);
	let initial_x: Value = this.x;
	if (this.target.x < initial_x) {
		negative = 1;
	} else if (this.target.x > initial_x) {
		negative = 0;
	} else if (this.target.x == initial_x) {
		negative = prob(50);
	}
	let F: Value = (yield* new_(T("/obj/effect/temp_visual/dragon_flight"), this.loc, negative));
	negative = (!negative ? 1 : 0);
	let oldtransform: Value = this.transform;
	this.alpha = 255;
	rt.op(f, "Animate", [2, 10], [null, this, "alpha", 204, "transform", matrix() * 0.9, "time", 3, "easing", 4]);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* sleep(SWOOP_DAMAGEABLE);
		if (!this || this.gc_destroyed || this.stat == 2) {
			yield* qdel(F);
			(rt.modSrcVar(f, "swooping", 16777214, rt.bitAnd));
			return f.dot;
		}
	}
	rt.endFor(f, 0);
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 100, "transform", matrix() * 0.7, "time", 7]);
	(rt.modSrcVar(f, "swooping", SWOOP_INVULNERABLE, rt.bitOr));
	this.mouse_opacity = 0;
	yield* sleep(7);
	let flame_hit: Value = list();
	while (swoop_duration > 0) {
		if (!this.target && !(yield* this.FindTarget())) {
			break;
		}
		if (swoop_duration < 7) {
			fire_rain = 0;
		}
		if (this.loc == rt.getStep(f, this.target, 0)) {
			if (!fire_rain) {
				break;
			}
			if (rt.istype(this.target, T("/mob/living"))) {
				if ((L = this.target).stat == 2) {
					break;
				}
			}
		}
		if (fire_rain) {
			yield* new_(T("/obj/effect/temp_visual/target"), this.loc, flame_hit);
		}
		yield* this.forceMove(rt.getStep(f, this, rt.getDir(f, this, this.target)));
		if (this.loc == rt.getStep(f, this.target, 0)) {
			if (!fire_rain) {
				break;
			}
			if (rt.istype(this.target, T("/mob/living"))) {
				if ((L = this.target).stat == 2) {
					break;
				}
			}
		}
		swoop_duration -= (swoop_speed = 1.5);
		yield* sleep(swoop_speed);
	}
	if (negative) {
		if (IsInRange(this.x, initial_x + 1, initial_x + DRAKE_SWOOP_DIRECTION_CHANGE_RANGE)) {
			negative = 0;
		}
	} else if (IsInRange(this.x, initial_x - DRAKE_SWOOP_DIRECTION_CHANGE_RANGE, initial_x - 1)) {
		negative = 1;
	}
	yield* new_(T("/obj/effect/temp_visual/dragon_flight/end"), this.loc, negative);
	yield* new_(T("/obj/effect/temp_visual/dragon_swoop"), this.loc);
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 255, "transform", oldtransform, "time", 5]);
	yield* sleep(5);
	(rt.modSrcVar(f, "swooping", 16777213, rt.bitAnd));
	this.mouse_opacity = rt.initial(f, this, "mouse_opacity");
	this.icon_state = "dragon";
	playsound(this.loc, rt.rsc("sound/effects/meteorimpact.ogg"), 200, 1);
	L = null;
	for (L of each(orange(1, this), T("/mob/living"))) {
		if (L.stat) {
			this.visible_message(`<span class='warning'>${this} slams down on ${L}, crushing them!</span>`);
			yield* L.gib();
		} else {
			yield* L.adjustBruteLoss(75);
			if (L && !(!L || L.gc_destroyed)) {
				throw_dir = rt.getDir(f, this, L);
				if (L.loc == this.loc) {
					throw_dir = pick(GLOB.alldirs);
				}
				throwtarget = get_edge_target_turf(this, throw_dir);
				yield* L.throw_at(throwtarget, 3);
				this.visible_message(`<span class='warning'>${L} is thrown clear of ${this}!</span>`);
			}
		}
	}
	for (M of each(range(7, this), T("/mob"))) {
		shake_camera(M, 15, 1);
	}
	this.density = 1;
	yield* sleep(SWOOP_DAMAGEABLE);
	(rt.modSrcVar(f, "swooping", 16777214, rt.bitAnd));
	this.SetRecoveryTime(MEGAFAUNA_DEFAULT_RECOVERY_TIME);
	return f.dot;
}, true, { argTypes: [{  }, { path: "/atom/movable" }, {  }] });

// dragon.dm:265
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	if (!rt.istype(A, T("/atom/movable"))) {
		return f.dot;
	}
	if (this.swoop_cooldown >= rt.worldTime(f)) {
		to_chat(this, "<span class='warning'>You need to wait 20 seconds between swoop attacks!</span>");
		return f.dot;
	}
	yield* this.swoop_attack(1, A, 25);
	return f.dot;
}, true);

rt.type(11687, "/obj/effect/temp_visual/fireball", "/obj/effect/temp_visual", {
	randomdir: 0,
	duration: 9,
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "fireball",
	name: "fireball",
	desc: "Get out of the way!",
	layer: 5,
	pixel_z: 270,
});

// dragon.dm:290
rt.def("/obj/effect/temp_visual/fireball/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	rt.op(f, "Animate", [2, 6], [null, this, "pixel_z", 0, "time", this.duration]);
	return f.dot;
}, true);

rt.type(11688, "/obj/effect/temp_visual/target", "/obj/effect/temp_visual", {
	light_range: 2,
	duration: 9,
	icon: rt.rsc("icons/mob/actions.dmi"),
	icon_state: "sniper_zoom",
	layer: 3.7,
});

// dragon.dm:304
rt.def("/obj/effect/temp_visual/target/proc/Initialize", function* Initialize(f: Frame, mapload: Value, flame_hit: Value) {
	f.dot = (yield* parent_proc());
	yield* ImmediateInvokeAsync(this, P("/obj/effect/temp_visual/target/proc/fall"), flame_hit);
	return f.dot;
}, true);

// dragon.dm:308
rt.def("/obj/effect/temp_visual/target/proc/fall", function* fall(f: Frame, flame_hit: Value) {
	let _T: Value = null, M: Value = null, L: Value = null;
	playsound((_T = rt.getStep(f, this, 0)), rt.rsc("sound/magic/fleshtostone.ogg"), 80, 1);
	yield* new_(T("/obj/effect/temp_visual/fireball"), _T);
	yield* sleep(this.duration);
	if (rt.istype(_T, T("/turf/closed/mineral"))) {
		yield* (M = _T).gets_drilled();
	}
	playsound(_T, "explosion", 80, 1);
	yield* new_(T("/obj/effect/hotspot"), _T);
	yield* _T.hotspot_expose(700, 50, 1);
	for (L of each(_T.contents, T("/mob/living"))) {
		if (rt.istype(L, T("/mob/living/simple_animal/hostile/megafauna/dragon"))) {
			continue;
		}
		if (rt.istype(flame_hit, T("/list")) && !rt.index(flame_hit, L)) {
			yield* L.adjustFireLoss(40);
			to_chat(L, "<span class='userdanger'>You're hit by the drake's fire breath!</span>");
			rt.setAt(flame_hit, L, 1);
		} else {
			yield* L.adjustFireLoss(10);
		}
	}
	return f.dot;
}, true, { argTypes: [{ path: "/list" }] });

rt.type(11689, "/obj/effect/temp_visual/dragon_flight", "/obj/effect/temp_visual", {
	duration: 10,
	randomdir: 0,
	icon: rt.rsc("icons/mob/lavaland/64x64megafauna.dmi"),
	icon_state: "dragon",
	layer: 4.5,
	pixel_x: -16,
});

// dragon.dm:348
rt.def("/obj/effect/temp_visual/dragon_flight/proc/Initialize", function* Initialize(f: Frame, mapload: Value, negative: Value) {
	f.dot = (yield* parent_proc());
	yield* ImmediateInvokeAsync(this, P("/obj/effect/temp_visual/dragon_flight/proc/flight"), negative);
	return f.dot;
}, true);

// dragon.dm:353
rt.def("/obj/effect/temp_visual/dragon_flight/proc/flight", function* flight(f: Frame, negative: Value) {
	if (negative) {
		rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", -27, "pixel_z", 40.5, "time", 3, "easing", 4]);
	} else {
		rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", 27, "pixel_z", 40.5, "time", 3, "easing", 4]);
	}
	yield* sleep(3);
	this.icon_state = "swoop";
	if (negative) {
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", -270, "pixel_z", 270, "time", 7]);
	} else {
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", 270, "pixel_z", 270, "time", 7]);
	}
	return f.dot;
}, true);

rt.type(11690, "/obj/effect/temp_visual/dragon_flight/end", "/obj/effect/temp_visual/dragon_flight", {
	duration: 5,
	pixel_x: 270,
	pixel_z: 270,
});

// dragon.dm:371
rt.def("/obj/effect/temp_visual/dragon_flight/end/proc/flight", function flight(f: Frame, negative: Value) {
	if (negative) {
		this.pixel_x = -270;
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", -16, "pixel_z", 0, "time", 5]);
	} else {
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", -16, "pixel_z", 0, "time", 5]);
	}
	return f.dot;
});

rt.type(5026, "/mob/living/simple_animal/hostile/megafauna/dragon/lesser", "/mob/living/simple_animal/hostile/megafauna/dragon", {
	name: "lesser ash drake",
	maxHealth: 200,
	health: 200,
	faction: null,
	obj_damage: 80,
	melee_damage_upper: 30,
	melee_damage_lower: 30,
	damage_coeff: null,
	loot: null,
});

// dragon.dm:379
rt.def("/mob/living/simple_animal/hostile/megafauna/dragon/lesser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("neutral");
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]);

	this.loot = list();
	return f.dot;
});
