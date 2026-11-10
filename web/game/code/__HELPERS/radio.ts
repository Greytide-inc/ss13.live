// Based on /tg/station's code/__HELPERS/radio.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// radio.dm:3
rt.def("/proc/sanitize_frequency", function sanitize_frequency(f: Frame, frequency: Value, free: Value) {
	free ??= 0;
	f.dot = round(frequency);
	if (free) {
		f.dot = max(1201, min(frequency, 1599));
	} else {
		f.dot = max(1441, min(frequency, MAX_FREQ));
	}
	if (f.dot % 2) return f.dot;
	f.dot += 1;
	return f.dot;
});

// radio.dm:13
rt.def("/proc/format_frequency", function format_frequency(f: Frame, frequency: Value) {
	return `${round((frequency = text2num(frequency)) / 10)}.${frequency % 10}`;
});
