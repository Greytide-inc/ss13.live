// Based on /tg/station's code/modules/cargo/exports.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// exports.dm:30
rt.def("/proc/export_item_and_contents", function* export_item_and_contents(f: Frame, AM: Value, contraband: Value, emagged: Value, dry_run: Value) {
	let i: Value = null, thing: Value = null, E: Value = null;
	dry_run ??= 0;
	if (!rt.len(f, GLOB.exports_list)) {
		yield* setupExports();
	}
	let sold_str: Value = "";
	let cost: Value = 0;
	let contents: Value = AM.GetAllContents();
	for (i of each(reverseRange(contents))) {
		thing = i;
		E = null;
		for (E of each(GLOB.exports_list, T("/datum/export"))) {
			if (!E) {
				continue;
			}
			if (E.applies_to(thing, contraband, emagged)) {
				if (dry_run) {
					cost += E.get_cost(thing, contraband, emagged);
				} else {
					E.sell_object(thing, contraband, emagged);
					sold_str += ` ${thing.name}`;
				}
				break;
			}
		}
		if (!dry_run) {
			yield* qdel(thing);
		}
	}
	if (dry_run) {
		return cost;
	} else {
		return sold_str;
	}
}, true);

rt.type(1944, "/datum/export", "/datum", {
	unit_name: "",
	message: "",
	cost: 100,
	k_elasticity: 0.033333335,
	contraband: 0,
	emagged: 0,
	export_types: null,
	include_subtypes: 1,
	exclude_types: null,
	total_cost: 0,
	total_amount: 0,
	init_cost: null,
});

// exports.dm:66
rt.def("/datum/export/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.export_types = list();

	this.exclude_types = list();
	return f.dot;
});

// exports.dm:76
rt.def("/datum/export/proc/New", function New(f: Frame) {
	parent_proc();
	GLOB.SSprocessing.processing += this;
	this.init_cost = this.cost;
	this.export_types = typecacheof(this.export_types);
	this.exclude_types = typecacheof(this.exclude_types);
	return f.dot;
});

// exports.dm:84
rt.def("/datum/export/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSprocessing.processing -= this;
	return (yield* parent_proc());
}, true);

// exports.dm:88
rt.def("/datum/export/proc/process", function process(f: Frame) {
	parent_proc();
	this.cost *= GLOB.E ** (this.k_elasticity * 0.033333335);
	if (!(this.cost > this.init_cost)) return f.dot;
	this.cost = this.init_cost;
	return f.dot;
}, false, { waitfor: false });

// exports.dm:95
rt.def("/datum/export/proc/get_cost", function get_cost(f: Frame, O: Value, contr: Value, emag: Value) {
	contr ??= 0;
	emag ??= 0;
	let amount: Value = this.get_amount(O, contr, emag);
	if (this.k_elasticity != 0) {
		return round(this.cost / this.k_elasticity * (1 - GLOB.E ** (-1 * this.k_elasticity * amount)));
	}
	return round(this.cost * amount);
});

// exports.dm:108
rt.def("/datum/export/proc/applies_to", function applies_to(f: Frame, O: Value, contr: Value, emag: Value) {
	contr ??= 0;
	emag ??= 0;
	if (this.contraband && !contr) {
		return 0;
	}
	if (this.emagged && !emag) {
		return 0;
	}
	if (!this.include_subtypes && !rt.isIn(f, O.type, this.export_types)) {
		return 0;
	}
	if (this.include_subtypes && (!is_type_in_typecache(O, this.export_types) || is_type_in_typecache(O, this.exclude_types))) {
		return 0;
	}
	if (!this.get_cost(O, contr, emag)) {
		return 0;
	}
	if (O.secondary_flags ? rt.index(O.secondary_flags, "hologram") : 0) {
		return 0;
	}
	return 1;
});

// exports.dm:126
rt.def("/datum/export/proc/sell_object", function sell_object(f: Frame, O: Value, contr: Value, emag: Value) {
	contr ??= 0;
	emag ??= 0;
	let the_cost: Value = this.get_cost(O);
	let amount: Value = this.get_amount(O);
	this.total_cost += the_cost;
	if (rt.istype(O, T("/datum/export/material"))) {
		this.total_amount += amount * MINERAL_MATERIAL_AMOUNT;
	} else {
		this.total_amount += amount;
	}
	this.cost *= GLOB.E ** (-1 * this.k_elasticity * amount);
	return f.dot;
});

// exports.dm:142
rt.def("/datum/export/proc/total_printout", function total_printout(f: Frame, contr: Value, emag: Value) {
	contr ??= 0;
	emag ??= 0;
	if (!this.total_cost && !this.total_amount) {
		return "";
	}
	let msg: Value = `${this.total_cost} credits: Received ${this.total_amount} `;
	if (this.total_cost > 0) {
		msg = "+" + msg;
	}
	if (this.unit_name) {
		msg += this.unit_name;
		if (this.total_amount > 1) {
			msg += "s";
		}
		if (rt.sv(f, "message")) {
			msg += " ";
		}
	}
	if (rt.sv(f, "message")) {
		msg += rt.sv(f, "message");
	}
	return (msg += ".");
});

// exports.dm:166
rt.def("/datum/controller/global_vars/proc/InitGlobalexports_list", function InitGlobalexports_list(f: Frame) {
	GLOB.exports_list = list();
	this.gvars_datum_init_order += "exports_list";
	return f.dot;
});

// exports.dm:169
rt.def("/proc/setupExports", function* setupExports(f: Frame) {
	let subtype: Value = null, E: Value = null;
	for (subtype of each(typesof(T("/datum/export")) - T("/datum/export"))) {
		if ((E = (yield* new_(subtype))).export_types && rt.len(f, E.export_types)) {
			GLOB.exports_list += E;
		}
	}
	return f.dot;
}, true);
