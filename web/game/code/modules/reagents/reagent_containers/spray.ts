// From code/modules/reagents/reagent_containers/spray.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6372, "/obj/item/weapon/reagent_containers/spray", "/obj/item/weapon/reagent_containers", {
	stream_mode: 0,
	current_range: 3,
	spray_range: 3,
	stream_range: 1,
	stream_amount: 10,
	flags: 4,
	container_type: 4096,
	throw_speed: 3,
	throw_range: 7,
	name: "spray bottle",
	desc: "A spray bottle, with an unscrewable top.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "cleaner",
	item_state: "cleaner",
	slot_flags: 512,
	throwforce: 0,
	w_class: 2,
	amount_per_transfer_from_this: 5,
	volume: 250,
	possible_transfer_amounts: null,
});

// /obj/item/weapon/reagent_containers/spray/proc/afterattack  (code/modules/reagents/reagent_containers/spray.dm:25)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	let trans: Value = null, _T: Value = null, area: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [A, user, trans, _T, area, $0, $1, $2, $3];
	if (((truthy((rt.istype(live(A), T("/obj/structure/sink")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/obj/structure/janitorialcart")) ? 1 : 0))) || truthy((rt.istype(live(A), T("/obj/machinery/hydroponics")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(A), T("/obj/structure/reagent_dispensers")) ? 1 : 0)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(A)])), 1))) {
		if ((!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(A)))) && truthy(rt.fv(f, "reagents", live(A))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ is empty.</span>", [live(A)])]);
			return live(f.dot);
		}
		if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ is full.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		trans = (yield* g.callName(f, rt.fv(f, "reagents", live(A)), "trans_to", [live(f.src), 50]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill ％！ with ＀ units of the contents of ％！.</span>", [live(f.src), live(trans), live(A)])]);
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "amount_per_transfer_from_this"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is empty!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "spray", live(A));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray2.ogg"), 50, 1, -6]);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "newtonian_move", [rt.getDir(f, live(A), live(user))]);
	_T = rt.getStep(f, live(f.src), 0);
	area = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["sacid"])))) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
		$1 = live(f.src);
		$2 = live(area);
		if (truthy(live(_T))) {
			$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$3 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fired sulphuric acid from ＇！ at ＀ ＀.", [$0, $1, $2, fmt("＀", [$3])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ fired sulphuric acid from ＇！ at ＀ (＀, ＀, ＀).", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(f.src), live(area), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["facid"])))) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
		$1 = live(f.src);
		$2 = live(area);
		if (truthy(live(_T))) {
			$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$3 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fired Fluacid from ＇！ at ＀ ＀.", [$0, $1, $2, fmt("＀", [$3])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ fired Fluacid from ＇！ at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(f.src), live(area), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["lube"])))) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
		$1 = live(f.src);
		$2 = live(area);
		if (truthy(live(_T))) {
			$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$3 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fired Space lube from ＇！ at ＀ ＀.", [$0, $1, $2, fmt("＀", [$3])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ fired Space lube from ＇！ at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(f.src), live(area), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/reagent_containers/spray/proc/spray  (code/modules/reagents/reagent_containers/spray.dm:65)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/proc/spray", function* spray(f: Frame, A: Value) {
	let range: Value = null, D: Value = null, puff_reagent_left: Value = null, wait_step: Value = null, range_left: Value = null, i: Value = null, _T: Value = null, M: Value = null;
	f.vars = () => [A, range, D, puff_reagent_left, wait_step, range_left, i, _T, M];
	range = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "current_range"), (yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(A)]))])), 1]));
	yield* g.callName(f, (D = (yield* g.new_(f, T("/obj/effect/decal/chempuff"), [rt.getStep(f, live(f.src), 0)]))), "create_reagents", [rt.sv(f, "amount_per_transfer_from_this")]);
	puff_reagent_left = live(range);
	if (truthy(rt.sv(f, "stream_mode"))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(D), rt.sv(f, "amount_per_transfer_from_this")]);
		puff_reagent_left = 1;
	} else {
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(D), rt.sv(f, "amount_per_transfer_from_this"), divide(1, live(range))]);
	}
	rt.setFv(f, "color", live(D), (yield* g.call(f, P("/proc/mix_color_from_reagents"), null, [rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(D)))])));
	wait_step = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [add(2, divide(3, live(range)))])), 2]));
	rt.spawnTail(f, 0, "/obj/item/weapon/reagent_containers/spray/proc/spray: spawn at modules/reagents/reagent_containers/spray.dm:76", A, range, D, puff_reagent_left, wait_step, range_left, i, _T, M);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/weapon/reagent_containers/spray/proc/spray, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/spray/proc/spray: spawn at modules/reagents/reagent_containers/spray.dm:76", function* (f: Frame, A: Value, range: Value, D: Value, puff_reagent_left: Value, wait_step: Value, range_left: Value, i: Value, _T: Value, M: Value) {
	let $e: any;
	f.vars = () => [A, range, D, puff_reagent_left, wait_step, range_left, i, _T, M, $e];
	range_left = live(range);
	i = null;
	i = 0;
	while (rt.lt(live(i), live(range))) {
		range_left = rt.inc(live(range_left), -1);
		yield* g.call(f, P("/proc/step_towards"), null, [live(D), live(A)]);
		yield* g.call(f, P("/proc/sleep"), null, [live(wait_step)]);
		_T = null;
		rt.forList(f, 0, rt.getStep(f, live(D), 0), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if ((isEqual(live(_T), live(D)) || truthy(rt.fv(f, "invisibility", live(_T))))) {
				continue;
			}
			if (rt.le(live(puff_reagent_left), 0)) {
				break;
			}
			if (truthy(rt.sv(f, "stream_mode"))) {
				if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(_T)])))) {
					if ((!truthy(rt.gv(f, "lying", (M = live(_T)))) || !truthy(live(range_left)))) {
						yield* g.callName(f, rt.fv(f, "reagents", live(D)), "reaction", [live(M), 3]);
						(puff_reagent_left = rt.modify(live(puff_reagent_left), 1, subtract));
					}
				} else {
					if (!truthy(live(range_left))) {
						yield* g.callName(f, rt.fv(f, "reagents", live(D)), "reaction", [live(_T), 3]);
					}
				}
			} else {
				yield* g.callName(f, rt.fv(f, "reagents", live(D)), "reaction", [live(_T), 3]);
				if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(_T)])))) {
					(puff_reagent_left = rt.modify(live(puff_reagent_left), 1, subtract));
				}
			}
		}
		rt.endFor(f, 0);
		if ((rt.gt(live(puff_reagent_left), 0) && (!truthy(rt.sv(f, "stream_mode")) || !truthy(live(range_left))))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(D)), "reaction", [rt.getStep(f, live(D), 0), 3]);
			(puff_reagent_left = rt.modify(live(puff_reagent_left), 1, subtract));
		}
		if (rt.le(live(puff_reagent_left), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(D)]);
			return live(f.dot);
		}
		i = rt.inc(live(i), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(D)]);
	return null;
});

