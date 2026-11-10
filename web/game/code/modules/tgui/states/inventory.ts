// Based on /tg/station's code/modules/tgui/states/inventory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// inventory.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalinventory_state", function InitGlobalinventory_state(f: Frame) {
	GLOB.inventory_state = new_(T("/datum/ui_state/inventory_state"));
	this.gvars_datum_init_order += "inventory_state";
	return f.dot;
});

rt.type(4234, "/datum/ui_state/inventory_state", "/datum/ui_state", {});

// inventory.dm:10
rt.def("/datum/ui_state/inventory_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (!rt.isIn(f, src_object, user)) {
		return UI_CLOSE;
	}
	return user.shared_ui_interaction(src_object);
});
