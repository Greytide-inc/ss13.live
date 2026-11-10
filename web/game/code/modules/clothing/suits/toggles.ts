// Based on /tg/station's code/modules/clothing/suits/toggles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7809, "/obj/item/clothing/suit/hooded", "/obj/item/clothing/suit", {
	hood: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood"),
	actions_types: null,
	hooded: 1,
});

// toggles.dm:4
rt.def("/obj/item/clothing/suit/hooded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_hood"));
	return f.dot;
});

// toggles.dm:10
rt.def("/obj/item/clothing/suit/hooded/proc/New", function* New(f: Frame) {
	yield* this.MakeHood();
	yield* parent_proc();
	return f.dot;
}, true);

// toggles.dm:14
rt.def("/obj/item/clothing/suit/hooded/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* qdel(this.hood);
	this.hood = null;
	return f.dot;
}, true);

// toggles.dm:19
rt.def("/obj/item/clothing/suit/hooded/proc/MakeHood", function* MakeHood(f: Frame) {
	let W: Value = null;
	if (this.hood) return f.dot;
	(W = (yield* new_(this.hoodtype, this))).suit = this;
	this.hood = W;
	return f.dot;
}, true);

// toggles.dm:25
rt.def("/obj/item/clothing/suit/hooded/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.ToggleHood();
	return f.dot;
}, true);

// toggles.dm:28
rt.def("/obj/item/clothing/suit/hooded/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != slot_wear_suit) return f.dot;
	return 1;
});

