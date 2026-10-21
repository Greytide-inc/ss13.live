// From code/game/machinery/limbgrower.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10803, "/obj/machinery/limbgrower", "/obj/machinery", {
	operating: 0,
	disabled: 0,
	busy: 0,
	prod_coeff: 1,
	being_built: null,
	files: null,
	selected_category: null,
	screen: 1,
	emag: 0,
	categories: null,
	container_type: 4096,
	anchored: 1,
	name: "limb grower",
	desc: "It grows new limbs using Synthflesh.",
	icon: rt.rsc("icons/obj/machines/limbgrower.dmi"),
	icon_state: "limbgrower_idleoff",
	density: 1,
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 100,
});

// /obj/machinery/limbgrower/proc/New  (code/game/machinery/limbgrower.dm:38)  may sleep
rt.def("/obj/machinery/limbgrower/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 0);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/limbgrower"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research/limbgrower"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(6724, "/obj/item/weapon/circuitboard/machine/limbgrower", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Limb Grower (Machine Board)",
	build_path: rt.typePath("/obj/machinery/limbgrower"),
	origin_tech: "programming=2;biotech=2",
});

// /obj/item/weapon/circuitboard/machine/limbgrower/proc/<init>  (code/game/machinery/limbgrower.dm:48)
rt.def("/obj/item/weapon/circuitboard/machine/limbgrower/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/reagent_containers/glass/beaker"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/limbgrower/proc/interact  (code/game/machinery/limbgrower.dm:54)  may sleep
rt.def("/obj/machinery/limbgrower/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any;
	f.vars = () => [user, dat, popup, $0];
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		return live(f.dot);
	}
	dat = (yield* g.srcCall(f, "main_win", live(user)));
	$0 = rt.sv(f, "screen");
	if ($0 === 1) {
		dat = (yield* g.srcCall(f, "main_win", live(user)));
	} else if ($0 === 2) {
		dat = (yield* g.srcCall(f, "category_win", live(user), rt.sv(f, "selected_category")));
	} else if ($0 === 3) {
		dat = (yield* g.srcCall(f, "chemical_win", live(user)));
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "Limb Grower", rt.sv(f, "name"), 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/limbgrower/proc/on_deconstruction  (code/game/machinery/limbgrower.dm:72)  may sleep
rt.def("/obj/machinery/limbgrower/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/reagent_containers/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(G), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(G)))]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/limbgrower/proc/attackby  (code/game/machinery/limbgrower.dm:78)  may sleep
rt.def("/obj/machinery/limbgrower/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class=\"alert\">The Limb Grower is busy. Please wait for completion of previous operation.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "limbgrower_panelopen", "limbgrower_idleoff", live(f.args[0]))))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "panel_open")) && truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0])))))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/limbgrower/proc/Topic  (code/game/machinery/limbgrower.dm:95)  may sleep
rt.def("/obj/machinery/limbgrower/proc/Topic", function* Topic(f: Frame) {
	let synth_cost: Value = null, power: Value = null;
	f.vars = () => [synth_cost, power];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "busy"))) {
		if (truthy(rt.at(live(f.args[1]), "menu"))) {
			rt.setSv(f, "screen", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "menu")])));
		}
		if (truthy((rt.isIn(f, rt.at(live(f.args[1]), "category"), rt.sv(f, "categories")) ? 1 : 0))) { // tg 0fa8d14621: only real categories, the value is shown to everyone who looks
			rt.setSv(f, "selected_category", rt.at(live(f.args[1]), "category"));
		}
		if (truthy(rt.at(live(f.args[1]), "disposeI"))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "del_reagent", [rt.at(live(f.args[1]), "disposeI")]);
		}
		if (truthy(rt.at(live(f.args[1]), "make"))) {
			rt.setSv(f, "being_built", (yield* g.callName(f, rt.sv(f, "files"), "FindDesignByID", [rt.at(live(f.args[1]), "make")])));
			if (!truthy(rt.sv(f, "being_built"))) {
				return live(f.dot);
			}
			synth_cost = multiply(rt.index(rt.fv(f, "reagents_list", rt.sv(f, "being_built")), "synthflesh"), rt.sv(f, "prod_coeff"));
			power = (yield* g.call(f, P("/proc/max"), null, [2000, divide(live(synth_cost), 5)]));
			if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["synthflesh", multiply(rt.index(rt.fv(f, "reagents_list", rt.sv(f, "being_built")), "synthflesh"), rt.sv(f, "prod_coeff"))])))) {
				rt.setSv(f, "busy", 1);
				yield* g.srcCall(f, "use_power", live(power));
				yield* g.call(f, P("/proc/flick"), null, ["limbgrower_fill", live(f.src)]);
				rt.setSv(f, "icon_state", "limbgrower_idleon");
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/limbgrower/proc/build_item")])), multiply(32, rt.sv(f, "prod_coeff"))]);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class=\"alert\">The limb grower is busy. Please wait for completion of previous operation.</span>"]);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/limbgrower/proc/build_item  (code/game/machinery/limbgrower.dm:133)  may sleep
rt.def("/obj/machinery/limbgrower/proc/build_item", function* build_item(f: Frame) {
	let buildpath: Value = null;
	f.vars = () => [buildpath];
	if (truthy((yield* g.callName(f, rt.sv(f, "reagents"), "has_reagent", ["synthflesh", multiply(rt.index(rt.fv(f, "reagents_list", rt.sv(f, "being_built")), "synthflesh"), rt.sv(f, "prod_coeff"))])))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "remove_reagent", ["synthflesh", multiply(rt.index(rt.fv(f, "reagents_list", rt.sv(f, "being_built")), "synthflesh"), rt.sv(f, "prod_coeff"))]);
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [(buildpath = rt.fv(f, "build_path", rt.sv(f, "being_built"))), T("/obj/item/bodypart")])))) {
			yield* g.srcCall(f, "build_limb", live(buildpath));
		} else {
			yield* g.new_(f, live(buildpath), [rt.sv(f, "loc")]);
		}
	} else {
		yield* g.callName(f, live(f.src), "visible_message", ["<span class=\"error\"> Something went very wrong and there isnt enough synthflesh anymore!</span>"]);
	}
	rt.setSv(f, "busy", 0);
	yield* g.call(f, P("/proc/flick"), null, ["limbgrower_unfill", live(f.src)]);
	rt.setSv(f, "icon_state", "limbgrower_idleoff");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/limbgrower/proc/build_limb  (code/game/machinery/limbgrower.dm:151)  may sleep
