// From code/modules/emoji/emoji_parse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/emoji_parse  (code/modules/emoji/emoji_parse.dm:2)
rt.def("/proc/emoji_parse", function emoji_parse(f: Frame, text: Value) {
	let parsed: Value = null, pos: Value = null, search: Value = null, emoji: Value = null;
	f.vars = () => [parsed, pos, search, emoji];
	f.dot = live(text);
	if (!truthy(rt.fv(f, "emojis", rt.gl("config")))) {
		return live(f.dot);
	}
	parsed = "";
	pos = 1;
	search = 0;
	emoji = "";
	blk62: {
		while (true) {
			search = rt.call(f, P("/proc/findtext"), null, [live(text), ":", live(pos)]);
			parsed = rt.modify(live(parsed), rt.call(f, P("/proc/copytext"), null, [live(text), live(pos), live(search)]), add);
			if (!truthy(live(search))) break blk62;
			pos = live(search);
			if (!truthy((search = rt.call(f, P("/proc/findtext"), null, [live(text), ":", add(live(pos), 1)])))) break;
			if (truthy((rt.isIn(f, (emoji = rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/copytext"), null, [live(text), add(live(pos), 1), live(search)])])), rt.gl("emojis")) ? 1 : 0))) {
				parsed = rt.modify(live(parsed), rt.call(f, P("/proc/bicon"), null, [rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/emoji.dmi"), live(emoji)])]), add);
				pos = add(live(search), 1);
			} else {
				parsed = rt.modify(live(parsed), rt.call(f, P("/proc/copytext"), null, [live(text), live(pos), live(search)]), add);
				pos = live(search);
			}
			emoji = "";
		}
		parsed = rt.modify(live(parsed), rt.call(f, P("/proc/copytext"), null, [live(text), live(pos), live(search)]), add);
	}
	return live(parsed);
});
