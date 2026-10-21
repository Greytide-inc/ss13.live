// From code/modules/surgery/amputation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1310, "/datum/surgery/amputation", "/datum/surgery", {
	name: "amputation",
	steps: null,
	possible_locs: null,
	requires_organic_bodypart: 0,
	species: null,
});

// /datum/surgery/amputation/proc/<init>  (code/modules/surgery/amputation.dm:4)
rt.def("/datum/surgery/amputation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/saw"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/sever_limb")));
	rt.setSv(f, "possible_locs", rt.list("r_arm", "l_arm", "l_leg", "r_leg", "head"));
	$0 = $0;
	rt.setSv(f, "species", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

rt.type(1329, "/datum/surgery_step/sever_limb", "/datum/surgery_step", {
	name: "sever limb",
	implements: null,
	time: 64,
});

// /datum/surgery_step/sever_limb/proc/<init>  (code/modules/surgery/amputation.dm:12)
rt.def("/datum/surgery_step/sever_limb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/melee/arm_blade"), 80, T("/obj/item/weapon/twohanded/required/chainsaw"), 80, T("/obj/item/weapon/mounted_chainsaw"), 80, T("/obj/item/weapon/twohanded/fireaxe"), 50, T("/obj/item/weapon/hatchet"), 40, T("/obj/item/weapon/kitchen/knife/butcher"), 25]));
	return f.dot;
});

// /datum/surgery_step/sever_limb/proc/preop  (code/modules/surgery/amputation.dm:16)
rt.def("/datum/surgery_step/sever_limb/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ begins to sever ＀'s ＀!", [live(user), live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])]), fmt("<span class='notice'>You begin to sever ＀'s ＀...</span>", [live(target), rt.call(f, P("/proc/parse_zone"), null, [live(target_zone)])])]);
	return f.dot;
});

// /datum/surgery_step/sever_limb/proc/success  (code/modules/surgery/amputation.dm:19)  may sleep
rt.def("/datum/surgery_step/sever_limb/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let L: Value = null, target_limb: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, L, target_limb];
	L = live(target);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ severs ＀'s ＀!", [live(user), live(L), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))]), fmt("<span class='notice'>You sever ＀'s ＀.</span>", [live(L), (yield* g.call(f, P("/proc/parse_zone"), null, [live(target_zone)]))])]);
	if (truthy(rt.fv(f, "operated_bodypart", live(surgery)))) {
		yield* g.callName(f, (target_limb = rt.fv(f, "operated_bodypart", live(surgery))), "drop_limb", []);
	}
	return 1;
}, true);
