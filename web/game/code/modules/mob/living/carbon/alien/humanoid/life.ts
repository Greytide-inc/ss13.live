// From code/modules/mob/living/carbon/alien/humanoid/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/humanoid/proc/adjust_body_temperature  (code/modules/mob/living/carbon/alien/humanoid/life.dm:4)
rt.def("/mob/living/carbon/alien/humanoid/proc/adjust_body_temperature", function adjust_body_temperature(f: Frame, current: Value, loc_temp: Value, boost: Value) {
	let temperature: Value = null, difference: Value = null, increments: Value = null, change: Value = null, temp_change: Value = null;
	f.vars = () => [temperature, difference, increments, change, temp_change];
	temperature = live(current);
	difference = rt.op(f, "Abs", [], [subtract(live(current), live(loc_temp))]);
	increments = null;
	if (rt.gt(live(difference), 50)) {
		increments = divide(live(difference), 5);
	} else {
		increments = divide(live(difference), 10);
	}
	change = multiply(live(increments), live(boost));
	temp_change = null;
	if (rt.lt(live(current), live(loc_temp))) {
		temperature = rt.call(f, P("/proc/min"), null, [live(loc_temp), add(live(temperature), live(change))]);
	} else {
		if (rt.gt(live(current), live(loc_temp))) {
			temperature = rt.call(f, P("/proc/max"), null, [live(loc_temp), subtract(live(temperature), live(change))]);
		}
	}
	return (temp_change = subtract(live(temperature), live(current)));
});
