// Based on /tg/station's code/modules/food_and_drinks/food/customizables.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5875, "/obj/item/weapon/reagent_containers/food/snacks/customizable", "/obj/item/weapon/reagent_containers/food/snacks", {
	ingMax: 12,
	ingredients: null,
	ingredients_placement: 1,
	customname: "custom",
	bitesize: 4,
	w_class: 2,
	volume: 80,
	unique_rename: 1,
});

// customizables.dm:21
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ingredients = list();
	return f.dot;
});

// customizables.dm:26
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/examine", function examine(f: Frame, user: Value) {
	let ING: Value = null;
	let $1: any, $e: any;
	parent_proc();
	let ingredients_listed: Value = "";
	for (ING of each(this.ingredients, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		ingredients_listed += `${ING.name}, `;
	}
	let size: Value = "standard";
	if (rt.len(f, this.ingredients) < 2) {
		size = "small";
	}
	if (rt.len(f, this.ingredients) > 5) {
		size = "big";
	}
	if (rt.len(f, this.ingredients) > 8) {
		size = "monster";
	}
	let $0: any = user;
	if (rt.len(f, this.ingredients)) {
		$1 = `${ingredients_listed}`;
	} else {
		$1 = "no ingredient, ";
	}
	to_chat($0, `It contains ${$1}making a ${size}-sized ${rt.initial(f, this, "name")}.`);
	return f.dot;
}, false);

// customizables.dm:40
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null;
	if (!rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/customizable")) && rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		S = I;
		if (I.w_class > WEIGHT_CLASS_SMALL) {
			to_chat(user, `<span class='warning'>The ingredient is too big for ${this}!</span>`);
		} else if (rt.len(f, this.ingredients) >= this.ingMax || this.reagents.total_volume >= this.volume) {
			to_chat(user, `<span class='warning'>You can't add more ingredients to ${this}!</span>`);
		} else if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/custom")) || rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/custom"))) {
			to_chat(user, `<span class='warning'>Adding ${I.name} to ${this} would make a mess.</span>`);
		} else {
			if (!(yield* user.transferItemToLoc(I, this))) {
				return f.dot;
			}
			if (S.trash) {
				yield* S.generate_trash(rt.getStep(f, user, 0));
			}
			this.ingredients += S;
			this.mix_filling_color(S);
			yield* S.reagents.trans_to(this, min(S.reagents.total_volume, 15));
			this.update_overlays(S);
			to_chat(user, `<span class='notice'>You add the ${I.name} to the ${this.name}.</span>`);
			this.update_name(S);
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// customizables.dm:63
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/update_name", function update_name(f: Frame, S: Value) {
	let I: Value = null, M: Value = null;
	for (I of each(this.ingredients, T("/obj/item"))) {
		if (!rt.op(f, "IsType", [], [S, I.type])) {
			this.customname = "custom";
			break;
		}
	}
	if (rt.len(f, this.ingredients) == 1) {
		if (rt.istype(S, T("/obj/item/weapon/reagent_containers/food/snacks/meat"))) {
			if ((M = S).subjectname) {
				this.customname = `${M.subjectname}`;
			} else if (M.subjectjob) {
				this.customname = `${M.subjectjob}`;
			} else {
				this.customname = S.name;
			}
		} else {
			this.customname = S.name;
		}
	}
	this.name = `${this.customname} ${rt.initial(f, this, "name")}`;
	return f.dot;
});

// customizables.dm:81
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/initialize_custom_food", function* initialize_custom_food(f: Frame, BASE: Value, I: Value, user: Value) {
	let RC: Value = null, O: Value = null;
	if (rt.istype(BASE, T("/obj/item/weapon/reagent_containers"))) {
		yield* (RC = BASE).reagents.trans_to(this, RC.reagents.total_volume);
	}
	for (O of each(BASE.contents, T("/obj"))) {
		this.contents += O;
	}
	if (I && user) {
		yield* this.attackby(I, user);
	}
	yield* qdel(BASE);
	return f.dot;
}, true);

