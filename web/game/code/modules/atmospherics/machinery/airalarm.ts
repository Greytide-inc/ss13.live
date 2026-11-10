// Based on /tg/station's code/modules/atmospherics/machinery/airalarm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


rt.type(1865, "/datum/tlv", "/datum", {
	min2: null,
	min1: null,
	max1: null,
	max2: null,
});

// airalarm.dm:14
rt.def("/datum/tlv/proc/get_danger_level", function get_danger_level(f: Frame, val: Value) {
	if (this.max2 != -1 && val >= this.max2) {
		return 2;
	}
	if (this.min2 != -1 && val <= this.min2) {
		return 2;
	}
	if (this.max1 != -1 && val >= this.max1) {
		return 1;
	}
	if (this.min1 != -1 && val <= this.min1) {
		return 1;
	}
	return 0;
});

rt.type(10880, "/obj/machinery/airalarm", "/obj/machinery", {
	danger_level: 0,
	mode: 1,
	locked: 1,
	aidisabled: 0,
	shorted: 0,
	buildstage: 2,
	frequency: 1439,
	alarm_frequency: 1437,
	radio_connection: null,
	TLV: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 4,
	active_power_usage: 8,
	power_channel: 3,
	name: "air alarm",
	desc: "A machine that monitors atmosphere levels. Goes off if the area is dangerous.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "alarm0",
	req_access: null,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 80,
	armor: null,
	resistance_flags: 2,
});

// airalarm.dm:76
rt.def("/obj/machinery/airalarm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.TLV = rt.alist(f, ["pressure", new_(T("/datum/tlv"), 81.06, 91.1925, 111.4575, 121.590004), "temperature", new_(T("/datum/tlv"), 273.15, 283.15, 313.15, 339.15), "o2", new_(T("/datum/tlv"), 16, 19, 135, 140), "n2", new_(T("/datum/tlv"), -1, -1, 1000, 1000), "co2", new_(T("/datum/tlv"), -1, -1, 5, 10), "plasma", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "n2o", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "bz", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "freon", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "water_vapor", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5)]);

	this.req_access = list(24);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]);
	return f.dot;
});

rt.type(10881, "/obj/machinery/airalarm/server", "/obj/machinery/airalarm", {
	TLV: null,
});

// airalarm.dm:90
rt.def("/obj/machinery/airalarm/server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.TLV = rt.alist(f, ["pressure", new_(T("/datum/tlv"), -1, -1, -1, -1), "temperature", new_(T("/datum/tlv"), -1, -1, -1, -1), "o2", new_(T("/datum/tlv"), -1, -1, -1, -1), "n2", new_(T("/datum/tlv"), -1, -1, -1, -1), "co2", new_(T("/datum/tlv"), -1, -1, -1, -1), "plasma", new_(T("/datum/tlv"), -1, -1, -1, -1), "n2o", new_(T("/datum/tlv"), -1, -1, -1, -1), "bz", new_(T("/datum/tlv"), -1, -1, -1, -1), "freon", new_(T("/datum/tlv"), -1, -1, -1, -1), "water_vapor", new_(T("/datum/tlv"), -1, -1, -1, -1)]);
	return f.dot;
});

rt.type(10882, "/obj/machinery/airalarm/kitchen_cold_room", "/obj/machinery/airalarm", {
	TLV: null,
});

// airalarm.dm:104
rt.def("/obj/machinery/airalarm/kitchen_cold_room/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.TLV = rt.alist(f, ["pressure", new_(T("/datum/tlv"), 81.06, 91.1925, 111.4575, 121.590004), "temperature", new_(T("/datum/tlv"), 200, 210, 273.15, 283.15), "o2", new_(T("/datum/tlv"), 16, 19, 135, 140), "n2", new_(T("/datum/tlv"), -1, -1, 1000, 1000), "co2", new_(T("/datum/tlv"), -1, -1, 5, 10), "plasma", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "n2o", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "bz", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "freon", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5), "water_vapor", new_(T("/datum/tlv"), -1, -1, 0.2, 0.5)]);
	return f.dot;
});

