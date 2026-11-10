// Based on /tg/station's code/_onclick/hud/robot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11146, "/obj/screen/robot", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
});

// robot.dm:9
rt.def("/obj/screen/robot/proc/Click", function Click(f: Frame) {
	if (!rt.istype(f.usr, T("/mob/dead/observer"))) return f.dot;
	return 1;
});

rt.type(11147, "/obj/screen/robot/module", "/obj/screen/robot", {
	name: "cyborg module",
	icon_state: "nomod",
});

// robot.dm:13
rt.def("/obj/screen/robot/module/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if ((R = f.usr).module.type != T("/obj/item/weapon/robot_module")) {
		R.hud_used.toggle_show_robot_modules();
		return 1;
	}
	yield* R.pick_module();
	return f.dot;
}, true);

rt.type(11148, "/obj/screen/robot/module1", "/obj/screen/robot", {
	name: "module1",
	icon_state: "inv1",
});

// robot.dm:26
rt.def("/obj/screen/robot/module1/proc/Click", function Click(f: Frame) {
	let R: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(R = f.usr).toggle_module(1);
	return f.dot;
});

rt.type(11149, "/obj/screen/robot/module2", "/obj/screen/robot", {
	name: "module2",
	icon_state: "inv2",
});

// robot.dm:36
rt.def("/obj/screen/robot/module2/proc/Click", function Click(f: Frame) {
	let R: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(R = f.usr).toggle_module(2);
	return f.dot;
});

rt.type(11150, "/obj/screen/robot/module3", "/obj/screen/robot", {
	name: "module3",
	icon_state: "inv3",
});

// robot.dm:46
rt.def("/obj/screen/robot/module3/proc/Click", function Click(f: Frame) {
	let R: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(R = f.usr).toggle_module(3);
	return f.dot;
});

rt.type(11151, "/obj/screen/robot/radio", "/obj/screen/robot", {
	name: "radio",
	icon_state: "radio",
});

// robot.dm:56
rt.def("/obj/screen/robot/radio/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (R = f.usr).radio.interact(R);
	return f.dot;
}, true);

rt.type(11152, "/obj/screen/robot/store", "/obj/screen/robot", {
	name: "store",
	icon_state: "store",
});

// robot.dm:66
rt.def("/obj/screen/robot/store/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (R = f.usr).uneq_active();
	return f.dot;
}, true);

rt.type(11153, "/obj/screen/robot/lamp", "/obj/screen/robot", {
	name: "headlamp",
	icon_state: "lamp0",
});

// robot.dm:76
rt.def("/obj/screen/robot/lamp/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (R = f.usr).control_headlamp();
	return f.dot;
}, true);

rt.type(11154, "/obj/screen/robot/thrusters", "/obj/screen/robot", {
	name: "ion thrusters",
	icon_state: "ionpulse0",
});

// robot.dm:86
rt.def("/obj/screen/robot/thrusters/proc/Click", function* Click(f: Frame) {
	let R: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (R = f.usr).toggle_ionpulse();
	return f.dot;
}, true);

rt.type(75, "/datum/hud/robot", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_cyborg.dmi"),
});

