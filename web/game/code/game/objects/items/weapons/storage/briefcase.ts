// From code/game/objects/items/weapons/storage/briefcase.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/storage/briefcase/proc/PopulateContents  (code/game/objects/items/weapons/storage/briefcase.dm:20)  may sleep
rt.def("/obj/item/weapon/storage/briefcase/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let folder: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [folder, i, $e];
	yield* g.new_(f, T("/obj/item/weapon/pen"), [live(f.src)]);
	folder = (yield* g.new_(f, rt.sv(f, "folder_path"), [live(f.src)]));
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/paper"), [live(folder)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5549, "/obj/item/weapon/storage/briefcase/lawyer", "/obj/item/weapon/storage/briefcase", {
	folder_path: rt.typePath("/obj/item/weapon/folder/blue"),
});

// /obj/item/weapon/storage/briefcase/lawyer/proc/PopulateContents  (code/game/objects/items/weapons/storage/briefcase.dm:29)  may sleep
rt.def("/obj/item/weapon/storage/briefcase/lawyer/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/stamp/law"), [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
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

// /obj/item/weapon/storage/briefcase/sniperbundle/proc/PopulateContents  (code/game/objects/items/weapons/storage/briefcase.dm:50)  may sleep
rt.def("/obj/item/weapon/storage/briefcase/sniperbundle/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/syndicate"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/neck/tie/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/syndicate/sniper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/sniper_rounds/soporific"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/magazine/sniper_rounds/haemorrhage"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/suppressor/specialoffer"), [live(f.src)]);
	return f.dot;
}, true);
