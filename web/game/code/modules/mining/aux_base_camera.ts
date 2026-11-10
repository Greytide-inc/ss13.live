// Based on /tg/station's code/modules/mining/aux_base_camera.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(5104, "/mob/camera/aiEye/remote/base_construction", "/mob/camera/aiEye/remote", {
	starting_area: null,
	name: "construction holo-drone",
	move_on_shuttle: 1,
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "construction_drone",
});

// aux_base_camera.dm:10
rt.def("/mob/camera/aiEye/remote/base_construction/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.starting_area = get_area(this.loc);
	return f.dot;
}, true);

// aux_base_camera.dm:14
rt.def("/mob/camera/aiEye/remote/base_construction/proc/setLoc", function setLoc(f: Frame, t: Value) {
	let curr_area: Value = null;
	if (!((curr_area = get_area(t)) == this.starting_area || rt.istype(curr_area, T("/area/shuttle/auxillary_base")))) return f.dot;
	return parent_proc();
}, false);

// aux_base_camera.dm:20
rt.def("/mob/camera/aiEye/remote/base_construction/proc/relaymove", function* relaymove(f: Frame, user: Value, direct: Value) {
	this.dir = direct;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10352, "/obj/machinery/computer/camera_advanced/base_construction", "/obj/machinery/computer/camera_advanced", {
	RCD: null,
	switch_mode_action: null,
	build_action: null,
	airlock_mode_action: null,
	window_action: null,
	fan_action: null,
	fans_remaining: 0,
	turret_action: null,
	turret_stock: 0,
	found_aux_console: null,
	networks: null,
	off_action: null,
	jump_action: null,
	light_color: "#E17DE1",
	name: "base contruction console",
	desc: "An industrial computer integrated with a camera-assisted rapid construction drone.",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/base_construction"),
	icon_screen: "mining",
	icon_keyboard: "rd_key",
});

// aux_base_camera.dm:32
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.networks = list("SS13");

	this.off_action = (yield* new_(T("/datum/action/innate/camera_off/base_construction")));
	this.jump_action = null;

	this.switch_mode_action = (yield* new_(T("/datum/action/innate/aux_base/switch_mode")));

	this.build_action = (yield* new_(T("/datum/action/innate/aux_base/build")));

	this.airlock_mode_action = (yield* new_(T("/datum/action/innate/aux_base/airlock_type")));

	this.window_action = (yield* new_(T("/datum/action/innate/aux_base/window_type")));

	this.fan_action = (yield* new_(T("/datum/action/innate/aux_base/place_fan")));

	this.turret_action = (yield* new_(T("/datum/action/innate/aux_base/install_turret")));
	return f.dot;
}, true);

// aux_base_camera.dm:53
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.RCD = (yield* new_(T("/obj/item/weapon/construction/rcd/internal"), this));
	return f.dot;
}, true);

// aux_base_camera.dm:57
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!mapload) return f.dot;
	this.RCD.matter = this.RCD.max_matter;
	this.fans_remaining = 4;
	this.turret_stock = 4;
	return f.dot;
}, true);

// aux_base_camera.dm:66
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/CreateEye", function* CreateEye(f: Frame) {
	let spawn_spot: Value = null, ABC: Value = null;
	for (ABC of each(GLOB.machines, T("/obj/machinery/computer/auxillary_base"))) {
		if (rt.istype(get_area(ABC), T("/area/shuttle/auxillary_base"))) {
			this.found_aux_console = ABC;
			break;
		}
	}
	if (this.found_aux_console) {
		spawn_spot = this.found_aux_console;
	} else {
		spawn_spot = this;
	}
	this.eyeobj = (yield* new_(T("/mob/camera/aiEye/remote/base_construction"), rt.getStep(f, spawn_spot, 0)));
	this.eyeobj.origin = this;
	return f.dot;
}, true);

