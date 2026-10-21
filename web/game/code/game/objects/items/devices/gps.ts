// From code/game/objects/items/devices/gps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalGPS_list  (code/game/objects/items/devices/gps.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalGPS_list", function InitGlobalGPS_list(f: Frame) {
	rt.setGl("GPS_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "GPS_list", add);
	return f.dot;
});

rt.type(9232, "/obj/item/device/gps", "/obj/item/device", {
	gpstag: "COM0",
	emped: 0,
	locked_location: null,
	tracking: 1,
	updating: 1,
	global_mode: 1,
	name: "global positioning system",
	desc: "Helping lost spacemen find their way through the planets since 2016. Alt+click to toggle power.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "gps-c",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "materials=2;magnets=1;bluespace=2",
	unique_rename: 1,
});

// /obj/item/device/gps/proc/Initialize  (code/game/objects/items/devices/gps.dm:20)  may sleep
rt.def("/obj/item/device/gps/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("GPS_list", live(f.src), add);
	rt.setSv(f, "name", fmt("global positioning system (＀)", [rt.sv(f, "gpstag")]));
	yield* g.srcCall(f, "add_overlay", "working");
	return f.dot;
}, true);

// /obj/item/device/gps/proc/Destroy  (code/game/objects/items/devices/gps.dm:26)  may sleep
rt.def("/obj/item/device/gps/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("GPS_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/gps/proc/emp_act  (code/game/objects/items/devices/gps.dm:31)  may sleep
rt.def("/obj/item/device/gps/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	rt.setSv(f, "emped", 1);
	yield* g.srcCall(f, "cut_overlay", "working");
	yield* g.srcCall(f, "add_overlay", "emp");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/gps/proc/reboot")])), 300, 2]);
	yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/device/gps/proc/reboot  (code/game/objects/items/devices/gps.dm:38)
rt.def("/obj/item/device/gps/proc/reboot", function reboot(f: Frame) {
	rt.setSv(f, "emped", 0);
	rt.callSrc(f, "cut_overlay", ["emp"]);
	rt.callSrc(f, "add_overlay", ["working"]);
	return f.dot;
});

// /obj/item/device/gps/proc/AltClick  (code/game/objects/items/devices/gps.dm:42)
rt.def("/obj/item/device/gps/proc/AltClick", function AltClick(f: Frame, user: Value) {
	rt.callSrc(f, "toggletracking", [live(user)]);
	return f.dot;
});

// /obj/item/device/gps/proc/toggletracking  (code/game/objects/items/devices/gps.dm:45)
rt.def("/obj/item/device/gps/proc/toggletracking", function toggletracking(f: Frame, user: Value) {
	if (!truthy(rt.callName(f, live(user), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "emped"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "It's busted!"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "tracking"))) {
		rt.callSrc(f, "cut_overlay", ["working"]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is no longer tracking, or visible to other GPS devices.", [live(f.src)])]);
		rt.setSv(f, "tracking", 0);
	} else {
		rt.callSrc(f, "add_overlay", ["working"]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is now tracking, and visible to other GPS devices.", [live(f.src)])]);
		rt.setSv(f, "tracking", 1);
	}
	return f.dot;
});

// /obj/item/device/gps/proc/ui_interact  (code/game/objects/items/devices/gps.dm:62)  may sleep
rt.def("/obj/item/device/gps/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let gps_window_height: Value = null;
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state, gps_window_height];
	if (live(ui_key) === null) {
		ui_key = "gps";
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
	if (truthy(rt.sv(f, "emped"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ fizzles weakly.", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) {
		gps_window_height = add(300, multiply(rt.len(f, rt.gl("GPS_list")), 20));
		yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "gps", "Global Positioning System", 600, live(gps_window_height), live(master_ui), live(state)]))), "open", []);
	}
	yield* g.callName(f, live(ui), "set_autoupdate", ["state", rt.sv(f, "updating")], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/device/gps/proc/ui_data  (code/game/objects/items/devices/gps.dm:74)
rt.def("/obj/item/device/gps/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, curr: Value = null, signals: Value = null, gps: Value = null, G: Value = null, pos: Value = null, gps_area: Value = null, signal: Value = null, direction: Value = null;
	let $e: any;
	f.vars = () => [data, curr, signals, gps, G, pos, gps_area, signal, direction, $e];
	rt.setAt((data = rt.list()), "power", rt.sv(f, "tracking"));
	rt.setAt(live(data), "tag", rt.sv(f, "gpstag"));
	rt.setAt(live(data), "updating", rt.sv(f, "updating"));
	rt.setAt(live(data), "globalmode", rt.sv(f, "global_mode"));
	if ((!truthy(rt.sv(f, "tracking")) || truthy(rt.sv(f, "emped")))) {
		return live(data);
	}
	curr = rt.getStep(f, live(f.src), 0);
	rt.setAt(live(data), "current", fmt("＀ (＀, ＀, ＀)", [rt.call(f, P("/proc/get_area_name"), null, [live(curr)]), rt.fv(f, "x", live(curr)), rt.fv(f, "y", live(curr)), rt.fv(f, "z", live(curr))]));
	signals = rt.list();
	rt.setAt(live(data), "signals", rt.list());
	gps = null;
	rt.forList(f, 0, rt.gl("GPS_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		gps = $e;
		if (((truthy(rt.gv(f, "emped", (G = live(gps)))) || !truthy(rt.fv(f, "tracking", live(G)))) || isEqual(live(G), live(f.src)))) {
			continue;
		}
		pos = rt.getStep(f, live(G), 0);
		if ((!truthy(rt.sv(f, "global_mode")) && !isEqual(rt.fv(f, "z", live(pos)), rt.fv(f, "z", live(curr))))) {
			continue;
		}
		gps_area = rt.call(f, P("/proc/get_area_name"), null, [live(G)]);
		rt.setAt((signal = rt.list()), "entrytag", rt.fv(f, "gpstag", live(G)));
		rt.setAt(live(signal), "area", rt.call(f, P("/proc/format_text"), null, [live(gps_area)]));
		rt.setAt(live(signal), "coord", fmt("＀, ＀, ＀", [rt.fv(f, "x", live(pos)), rt.fv(f, "y", live(pos)), rt.fv(f, "z", live(pos))]));
		if (isEqual(rt.fv(f, "z", live(pos)), rt.fv(f, "z", live(curr)))) {
			rt.setAt(live(signal), "dist", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/get_dist"), null, [live(curr), live(pos)]), 0]));
			rt.setAt(live(signal), "degrees", rt.call(f, P("/proc/round"), null, [rt.call(f, P("/proc/Get_Angle"), null, [live(curr), live(pos)])]));
			if (!truthy((direction = rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(curr), live(pos))])])))) {
				direction = "CENTER";
				rt.setAt(live(signal), "degrees", "N/A");
			}
			rt.setAt(live(signal), "direction", live(direction));
		}
		signals = rt.modify(live(signals), rt.list(live(signal)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "signals", live(signals));
	return live(data);
});

// /obj/item/device/gps/proc/ui_act  (code/game/objects/items/devices/gps.dm:116)  may sleep
rt.def("/obj/item/device/gps/proc/ui_act", function* ui_act(f: Frame) {
	let a: Value = null;
	let $0: any;
	f.vars = () => [a, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "rename") {
		rt.setSv(f, "gpstag", (a = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(a = (yield* g.op(f, "Prompt", [2], [null, rt.sv(f, "gpstag"), rt.sv(f, "name"), "Please enter desired tag.", null])))])), 1, 20]))));
		f.dot = 1;
	} else if ($0 === "power") {
		yield* g.srcCall(f, "toggletracking", live(f.usr));
		f.dot = 1;
	} else if ($0 === "updating") {
		rt.setSv(f, "updating", (!truthy(rt.sv(f, "updating")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "globalmode") {
		rt.setSv(f, "global_mode", (!truthy(rt.sv(f, "global_mode")) ? 1 : 0));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/item/device/gps/proc/Topic  (code/game/objects/items/devices/gps.dm:135)  may sleep
rt.def("/obj/item/device/gps/proc/Topic", function* Topic(f: Frame) {
	let a: Value = null;
	f.vars = () => [a];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "tag"))) return f.dot;
	a = (yield* g.call(f, P("/proc/uppertext"), null, [(yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(a = (yield* g.op(f, "Prompt", [2], [null, rt.sv(f, "gpstag"), rt.sv(f, "name"), "Please enter desired tag.", null])))])), 1, 5]))]));
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1)) return f.dot;
	rt.setSv(f, "gpstag", live(a));
	rt.setSv(f, "name", fmt("global positioning system (＀)", [rt.sv(f, "gpstag")]));
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(9247, "/obj/item/device/gps/visible_debug", "/obj/item/device/gps", {
	tagged: null,
	gpstag: "ADMIN",
	name: "visible GPS",
	desc: "This admin-spawn GPS unit leaves the coordinates visible on any turf that it passes over, for debugging. Especially useful for marking the area around the transition edges.",
});

// /obj/item/device/gps/visible_debug/proc/Initialize  (code/game/objects/items/devices/gps.dm:188)  may sleep
rt.def("/obj/item/device/gps/visible_debug/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "tagged", rt.list());
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/gps/visible_debug/proc/process  (code/game/objects/items/devices/gps.dm:193)
rt.def("/obj/item/device/gps/visible_debug/proc/process", function process(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	rt.setFv(f, "color", live(_T), rt.op(f, "Rgb", [1, 3], [rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255])]));
	rt.setFv(f, "maptext", live(_T), fmt("＀,＀,＀", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]));
	(rt.modSrcVar(f, "tagged", live(_T), rt.bitOr));
	return f.dot;
}, false, { waitfor: false });

// /obj/item/device/gps/visible_debug/proc/clear  (code/game/objects/items/devices/gps.dm:202)
rt.def("/obj/item/device/gps/visible_debug/proc/clear", function clear(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	while (truthy(rt.len(f, rt.sv(f, "tagged")))) {
		rt.setFv(f, "color", (_T = rt.call(f, P("/proc/pop"), null, [rt.sv(f, "tagged")])), rt.initial(f, live(_T), "color"));
		rt.setFv(f, "maptext", live(_T), rt.initial(f, live(_T), "maptext"));
	}
	return f.dot;
});

// /obj/item/device/gps/visible_debug/proc/Destroy  (code/game/objects/items/devices/gps.dm:209)  may sleep
rt.def("/obj/item/device/gps/visible_debug/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "tagged"))) {
		yield* g.srcCall(f, "clear");
	}
	rt.setSv(f, "tagged", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
