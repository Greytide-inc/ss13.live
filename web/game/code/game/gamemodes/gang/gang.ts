// Based on /tg/station's code/game/gamemodes/gang/gang.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// gang.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalgang_name_pool", function InitGlobalgang_name_pool(f: Frame) {
	GLOB.gang_name_pool = list("Clandestine", "Prima", "Zero-G", "Max", "Blasto", "Waffle", "North", "Omni", "Newton", "Cyber", "Donk", "Gene", "Gib", "Tunnel", "Diablo", "Psyke", "Osiron", "Sirius", "Sleeping Carp");
	this.gvars_datum_init_order += "gang_name_pool";
	return f.dot;
});

// gang.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalgang_colors_pool", function InitGlobalgang_colors_pool(f: Frame) {
	GLOB.gang_colors_pool = list("red", "orange", "yellow", "green", "blue", "purple", "white");
	this.gvars_datum_init_order += "gang_colors_pool";
	return f.dot;
});

// gang.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalgang_outfit_pool", function InitGlobalgang_outfit_pool(f: Frame) {
	GLOB.gang_outfit_pool = list(T("/obj/item/clothing/suit/jacket/leather"), T("/obj/item/clothing/suit/jacket/leather/overcoat"), T("/obj/item/clothing/suit/jacket/puffer"), T("/obj/item/clothing/suit/jacket/miljacket"), T("/obj/item/clothing/suit/jacket/puffer"), T("/obj/item/clothing/suit/pirate"), T("/obj/item/clothing/suit/poncho"), T("/obj/item/clothing/suit/apron/overalls"), T("/obj/item/clothing/suit/jacket/letterman"));
	this.gvars_datum_init_order += "gang_outfit_pool";
	return f.dot;
});

// gang.dm:13
rt.def("/proc/is_gangster", function is_gangster(f: Frame, M: Value) {
	return (((rt.istype(M, T("/mob/living")) ? 1 : 0) && M.mind) && M.mind.gang_datum);
});

// gang.dm:16
rt.def("/proc/is_in_gang", function is_in_gang(f: Frame, M: Value, gang_type: Value) {
	let G: Value = null;
	if (!is_gangster(M) || !gang_type) {
		return 0;
	}
	if ((G = M.mind.gang_datum).name == gang_type) {
		return 1;
	}
	return 0;
});

rt.type(1093, "/datum/game_mode/gang", "/datum/game_mode", {
	name: "gang war",
	config_tag: "gang",
	antag_flag: "gangster",
	restricted_jobs: null,
	required_players: 20,
	required_enemies: 2,
	recommended_enemies: 2,
	announce_span: "danger",
	announce_text: "A violent turf war has erupted on the station!\n<span class='danger'>Gangsters</span>: Take over the station with a dominator.\n<span class='notice'>Crew</span>: Prevent the gangs from expanding and initiating takeover.",
});

