// From code/game/objects/items/devices/lightreplacer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9260, "/obj/item/device/lightreplacer", "/obj/item/device", {
	max_uses: 20,
	uses: 0,
	emagged: 0,
	failmsg: "",
	increment: 5,
	decrement: 1,
	charge: 1,
	bulb_shards: 0,
	shards_required: 4,
	flags: 64,
	name: "light replacer",
	desc: "A device to automatically replace lights. Refill with broken or working lightbulbs, or sheets of glass.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "lightreplacer0",
	item_state: "electronic",
	slot_flags: 512,
	origin_tech: "magnets=3;engineering=4",
});

// /obj/item/device/lightreplacer/proc/New  (code/game/objects/items/devices/lightreplacer.dm:70)  may sleep
rt.def("/obj/item/device/lightreplacer/proc/New", function* New(f: Frame) {
	rt.setSv(f, "uses", divide(rt.sv(f, "max_uses"), 2));
	rt.setSv(f, "failmsg", fmt("The ＀'s refill light blinks red.", [rt.sv(f, "name")]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/lightreplacer/proc/examine  (code/game/objects/items/devices/lightreplacer.dm:75)
rt.def("/obj/item/device/lightreplacer/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.callSrc(f, "status_string", [])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/lightreplacer/proc/attackby  (code/game/objects/items/devices/lightreplacer.dm:80)  may sleep
rt.def("/obj/item/device/lightreplacer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let G: Value = null, L: Value = null, S: Value = null, found_lightbulbs: Value = null, replaced_something: Value = null, I: Value = null, L_4: Value = null;
	let $e: any;
	f.vars = () => [W, user, params, G, L, S, found_lightbulbs, replaced_something, I, L_4, $e];
	if (truthy((rt.istype(live(W), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
		G = live(W);
		if (rt.ge(rt.sv(f, "uses"), rt.sv(f, "max_uses"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is full.</span>", [rt.fv(f, "name", live(f.src))])]);
			return live(f.dot);
		} else {
			if (truthy((yield* g.callName(f, live(G), "use", [rt.sv(f, "decrement")])))) {
				yield* g.srcCall(f, "AddUses", rt.sv(f, "increment"));
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert a piece of glass into the ＀. You have ＀ light５ remaining.</span>", [rt.fv(f, "name", live(f.src)), rt.sv(f, "uses")])]);
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need one sheet of glass to replace lights!</span>"]);
			}
		}
	}
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/shard")) ? 1 : 0))) {
		if (rt.ge(rt.sv(f, "uses"), rt.sv(f, "max_uses"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is full.</span>", [rt.fv(f, "name", live(f.src))])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(W)])))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "AddUses", (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "increment"), 0.75)])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert a shard of glass into the ＀. You have ＀ light５ remaining.</span>", [rt.fv(f, "name", live(f.src)), rt.sv(f, "uses")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/light")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "status", (L = live(W))), 0)) {
			if (rt.lt(rt.sv(f, "uses"), rt.sv(f, "max_uses"))) {
				if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(W)])))) {
					return live(f.dot);
				}
				yield* g.srcCall(f, "AddUses", 1);
				yield* g.call(f, P("/proc/qdel"), null, [live(L)]);
			}
		} else {
			if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(W)])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert the ＀ into the ＀</span>", [rt.fv(f, "name", live(L)), rt.fv(f, "name", live(f.src))])]);
			yield* g.srcCall(f, "AddShards", 1, live(user));
			yield* g.call(f, P("/proc/qdel"), null, [live(L)]);
		}
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(W), T("/obj/item/weapon/storage")) ? 1 : 0))) return f.dot;
	S = live(W);
	found_lightbulbs = 0;
	replaced_something = 1;
	I = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(S)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/light")) ? 1 : 0))) {
			L_4 = live(I);
			found_lightbulbs = 1;
			if (rt.ge(rt.fv(f, "uses", live(f.src)), rt.sv(f, "max_uses"))) {
				break;
			}
			if (isEqual(rt.fv(f, "status", live(L_4)), 0)) {
				replaced_something = 1;
				yield* g.srcCall(f, "AddUses", 1);
				yield* g.call(f, P("/proc/qdel"), null, [live(L_4)]);
			} else {
				if ((isEqual(rt.fv(f, "status", live(L_4)), 2) || isEqual(rt.fv(f, "status", live(L_4)), 3))) {
					replaced_something = 1;
					yield* g.srcCall(f, "AddShards", 1, live(user));
					yield* g.call(f, P("/proc/qdel"), null, [live(L_4)]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(found_lightbulbs))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ contains no bulbs.</span>", [live(S)])]);
		return live(f.dot);
	}
	if ((!truthy(live(replaced_something)) && isEqual(rt.fv(f, "uses", live(f.src)), rt.sv(f, "max_uses")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is full!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), add(add(fmt("<span class='notice'>You fill ％！ with lights from ％！. ", [live(f.src), live(S)]), (yield* g.srcCall(f, "status_string"))), "</span>")]);
	return f.dot;
}, true);

// /obj/item/device/lightreplacer/proc/emag_act  (code/game/objects/items/devices/lightreplacer.dm:151)
rt.def("/obj/item/device/lightreplacer/proc/emag_act", function emag_act(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.callSrc(f, "Emag", []);
	return f.dot;
});

// /obj/item/device/lightreplacer/proc/attack_self  (code/game/objects/items/devices/lightreplacer.dm:155)
rt.def("/obj/item/device/lightreplacer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), rt.callSrc(f, "status_string", [])]);
	return f.dot;
});

// /obj/item/device/lightreplacer/proc/update_icon  (code/game/objects/items/devices/lightreplacer.dm:158)
rt.def("/obj/item/device/lightreplacer/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("lightreplacer＀", [rt.sv(f, "emagged")]));
	return f.dot;
});

// /obj/item/device/lightreplacer/proc/status_string  (code/game/objects/items/devices/lightreplacer.dm:161)
rt.def("/obj/item/device/lightreplacer/proc/status_string", function status_string(f: Frame) {
	return fmt("It has ＀ light５ remaining (plus ＀ fragment５).", [rt.sv(f, "uses"), rt.sv(f, "bulb_shards")]);
});

// /obj/item/device/lightreplacer/proc/Use  (code/game/objects/items/devices/lightreplacer.dm:164)
rt.def("/obj/item/device/lightreplacer/proc/Use", function Use(f: Frame, user: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	rt.callSrc(f, "AddUses", [-1]);
	return 1;
});

// /obj/item/device/lightreplacer/proc/AddUses  (code/game/objects/items/devices/lightreplacer.dm:170)
rt.def("/obj/item/device/lightreplacer/proc/AddUses", function AddUses(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if (live(amount) === null) {
		amount = 1;
	}
	rt.setSv(f, "uses", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "uses"), live(amount)), rt.sv(f, "max_uses")])]));
	return f.dot;
});

// /obj/item/device/lightreplacer/proc/AddShards  (code/game/objects/items/devices/lightreplacer.dm:173)
rt.def("/obj/item/device/lightreplacer/proc/AddShards", function AddShards(f: Frame, amount: Value, user: Value) {
	let new_bulbs: Value = null;
	f.vars = () => [amount, new_bulbs];
	if (live(amount) === null) {
		amount = 1;
	}
	rt.modSrcVar(f, "bulb_shards", live(amount), add);
	if (rt.gt((new_bulbs = rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "bulb_shards"), rt.sv(f, "shards_required"))])), 0)) {
		rt.callSrc(f, "AddUses", [live(new_bulbs)]);
	}
	rt.setSv(f, "bulb_shards", rt.modulus(rt.sv(f, "bulb_shards"), rt.sv(f, "shards_required")));
	if (!isEqual(live(new_bulbs), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ has fabricated a new bulb from the broken glass it has stored. It now has ＀ uses.</span>", [live(f.src), rt.sv(f, "uses")])]);
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
	}
	return live(new_bulbs);
});

// /obj/item/device/lightreplacer/proc/Charge  (code/game/objects/items/devices/lightreplacer.dm:184)
rt.def("/obj/item/device/lightreplacer/proc/Charge", function Charge(f: Frame, user: Value) {
	if (!rt.gt((rt.modSrcVar(f, "charge", 1, add)), 3)) return f.dot;
	rt.callSrc(f, "AddUses", [1]);
	rt.setSv(f, "charge", 1);
	return f.dot;
});

// /obj/item/device/lightreplacer/proc/ReplaceLight  (code/game/objects/items/devices/lightreplacer.dm:191)  may sleep
rt.def("/obj/item/device/lightreplacer/proc/ReplaceLight", function* ReplaceLight(f: Frame, target: Value, U: Value) {
	let L2: Value = null;
	f.vars = () => [target, U, L2];
	if (!isEqual(rt.fv(f, "status", live(target)), 0)) {
		if (truthy((yield* g.srcCall(f, "CanUse", live(U))))) {
			if (!truthy((yield* g.srcCall(f, "Use", live(U))))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>You replace the ＀ with ％！.</span>", [rt.fv(f, "fitting", live(target)), live(f.src)])]);
			if (!isEqual(rt.fv(f, "status", live(target)), 1)) {
				yield* g.srcCall(f, "AddShards", 1, live(U));
				rt.setFv(f, "status", live(target), 1);
				yield* g.callName(f, live(target), "update", []);
			}
			L2 = (yield* g.new_(f, rt.fv(f, "light_type", live(target)), []));
			rt.setFv(f, "status", live(target), rt.fv(f, "status", live(L2)));
			rt.setFv(f, "switchcount", live(target), rt.fv(f, "switchcount", live(L2)));
			rt.setFv(f, "rigged", live(target), rt.sv(f, "emagged"));
			rt.setFv(f, "brightness", live(target), rt.fv(f, "brightness", live(L2)));
			rt.setFv(f, "on", live(target), (yield* g.callName(f, live(target), "has_power", [])));
			yield* g.callName(f, live(target), "update", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(L2)]);
			if ((truthy(rt.fv(f, "on", live(target))) && truthy(rt.fv(f, "rigged", live(target))))) {
				yield* g.callName(f, live(target), "explode", []);
			}
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(U), rt.sv(f, "failmsg")]);
			return live(f.dot);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='warning'>There is a working ＀ already inserted!</span>", [rt.fv(f, "fitting", live(target))])]);
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/item/device/lightreplacer/proc/Emag  (code/game/objects/items/devices/lightreplacer.dm:223)
rt.def("/obj/item/device/lightreplacer/proc/Emag", function Emag(f: Frame) {
	rt.setSv(f, "emagged", (!truthy(rt.sv(f, "emagged")) ? 1 : 0));
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 100, 1]);
	if (truthy(rt.sv(f, "emagged"))) {
		rt.setSv(f, "name", fmt("shortcircuited ＀", [rt.initial(f, live(f.src), "name")]));
	} else {
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/device/lightreplacer/proc/CanUse  (code/game/objects/items/devices/lightreplacer.dm:232)  may sleep
rt.def("/obj/item/device/lightreplacer/proc/CanUse", function* CanUse(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (rt.gt(rt.sv(f, "uses"), 0)) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/item/device/lightreplacer/proc/afterattack  (code/game/objects/items/devices/lightreplacer.dm:239)  may sleep
rt.def("/obj/item/device/lightreplacer/proc/afterattack", function* afterattack(f: Frame, _T: Value, U: Value, proximity: Value) {
	let used: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [_T, U, proximity, used, A, $e];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) {
		return live(f.dot);
	}
	used = 0;
	A = null;
	rt.forList(f, 0, live(_T), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy((yield* g.srcCall(f, "CanUse", live(U))))) {
			break;
		}
		used = 1;
		if (truthy((rt.istype(live(A), T("/obj/machinery/light")) ? 1 : 0))) {
			yield* g.srcCall(f, "ReplaceLight", live(A), live(U));
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(used))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), rt.sv(f, "failmsg")]);
	return f.dot;
}, true);

// /obj/item/device/lightreplacer/proc/janicart_insert  (code/game/objects/items/devices/lightreplacer.dm:256)  may sleep
rt.def("/obj/item/device/lightreplacer/proc/janicart_insert", function* janicart_insert(f: Frame, user: Value, J: Value) {
	f.vars = () => [user, J];
	yield* g.callName(f, live(J), "put_in_cart", [live(f.src), live(user)]);
	rt.setFv(f, "myreplacer", live(J), live(f.src));
	yield* g.callName(f, live(J), "update_icon", []);
	return f.dot;
}, true);