// customizables.dm:91
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/mix_filling_color", function mix_filling_color(f: Frame, S: Value) {
	let rgbcolor: Value = null, customcolor: Value = null, ingcolor: Value = null;
	if (rt.len(f, this.ingredients) == 1) {
		this.filling_color = S.filling_color;
	} else {
		rgbcolor = list(0, 0, 0, 0);
		customcolor = GetColors(this.filling_color);
		ingcolor = GetColors(S.filling_color);
		rt.setAt(rgbcolor, 1, (rt.index(customcolor, 1) + rt.index(ingcolor, 1)) / 2);
		rt.setAt(rgbcolor, 2, (rt.index(customcolor, 2) + rt.index(ingcolor, 2)) / 2);
		rt.setAt(rgbcolor, 3, (rt.index(customcolor, 3) + rt.index(ingcolor, 3)) / 2);
		rt.setAt(rgbcolor, 4, (rt.index(customcolor, 4) + rt.index(ingcolor, 4)) / 2);
		this.filling_color = rt.op(f, "Rgb", [1, 4], [rt.index(rgbcolor, 1), rt.index(rgbcolor, 2), rt.index(rgbcolor, 3), rt.index(rgbcolor, 4)]);
	}
	return f.dot;
});

// customizables.dm:104
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/update_overlays", function update_overlays(f: Frame, S: Value) {
	let TOP: Value = null;
	let filling: Value = mutable_appearance(this.icon, `${rt.initial(f, this, "icon_state")}_filling`);
	if (S.filling_color == "#FFFFFF") {
		filling.color = pick("#FF0000", "#0000FF", "#008000", "#FFFF00");
	} else {
		filling.color = S.filling_color;
	}
	if (this.ingredients_placement === INGREDIENTS_SCATTER) {
		filling.pixel_x = rand(-1, 1);
		filling.pixel_y = rand(-1, 1);
	} else if (this.ingredients_placement === INGREDIENTS_STACK) {
		filling.pixel_x = rand(-1, 1);
		filling.pixel_y = 2 * rt.len(f, this.ingredients) - 1;
	} else if (this.ingredients_placement === INGREDIENTS_STACKPLUSTOP) {
		filling.pixel_x = rand(-1, 1);
		filling.pixel_y = 2 * rt.len(f, this.ingredients) - 1;
		if (this.our_overlays) {
			this.our_overlays.Cut(rt.len(f, this.ingredients));
		}
		(TOP = mutable_appearance(this.icon, `${this.icon_state}_top`)).pixel_y = 2 * rt.len(f, this.ingredients) + 3;
		this.add_overlay(filling);
		this.add_overlay(TOP);
		return f.dot;
	} else if (this.ingredients_placement === INGREDIENTS_FILL) {
		this.cut_overlays();
		filling.color = this.filling_color;
	} else if (this.ingredients_placement === INGREDIENTS_LINE) {
		filling.pixel_x = (rt.setFv(f, "pixel_y", filling, rand(-8, 3)));
	}
	this.add_overlay(filling);
	return f.dot;
});

// customizables.dm:137
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/initialize_slice", function* initialize_slice(f: Frame, slice: Value, reagents_per_slice: Value) {
	yield* parent_proc();
	slice.filling_color = this.filling_color;
	slice.update_overlays(this);
	return f.dot;
}, true);

// customizables.dm:143
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/proc/Destroy", function* Destroy(f: Frame) {
	let $e: any;
	rt.forList(f, 0, this.ingredients);
	while (($e = rt.next(f, 0)) !== undefined) {
		f.dot = $e;
		yield* qdel(f.dot);
	}
	rt.endFor(f, 0);
	return (yield* parent_proc());
}, true);

rt.type(5879, "/obj/item/weapon/reagent_containers/food/snacks/customizable/kebab", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingredients_placement: 5,
	ingMax: 6,
	name: "kebab",
	desc: "Delicious food on a stick.",
	trash: rt.typePath("/obj/item/stack/rods"),
	list_reagents: null,
	icon_state: "rod",
});

