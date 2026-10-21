// From code/game/machinery/computer/apc_control.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/apc_control/proc/<init>  (code/game/machinery/computer/apc_control.dm:6)
rt.def("/obj/machinery/computer/apc_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(10));
	return f.dot;
});

// /obj/machinery/computer/apc_control/proc/Initialize  (code/game/machinery/computer/apc_control.dm:19)  may sleep
rt.def("/obj/machinery/computer/apc_control/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "apcs", rt.list());
	rt.setSv(f, "filters", rt.alist(f, ["Name", null, "Charge Above", null, "Charge Below", null, "Responsive", null]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/computer/apc_control/proc/process  (code/game/machinery/computer/apc_control.dm:24)  may sleep
rt.def("/obj/machinery/computer/apc_control/proc/process", function* process(f: Frame) {
	let V: Value = null, APC: Value = null;
	let $e: any;
	f.vars = () => [V, APC, $e];
	rt.setSv(f, "apcs", rt.list());
	V = null;
	rt.forList(f, 0, rt.gl("apcs_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy((yield* g.srcCall(f, "check_apc", (APC = live(V)))))) {
			rt.setAt(rt.sv(f, "apcs"), rt.fv(f, "name", live(APC)), live(APC));
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(rt.sv(f, "operator")) && (!truthy((yield* g.callName(f, rt.sv(f, "operator"), "Adjacent", [live(f.src)]))) || truthy(rt.sv(f, "stat"))))) return f.dot;
	rt.setSv(f, "operator", null);
	if (!truthy(rt.sv(f, "active_apc"))) return f.dot;
	if (!truthy(rt.fv(f, "locked", rt.sv(f, "active_apc")))) {
		yield* g.callName(f, rt.sv(f, "active_apc"), "say", ["Remote access canceled. Interface locked."]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "active_apc"), rt.rsc("sound/machines/boltsdown.ogg"), 25, 0]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "active_apc"), rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0]);
	}
	rt.setFv(f, "locked", rt.sv(f, "active_apc"), 1);
	yield* g.callName(f, rt.sv(f, "active_apc"), "update_icon", []);
	rt.setSv(f, "active_apc", null);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/apc_control/proc/attack_ai  (code/game/machinery/computer/apc_control.dm:41)  may sleep
rt.def("/obj/machinery/computer/apc_control/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ does not support AI control.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/computer/apc_control/proc/check_apc  (code/game/machinery/computer/apc_control.dm:47)
rt.def("/obj/machinery/computer/apc_control/proc/check_apc", function check_apc(f: Frame, APC: Value) {
	return (((((((isEqual(rt.fv(f, "z", live(APC)), rt.sv(f, "z")) ? 1 : 0) && (!truthy(rt.fv(f, "malfhack", live(APC))) ? 1 : 0)) && (!truthy(rt.fv(f, "aidisabled", live(APC))) ? 1 : 0)) && (!truthy(rt.fv(f, "emagged", live(APC))) ? 1 : 0)) && (!truthy(rt.fv(f, "stat", live(APC))) ? 1 : 0)) && (!truthy((rt.istype(rt.fv(f, "area", live(APC)), T("/area/ai_monitored")) ? 1 : 0)) ? 1 : 0)) && (!truthy(rt.gv(f, "outdoors", rt.fv(f, "area", live(APC)))) ? 1 : 0));
});

// /obj/machinery/computer/apc_control/proc/interact  (code/game/machinery/computer/apc_control.dm:52)  may sleep
rt.def("/obj/machinery/computer/apc_control/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, A: Value = null, APC: Value = null, entry: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $e: any;
	f.vars = () => [user, dat, A, APC, entry, popup, $0, $1, $2, $3, $4, $5, $6, $7, $e];
	dat = null;
	if (truthy(rt.sv(f, "authenticated"))) {
		if (!truthy(rt.sv(f, "checking_logs"))) {
			dat = rt.modify(live(dat), fmt("Logged in as ＀.<br><br>", [rt.sv(f, "auth_id")]), add);
			dat = rt.modify(live(dat), "<i>Filters</i><br>", add);
			$0 = live(f.src);
			if (truthy(rt.at(rt.sv(f, "filters"), "Name"))) {
				$1 = rt.at(rt.sv(f, "filters"), "Name");
			} else {
				$1 = "None set";
			}
			dat = rt.modify(live(dat), fmt("<b>Name:</b> <a href='?src=＃;name_filter=1'>＀</a><br>", [$0, $1]), add);
			$0 = live(f.src);
			if (truthy(rt.at(rt.sv(f, "filters"), "Charge Above"))) {
				$1 = rt.at(rt.sv(f, "filters"), "Charge Above");
			} else {
				$1 = "NaN";
			}
			$2 = live(f.src);
			if (truthy(rt.at(rt.sv(f, "filters"), "Charge Below"))) {
				$3 = rt.at(rt.sv(f, "filters"), "Charge Below");
			} else {
				$3 = "NaN";
			}
			dat = rt.modify(live(dat), fmt("<b>Charge:</b> <a href='?src=＃;above_filter=1'>>＀%</a> and <a href='?src=＃;below_filter=1'><＀%</a><br>", [$0, $1, $2, $3]), add);
			$0 = live(f.src);
			if (truthy(rt.at(rt.sv(f, "filters"), "Responsive"))) {
				$1 = "Non-Responsive Only";
			} else {
				$1 = "All";
			}
			dat = rt.modify(live(dat), fmt("<b>Accessible:</b> <a href='?src=＃;access_filter=1'>＀</a><br><br>", [$0, $1]), add);
			A = null;
			rt.forList(f, 0, rt.sv(f, "apcs"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				APC = rt.index(rt.sv(f, "apcs"), live(A));
				if (((truthy(rt.at(rt.sv(f, "filters"), "Name")) && !truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", live(APC)), rt.at(rt.sv(f, "filters"), "Name")])))) && !truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.gv(f, "name", rt.fv(f, "area", live(APC))), rt.at(rt.sv(f, "filters"), "Name")]))))) {
					continue;
				}
				if ((truthy(rt.at(rt.sv(f, "filters"), "Charge Above")) && rt.lt(divide(rt.gv(f, "charge", rt.fv(f, "cell", live(APC))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(APC)))), divide(rt.at(rt.sv(f, "filters"), "Charge Above"), 100)))) {
					continue;
				}
				if ((truthy(rt.at(rt.sv(f, "filters"), "Charge Below")) && rt.gt(divide(rt.gv(f, "charge", rt.fv(f, "cell", live(APC))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(APC)))), divide(rt.at(rt.sv(f, "filters"), "Charge Below"), 100)))) {
					continue;
				}
				if ((truthy(rt.at(rt.sv(f, "filters"), "Responsive")) && !truthy(rt.fv(f, "aidisabled", live(APC))))) {
					continue;
				}
				$0 = live(f.src);
				$1 = live(APC);
				$2 = live(A);
				$3 = rt.gv(f, "charge", rt.fv(f, "cell", live(APC)));
				$4 = rt.gv(f, "maxcharge", rt.fv(f, "cell", live(APC)));
				$5 = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.gv(f, "charge", rt.fv(f, "cell", live(APC))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(APC)))), 100)]));
				$6 = rt.fv(f, "area", live(APC));
				if ((truthy(rt.fv(f, "aidisabled", live(APC))) || truthy(rt.fv(f, "panel_open", live(APC))))) {
					$7 = "<font color='#FF0000'>APC does not respond to interface query.</font>";
				} else {
					$7 = "<font color='#00FF00'>APC responds to interface query.</font>";
				}
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;access_apc=＃'>＀</a><br><b>Charge:</b> ＀ / ＀ W (＀%)<br><b>Area:</b> ＀<br>＀<br><br>", [$0, $1, $2, $3, $4, $5, $6, $7]), add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;check_logs=1'>Check Logs</a><br>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;log_out=1'>Log Out</a><br>", [live(f.src)]), add);
			if (truthy(rt.sv(f, "emagged"))) {
				dat = rt.modify(live(dat), "<font color='#FF0000'>WARNING: Logging functionality partially disabled from outside source.</font><br>", add);
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;restore_logging=1'>Restore logging functionality?</a><br>", [live(f.src)]), add);
			}
		} else {
			if (truthy(rt.len(f, rt.sv(f, "logs")))) {
				entry = null;
				rt.forList(f, 0, rt.sv(f, "logs"));
				while (($e = rt.next(f, 0)) !== undefined) {
					entry = $e;
					dat = rt.modify(live(dat), fmt("＀<br>", [live(entry)]), add);
				}
				rt.endFor(f, 0);
			} else {
				dat = rt.modify(live(dat), "<i>No activity has been recorded at this time.</i><br>", add);
			}
			if (truthy(rt.sv(f, "emagged"))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;clear_logs=1'><font color='#FF0000'>@#%! CLEAR LOGS</a>", [live(f.src)]), add);
			}
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;check_apcs=1'>Return</a>", [live(f.src)]), add);
		}
		rt.setSv(f, "operator", live(user));
	} else {
		dat = fmt("<a href='?src=＃;authenticate=1'>Please swipe a valid ID to log in...</a>", [live(f.src)]);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "apc_control", rt.sv(f, "name"), 600, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/apc_control/proc/Topic  (code/game/machinery/computer/apc_control.dm:95)  may sleep
rt.def("/obj/machinery/computer/apc_control/proc/Topic", function* Topic(f: Frame) {
	let ID: Value = null, E: Value = null, APC: Value = null, new_filter: Value = null;
	f.vars = () => [ID, E, APC, new_filter];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((((!truthy(live(f.usr)) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) || truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) || truthy(rt.sv(f, "stat"))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "authenticate"))) {
		if (!truthy((rt.istype((ID = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			ID = (yield* g.callName(f, live(f.usr), "get_idcard", []));
		}
		if ((truthy(live(ID)) && truthy((rt.istype(live(ID), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			if (truthy((yield* g.srcCall(f, "check_access", live(ID))))) {
				rt.setSv(f, "authenticated", 1);
				rt.setSv(f, "auth_id", fmt("＀ (＀)", [rt.fv(f, "registered_name", live(ID)), rt.fv(f, "assignment", live(ID))]));
				yield* g.srcCall(f, "log_activity", "logged in");
			}
		}
		if (!truthy(rt.sv(f, "authenticated"))) {
			if (((truthy((E = (yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) && truthy((rt.istype(live(E), T("/obj/item/weapon/card/emag")) ? 1 : 0))) && truthy((yield* g.callName(f, live(f.usr), "Adjacent", [live(f.src)]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You bypass ＀'s access requirements using your emag.</span>", [live(f.src)])]);
				rt.setSv(f, "authenticated", 1);
				yield* g.srcCall(f, "log_activity", "logged in");
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "log_out"))) {
		yield* g.srcCall(f, "log_activity", "logged out");
		rt.setSv(f, "authenticated", 0);
		rt.setSv(f, "auth_id", "[NULL]");
	}
	if (truthy(rt.at(live(f.args[1]), "restore_logging"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='robot notice'>＀ Logging functionality restored from backup data.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		rt.setSv(f, "emagged", 0);
		if (!truthy(rt.sv(f, "logs"))) {
			rt.setSv(f, "logs", rt.list());
		}
		rt.modSrcVar(f, "logs", "<b>-=- Logging restored to full functionality at this point -=-</b>", add);
	}
	if (truthy(rt.at(live(f.args[1]), "access_apc"))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "terminal_type", 50, 0]);
		if ((((!truthy((APC = rt.locateIn(f, rt.at(live(f.args[1]), "access_apc"), rt.gl("apcs_list")))) || truthy(rt.fv(f, "aidisabled", live(APC)))) || truthy(rt.fv(f, "panel_open", live(APC)))) || (!truthy(live(APC)) || truthy(rt.fv(f, "gc_destroyed", live(APC)))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='robot danger'>＀ APC does not return interface request. Remote access may be disabled.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "active_apc"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='robot danger'>＀ Disconnected from ＀.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), rt.sv(f, "active_apc")])]);
			yield* g.callName(f, rt.sv(f, "active_apc"), "say", ["Remote access canceled. Interface locked."]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "active_apc"), rt.rsc("sound/machines/boltsdown.ogg"), 25, 0]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "active_apc"), rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0]);
			rt.setFv(f, "locked", rt.sv(f, "active_apc"), 1);
			yield* g.callName(f, rt.sv(f, "active_apc"), "update_icon", []);
			rt.setSv(f, "active_apc", null);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='robot notice'>＀ Connected to APC in ＀. Interface request sent.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), (yield* g.call(f, P("/proc/get_area"), null, [live(APC)]))])]);
		yield* g.srcCall(f, "log_activity", fmt("remotely accessed APC in ＀", [(yield* g.call(f, P("/proc/get_area"), null, [live(APC)]))]));
		yield* g.callName(f, live(APC), "interact", [live(f.usr), rt.gl("not_incapacitated_state")]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ remotely accessed ＀ from ＀ at ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(APC), live(f.src), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ remotely accessed ＀ from ＀ at ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(APC), live(f.src), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))])]);
		if (truthy(rt.fv(f, "locked", live(APC)))) {
			yield* g.callName(f, live(APC), "say", ["Remote access detected. Interface unlocked."]);
			yield* g.call(f, P("/proc/playsound"), null, [live(APC), rt.rsc("sound/machines/boltsup.ogg"), 25, 0]);
			yield* g.call(f, P("/proc/playsound"), null, [live(APC), rt.rsc("sound/machines/terminal_alert.ogg"), 50, 0]);
		}
		rt.setFv(f, "locked", live(APC), 0);
		yield* g.callName(f, live(APC), "update_icon", []);
		rt.setSv(f, "active_apc", live(APC));
	}
	if (truthy(rt.at(live(f.args[1]), "name_filter"))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0]);
		new_filter = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "What name are you looking for?", rt.sv(f, "name")]));
		if (((((!truthy(live(f.src)) || !truthy(live(f.usr))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) || truthy(rt.sv(f, "stat"))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "log_activity", fmt("changed name filter to \"＀\"", [live(new_filter)]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		rt.setAt(rt.sv(f, "filters"), "Name", live(new_filter));
	}
	if (truthy(rt.at(live(f.args[1]), "above_filter"))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0]);
		new_filter = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "name"), "Enter a percentage from 1-100 to sort by (greater than).", live(f.usr), null]));
		if (((((!truthy(live(f.src)) || !truthy(live(f.usr))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) || truthy(rt.sv(f, "stat"))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "log_activity", fmt("changed greater than charge filter to \"＀\"", [live(new_filter)]));
		if (truthy(live(new_filter))) {
			new_filter = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(new_filter), 100]))]));
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		rt.setAt(rt.sv(f, "filters"), "Charge Above", live(new_filter));
	}
	if (truthy(rt.at(live(f.args[1]), "below_filter"))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt.ogg"), 50, 0]);
		new_filter = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "name"), "Enter a percentage from 1-100 to sort by (lesser than).", live(f.usr), null]));
		if (((((!truthy(live(f.src)) || !truthy(live(f.usr))) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) || truthy(rt.sv(f, "stat"))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "log_activity", fmt("changed lesser than charge filter to \"＀\"", [live(new_filter)]));
		if (truthy(live(new_filter))) {
			new_filter = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(new_filter), 100]))]));
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
		rt.setAt(rt.sv(f, "filters"), "Charge Below", live(new_filter));
	}
	if (truthy(rt.at(live(f.args[1]), "access_filter"))) {
		if (rt.at(rt.sv(f, "filters"), "Responsive") === null) {
			rt.setAt(rt.sv(f, "filters"), "Responsive", 1);
			yield* g.srcCall(f, "log_activity", "sorted by non-responsive APCs only");
		} else {
			rt.setAt(rt.sv(f, "filters"), "Responsive", (!truthy(rt.at(rt.sv(f, "filters"), "Responsive")) ? 1 : 0));
			yield* g.srcCall(f, "log_activity", "sorted by all APCs");
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/terminal_prompt_confirm.ogg"), 50, 0]);
	}
	if (truthy(rt.at(live(f.args[1]), "check_logs"))) {
		rt.setSv(f, "checking_logs", 1);
		yield* g.srcCall(f, "log_activity", "checked logs");
	}
	if (truthy(rt.at(live(f.args[1]), "check_apcs"))) {
		rt.setSv(f, "checking_logs", 0);
		yield* g.srcCall(f, "log_activity", "checked APCs");
	}
	if (truthy(rt.at(live(f.args[1]), "clear_logs"))) {
		rt.setSv(f, "logs", rt.list());
	}
	yield* g.srcCall(f, "interact", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/apc_control/proc/emag_act  (code/game/machinery/computer/apc_control.dm:198)
rt.def("/obj/machinery/computer/apc_control/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>You emag ＀, disabling precise logging and allowing you to clear logs.</span>", [live(f.src)])]);
	rt.call(f, P("/proc/log_game"), null, [fmt("＀ emagged ＀ at ＀, disabling operator tracking.", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), live(f.src), rt.call(f, P("/proc/get_area"), null, [live(f.src)])])]);
	rt.call(f, P("/proc/playsound"), null, [live(f.src), "sparks", 50, 1]);
	rt.setSv(f, "emagged", 1);
	return f.dot;
});

// /obj/machinery/computer/apc_control/proc/log_activity  (code/game/machinery/computer/apc_control.dm:204)
rt.def("/obj/machinery/computer/apc_control/proc/log_activity", function log_activity(f: Frame, log_text: Value) {
	let op_string: Value = null;
	let $0: any;
	f.vars = () => [op_string, $0];
	if ((truthy(rt.sv(f, "operator")) && !truthy(rt.sv(f, "emagged")))) {
		$0 = rt.sv(f, "operator");
	} else {
		$0 = "[NULL OPERATOR]";
	}
	op_string = $0;
	if (!truthy(rt.sv(f, "logs"))) {
		rt.setSv(f, "logs", rt.list());
	}
	rt.modSrcVar(f, "logs", fmt("<b>(＀)</b> ＀ ＀", [rt.call(f, P("/proc/worldtime2text"), null, []), live(op_string), live(log_text)]), add);
	return f.dot;
});

// /mob/proc/using_power_flow_console  (code/game/machinery/computer/apc_control.dm:208)
rt.def("/mob/proc/using_power_flow_console", function using_power_flow_console(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [1, live(f.src)]), T("/obj/machinery/computer/apc_control"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (((truthy(rt.fv(f, "operator", live(A))) && isEqual(rt.fv(f, "operator", live(A)), live(f.src))) && !truthy(rt.fv(f, "stat", live(A))))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});
