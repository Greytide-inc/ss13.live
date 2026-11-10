// Based on /tg/station's code/game/objects/items/crayons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// crayons.dm:56
rt.def("/obj/item/toy/crayon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("attacked", "coloured");
	this.graffiti = list("amyjon", "face", "matt", "revolution", "engie", "guy", "end", "dwarf", "uboa", "body", "cyka", "arrow", "star", "poseur tag");
	this.letters = list("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
	this.numerals = list("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
	this.oriented = list("arrow", "body");
	this.runes = list("rune1", "rune2", "rune3", "rune4", "rune5", "rune6");
	this.randoms = list("Random Anything", "Random Rune", "Random Oriented", "Random Number", "Random Graffiti", "Random Letter");
	this.graffiti_large_h = list("yiffhell", "secborg", "paint");

	this.validSurfaces = list(T("/turf/open/floor"));
	this.reagent_contents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

// crayons.dm:73
rt.def("/obj/item/toy/crayon/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is jamming ${this} up ${user.p_their()} nose and into ${user.p_their()} brain. It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 9;
});

// crayons.dm:77
rt.def("/obj/item/toy/crayon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.name == "crayon") {
		this.name = `${this.item_color} crayon`;
	}
	if (GLOB.config) {
		if (GLOB.config.mutant_races == 1) {
			(rt.modSrcVar(f, "graffiti", "antilizard", rt.bitOr));
			(rt.modSrcVar(f, "graffiti", "prolizard", rt.bitOr));
		}
	}
	this.all_drawables = this.graffiti + this.letters + this.numerals + this.oriented + this.runes + this.graffiti_large_h;
	this.drawtype = pick(this.all_drawables);
	yield* this.refill();
	return f.dot;
}, true);

// crayons.dm:93
rt.def("/obj/item/toy/crayon/proc/refill", function* refill(f: Frame) {
	let key: Value = null, reagent: Value = null, weight: Value = null, amount: Value = null;
	if (this.charges == -1) {
		this.charges_left = 100;
	} else {
		this.charges_left = this.charges;
	}
	if (!this.reagents) {
		yield* this.create_reagents(this.charges_left * this.volume_multiplier);
	}
	yield* this.reagents.clear_reagents();
	let total_weight: Value = 0;
	for (key of each(this.reagent_contents)) {
		total_weight += rt.index(this.reagent_contents, key);
	}
	let units_per_weight: Value = this.reagents.maximum_volume / total_weight;
	for (reagent of each(this.reagent_contents)) {
		weight = rt.index(this.reagent_contents, reagent);
		amount = weight * units_per_weight;
		yield* this.reagents.add_reagent(reagent, amount);
	}
	return f.dot;
}, true);

// crayons.dm:114
rt.def("/obj/item/toy/crayon/proc/use_charges", function* use_charges(f: Frame, amount: Value) {
	if (this.paint_mode === PAINT_LARGE_HORIZONTAL) {
		amount *= 3;
	}
	if (this.charges == -1) {
		f.dot = amount;
		yield* this.refill();
	} else {
		f.dot = min(this.charges_left, amount);
		this.charges_left -= f.dot;
	}
	return f.dot;
}, true);

// crayons.dm:128
rt.def("/obj/item/toy/crayon/proc/check_empty", function* check_empty(f: Frame, user: Value) {
	if (!this || this.gc_destroyed) {
		return 1;
	}
	f.dot = 0;
	if (this.charges == -1) {
		f.dot = 0;
	} else {
		if (this.charges_left) return f.dot;
		to_chat(user, fmt("<span class='warning'>There is no more of ％！ left!</span>", [this.name]));
		if (this.self_contained) {
			yield* qdel(this);
		}
		f.dot = 1;
	}
	return f.dot;
}, true);

// crayons.dm:144
rt.def("/obj/item/toy/crayon/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.hands_state;
	yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open);
	if (ui) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "crayon", this.name, 600, 600, master_ui, state))).open();
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

