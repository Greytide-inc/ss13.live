// From code/modules/power/solar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10320, "/obj/machinery/power/solar", "/obj/machinery/power", {
	id: 0,
	obscured: 0,
	sunfrac: 0,
	adir: 2,
	ndir: 2,
	turn_angle: 0,
	control: null,
	anchored: 1,
	name: "solar panel",
	desc: "A solar panel. Generates electricity when in contact with sunlight.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "sp_base",
	density: 1,
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
	obj_integrity: 150,
	max_integrity: 150,
	integrity_failure: 50,
});

// /obj/machinery/power/solar/proc/New  (code/modules/power/solar.dm:26)  may sleep
rt.def("/obj/machinery/power/solar/proc/New", function* New(f: Frame, loc: Value, S: Value) {
	f.vars = () => [loc, S];
	yield* g.callSuper(f, [live(loc)]);
	yield* g.srcCall(f, "Make", live(S));
	yield* g.srcCall(f, "connect_to_network");
	return f.dot;
}, true);

// /obj/machinery/power/solar/proc/Destroy  (code/modules/power/solar.dm:31)  may sleep
rt.def("/obj/machinery/power/solar/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "unset_control");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/solar/proc/set_control  (code/modules/power/solar.dm:36)
rt.def("/obj/machinery/power/solar/proc/set_control", function set_control(f: Frame, SC: Value) {
	if ((!truthy(live(SC)) || rt.gt(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(SC)]), 40))) {
		return 0;
	}
	rt.setSv(f, "control", live(SC));
	(rt.modField(f, live(SC), "connected_panels", live(f.src), rt.bitOr));
	return 1;
});

// /obj/machinery/power/solar/proc/unset_control  (code/modules/power/solar.dm:45)
rt.def("/obj/machinery/power/solar/proc/unset_control", function unset_control(f: Frame) {
	if (truthy(rt.sv(f, "control"))) {
		rt.callName(f, rt.fv(f, "connected_panels", rt.sv(f, "control")), "Remove", [live(f.src)]);
	}
	rt.setSv(f, "control", null);
	return f.dot;
});

// /obj/machinery/power/solar/proc/Make  (code/modules/power/solar.dm:49)  may sleep
rt.def("/obj/machinery/power/solar/proc/Make", function* Make(f: Frame, S: Value) {
	f.vars = () => [S];
	if (!truthy(live(S))) {
		rt.setFv(f, "glass_type", (S = (yield* g.new_(f, T("/obj/item/solar_assembly"), [live(f.src)]))), T("/obj/item/stack/sheet/glass"));
		rt.setFv(f, "anchored", live(S), 1);
	}
	rt.setFv(f, "loc", live(S), live(f.src));
	if (isEqual(rt.fv(f, "glass_type", live(S)), T("/obj/item/stack/sheet/rglass"))) {
		(rt.modSrcVar(f, "max_integrity", 2, multiply));
		rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/solar/proc/attackby  (code/modules/power/solar.dm:60)  may sleep
rt.def("/obj/machinery/power/solar/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to take the glass off the solar panel.", [live(f.args[1])]), "<span class='notice'>You begin to take the glass off the solar panel...</span>"]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ takes the glass off the solar panel.", [live(f.args[1])]), "<span class='notice'>You take the glass off the solar panel.</span>"]);
			yield* g.srcCall(f, "deconstruct", 1);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/solar/proc/play_attack_sound  (code/modules/power/solar.dm:71)
rt.def("/obj/machinery/power/solar/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 60, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glasshit.ogg"), 90, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/power/solar/proc/obj_break  (code/modules/power/solar.dm:82)
rt.def("/obj/machinery/power/solar/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glassbr3.ogg"), 100, 1]);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "unset_control", []);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/power/solar/proc/deconstruct  (code/modules/power/solar.dm:89)  may sleep
rt.def("/obj/machinery/power/solar/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let S: Value = null;
	f.vars = () => [disassembled, S];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(disassembled))) {
			if (truthy((S = rt.locateIn(f, T("/obj/item/solar_assembly"), live(f.src))))) {
				yield* g.callName(f, live(S), "forceMove", [rt.sv(f, "loc")]);
				yield* g.callName(f, live(S), "give_glass", [rt.bitAnd(rt.sv(f, "stat"), 1)]);
			}
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "shatter", 70, 1]);
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/power/solar/proc/update_icon  (code/modules/power/solar.dm:103)
rt.def("/obj/machinery/power/solar/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "solar_panel-b", 5])]);
	} else {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "solar_panel", 5])]);
		rt.callName(f, live(f.src), "setDir", [rt.call(f, P("/proc/angle2dir"), null, [rt.sv(f, "adir")])]);
	}
	return f.dot;
});

