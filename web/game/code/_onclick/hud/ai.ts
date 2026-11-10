// Based on /tg/station's code/_onclick/hud/ai.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(11005, "/obj/screen/ai", "/obj/screen", {
	icon: rt.rsc("icons/mob/screen_ai.dmi"),
});

// ai.dm:5
rt.def("/obj/screen/ai/proc/Click", function Click(f: Frame) {
	if (!rt.istype(f.usr, T("/mob/dead/observer"))) return f.dot;
	return 1;
});

rt.type(11006, "/obj/screen/ai/aicore", "/obj/screen/ai", {
	name: "AI core",
	icon_state: "ai_core",
});

// ai.dm:13
rt.def("/obj/screen/ai/aicore/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (AI = f.usr).view_core();
	return f.dot;
}, true);

rt.type(11007, "/obj/screen/ai/camera_list", "/obj/screen/ai", {
	name: "Show Camera List",
	icon_state: "camera",
});

// ai.dm:23
rt.def("/obj/screen/ai/camera_list/proc/Click", function* Click(f: Frame) {
	let AI: Value = f.usr;
	let camera: Value = (yield* g.op(f, "Prompt", [1], [null, "Cameras", "Choose which camera you want to view", AI, AI.get_camera_list()]));
	yield* AI.ai_camera_list(camera);
	return f.dot;
}, true);

rt.type(11008, "/obj/screen/ai/camera_track", "/obj/screen/ai", {
	name: "Track With Camera",
	icon_state: "track",
});

// ai.dm:32
rt.def("/obj/screen/ai/camera_track/proc/Click", function* Click(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	let AI: Value = f.usr;
	let target_name: Value = (yield* g.op(f, "Prompt", [1], [null, "Tracking", "Choose who you want to track", AI, (yield* AI.trackable_mobs())]));
	AI.ai_camera_track(target_name);
	return f.dot;
}, true);

rt.type(11009, "/obj/screen/ai/camera_light", "/obj/screen/ai", {
	name: "Toggle Camera Light",
	icon_state: "camera_light",
});

// ai.dm:43
rt.def("/obj/screen/ai/camera_light/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(AI = f.usr).toggle_camera_light();
	return f.dot;
});

rt.type(11010, "/obj/screen/ai/crew_monitor", "/obj/screen/ai", {
	name: "Crew Monitoring Console",
	icon_state: "crew_monitor",
});

// ai.dm:53
rt.def("/obj/screen/ai/crew_monitor/proc/Click", function* Click(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	let AI: Value = f.usr;
	yield* GLOB.crewmonitor.show(AI);
	return f.dot;
}, true);

rt.type(11011, "/obj/screen/ai/crew_manifest", "/obj/screen/ai", {
	name: "Crew Manifest",
	icon_state: "manifest",
});

// ai.dm:63
rt.def("/obj/screen/ai/crew_manifest/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(AI = f.usr).ai_roster();
	return f.dot;
});

rt.type(11012, "/obj/screen/ai/alerts", "/obj/screen/ai", {
	name: "Show Alerts",
	icon_state: "alerts",
});

// ai.dm:73
rt.def("/obj/screen/ai/alerts/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(AI = f.usr).ai_alerts();
	return f.dot;
});

rt.type(11013, "/obj/screen/ai/announcement", "/obj/screen/ai", {
	name: "Make Vox Announcement",
	icon_state: "announcement",
});

// ai.dm:83
rt.def("/obj/screen/ai/announcement/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (AI = f.usr).announcement();
	return f.dot;
}, true);

rt.type(11014, "/obj/screen/ai/call_shuttle", "/obj/screen/ai", {
	name: "Call Emergency Shuttle",
	icon_state: "call_shuttle",
});

// ai.dm:93
rt.def("/obj/screen/ai/call_shuttle/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (AI = f.usr).ai_call_shuttle();
	return f.dot;
}, true);

rt.type(11015, "/obj/screen/ai/state_laws", "/obj/screen/ai", {
	name: "State Laws",
	icon_state: "state_laws",
});

// ai.dm:103
rt.def("/obj/screen/ai/state_laws/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(AI = f.usr).checklaws();
	return f.dot;
});

