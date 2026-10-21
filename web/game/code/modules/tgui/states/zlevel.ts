// From code/modules/tgui/states/zlevel.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalz_state  (code/modules/tgui/states/zlevel.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalz_state", function InitGlobalz_state(f: Frame) {
	rt.setGl("z_state", rt.new_(f, T("/datum/ui_state/z_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "z_state", add);
	return f.dot;
});

rt.type(4241, "/datum/ui_state/z_state", "/datum/ui_state", {});

// /datum/ui_state/z_state/proc/can_use_topic  (code/modules/tgui/states/zlevel.dm:10)
rt.def("/datum/ui_state/z_state/proc/can_use_topic", function can_use_topic(f: Frame, src_object: Value, user: Value) {
	let turf_obj: Value = null, turf_usr: Value = null;
	f.vars = () => [turf_obj, turf_usr];
	turf_obj = rt.getStep(f, live(src_object), 0);
	turf_usr = rt.getStep(f, live(user), 0);
	if (((truthy(live(turf_obj)) && truthy(live(turf_usr))) && isEqual(rt.fv(f, "z", live(turf_obj)), rt.fv(f, "z", live(turf_usr))))) {
		return 2;
	}
	return -1;
});
