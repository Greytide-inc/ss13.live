// Based on /tg/station's code/modules/food_and_drinks/drinks/drinks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5801, "/obj/item/weapon/reagent_containers/food/drinks", "/obj/item/weapon/reagent_containers/food", {
	gulp_size: 5,
	container_type: 4096,
	name: "drink",
	desc: "yummy",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: null,
	possible_transfer_amounts: null,
	volume: 50,
	resistance_flags: 0,
});

// drinks.dm:16
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

// drinks.dm:21
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (this.gulp_size < 5) {
		this.gulp_size = 5;
	} else {
		this.gulp_size = max(round(this.reagents.total_volume / 5), 5);
	}
	return f.dot;
});

// drinks.dm:26
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	if (!this.reagents || !this.reagents.total_volume) {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
		return 0;
	}
	if (!this.canconsume(M, user)) {
		return 0;
	}
	if (!this.is_open_container()) {
		to_chat(user, `<span class='warning'>${this}'s lid hasn't been opened!</span>`);
		return 0;
	}
	if (M == user) {
		to_chat(M, `<span class='notice'>You swallow a gulp of ${this}.</span>`);
	} else {
		M.visible_message(`<span class='danger'>${user} attempts to feed the contents of ${this} to ${M}.</span>`, `<span class='userdanger'>${user} attempts to feed the contents of ${this} to ${M}.</span>`);
		if (!(yield* do_mob(user, M))) {
			return f.dot;
		}
		if (!this.reagents || !this.reagents.total_volume) {
			return f.dot;
		}
		M.visible_message(`<span class='danger'>${user} feeds the contents of ${this} to ${M}.</span>`, `<span class='userdanger'>${user} feeds the contents of ${this} to ${M}.</span>`);
		add_logs(user, M, "fed", this.reagentlist(this));
	}
	let fraction: Value = min(this.gulp_size / this.reagents.total_volume, 1);
	yield* this.reagents.reaction(M, INGEST, fraction);
	yield* this.reagents.trans_to(M, this.gulp_size);
	playsound(M.loc, rt.rsc("sound/items/drink.ogg"), rand(10, 50), 1);
	return 1;
}, true);

// drinks.dm:55
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null, refill: Value = null, trans_1: Value = null, bro: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/structure/reagent_dispensers"))) {
		if (!this.is_open_container()) {
			to_chat(user, `<span class='warning'>${target}'s tab isn't open!</span>`);
			return f.dot;
		}
		if (!target.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${target} is empty.</span>`);
			return f.dot;
		}
		if (this.reagents.total_volume >= this.reagents.maximum_volume) {
			to_chat(user, `<span class='warning'>${this} is full.</span>`);
			return f.dot;
		}
		trans = (yield* target.reagents.trans_to(this, this.amount_per_transfer_from_this));
		to_chat(user, `<span class='notice'>You fill ${this} with ${trans} units of the contents of ${target}.</span>`);
	} else {
		if (!target.is_open_container()) return f.dot;
		if (!this.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${this} is empty.</span>`);
			return f.dot;
		}
		if (target.reagents.total_volume >= target.reagents.maximum_volume) {
			to_chat(user, `<span class='warning'>${target} is full.</span>`);
			return f.dot;
		}
		refill = this.reagents.get_master_reagent_id();
		trans_1 = (yield* this.reagents.trans_to(target, this.amount_per_transfer_from_this));
		to_chat(user, `<span class='notice'>You transfer ${trans_1} units of the solution to ${target}.</span>`);
		if (!rt.istype(user, T("/mob/living/silicon/robot"))) return f.dot;
		yield* (bro = user).cell.use(30);
		yield* addtimer((yield* new_(T("/datum/callback"), this.reagents, P("/datum/reagents/proc/add_reagent"), refill, trans_1)), 600);
	}
	return f.dot;
}, true);

// drinks.dm:91
rt.def("/obj/item/weapon/reagent_containers/food/drinks/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let added_heat: Value = null;
	if (I.is_hot()) {
		added_heat = I.is_hot() / 100;
		if (this.reagents) {
			this.reagents.chem_temp += added_heat;
			to_chat(user, `<span class='notice'>You heat ${this} with ${I}.</span>`);
			yield* this.reagents.handle_reactions();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5843, "/obj/item/weapon/reagent_containers/food/drinks/trophy", "/obj/item/weapon/reagent_containers/food/drinks", {
	flags: 64,
	container_type: 4096,
	name: "pewter cup",
	desc: "Everyone gets a trophy.",
	icon_state: "pewter_cup",
	w_class: 1,
	force: 1,
	throwforce: 1,
	amount_per_transfer_from_this: 5,
	materials: null,
	possible_transfer_amounts: null,
	volume: 5,
	spillable: 1,
	resistance_flags: 2,
});

// drinks.dm:117
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 100]);

	this.possible_transfer_amounts = list();
	return f.dot;
});