// crayons.dm:152
rt.def("/obj/item/toy/crayon/spraycan/proc/AltClick", function AltClick(f: Frame, user: Value) {
	let $2: any;
	if (!this.has_cap) return f.dot;
	this.is_capped = (!this.is_capped ? 1 : 0);
	let $0: any = user;
	let $1: any = this;
	if (this.is_capped) {

		$2 = "on";
	} else {
		$2 = "off";
	}
	to_chat($0, `<span class='notice'>The cap on ${$1} is now ${$2}.</span>`);
	this.update_icon();
	return f.dot;
});

// crayons.dm:157
rt.def("/obj/item/toy/crayon/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, _g: Value = null, glh: Value = null, L: Value = null, N: Value = null, O: Value = null, R: Value = null, i: Value = null;
	rt.setAt((data = list()), "drawables", list());
	let D: Value = rt.at(data, "drawables");
	let g_items: Value = list();
	D += list(rt.alist(f, ["name", "Graffiti", "items", g_items]));
	for (_g of each(this.graffiti)) {
		g_items += list(rt.alist(f, ["item", _g]));
	}
	let glh_items: Value = list();
	D += list(rt.alist(f, ["name", "Graffiti Large Horizontal", "items", glh_items]));
	for (glh of each(this.graffiti_large_h)) {
		glh_items += list(rt.alist(f, ["item", glh]));
	}
	let L_items: Value = list();
	D += list(rt.alist(f, ["name", "Letters", "items", L_items]));
	for (L of each(this.letters)) {
		L_items += list(rt.alist(f, ["item", L]));
	}
	let N_items: Value = list();
	D += list(rt.alist(f, ["name", "Numerals", "items", N_items]));
	for (N of each(this.numerals)) {
		N_items += list(rt.alist(f, ["item", N]));
	}
	let O_items: Value = list();
	D += list(rt.alist(f, ["name", "Oriented", "items", O_items]));
	for (O of each(this.oriented)) {
		O_items += list(rt.alist(f, ["item", O]));
	}
	let R_items: Value = list();
	D += list(rt.alist(f, ["name", "Runes", "items", R_items]));
	for (R of each(this.runes)) {
		R_items += list(rt.alist(f, ["item", R]));
	}
	let rand_items: Value = list();
	D += list(rt.alist(f, ["name", "Random", "items", rand_items]));
	for (i of each(this.randoms)) {
		rand_items += list(rt.alist(f, ["item", i]));
	}
	rt.setAt(data, "selected_stencil", this.drawtype);
	rt.setAt(data, "text_buffer", this.text_buffer);
	rt.setAt(data, "has_cap", this.has_cap);
	rt.setAt(data, "is_capped", this.is_capped);
	rt.setAt(data, "can_change_colour", this.can_change_colour);
	rt.setAt(data, "current_colour", this.paint_color);
	return data;
});

