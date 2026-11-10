// Based on /tg/station's code/modules/research/circuitprinter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10970, "/obj/machinery/r_n_d/circuit_imprinter", "/obj/machinery/r_n_d", {
	materials: null,
	efficiency_coeff: null,
	categories: null,
	container_type: 4096,
	name: "circuit imprinter",
	desc: "Manufactures circuit boards for the construction of machines.",
	icon_state: "circuit_imprinter",
});

// circuitprinter.dm:31
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$glass", "$gold", "$diamond", "$metal", "$bluespace")));
	yield* this.create_reagents(0);
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/circuit_imprinter"), null))).apply_default_parts(this);
	return f.dot;
}, true);

// circuitprinter.dm:38
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.materials);
	return (yield* parent_proc());
}, true);

rt.type(6779, "/obj/item/weapon/circuitboard/machine/circuit_imprinter", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Circuit Imprinter (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/circuit_imprinter"),
	origin_tech: "engineering=2;programming=2",
});

// circuitprinter.dm:45
rt.def("/obj/item/weapon/circuitboard/machine/circuit_imprinter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/reagent_containers/glass/beaker"), 2]);
	return f.dot;
});

// circuitprinter.dm:51
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let G: Value = null, M: Value = null, M_1: Value = null;
	this.reagents.maximum_volume = 0;
	for (G of each(this.component_parts, T("/obj/item/weapon/reagent_containers/glass"))) {
		this.reagents.maximum_volume += G.volume;
		yield* G.reagents.trans_to(this, G.reagents.total_volume);
	}
	this.materials.max_amount = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		this.materials.max_amount += M.rating * 75000;
	}
	let _T: Value = 0;
	for (M_1 of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		_T += M_1.rating;
	}
	this.efficiency_coeff = 2 ** (_T - 1);
	return f.dot;
}, true);

// circuitprinter.dm:66
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!prob(50)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// circuitprinter.dm:70
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/check_mat", function check_mat(f: Frame, being_built: Value, M: Value) {
	let A: Value = null;
	let all_materials: Value = being_built.reagents_list + being_built.materials;
	if (!(A = this.materials.amount(M))) {
		A = this.reagents.get_reagent_amount(M);
	}
	return round(A / max(1, rt.index(all_materials, M) / this.efficiency_coeff));
});

// circuitprinter.dm:80
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	let G: Value = null;
	for (G of each(this.component_parts, T("/obj/item/weapon/reagent_containers/glass"))) {
		yield* this.reagents.trans_to(G, G.reagents.maximum_volume);
	}
	yield* this.materials.retrieve_all();
	yield* parent_proc();
	return f.dot;
}, true);

// circuitprinter.dm:87
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/disconnect_console", function disconnect_console(f: Frame) {
	this.linked_console.linked_imprinter = null;
	parent_proc();
	return f.dot;
});

// circuitprinter.dm:92
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let sheet_material: Value = null, stack: Value = null, amount: Value = null, amount_inserted: Value = null, bs_material: Value = null;
	if (rt.istype(O, T("/obj/item/stack/sheet"))) {
		f.dot = 1;
		if (!this.is_insertion_ready(user)) {
			return f.dot;
		}
		if (!(sheet_material = this.materials.get_item_material_amount(O))) {
			return f.dot;
		}
		if (!this.materials.has_space(sheet_material)) {
			to_chat(user, `<span class='warning'>The ${this.name}'s material bin is full! Please remove material before adding more.</span>`);
			return 1;
		}
		stack = O;
		amount = round((yield* g.op(f, "Prompt", [32], [null, null, null, "How many sheets do you want to add?", null])));
		if (!(get_dist(this, stack) <= 1) || !user.Adjacent(this)) {
			return f.dot;
		}
		if (!(amount_inserted = (yield* this.materials.insert_stack(O, amount)))) {
			return 1;
		} else {
			yield* this.use_power(max(1000, MINERAL_MATERIAL_AMOUNT * amount_inserted / 10));
			to_chat(user, `<span class='notice'>You add ${amount_inserted} sheets to the ${this.name}.</span>`);
		}
		yield* this.updateUsrDialog();
	} else if (rt.istype(O, T("/obj/item/weapon/ore/bluespace_crystal"))) {
		f.dot = 1;
		if (!this.is_insertion_ready(user)) {
			return f.dot;
		}
		if (!(bs_material = this.materials.get_item_material_amount(O))) {
			return f.dot;
		}
		if (!this.materials.has_space(bs_material)) {
			to_chat(user, `<span class='warning'>The ${this.name}'s material bin is full! Please remove material before adding more.</span>`);
			return 1;
		}
		yield* this.materials.insert_item(O);
		yield* this.use_power(200);
		to_chat(user, `<span class='notice'>You add ${O} to the ${this.name}.</span>`);
		yield* qdel(O);
		yield* this.updateUsrDialog();
	} else if (user.a_intent != "harm") {
		to_chat(user, `<span class='warning'>You cannot insert this item into the ${this.name}!</span>`);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);
