// Based on /tg/station's code/game/objects/items/trash.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9801, "/obj/item/trash/coal", "/obj/item/trash", {
	name: "lump of coal",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "slag",
	desc: "Someone's gotten on the naughty list.",
});

// trash.dm:78
rt.def("/obj/item/trash/coal/proc/burn", function* burn(f: Frame) {
	this.visible_message(`${this} fuses into a diamond! Someone wasn't so naughty after all...`);
	yield* new_(T("/obj/item/weapon/ore/diamond"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);
