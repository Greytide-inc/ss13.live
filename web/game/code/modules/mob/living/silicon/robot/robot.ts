// From code/modules/mob/living/silicon/robot/robot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4835, "/mob/living/silicon/robot", "/mob/living/silicon", {
	custom_name: "",
	braintype: "Cyborg",
	robot_suit: null,
	mmi: null,
	shell: 0,
	deployed: 0,
	mainframe: null,
	undeployment_action: null,
	inv1: null,
	inv2: null,
	inv3: null,
	lamp_button: null,
	thruster_button: null,
	hands: null,
	shown_robot_modules: 0,
	robot_modules_background: null,
	module: null,
	module_active: null,
	eye_lights: null,
	connected_ai: null,
	cell: null,
	camera: null,
	opened: 0,
	emagged: 0,
	emag_cooldown: 0,
	wiresexposed: 0,
	ident: 0,
	locked: 1,
	alarms: null,
	speed: 0,
	magpulse: 0,
	ionpulse: 0,
	ionpulse_on: 0,
	ion_trail: null,
	low_power_mode: 0,
	spark_system: null,
	lawupdate: 1,
	scrambledcodes: 0,
	lockcharge: null,
	toner: 0,
	tonermax: 40,
	lamp_max: 10,
	lamp_intensity: 0,
	lamp_recharging: 0,
	sight_mode: 0,
	updating: 0,
	upgrades: null,
	hat: null,
	hat_offset: -3,
	req_access: null,
	equippable_hats: null,
	hud_possible: null,
	can_buckle: 1,
	buckle_lying: 0,
	name: "Cyborg",
	real_name: "Cyborg",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "robot",
	maxHealth: 100,
	health: 100,
	macro_default: "robot-default",
	macro_hotkeys: "robot-hotkeys",
	bubble_icon: "robot",
	designation: "Default",
	has_limbs: 1,
	held_items: null,
	can_ride_typecache: null,
});

// /mob/living/silicon/robot/proc/<init>  (code/modules/mob/living/silicon/robot/robot.dm:22)  may sleep
rt.def("/mob/living/silicon/robot/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "undeployment_action", (yield* g.new_(f, T("/datum/action/innate/undeployment"), [])));
	$0 = $0;
	rt.setSv(f, "alarms", rt.alist(f, ["Motion", rt.list(), "Fire", rt.list(), "Atmosphere", rt.list(), "Power", rt.list(), "Camera", rt.list(), "Burglar", rt.list()]));
	rt.setSv(f, "hud_possible", rt.list("15", "8", "9", "10", "13"));
	$0 = $0;
	rt.setSv(f, "upgrades", rt.list());
	$0 = $0;
	rt.setSv(f, "held_items", rt.list(null, null, null));
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(29));
	$0 = $0;
	rt.setSv(f, "equippable_hats", rt.list(T("/obj/item/clothing/head/caphat"), T("/obj/item/clothing/head/hardhat/cakehat"), T("/obj/item/clothing/head/centhat"), T("/obj/item/clothing/head/HoS"), T("/obj/item/clothing/head/hopcap"), T("/obj/item/clothing/head/wizard"), T("/obj/item/clothing/head/nursehat"), T("/obj/item/clothing/head/sombrero"), T("/obj/item/clothing/head/witchunter_hat")));
	$0 = $0;
	rt.setSv(f, "can_ride_typecache", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/Initialize  (code/modules/mob/living/silicon/robot/robot.dm:104)  may sleep
rt.def("/mob/living/silicon/robot/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/robot"), [live(f.src)])));
	rt.setSv(f, "robot_modules_background", (yield* g.new_(f, T("/obj/screen"), [])));
	rt.setFv(f, "icon_state", rt.sv(f, "robot_modules_background"), "block");
	rt.setFv(f, "layer", rt.sv(f, "robot_modules_background"), 19);
	rt.setFv(f, "plane", rt.sv(f, "robot_modules_background"), 19);
	rt.setSv(f, "ident", (yield* g.call(f, P("/proc/rand"), null, [1, 999])));
	if (!truthy(rt.sv(f, "cell"))) {
		rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
		rt.setFv(f, "maxcharge", rt.sv(f, "cell"), 7500);
		rt.setFv(f, "charge", rt.sv(f, "cell"), 7500);
	}
	if (truthy(rt.sv(f, "lawupdate"))) {
		yield* g.srcCall(f, "make_laws");
		if (!truthy((yield* g.srcCall(f, "TryConnectToAI")))) {
			rt.setSv(f, "lawupdate", 0);
		}
	}
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio/borg"), [live(f.src)])));
	if ((!truthy(rt.sv(f, "scrambledcodes")) && !truthy(rt.sv(f, "camera")))) {
		rt.setSv(f, "camera", (yield* g.new_(f, T("/obj/machinery/camera"), [live(f.src)])));
		rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
		rt.setFv(f, "network", rt.sv(f, "camera"), rt.list("SS13"));
		if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Camera"])))) {
			rt.setFv(f, "status", rt.sv(f, "camera"), 0);
		}
	}
	rt.setSv(f, "module", (yield* g.new_(f, T("/obj/item/weapon/robot_module"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "module"), "rebuild_modules", []);
	yield* g.srcCall(f, "update_icons");
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "shell"))) {
		yield* g.srcCall(f, "make_shell");
	} else {
		if ((!truthy(rt.sv(f, "mmi")) || !truthy(rt.fv(f, "brainmob", rt.sv(f, "mmi"))))) {
			rt.setSv(f, "mmi", (yield* g.new_(f, T("/obj/item/device/mmi"), [live(f.src)])));
			rt.setFv(f, "brain", rt.sv(f, "mmi"), (yield* g.new_(f, T("/obj/item/organ/brain"), [rt.sv(f, "mmi")])));
			rt.setFv(f, "name", rt.fv(f, "brain", rt.sv(f, "mmi")), fmt("＀'s brain", [rt.sv(f, "real_name")]));
			rt.setFv(f, "icon_state", rt.sv(f, "mmi"), "mmi_full");
			rt.setFv(f, "name", rt.sv(f, "mmi"), fmt("Man-Machine Interface: ＀", [rt.sv(f, "real_name")]));
			rt.setFv(f, "brainmob", rt.sv(f, "mmi"), (yield* g.new_(f, T("/mob/living/brain"), [rt.sv(f, "mmi")])));
			rt.setFv(f, "name", rt.fv(f, "brainmob", rt.sv(f, "mmi")), rt.fv(f, "real_name", live(f.src)));
			rt.setFv(f, "real_name", rt.fv(f, "brainmob", rt.sv(f, "mmi")), rt.fv(f, "real_name", live(f.src)));
			rt.setFv(f, "container", rt.fv(f, "brainmob", rt.sv(f, "mmi")), rt.sv(f, "mmi"));
		}
	}
	yield* g.srcCall(f, "updatename");
	rt.setSv(f, "equippable_hats", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "equippable_hats")])));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/voice/liveagain.ogg"), 75, 1]);
	rt.setSv(f, "aicamera", (yield* g.new_(f, T("/obj/item/device/camera/siliconcam/robot_camera"), [live(f.src)])));
	rt.setSv(f, "toner", rt.sv(f, "tonermax"));
	yield* g.srcCall(f, "diag_hud_set_borgcell");
	return f.dot;
}, true, { args: ["mapload"] });

