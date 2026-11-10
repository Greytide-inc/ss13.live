// Based on /tg/station's code/modules/power/port_gen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10313, "/obj/machinery/power/port_gen", "/obj/machinery/power", {
	active: 0,
	power_gen: 5000,
	recent_fault: 0,
	power_output: 1,
	consumption: 0,
	anchored: 0,
	name: "portable generator",
	desc: "A portable generator for emergency backup power.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "portgen0",
	density: 1,
	use_power: 0,
});

// port_gen.dm:31
rt.def("/obj/machinery/power/port_gen/proc/process", function* process(f: Frame) {
	if (this.active && this.HasFuel() && !this.crit_fail && this.anchored && this.powernet) {
		this.add_avail(this.power_gen * this.power_output);
		yield* this.UseFuel();
		yield* this.updateDialog();
	} else {
		this.active = 0;
		this.icon_state = rt.initial(f, this, "icon_state");
		yield* this.handleInactive();
	}
	return f.dot;
}, true, { waitfor: false });

// port_gen.dm:42
rt.def("/obj/machinery/power/port_gen/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.anchored) return f.dot;
	return f.dot;
}, true);

// port_gen.dm:48
rt.def("/obj/machinery/power/port_gen/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `It is${!this.active ? "n't" : ""} running.`);
	return f.dot;
}, false);

rt.type(10314, "/obj/machinery/power/port_gen/pacman", "/obj/machinery/power/port_gen", {
	sheets: 0,
	max_sheets: 100,
	sheet_name: "",
	sheet_path: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman"),
	sheet_left: 0,
	time_per_sheet: 260,
	current_heat: 0,
	name: "１P.A.C.M.A.N.-type portable generator",
});

// port_gen.dm:63
rt.def("/obj/machinery/power/port_gen/pacman/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.anchored) return f.dot;
	yield* this.connect_to_network();
	return f.dot;
}, true);

// port_gen.dm:68
rt.def("/obj/machinery/power/port_gen/pacman/proc/New", function* New(f: Frame) {
	let B: Value = null, sheet: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(this.board_path, null))).apply_default_parts(this);
	this.sheet_name = (sheet = (yield* new_(this.sheet_path, null))).name;
	return f.dot;
}, true);

rt.type(6764, "/obj/item/weapon/circuitboard/machine/pacman", "/obj/item/weapon/circuitboard/machine", {
	name: "PACMAN-type Generator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/port_gen/pacman"),
	origin_tech: "programming=2;powerstorage=3;plasmatech=3;engineering=3",
	req_components: null,
});

// port_gen.dm:79
rt.def("/obj/item/weapon/circuitboard/machine/pacman/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 1]);
	return f.dot;
});

// port_gen.dm:96
rt.def("/obj/machinery/power/port_gen/pacman/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.DropFuel();
	return (yield* parent_proc());
}, true);

// port_gen.dm:102
rt.def("/obj/machinery/power/port_gen/pacman/proc/RefreshParts", function RefreshParts(f: Frame) {
	let SP: Value = null;
	let temp_rating: Value = 0;
	let consumption_coeff: Value = 0;
	for (SP of each(this.component_parts, T("/obj/item/weapon/stock_parts"))) {
		if (rt.istype(SP, T("/obj/item/weapon/stock_parts/matter_bin"))) {
			this.max_sheets = SP.rating * SP.rating * 50;
		} else if (rt.istype(SP, T("/obj/item/weapon/stock_parts/capacitor"))) {
			temp_rating += SP.rating;
		} else {
			consumption_coeff += SP.rating;
		}
	}
	this.power_gen = round(rt.initial(f, this, "power_gen") * temp_rating * 2);
	this.consumption = consumption_coeff;
	return f.dot;
});

// port_gen.dm:113
rt.def("/obj/machinery/power/port_gen/pacman/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>The generator has ${this.sheets} units of ${this.sheet_name} fuel left, producing ${this.power_gen} per cycle.</span>`);
	if (!this.crit_fail) return f.dot;
	to_chat(user, "<span class='danger'>The generator seems to have broken down.</span>");
	return f.dot;
}, false);

// port_gen.dm:118
rt.def("/obj/machinery/power/port_gen/pacman/proc/HasFuel", function HasFuel(f: Frame) {
	if (this.sheets >= 1 / (this.time_per_sheet / this.power_output) - this.sheet_left) {
		return 1;
	}
	return 0;
});

