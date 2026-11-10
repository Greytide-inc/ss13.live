// Based on /tg/station's code/game/objects/structures/bedsheet_bin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6951, "/obj/item/weapon/bedsheet", "/obj/item/weapon", {
	throw_speed: 1,
	throw_range: 2,
	name: "bedsheet",
	desc: "A surprisingly soft linen bedsheet.",
	icon: rt.rsc("icons/obj/bedsheets.dmi"),
	icon_state: "sheetwhite",
	item_state: "bedsheet",
	slot_flags: 8192,
	layer: 4,
	throwforce: 0,
	w_class: 1,
	item_color: "white",
	resistance_flags: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/ghost"),
});

// bedsheet_bin.dm:25
rt.def("/obj/item/weapon/bedsheet/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (yield* attempt_initiate_surgery(this, M, user)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// bedsheet_bin.dm:29
rt.def("/obj/item/weapon/bedsheet/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.drop_item();
	if (this.layer == rt.initial(f, this, "layer")) {
		this.layer = ABOVE_MOB_LAYER;
		to_chat(user, `<span class='notice'>You cover yourself with ${this}.</span>`);
	} else {
		this.layer = rt.initial(f, this, "layer");
		to_chat(user, `<span class='notice'>You smooth ${this} out beneath you.</span>`);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// bedsheet_bin.dm:40
rt.def("/obj/item/weapon/bedsheet/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wirecutters")) || I.is_sharp()) {
		this.transfer_fingerprints_to((C = (yield* new_(T("/obj/item/stack/sheet/cloth"), rt.getStep(f, this, 0), 3))));
		yield* C.add_fingerprint(user);
		yield* qdel(this);
		to_chat(user, `<span class='notice'>You tear ${this} up.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(6980, "/obj/item/weapon/bedsheet/random", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetrainbow",
	item_color: "rainbow",
	name: "random bedsheet",
	desc: "If you're reading this description ingame, something has gone wrong! Honk!",
});

// bedsheet_bin.dm:204
rt.def("/obj/item/weapon/bedsheet/random/proc/New", function New(f: Frame) {
	let B: Value = null;
	this.name = rt.initial(f, (B = pick(typesof(T("/obj/item/weapon/bedsheet")) - T("/obj/item/weapon/bedsheet") - T("/obj/item/weapon/bedsheet/random"))), "name");
	this.desc = rt.initial(f, B, "desc");
	this.icon_state = rt.initial(f, B, "icon_state");
	this.item_state = rt.initial(f, B, "item_state");
	this.item_color = rt.initial(f, B, "item_color");
	return f.dot;
});

rt.type(12722, "/obj/structure/bedsheetbin", "/obj/structure", {
	amount: 10,
	sheets: null,
	hidden: null,
	anchored: 1,
	name: "linen bin",
	desc: "It looks rather cosy.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "linenbin-full",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// bedsheet_bin.dm:221
rt.def("/obj/structure/bedsheetbin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.sheets = list();
	return f.dot;
});

// bedsheet_bin.dm:226
rt.def("/obj/structure/bedsheetbin/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.amount < 1) {
		to_chat(user, "There are no bed sheets in the bin.");
	} else if (this.amount == 1) {
		to_chat(user, "There is one bed sheet in the bin.");
	} else {
		to_chat(user, `There are ${this.amount} bed sheets in the bin.`);
	}
	return f.dot;
}, false);

// bedsheet_bin.dm:236
rt.def("/obj/structure/bedsheetbin/proc/update_icon", function update_icon(f: Frame) {
	if (this.amount === 0) {
		this.icon_state = "linenbin-empty";
	} else if (rt.inRange(this.amount, 1, 5)) {
		this.icon_state = "linenbin-half";
	} else {
		this.icon_state = "linenbin-full";
	}
	return f.dot;
});

// bedsheet_bin.dm:247
rt.def("/obj/structure/bedsheetbin/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (this.amount) {
		this.amount = 0;
		yield* this.update_icon();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// bedsheet_bin.dm:251
rt.def("/obj/structure/bedsheetbin/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/bedsheet"))) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		I.loc = this;
		this.sheets.Add(I);
		this.amount++;
		to_chat(user, `<span class='notice'>You put ${I} in ${this}.</span>`);
		yield* this.update_icon();
	} else {
		if (!(this.amount && !this.hidden && I.w_class < WEIGHT_CLASS_BULKY)) return f.dot;
		if (!(yield* user.drop_item())) {
			to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot hide it among the sheets!</span>", [I]));
			return f.dot;
		}
		I.loc = this;
		this.hidden = I;
		to_chat(user, `<span class='notice'>You hide ${I} among the sheets.</span>`);
	}
	return f.dot;
}, true);

// bedsheet_bin.dm:270
rt.def("/obj/structure/bedsheetbin/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// bedsheet_bin.dm:274
rt.def("/obj/structure/bedsheetbin/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let B: Value = null;
	if (user.lying) {
		return f.dot;
	}
	if (this.amount >= 1) {
		this.amount--;
		if (rt.len(f, this.sheets) > 0) {
			B = rt.index(this.sheets, rt.len(f, this.sheets));
			yield* this.sheets.Remove(B);
		} else {
			B = (yield* new_(T("/obj/item/weapon/bedsheet"), this.loc));
		}
		B.loc = user.loc;
		yield* user.put_in_hands(B);
		to_chat(user, `<span class='notice'>You take ${B} out of ${this}.</span>`);
		yield* this.update_icon();
		if (this.hidden) {
			this.hidden.loc = user.loc;
			to_chat(user, `<span class='notice'>${this.hidden} falls out of ${B}!</span>`);
			this.hidden = null;
		}
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// bedsheet_bin.dm:300
rt.def("/obj/structure/bedsheetbin/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	let B: Value = null;
	if (this.amount >= 1) {
		this.amount--;
		if (rt.len(f, this.sheets) > 0) {
			B = rt.index(this.sheets, rt.len(f, this.sheets));
			yield* this.sheets.Remove(B);
		} else {
			B = (yield* new_(T("/obj/item/weapon/bedsheet"), this.loc));
		}
		B.loc = this.loc;
		to_chat(user, `<span class='notice'>You telekinetically remove ${B} from ${this}.</span>`);
		yield* this.update_icon();
		if (this.hidden) {
			this.hidden.loc = this.loc;
			this.hidden = null;
		}
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);
