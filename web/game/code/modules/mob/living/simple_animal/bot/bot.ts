// From code/modules/mob/living/simple_animal/bot/bot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5032, "/mob/living/simple_animal/bot", "/mob/living/simple_animal", {
	bot_core: null,
	users: null,
	window_id: "bot_control",
	window_name: "Protobot 1.0",
	window_width: 0,
	window_height: 0,
	paicard: null,
	allow_pai: 1,
	bot_name: null,
	player_access: null,
	emagged: 0,
	prev_access: null,
	on: 1,
	open: 0,
	locked: 1,
	hacked: 0,
	text_hack: "",
	text_dehack: "",
	text_dehack_fail: "",
	declare_message: "",
	frustration: 0,
	base_speed: 2,
	ai_waypoint: null,
	path: null,
	pathset: 0,
	ignore_list: null,
	mode: 0,
	tries: 0,
	remote_disabled: 0,
	calling_ai: null,
	Radio: null,
	radio_key: null,
	radio_channel: "Common",
	auto_patrol: 0,
	patrol_target: null,
	summon_target: null,
	new_destination: null,
	destination: null,
	next_destination: null,
	shuffle: 0,
	blockcount: 0,
	awaiting_beacon: 0,
	nearest_beacon: null,
	nearest_beacon_loc: null,
	beacon_freq: 1445,
	model: "",
	bot_type: 0,
	data_hud_type: 5,
	mode_name: null,
	bot_core_type: rt.typePath("/obj/machinery/bot_core"),
	verb_say: "states",
	verb_ask: "queries",
	verb_exclaim: "declares",
	verb_yell: "alarms",
	initial_language_holder: rt.typePath("/datum/language_holder/synthetic"),
	hud_possible: null,
	icon: rt.rsc("icons/mob/aibots.dmi"),
	layer: 4,
	gender: "neuter",
	luminosity: 3,
	stop_automated_movement: 1,
	wander: 0,
	healable: 0,
	damage_coeff: null,
	atmos_requirements: null,
	maxbodytemp: 1e+31,
	minbodytemp: 0,
	has_unlimited_silicon_privilege: 1,
	sentience_type: 2,
	status_flags: 0,
	bubble_icon: "machine",
	faction: null,
});

// /mob/living/simple_animal/bot/proc/<init>  (code/modules/mob/living/simple_animal/bot/bot.dm:30)
rt.def("/mob/living/simple_animal/bot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "users", rt.list());
	$0 = $0;
	rt.setSv(f, "player_access", rt.list());
	$0 = $0;
	rt.setSv(f, "prev_access", rt.list());
	$0 = $0;
	rt.setSv(f, "path", rt.list());
	$0 = $0;
	rt.setSv(f, "ignore_list", rt.list());
	rt.setSv(f, "mode_name", rt.list("In Pursuit", "Preparing to Arrest", "Arresting", "Beginning Patrol", "Patrolling", "Summoned by PDA", "Cleaning", "Repairing", "Proceeding to work site", "Healing", "Proceeding to AI waypoint", "Navigating to Delivery Location", "Navigating to Home", "Waiting for clear path", "Calculating navigation path", "Pinging beacon network", "Unable to reach destination"));
	rt.setSv(f, "hud_possible", rt.list("8", "12", "9"));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "faction", rt.list("neutral", "silicon", "turret"));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/get_mode  (code/modules/mob/living/simple_animal/bot/bot.dm:93)
