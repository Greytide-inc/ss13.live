// From code/modules/food_and_drinks/kitchen_machinery/processor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10899, "/obj/machinery/processor", "/obj/machinery", {
	broken: 0,
	processing: 0,
	rating_speed: 1,
	rating_amount: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 50,
	name: "food processor",
	desc: "An industrial grinder used to process meat and other foods. Keep hands clear of intake area while operating.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "processor1",
	layer: 2.9,
	density: 1,
});

// /obj/machinery/processor/proc/New  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:19)  may sleep
rt.def("/obj/machinery/processor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/processor"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6752, "/obj/item/weapon/circuitboard/machine/processor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Food Processor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/processor"),
	origin_tech: "programming=1",
});

// /obj/item/weapon/circuitboard/machine/processor/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:27)
rt.def("/obj/item/weapon/circuitboard/machine/processor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	return f.dot;
});

// /obj/item/weapon/circuitboard/machine/processor/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:36)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/processor/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "build_path"), T("/obj/machinery/processor"))) {
			rt.setSv(f, "name", "Slime Processor (Machine Board)");
			rt.setSv(f, "build_path", T("/obj/machinery/processor/slime"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Name protocols successfully updated.</span>"]);
		} else {
			rt.setSv(f, "name", "Food Processor (Machine Board)");
			rt.setSv(f, "build_path", T("/obj/machinery/processor"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Defaulting name protocols.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/processor/proc/RefreshParts  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:49)
rt.def("/obj/machinery/processor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [B, M, $e];
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.setSv(f, "rating_amount", rt.fv(f, "rating", live(B)));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setSv(f, "rating_speed", rt.fv(f, "rating", live(M)));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/processor/proc/process  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:55)  may sleep
rt.def("/obj/machinery/processor/proc/process", function* process(f: Frame) {
	let picked_slime: Value = null, slime: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [picked_slime, slime, _P, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "processing"))) {
		return live(f.dot);
	}
	picked_slime = null;
	slime = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		slime = $e;
		if (isEqual(rt.fv(f, "loc", live(slime)), live(f.src))) {
			continue;
		}
		if (truthy((rt.istype(live(slime), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
			if (truthy(rt.fv(f, "stat", live(slime)))) {
				picked_slime = live(slime);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(picked_slime))) {
		return live(f.dot);
	}
	if (!truthy((_P = (yield* g.srcCall(f, "select_recipe", live(picked_slime)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "visible_message", [fmt("＀ is sucked into ＀.", [live(picked_slime), live(f.src)])]);
	rt.setFv(f, "loc", live(picked_slime), live(f.src));
	return f.dot;
}, true, { waitfor: false });

rt.type(2316, "/datum/food_processor_process", "/datum", {
	input: null,
	output: null,
	time: 40,
});

// /datum/food_processor_process/proc/process_food  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:82)  may sleep
rt.def("/datum/food_processor_process/proc/process_food", function* process_food(f: Frame, loc: Value, what: Value, processor: Value) {
	let i: Value = null;
	f.vars = () => [loc, what, processor, i];
	if (((truthy(rt.fv(f, "output", live(f.src))) && truthy(live(loc))) && truthy(live(processor)))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), rt.fv(f, "rating_amount", live(processor)))) {
			yield* g.new_(f, rt.fv(f, "output", live(f.src)), [live(loc)]);
			i = rt.inc(live(i), 1);
		}
	}
	if (!truthy(live(what))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(what)]);
	return f.dot;
}, true);

rt.type(2327, "/datum/food_processor_process/mob", "/datum/food_processor_process", {});

// /datum/food_processor_process/mob/proc/process_food  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:131)  may sleep
rt.def("/datum/food_processor_process/mob/proc/process_food", function* process_food(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "what", "processor"] });

rt.type(2328, "/datum/food_processor_process/mob/slime", "/datum/food_processor_process/mob", {
	output: null,
	input: rt.typePath("/mob/living/simple_animal/slime"),
});

// /datum/food_processor_process/mob/slime/proc/process_food  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:135)  may sleep
rt.def("/datum/food_processor_process/mob/slime/proc/process_food", function* process_food(f: Frame) {
	let S: Value = null, C: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [S, C, i, $e];
	S = live(f.args[1]);
	C = rt.fv(f, "cores", live(S));
	if (!isEqual(rt.fv(f, "stat", live(S)), 2)) {
		rt.setFv(f, "loc", live(S), live(f.args[0]));
		yield* g.callName(f, live(S), "visible_message", [fmt("<span class='notice'>＀ crawls free of the processor!</span>", [live(C)])]);
		return live(f.dot);
	}
	i = null;
	rt.forRange(f, 0, 1, subtract(add(live(C), rt.fv(f, "rating_amount", live(f.args[2]))), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, rt.fv(f, "coretype", live(S)), [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "what", "processor"] });

rt.type(2329, "/datum/food_processor_process/mob/monkey", "/datum/food_processor_process/mob", {
	output: null,
	input: rt.typePath("/mob/living/carbon/monkey"),
});

// /datum/food_processor_process/mob/monkey/proc/process_food  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:150)  may sleep
rt.def("/datum/food_processor_process/mob/monkey/proc/process_food", function* process_food(f: Frame) {
	let O: Value = null, bucket: Value = null, B: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [O, bucket, B, D, $e];
	if (truthy(rt.gv(f, "client", (O = live(f.args[1]))))) {
		rt.setFv(f, "loc", live(O), live(f.args[0]));
		yield* g.callName(f, live(O), "visible_message", [fmt("<span class='notice'>Suddenly ＀ jumps out from the processor!</span>", [live(O)]), "<span class='notice'>You jump out from the processor!</span>", "<span class='italics'>You hear chimpering.</span>"]);
		return live(f.dot);
	}
	bucket = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bucket"), [live(f.args[0])]));
	rt.setFv(f, "holder", (B = (yield* g.new_(f, T("/datum/reagent/blood"), []))), live(bucket));
	rt.setFv(f, "volume", live(B), 70);
	rt.setAt(rt.fv(f, "data", live(B)), "donor", live(O));
	D = null;
	rt.forList(f, 0, rt.fv(f, "viruses", live(O)), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "spread_flags", live(D)), 1))) {
			rt.modAt(rt.fv(f, "data", live(B)), "viruses", (yield* g.callName(f, live(D), "Copy", [])), add);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.callName(f, live(O), "has_dna", [])))) {
		rt.setAt(rt.fv(f, "data", live(B)), "blood_DNA", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(O))));
	}
	if ((truthy(rt.fv(f, "resistances", live(O))) && truthy(rt.getLen(f, rt.fv(f, "resistances", live(O)))))) {
		rt.setAt(rt.fv(f, "data", live(B)), "resistances", (yield* g.callName(f, rt.fv(f, "resistances", live(O)), "Copy", [])));
	}
	rt.modField(f, rt.fv(f, "reagents", live(bucket)), "reagent_list", live(B), add);
	yield* g.callName(f, rt.fv(f, "reagents", live(bucket)), "update_total", []);
	yield* g.callName(f, live(bucket), "on_reagent_change", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "what", "processor"] });