// crayons.dm:207
rt.def("/obj/item/toy/crayon/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let stencil: Value = null, txt: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "toggle_cap") {
		if (this.has_cap) {
			this.is_capped = (!this.is_capped ? 1 : 0);
			f.dot = 1;
		}
	} else if (action === "select_stencil") {
		if (rt.isIn(f, (stencil = rt.at(params, "item")), this.all_drawables + this.randoms)) {
			this.drawtype = stencil;
			f.dot = 1;
		}
		if (rt.isIn(f, stencil, this.graffiti_large_h)) {
			this.paint_mode = PAINT_LARGE_HORIZONTAL;
			this.text_buffer = "";
		} else {
			this.paint_mode = 1;
		}
	} else if (action === "select_colour") {
		if (this.can_change_colour) {
			this.paint_color = (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", f.usr, null]));
			f.dot = 1;
		}
	} else if (action === "enter_text") {
		this.text_buffer = this.crayon_text_strip((txt = (yield* stripped_input(f.usr, "Choose what to write.", "Scribbles", { default: this.text_buffer }))));
		f.dot = 1;
		this.paint_mode = 1;
		this.drawtype = "a";
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// crayons.dm:238
rt.def("/obj/item/toy/crayon/proc/crayon_text_strip", function crayon_text_strip(f: Frame, text: Value) {
	let a: Value = null;
	let base: Value = splittext(lowertext(text), regex("(.)")) - splittext(lowertext(text), "");
	let out: Value = list();
	for (a of each(base)) {
		if (rt.isIn(f, a, rt.bitOr(this.letters, this.numerals))) {
			out += a;
		}
	}
	return jointext(out, "");
});

// crayons.dm:246
rt.def("/obj/item/toy/crayon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let graf_rot: Value = null, left: Value = null, right: Value = null, t: Value = null;
	let $e: any;
	if (!proximity || !this.check_allowed_items(target)) {
		return f.dot;
	}
	if (yield* this.check_empty(user)) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/effect/decal/cleanable"))) {
		target = target.loc;
	}
	if (!is_type_in_list(target, this.validSurfaces)) {
		return f.dot;
	}
	let drawing: Value = this.drawtype;
	if (this.drawtype === "Random Letter") {
		drawing = pick(this.letters);
	} else if (this.drawtype === "Random Graffiti") {
		drawing = pick(this.graffiti);
	} else if (this.drawtype === "Random Rune") {
		drawing = pick(this.runes);
	} else if (this.drawtype === "Random Oriented") {
		drawing = pick(this.oriented);
	} else if (this.drawtype === "Random Number") {
		drawing = pick(this.numerals);
	} else if (this.drawtype === "Random Anything") {
		drawing = pick(this.all_drawables);
	}
	let temp: Value = "rune";
	if (rt.isIn(f, drawing, this.letters)) {
		temp = "letter";
	} else if (rt.isIn(f, drawing, this.graffiti)) {
		temp = "graffiti";
	} else if (rt.isIn(f, drawing, this.numerals)) {
		temp = "number";
	}
	let gang_mode: Value = 0;
	if (this.gang && user.mind && user.mind.gang_datum) {
		gang_mode = 1;
	}
	if (gang_mode && !this.can_claim_for_gang(user, target)) {
		return f.dot;
	}
	if (rt.isIn(f, drawing, this.oriented)) {
		if (user.dir === 4) {
			graf_rot = 90;
		} else if (user.dir === 2) {
			graf_rot = 180;
		} else if (user.dir === 8) {
			graf_rot = 270;
		} else {
			graf_rot = 0;
		}
	}
	if (!this.instant) {
		to_chat(user, `<span class='notice'>You start drawing a ${temp} on the\t${target.name}...</span>`);
	}
	if (this.pre_noise) {
		this.audible_message("<span class='notice'>You hear spraying.</span>");
		playsound(user.loc, rt.rsc("sound/effects/spray.ogg"), 5, 1, 5);
	}
	let takes_time: Value = (!this.instant ? 1 : 0);
	if (gang_mode) {
		takes_time = 1;
	}
	let wait_time: Value = 50;
	if (PAINT_LARGE_HORIZONTAL) {
		wait_time *= 3;
	}
	if (takes_time) {
		if (!(yield* do_after(user, 50, { target: target }))) {
			return f.dot;
		}
	}
	if (rt.length(this.text_buffer)) {
		drawing = copytext(this.text_buffer, 1, 2);
	}
	let affected_turfs: Value = list();
	if (this.actually_paints) {
		if (gang_mode) {
			if (!this.can_claim_for_gang(user, target)) {
				return f.dot;
			}
			yield* this.tag_for_gang(user, target);
			affected_turfs += target;
		} else if (this.paint_mode === PAINT_NORMAL) {
			yield* new_(T("/obj/effect/decal/cleanable/crayon"), target, this.paint_color, drawing, temp, graf_rot);
			affected_turfs += target;
		} else if (this.paint_mode === PAINT_LARGE_HORIZONTAL) {
			left = rt.locate(target.x - 1, target.y, target.z);
			right = rt.locate(target.x + 1, target.y, target.z);
			if (is_type_in_list(left, this.validSurfaces) && is_type_in_list(right, this.validSurfaces)) {
				yield* new_(T("/obj/effect/decal/cleanable/crayon"), left, this.paint_color, drawing, temp, graf_rot, rt.rsc("icons/effects/96x32.dmi"));
				affected_turfs += left;
				affected_turfs += right;
				affected_turfs += target;
			} else {
				to_chat(user, "<span class='warning'>There isn't enough space to paint!</span>");
				return f.dot;
			}
		}
	}
	if (!this.instant) {
		to_chat(user, fmt("<span class='notice'>You finish drawing ％！.</span>", [temp]));
	} else {
		to_chat(user, fmt("<span class='notice'>You spray a ＀ on ％！</span>", [temp, target.name]));
	}
	if (rt.length(this.text_buffer)) {
		this.text_buffer = copytext(this.text_buffer, 2);
	}
	if (this.post_noise) {
		this.audible_message("<span class='notice'>You hear spraying.</span>");
		playsound(user.loc, rt.rsc("sound/effects/spray.ogg"), 5, 1, 5);
	}
	let cost: Value = 1;
	if (this.paint_mode == PAINT_LARGE_HORIZONTAL) {
		cost = 5;
	}
	f.dot = (yield* this.use_charges(cost));
	let fraction: Value = min(1, f.dot / this.reagents.maximum_volume);
	if (rt.len(f, affected_turfs)) {
		fraction /= rt.len(f, affected_turfs);
	}
	for (t of each(affected_turfs)) {
		yield* this.reagents.reaction(t, TOUCH, fraction * this.volume_multiplier);
		yield* this.reagents.trans_to(t, f.dot, this.volume_multiplier);
	}
	yield* this.check_empty(user);
	return f.dot;
}, true);

