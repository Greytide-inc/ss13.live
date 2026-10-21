// From code/game/machinery/computer/telecrystalconsoles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalpossible_uplinker_IDs  (code/game/machinery/computer/telecrystalconsoles.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_uplinker_IDs", function InitGlobalpossible_uplinker_IDs(f: Frame) {
	rt.setGl("possible_uplinker_IDs", rt.list("Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Zero", "Niner"));
	rt.modSrcVar(f, "gvars_datum_init_order", "possible_uplinker_IDs", add);
	return f.dot;
});

rt.type(10412, "/obj/machinery/computer/telecrystals/uplinker", "/obj/machinery/computer/telecrystals", {
	uplinkholder: null,
	linkedboss: null,
	name: "１Telecrystal upload/receive station",
	desc: "A device used to manage telecrystals during group operations. To use, simply insert your uplink. With your uplink installed you can upload your telecrystals to the group's pool using the console, or be assigned additional telecrystals by your lieutenant.",
});

// /obj/machinery/computer/telecrystals/uplinker/proc/Initialize  (code/game/machinery/computer/telecrystalconsoles.dm:25)  may sleep
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/Initialize", function* Initialize(f: Frame) {
	let ID: Value = null;
	f.vars = () => [ID];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((ID = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.gl("possible_uplinker_IDs")]))))) {
		ID = (yield* g.call(f, P("/proc/rand"), null, [1, 999]));
	}
	rt.setSv(f, "name", fmt("＀ ＀", [rt.sv(f, "name"), live(ID)]));
	return f.dot;
}, true);

// /obj/machinery/computer/telecrystals/uplinker/proc/attackby  (code/game/machinery/computer/telecrystalconsoles.dm:34)  may sleep
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let I: Value = null;
	f.vars = () => [O, user, params, I];
	if (truthy(rt.sv(f, "uplinkholder"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ already has an uplink in it.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "hidden_uplink", live(O)))) {
		I = (yield* g.callName(f, live(user), "get_active_held_item", []));
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setSv(f, "uplinkholder", live(I));
		rt.setFv(f, "loc", live(I), live(f.src));
		yield* g.callName(f, live(I), "add_fingerprint", [live(user)]);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ doesn't appear to be an uplink...</span>", [live(O)])]);
	}
	return f.dot;
}, true);

// /obj/machinery/computer/telecrystals/uplinker/proc/update_icon  (code/game/machinery/computer/telecrystalconsoles.dm:49)
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "uplinkholder"))) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("＀-closed", [rt.initial(f, live(f.src), "icon_state")])]);
	return f.dot;
});

