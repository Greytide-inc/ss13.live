// From code/game/gamemodes/cult/cult.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/iscultist  (code/game/gamemodes/cult/cult.dm:7)
rt.def("/proc/iscultist", function iscultist(f: Frame, M: Value) {
	return (((rt.istype(live(M), T("/mob/living")) ? 1 : 0) && rt.fv(f, "mind", live(M))) && rt.callName(f, rt.fv(f, "mind", live(M)), "has_antag_datum", [T("/datum/antagonist/cult")]));
});

// /proc/is_sacrifice_target  (code/game/gamemodes/cult/cult.dm:10)
rt.def("/proc/is_sacrifice_target", function is_sacrifice_target(f: Frame, mind: Value) {
	if (isEqual(live(mind), rt.gl("sac_mind"))) {
		return 1;
	}
	return 0;
});

// /proc/is_convertable_to_cult  (code/game/gamemodes/cult/cult.dm:15)
rt.def("/proc/is_convertable_to_cult", function is_convertable_to_cult(f: Frame, M: Value) {
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.fv(f, "mind", live(M)))) {
		if ((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.isIn(f, rt.gv(f, "assigned_role", rt.fv(f, "mind", live(M))), rt.list("Captain", "Chaplain")) ? 1 : 0)))) {
			return 0;
		}
		if (truthy(rt.call(f, P("/proc/is_sacrifice_target"), null, [rt.fv(f, "mind", live(M))]))) {
			return 0;
		}
		if ((truthy(rt.gv(f, "enslaved_to", rt.fv(f, "mind", live(M)))) && !truthy(rt.call(f, P("/proc/iscultist"), null, [rt.gv(f, "enslaved_to", rt.fv(f, "mind", live(M)))])))) {
			return 0;
		}
	} else {
		return 0;
	}
	if (((((truthy(rt.callName(f, live(M), "isloyal", [])) || truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/bot")) ? 1 : 0))) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/drone")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)])))) {
		return 0;
	}
	return 1;
});

rt.type(1088, "/datum/game_mode/cult", "/datum/game_mode", {
	finished: 0,
	acolytes_needed: 10,
	acolytes_survived: 0,
	cultists_to_cult: null,
	name: "cult",
	config_tag: "cult",
	antag_flag: "cultist",
	restricted_jobs: null,
	protected_jobs: null,
	required_players: 24,
	required_enemies: 4,
	recommended_enemies: 4,
	announce_span: "cult",
	announce_text: "Some crew members are trying to start a cult to Nar-Sie!\n<span class='cult'>Cultists</span>: Carry out Nar-Sie's will.\n<span class='notice'>Crew</span>: Prevent the cult from expanding and drive it out.",
});

// /datum/game_mode/cult/proc/<init>  (code/game/gamemodes/cult/cult.dm:35)
rt.def("/datum/game_mode/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("Chaplain", "AI", "Cyborg", "Security Officer", "Warden", "Detective", "Head of Security", "Captain", "Head of Personnel"));
	$0 = $0;
	rt.setSv(f, "protected_jobs", rt.list());
	$0 = $0;
	rt.setSv(f, "cultists_to_cult", rt.list());
	return f.dot;
});

