// From code/modules/tgui/states/not_incapacitated.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalnot_incapacitated_state  (code/modules/tgui/states/not_incapacitated.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalnot_incapacitated_state", function InitGlobalnot_incapacitated_state(f: Frame) {
	rt.setGl("not_incapacitated_state", rt.new_(f, T("/datum/ui_state/not_incapacitated_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "not_incapacitated_state", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalnot_incapacitated_turf_state  (code/modules/tgui/states/not_incapacitated.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobalnot_incapacitated_turf_state", function InitGlobalnot_incapacitated_turf_state(f: Frame) {
	rt.setGl("not_incapacitated_turf_state", rt.new_(f, T("/datum/ui_state/not_incapacitated_state"), ["no_turfs", 1], rt.Args.Named));
	rt.modSrcVar(f, "gvars_datum_init_order", "not_incapacitated_turf_state", add);
	return f.dot;
});

rt.type(4236, "/datum/ui_state/not_incapacitated_state", "/datum/ui_state", {
	turf_check: 0,
});

// /datum/ui_state/not_incapacitated_state/proc/New  (code/modules/tgui/states/not_incapacitated.dm:21)
rt.def("/datum/ui_state/not_incapacitated_state/proc/New", function New(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "turf_check", live(f.args[1]));
	return f.dot;
}, false, { args: ["loc", "no_turfs"] });

// /datum/ui_state/not_incapacitated_state/proc/can_use_topic  (code/modules/tgui/states/not_incapacitated.dm:25)
rt.def("/datum/ui_state/not_incapacitated_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	if (truthy(rt.fv(f, "stat", live(user)))) {
		return -1;
	}
	if (((truthy(rt.callName(f, live(user), "incapacitated", [])) || truthy(rt.fv(f, "lying", live(user)))) || (truthy(rt.sv(f, "turf_check")) && !truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))]))))) {
		return 0;
	}
	return 2;
});
