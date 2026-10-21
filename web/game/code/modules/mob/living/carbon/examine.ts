// From code/modules/mob/living/carbon/examine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/proc/examine  (code/modules/mob/living/carbon/examine.dm:2)
rt.def("/mob/living/carbon/proc/examine", function examine(f: Frame, user: Value) {
	let t_He: Value = null, t_His: Value = null, t_his: Value = null, t_him: Value = null, t_has: Value = null, t_is: Value = null, msg: Value = null, I: Value = null, appears_dead: Value = null, missing: Value = null, t: Value = null, temp: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [t_He, t_His, t_his, t_him, t_has, t_is, msg, I, appears_dead, missing, t, temp, $0, $1, $2, $3, $e];
	t_He = rt.callSrc(f, "p_they", [1]);
	t_His = rt.callSrc(f, "p_their", [1]);
	t_his = rt.callSrc(f, "p_their", []);
	t_him = rt.callSrc(f, "p_them", []);
	t_has = rt.callSrc(f, "p_have", []);
	t_is = rt.callSrc(f, "p_are", []);
	msg = fmt("<span class='info'>*---------*\nThis is ＀ ＇<EM>！</EM>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	if (truthy(rt.sv(f, "handcuffed"))) {
		msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ handcuffed!</span>\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "handcuffed")])]), add);
	}
	if (truthy(rt.sv(f, "head"))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！ on ＀ head. \n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "head")]), rt.fv(f, "head", live(f.src)), live(t_his)]), add);
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！ on ＀ face.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_mask")]), rt.fv(f, "wear_mask", live(f.src)), live(t_his)]), add);
	}
	if (truthy(rt.sv(f, "wear_neck"))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！ around ＀ neck.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_neck")]), rt.fv(f, "wear_neck", live(f.src)), live(t_his)]), add);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 128))) {
			if (truthy(rt.fv(f, "blood_DNA", live(I)))) {
				$0 = live(t_He);
				$1 = live(t_is);
				$2 = rt.call(f, P("/proc/bicon"), null, [live(I)]);
				if (isEqual(rt.fv(f, "gender", live(I)), "plural")) {
					$3 = "some";
				} else {
					$3 = "a";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ holding ＀ ＀ blood-stained ＀ in ＀ ＀!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", live(I)), live(t_his), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			} else {
				msg = rt.modify(live(msg), fmt("＀ ＀ holding ＀ ＇！ in ＀ ＀.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [live(I)]), live(I), live(t_his), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "back"))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ on ＀ back.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "back")]), rt.fv(f, "back", live(f.src)), live(t_his)]), add);
	}
	appears_dead = 0;
	if (isEqual(rt.sv(f, "stat"), 2)) {
		appears_dead = 1;
		if (truthy(rt.callSrc(f, "getorgan", [T("/obj/item/organ/brain")]))) {
			msg = rt.modify(live(msg), fmt("<span class='deadsay'>＀ ＀ limp and unresponsive, with no signs of life.</span>\n", [live(t_He), live(t_is)]), add);
		} else {
			if (truthy(rt.callSrc(f, "get_bodypart", ["head"]))) {
				msg = rt.modify(live(msg), fmt("<span class='deadsay'>＀ appears that ＀ brain is missing...</span>\n", [live(t_He), live(t_his)]), add);
			}
		}
	}
	missing = rt.callSrc(f, "get_missing_limbs", []);
	t = null;
	rt.forList(f, 0, live(missing));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (isEqual(live(t), "head")) {
			msg = rt.modify(live(msg), fmt("<span class='deadsay'><B>＀ ＀ is missing!</B></span>\n", [live(t_His), rt.call(f, P("/proc/parse_zone"), null, [live(t)])]), add);
			continue;
		}
		msg = rt.modify(live(msg), fmt("<span class='warning'><B>＀ ＀ is missing!</B></span>\n", [live(t_His), rt.call(f, P("/proc/parse_zone"), null, [live(t)])]), add);
	}
	rt.endFor(f, 0);
	msg = rt.modify(live(msg), "<span class='warning'>", add);
	if (truthy((temp = rt.callSrc(f, "getBruteLoss", [])))) {
		if (rt.lt(live(temp), 30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ minor bruising.\n", [live(t_He), live(t_has)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<B>＀ ＀ severe bruising!</B>\n", [live(t_He), live(t_has)]), add);
		}
	}
	if (truthy((temp = rt.callSrc(f, "getFireLoss", [])))) {
		if (rt.lt(live(temp), 30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ minor burns.\n", [live(t_He), live(t_has)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<B>＀ ＀ severe burns!</B>\n", [live(t_He), live(t_has)]), add);
		}
	}
	if (truthy((temp = rt.callSrc(f, "getCloneLoss", [])))) {
		if (rt.lt(rt.callSrc(f, "getCloneLoss", []), 30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ slightly deformed.\n", [live(t_He), live(t_is)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<b>＀ ＀ severely deformed.</b>\n", [live(t_He), live(t_is)]), add);
		}
	}
	if (rt.gt(rt.callSrc(f, "getBrainLoss", []), 60)) {
		msg = rt.modify(live(msg), fmt("＀ seems to be clumsy and unable to think.\n", [live(t_He)]), add);
	}
	if (rt.gt(rt.sv(f, "fire_stacks"), 0)) {
		msg = rt.modify(live(msg), fmt("＀ ＀ covered in something flammable.\n", [live(t_He), live(t_is)]), add);
	}
	if (rt.lt(rt.sv(f, "fire_stacks"), 0)) {
		msg = rt.modify(live(msg), fmt("＀ ＀ looks a little soaked.\n", [live(t_He), live(t_is)]), add);
	}
	if ((truthy(rt.sv(f, "pulledby")) && truthy(rt.fv(f, "grab_state", rt.sv(f, "pulledby"))))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ restrained by ＀'s grip.\n", [live(t_He), live(t_is), rt.sv(f, "pulledby")]), add);
	}
	msg = rt.modify(live(msg), "</span>", add);
	if (!truthy(live(appears_dead))) {
		if (isEqual(rt.sv(f, "stat"), 1)) {
			msg = rt.modify(live(msg), fmt("＀ ＀n't responding to anything around ＀ and seems to be asleep.\n", [live(t_He), live(t_is), live(t_him)]), add);
		}
		if (truthy(rt.sv(f, "digitalcamo"))) {
			msg = rt.modify(live(msg), fmt("＀ ＀ moving ＀ body in an unnatural and blatantly unsimian manner.\n", [live(t_He), live(t_is), live(t_his)]), add);
		}
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return f.dot;
});
