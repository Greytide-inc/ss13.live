// From code/modules/clothing/spacesuits/chronosuit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7969, "/obj/item/clothing/head/helmet/space/chronos", "/obj/item/clothing/head/helmet/space", {
	suit: null,
	name: "Chronosuit Helmet",
	desc: "A white helmet with an opaque blue visor.",
	icon_state: "chronohelmet",
	item_state: "chronohelmet",
	slowdown: 1,
	armor: null,
	resistance_flags: 34,
});

// /obj/item/clothing/head/helmet/space/chronos/proc/<init>  (code/modules/clothing/spacesuits/chronosuit.dm:7)
rt.def("/obj/item/clothing/head/helmet/space/chronos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 30, "laser", 60, "energy", 60, "bomb", 30, "bio", 90, "rad", 90, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/clothing/head/helmet/space/chronos/proc/dropped  (code/modules/clothing/spacesuits/chronosuit.dm:13)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/chronos/proc/dropped", function* dropped(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		yield* g.callName(f, rt.sv(f, "suit"), "deactivate", [1, 1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/head/helmet/space/chronos/proc/Destroy  (code/modules/clothing/spacesuits/chronosuit.dm:17)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/chronos/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "dropped");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(7737, "/obj/item/clothing/suit/space/chronos", "/obj/item/clothing/suit/space", {
	chronosafe_items: null,
	hands_nodrop: null,
	helmet: null,
	camera: null,
	teleport_now: null,
	activating: 0,
	activated: 0,
	cooldowntime: 50,
	teleporting: 0,
	phase_timer_id: null,
	name: "Chronosuit",
	desc: "An advanced spacesuit equipped with time-bluespace teleportation and anti-compression technology",
	icon_state: "chronosuit",
	item_state: "chronosuit",
	actions_types: null,
	armor: null,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/space/chronos/proc/<init>  (code/modules/clothing/spacesuits/chronosuit.dm:29)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "chronosafe_items", rt.list(T("/obj/item/weapon/chrono_eraser"), T("/obj/item/weapon/gun/energy/chrono_gun")));
	$0 = $0;
	rt.setSv(f, "hands_nodrop", rt.list());
	$0 = $0;
	rt.setSv(f, "teleport_now", (yield* g.new_(f, T("/datum/action/innate/chrono_teleport"), [])));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 60, "laser", 60, "energy", 60, "bomb", 30, "bio", 90, "rad", 90, "fire", 100, "acid", 1000]));
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/New  (code/modules/clothing/spacesuits/chronosuit.dm:41)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "chronosuit", rt.sv(f, "teleport_now"), live(f.src));
	rt.setFv(f, "target", rt.sv(f, "teleport_now"), live(f.src));
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/new_camera  (code/modules/clothing/spacesuits/chronosuit.dm:47)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/new_camera", function* new_camera(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "camera"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "camera")]);
	}
	rt.setSv(f, "camera", (yield* g.new_(f, T("/obj/effect/chronos_cam"), [live(user)])));
	rt.setFv(f, "holder", rt.sv(f, "camera"), live(user));
	rt.setFv(f, "chronosuit", rt.sv(f, "camera"), live(f.src));
	rt.setFv(f, "remote_control", live(user), rt.sv(f, "camera"));
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/ui_action_click  (code/modules/clothing/spacesuits/chronosuit.dm:54)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (!((rt.le(rt.sv(f, "cooldown"), rt.worldTime(f)) && !truthy(rt.sv(f, "teleporting"))) && !truthy(rt.sv(f, "activating")))) return f.dot;
	if (!truthy(rt.sv(f, "activated"))) {
		yield* g.srcCall(f, "activate");
	} else {
		yield* g.srcCall(f, "deactivate");
	}
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/dropped  (code/modules/clothing/spacesuits/chronosuit.dm:62)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/dropped", function* dropped(f: Frame) {
	if (truthy(rt.sv(f, "activated"))) {
		yield* g.srcCall(f, "deactivate");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/Destroy  (code/modules/clothing/spacesuits/chronosuit.dm:66)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "dropped");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/suit/space/chronos/proc/emp_act  (code/modules/clothing/spacesuits/chronosuit.dm:71)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let user: Value = null;
	let $0: any;
	f.vars = () => [severity, user, $0];
	user = rt.fv(f, "loc", live(f.src));
	$0 = live(severity);
	if ($0 === 1) {
		if ((((truthy(rt.sv(f, "activated")) && truthy(live(user))) && truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "wear_suit", live(user)), live(f.src)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>E:FATAL:RAM_READ_FAIL\nE:FATAL:STACK_EMPTY\nE:FATAL:READ_NULL_POINT\nE:FATAL:PWR_BUS_OVERLOAD</span>"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='userdanger'>An electromagnetic pulse disrupts your ＀ and violently tears you out of time-bluespace!</span>", [rt.sv(f, "name")])]);
			yield* g.callName(f, live(user), "emote", ["scream"]);
		}
		yield* g.srcCall(f, "deactivate", 1, 1);
	}
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/finish_chronowalk  (code/modules/clothing/spacesuits/chronosuit.dm:80)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/finish_chronowalk", function* finish_chronowalk(f: Frame, user: Value, to_turf: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [user, to_turf, I, $e];
	if (!truthy(live(user))) {
		user = rt.fv(f, "loc", live(f.src));
	}
	if (truthy(rt.sv(f, "phase_timer_id"))) {
		yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "phase_timer_id")]);
		rt.setSv(f, "phase_timer_id", 0);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (truthy(live(to_turf))) {
		yield* g.callName(f, live(user), "forceMove", [live(to_turf)]);
	}
	yield* g.callName(f, live(user), "SetStun", [0]);
	rt.setFv(f, "next_move", live(user), 1);
	rt.setFv(f, "alpha", live(user), 255);
	yield* g.callName(f, live(user), "update_atom_colour", []);
	rt.setFv(f, "animate_movement", live(user), 1);
	rt.setFv(f, "notransform", live(user), 0);
	rt.setFv(f, "anchored", live(user), 0);
	rt.setSv(f, "teleporting", 0);
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(user)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.isIn(f, live(I), rt.sv(f, "hands_nodrop")) ? 1 : 0))) {
			(rt.modField(f, live(I), "flags", 16777213, rt.bitAnd));
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "camera"))) {
		yield* g.callName(f, rt.sv(f, "camera"), "remove_target_ui", []);
		rt.setFv(f, "loc", rt.sv(f, "camera"), live(user));
	}
	yield* g.callName(f, rt.sv(f, "teleport_now"), "UpdateButtonIcon", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }] });

