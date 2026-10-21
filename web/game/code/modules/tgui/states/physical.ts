// From code/modules/tgui/states/physical.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalphysical_state  (code/modules/tgui/states/physical.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalphysical_state", function InitGlobalphysical_state(f: Frame) {
	rt.setGl("physical_state", rt.new_(f, T("/datum/ui_state/physical"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "physical_state", add);
	return f.dot;
});

rt.type(4239, "/datum/ui_state/physical", "/datum/ui_state", {});

// /datum/ui_state/physical/proc/can_use_topic  (code/modules/tgui/states/physical.dm:10)
rt.def("/datum/ui_state/physical/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	f.dot = rt.callName(f, live(user), "shared_ui_interaction", [live(src_object)]);
	if (!rt.gt(live(f.dot), -1)) return f.dot;
	return rt.call(f, P("/proc/min"), null, [live(f.dot), rt.callName(f, live(user), "physical_can_use_topic", [live(src_object)])]);
});

// /mob/living/proc/physical_can_use_topic  (code/modules/tgui/states/physical.dm:18)
rt.def("/mob/living/proc/physical_can_use_topic", function physical_can_use_topic(f: Frame, src_object: Value) {
	return rt.callSrc(f, "shared_living_ui_distance", [live(src_object)]);
});

// /mob/living/silicon/proc/physical_can_use_topic  (code/modules/tgui/states/physical.dm:21)
rt.def("/mob/living/silicon/proc/physical_can_use_topic", function physical_can_use_topic(f: Frame, src_object: Value) {
	return rt.call(f, P("/proc/max"), null, [1, rt.callSrc(f, "shared_living_ui_distance", [live(src_object)])]);
});
