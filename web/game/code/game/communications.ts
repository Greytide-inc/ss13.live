// From code/game/communications.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalall_radios  (code/game/communications.dm:66)
rt.def("/datum/controller/global_vars/proc/InitGlobalall_radios", function InitGlobalall_radios(f: Frame) {
	rt.setGl("all_radios", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "all_radios", add);
	return f.dot;
});

// /proc/add_radio  (code/game/communications.dm:68)
rt.def("/proc/add_radio", function add_radio(f: Frame, radio: Value, freq: Value) {
	if ((!truthy(live(freq)) || !truthy(live(radio)))) {
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.gl("all_radios"), fmt("＀", [live(freq)])))) {
		rt.setAt(rt.gl("all_radios"), fmt("＀", [live(freq)]), rt.list(live(radio)));
		return live(freq);
	}
	(rt.modAt(rt.gl("all_radios"), fmt("＀", [live(freq)]), live(radio), rt.bitOr));
	return live(freq);
});

// /proc/remove_radio  (code/game/communications.dm:78)
rt.def("/proc/remove_radio", function remove_radio(f: Frame, radio: Value, freq: Value) {
	if ((!truthy(live(freq)) || !truthy(live(radio)))) {
		return live(f.dot);
	}
	if (!truthy(rt.index(rt.gl("all_radios"), fmt("＀", [live(freq)])))) {
		return live(f.dot);
	}
	(rt.modAt(rt.gl("all_radios"), fmt("＀", [live(freq)]), live(radio), subtract));
	return f.dot;
});

