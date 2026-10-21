// From code/__DEFINES/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalbloody_footprints_cache  (code/__DEFINES/misc.dm:199)
rt.def("/datum/controller/global_vars/proc/InitGlobalbloody_footprints_cache", function InitGlobalbloody_footprints_cache(f: Frame) {
	rt.setGl("bloody_footprints_cache", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "bloody_footprints_cache", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalghost_accs_options  (code/__DEFINES/misc.dm:272)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_accs_options", function InitGlobalghost_accs_options(f: Frame) {
	rt.setGl("ghost_accs_options", rt.list(1, 50, 100));
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_accs_options", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalghost_others_options  (code/__DEFINES/misc.dm:288)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_others_options", function InitGlobalghost_others_options(f: Frame) {
	rt.setGl("ghost_others_options", rt.list(1, 50, 100));
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_others_options", add);
	return f.dot;
});