rt.type(5844, "/obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup", "/obj/item/weapon/reagent_containers/food/drinks/trophy", {
	name: "gold cup",
	desc: "You're winner!",
	icon_state: "golden_cup",
	w_class: 4,
	force: 14,
	throwforce: 10,
	amount_per_transfer_from_this: 20,
	materials: null,
	volume: 150,
});

// drinks.dm:133
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/gold_cup/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 1000]);
	return f.dot;
});

rt.type(5845, "/obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup", "/obj/item/weapon/reagent_containers/food/drinks/trophy", {
	name: "silver cup",
	desc: "Best loser!",
	icon_state: "silver_cup",
	w_class: 3,
	force: 10,
	throwforce: 8,
	amount_per_transfer_from_this: 15,
	materials: null,
	volume: 100,
});

// drinks.dm:144
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/silver_cup/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$silver", 800]);
	return f.dot;
});

rt.type(5846, "/obj/item/weapon/reagent_containers/food/drinks/trophy/bronze_cup", "/obj/item/weapon/reagent_containers/food/drinks/trophy", {
	name: "bronze cup",
	desc: "At least you ranked!",
	icon_state: "bronze_cup",
	w_class: 2,
	force: 5,
	throwforce: 4,
	amount_per_transfer_from_this: 10,
	materials: null,
	volume: 25,
});

// drinks.dm:156
rt.def("/obj/item/weapon/reagent_containers/food/drinks/trophy/bronze_cup/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 400]);
	return f.dot;
});

rt.type(5847, "/obj/item/weapon/reagent_containers/food/drinks/coffee", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Robust Coffee",
	desc: "Careful, the beverage you're about to enjoy is extremely hot.",
	icon_state: "coffee",
	list_reagents: null,
	spillable: 1,
});

// drinks.dm:168
rt.def("/obj/item/weapon/reagent_containers/food/drinks/coffee/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["coffee", 30]);
	return f.dot;
});

rt.type(5848, "/obj/item/weapon/reagent_containers/food/drinks/ice", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Ice Cup",
	desc: "Careful, cold ice, do not chew.",
	icon_state: "coffee",
	list_reagents: null,
	spillable: 1,
});

// drinks.dm:175
rt.def("/obj/item/weapon/reagent_containers/food/drinks/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ice", 30]);
	return f.dot;
});

rt.type(5849, "/obj/item/weapon/reagent_containers/food/drinks/mug", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "mug",
	desc: "A drink served in a classy mug.",
	icon_state: "tea",
	item_state: "coffee",
	spillable: 1,
});

// drinks.dm:186
rt.def("/obj/item/weapon/reagent_containers/food/drinks/mug/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (this.reagents.total_volume) {
		this.icon_state = "tea";
	} else {
		this.icon_state = "tea_empty";
	}
	return f.dot;
});

rt.type(5850, "/obj/item/weapon/reagent_containers/food/drinks/mug/tea", "/obj/item/weapon/reagent_containers/food/drinks/mug", {
	name: "Duke Purple Tea",
	desc: "An insult to Duke Purple is an insult to the Space Queen! Any proper gentleman will fight you, if you sully this tea.",
	list_reagents: null,
});

// drinks.dm:194
rt.def("/obj/item/weapon/reagent_containers/food/drinks/mug/tea/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["tea", 30]);
	return f.dot;
});

rt.type(5851, "/obj/item/weapon/reagent_containers/food/drinks/mug/coco", "/obj/item/weapon/reagent_containers/food/drinks/mug", {
	name: "Dutch Hot Coco",
	desc: "Made in Space South America.",
	list_reagents: null,
});

// drinks.dm:199
rt.def("/obj/item/weapon/reagent_containers/food/drinks/mug/coco/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["hot_coco", 30, "sugar", 5]);
	return f.dot;
});

rt.type(5852, "/obj/item/weapon/reagent_containers/food/drinks/dry_ramen", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Cup Ramen",
	desc: "Just add 10ml of water, self heats! A taste that reminds you of your school years.",
	icon_state: "ramen",
	list_reagents: null,
});

// drinks.dm:205
rt.def("/obj/item/weapon/reagent_containers/food/drinks/dry_ramen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["dry_ramen", 30]);
	return f.dot;
});

rt.type(5853, "/obj/item/weapon/reagent_containers/food/drinks/beer", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Space Beer",
	desc: "Beer. In space.",
	icon_state: "beer",
	list_reagents: null,
});

