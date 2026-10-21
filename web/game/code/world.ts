// From code/world.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1, "/world", "/", {
	contents: null,
	vars: null,
	log: null,
	area: rt.typePath("/area/space"),
	turf: rt.typePath("/turf/open/space/basic"),
	mob: rt.typePath("/mob/dead/new_player"),
	name: "/tg/ Station 13",
	time: null,
	timezone: 0,
	timeofday: null,
	realtime: null,
	tick_lag: 1,
	cpu: 0,
	fps: 20,
	tick_usage: null,
	loop_checks: 0,
	maxx: null,
	maxy: null,
	maxz: null,
	icon_size: 32,
	view: "15x15",
	movement_mode: 0,
	byond_version: 511,
	byond_build: 1385,
	version: 0,
	address: null,
	port: 0,
	internet_address: "127.0.0.1",
	url: null,
	visibility: 0,
	status: "",
	process: null,
	params: null,
	sleep_offline: 0,
	system_type: null,
	map_cpu: 0,
	game_state: 0,
	host: "",
	map_format: 0,
	cache_lifespan: 7,
	executor: "",
	opendream_topic_port: null,
}, { const: ["system_type","opendream_topic_port"] });

// /world/proc/New  built in (BYOND provides it)
rt.def("/world/proc/New");

// /world/proc/New  (code/world.dm:17)  may sleep
rt.def("/world/proc/New", function* New(f: Frame) {
	yield* g.call(f, P("/proc/log_world"), null, [fmt("World loaded at ＀", [(yield* g.call(f, P("/proc/time_stamp"), null, []))])]);
	rt.setGl("config_error_log", (rt.setGl("world_href_log", (rt.setGl("world_runtime_log", (rt.setGl("world_attack_log", (rt.setGl("world_game_log", (yield* g.call(f, P("/proc/file"), null, ["data/logs/config_error.log"])))))))))));
	yield* g.call(f, P("/proc/make_datum_references_lists"), null, []);
	rt.setGl("config", (yield* g.new_(f, T("/datum/configuration"), [])));
	yield* g.srcCall(f, "SetupLogs");
	yield* g.srcCall(f, "load_motd");
	yield* g.call(f, P("/proc/load_admins"), null, []);
	yield* g.srcCall(f, "LoadVerbs", T("/datum/verbs/menu"));
	yield* g.call(f, P("/proc/LoadBans"), null, []);
	rt.setGl("timezoneOffset", multiply((yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/time2text"), null, [0, "hh"]))])), 36000));
	yield* g.callName(f, rt.gl("Master"), "Initialize", [10, 0]);
	return f.dot;
}, true);

// /world/proc/SetupLogs  (code/world.dm:88)
rt.def("/world/proc/SetupLogs", function SetupLogs(f: Frame) {
	rt.setGl("log_directory", fmt("data/logs/＀/round-", [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "YYYY/MM/DD"])]));
	rt.modGl("log_directory", fmt("＀", [rt.call(f, P("/proc/replacetext"), null, [rt.call(f, P("/proc/time_stamp"), null, []), ":", "."])]), add);
	rt.setGl("world_game_log", rt.call(f, P("/proc/file"), null, [fmt("＀/game.log", [rt.gl("log_directory")])]));
	rt.setGl("world_attack_log", rt.call(f, P("/proc/file"), null, [fmt("＀/attack.log", [rt.gl("log_directory")])]));
	rt.setGl("world_runtime_log", rt.call(f, P("/proc/file"), null, [fmt("＀/runtime.log", [rt.gl("log_directory")])]));
	rt.setGl("world_href_log", rt.call(f, P("/proc/file"), null, [fmt("＀/hrefs.html", [rt.gl("log_directory")])]));
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("\n\nStarting up round ID . ＀\n---------------------", [rt.call(f, P("/proc/time_stamp"), null, [])])], false);
	rt.op(f, "OutputReference", [rt.R.glob(109)], [fmt("\n\nStarting up round ID . ＀\n---------------------", [rt.call(f, P("/proc/time_stamp"), null, [])])], false);
	rt.op(f, "OutputReference", [rt.R.glob(108)], [fmt("\n\nStarting up round ID . ＀\n---------------------", [rt.call(f, P("/proc/time_stamp"), null, [])])], false);
	rt.setGl("changelog_hash", rt.call(f, P("/proc/md5"), null, [rt.rsc("html/changelog.html")]));
	if (truthy(rt.call(f, P("/proc/fexists"), null, [rt.gl("config_error_log")]))) {
		rt.call(f, P("/proc/fcopy"), null, [rt.gl("config_error_log"), fmt("＀/config_error.log", [rt.gl("log_directory")])]);
		rt.call(f, P("/proc/fdel"), null, [rt.gl("config_error_log")]);
	}
	return f.dot;
});