// gang.dm:42
rt.def("/datum/game_mode/gang/proc/pre_setup", function* pre_setup(f: Frame) {
	let i: Value = null, G: Value = null, n: Value = null, boss: Value = null, title: Value = null;
	let $e: any;
	if (GLOB.config.protect_roles_from_antagonist) {
		this.restricted_jobs += this.protected_jobs;
	}
	if (GLOB.config.protect_assistant_from_antagonist) {
		this.restricted_jobs += "Assistant";
	}
	let gangs_to_create: Value = 2;
	if (prob(this.num_players() * 2)) {
		gangs_to_create++;
	}
	rt.forRange(f, 0, 1, gangs_to_create, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!rt.len(f, this.antag_candidates)) {
			break;
		}
		this.gangs += (G = (yield* new_(T("/datum/gang"))));
		n = null;
		rt.forRange(f, 1, 1, 3, 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			n = $e;
			this.antag_candidates -= (boss = pick(this.antag_candidates));
			rt.setAt(G.bosses, boss, GANGSTER_BOSS_STARTING_INFLUENCE);
			boss.gang_datum = G;
			title = null;
			if (n == 1) {
				title = "Boss";
			} else {
				title = "Lieutenant";
			}
			boss.special_role = `${G.name} Gang ${title}`;
			boss.restricted_roles = this.restricted_jobs;
			log_game(`${boss.key} has been selected as the ${title} for the ${G.name} Gang`);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (rt.len(f, this.gangs) < 2) {
		return 0;
	}
	return 1;
}, true);

// gang.dm:84
rt.def("/datum/game_mode/gang/proc/post_setup", function* post_setup(f: Frame) {
	let G: Value = null, boss_mind: Value = null;
	yield* parent_proc();
	yield* sleep(rand(10, 100));
	for (G of each(this.gangs, T("/datum/gang"))) {
		boss_mind = null;
		for (boss_mind of each(G.bosses, T("/datum/mind"))) {
			rt.setAt(G.bosses, boss_mind, GANGSTER_BOSS_STARTING_INFLUENCE);
			G.add_gang_hud(boss_mind);
			this.forge_gang_objectives(boss_mind);
			this.greet_gang(boss_mind);
			yield* this.equip_gang(boss_mind.current, G);
			this.modePlayer += boss_mind;
		}
	}
	return f.dot;
}, true, { waitfor: false });

// gang.dm:97
rt.def("/datum/game_mode/proc/forge_gang_objectives", function forge_gang_objectives(f: Frame, boss_mind: Value) {
	let rival_obj: Value = null;
	(rival_obj = new_(T("/datum/objective"))).owner = boss_mind;
	rival_obj.explanation_text = "Be the first gang to successfully takeover the station with a Dominator.";
	boss_mind.objectives += rival_obj;
	return f.dot;
});

// gang.dm:104
rt.def("/datum/game_mode/proc/greet_gang", function greet_gang(f: Frame, boss_mind: Value, you_are: Value) {
	you_are ??= 1;
	if (you_are) {
		to_chat(boss_mind.current, `<FONT size=3 color=red><B>You are the Boss of the ${boss_mind.gang_datum.name} Gang!</B></FONT>`);
	}
	boss_mind.announce_objectives();
	return f.dot;
});

// gang.dm:111
rt.def("/datum/game_mode/proc/equip_gang", function* equip_gang(f: Frame, mob: Value, gang: Value) {
	let where: Value = null, where2: Value = null, where3: Value = null, where4: Value = null;
	if (!rt.istype(mob, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (mob.mind) {
		if (mob.mind.assigned_role == "Clown") {
			to_chat(mob, "Your training has allowed you to overcome your clownish nature, allowing you to wield weapons without harming yourself.");
			yield* mob.dna.remove_mutation("Clumsiness");
		}
	}
	let gangtool: Value = (yield* new_(T("/obj/item/device/gangtool"), mob));
	let _T: Value = (yield* new_(T("/obj/item/weapon/pen/gang"), mob));
	let SC: Value = (yield* new_(T("/obj/item/toy/crayon/spraycan/gang"), mob, gang));
	let C: Value = (yield* new_(T("/obj/item/clothing/glasses/hud/security/chameleon"), mob, gang));
	let slots: Value = rt.alist(f, ["backpack", slot_in_backpack, "left pocket", slot_l_store, "right pocket", slot_r_store]);
	f.dot = 0;
	if (!(where = (yield* mob.equip_in_one_of_slots(gangtool, slots)))) {
		to_chat(mob, "Your Syndicate benefactors were unfortunately unable to get you a Gangtool.");
		f.dot += 1;
	} else {
		yield* gangtool.register_device(mob);
		to_chat(mob, `The <b>Gangtool</b> in your ${where} will allow you to purchase weapons and equipment, send messages to your gang, and recall the emergency shuttle from anywhere on the station.`);
		to_chat(mob, "As the gang boss, you can also promote your gang members to <b>lieutenant</b>. Unlike regular gangsters, Lieutenants cannot be deconverted and are able to use recruitment pens and gangtools.");
	}
	if (!(where2 = (yield* mob.equip_in_one_of_slots(_T, slots)))) {
		to_chat(mob, "Your Syndicate benefactors were unfortunately unable to get you a recruitment pen to start.");
		f.dot += 1;
	} else {
		to_chat(mob, `The <b>recruitment pen</b> in your ${where2} will help you get your gang started. Stab unsuspecting crew members with it to recruit them.`);
	}
	if (!(where3 = (yield* mob.equip_in_one_of_slots(SC, slots)))) {
		to_chat(mob, "Your Syndicate benefactors were unfortunately unable to get you a territory spraycan to start.");
		f.dot += 1;
	} else {
		to_chat(mob, `The <b>territory spraycan</b> in your ${where3} can be used to claim areas of the station for your gang. The more territory your gang controls, the more influence you get. All gangsters can use these, so distribute them to grow your influence faster.`);
	}
	if (!(where4 = (yield* mob.equip_in_one_of_slots(C, slots)))) {
		to_chat(mob, "Your Syndicate benefactors were unfortunately unable to get you a chameleon security HUD.");
		f.dot += 1;
	} else {
		to_chat(mob, `The <b>chameleon security HUD</b> in your ${where4} will help you keep track of who is mindshield-implanted, and unable to be recruited.`);
	}
	return f.dot;
}, true);

// gang.dm:168
rt.def("/datum/game_mode/proc/add_gangster", function* add_gangster(f: Frame, gangster_mind: Value, G: Value, check: Value) {
	let carbon_mob: Value = null;
	check ??= 1;
	if (!G || rt.isIn(f, gangster_mind, this.get_all_gangsters()) || gangster_mind.enslaved_to && !is_gangster(gangster_mind.enslaved_to)) {
		if (is_in_gang(gangster_mind.current, G.name) && !rt.isIn(f, gangster_mind, this.get_gang_bosses())) {
			return 3;
		}
		return 0;
	}
	if (check && gangster_mind.current.isloyal()) {
		return 1;
	}
	rt.setAt(G.gangsters, gangster_mind, GANGSTER_SOLDIER_STARTING_INFLUENCE);
	gangster_mind.gang_datum = G;
	if (check) {
		if (rt.istype(gangster_mind.current, T("/mob/living/carbon"))) {
			(carbon_mob = gangster_mind.current).silent = max(carbon_mob.silent, 5);
			yield* carbon_mob.flash_act(1, 1);
		}
		yield* gangster_mind.current.Stun(100);
	}
	if (G.is_deconvertible) {
		to_chat(gangster_mind.current, `<FONT size=3 color=red><B>You are now a member of the ${G.name} Gang!</B></FONT>`);
		to_chat(gangster_mind.current, "<font color='red'>Help your bosses take over the station by claiming territory with <b>special spraycans</b> only they can provide. Simply spray on any unclaimed area of the station.</font>");
		to_chat(gangster_mind.current, "<font color='red'>Their ultimate objective is to take over the station with a Dominator machine.</font>");
		to_chat(gangster_mind.current, `<font color='red'>You can identify your bosses by their <b>large, bright ${G.color} [G] icon</b>.</font>`);
		gangster_mind.store_memory(`You are a member of the ${G.name} Gang!`);
	}
	gangster_mind.current.log_message(`<font color='red'>Has been converted to the ${G.name} Gang!</font>`, "Attack log");
	gangster_mind.special_role = `${G.name} Gangster`;
	G.add_gang_hud(gangster_mind);
	if (jobban_isbanned(gangster_mind.current, "gangster")) {
		yield* ImmediateInvokeAsync(this, P("/datum/game_mode/proc/replace_jobbaned_player"), gangster_mind.current, "gangster", "gangster");
	}
	return 2;
}, true);

// gang.dm:200
rt.def("/datum/game_mode/proc/remove_gangster", function* remove_gangster(f: Frame, gangster_mind: Value, beingborged: Value, silent: Value, remove_bosses: Value) {
	let O: Value = null, removed: Value = null, G: Value = null, tags_cache: Value = null, v: Value = null, c: Value = null;
	remove_bosses ??= 0;
	let gang: Value = gangster_mind.gang_datum;
	for (O of each(gangster_mind.current.contents, T("/obj"))) {
		if (rt.istype(O, T("/obj/item/device/gangtool/soldier"))) {
			yield* qdel(O);
		}
	}
	if (!gang) {
		return 0;
	}
	for (G of each(this.gangs, T("/datum/gang"))) {
		if (!G.is_deconvertible && !remove_bosses) {
			return 0;
		}
		if (rt.isIn(f, gangster_mind, G.gangsters)) {
			G.reclaim_points(rt.index(G.gangsters, gangster_mind));
			G.gangsters -= gangster_mind;
			removed = 1;
		}
		if (remove_bosses && rt.isIn(f, gangster_mind, G.bosses)) {
			G.reclaim_points(rt.index(G.bosses, gangster_mind));
			G.bosses -= gangster_mind;
			removed = 1;
		}
		if (rt.index(G.tags_by_mind, gangster_mind) && rt.istype(rt.index(G.tags_by_mind, gangster_mind), T("/list"))) {
			tags_cache = rt.index(G.tags_by_mind, gangster_mind);
			v = null;
			for (v of each(tags_cache)) {
				(c = v).set_mind_owner(null);
			}
			G.tags_by_mind -= gangster_mind;
		}
	}
	if (!removed) {
		return 0;
	}
	gangster_mind.special_role = null;
	gangster_mind.gang_datum = null;
	if (silent < 2) {
		gangster_mind.current.log_message(`<font color='red'>Has reformed and defected from the ${gang.name} Gang!</font>`, "Attack log");
		if (beingborged) {
			if (!silent) {
				gangster_mind.current.visible_message("The frame beeps contentedly from the MMI before initalizing it.");
			}
			to_chat(gangster_mind.current, "<FONT size=3 color=red><B>The frame's firmware detects and deletes your criminal behavior! You are no longer a gangster!</B></FONT>");
			message_admins(`${`${key_name_admin(gangster_mind.current)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [gangster_mind.current])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [gangster_mind.current])}`} has been borged while being a member of the ${gang.name} Gang. They are no longer a gangster.`);
		} else {
			if (!silent) {
				yield* gangster_mind.current.Unconscious(100);
				gangster_mind.current.visible_message(`<FONT size=3><B>${gangster_mind.current} looks like they've given up the life of crime!<B></font>`);
			}
			to_chat(gangster_mind.current, "<FONT size=3 color=red><B>You have been reformed! You are no longer a gangster!</B><BR>You try as hard as you can, but you can't seem to recall any of the identities of your former gangsters...</FONT>");
			gangster_mind.memory = "";
		}
	}
	gang.remove_gang_hud(gangster_mind);
	return 1;
}, true);

// gang.dm:257
rt.def("/datum/game_mode/proc/get_all_gangsters", function get_all_gangsters(f: Frame) {
	let all_gangsters: Value = list();
	all_gangsters += this.get_gangsters();
	return (all_gangsters += this.get_gang_bosses());
});

// gang.dm:263
rt.def("/datum/game_mode/proc/get_gangsters", function get_gangsters(f: Frame) {
	let G: Value = null;
	let gangsters: Value = list();
	for (G of each(this.gangs, T("/datum/gang"))) {
		gangsters += G.gangsters;
	}
	return gangsters;
});

// gang.dm:269
rt.def("/datum/game_mode/proc/get_gang_bosses", function get_gang_bosses(f: Frame) {
	let G: Value = null;
	let gang_bosses: Value = list();
	for (G of each(this.gangs, T("/datum/gang"))) {
		gang_bosses += G.bosses;
	}
	return gang_bosses;
});

// gang.dm:275
rt.def("/datum/game_mode/proc/shuttle_check", function* shuttle_check(f: Frame) {
	let L: Value = null;
	if (GLOB.SSshuttle.emergencyNoRecall) {
		return f.dot;
	}
	let alive: Value = 0;
	for (L of each(GLOB.player_list, T("/mob/living"))) {
		if (L.stat != 2) {
			alive++;
		}
	}
	if (!(alive < rt.len(f, GLOB.joined_player_list) * 0.4 && GLOB.SSshuttle.emergency.timeLeft(1) > GLOB.SSshuttle.emergencyCallTime * 0.4)) return f.dot;
	GLOB.SSshuttle.emergencyNoRecall = 1;
	yield* GLOB.SSshuttle.emergency.request(null, { set_coefficient: 0.4 });
	yield* priority_announce("Catastrophic casualties detected: crisis shuttle protocols activated - jamming recall signals across all frequencies.");
	return f.dot;
}, true);

// gang.dm:289
rt.def("/proc/determine_domination_time", function determine_domination_time(f: Frame, G: Value) {
	return max(180, 480 - round(rt.len(f, G.territory) / GLOB.start_state.num_territories * 100, 1) * 9);
});

// gang.dm:297
rt.def("/datum/game_mode/proc/auto_declare_completion_gang", function auto_declare_completion_gang(f: Frame, winner: Value) {
	let G: Value = null, text: Value = null, boss: Value = null, gangster: Value = null;
	let $0: any, $1: any, $e: any;
	if (!rt.len(f, this.gangs)) {
		return f.dot;
	}
	if (!winner) {
		$0 = rt.world();
		if (this.station_was_nuked) {
			$1 = "destroyed!";
		} else {
			$1 = "evacuated before a gang could claim it! The station wins!";
		}
		to_chat($0, `<span class='redtext'>The station was ${$1}</span><br>`);
		GLOB.SSticker.mode_result = "loss - gangs failed takeover";
		GLOB.SSticker.news_report = GANG_LOSS;
	} else {
		to_chat(rt.world(), `<span class='redtext'>The ${winner.name} Gang successfully performed a hostile takeover of the station!</span><br>`);
		GLOB.SSticker.mode_result = "win - gang domination complete";
		GLOB.SSticker.news_report = GANG_TAKEOVER;
	}
	for (G of each(this.gangs, T("/datum/gang"))) {
		$0 = G.name;
		if (winner == G) {
			$1 = "<span class='greenannounce'>victorious</span>";
		} else {
			$1 = "<span class='boldannounce'>defeated</span>";
		}
		text = `<b>The ${$0} Gang was ${$1} with ${round(rt.len(f, G.territory) / GLOB.start_state.num_territories * 100, 1)}% control of the station!</b>`;
		text += `<br>The ${G.name} Gang Bosses were:`;
		boss = null;
		for (boss of each(G.bosses, T("/datum/mind"))) {
			text += this.printplayer(boss, 1);
		}
		text += `<br>The ${G.name} Gangsters were:`;
		gangster = null;
		for (gangster of each(G.gangsters, T("/datum/mind"))) {
			text += this.printplayer(gangster, 1);
		}
		text += "<br>";
		to_chat(rt.world(), text);
	}
	return f.dot;
});

rt.type(1246, "/datum/gang_points", "/datum", {
	next_point_interval: 1800,
	next_point_time: null,
});

// gang.dm:330
rt.def("/datum/gang_points/proc/New", function New(f: Frame) {
	this.next_point_time = rt.worldTime(f) + this.next_point_interval;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// gang.dm:334
rt.def("/datum/gang_points/proc/process", function* process(f: Frame, seconds: Value) {
	let G: Value = null;
	let winners: Value = list();
	for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
		if (rt.worldTime(f) > this.next_point_time) {
			yield* G.income();
		}
		if (G.is_dominating) {
			if (G.domination_time_remaining() < 0) {
				winners += G;
			}
		}
	}
	if (rt.worldTime(f) > this.next_point_time) {
		this.next_point_time = rt.worldTime(f) + this.next_point_interval;
	}
	if (!rt.len(f, winners)) return f.dot;
	if (rt.len(f, winners) > 1) {
		G = null;
		for (G of each(winners, T("/datum/gang"))) {
			G.domination(0.5);
		}
		yield* priority_announce("Multiple station takeover attempts have made simultaneously. Conflicting takeover attempts appears to have restarted.", "Network Alert");
	} else {
		(G = rt.index(winners, 1)).is_dominating = 0;
		GLOB.SSticker.mode.explosion_in_progress = 1;
		yield* GLOB.SSticker.station_explosion_cinematic(1, "gang war", null);
		GLOB.SSticker.mode.explosion_in_progress = 0;
		GLOB.SSticker.force_ending = 1;
	}
	return f.dot;
}, true, { waitfor: false });
