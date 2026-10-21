// From code/modules/clothing/spacesuits/syndi.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7979, "/obj/item/clothing/head/helmet/space/syndicate", "/obj/item/clothing/head/helmet/space", {
	name: "red space helmet",
	icon_state: "syndicate",
	item_state: "syndicate",
	desc: "Has a tag on it: Totally not property of an enemy corporation, honest!",
	armor: null,
});

// /obj/item/clothing/head/helmet/space/syndicate/proc/<init>  (code/modules/clothing/spacesuits/syndi.dm:7)
rt.def("/obj/item/clothing/head/helmet/space/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 80, "acid", 85]));
	return f.dot;
});

rt.type(7748, "/obj/item/clothing/suit/space/syndicate", "/obj/item/clothing/suit/space", {
	name: "red space suit",
	icon_state: "syndicate",
	item_state: "space_suit_syndicate",
	desc: "Has a tag on it: Totally not property of an enemy corporation, honest!",
	w_class: 3,
	allowed: null,
	armor: null,
});

// /obj/item/clothing/suit/space/syndicate/proc/<init>  (code/modules/clothing/spacesuits/syndi.dm:15)
rt.def("/obj/item/clothing/suit/space/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/energy/sword/saber"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 80, "acid", 85]));
	return f.dot;
});
