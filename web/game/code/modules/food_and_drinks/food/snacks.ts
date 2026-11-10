// Based on /tg/station's code/modules/food_and_drinks/food/snacks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(5870, "/obj/item/weapon/reagent_containers/food/snacks", "/obj/item/weapon/reagent_containers/food", {
	bitesize: 2,
	bitecount: 0,
	trash: null,
	slice_path: null,
	slices_num: null,
	eatverb: null,
	dried_type: null,
	dry: 0,
	cooked_type: null,
	filling_color: "#FFFFFF",
	custom_food_type: null,
	junkiness: 0,
	bonus_reagents: null,
	customfoodfilling: 1,
	tastes: null,
	name: "snack",
	desc: "Yummy.",
	icon: rt.rsc("icons/obj/food/food.dmi"),
	icon_state: null,
	unique_rename: 1,
});

// snacks.dm:26
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/add_initial_reagents", function* add_initial_reagents(f: Frame) {
	let rid: Value = null, amount: Value = null;
	if (this.tastes && rt.len(f, this.tastes)) {
		if (this.list_reagents) {
			for (rid of each(this.list_reagents)) {
				amount = rt.index(this.list_reagents, rid);
				if (rid == "nutriment" || rid == "vitamin") {
					yield* this.reagents.add_reagent(rid, amount, (yield* this.tastes.Copy()));
				} else {
					yield* this.reagents.add_reagent(rid, amount);
				}
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// snacks.dm:38
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/On_Consume", function* On_Consume(f: Frame) {
	if (!f.usr) {
		return f.dot;
	}
	if (this.reagents.total_volume) return f.dot;
	let trash_item: Value = (yield* this.generate_trash(f.usr));
	yield* qdel(this);
	yield* f.usr.put_in_hands(trash_item);
	return f.dot;
}, true);

// snacks.dm:51
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	let fullness: Value = null, C: Value = null, fraction: Value = null;
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (!this.eatverb) {
		this.eatverb = pick("bite", "chew", "nibble", "gnaw", "gobble", "chomp");
	}
	if (!this.reagents.total_volume) {
		to_chat(user, `<span class='notice'>None of ${this} left, oh no!</span>`);
		yield* qdel(this);
		return 0;
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (!this.canconsume(M, user)) {
			return 0;
		}
		fullness = M.nutrition + 10;
		for (C of each(M.reagents.reagent_list, T("/datum/reagent/consumable"))) {
			fullness += C.nutriment_factor * C.volume / C.metabolization_rate;
		}
		if (M == user) {
			if (this.junkiness && M.satiety < -150 && M.nutrition > 200) {
				to_chat(M, "<span class='notice'>You don't feel like eating any more junk food at the moment.</span>");
				return 0;
			} else if (fullness <= 50) {
				to_chat(M, fmt("<span class='notice'>You hungrily ＀ some of ％！ and gobble it down!</span>", [this.eatverb, this]));
			} else if (fullness > 50 && fullness < 150) {
				to_chat(M, fmt("<span class='notice'>You hungrily begin to ＀ ％！.</span>", [this.eatverb, this]));
			} else if (fullness > 150 && fullness < 500) {
				to_chat(M, fmt("<span class='notice'>You ＀ ％！.</span>", [this.eatverb, this]));
			} else if (fullness > 500 && fullness < 600) {
				to_chat(M, fmt("<span class='notice'>You unwillingly ＀ a bit of ％！.</span>", [this.eatverb, this]));
			} else if (fullness > 600 * (1 + M.overeatduration / 2000)) {
				to_chat(M, fmt("<span class='warning'>You cannot force any more of ％！ to go down your throat!</span>", [this]));
				return 0;
			}
		} else if (!rt.istype(M, T("/mob/living/brain"))) {
			if (fullness <= 600 * (1 + M.overeatduration / 1000)) {
				M.visible_message(`<span class='danger'>${user} attempts to feed ${M} ${this}.</span>`, `<span class='userdanger'>${user} attempts to feed ${M} ${this}.</span>`);
			} else {
				M.visible_message(`<span class='warning'>${user} cannot force any more of ${this} down ${M}'s throat!</span>`, `<span class='warning'>${user} cannot force any more of ${this} down ${M}'s throat!</span>`);
				return 0;
			}
			if (!(yield* do_mob(user, M))) {
				return f.dot;
			}
			add_logs(user, M, "fed", this.reagentlist(this));
			M.visible_message(`<span class='danger'>${user} forces ${M} to eat ${this}.</span>`, `<span class='userdanger'>${user} forces ${M} to eat ${this}.</span>`);
		} else {
			to_chat(user, `<span class='warning'>${M} doesn't seem to have a mouth!</span>`);
			return f.dot;
		}
		if (this.reagents) {
			if (M.satiety > -200) {
				M.satiety -= this.junkiness;
			}
			playsound(M.loc, rt.rsc("sound/items/eatfood.ogg"), rand(10, 50), 1);
			if (this.reagents.total_volume) {
				fraction = min(this.bitesize / this.reagents.total_volume, 1);
				yield* this.reagents.reaction(M, INGEST, fraction);
				yield* this.reagents.trans_to(M, this.bitesize);
				this.bitecount++;
				yield* this.On_Consume();
			}
			return 1;
		}
	}
	return 0;
}, true);

