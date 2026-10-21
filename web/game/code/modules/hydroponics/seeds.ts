// From code/modules/hydroponics/seeds.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9984, "/obj/item/seeds", "/obj/item", {
	plantname: "Plants",
	product: null,
	species: "",
	growing_icon: rt.rsc("icons/obj/hydroponics/growing.dmi"),
	icon_grow: null,
	icon_dead: null,
	icon_harvest: null,
	lifespan: 25,
	endurance: 15,
	maturation: 6,
	production: 6,
	yield: 3,
	potency: 10,
	growthstages: 6,
	rarity: 0,
	mutatelist: null,
	genes: null,
	reagents_add: null,
	weed_rate: 1,
	weed_chance: 5,
	w_class: 1,
	icon: rt.rsc("icons/obj/hydroponics/seeds.dmi"),
	icon_state: "seed",
	resistance_flags: 4,
});

// /obj/item/seeds/proc/<init>  (code/modules/hydroponics/seeds.dm:27)
rt.def("/obj/item/seeds/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	$0 = $0;
	rt.setSv(f, "genes", rt.list());
	$0 = $0;
	rt.setSv(f, "reagents_add", rt.list());
	return f.dot;
});

// /obj/item/seeds/proc/New  (code/modules/hydroponics/seeds.dm:39)  may sleep
rt.def("/obj/item/seeds/proc/New", function* New(f: Frame) {
	let p: Value = null, reag_id: Value = null;
	let $e: any;
	f.vars = () => [p, reag_id, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	if (!truthy(rt.sv(f, "icon_grow"))) {
		rt.setSv(f, "icon_grow", fmt("＀-grow", [rt.sv(f, "species")]));
	}
	if (!truthy(rt.sv(f, "icon_dead"))) {
		rt.setSv(f, "icon_dead", fmt("＀-dead", [rt.sv(f, "species")]));
	}
	if (((!truthy(rt.sv(f, "icon_harvest")) && !truthy((yield* g.srcCall(f, "get_gene", T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))))) && !isEqual(rt.sv(f, "yield"), -1))) {
		rt.setSv(f, "icon_harvest", fmt("＀-harvest", [rt.sv(f, "species")]));
	}
	if (truthy(live(f.args[1]))) return f.dot;
	rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/lifespan"), [rt.sv(f, "lifespan")])), add);
	rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/endurance"), [rt.sv(f, "endurance")])), add);
	rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/weed_rate"), [rt.sv(f, "weed_rate")])), add);
	rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/weed_chance"), [rt.sv(f, "weed_chance")])), add);
	if (!isEqual(rt.sv(f, "yield"), -1)) {
		rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/yield"), [rt.sv(f, "yield")])), add);
		rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/production"), [rt.sv(f, "production")])), add);
	}
	if (!isEqual(rt.sv(f, "potency"), -1)) {
		rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/core/potency"), [rt.sv(f, "potency")])), add);
	}
	p = null;
	rt.forList(f, 0, rt.sv(f, "genes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		p = $e;
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(p)])))) {
			(rt.modSrcVar(f, "genes", live(p), subtract));
			rt.modSrcVar(f, "genes", (yield* g.new_(f, live(p), [])), add);
		}
	}
	rt.endFor(f, 0);
	reag_id = null;
	rt.forList(f, 0, rt.sv(f, "reagents_add"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reag_id = $e;
		rt.modSrcVar(f, "genes", (yield* g.new_(f, T("/datum/plant_gene/reagent"), [live(reag_id), rt.index(rt.sv(f, "reagents_add"), live(reag_id))])), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["loc", "nogenes"] });

// /obj/item/seeds/proc/Copy  (code/modules/hydroponics/seeds.dm:72)  may sleep
rt.def("/obj/item/seeds/proc/Copy", function* Copy(f: Frame) {
	let S: Value = null, _g: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [S, _g, G, $e];
	rt.setFv(f, "lifespan", (S = (yield* g.new_(f, rt.sv(f, "type"), [null, 1]))), rt.sv(f, "lifespan"));
	rt.setFv(f, "endurance", live(S), rt.sv(f, "endurance"));
	rt.setFv(f, "maturation", live(S), rt.sv(f, "maturation"));
	rt.setFv(f, "production", live(S), rt.sv(f, "production"));
	rt.setFv(f, "yield", live(S), rt.sv(f, "yield"));
	rt.setFv(f, "potency", live(S), rt.sv(f, "potency"));
	rt.setFv(f, "weed_rate", live(S), rt.sv(f, "weed_rate"));
	rt.setFv(f, "weed_chance", live(S), rt.sv(f, "weed_chance"));
	rt.setFv(f, "genes", live(S), rt.list());
	_g = null;
	rt.forList(f, 0, rt.sv(f, "genes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_g = $e;
		G = live(_g);
		rt.modField(f, live(S), "genes", (yield* g.callName(f, live(G), "Copy", [])), add);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "reagents_add", live(S), (yield* g.callName(f, rt.sv(f, "reagents_add"), "Copy", [])));
	return live(S);
}, true);

// /obj/item/seeds/proc/get_gene  (code/modules/hydroponics/seeds.dm:90)
rt.def("/obj/item/seeds/proc/get_gene", function get_gene(f: Frame, typepath: Value) {
	return rt.locateIn(f, live(typepath), rt.sv(f, "genes"));
});

// /obj/item/seeds/proc/reagents_from_genes  (code/modules/hydroponics/seeds.dm:93)
rt.def("/obj/item/seeds/proc/reagents_from_genes", function reagents_from_genes(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	rt.setSv(f, "reagents_add", rt.list());
	R = null;
	rt.forList(f, 0, rt.sv(f, "genes"), T("/datum/plant_gene/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		rt.setAt(rt.sv(f, "reagents_add"), rt.fv(f, "reagent_id", live(R)), rt.fv(f, "rate", live(R)));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/seeds/proc/mutate  (code/modules/hydroponics/seeds.dm:98)  may sleep
rt.def("/obj/item/seeds/proc/mutate", function* mutate(f: Frame, lifemut: Value, endmut: Value, productmut: Value, yieldmut: Value, potmut: Value, wrmut: Value, wcmut: Value, traitmut: Value) {
	f.vars = () => [lifemut, endmut, productmut, yieldmut, potmut, wrmut, wcmut, traitmut];
	if (live(lifemut) === null) {
		lifemut = 2;
	}
	if (live(endmut) === null) {
		endmut = 5;
	}
	if (live(productmut) === null) {
		productmut = 1;
	}
	if (live(yieldmut) === null) {
		yieldmut = 2;
	}
	if (live(potmut) === null) {
		potmut = 25;
	}
	if (live(wrmut) === null) {
		wrmut = 2;
	}
	if (live(wcmut) === null) {
		wcmut = 5;
	}
	if (live(traitmut) === null) {
		traitmut = 0;
	}
	yield* g.srcCall(f, "adjust_lifespan", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(lifemut)), live(lifemut)])));
	yield* g.srcCall(f, "adjust_endurance", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(endmut)), live(endmut)])));
	yield* g.srcCall(f, "adjust_production", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(productmut)), live(productmut)])));
	yield* g.srcCall(f, "adjust_yield", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(yieldmut)), live(yieldmut)])));
	yield* g.srcCall(f, "adjust_potency", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(potmut)), live(potmut)])));
	yield* g.srcCall(f, "adjust_weed_rate", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(wrmut)), live(wrmut)])));
	yield* g.srcCall(f, "adjust_weed_chance", (yield* g.call(f, P("/proc/rand"), null, [rt.neg(live(wcmut)), live(wcmut)])));
	if (!truthy(rt.op(f, "Prob", [], [live(traitmut)]))) return f.dot;
	yield* g.srcCall(f, "add_random_traits", 1, 1);
	return f.dot;
}, true);

