// From code/game/machinery/computer/launchpad_control.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10382, "/obj/machinery/computer/launchpad", "/obj/machinery/computer", {
	sending: 1,
	current_pad: null,
	launchpads: null,
	maximum_pads: 4,
	icon_screen: "teleport",
	icon_keyboard: "teleport_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/launchpad_console"),
	name: "１Launchpad Control Console",
	desc: "Used to teleport objects to and from a launchpad.",
});

// /obj/machinery/computer/launchpad/proc/Initialize  (code/game/machinery/computer/launchpad_control.dm:13)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "launchpads", rt.list());
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/computer/launchpad/proc/attack_paw  (code/game/machinery/computer/launchpad_control.dm:17)
rt.def("/obj/machinery/computer/launchpad/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are too primitive to use this computer!</span>"]);
	return live(f.dot);
});

// /obj/machinery/computer/launchpad/proc/attackby  (code/game/machinery/computer/launchpad_control.dm:21)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "buffer", (M = live(f.args[0])))) && truthy((rt.istype(rt.fv(f, "buffer", live(M)), T("/obj/machinery/launchpad")) ? 1 : 0)))) {
			if (rt.lt(rt.length(rt.sv(f, "launchpads")), rt.sv(f, "maximum_pads"))) {
				(rt.modSrcVar(f, "launchpads", rt.fv(f, "buffer", live(M)), rt.bitOr));
				rt.setFv(f, "buffer", live(M), null);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You upload the data from the ＀'s buffer.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ cannot handle any more connections!</span>", [live(f.src)])]);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/computer/launchpad/proc/attack_ai  (code/game/machinery/computer/launchpad_control.dm:34)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/machinery/computer/launchpad/proc/attack_hand  (code/game/machinery/computer/launchpad_control.dm:37)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/launchpad/proc/pad_exists  (code/game/machinery/computer/launchpad_control.dm:42)
rt.def("/obj/machinery/computer/launchpad/proc/pad_exists", function pad_exists(f: Frame, number: Value) {
	let pad: Value = null;
	f.vars = () => [pad];
	if ((!truthy((pad = rt.index(rt.sv(f, "launchpads"), live(number)))) || truthy(rt.fv(f, "gc_destroyed", live(pad))))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/computer/launchpad/proc/get_pad  (code/game/machinery/computer/launchpad_control.dm:48)
rt.def("/obj/machinery/computer/launchpad/proc/get_pad", function get_pad(f: Frame, number: Value) {
	let pad: Value = null;
	f.vars = () => [pad];
	return (pad = rt.index(rt.sv(f, "launchpads"), live(number)));
});

// /obj/machinery/computer/launchpad/proc/interact  (code/game/machinery/computer/launchpad_control.dm:52)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/interact", function* interact(f: Frame, user: Value) {
	let t: Value = null, i: Value = null, pad: Value = null, pad_1: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, t, i, pad, pad_1, popup, $0, $1, $e];
	t = rt.list();
	if (!truthy(rt.length(rt.sv(f, "launchpads")))) {
		rt.setSv(f, "in_use", 0);
		t = rt.modify(live(t), "<div class='statusDisplay'>No launchpad located.</div><BR>", add);
	} else {
		i = null;
		rt.forRange(f, 0, 1, rt.length(rt.sv(f, "launchpads")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy((yield* g.srcCall(f, "pad_exists", live(i))))) {
				if (truthy(rt.bitAnd(rt.gv(f, "stat", (pad = (yield* g.srcCall(f, "get_pad", live(i))))), 2))) {
					t = rt.modify(live(t), fmt("<span class='linkOff'>＀</span>", [rt.fv(f, "display_name", live(pad))]), add);
				} else {
					t = rt.modify(live(t), fmt("<A href='?src=＃;choose_pad=1;pad=＀'>＀</A>", [live(f.src), live(i), rt.fv(f, "display_name", live(pad))]), add);
				}
			} else {
				(rt.modSrcVar(f, "launchpads", (yield* g.srcCall(f, "get_pad", live(i))), subtract));
			}
		}
		rt.endFor(f, 0);
		t = rt.modify(live(t), "<BR>", add);
		if (truthy(rt.sv(f, "current_pad"))) {
			t = rt.modify(live(t), fmt("<div class='statusDisplay'><b>＀</b></div>", [rt.gv(f, "display_name", (pad_1 = (yield* g.srcCall(f, "get_pad", rt.sv(f, "current_pad")))))]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;change_name=1;pad=＀'>Rename</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;remove=1;pad=＀'>Remove</A><BR><BR>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;raisey=1;lowerx=1;pad=＀'>O</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;raisey=1;pad=＀'>^</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;raisey=1;raisex=1;pad=＀'>O</A><BR>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;lowerx=1;pad=＀'><</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;reset=1;pad=＀'>R</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;raisex=1;pad=＀'>></A><BR>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;lowery=1;lowerx=1;pad=＀'>O</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;lowery=1;pad=＀'>v</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt("<A href='?src=＃;lowery=1;raisex=1;pad=＀'>O</A><BR>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), "<BR>", add);
			t = rt.modify(live(t), "<div class='statusDisplay'>Current offset:</div><BR>", add);
			$0 = rt.op(f, "Abs", [], [rt.fv(f, "y_offset", live(pad_1))]);
			if (rt.gt(rt.fv(f, "y_offset", live(pad_1)), 0)) {
				$1 = "N";
			} else {
				$1 = "S";
			}
			t = rt.modify(live(t), fmt("<div class='statusDisplay'>＀ ＀</div><BR>", [$0, $1]), add);
			$0 = rt.op(f, "Abs", [], [rt.fv(f, "x_offset", live(pad_1))]);
			if (rt.gt(rt.fv(f, "x_offset", live(pad_1)), 0)) {
				$1 = "E";
			} else {
				$1 = "W";
			}
			t = rt.modify(live(t), fmt("<div class='statusDisplay'>＀ ＀</div><BR>", [$0, $1]), add);
			t = rt.modify(live(t), fmt("<BR><A href='?src=＃;launch=1;pad=＀'>Launch</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
			t = rt.modify(live(t), fmt(" <A href='?src=＃;pull=1;pad=＀'>Pull</A>", [live(f.src), rt.sv(f, "current_pad")]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "launchpad", rt.sv(f, "name"), 300, 500]))), "set_content", [(yield* g.callName(f, live(t), "Join", []))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/launchpad/proc/teleport  (code/game/machinery/computer/launchpad_control.dm:95)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/teleport", function* teleport(f: Frame, user: Value, pad: Value) {
	f.vars = () => [user, pad];
	if ((!truthy(live(pad)) || truthy(rt.fv(f, "gc_destroyed", live(pad))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>ERROR: Launchpad not responding. Check launchpad integrity.</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(pad), "isAvailable", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>ERROR: Launchpad not operative. Make sure the launchpad is ready and powered.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(pad), "doteleport", [live(user), rt.sv(f, "sending")]);
	return f.dot;
}, true);

// /obj/machinery/computer/launchpad/proc/Topic  (code/game/machinery/computer/launchpad_control.dm:105)  may sleep
rt.def("/obj/machinery/computer/launchpad/proc/Topic", function* Topic(f: Frame) {
	let pad: Value = null, new_name: Value = null;
	f.vars = () => [pad, new_name];
	pad = null;
	if (truthy(rt.at(live(f.args[1]), "pad"))) {
		pad = (yield* g.srcCall(f, "get_pad", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "pad")]))));
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.length(rt.sv(f, "launchpads")))) {
		yield* g.srcCall(f, "updateDialog");
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "choose_pad"))) {
		rt.setSv(f, "current_pad", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "pad")])));
	}
	if (truthy(rt.at(live(f.args[1]), "raisex"))) {
		if (rt.lt(rt.fv(f, "x_offset", live(pad)), rt.fv(f, "range", live(pad)))) {
			rt.incField(f, live(pad), "x_offset", 1, true);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "lowerx"))) {
		if (rt.gt(rt.fv(f, "x_offset", live(pad)), multiply(rt.fv(f, "range", live(pad)), -1))) {
			rt.incField(f, live(pad), "x_offset", -1, true);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "raisey"))) {
		if (rt.lt(rt.fv(f, "y_offset", live(pad)), rt.fv(f, "range", live(pad)))) {
			rt.incField(f, live(pad), "y_offset", 1, true);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "lowery"))) {
		if (rt.gt(rt.fv(f, "y_offset", live(pad)), multiply(rt.fv(f, "range", live(pad)), -1))) {
			rt.incField(f, live(pad), "y_offset", -1, true);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "reset"))) {
		rt.setFv(f, "y_offset", live(pad), 0);
		rt.setFv(f, "x_offset", live(pad), 0);
	}
	if (truthy(rt.at(live(f.args[1]), "change_name"))) {
		if (!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "What do you wish to name the launchpad?", "Launchpad", rt.fv(f, "display_name", live(pad)), 15]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "display_name", live(pad), live(new_name));
	}
	if (truthy(rt.at(live(f.args[1]), "remove"))) {
		if ((truthy(live(f.usr)) && !isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Are you sure?", "Remove Launchpad", "I'm Sure", "Abort"])), "Abort"))) {
			(rt.modSrcVar(f, "launchpads", live(pad), subtract));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "launch"))) {
		rt.setSv(f, "sending", 1);
		yield* g.srcCall(f, "teleport", live(f.usr), live(pad));
	}
	if (truthy(rt.at(live(f.args[1]), "pull"))) {
		rt.setSv(f, "sending", 0);
		yield* g.srcCall(f, "teleport", live(f.usr), live(pad));
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });
