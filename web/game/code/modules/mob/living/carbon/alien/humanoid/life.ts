// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// life.dm:4
rt.def("/mob/living/carbon/alien/humanoid/proc/adjust_body_temperature", function adjust_body_temperature(f: Frame, current: Value, loc_temp: Value, boost: Value) {
	let increments: Value = null, temp_change: Value = null;
	let temperature: Value = current;
	let difference: Value = rt.op(f, "Abs", [], [current - loc_temp]);
	if (difference > 50) {
		increments = difference / 5;
	} else {
		increments = difference / 10;
	}
	let change: Value = increments * boost;
	if (current < loc_temp) {
		temperature = min(loc_temp, temperature + change);
	} else if (current > loc_temp) {
		temperature = max(loc_temp, temperature - change);
	}
	return (temp_change = temperature - current);
});
