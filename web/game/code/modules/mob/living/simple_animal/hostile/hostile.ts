// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/hostile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4854, "/mob/living/simple_animal/hostile", "/mob/living/simple_animal", {
	target: null,
	ranged: 0,
	rapid: 0,
	projectiletype: null,
	projectilesound: null,
	casingtype: null,
	move_to_delay: 3,
	friends: null,
	emote_taunt: null,
	taunt_chance: 0,
	ranged_message: "fires",
	ranged_cooldown: 0,
	ranged_cooldown_time: 30,
	ranged_ignores_vision: 0,
	check_friendly_fire: 0,
	retreat_distance: null,
	minimum_distance: 1,
	robust_searching: 0,
	vision_range: 9,
	aggro_vision_range: 9,
	idle_vision_range: 9,
	search_objects: 0,
	search_objects_timer_id: null,
	search_objects_regain_time: 30,
	wanted_objects: null,
	stat_attack: 0,
	stat_exclusive: 0,
	attack_same: 0,
	AIStatus: 1,
	targets_from: null,
	attack_all_objects: 0,
	lose_patience_timer_id: null,
	lose_patience_timeout: 300,
	environment_target_typecache: null,
	faction: null,
	stop_automated_movement_when_pulled: 0,
	obj_damage: 40,
	environment_smash: 1,
});

// hostile.dm:13
rt.def("/mob/living/simple_animal/hostile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.friends = list();

	this.emote_taunt = list();

	this.wanted_objects = list();

	this.faction = list("hostile");

	this.environment_target_typecache = list(T("/obj/machinery/door/window"), T("/obj/structure/window"), T("/obj/structure/closet"), T("/obj/structure/table"), T("/obj/structure/grille"), T("/obj/structure/girder"), T("/obj/structure/rack"), T("/obj/structure/barricade"));
	return f.dot;
});

// hostile.dm:58
rt.def("/mob/living/simple_animal/hostile/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.targets_from) {
		this.targets_from = f.src;
	}
	this.environment_target_typecache = typecacheof(this.environment_target_typecache);
	this.wanted_objects = typecacheof(this.wanted_objects);
	if (is_creative()) creative_fight_setup(this); // tg_js: Creative's mob fight mode (modules/creative/creative.ts)
	return f.dot;
}, true);

// hostile.dm:68
rt.def("/mob/living/simple_animal/hostile/proc/Destroy", function* Destroy(f: Frame) {
	this.targets_from = null;
	return (yield* parent_proc());
}, true);

// hostile.dm:71
rt.def("/mob/living/simple_animal/hostile/proc/Life", function Life(f: Frame) {
	f.dot = parent_proc();
	if (f.dot) return f.dot;
	walk(this, 0);
	return 0;
}, false, { waitfor: false });

// hostile.dm:77
rt.def("/mob/living/simple_animal/hostile/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	if (this.AIStatus == AI_OFF) {
		return 0;
	}
	let possible_targets: Value = this.ListTargets();
	if (this.environment_smash) {
		yield* this.EscapeConfinement();
	}
	if (yield* this.AICanContinue(possible_targets)) {
		yield* this.DestroySurroundings();
		if (!(yield* this.MoveToTarget(possible_targets))) {
			if (yield* this.AIShouldSleep(possible_targets)) {
				this.AIStatus = AI_IDLE;
			}
		}
	}
	return 1;
}, true, { waitfor: false });

// hostile.dm:92
rt.def("/mob/living/simple_animal/hostile/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	if (this.stat == 0 && !this.target && this.AIStatus != AI_OFF && !this.client && user) {
		yield* this.FindTarget(list(user), 1);
	}
	return (yield* parent_proc());
}, true);

// hostile.dm:97
rt.def("/mob/living/simple_animal/hostile/proc/bullet_act", function* bullet_act(f: Frame) {
	if (this.stat == 0 && !this.target && this.AIStatus != AI_OFF && !this.client) {
		if (f.args[0].firer && get_dist(this, f.args[0].firer) <= this.aggro_vision_range) {
			yield* this.FindTarget(list(f.args[0].firer), 1);
		}
		this.Goto(f.args[0].starting, this.move_to_delay, 3);
	}
	return (yield* parent_proc());
}, true, { args: ["P"] });