rt.def("/mob/living/simple_animal/bot/proc/get_mode", function get_mode(f: Frame) {
	if (truthy(rt.sv(f, "client"))) {
		if (truthy(rt.sv(f, "paicard"))) {
			return "<b>pAI Controlled</b>";
		}
		return "<b>Autonomous</b>";
	} else {
		if (!truthy(rt.sv(f, "on"))) {
			return "<span class='bad'>Inactive</span>";
		}
		if (!truthy(rt.sv(f, "mode"))) {
			return "<span class='good'>Idle</span>";
		}
		return fmt("<span class='average'>＀</span>", [rt.index(rt.sv(f, "mode_name"), rt.sv(f, "mode"))]);
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/turn_on  (code/modules/mob/living/simple_animal/bot/bot.dm:107)
rt.def("/mob/living/simple_animal/bot/proc/turn_on", function turn_on(f: Frame) {
	if (truthy(rt.sv(f, "stat"))) {
		return 0;
	}
	rt.setSv(f, "on", 1);
	rt.callSrc(f, "set_light", [rt.initial(f, live(f.src), "light_range")]);
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "diag_hud_set_botstat", []);
	return 1;
});

// /mob/living/simple_animal/bot/proc/turn_off  (code/modules/mob/living/simple_animal/bot/bot.dm:114)
rt.def("/mob/living/simple_animal/bot/proc/turn_off", function turn_off(f: Frame) {
	rt.setSv(f, "on", 0);
	rt.callSrc(f, "set_light", [0]);
	rt.callSrc(f, "bot_reset", []);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/Initialize  (code/modules/mob/living/simple_animal/bot/bot.dm:119)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.vars = () => [diag_hud];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "access_card", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)])));
	rt.modField(f, rt.sv(f, "access_card"), "access", 29, add);
	yield* g.srcCall(f, "set_custom_texts");
	rt.setSv(f, "Radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	if (truthy(rt.sv(f, "radio_key"))) {
		rt.setFv(f, "keyslot", rt.sv(f, "Radio"), (yield* g.new_(f, rt.sv(f, "radio_key"), [])));
	}
	rt.setFv(f, "subspace_transmission", rt.sv(f, "Radio"), 1);
	rt.setFv(f, "canhear_range", rt.sv(f, "Radio"), 0);
	yield* g.callName(f, rt.sv(f, "Radio"), "recalculateChannels", []);
	rt.setSv(f, "bot_core", (yield* g.new_(f, rt.sv(f, "bot_core_type"), [live(f.src)])));
	yield* g.srcCall(f, "prepare_huds");
	yield* g.callName(f, (diag_hud = rt.index(rt.gl("huds"), 5)), "add_to_hud", [live(f.src)]);
	yield* g.srcCall(f, "diag_hud_set_bothealth");
	yield* g.srcCall(f, "diag_hud_set_botstat");
	yield* g.srcCall(f, "diag_hud_set_botmode");
	yield* g.srcCall(f, "activate_data_hud");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/update_canmove  (code/modules/mob/living/simple_animal/bot/bot.dm:146)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/update_canmove", function* update_canmove(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "on"))) {
		f.dot = 0;
	}
	rt.setSv(f, "canmove", live(f.dot));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/Destroy  (code/modules/mob/living/simple_animal/bot/bot.dm:153)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "paicard"))) {
		yield* g.srcCall(f, "ejectpai");
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "Radio")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "access_card")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bot_core")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/bot/proc/death  (code/modules/mob/living/simple_animal/bot/bot.dm:163)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/death", function* death(f: Frame) {
	yield* g.srcCall(f, "explode");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/bot/proc/explode  (code/modules/mob/living/simple_animal/bot/bot.dm:167)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/explode", function* explode(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/emag_act  (code/modules/mob/living/simple_animal/bot/bot.dm:173)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "locked"))) {
		rt.setSv(f, "locked", 0);
		rt.setSv(f, "emagged", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You bypass ＀'s controls.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "locked")) && truthy(rt.sv(f, "open")))) {
		rt.setSv(f, "emagged", 2);
		rt.setSv(f, "remote_disabled", 1);
		rt.setSv(f, "locked", 1);
		yield* g.srcCall(f, "bot_reset");
		yield* g.srcCall(f, "turn_on");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>(#$*#$^^( OVERRIDE DETECTED</span>"]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(f.src), "emagged"]);
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to open maintenance panel first!</span>"]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/examine  (code/modules/mob/living/simple_animal/bot/bot.dm:188)
rt.def("/mob/living/simple_animal/bot/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		if (rt.gt(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 3))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀'s parts look loose.", [live(f.src)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀'s parts look very loose!", [live(f.src)])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ is in pristine condition.", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /mob/living/simple_animal/bot/proc/adjustHealth  (code/modules/mob/living/simple_animal/bot/bot.dm:198)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((rt.gt(live(f.args[0]), 0) && truthy(rt.op(f, "Prob", [], [10])))) {
		yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [rt.sv(f, "loc")]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/bot/proc/updatehealth  (code/modules/mob/living/simple_animal/bot/bot.dm:203)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "diag_hud_set_bothealth");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/bot.dm:214)
rt.def("/mob/living/simple_animal/bot/proc/handle_automated_action", function handle_automated_action(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "diag_hud_set_botmode", []);
	if ((!truthy(rt.sv(f, "on")) || truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 11) {
		rt.callSrc(f, "call_mode", []);
		return live(f.dot);
	} else if ($0 === 6) {
		rt.callSrc(f, "bot_summon", []);
		return live(f.dot);
	}
	return 1;
}, false, { waitfor: false });

// /mob/living/simple_animal/bot/proc/attack_hand  (code/modules/mob/living/simple_animal/bot/bot.dm:230)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help")) {
		yield* g.srcCall(f, "interact", live(f.args[0]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H"] });

// /mob/living/simple_animal/bot/proc/attack_ai  (code/modules/mob/living/simple_animal/bot/bot.dm:236)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "topic_denied", live(user))))) {
		yield* g.srcCall(f, "interact", live(user));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s interface is not responding!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/interact  (code/modules/mob/living/simple_animal/bot/bot.dm:242)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "show_controls", live(user));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/attackby  (code/modules/mob/living/simple_animal/bot/bot.dm:245)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "locked"))) {
			rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "open"))) {
				$1 = "opened";
			} else {
				$1 = "closed";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The maintenance panel is now ＀.</span>", [$1])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The maintenance panel is locked.</span>"]);
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0)))) {
			if (((truthy((yield* g.callName(f, rt.sv(f, "bot_core"), "allowed", [live(f.args[1])]))) && !truthy(rt.sv(f, "open"))) && !truthy(rt.sv(f, "emagged")))) {
				rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "locked"))) {
					$1 = "locked.";
				} else {
					$1 = "unlocked.";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Controls are now ＀", [$1])]);
			} else {
				if (truthy(rt.sv(f, "emagged"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>ERROR</span>"]);
				}
				if (truthy(rt.sv(f, "open"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Please close the access panel before locking it.</span>"]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Access denied.</span>"]);
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/paicard")) ? 1 : 0))) {
				yield* g.srcCall(f, "insertpai", live(f.args[1]), live(f.args[0]));
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hemostat")) ? 1 : 0)) && truthy(rt.sv(f, "paicard")))) {
					if (truthy(rt.sv(f, "open"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Close the access panel before manipulating the personality slot!</span>"]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attempt to pull ＀ free...</span>", [rt.sv(f, "paicard")])]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
							if (truthy(rt.sv(f, "paicard"))) {
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ uses ＀ to pull ＀ out of ＀!</span>", [live(f.args[1]), live(f.args[0]), rt.sv(f, "paicard"), rt.sv(f, "bot_name")]), fmt("<span class='notice'>You pull ＀ out of ＀ with ＀.</span>", [rt.sv(f, "paicard"), rt.sv(f, "bot_name"), live(f.args[0])])]);
								yield* g.srcCall(f, "ejectpai", live(f.args[1]));
							}
						}
					}
				} else {
					yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
						if (rt.ge(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ does not need a repair!</span>", [live(f.src)])]);
							return live(f.dot);
						}
						if (!truthy(rt.sv(f, "open"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Unable to repair with the maintenance panel closed!</span>"]);
							return live(f.dot);
						}
						if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
							yield* g.srcCall(f, "adjustHealth", -10);
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ repairs ＀!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The welder must be on for this task!</span>"]);
						}
					} else {
						if (truthy(rt.fv(f, "force", live(f.args[0])))) {
							yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
						}
						yield* g.callSuper(f, [], rt.Args.Same);
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/bot/proc/bullet_act  (code/modules/mob/living/simple_animal/bot/bot.dm:294)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/bullet_act", function* bullet_act(f: Frame) {
	if ((truthy(live(f.args[0])) && (isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute") || isEqual(rt.fv(f, "damage_type", live(f.args[0])), "fire")))) {
		if ((truthy(rt.op(f, "Prob", [], [75])) && rt.gt(rt.fv(f, "damage", live(f.args[0])), 0))) {
			yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["Proj"] });

// /mob/living/simple_animal/bot/proc/emp_act  (code/modules/mob/living/simple_animal/bot/bot.dm:300)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let was_on: Value = null;
	f.vars = () => [severity, was_on];
	was_on = rt.sv(f, "on");
	(rt.modSrcVar(f, "stat", 16, rt.bitOr));
	yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.sv(f, "loc")]);
	if (truthy(rt.sv(f, "paicard"))) {
		yield* g.callName(f, rt.sv(f, "paicard"), "emp_act", [live(severity)]);
		yield* g.callName(f, live(f.src), "visible_message", [fmt("＀ is flies out of ＀!", [rt.sv(f, "paicard"), rt.sv(f, "bot_name")]), fmt("<span class='warning'>You are forcefully ejected from ＀!</span>", [rt.sv(f, "bot_name")])]);
		yield* g.srcCall(f, "ejectpai", 0);
	}
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "turn_off");
	}
	rt.spawnTail(f, multiply(live(severity), 300), "/mob/living/simple_animal/bot/proc/emp_act: spawn at modules/mob/living/simple_animal/bot/bot.dm:309", severity, was_on);
	return f.dot;
}, true);

// a spawn(multiply(live(severity), 300)) body of /mob/living/simple_animal/bot/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/emp_act: spawn at modules/mob/living/simple_animal/bot/bot.dm:309", function* (f: Frame, severity: Value, was_on: Value) {
	f.vars = () => [severity, was_on];
	(rt.modSrcVar(f, "stat", 16777199, rt.bitAnd));
	if (truthy(live(was_on))) {
		yield* g.srcCall(f, "turn_on");
	}
	return null;
});

