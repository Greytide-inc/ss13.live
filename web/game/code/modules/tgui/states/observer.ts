// From code/modules/tgui/states/observer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalobserver_state  (code/modules/tgui/states/observer.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalobserver_state", function InitGlobalobserver_state(f: Frame) {
	rt.setGl("observer_state", rt.new_(f, T("/datum/ui_state/observer_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "observer_state", add);
	return f.dot;
});

rt.type(4238, "/datum/ui_state/observer_state", "/datum/ui_state", {});

// /datum/ui_state/observer_state/proc/can_use_topic  (code/modules/tgui/states/observer.dm:10)
rt.def("/datum/ui_state/observer_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0))) {
		return 2;
	}
	return -1;
});
