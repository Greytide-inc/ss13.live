// From code/modules/surgery/organ_manipulation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1318, "/datum/surgery/organ_manipulation", "/datum/surgery", {
	name: "organ manipulation",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	requires_real_bodypart: 1,
	species: null,
});

// /datum/surgery/organ_manipulation/proc/<init>  (code/modules/surgery/organ_manipulation.dm:3)
rt.def("/datum/surgery/organ_manipulation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/manipulate_organs")));
	rt.setSv(f, "possible_locs", rt.list("chest", "head"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

rt.type(1319, "/datum/surgery/organ_manipulation/soft", "/datum/surgery/organ_manipulation", {
	possible_locs: null,
	steps: null,
});

// /datum/surgery/organ_manipulation/soft/proc/<init>  (code/modules/surgery/organ_manipulation.dm:12)
rt.def("/datum/surgery/organ_manipulation/soft/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_locs", rt.list("groin", "eyes", "mouth", "l_arm", "r_arm"));
	$0 = $0;
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/manipulate_organs")));
	return f.dot;
});

rt.type(1320, "/datum/surgery/organ_manipulation/alien", "/datum/surgery/organ_manipulation", {
	name: "alien organ manipulation",
	possible_locs: null,
	steps: null,
	species: null,
});

// /datum/surgery/organ_manipulation/alien/proc/<init>  (code/modules/surgery/organ_manipulation.dm:19)
rt.def("/datum/surgery/organ_manipulation/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_locs", rt.list("chest", "head", "groin", "eyes", "mouth", "l_arm", "r_arm"));
	$0 = $0;
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/saw"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/manipulate_organs")));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/alien/humanoid")));
	return f.dot;
});

rt.type(1345, "/datum/surgery_step/manipulate_organs", "/datum/surgery_step", {
	current_type: null,
	I: null,
	implements_extract: null,
	implements_mend: null,
	time: 64,
	name: "manipulate organs",
	implements: null,
});

// /datum/surgery_step/manipulate_organs/proc/<init>  (code/modules/surgery/organ_manipulation.dm:27)
rt.def("/datum/surgery_step/manipulate_organs/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/organ"), 100, T("/obj/item/weapon/reagent_containers/food/snacks/organ"), 0, T("/obj/item/weapon/organ_storage"), 100]));
	$0 = $0;
	rt.setSv(f, "implements_extract", rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/crowbar"), 55]));
	$0 = $0;
	rt.setSv(f, "implements_mend", rt.alist(f, [T("/obj/item/weapon/cautery"), 100, T("/obj/item/weapon/weldingtool"), 70, T("/obj/item/weapon/lighter"), 45, T("/obj/item/weapon/match"), 20]));
	return f.dot;
});

// /datum/surgery_step/manipulate_organs/proc/New  (code/modules/surgery/organ_manipulation.dm:34)
rt.def("/datum/surgery_step/manipulate_organs/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "implements", add(add(rt.sv(f, "implements"), rt.sv(f, "implements_extract")), rt.sv(f, "implements_mend")));
	return f.dot;
});

