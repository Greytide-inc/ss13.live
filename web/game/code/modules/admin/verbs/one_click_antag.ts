// From code/modules/admin/verbs/one_click_antag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/one_click_antag  (code/modules/admin/verbs/one_click_antag.dm:7)  may sleep
rt.def("/client/proc/one_click_antag", function* one_click_antag(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "one_click_antag", []);
	}
	return live(f.dot);
}, true, { verb: { name: "Create Antagonist", category: "Admin", desc: "Auto-create an antagonist of your choice" } });

// /datum/admins/proc/one_click_antag  (code/modules/admin/verbs/one_click_antag.dm:13)  may sleep
rt.def("/datum/admins/proc/one_click_antag", function* one_click_antag(f: Frame) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [dat, popup];
	dat = fmt("\n\t\t<a href='?src=＃;makeAntag=traitors'>Make Traitors</a><br>\n\t\t<a href='?src=＃;makeAntag=changelings'>Make Changelings</a><br>\n\t\t<a href='?src=＃;makeAntag=revs'>Make Revs</a><br>\n\t\t<a href='?src=＃;makeAntag=cult'>Make Cult</a><br>\n\t\t<a href='?src=＃;makeAntag=clockcult'>Make Clockwork Cult</a><br>\n\t\t<a href='?src=＃;makeAntag=blob'>Make Blob</a><br>\n\t\t<a href='?src=＃;makeAntag=gangs'>Make Gangsters</a><br>\n\t\t<a href='?src=＃;makeAntag=wizard'>Make Wizard (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=nukeops'>Make Nuke Team (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=centcom'>Make Centcom Response Team (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=abductors'>Make Abductor Team (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=revenant'>Make Revenant (Requires Ghost)</a><br>\n\t\t", [live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), "oneclickantag", "Quick-Create Antagonist", 400, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /datum/admins/proc/makeTraitors  (code/modules/admin/verbs/one_click_antag.dm:33)  may sleep
rt.def("/datum/admins/proc/makeTraitors", function* makeTraitors(f: Frame) {
	let temp: Value = null, candidates: Value = null, H: Value = null, applicant: Value = null, numTraitors: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, H, applicant, numTraitors, i, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/traitor"), []));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", rt.fv(f, "protected_jobs", live(temp)), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", "Assistant", add);
	}
	candidates = rt.list();
	H = null;
	applicant = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		applicant = $e;
		if (truthy((rt.isIn(f, "traitor", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(applicant))))) ? 1 : 0))) {
			if (!truthy(rt.fv(f, "stat", live(applicant)))) {
				if (truthy(rt.fv(f, "mind", live(applicant)))) {
					if (!truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(applicant))))) {
						if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "traitor"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "Syndicate"]))))) {
							if (!truthy((rt.isIn(f, rt.fv(f, "job", live(applicant)), rt.fv(f, "restricted_jobs", live(temp))) ? 1 : 0))) {
								candidates = rt.modify(live(candidates), live(applicant), add);
							}
						}
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(candidates)))) {
		numTraitors = (yield* g.call(f, P("/proc/min"), null, [rt.len(f, live(candidates)), 3]));
		i = null;
		i = 0;
		while (rt.lt(live(i), live(numTraitors))) {
			yield* g.callName(f, rt.gv(f, "mind", (H = rt.op(f, "PickUnweighted", [1], [live(candidates)]))), "make_Traitor", []);
			yield* g.callName(f, live(candidates), "Remove", [live(H)]);
			i = rt.inc(live(i), 1);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeChanglings  (code/modules/admin/verbs/one_click_antag.dm:70)  may sleep
rt.def("/datum/admins/proc/makeChanglings", function* makeChanglings(f: Frame) {
	let temp: Value = null, candidates: Value = null, H: Value = null, applicant: Value = null, _T: Value = null, numChanglings: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, H, applicant, _T, numChanglings, i, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/changeling"), []));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", rt.fv(f, "protected_jobs", live(temp)), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", "Assistant", add);
	}
	candidates = rt.list();
	H = null;
	applicant = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		applicant = $e;
		if (truthy((rt.isIn(f, "changeling", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(applicant))))) ? 1 : 0))) {
			_T = rt.getStep(f, live(applicant), 0);
			if ((((isEqual(rt.fv(f, "stat", live(applicant)), 0) && truthy(rt.fv(f, "mind", live(applicant)))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(applicant))))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
				if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "changeling"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "Syndicate"]))))) {
					if (!truthy((rt.isIn(f, rt.fv(f, "job", live(applicant)), rt.fv(f, "restricted_jobs", live(temp))) ? 1 : 0))) {
						candidates = rt.modify(live(candidates), live(applicant), add);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(candidates)))) {
		numChanglings = (yield* g.call(f, P("/proc/min"), null, [rt.len(f, live(candidates)), 3]));
		i = null;
		i = 0;
		while (rt.lt(live(i), live(numChanglings))) {
			yield* g.callName(f, rt.gv(f, "mind", (H = rt.op(f, "PickUnweighted", [1], [live(candidates)]))), "make_Changling", []);
			yield* g.callName(f, live(candidates), "Remove", [live(H)]);
			i = rt.inc(live(i), 1);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeRevs  (code/modules/admin/verbs/one_click_antag.dm:103)  may sleep
rt.def("/datum/admins/proc/makeRevs", function* makeRevs(f: Frame) {
	let temp: Value = null, candidates: Value = null, H: Value = null, applicant: Value = null, _T: Value = null, numRevs: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, H, applicant, _T, numRevs, i, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/revolution"), []));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", rt.fv(f, "protected_jobs", live(temp)), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", "Assistant", add);
	}
	candidates = rt.list();
	H = null;
	applicant = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		applicant = $e;
		if (truthy((rt.isIn(f, "revolutionary", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(applicant))))) ? 1 : 0))) {
			_T = rt.getStep(f, live(applicant), 0);
			if ((((isEqual(rt.fv(f, "stat", live(applicant)), 0) && truthy(rt.fv(f, "mind", live(applicant)))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(applicant))))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
				if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "revolutionary"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "Syndicate"]))))) {
					if (!truthy((rt.isIn(f, rt.fv(f, "job", live(applicant)), rt.fv(f, "restricted_jobs", live(temp))) ? 1 : 0))) {
						candidates = rt.modify(live(candidates), live(applicant), add);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(candidates)))) {
		numRevs = (yield* g.call(f, P("/proc/min"), null, [rt.len(f, live(candidates)), 3]));
		i = null;
		i = 0;
		while (rt.lt(live(i), live(numRevs))) {
			yield* g.callName(f, rt.gv(f, "mind", (H = rt.op(f, "PickUnweighted", [1], [live(candidates)]))), "make_Rev", []);
			yield* g.callName(f, live(candidates), "Remove", [live(H)]);
			i = rt.inc(live(i), 1);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeWizard  (code/modules/admin/verbs/one_click_antag.dm:135)  may sleep
rt.def("/datum/admins/proc/makeWizard", function* makeWizard(f: Frame) {
	let candidates: Value = null, selected: Value = null, new_character: Value = null;
	f.vars = () => [candidates, selected, new_character];
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, ["Do you wish to be considered for the position of a Wizard Foundation 'diplomat'?", "wizard", null]));
	selected = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	yield* g.callName(f, rt.gv(f, "mind", (new_character = (yield* g.call(f, P("/proc/makeBody"), null, [live(selected)])))), "make_Wizard", []);
	return 1;
}, true);

