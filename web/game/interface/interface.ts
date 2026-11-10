// Based on /tg/station's interface/interface.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// interface.dm:6
rt.def("/client/verb/wiki", function* wiki(f: Frame) {
	if (GLOB.config.wikiurl) {
		if ((yield* alert("This will open the wiki in your browser. Are you sure?", null, "Yes", "No")) == "No") {
			return f.dot;
		}
		rt.op(f, "Link", [], [this, GLOB.config.wikiurl], false);
	} else {
		to_chat(this, "<span class='danger'>The wiki URL is not set in the server configuration.</span>");
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "wiki", desc: "Visit the wiki." } });

// interface.dm:18
rt.def("/client/verb/forum", function* forum(f: Frame) {
	if (GLOB.config.forumurl) {
		if ((yield* alert("This will open the forum in your browser. Are you sure?", null, "Yes", "No")) == "No") {
			return f.dot;
		}
		rt.op(f, "Link", [], [this, GLOB.config.forumurl], false);
	} else {
		to_chat(this, "<span class='danger'>The forum URL is not set in the server configuration.</span>");
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "forum", desc: "Visit the forum." } });

// interface.dm:30
rt.def("/client/verb/rules", function* rules(f: Frame) {
	if (GLOB.config.rulesurl) {
		if ((yield* alert("This will open the rules in your browser. Are you sure?", null, "Yes", "No")) == "No") {
			return f.dot;
		}
		rt.op(f, "Link", [], [this, GLOB.config.rulesurl], false);
	} else {
		to_chat(this, "<span class='danger'>The rules URL is not set in the server configuration.</span>");
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "rules", desc: "Show Server Rules." } });

// interface.dm:42
rt.def("/client/verb/github", function* github(f: Frame) {
	if (GLOB.config.githuburl) {
		if ((yield* alert("This will open the Github repository in your browser. Are you sure?", null, "Yes", "No")) == "No") {
			return f.dot;
		}
		rt.op(f, "Link", [], [this, GLOB.config.githuburl], false);
	} else {
		to_chat(this, "<span class='danger'>The Github URL is not set in the server configuration.</span>");
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "github", desc: "Visit Github" } });

// interface.dm:54
rt.def("/client/verb/reportissue", function* reportissue(f: Frame) {
	let message: Value = null;
	if (GLOB.config.githuburl) {
		message = "This will open the Github issue reporter in your browser. Are you sure?";
		if ((yield* tgalert(this, message, "Report Issue", "Yes", "No")) == "No") {
			return f.dot;
		}
		rt.op(f, "Link", [], [this, `${GLOB.config.githuburl}/issues/new`], false);
	} else {
		to_chat(this, "<span class='danger'>The Github URL is not set in the server configuration.</span>");
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "report-issue", desc: "Report an issue" } });

// interface.dm:70
rt.def("/client/verb/hotkeys_help", function hotkeys_help(f: Frame) {
	let adminhotkeys: Value = "<font color='purple'>\nAdmin:\n\tF5 = Aghost (admin-ghost)\n\tF6 = player-panel\n\tF7 = admin-pm\n\tF8 = Invisimin\n</font>";
	this.mob.hotkey_help();
	if (!this.holder) return f.dot;
	to_chat(this, adminhotkeys);
	return f.dot;
}, false, { verb: { name: "hotkeys-help", category: "OOC" } });

// interface.dm:86
rt.def("/client/verb/changelog", function* changelog(f: Frame) {
	let changelog: Value = null;
	yield* (changelog = (yield* get_asset_datum(T("/datum/asset/simple/changelog")))).send(this);
	rt.op(f, "Browse", [], [this, rt.rsc("html/changelog.html"), "window=changes;size=675x650"], false);
	if (this.prefs.lastchangelog == GLOB.changelog_hash) return f.dot;
	this.prefs.lastchangelog = GLOB.changelog_hash;
	this.prefs.save_preferences();
	winset(this, "infowindow.changelog", "font-style=;");
	return f.dot;
}, true, { verb: { name: "Changelog", category: "OOC" } });

