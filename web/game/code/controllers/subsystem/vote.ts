// From code/controllers/subsystem/vote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(50, "/datum/controller/subsystem/vote", "/datum/controller/subsystem", {
	initiator: null,
	started_time: null,
	time_remaining: 0,
	mode: null,
	question: null,
	choices: null,
	voted: null,
	voting: null,
	generated_actions: null,
	boot_ckey: null,
	boot_address: null,
	name: "Vote",
	wait: 10,
	flags: 33,
	runlevels: 15,
});

// /datum/controller/subsystem/vote/proc/New  (code/controllers/subsystem/vote.dm:1)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSvote"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSvote"), T("/datum/controller/subsystem/vote")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSvote")]);
		}
		rt.setGl("SSvote", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/vote/proc/<init>  (code/controllers/subsystem/vote.dm:14)
rt.def("/datum/controller/subsystem/vote/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "choices", rt.list());
	$0 = $0;
	rt.setSv(f, "voted", rt.list());
	$0 = $0;
	rt.setSv(f, "voting", rt.list());
	$0 = $0;
	rt.setSv(f, "generated_actions", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/vote/proc/fire  (code/controllers/subsystem/vote.dm:21)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/fire", function* fire(f: Frame) {
	let C: Value = null, client_popup: Value = null, C_1: Value = null;
	let $e: any;
	f.vars = () => [C, client_popup, C_1, $e];
	if (!truthy(rt.sv(f, "mode"))) return f.dot;
	rt.setSv(f, "time_remaining", (yield* g.call(f, P("/proc/round"), null, [divide(subtract(add(rt.sv(f, "started_time"), rt.fv(f, "vote_period", rt.gl("config"))), rt.worldTime(f)), 10)])));
	if (rt.lt(rt.sv(f, "time_remaining"), 0)) {
		yield* g.srcCall(f, "result");
		C = null;
		rt.forList(f, 0, rt.sv(f, "voting"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			rt.op(f, "Browse", [], [live(C), null, "window=vote;can_close=0"], false);
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "reset");
	} else {
		client_popup = null;
		C_1 = null;
		rt.forList(f, 0, rt.sv(f, "voting"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C_1 = $e;
			yield* g.callName(f, (client_popup = (yield* g.new_(f, T("/datum/browser"), [live(C_1), "vote", "Voting Panel"]))), "set_window_options", ["can_close=0"]);
			yield* g.callName(f, live(client_popup), "set_content", [(yield* g.srcCall(f, "interface", live(C_1)))]);
			yield* g.callName(f, live(client_popup), "open", [0]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/vote/proc/reset  (code/controllers/subsystem/vote.dm:42)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/reset", function* reset(f: Frame) {
	rt.setSv(f, "initiator", null);
	rt.setSv(f, "time_remaining", 0);
	rt.setSv(f, "mode", null);
	rt.setSv(f, "question", null);
	rt.setSv(f, "boot_ckey", null);
	rt.setSv(f, "boot_address", null);
	yield* g.callName(f, rt.sv(f, "choices"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "voted"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "voting"), "Cut", []);
	yield* g.srcCall(f, "remove_action_buttons");
	return f.dot;
}, true);

// /datum/controller/subsystem/vote/proc/get_result  (code/controllers/subsystem/vote.dm:51)
rt.def("/datum/controller/subsystem/vote/proc/get_result", function get_result(f: Frame) {
	let greatest_votes: Value = null, total_votes: Value = null, option: Value = null, votes: Value = null, non_voters: Value = null, non_voter_ckey: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [greatest_votes, total_votes, option, votes, non_voters, non_voter_ckey, C, $e];
	greatest_votes = 0;
	total_votes = 0;
	option = null;
	rt.forList(f, 0, rt.sv(f, "choices"));
	while (($e = rt.next(f, 0)) !== undefined) {
		option = $e;
		total_votes = rt.modify(live(total_votes), (votes = rt.index(rt.sv(f, "choices"), live(option))), add);
		if (rt.gt(live(votes), live(greatest_votes))) {
			greatest_votes = live(votes);
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(rt.fv(f, "vote_no_default", rt.gl("config"))) && truthy(rt.len(f, rt.sv(f, "choices"))))) {
		non_voters = rt.callName(f, rt.gl("directory"), "Copy", []);
		(non_voters = rt.modify(live(non_voters), rt.sv(f, "voted"), subtract));
		non_voter_ckey = null;
		rt.forList(f, 0, live(non_voters));
		while (($e = rt.next(f, 0)) !== undefined) {
			non_voter_ckey = $e;
			if ((!truthy((C = rt.index(live(non_voters), live(non_voter_ckey)))) || truthy(rt.callName(f, live(C), "is_afk", [])))) {
				(non_voters = rt.modify(live(non_voters), live(non_voter_ckey), subtract));
			}
		}
		rt.endFor(f, 0);
		if (rt.gt(rt.len(f, live(non_voters)), 0)) {
			if (isEqual(rt.sv(f, "mode"), "restart")) {
				rt.modAt(rt.sv(f, "choices"), "Continue Playing", rt.len(f, live(non_voters)), add);
				if (rt.ge(rt.at(rt.sv(f, "choices"), "Continue Playing"), live(greatest_votes))) {
					greatest_votes = rt.at(rt.sv(f, "choices"), "Continue Playing");
				}
			} else if (isEqual(rt.sv(f, "mode"), "shuttle") || isEqual(rt.sv(f, "mode"), "boot")) {
				// ss13.live: online players who didn't vote count as "Keep playing" / "Let them stay", as in the restart vote
				option = rt.callSrc(f, "status_quo", []);
				rt.modAt(rt.sv(f, "choices"), live(option), rt.len(f, live(non_voters)), add);
				if (rt.ge(rt.at(rt.sv(f, "choices"), live(option)), live(greatest_votes))) {
					greatest_votes = rt.at(rt.sv(f, "choices"), live(option));
				}
			} else {
				if (isEqual(rt.sv(f, "mode"), "gamemode")) {
					if (truthy((rt.isIn(f, rt.gl("master_mode"), rt.sv(f, "choices")) ? 1 : 0))) {
						rt.modAt(rt.sv(f, "choices"), rt.gl("master_mode"), rt.len(f, live(non_voters)), add);
						if (rt.ge(rt.index(rt.sv(f, "choices"), rt.gl("master_mode")), live(greatest_votes))) {
							greatest_votes = rt.index(rt.sv(f, "choices"), rt.gl("master_mode"));
						}
					}
				}
			}
		}
	}
	f.dot = rt.list();
	if (truthy(live(greatest_votes))) {
		option = null;
		rt.forList(f, 0, rt.sv(f, "choices"));
		while (($e = rt.next(f, 0)) !== undefined) {
			option = $e;
			if (isEqual(rt.index(rt.sv(f, "choices"), live(option)), live(greatest_votes))) {
				f.dot = rt.modify(live(f.dot), live(option), add);
			}
		}
		rt.endFor(f, 0);
	}
	return live(f.dot);
});

// /datum/controller/subsystem/vote/proc/announce_result  (code/controllers/subsystem/vote.dm:83)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/announce_result", function* announce_result(f: Frame) {
	let winners: Value = null, text: Value = null, i: Value = null, votes: Value = null, option: Value = null;
	let $e: any;
	f.vars = () => [winners, text, i, votes, option, $e];
	winners = (yield* g.srcCall(f, "get_result"));
	text = null;
	if (rt.gt(rt.len(f, live(winners)), 0)) {
		if (truthy(rt.sv(f, "question"))) {
			text = rt.modify(live(text), fmt("<b>＀</b>", [rt.sv(f, "question")]), add);
		} else {
			text = rt.modify(live(text), fmt("<b>＀ Vote</b>", [(yield* g.call(f, P("/proc/capitalize"), null, [rt.sv(f, "mode")]))]), add);
		}
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, rt.sv(f, "choices")))) {
			if (!truthy((votes = rt.index(rt.sv(f, "choices"), rt.index(rt.sv(f, "choices"), live(i)))))) {
				votes = 0;
			}
			text = rt.modify(live(text), fmt("\n<b>＀:</b> ＀", [rt.index(rt.sv(f, "choices"), live(i)), live(votes)]), add);
			i = rt.inc(live(i), 1);
		}
		if (!isEqual(rt.sv(f, "mode"), "custom")) {
			if (rt.gt(rt.len(f, live(winners)), 1)) {
				text = "\n<b>Vote Tied Between:</b>";
				option = null;
				rt.forList(f, 0, live(winners));
				while (($e = rt.next(f, 0)) !== undefined) {
					option = $e;
					text = rt.modify(live(text), fmt("\n\t＀", [live(option)]), add);
				}
				rt.endFor(f, 0);
			}
			// ss13.live: a tied shuttle or boot vote changes nothing
			if (rt.callSrc(f, "status_quo", []) !== null && rt.isIn(f, rt.callSrc(f, "status_quo", []), live(winners))) {
				f.dot = rt.callSrc(f, "status_quo", []);
			} else {
				f.dot = rt.op(f, "PickUnweighted", [1], [live(winners)]);
			}
			text = rt.modify(live(text), fmt("\n<b>Vote Result: ＀</b>", [live(f.dot)]), add);
		} else {
			text = rt.modify(live(text), fmt("\n<b>Did not vote:</b> ＀", [subtract(rt.len(f, rt.gl("clients")), rt.len(f, rt.sv(f, "voted")))]), add);
		}
	} else {
		text = rt.modify(live(text), "<b>Vote Result: Inconclusive - No Votes!</b>", add);
	}
	yield* g.call(f, P("/proc/log_vote"), null, [live(text)]);
	yield* g.srcCall(f, "remove_action_buttons");
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("\n<font color='purple'>＀</font>", [live(text)])]);
	return live(f.dot);
}, true);

