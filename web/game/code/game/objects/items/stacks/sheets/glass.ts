// From code/game/objects/items/stacks/sheets/glass.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalglass_recipes  (code/game/objects/items/stacks/sheets/glass.dm:11)
rt.def("/datum/controller/global_vars/proc/InitGlobalglass_recipes", function InitGlobalglass_recipes(f: Frame) {
	rt.setGl("glass_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "directional window", null, T("/obj/structure/window/unanchored"), "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "fulltile window", null, T("/obj/structure/window/fulltile/unanchored"), null, 2, "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "glass_recipes", add);
	return f.dot;
});

rt.type(9022, "/obj/item/stack/sheet/glass", "/obj/item/stack/sheet", {
	name: "glass",
	desc: "HOLY SHEET! That is a lot of glass.",
	singular_name: "glass sheet",
	icon_state: "sheet-glass",
	materials: null,
	origin_tech: "materials=1",
	armor: null,
	resistance_flags: 32,
	merge_type: rt.typePath("/obj/item/stack/sheet/glass"),
});

// /obj/item/stack/sheet/glass/proc/<init>  (code/game/objects/items/stacks/sheets/glass.dm:21)
rt.def("/obj/item/stack/sheet/glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 100]));
	return f.dot;
});

rt.type(9023, "/obj/item/stack/sheet/glass/cyborg", "/obj/item/stack/sheet/glass", {
	materials: null,
	is_cyborg: 1,
	cost: 500,
});

// /obj/item/stack/sheet/glass/cyborg/proc/<init>  (code/game/objects/items/stacks/sheets/glass.dm:28)
rt.def("/obj/item/stack/sheet/glass/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/stack/sheet/glass/proc/Initialize  (code/game/objects/items/stacks/sheets/glass.dm:36)  may sleep
rt.def("/obj/item/stack/sheet/glass/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("glass_recipes"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /obj/item/stack/sheet/glass/proc/attackby  (code/game/objects/items/stacks/sheets/glass.dm:40)  may sleep
rt.def("/obj/item/stack/sheet/glass/proc/attackby", function* attackby(f: Frame) {
	let CC: Value = null, new_tile: Value = null, V: Value = null, RG: Value = null, G: Value = null, replace: Value = null;
	f.vars = () => [CC, new_tile, V, RG, G, replace];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
		CC = live(f.args[0]);
		if ((rt.lt((yield* g.srcCall(f, "get_amount")), 1) || rt.lt((yield* g.callName(f, live(CC), "get_amount", [])), 5))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning>You need five lengths of coil and one sheet of glass to make wired glass!</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, live(CC), "use", [5]);
		yield* g.srcCall(f, "use", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach wire to the ＀.</span>", [rt.sv(f, "name")])]);
		yield* g.callName(f, (new_tile = (yield* g.new_(f, T("/obj/item/stack/light_w"), [rt.fv(f, "loc", live(f.args[1]))]))), "add_fingerprint", [live(f.args[1])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
			if ((rt.ge((yield* g.callName(f, (V = live(f.args[0])), "get_amount", [])), 1) && rt.ge((yield* g.callName(f, live(f.src), "get_amount", [])), 1))) {
				yield* g.callName(f, (RG = (yield* g.new_(f, T("/obj/item/stack/sheet/rglass"), [rt.fv(f, "loc", live(f.args[1]))]))), "add_fingerprint", [live(f.args[1])]);
				G = live(f.src);
				f.src = null;
				replace = (isEqual((yield* g.callName(f, live(f.args[1]), "get_inactive_held_item", [])), live(G)) ? 1 : 0);
				yield* g.callName(f, live(V), "use", [1]);
				yield* g.callName(f, live(G), "use", [1]);
				if ((!truthy(live(G)) && truthy(live(replace)))) {
					yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(RG)]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one rod and one sheet of glass to make reinforced glass!</span>"]);
				return live(f.dot);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /datum/controller/global_vars/proc/InitGlobalreinforced_glass_recipes  (code/game/objects/items/stacks/sheets/glass.dm:73)
rt.def("/datum/controller/global_vars/proc/InitGlobalreinforced_glass_recipes", function InitGlobalreinforced_glass_recipes(f: Frame) {
	rt.setGl("reinforced_glass_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "windoor frame", null, T("/obj/structure/windoor_assembly"), null, 5, "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), [null, "directional reinforced window", null, T("/obj/structure/window/reinforced/unanchored"), "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "fulltile reinforced window", null, T("/obj/structure/window/reinforced/fulltile/unanchored"), null, 2, "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "reinforced_glass_recipes", add);
	return f.dot;
});

rt.type(9025, "/obj/item/stack/sheet/rglass", "/obj/item/stack/sheet", {
	name: "reinforced glass",
	desc: "Glass which seems to have rods or something stuck in them.",
	singular_name: "reinforced glass sheet",
	icon_state: "sheet-rglass",
	materials: null,
	origin_tech: "materials=2",
	armor: null,
	resistance_flags: 32,
	merge_type: rt.typePath("/obj/item/stack/sheet/rglass"),
});

// /obj/item/stack/sheet/rglass/proc/<init>  (code/game/objects/items/stacks/sheets/glass.dm:86)
rt.def("/obj/item/stack/sheet/rglass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 2000]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 100]));
	return f.dot;
});

rt.type(9026, "/obj/item/stack/sheet/rglass/cyborg", "/obj/item/stack/sheet/rglass", {
	glasource: null,
	metcost: 250,
	glacost: 500,
	materials: null,
});

// /obj/item/stack/sheet/rglass/cyborg/proc/<init>  (code/game/objects/items/stacks/sheets/glass.dm:93)
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/stack/sheet/rglass/cyborg/proc/get_amount  (code/game/objects/items/stacks/sheets/glass.dm:99)
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/get_amount", function get_amount(f: Frame) {
	return rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "energy", rt.sv(f, "source")), rt.sv(f, "metcost"))]), rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "energy", rt.sv(f, "glasource")), rt.sv(f, "glacost"))])]);
});

