// Based on /tg/station's code/modules/mob/living/carbon/alien/status_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// status_procs.dm:8
rt.def("/mob/living/carbon/alien/proc/Stun", function* Stun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	this.move_delay_add = min(this.move_delay_add + round(f.args[0] / 2), 10);
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// status_procs.dm:13
rt.def("/mob/living/carbon/alien/proc/SetStun", function* SetStun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	this.move_delay_add = min(this.move_delay_add + round(f.args[0] / 2), 10);
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// status_procs.dm:18
rt.def("/mob/living/carbon/alien/proc/AdjustStun", function* AdjustStun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (f.dot) return f.dot;
	this.move_delay_add = max(0, min(this.move_delay_add + round(f.args[0] / 2), 10));
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });
