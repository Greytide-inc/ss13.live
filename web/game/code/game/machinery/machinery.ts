// From code/game/machinery/machinery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10208, "/obj/machinery", "/obj", {
	stat: 0,
	emagged: 0,
	use_power: 1,
	idle_power_usage: 0,
	active_power_usage: 0,
	power_channel: 1,
	component_parts: null,
	uid: null,
	panel_open: 0,
	state_open: 0,
	critical_machine: 0,
	occupant_typecache: null,
	occupant: null,
	unsecuring_tool: rt.typePath("/obj/item/weapon/wrench"),
	interact_open: 0,
	interact_offline: 0,
	speed_process: 0,
	verb_say: "beeps",
	verb_yell: "blares",
	pressure_resistance: 15,
	name: "machinery",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	obj_integrity: 200,
	max_integrity: 200,
}, { global: { gl_uid: 759 } });

// /obj/machinery/proc/<init>  (code/game/machinery/machinery.dm:121)
rt.def("/obj/machinery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "occupant_typecache", rt.list(T("/mob/living")));
	return f.dot;
});

// /obj/machinery/proc/Initialize  (code/game/machinery/machinery.dm:129)  may sleep
rt.def("/obj/machinery/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "armor"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("machines", live(f.src), add);
	if (!truthy(rt.sv(f, "speed_process"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), add);
		}
	} else {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
		}
	}
	yield* g.srcCall(f, "power_change");
	rt.setSv(f, "occupant_typecache", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "occupant_typecache")])));
	return f.dot;
}, true);

// /obj/machinery/proc/Destroy  (code/game/machinery/machinery.dm:142)  may sleep
rt.def("/obj/machinery/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("machines"), "Remove", [live(f.src)]);
	if (!truthy(rt.sv(f, "speed_process"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), subtract));
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	}
	yield* g.srcCall(f, "dropContents");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/proc/emp_act  (code/game/machinery/machinery.dm:160)  may sleep
