// Based on /tg/station's code/game/machinery/computer/apc_control.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10363, "/obj/machinery/computer/apc_control", "/obj/machinery/computer", {
	apcs: null,
	operator: null,
	active_apc: null,
	filters: null,
	checking_logs: 0,
	logs: null,
	authenticated: 0,
	auth_id: "[NULL]",
	light_color: "#E1E17D",
	name: "power flow control console",
	desc: "Used to remotely control the flow of power to different parts of the station.",
	icon_screen: "solar",
	icon_keyboard: "power_key",
	req_access: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/apc_control"),
});

// apc_control.dm:6
rt.def("/obj/machinery/computer/apc_control/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(10);
	return f.dot;
});

// apc_control.dm:19
rt.def("/obj/machinery/computer/apc_control/proc/Initialize", function* Initialize(f: Frame) {
	this.apcs = list();
	this.filters = rt.alist(f, ["Name", null, "Charge Above", null, "Charge Below", null, "Responsive", null]);
	yield* parent_proc();
	return f.dot;
}, true);

// apc_control.dm:24
rt.def("/obj/machinery/computer/apc_control/proc/process", function* process(f: Frame) {
	let V: Value = null, APC: Value = null;
	this.apcs = list();
	for (V of each(GLOB.apcs_list)) {
		if (this.check_apc((APC = V))) {
			rt.setAt(this.apcs, APC.name, APC);
		}
	}
	if (!(this.operator && (!this.operator.Adjacent(this) || this.stat))) return f.dot;
	this.operator = null;
	if (!this.active_apc) return f.dot;
	if (!this.active_apc.locked) {
		yield* this.active_apc.say("Remote access canceled. Interface locked.");
		playsound(this.active_apc, rt.rsc("sound/machines/boltsdown.ogg"), 25, 0);
		playsound(this.active_apc, rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0);
	}
	this.active_apc.locked = 1;
	yield* this.active_apc.update_icon();
	this.active_apc = null;
	return f.dot;
}, true, { waitfor: false });

// apc_control.dm:41
rt.def("/obj/machinery/computer/apc_control/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!IsAdminGhost(user)) {
		to_chat(user, `<span class='warning'>${this} does not support AI control.</span>`);
		return f.dot;
	}
	yield* parent_proc(user);
	return f.dot;
}, true);

// apc_control.dm:47
rt.def("/obj/machinery/computer/apc_control/proc/check_apc", function check_apc(f: Frame, APC: Value) {
	return (((((((APC.z == this.z ? 1 : 0) && (!APC.malfhack ? 1 : 0)) && (!APC.aidisabled ? 1 : 0)) && (!APC.emagged ? 1 : 0)) && (!APC.stat ? 1 : 0)) && (!rt.istype(APC.area, T("/area/ai_monitored")) ? 1 : 0)) && (!APC.area.outdoors ? 1 : 0));
});

