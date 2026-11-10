// Based on /tg/station's code/game/objects/items/weapons/implants/implanter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7430, "/obj/item/weapon/implanter", "/obj/item/weapon", {
	imp: null,
	imp_type: null,
	throw_speed: 3,
	throw_range: 5,
	name: "implanter",
	desc: "A sterile automatic implant injector.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "implanter0",
	item_state: "syringe_0",
	w_class: 2,
	origin_tech: "materials=2;biotech=3",
	materials: null,
});

// implanter.dm:11
rt.def("/obj/item/weapon/implanter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 600, "$glass", 200]);
	return f.dot;
});

// implanter.dm:18
rt.def("/obj/item/weapon/implanter/proc/update_icon", function update_icon(f: Frame) {
	if (this.imp) {
		this.icon_state = "implanter1";
		this.origin_tech = this.imp.origin_tech;
	} else {
		this.icon_state = "implanter0";
		this.origin_tech = rt.initial(f, this, "origin_tech");
	}
	return f.dot;
});

// implanter.dm:26
rt.def("/obj/item/weapon/implanter/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let _T: Value = null;
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	if (!(user && this.imp)) return f.dot;
	if (M != user) {
		M.visible_message(`<span class='warning'>${user} is attempting to implant ${M}.</span>`);
	}
	if (!((_T = rt.getStep(f, M, 0)) && (M == user || (yield* do_mob(user, M, 50))))) return f.dot;
	if (!(this && this.imp)) return f.dot;
	if (yield* this.imp.implant(M, user)) {
		if (M == user) {
			to_chat(user, "<span class='notice'>You implant yourself.</span>");
		} else {
			M.visible_message(`${user} has implanted ${M}.`, `<span class='notice'>${user} implants you.</span>`);
		}
		this.imp = null;
		yield* this.update_icon();
	} else {
		to_chat(user, `<span class='warning'>${this} fails to implant ${M}.</span>`);
	}
	return f.dot;
}, true);

// implanter.dm:46
rt.def("/obj/item/weapon/implanter/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let t: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		t = (yield* stripped_input(user, "What would you like the label to be?", this.name, null));
		if (user.get_active_held_item() != W) {
			return f.dot;
		}
		if (!(get_dist(this, user) <= 1) && this.loc != user) {
			return f.dot;
		}
		if (t) {
			this.name = `implanter (${t})`;
		} else {
			this.name = "implanter";
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// implanter.dm:60
rt.def("/obj/item/weapon/implanter/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (this.imp_type) {
		this.imp = (yield* new_(this.imp_type, this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);
