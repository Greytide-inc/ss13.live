// Based on /tg/station's code/game/machinery/doors/airlock_electronics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6935, "/obj/item/weapon/electronics/airlock", "/obj/item/weapon/electronics", {
	accesses: null,
	one_access: 0,
	name: "airlock electronics",
	req_access: null,
});

// airlock_electronics.dm:5
rt.def("/obj/item/weapon/electronics/airlock/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.accesses = list();

	this.req_access = list(12);
	return f.dot;
});

// airlock_electronics.dm:10
rt.def("/obj/item/weapon/electronics/airlock/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.hands_state;
	yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open);
	if (ui) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "airlock_electronics", this.name, 975, 420, master_ui, state))).open();
	return f.dot;
}, true);

// airlock_electronics.dm:16
rt.def("/obj/item/weapon/electronics/airlock/proc/ui_data", function ui_data(f: Frame) {
	let i: Value = null, region: Value = null, accesses: Value = null, j: Value = null, access: Value = null;
	let $e: any;
	let data: Value = list();
	let regions: Value = list();
	rt.forRange(f, 0, 1, 7, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		region = list();
		accesses = list();
		j = null;
		for (j of each(get_region_accesses(i))) {
			rt.setAt((access = list()), "name", get_access_desc(j));
			rt.setAt(access, "id", j);
			rt.setAt(access, "req", (rt.isIn(f, j, this.accesses) ? 1 : 0));
			rt.setAt(accesses, ++accesses.len, access);
		}
		rt.setAt(region, "name", get_region_accesses_name(i));
		rt.setAt(region, "accesses", accesses);
		rt.setAt(regions, ++regions.len, region);
	}
	rt.endFor(f, 0);
	rt.setAt(data, "regions", regions);
	rt.setAt(data, "oneAccess", this.one_access);
	return data;
});

// airlock_electronics.dm:37
rt.def("/obj/item/weapon/electronics/airlock/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let access: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "clear") {
		this.accesses = list();
		this.one_access = 0;
		f.dot = 1;
	} else if (action === "one_access") {
		this.one_access = (!this.one_access ? 1 : 0);
		f.dot = 1;
	} else if (action === "set") {
		if (!rt.isIn(f, (access = text2num(rt.at(params, "access"))), this.accesses)) {
			this.accesses += access;
		} else {
			this.accesses -= access;
		}
		f.dot = 1;
	}
	return f.dot;
}, true);
