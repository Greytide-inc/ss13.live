// Based on /tg/station's code/game/gamemodes/nuclear/nuclear.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


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

// nuclear.dm:26
rt.def("/datum/game_mode/nuclear/proc/pre_setup", function pre_setup(f: Frame) {
	let new_syndicate: Value = null, synd_mind: Value = null;
	let n_players: Value = this.num_players();
	let n_agents: Value = min(round(n_players / 10, 1), 5);
	if (rt.len(f, this.antag_candidates) < n_agents) {
		n_agents = rt.len(f, this.antag_candidates);
	}
	while (n_agents > 0) {
		this.syndicates += (new_syndicate = pick(this.antag_candidates));
		this.antag_candidates -= new_syndicate;
		n_agents--;
	}
	for (synd_mind of each(this.syndicates, T("/datum/mind"))) {
		synd_mind.assigned_role = "Syndicate";
		synd_mind.special_role = "Syndicate";
		log_game(`${synd_mind.key} (ckey) has been selected as a nuclear operative`);
	}
	return 1;
});

// nuclear.dm:49
rt.def("/datum/game_mode/proc/update_synd_icons_added", function update_synd_icons_added(f: Frame, synd_mind: Value) {
	let opshud: Value = null;
	(opshud = rt.index(GLOB.huds, ANTAG_HUD_OPS)).join_hud(synd_mind.current);
	this.set_antag_hud(synd_mind.current, "synd");
	return f.dot;
});

// nuclear.dm:54
rt.def("/datum/game_mode/proc/update_synd_icons_removed", function update_synd_icons_removed(f: Frame, synd_mind: Value) {
	let opshud: Value = null;
	(opshud = rt.index(GLOB.huds, ANTAG_HUD_OPS)).leave_hud(synd_mind.current);
	this.set_antag_hud(synd_mind.current, null);
	return f.dot;
});

// nuclear.dm:63
rt.def("/datum/game_mode/nuclear/proc/post_setup", function* post_setup(f: Frame) {
	let A: Value = null, synd_mind: Value = null, nuke: Value = null;
	let synd_spawn: Value = list();
	for (A of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
		if (A.name == "Syndicate-Spawn") {
			synd_spawn += rt.getStep(f, A, 0);
			continue;
		}
	}
	let nuke_code: Value = random_nukecode();
	let leader_selected: Value = 0;
	let agent_number: Value = 1;
	let spawnpos: Value = 1;
	for (synd_mind of each(this.syndicates, T("/datum/mind"))) {
		if (spawnpos > rt.len(f, synd_spawn)) {
			spawnpos = 2;
		}
		synd_mind.current.loc = rt.index(synd_spawn, spawnpos);
		this.forge_syndicate_objectives(synd_mind);
		this.greet_syndicate(synd_mind);
		yield* this.equip_syndicate(synd_mind.current);
		if (nuke_code) {
			synd_mind.store_memory(`<B>Syndicate Nuclear Bomb Code</B>: ${nuke_code}`, 0, 0);
			to_chat(synd_mind.current, `The nuclear authorization code is: <B>${nuke_code}</B>`);
		}
		if (!leader_selected) {
			yield* this.prepare_syndicate_leader(synd_mind, nuke_code);
			leader_selected = 1;
		} else {
			synd_mind.current.real_name = `${syndicate_name()} Operative #${agent_number}`;
			agent_number++;
		}
		spawnpos++;
		this.update_synd_icons_added(synd_mind);
		synd_mind.current.playsound_local(rt.getStep(f, synd_mind.current, 0), rt.rsc("sound/ambience/antag/ops.ogg"), 100, 0);
	}
	if (nuke = rt.locateIn(f, "syndienuke", GLOB.nuke_list)) {
		nuke.r_code = nuke_code;
	}
	return (yield* parent_proc());
}, true);

// nuclear.dm:105
rt.def("/datum/game_mode/proc/prepare_syndicate_leader", function* prepare_syndicate_leader(f: Frame, synd_mind: Value, nuke_code: Value) {
	let challenge: Value = null, foundIDs: Value = null, ID: Value = null, A: Value = null, _P: Value = null, H: Value = null;
	let leader_title: Value = pick("Czar", "Boss", "Commander", "Chief", "Kingpin", "Director", "Overlord");
	rt.spawnTail(f, 1, "/datum/game_mode/proc/prepare_syndicate_leader: spawn at game/gamemodes/nuclear/nuclear.dm:106", synd_mind, nuke_code, leader_title, challenge, foundIDs, ID, A, _P, H);
	synd_mind.current.real_name = `${syndicate_name()} ${leader_title}`;
	to_chat(synd_mind.current, `<B>You are the Syndicate ${leader_title} for this mission. You are responsible for the distribution of telecrystals and your ID is the only one who can open the launch bay doors.</B>`);
	to_chat(synd_mind.current, "<B>If you feel you are not up to this task, give your ID to another operative.</B>");
	to_chat(synd_mind.current, "<B>In your hand you will find a special item capable of triggering a greater challenge for your team. Examine it carefully and consult with your fellow operatives before activating it.</B>");
	challenge = (yield* new_(T("/obj/item/device/nuclear_challenge")));
	yield* synd_mind.current.put_in_hands_or_del(challenge);
	if (rt.len(f, (foundIDs = synd_mind.current.search_contents_for(T("/obj/item/weapon/card/id"))))) {
		for (ID of each(foundIDs, T("/obj/item/weapon/card/id"))) {
			ID.name = "lead agent card";
			ID.access += 151;
		}
	} else {
		message_admins("Warning: Nuke Ops spawned without access to leave their spawn area!");
	}
	if (A = rt.locateIn(f, T("/obj/item/device/radio/headset/syndicate/alt"), synd_mind.current)) {
		A.command = 1;
	}
	if (nuke_code) {
		(_P = (yield* new_(T("/obj/item/weapon/paper")))).info = `The nuclear authorization code is: <b>${nuke_code}</b>`;
		_P.name = "nuclear bomb code";
		H = synd_mind.current;
		_P.loc = H.loc;
		yield* H.put_in_hands_or_del(_P);
		yield* H.update_icons();
	} else {
		nuke_code = "code will be provided later";
	}
	return f.dot;
}, true);

// a spawn(1) body of /datum/game_mode/proc/prepare_syndicate_leader, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/game_mode/proc/prepare_syndicate_leader: spawn at game/gamemodes/nuclear/nuclear.dm:106", function* (f: Frame, synd_mind: Value, nuke_code: Value, leader_title: Value, challenge: Value, foundIDs: Value, ID: Value, A: Value, _P: Value, H: Value) {
	this.nukeops_lastname = (yield* nukelastname(synd_mind.current));
	NukeNameAssign(this.nukeops_lastname, this.syndicates);
	return null;
});

// nuclear.dm:144
rt.def("/datum/game_mode/proc/forge_syndicate_objectives", function forge_syndicate_objectives(f: Frame, syndicate: Value) {
	let syndobj: Value = null;
	(syndobj = new_(T("/datum/objective/nuclear"))).owner = syndicate;
	syndicate.objectives += syndobj;
	return f.dot;
});

// nuclear.dm:151
rt.def("/datum/game_mode/proc/greet_syndicate", function greet_syndicate(f: Frame, syndicate: Value, you_are: Value) {
	you_are ??= 1;
	if (you_are) {
		to_chat(syndicate.current, `<span class='notice'>You are a ${syndicate_name()} agent!</span>`);
	}
	syndicate.announce_objectives();
	return f.dot;
});

