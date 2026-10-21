// From code/game/objects/items/trash.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9801, "/obj/item/trash/coal", "/obj/item/trash", {
	name: "lump of coal",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "slag",
	desc: "Someone's gotten on the naughty list.",
});

// /obj/item/trash/coal/proc/burn  (code/game/objects/items/trash.dm:78)  may sleep
rt.def("/obj/item/trash/coal/proc/burn", function* burn(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("＀ fuses into a diamond! Someone wasn't so naughty after all...", [live(f.src)]));
	yield* g.new_(f, T("/obj/item/weapon/ore/diamond"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
