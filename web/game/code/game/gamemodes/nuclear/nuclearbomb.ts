// From code/game/gamemodes/nuclear/nuclearbomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10685, "/obj/machinery/nuclearbomb", "/obj/machinery", {
	timer_set: 90,
	default_timer_set: 90,
	minimum_timer_set: 90,
	maximum_timer_set: 3600,
	ui_style: "nanotrasen",
	numeric_input: "",
	timing: 0,
	exploding: 0,
	detonation_timer: null,
	r_code: "ADMIN",
	yes_code: 0,
	safety: 1,
	auth: null,
	previous_level: "",
	core: null,
	deconstruction_state: 5,
	lights: "",
	interior: "",
	countdown: null,
	name: "nuclear fission explosive",
	desc: "You probably shouldn't stick around to see if this is armed.",
	icon: rt.rsc("icons/obj/machines/nuke.dmi"),
	icon_state: "nuclearbomb_base",
	density: 1,
	resistance_flags: 115,
	use_power: 0,
}, { global: { bomb_set: 751 } });

// /obj/machinery/nuclearbomb/proc/Initialize  (code/game/gamemodes/nuclear/nuclearbomb.dm:46)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/nuclearbomb"), [live(f.src)])));
	rt.modGl("nuke_list", live(f.src), add);
	rt.setSv(f, "core", (yield* g.new_(f, T("/obj/item/nuke_core"), [live(f.src)])));
	rt.setFv(f, "isprocessing", rt.sv(f, "core"), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", rt.sv(f, "core"), subtract));
	yield* g.srcCall(f, "update_icon");
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	rt.setSv(f, "previous_level", (yield* g.call(f, P("/proc/get_security_level"), null, [])));
	return f.dot;
}, true);