// /obj/item/seeds/proc/bullet_act  (code/modules/hydroponics/seeds.dm:111)  may sleep
rt.def("/obj/item/seeds/proc/bullet_act", function* bullet_act(f: Frame) {
	let rating: Value = null, H: Value = null;
	f.vars = () => [rating, H];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/energy/florayield")) ? 1 : 0))) {
		rating = 1;
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/hydroponics")) ? 1 : 0))) {
			rating = rt.gv(f, "rating", (H = rt.sv(f, "loc")));
		}
		if (isEqual(rt.sv(f, "yield"), 0)) {
			yield* g.srcCall(f, "adjust_yield", multiply(1, live(rating)));
		} else {
			if (truthy(rt.op(f, "Prob", [], [multiply(divide(1, multiply(rt.sv(f, "yield"), rt.sv(f, "yield"))), 100)]))) {
				yield* g.srcCall(f, "adjust_yield", multiply(1, live(rating)));
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/item/seeds/proc/getYield  (code/modules/hydroponics/seeds.dm:127)
rt.def("/obj/item/seeds/proc/getYield", function getYield(f: Frame) {
	let return_yield: Value = null, parent: Value = null;
	f.vars = () => [return_yield, parent];
	return_yield = rt.sv(f, "yield");
	parent = rt.sv(f, "loc");
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/hydroponics")) ? 1 : 0))) {
		if (isEqual(rt.fv(f, "yieldmod", live(parent)), 0)) {
			return_yield = rt.call(f, P("/proc/min"), null, [live(return_yield), 1]);
		} else {
			(return_yield = rt.modify(live(return_yield), rt.fv(f, "yieldmod", live(parent)), multiply));
		}
	}
	return live(return_yield);
});

// /obj/item/seeds/proc/harvest  (code/modules/hydroponics/seeds.dm:140)  may sleep
rt.def("/obj/item/seeds/proc/harvest", function* harvest(f: Frame, user: Value) {
	let parent: Value = null, t_amount: Value = null, result: Value = null, output_loc: Value = null, product_name: Value = null, t_prod: Value = null;
	let $0: any;
	f.vars = () => [user, parent, t_amount, result, output_loc, product_name, t_prod, $0];
	if (live(user) === null) {
		user = live(f.usr);
	}
	parent = rt.sv(f, "loc");
	t_amount = 0;
	result = rt.list();
	if (truthy((yield* g.callName(f, live(parent), "Adjacent", [live(user)])))) {
		$0 = rt.fv(f, "loc", live(user));
	} else {
		$0 = rt.fv(f, "loc", live(parent));
	}
	output_loc = $0;
	product_name = null;
	while (rt.lt(live(t_amount), (yield* g.srcCall(f, "getYield")))) {
		t_prod = (yield* g.new_(f, rt.sv(f, "product"), [live(output_loc), live(f.src)]));
		yield* g.callName(f, live(result), "Add", [live(t_prod)]);
		if (!truthy(live(t_prod))) {
			return live(f.dot);
		}
		t_amount = rt.inc(live(t_amount), 1);
		product_name = rt.fv(f, "name", live(t_prod));
	}
	if (rt.ge((yield* g.srcCall(f, "getYield")), 1)) {
	}
	yield* g.callName(f, live(parent), "update_tray", []);
	return live(result);
}, true);

// /obj/item/seeds/proc/prepare_result  (code/modules/hydroponics/seeds.dm:160)  may sleep
rt.def("/obj/item/seeds/proc/prepare_result", function* prepare_result(f: Frame, _T: Value) {
	let reagent_id: Value = null;
	let $e: any;
	f.vars = () => [_T, reagent_id, $e];
	if (!truthy(rt.fv(f, "reagents", live(_T)))) return f.dot;
	reagent_id = null;
	rt.forList(f, 0, rt.sv(f, "reagents_add"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent_id = $e;
		if (isEqual(live(reagent_id), "blood")) {
			yield* g.callName(f, rt.fv(f, "reagents", live(_T)), "add_reagent", [live(reagent_id), add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "potency"), rt.index(rt.sv(f, "reagents_add"), live(reagent_id))), 1]))), rt.alist(f, ["blood_type", "O-"])]);
			continue;
		}
		yield* g.callName(f, rt.fv(f, "reagents", live(_T)), "add_reagent", [live(reagent_id), add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "potency"), rt.index(rt.sv(f, "reagents_add"), live(reagent_id))), 1])))]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/item/seeds/proc/adjust_yield  (code/modules/hydroponics/seeds.dm:172)
