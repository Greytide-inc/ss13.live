// From code/modules/reagents/reagent_containers/glass.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6390, "/obj/item/weapon/reagent_containers/glass", "/obj/item/weapon/reagent_containers", {
	container_type: 4096,
	name: "glass",
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
	volume: 50,
	spillable: 1,
	resistance_flags: 32,
});

// /obj/item/weapon/reagent_containers/glass/proc/attack  (code/modules/reagents/reagent_containers/glass.dm:12)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/proc/attack", function* attack(f: Frame, M: Value, user: Value, target: Value) {
	let R: Value = null, A: Value = null, fraction: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [M, user, target, R, A, fraction, $0, $1, $2, $e];
	if (!truthy((yield* g.srcCall(f, "canconsume", live(M), live(user))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "spillable"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob")) ? 1 : 0))) return f.dot;
	if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		R = null;
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ splashes the contents of ＀ onto ＀!</span>", [live(user), live(f.src), live(M)]), fmt("<span class='userdanger'>＀ splashes the contents of ＀ onto ＀!</span>", [live(user), live(f.src), live(M)])]);
		if (truthy(rt.sv(f, "reagents"))) {
			A = null;
			rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				R = rt.modify(live(R), add(rt.fv(f, "id", live(A)), " ("), add);
				R = rt.modify(live(R), add((yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "volume", live(A))])), "),"), add);
			}
			rt.endFor(f, 0);
		}
		if (((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)]))) && truthy(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))))) && truthy(rt.sv(f, "thrownby")))) {
			yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "thrownby"), live(target), fmt("splashed ＀", [(yield* g.call(f, P("/proc/english_list"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]))]), fmt("at ＀＀", [live(target), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))])])]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ splashed ＀ at ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "thrownby")])), (yield* g.call(f, P("/proc/english_list"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))])])]);
			$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "thrownby")]));
			$1 = (yield* g.call(f, P("/proc/english_list"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
			if (truthy(live(target))) {
				$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(target)), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target))])]);
			} else {
				$2 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ splashed ＀ at ＀.", [$0, $1, fmt("＀", [$2])])]);
		}
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 1]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "splashed", live(R)]);
		yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	} else {
		if (!isEqual(live(M), live(user))) {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ attempts to feed something to ＀.</span>", [live(user), live(M)]), fmt("<span class='userdanger'>＀ attempts to feed something to you.</span>", [live(user)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(M)])))) {
				return live(f.dot);
			}
			if ((!truthy(rt.sv(f, "reagents")) || !truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ feeds something to ＀.</span>", [live(user), live(M)]), fmt("<span class='userdanger'>＀ feeds something to you.</span>", [live(user)])]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "fed", (yield* g.srcCall(f, "reagentlist", live(f.src)))]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You swallow a gulp of ＀.</span>", [live(f.src)])]);
		}
		fraction = (yield* g.call(f, P("/proc/min"), null, [divide(5, rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), 2, live(fraction)]);
		rt.spawnTail(f, 5, "/obj/item/weapon/reagent_containers/glass/proc/attack: spawn at modules/reagents/reagent_containers/glass.dm:52", M, user, target, R, A, fraction);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(M)), rt.rsc("sound/items/drink.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
	}
	return f.dot;
}, true);

// a spawn(5) body of /obj/item/weapon/reagent_containers/glass/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/glass/proc/attack: spawn at modules/reagents/reagent_containers/glass.dm:52", function* (f: Frame, M: Value, user: Value, target: Value, R: Value, A: Value, fraction: Value) {
	f.vars = () => [M, user, target, R, A, fraction];
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(M), 5]);
	return null;
});

