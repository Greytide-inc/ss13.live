// Based on /tg/station's code/modules/admin/banjob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// banjob.dm:3
// Job bans lived only in the SQL database, which is gone: nothing can set one, so nobody is job-banned.
// Kept as a stub because ~40 callers still ask (a later cleanup can drop them).
rt.def("/proc/jobban_isbanned", function jobban_isbanned(f: Frame, M: Value, rank: Value) {
	return 0;
});

// banjob.dm:34
rt.def("/proc/ban_unban_log_save", function ban_unban_log_save(f: Frame, formatted_log: Value) {
	text2file(formatted_log, "data/ban_unban_log.txt");
	return f.dot;
});