// /datum/controller/subsystem/vote/proc/result  (code/controllers/subsystem/vote.dm:112)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/result", function* result(f: Frame) {
	let restart: Value = null, active_admins: Value = null, C: Value = null;
	let $0: any, $e: any;
	f.vars = () => [restart, active_admins, C, $0, $e];
	f.dot = (yield* g.srcCall(f, "announce_result"));
	restart = 0;
	if (truthy(live(f.dot))) {
		$0 = rt.sv(f, "mode");
		if ($0 === "restart") {
			if (isEqual(live(f.dot), "Restart Round")) {
				restart = 1;
			}
		} else if ($0 === "shuttle") {
			if (isEqual(live(f.dot), "Call the shuttle")) {
				yield* g.srcCall(f, "shuttle_vote_passed");
			}
		} else if ($0 === "boot") {
			if (isEqual(live(f.dot), "Boot them")) {
				yield* g.srcCall(f, "boot_vote_passed");
			}
		} else if ($0 === "map") {
			yield* g.srcCall(f, "map_vote_passed", live(f.dot));
		} else if ($0 === "gamemode") {
			if (!isEqual(rt.gl("master_mode"), live(f.dot))) {
				yield* g.callName(f, rt.gl("SSticker"), "save_mode", [live(f.dot)]);
				if (truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
					restart = 1;
				} else {
					rt.setGl("master_mode", live(f.dot));
				}
			}
		}
	}
	if (truthy(live(restart))) {
		active_admins = 0;
		C = null;
		rt.forList(f, 0, rt.gl("admins"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((!truthy((yield* g.callName(f, live(C), "is_afk", []))) && truthy((yield* g.call(f, P("/proc/check_rights_for"), null, [live(C), 16]))))) {
				active_admins = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(active_admins))) {
			yield* g.callName(f, rt.gl("SSticker"), "Reboot", ["Restart vote successful.", "restart vote"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span style='boldannounce'>Notice:Restart vote will not restart the server automatically because there are active admins on.</span>"]);
			yield* g.call(f, P("/proc/message_admins"), null, ["A restart vote has passed, but there are active admins on with +server, so it has been canceled. If you wish, you may restart the server."]);
		}
	}
	return live(f.dot);
}, true);

// /datum/controller/subsystem/vote/proc/submit_vote  (code/controllers/subsystem/vote.dm:142)
rt.def("/datum/controller/subsystem/vote/proc/submit_vote", function submit_vote(f: Frame, vote: Value) {
	if (truthy(rt.sv(f, "mode"))) {
		if (((truthy(rt.fv(f, "vote_no_dead", rt.gl("config"))) && isEqual(rt.fv(f, "stat", live(f.usr)), 2)) && !truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			return 0;
		}
		if (!truthy((rt.isIn(f, rt.fv(f, "ckey", live(f.usr)), rt.sv(f, "voted")) ? 1 : 0))) {
			if (((truthy(live(vote)) && rt.le(1, live(vote))) && rt.le(live(vote), rt.len(f, rt.sv(f, "choices"))))) {
				rt.modSrcVar(f, "voted", rt.fv(f, "ckey", live(f.usr)), add);
				rt.incAt(rt.sv(f, "choices"), rt.index(rt.sv(f, "choices"), live(vote)), 1, true);
				return live(vote);
			}
		}
	}
	return 0;
});

// /datum/controller/subsystem/vote/proc/initiate_vote  (code/controllers/subsystem/vote.dm:152)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/initiate_vote", function* initiate_vote(f: Frame, vote_type: Value, initiator_key: Value, target: Value) {
	let next_allowed_time: Value = null, admin: Value = null, ckey: Value = null, i: Value = null, option: Value = null, text: Value = null, c: Value = null, C: Value = null, V: Value = null;
	let $0: any, $e: any;
	f.vars = () => [vote_type, initiator_key, target, next_allowed_time, admin, ckey, i, option, text, c, C, V, $0, $e];
	if (!truthy(rt.sv(f, "mode"))) {
		if (truthy(rt.sv(f, "started_time"))) {
			next_allowed_time = add(rt.sv(f, "started_time"), rt.fv(f, "vote_delay", rt.gl("config")));
			if (truthy(rt.sv(f, "mode"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There is already a vote in progress! please wait for it to finish.</span>"]);
				return 0;
			}
			admin = 0;
			ckey = (yield* g.call(f, P("/proc/ckey"), null, [live(initiator_key)]));
			if ((truthy(rt.index(rt.gl("admin_datums"), live(ckey))) || truthy((rt.isIn(f, live(ckey), rt.gl("deadmins")) ? 1 : 0)))) {
				admin = 1;
			}
			if (live(initiator_key) === null) { // ss13.live: started by the game itself (the map vote when the shuttle leaves)
				admin = 1;
			}
			if ((rt.gt(live(next_allowed_time), rt.worldTime(f)) && !truthy(live(admin)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>A vote was initiated recently, you must wait roughly ＀ seconds before a new vote can be started!</span>", [divide(subtract(live(next_allowed_time), rt.worldTime(f)), 10)])]);
				return 0;
			}
		}
		yield* g.srcCall(f, "reset");
		$0 = live(vote_type);
		if ($0 === "restart") {
			yield* g.callName(f, rt.sv(f, "choices"), "Add", ["Restart Round", "Continue Playing"]);
		} else if ($0 === "shuttle") {
			if (!truthy((yield* g.srcCall(f, "shuttle_vote_useful")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The emergency shuttle is already on its way, or gone.</span>"]);
				return 0;
			}
			yield* g.callName(f, rt.sv(f, "choices"), "Add", ["Call the shuttle", "Keep playing"]);
		} else if ($0 === "boot") {
			// ss13.live: target is the client picked in Topic (boot_pick); it may have left while the starter was picking
			if (!truthy((rt.istype(live(target), T("/client")) ? 1 : 0))) {
				return 0;
			}
			rt.setSv(f, "boot_ckey", rt.gv(f, "ckey", target));
			rt.setSv(f, "boot_address", rt.gv(f, "address", target));
			rt.setSv(f, "question", fmt("Boot ＀ for the rest of the round?", [(yield* g.srcCall(f, "boot_label", live(target)))]));
			yield* g.callName(f, rt.sv(f, "choices"), "Add", ["Boot them", "Let them stay"]);
		} else if ($0 === "map") {
			yield* g.callName(f, rt.sv(f, "choices"), "Add", [(yield* g.srcCall(f, "map_choices"))]);
			if (rt.lt(rt.len(f, rt.sv(f, "choices")), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There aren't two maps to choose from for this many players (config/maps.txt).</span>"]);
				yield* g.callName(f, rt.sv(f, "choices"), "Cut", []);
				return 0;
			}
		} else if ($0 === "gamemode") {
			yield* g.callName(f, rt.sv(f, "choices"), "Add", [rt.fv(f, "votable_modes", rt.gl("config"))]);
		} else if ($0 === "custom") {
			rt.setSv(f, "question", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "What is the vote for?"])));
			if (!truthy(rt.sv(f, "question"))) {
				return 0;
			}
			i = null;
			i = 1;
			while (rt.le(live(i), 10)) {
				if (((!truthy((option = (yield* g.call(f, P("/proc/capitalize"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter an option or hit cancel to finish"]))])))) || truthy(rt.sv(f, "mode"))) || !truthy(rt.fv(f, "client", live(f.usr))))) {
					break;
				}
				yield* g.callName(f, rt.sv(f, "choices"), "Add", [live(option)]);
				i = rt.inc(live(i), 1);
			}
		} else {
			return 0;
		}
		rt.setSv(f, "mode", live(vote_type));
		rt.setSv(f, "initiator", live(initiator_key) === null ? "the station" : live(initiator_key));
		rt.setSv(f, "started_time", rt.worldTime(f));
		text = fmt("＀ vote started by ＀.", [(yield* g.call(f, P("/proc/capitalize"), null, [rt.sv(f, "mode")])), rt.sv(f, "initiator")]);
		if (isEqual(rt.sv(f, "mode"), "custom") || isEqual(rt.sv(f, "mode"), "boot")) {
			text = rt.modify(live(text), fmt("\n＀", [rt.sv(f, "question")]), add);
		}
		yield* g.call(f, P("/proc/log_vote"), null, [live(text)]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("\n<font color='purple'><b>＀</b>\nType <b>vote</b> or click <a href='?src=＃'>here</a> to place your votes.\nYou have ＀ seconds to vote.</font>", [live(text), live(f.src), divide(rt.fv(f, "vote_period", rt.gl("config")), 10)])]);
		rt.setSv(f, "time_remaining", (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "vote_period", rt.gl("config")), 10)])));
		c = null;
		rt.forList(f, 0, rt.gl("clients"));
		while (($e = rt.next(f, 0)) !== undefined) {
			c = $e;
			C = live(c);
			V = (yield* g.new_(f, T("/datum/action/vote"), []));
			if (truthy(rt.sv(f, "question"))) {
				rt.setFv(f, "name", live(V), fmt("Vote: ＀", [rt.sv(f, "question")]));
			}
			yield* g.callName(f, live(V), "Grant", [rt.fv(f, "mob", live(C))]);
			rt.modSrcVar(f, "generated_actions", live(V), add);
		}
		rt.endFor(f, 0);
		return 1;
	}
	return 0;
}, true);

// /datum/controller/subsystem/vote/proc/interface  (code/controllers/subsystem/vote.dm:205)
rt.def("/datum/controller/subsystem/vote/proc/interface", function _interface(f: Frame, C: Value) {
	let admin: Value = null, trialmin: Value = null, i: Value = null, votes: Value = null;
	let $0: any, $1: any;
	f.vars = () => [admin, trialmin, i, votes, $0, $1];
	if (!truthy(live(C))) {
		return live(f.dot);
	}
	admin = 0;
	trialmin = 0;
	if (truthy(rt.fv(f, "holder", live(C)))) {
		admin = 1;
		if (truthy(rt.call(f, P("/proc/check_rights_for"), null, [live(C), 2]))) {
			trialmin = 1;
		}
	}
	(rt.modSrcVar(f, "voting", live(C), rt.bitOr));
	if (truthy(rt.sv(f, "mode"))) {
		if (truthy(rt.sv(f, "question"))) {
			f.dot = rt.modify(live(f.dot), fmt("<h2>Vote: '＀'</h2>", [rt.sv(f, "question")]), add);
		} else {
			f.dot = rt.modify(live(f.dot), fmt("<h2>Vote: ＀</h2>", [rt.call(f, P("/proc/capitalize"), null, [rt.sv(f, "mode")])]), add);
		}
		f.dot = rt.modify(live(f.dot), fmt("Time Left: ＀ s<hr><ul>", [rt.sv(f, "time_remaining")]), add);
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, rt.sv(f, "choices")))) {
			if (!truthy((votes = rt.index(rt.sv(f, "choices"), rt.index(rt.sv(f, "choices"), live(i)))))) {
				votes = 0;
			}
			f.dot = rt.modify(live(f.dot), fmt("<li><a href='?src=＃;vote=＀'>＀</a> (＀ votes)</li>", [live(f.src), live(i), rt.index(rt.sv(f, "choices"), live(i)), live(votes)]), add);
			i = rt.inc(live(i), 1);
		}
		f.dot = rt.modify(live(f.dot), "</ul><hr>", add);
		if (truthy(live(admin))) {
			f.dot = rt.modify(live(f.dot), fmt("(<a href='?src=＃;vote=cancel'>Cancel Vote</a>) ", [live(f.src)]), add);
		}
	} else {
		f.dot = rt.modify(live(f.dot), "<h2>Start a vote:</h2><hr><ul><li>", add);
		if ((truthy(live(trialmin)) || truthy(rt.fv(f, "allow_vote_restart", rt.gl("config"))))) {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;vote=restart'>Restart</a>", [live(f.src)]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<font color='grey'>Restart (Disallowed)</font>", add);
		}
		if (truthy(live(trialmin))) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "allow_vote_restart", rt.gl("config")))) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot = rt.modify(live(f.dot), fmt("\t(<a href='?src=＃;vote=toggle_restart'>＀</a>)", [$0, $1]), add);
		}
		f.dot = rt.modify(live(f.dot), "</li><li>", add);
		if ((truthy(live(trialmin)) || truthy(rt.fv(f, "allow_vote_mode", rt.gl("config"))))) {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;vote=gamemode'>GameMode</a>", [live(f.src)]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<font color='grey'>GameMode (Disallowed)</font>", add);
		}
		if (truthy(live(trialmin))) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "allow_vote_mode", rt.gl("config")))) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot = rt.modify(live(f.dot), fmt("\t(<a href='?src=＃;vote=toggle_gamemode'>＀</a>)", [$0, $1]), add);
		}
		// ss13.live: the shuttle vote
		f.dot = rt.modify(live(f.dot), "</li><li>", add);
		if ((truthy(live(trialmin)) || truthy(rt.fv(f, "allow_vote_shuttle", rt.gl("config"))))) {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;vote=shuttle'>Shuttle</a>", [live(f.src)]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<font color='grey'>Shuttle (Disallowed)</font>", add);
		}
		if (truthy(live(trialmin))) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "allow_vote_shuttle", rt.gl("config")))) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot = rt.modify(live(f.dot), fmt("\t(<a href='?src=＃;vote=toggle_shuttle'>＀</a>)", [$0, $1]), add);
		}
		// ss13.live: the map vote
		f.dot = rt.modify(live(f.dot), "</li><li>", add);
		if ((truthy(live(trialmin)) || truthy(rt.fv(f, "allow_vote_map", rt.gl("config"))))) {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;vote=map'>Next map</a>", [live(f.src)]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<font color='grey'>Next map (Disallowed)</font>", add);
		}
		if (truthy(live(trialmin))) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "allow_vote_map", rt.gl("config")))) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot = rt.modify(live(f.dot), fmt("\t(<a href='?src=＃;vote=toggle_map'>＀</a>)", [$0, $1]), add);
		}
		// ss13.live: the boot vote
		f.dot = rt.modify(live(f.dot), "</li><li>", add);
		if ((truthy(live(trialmin)) || truthy(rt.fv(f, "allow_vote_boot", rt.gl("config"))))) {
			f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;vote=boot'>Boot a player</a>", [live(f.src)]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<font color='grey'>Boot a player (Disallowed)</font>", add);
		}
		if (truthy(live(trialmin))) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "allow_vote_boot", rt.gl("config")))) {
				$1 = "Allowed";
			} else {
				$1 = "Disallowed";
			}
			f.dot = rt.modify(live(f.dot), fmt("\t(<a href='?src=＃;vote=toggle_boot'>＀</a>)", [$0, $1]), add);
		}
		f.dot = rt.modify(live(f.dot), "</li>", add);
		if (truthy(live(trialmin))) {
			f.dot = rt.modify(live(f.dot), fmt("<li><a href='?src=＃;vote=custom'>Custom</a></li>", [live(f.src)]), add);
		}
		f.dot = rt.modify(live(f.dot), "</ul><hr>", add);
	}
	return (f.dot = rt.modify(live(f.dot), fmt("<a href='?src=＃;vote=close' style='position:absolute;right:50px'>Close</a>", [live(f.src)]), add));
});

// /datum/controller/subsystem/vote/proc/Topic  (code/controllers/subsystem/vote.dm:257)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	let $0: any;
	f.vars = () => [href, href_list, hsrc, $0];
	if ((!truthy(live(f.usr)) || !truthy(rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	$0 = rt.at(live(href_list), "vote");
	if ($0 === "close") {
		(rt.modSrcVar(f, "voting", rt.fv(f, "client", live(f.usr)), subtract));
		rt.op(f, "Browse", [], [live(f.usr), null, "window=vote"], false);
		return live(f.dot);
	} else if ($0 === "cancel") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			yield* g.srcCall(f, "reset");
		}
	} else if ($0 === "toggle_restart") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			rt.setFv(f, "allow_vote_restart", rt.gl("config"), (!truthy(rt.fv(f, "allow_vote_restart", rt.gl("config"))) ? 1 : 0));
		}
	} else if ($0 === "toggle_gamemode") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			rt.setFv(f, "allow_vote_mode", rt.gl("config"), (!truthy(rt.fv(f, "allow_vote_mode", rt.gl("config"))) ? 1 : 0));
		}
	} else if ($0 === "restart") {
		if ((truthy(rt.fv(f, "allow_vote_restart", rt.gl("config"))) || truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			yield* g.srcCall(f, "initiate_vote", "restart", rt.fv(f, "key", live(f.usr)));
		}
	} else if ($0 === "toggle_shuttle") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			rt.setFv(f, "allow_vote_shuttle", rt.gl("config"), (!truthy(rt.fv(f, "allow_vote_shuttle", rt.gl("config"))) ? 1 : 0));
		}
	} else if ($0 === "shuttle") {
		if ((truthy(rt.fv(f, "allow_vote_shuttle", rt.gl("config"))) || truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			yield* g.srcCall(f, "initiate_vote", "shuttle", rt.fv(f, "key", live(f.usr)));
		}
	} else if ($0 === "toggle_map") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			rt.setFv(f, "allow_vote_map", rt.gl("config"), (!truthy(rt.fv(f, "allow_vote_map", rt.gl("config"))) ? 1 : 0));
		}
	} else if ($0 === "map") {
		if ((truthy(rt.fv(f, "allow_vote_map", rt.gl("config"))) || truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			yield* g.srcCall(f, "initiate_vote", "map", rt.fv(f, "key", live(f.usr)));
		}
	} else if ($0 === "toggle_boot") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			rt.setFv(f, "allow_vote_boot", rt.gl("config"), (!truthy(rt.fv(f, "allow_vote_boot", rt.gl("config"))) ? 1 : 0));
		}
	} else if ($0 === "boot") {
		if ((truthy(rt.fv(f, "allow_vote_boot", rt.gl("config"))) || truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			$0 = (yield* g.srcCall(f, "boot_pick"));
			if (truthy($0)) {
				yield* g.srcCall(f, "initiate_vote", "boot", rt.fv(f, "key", live(f.usr)), $0);
			}
		}
	} else if ($0 === "gamemode") {
		if ((truthy(rt.fv(f, "allow_vote_mode", rt.gl("config"))) || truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
			yield* g.srcCall(f, "initiate_vote", "gamemode", rt.fv(f, "key", live(f.usr)));
		}
	} else if ($0 === "custom") {
		if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) {
			yield* g.srcCall(f, "initiate_vote", "custom", rt.fv(f, "key", live(f.usr)));
		}
	} else {
		yield* g.srcCall(f, "submit_vote", (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "vote")]))])));
	}
	yield* g.callName(f, live(f.usr), "vote", []);
	return f.dot;
}, true);

