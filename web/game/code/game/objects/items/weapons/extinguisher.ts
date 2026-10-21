// From code/game/objects/items/weapons/extinguisher.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7226, "/obj/item/weapon/extinguisher", "/obj/item/weapon", {
	max_water: 50,
	last_use: 1,
	safety: 1,
	refilling: 0,
	sprite_name: "fire_extinguisher",
	power: 5,
	precision: 0,
	cooling_power: 2,
	flags: 64,
	throw_speed: 2,
	throw_range: 7,
	name: "fire extinguisher",
	desc: "A traditional red fire extinguisher.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "fire_extinguisher0",
	item_state: "fire_extinguisher",
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
	throwforce: 10,
	w_class: 3,
	force: 10,
	materials: null,
	attack_verb: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
	resistance_flags: 2,
});

// /obj/item/weapon/extinguisher/proc/<init>  (code/game/objects/items/weapons/extinguisher.dm:14)
rt.def("/obj/item/weapon/extinguisher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 90]));
	rt.setSv(f, "attack_verb", rt.list("slammed", "whacked", "bashed", "thunked", "battered", "bludgeoned", "thrashed"));
	return f.dot;
});

rt.type(7227, "/obj/item/weapon/extinguisher/mini", "/obj/item/weapon/extinguisher", {
	flags: null,
	max_water: 30,
	sprite_name: "miniFE",
	name: "pocket fire extinguisher",
	desc: "A light and compact fibreglass-framed model fire extinguisher.",
	icon_state: "miniFE0",
	item_state: "miniFE",
	hitsound: null,
	throwforce: 2,
	w_class: 2,
	force: 3,
	materials: null,
	dog_fashion: null,
});

// /obj/item/weapon/extinguisher/mini/proc/<init>  (code/game/objects/items/weapons/extinguisher.dm:37)
rt.def("/obj/item/weapon/extinguisher/mini/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/weapon/extinguisher/proc/New  (code/game/objects/items/weapons/extinguisher.dm:43)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "max_water"));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["water", rt.sv(f, "max_water")]);
	return f.dot;
}, true);

// /obj/item/weapon/extinguisher/proc/attack_self  (code/game/objects/items/weapons/extinguisher.dm:48)
rt.def("/obj/item/weapon/extinguisher/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "safety", (!truthy(rt.sv(f, "safety")) ? 1 : 0));
	rt.setFv(f, "icon_state", live(f.src), fmt("＀＀", [rt.sv(f, "sprite_name"), (!truthy(rt.sv(f, "safety")) ? 1 : 0)]));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "safety"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.setFv(f, "desc", $0, fmt("The safety is ＀.", [$1]));
	$0 = live(user);
	if (truthy(rt.sv(f, "safety"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The safety is ＀.", [$1])]);
	return live(f.dot);
});

// /obj/item/weapon/extinguisher/proc/attack  (code/game/objects/items/weapons/extinguisher.dm:55)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/attack", function* attack(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help") && !truthy(rt.sv(f, "safety")))) {
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/extinguisher/proc/attack_obj  (code/game/objects/items/weapons/extinguisher.dm:61)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/attack_obj", function* attack_obj(f: Frame) {
	if (truthy((yield* g.srcCall(f, "AttemptRefill", live(f.args[0]), live(f.args[1]))))) {
		rt.setSv(f, "refilling", 1);
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/item/weapon/extinguisher/proc/examine  (code/game/objects/items/weapons/extinguisher.dm:68)
rt.def("/obj/item/weapon/extinguisher/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It contains ＀ units.", [rt.call(f, P("/proc/round"), null, [rt.fv(f, "total_volume", rt.sv(f, "reagents"))])])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is empty."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/extinguisher/proc/AttemptRefill  (code/game/objects/items/weapons/extinguisher.dm:75)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/AttemptRefill", function* AttemptRefill(f: Frame, target: Value, user: Value) {
	let safety_save: Value = null, W: Value = null, transferred: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [target, user, safety_save, W, transferred, R, $e];
	if ((truthy((rt.istype(live(target), T("/obj/structure/reagent_dispensers/watertank")) ? 1 : 0)) && truthy((yield* g.callName(f, live(target), "Adjacent", [live(user)]))))) {
		safety_save = rt.sv(f, "safety");
		rt.setSv(f, "safety", 1);
		if (isEqual(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is already full!</span>", [live(f.src)])]);
			rt.setSv(f, "safety", live(safety_save));
			return 1;
		}
		W = live(target);
		if (rt.gt((transferred = (yield* g.callName(f, rt.fv(f, "reagents", live(W)), "trans_to", [live(f.src), rt.sv(f, "max_water")]))), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ has been refilled by ＀ units.</span>", [live(f.src), live(transferred)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/refill.ogg"), 50, 1, -6]);
			R = null;
			rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent/water"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				rt.setFv(f, "cooling_temperature", live(R), rt.sv(f, "cooling_power"));
			}
			rt.endFor(f, 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is empty!</span>", [live(W)])]);
		}
		rt.setSv(f, "safety", live(safety_save));
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/item/weapon/extinguisher/proc/afterattack  (code/game/objects/items/weapons/extinguisher.dm:98)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/afterattack", function* afterattack(f: Frame) {
	let direction: Value = null, B: Value = null, movementdirection: Value = null, _T: Value = null, T1: Value = null, T2: Value = null, the_targets: Value = null, T3: Value = null, T4: Value = null, a: Value = null, W: Value = null, my_target: Value = null, R: Value = null, b: Value = null, A: Value = null;
	f.vars = () => [direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A];
	if (isEqual(rt.fv(f, "loc", live(f.args[0])), live(f.args[1]))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "refilling"))) {
		rt.setSv(f, "refilling", 0);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "safety"))) {
		if (rt.lt(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.src))), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＄！ is empty!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (rt.lt(rt.worldTime(f), add(rt.fv(f, "last_use", live(f.src)), 12))) {
			return live(f.dot);
		}
		rt.setFv(f, "last_use", live(f.src), rt.worldTime(f));
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/extinguish.ogg"), 75, 1, -3]);
		direction = rt.getDir(f, live(f.src), live(f.args[0]));
		if (((truthy(rt.fv(f, "buckled", live(f.args[1]))) && truthy((rt.istype(rt.fv(f, "buckled", live(f.args[1])), T("/obj")) ? 1 : 0))) && !truthy(rt.gv(f, "anchored", rt.fv(f, "buckled", live(f.args[1])))))) {
			rt.spawnTail(f, 0, "/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:119", direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A);
		} else {
			yield* g.callName(f, live(f.args[1]), "newtonian_move", [(yield* g.call(f, P("/proc/turn"), null, [live(direction), 180]))]);
		}
		_T = rt.getStep(f, live(f.args[0]), 0);
		T1 = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [live(direction), 90])));
		T2 = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [live(direction), -90])));
		the_targets = rt.list(live(_T), live(T1), live(T2));
		if (truthy(rt.sv(f, "precision"))) {
			T3 = rt.getStep(f, live(T1), (yield* g.call(f, P("/proc/turn"), null, [live(direction), 90])));
			T4 = rt.getStep(f, live(T2), (yield* g.call(f, P("/proc/turn"), null, [live(direction), -90])));
			the_targets = rt.list(live(_T), live(T1), live(T2), live(T3), live(T4));
		}
		a = null;
		a = 0;
		while (rt.lt(live(a), 5)) {
			rt.spawnTail(f, 0, "/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:152", direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A);
			a = rt.inc(live(a), 1);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["target", "user", "flag"] });

