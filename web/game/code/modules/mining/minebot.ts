// From code/modules/mining/minebot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4919, "/mob/living/simple_animal/hostile/mining_drone", "/mob/living/simple_animal/hostile", {
	mode: 1,
	light_on: 0,
	toggle_light_action: null,
	toggle_mode_action: null,
	dump_ore_action: null,
	name: "nanotrasen minebot",
	desc: "The instructions printed on the side read: This is a small robot used to support miners, can be set to search and collect loose ore, or to help fend off wildlife. A mining scanner can instruct it to drop loose ore. Field repairs can be done with a welder.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "mining_drone",
	icon_living: "mining_drone",
	status_flags: 11,
	mouse_opacity: 1,
	faction: null,
	a_intent: "harm",
	atmos_requirements: null,
	minbodytemp: 0,
	wander: 0,
	idle_vision_range: 5,
	move_to_delay: 10,
	retreat_distance: 1,
	minimum_distance: 2,
	health: 125,
	maxHealth: 125,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	obj_damage: 0,
	environment_smash: 0,
	check_friendly_fire: 1,
	stop_automated_movement_when_pulled: 1,
	attacktext: "drills",
	attack_sound: rt.rsc("sound/weapons/circsawhit.ogg"),
	ranged: 1,
	sentience_type: 4,
	ranged_message: "shoots",
	ranged_cooldown_time: 30,
	projectiletype: rt.typePath("/obj/item/projectile/kinetic"),
	projectilesound: rt.rsc("sound/weapons/gunshot4.ogg"),
	speak_emote: null,
	wanted_objects: null,
	healable: 0,
});

