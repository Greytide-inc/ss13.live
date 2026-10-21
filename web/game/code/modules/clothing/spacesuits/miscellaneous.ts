// From code/modules/clothing/spacesuits/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7960, "/obj/item/clothing/head/helmet/space/hardsuit/deathsquad", "/obj/item/clothing/head/helmet/space/hardsuit", {
	name: "MK.III SWAT Helmet",
	desc: "An advanced tactical space helmet.",
	icon_state: "deathsquad",
	item_state: "deathsquad",
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/deathsquad/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:23)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/deathsquad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

rt.type(7728, "/obj/item/clothing/suit/space/hardsuit/deathsquad", "/obj/item/clothing/suit/space/hardsuit", {
	name: "MK.III SWAT Suit",
	desc: "A prototype designed to replace the ageing MK.II SWAT suit. Based on the streamlined MK.II model, the traditional ceramic and graphene plate construction was replaced with plasteel, allowing superior armor against most threats. There's room for some kind of energy projection device on the back.",
	icon_state: "deathsquad",
	item_state: "swat_suit",
	allowed: null,
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/deathsquad"),
	dog_fashion: rt.typePath("/datum/dog_fashion/back/deathsquad"),
});

// /obj/item/clothing/suit/space/hardsuit/deathsquad/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:37)
rt.def("/obj/item/clothing/suit/space/hardsuit/deathsquad/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/kitchen/knife/combat")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7738, "/obj/item/clothing/suit/space/swat", "/obj/item/clothing/suit/space", {
	name: "MK.I SWAT Suit",
	desc: "A tactical space suit first developed in a joint effort by the defunct IS-ERI and Nanotrasen in 20XX for military space operations. A tried and true workhorse, it is very difficult to move in but offers robust protection against all threats!",
	icon_state: "heavy",
	item_state: "swat_suit",
	allowed: null,
	armor: null,
	strip_delay: 120,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/space/swat/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:51)
rt.def("/obj/item/clothing/suit/space/swat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/kitchen/knife/combat")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 30, "bomb", 50, "bio", 90, "rad", 20, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7970, "/obj/item/clothing/head/helmet/space/beret", "/obj/item/clothing/head/helmet/space", {
	flags: 1,
	name: "officer's beret",
	desc: "An armored beret commonly used by special operations officers. Uses advanced force field technology to protect the head from space.",
	icon_state: "beret_badge",
	flags_inv: 0,
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
});

// /obj/item/clothing/head/helmet/space/beret/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:62)
rt.def("/obj/item/clothing/head/helmet/space/beret/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7739, "/obj/item/clothing/suit/space/officer", "/obj/item/clothing/suit/space", {
	name: "officer's jacket",
	desc: "An armored, space-proof jacket used in special operations.",
	icon_state: "detective",
	item_state: "det_suit",
	blood_overlay_type: "coat",
	slowdown: 0,
	flags_inv: 0,
	w_class: 3,
	allowed: null,
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	resistance_flags: 34,
});

// /obj/item/clothing/suit/space/officer/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:76)
rt.def("/obj/item/clothing/suit/space/officer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
	return f.dot;
});

rt.type(7740, "/obj/item/clothing/suit/space/nasavoid", "/obj/item/clothing/suit/space", {
	name: "NASA Voidsuit",
	icon_state: "void",
	item_state: "void",
	desc: "An old, NASA Centcom branch designed, dark red space suit.",
	allowed: null,
});

// /obj/item/clothing/suit/space/nasavoid/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:94)
rt.def("/obj/item/clothing/suit/space/nasavoid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/device/multitool")));
	return f.dot;
});

rt.type(7741, "/obj/item/clothing/suit/space/nasavoid/old", "/obj/item/clothing/suit/space/nasavoid", {
	name: "Engineering Voidsuit",
	icon_state: "void",
	item_state: "void",
	desc: "A Centcom engineering dark red space suit. Age has degraded the suit making is difficult to move around in.",
	slowdown: 1,
	allowed: null,
});

// /obj/item/clothing/suit/space/nasavoid/old/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:108)
rt.def("/obj/item/clothing/suit/space/nasavoid/old/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals"), T("/obj/item/device/multitool")));
	return f.dot;
});

rt.type(7742, "/obj/item/clothing/suit/space/santa", "/obj/item/clothing/suit/space", {
	flags: 1,
	name: "Santa's suit",
	desc: "Festive!",
	icon_state: "santa",
	item_state: "santa",
	slowdown: 0,
	allowed: null,
});

// /obj/item/clothing/suit/space/santa/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:127)
rt.def("/obj/item/clothing/suit/space/santa/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item")));
	return f.dot;
});

rt.type(7974, "/obj/item/clothing/head/helmet/space/pirate", "/obj/item/clothing/head/helmet/space", {
	flags: 1,
	name: "pirate hat",
	desc: "Yarr.",
	icon_state: "pirate",
	item_state: "pirate",
	armor: null,
	strip_delay: 40,
	equip_delay_other: 20,
	flags_cover: 4,
});