// /obj/machinery/nuclearbomb/proc/Destroy  (code/game/gamemodes/nuclear/nuclearbomb.dm:57)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "safety", 0);
	if (!truthy(rt.sv(f, "exploding"))) {
		yield* g.srcCall(f, "set_safety");
	}
	(rt.modGl("poi_list", live(f.src), subtract));
	(rt.modGl("nuke_list", live(f.src), subtract));
	if (truthy(rt.sv(f, "countdown"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	}
	rt.setSv(f, "countdown", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/nuclearbomb/proc/examine  (code/game/gamemodes/nuclear/nuclearbomb.dm:68)
rt.def("/obj/machinery/nuclearbomb/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "exploding"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is in the process of exploding. Perhaps reviewing your affairs is in order."]);
	}
	if (!truthy(rt.sv(f, "timing"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There are ＀ seconds until detonation.", [rt.callSrc(f, "get_time_left", [])])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(10687, "/obj/machinery/nuclearbomb/syndicate", "/obj/machinery/nuclearbomb", {});

// /obj/machinery/nuclearbomb/syndicate/proc/Initialize  (code/game/gamemodes/nuclear/nuclearbomb.dm:85)  may sleep
rt.def("/obj/machinery/nuclearbomb/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	let existing: Value = null;
	f.vars = () => [existing];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((existing = rt.locateIn(f, "syndienuke", rt.world())))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		rt.throw_(f, (yield* g.new_(f, T("/exception"), [fmt("Attempted to spawn a syndicate nuke while one already exists at ＀,＀,＀", [rt.gv(f, "x", rt.fv(f, "loc", live(existing))), rt.gv(f, "y", rt.fv(f, "loc", live(existing))), rt.gv(f, "z", rt.fv(f, "loc", live(existing)))]), "code/game/gamemodes/nuclear/nuclearbomb.dm", 89])));
		return 0;
	}
	rt.setSv(f, "tag", "syndienuke");
	return f.dot;
}, true);

// /obj/machinery/nuclearbomb/proc/attackby  (code/game/gamemodes/nuclear/nuclearbomb.dm:94)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/attackby", function* attackby(f: Frame) {
	let welder: Value = null, core_box: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [welder, core_box, M, $0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/nuclear")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
		rt.setSv(f, "auth", live(f.args[0]));
		yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
		return live(f.dot);
	}
	$0 = rt.sv(f, "deconstruction_state");
	if ($0 === 5) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver/nuke")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start removing ＀'s front panel's screws...</span>", [live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(60, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				rt.setSv(f, "deconstruction_state", 4);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the screws from ＀'s front panel.</span>", [live(f.src)])]);
				yield* g.srcCall(f, "update_icon");
			}
			return live(f.dot);
		}
	} else if ($0 === 4) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start removing ＀'s front panel...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove ＀'s front panel.</span>", [live(f.src)])]);
				rt.setSv(f, "deconstruction_state", 3);
				yield* g.srcCall(f, "update_icon");
			}
			return live(f.dot);
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			welder = live(f.args[0]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start cutting ＀'s inner plate...</span>", [live(f.src)])]);
			if (truthy((yield* g.callName(f, live(welder), "remove_fuel", [1, live(f.args[1])])))) {
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(80, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut ＀'s inner plate.</span>", [live(f.src)])]);
					rt.setSv(f, "deconstruction_state", 2);
					yield* g.srcCall(f, "update_icon");
				}
			}
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start prying off ＀'s inner plate...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You pry off ＀'s inner plate. You can see the core's green glow!</span>", [live(f.src)])]);
				rt.setSv(f, "deconstruction_state", 1);
				yield* g.srcCall(f, "update_icon");
				if (!truthy(rt.fv(f, "isprocessing", rt.sv(f, "core")))) {
					rt.setFv(f, "isprocessing", rt.sv(f, "core"), 1);
					rt.modField(f, rt.gl("SSobj"), "processing", rt.sv(f, "core"), add);
				}
			}
			return live(f.dot);
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/nuke_core_container")) ? 1 : 0))) {
			core_box = live(f.args[0]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start loading the plutonium core into ＀...</span>", [live(core_box)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
				if (truthy((yield* g.callName(f, live(core_box), "load", [rt.sv(f, "core"), live(f.args[1])])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You load the plutonium core into ＀.</span>", [live(core_box)])]);
					rt.setSv(f, "deconstruction_state", 0);
					yield* g.srcCall(f, "update_icon");
					rt.setSv(f, "core", null);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You fail to load the plutonium core into ＀. ＀ has already been used!</span>", [live(core_box), live(core_box)])]);
				}
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
			if (rt.ge(rt.gv(f, "amount", (M = live(f.args[0]))), 20)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀'s inner metal plate...</span>", [live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 100, "target", live(f.src)], rt.Args.Named)))) {
					if (truthy((yield* g.callName(f, live(M), "use", [20])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀'s inner metal plate. The radiation is contained.</span>", [live(f.src)])]);
						rt.setSv(f, "deconstruction_state", 3);
						rt.setFv(f, "isprocessing", rt.sv(f, "core"), 0);
						(rt.modField(f, rt.gl("SSobj"), "processing", rt.sv(f, "core"), subtract));
						yield* g.srcCall(f, "update_icon");
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more metal to do that!</span>"]);
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more metal to do that!</span>"]);
			}
			return live(f.dot);
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/nuclearbomb/proc/get_nuke_state  (code/game/gamemodes/nuclear/nuclearbomb.dm:178)
rt.def("/obj/machinery/nuclearbomb/proc/get_nuke_state", function get_nuke_state(f: Frame) {
	if (truthy(rt.sv(f, "exploding"))) {
		return 3;
	}
	if (truthy(rt.sv(f, "timing"))) {
		return 2;
	}
	if (truthy(rt.sv(f, "safety"))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/update_icon  (code/game/gamemodes/nuclear/nuclearbomb.dm:183)
rt.def("/obj/machinery/nuclearbomb/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.sv(f, "deconstruction_state"), 5)) {
		$0 = rt.callSrc(f, "get_nuke_state", []);
		if ($0 === 0 || $0 === 1) {
			rt.setSv(f, "icon_state", "nuclearbomb_base");
			rt.callSrc(f, "update_icon_interior", []);
			rt.callSrc(f, "update_icon_lights", []);
		} else if ($0 === 2) {
			rt.callSrc(f, "cut_overlays", []);
			rt.setSv(f, "icon_state", "nuclearbomb_timing");
		} else if ($0 === 3) {
			rt.callSrc(f, "cut_overlays", []);
			rt.setSv(f, "icon_state", "nuclearbomb_exploding");
		}
	} else {
		rt.setSv(f, "icon_state", "nuclearbomb_base");
		rt.callSrc(f, "update_icon_interior", []);
		rt.callSrc(f, "update_icon_lights", []);
	}
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/update_icon_interior  (code/game/gamemodes/nuclear/nuclearbomb.dm:201)
rt.def("/obj/machinery/nuclearbomb/proc/update_icon_interior", function update_icon_interior(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "interior")]);
	$0 = rt.sv(f, "deconstruction_state");
	if ($0 === 4) {
		rt.setSv(f, "interior", "panel-unscrewed");
	} else if ($0 === 3) {
		rt.setSv(f, "interior", "panel-removed");
	} else if ($0 === 2) {
		rt.setSv(f, "interior", "plate-welded");
	} else if ($0 === 1) {
		rt.setSv(f, "interior", "plate-removed");
	} else if ($0 === 0) {
		rt.setSv(f, "interior", "core-removed");
	} else if ($0 === 5) {
		return live(f.dot);
	}
	rt.callSrc(f, "add_overlay", [rt.sv(f, "interior")]);
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/update_icon_lights  (code/game/gamemodes/nuclear/nuclearbomb.dm:219)
rt.def("/obj/machinery/nuclearbomb/proc/update_icon_lights", function update_icon_lights(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "lights"))) {
		rt.callSrc(f, "cut_overlay", [rt.sv(f, "lights")]);
	}
	$0 = rt.callSrc(f, "get_nuke_state", []);
	if ($0 === 0) {
		rt.setSv(f, "lights", "");
		return live(f.dot);
	} else if ($0 === 1) {
		rt.setSv(f, "lights", "lights-safety");
	} else if ($0 === 2) {
		rt.setSv(f, "lights", "lights-timing");
	} else if ($0 === 3) {
		rt.setSv(f, "lights", "lights-exploding");
	}
	rt.callSrc(f, "add_overlay", [rt.sv(f, "lights")]);
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/process  (code/game/gamemodes/nuclear/nuclearbomb.dm:233)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/process", function* process(f: Frame) {
	let volume: Value = null;
	let $0: any;
	f.vars = () => [volume, $0];
	if (!(truthy(rt.sv(f, "timing")) && !truthy(rt.sv(f, "exploding")))) return f.dot;
	rt.setGl("bomb_set", 1);
	if (rt.lt(rt.sv(f, "detonation_timer"), rt.worldTime(f))) {
		yield* g.srcCall(f, "explode");
	} else {
		if (rt.le((yield* g.srcCall(f, "get_time_left")), 20)) {
			$0 = 30;
		} else {
			$0 = 5;
		}
		volume = $0;
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), live(volume), 0]);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/nuclearbomb/proc/attack_paw  (code/game/gamemodes/nuclear/nuclearbomb.dm:242)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/nuclearbomb/proc/ui_interact  (code/game/gamemodes/nuclear/nuclearbomb.dm:245)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "nuclear_bomb", rt.sv(f, "name"), 500, 600, live(master_ui), live(state)]))), "set_style", [rt.sv(f, "ui_style")]);
	yield* g.callName(f, live(ui), "open", []);
	return f.dot;
}, true);

