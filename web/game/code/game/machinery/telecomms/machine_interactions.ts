// From code/game/machinery/telecomms/machine_interactions.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/telecomms/proc/attackby  (code/game/machinery/telecomms/machine_interactions.dm:13)  may sleep
rt.def("/obj/machinery/telecomms/proc/attackby", function* attackby(f: Frame) {
	let icon_closed: Value = null, icon_open: Value = null;
	f.vars = () => [icon_closed, icon_open];
	icon_closed = rt.initial(f, live(f.src), "icon_state");
	icon_open = fmt("＀_o", [rt.initial(f, live(f.src), "icon_state")]);
	if (!truthy(rt.sv(f, "on"))) {
		icon_closed = fmt("＀_off", [rt.initial(f, live(f.src), "icon_state")]);
		icon_open = fmt("＀_o_off", [rt.initial(f, live(f.src), "icon_state")]);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), live(icon_open), live(icon_closed), live(f.args[0]))))) {
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
				yield* g.srcCall(f, "attack_hand", live(f.args[1]));
			} else {
				if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
					return live(f.dot);
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/machinery/telecomms/proc/attack_ai  (code/game/machinery/telecomms/machine_interactions.dm:36)  may sleep
rt.def("/obj/machinery/telecomms/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/machinery/telecomms/proc/attack_hand  (code/game/machinery/telecomms/machine_interactions.dm:41)  may sleep
rt.def("/obj/machinery/telecomms/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _P: Value = null, dat: Value = null, i: Value = null, _T: Value = null, x: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, _P, dat, i, _T, x, $0, $1, $e];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		if (!truthy((rt.istype((yield* g.callName(f, live(user), "get_active_held_item", [])), T("/obj/item/device/multitool")) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	_P = (yield* g.srcCall(f, "get_multitool", live(user)));
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	dat = fmt("<font face = \"Courier\"><HEAD><TITLE>＀</TITLE></HEAD><center><H3>＀ Access</H3></center>", [rt.sv(f, "name"), rt.sv(f, "name")]);
	dat = rt.modify(live(dat), fmt("<br>＀<br>", [rt.sv(f, "temp")]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "toggled"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = rt.modify(live(dat), fmt("<br>Power Status: <a href='?src=＃;input=toggle'>＀</a>", [$0, $1]), add);
	if ((truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "toggled")))) {
		if ((!isEqual(rt.sv(f, "id"), "") && truthy(rt.sv(f, "id")))) {
			dat = rt.modify(live(dat), fmt("<br>Identification String: <a href='?src=＃;input=id'>＀</a>", [live(f.src), rt.sv(f, "id")]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<br>Identification String: <a href='?src=＃;input=id'>NULL</a>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<br>Network: <a href='?src=＃;input=network'>＀</a>", [live(f.src), rt.sv(f, "network")]), add);
		if (truthy(rt.len(f, rt.sv(f, "autolinkers")))) {
			$0 = "TRUE";
		} else {
			$0 = "FALSE";
		}
		dat = rt.modify(live(dat), fmt("<br>Prefabrication: ＀", [$0]), add);
		if (truthy(rt.sv(f, "hide"))) {
			dat = rt.modify(live(dat), "<br>Shadow Link: ACTIVE</a>", add);
		}
		dat = rt.modify(live(dat), (yield* g.srcCall(f, "Options_Menu")), add);
		dat = rt.modify(live(dat), "<br>Linked Network Entities: <ol>", add);
		i = 0;
		_T = null;
		rt.forList(f, 0, rt.sv(f, "links"), T("/obj/machinery/telecomms"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			i = rt.inc(live(i), 1);
			if ((truthy(rt.fv(f, "hide", live(_T))) && !truthy(rt.sv(f, "hide")))) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("<li>＃ ＀ (＀)  <a href='?src=＃;unlink=＀'>[X]</a></li>", [live(_T), rt.fv(f, "name", live(_T)), rt.fv(f, "id", live(_T)), live(f.src), live(i)]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</ol>", add);
		dat = rt.modify(live(dat), "<br>Filtering Frequencies: ", add);
		i = 0;
		if (truthy(rt.length(rt.sv(f, "freq_listening")))) {
			x = null;
			rt.forList(f, 0, rt.sv(f, "freq_listening"));
			while (($e = rt.next(f, 0)) !== undefined) {
				x = $e;
				i = rt.inc(live(i), 1);
				if (rt.lt(live(i), rt.length(rt.sv(f, "freq_listening")))) {
					dat = rt.modify(live(dat), fmt("＀ GHz<a href='?src=＃;delete=＀'>[X]</a>; ", [(yield* g.call(f, P("/proc/format_frequency"), null, [live(x)])), live(f.src), live(x)]), add);
				} else {
					dat = rt.modify(live(dat), fmt("＀ GHz<a href='?src=＃;delete=＀'>[X]</a>", [(yield* g.call(f, P("/proc/format_frequency"), null, [live(x)])), live(f.src), live(x)]), add);
				}
			}
			rt.endFor(f, 0);
		} else {
			dat = rt.modify(live(dat), "NONE", add);
		}
		dat = rt.modify(live(dat), fmt("<br>  <a href='?src=＃;input=freq'>[Add Filter]</a>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<hr>", add);
		if (truthy(live(_P))) {
			if (truthy((rt.istype((_T = rt.fv(f, "buffer", live(_P))), T("/obj/machinery/telecomms")) ? 1 : 0))) {
				dat = rt.modify(live(dat), fmt("<br><br>MULTITOOL BUFFER: ＀ (＀) <a href='?src=＃;link=1'>[Link]</a> <a href='?src=＃;flush=1'>[Flush]", [live(_T), rt.fv(f, "id", live(_T)), live(f.src), live(f.src)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("<br><br>MULTITOOL BUFFER: <a href='?src=＃;buffer=1'>[Add Machine]</a>", [live(f.src)]), add);
			}
		}
	}
	dat = rt.modify(live(dat), "</font>", add);
	rt.setSv(f, "temp", "");
	rt.op(f, "Browse", [], [live(user), live(dat), "window=tcommachine;size=520x500;can_resize=0"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "dormitory"]);
	return f.dot;
}, true);

// /obj/machinery/telecomms/relay/proc/toggle_level  (code/game/machinery/telecomms/machine_interactions.dm:114)
rt.def("/obj/machinery/telecomms/relay/proc/toggle_level", function toggle_level(f: Frame) {
	let position: Value = null;
	f.vars = () => [position];
	position = rt.getStep(f, live(f.src), 0);
	if (isEqual(rt.sv(f, "listening_level"), 2)) {
		rt.setSv(f, "listening_level", rt.fv(f, "z", live(position)));
		return 1;
	}
	return 0;
});

// /obj/machinery/telecomms/proc/get_multitool  (code/game/machinery/telecomms/machine_interactions.dm:128)
rt.def("/obj/machinery/telecomms/proc/get_multitool", function get_multitool(f: Frame, user: Value) {
	let _P: Value = null, U: Value = null;
	f.vars = () => [_P, U];
	_P = null;
	if ((!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) && truthy((rt.istype(rt.callName(f, live(user), "get_active_held_item", []), T("/obj/item/device/multitool")) ? 1 : 0)))) {
		_P = rt.callName(f, live(user), "get_active_held_item", []);
	} else {
		if (truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			_P = rt.gv(f, "aiMulti", (U = live(user)));
		} else {
			if ((truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)) && rt.le(rt.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)]), 1))) {
				if (truthy((rt.istype(rt.callName(f, live(user), "get_active_held_item", []), T("/obj/item/device/multitool")) ? 1 : 0))) {
					_P = rt.callName(f, live(user), "get_active_held_item", []);
				}
			}
		}
	}
	return live(_P);
});

// /obj/machinery/telecomms/proc/Options_Menu  (code/game/machinery/telecomms/machine_interactions.dm:142)
rt.def("/obj/machinery/telecomms/proc/Options_Menu", function Options_Menu(f: Frame) {
	return "";
});

// /obj/machinery/telecomms/relay/proc/Options_Menu  (code/game/machinery/telecomms/machine_interactions.dm:152)
rt.def("/obj/machinery/telecomms/relay/proc/Options_Menu", function Options_Menu(f: Frame) {
	let dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dat, $0, $1];
	dat = "";
	$0 = live(f.src);
	if (truthy(rt.sv(f, "broadcasting"))) {
		$1 = "YES";
	} else {
		$1 = "NO";
	}
	dat = rt.modify(live(dat), fmt("<br>Broadcasting: <A href='?src=＃;broadcast=1'>＀</a>", [$0, $1]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "receiving"))) {
		$1 = "YES";
	} else {
		$1 = "NO";
	}
	return (dat = rt.modify(live(dat), fmt("<br>Receiving:    <A href='?src=＃;receive=1'>＀</a>", [$0, $1]), add));
});

// /obj/machinery/telecomms/relay/proc/Options_Topic  (code/game/machinery/telecomms/machine_interactions.dm:159)
rt.def("/obj/machinery/telecomms/relay/proc/Options_Topic", function Options_Topic(f: Frame, href: Value, href_list: Value) {
	if (truthy(rt.at(live(href_list), "receive"))) {
		rt.setSv(f, "receiving", (!truthy(rt.sv(f, "receiving")) ? 1 : 0));
		rt.setSv(f, "temp", "<font color = #666633>-% Receiving mode changed. %-</font color>");
	}
	if (!truthy(rt.at(live(href_list), "broadcast"))) return f.dot;
	rt.setSv(f, "broadcasting", (!truthy(rt.sv(f, "broadcasting")) ? 1 : 0));
	rt.setSv(f, "temp", "<font color = #666633>-% Broadcasting mode changed. %-</font color>");
	return f.dot;
});

rt.type(10714, "/obj/machinery/telecomms/bus", "/obj/machinery/telecomms", {
	change_frequency: 0,
	anchored: 1,
	name: "bus mainframe",
	icon_state: "bus",
	desc: "A mighty piece of hardware used to send massive amounts of data quickly.",
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	machinetype: 2,
	netspeed: 40,
});

// /obj/machinery/telecomms/bus/proc/Options_Menu  (code/game/machinery/telecomms/machine_interactions.dm:169)
rt.def("/obj/machinery/telecomms/bus/proc/Options_Menu", function Options_Menu(f: Frame) {
	let dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dat, $0, $1];
	$0 = live(f.src);
	if (truthy(rt.sv(f, "change_frequency"))) {
		$1 = fmt("YES (＀)", [rt.sv(f, "change_frequency")]);
	} else {
		$1 = "NO";
	}
	return (dat = fmt("<br>Change Signal Frequency: <A href='?src=＃;change_freq=1'>＀</a>", [$0, $1]));
});

// /obj/machinery/telecomms/bus/proc/Options_Topic  (code/game/machinery/telecomms/machine_interactions.dm:174)  may sleep
rt.def("/obj/machinery/telecomms/bus/proc/Options_Topic", function* Options_Topic(f: Frame, href: Value, href_list: Value) {
	let newfreq: Value = null;
	f.vars = () => [href, href_list, newfreq];
	if (!truthy(rt.at(live(href_list), "change_freq"))) return f.dot;
	newfreq = (yield* g.op(f, "Prompt", [33], [rt.sv(f, "network"), live(f.src), "Specify a new frequency for new signals to change to. Enter null to turn off frequency changing. Decimals assigned automatically.", live(f.usr), null]));
	if (!truthy((yield* g.srcCall(f, "canAccess", live(f.usr))))) return f.dot;
	if (truthy(live(newfreq))) {
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.call(f, P("/proc/num2text"), null, [live(newfreq)])), "."])))) {
			(newfreq = rt.modify(live(newfreq), 10, multiply));
		}
		if (rt.lt(live(newfreq), 10000)) {
			rt.setSv(f, "change_frequency", live(newfreq));
			rt.setSv(f, "temp", fmt("<font color = #666633>-% New frequency to change to assigned: \"＀ GHz\" %-</font color>", [live(newfreq)]));
		}
	} else {
		rt.setSv(f, "change_frequency", 0);
		rt.setSv(f, "temp", "<font color = #666633>-% Frequency changing deactivated %-</font color>");
	}
	return f.dot;
}, true);

