// Based on /tg/station's code/_globalvars/lists/medals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// medals.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalcommendations", function InitGlobalcommendations(f: Frame) {
	GLOB.commendations = list();
	this.gvars_datum_init_order += "commendations";
	return f.dot;
});
