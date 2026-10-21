// From code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10898, "/obj/machinery/monkey_recycler", "/obj/machinery", {
	grinded: 0,
	required_grind: 5,
	cube_production: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 50,
	name: "monkey recycler",
	desc: "A machine used for recycling dead monkeys into monkey cubes. It currently produces 1 cube for every 5 monkeys inserted.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "grinder",
	layer: 2.9,
	density: 1,
});

// /obj/machinery/monkey_recycler/proc/New  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:18)  may sleep
rt.def("/obj/machinery/monkey_recycler/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/monkey_recycler"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6751, "/obj/item/weapon/circuitboard/machine/monkey_recycler", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Monkey Recycler (Machine Board)",
	build_path: rt.typePath("/obj/machinery/monkey_recycler"),
	origin_tech: "programming=1;biotech=2",
});

// /obj/item/weapon/circuitboard/machine/monkey_recycler/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:26)
rt.def("/obj/item/weapon/circuitboard/machine/monkey_recycler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	return f.dot;
});

// /obj/machinery/monkey_recycler/proc/RefreshParts  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:33)
rt.def("/obj/machinery/monkey_recycler/proc/RefreshParts", function RefreshParts(f: Frame) {
	let req_grind: Value = null, cubes_made: Value = null, B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [req_grind, cubes_made, B, M, $e];
	req_grind = 5;
	cubes_made = 1;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		(req_grind = rt.modify(live(req_grind), rt.fv(f, "rating", live(B)), subtract));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		cubes_made = rt.fv(f, "rating", live(M));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "cube_production", live(cubes_made));
	rt.setSv(f, "required_grind", live(req_grind));
	rt.setFv(f, "desc", live(f.src), fmt("A machine used for recycling dead monkeys into monkey cubes. It currently produces ＀ cube(s) for every ＀ monkey(s) inserted.", [live(cubes_made), rt.sv(f, "required_grind")]));
	return f.dot;
});

// /obj/machinery/monkey_recycler/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:42)  may sleep
rt.def("/obj/machinery/monkey_recycler/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "grinder_open", "grinder", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		yield* g.srcCall(f, "power_change");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/monkey_recycler/proc/MouseDrop_T  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:64)  may sleep
rt.def("/obj/machinery/monkey_recycler/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon/monkey")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "stuff_monkey_in", live(target), live(user));
	return f.dot;
}, true);

// /obj/machinery/monkey_recycler/proc/stuff_monkey_in  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:70)  may sleep
rt.def("/obj/machinery/monkey_recycler/proc/stuff_monkey_in", function* stuff_monkey_in(f: Frame, target: Value, user: Value) {
	let offset: Value = null;
	let $0: any;
	f.vars = () => [target, user, offset, $0];
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "stat", live(target)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The monkey is struggling far too much to put it in the recycler.</span>"]);
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "buckled", live(target))) || truthy((yield* g.callName(f, live(target), "has_buckled_mobs", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The monkey is attached to something.</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You stuff the monkey into the machine.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/juicer.ogg"), 50, 1]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = -2;
	} else {
		$0 = 2;
	}
	offset = $0;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(offset)), "time", 0.20000000298023224, "loop", 200]);
	yield* g.srcCall(f, "use_power", 500);
	rt.incSrcVar(f, "grinded", 1, true);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The machine now has ＀ monkey５ worth of material stored.</span>", [rt.sv(f, "grinded")])]);
	return f.dot;
}, true);

// /obj/machinery/monkey_recycler/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/monkeyrecycler.dm:91)  may sleep
rt.def("/obj/machinery/monkey_recycler/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null;
	f.vars = () => [user, i];
	if (!isEqual(rt.fv(f, "stat", live(f.src)), 0)) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "grinded"), rt.sv(f, "required_grind"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The machine hisses loudly as it condenses the grinded monkey meat. After a moment, it dispenses a brand new monkey cube.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/hiss.ogg"), 50, 1]);
		(rt.modSrcVar(f, "grinded", rt.sv(f, "required_grind"), subtract));
		i = null;
		i = 0;
		while (rt.lt(live(i), rt.sv(f, "cube_production"))) {
			yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), [rt.fv(f, "loc", live(f.src))]);
			i = rt.inc(live(i), 1);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The machine's display flashes that it has ＀ monkeys worth of material left.</span>", [rt.sv(f, "grinded")])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>The machine needs at least ＀ monkey(s) worth of material to produce a monkey cube. It only has ＀.</span>", [rt.sv(f, "required_grind"), rt.sv(f, "grinded")])]);
	}
	return live(f.dot);
}, true);