// customizables.dm:186
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/kebab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nutriment", 1]);
	return f.dot;
});

rt.type(5884, "/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	finished: 0,
	ingredients_placement: 3,
	name: "toast",
	desc: "A timeless classic.",
	icon: rt.rsc("icons/obj/food/burgerbread.dmi"),
	icon_state: "breadslice",
});

// customizables.dm:237
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich/proc/initialize_custom_food", function* initialize_custom_food(f: Frame, BASE: Value, I: Value, user: Value) {
	this.icon_state = BASE.icon_state;
	yield* parent_proc();
	return f.dot;
}, true);

// customizables.dm:240
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/sandwich/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let BS: Value = null, TOP: Value = null, filling: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice"))) {
		BS = I;
		if (this.finished) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You finish the ${this.name}.</span>`);
		this.finished = 1;
		this.name = `${this.customname} sandwich`;
		yield* BS.reagents.trans_to(this, BS.reagents.total_volume);
		this.ingMax = rt.len(f, this.ingredients);
		(TOP = mutable_appearance(this.icon, `${BS.icon_state}`)).pixel_y = 2 * rt.len(f, this.ingredients) + 3;
		this.add_overlay(TOP);
		if (rt.istype(BS, T("/obj/item/weapon/reagent_containers/food/snacks/breadslice/custom"))) {
			(filling = (yield* new_(T("/mutable_appearance"), this.icon, `${rt.initial(f, BS, "icon_state")}_filling`))).color = BS.filling_color;
			filling.pixel_y = 2 * rt.len(f, this.ingredients) + 3;
			this.add_overlay(filling);
		}
		yield* qdel(BS);
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(5885, "/obj/item/weapon/reagent_containers/food/snacks/customizable/soup", "/obj/item/weapon/reagent_containers/food/snacks/customizable", {
	ingMax: 8,
	name: "soup",
	desc: "A bowl with liquid and... stuff in it.",
	trash: rt.typePath("/obj/item/weapon/reagent_containers/glass/bowl"),
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	icon_state: "wishsoup",
});

// customizables.dm:272
rt.def("/obj/item/weapon/reagent_containers/food/snacks/customizable/soup/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.eatverb = pick("slurp", "sip", "suck", "inhale", "drink");
	return f.dot;
}, true);

rt.type(6392, "/obj/item/weapon/reagent_containers/glass/bowl", "/obj/item/weapon/reagent_containers/glass", {
	container_type: 4096,
	name: "bowl",
	desc: "A simple bowl, used for soups and salads.",
	icon: rt.rsc("icons/obj/food/soupsalad.dmi"),
	icon_state: "bowl",
	materials: null,
	w_class: 3,
});

// customizables.dm:287
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 500]);
	return f.dot;
});

// customizables.dm:291
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, A: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		S = I;
		if (I.w_class > WEIGHT_CLASS_SMALL) {
			to_chat(user, `<span class='warning'>The ingredient is too big for ${this}!</span>`);
		} else if (rt.len(f, this.contents) >= 20) {
			to_chat(user, `<span class='warning'>You can't add more ingredients to ${this}!</span>`);
		} else if (this.reagents.has_reagent("water", 10)) {
			yield* (A = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/customizable/soup"), rt.getStep(f, this, 0)))).initialize_custom_food(this, S, user);
		} else {
			yield* (A = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/customizable/salad"), rt.getStep(f, this, 0)))).initialize_custom_food(this, S, user);
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// customizables.dm:308
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// customizables.dm:312
rt.def("/obj/item/weapon/reagent_containers/glass/bowl/proc/update_icon", function update_icon(f: Frame) {
	let filling: Value = null;
	this.cut_overlays();
	if (this.reagents && this.reagents.total_volume) {
		(filling = mutable_appearance(rt.rsc("icons/obj/food/soupsalad.dmi"), "fullbowl")).color = mix_color_from_reagents(this.reagents.reagent_list);
		this.add_overlay(filling);
	} else {
		this.icon_state = "bowl";
	}
	return f.dot;
});