rt.def("/obj/machinery/proc/emp_act", function* emp_act(f: Frame) {
	if ((truthy(rt.sv(f, "use_power")) && !truthy(rt.sv(f, "stat")))) {
		yield* g.srcCall(f, "use_power", divide(7500, live(f.args[0])));
		yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.sv(f, "loc")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/proc/open_machine  (code/game/machinery/machinery.dm:169)  may sleep
rt.def("/obj/machinery/proc/open_machine", function* open_machine(f: Frame, drop: Value) {
	f.vars = () => [drop];
	if (live(drop) === null) {
		drop = 1;
	}
	rt.setSv(f, "state_open", 1);
	rt.setSv(f, "density", 0);
	if (truthy(live(drop))) {
		yield* g.srcCall(f, "dropContents");
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/proc/dropContents  (code/game/machinery/machinery.dm:174)  may sleep
rt.def("/obj/machinery/proc/dropContents", function* dropContents(f: Frame) {
	let _T: Value = null, A: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, A, L, $e];
	_T = rt.getStep(f, live(f.src), 0);
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "forceMove", [live(_T)]);
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			yield* g.callName(f, (L = live(A)), "update_canmove", []);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "occupant", null);
	return f.dot;
}, true);

// /obj/machinery/proc/close_machine  (code/game/machinery/machinery.dm:185)  may sleep
rt.def("/obj/machinery/proc/close_machine", function* close_machine(f: Frame, target: Value) {
	let am: Value = null, AM: Value = null, L: Value = null, mobtarget: Value = null;
	let $e: any;
	f.vars = () => [target, am, AM, L, mobtarget, $e];
	if (live(target) === null) {
		target = null;
	}
	rt.setSv(f, "state_open", 0);
	rt.setSv(f, "density", 1);
	if (!truthy(live(target))) {
		am = null;
		rt.forList(f, 0, rt.sv(f, "loc"));
		while (($e = rt.next(f, 0)) !== undefined) {
			am = $e;
			if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(am), rt.sv(f, "occupant_typecache")])))) {
				continue;
			}
			if (truthy((yield* g.callName(f, (AM = live(am)), "has_buckled_mobs", [])))) {
				continue;
			}
			if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "buckled", (L = live(am))))) {
					continue;
				}
			}
			target = live(am);
		}
		rt.endFor(f, 0);
	}
	mobtarget = live(target);
	if (((truthy(live(target)) && !truthy((yield* g.callName(f, live(target), "has_buckled_mobs", [])))) && (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)) || !truthy(rt.fv(f, "buckled", live(mobtarget)))))) {
		rt.setSv(f, "occupant", live(target));
		yield* g.callName(f, live(target), "forceMove", [live(f.src)]);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/proc/auto_use_power  (code/game/machinery/machinery.dm:206)
rt.def("/obj/machinery/proc/auto_use_power", function auto_use_power(f: Frame) {
	if (!truthy(rt.callSrc(f, "powered", [rt.sv(f, "power_channel")]))) {
		return 0;
	}
	if (isEqual(rt.sv(f, "use_power"), 1)) {
		rt.callSrc(f, "use_power", [rt.sv(f, "idle_power_usage"), rt.sv(f, "power_channel")]);
	} else {
		if (rt.ge(rt.sv(f, "use_power"), 2)) {
			rt.callSrc(f, "use_power", [rt.sv(f, "active_power_usage"), rt.sv(f, "power_channel")]);
		}
	}
	return 1;
});

// /obj/machinery/proc/is_operational  (code/game/machinery/machinery.dm:215)
rt.def("/obj/machinery/proc/is_operational", function is_operational(f: Frame) {
	return (!truthy(rt.bitAnd(rt.sv(f, "stat"), 11)) ? 1 : 0);
});

// /obj/machinery/proc/is_interactable  (code/game/machinery/machinery.dm:218)
rt.def("/obj/machinery/proc/is_interactable", function is_interactable(f: Frame) {
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) && !truthy(rt.sv(f, "interact_offline")))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "panel_open")) && !truthy(rt.sv(f, "interact_open")))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/proc/interact  (code/game/machinery/machinery.dm:228)  may sleep
rt.def("/obj/machinery/proc/interact", function* interact(f: Frame, user: Value, special_state: Value) {
	f.vars = () => [user, special_state];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(live(special_state))) {
		yield* g.callSrc(f, "ui_interact", [null, live(user), "state", live(special_state)], rt.Args.Named);
	} else {
		yield* g.srcCall(f, "ui_interact", live(user));
	}
	return f.dot;
}, true);

// /obj/machinery/proc/ui_status  (code/game/machinery/machinery.dm:235)
rt.def("/obj/machinery/proc/ui_status", function ui_status(f: Frame) {
	if (truthy(rt.callSrc(f, "is_interactable", []))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return -1;
}, false, { args: ["user"] });

// /obj/machinery/proc/ui_act  (code/game/machinery/machinery.dm:240)  may sleep
rt.def("/obj/machinery/proc/ui_act", function* ui_act(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["action", "params"] });

// /obj/machinery/proc/Topic  (code/game/machinery/machinery.dm:244)  may sleep
rt.def("/obj/machinery/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.srcCall(f, "is_interactable")))) {
		return 1;
	}
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) {
		return 1;
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return 0;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/proc/attack_paw  (code/game/machinery/machinery.dm:258)  may sleep
rt.def("/obj/machinery/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		return (yield* g.srcCall(f, "attack_hand", live(user)));
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "punch"]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ smashes against ％！ with its paws.</span>", [rt.fv(f, "name", live(user)), rt.fv(f, "name", live(f.src))]), null, null, 3]);
	yield* g.srcCall(f, "take_damage", 4, "brute", "melee", 1);
	return f.dot;
}, true);

