// From code/game/objects/items/crayons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9662, "/obj/item/toy/crayon", "/obj/item/toy", {
	icon_capped: null,
	icon_uncapped: null,
	use_overlays: 0,
	paint_color: "#FF0000",
	drawtype: null,
	text_buffer: "",
	graffiti: null,
	letters: null,
	numerals: null,
	oriented: null,
	runes: null,
	randoms: null,
	graffiti_large_h: null,
	all_drawables: null,
	paint_mode: 1,
	charges: 30,
	charges_left: null,
	volume_multiplier: 1,
	actually_paints: 1,
	instant: 0,
	self_contained: 1,
	validSurfaces: null,
	gang: 0,
	edible: 1,
	reagent_contents: null,
	can_change_colour: 0,
	has_cap: 0,
	is_capped: 0,
	pre_noise: 0,
	post_noise: 0,
	item_color: "red",
	w_class: 1,
	attack_verb: null,
	name: "crayon",
	desc: "A colourful crayon. Looks tasty. Mmmm...",
	icon: rt.rsc("icons/obj/crayons.dmi"),
	icon_state: "crayonred",
});

// /obj/item/toy/crayon/proc/<init>  (code/game/objects/items/crayons.dm:56)
rt.def("/obj/item/toy/crayon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "coloured"));
	rt.setSv(f, "graffiti", rt.list("amyjon", "face", "matt", "revolution", "engie", "guy", "end", "dwarf", "uboa", "body", "cyka", "arrow", "star", "poseur tag"));
	rt.setSv(f, "letters", rt.list("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"));
	rt.setSv(f, "numerals", rt.list("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"));
	rt.setSv(f, "oriented", rt.list("arrow", "body"));
	rt.setSv(f, "runes", rt.list("rune1", "rune2", "rune3", "rune4", "rune5", "rune6"));
	rt.setSv(f, "randoms", rt.list("Random Anything", "Random Rune", "Random Oriented", "Random Number", "Random Graffiti", "Random Letter"));
	rt.setSv(f, "graffiti_large_h", rt.list("yiffhell", "secborg", "paint"));
	$0 = $0;
	rt.setSv(f, "validSurfaces", rt.list(T("/turf/open/floor")));
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1]));
	return f.dot;
});

// /obj/item/toy/crayon/proc/suicide_act  (code/game/objects/items/crayons.dm:73)
rt.def("/obj/item/toy/crayon/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is jamming ＀ up ＀ nose and into ＀ brain. It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 9;
});

// /obj/item/toy/crayon/proc/New  (code/game/objects/items/crayons.dm:77)  may sleep
rt.def("/obj/item/toy/crayon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "name"), "crayon")) {
		rt.setSv(f, "name", fmt("＀ crayon", [rt.sv(f, "item_color")]));
	}
	if (truthy(rt.gl("config"))) {
		if (isEqual(rt.fv(f, "mutant_races", rt.gl("config")), 1)) {
			(rt.modSrcVar(f, "graffiti", "antilizard", rt.bitOr));
			(rt.modSrcVar(f, "graffiti", "prolizard", rt.bitOr));
		}
	}
	rt.setSv(f, "all_drawables", add(add(add(add(add(rt.sv(f, "graffiti"), rt.sv(f, "letters")), rt.sv(f, "numerals")), rt.sv(f, "oriented")), rt.sv(f, "runes")), rt.sv(f, "graffiti_large_h")));
	rt.setSv(f, "drawtype", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "all_drawables")]));
	yield* g.srcCall(f, "refill");
	return f.dot;
}, true);