// interface.dm:96
rt.def("/mob/proc/hotkey_help", function hotkey_help(f: Frame) {
	let hotkey_mode: Value = "<div class='boldnotice'>Hotkeys (always on in this game; hold Ctrl and the letters and numbers still work the same)</div><table><tr><td colspan=2><b>Moving</b></td></tr><tr><td>&nbsp;&nbsp;<tt>W A S D</tt></td><td>move</td></tr><tr><td>&nbsp;&nbsp;<tt>Alt (hold)</tt></td><td>alter movement intent</td></tr><tr><td colspan=2><b>Hands and items</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Q</tt></td><td>drop</td></tr><tr><td>&nbsp;&nbsp;<tt>E</tt></td><td>equip</td></tr><tr><td>&nbsp;&nbsp;<tt>R</tt></td><td>throw</td></tr><tr><td>&nbsp;&nbsp;<tt>X</tt></td><td>swap hand</td></tr><tr><td>&nbsp;&nbsp;<tt>Z or Y</tt></td><td>activate held object</td></tr><tr><td>&nbsp;&nbsp;<tt>B</tt></td><td>resist</td></tr><tr><td colspan=2><b>Intents</b></td></tr><tr><td>&nbsp;&nbsp;<tt>F / G</tt></td><td>cycle intent left / right</td></tr><tr><td>&nbsp;&nbsp;<tt>1 2 3 4</tt></td><td>help / disarm / grab / harm</td></tr><tr><td>&nbsp;&nbsp;<tt>Numpad</tt></td><td>target body part (press 8 repeatedly: Head, Eyes, Mouth)</td></tr><tr><td colspan=2><b>Talking</b></td></tr><tr><td>&nbsp;&nbsp;<tt>T</tt></td><td>say (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>M</tt></td><td>me (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>O</tt></td><td>OOC</td></tr><tr><td>&nbsp;&nbsp;<tt>Tab / Shift+Tab</tt></td><td>in the box: next / previous channel (Say, Radio, Me, Whisper)</td></tr><tr><td>&nbsp;&nbsp;<tt>Enter / Esc</tt></td><td>send / close the box</td></tr></table>";
	let other: Value = "<div class='boldnotice'>Extra keys</div><table><tr><td colspan=2><b>Other</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Del</tt></td><td>pull</td></tr><tr><td>&nbsp;&nbsp;<tt>Ins</tt></td><td>cycle intent right</td></tr><tr><td>&nbsp;&nbsp;<tt>Home</tt></td><td>drop</td></tr><tr><td>&nbsp;&nbsp;<tt>PgUp</tt></td><td>swap hand</td></tr><tr><td>&nbsp;&nbsp;<tt>PgDn</tt></td><td>activate held object</td></tr><tr><td>&nbsp;&nbsp;<tt>End</tt></td><td>throw</td></tr><tr><td>&nbsp;&nbsp;<tt>Ctrl+Numpad</tt></td><td>target body part</td></tr><tr><td>&nbsp;&nbsp;<tt>Ctrl +/- or Shift+Wheel</tt></td><td>ghost zoom in / out</td></tr></table>";
	to_chat(this, hotkey_mode);
	to_chat(this, other);
	return f.dot;
});

// interface.dm:157
rt.def("/mob/living/silicon/robot/proc/hotkey_help", function hotkey_help(f: Frame) {
	let hotkey_mode: Value = "<div class='boldnotice'>Hotkeys (always on in this game; hold Ctrl and the letters and numbers still work the same)</div><table><tr><td colspan=2><b>Moving</b></td></tr><tr><td>&nbsp;&nbsp;<tt>W A S D</tt></td><td>move</td></tr><tr><td colspan=2><b>Modules</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Q</tt></td><td>unequip active module</td></tr><tr><td>&nbsp;&nbsp;<tt>X</tt></td><td>cycle active modules</td></tr><tr><td>&nbsp;&nbsp;<tt>Z or Y</tt></td><td>activate held object</td></tr><tr><td>&nbsp;&nbsp;<tt>1 2 3</tt></td><td>activate module 1 / 2 / 3</td></tr><tr><td>&nbsp;&nbsp;<tt>B</tt></td><td>resist</td></tr><tr><td colspan=2><b>Intents</b></td></tr><tr><td>&nbsp;&nbsp;<tt>F / G</tt></td><td>cycle intent left / right</td></tr><tr><td>&nbsp;&nbsp;<tt>4</tt></td><td>toggle intents</td></tr><tr><td colspan=2><b>Talking</b></td></tr><tr><td>&nbsp;&nbsp;<tt>T</tt></td><td>say (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>M</tt></td><td>me (opens the input box)</td></tr><tr><td>&nbsp;&nbsp;<tt>O</tt></td><td>OOC</td></tr><tr><td>&nbsp;&nbsp;<tt>Tab / Shift+Tab</tt></td><td>in the box: next / previous channel (Say, Radio, Me, Whisper)</td></tr><tr><td>&nbsp;&nbsp;<tt>Enter / Esc</tt></td><td>send / close the box</td></tr><tr><td>&nbsp;&nbsp;<tt>H</tt></td><td>talk-wheel</td></tr></table>";
	let other: Value = "<div class='boldnotice'>Extra keys</div><table><tr><td colspan=2><b>Other</b></td></tr><tr><td>&nbsp;&nbsp;<tt>Del</tt></td><td>pull</td></tr><tr><td>&nbsp;&nbsp;<tt>Ins</tt></td><td>toggle intents</td></tr><tr><td>&nbsp;&nbsp;<tt>PgUp</tt></td><td>cycle active modules</td></tr><tr><td>&nbsp;&nbsp;<tt>PgDn</tt></td><td>activate held object</td></tr></table>";
	to_chat(this, hotkey_mode);
	to_chat(this, other);
	return f.dot;
});