// /obj/machinery/computer/telecrystals/uplinker/proc/ejectuplink  (code/game/machinery/computer/telecrystalconsoles.dm:55)
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/ejectuplink", function ejectuplink(f: Frame) {
	if (!truthy(rt.sv(f, "uplinkholder"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "uplinkholder"), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
	rt.setSv(f, "uplinkholder", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/computer/telecrystals/uplinker/proc/donateTC  (code/game/machinery/computer/telecrystalconsoles.dm:60)
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/donateTC", function donateTC(f: Frame, amt: Value, addLog: Value) {
	f.vars = () => [addLog];
	if (live(addLog) === null) {
		addLog = 1;
	}
	if (!(truthy(rt.sv(f, "uplinkholder")) && truthy(rt.sv(f, "linkedboss")))) return f.dot;
	if (rt.lt(live(amt), 0)) {
		rt.modField(f, rt.sv(f, "linkedboss"), "storedcrystals", rt.gv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder"))), add);
		if (truthy(live(addLog))) {
			rt.callName(f, rt.sv(f, "linkedboss"), "logTransfer", [fmt("＀ donated ＀ telecrystals to ＀.", [live(f.src), rt.gv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder"))), rt.sv(f, "linkedboss")])]);
		}
		rt.setFv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder")), 0);
	} else {
		if (!rt.le(live(amt), rt.gv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder"))))) return f.dot;
		(rt.modField(f, rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder")), "telecrystals", live(amt), subtract));
		rt.modField(f, rt.sv(f, "linkedboss"), "storedcrystals", live(amt), add);
		if (!truthy(live(addLog))) return f.dot;
		rt.callName(f, rt.sv(f, "linkedboss"), "logTransfer", [fmt("＀ donated ＀ telecrystals to ＀.", [live(f.src), live(amt), rt.sv(f, "linkedboss")])]);
	}
	return f.dot;
});

// /obj/machinery/computer/telecrystals/uplinker/proc/giveTC  (code/game/machinery/computer/telecrystalconsoles.dm:73)
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/giveTC", function giveTC(f: Frame, amt: Value, addLog: Value) {
	f.vars = () => [addLog];
	if (live(addLog) === null) {
		addLog = 1;
	}
	if (!(truthy(rt.sv(f, "uplinkholder")) && truthy(rt.sv(f, "linkedboss")))) return f.dot;
	if (rt.lt(live(amt), 0)) {
		rt.modField(f, rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder")), "telecrystals", rt.fv(f, "storedcrystals", rt.sv(f, "linkedboss")), add);
		if (truthy(live(addLog))) {
			rt.callName(f, rt.sv(f, "linkedboss"), "logTransfer", [fmt("＀ received ＀ telecrystals from ＀.", [live(f.src), rt.fv(f, "storedcrystals", rt.sv(f, "linkedboss")), rt.sv(f, "linkedboss")])]);
		}
		rt.setFv(f, "storedcrystals", rt.sv(f, "linkedboss"), 0);
	} else {
		if (!rt.le(live(amt), rt.fv(f, "storedcrystals", rt.sv(f, "linkedboss")))) return f.dot;
		rt.modField(f, rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder")), "telecrystals", live(amt), add);
		(rt.modField(f, rt.sv(f, "linkedboss"), "storedcrystals", live(amt), subtract));
		if (!truthy(live(addLog))) return f.dot;
		rt.callName(f, rt.sv(f, "linkedboss"), "logTransfer", [fmt("＀ received ＀ telecrystals from ＀.", [live(f.src), live(amt), rt.sv(f, "linkedboss")])]);
	}
	return f.dot;
});

// /obj/machinery/computer/telecrystals/uplinker/proc/attack_hand  (code/game/machinery/computer/telecrystalconsoles.dm:88)  may sleep
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [dat, popup];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[0])]);
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "";
	if (truthy(rt.sv(f, "linkedboss"))) {
		dat = rt.modify(live(dat), fmt("＀ has ＀ telecrystals available for distribution. <BR><BR>", [rt.sv(f, "linkedboss"), rt.fv(f, "storedcrystals", rt.sv(f, "linkedboss"))]), add);
	} else {
		dat = rt.modify(live(dat), "No linked management consoles detected. Scan for uplink stations using the management console.<BR><BR>", add);
	}
	if (truthy(rt.sv(f, "uplinkholder"))) {
		dat = rt.modify(live(dat), fmt("＀ telecrystals remain in this uplink.<BR>", [rt.gv(f, "telecrystals", rt.fv(f, "hidden_uplink", rt.sv(f, "uplinkholder")))]), add);
		if (truthy(rt.sv(f, "linkedboss"))) {
			dat = rt.modify(live(dat), fmt("Donate TC: <a href='byond://?src=＃;donate=1'>1</a> | <a href='byond://?src=＃;donate=5'>5</a> | <a href='byond://?src=＃;donate=-1'>All</a>", [live(f.src), live(f.src), live(f.src)]), add);
		}
		dat = rt.modify(live(dat), fmt("<br><a href='byond://?src=＃;eject=1'>Eject Uplink</a>", [live(f.src)]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", "Telecrystal Upload/Receive Station", 700, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/telecrystals/uplinker/proc/Topic  (code/game/machinery/computer/telecrystalconsoles.dm:113)  may sleep
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/Topic", function* Topic(f: Frame) {
	let tcamt: Value = null;
	f.vars = () => [tcamt];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "donate"))) {
		yield* g.srcCall(f, "donateTC", (tcamt = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "donate")]))));
	}
	if (truthy(rt.at(live(f.args[1]), "eject"))) {
		yield* g.srcCall(f, "ejectuplink");
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(10413, "/obj/machinery/computer/telecrystals/boss", "/obj/machinery/computer/telecrystals", {
	virgin: 1,
	scanrange: 10,
	storedcrystals: 0,
	TCstations: null,
	transferlog: null,
	icon_screen: "tcboss",
	icon_keyboard: "syndie_key",
	name: "team Telecrystal management console",
	desc: "A device used to manage telecrystals during group operations. To use, simply initialize the machine by scanning for nearby uplink stations. Once the consoles are linked up, you can assign any telecrystals amongst your operatives; be they donated by your agents or rationed to the squad based on the danger rating of the mission.",
	icon_state: "computer",
});

// /obj/machinery/computer/telecrystals/boss/proc/<init>  (code/game/machinery/computer/telecrystalconsoles.dm:138)
rt.def("/obj/machinery/computer/telecrystals/boss/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "TCstations", rt.list());
	$0 = $0;
	rt.setSv(f, "transferlog", rt.list());
	return f.dot;
});

// /obj/machinery/computer/telecrystals/boss/proc/logTransfer  (code/game/machinery/computer/telecrystalconsoles.dm:142)
rt.def("/obj/machinery/computer/telecrystals/boss/proc/logTransfer", function logTransfer(f: Frame, logmessage: Value) {
	rt.modSrcVar(f, "transferlog", fmt("<b>＀</b> ＀", [rt.call(f, P("/proc/worldtime2text"), null, []), live(logmessage)]), add);
	return f.dot;
});

// /obj/machinery/computer/telecrystals/boss/proc/scanUplinkers  (code/game/machinery/computer/telecrystalconsoles.dm:145)
rt.def("/obj/machinery/computer/telecrystals/boss/proc/scanUplinkers", function scanUplinkers(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.call(f, P("/proc/urange"), null, [rt.sv(f, "scanrange"), rt.fv(f, "loc", live(f.src))]), T("/obj/machinery/computer/telecrystals/uplinker"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy(rt.fv(f, "linkedboss", live(A)))) {
			rt.modSrcVar(f, "TCstations", live(A), add);
			rt.setFv(f, "linkedboss", live(A), live(f.src));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "virgin"))) return f.dot;
	rt.callSrc(f, "getDangerous", []);
	rt.setSv(f, "virgin", 0);
	return f.dot;
});

// /obj/machinery/computer/telecrystals/boss/proc/getDangerous  (code/game/machinery/computer/telecrystalconsoles.dm:154)
rt.def("/obj/machinery/computer/telecrystals/boss/proc/getDangerous", function getDangerous(f: Frame) {
	let danger: Value = null;
	f.vars = () => [danger];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "scaleTC", [(danger = rt.call(f, P("/proc/Ceiling"), null, [(danger = subtract(rt.len(f, rt.gl("joined_player_list")), rt.getLen(f, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))))), 10]))]);
	return f.dot;
});