// snacks.dm:123
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.bitecount == 0) {
		return f.dot;
	} else if (this.bitecount == 1) {
		to_chat(user, `${this} was bitten by someone!`);
	} else if (this.bitecount <= 3) {
		to_chat(user, `${this} was bitten ${this.bitecount} times!`);
	} else {
		to_chat(user, `${this} was bitten multiple times!`);
	}
	return f.dot;
}, false);

// snacks.dm:135
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, C: Value = null, sharp: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/storage"))) {
		yield* parent_proc();
		return 0;
	}
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		S = W;
		if (this.custom_food_type && ispath(this.custom_food_type)) {
			if (S.w_class > WEIGHT_CLASS_SMALL) {
				to_chat(user, `<span class='warning'>${S} is too big for ${this}!</span>`);
				return 0;
			}
			if (!S.customfoodfilling || rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks/customizable")) || rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks/pizzaslice/custom")) || rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/custom"))) {
				to_chat(user, `<span class='warning'>${this} can't be filled with ${S}!</span>`);
				return 0;
			}
			if (rt.len(f, this.contents) >= 20) {
				to_chat(user, `<span class='warning'>You can't add more ingredients to ${this}!</span>`);
				return 0;
			}
			yield* (C = (yield* new_(this.custom_food_type, rt.getStep(f, this, 0)))).initialize_custom_food(this, S, user);
			return 0;
		}
	}
	if (sharp = W.is_sharp()) {
		if (yield* g.srcCall(f, "slice", sharp, W, user)) {
			return 1;
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// snacks.dm:162
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value, R: Value) {
	let RC: Value = null, A: Value = null, B: Value = null, r_id: Value = null, amount: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* this.reagents.clear_reagents();
	for (RC of each(this.contents, T("/obj/item/weapon/reagent_containers"))) {
		yield* RC.reagents.trans_to(this.reagents, RC.reagents.maximum_volume);
	}
	if (rt.istype(R, T("/datum/crafting_recipe/food"))) {
		rt.forList(f, 0, this.contents);
		loop23: while (true) {
			if (($e = rt.next(f, 0)) === undefined) break;
			A = $e;
			B = null;
			for (B of each(R.real_parts)) {
				if (rt.op(f, "IsType", [], [A, B])) {
					continue loop23;
				}
			}
			yield* qdel(A);
		}
		rt.endFor(f, 0);
	}
	if (!(this.bonus_reagents && rt.len(f, this.bonus_reagents))) return f.dot;
	for (r_id of each(this.bonus_reagents)) {
		amount = rt.index(this.bonus_reagents, r_id);
		if (r_id == "nutriment" || r_id == "vitamin") {
			yield* this.reagents.add_reagent(r_id, amount, this.tastes);
		} else {
			yield* this.reagents.add_reagent(r_id, amount);
		}
	}
	return f.dot;
}, true);

// snacks.dm:184
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/slice", function* slice(f: Frame, accuracy: Value, W: Value, user: Value) {
	let i: Value = null, slice: Value = null;
	let $e: any;
	if (this.slices_num <= 0 || !this.slices_num || !this.slice_path) {
		return 0;
	}
	if (!isturf(this.loc) || !rt.locateIn(f, T("/obj/structure/table"), this.loc) && !rt.locateIn(f, T("/obj/structure/table/optable"), this.loc) && !rt.locateIn(f, T("/obj/item/weapon/storage/bag/tray"), this.loc)) {
		to_chat(user, `<span class='warning'>You cannot slice ${this} here! You need a table or at least a tray.</span>`);
		return 0;
	}
	let slices_lost: Value = 0;
	if (accuracy >= 2) {
		user.visible_message(`${user} slices ${this}.`, `<span class='notice'>You slice ${this}.</span>`);
	} else {
		user.visible_message(`${user} inaccurately slices ${this} with ${W}!`, `<span class='notice'>You inaccurately slice ${this} with your ${W}!</span>`);
		slices_lost = rand(1, min(1, round(this.slices_num / 2)));
	}
	let reagents_per_slice: Value = this.reagents.total_volume / this.slices_num;
	rt.forRange(f, 0, 1, this.slices_num - slices_lost, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* this.initialize_slice((slice = (yield* new_(this.slice_path, this.loc))), reagents_per_slice);
	}
	rt.endFor(f, 0);
	yield* qdel(this);
	return 1;
}, true);

// snacks.dm:217
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/initialize_slice", function* initialize_slice(f: Frame, slice: Value, reagents_per_slice: Value) {
	yield* slice.create_reagents(slice.volume);
	yield* this.reagents.trans_to(slice, reagents_per_slice);
	if (this.name != rt.initial(f, this, "name")) {
		slice.name = `slice of ${this.name}`;
	}
	if (this.desc == rt.initial(f, this, "desc")) return f.dot;
	slice.desc = `${this.desc}`;
	return f.dot;
}, true);

