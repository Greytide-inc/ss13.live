// From code/modules/mining/machine_unloading.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10935, "/obj/machinery/mineral/unloading_machine", "/obj/machinery/mineral", {
	anchored: 1,
	input_dir: 8,
	output_dir: 4,
	speed_process: 1,
	name: "unloading machine",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "unloader",
	density: 1,
});

// /obj/machinery/mineral/unloading_machine/proc/process  (code/modules/mining/machine_unloading.dm:15)  may sleep
rt.def("/obj/machinery/mineral/unloading_machine/proc/process", function* process(f: Frame) {
	let _T: Value = null, limit: Value = null, B: Value = null, O: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [_T, limit, B, O, I, $e];
	if (!truthy((_T = rt.getStep(f, live(f.src), rt.sv(f, "input_dir"))))) return f.dot;
	limit = null;
	B = null;
	rt.forList(f, 0, live(_T), T("/obj/structure/ore_box"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		O = null;
		rt.forList(f, 1, live(B), T("/obj/item/weapon/ore"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			(rt.modField(f, live(B), "contents", live(O), subtract));
			yield* g.srcCall(f, "unload_mineral", live(O));
			limit = rt.inc(live(limit), 1);
			if (rt.ge(live(limit), 10)) {
				return live(f.dot);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 1);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, live(_T), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "unload_mineral", live(I));
		limit = rt.inc(live(limit), 1);
		if (rt.ge(live(limit), 10)) {
			return live(f.dot);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });
