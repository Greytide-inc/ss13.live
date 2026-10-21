// From code/game/gamemodes/nuclear/nuclear.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1097, "/datum/game_mode/nuclear", "/datum/game_mode", {
	agents_possible: 5,
	nukes_left: 1,
	nuke_off_station: 0,
	syndies_didnt_escape: 0,
	name: "nuclear emergency",
	config_tag: "nuclear",
	required_players: 30,
	required_enemies: 2,
	recommended_enemies: 5,
	antag_flag: "operative",
	announce_span: "danger",
	announce_text: "Syndicate forces are approaching the station in an attempt to destroy it!\n<span class='danger'>Operatives</span>: Secure the nuclear authentication disk and use your nuke to destroy the station.\n<span class='notice'>Crew</span>: Defend the nuclear authentication disk and ensure that it leaves with you on the emergency shuttle.",
}, { const: ["agents_possible"] });

// /datum/game_mode/nuclear/proc/pre_setup  (code/game/gamemodes/nuclear/nuclear.dm:26)
rt.def("/datum/game_mode/nuclear/proc/pre_setup", function pre_setup(f: Frame) {
	let n_players: Value = null, n_agents: Value = null, new_syndicate: Value = null, synd_mind: Value = null;
	let $e: any;
	f.vars = () => [n_players, n_agents, new_syndicate, synd_mind, $e];
	n_players = rt.callSrc(f, "num_players", []);
	n_agents = rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(live(n_players), 10), 1]), 5]);
	if (rt.lt(rt.len(f, rt.sv(f, "antag_candidates")), live(n_agents))) {
		n_agents = rt.len(f, rt.sv(f, "antag_candidates"));
	}
	while (rt.gt(live(n_agents), 0)) {
		rt.modSrcVar(f, "syndicates", (new_syndicate = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "antag_candidates")])), add);
		(rt.modSrcVar(f, "antag_candidates", live(new_syndicate), subtract));
		n_agents = rt.inc(live(n_agents), -1);
	}
	synd_mind = null;
	rt.forList(f, 0, rt.sv(f, "syndicates"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		synd_mind = $e;
		rt.setFv(f, "assigned_role", live(synd_mind), "Syndicate");
		rt.setFv(f, "special_role", live(synd_mind), "Syndicate");
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ (ckey) has been selected as a nuclear operative", [rt.fv(f, "key", live(synd_mind))])]);
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/game_mode/proc/update_synd_icons_added  (code/game/gamemodes/nuclear/nuclear.dm:49)
rt.def("/datum/game_mode/proc/update_synd_icons_added", function update_synd_icons_added(f: Frame, synd_mind: Value) {
	let opshud: Value = null;
	f.vars = () => [opshud];
	rt.callName(f, (opshud = rt.index(rt.gl("huds"), 8)), "join_hud", [rt.fv(f, "current", live(synd_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(synd_mind)), "synd"]);
	return f.dot;
});

// /datum/game_mode/proc/update_synd_icons_removed  (code/game/gamemodes/nuclear/nuclear.dm:54)
rt.def("/datum/game_mode/proc/update_synd_icons_removed", function update_synd_icons_removed(f: Frame, synd_mind: Value) {
	let opshud: Value = null;
	f.vars = () => [opshud];
	rt.callName(f, (opshud = rt.index(rt.gl("huds"), 8)), "leave_hud", [rt.fv(f, "current", live(synd_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(synd_mind)), null]);
	return f.dot;
});

// /datum/game_mode/nuclear/proc/post_setup  (code/game/gamemodes/nuclear/nuclear.dm:63)  may sleep
rt.def("/datum/game_mode/nuclear/proc/post_setup", function* post_setup(f: Frame) {
	let synd_spawn: Value = null, A: Value = null, nuke_code: Value = null, leader_selected: Value = null, agent_number: Value = null, spawnpos: Value = null, synd_mind: Value = null, nuke: Value = null;
	let $e: any;
	f.vars = () => [synd_spawn, A, nuke_code, leader_selected, agent_number, spawnpos, synd_mind, nuke, $e];
	synd_spawn = rt.list();
	A = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "name", live(A)), "Syndicate-Spawn")) {
			synd_spawn = rt.modify(live(synd_spawn), rt.getStep(f, live(A), 0), add);
			continue;
		}
	}
	rt.endFor(f, 0);
	nuke_code = (yield* g.call(f, P("/proc/random_nukecode"), null, []));
	leader_selected = 0;
	agent_number = 1;
	spawnpos = 1;
	synd_mind = null;
	rt.forList(f, 0, rt.sv(f, "syndicates"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		synd_mind = $e;
		if (rt.gt(live(spawnpos), rt.len(f, live(synd_spawn)))) {
			spawnpos = 2;
		}
		rt.setFv(f, "loc", rt.fv(f, "current", live(synd_mind)), rt.index(live(synd_spawn), live(spawnpos)));
		yield* g.srcCall(f, "forge_syndicate_objectives", live(synd_mind));
		yield* g.srcCall(f, "greet_syndicate", live(synd_mind));
		yield* g.srcCall(f, "equip_syndicate", rt.fv(f, "current", live(synd_mind)));
		if (truthy(live(nuke_code))) {
			yield* g.callName(f, live(synd_mind), "store_memory", [fmt("<B>Syndicate Nuclear Bomb Code</B>: ＀", [live(nuke_code)]), 0, 0]);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(synd_mind)), fmt("The nuclear authorization code is: <B>＀</B>", [live(nuke_code)])]);
		}
		if (!truthy(live(leader_selected))) {
			yield* g.srcCall(f, "prepare_syndicate_leader", live(synd_mind), live(nuke_code));
			leader_selected = 1;
		} else {
			rt.setFv(f, "real_name", rt.fv(f, "current", live(synd_mind)), fmt("＀ Operative #＀", [(yield* g.call(f, P("/proc/syndicate_name"), null, [])), live(agent_number)]));
			agent_number = rt.inc(live(agent_number), 1);
		}
		spawnpos = rt.inc(live(spawnpos), 1);
		yield* g.srcCall(f, "update_synd_icons_added", live(synd_mind));
		yield* g.callName(f, rt.fv(f, "current", live(synd_mind)), "playsound_local", [rt.getStep(f, rt.fv(f, "current", live(synd_mind)), 0), rt.rsc("sound/ambience/antag/ops.ogg"), 100, 0]);
	}
	rt.endFor(f, 0);
	if (truthy((nuke = rt.locateIn(f, "syndienuke", rt.gl("nuke_list"))))) {
		rt.setFv(f, "r_code", live(nuke), live(nuke_code));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/game_mode/proc/prepare_syndicate_leader  (code/game/gamemodes/nuclear/nuclear.dm:105)  may sleep
rt.def("/datum/game_mode/proc/prepare_syndicate_leader", function* prepare_syndicate_leader(f: Frame, synd_mind: Value, nuke_code: Value) {
	let leader_title: Value = null, challenge: Value = null, foundIDs: Value = null, ID: Value = null, A: Value = null, _P: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [synd_mind, nuke_code, leader_title, challenge, foundIDs, ID, A, _P, H, $e];
	leader_title = rt.op(f, "PickUnweighted", [7], ["Czar", "Boss", "Commander", "Chief", "Kingpin", "Director", "Overlord"]);
	rt.spawnTail(f, 1, "/datum/game_mode/proc/prepare_syndicate_leader: spawn at game/gamemodes/nuclear/nuclear.dm:106", synd_mind, nuke_code, leader_title, challenge, foundIDs, ID, A, _P, H);
	rt.setFv(f, "real_name", rt.fv(f, "current", live(synd_mind)), fmt("＀ ＀", [(yield* g.call(f, P("/proc/syndicate_name"), null, [])), live(leader_title)]));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(synd_mind)), fmt("<B>You are the Syndicate ＀ for this mission. You are responsible for the distribution of telecrystals and your ID is the only one who can open the launch bay doors.</B>", [live(leader_title)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(synd_mind)), "<B>If you feel you are not up to this task, give your ID to another operative.</B>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(synd_mind)), "<B>In your hand you will find a special item capable of triggering a greater challenge for your team. Examine it carefully and consult with your fellow operatives before activating it.</B>"]);
	challenge = (yield* g.new_(f, T("/obj/item/device/nuclear_challenge"), []));
	yield* g.callName(f, rt.fv(f, "current", live(synd_mind)), "put_in_hands_or_del", [live(challenge)]);
	if (truthy(rt.getLen(f, (foundIDs = (yield* g.callName(f, rt.fv(f, "current", live(synd_mind)), "search_contents_for", [T("/obj/item/weapon/card/id")])))))) {
		ID = null;
		rt.forList(f, 0, live(foundIDs), T("/obj/item/weapon/card/id"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ID = $e;
			rt.setFv(f, "name", live(ID), "lead agent card");
			rt.modField(f, live(ID), "access", 151, add);
		}
		rt.endFor(f, 0);
	} else {
		yield* g.call(f, P("/proc/message_admins"), null, ["Warning: Nuke Ops spawned without access to leave their spawn area!"]);
	}
	if (truthy((A = rt.locateIn(f, T("/obj/item/device/radio/headset/syndicate/alt"), rt.fv(f, "current", live(synd_mind)))))) {
		rt.setFv(f, "command", live(A), 1);
	}
	if (truthy(live(nuke_code))) {
		rt.setFv(f, "info", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), []))), fmt("The nuclear authorization code is: <b>＀</b>", [live(nuke_code)]));
		rt.setFv(f, "name", live(_P), "nuclear bomb code");
		H = rt.fv(f, "current", live(synd_mind));
		rt.setFv(f, "loc", live(_P), rt.fv(f, "loc", live(H)));
		yield* g.callName(f, live(H), "put_in_hands_or_del", [live(_P)]);
		yield* g.callName(f, live(H), "update_icons", []);
	} else {
		nuke_code = "code will be provided later";
	}
	return live(f.dot);
}, true);

