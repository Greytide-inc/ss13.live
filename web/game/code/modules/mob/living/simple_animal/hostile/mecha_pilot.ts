// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mecha_pilot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4894, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot", "/mob/living/simple_animal/hostile/syndicate", {
	mecha: null,
	required_mecha_charge: 7500,
	mecha_charge_evacuate: 50,
	threat_use_mecha_smoke: 5,
	defence_mode_chance: 35,
	smoke_chance: 20,
	retreat_chance: 40,
	spawn_mecha_type: rt.typePath("/obj/mecha/combat/marauder/mauler/loaded"),
	name: "Syndicate Mecha Pilot",
	desc: "Death to Nanotrasen. This variant comes in MECHA DEATH flavour.",
	wanted_objects: null,
	search_objects: 0,
});

// mecha_pilot.dm:24
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.wanted_objects = list();
	return f.dot;
});

rt.type(4895, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech", "/mob/living/simple_animal/hostile/syndicate/mecha_pilot", {
	spawn_mecha_type: null,
	search_objects: 2,
});

// mecha_pilot.dm:43
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.wanted_objects = (yield* typecacheof(T("/obj/mecha/combat"), { ignore_root_path: 1 }));
	return f.dot;
}, true);

rt.type(4897, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/nanotrasen", "/mob/living/simple_animal/hostile/syndicate/mecha_pilot", {
	name: "Nanotrasen Mecha Pilot",
	desc: "Death to the Syndicate. This variant comes in MECHA DEATH flavour.",
	icon_living: "nanotrasen",
	icon_state: "nanotrasen",
	faction: null,
	spawn_mecha_type: rt.typePath("/obj/mecha/combat/marauder/loaded"),
});

// mecha_pilot.dm:51
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/nanotrasen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("nanotrasen");
	return f.dot;
});

rt.type(4896, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/nanotrasen", "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech", {
	name: "Nanotrasen Mecha Pilot",
	desc: "Death to the Syndicate. This variant comes in MECHA DEATH flavour.",
	icon_living: "nanotrasen",
	icon_state: "nanotrasen",
	faction: null,
});

// mecha_pilot.dm:59
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/no_mech/nanotrasen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("nanotrasen");
	return f.dot;
});

// mecha_pilot.dm:63
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	if (!this.spawn_mecha_type) return f.dot;
	if (!rt.istype((M = (yield* new_(this.spawn_mecha_type, rt.getStep(f, this, 0)))), T("/obj/mecha"))) return f.dot;
	yield* this.enter_mecha(M);
	return f.dot;
}, true);

// mecha_pilot.dm:71
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/enter_mecha", function* enter_mecha(f: Frame, M: Value) {
	let equip: Value = null, ME: Value = null;
	if (!M) {
		return 0;
	}
	this.target = null;
	yield* M.aimob_enter_mech(this);
	this.targets_from = M;
	this.allow_movement_on_non_turfs = 1;
	let do_ranged: Value = 0;
	for (equip of each(this.mecha.equipment)) {
		if (rt.bitAnd((ME = equip).range, 2)) {
			do_ranged = 1;
			break;
		}
	}
	if (do_ranged) {
		this.minimum_distance = 5;
		this.ranged = 1;
	} else {
		this.minimum_distance = 1;
		this.ranged = 0;
	}
	this.wanted_objects = list();
	this.search_objects = 0;
	if (!(this.mecha && this.mecha.lights_action)) return f.dot;
	yield* this.mecha.lights_action.Activate();
	return f.dot;
}, true);

// mecha_pilot.dm:96
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/exit_mecha", function* exit_mecha(f: Frame, M: Value) {
	let C: Value = null;
	if (!M) {
		return 0;
	}
	yield* this.mecha.aimob_exit_mech(this);
	this.allow_movement_on_non_turfs = 0;
	this.targets_from = f.src;
	this.wanted_objects = (yield* typecacheof(T("/obj/mecha/combat"), { ignore_root_path: 1 }));
	let search_aggressiveness: Value = 2;
	for (C of each(range(this.vision_range, this), T("/obj/mecha/combat"))) {
		if (this.is_valid_mecha(C)) {
			this.target = C;
			search_aggressiveness = 3;
			break;
		}
	}
	this.search_objects = search_aggressiveness;
	this.ranged = 0;
	this.minimum_distance = 1;
	walk(M, 0);
	return f.dot;
}, true);

// mecha_pilot.dm:119
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/is_valid_mecha", function is_valid_mecha(f: Frame, M: Value) {
	if (!M) {
		return 0;
	}
	if (M.occupant) {
		return 0;
	}
	if (!M.has_charge(this.required_mecha_charge)) {
		return 0;
	}
	if (M.obj_integrity < M.max_integrity * 0.5) {
		return 0;
	}
	return 1;
});

// mecha_pilot.dm:132
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/mecha_face_target", function mecha_face_target(f: Frame, A: Value) {
	if (!this.mecha) return f.dot;
	let dirto: Value = rt.getDir(f, this.mecha, A);
	if (this.mecha.dir == dirto) return f.dot;
	this.mecha.mechturn(dirto);
	return f.dot;
});

// mecha_pilot.dm:140
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/mecha_reload", function* mecha_reload(f: Frame) {
	let equip: Value = null, ME: Value = null;
	if (!this.mecha) return f.dot;
	for (equip of each(this.mecha.equipment)) {
		if ((ME = equip).needs_rearm()) {
			yield* ME.rearm();
		}
	}
	return f.dot;
}, true);

