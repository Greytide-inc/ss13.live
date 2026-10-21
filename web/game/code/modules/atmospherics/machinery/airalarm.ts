// From code/modules/atmospherics/machinery/airalarm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1865, "/datum/tlv", "/datum", {
	min2: null,
	min1: null,
	max1: null,
	max2: null,
});

// /datum/tlv/proc/get_danger_level  (code/modules/atmospherics/machinery/airalarm.dm:14)
rt.def("/datum/tlv/proc/get_danger_level", function get_danger_level(f: Frame, val: Value) {
	if ((!isEqual(rt.sv(f, "max2"), -1) && rt.ge(live(val), rt.sv(f, "max2")))) {
		return 2;
	}
	if ((!isEqual(rt.sv(f, "min2"), -1) && rt.le(live(val), rt.sv(f, "min2")))) {
		return 2;
	}
	if ((!isEqual(rt.sv(f, "max1"), -1) && rt.ge(live(val), rt.sv(f, "max1")))) {
		return 1;
	}
	if ((!isEqual(rt.sv(f, "min1"), -1) && rt.le(live(val), rt.sv(f, "min1")))) {
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

// /obj/machinery/airalarm/proc/<init>  (code/modules/atmospherics/machinery/airalarm.dm:76)
rt.def("/obj/machinery/airalarm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "TLV", rt.alist(f, ["pressure", rt.new_(f, T("/datum/tlv"), [81.05999755859375, 91.19249725341797, 111.4574966430664, 121.59000396728516]), "temperature", rt.new_(f, T("/datum/tlv"), [273.1499938964844, 283.1499938964844, 313.1499938964844, 339.1499938964844]), "o2", rt.new_(f, T("/datum/tlv"), [16, 19, 135, 140]), "n2", rt.new_(f, T("/datum/tlv"), [-1, -1, 1000, 1000]), "co2", rt.new_(f, T("/datum/tlv"), [-1, -1, 5, 10]), "plasma", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "n2o", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "bz", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "freon", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "water_vapor", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5])]));
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(24));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]));
	return f.dot;
});

rt.type(10881, "/obj/machinery/airalarm/server", "/obj/machinery/airalarm", {
	TLV: null,
});

// /obj/machinery/airalarm/server/proc/<init>  (code/modules/atmospherics/machinery/airalarm.dm:90)
rt.def("/obj/machinery/airalarm/server/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "TLV", rt.alist(f, ["pressure", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "temperature", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "o2", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "n2", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "co2", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "plasma", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "n2o", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "bz", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "freon", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1]), "water_vapor", rt.new_(f, T("/datum/tlv"), [-1, -1, -1, -1])]));
	return f.dot;
});

rt.type(10882, "/obj/machinery/airalarm/kitchen_cold_room", "/obj/machinery/airalarm", {
	TLV: null,
});

// /obj/machinery/airalarm/kitchen_cold_room/proc/<init>  (code/modules/atmospherics/machinery/airalarm.dm:104)
rt.def("/obj/machinery/airalarm/kitchen_cold_room/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "TLV", rt.alist(f, ["pressure", rt.new_(f, T("/datum/tlv"), [81.05999755859375, 91.19249725341797, 111.4574966430664, 121.59000396728516]), "temperature", rt.new_(f, T("/datum/tlv"), [200, 210, 273.1499938964844, 283.1499938964844]), "o2", rt.new_(f, T("/datum/tlv"), [16, 19, 135, 140]), "n2", rt.new_(f, T("/datum/tlv"), [-1, -1, 1000, 1000]), "co2", rt.new_(f, T("/datum/tlv"), [-1, -1, 5, 10]), "plasma", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "n2o", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "bz", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "freon", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5]), "water_vapor", rt.new_(f, T("/datum/tlv"), [-1, -1, 0.20000000298023224, 0.5])]));
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

// /area/proc/<init>  (code/modules/atmospherics/machinery/airalarm.dm:119)
rt.def("/area/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambigen1.ogg"), rt.rsc("sound/ambience/ambigen3.ogg"), rt.rsc("sound/ambience/ambigen4.ogg"), rt.rsc("sound/ambience/ambigen5.ogg"), rt.rsc("sound/ambience/ambigen6.ogg"), rt.rsc("sound/ambience/ambigen7.ogg"), rt.rsc("sound/ambience/ambigen8.ogg"), rt.rsc("sound/ambience/ambigen9.ogg"), rt.rsc("sound/ambience/ambigen10.ogg"), rt.rsc("sound/ambience/ambigen11.ogg"), rt.rsc("sound/ambience/ambigen12.ogg"), rt.rsc("sound/ambience/ambigen14.ogg")));
	$0 = $0;
	rt.setSv(f, "air_vent_names", rt.list());
	$0 = $0;
	rt.setSv(f, "air_scrub_names", rt.list());
	$0 = $0;
	rt.setSv(f, "air_vent_info", rt.list());
	$0 = $0;
	rt.setSv(f, "air_scrub_info", rt.list());
	return f.dot;
});

