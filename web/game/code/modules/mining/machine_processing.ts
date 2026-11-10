// Based on /tg/station's code/modules/mining/machine_processing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10929, "/obj/machinery/mineral/processing_unit_console", "/obj/machinery/mineral", {
	machine: null,
	machinedir: 4,
	anchored: 1,
	speed_process: 1,
	name: "production machine console",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 1,
});

// machine_processing.dm:16
rt.def("/obj/machinery/mineral/processing_unit_console/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.machine = rt.locateIn(f, T("/obj/machinery/mineral/processing_unit"), rt.getStep(f, this, this.machinedir));
	if (this.machine) {
		this.machine.CONSOLE = this;
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// machine_processing.dm:25
rt.def("/obj/machinery/mineral/processing_unit_console/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	if (!this.machine) {
		return f.dot;
	}
	let dat: Value = this.machine.get_machine_data();
	(popup = (yield* new_(T("/datum/browser"), user, "processing", "Smelting Console", 300, 500))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// machine_processing.dm:35
rt.def("/obj/machinery/mineral/processing_unit_console/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "material")) {
		this.machine.selected_material = rt.at(href_list, "material");
		this.machine.selected_alloy = null;
	}
	if (rt.at(href_list, "alloy")) {
		this.machine.selected_material = null;
		this.machine.selected_alloy = rt.at(href_list, "alloy");
	}
	if (rt.at(href_list, "set_on")) {
		this.machine.on = (rt.at(href_list, "set_on") == "on" ? 1 : 0);
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// machine_processing.dm:56
rt.def("/obj/machinery/mineral/processing_unit_console/proc/Destroy", function* Destroy(f: Frame) {
	this.machine = null;
	return (yield* parent_proc());
}, true);

rt.type(10930, "/obj/machinery/mineral/processing_unit", "/obj/machinery/mineral", {
	CONSOLE: null,
	materials: null,
	on: 0,
	selected_material: "$metal",
	selected_alloy: null,
	files: null,
	anchored: 1,
	name: "furnace",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "furnace",
	density: 1,
});

// machine_processing.dm:76
rt.def("/obj/machinery/mineral/processing_unit/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.proximity_monitor = (yield* new_(T("/datum/proximity_monitor"), this, 1));
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace"), 1e+31));
	this.files = (yield* new_(T("/datum/research/smelter"), this));
	return f.dot;
}, true);

// machine_processing.dm:83
rt.def("/obj/machinery/mineral/processing_unit/proc/Destroy", function* Destroy(f: Frame) {
	this.CONSOLE = null;
	yield* qdel(this.materials);
	this.materials = null;
	yield* qdel(this.files);
	this.files = null;
	return (yield* parent_proc());
}, true);

// machine_processing.dm:88
rt.def("/obj/machinery/mineral/processing_unit/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	if (!(rt.istype(AM, T("/obj/item/weapon/ore")) && AM.loc == rt.getStep(f, this, this.input_dir))) return f.dot;
	yield* this.process_ore(AM);
	return f.dot;
}, true);

// machine_processing.dm:92
rt.def("/obj/machinery/mineral/processing_unit/proc/process_ore", function* process_ore(f: Frame, O: Value) {
	let material_amount: Value = this.materials.get_item_material_amount(O);
	if (!this.materials.has_space(material_amount)) {
		yield* this.unload_mineral(O);
	} else {
		yield* this.materials.insert_item(O);
		yield* qdel(O);
		if (!this.CONSOLE) return f.dot;
		yield* this.CONSOLE.updateUsrDialog();
	}
	return f.dot;
}, true);

// machine_processing.dm:102
rt.def("/obj/machinery/mineral/processing_unit/proc/get_machine_data", function get_machine_data(f: Frame) {
	let mat_id: Value = null, M: Value = null, v: Value = null, D: Value = null;
	let dat: Value = "<b>Smelter control console</b><br><br>";
	for (mat_id of each(this.materials.materials)) {
		dat += `<span class="res_name">${(M = rt.index(this.materials.materials, mat_id)).name}: </span>${M.amount} cm&sup3;`;
		if (this.selected_material == mat_id) {
			dat += " <i>Smelting</i>";
		} else {
			dat += fmt(" <A href='?src=＃;material=＀'><b>Not Smelting</b></A> ", [this.CONSOLE, mat_id]);
		}
		dat += "<br>";
	}
	dat += "<br><br>";
	dat += "<b>Smelt Alloys</b><br>";
	for (v of each(this.files.known_designs)) {
		dat += `<span class="res_name">${(D = rt.index(this.files.known_designs, v)).name} `;
		if (this.selected_alloy == D.id) {
			dat += " <i>Smelting</i>";
		} else {
			dat += fmt(" <A href='?src=＃;alloy=＀'><b>Not Smelting</b></A> ", [this.CONSOLE, D.id]);
		}
		dat += "<br>";
	}
	dat += "<br><br>";
	dat += "Machine is currently ";
	if (this.on) {
		dat += fmt("<A href='?src=＃;set_on=off'>On</A> ", [this.CONSOLE]);
	} else {
		dat += fmt("<A href='?src=＃;set_on=on'>Off</A> ", [this.CONSOLE]);
	}
	return dat;
});

// machine_processing.dm:137
rt.def("/obj/machinery/mineral/processing_unit/proc/process", function* process(f: Frame) {
	if (!this.on) return f.dot;
	if (this.selected_material) {
		yield* this.smelt_ore();
	} else if (this.selected_alloy) {
		yield* this.smelt_alloy();
	}
	if (!this.CONSOLE) return f.dot;
	yield* this.CONSOLE.updateUsrDialog();
	return f.dot;
}, true, { waitfor: false });

// machine_processing.dm:168
rt.def("/obj/machinery/mineral/processing_unit/proc/smelt_ore", function* smelt_ore(f: Frame) {
	let mat: Value = null, sheets_to_remove: Value = null, out: Value = null;
	if (!(mat = rt.index(this.materials.materials, this.selected_material))) return f.dot;
	if (!(sheets_to_remove = mat.amount >= 20000 ? 10 : round(mat.amount / MINERAL_MATERIAL_AMOUNT))) {
		this.on = 0;
	} else {
		out = rt.getStep(f, this, this.output_dir);
		yield* this.materials.retrieve_sheets(sheets_to_remove, this.selected_material, out);
	}
	return f.dot;
}, true);

// machine_processing.dm:179
rt.def("/obj/machinery/mineral/processing_unit/proc/smelt_alloy", function* smelt_alloy(f: Frame) {
	let alloy: Value = null, amount: Value = null;
	if (!(alloy = this.files.FindDesignByID(this.selected_alloy))) {
		this.on = 0;
		return f.dot;
	}
	if (!(amount = this.can_smelt(alloy))) {
		this.on = 0;
		return f.dot;
	}
	this.materials.use_amount(alloy.materials, amount);
	yield* this.generate_mineral(alloy.build_path);
	return f.dot;
}, true);

// machine_processing.dm:195
rt.def("/obj/machinery/mineral/processing_unit/proc/can_smelt", function can_smelt(f: Frame, D: Value) {
	let mat_id: Value = null, M: Value = null, smelter_mat: Value = null;
	if (rt.len(f, D.make_reagents)) {
		return 0;
	}
	let build_amount: Value = 10;
	for (mat_id of each(D.materials)) {
		M = rt.index(D.materials, mat_id);
		smelter_mat = rt.index(this.materials.materials, mat_id);
		if (!M || !smelter_mat) {
			return 0;
		}
		build_amount = min(build_amount, round(smelter_mat.amount / M));
	}
	return build_amount;
});

// machine_processing.dm:213
rt.def("/obj/machinery/mineral/processing_unit/proc/generate_mineral", function* generate_mineral(f: Frame, _P: Value) {
	let O: Value = null;
	yield* this.unload_mineral((O = (yield* new_(_P, this))));
	return f.dot;
}, true);

// machine_processing.dm:217
rt.def("/obj/machinery/mineral/processing_unit/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* this.materials.retrieve_all();
	yield* parent_proc();
	return f.dot;
}, true);
