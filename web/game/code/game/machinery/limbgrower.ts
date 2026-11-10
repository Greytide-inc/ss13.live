// Based on /tg/station's code/game/machinery/limbgrower.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// limbgrower.dm:38
rt.def("/obj/machinery/limbgrower/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* this.create_reagents(0);
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/limbgrower"), null))).apply_default_parts(this);
	this.files = (yield* new_(T("/datum/research/limbgrower"), this));
	return f.dot;
}, true);

rt.type(6724, "/obj/item/weapon/circuitboard/machine/limbgrower", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Limb Grower (Machine Board)",
	build_path: rt.typePath("/obj/machinery/limbgrower"),
	origin_tech: "programming=2;biotech=2",
});

// limbgrower.dm:48
rt.def("/obj/item/weapon/circuitboard/machine/limbgrower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/reagent_containers/glass/beaker"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// limbgrower.dm:54
rt.def("/obj/machinery/limbgrower/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	if (!this.is_operational()) {
		return f.dot;
	}
	let dat: Value = this.main_win(user);
	if (this.screen === LIMBGROWER_MAIN_MENU) {
		dat = this.main_win(user);
	} else if (this.screen === LIMBGROWER_CATEGORY_MENU) {
		dat = this.category_win(user, this.selected_category);
	} else if (this.screen === LIMBGROWER_CHEMICAL_MENU) {
		dat = this.chemical_win(user);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "Limb Grower", this.name, 400, 500))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// limbgrower.dm:72
rt.def("/obj/machinery/limbgrower/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	let G: Value = null;
	for (G of each(this.component_parts, T("/obj/item/weapon/reagent_containers/glass"))) {
		yield* this.reagents.trans_to(G, G.reagents.maximum_volume);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// limbgrower.dm:78
rt.def("/obj/machinery/limbgrower/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (this.busy) {
		to_chat(user, "<span class=\"alert\">The Limb Grower is busy. Please wait for completion of previous operation.</span>");
		return f.dot;
	}
	if (this.default_deconstruction_screwdriver(user, "limbgrower_panelopen", "limbgrower_idleoff", O)) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (this.panel_open && (yield* this.default_deconstruction_crowbar(O))) {
		return f.dot;
	}
	if (user.a_intent != "harm") return f.dot;
	return (yield* parent_proc());
}, true);