// interface.dm:212
rt.def("/client/verb/_swinset", function _swinset(f: Frame, x: Value) {
	// tg_js: does nothing. Nothing sends .swinset (no skin button, no page script), and through it any text a player typed reached
	// the game's own winset, past the limits on a player's winsets (web/src/vm/clients.ts winset). `.winset` does the same job.
	return f.dot;
}, false, { hidden: true, verb: { name: ".swinset" }, argTypes: [{ type: 2 }] });

// /client/verb/showrevinfo  (tg_js: moved here from the removed revision datum)
rt.def("/client/verb/showrevinfo", function showrevinfo(f: Frame) {
	let prob_sum: Value = null, current_odds_differ: Value = null, probs: Value = null, modes: Value = null, mode: Value = null, M: Value = null, ctag: Value = null, ctag_4: Value = null, percentage: Value = null, ctag_1: Value = null, percentage_2: Value = null;
	if (GLOB.config.githuburl) to_chat(this, `Source: <a href="${GLOB.config.githuburl}">${GLOB.config.githuburl}</a>`);
	to_chat(this, "<b>Current Infomational Settings:</b>");
	to_chat(this, `Protect Authority Roles From Traitor: ${GLOB.config.protect_roles_from_antagonist}`);
	to_chat(this, `Protect Assistant Role From Traitor: ${GLOB.config.protect_assistant_from_antagonist}`);
	to_chat(this, `Enforce Human Authority: ${GLOB.config.enforce_human_authority}`);
	to_chat(this, `Allow Latejoin Antagonists: ${GLOB.config.allow_latejoin_antagonists}`);
	to_chat(this, `Enforce Continuous Rounds: ${rt.len(f, GLOB.config.continuous)} of ${rt.len(f, GLOB.config.modes)} roundtypes`);
	to_chat(this, `Allow Midround Antagonists: ${rt.len(f, GLOB.config.midround_antag)} of ${rt.len(f, GLOB.config.modes)} roundtypes`);
	if (!GLOB.config.show_game_type_odds) return f.dot;
	if (GLOB.SSticker.IsRoundInProgress()) {
		prob_sum = 0;
		current_odds_differ = 0;
		probs = list();
		modes = GLOB.config.gamemode_cache;
		for (mode of each(modes)) {
			M = mode;
			if (!rt.isIn(f, (ctag = rt.initial(f, M, "config_tag")), GLOB.config.probabilities)) {
				continue;
			}
			if (rt.index(GLOB.config.min_pop, ctag) && rt.index(GLOB.config.min_pop, ctag) > GLOB.SSticker.totalPlayersReady || rt.index(GLOB.config.max_pop, ctag) && rt.index(GLOB.config.max_pop, ctag) < GLOB.SSticker.totalPlayersReady || rt.initial(f, M, "required_players") > GLOB.SSticker.totalPlayersReady) {
				current_odds_differ = 1;
				continue;
			}
			rt.setAt(probs, ctag, 1);
			prob_sum += rt.index(GLOB.config.probabilities, ctag);
		}
		if (current_odds_differ) {
			to_chat(this, "<b>Game Mode Odds for current round:</b>");
			for (ctag_4 of each(probs)) {
				if (rt.index(GLOB.config.probabilities, ctag_4) > 0) {
					percentage = round(rt.index(GLOB.config.probabilities, ctag_4) / prob_sum * 100, 0.1);
					to_chat(this, `${ctag_4} ${percentage}%`);
				}
			}
		}
	}
	to_chat(this, "<b>All Game Mode Odds:</b>");
	let sum: Value = 0;
	for (ctag_1 of each(GLOB.config.probabilities)) {
		sum += rt.index(GLOB.config.probabilities, ctag_1);
	}
	ctag_1 = null;
	for (ctag_1 of each(GLOB.config.probabilities)) {
		if (rt.index(GLOB.config.probabilities, ctag_1) > 0) {
			percentage_2 = round(rt.index(GLOB.config.probabilities, ctag_1) / sum * 100, 0.1);
			to_chat(this, `${ctag_1} ${percentage_2}%`);
		}
	}
	return f.dot;
}, false, { verb: { name: "Show Server Revision", category: "OOC", desc: "Check the current server code revision" } });
