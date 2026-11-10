// Based on /tg/station's code/game/objects/weapons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5109, "/obj/item/weapon", "/obj/item", {
	name: "weapon",
	icon: rt.rsc("icons/obj/weapons.dmi"),
});

// weapons.dm:6
rt.def("/obj/item/weapon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.hitsound) return f.dot;
	if (this.damtype == "fire") {
		this.hitsound = rt.rsc("sound/items/welder.ogg");
	}
	if (this.damtype != "brute") return f.dot;
	this.hitsound = "swing_hit";
	return f.dot;
}, true);
