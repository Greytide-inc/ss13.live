// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/icecream_vat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract, fmt } = rt;


rt.type(10895, "/obj/machinery/icecream_vat", "/obj/machinery", {
	product_types: null,
	dispense_flavour: 1,
	flavour_name: "vanilla",
	anchored: 0,
	use_power: 0,
	container_type: 4096,
	name: "ice cream vat",
	desc: "Ding-aling ding dong. Get your Nanotrasen-approved ice cream!",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "icecream_vat",
	density: 1,
	layer: 2.9,
	obj_integrity: 300,
	max_integrity: 300,
});

// icecream_vat.dm:17
rt.def("/obj/machinery/icecream_vat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.product_types = list();
	return f.dot;
});

// icecream_vat.dm:25
rt.def("/obj/machinery/icecream_vat/proc/get_ingredient_list", function get_ingredient_list(f: Frame, type: Value) {
	if (type === ICECREAM_CHOCOLATE) {
		return list("milk", "ice", "cocoa");
	} else if (type === ICECREAM_STRAWBERRY) {
		return list("milk", "ice", "berryjuice");
	} else if (type === ICECREAM_BLUE) {
		return list("milk", "ice", "singulo");
	} else if (type === CONE_WAFFLE) {
		return list("flour", "sugar");
	} else if (type === CONE_CHOC) {
		return list("flour", "sugar", "cocoa");
	} else {
		return list("milk", "ice");
	}
});

// icecream_vat.dm:41
rt.def("/obj/machinery/icecream_vat/proc/get_flavour_name", function get_flavour_name(f: Frame, flavour_type: Value) {
	if (flavour_type === ICECREAM_CHOCOLATE) {
		return "chocolate";
	} else if (flavour_type === ICECREAM_STRAWBERRY) {
		return "strawberry";
	} else if (flavour_type === ICECREAM_BLUE) {
		return "blue";
	} else if (flavour_type === CONE_WAFFLE) {
		return "waffle";
	} else if (flavour_type === CONE_CHOC) {
		return "chocolate";
	} else {
		return "vanilla";
	}
});

// icecream_vat.dm:57
rt.def("/obj/machinery/icecream_vat/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	while (rt.len(f, this.product_types) < 6) {
		this.product_types.Add(5);
	}
	yield* this.create_reagents();
	this.reagents.set_reacting(0);
	yield* this.reagents.add_reagent("milk", 5);
	yield* this.reagents.add_reagent("flour", 5);
	yield* this.reagents.add_reagent("sugar", 5);
	yield* this.reagents.add_reagent("ice", 5);
	yield* this.reagents.add_reagent("cocoa", 5);
	yield* this.reagents.add_reagent("berryjuice", 5);
	yield* this.reagents.add_reagent("singulo", 5);
	return f.dot;
}, true);

