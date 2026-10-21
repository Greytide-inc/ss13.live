// From code/modules/ninja/suit/suit_verbs_handlers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/grant_equip_verbs  (code/modules/ninja/suit/suit_verbs_handlers.dm:12)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/grant_equip_verbs", function grant_equip_verbs(f: Frame) {
	rt.modField(f, rt.sv(f, "n_gloves"), "verbs", P("/obj/item/clothing/gloves/space_ninja/proc/toggledrain"), add);
	rt.setSv(f, "s_initialized", 1);
	return f.dot;
});

// /obj/item/clothing/suit/space/space_ninja/proc/remove_equip_verbs  (code/modules/ninja/suit/suit_verbs_handlers.dm:19)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/remove_equip_verbs", function remove_equip_verbs(f: Frame) {
	if (truthy(rt.sv(f, "n_gloves"))) {
		(rt.modField(f, rt.sv(f, "n_gloves"), "verbs", P("/obj/item/clothing/gloves/space_ninja/proc/toggledrain"), subtract));
	}
	rt.setSv(f, "s_initialized", 0);
	return f.dot;
});