// a spawn(0) body of /obj/item/weapon/extinguisher/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:152", function* (f: Frame, direction: Value, B: Value, movementdirection: Value, _T: Value, T1: Value, T2: Value, the_targets: Value, T3: Value, T4: Value, a: Value, W: Value, my_target: Value, R: Value, b: Value, A: Value) {
	let $e: any;
	f.vars = () => [direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A, $e];
	W = (yield* g.new_(f, T("/obj/effect/particle_effect/water"), [rt.getStep(f, live(f.src), 0)]));
	my_target = rt.op(f, "PickUnweighted", [1], [live(the_targets)]);
	if (truthy(rt.sv(f, "precision"))) {
		(the_targets = rt.modify(live(the_targets), live(my_target), subtract));
	}
	R = (yield* g.new_(f, T("/datum/reagents"), [5]));
	if (!truthy(live(W))) {
		return live(f.dot);
	}
	rt.setFv(f, "reagents", live(W), live(R));
	rt.setFv(f, "my_atom", live(R), live(W));
	if ((!truthy(live(W)) || !truthy(live(f.src)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "trans_to", [live(W), 1]);
	b = null;
	b = 0;
	while (rt.lt(live(b), rt.sv(f, "power"))) {
		yield* g.call(f, P("/proc/step_towards"), null, [live(W), live(my_target)]);
		if ((!truthy(live(W)) || !truthy(rt.fv(f, "reagents", live(W))))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.fv(f, "reagents", live(W)), "reaction", [rt.getStep(f, live(W), 0)]);
		A = null;
		rt.forList(f, 0, rt.getStep(f, live(W), 0));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (!truthy(live(W))) {
				return live(f.dot);
			}
			yield* g.callName(f, rt.fv(f, "reagents", live(W)), "reaction", [live(A)]);
		}
		rt.endFor(f, 0);
		if (isEqual(rt.fv(f, "loc", live(W)), live(my_target))) {
			break;
		}
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		b = rt.inc(live(b), 1);
	}
	return null;
});

// a spawn(0) body of /obj/item/weapon/extinguisher/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:119", function* (f: Frame, direction: Value, B: Value, movementdirection: Value, _T: Value, T1: Value, T2: Value, the_targets: Value, T3: Value, T4: Value, a: Value, W: Value, my_target: Value, R: Value, b: Value, A: Value) {
	f.vars = () => [direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A];
	B = rt.fv(f, "buckled", live(f.args[1]));
	movementdirection = (yield* g.call(f, P("/proc/turn"), null, [live(direction), 180]));
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	yield* g.call(f, P("/proc/step"), null, [live(B), live(movementdirection)]);
	return null;
});

// /obj/item/weapon/extinguisher/proc/AltClick  (code/game/objects/items/weapons/extinguisher.dm:177)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "EmptyExtinguisher", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/extinguisher/proc/EmptyExtinguisher  (code/game/objects/items/weapons/extinguisher.dm:180)  may sleep
rt.def("/obj/item/weapon/extinguisher/proc/EmptyExtinguisher", function* EmptyExtinguisher(f: Frame, user: Value) {
	let _T: Value = null, theturf: Value = null;
	f.vars = () => [user, _T, theturf];
	if (!(isEqual(rt.sv(f, "loc"), live(user)) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	if (truthy((rt.istype((_T = rt.getStep(f, rt.sv(f, "loc"), 0)), T("/turf/open")) ? 1 : 0))) {
		yield* g.callName(f, (theturf = live(_T)), "MakeSlippery", ["min_wet_time", 10, "wet_time_to_add", 5], rt.Args.Named);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ empties out ％！ onto the floor using the release valve.", [live(user), live(f.src)]), fmt("<span class='info'>You quietly empty out ％！ using its release valve.</span>", [live(f.src)])]);
	return f.dot;
}, true);
