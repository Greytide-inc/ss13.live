// Based on /tg/station's code/game/machinery/computer/communications.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, truthy, add } = rt;


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

// communications.dm:11
rt.def("/obj/machinery/computer/communications/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.messagetitle = list();

	this.messagetext = list();

	this.req_access = list(19);
	return f.dot;
});

// communications.dm:39
rt.def("/obj/machinery/computer/communications/proc/checkCCcooldown", function checkCCcooldown(f: Frame) {
	let CM: Value = null;
	if ((CM = this.circuit).lastTimeUsed + 600 > rt.worldTime(f)) {
		return 0;
	}
	return 1;
});

// communications.dm:45
rt.def("/obj/machinery/computer/communications/proc/New", function* New(f: Frame) {
	GLOB.shuttle_caller_list += this;
	yield* parent_proc();
	return f.dot;
}, true);

// communications.dm:49
rt.def("/obj/machinery/computer/communications/proc/process", function* process(f: Frame) {
	if (!(yield* parent_proc())) return f.dot;
	if (this.state == 7) return f.dot;
	return f.dot;
}, true, { waitfor: false });

// communications.dm:55
rt.def("/obj/machinery/computer/communications/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null, I: Value = null, AI: Value = null, pda: Value = null, old_level: Value = null, input: Value = null, shuttles: Value = null, S: Value = null, M_3: Value = null, title: Value = null, text: Value = null, old_level_1: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.z != 2 && this.z != 1) {
		to_chat(f.usr, "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!");
		return f.dot;
	}
	if (!rt.at(href_list, "operation")) {
		return f.dot;
	}
	let CM: Value = this.circuit;
	// tg_js: the page only showed a button to someone who may press it; an href can name any operation, so each is checked here.
	// The ai- operations are the silicon's page (no login); a human may not send them. Emergency maintenance access and restoring the
	// routing are captain functions, the status display needs a login (a silicon's setstat/setmsg never log in).
	{
		const opn = String(rt.at(href_list, "operation")), sil = truthy(rt.istype(f.usr, T("/mob/living/silicon"))), au = this.authenticated;
		if (opn.startsWith("ai-") && !sil) return f.dot;
		if (["enableemergency", "disableemergency", "RestoreBackup"].includes(opn) && au != 2) return f.dot;
		if (["setstat", "setmsg1", "setmsg2"].includes(opn) && !sil && !au) return f.dot;
	}
	const item = rt.at(href_list, "operation");
	if (item === "main") {
		this.state = 1;
		playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
	} else if (item === "login") {
		M = f.usr;
		if (!rt.istype((I = M.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
			I = M.get_idcard();
		}
		if (I && rt.istype(I, T("/obj/item/weapon/card/id"))) {
			if (this.check_access(I)) {
				this.authenticated = 1;
				this.auth_id = `${I.registered_name} (${I.assignment})`;
				if (rt.isIn(f, 20, I.access)) {
					this.authenticated = 2;
				}
				playsound(this, rt.rsc("sound/machines/terminal_on.ogg"), 50, 0);
			}
			if (this.emagged) {
				this.authenticated = 2;
				this.auth_id = "Unknown";
				to_chat(M, `<span class='warning'>${this} lets out a quiet alarm as its login is overriden.</span>`);
				playsound(this, rt.rsc("sound/machines/terminal_on.ogg"), 50, 0);
				playsound(this, rt.rsc("sound/machines/terminal_alert.ogg"), 25, 0);
				if (prob(25)) {
					for (AI of each(active_ais(), T("/mob/living/silicon/ai"))) {
						rt.op(f, "Output", [], [AI, (yield* sound(rt.rsc("sound/machines/terminal_alert.ogg"), { volume: 10 }))], false);
					}
				}
			}
		}
	} else if (item === "logout") {
		this.authenticated = 0;
		playsound(this, rt.rsc("sound/machines/terminal_off.ogg"), 50, 0);
	} else if (item === "swipeidseclevel") {
		M = f.usr;
		if (rt.istype((I = M.get_active_held_item()), T("/obj/item/device/pda"))) {
			I = (pda = I).id;
		}
		if (I && rt.istype(I, T("/obj/item/weapon/card/id"))) {
			if (rt.isIn(f, 20, I.access)) {
				old_level = GLOB.security_level;
				if (!this.tmp_alertlevel) {
					this.tmp_alertlevel = 0;
				}
				if (this.tmp_alertlevel < 0) {
					this.tmp_alertlevel = 0;
				}
				if (this.tmp_alertlevel > 1) {
					this.tmp_alertlevel = 1;
				}
				set_security_level(this.tmp_alertlevel);
				if (GLOB.security_level != old_level) {
					to_chat(f.usr, "<span class='notice'>Authorization confirmed. Modifying security level.</span>");
					playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
					log_game(`${key_name(f.usr)} has changed the security level to ${get_security_level()}.`);
					message_admins(`${key_name_admin(f.usr)} has changed the security level to ${get_security_level()}.`);
				}
				this.tmp_alertlevel = 0;
			} else {
				to_chat(f.usr, "<span class='warning'>You are not authorized to do this!</span>");
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
				this.tmp_alertlevel = 0;
			}
			this.state = 1;
		} else {
			to_chat(f.usr, "<span class='warning'>You need to swipe your ID!</span>");
			playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
		}
	} else if (item === "announce") {
		if (this.authenticated == 2) {
			playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0);
			yield* this.make_announcement(f.usr);
		}
	} else if (item === "purchase_menu") {
		this.state = 11;
	} else if (item === "buyshuttle") {
		if (this.authenticated == 2) {
			shuttles = flatten_list(GLOB.SSmapping.shuttle_templates);
			if ((S = (rt.at(href_list, "shuttle_id") ? rt.index(GLOB.SSmapping.shuttle_templates, rt.at(href_list, "shuttle_id")) : rt.locateIn(f, rt.at(href_list, "chosen_shuttle"), shuttles))) && rt.istype(S, T("/datum/map_template/shuttle"))) {
				if (!S.can_be_bought || !(S.credit_cost < 1e+31)) return f.dot; // tg_js: only what the page lists
				if (GLOB.SSshuttle.emergency.mode != "recall" && GLOB.SSshuttle.emergency.mode != "idle") {
					to_chat(f.usr, "It's a bit late to buy a new shuttle, don't you think?");
					return f.dot;
				}
				if (GLOB.SSshuttle.shuttle_purchased) {
					to_chat(f.usr, "A replacement shuttle has already been purchased.");
				} else if (!S.prerequisites_met()) {
					to_chat(f.usr, "You have not met the requirements for purchasing this shuttle.");
				} else if (GLOB.SSshuttle.points >= S.credit_cost) {
					if (M_3 = rt.locateIn(f, T("/obj/machinery/shuttle_manipulator"), GLOB.machines)) {
						GLOB.SSshuttle.shuttle_purchased = 1;
						yield* M_3.unload_preview();
						yield* M_3.load_template(S);
						M_3.existing_shuttle = GLOB.SSshuttle.emergency;
						yield* M_3.action_load(S);
						GLOB.SSshuttle.points -= S.credit_cost;
						minor_announce(`${f.usr.name} has purchased ${S.name} for ${S.credit_cost} credits.`, "Shuttle Purchase");
						message_admins(`${key_name_admin(f.usr)} purchased ${S.name}.`);
					} else {
						to_chat(f.usr, "Something went wrong! The shuttle exchange system seems to be down.");
					}
				} else {
					to_chat(f.usr, "Not enough credits.");
				}
			}
		}
	} else if (item === "callshuttle") {
		this.state = 1;
		if (this.authenticated) {
			this.state = 2;
		}
	} else if (item === "callshuttle2") {
		if (this.authenticated) {
			yield* GLOB.SSshuttle.requestEvac(f.usr, rt.at(href_list, "call"));
			if (GLOB.SSshuttle.emergency.timer) {
				yield* this.post_status("shuttle");
			}
		}
		this.state = 1;
	} else if (item === "cancelshuttle") {
		this.state = 1;
		if (this.authenticated) {
			this.state = 3;
		}
	} else if (item === "cancelshuttle2") {
		if (this.authenticated) {
			yield* GLOB.SSshuttle.cancelEvac(f.usr);
		}
		this.state = 1;
	} else if (item === "messagelist") {
		this.currmsg = 0;
		this.state = 4;
	} else if (item === "viewmessage") {
		this.state = 5;
		if (!this.currmsg) {
			$1 = rt.at(href_list, "message-num") ? text2num(rt.at(href_list, "message-num")) : null;
			if (typeof $1 === "number" && Number.isInteger($1) && $1 >= 1 && $1 <= rt.len(f, this.messagetitle)) { // tg_js: only a message that exists
				this.currmsg = $1;
			} else {
				this.state = 4;
			}
		}
	} else if (item === "delmessage") {
		this.state = this.currmsg ? 6 : 4;
	} else if (item === "delmessage2") {
		if (this.authenticated) {
			if (this.currmsg && this.currmsg <= rt.len(f, this.messagetitle)) {
				title = rt.index(this.messagetitle, this.currmsg);
				text = rt.index(this.messagetext, this.currmsg);
				yield* this.messagetitle.Remove(title);
				yield* this.messagetext.Remove(text);
				if (this.currmsg == this.aicurrmsg) {
					this.aicurrmsg = 0;
				}
				this.currmsg = 0;
			}
			this.state = 4;
		} else {
			this.state = 5;
		}
	} else if (item === "status") {
		this.state = 7;
	} else if (item === "securitylevel") {
		this.tmp_alertlevel = text2num(rt.at(href_list, "newalertlevel"));
		if (!this.tmp_alertlevel || !Number.isInteger(this.tmp_alertlevel)) { // tg_js: only whole levels (0 green, 1 blue are the ones a console may set)
			this.tmp_alertlevel = 0;
		}
		this.state = 9;
	} else if (item === "changeseclevel") {
		this.state = 8;
	} else if (item === "emergencyaccess") {
		this.state = 10;
	} else if (item === "enableemergency") {
		make_maint_all_access();
		log_game(`${key_name(f.usr)} enabled emergency maintenance access.`);
		message_admins(`${key_name_admin(f.usr)} enabled emergency maintenance access.`);
		this.state = 1;
	} else if (item === "disableemergency") {
		revoke_maint_all_access();
		log_game(`${key_name(f.usr)} disabled emergency maintenance access.`);
		message_admins(`${key_name_admin(f.usr)} disabled emergency maintenance access.`);
		this.state = 1;
	} else if (item === "setstat") {
		$0 = rt.at(href_list, "statdisp");
		// tg_js: only the commands and pictures the page offers
		if (!["blank", "shuttle", "message", "alert"].includes(String($0)) || $0 === "alert" && !["default", "redalert", "lockdown", "biohazard"].includes(String(rt.at(href_list, "alert")))) return f.dot;
		playsound(this, "terminal_type", 50, 0);
		if ($0 === "message") {
			yield* this.post_status("message", this.stat_msg1, this.stat_msg2);
		} else if ($0 === "alert") {
			yield* this.post_status("alert", rt.at(href_list, "alert"));
		} else {
			yield* this.post_status(rt.at(href_list, "statdisp"));
		}
	} else if (item === "setmsg1") {
		this.stat_msg1 = reject_bad_text((yield* g.op(f, "Prompt", [3], [null, this.stat_msg1, "Enter Message Text", "Line 1", null])), 40);
	} else if (item === "setmsg2") {
		this.stat_msg2 = reject_bad_text((yield* g.op(f, "Prompt", [3], [null, this.stat_msg2, "Enter Message Text", "Line 2", null])), 40);
	} else if (item === "MessageCentcomm") {
		if (this.authenticated == 2) {
			if (!this.checkCCcooldown()) {
				to_chat(f.usr, "<span class='warning'>Arrays recycling.  Please stand by.</span>");
				return f.dot;
			}
			if (!(input = (yield* stripped_input(f.usr, "Please choose a message to transmit to Centcom via quantum entanglement.  Please be aware that this process is very expensive, and abuse will lead to... termination.  Transmission does not guarantee a response.", "Send a message to Centcomm.", ""))) || !rt.isIn(f, f.usr, view(1, this)) || !this.checkCCcooldown()) {
				return f.dot;
			}
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
			Centcomm_announce(input, f.usr);
			to_chat(f.usr, "<span class='notice'>Message transmitted to Central Command.</span>");
			log_say(`${key_name(f.usr)} has made a Centcom announcement: ${input}`);
			CM.lastTimeUsed = rt.worldTime(f);
		}
	} else if (item === "MessageSyndicate") {
		if (this.authenticated == 2 && this.emagged) {
			if (!this.checkCCcooldown()) {
				to_chat(f.usr, "<span class='warning'>Arrays recycling.  Please stand by.</span>");
				playsound(this, rt.rsc("sound/machines/terminal_prompt_deny.ogg"), 50, 0);
				return f.dot;
			}
			if (!(input = (yield* stripped_input(f.usr, "Please choose a message to transmit to [ABNORMAL ROUTING COORDINATES] via quantum entanglement.  Please be aware that this process is very expensive, and abuse will lead to... termination. Transmission does not guarantee a response.", "Send a message to /??????/.", ""))) || !rt.isIn(f, f.usr, view(1, this)) || !this.checkCCcooldown()) {
				return f.dot;
			}
			playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
			Syndicate_announce(input, f.usr);
			to_chat(f.usr, "<span class='danger'>SYSERR @l(19833)of(transmit.dm): !@$ MESSAGE TRANSMITTED TO SYNDICATE COMMAND.</span>");
			log_say(`${key_name(f.usr)} has made a Syndicate announcement: ${input}`);
			CM.lastTimeUsed = rt.worldTime(f);
		}
	} else if (item === "RestoreBackup") {
		to_chat(f.usr, "<span class='notice'>Backup routing data restored!</span>");
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		this.emagged = 0;
	} else if (item === "nukerequest") {
		if (this.authenticated == 2) {
			if (!this.checkCCcooldown()) {
				to_chat(f.usr, "<span class='warning'>Arrays recycling. Please stand by.</span>");
				return f.dot;
			}
			if (!(input = (yield* stripped_input(f.usr, "Please enter the reason for requesting the nuclear self-destruct codes. Misuse of the nuclear request system will not be tolerated under any circumstances.  Transmission does not guarantee a response.", "Self Destruct Code Request.", ""))) || !rt.isIn(f, f.usr, view(1, this)) || !this.checkCCcooldown()) {
				return f.dot;
			}
			Nuke_request(input, f.usr);
			to_chat(f.usr, "<span class='notice'>Request sent.</span>");
			log_say(`${key_name(f.usr)} has requested the nuclear codes from Centcomm`);
			yield* priority_announce(`The codes for the on-station nuclear self-destruct have been requested by ${f.usr}. Confirmation or denial of this request will be sent shortly.`, "Nuclear Self Destruct Codes Requested", rt.rsc("sound/ai/commandreport.ogg"));
			CM.lastTimeUsed = rt.worldTime(f);
		}
	} else if (item === "ai-main") {
		this.aicurrmsg = 0;
		this.aistate = 1;
	} else if (item === "ai-callshuttle") {
		this.aistate = 2;
	} else if (item === "ai-callshuttle2") {
		yield* GLOB.SSshuttle.requestEvac(f.usr, rt.at(href_list, "call"));
		this.aistate = 1;
	} else if (item === "ai-messagelist") {
		this.aicurrmsg = 0;
		this.aistate = 4;
	} else if (item === "ai-viewmessage") {
		this.aistate = 5;
		if (!this.aicurrmsg) {
			$1 = rt.at(href_list, "message-num") ? text2num(rt.at(href_list, "message-num")) : null;
			if (typeof $1 === "number" && Number.isInteger($1) && $1 >= 1 && $1 <= rt.len(f, this.messagetitle)) {
				this.aicurrmsg = $1;
			} else {
				this.aistate = 4;
			}
		}
	} else if (item === "ai-delmessage") {
		this.aistate = this.aicurrmsg ? 6 : 4;
	} else if (item === "ai-delmessage2") {
		if (this.aicurrmsg && this.aicurrmsg <= rt.len(f, this.messagetitle)) {
			title = rt.index(this.messagetitle, this.aicurrmsg);
			text = rt.index(this.messagetext, this.aicurrmsg);
			yield* this.messagetitle.Remove(title);
			yield* this.messagetext.Remove(text);
			if (this.currmsg == this.aicurrmsg) {
				this.currmsg = 0;
			}
			this.aicurrmsg = 0;
		}
		this.aistate = 4;
	} else if (item === "ai-status") {
		this.aistate = 7;
	} else if (item === "ai-announce") {
		yield* this.make_announcement(f.usr, 1);
	} else if (item === "ai-securitylevel") {
		this.tmp_alertlevel = text2num(rt.at(href_list, "newalertlevel"));
		if (!this.tmp_alertlevel || !Number.isInteger(this.tmp_alertlevel)) {
			this.tmp_alertlevel = 0;
		}
		old_level_1 = GLOB.security_level;
		if (!this.tmp_alertlevel) {
			this.tmp_alertlevel = 0;
		}
		if (this.tmp_alertlevel < 0) {
			this.tmp_alertlevel = 0;
		}
		if (this.tmp_alertlevel > 1) {
			this.tmp_alertlevel = 1;
		}
		set_security_level(this.tmp_alertlevel);
		if (GLOB.security_level != old_level_1) {
			log_game(`${key_name(f.usr)} has changed the security level to ${get_security_level()}.`);
			message_admins(`${key_name_admin(f.usr)} has changed the security level to ${get_security_level()}.`);
		}
		this.tmp_alertlevel = 0;
		this.aistate = 1;
	} else if (item === "ai-changeseclevel") {
		this.aistate = 8;
	} else if (item === "ai-emergencyaccess") {
		this.aistate = 10;
	} else if (item === "ai-enableemergency") {
		make_maint_all_access();
		log_game(`${key_name(f.usr)} enabled emergency maintenance access.`);
		message_admins(`${key_name_admin(f.usr)} enabled emergency maintenance access.`);
		this.aistate = 1;
	} else if (item === "ai-disableemergency") {
		revoke_maint_all_access();
		log_game(`${key_name(f.usr)} disabled emergency maintenance access.`);
		message_admins(`${key_name_admin(f.usr)} disabled emergency maintenance access.`);
		this.aistate = 1;
	}
	return f.dot;
}, true);

