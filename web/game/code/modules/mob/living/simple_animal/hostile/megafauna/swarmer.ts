// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, subtract } = rt;


// swarmer.dm:20
rt.def("/datum/controller/global_vars/proc/InitGlobalAISwarmers", function InitGlobalAISwarmers(f: Frame) {
	GLOB.AISwarmers = list();
	this.gvars_datum_init_order += "AISwarmers";
	return f.dot;
});

// swarmer.dm:21
rt.def("/datum/controller/global_vars/proc/InitGlobalAISwarmersByType", function InitGlobalAISwarmersByType(f: Frame) {
	GLOB.AISwarmersByType = list();
	this.gvars_datum_init_order += "AISwarmersByType";
	return f.dot;
});

// swarmer.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobalAISwarmerCapsByType", function InitGlobalAISwarmerCapsByType(f: Frame) {
	GLOB.AISwarmerCapsByType = rt.alist(f, [T("/mob/living/simple_animal/hostile/swarmer/ai/resource"), 30, T("/mob/living/simple_animal/hostile/swarmer/ai/ranged_combat"), 20, T("/mob/living/simple_animal/hostile/swarmer/ai/melee_combat"), 10]);
	this.gvars_datum_init_order += "AISwarmerCapsByType";
	return f.dot;
});

// swarmer.dm:29
rt.def("/proc/GetUncappedAISwarmerType", function GetUncappedAISwarmerType(f: Frame) {
	let t: Value = null, amount: Value = null;
	if (!GLOB.AISwarmersByType) {
		GLOB.AISwarmersByType = list();
	}
	for (t of each(shuffle(GLOB.swarmerTypes))) {
		if (!(amount = rt.index(GLOB.AISwarmersByType, t)) || rt.len(f, amount) < rt.index(GLOB.AISwarmerCapsByType, t)) {
			return t;
		}
	}
	return f.dot;
});

// swarmer.dm:40
rt.def("/proc/GetTotalAISwarmerCap", function GetTotalAISwarmerCap(f: Frame) {
	let t: Value = null;
	f.dot = 0;
	if (!GLOB.AISwarmersByType) {
		GLOB.AISwarmersByType = list();
	}
	for (t of each(rt.gl("swarmerTypes#2"))) {
		f.dot += rt.index(GLOB.AISwarmerCapsByType, t);
	}
	return f.dot;
});

rt.type(5029, "/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon", "/mob/living/simple_animal/hostile/megafauna", {
	swarmer_spawn_cooldown: 0,
	swarmer_spawn_cooldown_amt: 150,
	call_help_cooldown: 0,
	call_help_cooldown_amt: 150,
	medal_type: "Swarmer Beacon",
	score_type: "Swarmer Beacons Killed",
	anchored: 1,
	AIStatus: 3,
	name: "swarmer beacon",
	desc: "That name is a bit of a mouthful, but stop paying attention to your mouth they're eating everything!",
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	icon_state: "swarmer_console",
	health: 750,
	maxHealth: 750,
	faction: null,
	weather_immunities: null,
	stop_automated_movement: 1,
	wander: 0,
	layer: 3.7,
}, { global: { swarmer_caps: 723 } });

// swarmer.dm:69
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/Initialize", function* Initialize(f: Frame) {
	let ddir: Value = null, R: Value = null;
	f.dot = (yield* parent_proc());
	GLOB.swarmer_caps = GLOB.AISwarmerCapsByType;
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/swarmer_beacon"), this));
	for (ddir of each(GLOB.cardinal)) {
		yield* new_(T("/obj/structure/swarmer/blockade"), rt.getStep(f, this, ddir));
		yield* step((R = (yield* new_(T("/mob/living/simple_animal/hostile/swarmer/ai/resource"), this.loc))), ddir);
	}
	return f.dot;
}, true);

// swarmer.dm:79
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/Life", function* Life(f: Frame) {
	let createtype: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!((createtype = GetUncappedAISwarmerType()) && rt.worldTime(f) > this.swarmer_spawn_cooldown && rt.len(f, GLOB.AISwarmers) < GetTotalAISwarmerCap() * 0.5)) return f.dot;
	this.swarmer_spawn_cooldown = rt.worldTime(f) + this.swarmer_spawn_cooldown_amt;
	yield* new_(createtype, this.loc);
	return f.dot;
}, true, { waitfor: false });