// /datum/game_mode/cult/proc/pre_setup  (code/game/gamemodes/cult/cult.dm:55)
rt.def("/datum/game_mode/cult/proc/pre_setup", function pre_setup(f: Frame) {
	let cultists_number: Value = null, cultist: Value = null;
	let $e: any;
	f.vars = () => [cultists_number, cultist, $e];
	rt.modSrcVar(f, "cult_objectives", "sacrifice", add);
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	rt.setSv(f, "recommended_enemies", add(3, rt.call(f, P("/proc/round"), null, [divide(rt.callSrc(f, "num_players", []), 15)])));
	cultists_number = null;
	rt.forRange(f, 0, 1, rt.sv(f, "recommended_enemies"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		cultists_number = $e;
		if (!truthy(rt.len(f, rt.sv(f, "antag_candidates")))) {
			break;
		}
		(rt.modSrcVar(f, "antag_candidates", (cultist = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), subtract));
		rt.modSrcVar(f, "cultists_to_cult", live(cultist), add);
		rt.setFv(f, "special_role", live(cultist), "Cultist");
		rt.setFv(f, "restricted_roles", live(cultist), rt.sv(f, "restricted_jobs"));
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a cultist", [rt.fv(f, "key", live(cultist))])]);
	}
	rt.endFor(f, 0);
	return (rt.ge(rt.len(f, rt.sv(f, "cultists_to_cult")), rt.sv(f, "required_enemies")) ? 1 : 0);
});

// /datum/game_mode/cult/proc/post_setup  (code/game/gamemodes/cult/cult.dm:81)  may sleep
rt.def("/datum/game_mode/cult/proc/post_setup", function* post_setup(f: Frame) {
	let possible_targets: Value = null, player: Value = null, sacjob: Value = null, sacface: Value = null, reshape: Value = null, summon: Value = null, cult_mind: Value = null;
	let $e: any;
	f.vars = () => [possible_targets, player, sacjob, sacface, reshape, summon, cult_mind, $e];
	rt.modSrcVar(f, "modePlayer", rt.sv(f, "cultists_to_cult"), add);
	if (truthy((rt.isIn(f, "sacrifice", rt.sv(f, "cult_objectives")) ? 1 : 0))) {
		if (!truthy(rt.getLen(f, (possible_targets = (yield* g.srcCall(f, "get_unconvertables")))))) {
			yield* g.call(f, P("/proc/message_admins"), null, ["Cult Sacrifice: Could not find unconvertable target, checking for convertable target."]);
			player = null;
			rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
			while (($e = rt.next(f, 0)) !== undefined) {
				player = $e;
				if ((truthy(rt.fv(f, "mind", live(player))) && !truthy((rt.isIn(f, rt.fv(f, "mind", live(player)), rt.sv(f, "cultists_to_cult")) ? 1 : 0)))) {
					possible_targets = rt.modify(live(possible_targets), rt.fv(f, "mind", live(player)), add);
				}
			}
			rt.endFor(f, 0);
		}
		if (rt.gt(rt.len(f, live(possible_targets)), 0)) {
			rt.setGl("sac_mind", rt.op(f, "PickUnweighted", [1], [live(possible_targets)]));
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
		}
	}
	if (!truthy(rt.len(f, rt.gl("summon_spots")))) {
		while (rt.lt(rt.len(f, rt.gl("summon_spots")), 3)) {
			if ((isEqual(rt.gv(f, "z", (summon = rt.op(f, "PickUnweighted", [1], [subtract(rt.gl("sortedAreas"), rt.gl("summon_spots"))]))), 2) && truthy(rt.fv(f, "valid_territory", live(summon))))) {
				rt.modGl("summon_spots", live(summon), add);
			}
		}
	}
	rt.modSrcVar(f, "cult_objectives", "eldergod", add);
	cult_mind = null;
	rt.forList(f, 0, rt.sv(f, "cultists_to_cult"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cult_mind = $e;
		yield* g.srcCall(f, "equip_cultist", rt.fv(f, "current", live(cult_mind)));
		yield* g.srcCall(f, "update_cult_icons_added", live(cult_mind));
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(cult_mind)), "<span class='userdanger'>You are a member of the cult!</span>"]);
		yield* g.callName(f, rt.fv(f, "current", live(cult_mind)), "playsound_local", [null, rt.getStep(f, rt.fv(f, "current", live(cult_mind)), 0), null, rt.rsc("sound/ambience/antag/bloodcult.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
		yield* g.srcCall(f, "add_cultist", live(cult_mind), 0);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/proc/equip_cultist  (code/game/gamemodes/cult/cult.dm:120)  may sleep
rt.def("/datum/game_mode/proc/equip_cultist", function* equip_cultist(f: Frame, mob: Value, tome: Value) {
	f.vars = () => [mob, tome];
	if (live(tome) === null) {
		tome = 0;
	}
	if (!truthy((rt.istype(live(mob), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "mind", live(mob)))) {
		if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(mob))), "Clown")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself."]);
			yield* g.callName(f, rt.fv(f, "dna", live(mob)), "remove_mutation", ["Clumsiness"]);
		}
	}
	if (truthy(live(tome))) {
		f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "cult_give_item", T("/obj/item/weapon/tome"), live(mob))), add);
	} else {
		f.dot = rt.modify(live(f.dot), (yield* g.srcCall(f, "cult_give_item", T("/obj/item/weapon/paper/talisman/supply"), live(mob))), add);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "These will help you start the cult on this station. Use them well, and remember - you are not the only one.</span>"]);
	return f.dot;
}, true);