// communications.dm:395
rt.def("/obj/machinery/computer/communications/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/card/id"))) {
		yield* this.attack_hand(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// communications.dm:401
rt.def("/obj/machinery/computer/communications/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	if (this.authenticated == 1) {
		this.authenticated = 2;
	}
	to_chat(user, "<span class='danger'>You scramble the communication routing circuits!</span>");
	playsound(this, rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0);
	return f.dot;
});


// tgui window (tg_js: replaces the old /datum/browser popup, attack_hand and interact_ai).
// /obj/machinery/computer/communications/proc/ui_interact  (modern tg: CommunicationsConsole)  may sleep
rt.def("/obj/machinery/computer/communications/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (this.z > 6) {
		to_chat(user, "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!");
		return f.dot;
	}
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "communications_console", this.name, 420, 520, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/machinery/computer/communications/proc/ui_data
rt.def("/obj/machinery/computer/communications/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let is_ai: boolean = false, timeleft: number = 0, cur: number = 0, n: number = 0, i: number = 0, shuttle_id: Value = null, S: Value = null;
	let data: Value = list();
	is_ai = truthy(rt.istype(user, T("/mob/living/silicon")));
	let screen: Value = is_ai ? this.aistate : this.state;
	rt.setAt(data, "is_ai", is_ai ? 1 : 0);
	rt.setAt(data, "screen", screen);
	rt.setAt(data, "authenticated", this.authenticated);
	rt.setAt(data, "auth_id", this.auth_id);
	rt.setAt(data, "emagged", this.emagged);
	let mode: Value = GLOB.SSshuttle.emergency.mode;
	rt.setAt(data, "shuttle_mode", mode);
	// the old human menu offered "call" on idle or recall, "cancel" otherwise; the AI menu only offered "call" on idle
	rt.setAt(data, "can_call", (is_ai ? mode == "idle" : (mode == "idle" || mode == "recall")) ? 1 : 0);
	rt.setAt(data, "can_cancel", !is_ai && mode != "idle" && mode != "recall" ? 1 : 0);
	if (mode == "call") {
		timeleft = Number(GLOB.SSshuttle.emergency.timeLeft());
		rt.setAt(data, "eta", String(Math.floor(timeleft / 60 % 60)) + ":" + (Math.floor(timeleft % 60) < 10 ? "0" : "") + String(Math.floor(timeleft % 60)));
	} else {
		rt.setAt(data, "eta", null);
	}
	rt.setAt(data, "call_amount", GLOB.SSshuttle.emergencyCallAmount ? 1 : 0);
	if (GLOB.SSshuttle.emergencyLastCallLoc) {
		rt.setAt(data, "last_call_loc", format_text(GLOB.SSshuttle.emergencyLastCallLoc.name));
	} else {
		rt.setAt(data, "last_call_loc", null);
	}
	// messages
	let msgs: Value = list();
	n = Number(rt.len(f, this.messagetitle));
	for (i = 1; i <= n; i++) {
		rt.modify(msgs, list(rt.alist(f, ["num", i, "title", rt.index(this.messagetitle, i)])), add);
	}
	rt.setAt(data, "messages", msgs);
	cur = Number(is_ai ? this.aicurrmsg : this.currmsg);
	if (cur > 0 && cur <= n) {
		rt.setAt(data, "msg_title", rt.index(this.messagetitle, cur));
		rt.setAt(data, "msg_text", rt.index(this.messagetext, cur));
	} else {
		rt.setAt(data, "msg_title", null);
		rt.setAt(data, "msg_text", null);
	}
	// status displays
	rt.setAt(data, "stat_msg1", this.stat_msg1);
	rt.setAt(data, "stat_msg2", this.stat_msg2);
	// alert level
	rt.setAt(data, "sec_level", get_security_level());
	rt.setAt(data, "sec_delta", GLOB.security_level == 3 ? 1 : 0);
	rt.setAt(data, "tmp_level", this.tmp_alertlevel ? num2seclevel(this.tmp_alertlevel) : null);
	rt.setAt(data, "emergency_access", GLOB.emergency_access == 1 ? 1 : 0);
	rt.setAt(data, "cc_ready", this.checkCCcooldown() ? 1 : 0);
	// shuttle purchase
	rt.setAt(data, "budget", GLOB.SSshuttle.points);
	rt.setAt(data, "shuttle_purchased", GLOB.SSshuttle.shuttle_purchased ? 1 : 0);
	let shuttles: Value = list();
	if (!is_ai && screen == 11) {
		for (shuttle_id of each(GLOB.SSmapping.shuttle_templates)) {
			S = rt.index(GLOB.SSmapping.shuttle_templates, shuttle_id);
			if (S.can_be_bought && S.credit_cost < 1e+31) {
				rt.modify(shuttles, list(rt.alist(f, ["id", shuttle_id, "name", S.name, "cost", S.credit_cost, "description", S.description, "prerequisites", S.prerequisites])), add);
			}
		}
	}
	rt.setAt(data, "shuttles", shuttles);
	return data;
});

// /obj/machinery/computer/communications/proc/ui_act
// Every button becomes the Topic operation of the same name (silicons get the "ai-" ones), so the rules live in Topic only.
rt.def("/obj/machinery/computer/communications/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let ai: boolean = false;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let op: Value = action;
	ai = truthy(rt.istype(f.usr, T("/mob/living/silicon")));
	if (ai && !["setstat", "setmsg1", "setmsg2"].includes(String(op))) {
		op = "ai-" + String(op);
	}
	let hl: Value = list();
	rt.setAt(hl, "operation", op);
	for (const k of ["call", "message-num", "newalertlevel", "statdisp", "alert", "shuttle_id"]) {
		if (rt.at(params, k) !== null) rt.setAt(hl, k, rt.at(params, k));
	}
	if ((op === "callshuttle2" || op === "ai-callshuttle2") && rt.at(hl, "call") === null) {
		// the old form had a text field for the nature of the emergency; the window asks with a prompt instead
		rt.setAt(hl, "call", (yield* stripped_input(f.usr, "Nature of the emergency? (give a reason of at least 12 characters, or the shuttle will not be called)", "Call the emergency shuttle")));
		if (!rt.at(hl, "call")) return 1;
	}
	yield* this.Topic("", hl);
	return 1;
}, true);

