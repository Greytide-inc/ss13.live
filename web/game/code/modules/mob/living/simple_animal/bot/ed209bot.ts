// From code/modules/mob/living/simple_animal/bot/ed209bot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5034, "/mob/living/simple_animal/bot/ed209", "/mob/living/simple_animal/bot", {
	lastfired: 0,
	shot_delay: 15,
	lasercolor: "",
	disabled: 0,
	target: null,
	oldtarget_name: null,
	threatlevel: 0,
	target_lastloc: null,
	last_found: null,
	declare_arrests: 1,
	idcheck: 1,
	weaponscheck: 1,
	check_records: 1,
	arrest_type: 0,
	shoot_sound: rt.rsc("sound/weapons/taser.ogg"),
	projectile: rt.typePath("/obj/item/projectile/energy/electrode"),
	anchored: 0,
	radio_channel: "Security",
	bot_type: 1,
	model: "ED-209",
	window_id: "autoed209",
	window_name: "Automatic Security Unit v2.6",
	allow_pai: 0,
	data_hud_type: 2,
	name: "１ED-209 Security Robot",
	desc: "A security robot.  He looks less than thrilled.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "ed2090",
	density: 1,
	health: 100,
	maxHealth: 100,
	damage_coeff: null,
	obj_damage: 60,
	environment_smash: 2,
	mob_size: 3,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_sec"),
	bot_core: rt.typePath("/obj/machinery/bot_core/secbot"),
});

// /mob/living/simple_animal/bot/ed209/proc/<init>  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:10)
rt.def("/mob/living/simple_animal/bot/ed209/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.5, "fire", 0.699999988079071, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/Initialize  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:46)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null, secsensor: Value = null;
	f.vars = () => [J, secsensor];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "name", live(f.args[1]));
	}
	if (truthy(live(f.args[2]))) {
		rt.setSv(f, "lasercolor", live(f.args[2]));
	}
	rt.setSv(f, "icon_state", fmt("＀ed209＀", [rt.sv(f, "lasercolor"), rt.sv(f, "on")]));
	yield* g.srcCall(f, "set_weapon");
	rt.spawnTail(f, 3, "/mob/living/simple_animal/bot/ed209/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:53", J, secsensor);
	yield* g.callName(f, (secsensor = rt.index(rt.gl("huds"), 2)), "add_hud_to", [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload", "created_name", "created_lasercolor"] });

// a spawn(3) body of /mob/living/simple_animal/bot/ed209/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:53", function* (f: Frame, J: Value, secsensor: Value) {
	f.vars = () => [J, secsensor];
	J = (yield* g.new_(f, T("/datum/job/detective"), []));
	rt.modField(f, rt.sv(f, "access_card"), "access", (yield* g.callName(f, live(J), "get_access", [])), add);
	rt.setSv(f, "prev_access", rt.fv(f, "access", rt.sv(f, "access_card")));
	if (truthy(rt.sv(f, "lasercolor"))) {
		rt.setSv(f, "shot_delay", 6);
		rt.setSv(f, "check_records", 0);
		rt.setSv(f, "arrest_type", 1);
		rt.setFv(f, "req_access", rt.sv(f, "bot_core"), rt.list(12, 46));
		rt.setSv(f, "arrest_type", 1);
		if ((isEqual(rt.sv(f, "lasercolor"), "b") && isEqual(rt.sv(f, "name"), "ÿ\u0016ED-209 Security Robot"))) {
			rt.setSv(f, "name", rt.op(f, "PickUnweighted", [3], ["BLUE BALLER", "SANIC", "BLUE KILLDEATH MURDERBOT"]));
		}
		if ((isEqual(rt.sv(f, "lasercolor"), "r") && isEqual(rt.sv(f, "name"), "ÿ\u0016ED-209 Security Robot"))) {
			rt.setSv(f, "name", rt.op(f, "PickUnweighted", [3], ["RED RAMPAGE", "RED ROVER", "RED KILLDEATH MURDERBOT"]));
		}
	}
	return null;
});

// /mob/living/simple_animal/bot/ed209/proc/turn_on  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:74)
rt.def("/mob/living/simple_animal/bot/ed209/proc/turn_on", function turn_on(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀ed209＀", [rt.sv(f, "lasercolor"), rt.sv(f, "on")]));
	rt.setSv(f, "mode", 0);
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/turn_off  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:79)
rt.def("/mob/living/simple_animal/bot/ed209/proc/turn_off", function turn_off(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀ed209＀", [rt.sv(f, "lasercolor"), rt.sv(f, "on")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:83)
rt.def("/mob/living/simple_animal/bot/ed209/proc/bot_reset", function bot_reset(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", null);
	rt.setSv(f, "oldtarget_name", null);
	rt.setSv(f, "anchored", 0);
	rt.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	rt.setSv(f, "last_found", rt.worldTime(f));
	rt.callSrc(f, "set_weapon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/set_custom_texts  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:92)
rt.def("/mob/living/simple_animal/bot/ed209/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	rt.setSv(f, "text_hack", fmt("You disable ＀'s combat inhibitor.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack", fmt("You restore ＀'s combat inhibitor.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack_fail", fmt("＀ ignores your attempts to restrict him!", [rt.sv(f, "name")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/get_controls  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:98)
rt.def("/mob/living/simple_animal/bot/ed209/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any;
	f.vars = () => [dat, $0, $1, $2, $3, $4, $5, $6];
	dat = null;
	dat = rt.modify(live(dat), rt.callSrc(f, "hack", [live(user)]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "showpai", [live(user)]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	$0 = fmt("<A href='?src=＃;power=1'>＀</A>", [$0, $1]);
	if (truthy(rt.sv(f, "locked"))) {
		$1 = "locked";
	} else {
		$1 = "unlocked";
	}
	if (truthy(rt.sv(f, "open"))) {
		$2 = "opened";
	} else {
		$2 = "closed";
	}
	dat = rt.modify(live(dat), fmt("\n<TT><B>Security Unit v2.6 controls</B></TT><BR><BR>\nStatus: ＀<BR>\nBehaviour controls are ＀<BR>\nMaintenance panel panel is ＀<BR>", [$0, $1, $2]), add);
	if (((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		if (!truthy(rt.sv(f, "lasercolor"))) {
			$0 = live(f.src);
			if (truthy(rt.sv(f, "idcheck"))) {
				$1 = "Yes";
			} else {
				$1 = "No";
			}
			$0 = fmt("<A href='?src=＃;operation=idcheck'>＀</A>", [$0, $1]);
			$1 = live(f.src);
			if (truthy(rt.sv(f, "weaponscheck"))) {
				$2 = "Yes";
			} else {
				$2 = "No";
			}
			$1 = fmt("<A href='?src=＃;operation=weaponscheck'>＀</A>", [$1, $2]);
			$2 = live(f.src);
			if (truthy(rt.sv(f, "check_records"))) {
				$3 = "Yes";
			} else {
				$3 = "No";
			}
			$2 = fmt("<A href='?src=＃;operation=ignorerec'>＀</A>", [$2, $3]);
			$3 = live(f.src);
			if (truthy(rt.sv(f, "arrest_type"))) {
				$4 = "Detain";
			} else {
				$4 = "Arrest";
			}
			$3 = fmt("<A href='?src=＃;operation=switchmode'>＀</A>", [$3, $4]);
			$4 = live(f.src);
			if (truthy(rt.sv(f, "declare_arrests"))) {
				$5 = "Yes";
			} else {
				$5 = "No";
			}
			$4 = fmt("<A href='?src=＃;operation=declarearrests'>＀</A>", [$4, $5]);
			$5 = live(f.src);
			if (truthy(rt.sv(f, "auto_patrol"))) {
				$6 = "On";
			} else {
				$6 = "Off";
			}
			dat = rt.modify(live(dat), fmt("<BR>\nArrest Unidentifiable Persons: ＀<BR>\nArrest for Unauthorized Weapons: ＀<BR>\nArrest for Warrant: ＀<BR>\n<BR>\nOperating Mode: ＀<BR>\nReport Arrests＀<BR>\nAuto Patrol＀", [$0, $1, $2, $3, $4, fmt("<A href='?src=＃;operation=patrol'>＀</A>", [$5, $6])]), add);
		}
	}
	return live(dat);
});

// /mob/living/simple_animal/bot/ed209/proc/Topic  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:129)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/Topic", function* Topic(f: Frame) {
	let H: Value = null;
	let $0: any;
	f.vars = () => [H, $0];
	if ((truthy(rt.sv(f, "lasercolor")) && truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		H = live(f.usr);
		if ((isEqual(rt.sv(f, "lasercolor"), "b") && truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/redtag")) ? 1 : 0)))) {
			return live(f.dot);
		} else {
			if ((isEqual(rt.sv(f, "lasercolor"), "r") && truthy((rt.istype(rt.fv(f, "wear_suit", live(H)), T("/obj/item/clothing/suit/bluetag")) ? 1 : 0)))) {
				return live(f.dot);
			}
		}
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = rt.at(live(f.args[1]), "operation");
	if ($0 === "idcheck") {
		rt.setSv(f, "idcheck", (!truthy(rt.sv(f, "idcheck")) ? 1 : 0));
		yield* g.srcCall(f, "update_controls");
	} else if ($0 === "weaponscheck") {
		rt.setSv(f, "weaponscheck", (!truthy(rt.sv(f, "weaponscheck")) ? 1 : 0));
		yield* g.srcCall(f, "update_controls");
	} else if ($0 === "ignorerec") {
		rt.setSv(f, "check_records", (!truthy(rt.sv(f, "check_records")) ? 1 : 0));
		yield* g.srcCall(f, "update_controls");
	} else if ($0 === "switchmode") {
		rt.setSv(f, "arrest_type", (!truthy(rt.sv(f, "arrest_type")) ? 1 : 0));
		yield* g.srcCall(f, "update_controls");
	} else if ($0 === "declarearrests") {
		rt.setSv(f, "declare_arrests", (!truthy(rt.sv(f, "declare_arrests")) ? 1 : 0));
		yield* g.srcCall(f, "update_controls");
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/simple_animal/bot/ed209/proc/judgement_criteria  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:158)
rt.def("/mob/living/simple_animal/bot/ed209/proc/judgement_criteria", function judgement_criteria(f: Frame) {
	let final: Value = null;
	f.vars = () => [final];
	final = 0;
	if (truthy(rt.sv(f, "idcheck"))) {
		final = rt.bitOr(live(final), 2);
	}
	if (truthy(rt.sv(f, "check_records"))) {
		final = rt.bitOr(live(final), 8);
	}
	if (truthy(rt.sv(f, "weaponscheck"))) {
		final = rt.bitOr(live(final), 4);
	}
	if (truthy(rt.sv(f, "emagged"))) {
		final = rt.bitOr(live(final), 1);
	}
	return (final = rt.bitOr(live(final), 16));
});

// /mob/living/simple_animal/bot/ed209/proc/retaliate  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:170)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/retaliate", function* retaliate(f: Frame, H: Value) {
	let judgement_criteria: Value = null;
	f.vars = () => [H, judgement_criteria];
	judgement_criteria = (yield* g.srcCall(f, "judgement_criteria"));
	rt.setSv(f, "threatlevel", (yield* g.callName(f, live(H), "assess_threat", [null, live(judgement_criteria), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons")]))], rt.Args.Named)));
	if (!rt.ge((rt.modSrcVar(f, "threatlevel", 6, add)), 4)) return f.dot;
	rt.setSv(f, "target", live(H));
	rt.setSv(f, "mode", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/ed209/proc/attack_hand  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:178)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm")) {
		yield* g.srcCall(f, "retaliate", live(f.args[0]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["H"] });

// /mob/living/simple_animal/bot/ed209/proc/attackby  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:183)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
		return live(f.dot);
	}
	if (!(!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !truthy(rt.sv(f, "target")))) return f.dot;
	if (!(truthy(rt.fv(f, "force", live(f.args[0]))) && !isEqual(rt.fv(f, "damtype", live(f.args[0])), "stamina"))) return f.dot;
	yield* g.srcCall(f, "retaliate", live(f.args[1]));
	if (!truthy(rt.sv(f, "lasercolor"))) return f.dot;
	yield* g.srcCall(f, "shootAt", live(f.args[1]));
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/bot/ed209/proc/emag_act  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:193)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/emag_act", function* emag_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "emagged"), 2)) return f.dot;
	if (truthy(live(f.args[0]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You short out ＀'s target assessment circuits.</span>", [live(f.src)])]);
		rt.setSv(f, "oldtarget_name", rt.fv(f, "name", live(f.args[0])));
	}
	yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ buzzes oddly!</span>", [live(f.src)]));
	rt.setSv(f, "declare_arrests", 0);
	rt.setSv(f, "icon_state", fmt("＀ed209＀", [rt.sv(f, "lasercolor"), rt.sv(f, "on")]));
	yield* g.srcCall(f, "set_weapon");
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/ed209/proc/bullet_act  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:204)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/bullet_act", function* bullet_act(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam/laser")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/bullet")) ? 1 : 0)))) {
		if ((isEqual(rt.fv(f, "damage_type", live(f.args[0])), "fire") || isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute"))) {
			if ((!truthy(rt.fv(f, "nodamage", live(f.args[0]))) && rt.lt(rt.fv(f, "damage", live(f.args[0])), rt.fv(f, "health", live(f.src))))) {
				yield* g.srcCall(f, "retaliate", rt.fv(f, "firer", live(f.args[0])));
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["Proj"] });

// /mob/living/simple_animal/bot/ed209/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:211)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let judgement_criteria: Value = null, targets: Value = null, C: Value = null, threatlevel: Value = null, dst: Value = null, t: Value = null, olddist: Value = null;
	let $0: any, $e: any;
	f.vars = () => [judgement_criteria, targets, C, threatlevel, dst, t, olddist, $0, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "disabled"))) {
		return live(f.dot);
	}
	judgement_criteria = (yield* g.srcCall(f, "judgement_criteria"));
	targets = rt.list();
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		threatlevel = 0;
		if ((truthy(rt.fv(f, "stat", live(C))) || truthy(rt.fv(f, "lying", live(C))))) {
			continue;
		}
		if (rt.lt((threatlevel = (yield* g.callName(f, live(C), "assess_threat", [null, live(judgement_criteria), null, rt.sv(f, "lasercolor"), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons")]))], rt.Args.Named))), 4)) {
			continue;
		}
		if ((rt.le((dst = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(C)]))), 1) || rt.gt(live(dst), 7))) {
			continue;
		}
		targets = rt.modify(live(targets), live(C), add);
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(targets)), 0)) {
		if (((!isEqual(rt.gv(f, "stat", (t = rt.op(f, "PickUnweighted", [1], [live(targets)]))), 2) && !isEqual(rt.fv(f, "lying", live(t)), 1)) && !truthy(rt.fv(f, "handcuffed", live(t))))) {
			yield* g.srcCall(f, "shootAt", live(t));
		}
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
		if (!truthy(rt.sv(f, "lasercolor"))) {
			yield* g.srcCall(f, "look_for_perp");
		}
		if ((!truthy(rt.sv(f, "mode")) && truthy(rt.sv(f, "auto_patrol")))) {
			rt.setSv(f, "mode", 4);
		}
	} else if ($0 === 1) {
		if (rt.ge(rt.sv(f, "frustration"), 8)) {
			yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
			yield* g.srcCall(f, "back_to_idle");
		}
		if (truthy(rt.sv(f, "target"))) {
			if ((truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "target"))]))))) {
				yield* g.srcCall(f, "stun_attack", rt.sv(f, "target"));
				rt.setSv(f, "mode", 2);
				rt.setSv(f, "anchored", 1);
				rt.setSv(f, "target_lastloc", rt.fv(f, "loc", rt.sv(f, "target")));
				return live(f.dot);
			} else {
				olddist = (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")]));
				yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "target"), 1, 4]);
				if (rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), live(olddist))) {
					rt.incSrcVar(f, "frustration", 1, true);
				} else {
					rt.setSv(f, "frustration", 0);
				}
			}
		} else {
			yield* g.srcCall(f, "back_to_idle");
		}
	} else if ($0 === 2) {
		if (((!truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "target"))])))) || rt.lt((yield* g.callName(f, rt.sv(f, "target"), "AmountKnockdown", [])), 40))) {
			yield* g.srcCall(f, "back_to_hunt");
			return live(f.dot);
		}
		if ((truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.sv(f, "target"), "canBeHandcuffed", []))))) {
			if (!truthy(rt.sv(f, "arrest_type"))) {
				if (!truthy(rt.fv(f, "handcuffed", rt.sv(f, "target")))) {
					yield* g.srcCall(f, "cuff", rt.sv(f, "target"));
				} else {
					yield* g.srcCall(f, "back_to_idle");
					return live(f.dot);
				}
			}
		} else {
			yield* g.srcCall(f, "back_to_idle");
			return live(f.dot);
		}
	} else if ($0 === 3) {
		if (!truthy(rt.sv(f, "target"))) {
			rt.setSv(f, "anchored", 0);
			rt.setSv(f, "mode", 0);
			rt.setSv(f, "last_found", rt.worldTime(f));
			rt.setSv(f, "frustration", 0);
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "handcuffed", rt.sv(f, "target")))) {
			yield* g.srcCall(f, "back_to_idle");
			return live(f.dot);
		}
		if (((!truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "target")))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "target"))])))) || (!isEqual(rt.fv(f, "loc", rt.sv(f, "target")), rt.sv(f, "target_lastloc")) && rt.lt((yield* g.callName(f, rt.sv(f, "target"), "AmountKnockdown", [])), 40)))) {
			yield* g.srcCall(f, "back_to_hunt");
			return live(f.dot);
		} else {
			rt.setSv(f, "mode", 2);
			rt.setSv(f, "anchored", 0);
		}
	} else if ($0 === 4) {
		yield* g.srcCall(f, "look_for_perp");
		yield* g.srcCall(f, "start_patrol");
	} else if ($0 === 5) {
		yield* g.srcCall(f, "look_for_perp");
		yield* g.srcCall(f, "bot_patrol");
	}
	return live(f.dot);
}, true, { waitfor: false });