// ss13.live: the shuttle vote (plans/anarchy-light.md). Worth starting while the shuttle is at CentCom, recalled, or on its way
// with more than 5 minutes left.
rt.def("/datum/controller/subsystem/vote/proc/shuttle_vote_useful", function* shuttle_vote_useful(f: Frame) {
	let E: Value = null, mode: Value = null;
	f.vars = () => [E, mode];
	if (!truthy((E = rt.fv(f, "emergency", rt.gl("SSshuttle"))))) return 0;
	mode = rt.gv(f, "mode", E);
	if (isEqual(live(mode), "idle") || isEqual(live(mode), "recall")) return 1;
	if (isEqual(live(mode), "call") && rt.gt((yield* g.callName(f, live(E), "timeLeft", [10])), 300)) return 1;
	return 0;
}, true);

// ss13.live: the shuttle vote passed: call the shuttle (5 minutes, the red alert speed) or cut its trip to 5 minutes, and
// lock out recalls for the rest of the round.
rt.def("/datum/controller/subsystem/vote/proc/shuttle_vote_passed", function* shuttle_vote_passed(f: Frame) {
	let E: Value = null, mode: Value = null;
	f.vars = () => [E, mode];
	if (!truthy((yield* g.srcCall(f, "shuttle_vote_useful")))) return f.dot;
	E = rt.fv(f, "emergency", rt.gl("SSshuttle"));
	mode = rt.gv(f, "mode", E);
	if (isEqual(live(mode), "call")) {
		yield* g.callName(f, live(E), "setTimer", [3000]);
		yield* g.call(f, P("/proc/priority_announce"), null, ["The crew has voted to evacuate. The emergency shuttle will now arrive in 5 minutes.", null, rt.rsc("sound/ai/shuttlecalled.ogg"), "Priority"]);
	} else {
		yield* g.callName(f, live(E), "request", [null, null, "\n\nThe crew has voted to evacuate.", 0, 0.5]);
	}
	rt.setFv(f, "emergencyNoRecall", rt.gl("SSshuttle"), 1);
	yield* g.call(f, P("/proc/log_game"), null, ["Shuttle vote passed: emergency shuttle called, arriving in 5 minutes, recall locked."]);
	return f.dot;
}, true);

