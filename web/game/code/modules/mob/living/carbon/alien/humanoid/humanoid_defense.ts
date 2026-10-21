// From code/modules/mob/living/carbon/alien/humanoid/humanoid_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/humanoid/proc/grabbedby  (code/modules/mob/living/carbon/alien/humanoid/humanoid_defense.dm:3)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/grabbedby", function* grabbedby(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (((((isEqual(live(f.args[0]), live(f.src)) && truthy(rt.sv(f, "pulling"))) && rt.ge(rt.sv(f, "grab_state"), 1)) && !truthy(rt.fv(f, "anchored", rt.sv(f, "pulling")))) && truthy((rt.istype(rt.sv(f, "pulling"), T("/mob/living/carbon")) ? 1 : 0)))) {
		yield* g.callSrc(f, "devour_mob", [null, rt.sv(f, "pulling"), "devour_time", 60], rt.Args.Named);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user", "supress_message"] });

// /mob/living/carbon/alien/humanoid/proc/attack_hulk  (code/modules/mob/living/carbon/alien/humanoid/humanoid_defense.dm:9)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	let hitverb: Value = null;
	f.vars = () => [user, does_attack_animation, hitverb];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	yield* g.callSuper(f, [live(user), 1]);
	yield* g.srcCall(f, "adjustBruteLoss", 15);
	hitverb = "punched";
	if (rt.lt(rt.sv(f, "mob_size"), 3)) {
		yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(user), 15]);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(user), 15]);
		hitverb = "slammed";
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has ＀ ＀!</span>", [live(user), live(hitverb), live(f.src)]), fmt("<span class='userdanger'>＀ has ＀ ＀!</span>", [live(user), live(hitverb), live(f.src)]), null, 3);
	return 1;
}, true);

// /mob/living/carbon/alien/humanoid/proc/attack_hand  (code/modules/mob/living/carbon/alien/humanoid/humanoid_defense.dm:24)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/attack_hand", function* attack_hand(f: Frame) {
	let damage: Value = null, affecting: Value = null;
	let $0: any;
	f.vars = () => [damage, affecting, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	$0 = rt.fv(f, "a_intent", live(f.args[0]));
	if ($0 === "harm") {
		damage = (yield* g.call(f, P("/proc/rand"), null, [1, 9]));
		if (truthy(rt.op(f, "Prob", [], [90]))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has punched ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has punched ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
			if ((!isEqual(rt.sv(f, "stat"), 2) && (rt.gt(live(damage), 9) || truthy(rt.op(f, "Prob", [], [5]))))) {
				yield* g.srcCall(f, "Unconscious", 40);
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has knocked ＀ down!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has knocked ＀ down!</span>", [live(f.args[0]), live(f.src)]));
			}
			affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))));
			yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting));
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='userdanger'>＀ has attempted to punch ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has attempted to punch ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
		}
	} else if ($0 === "disarm") {
		if (truthy(rt.sv(f, "lying"))) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "Unconscious", 40);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "pushed"]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has pushed down ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has pushed down ＀!</span>", [live(f.args[0]), live(f.src)]));
		} else {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.srcCall(f, "drop_item");
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has disarmed ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
				yield* g.srcCall(f, "visible_message", fmt("<span class='userdanger'>＀ has attempted to disarm ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has attempted to disarm ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
			}
		}
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/alien/humanoid/proc/do_attack_animation  (code/modules/mob/living/carbon/alien/humanoid/humanoid_defense.dm:66)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if ((!truthy(live(f.args[3])) && !truthy(live(f.args[1])))) {
		f.args[1] = "claw";
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
