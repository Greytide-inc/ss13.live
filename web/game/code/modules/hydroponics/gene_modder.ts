// From code/modules/hydroponics/gene_modder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10921, "/obj/machinery/plantgenes", "/obj/machinery", {
	seed: null,
	disk: null,
	core_genes: null,
	reagent_genes: null,
	trait_genes: null,
	target: null,
	operation: "",
	max_potency: 50,
	max_yield: 2,
	min_production: 12,
	max_endurance: 10,
	min_wchance: 67,
	min_wrate: 10,
	anchored: 1,
	name: "plant DNA manipulator",
	desc: "An advanced device designed to manipulate plant genetic makeup.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "dnamod",
	density: 1,
});

// /obj/machinery/plantgenes/proc/<init>  (code/modules/hydroponics/gene_modder.dm:12)
rt.def("/obj/machinery/plantgenes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "core_genes", rt.list());
	$0 = $0;
	rt.setSv(f, "reagent_genes", rt.list());
	$0 = $0;
	rt.setSv(f, "trait_genes", rt.list());
	return f.dot;
});

// /obj/machinery/plantgenes/proc/New  (code/modules/hydroponics/gene_modder.dm:26)  may sleep
rt.def("/obj/machinery/plantgenes/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/plantgenes"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6756, "/obj/item/weapon/circuitboard/machine/plantgenes", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Plant DNA Manipulator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/plantgenes"),
	origin_tech: "programming=3;biotech=3",
});

// /obj/item/weapon/circuitboard/machine/plantgenes/proc/<init>  (code/modules/hydroponics/gene_modder.dm:34)
rt.def("/obj/item/weapon/circuitboard/machine/plantgenes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/scanning_module"), 1]));
	return f.dot;
});

