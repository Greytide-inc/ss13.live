// From code/datums/antagonists/datum_cult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(898, "/datum/antagonist/cult", "/datum/antagonist", {
	communion: null,
	vote: null,
});

// /datum/antagonist/cult/proc/<init>  (code/datums/antagonists/datum_cult.dm:4)  may sleep
rt.def("/datum/antagonist/cult/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "communion", (yield* g.new_(f, T("/datum/action/innate/cult/comm"), [])));
	$0 = $0;
	rt.setSv(f, "vote", (yield* g.new_(f, T("/datum/action/innate/cult/mastervote"), [])));
	return f.dot;
}, true);

// /datum/antagonist/cult/proc/Destroy  (code/datums/antagonists/datum_cult.dm:8)  may sleep
rt.def("/datum/antagonist/cult/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "communion")]);
	rt.setSv(f, "communion", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "vote")]);
	rt.setSv(f, "vote", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/antagonist/cult/proc/add_objectives  (code/datums/antagonists/datum_cult.dm:13)  may sleep
rt.def("/datum/antagonist/cult/proc/add_objectives", function* add_objectives(f: Frame) {
	let target_candidates: Value = null, player: Value = null, sacjob: Value = null, sacface: Value = null, reshape: Value = null, summon: Value = null;
	let $e: any;
	f.vars = () => [target_candidates, player, sacjob, sacface, reshape, summon, $e];
	target_candidates = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((((truthy(rt.fv(f, "mind", live(player))) && !truthy((yield* g.callName(f, rt.fv(f, "mind", live(player)), "has_antag_datum", [T("/datum/antagonist/cult")])))) && !truthy((yield* g.call(f, P("/proc/is_convertable_to_cult"), null, [live(player)])))) && !isEqual(live(player), rt.sv(f, "owner"))) && !isEqual(rt.fv(f, "stat", live(player)), 2))) {
			target_candidates = rt.modify(live(target_candidates), rt.fv(f, "mind", live(player)), add);
		}
	}
	rt.endFor(f, 0);
	if (isEqual(rt.len(f, live(target_candidates)), 0)) {
		yield* g.call(f, P("/proc/message_admins"), null, ["Cult Sacrifice: Could not find unconvertable target, checking for convertable target."]);
		player = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			player = $e;
			if ((((truthy(rt.fv(f, "mind", live(player))) && !truthy((yield* g.callName(f, rt.fv(f, "mind", live(player)), "has_antag_datum", [T("/datum/antagonist/cult")])))) && !isEqual(live(player), rt.sv(f, "owner"))) && !isEqual(rt.fv(f, "stat", live(player)), 2))) {
				target_candidates = rt.modify(live(target_candidates), rt.fv(f, "mind", live(player)), add);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/listclearnulls"), null, [live(target_candidates)]);
	if (truthy(rt.length(live(target_candidates)))) {
		rt.setGl("sac_mind", rt.op(f, "PickUnweighted", [1], [live(target_candidates)]));
		if (!truthy(rt.gl("sac_mind"))) {
			yield* g.call(f, P("/proc/message_admins"), null, ["Cult Sacrifice: ERROR -  Null target chosen!"]);
		} else {
			sacjob = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [rt.fv(f, "assigned_role", rt.gl("sac_mind"))]));
			sacface = rt.gv(f, "prefs", rt.gv(f, "client", rt.fv(f, "current", rt.gl("sac_mind"))));
			yield* g.callName(f, (reshape = (yield* g.call(f, P("/proc/get_flat_human_icon"), null, [null, live(sacjob), live(sacface)]))), "Shift", [2, 4]);
			yield* g.callName(f, live(reshape), "Shift", [4, 1]);
			yield* g.callName(f, live(reshape), "Crop", [7, 4, 26, 31]);
			yield* g.callName(f, live(reshape), "Crop", [-5, -3, 26, 30]);
			rt.setGl("sac_image", live(reshape));
		}
	} else {
		yield* g.call(f, P("/proc/message_admins"), null, ["Cult Sacrifice: Could not find unconvertable or convertable target. WELP!"]);
		rt.setGl("sac_complete", 1);
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "cult_objectives", "sacrifice", add);
	if (!truthy(rt.len(f, rt.gl("summon_spots")))) {
		while (rt.lt(rt.len(f, rt.gl("summon_spots")), 3)) {
			if (((truthy((summon = rt.op(f, "PickUnweighted", [1], [subtract(rt.gl("sortedAreas"), rt.gl("summon_spots"))]))) && isEqual(rt.fv(f, "z", live(summon)), 2)) && truthy(rt.fv(f, "valid_territory", live(summon))))) {
				rt.modGl("summon_spots", live(summon), add);
			}
		}
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "cult_objectives", "eldergod", add);
	return f.dot;
}, true);

