// Based on /tg/station's code/modules/tgui/states/self.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// self.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalself_state", function InitGlobalself_state(f: Frame) {
	GLOB.self_state = new_(T("/datum/ui_state/self_state"));
	this.gvars_datum_init_order += "self_state";
	return f.dot;
});

rt.type(4240, "/datum/ui_state/self_state", "/datum/ui_state", {});

// self.dm:10
rt.def("/datum/ui_state/self_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (src_object != user) {
		return UI_CLOSE;
	}
	return user.shared_ui_interaction(src_object);
});
