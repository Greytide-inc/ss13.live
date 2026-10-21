// From code/game/machinery/computer/communications.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10378, "/obj/machinery/computer/communications", "/obj/machinery/computer", {
	authenticated: 0,
	auth_id: "Unknown",
	messagetitle: null,
	messagetext: null,
	currmsg: 0,
	aicurrmsg: 0,
	message_cooldown: 0,
	ai_message_cooldown: 0,
	tmp_alertlevel: 0,
	STATE_DEFAULT: 1,
	STATE_CALLSHUTTLE: 2,
	STATE_CANCELSHUTTLE: 3,
	STATE_MESSAGELIST: 4,
	STATE_VIEWMESSAGE: 5,
	STATE_DELMESSAGE: 6,
	STATE_STATUSDISPLAY: 7,
	STATE_ALERT_LEVEL: 8,
	STATE_CONFIRM_LEVEL: 9,
	STATE_TOGGLE_EMERGENCY: 10,
	STATE_PURCHASE: 11,
	status_display_freq: "1435",
	stat_msg1: null,
	stat_msg2: null,
	state: 1,
	aistate: 1,
	light_color: "#6496FA",
	name: "communications console",
	desc: "A console used for high-priority announcements and emergencies.",
	icon_screen: "comm",
	icon_keyboard: "tech_key",
	req_access: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/communications"),
}, { const: ["STATE_DEFAULT","STATE_CALLSHUTTLE","STATE_CANCELSHUTTLE","STATE_MESSAGELIST","STATE_VIEWMESSAGE","STATE_DELMESSAGE","STATE_STATUSDISPLAY","STATE_ALERT_LEVEL","STATE_CONFIRM_LEVEL","STATE_TOGGLE_EMERGENCY","STATE_PURCHASE"] });

// /obj/machinery/computer/communications/proc/<init>  (code/game/machinery/computer/communications.dm:11)
rt.def("/obj/machinery/computer/communications/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messagetitle", rt.list());
	$0 = $0;
	rt.setSv(f, "messagetext", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(19));
	return f.dot;
});