// /obj/item/toy/crayon/proc/refill  (code/game/objects/items/crayons.dm:93)  may sleep
rt.def("/obj/item/toy/crayon/proc/refill", function* refill(f: Frame) {
	let total_weight: Value = null, key: Value = null, units_per_weight: Value = null, reagent: Value = null, weight: Value = null, amount: Value = null;
	let $e: any;
	f.vars = () => [total_weight, key, units_per_weight, reagent, weight, amount, $e];
	if (isEqual(rt.sv(f, "charges"), -1)) {
		rt.setSv(f, "charges_left", 100);
	} else {
		rt.setSv(f, "charges_left", rt.sv(f, "charges"));
	}
	if (!truthy(rt.sv(f, "reagents"))) {
		yield* g.srcCall(f, "create_reagents", multiply(rt.sv(f, "charges_left"), rt.sv(f, "volume_multiplier")));
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "clear_reagents", []);
	total_weight = 0;
	key = null;
	rt.forList(f, 0, rt.sv(f, "reagent_contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		total_weight = rt.modify(live(total_weight), rt.index(rt.sv(f, "reagent_contents"), live(key)), add);
	}
	rt.endFor(f, 0);
	units_per_weight = divide(rt.fv(f, "maximum_volume", rt.sv(f, "reagents")), live(total_weight));
	reagent = null;
	rt.forList(f, 0, rt.sv(f, "reagent_contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		weight = rt.index(rt.sv(f, "reagent_contents"), live(reagent));
		amount = multiply(live(weight), live(units_per_weight));
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(reagent), live(amount)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/toy/crayon/proc/use_charges  (code/game/objects/items/crayons.dm:114)  may sleep
rt.def("/obj/item/toy/crayon/proc/use_charges", function* use_charges(f: Frame, amount: Value) {
	let $0: any;
	f.vars = () => [amount, $0];
	$0 = rt.sv(f, "paint_mode");
	if ($0 === 2) {
		(amount = rt.modify(live(amount), 3, multiply));
	}
	if (isEqual(rt.sv(f, "charges"), -1)) {
		f.dot = live(amount);
		yield* g.srcCall(f, "refill");
	} else {
		f.dot = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "charges_left"), live(amount)]));
		(rt.modSrcVar(f, "charges_left", live(f.dot), subtract));
	}
	return f.dot;
}, true);

// /obj/item/toy/crayon/proc/check_empty  (code/game/objects/items/crayons.dm:128)  may sleep
rt.def("/obj/item/toy/crayon/proc/check_empty", function* check_empty(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return 1;
	}
	f.dot = 0;
	if (isEqual(rt.sv(f, "charges"), -1)) {
		f.dot = 0;
	} else {
		if (truthy(rt.sv(f, "charges_left"))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is no more of ％！ left!</span>", [rt.fv(f, "name", live(f.src))])]);
		if (truthy(rt.sv(f, "self_contained"))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
		f.dot = 1;
	}
	return f.dot;
}, true);

// /obj/item/toy/crayon/proc/ui_interact  (code/game/objects/items/crayons.dm:144)  may sleep
rt.def("/obj/item/toy/crayon/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("hands_state");
	}
	yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]);
	if (truthy(live(ui))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "crayon", rt.sv(f, "name"), 600, 600, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

rt.type(9663, "/obj/item/toy/crayon/spraycan", "/obj/item/toy/crayon", {
	icon_capped: "spraycan_cap",
	icon_uncapped: "spraycan",
	use_overlays: 1,
	paint_color: null,
	item_state: "spraycan",
	instant: 1,
	edible: 0,
	has_cap: 1,
	is_capped: 1,
	self_contained: 0,
	can_change_colour: 1,
	validSurfaces: null,
	reagent_contents: null,
	pre_noise: 1,
	post_noise: 0,
	name: "spray can",
	icon_state: "spraycan",
	desc: "A metallic container containing tasty paint.\n Alt-click to toggle the cap.",
});

// /obj/item/toy/crayon/spraycan/proc/AltClick  (code/game/objects/items/crayons.dm:152)
rt.def("/obj/item/toy/crayon/spraycan/proc/AltClick", function AltClick(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (!truthy(rt.sv(f, "has_cap"))) return f.dot;
	rt.setSv(f, "is_capped", (!truthy(rt.sv(f, "is_capped")) ? 1 : 0));
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "is_capped"))) {
		$1 = $1;
		$2 = "on";
	} else {
		$2 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The cap on ＀ is now ＀.</span>", [$1, $2])]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/toy/crayon/proc/ui_data  (code/game/objects/items/crayons.dm:157)
rt.def("/obj/item/toy/crayon/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, D: Value = null, g_items: Value = null, _g: Value = null, glh_items: Value = null, glh: Value = null, L_items: Value = null, L: Value = null, N_items: Value = null, N: Value = null, O_items: Value = null, O: Value = null, R_items: Value = null, R: Value = null, rand_items: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [data, D, g_items, _g, glh_items, glh, L_items, L, N_items, N, O_items, O, R_items, R, rand_items, i, $e];
	rt.setAt((data = rt.list()), "drawables", rt.list());
	D = rt.at(live(data), "drawables");
	g_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Graffiti", "items", live(g_items)])), add);
	_g = null;
	rt.forList(f, 0, rt.sv(f, "graffiti"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_g = $e;
		g_items = rt.modify(live(g_items), rt.list(rt.alist(f, ["item", live(_g)])), add);
	}
	rt.endFor(f, 0);
	glh_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Graffiti Large Horizontal", "items", live(glh_items)])), add);
	glh = null;
	rt.forList(f, 0, rt.sv(f, "graffiti_large_h"));
	while (($e = rt.next(f, 0)) !== undefined) {
		glh = $e;
		glh_items = rt.modify(live(glh_items), rt.list(rt.alist(f, ["item", live(glh)])), add);
	}
	rt.endFor(f, 0);
	L_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Letters", "items", live(L_items)])), add);
	L = null;
	rt.forList(f, 0, rt.sv(f, "letters"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		L_items = rt.modify(live(L_items), rt.list(rt.alist(f, ["item", live(L)])), add);
	}
	rt.endFor(f, 0);
	N_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Numerals", "items", live(N_items)])), add);
	N = null;
	rt.forList(f, 0, rt.sv(f, "numerals"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		N_items = rt.modify(live(N_items), rt.list(rt.alist(f, ["item", live(N)])), add);
	}
	rt.endFor(f, 0);
	O_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Oriented", "items", live(O_items)])), add);
	O = null;
	rt.forList(f, 0, rt.sv(f, "oriented"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		O_items = rt.modify(live(O_items), rt.list(rt.alist(f, ["item", live(O)])), add);
	}
	rt.endFor(f, 0);
	R_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Runes", "items", live(R_items)])), add);
	R = null;
	rt.forList(f, 0, rt.sv(f, "runes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		R_items = rt.modify(live(R_items), rt.list(rt.alist(f, ["item", live(R)])), add);
	}
	rt.endFor(f, 0);
	rand_items = rt.list();
	D = rt.modify(live(D), rt.list(rt.alist(f, ["name", "Random", "items", live(rand_items)])), add);
	i = null;
	rt.forList(f, 0, rt.sv(f, "randoms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rand_items = rt.modify(live(rand_items), rt.list(rt.alist(f, ["item", live(i)])), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "selected_stencil", rt.sv(f, "drawtype"));
	rt.setAt(live(data), "text_buffer", rt.sv(f, "text_buffer"));
	rt.setAt(live(data), "has_cap", rt.sv(f, "has_cap"));
	rt.setAt(live(data), "is_capped", rt.sv(f, "is_capped"));
	rt.setAt(live(data), "can_change_colour", rt.sv(f, "can_change_colour"));
	rt.setAt(live(data), "current_colour", rt.sv(f, "paint_color"));
	return live(data);
});

// /obj/item/toy/crayon/proc/ui_act  (code/game/objects/items/crayons.dm:207)  may sleep
rt.def("/obj/item/toy/crayon/proc/ui_act", function* ui_act(f: Frame) {
	let stencil: Value = null, txt: Value = null;
	let $0: any;
	f.vars = () => [stencil, txt, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "toggle_cap") {
		if (truthy(rt.sv(f, "has_cap"))) {
			rt.setSv(f, "is_capped", (!truthy(rt.sv(f, "is_capped")) ? 1 : 0));
			f.dot = 1;
		}
	} else if ($0 === "select_stencil") {
		if (truthy((rt.isIn(f, (stencil = rt.at(live(f.args[1]), "item")), add(rt.sv(f, "all_drawables"), rt.sv(f, "randoms"))) ? 1 : 0))) {
			rt.setSv(f, "drawtype", live(stencil));
			f.dot = 1;
		}
		if (truthy((rt.isIn(f, live(stencil), rt.sv(f, "graffiti_large_h")) ? 1 : 0))) {
			rt.setSv(f, "paint_mode", 2);
			rt.setSv(f, "text_buffer", "");
		} else {
			rt.setSv(f, "paint_mode", 1);
		}
	} else if ($0 === "select_colour") {
		if (truthy(rt.sv(f, "can_change_colour"))) {
			rt.setSv(f, "paint_color", (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", live(f.usr), null])));
			f.dot = 1;
		}
	} else if ($0 === "enter_text") {
		rt.setSv(f, "text_buffer", (yield* g.srcCall(f, "crayon_text_strip", (txt = (yield* g.call(f, P("/proc/stripped_input"), null, [null, live(f.usr), null, "Choose what to write.", null, "Scribbles", "default", rt.sv(f, "text_buffer")], rt.Args.Named))))));
		f.dot = 1;
		rt.setSv(f, "paint_mode", 1);
		rt.setSv(f, "drawtype", "a");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/item/toy/crayon/proc/crayon_text_strip  (code/game/objects/items/crayons.dm:238)
rt.def("/obj/item/toy/crayon/proc/crayon_text_strip", function crayon_text_strip(f: Frame, text: Value) {
	let base: Value = null, out: Value = null, a: Value = null;
	let $e: any;
	f.vars = () => [base, out, a, $e];
	base = subtract(rt.call(f, P("/proc/splittext"), null, [rt.call(f, P("/proc/lowertext"), null, [live(text)]), rt.call(f, P("/proc/regex"), null, ["(.)"])]), rt.call(f, P("/proc/splittext"), null, [rt.call(f, P("/proc/lowertext"), null, [live(text)]), ""]));
	out = rt.list();
	a = null;
	rt.forList(f, 0, live(base));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		if (truthy((rt.isIn(f, live(a), rt.bitOr(rt.sv(f, "letters"), rt.sv(f, "numerals"))) ? 1 : 0))) {
			out = rt.modify(live(out), live(a), add);
		}
	}
	rt.endFor(f, 0);
	return rt.call(f, P("/proc/jointext"), null, [live(out), ""]);
});

// /obj/item/toy/crayon/proc/afterattack  (code/game/objects/items/crayons.dm:246)  may sleep
rt.def("/obj/item/toy/crayon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let drawing: Value = null, temp: Value = null, gang_mode: Value = null, graf_rot: Value = null, takes_time: Value = null, wait_time: Value = null, affected_turfs: Value = null, left: Value = null, right: Value = null, cost: Value = null, fraction: Value = null, t: Value = null;
	let $0: any, $e: any;
	f.vars = () => [target, user, proximity, drawing, temp, gang_mode, graf_rot, takes_time, wait_time, affected_turfs, left, right, cost, fraction, t, $0, $e];
	if ((!truthy(live(proximity)) || !truthy((yield* g.srcCall(f, "check_allowed_items", live(target)))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "check_empty", live(user))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj/effect/decal/cleanable")) ? 1 : 0))) {
		target = rt.fv(f, "loc", live(target));
	}
	if (!truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(target), rt.sv(f, "validSurfaces")])))) {
		return live(f.dot);
	}
	drawing = rt.sv(f, "drawtype");
	$0 = rt.sv(f, "drawtype");
	if ($0 === "Random Letter") {
		drawing = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "letters")]);
	} else if ($0 === "Random Graffiti") {
		drawing = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "graffiti")]);
	} else if ($0 === "Random Rune") {
		drawing = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "runes")]);
	} else if ($0 === "Random Oriented") {
		drawing = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "oriented")]);
	} else if ($0 === "Random Number") {
		drawing = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "numerals")]);
	} else if ($0 === "Random Anything") {
		drawing = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "all_drawables")]);
	}
	temp = "rune";
	if (truthy((rt.isIn(f, live(drawing), rt.sv(f, "letters")) ? 1 : 0))) {
		temp = "letter";
	} else {
		if (truthy((rt.isIn(f, live(drawing), rt.sv(f, "graffiti")) ? 1 : 0))) {
			temp = "graffiti";
		} else {
			if (truthy((rt.isIn(f, live(drawing), rt.sv(f, "numerals")) ? 1 : 0))) {
				temp = "number";
			}
		}
	}
	gang_mode = 0;
	if (((truthy(rt.sv(f, "gang")) && truthy(rt.fv(f, "mind", live(user)))) && truthy(rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user)))))) {
		gang_mode = 1;
	}
	if ((truthy(live(gang_mode)) && !truthy((yield* g.srcCall(f, "can_claim_for_gang", live(user), live(target)))))) {
		return live(f.dot);
	}
	graf_rot = null;
	if (truthy((rt.isIn(f, live(drawing), rt.sv(f, "oriented")) ? 1 : 0))) {
		$0 = rt.fv(f, "dir", live(user));
		if ($0 === 4) {
			graf_rot = 90;
		} else if ($0 === 2) {
			graf_rot = 180;
		} else if ($0 === 8) {
			graf_rot = 270;
		} else {
			graf_rot = 0;
		}
	}
	if (!truthy(rt.sv(f, "instant"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start drawing a ＀ on the\t＀...</span>", [live(temp), rt.fv(f, "name", live(target))])]);
	}
	if (truthy(rt.sv(f, "pre_noise"))) {
		yield* g.srcCall(f, "audible_message", "<span class='notice'>You hear spraying.</span>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/spray.ogg"), 5, 1, 5]);
	}
	takes_time = (!truthy(rt.sv(f, "instant")) ? 1 : 0);
	if (truthy(live(gang_mode))) {
		takes_time = 1;
	}
	wait_time = 50;
	if (truthy(2)) {
		(wait_time = rt.modify(live(wait_time), 3, multiply));
	}
	if (truthy(live(takes_time))) {
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(target)], rt.Args.Named)))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.length(rt.sv(f, "text_buffer")))) {
		drawing = (yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "text_buffer"), 1, 2]));
	}
	affected_turfs = rt.list();
	if (truthy(rt.sv(f, "actually_paints"))) {
		if (truthy(live(gang_mode))) {
			if (!truthy((yield* g.srcCall(f, "can_claim_for_gang", live(user), live(target))))) {
				return live(f.dot);
			}
			yield* g.srcCall(f, "tag_for_gang", live(user), live(target));
			affected_turfs = rt.modify(live(affected_turfs), live(target), add);
		} else {
			$0 = rt.sv(f, "paint_mode");
			if ($0 === 1) {
				yield* g.new_(f, T("/obj/effect/decal/cleanable/crayon"), [live(target), rt.sv(f, "paint_color"), live(drawing), live(temp), live(graf_rot)]);
				affected_turfs = rt.modify(live(affected_turfs), live(target), add);
			} else if ($0 === 2) {
				left = rt.locate(subtract(rt.fv(f, "x", live(target)), 1), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target)));
				right = rt.locate(add(rt.fv(f, "x", live(target)), 1), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target)));
				if ((truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(left), rt.sv(f, "validSurfaces")]))) && truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(right), rt.sv(f, "validSurfaces")]))))) {
					yield* g.new_(f, T("/obj/effect/decal/cleanable/crayon"), [live(left), rt.sv(f, "paint_color"), live(drawing), live(temp), live(graf_rot), rt.rsc("icons/effects/96x32.dmi")]);
					affected_turfs = rt.modify(live(affected_turfs), live(left), add);
					affected_turfs = rt.modify(live(affected_turfs), live(right), add);
					affected_turfs = rt.modify(live(affected_turfs), live(target), add);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There isn't enough space to paint!</span>"]);
					return live(f.dot);
				}
			}
		}
	}
	if (!truthy(rt.sv(f, "instant"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You finish drawing ％！.</span>", [live(temp)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You spray a ＀ on ％！</span>", [live(temp), rt.fv(f, "name", live(target))])]);
	}
	if (truthy(rt.length(rt.sv(f, "text_buffer")))) {
		rt.setSv(f, "text_buffer", (yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "text_buffer"), 2])));
	}
	if (truthy(rt.sv(f, "post_noise"))) {
		yield* g.srcCall(f, "audible_message", "<span class='notice'>You hear spraying.</span>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/spray.ogg"), 5, 1, 5]);
	}
	cost = 1;
	if (isEqual(rt.sv(f, "paint_mode"), 2)) {
		cost = 5;
	}
	f.dot = (yield* g.srcCall(f, "use_charges", live(cost)));
	fraction = (yield* g.call(f, P("/proc/min"), null, [1, divide(live(f.dot), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))]));
	if (truthy(rt.len(f, live(affected_turfs)))) {
		(fraction = rt.modify(live(fraction), rt.len(f, live(affected_turfs)), divide));
	}
	t = null;
	rt.forList(f, 0, live(affected_turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(t), 1, multiply(live(fraction), rt.sv(f, "volume_multiplier"))]);
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(t), live(f.dot), rt.sv(f, "volume_multiplier")]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "check_empty", live(user));
	return f.dot;
}, true);