// /obj/item/weapon/reagent_containers/spray/proc/attack_self  (code/modules/reagents/reagent_containers/spray.dm:112)
rt.def("/obj/item/weapon/reagent_containers/spray/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "stream_mode", (!truthy(rt.sv(f, "stream_mode")) ? 1 : 0));
	if (truthy(rt.sv(f, "stream_mode"))) {
		rt.setSv(f, "amount_per_transfer_from_this", rt.sv(f, "stream_amount"));
		rt.setSv(f, "current_range", rt.sv(f, "stream_range"));
	} else {
		rt.setSv(f, "amount_per_transfer_from_this", rt.initial(f, live(f.src), "amount_per_transfer_from_this"));
		rt.setSv(f, "current_range", rt.sv(f, "spray_range"));
	}
	$0 = live(user);
	if (truthy(rt.sv(f, "stream_mode"))) {
		$1 = "\"stream\"";
	} else {
		$1 = "\"spray\"";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You switch the nozzle setting to ＀. You'll now use ＀ units per use.</span>", [$1, rt.sv(f, "amount_per_transfer_from_this")])]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/spray/verb/empty  (code/modules/reagents/reagent_containers/spray.dm:125)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/verb/empty", function* empty(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Are you sure you want to empty that?", "Empty Bottle:", "Yes", "No"])), "Yes")) {
		return live(f.dot);
	}
	if (!(truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.usr))]))) && isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You empty ％！ onto the floor.</span>", [live(f.src)])]);
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [rt.fv(f, "loc", live(f.usr))]);
	yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "clear_reagents", []);
	return f.dot;
}, true, { verb: { name: "Empty Spray Bottle", category: "Object", src: 11 } });

rt.type(6380, "/obj/item/weapon/reagent_containers/spray/cleaner", "/obj/item/weapon/reagent_containers/spray", {
	name: "space cleaner",
	desc: "BLAM!-brand non-foaming space cleaner!",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/cleaner/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:138)
rt.def("/obj/item/weapon/reagent_containers/spray/cleaner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cleaner", 250]));
	return f.dot;
});