// ss13.live: in the shuttle and boot votes the choice that changes nothing: it gets the non-voters and wins a tie. null in other votes.
rt.def("/datum/controller/subsystem/vote/proc/status_quo", function status_quo(f: Frame) {
	if (isEqual(rt.sv(f, "mode"), "shuttle")) return "Keep playing";
	if (isEqual(rt.sv(f, "mode"), "boot")) return "Let them stay";
	return null;
});

// ss13.live: the map vote (plans/anarchy-light.md step 5). The choices: config/maps.txt's maps that allow this many players.
rt.def("/datum/controller/subsystem/vote/proc/map_choices", function* map_choices(f: Frame) {
	let L: Value = null, name: Value = null, VM: Value = null, players: Value = null;
	let $e: any;
	f.vars = () => [L, name, VM, players, $e];
	L = rt.list();
	players = rt.len(f, rt.gl("clients"));
	rt.forList(f, 0, rt.fv(f, "maplist", rt.gl("config")));
	while (($e = rt.next(f, 0)) !== undefined) {
		name = $e;
		VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(name));
		if (!truthy(live(VM)) || rt.le(rt.gv(f, "voteweight", VM), 0)) continue;
		if (rt.gt(rt.gv(f, "config_min_users", VM), 0) && rt.lt(live(players), rt.gv(f, "config_min_users", VM))) continue;
		if (rt.gt(rt.gv(f, "config_max_users", VM), 0) && rt.gt(live(players), rt.gv(f, "config_max_users", VM))) continue;
		yield* g.callName(f, live(L), "Add", [live(name)]);
	}
	rt.endFor(f, 0);
	return live(L);
}, true);