// apc_control.dm:52
rt.def("/obj/machinery/computer/apc_control/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, A: Value = null, APC: Value = null, entry: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $e: any;
	if (this.authenticated) {
		if (!this.checking_logs) {
			dat += `Logged in as ${this.auth_id}.<br><br>`;
			dat += "<i>Filters</i><br>";
			$0 = this;
			if (rt.at(this.filters, "Name")) {
				$1 = rt.at(this.filters, "Name");
			} else {
				$1 = "None set";
			}
			dat += fmt("<b>Name:</b> <a href='?src=＃;name_filter=1'>＀</a><br>", [$0, $1]);
			$0 = this;
			if (rt.at(this.filters, "Charge Above")) {
				$1 = rt.at(this.filters, "Charge Above");
			} else {
				$1 = "NaN";
			}
			$2 = this;
			if (rt.at(this.filters, "Charge Below")) {
				$3 = rt.at(this.filters, "Charge Below");
			} else {
				$3 = "NaN";
			}
			dat += fmt("<b>Charge:</b> <a href='?src=＃;above_filter=1'>>＀%</a> and <a href='?src=＃;below_filter=1'><＀%</a><br>", [$0, $1, $2, $3]);
			$0 = this;
			if (rt.at(this.filters, "Responsive")) {
				$1 = "Non-Responsive Only";
			} else {
				$1 = "All";
			}
			dat += fmt("<b>Accessible:</b> <a href='?src=＃;access_filter=1'>＀</a><br><br>", [$0, $1]);
			for (A of each(this.apcs)) {
				APC = rt.index(this.apcs, A);
				if (rt.at(this.filters, "Name") && !findtext(APC.name, rt.at(this.filters, "Name")) && !findtext(APC.area.name, rt.at(this.filters, "Name"))) {
					continue;
				}
				if (rt.at(this.filters, "Charge Above") && APC.cell.charge / APC.cell.maxcharge < rt.at(this.filters, "Charge Above") / 100) {
					continue;
				}
				if (rt.at(this.filters, "Charge Below") && APC.cell.charge / APC.cell.maxcharge > rt.at(this.filters, "Charge Below") / 100) {
					continue;
				}
				if (rt.at(this.filters, "Responsive") && !APC.aidisabled) {
					continue;
				}
				$0 = this;
				$1 = APC;
				$2 = A;
				$3 = APC.cell.charge;
				$4 = APC.cell.maxcharge;
				$5 = round(APC.cell.charge / APC.cell.maxcharge * 100);
				$6 = APC.area;
				if (APC.aidisabled || APC.panel_open) {
					$7 = "<font color='#FF0000'>APC does not respond to interface query.</font>";
				} else {
					$7 = "<font color='#00FF00'>APC responds to interface query.</font>";
				}
				dat += fmt("<a href='?src=＃;access_apc=＃'>＀</a><br><b>Charge:</b> ＀ / ＀ W (＀%)<br><b>Area:</b> ＀<br>＀<br><br>", [$0, $1, $2, $3, $4, $5, $6, $7]);
			}
			dat += fmt("<a href='?src=＃;check_logs=1'>Check Logs</a><br>", [this]);
			dat += fmt("<a href='?src=＃;log_out=1'>Log Out</a><br>", [this]);
			if (this.emagged) {
				dat += "<font color='#FF0000'>WARNING: Logging functionality partially disabled from outside source.</font><br>";
				dat += fmt("<a href='?src=＃;restore_logging=1'>Restore logging functionality?</a><br>", [this]);
			}
		} else {
			if (rt.len(f, this.logs)) {
				for (entry of each(this.logs)) {
					dat += `${entry}<br>`;
				}
			} else {
				dat += "<i>No activity has been recorded at this time.</i><br>";
			}
			if (this.emagged) {
				dat += fmt("<a href='?src=＃;clear_logs=1'><font color='#FF0000'>@#%! CLEAR LOGS</a>", [this]);
			}
			dat += fmt("<a href='?src=＃;check_apcs=1'>Return</a>", [this]);
		}
		this.operator = user;
	} else {
		dat = fmt("<a href='?src=＃;authenticate=1'>Please swipe a valid ID to log in...</a>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "apc_control", this.name, 600, 400))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// apc_control.dm:95
rt.def("/obj/machinery/computer/apc_control/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ID: Value = null, E: Value = null, APC: Value = null, new_filter: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!f.usr || !f.usr.canUseTopic(this) || f.usr.incapacitated() || this.stat || !this || this.gc_destroyed) {
		return f.dot;
	}
	if (rt.at(href_list, "authenticate")) {
		if (!rt.istype((ID = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
			ID = f.usr.get_idcard();
		}
		if (ID && rt.istype(ID, T("/obj/item/weapon/card/id"))) {
			if (this.check_access(ID)) {
				this.authenticated = 1;
				this.auth_id = `${ID.registered_name} (${ID.assignment})`;
				this.log_activity("logged in");
			}
		}
		if (!this.authenticated) {
			if ((E = f.usr.get_active_held_item()) && rt.istype(E, T("/obj/item/weapon/card/emag")) && f.usr.Adjacent(this)) {
				to_chat(f.usr, `<span class='warning'>You bypass ${this}'s access requirements using your emag.</span>`);
				this.authenticated = 1;
				this.log_activity("logged in");
			}
		}
	}
	if (rt.at(href_list, "log_out")) {
		this.log_activity("logged out");
		this.authenticated = 0;
		this.auth_id = "[NULL]";
	}
	if (rt.at(href_list, "restore_logging")) {
		to_chat(f.usr, `<span class='robot notice'>${bicon(this)} Logging functionality restored from backup data.</span>`);
		this.emagged = 0;
		if (!this.logs) {
			this.logs = list();
		}
		this.logs += "<b>-=- Logging restored to full functionality at this point -=-</b>";
	}
	if (rt.at(href_list, "access_apc")) {
		playsound(this, "terminal_type", 50, 0);
		if (!(APC = rt.locateIn(f, rt.at(href_list, "access_apc"), GLOB.apcs_list)) || APC.aidisabled || APC.panel_open || !APC || APC.gc_destroyed) {
			to_chat(f.usr, `<span class='robot danger'>${bicon(this)} APC does not return interface request. Remote access may be disabled.</span>`);
			return f.dot;
		}
		if (this.active_apc) {
			to_chat(f.usr, `<span class='robot danger'>${bicon(this)} Disconnected from ${this.active_apc}.</span>`);
			yield* this.active_apc.say("Remote access canceled. Interface locked.");
			playsound(this.active_apc, rt.rsc("sound/machines/boltsdown.ogg"), 25, 0);
			playsound(this.active_apc, rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0);
			this.active_apc.locked = 1;
			yield* this.active_apc.update_icon();
			this.active_apc = null;
		}
		to_chat(f.usr, `<span class='robot notice'>${bicon(this)} Connected to APC in ${get_area(APC)}. Interface request sent.</span>`);
		this.log_activity(`remotely accessed APC in ${get_area(APC)}`);
		yield* APC.interact(f.usr, GLOB.not_incapacitated_state);
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		message_admins(`${key_name_admin(f.usr)} remotely accessed ${APC} from ${this} at ${get_area(this)}.`);
		log_game(`${key_name_admin(f.usr)} remotely accessed ${APC} from ${this} at ${get_area(this)}.`);
		if (APC.locked) {
			yield* APC.say("Remote access detected. Interface unlocked.");
			playsound(APC, rt.rsc("sound/machines/boltsup.ogg"), 25, 0);
			playsound(APC, rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0);
		}
		APC.locked = 0;
		yield* APC.update_icon();
		this.active_apc = APC;
	}
	if (rt.at(href_list, "name_filter")) {
		playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0);
		new_filter = (yield* stripped_input(f.usr, "What name are you looking for?", this.name));
		if (!this || !f.usr || !f.usr.canUseTopic(this) || this.stat || !this || this.gc_destroyed) {
			return f.dot;
		}
		this.log_activity(`changed name filter to "${new_filter}"`);
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		rt.setAt(this.filters, "Name", new_filter);
	}
	if (rt.at(href_list, "above_filter")) {
		playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0);
		new_filter = (yield* g.op(f, "Prompt", [33], [null, this.name, "Enter a percentage from 1-100 to sort by (greater than).", f.usr, null]));
		if (!this || !f.usr || !f.usr.canUseTopic(this) || this.stat || !this || this.gc_destroyed) {
			return f.dot;
		}
		this.log_activity(`changed greater than charge filter to "${new_filter}"`);
		if (new_filter) {
			new_filter = max(0, min(new_filter, 100));
		}
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		rt.setAt(this.filters, "Charge Above", new_filter);
	}
	if (rt.at(href_list, "below_filter")) {
		playsound(this, rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0);
		new_filter = (yield* g.op(f, "Prompt", [33], [null, this.name, "Enter a percentage from 1-100 to sort by (lesser than).", f.usr, null]));
		if (!this || !f.usr || !f.usr.canUseTopic(this) || this.stat || !this || this.gc_destroyed) {
			return f.dot;
		}
		this.log_activity(`changed lesser than charge filter to "${new_filter}"`);
		if (new_filter) {
			new_filter = max(0, min(new_filter, 100));
		}
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
		rt.setAt(this.filters, "Charge Below", new_filter);
	}
	if (rt.at(href_list, "access_filter")) {
		if (rt.at(this.filters, "Responsive") === null) {
			rt.setAt(this.filters, "Responsive", 1);
			this.log_activity("sorted by non-responsive APCs only");
		} else {
			rt.setAt(this.filters, "Responsive", (!rt.at(this.filters, "Responsive") ? 1 : 0));
			this.log_activity("sorted by all APCs");
		}
		playsound(this, rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0);
	}
	if (rt.at(href_list, "check_logs")) {
		this.checking_logs = 1;
		this.log_activity("checked logs");
	}
	if (rt.at(href_list, "check_apcs")) {
		this.checking_logs = 0;
		this.log_activity("checked APCs");
	}
	if (rt.at(href_list, "clear_logs")) {
		this.logs = list();
	}
	yield* this.interact(f.usr);
	return f.dot;
}, true);

// apc_control.dm:198
rt.def("/obj/machinery/computer/apc_control/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) {
		return f.dot;
	}
	user.visible_message(`<span class='warning'>You emag ${this}, disabling precise logging and allowing you to clear logs.</span>`);
	log_game(`${key_name_admin(user)} emagged ${this} at ${get_area(this)}, disabling operator tracking.`);
	playsound(this, "sparks", 50, 1);
	this.emagged = 1;
	return f.dot;
});

// apc_control.dm:204
rt.def("/obj/machinery/computer/apc_control/proc/log_activity", function log_activity(f: Frame, log_text: Value) {
	let op_string: Value = this.operator && !this.emagged ? this.operator : "[NULL OPERATOR]";
	if (!this.logs) {
		this.logs = list();
	}
	this.logs += `<b>(${worldtime2text()})</b> ${op_string} ${log_text}`;
	return f.dot;
});

// apc_control.dm:208
rt.def("/mob/proc/using_power_flow_console", function using_power_flow_console(f: Frame) {
	let A: Value = null;
	for (A of each(range(1, this), T("/obj/machinery/computer/apc_control"))) {
		if (A.operator && A.operator == this && !A.stat) {
			return 1;
		}
	}
	return f.dot;
});
