// Based on /tg/station's code/modules/surgery/organs/autosurgeon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9431, "/obj/item/device/autosurgeon", "/obj/item/device", {
	storedorgan: null,
	uses: -1,
	starting_organ: null,
	organ_type: rt.typePath("/obj/item/organ"),
	name: "autosurgeon",
	desc: "A device that automatically inserts an implant or organ into the user without the hassle of extensive surgery. It has a slot to insert implants/organs and a screwdriver slot for removing accidentally added items.",
	icon_state: "autoimplanter",
	item_state: "walkietalkie",
	w_class: 2,
});

// autosurgeon.dm:15
rt.def("/obj/item/device/autosurgeon/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.starting_organ) return f.dot;
	yield* this.insert_organ((yield* new_(this.starting_organ, this)));
	return f.dot;
}, true);

// autosurgeon.dm:20
rt.def("/obj/item/device/autosurgeon/proc/insert_organ", function* insert_organ(f: Frame, I: Value) {
	this.storedorgan = I;
	yield* I.forceMove(this);
	this.name = `${rt.initial(f, this, "name")} (${this.storedorgan.name})`;
	return f.dot;
}, true);

// autosurgeon.dm:25
rt.def("/obj/item/device/autosurgeon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.uses) {
		to_chat(user, `<span class='warning'>${this} has already been used. The tools are dull and won't reactivate.</span>`);
		return f.dot;
	} else if (!this.storedorgan) {
		to_chat(user, `<span class='notice'>${this} currently has no implant stored.</span>`);
		return f.dot;
	}
	yield* this.storedorgan.Insert(user);
	user.visible_message(`<span class='notice'>${user} presses a button on ${this}, and you hear a short mechanical noise.</span>`, `<span class='notice'>You feel a sharp sting as ${this} plunges into your body.</span>`);
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/weapons/circsawhit.ogg"), 50, 1);
	this.storedorgan = null;
	this.name = rt.initial(f, this, "name");
	if (this.uses != INFINITE) {
		this.uses--;
	}
	if (this.uses) return f.dot;
	this.desc = `${rt.initial(f, this, "desc")} Looks like it's been used up.`;
	return f.dot;
}, true);

// autosurgeon.dm:42
rt.def("/obj/item/device/autosurgeon/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let floorloc: Value = null;
	if (rt.op(f, "IsType", [], [I, this.organ_type])) {
		if (this.storedorgan) {
			to_chat(user, `<span class='notice'>${this} already has an implant stored.</span>`);
			return f.dot;
		} else if (!this.uses) {
			to_chat(user, `<span class='notice'>${this} has already been used up.</span>`);
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		yield* I.forceMove(this);
		this.storedorgan = I;
		to_chat(user, `<span class='notice'>You insert the ${I} into ${this}.</span>`);
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/screwdriver"))) return f.dot;
		if (!this.storedorgan) {
			to_chat(user, `<span class='notice'>There's no implant in ${this} for you to remove.</span>`);
		} else {
			(floorloc = rt.getStep(f, user, 0)).contents += this.contents;
			to_chat(user, `<span class='notice'>You remove the ${this.storedorgan} from ${this}.</span>`);
			playsound(rt.getStep(f, user, 0), I.usesound, 50, 1);
			this.storedorgan = null;
			if (this.uses != INFINITE) {
				this.uses--;
			}
			if (this.uses) return f.dot;
			this.desc = `${rt.initial(f, this, "desc")} Looks like it's been used up.`;
		}
	}
	return f.dot;
}, true);
