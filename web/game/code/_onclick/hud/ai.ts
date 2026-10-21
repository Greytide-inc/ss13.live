// From code/_onclick/hud/ai.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11005, "/obj/screen/ai", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_ai.dmi"),
});

// /obj/screen/ai/proc/Click  (code/_onclick/hud/ai.dm:5)
rt.def("/obj/screen/ai/proc/Click", function Click(f: Frame) {
	if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	return 1;
});

rt.type(11006, "/obj/screen/ai/aicore", "/obj/screen/ai", {
	name: "AI core",
	icon_state: "ai_core",
});

// /obj/screen/ai/aicore/proc/Click  (code/_onclick/hud/ai.dm:13)  may sleep
rt.def("/obj/screen/ai/aicore/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (AI = live(f.usr)), "view_core", []);
	return f.dot;
}, true);

rt.type(11007, "/obj/screen/ai/camera_list", "/obj/screen/ai", {
	name: "Show Camera List",
	icon_state: "camera",
});

// /obj/screen/ai/camera_list/proc/Click  (code/_onclick/hud/ai.dm:23)  may sleep
rt.def("/obj/screen/ai/camera_list/proc/Click", function* Click(f: Frame) {
	let AI: Value = null, camera: Value = null;
	f.vars = () => [AI, camera];
	AI = live(f.usr);
	camera = (yield* g.op(f, "Prompt", [1], [null, "Cameras", "Choose which camera you want to view", live(AI), (yield* g.callName(f, live(AI), "get_camera_list", []))]));
	yield* g.callName(f, live(AI), "ai_camera_list", [live(camera)]);
	return f.dot;
}, true);

rt.type(11008, "/obj/screen/ai/camera_track", "/obj/screen/ai", {
	name: "Track With Camera",
	icon_state: "track",
});

// /obj/screen/ai/camera_track/proc/Click  (code/_onclick/hud/ai.dm:32)  may sleep
rt.def("/obj/screen/ai/camera_track/proc/Click", function* Click(f: Frame) {
	let AI: Value = null, target_name: Value = null;
	f.vars = () => [AI, target_name];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	AI = live(f.usr);
	target_name = (yield* g.op(f, "Prompt", [1], [null, "Tracking", "Choose who you want to track", live(AI), (yield* g.callName(f, live(AI), "trackable_mobs", []))]));
	yield* g.callName(f, live(AI), "ai_camera_track", [live(target_name)]);
	return f.dot;
}, true);

rt.type(11009, "/obj/screen/ai/camera_light", "/obj/screen/ai", {
	name: "Toggle Camera Light",
	icon_state: "camera_light",
});

// /obj/screen/ai/camera_light/proc/Click  (code/_onclick/hud/ai.dm:43)
rt.def("/obj/screen/ai/camera_light/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (AI = live(f.usr)), "toggle_camera_light", []);
	return f.dot;
});

rt.type(11010, "/obj/screen/ai/crew_monitor", "/obj/screen/ai", {
	name: "Crew Monitoring Console",
	icon_state: "crew_monitor",
});

// /obj/screen/ai/crew_monitor/proc/Click  (code/_onclick/hud/ai.dm:53)  may sleep
rt.def("/obj/screen/ai/crew_monitor/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	AI = live(f.usr);
	yield* g.callName(f, rt.gl("crewmonitor"), "show", [live(AI)]);
	return f.dot;
}, true);

rt.type(11011, "/obj/screen/ai/crew_manifest", "/obj/screen/ai", {
	name: "Crew Manifest",
	icon_state: "manifest",
});

// /obj/screen/ai/crew_manifest/proc/Click  (code/_onclick/hud/ai.dm:63)
rt.def("/obj/screen/ai/crew_manifest/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (AI = live(f.usr)), "ai_roster", []);
	return f.dot;
});

rt.type(11012, "/obj/screen/ai/alerts", "/obj/screen/ai", {
	name: "Show Alerts",
	icon_state: "alerts",
});

// /obj/screen/ai/alerts/proc/Click  (code/_onclick/hud/ai.dm:73)
rt.def("/obj/screen/ai/alerts/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (AI = live(f.usr)), "ai_alerts", []);
	return f.dot;
});

rt.type(11013, "/obj/screen/ai/announcement", "/obj/screen/ai", {
	name: "Make Vox Announcement",
	icon_state: "announcement",
});

// /obj/screen/ai/announcement/proc/Click  (code/_onclick/hud/ai.dm:83)  may sleep
rt.def("/obj/screen/ai/announcement/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (AI = live(f.usr)), "announcement", []);
	return f.dot;
}, true);

rt.type(11014, "/obj/screen/ai/call_shuttle", "/obj/screen/ai", {
	name: "Call Emergency Shuttle",
	icon_state: "call_shuttle",
});

// /obj/screen/ai/call_shuttle/proc/Click  (code/_onclick/hud/ai.dm:93)  may sleep
rt.def("/obj/screen/ai/call_shuttle/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (AI = live(f.usr)), "ai_call_shuttle", []);
	return f.dot;
}, true);

