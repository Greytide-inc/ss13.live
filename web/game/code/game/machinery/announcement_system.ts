// From code/game/machinery/announcement_system.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalannouncement_systems  (code/game/machinery/announcement_system.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalannouncement_systems", function InitGlobalannouncement_systems(f: Frame) {
	rt.setGl("announcement_systems", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "announcement_systems", add);
	return f.dot;
});

rt.type(10775, "/obj/machinery/announcement_system", "/obj/machinery", {
	radio: null,
	arrival: "%PERSON has signed up as %RANK",
	arrivalToggle: 1,
	newhead: "%PERSON, %RANK, is the department head.",
	newheadToggle: 1,
	greenlight: "Light_Green",
	pinklight: "Light_Pink",
	errorlight: "Error_Red",
	anchored: 1,
	verb_say: "coldly states",
	verb_ask: "queries",
	verb_exclaim: "alarms",
	density: 1,
	name: "１Automated Announcement System",
	desc: "An automated announcement system that handles minor announcements over the radio.",
	icon: rt.rsc("icons/obj/machines/telecomms.dmi"),
	icon_state: "AAS_On",
	idle_power_usage: 20,
	active_power_usage: 50,
});

// /obj/machinery/announcement_system/proc/New  (code/game/machinery/announcement_system.dm:29)  may sleep
rt.def("/obj/machinery/announcement_system/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("announcement_systems", live(f.src), add);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio/headset/ai"), [live(f.src)])));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/announcement_system"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(6714, "/obj/item/weapon/circuitboard/machine/announcement_system", "/obj/item/weapon/circuitboard/machine", {
	name: "Announcement System (Machine Board)",
	build_path: rt.typePath("/obj/machinery/announcement_system"),
	origin_tech: "programming=3;bluespace=3;magnets=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/announcement_system/proc/<init>  (code/game/machinery/announcement_system.dm:42)
rt.def("/obj/item/weapon/circuitboard/machine/announcement_system/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/announcement_system/proc/update_icon  (code/game/machinery/announcement_system.dm:47)
rt.def("/obj/machinery/announcement_system/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.callSrc(f, "is_operational", []))) {
		if (truthy(rt.sv(f, "panel_open"))) {
			$0 = "AAS_On_Open";
		} else {
			$0 = "AAS_On";
		}
		rt.setSv(f, "icon_state", $0);
	} else {
		if (truthy(rt.sv(f, "panel_open"))) {
			$0 = "AAS_Off_Open";
		} else {
			$0 = "AAS_Off";
		}
		rt.setSv(f, "icon_state", $0);
	}
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "arrivalToggle"))) {
		rt.callSrc(f, "add_overlay", [rt.sv(f, "greenlight")]);
	}
	if (truthy(rt.sv(f, "newheadToggle"))) {
		rt.callSrc(f, "add_overlay", [rt.sv(f, "pinklight")]);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.sv(f, "errorlight")]);
	return f.dot;
});