// aux_base_camera.dm:82
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/rcd_ammo")) || rt.istype(W, T("/obj/item/stack/sheet"))) {
		yield* this.RCD.attackby(W, user, params);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// aux_base_camera.dm:88
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.RCD);
	return (yield* parent_proc());
}, true);

// aux_base_camera.dm:92
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/GrantActions", function* GrantActions(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.switch_mode_action) {
		this.switch_mode_action.target = this;
		yield* this.switch_mode_action.Grant(user);
		this.actions += this.switch_mode_action;
	}
	if (this.build_action) {
		this.build_action.target = this;
		yield* this.build_action.Grant(user);
		this.actions += this.build_action;
	}
	if (this.airlock_mode_action) {
		this.airlock_mode_action.target = this;
		yield* this.airlock_mode_action.Grant(user);
		this.actions += this.airlock_mode_action;
	}
	if (this.window_action) {
		this.window_action.target = this;
		yield* this.window_action.Grant(user);
		this.actions += this.window_action;
	}
	if (this.fan_action) {
		this.fan_action.target = this;
		yield* this.fan_action.Grant(user);
		this.actions += this.fan_action;
	}
	if (this.turret_action) {
		this.turret_action.target = this;
		yield* this.turret_action.Grant(user);
		this.actions += this.turret_action;
	}
	this.eyeobj.invisibility = 0;
	return f.dot;
}, true);

// aux_base_camera.dm:127
rt.def("/obj/machinery/computer/camera_advanced/base_construction/proc/remove_eye_control", function* remove_eye_control(f: Frame, user: Value) {
	yield* parent_proc();
	this.eyeobj.invisibility = INVISIBILITY_MAXIMUM;
	return f.dot;
}, true);

rt.type(138, "/datum/action/innate/aux_base", "/datum/action/innate", {
	C: null,
	remote_eye: null,
	B: null,
});

// aux_base_camera.dm:136
rt.def("/datum/action/innate/aux_base/proc/Activate", function* Activate(f: Frame) {
	if (!this.target) {
		return 1;
	}
	this.C = this.owner;
	this.remote_eye = this.C.remote_control;
	this.B = this.target;
	if (this.B.RCD) return f.dot;
	this.B.RCD = (yield* new_(T("/obj/item/weapon/construction/rcd/internal"), this));
	return f.dot;
}, true);

// aux_base_camera.dm:146
rt.def("/datum/action/innate/aux_base/proc/check_spot", function check_spot(f: Frame) {
	let build_area: Value = null;
	let build_target: Value = rt.getStep(f, this.remote_eye, 0);
	if (!rt.istype((build_area = get_area(build_target)), T("/area/shuttle/auxillary_base"))) {
		to_chat(this.owner, "<span class='warning'>You can only build within the mining base!</span>");
		return 0;
	}
	if (build_target.z != ZLEVEL_STATION) {
		to_chat(this.owner, "<span class='warning'>The mining base has launched and can no longer be modified.</span>");
		return 0;
	}
	return 1;
});

rt.type(139, "/datum/action/innate/aux_base/build", "/datum/action/innate/aux_base", {
	name: "Build",
	button_icon_state: "build",
});

// aux_base_camera.dm:170
rt.def("/datum/action/innate/aux_base/build/proc/Activate", function* Activate(f: Frame) {
	let rcd_target: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.check_spot()) {
		return f.dot;
	}
	let target_turf: Value = rt.getStep(f, this.remote_eye, 0);
	if (!(rcd_target = rt.locateIn(f, T("/obj/machinery/door/airlock"), target_turf))) {
		rcd_target = rt.locateIn(f, T("/obj/structure"), target_turf);
	}
	if (!rcd_target || !rcd_target.anchored) {
		rcd_target = target_turf;
	}
	this.owner.changeNext_move(4);
	yield* this.B.RCD.afterattack(rcd_target, this.owner, 1);
	playsound(target_turf, rt.rsc("sound/items/deconstruct.ogg"), 60, 1);
	return f.dot;
}, true);

rt.type(140, "/datum/action/innate/aux_base/switch_mode", "/datum/action/innate/aux_base", {
	name: "Switch Mode",
	button_icon_state: "builder_mode",
});

// aux_base_camera.dm:198
rt.def("/datum/action/innate/aux_base/switch_mode/proc/Activate", function* Activate(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	let buildlist: Value = rt.alist(f, ["Walls and Floors", 1, "Airlocks", 2, "Deconstruction", 3, "Windows and Grilles", 4]);
	let buildmode: Value = (yield* g.op(f, "Prompt", [0], [null, null, "Base Console", "Set construction mode.", buildlist]));
	this.B.RCD.mode = rt.index(buildlist, buildmode);
	to_chat(this.owner, `Build mode is now ${buildmode}.`);
	return f.dot;
}, true);

rt.type(141, "/datum/action/innate/aux_base/airlock_type", "/datum/action/innate/aux_base", {
	name: "Select Airlock Type",
	button_icon_state: "airlock_select",
});

// aux_base_camera.dm:211
rt.def("/datum/action/innate/aux_base/airlock_type/proc/Activate", function* Activate(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.B.RCD.change_airlock_setting();
	return f.dot;
}, true);

rt.type(142, "/datum/action/innate/aux_base/window_type", "/datum/action/innate/aux_base", {
	name: "Select Window Type",
	button_icon_state: "window_select",
});

// aux_base_camera.dm:222
rt.def("/datum/action/innate/aux_base/window_type/proc/Activate", function* Activate(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	this.B.RCD.toggle_window_type();
	return f.dot;
}, true);

rt.type(143, "/datum/action/innate/aux_base/place_fan", "/datum/action/innate/aux_base", {
	name: "Place Tiny Fan",
	button_icon_state: "build_fan",
});

// aux_base_camera.dm:231
rt.def("/datum/action/innate/aux_base/place_fan/proc/Activate", function* Activate(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	let fan_turf: Value = rt.getStep(f, this.remote_eye, 0);
	if (!this.B.fans_remaining) {
		to_chat(this.owner, `<span class='warning'>${this.B} is out of fans!</span>`);
		return f.dot;
	}
	if (!this.check_spot()) {
		return f.dot;
	}
	if (fan_turf.density) {
		to_chat(this.owner, "<span class='warning'>Fans may only be placed on a floor.</span>");
		return f.dot;
	}
	yield* new_(T("/obj/structure/fans/tiny"), fan_turf);
	this.B.fans_remaining--;
	to_chat(this.owner, `<span class='notice'>Tiny fan placed. ${this.B.fans_remaining} remaining.</span>`);
	playsound(fan_turf, rt.rsc("sound/machines/click.ogg"), 50, 1);
	return f.dot;
}, true);

rt.type(144, "/datum/action/innate/aux_base/install_turret", "/datum/action/innate/aux_base", {
	name: "Install Plasma Anti-Wildlife Turret",
	button_icon_state: "build_turret",
});

// aux_base_camera.dm:257
rt.def("/datum/action/innate/aux_base/install_turret/proc/Activate", function* Activate(f: Frame) {
	let turret_turf: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.check_spot()) {
		return f.dot;
	}
	if (!this.B.turret_stock) {
		to_chat(this.owner, "<span class='warning'>Unable to construct additional turrets.</span>");
		return f.dot;
	}
	if (is_blocked_turf((turret_turf = rt.getStep(f, this.remote_eye, 0)))) {
		to_chat(this.owner, "<span class='warning'>Location is obtructed by something. Please clear the location and try again.</span>");
		return f.dot;
	}
	let _T: Value = (yield* new_(T("/obj/machinery/porta_turret/aux_base"), turret_turf));
	if (this.B.found_aux_console) {
		this.B.found_aux_console.turrets += _T;
	}
	this.B.turret_stock--;
	to_chat(this.owner, "<span class='notice'>Turret installation complete!</span>");
	playsound(turret_turf, rt.rsc("sound/items/drill_use.ogg"), 65, 1);
	return f.dot;
}, true);
