// Based on /tg/station's code/game/objects/items/taster.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9781, "/obj/item/taster", "/obj/item", {
	taste_sensitivity: 15,
	w_class: 1,
	name: "taster",
	desc: "Tastes things, so you don't have to!",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "tonguenormal",
});

// taster.dm:12
rt.def("/obj/item/taster/proc/get_spans", function get_spans(f: Frame) {
	return list();
});

// taster.dm:15
rt.def("/obj/item/taster/proc/afterattack", function afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (!O.reagents) return f.dot;
	let message: Value = O.reagents.generate_taste_message(this.taste_sensitivity);
	to_chat(user, `<span class='notice'>${this} tastes <span class='italics'>${message}</span> in ${O}.</span>`);
	return f.dot;
});