// a spawn(1) body of /datum/game_mode/proc/prepare_syndicate_leader, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/proc/prepare_syndicate_leader: spawn at game/gamemodes/nuclear/nuclear.dm:106", function* (f: Frame, synd_mind: Value, nuke_code: Value, leader_title: Value, challenge: Value, foundIDs: Value, ID: Value, A: Value, _P: Value, H: Value) {
	f.vars = () => [synd_mind, nuke_code, leader_title, challenge, foundIDs, ID, A, _P, H];
	rt.setSv(f, "nukeops_lastname", (yield* g.call(f, P("/proc/nukelastname"), null, [rt.fv(f, "current", live(synd_mind))])));
	yield* g.call(f, P("/proc/NukeNameAssign"), null, [rt.sv(f, "nukeops_lastname"), rt.sv(f, "syndicates")]);
	return null;
});

// /datum/game_mode/proc/forge_syndicate_objectives  (code/game/gamemodes/nuclear/nuclear.dm:144)
rt.def("/datum/game_mode/proc/forge_syndicate_objectives", function forge_syndicate_objectives(f: Frame, syndicate: Value) {
	let syndobj: Value = null;
	f.vars = () => [syndobj];
	rt.setFv(f, "owner", (syndobj = rt.new_(f, T("/datum/objective/nuclear"), [])), live(syndicate));
	rt.modField(f, live(syndicate), "objectives", live(syndobj), add);
	return f.dot;
});