// /mob/living/simple_animal/bot/proc/set_custom_texts  (code/modules/mob/living/simple_animal/bot/bot.dm:315)
rt.def("/mob/living/simple_animal/bot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	rt.setSv(f, "text_hack", fmt("You hack ＀.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack", fmt("You reset ＀.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack_fail", fmt("You fail to reset ＀.", [rt.sv(f, "name")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/speak  (code/modules/mob/living/simple_animal/bot/bot.dm:320)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/speak", function* speak(f: Frame, message: Value, channel: Value) {
	f.vars = () => [message, channel];
	if ((!truthy(rt.sv(f, "on")) || !truthy(live(message)))) {
		return live(f.dot);
	}
	if ((truthy(live(channel)) && truthy(rt.index(rt.fv(f, "channels", rt.sv(f, "Radio")), live(channel))))) {
		yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), live(message), live(channel), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
	} else {
		yield* g.srcCall(f, "say", live(message));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/get_spans  (code/modules/mob/living/simple_animal/bot/bot.dm:328)
rt.def("/mob/living/simple_animal/bot/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /mob/living/simple_animal/bot/proc/radio  (code/modules/mob/living/simple_animal/bot/bot.dm:331)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/radio", function* radio(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 0)) {
		return live(f.dot);
	}
	$0 = live(f.args[1]);
	if ($0 === "headset") {
		yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), live(f.args[0]), null, live(f.args[2]), live(f.args[3])]);
		return 2;
	} else if ($0 === "department") {
		yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
		return 2;
	}
	if (truthy((rt.isIn(f, live(f.args[1]), rt.gl("radiochannels")) ? 1 : 0))) {
		yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
		return 2;
	}
	return 0;
}, true, { args: ["message", "message_mode", "spans", "language"] });

// Speed: for a scan that looks for mobs (medbot patients, cleanbots going after mobs), true if some mob of scan_type might be inside
// view(scan_range, src) or on an adjacent turf: same z, within scan_range of src's turf (view is a square box). Reads the atoms'
// loc/x/y/z/type directly. Conservative: any doubt (src not on a turf, odd range) says true, so the real scan runs.
const botMobTypeOk = new Map();
function botScanTurf(o: any) {
	let t = o;
	for (let i = 0; i < 20 && t !== null && t !== undefined && t.x === 0; i++) t = t.loc;
	return t === undefined ? null : t;
}
function botScanMobCandidate(f: Frame, scan_type: any, scan_range: any) {
	if (typeof scan_range !== "number" || !(scan_range >= 1)) return true;
	if (scan_type === null || typeof scan_type !== "object" || typeof scan_type.isSubtypeOf !== "function") return true;
	const mobT = T("/mob");
	let isMob = botMobTypeOk.get(scan_type);
	if (isMob === undefined) { isMob = scan_type.isSubtypeOf(mobT); botMobTypeOk.set(scan_type, isMob); }
	if (!isMob) return true;
	const st = botScanTurf(live(f.src));
	if (st === null || !(st.x > 0)) return true;
	const sx = st.x, sy = st.y, sz = st.z;
	const ml: any = live(rt.gl("mob_list"));
	const items = ml.items;
	for (let i = 0; i < items.length; i++) {
		const m = items[i];
		if (m === null || typeof m !== "object" || m.deleted) continue;
		if (!m.type.isSubtypeOf(scan_type)) continue;
		const t = botScanTurf(m);
		if (t === null) continue; // in nullspace (a preview mannequin): never in view()
		if (!(t.x > 0)) return true;
		if (t.z === sz && Math.abs(t.x - sx) <= scan_range && Math.abs(t.y - sy) <= scan_range) return true;
	}
	return false;
}

