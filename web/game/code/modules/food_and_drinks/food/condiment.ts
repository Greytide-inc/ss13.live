// Based on /tg/station's code/modules/food_and_drinks/food/condiment.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6358, "/obj/item/weapon/reagent_containers/food/condiment", "/obj/item/weapon/reagent_containers/food", {
	possible_states: null,
	originalname: "condiment",
	container_type: 4096,
	name: "condiment container",
	desc: "Just your average condiment container.",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "emptycondiment",
	possible_transfer_amounts: null,
	volume: 50,
});

// condiment.dm:17
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = rt.alist(f, ["ketchup", list("ketchup", "ketchup bottle", "You feel more American already."), "capsaicin", list("hotsauce", "hotsauce bottle", "You can almost TASTE the stomach ulcers now!"), "enzyme", list("enzyme", "universal enzyme bottle", "Used in cooking various dishes"), "soysauce", list("soysauce", "soy sauce bottle", "A salty soy-based flavoring"), "frostoil", list("coldsauce", "coldsauce bottle", "Leaves the tongue numb in it's passage"), "sodiumchloride", list("saltshakersmall", "salt shaker", "Salt. From space oceans, presumably"), "blackpepper", list("peppermillsmall", "pepper mill", "Often used to flavor food or make people sneeze"), "cornoil", list("oliveoil", "corn oil bottle", "A delicious oil used in cooking. Made from corn"), "sugar", list("emptycondiment", "sugar bottle", "Tasty spacey sugar!"), "mayonnaise", list("mayonnaise", "mayonnaise jar", "An oily condiment made from egg yolks.")]);
	this.possible_transfer_amounts = list(1, 5, 10, 15, 20, 25, 30, 50);
	return f.dot;
});

// condiment.dm:32
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	if (!this.reagents || !this.reagents.total_volume) {
		to_chat(user, `<span class='warning'>None of ${this} left, oh no!</span>`);
		return 0;
	}
	if (!this.canconsume(M, user)) {
		return 0;
	}
	if (M == user) {
		to_chat(M, fmt("<span class='notice'>You swallow some of contents of ％！.</span>", [this]));
	} else {
		user.visible_message(`<span class='warning'>${user} attempts to feed ${M} from ${this}.</span>`);
		if (!(yield* do_mob(user, M))) {
			return f.dot;
		}
		if (!this.reagents || !this.reagents.total_volume) {
			return f.dot;
		}
		user.visible_message(`<span class='warning'>${user} feeds ${M} from ${this}.</span>`);
		add_logs(user, M, "fed", this.reagentlist(this));
	}
	let fraction: Value = min(10 / this.reagents.total_volume, 1);
	yield* this.reagents.reaction(M, INGEST, fraction);
	yield* this.reagents.trans_to(M, 10);
	playsound(M.loc, rt.rsc("sound/items/drink.ogg"), rand(10, 50), 1);
	return 1;
}, true);

// condiment.dm:57
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/structure/reagent_dispensers"))) {
		if (!target.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${target} is empty!</span>`);
			return f.dot;
		}
		if (this.reagents.total_volume >= this.reagents.maximum_volume) {
			to_chat(user, `<span class='warning'>${this} is full!</span>`);
			return f.dot;
		}
		trans = (yield* target.reagents.trans_to(this, this.amount_per_transfer_from_this));
		to_chat(user, `<span class='notice'>You fill ${this} with ${trans} units of the contents of ${target}.</span>`);
	} else {
		if (!(target.is_open_container() || rt.istype(target, T("/obj/item/weapon/reagent_containers/food/snacks")))) return f.dot;
		if (!this.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${this} is empty!</span>`);
			return f.dot;
		}
		if (target.reagents.total_volume >= target.reagents.maximum_volume) {
			to_chat(user, `<span class='warning'>you can't add anymore to ${target}!</span>`);
			return f.dot;
		}
		trans = (yield* this.reagents.trans_to(target, this.amount_per_transfer_from_this));
		to_chat(user, `<span class='notice'>You transfer ${trans} units of the condiment to ${target}.</span>`);
	}
	return f.dot;
}, true);

// condiment.dm:83
rt.def("/obj/item/weapon/reagent_containers/food/condiment/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let main_reagent: Value = null, temp_list: Value = null;
	if (!rt.len(f, this.possible_states)) {
		return f.dot;
	}
	if (rt.len(f, this.reagents.reagent_list) > 0) {
		if (rt.isIn(f, (main_reagent = this.reagents.get_master_reagent_id()), this.possible_states)) {
			this.icon_state = rt.index((temp_list = rt.index(this.possible_states, main_reagent)), 1);
			this.name = rt.index(temp_list, 2);
			this.desc = rt.index(temp_list, 3);
		} else {
			this.name = `${this.originalname} bottle`;
			main_reagent = this.reagents.get_master_reagent_name();
			if (rt.len(f, this.reagents.reagent_list) == 1) {
				this.desc = `Looks like it is ${lowertext(main_reagent)}, but you are not sure.`;
			} else {
				this.desc = `A mixture of various condiments. ${lowertext(main_reagent)} is one of them.`;
			}
			this.icon_state = "mixedcondiments";
		}
	} else {
		this.icon_state = "emptycondiment";
		this.name = "condiment bottle";
		this.desc = "An empty condiment bottle.";
		return f.dot;
	}
	return f.dot;
});

