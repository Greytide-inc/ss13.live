// Based on /tg/station's code/game/machinery/telecomms/telecomunications.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// telecomunications.dm:15
rt.def("/datum/controller/global_vars/proc/InitGlobaltelecomms_list", function InitGlobaltelecomms_list(f: Frame) {
	GLOB.telecomms_list = list();
	this.gvars_datum_init_order += "telecomms_list";
	return f.dot;
});

rt.type(10707, "/obj/machinery/telecomms", "/obj/machinery", {
	temp: "",
	links: null,
	traffic: 0,
	netspeed: 5,
	autolinkers: null,
	id: "NULL",
	network: "NULL",
	freq_listening: null,
	machinetype: 0,
	toggled: 1,
	on: 1,
	long_range_link: 0,
	hide: 0,
	listening_level: 0,
	icon: rt.rsc("icons/obj/machines/telecomms.dmi"),
	critical_machine: 1,
});

// telecomunications.dm:19
rt.def("/obj/machinery/telecomms/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.links = list();

	this.autolinkers = list();

	this.freq_listening = list();
	return f.dot;
});

// telecomunications.dm:40
rt.def("/obj/machinery/telecomms/proc/relay_information", function* relay_information(f: Frame, signal: Value, filter: Value, copysig: Value, amount: Value) {
	let netlag: Value = null, machine: Value = null, copy: Value = null;
	amount ??= 20;
	if (!this.on) {
		return f.dot;
	}
	let send_count: Value = 0;
	if ((netlag = round(this.traffic / 50)) > rt.index(signal.data, "slow")) {
		rt.setAt(signal.data, "slow", netlag);
	}
	for (machine of each(this.links, T("/obj/machinery/telecomms"))) {
		if (filter && !rt.op(f, "IsType", [], [machine, text2path(filter)])) {
			continue;
		}
		if (!machine.on) {
			continue;
		}
		if (amount && send_count >= amount) {
			break;
		}
		if (machine.loc.z != this.listening_level) {
			if (this.long_range_link == 0 && machine.long_range_link == 0) {
				continue;
			}
		}
		copy = (yield* new_(T("/datum/signal")));
		if (copysig) {
			copy.transmission_method = 2;
			copy.frequency = signal.frequency;
			copy.data = rt.alist(f, ["mob", rt.index(signal.data, "mob"), "mobtype", rt.index(signal.data, "mobtype"), "realname", rt.index(signal.data, "realname"), "name", rt.index(signal.data, "name"), "job", rt.index(signal.data, "job"), "key", rt.index(signal.data, "key"), "vmask", rt.index(signal.data, "vmask"), "compression", rt.index(signal.data, "compression"), "message", rt.index(signal.data, "message"), "radio", rt.index(signal.data, "radio"), "slow", rt.index(signal.data, "slow"), "traffic", rt.index(signal.data, "traffic"), "type", rt.index(signal.data, "type"), "server", rt.index(signal.data, "server"), "reject", rt.index(signal.data, "reject"), "level", rt.index(signal.data, "level"), "spans", rt.index(signal.data, "spans"), "verb_say", rt.index(signal.data, "verb_say"), "verb_ask", rt.index(signal.data, "verb_ask"), "verb_exclaim", rt.index(signal.data, "verb_exclaim"), "verb_yell", rt.index(signal.data, "verb_yell"), "language", rt.index(signal.data, "language")]);
			if (!rt.index(signal.data, "original")) {
				rt.setAt(copy.data, "original", signal);
			} else {
				rt.setAt(copy.data, "original", rt.index(signal.data, "original"));
			}
		} else {
			copy = null;
		}
		send_count++;
		if (machine.is_freq_listening(signal)) {
			machine.traffic++;
		}
		if (copysig && copy) {
			yield* machine.receive_information(copy, this);
		} else {
			yield* machine.receive_information(signal, this);
		}
	}
	if (send_count > 0 && this.is_freq_listening(signal)) {
		this.traffic++;
	}
	return send_count;
}, true);

// telecomunications.dm:120
rt.def("/obj/machinery/telecomms/proc/relay_direct_information", function* relay_direct_information(f: Frame, signal: Value, machine: Value) {
	yield* machine.receive_information(signal, this);
	return f.dot;
}, true);

// telecomunications.dm:124
rt.def("/obj/machinery/telecomms/proc/receive_information", function receive_information(f: Frame, signal: Value, machine_from: Value) {
	parent_proc();
	return f.dot;
}, false);