// /mob/living/silicon/robot/proc/Destroy  (code/modules/mob/living/silicon/robot/robot.dm:166)  may sleep
rt.def("/mob/living/silicon/robot/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((truthy(rt.sv(f, "mmi")) && truthy(rt.sv(f, "mind")))) {
		if (truthy((_T = rt.getStep(f, rt.sv(f, "loc"), 0)))) {
			rt.setFv(f, "loc", rt.sv(f, "mmi"), live(_T));
		}
		if (truthy(rt.fv(f, "brainmob", rt.sv(f, "mmi")))) {
			if (isEqual(rt.gv(f, "stat", rt.fv(f, "brainmob", rt.sv(f, "mmi"))), 2)) {
				rt.setFv(f, "stat", rt.fv(f, "brainmob", rt.sv(f, "mmi")), 0);
				(rt.modGl("dead_mob_list", rt.fv(f, "brainmob", rt.sv(f, "mmi")), subtract));
				rt.modGl("living_mob_list", rt.fv(f, "brainmob", rt.sv(f, "mmi")), add);
			}
			yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [rt.fv(f, "brainmob", rt.sv(f, "mmi"))]);
			yield* g.callName(f, rt.sv(f, "mmi"), "update_icon", []);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='boldannounce'>Oops! Something went very wrong, your MMI was unable to receive your mind. You have been ghosted. Please make a bug report so we can fix this bug.</span>"]);
			yield* g.srcCall(f, "ghostize");
			yield* g.call(f, P("/proc/stack_trace"), null, ["Borg MMI lacked a brainmob"]);
		}
		rt.setSv(f, "mmi", null);
	}
	if (truthy(rt.sv(f, "connected_ai"))) {
		(rt.modField(f, rt.sv(f, "connected_ai"), "connected_robots", live(f.src), subtract));
	}
	if (truthy(rt.sv(f, "shell"))) {
		(rt.modGl("available_ai_shells", live(f.src), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "module")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "eye_lights")]);
	rt.setSv(f, "wires", null);
	rt.setSv(f, "module", null);
	rt.setSv(f, "eye_lights", null);
	rt.setSv(f, "camera", null);
	rt.setSv(f, "cell", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/silicon/robot/proc/pick_module  (code/modules/mob/living/silicon/robot/robot.dm:198)  may sleep
rt.def("/mob/living/silicon/robot/proc/pick_module", function* pick_module(f: Frame) {
	let modulelist: Value = null, input_module: Value = null;
	f.vars = () => [modulelist, input_module];
	if (!isEqual(rt.fv(f, "type", rt.sv(f, "module")), T("/obj/item/weapon/robot_module"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Reset Module"])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>ERROR: Module installer reply timeout. Please check internal connections.</span>"]);
		return live(f.dot);
	}
	modulelist = rt.alist(f, ["Standard", T("/obj/item/weapon/robot_module/standard"), "Engineering", T("/obj/item/weapon/robot_module/engineering"), "Medical", T("/obj/item/weapon/robot_module/medical"), "Miner", T("/obj/item/weapon/robot_module/miner"), "Janitor", T("/obj/item/weapon/robot_module/janitor"), "Service", T("/obj/item/weapon/robot_module/butler")]);
	if (!truthy(rt.fv(f, "forbid_peaceborg", rt.gl("config")))) {
		rt.setAt(live(modulelist), "Peacekeeper", T("/obj/item/weapon/robot_module/peacekeeper"));
	}
	if (!truthy(rt.fv(f, "forbid_secborg", rt.gl("config")))) {
		rt.setAt(live(modulelist), "Security", T("/obj/item/weapon/robot_module/security"));
	}
	if ((!truthy((input_module = (yield* g.op(f, "Prompt", [1], [null, null, "Robot", "Please, select a module!", live(modulelist)])))) || !isEqual(rt.fv(f, "type", rt.sv(f, "module")), T("/obj/item/weapon/robot_module")))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "module"), "transform_to", [rt.index(live(modulelist), live(input_module))]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/updatename  (code/modules/mob/living/silicon/robot/robot.dm:226)
rt.def("/mob/living/silicon/robot/proc/updatename", function updatename(f: Frame) {
	let changed_name: Value = null;
	f.vars = () => [changed_name];
	if (truthy(rt.sv(f, "shell"))) {
		return live(f.dot);
	}
	changed_name = "";
	if (truthy(rt.sv(f, "custom_name"))) {
		changed_name = rt.sv(f, "custom_name");
	}
	if ((isEqual(live(changed_name), "") && truthy(rt.sv(f, "client")))) {
		changed_name = rt.index(rt.gv(f, "custom_names", rt.fv(f, "prefs", rt.sv(f, "client"))), "cyborg");
	}
	if (!truthy(live(changed_name))) {
		changed_name = rt.callSrc(f, "get_standard_name", []);
	}
	rt.setSv(f, "real_name", live(changed_name));
	rt.setSv(f, "name", rt.sv(f, "real_name"));
	if (!truthy(rt.sv(f, "camera"))) return f.dot;
	rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
	return f.dot;
});

// /mob/living/silicon/robot/proc/get_standard_name  (code/modules/mob/living/silicon/robot/robot.dm:240)
rt.def("/mob/living/silicon/robot/proc/get_standard_name", function get_standard_name(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "designation"))) {
		$0 = fmt("＀ ", [rt.sv(f, "designation")]);
	} else {
		$0 = "";
	}
	return fmt("＀＀-＀", [$0, rt.fv(f, "braintype", rt.sv(f, "mmi")), rt.sv(f, "ident")]);
});

// /mob/living/silicon/robot/verb/cmd_robot_alerts  (code/modules/mob/living/silicon/robot/robot.dm:245)  may sleep
rt.def("/mob/living/silicon/robot/verb/cmd_robot_alerts", function* cmd_robot_alerts(f: Frame) {
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Alert: You are dead.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "robot_alerts");
	return f.dot;
}, true, { verb: { name: "Show Alerts", category: "Robot Commands" } });

// /mob/living/silicon/robot/verb/cmd_toggle_module  (code/modules/mob/living/silicon/robot/robot.dm:254)
rt.def("/mob/living/silicon/robot/verb/cmd_toggle_module", function cmd_toggle_module(f: Frame, module: Value) {
	rt.callSrc(f, "toggle_module", [live(module)]);
	return f.dot;
}, false, { hidden: true, verb: { name: "Toggle Module" }, argTypes: [{ type: 32 }] });

// /mob/living/silicon/robot/verb/cmd_unequip_module  (code/modules/mob/living/silicon/robot/robot.dm:259)  may sleep
rt.def("/mob/living/silicon/robot/verb/cmd_unequip_module", function* cmd_unequip_module(f: Frame) {
	yield* g.srcCall(f, "uneq_active");
	return f.dot;
}, true, { hidden: true, verb: { name: "Unequip Module" } });