rt.type(6359, "/obj/item/weapon/reagent_containers/food/condiment/enzyme", "/obj/item/weapon/reagent_containers/food/condiment", {
	name: "universal enzyme",
	desc: "Used in cooking various dishes.",
	icon_state: "enzyme",
	list_reagents: null,
});

// condiment.dm:111
rt.def("/obj/item/weapon/reagent_containers/food/condiment/enzyme/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["enzyme", 50]);
	return f.dot;
});

rt.type(6360, "/obj/item/weapon/reagent_containers/food/condiment/sugar", "/obj/item/weapon/reagent_containers/food/condiment", {
	name: "sugar bottle",
	desc: "Tasty spacey sugar!",
	list_reagents: null,
});

// condiment.dm:116
rt.def("/obj/item/weapon/reagent_containers/food/condiment/sugar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sugar", 50]);
	return f.dot;
});

rt.type(6361, "/obj/item/weapon/reagent_containers/food/condiment/saltshaker", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "salt shaker",
	desc: "Salt. From space oceans, presumably.",
	icon_state: "saltshakersmall",
	possible_transfer_amounts: null,
	amount_per_transfer_from_this: 1,
	volume: 20,
	list_reagents: null,
});

// condiment.dm:126
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.possible_transfer_amounts = list(1, 20);
	this.list_reagents = rt.alist(f, ["sodiumchloride", 20]);
	return f.dot;
});

// condiment.dm:129
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (rt.len(f, this.reagents.reagent_list) == 0) {
		this.icon_state = "emptyshaker";
	} else {
		this.icon_state = "saltshakersmall";
	}
	return f.dot;
});

// condiment.dm:135
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} begins to swap forms with the salt shaker! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	let newname: Value = `${this.name}`;
	this.name = `${user.name}`;
	user.name = newname;
	user.real_name = newname;
	this.desc = "Salt. From dead crew, presumably.";
	return 4;
});

