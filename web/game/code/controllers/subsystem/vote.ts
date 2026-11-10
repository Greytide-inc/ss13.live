// Based on /tg/station's code/controllers/subsystem/vote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, truthy, add, fmt } = rt;


rt.type(50, "/datum/controller/subsystem/vote", "/datum/controller/subsystem", {
	initiator: null,
	started_time: null,
	time_remaining: 0,
	mode: null,
	question: null,
	choices: null,
	voted: null,
	voted_ids: null,
	arrivals: null,
	removals: null,
	voting: null,
	generated_actions: null,
	boot_ckey: null,
	boot_address: null,
	name: "Vote",
	wait: 10,
	flags: 33,
	runlevels: 15,
});

// vote.dm:1
rt.def("/datum/controller/subsystem/vote/proc/New", function* New(f: Frame) {
	if (GLOB.SSvote != this) {
		if (rt.istype(GLOB.SSvote, T("/datum/controller/subsystem/vote"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSvote);
		}
		GLOB.SSvote = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// vote.dm:14
rt.def("/datum/controller/subsystem/vote/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.choices = list();

	this.voted = list();

	this.voted_ids = list();
	this.arrivals = list();
	this.removals = list();
	this.voting = list();

	this.generated_actions = list();
	return f.dot;
});

// vote.dm:21
rt.def("/datum/controller/subsystem/vote/proc/fire", function* fire(f: Frame) {
	let C: Value = null, client_popup: Value = null, C_1: Value = null;
	if (!this.mode) return f.dot;
	this.time_remaining = round((this.started_time + GLOB.config.vote_period - rt.worldTime(f)) / 10);
	if (this.time_remaining < 0) {
		yield* this.result();
		for (C of each(this.voting, T("/client"))) {
			rt.op(f, "Browse", [], [C, null, "window=vote;can_close=0"], false);
		}
		yield* this.reset();
	} else {
		for (C_1 of each(this.voting, T("/client"))) {
			(client_popup = (yield* new_(T("/datum/browser"), C_1, "vote", "Voting Panel"))).set_window_options("can_close=0");
			client_popup.set_content(this.interface(C_1));
			yield* client_popup.open(0);
		}
	}
	return f.dot;
}, true);

// vote.dm:42
rt.def("/datum/controller/subsystem/vote/proc/reset", function* reset(f: Frame) {
	this.initiator = null;
	this.time_remaining = 0;
	this.mode = null;
	this.question = null;
	this.boot_ckey = null;
	this.boot_address = null;
	this.choices.Cut();
	this.voted.Cut();
	this.voted_ids.Cut();
	this.voting.Cut();
	yield* this.remove_action_buttons();
	return f.dot;
}, true);

// vote.dm:51
rt.def("/datum/controller/subsystem/vote/proc/get_result", function get_result(f: Frame) {
	let option: Value = null, votes: Value = null, non_voters: Value = null, non_voter_ckey: Value = null, C: Value = null, seen: Value = null, id: Value = null;
	let greatest_votes: Value = 0;
	let total_votes: Value = 0;
	for (option of each(this.choices)) {
		total_votes += (votes = rt.index(this.choices, option));
		if (votes > greatest_votes) {
			greatest_votes = votes;
		}
	}
	if (!GLOB.config.vote_no_default && rt.len(f, this.choices)) {
		non_voters = GLOB.directory.Copy();
		non_voters -= this.voted;
		seen = this.voted_ids.Copy(); // ss13.live: one vote per address, so one non-voter per address too, and none from an address that voted
		for (non_voter_ckey of each(non_voters)) {
			if (!(C = rt.index(non_voters, non_voter_ckey)) || C.is_afk() || rt.isIn(f, (id = this.vote_id(C)), seen)) {
				non_voters -= non_voter_ckey;
			} else {
				seen += id;
			}
		}
		if (rt.len(f, non_voters) > 0) {
			if (this.mode == "restart") {
				rt.modAt(this.choices, "Continue Playing", rt.len(f, non_voters), add);
				if (rt.at(this.choices, "Continue Playing") >= greatest_votes) {
					greatest_votes = rt.at(this.choices, "Continue Playing");
				}
			} else if (this.mode == "shuttle" || this.mode == "boot") {
				// ss13.live: online players who didn't vote count as "Keep playing" / "Let them stay", as in the restart vote
				option = this.status_quo();
				rt.modAt(this.choices, option, rt.len(f, non_voters), add);
				if (rt.at(this.choices, option) >= greatest_votes) {
					greatest_votes = rt.at(this.choices, option);
				}
			} else if (this.mode == "gamemode") {
				if (rt.isIn(f, GLOB.master_mode, this.choices)) {
					rt.modAt(this.choices, GLOB.master_mode, rt.len(f, non_voters), add);
					if (rt.index(this.choices, GLOB.master_mode) >= greatest_votes) {
						greatest_votes = rt.index(this.choices, GLOB.master_mode);
					}
				}
			}
		}
	}
	f.dot = list();
	if (greatest_votes) {
		option = null;
		for (option of each(this.choices)) {
			if (rt.index(this.choices, option) == greatest_votes) {
				f.dot += option;
			}
		}
	}
	return f.dot;
});

// vote.dm:83
rt.def("/datum/controller/subsystem/vote/proc/announce_result", function* announce_result(f: Frame) {
	let text: Value = null, i: Value = null, votes: Value = null, option: Value = null;
	let winners: Value = this.get_result();
	if (rt.len(f, winners) > 0) {
		if (this.question) {
			text += `<b>${this.question}</b>`;
		} else {
			text += `<b>${capitalize(this.mode)} Vote</b>`;
		}
		i = 1;
		while (i <= rt.len(f, this.choices)) {
			if (!(votes = rt.index(this.choices, rt.index(this.choices, i)))) {
				votes = 0;
			}
			text += `\n<b>${rt.index(this.choices, i)}:</b> ${votes}`;
			i++;
		}
		if (this.mode != "custom") {
			if (rt.len(f, winners) > 1) {
				text = "\n<b>Vote Tied Between:</b>";
				for (option of each(winners)) {
					text += `\n\t${option}`;
				}
			}
			// ss13.live: a tied shuttle or boot vote changes nothing
			if (rt.callSrc(f, "status_quo", []) !== null && rt.isIn(f, rt.callSrc(f, "status_quo", []), winners)) {
				f.dot = rt.callSrc(f, "status_quo", []);
			} else {
				f.dot = pick(winners);
			}
			text += `\n<b>Vote Result: ${f.dot}</b>`;
		} else {
			text += `\n<b>Did not vote:</b> ${rt.len(f, GLOB.clients) - rt.len(f, this.voted)}`;
		}
	} else {
		text += "<b>Vote Result: Inconclusive - No Votes!</b>";
	}
	log_vote(text);
	yield* this.remove_action_buttons();
	to_chat(rt.world(), `\n<font color='purple'>${text}</font>`);
	return f.dot;
}, true);

// vote.dm:112
rt.def("/datum/controller/subsystem/vote/proc/result", function* result(f: Frame) {
	let active_admins: Value = null, C: Value = null;
	let $e: any;
	f.dot = (yield* this.announce_result());
	let restart: Value = 0;
	if (f.dot) {
		if (this.mode === "restart") {
			if (f.dot == "Restart Round") {
				restart = 1;
			}
		} else if (this.mode === "shuttle") {
			if (f.dot == "Call the shuttle") {
				yield* this.shuttle_vote_passed();
			}
		} else if (this.mode === "boot") {
			if (f.dot == "Boot them") {
				yield* this.boot_vote_passed();
			}
		} else if (this.mode === "map") {
			yield* this.map_vote_passed(f.dot);
		} else if (this.mode === "gamemode") {
			if (GLOB.master_mode != f.dot) {
				GLOB.SSticker.save_mode(f.dot);
				if (GLOB.SSticker.HasRoundStarted()) {
					restart = 1;
				} else {
					GLOB.master_mode = f.dot;
				}
			}
		}
	}
	if (restart) {
		active_admins = 0;
		for (C of each(GLOB.admins, T("/client"))) {
			if (!C.is_afk() && check_rights_for(C, 16)) {
				active_admins = 1;
				break;
			}
		}
		if (!active_admins) {
			yield* GLOB.SSticker.Reboot("Restart vote successful.", "restart vote");
		} else {
			to_chat(rt.world(), "<span style='boldannounce'>Notice:Restart vote will not restart the server automatically because there are active admins on.</span>");
			message_admins("A restart vote has passed, but there are active admins on with +server, so it has been canceled. If you wish, you may restart the server.");
		}
	}
	return f.dot;
}, true);

// vote.dm:142
rt.def("/datum/controller/subsystem/vote/proc/submit_vote", function* submit_vote(f: Frame, vote: Value) {
	let id: Value = null;
	if (this.mode) {
		if (GLOB.config.vote_no_dead && f.usr.stat == 2 && !f.usr.client.holder) {
			return 0;
		}
		if (!rt.isIn(f, f.usr.ckey, this.voted)) {
			if (vote && 1 <= vote && vote <= rt.len(f, this.choices)) {
				if (yield* this.newcomer_refused(f.usr.client, "vote")) return 0;
				id = rt.callSrc(f, "vote_id", [f.usr.client]);
				if (rt.isIn(f, id, this.voted_ids)) { // ss13.live: one vote per address (plans/server-rules.md step 3)
					to_chat(f.usr, "<span class='warning'>Someone at your address has already voted: one vote per address.</span>");
					return 0;
				}
				this.voted_ids += id;
				this.voted += f.usr.ckey;
				rt.incAt(this.choices, rt.index(this.choices, vote), 1, true);
				return vote;
			}
		}
	}
	return 0;
}, true);

// vote.dm:152
rt.def("/datum/controller/subsystem/vote/proc/initiate_vote", function* initiate_vote(f: Frame, vote_type: Value, initiator_key: Value, target: Value) {
	let next_allowed_time: Value = null, admin: Value = null, ckey: Value = null, i: Value = null, option: Value = null, text: Value = null, c: Value = null, C: Value = null, V: Value = null;
	let $e: any;
	if (!this.mode) {
		if (initiator_key !== null && (yield* this.newcomer_refused(f.usr.client, "start a vote"))) { // ss13.live: plans/server-rules.md step 4
			return 0;
		}
		if (this.started_time) {
			next_allowed_time = this.started_time + GLOB.config.vote_delay;
			if (this.mode) {
				to_chat(f.usr, "<span class='warning'>There is already a vote in progress! please wait for it to finish.</span>");
				return 0;
			}
			admin = 0;
			ckey = (yield* g.call(f, P("/proc/ckey"), null, [initiator_key]));
			if (rt.index(GLOB.admin_datums, ckey) || rt.isIn(f, ckey, GLOB.deadmins)) {
				admin = 1;
			}
			if (initiator_key === null) { // ss13.live: started by the game itself (the map vote when the shuttle leaves)
				admin = 1;
			}
			if (next_allowed_time > rt.worldTime(f) && !admin) {
				to_chat(f.usr, `<span class='warning'>A vote was initiated recently, you must wait roughly ${(next_allowed_time - rt.worldTime(f)) / 10} seconds before a new vote can be started!</span>`);
				return 0;
			}
		}
		yield* this.reset();
		if (vote_type === "restart") {
			this.choices.Add("Restart Round", "Continue Playing");
		} else if (vote_type === "shuttle") {
			if (!(yield* this.shuttle_vote_useful())) {
				to_chat(f.usr, "<span class='warning'>The emergency shuttle is already on its way, or gone.</span>");
				return 0;
			}
			this.choices.Add("Call the shuttle", "Keep playing");
		} else if (vote_type === "boot") {
			// ss13.live: target is the client picked in Topic (boot_pick); it may have left while the starter was picking
			if (!rt.istype(target, T("/client"))) {
				return 0;
			}
			this.boot_ckey = target.ckey;
			this.boot_address = target.address;
			this.question = `Boot ${(yield* this.boot_label(target))} for the rest of the round?`;
			this.choices.Add("Boot them", "Let them stay");
		} else if (vote_type === "map") {
			this.choices.Add((yield* this.map_choices()));
			if (rt.len(f, this.choices) < 2) {
				to_chat(f.usr, "<span class='warning'>There aren't two maps to choose from for this many players (config/maps.txt).</span>");
				this.choices.Cut();
				return 0;
			}
		} else if (vote_type === "gamemode") {
			this.choices.Add(GLOB.config.votable_modes);
		} else if (vote_type === "custom") {
			this.question = (yield* stripped_input(f.usr, "What is the vote for?"));
			if (!this.question) {
				return 0;
			}
			i = 1;
			while (i <= 10) {
				if (!(option = capitalize((yield* stripped_input(f.usr, "Please enter an option or hit cancel to finish")))) || this.mode || !f.usr.client) {
					break;
				}
				this.choices.Add(option);
				i++;
			}
		} else {
			return 0;
		}
		this.mode = vote_type;
		this.initiator = initiator_key === null ? "the station" : initiator_key;
		this.started_time = rt.worldTime(f);
		text = `${capitalize(this.mode)} vote started by ${this.initiator}.`;
		if (this.mode == "custom" || this.mode == "boot") {
			text += `\n${this.question}`;
		}
		log_vote(text);
		to_chat(rt.world(), fmt("\n<font color='purple'><b>＀</b>\nType <b>vote</b> or click <a href='?src=＃'>here</a> to place your votes.\nYou have ＀ seconds to vote.</font>", [text, this, GLOB.config.vote_period / 10]));
		this.time_remaining = round(GLOB.config.vote_period / 10);
		for (c of each(GLOB.clients)) {
			C = c;
			V = (yield* new_(T("/datum/action/vote")));
			if (this.question) {
				V.name = `Vote: ${this.question}`;
			}
			yield* V.Grant(C.mob);
			this.generated_actions += V;
		}
		return 1;
	}
	return 0;
}, true);

// vote.dm:205
rt.def("/datum/controller/subsystem/vote/proc/interface", function _interface(f: Frame, C: Value) {
	let i: Value = null, votes: Value = null;
	let $0: any, $1: any;
	if (!C) {
		return f.dot;
	}
	let admin: Value = 0;
	let trialmin: Value = 0;
	if (C.holder) {
		admin = 1;
		if (check_rights_for(C, 2)) {
			trialmin = 1;
		}
	}
	(rt.modSrcVar(f, "voting", C, rt.bitOr));
	if (this.mode) {
		if (this.question) {
			f.dot += `<h2>Vote: '${this.question}'</h2>`;
		} else {
			f.dot += `<h2>Vote: ${capitalize(this.mode)}</h2>`;
		}
		f.dot += `Time Left: ${this.time_remaining} s<hr><ul>`;
		i = 1;
		while (i <= rt.len(f, this.choices)) {
			if (!(votes = rt.index(this.choices, rt.index(this.choices, i)))) {
				votes = 0;
			}
			f.dot += fmt("<li><a href='?src=＃;vote=＀'>＀</a> (＀ votes)</li>", [this, i, rt.index(this.choices, i), votes]);
			i++;
		}
		f.dot += "</ul><hr>";
		if (admin) {
			f.dot += fmt("(<a href='?src=＃;vote=cancel'>Cancel Vote</a>) ", [this]);
		}
	} else {
		f.dot += "<h2>Start a vote:</h2><hr><ul><li>";
		if (trialmin || GLOB.config.allow_vote_restart) {
			f.dot += fmt("<a href='?src=＃;vote=restart'>Restart</a>", [this]);
		} else {
			f.dot += "<font color='grey'>Restart (Disallowed)</font>";
		}
		if (trialmin) {
			$0 = this;
			if (GLOB.config.allow_vote_restart) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot += fmt("\t(<a href='?src=＃;vote=toggle_restart'>＀</a>)", [$0, $1]);
		}
		f.dot += "</li><li>";
		if (trialmin || GLOB.config.allow_vote_mode) {
			f.dot += fmt("<a href='?src=＃;vote=gamemode'>GameMode</a>", [this]);
		} else {
			f.dot += "<font color='grey'>GameMode (Disallowed)</font>";
		}
		if (trialmin) {
			$0 = this;
			if (GLOB.config.allow_vote_mode) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot += fmt("\t(<a href='?src=＃;vote=toggle_gamemode'>＀</a>)", [$0, $1]);
		}
		// ss13.live: the shuttle vote
		f.dot += "</li><li>";
		if (trialmin || GLOB.config.allow_vote_shuttle) {
			f.dot += fmt("<a href='?src=＃;vote=shuttle'>Shuttle</a>", [this]);
		} else {
			f.dot += "<font color='grey'>Shuttle (Disallowed)</font>";
		}
		if (trialmin) {
			$0 = this;
			if (GLOB.config.allow_vote_shuttle) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot += fmt("\t(<a href='?src=＃;vote=toggle_shuttle'>＀</a>)", [$0, $1]);
		}
		// ss13.live: the map vote
		f.dot += "</li><li>";
		if (trialmin || GLOB.config.allow_vote_map) {
			f.dot += fmt("<a href='?src=＃;vote=map'>Next map</a>", [this]);
		} else {
			f.dot += "<font color='grey'>Next map (Disallowed)</font>";
		}
		if (trialmin) {
			$0 = this;
			if (GLOB.config.allow_vote_map) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot += fmt("\t(<a href='?src=＃;vote=toggle_map'>＀</a>)", [$0, $1]);
		}
		// ss13.live: the boot vote
		f.dot += "</li><li>";
		if (trialmin || GLOB.config.allow_vote_boot) {
			f.dot += fmt("<a href='?src=＃;vote=boot'>Boot a player</a>", [this]);
		} else {
			f.dot += "<font color='grey'>Boot a player (Disallowed)</font>";
		}
		if (trialmin) {
			$0 = this;
			if (GLOB.config.allow_vote_boot) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot += fmt("\t(<a href='?src=＃;vote=toggle_boot'>＀</a>)", [$0, $1]);
		}
		f.dot += "</li>";
		if (trialmin) {
			f.dot += fmt("<li><a href='?src=＃;vote=custom'>Custom</a></li>", [this]);
		}
		f.dot += "</ul><hr>";
	}
	return (f.dot += fmt("<a href='?src=＃;vote=close' style='position:absolute;right:50px'>Close</a>", [this]));
});

// vote.dm:257
rt.def("/datum/controller/subsystem/vote/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	let $0: any;
	if (!f.usr || !f.usr.client) {
		return f.dot;
	}
	const item = rt.at(href_list, "vote");
	if (item === "close") {
		this.voting -= f.usr.client;
		rt.op(f, "Browse", [], [f.usr, null, "window=vote"], false);
		return f.dot;
	} else if (item === "cancel") {
		if (f.usr.client.holder) {
			yield* this.reset();
		}
	} else if (item === "toggle_restart") {
		if (f.usr.client.holder) {
			GLOB.config.allow_vote_restart = (!GLOB.config.allow_vote_restart ? 1 : 0);
		}
	} else if (item === "toggle_gamemode") {
		if (f.usr.client.holder) {
			GLOB.config.allow_vote_mode = (!GLOB.config.allow_vote_mode ? 1 : 0);
		}
	} else if (item === "restart") {
		if (GLOB.config.allow_vote_restart || f.usr.client.holder) {
			yield* this.initiate_vote("restart", f.usr.key);
		}
	} else if (item === "toggle_shuttle") {
		if (f.usr.client.holder) {
			GLOB.config.allow_vote_shuttle = (!GLOB.config.allow_vote_shuttle ? 1 : 0);
		}
	} else if (item === "shuttle") {
		if (GLOB.config.allow_vote_shuttle || f.usr.client.holder) {
			yield* this.initiate_vote("shuttle", f.usr.key);
		}
	} else if (item === "toggle_map") {
		if (f.usr.client.holder) {
			GLOB.config.allow_vote_map = (!GLOB.config.allow_vote_map ? 1 : 0);
		}
	} else if (item === "map") {
		if (GLOB.config.allow_vote_map || f.usr.client.holder) {
			yield* this.initiate_vote("map", f.usr.key);
		}
	} else if (item === "toggle_boot") {
		if (f.usr.client.holder) {
			GLOB.config.allow_vote_boot = (!GLOB.config.allow_vote_boot ? 1 : 0);
		}
	} else if (item === "boot") {
		if (GLOB.config.allow_vote_boot || f.usr.client.holder) {
			$0 = (yield* this.boot_pick());
			if ($0) {
				yield* this.initiate_vote("boot", f.usr.key, $0);
			}
		}
	} else if (item === "gamemode") {
		if (GLOB.config.allow_vote_mode || f.usr.client.holder) {
			yield* this.initiate_vote("gamemode", f.usr.key);
		}
	} else if (item === "custom") {
		if (f.usr.client.holder) {
			yield* this.initiate_vote("custom", f.usr.key);
		}
	} else {
		yield* this.submit_vote(round(text2num(rt.at(href_list, "vote"))));
	}
	yield* f.usr.vote();
	return f.dot;
}, true);

// ss13.live: the shuttle vote (plans/anarchy-light.md). Worth starting while the shuttle is at CentCom, recalled, or on its way
// with more than 5 minutes left.
rt.def("/datum/controller/subsystem/vote/proc/shuttle_vote_useful", function* shuttle_vote_useful(f: Frame) {
	let E: Value = null;
	if (!(E = GLOB.SSshuttle.emergency)) return 0;
	let mode: Value = E.mode;
	if (mode == "idle" || mode == "recall") return 1;
	if (mode == "call" && E.timeLeft(10) > 300) return 1;
	return 0;
}, true);

// ss13.live: the shuttle vote passed: call the shuttle (5 minutes, the red alert speed) or cut its trip to 5 minutes, and
// lock out recalls for the rest of the round.
rt.def("/datum/controller/subsystem/vote/proc/shuttle_vote_passed", function* shuttle_vote_passed(f: Frame) {
	if (!(yield* this.shuttle_vote_useful())) return f.dot;
	let E: Value = GLOB.SSshuttle.emergency;
	let mode: Value = E.mode;
	if (mode == "call") {
		E.setTimer(3000);
		yield* priority_announce("The crew has voted to evacuate. The emergency shuttle will now arrive in 5 minutes.", null, rt.rsc("sound/ai/shuttlecalled.ogg"), "Priority");
	} else {
		yield* E.request(null, null, "\n\nThe crew has voted to evacuate.", 0, 0.5);
	}
	GLOB.SSshuttle.emergencyNoRecall = 1;
	log_game("Shuttle vote passed: emergency shuttle called, arriving in 5 minutes, recall locked.");
	return f.dot;
}, true);

// ss13.live: who a vote counts as (plans/server-rules.md step 3): one vote per address, so one person with several tabs or names
// votes once. This machine's own connections (admins, local play) count by key: they all share 127.0.0.1.
rt.def("/datum/controller/subsystem/vote/proc/vote_id", function vote_id(f: Frame, C: Value) {
	const address = C ? C.address : null;
	if (address && address != "127.0.0.1" && address != "::1") return address;
	return C ? C.ckey : null;
});

// ss13.live: new arrivals wait (plans/server-rules.md step 4). A name and address not seen this round that joins more than
// config.newcomer_wait after the round started can't use OOC, vote or start a vote for that long. Joining before then is free: the
// server starts each round as soon as its world is up, and the regulars rejoin within seconds. A known name or address shares the wait (or none) already
// recorded for it, so a reconnect, a new tab or a new name from the same address doesn't skip or restart it. arrivals: id -> world.time the wait ends.
rt.def("/datum/controller/subsystem/vote/proc/note_arrival", function note_arrival(f: Frame, C: Value) {
	const ids = [C.ckey], address = this.vote_id(C);
	if (address != ids[0]) ids.push(address);
	let until: Value = null;
	for (const id of ids) {
		const t = rt.at(this.arrivals, id);
		if (t !== null && (until === null || t < until)) until = t;
	}
	if (until === null) {
		const wait = GLOB.config.newcomer_wait;
		const late = truthy(GLOB.SSticker.HasRoundStarted()) && rt.worldTime(f) - GLOB.SSticker.round_start_time > wait;
		until = late ? rt.worldTime(f) + wait : 0;
	}
	for (const id of ids) rt.setAt(this.arrivals, id, until);
	return f.dot;
});

// Deciseconds the client still has to wait, 0 if none (admins, and this machine's own connections, never wait).
rt.def("/datum/controller/subsystem/vote/proc/newcomer_wait_left", function newcomer_wait_left(f: Frame, C: Value) {
	if (!C || C.holder) return 0;
	if (this.vote_id(C) == C.ckey) return 0;
	const until = rt.at(this.arrivals, C.ckey);
	if (until === null) return 0;
	const left = until - rt.worldTime(f);
	return left > 0 ? left : 0;
});

// Tells a waiting newcomer why `what` (OOC, vote, start a vote) is refused; returns 1 if refused.
rt.def("/datum/controller/subsystem/vote/proc/newcomer_refused", function* newcomer_refused(f: Frame, C: Value, what: Value) {
	let left: Value = rt.callSrc(f, "newcomer_wait_left", [C]);
	if (!(left > 0)) return 0;
	to_chat(C, `<span class='warning'>New arrivals can ${what} after ${Math.ceil(Number(left) / 10)} more seconds. Playing and talking in character are fine.</span>`);
	return 1;
}, true);

// ss13.live: punishments are seen (plans/server-rules.md step 5). Every kick, ban and boot vote this round goes on the list the
// round-end report shows; kicks and bans are also told to everyone at once (config.announce_removals; the boot vote announces itself).
rt.def("/datum/controller/subsystem/vote/proc/note_removal", function* note_removal(f: Frame, text: Value, announce: Value) {
	this.removals.Add(text);
	if (announce && GLOB.config.announce_removals) {
		to_chat(rt.world(), `<span class='boldannounce'>${text}</span>`);
	}
	return f.dot;
}, true);

rt.def("/datum/controller/subsystem/vote/proc/removals_report", function* removals_report(f: Frame) {
	let line: Value = null;
	if (!rt.len(f, this.removals)) return f.dot;
	let text: Value = "<br><b>Removed this round:</b>";
	for (line of each(this.removals)) {
		text += `<br>${line}`;
	}
	to_chat(rt.world(), text);
	return f.dot;
}, true);

// ss13.live: in the shuttle and boot votes the choice that changes nothing: it gets the non-voters and wins a tie. null in other votes.
rt.def("/datum/controller/subsystem/vote/proc/status_quo", function status_quo(f: Frame) {
	if (this.mode == "shuttle") return "Keep playing";
	if (this.mode == "boot") return "Let them stay";
	return null;
});

// ss13.live: the map vote (plans/anarchy-light.md step 5). The choices: config/maps.txt's maps that allow this many players.
rt.def("/datum/controller/subsystem/vote/proc/map_choices", function* map_choices(f: Frame) {
	let name: Value = null, VM: Value = null;
	let L: Value = list();
	let players: Value = rt.len(f, GLOB.clients);
	for (name of each(GLOB.config.maplist)) {
		VM = rt.index(GLOB.config.maplist, name);
		if (!VM || VM.voteweight <= 0) continue;
		if (VM.config_min_users > 0 && players < VM.config_min_users) continue;
		if (VM.config_max_users > 0 && players > VM.config_max_users) continue;
		L.Add(name);
	}
	return L;
}, true);

// The map vote ended on `name`: it is next round's map. tools/server.mjs reads the line and starts the next world on it.
rt.def("/datum/controller/subsystem/vote/proc/map_vote_passed", function* map_vote_passed(f: Frame, name: Value) {
	let VM: Value = null;
	if (!(VM = rt.index(GLOB.config.maplist, name))) return f.dot;
	GLOB.SSmapping.changemap(VM);
	let file: Value = replacetext(replacetext(VM.config_filename, "_maps/", ""), ".json", "");
	log_world(`[server-nextmap] ${file}`); // read by tools/server.mjs
	log_game(`Map vote: next round is on ${name}.`);
	to_chat(rt.world(), `<span class='boldannounce'>Next round's map: ${name}.</span>`);
	return f.dot;
}, true);

// ss13.live: the boot vote (plans/anarchy-light.md step 4): players vote a griefer off the server for the rest of the round.
// How a player shows in the picker and the vote: their character's name, then their key (the key tells two Sams apart).
rt.def("/datum/controller/subsystem/vote/proc/boot_label", function* boot_label(f: Frame, C: Value) {
	let M: Value = C.mob;
	if (M && !rt.istype(M, T("/mob/dead/new_player"))) {
		return `${M.name} (${C.key})`;
	}
	return C.key;
}, true);

// The starter picks who: any other online player who isn't an admin. Returns that client, or null.
rt.def("/datum/controller/subsystem/vote/proc/boot_pick", function* boot_pick(f: Frame) {
	let C: Value = null;
	let L: Value = list();
	for (C of each(GLOB.clients, T("/client"))) {
		if (C == f.usr.client || C.holder) continue;
		rt.setAt(L, (yield* this.boot_label(C)), C);
	}
	if (!rt.len(f, L)) {
		to_chat(f.usr, "<span class='warning'>There is nobody else here to vote off.</span>");
		return null;
	}
	let choice: Value = (yield* g.op(f, "Prompt", [1], [null, "Boot vote", "Who should the crew vote off for the rest of this round?", f.usr, L]));
	if (!choice) return null;
	C = rt.at(L, choice);
	if (!rt.istype(C, T("/client"))) return null; // left while the starter was picking
	return C;
}, true);

// The boot vote passed: tools/server.mjs refuses that key and address until the next round, and the player is disconnected.
// Their body stays where it is, as when anyone logs out.
rt.def("/datum/controller/subsystem/vote/proc/boot_vote_passed", function* boot_vote_passed(f: Frame) {
	let ckey: Value = this.boot_ckey;
	if (!ckey) return f.dot;
	let C: Value = rt.index(GLOB.directory, ckey);
	let label: Value = C ? (yield* this.boot_label(C)) : ckey;
	log_world(`[server-roundban] ${ckey} ${this.boot_address ? this.boot_address : "-"}`); // read by tools/server.mjs
	log_game(`Boot vote passed: ${label} is off the server until the next round.`);
	to_chat(rt.world(), `<span class='boldannounce'>${label} was voted off the station for the rest of the round.</span>`);
	yield* this.note_removal(`${label} was voted off the station.`, 0);
	if (C) {
		to_chat(C, "<span class='danger'>The crew voted you off the station for the rest of this round. You can come back next round.</span>");
		yield* qdel(C);
	}
	return f.dot;
}, true);

// vote.dm:287
rt.def("/datum/controller/subsystem/vote/proc/remove_action_buttons", function* remove_action_buttons(f: Frame) {
	let v: Value = null, V: Value = null;
	for (v of each(this.generated_actions)) {
		if (!(!(V = v) || V.gc_destroyed)) {
			yield* V.Remove(V.owner);
		}
	}
	this.generated_actions = list();
	return f.dot;
}, true);

// vote.dm:297
rt.def("/mob/verb/vote", function* vote(f: Frame) {
	let popup: Value = null;
	(popup = (yield* new_(T("/datum/browser"), this, "vote", "Voting Panel"))).set_window_options("can_close=0");
	popup.set_content(GLOB.SSvote.interface(this.client));
	yield* popup.open(0);
	return f.dot;
}, true, { verb: { name: "Vote", category: "OOC" } });

rt.type(175, "/datum/action/vote", "/datum/action", {
	name: "Vote!",
	button_icon_state: "vote",
});

// vote.dm:308
rt.def("/datum/action/vote/proc/Trigger", function* Trigger(f: Frame) {
	if (!this.owner) return f.dot;
	yield* this.owner.vote();
	yield* this.Remove(this.owner);
	return f.dot;
}, true);
