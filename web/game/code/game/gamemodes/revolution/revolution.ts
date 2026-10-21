// From code/game/gamemodes/revolution/revolution.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1098, "/datum/game_mode/revolution", "/datum/game_mode", {
	finished: 0,
	check_counter: 0,
	max_headrevs: 3,
	heads_to_kill: null,
	name: "revolution",
	config_tag: "revolution",
	antag_flag: "revolutionary",
	restricted_jobs: null,
	required_players: 20,
	required_enemies: 1,
	recommended_enemies: 3,
	announce_span: "danger",
	announce_text: "Some crewmembers are attempting a coup!\n<span class='danger'>Revolutionaries</span>: Expand your cause and overthrow the heads of staff by execution or otherwise.\n<span class='notice'>Crew</span>: Prevent the revolutionaries from taking over the station.",
});

// /datum/game_mode/revolution/proc/<init>  (code/game/gamemodes/revolution/revolution.dm:31)
rt.def("/datum/game_mode/revolution/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_jobs", rt.list("Security Officer", "Warden", "Detective", "AI", "Cyborg", "Captain", "Head of Personnel", "Head of Security", "Chief Engineer", "Research Director", "Chief Medical Officer"));
	$0 = $0;
	rt.setSv(f, "heads_to_kill", rt.list());
	return f.dot;
});

// /datum/game_mode/revolution/proc/announce  (code/game/gamemodes/revolution/revolution.dm:37)
rt.def("/datum/game_mode/revolution/proc/announce", function announce(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The current game mode is - Revolution!</B>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>Some crewmembers are attempting to start a revolution!<BR>\nRevolutionaries - Kill the Captain, HoP, HoS, CE, RD and CMO. Convert other crewmembers (excluding the heads of staff, and security officers) to your cause by flashing them. Protect your leaders.<BR>\nPersonnel - Protect the heads of staff. Kill the leaders of the revolution, and brainwash the other revolutionaries (by beating them in the head).</B>"]);
	return f.dot;
});

// /datum/game_mode/revolution/proc/pre_setup  (code/game/gamemodes/revolution/revolution.dm:46)
rt.def("/datum/game_mode/revolution/proc/pre_setup", function pre_setup(f: Frame) {
	let i: Value = null, lenin: Value = null;
	let $e: any;
	f.vars = () => [i, lenin, $e];
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", rt.sv(f, "protected_jobs"), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modSrcVar(f, "restricted_jobs", "Assistant", add);
	}
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "max_headrevs"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.len(f, rt.sv(f, "antag_candidates")), 0)) {
			break;
		}
		(rt.modSrcVar(f, "antag_candidates", (lenin = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), subtract));
		rt.modSrcVar(f, "head_revolutionaries", live(lenin), add);
		rt.setFv(f, "restricted_roles", live(lenin), rt.sv(f, "restricted_jobs"));
	}
	rt.endFor(f, 0);
	if (rt.lt(rt.len(f, rt.sv(f, "head_revolutionaries")), rt.sv(f, "required_enemies"))) {
		return 0;
	}
	return 1;
});

