// From code/modules/tgui/states/hands.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhands_state  (code/modules/tgui/states/hands.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalhands_state", function InitGlobalhands_state(f: Frame) {
	rt.setGl("hands_state", rt.new_(f, T("/datum/ui_state/hands_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "hands_state", add);
	return f.dot;
});

rt.type(4232, "/datum/ui_state/hands_state", "/datum/ui_state", {});

// /datum/ui_state/hands_state/proc/can_use_topic  (code/modules/tgui/states/hands.dm:10)
rt.def("/datum/ui_state/hands_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	f.dot = rt.callName(f, live(user), "shared_ui_interaction", [live(src_object)]);
	if (!rt.gt(live(f.dot), -1)) return f.dot;
	return rt.call(f, P("/proc/min"), null, [live(f.dot), rt.callName(f, live(user), "hands_can_use_topic", [live(src_object)])]);
});

// /mob/living/proc/hands_can_use_topic  (code/modules/tgui/states/hands.dm:18)
rt.def("/mob/living/proc/hands_can_use_topic", function hands_can_use_topic(f: Frame, src_object: Value) {
	if (truthy(rt.callSrc(f, "is_holding", [live(src_object)]))) {
		return 2;
	}
	return -1;
});

// /mob/living/silicon/robot/proc/hands_can_use_topic  (code/modules/tgui/states/hands.dm:23)
rt.def("/mob/living/silicon/robot/proc/hands_can_use_topic", function hands_can_use_topic(f: Frame, src_object: Value) {
	if (truthy(rt.callSrc(f, "activated", [live(src_object)]))) {
		return 2;
	}
	return -1;
});
