// From code/_onclick/hud/fullscreen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/overlay_fullscreen  (code/_onclick/hud/fullscreen.dm:7)  may sleep
rt.def("/mob/proc/overlay_fullscreen", function* overlay_fullscreen(f: Frame, category: Value, type: Value, severity: Value) {
	let screen: Value = null;
	f.vars = () => [category, type, severity, screen];
	screen = null;
	if (truthy(rt.index(rt.sv(f, "screens"), live(category)))) {
		if (!isEqual(rt.gv(f, "type", (screen = rt.index(rt.sv(f, "screens"), live(category)))), live(type))) {
			yield* g.srcCall(f, "clear_fullscreen", live(category), 0);
			return (yield* g.callSelf(f, []));
		}
		if ((!truthy(live(severity)) || isEqual(live(severity), rt.fv(f, "severity", live(screen))))) {
			return null;
		}
	} else {
		screen = (yield* g.new_(f, live(type), []));
	}
	rt.setFv(f, "icon_state", live(screen), fmt("＀＀", [rt.initial(f, live(screen), "icon_state"), live(severity)]));
	rt.setFv(f, "severity", live(screen), live(severity));
	rt.setAt(rt.sv(f, "screens"), live(category), live(screen));
	if ((truthy(rt.sv(f, "client")) && truthy((yield* g.callName(f, live(screen), "should_show_to", [live(f.src)]))))) {
		yield* g.callName(f, live(screen), "update_for_view", [rt.fv(f, "view", rt.sv(f, "client"))]);
		rt.modField(f, rt.sv(f, "client"), "screen", live(screen), add);
	}
	return live(screen);
}, true);

// /mob/proc/clear_fullscreen  (code/_onclick/hud/fullscreen.dm:27)  may sleep
rt.def("/mob/proc/clear_fullscreen", function* clear_fullscreen(f: Frame, category: Value, animated: Value) {
	let screen: Value = null;
	f.vars = () => [category, animated, screen];
	if (live(animated) === null) {
		animated = 10;
	}
	if (!truthy((screen = rt.index(rt.sv(f, "screens"), live(category))))) {
		return live(f.dot);
	}
	(rt.modSrcVar(f, "screens", live(category), subtract));
	if (truthy(live(animated))) {
		rt.op(f, "Animate", [2, 6], [null, live(screen), "alpha", 0, "time", live(animated)]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/proc/clear_fullscreen_after_animate"), live(screen)])), live(animated), 4]);
	} else {
		if (truthy(rt.sv(f, "client"))) {
			(rt.modField(f, rt.sv(f, "client"), "screen", live(screen), subtract));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(screen)]);
	}
	return f.dot;
}, true);

// /mob/proc/clear_fullscreen_after_animate  (code/_onclick/hud/fullscreen.dm:43)  may sleep
rt.def("/mob/proc/clear_fullscreen_after_animate", function* clear_fullscreen_after_animate(f: Frame, screen: Value) {
	f.vars = () => [screen];
	if (truthy(rt.sv(f, "client"))) {
		(rt.modField(f, rt.sv(f, "client"), "screen", live(screen), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(screen)]);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/screen/fullscreen" }] });

// /mob/proc/clear_fullscreens  (code/_onclick/hud/fullscreen.dm:47)  may sleep
rt.def("/mob/proc/clear_fullscreens", function* clear_fullscreens(f: Frame) {
	let category: Value = null;
	let $e: any;
	f.vars = () => [category, $e];
	category = null;
	rt.forList(f, 0, rt.sv(f, "screens"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		yield* g.srcCall(f, "clear_fullscreen", live(category));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/hide_fullscreens  (code/_onclick/hud/fullscreen.dm:52)
rt.def("/mob/proc/hide_fullscreens", function hide_fullscreens(f: Frame) {
	let category: Value = null;
	let $e: any;
	f.vars = () => [category, $e];
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	category = null;
	rt.forList(f, 0, rt.sv(f, "screens"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		(rt.modField(f, rt.sv(f, "client"), "screen", rt.index(rt.sv(f, "screens"), live(category)), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/reload_fullscreen  (code/_onclick/hud/fullscreen.dm:58)
rt.def("/mob/proc/reload_fullscreen", function reload_fullscreen(f: Frame) {
	let screen: Value = null, category: Value = null;
	let $e: any;
	f.vars = () => [screen, category, $e];
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	screen = null;
	category = null;
	rt.forList(f, 0, rt.sv(f, "screens"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		if (truthy(rt.callName(f, (screen = rt.index(rt.sv(f, "screens"), live(category))), "should_show_to", [live(f.src)]))) {
			rt.callName(f, live(screen), "update_for_view", [rt.fv(f, "view", rt.sv(f, "client"))]);
			(rt.modField(f, rt.sv(f, "client"), "screen", live(screen), rt.bitOr));
		} else {
			(rt.modField(f, rt.sv(f, "client"), "screen", live(screen), subtract));
		}
	}
	rt.endFor(f, 0);
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

// /obj/screen/fullscreen/proc/update_for_view  (code/_onclick/hud/fullscreen.dm:79)
rt.def("/obj/screen/fullscreen/proc/update_for_view", function update_for_view(f: Frame, client_view: Value) {
	let actualview: Value = null;
	f.vars = () => [actualview];
	if (!(isEqual(rt.sv(f, "screen_loc"), "CENTER-7,CENTER-7") && !isEqual(rt.sv(f, "view"), live(client_view)))) return f.dot;
	actualview = rt.call(f, P("/proc/getviewsize"), null, [live(client_view)]);
	rt.setSv(f, "view", live(client_view));
	rt.setSv(f, "transform", rt.call(f, P("/proc/matrix"), null, [divide(rt.index(live(actualview), 1), 15), 0, 0, 0, divide(rt.index(live(actualview), 2), 15), 0]));
	return f.dot;
});

// /obj/screen/fullscreen/proc/should_show_to  (code/_onclick/hud/fullscreen.dm:85)
rt.def("/obj/screen/fullscreen/proc/should_show_to", function should_show_to(f: Frame, mymob: Value) {
	if ((!truthy(rt.sv(f, "show_when_dead")) && isEqual(rt.fv(f, "stat", live(mymob)), 2))) {
		return 0;
	}
	return 1;
});

// /obj/screen/fullscreen/proc/Destroy  (code/_onclick/hud/fullscreen.dm:91)  may sleep
rt.def("/obj/screen/fullscreen/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "severity", 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/screen/fullscreen/lighting_backdrop/proc/<init>  (code/_onclick/hud/fullscreen.dm:154)
rt.def("/obj/screen/fullscreen/lighting_backdrop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "transform", rt.call(f, P("/proc/matrix"), null, [200, 0, 0, 0, 200, 0]));
	return f.dot;
});
