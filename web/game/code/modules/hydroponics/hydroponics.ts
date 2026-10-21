// From code/modules/hydroponics/hydroponics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10772, "/obj/machinery/hydroponics/constructable", "/obj/machinery/hydroponics", {
	name: "hydroponics tray",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "hydrotray3",
});

// /obj/machinery/hydroponics/constructable/proc/New  (code/modules/hydroponics/hydroponics.dm:41)  may sleep
rt.def("/obj/machinery/hydroponics/constructable/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/hydroponics"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6758, "/obj/item/weapon/circuitboard/machine/hydroponics", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Hydroponics Tray (Machine Board)",
	build_path: rt.typePath("/obj/machinery/hydroponics/constructable"),
	origin_tech: "programming=1;biotech=2",
});

// /obj/item/weapon/circuitboard/machine/hydroponics/proc/<init>  (code/modules/hydroponics/hydroponics.dm:49)
rt.def("/obj/item/weapon/circuitboard/machine/hydroponics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/hydroponics/constructable/proc/RefreshParts  (code/modules/hydroponics/hydroponics.dm:56)
rt.def("/obj/machinery/hydroponics/constructable/proc/RefreshParts", function RefreshParts(f: Frame) {
	let tmp_capacity: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [tmp_capacity, M, $e];
	tmp_capacity = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		tmp_capacity = rt.modify(live(tmp_capacity), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setSv(f, "rating", rt.fv(f, "rating", live(M)));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "maxwater", multiply(live(tmp_capacity), 50));
	rt.setSv(f, "maxnutri", multiply(live(tmp_capacity), 5));
	rt.setSv(f, "waterlevel", rt.sv(f, "maxwater"));
	rt.setSv(f, "nutrilevel", 3);
	return f.dot;
});

rt.type(10770, "/obj/machinery/hydroponics", "/obj/machinery", {
	waterlevel: 100,
	maxwater: 100,
	nutrilevel: 10,
	maxnutri: 10,
	pestlevel: 0,
	weedlevel: 0,
	yieldmod: 1,
	mutmod: 1,
	toxic: 0,
	age: 0,
	dead: 0,
	plant_health: null,
	lastproduce: 0,
	lastcycle: 0,
	cycledelay: 200,
	harvest: 0,
	myseed: null,
	rating: 1,
	unwrenchable: 1,
	recent_bee_visit: 0,
	using_irrigation: 0,
	self_sufficiency_req: 20,
	self_sufficiency_progress: 0,
	self_sustaining: 0,
	anchored: 1,
	name: "hydroponics tray",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "hydrotray",
	density: 1,
	pixel_y: 8,
	unique_rename: 1,
});

// /obj/machinery/hydroponics/proc/Destroy  (code/modules/hydroponics/hydroponics.dm:67)  may sleep
rt.def("/obj/machinery/hydroponics/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "myseed"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
		rt.setSv(f, "myseed", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/hydroponics/constructable/proc/attackby  (code/modules/hydroponics/hydroponics.dm:72)  may sleep
rt.def("/obj/machinery/hydroponics/constructable/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "hydrotray3", "hydrotray3", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "using_irrigation"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Disconnect the hoses first!</span>"]);
		} else {
			if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]), 1)))) {
				return live(f.dot);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/hydroponics/proc/FindConnected  (code/modules/hydroponics/hydroponics.dm:93)
rt.def("/obj/machinery/hydroponics/proc/FindConnected", function FindConnected(f: Frame) {
	let connected: Value = null, processing_atoms: Value = null, a: Value = null, step_dir: Value = null, h: Value = null;
	let $e: any;
	f.vars = () => [connected, processing_atoms, a, step_dir, h, $e];
	connected = rt.list();
	processing_atoms = rt.list(live(f.src));
	while (truthy(rt.len(f, live(processing_atoms)))) {
		a = rt.index(live(processing_atoms), 1);
		step_dir = null;
		rt.forList(f, 0, rt.gl("cardinal"));
		while (($e = rt.next(f, 0)) !== undefined) {
			step_dir = $e;
			if (((((truthy((h = rt.locateIn(f, T("/obj/machinery/hydroponics"), rt.getStep(f, live(a), live(step_dir))))) && truthy(rt.fv(f, "using_irrigation", live(h)))) && truthy(rt.fv(f, "density", live(h)))) && !truthy((rt.isIn(f, live(h), live(connected)) ? 1 : 0))) && !truthy((rt.isIn(f, live(h), live(processing_atoms)) ? 1 : 0)))) {
				processing_atoms = rt.modify(live(processing_atoms), live(h), add);
			}
		}
		rt.endFor(f, 0);
		(processing_atoms = rt.modify(live(processing_atoms), live(a), subtract));
		connected = rt.modify(live(connected), live(a), add);
	}
	return live(connected);
});

// /obj/machinery/hydroponics/proc/bullet_act  (code/modules/hydroponics/hydroponics.dm:111)  may sleep
rt.def("/obj/machinery/hydroponics/proc/bullet_act", function* bullet_act(f: Frame) {
	if (!truthy(rt.sv(f, "myseed"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/energy/floramut")) ? 1 : 0))) {
		yield* g.srcCall(f, "mutate");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/energy/florayield")) ? 1 : 0))) {
			return (yield* g.callName(f, rt.sv(f, "myseed"), "bullet_act", [live(f.args[0])]));
		}
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/machinery/hydroponics/proc/process  (code/modules/hydroponics/hydroponics.dm:123)  may sleep
rt.def("/obj/machinery/hydroponics/proc/process", function* process(f: Frame) {
	let needs_update: Value = null, currentTurf: Value = null, lightAmt: Value = null;
	f.vars = () => [needs_update, currentTurf, lightAmt];
	needs_update = 0;
	if ((truthy(rt.sv(f, "myseed")) && !isEqual(rt.fv(f, "loc", rt.sv(f, "myseed")), live(f.src)))) {
		rt.setFv(f, "loc", rt.sv(f, "myseed"), live(f.src));
	}
	if (truthy(rt.sv(f, "self_sustaining"))) {
		yield* g.srcCall(f, "adjustNutri", 1);
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/rand"), null, [3, 5])));
		yield* g.srcCall(f, "adjustWeeds", -2);
		yield* g.srcCall(f, "adjustPests", -2);
		yield* g.srcCall(f, "adjustToxic", -2);
	}
	if (rt.gt(rt.worldTime(f), add(rt.sv(f, "lastcycle"), rt.sv(f, "cycledelay")))) {
		rt.setSv(f, "lastcycle", rt.worldTime(f));
		if ((truthy(rt.sv(f, "myseed")) && !truthy(rt.sv(f, "dead")))) {
			rt.incSrcVar(f, "age", 1, true);
			if (rt.lt(rt.sv(f, "age"), rt.fv(f, "maturation", rt.sv(f, "myseed")))) {
				rt.setSv(f, "lastproduce", rt.sv(f, "age"));
			}
			needs_update = 1;
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.srcCall(f, "adjustNutri", divide(-1, rt.sv(f, "rating")));
			}
			if ((rt.le(rt.sv(f, "nutrilevel"), 0) && !truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/plant_type/weed_hardy")]))))) {
				yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 3]))));
			}
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
				currentTurf = rt.sv(f, "loc");
				lightAmt = (yield* g.callName(f, live(currentTurf), "get_lumcount", []));
				if (truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")])))) {
					if (rt.lt(live(lightAmt), 0.20000000298023224)) {
						yield* g.srcCall(f, "adjustHealth", divide(-1, rt.sv(f, "rating")));
					}
				} else {
					if (rt.lt(live(lightAmt), 0.4000000059604645)) {
						yield* g.srcCall(f, "adjustHealth", divide(-2, rt.sv(f, "rating")));
					}
				}
			}
			yield* g.srcCall(f, "adjustWater", divide(rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 6]))), rt.sv(f, "rating")));
			if ((rt.le(rt.sv(f, "waterlevel"), 10) && !truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")]))))) {
				yield* g.srcCall(f, "adjustHealth", divide(rt.neg((yield* g.call(f, P("/proc/rand"), null, [0, 1]))), rt.sv(f, "rating")));
				if (rt.le(rt.sv(f, "waterlevel"), 0)) {
					yield* g.srcCall(f, "adjustHealth", divide(rt.neg((yield* g.call(f, P("/proc/rand"), null, [0, 2]))), rt.sv(f, "rating")));
				}
			} else {
				if ((rt.gt(rt.sv(f, "waterlevel"), 10) && rt.gt(rt.sv(f, "nutrilevel"), 0))) {
					yield* g.srcCall(f, "adjustHealth", divide((yield* g.call(f, P("/proc/rand"), null, [1, 2])), rt.sv(f, "rating")));
					if ((truthy(rt.sv(f, "myseed")) && truthy(rt.op(f, "Prob", [], [rt.fv(f, "weed_chance", rt.sv(f, "myseed"))])))) {
						yield* g.srcCall(f, "adjustWeeds", rt.fv(f, "weed_rate", rt.sv(f, "myseed")));
					} else {
						if (truthy(rt.op(f, "Prob", [], [5]))) {
							yield* g.srcCall(f, "adjustWeeds", divide(1, rt.sv(f, "rating")));
						}
					}
				}
			}
			if ((rt.ge(rt.sv(f, "toxic"), 40) && rt.lt(rt.sv(f, "toxic"), 80))) {
				yield* g.srcCall(f, "adjustHealth", divide(-1, rt.sv(f, "rating")));
				yield* g.srcCall(f, "adjustToxic", divide(rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 10]))), rt.sv(f, "rating")));
			} else {
				if (rt.ge(rt.sv(f, "toxic"), 80)) {
					yield* g.srcCall(f, "adjustHealth", -3);
					yield* g.srcCall(f, "adjustToxic", divide(rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 10]))), rt.sv(f, "rating")));
				} else {
					if (rt.ge(rt.sv(f, "pestlevel"), 5)) {
						yield* g.srcCall(f, "adjustHealth", divide(-1, rt.sv(f, "rating")));
					}
				}
			}
			if ((rt.ge(rt.sv(f, "weedlevel"), 5) && !truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/plant_type/weed_hardy")]))))) {
				yield* g.srcCall(f, "adjustHealth", divide(-1, rt.sv(f, "rating")));
			}
			if (rt.le(rt.sv(f, "plant_health"), 0)) {
				yield* g.srcCall(f, "plantdies");
				yield* g.srcCall(f, "adjustWeeds", divide(1, rt.sv(f, "rating")));
			}
			if (rt.gt(rt.sv(f, "age"), rt.fv(f, "lifespan", rt.sv(f, "myseed")))) {
				yield* g.srcCall(f, "adjustHealth", divide(rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 5]))), rt.sv(f, "rating")));
			}
			if (((rt.gt(rt.sv(f, "age"), rt.fv(f, "production", rt.sv(f, "myseed"))) && rt.gt(subtract(rt.sv(f, "age"), rt.sv(f, "lastproduce")), rt.fv(f, "production", rt.sv(f, "myseed")))) && (!truthy(rt.sv(f, "harvest")) && !truthy(rt.sv(f, "dead"))))) {
				yield* g.srcCall(f, "nutrimentMutation");
				if ((truthy(rt.sv(f, "myseed")) && !isEqual(rt.fv(f, "yield", rt.sv(f, "myseed")), -1))) {
					rt.setSv(f, "harvest", 1);
				} else {
					rt.setSv(f, "lastproduce", rt.sv(f, "age"));
				}
			}
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.srcCall(f, "adjustPests", divide(1, rt.sv(f, "rating")));
			}
		} else {
			if (((rt.gt(rt.sv(f, "waterlevel"), 10) && rt.gt(rt.sv(f, "nutrilevel"), 0)) && truthy(rt.op(f, "Prob", [], [10])))) {
				yield* g.srcCall(f, "adjustWeeds", divide(1, rt.sv(f, "rating")));
			}
		}
		if ((rt.ge(rt.sv(f, "weedlevel"), 10) && truthy(rt.op(f, "Prob", [], [50])))) {
			if (truthy(rt.sv(f, "myseed"))) {
				if ((!truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/plant_type/weed_hardy")]))) && !truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/plant_type/fungal_metabolism")]))))) {
					yield* g.srcCall(f, "weedinvasion");
				}
			} else {
				yield* g.srcCall(f, "weedinvasion");
			}
			needs_update = 1;
		}
		if (truthy(live(needs_update))) {
			yield* g.srcCall(f, "update_icon");
		}
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/machinery/hydroponics/proc/nutrimentMutation  (code/modules/hydroponics/hydroponics.dm:238)  may sleep
rt.def("/obj/machinery/hydroponics/proc/nutrimentMutation", function* nutrimentMutation(f: Frame) {
	if (isEqual(rt.sv(f, "mutmod"), 0)) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mutmod"), 1)) {
		if (truthy(rt.op(f, "Prob", [], [80]))) {
			yield* g.srcCall(f, "mutate");
		} else {
			if (truthy(rt.op(f, "Prob", [], [75]))) {
				yield* g.srcCall(f, "hardmutate");
			}
		}
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mutmod"), 2)) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "mutate");
		} else {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.srcCall(f, "hardmutate");
			} else {
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					yield* g.srcCall(f, "mutatespecie");
				}
			}
		}
		return live(f.dot);
	}
	return live(f.dot);
}, true);