// icecream_vat.dm:71
rt.def("/obj/machinery/icecream_vat/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// icecream_vat.dm:76
rt.def("/obj/machinery/icecream_vat/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, popup: Value = null;
	dat += "<b>ICE CREAM</b><br><div class='statusDisplay'>";
	dat += `<b>Dispensing: ${this.flavour_name} icecream </b> <br><br>`;
	dat += fmt("<b>Vanilla ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ scoops left. (Ingredients: milk, ice)<br>", [this, ICECREAM_VANILLA, this, ICECREAM_VANILLA, this, ICECREAM_VANILLA, rt.index(this.product_types, ICECREAM_VANILLA)]);
	dat += fmt("<b>Strawberry ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ dollops left. (Ingredients: milk, ice, berry juice)<br>", [this, ICECREAM_STRAWBERRY, this, ICECREAM_STRAWBERRY, this, ICECREAM_STRAWBERRY, rt.index(this.product_types, ICECREAM_STRAWBERRY)]);
	dat += fmt("<b>Chocolate ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ dollops left. (Ingredients: milk, ice, coco powder)<br>", [this, ICECREAM_CHOCOLATE, this, ICECREAM_CHOCOLATE, this, ICECREAM_CHOCOLATE, rt.index(this.product_types, ICECREAM_CHOCOLATE)]);
	dat += fmt("<b>Blue ice cream:</b> <a href='?src=＃;select=＀'><b>Select</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ dollops left. (Ingredients: milk, ice, singulo)<br></div>", [this, ICECREAM_BLUE, this, ICECREAM_BLUE, this, ICECREAM_BLUE, rt.index(this.product_types, ICECREAM_BLUE)]);
	dat += "<br><b>CONES</b><br><div class='statusDisplay'>";
	dat += fmt("<b>Waffle cones:</b> <a href='?src=＃;cone=＀'><b>Dispense</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ cones left. (Ingredients: flour, sugar)<br>", [this, CONE_WAFFLE, this, CONE_WAFFLE, this, CONE_WAFFLE, rt.index(this.product_types, CONE_WAFFLE)]);
	dat += fmt("<b>Chocolate cones:</b> <a href='?src=＃;cone=＀'><b>Dispense</b></a> <a href='?src=＃;make=＀;amount=1'><b>Make</b></a> <a href='?src=＃;make=＀;amount=5'><b>x5</b></a> ＀ cones left. (Ingredients: flour, sugar, coco powder)<br></div>", [this, CONE_CHOC, this, CONE_CHOC, this, CONE_CHOC, rt.index(this.product_types, CONE_CHOC)]);
	dat += "<br>";
	dat += "<b>VAT CONTENT</b><br>";
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		dat += `${R.name}: ${R.volume}`;
		dat += fmt("<A href='?src=＃;disposeI=＀'>Purge</A><BR>", [this, R.id]);
	}
	dat += fmt("<a href='?src=＃;refresh=1'>Refresh</a> <a href='?src=＃;close=1'>Close</a>", [this, this]);
	(popup = (yield* new_(T("/datum/browser"), user, "icecreamvat", "Icecream Vat", 700, 500, this))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// icecream_vat.dm:97
rt.def("/obj/machinery/icecream_vat/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let I: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/icecream"))) {
		if (!(I = O).ice_creamed) {
			if (rt.index(this.product_types, this.dispense_flavour) > 0) {
				this.visible_message(`${bicon(this)} <span class='info'>${user} scoops delicious ${this.flavour_name} ice cream into ${I}.</span>`);
				(rt.modAt(this.product_types, this.dispense_flavour, 1, subtract));
				yield* I.add_ice_cream(this.flavour_name);
				if (I.reagents.total_volume < 10) {
					yield* I.reagents.add_reagent("sugar", 10 - I.reagents.total_volume);
				}
			} else {
				to_chat(user, "<span class='warning'>There is not enough ice cream left!</span>");
			}
		} else {
			to_chat(user, `<span class='notice'>${O} already has ice cream in it.</span>`);
		}
		return 1;
	} else if (O.is_open_container()) {
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// icecream_vat.dm:119
rt.def("/obj/machinery/icecream_vat/proc/make", function* make(f: Frame, user: Value, make_type: Value, amount: Value) {
	let R: Value = null, flavour: Value = null;
	for (R of each(this.get_ingredient_list(make_type))) {
		if (this.reagents.has_reagent(R, amount)) {
			continue;
		}
		amount = 0;
		break;
	}
	if (amount) {
		R = null;
		for (R of each(this.get_ingredient_list(make_type))) {
			yield* this.reagents.remove_reagent(R, amount);
		}
		rt.modAt(this.product_types, make_type, amount, add);
		flavour = this.get_flavour_name(make_type);
		if (make_type > 4) {
			this.visible_message(`<span class='info'>${user} cooks up some ${flavour} cones.</span>`);
		} else {
			this.visible_message(`<span class='info'>${user} whips up some ${flavour} icecream.</span>`);
		}
	} else {
		to_chat(user, "<span class='warning'>You don't have the ingredients to make this!</span>");
	}
	return f.dot;
}, true);

// icecream_vat.dm:137
rt.def("/obj/machinery/icecream_vat/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let dispense_cone: Value = null, cone_name: Value = null, I: Value = null, amount: Value = null, C: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "select")) {
		this.dispense_flavour = text2num(rt.at(href_list, "select"));
		this.flavour_name = this.get_flavour_name(this.dispense_flavour);
		this.visible_message(`<span class='notice'>${f.usr} sets ${this} to dispense ${this.flavour_name} flavoured ice cream.</span>`);
	}
	if (rt.at(href_list, "cone")) {
		dispense_cone = text2num(rt.at(href_list, "cone"));
		cone_name = this.get_flavour_name(dispense_cone);
		if (rt.index(this.product_types, dispense_cone) >= 1) {
			(rt.modAt(this.product_types, dispense_cone, 1, subtract));
			yield* (I = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/icecream"), this.loc))).set_cone_type(cone_name);
			this.visible_message(`<span class='info'>${f.usr} dispenses a crunchy ${cone_name} cone from ${this}.</span>`);
		} else {
			to_chat(f.usr, `<span class='warning'>There are no ${cone_name} cones left!</span>`);
		}
	}
	if (rt.at(href_list, "make")) {
		amount = text2num(rt.at(href_list, "amount"));
		C = text2num(rt.at(href_list, "make"));
		yield* this.make(f.usr, C, amount);
	}
	if (rt.at(href_list, "disposeI")) {
		yield* this.reagents.del_reagent(rt.at(href_list, "disposeI"));
	}
	yield* this.updateDialog();
	if (rt.at(href_list, "refresh")) {
		yield* this.updateDialog();
	}
	if (rt.at(href_list, "close")) {
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=icecreamvat"], false);
	}
	return f.dot;
}, true);

