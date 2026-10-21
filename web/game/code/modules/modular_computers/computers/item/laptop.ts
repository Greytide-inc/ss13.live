// From code/modules/modular_computers/computers/item/laptop.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9410, "/obj/item/device/modular_computer/laptop", "/obj/item/device/modular_computer", {
	start_open: 1,
	icon_state_closed: "laptop-closed",
	w_class_open: 4,
	slowdown_open: 1,
	icon_state_powered: "laptop",
	icon_state_unpowered: "laptop-off",
	icon_state_menu: "menu",
	hardware_flag: 2,
	max_hardware_size: 2,
	screen_on: 0,
	name: "laptop",
	desc: "A portable laptop computer.",
	icon: rt.rsc("icons/obj/modular_laptop.dmi"),
	icon_state: "laptop-closed",
	w_class: 3,
});

// /obj/item/device/modular_computer/laptop/proc/Initialize  (code/modules/modular_computers/computers/item/laptop.dm:22)  may sleep
rt.def("/obj/item/device/modular_computer/laptop/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "slows_while_in_hand", 1);
	if (!(truthy(rt.sv(f, "start_open")) && !truthy(rt.sv(f, "screen_on")))) return f.dot;
	yield* g.srcCall(f, "toggle_open");
	return f.dot;
}, true);

// /obj/item/device/modular_computer/laptop/proc/update_icon  (code/modules/modular_computers/computers/item/laptop.dm:32)
rt.def("/obj/item/device/modular_computer/laptop/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "screen_on"))) {
		rt.callSuper(f, [], rt.Args.Same);
	} else {
		rt.callSrc(f, "cut_overlays", []);
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_closed"));
	}
	return f.dot;
});

// /obj/item/device/modular_computer/laptop/proc/attack_self  (code/modules/modular_computers/computers/item/laptop.dm:38)  may sleep
rt.def("/obj/item/device/modular_computer/laptop/proc/attack_self", function* attack_self(f: Frame) {
	if (!truthy(rt.sv(f, "screen_on"))) {
		yield* g.srcCall(f, "try_toggle_open", live(f.args[0]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/modular_computer/laptop/verb/open_computer  (code/modules/modular_computers/computers/item/laptop.dm:48)
rt.def("/obj/item/device/modular_computer/laptop/verb/open_computer", function open_computer(f: Frame) {
	rt.callSrc(f, "try_toggle_open", [live(f.usr)]);
	return f.dot;
}, false, { verb: { name: "Toggle Open", category: "Object", src: 1, range: 1 } });

// /obj/item/device/modular_computer/laptop/proc/MouseDrop  (code/modules/modular_computers/computers/item/laptop.dm:51)  may sleep
rt.def("/obj/item/device/modular_computer/laptop/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let H: Value = null, M: Value = null;
	f.vars = () => [over_object, src_location, over_location, H, M];
	if ((isEqual(live(over_object), live(f.usr)) || isEqual(live(over_object), live(f.src)))) {
		yield* g.srcCall(f, "try_toggle_open", live(f.usr));
	} else {
		if (!truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) return f.dot;
		H = live(over_object);
		if (!(!truthy((yield* g.callName(f, (M = live(f.usr)), "restrained", []))) && !truthy(rt.fv(f, "stat", live(M))))) return f.dot;
		if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) || !truthy((yield* g.srcCall(f, "Adjacent", live(M)))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(M), "put_in_hand", [live(f.src), rt.fv(f, "held_index", live(H))]);
	}
	return f.dot;
}, true);

// /obj/item/device/modular_computer/laptop/proc/attack_hand  (code/modules/modular_computers/computers/item/laptop.dm:63)  may sleep
rt.def("/obj/item/device/modular_computer/laptop/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((truthy(rt.sv(f, "screen_on")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
		return (yield* g.srcCall(f, "attack_self", live(f.args[0])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

// /obj/item/device/modular_computer/laptop/proc/try_toggle_open  (code/modules/modular_computers/computers/item/laptop.dm:70)
rt.def("/obj/item/device/modular_computer/laptop/proc/try_toggle_open", function try_toggle_open(f: Frame, user: Value) {
	if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])) && !truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		return live(f.dot);
	}
	if (!truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src)]))) {
		return live(f.dot);
	}
	rt.callSrc(f, "toggle_open", [live(user)]);
	return f.dot;
});

// /obj/item/device/modular_computer/laptop/proc/AltClick  (code/modules/modular_computers/computers/item/laptop.dm:82)  may sleep
rt.def("/obj/item/device/modular_computer/laptop/proc/AltClick", function* AltClick(f: Frame) {
	if (truthy(rt.sv(f, "screen_on"))) {
		yield* g.srcCall(f, "try_toggle_open", live(f.args[0]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/modular_computer/laptop/proc/toggle_open  (code/modules/modular_computers/computers/item/laptop.dm:88)
rt.def("/obj/item/device/modular_computer/laptop/proc/toggle_open", function toggle_open(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = null;
	}
	if (truthy(rt.sv(f, "screen_on"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You close ％！.</span>", [live(f.src)])]);
		rt.setSv(f, "slowdown", rt.initial(f, live(f.src), "slowdown"));
		rt.setSv(f, "w_class", rt.initial(f, live(f.src), "w_class"));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You open ％！.</span>", [live(f.src)])]);
		rt.setSv(f, "slowdown", rt.sv(f, "slowdown_open"));
		rt.setSv(f, "w_class", rt.sv(f, "w_class_open"));
	}
	rt.setSv(f, "screen_on", (!truthy(rt.sv(f, "screen_on")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});