// nuclear.dm:155
rt.def("/datum/game_mode/proc/equip_syndicate", function* equip_syndicate(f: Frame, synd_mob: Value, telecrystals: Value) {
	telecrystals ??= 1;
	yield* synd_mob.set_species(T("/datum/species/human"));
	if (telecrystals) {
		yield* synd_mob.equipOutfit(T("/datum/outfit/syndicate"));
	} else {
		yield* synd_mob.equipOutfit(T("/datum/outfit/syndicate/no_crystals"));
	}
	return 1;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, {  }] });

// nuclear.dm:165
rt.def("/datum/game_mode/nuclear/proc/check_win", function check_win(f: Frame) {
	if (this.nukes_left == 0) {
		return 1;
	}
	return parent_proc();
});

// nuclear.dm:170
rt.def("/datum/game_mode/proc/are_operatives_dead", function are_operatives_dead(f: Frame) {
	let operative_mind: Value = null;
	for (operative_mind of each(this.syndicates, T("/datum/mind"))) {
		if (rt.istype(operative_mind.current, T("/mob/living/carbon/human")) && operative_mind.current.stat != 2) {
			return 0;
		}
	}
	return 1;
});

// nuclear.dm:176
rt.def("/datum/game_mode/nuclear/proc/check_finished", function* check_finished(f: Frame) {
	let N: Value = null;
	if (this.replacementmode && this.round_converted == 2) {
		return (yield* this.replacementmode.check_finished());
	}
	if (GLOB.SSshuttle.emergency.mode == "endgame: game over" || this.station_was_nuked) {
		return 1;
	}
	if (this.are_operatives_dead()) {
		pass(N);
		if (GLOB.bomb_set) {
			return 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// nuclear.dm:189
rt.def("/datum/game_mode/nuclear/proc/declare_completion", function declare_completion(f: Frame) {
	let D: Value = null;
	let disk_rescued: Value = 1;
	for (D of each(GLOB.poi_list, T("/obj/item/weapon/disk/nuclear"))) {
		if (!D.onCentcom()) {
			disk_rescued = 0;
			break;
		}
	}
	let crew_evacuated: Value = (GLOB.SSshuttle.emergency.mode == "endgame: game over" ? 1 : 0);
	if (this.nuke_off_station == NUKE_SYNDICATE_BASE) {
		GLOB.SSticker.mode_result = "loss - syndicate nuked - disk secured";
		to_chat(rt.world(), "<FONT size = 3><B>Humiliating Syndicate Defeat</B></FONT>");
		to_chat(rt.world(), `<B>The crew of ${station_name()} gave ${syndicate_name()} operatives back their bomb! The syndicate base was destroyed!</B> Next time, don't lose the nuke!`);
		GLOB.SSticker.news_report = NUKE_SYNDICATE_BASE;
	} else if (!disk_rescued && this.station_was_nuked && !this.syndies_didnt_escape) {
		GLOB.SSticker.mode_result = "win - syndicate nuke";
		to_chat(rt.world(), "<FONT size = 3><B>Syndicate Major Victory!</B></FONT>");
		to_chat(rt.world(), `<B>${syndicate_name()} operatives have destroyed ${station_name()}!</B>`);
		GLOB.SSticker.news_report = STATION_NUKED;
	} else if (!disk_rescued && this.station_was_nuked && this.syndies_didnt_escape) {
		GLOB.SSticker.mode_result = "halfwin - syndicate nuke - did not evacuate in time";
		to_chat(rt.world(), "<FONT size = 3><B>Total Annihilation</B></FONT>");
		to_chat(rt.world(), `<B>${syndicate_name()} operatives destroyed ${station_name()} but did not leave the area in time and got caught in the explosion.</B> Next time, don't lose the disk!`);
		GLOB.SSticker.news_report = STATION_NUKED;
	} else if (!disk_rescued && !this.station_was_nuked && this.nuke_off_station && !this.syndies_didnt_escape) {
		GLOB.SSticker.mode_result = "halfwin - blew wrong station";
		to_chat(rt.world(), "<FONT size = 3><B>Crew Minor Victory</B></FONT>");
		to_chat(rt.world(), `<B>${syndicate_name()} operatives secured the authentication disk but blew up something that wasn't ${station_name()}.</B> Next time, don't do that!`);
		GLOB.SSticker.news_report = NUKE_MISS;
	} else if (!disk_rescued && !this.station_was_nuked && this.nuke_off_station && this.syndies_didnt_escape) {
		GLOB.SSticker.mode_result = "halfwin - blew wrong station - did not evacuate in time";
		to_chat(rt.world(), `<FONT size = 3><B>${syndicate_name()} operatives have earned Darwin Award!</B></FONT>`);
		to_chat(rt.world(), `<B>${syndicate_name()} operatives blew up something that wasn't ${station_name()} and got caught in the explosion.</B> Next time, don't do that!`);
		GLOB.SSticker.news_report = NUKE_MISS;
	} else if ((disk_rescued || GLOB.SSshuttle.emergency.mode != "endgame: game over") && this.are_operatives_dead()) {
		GLOB.SSticker.mode_result = "loss - evacuation - disk secured - syndi team dead";
		to_chat(rt.world(), "<FONT size = 3><B>Crew Major Victory!</B></FONT>");
		to_chat(rt.world(), `<B>The Research Staff has saved the disk and killed the ${syndicate_name()} Operatives</B>`);
		GLOB.SSticker.news_report = OPERATIVES_KILLED;
	} else if (disk_rescued) {
		GLOB.SSticker.mode_result = "loss - evacuation - disk secured";
		to_chat(rt.world(), "<FONT size = 3><B>Crew Major Victory</B></FONT>");
		to_chat(rt.world(), `<B>The Research Staff has saved the disk and stopped the ${syndicate_name()} Operatives!</B>`);
		GLOB.SSticker.news_report = OPERATIVES_KILLED;
	} else if (!disk_rescued && this.are_operatives_dead()) {
		GLOB.SSticker.mode_result = "halfwin - evacuation - disk not secured";
		to_chat(rt.world(), "<FONT size = 3><B>Neutral Victory!</B></FONT>");
		to_chat(rt.world(), `<B>The Research Staff failed to secure the authentication disk but did manage to kill most of the ${syndicate_name()} Operatives!</B>`);
		GLOB.SSticker.news_report = OPERATIVE_SKIRMISH;
	} else if (!disk_rescued && crew_evacuated) {
		GLOB.SSticker.mode_result = "halfwin - detonation averted";
		to_chat(rt.world(), "<FONT size = 3><B>Syndicate Minor Victory!</B></FONT>");
		to_chat(rt.world(), `<B>${syndicate_name()} operatives survived the assault but did not achieve the destruction of ${station_name()}.</B> Next time, don't lose the disk!`);
		GLOB.SSticker.news_report = OPERATIVE_SKIRMISH;
	} else if (!disk_rescued && !crew_evacuated) {
		GLOB.SSticker.mode_result = "halfwin - interrupted";
		to_chat(rt.world(), "<FONT size = 3><B>Neutral Victory</B></FONT>");
		to_chat(rt.world(), "<B>Round was mysteriously interrupted!</B>");
		GLOB.SSticker.news_report = OPERATIVE_SKIRMISH;
	}
	parent_proc();
	return f.dot;
});

// nuclear.dm:278
rt.def("/datum/game_mode/proc/auto_declare_completion_nuclear", function auto_declare_completion_nuclear(f: Frame) {
	let text: Value = null, purchases: Value = null, TC_uses: Value = null, syndicate: Value = null, H: Value = null;
	if (rt.len(f, this.syndicates) || GLOB.SSticker && rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/nuclear"))) {
		text = "<br><FONT size=3><B>The syndicate operatives were:</B></FONT>";
		purchases = "";
		TC_uses = 0;
		for (syndicate of each(this.syndicates, T("/datum/mind"))) {
			text += this.printplayer(syndicate);
			H = null;
			for (H of each(GLOB.uplinks, T("/obj/item/device/uplink"))) {
				if (H && H.owner && H.owner == syndicate.key) {
					TC_uses += H.spent_telecrystals;
					purchases += H.purchase_log;
				}
			}
		}
		text += "<br>";
		text += `(Syndicates used ${TC_uses} TC) ${purchases}`;
		if (TC_uses == 0 && this.station_was_nuked && !this.are_operatives_dead()) {
			text += `<BIG>${bicon(icon(rt.rsc("icons/badass.dmi"), "badass"))}</BIG>`;
		}
		to_chat(rt.world(), text);
	}
	return 1;
});

// nuclear.dm:297
rt.def("/proc/nukelastname", function* nukelastname(f: Frame, M: Value) {
	let newname: Value = null;
	let randomname: Value = pick(GLOB.last_names);
	if (!(newname = copytext(sanitize((yield* g.op(f, "Prompt", [2], [randomname, "Name change", `You are the nuke operative ${pick("Czar", "Boss", "Commander", "Chief", "Kingpin", "Director", "Overlord")}. Please choose a last name for your family.`, M, null]))), 1, 42))) {
		newname = randomname;
	} else if (newname == "Unknown" || newname == "floor" || newname == "wall" || newname == "rwall" || newname == "_") {
		to_chat(M, "That name is reserved.");
		return (yield* g.call(f, P("/proc/nukelastname"), null, [M]));
	}
	return capitalize(newname);
}, true);

// nuclear.dm:311
rt.def("/proc/NukeNameAssign", function NukeNameAssign(f: Frame, lastname: Value, syndicates: Value) {
	let synd_mind: Value = null, H: Value = null;
	for (synd_mind of each(syndicates, T("/datum/mind"))) {
		H = synd_mind.current;
		synd_mind.name = H.dna.species.random_name(H.gender, 0, lastname);
		synd_mind.current.real_name = synd_mind.name;
	}
	return f.dot;
});

// nuclear.dm:318
rt.def("/proc/is_nuclear_operative", function is_nuclear_operative(f: Frame, M: Value) {
	return (rt.isIn(f, (((((M && (rt.istype(M, T("/mob")) ? 1 : 0)) && M.mind) && GLOB.SSticker) && GLOB.SSticker.mode) && M.mind), GLOB.SSticker.mode.syndicates) ? 1 : 0);
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

// nuclear.dm:331
rt.def("/datum/outfit/syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/syndie"), 1]);
	return f.dot;
});

// nuclear.dm:341
rt.def("/datum/outfit/syndicate/proc/post_equip", function* post_equip(f: Frame, H: Value) {
	let R: Value = null, U: Value = null, W: Value = null, E: Value = null;
	yield* (R = H.ears).set_frequency(1213);
	R.freqlock = 1;
	if (this.tc) {
		(U = (yield* new_(T("/obj/item/device/radio/uplink/nuclear"), H))).hidden_uplink.owner = `${H.key}`;
		U.hidden_uplink.telecrystals = this.tc;
		yield* H.equip_to_slot_or_del(U, slot_in_backpack);
	}
	yield* (W = (yield* new_(T("/obj/item/weapon/implant/weapons_auth"), H))).implant(H);
	yield* (E = (yield* new_(T("/obj/item/weapon/implant/explosive"), H))).implant(H);
	(rt.modField(f, H, "faction", "syndicate", rt.bitOr));
	yield* H.update_icons();
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

// nuclear.dm:367
rt.def("/datum/outfit/syndicate/full/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/syndie"), 1, T("/obj/item/weapon/tank/jetpack/oxygen/harness"), 1, T("/obj/item/weapon/gun/ballistic/automatic/pistol"), 1]);
	return f.dot;
});