// /obj/item/clothing/head/helmet/space/pirate/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:136)
rt.def("/obj/item/clothing/head/helmet/space/pirate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 60, "acid", 75]));
	return f.dot;
});

rt.type(7743, "/obj/item/clothing/suit/space/pirate", "/obj/item/clothing/suit/space", {
	name: "pirate coat",
	desc: "Yarr.",
	icon_state: "pirate",
	item_state: "pirate",
	w_class: 3,
	flags_inv: 0,
	allowed: null,
	slowdown: 0,
	armor: null,
	strip_delay: 40,
	equip_delay_other: 20,
});

// /obj/item/clothing/suit/space/pirate/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:149)
rt.def("/obj/item/clothing/suit/space/pirate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/melee/energy/sword/pirate"), T("/obj/item/clothing/glasses/eyepatch"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 60, "acid", 75]));
	return f.dot;
});

rt.type(7961, "/obj/item/clothing/head/helmet/space/hardsuit/ert", "/obj/item/clothing/head/helmet/space/hardsuit", {
	flags: 8195,
	brightness_on: 7,
	name: "emergency response unit helmet",
	desc: "Standard issue command helmet for the ERT",
	icon_state: "hardsuit0-ert_commander",
	item_state: "hardsuit0-ert_commander",
	item_color: "ert_commander",
	armor: null,
	strip_delay: 130,
});

// /obj/item/clothing/head/helmet/space/hardsuit/ert/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:162)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/ert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 65, "bullet", 50, "laser", 50, "energy", 50, "bomb", 50, "bio", 100, "rad", 100, "fire", 80, "acid", 80]));
	return f.dot;
});

rt.type(7729, "/obj/item/clothing/suit/space/hardsuit/ert", "/obj/item/clothing/suit/space/hardsuit", {
	name: "emergency response team suit",
	desc: "Standard issue command suit for the ERT.",
	icon_state: "ert_command",
	item_state: "ert_command",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/ert"),
	allowed: null,
	armor: null,
	slowdown: 0,
	strip_delay: 130,
});

// /obj/item/clothing/suit/space/hardsuit/ert/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:173)
rt.def("/obj/item/clothing/suit/space/hardsuit/ert/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 50, "laser", 30, "energy", 50, "bomb", 50, "bio", 100, "rad", 100, "fire", 0, "acid", 95]));
	return f.dot;
});

rt.type(7732, "/obj/item/clothing/suit/space/hardsuit/ert/med", "/obj/item/clothing/suit/space/hardsuit/ert", {
	desc: "Standard issue medical suit for the ERT.",
	icon_state: "ert_medical",
	item_state: "ert_medical",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/ert/med"),
	species_exception: null,
});

// /obj/item/clothing/suit/space/hardsuit/ert/med/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:216)
rt.def("/obj/item/clothing/suit/space/hardsuit/ert/med/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_exception", rt.list(T("/datum/species/angel")));
	return f.dot;
});

rt.type(7744, "/obj/item/clothing/suit/space/eva", "/obj/item/clothing/suit/space", {
	name: "EVA suit",
	icon_state: "space",
	item_state: "s_suit",
	desc: "A lightweight space suit with the basic ability to protect the wearer from the vacuum of space during emergencies.",
	armor: null,
});

// /obj/item/clothing/suit/space/eva/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:223)
rt.def("/obj/item/clothing/suit/space/eva/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 20, "fire", 50, "acid", 65]));
	return f.dot;
});

rt.type(7975, "/obj/item/clothing/head/helmet/space/eva", "/obj/item/clothing/head/helmet/space", {
	name: "EVA helmet",
	icon_state: "space",
	item_state: "space",
	desc: "A lightweight space helmet with the basic ability to protect the wearer from the vacuum of space during emergencies.",
	flash_protect: 0,
	armor: null,
});

// /obj/item/clothing/head/helmet/space/eva/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:231)
rt.def("/obj/item/clothing/head/helmet/space/eva/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 20, "fire", 50, "acid", 65]));
	return f.dot;
});

rt.type(7976, "/obj/item/clothing/head/helmet/space/freedom", "/obj/item/clothing/head/helmet/space", {
	name: "eagle helmet",
	desc: "An advanced, space-proof helmet. It appears to be modeled after an old-world eagle.",
	icon_state: "griffinhat",
	item_state: "griffinhat",
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	resistance_flags: 32,
});

// /obj/item/clothing/head/helmet/space/freedom/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:238)
rt.def("/obj/item/clothing/head/helmet/space/freedom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 40, "laser", 30, "energy", 25, "bomb", 100, "bio", 100, "rad", 100, "fire", 80, "acid", 80]));
	return f.dot;
});

rt.type(7746, "/obj/item/clothing/suit/space/freedom", "/obj/item/clothing/suit/space", {
	name: "eagle suit",
	desc: "An advanced, light suit, fabricated from a mixture of synthetic feathers and space-resistant material. A gun holster appears to be intergrated into the suit and the wings appear to be stuck in 'freedom' mode.",
	icon_state: "freedom",
	item_state: "freedom",
	allowed: null,
	armor: null,
	strip_delay: 130,
	max_heat_protection_temperature: 35000,
	resistance_flags: 32,
});

