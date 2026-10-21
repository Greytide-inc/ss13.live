// From code/modules/admin/verbs/getlogs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/getserverlog  (code/modules/admin/verbs/getlogs.dm:8)  may sleep
rt.def("/client/proc/getserverlog", function* getserverlog(f: Frame) {
	let path: Value = null;
	f.vars = () => [path];
	if (!truthy((path = (yield* g.srcCall(f, "browse_files", "data/logs/"))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "file_spam_check")))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ accessed file: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(path)])]);
	rt.op(f, "Ftp", [], [live(f.src), (yield* g.call(f, P("/proc/file"), null, [live(path)])), null], false);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Attempting to send file, this may take a fair few minutes if the file is very large."]);
	return live(f.dot);
}, true, { verb: { name: ".getserverlog", category: "", desc: "Fetch logfiles from data/logs" } });

// /datum/admins/proc/view_txt_log  (code/modules/admin/verbs/getlogs.dm:29)
rt.def("/datum/admins/proc/view_txt_log", function view_txt_log(f: Frame) {
	if (truthy(rt.call(f, P("/proc/fexists"), null, [fmt("＀", [rt.gl("world_game_log")])]))) {
		rt.op(f, "Ftp", [], [live(f.src), rt.gl("world_game_log"), null], false);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Server log not found, try using .getserverlog.</font>"]);
		return live(f.dot);
	}
	return live(f.dot);
}, false, { verb: { name: "Show Server Log", category: "Admin", desc: "Shows server log for this round." } });

// /datum/admins/proc/view_atk_log  (code/modules/admin/verbs/getlogs.dm:43)
rt.def("/datum/admins/proc/view_atk_log", function view_atk_log(f: Frame) {
	if (truthy(rt.call(f, P("/proc/fexists"), null, [fmt("＀", [rt.gl("world_attack_log")])]))) {
		rt.op(f, "Ftp", [], [live(f.src), rt.gl("world_attack_log"), null], false);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<font color='red'>Server attack log not found, try using .getserverlog.</font>"]);
		return live(f.dot);
	}
	return live(f.dot);
}, false, { verb: { name: "Show Server Attack Log", category: "Admin", desc: "Shows server attack log for this round." } });
