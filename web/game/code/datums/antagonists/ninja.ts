// From code/datums/antagonists/ninja.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(913, "/datum/antagonist/ninja", "/datum/antagonist", {
	team: null,
	helping_station: 0,
	give_objectives: 1,
	name: "Ninja",
});

// /datum/antagonist/ninja/proc/New  (code/datums/antagonists/ninja.dm:14)
rt.def("/datum/antagonist/ninja/proc/New", function New(f: Frame, new_owner: Value) {
	if ((truthy(live(new_owner)) && !truthy((rt.istype(rt.fv(f, "current", live(new_owner)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		rt.throw_(f, rt.new_(f, T("/exception"), ["Only humans and/or humanoids may be ninja'ed", "code/datums/antagonists/ninja.dm", 15]));
	}
	rt.callSuper(f, [live(new_owner)]);
	return f.dot;
});

rt.type(916, "/datum/antagonist/ninja/randomAllegiance", "/datum/antagonist/ninja", {});

// /datum/antagonist/ninja/randomAllegiance/proc/New  (code/datums/antagonists/ninja.dm:19)
rt.def("/datum/antagonist/ninja/randomAllegiance/proc/New", function New(f: Frame, new_owner: Value) {
	rt.callSuper(f, [live(new_owner)]);
	rt.setSv(f, "helping_station", rt.call(f, P("/proc/rand"), null, [0, 1]));
	return f.dot;
});

// /datum/antagonist/ninja/proc/equip_space_ninja  (code/datums/antagonists/ninja.dm:24)  may sleep
rt.def("/datum/antagonist/ninja/proc/equip_space_ninja", function* equip_space_ninja(f: Frame, H: Value, safety: Value) {
	let theSuit: Value = null, EK: Value = null, E: Value = null;
	f.vars = () => [H, safety, theSuit, EK, E];
	if (live(H) === null) {
		H = rt.fv(f, "current", rt.sv(f, "owner"));
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (truthy(live(safety))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "w_uniform", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_suit", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_mask", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "head", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "shoes", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "gloves", live(H))]);
	}
	theSuit = (yield* g.new_(f, T("/obj/item/clothing/suit/space/space_ninja"), [live(H)]));
	EK = (yield* g.new_(f, T("/obj/item/weapon/dash/energy_katana"), [live(H)]));
	rt.setFv(f, "energyKatana", live(theSuit), live(EK));
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(H)])), 7]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/black"), [live(H)])), 14]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/space_ninja"), [live(H)])), 12]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(theSuit), 13]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/space_ninja"), [live(H)])), 9]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/space_ninja"), [live(H)])), 11]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/gas/space_ninja"), [live(H)])), 2]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/glasses/night"), [live(H)])), 8]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(EK), 5]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/flashlight"), [live(H)])), 16]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/grenade/plastic/x4"), [live(H)])), 15]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/tank/internals/emergency_oxygen"), [live(H)])), 17]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/tank/jetpack/carbondioxide"), [live(H)])), 1]);
	yield* g.callName(f, live(theSuit), "randomize_param", []);
	yield* g.callName(f, (E = (yield* g.new_(f, T("/obj/item/weapon/implant/explosive"), [live(H)]))), "implant", [live(H)]);
	return 1;
}, true);

// /datum/antagonist/ninja/proc/addMemories  (code/datums/antagonists/ninja.dm:55)
rt.def("/datum/antagonist/ninja/proc/addMemories", function addMemories(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callName(f, rt.sv(f, "owner"), "store_memory", ["I am an elite mercenary assassin of the mighty Spider Clan. A <font color='red'><B>SPACE NINJA</B></font>!"]);
	rt.callName(f, rt.sv(f, "owner"), "store_memory", ["Surprise is my weapon. Shadows are my armor. Without them, I am nothing. (//initialize your suit by right clicking on it, to use abilities like stealth)!"]);
	$0 = rt.sv(f, "owner");
	if (truthy(rt.sv(f, "helping_station"))) {
		$1 = "Nanotrasen";
	} else {
		$1 = "The Syndicate";
	}
	rt.callName(f, $0, "store_memory", [fmt("Officially, ＀ are my employer.", [$1])]);
	return f.dot;
});

