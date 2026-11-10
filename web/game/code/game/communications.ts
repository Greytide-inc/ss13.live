// Based on /tg/station's code/game/communications.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract, fmt } = rt;


// communications.dm:66
rt.def("/datum/controller/global_vars/proc/InitGlobalall_radios", function InitGlobalall_radios(f: Frame) {
	GLOB.all_radios = list();
	this.gvars_datum_init_order += "all_radios";
	return f.dot;
});

// communications.dm:68
rt.def("/proc/add_radio", function add_radio(f: Frame, radio: Value, freq: Value) {
	if (!freq || !radio) {
		return f.dot;
	}
	if (!rt.index(GLOB.all_radios, `${freq}`)) {
		rt.setAt(GLOB.all_radios, `${freq}`, list(radio));
		return freq;
	}
	(rt.modAt(GLOB.all_radios, `${freq}`, radio, rt.bitOr));
	return freq;
});

// communications.dm:78
rt.def("/proc/remove_radio", function remove_radio(f: Frame, radio: Value, freq: Value) {
	if (!freq || !radio) {
		return f.dot;
	}
	if (!rt.index(GLOB.all_radios, `${freq}`)) {
		return f.dot;
	}
	(rt.modAt(GLOB.all_radios, `${freq}`, radio, subtract));
	return f.dot;
});

// communications.dm:86
rt.def("/proc/remove_radio_all", function remove_radio_all(f: Frame, radio: Value) {
	let freq: Value = null;
	for (freq of each(GLOB.all_radios)) {
		(rt.modAt(GLOB.all_radios, `${freq}`, radio, subtract));
	}
	return f.dot;
});

// communications.dm:126
rt.def("/datum/controller/global_vars/proc/InitGlobalradiochannels", function InitGlobalradiochannels(f: Frame) {
	GLOB.radiochannels = rt.alist(f, ["Common", 1459, "Science", 1351, "Command", 1353, "Medical", 1355, "Engineering", 1357, "Security", 1359, "Centcom", 1337, "Syndicate", 1213, "Supply", 1347, "Service", 1349, "AI Private", 1447, "Red Team", 1215, "Blue Team", 1217]);
	this.gvars_datum_init_order += "radiochannels";
	return f.dot;
});

// communications.dm:142
rt.def("/datum/controller/global_vars/proc/InitGlobalreverseradiochannels", function InitGlobalreverseradiochannels(f: Frame) {
	GLOB.reverseradiochannels = rt.alist(f, ["1459", "Common", "1351", "Science", "1353", "Command", "1355", "Medical", "1357", "Engineering", "1359", "Security", "1337", "Centcom", "1213", "Syndicate", "1347", "Supply", "1349", "Service", "1447", "AI Private", "1215", "Red Team", "1217", "Blue Team"]);
	this.gvars_datum_init_order += "reverseradiochannels";
	return f.dot;
});

// communications.dm:176
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_TO_AIRALARM", function InitGlobalRADIO_TO_AIRALARM(f: Frame) {
	GLOB.RADIO_TO_AIRALARM = "1";
	this.gvars_datum_init_order += "RADIO_TO_AIRALARM";
	return f.dot;
});

// communications.dm:177
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_FROM_AIRALARM", function InitGlobalRADIO_FROM_AIRALARM(f: Frame) {
	GLOB.RADIO_FROM_AIRALARM = "2";
	this.gvars_datum_init_order += "RADIO_FROM_AIRALARM";
	return f.dot;
});

// communications.dm:178
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_CHAT", function InitGlobalRADIO_CHAT(f: Frame) {
	GLOB.RADIO_CHAT = "3";
	this.gvars_datum_init_order += "RADIO_CHAT";
	return f.dot;
});

// communications.dm:179
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_ATMOSIA", function InitGlobalRADIO_ATMOSIA(f: Frame) {
	GLOB.RADIO_ATMOSIA = "4";
	this.gvars_datum_init_order += "RADIO_ATMOSIA";
	return f.dot;
});

// communications.dm:180
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_NAVBEACONS", function InitGlobalRADIO_NAVBEACONS(f: Frame) {
	GLOB.RADIO_NAVBEACONS = "5";
	this.gvars_datum_init_order += "RADIO_NAVBEACONS";
	return f.dot;
});

// communications.dm:181
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_AIRLOCK", function InitGlobalRADIO_AIRLOCK(f: Frame) {
	GLOB.RADIO_AIRLOCK = "6";
	this.gvars_datum_init_order += "RADIO_AIRLOCK";
	return f.dot;
});

