// Based on /tg/station's code/modules/admin/verbs/getlogs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// getlogs.dm:8
rt.def("/client/proc/getserverlog", function* getserverlog(f: Frame) {
	let path: Value = null;
	if (!(path = (yield* this.browse_files("data/logs/")))) {
		return f.dot;
	}
	if (this.file_spam_check()) {
		return f.dot;
	}
	message_admins(`${key_name_admin(this)} accessed file: ${path}`);
	rt.op(f, "Ftp", [], [this, file(path), null], false);
	to_chat(this, "Attempting to send file, this may take a fair few minutes if the file is very large.");
	return f.dot;
}, true, { verb: { name: ".getserverlog", category: "", desc: "Fetch logfiles from data/logs" } });

// getlogs.dm:29
rt.def("/datum/admins/proc/view_txt_log", function view_txt_log(f: Frame) {
	if (fexists(`${GLOB.world_game_log}`)) {
		rt.op(f, "Ftp", [], [this, GLOB.world_game_log, null], false);
	} else {
		to_chat(this, "<font color='red'>Server log not found, try using .getserverlog.</font>");
		return f.dot;
	}
	return f.dot;
}, false, { verb: { name: "Show Server Log", category: "Admin", desc: "Shows server log for this round." } });

// getlogs.dm:43
rt.def("/datum/admins/proc/view_atk_log", function view_atk_log(f: Frame) {
	if (fexists(`${GLOB.world_attack_log}`)) {
		rt.op(f, "Ftp", [], [this, GLOB.world_attack_log, null], false);
	} else {
		to_chat(this, "<font color='red'>Server attack log not found, try using .getserverlog.</font>");
		return f.dot;
	}
	return f.dot;
}, false, { verb: { name: "Show Server Attack Log", category: "Admin", desc: "Shows server attack log for this round." } });
