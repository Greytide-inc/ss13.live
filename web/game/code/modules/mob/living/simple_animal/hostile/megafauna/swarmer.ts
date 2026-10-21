// From code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalAISwarmers  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:20)
rt.def("/datum/controller/global_vars/proc/InitGlobalAISwarmers", function InitGlobalAISwarmers(f: Frame) {
	rt.setGl("AISwarmers", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "AISwarmers", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalAISwarmersByType  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:21)
rt.def("/datum/controller/global_vars/proc/InitGlobalAISwarmersByType", function InitGlobalAISwarmersByType(f: Frame) {
	rt.setGl("AISwarmersByType", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "AISwarmersByType", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalAISwarmerCapsByType  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobalAISwarmerCapsByType", function InitGlobalAISwarmerCapsByType(f: Frame) {
	rt.setGl("AISwarmerCapsByType", rt.alist(f, [T("/mob/living/simple_animal/hostile/swarmer/ai/resource"), 30, T("/mob/living/simple_animal/hostile/swarmer/ai/ranged_combat"), 20, T("/mob/living/simple_animal/hostile/swarmer/ai/melee_combat"), 10]));
	rt.modSrcVar(f, "gvars_datum_init_order", "AISwarmerCapsByType", add);
	return f.dot;
});

// /proc/GetUncappedAISwarmerType  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:29)
rt.def("/proc/GetUncappedAISwarmerType", function GetUncappedAISwarmerType(f: Frame) {
	let t: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [t, amount, $e];
	if (!truthy(rt.gl("AISwarmersByType"))) {
		rt.setGl("AISwarmersByType", rt.list());
	}
	t = null;
	rt.forList(f, 0, rt.call(f, P("/proc/shuffle"), null, [rt.gl("swarmerTypes")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if ((!truthy((amount = rt.index(rt.gl("AISwarmersByType"), live(t)))) || rt.lt(rt.len(f, live(amount)), rt.index(rt.gl("AISwarmerCapsByType"), live(t))))) {
			return live(t);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/GetTotalAISwarmerCap  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:40)
rt.def("/proc/GetTotalAISwarmerCap", function GetTotalAISwarmerCap(f: Frame) {
	let t: Value = null;
	let $e: any;
	f.vars = () => [t, $e];
	f.dot = 0;
	if (!truthy(rt.gl("AISwarmersByType"))) {
		rt.setGl("AISwarmersByType", rt.list());
	}
	t = null;
	rt.forList(f, 0, rt.gl("swarmerTypes#2"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		f.dot = rt.modify(live(f.dot), rt.index(rt.gl("AISwarmerCapsByType"), live(t)), add);
	}
	rt.endFor(f, 0);
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

// /mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:69)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/Initialize", function* Initialize(f: Frame) {
	let ddir: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [ddir, R, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setGl("swarmer_caps", rt.gl("AISwarmerCapsByType"));
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/swarmer_beacon"), [live(f.src)])));
	ddir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ddir = $e;
		yield* g.new_(f, T("/obj/structure/swarmer/blockade"), [rt.getStep(f, live(f.src), live(ddir))]);
		yield* g.call(f, P("/proc/step"), null, [(R = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/swarmer/ai/resource"), [rt.sv(f, "loc")]))), live(ddir)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/Life  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/Life", function* Life(f: Frame) {
	let createtype: Value = null;
	f.vars = () => [createtype];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!((truthy((createtype = (yield* g.call(f, P("/proc/GetUncappedAISwarmerType"), null, [])))) && rt.gt(rt.worldTime(f), rt.sv(f, "swarmer_spawn_cooldown"))) && rt.lt(rt.len(f, rt.gl("AISwarmers")), multiply((yield* g.call(f, P("/proc/GetTotalAISwarmerCap"), null, [])), 0.5)))) return f.dot;
	rt.setSv(f, "swarmer_spawn_cooldown", add(rt.worldTime(f), rt.sv(f, "swarmer_spawn_cooldown_amt")));
	yield* g.new_(f, live(createtype), [rt.sv(f, "loc")]);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:88)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/swarmer_swarm_beacon/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(rt.gt(live(f.dot), 0) && rt.gt(rt.worldTime(f), rt.sv(f, "call_help_cooldown")))) return f.dot;
	rt.setSv(f, "call_help_cooldown", add(rt.worldTime(f), rt.sv(f, "call_help_cooldown_amt")));
	yield* g.srcCall(f, "summon_backup", 25);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

rt.type(4884, "/mob/living/simple_animal/hostile/swarmer/ai", "/mob/living/simple_animal/hostile/swarmer", {
	wander: 1,
	faction: null,
	weather_immunities: null,
	AIStatus: 1,
});

// /mob/living/simple_animal/hostile/swarmer/ai/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:107)
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("swarmer", "mining"));
	$0 = $0;
	rt.setSv(f, "weather_immunities", rt.list("ash"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/ai/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:112)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ToggleLight");
	if (!truthy(rt.index(rt.gl("AISwarmersByType"), rt.sv(f, "type")))) {
		rt.setAt(rt.gl("AISwarmersByType"), rt.sv(f, "type"), rt.list());
	}
	rt.modGl("AISwarmers", live(f.src), add);
	rt.modAt(rt.gl("AISwarmersByType"), rt.sv(f, "type"), live(f.src), add);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/ai/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:120)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("AISwarmers", live(f.src), subtract));
	(rt.modAt(rt.gl("AISwarmersByType"), rt.sv(f, "type"), live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/swarmer/ai/proc/SwarmerTypeToCreate  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:126)
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/SwarmerTypeToCreate", function SwarmerTypeToCreate(f: Frame) {
	return rt.call(f, P("/proc/GetUncappedAISwarmerType"), null, []);
});

rt.type(4885, "/mob/living/simple_animal/hostile/swarmer/ai/resource", "/mob/living/simple_animal/hostile/swarmer/ai", {
	search_objects: 1,
	attack_all_objects: 1,
	lose_patience_timeout: 150,
}, { global: { sharedWanted: 716, sharedIgnore: 717 } });

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:130)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.sv(f, "stop_automated_movement"))) return f.dot;
	if (!rt.lt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.25))) return f.dot;
	yield* g.srcCall(f, "StartAction", 100);
	yield* g.srcCall(f, "RepairSelf");
	return live(f.dot);
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/swarmer/ai/proc/Move  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:141)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/Move", function* Move(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(live(f.args[0]))) return f.dot;
	if (isEqual(rt.fv(f, "z", live(f.args[0])), rt.sv(f, "z"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/turf/open/floor/plating/lava")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, (L = live(f.args[0])), "is_safe", [])))) {
				yield* g.srcCall(f, "StartAction", 20);
				yield* g.new_(f, T("/obj/structure/lattice/catwalk/swarmer_catwalk"), [live(f.args[0])]);
				return 0;
			}
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/turf/open/chasm")) ? 1 : 0)) && !truthy(rt.sv(f, "throwing")))) {
			yield* g.callSrc(f, "throw_at", [null, (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.getDir(f, live(f.src), live(f.args[0]))])), null, 7, null, 3, "spin", 0], rt.Args.Named);
			return 0;
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["newloc"] });

// /mob/living/simple_animal/hostile/swarmer/ai/proc/StartAction  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:159)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/proc/StartAction", function* StartAction(f: Frame, deci: Value) {
	f.vars = () => [deci];
	if (live(deci) === null) {
		deci = 0;
	}
	rt.setSv(f, "stop_automated_movement", 1);
	rt.setSv(f, "AIStatus", 3);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/swarmer/ai/proc/EndAction")])), live(deci)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:182)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setGl("sharedWanted", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.gl("sharedWanted")])));
	rt.setGl("sharedIgnore", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.gl("sharedIgnore")])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:194)
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/CanAttack", function CanAttack(f: Frame) {
	let rogueWindow: Value = null;
	let $e: any;
	f.vars = () => [rogueWindow, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/structure/grille")) ? 1 : 0))) {
		rogueWindow = null;
		rt.forList(f, 0, rt.getStep(f, live(f.args[0]), 0), T("/obj/structure/window"));
		while (($e = rt.next(f, 0)) !== undefined) {
			rogueWindow = $e;
			if (truthy(rt.fv(f, "fulltile", live(rogueWindow)))) {
				f.args[0] = live(rogueWindow);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("sharedIgnore")]))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("sharedWanted")]))) {
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["the_target"] });

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:210)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/OpenFire", function* OpenFire(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:215)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy((yield* g.callName(f, rt.sv(f, "target"), "swarmer_act", [live(f.src)])))) {
		yield* g.srcCall(f, "add_type_to_wanted", rt.fv(f, "type", rt.sv(f, "target")));
		return 1;
	} else {
		yield* g.srcCall(f, "add_type_to_ignore", rt.fv(f, "type", rt.sv(f, "target")));
		return 0;
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:224)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.sv(f, "stop_automated_movement"))) return f.dot;
	if ((rt.lt(rt.len(f, rt.gl("AISwarmers")), (yield* g.call(f, P("/proc/GetTotalAISwarmerCap"), null, []))) && rt.ge(rt.sv(f, "resources"), 50))) {
		yield* g.srcCall(f, "StartAction", 100);
		yield* g.srcCall(f, "CreateSwarmer");
		return live(f.dot);
	}
	if (!rt.gt(rt.sv(f, "resources"), 5)) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.srcCall(f, "StartAction", 10);
		yield* g.srcCall(f, "CreateBarricade");
		return live(f.dot);
	}
	if (!truthy(rt.op(f, "Prob", [], [5]))) return f.dot;
	yield* g.srcCall(f, "CreateTrap");
	return live(f.dot);
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/add_type_to_wanted  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:244)
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/add_type_to_wanted", function add_type_to_wanted(f: Frame, typepath: Value) {
	if (!truthy(rt.gl("sharedWanted"))) {
		rt.setGl("sharedWanted", rt.list());
	}
	if (truthy(rt.index(rt.gl("sharedWanted"), live(typepath)))) return f.dot;
	rt.modGl("sharedWanted", rt.call(f, P("/proc/typecacheof"), null, [live(typepath)]), add);
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/ai/resource/proc/add_type_to_ignore  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:250)
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/resource/proc/add_type_to_ignore", function add_type_to_ignore(f: Frame, typepath: Value) {
	if (!truthy(rt.gl("sharedIgnore"))) {
		rt.setGl("sharedIgnore", rt.list());
	}
	if (truthy(rt.index(rt.gl("sharedIgnore"), live(typepath)))) return f.dot;
	rt.modGl("sharedIgnore", rt.call(f, P("/proc/typecacheof"), null, [live(typepath)]), add);
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

// /mob/living/simple_animal/hostile/swarmer/ai/ranged_combat/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:277)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/ranged_combat/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "summon_backup", 15, 1);
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

// /mob/living/simple_animal/hostile/swarmer/ai/melee_combat/proc/Aggro  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:300)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/melee_combat/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "summon_backup", 15, 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/ai/melee_combat/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/swarmer.dm:305)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/ai/melee_combat/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.op(f, "Prob", [], [35]))) {
			yield* g.srcCall(f, "StartAction", 30);
			yield* g.srcCall(f, "DisperseTarget", rt.sv(f, "target"));
		} else {
			yield* g.callName(f, (L = rt.sv(f, "target")), "attack_animal", [live(f.src)]);
			yield* g.callName(f, live(L), "electrocute_act", [null, 10, null, live(f.src), "safety", 1], rt.Args.Named);
		}
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true);
