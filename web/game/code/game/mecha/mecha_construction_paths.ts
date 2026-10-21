// From code/game/mecha/mecha_construction_paths.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1036, "/datum/construction/mecha", "/datum/construction", {});

// /datum/construction/mecha/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:6)  may sleep
rt.def("/datum/construction/mecha/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	let W: Value = null, C: Value = null, S: Value = null;
	f.vars = () => [step, used_atom, user, W, C, S];
	if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (W = live(used_atom)), "remove_fuel", [0, live(user)])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
		} else {
			return 0;
		}
	} else {
		if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			W = live(used_atom);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(W)), 50, 1]);
		} else {
			if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				W = live(used_atom);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(W)), 50, 1]);
			} else {
				if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
					W = live(used_atom);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(W)), 50, 1]);
				} else {
					if (truthy((rt.istype(live(used_atom), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
						if (truthy((yield* g.callName(f, (C = live(used_atom)), "use", [4])))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's not enough cable to finish the task!</span>"]);
							return 0;
						}
					} else {
						if (truthy((rt.istype(live(used_atom), T("/obj/item/stack")) ? 1 : 0))) {
							if (rt.lt((yield* g.callName(f, (S = live(used_atom)), "get_amount", [])), 5)) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's not enough material in this stack!</span>"]);
								return 0;
							} else {
								yield* g.callName(f, live(S), "use", [5]);
							}
						}
					}
				}
			}
		}
	}
	return 1;
}, true);

rt.type(1029, "/datum/construction/reversible/mecha", "/datum/construction/reversible", {});

// /datum/construction/reversible/mecha/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:41)  may sleep
rt.def("/datum/construction/reversible/mecha/proc/custom_action", function* custom_action(f: Frame, index: Value, diff: Value, used_atom: Value, user: Value) {
	let W: Value = null, C: Value = null, S: Value = null;
	f.vars = () => [index, diff, used_atom, user, W, C, S];
	if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (W = live(used_atom)), "remove_fuel", [0, live(user)])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
		} else {
			return 0;
		}
	} else {
		if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			W = live(used_atom);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(W)), 50, 1]);
		} else {
			if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				W = live(used_atom);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(W)), 50, 1]);
			} else {
				if (truthy((rt.istype(live(used_atom), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
					W = live(used_atom);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.fv(f, "usesound", live(W)), 50, 1]);
				} else {
					if (truthy((rt.istype(live(used_atom), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
						if (truthy((yield* g.callName(f, (C = live(used_atom)), "use", [4])))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's not enough cable to finish the task!</span>"]);
							return 0;
						}
					} else {
						if (truthy((rt.istype(live(used_atom), T("/obj/item/stack")) ? 1 : 0))) {
							if (rt.lt((yield* g.callName(f, (S = live(used_atom)), "get_amount", [])), 5)) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's not enough material in this stack!</span>"]);
								return 0;
							} else {
								yield* g.callName(f, live(S), "use", [5]);
							}
						}
					}
				}
			}
		}
	}
	return 1;
}, true);

rt.type(1037, "/datum/construction/mecha/ripley_chassis", "/datum/construction/mecha", {
	steps: null,
});

// /datum/construction/mecha/ripley_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:77)
rt.def("/datum/construction/mecha/ripley_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_leg")])));
	return f.dot;
});

// /datum/construction/mecha/ripley_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:85)  may sleep
rt.def("/datum/construction/mecha/ripley_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect ＀ to the ＀.</span>", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/ripley_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:91)  may sleep
rt.def("/datum/construction/mecha/ripley_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/ripley_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:94)  may sleep
rt.def("/datum/construction/mecha/ripley_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/reversible/mecha/ripley"), [live(const_holder)])));
	rt.setFv(f, "icon", live(const_holder), rt.rsc("icons/mecha/mech_construction.dmi"));
	rt.setFv(f, "icon_state", live(const_holder), "ripley0");
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.callName(f, live(const_holder), "cut_overlays", [1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(1030, "/datum/construction/reversible/mecha/ripley", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/working/ripley",
	steps: null,
});

// /datum/construction/reversible/mecha/ripley/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:106)
rt.def("/datum/construction/reversible/mecha/ripley/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."])));
	return f.dot;
});