rt.type(13074, "/area", "/atom", {
	map_name: null,
	valid_territory: 1,
	blob_allowed: 1,
	eject: null,
	fire: null,
	atmos: 1,
	atmosalm: 0,
	poweralm: 1,
	party: null,
	lightswitch: 1,
	requires_power: 1,
	always_unpowered: 0,
	outdoors: 0,
	power_equip: 1,
	power_light: 1,
	power_environ: 1,
	music: null,
	used_equip: 0,
	used_light: 0,
	used_environ: 0,
	static_equip: null,
	static_light: 0,
	static_environ: null,
	has_gravity: 0,
	noteleport: 0,
	hidden: 0,
	safe: 0,
	no_air: null,
	related: null,
	parallax_movedir: 0,
	uid: null,
	ambientsounds: null,
	firedoors: null,
	firedoors_last_closed_on: 0,
	air_vent_names: null,
	air_scrub_names: null,
	air_vent_info: null,
	air_scrub_info: null,
	dynamic_lighting: 1,
	level: null,
	flags: 4,
	layer: 1,
	luminosity: 1,
	name: "Space",
	icon: rt.rsc("icons/turf/areas.dmi"),
	icon_state: "unknown",
	mouse_opacity: 0,
	invisibility: 20,
}, { global: { global_uid: 812 } });

// airalarm.dm:119
rt.def("/area/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambigen1.ogg"), rt.rsc("sound/ambience/ambigen3.ogg"), rt.rsc("sound/ambience/ambigen4.ogg"), rt.rsc("sound/ambience/ambigen5.ogg"), rt.rsc("sound/ambience/ambigen6.ogg"), rt.rsc("sound/ambience/ambigen7.ogg"), rt.rsc("sound/ambience/ambigen8.ogg"), rt.rsc("sound/ambience/ambigen9.ogg"), rt.rsc("sound/ambience/ambigen10.ogg"), rt.rsc("sound/ambience/ambigen11.ogg"), rt.rsc("sound/ambience/ambigen12.ogg"), rt.rsc("sound/ambience/ambigen14.ogg"));

	this.air_vent_names = list();

	this.air_scrub_names = list();

	this.air_vent_info = list();

	this.air_scrub_info = list();
	return f.dot;
});

