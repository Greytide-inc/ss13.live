// From code/modules/assembly/signaler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9380, "/obj/item/device/assembly/signaler", "/obj/item/device/assembly", {
	send_throttle_time: 0,
	code: 30,
	frequency: 1457,
	delay: 0,
	radio_connection: null,
	wires: 27,
	attachable: 1,
	name: "remote signaling device",
	desc: "Used to remotely activate devices. Allows for syncing when using a secure signaler on another.",
	icon_state: "signaller",
	item_state: "signaler",
	materials: null,
	origin_tech: "magnets=1;bluespace=1",
});

// /obj/item/device/assembly/signaler/proc/<init>  (code/modules/assembly/signaler.dm:6)
rt.def("/obj/item/device/assembly/signaler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400, "$glass", 120]));
	return f.dot;
});

// /obj/item/device/assembly/signaler/proc/New  (code/modules/assembly/signaler.dm:17)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.spawnTail(f, 40, "/obj/item/device/assembly/signaler/proc/New: spawn at modules/assembly/signaler.dm:18");
	return f.dot;
}, true);

// a spawn(40) body of /obj/item/device/assembly/signaler/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/signaler/proc/New: spawn at modules/assembly/signaler.dm:18", function* (f: Frame) {
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return null;
});

// /obj/item/device/assembly/signaler/proc/Destroy  (code/modules/assembly/signaler.dm:24)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/assembly/signaler/proc/activate  (code/modules/assembly/signaler.dm:28)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/activate", function* activate(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	yield* g.srcCall(f, "signal");
	return 1;
}, true);

// /obj/item/device/assembly/signaler/proc/update_icon  (code/modules/assembly/signaler.dm:35)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/update_icon", function* update_icon(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	}
	return live(f.dot);
}, true);

// /obj/item/device/assembly/signaler/proc/interact  (code/modules/assembly/signaler.dm:39)  may sleep
// tg_js: opens the `signaler` tgui window (after modern tg's Signaler) instead of a hand-built HTML page.
rt.def("/obj/item/device/assembly/signaler/proc/interact", function* interact(f: Frame, user: Value, flag1: Value) {
	f.vars = () => [user, flag1];
	if (!truthy(rt.callSrc(f, "is_secured", [live(user)]))) return f.dot;
	yield* g.srcCall(f, "ui_interact", live(user));
	return live(f.dot);
}, true);

// /obj/item/device/assembly/signaler/proc/ui_interact  (tg_js)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		// In a holder (bomb, wire-attached) the signaler is nested inside another item, where default_state's view() check can't see it: always_state, and the old Topic's own distance/stat/restrained check (kept in ui_act) guards every click.
		state = truthy(rt.sv(f, "holder")) ? rt.gl("always_state") : rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "signaler", rt.sv(f, "name"), 320, 220, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/device/assembly/signaler/proc/ui_data  (tg_js)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [user, data];
	data = rt.list();
	rt.setAt(live(data), "frequency", rt.sv(f, "frequency"));
	rt.setAt(live(data), "readable_frequency", (yield* g.call(f, P("/proc/format_frequency"), null, [rt.sv(f, "frequency")])));
	rt.setAt(live(data), "code", rt.sv(f, "code"));
	return live(data);
}, true);

// /obj/item/device/assembly/signaler/proc/ui_act  (tg_js)  may sleep
// The buttons go through the old Topic (adjacency/stat checks, the frequency/code limits, the send).
rt.def("/obj/item/device/assembly/signaler/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action === "freq") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["freq", fmt("＀", [rt.at(live(params), "adjust")])]));
	} else if (action === "code") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["code", fmt("＀", [rt.at(live(params), "adjust")])]));
	} else if (action === "send") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["send", 1]));
	} else {
		return 0;
	}
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/item/device/assembly/signaler/proc/Topic  (code/modules/assembly/signaler.dm:71)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/Topic", function* Topic(f: Frame) {
	let new_frequency: Value = null;
	f.vars = () => [new_frequency];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((((!truthy(rt.fv(f, "canmove", live(f.usr))) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1))) {
		// tg_js, 2017 tg's own hole: this closed every viewer's window, so a far player's href closed the holder's. Only the sender's own window closes.
		yield* g.callName(f, rt.gl("SStgui"), "close_user_uis", [live(f.usr), live(f.src)]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "freq"))) {
		// tg_js, 2017 tg's own hole: a fractional adjust (0.5) left the frequency fractional inside 1200..1600; whole numbers only.
		if ((rt.lt((new_frequency = (yield* g.call(f, P("/proc/round"), null, [add(rt.sv(f, "frequency"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "freq")])))]))), 1200) || rt.gt(live(new_frequency), 1600))) {
			new_frequency = (yield* g.call(f, P("/proc/sanitize_frequency"), null, [live(new_frequency)]));
		}
		yield* g.srcCall(f, "set_frequency", live(new_frequency));
	}
	if (truthy(rt.at(live(f.args[1]), "code"))) {
		rt.modField(f, live(f.src), "code", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "code")])), add);
		rt.setFv(f, "code", live(f.src), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "code", live(f.src))])));
		rt.setFv(f, "code", live(f.src), (yield* g.call(f, P("/proc/min"), null, [100, rt.fv(f, "code", live(f.src))])));
		rt.setFv(f, "code", live(f.src), (yield* g.call(f, P("/proc/max"), null, [1, rt.fv(f, "code", live(f.src))])));
	}
	if (truthy(rt.at(live(f.args[1]), "send")) && rt.lt(rt.worldTime(f), rt.sv(f, "send_throttle_time"))) {
		// tg_js, tg 5a59713592 (2021): spamming send floods the frequency; one signal per second per signaler.
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The signaler is still recharging...</span>"]);
	} else if (truthy(rt.at(live(f.args[1]), "send"))) {
		rt.setSv(f, "send_throttle_time", add(rt.worldTime(f), 10));
		rt.spawnTail(f, 0, "/obj/item/device/assembly/signaler/proc/Topic: spawn at modules/assembly/signaler.dm:91", new_frequency);
	}
	if (truthy(live(f.usr))) {
		yield* g.srcCall(f, "attack_self", live(f.usr));
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// a spawn(0) body of /obj/item/device/assembly/signaler/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/signaler/proc/Topic: spawn at modules/assembly/signaler.dm:91", function* (f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.srcCall(f, "signal");
	return null;
});

// /obj/item/device/assembly/signaler/proc/attackby  (code/modules/assembly/signaler.dm:100)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/attackby", function* attackby(f: Frame) {
	let signaler2: Value = null;
	f.vars = () => [signaler2];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/signaler")) ? 1 : 0))) {
		signaler2 = live(f.args[0]);
		if ((truthy(rt.sv(f, "secured")) && truthy(rt.fv(f, "secured", live(signaler2))))) {
			rt.setSv(f, "code", rt.fv(f, "code", live(signaler2)));
			rt.setSv(f, "frequency", rt.fv(f, "frequency", live(signaler2)));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You transfer the frequency and code of ％！ to ％！", [rt.fv(f, "name", live(signaler2)), rt.sv(f, "name")])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/assembly/signaler/proc/signal  (code/modules/assembly/signaler.dm:110)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/signal", function* signal(f: Frame) {
	let signal: Value = null, time: Value = null, _T: Value = null;
	f.vars = () => [signal, time, _T];
	if (!truthy(rt.sv(f, "radio_connection"))) {
		return live(f.dot);
	}
	rt.setFv(f, "source", (signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "encryption", live(signal), rt.sv(f, "code"));
	rt.setAt(rt.fv(f, "data", live(signal)), "message", "ACTIVATE");
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal)]);
	time = (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "hh:mm:ss"]));
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(live(f.usr))) {
		yield* g.callName(f, rt.gl("lastsignalers"), "Add", [fmt("＀ <B>:</B> ＀ used ＀ @ location (＀,＀,＀) <B>:</B> ＀/＀", [live(time), rt.fv(f, "key", live(f.usr)), live(f.src), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), (yield* g.call(f, P("/proc/format_frequency"), null, [rt.sv(f, "frequency")])), rt.sv(f, "code")])]);
	}
	return live(f.dot);
}, true);

// /obj/item/device/assembly/signaler/proc/receive_signal  (code/modules/assembly/signaler.dm:138)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	f.vars = () => [signal];
	if (!truthy(live(signal))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "encryption", live(signal)), rt.sv(f, "code"))) {
		return 0;
	}
	if (!truthy(rt.bitAnd(rt.fv(f, "wires", live(f.src)), 8))) {
		return 0;
	}
	yield* g.srcCall(f, "pulse", 1);
	yield* g.srcCall(f, "audible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]), null, 1);
	return live(f.dot);
}, true);

// /obj/item/device/assembly/signaler/proc/set_frequency  (code/modules/assembly/signaler.dm:150)  may sleep
rt.def("/obj/item/device/assembly/signaler/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	if (!truthy(rt.gl("SSradio"))) {
		yield* g.call(f, P("/proc/sleep"), null, [20]);
	}
	if (!truthy(rt.gl("SSradio"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_CHAT")])));
	return live(f.dot);
}, true);

rt.type(9381, "/obj/item/device/assembly/signaler/reciever", "/obj/item/device/assembly/signaler", {
	on: 0,
});

// /obj/item/device/assembly/signaler/reciever/proc/toggle_safety  (code/modules/assembly/signaler.dm:166)
rt.def("/obj/item/device/assembly/signaler/reciever/proc/toggle_safety", function toggle_safety(f: Frame) {
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	return f.dot;
});

// /obj/item/device/assembly/signaler/reciever/proc/activate  (code/modules/assembly/signaler.dm:169)
rt.def("/obj/item/device/assembly/signaler/reciever/proc/activate", function activate(f: Frame) {
	rt.callSrc(f, "toggle_safety", []);
	return 1;
});

// /obj/item/device/assembly/signaler/reciever/proc/describe  (code/modules/assembly/signaler.dm:173)
rt.def("/obj/item/device/assembly/signaler/reciever/proc/describe", function describe(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "on"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return fmt("The radio receiver is ＀.", [$0]);
});

// /obj/item/device/assembly/signaler/reciever/proc/receive_signal  (code/modules/assembly/signaler.dm:176)  may sleep
rt.def("/obj/item/device/assembly/signaler/reciever/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	f.vars = () => [signal];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [live(signal)]));
}, true);

rt.type(9382, "/obj/item/device/assembly/signaler/anomaly", "/obj/item/device/assembly/signaler", {
	name: "anomaly core",
	desc: "The neutralized core of an anomaly. It'd probably be valuable for research.",
	icon_state: "anomaly core",
	item_state: "electronic",
});

// /obj/item/device/assembly/signaler/anomaly/proc/receive_signal  (code/modules/assembly/signaler.dm:188)  may sleep
rt.def("/obj/item/device/assembly/signaler/anomaly/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [signal, A, $e];
	if (!truthy(live(signal))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "encryption", live(signal)), rt.sv(f, "code"))) {
		return 0;
	}
	A = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/obj/effect/anomaly"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "anomalyNeutralize", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
