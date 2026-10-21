// From code/game/objects/items/weapons/tanks/watertank.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7470, "/obj/item/weapon/watertank", "/obj/item/weapon", {
	noz: null,
	on: 0,
	volume: 500,
	name: "backpack water tank",
	desc: "A S.U.N.S.H.I.N.E. brand watertank backpack with nozzle to water plants.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "waterbackpack",
	item_state: "waterbackpack",
	w_class: 4,
	slot_flags: 1024,
	slowdown: 1,
	actions_types: null,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/watertank/proc/<init>  (code/game/objects/items/weapons/tanks/watertank.dm:11)
rt.def("/obj/item/weapon/watertank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_mister")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/watertank/proc/New  (code/game/objects/items/weapons/tanks/watertank.dm:22)  may sleep
rt.def("/obj/item/weapon/watertank/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", rt.sv(f, "volume"));
	rt.setSv(f, "noz", (yield* g.srcCall(f, "make_noz")));
	return f.dot;
}, true);

// /obj/item/weapon/watertank/proc/ui_action_click  (code/game/objects/items/weapons/tanks/watertank.dm:27)  may sleep
rt.def("/obj/item/weapon/watertank/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "toggle_mister");
	return f.dot;
}, true);

// /obj/item/weapon/watertank/proc/item_action_slot_check  (code/game/objects/items/weapons/tanks/watertank.dm:30)
rt.def("/obj/item/weapon/watertank/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), rt.callName(f, live(user), "getBackSlot", []))) return f.dot;
	return 1;
});

// /obj/item/weapon/watertank/verb/toggle_mister  (code/game/objects/items/weapons/tanks/watertank.dm:36)  may sleep
rt.def("/obj/item/weapon/watertank/verb/toggle_mister", function* toggle_mister(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (!isEqual((yield* g.callName(f, live(f.usr), "get_item_by_slot", [(yield* g.callName(f, live(f.usr), "getBackSlot", []))])), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The watertank must be worn properly to use!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return live(f.dot);
	}
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	user = live(f.usr);
	if (truthy(rt.sv(f, "on"))) {
		if (rt.sv(f, "noz") === null) {
			rt.setSv(f, "noz", (yield* g.srcCall(f, "make_noz")));
		}
		if (!truthy((yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "noz")])))) {
			rt.setSv(f, "on", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need a free hand to hold the mister!</span>"]);
			return live(f.dot);
		}
		rt.setFv(f, "loc", rt.sv(f, "noz"), live(user));
	} else {
		yield* g.srcCall(f, "remove_noz");
	}
	return live(f.dot);
}, true, { verb: { name: "Toggle Mister", category: "Object" } });

// /obj/item/weapon/watertank/proc/make_noz  (code/game/objects/items/weapons/tanks/watertank.dm:60)  may sleep
rt.def("/obj/item/weapon/watertank/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/mister"), [live(f.src)]));
}, true);

// /obj/item/weapon/watertank/proc/equipped  (code/game/objects/items/weapons/tanks/watertank.dm:63)  may sleep
rt.def("/obj/item/weapon/watertank/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[1]), 1)) return f.dot;
	yield* g.srcCall(f, "remove_noz");
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/weapon/watertank/proc/remove_noz  (code/game/objects/items/weapons/tanks/watertank.dm:68)  may sleep
rt.def("/obj/item/weapon/watertank/proc/remove_noz", function* remove_noz(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", rt.sv(f, "noz"))])))) {
		yield* g.callName(f, (M = rt.fv(f, "loc", rt.sv(f, "noz"))), "temporarilyRemoveItemFromInventory", [rt.sv(f, "noz"), 1]);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/watertank/proc/Destroy  (code/game/objects/items/weapons/tanks/watertank.dm:75)  may sleep
rt.def("/obj/item/weapon/watertank/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "noz")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/watertank/proc/attack_hand  (code/game/objects/items/weapons/tanks/watertank.dm:79)  may sleep
rt.def("/obj/item/weapon/watertank/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.src)), live(f.args[0]))) {
		yield* g.srcCall(f, "ui_action_click");
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/watertank/proc/MouseDrop  (code/game/objects/items/weapons/tanks/watertank.dm:86)  may sleep
rt.def("/obj/item/weapon/watertank/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (!(truthy((rt.istype((M = rt.fv(f, "loc", live(f.src))), T("/mob")) ? 1 : 0)) && truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0)))) return f.dot;
	H = live(over_object);
	yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
	return f.dot;
}, true);

// /obj/item/weapon/watertank/proc/attackby  (code/game/objects/items/weapons/tanks/watertank.dm:91)  may sleep
rt.def("/obj/item/weapon/watertank/proc/attackby", function* attackby(f: Frame) {
	if (isEqual(live(f.args[0]), rt.sv(f, "noz"))) {
		yield* g.srcCall(f, "remove_noz");
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(6373, "/obj/item/weapon/reagent_containers/spray/mister", "/obj/item/weapon/reagent_containers/spray", {
	tank: null,
	flags: 6,
	container_type: 4096,
	name: "water mister",
	desc: "A mister nozzle attached to a water tank.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "mister",
	item_state: "mister",
	w_class: 4,
	amount_per_transfer_from_this: 50,
	possible_transfer_amounts: null,
	volume: 500,
	slot_flags: 0,
});

// /obj/item/weapon/reagent_containers/spray/mister/proc/New  (code/game/objects/items/weapons/tanks/watertank.dm:118)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/check_tank_exists"), null, [live(f.args[0]), live(f.src)])))) {
		rt.setSv(f, "tank", live(f.args[0]));
		rt.setSv(f, "reagents", rt.fv(f, "reagents", rt.sv(f, "tank")));
		rt.setSv(f, "loc", rt.sv(f, "tank"));
	}
	return live(f.dot);
}, true, { args: ["parent_tank"] });

// /obj/item/weapon/reagent_containers/spray/mister/proc/dropped  (code/game/objects/items/weapons/tanks/watertank.dm:126)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The mister snaps back onto the watertank.</span>"]);
	rt.setFv(f, "on", rt.sv(f, "tank"), 0);
	rt.setSv(f, "loc", rt.sv(f, "tank"));
	return f.dot;
}, true, { args: ["user"] });

// /proc/check_tank_exists  (code/game/objects/items/weapons/tanks/watertank.dm:135)  may sleep
rt.def("/proc/check_tank_exists", function* check_tank_exists(f: Frame, parent_tank: Value, M: Value, O: Value) {
	f.vars = () => [parent_tank, M, O];
	if ((!truthy(live(parent_tank)) || !truthy((rt.istype(live(parent_tank), T("/obj/item/weapon/watertank")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		return 0;
	} else {
		return 1;
	}
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/spray/mister/proc/Move  (code/game/objects/items/weapons/tanks/watertank.dm:142)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "tank")))) return f.dot;
	rt.setSv(f, "loc", rt.fv(f, "loc", rt.sv(f, "tank")));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/spray/mister/proc/afterattack  (code/game/objects/items/weapons/tanks/watertank.dm:147)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/afterattack", function* afterattack(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.args[0])), rt.sv(f, "loc"))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(7471, "/obj/item/weapon/watertank/janitor", "/obj/item/weapon/watertank", {
	name: "backpack water tank",
	desc: "A janitorial watertank backpack with nozzle to clean dirt and graffiti.",
	icon_state: "waterbackpackjani",
	item_state: "waterbackpackjani",
});

// /obj/item/weapon/watertank/janitor/proc/New  (code/game/objects/items/weapons/tanks/watertank.dm:159)  may sleep
rt.def("/obj/item/weapon/watertank/janitor/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["cleaner", 500]);
	return f.dot;
}, true);

rt.type(6374, "/obj/item/weapon/reagent_containers/spray/mister/janitor", "/obj/item/weapon/reagent_containers/spray/mister", {
	name: "janitor spray nozzle",
	desc: "A janitorial spray nozzle attached to a watertank, designed to clean up large messes.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "misterjani",
	item_state: "misterjani",
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
});

// /obj/item/weapon/reagent_containers/spray/mister/janitor/proc/<init>  (code/game/objects/items/weapons/tanks/watertank.dm:169)
rt.def("/obj/item/weapon/reagent_containers/spray/mister/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/watertank/janitor/proc/make_noz  (code/game/objects/items/weapons/tanks/watertank.dm:172)  may sleep
rt.def("/obj/item/weapon/watertank/janitor/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/mister/janitor"), [live(f.src)]));
}, true);