// /obj/item/clothing/suit/space/chronos/proc/chronowalk  (code/modules/clothing/spacesuits/chronosuit.dm:106)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/chronowalk", function* chronowalk(f: Frame, location: Value) {
	let user: Value = null, from_turf: Value = null, to_turf: Value = null, distance: Value = null, phase_in_ds: Value = null, nonsafe_slots: Value = null, exposed: Value = null, slot: Value = null, slot_item: Value = null, exposed_item: Value = null, exposed_I: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [location, user, from_turf, to_turf, distance, phase_in_ds, nonsafe_slots, exposed, slot, slot_item, exposed_item, exposed_I, I, $e];
	user = rt.fv(f, "loc", live(f.src));
	if (!((((((((truthy(rt.sv(f, "activated")) && !truthy(rt.sv(f, "teleporting"))) && truthy(live(user))) && truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) && truthy(live(location))) && truthy(rt.fv(f, "loc", live(user)))) && truthy(rt.fv(f, "loc", live(location)))) && isEqual(rt.fv(f, "wear_suit", live(user)), live(f.src))) && isEqual(rt.fv(f, "stat", live(user)), 0))) return f.dot;
	rt.setSv(f, "teleporting", 1);
	from_turf = rt.getStep(f, live(user), 0);
	to_turf = rt.getStep(f, live(location), 0);
	distance = (yield* g.call(f, P("/proc/cheap_hypotenuse"), null, [rt.fv(f, "x", live(from_turf)), rt.fv(f, "y", live(from_turf)), rt.fv(f, "x", live(to_turf)), rt.fv(f, "y", live(to_turf))]));
	phase_in_ds = multiply(live(distance), 2);
	if (truthy(rt.sv(f, "camera"))) {
		yield* g.callName(f, rt.sv(f, "camera"), "remove_target_ui", []);
	}
	yield* g.callName(f, rt.sv(f, "teleport_now"), "UpdateButtonIcon", []);
	nonsafe_slots = rt.list(5, 1);
	exposed = rt.list();
	slot = null;
	rt.forList(f, 0, live(nonsafe_slots));
	while (($e = rt.next(f, 0)) !== undefined) {
		slot = $e;
		exposed = rt.modify(live(exposed), (slot_item = (yield* g.callName(f, live(user), "get_item_by_slot", [live(slot)]))), add);
	}
	rt.endFor(f, 0);
	exposed = rt.modify(live(exposed), rt.fv(f, "held_items", live(user)), add);
	exposed_item = null;
	rt.forList(f, 0, live(exposed));
	while (($e = rt.next(f, 0)) !== undefined) {
		exposed_item = $e;
		if (((truthy((exposed_I = live(exposed_item))) && !truthy((rt.isIn(f, rt.fv(f, "type", live(exposed_I)), rt.sv(f, "chronosafe_items")) ? 1 : 0))) && truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(exposed_I)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Your ＀ got left behind.</span>", [rt.fv(f, "name", live(exposed_I))])]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(user), "ExtinguishMob", []);
	rt.setSv(f, "hands_nodrop", rt.list());
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(user)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
			rt.modSrcVar(f, "hands_nodrop", live(I), add);
			(rt.modField(f, live(I), "flags", 2, rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "animate_movement", live(user), 0);
	yield* g.callName(f, live(user), "changeNext_move", [add(8, live(phase_in_ds))]);
	rt.setFv(f, "notransform", live(user), 1);
	rt.setFv(f, "anchored", live(user), 1);
	yield* g.callName(f, live(user), "Stun", [9.999999848243207e+30]);
	rt.op(f, "Animate", [2, 6], [null, live(user), "color", "#00ccee", "time", 3]);
	rt.setSv(f, "phase_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/chronos/proc/phase_2"), live(user), live(to_turf), live(phase_in_ds)])), 3, 8])));
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/phase_2  (code/modules/clothing/spacesuits/chronosuit.dm:146)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/phase_2", function* phase_2(f: Frame, user: Value, to_turf: Value, phase_in_ds: Value) {
	f.vars = () => [user, to_turf, phase_in_ds];
	if (((truthy(rt.sv(f, "teleporting")) && truthy(rt.sv(f, "activated"))) && truthy(live(user)))) {
		rt.op(f, "Animate", [2, 6], [null, live(user), "alpha", 0, "time", 2]);
		rt.setSv(f, "phase_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/chronos/proc/phase_3"), live(user), live(to_turf), live(phase_in_ds)])), 2, 8])));
	} else {
		yield* g.srcCall(f, "finish_chronowalk", live(user), live(to_turf));
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }, {  }] });