// /datum/game_mode/revolution/proc/post_setup  (code/game/gamemodes/revolution/revolution.dm:67)  may sleep
rt.def("/datum/game_mode/revolution/proc/post_setup", function* post_setup(f: Frame) {
	let heads: Value = null, sec: Value = null, weighted_score: Value = null, rev_mind: Value = null, newcandidates: Value = null, M: Value = null, lenin: Value = null, Nm: Value = null, trotsky: Value = null, head_mind: Value = null;
	let $e: any;
	f.vars = () => [heads, sec, weighted_score, rev_mind, newcandidates, M, lenin, Nm, trotsky, head_mind, $e];
	heads = (yield* g.srcCall(f, "get_living_heads"));
	sec = (yield* g.srcCall(f, "get_living_sec"));
	weighted_score = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [subtract(rt.len(f, live(heads)), divide(subtract(8, rt.len(f, live(sec))), 3))])), 1])), rt.sv(f, "max_headrevs")]));
	rev_mind = null;
	rt.forList(f, 0, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rev_mind = $e;
		if (truthy((rt.istype(rt.fv(f, "current", live(rev_mind)), T("/mob/dead/new_player")) ? 1 : 0))) {
			(rt.modSrcVar(f, "head_revolutionaries", live(rev_mind), subtract));
			if (isEqual(rt.getLen(f, (newcandidates = (yield* g.call(f, P("/proc/shuffle"), null, [rt.sv(f, "antag_candidates")])))), 0)) {
				continue;
			}
			M = null;
			rt.forList(f, 1, live(newcandidates));
			while (($e = rt.next(f, 1)) !== undefined) {
				M = $e;
				(rt.modSrcVar(f, "antag_candidates", (lenin = live(M)), subtract));
				(newcandidates = rt.modify(live(newcandidates), live(lenin), subtract));
				if (truthy((rt.istype(rt.fv(f, "current", live(lenin)), T("/mob/dead/new_player")) ? 1 : 0))) {
					continue;
				}
				if (truthy((rt.isIn(f, rt.gv(f, "job", (Nm = rt.fv(f, "current", live(lenin)))), rt.sv(f, "restricted_jobs")) ? 1 : 0))) {
					rt.modSrcVar(f, "antag_candidates", live(lenin), add);
					continue;
				}
				rt.modSrcVar(f, "head_revolutionaries", live(lenin), add);
				break;
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	while (rt.lt(live(weighted_score), rt.len(f, rt.sv(f, "head_revolutionaries")))) {
		rt.modSrcVar(f, "antag_candidates", (trotsky = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "head_revolutionaries")])), add);
		(rt.modSrcVar(f, "head_revolutionaries", live(trotsky), subtract));
		yield* g.srcCall(f, "update_rev_icons_removed", live(trotsky));
	}
	rev_mind = null;
	rt.forList(f, 0, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rev_mind = $e;
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a head rev", [rt.fv(f, "key", live(rev_mind))])]);
		head_mind = null;
		rt.forList(f, 1, live(heads), T("/datum/mind"));
		while (($e = rt.next(f, 1)) !== undefined) {
			head_mind = $e;
			yield* g.srcCall(f, "mark_for_death", live(rev_mind), live(head_mind));
		}
		rt.endFor(f, 1);
		rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [10, 100])), "/datum/game_mode/revolution/proc/post_setup: spawn at game/gamemodes/revolution/revolution.dm:102", heads, sec, weighted_score, rev_mind, newcandidates, M, lenin, Nm, trotsky, head_mind);
	}
	rt.endFor(f, 0);
	rev_mind = null;
	rt.forList(f, 0, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rev_mind = $e;
		yield* g.srcCall(f, "greet_revolutionary", live(rev_mind));
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "modePlayer", rt.sv(f, "head_revolutionaries"), add);
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 100]))) body of /datum/game_mode/revolution/proc/post_setup, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/revolution/proc/post_setup: spawn at game/gamemodes/revolution/revolution.dm:102", function* (f: Frame, heads: Value, sec: Value, weighted_score: Value, rev_mind: Value, newcandidates: Value, M: Value, lenin: Value, Nm: Value, trotsky: Value, head_mind: Value) {
	f.vars = () => [heads, sec, weighted_score, rev_mind, newcandidates, M, lenin, Nm, trotsky, head_mind];
	yield* g.srcCall(f, "equip_revolutionary", rt.fv(f, "current", live(rev_mind)));
	return null;
});

// /datum/game_mode/revolution/proc/process  (code/game/gamemodes/revolution/revolution.dm:117)  may sleep
rt.def("/datum/game_mode/revolution/proc/process", function* process(f: Frame) {
	rt.incSrcVar(f, "check_counter", 1, true);
	if (rt.ge(rt.sv(f, "check_counter"), 5)) {
		if (!truthy(rt.sv(f, "finished"))) {
			yield* g.srcCall(f, "check_heads");
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "check_win", []);
		}
		rt.setSv(f, "check_counter", 0);
	}
	return 0;
}, true, { waitfor: false });