// /obj/item/weapon/reagent_containers/glass/proc/afterattack  (code/modules/reagents/reagent_containers/glass.dm:57)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null;
	f.vars = () => [target, user, proximity, trans];
	if ((!truthy(live(proximity)) || !truthy((yield* g.callSrc(f, "check_allowed_items", [null, live(target), "target_self", 1], rt.Args.Named))))) {
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(target), T("/obj/structure/reagent_dispensers")) ? 1 : 0))) {
			if ((truthy(rt.fv(f, "reagents", live(target))) && !truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target)))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty and can't be refilled!</span>", [live(target)])]);
				return live(f.dot);
			}
			if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is full.</span>", [live(f.src)])]);
				return live(f.dot);
			}
			trans = (yield* g.callName(f, rt.fv(f, "reagents", live(target)), "trans_to", [live(f.src), rt.sv(f, "amount_per_transfer_from_this")]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill ＀ with ＀ unit５ of the contents of ＀.</span>", [live(f.src), live(trans), live(target)])]);
		} else {
			if ((truthy((yield* g.callName(f, live(target), "is_open_container", []))) && truthy(rt.fv(f, "reagents", live(target))))) {
				if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
					return live(f.dot);
				}
				if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(target))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is full.</span>", [live(target)])]);
					return live(f.dot);
				}
				trans = (yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(target), rt.sv(f, "amount_per_transfer_from_this")]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You transfer ＀ unit５ of the solution to ＀.</span>", [live(trans), live(target)])]);
			} else {
				if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
				if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ splashes the contents of ＀ onto ＀!</span>", [live(user), live(f.src), live(target)]), fmt("<span class='notice'>You splash the contents of ＀ onto ＀.</span>", [live(f.src), live(target)])]);
				yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(target), 1]);
				yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
			}
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/glass/proc/attackby  (code/modules/reagents/reagent_containers/glass.dm:93)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/proc/attackby", function* attackby(f: Frame) {
	let hotness: Value = null, added_heat: Value = null, E: Value = null;
	f.vars = () => [hotness, added_heat, E];
	if (truthy((hotness = (yield* g.callName(f, live(f.args[0]), "is_hot", []))))) {
		added_heat = divide(live(hotness), 100);
		if (truthy(rt.sv(f, "reagents"))) {
			if (rt.lt(rt.fv(f, "chem_temp", rt.sv(f, "reagents")), live(hotness))) {
				rt.modField(f, rt.sv(f, "reagents"), "chem_temp", live(added_heat), add);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You heat ＀ with ＀.</span>", [live(f.src), live(f.args[0])])]);
				yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already hotter than ＀!</span>", [live(f.src), live(f.args[0])])]);
			}
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/egg")) ? 1 : 0))) {
		E = live(f.args[0]);
		if (truthy(rt.sv(f, "reagents"))) {
			if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ is full.</span>", [live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You break ＀ in ＀.</span>", [live(E), live(f.src)])]);
				yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["eggyolk", 5]);
				yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
			}
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6454, "/obj/item/weapon/reagent_containers/glass/beaker", "/obj/item/weapon/reagent_containers/glass", {
	name: "beaker",
	desc: "A beaker. It can hold up to 50 units.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "beaker",
	item_state: "beaker",
	materials: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:123)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/beaker/proc/Initialize  (code/modules/reagents/reagent_containers/glass.dm:126)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/glass/beaker/proc/on_reagent_change  (code/modules/reagents/reagent_containers/glass.dm:130)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/beaker/proc/update_icon  (code/modules/reagents/reagent_containers/glass.dm:133)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/update_icon", function update_icon(f: Frame) {
	let filling: Value = null, percent: Value = null;
	let $0: any;
	f.vars = () => [filling, percent, $0];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/reagentfillings.dmi"), fmt("＀10", [rt.sv(f, "icon_state")])]);
	$0 = (percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")), 100)]));
	if (rt.inRange($0, 0, 9)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀-10", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 10, 24)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀10", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 25, 49)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀25", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 50, 74)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀50", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 75, 79)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀75", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 80, 90)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀80", [rt.sv(f, "icon_state")]));
	} else if (rt.inRange($0, 91, 9.999999848243207e+30)) {
		rt.setFv(f, "icon_state", live(filling), fmt("＀100", [rt.sv(f, "icon_state")]));
	}
	rt.setFv(f, "color", live(filling), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
	rt.callSrc(f, "add_overlay", [live(filling)]);
	return f.dot;
});