// /datum/admins/proc/makeCult  (code/modules/admin/verbs/one_click_antag.dm:145)  may sleep
rt.def("/datum/admins/proc/makeCult", function* makeCult(f: Frame) {
	let temp: Value = null, candidates: Value = null, H: Value = null, applicant: Value = null, _T: Value = null, numCultists: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, H, applicant, _T, numCultists, i, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/cult"), []));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", rt.fv(f, "protected_jobs", live(temp)), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", "Assistant", add);
	}
	candidates = rt.list();
	H = null;
	applicant = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		applicant = $e;
		if (truthy((rt.isIn(f, "cultist", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(applicant))))) ? 1 : 0))) {
			_T = rt.getStep(f, live(applicant), 0);
			if ((((isEqual(rt.fv(f, "stat", live(applicant)), 0) && truthy(rt.fv(f, "mind", live(applicant)))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(applicant))))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
				if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "cultist"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "Syndicate"]))))) {
					if (!truthy((rt.isIn(f, rt.fv(f, "job", live(applicant)), rt.fv(f, "restricted_jobs", live(temp))) ? 1 : 0))) {
						candidates = rt.modify(live(candidates), live(applicant), add);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(candidates)))) {
		numCultists = (yield* g.call(f, P("/proc/min"), null, [rt.len(f, live(candidates)), 4]));
		i = null;
		i = 0;
		while (rt.lt(live(i), live(numCultists))) {
			yield* g.callName(f, rt.gv(f, "mind", (H = rt.op(f, "PickUnweighted", [1], [live(candidates)]))), "make_Cultist", []);
			yield* g.callName(f, live(candidates), "Remove", [live(H)]);
			i = rt.inc(live(i), 1);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeClockCult  (code/modules/admin/verbs/one_click_antag.dm:178)  may sleep
rt.def("/datum/admins/proc/makeClockCult", function* makeClockCult(f: Frame) {
	let temp: Value = null, candidates: Value = null, H: Value = null, applicant: Value = null, _T: Value = null, numCultists: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, H, applicant, _T, numCultists, i, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/clockwork_cult"), []));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", rt.fv(f, "protected_jobs", live(temp)), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", "Assistant", add);
	}
	candidates = rt.list();
	H = null;
	applicant = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		applicant = $e;
		if (truthy((rt.isIn(f, "servant of Ratvar", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(applicant))))) ? 1 : 0))) {
			_T = rt.getStep(f, live(applicant), 0);
			if ((((isEqual(rt.fv(f, "stat", live(applicant)), 0) && truthy(rt.fv(f, "mind", live(applicant)))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(applicant))))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
				if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "servant of Ratvar"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "Syndicate"]))))) {
					if (!truthy((rt.isIn(f, rt.fv(f, "job", live(applicant)), rt.fv(f, "restricted_jobs", live(temp))) ? 1 : 0))) {
						candidates = rt.modify(live(candidates), live(applicant), add);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(candidates)))) {
		numCultists = (yield* g.call(f, P("/proc/min"), null, [rt.len(f, live(candidates)), 4]));
		i = null;
		i = 0;
		while (rt.lt(live(i), live(numCultists))) {
			yield* g.call(f, P("/proc/to_chat"), null, [(H = rt.op(f, "PickUnweighted", [1], [live(candidates)])), "<span class='heavy_brass'>The world before you suddenly glows a brilliant yellow. You hear the whooshing steam and clanking cogs of a billion billion machines, and all at once you see the truth. Ratvar, the Clockwork Justiciar, lies derelict and forgotten in an unseen realm, and he has selected you as one of his harbringers. You are now a servant of Ratvar, and you will bring him back.</span>"]);
			yield* g.callName(f, live(H), "playsound_local", [null, rt.getStep(f, live(H), 0), null, rt.rsc("sound/ambience/antag/clockcultalr.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
			yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(H), 1]);
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_servant", [live(H)]);
			yield* g.callName(f, live(candidates), "Remove", [live(H)]);
			i = rt.inc(live(i), 1);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeNukeTeam  (code/modules/admin/verbs/one_click_antag.dm:218)  may sleep
rt.def("/datum/admins/proc/makeNukeTeam", function* makeNukeTeam(f: Frame) {
	let temp: Value = null, candidates: Value = null, chosen: Value = null, theghost: Value = null, numagents: Value = null, agentcount: Value = null, i: Value = null, j: Value = null, nuke_code: Value = null, nuke: Value = null, synd_spawn: Value = null, A: Value = null, leader_chosen: Value = null, spawnpos: Value = null, c: Value = null, new_character: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, chosen, theghost, numagents, agentcount, i, j, nuke_code, nuke, synd_spawn, A, leader_chosen, spawnpos, c, new_character, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/nuclear"), []));
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, ["Do you wish to be considered for a nuke team being sent in?", "operative", live(temp)]));
	chosen = rt.list();
	theghost = null;
	if (truthy(rt.len(f, live(candidates)))) {
		numagents = 5;
		agentcount = 0;
		i = null;
		i = 0;
		while (rt.lt(live(i), live(numagents))) {
			yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(candidates)]);
			j = null;
			rt.forList(f, 0, live(candidates), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				j = $e;
				if ((!truthy(live(j)) || !truthy(rt.fv(f, "client", live(j))))) {
					yield* g.callName(f, live(candidates), "Remove", [live(j)]);
					continue;
				}
				theghost = live(j);
				yield* g.callName(f, live(candidates), "Remove", [live(theghost)]);
				chosen = rt.modify(live(chosen), live(theghost), add);
				agentcount = rt.inc(live(agentcount), 1);
				break;
			}
			rt.endFor(f, 0);
			i = rt.inc(live(i), 1);
		}
		if (rt.lt(live(agentcount), 3)) {
			return 0;
		}
		nuke_code = (yield* g.call(f, P("/proc/random_nukecode"), null, []));
		if (truthy((nuke = rt.locateIn(f, "syndienuke", rt.gl("nuke_list"))))) {
			rt.setFv(f, "r_code", live(nuke), live(nuke_code));
		}
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
		leader_chosen = null;
		spawnpos = 1;
		c = null;
		rt.forList(f, 0, live(chosen), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			c = $e;
			if (rt.gt(live(spawnpos), rt.len(f, live(synd_spawn)))) {
				spawnpos = 2;
			}
			new_character = (yield* g.call(f, P("/proc/makeBody"), null, [live(c)]));
			if (!truthy(live(leader_chosen))) {
				leader_chosen = 1;
				yield* g.callName(f, rt.fv(f, "mind", live(new_character)), "make_Nuke", [rt.index(live(synd_spawn), live(spawnpos)), live(nuke_code), 1]);
			} else {
				yield* g.callName(f, rt.fv(f, "mind", live(new_character)), "make_Nuke", [rt.index(live(synd_spawn), live(spawnpos)), live(nuke_code)]);
			}
			spawnpos = rt.inc(live(spawnpos), 1);
		}
		rt.endFor(f, 0);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /datum/admins/proc/makeAliens  (code/modules/admin/verbs/one_click_antag.dm:278)
rt.def("/datum/admins/proc/makeAliens", function makeAliens(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	rt.setFv(f, "spawncount", (E = rt.new_(f, T("/datum/round_event/ghost_role/alien_infestation"), [0])), 3);
	rt.setFv(f, "processing", live(E), 1);
	return 1;
});

// /datum/admins/proc/makeSpaceNinja  (code/modules/admin/verbs/one_click_antag.dm:286)
rt.def("/datum/admins/proc/makeSpaceNinja", function makeSpaceNinja(f: Frame) {
	rt.new_(f, T("/datum/round_event/ghost_role/ninja"), []);
	return 1;
});

// /datum/admins/proc/makeDeathsquad  (code/modules/admin/verbs/one_click_antag.dm:291)  may sleep
rt.def("/datum/admins/proc/makeDeathsquad", function* makeDeathsquad(f: Frame) {
	let mission: Value = null, candidates: Value = null, squadSpawned: Value = null, numagents: Value = null, spawnpoints: Value = null, spawnloc: Value = null, chosen_candidate: Value = null, Commando: Value = null, door: Value = null, missionobj: Value = null, missiondesc: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [mission, candidates, squadSpawned, numagents, spawnpoints, spawnloc, chosen_candidate, Commando, door, missionobj, missiondesc, $0, $1, $e];
	mission = (yield* g.op(f, "Prompt", [2], [null, "Leave no witnesses.", "Assign Mission", "Assign a mission to the deathsquad", null]));
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, ["Do you wish to be considered for an elite Nanotrasen Strike Team?", "deathsquad", null]));
	squadSpawned = 0;
	if (rt.ge(rt.len(f, live(candidates)), 2)) {
		numagents = (yield* g.call(f, P("/proc/min"), null, [5, rt.len(f, live(candidates))]));
		spawnpoints = rt.gl("emergencyresponseteamspawn");
		while (truthy(live(numagents)) && truthy(rt.len(f, live(candidates)))) {
			if (rt.gt(live(numagents), rt.len(f, live(spawnpoints)))) {
				numagents = rt.inc(live(numagents), -1);
				continue;
			}
			spawnloc = rt.index(live(spawnpoints), live(numagents));
			(candidates = rt.modify(live(candidates), (chosen_candidate = rt.op(f, "PickUnweighted", [1], [live(candidates)])), subtract));
			if (!truthy(rt.fv(f, "key", live(chosen_candidate)))) {
				continue;
			}
			Commando = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(spawnloc)]));
			yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(chosen_candidate))), "copy_to", [live(Commando)]);
			if (isEqual(live(numagents), 1)) {
				rt.setFv(f, "real_name", live(Commando), fmt("Officer ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("commando_names")])]));
				yield* g.callName(f, live(Commando), "equipOutfit", [T("/datum/outfit/death_commando/officer")]);
			} else {
				rt.setFv(f, "real_name", live(Commando), fmt("Trooper ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("commando_names")])]));
				yield* g.callName(f, live(Commando), "equipOutfit", [T("/datum/outfit/death_commando")]);
			}
			yield* g.callName(f, rt.fv(f, "dna", live(Commando)), "update_dna_identity", []);
			rt.setFv(f, "key", live(Commando), rt.fv(f, "key", live(chosen_candidate)));
			rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(Commando)), "Death Commando");
			door = null;
			rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door/poddoor/ert"));
			while (($e = rt.next(f, 0)) !== undefined) {
				door = $e;
				rt.spawnTail(f, 0, "/datum/admins/proc/makeDeathsquad: spawn at modules/admin/verbs/one_click_antag.dm:322", mission, candidates, squadSpawned, numagents, spawnpoints, spawnloc, chosen_candidate, Commando, door, missionobj, missiondesc);
			}
			rt.endFor(f, 0);
			rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(Commando)), add);
			rt.setFv(f, "special_role", rt.fv(f, "mind", live(Commando)), "deathsquad");
			rt.setFv(f, "owner", (missionobj = (yield* g.new_(f, T("/datum/objective"), []))), rt.fv(f, "mind", live(Commando)));
			rt.setFv(f, "explanation_text", live(missionobj), live(mission));
			rt.setFv(f, "completed", live(missionobj), 1);
			rt.modField(f, rt.fv(f, "mind", live(Commando)), "objectives", live(missionobj), add);
			$0 = live(Commando);
			if (isEqual(live(numagents), 1)) {
				$1 = "Deathsquad Officer";
			} else {
				$1 = "Death Commando";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<B><font size=3 color=red>You are the ＀.</font></B>", [$1])]);
			missiondesc = fmt("Your squad is being sent on a mission to ＀ by Nanotrasen's Security Division.", [(yield* g.call(f, P("/proc/station_name"), null, []))]);
			if (isEqual(live(numagents), 1)) {
				missiondesc = rt.modify(live(missiondesc), " Lead your squad to ensure the completion of the mission. Board the shuttle when your team is ready.", add);
			} else {
				missiondesc = rt.modify(live(missiondesc), " Follow orders given to you by your squad leader.", add);
			}
			missiondesc = rt.modify(live(missiondesc), fmt("<BR><B>Your Mission</B>: ＀", [live(mission)]), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(Commando), live(missiondesc)]);
			if (truthy(rt.fv(f, "enforce_human_authority", rt.gl("config")))) {
				yield* g.callName(f, live(Commando), "set_species", [T("/datum/species/human")]);
			}
			if (isEqual(live(numagents), 1)) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("The deathsquad has spawned with the mission: ＀.", [live(mission)])]);
			}
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been selected as a Death Commando", [(yield* g.call(f, P("/proc/key_name"), null, [live(Commando)]))])]);
			numagents = rt.inc(live(numagents), -1);
			squadSpawned = rt.inc(live(squadSpawned), 1);
		}
		if (truthy(live(squadSpawned))) {
			return 1;
		} else {
			return 0;
		}
	}
	return live(f.dot);
}, true);

// a spawn(0) body of /datum/admins/proc/makeDeathsquad, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/makeDeathsquad: spawn at modules/admin/verbs/one_click_antag.dm:322", function* (f: Frame, mission: Value, candidates: Value, squadSpawned: Value, numagents: Value, spawnpoints: Value, spawnloc: Value, chosen_candidate: Value, Commando: Value, door: Value, missionobj: Value, missiondesc: Value) {
	f.vars = () => [mission, candidates, squadSpawned, numagents, spawnpoints, spawnloc, chosen_candidate, Commando, door, missionobj, missiondesc];
	yield* g.callName(f, live(door), "open", []);
	return null;
});

// /datum/admins/proc/makeGangsters  (code/modules/admin/verbs/one_click_antag.dm:364)  may sleep
rt.def("/datum/admins/proc/makeGangsters", function* makeGangsters(f: Frame) {
	let temp: Value = null, candidates: Value = null, H: Value = null, applicant: Value = null, _T: Value = null, needs_assigned: Value = null, newgang: Value = null;
	let $e: any;
	f.vars = () => [temp, candidates, H, applicant, _T, needs_assigned, newgang, $e];
	temp = (yield* g.new_(f, T("/datum/game_mode/gang"), []));
	if (truthy(rt.fv(f, "protect_roles_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", rt.fv(f, "protected_jobs", live(temp)), add);
	}
	if (truthy(rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config")))) {
		rt.modField(f, live(temp), "restricted_jobs", "Assistant", add);
	}
	candidates = rt.list();
	H = null;
	applicant = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		applicant = $e;
		if (truthy((rt.isIn(f, "gangster", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(applicant))))) ? 1 : 0))) {
			_T = rt.getStep(f, live(applicant), 0);
			if ((((isEqual(rt.fv(f, "stat", live(applicant)), 0) && truthy(rt.fv(f, "mind", live(applicant)))) && !truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(applicant))))) && isEqual(rt.fv(f, "z", live(_T)), 2))) {
				if ((!truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "gangster"]))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(applicant), "Syndicate"]))))) {
					if (!truthy((rt.isIn(f, rt.fv(f, "job", live(applicant)), rt.fv(f, "restricted_jobs", live(temp))) ? 1 : 0))) {
						candidates = rt.modify(live(candidates), live(applicant), add);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(rt.len(f, live(candidates)), 2)) {
		needs_assigned = null;
		needs_assigned = 2;
		while (rt.gt(live(needs_assigned), 0)) {
			H = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
			if (truthy(rt.len(f, rt.gl("gang_colors_pool")))) {
				newgang = (yield* g.new_(f, T("/datum/gang"), []));
				rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "gangs", live(newgang), add);
				yield* g.callName(f, rt.fv(f, "mind", live(H)), "make_Gang", [live(newgang)]);
				yield* g.callName(f, live(candidates), "Remove", [live(H)]);
			} else {
				if (isEqual(live(needs_assigned), 2)) {
					return 0;
				}
			}
			needs_assigned = rt.inc(live(needs_assigned), -1);
		}
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeOfficial  (code/modules/admin/verbs/one_click_antag.dm:399)  may sleep
rt.def("/datum/admins/proc/makeOfficial", function* makeOfficial(f: Frame) {
	let mission: Value = null, candidates: Value = null, chosen_candidate: Value = null, newmob: Value = null, missionobj: Value = null;
	f.vars = () => [mission, candidates, chosen_candidate, newmob, missionobj];
	mission = (yield* g.op(f, "Prompt", [2], [null, fmt("Conduct a routine preformance review of ＀ and its Captain.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Assign Task", "Assign a task for the official", null]));
	if (truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, ["Do you wish to be considered to be a Centcom Official?", "deathsquad"])))))) {
		chosen_candidate = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		newmob = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.op(f, "PickUnweighted", [1], [rt.gl("emergencyresponseteamspawn")])]));
		yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(chosen_candidate))), "copy_to", [live(newmob)]);
		rt.setFv(f, "real_name", live(newmob), (yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(newmob))), "random_name", [rt.fv(f, "gender", live(newmob)), 1])));
		yield* g.callName(f, rt.fv(f, "dna", live(newmob)), "update_dna_identity", []);
		rt.setFv(f, "key", live(newmob), rt.fv(f, "key", live(chosen_candidate)));
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(newmob)), "Centcom Official");
		yield* g.callName(f, live(newmob), "equipOutfit", [T("/datum/outfit/centcom_official")]);
		rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(newmob)), add);
		rt.setFv(f, "special_role", rt.fv(f, "mind", live(newmob)), "official");
		rt.setFv(f, "owner", (missionobj = (yield* g.new_(f, T("/datum/objective"), []))), rt.fv(f, "mind", live(newmob)));
		rt.setFv(f, "explanation_text", live(missionobj), live(mission));
		rt.setFv(f, "completed", live(missionobj), 1);
		rt.modField(f, rt.fv(f, "mind", live(newmob)), "objectives", live(missionobj), add);
		if (truthy(rt.fv(f, "enforce_human_authority", rt.gl("config")))) {
			yield* g.callName(f, live(newmob), "set_species", [T("/datum/species/human")]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(newmob), "<B><font size=3 color=red>You are a Centcom Official.</font></B>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(newmob), fmt("<BR>Central Command is sending you to ＀ with the task: ＀", [(yield* g.call(f, P("/proc/station_name"), null, [])), live(mission)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Centcom Official ＀ has spawned with the task: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(newmob)])), live(mission)])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been selected as a Centcom Official", [(yield* g.call(f, P("/proc/key_name"), null, [live(newmob)]))])]);
		return 1;
	}
	return 0;
}, true);

// /datum/admins/proc/makeEmergencyresponseteam  (code/modules/admin/verbs/one_click_antag.dm:440)  may sleep
rt.def("/datum/admins/proc/makeEmergencyresponseteam", function* makeEmergencyresponseteam(f: Frame) {
	let alert: Value = null, teamcheck: Value = null, teamsize: Value = null, mission: Value = null, candidates: Value = null, teamSpawned: Value = null, numagents: Value = null, redalert: Value = null, spawnpoints: Value = null, spawnloc: Value = null, chosen_candidate: Value = null, ERTOperative: Value = null, lastname: Value = null, ertname: Value = null, door: Value = null, missionobj: Value = null, missiondesc: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [alert, teamcheck, teamsize, mission, candidates, teamSpawned, numagents, redalert, spawnpoints, spawnloc, chosen_candidate, ERTOperative, lastname, ertname, door, missionobj, missiondesc, $0, $1, $e];
	if (!truthy((alert = (yield* g.op(f, "Prompt", [1], [null, null, "Select Response Level", "Which team should we send?", rt.list("Green: Centcom Official", "Blue: Light ERT (No Armoury Access)", "Amber: Full ERT (Armoury Access)", "Red: Elite ERT (Armoury Access + Pulse Weapons)", "Delta: Deathsquad")]))))) {
		return live(f.dot);
	}
	$0 = live(alert);
	if ($0 === "Delta: Deathsquad") {
		return (yield* g.srcCall(f, "makeDeathsquad"));
	} else if ($0 === "Red: Elite ERT (Armoury Access + Pulse Weapons)") {
		alert = "Red";
	} else if ($0 === "Amber: Full ERT (Armoury Access)") {
		alert = "Amber";
	} else if ($0 === "Blue: Light ERT (No Armoury Access)") {
		alert = "Blue";
	} else if ($0 === "Green: Centcom Official") {
		return (yield* g.srcCall(f, "makeOfficial"));
	}
	if ((teamcheck = (yield* g.op(f, "Prompt", [33], [null, 4, "Select Team Size", "Maximum size of team? (7 max)", null]))) === null) {
		return live(f.dot);
	}
	teamsize = (yield* g.call(f, P("/proc/min"), null, [7, live(teamcheck)]));
	if (!truthy((mission = (yield* g.op(f, "Prompt", [3], [null, "Assist the station.", "Assign Mission", "Assign a mission to the Emergency Response Team", null]))))) {
		return live(f.dot);
	}
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you wish to be considered for a Code ＀ Nanotrasen Emergency Response Team?", [live(alert)]), "deathsquad", null]));
	teamSpawned = 0;
	if (rt.gt(rt.len(f, live(candidates)), 0)) {
		numagents = (yield* g.call(f, P("/proc/min"), null, [live(teamsize), rt.len(f, live(candidates))]));
		redalert = null;
		if (isEqual(live(alert), "Red")) {
			numagents = (yield* g.call(f, P("/proc/min"), null, [live(teamsize), rt.len(f, live(candidates))]));
			redalert = 1;
		}
		spawnpoints = rt.gl("emergencyresponseteamspawn");
		while (truthy(live(numagents)) && truthy(rt.len(f, live(candidates)))) {
			if (rt.gt(live(numagents), rt.len(f, live(spawnpoints)))) {
				numagents = rt.inc(live(numagents), -1);
				continue;
			}
			spawnloc = rt.index(live(spawnpoints), live(numagents));
			(candidates = rt.modify(live(candidates), (chosen_candidate = rt.op(f, "PickUnweighted", [1], [live(candidates)])), subtract));
			if (!truthy(rt.fv(f, "key", live(chosen_candidate)))) {
				continue;
			}
			ERTOperative = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(spawnloc)]));
			lastname = rt.gl("last_names");
			yield* g.callName(f, rt.gv(f, "prefs", rt.fv(f, "client", live(chosen_candidate))), "copy_to", [live(ERTOperative)]);
			ertname = rt.op(f, "PickUnweighted", [1], [live(lastname)]);
			$0 = live(numagents);
			if ($0 === 1) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Commander ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/commander/alert");
				} else {
					$1 = T("/datum/outfit/ert/commander");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			} else if ($0 === 2) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Security Officer ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/security/alert");
				} else {
					$1 = T("/datum/outfit/ert/security");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			} else if ($0 === 3) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Medical Officer ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/medic/alert");
				} else {
					$1 = T("/datum/outfit/ert/medic");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			} else if ($0 === 4) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Engineer ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/engineer/alert");
				} else {
					$1 = T("/datum/outfit/ert/engineer");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			} else if ($0 === 5) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Security Officer ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/security/alert");
				} else {
					$1 = T("/datum/outfit/ert/security");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			} else if ($0 === 6) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Medical Officer ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/medic/alert");
				} else {
					$1 = T("/datum/outfit/ert/medic");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			} else if ($0 === 7) {
				rt.setFv(f, "real_name", live(ERTOperative), fmt("Engineer ＀", [live(ertname)]));
				$0 = live(ERTOperative);
				if (truthy(live(redalert))) {
					$1 = T("/datum/outfit/ert/engineer/alert");
				} else {
					$1 = T("/datum/outfit/ert/engineer");
				}
				yield* g.callName(f, $0, "equipOutfit", [$1]);
			}
			yield* g.callName(f, rt.fv(f, "dna", live(ERTOperative)), "update_dna_identity", []);
			rt.setFv(f, "key", live(ERTOperative), rt.fv(f, "key", live(chosen_candidate)));
			rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(ERTOperative)), "ERT");
			if (!isEqual(live(alert), "Blue")) {
				door = null;
				rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door/poddoor/ert"));
				while (($e = rt.next(f, 0)) !== undefined) {
					door = $e;
					rt.spawnTail(f, 0, "/datum/admins/proc/makeEmergencyresponseteam: spawn at modules/admin/verbs/one_click_antag.dm:516", alert, teamcheck, teamsize, mission, candidates, teamSpawned, numagents, redalert, spawnpoints, spawnloc, chosen_candidate, ERTOperative, lastname, ertname, door, missionobj, missiondesc);
				}
				rt.endFor(f, 0);
			}
			rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(ERTOperative)), add);
			rt.setFv(f, "special_role", rt.fv(f, "mind", live(ERTOperative)), "ERT");
			rt.setFv(f, "owner", (missionobj = (yield* g.new_(f, T("/datum/objective"), []))), rt.fv(f, "mind", live(ERTOperative)));
			rt.setFv(f, "explanation_text", live(missionobj), live(mission));
			rt.setFv(f, "completed", live(missionobj), 1);
			rt.modField(f, rt.fv(f, "mind", live(ERTOperative)), "objectives", live(missionobj), add);
			$0 = live(ERTOperative);
			if (isEqual(live(numagents), 1)) {
				$1 = "the Emergency Response Team Commander";
			} else {
				$1 = "an Emergency Response Officer";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<B><font size=3 color=red>You are ＀.</font></B>", [$1])]);
			missiondesc = fmt("Your squad is being sent on a Code ＀ mission to ＀ by Nanotrasen's Security Division.", [live(alert), (yield* g.call(f, P("/proc/station_name"), null, []))]);
			if (isEqual(live(numagents), 1)) {
				missiondesc = rt.modify(live(missiondesc), " Lead your squad to ensure the completion of the mission. Avoid civilian casualites when possible. Board the shuttle when your team is ready.", add);
			} else {
				missiondesc = rt.modify(live(missiondesc), " Follow orders given to you by your commander. Avoid civilian casualites when possible.", add);
			}
			missiondesc = rt.modify(live(missiondesc), fmt("<BR><B>Your Mission</B>: ＀", [live(mission)]), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(ERTOperative), live(missiondesc)]);
			if (truthy(rt.fv(f, "enforce_human_authority", rt.gl("config")))) {
				yield* g.callName(f, live(ERTOperative), "set_species", [T("/datum/species/human")]);
			}
			if (isEqual(live(numagents), 1)) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("A Code ＀ emergency response team has spawned with the mission: ＀", [live(alert), live(mission)])]);
			}
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been selected as an Emergency Response Officer", [(yield* g.call(f, P("/proc/key_name"), null, [live(ERTOperative)]))])]);
			numagents = rt.inc(live(numagents), -1);
			teamSpawned = rt.inc(live(teamSpawned), 1);
		}
		if (truthy(live(teamSpawned))) {
			return 1;
		} else {
			return 0;
		}
	}
	return live(f.dot);
}, true);