// communications.dm:182
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_MAGNETS", function InitGlobalRADIO_MAGNETS(f: Frame) {
	GLOB.RADIO_MAGNETS = "9";
	this.gvars_datum_init_order += "RADIO_MAGNETS";
	return f.dot;
});

rt.type(1079, "/datum/radio_frequency", "/datum", {
	frequency: null,
	devices: null,
});

// communications.dm:187
rt.def("/datum/radio_frequency/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.devices = list();
	return f.dot;
});

// communications.dm:198
rt.def("/datum/radio_frequency/proc/post_signal", function* post_signal(f: Frame, source: Value, signal: Value, filter: Value, range: Value) {
	let filter_list: Value = null, start_point: Value = null, current_filter: Value = null, device: Value = null, end_point: Value = null;
	if (filter) {
		filter_list = list(filter, "_default");
	} else {
		filter_list = this.devices;
	}
	if (range) {
		if (!(start_point = rt.getStep(f, source, 0))) {
			return 0;
		}
	}
	for (current_filter of each(filter_list)) {
		device = null;
		for (device of each(rt.index(this.devices, current_filter), T("/obj"))) {
			if (device == source) {
				continue;
			}
			if (range) {
				if (!(end_point = rt.getStep(f, device, 0))) {
					continue;
				}
				if (start_point.z != end_point.z || range > 0 && get_dist(start_point, end_point) > range) {
					continue;
				}
			}
			yield* device.receive_signal(signal, 1, this.frequency);
		}
	}
	return f.dot;
}, true);

// communications.dm:223
rt.def("/datum/radio_frequency/proc/add_listener", function add_listener(f: Frame, device: Value, filter: Value) {
	let devices_line: Value = null;
	if (!filter) {
		filter = "_default";
	}
	if (!(devices_line = rt.index(this.devices, filter))) {
		devices_line = list();
		rt.setAt(this.devices, filter, devices_line);
	}
	devices_line += device;
	return f.dot;
});

// communications.dm:234
rt.def("/datum/radio_frequency/proc/remove_listener", function remove_listener(f: Frame, device: Value) {
	let devices_filter: Value = null, devices_line: Value = null;
	for (devices_filter of each(this.devices)) {
		if (!(devices_line = rt.index(this.devices, devices_filter))) {
			this.devices -= devices_filter;
		}
		devices_line -= device;
		if (!rt.len(f, devices_line)) {
			this.devices -= devices_filter;
		}
	}
	return f.dot;
});

// communications.dm:250
rt.def("/client/proc/print_pointers", function print_pointers(f: Frame) {
	let S: Value = null, p: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	to_chat(this, `There are ${rt.len(f, GLOB.pointers)} pointers:`);
	for (p of each(GLOB.pointers)) {
		to_chat(this, p);
		if (rt.istype((S = rt.locateIn(f, p, rt.world())), T("/datum/signal"))) {
			to_chat(this, S.debug_print());
		}
	}
	return f.dot;
}, false, { verb: { name: "Debug Signals", category: "Debug" } });

rt.type(1080, "/datum/signal", "/datum", {
	source: null,
	transmission_method: 0,
	data: null,
	encryption: null,
	frequency: 0,
}, { global: { pointers: 644 } });

// communications.dm:272
rt.def("/datum/signal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.data = list();
	return f.dot;
});

// communications.dm:279
rt.def("/datum/signal/proc/New", function New(f: Frame) {
	parent_proc();
	GLOB.pointers += fmt("＃", [this]);
	return f.dot;
});

// communications.dm:283
rt.def("/datum/signal/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.pointers -= fmt("＃", [this]);
	return (yield* parent_proc());
}, true);

// communications.dm:295
rt.def("/datum/signal/proc/debug_print", function debug_print(f: Frame) {
	let i: Value = null, L: Value = null, t: Value = null;
	if (this.source) {
		f.dot = `signal = {source = '${this.source}' (${this.source.x},${this.source.y},${this.source.z})\n`;
	} else {
		f.dot = `signal = {source = '${this.source}' ()\n`;
	}
	for (i of each(this.data)) {
		f.dot += `data["${i}"] = "${rt.index(this.data, i)}"\n`;
		if (rt.istype(rt.index(this.data, i), T("/list"))) {
			L = rt.index(this.data, i);
			t = null;
			for (t of each(L)) {
				f.dot += `data["${i}"] list has: ${t}`;
			}
		}
	}
	return f.dot;
});