// /mob/living/simple_animal/bot/ed209/proc/back_to_idle  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:325)
rt.def("/mob/living/simple_animal/bot/ed209/proc/back_to_idle", function back_to_idle(f: Frame) {
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "mode", 0);
	rt.setSv(f, "target", null);
	rt.setSv(f, "last_found", rt.worldTime(f));
	rt.setSv(f, "frustration", 0);
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/bot/ed209/proc/handle_automated_action")]);
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/back_to_hunt  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:331)
rt.def("/mob/living/simple_animal/bot/ed209/proc/back_to_hunt", function back_to_hunt(f: Frame) {
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "frustration", 0);
	rt.setSv(f, "mode", 1);
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/bot/ed209/proc/handle_automated_action")]);
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/look_for_perp  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:340)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/look_for_perp", function* look_for_perp(f: Frame) {
	let judgement_criteria: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [judgement_criteria, C, $e];
	if (truthy(rt.sv(f, "disabled"))) {
		return live(f.dot);
	}
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "threatlevel", 0);
	judgement_criteria = (yield* g.srcCall(f, "judgement_criteria"));
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((truthy(rt.fv(f, "stat", live(C))) || truthy(rt.fv(f, "handcuffed", live(C))))) {
			continue;
		}
		if ((isEqual(rt.fv(f, "name", live(C)), rt.sv(f, "oldtarget_name")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_found"), 100)))) {
			continue;
		}
		rt.setSv(f, "threatlevel", (yield* g.callName(f, live(C), "assess_threat", [null, live(judgement_criteria), null, rt.sv(f, "lasercolor"), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons")]))], rt.Args.Named)));
		if (!truthy(rt.sv(f, "threatlevel"))) {
			continue;
		}
		if (rt.ge(rt.sv(f, "threatlevel"), 4)) {
			rt.setSv(f, "target", live(C));
			rt.setSv(f, "oldtarget_name", rt.fv(f, "name", live(C)));
			yield* g.srcCall(f, "speak", fmt("Level ＀ infraction alert!", [rt.sv(f, "threatlevel")]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/voice/ed209_20sec.ogg"), rt.rsc("sound/voice/edplaceholder.ogg")]), 50, 0]);
			yield* g.srcCall(f, "visible_message", fmt("<b>＀</b> points at ＀!", [live(f.src), rt.fv(f, "name", live(C))]));
			rt.setSv(f, "mode", 1);
			rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/ed209/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:360", judgement_criteria, C);
			break;
		}
		continue;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/ed209/proc/look_for_perp, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:360", function* (f: Frame, judgement_criteria: Value, C: Value) {
	f.vars = () => [judgement_criteria, C];
	yield* g.srcCall(f, "handle_automated_action");
	return null;
});

// /mob/living/simple_animal/bot/ed209/proc/check_for_weapons  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:367)
rt.def("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons", function check_for_weapons(f: Frame, slot_item: Value) {
	if ((truthy(live(slot_item)) && truthy(rt.fv(f, "needs_permit", live(slot_item))))) {
		return 1;
	}
	return 0;
}, false, { argTypes: [{ type: 4, path: "/obj/item" }] });

// /mob/living/simple_animal/bot/ed209/proc/explode  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:372)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null, Sa: Value = null, G: Value = null;
	f.vars = () => [Tsec, Sa, G];
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ blows apart!</span>", [live(f.src)]));
	Tsec = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "build_step", (Sa = (yield* g.new_(f, T("/obj/item/weapon/ed209_assembly"), [live(Tsec)]))), 1);
	yield* g.callName(f, live(Sa), "add_overlay", ["hs_hole"]);
	rt.setFv(f, "created_name", live(Sa), rt.sv(f, "name"));
	yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [live(Tsec)]);
	if (!truthy(rt.sv(f, "lasercolor"))) {
		rt.setFv(f, "charge", rt.gv(f, "cell", (G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/advtaser"), [live(Tsec)])))), 0);
		yield* g.callName(f, live(G), "update_icon", []);
	} else {
		if (isEqual(rt.sv(f, "lasercolor"), "b")) {
			rt.setFv(f, "charge", rt.gv(f, "cell", (G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/bluetag"), [live(Tsec)])))), 0);
			yield* g.callName(f, live(G), "update_icon", []);
		} else {
			if (isEqual(rt.sv(f, "lasercolor"), "r")) {
				rt.setFv(f, "charge", rt.gv(f, "cell", (G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/redtag"), [live(Tsec)])))), 0);
				yield* g.callName(f, live(G), "update_icon", []);
			}
		}
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/bodypart/l_leg/robot"), [live(Tsec)]);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			yield* g.new_(f, T("/obj/item/bodypart/r_leg/robot"), [live(Tsec)]);
		}
	}
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.new_(f, T("/obj/item/clothing/head/helmet"), [live(Tsec)]);
		} else {
			if (!truthy(rt.sv(f, "lasercolor"))) {
				yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest"), [live(Tsec)]);
			}
			if (isEqual(rt.sv(f, "lasercolor"), "b")) {
				yield* g.new_(f, T("/obj/item/clothing/suit/bluetag"), [live(Tsec)]);
			}
			if (isEqual(rt.sv(f, "lasercolor"), "r")) {
				yield* g.new_(f, T("/obj/item/clothing/suit/redtag"), [live(Tsec)]);
			}
		}
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [rt.sv(f, "loc")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/ed209/proc/set_weapon  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:416)
rt.def("/mob/living/simple_animal/bot/ed209/proc/set_weapon", function set_weapon(f: Frame) {
	rt.setSv(f, "shoot_sound", rt.rsc("sound/weapons/laser.ogg"));
	if (isEqual(rt.sv(f, "emagged"), 2)) {
		if (truthy(rt.sv(f, "lasercolor"))) {
			rt.setSv(f, "projectile", T("/obj/item/projectile/beam/lasertag"));
		} else {
			rt.setSv(f, "projectile", T("/obj/item/projectile/beam"));
		}
	} else {
		if (!truthy(rt.sv(f, "lasercolor"))) {
			rt.setSv(f, "shoot_sound", rt.rsc("sound/weapons/taser.ogg"));
			rt.setSv(f, "projectile", T("/obj/item/projectile/energy/electrode"));
		} else {
			if (isEqual(rt.sv(f, "lasercolor"), "b")) {
				rt.setSv(f, "projectile", T("/obj/item/projectile/beam/lasertag/bluetag"));
			} else {
				if (!isEqual(rt.sv(f, "lasercolor"), "r")) return f.dot;
				rt.setSv(f, "projectile", T("/obj/item/projectile/beam/lasertag/redtag"));
			}
		}
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/ed209/proc/shootAt  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:432)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/shootAt", function* shootAt(f: Frame, target: Value) {
	let _T: Value = null, U: Value = null, A: Value = null;
	f.vars = () => [target, _T, U, A];
	if ((truthy(rt.sv(f, "lastfired")) && rt.lt(subtract(rt.worldTime(f), rt.sv(f, "lastfired")), rt.sv(f, "shot_delay")))) {
		return live(f.dot);
	}
	rt.setSv(f, "lastfired", rt.worldTime(f));
	_T = rt.sv(f, "loc");
	if (!truthy((U = rt.getStep(f, live(target), 0)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "projectile"))) {
		return live(f.dot);
	}
	A = (yield* g.new_(f, rt.sv(f, "projectile"), [rt.sv(f, "loc")]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "shoot_sound"), 50, 1]);
	rt.setFv(f, "current", live(A), live(U));
	rt.setFv(f, "yo", live(A), subtract(rt.fv(f, "y", live(U)), rt.fv(f, "y", live(_T))));
	rt.setFv(f, "xo", live(A), subtract(rt.fv(f, "x", live(U)), rt.fv(f, "x", live(_T))));
	yield* g.callName(f, live(A), "fire", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/ed209/proc/attack_alien  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:453)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/attack_alien", function* attack_alien(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/alien")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "target", live(f.args[0]));
	rt.setSv(f, "mode", 1);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/ed209/proc/emp_act  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:461)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let targets: Value = null, C: Value = null, toshoot: Value = null, toarrest: Value = null;
	let $e: any;
	f.vars = () => [severity, targets, C, toshoot, toarrest, $e];
	if ((isEqual(live(severity), 2) && truthy(rt.op(f, "Prob", [], [70])))) {
		yield* g.callSuper(f, [subtract(live(severity), 1)]);
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.sv(f, "loc")]);
		targets = (yield* g.new_(f, T("/list"), []));
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [12, live(f.src)])), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (isEqual(rt.fv(f, "stat", live(C)), 2)) {
				continue;
			}
			targets = rt.modify(live(targets), live(C), add);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(targets)))) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			if (truthy((toshoot = rt.op(f, "PickUnweighted", [1], [live(targets)])))) {
				(targets = rt.modify(live(targets), live(toshoot), subtract));
				if ((truthy(rt.op(f, "Prob", [], [50])) && rt.lt(rt.sv(f, "emagged"), 2))) {
					rt.setSv(f, "emagged", 2);
					yield* g.srcCall(f, "set_weapon");
					yield* g.srcCall(f, "shootAt", live(toshoot));
					rt.setSv(f, "emagged", 0);
					yield* g.srcCall(f, "set_weapon");
				} else {
					yield* g.srcCall(f, "shootAt", live(toshoot));
				}
			}
		} else {
			if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
			if (!truthy(rt.len(f, live(targets)))) return f.dot;
			if (!truthy((toarrest = rt.op(f, "PickUnweighted", [1], [live(targets)])))) return f.dot;
			rt.setSv(f, "target", live(toarrest));
			rt.setSv(f, "mode", 1);
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/ed209/proc/bullet_act  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:492)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	let lasertag_check: Value = null;
	f.vars = () => [Proj, lasertag_check];
	if (!truthy(rt.sv(f, "disabled"))) {
		lasertag_check = 0;
		if (isEqual(rt.sv(f, "lasercolor"), "b")) {
			if (truthy((rt.istype(live(Proj), T("/obj/item/projectile/beam/lasertag/redtag")) ? 1 : 0))) {
				lasertag_check = rt.inc(live(lasertag_check), 1);
			}
		} else {
			if (isEqual(rt.sv(f, "lasercolor"), "r")) {
				if (truthy((rt.istype(live(Proj), T("/obj/item/projectile/beam/lasertag/bluetag")) ? 1 : 0))) {
					lasertag_check = rt.inc(live(lasertag_check), 1);
				}
			}
		}
		if (truthy(live(lasertag_check))) {
			rt.setSv(f, "icon_state", fmt("＀ed2090", [rt.sv(f, "lasercolor")]));
			rt.setSv(f, "disabled", 1);
			rt.setSv(f, "target", null);
			rt.spawnTail(f, 100, "/mob/living/simple_animal/bot/ed209/proc/bullet_act: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:504", Proj, lasertag_check);
			return 1;
		} else {
			yield* g.callSuper(f, [live(Proj)]);
		}
	} else {
		yield* g.callSuper(f, [live(Proj)]);
	}
	return f.dot;
}, true);

