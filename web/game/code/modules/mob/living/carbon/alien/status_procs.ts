// From code/modules/mob/living/carbon/alien/status_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/Stun  (code/modules/mob/living/carbon/alien/status_procs.dm:8)  may sleep
rt.def("/mob/living/carbon/alien/proc/Stun", function* Stun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "move_delay_add", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "move_delay_add"), (yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[0]), 2)]))), 10])));
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/carbon/alien/proc/SetStun  (code/modules/mob/living/carbon/alien/status_procs.dm:13)  may sleep
rt.def("/mob/living/carbon/alien/proc/SetStun", function* SetStun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "move_delay_add", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "move_delay_add"), (yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[0]), 2)]))), 10])));
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/carbon/alien/proc/AdjustStun  (code/modules/mob/living/carbon/alien/status_procs.dm:18)  may sleep
rt.def("/mob/living/carbon/alien/proc/AdjustStun", function* AdjustStun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "move_delay_add", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "move_delay_add"), (yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[0]), 2)]))), 10]))])));
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });
