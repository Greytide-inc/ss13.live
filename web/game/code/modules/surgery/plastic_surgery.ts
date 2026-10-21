// From code/modules/surgery/plastic_surgery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1321, "/datum/surgery/plastic_surgery", "/datum/surgery", {
	name: "plastic surgery",
	steps: null,
	possible_locs: null,
});

// /datum/surgery/plastic_surgery/proc/<init>  (code/modules/surgery/plastic_surgery.dm:3)
rt.def("/datum/surgery/plastic_surgery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/reshape_face"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("head"));
	return f.dot;
});

rt.type(1346, "/datum/surgery_step/reshape_face", "/datum/surgery_step", {
	name: "reshape face",
	implements: null,
	time: 64,
});

// /datum/surgery_step/reshape_face/proc/<init>  (code/modules/surgery/plastic_surgery.dm:9)
rt.def("/datum/surgery_step/reshape_face/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/kitchen/knife"), 50, T("/obj/item/weapon/wirecutters"), 35]));
	return f.dot;
});

// /datum/surgery_step/reshape_face/proc/preop  (code/modules/surgery/plastic_surgery.dm:13)
rt.def("/datum/surgery_step/reshape_face/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to alter ＀'s appearance.", [live(user), live(target)]), fmt("<span class='notice'>You begin to alter ＀'s appearance...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/reshape_face/proc/success  (code/modules/surgery/plastic_surgery.dm:16)  may sleep
rt.def("/datum/surgery_step/reshape_face/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let oldname: Value = null, newname: Value = null, H: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, oldname, newname, H];
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(target)), 16384))) {
		(rt.modField(f, live(target), "status_flags", 16760831, rt.bitAnd));
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully restores ＀'s appearance!", [live(user), live(target)]), fmt("<span class='notice'>You successfully restore ＀'s appearance.</span>", [live(target)])]);
	} else {
		oldname = rt.fv(f, "real_name", live(target));
		rt.setFv(f, "real_name", live(target), (yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(target))), "random_name", [rt.fv(f, "gender", live(target)), 1])));
		newname = rt.fv(f, "real_name", live(target));
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ alters ＀'s appearance completely, ＀ is now ＀!", [live(user), live(oldname), (yield* g.callName(f, live(target), "p_they", [])), live(newname)]), fmt("<span class='notice'>You alter ＀'s appearance completely, ＀ is now ＀.</span>", [live(oldname), (yield* g.callName(f, live(target), "p_they", [])), live(newname)])]);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(target)), "sec_hud_set_ID", []);
	}
	return 1;
}, true);
