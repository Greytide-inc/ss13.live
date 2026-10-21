// From code/_globalvars/lists/typecache.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaltypecache_mob  (code/_globalvars/lists/typecache.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobaltypecache_mob", function InitGlobaltypecache_mob(f: Frame) {
	rt.setGl("typecache_mob", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/mob"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "typecache_mob", add);
	return f.dot;
});