// /obj/machinery/telecomms/proc/Topic  (code/game/machinery/telecomms/machine_interactions.dm:190)  may sleep
rt.def("/obj/machinery/telecomms/proc/Topic", function* Topic(f: Frame) {
	let _P: Value = null, newid: Value = null, newnet: Value = null, _T: Value = null, newfreq: Value = null, x: Value = null, _T_1: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [_P, newid, newnet, _T, newfreq, x, _T_1, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		if (!truthy((rt.istype((yield* g.callName(f, live(f.usr), "get_active_held_item", [])), T("/obj/item/device/multitool")) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	_P = (yield* g.srcCall(f, "get_multitool", live(f.usr)));
	if (truthy(rt.at(live(f.args[1]), "input"))) {
		$0 = rt.at(live(f.args[1]), "input");
		if ($0 === "toggle") {
			rt.setSv(f, "toggled", (!truthy(rt.sv(f, "toggled")) ? 1 : 0));
			$0 = live(f.src);
			if (truthy(rt.sv(f, "toggled"))) {
				$1 = "activated";
			} else {
				$1 = "deactivated";
			}
			rt.setSv(f, "temp", fmt("<font color = #666633>-% ＀ has been ＀.</font color>", [$0, $1]));
			yield* g.srcCall(f, "update_power");
		} else if ($0 === "id") {
			if ((truthy((newid = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [3], [rt.sv(f, "id"), live(f.src), "Specify the new ID for this machine", live(f.usr), null]))])), 1, 1024])))) && truthy((yield* g.srcCall(f, "canAccess", live(f.usr)))))) {
				rt.setSv(f, "id", live(newid));
				rt.setSv(f, "temp", fmt("<font color = #666633>-% New ID assigned: \"＀\" %-</font color>", [rt.sv(f, "id")]));
			}
		} else if ($0 === "network") {
			if ((truthy((newnet = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Specify the new network for this machine. This will break all current links.", live(f.src), rt.sv(f, "network")])))) && truthy((yield* g.srcCall(f, "canAccess", live(f.usr)))))) {
				if (rt.gt(rt.length(live(newnet)), 15)) {
					rt.setSv(f, "temp", "<font color = #666633>-% Too many characters in new network tag %-</font color>");
				} else {
					_T = null;
					rt.forList(f, 0, rt.sv(f, "links"), T("/obj/machinery/telecomms"));
					while (($e = rt.next(f, 0)) !== undefined) {
						_T = $e;
						yield* g.callName(f, rt.fv(f, "links", live(_T)), "Remove", [live(f.src)]);
					}
					rt.endFor(f, 0);
					rt.setSv(f, "network", live(newnet));
					rt.setSv(f, "links", rt.list());
					rt.setSv(f, "temp", fmt("<font color = #666633>-% New network tag assigned: \"＀\" %-</font color>", [rt.sv(f, "network")]));
				}
			}
		} else if ($0 === "freq") {
			if ((truthy((newfreq = (yield* g.op(f, "Prompt", [33], [rt.sv(f, "network"), live(f.src), "Specify a new frequency to filter (GHz). Decimals assigned automatically.", live(f.usr), null])))) && truthy((yield* g.srcCall(f, "canAccess", live(f.usr)))))) {
				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.call(f, P("/proc/num2text"), null, [live(newfreq)])), "."])))) {
					(newfreq = rt.modify(live(newfreq), 10, multiply));
				}
				if (isEqual(live(newfreq), 1213)) {
					rt.setSv(f, "temp", fmt("<font color = #FF0000>-% Error: Interference preventing filtering frequency: \"＀ GHz\" %-</font color>", [live(newfreq)]));
				} else {
					if ((!truthy((rt.isIn(f, live(newfreq), rt.sv(f, "freq_listening")) ? 1 : 0)) && rt.lt(live(newfreq), 10000))) {
						yield* g.callName(f, rt.sv(f, "freq_listening"), "Add", [live(newfreq)]);
						rt.setSv(f, "temp", fmt("<font color = #666633>-% New frequency filter assigned: \"＀ GHz\" %-</font color>", [live(newfreq)]));
					}
				}
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "delete"))) {
		rt.setSv(f, "temp", fmt("<font color = #666633>-% Removed frequency filter ＀ %-</font color>", [(x = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "delete")])))]));
		yield* g.callName(f, rt.sv(f, "freq_listening"), "Remove", [live(x)]);
	}
	if (truthy(rt.at(live(f.args[1]), "unlink"))) {
		if (rt.le((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "unlink")])), rt.length(rt.sv(f, "links")))) {
			if (truthy((_T_1 = rt.index(rt.sv(f, "links"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "unlink")])))))) {
				rt.setSv(f, "temp", fmt("<font color = #666633>-% Removed ＃ ＀ from linked entities. %-</font color>", [live(_T_1), rt.fv(f, "name", live(_T_1))]));
				if (truthy(rt.fv(f, "links", live(_T_1)))) {
					yield* g.callName(f, rt.fv(f, "links", live(_T_1)), "Remove", [live(f.src)]);
				}
				yield* g.callName(f, rt.sv(f, "links"), "Remove", [live(_T_1)]);
			} else {
				rt.setSv(f, "temp", "<font color = #666633>-% Unable to locate machine to unlink from, try again. %-</font color>");
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "link"))) {
		if (truthy(live(_P))) {
			if ((truthy((rt.istype((_T_1 = rt.fv(f, "buffer", live(_P))), T("/obj/machinery/telecomms")) ? 1 : 0)) && !isEqual(live(_T_1), live(f.src)))) {
				if (!truthy((rt.isIn(f, live(f.src), rt.fv(f, "links", live(_T_1))) ? 1 : 0))) {
					rt.modField(f, live(_T_1), "links", live(f.src), add);
				}
				if (!truthy((rt.isIn(f, live(_T_1), rt.sv(f, "links")) ? 1 : 0))) {
					rt.modSrcVar(f, "links", live(_T_1), add);
				}
				rt.setSv(f, "temp", fmt("<font color = #666633>-% Successfully linked with ＃ ＀ %-</font color>", [live(_T_1), rt.fv(f, "name", live(_T_1))]));
			} else {
				rt.setSv(f, "temp", "<font color = #666633>-% Unable to acquire buffer %-</font color>");
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "buffer"))) {
		rt.setFv(f, "buffer", live(_P), live(f.src));
		rt.setSv(f, "temp", fmt("<font color = #666633>-% Successfully stored ＃ ＀ in buffer %-</font color>", [rt.fv(f, "buffer", live(_P)), rt.gv(f, "name", rt.fv(f, "buffer", live(_P)))]));
	}
	if (truthy(rt.at(live(f.args[1]), "flush"))) {
		rt.setSv(f, "temp", "<font color = #666633>-% Buffer successfully flushed. %-</font color>");
		rt.setFv(f, "buffer", live(_P), null);
	}
	yield* g.srcCall(f, "Options_Topic", live(f.args[0]), live(f.args[1]));
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/telecomms/proc/canAccess  (code/game/machinery/telecomms/machine_interactions.dm:301)
rt.def("/obj/machinery/telecomms/proc/canAccess", function canAccess(f: Frame, user: Value) {
	if ((truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)) || rt.le(rt.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)]), 1))) {
		return 1;
	}
	return 0;
});
