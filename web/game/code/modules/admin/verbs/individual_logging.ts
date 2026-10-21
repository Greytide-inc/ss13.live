// From code/modules/admin/verbs/individual_logging.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/show_individual_logging_panel  (code/modules/admin/verbs/individual_logging.dm:2)
rt.def("/proc/show_individual_logging_panel", function show_individual_logging_panel(f: Frame, M: Value, type: Value) {
	let dat: Value = null, log_type: Value = null, reversed: Value = null, entry: Value = null, reversed_1: Value = null, entry_2: Value = null;
	let $e: any;
	f.vars = () => [type, dat, log_type, reversed, entry, reversed_1, entry_2, $e];
	if (live(type) === null) {
		type = "Attack log";
	}
	if ((!truthy(live(M)) || !truthy(rt.call(f, P("/proc/ismob"), null, [live(M)])))) {
		return live(f.dot);
	}
	dat = fmt("<center><a href='?_src_=holder;individuallog=＃;log_type=＀'>Attack log</a> | ", [live(M), "Attack log"]);
	dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Say log</a> | ", [live(M), "Say log"]), add);
	dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Emote log</a> | ", [live(M), "Emote log"]), add);
	dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>OOC log</a> | ", [live(M), "OOC log"]), add);
	dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Show all</a> | ", [live(M), "All logs"]), add);
	dat = rt.modify(live(dat), fmt("<a href='?_src_=holder;individuallog=＃;log_type=＀'>Refresh</a></center>", [live(M), live(type)]), add);
	dat = rt.modify(live(dat), "<hr style='background:#000000; border:0; height:1px'>", add);
	if (isEqual(live(type), "All logs")) {
		dat = rt.modify(live(dat), fmt("<center>Displaying all logs of ＀</center><br><hr>", [rt.call(f, P("/proc/key_name"), null, [live(M)])]), add);
		log_type = null;
		rt.forList(f, 0, rt.fv(f, "logging", live(M)));
		while (($e = rt.next(f, 0)) !== undefined) {
			log_type = $e;
			dat = rt.modify(live(dat), fmt("<center><b>＀</b></center><br>", [live(log_type)]), add);
			if (truthy((rt.istype((reversed = rt.index(rt.fv(f, "logging", live(M)), live(log_type))), T("/list")) ? 1 : 0))) {
				reversed = rt.call(f, P("/proc/reverseRange"), null, [rt.callName(f, live(reversed), "Copy", [])]);
				entry = null;
				rt.forList(f, 1, live(reversed));
				while (($e = rt.next(f, 1)) !== undefined) {
					entry = $e;
					dat = rt.modify(live(dat), fmt("<font size=2px>＀: ＀</font><br>", [live(entry), rt.index(live(reversed), live(entry))]), add);
				}
				rt.endFor(f, 1);
			}
			dat = rt.modify(live(dat), "<hr>", add);
		}
		rt.endFor(f, 0);
	} else {
		dat = rt.modify(live(dat), fmt("<center>＀ of ＀</center><br>", [live(type), rt.call(f, P("/proc/key_name"), null, [live(M)])]), add);
		if (truthy((reversed_1 = rt.index(rt.fv(f, "logging", live(M)), live(type))))) {
			reversed_1 = rt.call(f, P("/proc/reverseRange"), null, [rt.callName(f, live(reversed_1), "Copy", [])]);
			entry_2 = null;
			rt.forList(f, 0, live(reversed_1));
			while (($e = rt.next(f, 0)) !== undefined) {
				entry_2 = $e;
				dat = rt.modify(live(dat), fmt("<font size=2px>＀: ＀</font><hr>", [live(entry_2), rt.index(live(reversed_1), live(entry_2))]), add);
			}
			rt.endFor(f, 0);
		}
	}
	rt.op(f, "Browse", [], [live(f.usr), live(dat), fmt("window=invidual_logging_＀;size=600x480", [live(M)])], false);
	return f.dot;
});