// /obj/machinery/proc/attack_ai  (code/game/machinery/machinery.dm:268)  may sleep
rt.def("/obj/machinery/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [user, R];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (((truthy(rt.gv(f, "client", (R = live(user)))) && isEqual(rt.gv(f, "eye", rt.fv(f, "client", live(R))), live(R))) && !truthy(rt.fv(f, "low_power_mode", live(R))))) {
			return (yield* g.srcCall(f, "attack_hand", live(user)));
		}
	} else {
		return (yield* g.srcCall(f, "attack_hand", live(user)));
	}
	return f.dot;
}, true);

// /obj/machinery/proc/attack_hand  (code/game/machinery/machinery.dm:278)  may sleep
rt.def("/obj/machinery/proc/attack_hand", function* attack_hand(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (((truthy(rt.fv(f, "lying", live(f.args[0]))) || truthy(rt.fv(f, "stat", live(f.args[0])))) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.args[0])]))))) {
		return 1;
	}
	if ((!truthy((yield* g.callName(f, live(f.args[0]), "IsAdvancedToolUser", []))) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.args[0])]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return 1;
	}
	if (!truthy((yield* g.srcCall(f, "is_interactable")))) {
		return 1;
	}
	if (truthy(live(f.args[2]))) {
		yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	return 0;
}, true, { args: ["user", "check_power", "set_machine"] });

// /obj/machinery/proc/CheckParts  (code/game/machinery/machinery.dm:294)  may sleep
rt.def("/obj/machinery/proc/CheckParts", function* CheckParts(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "RefreshParts");
	return f.dot;
}, true, { args: ["parts_list"] });

// /obj/machinery/proc/assign_uid  (code/game/machinery/machinery.dm:301)
rt.def("/obj/machinery/proc/assign_uid", function assign_uid(f: Frame) {
	rt.setSv(f, "uid", rt.gl("gl_uid"));
	rt.incGl("gl_uid", 1, true);
	return f.dot;
});

// /obj/machinery/proc/default_pry_open  (code/game/machinery/machinery.dm:305)  may sleep
rt.def("/obj/machinery/proc/default_pry_open", function* default_pry_open(f: Frame, C: Value) {
	f.vars = () => [C];
	f.dot = ((!(((truthy(rt.sv(f, "state_open")) || truthy(rt.sv(f, "panel_open"))) || truthy((yield* g.srcCall(f, "is_operational")))) || truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) ? 1 : 0) && (rt.istype(live(C), T("/obj/item/weapon/crowbar")) ? 1 : 0));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(C)), 50, 1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ pries open ％！.</span>", [live(f.usr), live(f.src)]), fmt("<span class='notice'>You pry open ％！.</span>", [live(f.src)]));
	yield* g.srcCall(f, "open_machine");
	return 1;
}, true);

// /obj/machinery/proc/default_deconstruction_crowbar  (code/game/machinery/machinery.dm:313)  may sleep
rt.def("/obj/machinery/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame, C: Value, ignore_panel: Value) {
	f.vars = () => [C, ignore_panel];
	if (live(ignore_panel) === null) {
		ignore_panel = 0;
	}
	f.dot = (((rt.istype(live(C), T("/obj/item/weapon/crowbar")) ? 1 : 0) && (rt.sv(f, "panel_open") || live(ignore_panel))) && (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128)) ? 1 : 0));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(C)), 50, 1]);
	yield* g.srcCall(f, "deconstruct", 1);
	return f.dot;
}, true);

