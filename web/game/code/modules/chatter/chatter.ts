// From code/modules/chatter/chatter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/chatter  (code/modules/chatter/chatter.dm:11)
rt.def("/proc/chatter", function chatter(f: Frame, message: Value, phomeme: Value, A: Value) {
	let punctuation: Value = null, R: Value = null, letter_count: Value = null, item: Value = null, length: Value = null;
	f.vars = () => [punctuation, R, letter_count, item, length];
	punctuation = rt.list(",", ":", ";", ".", "?", "!", "'", "-");
	R = rt.call(f, P("/proc/regex"), null, ["([\\l\\d]*)([^\\l\\d\\s])?", "g"]);
	letter_count = rt.list();
	while (!isEqual(rt.callName(f, live(R), "Find", [live(message)]), 0)) {
		if (truthy(rt.index(rt.fv(f, "group", live(R)), 1))) {
			letter_count = rt.modify(live(letter_count), rt.length(rt.index(rt.fv(f, "group", live(R)), 1)), add);
		}
		if (truthy(rt.index(rt.fv(f, "group", live(R)), 2))) {
			letter_count = rt.modify(live(letter_count), rt.index(rt.fv(f, "group", live(R)), 2), add);
		}
	}
	rt.spawnTail(f, 0, "/proc/chatter: spawn at modules/chatter/chatter.dm:19", message, phomeme, A, punctuation, R, letter_count, item, length);
	return f.dot;
});

// a spawn(0) body of /proc/chatter, a named tail so a world snapshot can hold it while it waits.
rt.tail("/proc/chatter: spawn at modules/chatter/chatter.dm:19", function* (f: Frame, message: Value, phomeme: Value, A: Value, punctuation: Value, R: Value, letter_count: Value, item: Value, length: Value) {
	let $e: any;
	f.vars = () => [message, phomeme, A, punctuation, R, letter_count, item, length, $e];
	item = null;
	rt.forList(f, 0, live(letter_count));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (truthy((rt.isIn(f, live(item), live(punctuation)) ? 1 : 0))) {
			if (truthy((rt.isIn(f, live(item), rt.list(",", ":")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/sleep"), null, [3]);
			}
			if (truthy((rt.isIn(f, live(item), rt.list("!", "?", ".")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/sleep"), null, [6]);
			}
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/isnum"), null, [live(item)])))) {
			if (isEqual((length = (yield* g.call(f, P("/proc/min"), null, [live(item), 10]))), 0)) {
				yield* g.call(f, P("/proc/sleep"), null, [1]);
			}
			yield* g.call(f, P("/proc/chatter_speak_word"), null, [rt.fv(f, "loc", live(A)), live(phomeme), live(length)]);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /proc/chatter_speak_word  (code/modules/chatter/chatter.dm:38)  may sleep
rt.def("/proc/chatter_speak_word", function* chatter_speak_word(f: Frame, loc: Value, phomeme: Value, length: Value) {
	let path: Value = null;
	f.vars = () => [loc, phomeme, length, path];
	path = fmt("sound/chatter/＀_＀.ogg", [live(phomeme), live(length)]);
	yield* g.call(f, P("/proc/playsound"), null, [null, live(loc), null, live(path), "vol", 40, "vary", 0, "extrarange", 3, "falloff", 0, "surround", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/sleep"), null, [multiply(add(live(length), 1), (yield* g.call(f, P("/proc/chatter_get_sleep_multiplier"), null, [live(phomeme)])))]);
	return f.dot;
}, true);

// /proc/chatter_get_sleep_multiplier  (code/modules/chatter/chatter.dm:48)
rt.def("/proc/chatter_get_sleep_multiplier", function chatter_get_sleep_multiplier(f: Frame, phomeme: Value) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = 1;
	$0 = live(phomeme);
	if ($0 === "papyrus") {
		f.dot = 0.5;
	} else if ($0 === "griffin") {
		f.dot = 0.5;
	} else if ($0 === "sans") {
		f.dot = 0.699999988079071;
	} else if ($0 === "owl") {
		f.dot = 0.699999988079071;
	}
	return f.dot;
});