// /obj/machinery/computer/telecrystals/boss/proc/scaleTC  (code/game/machinery/computer/telecrystalconsoles.dm:160)
rt.def("/obj/machinery/computer/telecrystals/boss/proc/scaleTC", function scaleTC(f: Frame, amt: Value) {
	rt.modSrcVar(f, "storedcrystals", multiply(live(amt), 1), add);
	return f.dot;
});

// /obj/machinery/computer/telecrystals/boss/proc/attack_hand  (code/game/machinery/computer/telecrystalconsoles.dm:165)  may sleep
rt.def("/obj/machinery/computer/telecrystals/boss/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, A: Value = null, entry: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [dat, A, entry, popup, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[0])]);
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "";
	dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;scan=1'>Scan for TC stations.</a><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("＀ telecrystals are available for distribution. <BR>", [rt.sv(f, "storedcrystals")]), add);
	dat = rt.modify(live(dat), "<BR><BR>", add);
	A = null;
	rt.forList(f, 0, rt.sv(f, "TCstations"), T("/obj/machinery/computer/telecrystals/uplinker"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		dat = rt.modify(live(dat), fmt("＀ | ", [rt.fv(f, "name", live(A))]), add);
		if (truthy(rt.fv(f, "uplinkholder", live(A)))) {
			dat = rt.modify(live(dat), fmt("＀ telecrystals.", [rt.gv(f, "telecrystals", rt.gv(f, "hidden_uplink", rt.fv(f, "uplinkholder", live(A))))]), add);
		}
		if (truthy(rt.sv(f, "storedcrystals"))) {
			dat = rt.modify(live(dat), fmt("<BR>Add TC: <a href ='?src=＃;target=＃;give=1'>1</a> | <a href ='?src=＃;target=＃;give=5'>5</a> | <a href ='?src=＃;target=＃;give=10'>10</a> | <a href ='?src=＃;target=＃;give=-1'>All</a>", [live(f.src), live(A), live(f.src), live(A), live(f.src), live(A), live(f.src), live(A)]), add);
		}
		dat = rt.modify(live(dat), "<BR>", add);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.len(f, rt.sv(f, "TCstations"))) && truthy(rt.sv(f, "storedcrystals")))) {
		dat = rt.modify(live(dat), fmt("<BR><BR><a href='byond://?src=＃;distrib=1'>Evenly distribute remaining TC.</a><BR><BR>", [live(f.src)]), add);
	}
	entry = null;
	rt.forList(f, 0, rt.sv(f, "transferlog"));
	while (($e = rt.next(f, 0)) !== undefined) {
		entry = $e;
		dat = rt.modify(live(dat), fmt("<small>＀</small><BR>", [live(entry)]), add);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", "Team Telecrystal Management Console", 700, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/telecrystals/boss/proc/Topic  (code/game/machinery/computer/telecrystalconsoles.dm:200)  may sleep
rt.def("/obj/machinery/computer/telecrystals/boss/proc/Topic", function* Topic(f: Frame) {
	let tcamt: Value = null, A: Value = null, sanity: Value = null;
	let $e: any;
	f.vars = () => [tcamt, A, sanity, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "scan"))) {
		yield* g.srcCall(f, "scanUplinkers");
	}
	if (truthy(rt.at(live(f.args[1]), "give"))) {
		tcamt = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "give")]));
		if (truthy(rt.len(f, rt.sv(f, "TCstations")))) {
			yield* g.callName(f, (A = rt.locateIn(f, rt.at(live(f.args[1]), "target"), rt.sv(f, "TCstations"))), "giveTC", [live(tcamt)]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "distrib"))) {
		sanity = 0;
		while (truthy(rt.sv(f, "storedcrystals")) && rt.lt(live(sanity), 100)) {
			A = null;
			rt.forList(f, 0, rt.sv(f, "TCstations"), T("/obj/machinery/computer/telecrystals/uplinker"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				yield* g.callName(f, live(A), "giveTC", [1, 0]);
			}
			rt.endFor(f, 0);
			sanity = rt.inc(live(sanity), 1);
		}
		yield* g.srcCall(f, "logTransfer", fmt("＀ evenly distributed telecrystals.", [live(f.src)]));
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });
