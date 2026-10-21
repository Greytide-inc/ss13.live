// From code/controllers/subsystem/radio.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(36, "/datum/controller/subsystem/radio", "/datum/controller/subsystem", {
	frequencies: null,
	name: "Radio",
	flags: 3,
});

// /datum/controller/subsystem/radio/proc/New  (code/controllers/subsystem/radio.dm:1)  may sleep
rt.def("/datum/controller/subsystem/radio/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSradio"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSradio"), T("/datum/controller/subsystem/radio")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSradio")]);
		}
		rt.setGl("SSradio", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/radio/proc/<init>  (code/controllers/subsystem/radio.dm:5)
rt.def("/datum/controller/subsystem/radio/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "frequencies", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/radio/proc/add_object  (code/controllers/subsystem/radio.dm:8)
rt.def("/datum/controller/subsystem/radio/proc/add_object", function add_object(f: Frame, device: Value, new_frequency: Value, filter: Value) {
	let f_text: Value = null, frequency: Value = null;
	f.vars = () => [filter, f_text, frequency];
	if (live(filter) === null) {
		filter = null;
	}
	f_text = rt.call(f, P("/proc/num2text"), null, [live(new_frequency)]);
	if (!truthy((frequency = rt.index(rt.sv(f, "frequencies"), live(f_text))))) {
		rt.setFv(f, "frequency", (frequency = rt.new_(f, T("/datum/radio_frequency"), [])), live(new_frequency));
		rt.setAt(rt.sv(f, "frequencies"), live(f_text), live(frequency));
	}
	rt.callName(f, live(frequency), "add_listener", [live(device), live(filter)]);
	return live(frequency);
});

// /datum/controller/subsystem/radio/proc/remove_object  (code/controllers/subsystem/radio.dm:20)  may sleep
rt.def("/datum/controller/subsystem/radio/proc/remove_object", function* remove_object(f: Frame, device: Value, old_frequency: Value) {
	let f_text: Value = null, frequency: Value = null;
	f.vars = () => [device, old_frequency, f_text, frequency];
	f_text = (yield* g.call(f, P("/proc/num2text"), null, [live(old_frequency)]));
	if (truthy((frequency = rt.index(rt.sv(f, "frequencies"), live(f_text))))) {
		yield* g.callName(f, live(frequency), "remove_listener", [live(device)]);
		if (isEqual(rt.getLen(f, rt.fv(f, "devices", live(frequency))), 0)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(frequency)]);
			(rt.modSrcVar(f, "frequencies", live(f_text), subtract));
		}
	}
	return 1;
}, true);

// /datum/controller/subsystem/radio/proc/return_frequency  (code/controllers/subsystem/radio.dm:33)
rt.def("/datum/controller/subsystem/radio/proc/return_frequency", function return_frequency(f: Frame, new_frequency: Value) {
	let f_text: Value = null, frequency: Value = null;
	f.vars = () => [f_text, frequency];
	f_text = rt.call(f, P("/proc/num2text"), null, [live(new_frequency)]);
	if (!truthy((frequency = rt.index(rt.sv(f, "frequencies"), live(f_text))))) {
		rt.setFv(f, "frequency", (frequency = rt.new_(f, T("/datum/radio_frequency"), [])), live(new_frequency));
		rt.setAt(rt.sv(f, "frequencies"), live(f_text), live(frequency));
	}
	return live(frequency);
});
