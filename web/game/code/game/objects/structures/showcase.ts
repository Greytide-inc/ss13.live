// Based on /tg/station's code/game/objects/structures/showcase.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12871, "/obj/structure/showcase/fakeid", "/obj/structure/showcase", {
	name: "１Centcom identification console",
	desc: "You can use this to change ID's.",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
});

// showcase.dm:21
rt.def("/obj/structure/showcase/fakeid/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.add_overlay("id");
	this.add_overlay("id_key");
	return f.dot;
});

rt.type(12872, "/obj/structure/showcase/fakesec", "/obj/structure/showcase", {
	name: "１Centcom security records",
	desc: "Used to view and edit personnel's security records",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
});

// showcase.dm:32
rt.def("/obj/structure/showcase/fakesec/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.add_overlay("security");
	this.add_overlay("security_key");
	return f.dot;
});

rt.type(12870, "/obj/structure/showcase", "/obj/structure", {
	deconstruction_state: 1,
	anchored: 1,
	name: "showcase",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "showcase_1",
	desc: "A stand with the empty body of a cyborg bolted to it.",
	density: 1,
});

// showcase.dm:54
rt.def("/obj/structure/showcase/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && !this.anchored) {
		if (this.deconstruction_state == SHOWCASE_SCREWDRIVERED) {
			to_chat(user, "<span class='notice'>You screw the screws back into the showcase.</span>");
			playsound(this.loc, W.usesound, 100, 1);
			this.deconstruction_state = SHOWCASE_CONSTRUCTED;
		} else if (this.deconstruction_state == SHOWCASE_CONSTRUCTED) {
			to_chat(user, "<span class='notice'>You unscrew the screws.</span>");
			playsound(this.loc, W.usesound, 100, 1);
			this.deconstruction_state = SHOWCASE_SCREWDRIVERED;
		}
	}
	if (rt.istype(W, T("/obj/item/weapon/crowbar")) && this.deconstruction_state == SHOWCASE_SCREWDRIVERED) {
		if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You start to crowbar the showcase apart...</span>");
			yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this, 0), 4);
			yield* qdel(this);
		}
	}
	if (!(this.deconstruction_state == SHOWCASE_CONSTRUCTED && (yield* this.default_unfasten_wrench(user, W)))) return f.dot;
	return f.dot;
}, true);

// showcase.dm:77
rt.def("/obj/structure/showcase/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.deconstruction_state === SHOWCASE_CONSTRUCTED) {
		to_chat(user, "The showcase is fully constructed.");
	} else if (this.deconstruction_state === SHOWCASE_SCREWDRIVERED) {
		to_chat(user, "The showcase has its screws loosened.");
	} else {
		to_chat(user, "If you see this, something is wrong.");
	}
	return f.dot;
}, false);
