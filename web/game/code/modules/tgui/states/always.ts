// Based on /tg/station's code/modules/tgui/states/always.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// always.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalalways_state", function InitGlobalalways_state(f: Frame) {
	GLOB.always_state = new_(T("/datum/ui_state/always_state"));
	this.gvars_datum_init_order += "always_state";
	return f.dot;
});