// /obj/machinery/airalarm/proc/New  (code/modules/atmospherics/machinery/airalarm.dm:125)  may sleep
rt.def("/obj/machinery/airalarm/proc/New", function* New(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/airalarm"), [live(f.src)])));
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	if (truthy(live(f.args[2]))) {
		rt.setSv(f, "buildstage", 0);
		rt.setSv(f, "panel_open", 1);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			$0 = 0;
		} else {
			if (isEqual(rt.sv(f, "dir"), 4)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			if (isEqual(rt.sv(f, "dir"), 1)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (isEqual(rt.sv(f, "name"), rt.initial(f, live(f.src), "name"))) {
		rt.setSv(f, "name", fmt("＀ Air Alarm", [rt.fv(f, "name", live(A))]));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["loc", "ndir", "nbuild"] });

// /obj/machinery/airalarm/proc/Destroy  (code/modules/atmospherics/machinery/airalarm.dm:144)  may sleep
rt.def("/obj/machinery/airalarm/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/airalarm/proc/Initialize  (code/modules/atmospherics/machinery/airalarm.dm:150)  may sleep
rt.def("/obj/machinery/airalarm/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/airalarm/proc/ui_status  (code/modules/atmospherics/machinery/airalarm.dm:154)
rt.def("/obj/machinery/airalarm/proc/ui_status", function ui_status(f: Frame) {
	if ((truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.args[0]))) && truthy(rt.sv(f, "aidisabled")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "AI control has been disabled."]);
	} else {
		if (!truthy(rt.sv(f, "shorted"))) {
			return rt.callSuper(f, [], rt.Args.Same);
		}
	}
	return -1;
}, false, { args: ["user"] });

// /obj/machinery/airalarm/proc/ui_interact  (code/modules/atmospherics/machinery/airalarm.dm:162)  may sleep
rt.def("/obj/machinery/airalarm/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "airalarm", rt.sv(f, "name"), 440, 650, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/ui_data  (code/modules/atmospherics/machinery/airalarm.dm:168)
rt.def("/obj/machinery/airalarm/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, A: Value = null, _T: Value = null, environment: Value = null, cur_tlv: Value = null, pressure: Value = null, temperature: Value = null, total_moles: Value = null, partial_pressure: Value = null, gas_id: Value = null, id_tag: Value = null, long_name: Value = null, info: Value = null, selected: Value = null, thresholds: Value = null, gas_id_11: Value = null;
	let $e: any;
	f.vars = () => [data, A, _T, environment, cur_tlv, pressure, temperature, total_moles, partial_pressure, gas_id, id_tag, long_name, info, selected, thresholds, gas_id_11, $e];
	data = rt.alist(f, ["locked", rt.sv(f, "locked"), "siliconUser", rt.fv(f, "has_unlimited_silicon_privilege", live(user)), "emagged", rt.sv(f, "emagged"), "danger_level", rt.sv(f, "danger_level")]);
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	rt.setAt(live(data), "atmos_alarm", rt.fv(f, "atmosalm", live(A)));
	rt.setAt(live(data), "fire_alarm", rt.fv(f, "fire", live(A)));
	_T = rt.getStep(f, live(f.src), 0);
	environment = rt.callName(f, live(_T), "return_air", []);
	cur_tlv = null;
	rt.setAt(live(data), "environment_data", rt.list());
	pressure = rt.callName(f, live(environment), "return_pressure", []);
	cur_tlv = rt.at(rt.sv(f, "TLV"), "pressure");
	rt.modAt(live(data), "environment_data", rt.list(rt.alist(f, ["name", "Pressure", "value", live(pressure), "unit", "kPa", "danger_level", rt.callName(f, live(cur_tlv), "get_danger_level", [live(pressure)])])), add);
	temperature = rt.fv(f, "temperature", live(environment));
	cur_tlv = rt.at(rt.sv(f, "TLV"), "temperature");
	rt.modAt(live(data), "environment_data", rt.list(rt.alist(f, ["name", "Temperature", "value", live(temperature), "unit", fmt("K (＀C)", [rt.call(f, P("/proc/round"), null, [subtract(live(temperature), 273.1499938964844), 0.10000000149011612])]), "danger_level", rt.callName(f, live(cur_tlv), "get_danger_level", [live(temperature)])])), add);
	total_moles = rt.callName(f, live(environment), "total_moles", []);
	partial_pressure = divide(multiply(8.3100004196167, rt.fv(f, "temperature", live(environment))), rt.fv(f, "volume", live(environment)));
	gas_id = null;
	rt.forList(f, 0, rt.fv(f, "gases", live(environment)));
	while (($e = rt.next(f, 0)) !== undefined) {
		gas_id = $e;
		if (!truthy((rt.isIn(f, live(gas_id), rt.sv(f, "TLV")) ? 1 : 0))) {
			continue;
		}
		cur_tlv = rt.index(rt.sv(f, "TLV"), live(gas_id));
		rt.modAt(live(data), "environment_data", rt.list(rt.alist(f, ["name", rt.index(rt.index(rt.index(rt.fv(f, "gases", live(environment)), live(gas_id)), 3), 2), "value", multiply(divide(rt.index(rt.index(rt.fv(f, "gases", live(environment)), live(gas_id)), 1), live(total_moles)), 100), "unit", "%", "danger_level", rt.callName(f, live(cur_tlv), "get_danger_level", [multiply(rt.index(rt.index(rt.fv(f, "gases", live(environment)), live(gas_id)), 1), live(partial_pressure))])])), add);
	}
	rt.endFor(f, 0);
	if ((!truthy(rt.sv(f, "locked")) || truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(user))))) {
		rt.setAt(live(data), "vents", rt.list());
		id_tag = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			id_tag = $e;
			long_name = rt.index(rt.fv(f, "air_vent_names", live(A)), live(id_tag));
			if ((!truthy((info = rt.index(rt.fv(f, "air_vent_info", live(A)), live(id_tag)))) || !isEqual(rt.at(live(info), "frequency"), rt.sv(f, "frequency")))) {
				continue;
			}
			rt.modAt(live(data), "vents", rt.list(rt.alist(f, ["id_tag", live(id_tag), "long_name", rt.call(f, P("/proc/sanitize"), null, [live(long_name)]), "power", rt.at(live(info), "power"), "checks", rt.at(live(info), "checks"), "excheck", rt.bitAnd(rt.at(live(info), "checks"), 1), "incheck", rt.bitAnd(rt.at(live(info), "checks"), 2), "direction", rt.at(live(info), "direction"), "external", rt.at(live(info), "external"), "extdefault", (isEqual(rt.at(live(info), "external"), 101.32499694824219) ? 1 : 0)])), add);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "scrubbers", rt.list());
		id_tag = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			id_tag = $e;
			long_name = rt.index(rt.fv(f, "air_scrub_names", live(A)), live(id_tag));
			if ((!truthy((info = rt.index(rt.fv(f, "air_scrub_info", live(A)), live(id_tag)))) || !isEqual(rt.at(live(info), "frequency"), rt.sv(f, "frequency")))) {
				continue;
			}
			rt.modAt(live(data), "scrubbers", rt.list(rt.alist(f, ["id_tag", live(id_tag), "long_name", rt.call(f, P("/proc/sanitize"), null, [live(long_name)]), "power", rt.at(live(info), "power"), "scrubbing", rt.at(live(info), "scrubbing"), "widenet", rt.at(live(info), "widenet"), "filter_co2", rt.at(live(info), "filter_co2"), "filter_toxins", rt.at(live(info), "filter_toxins"), "filter_n2o", rt.at(live(info), "filter_n2o"), "filter_bz", rt.at(live(info), "filter_bz"), "filter_freon", rt.at(live(info), "filter_freon"), "filter_water_vapor", rt.at(live(info), "filter_water_vapor")])), add);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "mode", rt.sv(f, "mode"));
		rt.setAt(live(data), "modes", rt.list());
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Filtering - Scrubs out contaminants", "mode", 1, "selected", (isEqual(rt.sv(f, "mode"), 1) ? 1 : 0), "danger", 0])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Contaminated - Scrubs out ALL contaminants quickly", "mode", 8, "selected", (isEqual(rt.sv(f, "mode"), 8) ? 1 : 0), "danger", 0])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Draught - Siphons out air while replacing", "mode", 2, "selected", (isEqual(rt.sv(f, "mode"), 2) ? 1 : 0), "danger", 0])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Refill - Triple vent output", "mode", 9, "selected", (isEqual(rt.sv(f, "mode"), 9) ? 1 : 0), "danger", 1])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Cycle - Siphons air before replacing", "mode", 4, "selected", (isEqual(rt.sv(f, "mode"), 4) ? 1 : 0), "danger", 1])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Siphon - Siphons air out of the room", "mode", 7, "selected", (isEqual(rt.sv(f, "mode"), 7) ? 1 : 0), "danger", 1])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Panic Siphon - Siphons air out of the room quickly", "mode", 3, "selected", (isEqual(rt.sv(f, "mode"), 3) ? 1 : 0), "danger", 1])), add);
		rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Off - Shuts off vents and scrubbers", "mode", 5, "selected", (isEqual(rt.sv(f, "mode"), 5) ? 1 : 0), "danger", 0])), add);
		if (truthy(rt.sv(f, "emagged"))) {
			rt.modAt(live(data), "modes", rt.list(rt.alist(f, ["name", "Flood - Shuts off scrubbers and opens vents", "mode", 6, "selected", (isEqual(rt.sv(f, "mode"), 6) ? 1 : 0), "danger", 1])), add);
		}
		selected = null;
		thresholds = rt.list();
		selected = rt.at(rt.sv(f, "TLV"), "pressure");
		rt.modAt(rt.index((thresholds = rt.modify(live(thresholds), rt.list(rt.alist(f, ["name", "Pressure", "settings", rt.list()])), add)), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "pressure", "val", "min2", "selected", rt.fv(f, "min2", live(selected))])), add);
		rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "pressure", "val", "min1", "selected", rt.fv(f, "min1", live(selected))])), add);
		rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "pressure", "val", "max1", "selected", rt.fv(f, "max1", live(selected))])), add);
		rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "pressure", "val", "max2", "selected", rt.fv(f, "max2", live(selected))])), add);
		selected = rt.at(rt.sv(f, "TLV"), "temperature");
		rt.modAt(rt.index((thresholds = rt.modify(live(thresholds), rt.list(rt.alist(f, ["name", "Temperature", "settings", rt.list()])), add)), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "temperature", "val", "min2", "selected", rt.fv(f, "min2", live(selected))])), add);
		rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "temperature", "val", "min1", "selected", rt.fv(f, "min1", live(selected))])), add);
		rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "temperature", "val", "max1", "selected", rt.fv(f, "max1", live(selected))])), add);
		rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", "temperature", "val", "max2", "selected", rt.fv(f, "max2", live(selected))])), add);
		gas_id_11 = null;
		rt.forList(f, 0, rt.gl("meta_gas_info"));
		while (($e = rt.next(f, 0)) !== undefined) {
			gas_id_11 = $e;
			if (!truthy((rt.isIn(f, live(gas_id_11), rt.sv(f, "TLV")) ? 1 : 0))) {
				continue;
			}
			selected = rt.index(rt.sv(f, "TLV"), live(gas_id_11));
			rt.modAt(rt.index((thresholds = rt.modify(live(thresholds), rt.list(rt.alist(f, ["name", rt.index(rt.index(rt.gl("meta_gas_info"), live(gas_id_11)), 2), "settings", rt.list()])), add)), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", live(gas_id_11), "val", "min2", "selected", rt.fv(f, "min2", live(selected))])), add);
			rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", live(gas_id_11), "val", "min1", "selected", rt.fv(f, "min1", live(selected))])), add);
			rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", live(gas_id_11), "val", "max1", "selected", rt.fv(f, "max1", live(selected))])), add);
			rt.modAt(rt.index(live(thresholds), rt.len(f, live(thresholds))), "settings", rt.list(rt.alist(f, ["env", live(gas_id_11), "val", "max2", "selected", rt.fv(f, "max2", live(selected))])), add);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "thresholds", live(thresholds));
	}
	return live(data);
});

// /obj/machinery/airalarm/proc/ui_act  (code/modules/atmospherics/machinery/airalarm.dm:294)  may sleep
rt.def("/obj/machinery/airalarm/proc/ui_act", function* ui_act(f: Frame) {
	let device_id: Value = null, A: Value = null, target: Value = null, env: Value = null, name: Value = null, tlv: Value = null, value: Value = null;
	let $0: any;
	f.vars = () => [device_id, A, target, env, name, tlv, value, $0];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !isEqual(rt.sv(f, "buildstage"), 2))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "locked")) && !truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr)))) || (truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr))) && truthy(rt.sv(f, "aidisabled"))))) {
		return live(f.dot);
	}
	device_id = rt.at(live(f.args[1]), "id_tag");
	$0 = live(f.args[0]);
	if ($0 === "lock") {
		if ((truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"]))))) {
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			f.dot = 1;
		}
	} else if ($0 === "power" || $0 === "co2_scrub" || $0 === "tox_scrub" || $0 === "n2o_scrub" || $0 === "bz_scrub" || $0 === "freon_scrub" || $0 === "water_vapor_scrub" || $0 === "widenet" || $0 === "scrubbing") {
		yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, [fmt("＀", [live(f.args[0])]), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "val")]))]));
		f.dot = 1;
	} else if ($0 === "excheck") {
		yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["checks", rt.bitXor((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "val")])), 1)]));
		f.dot = 1;
	} else if ($0 === "incheck") {
		yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["checks", rt.bitXor((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "val")])), 2)]));
		f.dot = 1;
	} else if ($0 === "set_external_pressure") {
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
		if (((target = (yield* g.op(f, "Prompt", [33], [null, rt.index(rt.index(rt.fv(f, "air_vent_info", live(A)), live(device_id)), "external"), rt.sv(f, "name"), "New target pressure:", null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["set_external_pressure", live(target)]));
			f.dot = 1;
		}
	} else if ($0 === "reset_external_pressure") {
		yield* g.srcCall(f, "send_signal", live(device_id), rt.list("reset_external_pressure"));
		f.dot = 1;
	} else if ($0 === "threshold") {
		env = rt.at(live(f.args[1]), "env");
		name = rt.at(live(f.args[1]), "var");
		if ((tlv = rt.index(rt.sv(f, "TLV"), live(env))) === null) {
			return live(f.dot);
		}
		if (((value = (yield* g.op(f, "Prompt", [33], [null, rt.index(rt.fv(f, "vars", live(tlv)), live(name)), live(name), fmt("New ＀ for ＀:", [live(name), live(env)]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
			if (rt.lt(live(value), 0)) {
				rt.setAt(rt.fv(f, "vars", live(tlv)), live(name), -1);
			} else {
				rt.setAt(rt.fv(f, "vars", live(tlv)), live(name), (yield* g.call(f, P("/proc/round"), null, [live(value), 0.009999999776482582])));
			}
			f.dot = 1;
		}
	} else if ($0 === "mode") {
		rt.setSv(f, "mode", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "mode")])));
		yield* g.srcCall(f, "apply_mode");
		f.dot = 1;
	} else if ($0 === "alarm") {
		if (truthy((yield* g.callName(f, (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), "atmosalert", [2, live(f.src)])))) {
			yield* g.srcCall(f, "post_alert", 2);
		}
		f.dot = 1;
	} else if ($0 === "reset") {
		if (truthy((yield* g.callName(f, (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))), "atmosalert", [0, live(f.src)])))) {
			yield* g.srcCall(f, "post_alert", 0);
		}
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/airalarm/proc/reset  (code/modules/atmospherics/machinery/airalarm.dm:353)
rt.def("/obj/machinery/airalarm/proc/reset", function reset(f: Frame, wire: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(wire);
	if ($0 === "Power") {
		if (!truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Power"]))) {
			rt.setSv(f, "shorted", 0);
			rt.callSrc(f, "update_icon", []);
		}
	} else if ($0 === "AI Connection") {
		if (truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["AI Connection"]))) return f.dot;
		rt.setSv(f, "aidisabled", 0);
	}
	return f.dot;
});

// /obj/machinery/airalarm/proc/shock  (code/modules/atmospherics/machinery/airalarm.dm:364)  may sleep
rt.def("/obj/machinery/airalarm/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let s: Value = null;
	f.vars = () => [user, prb, s];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), 1, 1])))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/refresh_all  (code/modules/atmospherics/machinery/airalarm.dm:377)  may sleep