rt.def("/obj/machinery/limbgrower/proc/build_limb", function* build_limb(f: Frame, buildpath: Value) {
	let limb: Value = null;
	f.vars = () => [buildpath, limb];
	limb = null;
	limb = (yield* g.new_(f, live(buildpath), [rt.sv(f, "loc")]));
	if ((isEqual(rt.sv(f, "selected_category"), "human") || isEqual(rt.sv(f, "selected_category"), "lizard"))) {
		rt.setFv(f, "icon", live(limb), rt.rsc("icons/mob/human_parts_greyscale.dmi"));
	} else {
		rt.setFv(f, "icon", live(limb), rt.rsc("icons/mob/human_parts.dmi"));
	}
	rt.setFv(f, "icon_state", live(limb), fmt("＀_＀", [rt.sv(f, "selected_category"), rt.fv(f, "body_zone", live(limb))]));
	rt.setFv(f, "name", live(limb), fmt("Synthetic ＀ ＀", [rt.sv(f, "selected_category"), (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "body_zone", live(limb))]))]));
	rt.setFv(f, "desc", live(limb), fmt("A synthetic ＀ limb that will morph on its first use in surgery. This one is for the ＀", [rt.sv(f, "selected_category"), (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "body_zone", live(limb))]))]));
	rt.setFv(f, "species_id", live(limb), rt.sv(f, "selected_category"));
	rt.setFv(f, "should_draw_greyscale", live(limb), 1);
	yield* g.callName(f, live(limb), "update_icon_dropped", []);
	return f.dot;
}, true);

// /obj/machinery/limbgrower/proc/RefreshParts  (code/game/machinery/limbgrower.dm:165)  may sleep
rt.def("/obj/machinery/limbgrower/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let G: Value = null, _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [G, _T, M, $e];
	rt.setFv(f, "maximum_volume", rt.sv(f, "reagents"), 0);
	G = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/reagent_containers/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.modField(f, rt.sv(f, "reagents"), "maximum_volume", rt.fv(f, "volume", live(G)), add);
		yield* g.callName(f, rt.fv(f, "reagents", live(G)), "trans_to", [live(f.src), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G)))]);
	}
	rt.endFor(f, 0);
	_T = 1.2000000476837158;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(_T = rt.modify(live(_T), multiply(rt.fv(f, "rating", live(M)), 0.20000000298023224), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "prod_coeff", (yield* g.call(f, P("/proc/min"), null, [1, (yield* g.call(f, P("/proc/max"), null, [0, live(_T)]))])));
	return f.dot;
}, true);

