// From code/modules/hydroponics/seed_extractor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/seedify  (code/modules/hydroponics/seed_extractor.dm:3)  may sleep
rt.def("/proc/seedify", function* seedify(f: Frame, O: Value, t_max: Value, extractor: Value, user: Value) {
	let t_amount: Value = null, seedloc: Value = null, F: Value = null, t_prod: Value = null;
	f.vars = () => [O, t_max, extractor, user, t_amount, seedloc, F, t_prod];
	t_amount = 0;
	if (isEqual(live(t_max), -1)) {
		if (truthy(live(extractor))) {
			t_max = multiply((yield* g.call(f, P("/proc/rand"), null, [1, 4])), rt.fv(f, "seed_multiplier", live(extractor)));
		} else {
			t_max = (yield* g.call(f, P("/proc/rand"), null, [1, 4]));
		}
	}
	seedloc = rt.fv(f, "loc", live(O));
	if (truthy(live(extractor))) {
		seedloc = rt.fv(f, "loc", live(extractor));
	}
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "seed", (F = live(O))))) {
			if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "drop_item", []))))) {
				return live(f.dot);
			}
			while (rt.lt(live(t_amount), live(t_max))) {
				rt.setFv(f, "loc", (t_prod = (yield* g.callName(f, rt.fv(f, "seed", live(F)), "Copy", []))), live(seedloc));
				t_amount = rt.inc(live(t_amount), 1);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
			return 1;
		}
	} else {
		if (truthy((rt.istype(live(O), T("/obj/item/weapon/grown")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "seed", (F = live(O))))) {
				if ((truthy(live(user)) && !truthy((yield* g.callName(f, live(user), "drop_item", []))))) {
					return live(f.dot);
				}
				while (rt.lt(live(t_amount), live(t_max))) {
					rt.setFv(f, "loc", (t_prod = (yield* g.callName(f, rt.fv(f, "seed", live(F)), "Copy", []))), live(seedloc));
					t_amount = rt.inc(live(t_amount), 1);
				}
				yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
			}
			return 1;
		}
	}
	return 0;
}, true);

rt.type(10923, "/obj/machinery/seed_extractor", "/obj/machinery", {
	piles: null,
	max_seeds: 1000,
	seed_multiplier: 1,
	anchored: 1,
	name: "seed extractor",
	desc: "Extracts and bags seeds from produce.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "sextractor",
	density: 1,
});

// /obj/machinery/seed_extractor/proc/<init>  (code/modules/hydroponics/seed_extractor.dm:47)
rt.def("/obj/machinery/seed_extractor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "piles", rt.list());
	return f.dot;
});

// /obj/machinery/seed_extractor/proc/New  (code/modules/hydroponics/seed_extractor.dm:52)  may sleep
rt.def("/obj/machinery/seed_extractor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/seed_extractor"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6759, "/obj/item/weapon/circuitboard/machine/seed_extractor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Seed Extractor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/seed_extractor"),
	origin_tech: "programming=1",
});

// /obj/item/weapon/circuitboard/machine/seed_extractor/proc/<init>  (code/modules/hydroponics/seed_extractor.dm:60)
rt.def("/obj/item/weapon/circuitboard/machine/seed_extractor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	return f.dot;
});

