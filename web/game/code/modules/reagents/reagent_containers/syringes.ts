// From code/modules/reagents/reagent_containers/syringes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6546, "/obj/item/weapon/reagent_containers/syringe", "/obj/item/weapon/reagent_containers", {
	mode: 0,
	busy: 0,
	proj_piercing: 0,
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 15,
	container_type: 8192,
	name: "syringe",
	desc: "A syringe that can hold up to 15 units.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "syringe_0",
	icon_state: "0",
	materials: null,
});

// /obj/item/weapon/reagent_containers/syringe/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:11)
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 20]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/syringe/proc/Initialize  (code/modules/reagents/reagent_containers/syringes.dm:20)  may sleep
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "list_reagents"))) return f.dot;
	rt.setSv(f, "mode", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/syringe/proc/on_reagent_change  (code/modules/reagents/reagent_containers/syringes.dm:26)
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/syringe/proc/pickup  (code/modules/reagents/reagent_containers/syringes.dm:29)
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/pickup", function pickup(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/reagent_containers/syringe/proc/dropped  (code/modules/reagents/reagent_containers/syringes.dm:33)  may sleep
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/reagent_containers/syringe/proc/attack_self  (code/modules/reagents/reagent_containers/syringes.dm:37)
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/syringe/proc/attack_hand  (code/modules/reagents/reagent_containers/syringes.dm:41)  may sleep
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/syringe/proc/attack_paw  (code/modules/reagents/reagent_containers/syringes.dm:45)  may sleep
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/item/weapon/reagent_containers/syringe/proc/afterattack  (code/modules/reagents/reagent_containers/syringes.dm:53)  may sleep
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let L: Value = null, M: Value = null, drawn_amount: Value = null, trans: Value = null, rinject: Value = null, R: Value = null, contained: Value = null, fraction: Value = null;
	let $0: any, $e: any;
	f.vars = () => [target, user, proximity, L, M, drawn_amount, trans, rinject, R, contained, fraction, $0, $e];
	if (truthy(rt.sv(f, "busy"))) {
		return live(f.dot);
	}
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "reagents", live(target)))) {
		return live(f.dot);
	}
	L = null;
	if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, (L = live(target)), "can_inject", [live(user), 1])))) {
			return live(f.dot);
		}
	}
	if ((truthy((rt.istype(live(target), T("/mob/living/carbon/monkey")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [20])))) {
		M = null;
		yield* g.callName(f, (M = live(target)), "retaliate", [live(user)]);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The syringe is full.</span>"]);
			return live(f.dot);
		}
		if (truthy(live(L))) {
			drawn_amount = subtract(rt.fv(f, "maximum_volume", rt.sv(f, "reagents")), rt.fv(f, "total_volume", rt.sv(f, "reagents")));
			if (!isEqual(live(target), live(user))) {
				yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ is trying to take a blood sample from ＀!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ is trying to take a blood sample from ＀!</span>", [live(user), live(target)])]);
				rt.setSv(f, "busy", 1);
				if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [null, live(user), null, live(target), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(L), P("/mob/living/proc/can_inject"), live(user), 1]))], rt.Args.Named)))) {
					rt.setSv(f, "busy", 0);
					return live(f.dot);
				}
				if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
					return live(f.dot);
				}
			}
			rt.setSv(f, "busy", 0);
			if (truthy((yield* g.callName(f, live(L), "transfer_blood_to", [live(f.src), live(drawn_amount)])))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ takes a blood sample from ＀.", [live(user), live(L)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You are unable to draw any blood from ＀!</span>", [live(L)])]);
			}
		} else {
			if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(target)])]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(target), "is_drawable", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot directly remove reagents from ＀!</span>", [live(target)])]);
				return live(f.dot);
			}
			trans = (yield* g.callName(f, rt.fv(f, "reagents", live(target)), "trans_to", [live(f.src), rt.sv(f, "amount_per_transfer_from_this")]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill ＀ with ＀ units of the solution.</span>", [live(f.src), live(trans)])]);
		}
		if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
			rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
		}
	} else if ($0 === 1) {
		if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is empty.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(target), "is_injectable", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot directly fill ＀!</span>", [live(target)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is full.</span>", [live(target)])]);
			return live(f.dot);
		}
		if (truthy(live(L))) {
			if (!isEqual(live(L), live(user))) {
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ is trying to inject ＀!</span>", [live(user), live(L)]), fmt("<span class='userdanger'>＀ is trying to inject ＀!</span>", [live(user), live(L)])]);
				if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [null, live(user), null, live(L), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(L), P("/mob/living/proc/can_inject"), live(user), 1]))], rt.Args.Named)))) {
					return live(f.dot);
				}
				if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
					return live(f.dot);
				}
				if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(L))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(L))))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ injects ＀ with the syringe!", [live(user), live(L)]), fmt("<span class='userdanger'>＀ injects ＀ with the syringe!", [live(user), live(L)])]);
			}
			rinject = rt.list();
			R = null;
			rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				rinject = rt.modify(live(rinject), rt.fv(f, "name", live(R)), add);
			}
			rt.endFor(f, 0);
			contained = (yield* g.call(f, P("/proc/english_list"), null, [live(rinject)]));
			if (!isEqual(live(L), live(user))) {
				yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(L), null, "injected", null, live(f.src), "addition", fmt("which had ＀", [live(contained)])], rt.Args.Named);
			} else {
				yield* g.call(f, P("/proc/log_attack"), null, [fmt("<font color='red'>＀ (＀) injected ＀ (＀) with ＀, which had ＀ (INTENT: ＀)</font>", [rt.fv(f, "name", live(user)), rt.fv(f, "ckey", live(user)), rt.fv(f, "name", live(L)), rt.fv(f, "ckey", live(L)), rt.fv(f, "name", live(f.src)), live(contained), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))]))])]);
				yield* g.callName(f, live(L), "log_message", [fmt("<font color='orange'>Injected themselves (＀) with ＀.</font>", [live(contained), rt.fv(f, "name", live(f.src))]), "Attack log"]);
			}
		}
		fraction = (yield* g.call(f, P("/proc/min"), null, [divide(rt.sv(f, "amount_per_transfer_from_this"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(L), 5, live(fraction)]);
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You inject ＀ units of the solution. The syringe now contains ＀ units.</span>", [rt.sv(f, "amount_per_transfer_from_this"), rt.fv(f, "total_volume", rt.sv(f, "reagents"))])]);
		if (!(rt.le(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0) && isEqual(rt.sv(f, "mode"), 1))) return f.dot;
		rt.setSv(f, "mode", 0);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/syringe/proc/update_icon  (code/modules/reagents/reagent_containers/syringes.dm:156)
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/update_icon", function update_icon(f: Frame) {
	let rounded_vol: Value = null, injoverlay: Value = null, filling_overlay: Value = null;
	let $0: any;
	f.vars = () => [rounded_vol, injoverlay, filling_overlay, $0];
	rounded_vol = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")), 15), 5]), 15])]);
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) {
		injoverlay = null;
		$0 = rt.sv(f, "mode");
		if ($0 === 0) {
			injoverlay = "draw";
		} else if ($0 === 1) {
			injoverlay = "inject";
		}
		rt.callSrc(f, "add_overlay", [live(injoverlay)]);
	}
	rt.setSv(f, "icon_state", fmt("＀", [live(rounded_vol)]));
	rt.setSv(f, "item_state", fmt("syringe_＀", [live(rounded_vol)]));
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	rt.setFv(f, "color", (filling_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/reagentfillings.dmi"), fmt("syringe＀", [live(rounded_vol)])])), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
	rt.callSrc(f, "add_overlay", [live(filling_overlay)]);
	return f.dot;
});

rt.type(6547, "/obj/item/weapon/reagent_containers/syringe/epinephrine", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (epinephrine)",
	desc: "Contains epinephrine - used to stabilize patients.",
});

// /obj/item/weapon/reagent_containers/syringe/epinephrine/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:177)
rt.def("/obj/item/weapon/reagent_containers/syringe/epinephrine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["epinephrine", 15]));
	return f.dot;
});

