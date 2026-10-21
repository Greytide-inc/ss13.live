// From code/modules/tgui/states/default.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaldefault_state  (code/modules/tgui/states/default.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobaldefault_state", function InitGlobaldefault_state(f: Frame) {
	rt.setGl("default_state", rt.new_(f, T("/datum/ui_state/default"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "default_state", add);
	return f.dot;
});

rt.type(4231, "/datum/ui_state/default", "/datum/ui_state", {});

// /datum/ui_state/default/proc/can_use_topic  (code/modules/tgui/states/default.dm:10)
rt.def("/datum/ui_state/default/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	return rt.callName(f, live(user), "default_can_use_topic", [live(src_object)]);
});

// /mob/living/proc/default_can_use_topic  (code/modules/tgui/states/default.dm:16)
rt.def("/mob/living/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = rt.callSrc(f, "shared_ui_interaction", [live(src_object)]);
	if ((rt.gt(live(f.dot), -1) && truthy(rt.sv(f, "loc")))) {
		f.dot = rt.call(f, P("/proc/min"), null, [live(f.dot), rt.callName(f, rt.sv(f, "loc"), "contents_ui_distance", [live(src_object), live(f.src)])]);
	}
	if (!isEqual(live(f.dot), 2)) return f.dot;
	return 1;
});

// /mob/living/carbon/human/proc/default_can_use_topic  (code/modules/tgui/states/default.dm:23)
rt.def("/mob/living/carbon/human/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = rt.callSrc(f, "shared_ui_interaction", [live(src_object)]);
	if (!rt.gt(live(f.dot), -1)) return f.dot;
	f.dot = rt.call(f, P("/proc/min"), null, [live(f.dot), rt.callSrc(f, "shared_living_ui_distance", [live(src_object)])]);
	if (!truthy(rt.op(f, "Prob", [], [rt.callSrc(f, "getBrainLoss", [])]))) return f.dot;
	return 1;
});

// /mob/living/silicon/robot/proc/default_can_use_topic  (code/modules/tgui/states/default.dm:31)
rt.def("/mob/living/silicon/robot/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	let clientviewlist: Value = null;
	f.vars = () => [clientviewlist];
	f.dot = rt.callSrc(f, "shared_ui_interaction", [live(src_object)]);
	if (rt.le(live(f.dot), 0)) {
		return live(f.dot);
	}
	clientviewlist = rt.call(f, P("/proc/getviewsize"), null, [rt.fv(f, "view", rt.sv(f, "client"))]);
	if (rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(src_object)]), subtract(multiply(rt.call(f, P("/proc/min"), null, [rt.index(live(clientviewlist), 1), rt.index(live(clientviewlist), 2)]), 0.5), 0.5))) {
		return 2;
	}
	return 0;
});

// /mob/living/silicon/ai/proc/default_can_use_topic  (code/modules/tgui/states/default.dm:42)
rt.def("/mob/living/silicon/ai/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	let viewscale: Value = null;
	f.vars = () => [viewscale];
	f.dot = rt.callSrc(f, "shared_ui_interaction", [live(src_object)]);
	if (rt.lt(live(f.dot), 2)) {
		return live(f.dot);
	}
	viewscale = rt.call(f, P("/proc/getviewsize"), null, [rt.fv(f, "view", rt.sv(f, "client"))]);
	if ((rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(src_object)]), subtract(multiply(rt.call(f, P("/proc/max"), null, [rt.index(live(viewscale), 1), rt.index(live(viewscale), 2)]), 0.5), 0.5)) || truthy(rt.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.call(f, P("/proc/get_turf_pixel"), null, [live(src_object)])])))) {
		return 2;
	}
	return -1;
});

// /mob/living/simple_animal/proc/default_can_use_topic  (code/modules/tgui/states/default.dm:53)
rt.def("/mob/living/simple_animal/proc/default_can_use_topic", function default_can_use_topic(f: Frame, src_object: Value) {
	f.dot = rt.callSrc(f, "shared_ui_interaction", [live(src_object)]);
	if (!rt.gt(live(f.dot), -1)) return f.dot;
	f.dot = rt.call(f, P("/proc/min"), null, [live(f.dot), rt.callSrc(f, "shared_living_ui_distance", [live(src_object)])]);
	return f.dot;
});

// /mob/living/silicon/pai/proc/default_can_use_topic  (code/modules/tgui/states/default.dm:59)
rt.def("/mob/living/silicon/pai/proc/default_can_use_topic", function default_can_use_topic(f: Frame) {
	if (((isEqual(live(f.args[0]), live(f.src)) || isEqual(live(f.args[0]), rt.sv(f, "radio"))) && !truthy(rt.sv(f, "stat")))) {
		return 2;
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["src_object"] });
