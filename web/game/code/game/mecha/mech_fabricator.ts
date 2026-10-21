// From code/game/mecha/mech_fabricator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10873, "/obj/machinery/mecha_part_fabricator", "/obj/machinery", {
	time_coeff: 1,
	component_coeff: 1,
	materials: null,
	files: null,
	sync: 0,
	part_set: null,
	being_built: null,
	queue: null,
	processing_queue: 0,
	screen: "main",
	temp: null,
	part_sets: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 20,
	active_power_usage: 5000,
	icon: rt.rsc("icons/obj/robotics.dmi"),
	icon_state: "fab-idle",
	name: "exosuit fabricator",
	desc: "Nothing is being built.",
	density: 1,
	req_access: null,
});

// /obj/machinery/mecha_part_fabricator/proc/<init>  (code/game/mecha/mech_fabricator.dm:19)
rt.def("/obj/machinery/mecha_part_fabricator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "queue", rt.list());
	rt.setSv(f, "part_sets", rt.list("Cyborg", "Ripley", "Firefighter", "Odysseus", "Gygax", "Durand", "H.O.N.K", "Phazon", "Exosuit Equipment", "Cyborg Upgrade Modules", "Misc"));
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(29));
	return f.dot;
});

// /obj/machinery/mecha_part_fabricator/proc/New  (code/game/mecha/mech_fabricator.dm:38)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research"), [live(f.src)])));
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace")])));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/mechfab"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6743, "/obj/item/weapon/circuitboard/machine/mechfab", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Exosuit Fabricator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mecha_part_fabricator"),
	origin_tech: "programming=2;engineering=2",
});

// /obj/item/weapon/circuitboard/machine/mechfab/proc/<init>  (code/game/mecha/mech_fabricator.dm:48)
rt.def("/obj/item/weapon/circuitboard/machine/mechfab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/mecha_part_fabricator/proc/RefreshParts  (code/game/mecha/mech_fabricator.dm:58)
rt.def("/obj/machinery/mecha_part_fabricator/proc/RefreshParts", function RefreshParts(f: Frame) {
	let _T: Value = null, M: Value = null, Ma: Value = null, Ml: Value = null;
	let $e: any;
	f.vars = () => [_T, M, Ma, Ml, $e];
	_T = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		_T = rt.modify(live(_T), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "max_amount", rt.sv(f, "materials"), add(200000, multiply(live(_T), 50000)));
	_T = 1.149999976158142;
	Ma = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ma = $e;
		(_T = rt.modify(live(_T), multiply(rt.fv(f, "rating", live(Ma)), 0.15000000596046448), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "component_coeff", live(_T));
	_T = -1;
	Ml = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ml = $e;
		_T = rt.modify(live(_T), rt.fv(f, "rating", live(Ml)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "time_coeff", rt.call(f, P("/proc/round"), null, [subtract(rt.initial(f, live(f.src), "time_coeff"), divide(multiply(rt.initial(f, live(f.src), "time_coeff"), live(_T)), 5)), 0.009999999776482582]));
	return f.dot;
});

// /obj/machinery/mecha_part_fabricator/proc/check_access  (code/game/mecha/mech_fabricator.dm:76)
rt.def("/obj/machinery/mecha_part_fabricator/proc/check_access", function check_access(f: Frame, I: Value) {
	let pda: Value = null, req: Value = null;
	let $e: any;
	f.vars = () => [I, pda, req, $e];
	if (truthy((rt.istype(live(I), T("/obj/item/device/pda")) ? 1 : 0))) {
		I = rt.gv(f, "id", (pda = live(I)));
	}
	if ((!truthy((rt.istype(live(I), T("/obj/item/weapon/card/id")) ? 1 : 0)) || !truthy(rt.fv(f, "access", live(I))))) {
		return 0;
	}
	req = null;
	rt.forList(f, 0, rt.sv(f, "req_access"));
	while (($e = rt.next(f, 0)) !== undefined) {
		req = $e;
		if (!truthy((rt.isIn(f, live(req), rt.fv(f, "access", live(I))) ? 1 : 0))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/machinery/mecha_part_fabricator/proc/emag_act  (code/game/mecha/mech_fabricator.dm:91)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/emag_act", function* emag_act(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return live(f.dot);
	}
	rt.setSv(f, "emagged", 0.5);
	yield* g.srcCall(f, "say", "DB error [Code 0x00F1]");
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.srcCall(f, "say", "Attempting auto-repair...");
	yield* g.call(f, P("/proc/sleep"), null, [15]);
	yield* g.srcCall(f, "say", "User DB corrupted [Code 0x00FA]. Truncating data structure...");
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	yield* g.srcCall(f, "say", "User DB truncated. Please contact your Nanotrasen system operator for future assistance.");
	rt.setSv(f, "req_access", null);
	rt.setSv(f, "emagged", 1);
	return f.dot;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/output_parts_list  (code/game/mecha/mech_fabricator.dm:102)
rt.def("/obj/machinery/mecha_part_fabricator/proc/output_parts_list", function output_parts_list(f: Frame, set_name: Value) {
	let output: Value = null, v: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [output, v, D, $e];
	output = "";
	v = null;
	rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "build_type", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v)))), 16))) {
			if (!truthy((rt.isIn(f, live(set_name), rt.fv(f, "category", live(D))) ? 1 : 0))) {
				continue;
			}
			output = rt.modify(live(output), fmt("<div class='part'>＀<br>[", [rt.callSrc(f, "output_part_info", [live(D)])]), add);
			if (truthy(rt.callSrc(f, "check_resources", [live(D)]))) {
				output = rt.modify(live(output), fmt("<a href='?src=＃;part=＀'>Build</a> | ", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
			output = rt.modify(live(output), fmt("<a href='?src=＃;add_to_queue=＀'>Add to queue</a>][<a href='?src=＃;part_desc=＀'>?</a>]</div>", [live(f.src), rt.fv(f, "id", live(D)), live(f.src), rt.fv(f, "id", live(D))]), add);
		}
	}
	rt.endFor(f, 0);
	return live(output);
});

// /obj/machinery/mecha_part_fabricator/proc/output_part_info  (code/game/mecha/mech_fabricator.dm:115)
rt.def("/obj/machinery/mecha_part_fabricator/proc/output_part_info", function output_part_info(f: Frame, D: Value) {
	let output: Value = null;
	f.vars = () => [output];
	return (output = fmt("＀ (Cost: ＀) ＀sec", [rt.initial(f, live(D), "name"), rt.callSrc(f, "output_part_cost", [live(D)]), divide(rt.callSrc(f, "get_construction_time_w_coeff", [live(D)]), 10)]));
});

// /obj/machinery/mecha_part_fabricator/proc/output_part_cost  (code/game/mecha/mech_fabricator.dm:121)
rt.def("/obj/machinery/mecha_part_fabricator/proc/output_part_cost", function output_part_cost(f: Frame, D: Value) {
	let i: Value = null, output: Value = null, c: Value = null;
	let $0: any, $e: any;
	f.vars = () => [i, output, c, $0, $e];
	i = 0;
	output = null;
	c = null;
	rt.forList(f, 0, rt.fv(f, "materials", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if (truthy(live(i))) {
			$0 = " | ";
		} else {
			$0 = null;
		}
		output = rt.modify(live(output), fmt("＀＀ ＀", [$0, rt.callSrc(f, "get_resource_cost_w_coeff", [live(D), live(c)]), rt.callSrc(f, "material2name", [live(c)])]), add);
		i = rt.inc(live(i), 1);
	}
	rt.endFor(f, 0);
	return live(output);
});

// /obj/machinery/mecha_part_fabricator/proc/output_available_resources  (code/game/mecha/mech_fabricator.dm:128)
rt.def("/obj/machinery/mecha_part_fabricator/proc/output_available_resources", function output_available_resources(f: Frame) {
	let output: Value = null, mat_id: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [output, mat_id, M, $e];
	output = null;
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		output = rt.modify(live(output), fmt("<span class=\"res_name\">＀: </span>＀ cm&sup3;", [rt.gv(f, "name", (M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id)))), rt.fv(f, "amount", live(M))]), add);
		if (rt.ge(rt.fv(f, "amount", live(M)), 2000)) {
			output = rt.modify(live(output), fmt("<span style='font-size:80%;'>- Remove [<a href='?src=＃;remove_mat=1;material=＀'>1</a>]", [live(f.src), live(mat_id)]), add);
			if (rt.ge(rt.fv(f, "amount", live(M)), 20000)) {
				output = rt.modify(live(output), fmt(" | [<a href='?src=＃;remove_mat=10;material=＀'>10</a>]", [live(f.src), live(mat_id)]), add);
			}
			output = rt.modify(live(output), fmt(" | [<a href='?src=＃;remove_mat=50;material=＀'>All</a>]</span>", [live(f.src), live(mat_id)]), add);
		}
		output = rt.modify(live(output), "<br/>", add);
	}
	rt.endFor(f, 0);
	return live(output);
});

// /obj/machinery/mecha_part_fabricator/proc/get_resources_w_coeff  (code/game/mecha/mech_fabricator.dm:140)
rt.def("/obj/machinery/mecha_part_fabricator/proc/get_resources_w_coeff", function get_resources_w_coeff(f: Frame, D: Value) {
	let resources: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [resources, R, $e];
	resources = rt.list();
	R = null;
	rt.forList(f, 0, rt.fv(f, "materials", live(D)));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		rt.setAt(live(resources), live(R), rt.callSrc(f, "get_resource_cost_w_coeff", [live(D), live(R)]));
	}
	rt.endFor(f, 0);
	return live(resources);
});

