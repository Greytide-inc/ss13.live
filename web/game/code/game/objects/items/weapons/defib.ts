// From code/game/objects/items/weapons/defib.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7152, "/obj/item/weapon/defibrillator", "/obj/item/weapon", {
	on: 0,
	safety: 1,
	powered: 0,
	paddles: null,
	cell: null,
	combat: 0,
	grab_ghost: 0,
	name: "defibrillator",
	desc: "A device that delivers powerful shocks to detachable paddles that resuscitate incapacitated patients.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibunit",
	item_state: "defibunit",
	slot_flags: 1024,
	force: 5,
	throwforce: 6,
	w_class: 4,
	origin_tech: "biotech=4",
	actions_types: null,
	armor: null,
});

// /obj/item/weapon/defibrillator/proc/<init>  (code/game/objects/items/weapons/defib.dm:15)
rt.def("/obj/item/weapon/defibrillator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_paddles")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/defibrillator/proc/Initialize  (code/game/objects/items/weapons/defib.dm:30)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "paddles", (yield* g.srcCall(f, "make_paddles")));
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

rt.type(7153, "/obj/item/weapon/defibrillator/loaded", "/obj/item/weapon/defibrillator", {});

// /obj/item/weapon/defibrillator/loaded/proc/Initialize  (code/game/objects/items/weapons/defib.dm:36)  may sleep
rt.def("/obj/item/weapon/defibrillator/loaded/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "paddles", (yield* g.srcCall(f, "make_paddles")));
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/high"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/item/weapon/defibrillator/proc/update_icon  (code/game/objects/items/weapons/defib.dm:43)
rt.def("/obj/item/weapon/defibrillator/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "update_power", []);
	rt.callSrc(f, "update_overlays", []);
	rt.callSrc(f, "update_charge", []);
	return f.dot;
});

// /obj/item/weapon/defibrillator/proc/update_power  (code/game/objects/items/weapons/defib.dm:49)
rt.def("/obj/item/weapon/defibrillator/proc/update_power", function update_power(f: Frame) {
	if (truthy(rt.sv(f, "cell"))) {
		if (rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "revivecost", rt.sv(f, "paddles")))) {
			rt.setSv(f, "powered", 0);
		} else {
			rt.setSv(f, "powered", 1);
		}
	} else {
		rt.setSv(f, "powered", 0);
	}
	return f.dot;
});

// /obj/item/weapon/defibrillator/proc/update_overlays  (code/game/objects/items/weapons/defib.dm:57)
rt.def("/obj/item/weapon/defibrillator/proc/update_overlays", function update_overlays(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "on"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀-paddles", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	if (truthy(rt.sv(f, "powered"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀-powered", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	if (!truthy(rt.sv(f, "cell"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀-nocell", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	if (truthy(rt.sv(f, "safety"))) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("＀-emagged", [rt.initial(f, live(f.src), "icon_state")])]);
	return f.dot;
});

// /obj/item/weapon/defibrillator/proc/update_charge  (code/game/objects/items/weapons/defib.dm:70)
rt.def("/obj/item/weapon/defibrillator/proc/update_charge", function update_charge(f: Frame) {
	let ratio: Value = null;
	f.vars = () => [ratio];
	if (!truthy(rt.sv(f, "powered"))) return f.dot;
	if (!truthy(rt.sv(f, "cell"))) return f.dot;
	ratio = multiply(rt.call(f, P("/proc/Ceiling"), null, [multiply((ratio = divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell")))), 4)]), 25);
	rt.callSrc(f, "add_overlay", [fmt("＀-charge＀", [rt.initial(f, live(f.src), "icon_state"), live(ratio)])]);
	return f.dot;
});

// /obj/item/weapon/defibrillator/proc/CheckParts  (code/game/objects/items/weapons/defib.dm:75)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/CheckParts", function* CheckParts(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "cell", rt.locateIn(f, T("/obj/item/weapon/stock_parts/cell"), rt.sv(f, "contents")));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["parts_list"] });

// /obj/item/weapon/defibrillator/proc/ui_action_click  (code/game/objects/items/weapons/defib.dm:80)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "toggle_paddles");
	return f.dot;
}, true);

// /obj/item/weapon/defibrillator/proc/attack_hand  (code/game/objects/items/weapons/defib.dm:83)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		if (isEqual(rt.sv(f, "slot_flags"), 1024)) {
			if (isEqual((yield* g.callName(f, live(f.args[0]), "get_item_by_slot", [1])), live(f.src))) {
				yield* g.srcCall(f, "ui_action_click");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Put the defibrillator on your back first!</span>"]);
			}
		} else {
			if (isEqual(rt.sv(f, "slot_flags"), 512)) {
				if (isEqual((yield* g.callName(f, live(f.args[0]), "get_item_by_slot", [5])), live(f.src))) {
					yield* g.srcCall(f, "ui_action_click");
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Strap the defibrillator's belt on first!</span>"]);
				}
			}
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/defibrillator/proc/MouseDrop  (code/game/objects/items/weapons/defib.dm:99)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(f.src))])))) return f.dot;
	if (!(!truthy((yield* g.callName(f, (M = rt.fv(f, "loc", live(f.src))), "incapacitated", []))) && truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0)))) return f.dot;
	H = live(over_object);
	yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
	return f.dot;
}, true);