// /datum/antagonist/cult/proc/cult_memorization  (code/datums/antagonists/datum_cult.dm:49)
rt.def("/datum/antagonist/cult/proc/cult_memorization", function cult_memorization(f: Frame, cult_mind: Value) {
	let current: Value = null, obj_count: Value = null, explanation: Value = null;
	let $0: any;
	f.vars = () => [current, obj_count, explanation, $0];
	current = rt.fv(f, "current", live(cult_mind));
	obj_count = null;
	obj_count = 1;
	while (rt.le(live(obj_count), rt.getLen(f, rt.gv(f, "cult_objectives", rt.fv(f, "mode", rt.gl("SSticker")))))) {
		explanation = null;
		$0 = rt.index(rt.gv(f, "cult_objectives", rt.fv(f, "mode", rt.gl("SSticker"))), live(obj_count));
		if ($0 === "sacrifice") {
			if (truthy(rt.gl("sac_mind"))) {
				explanation = fmt("Sacrifice ＀, the ＀ via invoking a Sacrifice rune with them on it and three acolytes around it.", [rt.gl("sac_mind"), rt.fv(f, "assigned_role", rt.gl("sac_mind"))]);
			} else {
				explanation = "The veil has already been weakened here, proceed to the final objective.";
				rt.setGl("sac_complete", 1);
			}
		} else if ($0 === "eldergod") {
			explanation = fmt("Summon Nar-Sie by invoking the rune 'Summon Nar-Sie'. <b>The summoning can only be accomplished in ＀ - where the veil is weak enough for the ritual to begin.</b>", [rt.call(f, P("/proc/english_list"), null, [rt.gl("summon_spots")])]);
		}
		if (!truthy(rt.sv(f, "silent"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(current), fmt("<B>Objective #＀</B>: ＀", [live(obj_count), live(explanation)])]);
		}
		rt.modField(f, live(cult_mind), "memory", fmt("<B>Objective #＀</B>: ＀<BR>", [live(obj_count), live(explanation)]), add);
		obj_count = rt.inc(live(obj_count), 1);
	}
	return f.dot;
});

// /datum/antagonist/cult/proc/can_be_owned  (code/datums/antagonists/datum_cult.dm:65)
rt.def("/datum/antagonist/cult/proc/can_be_owned", function can_be_owned(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	f.dot = rt.call(f, P("/proc/is_convertable_to_cult"), null, [rt.fv(f, "current", live(f.args[0]))]);
	return f.dot;
}, false, { args: ["new_owner"] });