// /obj/machinery/processor/proc/select_recipe  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:183)  may sleep
rt.def("/obj/machinery/processor/proc/select_recipe", function* select_recipe(f: Frame, X: Value) {
	let Type: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [X, Type, _P, $e];
	Type = null;
	rt.forList(f, 0, subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/food_processor_process")])), T("/datum/food_processor_process")), T("/datum/food_processor_process/mob")));
	while (($e = rt.next(f, 0)) !== undefined) {
		Type = $e;
		_P = (yield* g.new_(f, live(Type), []));
		if (!truthy(rt.op(f, "IsType", [], [live(X), rt.fv(f, "input", live(_P))]))) {
			continue;
		}
		return live(_P);
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /obj/machinery/processor/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:191)  may sleep
rt.def("/obj/machinery/processor/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, loaded: Value = null, S: Value = null, _P: Value = null, _P_0: Value = null;
	let $e: any;
	f.vars = () => [_T, loaded, S, _P, _P_0, $e];
	if (truthy(rt.fv(f, "processing", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The processor is in the process of processing!</span>"]);
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "processor", "processor1", live(f.args[0]))))) {
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
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/tray")) ? 1 : 0))) {
		_T = live(f.args[0]);
		loaded = 0;
		S = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj/item/weapon/reagent_containers/food/snacks"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (truthy((_P = (yield* g.srcCall(f, "select_recipe", live(S)))))) {
				yield* g.callName(f, live(_T), "remove_from_storage", [live(S), live(f.src)]);
				loaded = rt.inc(live(loaded), 1);
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(loaded))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ items into ＀.</span>", [live(loaded), live(f.src)])]);
		}
		return live(f.dot);
	}
	if (truthy((_P_0 = (yield* g.srcCall(f, "select_recipe", live(f.args[0])))))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ put ＀ into ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("You put ＀ into ＀.", [live(f.args[0]), live(f.src)])]);
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		return 1;
	} else {
		if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>That probably won't blend!</span>"]);
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/processor/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:237)  may sleep
rt.def("/obj/machinery/processor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let pushed_mob: Value = null, total_time: Value = null, O: Value = null, _P: Value = null, offset: Value = null, O_2: Value = null, _P_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, pushed_mob, total_time, O, _P, offset, O_2, _P_3, $0, $e];
	if (!isEqual(rt.fv(f, "stat", live(f.src)), 0)) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "processing", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The processor is in the process of processing!</span>"]);
		return 1;
	}
	if (((isEqual(rt.fv(f, "a_intent", live(user)), "grab") && truthy(rt.fv(f, "pulling", live(user)))) && (truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living/simple_animal/slime")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living/carbon/monkey")) ? 1 : 0))))) {
		if (rt.lt(rt.fv(f, "grab_state", live(user)), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need a better grip to do that!</span>"]);
			return live(f.dot);
		}
		pushed_mob = rt.fv(f, "pulling", live(user));
		yield* g.srcCall(f, "visible_message", fmt("<span class='warner'>＀ stuffs ＀ into ＀!</span>", [live(user), live(pushed_mob), live(f.src)]));
		yield* g.callName(f, live(pushed_mob), "forceMove", [live(f.src)]);
		yield* g.callName(f, live(user), "stop_pulling", []);
		return live(f.dot);
	}
	if (isEqual(rt.getLen(f, rt.fv(f, "contents", live(f.src))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The processor is empty!</span>"]);
		return 1;
	}
	rt.setFv(f, "processing", live(f.src), 1);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ turns on ＀.", [live(user), live(f.src)]), fmt("<span class='notice'>You turn on ＀.</span>", [live(f.src)]), "<span class='italics'>You hear a food processor.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/blender.ogg"), 50, 1]);
	yield* g.srcCall(f, "use_power", 500);
	total_time = 0;
	O = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy((_P = (yield* g.srcCall(f, "select_recipe", live(O)))))) {
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("DEBUG: ＀ in processor hasnt got a suitable recipe. How did it get in there? Please report it immediatly!!!", [live(O)])]);
			continue;
		}
		total_time = rt.modify(live(total_time), rt.fv(f, "time", live(_P)), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = -2;
	} else {
		$0 = 2;
	}
	offset = $0;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(offset)), "time", 0.20000000298023224, "loop", multiply(divide(live(total_time), rt.sv(f, "rating_speed")), 5)]);
	yield* g.call(f, P("/proc/sleep"), null, [divide(live(total_time), rt.sv(f, "rating_speed"))]);
	O_2 = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		O_2 = $e;
		if (!truthy((_P_3 = (yield* g.srcCall(f, "select_recipe", live(O_2)))))) {
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("DEBUG: ＀ in processor havent suitable recipe. How do you put it in?", [live(O_2)])]);
			continue;
		}
		yield* g.callName(f, live(_P_3), "process_food", [rt.fv(f, "loc", live(f.src)), live(O_2), live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setFv(f, "processing", live(f.src), 0);
	yield* g.callName(f, live(f.src), "visible_message", [fmt("＄！ finishes processing.", [live(f.src)])]);
	return f.dot;
}, true);

// /obj/machinery/processor/verb/eject  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:285)  may sleep
rt.def("/obj/machinery/processor/verb/eject", function* eject(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "empty", []);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return live(f.dot);
}, true, { verb: { name: "Eject Contents", category: "Object", src: 3, range: 1 } });

// /obj/machinery/processor/proc/empty  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:292)
rt.def("/obj/machinery/processor/proc/empty", function empty(f: Frame) {
	let O: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [O, M, $e];
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(f.src), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setFv(f, "loc", live(M), rt.fv(f, "loc", live(f.src)));
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

rt.type(10900, "/obj/machinery/processor/slime", "/obj/machinery/processor", {
	name: "Slime processor",
	desc: "An industrial grinder with a sticker saying appropriated for science department. Keep hands clear of intake area while operating.",
});

// /obj/machinery/processor/slime/proc/New  (code/modules/food_and_drinks/kitchen_machinery/processor.dm:303)  may sleep
rt.def("/obj/machinery/processor/slime/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/processor/slime"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);