// /obj/machinery/mecha_part_fabricator/proc/check_resources  (code/game/mecha/mech_fabricator.dm:146)
rt.def("/obj/machinery/mecha_part_fabricator/proc/check_resources", function check_resources(f: Frame, D: Value) {
	if (truthy(rt.getLen(f, rt.fv(f, "reagents_list", live(D))))) {
		return 0;
	}
	if (truthy(rt.callName(f, rt.sv(f, "materials"), "has_materials", [rt.callSrc(f, "get_resources_w_coeff", [live(D)])]))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/mecha_part_fabricator/proc/build_part  (code/game/mecha/mech_fabricator.dm:153)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/build_part", function* build_part(f: Frame, D: Value) {
	let res_coef: Value = null, location: Value = null, I: Value = null;
	f.vars = () => [D, res_coef, location, I];
	rt.setSv(f, "being_built", live(D));
	rt.setSv(f, "desc", fmt("It's building ＇！.", [rt.initial(f, live(D), "name")]));
	res_coef = (yield* g.srcCall(f, "get_resources_w_coeff", live(D)));
	yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [live(res_coef)]);
	yield* g.srcCall(f, "add_overlay", "fab-active");
	rt.setSv(f, "use_power", 2);
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.srcCall(f, "get_construction_time_w_coeff", live(D)))]);
	rt.setSv(f, "use_power", 1);
	yield* g.srcCall(f, "cut_overlay", "fab-active");
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	location = rt.getStep(f, live(f.src), rt.sv(f, "dir"));
	rt.setFv(f, "materials", (I = (yield* g.new_(f, rt.fv(f, "build_path", live(D)), [live(location)]))), live(res_coef));
	yield* g.srcCall(f, "say", fmt("＄！ is complete.", [live(I)]));
	rt.setSv(f, "being_built", null);
	yield* g.srcCall(f, "updateUsrDialog");
	return 1;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/update_queue_on_page  (code/game/mecha/mech_fabricator.dm:176)
rt.def("/obj/machinery/mecha_part_fabricator/proc/update_queue_on_page", function update_queue_on_page(f: Frame) {
	rt.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return live(f.dot);
});

