// Based on /tg/station's code/game/objects/effects/spawners/structure.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11887, "/obj/effect/spawner/structure", "/obj/effect/spawner", {
	spawn_list: null,
	name: "map structure spawner",
});

// structure.dm:12
rt.def("/obj/effect/spawner/structure/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	yield* parent_proc();
	if (this.spawn_list && rt.len(f, this.spawn_list)) {
		for (I of each(this.spawn_list)) {
			yield* new_(I, rt.getStep(f, this, 0));
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11888, "/obj/effect/spawner/structure/window", "/obj/effect/spawner/structure", {
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "window_spawner",
	name: "window spawner",
	spawn_list: null,
});

// structure.dm:22
rt.def("/obj/effect/spawner/structure/window/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawn_list = list(T("/obj/structure/grille"), T("/obj/structure/window/fulltile"));
	return f.dot;
});

rt.type(11889, "/obj/effect/spawner/structure/window/reinforced", "/obj/effect/spawner/structure/window", {
	name: "reinforced window spawner",
	icon_state: "rwindow_spawner",
	spawn_list: null,
});

// structure.dm:30
rt.def("/obj/effect/spawner/structure/window/reinforced/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawn_list = list(T("/obj/structure/grille"), T("/obj/structure/window/reinforced/fulltile"));
	return f.dot;
});
