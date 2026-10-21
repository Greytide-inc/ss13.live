// From code/modules/mob/living/simple_animal/hostile/bees.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4910, "/mob/living/simple_animal/hostile/poison/bees", "/mob/living/simple_animal/hostile/poison", {
	beegent: null,
	beehome: null,
	idle: 0,
	isqueen: 0,
	icon_base: "bee",
	pass_flags: 21,
	name: "bee",
	desc: "Buzzy buzzy bee, stingy sti- Ouch!",
	icon_state: "",
	icon_living: "",
	icon: rt.rsc("icons/mob/bees.dmi"),
	gender: "female",
	speak_emote: null,
	emote_hear: null,
	turns_per_move: 0,
	melee_damage_lower: 1,
	melee_damage_upper: 1,
	attacktext: "stings",
	response_help: "shoos",
	response_disarm: "swats away",
	response_harm: "squashes",
	maxHealth: 10,
	health: 10,
	faction: null,
	move_to_delay: 0,
	obj_damage: 0,
	environment_smash: 0,
	mouse_opacity: 2,
	mob_size: 0,
	movement_type: 2,
	gold_core_spawnable: 1,
	search_objects: 1,
	atmos_requirements: null,
	minbodytemp: 0,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/poison/bees/proc/<init>  (code/modules/mob/living/simple_animal/hostile/bees.dm:20)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("buzzes"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("buzzes"));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("hostile"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/bees.dm:59)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "generate_bee_visuals");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/poison/bees/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/bees.dm:65)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "beehome"))) {
		(rt.modField(f, rt.sv(f, "beehome"), "bees", live(f.src), subtract));
		rt.setSv(f, "beehome", null);
	}
	rt.setSv(f, "beegent", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/poison/bees/proc/death  (code/modules/mob/living/simple_animal/hostile/bees.dm:73)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/death", function* death(f: Frame) {
	if (truthy(rt.sv(f, "beehome"))) {
		(rt.modField(f, rt.sv(f, "beehome"), "bees", live(f.src), subtract));
		rt.setSv(f, "beehome", null);
	}
	rt.setSv(f, "beegent", null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/poison/bees/proc/examine  (code/modules/mob/living/simple_animal/hostile/bees.dm:80)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "beehome"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>This bee is homeless!</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /mob/living/simple_animal/hostile/poison/bees/proc/generate_bee_visuals  (code/modules/mob/living/simple_animal/hostile/bees.dm:87)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/generate_bee_visuals", function generate_bee_visuals(f: Frame) {
	let col: Value = null;
	f.vars = () => [col];
	rt.callSrc(f, "cut_overlays", []);
	col = "#e5e500";
	if ((truthy(rt.sv(f, "beegent")) && truthy(rt.fv(f, "color", rt.sv(f, "beegent"))))) {
		col = rt.fv(f, "color", rt.sv(f, "beegent"));
	}
	rt.callSrc(f, "add_overlay", [fmt("＀_base", [rt.sv(f, "icon_base")])]);
	rt.setGl("greyscale_overlay", (rt.gl("greyscale_overlay") || rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/bees.dmi")])));
	rt.setFv(f, "icon_state", rt.gl("greyscale_overlay"), fmt("＀_grey", [rt.sv(f, "icon_base")]));
	rt.setFv(f, "color", rt.gl("greyscale_overlay"), live(col));
	rt.callSrc(f, "add_overlay", [rt.gl("greyscale_overlay")]);
	rt.callSrc(f, "add_overlay", [fmt("＀_wings", [rt.sv(f, "icon_base")])]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/CanAttack  (code/modules/mob/living/simple_animal/hostile/bees.dm:106)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/CanAttack", function CanAttack(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) {
		return 0;
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	return (!truthy(rt.callName(f, (H = live(f.args[0])), "bee_friendly", [])) ? 1 : 0);
}, false, { args: ["the_target"] });

// /mob/living/simple_animal/hostile/poison/bees/proc/Found  (code/modules/mob/living/simple_animal/hostile/bees.dm:115)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Found", function Found(f: Frame, A: Value) {
	let Hydro: Value = null, H: Value = null;
	f.vars = () => [Hydro, H];
	if (truthy((rt.istype(live(A), T("/obj/machinery/hydroponics")) ? 1 : 0))) {
		if (((truthy(rt.gv(f, "myseed", (Hydro = live(A)))) && !truthy(rt.fv(f, "dead", live(Hydro)))) && !truthy(rt.fv(f, "recent_bee_visit", live(Hydro))))) {
			(rt.modSrcVar(f, "wanted_objects", rt.call(f, P("/proc/typecacheof"), null, [T("/obj/machinery/hydroponics")]), rt.bitOr));
			return 1;
		}
	}
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		return (!truthy(rt.callName(f, (H = live(A)), "bee_friendly", [])) ? 1 : 0);
	}
	return 0;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/bees.dm:128)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let Hydro: Value = null, BB: Value = null, L: Value = null;
	f.vars = () => [Hydro, BB, L];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/machinery/hydroponics")) ? 1 : 0))) {
		yield* g.srcCall(f, "pollinate", (Hydro = rt.sv(f, "target")));
	} else {
		if (isEqual(rt.sv(f, "target"), rt.sv(f, "beehome"))) {
			rt.setSv(f, "loc", (BB = rt.sv(f, "target")));
			rt.setSv(f, "target", null);
			(rt.modSrcVar(f, "wanted_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/obj/structure/beebox")])), subtract));
			return live(f.dot);
		} else {
			f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
			if (!((truthy(live(f.dot)) && truthy(rt.sv(f, "beegent"))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) return f.dot;
			if (!truthy(rt.gv(f, "reagents", (L = rt.sv(f, "target"))))) return f.dot;
			yield* g.callName(f, rt.sv(f, "beegent"), "reaction_mob", [live(L), 5]);
			yield* g.callName(f, rt.fv(f, "reagents", live(L)), "add_reagent", [rt.fv(f, "id", rt.sv(f, "beegent")), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))]);
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/poison/bees/proc/assign_reagent  (code/modules/mob/living/simple_animal/hostile/bees.dm:147)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/assign_reagent", function assign_reagent(f: Frame, R: Value) {
	if (!truthy((rt.istype(live(R), T("/datum/reagent")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "beegent", live(R));
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.initial(f, live(f.src), "name"), rt.fv(f, "name", live(R))]));
	rt.callSrc(f, "generate_bee_visuals", []);
	return f.dot;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/pollinate  (code/modules/mob/living/simple_animal/hostile/bees.dm:154)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/pollinate", function pollinate(f: Frame, Hydro: Value) {
	let growth: Value = null;
	f.vars = () => [growth];
	if ((((!truthy((rt.istype(live(Hydro), T("/obj/machinery/hydroponics")) ? 1 : 0)) || !truthy(rt.fv(f, "myseed", live(Hydro)))) || truthy(rt.fv(f, "dead", live(Hydro)))) || truthy(rt.fv(f, "recent_bee_visit", live(Hydro))))) {
		rt.setSv(f, "target", null);
		return live(f.dot);
	}
	rt.setSv(f, "target", null);
	(rt.modSrcVar(f, "wanted_objects", rt.call(f, P("/proc/typecacheof"), null, [T("/obj/machinery/hydroponics")]), subtract));
	rt.setFv(f, "recent_bee_visit", live(Hydro), 1);
	rt.spawnTail(f, 200, "/mob/living/simple_animal/hostile/poison/bees/proc/pollinate: spawn at modules/mob/living/simple_animal/hostile/bees.dm:161", Hydro, growth);
	growth = rt.sv(f, "health");
	rt.callName(f, live(Hydro), "adjustHealth", [multiply(live(growth), 0.5)]);
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		rt.callName(f, live(Hydro), "adjustPests", [-10]);
	}
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		rt.callName(f, rt.fv(f, "myseed", live(Hydro)), "adjust_yield", [1]);
		rt.setFv(f, "yieldmod", live(Hydro), 2);
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.callName(f, rt.fv(f, "myseed", live(Hydro)), "adjust_potency", [1]);
	}
	if (!truthy(rt.sv(f, "beehome"))) return f.dot;
	rt.setFv(f, "bee_resources", rt.sv(f, "beehome"), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "bee_resources", rt.sv(f, "beehome")), live(growth)), 100]));
	return f.dot;
});

