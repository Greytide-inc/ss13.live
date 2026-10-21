// From code/modules/surgery/organs/augments_internal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9487, "/obj/item/organ/cyberimp", "/obj/item/organ", {
	implant_color: "#FFFFFF",
	implant_overlay: null,
	name: "cybernetic implant",
	desc: "a state-of-the-art implant that improves a baseline's functionality",
	status: 2,
});

// /obj/item/organ/cyberimp/proc/New  (code/modules/surgery/organs/augments_internal.dm:11)  may sleep
rt.def("/obj/item/organ/cyberimp/proc/New", function* New(f: Frame) {
	let overlay: Value = null;
	f.vars = () => [overlay];
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, live(f.src), "Insert", [live(f.args[0])]);
	}
	if (truthy(rt.sv(f, "implant_overlay"))) {
		rt.setFv(f, "color", (overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), rt.sv(f, "implant_overlay")]))), rt.sv(f, "implant_color"));
		yield* g.srcCall(f, "add_overlay", live(overlay));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(9511, "/obj/item/organ/cyberimp/brain", "/obj/item/organ/cyberimp", {
	implant_overlay: "brain_implant_overlay",
	name: "cybernetic brain implant",
	desc: "injectors of extra sub-routines for the brain",
	icon_state: "brain_implant",
	zone: "head",
	w_class: 1,
});

// /obj/item/organ/cyberimp/brain/proc/emp_act  (code/modules/surgery/organs/augments_internal.dm:32)  may sleep
rt.def("/obj/item/organ/cyberimp/brain/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let stun_amount: Value = null;
	f.vars = () => [severity, stun_amount];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	stun_amount = divide(200, live(severity));
	yield* g.callName(f, rt.sv(f, "owner"), "Stun", [live(stun_amount)]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Your body seizes up!</span>"]);
	return live(stun_amount);
}, true);

rt.type(9512, "/obj/item/organ/cyberimp/brain/anti_drop", "/obj/item/organ/cyberimp/brain", {
	active: 0,
	stored_items: null,
	implant_color: "#DE7E00",
	name: "anti-drop implant",
	desc: "This cybernetic brain implant will allow you to force your hand muscles to contract, preventing item dropping. Twitch ear to toggle.",
	slot: "brain_antidrop",
	origin_tech: "materials=4;programming=5;biotech=4",
	actions_types: null,
});

// /obj/item/organ/cyberimp/brain/anti_drop/proc/<init>  (code/modules/surgery/organs/augments_internal.dm:44)
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_items", rt.list());
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/toggle")));
	return f.dot;
});

// /obj/item/organ/cyberimp/brain/anti_drop/proc/ui_action_click  (code/modules/surgery/organs/augments_internal.dm:51)
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/ui_action_click", function ui_action_click(f: Frame) {
	let I: Value = null, L: Value = null, I_1: Value = null;
	let $e: any;
	f.vars = () => [I, L, I_1, $e];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", rt.sv(f, "owner")), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
				rt.modSrcVar(f, "stored_items", live(I), add);
			}
		}
		rt.endFor(f, 0);
		if (isEqual(rt.length((L = rt.callName(f, rt.sv(f, "owner"), "get_empty_held_indexes", []))), rt.getLen(f, rt.fv(f, "held_items", rt.sv(f, "owner"))))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You are not holding any items, your hands relax...</span>"]);
			rt.setSv(f, "active", 0);
			rt.setSv(f, "stored_items", rt.list());
		} else {
			I_1 = null;
			rt.forList(f, 0, rt.sv(f, "stored_items"), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I_1 = $e;
				rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>Your ＀'s grip tightens.</span>", [rt.callName(f, rt.sv(f, "owner"), "get_held_index_name", [rt.callName(f, rt.sv(f, "owner"), "get_held_index_of_item", [live(I_1)])])])]);
				(rt.modField(f, live(I_1), "flags", 2, rt.bitOr));
			}
			rt.endFor(f, 0);
		}
	} else {
		rt.callSrc(f, "release_items", []);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Your hands relax...</span>"]);
	}
	return f.dot;
});

