// From code/game/objects/items/robot/robot_upgrades.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9824, "/obj/item/borg/upgrade", "/obj/item/borg", {
	locked: 0,
	installed: 0,
	require_module: 0,
	module_type: null,
	one_use: 0,
	origin_tech: "programming=2",
	name: "borg upgrade module.",
	desc: "Protected by FRM.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "cyborg_upgrade",
});

// /obj/item/borg/upgrade/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:19)
rt.def("/obj/item/borg/upgrade/proc/action", function action(f: Frame, R: Value) {
	if (isEqual(rt.fv(f, "stat", live(R)), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＀ will not function on a deceased cyborg.</span>", [live(f.src)])]);
		return 1;
	}
	if (!(truthy(rt.sv(f, "module_type")) && !truthy(rt.op(f, "IsType", [], [rt.fv(f, "module", live(R)), rt.sv(f, "module_type")])))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(R), "Upgrade mounting error!  No suitable hardpoint detected!"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "There's no mounting point for the module!"]);
	return 1;
});

rt.type(9825, "/obj/item/borg/upgrade/rename", "/obj/item/borg/upgrade", {
	heldname: "",
	one_use: 1,
	name: "cyborg reclassification board",
	desc: "Used to rename a cyborg.",
	icon_state: "cyborg_upgrade1",
});

// /obj/item/borg/upgrade/rename/proc/attack_self  (code/game/objects/items/robot/robot_upgrades.dm:35)  may sleep
rt.def("/obj/item/borg/upgrade/rename/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "heldname", (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Enter new robot name", "Cyborg Reclassification", rt.sv(f, "heldname"), 42])));
	return f.dot;
}, true);

// /obj/item/borg/upgrade/rename/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:38)
rt.def("/obj/item/borg/upgrade/rename/proc/action", function action(f: Frame) {
	let oldname: Value = null;
	f.vars = () => [oldname];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	oldname = rt.fv(f, "real_name", live(f.args[0]));
	rt.setFv(f, "custom_name", live(f.args[0]), rt.sv(f, "heldname"));
	rt.callName(f, live(f.args[0]), "updatename", []);
	if (isEqual(live(oldname), rt.fv(f, "real_name", live(f.args[0])))) {
		rt.callName(f, live(f.args[0]), "notify_ai", [3, live(oldname), rt.fv(f, "real_name", live(f.args[0]))]);
	}
	return 1;
}, false, { args: ["R"] });

rt.type(9826, "/obj/item/borg/upgrade/restart", "/obj/item/borg/upgrade", {
	one_use: 1,
	name: "cyborg emergency reboot module",
	desc: "Used to force a reboot of a disabled-but-repaired cyborg, bringing it back online.",
	icon_state: "cyborg_upgrade1",
});

// /obj/item/borg/upgrade/restart/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:58)  may sleep
rt.def("/obj/item/borg/upgrade/restart/proc/action", function* action(f: Frame, R: Value) {
	f.vars = () => [R];
	if (rt.lt(rt.fv(f, "health", live(R)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You have to repair the cyborg before using this module!</span>"]);
		return 0;
	}
	if (truthy(rt.fv(f, "mind", live(R)))) {
		yield* g.callName(f, rt.fv(f, "mind", live(R)), "grab_ghost", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/voice/liveagain.ogg"), 75, 1]);
	}
	yield* g.callName(f, live(R), "revive", []);
	return 1;
}, true);

rt.type(9827, "/obj/item/borg/upgrade/vtec", "/obj/item/borg/upgrade", {
	require_module: 1,
	origin_tech: "engineering=4;materials=5;programming=4",
	name: "cyborg VTEC module",
	desc: "Used to kick in a cyborg's VTEC systems, increasing their speed.",
	icon_state: "cyborg_upgrade2",
});

// /obj/item/borg/upgrade/vtec/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:78)
rt.def("/obj/item/borg/upgrade/vtec/proc/action", function action(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "speed", live(f.args[0])), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>A VTEC unit is already installed!</span>"]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>There's no room for another VTEC unit!</span>"]);
		return live(f.dot);
	}
	rt.setFv(f, "speed", live(f.args[0]), -2);
	return 1;
}, false, { args: ["R"] });