// /obj/machinery/mecha_part_fabricator/proc/add_part_set_to_queue  (code/game/mecha/mech_fabricator.dm:180)
rt.def("/obj/machinery/mecha_part_fabricator/proc/add_part_set_to_queue", function add_part_set_to_queue(f: Frame, set_name: Value) {
	let v: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [v, D, $e];
	if (!truthy((rt.isIn(f, live(set_name), rt.sv(f, "part_sets")) ? 1 : 0))) return f.dot;
	v = null;
	rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "build_type", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v)))), 16))) {
			if (truthy((rt.isIn(f, live(set_name), rt.fv(f, "category", live(D))) ? 1 : 0))) {
				rt.callSrc(f, "add_to_queue", [live(D)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/mecha_part_fabricator/proc/add_to_queue  (code/game/mecha/mech_fabricator.dm:188)
rt.def("/obj/machinery/mecha_part_fabricator/proc/add_to_queue", function add_to_queue(f: Frame, D: Value) {
	if (!truthy((rt.istype(rt.sv(f, "queue"), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "queue", rt.list());
	}
	if (truthy(live(D)) && rt.len(f, rt.sv(f, "queue")) < 100) { // tg_js: queue capped (partset_to_queue in a loop grew it without end)
		rt.setAt(rt.sv(f, "queue"), rt.incField(f, rt.sv(f, "queue"), "len", 1, false), live(D));
	}
	return rt.len(f, rt.sv(f, "queue"));
});

// /obj/machinery/mecha_part_fabricator/proc/remove_from_queue  (code/game/mecha/mech_fabricator.dm:195)
rt.def("/obj/machinery/mecha_part_fabricator/proc/remove_from_queue", function remove_from_queue(f: Frame, index: Value) {
	f.vars = () => [index];
	if ((((!truthy(rt.call(f, P("/proc/isnum"), null, [live(index)])) || !truthy(rt.call(f, P("/proc/IsInteger"), null, [live(index)]))) || !truthy((rt.istype(rt.sv(f, "queue"), T("/list")) ? 1 : 0))) || (rt.lt(live(index), 1) || rt.gt(live(index), rt.len(f, rt.sv(f, "queue")))))) {
		return 0;
	}
	rt.callName(f, rt.sv(f, "queue"), "Cut", [live(index), (index = rt.inc(live(index), 1))]);
	return 1;
});

// /obj/machinery/mecha_part_fabricator/proc/process_queue  (code/game/mecha/mech_fabricator.dm:201)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/process_queue", function* process_queue(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	if (!truthy((D = rt.index(rt.sv(f, "queue"), 1)))) {
		yield* g.srcCall(f, "remove_from_queue", 1);
		if (truthy(rt.len(f, rt.sv(f, "queue")))) {
			return (yield* g.srcCall(f, "process_queue"));
		}
		return live(f.dot);
	}
	rt.setSv(f, "temp", null);
	while (truthy(live(D))) {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			return 0;
		}
		if (!truthy((yield* g.srcCall(f, "check_resources", live(D))))) {
			yield* g.srcCall(f, "say", "Not enough resources. Queue processing stopped.");
			rt.setSv(f, "temp", fmt("<span class='alert'>Not enough resources to build next part.</span><br>\n\t\t\t\t\t\t<a href='?src=＃;process_queue=1'>Try again</a> | <a href='?src=＃;clear_temp=1'>Return</a><a>", [live(f.src), live(f.src)]));
			return 0;
		}
		yield* g.srcCall(f, "remove_from_queue", 1);
		yield* g.srcCall(f, "build_part", live(D));
		D = (yield* g.call(f, P("/proc/listgetindex"), null, [rt.sv(f, "queue"), 1]));
	}
	yield* g.srcCall(f, "say", "Queue processing finished successfully.");
	return f.dot;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/list_queue  (code/game/mecha/mech_fabricator.dm:223)
rt.def("/obj/machinery/mecha_part_fabricator/proc/list_queue", function list_queue(f: Frame) {
	let output: Value = null, i: Value = null, D: Value = null, part: Value = null;
	let $0: any, $e: any;
	f.vars = () => [output, i, D, part, $0, $e];
	output = "<b>Queue contains:</b>";
	if ((!truthy((rt.istype(rt.sv(f, "queue"), T("/list")) ? 1 : 0)) || !truthy(rt.len(f, rt.sv(f, "queue"))))) {
		output = rt.modify(live(output), "<br>Nothing", add);
	} else {
		output = rt.modify(live(output), "<ol>", add);
		i = 0;
		D = null;
		rt.forList(f, 0, rt.sv(f, "queue"), T("/datum/design"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			i = rt.inc(live(i), 1);
			part = rt.fv(f, "build_path", live(D));
			if (!truthy(rt.callSrc(f, "check_resources", [live(D)]))) {
				$0 = " style='color: #f00;'";
			} else {
				$0 = null;
			}
			output = rt.modify(live(output), fmt("<li＀>", [$0]), add);
			output = rt.modify(live(output), add(rt.initial(f, live(part), "name"), " - "), add);
			if (rt.gt(live(i), 1)) {
				$0 = fmt("<a href='?src=＃;queue_move=-1;index=＀' class='arrow'>&uarr;</a>", [live(f.src), live(i)]);
			} else {
				$0 = null;
			}
			output = rt.modify(live(output), fmt("＀ ", [$0]), add);
			if (rt.lt(live(i), rt.len(f, rt.sv(f, "queue")))) {
				$0 = fmt("<a href='?src=＃;queue_move=+1;index=＀' class='arrow'>&darr;</a>", [live(f.src), live(i)]);
			} else {
				$0 = null;
			}
			output = rt.modify(live(output), fmt("＀ ", [$0]), add);
			output = rt.modify(live(output), fmt("<a href='?src=＃;remove_from_queue=＀'>Remove</a></li>", [live(f.src), live(i)]), add);
		}
		rt.endFor(f, 0);
		output = rt.modify(live(output), "</ol>", add);
		output = rt.modify(live(output), fmt("[<a href='?src=＃;process_queue=1'>Process queue</a> | <a href='?src=＃;clear_queue=1'>Clear queue</a>]", [live(f.src), live(f.src)]), add);
	}
	return live(output);
});

// /obj/machinery/mecha_part_fabricator/proc/sync  (code/game/mecha/mech_fabricator.dm:243)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/sync", function* sync(f: Frame) {
	let RDC: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [RDC, v, _T, D, $e];
	rt.setSv(f, "temp", "Updating local R&D database...");
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	RDC = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [7, live(f.src)])), T("/obj/machinery/computer/rdconsole"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RDC = $e;
		if (!truthy(rt.fv(f, "sync", live(RDC)))) {
			continue;
		}
		v = null;
		rt.forList(f, 1, rt.gv(f, "known_tech", rt.fv(f, "files", live(RDC))));
		while (($e = rt.next(f, 1)) !== undefined) {
			v = $e;
			_T = rt.index(rt.gv(f, "known_tech", rt.fv(f, "files", live(RDC))), live(v));
			yield* g.callName(f, rt.sv(f, "files"), "AddTech2Known", [live(_T)]);
		}
		rt.endFor(f, 1);
		v = null;
		rt.forList(f, 1, rt.gv(f, "known_designs", rt.fv(f, "files", live(RDC))));
		while (($e = rt.next(f, 1)) !== undefined) {
			v = $e;
			D = rt.index(rt.gv(f, "known_designs", rt.fv(f, "files", live(RDC))), live(v));
			yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(D)]);
		}
		rt.endFor(f, 1);
		yield* g.callName(f, rt.sv(f, "files"), "RefreshResearch", []);
		rt.setSv(f, "temp", "Processed equipment designs.<br>");
		rt.modSrcVar(f, "temp", fmt("<a href='?src=＃;clear_temp=1'>Return</a>", [live(f.src)]), add);
		yield* g.srcCall(f, "updateUsrDialog");
		yield* g.srcCall(f, "say", "Successfully synchronized with R&D server.");
		return live(f.dot);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "temp", fmt("Unable to connect to local R&D Database.<br>Please check your connections and try again.<br><a href='?src=＃;clear_temp=1'>Return</a>", [live(f.src)]));
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true);