// crayons.dm:376
rt.def("/obj/item/toy/crayon/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let eaten: Value = null, fraction: Value = null;
	if (this.edible && M == user) {
		to_chat(user, `You take a bite of the ${this.name}. Delicious!`);
		eaten = (yield* this.use_charges(5));
		if (yield* this.check_empty(user)) {
			return f.dot;
		}
		fraction = min(eaten / this.reagents.total_volume, 1);
		yield* this.reagents.reaction(M, INGEST, fraction * this.volume_multiplier);
		yield* this.reagents.trans_to(M, eaten, this.volume_multiplier);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// crayons.dm:391
rt.def("/obj/item/toy/crayon/proc/can_claim_for_gang", function can_claim_for_gang(f: Frame, user: Value, target: Value) {
	let A: Value = null, G: Value = null, apc: Value = null, occupying_gang: Value = null;
	if (!(A = get_area(target)) || A.z != ZLEVEL_STATION || !A.valid_territory) {
		to_chat(user, `<span class='warning'>${A} is unsuitable for tagging.</span>`);
		return 0;
	}
	let spraying_over: Value = 0;
	for (G of each(target, T("/obj/effect/decal/cleanable/crayon/gang"))) {
		spraying_over = 1;
	}
	for (apc of each(target, T("/obj/machinery/power"))) {
		to_chat(user, "<span class='warning'>You can't tag an APC.</span>");
		return 0;
	}
	if ((occupying_gang = this.territory_claimed(A, user)) && !spraying_over) {
		to_chat(user, `<span class='danger'>${A} has already been tagged by the ${occupying_gang} gang! You must get rid of or spray over the old tag first!</span>`);
		return 0;
	}
	return 1;
});

// crayons.dm:413
rt.def("/obj/item/toy/crayon/proc/territory_claimed", function territory_claimed(f: Frame, territory: Value, user: Value) {
	let G: Value = null;
	for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
		if (rt.isIn(f, territory.type, rt.bitOr(G.territory, G.territory_new))) {
			f.dot = G.name;
			break;
		}
	}
	return f.dot;
});

// crayons.dm:420
rt.def("/obj/item/toy/crayon/proc/tag_for_gang", function* tag_for_gang(f: Frame, user: Value, target: Value) {
	let old_marking: Value = null;
	for (old_marking of each(target, T("/obj/effect/decal/cleanable/crayon"))) {
		yield* qdel(old_marking);
	}
	let gangID: Value = user.mind.gang_datum;
	let territory: Value = get_area(target);
	yield* new_(T("/obj/effect/decal/cleanable/crayon/gang"), target, gangID, "graffiti", 0, user);
	to_chat(user, `<span class='notice'>You tagged ${territory} for your gang!</span>`);
	return f.dot;
}, true);

rt.type(9669, "/obj/item/toy/crayon/red", "/obj/item/toy/crayon", {
	paint_color: "#DA0000",
	item_color: "red",
	reagent_contents: null,
	icon_state: "crayonred",
});

// crayons.dm:433
rt.def("/obj/item/toy/crayon/red/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "redcrayonpowder", 1]);
	return f.dot;
});

