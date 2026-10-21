// From code/game/objects/items/control_wand.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6986, "/obj/item/weapon/door_remote", "/obj/item/weapon", {
	mode: "Open Door",
	region_access: 1,
	ID: null,
	icon_state: "gangtool-white",
	item_state: "electronic",
	icon: rt.rsc("icons/obj/device.dmi"),
	name: "control wand",
	desc: "Remotely controls airlocks.",
	w_class: 1,
});

// /obj/item/weapon/door_remote/proc/New  (code/game/objects/items/control_wand.dm:17)  may sleep
rt.def("/obj/item/weapon/door_remote/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "ID", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [])));
	rt.setFv(f, "access", rt.sv(f, "ID"), (yield* g.call(f, P("/proc/get_region_accesses"), null, [rt.sv(f, "region_access")])));
	return f.dot;
}, true);

// /obj/item/weapon/door_remote/proc/attack_self  (code/game/objects/items/control_wand.dm:22)
rt.def("/obj/item/weapon/door_remote/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === "Open Door") {
		rt.setSv(f, "mode", "Toggle Bolts");
	} else if ($0 === "Toggle Bolts") {
		rt.setSv(f, "mode", "Toggle Emergency Access");
	} else if ($0 === "Toggle Emergency Access") {
		rt.setSv(f, "mode", "Open Door");
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("Now in mode: ＀.", [rt.sv(f, "mode")])]);
	return f.dot;
});

// /obj/item/weapon/door_remote/proc/afterattack  (code/game/objects/items/control_wand.dm:32)  may sleep
rt.def("/obj/item/weapon/door_remote/proc/afterattack", function* afterattack(f: Frame, D: Value, user: Value) {
	let $0: any;
	f.vars = () => [D, user, $0];
	if (!truthy((rt.istype(live(D), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(D), "hasPower", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ has no power!</span>", [live(D)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(D), "requiresID", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀'s ID scan is disabled!</span>", [live(D)])]);
		return live(f.dot);
	}
	if ((truthy((yield* g.callName(f, live(D), "check_access", [rt.sv(f, "ID")]))) && truthy((yield* g.callName(f, live(D), "canAIControl", [live(user)]))))) {
		$0 = rt.sv(f, "mode");
		if ($0 === "Open Door") {
			if (truthy(rt.fv(f, "density", live(D)))) {
				yield* g.callName(f, live(D), "open", []);
			} else {
				yield* g.callName(f, live(D), "close", []);
			}
		} else if ($0 === "Toggle Bolts") {
			if (truthy(rt.fv(f, "locked", live(D)))) {
				yield* g.callName(f, live(D), "unbolt", []);
			} else {
				yield* g.callName(f, live(D), "bolt", []);
			}
		} else if ($0 === "Toggle Emergency Access") {
			if (truthy(rt.fv(f, "emergency", live(D)))) {
				rt.setFv(f, "emergency", live(D), 0);
			} else {
				rt.setFv(f, "emergency", live(D), 1);
			}
			yield* g.callName(f, live(D), "update_icon", []);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ does not have access to this door.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);
