// From code/modules/mob/dead/new_player/new_player.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/dead/new_player/proc/Initialize  (code/modules/mob/dead/new_player/new_player.dm:19)  may sleep
rt.def("/mob/dead/new_player/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if ((truthy(rt.sv(f, "client")) && isEqual(rt.fv(f, "state", rt.gl("SSticker")), 0))) {
		yield* g.callName(f, (S = (yield* g.new_(f, T("/obj/screen/splash"), [rt.sv(f, "client"), 1, 1]))), "Fade", [1]);
	}
	if (truthy(rt.length(rt.gl("newplayer_start")))) {
		rt.setSv(f, "loc", rt.op(f, "PickUnweighted", [1], [rt.gl("newplayer_start")]));
	} else {
		rt.setSv(f, "loc", rt.locate(1, 1, 1));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/dead/new_player/proc/new_player_panel  (code/modules/mob/dead/new_player/new_player.dm:33)  may sleep
rt.def("/mob/dead/new_player/proc/new_player_panel", function* new_player_panel(f: Frame) {
	let output: Value = null, popup: Value = null;
	let $0: any;
	f.vars = () => [output, popup, $0];
	output = fmt("<center><p><a href='byond://?src=＃;show_preferences=1'>Setup Character</a></p>", [live(f.src)]);
	if ((truthy(rt.gl("SSticker")) && rt.le(rt.fv(f, "current_state", rt.gl("SSticker")), 1))) {
		$0 = rt.sv(f, "ready");
		if ($0 === 0) {
			output = rt.modify(live(output), fmt("<p>[ ＀ | <b>Not Ready</b> | ＀ ]</p>", [fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 1, "Ready"]), fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 2, "Observe"])]), add);
		} else if ($0 === 1) {
			output = rt.modify(live(output), fmt("<p>[ <b>Ready</b> | ＀ | ＀ ]</p>", [fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 0, "Not Ready"]), fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 2, "Observe"])]), add);
		} else if ($0 === 2) {
			output = rt.modify(live(output), fmt("<p>[ ＀ | ＀ | <b> Observe </b> ]</p>", [fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 1, "Ready"]), fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 0, "Not Ready"])]), add);
		}
	} else {
		output = rt.modify(live(output), fmt("<p><a href='byond://?src=＃;manifest=1'>View the Crew Manifest</a></p>", [live(f.src)]), add);
		output = rt.modify(live(output), fmt("<p><a href='byond://?src=＃;late_join=1'>Join Game!</a></p>", [live(f.src)]), add);
		output = rt.modify(live(output), fmt("<p>＀</p>", [fmt("<a href='byond://?src=＃;ready=＀'>＀</a>", [live(f.src), 2, "Observe"])]), add);
	}
	output = rt.modify(live(output), "</center>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.src), "playersetup", "<div align='center'>New Player Options</div>", 250, 265]))), "set_window_options", ["can_close=0"]);
	yield* g.callName(f, live(popup), "set_content", [live(output)]);
	yield* g.callName(f, live(popup), "open", [0]);
	return live(f.dot);
}, true);

// /mob/dead/new_player/proc/Stat  (code/modules/mob/dead/new_player/new_player.dm:74)  may sleep
rt.def("/mob/dead/new_player/proc/Stat", function* Stat(f: Frame) {
	let time_remaining: Value = null;
	let $0: any, $1: any;
	f.vars = () => [time_remaining, $0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Lobby"])))) return f.dot;
	$0 = "Game Mode:";
	if (truthy(rt.fv(f, "hide_mode", rt.gl("SSticker")))) {
		$1 = "Secret";
	} else {
		$1 = fmt("＀", [rt.gl("master_mode")]);
	}
	yield* g.call(f, P("/proc/stat"), null, [$0, $1]);
	yield* g.call(f, P("/proc/stat"), null, ["Map:", rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))]);
	if (!isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 1)) return f.dot;
	if (rt.ge((time_remaining = (yield* g.callName(f, rt.gl("SSticker"), "GetTimeLeft", []))), 0)) {
		(time_remaining = rt.modify(live(time_remaining), 10, divide));
	}
	$0 = "Time To Start:";
	if (rt.ge(live(time_remaining), 0)) {
		$1 = fmt("＀s", [(yield* g.call(f, P("/proc/round"), null, [live(time_remaining)]))]);
	} else {
		$1 = "DELAYED";
	}
	yield* g.call(f, P("/proc/stat"), null, [$0, $1]);
	yield* g.call(f, P("/proc/stat"), null, ["Players:", fmt("＀", [rt.fv(f, "totalPlayers", rt.gl("SSticker"))])]);
	if (!truthy(rt.fv(f, "holder", rt.sv(f, "client")))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, ["Players Ready:", fmt("＀", [rt.fv(f, "totalPlayersReady", rt.gl("SSticker"))])]);
	return f.dot;
}, true);

