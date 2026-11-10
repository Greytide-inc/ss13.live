// Based on /tg/station's code/game/machinery/rechargestation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10813, "/obj/machinery/recharge_station", "/obj/machinery", {
	recharge_speed: null,
	repairs: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 1000,
	state_open: 1,
	name: "cyborg recharging station",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "borgcharger0",
	density: 0,
	req_access: null,
});

// rechargestation.dm:10
rt.def("/obj/machinery/recharge_station/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(29);
	return f.dot;
});

// rechargestation.dm:16
rt.def("/obj/machinery/recharge_station/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/cyborgrecharger"), null))).apply_default_parts(this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(6727, "/obj/item/weapon/circuitboard/machine/cyborgrecharger", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	def_components: null,
	name: "Cyborg Recharger (Machine Board)",
	build_path: rt.typePath("/obj/machinery/recharge_station"),
	origin_tech: "powerstorage=3;engineering=3",
});

// rechargestation.dm:25
rt.def("/obj/item/weapon/circuitboard/machine/cyborgrecharger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 2, T("/obj/item/weapon/stock_parts/cell"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/cell"), T("/obj/item/weapon/stock_parts/cell/high")]);
	return f.dot;
});

// rechargestation.dm:35
rt.def("/obj/machinery/recharge_station/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null, M: Value = null;
	this.recharge_speed = 0;
	this.repairs = 0;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		this.recharge_speed += C.rating * 100;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		this.repairs += M.rating - 1;
	}
	C = null;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/cell"))) {
		this.recharge_speed *= C.maxcharge / 10000;
	}
	return f.dot;
});

// rechargestation.dm:43
rt.def("/obj/machinery/recharge_station/proc/process", function* process(f: Frame) {
	if (!this.is_operational()) {
		return f.dot;
	}
	if (this.occupant) {
		yield* this.process_occupant();
	}
	return 1;
}, true, { waitfor: false });

// rechargestation.dm:51
rt.def("/obj/machinery/recharge_station/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.stat) {
		return f.dot;
	}
	yield* this.open_machine();
	return f.dot;
}, true);

// rechargestation.dm:56
rt.def("/obj/machinery/recharge_station/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!rt.bitAnd(this.stat, 3)) {
		if (this.occupant) {
			yield* this.occupant.emp_act(severity);
		}
		yield* this.open_machine();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// rechargestation.dm:63
rt.def("/obj/machinery/recharge_station/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// rechargestation.dm:66
rt.def("/obj/machinery/recharge_station/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// rechargestation.dm:70
rt.def("/obj/machinery/recharge_station/proc/attackby", function* attackby(f: Frame, P: Value, user: Value, params: Value) {
	if (this.state_open) {
		if (this.default_deconstruction_screwdriver(user, "borgdecon2", "borgcharger0", P)) {
			return f.dot;
		}
	}
	if (yield* this.exchange_parts(user, P)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(P)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(P)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// rechargestation.dm:84
rt.def("/obj/machinery/recharge_station/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc(user, 1, { set_machine: 0 })) {
		return f.dot;
	}
	yield* this.toggle_open();
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// rechargestation.dm:92
rt.def("/obj/machinery/recharge_station/proc/toggle_open", function* toggle_open(f: Frame) {
	if (this.state_open) {
		yield* this.close_machine();
	} else {
		yield* this.open_machine();
	}
	return f.dot;
}, true);

// rechargestation.dm:97
rt.def("/obj/machinery/recharge_station/proc/open_machine", function* open_machine(f: Frame) {
	yield* parent_proc();
	this.use_power = 1;
	return f.dot;
}, true);

// rechargestation.dm:101
rt.def("/obj/machinery/recharge_station/proc/close_machine", function* close_machine(f: Frame) {
	let R: Value = null;
	let $e: any;
	if (this.panel_open) return f.dot;
	rt.forList(f, 0, this.loc, T("/mob/living/silicon/robot"));
	if (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* R.forceMove(this);
		this.occupant = R;
		this.use_power = 2;
		yield* this.add_fingerprint(R);
	}
	rt.endFor(f, 0);
	this.state_open = 0;
	this.density = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// rechargestation.dm:113
rt.def("/obj/machinery/recharge_station/proc/update_icon", function update_icon(f: Frame) {
	if (this.is_operational()) {
		if (this.state_open) {
			this.icon_state = "borgcharger0";
		} else {
			this.icon_state = this.occupant ? "borgcharger1" : "borgcharger2";
		}
	} else {
		this.icon_state = this.state_open ? "borgcharger-u0" : "borgcharger-u1";
	}
	return f.dot;
});

// rechargestation.dm:122
rt.def("/obj/machinery/recharge_station/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// rechargestation.dm:127
rt.def("/obj/machinery/recharge_station/proc/process_occupant", function* process_occupant(f: Frame) {
	if (!this.occupant) return f.dot;
	let R: Value = this.occupant;
	yield* this.restock_modules();
	if (this.repairs) {
		yield* R.heal_bodypart_damage(this.repairs, this.repairs - 1);
	}
	if (!R.cell) return f.dot;
	R.cell.charge = min(R.cell.charge + this.recharge_speed, R.cell.maxcharge);
	return f.dot;
}, true);

// rechargestation.dm:136
rt.def("/obj/machinery/recharge_station/proc/restock_modules", function* restock_modules(f: Frame) {
	let R: Value = null;
	if (!this.occupant) return f.dot;
	if (!((R = this.occupant) && R.module)) return f.dot;
	let coeff: Value = this.recharge_speed * 0.005;
	yield* R.module.respawn_consumable(R, coeff);
	return f.dot;
}, true);
