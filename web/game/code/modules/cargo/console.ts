// From code/modules/cargo/console.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10419, "/obj/machinery/computer/cargo", "/obj/machinery/computer", {
	requestonly: 0,
	contraband: 0,
	safety_warning: "For safety reasons the automated supply shuttle cannot transport live organisms, classified nuclear weaponry or homing beacons.",
	icon_screen: "supply",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/cargo"),
	light_color: "#E2853D",
	name: "supply console",
	desc: "Used to order supplies, approve requests, and control the shuttle.",
});

// /obj/machinery/computer/cargo/proc/New  (code/modules/cargo/console.dm:22)  may sleep
rt.def("/obj/machinery/computer/cargo/proc/New", function* New(f: Frame) {
	let board: Value = null;
	f.vars = () => [board];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "contraband", rt.gv(f, "contraband", (board = rt.sv(f, "circuit"))));
	rt.setSv(f, "emagged", rt.fv(f, "emagged", live(board)));
	return f.dot;
}, true);

// /obj/machinery/computer/cargo/proc/emag_act  (code/modules/cargo/console.dm:28)
rt.def("/obj/machinery/computer/cargo/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let board: Value = null;
	f.vars = () => [board];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ swipes a suspicious card through ＀!", [live(user), live(f.src)]), fmt("<span class='notice'>You adjust ＀'s routing and receiver spectrum, unlocking special supplies and contraband.</span>", [live(f.src)])]);
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "contraband", 1);
	rt.setFv(f, "contraband", (board = rt.sv(f, "circuit")), 1);
	rt.setFv(f, "emagged", live(board), 1);
	return f.dot;
});

// /obj/machinery/computer/cargo/proc/ui_interact  (code/modules/cargo/console.dm:42)  may sleep
rt.def("/obj/machinery/computer/cargo/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "cargo", rt.sv(f, "name"), 1000, 800, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/cargo/proc/ui_data  (code/modules/cargo/console.dm:48)
rt.def("/obj/machinery/computer/cargo/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, pack: Value = null, _P: Value = null, SO: Value = null;
	let $e: any;
	f.vars = () => [data, pack, _P, SO, $e];
	rt.setAt((data = rt.list()), "requestonly", rt.sv(f, "requestonly"));
	rt.setAt(live(data), "location", rt.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "getStatusText", []));
	rt.setAt(live(data), "points", rt.fv(f, "points", rt.gl("SSshuttle")));
	rt.setAt(live(data), "away", (isEqual(rt.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "getDockedId", []), "supply_away") ? 1 : 0));
	rt.setAt(live(data), "docked", (isEqual(rt.gv(f, "mode", rt.fv(f, "supply", rt.gl("SSshuttle"))), "idle") ? 1 : 0));
	rt.setAt(live(data), "loan", (truthy(rt.fv(f, "shuttle_loan", rt.gl("SSshuttle"))) ? 1 : 0));
	rt.setAt(live(data), "loan_dispatched", (rt.fv(f, "shuttle_loan", rt.gl("SSshuttle")) && rt.gv(f, "dispatched", rt.fv(f, "shuttle_loan", rt.gl("SSshuttle")))));
	rt.setAt(live(data), "message", (rt.fv(f, "centcom_message", rt.gl("SSshuttle")) || "Remember to stamp and send back the supply manifests."));
	rt.setAt(live(data), "supplies", rt.list());
	pack = null;
	rt.forList(f, 0, rt.fv(f, "supply_packs", rt.gl("SSshuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		pack = $e;
		_P = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), live(pack));
		if (!truthy(rt.index(rt.at(live(data), "supplies"), rt.fv(f, "group", live(_P))))) {
			rt.setAt(rt.at(live(data), "supplies"), rt.fv(f, "group", live(_P)), rt.alist(f, ["name", rt.fv(f, "group", live(_P)), "packs", rt.list()]));
		}
		if ((((truthy(rt.fv(f, "hidden", live(_P))) && !truthy(rt.sv(f, "emagged"))) || (truthy(rt.fv(f, "contraband", live(_P))) && !truthy(rt.sv(f, "contraband")))) || (truthy(rt.fv(f, "special", live(_P))) && !truthy(rt.fv(f, "special_enabled", live(_P)))))) {
			continue;
		}
		rt.modAt(rt.index(rt.at(live(data), "supplies"), rt.fv(f, "group", live(_P))), "packs", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(_P)), "cost", rt.fv(f, "cost", live(_P)), "id", live(pack)])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "cart", rt.list());
	SO = null;
	rt.forList(f, 0, rt.fv(f, "shoppinglist", rt.gl("SSshuttle")), T("/datum/supply_order"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SO = $e;
		rt.modAt(live(data), "cart", rt.list(rt.alist(f, ["object", rt.gv(f, "name", rt.fv(f, "pack", live(SO))), "cost", rt.gv(f, "cost", rt.fv(f, "pack", live(SO))), "id", rt.fv(f, "id", live(SO))])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "requests", rt.list());
	SO = null;
	rt.forList(f, 0, rt.fv(f, "requestlist", rt.gl("SSshuttle")), T("/datum/supply_order"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SO = $e;
		rt.modAt(live(data), "requests", rt.list(rt.alist(f, ["object", rt.gv(f, "name", rt.fv(f, "pack", live(SO))), "cost", rt.gv(f, "cost", rt.fv(f, "pack", live(SO))), "orderer", rt.fv(f, "orderer", live(SO)), "reason", rt.fv(f, "reason", live(SO)), "id", rt.fv(f, "id", live(SO))])), add);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /obj/machinery/computer/cargo/proc/ui_act  (code/modules/cargo/console.dm:95)  may sleep
rt.def("/obj/machinery/computer/cargo/proc/ui_act", function* ui_act(f: Frame) {
	let id: Value = null, pack: Value = null, name: Value = null, rank: Value = null, ckey: Value = null, H: Value = null, reason: Value = null, _T: Value = null, SO: Value = null, SO_1: Value = null;
	let $0: any, $e: any;
	f.vars = () => [id, pack, name, rank, ckey, H, reason, _T, SO, SO_1, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((!isEqual(live(f.args[0]), "add") && truthy(rt.sv(f, "requestonly")))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "send") {
		if (!truthy((yield* g.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "canMove", [])))) {
			yield* g.srcCall(f, "say", rt.sv(f, "safety_warning"));
			return live(f.dot);
		}
		if (isEqual((yield* g.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "getDockedId", [])), "supply_home")) {
			rt.setFv(f, "emagged", rt.fv(f, "supply", rt.gl("SSshuttle")), rt.sv(f, "emagged"));
			rt.setFv(f, "contraband", rt.fv(f, "supply", rt.gl("SSshuttle")), rt.sv(f, "contraband"));
			yield* g.callName(f, rt.gl("SSshuttle"), "moveShuttle", ["supply", "supply_away", 1]);
			yield* g.srcCall(f, "say", "The supply shuttle has departed.");
			yield* g.srcCall(f, "investigate_log", fmt("＀ sent the supply shuttle away.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "cargo");
		} else {
			yield* g.srcCall(f, "investigate_log", fmt("＀ called the supply shuttle.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "cargo");
			yield* g.srcCall(f, "say", fmt("The supply shuttle has been called and will arrive in ＀ minutes.", [(yield* g.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "timeLeft", [600]))]));
			yield* g.callName(f, rt.gl("SSshuttle"), "moveShuttle", ["supply", "supply_home", 1]);
		}
		f.dot = 1;
	} else if ($0 === "loan") {
		if (!truthy(rt.fv(f, "shuttle_loan", rt.gl("SSshuttle")))) {
			return live(f.dot);
		} else {
			if (!isEqual(rt.gv(f, "mode", rt.fv(f, "supply", rt.gl("SSshuttle"))), "idle")) {
				return live(f.dot);
			} else {
				if (!isEqual((yield* g.callName(f, rt.fv(f, "supply", rt.gl("SSshuttle")), "getDockedId", [])), "supply_away")) {
					return live(f.dot);
				} else {
					yield* g.callName(f, rt.fv(f, "shuttle_loan", rt.gl("SSshuttle")), "loan_shuttle", []);
					yield* g.srcCall(f, "say", "The supply shuttle has been loaned to Centcom.");
					f.dot = 1;
				}
			}
		}
	} else if ($0 === "add") {
		id = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(f.args[1]), "id")]));
		if (!truthy((rt.istype((pack = rt.index(rt.fv(f, "supply_packs", rt.gl("SSshuttle")), live(id))), T("/datum/supply_pack")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (((truthy(rt.fv(f, "hidden", live(pack))) && !truthy(rt.sv(f, "emagged"))) || (truthy(rt.fv(f, "contraband", live(pack))) && !truthy(rt.sv(f, "contraband"))))) {
			return live(f.dot);
		}
		name = "*None Provided*";
		rank = "*None Provided*";
		ckey = rt.fv(f, "ckey", live(f.usr));
		if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
			name = (yield* g.callName(f, (H = live(f.usr)), "get_authentification_name", []));
			rank = (yield* g.callName(f, live(H), "get_assignment", []));
		} else {
			if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
				name = rt.fv(f, "real_name", live(f.usr));
				rank = "Silicon";
			}
		}
		reason = "";
		if (truthy(rt.sv(f, "requestonly"))) {
			if (((reason = (yield* g.op(f, "Prompt", [3], [null, "", live(name), "Reason:", null]))) === null || truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				return live(f.dot);
			}
		}
		_T = rt.getStep(f, live(f.src), 0);
		yield* g.callName(f, (SO = (yield* g.new_(f, T("/datum/supply_order"), [live(pack), live(name), live(rank), live(ckey), live(reason)]))), "generateRequisition", [live(_T)]);
		if (truthy(rt.sv(f, "requestonly"))) {
			rt.modField(f, rt.gl("SSshuttle"), "requestlist", live(SO), add);
		} else {
			rt.modField(f, rt.gl("SSshuttle"), "shoppinglist", live(SO), add);
		}
		f.dot = 1;
	} else if ($0 === "remove") {
		id = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "id")]));
		SO_1 = null;
		rt.forList(f, 0, rt.fv(f, "shoppinglist", rt.gl("SSshuttle")), T("/datum/supply_order"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SO_1 = $e;
			if (isEqual(rt.fv(f, "id", live(SO_1)), live(id))) {
				(rt.modField(f, rt.gl("SSshuttle"), "shoppinglist", live(SO_1), subtract));
				f.dot = 1;
				break;
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "clear") {
		yield* g.callName(f, rt.fv(f, "shoppinglist", rt.gl("SSshuttle")), "Cut", []);
		f.dot = 1;
	} else if ($0 === "approve") {
		id = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "id")]));
		SO_1 = null;
		rt.forList(f, 0, rt.fv(f, "requestlist", rt.gl("SSshuttle")), T("/datum/supply_order"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SO_1 = $e;
			if (isEqual(rt.fv(f, "id", live(SO_1)), live(id))) {
				(rt.modField(f, rt.gl("SSshuttle"), "requestlist", live(SO_1), subtract));
				rt.modField(f, rt.gl("SSshuttle"), "shoppinglist", live(SO_1), add);
				f.dot = 1;
				break;
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "deny") {
		id = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "id")]));
		SO_1 = null;
		rt.forList(f, 0, rt.fv(f, "requestlist", rt.gl("SSshuttle")), T("/datum/supply_order"));
		while (($e = rt.next(f, 0)) !== undefined) {
			SO_1 = $e;
			if (isEqual(rt.fv(f, "id", live(SO_1)), live(id))) {
				(rt.modField(f, rt.gl("SSshuttle"), "requestlist", live(SO_1), subtract));
				f.dot = 1;
				break;
			}
		}
		rt.endFor(f, 0);
	} else if ($0 === "denyall") {
		yield* g.callName(f, rt.fv(f, "requestlist", rt.gl("SSshuttle")), "Cut", []);
		f.dot = 1;
	}
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "post_signal", "supply");
	return f.dot;
}, true, { args: ["action", "params", "ui"] });

// /obj/machinery/computer/cargo/proc/post_signal  (code/modules/cargo/console.dm:192)  may sleep
rt.def("/obj/machinery/computer/cargo/proc/post_signal", function* post_signal(f: Frame, command: Value) {
	let frequency: Value = null, status_signal: Value = null;
	f.vars = () => [command, frequency, status_signal];
	if (!truthy((frequency = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [1435]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "source", (status_signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "transmission_method", live(status_signal), 1);
	rt.setAt(rt.fv(f, "data", live(status_signal)), "command", live(command));
	yield* g.callName(f, live(frequency), "post_signal", [live(f.src), live(status_signal)]);
	return f.dot;
}, true);
