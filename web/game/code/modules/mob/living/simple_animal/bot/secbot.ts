// From code/modules/mob/living/simple_animal/bot/secbot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5042, "/mob/living/simple_animal/bot/secbot", "/mob/living/simple_animal/bot", {
	target: null,
	oldtarget_name: null,
	threatlevel: 0,
	target_lastloc: null,
	last_found: null,
	declare_arrests: 1,
	idcheck: 0,
	weaponscheck: 0,
	check_records: 1,
	arrest_type: 0,
	baton_type: rt.typePath("/obj/item/weapon/melee/baton"),
	anchored: 0,
	pass_flags: 16,
	radio_channel: "Security",
	bot_type: 1,
	model: "Securitron",
	window_id: "autosec",
	window_name: "Automatic Security Unit v1.6",
	allow_pai: 0,
	data_hud_type: 2,
	name: "１Securitron",
	desc: "A little security robot.  He looks less than thrilled.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "secbot0",
	density: 0,
	health: 25,
	maxHealth: 25,
	damage_coeff: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/secbot"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/secbot"),
});

// /mob/living/simple_animal/bot/secbot/proc/<init>  (code/modules/mob/living/simple_animal/bot/secbot.dm:10)
rt.def("/mob/living/simple_animal/bot/secbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.5, "fire", 0.699999988079071, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	return f.dot;
});

rt.type(5044, "/mob/living/simple_animal/bot/secbot/beepsky/jr", "/mob/living/simple_animal/bot/secbot/beepsky", {
	name: "Officer Pipsqueak",
	desc: "It's Officer Beep O'sky's smaller, just-as aggressive cousin, Pipsqueak.",
});

// /mob/living/simple_animal/bot/secbot/beepsky/jr/proc/Initialize  (code/modules/mob/living/simple_animal/bot/secbot.dm:47)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/beepsky/jr/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "resize", 0.800000011920929);
	yield* g.srcCall(f, "update_transform");
	return f.dot;
}, true);

rt.type(5043, "/mob/living/simple_animal/bot/secbot/beepsky", "/mob/living/simple_animal/bot/secbot", {
	idcheck: 0,
	weaponscheck: 0,
	auto_patrol: 1,
	name: "Officer Beep O'sky",
	desc: "It's Officer Beep O'sky! Powered by a potato and a shot of whiskey.",
});

// /mob/living/simple_animal/bot/secbot/beepsky/proc/explode  (code/modules/mob/living/simple_animal/bot/secbot.dm:53)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/beepsky/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null, S: Value = null;
	f.vars = () => [Tsec, S];
	yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/potato"), [(Tsec = rt.getStep(f, live(f.src), 0))]);
	yield* g.callName(f, rt.gv(f, "reagents", (S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass"), [live(Tsec)])))), "add_reagent", ["whiskey", 15]);
	yield* g.callName(f, live(S), "on_reagent_change", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/secbot/proc/Initialize  (code/modules/mob/living/simple_animal/bot/secbot.dm:66)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null, secsensor: Value = null;
	f.vars = () => [J, secsensor];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("secbot＀", [rt.sv(f, "on")]));
	rt.spawnTail(f, 3, "/mob/living/simple_animal/bot/secbot/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/secbot.dm:68", J, secsensor);
	yield* g.callName(f, (secsensor = rt.index(rt.gl("huds"), 2)), "add_hud_to", [live(f.src)]);
	return f.dot;
}, true);

// a spawn(3) body of /mob/living/simple_animal/bot/secbot/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/secbot.dm:68", function* (f: Frame, J: Value, secsensor: Value) {
	f.vars = () => [J, secsensor];
	J = (yield* g.new_(f, T("/datum/job/detective"), []));
	rt.modField(f, rt.sv(f, "access_card"), "access", (yield* g.callName(f, live(J), "get_access", [])), add);
	rt.setSv(f, "prev_access", rt.fv(f, "access", rt.sv(f, "access_card")));
	return null;
});