rt.def("/obj/machinery/airalarm/proc/refresh_all", function* refresh_all(f: Frame) {
	let A: Value = null, id_tag: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [A, id_tag, I, $e];
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	id_tag = null;
	rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id_tag = $e;
		if ((truthy((I = rt.index(rt.fv(f, "air_vent_info", live(A)), live(id_tag)))) && rt.gt(add(rt.at(live(I), "timestamp"), 50), rt.worldTime(f)))) {
			continue;
		}
		yield* g.srcCall(f, "send_signal", live(id_tag), rt.list("status"));
	}
	rt.endFor(f, 0);
	id_tag = null;
	rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id_tag = $e;
		if ((truthy((I = rt.index(rt.fv(f, "air_scrub_info", live(A)), live(id_tag)))) && rt.gt(add(rt.at(live(I), "timestamp"), 50), rt.worldTime(f)))) {
			continue;
		}
		yield* g.srcCall(f, "send_signal", live(id_tag), rt.list("status"));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/set_frequency  (code/modules/atmospherics/machinery/airalarm.dm:390)  may sleep
rt.def("/obj/machinery/airalarm/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_TO_AIRALARM")])));
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/send_signal  (code/modules/atmospherics/machinery/airalarm.dm:395)  may sleep
rt.def("/obj/machinery/airalarm/proc/send_signal", function* send_signal(f: Frame, target: Value, command: Value) {
	let signal: Value = null;
	f.vars = () => [target, command, signal];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return 0;
	}
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
	rt.setFv(f, "source", live(signal), live(f.src));
	rt.setFv(f, "data", live(signal), live(command));
	rt.setAt(rt.fv(f, "data", live(signal)), "tag", live(target));
	rt.setAt(rt.fv(f, "data", live(signal)), "sigtype", "command");
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal), rt.gl("RADIO_FROM_AIRALARM")]);
	return 1;
}, true);

// /obj/machinery/airalarm/proc/apply_mode  (code/modules/atmospherics/machinery/airalarm.dm:412)  may sleep
rt.def("/obj/machinery/airalarm/proc/apply_mode", function* apply_mode(f: Frame) {
	let A: Value = null, device_id: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, device_id, $0, $e];
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "co2_scrub", 1, "tox_scrub", 0, "n2o_scrub", 0, "bz_scrub", 0, "freon_scrub", 0, "water_vapor_scrub", 0, "scrubbing", 1, "widenet", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", 101.32499694824219]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 8) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "co2_scrub", 1, "tox_scrub", 1, "n2o_scrub", 1, "bz_scrub", 1, "freon_scrub", 1, "water_vapor_scrub", 1, "scrubbing", 1, "widenet", 1]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", 101.32499694824219]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 2) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "widenet", 0, "scrubbing", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", 202.64999389648438]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 9) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "co2_scrub", 1, "tox_scrub", 0, "n2o_scrub", 0, "bz_scrub", 0, "freon_scrub", 0, "water_vapor_scrub", 0, "scrubbing", 1, "widenet", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "checks", 1, "set_external_pressure", 303.9749755859375]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 3 || $0 === 4) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "widenet", 1, "scrubbing", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 0]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 7) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "widenet", 0, "scrubbing", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 0]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 5) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 0]));
		}
		rt.endFor(f, 0);
	} else if ($0 === 6) {
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_scrub_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 0]));
		}
		rt.endFor(f, 0);
		device_id = null;
		rt.forList(f, 0, rt.fv(f, "air_vent_names", live(A)));
		while (($e = rt.next(f, 0)) !== undefined) {
			device_id = $e;
			yield* g.srcCall(f, "send_signal", live(device_id), rt.alist(f, ["power", 1, "checks", 2, "set_internal_pressure", 0]));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/update_icon  (code/modules/atmospherics/machinery/airalarm.dm:531)
rt.def("/obj/machinery/airalarm/proc/update_icon", function update_icon(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	if (truthy(rt.sv(f, "panel_open"))) {
		$0 = rt.sv(f, "buildstage");
		if ($0 === 2) {
			rt.setSv(f, "icon_state", "alarmx");
		} else if ($0 === 1) {
			rt.setSv(f, "icon_state", "alarm_b2");
		} else if ($0 === 0) {
			rt.setSv(f, "icon_state", "alarm_b1");
		}
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || truthy(rt.sv(f, "shorted")))) {
		rt.setSv(f, "icon_state", "alarmp");
		return live(f.dot);
	}
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	$0 = rt.call(f, P("/proc/max"), null, [rt.sv(f, "danger_level"), rt.fv(f, "atmosalm", live(A))]);
	if ($0 === 0) {
		rt.setSv(f, "icon_state", "alarm0");
	} else if ($0 === 1) {
		rt.setSv(f, "icon_state", "alarm2");
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", "alarm1");
	}
	return f.dot;
});

// /obj/machinery/airalarm/proc/process  (code/modules/atmospherics/machinery/airalarm.dm:554)  may sleep
rt.def("/obj/machinery/airalarm/proc/process", function* process(f: Frame) {
	let location: Value = null, cur_tlv: Value = null, environment: Value = null, env_gases: Value = null, partial_pressure: Value = null, environment_pressure: Value = null, pressure_dangerlevel: Value = null, temperature_dangerlevel: Value = null, gas_dangerlevel: Value = null, gas_id: Value = null, old_danger_level: Value = null;
	let $e: any;
	f.vars = () => [location, cur_tlv, environment, env_gases, partial_pressure, environment_pressure, pressure_dangerlevel, temperature_dangerlevel, gas_dangerlevel, gas_id, old_danger_level, $e];
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || truthy(rt.sv(f, "shorted")))) {
		return live(f.dot);
	}
	if (!truthy((location = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	cur_tlv = null;
	environment = (yield* g.callName(f, live(location), "return_air", []));
	env_gases = rt.fv(f, "gases", live(environment));
	partial_pressure = divide(multiply(8.3100004196167, rt.fv(f, "temperature", live(environment))), rt.fv(f, "volume", live(environment)));
	cur_tlv = rt.at(rt.sv(f, "TLV"), "pressure");
	environment_pressure = (yield* g.callName(f, live(environment), "return_pressure", []));
	pressure_dangerlevel = (yield* g.callName(f, live(cur_tlv), "get_danger_level", [live(environment_pressure)]));
	cur_tlv = rt.at(rt.sv(f, "TLV"), "temperature");
	temperature_dangerlevel = (yield* g.callName(f, live(cur_tlv), "get_danger_level", [rt.fv(f, "temperature", live(environment))]));
	gas_dangerlevel = 0;
	gas_id = null;
	rt.forList(f, 0, live(env_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		gas_id = $e;
		if (!truthy((rt.isIn(f, live(gas_id), rt.sv(f, "TLV")) ? 1 : 0))) {
			continue;
		}
		cur_tlv = rt.index(rt.sv(f, "TLV"), live(gas_id));
		gas_dangerlevel = (yield* g.call(f, P("/proc/max"), null, [live(gas_dangerlevel), (yield* g.callName(f, live(cur_tlv), "get_danger_level", [multiply(rt.index(rt.index(live(env_gases), live(gas_id)), 1), live(partial_pressure))]))]));
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(environment), "garbage_collect", []);
	old_danger_level = rt.sv(f, "danger_level");
	rt.setSv(f, "danger_level", (yield* g.call(f, P("/proc/max"), null, [live(pressure_dangerlevel), live(temperature_dangerlevel), live(gas_dangerlevel)])));
	if (!isEqual(live(old_danger_level), rt.sv(f, "danger_level"))) {
		yield* g.srcCall(f, "apply_danger_level");
	}
	if (!(isEqual(rt.sv(f, "mode"), 4) && rt.lt(live(environment_pressure), 5.066249847412109))) return f.dot;
	rt.setSv(f, "mode", 1);
	yield* g.srcCall(f, "apply_mode");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/airalarm/proc/post_alert  (code/modules/atmospherics/machinery/airalarm.dm:594)  may sleep
rt.def("/obj/machinery/airalarm/proc/post_alert", function* post_alert(f: Frame, alert_level: Value) {
	let frequency: Value = null, A: Value = null, alert_signal: Value = null;
	f.vars = () => [alert_level, frequency, A, alert_signal];
	if (!truthy((frequency = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [rt.sv(f, "alarm_frequency")]))))) {
		return live(f.dot);
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	rt.setFv(f, "source", (alert_signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "transmission_method", live(alert_signal), 1);
	rt.setAt(rt.fv(f, "data", live(alert_signal)), "zone", rt.fv(f, "name", live(A)));
	rt.setAt(rt.fv(f, "data", live(alert_signal)), "type", "Atmospheric");
	if (isEqual(live(alert_level), 2)) {
		rt.setAt(rt.fv(f, "data", live(alert_signal)), "alert", "severe");
	} else {
		if (isEqual(live(alert_level), 1)) {
			rt.setAt(rt.fv(f, "data", live(alert_signal)), "alert", "minor");
		} else {
			if (isEqual(live(alert_level), 0)) {
				rt.setAt(rt.fv(f, "data", live(alert_signal)), "alert", "clear");
			}
		}
	}
	yield* g.callName(f, live(frequency), "post_signal", [live(f.src), live(alert_signal), null, -1]);
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/apply_danger_level  (code/modules/atmospherics/machinery/airalarm.dm:617)  may sleep
rt.def("/obj/machinery/airalarm/proc/apply_danger_level", function* apply_danger_level(f: Frame) {
	let A: Value = null, new_area_danger_level: Value = null, R: Value = null, AA: Value = null;
	let $e: any;
	f.vars = () => [A, new_area_danger_level, R, AA, $e];
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	new_area_danger_level = 0;
	R = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		AA = null;
		rt.forList(f, 1, live(R), T("/obj/machinery/airalarm"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AA = $e;
			if ((!truthy(rt.bitAnd(rt.fv(f, "stat", live(AA)), 3)) && !truthy(rt.fv(f, "shorted", live(AA))))) {
				new_area_danger_level = (yield* g.call(f, P("/proc/max"), null, [live(new_area_danger_level), rt.fv(f, "danger_level", live(AA))]));
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.callName(f, live(A), "atmosalert", [live(new_area_danger_level), live(f.src)])))) {
		yield* g.srcCall(f, "post_alert", live(new_area_danger_level));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/airalarm/proc/attackby  (code/modules/atmospherics/machinery/airalarm.dm:630)  may sleep
rt.def("/obj/machinery/airalarm/proc/attackby", function* attackby(f: Frame) {
	let cable: Value = null;
	let $0: any, $1: any;
	f.vars = () => [cable, $0, $1];
	$0 = rt.sv(f, "buildstage");
	if ($0 === 2) {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && truthy(rt.sv(f, "panel_open"))) && truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_all_cut", []))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You cut the final wires.</span>"]);
			yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 5]);
			rt.setSv(f, "buildstage", 1);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "panel_open"))) {
					$1 = "exposed";
				} else {
					$1 = "unexposed";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The wires have been ＀.</span>", [$1])]);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0)))) {
					if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It does nothing!</span>"]);
					} else {
						if ((truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)]))) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["ID Scan"]))))) {
							rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
							$0 = live(f.args[1]);
							if (truthy(rt.sv(f, "locked"))) {
								$1 = "lock";
							} else {
								$1 = "unlock";
							}
							yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the air alarm interface.</span>", [$1])]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
						}
					}
					return live(f.dot);
				} else {
					if ((truthy(rt.sv(f, "panel_open")) && truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])]))))) {
						yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
						return live(f.dot);
					}
				}
			}
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the electronics from ＀.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You start prying out the circuit...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (isEqual(rt.sv(f, "buildstage"), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the air alarm electronics.</span>"]);
					yield* g.new_(f, T("/obj/item/weapon/electronics/airalarm"), [rt.fv(f, "loc", live(f.src))]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
					rt.setSv(f, "buildstage", 0);
					yield* g.srcCall(f, "update_icon");
				}
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (cable = live(f.args[0])), "get_amount", [])), 5)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need five lengths of cable to wire the fire alarm!</span>"]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wires the air alarm.", [rt.fv(f, "name", live(f.args[1]))]), "<span class='notice'>You start wiring the air alarm...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
				if ((rt.ge((yield* g.callName(f, live(cable), "get_amount", [])), 5) && isEqual(rt.sv(f, "buildstage"), 1))) {
					yield* g.callName(f, live(cable), "use", [5]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wire the air alarm.</span>"]);
					yield* g.callName(f, rt.sv(f, "wires"), "repair", []);
					rt.setSv(f, "aidisabled", 0);
					rt.setSv(f, "locked", 1);
					rt.setSv(f, "mode", 1);
					rt.setSv(f, "shorted", 0);
					yield* g.srcCall(f, "post_alert", 0);
					rt.setSv(f, "buildstage", 2);
					yield* g.srcCall(f, "update_icon");
				}
			}
			return live(f.dot);
		}
	} else if ($0 === 0) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/airalarm")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You insert the circuit.</span>"]);
				rt.setSv(f, "buildstage", 1);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You detach ％！ from the wall.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.new_(f, T("/obj/item/wallframe/airalarm"), [rt.fv(f, "loc", live(f.args[1]))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/airalarm/proc/power_change  (code/modules/atmospherics/machinery/airalarm.dm:711)
rt.def("/obj/machinery/airalarm/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/airalarm/proc/emag_act  (code/modules/atmospherics/machinery/airalarm.dm:718)
rt.def("/obj/machinery/airalarm/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	rt.setSv(f, "emagged", 1);
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>Sparks fly out of the ＀!</span>", [live(f.src)]), fmt("<span class='notice'>You emag the ＀, disabling its safeties.</span>", [live(f.src)])]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/sparks4.ogg"), 50, 1]);
	return f.dot;
});

// /obj/machinery/airalarm/proc/obj_break  (code/modules/atmospherics/machinery/airalarm.dm:722)
rt.def("/obj/machinery/airalarm/proc/obj_break", function obj_break(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { args: ["damage_flag"] });

// /obj/machinery/airalarm/proc/deconstruct  (code/modules/atmospherics/machinery/airalarm.dm:726)  may sleep
rt.def("/obj/machinery/airalarm/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	f.vars = () => [disassembled, I];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
		I = (yield* g.new_(f, T("/obj/item/weapon/electronics/airalarm"), [rt.sv(f, "loc")]));
		if (!truthy(live(disassembled))) {
			rt.setFv(f, "obj_integrity", live(I), multiply(rt.fv(f, "max_integrity", live(I)), 0.5));
		}
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 3]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
