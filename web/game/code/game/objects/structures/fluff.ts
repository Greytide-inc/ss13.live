// Based on /tg/station's code/game/objects/structures/fluff.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12752, "/obj/structure/fluff", "/obj/structure", {
	deconstructible: 1,
	anchored: 1,
	name: "fluff structure",
	desc: "Fluffier than a sheep. This shouldn't exist.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "minibar",
	density: 0,
	opacity: 0,
});

// fluff.dm:14
rt.def("/obj/structure/fluff/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/wrench")) && this.deconstructible) {
		user.visible_message(`<span class='notice'>${user} starts disassembling ${this}...</span>`, `<span class='notice'>You start disassembling ${this}...</span>`);
		playsound(user, I.usesound, 50, 1);
		if (!(yield* do_after(user, 50, { target: this }))) {
			return 0;
		}
		user.visible_message(`<span class='notice'>${user} disassembles ${this}!</span>`, `<span class='notice'>You break down ${this} into scrap metal.</span>`);
		playsound(user, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this, 0));
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12765, "/obj/structure/fluff/bus/passable/seat/driver", "/obj/structure/fluff/bus/passable/seat", {
	name: "driver's seat",
	desc: "Space Jesus is my copilot.",
	icon_state: "driverseat",
});

// fluff.dm:108
rt.def("/obj/structure/fluff/bus/passable/seat/driver/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/items/carhorn.ogg"), 50, 1);
	return f.dot;
});
