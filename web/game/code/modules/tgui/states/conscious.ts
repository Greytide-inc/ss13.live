// From code/modules/tgui/states/conscious.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalconscious_state  (code/modules/tgui/states/conscious.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalconscious_state", function InitGlobalconscious_state(f: Frame) {
	rt.setGl("conscious_state", rt.new_(f, T("/datum/ui_state/conscious_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "conscious_state", add);
	return f.dot;
});

rt.type(4228, "/datum/ui_state/conscious_state", "/datum/ui_state", {});

// /datum/ui_state/conscious_state/proc/can_use_topic  (code/modules/tgui/states/conscious.dm:10)
rt.def("/datum/ui_state/conscious_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (isEqual(rt.fv(f, "stat", live(user)), 0)) {
		return 2;
	}
	return -1;
});
