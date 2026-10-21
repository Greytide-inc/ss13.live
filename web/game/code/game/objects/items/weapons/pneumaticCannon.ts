// From code/game/objects/items/weapons/pneumaticCannon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7323, "/obj/item/weapon/pneumatic_cannon", "/obj/item/weapon", {
	maxWeightClass: 20,
	loadedWeightClass: 0,
	tank: null,
	gasPerThrow: 3,
	loadedItems: null,
	pressureSetting: 1,
	checktank: 1,
	range_multiplier: 1,
	throw_amount: 20,
	fire_mode: 1,
	automatic: 0,
	clumsyCheck: 1,
	name: "pneumatic cannon",
	desc: "A gas-powered cannon that can fire any object loaded into it.",
	w_class: 4,
	force: 8,
	attack_verb: null,
	icon: rt.rsc("icons/obj/pneumaticCannon.dmi"),
	icon_state: "pneumaticCannon",
	item_state: "bulldog",
	lefthand_file: rt.rsc("icons/mob/inhands/guns_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/guns_righthand.dmi"),
	armor: null,
});

// /obj/item/weapon/pneumatic_cannon/proc/<init>  (code/game/objects/items/weapons/pneumaticCannon.dm:21)
rt.def("/obj/item/weapon/pneumatic_cannon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loadedItems", rt.list());
	rt.setSv(f, "attack_verb", rt.list("bludgeoned", "smashed", "beaten"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 60, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/pneumatic_cannon/proc/examine  (code/game/objects/items/weapons/pneumaticCannon.dm:34)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/examine", function* examine(f: Frame) {
	let out: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [out, I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	out = rt.list();
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 1)) {
		out = rt.modify(live(out), "<span class='notice'>You'll need to get closer to see any more.</span>", add);
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "loadedItems"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		out = rt.modify(live(out), fmt("<span class='info'>＀ It has ％！ loaded.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(I)])), live(I)]), add);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "tank"))) {
		out = rt.modify(live(out), fmt("<span class='notice'>＀ It has ％！ mounted onto it.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "tank")])), rt.sv(f, "tank")]), add);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), (yield* g.callName(f, live(out), "Join", ["<br>"]))]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/pneumatic_cannon/proc/attackby  (code/game/objects/items/weapons/pneumaticCannon.dm:47)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/attackby", function* attackby(f: Frame) {
	let IT: Value = null, IW: Value = null;
	let $0: any;
	f.vars = () => [IT, IW, $0];
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tank/internals")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "tank"))) {
			if (rt.le(rt.gv(f, "volume", (IT = live(f.args[0]))), 3)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is too small for ％！.</span>", [live(IT), live(f.src)])]);
				return live(f.dot);
			}
			yield* g.srcCall(f, "updateTank", live(f.args[0]), 0, live(f.args[1]));
		}
	} else {
		if (isEqual(rt.fv(f, "type", live(f.args[0])), rt.sv(f, "type"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You're fairly certain that putting a pneumatic cannon inside another pneumatic cannon would cause a spacetime disruption.</span>"]);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				$0 = rt.sv(f, "pressureSetting");
				if ($0 === 1) {
					rt.setSv(f, "pressureSetting", 2);
				} else if ($0 === 2) {
					rt.setSv(f, "pressureSetting", 3);
				} else if ($0 === 3) {
					rt.setSv(f, "pressureSetting", 1);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You tweak ％！'s pressure output to ＀.</span>", [live(f.src), rt.sv(f, "pressureSetting")])]);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
					if (truthy(rt.sv(f, "tank"))) {
						yield* g.srcCall(f, "updateTank", rt.sv(f, "tank"), 1, live(f.args[1]));
					}
				} else {
					if (rt.ge(rt.sv(f, "loadedWeightClass"), rt.sv(f, "maxWeightClass"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ can't hold any more items!</span>", [live(f.src)])]);
					} else {
						if (!truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) return f.dot;
						yield* g.srcCall(f, "load_item", (IW = live(f.args[0])), live(f.args[1]));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/pneumatic_cannon/proc/can_load_item  (code/game/objects/items/weapons/pneumaticCannon.dm:77)
rt.def("/obj/item/weapon/pneumatic_cannon/proc/can_load_item", function can_load_item(f: Frame, I: Value, user: Value) {
	if (rt.gt(add(rt.sv(f, "loadedWeightClass"), rt.fv(f, "w_class", live(I))), rt.sv(f, "maxWeightClass"))) {
		if (truthy(live(user))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ won't fit into ％！!</span>", [live(I), live(f.src)])]);
		}
		return 0;
	}
	if (rt.gt(rt.fv(f, "w_class", live(I)), rt.sv(f, "w_class"))) {
		if (truthy(live(user))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is too large to fit into ％！!</span>", [live(I), live(f.src)])]);
		}
		return 0;
	}
	return 1;
});

// /obj/item/weapon/pneumatic_cannon/proc/load_item  (code/game/objects/items/weapons/pneumaticCannon.dm:88)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/load_item", function* load_item(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (!truthy((yield* g.srcCall(f, "can_load_item", live(I), live(user))))) {
		return 0;
	}
	if (truthy(live(user))) {
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)])))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You load ％！ into ％！.</span>", [live(I), live(f.src)])]);
	} else {
		yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
	}
	rt.modSrcVar(f, "loadedItems", live(I), add);
	rt.modSrcVar(f, "loadedWeightClass", rt.fv(f, "w_class", live(I)), add);
	return 1;
}, true);

// /obj/item/weapon/pneumatic_cannon/proc/afterattack  (code/game/objects/items/weapons/pneumaticCannon.dm:101)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	f.vars = () => [target, user, flag, params];
	if ((truthy(live(flag)) && isEqual(rt.fv(f, "a_intent", live(user)), "harm"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "Fire", live(user), live(target));
	return f.dot;
}, true);

// /obj/item/weapon/pneumatic_cannon/proc/Fire  (code/game/objects/items/weapons/pneumaticCannon.dm:108)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/Fire", function* Fire(f: Frame, user: Value, target: Value) {
	let discharge: Value = null, possible_targets: Value = null, _T: Value = null;
	f.vars = () => [user, target, discharge, possible_targets, _T];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(live(target)))) {
		return live(f.dot);
	}
	discharge = 0;
	if (truthy((yield* g.callName(f, rt.fv(f, "dna", live(user)), "check_mutation", ["Hulk"])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your meaty finger is much too large for the trigger guard!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, 11, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(user))))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your fingers don't fit in the trigger guard!</span>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "loadedItems")) || !truthy(rt.sv(f, "loadedWeightClass")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ has nothing loaded.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "tank")) && truthy(rt.sv(f, "checktank")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ can't fire without a source of gas.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "tank")) && !truthy((yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "tank")), "remove", [multiply(rt.sv(f, "gasPerThrow"), rt.sv(f, "pressureSetting"))]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ lets out a weak hiss and doesn't react!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [75]))) && truthy(rt.sv(f, "clumsyCheck")))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ loses their grip on ＀, causing it to go off!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>＀ slips out of your hands and goes off!</span>", [live(f.src)])]);
		yield* g.callName(f, live(user), "drop_item", []);
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			target = rt.getStep(f, live(user), 0);
		} else {
			target = rt.op(f, "PickUnweighted", [1], [(possible_targets = (yield* g.call(f, P("/proc/range"), null, [3, live(f.src)])))]);
		}
		discharge = 1;
	}
	if (!truthy(live(discharge))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ fires ％！!</span>", [live(user), live(f.src)]), fmt("<span class='danger'>You fire ％！!</span>", [live(f.src)])]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "fired at", live(f.src)]);
	_T = (yield* g.srcCall(f, "get_target", live(target), rt.getStep(f, live(f.src), 0)));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/sonic_jackhammer.ogg"), 50, 1]);
	yield* g.srcCall(f, "fire_items", live(_T), live(user));
	if (!(rt.ge(rt.sv(f, "pressureSetting"), 3) && truthy(live(user)))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ is thrown down by the force of the cannon!</span>", [live(user)]), fmt("<span class='userdanger'>＀ slams into your shoulder, knocking you down!", [live(f.src)])]);
	yield* g.callName(f, live(user), "Knockdown", [60]);
	return f.dot;
}, true);

// /obj/item/weapon/pneumatic_cannon/proc/fire_items  (code/game/objects/items/weapons/pneumaticCannon.dm:147)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/fire_items", function* fire_items(f: Frame, target: Value, user: Value) {
	let ITD: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [target, user, ITD, i, I, $e];
	if (isEqual(rt.sv(f, "fire_mode"), 1)) {
		ITD = null;
		rt.forList(f, 0, rt.sv(f, "loadedItems"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ITD = $e;
			if (!truthy((yield* g.srcCall(f, "throw_item", live(target), live(ITD), live(user))))) {
				break;
			}
		}
		rt.endFor(f, 0);
	} else {
		i = null;
		rt.forRange(f, 0, 1, rt.sv(f, "throw_amount"), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!truthy(rt.len(f, rt.sv(f, "loadedItems")))) {
				break;
			}
			I = null;
			if (isEqual(rt.sv(f, "fire_mode"), 2)) {
				I = rt.index(rt.sv(f, "loadedItems"), rt.len(f, rt.sv(f, "loadedItems")));
			} else {
				I = rt.index(rt.sv(f, "loadedItems"), 1);
			}
			if (!truthy((yield* g.srcCall(f, "throw_item", live(target), live(I), live(user))))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/item/weapon/pneumatic_cannon/proc/throw_item  (code/game/objects/items/weapons/pneumaticCannon.dm:164)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/throw_item", function* throw_item(f: Frame, target: Value, I: Value, user: Value) {
	f.vars = () => [target, I, user];
	if (!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	(rt.modSrcVar(f, "loadedItems", live(I), subtract));
	(rt.modSrcVar(f, "loadedWeightClass", rt.fv(f, "w_class", live(I)), subtract));
	yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.callName(f, live(I), "throw_at", [live(target), multiply(multiply(rt.sv(f, "pressureSetting"), 10), rt.sv(f, "range_multiplier")), multiply(rt.sv(f, "pressureSetting"), 2), live(user)]);
	return 1;
}, true);

// /obj/item/weapon/pneumatic_cannon/proc/get_target  (code/game/objects/items/weapons/pneumaticCannon.dm:173)
rt.def("/obj/item/weapon/pneumatic_cannon/proc/get_target", function get_target(f: Frame, target: Value, starting: Value) {
	let x_o: Value = null, y_o: Value = null, new_x: Value = null, new_y: Value = null, newtarget: Value = null;
	f.vars = () => [x_o, y_o, new_x, new_y, newtarget];
	if (isEqual(rt.sv(f, "range_multiplier"), 1)) {
		return live(target);
	}
	x_o = subtract(rt.fv(f, "x", live(target)), rt.fv(f, "x", live(starting)));
	y_o = subtract(rt.fv(f, "y", live(target)), rt.fv(f, "y", live(starting)));
	new_x = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(starting)), multiply(live(x_o), rt.sv(f, "range_multiplier"))), rt.fv(f, "maxx", rt.world())])]);
	new_y = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(starting)), multiply(live(y_o), rt.sv(f, "range_multiplier"))), rt.fv(f, "maxy", rt.world())])]);
	return (newtarget = rt.locate(live(new_x), live(new_y), rt.fv(f, "z", live(starting))));
});

