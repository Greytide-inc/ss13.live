// Based on /tg/station's code/game/objects/items/weapons/storage/toolbox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5588, "/obj/item/weapon/storage/toolbox", "/obj/item/weapon/storage", {
	latches: "single_latch",
	has_latches: 1,
	flags: 64,
	throw_speed: 2,
	throw_range: 7,
	name: "toolbox",
	desc: "Danger. Very robust.",
	icon_state: "red",
	item_state: "toolbox_red",
	force: 12,
	throwforce: 12,
	w_class: 4,
	materials: null,
	origin_tech: "combat=1;engineering=1",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
});

// toolbox.dm:12
rt.def("/obj/item/weapon/storage/toolbox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500]);

	this.attack_verb = list("robusted");
	return f.dot;
});

// toolbox.dm:20
rt.def("/obj/item/weapon/storage/toolbox/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.has_latches) {
		if (prob(10)) {
			this.latches = "double_latch";
			if (prob(1)) {
				this.latches = "triple_latch";
			}
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// toolbox.dm:29
rt.def("/obj/item/weapon/storage/toolbox/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.cut_overlays();
	if (!this.has_latches) return f.dot;
	this.add_overlay(this.latches);
	return f.dot;
});

// toolbox.dm:36
rt.def("/obj/item/weapon/storage/toolbox/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} robusts ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

rt.type(5589, "/obj/item/weapon/storage/toolbox/emergency", "/obj/item/weapon/storage/toolbox", {
	name: "emergency toolbox",
	icon_state: "red",
	item_state: "toolbox_red",
});

// toolbox.dm:45
rt.def("/obj/item/weapon/storage/toolbox/emergency/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/crowbar/red"), this);
	yield* new_(T("/obj/item/weapon/weldingtool/mini"), this);
	yield* new_(T("/obj/item/weapon/extinguisher/mini"), this);
	const die = rand(1, 3);
	if (die === 1) {
		yield* new_(T("/obj/item/device/flashlight"), this);
	} else if (die === 2) {
		yield* new_(T("/obj/item/device/flashlight/glowstick"), this);
	} else if (die === 3) {
		yield* new_(T("/obj/item/device/flashlight/flare"), this);
	}
	yield* new_(T("/obj/item/device/radio/off"), this);
	return f.dot;
}, true);

rt.type(5591, "/obj/item/weapon/storage/toolbox/mechanical", "/obj/item/weapon/storage/toolbox", {
	name: "mechanical toolbox",
	icon_state: "blue",
	item_state: "toolbox_blue",
});

// toolbox.dm:68
rt.def("/obj/item/weapon/storage/toolbox/mechanical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/device/analyzer"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	return f.dot;
}, true);

rt.type(5593, "/obj/item/weapon/storage/toolbox/electrical", "/obj/item/weapon/storage/toolbox", {
	name: "electrical toolbox",
	icon_state: "yellow",
	item_state: "toolbox_yellow",
});

// toolbox.dm:86
rt.def("/obj/item/weapon/storage/toolbox/electrical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let pickedcolor: Value = pick("red", "yellow", "green", "blue", "pink", "orange", "cyan", "white");
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	yield* new_(T("/obj/item/device/t_scanner"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pickedcolor);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pickedcolor);
	if (prob(5)) {
		yield* new_(T("/obj/item/clothing/gloves/color/yellow"), this);
	} else {
		yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pickedcolor);
	}
	return f.dot;
}, true);

rt.type(5594, "/obj/item/weapon/storage/toolbox/syndicate", "/obj/item/weapon/storage/toolbox", {
	silent: 1,
	name: "suspicious looking toolbox",
	icon_state: "syndicate",
	item_state: "toolbox_syndi",
	origin_tech: "combat=2;syndicate=1;engineering=2",
	force: 15,
	throwforce: 18,
});

// toolbox.dm:108
rt.def("/obj/item/weapon/storage/toolbox/syndicate/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/screwdriver/nuke"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool/largetank"), this);
	yield* new_(T("/obj/item/weapon/crowbar/red"), this);
	yield* new_(T("/obj/item/weapon/wirecutters"), this, "red");
	yield* new_(T("/obj/item/device/multitool"), this);
	yield* new_(T("/obj/item/clothing/gloves/combat"), this);
	return f.dot;
}, true);

rt.type(5595, "/obj/item/weapon/storage/toolbox/drone", "/obj/item/weapon/storage/toolbox", {
	name: "mechanical toolbox",
	icon_state: "blue",
	item_state: "toolbox_blue",
});

// toolbox.dm:122
rt.def("/obj/item/weapon/storage/toolbox/drone/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let pickedcolor: Value = pick("red", "yellow", "green", "blue", "pink", "orange", "cyan", "white");
	yield* new_(T("/obj/item/weapon/screwdriver"), this);
	yield* new_(T("/obj/item/weapon/wrench"), this);
	yield* new_(T("/obj/item/weapon/weldingtool"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/stack/cable_coil"), this, 30, pickedcolor);
	yield* new_(T("/obj/item/weapon/wirecutters"), this);
	yield* new_(T("/obj/item/device/multitool"), this);
	return f.dot;
}, true);

rt.type(5597, "/obj/item/weapon/storage/toolbox/brass/prefilled", "/obj/item/weapon/storage/toolbox/brass", {});

// toolbox.dm:146
rt.def("/obj/item/weapon/storage/toolbox/brass/prefilled/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(this.fabricator_type, this);
	yield* new_(T("/obj/item/weapon/screwdriver/brass"), this);
	yield* new_(T("/obj/item/weapon/wirecutters/brass"), this);
	yield* new_(T("/obj/item/weapon/wrench/brass"), this);
	yield* new_(T("/obj/item/weapon/crowbar/brass"), this);
	yield* new_(T("/obj/item/weapon/weldingtool/experimental/brass"), this);
	return f.dot;
}, true);

rt.type(5598, "/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar", "/obj/item/weapon/storage/toolbox/brass/prefilled", {
	slab_type: rt.typePath("/obj/item/clockwork/slab"),
});

// toolbox.dm:157
rt.def("/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(this.slab_type, this);
	return f.dot;
}, true);

rt.type(5600, "/obj/item/weapon/storage/toolbox/artistic", "/obj/item/weapon/storage/toolbox", {
	max_combined_w_class: 20,
	storage_slots: 10,
	name: "artistic toolbox",
	desc: "A toolbox painted bright green. Why anyone would store art supplies in a toolbox is beyond you, but it has plenty of extra space.",
	icon_state: "green",
	item_state: "artistic_toolbox",
	w_class: 6,
});

// toolbox.dm:175
rt.def("/obj/item/weapon/storage/toolbox/artistic/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/storage/crayons"), this);
	yield* new_(T("/obj/item/weapon/crowbar"), this);
	yield* new_(T("/obj/item/stack/cable_coil/red"), this);
	yield* new_(T("/obj/item/stack/cable_coil/yellow"), this);
	yield* new_(T("/obj/item/stack/cable_coil/blue"), this);
	yield* new_(T("/obj/item/stack/cable_coil/green"), this);
	yield* new_(T("/obj/item/stack/cable_coil/pink"), this);
	yield* new_(T("/obj/item/stack/cable_coil/orange"), this);
	yield* new_(T("/obj/item/stack/cable_coil/cyan"), this);
	yield* new_(T("/obj/item/stack/cable_coil/white"), this);
	return f.dot;
}, true);
