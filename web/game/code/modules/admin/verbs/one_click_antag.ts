// Based on /tg/station's code/modules/admin/verbs/one_click_antag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// one_click_antag.dm:7
rt.def("/client/proc/one_click_antag", function* one_click_antag(f: Frame) {
	if (this.holder) {
		yield* this.holder.one_click_antag();
	}
	return f.dot;
}, true, { verb: { name: "Create Antagonist", category: "Admin", desc: "Auto-create an antagonist of your choice" } });

// one_click_antag.dm:13
rt.def("/datum/admins/proc/one_click_antag", function* one_click_antag(f: Frame) {
	let popup: Value = null;
	let dat: Value = fmt("\n\t\t<a href='?src=＃;makeAntag=traitors'>Make Traitors</a><br>\n\t\t<a href='?src=＃;makeAntag=changelings'>Make Changelings</a><br>\n\t\t<a href='?src=＃;makeAntag=revs'>Make Revs</a><br>\n\t\t<a href='?src=＃;makeAntag=cult'>Make Cult</a><br>\n\t\t<a href='?src=＃;makeAntag=clockcult'>Make Clockwork Cult</a><br>\n\t\t<a href='?src=＃;makeAntag=blob'>Make Blob</a><br>\n\t\t<a href='?src=＃;makeAntag=gangs'>Make Gangsters</a><br>\n\t\t<a href='?src=＃;makeAntag=wizard'>Make Wizard (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=nukeops'>Make Nuke Team (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=centcom'>Make Centcom Response Team (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=abductors'>Make Abductor Team (Requires Ghosts)</a><br>\n\t\t<a href='?src=＃;makeAntag=revenant'>Make Revenant (Requires Ghost)</a><br>\n\t\t", [this, this, this, this, this, this, this, this, this, this, this, this]);
	(popup = (yield* new_(T("/datum/browser"), f.usr, "oneclickantag", "Quick-Create Antagonist", 400, 400))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// one_click_antag.dm:33
rt.def("/datum/admins/proc/makeTraitors", function* makeTraitors(f: Frame) {
	let H: Value = null, applicant: Value = null, numTraitors: Value = null, i: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/traitor")));
	if (GLOB.config.protect_roles_from_antagonist) {
		temp.restricted_jobs += temp.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		temp.restricted_jobs += "Assistant";
	}
	let candidates: Value = list();
	for (applicant of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, "traitor", applicant.client.prefs.be_special)) {
			if (!applicant.stat) {
				if (applicant.mind) {
					if (!applicant.mind.special_role) {
						if (!jobban_isbanned(applicant, "traitor") && !jobban_isbanned(applicant, "Syndicate")) {
							if (!rt.isIn(f, applicant.job, temp.restricted_jobs)) {
								candidates += applicant;
							}
						}
					}
				}
			}
		}
	}
	if (rt.len(f, candidates)) {
		numTraitors = min(rt.len(f, candidates), 3);
		i = 0;
		while (i < numTraitors) {
			yield* (H = pick(candidates)).mind.make_Traitor();
			yield* candidates.Remove(H);
			i++;
		}
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:70
rt.def("/datum/admins/proc/makeChanglings", function* makeChanglings(f: Frame) {
	let H: Value = null, applicant: Value = null, _T: Value = null, numChanglings: Value = null, i: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/changeling")));
	if (GLOB.config.protect_roles_from_antagonist) {
		temp.restricted_jobs += temp.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		temp.restricted_jobs += "Assistant";
	}
	let candidates: Value = list();
	for (applicant of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, "changeling", applicant.client.prefs.be_special)) {
			_T = rt.getStep(f, applicant, 0);
			if (applicant.stat == 0 && applicant.mind && !applicant.mind.special_role && _T.z == 2) {
				if (!jobban_isbanned(applicant, "changeling") && !jobban_isbanned(applicant, "Syndicate")) {
					if (!rt.isIn(f, applicant.job, temp.restricted_jobs)) {
						candidates += applicant;
					}
				}
			}
		}
	}
	if (rt.len(f, candidates)) {
		numChanglings = min(rt.len(f, candidates), 3);
		i = 0;
		while (i < numChanglings) {
			yield* (H = pick(candidates)).mind.make_Changling();
			yield* candidates.Remove(H);
			i++;
		}
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:103
rt.def("/datum/admins/proc/makeRevs", function* makeRevs(f: Frame) {
	let H: Value = null, applicant: Value = null, _T: Value = null, numRevs: Value = null, i: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/revolution")));
	if (GLOB.config.protect_roles_from_antagonist) {
		temp.restricted_jobs += temp.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		temp.restricted_jobs += "Assistant";
	}
	let candidates: Value = list();
	for (applicant of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, "revolutionary", applicant.client.prefs.be_special)) {
			_T = rt.getStep(f, applicant, 0);
			if (applicant.stat == 0 && applicant.mind && !applicant.mind.special_role && _T.z == 2) {
				if (!jobban_isbanned(applicant, "revolutionary") && !jobban_isbanned(applicant, "Syndicate")) {
					if (!rt.isIn(f, applicant.job, temp.restricted_jobs)) {
						candidates += applicant;
					}
				}
			}
		}
	}
	if (rt.len(f, candidates)) {
		numRevs = min(rt.len(f, candidates), 3);
		i = 0;
		while (i < numRevs) {
			yield* (H = pick(candidates)).mind.make_Rev();
			yield* candidates.Remove(H);
			i++;
		}
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:135
rt.def("/datum/admins/proc/makeWizard", function* makeWizard(f: Frame) {
	let new_character: Value = null;
	let candidates: Value = (yield* pollGhostCandidates("Do you wish to be considered for the position of a Wizard Foundation 'diplomat'?", "wizard", null));
	let selected: Value = pick_n_take(candidates);
	yield* (new_character = (yield* makeBody(selected))).mind.make_Wizard();
	return 1;
}, true);

// one_click_antag.dm:145
rt.def("/datum/admins/proc/makeCult", function* makeCult(f: Frame) {
	let H: Value = null, applicant: Value = null, _T: Value = null, numCultists: Value = null, i: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/cult")));
	if (GLOB.config.protect_roles_from_antagonist) {
		temp.restricted_jobs += temp.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		temp.restricted_jobs += "Assistant";
	}
	let candidates: Value = list();
	for (applicant of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, "cultist", applicant.client.prefs.be_special)) {
			_T = rt.getStep(f, applicant, 0);
			if (applicant.stat == 0 && applicant.mind && !applicant.mind.special_role && _T.z == 2) {
				if (!jobban_isbanned(applicant, "cultist") && !jobban_isbanned(applicant, "Syndicate")) {
					if (!rt.isIn(f, applicant.job, temp.restricted_jobs)) {
						candidates += applicant;
					}
				}
			}
		}
	}
	if (rt.len(f, candidates)) {
		numCultists = min(rt.len(f, candidates), 4);
		i = 0;
		while (i < numCultists) {
			yield* (H = pick(candidates)).mind.make_Cultist();
			yield* candidates.Remove(H);
			i++;
		}
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:178
rt.def("/datum/admins/proc/makeClockCult", function* makeClockCult(f: Frame) {
	let H: Value = null, applicant: Value = null, _T: Value = null, numCultists: Value = null, i: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/clockwork_cult")));
	if (GLOB.config.protect_roles_from_antagonist) {
		temp.restricted_jobs += temp.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		temp.restricted_jobs += "Assistant";
	}
	let candidates: Value = list();
	for (applicant of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, "servant of Ratvar", applicant.client.prefs.be_special)) {
			_T = rt.getStep(f, applicant, 0);
			if (applicant.stat == 0 && applicant.mind && !applicant.mind.special_role && _T.z == 2) {
				if (!jobban_isbanned(applicant, "servant of Ratvar") && !jobban_isbanned(applicant, "Syndicate")) {
					if (!rt.isIn(f, applicant.job, temp.restricted_jobs)) {
						candidates += applicant;
					}
				}
			}
		}
	}
	if (rt.len(f, candidates)) {
		numCultists = min(rt.len(f, candidates), 4);
		i = 0;
		while (i < numCultists) {
			to_chat((H = pick(candidates)), "<span class='heavy_brass'>The world before you suddenly glows a brilliant yellow. You hear the whooshing steam and clanking cogs of a billion billion machines, and all at once you see the truth. Ratvar, the Clockwork Justiciar, lies derelict and forgotten in an unseen realm, and he has selected you as one of his harbringers. You are now a servant of Ratvar, and you will bring him back.</span>");
			yield* H.playsound_local(rt.getStep(f, H, 0), rt.rsc("sound/ambience/antag/clockcultalr.ogg"), 100, 0, { pressure_affected: 0 });
			yield* add_servant_of_ratvar(H, 1);
			yield* GLOB.SSticker.mode.equip_servant(H);
			yield* candidates.Remove(H);
			i++;
		}
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:218
rt.def("/datum/admins/proc/makeNukeTeam", function* makeNukeTeam(f: Frame) {
	let theghost: Value = null, numagents: Value = null, agentcount: Value = null, i: Value = null, j: Value = null, nuke_code: Value = null, nuke: Value = null, synd_spawn: Value = null, A: Value = null, leader_chosen: Value = null, spawnpos: Value = null, c: Value = null, new_character: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/nuclear")));
	let candidates: Value = (yield* pollGhostCandidates("Do you wish to be considered for a nuke team being sent in?", "operative", temp));
	let chosen: Value = list();
	if (rt.len(f, candidates)) {
		numagents = 5;
		agentcount = 0;
		i = 0;
		while (i < numagents) {
			shuffle_inplace(candidates);
			j = null;
			for (j of each(candidates, T("/mob"))) {
				if (!j || !j.client) {
					yield* candidates.Remove(j);
					continue;
				}
				theghost = j;
				yield* candidates.Remove(theghost);
				chosen += theghost;
				agentcount++;
				break;
			}
			i++;
		}
		if (agentcount < 3) {
			return 0;
		}
		nuke_code = random_nukecode();
		if (nuke = rt.locateIn(f, "syndienuke", GLOB.nuke_list)) {
			nuke.r_code = nuke_code;
		}
		synd_spawn = list();
		for (A of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
			if (A.name == "Syndicate-Spawn") {
				synd_spawn += rt.getStep(f, A, 0);
				continue;
			}
		}
		spawnpos = 1;
		for (c of each(chosen, T("/mob"))) {
			if (spawnpos > rt.len(f, synd_spawn)) {
				spawnpos = 2;
			}
			new_character = (yield* makeBody(c));
			if (!leader_chosen) {
				leader_chosen = 1;
				yield* new_character.mind.make_Nuke(rt.index(synd_spawn, spawnpos), nuke_code, 1);
			} else {
				yield* new_character.mind.make_Nuke(rt.index(synd_spawn, spawnpos), nuke_code);
			}
			spawnpos++;
		}
		return 1;
	} else {
		return 0;
	}
}, true);

// one_click_antag.dm:278
rt.def("/datum/admins/proc/makeAliens", function makeAliens(f: Frame) {
	let E: Value = null;
	(E = new_(T("/datum/round_event/ghost_role/alien_infestation"), 0)).spawncount = 3;
	E.processing = 1;
	return 1;
});

// one_click_antag.dm:286
rt.def("/datum/admins/proc/makeSpaceNinja", function makeSpaceNinja(f: Frame) {
	new_(T("/datum/round_event/ghost_role/ninja"));
	return 1;
});

// one_click_antag.dm:291
rt.def("/datum/admins/proc/makeDeathsquad", function* makeDeathsquad(f: Frame) {
	let numagents: Value = null, spawnpoints: Value = null, spawnloc: Value = null, chosen_candidate: Value = null, Commando: Value = null, door: Value = null, missionobj: Value = null, missiondesc: Value = null;
	let $0: any, $1: any, $e: any;
	let mission: Value = (yield* g.op(f, "Prompt", [2], [null, "Leave no witnesses.", "Assign Mission", "Assign a mission to the deathsquad", null]));
	let candidates: Value = (yield* pollGhostCandidates("Do you wish to be considered for an elite Nanotrasen Strike Team?", "deathsquad", null));
	let squadSpawned: Value = 0;
	if (rt.len(f, candidates) >= 2) {
		numagents = min(5, rt.len(f, candidates));
		spawnpoints = GLOB.emergencyresponseteamspawn;
		while (numagents && rt.len(f, candidates)) {
			if (numagents > rt.len(f, spawnpoints)) {
				numagents--;
				continue;
			}
			spawnloc = rt.index(spawnpoints, numagents);
			candidates -= (chosen_candidate = pick(candidates));
			if (!chosen_candidate.key) {
				continue;
			}
			Commando = (yield* new_(T("/mob/living/carbon/human"), spawnloc));
			yield* chosen_candidate.client.prefs.copy_to(Commando);
			if (numagents == 1) {
				Commando.real_name = `Officer ${pick(GLOB.commando_names)}`;
				yield* Commando.equipOutfit(T("/datum/outfit/death_commando/officer"));
			} else {
				Commando.real_name = `Trooper ${pick(GLOB.commando_names)}`;
				yield* Commando.equipOutfit(T("/datum/outfit/death_commando"));
			}
			yield* Commando.dna.update_dna_identity();
			Commando.key = chosen_candidate.key;
			Commando.mind.assigned_role = "Death Commando";
			door = null;
			for (door of each(GLOB.airlocks, T("/obj/machinery/door/poddoor/ert"))) {
				rt.spawnTail(f, 0, "/datum/admins/proc/makeDeathsquad: spawn at modules/admin/verbs/one_click_antag.dm:322", mission, candidates, squadSpawned, numagents, spawnpoints, spawnloc, chosen_candidate, Commando, door, missionobj, missiondesc);
			}
			GLOB.SSticker.mode.traitors += Commando.mind;
			Commando.mind.special_role = "deathsquad";
			(missionobj = (yield* new_(T("/datum/objective")))).owner = Commando.mind;
			missionobj.explanation_text = mission;
			missionobj.completed = 1;
			Commando.mind.objectives += missionobj;
			$0 = Commando;
			if (numagents == 1) {
				$1 = "Deathsquad Officer";
			} else {
				$1 = "Death Commando";
			}
			to_chat($0, `<B><font size=3 color=red>You are the ${$1}.</font></B>`);
			missiondesc = `Your squad is being sent on a mission to ${station_name()} by Nanotrasen's Security Division.`;
			if (numagents == 1) {
				missiondesc += " Lead your squad to ensure the completion of the mission. Board the shuttle when your team is ready.";
			} else {
				missiondesc += " Follow orders given to you by your squad leader.";
			}
			missiondesc += `<BR><B>Your Mission</B>: ${mission}`;
			to_chat(Commando, missiondesc);
			if (GLOB.config.enforce_human_authority) {
				yield* Commando.set_species(T("/datum/species/human"));
			}
			if (numagents == 1) {
				message_admins(`The deathsquad has spawned with the mission: ${mission}.`);
			}
			log_game(`${key_name(Commando)} has been selected as a Death Commando`);
			numagents--;
			squadSpawned++;
		}
		if (squadSpawned) {
			return 1;
		} else {
			return 0;
		}
	}
	return f.dot;
}, true);

// a spawn(0) body of /datum/admins/proc/makeDeathsquad, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/makeDeathsquad: spawn at modules/admin/verbs/one_click_antag.dm:322", function* (f: Frame, mission: Value, candidates: Value, squadSpawned: Value, numagents: Value, spawnpoints: Value, spawnloc: Value, chosen_candidate: Value, Commando: Value, door: Value, missionobj: Value, missiondesc: Value) {
	yield* door.open();
	return null;
});

// one_click_antag.dm:364
rt.def("/datum/admins/proc/makeGangsters", function* makeGangsters(f: Frame) {
	let H: Value = null, applicant: Value = null, _T: Value = null, needs_assigned: Value = null, newgang: Value = null;
	let temp: Value = (yield* new_(T("/datum/game_mode/gang")));
	if (GLOB.config.protect_roles_from_antagonist) {
		temp.restricted_jobs += temp.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		temp.restricted_jobs += "Assistant";
	}
	let candidates: Value = list();
	for (applicant of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, "gangster", applicant.client.prefs.be_special)) {
			_T = rt.getStep(f, applicant, 0);
			if (applicant.stat == 0 && applicant.mind && !applicant.mind.special_role && _T.z == 2) {
				if (!jobban_isbanned(applicant, "gangster") && !jobban_isbanned(applicant, "Syndicate")) {
					if (!rt.isIn(f, applicant.job, temp.restricted_jobs)) {
						candidates += applicant;
					}
				}
			}
		}
	}
	if (rt.len(f, candidates) >= 2) {
		needs_assigned = 2;
		while (needs_assigned > 0) {
			H = pick(candidates);
			if (rt.len(f, GLOB.gang_colors_pool)) {
				newgang = (yield* new_(T("/datum/gang")));
				GLOB.SSticker.mode.gangs += newgang;
				yield* H.mind.make_Gang(newgang);
				yield* candidates.Remove(H);
			} else if (needs_assigned == 2) {
				return 0;
			}
			needs_assigned--;
		}
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:399
rt.def("/datum/admins/proc/makeOfficial", function* makeOfficial(f: Frame) {
	let candidates: Value = null, chosen_candidate: Value = null, newmob: Value = null, missionobj: Value = null;
	let mission: Value = (yield* g.op(f, "Prompt", [2], [null, `Conduct a routine preformance review of ${station_name()} and its Captain.`, "Assign Task", "Assign a task for the official", null]));
	if (rt.len(f, (candidates = (yield* pollGhostCandidates("Do you wish to be considered to be a Centcom Official?", "deathsquad"))))) {
		chosen_candidate = pick(candidates);
		newmob = (yield* new_(T("/mob/living/carbon/human"), pick(GLOB.emergencyresponseteamspawn)));
		yield* chosen_candidate.client.prefs.copy_to(newmob);
		newmob.real_name = newmob.dna.species.random_name(newmob.gender, 1);
		yield* newmob.dna.update_dna_identity();
		newmob.key = chosen_candidate.key;
		newmob.mind.assigned_role = "Centcom Official";
		yield* newmob.equipOutfit(T("/datum/outfit/centcom_official"));
		GLOB.SSticker.mode.traitors += newmob.mind;
		newmob.mind.special_role = "official";
		(missionobj = (yield* new_(T("/datum/objective")))).owner = newmob.mind;
		missionobj.explanation_text = mission;
		missionobj.completed = 1;
		newmob.mind.objectives += missionobj;
		if (GLOB.config.enforce_human_authority) {
			yield* newmob.set_species(T("/datum/species/human"));
		}
		to_chat(newmob, "<B><font size=3 color=red>You are a Centcom Official.</font></B>");
		to_chat(newmob, `<BR>Central Command is sending you to ${station_name()} with the task: ${mission}`);
		message_admins(`Centcom Official ${key_name_admin(newmob)} has spawned with the task: ${mission}`);
		log_game(`${key_name(newmob)} has been selected as a Centcom Official`);
		return 1;
	}
	return 0;
}, true);

// one_click_antag.dm:440
rt.def("/datum/admins/proc/makeEmergencyresponseteam", function* makeEmergencyresponseteam(f: Frame) {
	let alert: Value = null, teamcheck: Value = null, mission: Value = null, numagents: Value = null, redalert: Value = null, spawnpoints: Value = null, spawnloc: Value = null, chosen_candidate: Value = null, ERTOperative: Value = null, lastname: Value = null, ertname: Value = null, door: Value = null, missionobj: Value = null, missiondesc: Value = null;
	let $0: any, $1: any, $e: any;
	if (!(alert = (yield* g.op(f, "Prompt", [1], [null, null, "Select Response Level", "Which team should we send?", list("Green: Centcom Official", "Blue: Light ERT (No Armoury Access)", "Amber: Full ERT (Armoury Access)", "Red: Elite ERT (Armoury Access + Pulse Weapons)", "Delta: Deathsquad")])))) {
		return f.dot;
	}
	if (alert === "Delta: Deathsquad") {
		return (yield* this.makeDeathsquad());
	} else if (alert === "Red: Elite ERT (Armoury Access + Pulse Weapons)") {
		alert = "Red";
	} else if (alert === "Amber: Full ERT (Armoury Access)") {
		alert = "Amber";
	} else if (alert === "Blue: Light ERT (No Armoury Access)") {
		alert = "Blue";
	} else if (alert === "Green: Centcom Official") {
		return (yield* this.makeOfficial());
	}
	if ((teamcheck = (yield* g.op(f, "Prompt", [33], [null, 4, "Select Team Size", "Maximum size of team? (7 max)", null]))) === null) {
		return f.dot;
	}
	let teamsize: Value = min(7, teamcheck);
	if (!(mission = (yield* g.op(f, "Prompt", [3], [null, "Assist the station.", "Assign Mission", "Assign a mission to the Emergency Response Team", null])))) {
		return f.dot;
	}
	let candidates: Value = (yield* pollGhostCandidates(`Do you wish to be considered for a Code ${alert} Nanotrasen Emergency Response Team?`, "deathsquad", null));
	let teamSpawned: Value = 0;
	if (rt.len(f, candidates) > 0) {
		numagents = min(teamsize, rt.len(f, candidates));
		if (alert == "Red") {
			numagents = min(teamsize, rt.len(f, candidates));
			redalert = 1;
		}
		spawnpoints = GLOB.emergencyresponseteamspawn;
		while (numagents && rt.len(f, candidates)) {
			if (numagents > rt.len(f, spawnpoints)) {
				numagents--;
				continue;
			}
			spawnloc = rt.index(spawnpoints, numagents);
			candidates -= (chosen_candidate = pick(candidates));
			if (!chosen_candidate.key) {
				continue;
			}
			ERTOperative = (yield* new_(T("/mob/living/carbon/human"), spawnloc));
			lastname = GLOB.last_names;
			yield* chosen_candidate.client.prefs.copy_to(ERTOperative);
			ertname = pick(lastname);
			if (numagents === 1) {
				ERTOperative.real_name = `Commander ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/commander/alert");
				} else {
					$1 = T("/datum/outfit/ert/commander");
				}
				yield* $0.equipOutfit($1);
			} else if (numagents === 2) {
				ERTOperative.real_name = `Security Officer ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/security/alert");
				} else {
					$1 = T("/datum/outfit/ert/security");
				}
				yield* $0.equipOutfit($1);
			} else if (numagents === 3) {
				ERTOperative.real_name = `Medical Officer ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/medic/alert");
				} else {
					$1 = T("/datum/outfit/ert/medic");
				}
				yield* $0.equipOutfit($1);
			} else if (numagents === 4) {
				ERTOperative.real_name = `Engineer ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/engineer/alert");
				} else {
					$1 = T("/datum/outfit/ert/engineer");
				}
				yield* $0.equipOutfit($1);
			} else if (numagents === 5) {
				ERTOperative.real_name = `Security Officer ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/security/alert");
				} else {
					$1 = T("/datum/outfit/ert/security");
				}
				yield* $0.equipOutfit($1);
			} else if (numagents === 6) {
				ERTOperative.real_name = `Medical Officer ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/medic/alert");
				} else {
					$1 = T("/datum/outfit/ert/medic");
				}
				yield* $0.equipOutfit($1);
			} else if (numagents === 7) {
				ERTOperative.real_name = `Engineer ${ertname}`;
				$0 = ERTOperative;
				if (redalert) {
					$1 = T("/datum/outfit/ert/engineer/alert");
				} else {
					$1 = T("/datum/outfit/ert/engineer");
				}
				yield* $0.equipOutfit($1);
			}
			yield* ERTOperative.dna.update_dna_identity();
			ERTOperative.key = chosen_candidate.key;
			ERTOperative.mind.assigned_role = "ERT";
			if (alert != "Blue") {
				door = null;
				for (door of each(GLOB.airlocks, T("/obj/machinery/door/poddoor/ert"))) {
					rt.spawnTail(f, 0, "/datum/admins/proc/makeEmergencyresponseteam: spawn at modules/admin/verbs/one_click_antag.dm:516", alert, teamcheck, teamsize, mission, candidates, teamSpawned, numagents, redalert, spawnpoints, spawnloc, chosen_candidate, ERTOperative, lastname, ertname, door, missionobj, missiondesc);
				}
			}
			GLOB.SSticker.mode.traitors += ERTOperative.mind;
			ERTOperative.mind.special_role = "ERT";
			(missionobj = (yield* new_(T("/datum/objective")))).owner = ERTOperative.mind;
			missionobj.explanation_text = mission;
			missionobj.completed = 1;
			ERTOperative.mind.objectives += missionobj;
			$0 = ERTOperative;
			if (numagents == 1) {
				$1 = "the Emergency Response Team Commander";
			} else {
				$1 = "an Emergency Response Officer";
			}
			to_chat($0, `<B><font size=3 color=red>You are ${$1}.</font></B>`);
			missiondesc = `Your squad is being sent on a Code ${alert} mission to ${station_name()} by Nanotrasen's Security Division.`;
			if (numagents == 1) {
				missiondesc += " Lead your squad to ensure the completion of the mission. Avoid civilian casualites when possible. Board the shuttle when your team is ready.";
			} else {
				missiondesc += " Follow orders given to you by your commander. Avoid civilian casualites when possible.";
			}
			missiondesc += `<BR><B>Your Mission</B>: ${mission}`;
			to_chat(ERTOperative, missiondesc);
			if (GLOB.config.enforce_human_authority) {
				yield* ERTOperative.set_species(T("/datum/species/human"));
			}
			if (numagents == 1) {
				message_admins(`A Code ${alert} emergency response team has spawned with the mission: ${mission}`);
			}
			log_game(`${key_name(ERTOperative)} has been selected as an Emergency Response Officer`);
			numagents--;
			teamSpawned++;
		}
		if (teamSpawned) {
			return 1;
		} else {
			return 0;
		}
	}
	return f.dot;
}, true);

// a spawn(0) body of /datum/admins/proc/makeEmergencyresponseteam, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admins/proc/makeEmergencyresponseteam: spawn at modules/admin/verbs/one_click_antag.dm:516", function* (f: Frame, alert: Value, teamcheck: Value, teamsize: Value, mission: Value, candidates: Value, teamSpawned: Value, numagents: Value, redalert: Value, spawnpoints: Value, spawnloc: Value, chosen_candidate: Value, ERTOperative: Value, lastname: Value, ertname: Value, door: Value, missionobj: Value, missiondesc: Value) {
	yield* door.open();
	return null;
});

// one_click_antag.dm:557
rt.def("/datum/admins/proc/makeAbductorTeam", function makeAbductorTeam(f: Frame) {
	new_(T("/datum/round_event/ghost_role/abductor"));
	return 1;
});

// one_click_antag.dm:561
rt.def("/datum/admins/proc/makeRevenant", function makeRevenant(f: Frame) {
	new_(T("/datum/round_event/ghost_role/revenant"), 1, 1);
	return 1;
});