// /obj/item/weapon/reagent_containers/spray/mister/janitor/proc/attack_self  (code/game/objects/items/weapons/tanks/watertank.dm:175)
rt.def("/obj/item/weapon/reagent_containers/spray/mister/janitor/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (isEqual(rt.sv(f, "amount_per_transfer_from_this"), 10)) {
		$0 = 5;
	} else {
		$0 = 10;
	}
	rt.setSv(f, "amount_per_transfer_from_this", $0);
	$0 = live(user);
	if (isEqual(rt.sv(f, "amount_per_transfer_from_this"), 10)) {
		$1 = "remove";
	} else {
		$1 = "fix";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the nozzle. You'll now use ＀ units per spray.</span>", [$1, rt.sv(f, "amount_per_transfer_from_this")])]);
	return f.dot;
});

rt.type(7472, "/obj/item/weapon/watertank/atmos", "/obj/item/weapon/watertank", {
	volume: 200,
	name: "backpack firefighter tank",
	desc: "A refridgerated and pressurized backpack tank with extinguisher nozzle, intended to fight fires. Swaps between extinguisher, resin launcher and a smaller scale resin foamer.",
	item_state: "waterbackpackatmos",
	icon_state: "waterbackpackatmos",
	slowdown: 0,
});

// /obj/item/weapon/watertank/atmos/proc/New  (code/game/objects/items/weapons/tanks/watertank.dm:193)  may sleep
rt.def("/obj/item/weapon/watertank/atmos/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["water", 200]);
	return f.dot;
}, true);

// /obj/item/weapon/watertank/atmos/proc/make_noz  (code/game/objects/items/weapons/tanks/watertank.dm:197)  may sleep
rt.def("/obj/item/weapon/watertank/atmos/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* g.new_(f, T("/obj/item/weapon/extinguisher/mini/nozzle"), [live(f.src)]));
}, true);

// /obj/item/weapon/watertank/atmos/proc/dropped  (code/game/objects/items/weapons/tanks/watertank.dm:200)  may sleep
rt.def("/obj/item/weapon/watertank/atmos/proc/dropped", function* dropped(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", "waterbackpackatmos");
	if (!truthy((rt.istype(rt.sv(f, "noz"), T("/obj/item/weapon/extinguisher/mini/nozzle")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "nozzle_mode", (N = rt.sv(f, "noz")), 0);
	return f.dot;
}, true, { args: ["user"] });

rt.type(7228, "/obj/item/weapon/extinguisher/mini/nozzle", "/obj/item/weapon/extinguisher/mini", {
	tank: null,
	nozzle_mode: 0,
	metal_synthesis_cooldown: 0,
	resin_cooldown: 0,
	safety: 0,
	max_water: 200,
	power: 8,
	precision: 1,
	cooling_power: 5,
	flags: 2,
	name: "extinguisher nozzle",
	desc: "A heavy duty nozzle attached to a firefighter's backpack tank.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "atmos_nozzle",
	item_state: "nozzleatmos",
	force: 10,
	w_class: 5,
});

// /obj/item/weapon/extinguisher/mini/nozzle/proc/New  (code/game/objects/items/weapons/tanks/watertank.dm:226)  may sleep
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/check_tank_exists"), null, [live(f.args[0]), live(f.src)])))) return f.dot;
	rt.setSv(f, "tank", live(f.args[0]));
	rt.setSv(f, "reagents", rt.fv(f, "reagents", rt.sv(f, "tank")));
	rt.setSv(f, "max_water", rt.fv(f, "volume", rt.sv(f, "tank")));
	rt.setSv(f, "loc", rt.sv(f, "tank"));
	return f.dot;
}, true, { args: ["parent_tank"] });

// /obj/item/weapon/extinguisher/mini/nozzle/proc/Move  (code/game/objects/items/weapons/tanks/watertank.dm:235)  may sleep
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "tank")))) {
		rt.setSv(f, "loc", rt.sv(f, "tank"));
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/extinguisher/mini/nozzle/proc/attack_self  (code/game/objects/items/weapons/tanks/watertank.dm:241)
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "nozzle_mode");
	if ($0 === 0) {
		rt.setSv(f, "nozzle_mode", 1);
		rt.setFv(f, "icon_state", rt.sv(f, "tank"), "waterbackpackatmos_1");
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Swapped to resin launcher"]);
		return live(f.dot);
	} else if ($0 === 1) {
		rt.setSv(f, "nozzle_mode", 2);
		rt.setFv(f, "icon_state", rt.sv(f, "tank"), "waterbackpackatmos_2");
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Swapped to resin foamer"]);
		return live(f.dot);
	} else if ($0 === 2) {
		rt.setSv(f, "nozzle_mode", 0);
		rt.setFv(f, "icon_state", rt.sv(f, "tank"), "waterbackpackatmos_0");
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Swapped to water extinguisher"]);
		return live(f.dot);
	}
	return live(f.dot);
});