// /datum/game_mode/proc/cult_give_item  (code/game/gamemodes/cult/cult.dm:134)  may sleep
rt.def("/datum/game_mode/proc/cult_give_item", function* cult_give_item(f: Frame, item_path: Value, mob: Value) {
	let slots: Value = null, _T: Value = null, item_name: Value = null, where: Value = null, B: Value = null;
	f.vars = () => [item_path, mob, slots, _T, item_name, where, B];
	slots = rt.alist(f, ["backpack", 18, "left pocket", 15, "right pocket", 16]);
	_T = (yield* g.new_(f, live(item_path), [live(mob)]));
	item_name = rt.initial(f, live(item_path), "name");
	if (!truthy((where = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(_T), live(slots)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("<span class='userdanger'>Unfortunately, you weren't able to get a ＀. This is very bad and you should adminhelp immediately (press F1).</span>", [live(item_name)])]);
		return 0;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("<span class='danger'>You have a ＀ in your ＀.", [live(item_name), live(where)])]);
		if (isEqual(live(where), "backpack")) {
			yield* g.callName(f, (B = rt.fv(f, "back", live(mob))), "orient2hud", [live(mob)]);
			yield* g.callName(f, live(B), "show_to", [live(mob)]);
		}
		return 1;
	}
	return f.dot;
}, true);

