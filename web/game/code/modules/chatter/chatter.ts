// Based on /tg/station's code/modules/chatter/chatter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// chatter.dm:11
rt.def("/proc/chatter", function chatter(f: Frame, message: Value, phomeme: Value, A: Value) {
	let item: Value = null, length: Value = null;
	let punctuation: Value = list(",", ":", ";", ".", "?", "!", "'", "-");
	let R: Value = regex("([\\l\\d]*)([^\\l\\d\\s])?", "g");
	let letter_count: Value = list();
	while (R.Find(message) != 0) {
		if (rt.index(R.group, 1)) {
			letter_count += rt.length(rt.index(R.group, 1));
		}
		if (rt.index(R.group, 2)) {
			letter_count += rt.index(R.group, 2);
		}
	}
	rt.spawnTail(f, 0, "/proc/chatter: spawn at modules/chatter/chatter.dm:19", message, phomeme, A, punctuation, R, letter_count, item, length);
	return f.dot;
});

// a spawn(0) body of /proc/chatter, a named tail so a world snapshot can hold it while it waits.
rt.tail("/proc/chatter: spawn at modules/chatter/chatter.dm:19", function* (f: Frame, message: Value, phomeme: Value, A: Value, punctuation: Value, R: Value, letter_count: Value, item: Value, length: Value) {
	item = null;
	for (item of each(letter_count)) {
		if (rt.isIn(f, item, punctuation)) {
			if (rt.isIn(f, item, list(",", ":"))) {
				yield* sleep(3);
			}
			if (rt.isIn(f, item, list("!", "?", "."))) {
				yield* sleep(6);
			}
			continue;
		}
		if (isnum(item)) {
			if ((length = min(item, 10)) == 0) {
				yield* sleep(1);
			}
			yield* chatter_speak_word(A.loc, phomeme, length);
		}
	}
	return null;
});

// chatter.dm:38
rt.def("/proc/chatter_speak_word", function* chatter_speak_word(f: Frame, loc: Value, phomeme: Value, length: Value) {
	let path: Value = `sound/chatter/${phomeme}_${length}.ogg`;
	yield* playsound(loc, path, { vol: 40, vary: 0, extrarange: 3, falloff: 0, surround: 1 });
	yield* sleep((length + 1) * chatter_get_sleep_multiplier(phomeme));
	return f.dot;
}, true);

// chatter.dm:48
rt.def("/proc/chatter_get_sleep_multiplier", function chatter_get_sleep_multiplier(f: Frame, phomeme: Value) {
	f.dot = 1;
	if (phomeme === "papyrus") {
		f.dot = 0.5;
	} else if (phomeme === "griffin") {
		f.dot = 0.5;
	} else if (phomeme === "sans") {
		f.dot = 0.7;
	} else if (phomeme === "owl") {
		f.dot = 0.7;
	}
	return f.dot;
});