// /obj/item/weapon/extinguisher/mini/nozzle/proc/dropped  (code/game/objects/items/weapons/tanks/watertank.dm:260)  may sleep
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The nozzle snaps back onto the tank!</span>"]);
	rt.setFv(f, "on", rt.sv(f, "tank"), 0);
	rt.setSv(f, "loc", rt.sv(f, "tank"));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack  (code/game/objects/items/weapons/tanks/watertank.dm:266)  may sleep
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack", function* afterattack(f: Frame) {
	let Adj: Value = null, R: Value = null, A: Value = null, a: Value = null, S: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [Adj, R, A, a, S, F, $e];
	if (isEqual(rt.sv(f, "nozzle_mode"), 0)) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (truthy((Adj = (yield* g.callName(f, live(f.args[1]), "Adjacent", [live(f.args[0])]))))) {
		yield* g.srcCall(f, "AttemptRefill", live(f.args[0]), live(f.args[1]));
	}
	if (isEqual(rt.sv(f, "nozzle_mode"), 1)) {
		if (truthy(live(Adj))) {
			return live(f.dot);
		}
		if (rt.lt(rt.gv(f, "total_volume", (R = rt.sv(f, "reagents"))), 100)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least 100 units of water to use the resin launcher!</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "resin_cooldown"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Resin launcher is still recharging...</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "resin_cooldown", 1);
		yield* g.callName(f, live(R), "remove_any", [100]);
		A = (yield* g.new_(f, T("/obj/effect/resin_container"), [rt.getStep(f, live(f.src), 0)]));
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ used Resin Launcher at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.args[1])), rt.fv(f, "y", live(f.args[1])), rt.fv(f, "z", live(f.args[1]))])])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/syringeproj.ogg"), 40, 1]);
		a = null;
		a = 0;
		while (rt.lt(live(a), 5)) {
			yield* g.call(f, P("/proc/step_towards"), null, [live(A), live(f.args[0])]);
			yield* g.call(f, P("/proc/sleep"), null, [2]);
			a = rt.inc(live(a), 1);
		}
		yield* g.callName(f, live(A), "Smoke", []);
		rt.spawnTail(f, 100, "/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:291", Adj, R, A, a, S, F);
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "nozzle_mode"), 2)) return f.dot;
	if ((!truthy(live(Adj)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))))) {
		return live(f.dot);
	}
	S = null;
	rt.forList(f, 0, live(f.args[0]));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((truthy((rt.istype(live(S), T("/obj/effect/particle_effect/foam/metal/resin")) ? 1 : 0)) || truthy((rt.istype(live(S), T("/obj/structure/foamedmetal/resin")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already resin here!</span>"]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (rt.lt(rt.sv(f, "metal_synthesis_cooldown"), 5)) {
		rt.setFv(f, "amount", (F = (yield* g.new_(f, T("/obj/effect/particle_effect/foam/metal/resin"), [rt.getStep(f, live(f.args[0]), 0)]))), 0);
		rt.incSrcVar(f, "metal_synthesis_cooldown", 1, true);
		rt.spawnTail(f, 100, "/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:306", Adj, R, A, a, S, F);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Resin foam mix is still being synthesized...</span>"]);
		return live(f.dot);
	}
	return f.dot;
}, true, { args: ["target", "user"] });

// a spawn(100) body of /obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:306", function* (f: Frame, Adj: Value, R: Value, A: Value, a: Value, S: Value, F: Value) {
	f.vars = () => [Adj, R, A, a, S, F];
	rt.incSrcVar(f, "metal_synthesis_cooldown", -1, true);
	return null;
});

// a spawn(100) body of /obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:291", function* (f: Frame, Adj: Value, R: Value, A: Value, a: Value, S: Value, F: Value) {
	f.vars = () => [Adj, R, A, a, S, F];
	if (truthy(live(f.src))) {
		rt.setSv(f, "resin_cooldown", 0);
	}
	return null;
});

rt.type(11953, "/obj/effect/resin_container", "/obj/effect", {
	pass_flags: 1,
	name: "resin container",
	desc: "A compacted ball of expansive resin, used to repair the atmosphere in a room, or seal off breaches.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "frozen_smoke_capsule",
	mouse_opacity: 0,
});

// /obj/effect/resin_container/proc/Smoke  (code/game/objects/items/weapons/tanks/watertank.dm:321)  may sleep
rt.def("/obj/effect/resin_container/proc/Smoke", function* Smoke(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setFv(f, "amount", (S = (yield* g.new_(f, T("/obj/effect/particle_effect/foam/metal/resin"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))), 3);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bamf.ogg"), 100, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6389, "/obj/item/weapon/reagent_containers/chemtank", "/obj/item/weapon/reagent_containers", {
	on: 0,
	usage_ratio: 5,
	injection_amount: 1,
	container_type: 4096,
	name: "backpack chemical injector",
	desc: "A chemical autoinjector that can be carried on your back.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "waterbackpackatmos",
	item_state: "waterbackpackatmos",
	w_class: 4,
	slot_flags: 1024,
	slowdown: 1,
	actions_types: null,
	volume: 300,
	amount_per_transfer_from_this: 5,
	spillable: 0,
	possible_transfer_amounts: null,
});

// /obj/item/weapon/reagent_containers/chemtank/proc/<init>  (code/game/objects/items/weapons/tanks/watertank.dm:339)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/activate_injector")));
	rt.setSv(f, "possible_transfer_amounts", rt.list(5, 10, 15));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/ui_action_click  (code/game/objects/items/weapons/tanks/watertank.dm:351)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/ui_action_click", function ui_action_click(f: Frame) {
	rt.callSrc(f, "toggle_injection", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/item_action_slot_check  (code/game/objects/items/weapons/tanks/watertank.dm:354)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), 1)) return f.dot;
	return 1;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/toggle_injection  (code/game/objects/items/weapons/tanks/watertank.dm:358)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/toggle_injection", function toggle_injection(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (!truthy((rt.istype((user = live(f.usr)), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual(rt.callName(f, live(user), "get_item_by_slot", [1]), live(f.src))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The chemtank needs to be on your back before you can activate it!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on"))) {
		rt.callSrc(f, "turn_off", []);
	} else {
		rt.callSrc(f, "turn_on", []);
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/update_filling  (code/game/objects/items/weapons/tanks/watertank.dm:371)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/update_filling", function update_filling(f: Frame) {
	let filling: Value = null, percent: Value = null;
	let $0: any;
	f.vars = () => [filling, percent, $0];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/reagentfillings.dmi"), "backpack-10"]);
	$0 = (percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")), 100)]));
	if (rt.inRange($0, 0, 15)) {
		rt.setFv(f, "icon_state", live(filling), "backpack-10");
	} else if (rt.inRange($0, 16, 60)) {
		rt.setFv(f, "icon_state", live(filling), "backpack50");
	} else if (rt.inRange($0, 61, 9.999999848243207e+30)) {
		rt.setFv(f, "icon_state", live(filling), "backpack100");
	}
	rt.setFv(f, "color", live(filling), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
	rt.callSrc(f, "add_overlay", [live(filling)]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/worn_overlays  (code/game/objects/items/weapons/tanks/watertank.dm:389)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	let filling: Value = null, percent: Value = null;
	let $0: any;
	f.vars = () => [isinhands, filling, percent, $0];
	if (live(isinhands) === null) {
		isinhands = 0;
	}
	f.dot = rt.list();
	if (!(!truthy(live(isinhands)) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) return f.dot;
	filling = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/reagentfillings.dmi"), "backpackmob-10"]);
	$0 = (percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")), 100)]));
	if (rt.inRange($0, 0, 15)) {
		rt.setFv(f, "icon_state", live(filling), "backpackmob-10");
	} else if (rt.inRange($0, 16, 60)) {
		rt.setFv(f, "icon_state", live(filling), "backpackmob50");
	} else if (rt.inRange($0, 61, 9.999999848243207e+30)) {
		rt.setFv(f, "icon_state", live(filling), "backpackmob100");
	}
	rt.setFv(f, "color", live(filling), rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.fv(f, "reagent_list", rt.sv(f, "reagents"))]));
	f.dot = rt.modify(live(f.dot), live(filling), add);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/turn_on  (code/game/objects/items/weapons/tanks/watertank.dm:408)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/turn_on", function turn_on(f: Frame) {
	rt.setSv(f, "on", 1);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='notice'>＀ turns on.</span>", [live(f.src)])]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/turn_off  (code/game/objects/items/weapons/tanks/watertank.dm:414)
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/turn_off", function turn_off(f: Frame) {
	rt.setSv(f, "on", 0);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='notice'>＀ turns off.</span>", [live(f.src)])]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/chemtank/proc/process  (code/game/objects/items/weapons/tanks/watertank.dm:419)  may sleep
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/process", function* process(f: Frame) {
	let user: Value = null, used_amount: Value = null;
	f.vars = () => [user, used_amount];
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.srcCall(f, "turn_off");
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.srcCall(f, "turn_off");
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "back", (user = rt.sv(f, "loc"))), live(f.src))) {
		yield* g.srcCall(f, "turn_off");
		return live(f.dot);
	}
	used_amount = divide(rt.sv(f, "injection_amount"), rt.sv(f, "usage_ratio"));
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(user), 5, rt.sv(f, "injection_amount"), 0]);
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [null, live(user), null, live(used_amount), "multiplier", rt.sv(f, "usage_ratio")], rt.Args.Named);
	yield* g.srcCall(f, "update_filling");
	yield* g.callName(f, live(user), "update_inv_back", []);
	return f.dot;
}, true, { waitfor: false });

rt.type(7473, "/obj/item/weapon/watertank/operator", "/obj/item/weapon/watertank", {
	volume: 2000,
	name: "backpack water tank",
	desc: "A New Russian backpack spray for systematic cleansing of carbon lifeforms.",
	icon_state: "waterbackpackjani",
	item_state: "waterbackpackjani",
	w_class: 3,
	slowdown: 0,
});

// /obj/item/weapon/watertank/operator/proc/New  (code/game/objects/items/weapons/tanks/watertank.dm:447)  may sleep
rt.def("/obj/item/weapon/watertank/operator/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["mutagen", 350]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["napalm", 125]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["welding_fuel", 125]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["clf3", 300]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["cryptobiolin", 350]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["plasma", 250]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["condensedcapsaicin", 500]);
	return f.dot;
}, true);

// /obj/item/weapon/watertank/operator/proc/make_noz  (code/game/objects/items/weapons/tanks/watertank.dm:467)  may sleep
rt.def("/obj/item/weapon/watertank/operator/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/mister/operator"), [live(f.src)]));
}, true);