rt.def("/obj/item/seeds/proc/adjust_yield", function adjust_yield(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "yield"), -1)) return f.dot;
	rt.setSv(f, "yield", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "yield"), live(adjustamt)), 10])]));
	if ((rt.le(rt.sv(f, "yield"), 0) && truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")])))) {
		rt.setSv(f, "yield", 1);
	}
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/yield")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "yield"));
	return f.dot;
});

// /obj/item/seeds/proc/adjust_lifespan  (code/modules/hydroponics/seeds.dm:182)
rt.def("/obj/item/seeds/proc/adjust_lifespan", function adjust_lifespan(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "lifespan", rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "lifespan"), live(adjustamt)), 100])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/lifespan")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "lifespan"));
	return f.dot;
});

// /obj/item/seeds/proc/adjust_endurance  (code/modules/hydroponics/seeds.dm:188)
rt.def("/obj/item/seeds/proc/adjust_endurance", function adjust_endurance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "endurance", rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "endurance"), live(adjustamt)), 100])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/endurance")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "endurance"));
	return f.dot;
});

// /obj/item/seeds/proc/adjust_production  (code/modules/hydroponics/seeds.dm:194)
rt.def("/obj/item/seeds/proc/adjust_production", function adjust_production(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "yield"), -1)) return f.dot;
	rt.setSv(f, "production", rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "production"), live(adjustamt)), 10])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/production")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "production"));
	return f.dot;
});

