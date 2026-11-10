// Based on /tg/station's code/modules/food_and_drinks/drinks/drinks/drinkingglass.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5863, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass", "/obj/item/weapon/reagent_containers/food/drinks", {
	name: "drinking glass",
	desc: "Your standard drinking glass.",
	icon_state: "glass_empty",
	amount_per_transfer_from_this: 10,
	volume: 50,
	materials: null,
	obj_integrity: 20,
	max_integrity: 20,
	spillable: 1,
	resistance_flags: 32,
	unique_rename: 1,
});

// drinkingglass.dm:9
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 500]);
	return f.dot;
});

// drinkingglass.dm:17
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let R: Value = null, reagent_overlay: Value = null;
	this.cut_overlays();
	if (rt.len(f, this.reagents.reagent_list)) {
		this.name = (R = this.reagents.get_master_reagent()).glass_name;
		this.desc = R.glass_desc;
		if (R.glass_icon_state) {
			this.icon_state = R.glass_icon_state;
		} else {
			(reagent_overlay = mutable_appearance(this.icon, "glassoverlay")).color = mix_color_from_reagents(this.reagents.reagent_list);
			this.add_overlay(reagent_overlay);
		}
	} else {
		this.icon_state = "glass_empty";
		this.name = "drinking glass";
		this.desc = "Your standard drinking glass.";
	}
	return f.dot;
});

rt.type(5864, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass", {
	gulp_size: 15,
	name: "shot glass",
	desc: "A shot glass - the universal symbol for bad decisions.",
	icon_state: "shotglass",
	amount_per_transfer_from_this: 15,
	possible_transfer_amounts: null,
	volume: 15,
	materials: null,
});

// drinkingglass.dm:46
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	this.materials = rt.alist(f, ["$glass", 100]);
	return f.dot;
});

// drinkingglass.dm:51
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let largest_reagent: Value = null, shot_overlay: Value = null;
	this.cut_overlays();
	if (this.gulp_size < 15) {
		this.gulp_size = 15;
	} else {
		this.gulp_size = max(round(this.reagents.total_volume / 15), 15);
	}
	if (rt.len(f, this.reagents.reagent_list) > 0) {
		largest_reagent = this.reagents.get_master_reagent();
		this.name = "filled shot glass";
		this.desc = "The challenge is not taking as many as you can, but guessing what it is before you pass out.";
		if (largest_reagent.shot_glass_icon_state) {
			this.icon_state = largest_reagent.shot_glass_icon_state;
		} else {
			this.icon_state = "shotglassclear";
			(shot_overlay = mutable_appearance(this.icon, "shotglassoverlay")).color = mix_color_from_reagents(this.reagents.reagent_list);
			this.add_overlay(shot_overlay);
		}
	} else {
		this.icon_state = "shotglass";
		this.name = "shot glass";
		this.desc = "A shot glass - the universal symbol for bad decisions.";
		return f.dot;
	}
	return f.dot;
});

rt.type(5865, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass", {});

// drinkingglass.dm:79
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.on_reagent_change();
	return f.dot;
}, true);

rt.type(5866, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", {
	name: "Soda Water",
	list_reagents: null,
});

// drinkingglass.dm:84
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/soda/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sodawater", 50]);
	return f.dot;
});

rt.type(5867, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", {
	name: "Space Cola",
	list_reagents: null,
});

// drinkingglass.dm:88
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/cola/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cola", 50]);
	return f.dot;
});

rt.type(5868, "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola", "/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled", {
	name: "Nuka Cola",
	list_reagents: null,
});

// drinkingglass.dm:92
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/filled/nuka_cola/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nuka_cola", 50]);
	return f.dot;
});

// drinkingglass.dm:95
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let E: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/egg"))) {
		E = I;
		if (this.reagents) {
			if (this.reagents.total_volume >= this.reagents.maximum_volume) {
				to_chat(user, `<span class='notice'>${this} is full.</span>`);
			} else {
				to_chat(user, `<span class='notice'>You break ${E} in ${this}.</span>`);
				yield* this.reagents.add_reagent("eggyolk", 5);
				yield* qdel(E);
			}
			return f.dot;
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// drinkingglass.dm:109
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (user.a_intent == "harm" && ismob(target) && target.reagents && this.reagents.total_volume) {
		target.visible_message(`<span class='danger'>${user} splashes the contents of ${this} onto ${target}!</span>`, `<span class='userdanger'>${user} splashes the contents of ${this} onto ${target}!</span>`);
		add_logs(user, target, "splashed", this);
		yield* this.reagents.reaction(target, TOUCH);
		yield* this.reagents.clear_reagents();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// drinkingglass.dm:119
rt.def("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!proximity || !(yield* this.check_allowed_items(target, { target_self: 1 }))) {
		return f.dot;
	} else if (this.reagents.total_volume && user.a_intent == "harm") {
		user.visible_message(`<span class='danger'>${user} splashes the contents of ${this} onto ${target}!</span>`, `<span class='notice'>You splash the contents of ${this} onto ${target}.</span>`);
		yield* this.reagents.reaction(target, TOUCH);
		yield* this.reagents.clear_reagents();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);
