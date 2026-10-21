// From code/modules/food_and_drinks/kitchen_machinery/microwave.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10897, "/obj/machinery/microwave", "/obj/machinery", {
	operating: 0,
	dirty: 0,
	broken: 0,
	max_n_of_items: 10,
	efficiency: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	name: "microwave oven",
	desc: "Cooks and boils stuff.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "mw",
	layer: 2.9,
	density: 1,
});

// /obj/machinery/microwave/proc/New  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:25)  may sleep
rt.def("/obj/machinery/microwave/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.srcCall(f, "create_reagents", 100);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/microwave"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(6750, "/obj/item/weapon/circuitboard/machine/microwave", "/obj/item/weapon/circuitboard/machine", {
	name: "Microwave (Machine Board)",
	build_path: rt.typePath("/obj/machinery/microwave"),
	origin_tech: "programming=2;magnets=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/microwave/proc/<init>  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:34)
rt.def("/obj/item/weapon/circuitboard/machine/microwave/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/stack/sheet/glass"), 1]));
	return f.dot;
});

// /obj/machinery/microwave/proc/RefreshParts  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:44)
rt.def("/obj/machinery/microwave/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, max_items: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [E, max_items, M, $e];
	E = null;
	max_items = 10;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		max_items = multiply(10, rt.fv(f, "rating", live(M)));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency", live(E));
	rt.setSv(f, "max_n_of_items", live(max_items));
	return f.dot;
});

