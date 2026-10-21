// Types declared in code/modules/projectiles/projectile that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(8717, "/obj/item/ammo_casing/energy/wormhole/orange", "/obj/item/ammo_casing/energy/wormhole", {
	select_name: "orange",
	projectile_type: rt.typePath("/obj/item/projectile/beam/wormhole/orange"),
});
rt.type(8794, "/obj/item/projectile/bullet/reusable/arrow", "/obj/item/projectile/bullet/reusable", {
	name: "arrow",
	icon_state: "arrow",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/arrow"),
	range: 10,
	damage: 25,
	damage_type: "brute",
});
rt.type(8795, "/obj/item/projectile/bullet/reusable/magspear", "/obj/item/projectile/bullet/reusable", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/magspear"),
	name: "magnetic spear",
	desc: "WHITE WHALE, HOLY GRAIL",
	damage: 30,
	icon_state: "magspear",
});
rt.type(8797, "/obj/item/projectile/bullet/reusable/foam_dart/riot", "/obj/item/projectile/bullet/reusable/foam_dart", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
	name: "riot foam dart",
	icon_state: "foamdart_riot_proj",
	stamina: 25,
});
rt.type(8804, "/obj/item/projectile/bullet/incendiary/firebullet", "/obj/item/projectile/bullet/incendiary", {
	damage: 10,
});
rt.type(8806, "/obj/item/projectile/bullet/incendiary/shell/dragonsbreath", "/obj/item/projectile/bullet/incendiary/shell", {
	name: "dragonsbreath round",
	damage: 5,
});
rt.type(8821, "/obj/item/projectile/bullet/meteorshot/weak", "/obj/item/projectile/bullet/meteorshot", {
	damage: 10,
	knockdown: 80,
});
rt.type(8826, "/obj/item/projectile/bullet/dart/syringe", "/obj/item/projectile/bullet/dart", {
	name: "syringe",
	icon_state: "syringeproj",
});
rt.type(8830, "/obj/item/projectile/bullet/sniper/gang", "/obj/item/projectile/bullet/sniper", {
	damage: 55,
	knockdown: 20,
	dismemberment: 15,
	armour_penetration: 25,
});
rt.type(8834, "/obj/item/projectile/bullet/sniper/penetrator", "/obj/item/projectile/bullet/sniper", {
	breakthings: 0,
	icon_state: "gauss",
	name: "penetrator round",
	damage: 60,
	forcedodge: 1,
	dismemberment: 0,
	knockdown: 0,
});
rt.type(8871, "/obj/item/projectile/beam/laser/heavylaser", "/obj/item/projectile/beam/laser", {
	name: "heavy laser",
	icon_state: "heavylaser",
	damage: 40,
});
rt.type(8878, "/obj/item/projectile/beam/pulse/shot", "/obj/item/projectile/beam/pulse", {
	damage: 40,
});
rt.type(8885, "/obj/item/projectile/beam/instakill/blue", "/obj/item/projectile/beam/instakill", {
	light_color: "#6496FA",
	icon_state: "blue_laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});
rt.type(8886, "/obj/item/projectile/beam/instakill/red", "/obj/item/projectile/beam/instakill", {
	light_color: "#FA8282",
	icon_state: "red_laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/red_laser"),
});
rt.type(8889, "/obj/item/projectile/beam/wormhole/orange", "/obj/item/projectile/beam/wormhole", {
	name: "orange bluespace beam",
	color: "#FF6600",
});
rt.type(8900, "/obj/item/projectile/temp/basilisk", "/obj/item/projectile/temp", {
	name: "freezing blast",
	icon_state: "ice_2",
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	flag: "energy",
	temperature: 50,
});
rt.type(8901, "/obj/item/projectile/temp/hot", "/obj/item/projectile/temp", {
	temperature: 400,
	name: "heat beam",
});
rt.type(8920, "/obj/item/projectile/plasma/adv", "/obj/item/projectile/plasma", {
	damage: 7,
	range: 5,
	mine_range: 5,
});
rt.type(8921, "/obj/item/projectile/plasma/adv/mech", "/obj/item/projectile/plasma/adv", {
	damage: 10,
	range: 9,
	mine_range: 3,
});
rt.type(8922, "/obj/item/projectile/plasma/turret", "/obj/item/projectile/plasma", {
	damage: 6,
	range: 7,
	pass_flags: 7,
	name: "plasma beam",
});
