// From code/__DEFINES/is_helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalpointed_types  (code/__DEFINES/is_helpers.dm:133)
rt.def("/datum/controller/global_vars/proc/InitGlobalpointed_types", function InitGlobalpointed_types(f: Frame) {
	rt.setGl("pointed_types", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/item/weapon/pen"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/kitchen/fork"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "pointed_types", add);
	return f.dot;
});
