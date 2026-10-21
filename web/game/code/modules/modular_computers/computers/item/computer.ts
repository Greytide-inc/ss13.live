// From code/modules/modular_computers/computers/item/computer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9409, "/obj/item/device/modular_computer", "/obj/item/device", {
	enabled: 0,
	screen_on: 1,
	active_program: null,
	hardware_flag: 0,
	last_power_usage: 0,
	last_battery_percent: 0,
	last_world_time: "00:00",
	last_header_icons: null,
	emagged: 0,
	base_active_power_usage: 50,
	base_idle_power_usage: 5,
	icon_state_unpowered: null,
	icon_state_powered: null,
	icon_state_menu: "menu",
	max_hardware_size: 0,
	steel_sheet_cost: 5,
	all_components: null,
	idle_threads: null,
	physical: null,
	has_light: 0,
	light_on: 0,
	comp_light_luminosity: 3,
	comp_light_color: null,
	name: "modular microcomputer",
	desc: "A small portable microcomputer.",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "laptop-open",
	obj_integrity: 100,
	integrity_failure: 50,
	max_integrity: 100,
	armor: null,
});

// /obj/item/device/modular_computer/proc/<init>  (code/modules/modular_computers/computers/item/computer.dm:42)
rt.def("/obj/item/device/modular_computer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "all_components", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 20, "laser", 20, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/device/modular_computer/proc/Initialize  (code/modules/modular_computers/computers/item/computer.dm:53)  may sleep
rt.def("/obj/item/device/modular_computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	if (!truthy(rt.sv(f, "physical"))) {
		rt.setSv(f, "physical", live(f.src));
	}
	rt.setSv(f, "comp_light_color", "#FFFFFF");
	rt.setSv(f, "idle_threads", rt.list());
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/Destroy  (code/modules/modular_computers/computers/item/computer.dm:62)  may sleep
rt.def("/obj/item/device/modular_computer/proc/Destroy", function* Destroy(f: Frame) {
	let H: Value = null, CH: Value = null;
	let $e: any;
	f.vars = () => [H, CH, $e];
	yield* g.callSrc(f, "kill_program", ["forced", 1], rt.Args.Named);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	H = null;
	rt.forList(f, 0, rt.sv(f, "all_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (isEqual(rt.gv(f, "holder", (CH = rt.index(rt.sv(f, "all_components"), live(H)))), live(f.src))) {
			yield* g.callName(f, live(CH), "on_remove", [live(f.src)]);
			rt.setFv(f, "holder", live(CH), null);
			yield* g.callName(f, rt.sv(f, "all_components"), "Remove", [rt.fv(f, "device_type", live(CH))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(CH)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "physical", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/modular_computer/proc/add_verb  (code/modules/modular_computers/computers/item/computer.dm:76)
rt.def("/obj/item/device/modular_computer/proc/add_verb", function add_verb(f: Frame, path: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(path);
	if ($0 === "CARD") {
		rt.modSrcVar(f, "verbs", P("/obj/item/device/modular_computer/proc/eject_id"), add);
	} else if ($0 === "SDD") {
		rt.modSrcVar(f, "verbs", P("/obj/item/device/modular_computer/proc/eject_disk"), add);
	} else if ($0 === "AI") {
		rt.modSrcVar(f, "verbs", P("/obj/item/device/modular_computer/proc/eject_card"), add);
	}
	return f.dot;
});

// /obj/item/device/modular_computer/proc/remove_verb  (code/modules/modular_computers/computers/item/computer.dm:85)
rt.def("/obj/item/device/modular_computer/proc/remove_verb", function remove_verb(f: Frame, path: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(path);
	if ($0 === "CARD") {
		(rt.modSrcVar(f, "verbs", P("/obj/item/device/modular_computer/proc/eject_id"), subtract));
	} else if ($0 === "SDD") {
		(rt.modSrcVar(f, "verbs", P("/obj/item/device/modular_computer/proc/eject_disk"), subtract));
	} else if ($0 === "AI") {
		(rt.modSrcVar(f, "verbs", P("/obj/item/device/modular_computer/proc/eject_card"), subtract));
	}
	return f.dot;
});

// /obj/item/device/modular_computer/proc/eject_id  (code/modules/modular_computers/computers/item/computer.dm:99)  may sleep
rt.def("/obj/item/device/modular_computer/proc/eject_id", function* eject_id(f: Frame) {
	let card_slot: Value = null;
	f.vars = () => [card_slot];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	card_slot = rt.at(rt.sv(f, "all_components"), "CARD");
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) return f.dot;
	yield* g.callName(f, live(card_slot), "try_eject", [null, live(f.usr)]);
	return f.dot;
}, true, { verb: { name: "Eject ID", category: "Object", src: 1, range: 1 } });

// /obj/item/device/modular_computer/proc/eject_card  (code/modules/modular_computers/computers/item/computer.dm:110)  may sleep
rt.def("/obj/item/device/modular_computer/proc/eject_card", function* eject_card(f: Frame) {
	let ai_slot: Value = null;
	f.vars = () => [ai_slot];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	ai_slot = rt.at(rt.sv(f, "all_components"), "AI");
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) return f.dot;
	yield* g.callName(f, live(ai_slot), "try_eject", [null, live(f.usr), 1]);
	return f.dot;
}, true, { verb: { name: "Eject Intellicard", category: "Object" } });

// /obj/item/device/modular_computer/proc/eject_disk  (code/modules/modular_computers/computers/item/computer.dm:122)  may sleep
rt.def("/obj/item/device/modular_computer/proc/eject_disk", function* eject_disk(f: Frame) {
	let portable_drive: Value = null;
	f.vars = () => [portable_drive];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "uninstall_component", (portable_drive = rt.at(rt.sv(f, "all_components"), "SDD")), live(f.usr))))) return f.dot;
	yield* g.callName(f, live(portable_drive), "verb_pickup", []);
	return f.dot;
}, true, { verb: { name: "Eject Data Disk", category: "Object" } });

// /obj/item/device/modular_computer/proc/AltClick  (code/modules/modular_computers/computers/item/computer.dm:131)  may sleep
rt.def("/obj/item/device/modular_computer/proc/AltClick", function* AltClick(f: Frame) {
	let card_slot: Value = null, ai_slot: Value = null, portable_drive: Value = null;
	f.vars = () => [card_slot, ai_slot, portable_drive];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [live(f.src)])))) return f.dot;
	card_slot = rt.at(rt.sv(f, "all_components"), "CARD");
	ai_slot = rt.at(rt.sv(f, "all_components"), "AI");
	if (truthy((portable_drive = rt.at(rt.sv(f, "all_components"), "SDD")))) {
		if (truthy((yield* g.srcCall(f, "uninstall_component", live(portable_drive), live(f.args[0]))))) {
			yield* g.callName(f, live(portable_drive), "verb_pickup", []);
		}
	} else {
		if ((truthy(live(card_slot)) && truthy((yield* g.callName(f, live(card_slot), "try_eject", [null, live(f.args[0])]))))) {
			return live(f.dot);
		}
		if (!truthy(live(ai_slot))) return f.dot;
		yield* g.callName(f, live(ai_slot), "try_eject", [null, live(f.args[0])]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/modular_computer/proc/GetAccess  (code/modules/modular_computers/computers/item/computer.dm:152)
rt.def("/obj/item/device/modular_computer/proc/GetAccess", function GetAccess(f: Frame) {
	let card_slot: Value = null;
	f.vars = () => [card_slot];
	if (truthy((card_slot = rt.at(rt.sv(f, "all_components"), "CARD")))) {
		return rt.callName(f, live(card_slot), "GetAccess", []);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/item/device/modular_computer/proc/GetID  (code/modules/modular_computers/computers/item/computer.dm:158)
rt.def("/obj/item/device/modular_computer/proc/GetID", function GetID(f: Frame) {
	let card_slot: Value = null;
	f.vars = () => [card_slot];
	if (truthy((card_slot = rt.at(rt.sv(f, "all_components"), "CARD")))) {
		return rt.callName(f, live(card_slot), "GetID", []);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/item/device/modular_computer/proc/MouseDrop  (code/modules/modular_computers/computers/item/computer.dm:163)  may sleep
rt.def("/obj/item/device/modular_computer/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let M: Value = null;
	f.vars = () => [over_object, src_location, over_location, M];
	M = live(f.usr);
	if ((!truthy((rt.istype(live(over_object), T("/obj/screen")) ? 1 : 0)) && truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))))) {
		return (yield* g.srcCall(f, "attack_self", live(M)));
	}
	return live(f.dot);
}, true);

// /obj/item/device/modular_computer/proc/attack_ai  (code/modules/modular_computers/computers/item/computer.dm:169)  may sleep
rt.def("/obj/item/device/modular_computer/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_self", live(user)));
}, true);

// /obj/item/device/modular_computer/proc/attack_ghost  (code/modules/modular_computers/computers/item/computer.dm:173)  may sleep
rt.def("/obj/item/device/modular_computer/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let response: Value = null;
	f.vars = () => [user, response];
	if (truthy(rt.sv(f, "enabled"))) {
		yield* g.srcCall(f, "ui_interact", live(user));
	} else {
		if (!truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) return f.dot;
		if (!isEqual((response = (yield* g.call(f, P("/proc/alert"), null, [live(user), "This computer is turned off. Would you like to turn it on?", "Admin Override", "Yes", "No"]))), "Yes")) return f.dot;
		yield* g.srcCall(f, "turn_on", live(user));
	}
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/emag_act  (code/modules/modular_computers/computers/item/computer.dm:181)
rt.def("/obj/item/device/modular_computer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ was already emagged.</span>", [live(f.src)])]);
		return 0;
	} else {
		rt.setSv(f, "emagged", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You emag ％！. It's screen briefly shows a \"OVERRIDE ACCEPTED: New software downloads available.\" message.</span>", [live(f.src)])]);
		return 1;
	}
	return f.dot;
});

