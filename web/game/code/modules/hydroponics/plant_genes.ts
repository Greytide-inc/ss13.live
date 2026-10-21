// From code/modules/hydroponics/plant_genes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2711, "/datum/plant_gene", "/datum", {
	name: null,
});

// /datum/plant_gene/proc/can_add  (code/modules/hydroponics/plant_genes.dm:8)
rt.def("/datum/plant_gene/proc/can_add", function can_add(f: Frame, S: Value) {
	return (!truthy((rt.istype(live(S), T("/obj/item/seeds/sample")) ? 1 : 0)) ? 1 : 0);
});

// /datum/plant_gene/proc/Copy  (code/modules/hydroponics/plant_genes.dm:11)  may sleep
rt.def("/datum/plant_gene/proc/Copy", function* Copy(f: Frame) {
	return (yield* g.new_(f, rt.sv(f, "type"), []));
}, true);

rt.type(2712, "/datum/plant_gene/core", "/datum/plant_gene", {
	value: null,
});

// /datum/plant_gene/core/proc/get_name  (code/modules/hydroponics/plant_genes.dm:21)
rt.def("/datum/plant_gene/core/proc/get_name", function get_name(f: Frame) {
	return fmt("＀ ＀", [rt.sv(f, "name"), rt.sv(f, "value")]);
});

// /datum/plant_gene/core/proc/New  (code/modules/hydroponics/plant_genes.dm:27)
rt.def("/datum/plant_gene/core/proc/New", function New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (live(f.args[0]) === null) return f.dot;
	rt.setSv(f, "value", live(f.args[0]));
	return f.dot;
}, false, { args: ["i"] });

// /datum/plant_gene/core/proc/Copy  (code/modules/hydroponics/plant_genes.dm:32)  may sleep
rt.def("/datum/plant_gene/core/proc/Copy", function* Copy(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	rt.setFv(f, "value", (C = (yield* g.callSuper(f, [], rt.Args.Same))), rt.sv(f, "value"));
	return live(C);
}, true);

// /datum/plant_gene/core/proc/can_add  (code/modules/hydroponics/plant_genes.dm:37)
rt.def("/datum/plant_gene/core/proc/can_add", function can_add(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	return rt.callName(f, live(f.args[0]), "get_gene", [rt.fv(f, "type", live(f.src))]);
}, false, { args: ["S"] });

rt.type(2720, "/datum/plant_gene/reagent", "/datum/plant_gene", {
	reagent_id: "nutriment",
	rate: 0.04,
	name: "Nutriment",
});

// /datum/plant_gene/reagent/proc/get_name  (code/modules/hydroponics/plant_genes.dm:104)
rt.def("/datum/plant_gene/reagent/proc/get_name", function get_name(f: Frame) {
	return fmt("＀ production ＀%", [rt.sv(f, "name"), multiply(rt.sv(f, "rate"), 100)]);
});

// /datum/plant_gene/reagent/proc/set_reagent  (code/modules/hydroponics/plant_genes.dm:107)
rt.def("/datum/plant_gene/reagent/proc/set_reagent", function set_reagent(f: Frame, reag_id: Value) {
	let R: Value = null;
	f.vars = () => [R];
	rt.setSv(f, "reagent_id", live(reag_id));
	rt.setSv(f, "name", "UNKNOWN");
	if (!(truthy((R = rt.index(rt.gl("chemical_reagents_list"), live(reag_id)))) && isEqual(rt.fv(f, "id", live(R)), rt.sv(f, "reagent_id")))) return f.dot;
	rt.setSv(f, "name", rt.fv(f, "name", live(R)));
	return f.dot;
});

// /datum/plant_gene/reagent/proc/New  (code/modules/hydroponics/plant_genes.dm:115)
rt.def("/datum/plant_gene/reagent/proc/New", function New(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && truthy(live(f.args[1])))) return f.dot;
	rt.callSrc(f, "set_reagent", [live(f.args[0])]);
	rt.setSv(f, "rate", live(f.args[1]));
	return f.dot;
}, false, { args: ["reag_id", "reag_rate"] });

