// Based on /tg/station's code/modules/clothing/head/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(8133, "/obj/item/clothing/head/centhat", "/obj/item/clothing/head", {
	name: "１Centcom hat",
	icon_state: "centcom",
	desc: "It's good to be emperor.",
	item_state: "that",
	flags_inv: 0,
	armor: null,
	strip_delay: 80,
});

// misc.dm:9
rt.def("/obj/item/clothing/head/centhat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(8118, "/obj/item/clothing/head/fedora", "/obj/item/clothing/head", {
	name: "fedora",
	icon_state: "fedora",
	item_state: "fedora",
	armor: null,
	desc: "A really cool hat if you're a mobster. A really lame hat if you're not.",
	dynamic_hair_suffix: "+detective",
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/small"),
});

// misc.dm:184
rt.def("/obj/item/clothing/head/fedora/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 5, "laser", 25, "energy", 10, "bomb", 0, "bio", 0, "rad", 0, "fire", 30, "acid", 50]);
	return f.dot;
});

// misc.dm:190
rt.def("/obj/item/clothing/head/fedora/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	if (user.gender == "female") {
		return 0;
	}
	let H: Value = user;
	user.visible_message(`<span class='suicide'>${user} is donning ${this}! It looks like they're trying to be nice to girls.</span>`);
	yield* user.say("M'lady.");
	yield* sleep(10);
	H.facial_hair_style = "Neckbeard";
	return 1;
}, true);

rt.type(8171, "/obj/item/clothing/head/crown", "/obj/item/clothing/head", {
	name: "crown",
	desc: "A crown fit for a king, a petty king maybe.",
	icon_state: "crown",
	armor: null,
	resistance_flags: 2,
});

// misc.dm:278
rt.def("/obj/item/clothing/head/crown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 15, "bullet", 0, "laser", 0, "energy", 15, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});
