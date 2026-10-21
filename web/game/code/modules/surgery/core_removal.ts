// From code/modules/surgery/core_removal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1312, "/datum/surgery/core_removal", "/datum/surgery", {
	name: "core removal",
	steps: null,
	possible_locs: null,
	species: null,
});

// /datum/surgery/core_removal/proc/<init>  (code/modules/surgery/core_removal.dm:3)
rt.def("/datum/surgery/core_removal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/extract_core")));
	rt.setSv(f, "possible_locs", rt.list("r_arm", "l_arm", "r_leg", "l_leg", "chest", "head"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/simple_animal/slime")));
	return f.dot;
});

// /datum/surgery/core_removal/proc/can_start  (code/modules/surgery/core_removal.dm:8)
rt.def("/datum/surgery/core_removal/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	if (isEqual(rt.fv(f, "stat", live(target)), 2)) {
		return 1;
	}
	return 0;
});

rt.type(1331, "/datum/surgery_step/extract_core", "/datum/surgery_step", {
	name: "extract core",
	implements: null,
	time: 16,
});

// /datum/surgery_step/extract_core/proc/<init>  (code/modules/surgery/core_removal.dm:15)
rt.def("/datum/surgery_step/extract_core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/crowbar"), 100]));
	return f.dot;
});

// /datum/surgery_step/extract_core/proc/preop  (code/modules/surgery/core_removal.dm:19)
rt.def("/datum/surgery_step/extract_core/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to extract a core from ＀.", [live(user), live(target)]), fmt("<span class='notice'>You begin to extract a core from ＀...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/extract_core/proc/success  (code/modules/surgery/core_removal.dm:22)  may sleep
rt.def("/datum/surgery_step/extract_core/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let slime: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, slime];
	if (rt.gt(rt.gv(f, "cores", (slime = live(target))), 0)) {
		rt.incField(f, live(slime), "cores", -1, true);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully extracts a core from ＀!", [live(user), live(target)]), fmt("<span class='notice'>You successfully extract a core from ＀. ＀ core５ remaining.</span>", [live(target), rt.fv(f, "cores", live(slime))])]);
		yield* g.new_(f, rt.fv(f, "coretype", live(slime)), [rt.fv(f, "loc", live(slime))]);
		if (rt.le(rt.fv(f, "cores", live(slime)), 0)) {
			rt.setFv(f, "icon_state", live(slime), fmt("＀ baby slime dead-nocore", [rt.fv(f, "colour", live(slime))]));
			return 1;
		} else {
			return 0;
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There aren't any cores left in ＀!</span>", [live(target)])]);
		return 1;
	}
	return f.dot;
}, true);
