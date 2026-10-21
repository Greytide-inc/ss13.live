// From code/modules/research/designs/medical_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3255, "/datum/design/mass_spectrometer", "/datum/design", {
	name: "Mass-Spectrometer",
	desc: "A device for analyzing chemicals in the blood.",
	id: "mass_spectrometer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/mass_spectrometer"),
});

// /datum/design/mass_spectrometer/proc/<init>  (code/modules/research/designs/medical_designs.dm:10)
rt.def("/datum/design/mass_spectrometer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 2, "plasmatech", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3256, "/datum/design/adv_mass_spectrometer", "/datum/design", {
	name: "Advanced Mass-Spectrometer",
	desc: "A device for analyzing chemicals in the blood and their quantities.",
	id: "adv_mass_spectrometer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/mass_spectrometer/adv"),
});

// /datum/design/adv_mass_spectrometer/proc/<init>  (code/modules/research/designs/medical_designs.dm:20)
rt.def("/datum/design/adv_mass_spectrometer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 3, "magnets", 4, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3257, "/datum/design/mmi", "/datum/design", {
	name: "Man-Machine Interface",
	desc: "The Warrior's bland acronym, MMI, obscures the true horror of this monstrosity.",
	id: "mmi",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 75,
	category: null,
	build_path: rt.typePath("/obj/item/device/mmi"),
});

// /datum/design/mmi/proc/<init>  (code/modules/research/designs/medical_designs.dm:30)
rt.def("/datum/design/mmi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "biotech", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 500]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3258, "/datum/design/posibrain", "/datum/design", {
	name: "Positronic Brain",
	desc: "The latest in Artificial Intelligences.",
	id: "mmi_posi",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 75,
	category: null,
	build_path: rt.typePath("/obj/item/device/mmi/posibrain"),
});

// /datum/design/posibrain/proc/<init>  (code/modules/research/designs/medical_designs.dm:41)
rt.def("/datum/design/posibrain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "biotech", 4, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1700, "$glass", 1350, "$gold", 500]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3259, "/datum/design/bluespacebeaker", "/datum/design", {
	name: "Bluespace Beaker",
	desc: "A bluespace beaker, powered by experimental bluespace technology and Element Cuban combined with the Compound Pete. Can hold up to 300 units.",
	id: "bluespacebeaker",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"),
});

// /datum/design/bluespacebeaker/proc/<init>  (code/modules/research/designs/medical_designs.dm:52)
rt.def("/datum/design/bluespacebeaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 6, "materials", 5, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 3000, "$plasma", 3000, "$diamond", 250, "$bluespace", 250]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3260, "/datum/design/noreactbeaker", "/datum/design", {
	name: "Cryostasis Beaker",
	desc: "A cryostasis beaker that allows for chemical storage without reactions. Can hold up to 50 units.",
	id: "splitbeaker",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/glass/beaker/noreact"),
});

// /datum/design/noreactbeaker/proc/<init>  (code/modules/research/designs/medical_designs.dm:62)
rt.def("/datum/design/noreactbeaker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "engineering", 3, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3261, "/datum/design/bluespacesyringe", "/datum/design", {
	name: "Bluespace Syringe",
	desc: "An advanced syringe that can hold 60 units of chemicals",
	id: "bluespacesyringe",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/syringe/bluespace"),
});

// /datum/design/bluespacesyringe/proc/<init>  (code/modules/research/designs/medical_designs.dm:72)
rt.def("/datum/design/bluespacesyringe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 5, "materials", 4, "biotech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000, "$plasma", 1000, "$diamond", 1000, "$bluespace", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3262, "/datum/design/noreactsyringe", "/datum/design", {
	name: "Cryo Syringe",
	desc: "An advanced syringe that stops reagents inside from reacting. It can hold up to 20 units.",
	id: "noreactsyringe",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/syringe/noreact"),
});

// /datum/design/noreactsyringe/proc/<init>  (code/modules/research/designs/medical_designs.dm:82)
rt.def("/datum/design/noreactsyringe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000, "$gold", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3263, "/datum/design/piercesyringe", "/datum/design", {
	name: "Piercing Syringe",
	desc: "A diamond-tipped syringe that pierces armor when launched at high velocity. It can hold up to 10 units.",
	id: "piercesyringe",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/reagent_containers/syringe/piercing"),
});

// /datum/design/piercesyringe/proc/<init>  (code/modules/research/designs/medical_designs.dm:92)
rt.def("/datum/design/piercesyringe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 7, "combat", 3, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000, "$diamond", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3264, "/datum/design/bluespacebodybag", "/datum/design", {
	name: "Bluespace Body Bag",
	desc: "A bluespace body bag, powered by experimental bluespace technology. It can hold loads of bodies and the largest of creatures.",
	id: "bluespacebodybag",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/bodybag/bluespace"),
});