// /obj/item/clothing/suit/space/chronos/proc/phase_3  (code/modules/clothing/spacesuits/chronosuit.dm:153)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/phase_3", function* phase_3(f: Frame, user: Value, to_turf: Value, phase_in_ds: Value) {
	f.vars = () => [user, to_turf, phase_in_ds];
	if (((truthy(rt.sv(f, "teleporting")) && truthy(rt.sv(f, "activated"))) && truthy(live(user)))) {
		yield* g.callName(f, live(user), "forceMove", [live(to_turf)]);
		rt.op(f, "Animate", [2, 6], [null, live(user), "alpha", 255, "time", live(phase_in_ds)]);
		rt.setSv(f, "phase_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/chronos/proc/phase_4"), live(user), live(to_turf)])), live(phase_in_ds), 8])));
	} else {
		yield* g.srcCall(f, "finish_chronowalk", live(user), live(to_turf));
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }, {  }] });

// /obj/item/clothing/suit/space/chronos/proc/phase_4  (code/modules/clothing/spacesuits/chronosuit.dm:161)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/phase_4", function* phase_4(f: Frame, user: Value, to_turf: Value) {
	f.vars = () => [user, to_turf];
	if (((truthy(rt.sv(f, "teleporting")) && truthy(rt.sv(f, "activated"))) && truthy(live(user)))) {
		rt.op(f, "Animate", [2, 6], [null, live(user), "color", "#ffffff", "time", 3]);
		rt.setSv(f, "phase_timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/chronos/proc/finish_chronowalk"), live(user), live(to_turf)])), 3, 8])));
	} else {
		yield* g.srcCall(f, "finish_chronowalk", live(user), live(to_turf));
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }] });

