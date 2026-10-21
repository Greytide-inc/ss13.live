// From code/modules/clothing/suits/jobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7841, "/obj/item/clothing/suit/apron", "/obj/item/clothing/suit", {
	blood_overlay_type: "armor",
	name: "apron",
	desc: "A basic blue apron.",
	icon_state: "apron",
	item_state: "apron",
	body_parts_covered: 6,
	allowed: null,
});

// /obj/item/clothing/suit/apron/proc/<init>  (code/modules/clothing/suits/jobs.dm:13)
rt.def("/obj/item/clothing/suit/apron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/reagent_containers/spray/plantbgone"), T("/obj/item/device/plant_analyzer"), T("/obj/item/seeds"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/cultivator"), T("/obj/item/weapon/reagent_containers/spray/pestspray"), T("/obj/item/weapon/hatchet"), T("/obj/item/weapon/storage/bag/plants")));
	return f.dot;
});

rt.type(7845, "/obj/item/clothing/suit/captunic", "/obj/item/clothing/suit", {
	name: "captain's parade tunic",
	desc: "Worn by a Captain to show their class.",
	icon_state: "captunic",
	item_state: "bio_suit",
	body_parts_covered: 414,
	flags_inv: 4,
	allowed: null,
});

// /obj/item/clothing/suit/captunic/proc/<init>  (code/modules/clothing/suits/jobs.dm:23)
rt.def("/obj/item/clothing/suit/captunic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/disk"), T("/obj/item/weapon/stamp"), T("/obj/item/weapon/reagent_containers/food/drinks/flask"), T("/obj/item/weapon/melee"), T("/obj/item/weapon/storage/lockbox/medal"), T("/obj/item/device/assembly/flash/handheld"), T("/obj/item/weapon/storage/box/matches"), T("/obj/item/weapon/lighter"), T("/obj/item/clothing/mask/cigarette"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7817, "/obj/item/clothing/suit/hooded/chaplain_hoodie", "/obj/item/clothing/suit/hooded", {
	name: "chaplain hoodie",
	desc: "This suit says to you 'hush'!",
	icon_state: "chaplain_hoodie",
	item_state: "chaplain_hoodie",
	body_parts_covered: 414,
	allowed: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/chaplain_hood"),
});

// /obj/item/clothing/suit/hooded/chaplain_hoodie/proc/<init>  (code/modules/clothing/suits/jobs.dm:32)
rt.def("/obj/item/clothing/suit/hooded/chaplain_hoodie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/book/bible"), T("/obj/item/weapon/nullrod"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/fancy/candle_box"), T("/obj/item/candle"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7846, "/obj/item/clothing/suit/nun", "/obj/item/clothing/suit", {
	name: "nun robe",
	desc: "Maximum piety in this star system.",
	icon_state: "nun",
	item_state: "nun",
	body_parts_covered: 1950,
	flags_inv: 12,
	allowed: null,
});

// /obj/item/clothing/suit/nun/proc/<init>  (code/modules/clothing/suits/jobs.dm:49)
rt.def("/obj/item/clothing/suit/nun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/book/bible"), T("/obj/item/weapon/nullrod"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/fancy/candle_box"), T("/obj/item/candle"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7847, "/obj/item/clothing/suit/studentuni", "/obj/item/clothing/suit", {
	name: "student robe",
	desc: "The uniform of a bygone institute of learning.",
	icon_state: "studentuni",
	item_state: "studentuni",
	body_parts_covered: 386,
	allowed: null,
});

// /obj/item/clothing/suit/studentuni/proc/<init>  (code/modules/clothing/suits/jobs.dm:57)
rt.def("/obj/item/clothing/suit/studentuni/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/book/bible"), T("/obj/item/weapon/nullrod"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/fancy/candle_box"), T("/obj/item/candle"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7848, "/obj/item/clothing/suit/witchhunter", "/obj/item/clothing/suit", {
	name: "witchunter garb",
	desc: "This worn outfit saw much use back in the day.",
	icon_state: "witchhunter",
	item_state: "witchhunter",
	body_parts_covered: 414,
	allowed: null,
});