// /mob/living/simple_animal/bot/proc/scan  (code/modules/mob/living/simple_animal/bot/bot.dm:362)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/scan", function* scan(f: Frame, scan_type: Value, old_target: Value, scan_range: Value) {
	let _T: Value = null, adjacent: Value = null, scan: Value = null, final_result: Value = null, turfy: Value = null, deepscan: Value = null, final_result_5: Value = null;
	let $e: any;
	f.vars = () => [scan_type, old_target, scan_range, _T, adjacent, scan, final_result, turfy, deepscan, final_result_5, $e];
	if (live(scan_range) === null) {
		scan_range = 7;
	}
	if (!botScanMobCandidate(f, live(scan_type), live(scan_range))) {
		if (truthy(rt.sv(f, "shuffle"))) rt.setSv(f, "shuffle", 0);
		return live(f.dot);
	}
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	adjacent = (yield* g.callName(f, live(_T), "GetAtmosAdjacentTurfs", [1]));
	if (truthy(rt.sv(f, "shuffle"))) {
		adjacent = (yield* g.call(f, P("/proc/shuffle"), null, [live(adjacent)]));
		rt.setSv(f, "shuffle", 0);
	}
	scan = null;
	rt.forList(f, 0, live(adjacent));
	while (($e = rt.next(f, 0)) !== undefined) {
		scan = $e;
		if (truthy((yield* g.srcCall(f, "check_bot", live(scan))))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(scan_type)])))) {
			if (truthy((final_result = (yield* g.srcCall(f, "checkscan", live(scan), live(scan_type), live(old_target)))))) {
				return live(final_result);
			}
		} else {
			turfy = live(scan);
			deepscan = null;
			rt.forList(f, 1, rt.fv(f, "contents", live(turfy)));
			while (($e = rt.next(f, 1)) !== undefined) {
				deepscan = $e;
				if (truthy((final_result_5 = (yield* g.srcCall(f, "checkscan", live(deepscan), live(scan_type), live(old_target)))))) {
					return live(final_result_5);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	scan = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/shuffle"), null, [(yield* g.call(f, P("/proc/view"), null, [live(scan_range), live(f.src)]))])), live(adjacent)));
	while (($e = rt.next(f, 0)) !== undefined) {
		scan = $e;
		if (truthy((final_result = (yield* g.srcCall(f, "checkscan", live(scan), live(scan_type), live(old_target)))))) {
			return live(final_result);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/checkscan  (code/modules/mob/living/simple_animal/bot/bot.dm:388)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/checkscan", function* checkscan(f: Frame, scan: Value, scan_type: Value, old_target: Value) {
	let scan_result: Value = null;
	f.vars = () => [scan, scan_type, old_target, scan_result];
	if (!truthy(rt.op(f, "IsType", [], [live(scan), live(scan_type)]))) {
		return 0;
	}
	if ((truthy((rt.isIn(f, live(scan), rt.sv(f, "ignore_list")) ? 1 : 0)) || isEqual(live(scan), live(old_target)))) {
		return 0;
	}
	if (truthy((scan_result = (yield* g.srcCall(f, "process_scan", live(scan)))))) {
		return live(scan_result);
	} else {
		return 0;
	}
	return live(f.dot);
}, true);

// /mob/living/simple_animal/bot/proc/check_bot  (code/modules/mob/living/simple_animal/bot/bot.dm:401)
rt.def("/mob/living/simple_animal/bot/proc/check_bot", function check_bot(f: Frame, targ: Value) {
	let _T: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, C, $e];
	if (!truthy((_T = rt.getStep(f, live(targ), 0)))) return f.dot;
	C = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(_T)));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((truthy(rt.op(f, "IsType", [], [live(C), rt.sv(f, "type")])) && !isEqual(live(C), live(f.src)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/add_to_ignore  (code/modules/mob/living/simple_animal/bot/bot.dm:413)
rt.def("/mob/living/simple_animal/bot/proc/add_to_ignore", function add_to_ignore(f: Frame, subject: Value) {
	if (rt.lt(rt.len(f, rt.sv(f, "ignore_list")), 50)) {
		(rt.modSrcVar(f, "ignore_list", live(subject), rt.bitOr));
	} else {
		if (!rt.ge(rt.len(f, rt.sv(f, "ignore_list")), live(subject))) return f.dot;
		(rt.modSrcVar(f, "ignore_list", rt.index(rt.sv(f, "ignore_list"), 1), subtract));
		(rt.modSrcVar(f, "ignore_list", live(subject), rt.bitOr));
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/bot_move  (code/modules/mob/living/simple_animal/bot/bot.dm:425)
rt.def("/mob/living/simple_animal/bot/proc/bot_move", function bot_move(f: Frame, dest: Value, move_speed: Value) {
	let last_node: Value = null, step_count: Value = null, step_number: Value = null;
	let $0: any;
	f.vars = () => [dest, last_node, step_count, step_number, $0];
	if (((!truthy(live(dest)) || !truthy(rt.sv(f, "path"))) || isEqual(rt.len(f, rt.sv(f, "path")), 0))) {
		rt.setSv(f, "path", rt.list());
		return 0;
	}
	dest = rt.getStep(f, live(dest), 0);
	last_node = rt.getStep(f, rt.index(rt.sv(f, "path"), rt.len(f, rt.sv(f, "path"))), 0);
	if (isEqual(rt.getStep(f, live(f.src), 0), live(dest))) {
		return 1;
	} else {
		if (!isEqual(live(dest), live(last_node))) {
			rt.setSv(f, "path", rt.list());
			return 0;
		}
	}
	if (truthy(live(move_speed))) {
		$0 = live(move_speed);
	} else {
		$0 = rt.sv(f, "base_speed");
	}
	if ((rt.ge((step_count = $0), 1) && rt.lt(rt.sv(f, "tries"), 5))) {
		step_number = null;
		step_number = 0;
		while (rt.lt(live(step_number), live(step_count))) {
			rt.spawnTail(f, multiply(4, live(step_number)), "/mob/living/simple_animal/bot/proc/bot_move: spawn at modules/mob/living/simple_animal/bot/bot.dm:439", dest, move_speed, last_node, step_count, step_number);
			step_number = rt.inc(live(step_number), 1);
		}
	} else {
		return 0;
	}
	return 1;
});

// a spawn(multiply(4, live(step_number))) body of /mob/living/simple_animal/bot/proc/bot_move, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/bot_move: spawn at modules/mob/living/simple_animal/bot/bot.dm:439", function* (f: Frame, dest: Value, move_speed: Value, last_node: Value, step_count: Value, step_number: Value) {
	f.vars = () => [dest, move_speed, last_node, step_count, step_number];
	yield* g.srcCall(f, "bot_step", live(dest));
	return null;
});

// /mob/living/simple_animal/bot/proc/bot_step  (code/modules/mob/living/simple_animal/bot/bot.dm:447)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/bot_step", function* bot_step(f: Frame, dest: Value) {
	f.vars = () => [dest];
	if (!truthy(rt.sv(f, "path"))) {
		return 0;
	}
	if (rt.gt(rt.len(f, rt.sv(f, "path")), 1)) {
		yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), rt.index(rt.sv(f, "path"), 1)]);
		if (isEqual(rt.getStep(f, live(f.src), 0), rt.index(rt.sv(f, "path"), 1))) {
			(rt.modSrcVar(f, "path", rt.index(rt.sv(f, "path"), 1), subtract));
			rt.setSv(f, "tries", 0);
		} else {
			rt.incSrcVar(f, "tries", 1, true);
			return 0;
		}
	} else {
		if (isEqual(rt.len(f, rt.sv(f, "path")), 1)) {
			yield* g.call(f, P("/proc/step_to"), null, [live(f.src), live(dest)]);
			rt.setSv(f, "path", rt.list());
		}
	}
	return 1;
}, true);

// /mob/living/simple_animal/bot/proc/check_bot_access  (code/modules/mob/living/simple_animal/bot/bot.dm:464)
rt.def("/mob/living/simple_animal/bot/proc/check_bot_access", function check_bot_access(f: Frame) {
	if (!(!isEqual(rt.sv(f, "mode"), 6) && !isEqual(rt.sv(f, "mode"), 11))) return f.dot;
	rt.setFv(f, "access", rt.sv(f, "access_card"), rt.sv(f, "prev_access"));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/call_bot  (code/modules/mob/living/simple_animal/bot/bot.dm:468)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/call_bot", function* call_bot(f: Frame, caller: Value, waypoint: Value, message: Value) {
	let end_area: Value = null, all_access: Value = null, All: Value = null;
	f.vars = () => [caller, waypoint, message, end_area, all_access, All];
	if (live(message) === null) {
		message = 1;
	}
	yield* g.srcCall(f, "bot_reset");
	end_area = (yield* g.call(f, P("/proc/get_area"), null, [live(waypoint)]));
	if (truthy(rt.sv(f, "client"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='noticebig'>Priority waypoint set by ＀ <b>＀</b>. Proceed to <b>＀<>.", [(yield* g.call(f, P("/proc/bicon"), null, [live(caller)])), live(caller), rt.fv(f, "name", live(end_area))])]);
	}
	all_access = (yield* g.new_(f, T("/obj/item/weapon/card/id"), []));
	All = (yield* g.new_(f, T("/datum/job/captain"), []));
	rt.setFv(f, "access", live(all_access), (yield* g.callName(f, live(All), "get_access", [])));
	rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, live(waypoint), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 200, "id", live(all_access)], rt.Args.Named)));
	rt.setSv(f, "calling_ai", live(caller));
	rt.setSv(f, "ai_waypoint", live(waypoint));
	if ((truthy(rt.sv(f, "path")) && truthy(rt.len(f, rt.sv(f, "path"))))) {
		if (!truthy(rt.sv(f, "on"))) {
			yield* g.srcCall(f, "turn_on");
		}
		rt.setSv(f, "access_card", live(all_access));
		if (truthy(live(message))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "calling_ai"), fmt("<span class='notice'>＀ ＀ called to ＀. ＀ meters to destination.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), rt.sv(f, "name"), rt.fv(f, "name", live(end_area)), subtract(rt.len(f, rt.sv(f, "path")), 1)])]);
		}
		rt.setSv(f, "pathset", 1);
		rt.setSv(f, "mode", 11);
		rt.setSv(f, "tries", 0);
	} else {
		if (truthy(live(message))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "calling_ai"), "<span class='danger'>Failed to calculate a valid route. Ensure destination is clear of obstructions and within range.</span>"]);
		}
		rt.setSv(f, "calling_ai", null);
		rt.setSv(f, "path", rt.list());
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/call_mode  (code/modules/mob/living/simple_animal/bot/bot.dm:500)
rt.def("/mob/living/simple_animal/bot/proc/call_mode", function call_mode(f: Frame) {
	let success: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [success, $0, $1, $2];
	if (truthy((success = rt.callSrc(f, "bot_move", [rt.sv(f, "ai_waypoint"), 3])))) return f.dot;
	if (truthy(rt.sv(f, "calling_ai"))) {
		$0 = rt.sv(f, "calling_ai");
		$1 = rt.call(f, P("/proc/bicon"), null, [live(f.src)]);
		if (isEqual(rt.getStep(f, live(f.src), 0), rt.sv(f, "ai_waypoint"))) {
			$2 = fmt("<span class='notice'>＀ successfully arrived to waypoint.</span>", [live(f.src)]);
		} else {
			$2 = fmt("<span class='danger'>＀ failed to reach waypoint.</span>", [live(f.src)]);
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＀ ＀", [$1, $2])]);
		rt.setSv(f, "calling_ai", null);
	}
	rt.callSrc(f, "bot_reset", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/bot.dm:509)
rt.def("/mob/living/simple_animal/bot/proc/bot_reset", function bot_reset(f: Frame) {
	if (truthy(rt.sv(f, "calling_ai"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "calling_ai"), "<span class='danger'>Call command to a bot has been reset.</span>"]);
		rt.setSv(f, "calling_ai", null);
	}
	rt.setSv(f, "path", rt.list());
	rt.setSv(f, "summon_target", null);
	rt.setSv(f, "pathset", 0);
	rt.setFv(f, "access", rt.sv(f, "access_card"), rt.sv(f, "prev_access"));
	rt.setSv(f, "tries", 0);
	rt.setSv(f, "mode", 0);
	rt.callSrc(f, "diag_hud_set_botstat", []);
	rt.callSrc(f, "diag_hud_set_botmode", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/bot_patrol  (code/modules/mob/living/simple_animal/bot/bot.dm:528)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/bot_patrol", function* bot_patrol(f: Frame) {
	yield* g.srcCall(f, "patrol_step");
	rt.spawnTail(f, 5, "/mob/living/simple_animal/bot/proc/bot_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:529");
	return live(f.dot);
}, true);

// a spawn(5) body of /mob/living/simple_animal/bot/proc/bot_patrol, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/bot_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:529", function* (f: Frame) {
	if (isEqual(rt.sv(f, "mode"), 5)) {
		yield* g.srcCall(f, "patrol_step");
	}
	return null;
});

// /mob/living/simple_animal/bot/proc/start_patrol  (code/modules/mob/living/simple_animal/bot/bot.dm:536)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/start_patrol", function* start_patrol(f: Frame) {
	if (rt.ge(rt.sv(f, "tries"), 5)) {
		rt.setSv(f, "auto_patrol", 0);
		rt.setSv(f, "tries", 0);
		yield* g.srcCall(f, "speak", "Unable to start patrol.");
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "auto_patrol"))) {
		rt.setSv(f, "mode", 0);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "patrol_target"))) {
		rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/proc/start_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:548");
	} else {
		yield* g.srcCall(f, "speak", "Engaging patrol mode.");
		yield* g.srcCall(f, "find_patrol_target");
		rt.incSrcVar(f, "tries", 1, true);
	}
	return live(f.dot);
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/proc/start_patrol, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/start_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:548", function* (f: Frame) {
	yield* g.srcCall(f, "calc_path");
	if (isEqual(rt.len(f, rt.sv(f, "path")), 0)) {
		rt.setSv(f, "patrol_target", null);
		return live(f.dot);
	}
	rt.setSv(f, "mode", 5);
	return null;
});