// drinks.dm:211
rt.def("/obj/item/weapon/reagent_containers/food/drinks/beer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["beer", 30]);
	return f.dot;
});

rt.type(5854, "/obj/item/weapon/reagent_containers/food/drinks/ale", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "Magm-Ale",
	desc: "A true dorf's drink of choice.",
	icon_state: "alebottle",
	item_state: "beer",
	list_reagents: null,
});

// drinks.dm:218
rt.def("/obj/item/weapon/reagent_containers/food/drinks/ale/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ale", 30]);
	return f.dot;
});

rt.type(5855, "/obj/item/weapon/reagent_containers/food/drinks/sillycup", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "paper cup",
	desc: "A paper water cup.",
	icon_state: "water_cup_e",
	possible_transfer_amounts: null,
	volume: 10,
	spillable: 1,
});

// drinks.dm:224
rt.def("/obj/item/weapon/reagent_containers/food/drinks/sillycup/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// drinks.dm:229
rt.def("/obj/item/weapon/reagent_containers/food/drinks/sillycup/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (this.reagents.total_volume) {
		this.icon_state = "water_cup";
	} else {
		this.icon_state = "water_cup_e";
	}
	return f.dot;
});

rt.type(5856, "/obj/item/weapon/reagent_containers/food/drinks/sillycup/smallcarton", "/obj/item/weapon/reagent_containers/food/drinks/sillycup", {
	name: "small carton",
	desc: "A small carton, intended for holding drinks.",
	icon_state: "juicebox",
	volume: 15,
});

// drinks.dm:241
rt.def("/obj/item/weapon/reagent_containers/food/drinks/sillycup/smallcarton/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (rt.len(f, this.reagents.reagent_list)) {
		const master_reagent_id = this.reagents.get_master_reagent_id();
		if (master_reagent_id === "orangejuice") {
			this.icon_state = "orangebox";
			this.name = "orange juice box";
			this.desc = "A great source of vitamins. Stay healthy!";
		} else if (master_reagent_id === "milk") {
			this.icon_state = "milkbox";
			this.name = "carton of milk";
			this.desc = "An excellent source of calcium for growing space explorers.";
		} else if (master_reagent_id === "applejuice") {
			this.icon_state = "juicebox";
			this.name = "apple juice box";
			this.desc = "Sweet apple juice. Don't be late for school!";
		} else if (master_reagent_id === "grapejuice") {
			this.icon_state = "grapebox";
			this.name = "grape juice box";
			this.desc = "Tasty grape juice in a fun little container. Non-alcoholic!";
		} else if (master_reagent_id === "chocolate_milk") {
			this.icon_state = "chocolatebox";
			this.name = "carton of chocolate milk";
			this.desc = "Milk for cool kids!";
		} else if (master_reagent_id === "eggnog") {
			this.icon_state = "nog2";
			this.name = "carton of eggnog";
			this.desc = "For enjoying the most wonderful time of the year.";
		}
	} else {
		this.icon_state = "juicebox";
		this.name = "small carton";
		this.desc = "A small carton, intended for holding drinks.";
	}
	return f.dot;
});

rt.type(5857, "/obj/item/weapon/reagent_containers/food/drinks/shaker", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "shaker",
	desc: "A metal shaker to mix drinks in.",
	icon_state: "shaker",
	materials: null,
	amount_per_transfer_from_this: 10,
	volume: 100,
});

// drinks.dm:283
rt.def("/obj/item/weapon/reagent_containers/food/drinks/shaker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1500]);
	return f.dot;
});

rt.type(5858, "/obj/item/weapon/reagent_containers/food/drinks/flask", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "flask",
	desc: "Every good spaceman knows it's a good idea to bring along a couple of pints of whiskey wherever they go.",
	icon_state: "flask",
	materials: null,
	volume: 60,
});

// drinks.dm:291
rt.def("/obj/item/weapon/reagent_containers/food/drinks/flask/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 250]);
	return f.dot;
});

rt.type(5859, "/obj/item/weapon/reagent_containers/food/drinks/flask/gold", "/obj/item/weapon/reagent_containers/food/drinks/flask", {
	name: "captain's flask",
	desc: "A gold flask belonging to the captain.",
	icon_state: "flask_gold",
	materials: null,
});

// drinks.dm:298
rt.def("/obj/item/weapon/reagent_containers/food/drinks/flask/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 500]);
	return f.dot;
});

rt.type(5860, "/obj/item/weapon/reagent_containers/food/drinks/flask/det", "/obj/item/weapon/reagent_containers/food/drinks/flask", {
	name: "detective's flask",
	desc: "The detective's only true friend.",
	icon_state: "detflask",
	list_reagents: null,
});

