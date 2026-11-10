// Based on /tg/station's code/modules/security_levels/keycard_authentication.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// keycard_authentication.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalkeycard_events", function InitGlobalkeycard_events(f: Frame) {
	GLOB.keycard_events = new_(T("/datum/events"));
	this.gvars_datum_init_order += "keycard_events";
	return f.dot;
});

rt.type(10988, "/obj/machinery/keycard_auth", "/obj/machinery", {
	ev: null,
	event: "",
	event_source: null,
	triggerer: null,
	waiting: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 6,
	power_channel: 3,
	name: "Keycard Authentication Device",
	desc: "This device is used to trigger station functions, which require more than one ID card to authenticate.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "auth_off",
	req_access: null,
	resistance_flags: 115,
});

// keycard_authentication.dm:13
rt.def("/obj/machinery/keycard_auth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(60);
	return f.dot;
});

// keycard_authentication.dm:22
rt.def("/obj/machinery/keycard_auth/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.ev = GLOB.keycard_events.addEvent("triggerEvent", (yield* new_(T("/datum/callback"), this, P("/obj/machinery/keycard_auth/proc/triggerEvent"))));
	return f.dot;
}, true);

// keycard_authentication.dm:26
rt.def("/obj/machinery/keycard_auth/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.keycard_events.clearEvent("triggerEvent", this.ev);
	yield* qdel(this.ev);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// keycard_authentication.dm:32
rt.def("/obj/machinery/keycard_auth/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "keycard_auth", this.name, 375, 125, master_ui, state))).open();
	return f.dot;
}, true);

// keycard_authentication.dm:38
rt.def("/obj/machinery/keycard_auth/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "waiting", this.waiting);
	let $0: any = data;
	let $1: any = "auth_required";
	rt.setAt($0, $1, this.event_source ? this.event_source.event : 0);
	rt.setAt(data, "red_alert", seclevel2num(get_security_level()) >= SEC_LEVEL_RED ? 1 : 0);
	rt.setAt(data, "emergency_maint", GLOB.emergency_access);
	rt.setAt(data, "bsa_unlock", GLOB.bsa_unlock);
	return data;
});

// keycard_authentication.dm:47
rt.def("/obj/machinery/keycard_auth/proc/ui_status", function ui_status(f: Frame, user: Value) {
	let A: Value = null;
	if (rt.istype(user, T("/mob/living/simple_animal"))) {
		if (!(A = user).dextrous) {
			to_chat(user, "<span class='warning'>You are too primitive to use this device!</span>");
			return UI_CLOSE;
		}
	}
	return parent_proc();
}, false);

// keycard_authentication.dm:55
rt.def("/obj/machinery/keycard_auth/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if ((yield* parent_proc()) || this.waiting || !(yield* this.allowed(f.usr))) {
		return f.dot;
	}
	if (action === "red_alert") {
		if (!this.event_source) {
			yield* this.sendEvent("Red Alert");
			f.dot = 1;
		}
	} else if (action === "emergency_maint") {
		if (!this.event_source) {
			yield* this.sendEvent("Emergency Maintenance Access");
			f.dot = 1;
		}
	} else if (action === "auth_swipe") {
		if (this.event_source) {
			this.event_source.trigger_event(f.usr);
			this.event_source = null;
			f.dot = 1;
		}
	} else if (action === "bsa_unlock") {
		if (this.event_source) return f.dot;
		yield* this.sendEvent("Bluespace Artillery Unlock");
		f.dot = 1;
	}
	return f.dot;
}, true);

// keycard_authentication.dm:77
rt.def("/obj/machinery/keycard_auth/proc/sendEvent", function* sendEvent(f: Frame, event_type: Value) {
	this.triggerer = f.usr;
	this.event = event_type;
	this.waiting = 1;
	GLOB.keycard_events.fireEvent("triggerEvent", this);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/keycard_auth/proc/eventSent"))), 20);
	return f.dot;
}, true);

// keycard_authentication.dm:85
rt.def("/obj/machinery/keycard_auth/proc/eventSent", function eventSent(f: Frame) {
	this.triggerer = null;
	this.event = "";
	this.waiting = 0;
	return f.dot;
});

// keycard_authentication.dm:89
rt.def("/obj/machinery/keycard_auth/proc/triggerEvent", function* triggerEvent(f: Frame, source: Value) {
	this.icon_state = "auth_on";
	this.event_source = source;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/keycard_auth/proc/eventTriggered"))), 20);
	return f.dot;
}, true);

// keycard_authentication.dm:94
rt.def("/obj/machinery/keycard_auth/proc/eventTriggered", function eventTriggered(f: Frame) {
	this.icon_state = "auth_off";
	this.event_source = null;
	return f.dot;
});

// keycard_authentication.dm:98
rt.def("/obj/machinery/keycard_auth/proc/trigger_event", function trigger_event(f: Frame, confirmer: Value) {
	log_game(`${key_name(this.triggerer)} triggered and ${key_name(confirmer)} confirmed event ${this.event}`);
	message_admins(`${key_name(this.triggerer)} triggered and ${key_name(confirmer)} confirmed event ${this.event}`);
	if (this.event === "Red Alert") {
		set_security_level(SEC_LEVEL_RED);
	} else if (this.event === "Emergency Maintenance Access") {
		make_maint_all_access();
	} else if (this.event === "Bluespace Artillery Unlock") {
		toggle_bluespace_artillery();
	}
	return f.dot;
});

// keycard_authentication.dm:111
rt.def("/datum/controller/global_vars/proc/InitGlobalemergency_access", function InitGlobalemergency_access(f: Frame) {
	GLOB.emergency_access = 0;
	this.gvars_datum_init_order += "emergency_access";
	return f.dot;
});

// keycard_authentication.dm:113
rt.def("/proc/make_maint_all_access", function make_maint_all_access(f: Frame) {
	let A: Value = null, D: Value = null;
	for (A of each(rt.world(), T("/area/maintenance"))) {
		D = null;
		for (D of each(A, T("/obj/machinery/door/airlock"))) {
			D.emergency = 1;
			D.update_icon(0);
		}
	}
	minor_announce("Access restrictions on maintenance and external airlocks have been lifted.", "Attention! Station-wide emergency declared!", 1);
	GLOB.emergency_access = 1;
	return f.dot;
});

// keycard_authentication.dm:121
rt.def("/proc/revoke_maint_all_access", function revoke_maint_all_access(f: Frame) {
	let A: Value = null, D: Value = null;
	for (A of each(rt.world(), T("/area/maintenance"))) {
		D = null;
		for (D of each(A, T("/obj/machinery/door/airlock"))) {
			D.emergency = 0;
			D.update_icon(0);
		}
	}
	minor_announce("Access restrictions in maintenance areas have been restored.", "Attention! Station-wide emergency rescinded:");
	GLOB.emergency_access = 0;
	return f.dot;
});

// keycard_authentication.dm:129
rt.def("/proc/toggle_bluespace_artillery", function toggle_bluespace_artillery(f: Frame) {
	let $0: any;
	GLOB.bsa_unlock = (!GLOB.bsa_unlock ? 1 : 0);
	if (GLOB.bsa_unlock) {
		$0 = "unlocked";
	} else {
		$0 = "locked";
	}
	minor_announce(`Bluespace Artillery firing protocols have been ${$0}`, "Weapons Systems Update:");
	return f.dot;
});
