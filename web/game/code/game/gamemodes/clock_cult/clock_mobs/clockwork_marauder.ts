// From code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4861, "/mob/living/simple_animal/hostile/clockwork/marauder", "/mob/living/simple_animal/hostile/clockwork", {
	true_name: "Meme Master 69",
	host: null,
	recovering: 0,
	blockchance: 17,
	counterchance: 30,
	light_range: 2,
	light_power: 1.1,
	name: "clockwork marauder",
	desc: "A stalwart apparition of a soldier, blazing with crimson flames. It's armed with a gladius and shield.",
	icon_state: "clockwork_marauder",
	health: 300,
	maxHealth: 300,
	speed: 1,
	obj_damage: 40,
	melee_damage_lower: 12,
	melee_damage_upper: 12,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	weather_immunities: null,
	movement_type: 2,
	loot: null,
	playstyle_string: "<span class='sevtug'>You are a clockwork marauder</span><b>, a living extension of Sevtug's will. As a marauder, you are somewhat slow, but may block attacks, and have a chance to also counter blocked melee attacks for extra damage, in addition to being immune to extreme temperatures and pressures. Your primary goal is to serve the creature that you are now a part of. You can use <span class='sevtug_small'><i>:b</i></span> to communicate silently with your master, but can only exit if your master calls your true name or if they are exceptionally damaged. \n\nStay near your host to protect and heal them; being too far from your host will rapidly cause you massive damage. Recall to your host if you are too weak and believe you cannot continue fighting safely. As a final note, you should probably avoid harming any fellow servants of Ratvar.</span>",
}, { global: { possible_true_names: 714, damage_heal_order: 715 } });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/<init>  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:14)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "weather_immunities", rt.list("lava"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/clockwork/component/geis_capacitor/fallen_armor")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/Initialize  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:35)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "true_name", rt.op(f, "PickUnweighted", [1], [rt.gl("possible_true_names")]));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/Life  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:39)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Life", function* Life(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.srcCall(f, "is_in_host")))) {
		if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "host")])))) {
			yield* g.srcCall(f, "emerge_from_host", 0, 1);
			yield* g.srcCall(f, "unbind_from_host");
			return live(f.dot);
		}
		if ((!truthy(rt.gl("ratvar_awakens")) && isEqual(rt.fv(f, "stat", rt.sv(f, "host")), 2))) {
			yield* g.srcCall(f, "death");
			return live(f.dot);
		}
		if (truthy(rt.gl("ratvar_awakens"))) {
			yield* g.srcCall(f, "adjustHealth", -50);
		} else {
			yield* g.srcCall(f, "adjustHealth", -10);
		}
		if (!truthy(rt.sv(f, "recovering"))) {
			yield* g.srcCall(f, "heal_host");
		} else {
			if (isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Your strength has returned. You can once again come forward!</span>"]);
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), "<span class='userdanger'>Your marauder is now strong enough to come forward again!</span>"]);
				rt.setSv(f, "recovering", 0);
			}
		}
	} else {
		if (truthy(rt.gl("ratvar_awakens"))) {
			yield* g.srcCall(f, "adjustHealth", -5);
			yield* g.srcCall(f, "heal_host");
		} else {
			if (!truthy(rt.sv(f, "host"))) return f.dot;
			if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "host")])))) {
				yield* g.srcCall(f, "unbind_from_host");
				return live(f.dot);
			}
			if (isEqual(rt.fv(f, "stat", rt.sv(f, "host")), 2)) {
				yield* g.srcCall(f, "adjustHealth", 50);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Your host is dead!</span>"]);
				return live(f.dot);
			}
			if (((truthy(rt.sv(f, "z")) && truthy(rt.fv(f, "z", rt.sv(f, "host")))) && isEqual(rt.sv(f, "z"), rt.fv(f, "z", rt.sv(f, "host"))))) {
				$0 = (yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, live(f.src), 0), rt.getStep(f, rt.sv(f, "host"), 0)]));
				if ($0 === 2) {
					yield* g.srcCall(f, "adjustHealth", -1);
				} else if ($0 === 3) {
				} else if ($0 === 4) {
					yield* g.srcCall(f, "adjustHealth", 1);
				} else if ($0 === 5) {
					yield* g.srcCall(f, "adjustHealth", 3);
				} else if ($0 === 6) {
					yield* g.srcCall(f, "adjustHealth", 6);
				} else if ($0 === 7) {
					yield* g.srcCall(f, "adjustHealth", 9);
				} else if (rt.inRange($0, 8, 9.999999848243207e+30)) {
					yield* g.srcCall(f, "adjustHealth", 15);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You're too far from your host and rapidly taking damage!</span>"]);
				} else {
					yield* g.srcCall(f, "adjustHealth", -2);
					yield* g.srcCall(f, "heal_host");
				}
			} else {
				yield* g.srcCall(f, "adjustHealth", 15);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You're too far from your host and rapidly taking damage!</span>"]);
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/death  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:95)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/death", function* death(f: Frame) {
	yield* g.srcCall(f, "emerge_from_host", 0, 1);
	yield* g.srcCall(f, "unbind_from_host");
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s equipment clatters lifelessly to the ground as the red flames within dissipate.</span>", [live(f.src)]), "<span class='userdanger'>Your equipment falls away. You feel a moment of confusion before your fragile form is annihilated.</span>");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/Stat  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:102)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Stat", function* Stat(f: Frame) {
	let resulthealth: Value = null;
	let $0: any, $1: any;
	f.vars = () => [resulthealth, $0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Current True Name: ＀", [rt.sv(f, "true_name")])]);
	$0 = null;
	if (truthy(rt.sv(f, "host"))) {
		$1 = rt.sv(f, "host");
	} else {
		$1 = "NONE";
	}
	yield* g.call(f, P("/proc/stat"), null, [$0, fmt("Host: ＀", [$1])]);
	if (truthy(rt.sv(f, "host"))) {
		resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "host")), rt.fv(f, "maxHealth", rt.sv(f, "host"))), 100), 0.5]));
		if (truthy((rt.istype(rt.sv(f, "host"), T("/mob/living/carbon")) ? 1 : 0))) {
			resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "host")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "host")))])), 100)]));
		}
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Host Health: ＀%", [live(resulthealth)])]);
		if (truthy(rt.gl("ratvar_awakens"))) {
			$0 = null;
			if (truthy(rt.sv(f, "recovering"))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/stat"), null, [$0, fmt("You are ＀able to deploy!", [$1])]);
		} else {
			if (rt.gt(live(resulthealth), 65)) {
				$0 = null;
				if (truthy(rt.sv(f, "recovering"))) {
					$1 = "unable to deploy";
				} else {
					$1 = "able to deploy on hearing your True Name";
				}
				yield* g.call(f, P("/proc/stat"), null, [$0, fmt("You are ＀!", [$1])]);
			} else {
				$0 = null;
				if (truthy(rt.sv(f, "recovering"))) {
					$1 = "unable to deploy";
				} else {
					$1 = "able to deploy to protect your host";
				}
				yield* g.call(f, P("/proc/stat"), null, [$0, fmt("You are ＀!", [$1])]);
			}
		}
	}
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("You do ＀ damage on melee attacks.", [rt.sv(f, "melee_damage_upper")])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/bind_to_host  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:124)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/bind_to_host", function* bind_to_host(f: Frame, new_host: Value) {
	let SM: Value = null, LM: Value = null;
	f.vars = () => [new_host, SM, LM];
	if (!truthy(live(new_host))) {
		return 0;
	}
	rt.setSv(f, "host", live(new_host));
	rt.setFv(f, "linked_marauder", (SM = (yield* g.new_(f, T("/datum/action/innate/summon_marauder"), []))), live(f.src));
	yield* g.callName(f, live(SM), "Grant", [rt.sv(f, "host")]);
	rt.setFv(f, "linked_marauder", (LM = (yield* g.new_(f, T("/datum/action/innate/linked_minds"), []))), live(f.src));
	yield* g.callName(f, live(LM), "Grant", [rt.sv(f, "host")]);
	return 1;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/unbind_from_host  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:137)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/unbind_from_host", function* unbind_from_host(f: Frame) {
	let SM: Value = null, LM: Value = null;
	let $e: any;
	f.vars = () => [SM, LM, $e];
	if (truthy(rt.sv(f, "host"))) {
		SM = null;
		rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "host")), T("/datum/action/innate/summon_marauder"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SM = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(SM)]);
		}
		rt.endFor(f, 0);
		LM = null;
		rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "host")), T("/datum/action/innate/linked_minds"));
		while (($e = rt.next(f, 0)) !== undefined) {
			LM = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(LM)]);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "host", null);
		return 1;
	}
	return 0;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/heal_host  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:147)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/heal_host", function* heal_host(f: Frame) {
	let resulthealth: Value = null;
	f.vars = () => [resulthealth];
	if (!truthy(rt.sv(f, "host"))) {
		return live(f.dot);
	}
	resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "host")), rt.fv(f, "maxHealth", rt.sv(f, "host"))), 100), 0.5]));
	if (truthy((rt.istype(rt.sv(f, "host"), T("/mob/living/carbon")) ? 1 : 0))) {
		resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "host")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "host")))])), 100)]));
	}
	if (!(truthy(rt.gl("ratvar_awakens")) || rt.le(live(resulthealth), 65))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.fv(f, "loc", rt.sv(f, "host")), "#AF0AAF"]);
	yield* g.callName(f, rt.sv(f, "host"), "heal_ordered_damage", [4, rt.gl("damage_heal_order#3")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/adjustHealth  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:157)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (rt.gt(live(f.args[0]), 0)) {
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [2, live(f.src)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy((yield* g.callName(f, live(L), "is_holding_item_of_type", [T("/obj/item/weapon/nullrod")])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>The presence of a brandished holy artifact weakens your armor!</span>"]);
				(f.args[0] = rt.modify(live(f.args[0]), 4, multiply));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.src)) && truthy(live(f.args[1])))) return f.dot;
	yield* g.srcCall(f, "update_health_hud");
	yield* g.srcCall(f, "update_stats");
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/update_health_hud  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:169)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/update_health_hud", function update_health_hud(f: Frame) {
	let M: Value = null, resulthealth: Value = null;
	f.vars = () => [M, resulthealth];
	if (!(truthy(rt.sv(f, "hud_used")) && truthy(rt.fv(f, "healths", rt.sv(f, "hud_used"))))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "hud_used"), T("/datum/hud/marauder")) ? 1 : 0))) {
		M = rt.sv(f, "hud_used");
		resulthealth = null;
		if (truthy(rt.sv(f, "host"))) {
			if (truthy((rt.istype(rt.sv(f, "host"), T("/mob/living/carbon")) ? 1 : 0))) {
				resulthealth = fmt("＀%", [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "host")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "host")))])), 100)])]);
			} else {
				resulthealth = fmt("＀%", [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "host")), rt.fv(f, "maxHealth", rt.sv(f, "host"))), 100), 0.5])]);
			}
		} else {
			resulthealth = "NONE";
		}
		rt.setFv(f, "maptext", rt.fv(f, "hosthealth", live(M)), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#AF0AAF'>HOST<br>＀</font></div>", [live(resulthealth)]));
	}
	rt.setFv(f, "maptext", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#AF0AAF'>＀%</font>", [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "health"), rt.sv(f, "maxHealth")), 100), 0.5])]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/update_stats  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:188)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/update_stats", function update_stats(f: Frame) {
	let healthpercent: Value = null;
	let $0: any;
	f.vars = () => [healthpercent, $0];
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "speed", 0);
		rt.setSv(f, "melee_damage_lower", 20);
		rt.setSv(f, "melee_damage_upper", 20);
		rt.setSv(f, "attacktext", "devastates");
	} else {
		$0 = (healthpercent = multiply(divide(rt.sv(f, "health"), rt.sv(f, "maxHealth")), 100));
		if (rt.inRange($0, 100, 70)) {
			rt.setSv(f, "speed", 0);
			rt.setSv(f, "melee_damage_lower", 16);
			rt.setSv(f, "melee_damage_upper", 16);
			rt.setSv(f, "attacktext", "viciously slashes");
		} else if (rt.inRange($0, 70, 40)) {
			rt.setSv(f, "speed", rt.initial(f, live(f.src), "speed"));
			rt.setSv(f, "melee_damage_lower", rt.initial(f, live(f.src), "melee_damage_lower"));
			rt.setSv(f, "melee_damage_upper", rt.initial(f, live(f.src), "melee_damage_upper"));
			rt.setSv(f, "attacktext", rt.initial(f, live(f.src), "attacktext"));
		} else if (rt.inRange($0, 40, 30)) {
			rt.setSv(f, "speed", rt.initial(f, live(f.src), "speed"));
			rt.setSv(f, "melee_damage_lower", 10);
			rt.setSv(f, "melee_damage_upper", 10);
			rt.setSv(f, "attacktext", "lightly slashes");
		} else if (rt.inRange($0, 30, 20)) {
			rt.setSv(f, "speed", 2);
			rt.setSv(f, "melee_damage_lower", 8);
			rt.setSv(f, "melee_damage_upper", 8);
			rt.setSv(f, "attacktext", "lightly slashes");
		} else if (rt.inRange($0, 20, 10)) {
			rt.setSv(f, "speed", 3);
			rt.setSv(f, "melee_damage_lower", 6);
			rt.setSv(f, "melee_damage_upper", 6);
			rt.setSv(f, "attacktext", "weakly slashes");
		} else if (rt.inRange($0, 10, 0)) {
			rt.setSv(f, "speed", 4);
			rt.setSv(f, "melee_damage_lower", 4);
			rt.setSv(f, "melee_damage_upper", 4);
			rt.setSv(f, "attacktext", "taps");
		}
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/AttackingTarget  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:226)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (truthy((yield* g.srcCall(f, "is_in_host")))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/bullet_act  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:231)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/bullet_act", function* bullet_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "blockOrCounter", null, live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["Proj"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/hitby  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:236)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/hitby", function* hitby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "blockOrCounter", null, live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_animal  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:241)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_animal", function* attack_animal(f: Frame) {
	if (!(truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/clockwork/marauder")) ? 1 : 0)) || !truthy((yield* g.srcCall(f, "blockOrCounter", live(f.args[0]), live(f.args[0])))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_paw  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:245)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_paw", function* attack_paw(f: Frame) {
	if (truthy((yield* g.srcCall(f, "blockOrCounter", live(f.args[0]), live(f.args[0]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_alien  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:249)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_alien", function* attack_alien(f: Frame) {
	if (truthy((yield* g.srcCall(f, "blockOrCounter", live(f.args[0]), live(f.args[0]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_slime  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:253)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_slime", function* attack_slime(f: Frame) {
	if (truthy((yield* g.srcCall(f, "blockOrCounter", live(f.args[0]), live(f.args[0]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:257)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.srcCall(f, "blockOrCounter", live(f.args[0]), live(f.args[0]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/attackby  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:261)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attackby", function* attackby(f: Frame) {
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/nullrod")) ? 1 : 0)) || !truthy((yield* g.srcCall(f, "blockOrCounter", live(f.args[1]), live(f.args[0])))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/blockOrCounter  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:268)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/blockOrCounter", function* blockOrCounter(f: Frame, target: Value, textobject: Value) {
	let previousattacktext: Value = null;
	let $0: any, $1: any;
	f.vars = () => [target, textobject, previousattacktext, $0, $1];
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "blockchance", 90);
		rt.setSv(f, "counterchance", 90);
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "blockchance")]))) {
		f.dot = 1;
		if (truthy(live(target))) {
			yield* g.callName(f, live(target), "do_attack_animation", [live(f.src)]);
			yield* g.callName(f, live(target), "changeNext_move", [8]);
		}
		rt.setSv(f, "blockchance", rt.initial(f, live(f.src), "blockchance"));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), 30, 1, 0, 1]);
		$0 = live(f.src);
		if ((truthy(live(target)) && truthy((rt.istype(live(textobject), T("/obj/item")) ? 1 : 0)))) {
			$1 = fmt("＀'s ＀", [live(target), rt.fv(f, "name", live(textobject))]);
		} else {
			$1 = fmt("％！", [live(textobject)]);
		}
		$0 = fmt("<span class='boldannounce'>＀ blocks ＀!</span>", [$0, $1]);
		if ((truthy(live(target)) && truthy((rt.istype(live(textobject), T("/obj/item")) ? 1 : 0)))) {
			$1 = fmt("＀'s ＀", [live(target), rt.fv(f, "name", live(textobject))]);
		} else {
			$1 = fmt("％！", [live(textobject)]);
		}
		yield* g.srcCall(f, "visible_message", $0, fmt("<span class='userdanger'>You block ＀!</span>", [$1]));
		if ((truthy(live(target)) && truthy((yield* g.srcCall(f, "Adjacent", live(target)))))) {
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "counterchance")]))) {
				rt.setSv(f, "counterchance", rt.initial(f, live(f.src), "counterchance"));
				previousattacktext = rt.sv(f, "attacktext");
				rt.setSv(f, "attacktext", "counters");
				yield* g.srcCall(f, "UnarmedAttack", live(target));
				rt.setSv(f, "attacktext", live(previousattacktext));
			} else {
				rt.setSv(f, "counterchance", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "counterchance"), rt.initial(f, live(f.src), "counterchance")), 100])));
			}
		}
	} else {
		rt.setSv(f, "blockchance", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "blockchance"), rt.initial(f, live(f.src), "blockchance")), 100])));
	}
	if (!truthy(rt.gl("ratvar_awakens"))) return f.dot;
	rt.setSv(f, "blockchance", 90);
	rt.setSv(f, "counterchance", 90);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/handle_inherent_channels  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:295)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame) {
	if ((truthy(rt.sv(f, "host")) && (truthy((yield* g.srcCall(f, "is_in_host"))) || isEqual(live(f.args[1]), "binary")))) {
		yield* g.srcCall(f, "marauder_comms", live(f.args[0]));
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["message", "message_mode"] });

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/marauder_comms  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:301)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/marauder_comms", function marauder_comms(f: Frame, message: Value) {
	let name_part: Value = null, M: Value = null, link: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [message, name_part, M, link, $0, $1, $2, $3, $e];
	name_part = fmt("<span class='sevtug'>＀ (＀)</span>", [live(f.src), rt.sv(f, "true_name")]);
	message = fmt("<span class='sevtug_small'>\"＀\"</span>", [live(message)]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("＀<span class='sevtug_small'>:</span> ＀", [live(name_part), live(message)])]);
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), fmt("＀<span class='sevtug_small'>:</span> ＀", [live(name_part), live(message)])]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
			$0 = live(M);
			$1 = live(link);
			$2 = live(name_part);
			if (truthy(rt.call(f, P("/proc/findtextEx"), null, [rt.fv(f, "name", rt.sv(f, "host")), rt.fv(f, "real_name", rt.sv(f, "host"))]))) {
				$3 = fmt("＀", [rt.fv(f, "name", rt.sv(f, "host"))]);
			} else {
				$3 = fmt("＀ (as ＀)", [rt.fv(f, "real_name", rt.sv(f, "host")), rt.fv(f, "name", rt.sv(f, "host"))]);
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＀ ＀ <span class='sevtug_small'>(to</span> <span class='sevtug'>＀</span><span class='sevtug_small'>):</span> ＀ ", [$1, $2, $3, live(message)])]);
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/return_to_host  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:312)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/return_to_host", function* return_to_host(f: Frame) {
	let resulthealth: Value = null;
	f.vars = () => [resulthealth];
	if (truthy((yield* g.srcCall(f, "is_in_host")))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "host"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have a host!</span>"]);
		return 0;
	}
	resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "host")), rt.fv(f, "maxHealth", rt.sv(f, "host"))), 100), 0.5]));
	if (truthy((rt.istype(rt.sv(f, "host"), T("/mob/living/carbon")) ? 1 : 0))) {
		resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "host")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "host")))])), 100)]));
	}
	yield* g.callName(f, rt.sv(f, "host"), "visible_message", [fmt("<span class='warning'>＀'s skin flashes crimson!</span>", [rt.sv(f, "host")]), fmt("<span class='sevtug'>You feel ＀'s consciousness settle in your mind.</span>", [rt.sv(f, "true_name")])]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ suddenly disappears!</span>", [live(f.src)]), fmt("<span class='sevtug'>You return to ＀.</span>", [rt.sv(f, "host")]));
	yield* g.srcCall(f, "forceMove", rt.sv(f, "host"));
	if ((rt.gt(live(resulthealth), 65) && !isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth")))) {
		rt.setSv(f, "recovering", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You have weakened and will need to recover before manifesting again!</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), fmt("<span class='sevtug'>＀ has weakened and will need to recover before manifesting again!</span>", [rt.sv(f, "true_name")])]);
	}
	return 1;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/try_emerge  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:330)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/try_emerge", function* try_emerge(f: Frame) {
	let resulthealth: Value = null;
	f.vars = () => [resulthealth];
	if (!truthy(rt.sv(f, "host"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have a host!</span>"]);
		return 0;
	}
	if (!truthy(rt.gl("ratvar_awakens"))) {
		resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "host")), rt.fv(f, "maxHealth", rt.sv(f, "host"))), 100), 0.5]));
		if (truthy((rt.istype(rt.sv(f, "host"), T("/mob/living/carbon")) ? 1 : 0))) {
			resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "host")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "host")))])), 100)]));
		}
		if ((!isEqual(rt.fv(f, "stat", rt.sv(f, "host")), 2) && rt.gt(live(resulthealth), 65))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>Your host must be at ＀% or less health to emerge like this!</span>", [65])]);
			return 0;
		}
	}
	return (yield* g.srcCall(f, "emerge_from_host", 0));
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/emerge_from_host  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:343)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/emerge_from_host", function* emerge_from_host(f: Frame, hostchosen: Value, force: Value) {
	f.vars = () => [hostchosen, force];
	if (!truthy((yield* g.srcCall(f, "is_in_host")))) {
		return 0;
	}
	if ((!truthy(live(force)) && truthy(rt.sv(f, "recovering")))) {
		if (truthy(live(hostchosen))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), fmt("<span class='sevtug'>＀ is too weak to come forth!</span>", [rt.sv(f, "true_name")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), fmt("<span class='sevtug'>＀ tries to emerge to protect you, but it's too weak!</span>", [rt.sv(f, "true_name")])]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You try to come forth, but you're too weak!</span>"]);
		return 0;
	}
	if (!truthy(live(force))) {
		if (truthy(live(hostchosen))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), fmt("<span class='sevtug'>Your words echo with power as ＀ emerges from your body!</span>", [rt.sv(f, "true_name")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "host"), fmt("<span class='sevtug'>＀ emerges from your body to protect you!</span>", [rt.sv(f, "true_name")])]);
		}
	}
	yield* g.srcCall(f, "forceMove", rt.fv(f, "loc", rt.sv(f, "host")));
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s skin glows red as ＀ emerges from their body!</span>", [rt.sv(f, "host"), rt.sv(f, "name")]), fmt("<span class='sevtug_small'>You exit the safety of ＀'s body!</span>", [rt.sv(f, "host")]));
	return 1;
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/get_alt_name  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:362)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/get_alt_name", function get_alt_name(f: Frame) {
	return fmt(" (＀)", [rt.call(f, P("/proc/text2ratvar"), null, [rt.sv(f, "true_name")])]);
});

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/is_in_host  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:365)
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/is_in_host", function is_in_host(f: Frame) {
	return (rt.sv(f, "host") && (isEqual(rt.sv(f, "loc"), rt.sv(f, "host")) ? 1 : 0));
});

rt.type(88, "/datum/action/innate/summon_marauder", "/datum/action/innate", {
	linked_marauder: null,
	name: "Force Marauder to Emerge/Recall",
	desc: "Allows you to force your clockwork marauder to emerge or recall as required.",
	button_icon_state: "clockwork_marauder",
	background_icon_state: "bg_clock",
	check_flags: 8,
	buttontooltipstyle: "clockcult",
}, { global: { defend_phrases: 626, return_phrases: 627 } });

// /datum/action/innate/summon_marauder/proc/IsAvailable  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:382)
rt.def("/datum/action/innate/summon_marauder/proc/IsAvailable", function IsAvailable(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "linked_marauder"))) {
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living")) ? 1 : 0))) {
		if ((!truthy(rt.callName(f, (L = rt.sv(f, "owner")), "can_speak_vocal", [])) || truthy(rt.fv(f, "stat", live(L))))) {
			return 0;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/summon_marauder/proc/Activate  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:391)  may sleep
rt.def("/datum/action/innate/summon_marauder/proc/Activate", function* Activate(f: Frame) {
	if (truthy((yield* g.callName(f, rt.sv(f, "linked_marauder"), "is_in_host", [])))) {
		yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "owner"), (yield* g.call(f, P("/proc/text2ratvar"), null, [fmt("＀, ＀!", [rt.op(f, "PickUnweighted", [1], [rt.gl("defend_phrases")]), rt.fv(f, "true_name", rt.sv(f, "linked_marauder"))])]))]);
		yield* g.callName(f, rt.sv(f, "linked_marauder"), "emerge_from_host", [1]);
	} else {
		yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "owner"), (yield* g.call(f, P("/proc/text2ratvar"), null, [fmt("＀, ＀!", [rt.op(f, "PickUnweighted", [1], [rt.gl("return_phrases")]), rt.fv(f, "true_name", rt.sv(f, "linked_marauder"))])]))]);
		yield* g.callName(f, rt.sv(f, "linked_marauder"), "return_to_host", []);
	}
	return 1;
}, true);

rt.type(89, "/datum/action/innate/linked_minds", "/datum/action/innate", {
	linked_marauder: null,
	name: "Linked Minds",
	desc: "Allows you to silently communicate with your marauder.",
	button_icon_state: "linked_minds",
	background_icon_state: "bg_clock",
	check_flags: 8,
	buttontooltipstyle: "clockcult",
});

// /datum/action/innate/linked_minds/proc/IsAvailable  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:410)
rt.def("/datum/action/innate/linked_minds/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!truthy(rt.sv(f, "linked_marauder"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/linked_minds/proc/Activate  (code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm:415)  may sleep
rt.def("/datum/action/innate/linked_minds/proc/Activate", function* Activate(f: Frame) {
	let message: Value = null, name_part: Value = null, M: Value = null, link: Value = null;
	let $0: any, $e: any;
	f.vars = () => [message, name_part, M, link, $0, $e];
	message = (yield* g.call(f, P("/proc/stripped_input"), null, [rt.sv(f, "owner"), "Enter a message to tell your marauder.", "Telepathy"]));
	if ((!truthy(rt.sv(f, "owner")) || !truthy(live(message)))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "linked_marauder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Your marauder seems to have been destroyed!</span>"]);
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/findtextEx"), null, [rt.fv(f, "name", rt.sv(f, "owner")), rt.fv(f, "real_name", rt.sv(f, "owner"))])))) {
		$0 = fmt("＀", [rt.fv(f, "name", rt.sv(f, "owner"))]);
	} else {
		$0 = fmt("＀ (as ＀)", [rt.fv(f, "real_name", rt.sv(f, "owner")), rt.fv(f, "name", rt.sv(f, "owner"))]);
	}
	name_part = fmt("<span class='sevtug'>Servant ＀</span>", [$0]);
	message = fmt("<span class='sevtug_small'>\"＀\"</span>", [live(message)]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("＀<span class='sevtug_small'>:</span> ＀", [live(name_part), live(message)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "linked_marauder"), fmt("＀<span class='sevtug_small'>:</span> ＀", [live(name_part), live(message)])]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀ <span class='sevtug_small'>(to</span> <span class='sevtug'>＀ (＀)</span><span class='sevtug_small'>):</span> ＀", [live(link), live(name_part), rt.sv(f, "linked_marauder"), rt.fv(f, "true_name", rt.sv(f, "linked_marauder")), live(message)])]);
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);
