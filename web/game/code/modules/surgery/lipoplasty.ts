// From code/modules/surgery/lipoplasty.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1317, "/datum/surgery/lipoplasty", "/datum/surgery", {
	name: "lipoplasty",
	steps: null,
	possible_locs: null,
});

// /datum/surgery/lipoplasty/proc/<init>  (code/modules/surgery/lipoplasty.dm:3)
rt.def("/datum/surgery/lipoplasty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/cut_fat"), T("/datum/surgery_step/remove_fat"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("chest"));
	return f.dot;
});

// /datum/surgery/lipoplasty/proc/can_start  (code/modules/surgery/lipoplasty.dm:7)
rt.def("/datum/surgery/lipoplasty/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(target)), 32))) {
		return 1;
	}
	return 0;
});

rt.type(1343, "/datum/surgery_step/cut_fat", "/datum/surgery_step", {
	name: "cut excess fat",
	implements: null,
	time: 64,
});

// /datum/surgery_step/cut_fat/proc/<init>  (code/modules/surgery/lipoplasty.dm:15)
rt.def("/datum/surgery_step/cut_fat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/hatchet"), 35, T("/obj/item/weapon/kitchen/knife/butcher"), 25]));
	return f.dot;
});

// /datum/surgery_step/cut_fat/proc/preop  (code/modules/surgery/lipoplasty.dm:19)
rt.def("/datum/surgery_step/cut_fat/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to cut away ＀'s excess fat.", [live(user), live(target)]), fmt("<span class='notice'>You begin to cut away ＀'s excess fat...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/cut_fat/proc/success  (code/modules/surgery/lipoplasty.dm:22)
rt.def("/datum/surgery_step/cut_fat/proc/success", function success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ cuts ＀'s excess fat loose!", [live(user), live(target)]), fmt("<span class='notice'>You cut ＀'s excess fat loose.</span>", [live(target)])]);
	return 1;
});

rt.type(1344, "/datum/surgery_step/remove_fat", "/datum/surgery_step", {
	name: "remove loose fat",
	implements: null,
	time: 32,
});

// /datum/surgery_step/remove_fat/proc/<init>  (code/modules/surgery/lipoplasty.dm:28)
rt.def("/datum/surgery_step/remove_fat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/retractor"), 100, T("/obj/item/weapon/screwdriver"), 45, T("/obj/item/weapon/wirecutters"), 35]));
	return f.dot;
});

// /datum/surgery_step/remove_fat/proc/preop  (code/modules/surgery/lipoplasty.dm:32)
rt.def("/datum/surgery_step/remove_fat/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to extract ＀'s loose fat!", [live(user), live(target)]), fmt("<span class='notice'>You begin to extract ＀'s loose fat...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/remove_fat/proc/success  (code/modules/surgery/lipoplasty.dm:35)  may sleep
rt.def("/datum/surgery_step/remove_fat/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let removednutriment: Value = null, H: Value = null, typeofmeat: Value = null, newmeat: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, removednutriment, H, typeofmeat, newmeat];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ extracts ＀'s fat!", [live(user), live(target)]), fmt("<span class='notice'>You extract ＀'s fat.</span>", [live(target)])]);
	rt.setFv(f, "overeatduration", live(target), 0);
	removednutriment = rt.fv(f, "nutrition", live(target));
	rt.setFv(f, "nutrition", live(target), 450);
	(removednutriment = rt.modify(live(removednutriment), 450, subtract));
	H = live(target);
	typeofmeat = T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human");
	if ((truthy(rt.fv(f, "dna", live(H))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
		typeofmeat = rt.gv(f, "meat", rt.gv(f, "species", rt.fv(f, "dna", live(H))));
	}
	rt.setFv(f, "name", (newmeat = (yield* g.new_(f, live(typeofmeat), []))), "fatty meat");
	rt.setFv(f, "desc", live(newmeat), "Extremely fatty tissue taken from a patient.");
	rt.setFv(f, "subjectname", live(newmeat), rt.fv(f, "real_name", live(H)));
	rt.setFv(f, "subjectjob", live(newmeat), rt.fv(f, "job", live(H)));
	yield* g.callName(f, rt.fv(f, "reagents", live(newmeat)), "add_reagent", ["nutriment", divide(live(removednutriment), 15)]);
	rt.setFv(f, "loc", live(newmeat), rt.fv(f, "loc", live(target)));
	return 1;
}, true);