// /datum/game_mode/proc/forge_revolutionary_objectives  (code/game/gamemodes/revolution/revolution.dm:127)
rt.def("/datum/game_mode/proc/forge_revolutionary_objectives", function forge_revolutionary_objectives(f: Frame, rev_mind: Value) {
	let heads: Value = null, head_mind: Value = null, rev_obj: Value = null;
	let $e: any;
	f.vars = () => [heads, head_mind, rev_obj, $e];
	heads = rt.callSrc(f, "get_living_heads", []);
	head_mind = null;
	rt.forList(f, 0, live(heads), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		head_mind = $e;
		rt.setFv(f, "owner", (rev_obj = rt.new_(f, T("/datum/objective/mutiny"), [])), live(rev_mind));
		rt.setFv(f, "target", live(rev_obj), live(head_mind));
		rt.setFv(f, "explanation_text", live(rev_obj), fmt("Assassinate or exile ＀, the ＀.", [rt.fv(f, "name", live(head_mind)), rt.fv(f, "assigned_role", live(head_mind))]));
		rt.modField(f, live(rev_mind), "objectives", live(rev_obj), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/proc/greet_revolutionary  (code/game/gamemodes/revolution/revolution.dm:136)
rt.def("/datum/game_mode/proc/greet_revolutionary", function greet_revolutionary(f: Frame, rev_mind: Value, you_are: Value) {
	f.vars = () => [you_are];
	if (live(you_are) === null) {
		you_are = 1;
	}
	rt.callSrc(f, "update_rev_icons_added", [live(rev_mind)]);
	if (truthy(live(you_are))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(rev_mind)), "<span class='userdanger'>You are a member of the revolutionaries' leadership!</span>"]);
	}
	rt.setFv(f, "special_role", live(rev_mind), "Head Revolutionary");
	rt.callName(f, live(rev_mind), "announce_objectives", []);
	return f.dot;
});

// /datum/game_mode/proc/equip_revolutionary  (code/game/gamemodes/revolution/revolution.dm:146)  may sleep
rt.def("/datum/game_mode/proc/equip_revolutionary", function* equip_revolutionary(f: Frame, mob: Value) {
	let _T: Value = null, R: Value = null, C: Value = null, slots: Value = null, where: Value = null, where2: Value = null;
	f.vars = () => [mob, _T, R, C, slots, where, where2];
	if (!truthy((rt.istype(live(mob), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "mind", live(mob)))) {
		if (isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(mob))), "Clown")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself."]);
			yield* g.callName(f, rt.fv(f, "dna", live(mob)), "remove_mutation", ["Clumsiness"]);
		}
	}
	_T = (yield* g.new_(f, T("/obj/item/device/assembly/flash"), [live(mob)]));
	R = (yield* g.new_(f, T("/obj/item/toy/crayon/spraycan"), [live(mob)]));
	C = (yield* g.new_(f, T("/obj/item/clothing/glasses/hud/security/chameleon"), [live(mob)]));
	slots = rt.alist(f, ["backpack", 18, "left pocket", 15, "right pocket", 16]);
	where = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(_T), live(slots)]));
	where2 = (yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(C), live(slots)]));
	yield* g.callName(f, live(mob), "equip_in_one_of_slots", [live(R), live(slots)]);
	if (!truthy(live(where2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "The Syndicate were unfortunately unable to get you a chameleon security HUD."]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("The chameleon security HUD in your ＀ will help you keep track of who is mindshield-implanted, and unable to be recruited.", [live(where2)])]);
	}
	if (!truthy(live(where))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), "The Syndicate were unfortunately unable to get you a flash."]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mob), fmt("The flash in your ＀ will help you to persuade the crew to join your cause.", [live(where)])]);
		return 1;
	}
	return f.dot;
}, true);