// /mob/living/simple_animal/bot/proc/patrol_step  (code/modules/mob/living/simple_animal/bot/bot.dm:567)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/patrol_step", function* patrol_step(f: Frame) {
	let next: Value = null, moved: Value = null;
	f.vars = () => [next, moved];
	if (truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "patrol_target"))) {
		if (!truthy((yield* g.srcCall(f, "get_next_patrol_target")))) {
			yield* g.srcCall(f, "find_patrol_target");
		}
		return live(f.dot);
	} else {
		if ((rt.gt(rt.len(f, rt.sv(f, "path")), 0) && truthy(rt.sv(f, "patrol_target")))) {
			if (isEqual((next = rt.index(rt.sv(f, "path"), 1)), rt.sv(f, "loc"))) {
				(rt.modSrcVar(f, "path", live(next), subtract));
				return live(f.dot);
			}
			if (!truthy((moved = (yield* g.srcCall(f, "bot_move", rt.sv(f, "patrol_target")))))) {
				rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/proc/patrol_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:582", next, moved);
			}
		} else {
			rt.setSv(f, "mode", 4);
		}
	}
	return f.dot;
}, true);

// a spawn(2) body of /mob/living/simple_animal/bot/proc/patrol_step, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/patrol_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:582", function* (f: Frame, next: Value, moved: Value) {
	f.vars = () => [next, moved];
	yield* g.srcCall(f, "calc_path");
	if (isEqual(rt.len(f, rt.sv(f, "path")), 0)) {
		yield* g.srcCall(f, "find_patrol_target");
	}
	rt.setSv(f, "tries", 0);
	return null;
});

