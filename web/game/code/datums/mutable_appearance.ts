// Based on /tg/station's code/datums/mutable_appearance.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13799, "/mutable_appearance", "/image", {
	animate_movement: 1,
	screen_loc: null,
});

// mutable_appearance.dm:8
rt.def("/mutable_appearance/proc/New", function New(f: Frame) {
	parent_proc();
	this.plane = -32767;
	return f.dot;
});

// mutable_appearance.dm:14
rt.def("/proc/mutable_appearance", function mutable_appearance(f: Frame, icon: Value, icon_state: Value, layer: Value) {
	let MA: Value = null;
	icon_state ??= "";
	layer ??= -1;
	(MA = new_(T("/mutable_appearance"))).icon = icon;
	MA.icon_state = icon_state;
	MA.layer = layer;
	return MA;
});