// /datum/plant_gene/reagent/proc/Copy  (code/modules/hydroponics/plant_genes.dm:121)  may sleep
rt.def("/datum/plant_gene/reagent/proc/Copy", function* Copy(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	rt.setFv(f, "name", (G = (yield* g.callSuper(f, [], rt.Args.Same))), rt.sv(f, "name"));
	rt.setFv(f, "reagent_id", live(G), rt.sv(f, "reagent_id"));
	rt.setFv(f, "rate", live(G), rt.sv(f, "rate"));
	return live(G);
}, true);

// /datum/plant_gene/reagent/proc/can_add  (code/modules/hydroponics/plant_genes.dm:128)
rt.def("/datum/plant_gene/reagent/proc/can_add", function can_add(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	R = null;
	rt.forList(f, 0, rt.fv(f, "genes", live(f.args[0])), T("/datum/plant_gene/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (isEqual(rt.fv(f, "reagent_id", live(R)), rt.sv(f, "reagent_id"))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
}, false, { args: ["S"] });

rt.type(2721, "/datum/plant_gene/trait", "/datum/plant_gene", {
	rate: 0.05,
	examine_line: "",
	origin_tech: null,
	trait_id: null,
});

// /datum/plant_gene/trait/proc/Copy  (code/modules/hydroponics/plant_genes.dm:144)  may sleep
rt.def("/datum/plant_gene/trait/proc/Copy", function* Copy(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	rt.setFv(f, "rate", (G = (yield* g.callSuper(f, [], rt.Args.Same))), rt.sv(f, "rate"));
	return live(G);
}, true);

// /datum/plant_gene/trait/proc/can_add  (code/modules/hydroponics/plant_genes.dm:149)
rt.def("/datum/plant_gene/trait/proc/can_add", function can_add(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	R = null;
	rt.forList(f, 0, rt.fv(f, "genes", live(f.args[0])), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((truthy(rt.sv(f, "trait_id")) && isEqual(rt.fv(f, "trait_id", live(R)), rt.sv(f, "trait_id")))) {
			return 0;
		}
		if (isEqual(rt.sv(f, "type"), rt.fv(f, "type", live(R)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
}, false, { args: ["S"] });

// /datum/plant_gene/trait/proc/on_new  (code/modules/hydroponics/plant_genes.dm:160)
rt.def("/datum/plant_gene/trait/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	let tech: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [tech, t, $e];
	if (!truthy(rt.sv(f, "origin_tech"))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "origin_tech", live(G)))) {
		tech = rt.call(f, P("/proc/params2list"), null, [rt.fv(f, "origin_tech", live(G))]);
		t = null;
		rt.forList(f, 0, rt.sv(f, "origin_tech"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			if (truthy((rt.isIn(f, live(t), live(tech)) ? 1 : 0))) {
				rt.setAt(live(tech), live(t), rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/text2num"), null, [rt.index(live(tech), live(t))]), rt.index(rt.sv(f, "origin_tech"), live(t))]));
			} else {
				rt.setAt(live(tech), live(t), rt.index(rt.sv(f, "origin_tech"), live(t)));
			}
		}
		rt.endFor(f, 0);
		rt.setFv(f, "origin_tech", live(G), rt.call(f, P("/proc/list2params"), null, [live(tech)]));
	} else {
		rt.setFv(f, "origin_tech", live(G), rt.call(f, P("/proc/list2params"), null, [rt.sv(f, "origin_tech")]));
	}
	return f.dot;
});

rt.type(2722, "/datum/plant_gene/trait/squash", "/datum/plant_gene/trait", {
	name: "Liquid Contents",
	examine_line: "<span class='info'>It has a lot of liquid contents inside.</span>",
	origin_tech: null,
});

// /datum/plant_gene/trait/squash/proc/<init>  (code/modules/hydroponics/plant_genes.dm:198)
rt.def("/datum/plant_gene/trait/squash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "origin_tech", rt.alist(f, ["biotech", 5]));
	return f.dot;
});

rt.type(2723, "/datum/plant_gene/trait/slip", "/datum/plant_gene/trait", {
	name: "Slippery Skin",
	rate: 1.6,
	examine_line: "<span class='info'>It has a very slippery skin.</span>",
});

// /datum/plant_gene/trait/slip/proc/on_cross  (code/modules/hydroponics/plant_genes.dm:208)  may sleep
rt.def("/datum/plant_gene/trait/slip/proc/on_cross", function* on_cross(f: Frame, G: Value, target: Value) {
	let seed: Value = null, M: Value = null, stun_len: Value = null, knockdown: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [G, target, seed, M, stun_len, knockdown, _T, $e];
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	seed = rt.fv(f, "seed", live(G));
	M = live(target);
	if ((truthy((rt.istype(live(G), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "trash", live(G)), T("/obj/item/weapon/grown")]))))) {
		return live(f.dot);
	}
	stun_len = multiply(rt.fv(f, "potency", live(seed)), rt.sv(f, "rate"));
	if ((!truthy((rt.istype(live(G), T("/obj/item/weapon/grown/bananapeel")) ? 1 : 0)) && (!truthy(rt.fv(f, "reagents", live(G))) || !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(G)), "has_reagent", ["lube"])))))) {
		(stun_len = rt.modify(live(stun_len), 3, divide));
	}
	knockdown = (yield* g.call(f, P("/proc/min"), null, [live(stun_len), 140]));
	if (!truthy((yield* g.callName(f, live(M), "slip", [live(knockdown), live(G)])))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.fv(f, "genes", live(seed)), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "on_slip", [live(G), live(M)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2724, "/datum/plant_gene/trait/cell_charge", "/datum/plant_gene/trait", {
	name: "Electrical Activity",
	rate: 0.2,
	origin_tech: null,
});

// /datum/plant_gene/trait/cell_charge/proc/<init>  (code/modules/hydroponics/plant_genes.dm:232)
rt.def("/datum/plant_gene/trait/cell_charge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "origin_tech", rt.alist(f, ["powerstorage", 5]));
	return f.dot;
});

// /datum/plant_gene/trait/cell_charge/proc/on_slip  (code/modules/hydroponics/plant_genes.dm:235)  may sleep
rt.def("/datum/plant_gene/trait/cell_charge/proc/on_slip", function* on_slip(f: Frame, G: Value, C: Value) {
	let power: Value = null;
	f.vars = () => [G, C, power];
	if (!truthy(rt.op(f, "Prob", [], [(power = multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), rt.sv(f, "rate")))]))) return f.dot;
	yield* g.callName(f, live(C), "electrocute_act", [(yield* g.call(f, P("/proc/round"), null, [live(power)])), live(G), 1, 1]);
	return f.dot;
}, true);

// /datum/plant_gene/trait/cell_charge/proc/on_squash  (code/modules/hydroponics/plant_genes.dm:240)  may sleep
rt.def("/datum/plant_gene/trait/cell_charge/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	let C: Value = null, power: Value = null;
	f.vars = () => [G, target, C, power];
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	C = live(target);
	if (!truthy(rt.op(f, "Prob", [], [(power = multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), rt.sv(f, "rate")))]))) return f.dot;
	yield* g.callName(f, live(C), "electrocute_act", [(yield* g.call(f, P("/proc/round"), null, [live(power)])), live(G), 1, 1]);
	return f.dot;
}, true);

// /datum/plant_gene/trait/cell_charge/proc/on_consume  (code/modules/hydroponics/plant_genes.dm:247)  may sleep
rt.def("/datum/plant_gene/trait/cell_charge/proc/on_consume", function* on_consume(f: Frame, G: Value, target: Value) {
	let batteries_recharged: Value = null, C: Value = null, newcharge: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [G, target, batteries_recharged, C, newcharge, O, $e];
	if (truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G))))) return f.dot;
	batteries_recharged = 0;
	C = null;
	rt.forList(f, 0, (yield* g.callName(f, live(target), "GetAllContents", [])), T("/obj/item/weapon/stock_parts/cell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		newcharge = (yield* g.call(f, P("/proc/min"), null, [multiply(multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), 0.009999999776482582), rt.fv(f, "maxcharge", live(C))), rt.fv(f, "maxcharge", live(C))]));
		if (rt.lt(rt.fv(f, "charge", live(C)), live(newcharge))) {
			rt.setFv(f, "charge", live(C), live(newcharge));
			if (truthy((rt.istype(rt.fv(f, "loc", live(C)), T("/obj")) ? 1 : 0))) {
				yield* g.callName(f, (O = rt.fv(f, "loc", live(C))), "update_icon", []);
			}
			yield* g.callName(f, live(C), "update_icon", []);
			batteries_recharged = 1;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(batteries_recharged))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='notice'>Your batteries are recharged!</span>"]);
	return f.dot;
}, true);