// hostile.dm:106
rt.def("/mob/living/simple_animal/hostile/proc/ListTargets", function ListTargets(f: Frame) {
	let HM: Value = null;
	if (!this.search_objects) {
		f.dot = hearers(this.vision_range, this.targets_from) - this;
		for (HM of each(typecache_filter_range(this.vision_range, this.targets_from, GLOB.hostile_machines))) {
			if (can_see(this.targets_from, HM, this.vision_range)) {
				f.dot += HM;
			}
		}
	} else {
		f.dot = oview(this.vision_range, this.targets_from);
	}
	return f.dot;
});

// hostile.dm:118
rt.def("/mob/living/simple_animal/hostile/proc/FindTarget", function* FindTarget(f: Frame, possible_targets: Value, HasTargetsList: Value) {
	let pos_targ: Value = null, A: Value = null, Target: Value = null;
	HasTargetsList ??= 0;
	f.dot = list();
	if (!HasTargetsList) {
		possible_targets = this.ListTargets();
	}
	for (pos_targ of each(possible_targets)) {
		if (this.Found((A = pos_targ))) {
			f.dot = list(A);
			break;
		}
		if (this.CanAttack(A)) {
			f.dot += A;
			continue;
		}
	}
	yield* this.GiveTarget((Target = this.PickTarget(f.dot)));
	return Target;
}, true);

// hostile.dm:136
rt.def("/mob/living/simple_animal/hostile/proc/PossibleThreats", function PossibleThreats(f: Frame) {
	let pos_targ: Value = null, A: Value = null;
	f.dot = list();
	for (pos_targ of each(this.ListTargets())) {
		if (this.Found((A = pos_targ))) {
			f.dot = list(A);
			break;
		}
		if (this.CanAttack(A)) {
			f.dot += A;
			continue;
		}
	}
	return f.dot;
});

// hostile.dm:152
rt.def("/mob/living/simple_animal/hostile/proc/PickTarget", function PickTarget(f: Frame, Targets: Value) {
	let pos_targ: Value = null, A: Value = null, target_dist: Value = null, possible_target_distance: Value = null, chosen_target: Value = null;
	if (this.target !== null) {
		for (pos_targ of each(Targets)) {
			A = pos_targ;
			target_dist = get_dist(this.targets_from, this.target);
			possible_target_distance = get_dist(this.targets_from, A);
			if (target_dist < possible_target_distance) {
				Targets -= A;
			}
		}
	}
	if (!rt.len(f, Targets)) {
		return f.dot;
	}
	return (chosen_target = pick(Targets));
});

// hostile.dm:165
rt.def("/mob/living/simple_animal/hostile/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let L: Value = null, faction_check: Value = null, M: Value = null, _P: Value = null, OW: Value = null;
	if (!the_target) {
		return 0;
	}
	if (this.see_invisible < the_target.invisibility) {
		return 0;
	}
	if (this.search_objects < 2) {
		if (rt.istype(the_target, T("/mob/living"))) {
			L = the_target;
			faction_check = this.faction_check_mob(L);
			if (this.robust_searching) {
				if (L.stat > this.stat_attack || L.stat != this.stat_attack && this.stat_exclusive == 1) {
					return 0;
				}
				if (faction_check && !this.attack_same || !faction_check && this.attack_same == 2) {
					return 0;
				}
				if (rt.isIn(f, L, this.friends)) {
					return 0;
				}
			} else {
				if (L.stat) {
					return 0;
				}
				if (faction_check && !this.attack_same) {
					return 0;
				}
			}
			return 1;
		}
		if (rt.istype(the_target, T("/obj/mecha"))) {
			if ((M = the_target).occupant) {
				if (this.CanAttack(M.occupant)) {
					return 1;
				}
			}
		}
		if (rt.istype(the_target, T("/obj/machinery/porta_turret"))) {
			if (rt.isIn(f, (_P = the_target).faction, this.faction)) {
				return 0;
			}
			if (_P.has_cover && !_P.raised) {
				return 0;
			}
			if (rt.bitAnd(_P.stat, 1)) {
				return 0;
			}
			return 1;
		}
		if (rt.istype(the_target, T("/obj/structure/destructible/clockwork/ocular_warden"))) {
			if ((OW = the_target).target != this) {
				return 0;
			}
			return 1;
		}
	}
	if (rt.istype(the_target, T("/obj"))) {
		if (this.attack_all_objects || is_type_in_typecache(the_target, this.wanted_objects)) {
			return 1;
		}
	}
	return 0;
});

