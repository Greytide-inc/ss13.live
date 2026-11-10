// Based on /tg/station's code/modules/reagents/chemistry/machinery/chem_dispenser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10679, "/obj/machinery/chem_dispenser", "/obj/machinery", {
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/high"),
	cell: null,
	powerefficiency: 0.01,
	amount: 30,
	recharged: 0,
	recharge_delay: 5,
	beaker_overlay: null,
	beaker: null,
	dispensable_reagents: null,
	emagged_reagents: null,
	anchored: 1,
	name: "chem dispenser",
	desc: "Creates and dispenses chemicals.",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "dispenser",
	use_power: 1,
	idle_power_usage: 40,
	interact_offline: 1,
	resistance_flags: 34,
});

// chem_dispenser.dm:57
rt.def("/obj/machinery/chem_dispenser/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.cell = (yield* new_(this.cell_type));
	yield* this.recharge();
	this.dispensable_reagents = (yield* sortList(this.dispensable_reagents));
	return f.dot;
}, true);

// chem_dispenser.dm:64
rt.def("/obj/machinery/chem_dispenser/proc/process", function* process(f: Frame) {
	if (this.recharged < 0) {
		yield* this.recharge();
		this.recharged = this.recharge_delay;
	} else {
		this.recharged -= 1;
	}
	return f.dot;
}, true, { waitfor: false });

// chem_dispenser.dm:71
rt.def("/obj/machinery/chem_dispenser/proc/recharge", function* recharge(f: Frame) {
	let usedpower: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!(usedpower = (yield* this.cell.give(1 / this.powerefficiency)))) return f.dot;
	yield* this.use_power(2500);
	return f.dot;
}, true);

// chem_dispenser.dm:78
rt.def("/obj/machinery/chem_dispenser/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) {
		to_chat(user, fmt("<span class='warning'>＄！ has no functional safeties to emag.</span>", [this]));
		return f.dot;
	}
	to_chat(user, fmt("<span class='notice'>You short out ％！'s safeties.</span>", [this]));
	(rt.modSrcVar(f, "dispensable_reagents", this.emagged_reagents, rt.bitOr));
	this.emagged = 1;
	return f.dot;
});

// chem_dispenser.dm:85
rt.def("/obj/machinery/chem_dispenser/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	if (!(severity < 3)) return f.dot;
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// chem_dispenser.dm:89
rt.def("/obj/machinery/chem_dispenser/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	parent_proc();
	if (!this.beaker) return f.dot;
	this.beaker.ex_act(severity, target);
	return f.dot;
}, false);

// chem_dispenser.dm:94
rt.def("/obj/machinery/chem_dispenser/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* parent_proc();
	if (A != this.beaker) return f.dot;
	this.beaker = null;
	this.cut_overlays();
	return f.dot;
}, true);

// chem_dispenser.dm:101
rt.def("/obj/machinery/chem_dispenser/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "chem_dispenser", this.name, 550, 550, master_ui, state))).open();
	return f.dot;
}, true);

// chem_dispenser.dm:107
rt.def("/obj/machinery/chem_dispenser/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, R: Value = null, re: Value = null, temp: Value = null;
	let $e: any;
	rt.setAt((data = list()), "amount", this.amount);
	let $0: any = data;
	let $1: any = "energy";
	rt.setAt($0, $1, this.cell.charge ? this.cell.charge * this.powerefficiency : "0");
	rt.setAt(data, "maxEnergy", this.cell.maxcharge * this.powerefficiency);
	rt.setAt(data, "isBeakerLoaded", this.beaker ? 1 : 0);
	let beakerContents: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	let beakerCurrentVolume: Value = 0;
	if (this.beaker && this.beaker.reagents && rt.len(f, this.beaker.reagents.reagent_list)) {
		for (R of each(this.beaker.reagents.reagent_list, T("/datum/reagent"))) {
			beakerContents.Add(list(rt.alist(f, ["name", R.name, "volume", R.volume])));
			beakerCurrentVolume += R.volume;
		}
	}
	rt.setAt(data, "beakerContents", beakerContents);
	if (this.beaker) {
		rt.setAt(data, "beakerCurrentVolume", beakerCurrentVolume);
		rt.setAt(data, "beakerMaxVolume", this.beaker.volume);
		rt.setAt(data, "beakerTransferAmounts", this.beaker.possible_transfer_amounts);
	} else {
		rt.setAt(data, "beakerCurrentVolume", null);
		rt.setAt(data, "beakerMaxVolume", null);
		rt.setAt(data, "beakerTransferAmounts", null);
	}
	let chemicals: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	for (re of each(this.dispensable_reagents)) {
		if (temp = rt.index(GLOB.chemical_reagents_list, re)) {
			chemicals.Add(list(rt.alist(f, ["title", temp.name, "id", temp.id])));
		}
	}
	rt.setAt(data, "chemicals", chemicals);
	return data;
});

// chem_dispenser.dm:139
rt.def("/obj/machinery/chem_dispenser/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let target: Value = null, reagent: Value = null, R: Value = null, free: Value = null, actual: Value = null, amount: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "amount") {
		if (rt.isIn(f, (target = text2num(rt.at(params, "target"))), this.beaker.possible_transfer_amounts)) {
			this.amount = target;
			f.dot = 1;
		}
	} else if (action === "dispense") {
		reagent = rt.at(params, "reagent");
		if (this.beaker && this.dispensable_reagents.Find(reagent)) {
			R = this.beaker.reagents;
			free = R.maximum_volume - R.total_volume;
			actual = min(this.amount, this.cell.charge * this.powerefficiency * 10, free);
			yield* R.add_reagent(reagent, actual);
			yield* this.cell.use(actual / 10 / this.powerefficiency);
			f.dot = 1;
		}
	} else if (action === "remove") {
		amount = text2num(rt.at(params, "amount"));
		if (rt.isIn(f, (this.beaker && amount), this.beaker.possible_transfer_amounts)) {
			yield* this.beaker.reagents.remove_all(amount);
			f.dot = 1;
		}
	} else if (action === "eject") {
		if (!this.beaker) return f.dot;
		yield* this.beaker.forceMove(this.loc);
		this.beaker = null;
		this.cut_overlays();
		f.dot = 1;
	}
	return f.dot;
}, true);