// /mob/living/simple_animal/bot/secbot/proc/turn_on  (code/modules/mob/living/simple_animal/bot/secbot.dm:78)
rt.def("/mob/living/simple_animal/bot/secbot/proc/turn_on", function turn_on(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("secbot＀", [rt.sv(f, "on")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/secbot/proc/turn_off  (code/modules/mob/living/simple_animal/bot/secbot.dm:82)
rt.def("/mob/living/simple_animal/bot/secbot/proc/turn_off", function turn_off(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("secbot＀", [rt.sv(f, "on")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/secbot/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/secbot.dm:86)
rt.def("/mob/living/simple_animal/bot/secbot/proc/bot_reset", function bot_reset(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", null);
	rt.setSv(f, "oldtarget_name", null);
	rt.setSv(f, "anchored", 0);
	rt.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	rt.setSv(f, "last_found", rt.worldTime(f));
	return f.dot;
});

// /mob/living/simple_animal/bot/secbot/proc/set_custom_texts  (code/modules/mob/living/simple_animal/bot/secbot.dm:95)
rt.def("/mob/living/simple_animal/bot/secbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	rt.setSv(f, "text_hack", fmt("You overload ＀'s target identification system.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack", fmt("You reboot ＀ and restore the target identification.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack_fail", fmt("＀ refuses to accept your authority!", [rt.sv(f, "name")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/secbot/proc/get_controls  (code/modules/mob/living/simple_animal/bot/secbot.dm:101)
rt.def("/mob/living/simple_animal/bot/secbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
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
	dat = rt.modify(live(dat), fmt("\n<TT><B>Securitron v1.6 controls</B></TT><BR><BR>\nStatus: ＀<BR>\nBehaviour controls are ＀<BR>\nMaintenance panel panel is ＀", [$0, $1, $2]), add);
	if (((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
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
		dat = rt.modify(live(dat), fmt("<BR>\nArrest Unidentifiable Persons: ＀<BR>\nArrest for Unauthorized Weapons: ＀<BR>\nArrest for Warrant: ＀<BR>\nOperating Mode: ＀<BR>\nReport Arrests＀<BR>\nAuto Patrol: ＀", [$0, $1, $2, $3, $4, fmt("<A href='?src=＃;operation=patrol'>＀</A>", [$5, $6])]), add);
	}
	return live(dat);
});

// /mob/living/simple_animal/bot/secbot/proc/Topic  (code/modules/mob/living/simple_animal/bot/secbot.dm:130)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
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

// /mob/living/simple_animal/bot/secbot/proc/retaliate  (code/modules/mob/living/simple_animal/bot/secbot.dm:151)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/retaliate", function* retaliate(f: Frame, H: Value) {
	let judgement_criteria: Value = null;
	f.vars = () => [H, judgement_criteria];
	judgement_criteria = (yield* g.srcCall(f, "judgement_criteria"));
	rt.setSv(f, "threatlevel", (yield* g.callName(f, live(H), "assess_threat", [null, live(judgement_criteria), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons")]))], rt.Args.Named)));
	if (!rt.ge((rt.modSrcVar(f, "threatlevel", 6, add)), 4)) return f.dot;
	rt.setSv(f, "target", live(H));
	rt.setSv(f, "mode", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/secbot/proc/judgement_criteria  (code/modules/mob/living/simple_animal/bot/secbot.dm:161)
rt.def("/mob/living/simple_animal/bot/secbot/proc/judgement_criteria", function judgement_criteria(f: Frame) {
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
	return live(final);
});

// /mob/living/simple_animal/bot/secbot/proc/attack_hand  (code/modules/mob/living/simple_animal/bot/secbot.dm:171)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm") || isEqual(rt.fv(f, "a_intent", live(f.args[0])), "disarm"))) {
		yield* g.srcCall(f, "retaliate", live(f.args[0]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["H"] });

// /mob/living/simple_animal/bot/secbot/proc/attackby  (code/modules/mob/living/simple_animal/bot/secbot.dm:177)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
		return live(f.dot);
	}
	if (!(((!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.fv(f, "force", live(f.args[0])))) && !truthy(rt.sv(f, "target"))) && !isEqual(rt.fv(f, "damtype", live(f.args[0])), "stamina"))) return f.dot;
	yield* g.srcCall(f, "retaliate", live(f.args[1]));
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/bot/secbot/proc/emag_act  (code/modules/mob/living/simple_animal/bot/secbot.dm:184)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/emag_act", function* emag_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "emagged"), 2)) return f.dot;
	if (truthy(live(f.args[0]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='danger'>You short out ＀'s target assessment circuits.</span>", [live(f.src)])]);
		rt.setSv(f, "oldtarget_name", rt.fv(f, "name", live(f.args[0])));
	}
	yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ buzzes oddly!</span>", [live(f.src)]));
	rt.setSv(f, "declare_arrests", 0);
	rt.setSv(f, "icon_state", fmt("secbot＀", [rt.sv(f, "on")]));
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/secbot/proc/bullet_act  (code/modules/mob/living/simple_animal/bot/secbot.dm:194)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/bullet_act", function* bullet_act(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/bullet")) ? 1 : 0)))) {
		if ((isEqual(rt.fv(f, "damage_type", live(f.args[0])), "fire") || isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute"))) {
			if ((!truthy(rt.fv(f, "nodamage", live(f.args[0]))) && rt.lt(rt.fv(f, "damage", live(f.args[0])), rt.fv(f, "health", live(f.src))))) {
				yield* g.srcCall(f, "retaliate", rt.fv(f, "firer", live(f.args[0])));
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["Proj"] });

// /mob/living/simple_animal/bot/secbot/proc/UnarmedAttack  (code/modules/mob/living/simple_animal/bot/secbot.dm:202)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
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

// /mob/living/simple_animal/bot/secbot/proc/hitby  (code/modules/mob/living/simple_animal/bot/secbot.dm:215)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null, H: Value = null;
	f.vars = () => [I, H];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		if (((rt.lt(rt.gv(f, "throwforce", (I = live(f.args[0]))), rt.fv(f, "health", live(f.src))) && truthy(rt.fv(f, "thrownby", live(I)))) && truthy((rt.istype(rt.fv(f, "thrownby", live(I)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			yield* g.srcCall(f, "retaliate", (H = rt.fv(f, "thrownby", live(I))));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /mob/living/simple_animal/bot/secbot/proc/cuff  (code/modules/mob/living/simple_animal/bot/secbot.dm:225)
rt.def("/mob/living/simple_animal/bot/secbot/proc/cuff", function cuff(f: Frame, C: Value) {
	rt.setSv(f, "mode", 3);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2]);
	rt.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ is trying to put zipties on ＀!</span>", [live(f.src), live(C)]), fmt("<span class='userdanger'>＀ is trying to put zipties on you!</span>", [live(f.src)])]);
	rt.spawnTail(f, 60, "/mob/living/simple_animal/bot/secbot/proc/cuff: spawn at modules/mob/living/simple_animal/bot/secbot.dm:228", C);
	return f.dot;
});

// a spawn(60) body of /mob/living/simple_animal/bot/secbot/proc/cuff, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/cuff: spawn at modules/mob/living/simple_animal/bot/secbot.dm:228", function* (f: Frame, C: Value) {
	f.vars = () => [C];
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(C)))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(C))]))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "handcuffed", live(C)))) {
		rt.setFv(f, "handcuffed", live(C), (yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"), [live(C)])));
		yield* g.callName(f, live(C), "update_handcuffed", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [6], [rt.rsc("sound/voice/bgod.ogg"), rt.rsc("sound/voice/biamthelaw.ogg"), rt.rsc("sound/voice/bsecureday.ogg"), rt.rsc("sound/voice/bradio.ogg"), rt.rsc("sound/voice/binsult.ogg"), rt.rsc("sound/voice/bcreep.ogg")]), 50, 0]);
		yield* g.srcCall(f, "back_to_idle");
	}
	return null;
});

// /mob/living/simple_animal/bot/secbot/proc/stun_attack  (code/modules/mob/living/simple_animal/bot/secbot.dm:238)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/stun_attack", function* stun_attack(f: Frame, C: Value) {
	let judgement_criteria: Value = null, threat: Value = null, H: Value = null, location: Value = null;
	let $0: any;
	f.vars = () => [C, judgement_criteria, threat, H, location, $0];
	judgement_criteria = (yield* g.srcCall(f, "judgement_criteria"));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1]);
	rt.setSv(f, "icon_state", "secbot-c");
	rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/secbot/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/secbot.dm:241", C, judgement_criteria, threat, H, location);
	threat = 5;
	if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.setFv(f, "stuttering", live(C), 5);
		yield* g.callName(f, live(C), "Knockdown", [100]);
		threat = (yield* g.callName(f, (H = live(C)), "assess_threat", [null, live(judgement_criteria), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons")]))], rt.Args.Named));
	} else {
		yield* g.callName(f, live(C), "Knockdown", [100]);
		rt.setFv(f, "stuttering", live(C), 5);
		threat = (yield* g.callName(f, live(C), "assess_threat", [null, live(judgement_criteria), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons")]))], rt.Args.Named));
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

// a spawn(2) body of /mob/living/simple_animal/bot/secbot/proc/stun_attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/secbot.dm:241", function* (f: Frame, C: Value, judgement_criteria: Value, threat: Value, H: Value, location: Value) {
	f.vars = () => [C, judgement_criteria, threat, H, location];
	rt.setSv(f, "icon_state", fmt("secbot＀", [rt.sv(f, "on")]));
	return null;
});

// /mob/living/simple_animal/bot/secbot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/secbot.dm:262)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let olddist: Value = null;
	let $0: any;
	f.vars = () => [olddist, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
		yield* g.srcCall(f, "look_for_perp");
		if ((!truthy(rt.sv(f, "mode")) && truthy(rt.sv(f, "auto_patrol")))) {
			rt.setSv(f, "mode", 4);
		}
	} else if ($0 === 1) {
		if (rt.ge(rt.sv(f, "frustration"), 8)) {
			yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
			yield* g.srcCall(f, "back_to_idle");
			return live(f.dot);
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

// /mob/living/simple_animal/bot/secbot/proc/back_to_idle  (code/modules/mob/living/simple_animal/bot/secbot.dm:355)
rt.def("/mob/living/simple_animal/bot/secbot/proc/back_to_idle", function back_to_idle(f: Frame) {
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "mode", 0);
	rt.setSv(f, "target", null);
	rt.setSv(f, "last_found", rt.worldTime(f));
	rt.setSv(f, "frustration", 0);
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/secbot/proc/back_to_idle: spawn at modules/mob/living/simple_animal/bot/secbot.dm:355");
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/secbot/proc/back_to_idle, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/back_to_idle: spawn at modules/mob/living/simple_animal/bot/secbot.dm:355", function* (f: Frame) {
	yield* g.srcCall(f, "handle_automated_action");
	return null;
});

// /mob/living/simple_animal/bot/secbot/proc/back_to_hunt  (code/modules/mob/living/simple_animal/bot/secbot.dm:362)
rt.def("/mob/living/simple_animal/bot/secbot/proc/back_to_hunt", function back_to_hunt(f: Frame) {
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "frustration", 0);
	rt.setSv(f, "mode", 1);
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/secbot/proc/back_to_hunt: spawn at modules/mob/living/simple_animal/bot/secbot.dm:362");
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/secbot/proc/back_to_hunt, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/back_to_hunt: spawn at modules/mob/living/simple_animal/bot/secbot.dm:362", function* (f: Frame) {
	yield* g.srcCall(f, "handle_automated_action");
	return null;
});

// /mob/living/simple_animal/bot/secbot/proc/look_for_perp  (code/modules/mob/living/simple_animal/bot/secbot.dm:368)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/look_for_perp", function* look_for_perp(f: Frame) {
	let judgement_criteria: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [judgement_criteria, C, $e];
	rt.setSv(f, "anchored", 0);
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
		rt.setSv(f, "threatlevel", (yield* g.callName(f, live(C), "assess_threat", [null, live(judgement_criteria), "weaponcheck", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons")]))], rt.Args.Named)));
		if (!truthy(rt.sv(f, "threatlevel"))) {
			continue;
		}
		if (rt.ge(rt.sv(f, "threatlevel"), 4)) {
			rt.setSv(f, "target", live(C));
			rt.setSv(f, "oldtarget_name", rt.fv(f, "name", live(C)));
			yield* g.srcCall(f, "speak", fmt("Level ＀ infraction alert!", [rt.sv(f, "threatlevel")]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/voice/bcriminal.ogg"), rt.rsc("sound/voice/bjustice.ogg"), rt.rsc("sound/voice/bfreeze.ogg")]), 50, 0]);
			yield* g.srcCall(f, "visible_message", fmt("<b>＀</b> points at ＀!", [live(f.src), rt.fv(f, "name", live(C))]));
			rt.setSv(f, "mode", 1);
			rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/secbot/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/secbot.dm:388", judgement_criteria, C);
			break;
		}
		continue;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/secbot/proc/look_for_perp, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/secbot.dm:388", function* (f: Frame, judgement_criteria: Value, C: Value) {
	f.vars = () => [judgement_criteria, C];
	yield* g.srcCall(f, "handle_automated_action");
	return null;
});

// /mob/living/simple_animal/bot/secbot/proc/check_for_weapons  (code/modules/mob/living/simple_animal/bot/secbot.dm:394)
rt.def("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons", function check_for_weapons(f: Frame, slot_item: Value) {
	if ((truthy(live(slot_item)) && truthy(rt.fv(f, "needs_permit", live(slot_item))))) {
		return 1;
	}
	return 0;
}, false, { argTypes: [{ type: 4, path: "/obj/item" }] });

// /mob/living/simple_animal/bot/secbot/proc/explode  (code/modules/mob/living/simple_animal/bot/secbot.dm:400)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null, Sa: Value = null;
	f.vars = () => [Tsec, Sa];
	yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), 0]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ blows apart!</span>", [live(f.src)]));
	Tsec = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "build_step", (Sa = (yield* g.new_(f, T("/obj/item/weapon/secbot_assembly"), [live(Tsec)]))), 1);
	yield* g.callName(f, live(Sa), "add_overlay", ["hs_hole"]);
	rt.setFv(f, "created_name", live(Sa), rt.sv(f, "name"));
	yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [live(Tsec)]);
	yield* g.new_(f, rt.sv(f, "baton_type"), [live(Tsec)]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [live(Tsec)]);
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [rt.sv(f, "loc")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/secbot/proc/attack_alien  (code/modules/mob/living/simple_animal/bot/secbot.dm:420)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/attack_alien", function* attack_alien(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/alien")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "target", live(f.args[0]));
	rt.setSv(f, "mode", 1);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/secbot/proc/Crossed  (code/modules/mob/living/simple_animal/bot/secbot.dm:426)  may sleep
rt.def("/mob/living/simple_animal/bot/secbot/proc/Crossed", function* Crossed(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "target")))) {
		if (((!truthy((rt.istype((C = live(f.args[0])), T("/mob/living/carbon")) ? 1 : 0)) || !truthy(live(C))) || rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "target")])), 1))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "knockOver", live(C));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

rt.type(10946, "/obj/machinery/bot_core/secbot", "/obj/machinery/bot_core", {
	req_access: null,
});

// /obj/machinery/bot_core/secbot/proc/<init>  (code/modules/mob/living/simple_animal/bot/secbot.dm:435)
rt.def("/obj/machinery/bot_core/secbot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(1));
	return f.dot;
});
