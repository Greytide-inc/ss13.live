// From code/modules/events/wizard/aid.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(334, "/datum/round_event/wizard/robelesscasting", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/robelesscasting/proc/start  (code/modules/events/wizard/aid.dm:12)
rt.def("/datum/round_event/wizard/robelesscasting/proc/start", function start(f: Frame) {
	let L: Value = null, spell_improved: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [L, spell_improved, S, $e];
	L = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.fv(f, "mind", live(L))) && !isEqual(rt.getLen(f, rt.gv(f, "spell_list", rt.fv(f, "mind", live(L)))), 0))) {
			spell_improved = 0;
			S = null;
			rt.forList(f, 1, rt.gv(f, "spell_list", rt.fv(f, "mind", live(L))), T("/obj/effect/proc_holder/spell"));
			while (($e = rt.next(f, 1)) !== undefined) {
				S = $e;
				if (truthy(rt.fv(f, "clothes_req", live(S)))) {
					rt.setFv(f, "clothes_req", live(S), 0);
					spell_improved = 1;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(spell_improved))) {
				rt.call(f, P("/proc/to_chat"), null, [live(L), "<span class='notice'>You suddenly feel like you never needed those garish robes in the first place...</span>"]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(335, "/datum/round_event/wizard/improvedcasting", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/improvedcasting/proc/start  (code/modules/events/wizard/aid.dm:32)
rt.def("/datum/round_event/wizard/improvedcasting/proc/start", function start(f: Frame) {
	let L: Value = null, S: Value = null;
	let $0: any, $e: any;
	f.vars = () => [L, S, $0, $e];
	L = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.fv(f, "mind", live(L))) && !isEqual(rt.getLen(f, rt.gv(f, "spell_list", rt.fv(f, "mind", live(L)))), 0))) {
			S = null;
			rt.forList(f, 1, rt.gv(f, "spell_list", rt.fv(f, "mind", live(L))), T("/obj/effect/proc_holder/spell"));
			while (($e = rt.next(f, 1)) !== undefined) {
				S = $e;
				rt.setFv(f, "name", live(S), rt.initial(f, live(S), "name"));
				rt.incField(f, live(S), "spell_level", 1, true);
				if ((rt.ge(rt.fv(f, "spell_level", live(S)), 6) || rt.le(rt.fv(f, "charge_max", live(S)), 0))) {
					continue;
				}
				if (rt.le(rt.fv(f, "level_max", live(S)), 0)) {
					continue;
				}
				rt.setFv(f, "charge_max", live(S), rt.call(f, P("/proc/round"), null, [subtract(rt.initial(f, live(S), "charge_max"), divide(multiply(rt.fv(f, "spell_level", live(S)), subtract(rt.initial(f, live(S), "charge_max"), rt.fv(f, "cooldown_min", live(S)))), rt.fv(f, "level_max", live(S))))]));
				if (rt.lt(rt.fv(f, "charge_max", live(S)), rt.fv(f, "charge_counter", live(S)))) {
					rt.setFv(f, "charge_counter", live(S), rt.fv(f, "charge_max", live(S)));
				}
				$0 = rt.fv(f, "spell_level", live(S));
				if ($0 === 1) {
					rt.setFv(f, "name", live(S), fmt("Efficient ＀", [rt.fv(f, "name", live(S))]));
				} else if ($0 === 2) {
					rt.setFv(f, "name", live(S), fmt("Quickened ＀", [rt.fv(f, "name", live(S))]));
				} else if ($0 === 3) {
					rt.setFv(f, "name", live(S), fmt("Free ＀", [rt.fv(f, "name", live(S))]));
				} else if ($0 === 4) {
					rt.setFv(f, "name", live(S), fmt("Instant ＀", [rt.fv(f, "name", live(S))]));
				} else if ($0 === 5) {
					rt.setFv(f, "name", live(S), fmt("Ludicrous ＀", [rt.fv(f, "name", live(S))]));
				}
			}
			rt.endFor(f, 1);
			rt.call(f, P("/proc/to_chat"), null, [live(L), "<span class='notice'>You suddenly feel more competent with your casting!</span>"]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