// /obj/item/clothing/suit/space/freedom/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:248)
rt.def("/obj/item/clothing/suit/space/freedom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 40, "laser", 30, "energy", 25, "bomb", 100, "bio", 100, "rad", 100, "fire", 80, "acid", 80]));
	return f.dot;
});

rt.type(7968, "/obj/item/clothing/head/helmet/space/hardsuit/carp", "/obj/item/clothing/head/helmet/space/hardsuit", {
	brightness_on: 0,
	flags: 8195,
	name: "carp helmet",
	desc: "Spaceworthy and it looks like a space carp's head, smells like one too.",
	icon_state: "carp_helm",
	item_state: "syndicate",
	armor: null,
	actions_types: null,
});

// /obj/item/clothing/head/helmet/space/hardsuit/carp/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:260)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/carp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", -20, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 75, "fire", 60, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

rt.type(7736, "/obj/item/clothing/suit/space/hardsuit/carp", "/obj/item/clothing/suit/space/hardsuit", {
	name: "carp space suit",
	desc: "A slimming piece of dubious space carp technology, you suspect it won't stand up to hand-to-hand blows.",
	icon_state: "carp_suit",
	item_state: "space_suit_syndicate",
	slowdown: 0,
	armor: null,
	allowed: null,
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/carp"),
});

// /obj/item/clothing/suit/space/hardsuit/carp/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:272)
rt.def("/obj/item/clothing/suit/space/hardsuit/carp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", -20, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 75, "fire", 60, "acid", 75]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/gun/ballistic/automatic/speargun")));
	return f.dot;
});

rt.type(7965, "/obj/item/clothing/head/helmet/space/hardsuit/ert/paranormal", "/obj/item/clothing/head/helmet/space/hardsuit/ert", {
	name: "paranormal response unit helmet",
	desc: "A helmet worn by those who deal with paranormal threats for a living.",
	icon_state: "hardsuit0-prt",
	item_state: "hardsuit0-prt",
	item_color: "knight_grey",
	max_heat_protection_temperature: 35000,
	actions_types: null,
	resistance_flags: 2,
});

// /obj/item/clothing/head/helmet/space/hardsuit/ert/paranormal/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:284)
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/ert/paranormal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

rt.type(7733, "/obj/item/clothing/suit/space/hardsuit/ert/paranormal", "/obj/item/clothing/suit/space/hardsuit/ert", {
	name: "paranormal response team suit",
	desc: "Powerful wards are built into this hardsuit, protecting the user from all manner of paranormal threats.",
	icon_state: "knight_grey",
	item_state: "knight_grey",
	helmettype: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/ert/paranormal"),
	max_heat_protection_temperature: 35000,
	resistance_flags: 2,
});

// /obj/item/clothing/suit/space/hardsuit/ert/paranormal/proc/New  (code/modules/clothing/spacesuits/miscellaneous.dm:297)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/ert/paranormal/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/nullrod"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(7977, "/obj/item/clothing/head/helmet/space/fragile", "/obj/item/clothing/head/helmet/space", {
	name: "emergency space helmet",
	desc: "A bulky, air-tight helmet meant to protect the user during emergency situations. It doesn't look very durable.",
	icon_state: "syndicate-helm-orange",
	item_state: "syndicate-helm-orange",
	armor: null,
	strip_delay: 65,
});

// /obj/item/clothing/head/helmet/space/fragile/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:329)
rt.def("/obj/item/clothing/head/helmet/space/fragile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 5, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 10, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(7747, "/obj/item/clothing/suit/space/fragile", "/obj/item/clothing/suit/space", {
	torn: 0,
	name: "emergency space suit",
	desc: "A bulky, air-tight suit meant to protect the user during emergency situations. It doesn't look very durable.",
	icon_state: "syndicate-orange",
	item_state: "syndicate-orange",
	slowdown: 2,
	armor: null,
	strip_delay: 65,
});

// /obj/item/clothing/suit/space/fragile/proc/<init>  (code/modules/clothing/spacesuits/miscellaneous.dm:339)
rt.def("/obj/item/clothing/suit/space/fragile/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 5, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 10, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/clothing/suit/space/fragile/proc/hit_reaction  (code/modules/clothing/spacesuits/miscellaneous.dm:343)
rt.def("/obj/item/clothing/suit/space/fragile/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if (!(!truthy(rt.sv(f, "torn")) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(owner), fmt("<span class='warning'>＀ tears from the damage, breaking the air-tight seal!</span>", [live(f.src)])]);
	(rt.modField(f, live(f.src), "flags", 1, subtract));
	rt.setFv(f, "name", live(f.src), fmt("torn ＀.", [live(f.src)]));
	rt.setFv(f, "desc", live(f.src), "A bulky suit meant to protect the user during emergency situations, at least until someone tore a hole in the suit.");
	rt.setFv(f, "torn", live(f.src), 1);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slashmiss.ogg"), 50, 1]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/refill.ogg"), 50, 1]);
	return f.dot;
});
