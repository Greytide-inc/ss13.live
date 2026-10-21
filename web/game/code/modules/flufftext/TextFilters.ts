// From code/modules/flufftext/TextFilters.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/Ellipsis  (code/modules/flufftext/TextFilters.dm:44)
rt.def("/proc/Ellipsis", function Ellipsis(f: Frame, original_msg: Value, chance: Value, keep_words: Value) {
	let words: Value = null, new_words: Value = null, new_msg: Value = null, w: Value = null;
	let $e: any;
	f.vars = () => [chance, words, new_words, new_msg, w, $e];
	if (live(chance) === null) {
		chance = 50;
	}
	if (rt.le(live(chance), 0)) {
		return "...";
	}
	if (rt.ge(live(chance), 100)) {
		return live(original_msg);
	}
	words = rt.call(f, P("/proc/splittext"), null, [live(original_msg), " "]);
	new_words = rt.list();
	new_msg = "";
	w = null;
	rt.forList(f, 0, live(words));
	while (($e = rt.next(f, 0)) !== undefined) {
		w = $e;
		if (truthy(rt.op(f, "Prob", [], [live(chance)]))) {
			new_words = rt.modify(live(new_words), "...", add);
			if (!truthy(live(keep_words))) {
				continue;
			}
		}
		new_words = rt.modify(live(new_words), live(w), add);
	}
	rt.endFor(f, 0);
	return (new_msg = rt.call(f, P("/proc/jointext"), null, [live(new_words), " "]));
});
