// Based on /tg/station's code/modules/emoji/emoji_parse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// emoji_parse.dm:2
rt.def("/proc/emoji_parse", function emoji_parse(f: Frame, text: Value) {
	f.dot = text;
	if (!GLOB.config.emojis) {
		return f.dot;
	}
	let parsed: Value = "";
	let pos: Value = 1;
	let search: Value = 0;
	let emoji: Value = "";
	blk62: {
		while (true) {
			search = findtext(text, ":", pos);
			parsed += copytext(text, pos, search);
			if (!search) break blk62;
			pos = search;
			if (!(search = findtext(text, ":", pos + 1))) break;
			if (rt.isIn(f, (emoji = lowertext(copytext(text, pos + 1, search))), GLOB.emojis)) {
				parsed += bicon(icon(rt.rsc("icons/emoji.dmi"), emoji));
				pos = search + 1;
			} else {
				parsed += copytext(text, pos, search);
				pos = search;
			}
			emoji = "";
		}
		parsed += copytext(text, pos, search);
	}
	return parsed;
});
