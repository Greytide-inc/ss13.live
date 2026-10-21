// From interface/interface.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/wiki  (interface/interface.dm:6)  may sleep
rt.def("/client/verb/wiki", function* wiki(f: Frame) {
	if (truthy(rt.fv(f, "wikiurl", rt.gl("config")))) {
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["This will open the wiki in your browser. Are you sure?", null, "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		rt.op(f, "Link", [], [live(f.src), rt.fv(f, "wikiurl", rt.gl("config"))], false);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>The wiki URL is not set in the server configuration.</span>"]);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: "wiki", desc: "Visit the wiki." } });

// /client/verb/forum  (interface/interface.dm:18)  may sleep
rt.def("/client/verb/forum", function* forum(f: Frame) {
	if (truthy(rt.fv(f, "forumurl", rt.gl("config")))) {
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["This will open the forum in your browser. Are you sure?", null, "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		rt.op(f, "Link", [], [live(f.src), rt.fv(f, "forumurl", rt.gl("config"))], false);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>The forum URL is not set in the server configuration.</span>"]);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: "forum", desc: "Visit the forum." } });

// /client/verb/rules  (interface/interface.dm:30)  may sleep
rt.def("/client/verb/rules", function* rules(f: Frame) {
	if (truthy(rt.fv(f, "rulesurl", rt.gl("config")))) {
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["This will open the rules in your browser. Are you sure?", null, "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		rt.op(f, "Link", [], [live(f.src), rt.fv(f, "rulesurl", rt.gl("config"))], false);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>The rules URL is not set in the server configuration.</span>"]);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: "rules", desc: "Show Server Rules." } });

// /client/verb/github  (interface/interface.dm:42)  may sleep
rt.def("/client/verb/github", function* github(f: Frame) {
	if (truthy(rt.fv(f, "githuburl", rt.gl("config")))) {
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["This will open the Github repository in your browser. Are you sure?", null, "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		rt.op(f, "Link", [], [live(f.src), rt.fv(f, "githuburl", rt.gl("config"))], false);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>The Github URL is not set in the server configuration.</span>"]);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: "github", desc: "Visit Github" } });

