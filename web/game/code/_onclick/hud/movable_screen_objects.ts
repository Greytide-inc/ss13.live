// Based on /tg/station's code/_onclick/hud/movable_screen_objects.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(11001, "/obj/screen/movable", "/obj/screen", {
	snap2grid: 0,
	moved: 0,
});

// movable_screen_objects.dm:23
rt.def("/obj/screen/movable/proc/MouseDrop", function MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	let PM: Value = null, pix_X: Value = null, pix_Y: Value = null;
	if (!(PM = params2list(params)) || !rt.at(PM, "screen-loc")) {
		return f.dot;
	}
	let screen_loc_params: Value = splittext(rt.at(PM, "screen-loc"), ",");
	let screen_loc_X: Value = splittext(rt.index(screen_loc_params, 1), ":");
	let screen_loc_Y: Value = splittext(rt.index(screen_loc_params, 2), ":");
	if (this.snap2grid) {
		this.screen_loc = `${rt.index(screen_loc_X, 1)},${rt.index(screen_loc_Y, 1)}`;
	} else {
		pix_X = text2num(rt.index(screen_loc_X, 2)) - 16;
		pix_Y = text2num(rt.index(screen_loc_Y, 2)) - 16;
		this.screen_loc = `${rt.index(screen_loc_X, 1)}:${pix_X},${rt.index(screen_loc_Y, 1)}:${pix_Y}`;
	}
	this.moved = this.screen_loc;
	return f.dot;
});

// movable_screen_objects.dm:54
rt.def("/client/proc/test_movable_UI", function* test_movable_UI(f: Frame) {
	let M: Value = null, screen_l: Value = null;
	(M = (yield* new_(T("/obj/screen/movable")))).name = "Movable UI Object";
	M.icon_state = "block";
	M.maptext = "Movable";
	M.maptext_width = 64;
	if (!(screen_l = (yield* g.op(f, "Prompt", [2], [null, "Spawn Movable UI Object", "Where on the screen? (Formatted as 'X,Y' e.g: '1,1' for bottom left)", f.usr, null])))) {
		return f.dot;
	}
	M.screen_loc = screen_l;
	this.screen += M;
	return f.dot;
}, true, { verb: { name: "Spawn Movable UI Object", category: "Debug" } });

// movable_screen_objects.dm:73
rt.def("/client/proc/test_snap_UI", function* test_snap_UI(f: Frame) {
	let S: Value = null, screen_l: Value = null;
	(S = (yield* new_(T("/obj/screen/movable/snap")))).name = "Snap UI Object";
	S.icon_state = "block";
	S.maptext = "Snap";
	S.maptext_width = 64;
	if (!(screen_l = (yield* g.op(f, "Prompt", [2], [null, "Spawn Snap UI Object", "Where on the screen? (Formatted as 'X,Y' e.g: '1,1' for bottom left)", f.usr, null])))) {
		return f.dot;
	}
	S.screen_loc = screen_l;
	this.screen += S;
	return f.dot;
}, true, { verb: { name: "Spawn Snap UI Object", category: "Debug" } });
