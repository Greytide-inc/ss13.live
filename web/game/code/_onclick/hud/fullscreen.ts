// Based on /tg/station's code/_onclick/hud/fullscreen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// fullscreen.dm:7
rt.def("/mob/proc/overlay_fullscreen", function* overlay_fullscreen(f: Frame, category: Value, type: Value, severity: Value) {
	let screen: Value = null;
	if (rt.index(this.screens, category)) {
		if ((screen = rt.index(this.screens, category)).type != type) {
			yield* this.clear_fullscreen(category, 0);
			return (yield* g.callSelf(f, []));
		}
		if (!severity || severity == screen.severity) {
			return null;
		}
	} else {
		screen = (yield* new_(type));
	}
	screen.icon_state = `${rt.initial(f, screen, "icon_state")}${severity}`;
	screen.severity = severity;
	rt.setAt(this.screens, category, screen);
	if (this.client && screen.should_show_to(this)) {
		screen.update_for_view(this.client.view);
		this.client.screen += screen;
	}
	return screen;
}, true);

// fullscreen.dm:27
rt.def("/mob/proc/clear_fullscreen", function* clear_fullscreen(f: Frame, category: Value, animated: Value) {
	let screen: Value = null;
	animated ??= 10;
	if (!(screen = rt.index(this.screens, category))) {
		return f.dot;
	}
	this.screens -= category;
	if (animated) {
		rt.op(f, "Animate", [2, 6], [null, screen, "alpha", 0, "time", animated]);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/proc/clear_fullscreen_after_animate"), screen)), animated, 4);
	} else {
		if (this.client) {
			this.client.screen -= screen;
		}
		yield* qdel(screen);
	}
	return f.dot;
}, true);

// fullscreen.dm:43
rt.def("/mob/proc/clear_fullscreen_after_animate", function* clear_fullscreen_after_animate(f: Frame, screen: Value) {
	if (this.client) {
		this.client.screen -= screen;
	}
	yield* qdel(screen);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/screen/fullscreen" }] });

// fullscreen.dm:47
rt.def("/mob/proc/clear_fullscreens", function* clear_fullscreens(f: Frame) {
	let category: Value = null;
	for (category of each(this.screens)) {
		yield* this.clear_fullscreen(category);
	}
	return f.dot;
}, true);

// fullscreen.dm:58
rt.def("/mob/proc/reload_fullscreen", function reload_fullscreen(f: Frame) {
	let screen: Value = null, category: Value = null;
	if (!this.client) return f.dot;
	for (category of each(this.screens)) {
		if ((screen = rt.index(this.screens, category)).should_show_to(this)) {
			screen.update_for_view(this.client.view);
			(rt.modField(f, this.client, "screen", screen, rt.bitOr));
		} else {
			this.client.screen -= screen;
		}
	}
	return f.dot;
});

rt.type(11097, "/obj/screen/fullscreen", "/obj/screen", {
	severity: 0,
	show_when_dead: 0,
	view: 7,
	icon: rt.rsc("icons/mob/screen_full.dmi"),
	icon_state: "default",
	screen_loc: "CENTER-7,CENTER-7",
	layer: 18.1,
	plane: 18,
	mouse_opacity: 0,
});

// fullscreen.dm:79
rt.def("/obj/screen/fullscreen/proc/update_for_view", function update_for_view(f: Frame, client_view: Value) {
	if (!(this.screen_loc == "CENTER-7,CENTER-7" && this.view != client_view)) return f.dot;
	let actualview: Value = getviewsize(client_view);
	this.view = client_view;
	this.transform = matrix(rt.index(actualview, 1) / FULLSCREEN_OVERLAY_RESOLUTION_X, 0, 0, 0, rt.index(actualview, 2) / FULLSCREEN_OVERLAY_RESOLUTION_Y, 0);
	return f.dot;
});

// fullscreen.dm:85
rt.def("/obj/screen/fullscreen/proc/should_show_to", function should_show_to(f: Frame, mymob: Value) {
	if (!this.show_when_dead && mymob.stat == 2) {
		return 0;
	}
	return 1;
});

// fullscreen.dm:91
rt.def("/obj/screen/fullscreen/proc/Destroy", function* Destroy(f: Frame) {
	this.severity = 0;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(11111, "/obj/screen/fullscreen/lighting_backdrop", "/obj/screen/fullscreen", {
	show_when_dead: 1,
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "flash",
	transform: null,
	plane: 15,
	blend_mode: 1,
});

// fullscreen.dm:154
rt.def("/obj/screen/fullscreen/lighting_backdrop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.transform = matrix(200, 0, 0, 0, 200, 0);
	return f.dot;
});