// hostile.dm:216
rt.def("/mob/living/simple_animal/hostile/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	this.target = new_target;
	yield* this.LosePatience();
	if (this.target === null) return f.dot;
	yield* this.GainPatience();
	yield* this.Aggro();
	return 1;
}, true);

// hostile.dm:225
rt.def("/mob/living/simple_animal/hostile/proc/MoveToTarget", function* MoveToTarget(f: Frame, possible_targets: Value) {
	let target_distance: Value = null;
	this.stop_automated_movement = 1;
	if (!this.target || !this.CanAttack(this.target)) {
		yield* this.LoseTarget();
		return 0;
	}
	if (rt.isIn(f, this.target, possible_targets)) {
		if (this.target.z != this.z) {
			yield* this.LoseTarget();
			return 0;
		}
		target_distance = get_dist(this.targets_from, this.target);
		if (this.ranged) {
			if (!this.target.Adjacent(this.targets_from) && this.ranged_cooldown <= rt.worldTime(f)) {
				yield* this.OpenFire(this.target);
			}
		}
		if (!(yield* this.Process_Spacemove())) {
			walk(this, 0);
			return 1;
		}
		if (this.retreat_distance !== null) {
			if (target_distance <= this.retreat_distance) {
				walk_away(this, this.target, this.retreat_distance, this.move_to_delay);
			} else {
				this.Goto(this.target, this.move_to_delay, this.minimum_distance);
			}
		} else {
			this.Goto(this.target, this.move_to_delay, this.minimum_distance);
		}
		if (this.target) {
			if (this.targets_from && isturf(this.targets_from.loc) && this.target.Adjacent(this.targets_from)) {
				yield* this.AttackingTarget();
				yield* this.GainPatience();
			}
			return 1;
		}
		return 0;
	}
	if (this.environment_smash) {
		if (this.target.loc !== null && get_dist(this.targets_from, this.target.loc) <= this.vision_range) {
			if (this.ranged_ignores_vision && this.ranged_cooldown <= rt.worldTime(f)) {
				yield* this.OpenFire(this.target);
			}
			if (this.environment_smash >= 2) {
				this.Goto(this.target, this.move_to_delay, this.minimum_distance);
				yield* this.FindHidden();
				return 1;
			} else if (yield* this.FindHidden()) {
				return 1;
			}
		}
	}
	yield* this.LoseTarget();
	return 0;
}, true);

// hostile.dm:267
rt.def("/mob/living/simple_animal/hostile/proc/Goto", function Goto(f: Frame, target: Value, delay: Value, minimum_distance: Value) {
	walk_to(this, target, minimum_distance, delay);
	return f.dot;
});

// hostile.dm:270
rt.def("/mob/living/simple_animal/hostile/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(!this.ckey && !this.stat && this.search_objects < 3 && f.dot > 0)) return f.dot;
	if (this.search_objects) {
		this.target = null;
		yield* this.LoseSearchObjects();
	}
	if (this.AIStatus == AI_IDLE) {
		this.AIStatus = AI_ON;
		yield* this.FindTarget();
	} else {
		if (!(this.target !== null && prob(40))) return f.dot;
		yield* this.FindTarget();
	}
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// hostile.dm:283
rt.def("/mob/living/simple_animal/hostile/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	return (yield* this.target.attack_animal(this));
}, true);

// hostile.dm:286
rt.def("/mob/living/simple_animal/hostile/proc/Aggro", function* Aggro(f: Frame) {
	this.vision_range = this.aggro_vision_range;
	if (!(this.target && rt.len(f, this.emote_taunt) && prob(this.taunt_chance))) return f.dot;
	yield* this.emote("me", 1, `${pick(this.emote_taunt)} at ${this.target}.`);
	this.taunt_chance = max(this.taunt_chance - 7, 2);
	return f.dot;
}, true);