// /obj/item/stack/sheet/rglass/cyborg/proc/use  (code/game/objects/items/stacks/sheets/glass.dm:102)
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/use", function use(f: Frame, amount: Value) {
	rt.callName(f, rt.sv(f, "source"), "use_charge", [multiply(live(amount), rt.sv(f, "metcost"))]);
	rt.callName(f, rt.sv(f, "glasource"), "use_charge", [multiply(live(amount), rt.sv(f, "glacost"))]);
	return f.dot;
});

// /obj/item/stack/sheet/rglass/cyborg/proc/add  (code/game/objects/items/stacks/sheets/glass.dm:106)
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/add", function _add(f: Frame, amount: Value) {
	rt.callName(f, rt.sv(f, "source"), "add_charge", [multiply(live(amount), rt.sv(f, "metcost"))]);
	rt.callName(f, rt.sv(f, "glasource"), "add_charge", [multiply(live(amount), rt.sv(f, "glacost"))]);
	return f.dot;
});

// /obj/item/stack/sheet/rglass/proc/Initialize  (code/game/objects/items/stacks/sheets/glass.dm:110)  may sleep
rt.def("/obj/item/stack/sheet/rglass/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("reinforced_glass_recipes"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(7052, "/obj/item/weapon/shard", "/obj/item/weapon", {
	cooldown: 0,
	name: "shard",
	desc: "A nasty looking shard of glass.",
	icon: rt.rsc("icons/obj/shards.dmi"),
	icon_state: "large",
	w_class: 1,
	force: 5,
	throwforce: 10,
	item_state: "shard-glass",
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	resistance_flags: 32,
	armor: null,
	obj_integrity: 40,
	max_integrity: 40,
	sharpness: 1,
});

// /obj/item/weapon/shard/proc/<init>  (code/game/objects/items/stacks/sheets/glass.dm:123)
rt.def("/obj/item/weapon/shard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000]));
	rt.setSv(f, "attack_verb", rt.list("stabbed", "slashed", "sliced", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 100]));
	return f.dot;
});

// /obj/item/weapon/shard/proc/suicide_act  (code/game/objects/items/stacks/sheets/glass.dm:134)
rt.def("/obj/item/weapon/shard/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is slitting ＀ ＀ with the shard of glass! It looks like ＀ trying to commit suicide.</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.op(f, "PickUnweighted", [2], ["wrists", "throat"]), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/shard/proc/Initialize  (code/game/objects/items/stacks/sheets/glass.dm:139)  may sleep
rt.def("/obj/item/weapon/shard/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [3], ["large", "medium", "small"]));
	$0 = rt.sv(f, "icon_state");
	if ($0 === "small") {
		rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-12, 12])));
		rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-12, 12])));
	} else if ($0 === "medium") {
		rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
		rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	} else if ($0 === "large") {
		rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
		rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	}
	return f.dot;
}, true);