rt.type(6253, "/obj/item/weapon/reagent_containers/food/snacks/icecream", "/obj/item/weapon/reagent_containers/food/snacks", {
	ice_creamed: 0,
	cone_type: null,
	bitesize: 3,
	name: "ice cream cone",
	desc: "Delicious waffle cone, but no ice cream.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "icecream_cone_waffle",
});

// icecream_vat.dm:183
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.create_reagents(20);
	yield* this.reagents.add_reagent("nutriment", 4);
	return f.dot;
}, true);

// icecream_vat.dm:188
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/set_cone_type", function* set_cone_type(f: Frame, cone_name: Value) {
	this.cone_type = cone_name;
	this.icon_state = `icecream_cone_${cone_name}`;
	if (this.cone_type === "waffle") {
		yield* this.reagents.add_reagent("nutriment", 1);
	} else if (this.cone_type === "chocolate") {
		yield* this.reagents.add_reagent("cocoa", 1);
	}
	this.desc = `Delicious ${cone_name} cone, but no ice cream.`;
	return f.dot;
}, true);

// icecream_vat.dm:200
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/add_ice_cream", function* add_ice_cream(f: Frame, flavour_name: Value) {
	this.name = `${flavour_name} icecream`;
	this.add_overlay(`icecream_${flavour_name}`);
	if (flavour_name === "vanilla") {
		this.desc = `A delicious ${this.cone_type} cone filled with vanilla ice cream. All the other ice creams take content from it.`;
	} else if (flavour_name === "chocolate") {
		this.desc = `A delicious ${this.cone_type} cone filled with chocolate ice cream. Surprisingly, made with real cocoa.`;
		yield* this.reagents.add_reagent("cocoa", 2);
	} else if (flavour_name === "strawberry") {
		this.desc = `A delicious ${this.cone_type} cone filled with strawberry ice cream. Definitely not made with real strawberries.`;
		yield* this.reagents.add_reagent("berryjuice", 2);
	} else if (flavour_name === "blue") {
		this.desc = `A delicious ${this.cone_type} cone filled with blue ice cream. Made with real... blue?`;
		yield* this.reagents.add_reagent("singulo", 2);
	} else if (flavour_name === "mob") {
		this.desc = `A suspicious ${this.cone_type} cone filled with bright red ice cream. That's probably not strawberry...`;
		yield* this.reagents.add_reagent("liquidgibs", 2);
	}
	this.ice_creamed = 1;
	return f.dot;
}, true);

// icecream_vat.dm:220
rt.def("/obj/item/weapon/reagent_containers/food/snacks/icecream/proc/add_mob_flavor", function* add_mob_flavor(f: Frame, M: Value) {
	yield* this.add_ice_cream("mob");
	this.name = `${M.name} icecream`;
	return f.dot;
}, true);

// icecream_vat.dm:224
rt.def("/obj/machinery/icecream_vat/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= ICECREAM_VANILLA;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, ICECREAM_BLUE);
	}
	yield* qdel(this);
	return f.dot;
}, true);