// /proc/remove_radio_all  (code/game/communications.dm:86)
rt.def("/proc/remove_radio_all", function remove_radio_all(f: Frame, radio: Value) {
	let freq: Value = null;
	let $e: any;
	f.vars = () => [freq, $e];
	freq = null;
	rt.forList(f, 0, rt.gl("all_radios"));
	while (($e = rt.next(f, 0)) !== undefined) {
		freq = $e;
		(rt.modAt(rt.gl("all_radios"), fmt("＀", [live(freq)]), live(radio), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalradiochannels  (code/game/communications.dm:126)
rt.def("/datum/controller/global_vars/proc/InitGlobalradiochannels", function InitGlobalradiochannels(f: Frame) {
	rt.setGl("radiochannels", rt.alist(f, ["Common", 1459, "Science", 1351, "Command", 1353, "Medical", 1355, "Engineering", 1357, "Security", 1359, "Centcom", 1337, "Syndicate", 1213, "Supply", 1347, "Service", 1349, "AI Private", 1447, "Red Team", 1215, "Blue Team", 1217]));
	rt.modSrcVar(f, "gvars_datum_init_order", "radiochannels", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalreverseradiochannels  (code/game/communications.dm:142)
rt.def("/datum/controller/global_vars/proc/InitGlobalreverseradiochannels", function InitGlobalreverseradiochannels(f: Frame) {
	rt.setGl("reverseradiochannels", rt.alist(f, ["1459", "Common", "1351", "Science", "1353", "Command", "1355", "Medical", "1357", "Engineering", "1359", "Security", "1337", "Centcom", "1213", "Syndicate", "1347", "Supply", "1349", "Service", "1447", "AI Private", "1215", "Red Team", "1217", "Blue Team"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "reverseradiochannels", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_TO_AIRALARM  (code/game/communications.dm:176)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_TO_AIRALARM", function InitGlobalRADIO_TO_AIRALARM(f: Frame) {
	rt.setGl("RADIO_TO_AIRALARM", "1");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_TO_AIRALARM", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_FROM_AIRALARM  (code/game/communications.dm:177)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_FROM_AIRALARM", function InitGlobalRADIO_FROM_AIRALARM(f: Frame) {
	rt.setGl("RADIO_FROM_AIRALARM", "2");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_FROM_AIRALARM", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_CHAT  (code/game/communications.dm:178)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_CHAT", function InitGlobalRADIO_CHAT(f: Frame) {
	rt.setGl("RADIO_CHAT", "3");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_CHAT", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_ATMOSIA  (code/game/communications.dm:179)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_ATMOSIA", function InitGlobalRADIO_ATMOSIA(f: Frame) {
	rt.setGl("RADIO_ATMOSIA", "4");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_ATMOSIA", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_NAVBEACONS  (code/game/communications.dm:180)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_NAVBEACONS", function InitGlobalRADIO_NAVBEACONS(f: Frame) {
	rt.setGl("RADIO_NAVBEACONS", "5");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_NAVBEACONS", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_AIRLOCK  (code/game/communications.dm:181)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_AIRLOCK", function InitGlobalRADIO_AIRLOCK(f: Frame) {
	rt.setGl("RADIO_AIRLOCK", "6");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_AIRLOCK", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalRADIO_MAGNETS  (code/game/communications.dm:182)
rt.def("/datum/controller/global_vars/proc/InitGlobalRADIO_MAGNETS", function InitGlobalRADIO_MAGNETS(f: Frame) {
	rt.setGl("RADIO_MAGNETS", "9");
	rt.modSrcVar(f, "gvars_datum_init_order", "RADIO_MAGNETS", add);
	return f.dot;
});

rt.type(1079, "/datum/radio_frequency", "/datum", {
	frequency: null,
	devices: null,
});

// /datum/radio_frequency/proc/<init>  (code/game/communications.dm:187)
rt.def("/datum/radio_frequency/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "devices", rt.list());
	return f.dot;
});

// /datum/radio_frequency/proc/post_signal  (code/game/communications.dm:198)  may sleep
rt.def("/datum/radio_frequency/proc/post_signal", function* post_signal(f: Frame, source: Value, signal: Value, filter: Value, range: Value) {
	let filter_list: Value = null, start_point: Value = null, current_filter: Value = null, device: Value = null, end_point: Value = null;
	let $e: any;
	f.vars = () => [source, signal, filter, range, filter_list, start_point, current_filter, device, end_point, $e];
	if (live(filter) === null) {
		filter = null;
	}
	if (live(range) === null) {
		range = null;
	}
	filter_list = null;
	if (truthy(live(filter))) {
		filter_list = rt.list(live(filter), "_default");
	} else {
		filter_list = rt.sv(f, "devices");
	}
	start_point = null;
	if (truthy(live(range))) {
		if (!truthy((start_point = rt.getStep(f, live(source), 0)))) {
			return 0;
		}
	}
	current_filter = null;
	rt.forList(f, 0, live(filter_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		current_filter = $e;
		device = null;
		rt.forList(f, 1, rt.index(rt.sv(f, "devices"), live(current_filter)), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			device = $e;
			if (isEqual(live(device), live(source))) {
				continue;
			}
			if (truthy(live(range))) {
				if (!truthy((end_point = rt.getStep(f, live(device), 0)))) {
					continue;
				}
				if ((!isEqual(rt.fv(f, "z", live(start_point)), rt.fv(f, "z", live(end_point))) || (rt.gt(live(range), 0) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(start_point), live(end_point)])), live(range))))) {
					continue;
				}
			}
			yield* g.callName(f, live(device), "receive_signal", [live(signal), 1, rt.sv(f, "frequency")]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/radio_frequency/proc/add_listener  (code/game/communications.dm:223)
rt.def("/datum/radio_frequency/proc/add_listener", function add_listener(f: Frame, device: Value, filter: Value) {
	let devices_line: Value = null;
	f.vars = () => [filter, devices_line];
	if (!truthy(live(filter))) {
		filter = "_default";
	}
	if (!truthy((devices_line = rt.index(rt.sv(f, "devices"), live(filter))))) {
		devices_line = rt.list();
		rt.setAt(rt.sv(f, "devices"), live(filter), live(devices_line));
	}
	devices_line = rt.modify(live(devices_line), live(device), add);
	return f.dot;
});

// /datum/radio_frequency/proc/remove_listener  (code/game/communications.dm:234)
rt.def("/datum/radio_frequency/proc/remove_listener", function remove_listener(f: Frame, device: Value) {
	let devices_filter: Value = null, devices_line: Value = null;
	let $e: any;
	f.vars = () => [devices_filter, devices_line, $e];
	devices_filter = null;
	rt.forList(f, 0, rt.sv(f, "devices"));
	while (($e = rt.next(f, 0)) !== undefined) {
		devices_filter = $e;
		if (!truthy((devices_line = rt.index(rt.sv(f, "devices"), live(devices_filter))))) {
			(rt.modSrcVar(f, "devices", live(devices_filter), subtract));
		}
		(devices_line = rt.modify(live(devices_line), live(device), subtract));
		if (!truthy(rt.len(f, live(devices_line)))) {
			(rt.modSrcVar(f, "devices", live(devices_filter), subtract));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /client/proc/print_pointers  (code/game/communications.dm:250)
rt.def("/client/proc/print_pointers", function print_pointers(f: Frame) {
	let S: Value = null, p: Value = null;
	let $e: any;
	f.vars = () => [S, p, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	S = null;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("There are ＀ pointers:", [rt.len(f, rt.gl("pointers"))])]);
	p = null;
	rt.forList(f, 0, rt.gl("pointers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		p = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(p)]);
		if (truthy((rt.istype((S = rt.locateIn(f, live(p), rt.world())), T("/datum/signal")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), rt.callName(f, live(S), "debug_print", [])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Debug Signals", category: "Debug" } });

rt.type(1080, "/datum/signal", "/datum", {
	source: null,
	transmission_method: 0,
	data: null,
	encryption: null,
	frequency: 0,
}, { global: { pointers: 644 } });

// /datum/signal/proc/<init>  (code/game/communications.dm:272)
rt.def("/datum/signal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "data", rt.list());
	return f.dot;
});

// /datum/signal/proc/New  (code/game/communications.dm:279)
rt.def("/datum/signal/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modGl("pointers", fmt("＃", [live(f.src)]), add);
	return f.dot;
});

// /datum/signal/proc/Destroy  (code/game/communications.dm:283)  may sleep
rt.def("/datum/signal/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("pointers", fmt("＃", [live(f.src)]), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/signal/proc/debug_print  (code/game/communications.dm:295)
rt.def("/datum/signal/proc/debug_print", function debug_print(f: Frame) {
	let i: Value = null, L: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [i, L, t, $e];
	if (truthy(rt.sv(f, "source"))) {
		f.dot = fmt("signal = {source = '＀' (＀,＀,＀)\n", [rt.sv(f, "source"), rt.fv(f, "x", rt.sv(f, "source")), rt.fv(f, "y", rt.sv(f, "source")), rt.fv(f, "z", rt.sv(f, "source"))]);
	} else {
		f.dot = fmt("signal = {source = '＀' ()\n", [rt.sv(f, "source")]);
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "data"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		f.dot = rt.modify(live(f.dot), fmt("data[\"＀\"] = \"＀\"\n", [live(i), rt.index(rt.sv(f, "data"), live(i))]), add);
		if (truthy((rt.istype(rt.index(rt.sv(f, "data"), live(i)), T("/list")) ? 1 : 0))) {
			L = rt.index(rt.sv(f, "data"), live(i));
			t = null;
			rt.forList(f, 1, live(L));
			while (($e = rt.next(f, 1)) !== undefined) {
				t = $e;
				f.dot = rt.modify(live(f.dot), fmt("data[\"＀\"] list has: ＀", [live(i), live(t)]), add);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/signal/proc/sanitize_data  (code/game/communications.dm:306)
rt.def("/datum/signal/proc/sanitize_data", function sanitize_data(f: Frame) {
	let d: Value = null, val: Value = null;
	let $e: any;
	f.vars = () => [d, val, $e];
	d = null;
	rt.forList(f, 0, rt.sv(f, "data"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		if (truthy(rt.call(f, P("/proc/istext"), null, [(val = rt.index(rt.sv(f, "data"), live(d)))]))) {
			rt.setAt(rt.sv(f, "data"), live(d), rt.call(f, P("/proc/html_encode"), null, [live(val)]));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
