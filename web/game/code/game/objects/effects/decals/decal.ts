// From code/game/objects/effects/decals/decal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11697, "/obj/effect/decal", "/obj/effect", {
	anchored: 1,
	name: "decal",
	resistance_flags: 50,
});

// /obj/effect/decal/proc/ex_act  (code/game/objects/effects/decals/decal.dm:7)  may sleep
rt.def("/obj/effect/decal/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/decal/proc/fire_act  (code/game/objects/effects/decals/decal.dm:10)  may sleep
rt.def("/obj/effect/decal/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 2))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/decal/proc/HandleTurfChange  (code/game/objects/effects/decals/decal.dm:14)  may sleep
rt.def("/obj/effect/decal/proc/HandleTurfChange", function* HandleTurfChange(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(live(f.args[0]), rt.sv(f, "loc")) && ((((truthy((rt.istype(live(f.args[0]), T("/turf/open/space")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/turf/closed")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/turf/open/floor/plating/lava")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/turf/open/water")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/turf/open/chasm")) ? 1 : 0))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["T"] });

rt.type(11902, "/obj/effect/turf_decal", "/obj/effect", {
	group: "paint",
	anchored: 1,
	icon: rt.rsc("icons/turf/decals.dmi"),
	icon_state: "warningline",
});

// /obj/effect/turf_decal/proc/get_decal  (code/game/objects/effects/decals/decal.dm:26)
rt.def("/obj/effect/turf_decal/proc/get_decal", function get_decal(f: Frame) {
	return rt.call(f, P("/proc/image"), null, ["icon", rt.rsc("icons/turf/decals.dmi"), "icon_state", rt.sv(f, "icon_state"), "dir", rt.sv(f, "dir"), "layer", 2], rt.Args.Named);
});

// /obj/effect/turf_decal/proc/Initialize  (code/game/objects/effects/decals/decal.dm:29)
rt.def("/obj/effect/turf_decal/proc/Initialize", function Initialize(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype((_T = rt.sv(f, "loc")), T("/turf")) ? 1 : 0))) {
		rt.call(f, P("/proc/CRASH"), null, ["Turf decal initialized in an object/nullspace"]);
	}
	rt.callName(f, live(_T), "add_decal", [rt.callSrc(f, "get_decal", []), rt.sv(f, "group")]);
	return 2;
});
