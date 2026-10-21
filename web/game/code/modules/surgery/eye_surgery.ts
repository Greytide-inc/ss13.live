// From code/modules/surgery/eye_surgery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1314, "/datum/surgery/eye_surgery", "/datum/surgery", {
	name: "eye surgery",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	species: null,
});

// /datum/surgery/eye_surgery/proc/<init>  (code/modules/surgery/eye_surgery.dm:3)
rt.def("/datum/surgery/eye_surgery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/fix_eyes"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("eyes"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

rt.type(1333, "/datum/surgery_step/fix_eyes", "/datum/surgery_step", {
	name: "fix eyes",
	implements: null,
	time: 64,
});

// /datum/surgery_step/fix_eyes/proc/<init>  (code/modules/surgery/eye_surgery.dm:11)
rt.def("/datum/surgery_step/fix_eyes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/screwdriver"), 45, T("/obj/item/weapon/pen"), 25]));
	return f.dot;
});

// /datum/surgery/eye_surgery/proc/can_start  (code/modules/surgery/eye_surgery.dm:15)
rt.def("/datum/surgery/eye_surgery/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let E: Value = null;
	f.vars = () => [E];
	if (truthy((E = rt.callName(f, live(target), "getorganslot", ["eye_sight"])))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "It's hard to do surgery on someones eyes when they don't have any."]);
	return 0;
});

// /datum/surgery_step/fix_eyes/proc/preop  (code/modules/surgery/eye_surgery.dm:21)
rt.def("/datum/surgery_step/fix_eyes/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to fix ＀'s eyes.", [live(user), live(target)]), fmt("<span class='notice'>You begin to fix ＀'s eyes...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/fix_eyes/proc/success  (code/modules/surgery/eye_surgery.dm:24)  may sleep
rt.def("/datum/surgery_step/fix_eyes/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	f.vars = () => [user, target, target_zone, tool, surgery];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully fixes ＀'s eyes!", [live(user), live(target)]), fmt("<span class='notice'>You succeed in fixing ＀'s eyes.</span>", [live(target)])]);
	yield* g.callName(f, live(target), "cure_blind", []);
	yield* g.callName(f, live(target), "set_blindness", [0]);
	yield* g.callName(f, live(target), "cure_nearsighted", []);
	yield* g.callName(f, live(target), "blur_eyes", [35]);
	yield* g.callName(f, live(target), "set_eye_damage", [0]);
	return 1;
}, true);

// /datum/surgery_step/fix_eyes/proc/failure  (code/modules/surgery/eye_surgery.dm:33)
rt.def("/datum/surgery_step/fix_eyes/proc/failure", function failure(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (truthy(rt.callName(f, live(target), "getorgan", [T("/obj/item/organ/brain")]))) {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ accidentally stabs ＀ right in the brain!</span>", [live(user), live(target)]), fmt("<span class='warning'>You accidentally stab ＀ right in the brain!</span>", [live(target)])]);
		rt.callName(f, live(target), "adjustBrainLoss", [100]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ accidentally stabs ＀ right in the brain! Or would have, if ＀ had a brain.</span>", [live(user), live(target), live(target)]), fmt("<span class='warning'>You accidentally stab ＀ right in the brain! Or would have, if ＀ had a brain.</span>", [live(target), live(target)])]);
	}
	return 0;
});
