// From code/modules/awaymissions/mission_code/Academy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13036, "/obj/singularity/academy", "/obj/singularity", {
	dissipate: 0,
	move_self: 0,
	grav_pull: 1,
});

// /obj/singularity/academy/proc/process  (code/modules/awaymissions/mission_code/Academy.dm:13)  may sleep
rt.def("/obj/singularity/academy/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "eat");
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	yield* g.srcCall(f, "mezzer");
	return f.dot;
}, true, { waitfor: false });

rt.type(12934, "/obj/structure/academy_wizard_spawner", "/obj/structure", {
	current_wizard: null,
	next_check: 0,
	cooldown: 600,
	faction: "wizard",
	braindead_check: 0,
	anchored: 1,
	name: "Academy Defensive System",
	desc: "Made by Abjuration Inc",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "forge",
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/academy_wizard_spawner/proc/New  (code/modules/awaymissions/mission_code/Academy.dm:40)
rt.def("/obj/structure/academy_wizard_spawner/proc/New", function New(f: Frame) {
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/structure/academy_wizard_spawner/proc/Destroy  (code/modules/awaymissions/mission_code/Academy.dm:43)  may sleep
rt.def("/obj/structure/academy_wizard_spawner/proc/Destroy", function* Destroy(f: Frame) {
	if (!truthy(rt.sv(f, "broken"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/academy_wizard_spawner/proc/process  (code/modules/awaymissions/mission_code/Academy.dm:48)  may sleep
rt.def("/obj/structure/academy_wizard_spawner/proc/process", function* process(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if (!rt.lt(rt.sv(f, "next_check"), rt.worldTime(f))) return f.dot;
	if (!truthy(rt.sv(f, "current_wizard"))) {
		L = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (((isEqual(rt.fv(f, "z", live(L)), rt.fv(f, "z", live(f.src))) && !isEqual(rt.fv(f, "stat", live(L)), 2)) && !truthy((rt.isIn(f, rt.sv(f, "faction"), rt.fv(f, "faction", live(L))) ? 1 : 0)))) {
				yield* g.srcCall(f, "summon_wizard");
				break;
			}
		}
		rt.endFor(f, 0);
	} else {
		if (isEqual(rt.fv(f, "stat", rt.sv(f, "current_wizard")), 2)) {
			rt.setSv(f, "current_wizard", null);
			yield* g.srcCall(f, "summon_wizard");
		}
		if (!truthy(rt.fv(f, "client", rt.sv(f, "current_wizard")))) {
			if (!truthy(rt.sv(f, "braindead_check"))) {
				rt.setSv(f, "braindead_check", 1);
			} else {
				rt.setSv(f, "braindead_check", 0);
				yield* g.srcCall(f, "give_control");
			}
		}
	}
	rt.setSv(f, "next_check", add(rt.worldTime(f), rt.sv(f, "cooldown")));
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/academy_wizard_spawner/proc/give_control  (code/modules/awaymissions/mission_code/Academy.dm:69)  may sleep
rt.def("/obj/structure/academy_wizard_spawner/proc/give_control", function* give_control(f: Frame) {
	let candidates: Value = null, chosen: Value = null;
	f.vars = () => [candidates, chosen];
	if (!truthy(rt.sv(f, "current_wizard"))) {
		return live(f.dot);
	}
	candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [null, "Do you want to play as Wizard Academy Defender?", null, "wizard", null, null, "be_special_flag", "wizard", "M", rt.sv(f, "current_wizard")], rt.Args.Named));
	chosen = null;
	if (!truthy(rt.len(f, live(candidates)))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ was spawned as Wizard Academy Defender", [(yield* g.call(f, P("/proc/key_name_admin"), null, [(chosen = rt.op(f, "PickUnweighted", [1], [live(candidates)]))]))])]);
	yield* g.callName(f, rt.sv(f, "current_wizard"), "ghostize", []);
	rt.setFv(f, "key", rt.sv(f, "current_wizard"), rt.fv(f, "key", live(chosen)));
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/academy_wizard_spawner/proc/summon_wizard  (code/modules/awaymissions/mission_code/Academy.dm:83)  may sleep
rt.def("/obj/structure/academy_wizard_spawner/proc/summon_wizard", function* summon_wizard(f: Frame) {
	let _T: Value = null, wizbody: Value = null, Implant: Value = null, wizmind: Value = null, O: Value = null;
	f.vars = () => [_T, wizbody, Implant, wizmind, O];
	_T = rt.fv(f, "loc", live(f.src));
	yield* g.callName(f, (wizbody = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(_T)]))), "equipOutfit", [T("/datum/outfit/wizard/academy")]);
	yield* g.callName(f, (Implant = (yield* g.new_(f, T("/obj/item/weapon/implant/exile"), [live(wizbody)]))), "implant", [live(wizbody)]);
	(rt.modField(f, live(wizbody), "faction", "wizard", rt.bitOr));
	rt.setFv(f, "real_name", live(wizbody), "Academy Teacher");
	rt.setFv(f, "name", live(wizbody), "Academy Teacher");
	rt.setFv(f, "name", (wizmind = (yield* g.new_(f, T("/datum/mind"), []))), "Wizard Defender");
	rt.setFv(f, "special_role", live(wizmind), "Academy Defender");
	O = (yield* g.new_(f, T("/datum/objective"), ["Protect Wizard Academy from the intruders"]));
	rt.modField(f, live(wizmind), "objectives", live(O), add);
	yield* g.callName(f, live(wizmind), "transfer_to", [live(wizbody)]);
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "wizards", live(wizmind), rt.bitOr));
	yield* g.callName(f, live(wizmind), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"), []))]);
	yield* g.callName(f, live(wizmind), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"), []))]);
	yield* g.callName(f, live(wizmind), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aimed/fireball"), []))]);
	rt.setSv(f, "current_wizard", live(wizbody));
	yield* g.srcCall(f, "give_control");
	return f.dot;
}, true);

// /obj/structure/academy_wizard_spawner/proc/deconstruct  (code/modules/awaymissions/mission_code/Academy.dm:108)
rt.def("/obj/structure/academy_wizard_spawner/proc/deconstruct", function deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (truthy(rt.sv(f, "broken"))) return f.dot;
	rt.setSv(f, "broken", 1);
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ breaks down!</span>", [live(f.src)])]);
	rt.setSv(f, "icon_state", "forge_off");
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
});

rt.type(645, "/datum/outfit/wizard/academy", "/datum/outfit/wizard", {
	name: "Academy Wizard",
	r_pocket: null,
	r_hand: null,
	suit: rt.typePath("/obj/item/clothing/suit/wizrobe/red"),
	head: rt.typePath("/obj/item/clothing/head/wizard/red"),
	backpack_contents: null,
});

// /datum/outfit/wizard/academy/proc/<init>  (code/modules/awaymissions/mission_code/Academy.dm:120)
rt.def("/datum/outfit/wizard/academy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/survival"), 1]));
	return f.dot;
});

rt.type(7170, "/obj/item/weapon/dice/d20/fate", "/obj/item/weapon/dice/d20", {
	reusable: 1,
	used: 0,
	sides: 20,
	can_be_rigged: 0,
	name: "Die of Fate",
	desc: "A die with twenty sides. You can feel unearthly energies radiating from it. Using this might be VERY risky.",
	icon_state: "d20",
});

// /obj/item/weapon/dice/d20/fate/proc/diceroll  (code/modules/awaymissions/mission_code/Academy.dm:135)  may sleep
rt.def("/obj/item/weapon/dice/d20/fate/proc/diceroll", function* diceroll(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "used"))) return f.dot;
	if (((!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(f.args[0])))) || truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You feel the magic of the dice is restricted to ordinary humans!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "rigged"))) {
		yield* g.srcCall(f, "effect", live(f.args[0]), rt.sv(f, "rigged"));
	} else {
		yield* g.srcCall(f, "effect", live(f.args[0]), rt.sv(f, "result"));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/dice/d20/fate/proc/equipped  (code/modules/awaymissions/mission_code/Academy.dm:146)  may sleep
rt.def("/obj/item/weapon/dice/d20/fate/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	f.vars = () => [user, slot];
	if (!((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.fv(f, "mind", live(user)))) || truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You feel the magic of the dice is restricted to ordinary humans! You should leave it alone.</span>"]);
	yield* g.callName(f, live(user), "drop_item", []);
	return f.dot;
}, true);

// /obj/item/weapon/dice/d20/fate/proc/effect  (code/modules/awaymissions/mission_code/Academy.dm:152)  may sleep
rt.def("/obj/item/weapon/dice/d20/fate/proc/effect", function* effect(f: Frame, user: Value, roll: Value) {
	let direction: Value = null, _T: Value = null, I: Value = null, S: Value = null, throw_dir: Value = null, throw_target: Value = null, D: Value = null, C: Value = null, Start: Value = null, direction_1: Value = null, _T_2: Value = null, M: Value = null, i: Value = null, H: Value = null, servant_mind: Value = null, O: Value = null, candidates: Value = null, chosen: Value = null, S_5: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, roll, direction, _T, I, S, throw_dir, throw_target, D, C, Start, direction_1, _T_2, M, i, H, servant_mind, O, candidates, chosen, S_5, $0, $e];
	if (!truthy(rt.sv(f, "reusable"))) {
		rt.setSv(f, "used", 1);
	}
	yield* g.srcCall(f, "visible_message", "<span class='userdanger'>The die flare briefly.</span>");
	$0 = live(roll);
	if ($0 === 1) {
		yield* g.callName(f, live(user), "dust", []);
	} else if ($0 === 2) {
		yield* g.callName(f, live(user), "death", []);
	} else if ($0 === 3) {
		direction = null;
		rt.forList(f, 0, rt.gl("alldirs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			direction = $e;
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/creature"), [rt.getStep(f, (_T = rt.getStep(f, live(f.src), 0)), live(direction))]);
		}
		rt.endFor(f, 0);
	} else if ($0 === 4) {
		I = null;
		rt.forList(f, 0, live(user), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/implant")) ? 1 : 0))) {
				continue;
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
	} else if ($0 === 5) {
		yield* g.callName(f, live(user), "monkeyize", []);
	} else if ($0 === 6) {
		rt.modField(f, (S = rt.gv(f, "species", rt.fv(f, "dna", live(user)))), "speedmod", 1, add);
	} else if ($0 === 7) {
		yield* g.callName(f, live(user), "Stun", [60]);
		yield* g.callName(f, live(user), "adjustBruteLoss", [50]);
		throw_dir = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
		throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(user), live(throw_dir)]));
		yield* g.callName(f, live(user), "throw_at", [live(throw_target), 200, 4]);
	} else if ($0 === 8) {
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, 0, null, 2, "flame_range", 2], rt.Args.Named);
	} else if ($0 === 9) {
		D = (yield* g.new_(f, T("/datum/disease/cold"), []));
		yield* g.callName(f, live(user), "ForceContractDisease", [live(D)]);
	} else if ($0 === 10) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ roll perfectly.</span>", [live(f.src)]));
	} else if ($0 === 11) {
		rt.setFv(f, "name", (C = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/cookie"), [rt.getStep(f, live(f.src), 0)]))), "Cookie of Fate");
	} else if ($0 === 12) {
		yield* g.callName(f, live(user), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
	} else if ($0 === 13) {
		Start = rt.getStep(f, live(f.src), 0);
		direction_1 = null;
		rt.forList(f, 0, rt.gl("alldirs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			direction_1 = $e;
			_T_2 = rt.getStep(f, live(Start), live(direction_1));
			if (truthy((yield* g.call(f, P("/proc/rand"), null, [0, 1])))) {
				yield* g.new_(f, T("/obj/item/stack/spacecash/c1000"), [live(_T_2)]);
			} else {
				M = (yield* g.new_(f, T("/obj/item/weapon/storage/bag/money"), [live(_T_2)]));
				i = null;
				rt.forRange(f, 1, 1, (yield* g.call(f, P("/proc/rand"), null, [5, 50])), 1);
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					yield* g.new_(f, T("/obj/item/weapon/coin/gold"), [live(M)]);
				}
				rt.endFor(f, 1);
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === 14) {
		yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/mateba"), [rt.getStep(f, live(f.src), 0)]);
	} else if ($0 === 15) {
		yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/random"), [rt.getStep(f, live(f.src), 0)]);
	} else if ($0 === 16) {
		yield* g.callName(f, (H = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.getStep(f, live(f.src), 0)]))), "equipOutfit", [T("/datum/outfit/butler")]);
		servant_mind = (yield* g.new_(f, T("/datum/mind"), []));
		O = (yield* g.new_(f, T("/datum/objective"), [fmt("Serve ＀.", [rt.fv(f, "real_name", live(user))])]));
		rt.modField(f, live(servant_mind), "objectives", live(O), add);
		yield* g.callName(f, live(servant_mind), "transfer_to", [live(H)]);
		candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [null, fmt("Do you want to play as ＀ Servant?", [rt.fv(f, "real_name", live(user))]), null, "wizard", "mob", live(H)], rt.Args.Named));
		chosen = null;
		if (truthy(rt.len(f, live(candidates)))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ was spawned as Dice Servant", [(yield* g.call(f, P("/proc/key_name_admin"), null, [(chosen = rt.op(f, "PickUnweighted", [1], [live(candidates)]))]))])]);
			rt.setFv(f, "key", live(H), rt.fv(f, "key", live(chosen)));
		}
		rt.setFv(f, "target_mob", (S_5 = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/summonmob"), []))), live(H));
		yield* g.callName(f, rt.fv(f, "mind", live(user)), "AddSpell", [live(S_5)]);
	} else if ($0 === 17) {
		yield* g.new_(f, T("/obj/item/weapon/storage/box/syndicate"), [rt.getStep(f, live(f.src), 0)]);
	} else if ($0 === 18) {
		yield* g.new_(f, T("/obj/item/weapon/card/id/captains_spare"), [rt.getStep(f, live(f.src), 0)]);
	} else if ($0 === 19) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You feel robust.</span>"]);
		(rt.modField(f, (S = rt.gv(f, "species", rt.fv(f, "dna", live(user)))), "brutemod", 0.5, multiply));
		(rt.modField(f, live(S), "burnmod", 0.5, multiply));
		(rt.modField(f, live(S), "coldmod", 0.5, multiply));
	} else if ($0 === 20) {
		yield* g.callName(f, rt.fv(f, "mind", live(user)), "make_Wizard", []);
	}
	return f.dot;
}, true);

