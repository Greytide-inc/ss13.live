// From code/modules/uplink/uplink.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaluplinks  (code/modules/uplink/uplink.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaluplinks", function InitGlobaluplinks(f: Frame) {
	rt.setGl("uplinks", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "uplinks", add);
	return f.dot;
});

rt.type(9437, "/obj/item/device/uplink", "/obj/item/device", {
	active: 0,
	lockable: 1,
	telecrystals: 20,
	selected_cat: null,
	owner: null,
	gamemode: null,
	spent_telecrystals: 0,
	purchase_log: "",
	uplink_items: null,
	hidden_crystals: 0,
	name: "syndicate uplink",
	desc: "There is something wrong if you're examining this.",
});

// /obj/item/device/uplink/proc/Initialize  (code/modules/uplink/uplink.dm:25)  may sleep
rt.def("/obj/item/device/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modGl("uplinks", live(f.src), add);
	rt.setSv(f, "uplink_items", (yield* g.call(f, P("/proc/get_uplink_items"), null, [rt.sv(f, "gamemode")])));
	return f.dot;
}, true);

// /obj/item/device/uplink/proc/set_gamemode  (code/modules/uplink/uplink.dm:31)  may sleep
rt.def("/obj/item/device/uplink/proc/set_gamemode", function* set_gamemode(f: Frame, gamemode: Value) {
	f.vars = () => [gamemode];
	rt.setFv(f, "gamemode", live(f.src), live(gamemode));
	rt.setSv(f, "uplink_items", (yield* g.call(f, P("/proc/get_uplink_items"), null, [live(gamemode)])));
	return f.dot;
}, true);

// /obj/item/device/uplink/proc/Destroy  (code/modules/uplink/uplink.dm:34)  may sleep
rt.def("/obj/item/device/uplink/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("uplinks", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/uplink/proc/attackby  (code/modules/uplink/uplink.dm:38)  may sleep
rt.def("/obj/item/device/uplink/proc/attackby", function* attackby(f: Frame) {
	let item: Value = null, UI: Value = null, path: Value = null, cost: Value = null, refundable: Value = null;
	let $e: any;
	f.vars = () => [item, UI, path, cost, refundable, $e];
	item = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/uplink_item")])), T("/datum/uplink_item")));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		UI = live(item);
		path = null;
		if (truthy(rt.initial(f, live(UI), "refund_path"))) {
			path = rt.initial(f, live(UI), "refund_path");
		} else {
			path = rt.initial(f, live(UI), "item");
		}
		cost = 0;
		if (truthy(rt.initial(f, live(UI), "refund_amount"))) {
			cost = rt.initial(f, live(UI), "refund_amount");
		} else {
			cost = rt.initial(f, live(UI), "cost");
		}
		refundable = rt.initial(f, live(UI), "refundable");
		if (((isEqual(rt.fv(f, "type", live(f.args[0])), live(path)) && truthy(live(refundable))) && truthy((yield* g.callName(f, live(f.args[0]), "check_uplink_validity", []))))) {
			rt.modSrcVar(f, "telecrystals", live(cost), add);
			(rt.modSrcVar(f, "spent_telecrystals", live(cost), subtract));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ refunded.</span>", [live(f.args[0])])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/device/uplink/proc/interact  (code/modules/uplink/uplink.dm:62)  may sleep
rt.def("/obj/item/device/uplink/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "active", 1);
	if (!truthy(live(user))) return f.dot;
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/uplink/proc/ui_interact  (code/modules/uplink/uplink.dm:66)  may sleep
rt.def("/obj/item/device/uplink/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("inventory_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "uplink", rt.sv(f, "name"), 450, 750, live(master_ui), live(state)]))), "set_autoupdate", [0]);
	yield* g.callName(f, live(ui), "set_style", ["syndicate"]);
	yield* g.callName(f, live(ui), "open", []);
	return f.dot;
}, true);

// /obj/item/device/uplink/proc/ui_data  (code/modules/uplink/uplink.dm:74)
rt.def("/obj/item/device/uplink/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, category: Value = null, cat: Value = null, item: Value = null, I: Value = null, is_inaccessible: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [data, category, cat, item, I, is_inaccessible, R, $0, $1, $2, $3, $e];
	if (!truthy(rt.fv(f, "mind", live(user)))) {
		return live(f.dot);
	}
	rt.setAt((data = rt.list()), "telecrystals", rt.sv(f, "telecrystals"));
	rt.setAt(live(data), "lockable", rt.sv(f, "lockable"));
	rt.setAt(live(data), "categories", rt.list());
	category = null;
	rt.forList(f, 0, rt.sv(f, "uplink_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		$0 = "name";
		$1 = live(category);
		$2 = "items";
		if (isEqual(live(category), rt.sv(f, "selected_cat"))) {
			$3 = rt.list();
		} else {
			$3 = null;
		}
		cat = rt.alist(f, [$0, $1, $2, $3]);
		if (isEqual(live(category), rt.sv(f, "selected_cat"))) {
			item = null;
			rt.forList(f, 1, rt.index(rt.sv(f, "uplink_items"), live(category)));
			while (($e = rt.next(f, 1)) !== undefined) {
				item = $e;
				if (isEqual(rt.gv(f, "limited_stock", (I = rt.index(rt.index(rt.sv(f, "uplink_items"), live(category)), live(item)))), 0)) {
					continue;
				}
				if (truthy(rt.getLen(f, rt.fv(f, "restricted_roles", live(I))))) {
					is_inaccessible = 1;
					R = null;
					rt.forList(f, 2, rt.fv(f, "restricted_roles", live(I)));
					while (($e = rt.next(f, 2)) !== undefined) {
						R = $e;
						if (isEqual(live(R), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(user))))) {
							is_inaccessible = 0;
						}
					}
					rt.endFor(f, 2);
					if (truthy(live(is_inaccessible))) {
						continue;
					}
				}
				rt.modAt(live(cat), "items", rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(I)), "cost", rt.fv(f, "cost", live(I)), "desc", rt.fv(f, "desc", live(I))])), add);
			}
			rt.endFor(f, 1);
		}
		rt.modAt(live(data), "categories", rt.list(live(cat)), add);
	}
	rt.endFor(f, 0);
	return live(data);
});

// /obj/item/device/uplink/proc/ui_act  (code/modules/uplink/uplink.dm:107)  may sleep
rt.def("/obj/item/device/uplink/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let item: Value = null, buyable_items: Value = null, category: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [action, params, ui, item, buyable_items, category, I, $0, $e];
	// An href can reach this with the window closed or out of reach: only an interactive window may act.
	if (!truthy(live(ui)) || !isEqual(rt.fv(f, "status", live(ui)), 2)) {
		return 1;
	}
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	$0 = live(action);
	if ($0 === "buy") {
		item = rt.at(live(params), "item");
		buyable_items = rt.list();
		category = null;
		rt.forList(f, 0, rt.sv(f, "uplink_items"));
		while (($e = rt.next(f, 0)) !== undefined) {
			category = $e;
			buyable_items = rt.modify(live(buyable_items), rt.index(rt.sv(f, "uplink_items"), live(category)), add);
		}
		rt.endFor(f, 0);
		if (truthy((rt.isIn(f, live(item), live(buyable_items)) ? 1 : 0))) {
			yield* g.callName(f, (I = rt.index(live(buyable_items), live(item))), "buy", [live(f.usr), live(f.src)]);
			f.dot = 1;
		}
	} else if ($0 === "lock") {
		rt.setSv(f, "active", 0);
		rt.modSrcVar(f, "telecrystals", rt.sv(f, "hidden_crystals"), add);
		rt.setSv(f, "hidden_crystals", 0);
		yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
	} else if ($0 === "select") {
		rt.setSv(f, "selected_cat", rt.at(live(params), "category"));
	}
	return 1;
}, true);

rt.type(9210, "/obj/item/device/radio/uplink", "/obj/item/device/radio", {});

// /obj/item/device/radio/uplink/proc/attackby  (code/modules/uplink/uplink.dm:137)  may sleep
rt.def("/obj/item/device/radio/uplink/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	return (yield* g.callName(f, rt.sv(f, "hidden_uplink"), "attackby", [live(I), live(user), live(params)]));
}, true);

// /obj/item/device/radio/uplink/proc/Initialize  (code/modules/uplink/uplink.dm:141)  may sleep
rt.def("/obj/item/device/radio/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", "radio");
	rt.setSv(f, "hidden_uplink", (yield* g.new_(f, T("/obj/item/device/uplink"), [live(f.src)])));
	rt.setFv(f, "active", rt.sv(f, "hidden_uplink"), 1);
	rt.setFv(f, "lockable", rt.sv(f, "hidden_uplink"), 0);
	return f.dot;
}, true);

rt.type(9212, "/obj/item/device/radio/uplink/nuclear", "/obj/item/device/radio/uplink", {});

// /obj/item/device/radio/uplink/nuclear/proc/Initialize  (code/modules/uplink/uplink.dm:148)  may sleep
rt.def("/obj/item/device/radio/uplink/nuclear/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "hidden_uplink"), "set_gamemode", [T("/datum/game_mode/nuclear")]);
	return f.dot;
}, true);

rt.type(9274, "/obj/item/device/multitool/uplink", "/obj/item/device/multitool", {});

// /obj/item/device/multitool/uplink/proc/Initialize  (code/modules/uplink/uplink.dm:152)  may sleep
rt.def("/obj/item/device/multitool/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "hidden_uplink", (yield* g.new_(f, T("/obj/item/device/uplink"), [live(f.src)])));
	rt.setFv(f, "active", rt.sv(f, "hidden_uplink"), 1);
	rt.setFv(f, "lockable", rt.sv(f, "hidden_uplink"), 0);
	return f.dot;
}, true);

rt.type(6653, "/obj/item/weapon/pen/uplink", "/obj/item/weapon/pen", {});

// /obj/item/weapon/pen/uplink/proc/Initialize  (code/modules/uplink/uplink.dm:158)  may sleep
rt.def("/obj/item/weapon/pen/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "hidden_uplink", (yield* g.new_(f, T("/obj/item/device/uplink"), [live(f.src)])));
	rt.setSv(f, "traitor_unlock_degrees", 360);
	return f.dot;
}, true);