rt.type(6456, "/obj/item/weapon/reagent_containers/glass/beaker/large", "/obj/item/weapon/reagent_containers/glass/beaker", {
	flags: 4096,
	name: "large beaker",
	desc: "A large beaker. Can hold up to 100 units.",
	icon_state: "beakerlarge",
	materials: null,
	volume: 100,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:168)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2500]));
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 20, 25, 30, 50, 100));
	return f.dot;
});

rt.type(6486, "/obj/item/weapon/reagent_containers/glass/beaker/noreact", "/obj/item/weapon/reagent_containers/glass/beaker", {
	flags: 4096,
	name: "cryostasis beaker",
	desc: "A cryostasis beaker that allows for chemical storage without reactions. Can hold up to 50 units.",
	icon_state: "beakernoreact",
	materials: null,
	volume: 50,
	amount_per_transfer_from_this: 10,
	origin_tech: "materials=2;engineering=3;plasmatech=3",
});

// /obj/item/weapon/reagent_containers/glass/beaker/noreact/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:179)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/noreact/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/beaker/noreact/proc/Initialize  (code/modules/reagents/reagent_containers/glass.dm:186)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/noreact/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	return f.dot;
}, true);

rt.type(6487, "/obj/item/weapon/reagent_containers/glass/beaker/bluespace", "/obj/item/weapon/reagent_containers/glass/beaker", {
	flags: 4096,
	name: "bluespace beaker",
	desc: "A bluespace beaker, powered by experimental bluespace technology and Element Cuban combined with the Compound Pete. Can hold up to 300 units.",
	icon_state: "beakerbluespace",
	materials: null,
	volume: 300,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
	origin_tech: "bluespace=5;materials=4;plasmatech=4",
});

// /obj/item/weapon/reagent_containers/glass/beaker/bluespace/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:195)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/bluespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 3000]));
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15, 20, 25, 30, 50, 100, 300));
	return f.dot;
});

rt.type(6488, "/obj/item/weapon/reagent_containers/glass/beaker/cryoxadone", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/cryoxadone/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:203)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/cryoxadone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cryoxadone", 30]));
	return f.dot;
});

rt.type(6489, "/obj/item/weapon/reagent_containers/glass/beaker/sulphuric", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/sulphuric/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:206)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/sulphuric/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sacid", 50]));
	return f.dot;
});

rt.type(6490, "/obj/item/weapon/reagent_containers/glass/beaker/slime", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/slime/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:209)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["slimejelly", 50]));
	return f.dot;
});

rt.type(6457, "/obj/item/weapon/reagent_containers/glass/beaker/large/styptic", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "styptic reserve tank",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/styptic/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:213)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/styptic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["styptic_powder", 50]));
	return f.dot;
});

rt.type(6458, "/obj/item/weapon/reagent_containers/glass/beaker/large/silver_sulfadiazine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "silver sulfadiazine reserve tank",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/silver_sulfadiazine/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:217)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/silver_sulfadiazine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["silver_sulfadiazine", 50]));
	return f.dot;
});

rt.type(6459, "/obj/item/weapon/reagent_containers/glass/beaker/large/charcoal", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "antitoxin reserve tank",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/charcoal/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:221)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/charcoal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["charcoal", 50]));
	return f.dot;
});

rt.type(6460, "/obj/item/weapon/reagent_containers/glass/beaker/large/epinephrine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "epinephrine reserve tank",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/epinephrine/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:225)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/epinephrine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["epinephrine", 50]));
	return f.dot;
});

rt.type(6491, "/obj/item/weapon/reagent_containers/glass/beaker/synthflesh", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/synthflesh/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:228)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/synthflesh/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["synthflesh", 50]));
	return f.dot;
});

rt.type(6496, "/obj/item/weapon/reagent_containers/glass/bucket", "/obj/item/weapon/reagent_containers/glass", {
	flags: 4096,
	name: "bucket",
	desc: "It's a bucket.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "bucket",
	item_state: "bucket",
	materials: null,
	w_class: 3,
	amount_per_transfer_from_this: 20,
	possible_transfer_amounts: null,
	volume: 70,
	flags_inv: 256,
	slot_flags: 64,
	resistance_flags: 0,
	armor: null,
	slot_equipment_priority: null,
});

// /obj/item/weapon/reagent_containers/glass/bucket/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:236)
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200]));
	rt.setSv(f, "possible_transfer_amounts", rt.list(10, 15, 20, 25, 30, 50, 70));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 75, "acid", 50]));
	rt.setSv(f, "slot_equipment_priority", rt.list(1, 6, 14, 13, 2, 11, 10, 12, 9, 7, 8, 5, 17, 15, 16, 20));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/glass/bucket/proc/attackby  (code/modules/reagents/reagent_containers/glass.dm:258)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/mop")) ? 1 : 0))) {
		if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is out of water!</span>", [live(f.src)])]);
		} else {
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), 5]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You wet ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/slosh.ogg"), 25, 1]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(f.args[1]), "put_in_hands", [(yield* g.new_(f, T("/obj/item/weapon/bucket_sensor"), []))]);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/item/weapon/reagent_containers/glass/bucket/proc/equipped  (code/modules/reagents/reagent_containers/glass.dm:274)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(live(f.args[1]), 11) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='userdanger'>＀'s contents spill all over you!</span>", [live(f.src)])]);
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 1]);
	yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/weapon/reagent_containers/glass/bucket/proc/equip_to_best_slot  (code/modules/reagents/reagent_containers/glass.dm:281)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/equip_to_best_slot", function* equip_to_best_slot(f: Frame) {
	let index: Value = null;
	f.vars = () => [index];
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		index = (yield* g.callName(f, rt.sv(f, "slot_equipment_priority"), "Find", [11]));
		yield* g.callName(f, rt.sv(f, "slot_equipment_priority"), "Remove", [11]);
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		yield* g.callName(f, rt.sv(f, "slot_equipment_priority"), "Insert", [live(index), 11]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

rt.type(6492, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle", "/obj/item/weapon/reagent_containers/glass/beaker", {
	name: "bottle of water",
	desc: "A bottle of water filled at an old Earth bottling facility,",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "smallbottle",
	item_state: "bottle",
	list_reagents: null,
	materials: null,
	volume: 50,
	amount_per_transfer_from_this: 10,
	origin_tech: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/waterbottle/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:295)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["water", 49.5, "fluorine", 0.5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 0]));
	return f.dot;
});

rt.type(6493, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty", "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:302)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.list());
	return f.dot;
});

rt.type(6494, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large", "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle", {
	desc: "A fresh commercial-sized bottle of water.",
	icon_state: "largebottle",
	materials: null,
	list_reagents: null,
	volume: 100,
	amount_per_transfer_from_this: 20,
});

// /obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:307)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 0]));
	rt.setSv(f, "list_reagents", rt.alist(f, ["water", 100]));
	return f.dot;
});

rt.type(6495, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty", "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:313)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.list());
	return f.dot;
});

rt.type(6461, "/obj/item/weapon/reagent_containers/glass/beaker/large/hydrogen", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "hydrogen",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/hydrogen/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:317)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/hydrogen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["hydrogen", 50]));
	return f.dot;
});

rt.type(6462, "/obj/item/weapon/reagent_containers/glass/beaker/large/lithium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "lithium",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/lithium/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:321)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/lithium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["lithium", 50]));
	return f.dot;
});

rt.type(6463, "/obj/item/weapon/reagent_containers/glass/beaker/large/carbon", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "carbon",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/carbon/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:325)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/carbon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["carbon", 50]));
	return f.dot;
});

rt.type(6464, "/obj/item/weapon/reagent_containers/glass/beaker/large/nitrogen", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "nitrogen",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/nitrogen/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:329)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/nitrogen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nitrogen", 50]));
	return f.dot;
});

rt.type(6465, "/obj/item/weapon/reagent_containers/glass/beaker/large/oxygen", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "oxygen",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/oxygen/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:333)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/oxygen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["oxygen", 50]));
	return f.dot;
});

