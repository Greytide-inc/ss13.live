// From code/modules/research/xenobiology/xenobio_camera.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5105, "/mob/camera/aiEye/remote/xenobio", "/mob/camera/aiEye/remote", {
	allowed_area: null,
	visible_icon: 1,
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "camera_target",
});

// /mob/camera/aiEye/remote/xenobio/proc/Initialize  (code/modules/research/xenobiology/xenobio_camera.dm:9)  may sleep
rt.def("/mob/camera/aiEye/remote/xenobio/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	rt.setSv(f, "allowed_area", rt.gv(f, "name", (A = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")])))));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/camera/aiEye/remote/xenobio/proc/setLoc  (code/modules/research/xenobiology/xenobio_camera.dm:14)
rt.def("/mob/camera/aiEye/remote/xenobio/proc/setLoc", function setLoc(f: Frame) {
	let new_area: Value = null;
	f.vars = () => [new_area];
	if (((truthy((new_area = rt.call(f, P("/proc/get_area"), null, [live(f.args[0])]))) && isEqual(rt.fv(f, "name", live(new_area)), rt.sv(f, "allowed_area"))) || truthy((rt.istype(live(new_area), T("/area/science/xenobiology")) ? 1 : 0)))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, false, { args: ["t"] });

rt.type(10353, "/obj/machinery/computer/camera_advanced/xenobio", "/obj/machinery/computer/camera_advanced", {
	slime_place_action: null,
	slime_up_action: null,
	feed_slime_action: null,
	monkey_recycle_action: null,
	stored_slimes: null,
	max_slimes: 5,
	monkeys: 0,
	networks: null,
	light_color: "#E17DE1",
	name: "Slime management console",
	desc: "A computer used for remotely handling slimes.",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/xenobiology"),
	icon_screen: "slime_comp",
	icon_keyboard: "rd_key",
});

// /obj/machinery/computer/camera_advanced/xenobio/proc/<init>  (code/modules/research/xenobiology/xenobio_camera.dm:23)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "networks", rt.list("SS13"));
	$0 = $0;
	rt.setSv(f, "slime_place_action", (yield* g.new_(f, T("/datum/action/innate/slime_place"), [])));
	$0 = $0;
	rt.setSv(f, "slime_up_action", (yield* g.new_(f, T("/datum/action/innate/slime_pick_up"), [])));
	$0 = $0;
	rt.setSv(f, "feed_slime_action", (yield* g.new_(f, T("/datum/action/innate/feed_slime"), [])));
	$0 = $0;
	rt.setSv(f, "monkey_recycle_action", (yield* g.new_(f, T("/datum/action/innate/monkey_recycle"), [])));
	$0 = $0;
	rt.setSv(f, "stored_slimes", rt.list());
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/xenobio/proc/CreateEye  (code/modules/research/xenobiology/xenobio_camera.dm:40)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/CreateEye", function* CreateEye(f: Frame) {
	rt.setSv(f, "eyeobj", (yield* g.new_(f, T("/mob/camera/aiEye/remote/xenobio"), [rt.getStep(f, live(f.src), 0)])));
	rt.setFv(f, "origin", rt.sv(f, "eyeobj"), live(f.src));
	rt.setFv(f, "visible_icon", rt.sv(f, "eyeobj"), 1);
	rt.setFv(f, "icon", rt.sv(f, "eyeobj"), rt.rsc("icons/obj/abductor.dmi"));
	rt.setFv(f, "icon_state", rt.sv(f, "eyeobj"), "camera_target");
	return f.dot;
}, true);

