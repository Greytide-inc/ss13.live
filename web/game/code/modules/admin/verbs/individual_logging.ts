// Based on /tg/station's code/modules/admin/verbs/individual_logging.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// individual_logging.dm:2
rt.def("/proc/show_individual_logging_panel", function show_individual_logging_panel(f: Frame, M: Value, type: Value) {
	let log_type: Value = null, reversed: Value = null, entry: Value = null, reversed_1: Value = null, entry_2: Value = null;
	type ??= "Attack log";
	if (!M || !ismob(M)) {
		return f.dot;
	}
	let dat: Value = fmt("<center><a href='?_src_=holder;individuallog=＃;log_type=＀'>Attack log</a> | ", [M, "Attack log"]);
	dat += fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Say log</a> | ", [M, "Say log"]);
	dat += fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Emote log</a> | ", [M, "Emote log"]);
	dat += fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>OOC log</a> | ", [M, "OOC log"]);
	dat += fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Show all</a> | ", [M, "All logs"]);
	dat += fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Refresh</a></center>", [M, type]);
	dat += "<hr style='background:#000000; border:0; height:1px'>";
	if (type == "All logs") {
		dat += `<center>Displaying all logs of ${key_name(M)}</center><br><hr>`;
		for (log_type of each(M.logging)) {
			dat += `<center><b>${log_type}</b></center><br>`;
			if (rt.istype((reversed = rt.index(M.logging, log_type)), T("/list"))) {
				reversed = reverseRange(reversed.Copy());
				entry = null;
				for (entry of each(reversed)) {
					dat += `<font size=2px>${entry}: ${rt.index(reversed, entry)}</font><br>`;
				}
			}
			dat += "<hr>";
		}
	} else {
		dat += `<center>${type} of ${key_name(M)}</center><br>`;
		if (reversed_1 = rt.index(M.logging, type)) {
			reversed_1 = reverseRange(reversed_1.Copy());
			for (entry_2 of each(reversed_1)) {
				dat += `<font size=2px>${entry_2}: ${rt.index(reversed_1, entry_2)}</font><hr>`;
			}
		}
	}
	rt.op(f, "Browse", [], [f.usr, dat, `window=invidual_logging_${M};size=600x480`], false);
	return f.dot;
});