// /obj/machinery/hydroponics/proc/update_icon  (code/modules/hydroponics/hydroponics.dm:258)
rt.def("/obj/machinery/hydroponics/proc/update_icon", function update_icon(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "self_sustaining"))) {
		if (truthy((rt.istype(live(f.src), T("/obj/machinery/hydroponics/soil")) ? 1 : 0))) {
			rt.callSrc(f, "add_atom_colour", ["#ffaf00", 4]);
		} else {
			rt.modSrcVar(f, "overlays", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "gaia_blessing"]), add);
		}
		rt.callSrc(f, "set_light", [3]);
	}
	rt.callSrc(f, "update_icon_hoses", []);
	if (truthy(rt.sv(f, "myseed"))) {
		rt.callSrc(f, "update_icon_plant", []);
		rt.callSrc(f, "update_icon_lights", []);
	}
	if (!truthy(rt.sv(f, "self_sustaining"))) {
		if ((truthy(rt.sv(f, "myseed")) && truthy(rt.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/glow")])))) {
			rt.callSrc(f, "set_light", [rt.callName(f, (G = rt.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/glow")])), "glow_range", [rt.sv(f, "myseed")]), rt.callName(f, live(G), "glow_power", [rt.sv(f, "myseed")]), rt.fv(f, "glow_color", live(G))]);
		} else {
			rt.callSrc(f, "set_light", [0]);
		}
	}
	return live(f.dot);
});

// /obj/machinery/hydroponics/proc/update_icon_hoses  (code/modules/hydroponics/hydroponics.dm:284)
rt.def("/obj/machinery/hydroponics/proc/update_icon_hoses", function update_icon_hoses(f: Frame) {
	let n: Value = null, Dir: Value = null, t: Value = null;
	let $e: any;
	f.vars = () => [n, Dir, t, $e];
	n = 0;
	Dir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Dir = $e;
		if (((truthy((t = rt.locateIn(f, T("/obj/machinery/hydroponics"), rt.getStep(f, live(f.src), live(Dir))))) && truthy(rt.fv(f, "using_irrigation", live(t)))) && truthy(rt.sv(f, "using_irrigation")))) {
			n = rt.modify(live(n), live(Dir), add);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "icon_state", fmt("hoses-＀", [live(n)]));
	return f.dot;
});

// /obj/machinery/hydroponics/proc/update_icon_plant  (code/modules/hydroponics/hydroponics.dm:292)
rt.def("/obj/machinery/hydroponics/proc/update_icon_plant", function update_icon_plant(f: Frame) {
	let plant_overlay: Value = null, t_growthstate: Value = null;
	f.vars = () => [plant_overlay, t_growthstate];
	plant_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [null, rt.fv(f, "growing_icon", rt.sv(f, "myseed")), "layer", 3.009999990463257], rt.Args.Named);
	if (truthy(rt.sv(f, "dead"))) {
		rt.setFv(f, "icon_state", live(plant_overlay), rt.fv(f, "icon_dead", rt.sv(f, "myseed")));
	} else {
		if (truthy(rt.sv(f, "harvest"))) {
			if (!truthy(rt.fv(f, "icon_harvest", rt.sv(f, "myseed")))) {
				rt.setFv(f, "icon_state", live(plant_overlay), fmt("＀＀", [rt.fv(f, "icon_grow", rt.sv(f, "myseed")), rt.fv(f, "growthstages", rt.sv(f, "myseed"))]));
			} else {
				rt.setFv(f, "icon_state", live(plant_overlay), rt.fv(f, "icon_harvest", rt.sv(f, "myseed")));
			}
		} else {
			t_growthstate = rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "age"), rt.fv(f, "maturation", rt.sv(f, "myseed"))), rt.fv(f, "growthstages", rt.sv(f, "myseed")))]), rt.fv(f, "growthstages", rt.sv(f, "myseed"))]);
			rt.setFv(f, "icon_state", live(plant_overlay), fmt("＀＀", [rt.fv(f, "icon_grow", rt.sv(f, "myseed")), live(t_growthstate)]));
		}
	}
	rt.callSrc(f, "add_overlay", [live(plant_overlay)]);
	return f.dot;
});