// /datum/game_mode/revolution/proc/mark_for_death  (code/game/gamemodes/revolution/revolution.dm:183)
rt.def("/datum/game_mode/revolution/proc/mark_for_death", function mark_for_death(f: Frame, rev_mind: Value, head_mind: Value) {
	let rev_obj: Value = null;
	f.vars = () => [rev_obj];
	rt.setFv(f, "owner", (rev_obj = rt.new_(f, T("/datum/objective/mutiny"), [])), live(rev_mind));
	rt.setFv(f, "target", live(rev_obj), live(head_mind));
	rt.setFv(f, "explanation_text", live(rev_obj), fmt("Assassinate ＀, the ＀.", [rt.fv(f, "name", live(head_mind)), rt.fv(f, "assigned_role", live(head_mind))]));
	rt.modField(f, live(rev_mind), "objectives", live(rev_obj), add);
	rt.modSrcVar(f, "heads_to_kill", live(head_mind), add);
	return f.dot;
});

// /datum/game_mode/revolution/proc/check_heads  (code/game/gamemodes/revolution/revolution.dm:194)  may sleep
rt.def("/datum/game_mode/revolution/proc/check_heads", function* check_heads(f: Frame) {
	let heads: Value = null, sec: Value = null, new_heads: Value = null, head_mind: Value = null, rev_mind: Value = null;
	let $e: any;
	f.vars = () => [heads, sec, new_heads, head_mind, rev_mind, $e];
	heads = (yield* g.srcCall(f, "get_all_heads"));
	sec = (yield* g.srcCall(f, "get_all_sec"));
	if (rt.lt(rt.len(f, rt.sv(f, "heads_to_kill")), rt.len(f, live(heads)))) {
		new_heads = subtract(live(heads), rt.sv(f, "heads_to_kill"));
		head_mind = null;
		rt.forList(f, 0, live(new_heads), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			head_mind = $e;
			rev_mind = null;
			rt.forList(f, 1, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
			while (($e = rt.next(f, 1)) !== undefined) {
				rev_mind = $e;
				yield* g.srcCall(f, "mark_for_death", live(rev_mind), live(head_mind));
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	if (!(rt.lt(rt.len(f, rt.sv(f, "head_revolutionaries")), rt.sv(f, "max_headrevs")) && rt.lt(rt.len(f, rt.sv(f, "head_revolutionaries")), (yield* g.call(f, P("/proc/round"), null, [subtract(rt.len(f, live(heads)), divide(subtract(8, rt.len(f, live(sec))), 3))]))))) return f.dot;
	yield* g.srcCall(f, "latejoin_headrev");
	return f.dot;
}, true);

// /datum/game_mode/revolution/proc/latejoin_headrev  (code/game/gamemodes/revolution/revolution.dm:210)  may sleep
rt.def("/datum/game_mode/revolution/proc/latejoin_headrev", function* latejoin_headrev(f: Frame) {
	let promotable_revs: Value = null, khrushchev: Value = null, stalin: Value = null;
	let $e: any;
	f.vars = () => [promotable_revs, khrushchev, stalin, $e];
	if (!truthy(rt.sv(f, "revolutionaries"))) return f.dot;
	promotable_revs = rt.list();
	khrushchev = null;
	rt.forList(f, 0, rt.sv(f, "revolutionaries"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		khrushchev = $e;
		if (((((truthy(rt.fv(f, "current", live(khrushchev))) && !truthy((yield* g.callName(f, rt.fv(f, "current", live(khrushchev)), "incapacitated", [])))) && !truthy((yield* g.callName(f, rt.fv(f, "current", live(khrushchev)), "restrained", [])))) && truthy(rt.gv(f, "client", rt.fv(f, "current", live(khrushchev))))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(khrushchev))), 2))) {
			if (truthy((rt.isIn(f, "revolutionary", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.gv(f, "client", rt.fv(f, "current", live(khrushchev)))))) ? 1 : 0))) {
				promotable_revs = rt.modify(live(promotable_revs), live(khrushchev), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(promotable_revs)))) return f.dot;
	(rt.modSrcVar(f, "revolutionaries", (stalin = rt.op(f, "PickUnweighted", [1], [live(promotable_revs)])), subtract));
	rt.modSrcVar(f, "head_revolutionaries", live(stalin), add);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been promoted to a head rev", [rt.fv(f, "key", live(stalin))])]);
	yield* g.srcCall(f, "equip_revolutionary", rt.fv(f, "current", live(stalin)));
	yield* g.srcCall(f, "forge_revolutionary_objectives", live(stalin));
	yield* g.srcCall(f, "greet_revolutionary", live(stalin));
	return f.dot;
}, true);

// /datum/game_mode/revolution/proc/check_win  (code/game/gamemodes/revolution/revolution.dm:228)
rt.def("/datum/game_mode/revolution/proc/check_win", function check_win(f: Frame) {
	if (truthy(rt.callSrc(f, "check_rev_victory", []))) {
		rt.setSv(f, "finished", 1);
	} else {
		if (truthy(rt.callSrc(f, "check_heads_victory", []))) {
			rt.setSv(f, "finished", 2);
		}
	}
	return live(f.dot);
});

// /datum/game_mode/revolution/proc/check_finished  (code/game/gamemodes/revolution/revolution.dm:238)  may sleep
rt.def("/datum/game_mode/revolution/proc/check_finished", function* check_finished(f: Frame) {
	if (truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), "revolution"))) {
		if (truthy(rt.sv(f, "finished"))) {
			yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
		}
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!isEqual(rt.sv(f, "finished"), 0)) {
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true);

// /proc/is_revolutionary  (code/game/gamemodes/revolution/revolution.dm:251)
rt.def("/proc/is_revolutionary", function is_revolutionary(f: Frame, M: Value) {
	return (rt.isIn(f, (((((live(M) && (rt.istype(live(M), T("/mob")) ? 1 : 0)) && rt.fv(f, "mind", live(M))) && rt.gl("SSticker")) && rt.fv(f, "mode", rt.gl("SSticker"))) && rt.fv(f, "mind", live(M))), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0);
});

// /proc/is_head_revolutionary  (code/game/gamemodes/revolution/revolution.dm:254)
rt.def("/proc/is_head_revolutionary", function is_head_revolutionary(f: Frame, M: Value) {
	return (rt.isIn(f, (((((live(M) && (rt.istype(live(M), T("/mob")) ? 1 : 0)) && rt.fv(f, "mind", live(M))) && rt.gl("SSticker")) && rt.fv(f, "mode", rt.gl("SSticker"))) && rt.fv(f, "mind", live(M))), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0);
});

// /proc/is_revolutionary_in_general  (code/game/gamemodes/revolution/revolution.dm:257)
rt.def("/proc/is_revolutionary_in_general", function is_revolutionary_in_general(f: Frame, M: Value) {
	return (rt.call(f, P("/proc/is_revolutionary"), null, [live(M)]) || rt.call(f, P("/proc/is_head_revolutionary"), null, [live(M)]));
});

// /datum/game_mode/proc/add_revolutionary  (code/game/gamemodes/revolution/revolution.dm:260)  may sleep
rt.def("/datum/game_mode/proc/add_revolutionary", function* add_revolutionary(f: Frame, rev_mind: Value) {
	let H: Value = null, carbon_mob: Value = null;
	f.vars = () => [rev_mind, H, carbon_mob];
	if (truthy((rt.isIn(f, rt.fv(f, "assigned_role", live(rev_mind)), rt.gl("command_positions")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, (H = rt.fv(f, "current", live(rev_mind))), "isloyal", [])))) {
		return 0;
	}
	if ((truthy((rt.isIn(f, live(rev_mind), rt.sv(f, "revolutionaries")) ? 1 : 0)) || truthy((rt.isIn(f, live(rev_mind), rt.sv(f, "head_revolutionaries")) ? 1 : 0)))) {
		return 0;
	}
	rt.modSrcVar(f, "revolutionaries", live(rev_mind), add);
	if (truthy((rt.istype(rt.fv(f, "current", live(rev_mind)), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "silent", (carbon_mob = rt.fv(f, "current", live(rev_mind))), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "silent", live(carbon_mob)), 5])));
		yield* g.callName(f, live(carbon_mob), "flash_act", [1, 1]);
	}
	yield* g.callName(f, rt.fv(f, "current", live(rev_mind)), "Stun", [100]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(rev_mind)), "<span class='danger'><FONT size = 3> You are now a revolutionary! Help your cause. Do not harm your fellow freedom fighters. You can identify your comrades by the red \"R\" icons, and your leaders by the blue \"R\" icons. Help them kill the heads to win the revolution!</FONT></span>"]);
	yield* g.callName(f, rt.fv(f, "current", live(rev_mind)), "log_message", ["<font color='red'>Has been converted to the revolution!</font>", "Attack log"]);
	rt.setFv(f, "special_role", live(rev_mind), "Revolutionary");
	yield* g.srcCall(f, "update_rev_icons_added", live(rev_mind));
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [rt.fv(f, "current", live(rev_mind)), "revolutionary"])))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/datum/game_mode/proc/replace_jobbaned_player"), rt.fv(f, "current", live(rev_mind)), "revolutionary", "revolutionary"]);
	}
	return 1;
}, true);