// /datum/surgery_step/manipulate_organs/proc/tool_check  (code/modules/surgery/organ_manipulation.dm:38)
rt.def("/datum/surgery_step/manipulate_organs/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	let WT: Value = null, L: Value = null, M: Value = null;
	f.vars = () => [WT, L, M];
	if (truthy((rt.istype(live(tool), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (!truthy(rt.callName(f, (WT = live(tool)), "isOn", []))) {
			return 0;
		}
	} else {
		if (truthy((rt.istype(live(tool), T("/obj/item/weapon/lighter")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "lit", (L = live(tool))))) {
				return 0;
			}
		} else {
			if (truthy((rt.istype(live(tool), T("/obj/item/weapon/match")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "lit", (M = live(tool))))) {
					return 0;
				}
			}
		}
	}
	return 1;
});

// /datum/surgery_step/manipulate_organs/proc/preop  (code/modules/surgery/organ_manipulation.dm:58)  may sleep
rt.def("/datum/surgery_step/manipulate_organs/proc/preop", function* preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let organs: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [user, target, target_zone, tool, surgery, organs, O, $e];
	rt.setSv(f, "I", null);
	if (truthy((rt.istype(live(tool), T("/obj/item/weapon/organ_storage")) ? 1 : 0))) {
		if (!truthy(rt.getLen(f, rt.fv(f, "contents", live(tool))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There is nothing inside ＀!</span>", [live(tool)])]);
			return -1;
		}
		rt.setSv(f, "I", rt.index(rt.fv(f, "contents", live(tool)), 1));
		if (!truthy((rt.istype(rt.sv(f, "I"), T("/obj/item/organ")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You cannot put ＀ into ＀'s ＀!</span>", [rt.sv(f, "I"), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
			return -1;
		}
		tool = rt.sv(f, "I");
	}
	if (truthy((rt.istype(live(tool), T("/obj/item/organ")) ? 1 : 0))) {
		rt.setSv(f, "current_type", "insert");
		rt.setSv(f, "I", live(tool));
		if ((!isEqual(live(target_zone), rt.fv(f, "zone", rt.sv(f, "I"))) || truthy((yield* g.callName(f, live(target), "getorganslot", [rt.fv(f, "slot", rt.sv(f, "I"))]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There is no room for ＀ in ＀'s ＀!</span>", [rt.sv(f, "I"), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
			return -1;
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to insert ＀ into ＀'s ＀.", [live(user), live(tool), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You begin to insert ＀ into ＀'s ＀...</span>", [live(tool), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
	} else {
		if (truthy((rt.isIn(f, rt.sv(f, "implement_type"), rt.sv(f, "implements_extract")) ? 1 : 0))) {
			rt.setSv(f, "current_type", "extract");
			if (!truthy(rt.getLen(f, (organs = (yield* g.callName(f, live(target), "getorganszone", [live(target_zone)])))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There are no removeable organs in ＀'s ＀!</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
				return -1;
			} else {
				O = null;
				rt.forList(f, 0, live(organs), T("/obj/item/organ"));
				while (($e = rt.next(f, 0)) !== undefined) {
					O = $e;
					yield* g.callName(f, live(O), "on_find", [live(user)]);
					(organs = rt.modify(live(organs), live(O), subtract));
					rt.setAt(live(organs), rt.fv(f, "name", live(O)), live(O));
				}
				rt.endFor(f, 0);
				rt.setSv(f, "I", (yield* g.op(f, "Prompt", [1], [null, null, "Surgery", "Remove which organ?", live(organs)])));
				if (((((truthy(rt.sv(f, "I")) && truthy(live(user))) && truthy(live(target))) && truthy((yield* g.callName(f, live(user), "Adjacent", [live(target)])))) && isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(tool)))) {
					rt.setSv(f, "I", rt.index(live(organs), rt.sv(f, "I")));
					if (!truthy(rt.sv(f, "I"))) {
						return -1;
					}
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to extract ＀ from ＀'s ＀.", [live(user), rt.sv(f, "I"), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You begin to extract ＀ from ＀'s ＀...</span>", [rt.sv(f, "I"), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
				} else {
					return -1;
				}
			}
		} else {
			if (truthy((rt.isIn(f, rt.sv(f, "implement_type"), rt.sv(f, "implements_mend")) ? 1 : 0))) {
				rt.setSv(f, "current_type", "mend");
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to mend the incision in ＀'s ＀.", [live(user), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You begin to mend the incision in ＀'s ＀...</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
			} else {
				if (!truthy((rt.istype(live(tool), T("/obj/item/weapon/reagent_containers/food/snacks/organ")) ? 1 : 0))) return f.dot;
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ was bitten by someone! It's too damaged to use!</span>", [live(tool)])]);
				return -1;
			}
		}
	}
	return f.dot;
}, true);

// /datum/surgery_step/manipulate_organs/proc/success  (code/modules/surgery/organ_manipulation.dm:108)  may sleep
rt.def("/datum/surgery_step/manipulate_organs/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	f.vars = () => [user, target, target_zone, tool, surgery];
	if (isEqual(rt.sv(f, "current_type"), "mend")) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ mends the incision in ＀'s ＀.", [live(user), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You mend the incision in ＀'s ＀.</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
		if (truthy(rt.locateIn(f, T("/datum/surgery_step/saw"), rt.fv(f, "steps", live(surgery))))) {
			yield* g.callName(f, live(target), "heal_bodypart_damage", [45, 0]);
		}
		return 1;
	} else {
		if (isEqual(rt.sv(f, "current_type"), "insert")) {
			if (truthy((rt.istype(live(tool), T("/obj/item/weapon/organ_storage")) ? 1 : 0))) {
				rt.setSv(f, "I", rt.index(rt.fv(f, "contents", live(tool)), 1));
				rt.setFv(f, "icon_state", live(tool), "evidenceobj");
				rt.setFv(f, "desc", live(tool), "A container for holding body parts.");
				yield* g.callName(f, live(tool), "cut_overlays", []);
				tool = rt.sv(f, "I");
			} else {
				rt.setSv(f, "I", live(tool));
			}
			yield* g.callName(f, live(user), "drop_item", []);
			yield* g.callName(f, rt.sv(f, "I"), "Insert", [live(target)]);
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ inserts ＀ into ＀'s ＀!", [live(user), live(tool), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You insert ＀ into ＀'s ＀.</span>", [live(tool), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
		} else {
			if (isEqual(rt.sv(f, "current_type"), "extract")) {
				if ((truthy(rt.sv(f, "I")) && isEqual(rt.fv(f, "owner", rt.sv(f, "I")), live(target)))) {
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ successfully extracts ＀ from ＀'s ＀!", [live(user), rt.sv(f, "I"), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You successfully extract ＀ from ＀'s ＀.</span>", [rt.sv(f, "I"), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
					yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(target), null, fmt("surgically removed ＀ from", [rt.fv(f, "name", rt.sv(f, "I"))]), "addition", fmt("INTENT: ＀", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))]))])], rt.Args.Named);
					yield* g.callName(f, rt.sv(f, "I"), "Remove", [live(target)]);
					rt.setFv(f, "loc", rt.sv(f, "I"), rt.getStep(f, live(target), 0));
				} else {
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ can't seem to extract anything from ＀'s ＀!", [live(user), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You can't extract anything from ＀'s ＀!</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
				}
			}
		}
	}
	return 0;
}, true);