// /obj/machinery/hydroponics/proc/update_icon_lights  (code/modules/hydroponics/hydroponics.dm:306)
rt.def("/obj/machinery/hydroponics/proc/update_icon_lights", function update_icon_lights(f: Frame) {
	if (rt.le(rt.sv(f, "waterlevel"), 10)) {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_lowwater3"])]);
	}
	if (rt.le(rt.sv(f, "nutrilevel"), 2)) {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_lownutri3"])]);
	}
	if (rt.le(rt.sv(f, "plant_health"), divide(rt.fv(f, "endurance", rt.sv(f, "myseed")), 2))) {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_lowhealth3"])]);
	}
	if (((rt.ge(rt.sv(f, "weedlevel"), 5) || rt.ge(rt.sv(f, "pestlevel"), 5)) || rt.ge(rt.sv(f, "toxic"), 40))) {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_alert3"])]);
	}
	if (!truthy(rt.sv(f, "harvest"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_harvest3"])]);
	return f.dot;
});

// /obj/machinery/hydroponics/proc/examine  (code/modules/hydroponics/hydroponics.dm:319)
rt.def("/obj/machinery/hydroponics/proc/examine", function examine(f: Frame) {
	let percent_progress: Value = null;
	f.vars = () => [percent_progress];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "myseed"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>It has <span class='name'>＀</span> planted.</span>", [rt.fv(f, "plantname", rt.sv(f, "myseed"))])]);
		if (truthy(rt.sv(f, "dead"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's dead!</span>"]);
		} else {
			if (truthy(rt.sv(f, "harvest"))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='info'>It's ready to harvest.</span>"]);
			} else {
				if (rt.le(rt.sv(f, "plant_health"), divide(rt.fv(f, "endurance", rt.sv(f, "myseed")), 2))) {
					rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It looks unhealthy.</span>"]);
				}
			}
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>＀ is empty.</span>", [live(f.src)])]);
	}
	if (!truthy(rt.sv(f, "self_sustaining"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>Water: ＀/＀</span>", [rt.sv(f, "waterlevel"), rt.sv(f, "maxwater")])]);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>Nutrient: ＀/＀</span>", [rt.sv(f, "nutrilevel"), rt.sv(f, "maxnutri")])]);
		if (rt.gt(rt.sv(f, "self_sufficiency_progress"), 0)) {
			percent_progress = rt.call(f, P("/proc/round"), null, [divide(multiply(rt.sv(f, "self_sufficiency_progress"), 100), rt.sv(f, "self_sufficiency_req"))]);
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>Treatment for self-sustenance are ＀% complete.</span>", [live(percent_progress)])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='info'>It doesn't require any water or nutrients.</span>"]);
	}
	if (rt.ge(rt.sv(f, "weedlevel"), 5)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is filled with weeds!</span>", [live(f.src)])]);
	}
	if (rt.ge(rt.sv(f, "pestlevel"), 5)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is filled with tiny worms!</span>", [live(f.src)])]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), ""]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/hydroponics/proc/weedinvasion  (code/modules/hydroponics/hydroponics.dm:352)  may sleep
rt.def("/obj/machinery/hydroponics/proc/weedinvasion", function* weedinvasion(f: Frame) {
	let oldPlantName: Value = null;
	let $0: any;
	f.vars = () => [oldPlantName, $0];
	rt.setSv(f, "dead", 0);
	oldPlantName = null;
	if (truthy(rt.sv(f, "myseed"))) {
		oldPlantName = rt.fv(f, "plantname", rt.sv(f, "myseed"));
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
		rt.setSv(f, "myseed", null);
	} else {
		oldPlantName = "empty tray";
	}
	$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 18]));
	if (rt.inRange($0, 16, 18)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/reishi"), [live(f.src)])));
	} else if (rt.inRange($0, 14, 15)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/nettle"), [live(f.src)])));
	} else if (rt.inRange($0, 12, 13)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/harebell"), [live(f.src)])));
	} else if (rt.inRange($0, 10, 11)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/amanita"), [live(f.src)])));
	} else if (rt.inRange($0, 8, 9)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/chanter"), [live(f.src)])));
	} else if (rt.inRange($0, 6, 7)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/tower"), [live(f.src)])));
	} else if (rt.inRange($0, 4, 5)) {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/plump"), [live(f.src)])));
	} else {
		rt.setSv(f, "myseed", (yield* g.new_(f, T("/obj/item/seeds/starthistle"), [live(f.src)])));
	}
	rt.setSv(f, "age", 0);
	rt.setSv(f, "plant_health", rt.fv(f, "endurance", rt.sv(f, "myseed")));
	rt.setSv(f, "lastcycle", rt.worldTime(f));
	rt.setSv(f, "harvest", 0);
	rt.setSv(f, "weedlevel", 0);
	rt.setSv(f, "pestlevel", 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The ＀ is overtaken by some ＀!</span>", [live(oldPlantName), rt.fv(f, "plantname", rt.sv(f, "myseed"))]));
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/mutate  (code/modules/hydroponics/hydroponics.dm:384)  may sleep
rt.def("/obj/machinery/hydroponics/proc/mutate", function* mutate(f: Frame, lifemut: Value, endmut: Value, productmut: Value, yieldmut: Value, potmut: Value, wrmut: Value, wcmut: Value, traitmut: Value) {
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
	if (!truthy(rt.sv(f, "myseed"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "myseed"), "mutate", [live(lifemut), live(endmut), live(productmut), live(yieldmut), live(potmut), live(wrmut), live(wcmut), live(traitmut)]);
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/hardmutate  (code/modules/hydroponics/hydroponics.dm:389)  may sleep
rt.def("/obj/machinery/hydroponics/proc/hardmutate", function* hardmutate(f: Frame) {
	yield* g.srcCall(f, "mutate", 4, 10, 2, 4, 50, 4, 10, 3);
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/mutatespecie  (code/modules/hydroponics/hydroponics.dm:393)  may sleep
rt.def("/obj/machinery/hydroponics/proc/mutatespecie", function* mutatespecie(f: Frame) {
	let oldPlantName: Value = null, mutantseed: Value = null;
	f.vars = () => [oldPlantName, mutantseed];
	if ((!truthy(rt.sv(f, "myseed")) || truthy(rt.sv(f, "dead")))) {
		return live(f.dot);
	}
	oldPlantName = rt.fv(f, "plantname", rt.sv(f, "myseed"));
	if (rt.gt(rt.getLen(f, rt.fv(f, "mutatelist", rt.sv(f, "myseed"))), 0)) {
		mutantseed = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "mutatelist", rt.sv(f, "myseed"))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
		rt.setSv(f, "myseed", null);
		rt.setSv(f, "myseed", (yield* g.new_(f, live(mutantseed), [])));
	} else {
		return live(f.dot);
	}
	yield* g.srcCall(f, "hardmutate");
	rt.setSv(f, "age", 0);
	rt.setSv(f, "plant_health", rt.fv(f, "endurance", rt.sv(f, "myseed")));
	rt.setSv(f, "lastcycle", rt.worldTime(f));
	rt.setSv(f, "harvest", 0);
	rt.setSv(f, "weedlevel", 0);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ suddenly mutates into ＀!</span>", [live(oldPlantName), rt.fv(f, "plantname", rt.sv(f, "myseed"))]));
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/mutateweed  (code/modules/hydroponics/hydroponics.dm:418)  may sleep
rt.def("/obj/machinery/hydroponics/proc/mutateweed", function* mutateweed(f: Frame) {
	let newWeed: Value = null;
	f.vars = () => [newWeed];
	if (rt.gt(rt.sv(f, "weedlevel"), 5)) {
		if (truthy(rt.sv(f, "myseed"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
			rt.setSv(f, "myseed", null);
		}
		newWeed = rt.op(f, "PickUnweighted", [4], [T("/obj/item/seeds/liberty"), T("/obj/item/seeds/angel"), T("/obj/item/seeds/nettle/death"), T("/obj/item/seeds/kudzu")]);
		rt.setSv(f, "myseed", (yield* g.new_(f, live(newWeed), [])));
		rt.setSv(f, "dead", 0);
		yield* g.srcCall(f, "hardmutate");
		rt.setSv(f, "age", 0);
		rt.setSv(f, "plant_health", rt.fv(f, "endurance", rt.sv(f, "myseed")));
		rt.setSv(f, "lastcycle", rt.worldTime(f));
		rt.setSv(f, "harvest", 0);
		rt.setSv(f, "weedlevel", 0);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		yield* g.srcCall(f, "update_icon");
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>The mutated weeds in ＀ spawn some ＀!</span>", [live(f.src), rt.fv(f, "plantname", rt.sv(f, "myseed"))]));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>The few weeds in ＀ seem to react, but only for a moment...</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/plantdies  (code/modules/hydroponics/hydroponics.dm:443)
rt.def("/obj/machinery/hydroponics/proc/plantdies", function plantdies(f: Frame) {
	rt.setSv(f, "plant_health", 0);
	rt.setSv(f, "harvest", 0);
	rt.setSv(f, "pestlevel", 0);
	if (truthy(rt.sv(f, "dead"))) return f.dot;
	rt.callSrc(f, "update_icon", []);
	rt.setSv(f, "dead", 1);
	return f.dot;
});

// /obj/machinery/hydroponics/proc/mutatepest  (code/modules/hydroponics/hydroponics.dm:450)  may sleep
rt.def("/obj/machinery/hydroponics/proc/mutatepest", function* mutatepest(f: Frame, user: Value) {
	f.vars = () => [user];
	if (rt.gt(rt.sv(f, "pestlevel"), 5)) {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ caused spiderling pests to spawn in a hydro tray", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ caused spiderling pests to spawn in a hydro tray", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
		yield* g.srcCall(f, "visible_message", "<span class='warning'>The pests seem to behave oddly...</span>");
		yield* g.call(f, P("/proc/spawn_atom_to_turf"), null, [T("/obj/structure/spider/spiderling/hunter"), live(f.src), 3, 0]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The pests seem to behave oddly, but quickly settle down...</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/applyChemicals  (code/modules/hydroponics/hydroponics.dm:460)  may sleep
rt.def("/obj/machinery/hydroponics/proc/applyChemicals", function* applyChemicals(f: Frame, S: Value, user: Value) {
	let salt: Value = null;
	let $0: any;
	f.vars = () => [S, user, salt, $0];
	if (truthy(rt.sv(f, "myseed"))) {
		yield* g.callName(f, rt.sv(f, "myseed"), "on_chem_reaction", [live(S)]);
	}
	if (((truthy((yield* g.callName(f, live(S), "has_reagent", ["mutagen", 5]))) || truthy((yield* g.callName(f, live(S), "has_reagent", ["radium", 10])))) || truthy((yield* g.callName(f, live(S), "has_reagent", ["uranium", 10]))))) {
		$0 = (yield* g.call(f, P("/proc/rand"), null, [100]));
		if (rt.inRange($0, 91, 100)) {
			yield* g.srcCall(f, "adjustHealth", -10);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The plant shrivels and burns.</span>"]);
		} else if (rt.inRange($0, 81, 90)) {
			yield* g.srcCall(f, "mutatespecie");
		} else if (rt.inRange($0, 66, 80)) {
			yield* g.srcCall(f, "hardmutate");
		} else if (rt.inRange($0, 41, 65)) {
			yield* g.srcCall(f, "mutate");
		} else if (rt.inRange($0, 21, 41)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The plants don't seem to react...</span>"]);
		} else if (rt.inRange($0, 11, 20)) {
			yield* g.srcCall(f, "mutateweed");
		} else if (rt.inRange($0, 1, 10)) {
			yield* g.srcCall(f, "mutatepest", live(user));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Nothing happens...</span>"]);
		}
	} else {
		if (((truthy((yield* g.callName(f, live(S), "has_reagent", ["mutagen", 2]))) || truthy((yield* g.callName(f, live(S), "has_reagent", ["radium", 5])))) || truthy((yield* g.callName(f, live(S), "has_reagent", ["uranium", 5]))))) {
			yield* g.srcCall(f, "hardmutate");
		} else {
			if (((truthy((yield* g.callName(f, live(S), "has_reagent", ["mutagen", 1]))) || truthy((yield* g.callName(f, live(S), "has_reagent", ["radium", 2])))) || truthy((yield* g.callName(f, live(S), "has_reagent", ["uranium", 2]))))) {
				yield* g.srcCall(f, "mutate");
			}
		}
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["uranium", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["uranium"])), 1)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["uranium"])), 2)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["radium", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["radium"])), 1)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["radium"])), 3)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["eznutriment", 1])))) {
		rt.setSv(f, "yieldmod", 1);
		rt.setSv(f, "mutmod", 1);
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["eznutriment"])), 1)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["left4zednutriment", 1])))) {
		rt.setSv(f, "yieldmod", 0);
		rt.setSv(f, "mutmod", 2);
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["left4zednutriment"])), 1)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["robustharvestnutriment", 1])))) {
		rt.setSv(f, "yieldmod", 1.2999999523162842);
		rt.setSv(f, "mutmod", 0);
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["robustharvestnutriment"])), 1)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["earthsblood"])))) {
		if (rt.ge((rt.modSrcVar(f, "self_sufficiency_progress", (yield* g.callName(f, live(S), "get_reagent_amount", ["earthsblood"])), add)), rt.sv(f, "self_sufficiency_req"))) {
			yield* g.srcCall(f, "become_self_sufficient");
		} else {
			if (!truthy(rt.sv(f, "self_sustaining"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ warms as it might on a spring day under a genuine Sun.</span>", [live(f.src)])]);
			}
		}
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["charcoal", 1])))) {
		yield* g.srcCall(f, "adjustToxic", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["charcoal"])), 2)]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["toxin", 1])))) {
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["toxin"])), 2)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["milk", 1])))) {
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["milk"])), 0.10000000149011612)])));
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["milk"])), 0.8999999761581421)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["beer", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["beer"])), 0.05000000074505806)]))));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["beer"])), 0.25)])));
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["beer"])), 0.699999988079071)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["fluorine", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["fluorine"])), 2)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["flourine"])), 2.5)])));
		yield* g.srcCall(f, "adjustWater", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["flourine"])), 0.5)]))));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 4]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["chlorine", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["chlorine"])), 1)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["chlorine"])), 1.5)])));
		yield* g.srcCall(f, "adjustWater", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["chlorine"])), 0.5)]))));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 3]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["phosphorus", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["phosphorus"])), 0.75)]))));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["phosphorus"])), 0.10000000149011612)])));
		yield* g.srcCall(f, "adjustWater", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["phosphorus"])), 0.5)]))));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["sugar", 1])))) {
		yield* g.srcCall(f, "adjustWeeds", (yield* g.call(f, P("/proc/rand"), null, [1, 2])));
		yield* g.srcCall(f, "adjustPests", (yield* g.call(f, P("/proc/rand"), null, [1, 2])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["sugar"])), 0.10000000149011612)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["water", 1])))) {
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["water"])), 1)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["holywater", 1])))) {
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["holywater"])), 1)])));
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["holywater"])), 0.10000000149011612)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["sodawater", 1])))) {
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["sodawater"])), 1)])));
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["sodawater"])), 0.10000000149011612)])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["sodawater"])), 0.10000000149011612)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["sacid", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["sacid"])), 1)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["sacid"])), 1.5)])));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["facid", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["facid"])), 2)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["facid"])), 3)])));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 4]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["plantbgone", 1])))) {
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["plantbgone"])), 5)]))));
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["plantbgone"])), 6)])));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [4, 8]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["napalm", 1])))) {
		if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", rt.sv(f, "myseed")), 2))) {
			yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["napalm"])), 6)]))));
			yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["napalm"])), 7)])));
			yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [5, 9]))));
		}
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["weedkiller", 1])))) {
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["weedkiller"])), 0.5)])));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["pestkiller", 1])))) {
		yield* g.srcCall(f, "adjustToxic", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["pestkiller"])), 0.5)])));
		yield* g.srcCall(f, "adjustPests", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["cryoxadone", 1])))) {
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["cryoxadone"])), 3)])));
		yield* g.srcCall(f, "adjustToxic", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["cryoxadone"])), 3)]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["ammonia", 1])))) {
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["ammonia"])), 0.5)])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["ammonia"])), 1)])));
		if (truthy(rt.sv(f, "myseed"))) {
			yield* g.callName(f, rt.sv(f, "myseed"), "adjust_yield", [(yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["ammonia"])), 0.009999999776482582)]))]);
		}
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["saltpetre", 1])))) {
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((salt = (yield* g.callName(f, live(S), "get_reagent_amount", ["saltpetre"]))), 0.25)])));
		if (truthy(rt.sv(f, "myseed"))) {
			yield* g.callName(f, rt.sv(f, "myseed"), "adjust_production", [subtract(rt.neg((yield* g.call(f, P("/proc/round"), null, [divide(live(salt), 100)]))), rt.op(f, "Prob", [], [rt.modulus(live(salt), 100)]))]);
			yield* g.callName(f, rt.sv(f, "myseed"), "adjust_potency", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(salt), 0.5)]))]);
		}
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["ash", 1])))) {
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["ash"])), 0.25)])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["ash"])), 0.5)])));
		yield* g.srcCall(f, "adjustWeeds", -1);
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["diethylamine", 1])))) {
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["diethylamine"])), 1)])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["diethylamine"])), 2)])));
		if (truthy(rt.sv(f, "myseed"))) {
			yield* g.callName(f, rt.sv(f, "myseed"), "adjust_yield", [(yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["diethylamine"])), 0.019999999552965164)]))]);
		}
		yield* g.srcCall(f, "adjustPests", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 2]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["nutriment", 1])))) {
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["nutriment"])), 0.5)])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["nutriment"])), 1)])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["virusfood", 1])))) {
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["virusfood"])), 0.5)])));
		yield* g.srcCall(f, "adjustHealth", rt.neg((yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["virusfood"])), 0.5)]))));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["blood", 1])))) {
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["blood"])), 1)])));
		yield* g.srcCall(f, "adjustPests", (yield* g.call(f, P("/proc/rand"), null, [2, 4])));
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["strangereagent", 1])))) {
		yield* g.srcCall(f, "spawnplant");
	}
	if (truthy((yield* g.callName(f, live(S), "has_reagent", ["adminordrazine", 1])))) {
		yield* g.srcCall(f, "adjustWater", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["adminordrazine"])), 1)])));
		yield* g.srcCall(f, "adjustHealth", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["adminordrazine"])), 1)])));
		yield* g.srcCall(f, "adjustNutri", (yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, live(S), "get_reagent_amount", ["adminordrazine"])), 1)])));
		yield* g.srcCall(f, "adjustPests", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 5]))));
		yield* g.srcCall(f, "adjustWeeds", rt.neg((yield* g.call(f, P("/proc/rand"), null, [1, 5]))));
	}
	if (!truthy((yield* g.callName(f, live(S), "has_reagent", ["adminordrazine", 5])))) return f.dot;
	$0 = (yield* g.call(f, P("/proc/rand"), null, [100]));
	if (rt.inRange($0, 66, 100)) {
		yield* g.srcCall(f, "mutatespecie");
	} else if (rt.inRange($0, 33, 65)) {
		yield* g.srcCall(f, "mutateweed");
	} else if (rt.inRange($0, 1, 32)) {
		yield* g.srcCall(f, "mutatepest", live(user));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Nothing happens...</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/attackby  (code/modules/hydroponics/hydroponics.dm:692)  may sleep
rt.def("/obj/machinery/hydroponics/proc/attackby", function* attackby(f: Frame) {
	let reagent_source: Value = null, syr: Value = null, trays: Value = null, target: Value = null, visi_msg: Value = null, irrigate: Value = null, syr_5: Value = null, split: Value = null, H: Value = null, S: Value = null, text_string: Value = null, S_0: Value = null, G: Value = null, h: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [reagent_source, syr, trays, target, visi_msg, irrigate, syr_5, split, H, S, text_string, S_0, G, h, $0, $1, $2, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
		if (truthy((rt.istype((reagent_source = live(f.args[0])), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
			if (!isEqual(rt.gv(f, "mode", (syr = live(reagent_source))), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't get any extract out of this plant.</span>"]);
				return live(f.dot);
			}
		}
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(reagent_source))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ is empty.</span>", [live(reagent_source)])]);
			return 1;
		}
		trays = rt.list(live(f.src));
		if (truthy(rt.sv(f, "myseed"))) {
			$0 = rt.fv(f, "plantname", rt.sv(f, "myseed"));
		} else {
			$0 = live(f.src);
		}
		target = $0;
		visi_msg = "";
		irrigate = 0;
		if ((truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0)) || truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/pill")) ? 1 : 0)))) {
			visi_msg = fmt("＀ composts ＀, spreading it through ＀", [live(f.args[1]), live(reagent_source), live(target)]);
		} else {
			if (truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
				syr_5 = live(reagent_source);
				visi_msg = fmt("＀ injects ＀ with ＀", [live(f.args[1]), live(target), live(syr_5)]);
				if (rt.le(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(syr_5))), rt.fv(f, "amount_per_transfer_from_this", live(syr_5)))) {
					rt.setFv(f, "mode", live(syr_5), 0);
				}
			} else {
				if (truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/spray")) ? 1 : 0))) {
					visi_msg = fmt("＀ sprays ＀ with ＀", [live(f.args[1]), live(target), live(reagent_source)]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/spray3.ogg"), 50, 1, -6]);
					irrigate = 1;
				} else {
					if (truthy(rt.fv(f, "amount_per_transfer_from_this", live(reagent_source)))) {
						visi_msg = fmt("＀ uses ＀ on ＀", [live(f.args[1]), live(reagent_source), live(target)]);
						irrigate = 1;
					}
				}
			}
			if (truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/slosh.ogg"), 25, 1]);
			}
		}
		if ((((truthy(live(irrigate)) && rt.gt(rt.fv(f, "amount_per_transfer_from_this", live(reagent_source)), 30)) && rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(reagent_source))), 30)) && truthy(rt.sv(f, "using_irrigation")))) {
			if (rt.gt(rt.getLen(f, (trays = (yield* g.srcCall(f, "FindConnected")))), 1)) {
				visi_msg = rt.modify(live(visi_msg), ", setting off the irrigation system", add);
			}
		}
		if (truthy(live(visi_msg))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀.</span>", [live(visi_msg)]));
		}
		split = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "amount_per_transfer_from_this", live(reagent_source)), rt.len(f, live(trays)))]));
		H = null;
		rt.forList(f, 0, live(trays), T("/obj/machinery/hydroponics"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			rt.setFv(f, "my_atom", (S = (yield* g.new_(f, T("/datum/reagents"), []))), live(H));
			yield* g.callName(f, rt.fv(f, "reagents", live(reagent_source)), "trans_to", [live(S), live(split)]);
			if ((truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0)) || truthy((rt.istype(live(reagent_source), T("/obj/item/weapon/reagent_containers/pill")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(reagent_source)]);
			}
			yield* g.callName(f, live(H), "applyChemicals", [live(S), live(f.args[1])]);
			yield* g.callName(f, live(S), "clear_reagents", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
			yield* g.callName(f, live(H), "update_icon", []);
		}
		rt.endFor(f, 0);
		if (truthy(live(reagent_source))) {
			yield* g.callName(f, live(reagent_source), "update_icon", []);
		}
		return 1;
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/seeds")) ? 1 : 0)) && !truthy((rt.istype(live(f.args[0]), T("/obj/item/seeds/sample")) ? 1 : 0)))) {
			if (!truthy(rt.sv(f, "myseed"))) {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/seeds/kudzu")) ? 1 : 0))) {
					yield* g.srcCall(f, "investigate_log", fmt("had Kudzu planted in it by ＀(＀) at (＀,＀,＀)", [rt.fv(f, "ckey", live(f.args[1])), live(f.args[1]), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")]), "kudzu");
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You plant ＀.</span>", [live(f.args[0])])]);
				rt.setSv(f, "dead", 0);
				rt.setSv(f, "myseed", live(f.args[0]));
				rt.setSv(f, "age", 1);
				rt.setSv(f, "plant_health", rt.fv(f, "endurance", rt.sv(f, "myseed")));
				rt.setSv(f, "lastcycle", rt.worldTime(f));
				yield* g.srcCall(f, "update_icon");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has seeds in it!</span>", [live(f.src)])]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/plant_analyzer")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "myseed"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("*** <B>＀</B> ***", [rt.fv(f, "plantname", rt.sv(f, "myseed"))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("- Plant Age: <span class='notice'>＀</span>", [rt.sv(f, "age")])]);
					if (truthy((text_string = (yield* g.callName(f, rt.sv(f, "myseed"), "get_analyzer_text", []))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), live(text_string)]);
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<B>No plant found.</B>"]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("- Weed level: <span class='notice'>＀ / 10</span>", [rt.sv(f, "weedlevel")])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("- Pest level: <span class='notice'>＀ / 10</span>", [rt.sv(f, "pestlevel")])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("- Toxicity level: <span class='notice'>＀ / 100</span>", [rt.sv(f, "toxic")])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("- Water level: <span class='notice'>＀ / ＀</span>", [rt.sv(f, "waterlevel"), rt.sv(f, "maxwater")])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("- Nutrition level: <span class='notice'>＀ / ＀</span>", [rt.sv(f, "nutrilevel"), rt.sv(f, "maxnutri")])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), ""]);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/cultivator")) ? 1 : 0))) {
					if (rt.gt(rt.sv(f, "weedlevel"), 0)) {
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ uproots the weeds.", [live(f.args[1])]), fmt("<span class='notice'>You remove the weeds from ＀.</span>", [live(f.src)])]);
						rt.setSv(f, "weedlevel", 0);
						yield* g.srcCall(f, "update_icon");
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This plot is completely devoid of weeds! It doesn't need uprooting.</span>"]);
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/plants")) ? 1 : 0))) {
						yield* g.srcCall(f, "attack_hand", live(f.args[1]));
						S_0 = live(f.args[0]);
						G = null;
						rt.forList(f, 0, rt.locate(rt.fv(f, "x", live(f.args[1])), rt.fv(f, "y", live(f.args[1])), rt.fv(f, "z", live(f.args[1]))), T("/obj/item/weapon/reagent_containers/food/snacks/grown"));
						while (($e = rt.next(f, 0)) !== undefined) {
							G = $e;
							if (!truthy((yield* g.callName(f, live(S_0), "can_be_inserted", [live(G)])))) {
								return live(f.dot);
							}
							yield* g.callName(f, live(S_0), "handle_item_insertion", [live(G), 1]);
						}
						rt.endFor(f, 0);
					} else {
						if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "unwrenchable")))) {
							if (truthy(rt.sv(f, "using_irrigation"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Disconnect the hoses first!</span>"]);
								return live(f.dot);
							}
							if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to wrench ＀ into place.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin to wrench ＀ in place...</span>", [live(f.src)])]);
								yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
								if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
									if (truthy(rt.sv(f, "anchored"))) {
										return live(f.dot);
									}
									rt.setSv(f, "anchored", 1);
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wrenches ＀ into place.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You wrench ＀ in place.</span>", [live(f.src)])]);
								}
							} else {
								if (truthy(rt.sv(f, "anchored"))) {
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to unwrench ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin to unwrench ＀...</span>", [live(f.src)])]);
									yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
										if (!truthy(rt.sv(f, "anchored"))) {
											return live(f.dot);
										}
										rt.setSv(f, "anchored", 0);
										yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unwrenches ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unwrench ＀.</span>", [live(f.src)])]);
									}
								}
							}
						} else {
							if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && truthy(rt.sv(f, "unwrenchable")))) {
								rt.setSv(f, "using_irrigation", (!truthy(rt.sv(f, "using_irrigation")) ? 1 : 0));
								yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
								$0 = live(f.args[1]);
								$1 = live(f.args[1]);
								if (truthy(rt.sv(f, "using_irrigation"))) {
									$1 = $1;
									$2 = "";
								} else {
									$2 = "dis";
								}
								$1 = fmt("<span class='notice'>＀ ＀connects ＀'s irrigation hoses.</span>", [$1, $2, live(f.src)]);
								if (truthy(rt.sv(f, "using_irrigation"))) {
									$2 = "";
								} else {
									$2 = "dis";
								}
								yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀connect ＀'s irrigation hoses.</span>", [$2, live(f.src)])]);
								h = null;
								rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/machinery/hydroponics"));
								while (($e = rt.next(f, 0)) !== undefined) {
									h = $e;
									yield* g.callName(f, live(h), "update_icon", []);
								}
								rt.endFor(f, 0);
							} else {
								if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/shovel/spade")) ? 1 : 0)) && truthy(rt.sv(f, "unwrenchable")))) {
									if ((!truthy(rt.sv(f, "myseed")) && !truthy(rt.sv(f, "weedlevel")))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't have any plants or weeds!</span>", [live(f.src)])]);
										return live(f.dot);
									}
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts digging out ＀'s plants...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start digging out ＀'s plants...</span>", [live(f.src)])]);
									yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1]);
									if ((!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named))) || (!truthy(rt.sv(f, "myseed")) && !truthy(rt.sv(f, "weedlevel"))))) {
										return live(f.dot);
									}
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ digs out the plants in ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You dig out all of ＀'s plants!</span>", [live(f.src)])]);
									yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1]);
									if (truthy(rt.sv(f, "myseed"))) {
										rt.setSv(f, "age", 0);
										rt.setSv(f, "plant_health", 0);
										if (truthy(rt.sv(f, "harvest"))) {
											rt.setSv(f, "harvest", 0);
										}
										yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
										rt.setSv(f, "myseed", null);
									}
									rt.setSv(f, "weedlevel", 0);
									yield* g.srcCall(f, "update_icon");
								} else {
									return (yield* g.callSuper(f, [], rt.Args.Same));
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/hydroponics/proc/attack_hand  (code/modules/hydroponics/hydroponics.dm:864)  may sleep
rt.def("/obj/machinery/hydroponics/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "harvest"))) {
		yield* g.callName(f, rt.sv(f, "myseed"), "harvest", [live(user)]);
	} else {
		if (truthy(rt.sv(f, "dead"))) {
			rt.setSv(f, "dead", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the dead plant from ＀.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
			rt.setSv(f, "myseed", null);
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.srcCall(f, "examine", live(user));
		}
	}
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/update_tray  (code/modules/hydroponics/hydroponics.dm:879)  may sleep
rt.def("/obj/machinery/hydroponics/proc/update_tray", function* update_tray(f: Frame, user: Value) {
	f.vars = () => [user];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.setSv(f, "harvest", 0);
	rt.setSv(f, "lastproduce", rt.sv(f, "age"));
	if (truthy((rt.istype(rt.sv(f, "myseed"), T("/obj/item/seeds/replicapod")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You harvest from the ＀.</span>", [rt.fv(f, "plantname", rt.sv(f, "myseed"))])]);
	} else {
		if (rt.le((yield* g.callName(f, rt.sv(f, "myseed"), "getYield", [])), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You fail to harvest anything useful!</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You harvest ＀ items from the ＀.</span>", [(yield* g.callName(f, rt.sv(f, "myseed"), "getYield", [])), rt.fv(f, "plantname", rt.sv(f, "myseed"))])]);
		}
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "myseed"), "get_gene", [T("/datum/plant_gene/trait/repeated_harvest")])))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "myseed")]);
		rt.setSv(f, "myseed", null);
		rt.setSv(f, "dead", 0);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/adjustNutri  (code/modules/hydroponics/hydroponics.dm:894)
rt.def("/obj/machinery/hydroponics/proc/adjustNutri", function adjustNutri(f: Frame, adjustamt: Value) {
	rt.setSv(f, "nutrilevel", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "nutrilevel"), live(adjustamt)), rt.sv(f, "maxnutri")])]));
	return f.dot;
});

