// From code/modules/modular_computers/hardware/card_slot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7581, "/obj/item/weapon/computer_hardware/card_slot", "/obj/item/weapon/computer_hardware", {
	stored_card: null,
	stored_card2: null,
	power_usage: 10,
	device_type: "CARD",
	name: "identification card authentication module",
	desc: "A module allowing this computer to read or write data on ID cards. Necessary for some programs to run properly.",
	icon_state: "card_mini",
	w_class: 1,
	origin_tech: "programming=2",
});

// /obj/item/weapon/computer_hardware/card_slot/proc/Destroy  (code/modules/modular_computers/hardware/card_slot.dm:14)  may sleep
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "try_eject");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/computer_hardware/card_slot/proc/GetAccess  (code/modules/modular_computers/hardware/card_slot.dm:18)
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/GetAccess", function GetAccess(f: Frame) {
	if ((truthy(rt.sv(f, "stored_card")) && truthy(rt.sv(f, "stored_card2")))) {
		return rt.bitOr(rt.callName(f, rt.sv(f, "stored_card"), "GetAccess", []), rt.callName(f, rt.sv(f, "stored_card2"), "GetAccess", []));
	}
	if (truthy(rt.sv(f, "stored_card"))) {
		return rt.callName(f, rt.sv(f, "stored_card"), "GetAccess", []);
	}
	if (truthy(rt.sv(f, "stored_card2"))) {
		return rt.callName(f, rt.sv(f, "stored_card2"), "GetAccess", []);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/item/weapon/computer_hardware/card_slot/proc/GetID  (code/modules/modular_computers/hardware/card_slot.dm:28)
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/GetID", function GetID(f: Frame) {
	if (truthy(rt.sv(f, "stored_card"))) {
		return rt.sv(f, "stored_card");
	} else {
		if (truthy(rt.sv(f, "stored_card2"))) {
			return rt.sv(f, "stored_card2");
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/item/weapon/computer_hardware/card_slot/proc/on_install  (code/modules/modular_computers/hardware/card_slot.dm:34)
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	rt.callName(f, live(M), "add_verb", [rt.sv(f, "device_type")]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/card_slot/proc/on_remove  (code/modules/modular_computers/hardware/card_slot.dm:37)
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/on_remove", function on_remove(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	rt.callName(f, live(M), "remove_verb", [rt.sv(f, "device_type")]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/card_slot/proc/try_insert  (code/modules/modular_computers/hardware/card_slot.dm:40)  may sleep
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (live(user) === null) {
		user = null;
	}
	if (!truthy(rt.sv(f, "holder"))) {
		return 0;
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "stored_card")) && truthy(rt.sv(f, "stored_card2")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You try to insert ％！ into ％！, but its slots are occupied.</span>", [live(I), live(f.src)])]);
		return 0;
	}
	if (truthy(live(user))) {
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)])))) {
			return 0;
		}
	} else {
		yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
	}
	if (!truthy(rt.sv(f, "stored_card"))) {
		rt.setSv(f, "stored_card", live(I));
	} else {
		rt.setSv(f, "stored_card2", live(I));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert ％！ into ％！.</span>", [live(I), live(f.src)])]);
	return 1;
}, true);

// /obj/item/weapon/computer_hardware/card_slot/proc/try_eject  (code/modules/modular_computers/hardware/card_slot.dm:65)  may sleep
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/try_eject", function* try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	let ejected: Value = null, I: Value = null, _P: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [slot, user, forced, ejected, I, _P, $0, $1, $e];
	if (live(slot) === null) {
		slot = 0;
	}
	if (live(user) === null) {
		user = null;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if ((!truthy(rt.sv(f, "stored_card")) && !truthy(rt.sv(f, "stored_card2")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There are no cards in ％！.</span>", [live(f.src)])]);
		return 0;
	}
	ejected = 0;
	if ((truthy(rt.sv(f, "stored_card")) && (!truthy(live(slot)) || isEqual(live(slot), 1)))) {
		if (truthy(live(user))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "stored_card")]);
		} else {
			yield* g.callName(f, rt.sv(f, "stored_card"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		}
		rt.setSv(f, "stored_card", null);
		ejected = rt.inc(live(ejected), 1);
	}
	if ((truthy(rt.sv(f, "stored_card2")) && (!truthy(live(slot)) || isEqual(live(slot), 2)))) {
		if (truthy(live(user))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "stored_card2")]);
		} else {
			yield* g.callName(f, rt.sv(f, "stored_card2"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		}
		rt.setSv(f, "stored_card2", null);
		ejected = rt.inc(live(ejected), 1);
	}
	if (truthy(live(ejected))) {
		if (truthy(rt.sv(f, "holder"))) {
			if (truthy(rt.fv(f, "active_program", rt.sv(f, "holder")))) {
				yield* g.callName(f, rt.fv(f, "active_program", rt.sv(f, "holder")), "event_idremoved", [0, live(slot)]);
			}
			I = null;
			rt.forList(f, 0, rt.fv(f, "idle_threads", rt.sv(f, "holder")));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				yield* g.callName(f, (_P = live(I)), "event_idremoved", [1, live(slot)]);
			}
			rt.endFor(f, 0);
		}
		$0 = live(user);
		if (rt.gt(live(ejected), 1)) {
			$1 = "s";
		} else {
			$1 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You remove the card＀ from ％！.</span>", [$1, live(f.src)])]);
		return 1;
	}
	return 0;
}, true);

// /obj/item/weapon/computer_hardware/card_slot/proc/attackby  (code/modules/modular_computers/hardware/card_slot.dm:100)  may sleep
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You press down on the manual eject button with ％！.</span>", [live(f.args[0])])]);
	yield* g.srcCall(f, "try_eject", 0, live(f.args[1]));
	return live(f.dot);
}, true, { args: ["I", "user"] });

// /obj/item/weapon/computer_hardware/card_slot/proc/examine  (code/modules/modular_computers/hardware/card_slot.dm:108)
rt.def("/obj/item/weapon/computer_hardware/card_slot/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "stored_card")) || truthy(rt.sv(f, "stored_card2")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There appears to be something loaded in the card slots."]);
	return f.dot;
}, false, { args: ["user"] });