// The map vote ended on `name`: it is next round's map. tools/server.mjs reads the line and starts the next world on it.
rt.def("/datum/controller/subsystem/vote/proc/map_vote_passed", function* map_vote_passed(f: Frame, name: Value) {
	let VM: Value = null, file: Value = null;
	f.vars = () => [name, VM, file];
	if (!truthy((VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(name))))) return f.dot;
	yield* g.callName(f, rt.gl("SSmapping"), "changemap", [live(VM)]);
	file = (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/replacetext"), null, [rt.gv(f, "config_filename", VM), "_maps/", ""])), ".json", ""]));
	yield* g.call(f, P("/proc/log_world"), null, [fmt("[server-nextmap] ＀", [live(file)])]); // read by tools/server.mjs
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Map vote: next round is on ＀.", [live(name)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>Next round's map: ＀.</span>", [live(name)])]);
	return f.dot;
}, true);

// ss13.live: the boot vote (plans/anarchy-light.md step 4): players vote a griefer off the server for the rest of the round.
// How a player shows in the picker and the vote: their character's name, then their key (the key tells two Sams apart).
rt.def("/datum/controller/subsystem/vote/proc/boot_label", function* boot_label(f: Frame, C: Value) {
	let M: Value = null;
	f.vars = () => [C, M];
	M = rt.gv(f, "mob", C);
	if (truthy(live(M)) && !(rt.istype(live(M), T("/mob/dead/new_player")))) {
		return fmt("＀ (＀)", [rt.gv(f, "name", M), rt.gv(f, "key", C)]);
	}
	return rt.gv(f, "key", C);
}, true);

