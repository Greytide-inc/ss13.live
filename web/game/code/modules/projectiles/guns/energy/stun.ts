// From code/modules/projectiles/guns/energy/stun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5197, "/obj/item/weapon/gun/energy/taser", "/obj/item/weapon/gun/energy", {
	name: "taser gun",
	desc: "A low-capacity, energy-based stun gun used by security teams to subdue targets at range.",
	icon_state: "taser",
	item_state: null,
	ammo_type: null,
	origin_tech: "combat=3",
	ammo_x_offset: 3,
});

// /obj/item/weapon/gun/energy/taser/proc/<init>  (code/modules/projectiles/guns/energy/stun.dm:6)
rt.def("/obj/item/weapon/gun/energy/taser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/electrode")));
	return f.dot;
});

rt.type(5198, "/obj/item/weapon/gun/energy/tesla_revolver", "/obj/item/weapon/gun/energy", {
	shaded_charge: 1,
	name: "tesla gun",
	desc: "An experimental gun based on an experimental engine, it's about as likely to kill its operator as it is the target.",
	icon_state: "tesla",
	item_state: "tesla",
	ammo_type: null,
	origin_tech: "combat=4;materials=4;powerstorage=4",
	can_flashlight: 0,
	pin: null,
});

// /obj/item/weapon/gun/energy/tesla_revolver/proc/<init>  (code/modules/projectiles/guns/energy/stun.dm:15)
rt.def("/obj/item/weapon/gun/energy/tesla_revolver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/tesla_revolver")));
	return f.dot;
});

rt.type(5153, "/obj/item/weapon/gun/energy/e_gun/advtaser", "/obj/item/weapon/gun/energy/e_gun", {
	name: "hybrid taser",
	desc: "A dual-mode taser designed to fire both short-range high-power electrodes and long-range disabler beams.",
	icon_state: "advtaser",
	origin_tech: "combat=4",
	ammo_x_offset: 2,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/advtaser/proc/<init>  (code/modules/projectiles/guns/energy/stun.dm:25)
rt.def("/obj/item/weapon/gun/energy/e_gun/advtaser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/disabler")));
	return f.dot;
});

rt.type(5199, "/obj/item/weapon/gun/energy/disabler", "/obj/item/weapon/gun/energy", {
	name: "disabler",
	desc: "A self-defense weapon that exhausts organic targets, weakening them until they collapse.",
	icon_state: "disabler",
	item_state: null,
	origin_tech: "combat=3",
	ammo_type: null,
	ammo_x_offset: 3,
});

// /obj/item/weapon/gun/energy/disabler/proc/<init>  (code/modules/projectiles/guns/energy/stun.dm:42)
rt.def("/obj/item/weapon/gun/energy/disabler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/disabler")));
	return f.dot;
});
