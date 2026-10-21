// From code/modules/surgery/remove_embedded_object.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1323, "/datum/surgery/embedded_removal", "/datum/surgery", {
	name: "removal of embedded objects",
	steps: null,
	possible_locs: null,
});

// /datum/surgery/embedded_removal/proc/<init>  (code/modules/surgery/remove_embedded_object.dm:3)
rt.def("/datum/surgery/embedded_removal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/remove_object")));
	rt.setSv(f, "possible_locs", rt.list("r_arm", "l_arm", "r_leg", "l_leg", "chest", "head"));
	return f.dot;
});

rt.type(1348, "/datum/surgery_step/remove_object", "/datum/surgery_step", {
	L: null,
	name: "remove embedded objects",
	time: 32,
	accept_hand: 1,
});

// /datum/surgery_step/remove_object/proc/preop  (code/modules/surgery/remove_embedded_object.dm:17)
rt.def("/datum/surgery_step/remove_object/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.setSv(f, "L", rt.fv(f, "operated_bodypart", live(surgery)));
	if (truthy(rt.sv(f, "L"))) {
		rt.callName(f, live(user), "visible_message", [fmt("＀ looks for objects embedded in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])]), fmt("<span class='notice'>You look for objects embedded in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("＀ looks for ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])]), fmt("<span class='notice'>You look for ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))])])]);
	}
	return f.dot;
});

// /datum/surgery_step/remove_object/proc/success  (code/modules/surgery/remove_embedded_object.dm:24)  may sleep
rt.def("/datum/surgery_step/remove_object/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let H: Value = null, objects: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [user, target, target_zone, tool, surgery, H, objects, I, $e];
	if (truthy(rt.sv(f, "L"))) {
		if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(target);
			objects = 0;
			I = null;
			rt.forList(f, 0, rt.fv(f, "embedded_objects", rt.sv(f, "L")), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				objects = rt.inc(live(objects), 1);
				rt.setFv(f, "loc", live(I), rt.getStep(f, live(H), 0));
				(rt.modField(f, rt.sv(f, "L"), "embedded_objects", live(I), subtract));
			}
			rt.endFor(f, 0);
			if (!truthy((yield* g.callName(f, live(H), "has_embedded_objects", [])))) {
				yield* g.callName(f, live(H), "clear_alert", ["embeddedobject"]);
			}
			if (rt.gt(live(objects), 0)) {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ sucessfully removes ＀ objects from ＀'s ＀!", [live(user), live(objects), live(H), rt.sv(f, "L")]), fmt("<span class='notice'>You successfully remove ＀ objects from ＀'s ＀.</span>", [live(objects), live(H), rt.fv(f, "name", rt.sv(f, "L"))])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You find no objects embedded in ＀'s ＀!</span>", [live(H), rt.sv(f, "L")])]);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't find ＀'s ＀, let alone any objects embedded in it!</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))]))])]);
	}
	return 1;
}, true);
