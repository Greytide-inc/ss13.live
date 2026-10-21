// From code/modules/tgui/states/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalinventory_state  (code/modules/tgui/states/inventory.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalinventory_state", function InitGlobalinventory_state(f: Frame) {
	rt.setGl("inventory_state", rt.new_(f, T("/datum/ui_state/inventory_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "inventory_state", add);
	return f.dot;
});

rt.type(4234, "/datum/ui_state/inventory_state", "/datum/ui_state", {});

// /datum/ui_state/inventory_state/proc/can_use_topic  (code/modules/tgui/states/inventory.dm:10)
rt.def("/datum/ui_state/inventory_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (!truthy((rt.isIn(f, live(src_object), live(user)) ? 1 : 0))) {
		return -1;
	}
	return rt.callName(f, live(user), "shared_ui_interaction", [live(src_object)]);
});
