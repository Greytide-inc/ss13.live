// Based on /tg/station's code/__HELPERS/_logging.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// _logging.dm:4
rt.def("/proc/warning", function warning(f: Frame, msg: Value) {
	log_world((msg = `## WARNING: ${msg}`));
	return f.dot;
});

// _logging.dm:10
rt.def("/proc/notice", function notice(f: Frame, msg: Value) {
	log_world((msg = `## NOTICE: ${msg}`));
	return f.dot;
});

// _logging.dm:21
rt.def("/proc/log_admin", function log_admin(f: Frame, text: Value) {
	GLOB.admin_log.Add(text);
	if (!GLOB.config.log_admin) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]ADMIN: ${text}`], false);
	return f.dot;
});

// _logging.dm:27
rt.def("/proc/log_admin_private", function log_admin_private(f: Frame, text: Value) {
	GLOB.admin_log.Add(text);
	if (!GLOB.config.log_admin) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]ADMINPRIVATE: ${text}`], false);
	return f.dot;
});

// _logging.dm:32
rt.def("/proc/log_adminsay", function log_adminsay(f: Frame, text: Value) {
	if (!GLOB.config.log_adminchat) return f.dot;
	log_admin_private(`ASAY: ${text}`);
	return f.dot;
});

// _logging.dm:36
rt.def("/proc/log_dsay", function log_dsay(f: Frame, text: Value) {
	if (!GLOB.config.log_adminchat) return f.dot;
	log_admin(`DSAY: ${text}`);
	return f.dot;
});

// _logging.dm:40
rt.def("/proc/log_game", function log_game(f: Frame, text: Value) {
	if (!GLOB.config.log_game) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]GAME: ${text}`], false);
	return f.dot;
});

// _logging.dm:44
rt.def("/proc/log_vote", function log_vote(f: Frame, text: Value) {
	if (!GLOB.config.log_vote) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]VOTE: ${text}`], false);
	return f.dot;
});

// _logging.dm:48
rt.def("/proc/log_access", function log_access(f: Frame, text: Value) {
	if (!GLOB.config.log_access) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]ACCESS: ${text}`], false);
	return f.dot;
});

// _logging.dm:52
rt.def("/proc/log_say", function log_say(f: Frame, text: Value) {
	if (!GLOB.config.log_say) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]SAY: ${text}`], false);
	return f.dot;
});

// _logging.dm:56
rt.def("/proc/log_prayer", function log_prayer(f: Frame, text: Value) {
	if (!GLOB.config.log_prayer) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]PRAY: ${text}`], false);
	return f.dot;
});

// _logging.dm:60
rt.def("/proc/log_law", function log_law(f: Frame, text: Value) {
	if (!GLOB.config.log_law) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]LAW: ${text}`], false);
	return f.dot;
});

// _logging.dm:64
rt.def("/proc/log_ooc", function log_ooc(f: Frame, text: Value) {
	if (!GLOB.config.log_ooc) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]OOC: ${text}`], false);
	return f.dot;
});

// _logging.dm:68
rt.def("/proc/log_whisper", function log_whisper(f: Frame, text: Value) {
	if (!GLOB.config.log_whisper) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]WHISPER: ${text}`], false);
	return f.dot;
});

// _logging.dm:72
rt.def("/proc/log_emote", function log_emote(f: Frame, text: Value) {
	if (!GLOB.config.log_emote) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]EMOTE: ${text}`], false);
	return f.dot;
});

// _logging.dm:76
rt.def("/proc/log_attack", function log_attack(f: Frame, text: Value) {
	if (!GLOB.config.log_attack) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(109)], [`[${time_stamp()}]ATTACK: ${text}`], false);
	return f.dot;
});

// _logging.dm:80
rt.def("/proc/log_pda", function log_pda(f: Frame, text: Value) {
	if (!GLOB.config.log_pda) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]PDA: ${text}`], false);
	return f.dot;
});

// _logging.dm:84
rt.def("/proc/log_comment", function log_comment(f: Frame, text: Value) {
	if (!GLOB.config.log_pda) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]COMMENT: ${text}`], false);
	return f.dot;
});

// _logging.dm:89
rt.def("/proc/log_chat", function log_chat(f: Frame, text: Value) {
	if (!GLOB.config.log_pda) return f.dot;
	rt.op(f, "OutputReference", [rt.R.glob(107)], [`[${time_stamp()}]CHAT: ${text}`], false);
	return f.dot;
});

// _logging.dm:98
rt.def("/proc/log_world", function log_world(f: Frame, text: Value) {
	rt.op(f, "OutputReference", [rt.R.glob(108)], [text], false);
	rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), text], false);
	return f.dot;
});

// _logging.dm:104
rt.def("/proc/datum_info_line", function datum_info_line(f: Frame, D: Value) {
	let M: Value = null;
	if (!rt.istype(D, T("/datum"))) {
		return f.dot;
	}
	if (!ismob(D)) {
		return `${D} (${D.type})`;
	}
	return `${(M = D)} (${M.ckey}) (${M.type})`;
});

// _logging.dm:112
rt.def("/proc/atom_loc_line", function atom_loc_line(f: Frame, A: Value) {
	let _T: Value = null;
	if (!rt.istype(A, T("/atom"))) {
		return f.dot;
	}
	if (rt.istype((_T = rt.getStep(f, A, 0)), T("/turf"))) {
		return `${A.loc} ${`(${_T.x},${_T.y},${_T.z})`} (${A.loc.type})`;
	}
	if (!A.loc) return f.dot;
	return `${A.loc} (0, 0, 0) (${A.loc.type})`;
});
