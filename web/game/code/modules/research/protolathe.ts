// Based on /tg/station's code/modules/research/protolathe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10973, "/obj/machinery/r_n_d/protolathe", "/obj/machinery/r_n_d", {
	materials: null,
	efficiency_coeff: null,
	categories: null,
	container_type: 4096,
	name: "protolathe",
	desc: "Converts raw materials into useful objects.",
	icon_state: "protolathe",
});

// protolathe.dm:35
rt.def("/obj/machinery/r_n_d/protolathe/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* this.create_reagents(0);
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace")));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/protolathe"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6782, "/obj/item/weapon/circuitboard/machine/protolathe", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Protolathe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/protolathe"),
	origin_tech: "engineering=2;programming=2",
});

// protolathe.dm:45
rt.def("/obj/item/weapon/circuitboard/machine/protolathe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/weapon/reagent_containers/glass/beaker"), 2]);
	return f.dot;
});

// protolathe.dm:51
rt.def("/obj/machinery/r_n_d/protolathe/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.materials);
	return (yield* parent_proc());
}, true);

// protolathe.dm:55
rt.def("/obj/machinery/r_n_d/protolathe/proc/RefreshParts", function* RefreshParts(f: Frame) {
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
	let _T: Value = 1.2;
	for (M_1 of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		_T -= M_1.rating / 10;
	}
	this.efficiency_coeff = min(max(0, _T), 1);
	return f.dot;
}, true);

// protolathe.dm:70
rt.def("/obj/machinery/r_n_d/protolathe/proc/check_mat", function check_mat(f: Frame, being_built: Value, M: Value) {
	let A: Value = null;
	let all_materials: Value = being_built.reagents_list + being_built.materials;
	if (!(A = this.materials.amount(M))) {
		A = this.reagents.get_reagent_amount(M);
	}
	return round(A / max(1, rt.index(all_materials, M) * this.efficiency_coeff));
});

// protolathe.dm:80
rt.def("/obj/machinery/r_n_d/protolathe/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	let G: Value = null;
	for (G of each(this.component_parts, T("/obj/item/weapon/reagent_containers/glass"))) {
		yield* this.reagents.trans_to(G, G.reagents.maximum_volume);
	}
	yield* this.materials.retrieve_all();
	yield* parent_proc();
	return f.dot;
}, true);

// protolathe.dm:87
rt.def("/obj/machinery/r_n_d/protolathe/proc/disconnect_console", function disconnect_console(f: Frame) {
	this.linked_console.linked_lathe = null;
	parent_proc();
	return f.dot;
});

// protolathe.dm:92
rt.def("/obj/machinery/r_n_d/protolathe/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let sheet_material: Value = null, stack: Value = null, amount: Value = null, amount_inserted: Value = null, stack_name: Value = null, bs_material: Value = null;
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
			stack_name = stack.name;
			this.busy = 1;
			yield* this.use_power(max(1000, MINERAL_MATERIAL_AMOUNT * amount_inserted / 10));
			to_chat(user, `<span class='notice'>You add ${amount_inserted} sheets to the ${this.name}.</span>`);
			this.add_overlay(`protolathe_${stack_name}`);
			yield* sleep(10);
			this.cut_overlay(`protolathe_${stack_name}`);
			this.busy = 0;
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
		this.busy = 1;
		yield* this.use_power(200);
		to_chat(user, `<span class='notice'>You add ${O} to the ${this.name}.</span>`);
		yield* qdel(O);
		this.add_overlay("protolathe_bluespace");
		yield* sleep(10);
		this.cut_overlay("protolathe_bluespace");
		this.busy = 0;
		yield* this.updateUsrDialog();
	} else if (user.a_intent != "harm") {
		to_chat(user, `<span class='warning'>You cannot insert this item into the ${this.name}!</span>`);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);