// /obj/machinery/announcement_system/proc/Destroy  (code/game/machinery/announcement_system.dm:64)  may sleep
rt.def("/obj/machinery/announcement_system/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "radio")]);
	rt.setSv(f, "radio", null);
	(rt.modGl("announcement_systems", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/announcement_system/proc/power_change  (code/game/machinery/announcement_system.dm:69)
rt.def("/obj/machinery/announcement_system/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/announcement_system/proc/attackby  (code/game/machinery/announcement_system.dm:73)  may sleep
rt.def("/obj/machinery/announcement_system/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "panel_open"))) {
			$1 = "open";
		} else {
			$1 = "close";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the maintenance hatch of ＀.</span>", [$1, live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
			return live(f.dot);
		} else {
			if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) && truthy(rt.sv(f, "panel_open"))) && truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You reset ＀'s firmware.</span>", [live(f.src)])]);
				(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
				yield* g.srcCall(f, "update_icon");
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/machinery/announcement_system/proc/CompileText  (code/game/machinery/announcement_system.dm:88)
rt.def("/obj/machinery/announcement_system/proc/CompileText", function CompileText(f: Frame, str: Value, user: Value, rank: Value) {
	f.vars = () => [str];
	return (str = rt.call(f, P("/proc/replacetext"), null, [(str = rt.call(f, P("/proc/replacetext"), null, [live(str), "%PERSON", fmt("＀", [live(user)])])), "%RANK", fmt("＀", [live(rank)])]));
});

// /obj/machinery/announcement_system/proc/announce  (code/game/machinery/announcement_system.dm:93)  may sleep
rt.def("/obj/machinery/announcement_system/proc/announce", function* announce(f: Frame, message_type: Value, user: Value, rank: Value, channels: Value) {
	let message: Value = null, channel: Value = null;
	let $e: any;
	f.vars = () => [message_type, user, rank, channels, message, channel, $e];
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		return live(f.dot);
	}
	message = null;
	if ((isEqual(live(message_type), "ARRIVAL") && truthy(rt.sv(f, "arrivalToggle")))) {
		message = (yield* g.srcCall(f, "CompileText", rt.sv(f, "arrival"), live(user), live(rank)));
	} else {
		if ((isEqual(live(message_type), "NEWHEAD") && truthy(rt.sv(f, "newheadToggle")))) {
			message = (yield* g.srcCall(f, "CompileText", rt.sv(f, "newhead"), live(user), live(rank)));
		} else {
			if (isEqual(live(message_type), "ARRIVALS_BROKEN")) {
				message = "The arrivals shuttle has been damaged. Docking for repairs...";
			}
		}
	}
	if (isEqual(rt.len(f, live(channels)), 0)) {
		yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), live(message), null, rt.list("robot"), (yield* g.srcCall(f, "get_default_language"))]);
	} else {
		channel = null;
		rt.forList(f, 0, live(channels));
		while (($e = rt.next(f, 0)) !== undefined) {
			channel = $e;
			yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), live(message), live(channel), rt.list("robot"), (yield* g.srcCall(f, "get_default_language"))]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { argTypes: [{  }, {  }, {  }, { path: "/list" }] });

// /obj/machinery/announcement_system/proc/interact  (code/game/machinery/announcement_system.dm:114)  may sleep
rt.def("/obj/machinery/announcement_system/proc/interact", function* interact(f: Frame, user: Value) {
	let contents: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, contents, popup, $0, $1];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ buzzes.</span>", [live(f.src)]), "<span class='italics'>You hear a faint buzz.</span>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-two.ogg"), 50, 1]);
		return live(f.dot);
	}
	$0 = live(f.src);
	if (truthy(rt.sv(f, "arrivalToggle"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	contents = fmt("Arrival Announcement:  <A href='?src=＃;ArrivalT-Topic=1'>(＀)</a><br>\n<A href='?src=＃;ArrivalTopic=1'>＀</a><br><br>\n", [$0, $1, live(f.src), rt.sv(f, "arrival")]);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "newheadToggle"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	contents = rt.modify(live(contents), fmt("Departmental Head Announcement:  <A href='?src=＃;NewheadT-Topic=1'>(＀)</a><br>\n<A href='?src=＃;NewheadTopic=1'>＀</a><br><br>\n", [$0, $1, live(f.src), rt.sv(f, "newhead")]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "announcement_config", "Automated Announcement Configuration", 370, 220]))), "set_content", [live(contents)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/announcement_system/proc/Topic  (code/game/machinery/announcement_system.dm:128)  may sleep
rt.def("/obj/machinery/announcement_system/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let NewMessage: Value = null;
	f.vars = () => [href, href_list, NewMessage];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ buzzes.</span>", [live(f.src)]), "<span class='italics'>You hear a faint buzz.</span>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-two.ogg"), 50, 1]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "ArrivalTopic"))) {
		NewMessage = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter in the arrivals announcement configuration.", "Arrivals Announcement Config", rt.sv(f, "arrival")]));
		if (((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) && (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)])))))) {
			return live(f.dot);
		}
		if (truthy(live(NewMessage))) {
			rt.setSv(f, "arrival", live(NewMessage));
		}
	} else {
		if (truthy(rt.at(live(href_list), "NewheadTopic"))) {
			NewMessage = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter in the departmental head announcement configuration.", "Head Departmental Announcement Config", rt.sv(f, "newhead")]));
			if (((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) && (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)])))))) {
				return live(f.dot);
			}
			if (truthy(live(NewMessage))) {
				rt.setSv(f, "newhead", live(NewMessage));
			}
		} else {
			if (truthy(rt.at(live(href_list), "NewheadT-Topic"))) {
				rt.setSv(f, "newheadToggle", (!truthy(rt.sv(f, "newheadToggle")) ? 1 : 0));
				yield* g.srcCall(f, "update_icon");
			} else {
				if (truthy(rt.at(live(href_list), "ArrivalT-Topic"))) {
					rt.setSv(f, "arrivalToggle", (!truthy(rt.sv(f, "arrivalToggle")) ? 1 : 0));
					yield* g.srcCall(f, "update_icon");
				}
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "interact", live(f.usr));
	return f.dot;
}, true);

// /obj/machinery/announcement_system/proc/attack_robot  (code/game/machinery/announcement_system.dm:157)  may sleep
rt.def("/obj/machinery/announcement_system/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = (yield* g.srcCall(f, "attack_ai", live(user)));
	return f.dot;
}, true);

// /obj/machinery/announcement_system/proc/attack_ai  (code/game/machinery/announcement_system.dm:160)  may sleep
rt.def("/obj/machinery/announcement_system/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)]))))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s firmware appears to be malfunctioning!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/announcement_system/proc/act_up  (code/game/machinery/announcement_system.dm:168)
rt.def("/obj/machinery/announcement_system/proc/act_up", function act_up(f: Frame) {
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update_icon", []);
	rt.setSv(f, "arrival", rt.op(f, "PickUnweighted", [3], ["#!@%ERR-34%2 CANNOT LOCAT@# JO# F*LE!", "CRITICAL ERROR 99.", "ERR)#: DA#AB@#E NOT F(*ND!"]));
	rt.setSv(f, "newhead", rt.op(f, "PickUnweighted", [3], ["OV#RL()D: [UNKNOWN??] DET*#CT)D!", "ER)#R - B*@ TEXT F*O(ND!", "AAS.exe is not responding. NanoOS is searching for a solution to the problem."]));
	return f.dot;
});

// /obj/machinery/announcement_system/proc/emp_act  (code/game/machinery/announcement_system.dm:175)  may sleep
rt.def("/obj/machinery/announcement_system/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.srcCall(f, "act_up");
	}
	yield* g.callSuper(f, [live(severity)]);
	return f.dot;
}, true);

// /obj/machinery/announcement_system/proc/emag_act  (code/game/machinery/announcement_system.dm:180)
rt.def("/obj/machinery/announcement_system/proc/emag_act", function emag_act(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.callSrc(f, "act_up", []);
	return f.dot;
});