// toggles.dm:32
rt.def("/obj/item/clothing/suit/hooded/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (slot != slot_wear_suit) {
		yield* this.RemoveHood();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// toggles.dm:37
rt.def("/obj/item/clothing/suit/hooded/proc/RemoveHood", function* RemoveHood(f: Frame) {
	let H: Value = null, X: Value = null, A: Value = null;
	this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	this.suittoggled = 0;
	if (rt.istype(this.hood.loc, T("/mob/living/carbon/human"))) {
		yield* (H = this.hood.loc).transferItemToLoc(this.hood, this, 1);
		yield* H.update_inv_wear_suit();
	} else {
		yield* this.hood.forceMove(this);
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// toggles.dm:50
rt.def("/obj/item/clothing/suit/hooded/proc/dropped", function* dropped(f: Frame) {
	yield* parent_proc();
	yield* this.RemoveHood();
	return f.dot;
}, true);

// toggles.dm:54
rt.def("/obj/item/clothing/suit/hooded/proc/ToggleHood", function* ToggleHood(f: Frame) {
	let H: Value = null, X: Value = null, A: Value = null;
	if (!this.suittoggled) {
		if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
			if ((H = this.loc).wear_suit != this) {
				to_chat(H, `<span class='warning'>You must be wearing ${this} to put up the hood!</span>`);
				return f.dot;
			}
			if (H.head) {
				to_chat(H, "<span class='warning'>You're already wearing something on your head!</span>");
				return f.dot;
			} else if (yield* H.equip_to_slot_if_possible(this.hood, slot_head, 0, 0, 1)) {
				this.suittoggled = 1;
				this.icon_state = `${rt.initial(f, this, "icon_state")}_t`;
				yield* H.update_inv_wear_suit();
				for (X of each(this.actions)) {
					yield* (A = X).UpdateButtonIcon();
				}
			}
		}
	} else {
		yield* this.RemoveHood();
	}
	return f.dot;
}, true);

rt.type(8029, "/obj/item/clothing/head/hooded", "/obj/item/clothing/head", {
	suit: null,
});

// toggles.dm:78
rt.def("/obj/item/clothing/head/hooded/proc/Destroy", function* Destroy(f: Frame) {
	this.suit = null;
	return (yield* parent_proc());
}, true);

// toggles.dm:81
rt.def("/obj/item/clothing/head/hooded/proc/dropped", function* dropped(f: Frame) {
	yield* parent_proc();
	if (!this.suit) return f.dot;
	yield* this.suit.RemoveHood();
	return f.dot;
}, true);

// toggles.dm:86
rt.def("/obj/item/clothing/head/hooded/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (slot == slot_head) return f.dot;
	if (this.suit) {
		yield* this.suit.RemoveHood();
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(7849, "/obj/item/clothing/suit/toggle", "/obj/item/clothing/suit", {});

// toggles.dm:96
rt.def("/obj/item/clothing/suit/toggle/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(yield* user.canUseTopic(this, { be_close: 1 }))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	} else {
		yield* this.suit_toggle(user);
	}
	return f.dot;
}, true);

// toggles.dm:104
rt.def("/obj/item/clothing/suit/toggle/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.suit_toggle();
	return f.dot;
}, true);

// toggles.dm:109
rt.def("/obj/item/clothing/suit/toggle/proc/suit_toggle", function* suit_toggle(f: Frame) {
	let X: Value = null, A: Value = null;
	if (!this.can_use(f.usr)) {
		return 0;
	}
	to_chat(f.usr, `<span class='notice'>You toggle ${this}'s ${this.togglename}.</span>`);
	if (this.suittoggled) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
		this.suittoggled = 0;
	} else if (!this.suittoggled) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_t`;
		this.suittoggled = 1;
	}
	yield* f.usr.update_inv_wear_suit();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true, { verb: { src: 11 } });

// toggles.dm:125
rt.def("/obj/item/clothing/suit/toggle/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `Alt-click on ${this} to toggle the ${this.togglename}.`);
	return f.dot;
}, false);

// toggles.dm:130
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/New", function* New(f: Frame) {
	yield* this.MakeHelmet();
	yield* parent_proc();
	return f.dot;
}, true);

// toggles.dm:135
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/Destroy", function* Destroy(f: Frame) {
	if (this.helmet) {
		this.helmet.suit = null;
		yield* qdel(this.helmet);
	}
	yield* qdel(this.jetpack);
	return (yield* parent_proc());
}, true);

// toggles.dm:142
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/Destroy", function* Destroy(f: Frame) {
	if (this.suit) {
		this.suit.helmet = null;
	}
	return (yield* parent_proc());
}, true);

// toggles.dm:146
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/MakeHelmet", function* MakeHelmet(f: Frame) {
	let W: Value = null;
	if (!this.helmettype) {
		return f.dot;
	}
	if (this.helmet) return f.dot;
	(W = (yield* new_(this.helmettype, this))).suit = this;
	this.helmet = W;
	return f.dot;
}, true);

// toggles.dm:154
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* parent_proc();
	yield* this.ToggleHelmet();
	return f.dot;
}, true);

// toggles.dm:158
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (!this.helmettype) {
		return f.dot;
	}
	if (slot != slot_wear_suit) {
		yield* this.RemoveHelmet();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// toggles.dm:165
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/RemoveHelmet", function* RemoveHelmet(f: Frame) {
	let H: Value = null;
	if (!this.helmet) {
		return f.dot;
	}
	this.suittoggled = 0;
	if (rt.istype(this.helmet.loc, T("/mob/living/carbon/human"))) {
		H = this.helmet.loc;
		if (this.helmet.on) {
			yield* this.helmet.attack_self(H);
		}
		yield* H.transferItemToLoc(this.helmet, this, 1);
		yield* H.update_inv_wear_suit();
		to_chat(H, "<span class='notice'>The helmet on the hardsuit disengages.</span>");
		playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	} else {
		yield* this.helmet.forceMove(this);
	}
	return f.dot;
}, true);

// toggles.dm:180
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/dropped", function* dropped(f: Frame) {
	yield* parent_proc();
	yield* this.RemoveHelmet();
	return f.dot;
}, true);

// toggles.dm:185
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/ToggleHelmet", function* ToggleHelmet(f: Frame) {
	let H: Value = this.loc;
	if (!this.helmettype) {
		return f.dot;
	}
	if (!this.helmet) {
		return f.dot;
	}
	if (!this.suittoggled) {
		if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
			if (H.wear_suit != this) {
				to_chat(H, `<span class='warning'>You must be wearing ${this} to engage the helmet!</span>`);
				return f.dot;
			}
			if (H.head) {
				to_chat(H, "<span class='warning'>You're already wearing something on your head!</span>");
				return f.dot;
			} else if (yield* H.equip_to_slot_if_possible(this.helmet, slot_head, 0, 0, 1)) {
				to_chat(H, "<span class='notice'>You engage the helmet on the hardsuit.</span>");
				this.suittoggled = 1;
				yield* H.update_inv_wear_suit();
				playsound(this.loc, rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
			}
		}
	} else {
		yield* this.RemoveHelmet();
	}
	return f.dot;
}, true);
