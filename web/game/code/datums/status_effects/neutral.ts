// From code/datums/status_effects/neutral.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(940, "/datum/status_effect/sigil_mark", "/datum/status_effect", {
	stat_allowed: 2,
	id: "sigil_mark",
	duration: -1,
	alert_type: null,
});

// /datum/status_effect/sigil_mark/proc/tick  (code/datums/status_effects/neutral.dm:10)  may sleep
rt.def("/datum/status_effect/sigil_mark/proc/tick", function* tick(f: Frame) {
	if (!rt.lt(rt.fv(f, "stat", rt.sv(f, "owner")), rt.sv(f, "stat_allowed"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(942, "/datum/status_effect/syphon_mark", "/datum/status_effect", {
	reward_target: null,
	id: "syphon_mark",
	duration: 50,
	status_type: 0,
	on_remove_on_mob_delete: 1,
	alert_type: null,
});

// /datum/status_effect/syphon_mark/proc/on_creation  (code/datums/status_effects/neutral.dm:29)  may sleep
rt.def("/datum/status_effect/syphon_mark/proc/on_creation", function* on_creation(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "reward_target", live(f.args[1]));
	return f.dot;
}, true, { args: ["new_owner", "new_reward_target"] });

// /datum/status_effect/syphon_mark/proc/on_apply  (code/datums/status_effects/neutral.dm:34)
rt.def("/datum/status_effect/syphon_mark/proc/on_apply", function on_apply(f: Frame) {
	if (isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/status_effect/syphon_mark/proc/get_kill  (code/datums/status_effects/neutral.dm:39)
rt.def("/datum/status_effect/syphon_mark/proc/get_kill", function get_kill(f: Frame) {
	if (!truthy(rt.sv(f, "reward_target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "reward_target")))) return f.dot;
	rt.callName(f, rt.sv(f, "reward_target"), "get_kill", [rt.sv(f, "owner")]);
	return f.dot;
});

// /datum/status_effect/syphon_mark/proc/tick  (code/datums/status_effects/neutral.dm:43)  may sleep
rt.def("/datum/status_effect/syphon_mark/proc/tick", function* tick(f: Frame) {
	if (!isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2)) return f.dot;
	yield* g.srcCall(f, "get_kill");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/status_effect/syphon_mark/proc/on_remove  (code/datums/status_effects/neutral.dm:48)
rt.def("/datum/status_effect/syphon_mark/proc/on_remove", function on_remove(f: Frame) {
	rt.callSrc(f, "get_kill", []);
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