// /datum/construction/reversible/mecha/ripley/proc/action  (code/game/mecha/mecha_construction_paths.dm:165)  may sleep
rt.def("/datum/construction/reversible/mecha/ripley/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/reversible/mecha/ripley/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:168)  may sleep
rt.def("/datum/construction/reversible/mecha/ripley/proc/custom_action", function* custom_action(f: Frame) {
	let coil: Value = null, MS: Value = null;
	let $0: any;
	f.vars = () => [coil, MS, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === 14) {
		yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
		rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley1");
	} else if ($0 === 13) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ activates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You activate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley2");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley0");
		}
	} else if ($0 === 12) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adds the wiring to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You add the wiring to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley3");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ deactivates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You deactivate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley1");
		}
	} else if ($0 === 11) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adjusts the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You adjust the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley4");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the wiring from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the wiring from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (coil = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 4);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley2");
		}
	} else if ($0 === 10) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central computer mainboard into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley5");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley3");
		}
	} else if ($0 === 9) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the mainboard.", [live(f.args[3])]), "<span class='notice'>You secure the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley6");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the central control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the central computer mainboard from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/ripley/main"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley4");
		}
	} else if ($0 === 8) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley7");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the mainboard.", [live(f.args[3])]), "<span class='notice'>You unfasten the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley5");
		}
	} else if ($0 === 7) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You secure the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley8");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the peripherals control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the peripherals control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley6");
		}
	} else if ($0 === 6) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley9");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley7");
		}
	} else if ($0 === 5) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley10");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley8");
		}
	} else if ($0 === 4) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley11");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley9");
		}
	} else if ($0 === 3) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the external reinforced armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the external reinforced armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley12");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ cuts the internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You cut the internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley10");
		}
	} else if ($0 === 2) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the external armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the external reinforced armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley13");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries external armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry external armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley11");
		}
	} else if ($0 === 1) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the external armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the external armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the external armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the external armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "ripley12");
		}
	}
	return 1;
}, true, { args: ["index", "diff", "used_atom", "user"] });

// /datum/construction/reversible/mecha/ripley/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:279)  may sleep
rt.def("/datum/construction/reversible/mecha/ripley/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

rt.type(1038, "/datum/construction/mecha/gygax_chassis", "/datum/construction/mecha", {
	steps: null,
});

// /datum/construction/mecha/gygax_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:286)
rt.def("/datum/construction/mecha/gygax_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_head")])));
	return f.dot;
});

// /datum/construction/mecha/gygax_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:295)  may sleep
rt.def("/datum/construction/mecha/gygax_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect ＀ to the ＀.</span>", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/gygax_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:301)  may sleep
rt.def("/datum/construction/mecha/gygax_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/gygax_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:304)  may sleep
rt.def("/datum/construction/mecha/gygax_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/reversible/mecha/gygax"), [live(const_holder)])));
	rt.setFv(f, "icon", live(const_holder), rt.rsc("icons/mecha/mech_construction.dmi"));
	rt.setFv(f, "icon_state", live(const_holder), "gygax0");
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(1031, "/datum/construction/reversible/mecha/gygax", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/combat/gygax",
	steps: null,
});

// /datum/construction/reversible/mecha/gygax/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:315)
rt.def("/datum/construction/reversible/mecha/gygax/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/gygax_armor"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Advanced capacitor is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Advanced capacitor is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/capacitor"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Advanced scanner module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Advanced scanner module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/scanning_module"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Weapon control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Weapon control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/gygax/targeting"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/gygax/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/gygax/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."])));
	return f.dot;
});

// /datum/construction/reversible/mecha/gygax/proc/action  (code/game/mecha/mecha_construction_paths.dm:398)  may sleep
rt.def("/datum/construction/reversible/mecha/gygax/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/reversible/mecha/gygax/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:401)  may sleep
rt.def("/datum/construction/reversible/mecha/gygax/proc/custom_action", function* custom_action(f: Frame) {
	let coil: Value = null, I: Value = null, MS: Value = null;
	let $0: any;
	f.vars = () => [coil, I, MS, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === 20) {
		yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
		rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax1");
	} else if ($0 === 19) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ activates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You activate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax2");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax0");
		}
	} else if ($0 === 18) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adds the wiring to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You add the wiring to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax3");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ deactivates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You deactivate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax1");
		}
	} else if ($0 === 17) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adjusts the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You adjust the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax4");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the wiring from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the wiring from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (coil = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 4);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax2");
		}
	} else if ($0 === 16) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central computer mainboard into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax5");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax3");
		}
	} else if ($0 === 15) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the mainboard.", [live(f.args[3])]), "<span class='notice'>You secure the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax6");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the central control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the central computer mainboard from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/gygax/main"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax4");
		}
	} else if ($0 === 14) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax7");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the mainboard.", [live(f.args[3])]), "<span class='notice'>You unfasten the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax5");
		}
	} else if ($0 === 13) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You secure the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax8");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the peripherals control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the peripherals control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/gygax/peripherals"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax6");
		}
	} else if ($0 === 12) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the weapon control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the weapon control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax9");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax7");
		}
	} else if ($0 === 11) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the weapon control module.", [live(f.args[3])]), "<span class='notice'>You secure the weapon control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax10");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the weapon control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the weapon control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/gygax/targeting"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax8");
		}
	} else if ($0 === 10) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs scanner module to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install scanner module to the ＀.</span>", [rt.sv(f, "holder")])]);
			I = live(f.args[2]);
			yield* g.callName(f, live(f.args[3]), "transferItemToLoc", [live(I), rt.sv(f, "holder"), 1]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax11");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the weapon control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the weapon control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax9");
		}
	} else if ($0 === 9) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the advanced scanner module.", [live(f.args[3])]), "<span class='notice'>You secure the scanner module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax12");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the advanced scanner module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the scanner module from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "loc", (I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), rt.sv(f, "holder"))), rt.getStep(f, rt.sv(f, "holder"), 0));
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax10");
		}
	} else if ($0 === 8) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs capacitor to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install capacitor to the ＀.</span>", [rt.sv(f, "holder")])]);
			I = live(f.args[2]);
			yield* g.callName(f, live(f.args[3]), "transferItemToLoc", [live(I), rt.sv(f, "holder"), 1]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax13");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the  scanner module.", [live(f.args[3])]), "<span class='notice'>You unfasten the scanner module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax11");
		}
	} else if ($0 === 7) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the  capacitor.", [live(f.args[3])]), "<span class='notice'>You secure the capacitor.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax14");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the  capacitor from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the capacitor from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "loc", (I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), rt.sv(f, "holder"))), rt.getStep(f, rt.sv(f, "holder"), 0));
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax12");
		}
	} else if ($0 === 6) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax15");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the capacitor.", [live(f.args[3])]), "<span class='notice'>You unfasten the capacitor.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax13");
		}
	} else if ($0 === 5) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax16");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax14");
		}
	} else if ($0 === 4) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax17");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax15");
		}
	} else if ($0 === 3) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs Gygax Armor Plates to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install Gygax Armor Plates to the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax18");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ cuts the internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You cut the internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax16");
		}
	} else if ($0 === 2) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures Gygax Armor Plates.", [live(f.args[3])]), "<span class='notice'>You secure Gygax Armor Plates.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax19");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries Gygax Armor Plates from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry Gygax Armor Plates from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/mecha_parts/part/gygax_armor"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax17");
		}
	} else if ($0 === 1) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds Gygax Armor Plates to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld Gygax Armor Plates to the ＀.</span>", [rt.sv(f, "holder")])]);
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens Gygax Armor Plates.", [live(f.args[3])]), "<span class='notice'>You unfasten Gygax Armor Plates.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "gygax18");
		}
	}
	return 1;
}, true, { args: ["index", "diff", "used_atom", "user"] });

