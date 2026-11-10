// Based on /tg/station's code/modules/hydroponics/beekeeping/honeycomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6497, "/obj/item/weapon/reagent_containers/honeycomb", "/obj/item/weapon/reagent_containers", {
	honey_color: "",
	name: "honeycomb",
	desc: "A hexagonal mesh of honeycomb.",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "honeycomb",
	possible_transfer_amounts: null,
	spillable: 0,
	disease_amount: 0,
	volume: 10,
	amount_per_transfer_from_this: 0,
	list_reagents: null,
});

// honeycomb.dm:7
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	this.list_reagents = rt.alist(f, ["honey", 5]);
	return f.dot;
});

// honeycomb.dm:16
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(8, -8);
	this.pixel_y = rand(8, -8);
	yield* this.update_icon();
	return f.dot;
}, true);

// honeycomb.dm:23
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	let honey_overlay: Value = mutable_appearance(this.icon, "honey");
	if (this.honey_color) {
		honey_overlay.icon_state = "greyscale_honey";
		honey_overlay.color = this.honey_color;
	}
	this.add_overlay(honey_overlay);
	return f.dot;
});

// honeycomb.dm:32
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/set_reagent", function* set_reagent(f: Frame, reagent: Value) {
	let R: Value = null;
	if (rt.istype((R = rt.index(GLOB.chemical_reagents_list, reagent)), T("/datum/reagent"))) {
		this.name = `honeycomb (${R.name})`;
		this.honey_color = R.color;
		yield* this.reagents.add_reagent(R.id, 5);
	} else {
		this.honey_color = "";
	}
	yield* this.update_icon();
	return f.dot;
}, true);