// /mob/dead/new_player/proc/Topic  (code/modules/mob/dead/new_player/new_player.dm:92)  may sleep
rt.def("/mob/dead/new_player/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let relevant_cap: Value = null, tready: Value = null, queue_position: Value = null;
	let $0: any;
	f.vars = () => [href, href_list, relevant_cap, tready, queue_position, $0];
	if (!isEqual(live(f.src), live(f.usr))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "client"))) {
		return 0;
	}
	relevant_cap = null;
	if ((truthy(rt.fv(f, "hard_popcap", rt.gl("config"))) && truthy(rt.fv(f, "extreme_popcap", rt.gl("config"))))) {
		relevant_cap = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "hard_popcap", rt.gl("config")), rt.fv(f, "extreme_popcap", rt.gl("config"))]));
	} else {
		relevant_cap = (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "hard_popcap", rt.gl("config")), rt.fv(f, "extreme_popcap", rt.gl("config"))]));
	}
	if (truthy(rt.at(live(href_list), "show_preferences"))) {
		yield* g.callName(f, rt.fv(f, "prefs", rt.sv(f, "client")), "ShowChoices", [live(f.src)]);
		return 1;
	}
	if (truthy(rt.at(live(href_list), "ready"))) {
		if (truthy(rt.gl("SSticker"))) {
			tready = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "ready")]));
			// tg_js: only Not Ready, Ready or Observe (ready=3, 0.5 or 1e9 was kept as it came)
			if (!(tready === 0 || tready === 1 || tready === 2)) return f.dot;
			if (rt.le(rt.fv(f, "current_state", rt.gl("SSticker")), 1)) {
				rt.setSv(f, "ready", live(tready));
			}
			if ((rt.lt((!truthy(rt.fv(f, "current_state", rt.gl("SSticker"))) ? 1 : 0), 1) && isEqual(live(tready), 2))) {
				rt.setSv(f, "ready", live(tready));
				yield* g.srcCall(f, "make_me_an_observer");
				return live(f.dot);
			}
		}
	}
	if (truthy(rt.at(live(href_list), "refresh"))) {
		rt.op(f, "Browse", [], [live(f.src), null, "window=playersetup"], false);
		yield* g.srcCall(f, "new_player_panel");
	}
	if (truthy(rt.at(live(href_list), "late_join"))) {
		if ((!truthy(rt.gl("SSticker")) || !truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The round is either not ready, or has already finished...</span>"]);
			return live(f.dot);
		}
		if (isEqual(rt.at(live(href_list), "late_join"), "override")) {
			yield* g.srcCall(f, "LateChoices");
			return live(f.dot);
		}
		if ((truthy(rt.getLen(f, rt.fv(f, "queued_players", rt.gl("SSticker")))) || ((truthy(live(relevant_cap)) && rt.ge((yield* g.call(f, P("/proc/living_player_count"), null, [])), live(relevant_cap))) && !truthy((rt.isIn(f, (yield* g.call(f, P("/proc/ckey"), null, [rt.sv(f, "key")])), rt.gl("admin_datums")) ? 1 : 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>＀</span>", [rt.fv(f, "hard_popcap_message", rt.gl("config"))])]);
			if (isEqual((queue_position = (yield* g.callName(f, rt.fv(f, "queued_players", rt.gl("SSticker")), "Find", [live(f.usr)]))), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You are next in line to join the game. You will be notified when a slot opens up.</span>"]);
			} else {
				if (truthy(live(queue_position))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>There are ＀ players in front of you in the queue to join the game.</span>", [subtract(live(queue_position), 1)])]);
				} else {
					rt.modField(f, rt.gl("SSticker"), "queued_players", live(f.usr), add);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You have been added to the queue to join the game. Your position in queue is ＀.</span>", [rt.getLen(f, rt.fv(f, "queued_players", rt.gl("SSticker")))])]);
				}
			}
			return live(f.dot);
		}
		yield* g.srcCall(f, "LateChoices");
	}
	if (truthy(rt.at(live(href_list), "manifest"))) {
		yield* g.srcCall(f, "ViewManifest");
	}
	if (truthy(rt.at(live(href_list), "SelectedJob"))) {
		// tg_js: only once the round runs (modern tg's check): a job link sent in pregame spawned you on the station before round start
		if ((!truthy(rt.gl("SSticker")) || !truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The round is either not ready, or has already finished...</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.gl("enter_allowed"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>There is an administrative lock on entering the game!</span>"]);
			return live(f.dot);
		}
		if ((truthy(rt.getLen(f, rt.fv(f, "queued_players", rt.gl("SSticker")))) && !truthy((rt.isIn(f, (yield* g.call(f, P("/proc/ckey"), null, [rt.sv(f, "key")])), rt.gl("admin_datums")) ? 1 : 0)))) {
			if ((rt.ge((yield* g.call(f, P("/proc/living_player_count"), null, [])), live(relevant_cap)) || !isEqual(live(f.src), rt.index(rt.fv(f, "queued_players", rt.gl("SSticker")), 1)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Server is full.</span>"]);
				return live(f.dot);
			}
		}
		yield* g.srcCall(f, "AttemptLateSpawn", rt.at(live(href_list), "SelectedJob"));
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "ready")) && truthy(rt.at(live(href_list), "preference")))) {
		if (truthy(rt.sv(f, "client"))) {
			yield* g.callName(f, rt.fv(f, "prefs", rt.sv(f, "client")), "process_link", [live(f.src), live(href_list)]);
		}
	} else {
		if (!truthy(rt.at(live(href_list), "late_join"))) {
			yield* g.srcCall(f, "new_player_panel");
		}
	}
	return f.dot;
}, true);

// /mob/dead/new_player/proc/make_me_an_observer  (code/modules/mob/dead/new_player/new_player.dm:258)  may sleep
rt.def("/mob/dead/new_player/proc/make_me_an_observer", function* make_me_an_observer(f: Frame) {
	let this_is_like_playing_right: Value = null, observer: Value = null, O: Value = null;
	f.vars = () => [this_is_like_playing_right, observer, O];
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.fv(f, "client", live(f.src))))) {
		rt.setSv(f, "ready", 0);
		return 0;
	}
	this_is_like_playing_right = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Are you sure you wish to observe? You will not be able to play this round!", "Player Setup", "Yes", "No"]));
	if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.fv(f, "client", live(f.src)))) || !isEqual(live(this_is_like_playing_right), "Yes"))) {
		rt.setSv(f, "ready", 0);
		rt.op(f, "Browse", [], [live(f.src), null, "window=playersetup"], false);
		yield* g.srcCall(f, "new_player_panel");
		return 0;
	}
	observer = (yield* g.new_(f, T("/mob/dead/observer"), []));
	rt.setSv(f, "spawning", 1);
	rt.setFv(f, "started_as_observer", live(observer), 1);
	yield* g.srcCall(f, "close_spawn_windows");
	O = rt.locateIn(f, "landmark*Observer-Start", rt.world());
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Now teleporting.</span>"]);
	if (truthy(live(O))) {
		rt.setFv(f, "loc", live(observer), rt.fv(f, "loc", live(O)));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Teleporting failed. Ahelp an admin please</span>"]);
		yield* g.call(f, P("/proc/stack_trace"), null, ["There's no freaking observer landmark available on this map or you're making observers before the map is initialised"]);
	}
	rt.setFv(f, "key", live(observer), rt.sv(f, "key"));
	rt.setFv(f, "client", live(observer), rt.sv(f, "client"));
	yield* g.callName(f, live(observer), "set_ghost_appearance", []);
	if ((truthy(rt.fv(f, "client", live(observer))) && truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(observer)))))) {
		rt.setFv(f, "real_name", live(observer), rt.gv(f, "real_name", rt.gv(f, "prefs", rt.fv(f, "client", live(observer)))));
		rt.setFv(f, "name", live(observer), rt.fv(f, "real_name", live(observer)));
	}
	yield* g.callName(f, live(observer), "update_icon", []);
	yield* g.callName(f, live(observer), "stop_sound_channel", [1024]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mind")]);
	rt.setSv(f, "mind", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);

// /mob/dead/new_player/proc/IsJobAvailable  (code/modules/mob/dead/new_player/new_player.dm:295)  may sleep
rt.def("/mob/dead/new_player/proc/IsJobAvailable", function* IsJobAvailable(f: Frame, rank: Value) {
	let job: Value = null, J: Value = null;
	let $e: any;
	f.vars = () => [rank, job, J, $e];
	if (!truthy((job = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [live(rank)]))))) {
		return 0;
	}
	if ((rt.ge(rt.fv(f, "current_positions", live(job)), rt.fv(f, "total_positions", live(job))) && !isEqual(rt.fv(f, "total_positions", live(job)), -1))) {
		if (isEqual(rt.fv(f, "title", live(job)), "Assistant")) {
			J = null;
			rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
			while (($e = rt.next(f, 0)) !== undefined) {
				J = $e;
				if (((truthy(live(J)) && rt.lt(rt.fv(f, "current_positions", live(J)), rt.fv(f, "total_positions", live(J)))) && !isEqual(rt.fv(f, "title", live(J)), rt.fv(f, "title", live(job))))) {
					return 0;
				}
			}
			rt.endFor(f, 0);
		} else {
			return 0;
		}
	}
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.src), live(rank)])))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "enforce_human_authority", rt.gl("config"))) && !truthy((yield* g.callName(f, rt.gv(f, "pref_species", rt.fv(f, "prefs", rt.sv(f, "client"))), "qualifies_for_rank", [live(rank), rt.gv(f, "features", rt.fv(f, "prefs", rt.sv(f, "client")))]))))) {
		return 0;
	}
	return 1;
}, true);