// /obj/machinery/power/solar/proc/update_solar_exposure  (code/modules/power/solar.dm:118)
rt.def("/obj/machinery/power/solar/proc/update_solar_exposure", function update_solar_exposure(f: Frame) {
	let p_angle: Value = null;
	f.vars = () => [p_angle];
	if (truthy(rt.sv(f, "obscured"))) {
		rt.setSv(f, "sunfrac", 0);
		return live(f.dot);
	}
	if (rt.gt((p_angle = rt.call(f, P("/proc/min"), null, [rt.op(f, "Abs", [], [subtract(rt.sv(f, "adir"), rt.fv(f, "angle", rt.gl("SSsun")))]), subtract(360, rt.op(f, "Abs", [], [subtract(rt.sv(f, "adir"), rt.fv(f, "angle", rt.gl("SSsun")))]))])), 90)) {
		rt.setSv(f, "sunfrac", 0);
		return live(f.dot);
	}
	rt.setSv(f, "sunfrac", rt.power(rt.op(f, "Cos", [], [live(p_angle)]), 2));
	return f.dot;
});

// /obj/machinery/power/solar/proc/process  (code/modules/power/solar.dm:128)
rt.def("/obj/machinery/power/solar/proc/process", function process(f: Frame) {
	let sgen: Value = null;
	f.vars = () => [sgen];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "control"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "powernet"))) return f.dot;
	if (isEqual(rt.sv(f, "powernet"), rt.fv(f, "powernet", rt.sv(f, "control")))) {
		if (truthy(rt.sv(f, "obscured"))) {
			return live(f.dot);
		}
		rt.callSrc(f, "add_avail", [(sgen = multiply(1500, rt.sv(f, "sunfrac")))]);
		rt.modField(f, rt.sv(f, "control"), "gen", live(sgen), add);
	} else {
		rt.callSrc(f, "unset_control", []);
	}
	return f.dot;
}, false, { waitfor: false });

rt.type(10321, "/obj/machinery/power/solar/fake", "/obj/machinery/power/solar", {});

// /obj/machinery/power/solar/fake/proc/New  (code/modules/power/solar.dm:145)  may sleep
rt.def("/obj/machinery/power/solar/fake/proc/New", function* New(f: Frame, loc: Value, S: Value) {
	f.vars = () => [loc, S];
	yield* g.callSuper(f, [live(loc), live(S), 0]);
	return f.dot;
}, true);

