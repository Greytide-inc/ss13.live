// From code/datums/mutable_appearance.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13799, "/mutable_appearance", "/image", {
	animate_movement: 1,
	screen_loc: null,
});

// /mutable_appearance/proc/New  (code/datums/mutable_appearance.dm:8)
rt.def("/mutable_appearance/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "plane", -32767);
	return f.dot;
});

// /proc/mutable_appearance  (code/datums/mutable_appearance.dm:14)
rt.def("/proc/mutable_appearance", function mutable_appearance(f: Frame, icon: Value, icon_state: Value, layer: Value) {
	let MA: Value = null;
	f.vars = () => [icon_state, layer, MA];
	if (live(icon_state) === null) {
		icon_state = "";
	}
	if (live(layer) === null) {
		layer = -1;
	}
	rt.setFv(f, "icon", (MA = rt.new_(f, T("/mutable_appearance"), [])), live(icon));
	rt.setFv(f, "icon_state", live(MA), live(icon_state));
	rt.setFv(f, "layer", live(MA), live(layer));
	return live(MA);
});