// /datum/design/bluespacebodybag/proc/<init>  (code/modules/research/designs/medical_designs.dm:102)
rt.def("/datum/design/bluespacebodybag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 5, "materials", 4, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000, "$plasma", 2000, "$diamond", 500, "$bluespace", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3265, "/datum/design/plasmarefiller", "/datum/design", {
	name: "Plasma-Man Jumpsuit Refill",
	desc: "A refill pack for the auto-extinguisher on Plasma-man suits.",
	id: "plasmarefiller",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/extinguisher_refill"),
});

// /datum/design/plasmarefiller/proc/<init>  (code/modules/research/designs/medical_designs.dm:112)
rt.def("/datum/design/plasmarefiller/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$plasma", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3266, "/datum/design/alienscalpel", "/datum/design", {
	name: "Alien Scalpel",
	desc: "An advanced scalpel obtained through Abductor technology.",
	id: "alien_scalpel",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/scalpel/alien"),
});

// /datum/design/alienscalpel/proc/<init>  (code/modules/research/designs/medical_designs.dm:122)
rt.def("/datum/design/alienscalpel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "materials", 4, "abductor", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$silver", 1500, "$plasma", 500, "$titanium", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3267, "/datum/design/alienhemostat", "/datum/design", {
	name: "Alien Hemostat",
	desc: "An advanced hemostat obtained through Abductor technology.",
	id: "alien_hemostat",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/hemostat/alien"),
});

// /datum/design/alienhemostat/proc/<init>  (code/modules/research/designs/medical_designs.dm:132)
rt.def("/datum/design/alienhemostat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "materials", 4, "abductor", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$silver", 1500, "$plasma", 500, "$titanium", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3268, "/datum/design/alienretractor", "/datum/design", {
	name: "Alien Retractor",
	desc: "An advanced retractor obtained through Abductor technology.",
	id: "alien_retractor",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/retractor/alien"),
});

// /datum/design/alienretractor/proc/<init>  (code/modules/research/designs/medical_designs.dm:142)
rt.def("/datum/design/alienretractor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "materials", 4, "abductor", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$silver", 1500, "$plasma", 500, "$titanium", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3269, "/datum/design/aliensaw", "/datum/design", {
	name: "Alien Circular Saw",
	desc: "An advanced surgical saw obtained through Abductor technology.",
	id: "alien_saw",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circular_saw/alien"),
});

// /datum/design/aliensaw/proc/<init>  (code/modules/research/designs/medical_designs.dm:152)
rt.def("/datum/design/aliensaw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "materials", 4, "abductor", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$silver", 2500, "$plasma", 1000, "$titanium", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3270, "/datum/design/aliendrill", "/datum/design", {
	name: "Alien Drill",
	desc: "An advanced drill obtained through Abductor technology.",
	id: "alien_drill",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/surgicaldrill/alien"),
});

// /datum/design/aliendrill/proc/<init>  (code/modules/research/designs/medical_designs.dm:162)
rt.def("/datum/design/aliendrill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "materials", 4, "abductor", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$silver", 2500, "$plasma", 1000, "$titanium", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3271, "/datum/design/aliencautery", "/datum/design", {
	name: "Alien Cautery",
	desc: "An advanced cautery obtained through Abductor technology.",
	id: "alien_cautery",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/cautery/alien"),
});

// /datum/design/aliencautery/proc/<init>  (code/modules/research/designs/medical_designs.dm:172)
rt.def("/datum/design/aliencautery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "materials", 4, "abductor", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$silver", 1500, "$plasma", 500, "$titanium", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3272, "/datum/design/cyberimp_welding", "/datum/design", {
	name: "Welding Shield Eyes",
	desc: "These reactive micro-shields will protect you from welders and flashes without obscuring your vision.",
	id: "ci-welding",
	req_tech: null,
	build_type: 18,
	construction_time: 40,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/eyes/robotic/shield"),
});

// /datum/design/cyberimp_welding/proc/<init>  (code/modules/research/designs/medical_designs.dm:186)
rt.def("/datum/design/cyberimp_welding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "biotech", 4, "engineering", 5, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 400]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3273, "/datum/design/cyberimp_gloweyes", "/datum/design", {
	name: "Luminescent Eyes",
	desc: "A pair of cybernetic eyes that can emit multicolored light",
	id: "ci-gloweyes",
	req_tech: null,
	build_type: 18,
	construction_time: 40,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/eyes/robotic/glow"),
});

