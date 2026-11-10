// Based on /tg/station's code/game/objects/effects/decals/cleanable.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11698, "/obj/effect/decal/cleanable", "/obj/effect/decal", {
	random_icon_states: null,
	blood_state: "",
	bloodiness: 0,
	mergeable_decal: 1,
	gender: "plural",
	layer: 2.08,
});

// cleanable.dm:4
rt.def("/obj/effect/decal/cleanable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list();
	return f.dot;
});

// cleanable.dm:10
rt.def("/obj/effect/decal/cleanable/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let C: Value = null;
	if (this.random_icon_states && rt.length(this.random_icon_states) > 0) {
		this.icon_state = pick(this.random_icon_states);
	}
	yield* this.create_reagents(300);
	if (this.loc && isturf(this.loc)) {
		for (C of each(this.loc, T("/obj/effect/decal/cleanable"))) {
			if (C != this && C.type == this.type) {
				yield* this.replace_decal(C);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cleanable.dm:23
rt.def("/obj/effect/decal/cleanable/proc/replace_decal", function* replace_decal(f: Frame, C: Value) {
	if (!this.mergeable_decal) return f.dot;
	yield* qdel(C);
	return f.dot;
}, true);

// cleanable.dm:26
rt.def("/obj/effect/decal/cleanable/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let hotness: Value = null, added_heat: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers/glass")) || rt.istype(W, T("/obj/item/weapon/reagent_containers/food/drinks"))) {
		if (this.reagents && W.reagents) {
			f.dot = 1;
			if (!this.reagents.total_volume) {
				to_chat(user, `<span class='notice'>${this} isn't thick enough to scoop up!</span>`);
				return f.dot;
			}
			if (W.reagents.total_volume >= W.reagents.maximum_volume) {
				to_chat(user, `<span class='notice'>${W} is full!</span>`);
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You scoop up ${this} into ${W}!</span>`);
			yield* this.reagents.trans_to(W, this.reagents.total_volume);
			if (!this.reagents.total_volume) {
				yield* qdel(this);
				return f.dot;
			}
		}
	}
	if (W.is_hot()) {
		if (rt.istype(W, T("/obj/item/clothing/mask/cigarette"))) {
			return f.dot;
		} else {
			hotness = W.is_hot();
			added_heat = hotness / 100;
			this.reagents.chem_temp = min(this.reagents.chem_temp + added_heat, hotness);
			yield* this.reagents.handle_reactions();
			to_chat(user, `<span class='notice'>You heat ${this} with ${W}!</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cleanable.dm:54
rt.def("/obj/effect/decal/cleanable/proc/ex_act", function* ex_act(f: Frame) {
	let R: Value = null;
	if (this.reagents) {
		for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
			yield* R.on_ex_act();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// cleanable.dm:60
rt.def("/obj/effect/decal/cleanable/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (this.reagents) {
		this.reagents.chem_temp += 30;
		yield* this.reagents.handle_reactions();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cleanable.dm:68
rt.def("/obj/effect/decal/cleanable/proc/Crossed", function Crossed(f: Frame, O: Value) {
	let H: Value = null;
	if (!rt.istype(O, T("/mob/living/carbon/human"))) return f.dot;
	if (!((H = O).shoes && this.blood_state && this.bloodiness)) return f.dot;
	let S: Value = H.shoes;
	let add_blood: Value = 0;
	if (this.bloodiness >= BLOOD_GAIN_PER_STEP) {
		add_blood = BLOOD_GAIN_PER_STEP;
	} else {
		add_blood = this.bloodiness;
	}
	this.bloodiness -= add_blood;
	rt.setAt(S.bloody_shoes, this.blood_state, min(MAX_SHOE_BLOODINESS, rt.index(S.bloody_shoes, this.blood_state) + add_blood));
	if (this.blood_DNA && rt.len(f, this.blood_DNA)) {
		S.add_blood(this.blood_DNA);
	}
	S.blood_state = this.blood_state;
	this.update_icon();
	H.update_inv_shoes();
	return f.dot;
});

// cleanable.dm:88
rt.def("/obj/effect/decal/cleanable/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	if (this.blood_state != "oil" && this.blood_state != "no blood whatsoever") {
		return this.bloodiness;
	} else {
		return 0;
	}
});
