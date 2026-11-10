// Based on /tg/station's code/modules/mob/dead/new_player/new_player.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5097, "/mob/dead/new_player", "/mob/dead", {
	ready: 0,
	spawning: 0,
	new_character: null,
	flags: 0,
	anchored: 1,
	invisibility: 101,
	density: 0,
	stat: 2,
	canmove: 0,
});

// new_player.dm:19
rt.def("/mob/dead/new_player/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null;
	if (this.client && GLOB.SSticker.state == GAME_STATE_STARTUP) {
		yield* (S = (yield* new_(T("/obj/screen/splash"), this.client, 1, 1))).Fade(1);
	}
	if (rt.length(GLOB.newplayer_start)) {
		this.loc = pick(GLOB.newplayer_start);
	} else {
		this.loc = rt.locate(1, 1, 1);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// new_player.dm:33
rt.def("/mob/dead/new_player/proc/new_player_panel", function* new_player_panel(f: Frame) {
	let popup: Value = null;
	let output: Value = fmt("<center><p><a href='byond://?src=＃;show_preferences=1'>Setup Character</a></p>", [this]);
	if (GLOB.SSticker && GLOB.SSticker.current_state <= 1) {
		if (this.ready === 0) {
			output += `<p>[ ${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 1, "Ready"])} | <b>Not Ready</b> | ${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 2, "Observe"])} ]</p>`;
		} else if (this.ready === 1) {
			output += `<p>[ <b>Ready</b> | ${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 0, "Not Ready"])} | ${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 2, "Observe"])} ]</p>`;
		} else if (this.ready === 2) {
			output += `<p>[ ${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 1, "Ready"])} | ${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 0, "Not Ready"])} | <b> Observe </b> ]</p>`;
		}
	} else {
		output += fmt("<p><a href='byond://?src=＃;manifest=1'>View the Crew Manifest</a></p>", [this]);
		output += fmt("<p><a href='byond://?src=＃;late_join=1'>Join Game!</a></p>", [this]);
		output += `<p>${fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [this, 2, "Observe"])}</p>`;
	}
	output += "</center>";
	(popup = (yield* new_(T("/datum/browser"), this, "playersetup", "<div align='center'>New Player Options</div>", 250, 265))).set_window_options("can_close=0");
	popup.set_content(output);
	yield* popup.open(0);
	return f.dot;
}, true);

// new_player.dm:74
rt.def("/mob/dead/new_player/proc/Stat", function* Stat(f: Frame) {
	let time_remaining: Value = null;
	yield* parent_proc();
	if (!statpanel("Lobby")) return f.dot;
	let $0: any = "Game Mode:";
	stat($0, GLOB.SSticker.hide_mode ? "Secret" : `${GLOB.master_mode}`);
	stat("Map:", GLOB.SSmapping.config.map_name);
	if (GLOB.SSticker.current_state != GAME_STATE_PREGAME) return f.dot;
	if ((time_remaining = GLOB.SSticker.GetTimeLeft()) >= 0) {
		time_remaining /= 10;
	}
	stat("Time To Start:", time_remaining >= 0 ? `${round(time_remaining)}s` : "DELAYED");
	stat("Players:", `${GLOB.SSticker.totalPlayers}`);
	if (!this.client.holder) return f.dot;
	stat("Players Ready:", `${GLOB.SSticker.totalPlayersReady}`);
	return f.dot;
}, true);

// new_player.dm:92
rt.def("/mob/dead/new_player/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let relevant_cap: Value = null, tready: Value = null, queue_position: Value = null;
	if (this != f.usr) {
		return 0;
	}
	if (!this.client) {
		return 0;
	}
	if (GLOB.config.hard_popcap && GLOB.config.extreme_popcap) {
		relevant_cap = min(GLOB.config.hard_popcap, GLOB.config.extreme_popcap);
	} else {
		relevant_cap = max(GLOB.config.hard_popcap, GLOB.config.extreme_popcap);
	}
	if (rt.at(href_list, "show_preferences")) {
		yield* this.client.prefs.ShowChoices(this);
		return 1;
	}
	if (rt.at(href_list, "ready")) {
		if (GLOB.SSticker) {
			tready = text2num(rt.at(href_list, "ready"));
			// tg_js: only Not Ready, Ready or Observe (ready=3, 0.5 or 1e9 was kept as it came)
			if (!(tready === 0 || tready === 1 || tready === 2)) return f.dot;
			if (GLOB.SSticker.current_state <= 1) {
				this.ready = tready;
			}
			if ((!GLOB.SSticker.current_state ? 1 : 0) < 1 && tready == 2) {
				this.ready = tready;
				yield* this.make_me_an_observer();
				return f.dot;
			}
		}
	}
	if (rt.at(href_list, "refresh")) {
		rt.op(f, "Browse", [], [this, null, "window=playersetup"], false);
		yield* this.new_player_panel();
	}
	if (rt.at(href_list, "late_join")) {
		if (!GLOB.SSticker || !GLOB.SSticker.IsRoundInProgress()) {
			to_chat(f.usr, "<span class='danger'>The round is either not ready, or has already finished...</span>");
			return f.dot;
		}
		if (rt.at(href_list, "late_join") == "override") {
			yield* this.LateChoices();
			return f.dot;
		}
		if (rt.len(f, GLOB.SSticker.queued_players) || relevant_cap && living_player_count() >= relevant_cap && !rt.isIn(f, ckey(this.key), GLOB.admin_datums)) {
			to_chat(f.usr, `<span class='danger'>${GLOB.config.hard_popcap_message}</span>`);
			if ((queue_position = GLOB.SSticker.queued_players.Find(f.usr)) == 1) {
				to_chat(f.usr, "<span class='notice'>You are next in line to join the game. You will be notified when a slot opens up.</span>");
			} else if (queue_position) {
				to_chat(f.usr, `<span class='notice'>There are ${queue_position - 1} players in front of you in the queue to join the game.</span>`);
			} else {
				GLOB.SSticker.queued_players += f.usr;
				to_chat(f.usr, `<span class='notice'>You have been added to the queue to join the game. Your position in queue is ${rt.len(f, GLOB.SSticker.queued_players)}.</span>`);
			}
			return f.dot;
		}
		yield* this.LateChoices();
	}
	if (rt.at(href_list, "manifest")) {
		this.ViewManifest();
	}
	if (rt.at(href_list, "SelectedJob")) {
		// tg_js: only once the round runs (modern tg's check): a job link sent in pregame spawned you on the station before round start
		if (!GLOB.SSticker || !GLOB.SSticker.IsRoundInProgress()) {
			to_chat(f.usr, "<span class='danger'>The round is either not ready, or has already finished...</span>");
			return f.dot;
		}
		if (!GLOB.enter_allowed) {
			to_chat(f.usr, "<span class='notice'>There is an administrative lock on entering the game!</span>");
			return f.dot;
		}
		if (rt.len(f, GLOB.SSticker.queued_players) && !rt.isIn(f, ckey(this.key), GLOB.admin_datums)) {
			if (living_player_count() >= relevant_cap || this != rt.index(GLOB.SSticker.queued_players, 1)) {
				to_chat(f.usr, "<span class='warning'>Server is full.</span>");
				return f.dot;
			}
		}
		yield* this.AttemptLateSpawn(rt.at(href_list, "SelectedJob"));
		return f.dot;
	}
	if (!this.ready && rt.at(href_list, "preference")) {
		if (this.client) {
			yield* this.client.prefs.process_link(this, href_list);
		}
	} else if (!rt.at(href_list, "late_join")) {
		yield* this.new_player_panel();
	}
	return f.dot;
}, true);

// new_player.dm:258
rt.def("/mob/dead/new_player/proc/make_me_an_observer", function* make_me_an_observer(f: Frame) {
	if (!this || this.gc_destroyed || !this.client) {
		this.ready = 0;
		return 0;
	}
	// tg_js: on the Creative map everyone starts as a ghost (AttemptLateSpawn, ticker.ts), so nothing to confirm
	let this_is_like_playing_right: Value = is_creative() ? "Yes" : (yield* alert(this, "Are you sure you wish to observe? You will not be able to play this round!", "Player Setup", "Yes", "No"));
	if (!this || this.gc_destroyed || !this.client || this_is_like_playing_right != "Yes") {
		this.ready = 0;
		rt.op(f, "Browse", [], [this, null, "window=playersetup"], false);
		yield* this.new_player_panel();
		return 0;
	}
	let observer: Value = (yield* new_(T("/mob/dead/observer")));
	this.spawning = 1;
	observer.started_as_observer = 1;
	this.close_spawn_windows();
	let O: Value = rt.locateIn(f, "landmark*Observer-Start", rt.world());
	if (!is_creative()) to_chat(this, "<span class='notice'>Now teleporting.</span>"); // tg_js: Creative starts quietly
	if (O) {
		observer.loc = O.loc;
	} else {
		to_chat(this, "<span class='notice'>Teleporting failed. Ahelp an admin please</span>");
		stack_trace("There's no freaking observer landmark available on this map or you're making observers before the map is initialised");
	}
	observer.key = this.key;
	// tg_js: tg's observer.client = src.client went here; the key above already moved the client, so it wrote null over it (the ghost was named "ghost", with no player)
	yield* observer.set_ghost_appearance();
	if (observer.client && observer.client.prefs) {
		observer.real_name = observer.client.prefs.real_name;
		observer.name = observer.real_name;
	}
	yield* observer.update_icon();
	observer.stop_sound_channel(1024);
	yield* qdel(this.mind);
	this.mind = null;
	yield* qdel(this);
	return 1;
}, true);

// new_player.dm:295
rt.def("/mob/dead/new_player/proc/IsJobAvailable", function* IsJobAvailable(f: Frame, rank: Value) {
	let job: Value = null, J: Value = null;
	if (!(job = (yield* GLOB.SSjob.GetJob(rank)))) {
		return 0;
	}
	if (job.current_positions >= job.total_positions && job.total_positions != -1) {
		if (job.title == "Assistant") {
			for (J of each(GLOB.SSjob.occupations, T("/datum/job"))) {
				if (J && J.current_positions < J.total_positions && J.title != job.title) {
					return 0;
				}
			}
		} else {
			return 0;
		}
	}
	if (jobban_isbanned(this, rank)) {
		return 0;
	}
	if (GLOB.config.enforce_human_authority && !this.client.prefs.pref_species.qualifies_for_rank(rank, this.client.prefs.features)) {
		return 0;
	}
	return 1;
}, true);

// new_player.dm:317
rt.def("/mob/dead/new_player/proc/AttemptLateSpawn", function* AttemptLateSpawn(f: Frame, rank: Value) {
	let equip: Value = null, Spl: Value = null, humanc: Value = null;
	if (is_creative()) return yield* this.make_me_an_observer(); // tg_js: creative starts you as a ghost
	if (!(yield* this.IsJobAvailable(rank))) {
		yield* alert(this, `${rank} is not available. Please try another.`);
		return 0;
	}
	if (GLOB.SSticker.late_join_disabled) {
		yield* alert(this, "An administrator has disabled late join spawning.");
		return 0;
	}
	let arrivals_docked: Value = 1;
	if (GLOB.SSshuttle.arrivals) {
		this.close_spawn_windows();
		if (GLOB.SSshuttle.arrivals.damaged && GLOB.config.arrivals_shuttle_require_safe_latejoin) {
			rt.op(f, "Output", [], [this, (yield* alert("The arrivals shuttle is currently malfunctioning! You cannot join."))], false);
			return 0;
		}
		arrivals_docked = (GLOB.SSshuttle.arrivals.mode != "call" ? 1 : 0);
	}
	GLOB.SSticker.queued_players -= this;
	GLOB.SSticker.queue_delay = 4;
	yield* GLOB.SSjob.AssignRole(this, rank, 1);
	let character: Value = (yield* this.create_character(1));
	if (rt.istype((equip = (yield* GLOB.SSjob.EquipRank(character, rank, 1))), T("/mob/living"))) {
		character = equip;
	}
	yield* GLOB.SSjob.SendToLateJoin(character);
	if (!arrivals_docked) {
		yield* (Spl = (yield* new_(T("/obj/screen/splash"), character.client, 1))).Fade(1);
		character.playsound_local(rt.getStep(f, character, 0), rt.rsc("sound/voice/ApproachingTG.ogg"), 25);
	}
	yield* character.update_parallax_teleport();
	GLOB.SSticker.minds += character.mind;
	if (rt.istype(character, T("/mob/living/carbon/human"))) {
		humanc = character;
	}
	if (humanc) {
		yield* GLOB.data_core.manifest_inject(humanc);
		if (GLOB.SSshuttle.arrivals) {
			yield* GLOB.SSshuttle.arrivals.QueueAnnounce(humanc, rank);
		} else {
			yield* AnnounceArrival(humanc, rank);
		}
		yield* this.AddEmploymentContract(humanc);
		if (GLOB.highlander) {
			to_chat(humanc, "<span class='userdanger'><i>THERE CAN BE ONLY ONE!!!</i></span>");
			yield* humanc.make_scottish();
		}
	}
	GLOB.joined_player_list += character.ckey;
	if (!(GLOB.config.allow_latejoin_antagonists && humanc)) return f.dot;
	if (!GLOB.SSshuttle.emergency) return f.dot;
	if (GLOB.SSshuttle.emergency.mode === "recall" || GLOB.SSshuttle.emergency.mode === "idle") {
		yield* GLOB.SSticker.mode.make_antag_chance(humanc);
	} else if (GLOB.SSshuttle.emergency.mode === "call") {
		if (!(GLOB.SSshuttle.emergency.timeLeft(1) > rt.initial(f, GLOB.SSshuttle, "emergencyCallTime") * 0.5)) return f.dot;
		yield* GLOB.SSticker.mode.make_antag_chance(humanc);
	}
	return f.dot;
}, true);

// new_player.dm:383
rt.def("/mob/dead/new_player/proc/AddEmploymentContract", function* AddEmploymentContract(f: Frame, employee: Value) {
	let C: Value = null, employmentCabinet: Value = null;
	for (C of each(GLOB.employmentCabinets)) {
		if (!(employmentCabinet = C).virgin) {
			yield* employmentCabinet.addFile(employee);
		}
	}
	return f.dot;
}, true);

// new_player.dm:390
rt.def("/mob/dead/new_player/proc/LateChoices", function* LateChoices(f: Frame) {
	let job: Value = null, amt: Value = null, amt_count: Value = null, a: Value = null, job_6: Value = null, position_class: Value = null, popup: Value = null;
	let $e: any;
	let mills: Value = rt.worldTime(f) - GLOB.SSticker.round_start_time;
	let mins: Value = mills % 36000 / 600;
	let hours: Value = mills / 36000;
	let dat: Value = `<div class='notice'>Round Duration: ${round(hours)}h ${round(mins)}m</div>`;
	if (GLOB.SSshuttle.emergency) {
		if (GLOB.SSshuttle.emergency.mode === "escape") {
			dat += "<div class='notice red'>The station has been evacuated.</div><br>";
		} else if (GLOB.SSshuttle.emergency.mode === "call") {
			if (!GLOB.SSshuttle.canRecall()) {
				dat += "<div class='notice red'>The station is currently undergoing evacuation procedures.</div><br>";
			}
		}
	}
	let available_job_count: Value = 0;
	for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
		if (job && (yield* this.IsJobAvailable(job.title))) {
			available_job_count++;
		}
	}
	if (rt.length(GLOB.SSjob.prioritized_jobs)) {
		dat += "<div class='notice red'>The station has flagged these jobs as high priority:<br>";
		amt = rt.length(GLOB.SSjob.prioritized_jobs);
		for (a of each(GLOB.SSjob.prioritized_jobs, T("/datum/job"))) {
			amt_count++;
			if (amt_count != amt) {
				dat += ` ${a.title}, `;
			} else {
				dat += ` ${a.title}. </div>`;
			}
		}
	}
	dat += "<div class='clearBoth'>Choose from the following open positions:</div><br>";
	dat += "<div class='jobs'><div class='jobsColumn'>";
	let job_count: Value = 0;
	for (job_6 of each(GLOB.SSjob.occupations, T("/datum/job"))) {
		if (job_6 && (yield* this.IsJobAvailable(job_6.title))) {
			job_count++;
			if (job_count > round(available_job_count / 2)) {
				dat += "</div><div class='jobsColumn'>";
			}
			position_class = "otherPosition";
			if (rt.isIn(f, job_6.title, GLOB.command_positions)) {
				position_class = "commandPosition";
			}
			dat += fmt("<a class='＀' href='byond://?src=＃;SelectedJob=＀'>＀ (＀)</a><br>", [position_class, this, job_6.title, job_6.title, job_6.current_positions]);
		}
	}
	if (!job_count) {
		job_6 = null;
		for (job_6 of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (job_6.title != "Assistant") {
				continue;
			}
			dat += fmt("<a class='otherPosition' href='byond://?src=＃;SelectedJob=＀'>＀ (＀)</a><br>", [this, job_6.title, job_6.title, job_6.current_positions]);
			break;
		}
	}
	dat += "</div></div>";
	(popup = (yield* new_(T("/datum/browser"), this, "latechoices", "Choose Profession", 440, 500))).add_stylesheet("playeroptions", rt.rsc("html/browser/playeroptions.css"));
	popup.set_content(dat);
	yield* popup.open(0);
	return f.dot;
}, true);

// new_player.dm:452
rt.def("/mob/dead/new_player/proc/create_character", function* create_character(f: Frame, transfer_after: Value) {
	this.spawning = 1;
	this.close_spawn_windows();
	let H: Value = (yield* new_(T("/mob/living/carbon/human"), this.loc));
	if (GLOB.config.force_random_names || jobban_isbanned(this, "appearance")) {
		yield* this.client.prefs.random_character();
		this.client.prefs.real_name = this.client.prefs.pref_species.random_name(this.gender, 1);
	}
	yield* this.client.prefs.copy_to(H);
	yield* H.dna.update_dna_identity();
	if (this.mind) {
		this.mind.active = 0;
		yield* this.mind.transfer_to(H);
	}
	H.name = this.real_name;
	f.dot = H;
	this.new_character = f.dot;
	if (!transfer_after) return f.dot;
	yield* this.transfer_character();
	return f.dot;
}, true);

// new_player.dm:473
rt.def("/mob/dead/new_player/proc/transfer_character", function* transfer_character(f: Frame) {
	f.dot = this.new_character;
	if (!f.dot) return f.dot;
	this.new_character.key = this.key;
	this.new_character.stop_sound_channel(1024);
	this.new_character = null;
	yield* qdel(this);
	return f.dot;
}, true);

// new_player.dm:481
rt.def("/mob/dead/new_player/proc/ViewManifest", function ViewManifest(f: Frame) {
	let dat: Value = "<html><body>";
	dat += "<h4>Crew Manifest</h4>";
	dat += GLOB.data_core.get_manifest({ OOC: 1 });
	rt.op(f, "Browse", [], [this, dat, "window=manifest;size=387x420;can_close=1"], false);
	return f.dot;
});

// new_player.dm:493
rt.def("/mob/dead/new_player/proc/close_spawn_windows", function close_spawn_windows(f: Frame) {
	rt.op(f, "Browse", [], [this, null, "window=latechoices"], false);
	rt.op(f, "Browse", [], [this, null, "window=playersetup"], false);
	rt.op(f, "Browse", [], [this, null, "window=preferences"], false);
	rt.op(f, "Browse", [], [this, null, "window=mob_occupation"], false);
	rt.op(f, "Browse", [], [this, null, "window=latechoices"], false);
	return f.dot;
});
