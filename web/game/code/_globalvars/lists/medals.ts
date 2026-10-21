// From code/_globalvars/lists/medals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalcommendations  (code/_globalvars/lists/medals.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalcommendations", function InitGlobalcommendations(f: Frame) {
	rt.setGl("commendations", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "commendations", add);
	return f.dot;
});
