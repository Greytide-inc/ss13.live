// From code/modules/modular_computers/hardware/ai_slot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7579, "/obj/item/weapon/computer_hardware/ai_slot", "/obj/item/weapon/computer_hardware", {
	stored_card: null,
	locked: 0,
	power_usage: 100,
	device_type: "AI",
	name: "intelliCard interface slot",
	desc: "A module allowing this computer to interface with most common intelliCard modules. Necessary for some programs to run properly.",
	icon_state: "card_mini",
	w_class: 2,
	origin_tech: "programming=2",
});

// /obj/item/weapon/computer_hardware/ai_slot/proc/examine  (code/modules/modular_computers/hardware/ai_slot.dm:15)
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "stored_card"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There appears to be an intelliCard loaded. There appears to be a pinhole protecting a manual eject button. A screwdriver could probably press it"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/ai_slot/proc/on_install  (code/modules/modular_computers/hardware/ai_slot.dm:20)
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/on_install", function on_install(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	rt.callName(f, live(M), "add_verb", [rt.sv(f, "device_type")]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/ai_slot/proc/on_remove  (code/modules/modular_computers/hardware/ai_slot.dm:23)
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/on_remove", function on_remove(f: Frame, M: Value, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	rt.callName(f, live(M), "remove_verb", [rt.sv(f, "device_type")]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/ai_slot/proc/try_insert  (code/modules/modular_computers/hardware/ai_slot.dm:26)  may sleep
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/try_insert", function* try_insert(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (live(user) === null) {
		user = null;
	}
	if (!truthy(rt.sv(f, "holder"))) {
		return 0;
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/device/aicard")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.sv(f, "stored_card"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You try to insert ％！ into ％！, but the slot is occupied.</span>", [live(I), live(f.src)])]);
		return 0;
	}
	if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)]))))) {
		return 0;
	}
	rt.setSv(f, "stored_card", live(I));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert ％！ into ％！.</span>", [live(I), live(f.src)])]);
	return 1;
}, true);

// /obj/item/weapon/computer_hardware/ai_slot/proc/try_eject  (code/modules/modular_computers/hardware/ai_slot.dm:45)  may sleep
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/try_eject", function* try_eject(f: Frame, slot: Value, user: Value, forced: Value) {
	f.vars = () => [slot, user, forced];
	if (live(slot) === null) {
		slot = 0;
	}
	if (live(user) === null) {
		user = null;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if (!truthy(rt.sv(f, "stored_card"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is no card in ％！.</span>", [live(f.src)])]);
		return 0;
	}
	if ((truthy(rt.sv(f, "locked")) && !truthy(live(forced)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Safeties prevent you from removing the card until reconstruction is complete...</span>"]);
		return 0;
	}
	if (truthy(rt.sv(f, "stored_card"))) {
		yield* g.callName(f, rt.sv(f, "stored_card"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		rt.setSv(f, "locked", 0);
		yield* g.callName(f, rt.sv(f, "stored_card"), "verb_pickup", []);
		rt.setSv(f, "stored_card", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the card from ％！.</span>", [live(f.src)])]);
		return 1;
	}
	return 0;
}, true);

// /obj/item/weapon/computer_hardware/ai_slot/proc/attackby  (code/modules/modular_computers/hardware/ai_slot.dm:64)  may sleep
rt.def("/obj/item/weapon/computer_hardware/ai_slot/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You press down on the manual eject button with ％！.</span>", [live(f.args[0])])]);
	yield* g.srcCall(f, "try_eject", null, live(f.args[1]), 1);
	return live(f.dot);
}, true, { args: ["I", "user"] });
