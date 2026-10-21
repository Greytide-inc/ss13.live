// From code/_globalvars/lists/poll_ignore.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalpoll_ignore  (code/_globalvars/lists/poll_ignore.dm:10)
rt.def("/datum/controller/global_vars/proc/InitGlobalpoll_ignore", function InitGlobalpoll_ignore(f: Frame) {
	rt.setGl("poll_ignore", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "poll_ignore", add);
	return f.dot;
});
