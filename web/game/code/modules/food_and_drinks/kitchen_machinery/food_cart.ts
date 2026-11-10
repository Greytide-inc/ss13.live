// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/food_cart.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10892, "/obj/machinery/food_cart", "/obj/machinery", {
	food_stored: 0,
	glasses: 0,
	portion: 10,
	selected_drink: null,
	stored_food: null,
	mixer: null,
	anchored: 0,
	use_power: 0,
	container_type: 4096,
	name: "food cart",
	desc: "New generation hot dog stand.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "foodcart",
	density: 1,
});

// food_cart.dm:17
rt.def("/obj/machinery/food_cart/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_food = list();
	return f.dot;
});

// food_cart.dm:22
rt.def("/obj/machinery/food_cart/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(LIQUID_CAPACIY);
	this.reagents.set_reacting(0);
	this.mixer = (yield* new_(T("/obj/item/weapon/reagent_containers"), this, MIXER_CAPACITY));
	this.mixer.name = "Mixer";
	return f.dot;
}, true);

// food_cart.dm:30
rt.def("/obj/machinery/food_cart/proc/Destroy", function* Destroy(f: Frame) {
	if (this.mixer) {
		yield* qdel(this.mixer);
		this.mixer = null;
	}
	return (yield* parent_proc());
}, true);

// food_cart.dm:35
rt.def("/obj/machinery/food_cart/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// food_cart.dm:40
rt.def("/obj/machinery/food_cart/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, V: Value = null, popup: Value = null;
	dat += "<br><b>STORED INGREDIENTS AND DRINKS</b><br><div class='statusDisplay'>";
	dat += `Remaining glasses: ${this.glasses}<br>`;
	dat += fmt("Portion: <a href='?src=＃;portion=1'>＀</a><br>", [this, this.portion]);
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		dat += `${R.name}: ${R.volume} `;
		dat += fmt("<a href='?src=＃;disposeI=＀'>Purge</a>", [this, R.id]);
		if (this.glasses > 0) {
			dat += fmt("<a href='?src=＃;pour=＀'>Pour in a glass</a>", [this, R.id]);
		}
		dat += fmt("<a href='?src=＃;mix=＀'>Add to the mixer</a><br>", [this, R.id]);
	}
	dat += "</div><br><b>MIXER CONTENTS</b><br><div class='statusDisplay'>";
	R = null;
	for (R of each(this.mixer.reagents.reagent_list, T("/datum/reagent"))) {
		dat += `${R.name}: ${R.volume} `;
		dat += fmt("<a href='?src=＃;transfer=＀'>Transfer back</a>", [this, R.id]);
		if (this.glasses > 0) {
			dat += fmt("<a href='?src=＃;m_pour=＀'>Pour in a glass</a>", [this, R.id]);
		}
		dat += "<br>";
	}
	dat += "</div><br><b>STORED FOOD</b><br><div class='statusDisplay'>";
	for (V of each(this.stored_food)) {
		if (rt.index(this.stored_food, V) > 0) {
			dat += fmt("<b>＀: ＀</b> <a href='?src=＃;dispense=＀'>Dispense</a><br>", [V, rt.index(this.stored_food, V), this, V]);
		}
	}
	dat += fmt("</div><br><a href='?src=＃;refresh=1'>Refresh</a> <a href='?src=＃;close=1'>Close</a>", [this, this]);
	(popup = (yield* new_(T("/datum/browser"), user, "foodcart", "Food Cart", 500, 350, this))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// food_cart.dm:67
rt.def("/obj/machinery/food_cart/proc/isFull", function isFull(f: Frame) {
	return (this.food_stored >= STORAGE_CAPACITY ? 1 : 0);
});

// food_cart.dm:70
rt.def("/obj/machinery/food_cart/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let DG: Value = null, S: Value = null, G: Value = null, _T: Value = null, S_1: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"))) {
		if (!(DG = O).reagents.total_volume) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* qdel(DG);
			this.glasses++;
			to_chat(user, `<span class='notice'>The ${this} accepts the drinking glass, sterilizing it.</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (this.isFull()) {
			to_chat(user, `<span class='warning'>The ${this} is at full capacity.</span>`);
		} else {
			S = O;
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			S.loc = this;
			if (rt.index(this.stored_food, sanitize(S.name))) {
				rt.incAt(this.stored_food, sanitize(S.name), 1, true);
			} else {
				rt.setAt(this.stored_food, sanitize(S.name), 1);
			}
		}
	} else if (rt.istype(O, T("/obj/item/stack/sheet/glass"))) {
		if ((G = O).get_amount() >= 1) {
			yield* G.use(1);
			this.glasses += 4;
			to_chat(user, `<span class='notice'>The ${this} accepts a sheet of glass.</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/storage/bag/tray"))) {
		_T = O;
		for (S_1 of each(_T.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
			if (this.isFull()) {
				to_chat(user, `<span class='warning'>The ${this} is at full capacity.</span>`);
				break;
			}
			yield* _T.remove_from_storage(S_1, this);
			if (rt.index(this.stored_food, sanitize(S_1.name))) {
				rt.incAt(this.stored_food, sanitize(S_1.name), 1, true);
			} else {
				rt.setAt(this.stored_food, sanitize(S_1.name), 1);
			}
		}
	} else if (O.is_open_container()) {
		return f.dot;
	} else {
		f.dot = (yield* parent_proc());
	}
	yield* this.updateDialog();
	return f.dot;
}, true);

