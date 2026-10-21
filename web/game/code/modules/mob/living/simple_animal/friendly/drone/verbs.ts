// From code/modules/mob/living/simple_animal/friendly/drone/verbs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/drone/verb/check_laws  (code/modules/mob/living/simple_animal/friendly/drone/verbs.dm:12)
rt.def("/mob/living/simple_animal/drone/verb/check_laws", function check_laws(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Drone Laws</b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "laws")]);
	return f.dot;
}, false, { verb: { name: "Check Laws", category: "Drone" } });

// /mob/living/simple_animal/drone/verb/toggle_light  (code/modules/mob/living/simple_animal/friendly/drone/verbs.dm:19)
rt.def("/mob/living/simple_animal/drone/verb/toggle_light", function toggle_light(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.sv(f, "light_on"))) {
		rt.callSrc(f, "set_light", [0]);
	} else {
		rt.callSrc(f, "set_light", [8]);
	}
	rt.setSv(f, "light_on", (!truthy(rt.sv(f, "light_on")) ? 1 : 0));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "light_on"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Your light is now ＀.</span>", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle drone light", category: "Drone" } });

// /mob/living/simple_animal/drone/verb/drone_ping  (code/modules/mob/living/simple_animal/friendly/drone/verbs.dm:31)  may sleep
rt.def("/mob/living/simple_animal/drone/verb/drone_ping", function* drone_ping(f: Frame) {
	let alert_s: Value = null, A: Value = null, msg: Value = null;
	f.vars = () => [alert_s, A, msg];
	alert_s = (yield* g.op(f, "Prompt", [1], [null, "Drone ping", "Alert severity level", live(f.src), rt.list("Low", "Medium", "High", "Critical")]));
	A = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")]));
	if (!((truthy(live(alert_s)) && truthy(live(A))) && !isEqual(rt.sv(f, "stat"), 2))) return f.dot;
	yield* g.srcCall(f, "alert_drones", (msg = fmt("<span class='boldnotice'>DRONE PING: ＀: ＀ priority alert in ＀!</span>", [rt.sv(f, "name"), live(alert_s), rt.fv(f, "name", live(A))])));
	return f.dot;
}, true, { verb: { name: "Drone ping", category: "Drone" } });

// /mob/living/simple_animal/drone/verb/toggle_statics  (code/modules/mob/living/simple_animal/friendly/drone/verbs.dm:45)  may sleep
rt.def("/mob/living/simple_animal/drone/verb/toggle_statics", function* toggle_statics(f: Frame) {
	let selectedStatic: Value = null;
	f.vars = () => [selectedStatic];
	if (!truthy(rt.sv(f, "seeStatic"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You have no vision filter to change!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, (selectedStatic = (yield* g.op(f, "Prompt", [1], [null, null, "Vision Filter", "Select a vision filter", rt.sv(f, "staticChoices")]))), rt.sv(f, "staticChoices")) ? 1 : 0))) {
		rt.setSv(f, "staticChoice", live(selectedStatic));
	}
	yield* g.srcCall(f, "updateSeeStaticMobs");
	return f.dot;
}, true, { verb: { name: "Change Vision Filter", category: "Drone", desc: "Change the filter on the system used to remove non drone beings from your viewscreen." } });