// /mob/living/silicon/robot/proc/robot_alerts  (code/modules/mob/living/silicon/robot/robot.dm:262)  may sleep
rt.def("/mob/living/silicon/robot/proc/robot_alerts", function* robot_alerts(f: Frame) {
	let dat: Value = null, cat: Value = null, L: Value = null, alarm: Value = null, alm: Value = null, A: Value = null, alerts: Value = null;
	let $e: any;
	f.vars = () => [dat, cat, L, alarm, alm, A, alerts, $e];
	dat = "";
	cat = null;
	rt.forList(f, 0, rt.sv(f, "alarms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cat = $e;
		dat = rt.modify(live(dat), fmt("<B>＀</B><BR>\n", [live(cat)]), add);
		if (truthy(rt.getLen(f, (L = rt.index(rt.sv(f, "alarms"), live(cat)))))) {
			alarm = null;
			rt.forList(f, 1, live(L));
			while (($e = rt.next(f, 1)) !== undefined) {
				alarm = $e;
				alm = rt.index(live(L), live(alarm));
				A = rt.index(live(alm), 1);
				dat = rt.modify(live(dat), "<NOBR>", add);
				dat = rt.modify(live(dat), fmt("-- ＀", [rt.fv(f, "name", live(A))]), add);
				dat = rt.modify(live(dat), "</NOBR><BR>\n", add);
			}
			rt.endFor(f, 1);
		} else {
			dat = rt.modify(live(dat), "-- All Systems Nominal<BR>\n", add);
		}
		dat = rt.modify(live(dat), "<BR>\n", add);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (alerts = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), "robotalerts", "Current Station Alerts", 400, 410]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(alerts), "open", []);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/ionpulse  (code/modules/mob/living/silicon/robot/robot.dm:282)  may sleep
rt.def("/mob/living/silicon/robot/proc/ionpulse", function* ionpulse(f: Frame) {
	if (!truthy(rt.sv(f, "ionpulse_on"))) {
		return live(f.dot);
	}
	if (rt.le(rt.fv(f, "charge", rt.sv(f, "cell")), 50)) {
		yield* g.srcCall(f, "toggle_ionpulse");
		return live(f.dot);
	}
	(rt.modField(f, rt.sv(f, "cell"), "charge", 50, subtract));
	return 1;
}, true);

// /mob/living/silicon/robot/proc/toggle_ionpulse  (code/modules/mob/living/silicon/robot/robot.dm:293)  may sleep
rt.def("/mob/living/silicon/robot/proc/toggle_ionpulse", function* toggle_ionpulse(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.sv(f, "ionpulse"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>No thrusters are installed!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "ion_trail"))) {
		rt.setSv(f, "ion_trail", (yield* g.new_(f, T("/datum/effect_system/trail_follow/ion"), [])));
		yield* g.callName(f, rt.sv(f, "ion_trail"), "set_up", [live(f.src)]);
	}
	rt.setSv(f, "ionpulse_on", (!truthy(rt.sv(f, "ionpulse_on")) ? 1 : 0));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "ionpulse_on"))) {
		$1 = null;
	} else {
		$1 = "de";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀activate your ion thrusters.</span>", [$1])]);
	if (truthy(rt.sv(f, "ionpulse_on"))) {
		yield* g.callName(f, rt.sv(f, "ion_trail"), "start", []);
	} else {
		yield* g.callName(f, rt.sv(f, "ion_trail"), "stop", []);
	}
	if (!truthy(rt.sv(f, "thruster_button"))) return f.dot;
	rt.setFv(f, "icon_state", rt.sv(f, "thruster_button"), fmt("ionpulse＀", [rt.sv(f, "ionpulse_on")]));
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/Stat  (code/modules/mob/living/silicon/robot/robot.dm:311)  may sleep
rt.def("/mob/living/silicon/robot/proc/Stat", function* Stat(f: Frame) {
	let st: Value = null;
	let $e: any;
	f.vars = () => [st, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (truthy(rt.sv(f, "cell"))) {
		yield* g.call(f, P("/proc/stat"), null, ["Charge Left:", fmt("＀/＀", [rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell"))])]);
	} else {
		yield* g.call(f, P("/proc/stat"), null, [null, "No Cell Inserted!"]);
	}
	if (truthy(rt.sv(f, "module"))) {
		st = null;
		rt.forList(f, 0, rt.fv(f, "storages", rt.sv(f, "module")), T("/datum/robot_energy_storage"));
		while (($e = rt.next(f, 0)) !== undefined) {
			st = $e;
			yield* g.call(f, P("/proc/stat"), null, [fmt("＀:", [rt.fv(f, "name", live(st))]), fmt("＀/＀", [rt.fv(f, "energy", live(st)), rt.fv(f, "max_energy", live(st))])]);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "connected_ai"))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, ["Master AI:", rt.fv(f, "name", rt.sv(f, "connected_ai"))]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/triggerAlarm  (code/modules/mob/living/silicon/robot/robot.dm:328)
rt.def("/mob/living/silicon/robot/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	let L: Value = null, I: Value = null, alarm: Value = null, sources: Value = null, C: Value = null, CL: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [L, I, alarm, sources, C, CL, $0, $1, $2, $3, $e];
	if (!isEqual(rt.fv(f, "z", live(alarmsource)), rt.sv(f, "z"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return 1;
	}
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			sources = rt.index(live(alarm), 3);
			if (!truthy((rt.isIn(f, live(alarmsource), live(sources)) ? 1 : 0))) {
				sources = rt.modify(live(sources), live(alarmsource), add);
			}
			return 1;
		}
	}
	rt.endFor(f, 0);
	C = null;
	CL = null;
	if ((truthy(live(O)) && truthy((rt.istype(live(O), T("/list")) ? 1 : 0)))) {
		if (isEqual(rt.getLen(f, (CL = live(O))), 1)) {
			C = rt.index(live(CL), 1);
		}
	} else {
		if ((truthy(live(O)) && truthy((rt.istype(live(O), T("/obj/machinery/camera")) ? 1 : 0)))) {
			C = live(O);
		}
	}
	$0 = live(L);
	$1 = rt.fv(f, "name", live(A));
	$2 = live(A);
	if (truthy(live(C))) {
		$3 = live(C);
	} else {
		$3 = live(O);
	}
	rt.setAt($0, $1, rt.list($2, $3, rt.list(live(alarmsource))));
	rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm detected in ＀!", [live(_class), rt.fv(f, "name", live(A))]), live(_class)]);
	return 1;
});

// /mob/living/silicon/robot/proc/cancelAlarm  (code/modules/mob/living/silicon/robot/robot.dm:353)
rt.def("/mob/living/silicon/robot/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let L: Value = null, cleared: Value = null, I: Value = null, alarm: Value = null, srcs: Value = null;
	let $e: any;
	f.vars = () => [L, cleared, I, alarm, srcs, $e];
	L = rt.index(rt.sv(f, "alarms"), live(_class));
	cleared = 0;
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.fv(f, "name", live(A)))) {
			alarm = rt.index(live(L), live(I));
			srcs = rt.index(live(alarm), 3);
			if (truthy((rt.isIn(f, live(origin), live(srcs)) ? 1 : 0))) {
				(srcs = rt.modify(live(srcs), live(origin), subtract));
			}
			if (isEqual(rt.len(f, live(srcs)), 0)) {
				cleared = 1;
				(L = rt.modify(live(L), live(I), subtract));
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(cleared))) {
		rt.callSrc(f, "queueAlarm", [fmt("--- ＀ alarm in ＀ has been cleared.", [live(_class), rt.fv(f, "name", live(A))]), live(_class), 0]);
	}
	return (!truthy(live(cleared)) ? 1 : 0);
});

// /mob/living/silicon/robot/proc/attackby  (code/modules/mob/living/silicon/robot/robot.dm:369)  may sleep
rt.def("/mob/living/silicon/robot/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, coil: Value = null, MOD: Value = null, U: Value = null;
	let $0: any, $1: any;
	f.vars = () => [WT, coil, MOD, U, $0, $1];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") || isEqual(live(f.args[1]), live(f.src))))) {
		yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
		WT = live(f.args[0]);
		if (!truthy((yield* g.srcCall(f, "getBruteLoss")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is already in good condition!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
			if (isEqual(live(f.src), live(f.args[1]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start fixing yourself...</span>"]);
				if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
					return live(f.dot);
				}
			}
			yield* g.srcCall(f, "adjustBruteLoss", -30);
			yield* g.srcCall(f, "updatehealth");
			yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ has fixed some of the dents on ＀.</span>", [live(f.args[1]), live(f.src)]));
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The welder must be on for this task!</span>"]);
			return live(f.dot);
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && truthy(rt.sv(f, "wiresexposed")))) {
			yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
			coil = live(f.args[0]);
			if (rt.gt((yield* g.srcCall(f, "getFireLoss")), 0)) {
				if (isEqual(live(f.src), live(f.args[1]))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start fixing yourself...</span>"]);
					if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
						return live(f.dot);
					}
				}
				if (truthy((yield* g.callName(f, live(coil), "use", [1])))) {
					yield* g.srcCall(f, "adjustFireLoss", -30);
					yield* g.srcCall(f, "updatehealth");
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has fixed some of the burnt wires on ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You fix some of the burnt wires on ＀.</span>", [live(f.src)])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need more cable to repair ＀!</span>", [live(f.src)])]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "The wires seem fine, there's no need to fix them."]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "opened"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the cover.</span>"]);
					rt.setSv(f, "opened", 0);
					yield* g.srcCall(f, "update_icons");
				} else {
					if (truthy(rt.sv(f, "locked"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The cover is locked and cannot be opened!</span>"]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the cover.</span>"]);
						rt.setSv(f, "opened", 1);
						yield* g.srcCall(f, "update_icons");
					}
				}
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0)) && truthy(rt.sv(f, "opened")))) {
					if (truthy(rt.sv(f, "wiresexposed"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Close the cover first!</span>"]);
					} else {
						if (truthy(rt.sv(f, "cell"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is a power cell already installed!</span>"]);
						} else {
							if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
								return live(f.dot);
							}
							rt.setFv(f, "loc", live(f.args[0]), live(f.src));
							rt.setSv(f, "cell", live(f.args[0]));
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You insert the power cell.</span>"]);
						}
					}
					yield* g.srcCall(f, "update_icons");
					yield* g.srcCall(f, "diag_hud_set_borgcell");
				} else {
					if (truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])])))) {
						if (truthy(rt.sv(f, "wiresexposed"))) {
							yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't reach the wiring!</span>"]);
						}
					} else {
						if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "opened"))) && !truthy(rt.sv(f, "cell")))) {
							rt.setSv(f, "wiresexposed", (!truthy(rt.sv(f, "wiresexposed")) ? 1 : 0));
							$0 = live(f.args[1]);
							if (truthy(rt.sv(f, "wiresexposed"))) {
								$1 = "exposed";
							} else {
								$1 = "unexposed";
							}
							yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("The wires have been ＀", [$1])]);
							yield* g.srcCall(f, "update_icons");
						} else {
							if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "opened"))) && truthy(rt.sv(f, "cell")))) {
								if (truthy(rt.sv(f, "shell"))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You cannot seem to open the radio compartment"]);
								} else {
									if (truthy(rt.sv(f, "radio"))) {
										yield* g.callName(f, rt.sv(f, "radio"), "attackby", [live(f.args[0]), live(f.args[1])]);
									} else {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Unable to locate a radio!</span>"]);
									}
								}
								yield* g.srcCall(f, "update_icons");
							} else {
								if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "opened"))) && !truthy(rt.sv(f, "cell")))) {
									if (!truthy(rt.sv(f, "lockcharge"))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldannounce'>＀'s bolts spark! Maybe you should lock them down first!</span>", [live(f.src)])]);
										yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
										return live(f.dot);
									} else {
										yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start to unfasten ＀'s securing bolts...</span>", [live(f.src)])]);
										if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && !truthy(rt.sv(f, "cell")))) {
											yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ deconstructs ＀!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unfasten the securing bolts, and ＀ falls to pieces!</span>", [live(f.src)])]);
											yield* g.srcCall(f, "deconstruct");
										}
									}
								} else {
									if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/aiModule")) ? 1 : 0))) {
										MOD = live(f.args[0]);
										if (!truthy(rt.sv(f, "opened"))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need access to the robot's insides to do that!</span>"]);
											return live(f.dot);
										}
										if (truthy(rt.sv(f, "wiresexposed"))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to close the wire panel to do that!</span>"]);
											return live(f.dot);
										}
										if (!truthy(rt.sv(f, "cell"))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to install a power cell to do that!</span>"]);
											return live(f.dot);
										}
										if (truthy(rt.sv(f, "shell"))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is controlled remotely! You cannot upload new laws this way!</span>", [live(f.src)])]);
											return live(f.dot);
										}
										if ((truthy(rt.sv(f, "emagged")) || (truthy(rt.sv(f, "connected_ai")) && truthy(rt.sv(f, "lawupdate"))))) {
											yield* g.srcCall(f, "emote", fmt("buzz-＀", [rt.fv(f, "name", live(f.args[1]))]));
											return live(f.dot);
										}
										if (!truthy(rt.sv(f, "mind"))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is entirely unresponsive!</span>", [live(f.src)])]);
											return live(f.dot);
										}
										yield* g.callName(f, live(MOD), "install", [rt.sv(f, "laws"), live(f.args[1])]);
										return live(f.dot);
									} else {
										if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/encryptionkey")) ? 1 : 0)) && truthy(rt.sv(f, "opened")))) {
											if (truthy(rt.sv(f, "radio"))) {
												yield* g.callName(f, rt.sv(f, "radio"), "attackby", [live(f.args[0]), live(f.args[1])]);
											} else {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Unable to locate a radio!</span>"]);
											}
										} else {
											if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0)))) {
												if (truthy(rt.sv(f, "emagged"))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The interface seems slightly damaged.</span>"]);
												}
												if (truthy(rt.sv(f, "opened"))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must close the cover to swipe an ID card!</span>"]);
												} else {
													if (truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
														rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
														$0 = live(f.args[1]);
														if (truthy(rt.sv(f, "locked"))) {
															$1 = "lock";
														} else {
															$1 = "unlock";
														}
														yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ＀'s cover.</span>", [$1, live(f.src)])]);
														yield* g.srcCall(f, "update_icons");
													} else {
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access denied.</span>"]);
													}
												}
											} else {
												if (truthy((rt.istype(live(f.args[0]), T("/obj/item/borg/upgrade")) ? 1 : 0))) {
													U = live(f.args[0]);
													if (!truthy(rt.sv(f, "opened"))) {
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must access the borg's internals!</span>"]);
													} else {
														if ((!truthy(rt.fv(f, "module", live(f.src))) && truthy(rt.fv(f, "require_module", live(U))))) {
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The borg must choose a module before it can be upgraded!</span>"]);
														} else {
															if (truthy(rt.fv(f, "locked", live(U)))) {
																yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The upgrade is locked and cannot be used yet!</span>"]);
															} else {
																if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
																	return live(f.dot);
																}
																if (truthy((yield* g.callName(f, live(U), "action", [live(f.src)])))) {
																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You apply the upgrade to ＀.</span>", [live(f.src)])]);
																	if (truthy(rt.fv(f, "one_use", live(U)))) {
																		yield* g.call(f, P("/proc/qdel"), null, [live(U)]);
																	} else {
																		yield* g.callName(f, live(U), "forceMove", [live(f.src)]);
																		rt.modSrcVar(f, "upgrades", live(U), add);
																	}
																} else {
																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Upgrade error.</span>"]);
																}
															}
														}
													}
												} else {
													if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/toner")) ? 1 : 0))) {
														if (rt.ge(rt.sv(f, "toner"), rt.sv(f, "tonermax"))) {
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The toner level of ＀ is at its highest level possible!</span>", [live(f.src)])]);
														} else {
															if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
																return live(f.dot);
															}
															rt.setSv(f, "toner", rt.sv(f, "tonermax"));
															yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fill the toner level of ＀ to its max capacity.</span>", [live(f.src)])]);
														}
													} else {
														return (yield* g.callSuper(f, [], rt.Args.Same));
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/silicon/robot/verb/unlock_own_cover  (code/modules/mob/living/silicon/robot/robot.dm:545)  may sleep
rt.def("/mob/living/silicon/robot/verb/unlock_own_cover", function* unlock_own_cover(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "locked"))) return f.dot;
	$0 = (yield* g.call(f, P("/proc/alert"), null, ["You cannot lock your cover again, are you sure?\n      (You can still ask for a human to lock it)", "Unlock Own Cover", "Yes", "No"]));
	if ($0 === "Yes") {
		rt.setSv(f, "locked", 0);
		yield* g.srcCall(f, "update_icons");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You unlock your cover.</span>"]);
	}
	return f.dot;
}, true, { verb: { name: "Unlock Cover", category: "Robot Commands", desc: "Unlocks your own cover if it is locked. You can not lock it again. A human will have to lock it for you." } });

// /mob/living/silicon/robot/proc/allowed  (code/modules/mob/living/silicon/robot/robot.dm:556)
rt.def("/mob/living/silicon/robot/proc/allowed", function allowed(f: Frame, M: Value) {
	let H: Value = null, george: Value = null;
	f.vars = () => [H, george];
	if (truthy(rt.callSrc(f, "check_access", [null]))) {
		return 1;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.callSrc(f, "check_access", [rt.callName(f, (H = live(M)), "get_active_held_item", [])])) || truthy(rt.callSrc(f, "check_access", [rt.fv(f, "wear_id", live(H))])))) {
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.callName(f, (george = live(M)), "get_active_held_item", []), T("/obj/item")) ? 1 : 0))) {
				return rt.callSrc(f, "check_access", [rt.callName(f, live(george), "get_active_held_item", [])]);
			}
		}
	}
	return 0;
});

// /mob/living/silicon/robot/proc/check_access  (code/modules/mob/living/silicon/robot/robot.dm:571)
rt.def("/mob/living/silicon/robot/proc/check_access", function check_access(f: Frame, I: Value) {
	let L: Value = null, req: Value = null;
	let $e: any;
	f.vars = () => [I, L, req, $e];
	if (!truthy((rt.istype(rt.sv(f, "req_access"), T("/list")) ? 1 : 0))) {
		return 1;
	}
	if (!truthy(rt.getLen(f, (L = rt.sv(f, "req_access"))))) {
		return 1;
	}
	if ((!truthy((rt.istype(live(I), T("/obj/item/weapon/card/id")) ? 1 : 0)) && truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0)))) {
		I = rt.callName(f, live(I), "GetID", []);
	}
	if ((!truthy(live(I)) || !truthy(rt.fv(f, "access", live(I))))) {
		return 0;
	}
	req = null;
	rt.forList(f, 0, rt.sv(f, "req_access"));
	while (($e = rt.next(f, 0)) !== undefined) {
		req = $e;
		if (!truthy((rt.isIn(f, live(req), rt.fv(f, "access", live(I))) ? 1 : 0))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /mob/living/silicon/robot/proc/regenerate_icons  (code/modules/mob/living/silicon/robot/robot.dm:589)
rt.def("/mob/living/silicon/robot/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	return rt.callSrc(f, "update_icons", []);
});

// /mob/living/silicon/robot/proc/update_icons  (code/modules/mob/living/silicon/robot/robot.dm:592)
rt.def("/mob/living/silicon/robot/proc/update_icons", function update_icons(f: Frame) {
	let head_overlay: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [head_overlay, $0, $1, $2];
	rt.callSrc(f, "cut_overlays", []);
	rt.setSv(f, "icon_state", rt.fv(f, "cyborg_base_icon", rt.sv(f, "module")));
	if ((!isEqual(rt.sv(f, "stat"), 2) && !(((truthy(rt.callSrc(f, "IsUnconscious", [])) || truthy(rt.callSrc(f, "IsStun", []))) || truthy(rt.callSrc(f, "IsKnockdown", []))) || truthy(rt.sv(f, "low_power_mode"))))) {
		if (!truthy(rt.sv(f, "eye_lights"))) {
			rt.setSv(f, "eye_lights", rt.new_(f, T("/mutable_appearance"), []));
		}
		if (rt.gt(rt.sv(f, "lamp_intensity"), 2)) {
			$0 = rt.sv(f, "eye_lights");
			if (truthy(rt.fv(f, "special_light_key", rt.sv(f, "module")))) {
				$1 = fmt("＀", [rt.fv(f, "special_light_key", rt.sv(f, "module"))]);
			} else {
				$1 = fmt("＀", [rt.fv(f, "cyborg_base_icon", rt.sv(f, "module"))]);
			}
			rt.setFv(f, "icon_state", $0, fmt("＀_l", [$1]));
		} else {
			$0 = rt.sv(f, "eye_lights");
			if (truthy(rt.fv(f, "special_light_key", rt.sv(f, "module")))) {
				$1 = fmt("＀", [rt.fv(f, "special_light_key", rt.sv(f, "module"))]);
			} else {
				$1 = fmt("＀", [rt.fv(f, "cyborg_base_icon", rt.sv(f, "module"))]);
			}
			if (truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)]))) {
				$2 = "_r";
			} else {
				$2 = "";
			}
			rt.setFv(f, "icon_state", $0, fmt("＀_e＀", [$1, $2]));
		}
		rt.setFv(f, "icon", rt.sv(f, "eye_lights"), rt.sv(f, "icon"));
		rt.callSrc(f, "add_overlay", [rt.sv(f, "eye_lights")]);
	}
	if (truthy(rt.sv(f, "opened"))) {
		if (truthy(rt.sv(f, "wiresexposed"))) {
			rt.callSrc(f, "add_overlay", ["ov-opencover +w"]);
		} else {
			if (truthy(rt.sv(f, "cell"))) {
				rt.callSrc(f, "add_overlay", ["ov-opencover +c"]);
			} else {
				rt.callSrc(f, "add_overlay", ["ov-opencover -c"]);
			}
		}
	}
	if (truthy(rt.sv(f, "hat"))) {
		rt.modField(f, (head_overlay = rt.callName(f, rt.sv(f, "hat"), "build_worn_icon", ["state", rt.fv(f, "icon_state", rt.sv(f, "hat")), "default_layer", 20, "default_icon_file", rt.rsc("icons/mob/head.dmi")], rt.Args.Named)), "pixel_y", rt.sv(f, "hat_offset"), add);
		rt.callSrc(f, "add_overlay", [live(head_overlay)]);
	}
	rt.callSrc(f, "update_fire", []);
	return f.dot;
});

// /mob/living/silicon/robot/proc/do_camera_update  (code/modules/mob/living/silicon/robot/robot.dm:620)
rt.def("/mob/living/silicon/robot/proc/do_camera_update", function do_camera_update(f: Frame, oldLoc: Value) {
	if (!isEqual(live(oldLoc), rt.fv(f, "loc", live(f.src)))) {
		rt.callName(f, rt.gl("cameranet"), "updatePortableCamera", [rt.fv(f, "camera", live(f.src))]);
	}
	rt.setSv(f, "updating", 0);
	return f.dot;
});

// /mob/living/silicon/robot/proc/Move  (code/modules/mob/living/silicon/robot/robot.dm:626)  may sleep
rt.def("/mob/living/silicon/robot/proc/Move", function* Move(f: Frame) {
	let oldLoc: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [oldLoc, I, $e];
	oldLoc = rt.fv(f, "loc", live(f.src));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		if (truthy(rt.fv(f, "camera", live(f.src)))) {
			if (!truthy(rt.sv(f, "updating"))) {
				rt.setSv(f, "updating", 1);
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/robot/proc/do_camera_update"), live(oldLoc)])), 30]);
			}
		}
	}
	if (!truthy(rt.sv(f, "module"))) return f.dot;
	if (!truthy((rt.istype(rt.sv(f, "module"), T("/obj/item/weapon/robot_module/miner")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/floor/plating/asteroid")) ? 1 : 0))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/storage/bag/ore")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "loc"), "attackby", [live(I), live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["a", "b", "flag"] });

// /mob/living/silicon/robot/proc/self_destruct  (code/modules/mob/living/silicon/robot/robot.dm:643)  may sleep
rt.def("/mob/living/silicon/robot/proc/self_destruct", function* self_destruct(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		if (truthy(rt.sv(f, "mmi"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mmi")]);
		}
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, 1, null, 2, null, 4, "flame_range", 2], rt.Args.Named);
	} else {
		yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), -1, 0, 2]);
	}
	yield* g.srcCall(f, "gib");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/UnlinkSelf  (code/modules/mob/living/silicon/robot/robot.dm:650)  may sleep
rt.def("/mob/living/silicon/robot/proc/UnlinkSelf", function* UnlinkSelf(f: Frame) {
	if (truthy(rt.fv(f, "connected_ai", live(f.src)))) {
		(rt.modField(f, rt.sv(f, "connected_ai"), "connected_robots", live(f.src), subtract));
		rt.setFv(f, "connected_ai", live(f.src), null);
	}
	rt.setSv(f, "lawupdate", 0);
	rt.setSv(f, "lockcharge", 0);
	rt.setSv(f, "canmove", 1);
	rt.setSv(f, "scrambledcodes", 1);
	if (!truthy(rt.fv(f, "camera", live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "camera", live(f.src))]);
	rt.setFv(f, "camera", live(f.src), null);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/ResetSecurityCodes  (code/modules/mob/living/silicon/robot/robot.dm:671)  may sleep
rt.def("/mob/living/silicon/robot/proc/ResetSecurityCodes", function* ResetSecurityCodes(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy((R = live(f.src)))) return f.dot;
	yield* g.callName(f, live(R), "UnlinkSelf", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(R), "Buffers flushed and reset. Camera system shutdown.  All systems operational."]);
	(rt.modField(f, live(f.src), "verbs", P("/mob/living/silicon/robot/proc/ResetSecurityCodes"), subtract));
	return f.dot;
}, true, { verb: { name: "Reset Identity Codes", category: "Robot Commands", desc: "Scrambles your security and identification codes and resets your current buffers. Unlocks you and permanently severs you from your AI and the robotics console and will deactivate your camera system." } });

// /mob/living/silicon/robot/mode  (code/modules/mob/living/silicon/robot/robot.dm:683)  may sleep
rt.def("/mob/living/silicon/robot/mode", function* mode(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy((yield* g.srcCall(f, "incapacitated")))) {
		return live(f.dot);
	}
	if (!truthy((W = (yield* g.srcCall(f, "get_active_held_item"))))) return f.dot;
	yield* g.callName(f, live(W), "attack_self", [live(f.src)]);
	return f.dot;
}, true, { verb: { name: "Activate Held Object", category: "Object", src: 10 } });

// /mob/living/silicon/robot/proc/SetLockdown  (code/modules/mob/living/silicon/robot/robot.dm:692)  may sleep
rt.def("/mob/living/silicon/robot/proc/SetLockdown", function* SetLockdown(f: Frame, state: Value) {
	f.vars = () => [state];
	if (live(state) === null) {
		state = 1;
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Lockdown"])))) {
		state = 1;
	}
	if (truthy(live(state))) {
		yield* g.srcCall(f, "throw_alert", "locked", T("/obj/screen/alert/locked"));
	} else {
		yield* g.srcCall(f, "clear_alert", "locked");
	}
	rt.setSv(f, "lockcharge", live(state));
	yield* g.srcCall(f, "update_canmove");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/SetEmagged  (code/modules/mob/living/silicon/robot/robot.dm:702)  may sleep
rt.def("/mob/living/silicon/robot/proc/SetEmagged", function* SetEmagged(f: Frame, new_state: Value) {
	f.vars = () => [new_state];
	rt.setSv(f, "emagged", live(new_state));
	yield* g.callName(f, rt.sv(f, "module"), "rebuild_modules", []);
	yield* g.srcCall(f, "update_icons");
	if (truthy(rt.sv(f, "emagged"))) {
		yield* g.srcCall(f, "throw_alert", "hacked", T("/obj/screen/alert/hacked"));
	} else {
		yield* g.srcCall(f, "clear_alert", "hacked");
	}
	return f.dot;
}, true);

// /mob/living/silicon/robot/verb/outputlaws  (code/modules/mob/living/silicon/robot/robot.dm:714)
rt.def("/mob/living/silicon/robot/verb/outputlaws", function outputlaws(f: Frame) {
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	rt.callSrc(f, "checklaws", []);
	return f.dot;
}, false, { verb: { name: "State Laws", category: "Robot Commands" } });

// /mob/living/silicon/robot/verb/set_automatic_say_channel  (code/modules/mob/living/silicon/robot/robot.dm:723)  may sleep
rt.def("/mob/living/silicon/robot/verb/set_automatic_say_channel", function* set_automatic_say_channel(f: Frame) {
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "set_autosay");
	return f.dot;
}, true, { verb: { name: "Set Auto Announce Mode", category: "Robot Commands", desc: "Modify the default radio setting for stating your laws." } });

// /mob/living/silicon/robot/proc/control_headlamp  (code/modules/mob/living/silicon/robot/robot.dm:728)  may sleep
rt.def("/mob/living/silicon/robot/proc/control_headlamp", function* control_headlamp(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (((truthy(rt.sv(f, "stat")) || truthy(rt.sv(f, "lamp_recharging"))) || truthy(rt.sv(f, "low_power_mode")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>This function is currently offline.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "lamp_intensity", rt.modulus(add(rt.sv(f, "lamp_intensity"), 2), add(rt.sv(f, "lamp_max"), 2)));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "lamp_intensity"))) {
		$1 = fmt("Headlamp power set to Level ＀", [divide(rt.sv(f, "lamp_intensity"), 2)]);
	} else {
		$1 = "Headlamp disabled.";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("＀", [$1])]);
	yield* g.srcCall(f, "update_headlamp");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/update_headlamp  (code/modules/mob/living/silicon/robot/robot.dm:738)  may sleep
rt.def("/mob/living/silicon/robot/proc/update_headlamp", function* update_headlamp(f: Frame, turn_off: Value, cooldown: Value) {
	f.vars = () => [turn_off, cooldown];
	if (live(turn_off) === null) {
		turn_off = 0;
	}
	if (live(cooldown) === null) {
		cooldown = 100;
	}
	yield* g.srcCall(f, "set_light", 0);
	if ((truthy(rt.sv(f, "lamp_intensity")) && ((truthy(live(turn_off)) || truthy(rt.sv(f, "stat"))) || truthy(rt.sv(f, "low_power_mode"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Your headlamp has been deactivated.</span>"]);
		rt.setSv(f, "lamp_intensity", 0);
		rt.setSv(f, "lamp_recharging", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/robot/proc/reset_headlamp")])), live(cooldown)]);
	} else {
		yield* g.srcCall(f, "set_light", rt.sv(f, "lamp_intensity"));
	}
	if (truthy(rt.sv(f, "lamp_button"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "lamp_button"), fmt("lamp＀", [rt.sv(f, "lamp_intensity")]));
	}
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/deconstruct  (code/modules/mob/living/silicon/robot/robot.dm:757)  may sleep
rt.def("/mob/living/silicon/robot/proc/deconstruct", function* deconstruct(f: Frame) {
	let _T: Value = null, b: Value = null, F: Value = null;
	f.vars = () => [_T, b, F];
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.sv(f, "robot_suit"))) {
		rt.setFv(f, "loc", rt.sv(f, "robot_suit"), live(_T));
		rt.setFv(f, "loc", rt.fv(f, "l_leg", rt.sv(f, "robot_suit")), live(_T));
		rt.setFv(f, "l_leg", rt.sv(f, "robot_suit"), null);
		rt.setFv(f, "loc", rt.fv(f, "r_leg", rt.sv(f, "robot_suit")), live(_T));
		rt.setFv(f, "r_leg", rt.sv(f, "robot_suit"), null);
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(_T), rt.gv(f, "wired", rt.fv(f, "chest", rt.sv(f, "robot_suit")))]);
		rt.setFv(f, "loc", rt.fv(f, "chest", rt.sv(f, "robot_suit")), live(_T));
		rt.setFv(f, "wired", rt.fv(f, "chest", rt.sv(f, "robot_suit")), 0);
		rt.setFv(f, "chest", rt.sv(f, "robot_suit"), null);
		rt.setFv(f, "loc", rt.fv(f, "l_arm", rt.sv(f, "robot_suit")), live(_T));
		rt.setFv(f, "l_arm", rt.sv(f, "robot_suit"), null);
		rt.setFv(f, "loc", rt.fv(f, "r_arm", rt.sv(f, "robot_suit")), live(_T));
		rt.setFv(f, "r_arm", rt.sv(f, "robot_suit"), null);
		rt.setFv(f, "loc", rt.fv(f, "head", rt.sv(f, "robot_suit")), live(_T));
		rt.setFv(f, "loc", rt.gv(f, "flash1", rt.fv(f, "head", rt.sv(f, "robot_suit"))), live(_T));
		yield* g.callName(f, rt.gv(f, "flash1", rt.fv(f, "head", rt.sv(f, "robot_suit"))), "burn_out", []);
		rt.setFv(f, "flash1", rt.fv(f, "head", rt.sv(f, "robot_suit")), null);
		rt.setFv(f, "loc", rt.gv(f, "flash2", rt.fv(f, "head", rt.sv(f, "robot_suit"))), live(_T));
		yield* g.callName(f, rt.gv(f, "flash2", rt.fv(f, "head", rt.sv(f, "robot_suit"))), "burn_out", []);
		rt.setFv(f, "flash2", rt.fv(f, "head", rt.sv(f, "robot_suit")), null);
		rt.setFv(f, "head", rt.sv(f, "robot_suit"), null);
		yield* g.callName(f, rt.sv(f, "robot_suit"), "updateicon", []);
	} else {
		yield* g.new_(f, T("/obj/item/robot_suit"), [live(_T)]);
		yield* g.new_(f, T("/obj/item/bodypart/l_leg/robot"), [live(_T)]);
		yield* g.new_(f, T("/obj/item/bodypart/r_leg/robot"), [live(_T)]);
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(_T), 1]);
		yield* g.new_(f, T("/obj/item/bodypart/chest/robot"), [live(_T)]);
		yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [live(_T)]);
		yield* g.new_(f, T("/obj/item/bodypart/r_arm/robot"), [live(_T)]);
		yield* g.new_(f, T("/obj/item/bodypart/head/robot"), [live(_T)]);
		b = null;
		b = 0;
		while (!isEqual(live(b), 2)) {
			yield* g.callName(f, (F = (yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(_T)]))), "burn_out", []);
			b = rt.inc(live(b), 1);
		}
	}
	if (truthy(rt.sv(f, "cell"))) {
		rt.setFv(f, "loc", rt.sv(f, "cell"), live(_T));
		rt.setSv(f, "cell", null);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(4836, "/mob/living/silicon/robot/syndicate", "/mob/living/silicon/robot", {
	playstyle_string: "<span class='userdanger'>You are a Syndicate assault cyborg!</span><br><b>You are armed with powerful offensive tools to aid you in your mission: help the operatives secure the nuclear authentication disk. Your cyborg LMG will slowly produce ammunition from your power supply, and your operative pinpointer will find and locate fellow nuclear operatives. <i>Help the operatives secure the disk at all costs!</i></b>",
	set_module: rt.typePath("/obj/item/weapon/robot_module/syndicate"),
	lawupdate: 0,
	scrambledcodes: 1,
	ionpulse: 1,
	icon_state: "syndie_bloodhound",
	faction: null,
	bubble_icon: "syndibot",
	req_access: null,
});

// /mob/living/silicon/robot/syndicate/proc/<init>  (code/modules/mob/living/silicon/robot/robot.dm:801)  may sleep
rt.def("/mob/living/silicon/robot/syndicate/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "faction", rt.list("syndicate"));
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(150));
	return f.dot;
}, true);

// /mob/living/silicon/robot/syndicate/proc/Initialize  (code/modules/mob/living/silicon/robot/robot.dm:814)  may sleep
rt.def("/mob/living/silicon/robot/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "maxcharge", rt.sv(f, "cell"), 25000);
	rt.setFv(f, "charge", rt.sv(f, "cell"), 25000);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio/borg/syndicate"), [live(f.src)])));
	yield* g.callName(f, rt.sv(f, "module"), "transform_to", [rt.sv(f, "set_module")]);
	rt.setSv(f, "laws", (yield* g.new_(f, T("/datum/ai_laws/syndicate_override"), [])));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/robot/syndicate/proc/show_playstyle")])), 5]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/syndicate/proc/show_playstyle  (code/modules/mob/living/silicon/robot/robot.dm:824)
rt.def("/mob/living/silicon/robot/syndicate/proc/show_playstyle", function show_playstyle(f: Frame) {
	if (!truthy(rt.sv(f, "playstyle_string"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "playstyle_string")]);
	return f.dot;
});

// /mob/living/silicon/robot/proc/notify_ai  (code/modules/mob/living/silicon/robot/robot.dm:840)
rt.def("/mob/living/silicon/robot/proc/notify_ai", function notify_ai(f: Frame, notifytype: Value, oldname: Value, newname: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "connected_ai"))) {
		return live(f.dot);
	}
	$0 = live(notifytype);
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "connected_ai"), fmt("<br><br><span class='notice'>NOTICE - New cyborg connection detected: <a href='?src=＃;track=＀'>＀</a></span><br>", [rt.sv(f, "connected_ai"), rt.call(f, P("/proc/html_encode"), null, [rt.sv(f, "name")]), rt.sv(f, "name")])]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "connected_ai"), fmt("<br><br><span class='notice'>NOTICE - Cyborg module change detected: ＀ has loaded the ＀ module.</span><br>", [rt.sv(f, "name"), rt.sv(f, "designation")])]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "connected_ai"), fmt("<br><br><span class='notice'>NOTICE - Cyborg reclassification detected: ＀ is now designated as ＀.</span><br>", [live(oldname), live(newname)])]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "connected_ai"), fmt("<br><br><span class='notice'>NOTICE - New cyborg shell detected: <a href='?src=＃;track=＀'>＀</a></span><br>", [rt.sv(f, "connected_ai"), rt.call(f, P("/proc/html_encode"), null, [rt.sv(f, "name")]), rt.sv(f, "name")])]);
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/canUseTopic  (code/modules/mob/living/silicon/robot/robot.dm:853)
rt.def("/mob/living/silicon/robot/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	f.vars = () => [be_close];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if (((truthy(rt.sv(f, "stat")) || truthy(rt.sv(f, "lockcharge"))) || truthy(rt.sv(f, "low_power_mode")))) {
		return live(f.dot);
	}
	if ((truthy(live(be_close)) && !rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)]), 1))) {
		return live(f.dot);
	}
	return 1;
});

// /mob/living/silicon/robot/proc/updatehealth  (code/modules/mob/living/silicon/robot/robot.dm:860)  may sleep
rt.def("/mob/living/silicon/robot/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.lt(rt.sv(f, "health"), multiply(rt.sv(f, "maxHealth"), 0.5))) return f.dot;
	if (truthy((yield* g.srcCall(f, "uneq_module", rt.index(rt.sv(f, "held_items"), 3))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>SYSTEM ERROR: Module 3 OFFLINE.</span>"]);
	}
	if (!rt.lt(rt.sv(f, "health"), 0)) return f.dot;
	if (truthy((yield* g.srcCall(f, "uneq_module", rt.index(rt.sv(f, "held_items"), 2))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>SYSTEM ERROR: Module 2 OFFLINE.</span>"]);
	}
	if (!rt.lt(rt.sv(f, "health"), multiply(rt.neg(rt.sv(f, "maxHealth")), 0.5))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "uneq_module", rt.index(rt.sv(f, "held_items"), 1))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>CRITICAL ERROR: All modules OFFLINE.</span>"]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/update_sight  (code/modules/mob/living/silicon/robot/robot.dm:872)
rt.def("/mob/living/silicon/robot/proc/update_sight", function update_sight(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "sight", 28);
		rt.setSv(f, "see_in_dark", 8);
		rt.setSv(f, "see_invisible", 60);
		return live(f.dot);
	}
	rt.setSv(f, "see_invisible", rt.initial(f, live(f.src), "see_invisible"));
	rt.setSv(f, "see_in_dark", rt.initial(f, live(f.src), "see_in_dark"));
	rt.setSv(f, "sight", rt.initial(f, live(f.src), "sight"));
	if (!isEqual(rt.fv(f, "eye", rt.sv(f, "client")), live(f.src))) {
		if (truthy(rt.callName(f, (A = rt.fv(f, "eye", rt.sv(f, "client"))), "update_remote_sight", [live(f.src)]))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "sight_mode"), 1))) {
		(rt.modSrcVar(f, "sight", 16, rt.bitOr));
		rt.setSv(f, "lighting_alpha", 0);
		rt.setSv(f, "see_in_dark", 1);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "sight_mode"), 8))) {
		(rt.modSrcVar(f, "sight", 8, rt.bitOr));
		rt.setSv(f, "lighting_alpha", 128);
		rt.setSv(f, "see_in_dark", 1);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "sight_mode"), 4))) {
		(rt.modSrcVar(f, "sight", 28, rt.bitOr));
		rt.setSv(f, "see_invisible", 25);
		rt.setSv(f, "see_in_dark", 8);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "sight_mode"), 2))) {
		(rt.modSrcVar(f, "sight", 4, rt.bitOr));
		rt.setSv(f, "see_invisible", rt.call(f, P("/proc/min"), null, [rt.sv(f, "see_invisible"), 25]));
		rt.setSv(f, "see_in_dark", 8);
	}
	if (truthy(rt.sv(f, "see_override"))) {
		rt.setSv(f, "see_invisible", rt.sv(f, "see_override"));
	}
	rt.callSrc(f, "sync_lighting_plane_alpha", []);
	return f.dot;
});

// /mob/living/silicon/robot/proc/update_stat  (code/modules/mob/living/silicon/robot/robot.dm:914)  may sleep
rt.def("/mob/living/silicon/robot/proc/update_stat", function* update_stat(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		if (rt.le(rt.sv(f, "health"), rt.neg(rt.sv(f, "maxHealth")))) {
			yield* g.srcCall(f, "death");
			return live(f.dot);
		}
		if ((((truthy((yield* g.srcCall(f, "IsUnconscious"))) || truthy((yield* g.srcCall(f, "IsStun")))) || truthy((yield* g.srcCall(f, "IsKnockdown")))) || rt.gt((yield* g.srcCall(f, "getOxyLoss")), multiply(rt.sv(f, "maxHealth"), 0.5)))) {
			if (isEqual(rt.sv(f, "stat"), 0)) {
				rt.setSv(f, "stat", 1);
				yield* g.srcCall(f, "blind_eyes", 1);
				yield* g.srcCall(f, "update_canmove");
				yield* g.srcCall(f, "update_headlamp");
			}
		} else {
			if (isEqual(rt.sv(f, "stat"), 1)) {
				rt.setSv(f, "stat", 0);
				yield* g.srcCall(f, "adjust_blindness", -1);
				yield* g.srcCall(f, "update_canmove");
				yield* g.srcCall(f, "update_headlamp");
			}
		}
	}
	yield* g.srcCall(f, "diag_hud_set_status");
	yield* g.srcCall(f, "diag_hud_set_health");
	yield* g.srcCall(f, "diag_hud_set_aishell");
	yield* g.srcCall(f, "update_health_hud");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/revive  (code/modules/mob/living/silicon/robot/robot.dm:938)  may sleep
rt.def("/mob/living/silicon/robot/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if ((truthy(rt.sv(f, "camera")) && !truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Camera"]))))) {
		yield* g.callName(f, rt.sv(f, "camera"), "toggle_cam", [live(f.src), 0]);
	}
	yield* g.srcCall(f, "update_headlamp");
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "locked", 1);
	}
	yield* g.srcCall(f, "notify_ai", 1);
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/silicon/robot/proc/fully_replace_character_name  (code/modules/mob/living/silicon/robot/robot.dm:948)
rt.def("/mob/living/silicon/robot/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), rt.sv(f, "real_name"))) {
		rt.callSrc(f, "notify_ai", [3, live(f.args[0]), live(f.args[1])]);
	}
	if (truthy(rt.sv(f, "camera"))) {
		rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
	}
	rt.setSv(f, "custom_name", live(f.args[1]));
	return f.dot;
}, false, { args: ["oldname", "newname"] });

// /mob/living/silicon/robot/proc/ResetModule  (code/modules/mob/living/silicon/robot/robot.dm:957)  may sleep
rt.def("/mob/living/silicon/robot/proc/ResetModule", function* ResetModule(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	yield* g.srcCall(f, "uneq_all");
	rt.setSv(f, "shown_robot_modules", 0);
	if (truthy(rt.sv(f, "hud_used"))) {
		yield* g.callName(f, rt.sv(f, "hud_used"), "update_robot_modules_display", []);
	}
	yield* g.callName(f, rt.sv(f, "module"), "transform_to", [T("/obj/item/weapon/robot_module")]);
	I = null;
	rt.forList(f, 0, rt.sv(f, "upgrades"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "upgrades"), "Cut", []);
	rt.setSv(f, "speed", 0);
	rt.setSv(f, "ionpulse", 0);
	yield* g.srcCall(f, "revert_shell");
	return 1;
}, true);

// /mob/living/silicon/robot/proc/has_module  (code/modules/mob/living/silicon/robot/robot.dm:976)
rt.def("/mob/living/silicon/robot/proc/has_module", function has_module(f: Frame) {
	if ((!truthy(rt.sv(f, "module")) || isEqual(rt.fv(f, "type", rt.sv(f, "module")), T("/obj/item/weapon/robot_module")))) {
		f.dot = 0;
	} else {
		f.dot = 1;
	}
	return f.dot;
});

// /mob/living/silicon/robot/proc/update_module_innate  (code/modules/mob/living/silicon/robot/robot.dm:984)
rt.def("/mob/living/silicon/robot/proc/update_module_innate", function update_module_innate(f: Frame) {
	rt.setSv(f, "designation", rt.fv(f, "name", rt.sv(f, "module")));
	if (truthy(rt.sv(f, "hands"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "hands"), rt.fv(f, "moduleselect_icon", rt.sv(f, "module")));
	}
	if (truthy(rt.fv(f, "can_be_pushed", rt.sv(f, "module")))) {
		(rt.modSrcVar(f, "status_flags", 8, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "status_flags", 16777207, rt.bitAnd));
	}
	if (truthy(rt.fv(f, "clean_on_move", rt.sv(f, "module")))) {
		(rt.modSrcVar(f, "flags", 2048, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "flags", 16775167, rt.bitAnd));
	}
	rt.setSv(f, "hat_offset", rt.fv(f, "hat_offset", rt.sv(f, "module")));
	rt.setSv(f, "magpulse", rt.fv(f, "magpulsing", rt.sv(f, "module")));
	rt.callSrc(f, "updatename", []);
	return f.dot;
});

