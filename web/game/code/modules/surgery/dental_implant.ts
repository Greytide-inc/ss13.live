// From code/modules/surgery/dental_implant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1313, "/datum/surgery/dental_implant", "/datum/surgery", {
	name: "dental implant",
	steps: null,
	possible_locs: null,
});

// /datum/surgery/dental_implant/proc/<init>  (code/modules/surgery/dental_implant.dm:3)
rt.def("/datum/surgery/dental_implant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/drill"), T("/datum/surgery_step/insert_pill")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("mouth"));
	return f.dot;
});

rt.type(1332, "/datum/surgery_step/insert_pill", "/datum/surgery_step", {
	name: "insert pill",
	implements: null,
	time: 16,
});

// /datum/surgery_step/insert_pill/proc/<init>  (code/modules/surgery/dental_implant.dm:8)
rt.def("/datum/surgery_step/insert_pill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill"), 100]));
	return f.dot;
});

// /datum/surgery_step/insert_pill/proc/preop  (code/modules/surgery/dental_implant.dm:12)
rt.def("/datum/surgery_step/insert_pill/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to wedge ％！ in ＀'s ＀.", [live(user), live(tool), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to wedge ＀ in ＀'s ＀...</span>", [live(tool), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/insert_pill/proc/success  (code/modules/surgery/dental_implant.dm:15)  may sleep
rt.def("/datum/surgery_step/insert_pill/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let _P: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, _P];
	if (!truthy((rt.istype(live(tool), T("/obj/item/weapon/reagent_containers/pill")) ? 1 : 0))) {
		return 0;
	}
	yield* g.callName(f, live(user), "drop_item", []);
	rt.setFv(f, "loc", live(tool), live(target));
	rt.setFv(f, "name", rt.gv(f, "button", (_P = (yield* g.new_(f, T("/datum/action/item_action/hands_free/activate_pill"), [live(tool)])))), fmt("Activate ＀", [rt.fv(f, "name", live(tool))]));
	rt.setFv(f, "target", live(_P), live(tool));
	yield* g.callName(f, live(_P), "Grant", [live(target)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ wedges ％！ into ＀'s ＀!", [live(user), live(tool), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You wedge ＀ into ＀'s ＀.</span>", [live(tool), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
	return 1;
}, true);

rt.type(213, "/datum/action/item_action/hands_free/activate_pill", "/datum/action/item_action/hands_free", {
	name: "Activate Pill",
});

// /datum/action/item_action/hands_free/activate_pill/proc/Trigger  (code/modules/surgery/dental_implant.dm:33)  may sleep
rt.def("/datum/action/item_action/hands_free/activate_pill/proc/Trigger", function* Trigger(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='caution'>You grit your teeth and burst the implanted ＀!</span>", [rt.fv(f, "name", rt.sv(f, "target"))])]);
	yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "owner"), null, "swallowed an implanted pill", rt.sv(f, "target")]);
	if (truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "target"))))) {
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "target")), "reaction", [rt.sv(f, "owner"), 2]);
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "target")), "trans_to", [rt.sv(f, "owner"), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "target")))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "target")]);
	return 1;
}, true);