// /obj/item/weapon/pneumatic_cannon/proc/updateTank  (code/game/objects/items/weapons/pneumaticCannon.dm:192)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/updateTank", function* updateTank(f: Frame, thetank: Value, removing: Value, user: Value) {
	f.vars = () => [thetank, removing, user];
	if (live(removing) === null) {
		removing = 0;
	}
	if (truthy(live(removing))) {
		if (!truthy(rt.fv(f, "tank", live(f.src)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You detach ％！ from ％！.</span>", [live(thetank), live(f.src)])]);
		rt.setFv(f, "loc", rt.fv(f, "tank", live(f.src)), rt.getStep(f, live(user), 0));
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "tank")]);
		rt.setFv(f, "tank", live(f.src), null);
	}
	if (!truthy(live(removing))) {
		if (truthy(rt.fv(f, "tank", live(f.src)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ already has a tank.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(thetank), live(f.src)])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You hook ％！ up to ％！.</span>", [live(thetank), live(f.src)])]);
		rt.setFv(f, "tank", live(f.src), live(thetank));
	}
	yield* g.callName(f, live(f.src), "update_icons", []);
	return f.dot;
}, true);

// /obj/item/weapon/pneumatic_cannon/proc/update_icons  (code/game/objects/items/weapons/pneumaticCannon.dm:209)
rt.def("/obj/item/weapon/pneumatic_cannon/proc/update_icons", function update_icons(f: Frame) {
	rt.callName(f, live(f.src), "cut_overlays", []);
	if (!truthy(rt.sv(f, "tank"))) {
		return live(f.dot);
	}
	rt.callSrc(f, "add_overlay", [rt.fv(f, "icon_state", rt.sv(f, "tank"))]);
	rt.callName(f, live(f.src), "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/pneumatic_cannon/proc/fill_with_type  (code/game/objects/items/weapons/pneumaticCannon.dm:216)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/proc/fill_with_type", function* fill_with_type(f: Frame, type: Value, amount: Value) {
	let loaded: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [type, amount, loaded, i, I, $e];
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [live(type), T("/obj/item")])))) {
		return 0;
	}
	loaded = 0;
	i = null;
	rt.forRange(f, 0, 1, live(amount), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy((yield* g.srcCall(f, "load_item", (I = (yield* g.new_(f, live(type), []))), null)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
			return live(loaded);
		}
		loaded = rt.inc(live(loaded), 1);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7325, "/obj/item/weapon/pneumatic_cannon/pie", "/obj/item/weapon/pneumatic_cannon", {
	gasPerThrow: 0,
	checktank: 0,
	range_multiplier: 3,
	fire_mode: 3,
	throw_amount: 1,
	maxWeightClass: 150,
	clumsyCheck: 0,
	name: "pie cannon",
	desc: "Load cream pie for optimal results",
	force: 10,
	icon_state: "piecannon",
});

// /obj/item/weapon/pneumatic_cannon/pie/proc/can_load_item  (code/game/objects/items/weapons/pneumaticCannon.dm:241)
rt.def("/obj/item/weapon/pneumatic_cannon/pie/proc/can_load_item", function can_load_item(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/pie")) ? 1 : 0))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ only accepts pies!</span>", [live(f.src)])]);
	return 0;
}, false, { args: ["I", "user"] });

rt.type(7326, "/obj/item/weapon/pneumatic_cannon/pie/selfcharge", "/obj/item/weapon/pneumatic_cannon/pie", {
	charge_amount: 1,
	charge_ticks: 1,
	charge_tick: 0,
	automatic: 1,
	maxWeightClass: 60,
});

// /obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/Initialize  (code/game/objects/items/weapons/pneumaticCannon.dm:254)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/Destroy  (code/game/objects/items/weapons/pneumaticCannon.dm:258)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/process  (code/game/objects/items/weapons/pneumaticCannon.dm:262)  may sleep
rt.def("/obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/process", function* process(f: Frame) {
	if (!rt.ge(rt.incSrcVar(f, "charge_tick", 1, false), rt.sv(f, "charge_ticks"))) return f.dot;
	yield* g.srcCall(f, "fill_with_type", T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), rt.sv(f, "charge_amount"));
	return f.dot;
}, true, { waitfor: false });