// /datum/antagonist/cult/proc/on_gain  (code/datums/antagonists/datum_cult.dm:70)  may sleep
rt.def("/datum/antagonist/cult/proc/on_gain", function* on_gain(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (!truthy(rt.length(rt.gv(f, "cult_objectives", rt.fv(f, "mode", rt.gl("SSticker")))))) {
		yield* g.srcCall(f, "add_objectives");
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "cult", rt.sv(f, "owner"), add);
	yield* g.srcCall(f, "cult_memorization", rt.sv(f, "owner"));
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(current), "cultist"])))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "mode", rt.gl("SSticker")), P("/datum/game_mode/proc/replace_jobbaned_player"), live(current), "cultist", "cultist"])), 0]);
	}
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_cult_icons_added", [rt.sv(f, "owner")]);
	yield* g.callName(f, live(current), "log_message", ["<font color=#960000>Has been converted to the cult of Nar'Sie!</font>", "Attack log"]);
	if (!((truthy(rt.gl("blood_target")) && truthy(rt.gl("blood_target_image"))) && truthy(rt.fv(f, "client", live(current))))) return f.dot;
	rt.modField(f, rt.fv(f, "client", live(current)), "images", rt.gl("blood_target_image"), add);
	return f.dot;
}, true);

// /datum/antagonist/cult/proc/apply_innate_effects  (code/datums/antagonists/datum_cult.dm:84)  may sleep
rt.def("/datum/antagonist/cult/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy(live(f.args[0]))) {
		current = live(f.args[0]);
	}
	(rt.modField(f, live(current), "faction", "cult", rt.bitOr));
	yield* g.callName(f, live(current), "grant_language", [T("/datum/language/narsie")]);
	rt.modField(f, live(current), "verbs", P("/mob/living/proc/cult_help"), add);
	if (!truthy(rt.gl("cult_mastered"))) {
		yield* g.callName(f, rt.sv(f, "vote"), "Grant", [live(current)]);
	}
	yield* g.callName(f, rt.sv(f, "communion"), "Grant", [live(current)]);
	yield* g.callName(f, live(current), "throw_alert", ["bloodsense", T("/obj/screen/alert/bloodsense")]);
	return f.dot;
}, true, { args: ["mob_override"] });

// /datum/antagonist/cult/proc/remove_innate_effects  (code/datums/antagonists/datum_cult.dm:97)  may sleep
rt.def("/datum/antagonist/cult/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy(live(f.args[0]))) {
		current = live(f.args[0]);
	}
	(rt.modField(f, live(current), "faction", "cult", subtract));
	yield* g.callName(f, live(current), "remove_language", [T("/datum/language/narsie")]);
	(rt.modField(f, live(current), "verbs", P("/mob/living/proc/cult_help"), subtract));
	yield* g.callName(f, rt.sv(f, "vote"), "Remove", [live(current)]);
	yield* g.callName(f, rt.sv(f, "communion"), "Remove", [live(current)]);
	yield* g.callName(f, live(current), "clear_alert", ["bloodsense"]);
	return f.dot;
}, true, { args: ["mob_override"] });

// /datum/antagonist/cult/proc/on_removal  (code/datums/antagonists/datum_cult.dm:109)  may sleep
rt.def("/datum/antagonist/cult/proc/on_removal", function* on_removal(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "wipe_memory", []);
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "cult", rt.sv(f, "owner"), subtract));
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_cult_icons_removed", [rt.sv(f, "owner")]);
	if (!truthy(rt.sv(f, "silent"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>An unfamiliar white light flashes through your mind, cleansing the taint of the Geometer and all your memories as her servant.</span>"]);
		yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "log_message", ["<font color=#960000>Has renounced the cult of Nar'Sie!</font>", "Attack log"]);
		yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "visible_message", [fmt("<span class='big'>＀ looks like ＀ just reverted to their old faith!</span>", [rt.fv(f, "current", rt.sv(f, "owner")), (yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "p_they", []))])]);
	}
	if (((truthy(rt.gl("blood_target")) && truthy(rt.gl("blood_target_image"))) && truthy(rt.gv(f, "client", rt.fv(f, "current", rt.sv(f, "owner")))))) {
		(rt.modField(f, rt.gv(f, "client", rt.fv(f, "current", rt.sv(f, "owner"))), "images", rt.gl("blood_target_image"), subtract));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(899, "/datum/antagonist/cult/master", "/datum/antagonist/cult", {
	reckoning: null,
	bloodmark: null,
	throwing: null,
});

// /datum/antagonist/cult/master/proc/<init>  (code/datums/antagonists/datum_cult.dm:121)  may sleep
rt.def("/datum/antagonist/cult/master/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "reckoning", (yield* g.new_(f, T("/datum/action/innate/cult/master/finalreck"), [])));
	$0 = $0;
	rt.setSv(f, "bloodmark", (yield* g.new_(f, T("/datum/action/innate/cult/master/cultmark"), [])));
	$0 = $0;
	rt.setSv(f, "throwing", (yield* g.new_(f, T("/datum/action/innate/cult/master/pulse"), [])));
	return f.dot;
}, true);

// /datum/antagonist/cult/master/proc/Destroy  (code/datums/antagonists/datum_cult.dm:126)  may sleep
rt.def("/datum/antagonist/cult/master/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "reckoning")]);
	rt.setSv(f, "reckoning", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bloodmark")]);
	rt.setSv(f, "bloodmark", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "throwing")]);
	rt.setSv(f, "throwing", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/antagonist/cult/master/proc/on_gain  (code/datums/antagonists/datum_cult.dm:132)  may sleep
rt.def("/datum/antagonist/cult/master/proc/on_gain", function* on_gain(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "set_antag_hud", [live(current), "cultmaster"]);
	return f.dot;
}, true);

// /datum/antagonist/cult/master/proc/greet  (code/datums/antagonists/datum_cult.dm:137)
rt.def("/datum/antagonist/cult/master/proc/greet", function greet(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='cultlarge'>You are the cult's Master</span>. As the cult's Master, you have a unique title and loud voice when communicating, are capable of marking targets, such as a location or a noncultist, to direct the cult to them, and, finally, you are capable of summoning the entire living cult to your location <b><i>once</i></b>."]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "Use these abilities to direct the cult to victory at any cost."]);
	return f.dot;
});

// /datum/antagonist/cult/master/proc/apply_innate_effects  (code/datums/antagonists/datum_cult.dm:142)  may sleep
rt.def("/datum/antagonist/cult/master/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy(live(f.args[0]))) {
		current = live(f.args[0]);
	}
	if (!truthy(rt.gl("reckoning_complete"))) {
		yield* g.callName(f, rt.sv(f, "reckoning"), "Grant", [live(current)]);
	}
	yield* g.callName(f, rt.sv(f, "bloodmark"), "Grant", [live(current)]);
	yield* g.callName(f, rt.sv(f, "throwing"), "Grant", [live(current)]);
	yield* g.callName(f, live(current), "update_action_buttons_icon", []);
	yield* g.callName(f, live(current), "apply_status_effect", [T("/datum/status_effect/cult_master")]);
	return f.dot;
}, true, { args: ["mob_override"] });

// /datum/antagonist/cult/master/proc/remove_innate_effects  (code/datums/antagonists/datum_cult.dm:154)  may sleep
rt.def("/datum/antagonist/cult/master/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	let current: Value = null;
	f.vars = () => [current];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	current = rt.fv(f, "current", rt.sv(f, "owner"));
	if (truthy(live(f.args[0]))) {
		current = live(f.args[0]);
	}
	yield* g.callName(f, rt.sv(f, "reckoning"), "Remove", [live(current)]);
	yield* g.callName(f, rt.sv(f, "bloodmark"), "Remove", [live(current)]);
	yield* g.callName(f, rt.sv(f, "throwing"), "Remove", [live(current)]);
	yield* g.callName(f, live(current), "update_action_buttons_icon", []);
	yield* g.callName(f, live(current), "remove_status_effect", [T("/datum/status_effect/cult_master")]);
	return f.dot;
}, true, { args: ["mob_override"] });
