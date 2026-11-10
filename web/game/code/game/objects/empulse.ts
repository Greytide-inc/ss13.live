// Based on /tg/station's code/game/objects/empulse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// empulse.dm:2
rt.def("/proc/empulse", function* empulse(f: Frame, epicenter: Value, heavy_range: Value, light_range: Value, log: Value) {
	let A: Value = null, _T: Value = null, distance: Value = null;
	log ??= 0;
	if (!epicenter) {
		return f.dot;
	}
	if (!isturf(epicenter)) {
		epicenter = rt.getStep(f, epicenter.loc, 0);
	}
	if (log) {
		message_admins(`EMP with size (${heavy_range}, ${light_range}) in area ${epicenter.loc.name} `);
		log_game(`EMP with size (${heavy_range}, ${light_range}) in area ${epicenter.loc.name} `);
	}
	if (heavy_range > 1) {
		yield* new_(T("/obj/effect/temp_visual/emp/pulse"), epicenter);
	}
	if (heavy_range > light_range) {
		light_range = heavy_range;
	}
	for (A of each(spiral_range(light_range, epicenter))) {
		_T = A;
		if ((distance = get_dist(epicenter, _T)) < 0) {
			distance = 0;
		}
		if (distance < heavy_range) {
			yield* _T.emp_act(1);
		} else if (distance == heavy_range) {
			if (prob(50)) {
				yield* _T.emp_act(1);
			} else {
				yield* _T.emp_act(2);
			}
		} else if (distance <= light_range) {
			yield* _T.emp_act(2);
		}
	}
	return 1;
}, true);
