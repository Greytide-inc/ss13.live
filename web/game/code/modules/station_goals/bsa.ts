// From code/modules/station_goals/bsa.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4202, "/datum/station_goal/bluespace_cannon", "/datum/station_goal", {
	name: "Bluespace Artillery",
});

// /datum/station_goal/bluespace_cannon/proc/get_report  (code/modules/station_goals/bsa.dm:9)
rt.def("/datum/station_goal/bluespace_cannon/proc/get_report", function get_report(f: Frame) {
	return fmt("Our military presence is inadequate in your sector.\n\t We need you to construct BSA-＀ Artillery position aboard your station.\n\n\t Base parts are available for shipping via cargo.\n\t -Nanotrasen Naval Command", [rt.call(f, P("/proc/rand"), null, [1, 99])]);
});

// /datum/station_goal/bluespace_cannon/proc/on_report  (code/modules/station_goals/bsa.dm:17)
rt.def("/datum/station_goal/bluespace_cannon/proc/on_report", function on_report(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	rt.setFv(f, "special_enabled", (_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), T("/datum/supply_pack/misc/bsa"))), 1);
	return f.dot;
});

// /datum/station_goal/bluespace_cannon/proc/check_completion  (code/modules/station_goals/bsa.dm:21)
rt.def("/datum/station_goal/bluespace_cannon/proc/check_completion", function check_completion(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 1;
	}
	if ((truthy((B = rt.locateIn(f, T("/obj/machinery/bsa/full"), rt.world()))) && !truthy(rt.fv(f, "stat", live(B))))) {
		return 1;
	}
	return 0;
});

rt.type(10991, "/obj/machinery/bsa/back", "/obj/machinery/bsa", {
	name: "Bluespace Artillery Generator",
	desc: "Generates cannon pulse. Needs to be linked with a fusor. ",
	icon_state: "power_box",
});

// /obj/machinery/bsa/back/proc/attackby  (code/modules/station_goals/bsa.dm:39)  may sleep
rt.def("/obj/machinery/bsa/back/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		rt.setFv(f, "buffer", (M = live(f.args[0])), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You store linkage information in ＀'s buffer.</span>", [live(f.args[0])])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 10);
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(10992, "/obj/machinery/bsa/front", "/obj/machinery/bsa", {
	name: "Bluespace Artillery Bore",
	desc: "Do not stand in front of cannon during operation. Needs to be linked with a fusor.",
	icon_state: "emitter_center",
});

// /obj/machinery/bsa/front/proc/attackby  (code/modules/station_goals/bsa.dm:55)  may sleep
rt.def("/obj/machinery/bsa/front/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		rt.setFv(f, "buffer", (M = live(f.args[0])), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You store linkage information in ＀'s buffer.</span>", [live(f.args[0])])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 10);
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(10993, "/obj/machinery/bsa/middle", "/obj/machinery/bsa", {
	back: null,
	front: null,
	name: "Bluespace Artillery Fusor",
	desc: "Contents classifed by Nanotrasen Naval Command. Needs to be linked with the other BSA parts using multitool.",
	icon_state: "fuel_chamber",
});