// /obj/item/toy/crayon/proc/attack  (code/game/objects/items/crayons.dm:376)  may sleep
rt.def("/obj/item/toy/crayon/proc/attack", function* attack(f: Frame) {
	let eaten: Value = null, fraction: Value = null;
	f.vars = () => [eaten, fraction];
	if ((truthy(rt.sv(f, "edible")) && isEqual(live(f.args[0]), live(f.args[1])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You take a bite of the ＀. Delicious!", [rt.fv(f, "name", live(f.src))])]);
		eaten = (yield* g.srcCall(f, "use_charges", 5));
		if (truthy((yield* g.srcCall(f, "check_empty", live(f.args[1]))))) {
			return live(f.dot);
		}
		fraction = (yield* g.call(f, P("/proc/min"), null, [divide(live(eaten), rt.fv(f, "total_volume", rt.sv(f, "reagents"))), 1]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 2, multiply(live(fraction), rt.sv(f, "volume_multiplier"))]);
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), live(eaten), rt.sv(f, "volume_multiplier")]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/toy/crayon/proc/can_claim_for_gang  (code/game/objects/items/crayons.dm:391)
rt.def("/obj/item/toy/crayon/proc/can_claim_for_gang", function can_claim_for_gang(f: Frame, user: Value, target: Value) {
	let A: Value = null, spraying_over: Value = null, G: Value = null, apc: Value = null, occupying_gang: Value = null;
	let $e: any;
	f.vars = () => [A, spraying_over, G, apc, occupying_gang, $e];
	if (((!truthy((A = rt.call(f, P("/proc/get_area"), null, [live(target)]))) || !isEqual(rt.fv(f, "z", live(A)), 2)) || !truthy(rt.fv(f, "valid_territory", live(A))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is unsuitable for tagging.</span>", [live(A)])]);
		return 0;
	}
	spraying_over = 0;
	G = null;
	rt.forList(f, 0, live(target), T("/obj/effect/decal/cleanable/crayon/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		spraying_over = 1;
	}
	rt.endFor(f, 0);
	apc = null;
	rt.forList(f, 0, live(target), T("/obj/machinery/power"));
	while (($e = rt.next(f, 0)) !== undefined) {
		apc = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't tag an APC.</span>"]);
		return 0;
	}
	rt.endFor(f, 0);
	if ((truthy((occupying_gang = rt.callSrc(f, "territory_claimed", [live(A), live(user)]))) && !truthy(live(spraying_over)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ has already been tagged by the ＀ gang! You must get rid of or spray over the old tag first!</span>", [live(A), live(occupying_gang)])]);
		return 0;
	}
	return 1;
});

// /obj/item/toy/crayon/proc/territory_claimed  (code/game/objects/items/crayons.dm:413)
rt.def("/obj/item/toy/crayon/proc/territory_claimed", function territory_claimed(f: Frame, territory: Value, user: Value) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy((rt.isIn(f, rt.fv(f, "type", live(territory)), rt.bitOr(rt.fv(f, "territory", live(G)), rt.fv(f, "territory_new", live(G)))) ? 1 : 0))) {
			f.dot = rt.fv(f, "name", live(G));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/toy/crayon/proc/tag_for_gang  (code/game/objects/items/crayons.dm:420)  may sleep
rt.def("/obj/item/toy/crayon/proc/tag_for_gang", function* tag_for_gang(f: Frame, user: Value, target: Value) {
	let old_marking: Value = null, gangID: Value = null, territory: Value = null;
	let $e: any;
	f.vars = () => [user, target, old_marking, gangID, territory, $e];
	old_marking = null;
	rt.forList(f, 0, live(target), T("/obj/effect/decal/cleanable/crayon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		old_marking = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(old_marking)]);
	}
	rt.endFor(f, 0);
	gangID = rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user)));
	territory = (yield* g.call(f, P("/proc/get_area"), null, [live(target)]));
	yield* g.new_(f, T("/obj/effect/decal/cleanable/crayon/gang"), [live(target), live(gangID), "graffiti", 0, live(user)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You tagged ＀ for your gang!</span>", [live(territory)])]);
	return f.dot;
}, true);

rt.type(9669, "/obj/item/toy/crayon/red", "/obj/item/toy/crayon", {
	paint_color: "#DA0000",
	item_color: "red",
	reagent_contents: null,
	icon_state: "crayonred",
});

// /obj/item/toy/crayon/red/proc/<init>  (code/game/objects/items/crayons.dm:433)
rt.def("/obj/item/toy/crayon/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "redcrayonpowder", 1]));
	return f.dot;
});

rt.type(9670, "/obj/item/toy/crayon/orange", "/obj/item/toy/crayon", {
	paint_color: "#FF9300",
	item_color: "orange",
	reagent_contents: null,
	icon_state: "crayonorange",
});

// /obj/item/toy/crayon/orange/proc/<init>  (code/game/objects/items/crayons.dm:439)
rt.def("/obj/item/toy/crayon/orange/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "orangecrayonpowder", 1]));
	return f.dot;
});

rt.type(9671, "/obj/item/toy/crayon/yellow", "/obj/item/toy/crayon", {
	paint_color: "#FFF200",
	item_color: "yellow",
	reagent_contents: null,
	icon_state: "crayonyellow",
});

// /obj/item/toy/crayon/yellow/proc/<init>  (code/game/objects/items/crayons.dm:445)
rt.def("/obj/item/toy/crayon/yellow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "yellowcrayonpowder", 1]));
	return f.dot;
});

rt.type(9672, "/obj/item/toy/crayon/green", "/obj/item/toy/crayon", {
	paint_color: "#A8E61D",
	item_color: "green",
	reagent_contents: null,
	icon_state: "crayongreen",
});

// /obj/item/toy/crayon/green/proc/<init>  (code/game/objects/items/crayons.dm:451)
rt.def("/obj/item/toy/crayon/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "greencrayonpowder", 1]));
	return f.dot;
});

rt.type(9673, "/obj/item/toy/crayon/blue", "/obj/item/toy/crayon", {
	paint_color: "#00B7EF",
	item_color: "blue",
	reagent_contents: null,
	icon_state: "crayonblue",
});

// /obj/item/toy/crayon/blue/proc/<init>  (code/game/objects/items/crayons.dm:457)
rt.def("/obj/item/toy/crayon/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "bluecrayonpowder", 1]));
	return f.dot;
});

rt.type(9674, "/obj/item/toy/crayon/purple", "/obj/item/toy/crayon", {
	paint_color: "#DA00FF",
	item_color: "purple",
	reagent_contents: null,
	icon_state: "crayonpurple",
});

// /obj/item/toy/crayon/purple/proc/<init>  (code/game/objects/items/crayons.dm:463)
rt.def("/obj/item/toy/crayon/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "purplecrayonpowder", 1]));
	return f.dot;
});

rt.type(9675, "/obj/item/toy/crayon/black", "/obj/item/toy/crayon", {
	paint_color: "#1C1C1C",
	item_color: "black",
	reagent_contents: null,
	icon_state: "crayonblack",
});

// /obj/item/toy/crayon/black/proc/<init>  (code/game/objects/items/crayons.dm:469)
rt.def("/obj/item/toy/crayon/black/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "blackcrayonpowder", 1]));
	return f.dot;
});

rt.type(9676, "/obj/item/toy/crayon/white", "/obj/item/toy/crayon", {
	paint_color: "#FFFFFF",
	item_color: "white",
	reagent_contents: null,
	icon_state: "crayonwhite",
});

// /obj/item/toy/crayon/white/proc/<init>  (code/game/objects/items/crayons.dm:475)
rt.def("/obj/item/toy/crayon/white/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "whitecrayonpowder", 1]));
	return f.dot;
});

rt.type(9677, "/obj/item/toy/crayon/mime", "/obj/item/toy/crayon", {
	paint_color: "#FFFFFF",
	item_color: "mime",
	reagent_contents: null,
	charges: -1,
	icon_state: "crayonmime",
	desc: "A very sad-looking crayon.",
});

// /obj/item/toy/crayon/mime/proc/<init>  (code/game/objects/items/crayons.dm:482)
rt.def("/obj/item/toy/crayon/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "invisiblecrayonpowder", 1]));
	return f.dot;
});