// /datum/game_mode/proc/remove_revolutionary  (code/game/gamemodes/revolution/revolution.dm:285)  may sleep
rt.def("/datum/game_mode/proc/remove_revolutionary", function* remove_revolutionary(f: Frame, rev_mind: Value, beingborged: Value) {
	let remove_head: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [rev_mind, beingborged, remove_head, $0, $1, $2];
	remove_head = 0;
	if ((truthy(live(beingborged)) && truthy((rt.isIn(f, live(rev_mind), rt.sv(f, "head_revolutionaries")) ? 1 : 0)))) {
		(rt.modSrcVar(f, "head_revolutionaries", live(rev_mind), subtract));
		remove_head = 1;
	}
	if (!(truthy((rt.isIn(f, live(rev_mind), rt.sv(f, "revolutionaries")) ? 1 : 0)) || truthy(live(remove_head)))) return f.dot;
	(rt.modSrcVar(f, "revolutionaries", live(rev_mind), subtract));
	rt.setFv(f, "special_role", live(rev_mind), null);
	yield* g.callName(f, rt.fv(f, "current", live(rev_mind)), "log_message", ["<font color='red'>Has renounced the revolution!</font>", "Attack log"]);
	if (truthy(live(beingborged))) {
		$0 = rt.fv(f, "current", live(rev_mind));
		$1 = "The frame beeps contentedly, purging the hostile memory engram from the MMI before initalizing it.";
		if (truthy(live(remove_head))) {
			$2 = ".";
		} else {
			$2 = " but the name of the one who flashed you.";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='danger'><FONT size = 3>The frame's firmware detects and deletes your neural reprogramming! You remember nothing＀</FONT></span>", [$2])]);
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "current", live(rev_mind))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "current", live(rev_mind))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "current", live(rev_mind))])]);
		if (truthy(live(remove_head))) {
			$1 = "leader";
		} else {
			$1 = " member";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been borged while being a ＀ of the revolution.", [$0, $1])]);
	} else {
		yield* g.callName(f, rt.fv(f, "current", live(rev_mind)), "Unconscious", [100]);
		yield* g.callName(f, rt.fv(f, "current", live(rev_mind)), "visible_message", [fmt("＀ looks like they just remembered their real allegiance!", [rt.fv(f, "current", live(rev_mind))]), "<span class='danger'><FONT size = 3>You have been brainwashed! You are no longer a revolutionary! Your memory is hazy from the time you were a rebel...the only thing you remember is the name of the one who brainwashed you...</FONT></span>"]);
	}
	yield* g.srcCall(f, "update_rev_icons_removed", live(rev_mind));
	return f.dot;
}, true);

