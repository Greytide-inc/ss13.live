// From code/modules/client/verbs/etips.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/toggle_tips  (code/modules/client/verbs/etips.dm:6)
rt.def("/client/verb/toggle_tips", function toggle_tips(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setFv(f, "enable_tips", rt.sv(f, "prefs"), (!truthy(rt.fv(f, "enable_tips", rt.sv(f, "prefs"))) ? 1 : 0));
	rt.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	$0 = live(f.usr);
	if (truthy(rt.fv(f, "enable_tips", rt.sv(f, "prefs")))) {
		$1 = "en";
	} else {
		$1 = "dis";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='danger'>Examine tooltips ＀abled.</span>", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle examine tooltips", category: "Preferences", desc: "Toggles examine hover-over tooltips" } });

// /client/verb/change_tip_delay  (code/modules/client/verbs/etips.dm:15)  may sleep
rt.def("/client/verb/change_tip_delay", function* change_tip_delay(f: Frame) {
	let indelay: Value = null;
	f.vars = () => [indelay];
	indelay = (yield* g.call(f, P("/proc/text2num"), null, [(indelay = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter the tooltip delay in milliseconds (default: 500)", "Enter tooltip delay", "", 10])))]));
	if (!truthy(live(f.usr))) return f.dot;
	rt.setFv(f, "tip_delay", rt.sv(f, "prefs"), live(indelay));
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>Tooltip delay set to ＀ milliseconds.</span>", [live(indelay)])]);
	return f.dot;
}, true, { verb: { name: "Set examine tooltip delay", category: "Preferences", desc: "Sets the delay in milliseconds before examine tooltips appear" } });