// mecha_pilot.dm:147
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/get_mecha_equip_by_flag", function get_mecha_equip_by_flag(f: Frame, flag: Value) {
	let equip: Value = null, ME: Value = null;
	flag ??= 2;
	f.dot = list();
	if (!this.mecha) return f.dot;
	for (equip of each(this.mecha.equipment)) {
		if (rt.bitAnd((ME = equip).range, flag) && ME.action_checks(ME)) {
			f.dot += ME;
		}
	}
	return f.dot;
});

// mecha_pilot.dm:160
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/OpenFire", function* OpenFire(f: Frame, A: Value) {
	let possible_weapons: Value = null, ME: Value = null;
	if (this.mecha) {
		yield* this.mecha_reload();
		this.mecha_face_target(A);
		if (rt.len(f, (possible_weapons = this.get_mecha_equip_by_flag(2)))) {
			if (yield* (ME = pick(possible_weapons)).action(A)) {
				yield* ME.start_cooldown();
				return f.dot;
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// mecha_pilot.dm:175
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let possible_weapons: Value = null, ME: Value = null, M: Value = null;
	if (this.mecha) {
		if (rt.len(f, (possible_weapons = this.get_mecha_equip_by_flag(1)))) {
			ME = pick(possible_weapons);
			this.mecha_face_target(this.target);
			if (yield* ME.action(this.target)) {
				yield* ME.start_cooldown();
				return f.dot;
			}
		}
		if (this.mecha.melee_can_hit) {
			this.mecha_face_target(this.target);
			yield* this.target.mech_melee_attack(this.mecha);
		}
	} else {
		if (rt.istype(this.target, T("/obj/mecha"))) {
			if (this.is_valid_mecha((M = this.target))) {
				yield* this.enter_mecha(M);
				return f.dot;
			} else if (!this.CanAttack(M)) {
				this.target = null;
				return f.dot;
			}
		}
		return (yield* this.target.attack_animal(this));
	}
	return f.dot;
}, true);

// mecha_pilot.dm:201
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let C: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (!this.mecha) {
		for (C of each(range(this, this.vision_range), T("/obj/mecha/combat"))) {
			if (this.is_valid_mecha(C)) {
				this.target = C;
				this.minimum_distance = 1;
				this.ranged = 0;
				break;
			}
		}
	}
	if (!this.mecha) return f.dot;
	let L: Value = this.PossibleThreats();
	let threat_count: Value = rt.len(f, L);
	if (!this.mecha.has_charge(this.mecha_charge_evacuate)) {
		yield* this.exit_mecha(this.mecha);
		return f.dot;
	}
	if (this.mecha.obj_integrity < this.mecha.max_integrity * 0.1) {
		yield* this.exit_mecha(this.mecha);
		return f.dot;
	}
	if (threat_count >= this.threat_use_mecha_smoke && prob(this.smoke_chance)) {
		if (this.mecha.smoke_action && this.mecha.smoke_action.owner && this.mecha.smoke) {
			yield* this.mecha.smoke_action.Activate();
		}
	}
	if (!(this.mecha.obj_integrity < this.mecha.max_integrity * 0.25)) return f.dot;
	if (prob(this.defence_mode_chance)) {
		if (this.mecha.defense_action && this.mecha.defense_action.owner && !this.mecha.defence_mode) {
			this.mecha.leg_overload_mode = 0;
			yield* this.mecha.defense_action.Activate(1);
			yield* addtimer((yield* new_(T("/datum/callback"), this.mecha.defense_action, P("/datum/action/innate/mecha/mech_defence_mode/proc/Activate"), 0)), 100);
		}
	} else {
		if (!prob(this.retreat_chance)) return f.dot;
		if (this.mecha.overload_action && this.mecha.overload_action.owner && !this.mecha.leg_overload_mode) {
			yield* this.mecha.overload_action.Activate(1);
			yield* addtimer((yield* new_(T("/datum/callback"), this.mecha.overload_action, P("/datum/action/innate/mecha/mech_defence_mode/proc/Activate"), 0)), 100);
		}
		this.retreat_distance = 50;
		rt.spawnTail(f, 100, "/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/mecha_pilot.dm:243", C, L, threat_count);
	}
	return f.dot;
}, true, { waitfor: false });

// a spawn(100) body of /mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/mecha_pilot.dm:243", function* (f: Frame, C: Value, L: Value, threat_count: Value) {
	this.retreat_distance = 0;
	return null;
});

// mecha_pilot.dm:250
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.mecha) {
		yield* this.mecha.aimob_exit_mech(this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mecha_pilot.dm:255
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/gib", function* gib(f: Frame) {
	if (this.mecha) {
		yield* this.mecha.aimob_exit_mech(this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mecha_pilot.dm:262
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let M: Value = null;
	if (rt.istype(the_target, T("/obj/mecha"))) {
		M = the_target;
		if (this.mecha) {
			if (M == this.mecha || !this.CanAttack(M.occupant)) {
				return 0;
			}
		} else if (this.is_valid_mecha(M)) {
			return 1;
		} else if (M.occupant && this.CanAttack(M.occupant)) {
			return 1;
		} else {
			return 0;
		}
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// mecha_pilot.dm:279
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/EscapeConfinement", function* EscapeConfinement(f: Frame) {
	if (this.mecha && this.loc == this.mecha) {
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mecha_pilot.dm:285
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Move", function* Move(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (this.mecha && this.loc == this.mecha) {
		yield* this.mecha.relaymove(this, f.args[1]);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["NewLoc", "Dir", "step_x", "step_y"] });

// mecha_pilot.dm:293
rt.def("/mob/living/simple_animal/hostile/syndicate/mecha_pilot/proc/Goto", function Goto(f: Frame, target: Value, delay: Value, minimum_distance: Value) {
	if (this.mecha) {
		walk_to(this.mecha, target, minimum_distance, delay);
	} else {
		parent_proc();
	}
	return f.dot;
}, false);
