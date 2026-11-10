// Based on /tg/station's code/game/objects/items/devices/gps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// gps.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalGPS_list", function InitGlobalGPS_list(f: Frame) {
	GLOB.GPS_list = list();
	this.gvars_datum_init_order += "GPS_list";
	return f.dot;
});

rt.type(9232, "/obj/item/device/gps", "/obj/item/device", {
	gpstag: "COM0",
	emped: 0,
	locked_location: null,
	tracking: 1,
	updating: 1,
	global_mode: 1,
	name: "global positioning system",
	desc: "Helping lost spacemen find their way through the planets since 2016. Alt+click to toggle power.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "gps-c",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "materials=2;magnets=1;bluespace=2",
	unique_rename: 1,
});

// gps.dm:20
rt.def("/obj/item/device/gps/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	GLOB.GPS_list += this;
	this.name = `global positioning system (${this.gpstag})`;
	this.add_overlay("working");
	return f.dot;
}, true);

// gps.dm:26
rt.def("/obj/item/device/gps/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.GPS_list -= this;
	return (yield* parent_proc());
}, true);

// gps.dm:31
rt.def("/obj/item/device/gps/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	this.emped = 1;
	this.cut_overlay("working");
	this.add_overlay("emp");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/gps/proc/reboot"))), 300, 2);
	yield* GLOB.SStgui.close_uis(this);
	return f.dot;
}, true);

// gps.dm:38
rt.def("/obj/item/device/gps/proc/reboot", function reboot(f: Frame) {
	this.emped = 0;
	this.cut_overlay("emp");
	this.add_overlay("working");
	return f.dot;
});

// gps.dm:42
rt.def("/obj/item/device/gps/proc/AltClick", function AltClick(f: Frame, user: Value) {
	this.toggletracking(user);
	return f.dot;
});

// gps.dm:45
rt.def("/obj/item/device/gps/proc/toggletracking", function toggletracking(f: Frame, user: Value) {
	if (!user.canUseTopic(this, { be_close: 1 })) {
		return f.dot;
	}
	if (this.emped) {
		to_chat(user, "It's busted!");
		return f.dot;
	}
	if (this.tracking) {
		this.cut_overlay("working");
		to_chat(user, `${this} is no longer tracking, or visible to other GPS devices.`);
		this.tracking = 0;
	} else {
		this.add_overlay("working");
		to_chat(user, `${this} is now tracking, and visible to other GPS devices.`);
		this.tracking = 1;
	}
	return f.dot;
});

// gps.dm:62
rt.def("/obj/item/device/gps/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let gps_window_height: Value = null;
	ui_key ??= "gps";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (this.emped) {
		to_chat(user, `${this} fizzles weakly.`);
		return f.dot;
	}
	if (!(ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open)))) {
		gps_window_height = 300 + rt.len(f, GLOB.GPS_list) * 20;
		yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "gps", "Global Positioning System", 600, gps_window_height, master_ui, state))).open();
	}
	yield* ui.set_autoupdate({ state: this.updating });
	return f.dot;
}, true);

// gps.dm:74
rt.def("/obj/item/device/gps/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, gps: Value = null, G: Value = null, pos: Value = null, gps_area: Value = null, signal: Value = null, direction: Value = null;
	rt.setAt((data = list()), "power", this.tracking);
	rt.setAt(data, "tag", this.gpstag);
	rt.setAt(data, "updating", this.updating);
	rt.setAt(data, "globalmode", this.global_mode);
	if (!this.tracking || this.emped) {
		return data;
	}
	let curr: Value = rt.getStep(f, this, 0);
	rt.setAt(data, "current", `${get_area_name(curr)} (${curr.x}, ${curr.y}, ${curr.z})`);
	let signals: Value = list();
	rt.setAt(data, "signals", list());
	for (gps of each(GLOB.GPS_list)) {
		if ((G = gps).emped || !G.tracking || G == this) {
			continue;
		}
		pos = rt.getStep(f, G, 0);
		if (!this.global_mode && pos.z != curr.z) {
			continue;
		}
		gps_area = get_area_name(G);
		rt.setAt((signal = list()), "entrytag", G.gpstag);
		rt.setAt(signal, "area", format_text(gps_area));
		rt.setAt(signal, "coord", `${pos.x}, ${pos.y}, ${pos.z}`);
		if (pos.z == curr.z) {
			rt.setAt(signal, "dist", max(get_dist(curr, pos), 0));
			rt.setAt(signal, "degrees", round(Get_Angle(curr, pos)));
			if (!(direction = uppertext(dir2text(rt.getDir(f, curr, pos))))) {
				direction = "CENTER";
				rt.setAt(signal, "degrees", "N/A");
			}
			rt.setAt(signal, "direction", direction);
		}
		signals += list(signal);
	}
	rt.setAt(data, "signals", signals);
	return data;
});

// gps.dm:116
rt.def("/obj/item/device/gps/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let a: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "rename") {
		this.gpstag = (a = copytext(sanitize((a = (yield* g.op(f, "Prompt", [2], [null, this.gpstag, this.name, "Please enter desired tag.", null])))), 1, 20));
		f.dot = 1;
	} else if (action === "power") {
		this.toggletracking(f.usr);
		f.dot = 1;
	} else if (action === "updating") {
		this.updating = (!this.updating ? 1 : 0);
		f.dot = 1;
	} else if (action === "globalmode") {
		this.global_mode = (!this.global_mode ? 1 : 0);
		f.dot = 1;
	}
	return f.dot;
}, true);

// gps.dm:135
rt.def("/obj/item/device/gps/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let a: Value = null;
	yield* parent_proc();
	if (!rt.at(href_list, "tag")) return f.dot;
	a = uppertext(copytext(sanitize((a = (yield* g.op(f, "Prompt", [2], [null, this.gpstag, this.name, "Please enter desired tag.", null])))), 1, 5));
	if (!(get_dist(this, f.usr) <= 1)) return f.dot;
	this.gpstag = a;
	this.name = `global positioning system (${this.gpstag})`;
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);

rt.type(9247, "/obj/item/device/gps/visible_debug", "/obj/item/device/gps", {
	tagged: null,
	gpstag: "ADMIN",
	name: "visible GPS",
	desc: "This admin-spawn GPS unit leaves the coordinates visible on any turf that it passes over, for debugging. Especially useful for marking the area around the transition edges.",
});

// gps.dm:188
rt.def("/obj/item/device/gps/visible_debug/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.tagged = list();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSfastprocess.processing += this;
	return f.dot;
}, true);

// gps.dm:193
rt.def("/obj/item/device/gps/visible_debug/proc/process", function process(f: Frame) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) return f.dot;
	_T.color = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
	_T.maptext = `${_T.x},${_T.y},${_T.z}`;
	(rt.modSrcVar(f, "tagged", _T, rt.bitOr));
	return f.dot;
}, false, { waitfor: false });

// gps.dm:202
rt.def("/obj/item/device/gps/visible_debug/proc/clear", function clear(f: Frame) {
	let _T: Value = null;
	while (rt.len(f, this.tagged)) {
		(_T = pop(this.tagged)).color = rt.initial(f, _T, "color");
		_T.maptext = rt.initial(f, _T, "maptext");
	}
	return f.dot;
});

// gps.dm:209
rt.def("/obj/item/device/gps/visible_debug/proc/Destroy", function* Destroy(f: Frame) {
	if (this.tagged) {
		yield* g.srcCall(f, "clear");
	}
	this.tagged = null;
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