// hostile.dm:294
rt.def("/mob/living/simple_animal/hostile/proc/LoseAggro", function LoseAggro(f: Frame) {
	this.stop_automated_movement = 0;
	this.vision_range = this.idle_vision_range;
	this.taunt_chance = rt.initial(f, this, "taunt_chance");
	return f.dot;
});

// hostile.dm:299
rt.def("/mob/living/simple_animal/hostile/proc/LoseTarget", function LoseTarget(f: Frame) {
	this.target = null;
	walk(this, 0);
	this.LoseAggro();
	return f.dot;
});

// hostile.dm:305
rt.def("/mob/living/simple_animal/hostile/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* this.LoseTarget();
	yield* parent_proc(gibbed);
	return f.dot;
}, true);

// hostile.dm:309
rt.def("/mob/living/simple_animal/hostile/proc/summon_backup", function* summon_backup(f: Frame, distance: Value, exact_faction_match: Value) {
	let M: Value = null;
	yield* this.do_alert_animation(this);
	playsound(this.loc, rt.rsc("sound/machines/chime.ogg"), 50, 1, -1);
	for (M of each(oview(distance, this.targets_from), T("/mob/living/simple_animal/hostile"))) {
		if (this.faction_check_mob(M, 1)) {
			if (M.AIStatus == AI_OFF) {
				return f.dot;
			} else {
				M.Goto(this, M.move_to_delay, M.minimum_distance);
			}
		}
	}
	return f.dot;
}, true);