// /obj/item/device/modular_computer/proc/examine  (code/modules/modular_computers/computers/item/computer.dm:189)
rt.def("/obj/item/device/modular_computer/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.le(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>It is heavily damaged!</span>"]);
	} else {
		if (!rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) return f.dot;
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It is damaged.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/modular_computer/proc/update_icon  (code/modules/modular_computers/computers/item/computer.dm:196)
rt.def("/obj/item/device/modular_computer/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "enabled"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_unpowered"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_powered"));
		if (truthy(rt.sv(f, "active_program"))) {
			if (truthy(rt.fv(f, "program_icon_state", rt.sv(f, "active_program")))) {
				$0 = rt.fv(f, "program_icon_state", rt.sv(f, "active_program"));
			} else {
				$0 = rt.sv(f, "icon_state_menu");
			}
			rt.callSrc(f, "add_overlay", [$0]);
		} else {
			rt.callSrc(f, "add_overlay", [rt.sv(f, "icon_state_menu")]);
		}
	}
	if (!rt.le(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["bsod"]);
	rt.callSrc(f, "add_overlay", ["broken"]);
	return f.dot;
});

// /obj/item/device/modular_computer/proc/attack_self  (code/modules/modular_computers/computers/item/computer.dm:214)  may sleep
rt.def("/obj/item/device/modular_computer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "enabled"))) {
		yield* g.srcCall(f, "ui_interact", live(user));
	} else {
		yield* g.srcCall(f, "turn_on", live(user));
	}
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/turn_on  (code/modules/modular_computers/computers/item/computer.dm:219)  may sleep
rt.def("/obj/item/device/modular_computer/proc/turn_on", function* turn_on(f: Frame, user: Value) {
	let issynth: Value = null, recharger: Value = null;
	f.vars = () => [user, issynth, recharger];
	issynth = (rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0);
	if (rt.le(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) {
		if (truthy(live(issynth))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You send an activation signal to ％！, but it responds with an error code. It must be damaged.</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You press the power button, but the computer fails to boot up, displaying variety of errors before shutting down again.</span>"]);
		}
		return live(f.dot);
	}
	if (truthy((recharger = rt.at(rt.sv(f, "all_components"), "CHARGE")))) {
		rt.setFv(f, "enabled", live(recharger), 1);
	}
	if ((truthy(rt.at(rt.sv(f, "all_components"), "CPU")) && truthy((yield* g.srcCall(f, "use_power"))))) {
		if (truthy(live(issynth))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You send an activation signal to ％！, turning it on.</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You press the power button and start up ％！.</span>", [live(f.src)])]);
		}
		rt.setSv(f, "enabled", 1);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "ui_interact", live(user));
	} else {
		if (truthy(live(issynth))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You send an activation signal to ％！ but it does not respond.</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You press the power button but ％！ does not respond.</span>", [live(f.src)])]);
		}
	}
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/process  (code/modules/modular_computers/computers/item/computer.dm:248)  may sleep
rt.def("/obj/item/device/modular_computer/proc/process", function* process(f: Frame) {
	let I: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [I, _P, $e];
	if (!truthy(rt.sv(f, "enabled"))) {
		rt.setSv(f, "last_power_usage", 0);
		return 0;
	}
	if (rt.le(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) {
		yield* g.srcCall(f, "shutdown_computer");
		return 0;
	}
	if (((truthy(rt.sv(f, "active_program")) && truthy(rt.fv(f, "requires_ntnet", rt.sv(f, "active_program")))) && !truthy((yield* g.srcCall(f, "get_ntnet_status", rt.fv(f, "requires_ntnet_feature", rt.sv(f, "active_program"))))))) {
		yield* g.callName(f, rt.sv(f, "active_program"), "event_networkfailure", [0]);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "idle_threads"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((truthy(rt.gv(f, "requires_ntnet", (_P = live(I)))) && !truthy((yield* g.srcCall(f, "get_ntnet_status", rt.fv(f, "requires_ntnet_feature", live(_P))))))) {
			yield* g.callName(f, live(_P), "event_networkfailure", [1]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "active_program"))) {
		if (!isEqual(rt.fv(f, "program_state", rt.sv(f, "active_program")), 0)) {
			yield* g.callName(f, rt.sv(f, "active_program"), "process_tick", []);
			rt.setFv(f, "ntnet_status", rt.sv(f, "active_program"), (yield* g.srcCall(f, "get_ntnet_status")));
		} else {
			rt.setSv(f, "active_program", null);
		}
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "idle_threads"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!isEqual(rt.gv(f, "program_state", (_P = live(I))), 0)) {
			yield* g.callName(f, live(_P), "process_tick", []);
			rt.setFv(f, "ntnet_status", live(_P), (yield* g.srcCall(f, "get_ntnet_status")));
		} else {
			yield* g.callName(f, rt.sv(f, "idle_threads"), "Remove", [live(_P)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "handle_power");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/modular_computer/proc/get_header_data  (code/modules/modular_computers/computers/item/computer.dm:284)
rt.def("/obj/item/device/modular_computer/proc/get_header_data", function get_header_data(f: Frame) {
	let data: Value = null, battery_module: Value = null, recharger: Value = null, program_headers: Value = null, I: Value = null, _P: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, battery_module, recharger, program_headers, I, _P, $0, $1, $2, $e];
	data = rt.list();
	battery_module = rt.at(rt.sv(f, "all_components"), "CELL");
	recharger = rt.at(rt.sv(f, "all_components"), "CHARGE");
	if ((truthy(live(battery_module)) && truthy(rt.fv(f, "battery", live(battery_module))))) {
		$0 = rt.callName(f, rt.fv(f, "battery", live(battery_module)), "percent", []);
		if (rt.inRange($0, 80, 200)) {
			rt.setAt(live(data), "PC_batteryicon", "batt_100.gif");
		} else if (rt.inRange($0, 60, 80)) {
			rt.setAt(live(data), "PC_batteryicon", "batt_80.gif");
		} else if (rt.inRange($0, 40, 60)) {
			rt.setAt(live(data), "PC_batteryicon", "batt_60.gif");
		} else if (rt.inRange($0, 20, 40)) {
			rt.setAt(live(data), "PC_batteryicon", "batt_40.gif");
		} else if (rt.inRange($0, 5, 20)) {
			rt.setAt(live(data), "PC_batteryicon", "batt_20.gif");
		} else {
			rt.setAt(live(data), "PC_batteryicon", "batt_5.gif");
		}
		rt.setAt(live(data), "PC_batterypercent", fmt("＀ %", [rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.fv(f, "battery", live(battery_module)), "percent", [])])]));
		rt.setAt(live(data), "PC_showbatteryicon", 1);
	} else {
		rt.setAt(live(data), "PC_batteryicon", "batt_5.gif");
		rt.setAt(live(data), "PC_batterypercent", "N/C");
		$0 = live(data);
		$1 = "PC_showbatteryicon";
		if (truthy(live(battery_module))) {
			$2 = 1;
		} else {
			$2 = 0;
		}
		rt.setAt($0, $1, $2);
	}
	if ((((truthy(live(recharger)) && truthy(rt.fv(f, "enabled", live(recharger)))) && truthy(rt.callName(f, live(recharger), "check_functionality", []))) && truthy(rt.callName(f, live(recharger), "use_power", [0])))) {
		rt.setAt(live(data), "PC_apclinkicon", "charging.gif");
	}
	$0 = rt.callSrc(f, "get_ntnet_status", []);
	if ($0 === 0) {
		rt.setAt(live(data), "PC_ntneticon", "sig_none.gif");
	} else if ($0 === 1) {
		rt.setAt(live(data), "PC_ntneticon", "sig_low.gif");
	} else if ($0 === 2) {
		rt.setAt(live(data), "PC_ntneticon", "sig_high.gif");
	} else if ($0 === 3) {
		rt.setAt(live(data), "PC_ntneticon", "sig_lan.gif");
	}
	if (truthy(rt.len(f, rt.sv(f, "idle_threads")))) {
		program_headers = rt.list();
		I = null;
		rt.forList(f, 0, rt.sv(f, "idle_threads"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (!truthy(rt.gv(f, "ui_header", (_P = live(I))))) {
				continue;
			}
			rt.callName(f, live(program_headers), "Add", [rt.list(rt.alist(f, ["icon", rt.fv(f, "ui_header", live(_P))]))]);
		}
		rt.endFor(f, 0);
		rt.setAt(live(data), "PC_programheaders", live(program_headers));
	}
	rt.setAt(live(data), "PC_stationtime", rt.call(f, P("/proc/worldtime2text"), null, []));
	rt.setAt(live(data), "PC_hasheader", 1);
	$0 = live(data);
	$1 = "PC_showexitprogram";
	if (truthy(rt.sv(f, "active_program"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	return live(data);
});

// /obj/item/device/modular_computer/proc/kill_program  (code/modules/modular_computers/computers/item/computer.dm:343)  may sleep
rt.def("/obj/item/device/modular_computer/proc/kill_program", function* kill_program(f: Frame, forced: Value) {
	let user: Value = null;
	f.vars = () => [forced, user];
	if (live(forced) === null) {
		forced = 0;
	}
	if (truthy(rt.sv(f, "active_program"))) {
		yield* g.callName(f, rt.sv(f, "active_program"), "kill_program", [live(forced)]);
		rt.setSv(f, "active_program", null);
	}
	if ((truthy((user = live(f.usr))) && truthy((rt.istype(live(user), T("/mob")) ? 1 : 0)))) {
		yield* g.srcCall(f, "ui_interact", live(user));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/get_ntnet_status  (code/modules/modular_computers/computers/item/computer.dm:353)
rt.def("/obj/item/device/modular_computer/proc/get_ntnet_status", function get_ntnet_status(f: Frame, specific_action: Value) {
	let network_card: Value = null;
	f.vars = () => [specific_action, network_card];
	if (live(specific_action) === null) {
		specific_action = 0;
	}
	if (truthy((network_card = rt.at(rt.sv(f, "all_components"), "NET")))) {
		return rt.callName(f, live(network_card), "get_signal", [live(specific_action)]);
	}
	return 0;
});

// /obj/item/device/modular_computer/proc/add_log  (code/modules/modular_computers/computers/item/computer.dm:359)
rt.def("/obj/item/device/modular_computer/proc/add_log", function add_log(f: Frame, text: Value) {
	let network_card: Value = null;
	f.vars = () => [network_card];
	if (!truthy(rt.callSrc(f, "get_ntnet_status", []))) {
		return 0;
	}
	network_card = rt.at(rt.sv(f, "all_components"), "NET");
	return rt.callName(f, rt.gl("ntnet_global"), "add_log", [live(text), live(network_card)]);
});

// /obj/item/device/modular_computer/proc/shutdown_computer  (code/modules/modular_computers/computers/item/computer.dm:365)  may sleep
rt.def("/obj/item/device/modular_computer/proc/shutdown_computer", function* shutdown_computer(f: Frame, loud: Value) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [loud, _P, $e];
	if (live(loud) === null) {
		loud = 1;
	}
	yield* g.callSrc(f, "kill_program", ["forced", 1], rt.Args.Named);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "idle_threads"), T("/datum/computer_file/program"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		yield* g.callName(f, live(_P), "kill_program", ["forced", 1], rt.Args.Named);
		yield* g.callName(f, rt.sv(f, "idle_threads"), "Remove", [live(_P)]);
	}
	rt.endFor(f, 0);
	if (truthy(live(loud))) {
		yield* g.callName(f, rt.sv(f, "physical"), "visible_message", [fmt("<span class='notice'>＄！ shuts down.</span>", [live(f.src)])]);
	}
	rt.setSv(f, "enabled", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/attackby  (code/modules/modular_computers/computers/item/computer.dm:377)  may sleep
rt.def("/obj/item/device/modular_computer/proc/attackby", function* attackby(f: Frame) {
	let h: Value = null, H: Value = null, WT: Value = null, dmg: Value = null, component_names: Value = null, h_1: Value = null, H_2: Value = null, choice: Value = null;
	let $e: any;
	f.vars = () => [h, H, WT, dmg, component_names, h_1, H_2, choice, $e];
	h = null;
	rt.forList(f, 0, rt.sv(f, "all_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		h = $e;
		if (truthy((yield* g.callName(f, (H = rt.index(rt.sv(f, "all_components"), live(h))), "try_insert", [live(f.args[0]), live(f.args[1])])))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/computer_hardware")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "install_component", live(f.args[0]), live(f.args[1]))))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.len(f, rt.sv(f, "all_components")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Remove all components from ％！ before disassembling it.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0), rt.sv(f, "steel_sheet_cost")]);
		yield* g.callName(f, rt.sv(f, "physical"), "visible_message", [fmt("＄！ has been disassembled by ＀.", [live(f.src), live(f.args[1])])]);
		yield* g.srcCall(f, "relay_qdel");
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "isOn", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is off.</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		if (isEqual(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ does not require repairs.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing damage to ％！...</span>", [live(f.src)])]);
		dmg = (yield* g.call(f, P("/proc/round"), null, [subtract(rt.sv(f, "max_integrity"), rt.sv(f, "obj_integrity"))]));
		if ((truthy((yield* g.callName(f, live(WT), "remove_fuel", [(yield* g.call(f, P("/proc/round"), null, [divide(live(dmg), 75)]))]))) && truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.usr), divide(live(dmg), 10)]))))) {
			rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ％！.</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (!truthy(rt.len(f, rt.sv(f, "all_components")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This device doesn't have any components installed.</span>"]);
			return live(f.dot);
		}
		component_names = rt.list();
		h_1 = null;
		rt.forList(f, 0, rt.sv(f, "all_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			h_1 = $e;
			H_2 = rt.index(rt.sv(f, "all_components"), live(h_1));
			yield* g.callName(f, live(component_names), "Add", [rt.fv(f, "name", live(H_2))]);
		}
		rt.endFor(f, 0);
		if (!truthy((choice = (yield* g.op(f, "Prompt", [1], [null, "Computer maintenance", "Which component do you want to uninstall?", live(f.args[1]), live(component_names)]))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[1]))))) {
			return live(f.dot);
		}
		if (!truthy((H_2 = (yield* g.srcCall(f, "find_hardware_by_name", live(choice)))))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "uninstall_component", live(H_2), live(f.args[1]));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user"] });

// /obj/item/device/modular_computer/proc/Adjacent  (code/modules/modular_computers/computers/item/computer.dm:447)
rt.def("/obj/item/device/modular_computer/proc/Adjacent", function Adjacent(f: Frame) {
	if ((truthy(rt.sv(f, "physical")) && !isEqual(rt.sv(f, "physical"), live(f.src)))) {
		return rt.callName(f, rt.sv(f, "physical"), "Adjacent", [live(f.args[0])]);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["neighbor"] });
