// From code/modules/tgui/states/admin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaladmin_state  (code/modules/tgui/states/admin.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_state", function InitGlobaladmin_state(f: Frame) {
	rt.setGl("admin_state", rt.new_(f, T("/datum/ui_state/admin_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_state", add);
	return f.dot;
});

rt.type(4226, "/datum/ui_state/admin_state", "/datum/ui_state", {});

// /datum/ui_state/admin_state/proc/can_use_topic  (code/modules/tgui/states/admin.dm:10)
rt.def("/datum/ui_state/admin_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (truthy(rt.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]))) {
		return 2;
	}
	return -1;
});