// telecomunications.dm:128
rt.def("/obj/machinery/telecomms/proc/is_freq_listening", function is_freq_listening(f: Frame, signal: Value) {
	if (!signal) {
		return 0;
	}
	if (rt.isIn(f, signal.frequency, this.freq_listening) || !rt.len(f, this.freq_listening)) {
		return 1;
	} else {
		return 0;
	}
});

// telecomunications.dm:137
rt.def("/obj/machinery/telecomms/proc/New", function* New(f: Frame) {
	let position: Value = null;
	GLOB.telecomms_list += this;
	yield* parent_proc();
	if (this.listening_level) return f.dot;
	this.listening_level = (position = rt.getStep(f, this, 0)).z;
	return f.dot;
}, true);

// telecomunications.dm:147
rt.def("/obj/machinery/telecomms/proc/onShuttleMove", function* onShuttleMove(f: Frame, T1: Value, rotation: Value) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && T1)) return f.dot;
	this.listening_level = T1.z;
	return f.dot;
}, true);

// telecomunications.dm:152
rt.def("/obj/machinery/telecomms/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let _T: Value = null;
	yield* parent_proc();
	if (!(mapload && rt.len(f, this.autolinkers))) return f.dot;
	if (!this.long_range_link) {
		for (_T of each(urange(20, this, 1), T("/obj/machinery/telecomms"))) {
			this.add_link(_T);
		}
	} else {
		_T = null;
		for (_T of each(GLOB.telecomms_list, T("/obj/machinery/telecomms"))) {
			this.add_link(_T);
		}
	}
	return f.dot;
}, true);

// telecomunications.dm:164
rt.def("/obj/machinery/telecomms/proc/Destroy", function* Destroy(f: Frame) {
	let comm: Value = null;
	GLOB.telecomms_list -= this;
	for (comm of each(GLOB.telecomms_list, T("/obj/machinery/telecomms"))) {
		comm.links -= this;
	}
	this.links = list();
	return (yield* parent_proc());
}, true);

// telecomunications.dm:172
rt.def("/obj/machinery/telecomms/proc/add_link", function add_link(f: Frame, _T: Value) {
	let x: Value = null;
	let position: Value = rt.getStep(f, this, 0);
	let T_position: Value = rt.getStep(f, _T, 0);
	if (!(position.z == T_position.z || this.long_range_link && _T.long_range_link)) return f.dot;
	if (this == _T) return f.dot;
	for (x of each(this.autolinkers)) {
		if (rt.isIn(f, x, _T.autolinkers)) {
			(rt.modSrcVar(f, "links", _T, rt.bitOr));
		}
	}
	return f.dot;
});

// telecomunications.dm:183
rt.def("/obj/machinery/telecomms/proc/update_icon", function update_icon(f: Frame) {
	if (this.on) {
		if (this.panel_open) {
			this.icon_state = `${rt.initial(f, this, "icon_state")}_o`;
		} else {
			this.icon_state = rt.initial(f, this, "icon_state");
		}
	} else if (this.panel_open) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_o_off`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_off`;
	}
	return f.dot;
});

// telecomunications.dm:195
rt.def("/obj/machinery/telecomms/proc/update_power", function update_power(f: Frame) {
	if (this.toggled) {
		if (rt.bitAnd(this.stat, 19)) {
			this.on = 0;
		} else {
			this.on = 1;
		}
	} else {
		this.on = 0;
	}
	return f.dot;
});

// telecomunications.dm:203
rt.def("/obj/machinery/telecomms/proc/process", function process(f: Frame) {
	this.update_power();
	this.update_icon();
	if (!(this.traffic > 0)) return f.dot;
	this.traffic -= this.netspeed;
	return f.dot;
}, false, { waitfor: false });

// telecomunications.dm:212
rt.def("/obj/machinery/telecomms/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let duration: Value = null;
	if (prob(100 / severity)) {
		if (!rt.bitAnd(this.stat, EMPED)) {
			(rt.modSrcVar(f, "stat", EMPED, rt.bitOr));
			rt.spawnTail(f, rand((duration = 3000 / severity) - 20, duration + 20), "/obj/machinery/telecomms/proc/emp_act: spawn at game/machinery/telecomms/telecomunications.dm:215", duration);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [subtract((duration = divide(3000, live(f.args[0]))), 20), add(live(duration), 20)]))) body of /obj/machinery/telecomms/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/telecomms/proc/emp_act: spawn at game/machinery/telecomms/telecomunications.dm:215", function* (f: Frame, duration: Value) {
	(rt.modSrcVar(f, "stat", 16777199, rt.bitAnd));
	return null;
});