// /obj/machinery/microwave/proc/attackby  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:58)  may sleep
rt.def("/obj/machinery/microwave/proc/attackby", function* attackby(f: Frame) {
	let clean_spray: Value = null, _P: Value = null, _T: Value = null, loaded: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [clean_spray, _P, _T, loaded, S, $e];
	if (truthy(rt.sv(f, "operating"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "broken")) && rt.lt(rt.sv(f, "dirty"), 100))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "mw-o", "mw", live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "broken", live(f.src)), 0)) {
		if ((isEqual(rt.fv(f, "broken", live(f.src)), 2) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to fix part of the microwave.", [live(f.args[1])]), "<span class='notice'>You start to fix part of the microwave...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ fixes part of the microwave.", [live(f.args[1])]), "<span class='notice'>You fix part of the microwave.</span>"]);
				rt.setFv(f, "broken", live(f.src), 1);
			}
		} else {
			if ((isEqual(rt.fv(f, "broken", live(f.src)), 1) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to fix part of the microwave.", [live(f.args[1])]), "<span class='notice'>You start to fix part of the microwave...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ fixes the microwave.", [live(f.args[1])]), "<span class='notice'>You fix the microwave.</span>"]);
					rt.setFv(f, "icon_state", live(f.src), "mw");
					rt.setFv(f, "broken", live(f.src), 0);
					rt.setFv(f, "dirty", live(f.src), 0);
					rt.setFv(f, "container_type", live(f.src), 4096);
					return 0;
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's broken!</span>"]);
				return 1;
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/spray")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, rt.gv(f, "reagents", (clean_spray = live(f.args[0]))), "has_reagent", ["cleaner", rt.fv(f, "amount_per_transfer_from_this", live(clean_spray))])))) {
				yield* g.callName(f, rt.fv(f, "reagents", live(clean_spray)), "remove_reagent", ["cleaner", rt.fv(f, "amount_per_transfer_from_this", live(clean_spray)), 1]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/spray3.ogg"), 50, 1, -6]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has cleaned the microwave.", [live(f.args[1])]), "<span class='notice'>You clean the microwave.</span>"]);
				rt.setFv(f, "dirty", live(f.src), 0);
				rt.setFv(f, "broken", live(f.src), 0);
				rt.setFv(f, "icon_state", live(f.src), "mw");
				rt.setFv(f, "container_type", live(f.src), 4096);
				yield* g.callName(f, live(f.src), "updateUsrDialog", []);
				return 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more space cleaner!<span>"]);
				return 1;
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/soap")) ? 1 : 0))) {
				_P = live(f.args[0]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to clean the microwave.", [live(f.args[1])]), "<span class='notice'>You start to clean the microwave...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, rt.fv(f, "cleanspeed", live(_P)), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has cleaned the microwave.", [live(f.args[1])]), "<span class='notice'>You clean the microwave.</span>"]);
					rt.setFv(f, "dirty", live(f.src), 0);
					rt.setFv(f, "broken", live(f.src), 0);
					rt.setFv(f, "icon_state", live(f.src), "mw");
					rt.setFv(f, "container_type", live(f.src), 4096);
				}
			} else {
				if (isEqual(rt.fv(f, "dirty", live(f.src)), 100)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's dirty!</span>"]);
					return 1;
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/tray")) ? 1 : 0))) {
						_T = live(f.args[0]);
						loaded = 0;
						S = null;
						rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj/item/weapon/reagent_containers/food/snacks"));
						while (($e = rt.next(f, 0)) !== undefined) {
							S = $e;
							if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_n_of_items"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is full, you can't put anything in!</span>", [live(f.src)])]);
								return 1;
							}
							yield* g.callName(f, live(_T), "remove_from_storage", [live(S), live(f.src)]);
							loaded = rt.inc(live(loaded), 1);
						}
						rt.endFor(f, 0);
						if (truthy(live(loaded))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ items into ＀.</span>", [live(loaded), live(f.src)])]);
						}
					} else {
						if (((rt.le(rt.fv(f, "w_class", live(f.args[0])), 3) && !truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage")) ? 1 : 0))) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
							if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_n_of_items"))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is full, you can't put anything in!</span>", [live(f.src)])]);
								return 1;
							} else {
								if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(f.args[0]), live(f.src)])]);
									return 0;
								}
								rt.setFv(f, "loc", live(f.args[0]), live(f.src));
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has added ％！ to ％！.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You add ％！ to ％！.</span>", [live(f.args[0]), live(f.src)])]);
							}
						} else {
							yield* g.callSuper(f, [], rt.Args.Same);
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/microwave/proc/attack_paw  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:171)  may sleep
rt.def("/obj/machinery/microwave/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/microwave/proc/attack_hand  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:177)  may sleep
rt.def("/obj/machinery/microwave/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/microwave/proc/interact  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:187)  may sleep
rt.def("/obj/machinery/microwave/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, items_counts: Value = null, O: Value = null, S: Value = null, N: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, items_counts, O, S, N, popup, $e];
	if ((truthy(rt.sv(f, "panel_open")) || !truthy(rt.sv(f, "anchored")))) {
		return live(f.dot);
	}
	dat = "<div class='statusDisplay'>";
	if (rt.gt(rt.sv(f, "broken"), 0)) {
		dat = rt.modify(live(dat), "ERROR: 09734014-A2379-D18746 --Bad memory<BR>Contact your operator or use command line to rebase memory ///git checkout {HEAD} -a commit pull --rebase push {*NEW HEAD*}</div>", add);
	} else {
		if (truthy(rt.sv(f, "operating"))) {
			dat = rt.modify(live(dat), "Microwaving in progress!<BR>Please wait...!</div>", add);
		} else {
			if (isEqual(rt.sv(f, "dirty"), 100)) {
				dat = rt.modify(live(dat), "ERROR: >> 0 --Response input zero<BR>Contact your operator of the device manifactor support.</div>", add);
			} else {
				items_counts = (yield* g.new_(f, T("/list"), []));
				O = null;
				rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
				while (($e = rt.next(f, 0)) !== undefined) {
					O = $e;
					if (truthy((rt.istype(live(O), T("/obj/item/stack")) ? 1 : 0))) {
						S = live(O);
						rt.modAt(live(items_counts), rt.fv(f, "name", live(O)), rt.fv(f, "amount", live(S)), add);
					} else {
						rt.incAt(live(items_counts), rt.fv(f, "name", live(O)), 1, true);
					}
				}
				rt.endFor(f, 0);
				O = null;
				rt.forList(f, 0, live(items_counts));
				while (($e = rt.next(f, 0)) !== undefined) {
					O = $e;
					N = rt.index(live(items_counts), live(O));
					dat = rt.modify(live(dat), fmt("＀: ＀<BR>", [(yield* g.call(f, P("/proc/capitalize"), null, [live(O)])), live(N)]), add);
				}
				rt.endFor(f, 0);
				if (isEqual(rt.len(f, live(items_counts)), 0)) {
					dat = rt.modify(live(dat), "The microwave is empty.</div>", add);
				} else {
					dat = fmt("<h3>Ingredients:</h3>＀</div>", [live(dat)]);
				}
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=cook'>Turn on</A>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=dispose'>Eject ingredients</A><BR>", [live(f.src)]), add);
			}
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "microwave", rt.sv(f, "name"), 300, 300]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/cook  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:225)  may sleep
rt.def("/obj/machinery/microwave/proc/cook", function* cook(f: Frame) {
	let metal: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [metal, O, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "start");
	if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [subtract(divide(5, rt.sv(f, "efficiency")), 5), multiply(rt.sv(f, "dirty"), 5)]))]))) {
		yield* g.srcCall(f, "muck_start");
		if (!truthy((yield* g.srcCall(f, "microwaving", 4)))) {
			yield* g.srcCall(f, "muck_finish");
			return live(f.dot);
		}
		yield* g.srcCall(f, "muck_finish");
		return live(f.dot);
	} else {
		if (((truthy((yield* g.srcCall(f, "has_extra_item"))) && truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "dirty"), 5), 100]))]))) && !truthy((yield* g.srcCall(f, "microwaving", 4))))) {
			yield* g.srcCall(f, "broke");
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "microwaving", 10)))) {
			yield* g.srcCall(f, "abort");
			return live(f.dot);
		}
		yield* g.srcCall(f, "stop");
		metal = 0;
		O = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			yield* g.callName(f, live(O), "microwave_act", [live(f.src)]);
			if (truthy(rt.index(rt.fv(f, "materials", live(O)), "$metal"))) {
				metal = rt.modify(live(metal), rt.index(rt.fv(f, "materials", live(O)), "$metal"), add);
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(metal))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>Sparks fly around ＀!", [live(f.src)]));
			if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [divide(live(metal), 2), 33]))]))) {
				yield* g.call(f, P("/proc/explosion"), null, [rt.sv(f, "loc"), 0, 1, 2]);
			}
			yield* g.srcCall(f, "broke");
			return live(f.dot);
		}
		yield* g.srcCall(f, "dropContents");
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/microwaving  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:264)  may sleep
rt.def("/obj/machinery/microwave/proc/microwaving", function* microwaving(f: Frame, seconds: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [seconds, i, $e];
	i = null;
	rt.forRange(f, 0, 1, live(seconds), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			return 0;
		}
		yield* g.srcCall(f, "use_power", 500);
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/max"), null, [subtract(12, multiply(2, rt.sv(f, "efficiency"))), 2]))]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/machinery/microwave/proc/has_extra_item  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:272)
rt.def("/obj/machinery/microwave/proc/has_extra_item", function has_extra_item(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((!truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food")) ? 1 : 0)) && !truthy((rt.istype(live(O), T("/obj/item/weapon/grown")) ? 1 : 0)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/machinery/microwave/proc/start  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:281)  may sleep
rt.def("/obj/machinery/microwave/proc/start", function* start(f: Frame) {
	yield* g.srcCall(f, "visible_message", "The microwave turns on.", "<span class='italics'>You hear a microwave humming.</span>");
	rt.setSv(f, "operating", 1);
	rt.setSv(f, "icon_state", "mw1");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/abort  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:288)  may sleep
rt.def("/obj/machinery/microwave/proc/abort", function* abort(f: Frame) {
	rt.setSv(f, "operating", 0);
	rt.setSv(f, "icon_state", "mw");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/stop  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:292)  may sleep
rt.def("/obj/machinery/microwave/proc/stop", function* stop(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
	yield* g.srcCall(f, "abort");
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/dispose  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:296)  may sleep
rt.def("/obj/machinery/microwave/proc/dispose", function* dispose(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You dispose of the microwave contents.</span>"]);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/muck_start  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:302)
rt.def("/obj/machinery/microwave/proc/muck_start", function muck_start(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	rt.setSv(f, "icon_state", "mwbloody1");
	return f.dot;
});

// /obj/machinery/microwave/proc/muck_finish  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:306)  may sleep
rt.def("/obj/machinery/microwave/proc/muck_finish", function* muck_finish(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
	yield* g.srcCall(f, "visible_message", "<span class='warning'>The microwave gets covered in muck!</span>");
	rt.setSv(f, "dirty", 100);
	rt.setSv(f, "icon_state", "mwbloody");
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "updateUsrDialog");
	S = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/badrecipe"), [live(f.src)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/broke  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:318)  may sleep
rt.def("/obj/machinery/microwave/proc/broke", function* broke(f: Frame) {
	let s: Value = null;
	f.vars = () => [s];
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [2, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	rt.setSv(f, "icon_state", "mwb");
	yield* g.srcCall(f, "visible_message", "<span class='warning'>The microwave breaks!</span>");
	rt.setSv(f, "broken", 2);
	rt.setSv(f, "flags", null);
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/microwave/proc/Topic  (code/modules/food_and_drinks/kitchen_machinery/microwave.dm:329)  may sleep
rt.def("/obj/machinery/microwave/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || truthy(rt.sv(f, "panel_open")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "operating"))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	$0 = rt.at(live(f.args[1]), "action");
	if ($0 === "cook") {
		yield* g.srcCall(f, "cook");
	} else if ($0 === "dispose") {
		yield* g.srcCall(f, "dispose");
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });
