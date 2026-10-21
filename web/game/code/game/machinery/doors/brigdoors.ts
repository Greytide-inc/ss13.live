// From code/game/machinery/doors/brigdoors.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10859, "/obj/machinery/door_timer", "/obj/machinery", {
	id: null,
	activation_time: 0,
	timer_duration: 0,
	timing: 0,
	targets: null,
	Radio: null,
	anchored: 1,
	name: "door timer",
	icon: rt.rsc("icons/obj/status_display.dmi"),
	icon_state: "frame",
	desc: "A remote control for a door.",
	req_access: null,
	density: 0,
	maptext_height: 26,
	maptext_width: 32,
});

// /obj/machinery/door_timer/proc/<init>  (code/game/machinery/doors/brigdoors.dm:35)
rt.def("/obj/machinery/door_timer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "targets", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(1));
	return f.dot;
});

// /obj/machinery/door_timer/proc/New  (code/game/machinery/doors/brigdoors.dm:42)  may sleep
rt.def("/obj/machinery/door_timer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "Radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "listening", rt.sv(f, "Radio"), 0);
	return f.dot;
}, true);

// /obj/machinery/door_timer/proc/Initialize  (code/game/machinery/doors/brigdoors.dm:48)  may sleep
rt.def("/obj/machinery/door_timer/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null, F: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [M, F, C, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (rt.sv(f, "id") !== null) {
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [20, live(f.src)])), T("/obj/machinery/door/window/brigdoor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual(rt.fv(f, "id", live(M)), rt.sv(f, "id"))) {
				rt.modSrcVar(f, "targets", live(M), add);
			}
		}
		rt.endFor(f, 0);
		F = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [20, live(f.src)])), T("/obj/machinery/flasher"));
		while (($e = rt.next(f, 0)) !== undefined) {
			F = $e;
			if (isEqual(rt.fv(f, "id", live(F)), rt.sv(f, "id"))) {
				rt.modSrcVar(f, "targets", live(F), add);
			}
		}
		rt.endFor(f, 0);
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [20, live(f.src)])), T("/obj/structure/closet/secure_closet/brig"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (isEqual(rt.fv(f, "id", live(C)), rt.sv(f, "id"))) {
				rt.modSrcVar(f, "targets", live(C), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.len(f, rt.sv(f, "targets")))) {
		(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/door_timer/proc/process  (code/game/machinery/doors/brigdoors.dm:71)  may sleep
rt.def("/obj/machinery/door_timer/proc/process", function* process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "timing"))) return f.dot;
	if (rt.ge(subtract(rt.worldTime(f), rt.sv(f, "activation_time")), rt.sv(f, "timer_duration"))) {
		yield* g.srcCall(f, "timer_end");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/door_timer/proc/power_change  (code/game/machinery/doors/brigdoors.dm:81)
rt.def("/obj/machinery/door_timer/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/door_timer/proc/timer_start  (code/game/machinery/doors/brigdoors.dm:88)  may sleep
rt.def("/obj/machinery/door_timer/proc/timer_start", function* timer_start(f: Frame) {
	let door: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [door, C, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	rt.setSv(f, "activation_time", rt.worldTime(f));
	rt.setSv(f, "timing", 1);
	door = null;
	rt.forList(f, 0, rt.sv(f, "targets"), T("/obj/machinery/door/window/brigdoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		door = $e;
		if (truthy(rt.fv(f, "density", live(door)))) {
			continue;
		}
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(door), P("/obj/machinery/door/window/proc/close")]);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "targets"), T("/obj/structure/closet/secure_closet/brig"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.fv(f, "broken", live(C)))) {
			continue;
		}
		if ((truthy(rt.fv(f, "opened", live(C))) && !truthy((yield* g.callName(f, live(C), "close", []))))) {
			continue;
		}
		rt.setFv(f, "locked", live(C), 1);
		yield* g.callName(f, live(C), "update_icon", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/machinery/door_timer/proc/timer_end  (code/game/machinery/doors/brigdoors.dm:111)  may sleep
rt.def("/obj/machinery/door_timer/proc/timer_end", function* timer_end(f: Frame, forced: Value) {
	let door: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [forced, door, C, $e];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	if (!truthy(live(forced))) {
		yield* g.callName(f, rt.sv(f, "Radio"), "set_frequency", [1359]);
		yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), "Timer has expired. Releasing prisoner.", 1359, (yield* g.srcCall(f, "get_default_language"))]);
	}
	rt.setSv(f, "timing", 0);
	rt.setSv(f, "activation_time", null);
	yield* g.srcCall(f, "set_timer", 0);
	yield* g.srcCall(f, "update_icon");
	door = null;
	rt.forList(f, 0, rt.sv(f, "targets"), T("/obj/machinery/door/window/brigdoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		door = $e;
		if (!truthy(rt.fv(f, "density", live(door)))) {
			continue;
		}
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(door), P("/obj/machinery/door/window/proc/open")]);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.sv(f, "targets"), T("/obj/structure/closet/secure_closet/brig"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.fv(f, "broken", live(C)))) {
			continue;
		}
		if (truthy(rt.fv(f, "opened", live(C)))) {
			continue;
		}
		rt.setFv(f, "locked", live(C), 0);
		yield* g.callName(f, live(C), "update_icon", []);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/machinery/door_timer/proc/time_left  (code/game/machinery/doors/brigdoors.dm:140)
rt.def("/obj/machinery/door_timer/proc/time_left", function time_left(f: Frame, seconds: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [seconds, $0, $1, $2];
	if (live(seconds) === null) {
		seconds = 0;
	}
	$0 = 0;
	$1 = rt.sv(f, "timer_duration");
	if (truthy(rt.sv(f, "activation_time"))) {
		$2 = subtract(rt.worldTime(f), rt.sv(f, "activation_time"));
	} else {
		$2 = 0;
	}
	f.dot = rt.call(f, P("/proc/max"), null, [$0, subtract($1, $2)]);
	if (!truthy(live(seconds))) return f.dot;
	(f.dot = rt.modify(live(f.dot), 10, divide));
	return f.dot;
});

// /obj/machinery/door_timer/proc/set_timer  (code/game/machinery/doors/brigdoors.dm:145)
rt.def("/obj/machinery/door_timer/proc/set_timer", function set_timer(f: Frame, value: Value) {
	let new_time: Value = null;
	f.vars = () => [new_time];
	f.dot = (isEqual((new_time = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(value), 9000])])), rt.sv(f, "timer_duration")) ? 1 : 0);
	rt.setSv(f, "timer_duration", live(new_time));
	return f.dot;
});

