// Based on /tg/station's code/modules/power/generator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10312, "/obj/machinery/power/generator", "/obj/machinery/power", {
	cold_circ: null,
	hot_circ: null,
	cold_dir: 8,
	hot_dir: 4,
	lastgen: 0,
	lastgenlev: -1,
	lastcirc: "00",
	anchored: 1,
	name: "thermoelectric generator",
	desc: "It's a high efficiency thermoelectric generator.",
	icon_state: "teg",
	density: 1,
	use_power: 0,
});

// generator.dm:31
rt.def("/obj/machinery/power/generator/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let circpath: Value = null;
	f.dot = (yield* parent_proc());
	this.cold_circ = rt.locateIn(f, (circpath = T("/obj/machinery/atmospherics/components/binary/circulator")), rt.getStep(f, this, this.cold_dir));
	this.hot_circ = rt.locateIn(f, circpath, rt.getStep(f, this, this.hot_dir));
	yield* this.connect_to_network();
	GLOB.SSair.atmos_machinery += this;
	if (this.cold_circ) {
		if (this.cold_dir === 4) {
			this.cold_circ.side = 2;
		} else if (this.cold_dir === 8) {
			this.cold_circ.side = 1;
		}
		yield* this.cold_circ.update_icon();
	}
	if (this.hot_circ) {
		if (this.hot_dir === 4) {
			this.hot_circ.side = 2;
		} else if (this.hot_dir === 8) {
			this.hot_circ.side = 1;
		}
		yield* this.hot_circ.update_icon();
	}
	if (!this.cold_circ || !this.hot_circ) {
		(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// generator.dm:60
rt.def("/obj/machinery/power/generator/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSair.atmos_machinery -= this;
	return (yield* parent_proc());
}, true);

// generator.dm:65
rt.def("/obj/machinery/power/generator/proc/update_icon", function update_icon(f: Frame) {
	let L: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		this.cut_overlays();
	} else {
		this.cut_overlays();
		if ((L = min(round(this.lastgenlev / 100000), 11)) != 0) {
			this.add_overlay(image(rt.rsc("icons/obj/power.dmi"), `teg-op${L}`));
		}
		this.add_overlay(`teg-oc${this.lastcirc}`);
	}
	return f.dot;
});

// generator.dm:81
rt.def("/obj/machinery/power/generator/proc/process_atmos", function* process_atmos(f: Frame) {
	let cold_air: Value = null, hot_air: Value = null, cold_air_heat_capacity: Value = null, hot_air_heat_capacity: Value = null, delta_temperature: Value = null, efficiency: Value = null, energy_transfer: Value = null, heat: Value = null, hot_circ_air1: Value = null, cold_circ_air1: Value = null, circ: Value = null;
	let $0: any;
	if (!this.cold_circ || !this.hot_circ) {
		return f.dot;
	}
	if (this.powernet) {
		cold_air = (yield* this.cold_circ.return_transfer_air());
		hot_air = (yield* this.hot_circ.return_transfer_air());
		if (cold_air && hot_air) {
			cold_air_heat_capacity = cold_air.heat_capacity();
			hot_air_heat_capacity = hot_air.heat_capacity();
			if ((delta_temperature = hot_air.temperature - cold_air.temperature) > 0 && cold_air_heat_capacity > 0 && hot_air_heat_capacity > 0) {
				efficiency = 0.65;
				energy_transfer = delta_temperature * hot_air_heat_capacity * cold_air_heat_capacity / (hot_air_heat_capacity + cold_air_heat_capacity);
				heat = energy_transfer * (1 - efficiency);
				this.lastgen += energy_transfer * efficiency;
				hot_air.temperature = hot_air.temperature - energy_transfer / hot_air_heat_capacity;
				cold_air.temperature = cold_air.temperature + heat / cold_air_heat_capacity;
			}
		}
		if (hot_air) {
			yield* (hot_circ_air1 = rt.index(this.hot_circ.airs, 1)).merge(hot_air);
		}
		if (cold_air) {
			yield* (cold_circ_air1 = rt.index(this.cold_circ.airs, 1)).merge(cold_air);
		}
		yield* this.update_icon();
	}
	if (this.cold_circ && this.cold_circ.last_pressure_delta > 0) {
		$0 = "1";
	} else {
		$0 = "0";
	}
	if ((circ = `${$0}${this.hot_circ && this.hot_circ.last_pressure_delta > 0 ? "1" : "0"}`) != this.lastcirc) {
		this.lastcirc = circ;
		yield* this.update_icon();
	}
	yield* this.updateDialog();
	return f.dot;
}, true);

// generator.dm:141
rt.def("/obj/machinery/power/generator/proc/process", function process(f: Frame) {
	let power_output: Value = null;
	this.add_avail((power_output = round(this.lastgen / 10)));
	this.lastgenlev = power_output;
	this.lastgen -= power_output;
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// generator.dm:148
rt.def("/obj/machinery/power/generator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		rt.op(f, "Browse", [], [user, null, "window=teg"], false);
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// generator.dm:154
rt.def("/obj/machinery/power/generator/proc/get_menu", function get_menu(f: Frame, include_link: Value) {
	let cold_circ_air1: Value = null, cold_circ_air2: Value = null, hot_circ_air1: Value = null, hot_circ_air2: Value = null, displaygen: Value = null;
	include_link ??= 1;
	let t: Value = "";
	if (!this.powernet) {
		t += "<span class='bad'>Unable to connect to the power network!</span>";
	} else if (this.cold_circ && this.hot_circ) {
		cold_circ_air1 = rt.index(this.cold_circ.airs, 1);
		cold_circ_air2 = rt.index(this.cold_circ.airs, 2);
		hot_circ_air1 = rt.index(this.hot_circ.airs, 1);
		hot_circ_air2 = rt.index(this.hot_circ.airs, 2);
		t += "<div class='statusDisplay'>";
		if ((displaygen = this.lastgenlev) < 1000000) {
			displaygen /= 1000;
			t += `Output: ${round(displaygen, 0.01)} kW`;
		} else {
			displaygen /= 1000000;
			t += `Output: ${round(displaygen, 0.01)} MW`;
		}
		t += "<BR>";
		t += "<B><font color='blue'>Cold loop</font></B><BR>";
		t += `Temperature Inlet: ${round(cold_circ_air2.temperature, 0.1)} K / Outlet: ${round(cold_circ_air1.temperature, 0.1)} K<BR>`;
		t += `Pressure Inlet: ${round(cold_circ_air2.return_pressure(), 0.1)} kPa /  Outlet: ${round(cold_circ_air1.return_pressure(), 0.1)} kPa<BR>`;
		t += "<B><font color='red'>Hot loop</font></B><BR>";
		t += `Temperature Inlet: ${round(hot_circ_air2.temperature, 0.1)} K / Outlet: ${round(hot_circ_air1.temperature, 0.1)} K<BR>`;
		t += `Pressure Inlet: ${round(hot_circ_air2.return_pressure(), 0.1)} kPa / Outlet: ${round(hot_circ_air1.return_pressure(), 0.1)} kPa<BR>`;
		t += "</div>";
	} else {
		t += "<span class='bad'>Unable to locate all parts!</span>";
	}
	if (include_link) {
		t += fmt("<BR><A href='?src=＃;close=1'>Close</A>", [this]);
	}
	return t;
});

// generator.dm:193
rt.def("/obj/machinery/power/generator/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	yield* user.set_machine(this);
	(popup = (yield* new_(T("/datum/browser"), user, "teg", "Thermo-Electric Generator", 460, 300))).set_content(this.get_menu());
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return 1;
}, true);

// generator.dm:202
rt.def("/obj/machinery/power/generator/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=teg"], false);
		yield* f.usr.unset_machine();
		return 0;
	}
	return 1;
}, true);

// generator.dm:212
rt.def("/obj/machinery/power/generator/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});