// /obj/machinery/hydroponics/proc/adjustWater  (code/modules/hydroponics/hydroponics.dm:897)
rt.def("/obj/machinery/hydroponics/proc/adjustWater", function adjustWater(f: Frame, adjustamt: Value) {
	rt.setSv(f, "waterlevel", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "waterlevel"), live(adjustamt)), rt.sv(f, "maxwater")])]));
	if (!rt.gt(live(adjustamt), 0)) return f.dot;
	rt.callSrc(f, "adjustToxic", [rt.neg(rt.call(f, P("/proc/round"), null, [divide(live(adjustamt), 4)]))]);
	return f.dot;
});

// /obj/machinery/hydroponics/proc/adjustHealth  (code/modules/hydroponics/hydroponics.dm:903)
rt.def("/obj/machinery/hydroponics/proc/adjustHealth", function adjustHealth(f: Frame, adjustamt: Value) {
	if (!(truthy(rt.sv(f, "myseed")) && !truthy(rt.sv(f, "dead")))) return f.dot;
	rt.setSv(f, "plant_health", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "plant_health"), live(adjustamt)), rt.fv(f, "endurance", rt.sv(f, "myseed"))])]));
	return f.dot;
});

// /obj/machinery/hydroponics/proc/adjustToxic  (code/modules/hydroponics/hydroponics.dm:907)
rt.def("/obj/machinery/hydroponics/proc/adjustToxic", function adjustToxic(f: Frame, adjustamt: Value) {
	rt.setSv(f, "toxic", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "toxic"), live(adjustamt)), 100])]));
	return f.dot;
});

// /obj/machinery/hydroponics/proc/adjustPests  (code/modules/hydroponics/hydroponics.dm:910)
rt.def("/obj/machinery/hydroponics/proc/adjustPests", function adjustPests(f: Frame, adjustamt: Value) {
	rt.setSv(f, "pestlevel", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "pestlevel"), live(adjustamt)), 10])]));
	return f.dot;
});

// /obj/machinery/hydroponics/proc/adjustWeeds  (code/modules/hydroponics/hydroponics.dm:913)
rt.def("/obj/machinery/hydroponics/proc/adjustWeeds", function adjustWeeds(f: Frame, adjustamt: Value) {
	rt.setSv(f, "weedlevel", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "weedlevel"), live(adjustamt)), 10])]));
	return f.dot;
});

// /obj/machinery/hydroponics/proc/spawnplant  (code/modules/hydroponics/hydroponics.dm:916)  may sleep
rt.def("/obj/machinery/hydroponics/proc/spawnplant", function* spawnplant(f: Frame) {
	let livingplants: Value = null, chosen: Value = null, C: Value = null;
	f.vars = () => [livingplants, chosen, C];
	livingplants = rt.list(T("/mob/living/simple_animal/hostile/tree"), T("/mob/living/simple_animal/hostile/killertomato"));
	chosen = rt.op(f, "PickUnweighted", [1], [live(livingplants)]);
	rt.setFv(f, "faction", (C = (yield* g.new_(f, live(chosen), []))), rt.list("plants"));
	return f.dot;
}, true);

// /obj/machinery/hydroponics/proc/become_self_sufficient  (code/modules/hydroponics/hydroponics.dm:922)
rt.def("/obj/machinery/hydroponics/proc/become_self_sufficient", function become_self_sufficient(f: Frame) {
	rt.callSrc(f, "visible_message", [fmt("<span class='boldnotice'>＀ begins to glow with a beautiful light!</span>", [live(f.src)])]);
	rt.setSv(f, "self_sustaining", 1);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/hydroponics/soil/proc/attackby  (code/modules/hydroponics/hydroponics.dm:942)  may sleep
rt.def("/obj/machinery/hydroponics/soil/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/shovel")) ? 1 : 0)) && !truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/shovel/spade")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You clear up ＀!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });
