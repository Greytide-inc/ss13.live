// From code/game/machinery/buttons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10778, "/obj/machinery/button", "/obj/machinery", {
	skin: "doorctrl",
	device: null,
	board: null,
	device_type: null,
	id: null,
	initialized_button: 0,
	anchored: 1,
	name: "button",
	desc: "A remote control switch.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "doorctrl",
	power_channel: 3,
	armor: null,
	use_power: 1,
	idle_power_usage: 2,
	resistance_flags: 115,
});

// /obj/machinery/button/proc/<init>  (code/game/machinery/buttons.dm:13)
rt.def("/obj/machinery/button/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 90, "acid", 70]));
	return f.dot;
});

// /obj/machinery/button/proc/New  (code/game/machinery/buttons.dm:21)  may sleep
rt.def("/obj/machinery/button/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			$0 = 0;
		} else {
			if (isEqual(rt.sv(f, "dir"), 4)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			if (isEqual(rt.sv(f, "dir"), 1)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
		rt.setSv(f, "panel_open", 1);
		yield* g.srcCall(f, "update_icon");
	}
	if (((!truthy(live(f.args[2])) && !truthy(rt.sv(f, "device"))) && truthy(rt.sv(f, "device_type")))) {
		rt.setSv(f, "device", (yield* g.new_(f, rt.sv(f, "device_type"), [live(f.src)])));
	}
	yield* g.callName(f, live(f.src), "check_access", [null]);
	if (!(truthy(rt.len(f, rt.sv(f, "req_access"))) || truthy(rt.len(f, rt.sv(f, "req_one_access"))))) return f.dot;
	rt.setSv(f, "board", (yield* g.new_(f, T("/obj/item/weapon/electronics/airlock"), [live(f.src)])));
	if (truthy(rt.len(f, rt.sv(f, "req_access")))) {
		rt.setFv(f, "accesses", rt.sv(f, "board"), rt.sv(f, "req_access"));
	} else {
		rt.setFv(f, "one_access", rt.sv(f, "board"), 1);
		rt.setFv(f, "accesses", rt.sv(f, "board"), rt.sv(f, "req_one_access"));
	}
	return f.dot;
}, true, { args: ["loc", "ndir", "built"] });

// /obj/machinery/button/proc/update_icon  (code/game/machinery/buttons.dm:45)
rt.def("/obj/machinery/button/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", "button-open");
		if (truthy(rt.sv(f, "device"))) {
			rt.callSrc(f, "add_overlay", ["button-device"]);
		}
		if (truthy(rt.sv(f, "board"))) {
			rt.callSrc(f, "add_overlay", ["button-board"]);
		}
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			rt.setSv(f, "icon_state", fmt("＀-p", [rt.sv(f, "skin")]));
		} else {
			rt.setSv(f, "icon_state", rt.sv(f, "skin"));
		}
	}
	return f.dot;
});