// /obj/item/clothing/suit/space/chronos/proc/process  (code/modules/clothing/spacesuits/chronosuit.dm:170)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/process", function* process(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (truthy(rt.sv(f, "activated"))) {
		if (((truthy((user = rt.fv(f, "loc", live(f.src)))) && truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "wear_suit", live(user)), live(f.src)))) {
			if ((truthy(rt.sv(f, "camera")) && isEqual(rt.fv(f, "remote_control", live(user)), rt.sv(f, "camera")))) {
				if (!truthy(rt.sv(f, "teleporting"))) {
					if ((!isEqual(rt.fv(f, "loc", rt.sv(f, "camera")), live(user)) && ((!isEqual(rt.fv(f, "x", rt.sv(f, "camera")), rt.fv(f, "x", live(user))) || !isEqual(rt.fv(f, "y", rt.sv(f, "camera")), rt.fv(f, "y", live(user)))) || !isEqual(rt.fv(f, "z", rt.sv(f, "camera")), rt.fv(f, "z", live(user)))))) {
						if (rt.le(rt.fv(f, "phase_time", rt.sv(f, "camera")), rt.worldTime(f))) {
							yield* g.srcCall(f, "chronowalk", rt.sv(f, "camera"));
						}
					} else {
						yield* g.callName(f, rt.sv(f, "camera"), "remove_target_ui", []);
					}
				}
			} else {
				yield* g.srcCall(f, "new_camera", live(user));
			}
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clothing/suit/space/chronos/proc/activate  (code/modules/clothing/spacesuits/chronosuit.dm:184)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/activate", function* activate(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (!((!truthy(rt.sv(f, "activating")) && !truthy(rt.sv(f, "activated"))) && !truthy(rt.sv(f, "teleporting")))) return f.dot;
	rt.setSv(f, "activating", 1);
	if (((truthy((user = rt.fv(f, "loc", live(f.src)))) && truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "wear_suit", live(user)), live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "\nChronosuitMK4 login: root"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Password:\n"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "root@ChronosuitMK4# chronowalk4 --start\n"]);
		if ((truthy(rt.fv(f, "head", live(user))) && truthy((rt.istype(rt.fv(f, "head", live(user)), T("/obj/item/clothing/head/helmet/space/chronos")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #00ff00;'>ok</span> ] Mounting /dev/helm"]);
			rt.setSv(f, "helmet", rt.fv(f, "head", live(user)));
			(rt.modField(f, rt.sv(f, "helmet"), "flags", 2, rt.bitOr));
			rt.setFv(f, "suit", rt.sv(f, "helmet"), live(f.src));
			(rt.modField(f, live(f.src), "flags", 2, rt.bitOr));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #00ff00;'>ok</span> ] Starting brainwave scanner"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #00ff00;'>ok</span> ] Starting ui display driver"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #00ff00;'>ok</span> ] Initializing chronowalk4-view"]);
			yield* g.srcCall(f, "new_camera", live(user));
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
			rt.setSv(f, "activated", 1);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #ff0000;'>fail</span> ] Mounting /dev/helm"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span style='color: #ff0000;'><b>FATAL: </b>Unable to locate /dev/helm. <b>Aborting...</b>"]);
		}
		yield* g.callName(f, rt.sv(f, "teleport_now"), "Grant", [live(user)]);
	}
	rt.setSv(f, "cooldown", add(rt.worldTime(f), rt.sv(f, "cooldowntime")));
	rt.setSv(f, "activating", 0);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/chronos/proc/deactivate  (code/modules/clothing/spacesuits/chronosuit.dm:211)  may sleep
rt.def("/obj/item/clothing/suit/space/chronos/proc/deactivate", function* deactivate(f: Frame, force: Value, silent: Value) {
	let user: Value = null, hard_landing: Value = null;
	f.vars = () => [force, silent, user, hard_landing];
	if (live(force) === null) {
		force = 0;
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (!(truthy(rt.sv(f, "activated")) && (!truthy(rt.sv(f, "teleporting")) || truthy(live(force))))) return f.dot;
	rt.setSv(f, "activating", 1);
	user = rt.fv(f, "loc", live(f.src));
	hard_landing = (rt.sv(f, "teleporting") && live(force));
	(rt.modField(f, live(f.src), "flags", 16777213, rt.bitAnd));
	rt.setSv(f, "cooldown", add(rt.worldTime(f), multiply(rt.sv(f, "cooldowntime"), 1.5)));
	rt.setSv(f, "activated", 0);
	rt.setSv(f, "activating", 0);
	yield* g.srcCall(f, "finish_chronowalk");
	if ((truthy(live(user)) && truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "teleport_now"), "Remove", [live(user)]);
		if (isEqual(rt.fv(f, "wear_suit", live(user)), live(f.src))) {
			if (truthy(live(hard_landing))) {
				yield* g.callName(f, live(user), "electrocute_act", [null, 35, null, live(f.src), "safety", 1], rt.Args.Named);
				yield* g.callName(f, live(user), "Knockdown", [200]);
			}
			if (!truthy(live(silent))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "\nroot@ChronosuitMK4# chronowalk4 --stop\n"]);
				if (truthy(rt.sv(f, "camera"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #ff5500;'>ok</span> ] Sending TERM signal to chronowalk4-view"]);
				}
				if (truthy(rt.sv(f, "helmet"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #ff5500;'>ok</span> ] Stopping ui display driver"]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #ff5500;'>ok</span> ] Stopping brainwave scanner"]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "[ <span style='color: #ff5500;'>ok</span> ] Unmounting /dev/helmet"]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "logout"]);
			}
		}
	}
	if (truthy(rt.sv(f, "helmet"))) {
		(rt.modField(f, rt.sv(f, "helmet"), "flags", 16777213, rt.bitAnd));
		rt.setFv(f, "suit", rt.sv(f, "helmet"), null);
		rt.setSv(f, "helmet", null);
	}
	if (!truthy(rt.sv(f, "camera"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "camera")]);
	return f.dot;
}, true);

rt.type(12047, "/obj/effect/chronos_cam", "/obj/effect", {
	holder: null,
	phase_time: 0,
	phase_time_length: 3,
	target_ui: null,
	chronosuit: null,
	anchored: 1,
	name: "Chronosuit View",
	density: 0,
	invisibility: 101,
	opacity: 0,
	mouse_opacity: 0,
});

// /obj/effect/chronos_cam/proc/create_target_ui  (code/modules/clothing/spacesuits/chronosuit.dm:256)  may sleep
rt.def("/obj/effect/chronos_cam/proc/create_target_ui", function* create_target_ui(f: Frame) {
	if (!((truthy(rt.sv(f, "holder")) && truthy(rt.fv(f, "client", rt.sv(f, "holder")))) && truthy(rt.sv(f, "chronosuit")))) return f.dot;
	if (truthy(rt.sv(f, "target_ui"))) {
		yield* g.srcCall(f, "remove_target_ui");
	}
	rt.setSv(f, "target_ui", (yield* g.new_(f, T("/obj/screen/chronos_target"), [null, rt.sv(f, "holder")])));
	rt.modField(f, rt.fv(f, "client", rt.sv(f, "holder")), "screen", rt.sv(f, "target_ui"), add);
	return f.dot;
}, true);

// /obj/effect/chronos_cam/proc/remove_target_ui  (code/modules/clothing/spacesuits/chronosuit.dm:264)  may sleep
rt.def("/obj/effect/chronos_cam/proc/remove_target_ui", function* remove_target_ui(f: Frame) {
	if (!truthy(rt.sv(f, "target_ui"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "target_ui")]);
	rt.setSv(f, "target_ui", null);
	return f.dot;
}, true);

// /obj/effect/chronos_cam/proc/relaymove  (code/modules/clothing/spacesuits/chronosuit.dm:269)  may sleep
rt.def("/obj/effect/chronos_cam/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let step: Value = null;
	f.vars = () => [user, direction, step];
	if (truthy(rt.sv(f, "holder"))) {
		if (isEqual(live(user), rt.sv(f, "holder"))) {
			if (isEqual(rt.sv(f, "loc"), live(user))) {
				rt.setSv(f, "loc", rt.getStep(f, live(user), 0));
			}
			if ((truthy(rt.fv(f, "client", live(user))) && !isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(user))), live(f.src)))) {
				rt.setFv(f, "loc", live(f.src), rt.getStep(f, live(user), 0));
				yield* g.callName(f, live(user), "reset_perspective", [live(f.src)]);
				yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
			}
			if (truthy((step = rt.getStep(f, live(f.src), live(direction))))) {
				if ((((rt.le(rt.fv(f, "x", live(step)), 7) || rt.ge(rt.fv(f, "x", live(step)), subtract(subtract(rt.fv(f, "maxx", rt.world()), 7), 1))) || rt.le(rt.fv(f, "y", live(step)), 7)) || rt.ge(rt.fv(f, "y", live(step)), subtract(subtract(rt.fv(f, "maxy", rt.world()), 7), 1)))) {
					if (!truthy((yield* g.callName(f, live(f.src), "Move", [live(step)])))) {
						rt.setFv(f, "loc", live(f.src), live(step));
					}
				} else {
					rt.setFv(f, "loc", live(f.src), live(step));
				}
				if (((isEqual(rt.sv(f, "x"), rt.fv(f, "x", rt.sv(f, "holder"))) && isEqual(rt.sv(f, "y"), rt.fv(f, "y", rt.sv(f, "holder")))) && isEqual(rt.sv(f, "z"), rt.fv(f, "z", rt.sv(f, "holder"))))) {
					yield* g.srcCall(f, "remove_target_ui");
					rt.setSv(f, "loc", live(user));
				} else {
					if (!truthy(rt.sv(f, "target_ui"))) {
						yield* g.srcCall(f, "create_target_ui");
					}
				}
				rt.setSv(f, "phase_time", add(rt.worldTime(f), rt.sv(f, "phase_time_length")));
			}
		}
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/effect/chronos_cam/proc/check_eye  (code/modules/clothing/spacesuits/chronosuit.dm:293)  may sleep
rt.def("/obj/effect/chronos_cam/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual(live(user), rt.sv(f, "holder"))) return f.dot;
	yield* g.callName(f, live(user), "unset_machine", []);
	return f.dot;
}, true);

// /obj/effect/chronos_cam/proc/on_unset_machine  (code/modules/clothing/spacesuits/chronosuit.dm:297)  may sleep
rt.def("/obj/effect/chronos_cam/proc/on_unset_machine", function* on_unset_machine(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "reset_perspective", [null]);
	return f.dot;
}, true);

// /obj/effect/chronos_cam/proc/Destroy  (code/modules/clothing/spacesuits/chronosuit.dm:301)  may sleep
rt.def("/obj/effect/chronos_cam/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		if (isEqual(rt.fv(f, "remote_control", rt.sv(f, "holder")), live(f.src))) {
			rt.setFv(f, "remote_control", rt.sv(f, "holder"), null);
		}
		if ((truthy(rt.fv(f, "client", rt.sv(f, "holder"))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", rt.sv(f, "holder"))), live(f.src)))) {
			yield* g.callName(f, rt.sv(f, "holder"), "unset_machine", []);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11206, "/obj/screen/chronos_target", "/obj/screen", {
	name: "target display",
	screen_loc: "CENTER,CENTER",
	color: "#ff3311",
	blend_mode: 3,
});

// /obj/screen/chronos_target/proc/New  (code/modules/clothing/spacesuits/chronosuit.dm:315)  may sleep
rt.def("/obj/screen/chronos_target/proc/New", function* New(f: Frame, loc: Value, user: Value) {
	let user_icon: Value = null;
	f.vars = () => [loc, user, user_icon];
	if (truthy(live(user))) {
		rt.setSv(f, "icon", (user_icon = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(user)]))));
		rt.setSv(f, "transform", rt.fv(f, "transform", live(user)));
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(137, "/datum/action/innate/chrono_teleport", "/datum/action/innate", {
	chronosuit: null,
	name: "Teleport Now",
	button_icon_state: "chrono_phase",
	check_flags: 8,
});

// /datum/action/innate/chrono_teleport/proc/IsAvailable  (code/modules/clothing/spacesuits/chronosuit.dm:328)
rt.def("/datum/action/innate/chrono_teleport/proc/IsAvailable", function IsAvailable(f: Frame) {
	return (((rt.sv(f, "chronosuit") && rt.fv(f, "activated", rt.sv(f, "chronosuit"))) && rt.fv(f, "camera", rt.sv(f, "chronosuit"))) && (!truthy(rt.fv(f, "teleporting", rt.sv(f, "chronosuit"))) ? 1 : 0));
});

// /datum/action/innate/chrono_teleport/proc/Activate  (code/modules/clothing/spacesuits/chronosuit.dm:331)  may sleep
rt.def("/datum/action/innate/chrono_teleport/proc/Activate", function* Activate(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "IsAvailable")))) return f.dot;
	if (!truthy(rt.fv(f, "camera", rt.sv(f, "chronosuit")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "chronosuit"), "chronowalk", [rt.fv(f, "camera", rt.sv(f, "chronosuit"))]);
	return f.dot;
}, true);
