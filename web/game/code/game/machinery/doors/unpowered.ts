// From code/game/machinery/doors/unpowered.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10298, "/obj/machinery/door/unpowered", "/obj/machinery/door", {});

// /obj/machinery/door/unpowered/proc/Bumped  (code/game/machinery/doors/unpowered.dm:4)  may sleep
rt.def("/obj/machinery/door/unpowered/proc/Bumped", function* Bumped(f: Frame) {
	if (truthy(rt.fv(f, "locked", live(f.src)))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true, { args: ["AM"] });

// /obj/machinery/door/unpowered/proc/attackby  (code/game/machinery/doors/unpowered.dm:12)  may sleep
rt.def("/obj/machinery/door/unpowered/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