// /obj/machinery/power/solar/proc/occlusion  (code/modules/power/solar.dm:154)
rt.def("/obj/machinery/power/solar/proc/occlusion", function occlusion(f: Frame) {
	let ax: Value = null, ay: Value = null, _T: Value = null, dx: Value = null, dy: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [ax, ay, _T, dx, dy, i, $e];
	ax = rt.sv(f, "x");
	ay = rt.sv(f, "y");
	_T = null;
	dx = rt.fv(f, "dx", rt.gl("SSsun"));
	dy = rt.fv(f, "dy", rt.gl("SSsun"));
	i = null;
	rt.forRange(f, 0, 1, 20, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		ax = rt.modify(live(ax), live(dx), add);
		ay = rt.modify(live(ay), live(dy), add);
		if ((((isEqual(rt.gv(f, "x", (_T = rt.locate(rt.call(f, P("/proc/round"), null, [live(ax), 0.5]), rt.call(f, P("/proc/round"), null, [live(ay), 0.5]), rt.sv(f, "z")))), 1) || isEqual(rt.fv(f, "x", live(_T)), rt.fv(f, "maxx", rt.world()))) || isEqual(rt.fv(f, "y", live(_T)), 1)) || isEqual(rt.fv(f, "y", live(_T)), rt.fv(f, "maxy", rt.world())))) {
			break;
		}
		if (truthy(rt.fv(f, "density", live(_T)))) {
			rt.setSv(f, "obscured", 1);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "obscured", 0);
	rt.callSrc(f, "update_solar_exposure", []);
	return f.dot;
});

rt.type(10134, "/obj/item/solar_assembly", "/obj/item", {
	tracker: 0,
	glass_type: null,
	item_state: "electropack",
	w_class: 4,
	anchored: 0,
	name: "solar panel assembly",
	desc: "A solar panel assembly kit, allows constructions of a solar panel, or with a tracking circuit board, a solar tracker.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "sp_base",
});

// /obj/item/solar_assembly/proc/attack_hand  (code/modules/power/solar.dm:193)  may sleep
rt.def("/obj/item/solar_assembly/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!(!truthy(rt.sv(f, "anchored")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/solar_assembly/proc/give_glass  (code/modules/power/solar.dm:199)  may sleep
rt.def("/obj/item/solar_assembly/proc/give_glass", function* give_glass(f: Frame, device_broken: Value) {
	let S: Value = null;
	f.vars = () => [device_broken, S];
	if (truthy(live(device_broken))) {
		yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
		yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
	} else {
		if (truthy(rt.sv(f, "glass_type"))) {
			rt.setFv(f, "amount", (S = (yield* g.new_(f, rt.sv(f, "glass_type"), [rt.sv(f, "loc")]))), 2);
		}
	}
	rt.setSv(f, "glass_type", null);
	return f.dot;
}, true);

// /obj/item/solar_assembly/proc/attackby  (code/modules/power/solar.dm:208)  may sleep
rt.def("/obj/item/solar_assembly/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
		if (truthy((yield* g.srcCall(f, "isinspace")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't secure ＀ here.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
		if (truthy(rt.sv(f, "anchored"))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wrenches the solar assembly into place.", [live(f.args[1])]), "<span class='notice'>You wrench the solar assembly into place.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
		} else {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unwrenches the solar assembly from its place.", [live(f.args[1])]), "<span class='notice'>You unwrench the solar assembly from its place.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
		}
		return 1;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/rglass")) ? 1 : 0)))) {
		if (!truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to secure the assembly before you can add glass.</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, (S = live(f.args[0])), "use", [2])))) {
			rt.setSv(f, "glass_type", rt.fv(f, "type", live(f.args[0])));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ places the glass on the solar assembly.", [live(f.args[1])]), "<span class='notice'>You place the glass on the solar assembly.</span>"]);
			if (truthy(rt.sv(f, "tracker"))) {
				yield* g.new_(f, T("/obj/machinery/power/tracker"), [rt.getStep(f, live(f.src), 0), live(f.src)]);
			} else {
				yield* g.new_(f, T("/obj/machinery/power/solar"), [rt.getStep(f, live(f.src), 0), live(f.src)]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two sheets of glass to put them into a solar panel!</span>"]);
			return live(f.dot);
		}
		return 1;
	}
	if (!truthy(rt.sv(f, "tracker"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/tracker")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setSv(f, "tracker", 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ inserts the electronics into the solar assembly.", [live(f.args[1])]), "<span class='notice'>You insert the electronics into the solar assembly.</span>"]);
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.new_(f, T("/obj/item/weapon/electronics/tracker"), [rt.fv(f, "loc", live(f.src))]);
			rt.setSv(f, "tracker", 0);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ takes out the electronics from the solar assembly.", [live(f.args[1])]), "<span class='notice'>You take out the electronics from the solar assembly.</span>"]);
			return 1;
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

rt.type(10322, "/obj/machinery/power/solar_control", "/obj/machinery/power", {
	icon_screen: "solar",
	icon_keyboard: "power_key",
	id: 0,
	currentdir: 0,
	targetdir: 0,
	gen: 0,
	lastgen: 0,
	track: 0,
	trackrate: 600,
	nexttime: 0,
	connected_tracker: null,
	connected_panels: null,
	anchored: 1,
	name: "solar panel control",
	desc: "A controller for solar panel arrays.",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
	density: 1,
	use_power: 1,
	idle_power_usage: 250,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 100,
});

// /obj/machinery/power/solar_control/proc/<init>  (code/modules/power/solar.dm:282)
rt.def("/obj/machinery/power/solar_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "connected_panels", rt.list());
	return f.dot;
});

// /obj/machinery/power/solar_control/proc/Initialize  (code/modules/power/solar.dm:285)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "powernet"))) {
		yield* g.srcCall(f, "set_panels", rt.sv(f, "currentdir"));
	}
	yield* g.srcCall(f, "connect_to_network");
	return f.dot;
}, true);

