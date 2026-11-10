// Based on /tg/station's code/modules/reagents/chemistry/machinery/chem_heater.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10978, "/obj/machinery/chem_heater", "/obj/machinery", {
	beaker: null,
	target_temperature: 300,
	heater_coefficient: 0.1,
	on: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 40,
	name: "chemical heater",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "mixer0b",
	resistance_flags: 34,
});

// chem_heater.dm:16
rt.def("/obj/machinery/chem_heater/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/chem_heater"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6776, "/obj/item/weapon/circuitboard/machine/chem_heater", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Chemical Heater (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_heater"),
	origin_tech: "programming=2;engineering=2;biotech=2",
});

// chem_heater.dm:24
rt.def("/obj/item/weapon/circuitboard/machine/chem_heater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// chem_heater.dm:30
rt.def("/obj/machinery/chem_heater/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	this.heater_coefficient = 0.1;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		this.heater_coefficient *= M.rating;
	}
	return f.dot;
});

// chem_heater.dm:34
rt.def("/obj/machinery/chem_heater/proc/process", function* process(f: Frame) {
	yield* parent_proc();
	if (rt.bitAnd(this.stat, 2)) {
		return f.dot;
	}
	if (!this.on) return f.dot;
	if (!this.beaker) return f.dot;
	if (this.beaker.reagents.chem_temp > this.target_temperature) {
		this.beaker.reagents.chem_temp += min(-1, (this.target_temperature - this.beaker.reagents.chem_temp) * this.heater_coefficient);
	}
	if (this.beaker.reagents.chem_temp < this.target_temperature) {
		this.beaker.reagents.chem_temp += max(1, (this.target_temperature - this.beaker.reagents.chem_temp) * this.heater_coefficient);
	}
	this.beaker.reagents.chem_temp = round(this.beaker.reagents.chem_temp);
	yield* this.beaker.reagents.handle_reactions();
	return f.dot;
}, true, { waitfor: false });

// chem_heater.dm:48
rt.def("/obj/machinery/chem_heater/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "mixer0b", "mixer0b", I)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers")) && rt.bitAnd(I.container_type, OPENCONTAINER)) {
		f.dot = 1;
		if (this.beaker) {
			to_chat(user, "<span class='warning'>A beaker is already loaded into the machine!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.beaker = I;
		I.loc = this;
		to_chat(user, "<span class='notice'>You add the beaker to the machine.</span>");
		this.icon_state = "mixer1b";
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// chem_heater.dm:73
rt.def("/obj/machinery/chem_heater/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* this.eject_beaker();
	return f.dot;
}, true);

// chem_heater.dm:77
rt.def("/obj/machinery/chem_heater/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "chem_heater", this.name, 275, 400, master_ui, state))).open();
	return f.dot;
}, true);

// chem_heater.dm:83
rt.def("/obj/machinery/chem_heater/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, R: Value = null;
	let $e: any;
	rt.setAt((data = list()), "targetTemp", this.target_temperature);
	rt.setAt(data, "isActive", this.on);
	let $0: any = data;
	let $1: any = "isBeakerLoaded";
	rt.setAt($0, $1, this.beaker ? 1 : 0);
	rt.setAt(data, "currentTemp", this.beaker ? this.beaker.reagents.chem_temp : null);
	rt.setAt(data, "beakerCurrentVolume", this.beaker ? this.beaker.reagents.total_volume : null);
	rt.setAt(data, "beakerMaxVolume", this.beaker ? this.beaker.volume : null);
	let beakerContents: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (this.beaker) {
		for (R of each(this.beaker.reagents.reagent_list, T("/datum/reagent"))) {
			beakerContents.Add(list(rt.alist(f, ["name", R.name, "volume", R.volume])));
		}
	}
	rt.setAt(data, "beakerContents", beakerContents);
	return data;
});

// chem_heater.dm:100
rt.def("/obj/machinery/chem_heater/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let target: Value = null, adjust: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "power") {
		this.on = (!this.on ? 1 : 0);
		f.dot = 1;
	} else if (action === "temperature") {
		target = rt.at(params, "target");
		adjust = text2num(rt.at(params, "adjust"));
		if (target == "input") {
			if ((target = (yield* g.op(f, "Prompt", [33], [null, this.target_temperature, this.name, "New target temperature:", null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (adjust) {
			target = this.target_temperature + adjust;
		} else if (text2num(target) !== null) {
			target = text2num(target);
			f.dot = 1;
		}
		if (f.dot) {
			this.target_temperature = max(0, min(target, 1000));
		}
	} else if (action === "eject") {
		this.on = 0;
		yield* this.eject_beaker();
		f.dot = 1;
	}
	return f.dot;
}, true);

// chem_heater.dm:127
rt.def("/obj/machinery/chem_heater/proc/eject_beaker", function* eject_beaker(f: Frame) {
	if (!this.beaker) return f.dot;
	this.beaker.loc = rt.getStep(f, this, 0);
	yield* this.beaker.reagents.handle_reactions();
	this.beaker = null;
	this.icon_state = "mixer0b";
	return f.dot;
}, true);
