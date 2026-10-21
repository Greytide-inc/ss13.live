// From code/__HELPERS/_logging.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/warning  (code/__HELPERS/_logging.dm:4)
rt.def("/proc/warning", function warning(f: Frame, msg: Value) {
	f.vars = () => [msg];
	rt.call(f, P("/proc/log_world"), null, [(msg = fmt("## WARNING: ＀", [live(msg)]))]);
	return f.dot;
});

// /proc/notice  (code/__HELPERS/_logging.dm:10)
rt.def("/proc/notice", function notice(f: Frame, msg: Value) {
	f.vars = () => [msg];
	rt.call(f, P("/proc/log_world"), null, [(msg = fmt("## NOTICE: ＀", [live(msg)]))]);
	return f.dot;
});

// /proc/log_admin  (code/__HELPERS/_logging.dm:21)
rt.def("/proc/log_admin", function log_admin(f: Frame, text: Value) {
	rt.callName(f, rt.gl("admin_log"), "Add", [live(text)]);
	if (!truthy(rt.fv(f, "log_admin", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]ADMIN: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_admin_private  (code/__HELPERS/_logging.dm:27)
rt.def("/proc/log_admin_private", function log_admin_private(f: Frame, text: Value) {
	rt.callName(f, rt.gl("admin_log"), "Add", [live(text)]);
	if (!truthy(rt.fv(f, "log_admin", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]ADMINPRIVATE: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_adminsay  (code/__HELPERS/_logging.dm:32)
rt.def("/proc/log_adminsay", function log_adminsay(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_adminchat", rt.gl("config")))) return f.dot;
	rt.call(f, P("/proc/log_admin_private"), null, [fmt("ASAY: ＀", [live(text)])]);
	return f.dot;
});

// /proc/log_dsay  (code/__HELPERS/_logging.dm:36)
rt.def("/proc/log_dsay", function log_dsay(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_adminchat", rt.gl("config")))) return f.dot;
	rt.call(f, P("/proc/log_admin"), null, [fmt("DSAY: ＀", [live(text)])]);
	return f.dot;
});

// /proc/log_game  (code/__HELPERS/_logging.dm:40)
rt.def("/proc/log_game", function log_game(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_game", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]GAME: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_vote  (code/__HELPERS/_logging.dm:44)
rt.def("/proc/log_vote", function log_vote(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_vote", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]VOTE: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_access  (code/__HELPERS/_logging.dm:48)
rt.def("/proc/log_access", function log_access(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_access", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]ACCESS: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_say  (code/__HELPERS/_logging.dm:52)
rt.def("/proc/log_say", function log_say(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_say", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]SAY: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_prayer  (code/__HELPERS/_logging.dm:56)
rt.def("/proc/log_prayer", function log_prayer(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_prayer", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]PRAY: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_law  (code/__HELPERS/_logging.dm:60)
rt.def("/proc/log_law", function log_law(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_law", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]LAW: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_ooc  (code/__HELPERS/_logging.dm:64)
rt.def("/proc/log_ooc", function log_ooc(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_ooc", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]OOC: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_whisper  (code/__HELPERS/_logging.dm:68)
rt.def("/proc/log_whisper", function log_whisper(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_whisper", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]WHISPER: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_emote  (code/__HELPERS/_logging.dm:72)
rt.def("/proc/log_emote", function log_emote(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_emote", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]EMOTE: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_attack  (code/__HELPERS/_logging.dm:76)
rt.def("/proc/log_attack", function log_attack(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_attack", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(109)], [fmt("[＀]ATTACK: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_pda  (code/__HELPERS/_logging.dm:80)
rt.def("/proc/log_pda", function log_pda(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_pda", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]PDA: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_comment  (code/__HELPERS/_logging.dm:84)
rt.def("/proc/log_comment", function log_comment(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_pda", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]COMMENT: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_chat  (code/__HELPERS/_logging.dm:89)
rt.def("/proc/log_chat", function log_chat(f: Frame, text: Value) {
	if (!truthy(rt.fv(f, "log_pda", rt.gl("config")))) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [fmt("[＀]CHAT: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(text)])], false);
	return f.dot;
});

// /proc/log_world  (code/__HELPERS/_logging.dm:98)
rt.def("/proc/log_world", function log_world(f: Frame, text: Value) {
	rt.op(f, "OutputReference", [rt.R.glob(108)], [live(text)], false);
	rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), live(text)], false);
	return f.dot;
});

// /proc/datum_info_line  (code/__HELPERS/_logging.dm:104)
rt.def("/proc/datum_info_line", function datum_info_line(f: Frame, D: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((rt.istype(live(D), T("/datum")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [live(D)]))) {
		return fmt("＀ (＀)", [live(D), rt.fv(f, "type", live(D))]);
	}
	return fmt("＀ (＀) (＀)", [(M = live(D)), rt.fv(f, "ckey", live(M)), rt.fv(f, "type", live(M))]);
});

// /proc/atom_loc_line  (code/__HELPERS/_logging.dm:112)
rt.def("/proc/atom_loc_line", function atom_loc_line(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((rt.istype(live(A), T("/atom")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.istype((_T = rt.getStep(f, live(A), 0)), T("/turf")) ? 1 : 0))) {
		return fmt("＀ ＀ (＀)", [rt.fv(f, "loc", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), rt.gv(f, "type", rt.fv(f, "loc", live(A)))]);
	}
	if (!truthy(rt.fv(f, "loc", live(A)))) return f.dot;
	return fmt("＀ (0, 0, 0) (＀)", [rt.fv(f, "loc", live(A)), rt.gv(f, "type", rt.fv(f, "loc", live(A)))]);
});
