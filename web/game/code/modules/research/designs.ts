// From code/modules/research/designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2805, "/datum/design", "/datum", {
	name: "Name",
	desc: "Desc",
	id: "id",
	req_tech: null,
	build_type: null,
	materials: null,
	construction_time: null,
	build_path: null,
	make_reagents: null,
	category: null,
	reagents_list: null,
	maxstack: 1,
	lathe_time_factor: 1,
});

// /datum/design/proc/<init>  (code/modules/research/designs.dm:33)
rt.def("/datum/design/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.list());
	$0 = $0;
	rt.setSv(f, "materials", rt.list());
	$0 = $0;
	rt.setSv(f, "make_reagents", rt.list());
	$0 = $0;
	rt.setSv(f, "reagents_list", rt.list());
	return f.dot;
});

rt.type(6676, "/obj/item/weapon/disk/design_disk", "/obj/item/weapon/disk", {
	blueprints: null,
	max_blueprints: 1,
	name: "Component Design Disk",
	desc: "A disk for storing device design data for construction in lathes.",
	icon_state: "datadisk1",
	materials: null,
});

// /obj/item/weapon/disk/design_disk/proc/<init>  (code/modules/research/designs.dm:54)
rt.def("/obj/item/weapon/disk/design_disk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "blueprints", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100]));
	return f.dot;
});

// /obj/item/weapon/disk/design_disk/proc/Initialize  (code/modules/research/designs.dm:58)  may sleep
rt.def("/obj/item/weapon/disk/design_disk/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "max_blueprints"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "blueprints", null, add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(6682, "/obj/item/weapon/disk/design_disk/adv", "/obj/item/weapon/disk/design_disk", {
	max_blueprints: 5,
	name: "Advanced Component Design Disk",
	desc: "A disk for storing device design data for construction in lathes. This one has extra storage space.",
	materials: null,
});

// /obj/item/weapon/disk/design_disk/adv/proc/<init>  (code/modules/research/designs.dm:67)
rt.def("/obj/item/weapon/disk/design_disk/adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 50]));
	return f.dot;
});

rt.type(2811, "/datum/design/intellicard", "/datum/design", {
	name: "Intellicard AI Transportation System",
	desc: "Allows for the construction of an intellicard.",
	id: "intellicard",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/aicard"),
});

// /datum/design/intellicard/proc/<init>  (code/modules/research/designs.dm:78)
rt.def("/datum/design/intellicard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "materials", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2812, "/datum/design/paicard", "/datum/design", {
	name: "Personal Artificial Intelligence Card",
	desc: "Allows for the construction of a pAI Card.",
	id: "paicard",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/paicard"),
});

// /datum/design/paicard/proc/<init>  (code/modules/research/designs.dm:88)
rt.def("/datum/design/paicard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500, "$metal", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2813, "/datum/design/design_disk", "/datum/design", {
	name: "Design Storage Disk",
	desc: "Produce additional disks for storing device designs.",
	id: "design_disk",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/disk/design_disk"),
});

// /datum/design/design_disk/proc/<init>  (code/modules/research/designs.dm:102)
rt.def("/datum/design/design_disk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2814, "/datum/design/design_disk_adv", "/datum/design", {
	name: "Advanced Design Storage Disk",
	desc: "Produce additional disks for storing device designs.",
	id: "design_disk_adv",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/disk/design_disk/adv"),
});

// /datum/design/design_disk_adv/proc/<init>  (code/modules/research/designs.dm:112)
rt.def("/datum/design/design_disk_adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 50]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2815, "/datum/design/tech_disk", "/datum/design", {
	name: "Technology Data Storage Disk",
	desc: "Produce additional disks for storing technology data.",
	id: "tech_disk",
	req_tech: null,
	build_type: 6,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/disk/tech_disk"),
});

// /datum/design/tech_disk/proc/<init>  (code/modules/research/designs.dm:122)
rt.def("/datum/design/tech_disk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2816, "/datum/design/tech_disk_adv", "/datum/design", {
	name: "Advanced Technology Data Storage Disk",
	desc: "Produce disks with extra storage capacity for storing technology data.",
	id: "tech_disk_adv",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/disk/tech_disk/adv"),
});

// /datum/design/tech_disk_adv/proc/<init>  (code/modules/research/designs.dm:132)
rt.def("/datum/design/tech_disk_adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 50]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2817, "/datum/design/tech_disk_super_adv", "/datum/design", {
	name: "Quantum Technology Data Storage Disk",
	desc: "Produce disks with extremely large storage capacity for storing technology data.",
	id: "tech_disk_super_adv",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/disk/tech_disk/super_adv"),
});

// /datum/design/tech_disk_super_adv/proc/<init>  (code/modules/research/designs.dm:142)
rt.def("/datum/design/tech_disk_super_adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 100, "$gold", 100, "$bluespace", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2818, "/datum/design/drill", "/datum/design", {
	name: "Mining Drill",
	desc: "Yours is the drill that will pierce through the rock walls.",
	id: "drill",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/pickaxe/drill"),
});

// /datum/design/drill/proc/<init>  (code/modules/research/designs.dm:156)
rt.def("/datum/design/drill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "powerstorage", 2, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000, "$glass", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2819, "/datum/design/drill_diamond", "/datum/design", {
	name: "Diamond-Tipped Mining Drill",
	desc: "Yours is the drill that will pierce the heavens!",
	id: "drill_diamond",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/pickaxe/drill/diamonddrill"),
});

// /datum/design/drill_diamond/proc/<init>  (code/modules/research/designs.dm:166)
rt.def("/datum/design/drill_diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 6, "powerstorage", 5, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000, "$glass", 1000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2820, "/datum/design/plasmacutter", "/datum/design", {
	name: "Plasma Cutter",
	desc: "You could use it to cut limbs off of xenos! Or, you know, mine stuff.",
	id: "plasmacutter",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/plasmacutter"),
});

// /datum/design/plasmacutter/proc/<init>  (code/modules/research/designs.dm:176)
rt.def("/datum/design/plasmacutter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "plasmatech", 3, "magnets", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1500, "$glass", 500, "$plasma", 400]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2821, "/datum/design/plasmacutter_adv", "/datum/design", {
	name: "Advanced Plasma Cutter",
	desc: "It's an advanced plasma cutter, oh my god.",
	id: "plasmacutter_adv",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/gun/energy/plasmacutter/adv"),
});

// /datum/design/plasmacutter_adv/proc/<init>  (code/modules/research/designs.dm:186)
rt.def("/datum/design/plasmacutter_adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "plasmatech", 4, "engineering", 2, "combat", 3, "magnets", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000, "$glass", 1000, "$plasma", 2000, "$gold", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2822, "/datum/design/jackhammer", "/datum/design", {
	name: "Sonic Jackhammer",
	desc: "Essentially a handheld planet-cracker. Can drill through walls with ease as well.",
	id: "jackhammer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/pickaxe/drill/jackhammer"),
});

// /datum/design/jackhammer/proc/<init>  (code/modules/research/designs.dm:196)
rt.def("/datum/design/jackhammer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 7, "powerstorage", 5, "engineering", 6, "magnets", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000, "$glass", 2000, "$silver", 2000, "$diamond", 6000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2823, "/datum/design/superresonator", "/datum/design", {
	name: "Upgraded Resonator",
	desc: "An upgraded version of the resonator that allows more fields to be active at once.",
	id: "superresonator",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/resonator/upgraded"),
});

// /datum/design/superresonator/proc/<init>  (code/modules/research/designs.dm:206)
rt.def("/datum/design/superresonator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "powerstorage", 3, "engineering", 3, "magnets", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$glass", 1500, "$silver", 1000, "$uranium", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2824, "/datum/design/trigger_guard_mod", "/datum/design", {
	name: "Kinetic Accelerator Trigger Guard Mod",
	desc: "A device which allows kinetic accelerators to be wielded by any organism.",
	id: "triggermod",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/trigger_guard"),
});

