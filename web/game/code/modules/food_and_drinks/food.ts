// Based on /tg/station's code/modules/food_and_drinks/food.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5800, "/obj/item/weapon/reagent_containers/food", "/obj/item/weapon/reagent_containers", {
	container_type: 1024,
	possible_transfer_amounts: null,
	volume: 50,
	resistance_flags: 4,
});

// food.dm:5
rt.def("/obj/item/weapon/reagent_containers/food/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// food.dm:11
rt.def("/obj/item/weapon/reagent_containers/food/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);