// /obj/item/organ/cyberimp/brain/anti_drop/proc/emp_act  (code/modules/surgery/organs/augments_internal.dm:73)  may sleep
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/emp_act", function* emp_act(f: Frame) {
	let range: Value = null, A: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [range, A, I, $0, $e];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if (truthy(live(f.args[0]))) {
		$0 = 10;
	} else {
		$0 = 5;
	}
	range = $0;
	A = null;
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "release_items");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	I = null;
	rt.forList(f, 0, rt.sv(f, "stored_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		A = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [live(range)]))]);
		yield* g.callName(f, live(I), "throw_at", [live(A), live(range), 2]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>Your ＀ spasms and throws the ＀!</span>", [(yield* g.callName(f, rt.sv(f, "owner"), "get_held_index_name", [(yield* g.callName(f, rt.sv(f, "owner"), "get_held_index_of_item", [live(I)]))])), rt.fv(f, "name", live(I))])]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "stored_items", rt.list());
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/organ/cyberimp/brain/anti_drop/proc/release_items  (code/modules/surgery/organs/augments_internal.dm:88)
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/release_items", function release_items(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "stored_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(rt.modField(f, live(I), "flags", 16777213, rt.bitAnd));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/organ/cyberimp/brain/anti_drop/proc/Remove  (code/modules/surgery/organs/augments_internal.dm:94)  may sleep
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "ui_action_click");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9513, "/obj/item/organ/cyberimp/brain/anti_stun", "/obj/item/organ/cyberimp/brain", {
	implant_color: "#FFFF00",
	name: "CNS Rebooter implant",
	desc: "This implant will automatically give you back control over your central nervous system, reducing downtime when stunned.",
	slot: "brain_antistun",
	origin_tech: "materials=5;programming=4;biotech=5",
});

// /obj/item/organ/cyberimp/brain/anti_stun/proc/on_life  (code/modules/surgery/organs/augments_internal.dm:106)  may sleep
rt.def("/obj/item/organ/cyberimp/brain/anti_stun/proc/on_life", function* on_life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "crit_fail"))) {
		return live(f.dot);
	}
	if (rt.gt((yield* g.callName(f, rt.sv(f, "owner"), "AmountStun", [])), 40)) {
		yield* g.callName(f, rt.sv(f, "owner"), "SetStun", [40]);
	}
	if (!rt.gt((yield* g.callName(f, rt.sv(f, "owner"), "AmountKnockdown", [])), 40)) return f.dot;
	yield* g.callName(f, rt.sv(f, "owner"), "SetKnockdown", [40]);
	return f.dot;
}, true);

// /obj/item/organ/cyberimp/brain/anti_stun/proc/emp_act  (code/modules/surgery/organs/augments_internal.dm:119)  may sleep
rt.def("/obj/item/organ/cyberimp/brain/anti_stun/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy(rt.sv(f, "crit_fail"))) {
		return live(f.dot);
	}
	rt.setSv(f, "crit_fail", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/cyberimp/brain/anti_stun/proc/reboot")])), divide(90, live(f.args[0]))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(9515, "/obj/item/organ/cyberimp/mouth/breathing_tube", "/obj/item/organ/cyberimp/mouth", {
	name: "breathing tube implant",
	desc: "This simple implant adds an internals connector to your back, allowing you to use internals without a mask and protecting you from being choked.",
	icon_state: "implant_mask",
	slot: "breathing_tube",
	w_class: 1,
	origin_tech: "materials=2;biotech=3",
});

// /obj/item/organ/cyberimp/mouth/breathing_tube/proc/emp_act  (code/modules/surgery/organs/augments_internal.dm:139)
rt.def("/obj/item/organ/cyberimp/mouth/breathing_tube/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	if (!truthy(rt.op(f, "Prob", [], [divide(60, live(severity))]))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Your breathing tube suddenly closes!</span>"]);
	rt.modField(f, rt.sv(f, "owner"), "losebreath", 2, add);
	return f.dot;
});

rt.type(5440, "/obj/item/weapon/storage/box/cyber_implants", "/obj/item/weapon/storage/box", {
	amount: 5,
	boxed: null,
	name: "boxed cybernetic implants",
	desc: "A sleek, sturdy box.",
	icon_state: "cyber_implants",
});

// /obj/item/weapon/storage/box/cyber_implants/proc/<init>  (code/modules/surgery/organs/augments_internal.dm:151)
rt.def("/obj/item/weapon/storage/box/cyber_implants/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boxed", rt.list(T("/obj/item/device/autosurgeon/thermal_eyes"), T("/obj/item/device/autosurgeon/xray_eyes"), T("/obj/item/device/autosurgeon/anti_stun"), T("/obj/item/device/autosurgeon/reviver")));
	return f.dot;
});

// /obj/item/weapon/storage/box/cyber_implants/proc/PopulateContents  (code/modules/surgery/organs/augments_internal.dm:160)  may sleep
rt.def("/obj/item/weapon/storage/box/cyber_implants/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let implant: Value = null;
	f.vars = () => [implant];
	implant = null;
	while (rt.le(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "amount"))) {
		implant = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "boxed")]);
		yield* g.new_(f, live(implant), [live(f.src)]);
	}
	return f.dot;
}, true);
