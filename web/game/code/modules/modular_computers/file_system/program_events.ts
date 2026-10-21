// From code/modules/modular_computers/file_system/program_events.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/computer_file/program/proc/event_powerfailure  (code/modules/modular_computers/file_system/program_events.dm:10)
rt.def("/datum/computer_file/program/proc/event_powerfailure", function event_powerfailure(f: Frame, background: Value) {
	rt.callSrc(f, "kill_program", ["forced", 1], rt.Args.Named);
	return f.dot;
});

// /datum/computer_file/program/proc/event_networkfailure  (code/modules/modular_computers/file_system/program_events.dm:14)
rt.def("/datum/computer_file/program/proc/event_networkfailure", function event_networkfailure(f: Frame, background: Value) {
	rt.callSrc(f, "kill_program", ["forced", 1], rt.Args.Named);
	if (truthy(live(background))) {
		rt.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='danger'>＄！'s screen displays an \"Process ＀.＀ (PID ＀) terminated - Network Error\" error</span>", [rt.sv(f, "computer"), rt.sv(f, "filename"), rt.sv(f, "filetype"), rt.call(f, P("/proc/rand"), null, [100, 999])])]);
	} else {
		rt.callName(f, rt.sv(f, "computer"), "visible_message", [fmt("<span class='danger'>＄！'s screen briefly freezes and then shows \"NETWORK ERROR - NTNet connection lost. Please retry. If problem persists contact your system administrator.\" error.</span>", [rt.sv(f, "computer")])]);
	}
	return f.dot;
});