// /client/verb/reportissue  (interface/interface.dm:54)  may sleep
rt.def("/client/verb/reportissue", function* reportissue(f: Frame) {
	let message: Value = null;
	f.vars = () => [message];
	if (truthy(rt.fv(f, "githuburl", rt.gl("config")))) {
		message = "This will open the Github issue reporter in your browser. Are you sure?";
		if (isEqual((yield* g.call(f, P("/proc/tgalert"), null, [live(f.src), live(message), "Report Issue", "Yes", "No"])), "No")) {
			return live(f.dot);
		}
		rt.op(f, "Link", [], [live(f.src), fmt("＀/issues/new", [rt.fv(f, "githuburl", rt.gl("config"))])], false);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>The Github URL is not set in the server configuration.</span>"]);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: "report-issue", desc: "Report an issue" } });

// /client/verb/hotkeys_help  (interface/interface.dm:70)
rt.def("/client/verb/hotkeys_help", function hotkeys_help(f: Frame) {
	let adminhotkeys: Value = null;
	f.vars = () => [adminhotkeys];
	adminhotkeys = "<font color='purple'>\nAdmin:\n\tF5 = Aghost (admin-ghost)\n\tF6 = player-panel\n\tF7 = admin-pm\n\tF8 = Invisimin\n</font>";
	rt.callName(f, rt.sv(f, "mob"), "hotkey_help", []);
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(adminhotkeys)]);
	return f.dot;
}, false, { verb: { name: "hotkeys-help", category: "OOC" } });

// /client/verb/changelog  (interface/interface.dm:86)  may sleep
rt.def("/client/verb/changelog", function* changelog(f: Frame) {
	let changelog: Value = null;
	f.vars = () => [changelog];
	yield* g.callName(f, (changelog = (yield* g.call(f, P("/proc/get_asset_datum"), null, [T("/datum/asset/simple/changelog")]))), "send", [live(f.src)]);
	rt.op(f, "Browse", [], [live(f.src), rt.rsc("html/changelog.html"), "window=changes;size=675x650"], false);
	if (isEqual(rt.fv(f, "lastchangelog", rt.sv(f, "prefs")), rt.gl("changelog_hash"))) return f.dot;
	rt.setFv(f, "lastchangelog", rt.sv(f, "prefs"), rt.gl("changelog_hash"));
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	yield* g.call(f, P("/proc/winset"), null, [live(f.src), "infowindow.changelog", "font-style=;"]);
	return f.dot;
}, true, { verb: { name: "Changelog", category: "OOC" } });

// /mob/proc/hotkey_help  (interface/interface.dm:96)
rt.def("/mob/proc/hotkey_help", function hotkey_help(f: Frame) {
	let hotkey_mode: Value = null, other: Value = null;
	f.vars = () => [hotkey_mode, other];
	hotkey_mode = "<div class='boldnotice'>Hotkeys (always on in this game; hold Ctrl and the letters and numbers still work the same)</div><table><tr><td colspan=2><b>Moving</b></td></tr><tr><td>&nbsp;&nbsp;<tt>W A S D</tt></td><td>move</td></tr><tr><td>&nbsp;&nbsp;<tt>Alt (hold)</tt></td><td>alter movement intent</td></tr><tr><td colspan=2><b>Hands and items</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Q</tt></td><td>drop</td></tr><tr><td>&nbsp;&nbsp;<tt>E</tt></td><td>equip</td></tr><tr><td>&nbsp;&nbsp;<tt>R</tt></td><td>throw</td></tr><tr><td>&nbsp;&nbsp;<tt>X</tt></td><td>swap hand</td></tr><tr><td>&nbsp;&nbsp;<tt>Z or Y</tt></td><td>activate held object</td></tr><tr><td>&nbsp;&nbsp;<tt>B</tt></td><td>resist</td></tr><tr><td colspan=2><b>Intents</b></td></tr><tr><td>&nbsp;&nbsp;<tt>F / G</tt></td><td>cycle intent left / right</td></tr><tr><td>&nbsp;&nbsp;<tt>1 2 3 4</tt></td><td>help / disarm / grab / harm</td></tr><tr><td>&nbsp;&nbsp;<tt>Numpad</tt></td><td>target body part (press 8 repeatedly: Head, Eyes, Mouth)</td></tr><tr><td colspan=2><b>Talking</b></td></tr><tr><td>&nbsp;&nbsp;<tt>T</tt></td><td>say (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>M</tt></td><td>me (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>O</tt></td><td>OOC</td></tr><tr><td>&nbsp;&nbsp;<tt>Tab / Shift+Tab</tt></td><td>in the box: next / previous channel (Say, Radio, Me, Whisper)</td></tr><tr><td>&nbsp;&nbsp;<tt>Enter / Esc</tt></td><td>send / close the box</td></tr></table>";
	other = "<div class='boldnotice'>Extra keys</div><table><tr><td colspan=2><b>Other</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Del</tt></td><td>pull</td></tr><tr><td>&nbsp;&nbsp;<tt>Ins</tt></td><td>cycle intent right</td></tr><tr><td>&nbsp;&nbsp;<tt>Home</tt></td><td>drop</td></tr><tr><td>&nbsp;&nbsp;<tt>PgUp</tt></td><td>swap hand</td></tr><tr><td>&nbsp;&nbsp;<tt>PgDn</tt></td><td>activate held object</td></tr><tr><td>&nbsp;&nbsp;<tt>End</tt></td><td>throw</td></tr><tr><td>&nbsp;&nbsp;<tt>Ctrl+Numpad</tt></td><td>target body part</td></tr><tr><td>&nbsp;&nbsp;<tt>Ctrl +/- or Shift+Wheel</tt></td><td>ghost zoom in / out</td></tr></table>";
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(hotkey_mode)]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(other)]);
	return f.dot;
});

// /mob/living/silicon/robot/proc/hotkey_help  (interface/interface.dm:157)
rt.def("/mob/living/silicon/robot/proc/hotkey_help", function hotkey_help(f: Frame) {
	let hotkey_mode: Value = null, other: Value = null;
	f.vars = () => [hotkey_mode, other];
	hotkey_mode = "<div class='boldnotice'>Hotkeys (always on in this game; hold Ctrl and the letters and numbers still work the same)</div><table><tr><td colspan=2><b>Moving</b></td></tr><tr><td>&nbsp;&nbsp;<tt>W A S D</tt></td><td>move</td></tr><tr><td colspan=2><b>Modules</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Q</tt></td><td>unequip active module</td></tr><tr><td>&nbsp;&nbsp;<tt>X</tt></td><td>cycle active modules</td></tr><tr><td>&nbsp;&nbsp;<tt>Z or Y</tt></td><td>activate held object</td></tr><tr><td>&nbsp;&nbsp;<tt>1 2 3</tt></td><td>activate module 1 / 2 / 3</td></tr><tr><td>&nbsp;&nbsp;<tt>B</tt></td><td>resist</td></tr><tr><td colspan=2><b>Intents</b></td></tr><tr><td>&nbsp;&nbsp;<tt>F / G</tt></td><td>cycle intent left / right</td></tr><tr><td>&nbsp;&nbsp;<tt>4</tt></td><td>toggle intents</td></tr><tr><td colspan=2><b>Talking</b></td></tr><tr><td>&nbsp;&nbsp;<tt>T</tt></td><td>say (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>M</tt></td><td>me (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>O</tt></td><td>OOC</td></tr><tr><td>&nbsp;&nbsp;<tt>Tab / Shift+Tab</tt></td><td>in the box: next / previous channel (Say, Radio, Me, Whisper)</td></tr><tr><td>&nbsp;&nbsp;<tt>Enter / Esc</tt></td><td>send / close the box</td></tr><tr><td>&nbsp;&nbsp;<tt>H</tt></td><td>talk-wheel</td></tr></table>";
	other = "<div class='boldnotice'>Extra keys</div><table><tr><td colspan=2><b>Other</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Del</tt></td><td>pull</td></tr><tr><td>&nbsp;&nbsp;<tt>Ins</tt></td><td>toggle intents</td></tr><tr><td>&nbsp;&nbsp;<tt>PgUp</tt></td><td>cycle active modules</td></tr><tr><td>&nbsp;&nbsp;<tt>PgDn</tt></td><td>activate held object</td></tr></table>";
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(hotkey_mode)]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(other)]);
	return f.dot;
});

// /client/verb/_swinset  (interface/interface.dm:212)
rt.def("/client/verb/_swinset", function _swinset(f: Frame, x: Value) {
	// tg_js: does nothing. Nothing sends .swinset (no skin button, no page script), and through it any text a player typed reached
	// the game's own winset, past the limits on a player's winsets (web/src/vm/clients.ts winset). `.winset` does the same job.
	return f.dot;
}, false, { hidden: true, verb: { name: ".swinset" }, argTypes: [{ type: 2 }] });