// /datum/construction/reversible/mecha/gygax/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:564)  may sleep
rt.def("/datum/construction/reversible/mecha/gygax/proc/spawn_result", function* spawn_result(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callName(f, (M = (yield* g.new_(f, rt.sv(f, "result"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), "CheckParts", [rt.fv(f, "contents", rt.sv(f, "holder"))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holder")]);
	return live(f.dot);
}, true);

rt.type(1039, "/datum/construction/mecha/firefighter_chassis", "/datum/construction/mecha", {
	steps: null,
});

// /datum/construction/mecha/firefighter_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:571)
rt.def("/datum/construction/mecha/firefighter_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/ripley_right_leg")]), rt.alist(f, ["key", T("/obj/item/clothing/suit/fire")])));
	return f.dot;
});

// /datum/construction/mecha/firefighter_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:580)  may sleep
rt.def("/datum/construction/mecha/firefighter_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect ＀ to the ＀.</span>", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/firefighter_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:586)  may sleep
rt.def("/datum/construction/mecha/firefighter_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/firefighter_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:589)  may sleep
rt.def("/datum/construction/mecha/firefighter_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/reversible/mecha/firefighter"), [live(const_holder)])));
	rt.setFv(f, "icon", live(const_holder), rt.rsc("icons/mecha/mech_construction.dmi"));
	rt.setFv(f, "icon_state", live(const_holder), "fireripley0");
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(1032, "/datum/construction/reversible/mecha/firefighter", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/working/ripley/firefighter",
	steps: null,
});

// /datum/construction/reversible/mecha/firefighter/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:600)
rt.def("/datum/construction/reversible/mecha/firefighter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is being installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/ripley/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."])));
	return f.dot;
});

// /datum/construction/reversible/mecha/firefighter/proc/action  (code/game/mecha/mecha_construction_paths.dm:664)  may sleep
rt.def("/datum/construction/reversible/mecha/firefighter/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/reversible/mecha/firefighter/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:667)  may sleep
rt.def("/datum/construction/reversible/mecha/firefighter/proc/custom_action", function* custom_action(f: Frame) {
	let coil: Value = null, MS: Value = null;
	let $0: any;
	f.vars = () => [coil, MS, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === 15) {
		yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
		rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley1");
	} else if ($0 === 14) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ activates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You activate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley2");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley0");
		}
	} else if ($0 === 13) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adds the wiring to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You add the wiring to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley3");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ deactivates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You deactivate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley1");
		}
	} else if ($0 === 12) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adjusts the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You adjust the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley4");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the wiring from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the wiring from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (coil = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 4);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley2");
		}
	} else if ($0 === 11) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central computer mainboard into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley5");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley3");
		}
	} else if ($0 === 10) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the mainboard.", [live(f.args[3])]), "<span class='notice'>You secure the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley6");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the central control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the central computer mainboard from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/ripley/main"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley4");
		}
	} else if ($0 === 9) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley7");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the mainboard.", [live(f.args[3])]), "<span class='notice'>You unfasten the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley5");
		}
	} else if ($0 === 8) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You secure the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley8");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the peripherals control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the peripherals control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/ripley/peripherals"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley6");
		}
	} else if ($0 === 7) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley9");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley7");
		}
	} else if ($0 === 6) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley10");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley8");
		}
	} else if ($0 === 5) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley11");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley9");
		}
	} else if ($0 === 4) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ starts to install the external armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the external armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley12");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ cuts the internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You cut the internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley10");
		}
	} else if ($0 === 3) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the external reinforced armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the external reinforced armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley13");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the external armor from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the external armor from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley11");
		}
	} else if ($0 === 2) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the external armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the external reinforced armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley14");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries external armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry external armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley12");
		}
	} else if ($0 === 1) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the external armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the external armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the external armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the external armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "fireripley13");
		}
	}
	return 1;
}, true, { args: ["index", "diff", "used_atom", "user"] });