// a spawn(100) body of /mob/living/simple_animal/bot/ed209/proc/bullet_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/bullet_act: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:504", function* (f: Frame, Proj: Value, lasertag_check: Value) {
	f.vars = () => [Proj, lasertag_check];
	rt.setSv(f, "disabled", 0);
	rt.setSv(f, "icon_state", fmt("＀ed2091", [rt.sv(f, "lasercolor")]));
	return null;
});

// /mob/living/simple_animal/bot/ed209/proc/UnarmedAttack  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:520)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if ((!truthy((yield* g.callName(f, (C = live(f.args[0])), "IsStun", []))) || truthy(rt.sv(f, "arrest_type")))) {
			yield* g.srcCall(f, "stun_attack", live(f.args[0]));
		} else {
			if ((truthy((yield* g.callName(f, live(C), "canBeHandcuffed", []))) && !truthy(rt.fv(f, "handcuffed", live(C))))) {
				yield* g.srcCall(f, "cuff", live(f.args[0]));
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/bot/ed209/proc/RangedAttack  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:532)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "shootAt", live(A));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/ed209/proc/stun_attack  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:537)  may sleep
rt.def("/mob/living/simple_animal/bot/ed209/proc/stun_attack", function* stun_attack(f: Frame, C: Value) {
	let threat: Value = null, H: Value = null, judgement_criteria: Value = null, location: Value = null;
	let $0: any;
	f.vars = () => [C, threat, H, judgement_criteria, location, $0];
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1]);
	rt.setSv(f, "icon_state", fmt("＀ed209-c", [rt.sv(f, "lasercolor")]));
	rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/ed209/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:539", C, threat, H, judgement_criteria, location);
	threat = 5;
	yield* g.callName(f, live(C), "Knockdown", [100]);
	rt.setFv(f, "stuttering", live(C), 5);
	if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(C);
		judgement_criteria = (yield* g.srcCall(f, "judgement_criteria"));
		threat = (yield* g.callName(f, live(H), "assess_threat", [null, live(judgement_criteria), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons")]))], rt.Args.Named));
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), live(C), "stunned"]);
	if (truthy(rt.sv(f, "declare_arrests"))) {
		location = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
		if (truthy(rt.sv(f, "arrest_type"))) {
			$0 = "Detaining";
		} else {
			$0 = "Arresting";
		}
		yield* g.srcCall(f, "speak", fmt("＀ level ＀ scumbag <b>＀</b> in ＀.", [$0, live(threat), live(C), live(location)]), rt.sv(f, "radio_channel"));
	}
	yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ has stunned ＀!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＀ has stunned you!</span>", [live(f.src)])]);
	return f.dot;
}, true);

