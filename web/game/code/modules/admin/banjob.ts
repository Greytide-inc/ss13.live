// From code/modules/admin/banjob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/jobban_isbanned  (code/modules/admin/banjob.dm:3)
// Job bans lived only in the SQL database, which is gone: nothing can set one, so nobody is job-banned.
// Kept as a stub because ~40 callers still ask (a later cleanup can drop them).
rt.def("/proc/jobban_isbanned", function jobban_isbanned(f: Frame, M: Value, rank: Value) {
	return 0;
});

// /proc/ban_unban_log_save  (code/modules/admin/banjob.dm:34)
rt.def("/proc/ban_unban_log_save", function ban_unban_log_save(f: Frame, formatted_log: Value) {
	rt.call(f, P("/proc/text2file"), null, [live(formatted_log), "data/ban_unban_log.txt"]);
	return f.dot;
});
