// Based on /tg/station's code/modules/flufftext/TextFilters.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// TextFilters.dm:44
rt.def("/proc/Ellipsis", function Ellipsis(f: Frame, original_msg: Value, chance: Value, keep_words: Value) {
	let w: Value = null;
	chance ??= 50;
	if (chance <= 0) {
		return "...";
	}
	if (chance >= 100) {
		return original_msg;
	}
	let words: Value = splittext(original_msg, " ");
	let new_words: Value = list();
	let new_msg: Value = "";
	for (w of each(words)) {
		if (prob(chance)) {
			new_words += "...";
			if (!keep_words) {
				continue;
			}
		}
		new_words += w;
	}
	return (new_msg = jointext(new_words, " "));
});
