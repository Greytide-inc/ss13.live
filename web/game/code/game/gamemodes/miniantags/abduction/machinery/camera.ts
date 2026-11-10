// Based on /tg/station's code/game/gamemodes/miniantags/abduction/machinery/camera.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10351, "/obj/machinery/computer/camera_advanced/abductor", "/obj/machinery/computer/camera_advanced", {
	team: 0,
	tele_in_action: null,
	tele_out_action: null,
	tele_self_action: null,
	vest_mode_action: null,
	vest_disguise_action: null,
	set_droppoint_action: null,
	console: null,
	name: "Human Observation Console",
	networks: null,
	z_lock: 2,
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "camera",
	resistance_flags: 99,
});

// camera.dm:5
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.tele_in_action = (yield* new_(T("/datum/action/innate/teleport_in")));

	this.tele_out_action = (yield* new_(T("/datum/action/innate/teleport_out")));

	this.tele_self_action = (yield* new_(T("/datum/action/innate/teleport_self")));

	this.vest_mode_action = (yield* new_(T("/datum/action/innate/vest_mode_swap")));

	this.vest_disguise_action = (yield* new_(T("/datum/action/innate/vest_disguise_swap")));

	this.set_droppoint_action = (yield* new_(T("/datum/action/innate/set_droppoint")));
	this.networks = list("SS13", "Abductor");
	return f.dot;
}, true);

// camera.dm:19
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/CreateEye", function* CreateEye(f: Frame) {
	yield* parent_proc();
	this.eyeobj.visible_icon = 1;
	this.eyeobj.icon = rt.rsc("icons/obj/abductor.dmi");
	this.eyeobj.icon_state = "camera_target";
	return f.dot;
}, true);

// camera.dm:25
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/GrantActions", function* GrantActions(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.tele_in_action) {
		this.tele_in_action.target = this.console.pad;
		yield* this.tele_in_action.Grant(user);
		this.actions += this.tele_in_action;
	}
	if (this.tele_out_action) {
		this.tele_out_action.target = this.console;
		yield* this.tele_out_action.Grant(user);
		this.actions += this.tele_out_action;
	}
	if (this.tele_self_action) {
		this.tele_self_action.target = this.console.pad;
		yield* this.tele_self_action.Grant(user);
		this.actions += this.tele_self_action;
	}
	if (this.vest_mode_action) {
		this.vest_mode_action.target = this.console;
		yield* this.vest_mode_action.Grant(user);
		this.actions += this.vest_mode_action;
	}
	if (this.vest_disguise_action) {
		this.vest_disguise_action.target = this.console;
		yield* this.vest_disguise_action.Grant(user);
		this.actions += this.vest_disguise_action;
	}
	if (!this.set_droppoint_action) return f.dot;
	this.set_droppoint_action.target = this.console;
	yield* this.set_droppoint_action.Grant(user);
	this.actions += this.set_droppoint_action;
	return f.dot;
}, true);

// camera.dm:62
rt.def("/obj/machinery/computer/camera_advanced/abductor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!is_species(user, T("/datum/species/abductor"))) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(114, "/datum/action/innate/teleport_in", "/datum/action/innate", {
	name: "Send To",
	button_icon_state: "beam_down",
});

// camera.dm:71
rt.def("/datum/action/innate/teleport_in/proc/Activate", function* Activate(f: Frame) {
	if (!this.target || !rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	let _P: Value = this.target;
	if (!GLOB.cameranet.checkTurfVis(remote_eye.loc)) return f.dot;
	yield* _P.PadToLoc(remote_eye.loc);
	return f.dot;
}, true);

rt.type(115, "/datum/action/innate/teleport_out", "/datum/action/innate", {
	name: "Retrieve",
	button_icon_state: "beam_up",
});

// camera.dm:85
rt.def("/datum/action/innate/teleport_out/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	yield* (console = this.target).TeleporterRetrieve();
	return f.dot;
}, true);

rt.type(116, "/datum/action/innate/teleport_self", "/datum/action/innate", {
	name: "Send Self",
	button_icon_state: "beam_down",
});

// camera.dm:96
rt.def("/datum/action/innate/teleport_self/proc/Activate", function* Activate(f: Frame) {
	if (!this.target || !rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	let _P: Value = this.target;
	if (!GLOB.cameranet.checkTurfVis(remote_eye.loc)) return f.dot;
	yield* _P.MobToLoc(remote_eye.loc, C);
	return f.dot;
}, true);

rt.type(117, "/datum/action/innate/vest_mode_swap", "/datum/action/innate", {
	name: "Switch Vest Mode",
	button_icon_state: "vest_mode",
});

// camera.dm:110
rt.def("/datum/action/innate/vest_mode_swap/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	yield* (console = this.target).FlipVest();
	return f.dot;
}, true);

rt.type(118, "/datum/action/innate/vest_disguise_swap", "/datum/action/innate", {
	name: "Switch Vest Disguise",
	button_icon_state: "vest_disguise",
});

// camera.dm:121
rt.def("/datum/action/innate/vest_disguise_swap/proc/Activate", function* Activate(f: Frame) {
	let console: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	yield* (console = this.target).SelectDisguise({ remote: 1 });
	return f.dot;
}, true);

rt.type(119, "/datum/action/innate/set_droppoint", "/datum/action/innate", {
	name: "Set Experiment Release Point",
	button_icon_state: "set_drop",
});

// camera.dm:131
rt.def("/datum/action/innate/set_droppoint/proc/Activate", function Activate(f: Frame) {
	let console: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living/carbon"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	(console = this.target).SetDroppoint(remote_eye.loc, this.owner);
	return f.dot;
});
