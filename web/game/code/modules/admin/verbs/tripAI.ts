// From code/modules/admin/verbs/tripAI.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/triple_ai  (code/modules/admin/verbs/tripAI.dm:5)  may sleep
rt.def("/client/proc/triple_ai", function* triple_ai(f: Frame) {
	let job: Value = null;
	f.vars = () => [job];
	if (rt.gt(rt.fv(f, "current_state", rt.gl("SSticker")), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This option is currently only usable during pregame. This may change at a later date."]);
		return live(f.dot);
	}
	if (!truthy((job = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", ["AI"]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Unable to locate the AI job"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "triai", rt.gl("SSticker")))) {
		rt.setFv(f, "triai", rt.gl("SSticker"), 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Only one AI will be spawned at round start."]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has toggled off triple AIs at round start.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	} else {
		rt.setFv(f, "triai", rt.gl("SSticker"), 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "There will be an AI Triumvirate at round start."]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has toggled on triple AIs at round start.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	}
	return f.dot;
}, true, { verb: { name: "Create AI Triumvirate", category: "Fun" } });