rt.type(9670, "/obj/item/toy/crayon/orange", "/obj/item/toy/crayon", {
	paint_color: "#FF9300",
	item_color: "orange",
	reagent_contents: null,
	icon_state: "crayonorange",
});

// crayons.dm:439
rt.def("/obj/item/toy/crayon/orange/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "orangecrayonpowder", 1]);
	return f.dot;
});

rt.type(9671, "/obj/item/toy/crayon/yellow", "/obj/item/toy/crayon", {
	paint_color: "#FFF200",
	item_color: "yellow",
	reagent_contents: null,
	icon_state: "crayonyellow",
});

// crayons.dm:445
rt.def("/obj/item/toy/crayon/yellow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "yellowcrayonpowder", 1]);
	return f.dot;
});

rt.type(9672, "/obj/item/toy/crayon/green", "/obj/item/toy/crayon", {
	paint_color: "#A8E61D",
	item_color: "green",
	reagent_contents: null,
	icon_state: "crayongreen",
});

// crayons.dm:451
rt.def("/obj/item/toy/crayon/green/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "greencrayonpowder", 1]);
	return f.dot;
});

rt.type(9673, "/obj/item/toy/crayon/blue", "/obj/item/toy/crayon", {
	paint_color: "#00B7EF",
	item_color: "blue",
	reagent_contents: null,
	icon_state: "crayonblue",
});

// crayons.dm:457
rt.def("/obj/item/toy/crayon/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "bluecrayonpowder", 1]);
	return f.dot;
});

rt.type(9674, "/obj/item/toy/crayon/purple", "/obj/item/toy/crayon", {
	paint_color: "#DA00FF",
	item_color: "purple",
	reagent_contents: null,
	icon_state: "crayonpurple",
});

// crayons.dm:463
rt.def("/obj/item/toy/crayon/purple/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "purplecrayonpowder", 1]);
	return f.dot;
});

rt.type(9675, "/obj/item/toy/crayon/black", "/obj/item/toy/crayon", {
	paint_color: "#1C1C1C",
	item_color: "black",
	reagent_contents: null,
	icon_state: "crayonblack",
});

// crayons.dm:469
rt.def("/obj/item/toy/crayon/black/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "blackcrayonpowder", 1]);
	return f.dot;
});

rt.type(9676, "/obj/item/toy/crayon/white", "/obj/item/toy/crayon", {
	paint_color: "#FFFFFF",
	item_color: "white",
	reagent_contents: null,
	icon_state: "crayonwhite",
});

// crayons.dm:475
rt.def("/obj/item/toy/crayon/white/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "whitecrayonpowder", 1]);
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

// crayons.dm:482
rt.def("/obj/item/toy/crayon/mime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "invisiblecrayonpowder", 1]);
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

// crayons.dm:489
rt.def("/obj/item/toy/crayon/rainbow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nutriment", 1, "colorful_reagent", 1]);
	return f.dot;
});

// crayons.dm:495
rt.def("/obj/item/toy/crayon/rainbow/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	this.paint_color = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(5441, "/obj/item/weapon/storage/crayons", "/obj/item/weapon/storage", {
	name: "box of crayons",
	desc: "A box of crayons for all your rune drawing needs.",
	icon: rt.rsc("icons/obj/crayons.dmi"),
	icon_state: "crayonbox",
	w_class: 2,
	storage_slots: 7,
	can_hold: null,
});

// crayons.dm:509
rt.def("/obj/item/weapon/storage/crayons/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/toy/crayon"));
	return f.dot;
});

