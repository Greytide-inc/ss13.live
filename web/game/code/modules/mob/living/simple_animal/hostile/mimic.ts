// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mimic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4967, "/mob/living/simple_animal/hostile/mimic", "/mob/living/simple_animal/hostile", {
	emote_taunt: null,
	taunt_chance: 30,
	move_to_delay: 9,
	name: "crate",
	desc: "A rectangular steel crate.",
	icon: rt.rsc("icons/obj/crates.dmi"),
	icon_state: "crate",
	icon_living: "crate",
	response_help: "touches",
	response_disarm: "pushes",
	response_harm: "hits",
	speed: 0,
	maxHealth: 250,
	health: 250,
	gender: "neuter",
	harm_intent_damage: 5,
	melee_damage_lower: 8,
	melee_damage_upper: 12,
	attacktext: "attacks",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	faction: null,
	gold_core_spawnable: 1,
	del_on_death: 1,
});

// mimic.dm:21
rt.def("/mob/living/simple_animal/hostile/mimic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.emote_taunt = list("growls");

	this.speak_emote = list("creaks");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("mimic");
	return f.dot;
});

rt.type(4968, "/mob/living/simple_animal/hostile/mimic/crate", "/mob/living/simple_animal/hostile/mimic", {
	attempt_open: 0,
	attacktext: "bites",
	speak_emote: null,
	stop_automated_movement: 1,
	wander: 0,
});

// mimic.dm:36
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("clatters");
	return f.dot;
});

// mimic.dm:43
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let I: Value = null;
	yield* parent_proc();
	if (!mapload) return f.dot;
	for (I of each(this.loc, T("/obj/item"))) {
		I.loc = this;
	}
	return f.dot;
}, true);