// /mob/living/silicon/robot/proc/place_on_head  (code/modules/mob/living/silicon/robot/robot.dm:1003)  may sleep
rt.def("/mob/living/silicon/robot/proc/place_on_head", function* place_on_head(f: Frame, new_hat: Value) {
	f.vars = () => [new_hat];
	if (truthy(rt.sv(f, "hat"))) {
		yield* g.callName(f, rt.sv(f, "hat"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.setSv(f, "hat", live(new_hat));
	yield* g.callName(f, live(new_hat), "forceMove", [live(f.src)]);
	yield* g.srcCall(f, "update_icons");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/make_shell  (code/modules/mob/living/silicon/robot/robot.dm:1009)  may sleep
rt.def("/mob/living/silicon/robot/proc/make_shell", function* make_shell(f: Frame, board: Value) {
	f.vars = () => [board];
	if (!truthy(live(board))) {
		(rt.modSrcVar(f, "upgrades", (yield* g.new_(f, T("/obj/item/borg/upgrade/ai"), [live(f.src)])), rt.bitOr));
	}
	rt.setSv(f, "shell", 1);
	rt.setSv(f, "braintype", "AI Shell");
	rt.setSv(f, "name", fmt("＀ AI Shell ＀", [rt.sv(f, "designation"), (yield* g.call(f, P("/proc/rand"), null, [100, 999]))]));
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	(rt.modGl("available_ai_shells", live(f.src), rt.bitOr));
	if (truthy(rt.sv(f, "camera"))) {
		rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
	}
	yield* g.srcCall(f, "diag_hud_set_aishell");
	yield* g.srcCall(f, "notify_ai", 4);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/revert_shell  (code/modules/mob/living/silicon/robot/robot.dm:1022)  may sleep
rt.def("/mob/living/silicon/robot/proc/revert_shell", function* revert_shell(f: Frame) {
	let boris: Value = null;
	let $e: any;
	f.vars = () => [boris, $e];
	if (!truthy(rt.sv(f, "shell"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "undeploy");
	boris = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/borg/upgrade/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		boris = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(boris)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "shell", 0);
	(rt.modGl("available_ai_shells", live(f.src), subtract));
	rt.setSv(f, "name", fmt("Unformatted Cyborg ＀", [(yield* g.call(f, P("/proc/rand"), null, [100, 999]))]));
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	if (truthy(rt.sv(f, "camera"))) {
		rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
	}
	yield* g.srcCall(f, "diag_hud_set_aishell");
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/deploy_init  (code/modules/mob/living/silicon/robot/robot.dm:1037)  may sleep
rt.def("/mob/living/silicon/robot/proc/deploy_init", function* deploy_init(f: Frame, AI: Value) {
	let chan: Value = null;
	let $e: any;
	f.vars = () => [AI, chan, $e];
	rt.setSv(f, "real_name", fmt("＀ shell ＀ - ＀", [rt.fv(f, "real_name", live(AI)), (yield* g.call(f, P("/proc/rand"), null, [100, 999])), rt.sv(f, "designation")]));
	rt.setSv(f, "name", rt.sv(f, "real_name"));
	if (truthy(rt.sv(f, "camera"))) {
		rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
	}
	rt.setSv(f, "mainframe", live(AI));
	rt.setSv(f, "deployed", 1);
	rt.setSv(f, "connected_ai", rt.sv(f, "mainframe"));
	(rt.modField(f, rt.sv(f, "mainframe"), "connected_robots", live(f.src), rt.bitOr));
	rt.setSv(f, "lawupdate", 1);
	yield* g.srcCall(f, "lawsync");
	if ((truthy(rt.sv(f, "radio")) && truthy(rt.fv(f, "radio", live(AI))))) {
		if (truthy(rt.gv(f, "syndie", rt.fv(f, "radio", live(AI))))) {
			yield* g.callName(f, rt.sv(f, "radio"), "make_syndie", []);
		}
		rt.setFv(f, "subspace_transmission", rt.sv(f, "radio"), 1);
		rt.setFv(f, "channels", rt.sv(f, "radio"), rt.gv(f, "channels", rt.fv(f, "radio", live(AI))));
		chan = null;
		rt.forList(f, 0, rt.fv(f, "channels", rt.sv(f, "radio")));
		while (($e = rt.next(f, 0)) !== undefined) {
			chan = $e;
			rt.setAt(rt.fv(f, "secure_radio_connections", rt.sv(f, "radio")), live(chan), (yield* g.call(f, P("/proc/add_radio"), null, [rt.sv(f, "radio"), rt.index(rt.gl("radiochannels"), live(chan))])));
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "diag_hud_set_aishell");
	yield* g.callName(f, rt.sv(f, "undeployment_action"), "Grant", [live(f.src)]);
	return f.dot;
}, true);

rt.type(162, "/datum/action/innate/undeployment", "/datum/action/innate", {
	name: "Disconnect from shell",
	desc: "Stop controlling your shell and resume normal core operations.",
	button_icon_state: "ai_core",
});

// /datum/action/innate/undeployment/proc/Trigger  (code/modules/mob/living/silicon/robot/robot.dm:1064)  may sleep
rt.def("/datum/action/innate/undeployment/proc/Trigger", function* Trigger(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	yield* g.callName(f, (R = rt.sv(f, "owner")), "undeploy", []);
	return 1;
}, true);

// /mob/living/silicon/robot/proc/undeploy  (code/modules/mob/living/silicon/robot/robot.dm:1074)  may sleep
rt.def("/mob/living/silicon/robot/proc/undeploy", function* undeploy(f: Frame) {
	if (((!truthy(rt.sv(f, "deployed")) || !truthy(rt.sv(f, "mind"))) || !truthy(rt.sv(f, "mainframe")))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "redeploy_action", rt.sv(f, "mainframe")), "Grant", [rt.sv(f, "mainframe")]);
	rt.setFv(f, "last_used_shell", rt.fv(f, "redeploy_action", rt.sv(f, "mainframe")), live(f.src));
	yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [rt.sv(f, "mainframe")]);
	rt.setSv(f, "deployed", 0);
	rt.setFv(f, "deployed_shell", rt.sv(f, "mainframe"), null);
	yield* g.callName(f, rt.sv(f, "undeployment_action"), "Remove", [live(f.src)]);
	if (truthy(rt.sv(f, "radio"))) {
		yield* g.callName(f, rt.sv(f, "radio"), "recalculateChannels", []);
	}
	if (truthy(rt.sv(f, "camera"))) {
		rt.setFv(f, "c_tag", rt.sv(f, "camera"), rt.sv(f, "real_name"));
	}
	yield* g.srcCall(f, "diag_hud_set_aishell");
	yield* g.callName(f, rt.sv(f, "mainframe"), "diag_hud_set_deployed", []);
	if (truthy(rt.fv(f, "laws", rt.sv(f, "mainframe")))) {
		yield* g.callName(f, rt.fv(f, "laws", rt.sv(f, "mainframe")), "show_laws", [rt.sv(f, "mainframe")]);
	}
	rt.setSv(f, "mainframe", null);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/attack_ai  (code/modules/mob/living/silicon/robot/robot.dm:1093)  may sleep
rt.def("/mob/living/silicon/robot/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let AI: Value = null;
	f.vars = () => [user, AI];
	if (!(truthy(rt.sv(f, "shell")) && (!truthy(rt.sv(f, "connected_ai")) || isEqual(rt.sv(f, "connected_ai"), live(user))))) return f.dot;
	yield* g.callName(f, (AI = live(user)), "deploy_to_shell", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/MouseDrop_T  (code/modules/mob/living/silicon/robot/robot.dm:1101)  may sleep
rt.def("/mob/living/silicon/robot/proc/MouseDrop_T", function* MouseDrop_T(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "buckled_mobs")) ? 1 : 0)) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "buckle_mob", live(f.args[0]));
	return f.dot;
}, true, { args: ["M", "user"] });

// /mob/living/silicon/robot/proc/buckle_mob  (code/modules/mob/living/silicon/robot/robot.dm:1106)  may sleep
rt.def("/mob/living/silicon/robot/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	f.vars = () => [M, force, check_loc];
	if (live(force) === null) {
		force = 0;
	}
	if (live(check_loc) === null) {
		check_loc = 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(M), rt.sv(f, "can_ride_typecache")])))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ really can't seem to mount the ＀...</span>", [live(M), live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "riding_datum"))) {
		rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/cyborg"), [live(f.src)])));
	}
	if (truthy(rt.sv(f, "buckled_mobs"))) {
		if (rt.ge(rt.len(f, rt.sv(f, "buckled_mobs")), rt.sv(f, "max_buckled_mobs"))) {
			return live(f.dot);
		}
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "incapacitated")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(M), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "module"))) {
		if (!truthy(rt.fv(f, "allow_riding", rt.sv(f, "module")))) {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='boldwarning'>Unfortunately, ＀ just can't seem to hold onto ＀!</span>", [live(M), live(f.src)])]);
			return live(f.dot);
		}
	}
	if ((truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)) && !truthy((yield* g.callName(f, rt.sv(f, "riding_datum"), "equip_buckle_inhands", [live(M), 1]))))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='boldwarning'>＀ can't climb onto ＀ because ＀ hands are full!</span>", [live(M), live(f.src), (yield* g.callName(f, live(M), "p_their", []))])]);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [live(M), live(force), live(check_loc)]));
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/unbuckle_mob  (code/modules/mob/living/silicon/robot/robot.dm:1132)  may sleep
rt.def("/mob/living/silicon/robot/proc/unbuckle_mob", function* unbuckle_mob(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "riding_datum"))) {
			yield* g.callName(f, rt.sv(f, "riding_datum"), "unequip_buckle_inhands", [live(user)]);
			yield* g.callName(f, rt.sv(f, "riding_datum"), "restore_position", [live(user)]);
		}
	}
	f.dot = (yield* g.callSuper(f, [live(user)]));
	return f.dot;
}, true);

// /mob/living/silicon/robot/proc/TryConnectToAI  (code/modules/mob/living/silicon/robot/robot.dm:1139)  may sleep
rt.def("/mob/living/silicon/robot/proc/TryConnectToAI", function* TryConnectToAI(f: Frame) {
	rt.setSv(f, "connected_ai", (yield* g.call(f, P("/proc/select_active_ai_with_fewest_borgs"), null, [])));
	if (truthy(rt.sv(f, "connected_ai"))) {
		rt.modField(f, rt.sv(f, "connected_ai"), "connected_robots", live(f.src), add);
		yield* g.srcCall(f, "lawsync");
		rt.setSv(f, "lawupdate", 1);
		return 1;
	}
	return 0;
}, true);