rt.type(6548, "/obj/item/weapon/reagent_containers/syringe/charcoal", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (charcoal)",
	desc: "Contains charcoal.",
});

// /obj/item/weapon/reagent_containers/syringe/charcoal/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:182)
rt.def("/obj/item/weapon/reagent_containers/syringe/charcoal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["charcoal", 15]));
	return f.dot;
});

rt.type(6549, "/obj/item/weapon/reagent_containers/syringe/antiviral", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (spaceacillin)",
	desc: "Contains antiviral agents.",
});

// /obj/item/weapon/reagent_containers/syringe/antiviral/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:187)
rt.def("/obj/item/weapon/reagent_containers/syringe/antiviral/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["spaceacillin", 15]));
	return f.dot;
});

rt.type(6550, "/obj/item/weapon/reagent_containers/syringe/bioterror", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "bioterror syringe",
	desc: "Contains several paralyzing reagents.",
});

// /obj/item/weapon/reagent_containers/syringe/bioterror/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:192)
rt.def("/obj/item/weapon/reagent_containers/syringe/bioterror/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["neurotoxin", 5, "mutetoxin", 5, "sodium_thiopental", 5]));
	return f.dot;
});

rt.type(6551, "/obj/item/weapon/reagent_containers/syringe/stimulants", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 50,
	volume: 50,
	list_reagents: null,
	name: "Stimpack",
	desc: "Contains stimulants.",
});