// mimic.dm:49
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	yield* parent_proc();
	if (prob(90)) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}open`;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
}, true);

// mimic.dm:57
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/ListTargets", function ListTargets(f: Frame) {
	if (this.attempt_open) {
		return parent_proc();
	}
	return parent_proc(1);
});

// mimic.dm:61
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/FindTarget", function* FindTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.trigger();
	return f.dot;
}, true);

// mimic.dm:66
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.icon_state = rt.initial(f, this, "icon_state");
	if (!(prob(15) && rt.istype(this.target, T("/mob/living/carbon")))) return f.dot;
	yield* (C = this.target).Knockdown(40);
	C.visible_message(fmt("<span class='danger'>＄！ knocks down ％！!</span>", [this, C]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [this]));
	return f.dot;
}, true);

// mimic.dm:76
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/trigger", function trigger(f: Frame) {
	if (this.attempt_open) return f.dot;
	this.visible_message(`<b>${this}</b> starts to move!`);
	this.attempt_open = 1;
	return f.dot;
});

// mimic.dm:81
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	yield* this.trigger();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// mimic.dm:85
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/LoseTarget", function LoseTarget(f: Frame) {
	parent_proc();
	this.icon_state = rt.initial(f, this, "icon_state");
	return f.dot;
});

// mimic.dm:89
rt.def("/mob/living/simple_animal/hostile/mimic/crate/proc/death", function* death(f: Frame) {
	let O: Value = null;
	let C: Value = (yield* new_(T("/obj/structure/closet/crate"), rt.getStep(f, this, 0)));
	for (O of each(this, T("/obj"))) {
		O.loc = C;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mimic.dm:95
rt.def("/datum/controller/global_vars/proc/InitGlobalprotected_objects", function InitGlobalprotected_objects(f: Frame) {
	GLOB.protected_objects = list(T("/obj/structure/table"), T("/obj/structure/cable"), T("/obj/structure/window"));
	this.gvars_datum_init_order += "protected_objects";
	return f.dot;
});

rt.type(4969, "/mob/living/simple_animal/hostile/mimic/copy", "/mob/living/simple_animal/hostile/mimic", {
	creator: null,
	destroy_objects: 0,
	knockdown_people: 0,
	health: 100,
	maxHealth: 100,
	gold_core_spawnable: 0,
}, { global: { googly_eyes: 720 } });

// mimic.dm:107
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	yield* parent_proc();
	yield* this.CopyObject(f.args[1], f.args[2], f.args[3]);
	return f.dot;
}, true, { args: ["mapload", "copy", "creator", "destroy_original"] });

// mimic.dm:111
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/Life", function* Life(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	if (!this.target && !this.ckey) {
		yield* this.adjustBruteLoss(1);
	}
	for (M of each(this.contents, T("/mob/living"))) {
		yield* this.death();
	}
	return f.dot;
}, true, { waitfor: false });

// mimic.dm:118
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/death", function* death(f: Frame) {
	let M: Value = null;
	for (M of each(this, T("/atom/movable"))) {
		M.loc = rt.getStep(f, this, 0);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mimic.dm:123
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/ListTargets", function ListTargets(f: Frame) {
	f.dot = parent_proc();
	return f.dot - this.creator;
});

// mimic.dm:127
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/ChangeOwner", function ChangeOwner(f: Frame, owner: Value) {
	if (owner == this.creator) return f.dot;
	this.LoseTarget();
	this.creator = owner;
	(rt.modSrcVar(f, "faction", fmt("＃", [owner]), rt.bitOr));
	return f.dot;
});

// mimic.dm:133
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/CheckObject", function CheckObject(f: Frame, O: Value) {
	if ((rt.istype(O, T("/obj/item")) || rt.istype(O, T("/obj/structure"))) && !is_type_in_list(O, GLOB.protected_objects)) {
		return 1;
	}
	return 0;
});

// mimic.dm:138
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/CopyObject", function* CopyObject(f: Frame, O: Value, user: Value, destroy_original: Value) {
	let I: Value = null;
	destroy_original ??= 0;
	if (!(destroy_original || this.CheckObject(O))) return f.dot;
	O.loc = this;
	this.name = O.name;
	this.desc = O.desc;
	this.icon = O.icon;
	this.icon_state = O.icon_state;
	this.icon_living = this.icon_state;
	this.copy_overlays(O);
	this.add_overlay(GLOB.googly_eyes);
	if (rt.istype(O, T("/obj/structure")) || rt.istype(O, T("/obj/machinery"))) {
		this.health = this.anchored * 50 + 50;
		this.destroy_objects = 1;
		if (O.density && O.anchored) {
			this.knockdown_people = 1;
			this.melee_damage_lower *= 2;
			this.melee_damage_upper *= 2;
		}
	} else if (rt.istype(O, T("/obj/item"))) {
		I = O;
		this.health = 15 * I.w_class;
		this.melee_damage_lower = 2 + I.force;
		this.melee_damage_upper = 2 + I.force;
		this.move_to_delay = 2 * I.w_class + 1;
	}
	this.maxHealth = this.health;
	if (user) {
		this.creator = user;
		this.faction += fmt("＃", [this.creator]);
	}
	if (destroy_original) {
		yield* qdel(O);
	}
	return 1;
}, true);

// mimic.dm:170
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (!this.destroy_objects) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// mimic.dm:173
rt.def("/mob/living/simple_animal/hostile/mimic/copy/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!(this.knockdown_people && f.dot && prob(15) && rt.istype(this.target, T("/mob/living/carbon")))) return f.dot;
	yield* (C = this.target).Knockdown(40);
	C.visible_message(fmt("<span class='danger'>＄！ knocks down ％！!</span>", [this, C]), fmt("<span class='userdanger'>＄！ knocks you down!</span>", [this]));
	return f.dot;
}, true);

rt.type(4970, "/mob/living/simple_animal/hostile/mimic/copy/machine", "/mob/living/simple_animal/hostile/mimic/copy", {
	speak: null,
	speak_chance: 7,
});

// mimic.dm:186
rt.def("/mob/living/simple_animal/hostile/mimic/copy/machine/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let R: Value = null;
	if (the_target == this.creator) {
		return 0;
	}
	if (rt.istype(the_target, T("/mob/living/silicon/robot"))) {
		if ((R = the_target).connected_ai == this.creator) {
			return 0;
		}
	}
	return parent_proc();
}, false);

rt.type(4971, "/mob/living/simple_animal/hostile/mimic/copy/ranged", "/mob/living/simple_animal/hostile/mimic/copy", {
	TrueGun: null,
	Zapstick: null,
	Pewgun: null,
	Zapgun: null,
});

// mimic.dm:203
rt.def("/mob/living/simple_animal/hostile/mimic/copy/ranged/proc/CopyObject", function* CopyObject(f: Frame) {
	let G: Value = null, M: Value = null, E: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	this.emote_see = list("aims menacingly");
	this.obj_damage = 0;
	this.environment_smash = ENVIRONMENT_SMASH_NONE;
	this.ranged = 1;
	this.retreat_distance = 1;
	this.minimum_distance = 6;
	this.melee_damage_upper = (G = f.args[0]).force;
	this.melee_damage_lower = G.force - max(0, G.force / 2);
	this.move_to_delay = 2 * G.w_class + 1;
	this.projectilesound = G.fire_sound;
	this.TrueGun = G;
	if (rt.istype(G, T("/obj/item/weapon/gun/magic"))) {
		this.Zapstick = G;
		this.projectiletype = rt.initial(f, (M = this.Zapstick.ammo_type), "projectile_type");
	}
	if (rt.istype(G, T("/obj/item/weapon/gun/ballistic"))) {
		this.Pewgun = G;
		this.casingtype = rt.initial(f, (M = this.Pewgun.mag_type), "ammo_type");
	}
	if (!rt.istype(G, T("/obj/item/weapon/gun/energy"))) return f.dot;
	this.Zapgun = G;
	let selectfiresetting: Value = this.Zapgun.select;
	this.projectiletype = rt.initial(f, (E = rt.index(this.Zapgun.ammo_type, selectfiresetting)), "projectile_type");
	return f.dot;
}, true, { args: ["O", "creator", "destroy_original"] });

// mimic.dm:232
rt.def("/mob/living/simple_animal/hostile/mimic/copy/ranged/proc/OpenFire", function* OpenFire(f: Frame, the_target: Value) {
	let shot: Value = null;
	if (this.Zapgun) {
		if (this.Zapgun.cell) {
			shot = rt.index(this.Zapgun.ammo_type, this.Zapgun.select);
			if (this.Zapgun.cell.charge >= shot.e_cost) {
				yield* this.Zapgun.cell.use(shot.e_cost);
				yield* this.Zapgun.update_icon();
				yield* parent_proc();
			}
		}
	} else if (this.Zapstick) {
		if (this.Zapstick.charges) {
			this.Zapstick.charges--;
			yield* this.Zapstick.update_icon();
			yield* parent_proc();
		}
	} else if (this.Pewgun) {
		if (this.Pewgun.chambered) {
			if (this.Pewgun.chambered.BB) {
				yield* qdel(this.Pewgun.chambered.BB);
				this.Pewgun.chambered.BB = null;
				yield* this.Pewgun.chambered.update_icon();
				yield* parent_proc();
			} else {
				this.visible_message(`<span class='danger'>The <b>${this}</b> clears a jam!</span>`);
			}
			this.Pewgun.chambered.loc = this.loc;
			this.Pewgun.chambered = null;
			if (this.Pewgun.magazine && rt.len(f, this.Pewgun.magazine.stored_ammo)) {
				this.Pewgun.chambered = this.Pewgun.magazine.get_round(0);
				this.Pewgun.chambered.loc = this.Pewgun;
			}
			yield* this.Pewgun.update_icon();
		} else if (this.Pewgun.magazine && rt.len(f, this.Pewgun.magazine.stored_ammo)) {
			this.Pewgun.chambered = this.Pewgun.magazine.get_round(0);
			this.Pewgun.chambered.loc = this.Pewgun;
			this.visible_message(`<span class='danger'>The <b>${this}</b> cocks itself!</span>`);
		}
	} else {
		this.ranged = 0;
		this.retreat_distance = 0;
		this.minimum_distance = 1;
		return f.dot;
	}
	this.icon_state = this.TrueGun.icon_state;
	this.icon_living = this.TrueGun.icon_state;
	return f.dot;
}, true);
