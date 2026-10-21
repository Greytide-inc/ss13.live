// From code/game/machinery/launch_pad.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10800, "/obj/machinery/launchpad", "/obj/machinery", {
	icon_teleport: "lpad-beam",
	stationary: 1,
	display_name: "Launchpad",
	teleport_speed: 35,
	range: 5,
	teleporting: 0,
	power_efficiency: 1,
	x_offset: 0,
	y_offset: 0,
	anchored: 1,
	name: "bluespace launchpad",
	desc: "A bluespace pad able to thrust matter through bluespace, teleporting it to or from nearby locations.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "lpad-idle",
	use_power: 1,
	idle_power_usage: 200,
	active_power_usage: 2500,
});

// /obj/machinery/launchpad/proc/Initialize  (code/game/machinery/launch_pad.dm:21)  may sleep
rt.def("/obj/machinery/launchpad/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/launchpad"), []))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6723, "/obj/item/weapon/circuitboard/machine/launchpad", "/obj/item/weapon/circuitboard/machine", {
	name: "Bluespace Launchpad (Machine Board)",
	build_path: rt.typePath("/obj/machinery/launchpad"),
	origin_tech: "programming=3;engineering=3;plasmatech=2;bluespace=3",
	req_components: null,
	def_components: null,
});

// /obj/item/weapon/circuitboard/machine/launchpad/proc/<init>  (code/game/machinery/launch_pad.dm:29)
rt.def("/obj/item/weapon/circuitboard/machine/launchpad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]));
	return f.dot;
});

// /obj/machinery/launchpad/proc/RefreshParts  (code/game/machinery/launch_pad.dm:36)
rt.def("/obj/machinery/launchpad/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [E, M, $e];
	E = -1;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "range", rt.initial(f, live(f.src), "range"));
	rt.modSrcVar(f, "range", live(E), add);
	return f.dot;
});

// /obj/machinery/launchpad/proc/attackby  (code/game/machinery/launch_pad.dm:43)  may sleep
rt.def("/obj/machinery/launchpad/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy(rt.sv(f, "stationary"))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "lpad-idle-o", "lpad-idle", live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "panel_open"))) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
				rt.setFv(f, "buffer", (M = live(f.args[0])), live(f.src));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You save the data in the ＀'s buffer.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
				return 1;
			}
		}
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/launchpad/proc/isAvailable  (code/game/machinery/launch_pad.dm:62)
rt.def("/obj/machinery/launchpad/proc/isAvailable", function isAvailable(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		return 0;
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/launchpad/proc/doteleport  (code/game/machinery/launch_pad.dm:70)  may sleep
rt.def("/obj/machinery/launchpad/proc/doteleport", function* doteleport(f: Frame, user: Value, sending: Value) {
	let target_x: Value = null, target_y: Value = null, target: Value = null, A: Value = null, source: Value = null, dest: Value = null, log_msg: Value = null, ROI: Value = null, L: Value = null, _T: Value = null, C: Value = null, Q: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [user, sending, target_x, target_y, target, A, source, dest, log_msg, ROI, L, _T, C, Q, $0, $1, $2, $3, $4, $e];
	if (truthy(rt.sv(f, "teleporting"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>ERROR: Launchpad busy.</span>"]);
		return live(f.dot);
	}
	target_x = add(rt.sv(f, "x"), rt.sv(f, "x_offset"));
	target_y = add(rt.sv(f, "y"), rt.sv(f, "y_offset"));
	target = rt.locate(live(target_x), live(target_y), rt.sv(f, "z"));
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(target)]));
	yield* g.call(f, P("/proc/flick"), null, [rt.sv(f, "icon_teleport"), live(f.src)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/weapons/flash.ogg"), 25, 1]);
	rt.setSv(f, "teleporting", 1);
	yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "teleport_speed")]);
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy((yield* g.srcCall(f, "isAvailable"))))) {
		return live(f.dot);
	}
	rt.setSv(f, "teleporting", 0);
	yield* g.srcCall(f, "use_power", 1000);
	source = live(target);
	dest = rt.getStep(f, live(f.src), 0);
	log_msg = rt.list();
	log_msg = rt.modify(live(log_msg), fmt(": ＀ has teleported ", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))]), add);
	if (truthy(live(sending))) {
		source = live(dest);
		dest = live(target);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/weapons/emitter2.ogg"), 25, 1]);
	ROI = null;
	rt.forList(f, 0, live(source), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ROI = $e;
		if (isEqual(live(ROI), live(f.src))) {
			continue;
		}
		if (truthy(rt.fv(f, "anchored", live(ROI)))) {
			if (truthy((rt.istype(live(ROI), T("/mob/living")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "buckled", (L = live(ROI))))) {
					if (truthy(rt.gv(f, "anchored", rt.fv(f, "buckled", live(L))))) {
						continue;
					}
					log_msg = rt.modify(live(log_msg), fmt("＀ (on a chair), ", [(yield* g.call(f, P("/proc/key_name"), null, [live(L)]))]), add);
				} else {
					continue;
				}
			} else {
				if (!truthy((rt.istype(live(ROI), T("/mob/dead/observer")) ? 1 : 0))) {
					continue;
				}
			}
		}
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(ROI)])))) {
			log_msg = rt.modify(live(log_msg), fmt("＀, ", [(yield* g.call(f, P("/proc/key_name"), null, [(_T = live(ROI))]))]), add);
		} else {
			log_msg = rt.modify(live(log_msg), fmt("＀", [rt.fv(f, "name", live(ROI))]), add);
			if (truthy((rt.istype(live(ROI), T("/obj/structure/closet")) ? 1 : 0))) {
				C = live(ROI);
				log_msg = rt.modify(live(log_msg), " (", add);
				Q = null;
				rt.forList(f, 1, live(C));
				while (($e = rt.next(f, 1)) !== undefined) {
					Q = $e;
					if (!(truthy((rt.istype(live(Q), T("/obj")) ? 1 : 0)) || truthy((rt.istype(live(Q), T("/mob")) ? 1 : 0)))) {
						continue;
					}
					if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(Q)])))) {
						log_msg = rt.modify(live(log_msg), fmt("＀, ", [(yield* g.call(f, P("/proc/key_name"), null, [live(Q)]))]), add);
					} else {
						log_msg = rt.modify(live(log_msg), fmt("＀, ", [rt.fv(f, "name", live(Q))]), add);
					}
				}
				rt.endFor(f, 1);
				if (truthy((yield* g.call(f, P("/proc/dd_hassuffix"), null, [live(log_msg), "("])))) {
					log_msg = rt.modify(live(log_msg), "empty)", add);
				} else {
					log_msg = (yield* g.call(f, P("/proc/dd_limittext"), null, [live(log_msg), subtract(rt.length(live(log_msg)), 2)]));
					log_msg = rt.modify(live(log_msg), ")", add);
				}
			}
			log_msg = rt.modify(live(log_msg), ", ", add);
		}
		yield* g.call(f, P("/proc/do_teleport"), null, [live(ROI), live(dest)]);
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.call(f, P("/proc/dd_hassuffix"), null, [live(log_msg), ", "])))) {
		log_msg = (yield* g.call(f, P("/proc/dd_limittext"), null, [live(log_msg), subtract(rt.length(live(log_msg)), 2)]));
	} else {
		log_msg = rt.modify(live(log_msg), "nothing", add);
	}
	if (truthy(live(sending))) {
		$0 = "to";
	} else {
		$0 = "from";
	}
	$1 = live(target_x);
	$2 = live(target_y);
	$3 = rt.sv(f, "z");
	if (truthy(live(A))) {
		$4 = rt.fv(f, "name", live(A));
	} else {
		$4 = "null area";
	}
	yield* g.srcCall(f, "investigate_log", (yield* g.callName(f, (log_msg = rt.modify(live(log_msg), fmt(" ＀ ＀, ＀, ＀ (＀)", [$0, $1, $2, $3, $4]), add)), "Join", [])), "telesci");
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true);

rt.type(10801, "/obj/machinery/launchpad/briefcase", "/obj/machinery/launchpad", {
	closed: 1,
	briefcase: null,
	icon_teleport: "blpad-beam",
	anchored: 0,
	teleport_speed: 20,
	range: 3,
	stationary: 0,
	name: "briefcase launchpad",
	desc: "A portable bluespace pad able to thrust matter through bluespace, teleporting it to or from nearby locations. Controlled via remote.",
	icon_state: "blpad-idle",
	use_power: 0,
	idle_power_usage: 0,
	active_power_usage: 0,
});

