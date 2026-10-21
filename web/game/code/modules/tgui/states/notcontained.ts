// From code/modules/tgui/states/notcontained.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalnotcontained_state  (code/modules/tgui/states/notcontained.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalnotcontained_state", function InitGlobalnotcontained_state(f: Frame) {
	rt.setGl("notcontained_state", rt.new_(f, T("/datum/ui_state/notcontained_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "notcontained_state", add);
	return f.dot;
});

rt.type(4237, "/datum/ui_state/notcontained_state", "/datum/ui_state", {});

// /datum/ui_state/notcontained_state/proc/can_use_topic  (code/modules/tgui/states/notcontained.dm:10)
rt.def("/datum/ui_state/notcontained_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	f.dot = rt.callName(f, live(user), "shared_ui_interaction", [live(src_object)]);
	if (!rt.gt(live(f.dot), -1)) return f.dot;
	return rt.call(f, P("/proc/min"), null, [live(f.dot), rt.callName(f, live(user), "notcontained_can_use_topic", [live(src_object)])]);
});

// /mob/living/proc/notcontained_can_use_topic  (code/modules/tgui/states/notcontained.dm:18)
rt.def("/mob/living/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	if (truthy(rt.callName(f, live(src_object), "contains", [live(f.src)]))) {
		return -1;
	}
	return rt.callSrc(f, "default_can_use_topic", [live(src_object)]);
});

// /mob/living/silicon/proc/notcontained_can_use_topic  (code/modules/tgui/states/notcontained.dm:23)
rt.def("/mob/living/silicon/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	return rt.callSrc(f, "default_can_use_topic", [live(src_object)]);
});

// /mob/living/simple_animal/drone/proc/notcontained_can_use_topic  (code/modules/tgui/states/notcontained.dm:26)
rt.def("/mob/living/simple_animal/drone/proc/notcontained_can_use_topic", function notcontained_can_use_topic(f: Frame, src_object: Value) {
	return rt.callSrc(f, "default_can_use_topic", [live(src_object)]);
});