// /mob/dead/new_player/proc/AttemptLateSpawn  (code/modules/mob/dead/new_player/new_player.dm:317)  may sleep
rt.def("/mob/dead/new_player/proc/AttemptLateSpawn", function* AttemptLateSpawn(f: Frame, rank: Value) {
	let arrivals_docked: Value = null, character: Value = null, equip: Value = null, Spl: Value = null, humanc: Value = null;
	let $0: any;
	f.vars = () => [rank, arrivals_docked, character, equip, Spl, humanc, $0];
	if (!truthy((yield* g.srcCall(f, "IsJobAvailable", live(rank))))) {
		yield* g.call(f, P("/proc/alert"), null, [live(f.src), fmt("＀ is not available. Please try another.", [live(rank)])]);
		return 0;
	}
	if (truthy(rt.fv(f, "late_join_disabled", rt.gl("SSticker")))) {
		yield* g.call(f, P("/proc/alert"), null, [live(f.src), "An administrator has disabled late join spawning."]);
		return 0;
	}
	arrivals_docked = 1;
	if (truthy(rt.fv(f, "arrivals", rt.gl("SSshuttle")))) {
		yield* g.srcCall(f, "close_spawn_windows");
		if ((truthy(rt.gv(f, "damaged", rt.fv(f, "arrivals", rt.gl("SSshuttle")))) && truthy(rt.fv(f, "arrivals_shuttle_require_safe_latejoin", rt.gl("config"))))) {
			rt.op(f, "Output", [], [live(f.src), (yield* g.call(f, P("/proc/alert"), null, ["The arrivals shuttle is currently malfunctioning! You cannot join."]))], false);
			return 0;
		}
		arrivals_docked = (!isEqual(rt.gv(f, "mode", rt.fv(f, "arrivals", rt.gl("SSshuttle"))), "call") ? 1 : 0);
	}
	(rt.modField(f, rt.gl("SSticker"), "queued_players", live(f.src), subtract));
	rt.setFv(f, "queue_delay", rt.gl("SSticker"), 4);
	yield* g.callName(f, rt.gl("SSjob"), "AssignRole", [live(f.src), live(rank), 1]);
	character = (yield* g.srcCall(f, "create_character", 1));
	if (truthy((rt.istype((equip = (yield* g.callName(f, rt.gl("SSjob"), "EquipRank", [live(character), live(rank), 1]))), T("/mob/living")) ? 1 : 0))) {
		character = live(equip);
	}
	yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(character)]);
	if (!truthy(live(arrivals_docked))) {
		yield* g.callName(f, (Spl = (yield* g.new_(f, T("/obj/screen/splash"), [rt.fv(f, "client", live(character)), 1]))), "Fade", [1]);
		yield* g.callName(f, live(character), "playsound_local", [rt.getStep(f, live(character), 0), rt.rsc("sound/voice/ApproachingTG.ogg"), 25]);
	}
	yield* g.callName(f, live(character), "update_parallax_teleport", []);
	rt.modField(f, rt.gl("SSticker"), "minds", rt.fv(f, "mind", live(character)), add);
	humanc = null;
	if (truthy((rt.istype(live(character), T("/mob/living/carbon/human")) ? 1 : 0))) {
		humanc = live(character);
	}
	if (truthy(live(humanc))) {
		yield* g.callName(f, rt.gl("data_core"), "manifest_inject", [live(humanc)]);
		if (truthy(rt.fv(f, "arrivals", rt.gl("SSshuttle")))) {
			yield* g.callName(f, rt.fv(f, "arrivals", rt.gl("SSshuttle")), "QueueAnnounce", [live(humanc), live(rank)]);
		} else {
			yield* g.call(f, P("/proc/AnnounceArrival"), null, [live(humanc), live(rank)]);
		}
		yield* g.srcCall(f, "AddEmploymentContract", live(humanc));
		if (truthy(rt.gl("highlander"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(humanc), "<span class='userdanger'><i>THERE CAN BE ONLY ONE!!!</i></span>"]);
			yield* g.callName(f, live(humanc), "make_scottish", []);
		}
	}
	rt.modGl("joined_player_list", rt.fv(f, "ckey", live(character)), add);
	if (!(truthy(rt.fv(f, "allow_latejoin_antagonists", rt.gl("config"))) && truthy(live(humanc)))) return f.dot;
	if (!truthy(rt.fv(f, "emergency", rt.gl("SSshuttle")))) return f.dot;
	$0 = rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	if ($0 === "recall" || $0 === "idle") {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "make_antag_chance", [live(humanc)]);
	} else if ($0 === "call") {
		if (!rt.gt((yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [1])), multiply(rt.initial(f, rt.gl("SSshuttle"), "emergencyCallTime"), 0.5))) return f.dot;
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "make_antag_chance", [live(humanc)]);
	}
	return f.dot;
}, true);

