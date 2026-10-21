// From code/game/machinery/firealarm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10790, "/obj/machinery/firealarm", "/obj/machinery", {
	detecting: 1,
	buildstage: 2,
	anchored: 1,
	name: "fire alarm",
	desc: "<i>\"Pull this in case of emergency\"</i>. Thus, keep pulling it forever.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "fire0",
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 100,
	armor: null,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 6,
	power_channel: 3,
	resistance_flags: 2,
});

// /obj/machinery/firealarm/proc/<init>  (code/game/machinery/firealarm.dm:21)
rt.def("/obj/machinery/firealarm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]));
	return f.dot;
});

// /obj/machinery/firealarm/proc/New  (code/game/machinery/firealarm.dm:32)  may sleep
rt.def("/obj/machinery/firealarm/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		yield* g.callName(f, live(f.src), "setDir", [live(f.args[1])]);
	}
	if (truthy(live(f.args[2]))) {
		rt.setSv(f, "buildstage", 0);
		rt.setSv(f, "panel_open", 1);
		if (truthy(rt.bitAnd(live(f.args[1]), 3))) {
			$0 = 0;
		} else {
			if (isEqual(live(f.args[1]), 4)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(live(f.args[1]), 3))) {
			if (isEqual(live(f.args[1]), 1)) {
				$0 = -24;
			} else {
				$0 = 24;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["loc", "dir", "building"] });

// /obj/machinery/firealarm/proc/power_change  (code/game/machinery/firealarm.dm:43)
rt.def("/obj/machinery/firealarm/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/firealarm/proc/update_icon  (code/game/machinery/firealarm.dm:47)
rt.def("/obj/machinery/firealarm/proc/update_icon", function update_icon(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	rt.callSrc(f, "cut_overlays", []);
	A = rt.gv(f, "loc", (A = rt.fv(f, "loc", live(f.src))));
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", fmt("fire_b＀", [rt.sv(f, "buildstage")]));
		return live(f.dot);
	} else {
		rt.setSv(f, "icon_state", "fire0");
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			rt.setSv(f, "icon_state", "firex");
			return live(f.dot);
		}
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
			return live(f.dot);
		}
		if (isEqual(rt.fv(f, "z", live(f.src)), 2)) {
			rt.callSrc(f, "add_overlay", [fmt("overlay_＀", [rt.gl("security_level")])]);
		} else {
			rt.callSrc(f, "add_overlay", [fmt("overlay_＀", [0])]);
		}
		if (truthy(rt.sv(f, "detecting"))) {
			if (truthy(rt.fv(f, "fire", live(A)))) {
				$0 = "fire";
			} else {
				$0 = "clear";
			}
			rt.callSrc(f, "add_overlay", [fmt("overlay_＀", [$0])]);
		} else {
			rt.callSrc(f, "add_overlay", ["overlay_fire"]);
		}
	}
	return f.dot;
});

// /obj/machinery/firealarm/proc/emp_act  (code/game/machinery/firealarm.dm:77)  may sleep
rt.def("/obj/machinery/firealarm/proc/emp_act", function* emp_act(f: Frame) {
	if (truthy(rt.op(f, "Prob", [], [divide(50, live(f.args[0]))]))) {
		yield* g.srcCall(f, "alarm");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/firealarm/proc/emag_act  (code/game/machinery/firealarm.dm:82)
rt.def("/obj/machinery/firealarm/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	if (truthy(live(user))) {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>Sparks fly out of the ＀!</span>", [live(f.src)]), fmt("<span class='notice'>You emag ＀, disabling its thermal sensors.</span>", [live(f.src)])]);
	}
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/sparks4.ogg"), 50, 1]);
	return f.dot;
});

// /obj/machinery/firealarm/proc/temperature_expose  (code/game/machinery/firealarm.dm:90)
rt.def("/obj/machinery/firealarm/proc/temperature_expose", function temperature_expose(f: Frame) {
	if ((((!truthy(rt.sv(f, "emagged")) && truthy(rt.sv(f, "detecting"))) && !truthy(rt.sv(f, "stat"))) && (rt.gt(live(f.args[1]), 473.1499938964844) || rt.lt(live(f.args[1]), 260.1499938964844)))) {
		rt.callSrc(f, "alarm", []);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["air", "temperature", "volume"] });

// /obj/machinery/firealarm/proc/alarm  (code/game/machinery/firealarm.dm:95)
rt.def("/obj/machinery/firealarm/proc/alarm", function alarm(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.callSrc(f, "is_operational", []))) {
		return live(f.dot);
	}
	rt.callName(f, (A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])), "firealert", [live(f.src)]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/FireAlarm.ogg"), 50]);
	return f.dot;
});

// /obj/machinery/firealarm/proc/alarm_in  (code/game/machinery/firealarm.dm:102)  may sleep
rt.def("/obj/machinery/firealarm/proc/alarm_in", function* alarm_in(f: Frame, time: Value) {
	f.vars = () => [time];
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/firealarm/proc/alarm")])), live(time)]);
	return f.dot;
}, true);

// /obj/machinery/firealarm/proc/reset  (code/game/machinery/firealarm.dm:105)
rt.def("/obj/machinery/firealarm/proc/reset", function reset(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.callSrc(f, "is_operational", []))) {
		return live(f.dot);
	}
	rt.callName(f, (A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])), "firereset", [live(f.src)]);
	return f.dot;
});

// /obj/machinery/firealarm/proc/reset_in  (code/game/machinery/firealarm.dm:111)  may sleep
rt.def("/obj/machinery/firealarm/proc/reset_in", function* reset_in(f: Frame, time: Value) {
	f.vars = () => [time];
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/firealarm/proc/reset")])), live(time)]);
	return f.dot;
}, true);

// /obj/machinery/firealarm/proc/ui_interact  (code/game/machinery/firealarm.dm:115)  may sleep
rt.def("/obj/machinery/firealarm/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "firealarm", rt.sv(f, "name"), 300, 150, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/firealarm/proc/ui_data  (code/game/machinery/firealarm.dm:121)
rt.def("/obj/machinery/firealarm/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, A: Value = null;
	f.vars = () => [data, A];
	rt.setAt((data = rt.list()), "emagged", rt.sv(f, "emagged"));
	if (isEqual(rt.fv(f, "z", live(f.src)), 2)) {
		rt.setAt(live(data), "seclevel", rt.call(f, P("/proc/get_security_level"), null, []));
	} else {
		rt.setAt(live(data), "seclevel", "green");
	}
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	rt.setAt(live(data), "alarm", rt.fv(f, "fire", live(A)));
	return live(data);
});

// /obj/machinery/firealarm/proc/ui_act  (code/game/machinery/firealarm.dm:135)  may sleep
rt.def("/obj/machinery/firealarm/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !isEqual(rt.sv(f, "buildstage"), 2))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "reset") {
		yield* g.srcCall(f, "reset");
		f.dot = 1;
	} else if ($0 === "alarm") {
		yield* g.srcCall(f, "alarm");
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/firealarm/proc/AltClick  (added: modern tg's alt-click toggle; same checks as the window's ui_act)  may sleep
rt.def("/obj/machinery/firealarm/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [user, A];
	if (!truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)])))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "buildstage"), 2) || !truthy(rt.callSrc(f, "is_operational", []))) {
		return live(f.dot);
	}
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	if (truthy(rt.fv(f, "fire", live(A)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You reset ＀.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "reset");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You activate ＀.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "alarm");
	}
	return f.dot;
}, true);

// /obj/machinery/firealarm/proc/attackby  (code/game/machinery/firealarm.dm:146)  may sleep
rt.def("/obj/machinery/firealarm/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, coil: Value = null, frame: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, coil, frame, $0, $1];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && isEqual(rt.sv(f, "buildstage"), 2))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "panel_open"))) {
			$1 = "exposed";
		} else {
			$1 = "unexposed";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The wires have been ＀.</span>", [$1])]);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
			WT = live(f.args[0]);
			if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
				if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀...</span>", [live(f.src)])]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named)))) {
						rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already in good condition!</span>", [live(f.src)])]);
			}
			return live(f.dot);
		}
		$0 = rt.sv(f, "buildstage");
		if ($0 === 2) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
				rt.setSv(f, "detecting", (!truthy(rt.sv(f, "detecting")) ? 1 : 0));
				if (truthy(rt.fv(f, "detecting", live(f.src)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has reconnected ＀'s detecting unit!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You reconnect ＀'s detecting unit.</span>", [live(f.src)])]);
				} else {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has disconnected ＀'s detecting unit!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You disconnect ＀'s detecting unit.</span>", [live(f.src)])]);
				}
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
					rt.setSv(f, "buildstage", 1);
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.fv(f, "loc", live(f.args[1])), 5]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut the wires from ％！.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				}
			}
		} else if ($0 === 1) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
				if (rt.lt((yield* g.callName(f, (coil = live(f.args[0])), "get_amount", [])), 5)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more cable for this!</span>"]);
				} else {
					yield* g.callName(f, live(coil), "use", [5]);
					rt.setSv(f, "buildstage", 2);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You wire ％！.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "update_icon");
				}
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the electronics from ＀.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), "<span class='notice'>You start prying out the circuit...</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if (isEqual(rt.sv(f, "buildstage"), 1)) {
							if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the destroyed circuit.</span>"]);
								(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pry out the circuit.</span>"]);
								yield* g.new_(f, T("/obj/item/weapon/electronics/firealarm"), [rt.fv(f, "loc", live(f.args[1]))]);
							}
							rt.setSv(f, "buildstage", 0);
							yield* g.srcCall(f, "update_icon");
						}
					}
					return live(f.dot);
				}
			}
		} else if ($0 === 0) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/firealarm")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You insert the circuit.</span>"]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
				rt.setSv(f, "buildstage", 1);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the fire alarm assembly from the wall.", [live(f.args[1])]), "<span class='notice'>You remove the fire alarm assembly from the wall.</span>"]);
					rt.setFv(f, "loc", (frame = (yield* g.new_(f, T("/obj/item/wallframe/firealarm"), []))), rt.fv(f, "loc", live(f.args[1])));
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					return live(f.dot);
				}
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/firealarm/proc/take_damage  (code/game/machinery/firealarm.dm:235)  may sleep
rt.def("/obj/machinery/firealarm/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!((rt.gt(rt.sv(f, "obj_integrity"), 0) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) && !isEqual(rt.sv(f, "buildstage"), 0))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [33]))) return f.dot;
	yield* g.srcCall(f, "alarm");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/machinery/firealarm/proc/obj_break  (code/game/machinery/firealarm.dm:242)
rt.def("/obj/machinery/firealarm/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!((!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) && !isEqual(rt.sv(f, "buildstage"), 0))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/firealarm/proc/deconstruct  (code/game/machinery/firealarm.dm:247)  may sleep
rt.def("/obj/machinery/firealarm/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	f.vars = () => [disassembled, I];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 1]);
		if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			I = (yield* g.new_(f, T("/obj/item/weapon/electronics/firealarm"), [rt.sv(f, "loc")]));
			if (!truthy(live(disassembled))) {
				rt.setFv(f, "obj_integrity", live(I), multiply(rt.fv(f, "max_integrity", live(I)), 0.5));
			}
		}
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 3]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10791, "/obj/machinery/firealarm/partyalarm", "/obj/machinery/firealarm", {
	name: "１PARTY BUTTON",
	desc: "Cuban Pete is in the house!",
});

