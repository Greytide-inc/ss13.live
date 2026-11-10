// Based on /tg/station's code/modules/cargo/console.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


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

// console.dm:22
rt.def("/obj/machinery/computer/cargo/proc/New", function* New(f: Frame) {
	let board: Value = null;
	yield* parent_proc();
	this.contraband = (board = this.circuit).contraband;
	this.emagged = board.emagged;
	return f.dot;
}, true);

// console.dm:28
rt.def("/obj/machinery/computer/cargo/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let board: Value = null;
	if (this.emagged) return f.dot;
	user.visible_message(`<span class='warning'>${user} swipes a suspicious card through ${this}!`, `<span class='notice'>You adjust ${this}'s routing and receiver spectrum, unlocking special supplies and contraband.</span>`);
	this.emagged = 1;
	this.contraband = 1;
	(board = this.circuit).contraband = 1;
	board.emagged = 1;
	return f.dot;
});

// console.dm:42
rt.def("/obj/machinery/computer/cargo/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "cargo", this.name, 1000, 800, master_ui, state))).open();
	return f.dot;
}, true);

// console.dm:48
rt.def("/obj/machinery/computer/cargo/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, pack: Value = null, _P: Value = null, SO: Value = null;
	rt.setAt((data = list()), "requestonly", this.requestonly);
	rt.setAt(data, "location", GLOB.SSshuttle.supply.getStatusText());
	rt.setAt(data, "points", GLOB.SSshuttle.points);
	rt.setAt(data, "away", (GLOB.SSshuttle.supply.getDockedId() == "supply_away" ? 1 : 0));
	rt.setAt(data, "docked", (GLOB.SSshuttle.supply.mode == "idle" ? 1 : 0));
	rt.setAt(data, "loan", (GLOB.SSshuttle.shuttle_loan ? 1 : 0));
	rt.setAt(data, "loan_dispatched", (GLOB.SSshuttle.shuttle_loan && GLOB.SSshuttle.shuttle_loan.dispatched));
	rt.setAt(data, "message", (GLOB.SSshuttle.centcom_message || "Remember to stamp and send back the supply manifests."));
	rt.setAt(data, "supplies", list());
	for (pack of each(GLOB.SSshuttle.supply_packs)) {
		_P = rt.index(GLOB.SSshuttle.supply_packs, pack);
		if (!rt.index(rt.at(data, "supplies"), _P.group)) {
			rt.setAt(rt.at(data, "supplies"), _P.group, rt.alist(f, ["name", _P.group, "packs", list()]));
		}
		if (_P.hidden && !this.emagged || _P.contraband && !this.contraband || _P.special && !_P.special_enabled) {
			continue;
		}
		rt.modAt(rt.index(rt.at(data, "supplies"), _P.group), "packs", list(rt.alist(f, ["name", _P.name, "cost", _P.cost, "id", pack])), add);
	}
	rt.setAt(data, "cart", list());
	for (SO of each(GLOB.SSshuttle.shoppinglist, T("/datum/supply_order"))) {
		rt.modAt(data, "cart", list(rt.alist(f, ["object", SO.pack.name, "cost", SO.pack.cost, "id", SO.id])), add);
	}
	rt.setAt(data, "requests", list());
	SO = null;
	for (SO of each(GLOB.SSshuttle.requestlist, T("/datum/supply_order"))) {
		rt.modAt(data, "requests", list(rt.alist(f, ["object", SO.pack.name, "cost", SO.pack.cost, "orderer", SO.orderer, "reason", SO.reason, "id", SO.id])), add);
	}
	return data;
});

// console.dm:95
rt.def("/obj/machinery/computer/cargo/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let id: Value = null, pack: Value = null, name: Value = null, rank: Value = null, ckey: Value = null, H: Value = null, reason: Value = null, _T: Value = null, SO: Value = null, SO_1: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action != "add" && this.requestonly) {
		return f.dot;
	}
	if (action === "send") {
		if (!GLOB.SSshuttle.supply.canMove()) {
			yield* this.say(this.safety_warning);
			return f.dot;
		}
		if (GLOB.SSshuttle.supply.getDockedId() == "supply_home") {
			GLOB.SSshuttle.supply.emagged = this.emagged;
			GLOB.SSshuttle.supply.contraband = this.contraband;
			yield* GLOB.SSshuttle.moveShuttle("supply", "supply_away", 1);
			yield* this.say("The supply shuttle has departed.");
			this.investigate_log(`${key_name(f.usr)} sent the supply shuttle away.`, "cargo");
		} else {
			this.investigate_log(`${key_name(f.usr)} called the supply shuttle.`, "cargo");
			yield* this.say(`The supply shuttle has been called and will arrive in ${GLOB.SSshuttle.supply.timeLeft(600)} minutes.`);
			yield* GLOB.SSshuttle.moveShuttle("supply", "supply_home", 1);
		}
		f.dot = 1;
	} else if (action === "loan") {
		if (!GLOB.SSshuttle.shuttle_loan) {
			return f.dot;
		} else if (GLOB.SSshuttle.supply.mode != "idle") {
			return f.dot;
		} else if (GLOB.SSshuttle.supply.getDockedId() != "supply_away") {
			return f.dot;
		} else {
			yield* GLOB.SSshuttle.shuttle_loan.loan_shuttle();
			yield* this.say("The supply shuttle has been loaned to Centcom.");
			f.dot = 1;
		}
	} else if (action === "add") {
		id = text2path(rt.at(params, "id"));
		if (!rt.istype((pack = rt.index(GLOB.SSshuttle.supply_packs, id)), T("/datum/supply_pack"))) {
			return f.dot;
		}
		if (pack.hidden && !this.emagged || pack.contraband && !this.contraband) {
			return f.dot;
		}
		name = "*None Provided*";
		rank = "*None Provided*";
		ckey = f.usr.ckey;
		if (rt.istype(f.usr, T("/mob/living/carbon/human"))) {
			name = (H = f.usr).get_authentification_name();
			rank = H.get_assignment();
		} else if (rt.istype(f.usr, T("/mob/living/silicon"))) {
			name = f.usr.real_name;
			rank = "Silicon";
		}
		reason = "";
		if (this.requestonly) {
			if ((reason = (yield* g.op(f, "Prompt", [3], [null, "", name, "Reason:", null]))) === null || (yield* parent_proc())) {
				return f.dot;
			}
		}
		_T = rt.getStep(f, this, 0);
		yield* (SO = (yield* new_(T("/datum/supply_order"), pack, name, rank, ckey, reason))).generateRequisition(_T);
		if (this.requestonly) {
			GLOB.SSshuttle.requestlist += SO;
		} else {
			GLOB.SSshuttle.shoppinglist += SO;
		}
		f.dot = 1;
	} else if (action === "remove") {
		id = text2num(rt.at(params, "id"));
		for (SO_1 of each(GLOB.SSshuttle.shoppinglist, T("/datum/supply_order"))) {
			if (SO_1.id == id) {
				GLOB.SSshuttle.shoppinglist -= SO_1;
				f.dot = 1;
				break;
			}
		}
	} else if (action === "clear") {
		GLOB.SSshuttle.shoppinglist.Cut();
		f.dot = 1;
	} else if (action === "approve") {
		id = text2num(rt.at(params, "id"));
		SO_1 = null;
		for (SO_1 of each(GLOB.SSshuttle.requestlist, T("/datum/supply_order"))) {
			if (SO_1.id == id) {
				GLOB.SSshuttle.requestlist -= SO_1;
				GLOB.SSshuttle.shoppinglist += SO_1;
				f.dot = 1;
				break;
			}
		}
	} else if (action === "deny") {
		id = text2num(rt.at(params, "id"));
		SO_1 = null;
		for (SO_1 of each(GLOB.SSshuttle.requestlist, T("/datum/supply_order"))) {
			if (SO_1.id == id) {
				GLOB.SSshuttle.requestlist -= SO_1;
				f.dot = 1;
				break;
			}
		}
	} else if (action === "denyall") {
		GLOB.SSshuttle.requestlist.Cut();
		f.dot = 1;
	}
	if (!f.dot) return f.dot;
	yield* this.post_signal("supply");
	return f.dot;
}, true);

// console.dm:192
rt.def("/obj/machinery/computer/cargo/proc/post_signal", function* post_signal(f: Frame, command: Value) {
	let frequency: Value = null, status_signal: Value = null;
	if (!(frequency = GLOB.SSradio.return_frequency(1435))) {
		return f.dot;
	}
	(status_signal = (yield* new_(T("/datum/signal")))).source = this;
	status_signal.transmission_method = 1;
	rt.setAt(status_signal.data, "command", command);
	yield* frequency.post_signal(this, status_signal);
	return f.dot;
}, true);
