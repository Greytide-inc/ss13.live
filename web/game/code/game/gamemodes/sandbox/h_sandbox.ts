// From code/game/gamemodes/sandbox/h_sandbox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhsboxspawn  (code/game/gamemodes/sandbox/h_sandbox.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalhsboxspawn", function InitGlobalhsboxspawn(f: Frame) {
	rt.setGl("hsboxspawn", 1);
	rt.modSrcVar(f, "gvars_datum_init_order", "hsboxspawn", add);
	return f.dot;
});

// /mob/proc/CanBuild  (code/game/gamemodes/sandbox/h_sandbox.dm:8)  may sleep
rt.def("/mob/proc/CanBuild", function* CanBuild(f: Frame) {
	rt.setSv(f, "sandbox", (yield* g.new_(f, T("/datum/hSB"), [])));
	rt.setFv(f, "owner", rt.sv(f, "sandbox"), rt.fv(f, "ckey", live(f.src)));
	if (truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.src))))) {
		rt.setFv(f, "admin", rt.sv(f, "sandbox"), 1);
	}
	rt.modSrcVar(f, "verbs", (yield* g.new_(f, P("/mob/proc/sandbox_panel"), [])), add);
	return f.dot;
}, true);

// /mob/proc/sandbox_panel  (code/game/gamemodes/sandbox/h_sandbox.dm:16)
rt.def("/mob/proc/sandbox_panel", function sandbox_panel(f: Frame) {
	if (!truthy(rt.sv(f, "sandbox"))) return f.dot;
	rt.callName(f, rt.sv(f, "sandbox"), "update", []);
	return f.dot;
}, false, { verb: { name: "Sandbox Panel" } });

rt.type(1434, "/datum/hSB", "/datum", {
	owner: null,
	admin: 0,
	clothinfo: null,
	reaginfo: null,
	objinfo: null,
	canisterinfo: null,
	hsbinfo: null,
}, { global: { spawn_forbidden: 960 } });

// /datum/hSB/proc/update  (code/game/gamemodes/sandbox/h_sandbox.dm:76)
rt.def("/datum/hSB/proc/update", function update(f: Frame) {
	let _T: Value = null, href: Value = null;
	let $e: any;
	f.vars = () => [_T, href, $e];
	if (!truthy(rt.sv(f, "hsbinfo"))) {
		rt.setSv(f, "hsbinfo", "<center><b>Sandbox Panel</b></center><hr>");
		if (truthy(rt.sv(f, "admin"))) {
			rt.modSrcVar(f, "hsbinfo", "<b>Administration</b><br>", add);
			rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?src=＃;hsb=hsbtobj'>Toggle Object Spawning</a><br>", [live(f.src)]), add);
			rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?src=＃;hsb=hsbtac'>Toggle Item Spawn Panel Auto-close</a><br>", [live(f.src)]), add);
			rt.modSrcVar(f, "hsbinfo", "<b>Canister Spawning</b><br>", add);
			rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn Plasma Canister</a><br>", [live(f.src), T("/obj/machinery/portable_atmospherics/canister/toxins")]), add);
			rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn CO2 Canister</a><br>", [live(f.src), T("/obj/machinery/portable_atmospherics/canister/carbon_dioxide")]), add);
			rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn Nitrogen Canister</a><br>", [live(f.src), T("/obj/machinery/portable_atmospherics/canister/nitrogen")]), add);
			rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn N2O Canister</a><hr>", [live(f.src), T("/obj/machinery/portable_atmospherics/canister/nitrous_oxide")]), add);
		} else {
			rt.modSrcVar(f, "hsbinfo", "<i>Some item spawning may be disabled by the administrators.</i><br>", add);
			rt.modSrcVar(f, "hsbinfo", "<i>Only administrators may spawn dangerous canisters.</i><br>", add);
		}
		_T = null;
		rt.forList(f, 0, rt.gl("hrefs"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy((href = rt.index(rt.gl("hrefs"), live(_T))))) {
				rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?＃;hsb=＀'>＀</a><br>", [live(f.src), rt.index(rt.gl("hrefs"), live(_T)), live(_T)]), add);
			} else {
				rt.modSrcVar(f, "hsbinfo", fmt("<br><b>＀</b><br>", [live(_T)]), add);
			}
		}
		rt.endFor(f, 0);
		rt.modSrcVar(f, "hsbinfo", "<hr>", add);
		rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?＃;hsb=hsbcloth'>Spawn Clothing...</a><br>", [live(f.src)]), add);
		rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?＃;hsb=hsbreag'>Spawn Reagent Container...</a><br>", [live(f.src)]), add);
		rt.modSrcVar(f, "hsbinfo", fmt("- <a href='?＃;hsb=hsbobj'>Spawn Other Item...</a><br><br>", [live(f.src)]), add);
	}
	rt.op(f, "Browse", [], [live(f.usr), rt.sv(f, "hsbinfo"), "window=hsbpanel"], false);
	return f.dot;
});