rt.type(11015, "/obj/screen/ai/state_laws", "/obj/screen/ai", {
	name: "State Laws",
	icon_state: "state_laws",
});

// /obj/screen/ai/state_laws/proc/Click  (code/_onclick/hud/ai.dm:103)
rt.def("/obj/screen/ai/state_laws/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (AI = live(f.usr)), "checklaws", []);
	return f.dot;
});

rt.type(11016, "/obj/screen/ai/pda_msg_send", "/obj/screen/ai", {
	name: "PDA - Send Message",
	icon_state: "pda_send",
});

// /obj/screen/ai/pda_msg_send/proc/Click  (code/_onclick/hud/ai.dm:113)  may sleep
rt.def("/obj/screen/ai/pda_msg_send/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (AI = live(f.usr)), "cmd_send_pdamesg", [live(f.usr)]);
	return f.dot;
}, true);

rt.type(11017, "/obj/screen/ai/pda_msg_show", "/obj/screen/ai", {
	name: "PDA - Show Message Log",
	icon_state: "pda_receive",
});

// /obj/screen/ai/pda_msg_show/proc/Click  (code/_onclick/hud/ai.dm:123)
rt.def("/obj/screen/ai/pda_msg_show/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	f.vars = () => [AI];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.callName(f, (AI = live(f.usr)), "cmd_show_message_log", [live(f.usr)]);
	return f.dot;
});

rt.type(11018, "/obj/screen/ai/image_take", "/obj/screen/ai", {
	name: "Take Image",
	icon_state: "take_picture",
});

// /obj/screen/ai/image_take/proc/Click  (code/_onclick/hud/ai.dm:133)
rt.def("/obj/screen/ai/image_take/proc/Click", function Click(f: Frame) {
	let AI: Value = null, R: Value = null;
	f.vars = () => [AI, R];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		rt.callName(f, rt.gv(f, "aicamera", (AI = live(f.usr))), "toggle_camera_mode", []);
	} else {
		if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
		rt.callName(f, rt.gv(f, "aicamera", (R = live(f.usr))), "toggle_camera_mode", []);
	}
	return f.dot;
});

rt.type(11019, "/obj/screen/ai/image_view", "/obj/screen/ai", {
	name: "View Images",
	icon_state: "view_images",
});

// /obj/screen/ai/image_view/proc/Click  (code/_onclick/hud/ai.dm:145)  may sleep
rt.def("/obj/screen/ai/image_view/proc/Click", function* Click(f: Frame) {
	let AI: Value = null, R: Value = null;
	f.vars = () => [AI, R];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		yield* g.callName(f, rt.gv(f, "aicamera", (AI = live(f.usr))), "viewpictures", []);
	} else {
		if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, rt.gv(f, "aicamera", (R = live(f.usr))), "viewpictures", []);
	}
	return f.dot;
}, true);

rt.type(11020, "/obj/screen/ai/sensors", "/obj/screen/ai", {
	name: "Sensor Augmentation",
	icon_state: "ai_sensor",
});

// /obj/screen/ai/sensors/proc/Click  (code/_onclick/hud/ai.dm:157)  may sleep
rt.def("/obj/screen/ai/sensors/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (S = live(f.usr)), "sensor_mode", []);
	return f.dot;
}, true);

rt.type(61, "/datum/hud/ai", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_ai.dmi"),
});

// /datum/hud/ai/proc/New  (code/_onclick/hud/ai.dm:167)  may sleep
rt.def("/datum/hud/ai/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_ai.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/language_menu"), []))), "CENTER+4:21,SOUTH+1:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/aicore"), []))), "SOUTH:6,WEST");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/camera_list"), []))), "SOUTH:6,WEST+1");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/camera_track"), []))), "SOUTH:6,WEST+2");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/camera_light"), []))), "SOUTH:6,WEST+3");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/crew_monitor"), []))), "SOUTH:6,WEST+4");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/crew_manifest"), []))), "SOUTH:6,WEST+5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/alerts"), []))), "SOUTH:6,WEST+6");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/announcement"), []))), "SOUTH:6,WEST+7");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/call_shuttle"), []))), "SOUTH:6,WEST+8");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/state_laws"), []))), "SOUTH:6,WEST+9");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/pda_msg_send"), []))), "SOUTH:6,WEST+10");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/pda_msg_show"), []))), "SOUTH:6,WEST+11");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/image_take"), []))), "SOUTH:6,WEST+12");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/image_view"), []))), "SOUTH:6,WEST+13");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/ai/sensors"), []))), "SOUTH:6,WEST+14");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// /mob/living/silicon/ai/proc/create_mob_hud  (code/_onclick/hud/ai.dm:253)  may sleep
rt.def("/mob/living/silicon/ai/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/ai"), [live(f.src)])));
	return f.dot;
}, true);
