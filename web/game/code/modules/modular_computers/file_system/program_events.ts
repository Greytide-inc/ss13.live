// Based on /tg/station's code/modules/modular_computers/file_system/program_events.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


// program_events.dm:10
rt.def("/datum/computer_file/program/proc/event_powerfailure", function event_powerfailure(f: Frame, background: Value) {
	this.kill_program({ forced: 1 });
	return f.dot;
});

// program_events.dm:14
rt.def("/datum/computer_file/program/proc/event_networkfailure", function event_networkfailure(f: Frame, background: Value) {
	this.kill_program({ forced: 1 });
	if (background) {
		this.computer.visible_message(fmt("<span class='danger'>＄！'s screen displays an \"Process ＀.＀ (PID ＀) terminated - Network Error\" error</span>", [this.computer, this.filename, this.filetype, rand(100, 999)]));
	} else {
		this.computer.visible_message(fmt("<span class='danger'>＄！'s screen briefly freezes and then shows \"NETWORK ERROR - NTNet connection lost. Please retry. If problem persists contact your system administrator.\" error.</span>", [this.computer]));
	}
	return f.dot;
});
