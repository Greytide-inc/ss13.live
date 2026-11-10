// Based on /tg/station's code/game/objects/items/weapons/storage/briefcase.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5548, "/obj/item/weapon/storage/briefcase", "/obj/item/weapon/storage", {
	folder_path: rt.typePath("/obj/item/weapon/folder"),
	flags: 64,
	throw_speed: 2,
	throw_range: 4,
	name: "briefcase",
	desc: "It's made of AUTHENTIC faux-leather and has a price-tag still attached. Its owner must be a real professional.",
	icon_state: "briefcase",
	force: 8,
	hitsound: "swing_hit",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 21,
	attack_verb: null,
	resistance_flags: 4,
	obj_integrity: 150,
	max_integrity: 150,
});

// briefcase.dm:20
rt.def("/obj/item/weapon/storage/briefcase/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* new_(T("/obj/item/weapon/pen"), this);
	let folder: Value = (yield* new_(this.folder_path, this));
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/paper"), folder);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5549, "/obj/item/weapon/storage/briefcase/lawyer", "/obj/item/weapon/storage/briefcase", {
	folder_path: rt.typePath("/obj/item/weapon/folder/blue"),
});

// briefcase.dm:29
rt.def("/obj/item/weapon/storage/briefcase/lawyer/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/stamp/law"), this);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5550, "/obj/item/weapon/storage/briefcase/sniperbundle", "/obj/item/weapon/storage/briefcase", {
	flags: 64,
	throw_speed: 2,
	throw_range: 4,
	name: "briefcase",
	desc: "It's label reads genuine hardened Captain leather, but suspiciously has no other tags or branding. Smells like L'Air du Temps.",
	icon_state: "briefcase",
	force: 10,
	hitsound: "swing_hit",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 21,
	attack_verb: null,
	resistance_flags: 4,
	obj_integrity: 150,
	max_integrity: 150,
});

// briefcase.dm:50
rt.def("/obj/item/weapon/storage/briefcase/sniperbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/syndicate"), this);
	yield* new_(T("/obj/item/clothing/neck/tie/red"), this);
	yield* new_(T("/obj/item/clothing/under/syndicate/sniper"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/sniper_rounds/soporific"), this);
	yield* new_(T("/obj/item/ammo_box/magazine/sniper_rounds/haemorrhage"), this);
	yield* new_(T("/obj/item/weapon/suppressor/specialoffer"), this);
	return f.dot;
}, true);