// /mob/living/simple_animal/bot/proc/find_patrol_target  (code/modules/mob/living/simple_animal/bot/bot.dm:595)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/find_patrol_target", function* find_patrol_target(f: Frame) {
	rt.setSv(f, "nearest_beacon", null);
	rt.setSv(f, "new_destination", null);
	yield* g.srcCall(f, "find_nearest_beacon");
	if (truthy(rt.sv(f, "nearest_beacon"))) {
		rt.setSv(f, "patrol_target", rt.sv(f, "nearest_beacon_loc"));
		rt.setSv(f, "destination", rt.sv(f, "next_destination"));
	} else {
		rt.setSv(f, "auto_patrol", 0);
		rt.setSv(f, "mode", 0);
		yield* g.srcCall(f, "speak", "Disengaging patrol mode.");
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/get_next_patrol_target  (code/modules/mob/living/simple_animal/bot/bot.dm:606)
rt.def("/mob/living/simple_animal/bot/proc/get_next_patrol_target", function get_next_patrol_target(f: Frame) {
	let NB: Value = null;
	let $e: any;
	f.vars = () => [NB, $e];
	NB = null;
	rt.forList(f, 0, rt.index(rt.gl("navbeacons"), fmt("＀", [rt.sv(f, "z")])), T("/obj/machinery/navbeacon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		NB = $e;
		if (isEqual(rt.fv(f, "location", live(NB)), rt.sv(f, "next_destination"))) {
			rt.setSv(f, "destination", rt.sv(f, "new_destination"));
			rt.setSv(f, "patrol_target", rt.fv(f, "loc", live(NB)));
			rt.setSv(f, "next_destination", rt.index(rt.fv(f, "codes", live(NB)), "next_patrol"));
			return 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/find_nearest_beacon  (code/modules/mob/living/simple_animal/bot/bot.dm:614)
rt.def("/mob/living/simple_animal/bot/proc/find_nearest_beacon", function find_nearest_beacon(f: Frame) {
	let NB: Value = null, dist: Value = null;
	let $e: any;
	f.vars = () => [NB, dist, $e];
	NB = null;
	rt.forList(f, 0, rt.index(rt.gl("navbeacons"), fmt("＀", [rt.sv(f, "z")])), T("/obj/machinery/navbeacon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		NB = $e;
		dist = rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(NB)]);
		if (truthy(rt.sv(f, "nearest_beacon"))) {
			if ((rt.gt(live(dist), 1) && rt.lt(live(dist), rt.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "nearest_beacon_loc")])))) {
				rt.setSv(f, "nearest_beacon", rt.fv(f, "location", live(NB)));
				rt.setSv(f, "nearest_beacon_loc", rt.fv(f, "loc", live(NB)));
				rt.setSv(f, "next_destination", rt.index(rt.fv(f, "codes", live(NB)), "next_patrol"));
			} else {
				continue;
			}
		} else {
			if (rt.gt(live(dist), 1)) {
				rt.setSv(f, "nearest_beacon", rt.fv(f, "location", live(NB)));
				rt.setSv(f, "nearest_beacon_loc", rt.fv(f, "loc", live(NB)));
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "patrol_target", rt.sv(f, "nearest_beacon_loc"));
	rt.setSv(f, "destination", rt.sv(f, "nearest_beacon"));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/bot_control  (code/modules/mob/living/simple_animal/bot/bot.dm:632)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/bot_control", function* bot_control(f: Frame, command: Value, user: Value, user_turf: Value, user_access: Value) {
	let $0: any;
	f.vars = () => [command, user, user_turf, user_access, $0];
	if (live(user_access) === null) {
		user_access = rt.list();
	}
	if (((!truthy(rt.sv(f, "on")) || isEqual(rt.sv(f, "emagged"), 2)) || truthy(rt.sv(f, "remote_disabled")))) {
		return 1;
	}
	if (truthy(rt.sv(f, "client"))) {
		yield* g.srcCall(f, "bot_control_message", live(command), live(user), live(user_turf), live(user_access));
	}
	$0 = live(command);
	if ($0 === "patroloff") {
		yield* g.srcCall(f, "bot_reset");
		rt.setSv(f, "auto_patrol", 0);
	} else if ($0 === "patrolon") {
		rt.setSv(f, "auto_patrol", 1);
	} else if ($0 === "summon") {
		yield* g.srcCall(f, "bot_reset");
		rt.setSv(f, "summon_target", live(user_turf));
		if (!isEqual(rt.len(f, live(user_access)), 0)) {
			rt.setFv(f, "access", rt.sv(f, "access_card"), add(live(user_access), rt.sv(f, "prev_access")));
		}
		rt.setSv(f, "mode", 6);
		yield* g.srcCall(f, "speak", "Responding.", rt.sv(f, "radio_channel"));
		yield* g.srcCall(f, "calc_summon_path");
	} else if ($0 === "ejectpai") {
		yield* g.srcCall(f, "ejectpairemote", live(user));
	}
	return live(f.dot);
}, true);

// /mob/living/simple_animal/bot/proc/bot_control_message  (code/modules/mob/living/simple_animal/bot/bot.dm:660)
rt.def("/mob/living/simple_animal/bot/proc/bot_control_message", function bot_control_message(f: Frame, command: Value, user: Value, user_turf: Value, user_access: Value) {
	let a: Value = null;
	let $0: any;
	f.vars = () => [a, $0];
	$0 = live(command);
	if ($0 === "patroloff") {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning big'>STOP PATROL</span>"]);
	} else if ($0 === "patrolon") {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning big'>START PATROL</span>"]);
	} else if ($0 === "summon") {
		a = rt.call(f, P("/proc/get_area"), null, [live(user_turf)]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning big'>PRIORITY ALERT:＀ in ＀!</span>", [live(user), rt.fv(f, "name", live(a))])]);
	} else if ($0 === "stop") {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning big'>STOP!</span>"]);
	} else if ($0 === "go") {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning big'>GO!</span>"]);
	} else if ($0 === "home") {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning big'>RETURN HOME!</span>"]);
	} else if ($0 === "ejectpai") {
		return live(f.dot);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>Unidentified control sequence recieved:＀</span>", [live(command)])]);
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/bot_summon  (code/modules/mob/living/simple_animal/bot/bot.dm:682)
rt.def("/mob/living/simple_animal/bot/proc/bot_summon", function bot_summon(f: Frame) {
	rt.callSrc(f, "summon_step", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/calc_path  (code/modules/mob/living/simple_animal/bot/bot.dm:687)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/calc_path", function* calc_path(f: Frame, avoid: Value) {
	f.vars = () => [avoid];
	yield* g.srcCall(f, "check_bot_access");
	rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.sv(f, "patrol_target"), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 120, "id", rt.sv(f, "access_card"), "exclude", live(avoid)], rt.Args.Named)));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/calc_summon_path  (code/modules/mob/living/simple_animal/bot/bot.dm:691)
rt.def("/mob/living/simple_animal/bot/proc/calc_summon_path", function calc_summon_path(f: Frame, avoid: Value) {
	rt.callSrc(f, "check_bot_access", []);
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/proc/calc_summon_path: spawn at modules/mob/living/simple_animal/bot/bot.dm:692", avoid);
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/proc/calc_summon_path, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/calc_summon_path: spawn at modules/mob/living/simple_animal/bot/bot.dm:692", function* (f: Frame, avoid: Value) {
	f.vars = () => [avoid];
	rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.sv(f, "summon_target"), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 150, "id", rt.sv(f, "access_card"), "exclude", live(avoid)], rt.Args.Named)));
	if (!truthy(rt.len(f, rt.sv(f, "path")))) {
		yield* g.srcCall(f, "speak", "Summon command failed, destination unreachable.", rt.sv(f, "radio_channel"));
		yield* g.srcCall(f, "bot_reset");
	}
	return null;
});

// /mob/living/simple_animal/bot/proc/summon_step  (code/modules/mob/living/simple_animal/bot/bot.dm:703)
rt.def("/mob/living/simple_animal/bot/proc/summon_step", function summon_step(f: Frame) {
	let next: Value = null, moved: Value = null;
	f.vars = () => [next, moved];
	if (truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "summon_target"))) {
		rt.callSrc(f, "bot_reset", []);
		return live(f.dot);
	} else {
		if ((rt.gt(rt.len(f, rt.sv(f, "path")), 0) && truthy(rt.sv(f, "summon_target")))) {
			if (isEqual((next = rt.index(rt.sv(f, "path"), 1)), rt.sv(f, "loc"))) {
				(rt.modSrcVar(f, "path", live(next), subtract));
				return live(f.dot);
			}
			if (!truthy((moved = rt.callSrc(f, "bot_move", [rt.sv(f, "summon_target"), 3])))) {
				rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/proc/summon_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:715", next, moved);
			}
		} else {
			rt.callSrc(f, "calc_summon_path", []);
		}
	}
	return f.dot;
});

// a spawn(2) body of /mob/living/simple_animal/bot/proc/summon_step, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/summon_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:715", function* (f: Frame, next: Value, moved: Value) {
	f.vars = () => [next, moved];
	yield* g.srcCall(f, "calc_summon_path");
	rt.setSv(f, "tries", 0);
	return null;
});

