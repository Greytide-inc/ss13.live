// From code/_onclick/hud/robot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11146, "/obj/screen/robot", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
});

// /obj/screen/robot/proc/Click  (code/_onclick/hud/robot.dm:9)
rt.def("/obj/screen/robot/proc/Click", function Click(f: Frame) {
	if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	return 1;
});

rt.type(11147, "/obj/screen/robot/module", "/obj/screen/robot", {
	name: "cyborg module",
	icon_state: "nomod",
});

// /obj/screen/robot/module/proc/Click  (code/_onclick/hud/robot.dm:13)  may sleep
rt.def("/obj/screen/robot/module/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "type", rt.gv(f, "module", (R = live(f.usr)))), T("/obj/item/weapon/robot_module"))) {
		yield* g.callName(f, rt.fv(f, "hud_used", live(R)), "toggle_show_robot_modules", []);
		return 1;
	}
	yield* g.callName(f, live(R), "pick_module", []);
	return f.dot;
}, true);

rt.type(11148, "/obj/screen/robot/module1", "/obj/screen/robot", {
	name: "module1",
	icon_state: "inv1",
});

// /obj/screen/robot/module1/proc/Click  (code/_onclick/hud/robot.dm:26)
rt.def("/obj/screen/robot/module1/proc/Click", function Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (R = live(f.usr)), "toggle_module", [1]);
	return f.dot;
});

rt.type(11149, "/obj/screen/robot/module2", "/obj/screen/robot", {
	name: "module2",
	icon_state: "inv2",
});

// /obj/screen/robot/module2/proc/Click  (code/_onclick/hud/robot.dm:36)
rt.def("/obj/screen/robot/module2/proc/Click", function Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (R = live(f.usr)), "toggle_module", [2]);
	return f.dot;
});

rt.type(11150, "/obj/screen/robot/module3", "/obj/screen/robot", {
	name: "module3",
	icon_state: "inv3",
});

// /obj/screen/robot/module3/proc/Click  (code/_onclick/hud/robot.dm:46)
rt.def("/obj/screen/robot/module3/proc/Click", function Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (R = live(f.usr)), "toggle_module", [3]);
	return f.dot;
});

rt.type(11151, "/obj/screen/robot/radio", "/obj/screen/robot", {
	name: "radio",
	icon_state: "radio",
});

// /obj/screen/robot/radio/proc/Click  (code/_onclick/hud/robot.dm:56)  may sleep
rt.def("/obj/screen/robot/radio/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gv(f, "radio", (R = live(f.usr))), "interact", [live(R)]);
	return f.dot;
}, true);

rt.type(11152, "/obj/screen/robot/store", "/obj/screen/robot", {
	name: "store",
	icon_state: "store",
});

// /obj/screen/robot/store/proc/Click  (code/_onclick/hud/robot.dm:66)  may sleep
rt.def("/obj/screen/robot/store/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (R = live(f.usr)), "uneq_active", []);
	return f.dot;
}, true);

rt.type(11153, "/obj/screen/robot/lamp", "/obj/screen/robot", {
	name: "headlamp",
	icon_state: "lamp0",
});

// /obj/screen/robot/lamp/proc/Click  (code/_onclick/hud/robot.dm:76)  may sleep
rt.def("/obj/screen/robot/lamp/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (R = live(f.usr)), "control_headlamp", []);
	return f.dot;
}, true);

rt.type(11154, "/obj/screen/robot/thrusters", "/obj/screen/robot", {
	name: "ion thrusters",
	icon_state: "ionpulse0",
});

// /obj/screen/robot/thrusters/proc/Click  (code/_onclick/hud/robot.dm:86)  may sleep
rt.def("/obj/screen/robot/thrusters/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (R = live(f.usr)), "toggle_ionpulse", []);
	return f.dot;
}, true);

rt.type(75, "/datum/hud/robot", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
});

// /datum/hud/robot/proc/New  (code/_onclick/hud/robot.dm:95)  may sleep
rt.def("/datum/hud/robot/proc/New", function* New(f: Frame) {
	let mymobR: Value = null, using: Value = null;
	f.vars = () => [mymobR, using];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_cyborg.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	mymobR = rt.sv(f, "mymob");
	using = null;
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), "CENTER+4:21,SOUTH+1:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/robot/radio"), []))), "EAST-1:28,SOUTH+1:7");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/robot/module1"), []))), "CENTER-2:16,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "inv1", live(mymobR), live(using));
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/robot/module2"), []))), "CENTER-1  :16,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "inv2", live(mymobR), live(using));
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/robot/module3"), []))), "CENTER  :16,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "inv3", live(mymobR), live(using));
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/image_take"), []))), "CENTER+3:21,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/image_view"), []))), "CENTER+4:21,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/sensors"), []))), "CENTER-3:16, SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/robot/lamp"), []))), "CENTER-4:16, SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "lamp_button", live(mymobR), live(using));
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/robot/thrusters"), []))), "CENTER-5:16, SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "thruster_button", live(mymobR), live(using));
	rt.setSv(f, "action_intent", (yield* g.new_(f, T("/obj/screen/act_intent/robot"), [])));
	rt.setFv(f, "icon_state", rt.sv(f, "action_intent"), rt.fv(f, "a_intent", rt.sv(f, "mymob")));
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "action_intent"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/robot"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setFv(f, "hands", live(mymobR), (yield* g.new_(f, T("/obj/screen/robot/module"), [])));
	rt.setFv(f, "screen_loc", rt.fv(f, "hands", live(mymobR)), "CENTER+1:16,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", rt.fv(f, "hands", live(mymobR)), add);
	rt.setSv(f, "module_store_icon", (yield* g.new_(f, T("/obj/screen/robot/store"), [])));
	rt.setFv(f, "screen_loc", rt.sv(f, "module_store_icon"), "CENTER+2:16,SOUTH:5");
	rt.setSv(f, "pull_icon", (yield* g.new_(f, T("/obj/screen/pull"), [])));
	rt.setFv(f, "icon", rt.sv(f, "pull_icon"), rt.rsc("icons/mob/screen_cyborg.dmi"));
	yield* g.callName(f, rt.sv(f, "pull_icon"), "update_icon", [rt.sv(f, "mymob")]);
	rt.setFv(f, "screen_loc", rt.sv(f, "pull_icon"), "EAST-2:26,SOUTH+1:7");
	rt.modSrcVar(f, "hotkeybuttons", rt.sv(f, "pull_icon"), add);
	rt.setSv(f, "zone_select", (yield* g.new_(f, T("/obj/screen/zone_sel/robot"), [])));
	yield* g.callName(f, rt.sv(f, "zone_select"), "update_icon", [rt.sv(f, "mymob")]);
	rt.modSrcVar(f, "static_inventory", rt.sv(f, "zone_select"), add);
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// /datum/hud/proc/toggle_show_robot_modules  (code/_onclick/hud/robot.dm:183)
rt.def("/datum/hud/proc/toggle_show_robot_modules", function toggle_show_robot_modules(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy((rt.istype(rt.sv(f, "mymob"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "shown_robot_modules", (R = rt.sv(f, "mymob")), (!truthy(rt.fv(f, "shown_robot_modules", live(R))) ? 1 : 0));
	rt.callSrc(f, "update_robot_modules_display", []);
	return f.dot;
});

// /datum/hud/proc/update_robot_modules_display  (code/_onclick/hud/robot.dm:191)
rt.def("/datum/hud/proc/update_robot_modules_display", function update_robot_modules_display(f: Frame, viewer: Value) {
	let R: Value = null, screenmob: Value = null, display_rows: Value = null, x: Value = null, y: Value = null, A: Value = null, A_2: Value = null;
	let $e: any;
	f.vars = () => [R, screenmob, display_rows, x, y, A, A_2, $e];
	if (!truthy((rt.istype(rt.sv(f, "mymob"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	R = rt.sv(f, "mymob");
	screenmob = (live(viewer) || live(R));
	if (!truthy(rt.fv(f, "module", live(R)))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "client", live(R)))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "shown_robot_modules", live(R))) && truthy(rt.gv(f, "hud_shown", rt.fv(f, "hud_used", live(screenmob)))))) {
		rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "module_store_icon"), add);
		if (!truthy(rt.gv(f, "modules", rt.fv(f, "module", live(R))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Selected module has no modules to select</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "robot_modules_background", live(R)))) {
			return live(f.dot);
		}
		display_rows = rt.call(f, P("/proc/Ceiling"), null, [divide(rt.length(rt.callName(f, rt.fv(f, "module", live(R)), "get_inactive_modules", [])), 8)]);
		rt.setFv(f, "screen_loc", rt.fv(f, "robot_modules_background", live(R)), fmt("CENTER-4:16,SOUTH+1:7 to CENTER+3:16,SOUTH+＀:7", [live(display_rows)]));
		rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "robot_modules_background", live(R)), add);
		x = -4;
		y = 1;
		A = null;
		rt.forList(f, 0, rt.callName(f, rt.fv(f, "module", live(R)), "get_inactive_modules", []), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(A), add);
			if (rt.lt(live(x), 0)) {
				rt.setFv(f, "screen_loc", live(A), fmt("CENTER＀:16,SOUTH+＀:7", [live(x), live(y)]));
			} else {
				rt.setFv(f, "screen_loc", live(A), fmt("CENTER+＀:16,SOUTH+＀:7", [live(x), live(y)]));
			}
			rt.setFv(f, "layer", live(A), 20);
			rt.setFv(f, "plane", live(A), 20);
			x = rt.inc(live(x), 1);
			if (isEqual(live(x), 4)) {
				x = -4;
				y = rt.inc(live(y), 1);
			}
		}
		rt.endFor(f, 0);
	} else {
		(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.sv(f, "module_store_icon"), subtract));
		A_2 = null;
		rt.forList(f, 0, rt.callName(f, rt.fv(f, "module", live(R)), "get_inactive_modules", []), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A_2 = $e;
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(A_2), subtract));
		}
		rt.endFor(f, 0);
		rt.setFv(f, "shown_robot_modules", live(R), 0);
		(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", rt.fv(f, "robot_modules_background", live(R)), subtract));
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/create_mob_hud  (code/_onclick/hud/robot.dm:247)  may sleep
rt.def("/mob/living/silicon/robot/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/robot"), [live(f.src)])));
	return f.dot;
}, true);