// /datum/game_mode/proc/greet_syndicate  (code/game/gamemodes/nuclear/nuclear.dm:151)
rt.def("/datum/game_mode/proc/greet_syndicate", function greet_syndicate(f: Frame, syndicate: Value, you_are: Value) {
	f.vars = () => [you_are];
	if (live(you_are) === null) {
		you_are = 1;
	}
	if (truthy(live(you_are))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(syndicate)), fmt("<span class='notice'>You are a ＀ agent!</span>", [rt.call(f, P("/proc/syndicate_name"), null, [])])]);
	}
	rt.callName(f, live(syndicate), "announce_objectives", []);
	return f.dot;
});

// /datum/game_mode/proc/equip_syndicate  (code/game/gamemodes/nuclear/nuclear.dm:155)  may sleep
rt.def("/datum/game_mode/proc/equip_syndicate", function* equip_syndicate(f: Frame, synd_mob: Value, telecrystals: Value) {
	f.vars = () => [synd_mob, telecrystals];
	if (live(telecrystals) === null) {
		telecrystals = 1;
	}
	yield* g.callName(f, live(synd_mob), "set_species", [T("/datum/species/human")]);
	if (truthy(live(telecrystals))) {
		yield* g.callName(f, live(synd_mob), "equipOutfit", [T("/datum/outfit/syndicate")]);
	} else {
		yield* g.callName(f, live(synd_mob), "equipOutfit", [T("/datum/outfit/syndicate/no_crystals")]);
	}
	return 1;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, {  }] });