// /obj/item/weapon/shard/proc/afterattack  (code/game/objects/items/stacks/sheets/glass.dm:153)  may sleep
rt.def("/obj/item/weapon/shard/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let hit_hand: Value = null, H: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [A, user, proximity, hit_hand, H, M, $0];
	if ((!truthy(live(proximity)) || !truthy((rt.isIn(f, live(f.src), live(user)) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(A), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.modulus(rt.fv(f, "active_hand_index", live(user)), 2), 0)) {
		$0 = "r_";
	} else {
		$0 = "l_";
	}
	hit_hand = add($0, "arm");
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "gloves", (H = live(user)))) && !truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>＀ cuts into your hand!</span>", [live(f.src)])]);
			yield* g.callName(f, live(H), "apply_damage", [multiply(rt.sv(f, "force"), 0.5), "brute", live(hit_hand)]);
		}
	} else {
		if (!truthy((rt.istype(live(user), T("/mob/living/carbon/monkey")) ? 1 : 0))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [(M = live(user)), fmt("<span class='warning'>＀ cuts into your hand!</span>", [live(f.src)])]);
		yield* g.callName(f, live(M), "apply_damage", [multiply(rt.sv(f, "force"), 0.5), "brute", live(hit_hand)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/shard/proc/attackby  (code/game/objects/items/stacks/sheets/glass.dm:172)  may sleep
rt.def("/obj/item/weapon/shard/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, NG: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [WT, NG, G, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/lightreplacer")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "attackby", [live(f.src), live(f.args[1])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				NG = (yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [rt.fv(f, "loc", live(f.args[1]))]));
				G = null;
				rt.forList(f, 0, rt.fv(f, "loc", live(f.args[1])), T("/obj/item/stack/sheet/glass"));
				while (($e = rt.next(f, 0)) !== undefined) {
					G = $e;
					if (isEqual(live(G), live(NG))) {
						continue;
					}
					if (rt.ge(rt.fv(f, "amount", live(G)), rt.fv(f, "max_amount", live(G)))) {
						continue;
					}
					yield* g.callName(f, live(G), "attackby", [live(NG), live(f.args[1])]);
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the newly-formed glass to the stack. It now contains ＀ sheet５.</span>", [rt.fv(f, "amount", live(NG))])]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/shard/proc/Crossed  (code/game/objects/items/stacks/sheets/glass.dm:190)  may sleep
rt.def("/obj/item/weapon/shard/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let H: Value = null, picked_def_zone: Value = null, O: Value = null, feetCover: Value = null;
	f.vars = () => [AM, H, picked_def_zone, O, feetCover];
	if (!(truthy((rt.istype(live(AM), T("/mob")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "has_gravity", rt.sv(f, "loc")))))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glass_step.ogg"), 50, 1]);
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = live(AM);
	if (truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
		return live(f.dot);
	}
	picked_def_zone = rt.op(f, "PickUnweighted", [2], ["l_leg", "r_leg"]);
	if (!truthy((rt.istype((O = (yield* g.callName(f, live(H), "get_bodypart", [live(picked_def_zone)]))), T("/obj/item/bodypart")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "status", live(O)), 2)) {
		return live(f.dot);
	}
	feetCover = ((rt.fv(f, "wear_suit", live(H)) && rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 96)) || (rt.fv(f, "w_uniform", live(H)) && rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "w_uniform", live(H))), 96)));
	if ((((truthy(rt.fv(f, "shoes", live(H))) || truthy(live(feetCover))) || truthy(rt.bitAnd(rt.fv(f, "movement_type", live(H)), 2))) || truthy(rt.fv(f, "buckled", live(H))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(H), "apply_damage", [5, "brute", live(picked_def_zone)]);
	if (rt.lt(rt.sv(f, "cooldown"), subtract(rt.worldTime(f), 10))) {
		if (!truthy((yield* g.callName(f, live(H), "incapacitated", [])))) {
			yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ steps in the broken glass!</span>", [live(H)]), "<span class='userdanger'>You step in the broken glass!</span>"]);
		} else {
			yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ slides on the broken glass!</span>", [live(H)]), "<span class='userdanger'>You slide on the broken glass!</span>"]);
		}
		rt.setSv(f, "cooldown", rt.worldTime(f));
	}
	yield* g.callName(f, live(H), "Knockdown", [60]);
	return f.dot;
}, true);