// /datum/hud/robot/proc/persistent_inventory_update  (code/_onclick/hud/robot.dm:252)
rt.def("/datum/hud/robot/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame, viewer: Value) {
	let R: Value = null, screenmob: Value = null, i: Value = null, I: Value = null, I_2: Value = null;
	let $0: any, $e: any;
	f.vars = () => [R, screenmob, i, I, I_2, $0, $e];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	R = rt.sv(f, "mymob");
	if (!truthy(rt.gv(f, "hud_used", (screenmob = (live(viewer) || live(R)))))) return f.dot;
	if (truthy(rt.gv(f, "hud_shown", rt.fv(f, "hud_used", live(screenmob))))) {
		i = null;
		rt.forRange(f, 0, 1, rt.getLen(f, rt.fv(f, "held_items", live(R))), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy((I = rt.index(rt.fv(f, "held_items", live(R)), live(i))))) {
				$0 = live(i);
				if ($0 === 1) {
					rt.setFv(f, "screen_loc", live(I), "CENTER-2:16,SOUTH:5");
				} else if ($0 === 2) {
					rt.setFv(f, "screen_loc", live(I), "CENTER-1  :16,SOUTH:5");
				} else if ($0 === 3) {
					rt.setFv(f, "screen_loc", live(I), "CENTER  :16,SOUTH:5");
				} else {
					return live(f.dot);
				}
				rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(I), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		I_2 = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(R)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I_2 = $e;
			(rt.modField(f, rt.fv(f, "client", live(screenmob)), "screen", live(I_2), subtract));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});