// /obj/machinery/firealarm/partyalarm/proc/attack_hand  (code/game/machinery/firealarm.dm:266)  may sleep
rt.def("/obj/machinery/firealarm/partyalarm/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let A: Value = null, d1: Value = null, dat: Value = null, popup: Value = null;
	f.vars = () => [user, A, d1, dat, popup];
	if (((truthy(rt.fv(f, "stat", live(user))) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "buildstage"), 2)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	A = rt.fv(f, "loc", live(f.src));
	d1 = null;
	dat = null;
	if ((truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(user))))) {
		if (truthy(rt.gv(f, "party", (A = rt.fv(f, "loc", live(A)))))) {
			d1 = fmt("<A href='?src=＃;reset=1'>No Party :(</A>", [live(f.src)]);
		} else {
			d1 = fmt("<A href='?src=＃;alarm=1'>PARTY!!!</A>", [live(f.src)]);
		}
		dat = fmt("<HTML><HEAD></HEAD><BODY><TT><B>Party Button</B> ＀</BODY></HTML>", [live(d1)]);
	} else {
		if (truthy(rt.gv(f, "fire", (A = rt.fv(f, "loc", live(A)))))) {
			d1 = fmt("<A href='?src=＃;reset=1'>＀</A>", [live(f.src), (yield* g.call(f, P("/proc/stars"), null, ["No Party :("]))]);
		} else {
			d1 = fmt("<A href='?src=＃;alarm=1'>＀</A>", [live(f.src), (yield* g.call(f, P("/proc/stars"), null, ["PARTY!!!"]))]);
		}
		dat = fmt("<HTML><HEAD></HEAD><BODY><TT><B>＀</B> ＀", [(yield* g.call(f, P("/proc/stars"), null, ["Party Button"])), live(d1)]);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "firealarm", "Party Alarm"]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/firealarm/partyalarm/proc/reset  (code/game/machinery/firealarm.dm:300)
rt.def("/obj/machinery/firealarm/partyalarm/proc/reset", function reset(f: Frame) {
	let A: Value = null, RA: Value = null;
	let $e: any;
	f.vars = () => [A, RA, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((A = rt.gv(f, "loc", (A = rt.fv(f, "loc", live(f.src))))), T("/area")) ? 1 : 0))) {
		return live(f.dot);
	}
	RA = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		rt.callName(f, live(RA), "partyreset", []);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /obj/machinery/firealarm/partyalarm/proc/alarm  (code/game/machinery/firealarm.dm:311)
rt.def("/obj/machinery/firealarm/partyalarm/proc/alarm", function alarm(f: Frame) {
	let A: Value = null, RA: Value = null;
	let $e: any;
	f.vars = () => [A, RA, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((A = rt.gv(f, "loc", (A = rt.fv(f, "loc", live(f.src))))), T("/area")) ? 1 : 0))) {
		return live(f.dot);
	}
	RA = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RA = $e;
		rt.callName(f, live(RA), "partyalert", []);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});
