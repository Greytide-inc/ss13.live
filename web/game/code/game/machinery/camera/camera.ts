// Based on /tg/station's code/game/machinery/camera/camera.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10622, "/obj/machinery/camera", "/obj/machinery", {
	network: null,
	c_tag: null,
	c_tag_order: 999,
	status: 1,
	start_active: 0,
	invuln: null,
	bug: null,
	assembly: null,
	view_range: 7,
	short_range: 2,
	alarm_on: 0,
	busy: 0,
	emped: 0,
	upgrades: 0,
	localMotionTargets: null,
	detectTime: 0,
	area_motion: null,
	alarm_delay: 30,
	anchored: 1,
	name: "security camera",
	desc: "It's used to monitor rooms.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "camera",
	use_power: 2,
	idle_power_usage: 5,
	active_power_usage: 10,
	layer: 4.25,
	resistance_flags: 2,
	armor: null,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 50,
});

// camera.dm:21
rt.def("/obj/machinery/camera/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.network = list("SS13");

	this.localMotionTargets = list();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 20, "laser", 20, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 50]);
	return f.dot;
});

// camera.dm:44
rt.def("/obj/machinery/camera/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.assembly = (yield* new_(T("/obj/structure/camera_assembly"), this));
	this.assembly.state = 4;
	GLOB.cameranet.cameras += this;
	GLOB.cameranet.addCamera(this);
	this.proximity_monitor = (yield* new_(T("/datum/proximity_monitor"), this, 1));
	if (!(mapload && this.z == ZLEVEL_STATION && prob(3) && !this.start_active)) return f.dot;
	yield* this.toggle_cam();
	return f.dot;
}, true);

// camera.dm:55
rt.def("/obj/machinery/camera/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.toggle_cam(null, 0);
	if (this.assembly) {
		yield* qdel(this.assembly);
		this.assembly = null;
	}
	if (this.bug) {
		this.bug.bugged_cameras -= this.c_tag;
		if (this.bug.current == this) {
			this.bug.current = null;
		}
		this.bug = null;
	}
	GLOB.cameranet.removeCamera(this);
	GLOB.cameranet.cameras -= this;
	GLOB.cameranet.removeCamera(this);
	return (yield* parent_proc());
}, true);

// camera.dm:70
rt.def("/obj/machinery/camera/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	if (!this.status) {
		return f.dot;
	}
	if (this.isEmpProof()) return f.dot;
	if (!prob(150 / severity)) return f.dot;
	yield* this.update_icon();
	let previous_network: Value = this.network;
	this.network = list();
	GLOB.cameranet.removeCamera(this);
	(rt.modSrcVar(f, "stat", EMPED, rt.bitOr));
	this.set_light(0);
	this.emped = this.emped + 1;
	yield* this.update_icon();
	let thisemp: Value = this.emped;
	rt.spawnTail(f, 900, "/obj/machinery/camera/proc/emp_act: spawn at game/machinery/camera/camera.dm:83", previous_network, thisemp, O);
	for (O of each(GLOB.mob_list, T("/mob"))) {
		if (O.client && O.client.eye == this) {
			yield* O.unset_machine();
			yield* O.reset_perspective(null);
			to_chat(O, "The screen bursts into static.");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn(900) body of /obj/machinery/camera/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/camera/proc/emp_act: spawn at game/machinery/camera/camera.dm:83", function* (f: Frame, previous_network: Value, thisemp: Value, O: Value) {
	if (this.loc) {
		this.triggerCameraAlarm();
		if (this.emped == thisemp) {
			this.network = previous_network;
			(rt.modSrcVar(f, "stat", 16777199, rt.bitAnd));
			yield* this.update_icon();
			if (this.can_use()) {
				GLOB.cameranet.addCamera(this);
			}
			this.emped = 0;
			yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/camera/proc/cancelCameraAlarm"))), 100);
		}
	}
	return null;
});

// camera.dm:102
rt.def("/obj/machinery/camera/proc/tesla_act", function* tesla_act(f: Frame, power: Value) {
	if (this.isEmpProof()) {
		return f.dot;
	}
	yield* parent_proc();
	yield* qdel(this);
	return f.dot;
}, true);

