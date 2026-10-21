// From code/modules/tgui/states/human_adjacent.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhuman_adjacent_state  (code/modules/tgui/states/human_adjacent.dm:9)
rt.def("/datum/controller/global_vars/proc/InitGlobalhuman_adjacent_state", function InitGlobalhuman_adjacent_state(f: Frame) {
	rt.setGl("human_adjacent_state", rt.new_(f, T("/datum/ui_state/human_adjacent_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "human_adjacent_state", add);
	return f.dot;
});

rt.type(4233, "/datum/ui_state/human_adjacent_state", "/datum/ui_state", {});

// /datum/ui_state/human_adjacent_state/proc/can_use_topic  (code/modules/tgui/states/human_adjacent.dm:12)
rt.def("/datum/ui_state/human_adjacent_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	let dist: Value = null;
	f.vars = () => [dist];
	f.dot = rt.callName(f, live(user), "default_can_use_topic", [live(src_object)]);
	if (!(rt.gt((dist = rt.call(f, P("/proc/get_dist"), null, [live(src_object), live(user)])), 1) || !truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	f.dot = rt.call(f, P("/proc/min"), null, [live(f.dot), 1]);
	return f.dot;
});
