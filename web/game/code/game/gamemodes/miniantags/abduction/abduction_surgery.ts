// From code/game/gamemodes/miniantags/abduction/abduction_surgery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1309, "/datum/surgery/organ_extraction", "/datum/surgery", {
	name: "experimental dissection",
	steps: null,
	possible_locs: null,
	ignore_clothes: 1,
});

// /datum/surgery/organ_extraction/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:3)
rt.def("/datum/surgery/organ_extraction/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/incise"), T("/datum/surgery_step/extract_organ"), T("/datum/surgery_step/gland_insert")));
	$0 = $0;
	rt.setSv(f, "possible_locs", rt.list("chest"));
	return f.dot;
});

// /datum/surgery/organ_extraction/proc/can_start  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:8)
rt.def("/datum/surgery/organ_extraction/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let H: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [H, A, $e];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (H = live(user))))), "abductor")) {
		return 1;
	}
	A = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(H)), T("/obj/item/weapon/implant/abductor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		return 1;
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(1327, "/datum/surgery_step/extract_organ", "/datum/surgery_step", {
	IC: null,
	organ_types: null,
	name: "remove heart",
	accept_hand: 1,
	time: 32,
});

// /datum/surgery_step/extract_organ/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:23)
rt.def("/datum/surgery_step/extract_organ/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "organ_types", rt.list(T("/obj/item/organ/heart")));
	return f.dot;
});

// /datum/surgery_step/extract_organ/proc/preop  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:26)
rt.def("/datum/surgery_step/extract_organ/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.fv(f, "internal_organs", live(target)), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.isIn(f, rt.fv(f, "type", live(A)), rt.sv(f, "organ_types")) ? 1 : 0))) {
			rt.setSv(f, "IC", live(A));
			break;
		}
	}
	rt.endFor(f, 0);
	rt.callName(f, live(user), "visible_message", [fmt("＀ starts to remove ＀'s organs.", [live(user), live(target)]), fmt("<span class='notice'>You start to remove ＀'s organs...</span>", [live(target)])]);
	return f.dot;
});

// /datum/surgery_step/extract_organ/proc/success  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:34)  may sleep
rt.def("/datum/surgery_step/extract_organ/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	f.vars = () => [user, target, target_zone, tool, surgery];
	if (truthy(rt.sv(f, "IC"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ pulls ＀ out of ＀'s ＀!", [live(user), rt.sv(f, "IC"), live(target), live(target_zone)]), fmt("<span class='notice'>You pull ＀ out of ＀'s ＀.</span>", [rt.sv(f, "IC"), live(target), live(target_zone)])]);
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "IC")]);
		yield* g.callName(f, rt.sv(f, "IC"), "Remove", [live(target)]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't find anything in ＀'s ＀!</span>", [live(target), live(target_zone)])]);
		return 1;
	}
	return f.dot;
}, true);

rt.type(1328, "/datum/surgery_step/gland_insert", "/datum/surgery_step", {
	name: "insert gland",
	implements: null,
	time: 32,
});

// /datum/surgery_step/gland_insert/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:44)
rt.def("/datum/surgery_step/gland_insert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implements", rt.alist(f, [T("/obj/item/organ/heart/gland"), 100]));
	return f.dot;
});

// /datum/surgery_step/gland_insert/proc/preop  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:48)
rt.def("/datum/surgery_step/gland_insert/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("＀ starts to insert ＀ into ＀.", [live(user), live(tool), live(target)]), fmt("<span class ='notice'>You start to insert ＀ into ＀...</span>", [live(tool), live(target)])]);
	return f.dot;
});

// /datum/surgery_step/gland_insert/proc/success  (code/game/gamemodes/miniantags/abduction/abduction_surgery.dm:51)  may sleep
rt.def("/datum/surgery_step/gland_insert/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let gland: Value = null;
	f.vars = () => [user, target, target_zone, tool, surgery, gland];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ inserts ＀ into ＀.", [live(user), live(tool), live(target)]), fmt("<span class ='notice'>You insert ＀ into ＀.</span>", [live(tool), live(target)])]);
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.callName(f, (gland = live(tool)), "Insert", [live(target), 2]);
	return 1;
}, true);