rt.type(2725, "/datum/plant_gene/trait/glow", "/datum/plant_gene/trait", {
	glow_color: "#C3E381",
	name: "Bioluminescence",
	rate: 0.03,
	examine_line: "<span class='info'>It emits a soft glow.</span>",
	trait_id: "glow",
});

// /datum/plant_gene/trait/glow/proc/glow_range  (code/modules/hydroponics/plant_genes.dm:273)
rt.def("/datum/plant_gene/trait/glow/proc/glow_range", function glow_range(f: Frame, S: Value) {
	return add(1.399999976158142, multiply(rt.fv(f, "potency", live(S)), rt.sv(f, "rate")));
});

// /datum/plant_gene/trait/glow/proc/glow_power  (code/modules/hydroponics/plant_genes.dm:276)
rt.def("/datum/plant_gene/trait/glow/proc/glow_power", function glow_power(f: Frame, S: Value) {
	return rt.call(f, P("/proc/max"), null, [multiply(rt.fv(f, "potency", live(S)), add(rt.sv(f, "rate"), 0.009999999776482582)), 0.10000000149011612]);
});

// /datum/plant_gene/trait/glow/proc/on_new  (code/modules/hydroponics/plant_genes.dm:279)
rt.def("/datum/plant_gene/trait/glow/proc/on_new", function on_new(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, live(f.args[0]), "set_light", [rt.callSrc(f, "glow_range", [rt.fv(f, "seed", live(f.args[0]))]), rt.callSrc(f, "glow_power", [rt.fv(f, "seed", live(f.args[0]))]), rt.sv(f, "glow_color")]);
	return f.dot;
}, false, { args: ["G", "newloc"] });

rt.type(2726, "/datum/plant_gene/trait/glow/shadow", "/datum/plant_gene/trait/glow", {
	name: "Shadow Emission",
	rate: 0.04,
	glow_color: "#AAD84B",
});

// /datum/plant_gene/trait/glow/shadow/proc/glow_power  (code/modules/hydroponics/plant_genes.dm:290)
rt.def("/datum/plant_gene/trait/glow/shadow/proc/glow_power", function glow_power(f: Frame, S: Value) {
	return rt.neg(rt.call(f, P("/proc/max"), null, [multiply(rt.fv(f, "potency", live(S)), multiply(rt.sv(f, "rate"), 0.05000000074505806)), 0.07500000298023224]));
});

rt.type(2729, "/datum/plant_gene/trait/teleport", "/datum/plant_gene/trait", {
	name: "Bluespace Activity",
	rate: 0.1,
	origin_tech: null,
});

// /datum/plant_gene/trait/teleport/proc/<init>  (code/modules/hydroponics/plant_genes.dm:307)
rt.def("/datum/plant_gene/trait/teleport/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "origin_tech", rt.alist(f, ["bluespace", 5]));
	return f.dot;
});

// /datum/plant_gene/trait/teleport/proc/on_squash  (code/modules/hydroponics/plant_genes.dm:310)  may sleep
rt.def("/datum/plant_gene/trait/teleport/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	let teleport_radius: Value = null, _T: Value = null;
	f.vars = () => [G, target, teleport_radius, _T];
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
	teleport_radius = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), 10)])), 1]));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/molten_object"), [(_T = rt.getStep(f, live(target), 0))]);
	yield* g.call(f, P("/proc/do_teleport"), null, [live(target), live(_T), live(teleport_radius)]);
	return f.dot;
}, true);

