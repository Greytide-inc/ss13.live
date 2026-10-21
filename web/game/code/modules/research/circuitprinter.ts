// From code/modules/research/circuitprinter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10970, "/obj/machinery/r_n_d/circuit_imprinter", "/obj/machinery/r_n_d", {
	materials: null,
	efficiency_coeff: null,
	categories: null,
	container_type: 4096,
	name: "circuit imprinter",
	desc: "Manufactures circuit boards for the construction of machines.",
	icon_state: "circuit_imprinter",
});

// /obj/machinery/r_n_d/circuit_imprinter/proc/Initialize  (code/modules/research/circuitprinter.dm:31)  may sleep
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$glass", "$gold", "$diamond", "$metal", "$bluespace")])));
	yield* g.srcCall(f, "create_reagents", 0);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/circuit_imprinter"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/circuit_imprinter/proc/Destroy  (code/modules/research/circuitprinter.dm:38)  may sleep
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "materials")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(6779, "/obj/item/weapon/circuitboard/machine/circuit_imprinter", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Circuit Imprinter (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/circuit_imprinter"),
	origin_tech: "engineering=2;programming=2",
});

// /obj/item/weapon/circuitboard/machine/circuit_imprinter/proc/<init>  (code/modules/research/circuitprinter.dm:45)
rt.def("/obj/item/weapon/circuitboard/machine/circuit_imprinter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/reagent_containers/glass/beaker"), 2]));
	return f.dot;
});

// /obj/machinery/r_n_d/circuit_imprinter/proc/RefreshParts  (code/modules/research/circuitprinter.dm:51)  may sleep
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let G: Value = null, M: Value = null, _T: Value = null, M_1: Value = null;
	let $e: any;
	f.vars = () => [G, M, _T, M_1, $e];
	rt.setFv(f, "maximum_volume", rt.sv(f, "reagents"), 0);
	G = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/reagent_containers/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.modField(f, rt.sv(f, "reagents"), "maximum_volume", rt.fv(f, "volume", live(G)), add);
		yield* g.callName(f, rt.fv(f, "reagents", live(G)), "trans_to", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G)))]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "max_amount", rt.sv(f, "materials"), 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.modField(f, rt.sv(f, "materials"), "max_amount", multiply(rt.fv(f, "rating", live(M)), 75000), add);
	}
	rt.endFor(f, 0);
	_T = 0;
	M_1 = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M_1 = $e;
		_T = rt.modify(live(_T), rt.fv(f, "rating", live(M_1)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency_coeff", rt.power(2, subtract(live(_T), 1)));
	return f.dot;
}, true);

// /obj/machinery/r_n_d/circuit_imprinter/proc/blob_act  (code/modules/research/circuitprinter.dm:66)  may sleep
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/circuit_imprinter/proc/check_mat  (code/modules/research/circuitprinter.dm:70)
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/check_mat", function check_mat(f: Frame, being_built: Value, M: Value) {
	let all_materials: Value = null, A: Value = null;
	f.vars = () => [all_materials, A];
	all_materials = add(rt.fv(f, "reagents_list", live(being_built)), rt.fv(f, "materials", live(being_built)));
	if (!truthy((A = rt.callName(f, rt.sv(f, "materials"), "amount", [live(M)])))) {
		A = rt.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", [live(M)]);
	}
	return rt.call(f, P("/proc/round"), null, [divide(live(A), rt.call(f, P("/proc/max"), null, [1, divide(rt.index(live(all_materials), live(M)), rt.sv(f, "efficiency_coeff"))]))]);
});

// /obj/machinery/r_n_d/circuit_imprinter/proc/on_deconstruction  (code/modules/research/circuitprinter.dm:80)  may sleep
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/reagent_containers/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(G), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(G)))]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/circuit_imprinter/proc/disconnect_console  (code/modules/research/circuitprinter.dm:87)
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/disconnect_console", function disconnect_console(f: Frame) {
	rt.setFv(f, "linked_imprinter", rt.sv(f, "linked_console"), null);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/machinery/r_n_d/circuit_imprinter/proc/Insert_Item  (code/modules/research/circuitprinter.dm:92)  may sleep
rt.def("/obj/machinery/r_n_d/circuit_imprinter/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let sheet_material: Value = null, stack: Value = null, amount: Value = null, amount_inserted: Value = null, bs_material: Value = null;
	f.vars = () => [O, user, sheet_material, stack, amount, amount_inserted, bs_material];
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet")) ? 1 : 0))) {
		f.dot = 1;
		if (!truthy((yield* g.srcCall(f, "is_insertion_ready", live(user))))) {
			return live(f.dot);
		}
		if (!truthy((sheet_material = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(O)]))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_space", [live(sheet_material)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀'s material bin is full! Please remove material before adding more.</span>", [rt.fv(f, "name", live(f.src))])]);
			return 1;
		}
		stack = live(O);
		amount = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [32], [null, null, null, "How many sheets do you want to add?", null]))]));
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(stack)])), 1) || !truthy((yield* g.callName(f, live(user), "Adjacent", [live(f.src)]))))) {
			return live(f.dot);
		}
		if (!truthy((amount_inserted = (yield* g.callName(f, rt.sv(f, "materials"), "insert_stack", [live(O), live(amount)]))))) {
			return 1;
		} else {
			yield* g.srcCall(f, "use_power", (yield* g.call(f, P("/proc/max"), null, [1000, divide(multiply(2000, live(amount_inserted)), 10)])));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add ＀ sheets to the ＀.</span>", [live(amount_inserted), rt.fv(f, "name", live(f.src))])]);
		}
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		if (truthy((rt.istype(live(O), T("/obj/item/weapon/ore/bluespace_crystal")) ? 1 : 0))) {
			f.dot = 1;
			if (!truthy((yield* g.srcCall(f, "is_insertion_ready", live(user))))) {
				return live(f.dot);
			}
			if (!truthy((bs_material = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(O)]))))) {
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_space", [live(bs_material)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀'s material bin is full! Please remove material before adding more.</span>", [rt.fv(f, "name", live(f.src))])]);
				return 1;
			}
			yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [live(O)]);
			yield* g.srcCall(f, "use_power", 200);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add ＀ to the ＀.</span>", [live(O), rt.fv(f, "name", live(f.src))])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot insert this item into the ＀!</span>", [rt.sv(f, "name")])]);
				return 1;
			} else {
				return 0;
			}
		}
	}
	return f.dot;
}, true);
