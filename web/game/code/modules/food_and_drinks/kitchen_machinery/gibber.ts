// From code/modules/food_and_drinks/kitchen_machinery/gibber.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10894, "/obj/machinery/gibber/autogibber", "/obj/machinery/gibber", {
	input_plate: null,
});

// /obj/machinery/gibber/autogibber/proc/Initialize  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:23)  may sleep
rt.def("/obj/machinery/gibber/autogibber/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null, input_obj: Value = null;
	let $e: any;
	f.vars = () => [i, input_obj, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	i = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy((input_obj = rt.locateIn(f, T("/obj/machinery/mineral/input"), rt.getStep(f, rt.sv(f, "loc"), live(i)))))) {
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(input_obj))])))) {
				rt.setSv(f, "input_plate", rt.fv(f, "loc", live(input_obj)));
				yield* g.call(f, P("/proc/qdel"), null, [live(input_obj)]);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "input_plate"))) return f.dot;
	yield* g.call(f, P("/proc/CRASH"), null, ["Didn't find an input plate."]);
	return live(f.dot);
}, true);

// /obj/machinery/gibber/autogibber/proc/Bumped  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:37)  may sleep
rt.def("/obj/machinery/gibber/autogibber/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	let M: Value = null;
	f.vars = () => [A, M];
	if (!truthy(rt.sv(f, "input_plate"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) return f.dot;
	if (!isEqual(rt.gv(f, "loc", (M = live(A))), rt.sv(f, "input_plate"))) return f.dot;
	rt.setFv(f, "loc", live(M), live(f.src));
	yield* g.callName(f, live(M), "gib", []);
	return f.dot;
}, true);

rt.type(10893, "/obj/machinery/gibber", "/obj/machinery", {
	operating: 0,
	dirty: 0,
	gibtime: 40,
	meat_produced: 0,
	ignore_clothing: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 500,
	name: "gibber",
	desc: "The name isn't descriptive enough?",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "grinder",
	density: 1,
});

// /obj/machinery/gibber/proc/Initialize  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:48)  may sleep
rt.def("/obj/machinery/gibber/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "add_overlay", "grjam");
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/gibber"), []))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6749, "/obj/item/weapon/circuitboard/machine/gibber", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Gibber (Machine Board)",
	build_path: rt.typePath("/obj/machinery/gibber"),
	origin_tech: "programming=2;engineering=2",
});

// /obj/item/weapon/circuitboard/machine/gibber/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:57)
rt.def("/obj/item/weapon/circuitboard/machine/gibber/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	return f.dot;
});

// /obj/machinery/gibber/proc/RefreshParts  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:63)
rt.def("/obj/machinery/gibber/proc/RefreshParts", function RefreshParts(f: Frame) {
	let gib_time: Value = null, B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [gib_time, B, M, $e];
	gib_time = 40;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.modSrcVar(f, "meat_produced", rt.fv(f, "rating", live(B)), add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(gib_time = rt.modify(live(gib_time), multiply(5, rt.fv(f, "rating", live(M))), subtract));
		rt.setSv(f, "gibtime", live(gib_time));
		if (rt.ge(rt.fv(f, "rating", live(M)), 2)) {
			rt.setSv(f, "ignore_clothing", 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/gibber/proc/update_icon  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:72)
rt.def("/obj/machinery/gibber/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "dirty"))) {
		rt.callSrc(f, "add_overlay", ["grbloody"]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "occupant"))) {
		rt.callSrc(f, "add_overlay", ["grjam"]);
	} else {
		if (truthy(rt.sv(f, "operating"))) {
			rt.callSrc(f, "add_overlay", ["gruse"]);
		} else {
			rt.callSrc(f, "add_overlay", ["gridle"]);
		}
	}
	return f.dot;
});

// /obj/machinery/gibber/proc/attack_paw  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:85)  may sleep
rt.def("/obj/machinery/gibber/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/gibber/proc/container_resist  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:88)  may sleep
rt.def("/obj/machinery/gibber/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "go_out");
	return f.dot;
}, true);

// /obj/machinery/gibber/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:91)  may sleep
rt.def("/obj/machinery/gibber/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null, C: Value = null;
	f.vars = () => [user, L, C];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "operating"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>It's locked and running.</span>"]);
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "pulling", live(user))) && isEqual(rt.fv(f, "a_intent", live(user)), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living")) ? 1 : 0)))) {
		if (!truthy((rt.istype((L = rt.fv(f, "pulling", live(user))), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>This item is not suitable for the gibber!</span>"]);
			return live(f.dot);
		}
		if ((truthy(rt.gv(f, "buckled", (C = live(L)))) || truthy((yield* g.callName(f, live(C), "has_buckled_mobs", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is attached to something!</span>", [live(C)])]);
			return live(f.dot);
		}
		if ((truthy((yield* g.callName(f, live(C), "abiotic", [1]))) && !truthy(rt.sv(f, "ignore_clothing")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Subject may not have abiotic items on.</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ starts to put ＀ into the gibber!</span>", [live(user), live(C)])]);
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "gibtime"), "target", live(f.src)], rt.Args.Named)))) {
			if (((((truthy(live(C)) && isEqual(rt.fv(f, "pulling", live(user)), live(C))) && !truthy(rt.fv(f, "buckled", live(C)))) && !truthy((yield* g.callName(f, live(C), "has_buckled_mobs", [])))) && !truthy(rt.sv(f, "occupant")))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ stuffs ＀ into the gibber!</span>", [live(user), live(C)])]);
				yield* g.callName(f, live(C), "forceMove", [live(f.src)]);
				rt.setSv(f, "occupant", live(C));
				yield* g.srcCall(f, "update_icon");
			}
		}
	} else {
		yield* g.srcCall(f, "startgibbing", live(user));
	}
	return f.dot;
}, true);

// /obj/machinery/gibber/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:122)  may sleep
rt.def("/obj/machinery/gibber/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "grinder_open", "grinder", live(f.args[0]))))) {
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		} else {
			if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
				return live(f.dot);
			} else {
				if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
					return live(f.dot);
				} else {
					if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
						return live(f.dot);
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/machinery/gibber/verb/eject  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:146)  may sleep
rt.def("/obj/machinery/gibber/verb/eject", function* eject(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "go_out", []);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return live(f.dot);
}, true, { verb: { name: "empty gibber", category: "Object", src: 3, range: 1 } });

// /obj/machinery/gibber/proc/go_out  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:153)  may sleep
rt.def("/obj/machinery/gibber/proc/go_out", function* go_out(f: Frame) {
	yield* g.srcCall(f, "dropContents");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/gibber/proc/startgibbing  (code/modules/food_and_drinks/kitchen_machinery/gibber.dm:157)  may sleep
rt.def("/obj/machinery/gibber/proc/startgibbing", function* startgibbing(f: Frame, user: Value) {
	let offset: Value = null, mob_occupant: Value = null, sourcename: Value = null, sourcejob: Value = null, gibee: Value = null, sourcenutriment: Value = null, gibtype: Value = null, typeofmeat: Value = null, typeofskin: Value = null, allmeat: Value = null, allskin: Value = null, gibee_10: Value = null, C: Value = null, i: Value = null, newmeat: Value = null, newskin: Value = null, _T: Value = null, nearby_turfs: Value = null, skin: Value = null, i_13: Value = null, meatslab: Value = null, turfs: Value = null, gibturf: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, offset, mob_occupant, sourcename, sourcejob, gibee, sourcenutriment, gibtype, typeofmeat, typeofskin, allmeat, allskin, gibee_10, C, i, newmeat, newskin, _T, nearby_turfs, skin, i_13, meatslab, turfs, gibturf, $0, $e];
	if (truthy(rt.fv(f, "operating", live(f.src)))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "occupant", live(f.src)))) {
		yield* g.srcCall(f, "visible_message", "<span class='italics'>You hear a loud metallic grinding sound.</span>");
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 1000);
	yield* g.srcCall(f, "visible_message", "<span class='italics'>You hear a loud squelchy grinding sound.</span>");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/juicer.ogg"), 50, 1]);
	rt.setFv(f, "operating", live(f.src), 1);
	yield* g.srcCall(f, "update_icon");
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = -2;
	} else {
		$0 = 2;
	}
	offset = $0;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(offset)), "time", 0.20000000298023224, "loop", 200]);
	mob_occupant = rt.sv(f, "occupant");
	sourcename = rt.fv(f, "real_name", live(mob_occupant));
	sourcejob = null;
	if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		sourcejob = rt.gv(f, "job", (gibee = rt.sv(f, "occupant")));
	}
	sourcenutriment = divide(rt.fv(f, "nutrition", live(mob_occupant)), 15);
	gibtype = T("/obj/effect/decal/cleanable/blood/gibs");
	typeofmeat = T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human");
	typeofskin = T("/obj/item/stack/sheet/animalhide/human");
	allmeat = rt.op(f, "CreateMultidimensionalList", [1], [rt.sv(f, "meat_produced")]);
	allskin = null;
	if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "dna", (gibee_10 = rt.sv(f, "occupant")))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(gibee_10)))))) {
			typeofmeat = rt.gv(f, "meat", rt.gv(f, "species", rt.fv(f, "dna", live(gibee_10))));
			if (truthy(rt.gv(f, "skinned_type", rt.gv(f, "species", rt.fv(f, "dna", live(gibee_10)))))) {
				typeofskin = rt.gv(f, "skinned_type", rt.gv(f, "species", rt.fv(f, "dna", live(gibee_10))));
			}
		}
	} else {
		if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon")) ? 1 : 0))) {
			typeofmeat = rt.gv(f, "type_of_meat", (C = rt.sv(f, "occupant")));
			gibtype = rt.fv(f, "gib_type", live(C));
			if (truthy((rt.istype(live(C), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
				typeofskin = T("/obj/item/stack/sheet/animalhide/monkey");
			} else {
				if (truthy((rt.istype(live(C), T("/mob/living/carbon/alien")) ? 1 : 0))) {
					typeofskin = T("/obj/item/stack/sheet/animalhide/xeno");
				}
			}
		}
	}
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "meat_produced"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		newmeat = (yield* g.new_(f, live(typeofmeat), []));
		newskin = (yield* g.new_(f, live(typeofskin), []));
		rt.setFv(f, "name", live(newmeat), fmt("＀ ＀", [live(sourcename), rt.fv(f, "name", live(newmeat))]));
		if (truthy((rt.istype(live(newmeat), T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab")) ? 1 : 0))) {
			rt.setFv(f, "subjectname", live(newmeat), live(sourcename));
			yield* g.callName(f, rt.fv(f, "reagents", live(newmeat)), "add_reagent", ["nutriment", divide(live(sourcenutriment), rt.sv(f, "meat_produced"))]);
			if (truthy(live(sourcejob))) {
				rt.setFv(f, "subjectjob", live(newmeat), live(sourcejob));
			}
		}
		rt.setAt(live(allmeat), live(i), live(newmeat));
		allskin = live(newskin);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), rt.sv(f, "occupant"), "gibbed"]);
	yield* g.callName(f, live(mob_occupant), "death", [1]);
	yield* g.callName(f, live(mob_occupant), "ghostize", []);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "occupant", live(f.src))]);
	rt.spawnTail(f, rt.fv(f, "gibtime", live(f.src)), "/obj/machinery/gibber/proc/startgibbing: spawn at modules/food_and_drinks/kitchen_machinery/gibber.dm:215", user, offset, mob_occupant, sourcename, sourcejob, gibee, sourcenutriment, gibtype, typeofmeat, typeofskin, allmeat, allskin, gibee_10, C, i, newmeat, newskin, _T, nearby_turfs, skin, i_13, meatslab, turfs, gibturf);
	return f.dot;
}, true);

// a spawn(rt.fieldI(f, live(f.src), $ic[73])) body of /obj/machinery/gibber/proc/startgibbing, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/gibber/proc/startgibbing: spawn at modules/food_and_drinks/kitchen_machinery/gibber.dm:215", function* (f: Frame, user: Value, offset: Value, mob_occupant: Value, sourcename: Value, sourcejob: Value, gibee: Value, sourcenutriment: Value, gibtype: Value, typeofmeat: Value, typeofskin: Value, allmeat: Value, allskin: Value, gibee_10: Value, C: Value, i: Value, newmeat: Value, newskin: Value, _T: Value, nearby_turfs: Value, skin: Value, i_13: Value, meatslab: Value, turfs: Value, gibturf: Value) {
	let $e: any;
	f.vars = () => [user, offset, mob_occupant, sourcename, sourcejob, gibee, sourcenutriment, gibtype, typeofmeat, typeofskin, allmeat, allskin, gibee_10, C, i, newmeat, newskin, _T, nearby_turfs, skin, i_13, meatslab, turfs, gibturf, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	rt.setSv(f, "operating", 0);
	_T = rt.getStep(f, live(f.src), 0);
	nearby_turfs = subtract((yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), 3), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), 3), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), 3), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), 3), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])), live(_T));
	rt.setFv(f, "loc", (skin = live(allskin)), rt.fv(f, "loc", live(f.src)));
	yield* g.callName(f, live(skin), "throw_at", [rt.op(f, "PickUnweighted", [1], [live(nearby_turfs)]), rt.sv(f, "meat_produced"), 3]);
	i_13 = null;
	rt.forRange(f, 0, 1, rt.sv(f, "meat_produced"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i_13 = $e;
		rt.setFv(f, "loc", (meatslab = rt.index(live(allmeat), live(i_13))), rt.fv(f, "loc", live(f.src)));
		yield* g.callName(f, live(meatslab), "throw_at", [rt.op(f, "PickUnweighted", [1], [live(nearby_turfs)]), live(i_13), 3]);
		turfs = null;
		rt.forRange(f, 1, 1, rt.sv(f, "meat_produced"), 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			turfs = $e;
			if (truthy((rt.isIn(f, ((!truthy(rt.gv(f, "density", (gibturf = rt.op(f, "PickUnweighted", [1], [live(nearby_turfs)])))) ? 1 : 0) && live(f.src)), (yield* g.call(f, P("/proc/view"), null, [live(gibturf)]))) ? 1 : 0))) {
				yield* g.new_(f, live(gibtype), [live(gibturf), live(i_13)]);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setFv(f, "operating", live(f.src), 0);
	yield* g.srcCall(f, "update_icon");
	return null;
});
