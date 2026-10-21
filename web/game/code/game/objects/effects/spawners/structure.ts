// From code/game/objects/effects/spawners/structure.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11887, "/obj/effect/spawner/structure", "/obj/effect/spawner", {
	spawn_list: null,
	name: "map structure spawner",
});

// /obj/effect/spawner/structure/proc/Initialize  (code/game/objects/effects/spawners/structure.dm:12)  may sleep
rt.def("/obj/effect/spawner/structure/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "spawn_list")) && truthy(rt.len(f, rt.sv(f, "spawn_list"))))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "spawn_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.new_(f, live(I), [rt.getStep(f, live(f.src), 0)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11888, "/obj/effect/spawner/structure/window", "/obj/effect/spawner/structure", {
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "window_spawner",
	name: "window spawner",
	spawn_list: null,
});

// /obj/effect/spawner/structure/window/proc/<init>  (code/game/objects/effects/spawners/structure.dm:22)
rt.def("/obj/effect/spawner/structure/window/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawn_list", rt.list(T("/obj/structure/grille"), T("/obj/structure/window/fulltile")));
	return f.dot;
});

rt.type(11889, "/obj/effect/spawner/structure/window/reinforced", "/obj/effect/spawner/structure/window", {
	name: "reinforced window spawner",
	icon_state: "rwindow_spawner",
	spawn_list: null,
});

// /obj/effect/spawner/structure/window/reinforced/proc/<init>  (code/game/objects/effects/spawners/structure.dm:30)
rt.def("/obj/effect/spawner/structure/window/reinforced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spawn_list", rt.list(T("/obj/structure/grille"), T("/obj/structure/window/reinforced/fulltile")));
	return f.dot;
});
