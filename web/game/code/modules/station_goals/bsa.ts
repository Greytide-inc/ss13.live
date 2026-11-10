// Based on /tg/station's code/modules/station_goals/bsa.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(4202, "/datum/station_goal/bluespace_cannon", "/datum/station_goal", {
	name: "Bluespace Artillery",
});

// bsa.dm:9
rt.def("/datum/station_goal/bluespace_cannon/proc/get_report", function get_report(f: Frame) {
	return `Our military presence is inadequate in your sector.\n\t We need you to construct BSA-${rand(1, 99)} Artillery position aboard your station.\n\n\t Base parts are available for shipping via cargo.\n\t -Nanotrasen Naval Command`;
});

// bsa.dm:17
rt.def("/datum/station_goal/bluespace_cannon/proc/on_report", function on_report(f: Frame) {
	let _P: Value = null;
	(_P = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/misc/bsa"))).special_enabled = 1;
	return f.dot;
});

// bsa.dm:21
rt.def("/datum/station_goal/bluespace_cannon/proc/check_completion", function check_completion(f: Frame) {
	let B: Value = null;
	if (parent_proc()) {
		return 1;
	}
	if ((B = rt.locateIn(f, T("/obj/machinery/bsa/full"), rt.world())) && !B.stat) {
		return 1;
	}
	return 0;
});

rt.type(10991, "/obj/machinery/bsa/back", "/obj/machinery/bsa", {
	name: "Bluespace Artillery Generator",
	desc: "Generates cannon pulse. Needs to be linked with a fusor. ",
	icon_state: "power_box",
});

// bsa.dm:39
rt.def("/obj/machinery/bsa/back/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		(M = W).buffer = this;
		to_chat(user, `<span class='notice'>You store linkage information in ${W}'s buffer.</span>`);
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 10);
		return 1;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10992, "/obj/machinery/bsa/front", "/obj/machinery/bsa", {
	name: "Bluespace Artillery Bore",
	desc: "Do not stand in front of cannon during operation. Needs to be linked with a fusor.",
	icon_state: "emitter_center",
});

// bsa.dm:55
rt.def("/obj/machinery/bsa/front/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		(M = W).buffer = this;
		to_chat(user, `<span class='notice'>You store linkage information in ${W}'s buffer.</span>`);
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 10);
		return 1;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(10993, "/obj/machinery/bsa/middle", "/obj/machinery/bsa", {
	back: null,
	front: null,
	name: "Bluespace Artillery Fusor",
	desc: "Contents classifed by Nanotrasen Naval Command. Needs to be linked with the other BSA parts using multitool.",
	icon_state: "fuel_chamber",
});

