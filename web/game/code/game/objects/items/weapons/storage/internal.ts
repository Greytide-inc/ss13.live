// Based on /tg/station's code/game/objects/items/weapons/storage/internal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5514, "/obj/item/weapon/storage/internal", "/obj/item/weapon/storage", {
	storage_slots: 2,
	max_w_class: 2,
	max_combined_w_class: 50,
	w_class: 4,
	rustle_jimmies: 0,
});

// internal.dm:10
rt.def("/obj/item/weapon/storage/internal/proc/Adjacent", function Adjacent(f: Frame, A: Value) {
	if (!this.loc) return f.dot;
	return this.loc.Adjacent(A);
});

rt.type(5516, "/obj/item/weapon/storage/internal/pocket", "/obj/item/weapon/storage/internal", {
	priority: 1,
	quickdraw: 0,
});

// internal.dm:20
rt.def("/obj/item/weapon/storage/internal/pocket/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!this.loc) return f.dot;
	this.name = this.loc.name;
	return f.dot;
}, true);

// internal.dm:25
rt.def("/obj/item/weapon/storage/internal/pocket/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.silent && !f.args[1])) return f.dot;
	if (this.quickdraw) {
		to_chat(f.args[2], `<span class='notice'>You discreetly slip ${f.args[0]} into ${this}. Alt-click ${this} to remove it.</span>`);
	} else {
		to_chat(f.args[2], `<span class='notice'>You discreetly slip ${f.args[0]} into ${this}.`);
	}
	return f.dot;
}, true, { args: ["W", "prevent_warning", "user"] });

rt.type(5521, "/obj/item/weapon/storage/internal/pocket/shoes", "/obj/item/weapon/storage/internal/pocket", {
	priority: 0,
	quickdraw: 1,
	silent: 1,
	can_hold: null,
});

// internal.dm:45
rt.def("/obj/item/weapon/storage/internal/pocket/shoes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/kitchen/knife"), T("/obj/item/weapon/switchblade"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/hypospray/medipen"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool/mini"), T("/obj/item/device/firing_pin"));
	return f.dot;
});

rt.type(5522, "/obj/item/weapon/storage/internal/pocket/shoes/clown", "/obj/item/weapon/storage/internal/pocket/shoes", {
	can_hold: null,
});

// internal.dm:59
rt.def("/obj/item/weapon/storage/internal/pocket/shoes/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/kitchen/knife"), T("/obj/item/weapon/switchblade"), T("/obj/item/weapon/pen"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/hypospray/medipen"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/implanter"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool/mini"), T("/obj/item/device/firing_pin"), T("/obj/item/weapon/bikehorn"));
	return f.dot;
});

rt.type(5519, "/obj/item/weapon/storage/internal/pocket/small/detective", "/obj/item/weapon/storage/internal/pocket/small", {
	priority: 1,
});

// internal.dm:70
rt.def("/obj/item/weapon/storage/internal/pocket/small/detective/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/flask/det"), this);
	return f.dot;
}, true);

rt.type(5523, "/obj/item/weapon/storage/internal/pocket/pocketprotector", "/obj/item/weapon/storage/internal/pocket", {
	storage_slots: 3,
	max_w_class: 1,
	can_hold: null,
});

// internal.dm:75
rt.def("/obj/item/weapon/storage/internal/pocket/pocketprotector/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/pen"), T("/obj/item/toy/crayon"), T("/obj/item/weapon/lipstick"), T("/obj/item/device/flashlight/pen"), T("/obj/item/clothing/mask/cigarette"));
	return f.dot;
});

rt.type(5524, "/obj/item/weapon/storage/internal/pocket/pocketprotector/cosmetology", "/obj/item/weapon/storage/internal/pocket/pocketprotector", {});

// internal.dm:83
rt.def("/obj/item/weapon/storage/internal/pocket/pocketprotector/cosmetology/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/lipstick/random"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5525, "/obj/item/weapon/storage/internal/pocket/pocketprotector/full", "/obj/item/weapon/storage/internal/pocket/pocketprotector", {});

// internal.dm:87
rt.def("/obj/item/weapon/storage/internal/pocket/pocketprotector/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/pen/red"), this);
	yield* new_(T("/obj/item/weapon/pen"), this);
	yield* new_(T("/obj/item/weapon/pen/blue"), this);
	return f.dot;
}, true);