// /obj/item/weapon/defibrillator/proc/attackby  (code/game/objects/items/weapons/defib.dm:106)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(live(f.args[0]), rt.sv(f, "paddles"))) {
		yield* g.callName(f, rt.sv(f, "paddles"), "unwield", []);
		yield* g.srcCall(f, "toggle_paddles");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
			C = live(f.args[0]);
			if (truthy(rt.sv(f, "cell"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ already has a cell.</span>", [live(f.src)])]);
			} else {
				if (rt.lt(rt.fv(f, "maxcharge", live(C)), rt.fv(f, "revivecost", rt.sv(f, "paddles")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ requires a higher capacity cell.</span>", [live(f.src)])]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "cell", live(f.args[0]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You install a cell in ＀.</span>", [live(f.src)])]);
				yield* g.srcCall(f, "update_icon");
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "cell"))) {
					yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
					yield* g.callName(f, rt.sv(f, "cell"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "cell", null);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the cell from ＀.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "update_icon");
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/defibrillator/proc/emag_act  (code/game/objects/items/weapons/defib.dm:136)
rt.def("/obj/item/weapon/defibrillator/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "safety"))) {
		rt.setSv(f, "safety", 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You silently disable ＀'s safety protocols with the cryptographic sequencer.", [live(f.src)])]);
	} else {
		rt.setSv(f, "safety", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You silently enable ＀'s safety protocols with the cryptographic sequencer.", [live(f.src)])]);
	}
	return f.dot;
});

// /obj/item/weapon/defibrillator/proc/emp_act  (code/game/objects/items/weapons/defib.dm:143)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.srcCall(f, "deductcharge", divide(1000, live(f.args[0])));
	}
	if (truthy(rt.sv(f, "safety"))) {
		rt.setSv(f, "safety", 0);
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>＀ beeps: Safety protocols disabled!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_saftyOff.ogg"), 50, 0]);
	} else {
		rt.setSv(f, "safety", 1);
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>＀ beeps: Safety protocols enabled!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_SaftyOn.ogg"), 50, 0]);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/weapon/defibrillator/proc/toggle_paddles  (code/game/objects/items/weapons/defib.dm:158)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/toggle_paddles", function* toggle_paddles(f: Frame) {
	let user: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	user = live(f.usr);
	if (truthy(rt.sv(f, "on"))) {
		if (!truthy((yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "paddles")])))) {
			rt.setSv(f, "on", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need a free hand to hold the paddles!</span>"]);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
		rt.setFv(f, "loc", rt.sv(f, "paddles"), live(user));
	} else {
		yield* g.callName(f, rt.sv(f, "paddles"), "unwield", []);
		yield* g.srcCall(f, "remove_paddles", live(user));
	}
	yield* g.srcCall(f, "update_icon");
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Toggle Paddles", category: "Object" } });

// /obj/item/weapon/defibrillator/proc/make_paddles  (code/game/objects/items/weapons/defib.dm:180)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/make_paddles", function* make_paddles(f: Frame) {
	return (yield* g.new_(f, T("/obj/item/weapon/twohanded/shockpaddles"), [live(f.src)]));
}, true);

// /obj/item/weapon/defibrillator/proc/equipped  (code/game/objects/items/weapons/defib.dm:183)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(rt.sv(f, "slot_flags"), 1024) && !isEqual(live(f.args[1]), 1)) || (isEqual(rt.sv(f, "slot_flags"), 512) && !isEqual(live(f.args[1]), 5)))) return f.dot;
	yield* g.srcCall(f, "remove_paddles", live(f.args[0]));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/weapon/defibrillator/proc/item_action_slot_check  (code/game/objects/items/weapons/defib.dm:189)