// port_gen.dm:125
rt.def("/obj/machinery/power/port_gen/pacman/proc/DropFuel", function* DropFuel(f: Frame) {
	let S: Value = null, amount: Value = null;
	if (!this.sheets) return f.dot;
	let fail_safe: Value = 0;
	while (this.sheets > 0 && fail_safe < 100) {
		fail_safe += 1;
		S = (yield* new_(this.sheet_path, this.loc));
		amount = min(this.sheets, S.max_amount);
		S.amount = amount;
		this.sheets -= amount;
	}
	return f.dot;
}, true);

// port_gen.dm:133
rt.def("/obj/machinery/power/port_gen/pacman/proc/UseFuel", function* UseFuel(f: Frame) {
	let temp: Value = null;
	let needed_sheets: Value = 1 / (this.time_per_sheet * this.consumption / this.power_output);
	needed_sheets -= (temp = min(needed_sheets, this.sheet_left));
	this.sheet_left -= temp;
	this.sheets -= round(needed_sheets);
	needed_sheets -= round(needed_sheets);
	if (this.sheet_left <= 0 && this.sheets > 0) {
		this.sheet_left = 1 - needed_sheets;
		this.sheets--;
	}
	let lower_limit: Value = 56 + this.power_output * 10;
	let upper_limit: Value = 76 + this.power_output * 10;
	let bias: Value = 0;
	if (this.power_output > 4) {
		upper_limit = 400;
		bias = this.power_output - this.consumption * (4 - this.consumption);
	}
	if (this.current_heat < lower_limit) {
		this.current_heat += 4 - this.consumption;
	} else {
		if ((this.current_heat += rand(-7 + bias, 7 + bias)) < lower_limit) {
			this.current_heat = lower_limit;
		}
		if (this.current_heat > upper_limit) {
			this.current_heat = upper_limit;
		}
	}
	if (this.current_heat > 300) {
		this.overheat();
		yield* qdel(this);
	}
	return f.dot;
}, true);

// port_gen.dm:165
rt.def("/obj/machinery/power/port_gen/pacman/proc/handleInactive", function* handleInactive(f: Frame) {
	if (!(this.current_heat > 0)) return f.dot;
	this.current_heat = max(this.current_heat - 2, 0);
	yield* this.updateDialog();
	return f.dot;
}, true);

// port_gen.dm:170
rt.def("/obj/machinery/power/port_gen/pacman/proc/overheat", function overheat(f: Frame) {
	explosion(this.loc, 2, 5, 2, -1);
	return f.dot;
});

