// Based on /tg/station's code/modules/mining/machine_unloading.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// machine_unloading.dm:15
rt.def("/obj/machinery/mineral/unloading_machine/proc/process", function* process(f: Frame) {
	let _T: Value = null, limit: Value = null, B: Value = null, O: Value = null, I: Value = null;
	if (!(_T = rt.getStep(f, this, this.input_dir))) return f.dot;
	for (B of each(_T, T("/obj/structure/ore_box"))) {
		O = null;
		for (O of each(B, T("/obj/item/weapon/ore"))) {
			B.contents -= O;
			yield* this.unload_mineral(O);
			limit++;
			if (limit >= 10) {
				return f.dot;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	for (I of each(_T, T("/obj/item"))) {
		yield* this.unload_mineral(I);
		limit++;
		if (limit >= 10) {
			return f.dot;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true, { waitfor: false });
