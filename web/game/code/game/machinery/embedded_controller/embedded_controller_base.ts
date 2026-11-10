// Based on /tg/station's code/game/machinery/embedded_controller/embedded_controller_base.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(1502, "/datum/computer/file/embedded_program", "/datum/computer/file", {
	memory: null,
	state: null,
	master: null,
});

// embedded_controller_base.dm:2
rt.def("/datum/computer/file/embedded_program/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.memory = list();
	return f.dot;
});

// embedded_controller_base.dm:8
rt.def("/datum/computer/file/embedded_program/proc/post_signal", function* post_signal(f: Frame, signal: Value, comm_line: Value) {
	if (this.master) {
		yield* this.master.post_signal(signal, comm_line);
	} else {
		yield* qdel(signal);
	}
	return f.dot;
}, true);

// embedded_controller_base.dm:15
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

// embedded_controller_base.dm:30
rt.def("/obj/machinery/embedded_controller/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	yield* user.set_machine(this);
	(popup = (yield* new_(T("/datum/browser"), user, "computer", this.name))).set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	popup.set_content(this.return_text());
	yield* popup.open();
	return f.dot;
}, true);

// embedded_controller_base.dm:37
rt.def("/obj/machinery/embedded_controller/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// embedded_controller_base.dm:47
rt.def("/obj/machinery/embedded_controller/proc/receive_signal", function receive_signal(f: Frame, signal: Value, receive_method: Value, receive_param: Value) {
	if (!signal || signal.encryption) {
		return f.dot;
	}
	if (!this.program) return f.dot;
	this.program.receive_signal(signal, receive_method, receive_param);
	return f.dot;
});

// embedded_controller_base.dm:54
rt.def("/obj/machinery/embedded_controller/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return 0;
	}
	if (this.program) {
		yield* this.program.receive_user_command(rt.at(href_list, "command"));
		yield* addtimer((yield* new_(T("/datum/callback"), this.program, P("/datum/computer/file/embedded_program/proc/process"))), 5);
	}
	yield* f.usr.set_machine(this);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/proc/updateDialog"))), 5);
	return f.dot;
}, true);

// embedded_controller_base.dm:66
rt.def("/obj/machinery/embedded_controller/proc/process", function* process(f: Frame) {
	if (this.program) {
		yield* this.program.process();
	}
	yield* this.update_icon();
	yield* this.updateDialog();
	return f.dot;
}, true, { waitfor: false });

rt.type(10864, "/obj/machinery/embedded_controller/radio", "/obj/machinery/embedded_controller", {
	frequency: null,
	radio_connection: null,
});

// embedded_controller_base.dm:77
rt.def("/obj/machinery/embedded_controller/radio/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// embedded_controller_base.dm:81
rt.def("/obj/machinery/embedded_controller/radio/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.set_frequency(this.frequency);
	return f.dot;
}, true);

// embedded_controller_base.dm:85
rt.def("/obj/machinery/embedded_controller/radio/proc/post_signal", function* post_signal(f: Frame, signal: Value) {
	signal.transmission_method = 1;
	if (this.radio_connection) {
		return (yield* this.radio_connection.post_signal(this, signal));
	}
	signal = null;
	return f.dot;
}, true);

// embedded_controller_base.dm:92
rt.def("/obj/machinery/embedded_controller/radio/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency);
	return f.dot;
}, true);
