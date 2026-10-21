// From code/game/objects/effects/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11892, "/obj/effect/list_container/mobl", "/obj/effect/list_container", {
	master: null,
	container: null,
	name: "mobl",
});

// /obj/effect/list_container/mobl/proc/<init>  (code/game/objects/effects/misc.dm:25)
rt.def("/obj/effect/list_container/mobl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "container", rt.list());
	return f.dot;
});

rt.type(11802, "/obj/effect/abstract/marker", "/obj/effect/abstract", {
	anchored: 1,
	name: "marker",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "wave3",
	layer: 5.1,
});

// /obj/effect/abstract/marker/proc/Initialize  (code/game/objects/effects/misc.dm:43)
rt.def("/obj/effect/abstract/marker/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.modGl("all_abstract_markers", live(f.src), add);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/effect/abstract/marker/proc/Destroy  (code/game/objects/effects/misc.dm:47)  may sleep
rt.def("/obj/effect/abstract/marker/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_abstract_markers", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
