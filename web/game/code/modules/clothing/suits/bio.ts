// From code/modules/clothing/suits/bio.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8178, "/obj/item/clothing/head/bio_hood", "/obj/item/clothing/head", {
	flags: 8192,
	name: "bio hood",
	icon_state: "bio",
	desc: "A hood that protects the head and face from biological comtaminants.",
	permeability_coefficient: 0.01,
	armor: null,
	flags_inv: 1008,
	resistance_flags: 32,
	flags_cover: 20,
});

// /obj/item/clothing/head/bio_hood/proc/<init>  (code/modules/clothing/suits/bio.dm:8)
rt.def("/obj/item/clothing/head/bio_hood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 20, "fire", 30, "acid", 100]));
	return f.dot;
});

rt.type(7833, "/obj/item/clothing/suit/bio_suit", "/obj/item/clothing/suit", {
	flags: 8192,
	name: "bio suit",
	desc: "A suit that protects against biological contamination.",
	icon_state: "bio",
	item_state: "bio_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	body_parts_covered: 2046,
	slowdown: 1,
	allowed: null,
	armor: null,
	flags_inv: 13,
	strip_delay: 70,
	equip_delay_other: 70,
	resistance_flags: 32,
});

// /obj/item/clothing/suit/bio_suit/proc/<init>  (code/modules/clothing/suits/bio.dm:24)
rt.def("/obj/item/clothing/suit/bio_suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/pen"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/hypospray")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 100, "rad", 20, "fire", 30, "acid", 100]));
	return f.dot;
});

rt.type(8181, "/obj/item/clothing/head/bio_hood/security", "/obj/item/clothing/head/bio_hood", {
	armor: null,
	icon_state: "bio_security",
});

// /obj/item/clothing/head/bio_hood/security/proc/<init>  (code/modules/clothing/suits/bio.dm:49)
rt.def("/obj/item/clothing/head/bio_hood/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 15, "laser", 25, "energy", 10, "bomb", 25, "bio", 100, "rad", 20, "fire", 30, "acid", 100]));
	return f.dot;
});

rt.type(7836, "/obj/item/clothing/suit/bio_suit/security", "/obj/item/clothing/suit/bio_suit", {
	armor: null,
	icon_state: "bio_security",
});

// /obj/item/clothing/suit/bio_suit/security/proc/<init>  (code/modules/clothing/suits/bio.dm:53)
rt.def("/obj/item/clothing/suit/bio_suit/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 15, "laser", 25, "energy", 10, "bomb", 25, "bio", 100, "rad", 20, "fire", 30, "acid", 100]));
	return f.dot;
});