rt.type(9678, "/obj/item/toy/crayon/rainbow", "/obj/item/toy/crayon", {
	paint_color: "#FFF000",
	item_color: "rainbow",
	reagent_contents: null,
	drawtype: "Random Anything",
	charges: -1,
	icon_state: "crayonrainbow",
});

// /obj/item/toy/crayon/rainbow/proc/<init>  (code/game/objects/items/crayons.dm:489)
rt.def("/obj/item/toy/crayon/rainbow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nutriment", 1, "colorful_reagent", 1]));
	return f.dot;
});

// /obj/item/toy/crayon/rainbow/proc/afterattack  (code/game/objects/items/crayons.dm:495)  may sleep
rt.def("/obj/item/toy/crayon/rainbow/proc/afterattack", function* afterattack(f: Frame) {
	rt.setSv(f, "paint_color", rt.op(f, "Rgb", [1, 3], [(yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255]))]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(5441, "/obj/item/weapon/storage/crayons", "/obj/item/weapon/storage", {
	name: "box of crayons",
	desc: "A box of crayons for all your rune drawing needs.",
	icon: rt.rsc("icons/obj/crayons.dmi"),
	icon_state: "crayonbox",
	w_class: 2,
	storage_slots: 7,
	can_hold: null,
});

// /obj/item/weapon/storage/crayons/proc/<init>  (code/game/objects/items/crayons.dm:509)
rt.def("/obj/item/weapon/storage/crayons/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/toy/crayon")));
	return f.dot;
});

