// Based on /tg/station's code/modules/clothing/shoes/bananashoes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8488, "/obj/item/clothing/shoes/clown_shoes/banana_shoes", "/obj/item/clothing/shoes/clown_shoes", {
	on: 0,
	bananium: null,
	name: "mk-honk prototype shoes",
	desc: "Lost prototype of advanced clown tech. Powered by bananium, these shoes leave a trail of chaos in their wake.",
	icon_state: "clown_prototype_off",
	actions_types: null,
});

// bananashoes.dm:9
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// bananashoes.dm:12
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.bananium = (yield* new_(T("/datum/material_container"), this, list("$bananium"), 200000));
	return f.dot;
}, true);

// bananashoes.dm:17
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/step_action", function* step_action(f: Frame) {
	if (this.on) {
		if (this.footstep > 1) {
			playsound(this, rt.rsc("sound/items/bikehorn.ogg"), 75, 1);
			this.footstep = 0;
		} else {
			this.footstep++;
		}
		yield* new_(T("/obj/item/weapon/grown/bananapeel/specialpeel"), rt.getStep(f, this, turn(f.usr.dir, 180)));
		this.bananium.use_amount_type(100, "$bananium");
		if (this.bananium.amount("$bananium") < 100) {
			this.on = (!this.on ? 1 : 0);
			(rt.modSrcVar(f, "flags", 16776191, rt.bitAnd));
			yield* this.update_icon();
			to_chat(this.loc, "<span class='warning'>You ran out of bananium!</span>");
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// bananashoes.dm:34
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let sheet_amount: Value = null;
	if (sheet_amount = (yield* this.bananium.retrieve_all())) {
		to_chat(user, `<span class='notice'>You retrieve ${sheet_amount} sheets of bananium from the prototype shoes.</span>`);
	} else {
		to_chat(user, "<span class='notice'>You cannot retrieve any bananium from the prototype shoes.</span>");
	}
	return f.dot;
}, true);

// bananashoes.dm:41
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let bananium_amount: Value = null;
	if (!this.bananium.get_item_material_amount(O)) {
		to_chat(user, "<span class='notice'>This item has no bananium!</span>");
		return f.dot;
	}
	if (!(yield* user.dropItemToGround(O))) {
		to_chat(user, `<span class='notice'>You can't drop ${O}!</span>`);
		return f.dot;
	}
	if (bananium_amount = (yield* this.bananium.insert_item(O))) {
		to_chat(user, `<span class='notice'>You insert ${O} into the prototype shoes.</span>`);
		yield* qdel(O);
	} else {
		to_chat(user, "<span class='notice'>You are unable to insert more bananium!</span>");
	}
	return f.dot;
}, true);

// bananashoes.dm:56
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any;
	parent_proc();
	let ban_amt: Value = this.bananium.amount("$bananium");
	let $0: any = user;
	if (this.on) {
		$1 = "enabled";
	} else {
		$1 = "disabled";
	}
	to_chat($0, `<span class='notice'>The shoes are ${$1}. There is ${ban_amt ? ban_amt : "no"} bananium left.</span>`);
	return f.dot;
}, false);

// bananashoes.dm:61
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	if (this.bananium.amount("$bananium")) {
		this.on = (!this.on ? 1 : 0);
		yield* this.update_icon();
		to_chat(user, `<span class='notice'>You ${this.on ? "activate" : "deactivate"} the prototype shoes.</span>`);
		if (this.on) {
			(rt.modSrcVar(f, "flags", NOSLIP, rt.bitOr));
		} else {
			(rt.modSrcVar(f, "flags", 16776191, rt.bitAnd));
		}
	} else {
		to_chat(user, "<span class='warning'>You need bananium to turn the prototype shoes on!</span>");
	}
	return f.dot;
}, true);

// bananashoes.dm:74
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	if (this.on) {
		this.icon_state = "clown_prototype_on";
	} else {
		this.icon_state = "clown_prototype_off";
	}
	f.usr.update_inv_shoes();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);
