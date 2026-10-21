// From code/modules/surgery/cavity_implant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1311, "/datum/surgery/cavity_implant", "/datum/surgery", {
	name: "cavity implant",
	steps: null,
	possible_locs: null,
	species: null,
});

// /datum/surgery/cavity_implant/proc/<init>  (code/modules/surgery/cavity_implant.dm:3)
rt.def("/datum/surgery/cavity_implant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/handle_cavity"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("chest"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

rt.type(1330, "/datum/surgery_step/handle_cavity", "/datum/surgery_step", {
	IC: null,
	name: "implant item",
	accept_hand: 1,
	accept_any_item: 1,
	time: 32,
});

// /datum/surgery_step/handle_cavity/proc/preop  (code/modules/surgery/cavity_implant.dm:17)
rt.def("/datum/surgery_step/handle_cavity/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let CH: Value = null;
	f.vars = () => [CH];
	rt.setSv(f, "IC", rt.gv(f, "cavity_item", (CH = rt.callName(f, live(target), "get_bodypart", ["chest"]))));
	if (truthy(live(tool))) {
		rt.callName(f, live(user), "visible_message", [fmt("＀ begins to insert ＀ into ＀'s ＀.", [live(user), live(tool), live(target), live(target_zone)]), fmt("<span class='notice'>You begin to insert ＀ into ＀'s ＀...</span>", [live(tool), live(target), live(target_zone)])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("＀ checks for items in ＀'s ＀.", [live(user), live(target), live(target_zone)]), fmt("<span class='notice'>You check for items in ＀'s ＀...</span>", [live(target), live(target_zone)])]);
	}
	return f.dot;
});

// /datum/surgery_step/handle_cavity/proc/success  (code/modules/surgery/cavity_implant.dm:25)  may sleep
rt.def("/datum/surgery_step/handle_cavity/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let CH: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, CH];
	CH = (yield* g.callName(f, live(target), "get_bodypart", ["chest"]));
	if (truthy(live(tool))) {
		if ((((truthy(rt.sv(f, "IC")) || rt.gt(rt.fv(f, "w_class", live(tool)), 3)) || truthy((rt.isIn(f, 2, rt.fv(f, "flags", live(tool))) ? 1 : 0))) || truthy((rt.istype(live(tool), T("/obj/item/organ")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't seem to fit ＀ in ＀'s ＀!</span>", [live(tool), live(target), live(target_zone)])]);
			return 0;
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ stuffs ＀ into ＀'s ＀!", [live(user), live(tool), live(target), live(target_zone)]), fmt("<span class='notice'>You stuff ＀ into ＀'s ＀.</span>", [live(tool), live(target), live(target_zone)])]);
			yield* g.callName(f, live(user), "drop_item", []);
			rt.setFv(f, "cavity_item", live(CH), live(tool));
			rt.setFv(f, "loc", live(tool), live(target));
			return 1;
		}
	} else {
		if (truthy(rt.sv(f, "IC"))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ pulls ＀ out of ＀'s ＀!", [live(user), rt.sv(f, "IC"), live(target), live(target_zone)]), fmt("<span class='notice'>You pull ＀ out of ＀'s ＀.</span>", [rt.sv(f, "IC"), live(target), live(target_zone)])]);
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "IC")]);
			rt.setFv(f, "cavity_item", live(CH), null);
			return 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't find anything in ＀'s ＀.</span>", [live(target), live(target_zone)])]);
			return 0;
		}
	}
	return f.dot;
}, true);