// /obj/machinery/mecha_part_fabricator/proc/get_resource_cost_w_coeff  (code/game/mecha/mech_fabricator.dm:270)
rt.def("/obj/machinery/mecha_part_fabricator/proc/get_resource_cost_w_coeff", function get_resource_cost_w_coeff(f: Frame, D: Value, resource: Value, roundto: Value) {
	f.vars = () => [roundto];
	if (live(roundto) === null) {
		roundto = 1;
	}
	return rt.call(f, P("/proc/round"), null, [multiply(rt.index(rt.fv(f, "materials", live(D)), live(resource)), rt.sv(f, "component_coeff")), live(roundto)]);
});

// /obj/machinery/mecha_part_fabricator/proc/get_construction_time_w_coeff  (code/game/mecha/mech_fabricator.dm:273)
rt.def("/obj/machinery/mecha_part_fabricator/proc/get_construction_time_w_coeff", function get_construction_time_w_coeff(f: Frame, D: Value, roundto: Value) {
	f.vars = () => [roundto];
	if (live(roundto) === null) {
		roundto = 1;
	}
	return rt.call(f, P("/proc/round"), null, [multiply(rt.initial(f, live(D), "construction_time"), rt.sv(f, "time_coeff")), live(roundto)]);
});

// /obj/machinery/mecha_part_fabricator/proc/attack_hand  (code/game/mecha/mech_fabricator.dm:276)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	return (yield* g.srcCall(f, "interact", live(f.args[0])));
}, true, { args: ["user"] });

// /obj/machinery/mecha_part_fabricator/proc/interact  (code/game/mecha/mech_fabricator.dm:281)  may sleep
// tg_js: opens the `mecha_fabricator` tgui window instead of the hand-built HTML page (the exit-obstructed check stays).
rt.def("/obj/machinery/mecha_part_fabricator/proc/interact", function* interact(f: Frame) {
	let exit: Value = null;
	f.vars = () => [exit];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	if (truthy(rt.gv(f, "density", (exit = rt.getStep(f, live(f.src), rt.sv(f, "dir")))))) {
		yield* g.srcCall(f, "say", "Error! Part outlet is obstructed.");
		return live(f.dot);
	}
	yield* g.srcCall(f, "ui_interact", live(f.args[0]));
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/mecha_part_fabricator/proc/ui_interact  (tg_js)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "mecha_fabricator", rt.sv(f, "name"), 900, 600, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/ui_data  (tg_js)
// screen main|parts, part_sets, parts [{id,name,desc,cost,time,can_build}] of the chosen set, queue [{name,can_build}], materials [{id,name,amount}], being_built, processing_queue.
rt.def("/obj/machinery/mecha_part_fabricator/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, E: Value = null, v: Value = null, D: Value = null, sets: Value = null, parts: Value = null, queue: Value = null, mats: Value = null, ps: Value = null, mid: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [user, data, E, v, D, sets, parts, queue, mats, ps, mid, M, $e];
	data = rt.list();
	const screen = truthy(rt.sv(f, "being_built")) ? "main" : String(rt.sv(f, "screen") ?? "main");
	rt.setAt(live(data), "screen", screen);
	rt.setAt(live(data), "part_set", rt.sv(f, "part_set"));
	rt.setAt(live(data), "processing_queue", truthy(rt.sv(f, "processing_queue")) ? 1 : 0);
	rt.setAt(live(data), "being_built", truthy(rt.sv(f, "being_built")) ? rt.initial(f, rt.fv(f, "build_path", rt.sv(f, "being_built")), "name") : null);
	sets = rt.list();
	ps = null;
	rt.forList(f, 0, rt.sv(f, "part_sets"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ps = $e;
		rt.modify(live(sets), rt.list(live(ps)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "part_sets", live(sets));
	mats = rt.list();
	mid = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mid = $e;
		M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mid));
		E = rt.list();
		rt.setAt(live(E), "id", live(mid));
		rt.setAt(live(E), "name", rt.gv(f, "name", live(M)));
		rt.setAt(live(E), "amount", rt.fv(f, "amount", live(M)));
		rt.modify(live(mats), rt.list(live(E)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "materials", live(mats));
	parts = rt.list();
	if (screen === "parts" && truthy(rt.sv(f, "part_set"))) {
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
			if (!truthy(rt.bitAnd(rt.gv(f, "build_type", live(D)), 16))) continue;
			if (!truthy((rt.isIn(f, rt.sv(f, "part_set"), rt.fv(f, "category", live(D))) ? 1 : 0))) continue;
			E = rt.list();
			rt.setAt(live(E), "id", rt.fv(f, "id", live(D)));
			rt.setAt(live(E), "name", rt.initial(f, live(D), "name"));
			rt.setAt(live(E), "desc", rt.initial(f, rt.fv(f, "build_path", live(D)), "desc"));
			rt.setAt(live(E), "cost", rt.callSrc(f, "output_part_cost", [live(D)]));
			rt.setAt(live(E), "time", divide(rt.callSrc(f, "get_construction_time_w_coeff", [live(D)]), 10));
			rt.setAt(live(E), "can_build", truthy(rt.callSrc(f, "check_resources", [live(D)])) ? 1 : 0);
			rt.modify(live(parts), rt.list(live(E)), add);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "parts", live(parts));
	queue = rt.list();
	let qi = 0;
	if (truthy((rt.istype(rt.sv(f, "queue"), T("/list")) ? 1 : 0))) {
		D = null;
		rt.forList(f, 0, rt.sv(f, "queue"), T("/datum/design"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			E = rt.list();
			rt.setAt(live(E), "index", ++qi);
			rt.setAt(live(E), "name", rt.initial(f, rt.fv(f, "build_path", live(D)), "name"));
			rt.setAt(live(E), "can_build", truthy(rt.callSrc(f, "check_resources", [live(D)])) ? 1 : 0);
			rt.modify(live(queue), rt.list(live(E)), add);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "queue", live(queue));
	return live(data);
}, true);

// /obj/machinery/mecha_part_fabricator/proc/ui_act  (tg_js)  may sleep
// Every action is routed to the old Topic (its checks and logic), then the windows are refreshed.
rt.def("/obj/machinery/mecha_part_fabricator/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	const p = (k: string) => fmt("＀", [rt.at(live(params), k)]);
	let href: any[] | null = null;
	switch (action) {
		case "part_set": href = ["part_set", p("set")]; break;
		case "back": href = ["part_set", "clear", "screen", "main"]; break;
		case "build": href = ["part", p("id")]; break;
		case "add_to_queue": href = ["add_to_queue", p("id")]; break;
		case "partset_to_queue": href = ["partset_to_queue", p("set")]; break;
		case "remove_from_queue": href = ["remove_from_queue", p("index")]; break;
		case "queue_move": href = ["queue_move", p("dir"), "index", p("index")]; break;
		case "process_queue": href = ["process_queue", 1]; break;
		case "clear_queue": href = ["clear_queue", 1]; break;
		case "sync": href = ["sync", 1]; break;
		case "remove_mat": href = ["remove_mat", p("amount"), "material", p("material")]; break;
	}
	if (href === null) {
		return 0;
	}
	yield* g.srcCall(f, "Topic", "", rt.alist(f, href));
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/machinery/mecha_part_fabricator/proc/Topic  (code/game/mecha/mech_fabricator.dm:339)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/Topic", function* Topic(f: Frame) {
	let filter: Value = null, tpart_set: Value = null, _T: Value = null, v: Value = null, D: Value = null, index: Value = null, new_index: Value = null, part: Value = null;
	let $e: any;
	f.vars = () => [filter, tpart_set, _T, v, D, index, new_index, part, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	filter = (yield* g.new_(f, T("/datum/topic_input"), [live(f.args[0]), live(f.args[1])]));
	if (truthy(rt.at(live(f.args[1]), "part_set"))) {
		if (truthy((tpart_set = (yield* g.callName(f, live(filter), "getStr", ["part_set"]))))) {
			if (isEqual(live(tpart_set), "clear")) {
				rt.setSv(f, "part_set", null);
			} else if (truthy((rt.isIn(f, live(tpart_set), rt.sv(f, "part_sets")) ? 1 : 0))) { // tg_js: only a set the machine has (any text was accepted)
				rt.setSv(f, "part_set", live(tpart_set));
				rt.setSv(f, "screen", "parts");
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "part"))) {
		_T = (yield* g.callName(f, live(filter), "getStr", ["part"]));
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (truthy(rt.bitAnd(rt.gv(f, "build_type", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v)))), 16))) {
				if (isEqual(rt.fv(f, "id", live(D)), live(_T))) {
					if (!truthy(rt.sv(f, "processing_queue"))) {
						// tg_js: the page only offers Build when the materials are there and nothing is being built; an href didn't care (free parts, two builds at once)
						if (truthy(rt.sv(f, "being_built")) || !truthy(rt.callSrc(f, "check_resources", [live(D)]))) {
							break;
						}
						yield* g.srcCall(f, "build_part", live(D));
					} else {
						yield* g.srcCall(f, "add_to_queue", live(D));
					}
					break;
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.at(live(f.args[1]), "add_to_queue"))) {
		_T = (yield* g.callName(f, live(filter), "getStr", ["add_to_queue"]));
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (truthy(rt.bitAnd(rt.gv(f, "build_type", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v)))), 16))) {
				if (isEqual(rt.fv(f, "id", live(D)), live(_T))) {
					yield* g.srcCall(f, "add_to_queue", live(D));
					break;
				}
			}
		}
		rt.endFor(f, 0);
		return (yield* g.srcCall(f, "update_queue_on_page"));
	}
	if (truthy(rt.at(live(f.args[1]), "remove_from_queue"))) {
		yield* g.srcCall(f, "remove_from_queue", (yield* g.callName(f, live(filter), "getNum", ["remove_from_queue"])));
		return (yield* g.srcCall(f, "update_queue_on_page"));
	}
	if (truthy(rt.at(live(f.args[1]), "partset_to_queue"))) {
		yield* g.srcCall(f, "add_part_set_to_queue", (yield* g.callName(f, live(filter), "get", ["partset_to_queue"])));
		return (yield* g.srcCall(f, "update_queue_on_page"));
	}
	if (truthy(rt.at(live(f.args[1]), "process_queue"))) {
		rt.spawnTail(f, 0, "/obj/machinery/mecha_part_fabricator/proc/Topic: spawn at game/mecha/mech_fabricator.dm:377", filter, tpart_set, _T, v, D, index, new_index, part);
	}
	if (truthy(rt.at(live(f.args[1]), "clear_temp"))) {
		rt.setSv(f, "temp", null);
	}
	if (truthy(rt.at(live(f.args[1]), "screen"))) {
		const sc = rt.at(live(f.args[1]), "screen"); // tg_js: only the two screens the window knows
		if (sc === "main" || sc === "parts") rt.setSv(f, "screen", sc);
	}
	if ((truthy(rt.at(live(f.args[1]), "queue_move")) && truthy(rt.at(live(f.args[1]), "index")))) {
		index = (yield* g.callName(f, live(filter), "getNum", ["index"]));
		new_index = add(live(index), (yield* g.callName(f, live(filter), "getNum", ["queue_move"])));
		if ((((truthy((yield* g.call(f, P("/proc/isnum"), null, [live(index)]))) && truthy((yield* g.call(f, P("/proc/isnum"), null, [live(new_index)])))) && truthy((yield* g.call(f, P("/proc/IsInteger"), null, [live(index)])))) && truthy((yield* g.call(f, P("/proc/IsInteger"), null, [live(new_index)]))))) {
			// tg_js: index itself must be in the queue too (Swap with 0 or 99 runtimed), and the queue must be a list
			if (truthy((rt.istype(rt.sv(f, "queue"), T("/list")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/IsInRange"), null, [live(index), 1, rt.len(f, rt.sv(f, "queue"))]))) && truthy((yield* g.call(f, P("/proc/IsInRange"), null, [live(new_index), 1, rt.len(f, rt.sv(f, "queue"))])))) {
				yield* g.callName(f, rt.sv(f, "queue"), "Swap", [live(index), live(new_index)]);
			}
		}
		return (yield* g.srcCall(f, "update_queue_on_page"));
	}
	if (truthy(rt.at(live(f.args[1]), "clear_queue"))) {
		rt.setSv(f, "queue", rt.list());
		return (yield* g.srcCall(f, "update_queue_on_page"));
	}
	if (truthy(rt.at(live(f.args[1]), "sync"))) {
		yield* g.srcCall(f, "sync");
	}
	if (truthy(rt.at(live(f.args[1]), "part_desc"))) {
		_T = (yield* g.callName(f, live(filter), "getStr", ["part_desc"]));
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (truthy(rt.bitAnd(rt.gv(f, "build_type", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v)))), 16))) {
				if (isEqual(rt.fv(f, "id", live(D)), live(_T))) {
					rt.setSv(f, "temp", fmt("<h1>＀ description:</h1>\n\t\t\t\t\t\t\t\t＀<br>\n\t\t\t\t\t\t\t\t<a href='?src=＃;clear_temp=1'>Return</a>\n\t\t\t\t\t\t\t\t", [rt.initial(f, (part = rt.fv(f, "build_path", live(D))), "name"), rt.initial(f, live(part), "desc"), live(f.src)]));
					break;
				}
			}
		}
		rt.endFor(f, 0);
	}
	if ((truthy(rt.at(live(f.args[1]), "remove_mat")) && truthy(rt.at(live(f.args[1]), "material")))) {
		yield* g.callName(f, rt.sv(f, "materials"), "retrieve_sheets", [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "remove_mat")])), rt.at(live(f.args[1]), "material")]);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// a spawn(0) body of /obj/machinery/mecha_part_fabricator/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/mecha_part_fabricator/proc/Topic: spawn at game/mecha/mech_fabricator.dm:377", function* (f: Frame, filter: Value, tpart_set: Value, _T: Value, v: Value, D: Value, index: Value, new_index: Value, part: Value) {
	f.vars = () => [filter, tpart_set, _T, v, D, index, new_index, part];
	if ((truthy(rt.sv(f, "processing_queue")) || truthy(rt.sv(f, "being_built")))) {
		return 0;
	}
	rt.setSv(f, "processing_queue", 1);
	yield* g.srcCall(f, "process_queue");
	rt.setSv(f, "processing_queue", 0);
	return null;
});

