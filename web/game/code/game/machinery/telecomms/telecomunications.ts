// From code/game/machinery/telecomms/telecomunications.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaltelecomms_list  (code/game/machinery/telecomms/telecomunications.dm:15)
rt.def("/datum/controller/global_vars/proc/InitGlobaltelecomms_list", function InitGlobaltelecomms_list(f: Frame) {
	rt.setGl("telecomms_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "telecomms_list", add);
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

// /obj/machinery/telecomms/proc/<init>  (code/game/machinery/telecomms/telecomunications.dm:19)
rt.def("/obj/machinery/telecomms/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "links", rt.list());
	$0 = $0;
	rt.setSv(f, "autolinkers", rt.list());
	$0 = $0;
	rt.setSv(f, "freq_listening", rt.list());
	return f.dot;
});

// /obj/machinery/telecomms/proc/relay_information  (code/game/machinery/telecomms/telecomunications.dm:40)  may sleep
rt.def("/obj/machinery/telecomms/proc/relay_information", function* relay_information(f: Frame, signal: Value, filter: Value, copysig: Value, amount: Value) {
	let send_count: Value = null, netlag: Value = null, machine: Value = null, copy: Value = null;
	let $e: any;
	f.vars = () => [signal, filter, copysig, amount, send_count, netlag, machine, copy, $e];
	if (live(amount) === null) {
		amount = 20;
	}
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	send_count = 0;
	if (rt.gt((netlag = (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "traffic"), 50)]))), rt.index(rt.fv(f, "data", live(signal)), "slow"))) {
		rt.setAt(rt.fv(f, "data", live(signal)), "slow", live(netlag));
	}
	machine = null;
	rt.forList(f, 0, rt.sv(f, "links"), T("/obj/machinery/telecomms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		machine = $e;
		if ((truthy(live(filter)) && !truthy(rt.op(f, "IsType", [], [live(machine), (yield* g.call(f, P("/proc/text2path"), null, [live(filter)]))])))) {
			continue;
		}
		if (!truthy(rt.fv(f, "on", live(machine)))) {
			continue;
		}
		if ((truthy(live(amount)) && rt.ge(live(send_count), live(amount)))) {
			break;
		}
		if (!isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(machine))), rt.sv(f, "listening_level"))) {
			if ((isEqual(rt.sv(f, "long_range_link"), 0) && isEqual(rt.fv(f, "long_range_link", live(machine)), 0))) {
				continue;
			}
		}
		copy = (yield* g.new_(f, T("/datum/signal"), []));
		if (truthy(live(copysig))) {
			rt.setFv(f, "transmission_method", live(copy), 2);
			rt.setFv(f, "frequency", live(copy), rt.fv(f, "frequency", live(signal)));
			rt.setFv(f, "data", live(copy), rt.alist(f, ["mob", rt.index(rt.fv(f, "data", live(signal)), "mob"), "mobtype", rt.index(rt.fv(f, "data", live(signal)), "mobtype"), "realname", rt.index(rt.fv(f, "data", live(signal)), "realname"), "name", rt.index(rt.fv(f, "data", live(signal)), "name"), "job", rt.index(rt.fv(f, "data", live(signal)), "job"), "key", rt.index(rt.fv(f, "data", live(signal)), "key"), "vmask", rt.index(rt.fv(f, "data", live(signal)), "vmask"), "compression", rt.index(rt.fv(f, "data", live(signal)), "compression"), "message", rt.index(rt.fv(f, "data", live(signal)), "message"), "radio", rt.index(rt.fv(f, "data", live(signal)), "radio"), "slow", rt.index(rt.fv(f, "data", live(signal)), "slow"), "traffic", rt.index(rt.fv(f, "data", live(signal)), "traffic"), "type", rt.index(rt.fv(f, "data", live(signal)), "type"), "server", rt.index(rt.fv(f, "data", live(signal)), "server"), "reject", rt.index(rt.fv(f, "data", live(signal)), "reject"), "level", rt.index(rt.fv(f, "data", live(signal)), "level"), "spans", rt.index(rt.fv(f, "data", live(signal)), "spans"), "verb_say", rt.index(rt.fv(f, "data", live(signal)), "verb_say"), "verb_ask", rt.index(rt.fv(f, "data", live(signal)), "verb_ask"), "verb_exclaim", rt.index(rt.fv(f, "data", live(signal)), "verb_exclaim"), "verb_yell", rt.index(rt.fv(f, "data", live(signal)), "verb_yell"), "language", rt.index(rt.fv(f, "data", live(signal)), "language")]));
			if (!truthy(rt.index(rt.fv(f, "data", live(signal)), "original"))) {
				rt.setAt(rt.fv(f, "data", live(copy)), "original", live(signal));
			} else {
				rt.setAt(rt.fv(f, "data", live(copy)), "original", rt.index(rt.fv(f, "data", live(signal)), "original"));
			}
		} else {
			copy = null;
		}
		send_count = rt.inc(live(send_count), 1);
		if (truthy((yield* g.callName(f, live(machine), "is_freq_listening", [live(signal)])))) {
			rt.incField(f, live(machine), "traffic", 1, true);
		}
		if ((truthy(live(copysig)) && truthy(live(copy)))) {
			yield* g.callName(f, live(machine), "receive_information", [live(copy), live(f.src)]);
		} else {
			yield* g.callName(f, live(machine), "receive_information", [live(signal), live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	if ((rt.gt(live(send_count), 0) && truthy((yield* g.srcCall(f, "is_freq_listening", live(signal)))))) {
		rt.incSrcVar(f, "traffic", 1, true);
	}
	return live(send_count);
}, true);

// /obj/machinery/telecomms/proc/relay_direct_information  (code/game/machinery/telecomms/telecomunications.dm:120)  may sleep
rt.def("/obj/machinery/telecomms/proc/relay_direct_information", function* relay_direct_information(f: Frame, signal: Value, machine: Value) {
	f.vars = () => [signal, machine];
	yield* g.callName(f, live(machine), "receive_information", [live(signal), live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/telecomms/proc/receive_information  (code/game/machinery/telecomms/telecomunications.dm:124)
rt.def("/obj/machinery/telecomms/proc/receive_information", function receive_information(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["signal", "machine_from"] });

// /obj/machinery/telecomms/proc/is_freq_listening  (code/game/machinery/telecomms/telecomunications.dm:128)
rt.def("/obj/machinery/telecomms/proc/is_freq_listening", function is_freq_listening(f: Frame, signal: Value) {
	if (!truthy(live(signal))) {
		return 0;
	}
	if ((truthy((rt.isIn(f, rt.fv(f, "frequency", live(signal)), rt.sv(f, "freq_listening")) ? 1 : 0)) || !truthy(rt.len(f, rt.sv(f, "freq_listening"))))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/machinery/telecomms/proc/New  (code/game/machinery/telecomms/telecomunications.dm:137)  may sleep
rt.def("/obj/machinery/telecomms/proc/New", function* New(f: Frame) {
	let position: Value = null;
	f.vars = () => [position];
	rt.modGl("telecomms_list", live(f.src), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "listening_level"))) return f.dot;
	rt.setSv(f, "listening_level", rt.gv(f, "z", (position = rt.getStep(f, live(f.src), 0))));
	return f.dot;
}, true);

// /obj/machinery/telecomms/proc/onShuttleMove  (code/game/machinery/telecomms/telecomunications.dm:147)  may sleep
rt.def("/obj/machinery/telecomms/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy(live(f.args[0])))) return f.dot;
	rt.setSv(f, "listening_level", rt.fv(f, "z", live(f.args[0])));
	return f.dot;
}, true, { args: ["T1", "rotation"] });

// /obj/machinery/telecomms/proc/Initialize  (code/game/machinery/telecomms/telecomunications.dm:152)  may sleep
rt.def("/obj/machinery/telecomms/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && truthy(rt.len(f, rt.sv(f, "autolinkers"))))) return f.dot;
	if (!truthy(rt.sv(f, "long_range_link"))) {
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [20, live(f.src), 1])), T("/obj/machinery/telecomms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.srcCall(f, "add_link", live(_T));
		}
		rt.endFor(f, 0);
	} else {
		_T = null;
		rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.srcCall(f, "add_link", live(_T));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/telecomms/proc/Destroy  (code/game/machinery/telecomms/telecomunications.dm:164)  may sleep
rt.def("/obj/machinery/telecomms/proc/Destroy", function* Destroy(f: Frame) {
	let comm: Value = null;
	let $e: any;
	f.vars = () => [comm, $e];
	(rt.modGl("telecomms_list", live(f.src), subtract));
	comm = null;
	rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		comm = $e;
		(rt.modField(f, live(comm), "links", live(f.src), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "links", rt.list());
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/telecomms/proc/add_link  (code/game/machinery/telecomms/telecomunications.dm:172)
rt.def("/obj/machinery/telecomms/proc/add_link", function add_link(f: Frame, _T: Value) {
	let position: Value = null, T_position: Value = null, x: Value = null;
	let $e: any;
	f.vars = () => [position, T_position, x, $e];
	position = rt.getStep(f, live(f.src), 0);
	T_position = rt.getStep(f, live(_T), 0);
	if (!(isEqual(rt.fv(f, "z", live(position)), rt.fv(f, "z", live(T_position))) || (truthy(rt.sv(f, "long_range_link")) && truthy(rt.fv(f, "long_range_link", live(_T)))))) return f.dot;
	if (isEqual(live(f.src), live(_T))) return f.dot;
	x = null;
	rt.forList(f, 0, rt.sv(f, "autolinkers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		x = $e;
		if (truthy((rt.isIn(f, live(x), rt.fv(f, "autolinkers", live(_T))) ? 1 : 0))) {
			(rt.modSrcVar(f, "links", live(_T), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/telecomms/proc/update_icon  (code/game/machinery/telecomms/telecomunications.dm:183)
rt.def("/obj/machinery/telecomms/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		if (truthy(rt.sv(f, "panel_open"))) {
			rt.setSv(f, "icon_state", fmt("＀_o", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		}
	} else {
		if (truthy(rt.sv(f, "panel_open"))) {
			rt.setSv(f, "icon_state", fmt("＀_o_off", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			rt.setSv(f, "icon_state", fmt("＀_off", [rt.initial(f, live(f.src), "icon_state")]));
		}
	}
	return f.dot;
});

// /obj/machinery/telecomms/proc/update_power  (code/game/machinery/telecomms/telecomunications.dm:195)
rt.def("/obj/machinery/telecomms/proc/update_power", function update_power(f: Frame) {
	if (truthy(rt.sv(f, "toggled"))) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 19))) {
			rt.setSv(f, "on", 0);
		} else {
			rt.setSv(f, "on", 1);
		}
	} else {
		rt.setSv(f, "on", 0);
	}
	return f.dot;
});

// /obj/machinery/telecomms/proc/process  (code/game/machinery/telecomms/telecomunications.dm:203)
rt.def("/obj/machinery/telecomms/proc/process", function process(f: Frame) {
	rt.callSrc(f, "update_power", []);
	rt.callSrc(f, "update_icon", []);
	if (!rt.gt(rt.sv(f, "traffic"), 0)) return f.dot;
	(rt.modSrcVar(f, "traffic", rt.sv(f, "netspeed"), subtract));
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/telecomms/proc/emp_act  (code/game/machinery/telecomms/telecomunications.dm:212)  may sleep
rt.def("/obj/machinery/telecomms/proc/emp_act", function* emp_act(f: Frame) {
	let duration: Value = null;
	f.vars = () => [duration];
	if (truthy(rt.op(f, "Prob", [], [divide(100, live(f.args[0]))]))) {
		if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 16))) {
			(rt.modSrcVar(f, "stat", 16, rt.bitOr));
			rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [subtract((duration = divide(3000, live(f.args[0]))), 20), add(live(duration), 20)])), "/obj/machinery/telecomms/proc/emp_act: spawn at game/machinery/telecomms/telecomunications.dm:215", duration);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [subtract((duration = divide(3000, live(f.args[0]))), 20), add(live(duration), 20)]))) body of /obj/machinery/telecomms/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/telecomms/proc/emp_act: spawn at game/machinery/telecomms/telecomunications.dm:215", function* (f: Frame, duration: Value) {
	f.vars = () => [duration];
	(rt.modSrcVar(f, "stat", 16777199, rt.bitAnd));
	return null;
});
