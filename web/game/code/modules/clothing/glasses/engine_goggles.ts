// From code/modules/clothing/glasses/engine_goggles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8212, "/obj/item/clothing/glasses/meson/engine", "/obj/item/clothing/glasses/meson", {
	mesons_on: 1,
	range: 1,
	name: "engineering scanner goggles",
	desc: "Goggles used by engineers. The Meson Scanner mode lets you see basic structural and terrain layouts through walls, regardless of lighting condition. The T-ray Scanner mode lets you see underfloor objects such as cables and pipes.",
	icon_state: "trayson-meson",
	actions_types: null,
	origin_tech: "materials=3;magnets=3;engineering=3;plasmatech=3",
});

// /obj/item/clothing/glasses/meson/engine/proc/<init>  (code/modules/clothing/glasses/engine_goggles.dm:7)
rt.def("/obj/item/clothing/glasses/meson/engine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_mode")));
	return f.dot;
});

// /obj/item/clothing/glasses/meson/engine/proc/Initialize  (code/modules/clothing/glasses/engine_goggles.dm:16)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/meson/engine/proc/Destroy  (code/modules/clothing/glasses/engine_goggles.dm:20)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/glasses/meson/engine/proc/toggle_mode  (code/modules/clothing/glasses/engine_goggles.dm:24)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/toggle_mode", function* toggle_mode(f: Frame, user: Value, voluntary: Value) {
	let H: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, voluntary, H, X, A, $e];
	rt.setSv(f, "mesons_on", (!truthy(rt.sv(f, "mesons_on")) ? 1 : 0));
	if (!truthy(rt.sv(f, "mesons_on"))) {
		rt.setSv(f, "vision_flags", 0);
		rt.setSv(f, "darkness_view", 2);
		rt.setSv(f, "invis_view", 25);
		rt.setSv(f, "lighting_alpha", null);
		if (truthy(live(voluntary))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You toggle the goggles' scanning mode to [T-Ray].</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The goggles abruptly toggle to [T-Ray] mode!</span>"]);
		}
	} else {
		rt.setSv(f, "vision_flags", 16);
		rt.setSv(f, "darkness_view", 1);
		rt.setSv(f, "lighting_alpha", 0);
		if (truthy(live(voluntary))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You toggle the goggles' scanning mode to [Meson].</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The goggles abruptly toggle to [Meson] mode!</span>"]);
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "glasses", (H = live(user))), live(f.src))) {
			yield* g.callName(f, live(H), "update_sight", []);
		}
	}
	yield* g.srcCall(f, "update_icon");
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/meson/engine/proc/attack_self  (code/modules/clothing/glasses/engine_goggles.dm:55)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "toggle_mode", live(user), 1);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/meson/engine/proc/process  (code/modules/clothing/glasses/engine_goggles.dm:59)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/process", function* process(f: Frame) {
	let _T: Value = null, user: Value = null;
	f.vars = () => [_T, user];
	if (truthy(rt.sv(f, "mesons_on"))) {
		if ((truthy((_T = rt.getStep(f, live(f.src), 0))) && isEqual(rt.fv(f, "z", live(_T)), 5))) {
			yield* g.srcCall(f, "toggle_mode", rt.sv(f, "loc"));
		}
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "glasses", (user = rt.sv(f, "loc"))), live(f.src))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "scan");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clothing/glasses/meson/engine/proc/scan  (code/modules/clothing/glasses/engine_goggles.dm:73)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/scan", function* scan(f: Frame) {
	let _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [_T, O, $e];
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), rt.sv(f, "loc")])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		O = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (!isEqual(rt.fv(f, "level", live(O)), 1)) {
				continue;
			}
			if (isEqual(rt.fv(f, "invisibility", live(O)), 100)) {
				yield* g.srcCall(f, "flick_sonar", live(O));
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/meson/engine/proc/flick_sonar  (code/modules/clothing/glasses/engine_goggles.dm:82)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/proc/flick_sonar", function* flick_sonar(f: Frame, pipe: Value) {
	let M: Value = null, I: Value = null, MA: Value = null;
	f.vars = () => [pipe, M, I, MA];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	M = rt.sv(f, "loc");
	I = (yield* g.new_(f, T("/image"), ["loc", rt.getStep(f, live(pipe), 0)], rt.Args.Named));
	rt.setFv(f, "alpha", (MA = (yield* g.new_(f, T("/mutable_appearance"), [live(pipe)]))), 128);
	rt.setFv(f, "appearance", live(I), live(MA));
	if (!truthy(rt.fv(f, "client", live(M)))) return f.dot;
	yield* g.call(f, P("/proc/flick_overlay"), null, [live(I), rt.list(rt.fv(f, "client", live(M))), 8]);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/meson/engine/proc/update_icon  (code/modules/clothing/glasses/engine_goggles.dm:92)
rt.def("/obj/item/clothing/glasses/meson/engine/proc/update_icon", function update_icon(f: Frame) {
	let user: Value = null;
	let $0: any;
	f.vars = () => [user, $0];
	if (truthy(rt.sv(f, "mesons_on"))) {
		$0 = "trayson-meson";
	} else {
		$0 = "trayson-tray";
	}
	rt.setSv(f, "icon_state", $0);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.gv(f, "glasses", (user = rt.sv(f, "loc"))), live(f.src))) return f.dot;
	rt.callName(f, live(user), "update_inv_glasses", []);
	return f.dot;
});