// /obj/machinery/proc/deconstruct  (code/game/machinery/machinery.dm:319)  may sleep
rt.def("/obj/machinery/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [disassembled, I, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.srcCall(f, "on_deconstruction");
		if ((truthy(rt.sv(f, "component_parts")) && truthy(rt.len(f, rt.sv(f, "component_parts"))))) {
			yield* g.srcCall(f, "spawn_frame", live(disassembled));
			I = null;
			rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				yield* g.callName(f, live(I), "forceMove", [rt.sv(f, "loc")]);
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/proc/spawn_frame  (code/game/machinery/machinery.dm:328)  may sleep
rt.def("/obj/machinery/proc/spawn_frame", function* spawn_frame(f: Frame, disassembled: Value) {
	let M: Value = null;
	f.vars = () => [disassembled, M];
	f.dot = (M = (yield* g.new_(f, T("/obj/structure/frame/machine"), [rt.sv(f, "loc")])));
	rt.setFv(f, "anchored", live(M), rt.sv(f, "anchored"));
	if (!truthy(live(disassembled))) {
		rt.setFv(f, "obj_integrity", live(M), multiply(rt.fv(f, "max_integrity", live(M)), 0.5));
	}
	yield* g.srcCall(f, "transfer_fingerprints_to", live(M));
	rt.setFv(f, "state", live(M), 2);
	rt.setFv(f, "icon_state", live(M), "box_1");
	return f.dot;
}, true);

// /obj/machinery/proc/obj_break  (code/game/machinery/machinery.dm:338)
rt.def("/obj/machinery/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// /obj/machinery/proc/contents_explosion  (code/game/machinery/machinery.dm:343)
rt.def("/obj/machinery/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	rt.callName(f, rt.sv(f, "occupant"), "ex_act", [live(severity), live(target)]);
	return f.dot;
});

// /obj/machinery/proc/handle_atom_del  (code/game/machinery/machinery.dm:346)  may sleep
rt.def("/obj/machinery/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!isEqual(live(A), rt.sv(f, "occupant"))) return f.dot;
	rt.setSv(f, "occupant", null);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/proc/default_deconstruction_screwdriver  (code/game/machinery/machinery.dm:352)
rt.def("/obj/machinery/proc/default_deconstruction_screwdriver", function default_deconstruction_screwdriver(f: Frame, user: Value, icon_state_open: Value, icon_state_closed: Value, S: Value) {
	if ((truthy((rt.istype(live(S), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(S)), 50, 1]);
		if (!truthy(rt.sv(f, "panel_open"))) {
			rt.setSv(f, "panel_open", 1);
			rt.setSv(f, "icon_state", live(icon_state_open));
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You open the maintenance hatch of ＀.</span>", [live(f.src)])]);
		} else {
			rt.setSv(f, "panel_open", 0);
			rt.setSv(f, "icon_state", live(icon_state_closed));
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You close the maintenance hatch of ＀.</span>", [live(f.src)])]);
		}
		return 1;
	}
	return 0;
});

// /obj/machinery/proc/default_change_direction_wrench  (code/game/machinery/machinery.dm:366)  may sleep
rt.def("/obj/machinery/proc/default_change_direction_wrench", function* default_change_direction_wrench(f: Frame, user: Value, W: Value) {
	f.vars = () => [user, W];
	if ((truthy(rt.sv(f, "panel_open")) && truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 50, 1]);
		yield* g.srcCall(f, "setDir", (yield* g.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), -90])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You rotate ＀.</span>", [live(f.src)])]);
		return 1;
	}
	return 0;
}, true);

// /obj/proc/can_be_unfasten_wrench  (code/game/machinery/machinery.dm:374)
rt.def("/obj/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if ((!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/floor")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs to be on the floor to be secured!</span>", [live(f.src)])]);
		return 1;
	}
	return 2;
});

