// From code/game/objects/items/taster.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9781, "/obj/item/taster", "/obj/item", {
	taste_sensitivity: 15,
	w_class: 1,
	name: "taster",
	desc: "Tastes things, so you don't have to!",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "tonguenormal",
});

// /obj/item/taster/proc/get_spans  (code/game/objects/items/taster.dm:12)
rt.def("/obj/item/taster/proc/get_spans", function get_spans(f: Frame) {
	return rt.list();
});

// /obj/item/taster/proc/afterattack  (code/game/objects/items/taster.dm:15)
rt.def("/obj/item/taster/proc/afterattack", function afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let message: Value = null;
	f.vars = () => [message];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "reagents", live(O)))) return f.dot;
	message = rt.callName(f, rt.fv(f, "reagents", live(O)), "generate_taste_message", [rt.sv(f, "taste_sensitivity")]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ tastes <span class='italics'>＀</span> in ＀.</span>", [live(f.src), live(message), live(O)])]);
	return f.dot;
});
