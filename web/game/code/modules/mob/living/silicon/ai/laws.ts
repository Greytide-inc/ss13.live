// From code/modules/mob/living/silicon/ai/laws.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/show_laws_verb  (code/modules/mob/living/silicon/ai/laws.dm:5)  may sleep
rt.def("/mob/living/silicon/ai/proc/show_laws_verb", function* show_laws_verb(f: Frame) {
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "show_laws", []);
	return f.dot;
}, true, { verb: { name: "Show Laws", category: "AI Commands" } });

// /mob/living/silicon/ai/proc/show_laws  (code/modules/mob/living/silicon/ai/laws.dm:13)  may sleep
rt.def("/mob/living/silicon/ai/proc/show_laws", function* show_laws(f: Frame, everyone: Value) {
	let who: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [everyone, who, R, $e];
	if (live(everyone) === null) {
		everyone = 0;
	}
	who = null;
	if (truthy(live(everyone))) {
		who = rt.world();
	} else {
		who = live(f.src);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(who), "<b>Obey these laws:</b>"]);
	yield* g.callName(f, live(f.src), "laws_sanity_check", []);
	yield* g.callName(f, rt.fv(f, "laws", live(f.src)), "show_laws", [live(who)]);
	if (truthy(live(everyone))) return f.dot;
	R = null;
	rt.forList(f, 0, rt.sv(f, "connected_robots"), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy(rt.fv(f, "lawupdate", live(R)))) {
			yield* g.callName(f, live(R), "lawsync", []);
			yield* g.callName(f, live(R), "show_laws", []);
			rt.incField(f, live(R), "law_change_counter", 1, true);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