rt.type(11016, "/obj/screen/ai/pda_msg_send", "/obj/screen/ai", {
	name: "PDA - Send Message",
	icon_state: "pda_send",
});

// ai.dm:113
rt.def("/obj/screen/ai/pda_msg_send/proc/Click", function* Click(f: Frame) {
	let AI: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (AI = f.usr).cmd_send_pdamesg(f.usr);
	return f.dot;
}, true);

rt.type(11017, "/obj/screen/ai/pda_msg_show", "/obj/screen/ai", {
	name: "PDA - Show Message Log",
	icon_state: "pda_receive",
});

// ai.dm:123
rt.def("/obj/screen/ai/pda_msg_show/proc/Click", function Click(f: Frame) {
	let AI: Value = null;
	if (parent_proc()) {
		return f.dot;
	}
	(AI = f.usr).cmd_show_message_log(f.usr);
	return f.dot;
});

rt.type(11018, "/obj/screen/ai/image_take", "/obj/screen/ai", {
	name: "Take Image",
	icon_state: "take_picture",
});

// ai.dm:133
rt.def("/obj/screen/ai/image_take/proc/Click", function Click(f: Frame) {
	let AI: Value = null, R: Value = null;
	if (rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
		(AI = f.usr).aicamera.toggle_camera_mode();
	} else {
		if (!rt.istype(f.usr, T("/mob/living/silicon/robot"))) return f.dot;
		(R = f.usr).aicamera.toggle_camera_mode();
	}
	return f.dot;
});

rt.type(11019, "/obj/screen/ai/image_view", "/obj/screen/ai", {
	name: "View Images",
	icon_state: "view_images",
});

// ai.dm:145
rt.def("/obj/screen/ai/image_view/proc/Click", function* Click(f: Frame) {
	let AI: Value = null, R: Value = null;
	if (rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
		yield* (AI = f.usr).aicamera.viewpictures();
	} else {
		if (!rt.istype(f.usr, T("/mob/living/silicon/robot"))) return f.dot;
		yield* (R = f.usr).aicamera.viewpictures();
	}
	return f.dot;
}, true);

rt.type(11020, "/obj/screen/ai/sensors", "/obj/screen/ai", {
	name: "Sensor Augmentation",
	icon_state: "ai_sensor",
});

// ai.dm:157
rt.def("/obj/screen/ai/sensors/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* (S = f.usr).sensor_mode();
	return f.dot;
}, true);

rt.type(61, "/datum/hud/ai", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_ai.dmi"),
});

// ai.dm:167
rt.def("/datum/hud/ai/proc/New", function* New(f: Frame) {
	let using: Value = null;
	if (f.args[1] === null) {
		f.args[1] = rt.rsc("icons/mob/screen_ai.dmi");
	}
	yield* parent_proc();
	(using = (yield* new_(T("/obj/screen/language_menu")))).screen_loc = "CENTER+4:21,SOUTH+1:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/aicore")))).screen_loc = "SOUTH:6,WEST";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/camera_list")))).screen_loc = "SOUTH:6,WEST+1";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/camera_track")))).screen_loc = "SOUTH:6,WEST+2";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/camera_light")))).screen_loc = "SOUTH:6,WEST+3";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/crew_monitor")))).screen_loc = "SOUTH:6,WEST+4";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/crew_manifest")))).screen_loc = "SOUTH:6,WEST+5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/alerts")))).screen_loc = "SOUTH:6,WEST+6";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/announcement")))).screen_loc = "SOUTH:6,WEST+7";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/call_shuttle")))).screen_loc = "SOUTH:6,WEST+8";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/state_laws")))).screen_loc = "SOUTH:6,WEST+9";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/pda_msg_send")))).screen_loc = "SOUTH:6,WEST+10";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/pda_msg_show")))).screen_loc = "SOUTH:6,WEST+11";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/image_take")))).screen_loc = "SOUTH:6,WEST+12";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/image_view")))).screen_loc = "SOUTH:6,WEST+13";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/ai/sensors")))).screen_loc = "SOUTH:6,WEST+14";
	this.static_inventory += using;
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// ai.dm:253
rt.def("/mob/living/silicon/ai/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/ai"), this));
	return f.dot;
}, true);