// /obj/machinery/bsa/middle/proc/attackby  (code/modules/station_goals/bsa.dm:73)  may sleep
rt.def("/obj/machinery/bsa/middle/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "buffer", (M = live(f.args[0]))))) {
			if (truthy((rt.istype(rt.fv(f, "buffer", live(M)), T("/obj/machinery/bsa/back")) ? 1 : 0))) {
				rt.setSv(f, "back", rt.fv(f, "buffer", live(M)));
				rt.setFv(f, "buffer", live(M), null);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You link ＀ with ＀.</span>", [live(f.src), rt.sv(f, "back")])]);
			} else {
				if (truthy((rt.istype(rt.fv(f, "buffer", live(M)), T("/obj/machinery/bsa/front")) ? 1 : 0))) {
					rt.setSv(f, "front", rt.fv(f, "buffer", live(M)));
					rt.setFv(f, "buffer", live(M), null);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You link ＀ with ＀.</span>", [live(f.src), rt.sv(f, "front")])]);
				}
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 10);
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/bsa/middle/proc/check_completion  (code/modules/station_goals/bsa.dm:91)
rt.def("/obj/machinery/bsa/middle/proc/check_completion", function check_completion(f: Frame) {
	if ((!truthy(rt.sv(f, "front")) || !truthy(rt.sv(f, "back")))) {
		return "No linked parts detected!";
	}
	if (((!truthy(rt.fv(f, "anchored", rt.sv(f, "front"))) || !truthy(rt.fv(f, "anchored", rt.sv(f, "back")))) || !truthy(rt.sv(f, "anchored")))) {
		return "Linked parts unwrenched!";
	}
	if (((((!isEqual(rt.fv(f, "y", rt.sv(f, "front")), rt.sv(f, "y")) || !isEqual(rt.fv(f, "y", rt.sv(f, "back")), rt.sv(f, "y"))) || !((rt.gt(rt.fv(f, "x", rt.sv(f, "front")), rt.sv(f, "x")) && rt.lt(rt.fv(f, "x", rt.sv(f, "back")), rt.sv(f, "x"))) || (rt.lt(rt.fv(f, "x", rt.sv(f, "front")), rt.sv(f, "x")) && rt.gt(rt.fv(f, "x", rt.sv(f, "back")), rt.sv(f, "x"))))) || !isEqual(rt.fv(f, "z", rt.sv(f, "front")), rt.sv(f, "z"))) || !isEqual(rt.fv(f, "z", rt.sv(f, "back")), rt.sv(f, "z")))) {
		return "Parts misaligned!";
	}
	if (truthy(rt.callSrc(f, "has_space", []))) return f.dot;
	return "Not enough free space!";
});

// /obj/machinery/bsa/middle/proc/has_space  (code/modules/station_goals/bsa.dm:101)
rt.def("/obj/machinery/bsa/middle/proc/has_space", function has_space(f: Frame) {
	let cannon_dir: Value = null, x_min: Value = null, x_max: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [cannon_dir, x_min, x_max, _T, $0, $e];
	cannon_dir = rt.callSrc(f, "get_cannon_direction", []);
	x_min = null;
	x_max = null;
	$0 = live(cannon_dir);
	if ($0 === 4) {
		x_min = subtract(rt.sv(f, "x"), 4);
		x_max = add(rt.sv(f, "x"), 6);
	} else if ($0 === 8) {
		x_min = add(rt.sv(f, "x"), 4);
		x_max = subtract(rt.sv(f, "x"), 6);
	}
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(live(x_min), subtract(rt.sv(f, "y"), 1), rt.sv(f, "z")), rt.locate(live(x_max), add(rt.sv(f, "y"), 1), rt.sv(f, "z"))]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((truthy(rt.fv(f, "density", live(_T))) || truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/machinery/bsa/middle/proc/get_cannon_direction  (code/modules/station_goals/bsa.dm:118)
rt.def("/obj/machinery/bsa/middle/proc/get_cannon_direction", function get_cannon_direction(f: Frame) {
	if ((rt.gt(rt.fv(f, "x", rt.sv(f, "front")), rt.sv(f, "x")) && rt.lt(rt.fv(f, "x", rt.sv(f, "back")), rt.sv(f, "x")))) {
		return 4;
	} else {
		if (!(rt.lt(rt.fv(f, "x", rt.sv(f, "front")), rt.sv(f, "x")) && rt.gt(rt.fv(f, "x", rt.sv(f, "back")), rt.sv(f, "x")))) return f.dot;
		return 8;
	}
	return f.dot;
});

rt.type(10994, "/obj/machinery/bsa/full", "/obj/machinery/bsa", {
	ex_power: 3,
	power_used_per_shot: 2000000,
	ready: null,
	unsecuring_tool: null,
	name: "Bluespace Artillery",
	desc: "Long range bluespace artillery.",
	icon: rt.rsc("icons/obj/lavaland/cannon.dmi"),
	icon_state: "orbital_cannon1",
	pixel_y: -32,
	pixel_x: -192,
	bound_width: 352,
	bound_x: -192,
	appearance_flags: 0,
}, { global: { top_layer: 770 } });

// /obj/machinery/bsa/full/proc/get_front_turf  (code/modules/station_goals/bsa.dm:141)
rt.def("/obj/machinery/bsa/full/proc/get_front_turf", function get_front_turf(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 8) {
		return rt.locate(subtract(rt.sv(f, "x"), 6), rt.sv(f, "y"), rt.sv(f, "z"));
	} else if ($0 === 4) {
		return rt.locate(add(rt.sv(f, "x"), 4), rt.sv(f, "y"), rt.sv(f, "z"));
	}
	return rt.getStep(f, live(f.src), 0);
});

// /obj/machinery/bsa/full/proc/get_back_turf  (code/modules/station_goals/bsa.dm:149)
rt.def("/obj/machinery/bsa/full/proc/get_back_turf", function get_back_turf(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 8) {
		return rt.locate(add(rt.sv(f, "x"), 4), rt.sv(f, "y"), rt.sv(f, "z"));
	} else if ($0 === 4) {
		return rt.locate(subtract(rt.sv(f, "x"), 6), rt.sv(f, "y"), rt.sv(f, "z"));
	}
	return rt.getStep(f, live(f.src), 0);
});

// /obj/machinery/bsa/full/proc/get_target_turf  (code/modules/station_goals/bsa.dm:157)
rt.def("/obj/machinery/bsa/full/proc/get_target_turf", function get_target_turf(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "dir");
	if ($0 === 8) {
		return rt.locate(1, rt.sv(f, "y"), rt.sv(f, "z"));
	} else if ($0 === 4) {
		return rt.locate(rt.fv(f, "maxx", rt.world()), rt.sv(f, "y"), rt.sv(f, "z"));
	}
	return rt.getStep(f, live(f.src), 0);
});

// /obj/machinery/bsa/full/proc/Initialize  (code/modules/station_goals/bsa.dm:165)  may sleep
rt.def("/obj/machinery/bsa/full/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[1]) === null) {
		f.args[1] = 8;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setGl("top_layer", (rt.gl("top_layer") || (yield* g.call(f, P("/proc/mutable_appearance"), null, [null, rt.sv(f, "icon"), "layer", 4.099999904632568], rt.Args.Named))));
	$0 = live(f.args[1]);
	if ($0 === 8) {
		rt.setSv(f, "dir", 8);
		rt.setSv(f, "pixel_x", -192);
		rt.setFv(f, "icon_state", rt.gl("top_layer"), "top_west");
		rt.setSv(f, "icon_state", "cannon_west");
	} else if ($0 === 4) {
		rt.setSv(f, "dir", 4);
		rt.setFv(f, "icon_state", rt.gl("top_layer"), "top_east");
		rt.setSv(f, "icon_state", "cannon_east");
	}
	yield* g.srcCall(f, "add_overlay", rt.gl("top_layer"));
	yield* g.srcCall(f, "reload");
	return f.dot;
}, true, { args: ["mapload", "cannon_direction"] });

