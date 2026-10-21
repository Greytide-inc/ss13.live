// From code/modules/projectiles/guns/energy/laser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5133, "/obj/item/weapon/gun/energy/laser", "/obj/item/weapon/gun/energy", {
	name: "laser gun",
	desc: "A basic energy-based laser gun that fires concentrated beams of light which pass through glass and thin metal.",
	icon_state: "laser",
	item_state: "laser",
	w_class: 3,
	materials: null,
	origin_tech: "combat=4;magnets=2",
	ammo_x_offset: 1,
	shaded_charge: 1,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:7)
rt.def("/obj/item/weapon/gun/energy/laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	$0 = $0;
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/lasergun")));
	return f.dot;
});

rt.type(5139, "/obj/item/weapon/gun/energy/laser/practice", "/obj/item/weapon/gun/energy/laser", {
	name: "practice laser gun",
	desc: "A modified version of the basic laser gun, this one fires less concentrated energy bolts designed for target practice.",
	origin_tech: "combat=2;magnets=2",
	clumsy_check: 0,
	needs_permit: 0,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/practice/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:17)
rt.def("/obj/item/weapon/gun/energy/laser/practice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/practice")));
	return f.dot;
});

rt.type(5138, "/obj/item/weapon/gun/energy/laser/retro/old", "/obj/item/weapon/gun/energy/laser/retro", {
	name: "laser gun",
	icon_state: "retro",
	desc: "First generation lasergun, developed by Nanotrasen. Suffers from ammo issues but its unique ability to recharge its ammo without the need of a magazine helps compensate. You really hope someone has developed a better lasergun while you were in cyro.",
	ammo_x_offset: 3,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/retro/old/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:31)
rt.def("/obj/item/weapon/gun/energy/laser/retro/old/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/lasergun/old")));
	return f.dot;
});

rt.type(5144, "/obj/item/weapon/gun/energy/laser/captain/scattershot", "/obj/item/weapon/gun/energy/laser/captain", {
	name: "scatter shot laser rifle",
	icon_state: "lasercannon",
	item_state: "laser",
	desc: "An industrial-grade heavy-duty laser rifle with a modified laser lense to scatter its shot into multiple smaller lasers. The inner-core can self-charge for theorically infinite use.",
	origin_tech: "combat=5;materials=4;powerstorage=4",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/captain/scattershot/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:51)
rt.def("/obj/item/weapon/gun/energy/laser/captain/scattershot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/scatter"), T("/obj/item/ammo_casing/energy/laser")));
	return f.dot;
});

rt.type(5146, "/obj/item/weapon/gun/energy/laser/scatter", "/obj/item/weapon/gun/energy/laser", {
	name: "scatter laser gun",
	desc: "A laser gun equipped with a refraction kit that spreads bolts.",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/scatter/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:65)
rt.def("/obj/item/weapon/gun/energy/laser/scatter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/scatter"), T("/obj/item/ammo_casing/energy/laser")));
	return f.dot;
});

rt.type(5147, "/obj/item/weapon/gun/energy/laser/scatter/shotty", "/obj/item/weapon/gun/energy/laser/scatter", {
	name: "energy shotgun",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "cshotgun",
	item_state: "shotgun",
	desc: "A combat shotgun gutted and refitted with an internal laser system. Can switch between taser and scattered disabler shots.",
	shaded_charge: 0,
	pin: rt.typePath("/obj/item/device/firing_pin/implant/mindshield"),
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/scatter/shotty/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:75)
rt.def("/obj/item/weapon/gun/energy/laser/scatter/shotty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/scatter/disabler"), T("/obj/item/ammo_casing/energy/electrode")));
	return f.dot;
});

rt.type(5172, "/obj/item/weapon/gun/energy/lasercannon", "/obj/item/weapon/gun/energy", {
	flags: 64,
	name: "accelerator laser cannon",
	desc: "An advanced laser cannon that does more damage the farther away the target is.",
	icon_state: "lasercannon",
	item_state: "laser",
	w_class: 4,
	force: 10,
	slot_flags: 1024,
	origin_tech: "combat=4;magnets=4;powerstorage=3",
	ammo_type: null,
	ammo_x_offset: 3,
	pin: null,
});

// /obj/item/weapon/gun/energy/lasercannon/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:89)
rt.def("/obj/item/weapon/gun/energy/lasercannon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/accelerator")));
	return f.dot;
});

rt.type(8870, "/obj/item/projectile/beam/laser/accelerator", "/obj/item/projectile/beam/laser", {
	name: "accelerator laser",
	icon_state: "scatterlaser",
	range: 255,
	damage: 6,
});

// /obj/item/projectile/beam/laser/accelerator/proc/Range  (code/modules/projectiles/guns/energy/laser.dm:105)  may sleep
rt.def("/obj/item/projectile/beam/laser/accelerator/proc/Range", function* Range(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "damage", 7, add);
	(rt.modSrcVar(f, "transform", add(1, multiply(divide(rt.sv(f, "damage"), 7), 0.20000000298023224)), multiply));
	return f.dot;
}, true);

rt.type(5173, "/obj/item/weapon/gun/energy/xray", "/obj/item/weapon/gun/energy", {
	name: "xray laser gun",
	desc: "A high-power laser gun capable of expelling concentrated xray blasts that pass through multiple soft targets and heavier materials",
	icon_state: "xray",
	item_state: null,
	origin_tech: "combat=6;materials=4;magnets=4;syndicate=1",
	ammo_type: null,
	ammo_x_offset: 3,
	pin: null,
});

// /obj/item/weapon/gun/energy/xray/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:115)
rt.def("/obj/item/weapon/gun/energy/xray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/xray")));
	return f.dot;
});

rt.type(5134, "/obj/item/weapon/gun/energy/laser/bluetag", "/obj/item/weapon/gun/energy/laser", {
	name: "laser tag gun",
	icon_state: "bluetag",
	desc: "A retro laser gun modified to fire harmless blue beams of light. Sound effects included!",
	origin_tech: "combat=2;magnets=2",
	clumsy_check: 0,
	needs_permit: 0,
	ammo_x_offset: 2,
	selfcharge: 1,
	ammo_type: null,
	pin: rt.typePath("/obj/item/device/firing_pin/tag/blue"),
});

// /obj/item/weapon/gun/energy/laser/bluetag/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:125)
rt.def("/obj/item/weapon/gun/energy/laser/bluetag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/bluetag")));
	return f.dot;
});

rt.type(5135, "/obj/item/weapon/gun/energy/laser/redtag", "/obj/item/weapon/gun/energy/laser", {
	name: "laser tag gun",
	icon_state: "redtag",
	desc: "A retro laser gun modified to fire harmless beams red of light. Sound effects included!",
	origin_tech: "combat=2;magnets=2",
	clumsy_check: 0,
	needs_permit: 0,
	ammo_x_offset: 2,
	selfcharge: 1,
	ammo_type: null,
	pin: rt.typePath("/obj/item/device/firing_pin/tag/red"),
});

// /obj/item/weapon/gun/energy/laser/redtag/proc/<init>  (code/modules/projectiles/guns/energy/laser.dm:137)
rt.def("/obj/item/weapon/gun/energy/laser/redtag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser/redtag")));
	return f.dot;
});
