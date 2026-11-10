// Based on /tg/station's code/game/objects/items/weapons/storage/bags.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5527, "/obj/item/weapon/storage/bag/trash", "/obj/item/weapon/storage/bag", {
	name: "trash bag",
	desc: "It's the heavy-duty black polymer kind. Time to take out the trash!",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "trashbag",
	item_state: "trashbag",
	w_class: 4,
	max_w_class: 2,
	max_combined_w_class: 30,
	storage_slots: 30,
	can_hold: null,
	cant_hold: null,
});

// bags.dm:40
rt.def("/obj/item/weapon/storage/bag/trash/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list();

	this.cant_hold = list(T("/obj/item/weapon/disk/nuclear"));
	return f.dot;
});

// bags.dm:44
rt.def("/obj/item/weapon/storage/bag/trash/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} puts ${this} over ${user.p_their()} head and starts chomping at the insides! Disgusting!</span>`);
	playsound(this.loc, rt.rsc("sound/items/eatfood.ogg"), 50, 1, -1);
	return 4;
});

// bags.dm:49
rt.def("/obj/item/weapon/storage/bag/trash/proc/update_icon", function update_icon(f: Frame) {
	if (rt.len(f, this.contents) == 0) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	} else if (rt.len(f, this.contents) < 12) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}1`;
	} else if (rt.len(f, this.contents) < 21) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}2`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}3`;
	}
	return f.dot;
});

// bags.dm:60
rt.def("/obj/item/weapon/storage/bag/trash/proc/janicart_insert", function* janicart_insert(f: Frame, user: Value, J: Value) {
	yield* J.put_in_cart(this, user);
	J.mybag = this;
	yield* J.update_icon();
	return f.dot;
}, true);

rt.type(5530, "/obj/item/weapon/storage/bag/ore", "/obj/item/weapon/storage/bag", {
	name: "mining satchel",
	desc: "This little bugger can be used to store and transport ores.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "satchel",
	origin_tech: "engineering=2",
	slot_flags: 2560,
	w_class: 3,
	storage_slots: 50,
	max_combined_w_class: 200,
	max_w_class: 3,
	can_hold: null,
});

// bags.dm:90
rt.def("/obj/item/weapon/storage/bag/ore/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/ore"));
	return f.dot;
});

rt.type(5533, "/obj/item/weapon/storage/bag/plants", "/obj/item/weapon/storage/bag", {
	name: "plant bag",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "plantbag",
	storage_slots: 100,
	max_combined_w_class: 100,
	max_w_class: 3,
	w_class: 1,
	resistance_flags: 4,
	can_hold: null,
});

// bags.dm:115
rt.def("/obj/item/weapon/storage/bag/plants/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/food/snacks/grown"), T("/obj/item/seeds"), T("/obj/item/weapon/grown"), T("/obj/item/weapon/reagent_containers/honeycomb"));
	return f.dot;
});

rt.type(5534, "/obj/item/weapon/storage/bag/plants/portaseeder", "/obj/item/weapon/storage/bag/plants", {
	name: "portable seed extractor",
	desc: "For the enterprising botanist on the go. Less efficient than the stationary model, it creates one seed per plant.",
	icon_state: "portaseeder",
	origin_tech: "biotech=3;engineering=2",
});

// bags.dm:130
rt.def("/obj/item/weapon/storage/bag/plants/portaseeder/verb/dissolve_contents", function* dissolve_contents(f: Frame) {
	let O: Value = null;
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	for (O of each(this.contents, T("/obj/item"))) {
		yield* seedify(O, 1);
	}
	this.close_all();
	return f.dot;
}, true, { verb: { name: "Activate Seed Extraction", category: "Object", desc: "Activate to convert your plants into plantable seeds." } });

rt.type(5535, "/obj/item/weapon/storage/bag/sheetsnatcher", "/obj/item/weapon/storage/bag", {
	capacity: 300,
	name: "sheet snatcher",
	desc: "A patented Nanotrasen storage system designed for any kind of mineral sheet.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "sheetsnatcher",
	w_class: 3,
	allow_quick_empty: 1,
});

// bags.dm:155
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/can_be_inserted", function can_be_inserted(f: Frame, W: Value, stop_messages: Value) {
	let S: Value = null;
	stop_messages ??= 0;
	if (!rt.istype(W, T("/obj/item/stack/sheet")) || rt.istype(W, T("/obj/item/stack/sheet/mineral/sandstone")) || rt.istype(W, T("/obj/item/stack/sheet/mineral/wood"))) {
		if (!stop_messages) {
			to_chat(f.usr, `The snatcher does not accept ${W}.`);
		}
		return 0;
	}
	let current: Value = 0;
	for (S of each(this.contents, T("/obj/item/stack/sheet"))) {
		current += S.amount;
	}
	if (this.capacity == current) {
		if (!stop_messages) {
			to_chat(f.usr, "<span class='danger'>The snatcher is full.</span>");
		}
		return 0;
	}
	return 1;
});

// bags.dm:171
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/handle_item_insertion", function* handle_item_insertion(f: Frame, W: Value, prevent_warning: Value) {
	let S: Value = null, amount: Value = null, S2: Value = null, sheet: Value = null;
	prevent_warning ??= 0;
	if (!rt.istype((S = W), T("/obj/item/stack/sheet"))) {
		return 0;
	}
	let inserted: Value = 0;
	let current: Value = 0;
	for (S2 of each(this.contents, T("/obj/item/stack/sheet"))) {
		current += S2.amount;
	}
	if (this.capacity < current + S.amount) {
		amount = this.capacity - current;
	} else {
		amount = S.amount;
	}
	for (sheet of each(this.contents, T("/obj/item/stack/sheet"))) {
		if (S.type == sheet.type) {
			sheet.amount += amount;
			S.amount -= amount;
			inserted = 1;
			break;
		}
	}
	if (!inserted || !S.amount) {
		yield* f.usr.dropItemToGround(S);
		if (f.usr.client && f.usr.s_active != this) {
			f.usr.client.screen -= S;
		}
		yield* S.dropped(f.usr);
		if (!S.amount) {
			yield* qdel(S);
		} else {
			if (S.pulledby) {
				yield* S.pulledby.stop_pulling();
			}
			S.loc = this;
		}
	}
	yield* this.orient2hud(f.usr);
	if (f.usr.s_active) {
		yield* f.usr.s_active.show_to(f.usr);
	}
	yield* this.update_icon();
	return 1;
}, true);

// bags.dm:218
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/orient2hud", function* orient2hud(f: Frame, user: Value) {
	let numbered_contents: Value = null, I: Value = null, D: Value = null;
	let adjusted_contents: Value = rt.len(f, this.contents);
	if (this.display_contents_with_number) {
		numbered_contents = list();
		adjusted_contents = 0;
		for (I of each(this.contents, T("/obj/item/stack/sheet"))) {
			adjusted_contents++;
			(D = (yield* new_(T("/datum/numbered_display"), I))).number = I.amount;
			numbered_contents.Add(D);
		}
	}
	let row_num: Value = 0;
	let col_count: Value = min(7, this.storage_slots) - 1;
	if (adjusted_contents > 7) {
		row_num = round((adjusted_contents - 1) / 7);
	}
	this.standard_orient_objs(row_num, col_count, numbered_contents);
	return f.dot;
}, true);

// bags.dm:236
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/quick_empty", function* quick_empty(f: Frame) {
	let S: Value = null, N: Value = null, stacksize: Value = null;
	let location: Value = rt.getStep(f, this, 0);
	for (S of each(this.contents, T("/obj/item/stack/sheet"))) {
		while (S.amount) {
			N = (yield* new_(S.type, location));
			stacksize = min(S.amount, N.max_amount);
			N.amount = stacksize;
			S.amount -= stacksize;
		}
		if (!S.amount) {
			yield* qdel(S);
		}
	}
	yield* this.orient2hud(f.usr);
	if (f.usr.s_active) {
		yield* f.usr.s_active.show_to(f.usr);
	}
	yield* this.update_icon();
	return f.dot;
}, true, { verb: { name: "Empty Contents", category: "Object" } });

// bags.dm:252
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	let S: Value = null, temp: Value = null;
	if (!rt.istype((S = W), T("/obj/item/stack/sheet"))) {
		return 0;
	}
	if (S.amount > S.max_amount) {
		(temp = (yield* new_(S.type, this))).amount = S.amount - S.max_amount;
		S.amount = S.max_amount;
	}
	return (yield* parent_proc(S, new_location));
}, true);

rt.type(5537, "/obj/item/weapon/storage/bag/books", "/obj/item/weapon/storage/bag", {
	name: "book bag",
	desc: "A bag for books.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "bookbag",
	display_contents_with_number: 0,
	storage_slots: 7,
	max_combined_w_class: 21,
	max_w_class: 3,
	w_class: 4,
	resistance_flags: 4,
	can_hold: null,
});

// bags.dm:291
rt.def("/obj/item/weapon/storage/bag/books/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/book"), T("/obj/item/weapon/storage/book"), T("/obj/item/weapon/spellbook"));
	return f.dot;
});

rt.type(5538, "/obj/item/weapon/storage/bag/tray", "/obj/item/weapon/storage/bag", {
	throw_speed: 3,
	throw_range: 5,
	flags: 64,
	name: "tray",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "tray",
	desc: "A metal tray to lay food on.",
	force: 5,
	throwforce: 10,
	w_class: 4,
	materials: null,
	preposition: "on",
});

// bags.dm:308
rt.def("/obj/item/weapon/storage/bag/tray/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 3000]);
	return f.dot;
});

// bags.dm:312
rt.def("/obj/item/weapon/storage/bag/tray/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let I: Value = null, i: Value = null;
	yield* parent_proc();
	let oldContents: Value = (yield* this.contents.Copy());
	yield* this.quick_empty();
	for (I of each(oldContents, T("/obj/item"))) {
		rt.spawnTail(f, 0, "/obj/item/weapon/storage/bag/tray/proc/attack: spawn at game/objects/items/weapons/storage/bags.dm:319", oldContents, I, i);
	}
	if (prob(50)) {
		playsound(M, rt.rsc("sound/items/trayhit1.ogg"), 50, 1);
	} else {
		playsound(M, rt.rsc("sound/items/trayhit2.ogg"), 50, 1);
	}
	if (!(rt.istype(M, T("/mob/living/carbon/human")) || rt.istype(M, T("/mob/living/carbon/monkey")))) return f.dot;
	if (!prob(10)) return f.dot;
	yield* M.Knockdown(40);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/weapon/storage/bag/tray/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/storage/bag/tray/proc/attack: spawn at game/objects/items/weapons/storage/bags.dm:319", function* (f: Frame, oldContents: Value, I: Value, i: Value) {
	i = null;
	i = 1;
	while (i <= rand(1, 2)) {
		if (I) {
			yield* step(I, pick(1, 2, 4, 8));
			yield* sleep(rand(2, 4));
		}
		i++;
	}
	return null;
});

// bags.dm:335
rt.def("/obj/item/weapon/storage/bag/tray/proc/rebuild_overlays", function rebuild_overlays(f: Frame) {
	let I: Value = null;
	this.cut_overlays();
	for (I of each(this.contents, T("/obj/item"))) {
		this.add_overlay(mutable_appearance(I.icon, I.icon_state));
	}
	return f.dot;
});

// bags.dm:340
rt.def("/obj/item/weapon/storage/bag/tray/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	yield* parent_proc();
	this.rebuild_overlays();
	return f.dot;
}, true);

// bags.dm:344
rt.def("/obj/item/weapon/storage/bag/tray/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.add_overlay(mutable_appearance(f.args[0].icon, f.args[0].icon_state));
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["I", "prevent_warning"] });

rt.type(5539, "/obj/item/weapon/storage/bag/chemistry", "/obj/item/weapon/storage/bag", {
	name: "chemistry bag",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bag",
	desc: "A bag for storing pills, patches, and bottles.",
	storage_slots: 50,
	max_combined_w_class: 200,
	w_class: 1,
	preposition: "in",
	resistance_flags: 4,
	can_hold: null,
});

// bags.dm:361
rt.def("/obj/item/weapon/storage/bag/chemistry/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle"));
	return f.dot;
});

rt.type(5540, "/obj/item/weapon/storage/bag/bio", "/obj/item/weapon/storage/bag", {
	name: "bio bag",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "biobag",
	desc: "A bag for the safe transportation and disposal of biowaste and other biological materials.",
	storage_slots: 25,
	max_combined_w_class: 200,
	w_class: 1,
	preposition: "in",
	resistance_flags: 4,
	can_hold: null,
});

// bags.dm:377
rt.def("/obj/item/weapon/storage/bag/bio/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/slime_extract"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/blood"), T("/obj/item/weapon/reagent_containers/hypospray/medipen"), T("/obj/item/trash/deadmouse"), T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"));
	return f.dot;
});