// /datum/game_mode/proc/update_rev_icons_added  (code/game/gamemodes/revolution/revolution.dm:309)
rt.def("/datum/game_mode/proc/update_rev_icons_added", function update_rev_icons_added(f: Frame, rev_mind: Value) {
	let revhud: Value = null;
	let $0: any, $1: any;
	f.vars = () => [revhud, $0, $1];
	rt.callName(f, (revhud = rt.index(rt.gl("huds"), 7)), "join_hud", [rt.fv(f, "current", live(rev_mind))]);
	$0 = rt.fv(f, "current", live(rev_mind));
	if (truthy((rt.isIn(f, live(rev_mind), rt.sv(f, "head_revolutionaries")) ? 1 : 0))) {
		$1 = "rev_head";
	} else {
		$1 = "rev";
	}
	rt.callSrc(f, "set_antag_hud", [$0, $1]);
	return f.dot;
});

// /datum/game_mode/proc/update_rev_icons_removed  (code/game/gamemodes/revolution/revolution.dm:317)
rt.def("/datum/game_mode/proc/update_rev_icons_removed", function update_rev_icons_removed(f: Frame, rev_mind: Value) {
	let revhud: Value = null;
	f.vars = () => [revhud];
	rt.callName(f, (revhud = rt.index(rt.gl("huds"), 7)), "leave_hud", [rt.fv(f, "current", live(rev_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(rev_mind)), null]);
	return f.dot;
});

// /datum/game_mode/revolution/proc/check_rev_victory  (code/game/gamemodes/revolution/revolution.dm:325)
rt.def("/datum/game_mode/revolution/proc/check_rev_victory", function check_rev_victory(f: Frame) {
	let rev_mind: Value = null, objective: Value = null;
	let $e: any;
	f.vars = () => [rev_mind, objective, $e];
	rev_mind = null;
	rt.forList(f, 0, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rev_mind = $e;
		objective = null;
		rt.forList(f, 1, rt.fv(f, "objectives", live(rev_mind)), T("/datum/objective/mutiny"));
		while (($e = rt.next(f, 1)) !== undefined) {
			objective = $e;
			if (!truthy(rt.callName(f, live(objective), "check_completion", []))) {
				return 0;
			}
		}
		rt.endFor(f, 1);
		return 1;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/game_mode/revolution/proc/check_heads_victory  (code/game/gamemodes/revolution/revolution.dm:336)
rt.def("/datum/game_mode/revolution/proc/check_heads_victory", function check_heads_victory(f: Frame) {
	let rev_mind: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [rev_mind, _T, $e];
	rev_mind = null;
	rt.forList(f, 0, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rev_mind = $e;
		_T = rt.getStep(f, rt.fv(f, "current", live(rev_mind)), 0);
		if (((((truthy(live(rev_mind)) && truthy(rt.fv(f, "current", live(rev_mind)))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(rev_mind))), 2)) && truthy(live(_T))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
			if (truthy((rt.istype(rt.fv(f, "current", live(rev_mind)), T("/mob/living/carbon/human")) ? 1 : 0))) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/game_mode/revolution/proc/declare_completion  (code/game/gamemodes/revolution/revolution.dm:347)
rt.def("/datum/game_mode/revolution/proc/declare_completion", function declare_completion(f: Frame) {
	if (isEqual(rt.sv(f, "finished"), 1)) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - heads killed");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='redtext'>The heads of staff were killed or exiled! The revolutionaries win!</span>"]);
		rt.setFv(f, "news_report", rt.gl("SSticker"), 17);
	} else {
		if (isEqual(rt.sv(f, "finished"), 2)) {
			rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - rev heads killed");
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='redtext'>The heads of staff managed to stop the revolution!</span>"]);
			rt.setFv(f, "news_report", rt.gl("SSticker"), 18);
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
});

// /datum/game_mode/proc/auto_declare_completion_revolution  (code/game/gamemodes/revolution/revolution.dm:362)
rt.def("/datum/game_mode/proc/auto_declare_completion_revolution", function auto_declare_completion_revolution(f: Frame) {
	let targets: Value = null, num_revs: Value = null, num_survivors: Value = null, survivor: Value = null, text: Value = null, headrev: Value = null, text_1: Value = null, rev: Value = null, heads: Value = null, head: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [targets, num_revs, num_survivors, survivor, text, headrev, text_1, rev, heads, head, target, $e];
	targets = rt.list();
	if ((truthy(rt.len(f, rt.sv(f, "head_revolutionaries"))) || truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/revolution")) ? 1 : 0)))) {
		num_revs = 0;
		num_survivors = 0;
		survivor = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			survivor = $e;
			if (truthy(rt.fv(f, "ckey", live(survivor)))) {
				num_survivors = rt.inc(live(num_survivors), 1);
				if (truthy(rt.fv(f, "mind", live(survivor)))) {
					if ((truthy((rt.isIn(f, rt.fv(f, "mind", live(survivor)), rt.sv(f, "head_revolutionaries")) ? 1 : 0)) || truthy((rt.isIn(f, rt.fv(f, "mind", live(survivor)), rt.sv(f, "revolutionaries")) ? 1 : 0)))) {
						num_revs = rt.inc(live(num_revs), 1);
					}
				}
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(num_survivors))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("＀Command's Approval Rating: <B>＀%</B>", [rt.gl("TAB"), subtract(100, rt.call(f, P("/proc/round"), null, [multiply(divide(live(num_revs), live(num_survivors)), 100), 0.10000000149011612]))])]);
		}
		text = "<br><font size=3><b>The head revolutionaries were:</b></font>";
		headrev = null;
		rt.forList(f, 0, rt.sv(f, "head_revolutionaries"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			headrev = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(headrev), 1]), add);
		}
		rt.endFor(f, 0);
		text = rt.modify(live(text), "<br>", add);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	if ((truthy(rt.len(f, rt.sv(f, "revolutionaries"))) || truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/revolution")) ? 1 : 0)))) {
		text_1 = "<br><font size=3><b>The revolutionaries were:</b></font>";
		rev = null;
		rt.forList(f, 0, rt.sv(f, "revolutionaries"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			rev = $e;
			text_1 = rt.modify(live(text_1), rt.callSrc(f, "printplayer", [live(rev), 1]), add);
		}
		rt.endFor(f, 0);
		text_1 = rt.modify(live(text_1), "<br>", add);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text_1)]);
	}
	if (!((truthy(rt.len(f, rt.sv(f, "head_revolutionaries"))) || truthy(rt.len(f, rt.sv(f, "revolutionaries")))) || truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/revolution")) ? 1 : 0)))) return f.dot;
	text_1 = "<br><font size=3><b>The heads of staff were:</b></font>";
	heads = rt.callSrc(f, "get_all_heads", []);
	head = null;
	rt.forList(f, 0, live(heads), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		head = $e;
		if (truthy((target = (rt.isIn(f, live(head), live(targets)) ? 1 : 0)))) {
			text_1 = rt.modify(live(text_1), "<span class='boldannounce'>Target</span>", add);
		}
		text_1 = rt.modify(live(text_1), rt.callSrc(f, "printplayer", [live(head), 1]), add);
	}
	rt.endFor(f, 0);
	text_1 = rt.modify(live(text_1), "<br>", add);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text_1)]);
	return f.dot;
});
