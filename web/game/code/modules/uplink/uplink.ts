// Based on /tg/station's code/modules/uplink/uplink.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


// uplink.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaluplinks", function InitGlobaluplinks(f: Frame) {
	GLOB.uplinks = list();
	this.gvars_datum_init_order += "uplinks";
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

// uplink.dm:25
rt.def("/obj/item/device/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.uplinks += this;
	this.uplink_items = (yield* get_uplink_items(this.gamemode));
	return f.dot;
}, true);

// uplink.dm:31
rt.def("/obj/item/device/uplink/proc/set_gamemode", function* set_gamemode(f: Frame, gamemode: Value) {
	this.gamemode = gamemode;
	this.uplink_items = (yield* get_uplink_items(gamemode));
	return f.dot;
}, true);

// uplink.dm:34
rt.def("/obj/item/device/uplink/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.uplinks -= this;
	return (yield* parent_proc());
}, true);

// uplink.dm:38
rt.def("/obj/item/device/uplink/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let item: Value = null, UI: Value = null, path: Value = null, cost: Value = null, refundable: Value = null;
	for (item of each(typesof(T("/datum/uplink_item")) - T("/datum/uplink_item"))) {
		UI = item;
		path = null;
		if (rt.initial(f, UI, "refund_path")) {
			path = rt.initial(f, UI, "refund_path");
		} else {
			path = rt.initial(f, UI, "item");
		}
		cost = 0;
		if (rt.initial(f, UI, "refund_amount")) {
			cost = rt.initial(f, UI, "refund_amount");
		} else {
			cost = rt.initial(f, UI, "cost");
		}
		refundable = rt.initial(f, UI, "refundable");
		if (I.type == path && refundable && I.check_uplink_validity()) {
			this.telecrystals += cost;
			this.spent_telecrystals -= cost;
			to_chat(user, `<span class='notice'>${I} refunded.</span>`);
			yield* qdel(I);
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// uplink.dm:62
rt.def("/obj/item/device/uplink/proc/interact", function* interact(f: Frame, user: Value) {
	this.active = 1;
	if (!user) return f.dot;
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// uplink.dm:66
rt.def("/obj/item/device/uplink/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.inventory_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	(ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "uplink", this.name, 450, 750, master_ui, state))).set_autoupdate(0);
	ui.set_style("syndicate");
	yield* ui.open();
	return f.dot;
}, true);

// uplink.dm:74
rt.def("/obj/item/device/uplink/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, category: Value = null, cat: Value = null, item: Value = null, I: Value = null, is_inaccessible: Value = null, R: Value = null;
	let $e: any;
	if (!user.mind) {
		return f.dot;
	}
	rt.setAt((data = list()), "telecrystals", this.telecrystals);
	rt.setAt(data, "lockable", this.lockable);
	rt.setAt(data, "categories", list());
	for (category of each(this.uplink_items)) {
		cat = rt.alist(f, ["name", category, "items", category == this.selected_cat ? list() : null]);
		if (category == this.selected_cat) {
			item = null;
			for (item of each(rt.index(this.uplink_items, category))) {
				if ((I = rt.index(rt.index(this.uplink_items, category), item)).limited_stock == 0) {
					continue;
				}
				if (rt.len(f, I.restricted_roles)) {
					is_inaccessible = 1;
					R = null;
					for (R of each(I.restricted_roles)) {
						if (R == user.mind.assigned_role) {
							is_inaccessible = 0;
						}
					}
					if (is_inaccessible) {
						continue;
					}
				}
				rt.modAt(cat, "items", list(rt.alist(f, ["name", I.name, "cost", I.cost, "desc", I.desc])), add);
			}
		}
		rt.modAt(data, "categories", list(cat), add);
	}
	return data;
});

// uplink.dm:107
rt.def("/obj/item/device/uplink/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let item: Value = null, buyable_items: Value = null, category: Value = null, I: Value = null;
	let $e: any;
	// An href can reach this with the window closed or out of reach: only an interactive window may act.
	if (!ui || ui.status != 2) {
		return 1;
	}
	if (!this.active) {
		return f.dot;
	}
	if (action === "buy") {
		item = rt.at(params, "item");
		buyable_items = list();
		for (category of each(this.uplink_items)) {
			buyable_items += rt.index(this.uplink_items, category);
		}
		if (rt.isIn(f, item, buyable_items)) {
			yield* (I = rt.index(buyable_items, item)).buy(f.usr, this);
			f.dot = 1;
		}
	} else if (action === "lock") {
		this.active = 0;
		this.telecrystals += this.hidden_crystals;
		this.hidden_crystals = 0;
		yield* GLOB.SStgui.close_uis(this);
	} else if (action === "select") {
		this.selected_cat = rt.at(params, "category");
	}
	return 1;
}, true);

rt.type(9210, "/obj/item/device/radio/uplink", "/obj/item/device/radio", {});

// uplink.dm:137
rt.def("/obj/item/device/radio/uplink/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	return (yield* this.hidden_uplink.attackby(I, user, params));
}, true);

// uplink.dm:141
rt.def("/obj/item/device/radio/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.icon_state = "radio";
	this.hidden_uplink = (yield* new_(T("/obj/item/device/uplink"), this));
	this.hidden_uplink.active = 1;
	this.hidden_uplink.lockable = 0;
	return f.dot;
}, true);

rt.type(9212, "/obj/item/device/radio/uplink/nuclear", "/obj/item/device/radio/uplink", {});

// uplink.dm:148
rt.def("/obj/item/device/radio/uplink/nuclear/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.hidden_uplink.set_gamemode(T("/datum/game_mode/nuclear"));
	return f.dot;
}, true);

rt.type(9274, "/obj/item/device/multitool/uplink", "/obj/item/device/multitool", {});

// uplink.dm:152
rt.def("/obj/item/device/multitool/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.hidden_uplink = (yield* new_(T("/obj/item/device/uplink"), this));
	this.hidden_uplink.active = 1;
	this.hidden_uplink.lockable = 0;
	return f.dot;
}, true);

rt.type(6653, "/obj/item/weapon/pen/uplink", "/obj/item/weapon/pen", {});

// uplink.dm:158
rt.def("/obj/item/weapon/pen/uplink/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.hidden_uplink = (yield* new_(T("/obj/item/device/uplink"), this));
	this.traitor_unlock_degrees = 360;
	return f.dot;
}, true);