// /datum/hSB/proc/Topic  (code/game/gamemodes/sandbox/h_sandbox.dm:104)  may sleep
rt.def("/datum/hSB/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _P: Value = null, hsb: Value = null, ID: Value = null, all_items: Value = null, typekey: Value = null, O: Value = null, typepath: Value = null;
	let $0: any, $e: any;
	f.vars = () => [href, href_list, _P, hsb, ID, all_items, typekey, O, typepath, $0, $e];
	if (((!truthy(live(f.usr)) || !truthy(live(f.src))) || !isEqual(rt.fv(f, "owner", live(f.src)), rt.fv(f, "ckey", live(f.usr))))) {
		if (truthy(live(f.usr))) {
			rt.op(f, "Browse", [], [live(f.usr), null, "window=sandbox"], false);
		}
		return live(f.dot);
	}
	if (!truthy(rt.at(live(href_list), "hsb"))) return f.dot;
	$0 = rt.at(live(href_list), "hsb");
	if ($0 === "hsbtobj") {
		if (!truthy(rt.sv(f, "admin"))) {
			return live(f.dot);
		}
		if (truthy(rt.gl("hsboxspawn"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>Sandbox:</span> <b>＀ has disabled object spawning!</b>", [rt.fv(f, "key", live(f.usr))])]);
			rt.setGl("hsboxspawn", 0);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldnotice'>Sandbox:</span> <b>＀ has enabled object spawning!</b>", [rt.fv(f, "key", live(f.usr))])]);
			rt.setGl("hsboxspawn", 1);
			return live(f.dot);
		}
	} else if ($0 === "hsbtac") {
		if (!truthy(rt.sv(f, "admin"))) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "sandbox_autoclose", rt.gl("config")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldnotice'>Sandbox:</span> <b> ＀ has removed the object spawn limiter.</b>", [rt.fv(f, "key", live(f.usr))])]);
			rt.setFv(f, "sandbox_autoclose", rt.gl("config"), 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='danger'>Sandbox:</span> <b> ＀ has added a limiter to object spawning.  The window will now auto-close after use.</b>", [rt.fv(f, "key", live(f.usr))])]);
			rt.setFv(f, "sandbox_autoclose", rt.gl("config"), 1);
		}
		return live(f.dot);
	} else if ($0 === "hsbsuit") {
		if (!truthy((rt.istype((_P = live(f.usr)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "wear_suit", live(_P)))) {
			rt.setFv(f, "loc", rt.fv(f, "wear_suit", live(_P)), rt.fv(f, "loc", live(_P)));
			rt.setFv(f, "layer", rt.fv(f, "wear_suit", live(_P)), rt.initial(f, rt.fv(f, "wear_suit", live(_P)), "layer"));
			rt.setFv(f, "plane", rt.fv(f, "wear_suit", live(_P)), rt.initial(f, rt.fv(f, "wear_suit", live(_P)), "plane"));
			rt.setFv(f, "wear_suit", live(_P), null);
		}
		rt.setFv(f, "wear_suit", live(_P), (yield* g.new_(f, T("/obj/item/clothing/suit/space"), [live(_P)])));
		rt.setFv(f, "layer", rt.fv(f, "wear_suit", live(_P)), 20);
		rt.setFv(f, "plane", rt.fv(f, "wear_suit", live(_P)), 20);
		yield* g.callName(f, live(_P), "update_inv_wear_suit", []);
		if (truthy(rt.fv(f, "head", live(_P)))) {
			rt.setFv(f, "loc", rt.fv(f, "head", live(_P)), rt.fv(f, "loc", live(_P)));
			rt.setFv(f, "layer", rt.fv(f, "head", live(_P)), rt.initial(f, rt.fv(f, "head", live(_P)), "layer"));
			rt.setFv(f, "plane", rt.fv(f, "head", live(_P)), rt.initial(f, rt.fv(f, "head", live(_P)), "plane"));
			rt.setFv(f, "head", live(_P), null);
		}
		rt.setFv(f, "head", live(_P), (yield* g.new_(f, T("/obj/item/clothing/head/helmet/space"), [live(_P)])));
		rt.setFv(f, "layer", rt.fv(f, "head", live(_P)), 20);
		rt.setFv(f, "plane", rt.fv(f, "head", live(_P)), 20);
		yield* g.callName(f, live(_P), "update_inv_head", []);
		if (truthy(rt.fv(f, "wear_mask", live(_P)))) {
			rt.setFv(f, "loc", rt.fv(f, "wear_mask", live(_P)), rt.fv(f, "loc", live(_P)));
			rt.setFv(f, "layer", rt.fv(f, "wear_mask", live(_P)), rt.initial(f, rt.fv(f, "wear_mask", live(_P)), "layer"));
			rt.setFv(f, "plane", rt.fv(f, "wear_mask", live(_P)), rt.initial(f, rt.fv(f, "wear_mask", live(_P)), "plane"));
			rt.setFv(f, "wear_mask", live(_P), null);
		}
		rt.setFv(f, "wear_mask", live(_P), (yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(_P)])));
		rt.setFv(f, "layer", rt.fv(f, "wear_mask", live(_P)), 20);
		rt.setFv(f, "plane", rt.fv(f, "wear_mask", live(_P)), 20);
		yield* g.callName(f, live(_P), "update_inv_wear_mask", []);
		if (truthy(rt.fv(f, "back", live(_P)))) {
			rt.setFv(f, "loc", rt.fv(f, "back", live(_P)), rt.fv(f, "loc", live(_P)));
			rt.setFv(f, "layer", rt.fv(f, "back", live(_P)), rt.initial(f, rt.fv(f, "back", live(_P)), "layer"));
			rt.setFv(f, "plane", rt.fv(f, "back", live(_P)), rt.initial(f, rt.fv(f, "back", live(_P)), "plane"));
			rt.setFv(f, "back", live(_P), null);
		}
		rt.setFv(f, "back", live(_P), (yield* g.new_(f, T("/obj/item/weapon/tank/jetpack/oxygen"), [live(_P)])));
		rt.setFv(f, "layer", rt.fv(f, "back", live(_P)), 20);
		rt.setFv(f, "plane", rt.fv(f, "back", live(_P)), 20);
		yield* g.callName(f, live(_P), "update_inv_back", []);
		rt.setFv(f, "internal", live(_P), rt.fv(f, "back", live(_P)));
		yield* g.callName(f, live(_P), "update_internals_hud_icon", [1]);
	} else if ($0 === "hsbscrubber") {
		yield* g.callName(f, (hsb = (yield* g.newOv(f, T("/obj/machinery/portable_atmospherics/scrubber"), "{\"volume_rate\":5066.25,\"on\":1}", [rt.fv(f, "loc", live(f.usr))]))), "update_icon", []);
	} else if ($0 === "hsbrglass") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/rglass"), "{\"amount\":50}", [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbmetal") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/metal"), "{\"amount\":50}", [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbplasteel") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/plasteel"), "{\"amount\":50}", [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbglass") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/glass"), "{\"amount\":50}", [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbwood") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/mineral/wood"), "{\"amount\":50}", [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbaaid") {
		rt.setFv(f, "registered_name", (ID = (yield* g.new_(f, T("/obj/item/weapon/card/id/gold"), [rt.fv(f, "loc", live(f.usr))]))), rt.fv(f, "real_name", live(f.usr)));
		rt.setFv(f, "assignment", live(ID), "Sandbox");
		rt.setFv(f, "access", live(ID), (yield* g.call(f, P("/proc/get_all_accesses"), null, [])));
		yield* g.callName(f, live(ID), "update_label", []);
	} else if ($0 === "hsbrcd") {
		if (!truthy(rt.gl("hsboxspawn"))) {
			return live(f.dot);
		}
		yield* g.new_(f, T("/obj/item/weapon/construction/rcd/combat"), [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbairlock") {
		yield* g.new_(f, T("/datum/airlock_maker"), [rt.fv(f, "loc", live(f.usr))]);
	} else if ($0 === "hsbcloth") {
		if (!truthy(rt.gl("hsboxspawn"))) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "clothinfo"))) {
			rt.setSv(f, "clothinfo", fmt("<b>Clothing</b> <a href='?＃;hsb=hsbreag'>(Reagent Containers)</a> <a href='?＃;hsb=hsbobj'>(Other Items)</a><hr><br>", [live(f.src), live(f.src)]));
			all_items = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing")])), T("/obj/item/clothing"));
			typekey = null;
			rt.forList(f, 0, rt.gl("spawn_forbidden"));
			while (($e = rt.next(f, 0)) !== undefined) {
				typekey = $e;
				(all_items = rt.modify(live(all_items), (yield* g.call(f, P("/proc/typesof"), null, [live(typekey)])), subtract));
			}
			rt.endFor(f, 0);
			O = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/reverseRange"), null, [live(all_items)])));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				rt.modSrcVar(f, "clothinfo", fmt("<a href='?src=＃;hsb=hsb_safespawn&path=＀'>＀</a><br>", [live(f.src), live(O), live(O)]), add);
			}
			rt.endFor(f, 0);
		}
		rt.op(f, "Browse", [], [live(f.usr), rt.sv(f, "clothinfo"), "window=sandbox"], false);
	} else if ($0 === "hsbreag") {
		if (!truthy(rt.gl("hsboxspawn"))) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "reaginfo"))) {
			rt.setSv(f, "reaginfo", fmt("<b>Reagent Containers</b> <a href='?＃;hsb=hsbcloth'>(Clothing)</a> <a href='?＃;hsb=hsbobj'>(Other Items)</a><hr><br>", [live(f.src), live(f.src)]));
			all_items = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers")])), T("/obj/item/weapon/reagent_containers"));
			typekey = null;
			rt.forList(f, 0, rt.gl("spawn_forbidden"));
			while (($e = rt.next(f, 0)) !== undefined) {
				typekey = $e;
				(all_items = rt.modify(live(all_items), (yield* g.call(f, P("/proc/typesof"), null, [live(typekey)])), subtract));
			}
			rt.endFor(f, 0);
			O = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/reverseRange"), null, [live(all_items)])));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				rt.modSrcVar(f, "reaginfo", fmt("<a href='?src=＃;hsb=hsb_safespawn&path=＀'>＀</a><br>", [live(f.src), live(O), live(O)]), add);
			}
			rt.endFor(f, 0);
		}
		rt.op(f, "Browse", [], [live(f.usr), rt.sv(f, "reaginfo"), "window=sandbox"], false);
	} else if ($0 === "hsbobj") {
		if (!truthy(rt.gl("hsboxspawn"))) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "objinfo"))) {
			rt.setSv(f, "objinfo", fmt("<b>Other Items</b> <a href='?＃;hsb=hsbcloth'>(Clothing)</a> <a href='?＃;hsb=hsbreag'>(Reagent Containers)</a><hr><br>", [live(f.src), live(f.src)]));
			all_items = subtract(subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item")])), T("/obj/item")), (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing")]))), (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers")])));
			typekey = null;
			rt.forList(f, 0, rt.gl("spawn_forbidden"));
			while (($e = rt.next(f, 0)) !== undefined) {
				typekey = $e;
				(all_items = rt.modify(live(all_items), (yield* g.call(f, P("/proc/typesof"), null, [live(typekey)])), subtract));
			}
			rt.endFor(f, 0);
			O = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/reverseRange"), null, [live(all_items)])));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				rt.modSrcVar(f, "objinfo", fmt("<a href='?src=＃;hsb=hsb_safespawn&path=＀'>＀</a><br>", [live(f.src), live(O), live(O)]), add);
			}
			rt.endFor(f, 0);
		}
		rt.op(f, "Browse", [], [live(f.usr), rt.sv(f, "objinfo"), "window=sandbox"], false);
	} else if ($0 === "hsb_safespawn") {
		if (!truthy(rt.gl("hsboxspawn"))) {
			rt.op(f, "Browse", [], [live(f.usr), null, "window=sandbox"], false);
			return live(f.dot);
		}
		if (!truthy((typepath = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(href_list), "path")]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Bad path: \"＀\"", [rt.at(live(href_list), "path")])]);
			return live(f.dot);
		}
		yield* g.new_(f, live(typepath), [rt.fv(f, "loc", live(f.usr))]);
		if (truthy(rt.fv(f, "sandbox_autoclose", rt.gl("config")))) {
			rt.op(f, "Browse", [], [live(f.usr), null, "window=sandbox"], false);
		}
	} else if ($0 === "hsbspawn") {
		if (!truthy((typepath = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(href_list), "path")]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Bad path: \"＀\"", [rt.at(live(href_list), "path")])]);
			return live(f.dot);
		}
		yield* g.new_(f, live(typepath), [rt.fv(f, "loc", live(f.usr))]);
		if (!truthy(rt.fv(f, "sandbox_autoclose", rt.gl("config")))) return f.dot;
		rt.op(f, "Browse", [], [live(f.usr), null, "window=sandbox"], false);
	}
	return f.dot;
}, true);