// food_cart.dm:115
rt.def("/obj/machinery/food_cart/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let O: Value = null, DG: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "disposeI")) {
		yield* this.reagents.del_reagent(rt.at(href_list, "disposeI"));
	}
	if (rt.at(href_list, "dispense")) {
		if (rt.incAt(this.stored_food, rt.at(href_list, "dispense"), -1, true) <= 0) {
			rt.setAt(this.stored_food, rt.at(href_list, "dispense"), 0);
		} else {
			for (O of each(this.contents, T("/obj"))) {
				if (sanitize(O.name) == rt.at(href_list, "dispense")) {
					O.loc = this.loc;
					break;
				}
			}
		}
	}
	if (rt.at(href_list, "portion")) {
		this.portion = max(0, min((yield* g.op(f, "Prompt", [32], [null, null, null, "How much drink do you want to dispense per glass?", null])), 50));
	}
	if (rt.at(href_list, "pour") || rt.at(href_list, "m_pour")) {
		if (this.glasses-- <= 0) {
			to_chat(f.usr, "<span class='warning'>There are no glasses left!</span>");
			this.glasses = 0;
		} else {
			DG = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), this.loc));
			if (rt.at(href_list, "pour")) {
				yield* this.reagents.trans_id_to(DG, rt.at(href_list, "pour"), this.portion);
			}
			if (rt.at(href_list, "m_pour")) {
				yield* this.mixer.reagents.trans_id_to(DG, rt.at(href_list, "m_pour"), this.portion);
			}
		}
	}
	if (rt.at(href_list, "mix")) {
		if ((yield* this.reagents.trans_id_to(this.mixer, rt.at(href_list, "mix"), this.portion)) == 0) {
			to_chat(f.usr, `<span class='warning'>The ${this.mixer} is full!</span>`);
		}
	}
	if (rt.at(href_list, "transfer")) {
		if ((yield* this.mixer.reagents.trans_id_to(this, rt.at(href_list, "transfer"), this.portion)) == 0) {
			to_chat(f.usr, `<span class='warning'>The ${this} is full!</span>`);
		}
	}
	yield* this.updateDialog();
	if (rt.at(href_list, "close")) {
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=foodcart"], false);
	}
	return f.dot;
}, true);

// food_cart.dm:160
rt.def("/obj/machinery/food_cart/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 4);
	}
	yield* qdel(this);
	return f.dot;
}, true);