// drinks.dm:304
rt.def("/obj/item/weapon/reagent_containers/food/drinks/flask/det/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["hearty_punch", 30]);
	return f.dot;
});

rt.type(5829, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", "/obj/item/weapon/reagent_containers/food/drinks", {
	container_type: 0,
	name: "soda can",
	spillable: 0,
});

// drinks.dm:333
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let crushed_can: Value = null;
	if (M == user && !this.reagents.total_volume && user.a_intent == "harm" && user.zone_selected == "head") {
		user.visible_message(`<span class='warning'>${user} crushes the can of ${this} on ${user.p_their()} forehead!</span>`, `<span class='notice'>You crush the can of ${this} on your forehead.</span>`);
		playsound(user.loc, rt.rsc("sound/weapons/pierce.ogg"), rand(10, 50), 1);
		(crushed_can = (yield* new_(T("/obj/item/trash/can"), user.loc))).icon_state = this.icon_state;
		yield* qdel(this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drinks.dm:343
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.is_open_container()) {
		to_chat(user, fmt("You pull back the tab of ％！ with a satisfying pop.", [this]));
		this.container_type = OPENCONTAINER;
		playsound(this, "can_open", 50, 1);
		this.spillable = 1;
		return f.dot;
	}
	return parent_proc();
}, false);

rt.type(5831, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Space Cola",
	desc: "Cola. in space.",
	icon_state: "cola",
	list_reagents: null,
});

// drinks.dm:355
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/cola/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cola", 30]);
	return f.dot;
});

rt.type(5832, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "T-Borg's Tonic Water",
	desc: "Quinine tastes funny, but at least it'll keep that Space Malaria away.",
	icon_state: "tonic",
	list_reagents: null,
});

// drinks.dm:361
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/tonic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["tonic", 50]);
	return f.dot;
});

rt.type(5833, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Soda Water",
	desc: "A can of soda water. Why not make a scotch and soda?",
	icon_state: "sodawater",
	list_reagents: null,
});

// drinks.dm:367
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/sodawater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sodawater", 50]);
	return f.dot;
});

rt.type(5834, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Orange Soda",
	desc: "You wanted ORANGE. It gave you Lemon Lime.",
	icon_state: "lemon-lime",
	list_reagents: null,
});

// drinks.dm:373
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["lemon_lime", 30]);
	return f.dot;
});

// drinks.dm:376
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/lemon_lime/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.name = "Lemon-Lime Soda";
	return f.dot;
}, true);

rt.type(5835, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Space-Up!",
	desc: "Tastes like a hull breach in your mouth.",
	icon_state: "space-up",
	list_reagents: null,
});

// drinks.dm:383
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_up/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["space_up", 30]);
	return f.dot;
});

rt.type(5836, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Star-kist",
	desc: "The taste of a star in liquid form. And, a bit of tuna...?",
	icon_state: "starkist",
	list_reagents: null,
});

// drinks.dm:389
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/starkist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cola", 15, "orangejuice", 15]);
	return f.dot;
});

rt.type(5837, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Space Mountain Wind",
	desc: "Blows right through you like a space wind.",
	icon_state: "space_mountain_wind",
	list_reagents: null,
});

// drinks.dm:395
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/space_mountain_wind/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["spacemountainwind", 30]);
	return f.dot;
});

rt.type(5838, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Thirteen Loko",
	desc: "The CMO has advised crew members that consumption of Thirteen Loko may result in seizures, blindness, drunkeness, or even death. Please Drink Responsibly.",
	icon_state: "thirteen_loko",
	list_reagents: null,
});

// drinks.dm:401
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/thirteenloko/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["thirteenloko", 30]);
	return f.dot;
});

rt.type(5839, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Dr. Gibb",
	desc: "A delicious mixture of 42 different flavors.",
	icon_state: "dr_gibb",
	list_reagents: null,
});

// drinks.dm:407
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/dr_gibb/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["dr_gibb", 30]);
	return f.dot;
});

rt.type(5840, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Pwr Game",
	desc: "The only drink with the PWR that true gamers crave.",
	icon_state: "purple_can",
	list_reagents: null,
});

// drinks.dm:413
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/pwr_game/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["pwr_game", 30]);
	return f.dot;
});

rt.type(5841, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Shambler's Juice",
	desc: "~Shake me up some of that Shambler's Juice!~",
	icon_state: "shamblers",
	list_reagents: null,
});

// drinks.dm:419
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/shamblers/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["shamblers", 30]);
	return f.dot;
});

rt.type(5842, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/air", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Canned Air",
	desc: "There is no air shortage. Do not drink.",
	icon_state: "air",
	list_reagents: null,
});

// drinks.dm:425
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/air/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nitrogen", 24, "oxygen", 6]);
	return f.dot;
});
