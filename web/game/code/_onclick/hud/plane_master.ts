// From code/_onclick/hud/plane_master.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11141, "/obj/screen/plane_master", "/obj/screen", {
	show_alpha: 255,
	hide_alpha: 0,
	screen_loc: "CENTER",
	icon_state: "blank",
	appearance_flags: 144,
	blend_mode: 1,
});

// /obj/screen/plane_master/proc/backdrop  empty
rt.def("/obj/screen/plane_master/proc/backdrop", undefined, false, { args: ["mymob"] });

// /obj/screen/plane_master/proc/Show  (code/_onclick/hud/plane_master.dm:10)
rt.def("/obj/screen/plane_master/proc/Show", function Show(f: Frame, override: Value) {
	rt.setSv(f, "alpha", (live(override) || rt.sv(f, "show_alpha")));
	return f.dot;
});

// /obj/screen/plane_master/proc/Hide  (code/_onclick/hud/plane_master.dm:13)
rt.def("/obj/screen/plane_master/proc/Hide", function Hide(f: Frame, override: Value) {
	rt.setSv(f, "alpha", (live(override) || rt.sv(f, "hide_alpha")));
	return f.dot;
});

rt.type(11143, "/obj/screen/plane_master/lighting", "/obj/screen/plane_master", {
	name: "lighting plane master",
	plane: 15,
	blend_mode: 4,
	mouse_opacity: 0,
});

// /obj/screen/plane_master/lighting/proc/backdrop  (code/_onclick/hud/plane_master.dm:42)  may sleep
rt.def("/obj/screen/plane_master/lighting/proc/backdrop", function* backdrop(f: Frame, mymob: Value) {
	f.vars = () => [mymob];
	yield* g.callName(f, live(mymob), "overlay_fullscreen", ["lighting_backdrop_lit", T("/obj/screen/fullscreen/lighting_backdrop/lit")]);
	yield* g.callName(f, live(mymob), "overlay_fullscreen", ["lighting_backdrop_unlit", T("/obj/screen/fullscreen/lighting_backdrop/unlit")]);
	return f.dot;
}, true);