// /datum/game_mode/proc/add_cultist  (code/game/gamemodes/cult/cult.dm:155)  may sleep
rt.def("/datum/game_mode/proc/add_cultist", function* add_cultist(f: Frame, cult_mind: Value, stun: Value) {
	f.vars = () => [cult_mind, stun];
	if (!truthy((rt.istype(live(cult_mind), T("/datum/mind")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((yield* g.callName(f, live(cult_mind), "add_antag_datum", [T("/datum/antagonist/cult")])))) return f.dot;
	if (truthy(live(stun))) {
		yield* g.callName(f, rt.fv(f, "current", live(cult_mind)), "Unconscious", [100]);
	}
	return 1;
}, true);

// /datum/game_mode/proc/remove_cultist  (code/game/gamemodes/cult/cult.dm:163)  may sleep
rt.def("/datum/game_mode/proc/remove_cultist", function* remove_cultist(f: Frame, cult_mind: Value, silent: Value, stun: Value) {
	let cult_datum: Value = null;
	f.vars = () => [cult_mind, silent, stun, cult_datum];
	if (!truthy(rt.fv(f, "current", live(cult_mind)))) return f.dot;
	if (!truthy((cult_datum = (yield* g.callName(f, live(cult_mind), "has_antag_datum", [T("/datum/antagonist/cult")]))))) {
		return 0;
	}
	rt.setFv(f, "silent", live(cult_datum), live(silent));
	yield* g.callName(f, live(cult_datum), "on_removal", []);
	if (truthy(live(stun))) {
		yield* g.callName(f, rt.fv(f, "current", live(cult_mind)), "Unconscious", [100]);
	}
	return 1;
}, true);

// /datum/game_mode/proc/update_cult_icons_added  (code/game/gamemodes/cult/cult.dm:174)
rt.def("/datum/game_mode/proc/update_cult_icons_added", function update_cult_icons_added(f: Frame, cult_mind: Value) {
	let culthud: Value = null;
	f.vars = () => [culthud];
	rt.callName(f, (culthud = rt.index(rt.gl("huds"), 6)), "join_hud", [rt.fv(f, "current", live(cult_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(cult_mind)), "cult"]);
	return f.dot;
});

// /datum/game_mode/proc/update_cult_icons_removed  (code/game/gamemodes/cult/cult.dm:179)
rt.def("/datum/game_mode/proc/update_cult_icons_removed", function update_cult_icons_removed(f: Frame, cult_mind: Value) {
	let culthud: Value = null;
	f.vars = () => [culthud];
	rt.callName(f, (culthud = rt.index(rt.gl("huds"), 6)), "leave_hud", [rt.fv(f, "current", live(cult_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(cult_mind)), null]);
	return f.dot;
});

// /datum/game_mode/cult/proc/get_unconvertables  (code/game/gamemodes/cult/cult.dm:184)
rt.def("/datum/game_mode/cult/proc/get_unconvertables", function get_unconvertables(f: Frame) {
	let ucs: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [ucs, player, $e];
	ucs = rt.list();
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((truthy(rt.fv(f, "mind", live(player))) && !truthy(rt.call(f, P("/proc/is_convertable_to_cult"), null, [live(player)]))) && !truthy((rt.isIn(f, rt.fv(f, "mind", live(player)), rt.sv(f, "cultists_to_cult")) ? 1 : 0)))) {
			ucs = rt.modify(live(ucs), rt.fv(f, "mind", live(player)), add);
		}
	}
	rt.endFor(f, 0);
	return live(ucs);
});

// /datum/game_mode/cult/proc/check_cult_victory  (code/game/gamemodes/cult/cult.dm:192)
rt.def("/datum/game_mode/cult/proc/check_cult_victory", function check_cult_victory(f: Frame) {
	let cult_fail: Value = null;
	f.vars = () => [cult_fail];
	cult_fail = 0;
	if (truthy(rt.callName(f, rt.sv(f, "cult_objectives"), "Find", ["survive"]))) {
		cult_fail = rt.modify(live(cult_fail), rt.callSrc(f, "check_survive", []), add);
	}
	if (truthy(rt.callName(f, rt.sv(f, "cult_objectives"), "Find", ["eldergod"]))) {
		cult_fail = rt.modify(live(cult_fail), rt.sv(f, "eldergod"), add);
	}
	if (truthy(rt.callName(f, rt.sv(f, "cult_objectives"), "Find", ["sacrifice"]))) {
		if ((truthy(rt.gl("sac_mind")) && !truthy(rt.gl("sac_complete")))) {
			cult_fail = rt.inc(live(cult_fail), 1);
		}
	}
	return live(cult_fail);
});

// /datum/game_mode/cult/proc/check_survive  (code/game/gamemodes/cult/cult.dm:204)
rt.def("/datum/game_mode/cult/proc/check_survive", function check_survive(f: Frame) {
	let acolytes_survived: Value = null, cult_mind: Value = null;
	let $e: any;
	f.vars = () => [acolytes_survived, cult_mind, $e];
	acolytes_survived = 0;
	cult_mind = null;
	rt.forList(f, 0, rt.sv(f, "cult"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cult_mind = $e;
		if ((truthy(rt.fv(f, "current", live(cult_mind))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(cult_mind))), 2))) {
			if ((truthy(rt.callName(f, rt.fv(f, "current", live(cult_mind)), "onCentcom", [])) || truthy(rt.callName(f, rt.fv(f, "current", live(cult_mind)), "onSyndieBase", [])))) {
				acolytes_survived = rt.inc(live(acolytes_survived), 1);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(live(acolytes_survived), rt.sv(f, "acolytes_needed"))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /datum/game_mode/cult/proc/declare_completion  (code/game/gamemodes/cult/cult.dm:216)
rt.def("/datum/game_mode/cult/proc/declare_completion", function declare_completion(f: Frame) {
	let text: Value = null, obj_count: Value = null, explanation: Value = null;
	let $0: any;
	f.vars = () => [text, obj_count, explanation, $0];
	if (!truthy(rt.callSrc(f, "check_cult_victory", []))) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - cult win");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='greentext'>The cult has succeeded! Nar-sie has snuffed out another torch in the void!</span>"]);
	} else {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - staff stopped the cult");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='redtext'>The staff managed to stop the cult! Dark words and heresy are no match for Nanotrasen's finest!</span>"]);
	}
	text = "";
	if (truthy(rt.len(f, rt.sv(f, "cult_objectives")))) {
		text = rt.modify(live(text), "<br><b>The cultists' objectives were:</b>", add);
		obj_count = null;
		obj_count = 1;
		while (rt.le(live(obj_count), rt.len(f, rt.sv(f, "cult_objectives")))) {
			explanation = null;
			$0 = rt.index(rt.sv(f, "cult_objectives"), live(obj_count));
			if ($0 === "survive") {
				if (!truthy(rt.callSrc(f, "check_survive", []))) {
					explanation = fmt("Make sure at least ＀ acolytes escape on the shuttle. (＀ escaped) <span class='greenannounce'>Success!</span>", [rt.sv(f, "acolytes_needed"), rt.sv(f, "acolytes_survived")]);
					rt.setFv(f, "news_report", rt.gl("SSticker"), 11);
				} else {
					explanation = fmt("Make sure at least ＀ acolytes escape on the shuttle. (＀ escaped) <span class='boldannounce'>Fail.</span>", [rt.sv(f, "acolytes_needed"), rt.sv(f, "acolytes_survived")]);
					rt.setFv(f, "news_report", rt.gl("SSticker"), 12);
				}
			} else if ($0 === "sacrifice") {
				if (truthy(rt.gl("sac_complete"))) {
					explanation = fmt("Sacrifice ＀, the ＀. <span class='greenannounce'>Success!</span>", [rt.gl("sac_mind"), rt.fv(f, "assigned_role", rt.gl("sac_mind"))]);
				} else {
					explanation = fmt("Sacrifice ＀, the ＀. <span class='boldannounce'>Fail.</span>", [rt.gl("sac_mind"), rt.fv(f, "assigned_role", rt.gl("sac_mind"))]);
				}
			} else if ($0 === "eldergod") {
				if (!truthy(rt.sv(f, "eldergod"))) {
					explanation = fmt("Summon Nar-Sie. The summoning can only be accomplished in ＀.<span class='greenannounce'>Success!</span>", [rt.call(f, P("/proc/english_list"), null, [rt.gl("summon_spots")])]);
					rt.setFv(f, "news_report", rt.gl("SSticker"), 13);
				} else {
					explanation = fmt("Summon Nar-Sie. The summoning can only be accomplished in ＀<span class='boldannounce'>Fail.</span>", [rt.call(f, P("/proc/english_list"), null, [rt.gl("summon_spots")])]);
					rt.setFv(f, "news_report", rt.gl("SSticker"), 12);
				}
			}
			text = rt.modify(live(text), fmt("<br><B>Objective #＀</B>: ＀", [live(obj_count), live(explanation)]), add);
			obj_count = rt.inc(live(obj_count), 1);
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
});

// /datum/game_mode/proc/datum_cult_completion  (code/game/gamemodes/cult/cult.dm:263)
rt.def("/datum/game_mode/proc/datum_cult_completion", function datum_cult_completion(f: Frame) {
	let text: Value = null, cult_fail: Value = null, obj_count: Value = null, explanation: Value = null;
	let $0: any, $e: any;
	f.vars = () => [text, cult_fail, obj_count, explanation, $0, $e];
	text = "";
	cult_fail = 0;
	cult_fail = rt.modify(live(cult_fail), rt.sv(f, "eldergod"), add);
	if (!truthy(rt.gl("sac_complete"))) {
		cult_fail = rt.inc(live(cult_fail), 1);
	}
	if (!truthy(live(cult_fail))) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - cult win");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='greentext'>The cult has succeeded! Nar-sie has snuffed out another torch in the void!</span>"]);
	} else {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - staff stopped the cult");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='redtext'>The staff managed to stop the cult! Dark words and heresy are no match for Nanotrasen's finest!</span>"]);
	}
	if (truthy(rt.len(f, rt.sv(f, "cult_objectives")))) {
		text = rt.modify(live(text), "<br><b>The cultists' objectives were:</b>", add);
		obj_count = null;
		rt.forRange(f, 0, 1, 2, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			obj_count = $e;
			explanation = null;
			$0 = rt.index(rt.sv(f, "cult_objectives"), live(obj_count));
			if ($0 === "sacrifice") {
				if (truthy(rt.gl("sac_mind"))) {
					if (truthy(rt.gl("sac_complete"))) {
						explanation = fmt("Sacrifice ＀, the ＀. <span class='greenannounce'>Success!</span>", [rt.gl("sac_mind"), rt.fv(f, "assigned_role", rt.gl("sac_mind"))]);
					} else {
						explanation = fmt("Sacrifice ＀, the ＀. <span class='boldannounce'>Fail.</span>", [rt.gl("sac_mind"), rt.fv(f, "assigned_role", rt.gl("sac_mind"))]);
					}
				}
			} else if ($0 === "eldergod") {
				if (!truthy(rt.sv(f, "eldergod"))) {
					explanation = "Summon Nar-Sie. <span class='greenannounce'>Success!</span>";
					rt.setFv(f, "news_report", rt.gl("SSticker"), 13);
				} else {
					explanation = "Summon Nar-Sie. <span class='boldannounce'>Fail.</span>";
					rt.setFv(f, "news_report", rt.gl("SSticker"), 12);
				}
			}
			text = rt.modify(live(text), fmt("<br><B>Objective #＀</B>: ＀", [live(obj_count), live(explanation)]), add);
		}
		rt.endFor(f, 0);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	return f.dot;
});