rt.type(6381, "/obj/item/weapon/reagent_containers/spray/spraytan", "/obj/item/weapon/reagent_containers/spray", {
	name: "spray tan",
	volume: 50,
	desc: "Gyaro brand spray tan. Do not spray near eyes or other orifices.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/spraytan/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:145)
rt.def("/obj/item/weapon/reagent_containers/spray/spraytan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["spraytan", 50]));
	return f.dot;
});

rt.type(6383, "/obj/item/weapon/reagent_containers/spray/medical/sterilizer", "/obj/item/weapon/reagent_containers/spray/medical", {
	name: "sterilizer spray",
	desc: "Spray bottle loaded with non-toxic sterilizer. Useful in preparation for surgery.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/medical/sterilizer/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:158)
rt.def("/obj/item/weapon/reagent_containers/spray/medical/sterilizer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sterilizine", 100]));
	return f.dot;
});

rt.type(6384, "/obj/item/weapon/reagent_containers/spray/pepper", "/obj/item/weapon/reagent_containers/spray", {
	stream_range: 4,
	name: "pepperspray",
	desc: "Manufactured by UhangInc, used to blind and down an opponent quickly.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "pepperspray",
	item_state: "pepperspray",
	volume: 40,
	amount_per_transfer_from_this: 5,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/pepper/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:171)
rt.def("/obj/item/weapon/reagent_containers/spray/pepper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["condensedcapsaicin", 40]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/spray/pepper/proc/afterattack  (code/modules/reagents/reagent_containers/spray.dm:175)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/pepper/proc/afterattack", function* afterattack(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.args[0])), live(f.args[1]))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "user"] });

rt.type(6385, "/obj/item/weapon/reagent_containers/spray/waterflower", "/obj/item/weapon/reagent_containers/spray", {
	name: "water flower",
	desc: "A seemingly innocent sunflower...with a twist.",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "sunflower",
	item_state: "sunflower",
	amount_per_transfer_from_this: 1,
	volume: 10,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/waterflower/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:188)
rt.def("/obj/item/weapon/reagent_containers/spray/waterflower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["water", 10]));
	return f.dot;
});

rt.type(6386, "/obj/item/weapon/reagent_containers/spray/chemsprayer", "/obj/item/weapon/reagent_containers/spray", {
	stream_mode: 1,
	current_range: 7,
	spray_range: 4,
	stream_range: 7,
	name: "chem sprayer",
	desc: "A utility used to spray large amounts of reagents in a given area.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "chemsprayer",
	item_state: "chemsprayer",
	throwforce: 0,
	w_class: 3,
	amount_per_transfer_from_this: 10,
	volume: 600,
	origin_tech: "combat=3;materials=3;engineering=3",
});

// /obj/item/weapon/reagent_containers/spray/chemsprayer/proc/afterattack  (code/modules/reagents/reagent_containers/spray.dm:212)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/chemsprayer/proc/afterattack", function* afterattack(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.args[0])), live(f.args[1]))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "user"] });

// /obj/item/weapon/reagent_containers/spray/chemsprayer/proc/spray  (code/modules/reagents/reagent_containers/spray.dm:217)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/chemsprayer/proc/spray", function* spray(f: Frame, A: Value) {
	let direction: Value = null, _T: Value = null, T1: Value = null, T2: Value = null, the_targets: Value = null, i: Value = null;
	f.vars = () => [A, direction, _T, T1, T2, the_targets, i];
	direction = rt.getDir(f, live(f.src), live(A));
	_T = rt.getStep(f, live(A), 0);
	T1 = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [live(direction), 90])));
	T2 = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [live(direction), -90])));
	the_targets = rt.list(live(_T), live(T1), live(T2));
	i = null;
	i = 1;
	while (rt.le(live(i), 3)) {
		if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 1)) {
			return live(f.dot);
		}
		yield* g.callSuper(f, [rt.index(live(the_targets), live(i))]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(6387, "/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror", "/obj/item/weapon/reagent_containers/spray/chemsprayer", {
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:229)
rt.def("/obj/item/weapon/reagent_containers/spray/chemsprayer/bioterror/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sodium_thiopental", 100, "coniine", 100, "venom", 100, "condensedcapsaicin", 100, "initropidril", 100, "polonium", 100]));
	return f.dot;
});

rt.type(6388, "/obj/item/weapon/reagent_containers/spray/plantbgone", "/obj/item/weapon/reagent_containers/spray", {
	name: "Plant-B-Gone",
	desc: "Kills those pesky weeds!",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "plantbgone",
	item_state: "plantbgone",
	volume: 100,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/plantbgone/proc/<init>  (code/modules/reagents/reagent_containers/spray.dm:239)
rt.def("/obj/item/weapon/reagent_containers/spray/plantbgone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["plantbgone", 100]));
	return f.dot;
});
