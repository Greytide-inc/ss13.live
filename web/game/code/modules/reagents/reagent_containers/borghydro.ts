// From code/modules/reagents/reagent_containers/borghydro.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6508, "/obj/item/weapon/reagent_containers/borghypo", "/obj/item/weapon/reagent_containers", {
	mode: 1,
	charge_cost: 50,
	charge_tick: 0,
	recharge_time: 5,
	bypass_protection: 0,
	reagent_list: null,
	reagent_ids: null,
	accepts_reagent_upgrades: 1,
	modes: null,
	amount_per_transfer_from_this: 5,
	volume: 30,
	possible_transfer_amounts: null,
	name: "cyborg hypospray",
	desc: "An advanced chemical synthesizer and injection system, designed for heavy-duty medical equipment.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "hypo",
	icon_state: "borghypo",
});

// /obj/item/weapon/reagent_containers/borghypo/proc/<init>  (code/modules/reagents/reagent_containers/borghydro.dm:19)
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	$0 = $0;
	rt.setSv(f, "reagent_list", rt.list());
	rt.setSv(f, "reagent_ids", rt.list("dexalin", "kelotane", "bicaridine", "antitoxin", "epinephrine", "spaceacillin", "salglu_solution"));
	$0 = $0;
	rt.setSv(f, "modes", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/borghypo/proc/Initialize  (code/modules/reagents/reagent_containers/borghydro.dm:34)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/Initialize", function* Initialize(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	R = null;
	rt.forList(f, 0, rt.sv(f, "reagent_ids"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.srcCall(f, "add_reagent", live(R));
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/borghypo/proc/Destroy  (code/modules/reagents/reagent_containers/borghydro.dm:43)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/reagent_containers/borghypo/proc/process  (code/modules/reagents/reagent_containers/borghydro.dm:48)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/process", function* process(f: Frame) {
	rt.incSrcVar(f, "charge_tick", 1, true);
	if (rt.ge(rt.sv(f, "charge_tick"), rt.sv(f, "recharge_time"))) {
		yield* g.srcCall(f, "regenerate_reagents");
		rt.setSv(f, "charge_tick", 0);
	}
	return 1;
}, true, { waitfor: false });

// /obj/item/weapon/reagent_containers/borghypo/proc/add_reagent  (code/modules/reagents/reagent_containers/borghydro.dm:66)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/add_reagent", function* add_reagent(f: Frame, reagent: Value) {
	let RG: Value = null, R: Value = null;
	f.vars = () => [reagent, RG, R];
	(rt.modSrcVar(f, "reagent_ids", live(reagent), rt.bitOr));
	rt.setFv(f, "my_atom", (RG = (yield* g.new_(f, T("/datum/reagents"), [30]))), live(f.src));
	rt.modSrcVar(f, "reagent_list", live(RG), add);
	yield* g.callName(f, (R = rt.index(rt.sv(f, "reagent_list"), rt.len(f, rt.sv(f, "reagent_list")))), "add_reagent", [live(reagent), 30]);
	rt.setAt(rt.sv(f, "modes"), live(reagent), add(rt.len(f, rt.sv(f, "modes")), 1));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/borghypo/proc/regenerate_reagents  (code/modules/reagents/reagent_containers/borghydro.dm:77)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/regenerate_reagents", function* regenerate_reagents(f: Frame) {
	let R: Value = null, i: Value = null, RG: Value = null;
	let $e: any;
	f.vars = () => [R, i, RG, $e];
	if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
	if (!(truthy((R = rt.fv(f, "loc", live(f.src)))) && truthy(rt.fv(f, "cell", live(R))))) return f.dot;
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "reagent_ids")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.lt(rt.gv(f, "total_volume", (RG = rt.index(rt.sv(f, "reagent_list"), live(i)))), rt.fv(f, "maximum_volume", live(RG)))) {
			yield* g.callName(f, rt.fv(f, "cell", live(R)), "use", [rt.sv(f, "charge_cost")]);
			yield* g.callName(f, live(RG), "add_reagent", [rt.index(rt.sv(f, "reagent_ids"), live(i)), 5]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/borghypo/proc/attack  (code/modules/reagents/reagent_containers/borghydro.dm:87)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null, fraction: Value = null, trans: Value = null, injected: Value = null, RG: Value = null;
	let $e: any;
	f.vars = () => [M, user, R, fraction, trans, injected, RG, $e];
	if (!truthy(rt.gv(f, "total_volume", (R = rt.index(rt.sv(f, "reagent_list"), rt.sv(f, "mode")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The injector is empty.</span>"]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "total_volume", live(R))) && truthy((yield* g.callName(f, live(M), "can_inject", [live(user), 1, rt.fv(f, "zone_selected", live(user)), rt.sv(f, "bypass_protection")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You feel a tiny prick!</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You inject ＀ with the injector.</span>", [live(M)])]);
		fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "amount_per_transfer_from_this"), rt.fv(f, "total_volume", live(R))), 1]));
		yield* g.callName(f, live(R), "reaction", [live(M), 5, live(fraction)]);
		if (truthy(rt.fv(f, "reagents", live(M)))) {
			trans = (yield* g.callName(f, live(R), "trans_to", [live(M), rt.sv(f, "amount_per_transfer_from_this")]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ unit５ injected.  ＀ unit５ remaining.</span>", [live(trans), rt.fv(f, "total_volume", live(R))])]);
		}
	}
	injected = rt.list();
	RG = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", live(R)), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RG = $e;
		injected = rt.modify(live(injected), rt.fv(f, "name", live(RG)), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "injected", live(f.src), fmt("(CHEMICALS: ＀)", [(yield* g.call(f, P("/proc/english_list"), null, [live(injected)]))])]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/borghypo/proc/attack_self  (code/modules/reagents/reagent_containers/borghydro.dm:108)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let chosen_reagent: Value = null, R: Value = null;
	f.vars = () => [user, chosen_reagent, R];
	if (!truthy((chosen_reagent = rt.index(rt.sv(f, "modes"), (yield* g.op(f, "Prompt", [1], [null, null, "What reagent do you want to dispense?", live(user), rt.sv(f, "reagent_ids")])))))) {
		return live(f.dot);
	}
	rt.setSv(f, "mode", live(chosen_reagent));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
	R = rt.index(rt.gl("chemical_reagents_list"), rt.index(rt.sv(f, "reagent_ids"), rt.sv(f, "mode")));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is now dispensing '＀'.</span>", [live(f.src), rt.fv(f, "name", live(R))])]);
	return live(f.dot);
}, true);

// /obj/item/weapon/reagent_containers/borghypo/proc/examine  (code/modules/reagents/reagent_containers/borghydro.dm:118)
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/examine", function examine(f: Frame) {
	f.usr = live(f.args[0]);
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "DescribeContents", []);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/reagent_containers/borghypo/proc/DescribeContents  (code/modules/reagents/reagent_containers/borghydro.dm:125)
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/DescribeContents", function DescribeContents(f: Frame) {
	let empty: Value = null, RS: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [empty, RS, R, $e];
	empty = 1;
	RS = null;
	rt.forList(f, 0, rt.sv(f, "reagent_list"), T("/datum/reagents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RS = $e;
		if (truthy((R = rt.locateIn(f, T("/datum/reagent"), rt.fv(f, "reagent_list", live(RS)))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>It currently has ＀ unit５ of ＀ stored.</span>", [rt.fv(f, "volume", live(R)), rt.fv(f, "name", live(R))])]);
			empty = 0;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(empty))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It is currently empty! Allow some time for the internal syntheszier to produce more.</span>"]);
	return f.dot;
});

rt.type(6511, "/obj/item/weapon/reagent_containers/borghypo/borgshaker", "/obj/item/weapon/reagent_containers/borghypo", {
	possible_transfer_amounts: null,
	charge_cost: 20,
	recharge_time: 3,
	accepts_reagent_upgrades: 0,
	reagent_ids: null,
	name: "cyborg shaker",
	desc: "An advanced drink synthesizer and mixer.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "shaker",
});

// /obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/regenerate_reagents  (code/modules/reagents/reagent_containers/borghydro.dm:168)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/regenerate_reagents", function* regenerate_reagents(f: Frame) {
	let R: Value = null, i: Value = null, valueofi: Value = null, RG: Value = null;
	let $e: any;
	f.vars = () => [R, i, valueofi, RG, $e];
	if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
	if (!(truthy((R = rt.fv(f, "loc", live(f.src)))) && truthy(rt.fv(f, "cell", live(R))))) return f.dot;
	i = null;
	rt.forList(f, 0, rt.sv(f, "modes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		valueofi = rt.index(rt.sv(f, "modes"), live(i));
		if (rt.lt(rt.gv(f, "total_volume", (RG = rt.index(rt.sv(f, "reagent_list"), live(valueofi)))), rt.fv(f, "maximum_volume", live(RG)))) {
			yield* g.callName(f, rt.fv(f, "cell", live(R)), "use", [rt.sv(f, "charge_cost")]);
			yield* g.callName(f, live(RG), "add_reagent", [rt.index(rt.sv(f, "reagent_ids"), live(valueofi)), 5]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/afterattack  (code/modules/reagents/reagent_containers/borghydro.dm:179)  may sleep
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let R: Value = null, trans: Value = null;
	f.vars = () => [target, user, proximity, R, trans];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	} else {
		if (!(truthy((yield* g.callName(f, live(target), "is_open_container", []))) && truthy(rt.fv(f, "reagents", live(target))))) return f.dot;
		if (!truthy(rt.gv(f, "total_volume", (R = rt.index(rt.sv(f, "reagent_list"), rt.sv(f, "mode")))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is currently out of this ingredient! Please allow some time for the synthesizer to produce more.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is full.</span>", [live(target)])]);
			return live(f.dot);
		}
		trans = (yield* g.callName(f, live(R), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You transfer ＀ unit５ of the solution to ＀.</span>", [live(trans), live(target)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/DescribeContents  (code/modules/reagents/reagent_containers/borghydro.dm:197)
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/DescribeContents", function DescribeContents(f: Frame) {
	let empty: Value = null, RS: Value = null, R: Value = null;
	f.vars = () => [empty, RS, R];
	empty = 1;
	RS = rt.index(rt.sv(f, "reagent_list"), rt.sv(f, "mode"));
	if (truthy((R = rt.locateIn(f, T("/datum/reagent"), rt.fv(f, "reagent_list", live(RS)))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>It currently has ＀ unit５ of ＀ stored.</span>", [rt.fv(f, "volume", live(R)), rt.fv(f, "name", live(R))])]);
		empty = 0;
	}
	if (!truthy(live(empty))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It is currently empty! Please allow some time for the synthesizer to produce more.</span>"]);
	return f.dot;
});

rt.type(6512, "/obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked", "/obj/item/weapon/reagent_containers/borghypo/borgshaker", {
	possible_transfer_amounts: null,
	charge_cost: 20,
	recharge_time: 3,
	accepts_reagent_upgrades: 0,
	reagent_ids: null,
	name: "cyborg shaker",
	desc: "Will mix drinks that knock them dead.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "threemileislandglass",
});

// /obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked/proc/<init>  (code/modules/reagents/reagent_containers/borghydro.dm:217)
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 20));
	$0 = $0;
	rt.setSv(f, "reagent_ids", rt.list("beer2"));
	return f.dot;
});

rt.type(6515, "/obj/item/weapon/reagent_containers/borghypo/epi", "/obj/item/weapon/reagent_containers/borghypo", {
	reagent_ids: null,
	accepts_reagent_upgrades: 0,
	name: "epinephrine injector",
	desc: "An advanced chemical synthesizer and injection system, designed to stabilize patients..",
});

// /obj/item/weapon/reagent_containers/borghypo/epi/proc/<init>  (code/modules/reagents/reagent_containers/borghydro.dm:234)
rt.def("/obj/item/weapon/reagent_containers/borghypo/epi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_ids", rt.list("epinephrine"));
	return f.dot;
});