// /mob/living/simple_animal/hostile/mining_drone/proc/<init>  (code/modules/mining/minebot.dm:13)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("neutral"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("states"));
	$0 = $0;
	rt.setSv(f, "wanted_objects", rt.list(T("/obj/item/weapon/ore/diamond"), T("/obj/item/weapon/ore/gold"), T("/obj/item/weapon/ore/silver"), T("/obj/item/weapon/ore/plasma"), T("/obj/item/weapon/ore/uranium"), T("/obj/item/weapon/ore/iron"), T("/obj/item/weapon/ore/bananium"), T("/obj/item/weapon/ore/titanium")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/mining_drone/proc/Initialize  (code/modules/mining/minebot.dm:51)  may sleep
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "toggle_light_action", (yield* g.new_(f, T("/datum/action/innate/minedrone/toggle_light"), [])));
	yield* g.callName(f, rt.sv(f, "toggle_light_action"), "Grant", [live(f.src)]);
	rt.setSv(f, "toggle_mode_action", (yield* g.new_(f, T("/datum/action/innate/minedrone/toggle_mode"), [])));
	yield* g.callName(f, rt.sv(f, "toggle_mode_action"), "Grant", [live(f.src)]);
	rt.setSv(f, "dump_ore_action", (yield* g.new_(f, T("/datum/action/innate/minedrone/dump_ore"), [])));
	yield* g.callName(f, rt.sv(f, "dump_ore_action"), "Grant", [live(f.src)]);
	yield* g.srcCall(f, "SetCollectBehavior");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mining_drone/proc/attackby  (code/modules/mining/minebot.dm:66)  may sleep
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "welding", (W = live(f.args[0])))) && !truthy(rt.sv(f, "stat")))) {
			if ((!isEqual(rt.sv(f, "AIStatus"), 3) && !isEqual(rt.sv(f, "AIStatus"), 2))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>＀ is moving around too much to repair!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (isEqual(rt.sv(f, "maxHealth"), rt.sv(f, "health"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>＀ is at full integrity.</span>", [live(f.src)])]);
			} else {
				if (truthy((yield* g.callName(f, live(W), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.srcCall(f, "adjustBruteLoss", -10);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>You repair some of the armor on ＀.</span>", [live(f.src)])]);
				}
			}
			return live(f.dot);
		}
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mining_scanner")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/t_scanner/adv_mining_scanner")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>You instruct ＀ to drop any collected ore.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "DropOre");
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /mob/living/simple_animal/hostile/mining_drone/proc/death  (code/modules/mining/minebot.dm:86)  may sleep
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/death", function* death(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is destroyed!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/robot_debris"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.srcCall(f, "DropOre", 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /mob/living/simple_animal/hostile/mining_drone/proc/attack_hand  (code/modules/mining/minebot.dm:94)  may sleep
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/attack_hand", function* attack_hand(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help")) {
		yield* g.srcCall(f, "toggle_mode");
		$0 = rt.sv(f, "mode");
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>＀ has been set to search and store loose ore.</span>", [live(f.src)])]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>＀ has been set to attack hostile wildlife.</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/mining_drone/proc/SetCollectBehavior  (code/modules/mining/minebot.dm:112)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/SetCollectBehavior", function SetCollectBehavior(f: Frame) {
	rt.setSv(f, "mode", 1);
	rt.setSv(f, "idle_vision_range", 9);
	rt.setSv(f, "search_objects", 2);
	rt.setSv(f, "wander", 1);
	rt.setSv(f, "ranged", 0);
	rt.setSv(f, "minimum_distance", 1);
	rt.setSv(f, "retreat_distance", null);
	rt.setSv(f, "icon_state", "mining_drone");
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>You are set to collect mode. You can now collect loose ore.</span>"]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/mining_drone/proc/SetOffenseBehavior  (code/modules/mining/minebot.dm:123)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/SetOffenseBehavior", function SetOffenseBehavior(f: Frame) {
	rt.setSv(f, "mode", 2);
	rt.setSv(f, "idle_vision_range", 7);
	rt.setSv(f, "search_objects", 0);
	rt.setSv(f, "wander", 0);
	rt.setSv(f, "ranged", 1);
	rt.setSv(f, "retreat_distance", 1);
	rt.setSv(f, "minimum_distance", 2);
	rt.setSv(f, "icon_state", "mining_drone_offense");
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>You are set to attack mode. You can now attack from range.</span>"]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/mining_drone/proc/AttackingTarget  (code/modules/mining/minebot.dm:127)  may sleep
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if ((truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/weapon/ore")) ? 1 : 0)) && isEqual(rt.sv(f, "mode"), 1))) {
		yield* g.srcCall(f, "CollectOre");
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/mining_drone/proc/CollectOre  (code/modules/mining/minebot.dm:134)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/CollectOre", function CollectOre(f: Frame) {
	let O: Value = null, dir: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [O, dir, _T, $e];
	O = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "loc", live(O), live(f.src));
	}
	rt.endFor(f, 0);
	dir = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		rt.forList(f, 1, (_T = rt.getStep(f, live(f.src), live(dir))), T("/obj/item/weapon/ore"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			rt.setFv(f, "loc", live(O), live(f.src));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/mining_drone/proc/DropOre  (code/modules/mining/minebot.dm:143)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/DropOre", function DropOre(f: Frame, message: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [message, O, $e];
	if (live(message) === null) {
		message = 1;
	}
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) {
		if (truthy(live(message))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You attempt to dump your stored ore, but you have none.</span>"]);
		}
		return live(f.dot);
	}
	if (truthy(live(message))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You dump your stored ore.</span>"]);
	}
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		(rt.modSrcVar(f, "contents", live(O), subtract));
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/mining_drone/proc/adjustHealth  (code/modules/mining/minebot.dm:155)  may sleep
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if ((!isEqual(rt.sv(f, "mode"), 2) && rt.gt(live(f.args[0]), 0))) {
		yield* g.srcCall(f, "SetOffenseBehavior");
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount"] });

// /mob/living/simple_animal/hostile/mining_drone/proc/toggle_mode  (code/modules/mining/minebot.dm:160)
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/toggle_mode", function toggle_mode(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.callSrc(f, "SetOffenseBehavior", []);
	} else if ($0 === 2) {
		rt.callSrc(f, "SetCollectBehavior", []);
	} else {
		rt.setSv(f, "mode", 1);
		rt.callSrc(f, "SetCollectBehavior", []);
	}
	return f.dot;
});

rt.type(146, "/datum/action/innate/minedrone/toggle_light", "/datum/action/innate/minedrone", {
	name: "Toggle Light",
	button_icon_state: "mech_lights_off",
});

// /datum/action/innate/minedrone/toggle_light/proc/Activate  (code/modules/mining/minebot.dm:180)
rt.def("/datum/action/innate/minedrone/toggle_light/proc/Activate", function Activate(f: Frame) {
	let user: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (truthy(rt.gv(f, "light_on", (user = rt.sv(f, "owner"))))) {
		rt.callName(f, live(user), "set_light", [0]);
	} else {
		rt.callName(f, live(user), "set_light", [6]);
	}
	rt.setFv(f, "light_on", live(user), (!truthy(rt.fv(f, "light_on", live(user))) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.fv(f, "light_on", live(user)))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You toggle your light ＀.</span>", [$1])]);
	return f.dot;
});

rt.type(147, "/datum/action/innate/minedrone/toggle_mode", "/datum/action/innate/minedrone", {
	name: "Toggle Mode",
	button_icon_state: "mech_cycle_equip_off",
});

// /datum/action/innate/minedrone/toggle_mode/proc/Activate  (code/modules/mining/minebot.dm:194)
rt.def("/datum/action/innate/minedrone/toggle_mode/proc/Activate", function Activate(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	rt.callName(f, (user = rt.sv(f, "owner")), "toggle_mode", []);
	return f.dot;
});

rt.type(148, "/datum/action/innate/minedrone/dump_ore", "/datum/action/innate/minedrone", {
	name: "Dump Ore",
	button_icon_state: "mech_eject",
});

// /datum/action/innate/minedrone/dump_ore/proc/Activate  (code/modules/mining/minebot.dm:202)
rt.def("/datum/action/innate/minedrone/dump_ore/proc/Activate", function Activate(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	rt.callName(f, (user = rt.sv(f, "owner")), "DropOre", []);
	return f.dot;
});

rt.type(9397, "/obj/item/device/mine_bot_ugprade", "/obj/item/device", {
	name: "minebot melee upgrade",
	desc: "A minebot upgrade.",
	icon_state: "door_electronics",
	icon: rt.rsc("icons/obj/module.dmi"),
});

// /obj/item/device/mine_bot_ugprade/proc/afterattack  (code/modules/mining/minebot.dm:217)  may sleep
rt.def("/obj/item/device/mine_bot_ugprade/proc/afterattack", function* afterattack(f: Frame, M: Value, user: Value, proximity: Value) {
	f.vars = () => [M, user, proximity];
	if ((!truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/mining_drone")) ? 1 : 0)) || !truthy(live(proximity)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "upgrade_bot", live(M), live(user));
	return f.dot;
}, true);

// /obj/item/device/mine_bot_ugprade/proc/upgrade_bot  (code/modules/mining/minebot.dm:222)  may sleep
rt.def("/obj/item/device/mine_bot_ugprade/proc/upgrade_bot", function* upgrade_bot(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (!isEqual(rt.fv(f, "melee_damage_upper", live(M)), rt.initial(f, live(M), "melee_damage_upper"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ already has a combat upgrade installed!", [live(f.src)])]);
		return live(f.dot);
	}
	rt.setFv(f, "melee_damage_lower", live(M), 22);
	rt.setFv(f, "melee_damage_upper", live(M), 22);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9398, "/obj/item/device/mine_bot_ugprade/health", "/obj/item/device/mine_bot_ugprade", {
	name: "minebot chassis upgrade",
});

// /obj/item/device/mine_bot_ugprade/health/proc/upgrade_bot  (code/modules/mining/minebot.dm:235)  may sleep
rt.def("/obj/item/device/mine_bot_ugprade/health/proc/upgrade_bot", function* upgrade_bot(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (!isEqual(rt.fv(f, "maxHealth", live(M)), rt.initial(f, live(M), "maxHealth"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ already has a reinforced chassis!", [live(f.src)])]);
		return live(f.dot);
	}
	rt.setFv(f, "maxHealth", live(M), 170);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9399, "/obj/item/device/mine_bot_ugprade/cooldown", "/obj/item/device/mine_bot_ugprade", {
	name: "minebot cooldown upgrade",
});

// /obj/item/device/mine_bot_ugprade/cooldown/proc/upgrade_bot  (code/modules/mining/minebot.dm:248)  may sleep
rt.def("/obj/item/device/mine_bot_ugprade/cooldown/proc/upgrade_bot", function* upgrade_bot(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	rt.setSv(f, "name", "minebot cooldown upgrade");
	if (!isEqual(rt.fv(f, "ranged_cooldown_time", live(M)), rt.initial(f, live(M), "ranged_cooldown_time"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ already has a decreased weapon cooldown!", [live(f.src)])]);
		return live(f.dot);
	}
	rt.setFv(f, "ranged_cooldown_time", live(M), 10);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