// /datum/plant_gene/trait/teleport/proc/on_slip  (code/modules/hydroponics/plant_genes.dm:317)  may sleep
rt.def("/datum/plant_gene/trait/teleport/proc/on_slip", function* on_slip(f: Frame, G: Value, C: Value) {
	let teleport_radius: Value = null, _T: Value = null;
	f.vars = () => [G, C, teleport_radius, _T];
	teleport_radius = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), 10)])), 1]));
	_T = rt.getStep(f, live(C), 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>You slip through spacetime!</span>"]);
	yield* g.call(f, P("/proc/do_teleport"), null, [live(C), live(_T), live(teleport_radius)]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.call(f, P("/proc/do_teleport"), null, [live(G), live(_T), live(teleport_radius)]);
	} else {
		yield* g.new_(f, T("/obj/effect/decal/cleanable/molten_object"), [live(_T)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
	}
	return f.dot;
}, true);

rt.type(2730, "/datum/plant_gene/trait/noreact", "/datum/plant_gene/trait", {
	name: "Separated Chemicals",
});

// /datum/plant_gene/trait/noreact/proc/on_new  (code/modules/hydroponics/plant_genes.dm:333)
rt.def("/datum/plant_gene/trait/noreact/proc/on_new", function on_new(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, rt.fv(f, "reagents", live(f.args[0])), "set_reacting", [0]);
	return f.dot;
}, false, { args: ["G", "newloc"] });

// /datum/plant_gene/trait/noreact/proc/on_squash  (code/modules/hydroponics/plant_genes.dm:337)  may sleep
rt.def("/datum/plant_gene/trait/noreact/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	f.vars = () => [G, target];
	yield* g.callName(f, rt.fv(f, "reagents", live(G)), "set_reacting", [1]);
	yield* g.callName(f, rt.fv(f, "reagents", live(G)), "handle_reactions", []);
	return f.dot;
}, true);

rt.type(2731, "/datum/plant_gene/trait/maxchem", "/datum/plant_gene/trait", {
	name: "Densified Chemicals",
	rate: 2,
});

// /datum/plant_gene/trait/maxchem/proc/on_new  (code/modules/hydroponics/plant_genes.dm:347)
rt.def("/datum/plant_gene/trait/maxchem/proc/on_new", function on_new(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	(rt.modField(f, rt.fv(f, "reagents", live(f.args[0])), "maximum_volume", rt.sv(f, "rate"), multiply));
	return f.dot;
}, false, { args: ["G", "newloc"] });

rt.type(2732, "/datum/plant_gene/trait/repeated_harvest", "/datum/plant_gene/trait", {
	name: "Perennial Growth",
});

// /datum/plant_gene/trait/repeated_harvest/proc/can_add  (code/modules/hydroponics/plant_genes.dm:354)
rt.def("/datum/plant_gene/trait/repeated_harvest/proc/can_add", function can_add(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/seeds/replicapod")) ? 1 : 0))) {
		return 0;
	}
	return 1;
}, false, { args: ["S"] });

rt.type(2733, "/datum/plant_gene/trait/battery", "/datum/plant_gene/trait", {
	name: "Capacitive Cell Production",
});

// /datum/plant_gene/trait/battery/proc/on_attackby  (code/modules/hydroponics/plant_genes.dm:364)  may sleep
rt.def("/datum/plant_gene/trait/battery/proc/on_attackby", function* on_attackby(f: Frame, G: Value, I: Value, user: Value) {
	let C: Value = null, pocell: Value = null, CG: Value = null;
	f.vars = () => [G, I, user, C, pocell, CG];
	if (!truthy((rt.istype(live(I), T("/obj/item/stack/cable_coil")) ? 1 : 0))) return f.dot;
	if (truthy((yield* g.callName(f, (C = live(I)), "use", [5])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add some cable to ＀ and slide it inside the battery encasing.</span>", [live(G)])]);
		rt.setFv(f, "icon_state", (pocell = (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/potato"), [rt.fv(f, "loc", live(user))]))), rt.fv(f, "icon_state", live(G)));
		rt.setFv(f, "maxcharge", live(pocell), multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), 20));
		if (truthy((CG = (yield* g.callName(f, rt.fv(f, "seed", live(G)), "get_gene", [T("/datum/plant_gene/trait/cell_charge")]))))) {
			(rt.modField(f, live(pocell), "maxcharge", multiply(rt.fv(f, "rate", live(CG)), 1000), multiply));
		}
		rt.setFv(f, "charge", live(pocell), rt.fv(f, "maxcharge", live(pocell)));
		rt.setFv(f, "name", live(pocell), fmt("＀ battery", [rt.fv(f, "name", live(G))]));
		rt.setFv(f, "desc", live(pocell), fmt("A rechargable plant based power cell. This one has a power rating of ＀, and you should not swallow it.", [rt.fv(f, "maxcharge", live(pocell))]));
		if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(G)), "has_reagent", ["plasma", 2])))) {
			rt.setFv(f, "rigged", live(pocell), 1);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need five lengths of cable to make a ＀ battery!</span>", [live(G)])]);
	}
	return f.dot;
}, true);

rt.type(2734, "/datum/plant_gene/trait/stinging", "/datum/plant_gene/trait", {
	name: "Hypodermic Prickles",
});

// /datum/plant_gene/trait/stinging/proc/on_throw_impact  (code/modules/hydroponics/plant_genes.dm:392)  may sleep
rt.def("/datum/plant_gene/trait/stinging/proc/on_throw_impact", function* on_throw_impact(f: Frame, G: Value, target: Value) {
	let L: Value = null, injecting_amount: Value = null, fraction: Value = null;
	f.vars = () => [G, target, L, injecting_amount, fraction];
	if (!((truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "reagents", live(G)))) && truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G)))))) return f.dot;
	if (!(truthy(rt.gv(f, "reagents", (L = live(target)))) && truthy((yield* g.callName(f, live(L), "can_inject", [null, 0]))))) return f.dot;
	injecting_amount = (yield* g.call(f, P("/proc/max"), null, [1, multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), 0.20000000298023224)]));
	fraction = (yield* g.call(f, P("/proc/min"), null, [divide(live(injecting_amount), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G)))), 1]));
	yield* g.callName(f, rt.fv(f, "reagents", live(G)), "reaction", [live(L), 5, live(fraction)]);
	yield* g.callName(f, rt.fv(f, "reagents", live(G)), "trans_to", [live(L), live(injecting_amount)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(target), fmt("<span class='danger'>You are pricked by ＀!</span>", [live(G)])]);
	return f.dot;
}, true);

rt.type(2735, "/datum/plant_gene/trait/smoke", "/datum/plant_gene/trait", {
	name: "gaseous decomposition",
});

// /datum/plant_gene/trait/smoke/proc/on_squash  (code/modules/hydroponics/plant_genes.dm:405)  may sleep
rt.def("/datum/plant_gene/trait/smoke/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	let S: Value = null, splat_location: Value = null, smoke_amount: Value = null;
	f.vars = () => [G, target, S, splat_location, smoke_amount];
	S = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []));
	splat_location = rt.getStep(f, live(target), 0);
	smoke_amount = (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [multiply(rt.gv(f, "potency", rt.fv(f, "seed", live(G))), 0.10000000149011612)]), 1]));
	yield* g.callName(f, live(S), "attach", [live(splat_location)]);
	yield* g.callName(f, live(S), "set_up", [rt.fv(f, "reagents", live(G)), live(smoke_amount), live(splat_location), 0]);
	yield* g.callName(f, live(S), "start", []);
	yield* g.callName(f, rt.fv(f, "reagents", live(G)), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2736, "/datum/plant_gene/trait/fire_resistance", "/datum/plant_gene/trait", {
	name: "Fire Resistance",
});

// /datum/plant_gene/trait/fire_resistance/proc/apply_vars  (code/modules/hydroponics/plant_genes.dm:417)
rt.def("/datum/plant_gene/trait/fire_resistance/proc/apply_vars", function apply_vars(f: Frame, S: Value) {
	if (truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(S)), 2))) return f.dot;
	(rt.modField(f, live(S), "resistance_flags", 2, rt.bitOr));
	return f.dot;
});

// /datum/plant_gene/trait/fire_resistance/proc/on_new  (code/modules/hydroponics/plant_genes.dm:421)
rt.def("/datum/plant_gene/trait/fire_resistance/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	if (truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(G)), 2))) return f.dot;
	(rt.modField(f, live(G), "resistance_flags", 2, rt.bitOr));
	return f.dot;
});