// /datum/construction/reversible/mecha/firefighter/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:788)  may sleep
rt.def("/datum/construction/reversible/mecha/firefighter/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

rt.type(1040, "/datum/construction/mecha/honker_chassis", "/datum/construction/mecha", {
	steps: null,
});

// /datum/construction/mecha/honker_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:795)
rt.def("/datum/construction/mecha/honker_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/honker_head")])));
	return f.dot;
});

// /datum/construction/mecha/honker_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:804)  may sleep
rt.def("/datum/construction/mecha/honker_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/honker_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:807)  may sleep
rt.def("/datum/construction/mecha/honker_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect ＀ to the ＀.</span>", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/honker_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:813)  may sleep
rt.def("/datum/construction/mecha/honker_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/mecha/honker"), [live(const_holder)])));
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(1041, "/datum/construction/mecha/honker", "/datum/construction/mecha", {
	result: "/obj/mecha/combat/honker",
	steps: null,
});

// /datum/construction/mecha/honker/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:822)
rt.def("/datum/construction/mecha/honker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/clothing/shoes/clown_shoes")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/clothing/mask/gas/clown_hat")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/honker/targeting")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/honker/peripherals")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/honker/main")]), rt.alist(f, ["key", T("/obj/item/weapon/bikehorn")])));
	return f.dot;
});

// /datum/construction/mecha/honker/proc/action  (code/game/mecha/mecha_construction_paths.dm:836)  may sleep
rt.def("/datum/construction/mecha/honker/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/honker/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:839)  may sleep
rt.def("/datum/construction/mecha/honker/proc/custom_action", function* custom_action(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.args[1]), T("/obj/item/weapon/bikehorn")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "holder"), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
		yield* g.callName(f, live(f.args[2]), "visible_message", ["HONK!"]);
	}
	$0 = live(f.args[0]);
	if ($0 === 10) {
		yield* g.callName(f, live(f.args[2]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[2]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central control module into the ＀.</span>", [rt.sv(f, "holder")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[1])]);
	} else if ($0 === 8) {
		yield* g.callName(f, live(f.args[2]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[2]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[1])]);
	} else if ($0 === 6) {
		yield* g.callName(f, live(f.args[2]), "visible_message", [fmt("＀ installs the weapon control module into the ＀.", [live(f.args[2]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the weapon control module into the ＀.</span>", [rt.sv(f, "holder")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[1])]);
	} else if ($0 === 4) {
		yield* g.callName(f, live(f.args[2]), "visible_message", [fmt("＀ puts clown wig and mask on the ＀.", [live(f.args[2]), rt.sv(f, "holder")]), fmt("<span class='notice'>You put clown wig and mask on the ＀.</span>", [rt.sv(f, "holder")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[1])]);
	} else if ($0 === 2) {
		yield* g.callName(f, live(f.args[2]), "visible_message", [fmt("＀ puts clown boots on the ＀.", [live(f.args[2]), rt.sv(f, "holder")]), fmt("<span class='notice'>You put clown boots on the ＀.</span>", [rt.sv(f, "holder")])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[1])]);
	}
	return 1;
}, true, { args: ["step", "used_atom", "user"] });

// /datum/construction/mecha/honker/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:866)  may sleep
rt.def("/datum/construction/mecha/honker/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

rt.type(1042, "/datum/construction/mecha/durand_chassis", "/datum/construction/mecha", {
	steps: null,
});

// /datum/construction/mecha/durand_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:871)
rt.def("/datum/construction/mecha/durand_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_head")])));
	return f.dot;
});

// /datum/construction/mecha/durand_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:880)  may sleep
rt.def("/datum/construction/mecha/durand_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("You connect ＀ to the ＀", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/durand_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:886)  may sleep
rt.def("/datum/construction/mecha/durand_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/durand_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:889)  may sleep
rt.def("/datum/construction/mecha/durand_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/reversible/mecha/durand"), [live(const_holder)])));
	rt.setFv(f, "icon", live(const_holder), rt.rsc("icons/mecha/mech_construction.dmi"));
	rt.setFv(f, "icon_state", live(const_holder), "durand0");
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.del(f, live(f.src));
	return live(f.dot);
}, true);

rt.type(1033, "/datum/construction/reversible/mecha/durand", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/combat/durand",
	steps: null,
});

// /datum/construction/reversible/mecha/durand/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:899)
rt.def("/datum/construction/reversible/mecha/durand/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/durand_armor"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Super capacitor is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Super capacitor is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/capacitor"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Phasic scanner module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Phasic scanner module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/scanning_module"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Weapon control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Weapon control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/durand/targeting"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/durand/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/durand/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."])));
	return f.dot;
});

// /datum/construction/reversible/mecha/durand/proc/action  (code/game/mecha/mecha_construction_paths.dm:983)  may sleep
rt.def("/datum/construction/reversible/mecha/durand/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/reversible/mecha/durand/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:986)  may sleep
rt.def("/datum/construction/reversible/mecha/durand/proc/custom_action", function* custom_action(f: Frame) {
	let coil: Value = null, I: Value = null, MS: Value = null;
	let $0: any;
	f.vars = () => [coil, I, MS, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === 20) {
		yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
		rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand1");
	} else if ($0 === 19) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ activates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You activate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand2");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand0");
		}
	} else if ($0 === 18) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adds the wiring to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You add the wiring to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand3");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ deactivates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You deactivate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand1");
		}
	} else if ($0 === 17) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adjusts the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You adjust the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand4");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the wiring from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the wiring from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (coil = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 4);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand2");
		}
	} else if ($0 === 16) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central computer mainboard into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand5");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand3");
		}
	} else if ($0 === 15) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the mainboard.", [live(f.args[3])]), "<span class='notice'>You secure the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand6");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the central control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the central computer mainboard from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/durand/main"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand4");
		}
	} else if ($0 === 14) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand7");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the mainboard.", [live(f.args[3])]), "<span class='notice'>You unfasten the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand5");
		}
	} else if ($0 === 13) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You secure the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand8");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the peripherals control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the peripherals control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/durand/peripherals"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand6");
		}
	} else if ($0 === 12) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the weapon control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the weapon control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand9");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand7");
		}
	} else if ($0 === 11) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the weapon control module.", [live(f.args[3])]), "<span class='notice'>You secure the weapon control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand10");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the weapon control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the weapon control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/durand/targeting"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand8");
		}
	} else if ($0 === 10) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs scanner module to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install phasic scanner module to the ＀.</span>", [rt.sv(f, "holder")])]);
			I = live(f.args[2]);
			yield* g.callName(f, live(f.args[3]), "transferItemToLoc", [live(I), rt.sv(f, "holder"), 1]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand11");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the weapon control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the weapon control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand9");
		}
	} else if ($0 === 9) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the scanner module.", [live(f.args[3])]), "<span class='notice'>You secure the scanner module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand12");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the scanner module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the scanner module from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "loc", (I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), rt.sv(f, "holder"))), rt.getStep(f, rt.sv(f, "holder"), 0));
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand10");
		}
	} else if ($0 === 8) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs capacitor to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install capacitor to the ＀.</span>", [rt.sv(f, "holder")])]);
			I = live(f.args[2]);
			yield* g.callName(f, live(f.args[3]), "transferItemToLoc", [live(I), rt.sv(f, "holder"), 1]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand13");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the scanner module.", [live(f.args[3])]), "<span class='notice'>You unfasten the scanner module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand11");
		}
	} else if ($0 === 7) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the capacitor.", [live(f.args[3])]), "<span class='notice'>You secure the capacitor.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand14");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the super capacitor from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the capacitor from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "loc", (I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), rt.sv(f, "holder"))), rt.getStep(f, rt.sv(f, "holder"), 0));
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand12");
		}
	} else if ($0 === 6) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand15");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the super capacitor.", [live(f.args[3])]), "<span class='notice'>You unfasten the capacitor.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand13");
		}
	} else if ($0 === 5) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand16");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand14");
		}
	} else if ($0 === 4) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand17");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand15");
		}
	} else if ($0 === 3) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs Durand Armor Plates to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install Durand Armor Plates to the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand18");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ cuts the internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You cut the internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand16");
		}
	} else if ($0 === 2) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures Durand Armor Plates.", [live(f.args[3])]), "<span class='notice'>You secure Durand Armor Plates.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand19");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries Durand Armor Plates from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry Durand Armor Plates from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/mecha_parts/part/durand_armor"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand17");
		}
	} else if ($0 === 1) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds Durand Armor Plates to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld Durand Armor Plates to the ＀.</span>", [rt.sv(f, "holder")])]);
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens Durand Armor Plates.", [live(f.args[3])]), "<span class='notice'>You unfasten Durand Armor Plates.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "durand18");
		}
	}
	return 1;
}, true, { args: ["index", "diff", "used_atom", "user"] });

// /datum/construction/reversible/mecha/durand/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:1149)  may sleep
rt.def("/datum/construction/reversible/mecha/durand/proc/spawn_result", function* spawn_result(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callName(f, (M = (yield* g.new_(f, rt.sv(f, "result"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), "CheckParts", [rt.fv(f, "contents", rt.sv(f, "holder"))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holder")]);
	return live(f.dot);
}, true);

rt.type(1043, "/datum/construction/mecha/phazon_chassis", "/datum/construction/mecha", {
	result: "/obj/mecha/combat/phazon",
	steps: null,
});

// /datum/construction/mecha/phazon_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:1159)
rt.def("/datum/construction/mecha/phazon_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_right_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_head")])));
	return f.dot;
});

// /datum/construction/mecha/phazon_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:1168)  may sleep
rt.def("/datum/construction/mecha/phazon_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect ＀ to the ＀.</span>", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/phazon_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:1174)  may sleep
rt.def("/datum/construction/mecha/phazon_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/phazon_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:1177)  may sleep
rt.def("/datum/construction/mecha/phazon_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/reversible/mecha/phazon"), [live(const_holder)])));
	rt.setFv(f, "icon", live(const_holder), rt.rsc("icons/mecha/mech_construction.dmi"));
	rt.setFv(f, "icon_state", live(const_holder), "phazon0");
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.del(f, live(f.src));
	return live(f.dot);
}, true);

rt.type(1034, "/datum/construction/reversible/mecha/phazon", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/combat/phazon",
	steps: null,
});

// /datum/construction/reversible/mecha/phazon/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:1187)
rt.def("/datum/construction/reversible/mecha/phazon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/device/assembly/signaler/anomaly"), "backkey", null, "desc", "Anomaly core socket is open and awaiting connection."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/phazon_armor"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Phase armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Phase armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Phase armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The bluespace crystal is engaged."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wirecutters"), "desc", "The bluespace crystal is connected."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "The bluespace crystal is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/ore/bluespace_crystal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Super capacitor is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Super capacitor is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/capacitor"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Phasic scanner module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Phasic scanner module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/stock_parts/scanning_module"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Weapon control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Weapon control is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/phazon/targeting"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed"]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/phazon/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/phazon/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."])));
	return f.dot;
});

// /datum/construction/reversible/mecha/phazon/proc/action  (code/game/mecha/mecha_construction_paths.dm:1288)  may sleep
rt.def("/datum/construction/reversible/mecha/phazon/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/reversible/mecha/phazon/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:1291)  may sleep
rt.def("/datum/construction/reversible/mecha/phazon/proc/custom_action", function* custom_action(f: Frame) {
	let coil: Value = null, I: Value = null, MS: Value = null;
	let $0: any;
	f.vars = () => [coil, I, MS, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === 24) {
		yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
		rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon1");
	} else if ($0 === 23) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ activates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You activate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon2");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon0");
		}
	} else if ($0 === 22) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adds the wiring to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You add the wiring to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon3");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ deactivates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You deactivate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon1");
		}
	} else if ($0 === 21) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adjusts the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You adjust the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon4");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the wiring from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the wiring from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (coil = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 4);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon2");
		}
	} else if ($0 === 20) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central computer mainboard into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon5");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon3");
		}
	} else if ($0 === 19) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the mainboard.", [live(f.args[3])]), "<span class='notice'>You secure the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon6");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the central control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the central computer mainboard from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/phazon/main"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon4");
		}
	} else if ($0 === 18) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon7");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the mainboard.", [live(f.args[3])]), "<span class='notice'>You unfasten the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon5");
		}
	} else if ($0 === 17) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You secure the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon8");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the peripherals control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the peripherals control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/phazon/peripherals"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon6");
		}
	} else if ($0 === 16) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the weapon control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the weapon control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon9");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon7");
		}
	} else if ($0 === 15) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the weapon control module.", [live(f.args[3])]), "<span class='notice'>You secure the weapon control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon10");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the weapon control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the weapon control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/phazon/targeting"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon8");
		}
	} else if ($0 === 14) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs phasic scanner module to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install scanner module to the ＀.</span>", [rt.sv(f, "holder")])]);
			I = live(f.args[2]);
			yield* g.callName(f, live(f.args[3]), "transferItemToLoc", [live(I), rt.sv(f, "holder"), 1]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon11");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the weapon control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the weapon control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon9");
		}
	} else if ($0 === 13) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the phasic scanner module.", [live(f.args[3])]), "<span class='notice'>You secure the scanner module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon12");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the phasic scanner module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the scanner module from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "loc", (I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/scanning_module"), rt.sv(f, "holder"))), rt.getStep(f, rt.sv(f, "holder"), 0));
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon10");
		}
	} else if ($0 === 12) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs super capacitor to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install capacitor to the ＀.</span>", [rt.sv(f, "holder")])]);
			I = live(f.args[2]);
			yield* g.callName(f, live(f.args[3]), "transferItemToLoc", [live(I), rt.sv(f, "holder"), 1]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon13");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the phasic scanner module.", [live(f.args[3])]), "<span class='notice'>You unfasten the scanner module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon11");
		}
	} else if ($0 === 11) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the super capacitor.", [live(f.args[3])]), "<span class='notice'>You secure the capacitor.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon14");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the super capacitor from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the capacitor from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "loc", (I = rt.locateIn(f, T("/obj/item/weapon/stock_parts/capacitor"), rt.sv(f, "holder"))), rt.getStep(f, rt.sv(f, "holder"), 0));
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon12");
		}
	} else if ($0 === 10) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the bluespace crystal.", [live(f.args[3])]), "<span class='notice'>You install the bluespace crystal.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon15");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unsecures the super capacitor from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You unsecure the capacitor from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon13");
		}
	} else if ($0 === 9) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the bluespace crystal.", [live(f.args[3])]), "<span class='notice'>You connect the bluespace crystal.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon16");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the bluespace crystal from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the bluespace crystal from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/ore/bluespace_crystal"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon14");
		}
	} else if ($0 === 8) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ engages the bluespace crystal.", [live(f.args[3])]), "<span class='notice'>You engage the bluespace crystal.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon17");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the bluespace crystal from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the bluespace crystal from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon15");
		}
	} else if ($0 === 7) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the phase armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the phase armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon18");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disengages the bluespace crystal.", [live(f.args[3])]), "<span class='notice'>You disengage the bluespace crystal.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon16");
		}
	} else if ($0 === 6) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the phase armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the phase armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon19");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries the phase armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry the phase armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon17");
		}
	} else if ($0 === 5) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the phase armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the phase armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon20");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the phase armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the phase armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon18");
		}
	} else if ($0 === 4) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs Phazon Armor Plates to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install Phazon Armor Plates to the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon21");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ cuts phase armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You cut the phase armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon19");
		}
	} else if ($0 === 3) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures Phazon Armor Plates.", [live(f.args[3])]), "<span class='notice'>You secure Phazon Armor Plates.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon22");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries Phazon Armor Plates from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry Phazon Armor Plates from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/mecha_parts/part/phazon_armor"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon20");
		}
	} else if ($0 === 2) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds Phazon Armor Plates to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld Phazon Armor Plates to the ＀.</span>", [rt.sv(f, "holder")])]);
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens Phazon Armor Plates.", [live(f.args[3])]), "<span class='notice'>You unfasten Phazon Armor Plates.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "phazon21");
		}
	} else if ($0 === 1) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ carefully inserts the anomaly core into ％！ and secures it.", [live(f.args[3]), rt.sv(f, "holder")]), "<span class='notice'>You slowly place the anomaly core into its socket and close its chamber.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
		}
	}
	return 1;
}, true, { args: ["index", "diff", "used_atom", "user"] });

