// From code/game/gamemodes/nuclear/pinpointer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6688, "/obj/item/weapon/pinpointer", "/obj/item/weapon", {
	active: 0,
	target: null,
	constant_target: null,
	target_x: 0,
	target_y: 0,
	minimum_range: 0,
	nuke_warning: 0,
	mode: 1,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "pinpointer",
	desc: "A handheld tracking device that locks onto certain signals.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "pinoff",
	slot_flags: 512,
	w_class: 2,
	item_state: "electronic",
	materials: null,
	resistance_flags: 99,
});

// /obj/item/weapon/pinpointer/proc/<init>  (code/game/gamemodes/nuclear/pinpointer.dm:13)
rt.def("/obj/item/weapon/pinpointer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 250]));
	return f.dot;
});

// /obj/item/weapon/pinpointer/proc/New  (code/game/gamemodes/nuclear/pinpointer.dm:25)  may sleep
rt.def("/obj/item/weapon/pinpointer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("pinpointer_list", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/pinpointer/proc/Destroy  (code/game/gamemodes/nuclear/pinpointer.dm:29)  may sleep
rt.def("/obj/item/weapon/pinpointer/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	(rt.modGl("pinpointer_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/pinpointer/proc/attack_self  (code/game/gamemodes/nuclear/pinpointer.dm:34)
rt.def("/obj/item/weapon/pinpointer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	$0 = live(user);
	$1 = live(user);
	if (truthy(rt.sv(f, "active"))) {
		$1 = $1;
		$2 = "";
	} else {
		$2 = "de";
	}
	$1 = fmt("<span class='notice'>＀ ＀activates their pinpointer.</span>", [$1, $2]);
	if (truthy(rt.sv(f, "active"))) {
		$2 = "";
	} else {
		$2 = "de";
	}
	rt.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀activate your pinpointer.</span>", [$2])]);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
	if (truthy(rt.sv(f, "active"))) {
		$0 = "onnull";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "icon_state", fmt("pin＀", [$0]));
	if (truthy(rt.sv(f, "active"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
		}
	} else {
		rt.setSv(f, "target", null);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	}
	return f.dot;
});

// /obj/item/weapon/pinpointer/proc/attackby  (code/game/gamemodes/nuclear/pinpointer.dm:45)  may sleep
rt.def("/obj/item/weapon/pinpointer/proc/attackby", function* attackby(f: Frame) {
	if (!isEqual(rt.sv(f, "mode"), 5)) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ tunes ＀ to ＀.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You fine-tune ＀'s tracking to track ＀.</span>", [live(f.src), live(f.args[0])])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	rt.setSv(f, "constant_target", live(f.args[0]));
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/pinpointer/proc/examine  (code/game/gamemodes/nuclear/pinpointer.dm:52)
rt.def("/obj/item/weapon/pinpointer/proc/examine", function examine(f: Frame) {
	let msg: Value = null, bomb: Value = null;
	let $0: any, $e: any;
	f.vars = () => [msg, bomb, $0, $e];
	rt.callSuper(f, [], rt.Args.Same);
	msg = "Its tracking indicator reads ";
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		msg = rt.modify(live(msg), "\"nuclear_disk\".", add);
	} else if ($0 === 2) {
		msg = rt.modify(live(msg), "\"01000001 01001001\".", add);
	} else if ($0 === 3) {
		msg = rt.modify(live(msg), "\"vasvygengbefuvc\".", add);
	} else if ($0 === 4) {
		if (truthy(rt.sv(f, "target"))) {
			$0 = fmt("Operative ＀", [rt.sv(f, "target")]);
		} else {
			$0 = "friends";
		}
		msg = rt.modify(live(msg), fmt("\"＀\".", [$0]), add);
	} else if ($0 === 5) {
		msg = rt.modify(live(msg), fmt("\"＀\".", [rt.initial(f, rt.sv(f, "constant_target"), "name")]), add);
	} else if ($0 === 6) {
		msg = rt.modify(live(msg), fmt("\"(＀, ＀)\".", [rt.sv(f, "target_x"), rt.sv(f, "target_y")]), add);
	} else {
		msg = "Its tracking indicator is blank.";
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(msg)]);
	bomb = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/nuclearbomb"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bomb = $e;
		if (truthy(rt.fv(f, "timing", live(bomb)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Extreme danger. Arming signal detected. Time remaining: ＀", [rt.callName(f, live(bomb), "get_time_left", [])])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/pinpointer/proc/process  (code/game/gamemodes/nuclear/pinpointer.dm:75)  may sleep
rt.def("/obj/item/weapon/pinpointer/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	yield* g.srcCall(f, "scan_for_target");
	yield* g.srcCall(f, "point_to_target");
	yield* g.srcCall(f, "my_god_jc_a_bomb");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/pinpointer/proc/refresh_target")])), 50, 1]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/pinpointer/proc/scan_for_target  (code/game/gamemodes/nuclear/pinpointer.dm:85)
rt.def("/obj/item/weapon/pinpointer/proc/scan_for_target", function scan_for_target(f: Frame) {
	let L: Value = null, N: Value = null, V: Value = null, A: Value = null, possible_targets: Value = null, here: Value = null, V_2: Value = null, M: Value = null, closest_operative: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [L, N, V, A, possible_targets, here, V_2, M, closest_operative, _T, $0, $e];
	if (truthy(rt.sv(f, "target"))) {
		if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
				rt.setSv(f, "target", null);
			}
		}
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.setSv(f, "target", (N = rt.locateIn(f, T("/obj/item/weapon/disk/nuclear"), rt.world())));
	} else if ($0 === 2) {
		V = null;
		rt.forList(f, 0, rt.gl("ai_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if (truthy(rt.gv(f, "nuking", (A = live(V))))) {
				rt.setSv(f, "target", live(A));
			}
		}
		rt.endFor(f, 0);
		V = null;
		rt.forList(f, 0, rt.gl("apcs_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			if ((truthy(rt.gv(f, "malfhack", (A = live(V)))) && truthy(rt.fv(f, "occupier", live(A))))) {
				rt.setSv(f, "target", live(A));
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === 3) {
		rt.setSv(f, "target", rt.callName(f, rt.gl("SSshuttle"), "getShuttle", ["syndicate"]));
	} else if ($0 === 4) {
		possible_targets = rt.list();
		here = rt.getStep(f, live(f.src), 0);
		V_2 = null;
		rt.forList(f, 0, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			V_2 = $e;
			if ((truthy(rt.gv(f, "current", (M = live(V_2)))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(M))), 2))) {
				(possible_targets = rt.modify(live(possible_targets), rt.fv(f, "current", live(M)), rt.bitOr));
			}
		}
		rt.endFor(f, 0);
		if (truthy((closest_operative = rt.call(f, P("/proc/get_closest_atom"), null, [T("/mob/living/carbon/human"), live(possible_targets), live(here)])))) {
			rt.setSv(f, "target", live(closest_operative));
		}
	} else if ($0 === 5) {
		if (truthy(rt.sv(f, "constant_target"))) {
			rt.setSv(f, "target", rt.sv(f, "constant_target"));
		}
	} else if ($0 === 6) {
		_T = rt.getStep(f, live(f.src), 0);
		rt.setSv(f, "target", rt.locate(rt.sv(f, "target_x"), rt.sv(f, "target_y"), rt.fv(f, "z", live(_T))));
	}
	return f.dot;
});

// /obj/item/weapon/pinpointer/proc/point_to_target  (code/game/gamemodes/nuclear/pinpointer.dm:123)
rt.def("/obj/item/weapon/pinpointer/proc/point_to_target", function point_to_target(f: Frame) {
	let here: Value = null, there: Value = null;
	let $0: any;
	f.vars = () => [here, there, $0];
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "target")) || (isEqual(rt.sv(f, "mode"), 5) && !truthy(rt.sv(f, "constant_target"))))) {
		if (truthy(rt.sv(f, "nuke_warning"))) {
			$0 = "alert";
		} else {
			$0 = "";
		}
		rt.setSv(f, "icon_state", fmt("pinon＀null", [$0]));
		return live(f.dot);
	}
	here = rt.getStep(f, live(f.src), 0);
	there = rt.getStep(f, rt.sv(f, "target"), 0);
	if (!isEqual(rt.fv(f, "z", live(here)), rt.fv(f, "z", live(there)))) {
		if (truthy(rt.sv(f, "nuke_warning"))) {
			$0 = "alert";
		} else {
			$0 = "";
		}
		rt.setSv(f, "icon_state", fmt("pinon＀null", [$0]));
		return live(f.dot);
	}
	if (rt.le(rt.call(f, P("/proc/get_dist_euclidian"), null, [live(here), live(there)]), rt.sv(f, "minimum_range"))) {
		if (truthy(rt.sv(f, "nuke_warning"))) {
			$0 = "alert";
		} else {
			$0 = "";
		}
		rt.setSv(f, "icon_state", fmt("pinon＀direct", [$0]));
	} else {
		rt.callSrc(f, "setDir", [rt.getDir(f, live(here), live(there))]);
		$0 = rt.call(f, P("/proc/get_dist"), null, [live(here), live(there)]);
		if (rt.inRange($0, 1, 8)) {
			if (truthy(rt.sv(f, "nuke_warning"))) {
				$0 = "alert";
			} else {
				$0 = "close";
			}
			rt.setSv(f, "icon_state", fmt("pinon＀", [$0]));
		} else if (rt.inRange($0, 9, 16)) {
			if (truthy(rt.sv(f, "nuke_warning"))) {
				$0 = "alert";
			} else {
				$0 = "medium";
			}
			rt.setSv(f, "icon_state", fmt("pinon＀", [$0]));
		} else if (rt.inRange($0, 16, 9.999999848243207e+30)) {
			if (truthy(rt.sv(f, "nuke_warning"))) {
				$0 = "alert";
			} else {
				$0 = "far";
			}
			rt.setSv(f, "icon_state", fmt("pinon＀", [$0]));
		}
	}
	return f.dot;
});

// /obj/item/weapon/pinpointer/proc/my_god_jc_a_bomb  (code/game/gamemodes/nuclear/pinpointer.dm:146)
rt.def("/obj/item/weapon/pinpointer/proc/my_god_jc_a_bomb", function my_god_jc_a_bomb(f: Frame) {
	let bomb: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [bomb, L, $e];
	bomb = null;
	rt.forList(f, 0, rt.gl("nuke_list"), T("/obj/machinery/nuclearbomb"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bomb = $e;
		if (truthy(rt.fv(f, "timing", live(bomb)))) {
			if (!truthy(rt.sv(f, "nuke_warning"))) {
				rt.setSv(f, "nuke_warning", 1);
				rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/nuke_toy_lowpower.ogg"), 50, 0]);
				if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
					rt.call(f, P("/proc/to_chat"), null, [(L = rt.sv(f, "loc")), fmt("<span class='userdanger'>Your ＀ vibrates and lets out a tinny alarm. Uh oh.</span>", [rt.sv(f, "name")])]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/pinpointer/proc/switch_mode_to  (code/game/gamemodes/nuclear/pinpointer.dm:156)
rt.def("/obj/item/weapon/pinpointer/proc/switch_mode_to", function switch_mode_to(f: Frame, new_mode: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [(L = rt.sv(f, "loc")), fmt("<span class='userdanger'>Your ＀ beeps as it reconfigures its tracking algorithms.</span>", [rt.sv(f, "name")])]);
		rt.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/machines/triple_beep.ogg"), 50, 1]);
	}
	rt.setSv(f, "mode", live(new_mode));
	rt.setSv(f, "target", null);
	return f.dot;
});

// /obj/item/weapon/pinpointer/proc/refresh_target  (code/game/gamemodes/nuclear/pinpointer.dm:164)
rt.def("/obj/item/weapon/pinpointer/proc/refresh_target", function refresh_target(f: Frame) {
	rt.setSv(f, "target", null);
	return f.dot;
});