// /obj/item/weapon/reagent_containers/syringe/stimulants/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:199)
rt.def("/obj/item/weapon/reagent_containers/syringe/stimulants/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["stimulants", 50]));
	return f.dot;
});

rt.type(6552, "/obj/item/weapon/reagent_containers/syringe/calomel", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (calomel)",
	desc: "Contains calomel.",
});

// /obj/item/weapon/reagent_containers/syringe/calomel/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:204)
rt.def("/obj/item/weapon/reagent_containers/syringe/calomel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["calomel", 15]));
	return f.dot;
});

rt.type(6554, "/obj/item/weapon/reagent_containers/syringe/lethal/choral", "/obj/item/weapon/reagent_containers/syringe/lethal", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/syringe/lethal/choral/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:213)
rt.def("/obj/item/weapon/reagent_containers/syringe/lethal/choral/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["chloralhydrate", 50]));
	return f.dot;
});

rt.type(6555, "/obj/item/weapon/reagent_containers/syringe/lethal/execution", "/obj/item/weapon/reagent_containers/syringe/lethal", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/syringe/lethal/execution/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:216)
rt.def("/obj/item/weapon/reagent_containers/syringe/lethal/execution/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["plasma", 15, "formaldehyde", 15, "cyanide", 10, "facid", 10]));
	return f.dot;
});

rt.type(6556, "/obj/item/weapon/reagent_containers/syringe/mulligan", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 1,
	volume: 1,
	list_reagents: null,
	name: "Mulligan",
	desc: "A syringe used to completely change the users identity.",
});

// /obj/item/weapon/reagent_containers/syringe/mulligan/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:223)
rt.def("/obj/item/weapon/reagent_containers/syringe/mulligan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["mulligan", 1]));
	return f.dot;
});

rt.type(6557, "/obj/item/weapon/reagent_containers/syringe/gluttony", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 1,
	volume: 1,
	list_reagents: null,
	name: "Gluttony's Blessing",
	desc: "A syringe recovered from a dread place. It probably isn't wise to use.",
});

// /obj/item/weapon/reagent_containers/syringe/gluttony/proc/<init>  (code/modules/reagents/reagent_containers/syringes.dm:230)
rt.def("/obj/item/weapon/reagent_containers/syringe/gluttony/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["gluttonytoxin", 1]));
	return f.dot;
});

rt.type(6559, "/obj/item/weapon/reagent_containers/syringe/noreact", "/obj/item/weapon/reagent_containers/syringe", {
	volume: 20,
	name: "cryo syringe",
	desc: "An advanced syringe that stops reagents inside from reacting. It can hold up to 20 units.",
	origin_tech: "materials=3;engineering=3",
});

// /obj/item/weapon/reagent_containers/syringe/noreact/proc/Initialize  (code/modules/reagents/reagent_containers/syringes.dm:246)  may sleep
rt.def("/obj/item/weapon/reagent_containers/syringe/noreact/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	return f.dot;
}, true);