// a spawn(0) body of /datum/admins/proc/makeEmergencyresponseteam, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/makeEmergencyresponseteam: spawn at modules/admin/verbs/one_click_antag.dm:516", function* (f: Frame, alert: Value, teamcheck: Value, teamsize: Value, mission: Value, candidates: Value, teamSpawned: Value, numagents: Value, redalert: Value, spawnpoints: Value, spawnloc: Value, chosen_candidate: Value, ERTOperative: Value, lastname: Value, ertname: Value, door: Value, missionobj: Value, missiondesc: Value) {
	f.vars = () => [alert, teamcheck, teamsize, mission, candidates, teamSpawned, numagents, redalert, spawnpoints, spawnloc, chosen_candidate, ERTOperative, lastname, ertname, door, missionobj, missiondesc];
	yield* g.callName(f, live(door), "open", []);
	return null;
});

// /datum/admins/proc/makeAbductorTeam  (code/modules/admin/verbs/one_click_antag.dm:557)
rt.def("/datum/admins/proc/makeAbductorTeam", function makeAbductorTeam(f: Frame) {
	rt.new_(f, T("/datum/round_event/ghost_role/abductor"), []);
	return 1;
});

// /datum/admins/proc/makeRevenant  (code/modules/admin/verbs/one_click_antag.dm:561)
rt.def("/datum/admins/proc/makeRevenant", function makeRevenant(f: Frame) {
	rt.new_(f, T("/datum/round_event/ghost_role/revenant"), [1, 1]);
	return 1;
});