// /obj/item/clothing/suit/witchhunter/proc/<init>  (code/modules/clothing/suits/jobs.dm:65)
rt.def("/obj/item/clothing/suit/witchhunter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/storage/book/bible"), T("/obj/item/weapon/nullrod"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater"), T("/obj/item/weapon/storage/fancy/candle_box"), T("/obj/item/candle"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(7850, "/obj/item/clothing/suit/toggle/chef", "/obj/item/clothing/suit/toggle", {
	togglename: "sleeves",
	name: "chef's apron",
	desc: "An apron-jacket used by a high class chef.",
	icon_state: "chef",
	item_state: "chef",
	gas_transfer_coefficient: 0.9,
	permeability_coefficient: 0.5,
	body_parts_covered: 390,
	allowed: null,
});

// /obj/item/clothing/suit/toggle/chef/proc/<init>  (code/modules/clothing/suits/jobs.dm:76)
rt.def("/obj/item/clothing/suit/toggle/chef/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/kitchen")));
	return f.dot;
});

rt.type(7842, "/obj/item/clothing/suit/apron/chef", "/obj/item/clothing/suit/apron", {
	blood_overlay_type: "armor",
	name: "cook's apron",
	desc: "A basic, dull, white chef's apron.",
	icon_state: "apronchef",
	item_state: "apronchef",
	body_parts_covered: 6,
	allowed: null,
});

// /obj/item/clothing/suit/apron/chef/proc/<init>  (code/modules/clothing/suits/jobs.dm:87)
rt.def("/obj/item/clothing/suit/apron/chef/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/kitchen")));
	return f.dot;
});

rt.type(7864, "/obj/item/clothing/suit/det_suit", "/obj/item/clothing/suit", {
	blood_overlay_type: "coat",
	name: "trenchcoat",
	desc: "An 18th-century multi-purpose trenchcoat. Someone who wears this means serious business.",
	icon_state: "detective",
	item_state: "det_suit",
	body_parts_covered: 414,
	allowed: null,
	armor: null,
	cold_protection: 414,
	heat_protection: 414,
});

// /obj/item/clothing/suit/det_suit/proc/<init>  (code/modules/clothing/suits/jobs.dm:97)
rt.def("/obj/item/clothing/suit/det_suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter"), T("/obj/item/device/detective_scanner"), T("/obj/item/device/taperecorder"), T("/obj/item/weapon/melee/classic_baton")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 25, "energy", 10, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 45]));
	return f.dot;
});

rt.type(7866, "/obj/item/clothing/suit/hazardvest", "/obj/item/clothing/suit", {
	blood_overlay_type: "armor",
	name: "hazard vest",
	desc: "A high-visibility vest used in work zones.",
	icon_state: "hazard",
	item_state: "hazard",
	allowed: null,
	resistance_flags: 0,
});

// /obj/item/clothing/suit/hazardvest/proc/<init>  (code/modules/clothing/suits/jobs.dm:115)
rt.def("/obj/item/clothing/suit/hazardvest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/flashlight"), T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/device/t_scanner"), T("/obj/item/device/radio")));
	return f.dot;
});

rt.type(7843, "/obj/item/clothing/suit/apron/surgical", "/obj/item/clothing/suit/apron", {
	name: "surgical apron",
	desc: "A sterile blue surgical apron.",
	icon_state: "surgical",
	allowed: null,
});

// /obj/item/clothing/suit/apron/surgical/proc/<init>  (code/modules/clothing/suits/jobs.dm:175)
rt.def("/obj/item/clothing/suit/apron/surgical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/hemostat"), T("/obj/item/weapon/retractor")));
	return f.dot;
});

rt.type(7873, "/obj/item/clothing/suit/curator", "/obj/item/clothing/suit", {
	blood_overlay_type: "coat",
	name: "treasure hunter's coat",
	desc: "Both fashionable and lightly armoured, this jacket is favoured by treasure hunters the galaxy over.",
	icon_state: "curator",
	item_state: "curator",
	body_parts_covered: 386,
	allowed: null,
	armor: null,
	cold_protection: 386,
	heat_protection: 386,
});

// /obj/item/clothing/suit/curator/proc/<init>  (code/modules/clothing/suits/jobs.dm:185)
rt.def("/obj/item/clothing/suit/curator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/melee/curator_whip")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 25, "energy", 10, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 45]));
	return f.dot;
});