// /mob/dead/new_player/proc/AddEmploymentContract  (code/modules/mob/dead/new_player/new_player.dm:383)  may sleep
rt.def("/mob/dead/new_player/proc/AddEmploymentContract", function* AddEmploymentContract(f: Frame, employee: Value) {
	let C: Value = null, employmentCabinet: Value = null;
	let $e: any;
	f.vars = () => [employee, C, employmentCabinet, $e];
	C = null;
	rt.forList(f, 0, rt.gl("employmentCabinets"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(rt.gv(f, "virgin", (employmentCabinet = live(C))))) {
			yield* g.callName(f, live(employmentCabinet), "addFile", [live(employee)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/dead/new_player/proc/LateChoices  (code/modules/mob/dead/new_player/new_player.dm:390)  may sleep
rt.def("/mob/dead/new_player/proc/LateChoices", function* LateChoices(f: Frame) {
	let mills: Value = null, mins: Value = null, hours: Value = null, dat: Value = null, available_job_count: Value = null, job: Value = null, amt: Value = null, amt_count: Value = null, a: Value = null, job_count: Value = null, job_6: Value = null, position_class: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [mills, mins, hours, dat, available_job_count, job, amt, amt_count, a, job_count, job_6, position_class, popup, $0, $e];
	mills = subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker")));
	mins = divide(rt.modulus(live(mills), 36000), 600);
	hours = divide(live(mills), 36000);
	dat = fmt("<div class='notice'>Round Duration: ＀h ＀m</div>", [(yield* g.call(f, P("/proc/round"), null, [live(hours)])), (yield* g.call(f, P("/proc/round"), null, [live(mins)]))]);
	if (truthy(rt.fv(f, "emergency", rt.gl("SSshuttle")))) {
		$0 = rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle")));
		if ($0 === "escape") {
			dat = rt.modify(live(dat), "<div class='notice red'>The station has been evacuated.</div><br>", add);
		} else if ($0 === "call") {
			if (!truthy((yield* g.callName(f, rt.gl("SSshuttle"), "canRecall", [])))) {
				dat = rt.modify(live(dat), "<div class='notice red'>The station is currently undergoing evacuation procedures.</div><br>", add);
			}
		}
	}
	available_job_count = 0;
	job = null;
	rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		job = $e;
		if ((truthy(live(job)) && truthy((yield* g.srcCall(f, "IsJobAvailable", rt.fv(f, "title", live(job))))))) {
			available_job_count = rt.inc(live(available_job_count), 1);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.length(rt.fv(f, "prioritized_jobs", rt.gl("SSjob"))))) {
		dat = rt.modify(live(dat), "<div class='notice red'>The station has flagged these jobs as high priority:<br>", add);
		amt = rt.length(rt.fv(f, "prioritized_jobs", rt.gl("SSjob")));
		amt_count = null;
		a = null;
		rt.forList(f, 0, rt.fv(f, "prioritized_jobs", rt.gl("SSjob")), T("/datum/job"));
		while (($e = rt.next(f, 0)) !== undefined) {
			a = $e;
			amt_count = rt.inc(live(amt_count), 1);
			if (!isEqual(live(amt_count), live(amt))) {
				dat = rt.modify(live(dat), fmt(" ＀, ", [rt.fv(f, "title", live(a))]), add);
			} else {
				dat = rt.modify(live(dat), fmt(" ＀. </div>", [rt.fv(f, "title", live(a))]), add);
			}
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), "<div class='clearBoth'>Choose from the following open positions:</div><br>", add);
	dat = rt.modify(live(dat), "<div class='jobs'><div class='jobsColumn'>", add);
	job_count = 0;
	job_6 = null;
	rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
	while (($e = rt.next(f, 0)) !== undefined) {
		job_6 = $e;
		if ((truthy(live(job_6)) && truthy((yield* g.srcCall(f, "IsJobAvailable", rt.fv(f, "title", live(job_6))))))) {
			job_count = rt.inc(live(job_count), 1);
			if (rt.gt(live(job_count), (yield* g.call(f, P("/proc/round"), null, [divide(live(available_job_count), 2)])))) {
				dat = rt.modify(live(dat), "</div><div class='jobsColumn'>", add);
			}
			position_class = "otherPosition";
			if (truthy((rt.isIn(f, rt.fv(f, "title", live(job_6)), rt.gl("command_positions")) ? 1 : 0))) {
				position_class = "commandPosition";
			}
			dat = rt.modify(live(dat), fmt("<a class='＀' href='byond://?src=＃;SelectedJob=＀'>＀ (＀)</a><br>", [live(position_class), live(f.src), rt.fv(f, "title", live(job_6)), rt.fv(f, "title", live(job_6)), rt.fv(f, "current_positions", live(job_6))]), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(job_count))) {
		job_6 = null;
		rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
		while (($e = rt.next(f, 0)) !== undefined) {
			job_6 = $e;
			if (!isEqual(rt.fv(f, "title", live(job_6)), "Assistant")) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("<a class='otherPosition' href='byond://?src=＃;SelectedJob=＀'>＀ (＀)</a><br>", [live(f.src), rt.fv(f, "title", live(job_6)), rt.fv(f, "title", live(job_6)), rt.fv(f, "current_positions", live(job_6))]), add);
			break;
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), "</div></div>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.src), "latechoices", "Choose Profession", 440, 500]))), "add_stylesheet", ["playeroptions", rt.rsc("html/browser/playeroptions.css")]);
	yield* g.callName(f, live(popup), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", [0]);
	return f.dot;
}, true);

// /mob/dead/new_player/proc/create_character  (code/modules/mob/dead/new_player/new_player.dm:452)  may sleep
rt.def("/mob/dead/new_player/proc/create_character", function* create_character(f: Frame, transfer_after: Value) {
	let H: Value = null;
	f.vars = () => [transfer_after, H];
	rt.setSv(f, "spawning", 1);
	yield* g.srcCall(f, "close_spawn_windows");
	H = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.sv(f, "loc")]));
	if ((truthy(rt.fv(f, "force_random_names", rt.gl("config"))) || truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(f.src), "appearance"]))))) {
		yield* g.callName(f, rt.fv(f, "prefs", rt.sv(f, "client")), "random_character", []);
		rt.setFv(f, "real_name", rt.fv(f, "prefs", rt.sv(f, "client")), (yield* g.callName(f, rt.gv(f, "pref_species", rt.fv(f, "prefs", rt.sv(f, "client"))), "random_name", [rt.sv(f, "gender"), 1])));
	}
	yield* g.callName(f, rt.fv(f, "prefs", rt.sv(f, "client")), "copy_to", [live(H)]);
	yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_dna_identity", []);
	if (truthy(rt.sv(f, "mind"))) {
		rt.setFv(f, "active", rt.sv(f, "mind"), 0);
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(H)]);
	}
	rt.setFv(f, "name", live(H), rt.sv(f, "real_name"));
	f.dot = live(H);
	rt.setSv(f, "new_character", live(f.dot));
	if (!truthy(live(transfer_after))) return f.dot;
	yield* g.srcCall(f, "transfer_character");
	return f.dot;
}, true);

// /mob/dead/new_player/proc/transfer_character  (code/modules/mob/dead/new_player/new_player.dm:473)  may sleep
rt.def("/mob/dead/new_player/proc/transfer_character", function* transfer_character(f: Frame) {
	f.dot = rt.sv(f, "new_character");
	if (!truthy(live(f.dot))) return f.dot;
	rt.setFv(f, "key", rt.sv(f, "new_character"), rt.sv(f, "key"));
	yield* g.callName(f, rt.sv(f, "new_character"), "stop_sound_channel", [1024]);
	rt.setSv(f, "new_character", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/dead/new_player/proc/ViewManifest  (code/modules/mob/dead/new_player/new_player.dm:481)
rt.def("/mob/dead/new_player/proc/ViewManifest", function ViewManifest(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = "<html><body>";
	dat = rt.modify(live(dat), "<h4>Crew Manifest</h4>", add);
	dat = rt.modify(live(dat), rt.callName(f, rt.gl("data_core"), "get_manifest", ["OOC", 1], rt.Args.Named), add);
	rt.op(f, "Browse", [], [live(f.src), live(dat), "window=manifest;size=387x420;can_close=1"], false);
	return f.dot;
});

// /mob/dead/new_player/proc/close_spawn_windows  (code/modules/mob/dead/new_player/new_player.dm:493)
rt.def("/mob/dead/new_player/proc/close_spawn_windows", function close_spawn_windows(f: Frame) {
	rt.op(f, "Browse", [], [live(f.src), null, "window=latechoices"], false);
	rt.op(f, "Browse", [], [live(f.src), null, "window=playersetup"], false);
	rt.op(f, "Browse", [], [live(f.src), null, "window=preferences"], false);
	rt.op(f, "Browse", [], [live(f.src), null, "window=mob_occupation"], false);
	rt.op(f, "Browse", [], [live(f.src), null, "window=latechoices"], false);
	return f.dot;
});
