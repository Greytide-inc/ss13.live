// Based on /tg/station's code/game/objects/items/weapons/storage/lockbox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5576, "/obj/item/weapon/storage/lockbox", "/obj/item/weapon/storage", {
	locked: 1,
	broken: 0,
	open: 0,
	icon_locked: "lockbox+l",
	icon_closed: "lockbox",
	icon_broken: "lockbox+b",
	name: "lockbox",
	desc: "A locked box.",
	icon_state: "lockbox+l",
	item_state: "syringe_kit",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 14,
	storage_slots: 4,
	req_access: null,
});

// lockbox.dm:10
rt.def("/obj/item/weapon/storage/lockbox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(3);
	return f.dot;
});

// lockbox.dm:20
rt.def("/obj/item/weapon/storage/lockbox/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W.GetID()) {
		if (this.broken) {
			to_chat(user, "<span class='danger'>It appears to be broken.</span>");
			return f.dot;
		}
		if (yield* this.allowed(user)) {
			this.locked = (!this.locked ? 1 : 0);
			if (this.locked) {
				this.icon_state = this.icon_locked;
				to_chat(user, `<span class='danger'>You lock the ${this.name}!</span>`);
				this.close_all();
				return f.dot;
			} else {
				this.icon_state = this.icon_closed;
				to_chat(user, `<span class='danger'>You unlock the ${this.name}!</span>`);
				return f.dot;
			}
		} else {
			to_chat(user, "<span class='danger'>Access Denied.</span>");
			return f.dot;
		}
	}
	if (!this.locked) {
		return (yield* parent_proc());
	}
	to_chat(user, "<span class='danger'>It's locked!</span>");
	return f.dot;
}, true);

// lockbox.dm:45
rt.def("/obj/item/weapon/storage/lockbox/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	if (this.locked) {
		yield* this.add_fingerprint(f.usr);
		to_chat(f.usr, "<span class='warning'>It's locked!</span>");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// lockbox.dm:51
rt.def("/obj/item/weapon/storage/lockbox/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.broken) return f.dot;
	this.broken = 1;
	this.locked = 0;
	this.desc += "It appears to be broken.";
	this.icon_state = this.icon_broken;
	if (!user) return f.dot;
	this.visible_message(fmt("<span class='warning'>＄！ has been broken by ＀ with an electromagnetic card!</span>", [this, user]));
	return f.dot;
});

// lockbox.dm:61
rt.def("/obj/item/weapon/storage/lockbox/proc/show_to", function* show_to(f: Frame, user: Value) {
	if (this.locked) {
		to_chat(user, "<span class='warning'>It's locked!</span>");
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// lockbox.dm:69
rt.def("/obj/item/weapon/storage/lockbox/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	if (this.locked) {
		to_chat(user, "<span class='warning'>It's locked!</span>");
		return 0;
	}
	this.open = 1;
	return (yield* parent_proc());
}, true);

// lockbox.dm:77
rt.def("/obj/item/weapon/storage/lockbox/proc/can_be_inserted", function can_be_inserted(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (this.locked) {
		return 0;
	}
	return parent_proc();
}, false, { args: ["W", "stop_messages"] });

// lockbox.dm:81
rt.def("/obj/item/weapon/storage/lockbox/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.open = 1;
	yield* this.update_icon();
	return (yield* parent_proc());
}, true, { args: ["W", "prevent_warning", "user"] });

// lockbox.dm:85
rt.def("/obj/item/weapon/storage/lockbox/proc/remove_from_storage", function* remove_from_storage(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	this.open = 1;
	yield* this.update_icon();
	return (yield* parent_proc());
}, true, { args: ["W", "new_location", "burn"] });

rt.type(5577, "/obj/item/weapon/storage/lockbox/loyalty", "/obj/item/weapon/storage/lockbox", {
	name: "lockbox of mindshield implants",
	req_access: null,
});

// lockbox.dm:90
rt.def("/obj/item/weapon/storage/lockbox/loyalty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(1);
	return f.dot;
});

// lockbox.dm:93
rt.def("/obj/item/weapon/storage/lockbox/loyalty/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/implantcase/mindshield"), this);
	}
	rt.endFor(f, 0);
	yield* new_(T("/obj/item/weapon/implanter/mindshield"), this);
	return f.dot;
}, true);

rt.type(5578, "/obj/item/weapon/storage/lockbox/clusterbang", "/obj/item/weapon/storage/lockbox", {
	name: "lockbox of clusterbangs",
	desc: "You have a bad feeling about opening this.",
	req_access: null,
});

// lockbox.dm:101
rt.def("/obj/item/weapon/storage/lockbox/clusterbang/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(1);
	return f.dot;
});

// lockbox.dm:104
rt.def("/obj/item/weapon/storage/lockbox/clusterbang/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/grenade/clusterbuster"), this);
	return f.dot;
}, true);

rt.type(5579, "/obj/item/weapon/storage/lockbox/medal", "/obj/item/weapon/storage/lockbox", {
	icon_locked: "medalbox+l",
	icon_closed: "medalbox",
	icon_broken: "medalbox+b",
	name: "medal box",
	desc: "A locked box used to store medals of honor.",
	icon_state: "medalbox+l",
	item_state: "syringe_kit",
	w_class: 3,
	max_w_class: 2,
	storage_slots: 10,
	max_combined_w_class: 20,
	req_access: null,
	can_hold: null,
});

// lockbox.dm:115
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(20);

	this.can_hold = list(T("/obj/item/clothing/accessory/medal"));
	return f.dot;
});

// lockbox.dm:122
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/AltClick", function* AltClick(f: Frame) {
	if (!this.locked) {
		this.open = this.open ? 0 : 1;
		yield* this.update_icon();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// lockbox.dm:128
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/clothing/accessory/medal/gold/captain"), this);
	yield* new_(T("/obj/item/clothing/accessory/medal/silver/valor"), this);
	yield* new_(T("/obj/item/clothing/accessory/medal/silver/valor"), this);
	yield* new_(T("/obj/item/clothing/accessory/medal/silver/security"), this);
	yield* new_(T("/obj/item/clothing/accessory/medal/bronze_heart"), this);
	yield* new_(T("/obj/item/clothing/accessory/medal/plasma/nobel_science"), this);
	yield* new_(T("/obj/item/clothing/accessory/medal/plasma/nobel_science"), this);
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/accessory/medal/conduct"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// lockbox.dm:139
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/update_icon", function update_icon(f: Frame) {
	let i: Value = null, M: Value = null, medalicon: Value = null;
	let $e: any;
	this.cut_overlays();
	if (this.locked) {
		this.icon_state = "medalbox+l";
		this.open = 0;
	} else {
		this.icon_state = "medalbox";
		if (this.open) {
			this.icon_state += "open";
		}
		if (this.broken) {
			this.icon_state += "+b";
		}
		if (!(this.contents && this.open)) return f.dot;
		rt.forRange(f, 0, 1, rt.len(f, this.contents), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			M = rt.index(this.contents, i);
			medalicon = mutable_appearance(rt.initial(f, this, "icon"), M.medaltype);
			if (i > 1 && i <= 5) {
				medalicon.pixel_x += (i - 1) * 3;
			} else if (i > 5) {
				medalicon.pixel_y -= 7;
				medalicon.pixel_x -= 2;
				medalicon.pixel_x += (i - 6) * 3;
			}
			this.add_overlay(medalicon);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

rt.type(5580, "/obj/item/weapon/storage/lockbox/medal/sec", "/obj/item/weapon/storage/lockbox/medal", {
	name: "security medal box",
	desc: "A locked box used to store medals to be given to members of the security department.",
	req_access: null,
});

// lockbox.dm:164
rt.def("/obj/item/weapon/storage/lockbox/medal/sec/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(58);
	return f.dot;
});

// lockbox.dm:167
rt.def("/obj/item/weapon/storage/lockbox/medal/sec/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/accessory/medal/silver/security"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5581, "/obj/item/weapon/storage/lockbox/medal/sci", "/obj/item/weapon/storage/lockbox/medal", {
	name: "science medal box",
	desc: "A locked box used to store medals to be given to members of the science department.",
	req_access: null,
});

// lockbox.dm:173
rt.def("/obj/item/weapon/storage/lockbox/medal/sci/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(30);
	return f.dot;
});

// lockbox.dm:176
rt.def("/obj/item/weapon/storage/lockbox/medal/sci/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clothing/accessory/medal/plasma/nobel_science"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