// /obj/item/seeds/proc/adjust_potency  (code/modules/hydroponics/seeds.dm:201)
rt.def("/obj/item/seeds/proc/adjust_potency", function adjust_potency(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "potency"), -1)) return f.dot;
	rt.setSv(f, "potency", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "potency"), live(adjustamt)), 100])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/potency")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "potency"));
	return f.dot;
});

// /obj/item/seeds/proc/adjust_weed_rate  (code/modules/hydroponics/seeds.dm:208)
rt.def("/obj/item/seeds/proc/adjust_weed_rate", function adjust_weed_rate(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "weed_rate", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "weed_rate"), live(adjustamt)), 10])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/weed_rate")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "weed_rate"));
	return f.dot;
});

// /obj/item/seeds/proc/adjust_weed_chance  (code/modules/hydroponics/seeds.dm:214)
rt.def("/obj/item/seeds/proc/adjust_weed_chance", function adjust_weed_chance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "weed_chance", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "weed_chance"), live(adjustamt)), 67])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/weed_chance")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "weed_chance"));
	return f.dot;
});

// /obj/item/seeds/proc/set_yield  (code/modules/hydroponics/seeds.dm:222)
rt.def("/obj/item/seeds/proc/set_yield", function set_yield(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "yield"), -1)) return f.dot;
	rt.setSv(f, "yield", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(adjustamt), 10])]));
	if ((rt.le(rt.sv(f, "yield"), 0) && truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")])))) {
		rt.setSv(f, "yield", 1);
	}
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/yield")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "yield"));
	return f.dot;
});

// /obj/item/seeds/proc/set_lifespan  (code/modules/hydroponics/seeds.dm:232)
rt.def("/obj/item/seeds/proc/set_lifespan", function set_lifespan(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "lifespan", rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [live(adjustamt), 100])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/lifespan")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "lifespan"));
	return f.dot;
});

// /obj/item/seeds/proc/set_endurance  (code/modules/hydroponics/seeds.dm:238)
rt.def("/obj/item/seeds/proc/set_endurance", function set_endurance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "endurance", rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [live(adjustamt), 100])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/endurance")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "endurance"));
	return f.dot;
});

// /obj/item/seeds/proc/set_production  (code/modules/hydroponics/seeds.dm:244)
rt.def("/obj/item/seeds/proc/set_production", function set_production(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "yield"), -1)) return f.dot;
	rt.setSv(f, "production", rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [live(adjustamt), 10])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/production")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "production"));
	return f.dot;
});

// /obj/item/seeds/proc/set_potency  (code/modules/hydroponics/seeds.dm:251)
rt.def("/obj/item/seeds/proc/set_potency", function set_potency(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "potency"), -1)) return f.dot;
	rt.setSv(f, "potency", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(adjustamt), 100])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/potency")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "potency"));
	return f.dot;
});

// /obj/item/seeds/proc/set_weed_rate  (code/modules/hydroponics/seeds.dm:258)
rt.def("/obj/item/seeds/proc/set_weed_rate", function set_weed_rate(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "weed_rate", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(adjustamt), 10])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/weed_rate")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "weed_rate"));
	return f.dot;
});