// snacks.dm:226
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/generate_trash", function* generate_trash(f: Frame, location: Value) {
	let trash_item: Value = null;
	if (!this.trash) return f.dot;
	if (ispath(this.trash, T("/obj/item"))) {
		f.dot = (yield* new_(this.trash, location));
		this.trash = null;
		return f.dot;
	} else {
		if (!rt.istype(this.trash, T("/obj/item"))) return f.dot;
		yield* (trash_item = this.trash).forceMove(location);
		f.dot = this.trash;
		this.trash = null;
		return f.dot;
	}
}, true);

// snacks.dm:238
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/update_overlays", function update_overlays(f: Frame, S: Value) {
	this.cut_overlays();
	let filling: Value = mutable_appearance(this.icon, `${rt.initial(f, this, "icon_state")}_filling`);
	if (S.filling_color == "#FFFFFF") {
		filling.color = pick("#FF0000", "#0000FF", "#008000", "#FFFF00");
	} else {
		filling.color = S.filling_color;
	}
	this.add_overlay(filling);
	return f.dot;
});

// snacks.dm:249
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/initialize_cooked_food", function* initialize_cooked_food(f: Frame, S: Value, cooking_efficiency: Value) {
	let r_id: Value = null, amount: Value = null;
	cooking_efficiency ??= 1;
	yield* S.create_reagents(S.volume);
	if (this.reagents) {
		yield* this.reagents.trans_to(S, this.reagents.total_volume);
	}
	if (!(S.bonus_reagents && rt.len(f, S.bonus_reagents))) return f.dot;
	for (r_id of each(S.bonus_reagents)) {
		amount = rt.index(S.bonus_reagents, r_id) * cooking_efficiency;
		if (r_id == "nutriment" || r_id == "vitamin") {
			yield* S.reagents.add_reagent(r_id, amount, this.tastes);
		} else {
			yield* S.reagents.add_reagent(r_id, amount);
		}
	}
	return f.dot;
}, true);

// snacks.dm:262
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/microwave_act", function* microwave_act(f: Frame, M: Value) {
	let S: Value = null;
	if (this.cooked_type) {
		S = (yield* new_(this.cooked_type, rt.getStep(f, this, 0)));
		if (M) {
			yield* this.initialize_cooked_food(S, M.efficiency);
		} else {
			yield* this.initialize_cooked_food(S, 1);
		}
	} else {
		yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/badrecipe"), this);
		if (M && M.dirty < 100) {
			M.dirty++;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// snacks.dm:276
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/Destroy", function* Destroy(f: Frame) {
	let something: Value = null;
	if (this.contents) {
		for (something of each(this.contents, T("/atom/movable"))) {
			something.loc = rt.getStep(f, this, 0);
		}
	}
	return (yield* parent_proc());
}, true);

// snacks.dm:281
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let sattisfaction_text: Value = null;
	if (!rt.istype(M, T("/mob/living/simple_animal"))) return f.dot;
	if (!rt.istype(M, T("/mob/living/simple_animal/pet/dog/corgi"))) return f.dot;
	let L: Value = M;
	if (this.bitecount == 0 || prob(50)) {
		yield* M.emote("me", 1, fmt("nibbles away at ％！", [this]));
	}
	this.bitecount++;
	L.taste(this.reagents);
	if (!(this.bitecount >= 5)) return f.dot;
	if (sattisfaction_text = pick("burps from enjoyment", "yaps for more", "woofs twice", fmt("looks at the area where ％！ was", [this]))) {
		yield* M.emote("me", 1, `${sattisfaction_text}`);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(5886, "/obj/item/weapon/reagent_containers/food/snacks/store", "/obj/item/weapon/reagent_containers/food/snacks", {
	stored_item: 0,
	w_class: 3,
});

// snacks.dm:333
rt.def("/obj/item/weapon/reagent_containers/food/snacks/store/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!rt.bitAnd((W.w_class <= WEIGHT_CLASS_SMALL ? 1 : 0), (!rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) return f.dot;
	if (W.is_sharp()) {
		return 0;
	}
	if (this.stored_item) {
		return 0;
	}
	if (!rt.istype(user, T("/mob/living/carbon"))) {
		return 0;
	}
	if (rt.len(f, this.contents) >= 20) {
		to_chat(user, `<span class='warning'>${this} is full.</span>`);
		return 0;
	}
	to_chat(user, `<span class='notice'>You slip ${W} inside ${this}.</span>`);
	yield* user.transferItemToLoc(W, this);
	yield* this.add_fingerprint(user);
	this.contents += W;
	this.stored_item = 1;
	return 1;
}, true);

// snacks.dm:352
rt.def("/obj/item/weapon/reagent_containers/food/snacks/proc/MouseDrop", function* MouseDrop(f: Frame, over: Value) {
	let TB: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (TB = rt.locateIn(f, T("/obj/structure/table"), _T)) {
		yield* TB.MouseDrop(over);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