rt.def("/obj/item/weapon/defibrillator/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), rt.callName(f, live(user), "getBackSlot", []))) return f.dot;
	return 1;
});

// /obj/item/weapon/defibrillator/proc/remove_paddles  (code/game/objects/items/weapons/defib.dm:193)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/remove_paddles", function* remove_paddles(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", rt.sv(f, "paddles"))])))) {
		yield* g.callName(f, (M = rt.fv(f, "loc", rt.sv(f, "paddles"))), "dropItemToGround", [rt.sv(f, "paddles"), 1]);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/defibrillator/proc/Destroy  (code/game/objects/items/weapons/defib.dm:200)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "remove_paddles", (M = (yield* g.call(f, P("/proc/get"), null, [rt.sv(f, "paddles"), T("/mob")]))));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/defibrillator/proc/deductcharge  (code/game/objects/items/weapons/defib.dm:207)  may sleep
rt.def("/obj/item/weapon/defibrillator/proc/deductcharge", function* deductcharge(f: Frame, chrgdeductamt: Value) {
	f.vars = () => [chrgdeductamt];
	if (!truthy(rt.sv(f, "cell"))) return f.dot;
	if (rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), add(rt.fv(f, "revivecost", rt.sv(f, "paddles")), live(chrgdeductamt)))) {
		rt.setSv(f, "powered", 0);
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "cell"), "use", [live(chrgdeductamt)])))) {
		yield* g.srcCall(f, "update_icon");
		return 1;
	} else {
		yield* g.srcCall(f, "update_icon");
		return 0;
	}
	return f.dot;
}, true);

// /obj/item/weapon/defibrillator/proc/cooldowncheck  (code/game/objects/items/weapons/defib.dm:218)
rt.def("/obj/item/weapon/defibrillator/proc/cooldowncheck", function cooldowncheck(f: Frame, user: Value) {
	rt.spawnTail(f, 50, "/obj/item/weapon/defibrillator/proc/cooldowncheck: spawn at game/objects/items/weapons/defib.dm:218", user);
	return f.dot;
});

// a spawn(50) body of /obj/item/weapon/defibrillator/proc/cooldowncheck, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/defibrillator/proc/cooldowncheck: spawn at game/objects/items/weapons/defib.dm:218", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "cell"))) {
		if (rt.ge(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "revivecost", rt.sv(f, "paddles")))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ beeps: Unit ready.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_ready.ogg"), 50, 0]);
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ beeps: Charge depleted.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
		}
	}
	rt.setFv(f, "cooldown", rt.sv(f, "paddles"), 0);
	yield* g.callName(f, rt.sv(f, "paddles"), "update_icon", []);
	yield* g.srcCall(f, "update_icon");
	return null;
});

rt.type(7154, "/obj/item/weapon/defibrillator/compact", "/obj/item/weapon/defibrillator", {
	name: "compact defibrillator",
	desc: "A belt-equipped defibrillator that can be rapidly deployed.",
	icon_state: "defibcompact",
	item_state: "defibcompact",
	w_class: 3,
	slot_flags: 512,
	origin_tech: "biotech=5",
});

// /obj/item/weapon/defibrillator/compact/proc/item_action_slot_check  (code/game/objects/items/weapons/defib.dm:240)
rt.def("/obj/item/weapon/defibrillator/compact/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), rt.callName(f, live(user), "getBeltSlot", []))) return f.dot;
	return 1;
});

rt.type(7155, "/obj/item/weapon/defibrillator/compact/loaded", "/obj/item/weapon/defibrillator/compact", {});

