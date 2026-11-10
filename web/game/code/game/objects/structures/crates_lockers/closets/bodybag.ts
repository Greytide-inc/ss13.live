// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/bodybag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12289, "/obj/structure/closet/body_bag", "/obj/structure/closet", {
	foldedbag_path: rt.typePath("/obj/item/bodybag"),
	tagged: 0,
	mob_storage_capacity: 2,
	open_sound: rt.rsc("sound/items/zip.ogg"),
	close_sound: rt.rsc("sound/items/zip.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/cloth"),
	delivery_icon: null,
	anchorable: 0,
	name: "body bag",
	desc: "A plastic bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bodybag",
	density: 0,
	integrity_failure: 0,
});

// bodybag.dm:19
rt.def("/obj/structure/closet/body_bag/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let t: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/pen")) || rt.istype(I, T("/obj/item/toy/crayon"))) {
		t = (yield* stripped_input(user, "What would you like the label to be?", this.name, null, 53));
		if (user.get_active_held_item() != I) {
			return f.dot;
		}
		if (!(get_dist(this, user) <= 1) && this.loc != user) {
			return f.dot;
		}
		if (t) {
			this.name = `body bag - ${t}`;
			this.tagged = 1;
			yield* this.update_icon();
		} else {
			this.name = "body bag";
		}
		return f.dot;
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/wirecutters"))) return f.dot;
		to_chat(user, `<span class='notice'>You cut the tag off ${this}.</span>`);
		this.name = "body bag";
		this.tagged = 0;
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// bodybag.dm:39
rt.def("/obj/structure/closet/body_bag/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!this.tagged) return f.dot;
	this.add_overlay("bodybag_label");
	return f.dot;
});

// bodybag.dm:44
rt.def("/obj/structure/closet/body_bag/proc/close", function* close(f: Frame) {
	if (yield* parent_proc()) {
		this.density = 0;
		return 1;
	}
	return 0;
}, true);

// bodybag.dm:50
rt.def("/obj/structure/closet/body_bag/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	yield* parent_proc();
	if (!(over_object == f.usr && this.Adjacent(f.usr) && (get_dist(this, f.usr) <= 1 || f.usr.contents.Find(this)))) return f.dot;
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (this.opened) {
		return 0;
	}
	if (rt.len(f, this.contents)) {
		return 0;
	}
	this.visible_message(`<span class='notice'>${f.usr} folds up ${this}.</span>`);
	let B: Value = (yield* new_(this.foldedbag_path, rt.getStep(f, this, 0)));
	yield* f.usr.put_in_hands(B);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12290, "/obj/structure/closet/body_bag/bluespace", "/obj/structure/closet/body_bag", {
	foldedbag_path: rt.typePath("/obj/item/bodybag/bluespace"),
	mob_storage_capacity: 15,
	max_mob_size: 3,
	name: "bluespace body bag",
	desc: "A bluespace body bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bluebodybag",
});

// bodybag.dm:74
rt.def("/obj/structure/closet/body_bag/bluespace/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let B: Value = null, A: Value = null;
	yield* parent_proc();
	if (!(over_object == f.usr && this.Adjacent(f.usr) && (get_dist(this, f.usr) <= 1 || f.usr.contents.Find(this)))) return f.dot;
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (this.opened) {
		return 0;
	}
	if (rt.len(f, this.contents) >= this.mob_storage_capacity / 2) {
		to_chat(f.usr, `<span class='warning'>There are too many things inside of ${this} to fold it up!</span>`);
		return 0;
	}
	for (B of each(this, T("/obj/item/bodybag/bluespace"))) {
		to_chat(f.usr, "<span class='warning'>You can't recursively fold bluespace body bags!</span>");
		return 0;
	}
	this.visible_message(`<span class='notice'>${f.usr} folds up ${this}.</span>`);
	B = (yield* new_(this.foldedbag_path, rt.getStep(f, this, 0)));
	yield* f.usr.put_in_hands(B);
	for (A of each(this.contents, T("/atom/movable"))) {
		yield* A.forceMove(B);
		if (rt.istype(A, T("/mob/living"))) {
			to_chat(A, "<span class='userdanger'>You're suddenly forced into a tiny, compressed space!</span>");
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
