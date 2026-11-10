// Based on /tg/station's code/game/machinery/Sleeper.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(10824, "/obj/machinery/sleeper", "/obj/machinery", {
	efficiency: 1,
	min_health: -25,
	available_chems: null,
	controls_inside: 0,
	possible_chems: null,
	chem_buttons: null,
	scrambled_chems: 0,
	anchored: 1,
	state_open: 1,
	name: "sleeper",
	desc: "An enclosed machine used to stabilize and heal patients.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	density: 0,
});

// Sleeper.dm:20
rt.def("/obj/machinery/sleeper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_chems = list(list("epinephrine", "morphine", "salbutamol", "bicaridine", "kelotane"), list("oculine", "inacusiate"), list("antitoxin", "mutadone", "mannitol", "pen_acid"), list("omnizine"));
	return f.dot;
});

// Sleeper.dm:30
rt.def("/obj/machinery/sleeper/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/sleeper"), null))).apply_default_parts(this);
	yield* this.update_icon();
	this.reset_chem_buttons();
	return f.dot;
}, true);

rt.type(6729, "/obj/item/weapon/circuitboard/machine/sleeper", "/obj/item/weapon/circuitboard/machine", {
	name: "Sleeper (Machine Board)",
	build_path: rt.typePath("/obj/machinery/sleeper"),
	origin_tech: "programming=3;biotech=2;engineering=3",
	req_components: null,
});

// Sleeper.dm:40
rt.def("/obj/item/weapon/circuitboard/machine/sleeper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/stack/sheet/glass"), 1]);
	return f.dot;
});

// Sleeper.dm:49
rt.def("/obj/machinery/sleeper/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, B: Value = null, I: Value = null, M: Value = null, i: Value = null;
	let $e: any;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		E += B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		I += M.rating;
	}
	this.efficiency = rt.initial(f, this, "efficiency") * E;
	this.min_health = rt.initial(f, this, "min_health") * E;
	this.available_chems = list();
	rt.forRange(f, 0, 1, I, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(rt.modSrcVar(f, "available_chems", rt.index(this.possible_chems, i), rt.bitOr));
	}
	rt.endFor(f, 0);
	this.reset_chem_buttons();
	return f.dot;
});

// Sleeper.dm:63
rt.def("/obj/machinery/sleeper/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = rt.initial(f, this, "icon_state");
	if (!this.state_open) return f.dot;
	this.icon_state += "-open";
	return f.dot;
});

// Sleeper.dm:68
rt.def("/obj/machinery/sleeper/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	this.visible_message(`<span class='notice'>${this.occupant} emerges from ${this}!</span>`, `<span class='notice'>You climb out of ${this}!</span>`);
	yield* this.open_machine();
	return f.dot;
}, true);

// Sleeper.dm:73
rt.def("/obj/machinery/sleeper/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.container_resist(user);
	return f.dot;
}, true);

// Sleeper.dm:76
rt.def("/obj/machinery/sleeper/proc/open_machine", function* open_machine(f: Frame) {
	if (!(!this.state_open && !this.panel_open)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// Sleeper.dm:80
rt.def("/obj/machinery/sleeper/proc/close_machine", function* close_machine(f: Frame, user: Value) {
	let mob_occupant: Value = null;
	if (!((user === null || rt.istype(user, T("/mob"))) && this.state_open && !this.panel_open)) return f.dot;
	yield* parent_proc(user);
	if (!((mob_occupant = this.occupant) && mob_occupant.stat != 2)) return f.dot;
	to_chat(this.occupant, "<span class='notice'><b>You feel cool air surround you. You go numb as your senses turn inward.</b></span>");
	return f.dot;
}, true);

// Sleeper.dm:87
rt.def("/obj/machinery/sleeper/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.is_operational() && this.occupant) {
		yield* this.open_machine();
	}
	yield* parent_proc(severity);
	return f.dot;
}, true);

// Sleeper.dm:92
rt.def("/obj/machinery/sleeper/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (user.stat || user.lying || !this.Adjacent(user) || !user.Adjacent(target) || !rt.istype(target, T("/mob/living/carbon")) || !user.IsAdvancedToolUser()) {
		return f.dot;
	}
	yield* this.close_machine(target);
	return f.dot;
}, true);

// Sleeper.dm:97
rt.def("/obj/machinery/sleeper/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!this.state_open && !this.occupant) {
		if (this.default_deconstruction_screwdriver(user, `${rt.initial(f, this, "icon_state")}-o`, rt.initial(f, this, "icon_state"), I)) {
			return f.dot;
		}
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// Sleeper.dm:113
rt.def("/obj/machinery/sleeper/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.notcontained_state;
	if (this.controls_inside && state == GLOB.notcontained_state) {
		state = GLOB.default_state;
	}
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "sleeper", this.name, 375, 550, master_ui, state))).open();
	return f.dot;
}, true);

