// From code/modules/reagents/reagent_containers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5799, "/obj/item/weapon/reagent_containers", "/obj/item/weapon", {
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 30,
	list_reagents: null,
	spawned_disease: null,
	disease_amount: 20,
	spillable: 0,
	name: "Container",
	desc: "...",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: null,
	w_class: 1,
});

// /obj/item/weapon/reagent_containers/proc/Initialize  (code/modules/reagents/reagent_containers.dm:16)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null, data: Value = null;
	f.vars = () => [F, data];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy((yield* g.call(f, P("/proc/isnum"), null, [live(f.args[1])]))) && rt.gt(live(f.args[1]), 0))) {
		rt.setSv(f, "volume", live(f.args[1]));
	}
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "volume"));
	if (truthy(rt.sv(f, "spawned_disease"))) {
		F = (yield* g.new_(f, rt.sv(f, "spawned_disease"), [0]));
		data = rt.alist(f, ["viruses", rt.list(live(F))]);
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["blood", rt.sv(f, "disease_amount"), live(data)]);
	}
	yield* g.srcCall(f, "add_initial_reagents");
	return f.dot;
}, true, { args: ["mapload", "vol"] });

// /obj/item/weapon/reagent_containers/proc/add_initial_reagents  (code/modules/reagents/reagent_containers.dm:29)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/add_initial_reagents", function* add_initial_reagents(f: Frame) {
	if (!truthy(rt.sv(f, "list_reagents"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent_list", [rt.sv(f, "list_reagents")]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/proc/attack_self  (code/modules/reagents/reagent_containers.dm:32)
rt.def("/obj/item/weapon/reagent_containers/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let i: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [i, A, $e];
	if (!truthy(rt.len(f, rt.sv(f, "possible_transfer_amounts")))) return f.dot;
	i = 0;
	A = null;
	rt.forList(f, 0, rt.sv(f, "possible_transfer_amounts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		i = rt.inc(live(i), 1);
		if (isEqual(live(A), rt.sv(f, "amount_per_transfer_from_this"))) {
			if (rt.lt(live(i), rt.len(f, rt.sv(f, "possible_transfer_amounts")))) {
				rt.setSv(f, "amount_per_transfer_from_this", rt.index(rt.sv(f, "possible_transfer_amounts"), add(live(i), 1)));
			} else {
				rt.setSv(f, "amount_per_transfer_from_this", rt.index(rt.sv(f, "possible_transfer_amounts"), 1));
			}
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀'s transfer amount is now ＀ units.</span>", [live(f.src), rt.sv(f, "amount_per_transfer_from_this")])]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/proc/attack  (code/modules/reagents/reagent_containers.dm:45)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/attack", function* attack(f: Frame) {
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "user", "def_zone"] });

// /obj/item/weapon/reagent_containers/proc/reagentlist  (code/modules/reagents/reagent_containers.dm:53)
rt.def("/obj/item/weapon/reagent_containers/proc/reagentlist", function reagentlist(f: Frame, snack: Value) {
	let data: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [data, R, $e];
	data = null;
	if ((truthy(rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(snack)))) && truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(snack))))))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(snack))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			data = rt.modify(live(data), fmt("＀(＀ units); ", [rt.fv(f, "id", live(R)), rt.fv(f, "volume", live(R))]), add);
		}
		rt.endFor(f, 0);
		return live(data);
	} else {
		return "No reagents";
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/proc/canconsume  (code/modules/reagents/reagent_containers.dm:60)
rt.def("/obj/item/weapon/reagent_containers/proc/canconsume", function canconsume(f: Frame, eater: Value, user: Value) {
	let C: Value = null, covered: Value = null, who: Value = null;
	let $0: any;
	f.vars = () => [C, covered, who, $0];
	if (!truthy((rt.istype(live(eater), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	C = live(eater);
	covered = "";
	if (truthy(rt.callName(f, live(C), "is_mouth_covered", ["head_only", 1], rt.Args.Named))) {
		covered = "headgear";
	} else {
		if (truthy(rt.callName(f, live(C), "is_mouth_covered", ["mask_only", 1], rt.Args.Named))) {
			covered = "mask";
		}
	}
	if (truthy(live(covered))) {
		if ((live(user) === null || isEqual(live(eater), live(user)))) {
			$0 = "your";
		} else {
			$0 = fmt("＀", [rt.callName(f, live(eater), "p_their", [])]);
		}
		who = $0;
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You have to remove ＀ ＀ first!</span>", [live(who), live(covered)])]);
		return 0;
	}
	return 1;
});

// /obj/item/weapon/reagent_containers/proc/ex_act  (code/modules/reagents/reagent_containers.dm:76)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/ex_act", function* ex_act(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (truthy(rt.sv(f, "reagents"))) {
		R = null;
		rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, live(R), "on_ex_act", []);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/reagent_containers/proc/fire_act  (code/modules/reagents/reagent_containers.dm:82)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/fire_act", function* fire_act(f: Frame) {
	rt.modField(f, rt.sv(f, "reagents"), "chem_temp", 30, add);
	yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/weapon/reagent_containers/proc/throw_impact  (code/modules/reagents/reagent_containers.dm:87)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/throw_impact", function* throw_impact(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "SplashReagents", live(f.args[0]), 1);
	return f.dot;
}, true, { args: ["target"], waitfor: false });

// /obj/item/weapon/reagent_containers/proc/SplashReagents  (code/modules/reagents/reagent_containers.dm:91)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/SplashReagents", function* SplashReagents(f: Frame, target: Value, thrown: Value) {
	let M: Value = null, R: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [target, thrown, M, R, A, $0, $1, $2, $e];
	if (live(thrown) === null) {
		thrown = 0;
	}
	if (((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) || !truthy(rt.sv(f, "spillable")))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(target)]))) && truthy(rt.fv(f, "reagents", live(target))))) {
		if (truthy(live(thrown))) {
			(rt.modField(f, rt.sv(f, "reagents"), "total_volume", multiply((yield* g.call(f, P("/proc/rand"), null, [5, 10])), 0.10000000149011612), multiply));
		}
		M = live(target);
		R = null;
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has been splashed with something!</span>", [live(M)]), fmt("<span class='userdanger'>＀ has been splashed with something!</span>", [live(M)])]);
		A = null;
		rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			R = rt.modify(live(R), add(rt.fv(f, "id", live(A)), " ("), add);
			R = rt.modify(live(R), add((yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "volume", live(A))])), "),"), add);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "thrownby"))) {
			yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "thrownby"), live(M), "splashed", live(R)]);
		}
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(target), 1]);
	} else {
		if (((((truthy((yield* g.callName(f, live(target), "CanPass", [live(f.src), rt.getStep(f, live(f.src), 0)]))) && truthy(live(thrown))) && truthy(rt.sv(f, "thrownby"))) && truthy(rt.fv(f, "mind", rt.sv(f, "thrownby")))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", rt.sv(f, "thrownby"))), "Bartender"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ lands onto the ＀ without spilling a single drop.</span>", [live(f.src), rt.fv(f, "name", live(target))]));
			return live(f.dot);
		} else {
			if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)]))) && truthy(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))))) && truthy(rt.sv(f, "thrownby")))) {
				yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "thrownby"), live(target), fmt("splashed (thrown) ＀", [(yield* g.call(f, P("/proc/english_list"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]))]), fmt("at ＀＀", [live(target), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))])])]);
				yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ splashed (thrown) ＀ at ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "thrownby")])), (yield* g.call(f, P("/proc/english_list"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))])])]);
				$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "thrownby")]));
				$1 = (yield* g.call(f, P("/proc/english_list"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
				if (truthy(live(target))) {
					$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))])]);
				} else {
					$2 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ splashed (thrown) ＀ at ＀.", [$0, $1, fmt("＀", [$2])])]);
			}
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ spills its contents all over ＀.</span>", [live(f.src), live(target)]));
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(target), 1]);
			if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
				return live(f.dot);
			}
		}
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/proc/microwave_act  (code/modules/reagents/reagent_containers.dm:126)  may sleep
rt.def("/obj/item/weapon/reagent_containers/proc/microwave_act", function* microwave_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "is_open_container")))) {
		rt.setFv(f, "chem_temp", rt.sv(f, "reagents"), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "chem_temp", rt.sv(f, "reagents")), 1000])));
		yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M"] });