rt.type(9828, "/obj/item/borg/upgrade/disablercooler", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/security"),
	origin_tech: "engineering=4;powerstorage=4;combat=4",
	name: "cyborg rapid disabler cooling module",
	desc: "Used to cool a mounted disabler, increasing the potential current in it and thus its recharge rate.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/disablercooler/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:98)
rt.def("/obj/item/borg/upgrade/disablercooler/proc/action", function action(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (!truthy((_T = rt.locateIn(f, T("/obj/item/weapon/gun/energy/disabler/cyborg"), rt.gv(f, "modules", rt.fv(f, "module", live(f.args[0]))))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>There's no disabler in this unit!</span>"]);
		return live(f.dot);
	}
	if (rt.le(rt.fv(f, "charge_delay", live(_T)), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>A cooling unit is already installed!</span>"]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>There's no room for another cooling unit!</span>"]);
		return live(f.dot);
	}
	rt.setFv(f, "charge_delay", live(_T), rt.call(f, P("/proc/max"), null, [2, subtract(rt.fv(f, "charge_delay", live(_T)), 4)]));
	return 1;
}, false, { args: ["R"] });

rt.type(9829, "/obj/item/borg/upgrade/thrusters", "/obj/item/borg/upgrade", {
	origin_tech: "engineering=4;powerstorage=4",
	name: "ion thruster upgrade",
	desc: "A energy-operated thruster system for cyborgs.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/thrusters/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:121)
rt.def("/obj/item/borg/upgrade/thrusters/proc/action", function action(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "ionpulse", live(f.args[0])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>This unit already has ion thrusters installed!</span>"]);
		return live(f.dot);
	}
	rt.setFv(f, "ionpulse", live(f.args[0]), 1);
	return 1;
}, false, { args: ["R"] });

rt.type(9830, "/obj/item/borg/upgrade/ddrill", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	origin_tech: "engineering=4;materials=5",
	name: "mining cyborg diamond drill",
	desc: "A diamond drill replacement for the mining module's standard drill.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/ddrill/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:140)  may sleep
rt.def("/obj/item/borg/upgrade/ddrill/proc/action", function* action(f: Frame) {
	let D: Value = null, S: Value = null, DD: Value = null;
	let $e: any;
	f.vars = () => [D, S, DD, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	D = null;
	rt.forList(f, 0, rt.fv(f, "module", live(f.args[0])), T("/obj/item/weapon/pickaxe/drill/cyborg"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.callName(f, rt.fv(f, "module", live(f.args[0])), "remove_module", [live(D), 1]);
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, rt.fv(f, "module", live(f.args[0])), T("/obj/item/weapon/shovel"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.callName(f, rt.fv(f, "module", live(f.args[0])), "remove_module", [live(S), 1]);
	}
	rt.endFor(f, 0);
	DD = (yield* g.new_(f, T("/obj/item/weapon/pickaxe/drill/cyborg/diamond"), [rt.fv(f, "module", live(f.args[0]))]));
	rt.modField(f, rt.fv(f, "module", live(f.args[0])), "basic_modules", live(DD), add);
	yield* g.callName(f, rt.fv(f, "module", live(f.args[0])), "add_module", [live(DD), 0, 1]);
	return 1;
}, true, { args: ["R"] });

rt.type(9831, "/obj/item/borg/upgrade/soh", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	origin_tech: "engineering=4;materials=4;bluespace=4",
	name: "mining cyborg satchel of holding",
	desc: "A satchel of holding replacement for mining cyborg's ore satchel module.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/soh/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:162)  may sleep
rt.def("/obj/item/borg/upgrade/soh/proc/action", function* action(f: Frame) {
	let S: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [S, H, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	S = null;
	rt.forList(f, 0, rt.fv(f, "module", live(f.args[0])), T("/obj/item/weapon/storage/bag/ore/cyborg"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.callName(f, rt.fv(f, "module", live(f.args[0])), "remove_module", [live(S), 1]);
	}
	rt.endFor(f, 0);
	H = (yield* g.new_(f, T("/obj/item/weapon/storage/bag/ore/holding"), [rt.fv(f, "module", live(f.args[0]))]));
	rt.modField(f, rt.fv(f, "module", live(f.args[0])), "basic_modules", live(H), add);
	yield* g.callName(f, rt.fv(f, "module", live(f.args[0])), "add_module", [live(H), 0, 1]);
	return 1;
}, true, { args: ["R"] });

rt.type(9832, "/obj/item/borg/upgrade/syndicate", "/obj/item/borg/upgrade", {
	require_module: 1,
	origin_tech: "combat=4;syndicate=1",
	name: "illegal equipment module",
	desc: "Unlocks the hidden, deadlier functions of a cyborg",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/syndicate/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:181)  may sleep
rt.def("/obj/item/borg/upgrade/syndicate/proc/action", function* action(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "emagged", live(f.args[0])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "SetEmagged", [1]);
	return 1;
}, true, { args: ["R"] });

rt.type(9833, "/obj/item/borg/upgrade/lavaproof", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	origin_tech: "engineering=4;materials=4;plasmatech=4",
	name: "mining cyborg lavaproof tracks",
	desc: "An upgrade kit to apply specialized coolant systems and insulation layers to mining cyborg tracks, enabling them to withstand exposure to molten rock.",
	icon_state: "ash_plating",
	resistance_flags: 3,
});

// /obj/item/borg/upgrade/lavaproof/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:201)
rt.def("/obj/item/borg/upgrade/lavaproof/proc/action", function action(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.modField(f, live(f.args[0]), "weather_immunities", "lava", add);
	return 1;
}, false, { args: ["R"] });

rt.type(9834, "/obj/item/borg/upgrade/selfrepair", "/obj/item/borg/upgrade", {
	repair_amount: -1,
	repair_tick: 1,
	msg_cooldown: 0,
	on: 0,
	powercost: 10,
	cyborg: null,
	toggle_action: null,
	require_module: 1,
	name: "self-repair module",
	desc: "This module will repair the cyborg over time.",
	icon_state: "cyborg_upgrade5",
});

// /obj/item/borg/upgrade/selfrepair/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:220)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/action", function* action(f: Frame) {
	let U: Value = null;
	f.vars = () => [U];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((U = rt.locateIn(f, T("/obj/item/borg/upgrade/selfrepair"), live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This unit is already equipped with a self-repair module.</span>"]);
		return 0;
	}
	rt.setSv(f, "cyborg", live(f.args[0]));
	rt.setSv(f, "icon_state", "selfrepair_off");
	rt.setSv(f, "toggle_action", (yield* g.new_(f, T("/datum/action/item_action/toggle"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "toggle_action"), "Grant", [live(f.args[0])]);
	return 1;
}, true, { args: ["R"] });

// /obj/item/borg/upgrade/selfrepair/proc/dropped  (code/game/objects/items/robot/robot_upgrades.dm:235)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/dropped", function* dropped(f: Frame) {
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/borg/upgrade/selfrepair/proc/check_dropped")])), 1]);
	return f.dot;
}, true);

// /obj/item/borg/upgrade/selfrepair/proc/check_dropped  (code/game/objects/items/robot/robot_upgrades.dm:238)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/check_dropped", function* check_dropped(f: Frame) {
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "cyborg"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "toggle_action"), "Remove", [rt.sv(f, "cyborg")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "toggle_action")]);
	rt.setSv(f, "toggle_action", null);
	rt.setSv(f, "cyborg", null);
	yield* g.srcCall(f, "deactivate");
	return f.dot;
}, true);

// /obj/item/borg/upgrade/selfrepair/proc/ui_action_click  (code/game/objects/items/robot/robot_upgrades.dm:245)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/ui_action_click", function* ui_action_click(f: Frame) {
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	if (truthy(rt.sv(f, "on"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "cyborg"), "<span class='notice'>You activate the self-repair module.</span>"]);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "cyborg"), "<span class='notice'>You deactivate the self-repair module.</span>"]);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/borg/upgrade/selfrepair/proc/update_icon  (code/game/objects/items/robot/robot_upgrades.dm:256)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	let $0: any, $e: any;
	f.vars = () => [X, A, $0, $e];
	if (truthy(rt.sv(f, "cyborg"))) {
		if (truthy(rt.sv(f, "on"))) {
			$0 = "on";
		} else {
			$0 = "off";
		}
		rt.setSv(f, "icon_state", fmt("selfrepair_＀", [$0]));
		X = null;
		rt.forList(f, 0, rt.sv(f, "actions"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
		}
		rt.endFor(f, 0);
	} else {
		rt.setSv(f, "icon_state", "cyborg_upgrade5");
	}
	return f.dot;
}, true);