// /datum/design/cyberimp_gloweyes/proc/<init>  (code/modules/research/designs/medical_designs.dm:197)
rt.def("/datum/design/cyberimp_gloweyes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "biotech", 3, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 1000]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3274, "/datum/design/cyberimp_breather", "/datum/design", {
	name: "Breathing Tube Implant",
	desc: "This simple implant adds an internals connector to your back, allowing you to use internals without a mask and protecting you from being choked.",
	id: "ci-breather",
	req_tech: null,
	build_type: 18,
	construction_time: 35,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/mouth/breathing_tube"),
});

// /datum/design/cyberimp_breather/proc/<init>  (code/modules/research/designs/medical_designs.dm:208)
rt.def("/datum/design/cyberimp_breather/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "biotech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 250]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3275, "/datum/design/cyberimp_toolset", "/datum/design", {
	name: "Toolset Arm Implant",
	desc: "A stripped-down version of engineering cyborg toolset, designed to be installed on subject's arm.",
	id: "ci-toolset",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/arm/toolset"),
});

// /datum/design/cyberimp_toolset/proc/<init>  (code/modules/research/designs/medical_designs.dm:219)
rt.def("/datum/design/cyberimp_toolset/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "engineering", 4, "biotech", 4, "powerstorage", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2500, "$glass", 1500, "$silver", 1500]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3276, "/datum/design/cyberimp_medical_hud", "/datum/design", {
	name: "Medical HUD Implant",
	desc: "These cybernetic eyes will display a medical HUD over everything you see. Wiggle eyes to control.",
	id: "ci-medhud",
	req_tech: null,
	build_type: 18,
	construction_time: 50,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/eyes/hud/medical"),
});

// /datum/design/cyberimp_medical_hud/proc/<init>  (code/modules/research/designs/medical_designs.dm:230)
rt.def("/datum/design/cyberimp_medical_hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "programming", 4, "biotech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$silver", 500, "$gold", 500]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3277, "/datum/design/cyberimp_security_hud", "/datum/design", {
	name: "Security HUD Implant",
	desc: "These cybernetic eyes will display a security HUD over everything you see. Wiggle eyes to control.",
	id: "ci-sechud",
	req_tech: null,
	build_type: 18,
	construction_time: 50,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/eyes/hud/security"),
});

// /datum/design/cyberimp_security_hud/proc/<init>  (code/modules/research/designs/medical_designs.dm:241)
rt.def("/datum/design/cyberimp_security_hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "programming", 4, "biotech", 4, "combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$silver", 750, "$gold", 750]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3278, "/datum/design/cyberimp_xray", "/datum/design", {
	name: "X-Ray Eyes",
	desc: "These cybernetic eyes will give you X-ray vision. Blinking is futile.",
	id: "ci-xray",
	req_tech: null,
	build_type: 18,
	construction_time: 60,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/eyes/robotic/xray"),
});

// /datum/design/cyberimp_xray/proc/<init>  (code/modules/research/designs/medical_designs.dm:252)
rt.def("/datum/design/cyberimp_xray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 7, "programming", 5, "biotech", 7, "magnets", 5, "plasmatech", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$silver", 600, "$gold", 600, "$plasma", 1000, "$uranium", 1000, "$diamond", 1000, "$bluespace", 1000]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3279, "/datum/design/cyberimp_thermals", "/datum/design", {
	name: "Thermal Eyes",
	desc: "These cybernetic eyes will give you Thermal vision. Vertical slit pupil included.",
	id: "ci-thermals",
	req_tech: null,
	build_type: 18,
	construction_time: 60,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/eyes/robotic/thermals"),
});

// /datum/design/cyberimp_thermals/proc/<init>  (code/modules/research/designs/medical_designs.dm:263)
rt.def("/datum/design/cyberimp_thermals/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 6, "programming", 4, "biotech", 7, "magnets", 5, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$silver", 600, "$gold", 600, "$plasma", 1000, "$diamond", 2000]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3280, "/datum/design/cyberimp_antidrop", "/datum/design", {
	name: "Anti-Drop Implant",
	desc: "This cybernetic brain implant will allow you to force your hand muscles to contract, preventing item dropping. Twitch ear to toggle.",
	id: "ci-antidrop",
	req_tech: null,
	build_type: 18,
	construction_time: 60,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/brain/anti_drop"),
});

// /datum/design/cyberimp_antidrop/proc/<init>  (code/modules/research/designs/medical_designs.dm:274)
rt.def("/datum/design/cyberimp_antidrop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "programming", 6, "biotech", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$silver", 400, "$gold", 400]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3281, "/datum/design/cyberimp_antistun", "/datum/design", {
	name: "CNS Rebooter Implant",
	desc: "This implant will automatically give you back control over your central nervous system, reducing downtime when stunned.",
	id: "ci-antistun",
	req_tech: null,
	build_type: 18,
	construction_time: 60,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/brain/anti_stun"),
});

