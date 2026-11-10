// Based on /tg/station's code/game/objects/items/devices/pipe_painter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// pipe_painter.dm:8
rt.def("/obj/item/device/pipe_painter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modes = rt.alist(f, ["grey", rt.op(f, "Rgb", [1, 3], [255, 255, 255]), "red", rt.op(f, "Rgb", [1, 3], [255, 0, 0]), "blue", rt.op(f, "Rgb", [1, 3], [0, 0, 255]), "cyan", rt.op(f, "Rgb", [1, 3], [0, 256, 249]), "green", rt.op(f, "Rgb", [1, 3], [30, 255, 0]), "yellow", rt.op(f, "Rgb", [1, 3], [255, 198, 0]), "purple", rt.op(f, "Rgb", [1, 3], [130, 43, 255])]);
	this.materials = rt.alist(f, ["$metal", 5000, "$glass", 2000]);
	return f.dot;
});

// pipe_painter.dm:23
rt.def("/obj/item/device/pipe_painter/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity_flag: Value) {
	let _P: Value = null;
	if (!proximity_flag) {
		return f.dot;
	}
	if (!rt.istype(A, T("/obj/machinery/atmospherics/pipe"))) {
		return f.dot;
	}
	(_P = A).add_atom_colour(rt.index(this.modes, this.mode), FIXED_COLOUR_PRIORITY);
	_P.pipe_color = rt.index(this.modes, this.mode);
	user.visible_message(fmt("<span class='notice'>＀ paints ％！ ＀.</span>", [user, _P, this.mode]), fmt("<span class='notice'>You paint ％！ ＀.</span>", [_P, this.mode]));
	yield* _P.update_node_icon();
	return f.dot;
}, true);

// pipe_painter.dm:36
rt.def("/obj/item/device/pipe_painter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.mode = (yield* g.op(f, "Prompt", [0], [null, null, "Pipe painter", "Which colour do you want to use?", this.modes]));
	return f.dot;
}, true);

// pipe_painter.dm:39
rt.def("/obj/item/device/pipe_painter/proc/examine", function examine(f: Frame) {
	parent_proc();
	to_chat(f.usr, `It is set to ${this.mode}.`);
	return f.dot;
});
