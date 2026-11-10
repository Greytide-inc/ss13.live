// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// say.dm:7
rt.def("/mob/living/simple_animal/drone/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	if (message_mode == "binary") {
		this.drone_chat(message);
		return 1;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// say.dm:15
rt.def("/mob/living/simple_animal/drone/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// say.dm:21
rt.def("/proc/_alert_drones", function _alert_drones(f: Frame, msg: Value, dead_can_hear: Value, faction_checked_mob: Value, exact_faction_match: Value) {
	let W: Value = null, M: Value = null, link: Value = null;
	dead_can_hear ??= 0;
	for (W of each(GLOB.mob_list)) {
		if (rt.istype((M = W), T("/mob/living/simple_animal/drone")) && M.stat != 2) {
			if (faction_checked_mob) {
				if (M.faction_check_mob(faction_checked_mob, exact_faction_match)) {
					to_chat(M, msg);
				}
			} else {
				to_chat(M, msg);
			}
		}
		if (dead_can_hear && rt.isIn(f, M, GLOB.dead_mob_list)) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, faction_checked_mob]);
			to_chat(M, `${link} ${msg}`);
		}
	}
	return f.dot;
});

// say.dm:36
rt.def("/mob/living/simple_animal/drone/proc/alert_drones", function alert_drones(f: Frame, msg: Value, dead_can_hear: Value) {
	dead_can_hear ??= 0;
	_alert_drones(msg, dead_can_hear, this, 1);
	return f.dot;
});

// say.dm:40
rt.def("/mob/living/simple_animal/drone/proc/drone_chat", function drone_chat(f: Frame, msg: Value) {
	this.alert_drones(`<i>Drone Chat: <span class='name'>${this.name}</span> <span class='message'>${this.say_quote(msg, this.get_spans())}</span></i>`, 1);
	return f.dot;
});
