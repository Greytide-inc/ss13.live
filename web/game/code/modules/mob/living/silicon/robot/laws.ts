// From code/modules/mob/living/silicon/robot/laws.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/verb/cmd_show_laws  (code/modules/mob/living/silicon/robot/laws.dm:5)  may sleep
rt.def("/mob/living/silicon/robot/verb/cmd_show_laws", function* cmd_show_laws(f: Frame) {
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "show_laws");
	return f.dot;
}, true, { verb: { name: "Show Laws", category: "Robot Commands" } });

// /mob/living/silicon/robot/proc/show_laws  (code/modules/mob/living/silicon/robot/laws.dm:10)  may sleep
rt.def("/mob/living/silicon/robot/proc/show_laws", function* show_laws(f: Frame, everyone: Value) {
	let who: Value = null;
	f.vars = () => [everyone, who];
	if (live(everyone) === null) {
		everyone = 0;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	who = null;
	if (truthy(live(everyone))) {
		who = rt.world();
	} else {
		who = live(f.src);
	}
	if (truthy(rt.sv(f, "lawupdate"))) {
		if (truthy(rt.sv(f, "connected_ai"))) {
			if ((truthy(rt.fv(f, "stat", rt.sv(f, "connected_ai"))) || truthy(rt.fv(f, "control_disabled", rt.sv(f, "connected_ai"))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>AI signal lost, unable to sync laws.</b>"]);
			} else {
				yield* g.srcCall(f, "lawsync");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Laws synced with AI, be sure to note any changes.</b>"]);
				if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.src)])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Remember, your AI does NOT share or know about your law 0.</b>"]);
					if (truthy(rt.gv(f, "zeroth", rt.gv(f, "laws", rt.fv(f, "connected_ai", live(f.src)))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>While you are free to disregard it, your AI has a law 0 of its own.</b>"]);
					}
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>No AI selected to sync laws with, disabling lawsync protocol.</b>"]);
			rt.setSv(f, "lawupdate", 0);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(who), "<b>Obey these laws:</b>"]);
	yield* g.callName(f, rt.sv(f, "laws"), "show_laws", [live(who)]);
	if (truthy(rt.sv(f, "shell"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(who), "<b>Remember, you are an AI remotely controlling your shell, other AIs can be ignored.</b>"]);
	} else {
		if ((truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.src)]))) && truthy(rt.sv(f, "connected_ai")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(who), fmt("<b>Remember, ＀ is technically your master, but your objective comes first.</b>", [rt.fv(f, "name", rt.sv(f, "connected_ai"))])]);
		} else {
			if (truthy(rt.sv(f, "connected_ai"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(who), fmt("<b>Remember, ＀ is your master, other AIs can be ignored.</b>", [rt.fv(f, "name", rt.sv(f, "connected_ai"))])]);
			} else {
				if (truthy(rt.sv(f, "emagged"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(who), "<b>Remember, you are not required to listen to the AI.</b>"]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(who), "<b>Remember, you are not bound to any AI, you are not required to listen to them.</b>"]);
				}
			}
		}
	}
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/lawsync  (code/modules/mob/living/silicon/robot/laws.dm:48)  may sleep
rt.def("/mob/living/silicon/robot/proc/lawsync", function* lawsync(f: Frame) {
	let master: Value = null, temp: Value = null, index: Value = null;
	let $0: any;
	f.vars = () => [master, temp, index, $0];
	yield* g.srcCall(f, "laws_sanity_check");
	if (truthy(rt.sv(f, "connected_ai"))) {
		$0 = rt.fv(f, "laws", rt.sv(f, "connected_ai"));
	} else {
		$0 = null;
	}
	master = $0;
	temp = null;
	if (truthy(live(master))) {
		rt.setFv(f, "len", rt.fv(f, "ion", rt.sv(f, "laws")), rt.getLen(f, rt.fv(f, "ion", live(master))));
		index = null;
		index = 1;
		while (rt.le(live(index), rt.getLen(f, rt.fv(f, "ion", live(master))))) {
			if (rt.gt(rt.length((temp = rt.index(rt.fv(f, "ion", live(master)), live(index)))), 0)) {
				rt.setAt(rt.fv(f, "ion", rt.sv(f, "laws")), live(index), live(temp));
			}
			index = rt.inc(live(index), 1);
		}
		if (!truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.src)])))) {
			if (truthy(rt.fv(f, "zeroth_borg", live(master)))) {
				temp = rt.fv(f, "zeroth_borg", live(master));
			} else {
				temp = rt.fv(f, "zeroth", live(master));
			}
			rt.setFv(f, "zeroth", rt.sv(f, "laws"), live(temp));
		}
		rt.setFv(f, "len", rt.fv(f, "inherent", rt.sv(f, "laws")), rt.getLen(f, rt.fv(f, "inherent", live(master))));
		index = null;
		index = 1;
		while (rt.le(live(index), rt.getLen(f, rt.fv(f, "inherent", live(master))))) {
			if (rt.gt(rt.length((temp = rt.index(rt.fv(f, "inherent", live(master)), live(index)))), 0)) {
				rt.setAt(rt.fv(f, "inherent", rt.sv(f, "laws")), live(index), live(temp));
			}
			index = rt.inc(live(index), 1);
		}
		rt.setFv(f, "len", rt.fv(f, "supplied", rt.sv(f, "laws")), rt.getLen(f, rt.fv(f, "supplied", live(master))));
		index = null;
		index = 1;
		while (rt.le(live(index), rt.getLen(f, rt.fv(f, "supplied", live(master))))) {
			if (rt.gt(rt.length((temp = rt.index(rt.fv(f, "supplied", live(master)), live(index)))), 0)) {
				rt.setAt(rt.fv(f, "supplied", rt.sv(f, "laws")), live(index), live(temp));
			}
			index = rt.inc(live(index), 1);
		}
	}
	return live(f.dot);
}, true);