// /obj/machinery/computer/camera_advanced/xenobio/proc/GrantActions  (code/modules/research/xenobiology/xenobio_camera.dm:47)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/GrantActions", function* GrantActions(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "slime_up_action"))) {
		rt.setFv(f, "target", rt.sv(f, "slime_up_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "slime_up_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "slime_up_action"), add);
	}
	if (truthy(rt.sv(f, "slime_place_action"))) {
		rt.setFv(f, "target", rt.sv(f, "slime_place_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "slime_place_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "slime_place_action"), add);
	}
	if (truthy(rt.sv(f, "feed_slime_action"))) {
		rt.setFv(f, "target", rt.sv(f, "feed_slime_action"), live(f.src));
		yield* g.callName(f, rt.sv(f, "feed_slime_action"), "Grant", [live(f.args[0])]);
		rt.modSrcVar(f, "actions", rt.sv(f, "feed_slime_action"), add);
	}
	if (!truthy(rt.sv(f, "monkey_recycle_action"))) return f.dot;
	rt.setFv(f, "target", rt.sv(f, "monkey_recycle_action"), live(f.src));
	yield* g.callName(f, rt.sv(f, "monkey_recycle_action"), "Grant", [live(f.args[0])]);
	rt.modSrcVar(f, "actions", rt.sv(f, "monkey_recycle_action"), add);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/camera_advanced/xenobio/proc/attackby  (code/modules/research/xenobiology/xenobio_camera.dm:70)  may sleep
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, loaded: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [_P, loaded, G, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube")) ? 1 : 0))) {
		rt.incSrcVar(f, "monkeys", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You feed ＀ to ＀. It now has ＀ monkey cubes stored.</span>", [live(f.args[0]), live(f.src), rt.sv(f, "monkeys")])]);
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag")) ? 1 : 0))) {
			_P = live(f.args[0]);
			loaded = 0;
			G = null;
			rt.forList(f, 0, rt.fv(f, "contents", live(_P)), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				G = $e;
				if (truthy((rt.istype(live(G), T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube")) ? 1 : 0))) {
					loaded = 1;
					rt.incSrcVar(f, "monkeys", 1, true);
					yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(loaded))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fill ＀ with the monkey cubes stored in ＀. ＀ now has ＀ monkey cubes stored.</span>", [live(f.src), live(f.args[0]), live(f.src), rt.sv(f, "monkeys")])]);
			}
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["O", "user", "params"] });

rt.type(171, "/datum/action/innate/slime_place", "/datum/action/innate", {
	name: "Place Slimes",
	button_icon_state: "slime_down",
});

// /datum/action/innate/slime_place/proc/Activate  (code/modules/research/xenobiology/xenobio_camera.dm:94)
rt.def("/datum/action/innate/slime_place/proc/Activate", function Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [C, remote_eye, X, S, $e];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	X = rt.sv(f, "target");
	if (truthy(rt.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.fv(f, "loc", live(remote_eye))]))) {
		S = null;
		rt.forList(f, 0, rt.fv(f, "stored_slimes", live(X)), T("/mob/living/simple_animal/slime"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			rt.setFv(f, "loc", live(S), rt.fv(f, "loc", live(remote_eye)));
			rt.callName(f, live(S), "visible_message", [fmt("＀ warps in!", [live(S)])]);
			(rt.modField(f, live(X), "stored_slimes", live(S), subtract));
		}
		rt.endFor(f, 0);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Target is not near a camera. Cannot proceed.</span>"]);
	}
	return f.dot;
});

rt.type(172, "/datum/action/innate/slime_pick_up", "/datum/action/innate", {
	name: "Pick up Slime",
	button_icon_state: "slime_up",
});

// /datum/action/innate/slime_pick_up/proc/Activate  (code/modules/research/xenobiology/xenobio_camera.dm:113)  may sleep
rt.def("/datum/action/innate/slime_pick_up/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [C, remote_eye, X, S, $e];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	X = rt.sv(f, "target");
	if (truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.fv(f, "loc", live(remote_eye))])))) {
		S = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(remote_eye)), T("/mob/living/simple_animal/slime"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (rt.ge(rt.getLen(f, rt.fv(f, "stored_slimes", live(X))), rt.fv(f, "max_slimes", live(X)))) {
				break;
			}
			if (!truthy(rt.fv(f, "ckey", live(S)))) {
				if (truthy(rt.fv(f, "buckled", live(S)))) {
					yield* g.callName(f, live(S), "Feedstop", ["silent", 1], rt.Args.Named);
				}
				yield* g.callName(f, live(S), "visible_message", [fmt("＀ vanishes in a flash of light!", [live(S)])]);
				rt.setFv(f, "loc", live(S), live(X));
				rt.modField(f, live(X), "stored_slimes", live(S), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Target is not near a camera. Cannot proceed.</span>"]);
	}
	return f.dot;
}, true);

rt.type(173, "/datum/action/innate/feed_slime", "/datum/action/innate", {
	name: "Feed Slimes",
	button_icon_state: "monkey_down",
});

// /datum/action/innate/feed_slime/proc/Activate  (code/modules/research/xenobiology/xenobio_camera.dm:138)  may sleep
rt.def("/datum/action/innate/feed_slime/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, X: Value = null, food: Value = null;
	f.vars = () => [C, remote_eye, X, food];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	X = rt.sv(f, "target");
	if (truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.fv(f, "loc", live(remote_eye))])))) {
		if (rt.ge(rt.fv(f, "monkeys", live(X)), 1)) {
			rt.setFv(f, "LAssailant", (food = (yield* g.new_(f, T("/mob/living/carbon/monkey"), [rt.fv(f, "loc", live(remote_eye))]))), live(C));
			rt.incField(f, live(X), "monkeys", -1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("＀ now has ＀ monkeys left.", [live(X), rt.fv(f, "monkeys", live(X))])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Target is not near a camera. Cannot proceed.</span>"]);
	}
	return f.dot;
}, true);

rt.type(174, "/datum/action/innate/monkey_recycle", "/datum/action/innate", {
	name: "Recycle Monkeys",
	button_icon_state: "monkey_up",
});

// /datum/action/innate/monkey_recycle/proc/Activate  (code/modules/research/xenobiology/xenobio_camera.dm:159)  may sleep
rt.def("/datum/action/innate/monkey_recycle/proc/Activate", function* Activate(f: Frame) {
	let C: Value = null, remote_eye: Value = null, X: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [C, remote_eye, X, M, $e];
	if ((!truthy(rt.sv(f, "target")) || !truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	C = rt.sv(f, "owner");
	remote_eye = rt.fv(f, "remote_control", live(C));
	X = rt.sv(f, "target");
	if (truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [rt.fv(f, "loc", live(remote_eye))])))) {
		M = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(remote_eye)), T("/mob/living/carbon/monkey"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy(rt.fv(f, "stat", live(M)))) {
				yield* g.callName(f, live(M), "visible_message", [fmt("＀ vanishes as they are reclaimed for recycling!", [live(M)])]);
				rt.setFv(f, "monkeys", live(X), (yield* g.call(f, P("/proc/round"), null, [add(rt.fv(f, "monkeys", live(X)), 0.20000000298023224), 0.10000000149011612])));
				yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Target is not near a camera. Cannot proceed.</span>"]);
	}
	return f.dot;
}, true);
