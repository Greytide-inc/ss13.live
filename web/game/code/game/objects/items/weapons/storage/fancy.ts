// Based on /tg/station's code/game/objects/items/weapons/storage/fancy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5551, "/obj/item/weapon/storage/fancy", "/obj/item/weapon/storage", {
	icon_type: "donut",
	spawn_type: null,
	fancy_open: 0,
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "donutbox6",
	name: "donut box",
	resistance_flags: 4,
});

// fancy.dm:26
rt.def("/obj/item/weapon/storage/fancy/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.storage_slots, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(this.spawn_type, this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// fancy.dm:31
rt.def("/obj/item/weapon/storage/fancy/proc/update_icon", function update_icon(f: Frame, itemremoved: Value) {
	let total_contents: Value = null;
	itemremoved ??= 0;
	if (this.fancy_open) {
		total_contents = rt.len(f, this.contents) - itemremoved;
		this.icon_state = `${this.icon_type}box${total_contents}`;
	} else {
		this.icon_state = `${this.icon_type}box`;
	}
	return f.dot;
});

// fancy.dm:37
rt.def("/obj/item/weapon/storage/fancy/proc/examine", function examine(f: Frame, user: Value) {
	let $0: any, $1: any;
	parent_proc();
	if (!this.fancy_open) return f.dot;
	if (rt.len(f, this.contents) == 1) {
		to_chat(user, `There is one ${this.icon_type} left.`);
	} else {
		$0 = user;
		if (rt.len(f, this.contents) <= 0) {
			$1 = "no";
		} else {
			$1 = `${rt.len(f, this.contents)}`;
		}
		to_chat($0, `There are ${$1} ${this.icon_type}s left.`);
	}
	return f.dot;
}, false);

// fancy.dm:45
rt.def("/obj/item/weapon/storage/fancy/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.fancy_open = (!this.fancy_open ? 1 : 0);
	this.update_icon();
	return f.dot;
});

// fancy.dm:49
rt.def("/obj/item/weapon/storage/fancy/proc/content_can_dump", function* content_can_dump(f: Frame, dest_object: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.fancy_open = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// fancy.dm:56
rt.def("/obj/item/weapon/storage/fancy/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.fancy_open = 1;
	return (yield* parent_proc());
}, true, { args: ["W", "prevent_warning", "user"] });

// fancy.dm:60
rt.def("/obj/item/weapon/storage/fancy/proc/remove_from_storage", function* remove_from_storage(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	this.fancy_open = 1;
	return (yield* parent_proc());
}, true, { args: ["W", "new_location", "burn"] });

rt.type(5552, "/obj/item/weapon/storage/fancy/donut_box", "/obj/item/weapon/storage/fancy", {
	icon_type: "donut",
	fancy_open: 1,
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "donutbox6",
	name: "donut box",
	storage_slots: 6,
	spawn_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut"),
	can_hold: null,
});

// fancy.dm:72
rt.def("/obj/item/weapon/storage/fancy/donut_box/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/food/snacks/donut"));
	return f.dot;
});

rt.type(5553, "/obj/item/weapon/storage/fancy/egg_box", "/obj/item/weapon/storage/fancy", {
	icon_type: "egg",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "eggbox",
	name: "egg box",
	storage_slots: 12,
	spawn_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/egg"),
	can_hold: null,
});

// fancy.dm:86
rt.def("/obj/item/weapon/storage/fancy/egg_box/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/food/snacks/egg"));
	return f.dot;
});

rt.type(5555, "/obj/item/weapon/storage/fancy/cigarettes", "/obj/item/weapon/storage/fancy", {
	icon_type: "cigarette",
	name: "１Space Cigarettes packet",
	desc: "The most popular brand of cigarettes, sponsors of the Space Olympics.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cig",
	item_state: "cigpacket",
	w_class: 1,
	throwforce: 0,
	slot_flags: 512,
	storage_slots: 6,
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/space_cigarette"),
	can_hold: null,
});

// fancy.dm:122
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/clothing/mask/cigarette"), T("/obj/item/weapon/lighter"));
	return f.dot;
});

