// From code/game/machinery/magnet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10804, "/obj/machinery/magnetic_module", "/obj/machinery", {
	freq: 1449,
	electricity_level: 1,
	magnetic_field: 1,
	code: 0,
	center: null,
	on: 0,
	pulling: 0,
	center_x: 0,
	center_y: 0,
	max_dist: 20,
	level: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 50,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "floor_magnet-f",
	name: "electromagnetic generator",
	desc: "A device that uses station power to create points of magnetic energy.",
	layer: 2.5,
});

// /obj/machinery/magnetic_module/proc/New  (code/game/machinery/magnet.dm:33)  may sleep
rt.def("/obj/machinery/magnetic_module/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "hide", rt.gv(f, "intact", (_T = rt.sv(f, "loc"))));
	rt.setSv(f, "center", live(_T));
	rt.spawnTail(f, 10, "/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:38", _T);
	rt.spawnTail(f, 0, "/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:42", _T);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/magnetic_module/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:42", function* (f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.srcCall(f, "magnetic_process");
	return null;
});

// a spawn(10) body of /obj/machinery/magnetic_module/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:38", function* (f: Frame, _T: Value) {
	f.vars = () => [_T];
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "freq"), rt.gl("RADIO_MAGNETS")]);
	}
	return null;
});

// /obj/machinery/magnetic_module/proc/Destroy  (code/game/machinery/magnet.dm:47)  may sleep
rt.def("/obj/machinery/magnetic_module/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "freq")]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "center", null);
	return f.dot;
}, true);

// /obj/machinery/magnetic_module/proc/hide  (code/game/machinery/magnet.dm:53)
rt.def("/obj/machinery/magnetic_module/proc/hide", function hide(f: Frame, intact: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(live(intact))) {
		$0 = 100;
	} else {
		$0 = 0;
	}
	rt.setSv(f, "invisibility", $0);
	rt.callSrc(f, "updateicon", []);
	return f.dot;
});

// /obj/machinery/magnetic_module/proc/updateicon  (code/game/machinery/magnet.dm:58)
rt.def("/obj/machinery/magnetic_module/proc/updateicon", function updateicon(f: Frame) {
	let state: Value = null, onstate: Value = null;
	f.vars = () => [state, onstate];
	state = "floor_magnet";
	onstate = "";
	if (!truthy(rt.sv(f, "on"))) {
		onstate = "0";
	}
	if (truthy(rt.sv(f, "invisibility"))) {
		rt.setSv(f, "icon_state", fmt("＀＀-f", [live(state), live(onstate)]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀＀", [live(state), live(onstate)]));
	}
	return f.dot;
});

// /obj/machinery/magnetic_module/proc/receive_signal  (code/game/machinery/magnet.dm:71)
rt.def("/obj/machinery/magnetic_module/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let command: Value = null, modifier: Value = null, signal_code: Value = null;
	f.vars = () => [command, modifier, signal_code];
	command = rt.index(rt.fv(f, "data", live(signal)), "command");
	modifier = rt.index(rt.fv(f, "data", live(signal)), "modifier");
	signal_code = rt.index(rt.fv(f, "data", live(signal)), "code");
	if (!(truthy(live(command)) && isEqual(live(signal_code), rt.sv(f, "code")))) return f.dot;
	rt.callSrc(f, "Cmd", [live(command), live(modifier)]);
	return f.dot;
});

// /obj/machinery/magnetic_module/proc/Cmd  (code/game/machinery/magnet.dm:83)
rt.def("/obj/machinery/magnetic_module/proc/Cmd", function Cmd(f: Frame, command: Value, modifier: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(live(command))) return f.dot;
	$0 = live(command);
	if ($0 === "set-electriclevel") {
		if (truthy(live(modifier))) {
			rt.setSv(f, "electricity_level", live(modifier));
		}
	} else if ($0 === "set-magneticfield") {
		if (truthy(live(modifier))) {
			rt.setSv(f, "magnetic_field", live(modifier));
		}
	} else if ($0 === "add-elec") {
		rt.incSrcVar(f, "electricity_level", 1, true);
		if (rt.gt(rt.sv(f, "electricity_level"), 12)) {
			rt.setSv(f, "electricity_level", 12);
		}
	} else if ($0 === "sub-elec") {
		rt.incSrcVar(f, "electricity_level", -1, true);
		if (rt.le(rt.sv(f, "electricity_level"), 0)) {
			rt.setSv(f, "electricity_level", 1);
		}
	} else if ($0 === "add-mag") {
		rt.incSrcVar(f, "magnetic_field", 1, true);
		if (rt.gt(rt.sv(f, "magnetic_field"), 4)) {
			rt.setSv(f, "magnetic_field", 4);
		}
	} else if ($0 === "sub-mag") {
		rt.incSrcVar(f, "magnetic_field", -1, true);
		if (rt.le(rt.sv(f, "magnetic_field"), 0)) {
			rt.setSv(f, "magnetic_field", 1);
		}
	} else if ($0 === "set-x") {
		if (truthy(live(modifier))) {
			rt.setSv(f, "center_x", live(modifier));
		}
	} else if ($0 === "set-y") {
		if (truthy(live(modifier))) {
			rt.setSv(f, "center_y", live(modifier));
		}
	} else if ($0 === "N") {
		rt.incSrcVar(f, "center_y", 1, true);
	} else if ($0 === "S") {
		rt.incSrcVar(f, "center_y", -1, true);
	} else if ($0 === "E") {
		rt.incSrcVar(f, "center_x", 1, true);
	} else if ($0 === "W") {
		rt.incSrcVar(f, "center_x", -1, true);
	} else if ($0 === "C") {
		rt.setSv(f, "center_x", 0);
		rt.setSv(f, "center_y", 0);
	} else if ($0 === "R") {
		rt.setSv(f, "center_x", rt.call(f, P("/proc/rand"), null, [rt.neg(rt.sv(f, "max_dist")), rt.sv(f, "max_dist")]));
		rt.setSv(f, "center_y", rt.call(f, P("/proc/rand"), null, [rt.neg(rt.sv(f, "max_dist")), rt.sv(f, "max_dist")]));
	} else if ($0 === "set-code") {
		if (truthy(live(modifier))) {
			rt.setSv(f, "code", live(modifier));
		}
	} else if ($0 === "toggle-power") {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		if (!truthy(rt.sv(f, "on"))) return f.dot;
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/magnetic_module/proc/magnetic_process")]);
	}
	return f.dot;
});

