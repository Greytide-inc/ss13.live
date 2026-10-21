// From code/modules/mining/equipment/regenerative_core.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7541, "/obj/item/weapon/hivelordstabilizer", "/obj/item/weapon", {
	name: "stabilizing serum",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle19",
	desc: "Inject certain types of monster organs with this stabilizer to preserve their healing powers indefinitely.",
	w_class: 1,
	origin_tech: "biotech=3",
});

// /obj/item/weapon/hivelordstabilizer/proc/afterattack  (code/modules/mining/equipment/regenerative_core.dm:11)  may sleep
rt.def("/obj/item/weapon/hivelordstabilizer/proc/afterattack", function* afterattack(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (!truthy((rt.istype((C = live(f.args[0])), T("/obj/item/organ/regenerative_core")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The stabilizer only works on certain types of monster organs, generally regenerative in nature.</span>"]);
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.callName(f, live(C), "preserved", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You inject the ＀ with the stabilizer. It will no longer go inert.</span>", [live(f.args[0])])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(9460, "/obj/item/organ/regenerative_core", "/obj/item/organ", {
	inert: 0,
	preserved: 0,
	flags: 4,
	name: "regenerative core",
	desc: "All that remains of a hivelord. It can be used to heal completely, but it will rapidly decay into uselessness.",
	icon_state: "roro core 2",
	slot: "hivecore",
	force: 0,
	actions_types: null,
});

// /obj/item/organ/regenerative_core/proc/<init>  (code/modules/mining/equipment/regenerative_core.dm:28)
rt.def("/obj/item/organ/regenerative_core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/use")));
	return f.dot;
});

// /obj/item/organ/regenerative_core/proc/Initialize  (code/modules/mining/equipment/regenerative_core.dm:33)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/regenerative_core/proc/inert_check")])), 2400]);
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/inert_check  (code/modules/mining/equipment/regenerative_core.dm:37)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/inert_check", function* inert_check(f: Frame) {
	if (truthy(rt.sv(f, "preserved"))) return f.dot;
	yield* g.srcCall(f, "go_inert");
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/preserved  (code/modules/mining/equipment/regenerative_core.dm:43)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/preserved", function* preserved(f: Frame, implanted: Value) {
	f.vars = () => [implanted];
	if (live(implanted) === null) {
		implanted = 0;
	}
	rt.setSv(f, "inert", 0);
	rt.setSv(f, "preserved", 1);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "desc", "All that remains of a hivelord. It is preserved, allowing you to use it to heal completely without danger of decay.");
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/go_inert  (code/modules/mining/equipment/regenerative_core.dm:52)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/go_inert", function* go_inert(f: Frame) {
	rt.setSv(f, "inert", 1);
	rt.setSv(f, "name", "decayed regenerative core");
	rt.setSv(f, "desc", "All that remains of a hivelord. It has decayed, and is completely useless.");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/ui_action_click  (code/modules/mining/equipment/regenerative_core.dm:59)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (truthy(rt.sv(f, "inert"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>＀ breaks down as it tries to activate.</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, rt.sv(f, "owner"), "revive", ["full_heal", 1], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/on_life  (code/modules/mining/equipment/regenerative_core.dm:65)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/on_life", function* on_life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.lt(rt.fv(f, "health", rt.sv(f, "owner")), 0)) return f.dot;
	yield* g.srcCall(f, "ui_action_click");
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/afterattack  (code/modules/mining/equipment/regenerative_core.dm:70)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/afterattack", function* afterattack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if ((truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		H = live(f.args[0]);
		if (truthy(rt.sv(f, "inert"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ has decayed and can no longer be used to heal.</span>", [live(f.src)])]);
			return live(f.dot);
		} else {
			if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ are useless on the dead.</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (!isEqual(live(H), live(f.args[1]))) {
				yield* g.callName(f, live(H), "visible_message", [fmt("＀ forces ＀ to apply ＀... ＀ quickly regenerate all injuries!", [live(f.args[1]), live(H), live(f.src), (yield* g.callName(f, live(H), "p_they", []))])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start to smear ＀ on yourself. It feels and smells disgusting, but you feel amazingly refreshed in mere moments.</span>", [live(f.src)])]);
			}
			yield* g.callName(f, live(H), "revive", ["full_heal", 1], rt.Args.Named);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag"] });

// /obj/item/organ/regenerative_core/proc/Insert  (code/modules/mining/equipment/regenerative_core.dm:90)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!truthy(rt.sv(f, "preserved")) && !truthy(rt.sv(f, "inert")))) return f.dot;
	yield* g.srcCall(f, "preserved", 1);
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='notice'>＀ stabilizes as it's inserted.</span>", [live(f.src)])]);
	return f.dot;
}, true, { args: ["M", "special", "drop_if_replaced"] });

// /obj/item/organ/regenerative_core/proc/Remove  (code/modules/mining/equipment/regenerative_core.dm:96)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((!truthy(rt.sv(f, "inert")) && !truthy(live(f.args[1])))) {
		yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='notice'>＀ rapidly decays as it's removed.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "go_inert");
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "special"] });

// /obj/item/organ/regenerative_core/proc/prepare_eat  (code/modules/mining/equipment/regenerative_core.dm:102)
rt.def("/obj/item/organ/regenerative_core/proc/prepare_eat", function prepare_eat(f: Frame) {
	return null;
});

rt.type(9461, "/obj/item/organ/regenerative_core/legion", "/obj/item/organ/regenerative_core", {
	desc: "A strange rock that crackles with power. It can be used to heal completely, but it will rapidly decay into uselessness.",
	icon_state: "legion_soul",
});

// /obj/item/organ/regenerative_core/legion/proc/Initialize  (code/modules/mining/equipment/regenerative_core.dm:110)  may sleep
rt.def("/obj/item/organ/regenerative_core/legion/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/proc/update_icon  (code/modules/mining/equipment/regenerative_core.dm:114)  may sleep
rt.def("/obj/item/organ/regenerative_core/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	let $0: any, $e: any;
	f.vars = () => [X, A, $0, $e];
	if (truthy(rt.sv(f, "inert"))) {
		$0 = "legion_soul_inert";
	} else {
		$0 = "legion_soul";
	}
	rt.setSv(f, "icon_state", $0);
	yield* g.srcCall(f, "cut_overlays");
	if ((!truthy(rt.sv(f, "inert")) && !truthy(rt.sv(f, "preserved")))) {
		yield* g.srcCall(f, "add_overlay", "legion_soul_crackle");
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/legion/proc/go_inert  (code/modules/mining/equipment/regenerative_core.dm:123)  may sleep
rt.def("/obj/item/organ/regenerative_core/legion/proc/go_inert", function* go_inert(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", fmt("＀ has become inert. It has decayed, and is completely useless.", [live(f.src)]));
	return f.dot;
}, true);

// /obj/item/organ/regenerative_core/legion/proc/preserved  (code/modules/mining/equipment/regenerative_core.dm:127)  may sleep
rt.def("/obj/item/organ/regenerative_core/legion/proc/preserved", function* preserved(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", fmt("＀ has been stabilized. It is preserved, allowing you to use it to heal completely without danger of decay.", [live(f.src)]));
	return f.dot;
}, true, { args: ["implanted"] });
