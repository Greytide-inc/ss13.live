// Based on /tg/station's code/_globalvars/lists/poll_ignore.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// poll_ignore.dm:10
rt.def("/datum/controller/global_vars/proc/InitGlobalpoll_ignore", function InitGlobalpoll_ignore(f: Frame) {
	GLOB.poll_ignore = list();
	this.gvars_datum_init_order += "poll_ignore";
	return f.dot;
});