// airalarm.dm:125
rt.def("/obj/machinery/airalarm/proc/New", function* New(f: Frame, loc: Value, ndir: Value, nbuild: Value) {
	let $0: any;
	yield* parent_proc();
	this.wires = (yield* new_(T("/datum/wires/airalarm"), this));
	if (ndir) {
		yield* this.setDir(ndir);
	}
	if (nbuild) {
		this.buildstage = 0;
		this.panel_open = 1;
		if (rt.bitAnd(this.dir, 3)) {
			$0 = 0;
		} else if (this.dir == 4) {
			$0 = -24;
		} else {
			$0 = 24;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(this.dir, 3)) {
			if (this.dir == 1) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
	}
	let A: Value = get_area(this);
	if (this.name == rt.initial(f, this, "name")) {
		this.name = `${A.name} Air Alarm`;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// airalarm.dm:144
rt.def("/obj/machinery/airalarm/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	yield* qdel(this.wires);
	this.wires = null;
	return (yield* parent_proc());
}, true);

// airalarm.dm:150
rt.def("/obj/machinery/airalarm/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// airalarm.dm:154
rt.def("/obj/machinery/airalarm/proc/ui_status", function ui_status(f: Frame, user: Value) {
	if (user.has_unlimited_silicon_privilege && this.aidisabled) {
		to_chat(user, "AI control has been disabled.");
	} else if (!this.shorted) {
		return parent_proc();
	}
	return UI_CLOSE;
}, false);

// airalarm.dm:162
rt.def("/obj/machinery/airalarm/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "airalarm", this.name, 440, 650, master_ui, state))).open();
	return f.dot;
}, true);

// airalarm.dm:168
rt.def("/obj/machinery/airalarm/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let gas_id: Value = null, id_tag: Value = null, long_name: Value = null, info: Value = null, selected: Value = null, thresholds: Value = null, gas_id_11: Value = null;
	let data: Value = rt.alist(f, ["locked", this.locked, "siliconUser", user.has_unlimited_silicon_privilege, "emagged", this.emagged, "danger_level", this.danger_level]);
	let A: Value = get_area(this);
	rt.setAt(data, "atmos_alarm", A.atmosalm);
	rt.setAt(data, "fire_alarm", A.fire);
	let _T: Value = rt.getStep(f, this, 0);
	let environment: Value = _T.return_air();
	rt.setAt(data, "environment_data", list());
	let pressure: Value = environment.return_pressure();
	let cur_tlv: Value = rt.at(this.TLV, "pressure");
	rt.modAt(data, "environment_data", list(rt.alist(f, ["name", "Pressure", "value", pressure, "unit", "kPa", "danger_level", cur_tlv.get_danger_level(pressure)])), add);
	let temperature: Value = environment.temperature;
	cur_tlv = rt.at(this.TLV, "temperature");
	rt.modAt(data, "environment_data", list(rt.alist(f, ["name", "Temperature", "value", temperature, "unit", `K (${round(temperature - T0C, 0.1)}C)`, "danger_level", cur_tlv.get_danger_level(temperature)])), add);
	let total_moles: Value = environment.total_moles();
	let partial_pressure: Value = R_IDEAL_GAS_EQUATION * environment.temperature / environment.volume;
	for (gas_id of each(environment.gases)) {
		if (!rt.isIn(f, gas_id, this.TLV)) {
			continue;
		}
		cur_tlv = rt.index(this.TLV, gas_id);
		rt.modAt(data, "environment_data", list(rt.alist(f, ["name", rt.index(rt.index(rt.index(environment.gases, gas_id), 3), 2), "value", rt.index(rt.index(environment.gases, gas_id), 1) / total_moles * 100, "unit", "%", "danger_level", cur_tlv.get_danger_level(rt.index(rt.index(environment.gases, gas_id), 1) * partial_pressure)])), add);
	}
	if (!this.locked || user.has_unlimited_silicon_privilege) {
		rt.setAt(data, "vents", list());
		for (id_tag of each(A.air_vent_names)) {
			long_name = rt.index(A.air_vent_names, id_tag);
			if (!(info = rt.index(A.air_vent_info, id_tag)) || rt.at(info, "frequency") != this.frequency) {
				continue;
			}
			rt.modAt(data, "vents", list(rt.alist(f, ["id_tag", id_tag, "long_name", sanitize(long_name), "power", rt.at(info, "power"), "checks", rt.at(info, "checks"), "excheck", rt.bitAnd(rt.at(info, "checks"), 1), "incheck", rt.bitAnd(rt.at(info, "checks"), 2), "direction", rt.at(info, "direction"), "external", rt.at(info, "external"), "extdefault", (rt.at(info, "external") == ONE_ATMOSPHERE ? 1 : 0)])), add);
		}
		rt.setAt(data, "scrubbers", list());
		id_tag = null;
		for (id_tag of each(A.air_scrub_names)) {
			long_name = rt.index(A.air_scrub_names, id_tag);
			if (!(info = rt.index(A.air_scrub_info, id_tag)) || rt.at(info, "frequency") != this.frequency) {
				continue;
			}
			rt.modAt(data, "scrubbers", list(rt.alist(f, ["id_tag", id_tag, "long_name", sanitize(long_name), "power", rt.at(info, "power"), "scrubbing", rt.at(info, "scrubbing"), "widenet", rt.at(info, "widenet"), "filter_co2", rt.at(info, "filter_co2"), "filter_toxins", rt.at(info, "filter_toxins"), "filter_n2o", rt.at(info, "filter_n2o"), "filter_bz", rt.at(info, "filter_bz"), "filter_freon", rt.at(info, "filter_freon"), "filter_water_vapor", rt.at(info, "filter_water_vapor")])), add);
		}
		rt.setAt(data, "mode", this.mode);
		rt.setAt(data, "modes", list());
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Filtering - Scrubs out contaminants", "mode", 1, "selected", (this.mode == 1 ? 1 : 0), "danger", 0])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Contaminated - Scrubs out ALL contaminants quickly", "mode", AALARM_MODE_CONTAMINATED, "selected", (this.mode == AALARM_MODE_CONTAMINATED ? 1 : 0), "danger", 0])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Draught - Siphons out air while replacing", "mode", AALARM_MODE_VENTING, "selected", (this.mode == AALARM_MODE_VENTING ? 1 : 0), "danger", 0])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Refill - Triple vent output", "mode", AALARM_MODE_REFILL, "selected", (this.mode == AALARM_MODE_REFILL ? 1 : 0), "danger", 1])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Cycle - Siphons air before replacing", "mode", AALARM_MODE_REPLACEMENT, "selected", (this.mode == AALARM_MODE_REPLACEMENT ? 1 : 0), "danger", 1])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Siphon - Siphons air out of the room", "mode", AALARM_MODE_SIPHON, "selected", (this.mode == AALARM_MODE_SIPHON ? 1 : 0), "danger", 1])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Panic Siphon - Siphons air out of the room quickly", "mode", AALARM_MODE_PANIC, "selected", (this.mode == AALARM_MODE_PANIC ? 1 : 0), "danger", 1])), add);
		rt.modAt(data, "modes", list(rt.alist(f, ["name", "Off - Shuts off vents and scrubbers", "mode", AALARM_MODE_OFF, "selected", (this.mode == AALARM_MODE_OFF ? 1 : 0), "danger", 0])), add);
		if (this.emagged) {
			rt.modAt(data, "modes", list(rt.alist(f, ["name", "Flood - Shuts off scrubbers and opens vents", "mode", AALARM_MODE_FLOOD, "selected", (this.mode == AALARM_MODE_FLOOD ? 1 : 0), "danger", 1])), add);
		}
		thresholds = list();
		selected = rt.at(this.TLV, "pressure");
		rt.modAt(rt.index((thresholds += list(rt.alist(f, ["name", "Pressure", "settings", list()]))), rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "pressure", "val", "min2", "selected", selected.min2])), add);
		rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "pressure", "val", "min1", "selected", selected.min1])), add);
		rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "pressure", "val", "max1", "selected", selected.max1])), add);
		rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "pressure", "val", "max2", "selected", selected.max2])), add);
		selected = rt.at(this.TLV, "temperature");
		rt.modAt(rt.index((thresholds += list(rt.alist(f, ["name", "Temperature", "settings", list()]))), rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "temperature", "val", "min2", "selected", selected.min2])), add);
		rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "temperature", "val", "min1", "selected", selected.min1])), add);
		rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "temperature", "val", "max1", "selected", selected.max1])), add);
		rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", "temperature", "val", "max2", "selected", selected.max2])), add);
		for (gas_id_11 of each(GLOB.meta_gas_info)) {
			if (!rt.isIn(f, gas_id_11, this.TLV)) {
				continue;
			}
			selected = rt.index(this.TLV, gas_id_11);
			rt.modAt(rt.index((thresholds += list(rt.alist(f, ["name", rt.index(rt.index(GLOB.meta_gas_info, gas_id_11), 2), "settings", list()]))), rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", gas_id_11, "val", "min2", "selected", selected.min2])), add);
			rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", gas_id_11, "val", "min1", "selected", selected.min1])), add);
			rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", gas_id_11, "val", "max1", "selected", selected.max1])), add);
			rt.modAt(rt.index(thresholds, rt.len(f, thresholds)), "settings", list(rt.alist(f, ["env", gas_id_11, "val", "max2", "selected", selected.max2])), add);
		}
		rt.setAt(data, "thresholds", thresholds);
	}
	return data;
});

// airalarm.dm:294
rt.def("/obj/machinery/airalarm/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let A: Value = null, target: Value = null, env: Value = null, name: Value = null, tlv: Value = null, value: Value = null;
	if ((yield* parent_proc()) || this.buildstage != 2) {
		return f.dot;
	}
	if (this.locked && !f.usr.has_unlimited_silicon_privilege || f.usr.has_unlimited_silicon_privilege && this.aidisabled) {
		return f.dot;
	}
	let device_id: Value = rt.at(params, "id_tag");
	if (action === "lock") {
		if (f.usr.has_unlimited_silicon_privilege && !this.wires.is_cut("ID Scan")) {
			this.locked = (!this.locked ? 1 : 0);
			f.dot = 1;
		}
	} else if (action === "power" || action === "co2_scrub" || action === "tox_scrub" || action === "n2o_scrub" || action === "bz_scrub" || action === "freon_scrub" || action === "water_vapor_scrub" || action === "widenet" || action === "scrubbing") {
		yield* this.send_signal(device_id, rt.alist(f, [`${action}`, text2num(rt.at(params, "val"))]));
		f.dot = 1;
	} else if (action === "excheck") {
		yield* this.send_signal(device_id, rt.alist(f, ["checks", rt.bitXor(text2num(rt.at(params, "val")), 1)]));
		f.dot = 1;
	} else if (action === "incheck") {
		yield* this.send_signal(device_id, rt.alist(f, ["checks", rt.bitXor(text2num(rt.at(params, "val")), 2)]));
		f.dot = 1;
	} else if (action === "set_external_pressure") {
		A = get_area(this);
		if ((target = (yield* g.op(f, "Prompt", [33], [null, rt.index(rt.index(A.air_vent_info, device_id), "external"), this.name, "New target pressure:", null]))) !== null && !(yield* parent_proc())) {
			yield* this.send_signal(device_id, rt.alist(f, ["set_external_pressure", target]));
			f.dot = 1;
		}
	} else if (action === "reset_external_pressure") {
		yield* this.send_signal(device_id, list("reset_external_pressure"));
		f.dot = 1;
	} else if (action === "threshold") {
		env = rt.at(params, "env");
		name = rt.at(params, "var");
		if ((tlv = rt.index(this.TLV, env)) === null) {
			return f.dot;
		}
		if ((value = (yield* g.op(f, "Prompt", [33], [null, rt.index(tlv.vars, name), name, `New ${name} for ${env}:`, null]))) !== null && !(yield* parent_proc())) {
			if (value < 0) {
				rt.setAt(tlv.vars, name, -1);
			} else {
				rt.setAt(tlv.vars, name, round(value, 0.01));
			}
			f.dot = 1;
		}
	} else if (action === "mode") {
		this.mode = text2num(rt.at(params, "mode"));
		yield* this.apply_mode();
		f.dot = 1;
	} else if (action === "alarm") {
		if ((A = get_area(this)).atmosalert(2, this)) {
			yield* this.post_alert(2);
		}
		f.dot = 1;
	} else if (action === "reset") {
		if ((A = get_area(this)).atmosalert(0, this)) {
			yield* this.post_alert(0);
		}
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// airalarm.dm:353
rt.def("/obj/machinery/airalarm/proc/reset", function reset(f: Frame, wire: Value) {
	if (wire === "Power") {
		if (!this.wires.is_cut("Power")) {
			this.shorted = 0;
			this.update_icon();
		}
	} else if (wire === "AI Connection") {
		if (this.wires.is_cut("AI Connection")) return f.dot;
		this.aidisabled = 0;
	}
	return f.dot;
});

// airalarm.dm:364
rt.def("/obj/machinery/airalarm/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let s: Value = null;
	if (rt.bitAnd(this.stat, 2)) {
		return 0;
	}
	if (!prob(prb)) {
		return 0;
	}
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 1, this);
	yield* s.start();
	if (yield* electrocute_mob(user, get_area(this), this, 1, 1)) {
		return 1;
	} else {
		return 0;
	}
}, true);

