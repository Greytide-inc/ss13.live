// Based on /tg/station's code/modules/ninja/suit/suit_verbs_handlers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// suit_verbs_handlers.dm:12
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/grant_equip_verbs", function grant_equip_verbs(f: Frame) {
	this.n_gloves.verbs += P("/obj/item/clothing/gloves/space_ninja/proc/toggledrain");
	this.s_initialized = 1;
	return f.dot;
});

// suit_verbs_handlers.dm:19
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/remove_equip_verbs", function remove_equip_verbs(f: Frame) {
	if (this.n_gloves) {
		this.n_gloves.verbs -= P("/obj/item/clothing/gloves/space_ninja/proc/toggledrain");
	}
	this.s_initialized = 0;
	return f.dot;
});