// robot.dm:95
rt.def("/datum/hud/robot/proc/New", function* New(f: Frame) {
	let using: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_cyborg.dmi");
	}
	yield* parent_proc();
	let mymobR: Value = this.mymob;
	(using = (yield* new_(T("/obj/screen/language_menu")))).screen_loc = "CENTER+4:21,SOUTH+1:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/robot/radio")))).screen_loc = "EAST-1:28,SOUTH+1:7";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/robot/module1")))).screen_loc = "CENTER-2:16,SOUTH:5";
	this.static_inventory += using;
	mymobR.inv1 = using;
	(using = (yield* new_(T("/obj/screen/robot/module2")))).screen_loc = "CENTER-1  :16,SOUTH:5";
	this.static_inventory += using;
	mymobR.inv2 = using;
	(using = (yield* new_(T("/obj/screen/robot/module3")))).screen_loc = "CENTER  :16,SOUTH:5";
	this.static_inventory += using;
	mymobR.inv3 = using;
	(using = (yield* new_(T("/obj/screen/ai/image_take")))).screen_loc = "CENTER+3:21,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/image_view")))).screen_loc = "CENTER+4:21,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/sensors")))).screen_loc = "CENTER-3:16, SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/robot/lamp")))).screen_loc = "CENTER-4:16, SOUTH:5";
	this.static_inventory += using;
	mymobR.lamp_button = using;
	(using = (yield* new_(T("/obj/screen/robot/thrusters")))).screen_loc = "CENTER-5:16, SOUTH:5";
	this.static_inventory += using;
	mymobR.thruster_button = using;
	this.action_intent = (yield* new_(T("/obj/screen/act_intent/robot")));
	this.action_intent.icon_state = this.mymob.a_intent;
	this.static_inventory += this.action_intent;
	this.healths = (yield* new_(T("/obj/screen/healths/robot")));
	this.infodisplay += this.healths;
	mymobR.hands = (yield* new_(T("/obj/screen/robot/module")));
	mymobR.hands.screen_loc = "CENTER+1:16,SOUTH:5";
	this.static_inventory += mymobR.hands;
	this.module_store_icon = (yield* new_(T("/obj/screen/robot/store")));
	this.module_store_icon.screen_loc = "CENTER+2:16,SOUTH:5";
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = rt.rsc("icons/mob/screen_cyborg.dmi");
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.hotkeybuttons += this.pull_icon;
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel/robot")));
	yield* this.zone_select.update_icon(this.mymob);
	this.static_inventory += this.zone_select;
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// robot.dm:183
rt.def("/datum/hud/proc/toggle_show_robot_modules", function toggle_show_robot_modules(f: Frame) {
	let R: Value = null;
	if (!rt.istype(this.mymob, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	(R = this.mymob).shown_robot_modules = (!R.shown_robot_modules ? 1 : 0);
	this.update_robot_modules_display();
	return f.dot;
});

// robot.dm:191
rt.def("/datum/hud/proc/update_robot_modules_display", function update_robot_modules_display(f: Frame, viewer: Value) {
	let display_rows: Value = null, x: Value = null, y: Value = null, A: Value = null, A_2: Value = null;
	if (!rt.istype(this.mymob, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	let R: Value = this.mymob;
	let screenmob: Value = (viewer || R);
	if (!R.module) {
		return f.dot;
	}
	if (!R.client) {
		return f.dot;
	}
	if (R.shown_robot_modules && screenmob.hud_used.hud_shown) {
		screenmob.client.screen += this.module_store_icon;
		if (!R.module.modules) {
			to_chat(f.usr, "<span class='danger'>Selected module has no modules to select</span>");
			return f.dot;
		}
		if (!R.robot_modules_background) {
			return f.dot;
		}
		display_rows = Ceiling(rt.length(R.module.get_inactive_modules()) / 8);
		R.robot_modules_background.screen_loc = `CENTER-4:16,SOUTH+1:7 to CENTER+3:16,SOUTH+${display_rows}:7`;
		screenmob.client.screen += R.robot_modules_background;
		x = -4;
		y = 1;
		for (A of each(R.module.get_inactive_modules(), T("/atom/movable"))) {
			screenmob.client.screen += A;
			if (x < 0) {
				A.screen_loc = `CENTER${x}:16,SOUTH+${y}:7`;
			} else {
				A.screen_loc = `CENTER+${x}:16,SOUTH+${y}:7`;
			}
			A.layer = ABOVE_HUD_LAYER;
			A.plane = ABOVE_HUD_PLANE;
			x++;
			if (x == 4) {
				x = -4;
				y++;
			}
		}
	} else {
		screenmob.client.screen -= this.module_store_icon;
		for (A_2 of each(R.module.get_inactive_modules(), T("/atom"))) {
			screenmob.client.screen -= A_2;
		}
		R.shown_robot_modules = 0;
		screenmob.client.screen -= R.robot_modules_background;
	}
	return f.dot;
});

// robot.dm:247
rt.def("/mob/living/silicon/robot/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/robot"), this));
	return f.dot;
}, true);

// robot.dm:252
rt.def("/datum/hud/robot/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame, viewer: Value) {
	let screenmob: Value = null, i: Value = null, I: Value = null, I_2: Value = null;
	let $e: any;
	if (!this.mymob) {
		return f.dot;
	}
	let R: Value = this.mymob;
	if (!(screenmob = (viewer || R)).hud_used) return f.dot;
	if (screenmob.hud_used.hud_shown) {
		rt.forRange(f, 0, 1, rt.len(f, R.held_items), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (I = rt.index(R.held_items, i)) {
				if (i === 1) {
					I.screen_loc = "CENTER-2:16,SOUTH:5";
				} else if (i === 2) {
					I.screen_loc = "CENTER-1  :16,SOUTH:5";
				} else if (i === 3) {
					I.screen_loc = "CENTER  :16,SOUTH:5";
				} else {
					return f.dot;
				}
				screenmob.client.screen += I;
			}
		}
		rt.endFor(f, 0);
	} else {
		for (I_2 of each(R.held_items, T("/obj/item"))) {
			screenmob.client.screen -= I_2;
		}
	}
	return f.dot;
});
