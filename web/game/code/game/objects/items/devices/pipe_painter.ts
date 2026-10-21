// From code/game/objects/items/devices/pipe_painter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9276, "/obj/item/device/pipe_painter", "/obj/item/device", {
	modes: null,
	mode: "grey",
	flags: 4,
	name: "pipe painter",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "labeler1",
	item_state: "flight",
	materials: null,
});

// /obj/item/device/pipe_painter/proc/<init>  (code/game/objects/items/devices/pipe_painter.dm:8)
rt.def("/obj/item/device/pipe_painter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modes", rt.alist(f, ["grey", rt.op(f, "Rgb", [1, 3], [255, 255, 255]), "red", rt.op(f, "Rgb", [1, 3], [255, 0, 0]), "blue", rt.op(f, "Rgb", [1, 3], [0, 0, 255]), "cyan", rt.op(f, "Rgb", [1, 3], [0, 256, 249]), "green", rt.op(f, "Rgb", [1, 3], [30, 255, 0]), "yellow", rt.op(f, "Rgb", [1, 3], [255, 198, 0]), "purple", rt.op(f, "Rgb", [1, 3], [130, 43, 255])]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 2000]));
	return f.dot;
});

// /obj/item/device/pipe_painter/proc/afterattack  (code/game/objects/items/devices/pipe_painter.dm:23)  may sleep
rt.def("/obj/item/device/pipe_painter/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity_flag: Value) {
	let _P: Value = null;
	f.vars = () => [A, user, proximity_flag, _P];
	if (!truthy(live(proximity_flag))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(A), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, (_P = live(A)), "add_atom_colour", [rt.index(rt.sv(f, "modes"), rt.sv(f, "mode")), 4]);
	rt.setFv(f, "pipe_color", live(_P), rt.index(rt.sv(f, "modes"), rt.sv(f, "mode")));
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ paints ％！ ＀.</span>", [live(user), live(_P), rt.sv(f, "mode")]), fmt("<span class='notice'>You paint ％！ ＀.</span>", [live(_P), rt.sv(f, "mode")])]);
	yield* g.callName(f, live(_P), "update_node_icon", []);
	return f.dot;
}, true);

// /obj/item/device/pipe_painter/proc/attack_self  (code/game/objects/items/devices/pipe_painter.dm:36)  may sleep
rt.def("/obj/item/device/pipe_painter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "mode", (yield* g.op(f, "Prompt", [0], [null, null, "Pipe painter", "Which colour do you want to use?", rt.sv(f, "modes")])));
	return f.dot;
}, true);

// /obj/item/device/pipe_painter/proc/examine  (code/game/objects/items/devices/pipe_painter.dm:39)
rt.def("/obj/item/device/pipe_painter/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("It is set to ＀.", [rt.sv(f, "mode")])]);
	return f.dot;
});
