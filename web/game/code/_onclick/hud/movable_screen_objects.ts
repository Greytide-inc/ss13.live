// From code/_onclick/hud/movable_screen_objects.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11001, "/obj/screen/movable", "/obj/screen", {
	snap2grid: 0,
	moved: 0,
});

// /obj/screen/movable/proc/MouseDrop  (code/_onclick/hud/movable_screen_objects.dm:23)
rt.def("/obj/screen/movable/proc/MouseDrop", function MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	let PM: Value = null, screen_loc_params: Value = null, screen_loc_X: Value = null, screen_loc_Y: Value = null, pix_X: Value = null, pix_Y: Value = null;
	f.vars = () => [PM, screen_loc_params, screen_loc_X, screen_loc_Y, pix_X, pix_Y];
	if ((!truthy((PM = rt.call(f, P("/proc/params2list"), null, [live(params)]))) || !truthy(rt.at(live(PM), "screen-loc")))) {
		return live(f.dot);
	}
	screen_loc_params = rt.call(f, P("/proc/splittext"), null, [rt.at(live(PM), "screen-loc"), ","]);
	screen_loc_X = rt.call(f, P("/proc/splittext"), null, [rt.index(live(screen_loc_params), 1), ":"]);
	screen_loc_Y = rt.call(f, P("/proc/splittext"), null, [rt.index(live(screen_loc_params), 2), ":"]);
	if (truthy(rt.sv(f, "snap2grid"))) {
		rt.setSv(f, "screen_loc", fmt("＀,＀", [rt.index(live(screen_loc_X), 1), rt.index(live(screen_loc_Y), 1)]));
	} else {
		pix_X = subtract(rt.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_X), 2)]), 16);
		pix_Y = subtract(rt.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_Y), 2)]), 16);
		rt.setSv(f, "screen_loc", fmt("＀:＀,＀:＀", [rt.index(live(screen_loc_X), 1), live(pix_X), rt.index(live(screen_loc_Y), 1), live(pix_Y)]));
	}
	rt.setSv(f, "moved", rt.sv(f, "screen_loc"));
	return f.dot;
});

// /client/proc/test_movable_UI  (code/_onclick/hud/movable_screen_objects.dm:54)  may sleep
rt.def("/client/proc/test_movable_UI", function* test_movable_UI(f: Frame) {
	let M: Value = null, screen_l: Value = null;
	f.vars = () => [M, screen_l];
	rt.setFv(f, "name", (M = (yield* g.new_(f, T("/obj/screen/movable"), []))), "Movable UI Object");
	rt.setFv(f, "icon_state", live(M), "block");
	rt.setFv(f, "maptext", live(M), "Movable");
	rt.setFv(f, "maptext_width", live(M), 64);
	if (!truthy((screen_l = (yield* g.op(f, "Prompt", [2], [null, "Spawn Movable UI Object", "Where on the screen? (Formatted as 'X,Y' e.g: '1,1' for bottom left)", live(f.usr), null]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "screen_loc", live(M), live(screen_l));
	rt.modSrcVar(f, "screen", live(M), add);
	return f.dot;
}, true, { verb: { name: "Spawn Movable UI Object", category: "Debug" } });

// /client/proc/test_snap_UI  (code/_onclick/hud/movable_screen_objects.dm:73)  may sleep
rt.def("/client/proc/test_snap_UI", function* test_snap_UI(f: Frame) {
	let S: Value = null, screen_l: Value = null;
	f.vars = () => [S, screen_l];
	rt.setFv(f, "name", (S = (yield* g.new_(f, T("/obj/screen/movable/snap"), []))), "Snap UI Object");
	rt.setFv(f, "icon_state", live(S), "block");
	rt.setFv(f, "maptext", live(S), "Snap");
	rt.setFv(f, "maptext_width", live(S), 64);
	if (!truthy((screen_l = (yield* g.op(f, "Prompt", [2], [null, "Spawn Snap UI Object", "Where on the screen? (Formatted as 'X,Y' e.g: '1,1' for bottom left)", live(f.usr), null]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "screen_loc", live(S), live(screen_l));
	rt.modSrcVar(f, "screen", live(S), add);
	return f.dot;
}, true, { verb: { name: "Spawn Snap UI Object", category: "Debug" } });