// airalarm.dm:390
rt.def("/obj/machinery/airalarm/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_TO_AIRALARM);
	return f.dot;
}, true);

// airalarm.dm:395
rt.def("/obj/machinery/airalarm/proc/send_signal", function* send_signal(f: Frame, target: Value, command: Value) {
	let signal: Value = null;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	signal.data = command;
	rt.setAt(signal.data, "tag", target);
	rt.setAt(signal.data, "sigtype", "command");
	yield* this.radio_connection.post_signal(this, signal, GLOB.RADIO_FROM_AIRALARM);
	return 1;
}, true);

// airalarm.dm:412
rt.def("/obj/machinery/airalarm/proc/apply_mode", function* apply_mode(f: Frame) {
	let device_id: Value = null;
	let $e: any;
	let A: Value = get_area(this);
	if (this.mode === AALARM_MODE_SCRUBBING) {
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "co2_scrub", 1, "tox_scrub", 0, "n2o_scrub", 0, "bz_scrub", 0, "freon_scrub", 0, "water_vapor_scrub", 0, "scrubbing", 1, "widenet", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", ONE_ATMOSPHERE]));
		}
	} else if (this.mode === AALARM_MODE_CONTAMINATED) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "co2_scrub", 1, "tox_scrub", 1, "n2o_scrub", 1, "bz_scrub", 1, "freon_scrub", 1, "water_vapor_scrub", 1, "scrubbing", 1, "widenet", 1]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", ONE_ATMOSPHERE]));
		}
	} else if (this.mode === AALARM_MODE_VENTING) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "widenet", 0, "scrubbing", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", 202.65]));
		}
	} else if (this.mode === AALARM_MODE_REFILL) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "co2_scrub", 1, "tox_scrub", 0, "n2o_scrub", 0, "bz_scrub", 0, "freon_scrub", 0, "water_vapor_scrub", 0, "scrubbing", 1, "widenet", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", 303.97498]));
		}
	} else if (this.mode === AALARM_MODE_PANIC || this.mode === AALARM_MODE_REPLACEMENT) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "widenet", 1, "scrubbing", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 0]));
		}
	} else if (this.mode === AALARM_MODE_SIPHON) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "widenet", 0, "scrubbing", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 0]));
		}
	} else if (this.mode === AALARM_MODE_OFF) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 0]));
		}
	} else if (this.mode === AALARM_MODE_FLOOD) {
		device_id = null;
		for (device_id of each(A.air_scrub_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 0]));
		}
		device_id = null;
		for (device_id of each(A.air_vent_names)) {
			yield* this.send_signal(device_id, rt.alist(f, ["power", 1, "checks", 2, "set_internal_pressure", 0]));
		}
	}
	return f.dot;
}, true);

