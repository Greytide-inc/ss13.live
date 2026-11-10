// Based on /tg/station's code/_onclick/hud/plane_master.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11141, "/obj/screen/plane_master", "/obj/screen", {
	show_alpha: 255,
	hide_alpha: 0,
	screen_loc: "CENTER",
	icon_state: "blank",
	appearance_flags: 144,
	blend_mode: 1,
});

// Empty in tg.
rt.def("/obj/screen/plane_master/proc/backdrop", undefined, false, { args: ["mymob"] });

// plane_master.dm:10
rt.def("/obj/screen/plane_master/proc/Show", function Show(f: Frame, override: Value) {
	this.alpha = (override || this.show_alpha);
	return f.dot;
});

// plane_master.dm:13
rt.def("/obj/screen/plane_master/proc/Hide", function Hide(f: Frame, override: Value) {
	this.alpha = (override || this.hide_alpha);
	return f.dot;
});

rt.type(11143, "/obj/screen/plane_master/lighting", "/obj/screen/plane_master", {
	name: "lighting plane master",
	plane: 15,
	blend_mode: 4,
	mouse_opacity: 0,
});

// plane_master.dm:42
rt.def("/obj/screen/plane_master/lighting/proc/backdrop", function* backdrop(f: Frame, mymob: Value) {
	yield* mymob.overlay_fullscreen("lighting_backdrop_lit", T("/obj/screen/fullscreen/lighting_backdrop/lit"));
	yield* mymob.overlay_fullscreen("lighting_backdrop_unlit", T("/obj/screen/fullscreen/lighting_backdrop/unlit"));
	return f.dot;
}, true);