// /datum/design/trigger_guard_mod/proc/<init>  (code/modules/research/designs.dm:216)
rt.def("/datum/design/trigger_guard_mod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "powerstorage", 4, "engineering", 4, "magnets", 4, "combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$glass", 1500, "$gold", 1500, "$uranium", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Mining Designs"));
	return f.dot;
});

rt.type(2825, "/datum/design/damage_mod", "/datum/design", {
	name: "Kinetic Accelerator Damage Mod",
	desc: "A device which allows kinetic accelerators to deal more damage.",
	id: "damagemod",
	req_tech: null,
	build_type: 18,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/damage"),
});

// /datum/design/damage_mod/proc/<init>  (code/modules/research/designs.dm:226)
rt.def("/datum/design/damage_mod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "powerstorage", 4, "engineering", 4, "magnets", 4, "combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$glass", 1500, "$gold", 1500, "$uranium", 1000]));
	rt.setSv(f, "category", rt.list("Mining Designs", "Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(2826, "/datum/design/cooldown_mod", "/datum/design", {
	name: "Kinetic Accelerator Cooldown Mod",
	desc: "A device which decreases the cooldown of a Kinetic Accelerator.",
	id: "cooldownmod",
	req_tech: null,
	build_type: 18,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/cooldown"),
});

// /datum/design/cooldown_mod/proc/<init>  (code/modules/research/designs.dm:236)
rt.def("/datum/design/cooldown_mod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "powerstorage", 4, "engineering", 4, "magnets", 4, "combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$glass", 1500, "$gold", 1500, "$uranium", 1000]));
	rt.setSv(f, "category", rt.list("Mining Designs", "Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(2827, "/datum/design/range_mod", "/datum/design", {
	name: "Kinetic Accelerator Range Mod",
	desc: "A device which allows kinetic accelerators to fire at a further range.",
	id: "rangemod",
	req_tech: null,
	build_type: 18,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/range"),
});

// /datum/design/range_mod/proc/<init>  (code/modules/research/designs.dm:246)
rt.def("/datum/design/range_mod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "powerstorage", 4, "engineering", 4, "magnets", 4, "combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$glass", 1500, "$gold", 1500, "$uranium", 1000]));
	rt.setSv(f, "category", rt.list("Mining Designs", "Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(2828, "/datum/design/hyperaccelerator", "/datum/design", {
	name: "Kinetic Accelerator Mining AoE Mod",
	desc: "A modification kit for Kinetic Accelerators which causes it to fire AoE blasts that destroy rock.",
	id: "hypermod",
	req_tech: null,
	build_type: 18,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/aoe/turfs"),
});

// /datum/design/hyperaccelerator/proc/<init>  (code/modules/research/designs.dm:256)
rt.def("/datum/design/hyperaccelerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 7, "powerstorage", 5, "engineering", 5, "magnets", 5, "combat", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 8000, "$glass", 1500, "$silver", 2000, "$gold", 2000, "$diamond", 2000]));
	rt.setSv(f, "category", rt.list("Mining Designs", "Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(2829, "/datum/design/beacon", "/datum/design", {
	name: "Tracking Beacon",
	desc: "A blue space tracking beacon.",
	id: "beacon",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/radio/beacon"),
});

// /datum/design/beacon/proc/<init>  (code/modules/research/designs.dm:271)
rt.def("/datum/design/beacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 1]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 150, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Bluespace Designs"));
	return f.dot;
});

rt.type(2830, "/datum/design/bag_holding", "/datum/design", {
	name: "Bag of Holding",
	desc: "A backpack that opens into a localized pocket of bluespace.",
	id: "bag_holding",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/backpack/holding"),
});

// /datum/design/bag_holding/proc/<init>  (code/modules/research/designs.dm:281)
rt.def("/datum/design/bag_holding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 7, "materials", 5, "engineering", 5, "plasmatech", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 3000, "$diamond", 1500, "$uranium", 250, "$bluespace", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Bluespace Designs"));
	return f.dot;
});

rt.type(2831, "/datum/design/bluespace_crystal", "/datum/design", {
	name: "Artificial Bluespace Crystal",
	desc: "A small blue crystal with mystical properties.",
	id: "bluespace_crystal",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/ore/bluespace_crystal/artificial"),
});

// /datum/design/bluespace_crystal/proc/<init>  (code/modules/research/designs.dm:291)
rt.def("/datum/design/bluespace_crystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 3, "materials", 6, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$diamond", 1500, "$plasma", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Bluespace Designs"));
	return f.dot;
});

rt.type(2832, "/datum/design/telesci_gps", "/datum/design", {
	name: "GPS Device",
	desc: "Little thingie that can track its position at all times.",
	id: "telesci_gps",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/gps"),
});

// /datum/design/telesci_gps/proc/<init>  (code/modules/research/designs.dm:301)
rt.def("/datum/design/telesci_gps/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "bluespace", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Bluespace Designs"));
	return f.dot;
});

rt.type(2833, "/datum/design/miningsatchel_holding", "/datum/design", {
	name: "Mining Satchel of Holding",
	desc: "A mining satchel that can hold an infinite amount of ores.",
	id: "minerbag_holding",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/bag/ore/holding"),
});

// /datum/design/miningsatchel_holding/proc/<init>  (code/modules/research/designs.dm:311)
rt.def("/datum/design/miningsatchel_holding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["bluespace", 4, "materials", 3, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 250, "$uranium", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Bluespace Designs"));
	return f.dot;
});

rt.type(2834, "/datum/design/health_hud", "/datum/design", {
	name: "Health Scanner HUD",
	desc: "A heads-up display that scans the humans in view and provides accurate data about their health status.",
	id: "health_hud",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/hud/health"),
});

// /datum/design/health_hud/proc/<init>  (code/modules/research/designs.dm:326)
rt.def("/datum/design/health_hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 2, "magnets", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2835, "/datum/design/health_hud_night", "/datum/design", {
	name: "Night Vision Health Scanner HUD",
	desc: "An advanced medical head-up display that allows doctors to find patients in complete darkness.",
	id: "health_hud_night",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/hud/health/night"),
});

// /datum/design/health_hud_night/proc/<init>  (code/modules/research/designs.dm:336)
rt.def("/datum/design/health_hud_night/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 4, "magnets", 5, "plasmatech", 4, "engineering", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$uranium", 1000, "$silver", 350]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2836, "/datum/design/security_hud", "/datum/design", {
	name: "Security HUD",
	desc: "A heads-up display that scans the humans in view and provides accurate data about their ID status.",
	id: "security_hud",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/hud/security"),
});

// /datum/design/security_hud/proc/<init>  (code/modules/research/designs.dm:346)
rt.def("/datum/design/security_hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3, "combat", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2837, "/datum/design/security_hud_night", "/datum/design", {
	name: "Night Vision Security HUD",
	desc: "A heads-up display which provides id data and vision in complete darkness.",
	id: "security_hud_night",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/hud/security/night"),
});

// /datum/design/security_hud_night/proc/<init>  (code/modules/research/designs.dm:356)
rt.def("/datum/design/security_hud_night/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 4, "magnets", 5, "plasmatech", 4, "engineering", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$uranium", 1000, "$gold", 350]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2838, "/datum/design/diagnostic_hud", "/datum/design", {
	name: "Diagnostic HUD",
	desc: "A HUD used to analyze and determine faults within robotic machinery.",
	id: "dianostic_hud",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/hud/diagnostic"),
});

// /datum/design/diagnostic_hud/proc/<init>  (code/modules/research/designs.dm:366)
rt.def("/datum/design/diagnostic_hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 3, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2839, "/datum/design/diagnostic_hud_night", "/datum/design", {
	name: "Night Vision Diagnostic HUD",
	desc: "Upgraded version of the diagnostic HUD designed to function during a power failure.",
	id: "dianostic_hud_night",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/hud/diagnostic/night"),
});

// /datum/design/diagnostic_hud_night/proc/<init>  (code/modules/research/designs.dm:376)
rt.def("/datum/design/diagnostic_hud_night/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 5, "plasmatech", 4, "engineering", 6, "powerstorage", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$uranium", 1000, "$plasma", 300]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2840, "/datum/design/welding_mask", "/datum/design", {
	name: "Welding Gas Mask",
	desc: "A gas mask with built in welding goggles and face shield. Looks like a skull, clearly designed by a nerd.",
	id: "weldingmask",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/mask/gas/welding"),
});

// /datum/design/welding_mask/proc/<init>  (code/modules/research/designs.dm:404)
rt.def("/datum/design/welding_mask/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 2, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000, "$glass", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2841, "/datum/design/portaseeder", "/datum/design", {
	name: "Portable Seed Extractor",
	desc: "For the enterprising botanist on the go. Less efficient than the stationary model, it creates one seed per plant.",
	build_type: 2,
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/bag/plants/portaseeder"),
});

// /datum/design/portaseeder/proc/<init>  (code/modules/research/designs.dm:414)
rt.def("/datum/design/portaseeder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["biotech", 3, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 400]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2842, "/datum/design/air_horn", "/datum/design", {
	name: "Air Horn",
	desc: "Damn son, where'd you find this?",
	id: "air_horn",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/bikehorn/airhorn"),
});

// /datum/design/air_horn/proc/<init>  (code/modules/research/designs.dm:423)
rt.def("/datum/design/air_horn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$bananium", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2843, "/datum/design/mesons", "/datum/design", {
	name: "Optical Meson Scanners",
	desc: "Used by engineering and mining staff to see basic structural and terrain layouts through walls, regardless of lighting condition.",
	id: "mesons",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/meson"),
});

// /datum/design/mesons/proc/<init>  (code/modules/research/designs.dm:433)
rt.def("/datum/design/mesons/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 2, "engineering", 2, "plasmatech", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2844, "/datum/design/engine_goggles", "/datum/design", {
	name: "Engineering Scanner Goggles",
	desc: "Goggles used by engineers. The Meson Scanner mode lets you see basic structural and terrain layouts through walls, regardless of lighting condition. The T-ray Scanner mode lets you see underfloor objects such as cables and pipes.",
	id: "engine_goggles",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/meson/engine"),
});

// /datum/design/engine_goggles/proc/<init>  (code/modules/research/designs.dm:443)
rt.def("/datum/design/engine_goggles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "magnets", 3, "engineering", 4, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500, "$plasma", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2845, "/datum/design/tray_goggles", "/datum/design", {
	name: "Optical T-Ray Scanners",
	desc: "Used by engineering staff to see underfloor objects such as cables and pipes.",
	id: "tray_goggles",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/meson/engine/tray"),
});

// /datum/design/tray_goggles/proc/<init>  (code/modules/research/designs.dm:453)
rt.def("/datum/design/tray_goggles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 3, "magnets", 2, "engineering", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2846, "/datum/design/nvgmesons", "/datum/design", {
	name: "Night Vision Optical Meson Scanners",
	desc: "Prototype meson scanners fitted with an extra sensor which amplifies the visible light spectrum and overlays it to the UHD display.",
	id: "nvgmesons",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/meson/night"),
});

// /datum/design/nvgmesons/proc/<init>  (code/modules/research/designs.dm:463)
rt.def("/datum/design/nvgmesons/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 5, "plasmatech", 5, "engineering", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$plasma", 350, "$uranium", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2847, "/datum/design/night_vision_goggles", "/datum/design", {
	name: "Night Vision Goggles",
	desc: "Goggles that let you see through darkness unhindered.",
	id: "night_visision_goggles",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/night"),
});

// /datum/design/night_vision_goggles/proc/<init>  (code/modules/research/designs.dm:473)
rt.def("/datum/design/night_vision_goggles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "magnets", 5, "plasmatech", 4, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 600, "$plasma", 350, "$uranium", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2848, "/datum/design/magboots", "/datum/design", {
	name: "Magnetic Boots",
	desc: "Magnetic boots, often used during extravehicular activity to ensure the user remains safely attached to the vehicle.",
	id: "magboots",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/shoes/magboots"),
});

// /datum/design/magboots/proc/<init>  (code/modules/research/designs.dm:483)
rt.def("/datum/design/magboots/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "magnets", 4, "engineering", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4500, "$silver", 1500, "$gold", 2500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2849, "/datum/design/sci_goggles", "/datum/design", {
	name: "Science Goggles",
	desc: "Goggles fitted with a portable analyzer capable of determining the research worth of an item or components of a machine.",
	id: "scigoggles",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/clothing/glasses/science"),
});

// /datum/design/sci_goggles/proc/<init>  (code/modules/research/designs.dm:493)
rt.def("/datum/design/sci_goggles/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2850, "/datum/design/handdrill", "/datum/design", {
	name: "Hand Drill",
	desc: "A small electric hand drill with an interchangable screwdriver and bolt bit",
	id: "handdrill",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/screwdriver/power"),
});

// /datum/design/handdrill/proc/<init>  (code/modules/research/designs.dm:503)
rt.def("/datum/design/handdrill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3500, "$silver", 1500, "$titanium", 2500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2851, "/datum/design/jawsoflife", "/datum/design", {
	name: "Jaws of Life",
	desc: "A small, compact Jaws of Life with an interchangable pry jaws and cutting jaws",
	id: "jawsoflife",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/crowbar/power"),
});

// /datum/design/jawsoflife/proc/<init>  (code/modules/research/designs.dm:513)
rt.def("/datum/design/jawsoflife/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 6, "magnets", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4500, "$silver", 2500, "$titanium", 3500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2852, "/datum/design/alienwrench", "/datum/design", {
	name: "Alien Wrench",
	desc: "An advanced wrench obtained through Abductor technology.",
	id: "alien_wrench",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/wrench/abductor"),
});

// /datum/design/alienwrench/proc/<init>  (code/modules/research/designs.dm:523)
rt.def("/datum/design/alienwrench/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "materials", 5, "abductor", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$silver", 2500, "$plasma", 1000, "$titanium", 2000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2853, "/datum/design/alienwirecutters", "/datum/design", {
	name: "Alien Wirecutters",
	desc: "Advanced wirecutters obtained through Abductor technology.",
	id: "alien_wirecutters",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/wirecutters/abductor"),
});

// /datum/design/alienwirecutters/proc/<init>  (code/modules/research/designs.dm:533)
rt.def("/datum/design/alienwirecutters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "materials", 5, "abductor", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$silver", 2500, "$plasma", 1000, "$titanium", 2000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2854, "/datum/design/alienscrewdriver", "/datum/design", {
	name: "Alien Screwdriver",
	desc: "An advanced screwdriver obtained through Abductor technology.",
	id: "alien_screwdriver",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/screwdriver/abductor"),
});

// /datum/design/alienscrewdriver/proc/<init>  (code/modules/research/designs.dm:543)
rt.def("/datum/design/alienscrewdriver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "materials", 5, "abductor", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$silver", 2500, "$plasma", 1000, "$titanium", 2000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2855, "/datum/design/aliencrowbar", "/datum/design", {
	name: "Alien Crowbar",
	desc: "An advanced crowbar obtained through Abductor technology.",
	id: "alien_crowbar",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/crowbar/abductor"),
});

// /datum/design/aliencrowbar/proc/<init>  (code/modules/research/designs.dm:553)
rt.def("/datum/design/aliencrowbar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "materials", 5, "abductor", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$silver", 2500, "$plasma", 1000, "$titanium", 2000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2856, "/datum/design/alienwelder", "/datum/design", {
	name: "Alien Welding Tool",
	desc: "An advanced welding tool obtained through Abductor technology.",
	id: "alien_welder",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/weldingtool/abductor"),
});

// /datum/design/alienwelder/proc/<init>  (code/modules/research/designs.dm:563)
rt.def("/datum/design/alienwelder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "plasmatech", 5, "abductor", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$silver", 2500, "$plasma", 5000, "$titanium", 2000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2857, "/datum/design/alienmultitool", "/datum/design", {
	name: "Alien Multitool",
	desc: "An advanced multitool obtained through Abductor technology.",
	id: "alien_multitool",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/device/multitool/abductor"),
});

// /datum/design/alienmultitool/proc/<init>  (code/modules/research/designs.dm:573)
rt.def("/datum/design/alienmultitool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "programming", 5, "abductor", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$silver", 2500, "$plasma", 5000, "$titanium", 2000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2858, "/datum/design/diskplantgene", "/datum/design", {
	name: "Plant Data Disk",
	desc: "A disk for storing plant genetic data.",
	id: "diskplantgene",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/disk/plantgene"),
});

// /datum/design/diskplantgene/proc/<init>  (code/modules/research/designs.dm:583)
rt.def("/datum/design/diskplantgene/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "biotech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 200, "$glass", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Electronics"));
	return f.dot;
});

rt.type(2859, "/datum/design/advmop", "/datum/design", {
	name: "Advanced Mop",
	desc: "An upgraded mop with a large internal capacity for holding water or other cleaning chemicals.",
	id: "advmop",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/mop/advanced"),
});

// /datum/design/advmop/proc/<init>  (code/modules/research/designs.dm:597)
rt.def("/datum/design/advmop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2500, "$glass", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2860, "/datum/design/blutrash", "/datum/design", {
	name: "Trashbag of Holding",
	desc: "An advanced trash bag with bluespace properties; capable of holding a plethora of garbage.",
	id: "blutrash",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/storage/bag/trash/bluespace"),
});

// /datum/design/blutrash/proc/<init>  (code/modules/research/designs.dm:607)
rt.def("/datum/design/blutrash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "bluespace", 4, "engineering", 4, "plasmatech", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 1500, "$uranium", 250, "$plasma", 1500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2861, "/datum/design/buffer", "/datum/design", {
	name: "Floor Buffer Upgrade",
	desc: "A floor buffer that can be attached to vehicular janicarts.",
	id: "buffer",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/janiupgrade"),
});

// /datum/design/buffer/proc/<init>  (code/modules/research/designs.dm:617)
rt.def("/datum/design/buffer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000, "$glass", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2862, "/datum/design/holosign", "/datum/design", {
	name: "Holographic Sign Projector",
	desc: "A holograpic projector used to project various warning signs.",
	id: "holosign",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/holosign_creator"),
});

// /datum/design/holosign/proc/<init>  (code/modules/research/designs.dm:627)
rt.def("/datum/design/holosign/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$glass", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});

rt.type(2863, "/datum/design/exwelder", "/datum/design", {
	name: "Experimental Welding Tool",
	desc: "An experimental welder capable of self-fuel generation.",
	id: "exwelder",
	req_tech: null,
	build_type: 2,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/weldingtool/experimental"),
});

// /datum/design/exwelder/proc/<init>  (code/modules/research/designs.dm:641)
rt.def("/datum/design/exwelder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 5, "bluespace", 3, "plasmatech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 500, "$plasma", 1500, "$uranium", 200]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Equipment"));
	return f.dot;
});