// /obj/machinery/plantgenes/proc/RefreshParts  (code/modules/hydroponics/gene_modder.dm:41)
rt.def("/obj/machinery/plantgenes/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null, SM: Value = null, ML: Value = null, wratemod: Value = null, vaultcheck: Value = null;
	let $e: any;
	f.vars = () => [M, SM, ML, wratemod, vaultcheck, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (rt.gt(rt.fv(f, "rating", live(M)), 3)) {
			rt.setSv(f, "max_potency", 95);
		} else {
			rt.setSv(f, "max_potency", add(rt.initial(f, live(f.src), "max_potency"), rt.power(rt.fv(f, "rating", live(M)), 3)));
		}
		rt.setSv(f, "max_yield", add(rt.initial(f, live(f.src), "max_yield"), multiply(rt.fv(f, "rating", live(M)), 2)));
	}
	rt.endFor(f, 0);
	SM = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/scanning_module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SM = $e;
		if (rt.gt(rt.fv(f, "rating", live(SM)), 3)) {
			rt.setSv(f, "min_production", 1);
		} else {
			rt.setSv(f, "min_production", subtract(12, multiply(rt.fv(f, "rating", live(SM)), 3)));
		}
		rt.setSv(f, "max_endurance", add(rt.initial(f, live(f.src), "max_endurance"), multiply(rt.fv(f, "rating", live(SM)), 25)));
	}
	rt.endFor(f, 0);
	ML = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ML = $e;
		wratemod = multiply(rt.fv(f, "rating", live(ML)), 2.5);
		rt.setSv(f, "min_wrate", rt.call(f, P("/proc/Floor"), null, [subtract(10, live(wratemod)), 1]));
		rt.setSv(f, "min_wchance", subtract(67, multiply(rt.fv(f, "rating", live(ML)), 16)));
	}
	rt.endFor(f, 0);
	vaultcheck = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/circuitboard/machine/plantgenes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		vaultcheck = $e;
		if (truthy((rt.istype(live(vaultcheck), T("/obj/item/weapon/circuitboard/machine/plantgenes/vault")) ? 1 : 0))) {
			rt.setSv(f, "max_potency", 100);
			rt.setSv(f, "max_yield", 10);
			rt.setSv(f, "min_production", 1);
			rt.setSv(f, "max_endurance", 100);
			rt.setSv(f, "min_wchance", 0);
			rt.setSv(f, "min_wrate", 0);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/plantgenes/proc/update_icon  (code/modules/hydroponics/gene_modder.dm:71)
rt.def("/obj/machinery/plantgenes/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.setSv(f, "icon_state", "dnamod-off");
	} else {
		rt.setSv(f, "icon_state", "dnamod");
	}
	if (truthy(rt.sv(f, "seed"))) {
		rt.callSrc(f, "add_overlay", ["dnamod-dna"]);
	}
	if (!truthy(rt.sv(f, "panel_open"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["dnamod-open"]);
	return f.dot;
});

// /obj/machinery/plantgenes/proc/attackby  (code/modules/hydroponics/gene_modder.dm:83)  may sleep
rt.def("/obj/machinery/plantgenes/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "dnamod", "dnamod", live(f.args[0]))))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/seeds")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "seed"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A sample is already loaded into the machine!</span>"]);
		} else {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.srcCall(f, "insert_seed", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the machine.</span>", [live(f.args[0])])]);
			yield* g.srcCall(f, "interact", live(f.args[1]));
		}
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/plantgene")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "disk"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A data disk is already loaded into the machine!</span>"]);
			} else {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setSv(f, "disk", live(f.args[0]));
				rt.setFv(f, "loc", rt.sv(f, "disk"), live(f.src));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the machine.</span>", [live(f.args[0])])]);
				yield* g.srcCall(f, "interact", live(f.args[1]));
			}
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/plantgenes/proc/attack_hand  (code/modules/hydroponics/gene_modder.dm:118)  may sleep
rt.def("/obj/machinery/plantgenes/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/plantgenes/proc/interact  (code/modules/hydroponics/gene_modder.dm:123)  may sleep
rt.def("/obj/machinery/plantgenes/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null, dat: Value = null, gene: Value = null, can_insert: Value = null, can_extract: Value = null, a: Value = null, G: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, popup, dat, gene, can_insert, can_extract, a, G, $0, $e];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "plantdna", "Plant DNA Manipulator", 450, 600]));
	if (!(rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0)))) {
		yield* g.callName(f, live(popup), "close", []);
		return live(f.dot);
	}
	dat = "";
	if (truthy(rt.sv(f, "operation"))) {
		if ((!truthy(rt.sv(f, "seed")) || (!truthy(rt.sv(f, "target")) && !isEqual(rt.sv(f, "operation"), "insert")))) {
			rt.setSv(f, "operation", "");
			rt.setSv(f, "target", null);
			yield* g.srcCall(f, "interact", live(user));
			return live(f.dot);
		}
		if (((isEqual(rt.sv(f, "operation"), "replace") || isEqual(rt.sv(f, "operation"), "insert")) && (!truthy(rt.sv(f, "disk")) || !truthy(rt.fv(f, "gene", rt.sv(f, "disk")))))) {
			rt.setSv(f, "operation", "");
			rt.setSv(f, "target", null);
			yield* g.srcCall(f, "interact", live(user));
			return live(f.dot);
		}
		dat = rt.modify(live(dat), "<div class='line'><h3>Confirm Operation</h3></div>", add);
		dat = rt.modify(live(dat), fmt("<div class='statusDisplay'>Are you sure you want to ＀ ", [rt.sv(f, "operation")]), add);
		$0 = rt.sv(f, "operation");
		if ($0 === "remove") {
			dat = rt.modify(live(dat), fmt("<span class='highlight'>＀</span> gene from ％<span class='highlight'>！</span>?<br>", [(yield* g.callName(f, rt.sv(f, "target"), "get_name", [])), rt.sv(f, "seed")]), add);
		} else if ($0 === "extract") {
			dat = rt.modify(live(dat), fmt("<span class='highlight'>＀</span> gene from ％<span class='highlight'>！</span>?<br>", [(yield* g.callName(f, rt.sv(f, "target"), "get_name", [])), rt.sv(f, "seed")]), add);
			dat = rt.modify(live(dat), "<span class='bad'>The sample will be destroyed in process!</span>", add);
			if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core")) ? 1 : 0))) {
				gene = rt.sv(f, "target");
				if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/potency")) ? 1 : 0))) {
					if (rt.gt(rt.fv(f, "value", live(gene)), rt.sv(f, "max_potency"))) {
						dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> potency. ", [rt.sv(f, "max_potency")]), add);
						dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> potency on extraction.", [rt.sv(f, "max_potency")]), add);
					}
				} else {
					if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/lifespan")) ? 1 : 0))) {
						if (rt.gt(rt.fv(f, "value", live(gene)), rt.sv(f, "max_endurance"))) {
							dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> lifespan. ", [rt.sv(f, "max_endurance")]), add);
							dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> Lifespan on extraction.", [rt.sv(f, "max_endurance")]), add);
						}
					} else {
						if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/endurance")) ? 1 : 0))) {
							if (rt.gt(rt.fv(f, "value", live(gene)), rt.sv(f, "max_endurance"))) {
								dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> endurance. ", [rt.sv(f, "max_endurance")]), add);
								dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> endurance on extraction.", [rt.sv(f, "max_endurance")]), add);
							}
						} else {
							if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/yield")) ? 1 : 0))) {
								if (rt.gt(rt.fv(f, "value", live(gene)), rt.sv(f, "max_yield"))) {
									dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> yield. ", [rt.sv(f, "max_yield")]), add);
									dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> yield on extraction.", [rt.sv(f, "max_yield")]), add);
								}
							} else {
								if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/production")) ? 1 : 0))) {
									if (rt.lt(rt.fv(f, "value", live(gene)), rt.sv(f, "min_production"))) {
										dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> production. ", [rt.sv(f, "min_production")]), add);
										dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> production on extraction.", [rt.sv(f, "min_production")]), add);
									}
								} else {
									if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/weed_rate")) ? 1 : 0))) {
										if (rt.lt(rt.fv(f, "value", live(gene)), rt.sv(f, "min_wrate"))) {
											dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> weed rate. ", [rt.sv(f, "min_wrate")]), add);
											dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> weed rate on extraction.", [rt.sv(f, "min_wrate")]), add);
										}
									} else {
										if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/plant_gene/core/weed_chance")) ? 1 : 0))) {
											if (rt.lt(rt.fv(f, "value", live(gene)), rt.sv(f, "min_wchance"))) {
												dat = rt.modify(live(dat), fmt("<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>＀</span> weed chance. ", [rt.sv(f, "min_wchance")]), add);
												dat = rt.modify(live(dat), fmt("Target gene will be degraded to <span class='highlight'>＀</span> weed chance on extraction.", [rt.sv(f, "min_wchance")]), add);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		} else if ($0 === "replace") {
			dat = rt.modify(live(dat), fmt("<span class='highlight'>＀</span> gene with <span class='highlight'>＀</span>?<br>", [(yield* g.callName(f, rt.sv(f, "target"), "get_name", [])), (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "get_name", []))]), add);
		} else if ($0 === "insert") {
			dat = rt.modify(live(dat), fmt("<span class='highlight'>＀</span> gene into ％<span class='highlight'>！</span>?<br>", [(yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "get_name", [])), rt.sv(f, "seed")]), add);
		}
		dat = rt.modify(live(dat), fmt("</div><div class='line'><a href='?src=＃;gene=＃;op=＀'>Confirm</a> ", [live(f.src), rt.sv(f, "target"), rt.sv(f, "operation")]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;abort=1'>Abort</a></div>", [live(f.src)]), add);
		yield* g.callName(f, live(popup), "set_content", [live(dat)]);
		yield* g.callName(f, live(popup), "open", []);
		return live(f.dot);
	}
	dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
	dat = rt.modify(live(dat), fmt("<div class='line'><div class='statusLabel'>Plant Sample:</div><div class='statusValue'><a href='?src=＃;eject_seed=1'>", [live(f.src)]), add);
	if (truthy(rt.sv(f, "seed"))) {
		$0 = rt.fv(f, "name", rt.sv(f, "seed"));
	} else {
		$0 = "None";
	}
	dat = rt.modify(live(dat), $0, add);
	dat = rt.modify(live(dat), "</a></div></div>", add);
	dat = rt.modify(live(dat), fmt("<div class='line'><div class='statusLabel'>Data Disk:</div><div class='statusValue'><a href='?src=＃;eject_disk=1'>", [live(f.src)]), add);
	if (!truthy(rt.sv(f, "disk"))) {
		dat = rt.modify(live(dat), "None", add);
	} else {
		if (!truthy(rt.fv(f, "gene", rt.sv(f, "disk")))) {
			dat = rt.modify(live(dat), "Empty Disk", add);
		} else {
			dat = rt.modify(live(dat), (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "get_name", [])), add);
		}
	}
	if ((truthy(rt.sv(f, "disk")) && truthy(rt.fv(f, "read_only", rt.sv(f, "disk"))))) {
		dat = rt.modify(live(dat), " (RO)", add);
	}
	dat = rt.modify(live(dat), "</a></div></div>", add);
	dat = rt.modify(live(dat), "<br></div>", add);
	if (truthy(rt.sv(f, "seed"))) {
		can_insert = ((rt.sv(f, "disk") && rt.fv(f, "gene", rt.sv(f, "disk"))) && (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "can_add", [rt.sv(f, "seed")])));
		can_extract = (rt.sv(f, "disk") && (!truthy(rt.fv(f, "read_only", rt.sv(f, "disk"))) ? 1 : 0));
		dat = rt.modify(live(dat), "<div class='line'><h3>Core Genes</h3></div><div class='statusDisplay'><table>", add);
		a = null;
		rt.forList(f, 0, rt.sv(f, "core_genes"));
		while (($e = rt.next(f, 0)) !== undefined) {
			a = $e;
			if (!truthy((G = live(a)))) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("<tr><td width='260px'>＀</td><td>", [(yield* g.callName(f, live(G), "get_name", []))]), add);
			if (truthy(live(can_extract))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;gene=＃;op=extract'>Extract</a>", [live(f.src), live(G)]), add);
			}
			if ((truthy(live(can_insert)) && truthy(rt.op(f, "IsType", [], [rt.fv(f, "gene", rt.sv(f, "disk")), rt.fv(f, "type", live(G))])))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;gene=＃;op=replace'>Replace</a>", [live(f.src), live(G)]), add);
			}
			dat = rt.modify(live(dat), "</td></tr>", add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table></div>", add);
		if (!isEqual(rt.fv(f, "yield", rt.sv(f, "seed")), -1)) {
			dat = rt.modify(live(dat), "<div class='line'><h3>Content Genes</h3></div><div class='statusDisplay'>", add);
			if (truthy(rt.len(f, rt.sv(f, "reagent_genes")))) {
				dat = rt.modify(live(dat), "<table>", add);
				a = null;
				rt.forList(f, 0, rt.sv(f, "reagent_genes"));
				while (($e = rt.next(f, 0)) !== undefined) {
					a = $e;
					dat = rt.modify(live(dat), fmt("<tr><td width='260px'>＀</td><td>", [(yield* g.callName(f, (G = live(a)), "get_name", []))]), add);
					if (truthy(live(can_extract))) {
						dat = rt.modify(live(dat), fmt("<a href='?src=＃;gene=＃;op=extract'>Extract</a>", [live(f.src), live(G)]), add);
					}
					dat = rt.modify(live(dat), fmt("<a href='?src=＃;gene=＃;op=remove'>Remove</a>", [live(f.src), live(G)]), add);
					dat = rt.modify(live(dat), "</td></tr>", add);
				}
				rt.endFor(f, 0);
				dat = rt.modify(live(dat), "</table>", add);
			} else {
				dat = rt.modify(live(dat), "No content-related genes detected in sample.<br>", add);
			}
			dat = rt.modify(live(dat), "</div>", add);
			if ((truthy(live(can_insert)) && truthy((rt.istype(rt.fv(f, "gene", rt.sv(f, "disk")), T("/datum/plant_gene/reagent")) ? 1 : 0)))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;op=insert'>Insert: ＀</a>", [live(f.src), (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "get_name", []))]), add);
			}
			dat = rt.modify(live(dat), "<div class='line'><h3>Trait Genes</h3></div><div class='statusDisplay'>", add);
			if (truthy(rt.len(f, rt.sv(f, "trait_genes")))) {
				dat = rt.modify(live(dat), "<table>", add);
				a = null;
				rt.forList(f, 0, rt.sv(f, "trait_genes"));
				while (($e = rt.next(f, 0)) !== undefined) {
					a = $e;
					dat = rt.modify(live(dat), fmt("<tr><td width='260px'>＀</td><td>", [(yield* g.callName(f, (G = live(a)), "get_name", []))]), add);
					if (truthy(live(can_extract))) {
						dat = rt.modify(live(dat), fmt("<a href='?src=＃;gene=＃;op=extract'>Extract</a>", [live(f.src), live(G)]), add);
					}
					dat = rt.modify(live(dat), fmt("<a href='?src=＃;gene=＃;op=remove'>Remove</a>", [live(f.src), live(G)]), add);
					dat = rt.modify(live(dat), "</td></tr>", add);
				}
				rt.endFor(f, 0);
				dat = rt.modify(live(dat), "</table>", add);
			} else {
				dat = rt.modify(live(dat), "No trait-related genes detected in sample.<br>", add);
			}
			if ((truthy(live(can_insert)) && truthy((rt.istype(rt.fv(f, "gene", rt.sv(f, "disk")), T("/datum/plant_gene/trait")) ? 1 : 0)))) {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;op=insert'>Insert: ＀</a>", [live(f.src), (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "get_name", []))]), add);
			}
			dat = rt.modify(live(dat), "</div>", add);
		}
	} else {
		dat = rt.modify(live(dat), "<br>No sample found.<br><span class='highlight'>Please, insert a plant sample to use this device.</span>", add);
	}
	yield* g.callName(f, live(popup), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/plantgenes/proc/Topic  (code/modules/hydroponics/gene_modder.dm:272)  may sleep
rt.def("/obj/machinery/plantgenes/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null, G: Value = null, gene: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [I, G, gene, C, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if ((truthy(rt.at(live(f.args[1]), "eject_seed")) && !truthy(rt.sv(f, "operation")))) {
		if (truthy(rt.sv(f, "seed"))) {
			rt.setFv(f, "loc", rt.sv(f, "seed"), rt.fv(f, "loc", live(f.src)));
			yield* g.callName(f, rt.sv(f, "seed"), "verb_pickup", []);
			rt.setSv(f, "seed", null);
			yield* g.srcCall(f, "update_genes");
			yield* g.srcCall(f, "update_icon");
		} else {
			if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/seeds")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.srcCall(f, "insert_seed", live(I));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You add ＀ to the machine.</span>", [live(I)])]);
			}
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		if ((truthy(rt.at(live(f.args[1]), "eject_disk")) && !truthy(rt.sv(f, "operation")))) {
			if (truthy(rt.sv(f, "disk"))) {
				rt.setFv(f, "loc", rt.sv(f, "disk"), rt.fv(f, "loc", live(f.src)));
				yield* g.callName(f, rt.sv(f, "disk"), "verb_pickup", []);
				rt.setSv(f, "disk", null);
				yield* g.srcCall(f, "update_genes");
			} else {
				if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/disk/plantgene")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "disk", live(I));
					rt.setFv(f, "loc", rt.sv(f, "disk"), live(f.src));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You add ＀ to the machine.</span>", [live(I)])]);
				}
			}
		} else {
			if ((((isEqual(rt.at(live(f.args[1]), "op"), "insert") && truthy(rt.sv(f, "disk"))) && truthy(rt.fv(f, "gene", rt.sv(f, "disk")))) && truthy(rt.sv(f, "seed")))) {
				if (!truthy(rt.sv(f, "operation"))) {
					rt.setSv(f, "operation", "insert");
				} else {
					if ((!truthy((rt.istype(rt.fv(f, "gene", rt.sv(f, "disk")), T("/datum/plant_gene/core")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "can_add", [rt.sv(f, "seed")]))))) {
						rt.modField(f, rt.sv(f, "seed"), "genes", (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "Copy", [])), add);
						if (truthy((rt.istype(rt.fv(f, "gene", rt.sv(f, "disk")), T("/datum/plant_gene/reagent")) ? 1 : 0))) {
							yield* g.callName(f, rt.sv(f, "seed"), "reagents_from_genes", []);
						}
					}
					yield* g.srcCall(f, "update_genes");
					yield* g.srcCall(f, "repaint_seed");
					rt.setSv(f, "operation", "");
					rt.setSv(f, "target", null);
				}
			} else {
				if ((truthy(rt.at(live(f.args[1]), "gene")) && truthy(rt.sv(f, "seed")))) {
					if (((!truthy((G = (yield* g.callName(f, rt.sv(f, "seed"), "get_gene", [rt.at(live(f.args[1]), "gene")])))) || !truthy(rt.at(live(f.args[1]), "op"))) || !truthy((rt.isIn(f, rt.at(live(f.args[1]), "op"), rt.list("remove", "extract", "replace")) ? 1 : 0)))) {
						yield* g.srcCall(f, "interact", live(f.usr));
						return live(f.dot);
					}
					if ((!truthy(rt.sv(f, "operation")) || !isEqual(rt.sv(f, "target"), live(G)))) {
						rt.setSv(f, "target", live(G));
						rt.setSv(f, "operation", rt.at(live(f.args[1]), "op"));
					} else {
						if ((isEqual(rt.sv(f, "operation"), rt.at(live(f.args[1]), "op")) && isEqual(rt.sv(f, "target"), live(G)))) {
							$0 = rt.at(live(f.args[1]), "op");
							if ($0 === "remove") {
								if (!truthy((rt.istype(live(G), T("/datum/plant_gene/core")) ? 1 : 0))) {
									(rt.modField(f, rt.sv(f, "seed"), "genes", live(G), subtract));
									if (truthy((rt.istype(live(G), T("/datum/plant_gene/reagent")) ? 1 : 0))) {
										yield* g.callName(f, rt.sv(f, "seed"), "reagents_from_genes", []);
									}
								}
								yield* g.srcCall(f, "repaint_seed");
							} else if ($0 === "extract") {
								if ((truthy(rt.sv(f, "disk")) && !truthy(rt.fv(f, "read_only", rt.sv(f, "disk"))))) {
									rt.setFv(f, "gene", rt.sv(f, "disk"), live(G));
									if (truthy((rt.istype(live(G), T("/datum/plant_gene/core")) ? 1 : 0))) {
										gene = live(G);
										if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/potency")) ? 1 : 0))) {
											rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "max_potency")])));
										} else {
											if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/lifespan")) ? 1 : 0))) {
												rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "max_endurance")])));
											} else {
												if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/endurance")) ? 1 : 0))) {
													rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "max_endurance")])));
												} else {
													if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/production")) ? 1 : 0))) {
														rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "min_production")])));
													} else {
														if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/yield")) ? 1 : 0))) {
															rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "max_yield")])));
														} else {
															if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/weed_rate")) ? 1 : 0))) {
																rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "min_wrate")])));
															} else {
																if (truthy((rt.istype(live(G), T("/datum/plant_gene/core/weed_chance")) ? 1 : 0))) {
																	rt.setFv(f, "value", live(gene), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "value", live(gene)), rt.sv(f, "min_wchance")])));
																}
															}
														}
													}
												}
											}
										}
									}
									yield* g.callName(f, rt.sv(f, "disk"), "update_name", []);
									yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "seed")]);
									rt.setSv(f, "seed", null);
									yield* g.srcCall(f, "update_icon");
								}
							} else if ($0 === "replace") {
								if ((((truthy(rt.sv(f, "disk")) && truthy(rt.fv(f, "gene", rt.sv(f, "disk")))) && truthy(rt.op(f, "IsType", [], [rt.fv(f, "gene", rt.sv(f, "disk")), rt.fv(f, "type", live(G))]))) && truthy((rt.istype(live(G), T("/datum/plant_gene/core")) ? 1 : 0)))) {
									(rt.modField(f, rt.sv(f, "seed"), "genes", live(G), subtract));
									C = (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "Copy", []));
									rt.modField(f, rt.sv(f, "seed"), "genes", live(C), add);
									yield* g.callName(f, live(C), "apply_stat", [rt.sv(f, "seed")]);
									yield* g.srcCall(f, "repaint_seed");
								}
							} else if ($0 === "insert") {
								if ((((truthy(rt.sv(f, "disk")) && truthy(rt.fv(f, "gene", rt.sv(f, "disk")))) && !truthy((rt.istype(rt.fv(f, "gene", rt.sv(f, "disk")), T("/datum/plant_gene/core")) ? 1 : 0))) && truthy((yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "can_add", [rt.sv(f, "seed")]))))) {
									rt.modField(f, rt.sv(f, "seed"), "genes", (yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "Copy", [])), add);
									if (truthy((rt.istype(rt.fv(f, "gene", rt.sv(f, "disk")), T("/datum/plant_gene/reagent")) ? 1 : 0))) {
										yield* g.callName(f, rt.sv(f, "seed"), "reagents_from_genes", []);
									}
									yield* g.callName(f, rt.fv(f, "gene", rt.sv(f, "disk")), "apply_vars", [rt.sv(f, "seed")]);
									yield* g.srcCall(f, "repaint_seed");
								}
							}
							yield* g.srcCall(f, "update_genes");
							rt.setSv(f, "operation", "");
							rt.setSv(f, "target", null);
						}
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "abort"))) {
						rt.setSv(f, "operation", "");
						rt.setSv(f, "target", null);
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "interact", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/plantgenes/proc/insert_seed  (code/modules/hydroponics/gene_modder.dm:385)
rt.def("/obj/machinery/plantgenes/proc/insert_seed", function insert_seed(f: Frame, S: Value) {
	if ((!truthy((rt.istype(live(S), T("/obj/item/seeds")) ? 1 : 0)) || truthy(rt.sv(f, "seed")))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(S), live(f.src));
	rt.setSv(f, "seed", live(S));
	rt.callSrc(f, "update_genes", []);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/plantgenes/proc/update_genes  (code/modules/hydroponics/gene_modder.dm:393)
rt.def("/obj/machinery/plantgenes/proc/update_genes", function update_genes(f: Frame) {
	let gene_paths: Value = null, a: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [gene_paths, a, G, $e];
	rt.setSv(f, "core_genes", rt.list());
	rt.setSv(f, "reagent_genes", rt.list());
	rt.setSv(f, "trait_genes", rt.list());
	if (!truthy(rt.sv(f, "seed"))) return f.dot;
	gene_paths = rt.list(T("/datum/plant_gene/core/potency"), T("/datum/plant_gene/core/yield"), T("/datum/plant_gene/core/production"), T("/datum/plant_gene/core/endurance"), T("/datum/plant_gene/core/lifespan"), T("/datum/plant_gene/core/weed_rate"), T("/datum/plant_gene/core/weed_chance"));
	a = null;
	rt.forList(f, 0, live(gene_paths));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		rt.modSrcVar(f, "core_genes", rt.callName(f, rt.sv(f, "seed"), "get_gene", [live(a)]), add);
	}
	rt.endFor(f, 0);
	G = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.modSrcVar(f, "reagent_genes", live(G), add);
	}
	rt.endFor(f, 0);
	G = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.modSrcVar(f, "trait_genes", live(G), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/plantgenes/proc/repaint_seed  (code/modules/hydroponics/gene_modder.dm:417)
rt.def("/obj/machinery/plantgenes/proc/repaint_seed", function repaint_seed(f: Frame) {
	if (!truthy(rt.sv(f, "seed"))) {
		return live(f.dot);
	}
	if (isEqual(rt.call(f, P("/proc/copytext"), null, [rt.fv(f, "name", rt.sv(f, "seed")), 1, 13]), "experimental")) {
		return live(f.dot);
	}
	rt.setFv(f, "name", rt.sv(f, "seed"), add("experimental ", rt.fv(f, "name", rt.sv(f, "seed"))));
	rt.setFv(f, "icon_state", rt.sv(f, "seed"), "seed-x");
	return f.dot;
});

rt.type(10922, "/obj/machinery/plantgenes/seedvault", "/obj/machinery/plantgenes", {});

// /obj/machinery/plantgenes/seedvault/proc/New  (code/modules/hydroponics/gene_modder.dm:428)  may sleep
rt.def("/obj/machinery/plantgenes/seedvault/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/plantgenes/vault"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6757, "/obj/item/weapon/circuitboard/machine/plantgenes/vault", "/obj/item/weapon/circuitboard/machine/plantgenes", {
	def_components: null,
	name: "alien board (Plant DNA Manipulator)",
	icon_state: "abductor_mod",
	origin_tech: "programming=5;biotech=5",
});

// /obj/item/weapon/circuitboard/machine/plantgenes/vault/proc/<init>  (code/modules/hydroponics/gene_modder.dm:437)
rt.def("/obj/item/weapon/circuitboard/machine/plantgenes/vault/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), T("/obj/item/weapon/stock_parts/manipulator/femto"), T("/obj/item/weapon/stock_parts/micro_laser"), T("/obj/item/weapon/stock_parts/micro_laser/quadultra"), T("/obj/item/weapon/stock_parts/scanning_module"), T("/obj/item/weapon/stock_parts/scanning_module/triphasic")]));
	return f.dot;
});

rt.type(6675, "/obj/item/weapon/disk/plantgene", "/obj/item/weapon/disk", {
	gene: null,
	read_only: 0,
	name: "plant data disk",
	desc: "A disk for storing plant genetic data.",
	icon_state: "datadisk_hydro",
	materials: null,
	unique_rename: 1,
});

// /obj/item/weapon/disk/plantgene/proc/<init>  (code/modules/hydroponics/gene_modder.dm:450)
rt.def("/obj/item/weapon/disk/plantgene/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 10]));
	return f.dot;
});

// /obj/item/weapon/disk/plantgene/proc/New  (code/modules/hydroponics/gene_modder.dm:456)  may sleep
rt.def("/obj/item/weapon/disk/plantgene/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_overlay", "datadisk_gene");
	rt.setFv(f, "pixel_x", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setFv(f, "pixel_y", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

// /obj/item/weapon/disk/plantgene/proc/update_name  (code/modules/hydroponics/gene_modder.dm:463)
rt.def("/obj/item/weapon/disk/plantgene/proc/update_name", function update_name(f: Frame) {
	if (truthy(rt.sv(f, "gene"))) {
		rt.setSv(f, "name", fmt("＀ (Plant Data Disk)", [rt.callName(f, rt.sv(f, "gene"), "get_name", [])]));
	} else {
		rt.setSv(f, "name", "plant data disk");
	}
	return f.dot;
});

// /obj/item/weapon/disk/plantgene/proc/attack_self  (code/modules/hydroponics/gene_modder.dm:468)
rt.def("/obj/item/weapon/disk/plantgene/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "read_only", (!truthy(rt.sv(f, "read_only")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.fv(f, "read_only", live(f.src)))) {
		$1 = "protected";
	} else {
		$1 = "unprotected";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You flip the write-protect tab to ＀.</span>", [$1])]);
	return f.dot;
});

// /obj/item/weapon/disk/plantgene/proc/examine  (code/modules/hydroponics/gene_modder.dm:472)
rt.def("/obj/item/weapon/disk/plantgene/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.fv(f, "read_only", live(f.src)))) {
		$1 = "protected";
	} else {
		$1 = "unprotected";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The write-protect tab is set to ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });
