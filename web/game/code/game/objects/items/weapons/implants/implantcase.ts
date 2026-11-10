// Based on /tg/station's code/game/objects/items/weapons/implants/implantcase.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7418, "/obj/item/weapon/implantcase", "/obj/item/weapon", {
	imp: null,
	imp_type: null,
	throw_speed: 2,
	throw_range: 5,
	name: "implant case",
	desc: "A glass case containing an implant.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "implantcase-0",
	item_state: "implantcase",
	w_class: 1,
	origin_tech: "materials=1;biotech=2",
	materials: null,
});

// implantcase.dm:11
rt.def("/obj/item/weapon/implantcase/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 500]);
	return f.dot;
});

// implantcase.dm:18
rt.def("/obj/item/weapon/implantcase/proc/update_icon", function update_icon(f: Frame) {
	if (this.imp) {
		this.icon_state = `implantcase-${this.imp.item_color}`;
		this.origin_tech = this.imp.origin_tech;
		this.reagents = this.imp.reagents;
	} else {
		this.icon_state = "implantcase-0";
		this.origin_tech = rt.initial(f, this, "origin_tech");
		this.reagents = null;
	}
	return f.dot;
});

// implantcase.dm:28
rt.def("/obj/item/weapon/implantcase/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let t: Value = null, I: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		t = (yield* stripped_input(user, "What would you like the label to be?", this.name, null));
		if (user.get_active_held_item() != W) {
			return f.dot;
		}
		if (!(get_dist(this, user) <= 1) && this.loc != user) {
			return f.dot;
		}
		if (t) {
			this.name = `implant case - '${t}'`;
		} else {
			this.name = "implant case";
		}
	} else if (rt.istype(W, T("/obj/item/weapon/implanter"))) {
		if ((I = W).imp) {
			if (this.imp || I.imp.imp_in) {
				return f.dot;
			}
			I.imp.loc = this;
			this.imp = I.imp;
			I.imp = null;
			yield* this.update_icon();
			yield* I.update_icon();
		} else {
			if (this.imp) {
				if (I.imp) {
					return f.dot;
				}
				this.imp.loc = I;
				I.imp = this.imp;
				this.imp = null;
				yield* this.update_icon();
			}
			yield* I.update_icon();
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// implantcase.dm:62
rt.def("/obj/item/weapon/implantcase/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (this.imp_type) {
		this.imp = (yield* new_(this.imp_type, this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);