// /obj/machinery/magnetic_module/proc/process  (code/game/machinery/magnet.dm:142)
rt.def("/obj/machinery/magnetic_module/proc/process", function process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "on", 0);
	}
	if (rt.le(rt.sv(f, "electricity_level"), 0)) {
		rt.setSv(f, "electricity_level", 1);
	}
	if (rt.le(rt.sv(f, "magnetic_field"), 0)) {
		rt.setSv(f, "magnetic_field", 1);
	}
	if (rt.gt(rt.op(f, "Abs", [], [rt.sv(f, "center_x")]), rt.sv(f, "max_dist"))) {
		rt.setSv(f, "center_x", rt.sv(f, "max_dist"));
	}
	if (rt.gt(rt.op(f, "Abs", [], [rt.sv(f, "center_y")]), rt.sv(f, "max_dist"))) {
		rt.setSv(f, "center_y", rt.sv(f, "max_dist"));
	}
	if (rt.gt(rt.sv(f, "magnetic_field"), 4)) {
		rt.setSv(f, "magnetic_field", 4);
	}
	if (rt.gt(rt.sv(f, "electricity_level"), 12)) {
		rt.setSv(f, "electricity_level", 12);
	}
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "use_power", 2);
		rt.setSv(f, "active_power_usage", multiply(rt.sv(f, "electricity_level"), 15));
	} else {
		rt.setSv(f, "use_power", 0);
	}
	rt.callSrc(f, "updateicon", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/magnetic_module/proc/magnetic_process  (code/game/machinery/magnet.dm:188)  may sleep
rt.def("/obj/machinery/magnetic_module/proc/magnetic_process", function* magnetic_process(f: Frame) {
	let M: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [M, S, $e];
	if (truthy(rt.sv(f, "pulling"))) {
		return live(f.dot);
	}
	while (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "pulling", 1);
		rt.setSv(f, "center", rt.locate(add(rt.sv(f, "x"), rt.sv(f, "center_x")), add(rt.sv(f, "y"), rt.sv(f, "center_y")), rt.sv(f, "z")));
		if (truthy(rt.sv(f, "center"))) {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "magnetic_field"), rt.sv(f, "center")])), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((!truthy(rt.fv(f, "anchored", live(M))) && truthy(rt.bitAnd(rt.fv(f, "flags", live(M)), 64)))) {
					yield* g.call(f, P("/proc/step_towards"), null, [live(M), rt.sv(f, "center")]);
				}
			}
			rt.endFor(f, 0);
			S = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "magnetic_field"), rt.sv(f, "center")])), T("/mob/living/silicon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((rt.istype(live(S), T("/mob/living/silicon/ai")) ? 1 : 0))) {
					continue;
				}
				yield* g.call(f, P("/proc/step_towards"), null, [live(S), rt.sv(f, "center")]);
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "use_power", multiply(rt.sv(f, "electricity_level"), 5));
		yield* g.call(f, P("/proc/sleep"), null, [subtract(13, rt.sv(f, "electricity_level"))]);
	}
	rt.setSv(f, "pulling", 0);
	return f.dot;
}, true);