// /mob/living/simple_animal/bot/proc/Bump  (code/modules/mob/living/simple_animal/bot/bot.dm:723)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/Bump", function* Bump(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy((rt.istype(live(f.args[0]), T("/obj/machinery/door/airlock")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/machinery/door/window")) ? 1 : 0))) && rt.sv(f, "access_card") !== null)) return f.dot;
	if (!truthy((yield* g.callName(f, (D = live(f.args[0])), "check_access", [rt.sv(f, "access_card")])))) return f.dot;
	yield* g.callName(f, live(D), "open", []);
	rt.setSv(f, "frustration", 0);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/bot/proc/show_controls  (code/modules/mob/living/simple_animal/bot/bot.dm:731)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/show_controls", function* show_controls(f: Frame, M: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [M, dat, popup];
	(rt.modSrcVar(f, "users", live(M), rt.bitOr));
	dat = "";
	dat = (yield* g.srcCall(f, "get_controls", live(M)));
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(M), rt.sv(f, "window_id"), rt.sv(f, "window_name"), 350, 600]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", ["use_onclose", 0], rt.Args.Named);
	yield* g.call(f, P("/proc/onclose"), null, [null, live(M), null, rt.sv(f, "window_id"), "ref", live(f.src)], rt.Args.Named);
	return live(f.dot);
}, true);

// /mob/living/simple_animal/bot/proc/update_controls  (code/modules/mob/living/simple_animal/bot/bot.dm:741)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/update_controls", function* update_controls(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "users"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "show_controls", live(M));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/get_controls  (code/modules/mob/living/simple_animal/bot/bot.dm:745)
rt.def("/mob/living/simple_animal/bot/proc/get_controls", function get_controls(f: Frame, M: Value) {
	return "PROTOBOT - NOT FOR USE";
});