// /obj/machinery/limbgrower/proc/main_win  (code/game/machinery/limbgrower.dm:175)
rt.def("/obj/machinery/limbgrower/proc/main_win", function main_win(f: Frame, user: Value) {
	let dat: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [dat, C, $e];
	dat = "<div class='statusDisplay'><h3>Limb Grower Menu:</h3><br>";
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=＀'>Chemical Storage</A>", [live(f.src), 3]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "materials_printout", []), add);
	dat = rt.modify(live(dat), "<table style='width:100%' align='center'><tr>", add);
	C = null;
	rt.forList(f, 0, rt.sv(f, "categories"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if ((isEqual(live(C), "special") && !truthy(rt.sv(f, "emag")))) {
			continue;
		}
		dat = rt.modify(live(dat), fmt("<td><A href='?src=＃;category=＀;menu=＀'>＀</A></td>", [live(f.src), live(C), 2, live(C)]), add);
		dat = rt.modify(live(dat), "</tr><tr>", add);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</tr></table></div>", add));
});

// /obj/machinery/limbgrower/proc/category_win  (code/game/machinery/limbgrower.dm:192)
rt.def("/obj/machinery/limbgrower/proc/category_win", function category_win(f: Frame, user: Value, selected_category: Value) {
	let dat: Value = null, v: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [dat, v, D, $e];
	dat = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [live(f.src), 1]);
	dat = rt.modify(live(dat), fmt("<div class='statusDisplay'><h3>Browsing ＀:</h3><br>", [live(selected_category)]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "materials_printout", []), add);
	v = null;
	rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
		if (!truthy((rt.isIn(f, live(selected_category), rt.fv(f, "category", live(D))) ? 1 : 0))) {
			continue;
		}
		if ((truthy(rt.sv(f, "disabled")) || !truthy(rt.callSrc(f, "can_build", [live(D)])))) {
			dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>", [rt.fv(f, "name", live(D))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;make=＀;multiplier=1'>＀</a>", [live(f.src), rt.fv(f, "id", live(D)), rt.fv(f, "name", live(D))]), add);
		}
		dat = rt.modify(live(dat), fmt("＀<br>", [rt.callSrc(f, "get_design_cost", [live(D)])]), add);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</div>", add));
});

// /obj/machinery/limbgrower/proc/chemical_win  (code/game/machinery/limbgrower.dm:211)
rt.def("/obj/machinery/limbgrower/proc/chemical_win", function chemical_win(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [dat, R, $e];
	dat = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [live(f.src), 1]);
	dat = rt.modify(live(dat), "<div class='statusDisplay'><h3>Browsing Chemical Storage:</h3><br>", add);
	dat = rt.modify(live(dat), rt.callSrc(f, "materials_printout", []), add);
	R = null;
	rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		dat = rt.modify(live(dat), fmt("＀: ＀", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;disposeI=＀'>Purge</A><BR>", [live(f.src), rt.fv(f, "id", live(R))]), add);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</div>", add));
});

// /obj/machinery/limbgrower/proc/materials_printout  (code/game/machinery/limbgrower.dm:223)
rt.def("/obj/machinery/limbgrower/proc/materials_printout", function materials_printout(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = fmt("<b>Total amount:></b> ＀ / ＀ cm<sup>3</sup><br>", [rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.fv(f, "maximum_volume", rt.sv(f, "reagents"))]));
});

// /obj/machinery/limbgrower/proc/can_build  (code/game/machinery/limbgrower.dm:227)
rt.def("/obj/machinery/limbgrower/proc/can_build", function can_build(f: Frame, D: Value) {
	return rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["synthflesh", multiply(rt.index(rt.fv(f, "reagents_list", live(D)), "synthflesh"), rt.sv(f, "prod_coeff"))]);
});

// /obj/machinery/limbgrower/proc/get_design_cost  (code/game/machinery/limbgrower.dm:231)
rt.def("/obj/machinery/limbgrower/proc/get_design_cost", function get_design_cost(f: Frame, D: Value) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = null;
	if (truthy(rt.index(rt.fv(f, "reagents_list", live(D)), "synthflesh"))) {
		dat = rt.modify(live(dat), fmt("＀ Synthetic flesh ", [multiply(rt.index(rt.fv(f, "reagents_list", live(D)), "synthflesh"), rt.sv(f, "prod_coeff"))]), add);
	}
	return live(dat);
});

// /obj/machinery/limbgrower/proc/emag_act  (code/game/machinery/limbgrower.dm:236)
rt.def("/obj/machinery/limbgrower/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	if (isEqual(rt.sv(f, "emag"), 1)) {
		return live(f.dot);
	}
	D = null;
	rt.forList(f, 0, rt.fv(f, "possible_designs", rt.sv(f, "files")), T("/datum/design"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if ((truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 64)) && truthy((rt.isIn(f, "special", rt.fv(f, "category", live(D))) ? 1 : 0)))) {
			rt.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(D)]);
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "A warning flashes onto the screen, stating that safety overrides have been deactivated"]);
	rt.setSv(f, "emag", 1);
	return f.dot;
});