// /obj/machinery/power/solar_control/proc/Destroy  (code/modules/power/solar.dm:291)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "connected_panels"), T("/obj/machinery/power/solar"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "unset_control", []);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "connected_tracker"))) {
		yield* g.callName(f, rt.sv(f, "connected_tracker"), "unset_control", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/solar_control/proc/disconnect_from_network  (code/modules/power/solar.dm:298)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/disconnect_from_network", function* disconnect_from_network(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.fv(f, "solars", rt.gl("SSsun")), "Remove", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/power/solar_control/proc/connect_to_network  (code/modules/power/solar.dm:302)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/connect_to_network", function* connect_to_network(f: Frame) {
	let to_return: Value = null;
	f.vars = () => [to_return];
	to_return = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "powernet"))) {
		(rt.modField(f, rt.gl("SSsun"), "solars", live(f.src), rt.bitOr));
	}
	return live(to_return);
}, true);

// /obj/machinery/power/solar_control/proc/search_for_connected  (code/modules/power/solar.dm:310)
rt.def("/obj/machinery/power/solar_control/proc/search_for_connected", function search_for_connected(f: Frame) {
	let M: Value = null, S: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, S, _T, $e];
	if (!truthy(rt.sv(f, "powernet"))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.fv(f, "nodes", rt.sv(f, "powernet")), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/obj/machinery/power/solar")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "control", (S = live(M))))) {
				rt.callName(f, live(S), "set_control", [live(f.src)]);
			}
		} else {
			if (truthy((rt.istype(live(M), T("/obj/machinery/power/tracker")) ? 1 : 0))) {
				if (!truthy(rt.sv(f, "connected_tracker"))) {
					if (!truthy(rt.gv(f, "control", (_T = live(M))))) {
						rt.callName(f, live(_T), "set_control", [live(f.src)]);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/power/solar_control/proc/update  (code/modules/power/solar.dm:323)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/update", function* update(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "track");
	if ($0 === 1) {
		if (truthy(rt.sv(f, "trackrate"))) {
			rt.setSv(f, "currentdir", rt.sv(f, "targetdir"));
		}
	} else if ($0 === 2) {
		if (truthy(rt.sv(f, "connected_tracker"))) {
			yield* g.callName(f, rt.sv(f, "connected_tracker"), "set_angle", [rt.fv(f, "angle", rt.gl("SSsun"))]);
		}
	}
	yield* g.srcCall(f, "set_panels", rt.sv(f, "currentdir"));
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true);

// /obj/machinery/power/solar_control/proc/update_icon  (code/modules/power/solar.dm:338)
rt.def("/obj/machinery/power/solar_control/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_off", [rt.sv(f, "icon_keyboard")])]);
		return live(f.dot);
	}
	rt.callSrc(f, "add_overlay", [rt.sv(f, "icon_keyboard")]);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_broken", [rt.sv(f, "icon_state")])]);
	} else {
		rt.callSrc(f, "add_overlay", [rt.sv(f, "icon_screen")]);
	}
	if (!rt.gt(rt.sv(f, "currentdir"), -1)) return f.dot;
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/angle2dir"), null, [rt.sv(f, "currentdir")])]);
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "solcon-o", 5])]);
	return f.dot;
});

