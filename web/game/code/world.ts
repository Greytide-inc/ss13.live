// Based on /tg/station's code/world.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// BYOND built-in.
rt.def("/world/proc/New");

// world.dm:17
rt.def("/world/proc/New", function* New(f: Frame) {
	log_world(`World loaded at ${time_stamp()}`);
	GLOB.config_error_log = (rt.setGl("world_href_log", (rt.setGl("world_runtime_log", (rt.setGl("world_attack_log", (rt.setGl("world_game_log", file("data/logs/config_error.log")))))))));
	yield* make_datum_references_lists();
	GLOB.config = (yield* new_(T("/datum/configuration")));
	this.SetupLogs();
	this.load_motd();
	yield* load_admins();
	yield* this.LoadVerbs(T("/datum/verbs/menu"));
	LoadBans();
	GLOB.timezoneOffset = text2num(time2text(0, "hh")) * 36000;
	yield* GLOB.Master.Initialize(10, 0);
	return f.dot;
}, true);

// world.dm:88
rt.def("/world/proc/SetupLogs", function SetupLogs(f: Frame) {
	GLOB.log_directory = `data/logs/${time2text(rt.world().realtime, "YYYY/MM/DD")}/round-`;
	GLOB.log_directory += `${replacetext(time_stamp(), ":", ".")}`;
	GLOB.world_game_log = file(`${GLOB.log_directory}/game.log`);
	GLOB.world_attack_log = file(`${GLOB.log_directory}/attack.log`);
	GLOB.world_runtime_log = file(`${GLOB.log_directory}/runtime.log`);
	GLOB.world_href_log = file(`${GLOB.log_directory}/hrefs.html`);
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`\n\nStarting up round ID . ${time_stamp()}\n---------------------`], false);
	rt.op(f, "OutputReference", [rt.R.glob(109)], [`\n\nStarting up round ID . ${time_stamp()}\n---------------------`], false);
	rt.op(f, "OutputReference", [rt.R.glob(108)], [`\n\nStarting up round ID . ${time_stamp()}\n---------------------`], false);
	GLOB.changelog_hash = md5(rt.rsc("html/changelog.html"));
	if (fexists(GLOB.config_error_log)) {
		fcopy(GLOB.config_error_log, `${GLOB.log_directory}/config_error.log`);
		fdel(GLOB.config_error_log);
	}
	return f.dot;
});

// BYOND built-in.
rt.def("/world/proc/Reboot");

// world.dm:243
rt.def("/world/proc/Reboot", function* Reboot(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0] || f.args[1]) {
		if (f.usr) {
			log_admin(`${key_name(f.usr)} Has requested an immediate world restart via client side debugging tools`);
			message_admins(`${key_name_admin(f.usr)} Has requested an immediate world restart via client side debugging tools`);
		}
		to_chat(rt.world(), "<span class='boldannounce'>Rebooting World immediately due to host request</span>");
	} else {
		to_chat(rt.world(), "<span class='boldannounce'>Rebooting world...</span>");
		yield* GLOB.Master.Shutdown();
	}
	log_world(`World rebooted at ${time_stamp()}`);
	yield* parent_proc();
	return f.dot;
}, true, { args: ["reason", "fast_track"] });

// world.dm:256
rt.def("/world/proc/load_motd", function load_motd(f: Frame) {
	GLOB.join_motd = file2text("config/motd.txt") + "<br>";
	return f.dot;
});

// world.dm:259
rt.def("/world/proc/update_status", function update_status(f: Frame) {
	let M: Value = null;
	let $e: any;
	let s: Value = "";
	if (GLOB.config && GLOB.config.server_name) {
		s += `<b>${GLOB.config.server_name}</b> &#8212; `;
	}
	s += `<b>${station_name()}</b>`;
	s += " (";
	s += "<a href=\"http://\">";
	s += "Default";
	s += "</a>";
	s += ")";
	let features: Value = list();
	if (GLOB.SSticker) {
		if (GLOB.master_mode) {
			features += GLOB.master_mode;
		}
	} else {
		features += "<b>STARTING</b>";
	}
	if (!GLOB.enter_allowed) {
		features += "closed";
	}
	features += GLOB.abandon_allowed ? "respawn" : "no respawn";
	if (GLOB.config && GLOB.config.allow_vote_mode) {
		features += "vote";
	}
	if (GLOB.config && GLOB.config.allow_ai) {
		features += "AI allowed";
	}
	let n: Value = 0;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (M.client) {
			n++;
		}
	}
	if (n > 1) {
		features += `~${n} players`;
	} else if (n > 0) {
		features += `~${n} player`;
	}
	if (features) {
		s += `: ${jointext(features, ", ")}`;
	}
	this.status = s;
	return f.dot;
});