// /obj/machinery/door_timer/proc/ui_interact  (code/game/machinery/doors/brigdoors.dm:151)  may sleep
rt.def("/obj/machinery/door_timer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "brig_timer", rt.sv(f, "name"), 300, 200, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/door_timer/proc/update_icon  (code/game/machinery/doors/brigdoors.dm:161)
rt.def("/obj/machinery/door_timer/proc/update_icon", function update_icon(f: Frame) {
	let disp1: Value = null, time_left: Value = null, disp2: Value = null;
	f.vars = () => [disp1, time_left, disp2];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "frame");
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.callSrc(f, "set_picture", ["ai_bsod"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "timing"))) {
		disp1 = rt.sv(f, "id");
		time_left = rt.callSrc(f, "time_left", ["seconds", 1], rt.Args.Named);
		if (rt.gt(rt.length((disp2 = fmt("＀~＀", [rt.call(f, P("/proc/add_zero"), null, [rt.call(f, P("/proc/num2text"), null, [rt.modulus(divide(live(time_left), 60), 60)]), 2]), rt.call(f, P("/proc/add_zero"), null, [rt.call(f, P("/proc/num2text"), null, [rt.modulus(live(time_left), 60)]), 2])]))), 5)) {
			disp2 = "Error";
		}
		rt.callSrc(f, "update_display", [live(disp1), live(disp2)]);
	} else {
		if (truthy(rt.sv(f, "maptext"))) {
			rt.setSv(f, "maptext", "");
		}
	}
	return live(f.dot);
});

// /obj/machinery/door_timer/proc/set_picture  (code/game/machinery/doors/brigdoors.dm:185)
rt.def("/obj/machinery/door_timer/proc/set_picture", function set_picture(f: Frame, state: Value) {
	if (truthy(rt.sv(f, "maptext"))) {
		rt.setSv(f, "maptext", "");
	}
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/status_display.dmi"), live(state)])]);
	return f.dot;
});

// /obj/machinery/door_timer/proc/update_display  (code/game/machinery/doors/brigdoors.dm:193)
rt.def("/obj/machinery/door_timer/proc/update_display", function update_display(f: Frame, line1: Value, line2: Value) {
	let new_text: Value = null;
	f.vars = () => [new_text];
	new_text = fmt("<div style=\"font-size:＀;color:＀;font:'＀';text-align:center;\" valign=\"top\">＀<br>＀</div>", ["5pt", "#09f", "Arial Black", live(line1), live(line2)]);
	if (isEqual(rt.sv(f, "maptext"), live(new_text))) return f.dot;
	rt.setSv(f, "maptext", live(new_text));
	return f.dot;
});

// /obj/machinery/door_timer/proc/ui_data  (code/game/machinery/doors/brigdoors.dm:198)
rt.def("/obj/machinery/door_timer/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, time_left: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [data, time_left, F, $e];
	data = rt.list();
	time_left = rt.callSrc(f, "time_left", ["seconds", 1], rt.Args.Named);
	rt.setAt(live(data), "seconds", rt.call(f, P("/proc/round"), null, [rt.modulus(live(time_left), 60)]));
	rt.setAt(live(data), "minutes", rt.call(f, P("/proc/round"), null, [divide(subtract(live(time_left), rt.at(live(data), "seconds")), 60)]));
	rt.setAt(live(data), "timing", rt.sv(f, "timing"));
	rt.setAt(live(data), "flash_charging", 0);
	F = null;
	rt.forList(f, 0, rt.sv(f, "targets"), T("/obj/machinery/flasher"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if ((truthy(rt.fv(f, "last_flash", live(F))) && rt.gt(add(rt.fv(f, "last_flash", live(F)), 150), rt.worldTime(f)))) {
			rt.setAt(live(data), "flash_charging", 1);
			break;
		}
	}
	rt.endFor(f, 0);
	return live(data);
});

// /obj/machinery/door_timer/proc/ui_act  (code/game/machinery/doors/brigdoors.dm:212)  may sleep
rt.def("/obj/machinery/door_timer/proc/ui_act", function* ui_act(f: Frame) {
	let value: Value = null, F: Value = null, preset: Value = null, preset_time: Value = null;
	let $0: any, $e: any;
	f.vars = () => [value, F, preset, preset_time, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	f.dot = 1;
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Access denied.</span>"]);
		return 0;
	}
	$0 = live(f.args[0]);
	if ($0 === "time") {
		if (truthy((value = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]))))) {
			f.dot = (yield* g.srcCall(f, "set_timer", add((yield* g.srcCall(f, "time_left")), live(value))));
		}
	} else if ($0 === "start") {
		yield* g.srcCall(f, "timer_start");
	} else if ($0 === "stop") {
		yield* g.callSrc(f, "timer_end", ["forced", 1], rt.Args.Named);
	} else if ($0 === "flash") {
		F = null;
		rt.forList(f, 0, rt.sv(f, "targets"), T("/obj/machinery/flasher"));
		while (($e = rt.next(f, 0)) !== undefined) {
			F = $e;
			yield* g.callName(f, live(F), "flash", []);
		}
		rt.endFor(f, 0);
	} else if ($0 === "preset") {
		preset = rt.at(live(f.args[1]), "preset");
		preset_time = (yield* g.srcCall(f, "time_left"));
		$0 = live(preset);
		if ($0 === "short") {
			preset_time = 1200;
		} else if ($0 === "medium") {
			preset_time = 1800;
		} else if ($0 === "long") {
			preset_time = 3000;
		}
		f.dot = (yield* g.srcCall(f, "set_timer", live(preset_time)));
		if (!truthy(rt.sv(f, "timing"))) return f.dot;
		rt.setSv(f, "activation_time", rt.worldTime(f));
	} else {
		f.dot = 0;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
