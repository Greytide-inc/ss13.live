// Based on /tg/station's code/modules/power/turbine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10325, "/obj/machinery/power/compressor", "/obj/machinery/power", {
	turbine: null,
	gas_contained: null,
	inturf: null,
	starter: 0,
	rpm: 0,
	rpmtarget: 0,
	capacity: 1000000,
	comp_id: 0,
	efficiency: null,
	anchored: 1,
	CanAtmosPass: -2,
	name: "compressor",
	desc: "The compressor stage of a gas turbine generator.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "compressor",
	density: 1,
	resistance_flags: 2,
});

// turbine.dm:72
rt.def("/obj/machinery/power/compressor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/power_compressor"), null))).apply_default_parts(this);
	this.gas_contained = (yield* new_(T("/datum/gas_mixture")));
	this.inturf = rt.getStep(f, this, this.dir);
	return f.dot;
}, true);

rt.type(6770, "/obj/item/weapon/circuitboard/machine/power_compressor", "/obj/item/weapon/circuitboard/machine", {
	name: "Power Compressor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/compressor"),
	origin_tech: "programming=4;powerstorage=4;engineering=4",
	req_components: null,
});

// turbine.dm:84
rt.def("/obj/item/weapon/circuitboard/machine/power_compressor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/manipulator"), 6]);
	return f.dot;
});

// turbine.dm:89
rt.def("/obj/machinery/power/compressor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.locate_machinery();
	if (this.turbine) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
}, true);

// turbine.dm:107
rt.def("/obj/machinery/power/compressor/proc/locate_machinery", function locate_machinery(f: Frame) {
	if (this.turbine) {
		return f.dot;
	}
	this.turbine = rt.locateIn(f, T("/obj/machinery/power/turbine"), rt.getStep(f, this, rt.getDir(f, this.inturf, this)));
	if (!this.turbine) return f.dot;
	this.turbine.locate_machinery();
	return f.dot;
});

// turbine.dm:113
rt.def("/obj/machinery/power/compressor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let E: Value = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		E += M.rating;
	}
	this.efficiency = E / 6;
	return f.dot;
});

// turbine.dm:118
rt.def("/obj/machinery/power/compressor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, rt.initial(f, this, "icon_state"), rt.initial(f, this, "icon_state"), I)) {
		return f.dot;
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		this.turbine = null;
		this.inturf = rt.getStep(f, this, this.dir);
		this.locate_machinery();
		if (this.turbine) {
			to_chat(user, "<span class='notice'>Turbine connected.</span>");
			(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		} else {
			to_chat(user, "<span class='alert'>Turbine not connected.</span>");
			(rt.modSrcVar(f, "stat", 1, rt.bitOr));
		}
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	yield* this.default_deconstruction_crowbar(I);
	return f.dot;
}, true);

// turbine.dm:139
rt.def("/obj/machinery/power/compressor/proc/process", function* process(f: Frame) {
	if (!this.turbine) {
		this.stat = 1;
	}
	if (rt.bitAnd(this.stat, 1) || this.panel_open) {
		return f.dot;
	}
	if (!this.starter) {
		return f.dot;
	}
	this.cut_overlays();
	this.rpm = 0.9 * this.rpm + 0.1 * this.rpmtarget;
	let environment: Value = this.inturf.return_air();
	let transfer_moles: Value = environment.total_moles() / 10;
	let removed: Value = (yield* this.inturf.remove_air(transfer_moles));
	yield* this.gas_contained.merge(removed);
	this.rpm = max(0, this.rpm - this.rpm * this.rpm / (500000 * this.efficiency));
	if (this.starter && !rt.bitAnd(this.stat, 2)) {
		yield* this.use_power(2800);
		if (this.rpm < 1000) {
			this.rpmtarget = 1000;
		}
	} else if (this.rpm < 1000) {
		this.rpmtarget = 0;
	}
	if (this.rpm > 50000) {
		this.add_overlay(mutable_appearance(this.icon, "comp-o4", 5));
	} else if (this.rpm > 10000) {
		this.add_overlay(mutable_appearance(this.icon, "comp-o3", 5));
	} else if (this.rpm > 2000) {
		this.add_overlay(mutable_appearance(this.icon, "comp-o2", 5));
	} else {
		if (!(this.rpm > 500)) return f.dot;
		this.add_overlay(mutable_appearance(this.icon, "comp-o1", 5));
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(10326, "/obj/machinery/power/turbine", "/obj/machinery/power", {
	opened: 0,
	compressor: null,
	outturf: null,
	lastgen: null,
	productivity: 1,
	anchored: 1,
	CanAtmosPass: -2,
	name: "gas turbine generator",
	desc: "A gas turbine used for backup power generation.",
	icon: rt.rsc("icons/obj/atmospherics/pipes/simple.dmi"),
	icon_state: "turbine",
	density: 1,
	resistance_flags: 2,
});

// turbine.dm:190
rt.def("/obj/machinery/power/turbine/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/power_turbine"), null))).apply_default_parts(this);
	this.outturf = rt.getStep(f, this, this.dir);
	return f.dot;
}, true);

