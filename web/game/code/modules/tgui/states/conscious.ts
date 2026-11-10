// Based on /tg/station's code/modules/tgui/states/conscious.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// conscious.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalconscious_state", function InitGlobalconscious_state(f: Frame) {
	GLOB.conscious_state = new_(T("/datum/ui_state/conscious_state"));
	this.gvars_datum_init_order += "conscious_state";
	return f.dot;
});

rt.type(4228, "/datum/ui_state/conscious_state", "/datum/ui_state", {});

// conscious.dm:10
rt.def("/datum/ui_state/conscious_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (user.stat == 0) {
		return UI_INTERACTIVE;
	}
	return UI_CLOSE;
});