// camera.dm:110
rt.def("/obj/machinery/camera/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	if (this.invuln) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// camera.dm:114
rt.def("/obj/machinery/camera/proc/setViewRange", function setViewRange(f: Frame, num: Value) {
	num ??= 7;
	this.view_range = num;
	GLOB.cameranet.updateVisibility(this, 0);
	return f.dot;
});

// camera.dm:117
rt.def("/obj/machinery/camera/proc/shock", function* shock(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	yield* user.electrocute_act(10, this);
	return f.dot;
}, true);

// camera.dm:122
rt.def("/obj/machinery/camera/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _P: Value = null, U: Value = null, X: Value = null, _P_4: Value = null, itemname: Value = null, info: Value = null, O: Value = null, AI: Value = null, cable: Value = null;
	let $0: any, $1: any, $e: any;
	let msg: Value = `<span class='notice'>You attach ${W} into the assembly's inner circuits.</span>`;
	let msg2: Value = `<span class='notice'>${this} already has that upgrade!</span>`;
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		this.panel_open = (!this.panel_open ? 1 : 0);
		$0 = user;
		if (this.panel_open) {
			$1 = "open";
		} else {
			$1 = "closed";
		}
		to_chat($0, `<span class='notice'>You screw the camera's panel ${$1}.</span>`);
		playsound(this.loc, W.usesound, 50, 1);
		return f.dot;
	}
	if (this.panel_open) {
		if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			yield* this.toggle_cam(user, 1);
			this.obj_integrity = this.max_integrity;
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/device/multitool"))) {
			if (this.view_range == rt.initial(f, this, "view_range")) {
				$0 = this.short_range;
			} else {
				$0 = rt.initial(f, this, "view_range");
			}
			this.setViewRange($0);
			$0 = user;
			if (this.view_range == rt.initial(f, this, "view_range")) {
				$1 = "restore";
			} else {
				$1 = "mess up";
			}
			to_chat($0, `<span class='notice'>You ${$1} the camera's focus.</span>`);
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* this.weld(W, user)) {
				this.visible_message(`<span class='warning'>${user} unwelds ${this}, leaving it as just a frame bolted to the wall.</span>`, `<span class='warning'>You unweld ${this}, leaving it as just a frame bolted to the wall</span>`);
				yield* this.deconstruct(1);
			}
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/device/analyzer"))) {
			if (!this.isXRay()) {
				if (!(yield* user.drop_item(W))) {
					return f.dot;
				}
				yield* this.upgradeXRay();
				yield* qdel(W);
				to_chat(user, `${msg}`);
			} else {
				to_chat(user, `${msg2}`);
			}
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/stack/sheet/mineral/plasma"))) {
			if (!this.isEmpProof()) {
				_P = W;
				yield* this.upgradeEmpProof();
				to_chat(user, `${msg}`);
				yield* _P.use(1);
			} else {
				to_chat(user, `${msg2}`);
			}
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/device/assembly/prox_sensor"))) {
			if (!this.isMotion()) {
				yield* this.upgradeMotion();
				to_chat(user, `${msg}`);
				yield* qdel(W);
			} else {
				to_chat(user, `${msg2}`);
			}
			return f.dot;
		}
	}
	if ((rt.istype(W, T("/obj/item/weapon/paper")) || rt.istype(W, T("/obj/item/device/pda"))) && rt.istype(user, T("/mob/living"))) {
		U = user;
		itemname = "";
		info = "";
		if (rt.istype(W, T("/obj/item/weapon/paper"))) {
			itemname = (X = W).name;
			info = X.info;
		} else {
			itemname = (_P_4 = W).name;
			info = _P_4.notehtml;
		}
		to_chat(U, fmt("<span class='notice'>You hold ％！ up to the camera...</span>", [itemname]));
		U.changeNext_move(8);
		for (O of each(GLOB.player_list, T("/mob"))) {
			if (rt.istype(O, T("/mob/living/silicon/ai"))) {
				if ((AI = O).control_disabled || AI.stat == 2) {
					return f.dot;
				}
				if (U.name == "Unknown") {
					to_chat(AI, fmt("<b>＀</b> holds <a href='?_src_=usr;show_paper=1;'>＇！</a> up to one of your cameras ...", [U, itemname]));
				} else {
					to_chat(AI, fmt("<b><a href='?src=＃;track=＀'>＀</a></b> holds <a href='?_src_=usr;show_paper=1;'>＇！</a> up to one of your cameras ...", [AI, html_encode(U.name), U, itemname]));
				}
				AI.last_paper_seen = `<HTML><HEAD><TITLE>${itemname}</TITLE></HEAD><BODY><TT>${info}</TT></BODY></HTML>`;
			} else if (O.client && O.client.eye == this) {
				to_chat(O, fmt("＀ holds ＇！ up to one of the cameras ...", [U, itemname]));
				rt.op(f, "Browse", [], [O, `<HTML><HEAD><TITLE>${itemname}</TITLE></HEAD><BODY><TT>${info}</TT></BODY></HTML>`, `window=${itemname}`], false);
			}
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/device/camera_bug"))) {
		if (!this.can_use()) {
			to_chat(user, "<span class='notice'>Camera non-functional.</span>");
			return f.dot;
		}
		if (this.bug) {
			to_chat(user, "<span class='notice'>Camera bug removed.</span>");
			this.bug.bugged_cameras -= this.c_tag;
			this.bug = null;
		} else {
			to_chat(user, "<span class='notice'>Camera bugged.</span>");
			this.bug = W;
			rt.setAt(this.bug.bugged_cameras, this.c_tag, this);
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/pai_cable"))) {
		yield* (cable = W).plugin(this, user);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// camera.dm:234
rt.def("/obj/machinery/camera/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 12 && !rt.bitAnd(this.stat, 1)) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// camera.dm:239
rt.def("/obj/machinery/camera/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(this.status && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	this.triggerCameraAlarm();
	yield* this.toggle_cam(null, 0);
	return f.dot;
}, true);

// camera.dm:244
rt.def("/obj/machinery/camera/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (disassembled) {
			if (!this.assembly) {
				this.assembly = (yield* new_(T("/obj/structure/camera_assembly")));
			}
			this.assembly.loc = this.loc;
			this.assembly.state = 1;
			yield* this.assembly.setDir(this.dir);
			this.assembly = null;
		} else {
			(I = (yield* new_(T("/obj/item/wallframe/camera"), this.loc))).obj_integrity = I.max_integrity * 0.5;
			yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 2);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// camera.dm:259
rt.def("/obj/machinery/camera/proc/update_icon", function update_icon(f: Frame) {
	if (!this.status) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}1`;
	} else if (rt.bitAnd(this.stat, EMPED)) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}emp`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	}
	return f.dot;
});

// camera.dm:267
rt.def("/obj/machinery/camera/proc/toggle_cam", function* toggle_cam(f: Frame, user: Value, displaymessage: Value) {
	let O: Value = null;
	displaymessage ??= 1;
	this.status = (!this.status ? 1 : 0);
	if (this.can_use()) {
		GLOB.cameranet.addCamera(this);
	} else {
		this.set_light(0);
		GLOB.cameranet.removeCamera(this);
	}
	GLOB.cameranet.updateChunk(this.x, this.y, this.z);
	let change_msg: Value = "deactivates";
	if (this.status) {
		change_msg = "reactivates";
		this.triggerCameraAlarm();
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/camera/proc/cancelCameraAlarm"))), 100);
	}
	if (displaymessage) {
		if (user) {
			this.visible_message(`<span class='danger'>${user} ${change_msg} ${this}!</span>`);
			this.add_hiddenprint(user);
		} else {
			this.visible_message(fmt("<span class='danger'>＄！ ＀!</span>", [this, change_msg]));
		}
		playsound(this.loc, rt.rsc("sound/items/wirecutter.ogg"), 100, 1);
	}
	yield* this.update_icon();
	for (O of each(GLOB.player_list, T("/mob"))) {
		if (O.client && O.client.eye == this) {
			yield* O.unset_machine();
			yield* O.reset_perspective(null);
			to_chat(O, "The screen bursts into static.");
		}
	}
	return f.dot;
}, true);

// camera.dm:300
rt.def("/obj/machinery/camera/proc/triggerCameraAlarm", function triggerCameraAlarm(f: Frame) {
	let S: Value = null;
	this.alarm_on = 1;
	for (S of each(GLOB.mob_list, T("/mob/living/silicon"))) {
		S.triggerAlarm("Camera", get_area(this), list(this), this);
	}
	return f.dot;
});

// camera.dm:305
rt.def("/obj/machinery/camera/proc/cancelCameraAlarm", function cancelCameraAlarm(f: Frame) {
	let S: Value = null;
	this.alarm_on = 0;
	for (S of each(GLOB.mob_list, T("/mob/living/silicon"))) {
		S.cancelAlarm("Camera", get_area(this), this);
	}
	return f.dot;
});

// camera.dm:309
rt.def("/obj/machinery/camera/proc/can_use", function can_use(f: Frame) {
	if (!this.status) {
		return 0;
	}
	if (rt.bitAnd(this.stat, EMPED)) {
		return 0;
	}
	return 1;
});

// camera.dm:317
rt.def("/obj/machinery/camera/proc/can_see", function can_see(f: Frame) {
	let see: Value = null;
	let pos: Value = rt.getStep(f, this, 0);
	if (this.isXRay()) {
		see = range(this.view_range, pos);
	} else {
		see = get_hear(this.view_range, pos);
	}
	return see;
});

// camera.dm:362
rt.def("/obj/machinery/camera/proc/weld", function* weld(f: Frame, WT: Value, user: Value) {
	if (this.busy) {
		return 0;
	}
	if (!(yield* WT.remove_fuel(0, user))) {
		return 0;
	}
	to_chat(user, `<span class='notice'>You start to weld ${this}...</span>`);
	playsound(this.loc, WT.usesound, 50, 1);
	this.busy = 1;
	if (yield* do_after(user, 100 * WT.toolspeed, { target: this })) {
		this.busy = 0;
		if (!WT.isOn()) {
			return 0;
		}
		return 1;
	}
	this.busy = 0;
	return 0;
}, true);

// camera.dm:377
rt.def("/obj/machinery/camera/proc/Togglelight", function Togglelight(f: Frame, on: Value) {
	let A: Value = null, cam: Value = null;
	on ??= 0;
	for (A of each(GLOB.ai_list, T("/mob/living/silicon/ai"))) {
		cam = null;
		for (cam of each(A.lit_cameras, T("/obj/machinery/camera"))) {
			if (cam == this) {
				return f.dot;
			}
		}
	}
	if (on) {
		this.set_light(5);
	} else {
		this.set_light(0);
	}
	return f.dot;
});

rt.type(10623, "/obj/machinery/camera/portable", "/obj/machinery/camera", {
	prev_turf: null,
});

// camera.dm:390
rt.def("/obj/machinery/camera/portable/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.assembly.state = 0;
	this.assembly.anchored = 0;
	yield* this.assembly.update_icon();
	return f.dot;
}, true);

// camera.dm:396
rt.def("/obj/machinery/camera/portable/proc/process", function process(f: Frame) {
	if (!(GLOB.cameranet && rt.getStep(f, this, 0) != this.prev_turf)) return f.dot;
	GLOB.cameranet.updatePortableCamera(this);
	this.prev_turf = rt.getStep(f, this, 0);
	return f.dot;
}, false, { waitfor: false });

// camera.dm:401
rt.def("/obj/machinery/camera/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	if (this.view_range != this.short_range) return f.dot;
	yield* user.overlay_fullscreen("remote_view", T("/obj/screen/fullscreen/impaired"), 2);
	return f.dot;
}, true);

// camera.dm:405
rt.def("/obj/machinery/camera/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	user.see_invisible = 25;
	if (this.isXRay()) {
		(rt.modField(f, user, "sight", 28, rt.bitOr));
		user.see_in_dark = max(user.see_in_dark, 8);
	} else {
		user.sight = 0;
		user.see_in_dark = 2;
	}
	return 1;
});
