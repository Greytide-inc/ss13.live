// From code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6748, "/obj/item/weapon/circuitboard/machine/deep_fryer", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "circuit board (Deep Fryer)",
	build_path: rt.typePath("/obj/machinery/deepfryer"),
	origin_tech: "programming=1",
});

// /obj/item/weapon/circuitboard/machine/deep_fryer/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm:35)
rt.def("/obj/item/weapon/circuitboard/machine/deep_fryer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1]));
	return f.dot;
});

rt.type(10749, "/obj/machinery/deepfryer", "/obj/machinery", {
	frying: null,
	cook_time: 0,
	anchored: 1,
	container_type: 4096,
	name: "deep fryer",
	desc: "Deep fried <i>everything</i>.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "fryer_off",
	density: 1,
	use_power: 1,
	idle_power_usage: 5,
}, { global: { blacklisted_items: 752 } });

// /obj/machinery/deepfryer/proc/New  (code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm:38)  may sleep
rt.def("/obj/machinery/deepfryer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 50);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["nutriment", 25]);
	rt.setSv(f, "component_parts", rt.list());
	rt.modSrcVar(f, "component_parts", (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/deep_fryer"), [null])), add);
	rt.modSrcVar(f, "component_parts", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/micro_laser"), [null])), add);
	yield* g.srcCall(f, "RefreshParts");
	return f.dot;
}, true);

// /obj/machinery/deepfryer/proc/examine  (code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm:47)
rt.def("/obj/machinery/deepfryer/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "frying"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("You can make out ＀ in the oil.", [rt.sv(f, "frying")])]);
	return f.dot;
});

// /obj/machinery/deepfryer/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm:52)  may sleep
rt.def("/obj/machinery/deepfryer/proc/attackby", function* attackby(f: Frame) {
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("There's nothing to fry with in ＀!", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/deepfryholder")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='userdanger'>Your cooking skills are not up to the legendary Doublefry technique.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		} else {
			if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "fryer_off", "fryer_off", live(f.args[0]))))) {
				return live(f.dot);
			} else {
				if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("blacklisted_items")])))) {
					f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
				} else {
					if (!(truthy((yield* g.callName(f, live(f.args[1]), "drop_item", []))) && !truthy(rt.sv(f, "frying")))) return f.dot;
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
					rt.setSv(f, "frying", live(f.args[0]));
					yield* g.callName(f, rt.sv(f, "frying"), "forceMove", [live(f.src)]);
					rt.setSv(f, "icon_state", "fryer_on");
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/machinery/deepfryer/proc/process  (code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm:74)
rt.def("/obj/machinery/deepfryer/proc/process", function process(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "frying"))) return f.dot;
	rt.incSrcVar(f, "cook_time", 1, true);
	if (isEqual(rt.sv(f, "cook_time"), 30)) {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
		rt.callSrc(f, "visible_message", [fmt("＀ dings!", [live(f.src)])]);
	} else {
		if (!isEqual(rt.sv(f, "cook_time"), 60)) return f.dot;
		rt.callSrc(f, "visible_message", [fmt("＀ emits an acrid smell!", [live(f.src)])]);
	}
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/deepfryer/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm:88)  may sleep
rt.def("/obj/machinery/deepfryer/proc/attack_hand", function* attack_hand(f: Frame) {
	let S: Value = null, food: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [S, food, C, $0];
	if (truthy(rt.sv(f, "frying"))) {
		if (isEqual(rt.fv(f, "loc", rt.sv(f, "frying")), live(f.src))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You eject ＀ from ＀.</span>", [rt.sv(f, "frying"), live(f.src)])]);
			S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/deepfryholder"), [rt.getStep(f, live(f.src), 0)]));
			if (truthy((rt.istype(rt.sv(f, "frying"), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
				yield* g.callName(f, rt.gv(f, "reagents", (food = rt.sv(f, "frying"))), "trans_to", [live(S), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(food)))]);
			}
			rt.setFv(f, "icon", live(S), rt.fv(f, "icon", rt.sv(f, "frying")));
			rt.setFv(f, "overlays", live(S), rt.fv(f, "overlays", rt.sv(f, "frying")));
			rt.setFv(f, "icon_state", live(S), rt.fv(f, "icon_state", rt.sv(f, "frying")));
			rt.setFv(f, "desc", live(S), rt.fv(f, "desc", rt.sv(f, "frying")));
			rt.setFv(f, "w_class", live(S), rt.fv(f, "w_class", rt.sv(f, "frying")));
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(S), multiply(2, divide(rt.sv(f, "cook_time"), 15))]);
			$0 = rt.sv(f, "cook_time");
			if (rt.inRange($0, 0, 15)) {
				yield* g.callName(f, live(S), "add_atom_colour", ["#a66736", 4]);
				rt.setFv(f, "name", live(S), fmt("lightly-fried ＀", [rt.fv(f, "name", rt.sv(f, "frying"))]));
			} else if (rt.inRange($0, 16, 49)) {
				yield* g.callName(f, live(S), "add_atom_colour", ["#673f18", 4]);
				rt.setFv(f, "name", live(S), fmt("fried ＀", [rt.fv(f, "name", rt.sv(f, "frying"))]));
			} else if (rt.inRange($0, 50, 59)) {
				yield* g.callName(f, live(S), "add_atom_colour", ["#3f1704", 4]);
				rt.setFv(f, "name", live(S), fmt("deep-fried ＀", [rt.fv(f, "name", rt.sv(f, "frying"))]));
			} else if (rt.inRange($0, 60, 9.999999848243207e+30)) {
				yield* g.callName(f, live(S), "add_atom_colour", ["#211309", 4]);
				rt.setFv(f, "name", live(S), "the physical manifestation of the very concept of fried foods");
				rt.setFv(f, "desc", live(S), "A heavily fried...something.  Who can tell anymore?");
			}
			rt.setFv(f, "filling_color", live(S), rt.fv(f, "color", live(S)));
			if (truthy((rt.istype(rt.sv(f, "frying"), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "frying")]);
			} else {
				yield* g.callName(f, rt.sv(f, "frying"), "forceMove", [live(S)]);
			}
			rt.setSv(f, "icon_state", "fryer_off");
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(S)]);
			rt.setSv(f, "frying", null);
			rt.setSv(f, "cook_time", 0);
			return live(f.dot);
		}
	} else {
		if ((((truthy(rt.fv(f, "pulling", live(f.args[0]))) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living/carbon")) ? 1 : 0))) && truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))))) {
			if (rt.lt(rt.fv(f, "grab_state", live(f.args[0])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need a better grip to do that!</span>"]);
				return live(f.dot);
			}
			C = rt.fv(f, "pulling", live(f.args[0]));
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class = 'danger'>＀ dunks ＀'s face in ＀!</span>", [live(f.args[0]), live(C), live(f.src)])]);
			yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(C), 1]);
			yield* g.callName(f, live(C), "adjustFireLoss", [rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
			yield* g.callName(f, rt.sv(f, "reagents"), "remove_any", [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 2)]);
			yield* g.callName(f, live(C), "Knockdown", [60]);
			yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