// chem_dispenser.dm:170
rt.def("/obj/machinery/chem_dispenser/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let B: Value = null;
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers")) && rt.bitAnd(I.container_type, OPENCONTAINER)) {
		B = I;
		f.dot = 1;
		if (this.beaker) {
			to_chat(user, "<span class='warning'>A container is already loaded into the machine!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.beaker = B;
		this.beaker.loc = this;
		to_chat(user, fmt("<span class='notice'>You add ％！ to the machine.</span>", [B]));
		this.beaker_overlay = (this.beaker_overlay || mutable_appearance(this.icon, "disp_beaker"));
		this.beaker_overlay.pixel_x = rand(-10, 5);
		this.add_overlay(this.beaker_overlay);
	} else {
		if (user.a_intent != "harm" && !rt.istype(I, T("/obj/item/weapon/card/emag"))) {
			to_chat(user, fmt("<span class='warning'>You can't load ％！ into the machine!</span>", [I]));
			return (yield* parent_proc());
		}
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// chem_dispenser.dm:200
rt.def("/obj/machinery/chem_dispenser/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let i: Value = null;
	let $e: any;
	let R: Value = list();
	let total: Value = min(rand(7, 15), Floor(this.cell.charge * this.powerefficiency));
	let Q: Value = (yield* new_(T("/datum/reagents"), total * 10));
	if (this.beaker && this.beaker.reagents) {
		R += this.beaker.reagents;
	}
	rt.forRange(f, 0, 1, total, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* Q.add_reagent(pick(this.dispensable_reagents), 10);
	}
	rt.endFor(f, 0);
	R += Q;
	yield* chem_splash(rt.getStep(f, this, 0), 3, R);
	if (this.beaker && this.beaker.reagents) {
		yield* this.beaker.reagents.remove_all();
	}
	yield* this.cell.use(total / this.powerefficiency);
	yield* this.cell.emp_act();
	this.visible_message(`<span class='danger'> The ${this} malfunctions, spraying chemicals everywhere!</span>`);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10680, "/obj/machinery/chem_dispenser/constructable", "/obj/machinery/chem_dispenser", {
	dispensable_reagent_tiers: null,
	powerefficiency: 0.001,
	amount: 5,
	recharge_delay: 30,
	dispensable_reagents: null,
	name: "portable chem dispenser",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "minidispenser",
});

// chem_dispenser.dm:223
rt.def("/obj/machinery/chem_dispenser/constructable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.dispensable_reagents = list();
	this.dispensable_reagent_tiers = list(list("hydrogen", "oxygen", "silicon", "phosphorus", "sulfur", "carbon", "nitrogen", "water"), list("lithium", "sugar", "sacid", "copper", "mercury", "sodium", "iodine", "bromine"), list("ethanol", "chlorine", "potassium", "aluminium", "radium", "fluorine", "iron", "welding_fuel", "silver", "stable_plasma"), list("oil", "ash", "acetone", "saltpetre", "ammonia", "diethylamine"));
	return f.dot;
});

// chem_dispenser.dm:268
rt.def("/obj/machinery/chem_dispenser/constructable/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/chem_dispenser"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6775, "/obj/item/weapon/circuitboard/machine/chem_dispenser", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	def_components: null,
	name: "Portable Chem Dispenser (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_dispenser/constructable"),
	origin_tech: "materials=4;programming=4;plasmatech=4;biotech=3",
});

// chem_dispenser.dm:276
rt.def("/obj/item/weapon/circuitboard/machine/chem_dispenser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/cell"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/cell"), T("/obj/item/weapon/stock_parts/cell/high")]);
	return f.dot;
});

// chem_dispenser.dm:287
rt.def("/obj/machinery/chem_dispenser/constructable/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let i: Value = null, _P: Value = null, M: Value = null, C: Value = null;
	let time: Value = 0;
	for (_P of each(this.component_parts, T("/obj/item/weapon/stock_parts/cell"))) {
		this.cell = _P;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		time += M.rating;
	}
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		time += C.rating;
	}
	this.recharge_delay /= time / 2;
	M = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		i = 1;
		while (i <= M.rating) {
			(rt.modSrcVar(f, "dispensable_reagents", rt.index(this.dispensable_reagent_tiers, i), rt.bitOr));
			i++;
		}
	}
	this.dispensable_reagents = (yield* sortList(this.dispensable_reagents));
	return f.dot;
}, true);

// chem_dispenser.dm:300
rt.def("/obj/machinery/chem_dispenser/constructable/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "minidispenser-o", "minidispenser", I)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(10683, "/obj/machinery/chem_dispenser/mutagen", "/obj/machinery/chem_dispenser", {
	dispensable_reagents: null,
	emagged_reagents: null,
	name: "mutagen dispenser",
	desc: "Creates and dispenses mutagen.",
});

// chem_dispenser.dm:385
rt.def("/obj/machinery/chem_dispenser/mutagen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.dispensable_reagents = list("mutagen");

	this.emagged_reagents = list("plasma");
	return f.dot;
});