// fancy.dm:127
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let lighter: Value = null;
	let $e: any;
	if (user.get_active_held_item()) {
		return f.dot;
	}
	rt.forList(f, 0, this, T("/obj/item/weapon/lighter"));
	if (($e = rt.next(f, 0)) !== undefined) {
		lighter = $e;
		yield* this.remove_from_storage(lighter, user.loc);
		yield* user.put_in_active_hand(lighter);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// fancy.dm:135
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/update_icon", function update_icon(f: Frame) {
	let i: Value = null, C: Value = null, inserted_overlay: Value = null;
	if (this.fancy_open || !rt.len(f, this.contents)) {
		this.cut_overlays();
		if (!rt.len(f, this.contents)) {
			this.icon_state = `${rt.initial(f, this, "icon_state")}_empty`;
		} else {
			this.icon_state = rt.initial(f, this, "icon_state");
			this.add_overlay(`${this.icon_state}_open`);
			i = rt.len(f, this.contents);
			for (C of each(this.contents)) {
				(inserted_overlay = mutable_appearance(this.icon)).pixel_x = 1 * (i - 1);
				if (rt.istype(C, T("/obj/item/weapon/lighter/greyscale"))) {
					inserted_overlay.icon_state = "lighter_in";
				} else if (rt.istype(C, T("/obj/item/weapon/lighter"))) {
					inserted_overlay.icon_state = "zippo_in";
				} else {
					inserted_overlay.icon_state = "cigarette";
				}
				this.add_overlay(inserted_overlay);
				i--;
			}
		}
	} else {
		this.cut_overlays();
	}
	return f.dot;
});

// fancy.dm:158
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let cig: Value = null, W: Value = null;
	if (!ismob(M)) {
		return f.dot;
	}
	if (cig = rt.locateIn(f, T("/obj/item/clothing/mask/cigarette"), this.contents)) {
		if (M == user && rt.len(f, this.contents) > 0 && !user.wear_mask) {
			yield* this.remove_from_storage((W = cig), M);
			yield* M.equip_to_slot_if_possible(W, slot_wear_mask);
			this.contents -= W;
			to_chat(user, `<span class='notice'>You take a ${this.icon_type} out of the pack.</span>`);
		} else {
			yield* parent_proc();
		}
	} else {
		to_chat(user, `<span class='notice'>There are no ${this.icon_type}s left in the pack.</span>`);
	}
	return f.dot;
}, true);

rt.type(5567, "/obj/item/weapon/storage/fancy/rollingpapers", "/obj/item/weapon/storage/fancy", {
	icon_type: "rolling paper",
	name: "rolling paper pack",
	desc: "A pack of NanoTrasen brand rolling papers.",
	w_class: 1,
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cig_paper_pack",
	storage_slots: 10,
	spawn_type: rt.typePath("/obj/item/weapon/rollingpaper"),
	can_hold: null,
});

// fancy.dm:229
rt.def("/obj/item/weapon/storage/fancy/rollingpapers/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/rollingpaper"));
	return f.dot;
});

// fancy.dm:233
rt.def("/obj/item/weapon/storage/fancy/rollingpapers/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (rt.len(f, this.contents)) return f.dot;
	this.add_overlay(`${this.icon_state}_empty`);
	return f.dot;
});

rt.type(5564, "/obj/item/weapon/storage/fancy/cigarettes/cigars", "/obj/item/weapon/storage/fancy/cigarettes", {
	icon_type: "premium cigar",
	name: "１premium cigar case",
	desc: "A case of premium cigars. Very expensive.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cigarcase",
	w_class: 3,
	storage_slots: 5,
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/cigar"),
	can_hold: null,
});

// fancy.dm:248
rt.def("/obj/item/weapon/storage/fancy/cigarettes/cigars/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/clothing/mask/cigarette/cigar"));
	return f.dot;
});

// fancy.dm:253
rt.def("/obj/item/weapon/storage/fancy/cigarettes/cigars/proc/update_icon", function update_icon(f: Frame) {
	let cigar_overlay: Value = null, c: Value = null;
	this.cut_overlays();
	if (this.fancy_open) {
		this.add_overlay(`${this.icon_state}_open`);
		cigar_overlay = mutable_appearance(this.icon, this.icon_type);
		c = rt.len(f, this.contents);
		while (c >= 1) {
			cigar_overlay.pixel_x = 4 * (c - 1);
			this.add_overlay(cigar_overlay);
			c--;
		}
	} else {
		this.icon_state = "cigarcase";
	}
	return f.dot;
});