// Sleeper.dm:122
rt.def("/obj/machinery/sleeper/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, chem: Value = null, R: Value = null, mob_occupant: Value = null;
	let $e: any;
	let $0: any = (data = list());
	let $1: any = "occupied";
	rt.setAt($0, $1, this.occupant ? 1 : 0);
	rt.setAt(data, "open", this.state_open);
	rt.setAt(data, "chems", list());
	for (chem of each(this.available_chems)) {
		R = rt.index(GLOB.chemical_reagents_list, chem);
		rt.modAt(data, "chems", list(rt.alist(f, ["name", R.name, "id", R.id, "allowed", this.chem_allowed(chem)])), add);
	}
	rt.setAt(data, "occupant", list());
	if (mob_occupant = this.occupant) {
		rt.setAt(rt.at(data, "occupant"), "name", mob_occupant.name);
		rt.setAt(rt.at(data, "occupant"), "stat", mob_occupant.stat);
		rt.setAt(rt.at(data, "occupant"), "health", mob_occupant.health);
		rt.setAt(rt.at(data, "occupant"), "maxHealth", mob_occupant.maxHealth);
		rt.setAt(rt.at(data, "occupant"), "minHealth", -100);
		rt.setAt(rt.at(data, "occupant"), "bruteLoss", mob_occupant.getBruteLoss());
		rt.setAt(rt.at(data, "occupant"), "oxyLoss", mob_occupant.getOxyLoss());
		rt.setAt(rt.at(data, "occupant"), "toxLoss", mob_occupant.getToxLoss());
		rt.setAt(rt.at(data, "occupant"), "fireLoss", mob_occupant.getFireLoss());
		rt.setAt(rt.at(data, "occupant"), "cloneLoss", mob_occupant.getCloneLoss());
		rt.setAt(rt.at(data, "occupant"), "brainLoss", mob_occupant.getBrainLoss());
		rt.setAt(rt.at(data, "occupant"), "reagents", list());
		if (rt.len(f, this.occupant.reagents.reagent_list)) {
			R = null;
			for (R of each(mob_occupant.reagents.reagent_list, T("/datum/reagent"))) {
				rt.modAt(rt.at(data, "occupant"), "reagents", list(rt.alist(f, ["name", R.name, "volume", R.volume])), add);
			}
		}
	}
	return data;
});

// Sleeper.dm:152
rt.def("/obj/machinery/sleeper/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let chem: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let mob_occupant: Value = this.occupant;
	if (action === "door") {
		if (this.state_open) {
			yield* this.close_machine();
		} else {
			yield* this.open_machine();
		}
		f.dot = 1;
	} else if (action === "inject") {
		chem = rt.at(params, "chem");
		if (!this.is_operational() || !mob_occupant) {
			return f.dot;
		}
		if (mob_occupant.health < this.min_health && chem != "epinephrine") {
			return f.dot;
		}
		if (!(yield* this.inject_chem(chem))) return f.dot;
		f.dot = 1;
		if (!(this.scrambled_chems && prob(5))) return f.dot;
		to_chat(f.usr, "<span class='warning'>Chem System Re-route detected, results may not be as expected!</span>");
	}
	return f.dot;
}, true);

// Sleeper.dm:175
rt.def("/obj/machinery/sleeper/proc/emag_act", function emag_act(f: Frame, user: Value) {
	this.scramble_chem_buttons();
	to_chat(user, "<span class='warning'>You scramble the sleepers user interface!</span>");
	return f.dot;
});

// Sleeper.dm:179
rt.def("/obj/machinery/sleeper/proc/inject_chem", function* inject_chem(f: Frame, chem: Value) {
	if (!(rt.isIn(f, chem, this.available_chems) && this.chem_allowed(chem))) return f.dot;
	yield* this.occupant.reagents.add_reagent(rt.index(this.chem_buttons, chem), 10);
	return 1;
}, true);

// Sleeper.dm:184
rt.def("/obj/machinery/sleeper/proc/chem_allowed", function chem_allowed(f: Frame, chem: Value) {
	let mob_occupant: Value = null;
	if (!(mob_occupant = this.occupant)) {
		return f.dot;
	}
	let amount: Value = (mob_occupant.reagents.get_reagent_amount(chem) + 10 <= 20 * this.efficiency ? 1 : 0);
	let occ_health: Value = ((mob_occupant.health > this.min_health ? 1 : 0) || (chem == "epinephrine" ? 1 : 0));
	return (amount && occ_health);
});

// Sleeper.dm:193
rt.def("/obj/machinery/sleeper/proc/reset_chem_buttons", function reset_chem_buttons(f: Frame) {
	let chem: Value = null;
	this.scrambled_chems = 0;
	if (!this.chem_buttons) {
		this.chem_buttons = list();
	}
	for (chem of each(this.available_chems)) {
		rt.setAt(this.chem_buttons, chem, chem);
	}
	return f.dot;
});

// Sleeper.dm:199
rt.def("/obj/machinery/sleeper/proc/scramble_chem_buttons", function scramble_chem_buttons(f: Frame) {
	let chem: Value = null;
	this.scrambled_chems = 1;
	let av_chem: Value = this.available_chems.Copy();
	for (chem of each(av_chem)) {
		rt.setAt(this.chem_buttons, chem, pick_n_take(av_chem));
	}
	return f.dot;
});