// port_gen.dm:173
rt.def("/obj/machinery/power/port_gen/pacman/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let addstack: Value = null, amount: Value = null;
	if (rt.op(f, "IsType", [], [O, this.sheet_path])) {
		addstack = O;
		if ((amount = min(this.max_sheets - this.sheets, addstack.amount)) < 1) {
			to_chat(user, `<span class='notice'>The ${this.name} is full!</span>`);
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You add ${amount} sheets to the ${this.name}.</span>`);
		this.sheets += amount;
		yield* addstack.use(amount);
		yield* this.updateUsrDialog();
		return f.dot;
	} else if (!this.active) {
		if (yield* this.exchange_parts(user, O)) {
			return f.dot;
		}
		if (rt.istype(O, T("/obj/item/weapon/wrench"))) {
			if (!this.anchored && !this.isinspace()) {
				yield* this.connect_to_network();
				to_chat(user, "<span class='notice'>You secure the generator to the floor.</span>");
				this.anchored = 1;
			} else if (this.anchored) {
				yield* this.disconnect_from_network();
				to_chat(user, "<span class='notice'>You unsecure the generator from the floor.</span>");
				this.anchored = 0;
			}
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			return f.dot;
		} else if (rt.istype(O, T("/obj/item/weapon/screwdriver"))) {
			this.panel_open = (!this.panel_open ? 1 : 0);
			playsound(this.loc, O.usesound, 50, 1);
			if (this.panel_open) {
				to_chat(user, "<span class='notice'>You open the access panel.</span>");
			} else {
				to_chat(user, "<span class='notice'>You close the access panel.</span>");
			}
			return f.dot;
		} else if (yield* this.default_deconstruction_crowbar(O)) {
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// port_gen.dm:215
rt.def("/obj/machinery/power/port_gen/pacman/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	yield* this.emp_act(1);
	return f.dot;
}, true);

// port_gen.dm:220
rt.def("/obj/machinery/power/port_gen/pacman/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* parent_proc();
	if (!this.anchored) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// port_gen.dm:227
rt.def("/obj/machinery/power/port_gen/pacman/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// port_gen.dm:230
rt.def("/obj/machinery/power/port_gen/pacman/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// port_gen.dm:233
rt.def("/obj/machinery/power/port_gen/pacman/proc/interact", function* interact(f: Frame, user: Value) {
	let stack_percent: Value = null;
	if (get_dist(this, user) > 1) {
		if (!rt.istype(user, T("/mob/living/silicon/ai"))) {
			yield* user.unset_machine();
			rt.op(f, "Browse", [], [user, null, "window=port_gen"], false);
			return f.dot;
		}
	}
	yield* user.set_machine(this);
	let dat: Value = `<b>${this.name}</b><br>`;
	if (this.active) {
		dat += fmt("Generator: <A href='?src=＃;action=disable'>On</A><br>", [this]);
	} else {
		dat += fmt("Generator: <A href='?src=＃;action=enable'>Off</A><br>", [this]);
	}
	dat += fmt("＀: ＀ - <A href='?src=＃;action=eject'>Eject</A><br>", [capitalize(this.sheet_name), this.sheets, this]);
	dat += `Current stack: ${(stack_percent = round(this.sheet_left * 100, 1))}% <br>`;
	dat += fmt("Power output: <A href='?src=＃;action=lower_power'>-</A> ＀ <A href='?src=＃;action=higher_power'>+</A><br>", [this, this.power_gen * this.power_output, this]);
	dat += `Power current: ${this.powernet === null ? "Unconnected" : `${this.avail()}`}<br>`;
	dat += `Heat: ${this.current_heat}<br>`;
	dat += fmt("<br><A href='?src=＃;action=close'>Close</A>", [this]);
	rt.op(f, "Browse", [], [user, dat, "window=port_gen"], false);
	onclose(user, "port_gen");
	return f.dot;
}, true);

// port_gen.dm:257
rt.def("/obj/machinery/power/port_gen/pacman/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	if (!rt.at(href_list, "action")) return f.dot;
	if (rt.at(href_list, "action") == "enable") {
		if (!this.active && this.HasFuel() && !this.crit_fail) {
			this.active = 1;
			this.icon_state = "portgen1";
			yield* this.updateUsrDialog();
		}
	}
	if (rt.at(href_list, "action") == "disable") {
		if (this.active) {
			this.active = 0;
			this.icon_state = "portgen0";
			yield* this.updateUsrDialog();
		}
	}
	if (rt.at(href_list, "action") == "eject") {
		if (!this.active) {
			yield* this.DropFuel();
			yield* this.updateUsrDialog();
		}
	}
	if (rt.at(href_list, "action") == "lower_power") {
		if (this.power_output > 1) {
			this.power_output--;
			yield* this.updateUsrDialog();
		}
	}
	if (rt.at(href_list, "action") == "higher_power") {
		if (this.power_output < 4 || this.emagged) {
			this.power_output++;
			yield* this.updateUsrDialog();
		}
	}
	if (rt.at(href_list, "action") != "close") return f.dot;
	rt.op(f, "Browse", [], [f.usr, null, "window=port_gen"], false);
	yield* f.usr.unset_machine();
	return f.dot;
}, true);

rt.type(10315, "/obj/machinery/power/port_gen/pacman/super", "/obj/machinery/power/port_gen/pacman", {
	sheet_path: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	power_gen: 15000,
	time_per_sheet: 85,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman/super"),
	name: "１S.U.P.E.R.P.A.C.M.A.N.-type portable generator",
	icon_state: "portgen1",
});

// port_gen.dm:297
rt.def("/obj/machinery/power/port_gen/pacman/super/proc/overheat", function overheat(f: Frame) {
	explosion(this.loc, 3, 3, 3, -1);
	return f.dot;
});

rt.type(10316, "/obj/machinery/power/port_gen/pacman/mrs", "/obj/machinery/power/port_gen/pacman", {
	sheet_path: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	power_gen: 40000,
	time_per_sheet: 80,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/pacman/mrs"),
	name: "１M.R.S.P.A.C.M.A.N.-type portable generator",
	icon_state: "portgen2",
});

// port_gen.dm:308
rt.def("/obj/machinery/power/port_gen/pacman/mrs/proc/overheat", function overheat(f: Frame) {
	explosion(this.loc, 4, 4, 4, -1);
	return f.dot;
});