// /obj/machinery/seed_extractor/proc/RefreshParts  (code/modules/hydroponics/seed_extractor.dm:65)
rt.def("/obj/machinery/seed_extractor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [B, M, $e];
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.setSv(f, "max_seeds", multiply(1000, rt.fv(f, "rating", live(B))));
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setSv(f, "seed_multiplier", rt.fv(f, "rating", live(M)));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/seed_extractor/proc/attackby  (code/modules/hydroponics/seed_extractor.dm:72)  may sleep
rt.def("/obj/machinery/seed_extractor/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, loaded: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [_P, loaded, G, $e];
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "sextractor_open", "sextractor", live(f.args[0]))))) {
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
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/plants")) ? 1 : 0))) {
		_P = live(f.args[0]);
		loaded = 0;
		G = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(_P)), T("/obj/item/seeds"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "max_seeds"))) {
				break;
			}
			loaded = rt.inc(live(loaded), 1);
			yield* g.srcCall(f, "add_seed", live(G));
		}
		rt.endFor(f, 0);
		if (truthy(live(loaded))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put the seeds from ％！ into ＀.</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>There are no seeds in ％！.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
		}
		return live(f.dot);
	} else {
		if (truthy((yield* g.call(f, P("/proc/seedify"), null, [live(f.args[0]), -1, live(f.src), live(f.args[1])])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You extract some seeds.</span>"]);
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/seeds")) ? 1 : 0))) {
				if (truthy((yield* g.srcCall(f, "add_seed", live(f.args[0]))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(f.args[0]), rt.fv(f, "name", live(f.src))])]);
					yield* g.srcCall(f, "updateUsrDialog");
				}
				return live(f.dot);
			} else {
				if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't extract any seeds from ％！!</span>", [rt.fv(f, "name", live(f.args[0]))])]);
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/seed_extractor/proc/attack_hand  (code/modules/hydroponics/seed_extractor.dm:135)  may sleep
rt.def("/obj/machinery/seed_extractor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/seed_extractor/proc/interact  (code/modules/hydroponics/seed_extractor.dm:142)  may sleep
rt.def("/obj/machinery/seed_extractor/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, O: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, O, popup, $e];
	if (truthy(rt.sv(f, "stat"))) {
		return 0;
	}
	dat = "<b>Stored seeds:</b><br>";
	if (isEqual(rt.len(f, rt.sv(f, "contents")), 0)) {
		dat = rt.modify(live(dat), "<font color='red'>No seeds</font>", add);
	} else {
		dat = rt.modify(live(dat), "<table cellpadding='3' style='text-align:center;'><tr><td>Name</td><td>Lifespan</td><td>Endurance</td><td>Maturation</td><td>Production</td><td>Yield</td><td>Potency</td><td>Stock</td></tr>", add);
		O = null;
		rt.forList(f, 0, rt.sv(f, "piles"), T("/datum/seed_pile"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			dat = rt.modify(live(dat), fmt("<tr><td>＀</td><td>＀</td><td>＀</td><td>＀</td>", [rt.fv(f, "name", live(O)), rt.fv(f, "lifespan", live(O)), rt.fv(f, "endurance", live(O)), rt.fv(f, "maturation", live(O))]), add);
			dat = rt.modify(live(dat), fmt("<td>＀</td><td>＀</td><td>＀</td><td>", [rt.fv(f, "production", live(O)), rt.fv(f, "yield", live(O)), rt.fv(f, "potency", live(O))]), add);
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;name=＀;li=＀;en=＀;ma=＀;pr=＀;yi=＀;pot=＀'>Vend</a> (＀ left)</td></tr>", [live(f.src), rt.fv(f, "name", live(O)), rt.fv(f, "lifespan", live(O)), rt.fv(f, "endurance", live(O)), rt.fv(f, "maturation", live(O)), rt.fv(f, "production", live(O)), rt.fv(f, "yield", live(O)), rt.fv(f, "potency", live(O)), rt.fv(f, "amount", live(O))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table>", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "seed_ext", rt.sv(f, "name"), 700, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/seed_extractor/proc/Topic  (code/modules/hydroponics/seed_extractor.dm:159)  may sleep
rt.def("/obj/machinery/seed_extractor/proc/Topic", function* Topic(f: Frame) {
	let N: Value = null, _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [N, _T, O, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	rt.setAt(live(f.args[1]), "li", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "li")])));
	rt.setAt(live(f.args[1]), "en", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "en")])));
	rt.setAt(live(f.args[1]), "ma", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "ma")])));
	rt.setAt(live(f.args[1]), "pr", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "pr")])));
	rt.setAt(live(f.args[1]), "yi", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "yi")])));
	rt.setAt(live(f.args[1]), "pot", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "pot")])));
	N = null;
	rt.forList(f, 0, rt.sv(f, "piles"), T("/datum/seed_pile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (((((((isEqual(rt.at(live(f.args[1]), "name"), rt.fv(f, "name", live(N))) && isEqual(rt.at(live(f.args[1]), "li"), rt.fv(f, "lifespan", live(N)))) && isEqual(rt.at(live(f.args[1]), "en"), rt.fv(f, "endurance", live(N)))) && isEqual(rt.at(live(f.args[1]), "ma"), rt.fv(f, "maturation", live(N)))) && isEqual(rt.at(live(f.args[1]), "pr"), rt.fv(f, "production", live(N)))) && isEqual(rt.at(live(f.args[1]), "yi"), rt.fv(f, "yield", live(N)))) && isEqual(rt.at(live(f.args[1]), "pot"), rt.fv(f, "potency", live(N))))) {
			if (rt.le(rt.fv(f, "amount", live(N)), 0)) {
				return live(f.dot);
			}
			rt.setFv(f, "amount", live(N), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "amount", live(N)), 1), 0])));
			if (rt.le(rt.fv(f, "amount", live(N)), 0)) {
				(rt.modSrcVar(f, "piles", live(N), subtract));
				yield* g.call(f, P("/proc/qdel"), null, [live(N)]);
			}
			break;
		}
	}
	rt.endFor(f, 0);
	_T = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (((((((isEqual(rt.gv(f, "plantname", (O = live(_T))), rt.at(live(f.args[1]), "name")) && isEqual(rt.fv(f, "lifespan", live(O)), rt.at(live(f.args[1]), "li"))) && isEqual(rt.fv(f, "endurance", live(O)), rt.at(live(f.args[1]), "en"))) && isEqual(rt.fv(f, "maturation", live(O)), rt.at(live(f.args[1]), "ma"))) && isEqual(rt.fv(f, "production", live(O)), rt.at(live(f.args[1]), "pr"))) && isEqual(rt.fv(f, "yield", live(O)), rt.at(live(f.args[1]), "yi"))) && isEqual(rt.fv(f, "potency", live(O)), rt.at(live(f.args[1]), "pot")))) {
			rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/seed_extractor/proc/add_seed  (code/modules/hydroponics/seed_extractor.dm:190)  may sleep
rt.def("/obj/machinery/seed_extractor/proc/add_seed", function* add_seed(f: Frame, O: Value) {
	let M: Value = null, S: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [O, M, S, N, $e];
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), 999)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＄！ is full.</span>", [live(f.src)])]);
		return 0;
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(O))])))) {
		if (!truthy((yield* g.callName(f, (M = rt.fv(f, "loc", live(O))), "drop_item", [])))) {
			return 0;
		}
	} else {
		if (truthy((rt.istype(rt.fv(f, "loc", live(O)), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			yield* g.callName(f, (S = rt.fv(f, "loc", live(O))), "remove_from_storage", [live(O), live(f.src)]);
		}
	}
	rt.setFv(f, "loc", live(O), live(f.src));
	f.dot = 1;
	N = null;
	rt.forList(f, 0, rt.sv(f, "piles"), T("/datum/seed_pile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (((((((isEqual(rt.fv(f, "plantname", live(O)), rt.fv(f, "name", live(N))) && isEqual(rt.fv(f, "lifespan", live(O)), rt.fv(f, "lifespan", live(N)))) && isEqual(rt.fv(f, "endurance", live(O)), rt.fv(f, "endurance", live(N)))) && isEqual(rt.fv(f, "maturation", live(O)), rt.fv(f, "maturation", live(N)))) && isEqual(rt.fv(f, "production", live(O)), rt.fv(f, "production", live(N)))) && isEqual(rt.fv(f, "yield", live(O)), rt.fv(f, "yield", live(N)))) && isEqual(rt.fv(f, "potency", live(O)), rt.fv(f, "potency", live(N))))) {
			rt.incField(f, live(N), "amount", 1, false);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "piles", (yield* g.new_(f, T("/datum/seed_pile"), [rt.fv(f, "plantname", live(O)), rt.fv(f, "lifespan", live(O)), rt.fv(f, "endurance", live(O)), rt.fv(f, "maturation", live(O)), rt.fv(f, "production", live(O)), rt.fv(f, "yield", live(O)), rt.fv(f, "potency", live(O))])), add);
	return live(f.dot);
}, true);