// communications.dm:659
rt.def("/obj/machinery/computer/communications/proc/make_announcement", function* make_announcement(f: Frame, user: Value, is_silicon: Value) {
	let input: Value = null;
	if (!GLOB.SScommunications.can_announce(user, is_silicon)) {
		to_chat(user, "Intercomms recharging. Please stand by.");
		return f.dot;
	}
	if (!(input = (yield* stripped_input(user, "Please choose a message to announce to the station crew.", "What?"))) || !user.canUseTopic(this)) {
		return f.dot;
	}
	yield* GLOB.SScommunications.make_announcement(user, is_silicon, input);
	return f.dot;
}, true);

// communications.dm:669
rt.def("/obj/machinery/computer/communications/proc/post_status", function* post_status(f: Frame, command: Value, data1: Value, data2: Value) {
	let frequency: Value = null, status_signal: Value = null;
	if (!(frequency = GLOB.SSradio.return_frequency(1435))) {
		return f.dot;
	}
	(status_signal = (yield* new_(T("/datum/signal")))).source = this;
	status_signal.transmission_method = 1;
	rt.setAt(status_signal.data, "command", command);
	if (command === "message") {
		rt.setAt(status_signal.data, "msg1", data1);
		rt.setAt(status_signal.data, "msg2", data2);
	} else if (command === "alert") {
		rt.setAt(status_signal.data, "picture_state", data1);
	}
	yield* frequency.post_signal(this, status_signal);
	return f.dot;
}, true);

// communications.dm:689
rt.def("/obj/machinery/computer/communications/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.shuttle_caller_list -= this;
	yield* GLOB.SSshuttle.autoEvac();
	return (yield* parent_proc());
}, true);

// communications.dm:694
rt.def("/obj/machinery/computer/communications/proc/overrideCooldown", function overrideCooldown(f: Frame) {
	let CM: Value = null;
	(CM = this.circuit).lastTimeUsed = 0;
	return f.dot;
});
