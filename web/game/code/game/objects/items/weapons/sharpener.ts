// Based on /tg/station's code/game/objects/items/weapons/sharpener.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5796, "/obj/item/weapon/sharpener", "/obj/item/weapon", {
	used: 0,
	increment: 4,
	max: 30,
	prefix: "sharpened",
	requires_sharpness: 1,
	name: "whetstone",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "sharpener",
	desc: "A block that makes things sharp.",
});

// sharpener.dm:15
rt.def("/obj/item/weapon/sharpener/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	let TH: Value = null;
	if (this.used) {
		to_chat(user, "<span class='notice'>The sharpening block is too worn to use again.</span>");
		return f.dot;
	}
	if (I.force >= this.max || I.throwforce >= this.max) {
		to_chat(user, `<span class='notice'>${I} is much too powerful to sharpen further.</span>`);
		return f.dot;
	}
	if (this.requires_sharpness && !I.sharpness) {
		to_chat(user, "<span class='notice'>You can only sharpen items that are already sharp, such as knives.</span>");
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/melee/energy"))) {
		to_chat(user, fmt("<span class='notice'>You don't think ％！ will be the thing getting modified if you use it on ％！.</span>", [I, this]));
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/twohanded"))) {
		if ((TH = I).force_wielded >= this.max) {
			to_chat(user, `<span class='notice'>${TH} is much too powerful to sharpen further.</span>`);
			return f.dot;
		}
		if (TH.wielded) {
			to_chat(user, `<span class='notice'>${TH} must be unwielded before it can be sharpened.</span>`);
			return f.dot;
		}
		if (TH.force_wielded > rt.initial(f, TH, "force_wielded")) {
			to_chat(user, `<span class='notice'>${TH} has already been refined before. It cannot be sharpened further.</span>`);
			return f.dot;
		}
		TH.force_wielded = max(0, min(TH.force_wielded + this.increment, this.max));
	}
	if (I.force > rt.initial(f, I, "force")) {
		to_chat(user, `<span class='notice'>${I} has already been refined before. It cannot be sharpened further.</span>`);
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} sharpens ${I} with ${this}!</span>`, `<span class='notice'>You sharpen ${I}, making it much more deadly than before.</span>`);
	I.sharpness = 2;
	I.force = max(0, min(I.force + this.increment, this.max));
	I.throwforce = max(0, min(I.throwforce + this.increment, this.max));
	I.name = `${this.prefix} ${I.name}`;
	this.name = `worn out ${this.name}`;
	this.desc = `${this.desc} At least, it used to.`;
	this.used = 1;
	return f.dot;
});
