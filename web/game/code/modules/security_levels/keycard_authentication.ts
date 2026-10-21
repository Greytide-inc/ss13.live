// From code/modules/security_levels/keycard_authentication.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalkeycard_events  (code/modules/security_levels/keycard_authentication.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalkeycard_events", function InitGlobalkeycard_events(f: Frame) {
	rt.setGl("keycard_events", rt.new_(f, T("/datum/events"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "keycard_events", add);
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

// /obj/machinery/keycard_auth/proc/<init>  (code/modules/security_levels/keycard_authentication.dm:13)
rt.def("/obj/machinery/keycard_auth/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(60));
	return f.dot;
});

// /obj/machinery/keycard_auth/proc/Initialize  (code/modules/security_levels/keycard_authentication.dm:22)  may sleep
rt.def("/obj/machinery/keycard_auth/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "ev", (yield* g.callName(f, rt.gl("keycard_events"), "addEvent", ["triggerEvent", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/keycard_auth/proc/triggerEvent")]))])));
	return f.dot;
}, true);

// /obj/machinery/keycard_auth/proc/Destroy  (code/modules/security_levels/keycard_authentication.dm:26)  may sleep
rt.def("/obj/machinery/keycard_auth/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("keycard_events"), "clearEvent", ["triggerEvent", rt.sv(f, "ev")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "ev")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/keycard_auth/proc/ui_interact  (code/modules/security_levels/keycard_authentication.dm:32)  may sleep
rt.def("/obj/machinery/keycard_auth/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "keycard_auth", rt.sv(f, "name"), 375, 125, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/keycard_auth/proc/ui_data  (code/modules/security_levels/keycard_authentication.dm:38)
rt.def("/obj/machinery/keycard_auth/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, $0, $1, $2];
	rt.setAt((data = rt.list()), "waiting", rt.sv(f, "waiting"));
	$0 = live(data);
	$1 = "auth_required";
	if (truthy(rt.sv(f, "event_source"))) {
		$2 = rt.fv(f, "event", rt.sv(f, "event_source"));
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "red_alert";
	if (rt.ge(rt.call(f, P("/proc/seclevel2num"), null, [rt.call(f, P("/proc/get_security_level"), null, [])]), 2)) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "emergency_maint", rt.gl("emergency_access"));
	rt.setAt(live(data), "bsa_unlock", rt.gl("bsa_unlock"));
	return live(data);
});

// /obj/machinery/keycard_auth/proc/ui_status  (code/modules/security_levels/keycard_authentication.dm:47)
rt.def("/obj/machinery/keycard_auth/proc/ui_status", function ui_status(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "dextrous", (A = live(f.args[0]))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You are too primitive to use this device!</span>"]);
			return -1;
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

// /obj/machinery/keycard_auth/proc/ui_act  (code/modules/security_levels/keycard_authentication.dm:55)  may sleep
rt.def("/obj/machinery/keycard_auth/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || truthy(rt.sv(f, "waiting"))) || !truthy((yield* g.srcCall(f, "allowed", live(f.usr)))))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "red_alert") {
		if (!truthy(rt.sv(f, "event_source"))) {
			yield* g.srcCall(f, "sendEvent", "Red Alert");
			f.dot = 1;
		}
	} else if ($0 === "emergency_maint") {
		if (!truthy(rt.sv(f, "event_source"))) {
			yield* g.srcCall(f, "sendEvent", "Emergency Maintenance Access");
			f.dot = 1;
		}
	} else if ($0 === "auth_swipe") {
		if (truthy(rt.sv(f, "event_source"))) {
			yield* g.callName(f, rt.sv(f, "event_source"), "trigger_event", [live(f.usr)]);
			rt.setSv(f, "event_source", null);
			f.dot = 1;
		}
	} else if ($0 === "bsa_unlock") {
		if (truthy(rt.sv(f, "event_source"))) return f.dot;
		yield* g.srcCall(f, "sendEvent", "Bluespace Artillery Unlock");
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/keycard_auth/proc/sendEvent  (code/modules/security_levels/keycard_authentication.dm:77)  may sleep
rt.def("/obj/machinery/keycard_auth/proc/sendEvent", function* sendEvent(f: Frame, event_type: Value) {
	f.vars = () => [event_type];
	rt.setSv(f, "triggerer", live(f.usr));
	rt.setSv(f, "event", live(event_type));
	rt.setSv(f, "waiting", 1);
	yield* g.callName(f, rt.gl("keycard_events"), "fireEvent", ["triggerEvent", live(f.src)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/keycard_auth/proc/eventSent")])), 20]);
	return f.dot;
}, true);

// /obj/machinery/keycard_auth/proc/eventSent  (code/modules/security_levels/keycard_authentication.dm:85)
rt.def("/obj/machinery/keycard_auth/proc/eventSent", function eventSent(f: Frame) {
	rt.setSv(f, "triggerer", null);
	rt.setSv(f, "event", "");
	rt.setSv(f, "waiting", 0);
	return f.dot;
});

// /obj/machinery/keycard_auth/proc/triggerEvent  (code/modules/security_levels/keycard_authentication.dm:89)  may sleep
rt.def("/obj/machinery/keycard_auth/proc/triggerEvent", function* triggerEvent(f: Frame, source: Value) {
	f.vars = () => [source];
	rt.setSv(f, "icon_state", "auth_on");
	rt.setSv(f, "event_source", live(source));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/keycard_auth/proc/eventTriggered")])), 20]);
	return f.dot;
}, true);

// /obj/machinery/keycard_auth/proc/eventTriggered  (code/modules/security_levels/keycard_authentication.dm:94)
rt.def("/obj/machinery/keycard_auth/proc/eventTriggered", function eventTriggered(f: Frame) {
	rt.setSv(f, "icon_state", "auth_off");
	rt.setSv(f, "event_source", null);
	return f.dot;
});

// /obj/machinery/keycard_auth/proc/trigger_event  (code/modules/security_levels/keycard_authentication.dm:98)
rt.def("/obj/machinery/keycard_auth/proc/trigger_event", function trigger_event(f: Frame, confirmer: Value) {
	let $0: any;
	f.vars = () => [$0];
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ triggered and ＀ confirmed event ＀", [rt.call(f, P("/proc/key_name"), null, [rt.sv(f, "triggerer")]), rt.call(f, P("/proc/key_name"), null, [live(confirmer)]), rt.sv(f, "event")])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ triggered and ＀ confirmed event ＀", [rt.call(f, P("/proc/key_name"), null, [rt.sv(f, "triggerer")]), rt.call(f, P("/proc/key_name"), null, [live(confirmer)]), rt.sv(f, "event")])]);
	$0 = rt.sv(f, "event");
	if ($0 === "Red Alert") {
		rt.call(f, P("/proc/set_security_level"), null, [2]);
	} else if ($0 === "Emergency Maintenance Access") {
		rt.call(f, P("/proc/make_maint_all_access"), null, []);
	} else if ($0 === "Bluespace Artillery Unlock") {
		rt.call(f, P("/proc/toggle_bluespace_artillery"), null, []);
	}
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalemergency_access  (code/modules/security_levels/keycard_authentication.dm:111)
rt.def("/datum/controller/global_vars/proc/InitGlobalemergency_access", function InitGlobalemergency_access(f: Frame) {
	rt.setGl("emergency_access", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "emergency_access", add);
	return f.dot;
});

// /proc/make_maint_all_access  (code/modules/security_levels/keycard_authentication.dm:113)
rt.def("/proc/make_maint_all_access", function make_maint_all_access(f: Frame) {
	let A: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [A, D, $e];
	A = null;
	rt.forList(f, 0, rt.world(), T("/area/maintenance"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		D = null;
		rt.forList(f, 1, live(A), T("/obj/machinery/door/airlock"));
		while (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			rt.setFv(f, "emergency", live(D), 1);
			rt.callName(f, live(D), "update_icon", [0]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/minor_announce"), null, ["Access restrictions on maintenance and external airlocks have been lifted.", "Attention! Station-wide emergency declared!", 1]);
	rt.setGl("emergency_access", 1);
	return f.dot;
});

// /proc/revoke_maint_all_access  (code/modules/security_levels/keycard_authentication.dm:121)
rt.def("/proc/revoke_maint_all_access", function revoke_maint_all_access(f: Frame) {
	let A: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [A, D, $e];
	A = null;
	rt.forList(f, 0, rt.world(), T("/area/maintenance"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		D = null;
		rt.forList(f, 1, live(A), T("/obj/machinery/door/airlock"));
		while (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			rt.setFv(f, "emergency", live(D), 0);
			rt.callName(f, live(D), "update_icon", [0]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/minor_announce"), null, ["Access restrictions in maintenance areas have been restored.", "Attention! Station-wide emergency rescinded:"]);
	rt.setGl("emergency_access", 0);
	return f.dot;
});

// /proc/toggle_bluespace_artillery  (code/modules/security_levels/keycard_authentication.dm:129)
rt.def("/proc/toggle_bluespace_artillery", function toggle_bluespace_artillery(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setGl("bsa_unlock", (!truthy(rt.gl("bsa_unlock")) ? 1 : 0));
	if (truthy(rt.gl("bsa_unlock"))) {
		$0 = "unlocked";
	} else {
		$0 = "locked";
	}
	rt.call(f, P("/proc/minor_announce"), null, [fmt("Bluespace Artillery firing protocols have been ＀", [$0]), "Weapons Systems Update:"]);
	return f.dot;
});