// /obj/machinery/button/proc/attackby  (code/game/machinery/buttons.dm:60)  may sleep
rt.def("/obj/machinery/button/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "panel_open")) || truthy((yield* g.srcCall(f, "allowed", live(f.args[1])))))) {
			yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "button-open", fmt("＀", [rt.sv(f, "skin")]), live(f.args[0]));
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Maintenance Access Denied</span>"]);
			yield* g.call(f, P("/proc/flick"), null, [fmt("＀-denied", [rt.sv(f, "skin")]), live(f.src)]);
		}
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		if ((!truthy(rt.sv(f, "device")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to you!</span>", [live(f.args[0])])]);
				return live(f.dot);
			}
			rt.setSv(f, "device", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the button.</span>", [live(f.args[0])])]);
		}
		if ((!truthy(rt.sv(f, "board")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/airlock")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to you!</span>", [live(f.args[0])])]);
				return live(f.dot);
			}
			rt.setSv(f, "board", live(f.args[0]));
			if (truthy(rt.fv(f, "one_access", rt.sv(f, "board")))) {
				rt.setSv(f, "req_one_access", rt.fv(f, "accesses", rt.sv(f, "board")));
			} else {
				rt.setSv(f, "req_access", rt.fv(f, "accesses", rt.sv(f, "board")));
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the button.</span>", [live(f.args[0])])]);
		}
		if (((!truthy(rt.sv(f, "device")) && !truthy(rt.sv(f, "board"))) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start unsecuring the button frame...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the button frame.</span>"]);
				yield* g.srcCall(f, "transfer_fingerprints_to", (yield* g.new_(f, T("/obj/item/wallframe/button"), [rt.getStep(f, live(f.src), 0)])));
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && !truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 4)))) {
		return (yield* g.callName(f, live(f.src), "attack_hand", [live(f.args[1])]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/button/proc/emag_act  (code/game/machinery/buttons.dm:106)
rt.def("/obj/machinery/button/proc/emag_act", function emag_act(f: Frame, user: Value) {
	rt.setSv(f, "req_access", rt.list());
	rt.setSv(f, "req_one_access", rt.list());
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 100, 1]);
	return f.dot;
});

// /obj/machinery/button/proc/attack_ai  (code/game/machinery/buttons.dm:111)  may sleep
rt.def("/obj/machinery/button/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "panel_open"))) return f.dot;
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/button/proc/setup_device  (code/game/machinery/buttons.dm:115)
rt.def("/obj/machinery/button/proc/setup_device", function setup_device(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if ((truthy(rt.sv(f, "id")) && truthy((rt.istype(rt.sv(f, "device"), T("/obj/item/device/assembly/control")) ? 1 : 0)))) {
		rt.setFv(f, "id", (A = rt.sv(f, "device")), rt.sv(f, "id"));
	}
	rt.setSv(f, "initialized_button", 1);
	return f.dot;
});

// /obj/machinery/button/proc/attack_hand  (code/game/machinery/buttons.dm:121)  may sleep
rt.def("/obj/machinery/button/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "initialized_button"))) {
		yield* g.srcCall(f, "setup_device");
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (truthy(rt.sv(f, "panel_open"))) {
		if ((truthy(rt.sv(f, "device")) || truthy(rt.sv(f, "board")))) {
			if (truthy(rt.sv(f, "device"))) {
				rt.setFv(f, "loc", rt.sv(f, "device"), rt.getStep(f, live(f.src), 0));
				rt.setSv(f, "device", null);
			}
			if (truthy(rt.sv(f, "board"))) {
				rt.setFv(f, "loc", rt.sv(f, "board"), rt.getStep(f, live(f.src), 0));
				rt.setSv(f, "req_access", rt.list());
				rt.setSv(f, "req_one_access", rt.list());
				rt.setSv(f, "board", null);
			}
			yield* g.srcCall(f, "update_icon");
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove electronics from the button frame.</span>"]);
		} else {
			if (isEqual(rt.sv(f, "skin"), "doorctrl")) {
				rt.setSv(f, "skin", "launcher");
			} else {
				rt.setSv(f, "skin", "doorctrl");
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You change the button frame's front panel.</span>"]);
		}
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "device")) && rt.gt(rt.fv(f, "next_activate", rt.sv(f, "device")), rt.worldTime(f)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "allowed", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Access Denied</span>"]);
		yield* g.call(f, P("/proc/flick"), null, [fmt("＀-denied", [rt.sv(f, "skin")]), live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 5);
	rt.setSv(f, "icon_state", fmt("＀1", [rt.sv(f, "skin")]));
	if (truthy(rt.sv(f, "device"))) {
		yield* g.callName(f, rt.sv(f, "device"), "pulsed", []);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/button/proc/update_icon")])), 15]);
	return f.dot;
}, true);

// /obj/machinery/button/proc/power_change  (code/game/machinery/buttons.dm:165)
rt.def("/obj/machinery/button/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

rt.type(10779, "/obj/machinery/button/door", "/obj/machinery/button", {
	normaldoorcontrol: 0,
	specialfunctions: 1,
	name: "door button",
	desc: "A door remote control switch.",
});

// /obj/machinery/button/door/proc/setup_device  (code/game/machinery/buttons.dm:176)  may sleep
rt.def("/obj/machinery/button/door/proc/setup_device", function* setup_device(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "device"))) {
		if (truthy(rt.sv(f, "normaldoorcontrol"))) {
			rt.setSv(f, "device", (A = (yield* g.new_(f, T("/obj/item/device/assembly/control/airlock"), [live(f.src)]))));
			rt.setFv(f, "specialfunctions", live(A), rt.sv(f, "specialfunctions"));
		} else {
			rt.setSv(f, "device", (yield* g.new_(f, T("/obj/item/device/assembly/control"), [live(f.src)])));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(10783, "/obj/machinery/button/crematorium", "/obj/machinery/button", {
	skin: "launcher",
	device_type: rt.typePath("/obj/item/device/assembly/control/crematorium"),
	id: 1,
	name: "crematorium igniter",
	desc: "Burn baby burn!",
	icon_state: "launcher",
	req_access: null,
});

// /obj/machinery/button/crematorium/proc/<init>  (code/game/machinery/buttons.dm:212)
rt.def("/obj/machinery/button/crematorium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list());
	return f.dot;
});

rt.type(9540, "/obj/item/wallframe/button", "/obj/item/wallframe", {
	name: "button frame",
	desc: "Used for building buttons.",
	icon_state: "button",
	result_path: rt.typePath("/obj/machinery/button"),
	materials: null,
});

// /obj/item/wallframe/button/proc/<init>  (code/game/machinery/buttons.dm:220)
rt.def("/obj/item/wallframe/button/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});