// crayons.dm:514
rt.def("/obj/item/weapon/storage/crayons/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/toy/crayon/red"), this);
	yield* new_(T("/obj/item/toy/crayon/orange"), this);
	yield* new_(T("/obj/item/toy/crayon/yellow"), this);
	yield* new_(T("/obj/item/toy/crayon/green"), this);
	yield* new_(T("/obj/item/toy/crayon/blue"), this);
	yield* new_(T("/obj/item/toy/crayon/purple"), this);
	yield* new_(T("/obj/item/toy/crayon/black"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

// crayons.dm:525
rt.def("/obj/item/weapon/storage/crayons/proc/update_icon", function update_icon(f: Frame) {
	let crayon: Value = null;
	this.cut_overlays();
	for (crayon of each(this.contents, T("/obj/item/toy/crayon"))) {
		this.add_overlay(mutable_appearance(rt.rsc("icons/obj/crayons.dmi"), crayon.item_color));
	}
	return f.dot;
});

// crayons.dm:530
rt.def("/obj/item/weapon/storage/crayons/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(W, T("/obj/item/toy/crayon"))) {
		const item_color_2 = (C = W).item_color;
		if (item_color_2 === "mime") {
			to_chat(f.usr, "This crayon is too sad to be contained in this box.");
			return f.dot;
		} else if (item_color_2 === "rainbow") {
			to_chat(f.usr, "This crayon is too powerful to be contained in this box.");
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/toy/crayon/spraycan"))) {
			to_chat(user, "Spraycans are not crayons.");
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// crayons.dm:565
rt.def("/obj/item/toy/crayon/spraycan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.validSurfaces = list(T("/turf/open/floor"), T("/turf/closed/wall"));
	this.reagent_contents = rt.alist(f, ["welding_fuel", 1, "ethanol", 1]);
	return f.dot;
});

// crayons.dm:572
rt.def("/obj/item/toy/crayon/spraycan/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let used: Value = null, fraction: Value = null;
	let H: Value = user;
	if (this.is_capped || !this.actually_paints) {
		user.visible_message(`<span class='suicide'>${user} shakes up ${this} with a rattle and lifts it to ${user.p_their()} mouth, but nothing happens!</span>`);
		yield* user.say("MEDIOCRE!!");
		return 16;
	} else {
		user.visible_message(`<span class='suicide'>${user} shakes up ${this} with a rattle and lifts it to ${user.p_their()} mouth, spraying paint across ${user.p_their()} teeth!</span>`);
		yield* user.say("WITNESS ME!!");
		if (this.pre_noise || this.post_noise) {
			playsound(this.loc, rt.rsc("sound/effects/spray.ogg"), 5, 1, 5);
		}
		if (this.can_change_colour) {
			this.paint_color = "#C0C0C0";
		}
		yield* this.update_icon();
		if (this.actually_paints) {
			H.lip_style = "spray_face";
			H.lip_color = this.paint_color;
			yield* H.update_body();
		}
		used = (yield* this.use_charges(10));
		fraction = min(1, used / this.reagents.maximum_volume);
		yield* this.reagents.reaction(user, VAPOR, fraction * this.volume_multiplier);
		yield* this.reagents.trans_to(user, used, this.volume_multiplier);
		return 8;
	}
}, true);

// crayons.dm:597
rt.def("/obj/item/toy/crayon/spraycan/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!this.paint_color) {
		this.paint_color = pick("#DA0000", "#FF9300", "#FFF200", "#A8E61D", "#00B7EF", "#DA00FF");
	}
	yield* this.refill();
	yield* this.update_icon();
	return f.dot;
}, true);

// crayons.dm:607
rt.def("/obj/item/toy/crayon/spraycan/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.charges_left) {
		to_chat(user, `It has ${this.charges_left} uses left.`);
	} else {
		to_chat(user, "It is empty.");
	}
	return f.dot;
}, false);

