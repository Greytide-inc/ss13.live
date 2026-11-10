// Based on /tg/station's code/modules/tgui/states/deep_inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// deep_inventory.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobaldeep_inventory_state", function InitGlobaldeep_inventory_state(f: Frame) {
	GLOB.deep_inventory_state = new_(T("/datum/ui_state/deep_inventory_state"));
	this.gvars_datum_init_order += "deep_inventory_state";
	return f.dot;
});

rt.type(4230, "/datum/ui_state/deep_inventory_state", "/datum/ui_state", {});

// deep_inventory.dm:10
rt.def("/datum/ui_state/deep_inventory_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (!user.contains(src_object)) {
		return UI_CLOSE;
	}
	return user.shared_ui_interaction(src_object);
});
