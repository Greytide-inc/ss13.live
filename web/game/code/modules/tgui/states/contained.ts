// Based on /tg/station's code/modules/tgui/states/contained.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// contained.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalcontained_state", function InitGlobalcontained_state(f: Frame) {
	GLOB.contained_state = new_(T("/datum/ui_state/contained_state"));
	this.gvars_datum_init_order += "contained_state";
	return f.dot;
});

rt.type(4229, "/datum/ui_state/contained_state", "/datum/ui_state", {});

// contained.dm:10
rt.def("/datum/ui_state/contained_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (!src_object.contains(user)) {
		return UI_CLOSE;
	}
	return user.shared_ui_interaction(src_object);
});