// /datum/game_mode/nuclear/proc/check_win  (code/game/gamemodes/nuclear/nuclear.dm:165)
rt.def("/datum/game_mode/nuclear/proc/check_win", function check_win(f: Frame) {
	if (isEqual(rt.sv(f, "nukes_left"), 0)) {
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/game_mode/proc/are_operatives_dead  (code/game/gamemodes/nuclear/nuclear.dm:170)
rt.def("/datum/game_mode/proc/are_operatives_dead", function are_operatives_dead(f: Frame) {
	let operative_mind: Value = null;
	let $e: any;
	f.vars = () => [operative_mind, $e];
	operative_mind = null;
	rt.forList(f, 0, rt.sv(f, "syndicates"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		operative_mind = $e;
		if ((truthy((rt.istype(rt.fv(f, "current", live(operative_mind)), T("/mob/living/carbon/human")) ? 1 : 0)) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(operative_mind))), 2))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/game_mode/nuclear/proc/check_finished  (code/game/gamemodes/nuclear/nuclear.dm:176)  may sleep
rt.def("/datum/game_mode/nuclear/proc/check_finished", function* check_finished(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if ((truthy(rt.sv(f, "replacementmode")) && isEqual(rt.sv(f, "round_converted"), 2))) {
		return (yield* g.callName(f, rt.sv(f, "replacementmode"), "check_finished", []));
	}
	if ((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over") || truthy(rt.sv(f, "station_was_nuked")))) {
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "are_operatives_dead")))) {
		N = null;
		yield* g.call(f, P("/proc/pass"), null, [live(N)]);
		if (truthy(rt.gl("bomb_set"))) {
			return 0;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/game_mode/nuclear/proc/declare_completion  (code/game/gamemodes/nuclear/nuclear.dm:189)
rt.def("/datum/game_mode/nuclear/proc/declare_completion", function declare_completion(f: Frame) {
	let disk_rescued: Value = null, D: Value = null, crew_evacuated: Value = null;
	let $e: any;
	f.vars = () => [disk_rescued, D, crew_evacuated, $e];
	disk_rescued = 1;
	D = null;
	rt.forList(f, 0, rt.gl("poi_list"), T("/obj/item/weapon/disk/nuclear"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!truthy(rt.callName(f, live(D), "onCentcom", []))) {
			disk_rescued = 0;
			break;
		}
	}
	rt.endFor(f, 0);
	crew_evacuated = (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over") ? 1 : 0);
	if (isEqual(rt.sv(f, "nuke_off_station"), 3)) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - syndicate nuked - disk secured");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Humiliating Syndicate Defeat</B></FONT>"]);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>The crew of ＀ gave ＀ operatives back their bomb! The syndicate base was destroyed!</B> Next time, don't lose the nuke!", [rt.call(f, P("/proc/station_name"), null, []), rt.call(f, P("/proc/syndicate_name"), null, [])])]);
		rt.setFv(f, "news_report", rt.gl("SSticker"), 3);
	} else {
		if (((!truthy(live(disk_rescued)) && truthy(rt.sv(f, "station_was_nuked"))) && !truthy(rt.sv(f, "syndies_didnt_escape")))) {
			rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - syndicate nuke");
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Syndicate Major Victory!</B></FONT>"]);
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>＀ operatives have destroyed ＀!</B>", [rt.call(f, P("/proc/syndicate_name"), null, []), rt.call(f, P("/proc/station_name"), null, [])])]);
			rt.setFv(f, "news_report", rt.gl("SSticker"), 20);
		} else {
			if (((!truthy(live(disk_rescued)) && truthy(rt.sv(f, "station_was_nuked"))) && truthy(rt.sv(f, "syndies_didnt_escape")))) {
				rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - syndicate nuke - did not evacuate in time");
				rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Total Annihilation</B></FONT>"]);
				rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>＀ operatives destroyed ＀ but did not leave the area in time and got caught in the explosion.</B> Next time, don't lose the disk!", [rt.call(f, P("/proc/syndicate_name"), null, []), rt.call(f, P("/proc/station_name"), null, [])])]);
				rt.setFv(f, "news_report", rt.gl("SSticker"), 20);
			} else {
				if ((((!truthy(live(disk_rescued)) && !truthy(rt.sv(f, "station_was_nuked"))) && truthy(rt.sv(f, "nuke_off_station"))) && !truthy(rt.sv(f, "syndies_didnt_escape")))) {
					rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - blew wrong station");
					rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Crew Minor Victory</B></FONT>"]);
					rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>＀ operatives secured the authentication disk but blew up something that wasn't ＀.</B> Next time, don't do that!", [rt.call(f, P("/proc/syndicate_name"), null, []), rt.call(f, P("/proc/station_name"), null, [])])]);
					rt.setFv(f, "news_report", rt.gl("SSticker"), 14);
				} else {
					if ((((!truthy(live(disk_rescued)) && !truthy(rt.sv(f, "station_was_nuked"))) && truthy(rt.sv(f, "nuke_off_station"))) && truthy(rt.sv(f, "syndies_didnt_escape")))) {
						rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - blew wrong station - did not evacuate in time");
						rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<FONT size = 3><B>＀ operatives have earned Darwin Award!</B></FONT>", [rt.call(f, P("/proc/syndicate_name"), null, [])])]);
						rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>＀ operatives blew up something that wasn't ＀ and got caught in the explosion.</B> Next time, don't do that!", [rt.call(f, P("/proc/syndicate_name"), null, []), rt.call(f, P("/proc/station_name"), null, [])])]);
						rt.setFv(f, "news_report", rt.gl("SSticker"), 14);
					} else {
						if (((truthy(live(disk_rescued)) || !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "endgame: game over")) && truthy(rt.callSrc(f, "are_operatives_dead", [])))) {
							rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - evacuation - disk secured - syndi team dead");
							rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Crew Major Victory!</B></FONT>"]);
							rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>The Research Staff has saved the disk and killed the ＀ Operatives</B>", [rt.call(f, P("/proc/syndicate_name"), null, [])])]);
							rt.setFv(f, "news_report", rt.gl("SSticker"), 15);
						} else {
							if (truthy(live(disk_rescued))) {
								rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - evacuation - disk secured");
								rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Crew Major Victory</B></FONT>"]);
								rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>The Research Staff has saved the disk and stopped the ＀ Operatives!</B>", [rt.call(f, P("/proc/syndicate_name"), null, [])])]);
								rt.setFv(f, "news_report", rt.gl("SSticker"), 15);
							} else {
								if ((!truthy(live(disk_rescued)) && truthy(rt.callSrc(f, "are_operatives_dead", [])))) {
									rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - evacuation - disk not secured");
									rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Neutral Victory!</B></FONT>"]);
									rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>The Research Staff failed to secure the authentication disk but did manage to kill most of the ＀ Operatives!</B>", [rt.call(f, P("/proc/syndicate_name"), null, [])])]);
									rt.setFv(f, "news_report", rt.gl("SSticker"), 16);
								} else {
									if ((!truthy(live(disk_rescued)) && truthy(live(crew_evacuated)))) {
										rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - detonation averted");
										rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Syndicate Minor Victory!</B></FONT>"]);
										rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<B>＀ operatives survived the assault but did not achieve the destruction of ＀.</B> Next time, don't lose the disk!", [rt.call(f, P("/proc/syndicate_name"), null, []), rt.call(f, P("/proc/station_name"), null, [])])]);
										rt.setFv(f, "news_report", rt.gl("SSticker"), 16);
									} else {
										if ((!truthy(live(disk_rescued)) && !truthy(live(crew_evacuated)))) {
											rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - interrupted");
											rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Neutral Victory</B></FONT>"]);
											rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>Round was mysteriously interrupted!</B>"]);
											rt.setFv(f, "news_report", rt.gl("SSticker"), 16);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
});

// /datum/game_mode/proc/auto_declare_completion_nuclear  (code/game/gamemodes/nuclear/nuclear.dm:278)
rt.def("/datum/game_mode/proc/auto_declare_completion_nuclear", function auto_declare_completion_nuclear(f: Frame) {
	let text: Value = null, purchases: Value = null, TC_uses: Value = null, syndicate: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [text, purchases, TC_uses, syndicate, H, $e];
	if ((truthy(rt.len(f, rt.sv(f, "syndicates"))) || (truthy(rt.gl("SSticker")) && truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/nuclear")) ? 1 : 0))))) {
		text = "<br><FONT size=3><B>The syndicate operatives were:</B></FONT>";
		purchases = "";
		TC_uses = 0;
		syndicate = null;
		rt.forList(f, 0, rt.sv(f, "syndicates"), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			syndicate = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(syndicate)]), add);
			H = null;
			rt.forList(f, 1, rt.gl("uplinks"), T("/obj/item/device/uplink"));
			while (($e = rt.next(f, 1)) !== undefined) {
				H = $e;
				if (((truthy(live(H)) && truthy(rt.fv(f, "owner", live(H)))) && isEqual(rt.fv(f, "owner", live(H)), rt.fv(f, "key", live(syndicate))))) {
					TC_uses = rt.modify(live(TC_uses), rt.fv(f, "spent_telecrystals", live(H)), add);
					purchases = rt.modify(live(purchases), rt.fv(f, "purchase_log", live(H)), add);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		text = rt.modify(live(text), "<br>", add);
		text = rt.modify(live(text), fmt("(Syndicates used ＀ TC) ＀", [live(TC_uses), live(purchases)]), add);
		if (((isEqual(live(TC_uses), 0) && truthy(rt.sv(f, "station_was_nuked"))) && !truthy(rt.callSrc(f, "are_operatives_dead", [])))) {
			text = rt.modify(live(text), fmt("<BIG>＀</BIG>", [rt.call(f, P("/proc/bicon"), null, [rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/badass.dmi"), "badass"])])]), add);
		}
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	return 1;
});

// /proc/nukelastname  (code/game/gamemodes/nuclear/nuclear.dm:297)  may sleep
rt.def("/proc/nukelastname", function* nukelastname(f: Frame, M: Value) {
	let randomname: Value = null, newname: Value = null;
	f.vars = () => [M, randomname, newname];
	randomname = rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")]);
	if (!truthy((newname = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [live(randomname), "Name change", fmt("You are the nuke operative ＀. Please choose a last name for your family.", [rt.op(f, "PickUnweighted", [7], ["Czar", "Boss", "Commander", "Chief", "Kingpin", "Director", "Overlord"])]), live(M), null]))])), 1, 42]))))) {
		newname = live(randomname);
	} else {
		if (((((isEqual(live(newname), "Unknown") || isEqual(live(newname), "floor")) || isEqual(live(newname), "wall")) || isEqual(live(newname), "rwall")) || isEqual(live(newname), "_"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "That name is reserved."]);
			return (yield* g.call(f, P("/proc/nukelastname"), null, [live(M)]));
		}
	}
	return (yield* g.call(f, P("/proc/capitalize"), null, [live(newname)]));
}, true);

// /proc/NukeNameAssign  (code/game/gamemodes/nuclear/nuclear.dm:311)
rt.def("/proc/NukeNameAssign", function NukeNameAssign(f: Frame, lastname: Value, syndicates: Value) {
	let synd_mind: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [synd_mind, H, $e];
	synd_mind = null;
	rt.forList(f, 0, live(syndicates), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		synd_mind = $e;
		H = rt.fv(f, "current", live(synd_mind));
		rt.setFv(f, "name", live(synd_mind), rt.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(H))), "random_name", [rt.fv(f, "gender", live(H)), 0, live(lastname)]));
		rt.setFv(f, "real_name", rt.fv(f, "current", live(synd_mind)), rt.fv(f, "name", live(synd_mind)));
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/is_nuclear_operative  (code/game/gamemodes/nuclear/nuclear.dm:318)
rt.def("/proc/is_nuclear_operative", function is_nuclear_operative(f: Frame, M: Value) {
	return (rt.isIn(f, (((((live(M) && (rt.istype(live(M), T("/mob")) ? 1 : 0)) && rt.fv(f, "mind", live(M))) && rt.gl("SSticker")) && rt.fv(f, "mode", rt.gl("SSticker"))) && rt.fv(f, "mind", live(M))), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0);
});

rt.type(619, "/datum/outfit/syndicate", "/datum/outfit", {
	tc: 25,
	name: "Syndicate Operative - Basic",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	ears: rt.typePath("/obj/item/device/radio/headset/syndicate/alt"),
	l_pocket: rt.typePath("/obj/item/weapon/pinpointer/syndicate"),
	id: rt.typePath("/obj/item/weapon/card/id/syndicate"),
	belt: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
	backpack_contents: null,
});

// /datum/outfit/syndicate/proc/<init>  (code/game/gamemodes/nuclear/nuclear.dm:331)
rt.def("/datum/outfit/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/syndie"), 1]));
	return f.dot;
});

// /datum/outfit/syndicate/proc/post_equip  (code/game/gamemodes/nuclear/nuclear.dm:341)  may sleep
rt.def("/datum/outfit/syndicate/proc/post_equip", function* post_equip(f: Frame, H: Value) {
	let R: Value = null, U: Value = null, W: Value = null, E: Value = null;
	f.vars = () => [H, R, U, W, E];
	yield* g.callName(f, (R = rt.fv(f, "ears", live(H))), "set_frequency", [1213]);
	rt.setFv(f, "freqlock", live(R), 1);
	if (truthy(rt.sv(f, "tc"))) {
		rt.setFv(f, "owner", rt.gv(f, "hidden_uplink", (U = (yield* g.new_(f, T("/obj/item/device/radio/uplink/nuclear"), [live(H)])))), fmt("＀", [rt.fv(f, "key", live(H))]));
		rt.setFv(f, "telecrystals", rt.fv(f, "hidden_uplink", live(U)), rt.sv(f, "tc"));
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(U), 18]);
	}
	yield* g.callName(f, (W = (yield* g.new_(f, T("/obj/item/weapon/implant/weapons_auth"), [live(H)]))), "implant", [live(H)]);
	yield* g.callName(f, (E = (yield* g.new_(f, T("/obj/item/weapon/implant/explosive"), [live(H)]))), "implant", [live(H)]);
	(rt.modField(f, live(H), "faction", "syndicate", rt.bitOr));
	yield* g.callName(f, live(H), "update_icons", []);
	return f.dot;
}, true);

rt.type(621, "/datum/outfit/syndicate/full", "/datum/outfit/syndicate", {
	name: "Syndicate Operative - Full Kit",
	internals_slot: 16,
	glasses: rt.typePath("/obj/item/clothing/glasses/night"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/syndi"),
	r_pocket: rt.typePath("/obj/item/weapon/tank/internals/emergency_oxygen/engi"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/military"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"),
	backpack_contents: null,
});

// /datum/outfit/syndicate/full/proc/<init>  (code/game/gamemodes/nuclear/nuclear.dm:367)
rt.def("/datum/outfit/syndicate/full/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/syndie"), 1, T("/obj/item/weapon/tank/jetpack/oxygen/harness"), 1, T("/obj/item/weapon/gun/ballistic/automatic/pistol"), 1]));
	return f.dot;
});