// /obj/machinery/mecha_part_fabricator/proc/on_deconstruction  (code/game/mecha/mech_fabricator.dm:419)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/attackby  (code/game/mecha/mech_fabricator.dm:423)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/attackby", function* attackby(f: Frame) {
	let material_amount: Value = null, inserted: Value = null, mat_overlay: Value = null;
	f.vars = () => [material_amount, inserted, mat_overlay];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "fab-o", "fab-idle", live(f.args[0]))))) {
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "is_insertion_ready", live(f.args[1]))))) {
			return 1;
		}
		material_amount = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(f.args[0])]));
		if (!truthy((yield* g.srcCall(f, "try_insert", live(f.args[1]), live(f.args[0]), live(material_amount))))) {
			return 1;
		}
		if (truthy((inserted = (yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [live(f.args[0])]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ sheet５ into ＀.</span>", [live(inserted), live(f.src)])]);
			if ((truthy(live(f.args[0])) && truthy(rt.getLen(f, rt.fv(f, "materials", live(f.args[0])))))) {
				if (!(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0]))))) {
					yield* g.callName(f, live(f.args[1]), "put_in_active_hand", [live(f.args[0])]);
				}
				yield* g.srcCall(f, "add_overlay", (mat_overlay = fmt("fab-load-＀", [(yield* g.srcCall(f, "material2name", rt.index(rt.fv(f, "materials", live(f.args[0])), 1)))])));
				yield* g.call(f, P("/proc/sleep"), null, [10]);
				if (!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
					yield* g.srcCall(f, "cut_overlay", live(mat_overlay));
				}
			}
		}
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/ore/bluespace_crystal")) ? 1 : 0))) {
			if (!truthy((yield* g.srcCall(f, "is_insertion_ready", live(f.args[1]))))) {
				return 1;
			}
			material_amount = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(f.args[0])]));
			if (!truthy((yield* g.srcCall(f, "try_insert", live(f.args[1]), live(f.args[0]), live(material_amount))))) {
				return 1;
			}
			if (truthy((inserted = (yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [live(f.args[0])]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the ＀.</span>", [live(f.args[0]), live(f.src)])]);
				if ((truthy(live(f.args[0])) && truthy(rt.getLen(f, rt.fv(f, "materials", live(f.args[0])))))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
					yield* g.srcCall(f, "add_overlay", (mat_overlay = "fab-load-bluespace"));
					yield* g.call(f, P("/proc/sleep"), null, [10]);
					if (!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
						yield* g.srcCall(f, "cut_overlay", live(mat_overlay));
					}
				}
			}
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/mecha_part_fabricator/proc/material2name  (code/game/mecha/mech_fabricator.dm:483)
rt.def("/obj/machinery/mecha_part_fabricator/proc/material2name", function material2name(f: Frame, ID: Value) {
	return rt.call(f, P("/proc/copytext"), null, [live(ID), 2]);
});

// /obj/machinery/mecha_part_fabricator/proc/is_insertion_ready  (code/game/mecha/mech_fabricator.dm:487)
rt.def("/obj/machinery/mecha_part_fabricator/proc/is_insertion_ready", function is_insertion_ready(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't load ＀ while it's opened!</span>", [live(f.src)])]);
		return 0;
	}
	if (truthy(rt.sv(f, "being_built"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is currently processing! Please wait until completion.</span>", [live(f.src)])]);
		return 0;
	}
	return 1;
});

// /obj/machinery/mecha_part_fabricator/proc/try_insert  (code/game/mecha/mech_fabricator.dm:497)  may sleep
rt.def("/obj/machinery/mecha_part_fabricator/proc/try_insert", function* try_insert(f: Frame, user: Value, I: Value, material_amount: Value) {
	f.vars = () => [user, I, material_amount];
	if (!truthy(live(material_amount))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>This object does not contain sufficient amounts of materials to be accepted by ＀.</span>", [live(f.src)])]);
		return 0;
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_space", [live(material_amount)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is full. Please remove some materials from ＀ in order to insert more.</span>", [live(f.src), live(f.src)])]);
		return 0;
	}
	if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(I)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is stuck to you and cannot be placed into ＀.</span>", [live(I), live(f.src)])]);
		return 0;
	}
	return 1;
}, true);
