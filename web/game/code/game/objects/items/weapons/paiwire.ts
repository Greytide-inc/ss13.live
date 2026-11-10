// Based on /tg/station's code/game/objects/items/weapons/paiwire.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7322, "/obj/item/weapon/pai_cable", "/obj/item/weapon", {
	machine: null,
	flags: 4,
	desc: "A flexible coated cable with a universal jack on one end.",
	name: "data cable",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "wire1",
});

// paiwire.dm:10
rt.def("/obj/item/weapon/pai_cable/proc/plugin", function* plugin(f: Frame, M: Value, user: Value) {
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	user.visible_message(`${user} inserts ${this} into a data port on ${M}.`, `<span class='notice'>You insert ${this} into a data port on ${M}.</span>`, "<span class='italics'>You hear the satisfying click of a wire jack fastening into place.</span>");
	this.loc = M;
	this.machine = M;
	return f.dot;
}, true);
