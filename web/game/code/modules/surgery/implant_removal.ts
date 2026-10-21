// From code/modules/surgery/implant_removal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1315, "/datum/surgery/implant_removal", "/datum/surgery", {
	name: "implant removal",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	species: null,
});

// /datum/surgery/implant_removal/proc/<init>  (code/modules/surgery/implant_removal.dm:3)
rt.def("/datum/surgery/implant_removal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/extract_implant"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("chest"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

rt.type(1340, "/datum/surgery_step/extract_implant", "/datum/surgery_step", {
	I: null,
	name: "extract implant",
	implements: null,
	time: 64,
});

// /datum/surgery_step/extract_implant/proc/<init>  (code/modules/surgery/implant_removal.dm:12)
rt.def("/datum/surgery_step/extract_implant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/crowbar"), 65]));
	return f.dot;
});

// /datum/surgery_step/extract_implant/proc/preop  (code/modules/surgery/implant_removal.dm:17)
rt.def("/datum/surgery_step/extract_implant/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(target)), T("/obj/item"));
	if (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setSv(f, "I", live(O));
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "I"))) {
		rt.callName(f, live(user), "visible_message", [fmt("＀ begins to extract ＀ from ＀'s ＀.", [live(user), rt.sv(f, "I"), live(target), live(target_zone)]), fmt("<span class='notice'>You begin to extract ＀ from ＀'s ＀...</span>", [rt.sv(f, "I"), live(target), live(target_zone)])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("＀ looks for an implant in ＀'s ＀.", [live(user), live(target), live(target_zone)]), fmt("<span class='notice'>You look for an implant in ＀'s ＀...</span>", [live(target), live(target_zone)])]);
	}
	return f.dot;
});

// /datum/surgery_step/extract_implant/proc/success  (code/modules/surgery/implant_removal.dm:27)  may sleep
rt.def("/datum/surgery_step/extract_implant/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let _case: Value = null, ic: Value = null;
	let $e: any;
	f.vars = () => [user, target, target_zone, tool, surgery, _case, ic, $e];
	if (truthy(rt.sv(f, "I"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully removes ＀ from ＀'s ＀!", [live(user), rt.sv(f, "I"), live(target), live(target_zone)]), fmt("<span class='notice'>You successfully remove ＀ from ＀'s ＀.</span>", [rt.sv(f, "I"), live(target), live(target_zone)])]);
		yield* g.callName(f, rt.sv(f, "I"), "removed", [live(target)]);
		_case = null;
		ic = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(user)), T("/obj/item/weapon/implantcase"));
		if (($e = rt.next(f, 0)) !== undefined) {
			ic = $e;
			_case = live(ic);
		}
		rt.endFor(f, 0);
		if (!truthy(live(_case))) {
			_case = rt.locateIn(f, T("/obj/item/weapon/implantcase"), rt.getStep(f, live(target), 0));
		}
		if ((truthy(live(_case)) && !truthy(rt.fv(f, "imp", live(_case))))) {
			rt.setFv(f, "imp", live(_case), rt.sv(f, "I"));
			rt.setFv(f, "loc", rt.sv(f, "I"), live(_case));
			yield* g.callName(f, live(_case), "update_icon", []);
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ places ＀ into ＀!", [live(user), rt.sv(f, "I"), live(_case)]), fmt("<span class='notice'>You place ＀ into ＀.</span>", [rt.sv(f, "I"), live(_case)])]);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "I")]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't find anything in ＀'s ＀!</span>", [live(target), live(target_zone)])]);
	}
	return 1;
}, true);