// /obj/machinery/computer/communications/proc/checkCCcooldown  (code/game/machinery/computer/communications.dm:39)
rt.def("/obj/machinery/computer/communications/proc/checkCCcooldown", function checkCCcooldown(f: Frame) {
	let CM: Value = null;
	f.vars = () => [CM];
	if (rt.gt(add(rt.gv(f, "lastTimeUsed", (CM = rt.sv(f, "circuit"))), 600), rt.worldTime(f))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/computer/communications/proc/New  (code/game/machinery/computer/communications.dm:45)  may sleep
rt.def("/obj/machinery/computer/communications/proc/New", function* New(f: Frame) {
	rt.modGl("shuttle_caller_list", live(f.src), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/computer/communications/proc/process  (code/game/machinery/computer/communications.dm:49)  may sleep
rt.def("/obj/machinery/computer/communications/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (isEqual(rt.sv(f, "state"), 7)) return f.dot;
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/communications/proc/Topic  (code/game/machinery/computer/communications.dm:55)  may sleep
rt.def("/obj/machinery/computer/communications/proc/Topic", function* Topic(f: Frame) {
	let CM: Value = null, M: Value = null, I: Value = null, AI: Value = null, pda: Value = null, old_level: Value = null, input: Value = null, shuttles: Value = null, S: Value = null, M_3: Value = null, title: Value = null, text: Value = null, old_level_1: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [CM, M, I, AI, pda, old_level, input, shuttles, S, M_3, title, text, old_level_1, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.sv(f, "z"), 2) && !isEqual(rt.sv(f, "z"), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!"]);
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "operation"))) {
		return live(f.dot);
	}
	CM = rt.sv(f, "circuit");
	// tg_js: the page only showed a button to someone who may press it; an href can name any operation, so each is checked here.
	// The ai- operations are the silicon's page (no login); a human may not send them. Emergency maintenance access and restoring the
	// routing are captain functions, the status display needs a login (a silicon's setstat/setmsg never log in).
	{
		const opn = String(rt.at(live(f.args[1]), "operation")), sil = truthy(rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0), au = rt.sv(f, "authenticated");
		if (opn.startsWith("ai-") && !sil) return live(f.dot);
		if (["enableemergency", "disableemergency", "RestoreBackup"].includes(opn) && !isEqual(au, 2)) return live(f.dot);
		if (["setstat", "setmsg1", "setmsg2"].includes(opn) && !sil && !truthy(au)) return live(f.dot);
	}
	$0 = rt.at(live(f.args[1]), "operation");
	if ($0 === "main") {
		rt.setFv(f, "state", live(f.src), 1);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
	} else if ($0 === "login") {
		M = live(f.usr);
		if (!truthy((rt.istype((I = (yield* g.callName(f, live(M), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			I = (yield* g.callName(f, live(M), "get_idcard", []));
		}
		if ((truthy(live(I)) && truthy((rt.istype(live(I), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			if (truthy((yield* g.callName(f, live(f.src), "check_access", [live(I)])))) {
				rt.setSv(f, "authenticated", 1);
				rt.setSv(f, "auth_id", fmt("＀ (＀)", [rt.fv(f, "registered_name", live(I)), rt.fv(f, "assignment", live(I))]));
				if (truthy((rt.isIn(f, 20, rt.fv(f, "access", live(I))) ? 1 : 0))) {
					rt.setSv(f, "authenticated", 2);
				}
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_on.ogg"), 50, 0]);
			}
			if (truthy(rt.fv(f, "emagged", live(f.src)))) {
				rt.setSv(f, "authenticated", 2);
				rt.setSv(f, "auth_id", "Unknown");
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀ lets out a quiet alarm as its login is overriden.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_on.ogg"), 50, 0]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_alert.ogg"), 25, 0]);
				if (truthy(rt.op(f, "Prob", [], [25]))) {
					AI = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/active_ais"), null, [])), T("/mob/living/silicon/ai"));
					while (($e = rt.next(f, 0)) !== undefined) {
						AI = $e;
						rt.op(f, "Output", [], [live(AI), (yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/machines/terminal_alert.ogg"), "volume", 10], rt.Args.Named))], false);
					}
					rt.endFor(f, 0);
				}
			}
		}
	} else if ($0 === "logout") {
		rt.setSv(f, "authenticated", 0);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_off.ogg"), 50, 0]);
	} else if ($0 === "swipeidseclevel") {
		M = live(f.usr);
		if (truthy((rt.istype((I = (yield* g.callName(f, live(M), "get_active_held_item", []))), T("/obj/item/device/pda")) ? 1 : 0))) {
			I = rt.gv(f, "id", (pda = live(I)));
		}
		if ((truthy(live(I)) && truthy((rt.istype(live(I), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			if (truthy((rt.isIn(f, 20, rt.fv(f, "access", live(I))) ? 1 : 0))) {
				old_level = rt.gl("security_level");
				if (!truthy(rt.sv(f, "tmp_alertlevel"))) {
					rt.setSv(f, "tmp_alertlevel", 0);
				}
				if (rt.lt(rt.sv(f, "tmp_alertlevel"), 0)) {
					rt.setSv(f, "tmp_alertlevel", 0);
				}
				if (rt.gt(rt.sv(f, "tmp_alertlevel"), 1)) {
					rt.setSv(f, "tmp_alertlevel", 1);
				}
				yield* g.call(f, P("/proc/set_security_level"), null, [rt.sv(f, "tmp_alertlevel")]);
				if (!isEqual(rt.gl("security_level"), live(old_level))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Authorization confirmed. Modifying security level.</span>"]);
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
					yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has changed the security level to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_security_level"), null, []))])]);
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has changed the security level to ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_security_level"), null, []))])]);
				}
				rt.setSv(f, "tmp_alertlevel", 0);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You are not authorized to do this!</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
				rt.setSv(f, "tmp_alertlevel", 0);
			}
			rt.setSv(f, "state", 1);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You need to swipe your ID!</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
		}
	} else if ($0 === "announce") {
		if (isEqual(rt.fv(f, "authenticated", live(f.src)), 2)) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0]);
			yield* g.srcCall(f, "make_announcement", live(f.usr));
		}
	} else if ($0 === "purchase_menu") {
		rt.setSv(f, "state", 11);
	} else if ($0 === "buyshuttle") {
		if (isEqual(rt.sv(f, "authenticated"), 2)) {
			shuttles = (yield* g.call(f, P("/proc/flatten_list"), null, [rt.fv(f, "shuttle_templates", rt.gl("SSmapping"))]));
			if ((truthy((S = (truthy(rt.at(live(f.args[1]), "shuttle_id")) ? rt.index(rt.fv(f, "shuttle_templates", rt.gl("SSmapping")), rt.at(live(f.args[1]), "shuttle_id")) : rt.locateIn(f, rt.at(live(f.args[1]), "chosen_shuttle"), live(shuttles))))) && truthy((rt.istype(live(S), T("/datum/map_template/shuttle")) ? 1 : 0)))) {
				if (!truthy(rt.gv(f, "can_be_bought", live(S))) || !rt.lt(rt.fv(f, "credit_cost", live(S)), 9.999999848243207e+30)) return live(f.dot); // tg_js: only what the page lists
				if ((!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "recall") && !isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "idle"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "It's a bit late to buy a new shuttle, don't you think?"]);
					return live(f.dot);
				}
				if (truthy(rt.fv(f, "shuttle_purchased", rt.gl("SSshuttle")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "A replacement shuttle has already been purchased."]);
				} else {
					if (!truthy((yield* g.callName(f, live(S), "prerequisites_met", [])))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "You have not met the requirements for purchasing this shuttle."]);
					} else {
						if (rt.ge(rt.fv(f, "points", rt.gl("SSshuttle")), rt.fv(f, "credit_cost", live(S)))) {
							if (truthy((M_3 = rt.locateIn(f, T("/obj/machinery/shuttle_manipulator"), rt.gl("machines"))))) {
								rt.setFv(f, "shuttle_purchased", rt.gl("SSshuttle"), 1);
								yield* g.callName(f, live(M_3), "unload_preview", []);
								yield* g.callName(f, live(M_3), "load_template", [live(S)]);
								rt.setFv(f, "existing_shuttle", live(M_3), rt.fv(f, "emergency", rt.gl("SSshuttle")));
								yield* g.callName(f, live(M_3), "action_load", [live(S)]);
								(rt.modField(f, rt.gl("SSshuttle"), "points", rt.fv(f, "credit_cost", live(S)), subtract));
								yield* g.call(f, P("/proc/minor_announce"), null, [fmt("＀ has purchased ＀ for ＀ credits.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "name", live(S)), rt.fv(f, "credit_cost", live(S))]), "Shuttle Purchase"]);
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ purchased ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "name", live(S))])]);
							} else {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Something went wrong! The shuttle exchange system seems to be down."]);
							}
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Not enough credits."]);
						}
					}
				}
			}
		}
	} else if ($0 === "callshuttle") {
		rt.setFv(f, "state", live(f.src), 1);
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			rt.setFv(f, "state", live(f.src), 2);
		}
	} else if ($0 === "callshuttle2") {
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			yield* g.callName(f, rt.gl("SSshuttle"), "requestEvac", [live(f.usr), rt.at(live(f.args[1]), "call")]);
			if (truthy(rt.gv(f, "timer", rt.fv(f, "emergency", rt.gl("SSshuttle"))))) {
				yield* g.srcCall(f, "post_status", "shuttle");
			}
		}
		rt.setFv(f, "state", live(f.src), 1);
	} else if ($0 === "cancelshuttle") {
		rt.setFv(f, "state", live(f.src), 1);
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			rt.setFv(f, "state", live(f.src), 3);
		}
	} else if ($0 === "cancelshuttle2") {
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			yield* g.callName(f, rt.gl("SSshuttle"), "cancelEvac", [live(f.usr)]);
		}
		rt.setFv(f, "state", live(f.src), 1);
	} else if ($0 === "messagelist") {
		rt.setFv(f, "currmsg", live(f.src), 0);
		rt.setFv(f, "state", live(f.src), 4);
	} else if ($0 === "viewmessage") {
		rt.setFv(f, "state", live(f.src), 5);
		if (!truthy(rt.fv(f, "currmsg", live(f.src)))) {
			$1 = truthy(rt.at(live(f.args[1]), "message-num")) ? (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "message-num")])) : null;
			if (typeof $1 === "number" && Number.isInteger($1) && $1 >= 1 && $1 <= rt.len(f, rt.sv(f, "messagetitle"))) { // tg_js: only a message that exists
				rt.setFv(f, "currmsg", live(f.src), $1);
			} else {
				rt.setFv(f, "state", live(f.src), 4);
			}
		}
	} else if ($0 === "delmessage") {
		$0 = live(f.src);
		if (truthy(rt.fv(f, "currmsg", live(f.src)))) {
			$1 = 6;
		} else {
			$1 = 4;
		}
		rt.setFv(f, "state", $0, $1);
	} else if ($0 === "delmessage2") {
		if (truthy(rt.fv(f, "authenticated", live(f.src)))) {
			if (truthy(rt.fv(f, "currmsg", live(f.src))) && rt.le(rt.fv(f, "currmsg", live(f.src)), rt.len(f, rt.sv(f, "messagetitle")))) {
				title = rt.index(rt.fv(f, "messagetitle", live(f.src)), rt.fv(f, "currmsg", live(f.src)));
				text = rt.index(rt.fv(f, "messagetext", live(f.src)), rt.fv(f, "currmsg", live(f.src)));
				yield* g.callName(f, rt.fv(f, "messagetitle", live(f.src)), "Remove", [live(title)]);
				yield* g.callName(f, rt.fv(f, "messagetext", live(f.src)), "Remove", [live(text)]);
				if (isEqual(rt.fv(f, "currmsg", live(f.src)), rt.fv(f, "aicurrmsg", live(f.src)))) {
					rt.setFv(f, "aicurrmsg", live(f.src), 0);
				}
				rt.setFv(f, "currmsg", live(f.src), 0);
			}
			rt.setFv(f, "state", live(f.src), 4);
		} else {
			rt.setFv(f, "state", live(f.src), 5);
		}
	} else if ($0 === "status") {
		rt.setFv(f, "state", live(f.src), 7);
	} else if ($0 === "securitylevel") {
		rt.setFv(f, "tmp_alertlevel", live(f.src), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "newalertlevel")])));
		if (!truthy(rt.sv(f, "tmp_alertlevel")) || !Number.isInteger(rt.sv(f, "tmp_alertlevel"))) { // tg_js: only whole levels (0 green, 1 blue are the ones a console may set)
			rt.setSv(f, "tmp_alertlevel", 0);
		}
		rt.setSv(f, "state", 9);
	} else if ($0 === "changeseclevel") {
		rt.setSv(f, "state", 8);
	} else if ($0 === "emergencyaccess") {
		rt.setSv(f, "state", 10);
	} else if ($0 === "enableemergency") {
		yield* g.call(f, P("/proc/make_maint_all_access"), null, []);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ enabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ enabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		rt.setFv(f, "state", live(f.src), 1);
	} else if ($0 === "disableemergency") {
		yield* g.call(f, P("/proc/revoke_maint_all_access"), null, []);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ disabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ disabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		rt.setFv(f, "state", live(f.src), 1);
	} else if ($0 === "setstat") {
		$0 = rt.at(live(f.args[1]), "statdisp");
		// tg_js: only the commands and pictures the page offers
		if (!["blank", "shuttle", "message", "alert"].includes(String($0)) || ($0 === "alert" && !["default", "redalert", "lockdown", "biohazard"].includes(String(rt.at(live(f.args[1]), "alert"))))) return live(f.dot);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 50, 0]);
		if ($0 === "message") {
			yield* g.srcCall(f, "post_status", "message", rt.sv(f, "stat_msg1"), rt.sv(f, "stat_msg2"));
		} else if ($0 === "alert") {
			yield* g.srcCall(f, "post_status", "alert", rt.at(live(f.args[1]), "alert"));
		} else {
			yield* g.srcCall(f, "post_status", rt.at(live(f.args[1]), "statdisp"));
		}
	} else if ($0 === "setmsg1") {
		rt.setSv(f, "stat_msg1", (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.sv(f, "stat_msg1"), "Enter Message Text", "Line 1", null])), 40])));
	} else if ($0 === "setmsg2") {
		rt.setSv(f, "stat_msg2", (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.sv(f, "stat_msg2"), "Enter Message Text", "Line 2", null])), 40])));
	} else if ($0 === "MessageCentcomm") {
		if (isEqual(rt.fv(f, "authenticated", live(f.src)), 2)) {
			if (!truthy((yield* g.srcCall(f, "checkCCcooldown")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Arrays recycling.  Please stand by.</span>"]);
				return live(f.dot);
			}
			if (((!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please choose a message to transmit to Centcom via quantum entanglement.  Please be aware that this process is very expensive, and abuse will lead to... termination.  Transmission does not guarantee a response.", "Send a message to Centcomm.", ""])))) || !truthy((rt.isIn(f, live(f.usr), (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)]))) ? 1 : 0))) || !truthy((yield* g.srcCall(f, "checkCCcooldown"))))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
			yield* g.call(f, P("/proc/Centcomm_announce"), null, [live(input), live(f.usr)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Message transmitted to Central Command.</span>"]);
			yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ has made a Centcom announcement: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(input)])]);
			rt.setFv(f, "lastTimeUsed", live(CM), rt.worldTime(f));
		}
	} else if ($0 === "MessageSyndicate") {
		if ((isEqual(rt.fv(f, "authenticated", live(f.src)), 2) && truthy(rt.fv(f, "emagged", live(f.src))))) {
			if (!truthy((yield* g.srcCall(f, "checkCCcooldown")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Arrays recycling.  Please stand by.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0]);
				return live(f.dot);
			}
			if (((!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please choose a message to transmit to [ABNORMAL ROUTING COORDINATES] via quantum entanglement.  Please be aware that this process is very expensive, and abuse will lead to... termination. Transmission does not guarantee a response.", "Send a message to /??????/.", ""])))) || !truthy((rt.isIn(f, live(f.usr), (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)]))) ? 1 : 0))) || !truthy((yield* g.srcCall(f, "checkCCcooldown"))))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
			yield* g.call(f, P("/proc/Syndicate_announce"), null, [live(input), live(f.usr)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>SYSERR @l(19833)of(transmit.dm): !@$ MESSAGE TRANSMITTED TO SYNDICATE COMMAND.</span>"]);
			yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ has made a Syndicate announcement: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(input)])]);
			rt.setFv(f, "lastTimeUsed", live(CM), rt.worldTime(f));
		}
	} else if ($0 === "RestoreBackup") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Backup routing data restored!</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		rt.setFv(f, "emagged", live(f.src), 0);
	} else if ($0 === "nukerequest") {
		if (isEqual(rt.fv(f, "authenticated", live(f.src)), 2)) {
			if (!truthy((yield* g.srcCall(f, "checkCCcooldown")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Arrays recycling. Please stand by.</span>"]);
				return live(f.dot);
			}
			if (((!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter the reason for requesting the nuclear self-destruct codes. Misuse of the nuclear request system will not be tolerated under any circumstances.  Transmission does not guarantee a response.", "Self Destruct Code Request.", ""])))) || !truthy((rt.isIn(f, live(f.usr), (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)]))) ? 1 : 0))) || !truthy((yield* g.srcCall(f, "checkCCcooldown"))))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/Nuke_request"), null, [live(input), live(f.usr)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Request sent.</span>"]);
			yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ has requested the nuclear codes from Centcomm", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
			yield* g.call(f, P("/proc/priority_announce"), null, [fmt("The codes for the on-station nuclear self-destruct have been requested by ＀. Confirmation or denial of this request will be sent shortly.", [live(f.usr)]), "Nuclear Self Destruct Codes Requested", rt.rsc("sound/ai/commandreport.ogg")]);
			rt.setFv(f, "lastTimeUsed", live(CM), rt.worldTime(f));
		}
	} else if ($0 === "ai-main") {
		rt.setFv(f, "aicurrmsg", live(f.src), 0);
		rt.setFv(f, "aistate", live(f.src), 1);
	} else if ($0 === "ai-callshuttle") {
		rt.setFv(f, "aistate", live(f.src), 2);
	} else if ($0 === "ai-callshuttle2") {
		yield* g.callName(f, rt.gl("SSshuttle"), "requestEvac", [live(f.usr), rt.at(live(f.args[1]), "call")]);
		rt.setFv(f, "aistate", live(f.src), 1);
	} else if ($0 === "ai-messagelist") {
		rt.setFv(f, "aicurrmsg", live(f.src), 0);
		rt.setFv(f, "aistate", live(f.src), 4);
	} else if ($0 === "ai-viewmessage") {
		rt.setFv(f, "aistate", live(f.src), 5);
		if (!truthy(rt.fv(f, "aicurrmsg", live(f.src)))) {
			$1 = truthy(rt.at(live(f.args[1]), "message-num")) ? (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "message-num")])) : null;
			if (typeof $1 === "number" && Number.isInteger($1) && $1 >= 1 && $1 <= rt.len(f, rt.sv(f, "messagetitle"))) {
				rt.setFv(f, "aicurrmsg", live(f.src), $1);
			} else {
				rt.setFv(f, "aistate", live(f.src), 4);
			}
		}
	} else if ($0 === "ai-delmessage") {
		$0 = live(f.src);
		if (truthy(rt.fv(f, "aicurrmsg", live(f.src)))) {
			$1 = 6;
		} else {
			$1 = 4;
		}
		rt.setFv(f, "aistate", $0, $1);
	} else if ($0 === "ai-delmessage2") {
		if (truthy(rt.fv(f, "aicurrmsg", live(f.src))) && rt.le(rt.fv(f, "aicurrmsg", live(f.src)), rt.len(f, rt.sv(f, "messagetitle")))) {
			title = rt.index(rt.fv(f, "messagetitle", live(f.src)), rt.fv(f, "aicurrmsg", live(f.src)));
			text = rt.index(rt.fv(f, "messagetext", live(f.src)), rt.fv(f, "aicurrmsg", live(f.src)));
			yield* g.callName(f, rt.fv(f, "messagetitle", live(f.src)), "Remove", [live(title)]);
			yield* g.callName(f, rt.fv(f, "messagetext", live(f.src)), "Remove", [live(text)]);
			if (isEqual(rt.fv(f, "currmsg", live(f.src)), rt.fv(f, "aicurrmsg", live(f.src)))) {
				rt.setFv(f, "currmsg", live(f.src), 0);
			}
			rt.setFv(f, "aicurrmsg", live(f.src), 0);
		}
		rt.setFv(f, "aistate", live(f.src), 4);
	} else if ($0 === "ai-status") {
		rt.setFv(f, "aistate", live(f.src), 7);
	} else if ($0 === "ai-announce") {
		yield* g.srcCall(f, "make_announcement", live(f.usr), 1);
	} else if ($0 === "ai-securitylevel") {
		rt.setFv(f, "tmp_alertlevel", live(f.src), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "newalertlevel")])));
		if (!truthy(rt.sv(f, "tmp_alertlevel")) || !Number.isInteger(rt.sv(f, "tmp_alertlevel"))) {
			rt.setSv(f, "tmp_alertlevel", 0);
		}
		old_level_1 = rt.gl("security_level");
		if (!truthy(rt.sv(f, "tmp_alertlevel"))) {
			rt.setSv(f, "tmp_alertlevel", 0);
		}
		if (rt.lt(rt.sv(f, "tmp_alertlevel"), 0)) {
			rt.setSv(f, "tmp_alertlevel", 0);
		}
		if (rt.gt(rt.sv(f, "tmp_alertlevel"), 1)) {
			rt.setSv(f, "tmp_alertlevel", 1);
		}
		yield* g.call(f, P("/proc/set_security_level"), null, [rt.sv(f, "tmp_alertlevel")]);
		if (!isEqual(rt.gl("security_level"), live(old_level_1))) {
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has changed the security level to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_security_level"), null, []))])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has changed the security level to ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/get_security_level"), null, []))])]);
		}
		rt.setSv(f, "tmp_alertlevel", 0);
		rt.setFv(f, "aistate", live(f.src), 1);
	} else if ($0 === "ai-changeseclevel") {
		rt.setFv(f, "aistate", live(f.src), 8);
	} else if ($0 === "ai-emergencyaccess") {
		rt.setFv(f, "aistate", live(f.src), 10);
	} else if ($0 === "ai-enableemergency") {
		yield* g.call(f, P("/proc/make_maint_all_access"), null, []);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ enabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ enabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		rt.setFv(f, "aistate", live(f.src), 1);
	} else if ($0 === "ai-disableemergency") {
		yield* g.call(f, P("/proc/revoke_maint_all_access"), null, []);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ disabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ disabled emergency maintenance access.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		rt.setFv(f, "aistate", live(f.src), 1);
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/communications/proc/attackby  (code/game/machinery/computer/communications.dm:395)  may sleep
rt.def("/obj/machinery/computer/communications/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		yield* g.srcCall(f, "attack_hand", live(f.args[1]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/communications/proc/emag_act  (code/game/machinery/computer/communications.dm:401)
rt.def("/obj/machinery/computer/communications/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setFv(f, "emagged", live(f.src), 1);
	if (isEqual(rt.sv(f, "authenticated"), 1)) {
		rt.setSv(f, "authenticated", 2);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You scramble the communication routing circuits!</span>"]);
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0]);
	return f.dot;
});


// tgui window (tg_js: replaces the old /datum/browser popup, attack_hand and interact_ai).
// /obj/machinery/computer/communications/proc/ui_interact  (modern tg: CommunicationsConsole)  may sleep
rt.def("/obj/machinery/computer/communications/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (rt.gt(rt.sv(f, "z"), 6)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!"]);
		return live(f.dot);
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "communications_console", rt.sv(f, "name"), 420, 520, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/communications/proc/ui_data
rt.def("/obj/machinery/computer/communications/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, is_ai: boolean = false, mode: Value = null, timeleft: number = 0, screen: Value = null, cur: number = 0, n: number = 0, i: number = 0, msgs: Value = null, shuttles: Value = null, shuttle_id: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [data, mode, screen, msgs, shuttles, shuttle_id, S, $e];
	data = rt.list();
	is_ai = truthy(rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0);
	screen = is_ai ? rt.sv(f, "aistate") : rt.sv(f, "state");
	rt.setAt(live(data), "is_ai", is_ai ? 1 : 0);
	rt.setAt(live(data), "screen", live(screen));
	rt.setAt(live(data), "authenticated", rt.sv(f, "authenticated"));
	rt.setAt(live(data), "auth_id", rt.sv(f, "auth_id"));
	rt.setAt(live(data), "emagged", rt.sv(f, "emagged"));
	mode = rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle")));
	rt.setAt(live(data), "shuttle_mode", live(mode));
	// the old human menu offered "call" on idle or recall, "cancel" otherwise; the AI menu only offered "call" on idle
	rt.setAt(live(data), "can_call", ((is_ai ? isEqual(mode, "idle") : (isEqual(mode, "idle") || isEqual(mode, "recall")))) ? 1 : 0);
	rt.setAt(live(data), "can_cancel", (!is_ai && !isEqual(mode, "idle") && !isEqual(mode, "recall")) ? 1 : 0);
	if (isEqual(mode, "call")) {
		timeleft = Number(live(rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", [])));
		rt.setAt(live(data), "eta", Math.floor(timeleft / 60 % 60) + ":" + (Math.floor(timeleft % 60) < 10 ? "0" : "") + Math.floor(timeleft % 60));
	} else {
		rt.setAt(live(data), "eta", null);
	}
	rt.setAt(live(data), "call_amount", truthy(rt.fv(f, "emergencyCallAmount", rt.gl("SSshuttle"))) ? 1 : 0);
	if (truthy(rt.fv(f, "emergencyLastCallLoc", rt.gl("SSshuttle")))) {
		rt.setAt(live(data), "last_call_loc", rt.call(f, P("/proc/format_text"), null, [rt.gv(f, "name", rt.fv(f, "emergencyLastCallLoc", rt.gl("SSshuttle")))]));
	} else {
		rt.setAt(live(data), "last_call_loc", null);
	}
	// messages
	msgs = rt.list();
	n = Number(live(rt.getLen(f, rt.sv(f, "messagetitle"))));
	for (i = 1; i <= n; i++) {
		rt.modify(live(msgs), rt.list(rt.alist(f, ["num", i, "title", rt.index(rt.sv(f, "messagetitle"), i)])), add);
	}
	rt.setAt(live(data), "messages", live(msgs));
	cur = Number(live(is_ai ? rt.sv(f, "aicurrmsg") : rt.sv(f, "currmsg")));
	if (cur > 0 && cur <= n) {
		rt.setAt(live(data), "msg_title", rt.index(rt.sv(f, "messagetitle"), cur));
		rt.setAt(live(data), "msg_text", rt.index(rt.sv(f, "messagetext"), cur));
	} else {
		rt.setAt(live(data), "msg_title", null);
		rt.setAt(live(data), "msg_text", null);
	}
	// status displays
	rt.setAt(live(data), "stat_msg1", rt.sv(f, "stat_msg1"));
	rt.setAt(live(data), "stat_msg2", rt.sv(f, "stat_msg2"));
	// alert level
	rt.setAt(live(data), "sec_level", rt.call(f, P("/proc/get_security_level"), null, []));
	rt.setAt(live(data), "sec_delta", isEqual(rt.gl("security_level"), 3) ? 1 : 0);
	rt.setAt(live(data), "tmp_level", truthy(rt.sv(f, "tmp_alertlevel")) ? rt.call(f, P("/proc/num2seclevel"), null, [rt.sv(f, "tmp_alertlevel")]) : null);
	rt.setAt(live(data), "emergency_access", isEqual(rt.gl("emergency_access"), 1) ? 1 : 0);
	rt.setAt(live(data), "cc_ready", truthy(rt.callSrc(f, "checkCCcooldown", [])) ? 1 : 0);
	// shuttle purchase
	rt.setAt(live(data), "budget", rt.fv(f, "points", rt.gl("SSshuttle")));
	rt.setAt(live(data), "shuttle_purchased", truthy(rt.fv(f, "shuttle_purchased", rt.gl("SSshuttle"))) ? 1 : 0);
	shuttles = rt.list();
	if (!is_ai && isEqual(screen, 11)) {
		shuttle_id = null;
		rt.forList(f, 0, rt.fv(f, "shuttle_templates", rt.gl("SSmapping")));
		while (($e = rt.next(f, 0)) !== undefined) {
			shuttle_id = $e;
			S = rt.index(rt.fv(f, "shuttle_templates", rt.gl("SSmapping")), live(shuttle_id));
			if (truthy(rt.gv(f, "can_be_bought", live(S))) && rt.lt(rt.fv(f, "credit_cost", live(S)), 9.999999848243207e+30)) {
				rt.modify(live(shuttles), rt.list(rt.alist(f, ["id", live(shuttle_id), "name", rt.fv(f, "name", live(S)), "cost", rt.fv(f, "credit_cost", live(S)), "description", rt.fv(f, "description", live(S)), "prerequisites", rt.fv(f, "prerequisites", live(S))])), add);
			}
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "shuttles", live(shuttles));
	return live(data);
});

// /obj/machinery/computer/communications/proc/ui_act
// Every button becomes the Topic operation of the same name (silicons get the "ai-" ones), so the rules live in Topic only.
rt.def("/obj/machinery/computer/communications/proc/ui_act", function* ui_act(f: Frame) {
	let hl: Value = null, op: Value = null, ai: boolean = false;
	f.vars = () => [hl, op];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	op = live(f.args[0]);
	ai = truthy(rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0);
	if (ai && !["setstat", "setmsg1", "setmsg2"].includes(String(op))) {
		op = "ai-" + String(op);
	}
	hl = rt.list();
	rt.setAt(live(hl), "operation", live(op));
	for (const k of ["call", "message-num", "newalertlevel", "statdisp", "alert", "shuttle_id"]) {
		if (rt.at(live(f.args[1]), k) !== null) rt.setAt(live(hl), k, rt.at(live(f.args[1]), k));
	}
	if ((op === "callshuttle2" || op === "ai-callshuttle2") && rt.at(live(hl), "call") === null) {
		// the old form had a text field for the nature of the emergency; the window asks with a prompt instead
		rt.setAt(live(hl), "call", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Nature of the emergency? (give a reason of at least 12 characters, or the shuttle will not be called)", "Call the emergency shuttle"])));
		if (!truthy(rt.at(live(hl), "call"))) return 1;
	}
	yield* g.srcCall(f, "Topic", "", live(hl));
	return 1;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/communications/proc/make_announcement  (code/game/machinery/computer/communications.dm:659)  may sleep
rt.def("/obj/machinery/computer/communications/proc/make_announcement", function* make_announcement(f: Frame, user: Value, is_silicon: Value) {
	let input: Value = null;
	f.vars = () => [user, is_silicon, input];
	if (!truthy((yield* g.callName(f, rt.gl("SScommunications"), "can_announce", [live(user), live(is_silicon)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Intercomms recharging. Please stand by."]);
		return live(f.dot);
	}
	if ((!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Please choose a message to announce to the station crew.", "What?"])))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("SScommunications"), "make_announcement", [live(user), live(is_silicon), live(input)]);
	return f.dot;
}, true);

// /obj/machinery/computer/communications/proc/post_status  (code/game/machinery/computer/communications.dm:669)  may sleep
rt.def("/obj/machinery/computer/communications/proc/post_status", function* post_status(f: Frame, command: Value, data1: Value, data2: Value) {
	let frequency: Value = null, status_signal: Value = null;
	let $0: any;
	f.vars = () => [command, data1, data2, frequency, status_signal, $0];
	if (!truthy((frequency = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [1435]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "source", (status_signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "transmission_method", live(status_signal), 1);
	rt.setAt(rt.fv(f, "data", live(status_signal)), "command", live(command));
	$0 = live(command);
	if ($0 === "message") {
		rt.setAt(rt.fv(f, "data", live(status_signal)), "msg1", live(data1));
		rt.setAt(rt.fv(f, "data", live(status_signal)), "msg2", live(data2));
	} else if ($0 === "alert") {
		rt.setAt(rt.fv(f, "data", live(status_signal)), "picture_state", live(data1));
	}
	yield* g.callName(f, live(frequency), "post_signal", [live(f.src), live(status_signal)]);
	return f.dot;
}, true);

// /obj/machinery/computer/communications/proc/Destroy  (code/game/machinery/computer/communications.dm:689)  may sleep
rt.def("/obj/machinery/computer/communications/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("shuttle_caller_list", live(f.src), subtract));
	yield* g.callName(f, rt.gl("SSshuttle"), "autoEvac", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/communications/proc/overrideCooldown  (code/game/machinery/computer/communications.dm:694)
rt.def("/obj/machinery/computer/communications/proc/overrideCooldown", function overrideCooldown(f: Frame) {
	let CM: Value = null;
	f.vars = () => [CM];
	rt.setFv(f, "lastTimeUsed", (CM = rt.sv(f, "circuit")), 0);
	return f.dot;
});
