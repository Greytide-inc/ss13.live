// From code/modules/surgery/limb_augmentation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1341, "/datum/surgery_step/replace", "/datum/surgery_step", {
	name: "sever muscles",
	implements: null,
	time: 32,
});

// /datum/surgery_step/replace/proc/<init>  (code/modules/surgery/limb_augmentation.dm:9)
rt.def("/datum/surgery_step/replace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/wirecutters"), 55]));
	return f.dot;
});

// /datum/surgery_step/replace/proc/preop  (code/modules/surgery/limb_augmentation.dm:14)
rt.def("/datum/surgery_step/replace/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to sever the muscles on ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])]), fmt("<span class ='notice'>You begin to sever the muscles on ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])])]);
	return f.dot;
});

rt.type(1342, "/datum/surgery_step/add_limb", "/datum/surgery_step", {
	L: null,
	name: "replace limb",
	implements: null,
	time: 32,
});

// /datum/surgery_step/add_limb/proc/<init>  (code/modules/surgery/limb_augmentation.dm:19)
rt.def("/datum/surgery_step/add_limb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/bodypart"), 100]));
	return f.dot;
});

// /datum/surgery_step/add_limb/proc/preop  (code/modules/surgery/limb_augmentation.dm:25)
rt.def("/datum/surgery_step/add_limb/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let aug: Value = null;
	f.vars = () => [aug];
	if (!isEqual(rt.gv(f, "status", (aug = live(tool))), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>that's not an augment silly!</span>"]);
		return -1;
	}
	if (!isEqual(rt.fv(f, "body_zone", live(aug)), live(target_zone))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ isn't the right type for ＀.</span>", [live(tool), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
		return -1;
	}
	rt.setSv(f, "L", rt.fv(f, "operated_bodypart", live(surgery)));
	if (truthy(rt.sv(f, "L"))) {
		rt.callName(f, live(user), "visible_message", [fmt("＀ begins to augment ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])]), fmt("<span class ='notice'>You begin to augment ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("＀ looks for ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])]), fmt("<span class ='notice'>You look for ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])])]);
	}
	return f.dot;
});

rt.type(1316, "/datum/surgery/augmentation", "/datum/surgery", {
	name: "augmentation",
	steps: null,
	possible_locs: null,
	requires_real_bodypart: 1,
	species: null,
});

// /datum/surgery/augmentation/proc/<init>  (code/modules/surgery/limb_augmentation.dm:43)
rt.def("/datum/surgery/augmentation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/replace"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/add_limb")));
	rt.setSv(f, "possible_locs", rt.list("r_arm", "l_arm", "r_leg", "l_leg", "chest", "head"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/surgery_step/add_limb/proc/success  (code/modules/surgery/limb_augmentation.dm:52)  may sleep
rt.def("/datum/surgery_step/add_limb/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	f.vars = () => [user, target, target_zone, tool, surgery];
	if (truthy(rt.sv(f, "L"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully augments ＀'s ＀!", [live(user), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You successfully augment ＀'s ＀.</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
		yield* g.callName(f, rt.sv(f, "L"), "change_bodypart_status", [2, 1]);
		rt.setFv(f, "icon", rt.sv(f, "L"), rt.fv(f, "icon", live(tool)));
		rt.setFv(f, "max_damage", rt.sv(f, "L"), rt.fv(f, "max_damage", live(tool)));
		yield* g.callName(f, live(user), "drop_item", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(tool)]);
		yield* g.callName(f, live(target), "update_body_parts", []);
		yield* g.callName(f, live(target), "updatehealth", []);
		yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(target), null, "augmented", "addition", fmt("by giving him new ＀ INTENT: ＀", [(yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))]))])], rt.Args.Named);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has no organic ＀ there!</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
	}
	return 1;
}, true);