// The starter picks who: any other online player who isn't an admin. Returns that client, or null.
rt.def("/datum/controller/subsystem/vote/proc/boot_pick", function* boot_pick(f: Frame) {
	let L: Value = null, C: Value = null, choice: Value = null;
	let $e: any;
	f.vars = () => [L, C, choice, $e];
	L = rt.list();
	rt.forList(f, 0, rt.gl("clients"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(live(C), rt.fv(f, "client", live(f.usr))) || truthy(rt.gv(f, "holder", C))) continue;
		rt.setAt(live(L), (yield* g.srcCall(f, "boot_label", live(C))), live(C));
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(L)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There is nobody else here to vote off.</span>"]);
		return null;
	}
	choice = (yield* g.op(f, "Prompt", [1], [null, "Boot vote", "Who should the crew vote off for the rest of this round?", live(f.usr), live(L)]));
	if (!truthy(live(choice))) return null;
	C = rt.at(live(L), live(choice));
	if (!truthy((rt.istype(live(C), T("/client")) ? 1 : 0))) return null; // left while the starter was picking
	return live(C);
}, true);

// The boot vote passed: tools/server.mjs refuses that key and address until the next round, and the player is disconnected.
// Their body stays where it is, as when anyone logs out.
rt.def("/datum/controller/subsystem/vote/proc/boot_vote_passed", function* boot_vote_passed(f: Frame) {
	let ckey: Value = null, C: Value = null, label: Value = null;
	f.vars = () => [ckey, C, label];
	ckey = rt.sv(f, "boot_ckey");
	if (!truthy(live(ckey))) return f.dot;
	C = rt.index(rt.gl("directory"), live(ckey));
	label = truthy(live(C)) ? (yield* g.srcCall(f, "boot_label", live(C))) : live(ckey);
	yield* g.call(f, P("/proc/log_world"), null, [fmt("[server-roundban] ＀ ＀", [live(ckey), truthy(rt.sv(f, "boot_address")) ? rt.sv(f, "boot_address") : "-"])]); // read by tools/server.mjs
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Boot vote passed: ＀ is off the server until the next round.", [live(label)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀ was voted off the station for the rest of the round.</span>", [live(label)])]);
	if (truthy(live(C))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='danger'>The crew voted you off the station for the rest of this round. You can come back next round.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/vote/proc/remove_action_buttons  (code/controllers/subsystem/vote.dm:287)  may sleep
rt.def("/datum/controller/subsystem/vote/proc/remove_action_buttons", function* remove_action_buttons(f: Frame) {
	let v: Value = null, V: Value = null;
	let $e: any;
	f.vars = () => [v, V, $e];
	v = null;
	rt.forList(f, 0, rt.sv(f, "generated_actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (!(!truthy((V = live(v))) || truthy(rt.fv(f, "gc_destroyed", live(V))))) {
			yield* g.callName(f, live(V), "Remove", [rt.fv(f, "owner", live(V))]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "generated_actions", rt.list());
	return f.dot;
}, true);

// /mob/verb/vote  (code/controllers/subsystem/vote.dm:297)  may sleep
rt.def("/mob/verb/vote", function* vote(f: Frame) {
	let popup: Value = null;
	f.vars = () => [popup];
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.src), "vote", "Voting Panel"]))), "set_window_options", ["can_close=0"]);
	yield* g.callName(f, live(popup), "set_content", [(yield* g.callName(f, rt.gl("SSvote"), "interface", [rt.sv(f, "client")]))]);
	yield* g.callName(f, live(popup), "open", [0]);
	return f.dot;
}, true, { verb: { name: "Vote", category: "OOC" } });

rt.type(175, "/datum/action/vote", "/datum/action", {
	name: "Vote!",
	button_icon_state: "vote",
});

// /datum/action/vote/proc/Trigger  (code/controllers/subsystem/vote.dm:308)  may sleep
rt.def("/datum/action/vote/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "vote", []);
	yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	return f.dot;
}, true);
