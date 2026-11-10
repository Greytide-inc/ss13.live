// Based on /tg/station's code/modules/clothing/head/soft_caps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(8073, "/obj/item/clothing/head/soft", "/obj/item/clothing/head", {
	flipped: 0,
	name: "cargo cap",
	desc: "It's a baseball hat in a tasteless yellow colour.",
	icon_state: "cargosoft",
	item_state: "helmet",
	item_color: "cargo",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/cargo_tech"),
});

// soft_caps.dm:13
rt.def("/obj/item/clothing/head/soft/proc/dropped", function* dropped(f: Frame) {
	this.icon_state = `${this.item_color}soft`;
	this.flipped = 0;
	yield* parent_proc();
	return f.dot;
}, true);

// soft_caps.dm:21
rt.def("/obj/item/clothing/head/soft/verb/flipcap", function* flipcap(f: Frame) {
	yield* this.flip(f.usr);
	return f.dot;
}, true, { verb: { name: "Flip cap", category: "Object" } });

// soft_caps.dm:25
rt.def("/obj/item/clothing/head/soft/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(yield* user.canUseTopic(this, { be_close: 1 }))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	} else {
		yield* this.flip(user);
	}
	return f.dot;
}, true);

// soft_caps.dm:34
rt.def("/obj/item/clothing/head/soft/proc/flip", function* flip(f: Frame, user: Value) {
	if (!(user.canmove && !user.stat && !user.restrained())) return f.dot;
	this.flipped = (!this.flipped ? 1 : 0);
	if (this.flipped) {
		this.icon_state = `${this.item_color}soft_flipped`;
		to_chat(user, "<span class='notice'>You flip the hat backwards.</span>");
	} else {
		this.icon_state = `${this.item_color}soft`;
		to_chat(user, "<span class='notice'>You flip the hat back in normal position.</span>");
	}
	yield* f.usr.update_inv_head();
	return f.dot;
}, true);

// soft_caps.dm:45
rt.def("/obj/item/clothing/head/soft/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `<span class='notice'>Alt-click the cap to flip it ${this.flipped ? "forwards" : "backwards"}.</span>`);
	return f.dot;
}, false);

rt.type(8084, "/obj/item/clothing/head/soft/sec", "/obj/item/clothing/head/soft", {
	name: "security cap",
	desc: "It's a robust baseball hat in tasteful red colour.",
	icon_state: "secsoft",
	item_color: "sec",
	armor: null,
	strip_delay: 60,
	dog_fashion: null,
});

// soft_caps.dm:123
rt.def("/obj/item/clothing/head/soft/sec/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 25, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 20, "acid", 50]);
	return f.dot;
});
