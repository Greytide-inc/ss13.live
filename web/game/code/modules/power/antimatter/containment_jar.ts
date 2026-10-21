// From code/modules/power/antimatter/containment_jar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7641, "/obj/item/weapon/am_containment", "/obj/item/weapon", {
	fuel: 10000,
	fuel_max: 10000,
	stability: 100,
	anchored: 0,
	throw_speed: 1,
	throw_range: 2,
	name: "antimatter containment jar",
	desc: "Holds antimatter.",
	icon: rt.rsc("icons/obj/machines/antimatter.dmi"),
	icon_state: "jar",
	density: 0,
	force: 8,
	throwforce: 10,
});

// /obj/item/weapon/am_containment/proc/ex_act  (code/modules/power/antimatter/containment_jar.dm:19)  may sleep
rt.def("/obj/item/weapon/am_containment/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(f.src), 0), 1, 2, 3, 5]);
		if (truthy(live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [subtract(divide(rt.sv(f, "fuel"), 10), rt.sv(f, "stability"))]))) {
			yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(f.src), 0), 1, 2, 3, 5]);
			if (truthy(live(f.src))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
			return live(f.dot);
		}
		(rt.modSrcVar(f, "stability", 40, subtract));
	} else if ($0 === 3) {
		(rt.modSrcVar(f, "stability", 20, subtract));
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/item/weapon/am_containment/proc/usefuel  (code/modules/power/antimatter/containment_jar.dm:37)
rt.def("/obj/item/weapon/am_containment/proc/usefuel", function usefuel(f: Frame, wanted: Value) {
	f.vars = () => [wanted];
	if (rt.lt(rt.sv(f, "fuel"), live(wanted))) {
		wanted = rt.sv(f, "fuel");
	}
	(rt.modSrcVar(f, "fuel", live(wanted), subtract));
	return live(wanted);
});
