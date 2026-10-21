// From code/modules/hydroponics/grown/towercap.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10086, "/obj/item/seeds/tower", "/obj/item/seeds", {
	species: "towercap",
	plantname: "Tower Caps",
	product: rt.typePath("/obj/item/weapon/grown/log"),
	lifespan: 80,
	endurance: 50,
	maturation: 15,
	production: 1,
	yield: 5,
	potency: 50,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	icon_dead: "towercap-dead",
	genes: null,
	name: "pack of tower-cap mycelium",
	desc: "This mycelium grows into tower-cap mushrooms.",
	icon_state: "mycelium-tower",
	mutatelist: null,
});

// /obj/item/seeds/tower/proc/<init>  (code/modules/hydroponics/grown/towercap.dm:17)
rt.def("/obj/item/seeds/tower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "genes", rt.list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")));
	$0 = $0;
	rt.setSv(f, "mutatelist", rt.list(T("/obj/item/seeds/tower/steel")));
	return f.dot;
});

rt.type(10087, "/obj/item/seeds/tower/steel", "/obj/item/seeds/tower", {
	species: "steelcap",
	plantname: "Steel Caps",
	product: rt.typePath("/obj/item/weapon/grown/log/steel"),
	mutatelist: null,
	rarity: 20,
	name: "pack of steel-cap mycelium",
	desc: "This mycelium grows into steel logs.",
	icon_state: "mycelium-steelcap",
});

// /obj/item/seeds/tower/steel/proc/<init>  (code/modules/hydroponics/grown/towercap.dm:27)
rt.def("/obj/item/seeds/tower/steel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutatelist", rt.list());
	return f.dot;
});

rt.type(7504, "/obj/item/weapon/grown/log", "/obj/item/weapon/grown", {
	plank_name: "wooden planks",
	accepted: null,
	plank_type: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	throw_speed: 2,
	throw_range: 3,
	seed: rt.typePath("/obj/item/seeds/tower"),
	name: "tower-cap log",
	desc: "It's better than bad, it's good!",
	icon_state: "logs",
	force: 5,
	throwforce: 5,
	w_class: 3,
	origin_tech: "materials=1",
	attack_verb: null,
});

// /obj/item/weapon/grown/log/proc/<init>  (code/modules/hydroponics/grown/towercap.dm:47)
rt.def("/obj/item/weapon/grown/log/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "accepted", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/tea"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat")));
	rt.setSv(f, "attack_verb", rt.list("bashed", "battered", "bludgeoned", "whacked"));
	return f.dot;
});

// /obj/item/weapon/grown/log/proc/Initialize  (code/modules/hydroponics/grown/towercap.dm:54)  may sleep
rt.def("/obj/item/weapon/grown/log/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "accepted", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "accepted")])));
	return f.dot;
}, true);

// /obj/item/weapon/grown/log/proc/attackby  (code/modules/hydroponics/grown/towercap.dm:58)  may sleep
rt.def("/obj/item/weapon/grown/log/proc/attackby", function* attackby(f: Frame) {
	let seed_modifier: Value = null, plank: Value = null, old_plank_amount: Value = null, ST: Value = null, leaf: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [seed_modifier, plank, old_plank_amount, ST, leaf, _T, $e];
	if (truthy(rt.fv(f, "sharpness", live(f.args[0])))) {
		yield* g.callName(f, live(f.args[1]), "show_message", [fmt("<span class='notice'>You make ＀ out of ％！!</span>", [rt.sv(f, "plank_name"), live(f.src)]), 1]);
		seed_modifier = 0;
		if (truthy(rt.sv(f, "seed"))) {
			seed_modifier = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "potency", rt.sv(f, "seed")), 25)]));
		}
		plank = (yield* g.new_(f, rt.sv(f, "plank_type"), [rt.fv(f, "loc", live(f.args[1])), add(1, live(seed_modifier))]));
		old_plank_amount = rt.fv(f, "amount", live(plank));
		ST = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(f.args[1])), T("/obj/item/stack"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ST = $e;
			if (((!isEqual(live(ST), live(plank)) && truthy(rt.op(f, "IsType", [], [live(ST), rt.sv(f, "plank_type")]))) && rt.lt(rt.fv(f, "amount", live(ST)), rt.fv(f, "max_amount", live(ST))))) {
				yield* g.callName(f, live(ST), "attackby", [live(plank), live(f.args[1])]);
			}
		}
		rt.endFor(f, 0);
		if (rt.gt(rt.fv(f, "amount", live(plank)), live(old_plank_amount))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the newly-formed ＀ to the stack. It now contains ＀ ＀.</span>", [rt.sv(f, "plank_name"), rt.fv(f, "amount", live(plank)), rt.sv(f, "plank_name")])]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.sv(f, "accepted")])))) {
		if (truthy(rt.gv(f, "dry", (leaf = live(f.args[0]))))) {
			yield* g.callName(f, live(f.args[1]), "show_message", [fmt("<span class='notice'>You wrap ％！ around the log, turning it into a torch!</span>", [live(f.args[0])])]);
			_T = (yield* g.new_(f, T("/obj/item/device/flashlight/flare/torch"), [rt.fv(f, "loc", live(f.args[1]))]));
			yield* g.callName(f, live(f.usr), "dropItemToGround", [live(f.args[0])]);
			yield* g.callName(f, live(f.usr), "put_in_active_hand", [live(_T)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(leaf)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class ='warning'>You must dry this first!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(7506, "/obj/item/weapon/grown/log/steel", "/obj/item/weapon/grown/log", {
	accepted: null,
	plank_name: "rods",
	seed: rt.typePath("/obj/item/seeds/tower/steel"),
	name: "steel-cap log",
	desc: "It's made of metal.",
	icon_state: "steellogs",
	plank_type: rt.typePath("/obj/item/stack/rods"),
});

// /obj/item/weapon/grown/log/steel/proc/<init>  (code/modules/hydroponics/grown/towercap.dm:97)
rt.def("/obj/item/weapon/grown/log/steel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "accepted", rt.list());
	return f.dot;
});

rt.type(12941, "/obj/structure/bonfire", "/obj/structure", {
	burning: 0,
	grill: 0,
	fire_stack_strength: 5,
	anchored: 1,
	buckle_lying: 0,
	name: "bonfire",
	desc: "For grilling, broiling, charring, smoking, heating, roasting, toasting, simmering, searing, melting, and occasionally burning things.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "bonfire",
	density: 0,
});

// /obj/structure/bonfire/proc/attackby  (code/modules/hydroponics/grown/towercap.dm:117)  may sleep
rt.def("/obj/structure/bonfire/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, choice: Value = null, rod_underlay: Value = null, grill_overlay: Value = null, click_params: Value = null;
	let $0: any;
	f.vars = () => [R, choice, rod_underlay, grill_overlay, click_params, $0];
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0)) && !truthy(rt.sv(f, "can_buckle"))) && !truthy(rt.sv(f, "grill")))) {
		R = live(f.args[0]);
		$0 = (choice = (yield* g.op(f, "Prompt", [1], [null, "Bonfire", "What would you like to construct?", live(f.args[1]), rt.list("Stake", "Grill")])));
		if ($0 === "Stake") {
			yield* g.callName(f, live(R), "use", [1]);
			rt.setSv(f, "can_buckle", 1);
			rt.setSv(f, "buckle_requires_restraints", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='italics'>You add a rod to ％！.", [live(f.src)])]);
			rt.setFv(f, "pixel_y", (rod_underlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "bonfire_rod"]))), 16);
			rt.modSrcVar(f, "underlays", live(rod_underlay), add);
		} else if ($0 === "Grill") {
			yield* g.callName(f, live(R), "use", [1]);
			rt.setSv(f, "grill", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='italics'>You add a grill to ％！.", [live(f.src)])]);
			rt.modSrcVar(f, "overlays", (grill_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/hydroponics/equipment.dmi"), "bonfire_grill"]))), add);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		yield* g.srcCall(f, "StartBurning");
	}
	if (!truthy(rt.sv(f, "grill"))) return f.dot;
	if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && !truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 128)))) {
		if (truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			yield* g.callName(f, live(f.args[0]), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			if (((!truthy((click_params = (yield* g.call(f, P("/proc/params2list"), null, [live(f.args[2])])))) || !truthy(rt.at(live(click_params), "icon-x"))) || !truthy(rt.at(live(click_params), "icon-y")))) {
				return live(f.dot);
			}
			rt.setFv(f, "pixel_x", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.neg(divide(rt.fv(f, "icon_size", rt.world()), 2)), (yield* g.call(f, P("/proc/min"), null, [subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-x")])), 16), divide(rt.fv(f, "icon_size", rt.world()), 2)]))])));
			rt.setFv(f, "pixel_y", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.neg(divide(rt.fv(f, "icon_size", rt.world()), 2)), (yield* g.call(f, P("/proc/min"), null, [subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-y")])), 16), divide(rt.fv(f, "icon_size", rt.world()), 2)]))])));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/bonfire/proc/attack_hand  (code/modules/hydroponics/grown/towercap.dm:156)  may sleep
rt.def("/obj/structure/bonfire/proc/attack_hand", function* attack_hand(f: Frame) {
	let I: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [I, L, $e];
	if (truthy(rt.sv(f, "burning"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You need to extinguish ＀ before removing the logs!", [live(f.src)])]);
		return live(f.dot);
	}
	if ((!truthy((yield* g.srcCall(f, "has_buckled_mobs"))) && truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[0]), null, 50, "target", live(f.src)], rt.Args.Named))))) {
		I = null;
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			rt.modField(f, (L = (yield* g.new_(f, T("/obj/item/weapon/grown/log"), [rt.fv(f, "loc", live(f.src))]))), "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [1, 4])), add);
			rt.modField(f, live(L), "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [1, 4])), add);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/bonfire/proc/CheckOxygen  (code/modules/hydroponics/grown/towercap.dm:169)
rt.def("/obj/structure/bonfire/proc/CheckOxygen", function CheckOxygen(f: Frame) {
	let O: Value = null, G: Value = null;
	f.vars = () => [O, G];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "air", (O = rt.sv(f, "loc"))))) {
			if (rt.gt(rt.index(rt.index((G = rt.gv(f, "gases", rt.fv(f, "air", live(O)))), "o2"), 1), 13)) {
				return 1;
			}
		}
	}
	return 0;
});

// /obj/structure/bonfire/proc/StartBurning  (code/modules/hydroponics/grown/towercap.dm:178)  may sleep
rt.def("/obj/structure/bonfire/proc/StartBurning", function* StartBurning(f: Frame) {
	if (!(!truthy(rt.sv(f, "burning")) && truthy((yield* g.srcCall(f, "CheckOxygen"))))) return f.dot;
	rt.setSv(f, "icon_state", "bonfire_on_fire");
	rt.setSv(f, "burning", 1);
	yield* g.srcCall(f, "set_light", 6);
	yield* g.srcCall(f, "Burn");
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/bonfire/proc/fire_act  (code/modules/hydroponics/grown/towercap.dm:186)  may sleep
rt.def("/obj/structure/bonfire/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.srcCall(f, "StartBurning");
	return f.dot;
}, true);

// /obj/structure/bonfire/proc/Crossed  (code/modules/hydroponics/grown/towercap.dm:189)  may sleep
rt.def("/obj/structure/bonfire/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy(rt.bitAnd(rt.sv(f, "burning"), (!truthy(rt.sv(f, "grill")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "Burn");
	return f.dot;
}, true);

// /obj/structure/bonfire/proc/Burn  (code/modules/hydroponics/grown/towercap.dm:193)  may sleep
rt.def("/obj/structure/bonfire/proc/Burn", function* Burn(f: Frame) {
	let current_location: Value = null, A: Value = null, O: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [current_location, A, O, L, $e];
	yield* g.callName(f, (current_location = rt.getStep(f, live(f.src), 0)), "hotspot_expose", [1000, 500, 1]);
	A = null;
	rt.forList(f, 0, live(current_location));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(live(A), live(f.src))) {
			continue;
		}
		if (truthy((rt.istype(live(A), T("/obj")) ? 1 : 0))) {
			yield* g.callName(f, (O = live(A)), "fire_act", [1000, 500]);
		} else {
			if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
				yield* g.callName(f, (L = live(A)), "adjust_fire_stacks", [rt.sv(f, "fire_stack_strength")]);
				yield* g.callName(f, live(L), "IgniteMob", []);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/bonfire/proc/Cook  (code/modules/hydroponics/grown/towercap.dm:207)  may sleep
rt.def("/obj/structure/bonfire/proc/Cook", function* Cook(f: Frame) {
	let current_location: Value = null, A: Value = null, L: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [current_location, A, L, O, $e];
	current_location = rt.getStep(f, live(f.src), 0);
	A = null;
	rt.forList(f, 0, live(current_location));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(live(A), live(f.src))) {
			continue;
		}
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			yield* g.callName(f, (L = live(A)), "adjust_fire_stacks", [rt.sv(f, "fire_stack_strength")]);
			yield* g.callName(f, live(L), "IgniteMob", []);
		} else {
			if ((truthy((rt.istype(live(A), T("/obj/item")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [20])))) {
				yield* g.callName(f, (O = live(A)), "microwave_act", []);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/bonfire/proc/process  (code/modules/hydroponics/grown/towercap.dm:220)  may sleep
rt.def("/obj/structure/bonfire/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "CheckOxygen")))) {
		yield* g.srcCall(f, "extinguish");
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "grill"))) {
		yield* g.srcCall(f, "Burn");
	} else {
		yield* g.srcCall(f, "Cook");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/bonfire/proc/extinguish  (code/modules/hydroponics/grown/towercap.dm:230)
rt.def("/obj/structure/bonfire/proc/extinguish", function extinguish(f: Frame) {
	if (!truthy(rt.sv(f, "burning"))) return f.dot;
	rt.setSv(f, "icon_state", "bonfire");
	rt.setSv(f, "burning", 0);
	rt.callSrc(f, "set_light", [0]);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
});

// /obj/structure/bonfire/proc/buckle_mob  (code/modules/hydroponics/grown/towercap.dm:236)  may sleep
rt.def("/obj/structure/bonfire/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.modField(f, live(f.args[0]), "pixel_y", 13, add);
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /obj/structure/bonfire/proc/unbuckle_mob  (code/modules/hydroponics/grown/towercap.dm:240)  may sleep
rt.def("/obj/structure/bonfire/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	(rt.modField(f, live(f.args[0]), "pixel_y", 13, subtract));
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });
