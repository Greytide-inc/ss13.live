// From code/modules/surgery/generic_steps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1334, "/datum/surgery_step/incise", "/datum/surgery_step", {
	name: "make incision",
	implements: null,
	time: 16,
});

// /datum/surgery_step/incise/proc/<init>  (code/modules/surgery/generic_steps.dm:5)
rt.def("/datum/surgery_step/incise/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/melee/energy/sword"), 75, T("/obj/item/weapon/kitchen/knife"), 65, T("/obj/item/weapon/shard"), 45, T("/obj/item"), 30]));
	return f.dot;
});

// /datum/surgery_step/incise/proc/preop  (code/modules/surgery/generic_steps.dm:10)
rt.def("/datum/surgery_step/incise/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to make an incision in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to make an incision in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/incise/proc/tool_check  (code/modules/surgery/generic_steps.dm:14)
rt.def("/datum/surgery_step/incise/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	if ((isEqual(rt.sv(f, "implement_type"), T("/obj/item")) && !truthy(rt.callName(f, live(tool), "is_sharp", [])))) {
		return 0;
	}
	return 1;
});

rt.type(1335, "/datum/surgery_step/clamp_bleeders", "/datum/surgery_step", {
	name: "clamp bleeders",
	implements: null,
	time: 24,
});

// /datum/surgery_step/clamp_bleeders/proc/<init>  (code/modules/surgery/generic_steps.dm:22)
rt.def("/datum/surgery_step/clamp_bleeders/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/wirecutters"), 60, T("/obj/item/stack/packageWrap"), 35, T("/obj/item/stack/cable_coil"), 15]));
	return f.dot;
});

// /datum/surgery_step/clamp_bleeders/proc/preop  (code/modules/surgery/generic_steps.dm:26)
rt.def("/datum/surgery_step/clamp_bleeders/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to clamp bleeders in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to clamp bleeders in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/clamp_bleeders/proc/success  (code/modules/surgery/generic_steps.dm:30)  may sleep
rt.def("/datum/surgery_step/clamp_bleeders/proc/success", function* success(f: Frame) {
	if (truthy(rt.locateIn(f, T("/datum/surgery_step/saw"), rt.fv(f, "steps", live(f.args[4]))))) {
		yield* g.callName(f, live(f.args[1]), "heal_bodypart_damage", [20, 0]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "target", "target_zone", "tool", "surgery"] });

rt.type(1336, "/datum/surgery_step/retract_skin", "/datum/surgery_step", {
	name: "retract skin",
	implements: null,
	time: 24,
});

// /datum/surgery_step/retract_skin/proc/<init>  (code/modules/surgery/generic_steps.dm:38)
rt.def("/datum/surgery_step/retract_skin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/retractor"), 100, T("/obj/item/weapon/screwdriver"), 45, T("/obj/item/weapon/wirecutters"), 35]));
	return f.dot;
});

// /datum/surgery_step/retract_skin/proc/preop  (code/modules/surgery/generic_steps.dm:42)
rt.def("/datum/surgery_step/retract_skin/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to retract the skin in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to retract the skin in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

rt.type(1337, "/datum/surgery_step/close", "/datum/surgery_step", {
	name: "mend incision",
	implements: null,
	time: 24,
});

// /datum/surgery_step/close/proc/<init>  (code/modules/surgery/generic_steps.dm:50)
rt.def("/datum/surgery_step/close/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/cautery"), 100, T("/obj/item/weapon/gun/energy/laser"), 90, T("/obj/item/weapon/weldingtool"), 70, T("/obj/item/weapon/lighter"), 45, T("/obj/item/weapon/match"), 20]));
	return f.dot;
});

// /datum/surgery_step/close/proc/preop  (code/modules/surgery/generic_steps.dm:55)
rt.def("/datum/surgery_step/close/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to mend the incision in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to mend the incision in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/close/proc/tool_check  (code/modules/surgery/generic_steps.dm:60)
rt.def("/datum/surgery_step/close/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	let WT: Value = null, L: Value = null, M: Value = null;
	f.vars = () => [WT, L, M];
	if (truthy((rt.istype(live(tool), T("/obj/item/weapon/cautery")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(tool), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy(rt.callName(f, (WT = live(tool)), "isOn", []))) {
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(tool), T("/obj/item/weapon/lighter")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "lit", (L = live(tool))))) {
				return 1;
			}
		} else {
			if (truthy((rt.istype(live(tool), T("/obj/item/weapon/match")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "lit", (M = live(tool))))) {
					return 1;
				}
			}
		}
	}
	return 0;
});

// /datum/surgery_step/close/proc/success  (code/modules/surgery/generic_steps.dm:81)  may sleep
rt.def("/datum/surgery_step/close/proc/success", function* success(f: Frame) {
	if (truthy(rt.locateIn(f, T("/datum/surgery_step/saw"), rt.fv(f, "steps", live(f.args[4]))))) {
		yield* g.callName(f, live(f.args[1]), "heal_bodypart_damage", [45, 0]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "target", "target_zone", "tool", "surgery"] });

rt.type(1338, "/datum/surgery_step/saw", "/datum/surgery_step", {
	name: "saw bone",
	implements: null,
	time: 54,
});

// /datum/surgery_step/saw/proc/<init>  (code/modules/surgery/generic_steps.dm:90)
rt.def("/datum/surgery_step/saw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/melee/arm_blade"), 75, T("/obj/item/weapon/mounted_chainsaw"), 65, T("/obj/item/weapon/twohanded/required/chainsaw"), 50, T("/obj/item/weapon/twohanded/fireaxe"), 50, T("/obj/item/weapon/hatchet"), 35, T("/obj/item/weapon/kitchen/knife/butcher"), 25]));
	return f.dot;
});

// /datum/surgery_step/saw/proc/preop  (code/modules/surgery/generic_steps.dm:96)
rt.def("/datum/surgery_step/saw/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to saw through the bone in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to saw through the bone in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/saw/proc/success  (code/modules/surgery/generic_steps.dm:100)  may sleep
rt.def("/datum/surgery_step/saw/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	f.vars = () => [user, target, target_zone, tool, surgery];
	yield* g.callName(f, live(target), "apply_damage", [50, "brute", fmt("＀", [live(target_zone)])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ saws ＀'s ＀ open!", [live(user), live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You saw ＀'s ＀ open.</span>", [live(target), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
	return 1;
}, true);

rt.type(1339, "/datum/surgery_step/drill", "/datum/surgery_step", {
	name: "drill bone",
	implements: null,
	time: 30,
});

// /datum/surgery_step/drill/proc/<init>  (code/modules/surgery/generic_steps.dm:108)
rt.def("/datum/surgery_step/drill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/surgicaldrill"), 100, T("/obj/item/weapon/pickaxe/drill"), 60, T("/obj/item/mecha_parts/mecha_equipment/drill"), 60, T("/obj/item/weapon/screwdriver"), 20]));
	return f.dot;
});

// /datum/surgery_step/drill/proc/preop  (code/modules/surgery/generic_steps.dm:112)
rt.def("/datum/surgery_step/drill/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to drill into the bone in ＀'s ＀.", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to drill into the bone in ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/drill/proc/success  (code/modules/surgery/generic_steps.dm:116)
rt.def("/datum/surgery_step/drill/proc/success", function success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ drills into ＀'s ＀!", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You drill into ＀'s ＀.</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return 1;
});