// condiment.dm:144
rt.def("/obj/item/weapon/reagent_containers/food/condiment/saltshaker/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (isturf(target)) {
		if (!this.reagents.has_reagent("sodiumchloride", 2)) {
			to_chat(user, "<span class='warning'>You don't have enough salt to make a pile!</span>");
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} shakes some salt onto ${target}.</span>`, `<span class='notice'>You shake some salt onto ${target}.</span>`);
		yield* this.reagents.remove_reagent("sodiumchloride", 2);
		yield* new_(T("/obj/effect/decal/cleanable/salt"), target);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6362, "/obj/item/weapon/reagent_containers/food/condiment/peppermill", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "pepper mill",
	desc: "Often used to flavor food or make people sneeze.",
	icon_state: "peppermillsmall",
	possible_transfer_amounts: null,
	amount_per_transfer_from_this: 1,
	volume: 20,
	list_reagents: null,
});

// condiment.dm:164
rt.def("/obj/item/weapon/reagent_containers/food/condiment/peppermill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.possible_transfer_amounts = list(1, 20);
	this.list_reagents = rt.alist(f, ["blackpepper", 20]);
	return f.dot;
});

// condiment.dm:167
rt.def("/obj/item/weapon/reagent_containers/food/condiment/peppermill/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	if (rt.len(f, this.reagents.reagent_list) == 0) {
		this.icon_state = "emptyshaker";
	} else {
		this.icon_state = "peppermillsmall";
	}
	return f.dot;
});

rt.type(6363, "/obj/item/weapon/reagent_containers/food/condiment/milk", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "space milk",
	desc: "It's milk. White and nutritious goodness!",
	icon_state: "milk",
	item_state: "carton",
	list_reagents: null,
});

// condiment.dm:178
rt.def("/obj/item/weapon/reagent_containers/food/condiment/milk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.list_reagents = rt.alist(f, ["milk", 50]);
	return f.dot;
});

rt.type(6364, "/obj/item/weapon/reagent_containers/food/condiment/flour", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "flour sack",
	desc: "A big bag of flour. Good for baking!",
	icon_state: "flour",
	item_state: "flour",
	list_reagents: null,
});

// condiment.dm:186
rt.def("/obj/item/weapon/reagent_containers/food/condiment/flour/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.list_reagents = rt.alist(f, ["flour", 30]);
	return f.dot;
});

rt.type(6365, "/obj/item/weapon/reagent_containers/food/condiment/soymilk", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "soy milk",
	desc: "It's soy milk. White and nutritious goodness!",
	icon_state: "soymilk",
	item_state: "carton",
	list_reagents: null,
});

// condiment.dm:194
rt.def("/obj/item/weapon/reagent_containers/food/condiment/soymilk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.list_reagents = rt.alist(f, ["soymilk", 50]);
	return f.dot;
});

rt.type(6366, "/obj/item/weapon/reagent_containers/food/condiment/rice", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "rice sack",
	desc: "A big bag of rice. Good for cooking!",
	icon_state: "rice",
	item_state: "flour",
	list_reagents: null,
});

// condiment.dm:202
rt.def("/obj/item/weapon/reagent_containers/food/condiment/rice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.list_reagents = rt.alist(f, ["rice", 30]);
	return f.dot;
});

rt.type(6367, "/obj/item/weapon/reagent_containers/food/condiment/soysauce", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "soy sauce",
	desc: "A salty soy-based flavoring.",
	icon_state: "soysauce",
	list_reagents: null,
});

// condiment.dm:209
rt.def("/obj/item/weapon/reagent_containers/food/condiment/soysauce/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.list_reagents = rt.alist(f, ["soysauce", 50]);
	return f.dot;
});

rt.type(6368, "/obj/item/weapon/reagent_containers/food/condiment/mayonnaise", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "mayonnaise",
	desc: "An oily condiment made from egg yolks.",
	icon_state: "mayonnaise",
	list_reagents: null,
});

// condiment.dm:216
rt.def("/obj/item/weapon/reagent_containers/food/condiment/mayonnaise/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = list();
	this.list_reagents = rt.alist(f, ["mayonnaise", 50]);
	return f.dot;
});

rt.type(6369, "/obj/item/weapon/reagent_containers/food/condiment/pack", "/obj/item/weapon/reagent_containers/food/condiment", {
	possible_states: null,
	name: "condiment pack",
	desc: "A small plastic pack with condiments to put on your food",
	icon_state: "condi_empty",
	volume: 10,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
});

// condiment.dm:229
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_states = rt.alist(f, ["ketchup", list("condi_ketchup", "Ketchup", "You feel more American already."), "capsaicin", list("condi_hotsauce", "Hotsauce", "You can almost TASTE the stomach ulcers now!"), "soysauce", list("condi_soysauce", "Soy Sauce", "A salty soy-based flavoring"), "frostoil", list("condi_frostoil", "Coldsauce", "Leaves the tongue numb in it's passage"), "sodiumchloride", list("condi_salt", "Salt Shaker", "Salt. From space oceans, presumably"), "blackpepper", list("condi_pepper", "Pepper Mill", "Often used to flavor food or make people sneeze"), "cornoil", list("condi_cornoil", "Corn Oil", "A delicious oil used in cooking. Made from corn"), "sugar", list("condi_sugar", "Sugar", "Tasty spacey sugar!")]);

	this.possible_transfer_amounts = list();
	return f.dot;
});

// condiment.dm:235
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (!rt.istype(target, T("/obj/item/weapon/reagent_containers/food/snacks"))) return f.dot;
	if (!this.reagents.total_volume) {
		to_chat(user, `<span class='warning'>You tear open ${this}, but there's nothing in it.</span>`);
		yield* qdel(this);
		return f.dot;
	}
	if (target.reagents.total_volume >= target.reagents.maximum_volume) {
		to_chat(user, `<span class='warning'>You tear open ${this}, but ${target} is stacked so high that it just drips off!</span>`);
		yield* qdel(this);
		return f.dot;
	} else {
		to_chat(user, `<span class='notice'>You tear open ${this} above ${target} and the condiments drip onto it.</span>`);
		yield* this.reagents.trans_to(target, this.amount_per_transfer_from_this);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// condiment.dm:253
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let main_reagent: Value = null, temp_list: Value = null;
	if (rt.len(f, this.reagents.reagent_list) > 0) {
		if (rt.isIn(f, (main_reagent = this.reagents.get_master_reagent_id()), this.possible_states)) {
			this.icon_state = rt.index((temp_list = rt.index(this.possible_states, main_reagent)), 1);
			this.desc = rt.index(temp_list, 3);
		} else {
			this.icon_state = "condi_mixed";
			this.desc = `A small condiment pack. The label says it contains ${this.originalname}`;
		}
	} else {
		this.icon_state = "condi_empty";
		this.desc = "A small condiment pack. It is empty.";
	}
	return f.dot;
});

rt.type(6370, "/obj/item/weapon/reagent_containers/food/condiment/pack/ketchup", "/obj/item/weapon/reagent_containers/food/condiment/pack", {
	originalname: "ketchup",
	name: "ketchup pack",
	list_reagents: null,
});

// condiment.dm:270
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/ketchup/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ketchup", 10]);
	return f.dot;
});

rt.type(6371, "/obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce", "/obj/item/weapon/reagent_containers/food/condiment/pack", {
	originalname: "hotsauce",
	name: "hotsauce pack",
	list_reagents: null,
});

// condiment.dm:276
rt.def("/obj/item/weapon/reagent_containers/food/condiment/pack/hotsauce/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["capsaicin", 10]);
	return f.dot;
});
