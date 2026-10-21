// From code/modules/mining/lavaland/ruins/gym.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12962, "/obj/structure/punching_bag", "/obj/structure", {
	hit_sounds: null,
	anchored: 1,
	name: "punching bag",
	desc: "A punching bag. Can you get to speed level 4???",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "punchingbag",
	layer: 4.25,
});

// /obj/structure/punching_bag/proc/attack_hand  (code/modules/mining/lavaland/ruins/gym.dm:12)
rt.def("/obj/structure/punching_bag/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	rt.call(f, P("/proc/flick"), null, [fmt("＀-punch", [rt.sv(f, "icon_state")]), live(f.src)]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.op(f, "PickUnweighted", [1], [rt.fv(f, "hit_sounds", live(f.src))]), 25, 1, -1]);
	return f.dot;
});

rt.type(12963, "/obj/structure/stacklifter", "/obj/structure", {
	anchored: 1,
	name: "chest press machine",
	desc: "Just looking at this thing makes you feel tired.",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "stacklifter",
	density: 1,
});

// /obj/structure/stacklifter/proc/attack_hand  (code/modules/mining/lavaland/ruins/gym.dm:25)  may sleep
rt.def("/obj/structure/stacklifter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let press_overlay: Value = null, bragmessage: Value = null, lifts: Value = null, finishmessage: Value = null;
	let $t: any;
	f.vars = () => [user, press_overlay, bragmessage, lifts, finishmessage, $t];
	if (truthy(rt.sv(f, "in_use"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "It's already in use - wait a bit."]);
		return live(f.dot);
	} else {
		rt.setSv(f, "in_use", 1);
		rt.setSv(f, "icon_state", "stacklifter-u");
		yield* g.srcCall(f, "add_overlay", (press_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "stacklifter-o", 4.1]))));
		yield* g.callName(f, live(user), "setDir", [2]);
		yield* g.callName(f, live(user), "Stun", [80]);
		rt.setFv(f, "loc", live(user), rt.fv(f, "loc", live(f.src)));
		bragmessage = rt.op(f, "PickUnweighted", [6], ["pushing it to the limit", "going into overdrive", "burning with determination", "rising up to the challenge", "getting strong now", "getting ripped"]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<B>＀ is ＀!</B>", [live(user), live(bragmessage)])]);
		lifts = 0;
		while (rt.lt(($t = live(lifts), lifts = rt.inc($t, 1), $t), 6)) {
			if (!isEqual(rt.fv(f, "loc", live(user)), rt.fv(f, "loc", live(f.src)))) {
				break;
			}
			yield* g.call(f, P("/proc/sleep"), null, [3]);
			rt.op(f, "Animate", [2, 6], [null, live(user), "pixel_y", -2, "time", 3]);
			yield* g.call(f, P("/proc/sleep"), null, [3]);
			rt.op(f, "Animate", [2, 6], [null, live(user), "pixel_y", -4, "time", 3]);
			yield* g.call(f, P("/proc/sleep"), null, [3]);
			yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/creak.ogg"), 60, 1]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/click.ogg"), 60, 1]);
		rt.setSv(f, "in_use", 0);
		rt.setFv(f, "pixel_y", live(user), 0);
		finishmessage = rt.op(f, "PickUnweighted", [4], ["You feel stronger!", "You feel like you can take on the world!", "You feel robust!", "You feel indestructible!"]);
		rt.setSv(f, "icon_state", "stacklifter");
		yield* g.srcCall(f, "cut_overlay", live(press_overlay));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), live(finishmessage)]);
	}
	return f.dot;
}, true);

rt.type(12964, "/obj/structure/weightlifter", "/obj/structure", {
	anchored: 1,
	name: "inline bench press",
	desc: "Just looking at this thing makes you feel tired.",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "benchpress",
	density: 1,
});

// /obj/structure/weightlifter/proc/attack_hand  (code/modules/mining/lavaland/ruins/gym.dm:63)  may sleep
rt.def("/obj/structure/weightlifter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let swole_overlay: Value = null, bragmessage: Value = null, reps: Value = null, innerReps: Value = null, finishmessage: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $t: any;
	f.vars = () => [user, swole_overlay, bragmessage, reps, innerReps, finishmessage, $0, $1, $2, $3, $t];
	if (truthy(rt.sv(f, "in_use"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "It's already in use - wait a bit."]);
		return live(f.dot);
	} else {
		rt.setSv(f, "in_use", 1);
		rt.setSv(f, "icon_state", "benchpress-u");
		yield* g.callName(f, live(user), "setDir", [2]);
		yield* g.callName(f, live(user), "Stun", [80]);
		rt.setFv(f, "loc", live(user), rt.fv(f, "loc", live(f.src)));
		yield* g.srcCall(f, "add_overlay", (swole_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "benchpress-o", 4.1]))));
		bragmessage = rt.op(f, "PickUnweighted", [6], ["pushing it to the limit", "going into overdrive", "burning with determination", "rising up to the challenge", "getting strong now", "getting ripped"]);
		yield* g.callName(f, live(user), "visible_message", [fmt("<B>＀ is ＀!</B>", [live(user), live(bragmessage)])]);
		reps = 0;
		rt.setFv(f, "pixel_y", live(user), 5);
		while (rt.lt(($t = live(reps), reps = rt.inc($t, 1), $t), 6)) {
			if (!isEqual(rt.fv(f, "loc", live(user)), rt.fv(f, "loc", live(f.src)))) {
				break;
			}
			innerReps = null;
			innerReps = (yield* g.call(f, P("/proc/max"), null, [live(reps), 1]));
			while (rt.gt(live(innerReps), 0)) {
				yield* g.call(f, P("/proc/sleep"), null, [3]);
				$0 = null;
				$1 = live(user);
				$2 = "pixel_y";
				if (isEqual(rt.fv(f, "pixel_y", live(user)), 3)) {
					$3 = 5;
				} else {
					$3 = 3;
				}
				rt.op(f, "Animate", [2, 6], [$0, $1, $2, $3, "time", 3]);
				innerReps = rt.inc(live(innerReps), -1);
			}
			yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/creak.ogg"), 60, 1]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		rt.op(f, "Animate", [2, 6], [null, live(user), "pixel_y", 2, "time", 3]);
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/click.ogg"), 60, 1]);
		rt.setSv(f, "in_use", 0);
		rt.op(f, "Animate", [2, 6], [null, live(user), "pixel_y", 0, "time", 3]);
		finishmessage = rt.op(f, "PickUnweighted", [4], ["You feel stronger!", "You feel like you can take on the world!", "You feel robust!", "You feel indestructible!"]);
		rt.setSv(f, "icon_state", "benchpress");
		yield* g.srcCall(f, "cut_overlay", live(swole_overlay));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [live(finishmessage)])]);
	}
	return f.dot;
}, true);
