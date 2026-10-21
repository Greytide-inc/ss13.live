// From code/modules/mob/living/carbon/alien/larva/larva_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/larva/proc/attack_hand  (code/modules/mob/living/carbon/alien/larva/larva_defense.dm:4)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/attack_hand", function* attack_hand(f: Frame) {
	let damage: Value = null, affecting: Value = null;
	f.vars = () => [damage, affecting];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	damage = (yield* g.call(f, P("/proc/rand"), null, [1, 9]));
	if (truthy(rt.op(f, "Prob", [], [90]))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "punch", 25, 1, -1]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "attacked"]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has kicked ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has kicked ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
		if ((!isEqual(rt.sv(f, "stat"), 2) && rt.gt(live(damage), 4.900000095367432))) {
			yield* g.srcCall(f, "Unconscious", (yield* g.call(f, P("/proc/rand"), null, [100, 200])));
		}
		affecting = (yield* g.srcCall(f, "get_bodypart", (yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(f.args[0]))]))));
		yield* g.srcCall(f, "apply_damage", live(damage), "brute", live(affecting));
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has attempted to kick ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀ has attempted to kick ＀!</span>", [live(f.args[0]), live(f.src)]), null, 3);
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/carbon/alien/larva/proc/attack_hulk  (code/modules/mob/living/carbon/alien/larva/larva_defense.dm:22)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	yield* g.callSuper(f, [live(user), 1]);
	yield* g.srcCall(f, "adjustBruteLoss", add(5, (yield* g.call(f, P("/proc/rand"), null, [1, 9]))));
	yield* g.new_(f, T("/datum/forced_movement"), [live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(user), live(f.src), 30])), 1]);
	return 1;
}, true);

// /mob/living/carbon/alien/larva/proc/do_attack_animation  (code/modules/mob/living/carbon/alien/larva/larva_defense.dm:29)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if ((!truthy(live(f.args[3])) && !truthy(live(f.args[1])))) {
		f.args[1] = "bite";
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