rt.type(6771, "/obj/item/weapon/circuitboard/machine/power_turbine", "/obj/item/weapon/circuitboard/machine", {
	name: "Power Turbine (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/turbine"),
	origin_tech: "programming=4;powerstorage=4;engineering=4",
	req_components: null,
});

// turbine.dm:200
rt.def("/obj/item/weapon/circuitboard/machine/power_turbine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 6]);
	return f.dot;
});

// turbine.dm:205
rt.def("/obj/machinery/power/turbine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.locate_machinery();
	if (this.compressor) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
}, true);

// turbine.dm:212
rt.def("/obj/machinery/power/turbine/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null;
	let _P: Value = 0;
	for (C of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		_P += C.rating;
	}
	this.productivity = _P / 6;
	return f.dot;
});

// turbine.dm:219
rt.def("/obj/machinery/power/turbine/proc/locate_machinery", function locate_machinery(f: Frame) {
	if (this.compressor) {
		return f.dot;
	}
	this.compressor = rt.locateIn(f, T("/obj/machinery/power/compressor"), rt.getStep(f, this, rt.getDir(f, this.outturf, this)));
	if (!this.compressor) return f.dot;
	this.compressor.locate_machinery();
	return f.dot;
});

// turbine.dm:225
rt.def("/obj/machinery/power/turbine/proc/process", function* process(f: Frame) {
	let oamount: Value = null, removed: Value = null;
	if (!this.compressor) {
		this.stat = 1;
	}
	if (rt.bitAnd(this.stat, 1) || this.panel_open) {
		return f.dot;
	}
	if (!this.compressor.starter) {
		return f.dot;
	}
	this.cut_overlays();
	this.lastgen = (this.compressor.rpm / TURBGENQ) ** TURBGENG * TURBGENQ * this.productivity;
	this.add_avail(this.lastgen);
	let newrpm: Value = this.compressor.gas_contained.temperature * this.compressor.gas_contained.total_moles() / 4;
	newrpm = max(0, newrpm);
	if (!this.compressor.starter || newrpm > 1000) {
		this.compressor.rpmtarget = newrpm;
	}
	if (this.compressor.gas_contained.total_moles() > 0) {
		oamount = min(this.compressor.gas_contained.total_moles(), (this.compressor.rpm + 100) / 35000 * this.compressor.capacity);
		removed = (yield* this.compressor.gas_contained.remove(oamount));
		yield* this.outturf.assume_air(removed);
	}
	if (this.lastgen > 100) {
		this.add_overlay(mutable_appearance(this.icon, "turb-o", 5));
	}
	yield* this.updateDialog();
	return f.dot;
}, true, { waitfor: false });

// turbine.dm:264
rt.def("/obj/machinery/power/turbine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// turbine.dm:270
rt.def("/obj/machinery/power/turbine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, rt.initial(f, this, "icon_state"), rt.initial(f, this, "icon_state"), I)) {
		return f.dot;
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		this.compressor = null;
		this.outturf = rt.getStep(f, this, this.dir);
		this.locate_machinery();
		if (this.compressor) {
			to_chat(user, "<span class='notice'>Compressor connected.</span>");
			(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		} else {
			to_chat(user, "<span class='alert'>Compressor not connected.</span>");
			(rt.modSrcVar(f, "stat", 1, rt.bitOr));
		}
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	yield* this.default_deconstruction_crowbar(I);
	return f.dot;
}, true);

// turbine.dm:292
rt.def("/obj/machinery/power/turbine/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	let $0: any;
	if (!this.Adjacent(user) || rt.bitAnd(this.stat, 3) && !rt.istype(user, T("/mob/living/silicon"))) {
		yield* user.unset_machine(this);
		rt.op(f, "Browse", [], [user, null, "window=turbine"], false);
		return f.dot;
	}
	let t: Value = "<TT><B>Gas Turbine Generator</B><HR><PRE>";
	t += `Generated power : ${round(this.lastgen)} W<BR><BR>`;
	t += `Turbine: ${round(this.compressor.rpm)} RPM<BR>`;
	if (this.compressor.starter) {
		$0 = fmt("<A href='?src=＃;str=1'>Off</A> <B>On</B>", [this]);
	} else {
		$0 = fmt("<B>Off</B> <A href='?src=＃;str=1'>On</A>", [this]);
	}
	t += `Starter: ${$0}`;
	t += fmt("</PRE><HR><A href='?src=＃;close=1'>Close</A>", [this]);
	t += "</TT>";
	(popup = (yield* new_(T("/datum/browser"), user, "turbine", this.name))).set_content(t);
	yield* popup.open();
	return f.dot;
}, true);

// turbine.dm:315
rt.def("/obj/machinery/power/turbine/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=turbine"], false);
		yield* f.usr.unset_machine(this);
		return f.dot;
	} else if (rt.at(href_list, "str")) {
		if (this.compressor) {
			this.compressor.starter = (!this.compressor.starter ? 1 : 0);
		}
	}
	yield* this.updateDialog();
	return f.dot;
}, true);

rt.type(10430, "/obj/machinery/computer/turbine_computer", "/obj/machinery/computer", {
	compressor: null,
	id: 0,
	icon_screen: "turbinecomp",
	icon_keyboard: "tech_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/turbine_computer"),
	name: "gas turbine control computer",
	desc: "A computer to remotely control a gas turbine.",
});

// turbine.dm:341
rt.def("/obj/machinery/computer/turbine_computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.locate_machinery();
	return f.dot;
}, true);

// turbine.dm:345
rt.def("/obj/machinery/computer/turbine_computer/proc/locate_machinery", function locate_machinery(f: Frame) {
	this.compressor = rt.locateIn(f, T("/obj/machinery/power/compressor"), range(5, this));
	return f.dot;
});

// turbine.dm:348
rt.def("/obj/machinery/computer/turbine_computer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// turbine.dm:356
rt.def("/obj/machinery/computer/turbine_computer/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any;
	if (this.compressor && this.compressor.turbine) {
		dat += "<BR><B>Gas turbine remote control system</B><HR>";
		if (this.compressor.stat || this.compressor.turbine.stat) {
			if (this.compressor.stat) {
				$0 = "<B>Compressor is inoperable</B><BR>";
			} else {
				$0 = "<B>Turbine is inoperable</B>";
			}
			dat += `${$0}`;
		} else {
			if (this.compressor.starter) {
				$0 = fmt("<A href='?src=＃;str=1'>Off</A> <B>On</B>", [this]);
			} else {
				$0 = fmt("<B>Off</B> <A href='?src=＃;str=1'>On</A>", [this]);
			}
			dat += fmt("Turbine status: ＀\n\t\t\t\n<BR>\n\t\t\t\nTurbine speed: ＀rpm<BR>\n\t\t\t\nPower currently being generated: ＀W<BR>\n\t\t\t\nInternal gas temperature: ＀K<BR>\n\t\t\t\n</PRE><HR><A href='?src=＃;close=1'>Close</A>\n\t\t\t\n<BR>\n\t\t\t\n", [$0, this.compressor.rpm, this.compressor.turbine.lastgen, this.compressor.gas_contained.temperature, this]);
		}
	} else {
		if (!this.compressor) {
			$0 = "no compressor";
		} else {
			if (!this.compressor.turbine) {
				$0 = " but no turbine";
			} else {
				$0 = "";
			}
			$0 = ` compressor${$0}`;
		}
		dat += `<B>There is ${$0}.</B><BR>`;
		if (!this.compressor) {
			dat += fmt("<A href='?src=＃;search=1'>Search for compressor</A>", [this]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "turbinecomputer", this.name))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// turbine.dm:380
rt.def("/obj/machinery/computer/turbine_computer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	} else if (rt.at(href_list, "str")) {
		if (this.compressor && this.compressor.turbine) {
			this.compressor.starter = (!this.compressor.starter ? 1 : 0);
		}
	} else if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=turbinecomputer"], false);
		yield* f.usr.unset_machine(this);
		return f.dot;
	} else if (rt.at(href_list, "search")) {
		this.locate_machinery();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// turbine.dm:397
rt.def("/obj/machinery/computer/turbine_computer/proc/process", function* process(f: Frame) {
	yield* this.updateDialog();
	return f.dot;
}, true, { waitfor: false });
