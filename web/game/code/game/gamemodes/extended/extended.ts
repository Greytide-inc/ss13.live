// Based on /tg/station's code/game/gamemodes/extended/extended.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1091, "/datum/game_mode/extended", "/datum/game_mode", {
	name: "secret extended",
	config_tag: "secret_extended",
	required_players: 0,
	announce_span: "notice",
	announce_text: "Just have fun and enjoy the game!",
});

// extended.dm:13
rt.def("/datum/game_mode/extended/proc/post_setup", function* post_setup(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(1092, "/datum/game_mode/extended/announced", "/datum/game_mode/extended", {
	name: "extended",
	config_tag: "extended",
});

// extended.dm:20
rt.def("/datum/game_mode/extended/announced/proc/generate_station_goals", function* generate_station_goals(f: Frame) {
	let _T: Value = null, G: Value = null;
	for (_T of each(typesof(T("/datum/station_goal")) - T("/datum/station_goal"))) {
		this.station_goals += (G = (yield* new_(_T)));
		G.on_report();
	}
	return f.dot;
}, true);

// extended.dm:26
rt.def("/datum/game_mode/extended/announced/proc/send_intercept", function* send_intercept(f: Frame, report: Value) {
	report ??= 0;
	yield* priority_announce(`Thanks to the tireless efforts of our security and intelligence divisions, there are currently no credible threats to ${station_name()}. All station construction projects have been authorized. Have a secure shift!`, "Security Report", rt.rsc("sound/ai/commandreport.ogg"));
	return f.dot;
}, true);