// /obj/item/borg/upgrade/selfrepair/proc/deactivate  (code/game/objects/items/robot/robot_upgrades.dm:264)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/deactivate", function* deactivate(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.setSv(f, "on", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/borg/upgrade/selfrepair/proc/process  (code/game/objects/items/robot/robot_upgrades.dm:269)  may sleep
rt.def("/obj/item/borg/upgrade/selfrepair/proc/process", function* process(f: Frame) {
	let msgmode: Value = null;
	f.vars = () => [msgmode];
	if (!truthy(rt.sv(f, "repair_tick"))) {
		rt.setSv(f, "repair_tick", 1);
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "cyborg")) && !isEqual(rt.fv(f, "stat", rt.sv(f, "cyborg")), 2)) && truthy(rt.sv(f, "on")))) {
		if (!truthy(rt.fv(f, "cell", rt.sv(f, "cyborg")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "cyborg"), "<span class='warning'>Self-repair module deactivated. Please, insert the power cell.</span>"]);
			yield* g.srcCall(f, "deactivate");
			return live(f.dot);
		}
		if (rt.lt(rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "cyborg"))), multiply(rt.sv(f, "powercost"), 2))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "cyborg"), "<span class='warning'>Self-repair module deactivated. Please recharge.</span>"]);
			yield* g.srcCall(f, "deactivate");
			return live(f.dot);
		}
		if (rt.lt(rt.fv(f, "health", rt.sv(f, "cyborg")), rt.fv(f, "maxHealth", rt.sv(f, "cyborg")))) {
			if (rt.lt(rt.fv(f, "health", rt.sv(f, "cyborg")), 0)) {
				rt.setSv(f, "repair_amount", -2.5);
				rt.setSv(f, "powercost", 30);
			} else {
				rt.setSv(f, "repair_amount", -1);
				rt.setSv(f, "powercost", 10);
			}
			yield* g.callName(f, rt.sv(f, "cyborg"), "adjustBruteLoss", [rt.sv(f, "repair_amount")]);
			yield* g.callName(f, rt.sv(f, "cyborg"), "adjustFireLoss", [rt.sv(f, "repair_amount")]);
			yield* g.callName(f, rt.sv(f, "cyborg"), "updatehealth", []);
			yield* g.callName(f, rt.fv(f, "cell", rt.sv(f, "cyborg")), "use", [rt.sv(f, "powercost")]);
		} else {
			yield* g.callName(f, rt.fv(f, "cell", rt.sv(f, "cyborg")), "use", [5]);
		}
		rt.setSv(f, "repair_tick", 0);
		if (rt.gt(subtract(rt.worldTime(f), 2000), rt.sv(f, "msg_cooldown"))) {
			msgmode = "standby";
			if (rt.lt(rt.fv(f, "health", rt.sv(f, "cyborg")), 0)) {
				msgmode = "critical";
			} else {
				if (rt.lt(rt.fv(f, "health", rt.sv(f, "cyborg")), rt.fv(f, "maxHealth", rt.sv(f, "cyborg")))) {
					msgmode = "normal";
				}
			}
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "cyborg"), fmt("<span class='notice'>Self-repair is active in <span class='boldnotice'>＀</span> mode.</span>", [live(msgmode)])]);
			rt.setSv(f, "msg_cooldown", rt.worldTime(f));
		}
	} else {
		yield* g.srcCall(f, "deactivate");
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(9835, "/obj/item/borg/upgrade/hypospray", "/obj/item/borg/upgrade", {
	additional_reagents: null,
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/medical"),
	origin_tech: null,
	name: "medical cyborg hypospray advanced synthesiser",
	desc: "An upgrade to the Medical module cyborg's hypospray, allowing it to produce more advanced and complex medical reagents.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/hypospray/proc/<init>  (code/game/objects/items/robot/robot_upgrades.dm:318)
rt.def("/obj/item/borg/upgrade/hypospray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "additional_reagents", rt.list());
	return f.dot;
});

// /obj/item/borg/upgrade/hypospray/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:321)  may sleep
rt.def("/obj/item/borg/upgrade/hypospray/proc/action", function* action(f: Frame) {
	let H: Value = null, re: Value = null;
	let $e: any;
	f.vars = () => [H, re, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	H = null;
	rt.forList(f, 0, rt.fv(f, "module", live(f.args[0])), T("/obj/item/weapon/reagent_containers/borghypo"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy(rt.fv(f, "accepts_reagent_upgrades", live(H)))) {
			re = null;
			rt.forList(f, 1, rt.sv(f, "additional_reagents"));
			while (($e = rt.next(f, 1)) !== undefined) {
				re = $e;
				yield* g.callName(f, live(H), "add_reagent", [live(re)]);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true, { args: ["R"] });

rt.type(9838, "/obj/item/borg/upgrade/piercing_hypospray", "/obj/item/borg/upgrade", {
	origin_tech: "materials=5;engineering=7;combat=3",
	name: "cyborg piercing hypospray",
	desc: "An upgrade to a cyborg's hypospray, allowing it to pierce armor and thick material.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/piercing_hypospray/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:354)
rt.def("/obj/item/borg/upgrade/piercing_hypospray/proc/action", function action(f: Frame) {
	let found_hypo: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [found_hypo, H, $e];
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	found_hypo = 0;
	H = null;
	rt.forList(f, 0, rt.fv(f, "module", live(f.args[0])), T("/obj/item/weapon/reagent_containers/borghypo"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		rt.setFv(f, "bypass_protection", live(H), 1);
		found_hypo = 1;
	}
	rt.endFor(f, 0);
	if (!truthy(live(found_hypo))) {
		return live(f.dot);
	}
	return 1;
}, false, { args: ["R"] });

rt.type(9839, "/obj/item/borg/upgrade/defib", "/obj/item/borg/upgrade", {
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/medical"),
	origin_tech: "programming=4;engineering=6;materials=5;powerstorage=5;biotech=5",
	name: "medical cyborg defibrillator",
	desc: "An upgrade to the Medical module, installing a builtin defibrillator, for on the scene revival.",
	icon_state: "cyborg_upgrade3",
});

// /obj/item/borg/upgrade/defib/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:377)  may sleep
rt.def("/obj/item/borg/upgrade/defib/proc/action", function* action(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	S = (yield* g.new_(f, T("/obj/item/weapon/twohanded/shockpaddles/cyborg"), [rt.fv(f, "module", live(f.args[0]))]));
	rt.modField(f, rt.fv(f, "module", live(f.args[0])), "basic_modules", live(S), add);
	yield* g.callName(f, rt.fv(f, "module", live(f.args[0])), "add_module", [live(S), 0, 1]);
	return 1;
}, true, { args: ["R"] });

rt.type(9840, "/obj/item/borg/upgrade/ai", "/obj/item/borg/upgrade", {
	origin_tech: "engineering=4;magnets=4;programming=4",
	name: "B.O.R.I.S. module",
	desc: "Bluespace Optimized Remote Intelligence Synchronization. An uplink device which takes the place of an MMI in cyborg endoskeletons, creating a robotic shell controlled by an AI.",
	icon_state: "boris",
});

// /obj/item/borg/upgrade/ai/proc/action  (code/game/objects/items/robot/robot_upgrades.dm:393)  may sleep
rt.def("/obj/item/borg/upgrade/ai/proc/action", function* action(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "shell", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This unit is already an AI shell!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "key", live(f.args[0])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>Intelligence patterns detected in this ＀. Aborting.</span>", [rt.fv(f, "braintype", live(f.args[0]))])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "make_shell", [live(f.src)]);
	return 1;
}, true, { args: ["R"] });