// /obj/item/seeds/proc/set_weed_chance  (code/modules/hydroponics/seeds.dm:264)
rt.def("/obj/item/seeds/proc/set_weed_chance", function set_weed_chance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setSv(f, "weed_chance", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [live(adjustamt), 67])]));
	if (!truthy((C = rt.callSrc(f, "get_gene", [T("/datum/plant_gene/core/weed_chance")])))) return f.dot;
	rt.setFv(f, "value", live(C), rt.sv(f, "weed_chance"));
	return f.dot;
});

// /obj/item/seeds/proc/get_analyzer_text  (code/modules/hydroponics/seeds.dm:271)
rt.def("/obj/item/seeds/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	let text: Value = null, all_traits: Value = null, traits: Value = null;
	let $e: any;
	f.vars = () => [text, all_traits, traits, $e];
	text = "";
	if (((!truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/weed_hardy")])) && !truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")]))) && !truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/alien_properties")])))) {
		text = rt.modify(live(text), "- Plant type: Normal plant\n", add);
	}
	if (truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/weed_hardy")]))) {
		text = rt.modify(live(text), "- Plant type: Weed. Can grow in nutrient-poor soil.\n", add);
	}
	if (truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")]))) {
		text = rt.modify(live(text), "- Plant type: Mushroom. Can grow in dry soil.\n", add);
	}
	if (truthy(rt.callSrc(f, "get_gene", [T("/datum/plant_gene/trait/plant_type/alien_properties")]))) {
		text = rt.modify(live(text), "- Plant type: <span class='warning'>UNKNOWN</span> \n", add);
	}
	if (!isEqual(rt.sv(f, "potency"), -1)) {
		text = rt.modify(live(text), fmt("- Potency: ＀\n", [rt.sv(f, "potency")]), add);
	}
	if (!isEqual(rt.sv(f, "yield"), -1)) {
		text = rt.modify(live(text), fmt("- Yield: ＀\n", [rt.sv(f, "yield")]), add);
	}
	text = rt.modify(live(text), fmt("- Maturation speed: ＀\n", [rt.sv(f, "maturation")]), add);
	if (!isEqual(rt.sv(f, "yield"), -1)) {
		text = rt.modify(live(text), fmt("- Production speed: ＀\n", [rt.sv(f, "production")]), add);
	}
	text = rt.modify(live(text), fmt("- Endurance: ＀\n", [rt.sv(f, "endurance")]), add);
	text = rt.modify(live(text), fmt("- Lifespan: ＀\n", [rt.sv(f, "lifespan")]), add);
	text = rt.modify(live(text), fmt("- Weed Growth Rate: ＀\n", [rt.sv(f, "weed_rate")]), add);
	text = rt.modify(live(text), fmt("- Weed Vulnerability: ＀\n", [rt.sv(f, "weed_chance")]), add);
	if (truthy(rt.sv(f, "rarity"))) {
		text = rt.modify(live(text), fmt("- Species Discovery Value: ＀\n", [rt.sv(f, "rarity")]), add);
	}
	all_traits = "";
	traits = null;
	rt.forList(f, 0, rt.sv(f, "genes"), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		traits = $e;
		if (truthy((rt.istype(live(traits), T("/datum/plant_gene/trait/plant_type")) ? 1 : 0))) {
			continue;
		}
		all_traits = rt.modify(live(all_traits), fmt(" ＀", [rt.callName(f, live(traits), "get_name", [])]), add);
	}
	rt.endFor(f, 0);
	text = rt.modify(live(text), fmt("- Plant Traits:＀\n", [live(all_traits)]), add);
	return (text = rt.modify(live(text), "*---------*", add));
});