// /obj/machinery/nuclearbomb/proc/ui_data  (code/game/gamemodes/nuclear/nuclearbomb.dm:252)
rt.def("/obj/machinery/nuclearbomb/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, first_status: Value = null, second_status: Value = null, message: Value = null;
	let $0: any;
	f.vars = () => [data, first_status, second_status, message, $0];
	rt.setAt((data = rt.list()), "disk_present", rt.sv(f, "auth"));
	rt.setAt(live(data), "code_approved", rt.sv(f, "yes_code"));
	first_status = null;
	if (truthy(rt.sv(f, "auth"))) {
		if (truthy(rt.sv(f, "yes_code"))) {
			if (truthy(rt.sv(f, "timing"))) {
				$0 = "Func/Set";
			} else {
				$0 = "Functional";
			}
			first_status = $0;
		} else {
			first_status = "Auth S2.";
		}
	} else {
		if (truthy(rt.sv(f, "timing"))) {
			first_status = "Set";
		} else {
			first_status = "Auth S1.";
		}
	}
	if (truthy(rt.sv(f, "safety"))) {
		$0 = "Safe";
	} else {
		$0 = "Engaged";
	}
	second_status = $0;
	rt.setAt(live(data), "status1", live(first_status));
	rt.setAt(live(data), "status2", live(second_status));
	rt.setAt(live(data), "anchored", rt.sv(f, "anchored"));
	rt.setAt(live(data), "safety", rt.sv(f, "safety"));
	rt.setAt(live(data), "timing", rt.sv(f, "timing"));
	rt.setAt(live(data), "time_left", rt.callSrc(f, "get_time_left", []));
	rt.setAt(live(data), "timer_set", rt.sv(f, "timer_set"));
	rt.setAt(live(data), "timer_is_not_default", (!isEqual(rt.sv(f, "timer_set"), rt.sv(f, "default_timer_set")) ? 1 : 0));
	rt.setAt(live(data), "timer_is_not_min", (!isEqual(rt.sv(f, "timer_set"), rt.sv(f, "minimum_timer_set")) ? 1 : 0));
	rt.setAt(live(data), "timer_is_not_max", (!isEqual(rt.sv(f, "timer_set"), rt.sv(f, "maximum_timer_set")) ? 1 : 0));
	message = "AUTH";
	if (truthy(rt.sv(f, "auth"))) {
		message = fmt("＀", [rt.sv(f, "numeric_input")]);
		if (truthy(rt.sv(f, "yes_code"))) {
			message = "*****";
		}
	}
	rt.setAt(live(data), "message", live(message));
	return live(data);
});