rt.type(10805, "/obj/machinery/magnetic_controller", "/obj/machinery", {
	frequency: 1449,
	code: 0,
	magnets: null,
	title: "Magnetic Control Console",
	autolink: 0,
	pathpos: 1,
	path: "w;e;e;w;s;n;n;s",
	speed: 1,
	rpath: null,
	moving: 0,
	looping: 0,
	radio_connection: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 45,
	name: "magnetic control console",
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "airlock_control_standby",
	density: 0,
});

// /obj/machinery/magnetic_controller/proc/<init>  (code/game/machinery/magnet.dm:217)
rt.def("/obj/machinery/magnetic_controller/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "magnets", rt.list());
	$0 = $0;
	rt.setSv(f, "rpath", rt.list());
	return f.dot;
});

// /obj/machinery/magnetic_controller/proc/New  (code/game/machinery/magnet.dm:233)  may sleep
rt.def("/obj/machinery/magnetic_controller/proc/New", function* New(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "autolink"))) {
		M = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/magnetic_module"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((isEqual(rt.fv(f, "freq", live(M)), rt.sv(f, "frequency")) && isEqual(rt.fv(f, "code", live(M)), rt.sv(f, "code")))) {
				yield* g.callName(f, rt.sv(f, "magnets"), "Add", [live(M)]);
			}
		}
		rt.endFor(f, 0);
	}
	rt.spawnTail(f, 45, "/obj/machinery/magnetic_controller/proc/New: spawn at game/machinery/magnet.dm:241", M);
	if (!truthy(rt.sv(f, "path"))) return f.dot;
	yield* g.srcCall(f, "filter_path");
	return f.dot;
}, true);

// a spawn(45) body of /obj/machinery/magnetic_controller/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/New: spawn at game/machinery/magnet.dm:241", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	if (truthy(rt.gl("SSradio"))) {
		rt.setSv(f, "radio_connection", (yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_MAGNETS")])));
	}
	return null;
});

// /obj/machinery/magnetic_controller/proc/Destroy  (code/game/machinery/magnet.dm:251)  may sleep
rt.def("/obj/machinery/magnetic_controller/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "magnets", null);
	rt.setSv(f, "rpath", null);
	return f.dot;
}, true);

// /obj/machinery/magnetic_controller/proc/process  (code/game/machinery/magnet.dm:257)
rt.def("/obj/machinery/magnetic_controller/proc/process", function process(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!(isEqual(rt.len(f, rt.sv(f, "magnets")), 0) && truthy(rt.sv(f, "autolink")))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/magnetic_module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((isEqual(rt.fv(f, "freq", live(M)), rt.sv(f, "frequency")) && isEqual(rt.fv(f, "code", live(M)), rt.sv(f, "code")))) {
			rt.callName(f, rt.sv(f, "magnets"), "Add", [live(M)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/magnetic_controller/proc/attack_ai  (code/game/machinery/magnet.dm:264)  may sleep
rt.def("/obj/machinery/magnetic_controller/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/magnetic_controller/proc/attack_hand  (code/game/machinery/magnet.dm:267)  may sleep
rt.def("/obj/machinery/magnetic_controller/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, i: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, dat, i, M, $0, $1, $2, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<B>Magnetic Control Console</B><BR><BR>";
	if (!truthy(rt.sv(f, "autolink"))) {
		dat = rt.modify(live(dat), fmt("\n\t\tFrequency: <a href='?src=＃;operation=setfreq'>＀</a><br>\n\t\tCode: <a href='?src=＃;operation=setfreq'>＀</a><br>\n\t\t<a href='?src=＃;operation=probe'>Probe Generators</a><br>\n\t\t", [live(f.src), rt.sv(f, "frequency"), live(f.src), rt.sv(f, "code"), live(f.src)]), add);
	}
	if (rt.ge(rt.len(f, rt.sv(f, "magnets")), 1)) {
		dat = rt.modify(live(dat), "Magnets confirmed: <br>", add);
		i = 0;
		M = null;
		rt.forList(f, 0, rt.sv(f, "magnets"), T("/obj/machinery/magnetic_module"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			i = rt.inc(live(i), 1);
			$0 = live(i);
			$1 = live(f.src);
			if (truthy(rt.fv(f, "on", live(M)))) {
				$2 = "On";
			} else {
				$2 = "Off";
			}
			dat = rt.modify(live(dat), fmt("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;< [＀] (<a href='?src=＃;radio-op=togglepower'>＀</a>) | Electricity level: <a href='?src=＃;radio-op=minuselec'>-</a> ＀ <a href='?src=＃;radio-op=pluselec'>+</a>; Magnetic field: <a href='?src=＃;radio-op=minusmag'>-</a> ＀ <a href='?src=＃;radio-op=plusmag'>+</a><br>", [$0, $1, $2, live(f.src), rt.fv(f, "electricity_level", live(M)), live(f.src), live(f.src), rt.fv(f, "magnetic_field", live(M)), live(f.src)]), add);
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), fmt("<br>Speed: <a href='?src=＃;operation=minusspeed'>-</a> ＀ <a href='?src=＃;operation=plusspeed'>+</a><br>", [live(f.src), rt.sv(f, "speed"), live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("Path: {<a href='?src=＃;operation=setpath'>＀</a>}<br>", [live(f.src), rt.sv(f, "path")]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "moving"))) {
		$1 = "Enabled";
	} else {
		$1 = "Disabled";
	}
	dat = rt.modify(live(dat), fmt("Moving: <a href='?src=＃;operation=togglemoving'>＀</a>", [$0, $1]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=magnet;size=400x500"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "magnet"]);
	return f.dot;
}, true);

// /obj/machinery/magnetic_controller/proc/Topic  (code/game/machinery/magnet.dm:295)  may sleep
rt.def("/obj/machinery/magnetic_controller/proc/Topic", function* Topic(f: Frame) {
	let signal: Value = null, newpath: Value = null;
	let $0: any;
	f.vars = () => [signal, newpath, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "radio-op"))) {
		rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
		rt.setFv(f, "source", live(signal), live(f.src));
		rt.setFv(f, "frequency", live(signal), rt.sv(f, "frequency"));
		rt.setAt(rt.fv(f, "data", live(signal)), "code", rt.sv(f, "code"));
		$0 = rt.at(live(f.args[1]), "radio-op");
		if ($0 === "togglepower") {
			rt.setAt(rt.fv(f, "data", live(signal)), "command", "toggle-power");
		} else if ($0 === "minuselec") {
			rt.setAt(rt.fv(f, "data", live(signal)), "command", "sub-elec");
		} else if ($0 === "pluselec") {
			rt.setAt(rt.fv(f, "data", live(signal)), "command", "add-elec");
		} else if ($0 === "minusmag") {
			rt.setAt(rt.fv(f, "data", live(signal)), "command", "sub-mag");
		} else if ($0 === "plusmag") {
			rt.setAt(rt.fv(f, "data", live(signal)), "command", "add-mag");
		}
		yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "filter", rt.gl("RADIO_MAGNETS")], rt.Args.Named);
		rt.spawnTail(f, 1, "/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:328", signal, newpath);
	}
	if (truthy(rt.at(live(f.args[1]), "operation"))) {
		$0 = rt.at(live(f.args[1]), "operation");
		if ($0 === "plusspeed") {
			rt.incSrcVar(f, "speed", 1, true);
			if (rt.gt(rt.sv(f, "speed"), 10)) {
				rt.setSv(f, "speed", 10);
			}
		} else if ($0 === "minusspeed") {
			rt.incSrcVar(f, "speed", -1, true);
			if (rt.le(rt.sv(f, "speed"), 0)) {
				rt.setSv(f, "speed", 1);
			}
		} else if ($0 === "setpath") {
			if ((truthy((newpath = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [rt.sv(f, "path"), null, "Please define a new path!", live(f.usr), null]))])), 1, 1024])))) && !isEqual(live(newpath), ""))) {
				rt.setSv(f, "moving", 0);
				rt.setSv(f, "path", live(newpath));
				rt.setSv(f, "pathpos", 1);
				yield* g.srcCall(f, "filter_path");
			}
		} else if ($0 === "togglemoving") {
			rt.setSv(f, "moving", (!truthy(rt.sv(f, "moving")) ? 1 : 0));
			if (truthy(rt.sv(f, "moving"))) {
				rt.spawnTail(f, 0, "/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:352", signal, newpath);
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// a spawn(0) body of /obj/machinery/magnetic_controller/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:352", function* (f: Frame, signal: Value, newpath: Value) {
	f.vars = () => [signal, newpath];
	yield* g.srcCall(f, "MagnetMove");
	return null;
});