// /world/proc/Reboot  built in (BYOND provides it)
rt.def("/world/proc/Reboot");

// /world/proc/Reboot  (code/world.dm:243)  may sleep
rt.def("/world/proc/Reboot", function* Reboot(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((truthy(live(f.args[0])) || truthy(live(f.args[1])))) {
		if (truthy(live(f.usr))) {
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ Has requested an immediate world restart via client side debugging tools", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ Has requested an immediate world restart via client side debugging tools", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Rebooting World immediately due to host request</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Rebooting world...</span>"]);
		yield* g.callName(f, rt.gl("Master"), "Shutdown", []);
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("World rebooted at ＀", [(yield* g.call(f, P("/proc/time_stamp"), null, []))])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["reason", "fast_track"] });

// /world/proc/load_motd  (code/world.dm:256)
rt.def("/world/proc/load_motd", function load_motd(f: Frame) {
	rt.setGl("join_motd", add(rt.call(f, P("/proc/file2text"), null, ["config/motd.txt"]), "<br>"));
	return f.dot;
});

// /world/proc/update_status  (code/world.dm:259)
rt.def("/world/proc/update_status", function update_status(f: Frame) {
	let s: Value = null, features: Value = null, n: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [s, features, n, M, $0, $e];
	s = "";
	if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "server_name", rt.gl("config"))))) {
		s = rt.modify(live(s), fmt("<b>＀</b> &#8212; ", [rt.fv(f, "server_name", rt.gl("config"))]), add);
	}
	s = rt.modify(live(s), fmt("<b>＀</b>", [rt.call(f, P("/proc/station_name"), null, [])]), add);
	s = rt.modify(live(s), " (", add);
	s = rt.modify(live(s), "<a href=\"http://\">", add);
	s = rt.modify(live(s), "Default", add);
	s = rt.modify(live(s), "</a>", add);
	s = rt.modify(live(s), ")", add);
	features = rt.list();
	if (truthy(rt.gl("SSticker"))) {
		if (truthy(rt.gl("master_mode"))) {
			features = rt.modify(live(features), rt.gl("master_mode"), add);
		}
	} else {
		features = rt.modify(live(features), "<b>STARTING</b>", add);
	}
	if (!truthy(rt.gl("enter_allowed"))) {
		features = rt.modify(live(features), "closed", add);
	}
	if (truthy(rt.gl("abandon_allowed"))) {
		$0 = "respawn";
	} else {
		$0 = "no respawn";
	}
	features = rt.modify(live(features), $0, add);
	if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "allow_vote_mode", rt.gl("config"))))) {
		features = rt.modify(live(features), "vote", add);
	}
	if ((truthy(rt.gl("config")) && truthy(rt.fv(f, "allow_ai", rt.gl("config"))))) {
		features = rt.modify(live(features), "AI allowed", add);
	}
	n = 0;
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "client", live(M)))) {
			n = rt.inc(live(n), 1);
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(live(n), 1)) {
		features = rt.modify(live(features), fmt("~＀ players", [live(n)]), add);
	} else {
		if (rt.gt(live(n), 0)) {
			features = rt.modify(live(features), fmt("~＀ player", [live(n)]), add);
		}
	}
	if (truthy(live(features))) {
		s = rt.modify(live(s), fmt(": ＀", [rt.call(f, P("/proc/jointext"), null, [live(features), ", "])]), add);
	}
	rt.setSv(f, "status", live(s));
	return f.dot;
});