// /mob/living/simple_animal/bot/proc/Topic  (code/modules/mob/living/simple_animal/bot/bot.dm:749)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let $0: any;
	f.vars = () => [href, href_list, $0];
	if (truthy(rt.at(live(href_list), "close"))) {
		if (truthy((rt.isIn(f, live(f.usr), rt.sv(f, "users")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "users"), "Remove", [live(f.usr)]);
		}
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "topic_denied", live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀'s interface is not responding!</span>", [live(f.src)])]);
		return 1;
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if ((truthy(rt.at(live(href_list), "power")) && (truthy((yield* g.callName(f, rt.sv(f, "bot_core"), "allowed", [live(f.usr)]))) || !truthy(rt.sv(f, "locked"))))) {
		if (truthy(rt.sv(f, "on"))) {
			yield* g.srcCall(f, "turn_off");
		} else {
			yield* g.srcCall(f, "turn_on");
		}
	}
	$0 = rt.at(live(href_list), "operation");
	if ($0 === "patrol") {
		rt.setSv(f, "auto_patrol", (!truthy(rt.sv(f, "auto_patrol")) ? 1 : 0));
		yield* g.srcCall(f, "bot_reset");
	} else if ($0 === "remote") {
		rt.setSv(f, "remote_disabled", (!truthy(rt.sv(f, "remote_disabled")) ? 1 : 0));
	} else if ($0 === "hack") {
		if (!isEqual(rt.sv(f, "emagged"), 2)) {
			rt.setSv(f, "emagged", 2);
			rt.setSv(f, "hacked", 1);
			rt.setSv(f, "locked", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀</span>", [rt.sv(f, "text_hack")])]);
			yield* g.srcCall(f, "bot_reset");
		} else {
			if (!truthy(rt.sv(f, "hacked"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='boldannounce'>＀</span>", [rt.sv(f, "text_dehack_fail")])]);
			} else {
				rt.setSv(f, "emagged", 0);
				rt.setSv(f, "hacked", 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＀</span>", [rt.sv(f, "text_dehack")])]);
				yield* g.srcCall(f, "bot_reset");
			}
		}
	} else if ($0 === "ejectpai") {
		if ((truthy(rt.sv(f, "paicard")) && ((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You eject ＀ from ＀</span>", [rt.sv(f, "paicard"), rt.sv(f, "bot_name")])]);
			yield* g.srcCall(f, "ejectpai", live(f.usr));
		}
	}
	yield* g.srcCall(f, "update_controls");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/update_icon  (code/modules/mob/living/simple_animal/bot/bot.dm:792)
rt.def("/mob/living/simple_animal/bot/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "on")]));
	return f.dot;
});

rt.type(10941, "/obj/machinery/bot_core", "/obj/machinery", {
	owner: null,
	use_power: 0,
});

// /obj/machinery/bot_core/proc/Initialize  (code/modules/mob/living/simple_animal/bot/bot.dm:800)  may sleep
rt.def("/obj/machinery/bot_core/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "owner", rt.sv(f, "loc"));
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/simple_animal/bot")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/topic_denied  (code/modules/mob/living/simple_animal/bot/bot.dm:806)
rt.def("/mob/living/simple_animal/bot/proc/topic_denied", function topic_denied(f: Frame, user: Value) {
	if (!truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src)]))) {
		return 1;
	}
	if (isEqual(rt.sv(f, "emagged"), 2)) {
		if (!truthy(rt.sv(f, "hacked"))) {
			return 1;
		} else {
			if ((!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && !truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
				return 1;
			}
		}
	}
	return 0;
});

// /mob/living/simple_animal/bot/proc/hack  (code/modules/mob/living/simple_animal/bot/bot.dm:818)
rt.def("/mob/living/simple_animal/bot/proc/hack", function hack(f: Frame, user: Value) {
	let hack: Value = null;
	let $0: any, $1: any;
	f.vars = () => [hack, $0, $1];
	hack = null;
	if ((truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		if (isEqual(rt.sv(f, "emagged"), 2)) {
			$0 = "Software compromised! Unit may exhibit dangerous or erratic behavior.";
		} else {
			$0 = "Unit operating normally. Release safety lock?";
		}
		hack = rt.modify(live(hack), fmt("＀<BR>", [$0]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "emagged"))) {
			$1 = "<span class='bad'>DANGER</span>";
		} else {
			$1 = "Engaged";
		}
		hack = rt.modify(live(hack), fmt("Harm Prevention Safety System: <A href='?src=＃;operation=hack'>＀</A><BR>", [$0, $1]), add);
	} else {
		if (!truthy(rt.sv(f, "locked"))) {
			$0 = live(f.src);
			if (truthy(rt.sv(f, "remote_disabled"))) {
				$1 = "Disconnected";
			} else {
				$1 = "Connected";
			}
			hack = rt.modify(live(hack), fmt("Remote network control radio: <A href='?src=＃;operation=remote'>＀</A><BR>", [$0, $1]), add);
		}
	}
	return live(hack);
});

// /mob/living/simple_animal/bot/proc/showpai  (code/modules/mob/living/simple_animal/bot/bot.dm:826)
rt.def("/mob/living/simple_animal/bot/proc/showpai", function showpai(f: Frame, user: Value) {
	let eject: Value = null;
	f.vars = () => [eject];
	eject = "";
	if (((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)])))) {
		if ((truthy(rt.sv(f, "paicard")) || truthy(rt.sv(f, "allow_pai")))) {
			eject = rt.modify(live(eject), "Personality card status: ", add);
			if (truthy(rt.sv(f, "paicard"))) {
				if (truthy(rt.sv(f, "client"))) {
					eject = rt.modify(live(eject), fmt("<A href='?src=＃;operation=ejectpai'>Active</A>", [live(f.src)]), add);
				} else {
					eject = rt.modify(live(eject), fmt("<A href='?src=＃;operation=ejectpai'>Inactive</A>", [live(f.src)]), add);
				}
			} else {
				if ((!truthy(rt.sv(f, "allow_pai")) || truthy(rt.sv(f, "key")))) {
					eject = rt.modify(live(eject), "Unavailable", add);
				} else {
					eject = rt.modify(live(eject), "Not inserted", add);
				}
			}
			eject = rt.modify(live(eject), "<BR>", add);
		}
		eject = rt.modify(live(eject), "<BR>", add);
	}
	return live(eject);
});

// /mob/living/simple_animal/bot/proc/insertpai  (code/modules/mob/living/simple_animal/bot/bot.dm:845)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/insertpai", function* insertpai(f: Frame, user: Value, card: Value) {
	f.vars = () => [user, card];
	if (truthy(rt.sv(f, "paicard"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>A ＀ is already inserted!</span>", [rt.sv(f, "paicard")])]);
	} else {
		if ((truthy(rt.sv(f, "allow_pai")) && !truthy(rt.sv(f, "key")))) {
			if ((!truthy(rt.sv(f, "locked")) && !truthy(rt.sv(f, "open")))) {
				if ((truthy(rt.fv(f, "pai", live(card))) && truthy(rt.gv(f, "mind", rt.fv(f, "pai", live(card)))))) {
					if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
						return live(f.dot);
					}
					yield* g.callName(f, live(card), "forceMove", [live(f.src)]);
					rt.setSv(f, "paicard", live(card));
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ inserts ＀ into ＀!", [live(user), live(card), live(f.src)]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(card), live(f.src)])]);
					yield* g.callName(f, rt.gv(f, "mind", rt.fv(f, "pai", rt.sv(f, "paicard"))), "transfer_to", [live(f.src)]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>You sense your form change as you are uploaded into ＀.</span>", [live(f.src)])]);
					rt.setSv(f, "bot_name", rt.sv(f, "name"));
					rt.setSv(f, "name", rt.gv(f, "name", rt.fv(f, "pai", rt.sv(f, "paicard"))));
					rt.setSv(f, "faction", (yield* g.callName(f, rt.fv(f, "faction", live(user)), "Copy", [])));
					yield* g.call(f, P("/proc/add_logs"), null, [live(user), rt.fv(f, "pai", rt.sv(f, "paicard")), fmt("uploaded to ＀,", [rt.sv(f, "bot_name")])]);
					return 1;
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is inactive.</span>", [live(card)])]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The personality slot is locked.</span>"]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is not compatible with ＀</span>", [live(f.src), live(card)])]);
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/ejectpai  (code/modules/mob/living/simple_animal/bot/bot.dm:870)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/ejectpai", function* ejectpai(f: Frame, user: Value, announce: Value) {
	f.vars = () => [user, announce];
	if (live(user) === null) {
		user = null;
	}
	if (live(announce) === null) {
		announce = 1;
	}
	if (!truthy(rt.sv(f, "paicard"))) return f.dot;
	if ((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "pai", rt.sv(f, "paicard"))))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [rt.fv(f, "pai", rt.sv(f, "paicard"))]);
	} else {
		if (truthy(rt.fv(f, "pai", rt.sv(f, "paicard")))) {
			rt.setFv(f, "key", rt.fv(f, "pai", rt.sv(f, "paicard")), rt.sv(f, "key"));
		} else {
			yield* g.srcCall(f, "ghostize", 0);
		}
	}
	rt.setSv(f, "key", null);
	yield* g.callName(f, rt.sv(f, "paicard"), "forceMove", [rt.sv(f, "loc")]);
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), rt.fv(f, "pai", rt.sv(f, "paicard")), fmt("ejected from ＀,", [rt.fv(f, "bot_name", live(f.src))])]);
	} else {
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), rt.fv(f, "pai", rt.sv(f, "paicard")), "ejected"]);
	}
	if (truthy(live(announce))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "pai", rt.sv(f, "paicard")), fmt("<span class='notice'>You feel your control fade as ＀ ejects from ＀.</span>", [rt.sv(f, "paicard"), rt.sv(f, "bot_name")])]);
	}
	rt.setSv(f, "paicard", null);
	rt.setSv(f, "name", rt.sv(f, "bot_name"));
	rt.setSv(f, "faction", rt.initial(f, live(f.src), "faction"));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/ejectpairemote  (code/modules/mob/living/simple_animal/bot/bot.dm:889)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/ejectpairemote", function* ejectpairemote(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy((yield* g.callName(f, rt.sv(f, "bot_core"), "allowed", [live(user)]))) && truthy(rt.sv(f, "paicard")))) return f.dot;
	yield* g.srcCall(f, "speak", "Ejecting personality chip.", rt.sv(f, "radio_channel"));
	yield* g.srcCall(f, "ejectpai", live(user));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/Login  (code/modules/mob/living/simple_animal/bot/bot.dm:894)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/Login", function* Login(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modField(f, rt.sv(f, "access_card"), "access", rt.sv(f, "player_access"), add);
	yield* g.srcCall(f, "diag_hud_set_botmode");
	yield* g.srcCall(f, "activate_data_hud");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/Logout  (code/modules/mob/living/simple_animal/bot/bot.dm:900)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/Logout", function* Logout(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "bot_reset");
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/revive  (code/modules/mob/living/simple_animal/bot/bot.dm:904)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/simple_animal/bot/ghost  (code/modules/mob/living/simple_animal/bot/bot.dm:909)  may sleep
rt.def("/mob/living/simple_animal/bot/ghost", function* ghost(f: Frame) {
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	if (!(truthy(rt.sv(f, "paicard")) && (!truthy(rt.sv(f, "client")) || isEqual(rt.sv(f, "stat"), 2)))) return f.dot;
	yield* g.srcCall(f, "ejectpai", 0);
	return f.dot;
}, true, { verb: { name: "Ghost", category: "OOC", desc: "Relinquish your life and enter the land of the dead." } });

// /mob/living/simple_animal/bot/proc/sentience_act  (code/modules/mob/living/simple_animal/bot/bot.dm:915)
rt.def("/mob/living/simple_animal/bot/proc/sentience_act", function sentience_act(f: Frame) {
	(rt.modSrcVar(f, "faction", "silicon", subtract));
	return f.dot;
});

// /mob/living/simple_animal/bot/proc/activate_data_hud  (code/modules/mob/living/simple_animal/bot/bot.dm:919)
rt.def("/mob/living/simple_animal/bot/proc/activate_data_hud", function activate_data_hud(f: Frame) {
	let datahud: Value = null;
	f.vars = () => [datahud];
	if (!truthy(rt.sv(f, "data_hud_type"))) {
		return live(f.dot);
	}
	rt.callName(f, (datahud = rt.index(rt.gl("huds"), rt.sv(f, "data_hud_type"))), "add_hud_to", [live(f.src)]);
	return f.dot;
});