// /obj/proc/default_unfasten_wrench  (code/game/machinery/machinery.dm:380)  may sleep
rt.def("/obj/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame, user: Value, W: Value, time: Value) {
	let can_be_unfasten: Value = null, prev_anchored: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, W, time, can_be_unfasten, prev_anchored, $0, $1];
	if (live(time) === null) {
		time = 20;
	}
	if ((truthy((rt.istype(live(W), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		if ((!truthy((can_be_unfasten = (yield* g.srcCall(f, "can_be_unfasten_wrench", live(user))))) || isEqual(live(can_be_unfasten), 1))) {
			return live(can_be_unfasten);
		}
		if (truthy(live(time))) {
			$0 = live(user);
			if (truthy(rt.sv(f, "anchored"))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin ＀securing ＀...</span>", [$1, live(f.src)])]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(W)), 50, 1]);
		prev_anchored = rt.sv(f, "anchored");
		if ((!truthy(live(time)) || truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(live(time), rt.fv(f, "toolspeed", live(W))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/proc/unfasten_wrench_check"), live(prev_anchored), live(user)]))], rt.Args.Named))))) {
			$0 = live(user);
			if (truthy(rt.sv(f, "anchored"))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀secure ＀.</span>", [$1, live(f.src)])]);
			rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			return 2;
		}
		return 1;
	}
	return 0;
}, true);

// /obj/proc/unfasten_wrench_check  (code/game/machinery/machinery.dm:398)
rt.def("/obj/proc/unfasten_wrench_check", function unfasten_wrench_check(f: Frame, prev_anchored: Value, user: Value) {
	if (!isEqual(rt.sv(f, "anchored"), live(prev_anchored))) {
		return 0;
	}
	if (!isEqual(rt.callSrc(f, "can_be_unfasten_wrench", [live(user), 1]), 2)) {
		return 0;
	}
	return 1;
}, false, { argTypes: [{  }, { type: 8, path: "/mob" }] });

// /obj/machinery/proc/exchange_parts  (code/game/machinery/machinery.dm:405)  may sleep
rt.def("/obj/machinery/proc/exchange_parts", function* exchange_parts(f: Frame, user: Value, W: Value) {
	let shouldplaysound: Value = null, CB: Value = null, _P: Value = null, A: Value = null, D: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [user, W, shouldplaysound, CB, _P, A, D, B, $e];
	if (!truthy((rt.istype(live(W), T("/obj/item/weapon/storage/part_replacer")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "flags"), 128)) && !truthy(rt.fv(f, "works_from_distance", live(W))))) {
		return live(f.dot);
	}
	shouldplaysound = 0;
	if (truthy(rt.sv(f, "component_parts"))) {
		if ((truthy(rt.sv(f, "panel_open")) || truthy(rt.fv(f, "works_from_distance", live(W))))) {
			CB = rt.locateIn(f, T("/obj/item/weapon/circuitboard/machine"), rt.sv(f, "component_parts"));
			_P = null;
			if (truthy(rt.fv(f, "works_from_distance", live(W)))) {
				yield* g.srcCall(f, "display_parts", live(user));
			}
			A = null;
			rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				D = null;
				rt.forList(f, 1, rt.fv(f, "req_components", live(CB)));
				while (($e = rt.next(f, 1)) !== undefined) {
					D = $e;
					if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "type", live(A)), live(D)])))) {
						_P = live(D);
						break;
					}
				}
				rt.endFor(f, 1);
				B = null;
				rt.forList(f, 1, rt.fv(f, "contents", live(W)), T("/obj/item/weapon/stock_parts"));
				while (($e = rt.next(f, 1)) !== undefined) {
					B = $e;
					if ((truthy(rt.op(f, "IsType", [], [live(B), live(_P)])) && truthy(rt.op(f, "IsType", [], [live(A), live(_P)])))) {
						if (rt.gt(rt.fv(f, "rating", live(B)), rt.fv(f, "rating", live(A)))) {
							yield* g.callName(f, live(W), "remove_from_storage", [live(B), live(f.src)]);
							yield* g.callName(f, live(W), "handle_item_insertion", [live(A), 1]);
							(rt.modSrcVar(f, "component_parts", live(A), subtract));
							rt.modSrcVar(f, "component_parts", live(B), add);
							rt.setFv(f, "loc", live(B), null);
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ replaced with ＀.</span>", [rt.fv(f, "name", live(A)), rt.fv(f, "name", live(B))])]);
							shouldplaysound = 1;
							break;
						}
					}
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "RefreshParts");
		} else {
			yield* g.srcCall(f, "display_parts", live(user));
		}
		if (truthy(live(shouldplaysound))) {
			yield* g.callName(f, live(W), "play_rped_sound", []);
		}
		return 1;
	}
	return 0;
}, true);