rt.type(11279, "/obj/effect/proc_holder/spell/targeted/summonmob", "/obj/effect/proc_holder/spell/targeted", {
	target_mob: null,
	name: "Summon Servant",
	desc: "This spell can be used to call your servant, whenever you need it.",
	charge_max: 100,
	clothes_req: 0,
	invocation: "JE VES",
	invocation_type: "whisper",
	range: -1,
	level_max: 0,
	cooldown_min: 100,
	include_user: 1,
	action_icon_state: "summons",
});

// /obj/effect/proc_holder/spell/targeted/summonmob/proc/cast  (code/modules/awaymissions/mission_code/Academy.dm:285)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/summonmob/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let Start: Value = null, direction: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [targets, user, Start, direction, _T, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.sv(f, "target_mob"))) {
		return live(f.dot);
	}
	Start = rt.getStep(f, live(user), 0);
	direction = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		direction = $e;
		if (!truthy(rt.gv(f, "density", (_T = rt.getStep(f, live(Start), live(direction)))))) {
			yield* g.callName(f, rt.sv(f, "target_mob"), "Move", [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12793, "/obj/structure/ladder/unbreakable/rune", "/obj/structure/ladder/unbreakable", {
	name: "Teleportation Rune",
	desc: "Could lead anywhere.",
	icon: rt.rsc("icons/obj/rune.dmi"),
	icon_state: "1",
	color: "#0000ff",
});

// /obj/structure/ladder/unbreakable/rune/proc/show_fluff_message  (code/modules/awaymissions/mission_code/Academy.dm:304)
rt.def("/obj/structure/ladder/unbreakable/rune/proc/show_fluff_message", function show_fluff_message(f: Frame, up: Value, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ activates ％！.", [live(user), live(f.src)]), fmt("<span class='notice'>You activate ％！.</span>", [live(f.src)])]);
	return f.dot;
});

// /obj/structure/ladder/proc/can_use  (code/modules/awaymissions/mission_code/Academy.dm:307)
rt.def("/obj/structure/ladder/proc/can_use", function can_use(f: Frame, user: Value) {
	if (truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		return 0;
	}
	return 1;
});