// bsa.dm:73
rt.def("/obj/machinery/bsa/middle/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if ((M = W).buffer) {
			if (rt.istype(M.buffer, T("/obj/machinery/bsa/back"))) {
				this.back = M.buffer;
				M.buffer = null;
				to_chat(user, `<span class='notice'>You link ${this} with ${this.back}.</span>`);
			} else if (rt.istype(M.buffer, T("/obj/machinery/bsa/front"))) {
				this.front = M.buffer;
				M.buffer = null;
				to_chat(user, `<span class='notice'>You link ${this} with ${this.front}.</span>`);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, W, 10);
		return 1;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// bsa.dm:91
rt.def("/obj/machinery/bsa/middle/proc/check_completion", function check_completion(f: Frame) {
	if (!this.front || !this.back) {
		return "No linked parts detected!";
	}
	if (!this.front.anchored || !this.back.anchored || !this.anchored) {
		return "Linked parts unwrenched!";
	}
	if (this.front.y != this.y || this.back.y != this.y || !(this.front.x > this.x && this.back.x < this.x || this.front.x < this.x && this.back.x > this.x) || this.front.z != this.z || this.back.z != this.z) {
		return "Parts misaligned!";
	}
	if (this.has_space()) return f.dot;
	return "Not enough free space!";
});

// bsa.dm:101
rt.def("/obj/machinery/bsa/middle/proc/has_space", function has_space(f: Frame) {
	let x_min: Value = null, x_max: Value = null, _T: Value = null;
	let $e: any;
	let cannon_dir: Value = this.get_cannon_direction();
	if (cannon_dir === 4) {
		x_min = this.x - 4;
		x_max = this.x + 6;
	} else if (cannon_dir === 8) {
		x_min = this.x + 4;
		x_max = this.x - 6;
	}
	for (_T of each(block(rt.locate(x_min, this.y - 1, this.z), rt.locate(x_max, this.y + 1, this.z)), T("/turf"))) {
		if (_T.density || rt.istype(_T, T("/turf/open/space"))) {
			return 0;
		}
	}
	return 1;
});

// bsa.dm:118
rt.def("/obj/machinery/bsa/middle/proc/get_cannon_direction", function get_cannon_direction(f: Frame) {
	if (this.front.x > this.x && this.back.x < this.x) {
		return 4;
	} else {
		if (!(this.front.x < this.x && this.back.x > this.x)) return f.dot;
		return 8;
	}
});

rt.type(10994, "/obj/machinery/bsa/full", "/obj/machinery/bsa", {
	ex_power: 3,
	power_used_per_shot: 2000000,
	ready: null,
	unsecuring_tool: null,
	name: "Bluespace Artillery",
	desc: "Long range bluespace artillery.",
	icon: rt.rsc("icons/obj/lavaland/cannon.dmi"),
	icon_state: "orbital_cannon1",
	pixel_y: -32,
	pixel_x: -192,
	bound_width: 352,
	bound_x: -192,
	appearance_flags: 0,
}, { global: { top_layer: 770 } });

// bsa.dm:141
rt.def("/obj/machinery/bsa/full/proc/get_front_turf", function get_front_turf(f: Frame) {
	if (this.dir === 8) {
		return rt.locate(this.x - 6, this.y, this.z);
	} else if (this.dir === 4) {
		return rt.locate(this.x + 4, this.y, this.z);
	}
	return rt.getStep(f, this, 0);
});

// bsa.dm:157
rt.def("/obj/machinery/bsa/full/proc/get_target_turf", function get_target_turf(f: Frame) {
	if (this.dir === 8) {
		return rt.locate(1, this.y, this.z);
	} else if (this.dir === 4) {
		return rt.locate(rt.world().maxx, this.y, this.z);
	}
	return rt.getStep(f, this, 0);
});

// bsa.dm:165
rt.def("/obj/machinery/bsa/full/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 8;
	}
	f.dot = (yield* parent_proc());
	GLOB.top_layer = (GLOB.top_layer || (yield* mutable_appearance(this.icon, { layer: ABOVE_MOB_LAYER })));
	const subject = f.args[1];
	if (subject === 8) {
		this.dir = 8;
		this.pixel_x = -192;
		GLOB.top_layer.icon_state = "top_west";
		this.icon_state = "cannon_west";
	} else if (subject === 4) {
		this.dir = 4;
		GLOB.top_layer.icon_state = "top_east";
		this.icon_state = "cannon_east";
	}
	this.add_overlay(GLOB.top_layer);
	yield* this.reload();
	return f.dot;
}, true, { args: ["mapload", "cannon_direction"] });

// bsa.dm:181
rt.def("/obj/machinery/bsa/full/proc/fire", function* fire(f: Frame, user: Value, bullseye: Value) {
	let _T: Value = null;
	let point: Value = this.get_front_turf();
	for (_T of each(getline(rt.getStep(f, point, this.dir), this.get_target_turf()), T("/turf"))) {
		yield* _T.ex_act(1);
	}
	yield* point.Beam(this.get_target_turf(), { icon_state: "bsa_beam", time: 50, maxdistance: rt.world().maxx });
	message_admins(`${key_name_admin(user)} has launched an artillery strike.`);
	yield* explosion(bullseye, this.ex_power, this.ex_power * 2, this.ex_power * 4);
	yield* this.reload();
	return f.dot;
}, true);

// bsa.dm:193
rt.def("/obj/machinery/bsa/full/proc/reload", function* reload(f: Frame) {
	this.ready = 0;
	yield* this.use_power(this.power_used_per_shot);
	yield* addtimer((yield* new_(T("/datum/callback"), this, "ready_cannon")), 600);
	return f.dot;
}, true);

rt.type(6785, "/obj/item/weapon/circuitboard/machine/bsa/back", "/obj/item/weapon/circuitboard/machine/bsa", {
	name: "Bluespace Artillery Generator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/bsa/back"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// bsa.dm:213
rt.def("/obj/item/weapon/circuitboard/machine/bsa/back/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor/quadratic"), 5, T("/obj/item/stack/cable_coil"), 2]);
	return f.dot;
});

rt.type(6786, "/obj/item/weapon/circuitboard/machine/bsa/middle", "/obj/item/weapon/circuitboard/machine/bsa", {
	name: "Bluespace Artillery Fusor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/bsa/middle"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// bsa.dm:221
rt.def("/obj/item/weapon/circuitboard/machine/bsa/middle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 20, T("/obj/item/stack/cable_coil"), 2]);
	return f.dot;
});

rt.type(6787, "/obj/item/weapon/circuitboard/machine/bsa/front", "/obj/item/weapon/circuitboard/machine/bsa", {
	name: "Bluespace Artillery Bore (Machine Board)",
	build_path: rt.typePath("/obj/machinery/bsa/front"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// bsa.dm:229
rt.def("/obj/item/weapon/circuitboard/machine/bsa/front/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator/femto"), 5, T("/obj/item/stack/cable_coil"), 2]);
	return f.dot;
});

rt.type(10434, "/obj/machinery/computer/bsa_control", "/obj/machinery/computer", {
	cannon: null,
	notice: null,
	target: null,
	area_aim: 0,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/bsa_control"),
	name: "Bluespace Artillery Control",
	use_power: 0,
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "control_boxp",
});

// bsa.dm:251
rt.def("/obj/machinery/computer/bsa_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "bsa", this.name, 400, 305, master_ui, state))).open();
	return f.dot;
}, true);

// bsa.dm:257
rt.def("/obj/machinery/computer/bsa_control/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any = (data = list());
	let $1: any = "ready";
	rt.setAt($0, $1, this.cannon ? this.cannon.ready : 0);
	rt.setAt(data, "connected", this.cannon);
	rt.setAt(data, "notice", this.notice);
	rt.setAt(data, "unlocked", GLOB.bsa_unlock);
	if (this.target) {
		rt.setAt(data, "target", this.get_target_name());
	}
	return data;
});

// bsa.dm:267
rt.def("/obj/machinery/computer/bsa_control/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "build") {
		this.cannon = (yield* this.deploy());
		f.dot = 1;
	} else if (action === "fire") {
		yield* this.fire(f.usr);
		f.dot = 1;
	} else if (action === "recalibrate") {
		yield* this.calibrate(f.usr);
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// bsa.dm:282
rt.def("/obj/machinery/computer/bsa_control/proc/calibrate", function* calibrate(f: Frame, user: Value) {
	let G: Value = null;
	let gps_locators: Value = list();
	for (G of each(GLOB.GPS_list, T("/obj/item/device/gps"))) {
		rt.setAt(gps_locators, G.gpstag, G);
	}
	let options: Value = gps_locators;
	if (this.area_aim) {
		options += GLOB.teleportlocs;
	}
	let V: Value = (yield* g.op(f, "Prompt", [0], [null, "Select target", "Select target", user, rt.bitOr(options, null)]));
	this.target = rt.index(options, V);
	return f.dot;
}, true);

// bsa.dm:294
rt.def("/obj/machinery/computer/bsa_control/proc/get_target_name", function get_target_name(f: Frame) {
	let A: Value = null, G: Value = null;
	if (rt.istype(this.target, T("/area"))) {
		return (A = this.target).name;
	} else {
		if (!rt.istype(this.target, T("/obj/item/device/gps"))) return f.dot;
		return (G = this.target).gpstag;
	}
});

// bsa.dm:302
rt.def("/obj/machinery/computer/bsa_control/proc/get_impact_turf", function get_impact_turf(f: Frame) {
	if (rt.istype(this.target, T("/area"))) {
		return pick(get_area_turfs(this.target));
	}
	if (!rt.istype(this.target, T("/obj/item/device/gps"))) return f.dot;
	return rt.getStep(f, this.target, 0);
});

// bsa.dm:308
rt.def("/obj/machinery/computer/bsa_control/proc/fire", function* fire(f: Frame, user: Value) {
	if (this.cannon.stat) {
		this.notice = "Cannon unpowered!";
		return f.dot;
	}
	this.notice = null;
	yield* this.cannon.fire(user, this.get_impact_turf());
	return f.dot;
}, true);

// bsa.dm:315
rt.def("/obj/machinery/computer/bsa_control/proc/deploy", function* deploy(f: Frame, force: Value) {
	let prebuilt: Value = null, centerpiece: Value = null, s: Value = null;
	force ??= 0;
	if (prebuilt = rt.locateIn(f, T("/obj/machinery/bsa/full"), range(7))) {
		return prebuilt;
	}
	if (!(centerpiece = rt.locateIn(f, T("/obj/machinery/bsa/middle"), range(7)))) {
		this.notice = "No BSA parts detected nearby.";
		return null;
	}
	this.notice = centerpiece.check_completion();
	if (this.notice) {
		return null;
	}
	yield* (s = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(4, rt.getStep(f, centerpiece, 0));
	yield* s.start();
	let cannon: Value = (yield* new_(T("/obj/machinery/bsa/full"), rt.getStep(f, centerpiece, 0), centerpiece.get_cannon_direction()));
	yield* qdel(centerpiece.front);
	yield* qdel(centerpiece.back);
	yield* qdel(centerpiece);
	return cannon;
}, true);
