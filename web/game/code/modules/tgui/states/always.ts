// From code/modules/tgui/states/always.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalalways_state  (code/modules/tgui/states/always.dm:8)
rt.def("/datum/controller/global_vars/proc/InitGlobalalways_state", function InitGlobalalways_state(f: Frame) {
	rt.setGl("always_state", rt.new_(f, T("/datum/ui_state/always_state"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "always_state", add);
	return f.dot;
});