// a spawn(200) body of /mob/living/simple_animal/hostile/poison/bees/proc/pollinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/poison/bees/proc/pollinate: spawn at modules/mob/living/simple_animal/hostile/bees.dm:161", function* (f: Frame, Hydro: Value, growth: Value) {
	f.vars = () => [Hydro, growth];
	if (truthy(live(Hydro))) {
		rt.setFv(f, "recent_bee_visit", live(Hydro), 0);
	}
	return null;
});

// /mob/living/simple_animal/hostile/poison/bees/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/bees.dm:181)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let BB: Value = null;
	let $e: any;
	f.vars = () => [BB, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "isqueen"))) {
		if (isEqual(rt.sv(f, "loc"), rt.sv(f, "beehome"))) {
			rt.setSv(f, "idle", (yield* g.call(f, P("/proc/min"), null, [100, rt.incSrcVar(f, "idle", 1, false)])));
			if ((rt.ge(rt.sv(f, "idle"), 70) && truthy(rt.op(f, "Prob", [], [5])))) {
				rt.setSv(f, "loc", rt.getStep(f, rt.sv(f, "beehome"), 0));
			}
		} else {
			rt.setSv(f, "idle", (yield* g.call(f, P("/proc/max"), null, [0, rt.incSrcVar(f, "idle", -1, false)])));
			if ((rt.le(rt.sv(f, "idle"), 0) && truthy(rt.op(f, "Prob", [], [35])))) {
				if (!truthy((yield* g.srcCall(f, "FindTarget")))) {
					(rt.modSrcVar(f, "wanted_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/obj/structure/beebox")])), rt.bitOr));
					rt.setSv(f, "target", rt.sv(f, "beehome"));
				}
			}
		}
	}
	if (truthy(rt.sv(f, "beehome"))) return f.dot;
	BB = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "vision_range"), live(f.src)])), T("/obj/structure/beebox"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BB = $e;
		if ((truthy((yield* g.srcCall(f, "reagent_incompatible", rt.fv(f, "queen_bee", live(BB))))) || rt.ge(rt.getLen(f, rt.fv(f, "bees", live(BB))), (yield* g.callName(f, live(BB), "get_max_bees", []))))) {
			continue;
		}
		(rt.modField(f, live(BB), "bees", live(f.src), rt.bitOr));
		rt.setSv(f, "beehome", live(BB));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

rt.type(4911, "/mob/living/simple_animal/hostile/poison/bees/toxin", "/mob/living/simple_animal/hostile/poison/bees", {});

// /mob/living/simple_animal/hostile/poison/bees/toxin/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/bees.dm:204)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/toxin/proc/Initialize", function* Initialize(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	R = rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/typesof"), null, [T("/datum/reagent/toxin")]))]);
	yield* g.srcCall(f, "assign_reagent", rt.index(rt.gl("chemical_reagents_list"), rt.initial(f, live(R), "id")));
	return f.dot;
}, true);

rt.type(4912, "/mob/living/simple_animal/hostile/poison/bees/queen", "/mob/living/simple_animal/hostile/poison/bees", {
	icon_base: "queen",
	isqueen: 1,
	name: "queen bee",
	desc: "She's the queen of bees, BZZ BZZ!",
});

// /mob/living/simple_animal/hostile/poison/bees/queen/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/bees.dm:222)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/bees/queen/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(live(f.dot)) && truthy(rt.sv(f, "beegent"))) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) return f.dot;
	L = rt.sv(f, "target");
	yield* g.callName(f, rt.sv(f, "beegent"), "reaction_mob", [live(L), 1]);
	yield* g.callName(f, rt.fv(f, "reagents", live(L)), "add_reagent", [rt.fv(f, "id", rt.sv(f, "beegent")), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/poison/bees/proc/reagent_incompatible  (code/modules/mob/living/simple_animal/hostile/bees.dm:235)
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/reagent_incompatible", function reagent_incompatible(f: Frame, B: Value) {
	if (!truthy(live(B))) {
		return 0;
	}
	if (((((truthy(rt.fv(f, "beegent", live(B))) && truthy(rt.sv(f, "beegent"))) && !isEqual(rt.gv(f, "id", rt.fv(f, "beegent", live(B))), rt.fv(f, "id", rt.sv(f, "beegent")))) || (truthy(rt.fv(f, "beegent", live(B))) && !truthy(rt.sv(f, "beegent")))) || (!truthy(rt.fv(f, "beegent", live(B))) && truthy(rt.sv(f, "beegent"))))) {
		return 1;
	}
	return 0;
});

rt.type(10129, "/obj/item/queen_bee", "/obj/item", {
	queen: null,
	item_state: "",
	name: "queen bee",
	desc: "She's the queen of bees, BZZ BZZ!",
	icon_state: "queen_item",
	icon: rt.rsc("icons/mob/bees.dmi"),
});

// /obj/item/queen_bee/proc/attackby  (code/modules/mob/living/simple_animal/hostile/bees.dm:252)  may sleep
rt.def("/obj/item/queen_bee/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, qb: Value = null, R: Value = null;
	f.vars = () => [S, qb, R];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, rt.gv(f, "reagents", (S = live(f.args[0]))), "has_reagent", ["royal_bee_jelly"])))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(S)), "has_reagent", ["royal_bee_jelly", 5])))) {
				yield* g.callName(f, rt.fv(f, "reagents", live(S)), "remove_reagent", ["royal_bee_jelly", 5]);
				rt.setFv(f, "queen", (qb = (yield* g.new_(f, T("/obj/item/queen_bee"), [rt.getStep(f, live(f.args[1]), 0)]))), (yield* g.new_(f, T("/mob/living/simple_animal/hostile/poison/bees/queen"), [live(qb)])));
				if ((truthy(rt.sv(f, "queen")) && truthy(rt.fv(f, "beegent", rt.sv(f, "queen"))))) {
					yield* g.callName(f, rt.fv(f, "queen", live(qb)), "assign_reagent", [rt.fv(f, "beegent", rt.sv(f, "queen"))]);
				}
				yield* g.callName(f, live(f.args[1]), "put_in_active_hand", [live(qb)]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ injects ＀ with royal bee jelly, causing it to split into two bees, MORE BEES!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class ='warning'>You inject ＀ with royal bee jelly, causing it to split into two bees, MORE BEES!</span>", [live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You don't have enough royal bee jelly to split a bee in two!</span>"]);
			}
		} else {
			if ((truthy((R = rt.index(rt.gl("chemical_reagents_list"), (yield* g.callName(f, rt.fv(f, "reagents", live(S)), "get_master_reagent_id", []))))) && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(S)), "has_reagent", [rt.fv(f, "id", live(R)), 5]))))) {
				yield* g.callName(f, rt.fv(f, "reagents", live(S)), "remove_reagent", [rt.fv(f, "id", live(R)), 5]);
				yield* g.callName(f, rt.sv(f, "queen"), "assign_reagent", [live(R)]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ injects ＀'s genome with ＀, mutating it's DNA!</span>", [live(f.args[1]), live(f.src), rt.fv(f, "name", live(R))]), fmt("<span class='warning'>You inject ＀'s genome with ＀, mutating it's DNA!</span>", [live(f.src), rt.fv(f, "name", live(R))])]);
				rt.setSv(f, "name", rt.fv(f, "name", rt.sv(f, "queen")));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You don't have enough units of that chemical to modify the bee's DNA!</span>"]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(10130, "/obj/item/queen_bee/bought", "/obj/item/queen_bee", {});

// /obj/item/queen_bee/bought/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/bees.dm:278)  may sleep
rt.def("/obj/item/queen_bee/bought/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "queen", (yield* g.new_(f, T("/mob/living/simple_animal/hostile/poison/bees/queen"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/queen_bee/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/bees.dm:283)  may sleep
rt.def("/obj/item/queen_bee/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "queen")]);
	rt.setSv(f, "queen", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
