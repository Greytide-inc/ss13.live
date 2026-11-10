// Based on /tg/station's code/game/machinery/recharger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10812, "/obj/machinery/recharger", "/obj/machinery", {
	charging: null,
	recharge_coeff: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 4,
	active_power_usage: 250,
	name: "recharger",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "recharger0",
	desc: "A charging dock for energy based weaponry.",
}, { global: { allowed_devices: 760 } });

// recharger.dm:15
rt.def("/obj/machinery/recharger/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/recharger")))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6726, "/obj/item/weapon/circuitboard/machine/recharger", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Weapon Recharger (Machine Board)",
	build_path: rt.typePath("/obj/machinery/recharger"),
	origin_tech: "powerstorage=4;engineering=3;materials=4",
});

// recharger.dm:23
rt.def("/obj/item/weapon/circuitboard/machine/recharger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1]);
	return f.dot;
});

// recharger.dm:26
rt.def("/obj/machinery/recharger/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		this.recharge_coeff = C.rating;
	}
	return f.dot;
});

// recharger.dm:30
rt.def("/obj/machinery/recharger/proc/attackby", function* attackby(f: Frame, G: Value, user: Value, params: Value) {
	let allowed: Value = null, a: Value = null, E: Value = null;
	if (rt.istype(G, T("/obj/item/weapon/wrench"))) {
		if (this.charging) {
			to_chat(user, "<span class='notice'>Remove the charging item first!</span>");
			return f.dot;
		}
		this.anchored = (!this.anchored ? 1 : 0);
		yield* this.power_change();
		to_chat(user, `<span class='notice'>You ${this.anchored ? "attached" : "detached"} ${this}.</span>`);
		playsound(this.loc, G.usesound, 75, 1);
		return f.dot;
	}
	if (allowed = is_type_in_typecache(G, GLOB.allowed_devices)) {
		if (this.anchored) {
			if (this.charging || this.panel_open) {
				return 1;
			}
			if (!isarea((a = get_area(this))) || a.power_equip == 0) {
				to_chat(user, `<span class='notice'>${this} blinks red as you try to insert ${G}.</span>`);
				return 1;
			}
			if (rt.istype(G, T("/obj/item/weapon/gun/energy"))) {
				if (!(E = G).can_charge) {
					to_chat(user, "<span class='notice'>Your gun has no external power connector.</span>");
					return 1;
				}
			}
			if (!(yield* user.drop_item())) {
				return 1;
			}
			G.loc = this;
			this.charging = G;
			this.use_power = 2;
			yield* this.update_icon({ scan: 1 });
		} else {
			to_chat(user, `<span class='notice'>${this} isn't connected to anything!</span>`);
		}
		return 1;
	}
	if (this.anchored && !this.charging) {
		if (this.default_deconstruction_screwdriver(user, "rechargeropen", "recharger0", G)) {
			return f.dot;
		}
		if (this.panel_open && rt.istype(G, T("/obj/item/weapon/crowbar"))) {
			yield* this.default_deconstruction_crowbar(G);
			return f.dot;
		}
		if (yield* this.exchange_parts(user, G)) {
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// recharger.dm:82
rt.def("/obj/machinery/recharger/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon"))) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (!this.charging) return f.dot;
	yield* this.charging.update_icon();
	this.charging.loc = this.loc;
	yield* user.put_in_hands(this.charging);
	this.charging = null;
	this.use_power = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// recharger.dm:95
rt.def("/obj/machinery/recharger/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// recharger.dm:99
rt.def("/obj/machinery/recharger/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	if (!this.charging) return f.dot;
	yield* this.charging.update_icon();
	this.charging.loc = this.loc;
	this.charging = null;
	this.use_power = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// recharger.dm:106
rt.def("/obj/machinery/recharger/proc/process", function* process(f: Frame) {
	let C: Value = null, E: Value = null, R: Value = null;
	if (rt.bitAnd(this.stat, 3) || !this.anchored) {
		return f.dot;
	}
	let using_power: Value = 0;
	if (!this.charging) return f.dot;
	if (C = this.charging.get_cell()) {
		if (C.charge < C.maxcharge) {
			yield* C.give(C.chargerate * this.recharge_coeff);
			yield* this.use_power(250 * this.recharge_coeff);
			using_power = 1;
		}
		yield* this.update_icon(using_power);
	}
	if (rt.istype(this.charging, T("/obj/item/weapon/gun/energy"))) {
		yield* (E = this.charging).recharge_newshot();
		return f.dot;
	}
	if (!rt.istype(this.charging, T("/obj/item/ammo_box/magazine/recharge"))) return f.dot;
	if (rt.len(f, (R = this.charging).stored_ammo) < R.max_ammo) {
		R.stored_ammo += (yield* new_(R.ammo_type, R));
		yield* this.use_power(200 * this.recharge_coeff);
		using_power = 1;
	}
	yield* this.update_icon(using_power);
	return f.dot;
}, true, { waitfor: false });

// recharger.dm:132
rt.def("/obj/machinery/recharger/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// recharger.dm:136
rt.def("/obj/machinery/recharger/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let E: Value = null, B: Value = null;
	if (!rt.bitAnd(this.stat, 3) && this.anchored) {
		if (rt.istype(this.charging, T("/obj/item/weapon/gun/energy"))) {
			if ((E = this.charging).cell) {
				yield* E.cell.emp_act(severity);
			}
		} else if (rt.istype(this.charging, T("/obj/item/weapon/melee/baton"))) {
			if ((B = this.charging).cell) {
				B.cell.charge = 0;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// recharger.dm:150
rt.def("/obj/machinery/recharger/proc/update_icon", function update_icon(f: Frame, using_power: Value, scan: Value) {
	using_power ??= 0;
	if (rt.bitAnd(this.stat, 3) || !this.anchored) {
		this.icon_state = "rechargeroff";
		return f.dot;
	}
	if (scan) {
		this.icon_state = "rechargeroff";
		return f.dot;
	}
	if (this.panel_open) {
		this.icon_state = "rechargeropen";
		return f.dot;
	}
	if (this.charging) {
		if (using_power) {
			this.icon_state = "recharger1";
		} else {
			this.icon_state = "recharger2";
		}
		return f.dot;
	}
	this.icon_state = "recharger0";
	return f.dot;
});
