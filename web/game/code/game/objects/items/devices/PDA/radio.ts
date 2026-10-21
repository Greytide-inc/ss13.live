// From code/game/objects/items/devices/PDA/radio.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9804, "/obj/item/radio/integrated", "/obj/item/radio", {
	on: 0,
	menu_message: "",
	name: "１PDA radio module",
	desc: "An electronic radio system of nanotrasen origin.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "power_mod",
});

// /obj/item/radio/integrated/proc/Initialize  (code/game/objects/items/devices/PDA/radio.dm:11)  may sleep
rt.def("/obj/item/radio/integrated/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/radio/integrated/proc/Destroy  (code/game/objects/items/devices/PDA/radio.dm:14)  may sleep
rt.def("/obj/item/radio/integrated/proc/Destroy", function* Destroy(f: Frame) {
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(9805, "/obj/item/radio/integrated/signal", "/obj/item/radio/integrated", {
	frequency: 1457,
	code: 30,
	last_transmission: null,
	radio_connection: null,
});

// /obj/item/radio/integrated/signal/proc/Destroy  (code/game/objects/items/devices/PDA/radio.dm:29)  may sleep
rt.def("/obj/item/radio/integrated/signal/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	rt.setSv(f, "radio_connection", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/radio/integrated/signal/proc/Initialize  (code/game/objects/items/devices/PDA/radio.dm:34)  may sleep
rt.def("/obj/item/radio/integrated/signal/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((rt.lt(rt.fv(f, "frequency", live(f.src)), 1200) || rt.gt(rt.fv(f, "frequency", live(f.src)), 1600))) {
		rt.setFv(f, "frequency", live(f.src), (yield* g.call(f, P("/proc/sanitize_frequency"), null, [rt.fv(f, "frequency", live(f.src))])));
	}
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/item/radio/integrated/signal/proc/set_frequency  (code/game/objects/items/devices/PDA/radio.dm:41)  may sleep
rt.def("/obj/item/radio/integrated/signal/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency")])));
	return f.dot;
}, true);

// /obj/item/radio/integrated/signal/proc/send_signal  (code/game/objects/items/devices/PDA/radio.dm:47)  may sleep
rt.def("/obj/item/radio/integrated/signal/proc/send_signal", function* send_signal(f: Frame, message: Value) {
	let time: Value = null, _T: Value = null, signal: Value = null;
	f.vars = () => [message, time, _T, signal];
	if (live(message) === null) {
		message = "ACTIVATE";
	}
	if ((truthy(rt.sv(f, "last_transmission")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_transmission"), 5)))) {
		return live(f.dot);
	}
	rt.setSv(f, "last_transmission", rt.worldTime(f));
	time = (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "hh:mm:ss"]));
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.callName(f, rt.gl("lastsignalers"), "Add", [fmt("＀ <B>:</B> ＀ used ＀ @ location (＀,＀,＀) <B>:</B> ＀/＀", [live(time), rt.fv(f, "key", live(f.usr)), live(f.src), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), (yield* g.call(f, P("/proc/format_frequency"), null, [rt.sv(f, "frequency")])), rt.sv(f, "code")])]);
	rt.setFv(f, "source", (signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "encryption", live(signal), rt.sv(f, "code"));
	rt.setAt(rt.fv(f, "data", live(signal)), "message", live(message));
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal)]);
	return live(f.dot);
}, true);