// crayons.dm:614
rt.def("/obj/item/toy/crayon/spraycan/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let C: Value = null, H: Value = null, fraction: Value = null, fraction_0: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (this.is_capped) {
		to_chat(user, "<span class='warning'>Take the cap off first!</span>");
		return f.dot;
	}
	if (yield* this.check_empty(user)) {
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon"))) {
		if (this.pre_noise || this.post_noise) {
			playsound(user.loc, rt.rsc("sound/effects/spray.ogg"), 25, 1, 5);
		}
		C = target;
		user.visible_message(`<span class='danger'>${user} sprays ${this} into the face of ${target}!</span>`);
		to_chat(target, `<span class='userdanger'>${user} sprays ${this} into your face!</span>`);
		if (C.client) {
			yield* C.blur_eyes(3);
			yield* C.blind_eyes(1);
		}
		if (C.get_eye_protection() <= 0) {
			C.confused = max(C.confused, 3);
			yield* C.Knockdown(60);
		}
		if (rt.istype(C, T("/mob/living/carbon/human")) && this.actually_paints) {
			(H = C).lip_style = "spray_face";
			H.lip_color = this.paint_color;
			yield* H.update_body();
		}
		f.dot = (yield* this.use_charges(10));
		fraction = min(1, f.dot / this.reagents.maximum_volume);
		yield* this.reagents.reaction(C, VAPOR, fraction * this.volume_multiplier);
		return f.dot;
	}
	if (rt.istype(target, T("/obj/structure/window"))) {
		if (this.actually_paints) {
			target.add_atom_colour(this.paint_color, WASHABLE_COLOUR_PRIORITY);
			if (color_hex2num(this.paint_color) < 255) {
				target.set_opacity(255);
			} else {
				target.set_opacity(rt.initial(f, target, "opacity"));
			}
		}
		f.dot = (yield* this.use_charges(2));
		fraction_0 = min(1, f.dot / this.reagents.maximum_volume);
		yield* this.reagents.reaction(target, TOUCH, fraction_0 * this.volume_multiplier);
		yield* this.reagents.trans_to(target, f.dot, this.volume_multiplier);
		if (this.pre_noise || this.post_noise) {
			playsound(user.loc, rt.rsc("sound/effects/spray.ogg"), 5, 1, 5);
		}
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// crayons.dm:670
rt.def("/obj/item/toy/crayon/spraycan/proc/update_icon", function update_icon(f: Frame) {
	let spray_overlay: Value = null;
	let $0: any, $1: any;
	this.icon_state = this.is_capped ? this.icon_capped : this.icon_uncapped;
	if (!this.use_overlays) return f.dot;
	this.cut_overlays();
	$0 = rt.rsc("icons/obj/crayons.dmi");
	if (this.is_capped) {
		$1 = "spraycan_cap_colors";
	} else {
		$1 = "spraycan_colors";
	}
	(spray_overlay = mutable_appearance($0, `${$1}`)).color = this.paint_color;
	this.add_overlay(spray_overlay);
	return f.dot;
});

rt.type(9664, "/obj/item/toy/crayon/spraycan/gang", "/obj/item/toy/crayon/spraycan", {
	charges: 20,
	gang: 1,
	pre_noise: 0,
	post_noise: 1,
});

// crayons.dm:686
rt.def("/obj/item/toy/crayon/spraycan/gang/proc/New", function* New(f: Frame, loc: Value, G: Value) {
	yield* parent_proc();
	if (!G) return f.dot;
	this.paint_color = G.color_hex;
	yield* this.update_icon();
	return f.dot;
}, true);

// crayons.dm:692
rt.def("/obj/item/toy/crayon/spraycan/gang/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (!(user.mind && user.mind.gang_datum || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, "This spraycan has been specially modified for tagging territory.");
	return f.dot;
}, false);

rt.type(9665, "/obj/item/toy/crayon/spraycan/borg", "/obj/item/toy/crayon/spraycan", {
	charges: -1,
	name: "cyborg spraycan",
	desc: "A metallic container containing shiny synthesised paint.",
});

// crayons.dm:702
rt.def("/obj/item/toy/crayon/spraycan/borg/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let diff: Value = (yield* parent_proc());
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) {
		to_chat(user, "<span class='notice'>How did you get this?</span>");
		yield* qdel(this);
		return 0;
	}
	let borgy: Value = user;
	if (!diff) {
		return f.dot;
	}
	let cost: Value = diff * 25;
	if (!borgy.cell) return f.dot;
	yield* borgy.cell.use(cost);
	return f.dot;
}, true);

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

// crayons.dm:730
rt.def("/obj/item/toy/crayon/spraycan/hellcan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["clf3", 1]);
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

// crayons.dm:742
rt.def("/obj/item/toy/crayon/spraycan/lubecan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["lube", 1, "banana", 1]);

	this.validSurfaces = list(T("/turf/open/floor"));
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

// crayons.dm:759
rt.def("/obj/item/toy/crayon/spraycan/mimecan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_contents = rt.alist(f, ["nothing", 1, "mutetoxin", 1]);
	return f.dot;
});