// /obj/item/weapon/storage/crayons/proc/New  (code/game/objects/items/crayons.dm:514)  may sleep
rt.def("/obj/item/weapon/storage/crayons/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/toy/crayon/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/toy/crayon/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/toy/crayon/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/toy/crayon/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/toy/crayon/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/toy/crayon/purple"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/toy/crayon/black"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/storage/crayons/proc/update_icon  (code/game/objects/items/crayons.dm:525)
rt.def("/obj/item/weapon/storage/crayons/proc/update_icon", function update_icon(f: Frame) {
	let crayon: Value = null;
	let $e: any;
	f.vars = () => [crayon, $e];
	rt.callSrc(f, "cut_overlays", []);
	crayon = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/toy/crayon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		crayon = $e;
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/crayons.dmi"), rt.fv(f, "item_color", live(crayon))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/storage/crayons/proc/attackby  (code/game/objects/items/crayons.dm:530)  may sleep
rt.def("/obj/item/weapon/storage/crayons/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	let $0: any;
	f.vars = () => [C, $0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0))) {
		$0 = rt.gv(f, "item_color", (C = live(f.args[0])));
		if ($0 === "mime") {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This crayon is too sad to be contained in this box."]);
			return live(f.dot);
		} else if ($0 === "rainbow") {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This crayon is too powerful to be contained in this box."]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon/spraycan")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "Spraycans are not crayons."]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/item/toy/crayon/spraycan/proc/<init>  (code/game/objects/items/crayons.dm:565)
rt.def("/obj/item/toy/crayon/spraycan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "validSurfaces", rt.list(T("/turf/open/floor"), T("/turf/closed/wall")));
	rt.setSv(f, "reagent_contents", rt.alist(f, ["welding_fuel", 1, "ethanol", 1]));
	return f.dot;
});

// /obj/item/toy/crayon/spraycan/proc/suicide_act  (code/game/objects/items/crayons.dm:572)  may sleep
rt.def("/obj/item/toy/crayon/spraycan/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null, used: Value = null, fraction: Value = null;
	f.vars = () => [user, H, used, fraction];
	H = live(user);
	if ((truthy(rt.sv(f, "is_capped")) || !truthy(rt.sv(f, "actually_paints")))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ shakes up ＀ with a rattle and lifts it to ＀ mouth, but nothing happens!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", []))])]);
		yield* g.callName(f, live(user), "say", ["MEDIOCRE!!"]);
		return 16;
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ shakes up ＀ with a rattle and lifts it to ＀ mouth, spraying paint across ＀ teeth!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_their", []))])]);
		yield* g.callName(f, live(user), "say", ["WITNESS ME!!"]);
		if ((truthy(rt.sv(f, "pre_noise")) || truthy(rt.sv(f, "post_noise")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/spray.ogg"), 5, 1, 5]);
		}
		if (truthy(rt.sv(f, "can_change_colour"))) {
			rt.setSv(f, "paint_color", "#C0C0C0");
		}
		yield* g.srcCall(f, "update_icon");
		if (truthy(rt.sv(f, "actually_paints"))) {
			rt.setFv(f, "lip_style", live(H), "spray_face");
			rt.setFv(f, "lip_color", live(H), rt.sv(f, "paint_color"));
			yield* g.callName(f, live(H), "update_body", []);
		}
		used = (yield* g.srcCall(f, "use_charges", 10));
		fraction = (yield* g.call(f, P("/proc/min"), null, [1, divide(live(used), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(user), 3, multiply(live(fraction), rt.sv(f, "volume_multiplier"))]);
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(user), live(used), rt.sv(f, "volume_multiplier")]);
		return 8;
	}
	return f.dot;
}, true);

// /obj/item/toy/crayon/spraycan/proc/New  (code/game/objects/items/crayons.dm:597)  may sleep
rt.def("/obj/item/toy/crayon/spraycan/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "paint_color"))) {
		rt.setSv(f, "paint_color", rt.op(f, "PickUnweighted", [6], ["#DA0000", "#FF9300", "#FFF200", "#A8E61D", "#00B7EF", "#DA00FF"]));
	}
	yield* g.srcCall(f, "refill");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/toy/crayon/spraycan/proc/examine  (code/game/objects/items/crayons.dm:607)
rt.def("/obj/item/toy/crayon/spraycan/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "charges_left"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It has ＀ uses left.", [rt.sv(f, "charges_left")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It is empty."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/toy/crayon/spraycan/proc/afterattack  (code/game/objects/items/crayons.dm:614)  may sleep
rt.def("/obj/item/toy/crayon/spraycan/proc/afterattack", function* afterattack(f: Frame) {
	let C: Value = null, H: Value = null, fraction: Value = null, fraction_0: Value = null;
	f.vars = () => [C, H, fraction, fraction_0];
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "is_capped"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Take the cap off first!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "check_empty", live(f.args[1]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "pre_noise")) || truthy(rt.sv(f, "post_noise")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.rsc("sound/effects/spray.ogg"), 25, 1, 5]);
		}
		C = live(f.args[0]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ sprays ＀ into the face of ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='userdanger'>＀ sprays ＀ into your face!</span>", [live(f.args[1]), live(f.src)])]);
		if (truthy(rt.fv(f, "client", live(C)))) {
			yield* g.callName(f, live(C), "blur_eyes", [3]);
			yield* g.callName(f, live(C), "blind_eyes", [1]);
		}
		if (rt.le((yield* g.callName(f, live(C), "get_eye_protection", [])), 0)) {
			rt.setFv(f, "confused", live(C), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "confused", live(C)), 3])));
			yield* g.callName(f, live(C), "Knockdown", [60]);
		}
		if ((truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.sv(f, "actually_paints")))) {
			rt.setFv(f, "lip_style", (H = live(C)), "spray_face");
			rt.setFv(f, "lip_color", live(H), rt.sv(f, "paint_color"));
			yield* g.callName(f, live(H), "update_body", []);
		}
		f.dot = (yield* g.srcCall(f, "use_charges", 10));
		fraction = (yield* g.call(f, P("/proc/min"), null, [1, divide(live(f.dot), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(C), 3, multiply(live(fraction), rt.sv(f, "volume_multiplier"))]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/structure/window")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "actually_paints"))) {
			yield* g.callName(f, live(f.args[0]), "add_atom_colour", [rt.sv(f, "paint_color"), 3]);
			if (rt.lt((yield* g.call(f, P("/proc/color_hex2num"), null, [rt.sv(f, "paint_color")])), 255)) {
				yield* g.callName(f, live(f.args[0]), "set_opacity", [255]);
			} else {
				yield* g.callName(f, live(f.args[0]), "set_opacity", [rt.initial(f, live(f.args[0]), "opacity")]);
			}
		}
		f.dot = (yield* g.srcCall(f, "use_charges", 2));
		fraction_0 = (yield* g.call(f, P("/proc/min"), null, [1, divide(live(f.dot), rt.fv(f, "maximum_volume", rt.sv(f, "reagents")))]));
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 1, multiply(live(fraction_0), rt.sv(f, "volume_multiplier"))]);
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), live(f.dot), rt.sv(f, "volume_multiplier")]);
		if ((truthy(rt.sv(f, "pre_noise")) || truthy(rt.sv(f, "post_noise")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.rsc("sound/effects/spray.ogg"), 5, 1, 5]);
		}
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

// /obj/item/toy/crayon/spraycan/proc/update_icon  (code/game/objects/items/crayons.dm:670)
rt.def("/obj/item/toy/crayon/spraycan/proc/update_icon", function update_icon(f: Frame) {
	let spray_overlay: Value = null;
	let $0: any, $1: any;
	f.vars = () => [spray_overlay, $0, $1];
	if (truthy(rt.sv(f, "is_capped"))) {
		$0 = rt.sv(f, "icon_capped");
	} else {
		$0 = rt.sv(f, "icon_uncapped");
	}
	rt.setSv(f, "icon_state", $0);
	if (!truthy(rt.sv(f, "use_overlays"))) return f.dot;
	rt.callSrc(f, "cut_overlays", []);
	$0 = rt.rsc("icons/obj/crayons.dmi");
	if (truthy(rt.sv(f, "is_capped"))) {
		$1 = "spraycan_cap_colors";
	} else {
		$1 = "spraycan_colors";
	}
	rt.setFv(f, "color", (spray_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [$0, fmt("＀", [$1])])), rt.sv(f, "paint_color"));
	rt.callSrc(f, "add_overlay", [live(spray_overlay)]);
	return f.dot;
});

rt.type(9664, "/obj/item/toy/crayon/spraycan/gang", "/obj/item/toy/crayon/spraycan", {
	charges: 20,
	gang: 1,
	pre_noise: 0,
	post_noise: 1,
});

// /obj/item/toy/crayon/spraycan/gang/proc/New  (code/game/objects/items/crayons.dm:686)  may sleep
rt.def("/obj/item/toy/crayon/spraycan/gang/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "paint_color", rt.fv(f, "color_hex", live(f.args[1])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["loc", "G"] });

// /obj/item/toy/crayon/spraycan/gang/proc/examine  (code/game/objects/items/crayons.dm:692)
rt.def("/obj/item/toy/crayon/spraycan/gang/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.fv(f, "mind", live(f.args[0]))) && truthy(rt.gv(f, "gang_datum", rt.fv(f, "mind", live(f.args[0]))))) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "This spraycan has been specially modified for tagging territory."]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(9665, "/obj/item/toy/crayon/spraycan/borg", "/obj/item/toy/crayon/spraycan", {
	charges: -1,
	name: "cyborg spraycan",
	desc: "A metallic container containing shiny synthesised paint.",
});

// /obj/item/toy/crayon/spraycan/borg/proc/afterattack  (code/game/objects/items/crayons.dm:702)  may sleep
rt.def("/obj/item/toy/crayon/spraycan/borg/proc/afterattack", function* afterattack(f: Frame) {
	let diff: Value = null, borgy: Value = null, cost: Value = null;
	f.vars = () => [diff, borgy, cost];
	diff = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>How did you get this?</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 0;
	}
	borgy = live(f.args[1]);
	if (!truthy(live(diff))) {
		return live(f.dot);
	}
	cost = multiply(live(diff), 25);
	if (!truthy(rt.fv(f, "cell", live(borgy)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "cell", live(borgy)), "use", [live(cost)]);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(9666, "/obj/item/toy/crayon/spraycan/hellcan", "/obj/item/toy/crayon/spraycan", {
	icon_capped: "deathcan2_cap",
	icon_uncapped: "deathcan2",
	use_overlays: 0,
	volume_multiplier: 25,
	charges: 100,
	reagent_contents: null,
	actually_paints: 0,
	paint_color: "#000000",
	name: "hellcan",
	desc: "This spraycan doesn't seem to be filled with paint...",
	icon_state: "deathcan2_cap",
});

// /obj/item/toy/crayon/spraycan/hellcan/proc/<init>  (code/game/objects/items/crayons.dm:730)
rt.def("/obj/item/toy/crayon/spraycan/hellcan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["clf3", 1]));
	return f.dot;
});

rt.type(9667, "/obj/item/toy/crayon/spraycan/lubecan", "/obj/item/toy/crayon/spraycan", {
	icon_capped: "clowncan2_cap",
	icon_uncapped: "clowncan2",
	use_overlays: 0,
	reagent_contents: null,
	volume_multiplier: 5,
	validSurfaces: null,
	name: "slippery spraycan",
	desc: "You can barely keep hold of this thing.",
	icon_state: "clowncan2_cap",
});

// /obj/item/toy/crayon/spraycan/lubecan/proc/<init>  (code/game/objects/items/crayons.dm:742)
rt.def("/obj/item/toy/crayon/spraycan/lubecan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["lube", 1, "banana", 1]));
	$0 = $0;
	rt.setSv(f, "validSurfaces", rt.list(T("/turf/open/floor")));
	return f.dot;
});

rt.type(9668, "/obj/item/toy/crayon/spraycan/mimecan", "/obj/item/toy/crayon/spraycan", {
	icon_capped: "mimecan_cap",
	icon_uncapped: "mimecan",
	use_overlays: 0,
	can_change_colour: 0,
	paint_color: "#FFFFFF",
	pre_noise: 0,
	post_noise: 0,
	reagent_contents: null,
	name: "silent spraycan",
	desc: "Art is best seen, not heard.",
	icon_state: "mimecan_cap",
});

// /obj/item/toy/crayon/spraycan/mimecan/proc/<init>  (code/game/objects/items/crayons.dm:759)
rt.def("/obj/item/toy/crayon/spraycan/mimecan/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_contents", rt.alist(f, ["nothing", 1, "mutetoxin", 1]));
	return f.dot;
});