// a spawn(2) body of /mob/living/simple_animal/bot/ed209/proc/stun_attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:539", function* (f: Frame, C: Value, threat: Value, H: Value, judgement_criteria: Value, location: Value) {
	f.vars = () => [C, threat, H, judgement_criteria, location];
	rt.setSv(f, "icon_state", fmt("＀ed209＀", [rt.sv(f, "lasercolor"), rt.sv(f, "on")]));
	return null;
});

// /mob/living/simple_animal/bot/ed209/proc/cuff  (code/modules/mob/living/simple_animal/bot/ed209bot.dm:557)
rt.def("/mob/living/simple_animal/bot/ed209/proc/cuff", function cuff(f: Frame, C: Value) {
	rt.setSv(f, "mode", 3);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2]);
	rt.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is trying to put zipties on ＀!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＀ is trying to put zipties on you!</span>", [live(f.src)])]);
	rt.spawnTail(f, 60, "/mob/living/simple_animal/bot/ed209/proc/cuff: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:561", C);
	return f.dot;
});

// a spawn(60) body of /mob/living/simple_animal/bot/ed209/proc/cuff, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/cuff: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:561", function* (f: Frame, C: Value) {
	f.vars = () => [C];
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(C)))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(C))]))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "handcuffed", live(C)))) {
		rt.setFv(f, "handcuffed", live(C), (yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"), [live(C)])));
		yield* g.callName(f, live(C), "update_handcuffed", []);
		yield* g.srcCall(f, "back_to_idle");
	}
	return null;
});
