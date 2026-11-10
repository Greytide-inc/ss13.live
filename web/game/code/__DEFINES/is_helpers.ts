// Based on /tg/station's code/__DEFINES/is_helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// is_helpers.dm:133
rt.def("/datum/controller/global_vars/proc/InitGlobalpointed_types", function InitGlobalpointed_types(f: Frame) {
	GLOB.pointed_types = typecacheof(list(T("/obj/item/weapon/pen"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/kitchen/fork")));
	this.gvars_datum_init_order += "pointed_types";
	return f.dot;
});
