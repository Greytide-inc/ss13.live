// From code/modules/mob/living/simple_animal/friendly/drone/say.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/drone/proc/handle_inherent_channels  (code/modules/mob/living/simple_animal/friendly/drone/say.dm:7)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame) {
	if (isEqual(live(f.args[1]), "binary")) {
		yield* g.srcCall(f, "drone_chat", live(f.args[0]));
		return 1;
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["message", "message_mode"] });

// /mob/living/simple_animal/drone/proc/get_spans  (code/modules/mob/living/simple_animal/friendly/drone/say.dm:15)
rt.def("/mob/living/simple_animal/drone/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /proc/_alert_drones  (code/modules/mob/living/simple_animal/friendly/drone/say.dm:21)
rt.def("/proc/_alert_drones", function _alert_drones(f: Frame, msg: Value, dead_can_hear: Value, faction_checked_mob: Value, exact_faction_match: Value) {
	let W: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [dead_can_hear, W, M, link, $e];
	if (live(dead_can_hear) === null) {
		dead_can_hear = 0;
	}
	W = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if ((truthy((rt.istype((M = live(W)), T("/mob/living/simple_animal/drone")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(M)), 2))) {
			if (truthy(live(faction_checked_mob))) {
				if (truthy(rt.callName(f, live(M), "faction_check_mob", [live(faction_checked_mob), live(exact_faction_match)]))) {
					rt.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
				}
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(M), live(msg)]);
			}
		}
		if ((truthy(live(dead_can_hear)) && truthy((rt.isIn(f, live(M), rt.gl("dead_mob_list")) ? 1 : 0)))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(faction_checked_mob)]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(msg)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/alert_drones  (code/modules/mob/living/simple_animal/friendly/drone/say.dm:36)
rt.def("/mob/living/simple_animal/drone/proc/alert_drones", function alert_drones(f: Frame, msg: Value, dead_can_hear: Value) {
	f.vars = () => [dead_can_hear];
	if (live(dead_can_hear) === null) {
		dead_can_hear = 0;
	}
	rt.call(f, P("/proc/_alert_drones"), null, [live(msg), live(dead_can_hear), live(f.src), 1]);
	return f.dot;
});

// /mob/living/simple_animal/drone/proc/drone_chat  (code/modules/mob/living/simple_animal/friendly/drone/say.dm:40)
rt.def("/mob/living/simple_animal/drone/proc/drone_chat", function drone_chat(f: Frame, msg: Value) {
	rt.callSrc(f, "alert_drones", [fmt("<i>Drone Chat: <span class='name'>＀</span> <span class='message'>＀</span></i>", [rt.sv(f, "name"), rt.callSrc(f, "say_quote", [live(msg), rt.callSrc(f, "get_spans", [])])]), 1]);
	return f.dot;
});
