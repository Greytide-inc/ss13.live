// Based on /tg/station's code/modules/paperwork/folders.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(7607, "/obj/item/weapon/folder", "/obj/item/weapon", {
	pressure_resistance: 2,
	name: "folder",
	desc: "A folder.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "folder",
	w_class: 2,
	resistance_flags: 4,
});

// folders.dm:28
rt.def("/obj/item/weapon/folder/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!rt.len(f, this.contents)) return f.dot;
	this.add_overlay("folder_paper");
	return f.dot;
});

// folders.dm:34
rt.def("/obj/item/weapon/folder/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let n_name: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/paper")) || rt.istype(W, T("/obj/item/weapon/photo")) || rt.istype(W, T("/obj/item/documents"))) {
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You put ${W} into ${this}.</span>`);
		yield* this.update_icon();
	} else {
		if (!rt.istype(W, T("/obj/item/weapon/pen"))) return f.dot;
		n_name = copytext(sanitize((yield* g.op(f, "Prompt", [2], [null, "Folder Labelling", "What would you like to label the folder?", user, null]))), 1, 42);
		if (!(get_dist(this, user) <= 1 && user.stat == 0)) return f.dot;
		this.name = `folder${n_name ? ` - '${n_name}'` : null}`;
	}
	return f.dot;
}, true);

// folders.dm:46
rt.def("/obj/item/weapon/folder/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let I: Value = null;
	let dat: Value = `<title>${this.name}</title>`;
	for (I of each(this, T("/obj/item"))) {
		dat += fmt("<A href='?src=＃;remove=＃'>Remove</A> - <A href='?src=＃;read=＃'>＀</A><BR>", [this, I, this, I, I.name]);
	}
	rt.op(f, "Browse", [], [user, dat, "window=folder"], false);
	onclose(user, "folder");
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// folders.dm:56
rt.def("/obj/item/weapon/folder/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null;
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (!f.usr.contents.Find(this)) return f.dot;
	if (rt.at(href_list, "remove")) {
		if (rt.istype((I = rt.locateIn(f, rt.at(href_list, "remove"), rt.world())), T("/obj/item")) && I.loc == this) {
			I.loc = f.usr.loc;
			yield* f.usr.put_in_hands(I);
		}
	}
	if (rt.at(href_list, "read")) {
		if (rt.istype((I = rt.locateIn(f, rt.at(href_list, "read"), rt.world())), T("/obj/item")) && I.loc == this) {
			yield* f.usr.examinate(I);
		}
	}
	yield* this.attack_self(f.usr);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(7612, "/obj/item/weapon/folder/documents", "/obj/item/weapon/folder", {
	name: "folder- 'TOP SECRET'",
	desc: "A folder stamped \"Top Secret - Property of Nanotrasen Corporation. Unauthorized distribution is punishable by death.\"",
});

// folders.dm:82
rt.def("/obj/item/weapon/folder/documents/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/documents/nanotrasen"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(7614, "/obj/item/weapon/folder/syndicate/red", "/obj/item/weapon/folder/syndicate", {
	icon_state: "folder_sred",
});

// folders.dm:95
rt.def("/obj/item/weapon/folder/syndicate/red/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/documents/syndicate/red"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(7615, "/obj/item/weapon/folder/syndicate/blue", "/obj/item/weapon/folder/syndicate", {
	icon_state: "folder_sblue",
});

// folders.dm:103
rt.def("/obj/item/weapon/folder/syndicate/blue/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/documents/syndicate/blue"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(7616, "/obj/item/weapon/folder/syndicate/mining", "/obj/item/weapon/folder/syndicate", {});

// folders.dm:108
rt.def("/obj/item/weapon/folder/syndicate/mining/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/item/documents/syndicate/mining"), this);
	yield* this.update_icon();
	return f.dot;
}, true);