// limbgrower.dm:95
rt.def("/obj/machinery/limbgrower/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let synth_cost: Value = null, power: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.busy) {
		if (rt.at(href_list, "menu")) {
			this.screen = text2num(rt.at(href_list, "menu"));
		}
		if (rt.isIn(f, rt.at(href_list, "category"), this.categories)) { // tg 0fa8d14621: only real categories, the value is shown to everyone who looks
			this.selected_category = rt.at(href_list, "category");
		}
		if (rt.at(href_list, "disposeI")) {
			yield* this.reagents.del_reagent(rt.at(href_list, "disposeI"));
		}
		if (rt.at(href_list, "make")) {
			this.being_built = this.files.FindDesignByID(rt.at(href_list, "make"));
			if (!this.being_built) {
				return f.dot;
			}
			synth_cost = rt.index(this.being_built.reagents_list, "synthflesh") * this.prod_coeff;
			power = max(2000, synth_cost / 5);
			if (this.reagents.has_reagent("synthflesh", rt.index(this.being_built.reagents_list, "synthflesh") * this.prod_coeff)) {
				this.busy = 1;
				yield* this.use_power(power);
				flick("limbgrower_fill", this);
				this.icon_state = "limbgrower_idleon";
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/limbgrower/proc/build_item"))), 32 * this.prod_coeff);
			}
		}
	} else {
		to_chat(f.usr, "<span class=\"alert\">The limb grower is busy. Please wait for completion of previous operation.</span>");
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// limbgrower.dm:133
rt.def("/obj/machinery/limbgrower/proc/build_item", function* build_item(f: Frame) {
	let buildpath: Value = null;
	if (this.reagents.has_reagent("synthflesh", rt.index(this.being_built.reagents_list, "synthflesh") * this.prod_coeff)) {
		yield* this.reagents.remove_reagent("synthflesh", rt.index(this.being_built.reagents_list, "synthflesh") * this.prod_coeff);
		if (ispath((buildpath = this.being_built.build_path), T("/obj/item/bodypart"))) {
			yield* this.build_limb(buildpath);
		} else {
			yield* new_(buildpath, this.loc);
		}
	} else {
		this.visible_message("<span class=\"error\"> Something went very wrong and there isnt enough synthflesh anymore!</span>");
	}
	this.busy = 0;
	flick("limbgrower_unfill", this);
	this.icon_state = "limbgrower_idleoff";
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// limbgrower.dm:151
rt.def("/obj/machinery/limbgrower/proc/build_limb", function* build_limb(f: Frame, buildpath: Value) {
	let limb: Value = (yield* new_(buildpath, this.loc));
	if (this.selected_category == "human" || this.selected_category == "lizard") {
		limb.icon = rt.rsc("icons/mob/human_parts_greyscale.dmi");
	} else {
		limb.icon = rt.rsc("icons/mob/human_parts.dmi");
	}
	limb.icon_state = `${this.selected_category}_${limb.body_zone}`;
	limb.name = `Synthetic ${this.selected_category} ${parse_zone(limb.body_zone)}`;
	limb.desc = `A synthetic ${this.selected_category} limb that will morph on its first use in surgery. This one is for the ${parse_zone(limb.body_zone)}`;
	limb.species_id = this.selected_category;
	limb.should_draw_greyscale = 1;
	limb.update_icon_dropped();
	return f.dot;
}, true);

// limbgrower.dm:165
rt.def("/obj/machinery/limbgrower/proc/RefreshParts", function* RefreshParts(f: Frame) {
	let G: Value = null, M: Value = null;
	this.reagents.maximum_volume = 0;
	for (G of each(this.component_parts, T("/obj/item/weapon/reagent_containers/glass"))) {
		this.reagents.maximum_volume += G.volume;
		yield* G.reagents.trans_to(this, G.reagents.total_volume);
	}
	let _T: Value = 1.2;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		_T -= M.rating * 0.2;
	}
	this.prod_coeff = min(1, max(0, _T));
	return f.dot;
}, true);

// limbgrower.dm:175
rt.def("/obj/machinery/limbgrower/proc/main_win", function main_win(f: Frame, user: Value) {
	let C: Value = null;
	let dat: Value = "<div class='statusDisplay'><h3>Limb Grower Menu:</h3><br>";
	dat += fmt("<A href='?src=＃;menu=＀'>Chemical Storage</A>", [this, LIMBGROWER_CHEMICAL_MENU]);
	dat += this.materials_printout();
	dat += "<table style='width:100%' align='center'><tr>";
	for (C of each(this.categories)) {
		if (C == "special" && !this.emag) {
			continue;
		}
		dat += fmt("<td><A href='?src=＃;category=＀;menu=＀'>＀</A></td>", [this, C, LIMBGROWER_CATEGORY_MENU, C]);
		dat += "</tr><tr>";
	}
	return (dat += "</tr></table></div>");
});

// limbgrower.dm:192
rt.def("/obj/machinery/limbgrower/proc/category_win", function category_win(f: Frame, user: Value, selected_category: Value) {
	let v: Value = null, D: Value = null;
	let dat: Value = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [this, LIMBGROWER_MAIN_MENU]);
	dat += `<div class='statusDisplay'><h3>Browsing ${selected_category}:</h3><br>`;
	dat += this.materials_printout();
	for (v of each(this.files.known_designs)) {
		D = rt.index(this.files.known_designs, v);
		if (!rt.isIn(f, selected_category, D.category)) {
			continue;
		}
		if (this.disabled || !this.can_build(D)) {
			dat += `<span class='linkOff'>${D.name}</span>`;
		} else {
			dat += fmt("<a href='?src=＃;make=＀;multiplier=1'>＀</a>", [this, D.id, D.name]);
		}
		dat += `${this.get_design_cost(D)}<br>`;
	}
	return (dat += "</div>");
});

// limbgrower.dm:211
rt.def("/obj/machinery/limbgrower/proc/chemical_win", function chemical_win(f: Frame, user: Value) {
	let R: Value = null;
	let dat: Value = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [this, LIMBGROWER_MAIN_MENU]);
	dat += "<div class='statusDisplay'><h3>Browsing Chemical Storage:</h3><br>";
	dat += this.materials_printout();
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		dat += `${R.name}: ${R.volume}`;
		dat += fmt("<A href='?src=＃;disposeI=＀'>Purge</A><BR>", [this, R.id]);
	}
	return (dat += "</div>");
});

// limbgrower.dm:223
rt.def("/obj/machinery/limbgrower/proc/materials_printout", function materials_printout(f: Frame) {
	let dat: Value = null;
	return (dat = `<b>Total amount:></b> ${this.reagents.total_volume} / ${this.reagents.maximum_volume} cm<sup>3</sup><br>`);
});

// limbgrower.dm:227
rt.def("/obj/machinery/limbgrower/proc/can_build", function can_build(f: Frame, D: Value) {
	return this.reagents.has_reagent("synthflesh", rt.index(D.reagents_list, "synthflesh") * this.prod_coeff);
});

// limbgrower.dm:231
rt.def("/obj/machinery/limbgrower/proc/get_design_cost", function get_design_cost(f: Frame, D: Value) {
	let dat: Value = null;
	if (rt.index(D.reagents_list, "synthflesh")) {
		dat += `${rt.index(D.reagents_list, "synthflesh") * this.prod_coeff} Synthetic flesh `;
	}
	return dat;
});

// limbgrower.dm:236
rt.def("/obj/machinery/limbgrower/proc/emag_act", function emag_act(f: Frame, user: Value) {
	let D: Value = null;
	if (this.emag == 1) {
		return f.dot;
	}
	for (D of each(this.files.possible_designs, T("/datum/design"))) {
		if (rt.bitAnd(D.build_type, LIMBGROWER) && rt.isIn(f, "special", D.category)) {
			this.files.AddDesign2Known(D);
		}
	}
	to_chat(user, "A warning flashes onto the screen, stating that safety overrides have been deactivated");
	this.emag = 1;
	return f.dot;
});