// /obj/machinery/nuclearbomb/proc/ui_act  (code/game/gamemodes/nuclear/nuclearbomb.dm:289)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/ui_act", function* ui_act(f: Frame) {
	let I: Value = null, digit: Value = null, change: Value = null, user_input: Value = null, N: Value = null;
	let $0: any;
	f.vars = () => [I, digit, change, user_input, N, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "eject_disk") {
		if ((truthy(rt.sv(f, "auth")) && isEqual(rt.fv(f, "loc", rt.sv(f, "auth")), live(f.src)))) {
			yield* g.callName(f, rt.sv(f, "auth"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			rt.setSv(f, "auth", null);
			f.dot = 1;
		}
	} else if ($0 === "insert_disk") {
		if (!truthy(rt.sv(f, "auth"))) {
			if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/disk/nuclear")) ? 1 : 0))) {
				yield* g.callName(f, live(f.usr), "drop_item", []);
				yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
				rt.setSv(f, "auth", live(I));
				f.dot = 1;
			}
		}
	} else if ($0 === "keypad") {
		if (truthy(rt.sv(f, "auth"))) {
			$0 = (digit = rt.at(live(f.args[1]), "digit"));
			if ($0 === "R") {
				rt.setSv(f, "numeric_input", "");
				rt.setSv(f, "yes_code", 0);
				f.dot = 1;
			} else if ($0 === "E") {
				if (isEqual(rt.sv(f, "numeric_input"), rt.sv(f, "r_code"))) {
					rt.setSv(f, "numeric_input", "");
					rt.setSv(f, "yes_code", 1);
					f.dot = 1;
				} else {
					rt.setSv(f, "numeric_input", "ERROR");
				}
			} else if ($0 === "0" || $0 === "1" || $0 === "2" || $0 === "3" || $0 === "4" || $0 === "5" || $0 === "6" || $0 === "7" || $0 === "8" || $0 === "9") {
				if (!isEqual(rt.sv(f, "numeric_input"), "ERROR")) {
					if (rt.gt(rt.length((rt.modSrcVar(f, "numeric_input", live(digit), add))), 5)) {
						rt.setSv(f, "numeric_input", "ERROR");
					}
					f.dot = 1;
				}
			}
		}
	} else if ($0 === "timer") {
		if ((truthy(rt.sv(f, "auth")) && truthy(rt.sv(f, "yes_code")))) {
			if (isEqual((change = rt.at(live(f.args[1]), "change")), "reset")) {
				rt.setSv(f, "timer_set", rt.sv(f, "default_timer_set"));
			} else {
				if (isEqual(live(change), "decrease")) {
					rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_timer_set"), subtract(rt.sv(f, "timer_set"), 10)])));
				} else {
					if (isEqual(live(change), "increase")) {
						rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "maximum_timer_set"), add(rt.sv(f, "timer_set"), 10)])));
					} else {
						if (isEqual(live(change), "input")) {
							if (!truthy((user_input = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "name"), "Set time to detonation.", live(f.usr), null]))))) {
								return live(f.dot);
							}
							if (!truthy((N = (yield* g.call(f, P("/proc/text2num"), null, [live(user_input)]))))) {
								return live(f.dot);
							}
							rt.setSv(f, "timer_set", (yield* g.call(f, P("/proc/max"), null, [rt.sv(f, "minimum_timer_set"), (yield* g.call(f, P("/proc/min"), null, [live(N), rt.sv(f, "maximum_timer_set")]))])));
						}
					}
				}
			}
			f.dot = 1;
		}
	} else if ($0 === "safety") {
		if ((truthy(rt.sv(f, "auth")) && truthy(rt.sv(f, "yes_code")))) {
			yield* g.srcCall(f, "set_safety");
		}
	} else if ($0 === "anchor") {
		if ((truthy(rt.sv(f, "auth")) && truthy(rt.sv(f, "yes_code")))) {
			yield* g.srcCall(f, "set_anchor");
		}
	} else if ($0 === "toggle_timer") {
		if (!((truthy(rt.sv(f, "auth")) && truthy(rt.sv(f, "yes_code"))) && !truthy(rt.sv(f, "safety")))) return f.dot;
		yield* g.srcCall(f, "set_active");
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/nuclearbomb/proc/set_anchor  (code/game/gamemodes/nuclear/nuclearbomb.dm:356)
rt.def("/obj/machinery/nuclearbomb/proc/set_anchor", function set_anchor(f: Frame) {
	if (!truthy(rt.callSrc(f, "isinspace", []))) {
		rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There is nothing to anchor to!</span>"]);
	}
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/set_safety  (code/game/gamemodes/nuclear/nuclearbomb.dm:362)
rt.def("/obj/machinery/nuclearbomb/proc/set_safety", function set_safety(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	rt.setSv(f, "safety", (!truthy(rt.sv(f, "safety")) ? 1 : 0));
	if (truthy(rt.sv(f, "safety"))) {
		if (truthy(rt.sv(f, "timing"))) {
			rt.call(f, P("/proc/set_security_level"), null, [rt.sv(f, "previous_level")]);
			S = null;
			rt.forList(f, 0, rt.gl("pinpointer_list"), T("/obj/item/weapon/pinpointer/syndicate"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				rt.callName(f, live(S), "switch_mode_to", [rt.initial(f, live(S), "mode")]);
				rt.setFv(f, "nuke_warning", live(S), 0);
			}
			rt.endFor(f, 0);
		}
		rt.setSv(f, "timing", 0);
		rt.setGl("bomb_set", 1);
		rt.setSv(f, "detonation_timer", null);
		rt.callName(f, rt.sv(f, "countdown"), "stop", []);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/set_active  (code/game/gamemodes/nuclear/nuclearbomb.dm:376)
rt.def("/obj/machinery/nuclearbomb/proc/set_active", function set_active(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if ((truthy(rt.sv(f, "safety")) && !truthy(rt.gl("bomb_set")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The safety is still on.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "timing", (!truthy(rt.sv(f, "timing")) ? 1 : 0));
	if (truthy(rt.sv(f, "timing"))) {
		rt.setSv(f, "previous_level", rt.call(f, P("/proc/get_security_level"), null, []));
		rt.setGl("bomb_set", 1);
		rt.call(f, P("/proc/set_security_level"), null, ["delta"]);
		rt.setSv(f, "detonation_timer", add(rt.worldTime(f), multiply(rt.sv(f, "timer_set"), 10)));
		S = null;
		rt.forList(f, 0, rt.gl("pinpointer_list"), T("/obj/item/weapon/pinpointer/syndicate"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			rt.callName(f, live(S), "switch_mode_to", [3]);
		}
		rt.endFor(f, 0);
		rt.callName(f, rt.sv(f, "countdown"), "start", []);
	} else {
		rt.setGl("bomb_set", 0);
		rt.setSv(f, "detonation_timer", null);
		rt.call(f, P("/proc/set_security_level"), null, [rt.sv(f, "previous_level")]);
		S = null;
		rt.forList(f, 0, rt.gl("pinpointer_list"), T("/obj/item/weapon/pinpointer/syndicate"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			rt.callName(f, live(S), "switch_mode_to", [rt.initial(f, live(S), "mode")]);
			rt.setFv(f, "nuke_warning", live(S), 0);
		}
		rt.endFor(f, 0);
		rt.callName(f, rt.sv(f, "countdown"), "stop", []);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/get_time_left  (code/game/gamemodes/nuclear/nuclearbomb.dm:400)
rt.def("/obj/machinery/nuclearbomb/proc/get_time_left", function get_time_left(f: Frame) {
	if (truthy(rt.sv(f, "timing"))) {
		f.dot = rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "detonation_timer"), rt.worldTime(f))]), 10), 1]);
	} else {
		f.dot = rt.sv(f, "timer_set");
	}
	return f.dot;
});

// /obj/machinery/nuclearbomb/proc/blob_act  (code/game/gamemodes/nuclear/nuclearbomb.dm:407)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (truthy(rt.sv(f, "exploding"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/nuclearbomb/proc/tesla_act  (code/game/gamemodes/nuclear/nuclearbomb.dm:410)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["power", "explosive"] });

// /obj/machinery/nuclearbomb/proc/explode  (code/game/gamemodes/nuclear/nuclearbomb.dm:423)  may sleep
rt.def("/obj/machinery/nuclearbomb/proc/explode", function* explode(f: Frame) {
	let M: Value = null, off_station: Value = null, bomb_location: Value = null, A: Value = null, Shuttle: Value = null, NM: Value = null, NM_3: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [M, off_station, bomb_location, A, Shuttle, NM, NM_3, $0, $1, $e];
	if (truthy(rt.sv(f, "safety"))) {
		rt.setSv(f, "timing", 0);
		return live(f.dot);
	}
	rt.setSv(f, "exploding", 1);
	rt.setSv(f, "yes_code", 0);
	rt.setSv(f, "safety", 1);
	yield* g.srcCall(f, "update_icon");
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.op(f, "Output", [], [live(M), rt.rsc("sound/machines/alarm.ogg")], false);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.gl("SSticker")) && truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) {
		rt.setFv(f, "explosion_in_progress", rt.fv(f, "mode", rt.gl("SSticker")), 1);
	}
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	if (!truthy(rt.sv(f, "core"))) {
		yield* g.callName(f, rt.gl("SSticker"), "station_explosion_cinematic", [3, "no_core", live(f.src)]);
		rt.setFv(f, "explosion_in_progress", rt.fv(f, "mode", rt.gl("SSticker")), 0);
		return live(f.dot);
	}
	rt.setGl("enter_allowed", 0);
	off_station = 0;
	bomb_location = rt.getStep(f, live(f.src), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(bomb_location)]));
	if ((truthy(live(bomb_location)) && isEqual(rt.fv(f, "z", live(bomb_location)), 2))) {
		if (truthy((rt.istype(live(A), T("/area/space")) ? 1 : 0))) {
			off_station = 2;
		}
		if ((((rt.lt(rt.fv(f, "x", live(bomb_location)), 1) || rt.gt(rt.fv(f, "x", live(bomb_location)), 255)) || rt.lt(rt.fv(f, "y", live(bomb_location)), 1)) || rt.gt(rt.fv(f, "y", live(bomb_location)), 255))) {
			off_station = 2;
		}
	} else {
		if ((truthy((rt.istype(live(A), T("/area/syndicate_mothership")) ? 1 : 0)) || (truthy((rt.istype(live(A), T("/area/shuttle/syndicate")) ? 1 : 0)) && isEqual(rt.fv(f, "z", live(bomb_location)), 1)))) {
			off_station = 3;
		} else {
			off_station = 1;
		}
	}
	if (truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/nuclear")) ? 1 : 0))) {
		Shuttle = (yield* g.callName(f, rt.gl("SSshuttle"), "getShuttle", ["syndicate"]));
		$0 = (NM = rt.fv(f, "mode", rt.gl("SSticker")));
		if ((truthy(live(Shuttle)) && (isEqual(rt.fv(f, "z", live(Shuttle)), 1) || isEqual(rt.fv(f, "z", live(Shuttle)), 11)))) {
			$1 = 0;
		} else {
			$1 = 1;
		}
		rt.setFv(f, "syndies_didnt_escape", $0, $1);
		rt.setFv(f, "nuke_off_station", live(NM), live(off_station));
	}
	yield* g.callName(f, rt.gl("SSticker"), "station_explosion_cinematic", [live(off_station), null, live(f.src)]);
	if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) return f.dot;
	if (truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/nuclear")) ? 1 : 0))) {
		rt.incField(f, (NM_3 = rt.fv(f, "mode", rt.gl("SSticker"))), "nukes_left", -1, true);
	}
	if (truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "check_finished", [])))) return f.dot;
	yield* g.callName(f, rt.gl("SSticker"), "Reboot", ["Station destroyed by Nuclear Device.", "nuke - unhandled ending"]);
	return f.dot;
}, true);

rt.type(10686, "/obj/machinery/nuclearbomb/selfdestruct", "/obj/machinery/nuclearbomb", {
	anchored: 1,
	name: "station self-destruct terminal",
	desc: "For when it all gets too much to bear. Do not taunt.",
	icon: rt.rsc("icons/obj/machines/nuke_terminal.dmi"),
	icon_state: "nuclearbomb_base",
});

// /obj/machinery/nuclearbomb/selfdestruct/proc/set_active  (code/game/gamemodes/nuclear/nuclearbomb.dm:473)
rt.def("/obj/machinery/nuclearbomb/selfdestruct/proc/set_active", function set_active(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "timing"))) {
		rt.callName(f, rt.gl("SSmapping"), "add_nuke_threat", [live(f.src)]);
	} else {
		rt.callName(f, rt.gl("SSmapping"), "remove_nuke_threat", [live(f.src)]);
	}
	return f.dot;
});

// /obj/machinery/nuclearbomb/selfdestruct/proc/set_safety  (code/game/gamemodes/nuclear/nuclearbomb.dm:480)
rt.def("/obj/machinery/nuclearbomb/selfdestruct/proc/set_safety", function set_safety(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "timing"))) {
		rt.callName(f, rt.gl("SSmapping"), "add_nuke_threat", [live(f.src)]);
	} else {
		rt.callName(f, rt.gl("SSmapping"), "remove_nuke_threat", [live(f.src)]);
	}
	return f.dot;
});

