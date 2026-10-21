// From code/modules/surgery/tail_modification.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1324, "/datum/surgery/tail_removal", "/datum/surgery", {
	name: "tail removal",
	possible_locs: null,
	steps: null,
	species: null,
});

// /datum/surgery/tail_removal/proc/<init>  (code/modules/surgery/tail_modification.dm:10)
rt.def("/datum/surgery/tail_removal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_locs", rt.list("groin"));
	$0 = $0;
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/sever_tail"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/surgery/tail_removal/proc/can_start  (code/modules/surgery/tail_modification.dm:13)
rt.def("/datum/surgery/tail_removal/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let L: Value = null;
	f.vars = () => [L];
	L = live(target);
	if ((truthy((rt.isIn(f, "tail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(L))))) ? 1 : 0)) || truthy((rt.isIn(f, "waggingtail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(L))))) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

rt.type(1349, "/datum/surgery_step/sever_tail", "/datum/surgery_step", {
	name: "sever tail",
	time: 64,
	implements: null,
});

// /datum/surgery_step/sever_tail/proc/<init>  (code/modules/surgery/tail_modification.dm:20)
rt.def("/datum/surgery_step/sever_tail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/sabre"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/melee/arm_blade"), 80, T("/obj/item/weapon/twohanded/required/chainsaw"), 80, T("/obj/item/weapon/mounted_chainsaw"), 80, T("/obj/item/weapon/twohanded/fireaxe"), 50, T("/obj/item/weapon/hatchet"), 40, T("/obj/item"), 30]));
	return f.dot;
});

// /datum/surgery_step/sever_tail/proc/preop  (code/modules/surgery/tail_modification.dm:28)
rt.def("/datum/surgery_step/sever_tail/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to sever ＀'s tail!", [live(user), live(target)]), fmt("<span class='notice'>You begin to sever ＀'s tail...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/sever_tail/proc/tool_check  (code/modules/surgery/tail_modification.dm:31)
rt.def("/datum/surgery_step/sever_tail/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	if ((isEqual(rt.sv(f, "implement_type"), T("/obj/item")) && !truthy(rt.callName(f, live(tool), "is_sharp", [])))) {
		return 0;
	}
	return 1;
});

// /datum/surgery_step/sever_tail/proc/success  (code/modules/surgery/tail_modification.dm:37)  may sleep
rt.def("/datum/surgery_step/sever_tail/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let L: Value = null, S: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, L, S];
	L = live(target);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ severs ＀'s tail!", [live(user), live(L)]), fmt("<span class='notice'>You sever ＀'s tail.</span>", [live(L)])]);
	if (truthy((rt.isIn(f, "tail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(L))))) ? 1 : 0))) {
		(rt.modField(f, rt.gv(f, "species", rt.fv(f, "dna", live(L))), "mutant_bodyparts", "tail_lizard", subtract));
	} else {
		if (truthy((rt.isIn(f, "waggingtail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(L))))) ? 1 : 0))) {
			(rt.modField(f, rt.gv(f, "species", rt.fv(f, "dna", live(L))), "mutant_bodyparts", "waggingtail_lizard", subtract));
		}
	}
	if (truthy((rt.isIn(f, "spines", rt.gv(f, "features", rt.fv(f, "dna", live(L)))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "dna", live(L)), "features", "spines", subtract));
	}
	yield* g.callName(f, (S = (yield* g.new_(f, T("/obj/item/severedtail"), [rt.getStep(f, live(target), 0)]))), "add_atom_colour", [fmt("#＀", [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(L))), "mcolor")]), 4]);
	rt.setFv(f, "markings", live(S), fmt("＀", [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(L))), "tail_lizard")]));
	yield* g.callName(f, live(L), "update_body", []);
	return 1;
}, true);

rt.type(1325, "/datum/surgery/tail_attachment", "/datum/surgery", {
	name: "tail attachment",
	possible_locs: null,
	steps: null,
	species: null,
});

// /datum/surgery/tail_attachment/proc/<init>  (code/modules/surgery/tail_modification.dm:57)
rt.def("/datum/surgery/tail_attachment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_locs", rt.list("groin"));
	$0 = $0;
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/replace"), T("/datum/surgery_step/attach_tail"), T("/datum/surgery_step/close")));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

// /datum/surgery/tail_attachment/proc/can_start  (code/modules/surgery/tail_modification.dm:60)
rt.def("/datum/surgery/tail_attachment/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let L: Value = null;
	f.vars = () => [L];
	L = live(target);
	if ((!truthy((rt.isIn(f, "tail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(L))))) ? 1 : 0)) && !truthy((rt.isIn(f, "waggingtail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(L))))) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

rt.type(1350, "/datum/surgery_step/attach_tail", "/datum/surgery_step", {
	name: "attach tail",
	time: 64,
	implements: null,
});

// /datum/surgery_step/attach_tail/proc/<init>  (code/modules/surgery/tail_modification.dm:67)
rt.def("/datum/surgery_step/attach_tail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/severedtail"), 100]));
	return f.dot;
});

// /datum/surgery_step/attach_tail/proc/preop  (code/modules/surgery/tail_modification.dm:71)
rt.def("/datum/surgery_step/attach_tail/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to attach a tail to ＀!", [live(user), live(target)]), fmt("<span class='notice'>You begin to attach the tail to ＀...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/attach_tail/proc/success  (code/modules/surgery/tail_modification.dm:74)  may sleep
rt.def("/datum/surgery_step/attach_tail/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let L: Value = null, _T: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, L, _T];
	L = live(target);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ gives ＀ a tail!", [live(user), live(L)]), fmt("<span class='notice'>You give ＀ a tail. It adjusts to ＀'s melanin.</span>", [live(L), live(L)])]);
	if (!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(L))), "mcolor"))) {
		rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(L))), "mcolor", rt.fv(f, "color", live(tool)));
	}
	_T = live(tool);
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(L))), "tail_lizard", rt.fv(f, "markings", live(_T)));
	rt.modField(f, rt.gv(f, "species", rt.fv(f, "dna", live(L))), "mutant_bodyparts", "tail_lizard", add);
	yield* g.call(f, P("/proc/qdel"), null, [live(tool)]);
	yield* g.callName(f, live(L), "update_mutant_bodyparts", []);
	return 1;
}, true);