// /obj/item/weapon/defibrillator/compact/loaded/proc/Initialize  (code/game/objects/items/weapons/defib.dm:244)  may sleep
rt.def("/obj/item/weapon/defibrillator/compact/loaded/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "paddles", (yield* g.srcCall(f, "make_paddles")));
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/high"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(7157, "/obj/item/weapon/defibrillator/compact/combat/loaded", "/obj/item/weapon/defibrillator/compact/combat", {});

// /obj/item/weapon/defibrillator/compact/combat/loaded/proc/Initialize  (code/game/objects/items/weapons/defib.dm:256)  may sleep
rt.def("/obj/item/weapon/defibrillator/compact/combat/loaded/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "paddles", (yield* g.srcCall(f, "make_paddles")));
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/infinite"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/defibrillator/compact/combat/loaded/proc/attackby  (code/game/objects/items/weapons/defib.dm:262)  may sleep
rt.def("/obj/item/weapon/defibrillator/compact/combat/loaded/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (!isEqual(live(W), rt.sv(f, "paddles"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "paddles"), "unwield", []);
	yield* g.srcCall(f, "toggle_paddles");
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

rt.type(5619, "/obj/item/weapon/twohanded/shockpaddles", "/obj/item/weapon/twohanded", {
	revivecost: 1000,
	cooldown: 0,
	busy: 0,
	defib: null,
	req_defib: 1,
	combat: 0,
	grab_ghost: 0,
	name: "defibrillator paddles",
	desc: "A pair of plastic-gripped paddles with flat metal surfaces that are used to deliver powerful electric shocks.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibpaddles",
	item_state: "defibpaddles",
	force: 0,
	throwforce: 6,
	w_class: 4,
});

// /obj/item/weapon/twohanded/shockpaddles/proc/recharge  (code/game/objects/items/weapons/defib.dm:289)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/recharge", function* recharge(f: Frame, time: Value) {
	let _T: Value = null;
	f.vars = () => [time, _T];
	if ((truthy(rt.sv(f, "req_defib")) || !truthy(live(time)))) {
		return live(f.dot);
	}
	rt.setSv(f, "cooldown", 1);
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/sleep"), null, [live(time)]);
	yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "audible_message", [fmt("<span class='notice'>＀ beeps: Unit is recharged.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/machines/defib_ready.ogg"), 50, 0]);
	rt.setSv(f, "cooldown", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/shockpaddles/proc/New  (code/game/objects/items/weapons/defib.dm:301)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((yield* g.srcCall(f, "check_defib_exists", live(f.args[0]), live(f.src)))) && truthy(rt.sv(f, "req_defib")))) return f.dot;
	rt.setSv(f, "defib", live(f.args[0]));
	rt.setSv(f, "loc", rt.sv(f, "defib"));
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mainunit"] });

// /obj/item/weapon/twohanded/shockpaddles/proc/update_icon  (code/game/objects/items/weapons/defib.dm:309)
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("defibpaddles＀", [rt.sv(f, "wielded")]));
	rt.setSv(f, "item_state", fmt("defibpaddles＀", [rt.sv(f, "wielded")]));
	if (!truthy(rt.sv(f, "cooldown"))) return f.dot;
	rt.setSv(f, "icon_state", fmt("defibpaddles＀_cooldown", [rt.sv(f, "wielded")]));
	return f.dot;
});

// /obj/item/weapon/twohanded/shockpaddles/proc/suicide_act  (code/game/objects/items/weapons/defib.dm:315)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ is putting the live paddles on ＀ chest! It looks like ＀ trying to commit suicide!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	if (truthy(rt.sv(f, "req_defib"))) {
		yield* g.callName(f, rt.sv(f, "defib"), "deductcharge", [rt.sv(f, "revivecost")]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1]);
	return 8;
}, true);