rt.type(6672, "/obj/item/weapon/disk/nuclear", "/obj/item/weapon/disk", {
	name: "nuclear authentication disk",
	desc: "Better keep this safe.",
	icon_state: "nucleardisk",
	persistence_replacement: rt.typePath("/obj/item/weapon/disk/fakenucleardisk"),
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
	resistance_flags: 99,
});

// /obj/item/weapon/disk/nuclear/proc/<init>  (code/game/gamemodes/nuclear/nuclearbomb.dm:500)
rt.def("/obj/item/weapon/disk/nuclear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/weapon/disk/nuclear/proc/New  (code/game/gamemodes/nuclear/nuclearbomb.dm:504)  may sleep
rt.def("/obj/item/weapon/disk/nuclear/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	yield* g.callSrc(f, "set_stationloving", [null, 1, "inform_admins", 1], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/weapon/disk/nuclear/proc/attackby  (code/game/gamemodes/nuclear/nuclearbomb.dm:509)  may sleep
rt.def("/obj/item/weapon/disk/nuclear/proc/attackby", function* attackby(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/claymore/highlander")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "nuke_disk", (H = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Wait... what?</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "nuke_disk", live(H))]);
			rt.setFv(f, "nuke_disk", live(H), null);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ captures ＀!</span>", [live(f.args[1]), live(f.src)]), "<span class='userdanger'>You've got the disk! Defend it with your life!</span>"]);
		rt.setSv(f, "loc", live(H));
		rt.setFv(f, "nuke_disk", live(H), live(f.src));
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/disk/nuclear/proc/Destroy  (code/game/gamemodes/nuclear/nuclearbomb.dm:525)  may sleep
rt.def("/obj/item/weapon/disk/nuclear/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(live(f.args[0]))) {
		(rt.modGl("poi_list", live(f.src), subtract));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["force"] });

// /obj/item/weapon/disk/nuclear/proc/suicide_act  (code/game/gamemodes/nuclear/nuclearbomb.dm:529)  may sleep
rt.def("/obj/item/weapon/disk/nuclear/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let end_time: Value = null, newcolor: Value = null;
	f.vars = () => [user, end_time, newcolor];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is going delta! It looks like ＀ trying to commit suicide!</span>", [live(user), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/machines/alarm.ogg"), 50, -1, 1]);
	end_time = add(rt.worldTime(f), 100);
	newcolor = "#00FF00";
	while (rt.lt(rt.worldTime(f), live(end_time))) {
		if (!truthy(live(user))) {
			return live(f.dot);
		}
		if (isEqual(live(newcolor), "#FF0000")) {
			newcolor = "#00FF00";
		} else {
			newcolor = "#FF0000";
		}
		yield* g.callName(f, live(user), "add_atom_colour", [live(newcolor), 1]);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	yield* g.callName(f, live(user), "remove_atom_colour", [1]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ was destroyed by the nuclear blast!</span>", [live(user)])]);
	return 8;
}, true);
