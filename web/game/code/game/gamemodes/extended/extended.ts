// From code/game/gamemodes/extended/extended.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1091, "/datum/game_mode/extended", "/datum/game_mode", {
	name: "secret extended",
	config_tag: "secret_extended",
	required_players: 0,
	announce_span: "notice",
	announce_text: "Just have fun and enjoy the game!",
});

// /datum/game_mode/extended/proc/post_setup  (code/game/gamemodes/extended/extended.dm:13)  may sleep
rt.def("/datum/game_mode/extended/proc/post_setup", function* post_setup(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(1092, "/datum/game_mode/extended/announced", "/datum/game_mode/extended", {
	name: "extended",
	config_tag: "extended",
});

// /datum/game_mode/extended/announced/proc/generate_station_goals  (code/game/gamemodes/extended/extended.dm:20)  may sleep
rt.def("/datum/game_mode/extended/announced/proc/generate_station_goals", function* generate_station_goals(f: Frame) {
	let _T: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [_T, G, $e];
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/station_goal")])), T("/datum/station_goal")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "station_goals", (G = (yield* g.new_(f, live(_T), []))), add);
		yield* g.callName(f, live(G), "on_report", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/game_mode/extended/announced/proc/send_intercept  (code/game/gamemodes/extended/extended.dm:26)  may sleep
rt.def("/datum/game_mode/extended/announced/proc/send_intercept", function* send_intercept(f: Frame, report: Value) {
	f.vars = () => [report];
	if (live(report) === null) {
		report = 0;
	}
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Thanks to the tireless efforts of our security and intelligence divisions, there are currently no credible threats to ＀. All station construction projects have been authorized. Have a secure shift!", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Security Report", rt.rsc("sound/ai/commandreport.ogg")]);
	return f.dot;
}, true);