// airalarm.dm:531
rt.def("/obj/machinery/airalarm/proc/update_icon", function update_icon(f: Frame) {
	if (this.panel_open) {
		if (this.buildstage === 2) {
			this.icon_state = "alarmx";
		} else if (this.buildstage === 1) {
			this.icon_state = "alarm_b2";
		} else if (this.buildstage === 0) {
			this.icon_state = "alarm_b1";
		}
		return f.dot;
	}
	if (rt.bitAnd(this.stat, 3) || this.shorted) {
		this.icon_state = "alarmp";
		return f.dot;
	}
	let A: Value = get_area(this);
	const max_2 = max(this.danger_level, A.atmosalm);
	if (max_2 === 0) {
		this.icon_state = "alarm0";
	} else if (max_2 === 1) {
		this.icon_state = "alarm2";
	} else if (max_2 === 2) {
		this.icon_state = "alarm1";
	}
	return f.dot;
});

// airalarm.dm:554
rt.def("/obj/machinery/airalarm/proc/process", function* process(f: Frame) {
	let location: Value = null, gas_id: Value = null;
	if (rt.bitAnd(this.stat, 3) || this.shorted) {
		return f.dot;
	}
	if (!(location = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	let environment: Value = location.return_air();
	let env_gases: Value = environment.gases;
	let partial_pressure: Value = R_IDEAL_GAS_EQUATION * environment.temperature / environment.volume;
	let cur_tlv: Value = rt.at(this.TLV, "pressure");
	let environment_pressure: Value = environment.return_pressure();
	let pressure_dangerlevel: Value = cur_tlv.get_danger_level(environment_pressure);
	cur_tlv = rt.at(this.TLV, "temperature");
	let temperature_dangerlevel: Value = cur_tlv.get_danger_level(environment.temperature);
	let gas_dangerlevel: Value = 0;
	for (gas_id of each(env_gases)) {
		if (!rt.isIn(f, gas_id, this.TLV)) {
			continue;
		}
		cur_tlv = rt.index(this.TLV, gas_id);
		gas_dangerlevel = max(gas_dangerlevel, cur_tlv.get_danger_level(rt.index(rt.index(env_gases, gas_id), AALARM_MODE_SCRUBBING) * partial_pressure));
	}
	environment.garbage_collect();
	let old_danger_level: Value = this.danger_level;
	this.danger_level = max(pressure_dangerlevel, temperature_dangerlevel, gas_dangerlevel);
	if (old_danger_level != this.danger_level) {
		yield* this.apply_danger_level();
	}
	if (!(this.mode == AALARM_MODE_REPLACEMENT && environment_pressure < 5.06625)) return f.dot;
	this.mode = AALARM_MODE_SCRUBBING;
	yield* this.apply_mode();
	return f.dot;
}, true, { waitfor: false });

// airalarm.dm:594
rt.def("/obj/machinery/airalarm/proc/post_alert", function* post_alert(f: Frame, alert_level: Value) {
	let frequency: Value = null, alert_signal: Value = null;
	if (!(frequency = GLOB.SSradio.return_frequency(this.alarm_frequency))) {
		return f.dot;
	}
	let A: Value = get_area(this);
	(alert_signal = (yield* new_(T("/datum/signal")))).source = this;
	alert_signal.transmission_method = 1;
	rt.setAt(alert_signal.data, "zone", A.name);
	rt.setAt(alert_signal.data, "type", "Atmospheric");
	if (alert_level == 2) {
		rt.setAt(alert_signal.data, "alert", "severe");
	} else if (alert_level == 1) {
		rt.setAt(alert_signal.data, "alert", "minor");
	} else if (alert_level == 0) {
		rt.setAt(alert_signal.data, "alert", "clear");
	}
	yield* frequency.post_signal(this, alert_signal, null, -1);
	return f.dot;
}, true);

// airalarm.dm:617
rt.def("/obj/machinery/airalarm/proc/apply_danger_level", function* apply_danger_level(f: Frame) {
	let R: Value = null, AA: Value = null;
	let A: Value = get_area(this);
	let new_area_danger_level: Value = 0;
	for (R of each(A.related, T("/area"))) {
		AA = null;
		for (AA of each(R, T("/obj/machinery/airalarm"))) {
			if (!rt.bitAnd(AA.stat, 3) && !AA.shorted) {
				new_area_danger_level = max(new_area_danger_level, AA.danger_level);
			}
		}
	}
	if (A.atmosalert(new_area_danger_level, this)) {
		yield* this.post_alert(new_area_danger_level);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// airalarm.dm:630
rt.def("/obj/machinery/airalarm/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let cable: Value = null;
	if (this.buildstage === 2) {
		if (rt.istype(W, T("/obj/item/weapon/wirecutters")) && this.panel_open && this.wires.is_all_cut()) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You cut the final wires.</span>");
			yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 5);
			this.buildstage = 1;
			yield* this.update_icon();
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, W.usesound, 50, 1);
			this.panel_open = (!this.panel_open ? 1 : 0);
			to_chat(user, `<span class='notice'>The wires have been ${this.panel_open ? "exposed" : "unexposed"}.</span>`);
			yield* this.update_icon();
			return f.dot;
		} else if (rt.istype(W, T("/obj/item/weapon/card/id")) || rt.istype(W, T("/obj/item/device/pda"))) {
			if (rt.bitAnd(this.stat, 3)) {
				to_chat(user, "<span class='warning'>It does nothing!</span>");
			} else if ((yield* this.allowed(f.usr)) && !this.wires.is_cut("ID Scan")) {
				this.locked = (!this.locked ? 1 : 0);
				to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the air alarm interface.</span>`);
			} else {
				to_chat(user, "<span class='danger'>Access denied.</span>");
			}
			return f.dot;
		} else if (this.panel_open && is_wire_tool(W)) {
			yield* this.wires.interact(user);
			return f.dot;
		}
	} else if (this.buildstage === 1) {
		if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
			user.visible_message(`${user.name} removes the electronics from ${this.name}.`, "<span class='notice'>You start prying out the circuit...</span>");
			playsound(this.loc, W.usesound, 50, 1);
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				if (this.buildstage == 1) {
					to_chat(user, "<span class='notice'>You remove the air alarm electronics.</span>");
					yield* new_(T("/obj/item/weapon/electronics/airalarm"), this.loc);
					playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
					this.buildstage = 0;
					yield* this.update_icon();
				}
			}
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
			if ((cable = W).get_amount() < 5) {
				to_chat(user, "<span class='warning'>You need five lengths of cable to wire the fire alarm!</span>");
				return f.dot;
			}
			user.visible_message(`${user.name} wires the air alarm.`, "<span class='notice'>You start wiring the air alarm...</span>");
			if (yield* do_after(user, 20, { target: this })) {
				if (cable.get_amount() >= 5 && this.buildstage == 1) {
					yield* cable.use(5);
					to_chat(user, "<span class='notice'>You wire the air alarm.</span>");
					yield* this.wires.repair();
					this.aidisabled = 0;
					this.locked = 1;
					this.mode = 1;
					this.shorted = 0;
					yield* this.post_alert(0);
					this.buildstage = 2;
					yield* this.update_icon();
				}
			}
			return f.dot;
		}
	} else if (this.buildstage === 0) {
		if (rt.istype(W, T("/obj/item/weapon/electronics/airalarm"))) {
			if (yield* user.temporarilyRemoveItemFromInventory(W)) {
				to_chat(user, "<span class='notice'>You insert the circuit.</span>");
				this.buildstage = 1;
				yield* this.update_icon();
				yield* qdel(W);
			}
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			to_chat(user, fmt("<span class='notice'>You detach ％！ from the wall.</span>", [this]));
			playsound(this.loc, W.usesound, 50, 1);
			yield* new_(T("/obj/item/wallframe/airalarm"), user.loc);
			yield* qdel(this);
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// airalarm.dm:711
rt.def("/obj/machinery/airalarm/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// airalarm.dm:718
rt.def("/obj/machinery/airalarm/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) {
		return f.dot;
	}
	this.emagged = 1;
	this.visible_message(`<span class='warning'>Sparks fly out of the ${this}!</span>`, `<span class='notice'>You emag the ${this}, disabling its safeties.</span>`);
	playsound(this.loc, rt.rsc("sound/effects/sparks4.ogg"), 50, 1);
	return f.dot;
});

// airalarm.dm:722
rt.def("/obj/machinery/airalarm/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	parent_proc();
	this.update_icon();
	return f.dot;
}, false);

// airalarm.dm:726
rt.def("/obj/machinery/airalarm/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	disassembled ??= AALARM_MODE_SCRUBBING;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, AALARM_MODE_VENTING);
		I = (yield* new_(T("/obj/item/weapon/electronics/airalarm"), this.loc));
		if (!disassembled) {
			I.obj_integrity = I.max_integrity * 0.5;
		}
		yield* new_(T("/obj/item/stack/cable_coil"), this.loc, AALARM_MODE_PANIC);
	}
	yield* qdel(this);
	return f.dot;
}, true);
