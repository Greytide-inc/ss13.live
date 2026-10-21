// From code/__HELPERS/radio.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/sanitize_frequency  (code/__HELPERS/radio.dm:3)
rt.def("/proc/sanitize_frequency", function sanitize_frequency(f: Frame, frequency: Value, free: Value) {
	f.vars = () => [free];
	if (live(free) === null) {
		free = 0;
	}
	f.dot = rt.call(f, P("/proc/round"), null, [live(frequency)]);
	if (truthy(live(free))) {
		f.dot = rt.call(f, P("/proc/max"), null, [1201, rt.call(f, P("/proc/min"), null, [live(frequency), 1599])]);
	} else {
		f.dot = rt.call(f, P("/proc/max"), null, [1441, rt.call(f, P("/proc/min"), null, [live(frequency), 1489])]);
	}
	if (truthy(rt.modulus(live(f.dot), 2))) return f.dot;
	f.dot = rt.modify(live(f.dot), 1, add);
	return f.dot;
});

// /proc/format_frequency  (code/__HELPERS/radio.dm:13)
rt.def("/proc/format_frequency", function format_frequency(f: Frame, frequency: Value) {
	f.vars = () => [frequency];
	return fmt("＀.＀", [rt.call(f, P("/proc/round"), null, [divide((frequency = rt.call(f, P("/proc/text2num"), null, [live(frequency)])), 10)]), rt.modulus(live(frequency), 10)]);
});