// /datum/design/cyberimp_antistun/proc/<init>  (code/modules/research/designs/medical_designs.dm:285)
rt.def("/datum/design/cyberimp_antistun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 6, "programming", 5, "biotech", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$silver", 500, "$gold", 1000]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3282, "/datum/design/cyberimp_nutriment", "/datum/design", {
	name: "Nutriment Pump Implant",
	desc: "This implant with synthesize and pump into your bloodstream a small amount of nutriment when you are starving.",
	id: "ci-nutriment",
	req_tech: null,
	build_type: 18,
	construction_time: 40,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/chest/nutriment"),
});

// /datum/design/cyberimp_nutriment/proc/<init>  (code/modules/research/designs/medical_designs.dm:296)
rt.def("/datum/design/cyberimp_nutriment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "powerstorage", 4, "biotech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500, "$gold", 500]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3283, "/datum/design/cyberimp_nutriment_plus", "/datum/design", {
	name: "Nutriment Pump Implant PLUS",
	desc: "This implant with synthesize and pump into your bloodstream a small amount of nutriment when you are hungry.",
	id: "ci-nutrimentplus",
	req_tech: null,
	build_type: 18,
	construction_time: 50,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/chest/nutriment/plus"),
});

// /datum/design/cyberimp_nutriment_plus/proc/<init>  (code/modules/research/designs/medical_designs.dm:307)
rt.def("/datum/design/cyberimp_nutriment_plus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "powerstorage", 4, "biotech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$gold", 500, "$uranium", 750]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3284, "/datum/design/cyberimp_reviver", "/datum/design", {
	name: "Reviver Implant",
	desc: "This implant will attempt to revive you if you lose consciousness. For the faint of heart!",
	id: "ci-reviver",
	req_tech: null,
	build_type: 18,
	construction_time: 60,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/chest/reviver"),
});

// /datum/design/cyberimp_reviver/proc/<init>  (code/modules/research/designs/medical_designs.dm:318)
rt.def("/datum/design/cyberimp_reviver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "programming", 4, "biotech", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 800, "$gold", 300, "$uranium", 500]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3285, "/datum/design/cyberimp_thrusters", "/datum/design", {
	name: "Thrusters Set Implant",
	desc: "This implant will allow you to use gas from environment or your internals for propulsion in zero-gravity areas.",
	id: "ci-thrusters",
	req_tech: null,
	build_type: 18,
	construction_time: 80,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/organ/cyberimp/chest/thrusters"),
});

// /datum/design/cyberimp_thrusters/proc/<init>  (code/modules/research/designs/medical_designs.dm:329)
rt.def("/datum/design/cyberimp_thrusters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "biotech", 5, "magnets", 4, "engineering", 7]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$glass", 2000, "$silver", 1000, "$diamond", 1000]));
	rt.setSv(f, "category", rt.list("Misc", "Medical Designs"));
	return f.dot;
});

rt.type(3286, "/datum/design/implanter", "/datum/design", {
	name: "Implanter",
	desc: "A sterile automatic implant injector.",
	id: "implanter",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/implanter"),
});

// /datum/design/implanter/proc/<init>  (code/modules/research/designs/medical_designs.dm:345)
rt.def("/datum/design/implanter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "biotech", 3, "programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3287, "/datum/design/implantcase", "/datum/design", {
	name: "Implant Case",
	desc: "A glass case for containing an implant.",
	id: "implantcase",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/implantcase"),
});

// /datum/design/implantcase/proc/<init>  (code/modules/research/designs/medical_designs.dm:355)
rt.def("/datum/design/implantcase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3288, "/datum/design/implant_sadtrombone", "/datum/design", {
	name: "Sad Trombone Implant Case",
	desc: "Makes death amusing.",
	id: "implant_trombone",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/implantcase/sad_trombone"),
});

// /datum/design/implant_sadtrombone/proc/<init>  (code/modules/research/designs/medical_designs.dm:365)
rt.def("/datum/design/implant_sadtrombone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "biotech", 3, "programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500, "$bananium", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3289, "/datum/design/implant_chem", "/datum/design", {
	name: "Chemical Implant Case",
	desc: "A glass case containing an implant.",
	id: "implant_chem",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/implantcase/chem"),
});

// /datum/design/implant_chem/proc/<init>  (code/modules/research/designs/medical_designs.dm:375)
rt.def("/datum/design/implant_chem/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "biotech", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 700]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});

rt.type(3290, "/datum/design/implant_tracking", "/datum/design", {
	name: "Tracking Implant Case",
	desc: "A glass case containing an implant.",
	id: "implant_tracking",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/implantcase/track"),
});

// /datum/design/implant_tracking/proc/<init>  (code/modules/research/designs/medical_designs.dm:385)
rt.def("/datum/design/implant_tracking/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "biotech", 3, "magnets", 3, "programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Medical Designs"));
	return f.dot;
});