// hostile.dm:320
rt.def("/mob/living/simple_animal/hostile/proc/OpenFire", function* OpenFire(f: Frame, A: Value) {
	let _T: Value = null, L: Value = null, cb: Value = null;
	if (this.check_friendly_fire) {
		for (_T of each(getline(this, A), T("/turf"))) {
			L = null;
			for (L of each(_T, T("/mob/living"))) {
				if (L == this || L == A) {
					continue;
				}
				if (this.faction_check_mob(L) && !this.attack_same) {
					return f.dot;
				}
			}
		}
	}
	this.visible_message(`<span class='danger'><b>${this}</b> ${this.ranged_message} at ${A}!</span>`);
	if (this.rapid) {
		yield* addtimer((cb = (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/proc/Shoot"), A))), 1);
		yield* addtimer(cb, 4);
		yield* addtimer(cb, 6);
	} else {
		yield* this.Shoot(A);
	}
	this.ranged_cooldown = rt.worldTime(f) + this.ranged_cooldown_time;
	return f.dot;
}, true);

// hostile.dm:339
rt.def("/mob/living/simple_animal/hostile/proc/Shoot", function* Shoot(f: Frame, targeted_atom: Value) {
	let casing: Value = null, _P: Value = null;
	if (!targeted_atom || targeted_atom.gc_destroyed || targeted_atom == this.targets_from.loc || targeted_atom == this.targets_from) {
		return f.dot;
	}
	let startloc: Value = rt.getStep(f, this.targets_from, 0);
	if (this.casingtype) {
		casing = (yield* new_(this.casingtype, startloc));
		playsound(this, this.projectilesound, 100, 1);
		yield* casing.fire_casing(targeted_atom, this, null, null, null, { zone_override: ran_zone() });
	} else {
		if (!this.projectiletype) return f.dot;
		_P = (yield* new_(this.projectiletype, startloc));
		playsound(this, this.projectilesound, 100, 1);
		_P.current = startloc;
		_P.starting = startloc;
		_P.firer = this;
		_P.yo = targeted_atom.y - startloc.y;
		_P.xo = targeted_atom.x - startloc.x;
		if (this.AIStatus != AI_ON) {
			yield* this.newtonian_move(rt.getDir(f, targeted_atom, this.targets_from));
		}
		_P.original = targeted_atom;
		yield* _P.fire();
		return _P;
	}
	return f.dot;
}, true, { argTypes: [{ path: "/atom" }] });

// hostile.dm:363
rt.def("/mob/living/simple_animal/hostile/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	let dir: Value = null, _T: Value = null, a: Value = null, A: Value = null;
	if (!this.environment_smash) return f.dot;
	yield* this.EscapeConfinement();
	for (dir of each(GLOB.cardinal)) {
		if (rt.istype((_T = rt.getStep(f, this.targets_from, dir)), T("/turf/closed/wall")) || rt.istype(_T, T("/turf/closed/mineral"))) {
			if (_T.Adjacent(this.targets_from)) {
				yield* _T.attack_animal(this);
			}
		}
		a = null;
		for (a of each(_T)) {
			if (!(A = a).Adjacent(this.targets_from)) {
				continue;
			}
			if (is_type_in_typecache(A, this.environment_target_typecache)) {
				yield* A.attack_animal(this);
			}
		}
	}
	return f.dot;
}, true);

// hostile.dm:378
rt.def("/mob/living/simple_animal/hostile/proc/EscapeConfinement", function* EscapeConfinement(f: Frame) {
	let A: Value = null;
	if (this.buckled) {
		yield* this.buckled.attack_animal(this);
	}
	if (!(!isturf(this.targets_from.loc) && this.targets_from.loc !== null)) return f.dot;
	yield* (A = rt.getStep(f, this.targets_from, 0)).attack_animal(this);
	return f.dot;
}, true);

// hostile.dm:385
rt.def("/mob/living/simple_animal/hostile/proc/FindHidden", function* FindHidden(f: Frame) {
	let A: Value = null;
	if (!(rt.istype(this.target.loc, T("/obj/structure/closet")) || rt.istype(this.target.loc, T("/obj/machinery/disposal")) || rt.istype(this.target.loc, T("/obj/machinery/sleeper")))) return f.dot;
	this.Goto((A = this.target.loc), this.move_to_delay, this.minimum_distance);
	if (A.Adjacent(this.targets_from)) {
		yield* A.attack_animal(this);
	}
	return 1;
}, true);

// hostile.dm:393
rt.def("/mob/living/simple_animal/hostile/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value, params: Value) {
	if (this.ranged && this.ranged_cooldown <= rt.worldTime(f)) {
		this.target = A;
		yield* this.OpenFire(A);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// hostile.dm:402
rt.def("/mob/living/simple_animal/hostile/proc/AICanContinue", function* AICanContinue(f: Frame, possible_targets: Value) {
	if (this.AIStatus === AI_ON) {
		f.dot = 1;
	} else if (this.AIStatus === AI_IDLE) {
		if (yield* this.FindTarget(possible_targets, 1)) {
			f.dot = 1;
			this.AIStatus = AI_ON;
		} else {
			f.dot = 0;
		}
	}
	return f.dot;
}, true);

// hostile.dm:413
rt.def("/mob/living/simple_animal/hostile/proc/AIShouldSleep", function* AIShouldSleep(f: Frame, possible_targets: Value) {
	return (!(yield* this.FindTarget(possible_targets, 1)) ? 1 : 0);
}, true);

// hostile.dm:420
rt.def("/mob/living/simple_animal/hostile/proc/GainPatience", function* GainPatience(f: Frame) {
	if (!this.lose_patience_timeout) return f.dot;
	yield* this.LosePatience();
	this.lose_patience_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/proc/LoseTarget"))), this.lose_patience_timeout, 8));
	return f.dot;
}, true);

// hostile.dm:425
rt.def("/mob/living/simple_animal/hostile/proc/LosePatience", function* LosePatience(f: Frame) {
	yield* deltimer(this.lose_patience_timer_id);
	return f.dot;
}, true);

// hostile.dm:431
rt.def("/mob/living/simple_animal/hostile/proc/LoseSearchObjects", function* LoseSearchObjects(f: Frame) {
	this.search_objects = 0;
	yield* deltimer(this.search_objects_timer_id);
	this.search_objects_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/proc/RegainSearchObjects"))), this.search_objects_regain_time, 8));
	return f.dot;
}, true);

// hostile.dm:436
rt.def("/mob/living/simple_animal/hostile/proc/RegainSearchObjects", function RegainSearchObjects(f: Frame, value: Value) {
	if (!value) {
		value = rt.initial(f, this, "search_objects");
	}
	this.search_objects = value;
	return f.dot;
});