// /obj/machinery/proc/display_parts  (code/game/machinery/machinery.dm:441)
rt.def("/obj/machinery/proc/display_parts", function display_parts(f: Frame, user: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Following parts detected in the machine:</span>"]);
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ ＀</span>", [rt.call(f, P("/proc/bicon"), null, [live(C)]), rt.fv(f, "name", live(C))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/proc/examine  (code/game/machinery/machinery.dm:446)
rt.def("/obj/machinery/proc/examine", function examine(f: Frame) {
	let healthpercent: Value = null;
	let $0: any;
	f.vars = () => [healthpercent, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It looks broken and non functional.</span>"]);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 64))) {
		if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's on fire!</span>"]);
		}
		$0 = (healthpercent = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100));
		if (rt.inRange($0, 50, 99)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It looks slightly damaged."]);
		} else if (rt.inRange($0, 25, 50)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It appears heavily damaged."]);
		} else if (rt.inRange($0, 0, 25)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's falling apart!</span>"]);
		}
	}
	if (!(truthy(rt.fv(f, "research_scanner", live(f.args[0]))) && truthy(rt.sv(f, "component_parts")))) return f.dot;
	rt.callSrc(f, "display_parts", [live(f.args[0])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/proc/hiIsValidClient  (code/game/machinery/machinery.dm:476)
rt.def("/obj/machinery/proc/hiIsValidClient", function hiIsValidClient(f: Frame, hclient: Value, hi: Value) {
	if ((truthy(rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))) && (isEqual(rt.gv(f, "stat", rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))), 0) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))]))))) {
		if ((truthy((rt.istype(rt.gv(f, "mob", rt.fv(f, "client", live(hclient))), T("/mob/living/silicon/ai")) ? 1 : 0)) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))])))) {
			return 1;
		} else {
			return ((isEqual(rt.gv(f, "machine", rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))), live(f.src)) ? 1 : 0) && rt.callSrc(f, "Adjacent", [rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))]));
		}
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/machinery/proc/hiOnHide  (code/game/machinery/machinery.dm:484)  may sleep
rt.def("/obj/machinery/proc/hiOnHide", function* hiOnHide(f: Frame, hclient: Value) {
	f.vars = () => [hclient];
	if (!(truthy(rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))) && isEqual(rt.gv(f, "machine", rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))), live(f.src)))) return f.dot;
	yield* g.callName(f, rt.gv(f, "mob", rt.fv(f, "client", live(hclient))), "unset_machine", []);
	return f.dot;
}, true);

// /obj/machinery/proc/tesla_act  (code/game/machinery/machinery.dm:491)  may sleep
rt.def("/obj/machinery/proc/tesla_act", function* tesla_act(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.op(f, "Prob", [], [85])) && truthy(live(f.args[1])))) {
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, 1, null, 2, null, 4, "flame_range", 2, "adminlog", 0, "smoke", 0], rt.Args.Named);
	} else {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "emp_act", 2);
		} else {
			yield* g.srcCall(f, "ex_act", 2);
		}
	}
	return f.dot;
}, true, { args: ["power", "explosive"] });

// /obj/machinery/proc/Exited  (code/game/machinery/machinery.dm:500)
rt.def("/obj/machinery/proc/Exited", function Exited(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), rt.sv(f, "occupant"))) return f.dot;
	rt.setSv(f, "occupant", null);
	return f.dot;
}, false, { args: ["AM", "newloc"] });