// /obj/machinery/launchpad/briefcase/proc/Initialize  (code/game/machinery/launch_pad.dm:166)  may sleep
rt.def("/obj/machinery/launchpad/briefcase/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/briefcase_launchpad")) ? 1 : 0))) {
		rt.setSv(f, "briefcase", rt.sv(f, "loc"));
	} else {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been spawned without a briefcase.", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/launchpad/briefcase/proc/Destroy  (code/game/machinery/launch_pad.dm:174)  may sleep
rt.def("/obj/machinery/launchpad/briefcase/proc/Destroy", function* Destroy(f: Frame) {
	if (!(!truthy(rt.sv(f, "briefcase")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "briefcase"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "briefcase")]);
	}
	rt.setSv(f, "briefcase", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/launchpad/briefcase/proc/isAvailable  (code/game/machinery/launch_pad.dm:182)
rt.def("/obj/machinery/launchpad/briefcase/proc/isAvailable", function isAvailable(f: Frame) {
	if (truthy(rt.sv(f, "closed"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/machinery/launchpad/briefcase/proc/MouseDrop  (code/game/machinery/launch_pad.dm:185)  may sleep
rt.def("/obj/machinery/launchpad/briefcase/proc/MouseDrop", function* MouseDrop(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(isEqual(live(f.args[0]), live(f.usr)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))))) return f.dot;
	if ((!truthy(rt.sv(f, "briefcase")) || !truthy((yield* g.callName(f, live(f.usr), "can_hold_items", []))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='notice'>＀ starts closing ＀...</span>", [live(f.usr), live(f.src)]), fmt("<span class='notice'>You start closing ＀...</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.usr), null, 30, "target", live(f.usr)], rt.Args.Named)))) return f.dot;
	yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "briefcase")]);
	yield* g.srcCall(f, "forceMove", rt.sv(f, "briefcase"));
	rt.setSv(f, "closed", 1);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

// /obj/machinery/launchpad/briefcase/proc/attackby  (code/game/machinery/launch_pad.dm:199)  may sleep
rt.def("/obj/machinery/launchpad/briefcase/proc/attackby", function* attackby(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/launchpad_remote")) ? 1 : 0))) {
		rt.setFv(f, "pad", (L = live(f.args[0])), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You link ＀ to ＀.</span>", [live(f.src), live(L)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(9553, "/obj/item/briefcase_launchpad", "/obj/item", {
	pad: null,
	flags: 64,
	throw_speed: 2,
	throw_range: 4,
	name: "briefcase",
	desc: "It's made of AUTHENTIC faux-leather and has a price-tag still attached. Its owner must be a real professional.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "briefcase",
	force: 8,
	hitsound: "swing_hit",
	w_class: 4,
	attack_verb: null,
	resistance_flags: 4,
	obj_integrity: 150,
	max_integrity: 150,
});

// /obj/item/briefcase_launchpad/proc/Initialize  (code/game/machinery/launch_pad.dm:225)  may sleep
rt.def("/obj/item/briefcase_launchpad/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pad", (yield* g.new_(f, T("/obj/machinery/launchpad/briefcase"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/briefcase_launchpad/proc/Destroy  (code/game/machinery/launch_pad.dm:229)  may sleep
rt.def("/obj/item/briefcase_launchpad/proc/Destroy", function* Destroy(f: Frame) {
	if (!(!truthy(rt.sv(f, "pad")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "pad"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pad")]);
	}
	rt.setSv(f, "pad", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/briefcase_launchpad/proc/attack_self  (code/game/machinery/launch_pad.dm:235)  may sleep
rt.def("/obj/item/briefcase_launchpad/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ starts setting down ＀...", [live(user), live(f.src)]), fmt("You start setting up ＀...", [rt.sv(f, "pad")])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(user)], rt.Args.Named)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "pad"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	rt.setFv(f, "closed", rt.sv(f, "pad"), 0);
	yield* g.callName(f, live(user), "transferItemToLoc", [live(f.src), rt.sv(f, "pad"), 1]);
	return f.dot;
}, true);

// /obj/item/briefcase_launchpad/proc/attackby  (code/game/machinery/launch_pad.dm:245)  may sleep
rt.def("/obj/item/briefcase_launchpad/proc/attackby", function* attackby(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/launchpad_remote")) ? 1 : 0))) {
		rt.setFv(f, "pad", (L = live(f.args[0])), rt.fv(f, "pad", live(f.src)));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You link ＀ to ＀.</span>", [rt.sv(f, "pad"), live(L)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(9221, "/obj/item/device/launchpad_remote", "/obj/item/device", {
	sending: 1,
	pad: null,
	name: "１Launchpad Control Remote",
	desc: "Used to teleport objects to and from a portable launchpad.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "blpad-remote",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "materials=3;magnets=2;bluespace=4;syndicate=3",
});

// /obj/item/device/launchpad_remote/proc/ui_interact  (code/game/machinery/launch_pad.dm:264)  may sleep
rt.def("/obj/item/device/launchpad_remote/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "launchpad_remote";
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
	if (!truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) {
		yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "launchpad_remote", "Briefcase Launchpad Remote", 550, 400, live(master_ui), live(state)]))), "set_style", ["syndicate"]);
		yield* g.callName(f, live(ui), "open", []);
	}
	yield* g.callName(f, live(ui), "set_autoupdate", [1]);
	return f.dot;
}, true);

// /obj/item/device/launchpad_remote/proc/ui_data  (code/game/machinery/launch_pad.dm:273)
rt.def("/obj/item/device/launchpad_remote/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	$0 = (data = rt.list());
	$1 = "has_pad";
	if (truthy(rt.sv(f, "pad"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	if (truthy(rt.sv(f, "pad"))) {
		rt.setAt(live(data), "pad_closed", rt.fv(f, "closed", rt.sv(f, "pad")));
	}
	if ((!truthy(rt.sv(f, "pad")) || truthy(rt.fv(f, "closed", rt.sv(f, "pad"))))) {
		return live(data);
	}
	rt.setAt(live(data), "pad_name", rt.fv(f, "display_name", rt.sv(f, "pad")));
	rt.setAt(live(data), "abs_x", rt.op(f, "Abs", [], [rt.fv(f, "x_offset", rt.sv(f, "pad"))]));
	rt.setAt(live(data), "abs_y", rt.op(f, "Abs", [], [rt.fv(f, "y_offset", rt.sv(f, "pad"))]));
	$0 = live(data);
	$1 = "north_south";
	if (rt.gt(rt.fv(f, "y_offset", rt.sv(f, "pad")), 0)) {
		$2 = "N";
	} else {
		$2 = "S";
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "east_west";
	if (rt.gt(rt.fv(f, "x_offset", rt.sv(f, "pad")), 0)) {
		$2 = "E";
	} else {
		$2 = "W";
	}
	rt.setAt($0, $1, $2);
	return live(data);
});

// /obj/item/device/launchpad_remote/proc/teleport  (code/game/machinery/launch_pad.dm:288)  may sleep
rt.def("/obj/item/device/launchpad_remote/proc/teleport", function* teleport(f: Frame, user: Value, pad: Value) {
	f.vars = () => [user, pad];
	if ((!truthy(live(pad)) || truthy(rt.fv(f, "gc_destroyed", live(pad))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>ERROR: Launchpad not responding. Check launchpad integrity.</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(pad), "isAvailable", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>ERROR: Launchpad not operative. Make sure the launchpad is ready and powered.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(pad), "doteleport", [live(user), rt.sv(f, "sending")]);
	return f.dot;
}, true);

// /obj/item/device/launchpad_remote/proc/ui_act  (code/game/machinery/launch_pad.dm:297)  may sleep
rt.def("/obj/item/device/launchpad_remote/proc/ui_act", function* ui_act(f: Frame) {
	let new_name: Value = null;
	let $0: any;
	f.vars = () => [new_name, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "right") {
		if (rt.lt(rt.fv(f, "x_offset", rt.sv(f, "pad")), rt.fv(f, "range", rt.sv(f, "pad")))) {
			rt.incField(f, rt.sv(f, "pad"), "x_offset", 1, true);
		}
		f.dot = 1;
	} else if ($0 === "left") {
		if (rt.gt(rt.fv(f, "x_offset", rt.sv(f, "pad")), multiply(rt.fv(f, "range", rt.sv(f, "pad")), -1))) {
			rt.incField(f, rt.sv(f, "pad"), "x_offset", -1, true);
		}
		f.dot = 1;
	} else if ($0 === "up") {
		if (rt.lt(rt.fv(f, "y_offset", rt.sv(f, "pad")), rt.fv(f, "range", rt.sv(f, "pad")))) {
			rt.incField(f, rt.sv(f, "pad"), "y_offset", 1, true);
		}
		f.dot = 1;
	} else if ($0 === "down") {
		if (rt.gt(rt.fv(f, "y_offset", rt.sv(f, "pad")), multiply(rt.fv(f, "range", rt.sv(f, "pad")), -1))) {
			rt.incField(f, rt.sv(f, "pad"), "y_offset", -1, true);
		}
		f.dot = 1;
	} else if ($0 === "up-right") {
		if (rt.lt(rt.fv(f, "y_offset", rt.sv(f, "pad")), rt.fv(f, "range", rt.sv(f, "pad")))) {
			rt.incField(f, rt.sv(f, "pad"), "y_offset", 1, true);
		}
		if (rt.lt(rt.fv(f, "x_offset", rt.sv(f, "pad")), rt.fv(f, "range", rt.sv(f, "pad")))) {
			rt.incField(f, rt.sv(f, "pad"), "x_offset", 1, true);
		}
		f.dot = 1;
	} else if ($0 === "up-left") {
		if (rt.lt(rt.fv(f, "y_offset", rt.sv(f, "pad")), rt.fv(f, "range", rt.sv(f, "pad")))) {
			rt.incField(f, rt.sv(f, "pad"), "y_offset", 1, true);
		}
		if (rt.gt(rt.fv(f, "x_offset", rt.sv(f, "pad")), multiply(rt.fv(f, "range", rt.sv(f, "pad")), -1))) {
			rt.incField(f, rt.sv(f, "pad"), "x_offset", -1, true);
		}
		f.dot = 1;
	} else if ($0 === "down-right") {
		if (rt.gt(rt.fv(f, "y_offset", rt.sv(f, "pad")), multiply(rt.fv(f, "range", rt.sv(f, "pad")), -1))) {
			rt.incField(f, rt.sv(f, "pad"), "y_offset", -1, true);
		}
		if (rt.lt(rt.fv(f, "x_offset", rt.sv(f, "pad")), rt.fv(f, "range", rt.sv(f, "pad")))) {
			rt.incField(f, rt.sv(f, "pad"), "x_offset", 1, true);
		}
		f.dot = 1;
	} else if ($0 === "down-left") {
		if (rt.gt(rt.fv(f, "y_offset", rt.sv(f, "pad")), multiply(rt.fv(f, "range", rt.sv(f, "pad")), -1))) {
			rt.incField(f, rt.sv(f, "pad"), "y_offset", -1, true);
		}
		if (rt.gt(rt.fv(f, "x_offset", rt.sv(f, "pad")), multiply(rt.fv(f, "range", rt.sv(f, "pad")), -1))) {
			rt.incField(f, rt.sv(f, "pad"), "x_offset", -1, true);
		}
		f.dot = 1;
	} else if ($0 === "reset") {
		rt.setFv(f, "y_offset", rt.sv(f, "pad"), 0);
		rt.setFv(f, "x_offset", rt.sv(f, "pad"), 0);
		f.dot = 1;
	} else if ($0 === "rename") {
		f.dot = 1;
		if (!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "How do you want to rename the launchpad?", "Launchpad", rt.fv(f, "display_name", rt.sv(f, "pad")), 15]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "display_name", rt.sv(f, "pad"), live(new_name));
	} else if ($0 === "remove") {
		f.dot = 1;
		if ((truthy(live(f.usr)) && !isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Are you sure?", "Unlink Launchpad", "I'm Sure", "Abort"])), "Abort"))) {
			rt.setSv(f, "pad", null);
		}
	} else if ($0 === "launch") {
		rt.setSv(f, "sending", 1);
		yield* g.srcCall(f, "teleport", live(f.usr), rt.sv(f, "pad"));
		f.dot = 1;
	} else if ($0 === "pull") {
		rt.setSv(f, "sending", 0);
		yield* g.srcCall(f, "teleport", live(f.usr), rt.sv(f, "pad"));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