// /client/verb/showrevinfo  (tg_js: moved here from the removed revision datum)
rt.def("/client/verb/showrevinfo", function showrevinfo(f: Frame) {
	let prob_sum: Value = null, current_odds_differ: Value = null, probs: Value = null, modes: Value = null, mode: Value = null, M: Value = null, ctag: Value = null, ctag_4: Value = null, percentage: Value = null, sum: Value = null, ctag_1: Value = null, percentage_2: Value = null;
	let $e: any;
	f.vars = () => [prob_sum, current_odds_differ, probs, modes, mode, M, ctag, ctag_4, percentage, sum, ctag_1, percentage_2, $e];
	if (truthy(rt.fv(f, "githuburl", rt.gl("config")))) rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Source: <a href=\"＀\">＀</a>", [rt.fv(f, "githuburl", rt.gl("config")), rt.fv(f, "githuburl", rt.gl("config"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Current Infomational Settings:</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Protect Authority Roles From Traitor: ＀", [rt.fv(f, "protect_roles_from_antagonist", rt.gl("config"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Protect Assistant Role From Traitor: ＀", [rt.fv(f, "protect_assistant_from_antagonist", rt.gl("config"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Enforce Human Authority: ＀", [rt.fv(f, "enforce_human_authority", rt.gl("config"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Allow Latejoin Antagonists: ＀", [rt.fv(f, "allow_latejoin_antagonists", rt.gl("config"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Enforce Continuous Rounds: ＀ of ＀ roundtypes", [rt.getLen(f, rt.fv(f, "continuous", rt.gl("config"))), rt.getLen(f, rt.fv(f, "modes", rt.gl("config")))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("Allow Midround Antagonists: ＀ of ＀ roundtypes", [rt.getLen(f, rt.fv(f, "midround_antag", rt.gl("config"))), rt.getLen(f, rt.fv(f, "modes", rt.gl("config")))])]);
	if (!truthy(rt.fv(f, "show_game_type_odds", rt.gl("config")))) return f.dot;
	if (truthy(rt.callName(f, rt.gl("SSticker"), "IsRoundInProgress", []))) {
		prob_sum = 0;
		current_odds_differ = 0;
		probs = rt.list();
		modes = rt.fv(f, "gamemode_cache", rt.gl("config"));
		mode = null;
		rt.forList(f, 0, live(modes));
		while (($e = rt.next(f, 0)) !== undefined) {
			mode = $e;
			M = live(mode);
			if (!truthy((rt.isIn(f, (ctag = rt.initial(f, live(M), "config_tag")), rt.fv(f, "probabilities", rt.gl("config"))) ? 1 : 0))) {
				continue;
			}
			if ((((truthy(rt.index(rt.fv(f, "min_pop", rt.gl("config")), live(ctag))) && rt.gt(rt.index(rt.fv(f, "min_pop", rt.gl("config")), live(ctag)), rt.fv(f, "totalPlayersReady", rt.gl("SSticker")))) || (truthy(rt.index(rt.fv(f, "max_pop", rt.gl("config")), live(ctag))) && rt.lt(rt.index(rt.fv(f, "max_pop", rt.gl("config")), live(ctag)), rt.fv(f, "totalPlayersReady", rt.gl("SSticker"))))) || rt.gt(rt.initial(f, live(M), "required_players"), rt.fv(f, "totalPlayersReady", rt.gl("SSticker"))))) {
				current_odds_differ = 1;
				continue;
			}
			rt.setAt(live(probs), live(ctag), 1);
			prob_sum = rt.modify(live(prob_sum), rt.index(rt.fv(f, "probabilities", rt.gl("config")), live(ctag)), add);
		}
		rt.endFor(f, 0);
		if (truthy(live(current_odds_differ))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Game Mode Odds for current round:</b>"]);
			ctag_4 = null;
			rt.forList(f, 0, live(probs));
			while (($e = rt.next(f, 0)) !== undefined) {
				ctag_4 = $e;
				if (rt.gt(rt.index(rt.fv(f, "probabilities", rt.gl("config")), live(ctag_4)), 0)) {
					percentage = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.index(rt.fv(f, "probabilities", rt.gl("config")), live(ctag_4)), live(prob_sum)), 100), 0.10000000149011612]);
					rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("＀ ＀%", [live(ctag_4), live(percentage)])]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>All Game Mode Odds:</b>"]);
	sum = 0;
	ctag_1 = null;
	rt.forList(f, 0, rt.fv(f, "probabilities", rt.gl("config")));
	while (($e = rt.next(f, 0)) !== undefined) {
		ctag_1 = $e;
		sum = rt.modify(live(sum), rt.index(rt.fv(f, "probabilities", rt.gl("config")), live(ctag_1)), add);
	}
	rt.endFor(f, 0);
	ctag_1 = null;
	rt.forList(f, 0, rt.fv(f, "probabilities", rt.gl("config")));
	while (($e = rt.next(f, 0)) !== undefined) {
		ctag_1 = $e;
		if (rt.gt(rt.index(rt.fv(f, "probabilities", rt.gl("config")), live(ctag_1)), 0)) {
			percentage_2 = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.index(rt.fv(f, "probabilities", rt.gl("config")), live(ctag_1)), live(sum)), 100), 0.10000000149011612]);
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("＀ ＀%", [live(ctag_1), live(percentage_2)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Show Server Revision", category: "OOC", desc: "Check the current server code revision" } });
