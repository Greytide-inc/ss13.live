// Types declared in code/game/mecha/equipment/weapons that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(9630, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/laser", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	equip_cooldown: 8,
	energy_drain: 30,
	projectile: rt.typePath("/obj/item/projectile/beam/laser"),
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	name: "１CH-PS \"Immolator\" laser",
	desc: "A weapon for combat exosuits. Shoots basic lasers.",
	icon_state: "mecha_laser",
	origin_tech: "magnets=3;combat=3;engineering=3",
});
rt.type(9631, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/laser/heavy", "/obj/item/mecha_parts/mecha_equipment/weapon/energy/laser", {
	equip_cooldown: 15,
	energy_drain: 60,
	projectile: rt.typePath("/obj/item/projectile/beam/laser/heavylaser"),
	fire_sound: rt.rsc("sound/weapons/lasercannonfire.ogg"),
	name: "１CH-LC \"Solaris\" laser cannon",
	desc: "A weapon for combat exosuits. Shoots heavy lasers.",
	icon_state: "mecha_laser",
	origin_tech: "magnets=4;combat=4;engineering=3",
});
rt.type(9632, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/ion", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	equip_cooldown: 20,
	energy_drain: 120,
	projectile: rt.typePath("/obj/item/projectile/ion"),
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	name: "１MKIV ion heavy cannon",
	desc: "A weapon for combat exosuits. Shoots technology-disabling ion beams. Don't catch yourself in the blast!",
	icon_state: "mecha_ion",
	origin_tech: "materials=4;combat=5;magnets=4",
});
rt.type(9633, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/tesla", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	equip_cooldown: 35,
	energy_drain: 500,
	projectile: rt.typePath("/obj/item/projectile/energy/tesla/cannon"),
	fire_sound: rt.rsc("sound/magic/lightningbolt.ogg"),
	name: "１MKI Tesla Cannon",
	desc: "A weapon for combat exosuits. Fires bolts of electricity similar to the experimental tesla engine",
	icon_state: "mecha_ion",
	origin_tech: "materials=4;engineering=4;combat=6;magnets=6",
});
rt.type(9634, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/pulse", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	equip_cooldown: 30,
	energy_drain: 120,
	projectile: rt.typePath("/obj/item/projectile/beam/pulse/heavy"),
	fire_sound: rt.rsc("sound/weapons/marauder.ogg"),
	name: "eZ-13 MK2 heavy pulse rifle",
	desc: "A weapon for combat exosuits. Shoots powerful destructive blasts capable of demolishing obstacles.",
	icon_state: "mecha_pulse",
	origin_tech: "materials=3;combat=6;powerstorage=4",
});
rt.type(9636, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/taser", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	energy_drain: 20,
	equip_cooldown: 8,
	projectile: rt.typePath("/obj/item/projectile/energy/electrode"),
	fire_sound: rt.rsc("sound/weapons/taser.ogg"),
	name: "１PBT \"Pacifier\" mounted taser",
	desc: "A weapon for combat exosuits. Shoots non-lethal stunning electrodes.",
	icon_state: "mecha_taser",
	origin_tech: "combat=3",
});
rt.type(9639, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/carbine", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	equip_cooldown: 10,
	projectile: rt.typePath("/obj/item/projectile/bullet/incendiary/shell"),
	projectiles: 24,
	projectile_energy_cost: 15,
	name: "１FNX-99 \"Hades\" Carbine",
	desc: "A weapon for combat exosuits. Shoots incendiary bullets.",
	icon_state: "mecha_carbine",
	origin_tech: "materials=4;combat=4",
});
rt.type(9640, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/silenced", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	fire_sound: rt.rsc("sound/weapons/gunshot_silenced.ogg"),
	equip_cooldown: 30,
	projectile: rt.typePath("/obj/item/projectile/bullet/mime"),
	projectiles: 6,
	projectile_energy_cost: 50,
	name: "１S.H.H. \"Quietus\" Carbine",
	desc: "A weapon for combat exosuits. A mime invention, field tests have shown that targets cannot even scream before going down.",
	icon_state: "mecha_mime",
});
rt.type(9641, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/scattershot", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	equip_cooldown: 20,
	projectile: rt.typePath("/obj/item/projectile/bullet/midbullet"),
	projectiles: 40,
	projectile_energy_cost: 25,
	projectiles_per_shot: 4,
	variance: 25,
	name: "１LBX AC 10 \"Scattershot\"",
	desc: "A weapon for combat exosuits. Shoots a spread of pellets.",
	icon_state: "mecha_scatter",
	origin_tech: "combat=4",
});
rt.type(9642, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/lmg", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	equip_cooldown: 10,
	projectile: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	projectiles: 300,
	projectile_energy_cost: 20,
	projectiles_per_shot: 3,
	variance: 6,
	randomspread: 1,
	projectile_delay: 2,
	name: "１Ultra AC 2",
	desc: "A weapon for combat exosuits. Shoots a rapid, three shot burst.",
	icon_state: "mecha_uac2",
	origin_tech: "combat=4",
});
rt.type(9643, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/missile_rack", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	projectile: rt.typePath("/obj/item/projectile/bullet/srmrocket"),
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	projectiles: 8,
	projectile_energy_cost: 1000,
	equip_cooldown: 60,
	name: "１SRM-8 missile rack",
	desc: "A weapon for combat exosuits. Shoots light explosive missiles.",
	icon_state: "mecha_missilerack",
	origin_tech: "combat=5;materials=4;engineering=4",
});
rt.type(9646, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang/clusterbang", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang", {
	projectiles: 3,
	projectile: rt.typePath("/obj/item/weapon/grenade/clusterbuster"),
	projectile_energy_cost: 1600,
	equip_cooldown: 90,
	name: "１SOB-3 grenade launcher",
	desc: "A weapon for combat exosuits. Launches primed clusterbangs. You monster.",
	origin_tech: "combat=4;materials=4",
});