// /datum/construction/reversible/mecha/phazon/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:1481)  may sleep
rt.def("/datum/construction/reversible/mecha/phazon/proc/spawn_result", function* spawn_result(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callName(f, (M = (yield* g.new_(f, rt.sv(f, "result"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), "CheckParts", [rt.fv(f, "contents", rt.sv(f, "holder"))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holder")]);
	return live(f.dot);
}, true);

rt.type(1044, "/datum/construction/mecha/odysseus_chassis", "/datum/construction/mecha", {
	steps: null,
});

// /datum/construction/mecha/odysseus_chassis/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:1490)
rt.def("/datum/construction/mecha/odysseus_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_torso")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_head")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_left_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_right_arm")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_left_leg")]), rt.alist(f, ["key", T("/obj/item/mecha_parts/part/odysseus_right_leg")])));
	return f.dot;
});

// /datum/construction/mecha/odysseus_chassis/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:1499)  may sleep
rt.def("/datum/construction/mecha/odysseus_chassis/proc/custom_action", function* custom_action(f: Frame, step: Value, used_atom: Value, user: Value) {
	f.vars = () => [step, used_atom, user];
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has connected ＀ to the ＀.", [live(user), live(used_atom), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect ＀ to the ＀.</span>", [live(used_atom), rt.sv(f, "holder")])]);
	yield* g.callName(f, rt.sv(f, "holder"), "add_overlay", [add(rt.fv(f, "icon_state", live(used_atom)), "+o")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(used_atom)]);
	return 1;
}, true);

// /datum/construction/mecha/odysseus_chassis/proc/action  (code/game/mecha/mecha_construction_paths.dm:1505)  may sleep
rt.def("/datum/construction/mecha/odysseus_chassis/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_all_steps", live(used_atom), live(user)));
}, true);

// /datum/construction/mecha/odysseus_chassis/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:1508)  may sleep
rt.def("/datum/construction/mecha/odysseus_chassis/proc/spawn_result", function* spawn_result(f: Frame) {
	let const_holder: Value = null;
	f.vars = () => [const_holder];
	rt.setFv(f, "construct", (const_holder = rt.sv(f, "holder")), (yield* g.new_(f, T("/datum/construction/reversible/mecha/odysseus"), [live(const_holder)])));
	rt.setFv(f, "icon", live(const_holder), rt.rsc("icons/mecha/mech_construction.dmi"));
	rt.setFv(f, "icon_state", live(const_holder), "odysseus0");
	rt.setFv(f, "density", live(const_holder), 1);
	yield* g.del(f, live(f.src));
	return live(f.dot);
}, true);

rt.type(1035, "/datum/construction/reversible/mecha/odysseus", "/datum/construction/reversible/mecha", {
	result: "/obj/mecha/medical/odysseus",
	steps: null,
});

// /datum/construction/reversible/mecha/odysseus/proc/<init>  (code/game/mecha/mecha_construction_paths.dm:1519)
rt.def("/datum/construction/reversible/mecha/odysseus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "steps", rt.list(rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "External armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "External armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/plasteel"), "backkey", T("/obj/item/weapon/weldingtool"), "desc", "Internal armor is welded."]), rt.alist(f, ["key", T("/obj/item/weapon/weldingtool"), "backkey", T("/obj/item/weapon/wrench"), "desc", "Internal armor is wrenched."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Internal armor is installed."]), rt.alist(f, ["key", T("/obj/item/stack/sheet/metal"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Peripherals control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Peripherals control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/odysseus/peripherals"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "Central control module is secured."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/crowbar"), "desc", "Central control module is installed."]), rt.alist(f, ["key", T("/obj/item/weapon/circuitboard/mecha/odysseus/main"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is adjusted."]), rt.alist(f, ["key", T("/obj/item/weapon/wirecutters"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The wiring is added."]), rt.alist(f, ["key", T("/obj/item/stack/cable_coil"), "backkey", T("/obj/item/weapon/screwdriver"), "desc", "The hydraulic systems are active."]), rt.alist(f, ["key", T("/obj/item/weapon/screwdriver"), "backkey", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are connected."]), rt.alist(f, ["key", T("/obj/item/weapon/wrench"), "desc", "The hydraulic systems are disconnected."])));
	return f.dot;
});

// /datum/construction/reversible/mecha/odysseus/proc/action  (code/game/mecha/mecha_construction_paths.dm:1578)  may sleep
rt.def("/datum/construction/reversible/mecha/odysseus/proc/action", function* action(f: Frame, used_atom: Value, user: Value) {
	f.vars = () => [used_atom, user];
	return (yield* g.srcCall(f, "check_step", live(used_atom), live(user)));
}, true);

// /datum/construction/reversible/mecha/odysseus/proc/custom_action  (code/game/mecha/mecha_construction_paths.dm:1581)  may sleep
rt.def("/datum/construction/reversible/mecha/odysseus/proc/custom_action", function* custom_action(f: Frame) {
	let coil: Value = null, MS: Value = null;
	let $0: any;
	f.vars = () => [coil, MS, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === 14) {
		yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ connects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You connect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
		rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus1");
	} else if ($0 === 13) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ activates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You activate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus2");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the ＀ hydraulic systems", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus0");
		}
	} else if ($0 === 12) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adds the wiring to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You add the wiring to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus3");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ deactivates the ＀ hydraulic systems.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You deactivate the ＀ hydraulic systems.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus1");
		}
	} else if ($0 === 11) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ adjusts the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You adjust the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus4");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the wiring from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the wiring from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (coil = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 4);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus2");
		}
	} else if ($0 === 10) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the central control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the central computer mainboard into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus5");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ disconnects the wiring of the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You disconnect the wiring of the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus3");
		}
	} else if ($0 === 9) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the mainboard.", [live(f.args[3])]), "<span class='notice'>You secure the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus6");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the central control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the central computer mainboard from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/odysseus/main"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus4");
		}
	} else if ($0 === 8) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the peripherals control module into the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the peripherals control module into the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[2])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus7");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the mainboard.", [live(f.args[3])]), "<span class='notice'>You unfasten the mainboard.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus5");
		}
	} else if ($0 === 7) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You secure the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus8");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ removes the peripherals control module from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You remove the peripherals control module from the ＀.</span>", [rt.sv(f, "holder")])]);
			yield* g.new_(f, T("/obj/item/weapon/circuitboard/mecha/odysseus/peripherals"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus6");
		}
	} else if ($0 === 6) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus9");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the peripherals control module.", [live(f.args[3])]), "<span class='notice'>You unfasten the peripherals control module.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus7");
		}
	} else if ($0 === 5) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus10");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus8");
		}
	} else if ($0 === 4) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the internal armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the internal armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus11");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the internal armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the internal armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus9");
		}
	} else if ($0 === 3) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ installs ＀ layer to the ＀.", [live(f.args[3]), live(f.args[2]), rt.sv(f, "holder")]), fmt("<span class='notice'>You install the external reinforced armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus12");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ cuts the internal armor layer from the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You cut the internal armor layer from the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus10");
		}
	} else if ($0 === 2) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ secures the external armor layer.", [live(f.args[3])]), "<span class='notice'>You secure the external reinforced armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus13");
		} else {
			rt.setFv(f, "amount", (MS = (yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.sv(f, "holder"), 0)]))), 5);
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ pries ＀ from the ＀.", [live(f.args[3]), live(MS), rt.sv(f, "holder")]), fmt("<span class='notice'>You pry ＀ from the ＀.</span>", [live(MS), rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus11");
		}
	} else if ($0 === 1) {
		if (isEqual(live(f.args[1]), -1)) {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ welds the external armor layer to the ＀.", [live(f.args[3]), rt.sv(f, "holder")]), fmt("<span class='notice'>You weld the external armor layer to the ＀.</span>", [rt.sv(f, "holder")])]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus14");
		} else {
			yield* g.callName(f, live(f.args[3]), "visible_message", [fmt("＀ unfastens the external armor layer.", [live(f.args[3])]), "<span class='notice'>You unfasten the external armor layer.</span>"]);
			rt.setFv(f, "icon_state", rt.sv(f, "holder"), "odysseus12");
		}
	}
	return 1;
}, true, { args: ["index", "diff", "used_atom", "user"] });

// /datum/construction/reversible/mecha/odysseus/proc/spawn_result  (code/game/mecha/mecha_construction_paths.dm:1694)  may sleep
rt.def("/datum/construction/reversible/mecha/odysseus/proc/spawn_result", function* spawn_result(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);