// swarmer.dm:88
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot > 0 && rt.worldTime(f) > this.call_help_cooldown)) return f.dot;
	this.call_help_cooldown = rt.worldTime(f) + this.call_help_cooldown_amt;
	yield* this.summon_backup(25);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

rt.type(4884, "/mob/living/simple_animal/hostile/swarmer/ai", "/mob/living/simple_animal/hostile/swarmer", {
	wander: 1,
	faction: null,
	weather_immunities: null,
	AIStatus: 1,
});

// swarmer.dm:107
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("swarmer", "mining");

	this.weather_immunities = list("ash");
	return f.dot;
});

// swarmer.dm:112
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.ToggleLight();
	if (!rt.index(GLOB.AISwarmersByType, this.type)) {
		rt.setAt(GLOB.AISwarmersByType, this.type, list());
	}
	GLOB.AISwarmers += this;
	rt.modAt(GLOB.AISwarmersByType, this.type, this, add);
	return f.dot;
}, true);

// swarmer.dm:120
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.AISwarmers -= this;
	(rt.modAt(GLOB.AISwarmersByType, this.type, this, subtract));
	return (yield* parent_proc());
}, true);

// swarmer.dm:126
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/SwarmerTypeToCreate", function SwarmerTypeToCreate(f: Frame) {
	return GetUncappedAISwarmerType();
});

rt.type(4885, "/mob/living/simple_animal/hostile/swarmer/ai/resource", "/mob/living/simple_animal/hostile/swarmer/ai", {
	search_objects: 1,
	attack_all_objects: 1,
	lose_patience_timeout: 150,
}, { global: { sharedWanted: 716, sharedIgnore: 717 } });

// swarmer.dm:130
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (this.stop_automated_movement) return f.dot;
	if (!(this.health < this.maxHealth * 0.25)) return f.dot;
	yield* this.StartAction(100);
	yield* this.RepairSelf();
	return f.dot;
}, true, { waitfor: false });

// swarmer.dm:141
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/Move", function* Move(f: Frame, newloc: Value) {
	let L: Value = null;
	if (!newloc) return f.dot;
	if (newloc.z == this.z) {
		if (rt.istype(newloc, T("/turf/open/floor/plating/lava"))) {
			if (!(L = newloc).is_safe()) {
				yield* this.StartAction(20);
				yield* new_(T("/obj/structure/lattice/catwalk/swarmer_catwalk"), newloc);
				return 0;
			}
		}
		if (rt.istype(newloc, T("/turf/open/chasm")) && !this.throwing) {
			yield* this.throw_at(get_edge_target_turf(this, rt.getDir(f, this, newloc)), 7, 3, { spin: 0 });
			return 0;
		}
	}
	return (yield* parent_proc());
}, true);

// swarmer.dm:159
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/StartAction", function* StartAction(f: Frame, deci: Value) {
	deci ??= 0;
	this.stop_automated_movement = 1;
	this.AIStatus = AI_OFF;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/swarmer/ai/proc/EndAction"))), deci);
	return f.dot;
}, true);

// swarmer.dm:182
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.sharedWanted = typecacheof(GLOB.sharedWanted);
	GLOB.sharedIgnore = typecacheof(GLOB.sharedIgnore);
	return f.dot;
}, true);

// swarmer.dm:194
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/CanAttack", function CanAttack(f: Frame) {
	let rogueWindow: Value = null;
	if (rt.istype(f.args[0], T("/obj/structure/grille"))) {
		for (rogueWindow of each(rt.getStep(f, f.args[0], 0), T("/obj/structure/window"))) {
			if (rogueWindow.fulltile) {
				f.args[0] = rogueWindow;
				break;
			}
		}
	}
	if (is_type_in_typecache(f.args[0], GLOB.sharedIgnore)) {
		return 0;
	}
	if (is_type_in_typecache(f.args[0], GLOB.sharedWanted)) {
		return 1;
	}
	return parent_proc();
}, false, { args: ["the_target"] });

// swarmer.dm:210
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/OpenFire", function* OpenFire(f: Frame, A: Value) {
	if (!rt.istype(A, T("/mob/living"))) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// swarmer.dm:215
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (yield* this.target.swarmer_act(this)) {
		this.add_type_to_wanted(this.target.type);
		return 1;
	} else {
		this.add_type_to_ignore(this.target.type);
		return 0;
	}
}, true);