// /obj/machinery/bsa/full/proc/fire  (code/modules/station_goals/bsa.dm:181)  may sleep
rt.def("/obj/machinery/bsa/full/proc/fire", function* fire(f: Frame, user: Value, bullseye: Value) {
	let point: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [user, bullseye, point, _T, $e];
	point = (yield* g.srcCall(f, "get_front_turf"));
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [rt.getStep(f, live(point), rt.sv(f, "dir")), (yield* g.srcCall(f, "get_target_turf"))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "ex_act", [1]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(point), "Beam", [null, (yield* g.srcCall(f, "get_target_turf")), "icon_state", "bsa_beam", "time", 50, "maxdistance", rt.fv(f, "maxx", rt.world())], rt.Args.Named);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has launched an artillery strike.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]))])]);
	yield* g.call(f, P("/proc/explosion"), null, [live(bullseye), rt.sv(f, "ex_power"), multiply(rt.sv(f, "ex_power"), 2), multiply(rt.sv(f, "ex_power"), 4)]);
	yield* g.srcCall(f, "reload");
	return f.dot;
}, true);

// /obj/machinery/bsa/full/proc/reload  (code/modules/station_goals/bsa.dm:193)  may sleep
rt.def("/obj/machinery/bsa/full/proc/reload", function* reload(f: Frame) {
	rt.setSv(f, "ready", 0);
	yield* g.srcCall(f, "use_power", rt.sv(f, "power_used_per_shot"));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), "ready_cannon"])), 600]);
	return f.dot;
}, true);

rt.type(6785, "/obj/item/weapon/circuitboard/machine/bsa/back", "/obj/item/weapon/circuitboard/machine/bsa", {
	name: "Bluespace Artillery Generator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/bsa/back"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/bsa/back/proc/<init>  (code/modules/station_goals/bsa.dm:213)
rt.def("/obj/item/weapon/circuitboard/machine/bsa/back/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor/quadratic"), 5, T("/obj/item/stack/cable_coil"), 2]));
	return f.dot;
});

rt.type(6786, "/obj/item/weapon/circuitboard/machine/bsa/middle", "/obj/item/weapon/circuitboard/machine/bsa", {
	name: "Bluespace Artillery Fusor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/bsa/middle"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/bsa/middle/proc/<init>  (code/modules/station_goals/bsa.dm:221)
rt.def("/obj/item/weapon/circuitboard/machine/bsa/middle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 20, T("/obj/item/stack/cable_coil"), 2]));
	return f.dot;
});

rt.type(6787, "/obj/item/weapon/circuitboard/machine/bsa/front", "/obj/item/weapon/circuitboard/machine/bsa", {
	name: "Bluespace Artillery Bore (Machine Board)",
	build_path: rt.typePath("/obj/machinery/bsa/front"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/bsa/front/proc/<init>  (code/modules/station_goals/bsa.dm:229)
rt.def("/obj/item/weapon/circuitboard/machine/bsa/front/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator/femto"), 5, T("/obj/item/stack/cable_coil"), 2]));
	return f.dot;
});

rt.type(10434, "/obj/machinery/computer/bsa_control", "/obj/machinery/computer", {
	cannon: null,
	notice: null,
	target: null,
	area_aim: 0,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/bsa_control"),
	name: "Bluespace Artillery Control",
	use_power: 0,
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "control_boxp",
});

// /obj/machinery/computer/bsa_control/proc/ui_interact  (code/modules/station_goals/bsa.dm:251)  may sleep
rt.def("/obj/machinery/computer/bsa_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "bsa", rt.sv(f, "name"), 400, 305, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/bsa_control/proc/ui_data  (code/modules/station_goals/bsa.dm:257)
rt.def("/obj/machinery/computer/bsa_control/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	$0 = (data = rt.list());
	$1 = "ready";
	if (truthy(rt.sv(f, "cannon"))) {
		$2 = rt.fv(f, "ready", rt.sv(f, "cannon"));
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "connected", rt.sv(f, "cannon"));
	rt.setAt(live(data), "notice", rt.sv(f, "notice"));
	rt.setAt(live(data), "unlocked", rt.gl("bsa_unlock"));
	if (truthy(rt.sv(f, "target"))) {
		rt.setAt(live(data), "target", rt.callSrc(f, "get_target_name", []));
	}
	return live(data);
});

// /obj/machinery/computer/bsa_control/proc/ui_act  (code/modules/station_goals/bsa.dm:267)  may sleep
rt.def("/obj/machinery/computer/bsa_control/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "build") {
		rt.setSv(f, "cannon", (yield* g.srcCall(f, "deploy")));
		f.dot = 1;
	} else if ($0 === "fire") {
		yield* g.srcCall(f, "fire", live(f.usr));
		f.dot = 1;
	} else if ($0 === "recalibrate") {
		yield* g.srcCall(f, "calibrate", live(f.usr));
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/bsa_control/proc/calibrate  (code/modules/station_goals/bsa.dm:282)  may sleep
rt.def("/obj/machinery/computer/bsa_control/proc/calibrate", function* calibrate(f: Frame, user: Value) {
	let gps_locators: Value = null, G: Value = null, options: Value = null, V: Value = null;
	let $e: any;
	f.vars = () => [user, gps_locators, G, options, V, $e];
	gps_locators = rt.list();
	G = null;
	rt.forList(f, 0, rt.gl("GPS_list"), T("/obj/item/device/gps"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.setAt(live(gps_locators), rt.fv(f, "gpstag", live(G)), live(G));
	}
	rt.endFor(f, 0);
	options = live(gps_locators);
	if (truthy(rt.sv(f, "area_aim"))) {
		options = rt.modify(live(options), rt.gl("teleportlocs"), add);
	}
	V = (yield* g.op(f, "Prompt", [0], [null, "Select target", "Select target", live(user), rt.bitOr(live(options), null)]));
	rt.setSv(f, "target", rt.index(live(options), live(V)));
	return f.dot;
}, true);

// /obj/machinery/computer/bsa_control/proc/get_target_name  (code/modules/station_goals/bsa.dm:294)
rt.def("/obj/machinery/computer/bsa_control/proc/get_target_name", function get_target_name(f: Frame) {
	let A: Value = null, G: Value = null;
	f.vars = () => [A, G];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/area")) ? 1 : 0))) {
		return rt.gv(f, "name", (A = rt.sv(f, "target")));
	} else {
		if (!truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/device/gps")) ? 1 : 0))) return f.dot;
		return rt.gv(f, "gpstag", (G = rt.sv(f, "target")));
	}
	return f.dot;
});

// /obj/machinery/computer/bsa_control/proc/get_impact_turf  (code/modules/station_goals/bsa.dm:302)
rt.def("/obj/machinery/computer/bsa_control/proc/get_impact_turf", function get_impact_turf(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "target"), T("/area")) ? 1 : 0))) {
		return rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/get_area_turfs"), null, [rt.sv(f, "target")])]);
	}
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/device/gps")) ? 1 : 0))) return f.dot;
	return rt.getStep(f, rt.sv(f, "target"), 0);
});

// /obj/machinery/computer/bsa_control/proc/fire  (code/modules/station_goals/bsa.dm:308)  may sleep
rt.def("/obj/machinery/computer/bsa_control/proc/fire", function* fire(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.fv(f, "stat", rt.sv(f, "cannon")))) {
		rt.setSv(f, "notice", "Cannon unpowered!");
		return live(f.dot);
	}
	rt.setSv(f, "notice", null);
	yield* g.callName(f, rt.sv(f, "cannon"), "fire", [live(user), (yield* g.srcCall(f, "get_impact_turf"))]);
	return f.dot;
}, true);

// /obj/machinery/computer/bsa_control/proc/deploy  (code/modules/station_goals/bsa.dm:315)  may sleep
rt.def("/obj/machinery/computer/bsa_control/proc/deploy", function* deploy(f: Frame, force: Value) {
	let prebuilt: Value = null, centerpiece: Value = null, s: Value = null, cannon: Value = null;
	f.vars = () => [force, prebuilt, centerpiece, s, cannon];
	if (live(force) === null) {
		force = 0;
	}
	if (truthy((prebuilt = rt.locateIn(f, T("/obj/machinery/bsa/full"), (yield* g.call(f, P("/proc/range"), null, [7])))))) {
		return live(prebuilt);
	}
	if (!truthy((centerpiece = rt.locateIn(f, T("/obj/machinery/bsa/middle"), (yield* g.call(f, P("/proc/range"), null, [7])))))) {
		rt.setSv(f, "notice", "No BSA parts detected nearby.");
		return null;
	}
	rt.setSv(f, "notice", (yield* g.callName(f, live(centerpiece), "check_completion", [])));
	if (truthy(rt.sv(f, "notice"))) {
		return null;
	}
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [4, rt.getStep(f, live(centerpiece), 0)]);
	yield* g.callName(f, live(s), "start", []);
	cannon = (yield* g.new_(f, T("/obj/machinery/bsa/full"), [rt.getStep(f, live(centerpiece), 0), (yield* g.callName(f, live(centerpiece), "get_cannon_direction", []))]));
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "front", live(centerpiece))]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "back", live(centerpiece))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(centerpiece)]);
	return live(cannon);
}, true);