// /obj/item/seeds/proc/attackby  (code/modules/hydroponics/seeds.dm:308)  may sleep
rt.def("/obj/item/seeds/proc/attackby", function* attackby(f: Frame) {
	let text: Value = null;
	f.vars = () => [text];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/plant_analyzer")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>*---------*\n This is ＇<span class='name'>！</span>.</span>", [live(f.src)])]);
		if (truthy((text = (yield* g.srcCall(f, "get_analyzer_text"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀</span>", [live(text)])]);
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/item/seeds/proc/randomize_stats  (code/modules/hydroponics/seeds.dm:349)
rt.def("/obj/item/seeds/proc/randomize_stats", function randomize_stats(f: Frame) {
	rt.callSrc(f, "set_lifespan", [rt.call(f, P("/proc/rand"), null, [25, 60])]);
	rt.callSrc(f, "set_endurance", [rt.call(f, P("/proc/rand"), null, [15, 35])]);
	rt.callSrc(f, "set_production", [rt.call(f, P("/proc/rand"), null, [2, 10])]);
	rt.callSrc(f, "set_yield", [rt.call(f, P("/proc/rand"), null, [1, 10])]);
	rt.callSrc(f, "set_potency", [rt.call(f, P("/proc/rand"), null, [10, 35])]);
	rt.callSrc(f, "set_weed_rate", [rt.call(f, P("/proc/rand"), null, [1, 10])]);
	rt.callSrc(f, "set_weed_chance", [rt.call(f, P("/proc/rand"), null, [5, 100])]);
	rt.setSv(f, "maturation", rt.call(f, P("/proc/rand"), null, [6, 12]));
	return f.dot;
});

// /obj/item/seeds/proc/add_random_reagents  (code/modules/hydroponics/seeds.dm:359)  may sleep
rt.def("/obj/item/seeds/proc/add_random_reagents", function* add_random_reagents(f: Frame, lower: Value, upper: Value) {
	let amount_random_reagents: Value = null, i: Value = null, random_amount: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [lower, upper, amount_random_reagents, i, random_amount, R, $e];
	if (live(lower) === null) {
		lower = 0;
	}
	if (live(upper) === null) {
		upper = 2;
	}
	amount_random_reagents = (yield* g.call(f, P("/proc/rand"), null, [live(lower), live(upper)]));
	i = null;
	rt.forRange(f, 0, 1, live(amount_random_reagents), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		random_amount = multiply((yield* g.call(f, P("/proc/rand"), null, [4, 15])), 0.009999999776482582);
		if (truthy((yield* g.callName(f, (R = (yield* g.new_(f, T("/datum/plant_gene/reagent"), [(yield* g.call(f, P("/proc/get_random_reagent_id"), null, [])), live(random_amount)]))), "can_add", [live(f.src)])))) {
			rt.modSrcVar(f, "genes", live(R), add);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "reagents_from_genes");
	return f.dot;
}, true);

// /obj/item/seeds/proc/add_random_traits  (code/modules/hydroponics/seeds.dm:370)  may sleep
rt.def("/obj/item/seeds/proc/add_random_traits", function* add_random_traits(f: Frame, lower: Value, upper: Value) {
	let amount_random_traits: Value = null, i: Value = null, random_trait: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [lower, upper, amount_random_traits, i, random_trait, _T, $e];
	if (live(lower) === null) {
		lower = 0;
	}
	if (live(upper) === null) {
		upper = 2;
	}
	amount_random_traits = (yield* g.call(f, P("/proc/rand"), null, [live(lower), live(upper)]));
	i = null;
	rt.forRange(f, 0, 1, live(amount_random_traits), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		random_trait = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/plant_gene/trait")])), T("/datum/plant_gene/trait")), (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/plant_gene/trait/plant_type")])))]);
		if (truthy((yield* g.callName(f, (_T = (yield* g.new_(f, live(random_trait), []))), "can_add", [live(f.src)])))) {
			rt.modSrcVar(f, "genes", live(_T), add);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/seeds/proc/add_random_plant_type  (code/modules/hydroponics/seeds.dm:380)  may sleep
rt.def("/obj/item/seeds/proc/add_random_plant_type", function* add_random_plant_type(f: Frame, normal_plant_chance: Value) {
	let random_plant_type: Value = null, _P: Value = null;
	f.vars = () => [normal_plant_chance, random_plant_type, _P];
	if (live(normal_plant_chance) === null) {
		normal_plant_chance = 75;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(normal_plant_chance)]))) return f.dot;
	random_plant_type = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/plant_gene/trait/plant_type")])), T("/datum/plant_gene/trait/plant_type"))]);
	if (truthy((yield* g.callName(f, (_P = (yield* g.new_(f, live(random_plant_type), []))), "can_add", [live(f.src)])))) {
		rt.modSrcVar(f, "genes", live(_P), add);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(_P)]);
	}
	return f.dot;
}, true);