// a spawn(1) body of /obj/machinery/magnetic_controller/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:328", function* (f: Frame, signal: Value, newpath: Value) {
	f.vars = () => [signal, newpath];
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// /obj/machinery/magnetic_controller/proc/MagnetMove  (code/game/machinery/magnet.dm:360)  may sleep
rt.def("/obj/machinery/magnetic_controller/proc/MagnetMove", function* MagnetMove(f: Frame) {
	let signal: Value = null, nextmove: Value = null;
	f.vars = () => [signal, nextmove];
	if (truthy(rt.sv(f, "looping"))) {
		return live(f.dot);
	}
	while (truthy(rt.sv(f, "moving")) && rt.ge(rt.len(f, rt.sv(f, "rpath")), 1)) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			break;
		}
		rt.setSv(f, "looping", 1);
		rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 1);
		rt.setFv(f, "source", live(signal), live(f.src));
		rt.setFv(f, "frequency", live(signal), rt.sv(f, "frequency"));
		rt.setAt(rt.fv(f, "data", live(signal)), "code", rt.sv(f, "code"));
		if (rt.gt(rt.sv(f, "pathpos"), rt.len(f, rt.sv(f, "rpath")))) {
			rt.setSv(f, "pathpos", 1);
		}
		if (!truthy((rt.isIn(f, (nextmove = (yield* g.call(f, P("/proc/uppertext"), null, [rt.index(rt.sv(f, "rpath"), rt.sv(f, "pathpos"))]))), rt.list("N", "S", "E", "W", "C", "R")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(signal)]);
			break;
		}
		rt.setAt(rt.fv(f, "data", live(signal)), "command", live(nextmove));
		rt.incSrcVar(f, "pathpos", 1, true);
		rt.spawnTail(f, 0, "/obj/machinery/magnetic_controller/proc/MagnetMove: spawn at game/machinery/magnet.dm:392", signal, nextmove);
		if (isEqual(rt.sv(f, "speed"), 10)) {
			yield* g.call(f, P("/proc/sleep"), null, [1]);
		} else {
			yield* g.call(f, P("/proc/sleep"), null, [subtract(12, rt.sv(f, "speed"))]);
		}
	}
	rt.setSv(f, "looping", 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/magnetic_controller/proc/MagnetMove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/MagnetMove: spawn at game/machinery/magnet.dm:392", function* (f: Frame, signal: Value, nextmove: Value) {
	f.vars = () => [signal, nextmove];
	yield* g.callName(f, rt.sv(f, "radio_connection"), "post_signal", [null, live(f.src), null, live(signal), "filter", rt.gl("RADIO_MAGNETS")], rt.Args.Named);
	return null;
});

// /obj/machinery/magnetic_controller/proc/filter_path  (code/game/machinery/magnet.dm:406)
rt.def("/obj/machinery/magnetic_controller/proc/filter_path", function filter_path(f: Frame) {
	let maximum_character: Value = null, i: Value = null, nextchar: Value = null;
	f.vars = () => [maximum_character, i, nextchar];
	rt.setSv(f, "rpath", rt.list());
	maximum_character = rt.call(f, P("/proc/min"), null, [50, rt.length(rt.sv(f, "path"))]);
	i = null;
	i = 1;
	while (rt.le(live(i), live(maximum_character))) {
		if (!truthy((rt.isIn(f, (nextchar = rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "path"), live(i), add(live(i), 1)])), rt.list(";", "&", "*", " ")) ? 1 : 0))) {
			rt.modSrcVar(f, "rpath", rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "path"), live(i), add(live(i), 1)]), add);
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
});