// swarmer.dm:224
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (this.stop_automated_movement) return f.dot;
	if (rt.len(f, GLOB.AISwarmers) < GetTotalAISwarmerCap() && this.resources >= 50) {
		yield* this.StartAction(100);
		yield* this.CreateSwarmer();
		return f.dot;
	}
	if (!(this.resources > 5)) return f.dot;
	if (prob(5)) {
		yield* this.StartAction(10);
		yield* this.CreateBarricade();
		return f.dot;
	}
	if (!prob(5)) return f.dot;
	yield* this.CreateTrap();
	return f.dot;
}, true, { waitfor: false });

// swarmer.dm:244
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/add_type_to_wanted", function add_type_to_wanted(f: Frame, typepath: Value) {
	if (!GLOB.sharedWanted) {
		GLOB.sharedWanted = list();
	}
	if (rt.index(GLOB.sharedWanted, typepath)) return f.dot;
	GLOB.sharedWanted += typecacheof(typepath);
	return f.dot;
});

// swarmer.dm:250
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/add_type_to_ignore", function add_type_to_ignore(f: Frame, typepath: Value) {
	if (!GLOB.sharedIgnore) {
		GLOB.sharedIgnore = list();
	}
	if (rt.index(GLOB.sharedIgnore, typepath)) return f.dot;
	GLOB.sharedIgnore += typecacheof(typepath);
	return f.dot;
});

rt.type(4886, "/mob/living/simple_animal/hostile/swarmer/ai/ranged_combat", "/mob/living/simple_animal/hostile/swarmer/ai", {
	login_text_dump: "\n\t<b>You are a swarmer, a weapon of a long dead civilization. Until further orders from your original masters are received, you must continue to consume and replicate.</b>\n\t<b>Clicking on any object will try to consume it, either deconstructing it into its components, destroying it, or integrating any materials it has into you if successful.</b>\n\t<b>Ctrl-Clicking on a mob will attempt to remove it from the area and place it in a safe environment for storage.</b>\n\t<b>Objectives:</b>\n\t1. Defend Resource Swarmers while they consume resources and replicate until there are no more resources left.\n\t2. Ensure that this location is fit for invasion at a later date; do not perform actions that would render it dangerous or inhospitable.\n\t3. Biological resources should not be harmed if possible, violent force can be applied should they fail to keep away.\n\t",
	icon_state: "swarmer_ranged",
	icon_living: "swarmer_ranged",
	projectiletype: rt.typePath("/obj/item/projectile/beam/laser"),
	projectilesound: rt.rsc("sound/weapons/laser.ogg"),
	check_friendly_fire: 1,
	retreat_distance: 3,
	minimum_distance: 3,
});

// swarmer.dm:277
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/ranged_combat/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	yield* this.summon_backup(15, 1);
	return f.dot;
}, true);

rt.type(4887, "/mob/living/simple_animal/hostile/swarmer/ai/melee_combat", "/mob/living/simple_animal/hostile/swarmer/ai", {
	login_text_dump: "\n\t<b>You are a swarmer, a weapon of a long dead civilization. Until further orders from your original masters are received, you must continue to consume and replicate.</b>\n\t<b>Clicking on any object will try to consume it, either deconstructing it into its components, destroying it, or integrating any materials it has into you if successful.</b>\n\t<b>Ctrl-Clicking on a mob will attempt to remove it from the area and place it in a safe environment for storage.</b>\n\t<b>Objectives:</b>\n\t1. Defend Resource Swarmers while they consume resources and replicate until there are no more resources left.\n\t2. Ensure that this location is fit for invasion at a later date; do not perform actions that would render it dangerous or inhospitable.\n\t3. Biological resources should not be harmed if possible, violent force can be applied should they fail to keep away.\n\t",
	icon_state: "swarmer_melee",
	icon_living: "swarmer_melee",
	health: 60,
	maxHealth: 60,
	ranged: 0,
});

// swarmer.dm:300
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/melee_combat/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	yield* this.summon_backup(15, 1);
	return f.dot;
}, true);

// swarmer.dm:305
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/melee_combat/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	if (rt.istype(this.target, T("/mob/living"))) {
		if (prob(35)) {
			yield* this.StartAction(30);
			yield* this.DisperseTarget(this.target);
		} else {
			yield* (L = this.target).attack_animal(this);
			yield* L.electrocute_act(10, this, { safety: 1 });
		}
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);