rt.type(8213, "/obj/item/clothing/glasses/meson/engine/tray", "/obj/item/clothing/glasses/meson/engine", {
	on: 0,
	mesons_on: 0,
	range: 2,
	name: "optical t-ray scanner",
	desc: "Used by engineering staff to see underfloor objects such as cables and pipes.",
	icon_state: "trayson-tray_off",
	origin_tech: "materials=3;magnets=2;engineering=2",
	vision_flags: 0,
	darkness_view: 2,
	invis_view: 25,
});

// /obj/item/clothing/glasses/meson/engine/tray/proc/process  (code/modules/clothing/glasses/engine_goggles.dm:113)
rt.def("/obj/item/clothing/glasses/meson/engine/tray/proc/process", function process(f: Frame) {
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/clothing/glasses/meson/engine/tray/proc/update_icon  (code/modules/clothing/glasses/engine_goggles.dm:118)
rt.def("/obj/item/clothing/glasses/meson/engine/tray/proc/update_icon", function update_icon(f: Frame) {
	let user: Value = null;
	let $0: any;
	f.vars = () => [user, $0];
	if (truthy(rt.sv(f, "on"))) {
		$0 = "";
	} else {
		$0 = "_off";
	}
	rt.setSv(f, "icon_state", fmt("trayson-tray＀", [$0]));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.gv(f, "glasses", (user = rt.sv(f, "loc"))), live(f.src))) return f.dot;
	rt.callName(f, live(user), "update_inv_glasses", []);
	return f.dot;
});

// /obj/item/clothing/glasses/meson/engine/tray/proc/toggle_mode  (code/modules/clothing/glasses/engine_goggles.dm:125)  may sleep
rt.def("/obj/item/clothing/glasses/meson/engine/tray/proc/toggle_mode", function* toggle_mode(f: Frame, user: Value, voluntary: Value) {
	let X: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	f.vars = () => [user, voluntary, X, A, $0, $1, $2, $3, $4, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	$0 = live(user);
	if (truthy(live(voluntary))) {
		$1 = "notice";
	} else {
		$1 = "warning";
	}
	if (truthy(live(voluntary))) {
		$2 = "You turn the goggles";
	} else {
		$2 = "The goggles turn";
	}
	if (truthy(rt.sv(f, "on"))) {
		$3 = "on";
	} else {
		$3 = "off";
	}
	if (truthy(live(voluntary))) {
		$4 = ".";
	} else {
		$4 = "!";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>＀ ＀＀</span>", [$1, $2, $3, $4])]);
	yield* g.srcCall(f, "update_icon");
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
