// From code/game/machinery/embedded_controller/embedded_controller_base.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1502, "/datum/computer/file/embedded_program", "/datum/computer/file", {
	memory: null,
	state: null,
	master: null,
});

// /datum/computer/file/embedded_program/proc/<init>  (code/game/machinery/embedded_controller/embedded_controller_base.dm:2)
rt.def("/datum/computer/file/embedded_program/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "memory", rt.list());
	return f.dot;
});

// /datum/computer/file/embedded_program/proc/post_signal  (code/game/machinery/embedded_controller/embedded_controller_base.dm:8)  may sleep
rt.def("/datum/computer/file/embedded_program/proc/post_signal", function* post_signal(f: Frame, signal: Value, comm_line: Value) {
	f.vars = () => [signal, comm_line];
	if (truthy(rt.sv(f, "master"))) {
		yield* g.callName(f, rt.sv(f, "master"), "post_signal", [live(signal), live(comm_line)]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(signal)]);
	}
	return f.dot;
}, true);

// /datum/computer/file/embedded_program/proc/receive_signal  (code/game/machinery/embedded_controller/embedded_controller_base.dm:15)
rt.def("/datum/computer/file/embedded_program/proc/receive_signal", function receive_signal(f: Frame, signal: Value, receive_method: Value, receive_param: Value) {
	return null;
});

rt.type(10863, "/obj/machinery/embedded_controller", "/obj/machinery", {
	program: null,
	on: 1,
	anchored: 1,
	name: "embedded controller",
	density: 0,
});

// /obj/machinery/embedded_controller/proc/interact  (code/game/machinery/embedded_controller/embedded_controller_base.dm:30)  may sleep
rt.def("/obj/machinery/embedded_controller/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	f.vars = () => [user, popup];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "computer", rt.sv(f, "name")]))), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "set_content", [(yield* g.srcCall(f, "return_text"))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/embedded_controller/proc/attack_hand  (code/game/machinery/embedded_controller/embedded_controller_base.dm:37)  may sleep
rt.def("/obj/machinery/embedded_controller/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/embedded_controller/proc/receive_signal  (code/game/machinery/embedded_controller/embedded_controller_base.dm:47)
rt.def("/obj/machinery/embedded_controller/proc/receive_signal", function receive_signal(f: Frame, signal: Value, receive_method: Value, receive_param: Value) {
	if ((!truthy(live(signal)) || truthy(rt.fv(f, "encryption", live(signal))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "program"))) return f.dot;
	rt.callName(f, rt.sv(f, "program"), "receive_signal", [live(signal), live(receive_method), live(receive_param)]);
	return f.dot;
});

// /obj/machinery/embedded_controller/proc/Topic  (code/game/machinery/embedded_controller/embedded_controller_base.dm:54)  may sleep
rt.def("/obj/machinery/embedded_controller/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (truthy(rt.sv(f, "program"))) {
		yield* g.callName(f, rt.sv(f, "program"), "receive_user_command", [rt.at(live(f.args[1]), "command")]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "program"), P("/datum/computer/file/embedded_program/proc/process")])), 5]);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/proc/updateDialog")])), 5]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/embedded_controller/proc/process  (code/game/machinery/embedded_controller/embedded_controller_base.dm:66)  may sleep
rt.def("/obj/machinery/embedded_controller/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "program"))) {
		yield* g.callName(f, rt.sv(f, "program"), "process", []);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callName(f, live(f.src), "updateDialog", []);
	return f.dot;
}, true, { waitfor: false });

rt.type(10864, "/obj/machinery/embedded_controller/radio", "/obj/machinery/embedded_controller", {
	frequency: null,
	radio_connection: null,
});

// /obj/machinery/embedded_controller/radio/proc/Destroy  (code/game/machinery/embedded_controller/embedded_controller_base.dm:77)  may sleep
rt.def("/obj/machinery/embedded_controller/radio/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/embedded_controller/radio/proc/Initialize  (code/game/machinery/embedded_controller/embedded_controller_base.dm:81)  may sleep
rt.def("/obj/machinery/embedded_controller/radio/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	return f.dot;
}, true);

// /obj/machinery/embedded_controller/radio/proc/post_signal  (code/game/machinery/embedded_controller/embedded_controller_base.dm:85)  may sleep
rt.def("/obj/machinery/embedded_controller/radio/proc/post_signal", function* post_signal(f: Frame, signal: Value) {
	f.vars = () => [signal];
	rt.setFv(f, "transmission_method", live(signal), 1);
	if (truthy(rt.sv(f, "radio_connection"))) {
		return (yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [live(f.src), live(signal)]));
	}
	signal = null;
	return f.dot;
}, true);

// /obj/machinery/embedded_controller/radio/proc/set_frequency  (code/game/machinery/embedded_controller/embedded_controller_base.dm:92)  may sleep
rt.def("/obj/machinery/embedded_controller/radio/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	f.vars = () => [new_frequency];
	yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", live(new_frequency));
	rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency")])));
	return f.dot;
}, true);
