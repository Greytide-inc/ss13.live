// From code/game/machinery/camera/camera.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10622, "/obj/machinery/camera", "/obj/machinery", {
	network: null,
	c_tag: null,
	c_tag_order: 999,
	status: 1,
	start_active: 0,
	invuln: null,
	bug: null,
	assembly: null,
	view_range: 7,
	short_range: 2,
	alarm_on: 0,
	busy: 0,
	emped: 0,
	upgrades: 0,
	localMotionTargets: null,
	detectTime: 0,
	area_motion: null,
	alarm_delay: 30,
	anchored: 1,
	name: "security camera",
	desc: "It's used to monitor rooms.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "camera",
	use_power: 2,
	idle_power_usage: 5,
	active_power_usage: 10,
	layer: 4.25,
	resistance_flags: 2,
	armor: null,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 50,
});

// /obj/machinery/camera/proc/<init>  (code/game/machinery/camera/camera.dm:21)
rt.def("/obj/machinery/camera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "network", rt.list("SS13"));
	$0 = $0;
	rt.setSv(f, "localMotionTargets", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 20, "laser", 20, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 50]));
	return f.dot;
});

// /obj/machinery/camera/proc/Initialize  (code/game/machinery/camera/camera.dm:44)  may sleep
rt.def("/obj/machinery/camera/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "assembly", (yield* g.new_(f, T("/obj/structure/camera_assembly"), [live(f.src)])));
	rt.setFv(f, "state", rt.sv(f, "assembly"), 4);
	rt.modField(f, rt.gl("cameranet"), "cameras", live(f.src), add);
	yield* g.callName(f, rt.gl("cameranet"), "addCamera", [live(f.src)]);
	rt.setSv(f, "proximity_monitor", (yield* g.new_(f, T("/datum/proximity_monitor"), [live(f.src), 1])));
	if (!(((truthy(live(f.args[0])) && isEqual(rt.sv(f, "z"), 2)) && truthy(rt.op(f, "Prob", [], [3]))) && !truthy(rt.sv(f, "start_active")))) return f.dot;
	yield* g.srcCall(f, "toggle_cam");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/camera/proc/Destroy  (code/game/machinery/camera/camera.dm:55)  may sleep
rt.def("/obj/machinery/camera/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "toggle_cam", null, 0);
	if (truthy(rt.sv(f, "assembly"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "assembly")]);
		rt.setSv(f, "assembly", null);
	}
	if (truthy(rt.sv(f, "bug"))) {
		(rt.modField(f, rt.sv(f, "bug"), "bugged_cameras", rt.fv(f, "c_tag", live(f.src)), subtract));
		if (isEqual(rt.fv(f, "current", rt.sv(f, "bug")), live(f.src))) {
			rt.setFv(f, "current", rt.sv(f, "bug"), null);
		}
		rt.setSv(f, "bug", null);
	}
	yield* g.callName(f, rt.gl("cameranet"), "removeCamera", [live(f.src)]);
	(rt.modField(f, rt.gl("cameranet"), "cameras", live(f.src), subtract));
	yield* g.callName(f, rt.gl("cameranet"), "removeCamera", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/camera/proc/emp_act  (code/game/machinery/camera/camera.dm:70)  may sleep
rt.def("/obj/machinery/camera/proc/emp_act", function* emp_act(f: Frame) {
	let previous_network: Value = null, thisemp: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [previous_network, thisemp, O, $e];
	if (!truthy(rt.sv(f, "status"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "isEmpProof")))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [divide(150, live(f.args[0]))]))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	previous_network = rt.sv(f, "network");
	rt.setSv(f, "network", rt.list());
	yield* g.callName(f, rt.gl("cameranet"), "removeCamera", [live(f.src)]);
	(rt.modSrcVar(f, "stat", 16, rt.bitOr));
	yield* g.srcCall(f, "set_light", 0);
	rt.setSv(f, "emped", add(rt.sv(f, "emped"), 1));
	yield* g.srcCall(f, "update_icon");
	thisemp = rt.sv(f, "emped");
	rt.spawnTail(f, 900, "/obj/machinery/camera/proc/emp_act: spawn at game/machinery/camera/camera.dm:83", previous_network, thisemp, O);
	O = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.fv(f, "client", live(O))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(O))), live(f.src)))) {
			yield* g.callName(f, live(O), "unset_machine", []);
			yield* g.callName(f, live(O), "reset_perspective", [null]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(O), "The screen bursts into static."]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// a spawn(900) body of /obj/machinery/camera/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/camera/proc/emp_act: spawn at game/machinery/camera/camera.dm:83", function* (f: Frame, previous_network: Value, thisemp: Value, O: Value) {
	f.vars = () => [previous_network, thisemp, O];
	if (truthy(rt.sv(f, "loc"))) {
		yield* g.srcCall(f, "triggerCameraAlarm");
		if (isEqual(rt.sv(f, "emped"), live(thisemp))) {
			rt.setSv(f, "network", live(previous_network));
			(rt.modSrcVar(f, "stat", 16777199, rt.bitAnd));
			yield* g.srcCall(f, "update_icon");
			if (truthy((yield* g.srcCall(f, "can_use")))) {
				yield* g.callName(f, rt.gl("cameranet"), "addCamera", [live(f.src)]);
			}
			rt.setSv(f, "emped", 0);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/camera/proc/cancelCameraAlarm")])), 100]);
		}
	}
	return null;
});

// /obj/machinery/camera/proc/tesla_act  (code/game/machinery/camera/camera.dm:102)  may sleep
rt.def("/obj/machinery/camera/proc/tesla_act", function* tesla_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "isEmpProof")))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["power"] });

// /obj/machinery/camera/proc/ex_act  (code/game/machinery/camera/camera.dm:110)
rt.def("/obj/machinery/camera/proc/ex_act", function ex_act(f: Frame) {
	if (truthy(rt.sv(f, "invuln"))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/camera/proc/setViewRange  (code/game/machinery/camera/camera.dm:114)
rt.def("/obj/machinery/camera/proc/setViewRange", function setViewRange(f: Frame, num: Value) {
	f.vars = () => [num];
	if (live(num) === null) {
		num = 7;
	}
	rt.setFv(f, "view_range", live(f.src), live(num));
	rt.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src), 0]);
	return f.dot;
});

// /obj/machinery/camera/proc/shock  (code/game/machinery/camera/camera.dm:117)  may sleep
rt.def("/obj/machinery/camera/proc/shock", function* shock(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "electrocute_act", [10, live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/camera/proc/attackby  (code/game/machinery/camera/camera.dm:122)  may sleep
rt.def("/obj/machinery/camera/proc/attackby", function* attackby(f: Frame) {
	let msg: Value = null, msg2: Value = null, _P: Value = null, U: Value = null, X: Value = null, _P_4: Value = null, itemname: Value = null, info: Value = null, O: Value = null, AI: Value = null, cable: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [msg, msg2, _P, U, X, _P_4, itemname, info, O, AI, cable, $0, $1, $e];
	msg = fmt("<span class='notice'>You attach ＀ into the assembly's inner circuits.</span>", [live(f.args[0])]);
	msg2 = fmt("<span class='notice'>＀ already has that upgrade!</span>", [live(f.src)]);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "panel_open"))) {
			$1 = "open";
		} else {
			$1 = "closed";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You screw the camera's panel ＀.</span>", [$1])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.srcCall(f, "toggle_cam", live(f.args[1]), 1);
			rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
				if (isEqual(rt.sv(f, "view_range"), rt.initial(f, live(f.src), "view_range"))) {
					$0 = rt.sv(f, "short_range");
				} else {
					$0 = rt.initial(f, live(f.src), "view_range");
				}
				yield* g.srcCall(f, "setViewRange", $0);
				$0 = live(f.args[1]);
				if (isEqual(rt.sv(f, "view_range"), rt.initial(f, live(f.src), "view_range"))) {
					$1 = "restore";
				} else {
					$1 = "mess up";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the camera's focus.</span>", [$1])]);
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
					if (truthy((yield* g.srcCall(f, "weld", live(f.args[0]), live(f.args[1]))))) {
						yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ unwelds ＀, leaving it as just a frame bolted to the wall.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='warning'>You unweld ＀, leaving it as just a frame bolted to the wall</span>", [live(f.src)]));
						yield* g.srcCall(f, "deconstruct", 1);
					}
					return live(f.dot);
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0))) {
						if (!truthy((yield* g.srcCall(f, "isXRay")))) {
							if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [live(f.args[0])])))) {
								return live(f.dot);
							}
							yield* g.srcCall(f, "upgradeXRay");
							yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀", [live(msg)])]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀", [live(msg2)])]);
						}
						return live(f.dot);
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/plasma")) ? 1 : 0))) {
							if (!truthy((yield* g.srcCall(f, "isEmpProof")))) {
								_P = live(f.args[0]);
								yield* g.srcCall(f, "upgradeEmpProof");
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀", [live(msg)])]);
								yield* g.callName(f, live(_P), "use", [1]);
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀", [live(msg2)])]);
							}
							return live(f.dot);
						} else {
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0))) {
								if (!truthy((yield* g.srcCall(f, "isMotion")))) {
									yield* g.srcCall(f, "upgradeMotion");
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀", [live(msg)])]);
									yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀", [live(msg2)])]);
								}
								return live(f.dot);
							}
						}
					}
				}
			}
		}
	}
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0))) && truthy((rt.istype(live(f.args[1]), T("/mob/living")) ? 1 : 0)))) {
		U = live(f.args[1]);
		X = null;
		_P_4 = null;
		itemname = "";
		info = "";
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0))) {
			itemname = rt.gv(f, "name", (X = live(f.args[0])));
			info = rt.fv(f, "info", live(X));
		} else {
			itemname = rt.gv(f, "name", (_P_4 = live(f.args[0])));
			info = rt.fv(f, "notehtml", live(_P_4));
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>You hold ％！ up to the camera...</span>", [live(itemname)])]);
		yield* g.callName(f, live(U), "changeNext_move", [8]);
		O = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (truthy((rt.istype(live(O), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				if ((truthy(rt.gv(f, "control_disabled", (AI = live(O)))) || isEqual(rt.fv(f, "stat", live(AI)), 2))) {
					return live(f.dot);
				}
				if (isEqual(rt.fv(f, "name", live(U)), "Unknown")) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<b>＀</b> holds <a href='?_src_=usr;show_paper=1;'>＇！</a> up to one of your cameras ...", [live(U), live(itemname)])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<b><a href='?src=＃;track=＀'>＀</a></b> holds <a href='?_src_=usr;show_paper=1;'>＇！</a> up to one of your cameras ...", [live(AI), (yield* g.call(f, P("/proc/html_encode"), null, [rt.fv(f, "name", live(U))])), live(U), live(itemname)])]);
				}
				rt.setFv(f, "last_paper_seen", live(AI), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY><TT>＀</TT></BODY></HTML>", [live(itemname), live(info)]));
			} else {
				if ((truthy(rt.fv(f, "client", live(O))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(O))), live(f.src)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(O), fmt("＀ holds ＇！ up to one of the cameras ...", [live(U), live(itemname)])]);
					rt.op(f, "Browse", [], [live(O), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY><TT>＀</TT></BODY></HTML>", [live(itemname), live(info)]), fmt("window=＀", [live(itemname)])], false);
				}
			}
		}
		rt.endFor(f, 0);
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/camera_bug")) ? 1 : 0))) {
			if (!truthy((yield* g.srcCall(f, "can_use")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Camera non-functional.</span>"]);
				return live(f.dot);
			}
			if (truthy(rt.sv(f, "bug"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Camera bug removed.</span>"]);
				(rt.modField(f, rt.sv(f, "bug"), "bugged_cameras", rt.fv(f, "c_tag", live(f.src)), subtract));
				rt.setSv(f, "bug", null);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Camera bugged.</span>"]);
				rt.setSv(f, "bug", live(f.args[0]));
				rt.setAt(rt.fv(f, "bugged_cameras", rt.sv(f, "bug")), rt.fv(f, "c_tag", live(f.src)), live(f.src));
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pai_cable")) ? 1 : 0))) {
				yield* g.callName(f, (cable = live(f.args[0])), "plugin", [live(f.src), live(f.args[1])]);
				return live(f.dot);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/camera/proc/run_obj_armor  (code/game/machinery/camera/camera.dm:234)
rt.def("/obj/machinery/camera/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 12)) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/machinery/camera/proc/obj_break  (code/game/machinery/camera/camera.dm:239)  may sleep
rt.def("/obj/machinery/camera/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(truthy(rt.sv(f, "status")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	yield* g.srcCall(f, "triggerCameraAlarm");
	yield* g.srcCall(f, "toggle_cam", null, 0);
	return f.dot;
}, true);

// /obj/machinery/camera/proc/deconstruct  (code/game/machinery/camera/camera.dm:244)  may sleep
rt.def("/obj/machinery/camera/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	f.vars = () => [disassembled, I];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(disassembled))) {
			if (!truthy(rt.sv(f, "assembly"))) {
				rt.setSv(f, "assembly", (yield* g.new_(f, T("/obj/structure/camera_assembly"), [])));
			}
			rt.setFv(f, "loc", rt.sv(f, "assembly"), rt.fv(f, "loc", live(f.src)));
			rt.setFv(f, "state", rt.sv(f, "assembly"), 1);
			yield* g.callName(f, rt.sv(f, "assembly"), "setDir", [rt.sv(f, "dir")]);
			rt.setSv(f, "assembly", null);
		} else {
			rt.setFv(f, "obj_integrity", (I = (yield* g.new_(f, T("/obj/item/wallframe/camera"), [rt.sv(f, "loc")]))), multiply(rt.fv(f, "max_integrity", live(I)), 0.5));
			yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 2]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/camera/proc/update_icon  (code/game/machinery/camera/camera.dm:259)
rt.def("/obj/machinery/camera/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "status"))) {
		rt.setSv(f, "icon_state", fmt("＀1", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 16))) {
			rt.setSv(f, "icon_state", fmt("＀emp", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
		}
	}
	return f.dot;
});

// /obj/machinery/camera/proc/toggle_cam  (code/game/machinery/camera/camera.dm:267)  may sleep
rt.def("/obj/machinery/camera/proc/toggle_cam", function* toggle_cam(f: Frame, user: Value, displaymessage: Value) {
	let change_msg: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [user, displaymessage, change_msg, O, $e];
	if (live(displaymessage) === null) {
		displaymessage = 1;
	}
	rt.setSv(f, "status", (!truthy(rt.sv(f, "status")) ? 1 : 0));
	if (truthy((yield* g.srcCall(f, "can_use")))) {
		yield* g.callName(f, rt.gl("cameranet"), "addCamera", [live(f.src)]);
	} else {
		yield* g.srcCall(f, "set_light", 0);
		yield* g.callName(f, rt.gl("cameranet"), "removeCamera", [live(f.src)]);
	}
	yield* g.callName(f, rt.gl("cameranet"), "updateChunk", [rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")]);
	change_msg = "deactivates";
	if (truthy(rt.sv(f, "status"))) {
		change_msg = "reactivates";
		yield* g.srcCall(f, "triggerCameraAlarm");
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/camera/proc/cancelCameraAlarm")])), 100]);
	}
	if (truthy(live(displaymessage))) {
		if (truthy(live(user))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ ＀ ＀!</span>", [live(user), live(change_msg), live(f.src)]));
			yield* g.srcCall(f, "add_hiddenprint", live(user));
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ ＀!</span>", [live(f.src), live(change_msg)]));
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/wirecutter.ogg"), 100, 1]);
	}
	yield* g.srcCall(f, "update_icon");
	O = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.fv(f, "client", live(O))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(O))), live(f.src)))) {
			yield* g.callName(f, live(O), "unset_machine", []);
			yield* g.callName(f, live(O), "reset_perspective", [null]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(O), "The screen bursts into static."]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/camera/proc/triggerCameraAlarm  (code/game/machinery/camera/camera.dm:300)
rt.def("/obj/machinery/camera/proc/triggerCameraAlarm", function triggerCameraAlarm(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	rt.setSv(f, "alarm_on", 1);
	S = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.callName(f, live(S), "triggerAlarm", ["Camera", rt.call(f, P("/proc/get_area"), null, [live(f.src)]), rt.list(live(f.src)), live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/camera/proc/cancelCameraAlarm  (code/game/machinery/camera/camera.dm:305)
rt.def("/obj/machinery/camera/proc/cancelCameraAlarm", function cancelCameraAlarm(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	rt.setSv(f, "alarm_on", 0);
	S = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/silicon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.callName(f, live(S), "cancelAlarm", ["Camera", rt.call(f, P("/proc/get_area"), null, [live(f.src)]), live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/camera/proc/can_use  (code/game/machinery/camera/camera.dm:309)
rt.def("/obj/machinery/camera/proc/can_use", function can_use(f: Frame) {
	if (!truthy(rt.sv(f, "status"))) {
		return 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 16))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/camera/proc/can_see  (code/game/machinery/camera/camera.dm:317)
rt.def("/obj/machinery/camera/proc/can_see", function can_see(f: Frame) {
	let see: Value = null, pos: Value = null;
	f.vars = () => [see, pos];
	see = null;
	pos = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.callSrc(f, "isXRay", []))) {
		see = rt.call(f, P("/proc/range"), null, [rt.sv(f, "view_range"), live(pos)]);
	} else {
		see = rt.call(f, P("/proc/get_hear"), null, [rt.sv(f, "view_range"), live(pos)]);
	}
	return live(see);
});

// /atom/proc/auto_turn  (code/game/machinery/camera/camera.dm:327)  may sleep
rt.def("/atom/proc/auto_turn", function* auto_turn(f: Frame) {
	let _T: Value = null, i: Value = null;
	let $0: any;
	f.vars = () => [_T, i, $0];
	_T = null;
	i = null;
	i = 1;
	while (rt.le(live(i), 8)) {
		if (truthy((rt.istype((_T = (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(f.src), live(i), 1]))), T("/turf/closed/wall")) ? 1 : 0))) {
			$0 = live(i);
			if ($0 === 1) {
				yield* g.callName(f, live(f.src), "setDir", [2]);
			} else if ($0 === 2) {
				yield* g.callName(f, live(f.src), "setDir", [1]);
			} else if ($0 === 8) {
				yield* g.callName(f, live(f.src), "setDir", [4]);
			} else if ($0 === 4) {
				yield* g.callName(f, live(f.src), "setDir", [8]);
			}
			break;
		}
		i = rt.modify(live(i), live(i), add);
	}
	return f.dot;
}, true);

// /proc/seen_by_camera  (code/game/machinery/camera/camera.dm:345)
rt.def("/proc/seen_by_camera", function seen_by_camera(f: Frame, M: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.call(f, P("/proc/oview"), null, [4, live(M)]), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.callName(f, live(C), "can_use", []))) {
			return live(C);
			break;
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /proc/near_range_camera  (code/game/machinery/camera/camera.dm:352)
rt.def("/proc/near_range_camera", function near_range_camera(f: Frame, M: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [4, live(M)]), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.callName(f, live(C), "can_use", []))) {
			return live(C);
			break;
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/camera/proc/weld  (code/game/machinery/camera/camera.dm:362)  may sleep
rt.def("/obj/machinery/camera/proc/weld", function* weld(f: Frame, WT: Value, user: Value) {
	f.vars = () => [WT, user];
	if (truthy(rt.sv(f, "busy"))) {
		return 0;
	}
	if (!truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(user)])))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start to weld ＀...</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(WT)), 50, 1]);
	rt.setSv(f, "busy", 1);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(100, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named)))) {
		rt.setSv(f, "busy", 0);
		if (!truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
			return 0;
		}
		return 1;
	}
	rt.setSv(f, "busy", 0);
	return 0;
}, true);

// /obj/machinery/camera/proc/Togglelight  (code/game/machinery/camera/camera.dm:377)
rt.def("/obj/machinery/camera/proc/Togglelight", function Togglelight(f: Frame, on: Value) {
	let A: Value = null, cam: Value = null;
	let $e: any;
	f.vars = () => [on, A, cam, $e];
	if (live(on) === null) {
		on = 0;
	}
	A = null;
	rt.forList(f, 0, rt.gl("ai_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		cam = null;
		rt.forList(f, 1, rt.fv(f, "lit_cameras", live(A)), T("/obj/machinery/camera"));
		while (($e = rt.next(f, 1)) !== undefined) {
			cam = $e;
			if (isEqual(live(cam), live(f.src))) {
				return live(f.dot);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (truthy(live(on))) {
		rt.callSrc(f, "set_light", [5]);
	} else {
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
});

rt.type(10623, "/obj/machinery/camera/portable", "/obj/machinery/camera", {
	prev_turf: null,
});

// /obj/machinery/camera/portable/proc/Initialize  (code/game/machinery/camera/camera.dm:390)  may sleep
rt.def("/obj/machinery/camera/portable/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "state", rt.sv(f, "assembly"), 0);
	rt.setFv(f, "anchored", rt.sv(f, "assembly"), 0);
	yield* g.callName(f, rt.sv(f, "assembly"), "update_icon", []);
	return f.dot;
}, true);

// /obj/machinery/camera/portable/proc/process  (code/game/machinery/camera/camera.dm:396)
rt.def("/obj/machinery/camera/portable/proc/process", function process(f: Frame) {
	if (!(truthy(rt.gl("cameranet")) && !isEqual(rt.getStep(f, live(f.src), 0), rt.sv(f, "prev_turf")))) return f.dot;
	rt.callName(f, rt.gl("cameranet"), "updatePortableCamera", [live(f.src)]);
	rt.setSv(f, "prev_turf", rt.getStep(f, live(f.src), 0));
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/camera/proc/get_remote_view_fullscreens  (code/game/machinery/camera/camera.dm:401)  may sleep
rt.def("/obj/machinery/camera/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.sv(f, "view_range"), rt.sv(f, "short_range"))) return f.dot;
	yield* g.callName(f, live(user), "overlay_fullscreen", ["remote_view", T("/obj/screen/fullscreen/impaired"), 2]);
	return f.dot;
}, true);

// /obj/machinery/camera/proc/update_remote_sight  (code/game/machinery/camera/camera.dm:405)
rt.def("/obj/machinery/camera/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	rt.setFv(f, "see_invisible", live(user), 25);
	if (truthy(rt.callSrc(f, "isXRay", []))) {
		(rt.modField(f, live(user), "sight", 28, rt.bitOr));
		rt.setFv(f, "see_in_dark", live(user), rt.call(f, P("/proc/max"), null, [rt.fv(f, "see_in_dark", live(user)), 8]));
	} else {
		rt.setFv(f, "sight", live(user), 0);
		rt.setFv(f, "see_in_dark", live(user), 2);
	}
	return 1;
});
