// Based on /tg/station's code/game/objects/effects/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11892, "/obj/effect/list_container/mobl", "/obj/effect/list_container", {
	master: null,
	container: null,
	name: "mobl",
});

// misc.dm:25
rt.def("/obj/effect/list_container/mobl/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.container = list();
	return f.dot;
});

rt.type(11802, "/obj/effect/abstract/marker", "/obj/effect/abstract", {
	anchored: 1,
	name: "marker",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "wave3",
	layer: 5.1,
});

// misc.dm:43
rt.def("/obj/effect/abstract/marker/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	GLOB.all_abstract_markers += this;
	return f.dot;
}, false);

// misc.dm:47
rt.def("/obj/effect/abstract/marker/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_abstract_markers -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