rt.type(6466, "/obj/item/weapon/reagent_containers/glass/beaker/large/fluorine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "fluorine",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/fluorine/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:337)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/fluorine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["fluorine", 50]));
	return f.dot;
});

rt.type(6467, "/obj/item/weapon/reagent_containers/glass/beaker/large/sodium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sodium",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/sodium/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:341)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sodium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sodium", 50]));
	return f.dot;
});

rt.type(6468, "/obj/item/weapon/reagent_containers/glass/beaker/large/aluminium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "aluminium",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/aluminium/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:345)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/aluminium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["aluminium", 50]));
	return f.dot;
});

rt.type(6469, "/obj/item/weapon/reagent_containers/glass/beaker/large/silicon", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "silicon",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/silicon/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:349)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/silicon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["silicon", 50]));
	return f.dot;
});

rt.type(6470, "/obj/item/weapon/reagent_containers/glass/beaker/large/phosphorus", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "phosphorus",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/phosphorus/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:353)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/phosphorus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["phosphorus", 50]));
	return f.dot;
});

rt.type(6471, "/obj/item/weapon/reagent_containers/glass/beaker/large/sulfur", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sulfur",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/sulfur/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:357)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sulfur/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sulfur", 50]));
	return f.dot;
});

rt.type(6472, "/obj/item/weapon/reagent_containers/glass/beaker/large/chlorine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "chlorine",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/chlorine/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:361)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/chlorine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["chlorine", 50]));
	return f.dot;
});

rt.type(6473, "/obj/item/weapon/reagent_containers/glass/beaker/large/potassium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "potassium",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/potassium/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:365)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/potassium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["potassium", 50]));
	return f.dot;
});

rt.type(6474, "/obj/item/weapon/reagent_containers/glass/beaker/large/iron", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "iron",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/iron/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:369)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/iron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["iron", 50]));
	return f.dot;
});

rt.type(6475, "/obj/item/weapon/reagent_containers/glass/beaker/large/copper", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "copper",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/copper/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:373)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/copper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["copper", 50]));
	return f.dot;
});

rt.type(6476, "/obj/item/weapon/reagent_containers/glass/beaker/large/mercury", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "mercury",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/mercury/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:377)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/mercury/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["mercury", 50]));
	return f.dot;
});

rt.type(6477, "/obj/item/weapon/reagent_containers/glass/beaker/large/radium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "radium",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/radium/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:381)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/radium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["radium", 50]));
	return f.dot;
});

rt.type(6478, "/obj/item/weapon/reagent_containers/glass/beaker/large/water", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "water",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/water/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:385)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/water/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["water", 50]));
	return f.dot;
});

rt.type(6479, "/obj/item/weapon/reagent_containers/glass/beaker/large/ethanol", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "ethanol",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/ethanol/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:389)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/ethanol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ethanol", 50]));
	return f.dot;
});

rt.type(6480, "/obj/item/weapon/reagent_containers/glass/beaker/large/sugar", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sugar",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/sugar/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:393)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sugar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sugar", 50]));
	return f.dot;
});

rt.type(6481, "/obj/item/weapon/reagent_containers/glass/beaker/large/sacid", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sacid",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/sacid/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:397)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sacid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sacid", 50]));
	return f.dot;
});

rt.type(6482, "/obj/item/weapon/reagent_containers/glass/beaker/large/welding_fuel", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "welding_fuel",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/welding_fuel/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:401)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/welding_fuel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["welding_fuel", 50]));
	return f.dot;
});

rt.type(6483, "/obj/item/weapon/reagent_containers/glass/beaker/large/silver", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "silver",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/silver/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:405)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["silver", 50]));
	return f.dot;
});

rt.type(6484, "/obj/item/weapon/reagent_containers/glass/beaker/large/iodine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "iodine",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/iodine/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:409)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/iodine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["iodine", 50]));
	return f.dot;
});

rt.type(6485, "/obj/item/weapon/reagent_containers/glass/beaker/large/bromine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "bromine",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/beaker/large/bromine/proc/<init>  (code/modules/reagents/reagent_containers/glass.dm:413)
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/bromine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["bromine", 50]));
	return f.dot;
});