// /obj/machinery/power/solar_control/proc/ui_interact  (code/modules/power/solar.dm:353)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "solar_control", rt.sv(f, "name"), 500, 400, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/power/solar_control/proc/ui_data  (code/modules/power/solar.dm:359)
rt.def("/obj/machinery/power/solar_control/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	rt.setAt((data = rt.list()), "generated", rt.call(f, P("/proc/round"), null, [rt.sv(f, "lastgen")]));
	rt.setAt(live(data), "angle", rt.sv(f, "currentdir"));
	rt.setAt(live(data), "direction", rt.call(f, P("/proc/angle2text"), null, [rt.sv(f, "currentdir")]));
	rt.setAt(live(data), "tracking_state", rt.sv(f, "track"));
	rt.setAt(live(data), "tracking_rate", rt.sv(f, "trackrate"));
	$0 = live(data);
	$1 = "rotating_way";
	if (rt.lt(rt.sv(f, "trackrate"), 0)) {
		$2 = "CCW";
	} else {
		$2 = "CW";
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "connected_panels", rt.len(f, rt.sv(f, "connected_panels")));
	$0 = live(data);
	$1 = "connected_tracker";
	if (truthy(rt.sv(f, "connected_tracker"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	return live(data);
});

// /obj/machinery/power/solar_control/proc/ui_act  (code/modules/power/solar.dm:374)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/ui_act", function* ui_act(f: Frame) {
	let adjust: Value = null, mode: Value = null;
	let $0: any;
	f.vars = () => [adjust, mode, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "direction") {
		if (truthy((adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]))))) {
			rt.setSv(f, "currentdir", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.modulus(add(add(360, live(adjust)), rt.sv(f, "currentdir")), 360), 359]))])));
			rt.setSv(f, "targetdir", rt.sv(f, "currentdir"));
			yield* g.srcCall(f, "set_panels", rt.sv(f, "currentdir"));
			f.dot = 1;
		}
	} else if ($0 === "rate") {
		if (truthy((adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]))))) {
			rt.setSv(f, "trackrate", (yield* g.call(f, P("/proc/max"), null, [-7200, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "trackrate"), live(adjust)), 7200]))])));
			if (truthy(rt.sv(f, "trackrate"))) {
				rt.setSv(f, "nexttime", add(rt.worldTime(f), divide(36000, rt.op(f, "Abs", [], [rt.sv(f, "trackrate")]))));
			}
			f.dot = 1;
		}
	} else if ($0 === "tracking") {
		if (truthy((mode = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "mode")]))))) {
			rt.setSv(f, "track", live(mode));
			f.dot = 1;
		}
		if ((isEqual(live(mode), 2) && truthy(rt.sv(f, "connected_tracker")))) {
			yield* g.callName(f, rt.sv(f, "connected_tracker"), "set_angle", [rt.fv(f, "angle", rt.gl("SSsun"))]);
			yield* g.srcCall(f, "set_panels", rt.sv(f, "currentdir"));
		} else {
			if (isEqual(live(mode), 1)) {
				rt.setSv(f, "targetdir", rt.sv(f, "currentdir"));
				if (truthy(rt.sv(f, "trackrate"))) {
					rt.setSv(f, "nexttime", add(rt.worldTime(f), divide(36000, rt.op(f, "Abs", [], [rt.sv(f, "trackrate")]))));
				}
				yield* g.srcCall(f, "set_panels", rt.sv(f, "targetdir"));
			}
		}
	} else if ($0 === "refresh") {
		yield* g.srcCall(f, "search_for_connected");
		if ((truthy(rt.sv(f, "connected_tracker")) && isEqual(rt.sv(f, "track"), 2))) {
			yield* g.callName(f, rt.sv(f, "connected_tracker"), "set_angle", [rt.fv(f, "angle", rt.gl("SSsun"))]);
		}
		yield* g.srcCall(f, "set_panels", rt.sv(f, "currentdir"));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/power/solar_control/proc/attackby  (code/modules/power/solar.dm:412)  may sleep
rt.def("/obj/machinery/power/solar_control/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null, M: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [A, M, C, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			if (truthy(rt.bitAnd(rt.fv(f, "stat", live(f.src)), 1))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The broken glass falls out.</span>"]);
				A = (yield* g.new_(f, T("/obj/structure/frame/computer"), [rt.fv(f, "loc", live(f.src))]));
				yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
				M = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/computer/solar_control"), [live(A)]));
				C = null;
				rt.forList(f, 0, live(f.src), T("/obj"));
				while (($e = rt.next(f, 0)) !== undefined) {
					C = $e;
					rt.setFv(f, "loc", live(C), rt.fv(f, "loc", live(f.src)));
				}
				rt.endFor(f, 0);
				rt.setFv(f, "circuit", live(A), live(M));
				rt.setFv(f, "state", live(A), 3);
				rt.setFv(f, "icon_state", live(A), "3");
				rt.setFv(f, "anchored", live(A), 1);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disconnect the monitor.</span>"]);
				A = (yield* g.new_(f, T("/obj/structure/frame/computer"), [rt.fv(f, "loc", live(f.src))]));
				M = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/computer/solar_control"), [live(A)]));
				C = null;
				rt.forList(f, 0, live(f.src), T("/obj"));
				while (($e = rt.next(f, 0)) !== undefined) {
					C = $e;
					rt.setFv(f, "loc", live(C), rt.fv(f, "loc", live(f.src)));
				}
				rt.endFor(f, 0);
				rt.setFv(f, "circuit", live(A), live(M));
				rt.setFv(f, "state", live(A), 4);
				rt.setFv(f, "icon_state", live(A), "4");
				rt.setFv(f, "anchored", live(A), 1);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
	} else {
		if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && !truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 4)))) {
			yield* g.callName(f, live(f.src), "attack_hand", [live(f.args[1])]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/power/solar_control/proc/play_attack_sound  (code/modules/power/solar.dm:444)
rt.def("/obj/machinery/power/solar_control/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/glasshit.ogg"), 75, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/power/solar_control/proc/obj_break  (code/modules/power/solar.dm:454)
rt.def("/obj/machinery/power/solar_control/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glassbr3.ogg"), 100, 1]);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/power/solar_control/proc/process  (code/modules/power/solar.dm:460)
rt.def("/obj/machinery/power/solar_control/proc/process", function process(f: Frame) {
	rt.setSv(f, "lastgen", rt.sv(f, "gen"));
	rt.setSv(f, "gen", 0);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "connected_tracker"))) {
		if (!isEqual(rt.fv(f, "powernet", rt.sv(f, "connected_tracker")), rt.sv(f, "powernet"))) {
			rt.callName(f, rt.sv(f, "connected_tracker"), "unset_control", []);
		}
	}
	if (!(isEqual(rt.sv(f, "track"), 1) && truthy(rt.sv(f, "trackrate")))) return f.dot;
	if (!rt.le(rt.sv(f, "nexttime"), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "targetdir", rt.modulus(add(add(rt.sv(f, "targetdir"), divide(rt.sv(f, "trackrate"), rt.op(f, "Abs", [], [rt.sv(f, "trackrate")]))), 360), 360));
	rt.modSrcVar(f, "nexttime", divide(36000, rt.op(f, "Abs", [], [rt.sv(f, "trackrate")])), add);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/power/solar_control/proc/set_panels  (code/modules/power/solar.dm:478)
rt.def("/obj/machinery/power/solar_control/proc/set_panels", function set_panels(f: Frame, currentdir: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "connected_panels"), T("/obj/machinery/power/solar"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.setFv(f, "adir", live(S), live(currentdir));
		rt.callName(f, live(S), "occlusion", []);
		rt.callName(f, live(S), "update_icon", []);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/power/solar_control/proc/power_change  (code/modules/power/solar.dm:487)
rt.def("/obj/machinery/power/solar_control/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});