// /obj/item/weapon/twohanded/shockpaddles/proc/dropped  (code/game/objects/items/weapons/defib.dm:322)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/dropped", function* dropped(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	if (!truthy(rt.sv(f, "req_defib"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(live(f.args[0]))) {
		if (truthy((rt.istype((O = (yield* g.callName(f, live(f.args[0]), "get_inactive_held_item", []))), T("/obj/item/weapon/twohanded/offhand")) ? 1 : 0))) {
			yield* g.callName(f, live(O), "unwield", []);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The paddles snap back into the main unit.</span>"]);
		rt.setFv(f, "on", rt.sv(f, "defib"), 0);
		rt.setSv(f, "loc", rt.sv(f, "defib"));
		yield* g.callName(f, rt.sv(f, "defib"), "update_icon", []);
	}
	return (yield* g.srcCall(f, "unwield", live(f.args[0])));
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/shockpaddles/proc/check_defib_exists  (code/game/objects/items/weapons/defib.dm:335)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/check_defib_exists", function* check_defib_exists(f: Frame, mainunit: Value, M: Value, O: Value) {
	f.vars = () => [mainunit, M, O];
	if (!truthy(rt.sv(f, "req_defib"))) {
		return 1;
	}
	if ((!truthy(live(mainunit)) || !truthy((rt.istype(live(mainunit), T("/obj/item/weapon/defibrillator")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		return 0;
	} else {
		return 1;
	}
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/shockpaddles/proc/attack  (code/game/objects/items/weapons/defib.dm:347)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null;
	f.vars = () => [M, user, H];
	if (truthy(rt.sv(f, "busy"))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "req_defib")) && !truthy(rt.fv(f, "powered", rt.sv(f, "defib"))))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ beeps: Unit is unpowered.</span>", [rt.sv(f, "defib")])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "wielded"))) {
		if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You must activate the paddles in your active module before you can use them on someone!</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to wield the paddles in both hands before you can use them on someone!</span>"]);
		}
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "cooldown"))) {
		if (truthy(rt.sv(f, "req_defib"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is recharging!</span>", [rt.sv(f, "defib")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ are recharging!</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(user)), "disarm")) {
		yield* g.srcCall(f, "do_disarm", live(M), live(user));
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "req_defib"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The instructions on ＀ don't mention how to revive that...</span>", [rt.sv(f, "defib")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You aren't sure how to revive that...</span>"]);
		}
		return live(f.dot);
	}
	H = live(M);
	if (!isEqual(rt.fv(f, "zone_selected", live(user)), "chest")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to target your patient's chest with ＀!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		yield* g.srcCall(f, "do_harm", live(H), live(user));
		return live(f.dot);
	}
	if (((!truthy(rt.sv(f, "req_defib")) && truthy(rt.sv(f, "grab_ghost"))) || (truthy(rt.sv(f, "req_defib")) && truthy(rt.fv(f, "grab_ghost", rt.sv(f, "defib")))))) {
		yield* g.callName(f, live(H), "notify_ghost_cloning", ["Your heart is being defibrillated!"]);
		yield* g.callName(f, live(H), "grab_ghost", []);
	} else {
		if (((!truthy(rt.fv(f, "suiciding", live(H))) && !truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 128))) && !truthy(rt.fv(f, "hellbound", live(H))))) {
			yield* g.callName(f, live(H), "notify_ghost_cloning", [null, "Your heart is being defibrillated. Re-enter your corpse if you want to be revived!", "source", live(f.src)], rt.Args.Named);
		}
	}
	yield* g.srcCall(f, "do_help", live(H), live(user));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/shockpaddles/proc/do_disarm  (code/game/objects/items/weapons/defib.dm:395)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/do_disarm", function* do_disarm(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if ((truthy(rt.sv(f, "req_defib")) && truthy(rt.fv(f, "safety", rt.sv(f, "defib"))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "req_defib")) && !truthy(rt.sv(f, "combat")))) {
		return live(f.dot);
	}
	rt.setSv(f, "busy", 1);
	yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ has touched ＀ with ＀!</span>", [live(user), live(M), live(f.src)]), fmt("<span class='userdanger'>＀ has touched ＀ with ＀!</span>", [live(user), live(M), live(f.src)])]);
	yield* g.callName(f, live(M), "adjustStaminaLoss", [50]);
	yield* g.callName(f, live(M), "Knockdown", [100]);
	yield* g.callName(f, live(M), "updatehealth", []);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1]);
	yield* g.callName(f, live(M), "emote", ["gasp"]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "stunned", live(f.src)]);
	if (truthy(rt.sv(f, "req_defib"))) {
		yield* g.callName(f, rt.sv(f, "defib"), "deductcharge", [rt.sv(f, "revivecost")]);
		rt.setSv(f, "cooldown", 1);
	}
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "update_icon");
	if (truthy(rt.sv(f, "req_defib"))) {
		yield* g.callName(f, rt.sv(f, "defib"), "cooldowncheck", [live(user)]);
	} else {
		yield* g.srcCall(f, "recharge", 60);
	}
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/shockpaddles/proc/do_harm  (code/game/objects/items/weapons/defib.dm:419)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/do_harm", function* do_harm(f: Frame, H: Value, user: Value) {
	let _T: Value = null;
	f.vars = () => [H, user, _T];
	if ((truthy(rt.sv(f, "req_defib")) && truthy(rt.fv(f, "safety", rt.sv(f, "defib"))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "req_defib")) && !truthy(rt.sv(f, "combat")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ begins to place ＀ on ＀'s chest.</span>", [live(user), live(f.src), live(H)]), fmt("<span class='warning'>You overcharge the paddles and begin to place them onto ＀'s chest...</span>", [live(H)])]);
	rt.setSv(f, "busy", 1);
	yield* g.srcCall(f, "update_icon");
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(H)], rt.Args.Named)))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ places ＀ on ＀'s chest.</span>", [live(user), live(f.src), live(H)]), fmt("<span class='warning'>You place ＀ on ＀'s chest and begin to charge them.</span>", [live(f.src), live(H)])]);
		_T = rt.getStep(f, rt.sv(f, "defib"), 0);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_charge.ogg"), 50, 0]);
		if (truthy(rt.sv(f, "req_defib"))) {
			yield* g.callName(f, live(_T), "audible_message", [fmt("<span class='warning'>＄！ lets out an urgent beep and lets out a steadily rising hum...</span>", [rt.sv(f, "defib")])]);
		} else {
			yield* g.callName(f, live(user), "audible_message", [fmt("<span class='warning'>＀ let out an urgent beep.</span>", [live(f.src)])]);
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(H)], rt.Args.Named)))) {
			if (!truthy(live(H))) {
				rt.setSv(f, "busy", 0);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
			if ((truthy(live(H)) && isEqual(rt.fv(f, "stat", live(H)), 2))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is dead.</span>", [live(H)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
				rt.setSv(f, "busy", 0);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='boldannounce'><i>＀ shocks ＀ with ％！!</span>", [live(user), live(H), live(f.src)]), fmt("<span class='warning'>You shock ＀ with ％！!</span>", [live(H), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_zap.ogg"), 100, 1, -1]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 100, 1, -1]);
			yield* g.callName(f, live(H), "emote", ["scream"]);
			if ((truthy((yield* g.callName(f, live(H), "can_heartattack", []))) && !truthy((yield* g.callName(f, live(H), "undergoing_cardiac_arrest", []))))) {
				if (!truthy(rt.fv(f, "stat", live(H)))) {
					yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ thrashes wildly, clutching at their chest!</span>", [live(H)]), "<span class='userdanger'>You feel a horrible agony in your chest!</span>"]);
				}
				yield* g.callName(f, live(H), "set_heartattack", [1]);
			}
			yield* g.callName(f, live(H), "apply_damage", [50, "fire", "chest"]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(H), "overloaded the heart of", rt.sv(f, "defib")]);
			yield* g.callName(f, live(H), "Knockdown", [100]);
			yield* g.callName(f, live(H), "Jitter", [100]);
			if (truthy(rt.sv(f, "req_defib"))) {
				yield* g.callName(f, rt.sv(f, "defib"), "deductcharge", [rt.sv(f, "revivecost")]);
				rt.setSv(f, "cooldown", 1);
			}
			rt.setSv(f, "busy", 0);
			yield* g.srcCall(f, "update_icon");
			if (!truthy(rt.sv(f, "req_defib"))) {
				yield* g.srcCall(f, "recharge", 60);
			}
			if ((truthy(rt.sv(f, "req_defib")) && truthy((yield* g.callName(f, rt.sv(f, "defib"), "cooldowncheck", [live(user)]))))) {
				return live(f.dot);
			}
		}
	}
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/shockpaddles/proc/do_help  (code/game/objects/items/weapons/defib.dm:473)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/proc/do_help", function* do_help(f: Frame, H: Value, user: Value) {
	let tplus: Value = null, tlimit: Value = null, tloss: Value = null, total_burn: Value = null, total_brute: Value = null, carried_item: Value = null, failed: Value = null, BR: Value = null, overall_damage: Value = null, mobhealth: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [H, user, tplus, tlimit, tloss, total_burn, total_brute, carried_item, failed, BR, overall_damage, mobhealth, $0, $1, $e];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ begins to place ＀ on ＀'s chest.</span>", [live(user), live(f.src), live(H)]), fmt("<span class='warning'>You begin to place ＀ on ＀'s chest...</span>", [live(f.src), live(H)])]);
	rt.setSv(f, "busy", 1);
	yield* g.srcCall(f, "update_icon");
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(H)], rt.Args.Named)))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ places ＀ on ＀'s chest.</span>", [live(user), live(f.src), live(H)]), fmt("<span class='warning'>You place ＀ on ＀'s chest.</span>", [live(f.src), live(H)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_charge.ogg"), 50, 0]);
		tplus = subtract(rt.worldTime(f), rt.fv(f, "timeofdeath", live(H)));
		tlimit = 1200;
		tloss = 600;
		total_burn = 0;
		total_brute = 0;
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(H)], rt.Args.Named)))) {
			carried_item = null;
			rt.forList(f, 0, rt.fv(f, "contents", live(H)), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				carried_item = $e;
				if (truthy((rt.istype(live(carried_item), T("/obj/item/clothing/suit/space")) ? 1 : 0))) {
					if (((!truthy(rt.fv(f, "combat", live(f.src))) && !truthy(rt.sv(f, "req_defib"))) || (truthy(rt.sv(f, "req_defib")) && !truthy(rt.fv(f, "combat", rt.sv(f, "defib")))))) {
						$0 = live(user);
						if (truthy(rt.sv(f, "req_defib"))) {
							$1 = fmt("＀", [rt.sv(f, "defib")]);
						} else {
							$1 = fmt("＀", [live(f.src)]);
						}
						yield* g.callName(f, $0, "audible_message", [fmt("<span class='warning'>＀ buzzes: Patient's chest is obscured. Operation aborted.</span>", [$1])]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
						rt.setSv(f, "busy", 0);
						yield* g.srcCall(f, "update_icon");
						return live(f.dot);
					}
				}
			}
			rt.endFor(f, 0);
			if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
				yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀'s body convulses a bit.", [live(H)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), "bodyfall", 50, 1]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1]);
				total_brute = (yield* g.callName(f, live(H), "getBruteLoss", []));
				total_burn = (yield* g.callName(f, live(H), "getFireLoss", []));
				failed = null;
				if ((truthy(rt.fv(f, "suiciding", live(H))) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 128)))) {
					if (truthy(rt.sv(f, "req_defib"))) {
						$0 = fmt("＀", [rt.sv(f, "defib")]);
					} else {
						$0 = fmt("＀", [live(f.src)]);
					}
					failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - Recovery of patient impossible. Further attempts futile.</span>", [$0]);
				} else {
					if (truthy(rt.fv(f, "hellbound", live(H)))) {
						if (truthy(rt.sv(f, "req_defib"))) {
							$0 = fmt("＀", [rt.sv(f, "defib")]);
						} else {
							$0 = fmt("＀", [live(f.src)]);
						}
						failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - Patient's soul appears to be on another plane of existence.  Further attempts futile.</span>", [$0]);
					} else {
						if (rt.gt(live(tplus), live(tlimit))) {
							if (truthy(rt.sv(f, "req_defib"))) {
								$0 = fmt("＀", [rt.sv(f, "defib")]);
							} else {
								$0 = fmt("＀", [live(f.src)]);
							}
							failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - Body has decayed for too long. Further attempts futile.</span>", [$0]);
						} else {
							if (!truthy((yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/heart")])))) {
								if (truthy(rt.sv(f, "req_defib"))) {
									$0 = fmt("＀", [rt.sv(f, "defib")]);
								} else {
									$0 = fmt("＀", [live(f.src)]);
								}
								failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - Patient's heart is missing.</span>", [$0]);
							} else {
								if ((rt.ge(live(total_burn), 180) || rt.ge(live(total_brute), 180))) {
									if (truthy(rt.sv(f, "req_defib"))) {
										$0 = fmt("＀", [rt.sv(f, "defib")]);
									} else {
										$0 = fmt("＀", [live(f.src)]);
									}
									failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - Severe tissue damage makes recovery of patient impossible via defibrillator. Further attempts futile.</span>", [$0]);
								} else {
									if (truthy((yield* g.callName(f, live(H), "get_ghost", [])))) {
										if (truthy(rt.sv(f, "req_defib"))) {
											$0 = fmt("＀", [rt.sv(f, "defib")]);
										} else {
											$0 = fmt("＀", [live(f.src)]);
										}
										failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - No activity in patient's brain. Further attempts may be successful.</span>", [$0]);
									} else {
										if ((!truthy((BR = (yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/brain")])))) || truthy(rt.fv(f, "damaged_brain", live(BR))))) {
											if (truthy(rt.sv(f, "req_defib"))) {
												$0 = fmt("＀", [rt.sv(f, "defib")]);
											} else {
												$0 = fmt("＀", [live(f.src)]);
											}
											failed = fmt("<span class='warning'>＀ buzzes: Resuscitation failed - Patient's brain is missing or damaged beyond point of no return. Further attempts futile.</span>", [$0]);
										}
									}
								}
							}
						}
					}
				}
				if (truthy(live(failed))) {
					yield* g.callName(f, live(user), "visible_message", [live(failed)]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
				} else {
					if (rt.gt(rt.fv(f, "health", live(H)), -50)) {
						yield* g.callName(f, live(H), "adjustOxyLoss", [subtract(rt.fv(f, "health", live(H)), -50), 0]);
					} else {
						overall_damage = add(add(add(live(total_brute), live(total_burn)), (yield* g.callName(f, live(H), "getToxLoss", []))), (yield* g.callName(f, live(H), "getOxyLoss", [])));
						mobhealth = rt.fv(f, "health", live(H));
						yield* g.callName(f, live(H), "adjustOxyLoss", [multiply(subtract(live(mobhealth), -50), divide((yield* g.callName(f, live(H), "getOxyLoss", [])), live(overall_damage))), 0]);
						yield* g.callName(f, live(H), "adjustToxLoss", [multiply(subtract(live(mobhealth), -50), divide((yield* g.callName(f, live(H), "getToxLoss", [])), live(overall_damage))), 0]);
						yield* g.callName(f, live(H), "adjustFireLoss", [multiply(subtract(live(mobhealth), -50), divide(live(total_burn), live(overall_damage))), 0]);
						yield* g.callName(f, live(H), "adjustBruteLoss", [multiply(subtract(live(mobhealth), -50), divide(live(total_brute), live(overall_damage))), 0]);
					}
					yield* g.callName(f, live(H), "updatehealth", []);
					$0 = live(user);
					if (truthy(rt.sv(f, "req_defib"))) {
						$1 = fmt("＀", [rt.sv(f, "defib")]);
					} else {
						$1 = fmt("＀", [live(f.src)]);
					}
					yield* g.callName(f, $0, "visible_message", [fmt("<span class='notice'>＀ pings: Resuscitation successful.</span>", [$1])]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_success.ogg"), 50, 0]);
					yield* g.callName(f, live(H), "set_heartattack", [0]);
					yield* g.callName(f, live(H), "revive", []);
					yield* g.callName(f, live(H), "emote", ["gasp"]);
					if (rt.gt(live(tplus), live(tloss))) {
						yield* g.callName(f, live(H), "setBrainLoss", [(yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [99, multiply(divide(subtract(live(tlimit), live(tplus)), live(tlimit)), 100)]))]))]);
					}
					yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(H), "revived", rt.sv(f, "defib")]);
				}
				if (truthy(rt.sv(f, "req_defib"))) {
					yield* g.callName(f, rt.sv(f, "defib"), "deductcharge", [rt.sv(f, "revivecost")]);
					rt.setSv(f, "cooldown", 1);
				}
				yield* g.srcCall(f, "update_icon");
				if (truthy(rt.sv(f, "req_defib"))) {
					yield* g.callName(f, rt.sv(f, "defib"), "cooldowncheck", [live(user)]);
				} else {
					yield* g.srcCall(f, "recharge", 60);
				}
			} else {
				if (!truthy((yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/heart")])))) {
					$0 = live(user);
					if (truthy(rt.sv(f, "req_defib"))) {
						$1 = fmt("＀", [rt.sv(f, "defib")]);
					} else {
						$1 = fmt("＀", [live(f.src)]);
					}
					yield* g.callName(f, $0, "visible_message", [fmt("<span class='warning'>＀ buzzes: Patient's heart is missing. Operation aborted.</span>", [$1])]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
				} else {
					if (truthy((yield* g.callName(f, live(H), "undergoing_cardiac_arrest", [])))) {
						yield* g.callName(f, live(H), "set_heartattack", [0]);
						$0 = live(user);
						if (truthy(rt.sv(f, "req_defib"))) {
							$1 = fmt("＀", [rt.sv(f, "defib")]);
						} else {
							$1 = fmt("＀", [live(f.src)]);
						}
						yield* g.callName(f, $0, "visible_message", [fmt("<span class='notice'>＀ pings: Patient's heart is now beating again.</span>", [$1])]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1]);
					} else {
						$0 = live(user);
						if (truthy(rt.sv(f, "req_defib"))) {
							$1 = fmt("＀", [rt.sv(f, "defib")]);
						} else {
							$1 = fmt("＀", [live(f.src)]);
						}
						yield* g.callName(f, $0, "visible_message", [fmt("<span class='warning'>＀ buzzes: Patient is not in a valid state. Operation aborted.</span>", [$1])]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/machines/defib_failed.ogg"), 50, 0]);
					}
				}
			}
		}
	}
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(5620, "/obj/item/weapon/twohanded/shockpaddles/cyborg", "/obj/item/weapon/twohanded/shockpaddles", {
	req_defib: 0,
	name: "cyborg defibrillator paddles",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "defibpaddles0",
	item_state: "defibpaddles0",
});

// /obj/item/weapon/twohanded/shockpaddles/cyborg/proc/attack  (code/game/objects/items/weapons/defib.dm:577)  may sleep
rt.def("/obj/item/weapon/twohanded/shockpaddles/cyborg/proc/attack", function* attack(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "emagged", (R = live(f.args[1]))))) {
			rt.setSv(f, "combat", 1);
		} else {
			rt.setSv(f, "combat", 0);
		}
	} else {
		rt.setSv(f, "combat", 0);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["M", "user"] });