// /datum/antagonist/ninja/proc/addObjectives  (code/datums/antagonists/ninja.dm:60)  may sleep
rt.def("/datum/antagonist/ninja/proc/addObjectives", function* addObjectives(f: Frame, quantity: Value) {
	let possible_targets: Value = null, M: Value = null, objectives: Value = null, O: Value = null, index: Value = null, M_3: Value = null, is_bad_guy: Value = null, O_5: Value = null, selected: Value = null;
	let $0: any, $e: any;
	f.vars = () => [quantity, possible_targets, M, objectives, O, index, M_3, is_bad_guy, O_5, selected, $0, $e];
	if (live(quantity) === null) {
		quantity = 6;
	}
	possible_targets = rt.list();
	M = null;
	rt.forList(f, 0, rt.fv(f, "minds", rt.gl("SSticker")), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.fv(f, "current", live(M))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(M))), 2))) {
			if (truthy((rt.istype(rt.fv(f, "current", live(M)), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (truthy(rt.fv(f, "special_role", live(M)))) {
					rt.setAt(live(possible_targets), live(M), 0);
				} else {
					if (truthy((rt.isIn(f, rt.fv(f, "assigned_role", live(M)), rt.gl("command_positions")) ? 1 : 0))) {
						rt.setAt(live(possible_targets), live(M), 1);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	objectives = rt.list(1, 2, 3, 4);
	while (rt.lt(rt.getLen(f, rt.fv(f, "objectives", rt.sv(f, "owner"))), live(quantity))) {
		$0 = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(objectives)]));
		if ($0 === 1) {
			rt.setFv(f, "owner", (O = (yield* g.new_(f, T("/datum/objective/download"), []))), rt.sv(f, "owner"));
			yield* g.callName(f, live(O), "gen_amount_goal", []);
			rt.modField(f, rt.sv(f, "owner"), "objectives", live(O), add);
		} else if ($0 === 2) {
			rt.setFv(f, "owner", (O = (yield* g.new_(f, T("/datum/objective/steal/special"), []))), rt.sv(f, "owner"));
			rt.modField(f, rt.sv(f, "owner"), "objectives", live(O), add);
		} else if ($0 === 3) {
			if (!truthy(rt.len(f, live(possible_targets)))) {
				continue;
			}
			index = (yield* g.call(f, P("/proc/rand"), null, [1, rt.len(f, live(possible_targets))]));
			M_3 = rt.index(live(possible_targets), live(index));
			is_bad_guy = rt.index(live(possible_targets), live(M_3));
			yield* g.callName(f, live(possible_targets), "Cut", [live(index), add(live(index), 1)]);
			if (truthy(rt.bitXor(live(is_bad_guy), rt.sv(f, "helping_station")))) {
				rt.setFv(f, "owner", (O_5 = (yield* g.new_(f, T("/datum/objective/assassinate"), []))), rt.sv(f, "owner"));
				rt.setFv(f, "target", live(O_5), live(M_3));
				rt.setFv(f, "explanation_text", live(O_5), fmt("Slay ％！, the ＀.", [rt.gv(f, "real_name", rt.fv(f, "current", live(M_3))), rt.fv(f, "assigned_role", live(M_3))]));
				rt.modField(f, rt.sv(f, "owner"), "objectives", live(O_5), add);
			} else {
				rt.setFv(f, "owner", (O_5 = (yield* g.new_(f, T("/datum/objective/protect"), []))), rt.sv(f, "owner"));
				rt.setFv(f, "target", live(O_5), live(M_3));
				rt.setFv(f, "explanation_text", live(O_5), fmt("Protect ％！, the ＀, from harm.", [rt.gv(f, "real_name", rt.fv(f, "current", live(M_3))), rt.fv(f, "assigned_role", live(M_3))]));
				rt.modField(f, rt.sv(f, "owner"), "objectives", live(O_5), add);
			}
		} else if ($0 === 4) {
			if (!truthy(rt.len(f, live(possible_targets)))) {
				continue;
			}
			selected = (yield* g.call(f, P("/proc/rand"), null, [1, rt.len(f, live(possible_targets))]));
			M_3 = rt.index(live(possible_targets), live(selected));
			is_bad_guy = rt.index(live(possible_targets), live(M_3));
			yield* g.callName(f, live(possible_targets), "Cut", [live(selected), add(live(selected), 1)]);
			if (truthy(rt.bitXor(live(is_bad_guy), rt.sv(f, "helping_station")))) {
				rt.setFv(f, "owner", (O_5 = (yield* g.new_(f, T("/datum/objective/debrain"), []))), rt.sv(f, "owner"));
				rt.setFv(f, "target", live(O_5), live(M_3));
				rt.setFv(f, "explanation_text", live(O_5), fmt("Steal the brain of ＀.", [rt.gv(f, "real_name", rt.fv(f, "current", live(M_3)))]));
				rt.modField(f, rt.sv(f, "owner"), "objectives", live(O_5), add);
			} else {
				rt.setFv(f, "owner", (O_5 = (yield* g.new_(f, T("/datum/objective/capture"), []))), rt.sv(f, "owner"));
				yield* g.callName(f, live(O_5), "gen_amount_goal", []);
				rt.modField(f, rt.sv(f, "owner"), "objectives", live(O_5), add);
			}
		} else {
			break;
		}
	}
	rt.setFv(f, "owner", (O = (yield* g.new_(f, T("/datum/objective/survive"), []))), rt.sv(f, "owner"));
	rt.modField(f, rt.sv(f, "owner"), "objectives", live(O), add);
	return f.dot;
}, true);

// /proc/remove_ninja  (code/datums/antagonists/ninja.dm:128)  may sleep
rt.def("/proc/remove_ninja", function* remove_ninja(f: Frame, L: Value) {
	let datum: Value = null;
	f.vars = () => [L, datum];
	if ((!truthy(live(L)) || !truthy(rt.fv(f, "mind", live(L))))) {
		return 0;
	}
	yield* g.callName(f, (datum = (yield* g.callName(f, rt.fv(f, "mind", live(L)), "has_antag_datum", [T("/datum/antagonist/ninja")]))), "on_removal", []);
	return 1;
}, true);

// /proc/add_ninja  (code/datums/antagonists/ninja.dm:135)  may sleep
rt.def("/proc/add_ninja", function* add_ninja(f: Frame, H: Value, type: Value) {
	f.vars = () => [H, type];
	if (live(type) === null) {
		type = T("/datum/antagonist/ninja/randomAllegiance");
	}
	if ((!truthy(live(H)) || !truthy(rt.fv(f, "mind", live(H))))) {
		return 0;
	}
	return (yield* g.callName(f, rt.fv(f, "mind", live(H)), "add_antag_datum", [live(type)]));
}, true);

// /proc/is_ninja  (code/datums/antagonists/ninja.dm:140)
rt.def("/proc/is_ninja", function is_ninja(f: Frame, M: Value) {
	return ((live(M) && rt.fv(f, "mind", live(M))) && rt.callName(f, rt.fv(f, "mind", live(M)), "has_antag_datum", [T("/datum/antagonist/ninja")]));
});

// /datum/antagonist/ninja/proc/greet  (code/datums/antagonists/ninja.dm:144)
rt.def("/datum/antagonist/ninja/proc/greet", function greet(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.op(f, "OutputReference", [rt.R.field("current")], [rt.sv(f, "owner"), rt.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/ninja_greeting.ogg")])], false);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "I am an elite mercenary assassin of the mighty Spider Clan. A <font color='red'><B>SPACE NINJA</B></font>!"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "Surprise is my weapon. Shadows are my armor. Without them, I am nothing. (//initialize your suit by right clicking on it, to use abilities like stealth)!"]);
	$0 = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy(rt.sv(f, "helping_station"))) {
		$0 = $0;
		$1 = "Nanotrasen";
	} else {
		$1 = "The Syndicate";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("Officially, ＀ are my employer.", [$1])]);
	return live(f.dot);
});

// /datum/antagonist/ninja/proc/on_gain  (code/datums/antagonists/ninja.dm:152)  may sleep
rt.def("/datum/antagonist/ninja/proc/on_gain", function* on_gain(f: Frame) {
	if (truthy(rt.sv(f, "give_objectives"))) {
		yield* g.srcCall(f, "addObjectives");
	}
	yield* g.srcCall(f, "addMemories");
	return f.dot;
}, true);
