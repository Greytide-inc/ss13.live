// Types declared in code/modules/projectiles that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(8655, "/obj/item/ammo_casing/magic", "/obj/item/ammo_casing", {
	name: "magic casing",
	desc: "I didn't even know magic needed ammo...",
	projectile_type: rt.typePath("/obj/item/projectile/magic"),
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect/magic"),
});
rt.type(8657, "/obj/item/ammo_casing/magic/hook", "/obj/item/ammo_casing/magic", {
	name: "hook",
	desc: "a hook.",
	projectile_type: rt.typePath("/obj/item/projectile/hook"),
	caliber: "hook",
	icon_state: "hook",
});
rt.type(8658, "/obj/item/ammo_casing/magic/change", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/change"),
});
rt.type(8659, "/obj/item/ammo_casing/magic/animate", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/animate"),
});
rt.type(8660, "/obj/item/ammo_casing/magic/heal", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/resurrection"),
});
rt.type(8661, "/obj/item/ammo_casing/magic/death", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/death"),
});
rt.type(8662, "/obj/item/ammo_casing/magic/teleport", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/teleport"),
});
rt.type(8663, "/obj/item/ammo_casing/magic/door", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/door"),
});
rt.type(8664, "/obj/item/ammo_casing/magic/fireball", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/aoe/fireball"),
});
rt.type(8666, "/obj/item/ammo_casing/magic/spellblade", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/spellblade"),
});
rt.type(8667, "/obj/item/ammo_casing/magic/arcane_barrage", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/arcane_barrage"),
});
rt.type(8668, "/obj/item/ammo_casing/magic/honk", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/bullet/honker"),
});
rt.type(8683, "/obj/item/ammo_casing/energy", "/obj/item/ammo_casing", {
	e_cost: 100,
	select_name: "energy",
	name: "energy weapon lens",
	desc: "The part of the gun that makes the laser go pew",
	caliber: "energy",
	projectile_type: rt.typePath("/obj/item/projectile/energy"),
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect/energy"),
});
rt.type(8684, "/obj/item/ammo_casing/energy/chrono_beam", "/obj/item/ammo_casing/energy", {
	name: "eradication beam",
	projectile_type: rt.typePath("/obj/item/projectile/energy/chrono_beam"),
	icon_state: "chronobolt",
	e_cost: 0,
});
rt.type(8686, "/obj/item/ammo_casing/energy/laser", "/obj/item/ammo_casing/energy", {
	select_name: "kill",
	projectile_type: rt.typePath("/obj/item/projectile/beam/laser"),
});
rt.type(8687, "/obj/item/ammo_casing/energy/laser/hos", "/obj/item/ammo_casing/energy/laser", {
	e_cost: 100,
});
rt.type(8688, "/obj/item/ammo_casing/energy/laser/practice", "/obj/item/ammo_casing/energy/laser", {
	select_name: "practice",
	projectile_type: rt.typePath("/obj/item/projectile/beam/practice"),
});
rt.type(8689, "/obj/item/ammo_casing/energy/laser/scatter", "/obj/item/ammo_casing/energy/laser", {
	select_name: "scatter",
	projectile_type: rt.typePath("/obj/item/projectile/beam/scatter"),
	pellets: 5,
	variance: 25,
});
rt.type(8690, "/obj/item/ammo_casing/energy/laser/scatter/disabler", "/obj/item/ammo_casing/energy/laser/scatter", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/disabler"),
	pellets: 3,
	variance: 15,
});
rt.type(8691, "/obj/item/ammo_casing/energy/laser/heavy", "/obj/item/ammo_casing/energy/laser", {
	select_name: "anti-vehicle",
	projectile_type: rt.typePath("/obj/item/projectile/beam/laser/heavylaser"),
	fire_sound: rt.rsc("sound/weapons/lasercannonfire.ogg"),
});
rt.type(8692, "/obj/item/ammo_casing/energy/laser/pulse", "/obj/item/ammo_casing/energy/laser", {
	e_cost: 200,
	select_name: "DESTROY",
	projectile_type: rt.typePath("/obj/item/projectile/beam/pulse"),
	fire_sound: rt.rsc("sound/weapons/pulse.ogg"),
});
rt.type(8693, "/obj/item/ammo_casing/energy/laser/bluetag", "/obj/item/ammo_casing/energy/laser", {
	select_name: "bluetag",
	projectile_type: rt.typePath("/obj/item/projectile/beam/lasertag/bluetag"),
});
rt.type(8694, "/obj/item/ammo_casing/energy/laser/redtag", "/obj/item/ammo_casing/energy/laser", {
	select_name: "redtag",
	projectile_type: rt.typePath("/obj/item/projectile/beam/lasertag/redtag"),
});
rt.type(8695, "/obj/item/ammo_casing/energy/laser/accelerator", "/obj/item/ammo_casing/energy/laser", {
	select_name: "accelerator",
	projectile_type: rt.typePath("/obj/item/projectile/beam/laser/accelerator"),
	fire_sound: rt.rsc("sound/weapons/lasercannonfire.ogg"),
});
rt.type(8696, "/obj/item/ammo_casing/energy/lasergun", "/obj/item/ammo_casing/energy", {
	e_cost: 83,
	select_name: "kill",
	projectile_type: rt.typePath("/obj/item/projectile/beam/laser"),
});
rt.type(8697, "/obj/item/ammo_casing/energy/lasergun/old", "/obj/item/ammo_casing/energy/lasergun", {
	e_cost: 200,
	select_name: "kill",
	projectile_type: rt.typePath("/obj/item/projectile/beam/laser"),
});
rt.type(8698, "/obj/item/ammo_casing/energy/xray", "/obj/item/ammo_casing/energy", {
	e_cost: 50,
	projectile_type: rt.typePath("/obj/item/projectile/beam/xray"),
	fire_sound: rt.rsc("sound/weapons/laser3.ogg"),
});
rt.type(8699, "/obj/item/ammo_casing/energy/electrode", "/obj/item/ammo_casing/energy", {
	select_name: "stun",
	e_cost: 200,
	projectile_type: rt.typePath("/obj/item/projectile/energy/electrode"),
	fire_sound: rt.rsc("sound/weapons/taser.ogg"),
});
rt.type(8700, "/obj/item/ammo_casing/energy/electrode/spec", "/obj/item/ammo_casing/energy/electrode", {
	e_cost: 100,
});
rt.type(8701, "/obj/item/ammo_casing/energy/electrode/gun", "/obj/item/ammo_casing/energy/electrode", {
	e_cost: 100,
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
});
rt.type(8702, "/obj/item/ammo_casing/energy/electrode/hos", "/obj/item/ammo_casing/energy/electrode", {
	e_cost: 200,
});
rt.type(8703, "/obj/item/ammo_casing/energy/electrode/old", "/obj/item/ammo_casing/energy/electrode", {
	e_cost: 1000,
});
rt.type(8704, "/obj/item/ammo_casing/energy/ion", "/obj/item/ammo_casing/energy", {
	select_name: "ion",
	projectile_type: rt.typePath("/obj/item/projectile/ion"),
	fire_sound: rt.rsc("sound/weapons/ionrifle.ogg"),
});
rt.type(8705, "/obj/item/ammo_casing/energy/declone", "/obj/item/ammo_casing/energy", {
	select_name: "declone",
	projectile_type: rt.typePath("/obj/item/projectile/energy/declone"),
	fire_sound: rt.rsc("sound/weapons/pulse3.ogg"),
});
rt.type(8706, "/obj/item/ammo_casing/energy/mindflayer", "/obj/item/ammo_casing/energy", {
	select_name: "MINDFUCK",
	projectile_type: rt.typePath("/obj/item/projectile/beam/mindflayer"),
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
});
rt.type(8707, "/obj/item/ammo_casing/energy/flora", "/obj/item/ammo_casing/energy", {
	fire_sound: rt.rsc("sound/effects/stealthoff.ogg"),
});
rt.type(8708, "/obj/item/ammo_casing/energy/flora/yield", "/obj/item/ammo_casing/energy/flora", {
	select_name: "yield",
	projectile_type: rt.typePath("/obj/item/projectile/energy/florayield"),
});
rt.type(8709, "/obj/item/ammo_casing/energy/flora/mut", "/obj/item/ammo_casing/energy/flora", {
	select_name: "mutation",
	projectile_type: rt.typePath("/obj/item/projectile/energy/floramut"),
});
rt.type(8710, "/obj/item/ammo_casing/energy/temp", "/obj/item/ammo_casing/energy", {
	select_name: "freeze",
	e_cost: 250,
	projectile_type: rt.typePath("/obj/item/projectile/temp"),
	fire_sound: rt.rsc("sound/weapons/pulse3.ogg"),
});
rt.type(8711, "/obj/item/ammo_casing/energy/temp/hot", "/obj/item/ammo_casing/energy/temp", {
	select_name: "bake",
	projectile_type: rt.typePath("/obj/item/projectile/temp/hot"),
});
rt.type(8712, "/obj/item/ammo_casing/energy/meteor", "/obj/item/ammo_casing/energy", {
	select_name: "goddamn meteor",
	projectile_type: rt.typePath("/obj/item/projectile/meteor"),
});
rt.type(8713, "/obj/item/ammo_casing/energy/disabler", "/obj/item/ammo_casing/energy", {
	select_name: "disable",
	e_cost: 50,
	projectile_type: rt.typePath("/obj/item/projectile/beam/disabler"),
	fire_sound: rt.rsc("sound/weapons/taser2.ogg"),
});
rt.type(8714, "/obj/item/ammo_casing/energy/plasma", "/obj/item/ammo_casing/energy", {
	select_name: "plasma burst",
	e_cost: 25,
	projectile_type: rt.typePath("/obj/item/projectile/plasma"),
	fire_sound: rt.rsc("sound/weapons/pulse.ogg"),
	delay: 15,
});
rt.type(8715, "/obj/item/ammo_casing/energy/plasma/adv", "/obj/item/ammo_casing/energy/plasma", {
	e_cost: 10,
	projectile_type: rt.typePath("/obj/item/projectile/plasma/adv"),
	delay: 10,
});
rt.type(8718, "/obj/item/ammo_casing/energy/bolt", "/obj/item/ammo_casing/energy", {
	select_name: "bolt",
	e_cost: 500,
	projectile_type: rt.typePath("/obj/item/projectile/energy/bolt"),
	fire_sound: rt.rsc("sound/weapons/genhit.ogg"),
});
rt.type(8719, "/obj/item/ammo_casing/energy/bolt/halloween", "/obj/item/ammo_casing/energy/bolt", {
	projectile_type: rt.typePath("/obj/item/projectile/energy/bolt/halloween"),
});
rt.type(8720, "/obj/item/ammo_casing/energy/bolt/large", "/obj/item/ammo_casing/energy/bolt", {
	select_name: "heavy bolt",
	projectile_type: rt.typePath("/obj/item/projectile/energy/bolt/large"),
});
rt.type(8721, "/obj/item/ammo_casing/energy/net", "/obj/item/ammo_casing/energy", {
	select_name: "netting",
	projectile_type: rt.typePath("/obj/item/projectile/energy/net"),
	pellets: 6,
	variance: 40,
});
rt.type(8722, "/obj/item/ammo_casing/energy/trap", "/obj/item/ammo_casing/energy", {
	select_name: "snare",
	projectile_type: rt.typePath("/obj/item/projectile/energy/trap"),
});
rt.type(8723, "/obj/item/ammo_casing/energy/instakill", "/obj/item/ammo_casing/energy", {
	e_cost: 0,
	select_name: "DESTROY",
	projectile_type: rt.typePath("/obj/item/projectile/beam/instakill"),
});
rt.type(8724, "/obj/item/ammo_casing/energy/instakill/blue", "/obj/item/ammo_casing/energy/instakill", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/instakill/blue"),
});
rt.type(8725, "/obj/item/ammo_casing/energy/instakill/red", "/obj/item/ammo_casing/energy/instakill", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/instakill/red"),
});
rt.type(8726, "/obj/item/ammo_casing/energy/tesla_revolver", "/obj/item/ammo_casing/energy", {
	e_cost: 200,
	select_name: "stun",
	fire_sound: rt.rsc("sound/magic/lightningbolt.ogg"),
	projectile_type: rt.typePath("/obj/item/projectile/energy/tesla/revolver"),
});
rt.type(8730, "/obj/item/ammo_casing/energy/c3dbullet", "/obj/item/ammo_casing/energy", {
	select_name: "spraydown",
	e_cost: 20,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet3"),
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect"),
});
rt.type(8734, "/obj/item/ammo_casing/a50", "/obj/item/ammo_casing", {
	desc: "A .50AE bullet casing.",
	caliber: ".50",
	projectile_type: rt.typePath("/obj/item/projectile/bullet"),
});
rt.type(8735, "/obj/item/ammo_casing/a50/ctf", "/obj/item/ammo_casing/a50", {
	projectile_type: rt.typePath("/obj/item/projectile/bullet/ctf"),
});
rt.type(8736, "/obj/item/ammo_casing/a357", "/obj/item/ammo_casing", {
	caliber: "357",
	desc: "A .357 bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet"),
});
rt.type(8737, "/obj/item/ammo_casing/a762", "/obj/item/ammo_casing", {
	caliber: "a762",
	desc: "A 7.62 bullet casing.",
	icon_state: "762-casing",
	projectile_type: rt.typePath("/obj/item/projectile/bullet"),
});
rt.type(8738, "/obj/item/ammo_casing/a762/enchanted", "/obj/item/ammo_casing/a762", {
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
});
rt.type(8739, "/obj/item/ammo_casing/c38", "/obj/item/ammo_casing", {
	caliber: "38",
	desc: "A .38 bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet2"),
});
rt.type(8740, "/obj/item/ammo_casing/c10mm", "/obj/item/ammo_casing", {
	caliber: "10mm",
	desc: "A 10mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet3"),
});
rt.type(8741, "/obj/item/ammo_casing/c10mm/ap", "/obj/item/ammo_casing/c10mm", {
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet3/ap"),
});
rt.type(8742, "/obj/item/ammo_casing/c10mm/fire", "/obj/item/ammo_casing/c10mm", {
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet3/fire"),
});
rt.type(8743, "/obj/item/ammo_casing/c10mm/hp", "/obj/item/ammo_casing/c10mm", {
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet3/hp"),
});
rt.type(8744, "/obj/item/ammo_casing/c9mm", "/obj/item/ammo_casing", {
	caliber: "9mm",
	desc: "A 9mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
});
rt.type(8745, "/obj/item/ammo_casing/c9mmap", "/obj/item/ammo_casing", {
	caliber: "9mm",
	desc: "A 9mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/armourpiercing"),
});
rt.type(8746, "/obj/item/ammo_casing/c9mmtox", "/obj/item/ammo_casing", {
	caliber: "9mm",
	desc: "A 9mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/toxinbullet"),
});
rt.type(8747, "/obj/item/ammo_casing/c9mminc", "/obj/item/ammo_casing", {
	caliber: "9mm",
	desc: "A 9mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/incendiary/firebullet"),
});
rt.type(8748, "/obj/item/ammo_casing/c46x30mm", "/obj/item/ammo_casing", {
	caliber: "4.6x30mm",
	desc: "A 4.6x30mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
});
rt.type(8749, "/obj/item/ammo_casing/c46x30mmap", "/obj/item/ammo_casing", {
	caliber: "4.6x30mm",
	desc: "A 4.6x30mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/armourpiercing"),
});
rt.type(8750, "/obj/item/ammo_casing/c46x30mmtox", "/obj/item/ammo_casing", {
	caliber: "4.6x30mm",
	desc: "A 4.6x30mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/toxinbullet"),
});
rt.type(8751, "/obj/item/ammo_casing/c46x30mminc", "/obj/item/ammo_casing", {
	caliber: "4.6x30mm",
	desc: "A 4.6x30mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/incendiary/firebullet"),
});
rt.type(8752, "/obj/item/ammo_casing/c45", "/obj/item/ammo_casing", {
	caliber: ".45",
	desc: "A .45 bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet"),
});
rt.type(8753, "/obj/item/ammo_casing/c45nostamina", "/obj/item/ammo_casing", {
	caliber: ".45",
	desc: "A .45 bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/midbullet3"),
});
rt.type(8754, "/obj/item/ammo_casing/n762", "/obj/item/ammo_casing", {
	caliber: "n762",
	desc: "A 7.62x38mmR bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet"),
});
rt.type(8755, "/obj/item/ammo_casing/a556", "/obj/item/ammo_casing", {
	caliber: "a556",
	desc: "A 5.56mm bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/heavybullet"),
});
rt.type(8756, "/obj/item/ammo_casing/a40mm", "/obj/item/ammo_casing", {
	caliber: "40mm",
	name: "40mm HE shell",
	desc: "A cased high explosive grenade that can only be activated once fired out of a grenade launcher.",
	icon_state: "40mmHE",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/a40mm"),
});
rt.type(8757, "/obj/item/ammo_casing/point50", "/obj/item/ammo_casing", {
	caliber: ".50",
	desc: "A .50 bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/sniper"),
	icon_state: ".50",
});
rt.type(8758, "/obj/item/ammo_casing/point50/gang", "/obj/item/ammo_casing/point50", {
	desc: "A black market .50 bullet casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/sniper/gang"),
});
rt.type(8759, "/obj/item/ammo_casing/point50/gang/sleeper", "/obj/item/ammo_casing/point50/gang", {
	desc: "Am illegally modified tranquilizer round.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/sniper/gang/sleeper"),
	icon_state: "sleeper",
});
rt.type(8760, "/obj/item/ammo_casing/soporific", "/obj/item/ammo_casing", {
	caliber: ".50",
	desc: "A .50 bullet casing, specialised in sending the target to sleep, instead of hell.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/sniper/soporific"),
	icon_state: "sleeper",
});
rt.type(8761, "/obj/item/ammo_casing/haemorrhage", "/obj/item/ammo_casing", {
	caliber: ".50",
	desc: "A .50 bullet casing, specialised in causing massive bloodloss.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/sniper/haemorrhage"),
	icon_state: ".50",
});
rt.type(8762, "/obj/item/ammo_casing/penetrator", "/obj/item/ammo_casing", {
	caliber: ".50",
	desc: "A .50 caliber penetrator round casing.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/sniper/penetrator"),
	icon_state: ".50",
});
rt.type(8763, "/obj/item/ammo_casing/mm195x129", "/obj/item/ammo_casing", {
	caliber: "mm195129",
	desc: "A 1.95x129mm bullet casing.",
	icon_state: "762-casing",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/saw"),
});
rt.type(8764, "/obj/item/ammo_casing/mm195x129/bleeding", "/obj/item/ammo_casing/mm195x129", {
	desc: "A 1.95x129mm bullet casing with specialized inner-casing, that when it makes contact with a target, releases tiny shrapnel to induce internal bleeding.",
	icon_state: "762-casing",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/saw/bleeding"),
});
rt.type(8765, "/obj/item/ammo_casing/mm195x129/hollow", "/obj/item/ammo_casing/mm195x129", {
	desc: "A 1.95x129mm bullet casing designed to cause more damage to unarmored targets.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/saw/hollow"),
});
rt.type(8766, "/obj/item/ammo_casing/mm195x129/ap", "/obj/item/ammo_casing/mm195x129", {
	desc: "A 1.95x129mm bullet casing designed with a hardened-tipped core to help penetrate armored targets.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/saw/ap"),
});
rt.type(8767, "/obj/item/ammo_casing/mm195x129/incen", "/obj/item/ammo_casing/mm195x129", {
	desc: "A 1.95x129mm bullet casing designed with a chemical-filled capsule on the tip that when bursted, reacts with the atmosphere to produce a fireball, engulfing the target in flames. ",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/saw/incen"),
});
rt.type(8790, "/obj/item/projectile/bullet", "/obj/item/projectile", {
	name: "bullet",
	icon_state: "bullet",
	damage: 60,
	damage_type: "brute",
	nodamage: 0,
	flag: "bullet",
	hitsound_wall: "ricochet",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect"),
});
rt.type(8799, "/obj/item/projectile/bullet/weakbullet", "/obj/item/projectile/bullet", {
	damage: 5,
	stamina: 80,
});
rt.type(8800, "/obj/item/projectile/bullet/weakbullet2", "/obj/item/projectile/bullet", {
	damage: 15,
	knockdown: 30,
	stamina: 50,
});
rt.type(8801, "/obj/item/projectile/bullet/weakbullet3", "/obj/item/projectile/bullet", {
	damage: 20,
});
rt.type(8802, "/obj/item/projectile/bullet/toxinbullet", "/obj/item/projectile/bullet", {
	damage: 15,
	damage_type: "tox",
});
rt.type(8807, "/obj/item/projectile/bullet/armourpiercing", "/obj/item/projectile/bullet", {
	damage: 15,
	armour_penetration: 40,
});
rt.type(8811, "/obj/item/projectile/bullet/midbullet", "/obj/item/projectile/bullet", {
	damage: 20,
	stamina: 65,
});
rt.type(8812, "/obj/item/projectile/bullet/midbullet2", "/obj/item/projectile/bullet", {
	damage: 25,
});
rt.type(8813, "/obj/item/projectile/bullet/midbullet3", "/obj/item/projectile/bullet", {
	damage: 30,
});
rt.type(8814, "/obj/item/projectile/bullet/midbullet3/hp", "/obj/item/projectile/bullet/midbullet3", {
	damage: 40,
	armour_penetration: -50,
});
rt.type(8815, "/obj/item/projectile/bullet/midbullet3/ap", "/obj/item/projectile/bullet/midbullet3", {
	damage: 27,
	armour_penetration: 40,
});
rt.type(8817, "/obj/item/projectile/bullet/heavybullet", "/obj/item/projectile/bullet", {
	damage: 35,
});
rt.type(8818, "/obj/item/projectile/bullet/rpellet", "/obj/item/projectile/bullet", {
	damage: 3,
	stamina: 25,
});
rt.type(8819, "/obj/item/projectile/bullet/stunshot", "/obj/item/projectile/bullet", {
	name: "stunshot",
	damage: 5,
	knockdown: 100,
	stutter: 5,
	jitter: 20,
	range: 7,
	icon_state: "spark",
	color: "#FFFF00",
});
rt.type(8835, "/obj/item/projectile/bullet/saw", "/obj/item/projectile/bullet", {
	damage: 45,
	armour_penetration: 5,
});
rt.type(8837, "/obj/item/projectile/bullet/saw/hollow", "/obj/item/projectile/bullet/saw", {
	damage: 60,
	armour_penetration: -10,
});
rt.type(8838, "/obj/item/projectile/bullet/saw/ap", "/obj/item/projectile/bullet/saw", {
	damage: 40,
	armour_penetration: 75,
});
rt.type(8845, "/obj/item/projectile/energy", "/obj/item/projectile", {
	name: "energy",
	icon_state: "spark",
	damage: 0,
	damage_type: "fire",
	flag: "energy",
});
rt.type(8847, "/obj/item/projectile/energy/chameleon", "/obj/item/projectile/energy", {
	nodamage: 1,
});
rt.type(8852, "/obj/item/projectile/energy/declone", "/obj/item/projectile/energy", {
	name: "radiation beam",
	icon_state: "declone",
	damage: 20,
	damage_type: "clone",
	irradiate: 10,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/green_laser"),
});
rt.type(8853, "/obj/item/projectile/energy/dart", "/obj/item/projectile/energy", {
	name: "dart",
	icon_state: "toxin",
	damage: 5,
	damage_type: "tox",
	knockdown: 100,
	range: 7,
});
rt.type(8854, "/obj/item/projectile/energy/bolt", "/obj/item/projectile/energy", {
	name: "bolt",
	icon_state: "cbbolt",
	damage: 8,
	damage_type: "tox",
	nodamage: 0,
	knockdown: 100,
	stutter: 5,
});
rt.type(8855, "/obj/item/projectile/energy/bolt/halloween", "/obj/item/projectile/energy/bolt", {
	name: "candy corn",
	icon_state: "candy_corn",
});
rt.type(8856, "/obj/item/projectile/energy/bolt/large", "/obj/item/projectile/energy/bolt", {
	damage: 20,
});
rt.type(8861, "/obj/item/projectile/energy/florayield", "/obj/item/projectile/energy", {
	name: "beta somatoray",
	icon_state: "energy2",
	damage: 0,
	damage_type: "tox",
	nodamage: 1,
	flag: "energy",
});
rt.type(8862, "/obj/item/projectile/beam", "/obj/item/projectile", {
	pass_flags: 7,
	light_range: 2,
	light_color: "#FA8282",
	name: "laser",
	icon_state: "laser",
	damage: 20,
	damage_type: "fire",
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
	hitsound_wall: rt.rsc("sound/weapons/effects/searwall.ogg"),
	flag: "laser",
	eyeblur: 2,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/red_laser"),
	ricochets_max: 50,
	ricochet_chance: 80,
});
rt.type(8872, "/obj/item/projectile/beam/weak", "/obj/item/projectile/beam", {
	damage: 15,
	armour_penetration: 50,
});
rt.type(8873, "/obj/item/projectile/beam/practice", "/obj/item/projectile/beam", {
	name: "practice laser",
	damage: 0,
	nodamage: 1,
});
rt.type(8874, "/obj/item/projectile/beam/scatter", "/obj/item/projectile/beam", {
	name: "laser pellet",
	icon_state: "scatterlaser",
	damage: 5,
});
rt.type(8875, "/obj/item/projectile/beam/xray", "/obj/item/projectile/beam", {
	light_color: "#64C864",
	name: "xray beam",
	icon_state: "xray",
	damage: 15,
	irradiate: 30,
	range: 15,
	forcedodge: 1,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/green_laser"),
});
rt.type(8876, "/obj/item/projectile/beam/disabler", "/obj/item/projectile/beam", {
	light_color: "#6496FA",
	name: "disabler beam",
	icon_state: "omnilaser",
	damage: 36,
	damage_type: "stamina",
	flag: "energy",
	hitsound: rt.rsc("sound/weapons/tap.ogg"),
	eyeblur: 0,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});
rt.type(8880, "/obj/item/projectile/beam/emitter", "/obj/item/projectile/beam", {
	light_color: "#64C864",
	name: "emitter beam",
	icon_state: "emitter",
	damage: 30,
	legacy: 1,
	animate_movement: 2,
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/green_laser"),
});
rt.type(8892, "/obj/item/projectile/guardian", "/obj/item/projectile", {
	name: "crystal spray",
	icon_state: "guardian",
	damage: 5,
	damage_type: "brute",
	armour_penetration: 100,
});
rt.type(8893, "/obj/item/projectile/neurotox", "/obj/item/projectile", {
	name: "neurotoxin",
	damage: 30,
	icon_state: "toxin",
});
rt.type(8894, "/obj/item/projectile/hivebotbullet", "/obj/item/projectile", {
	damage: 10,
	damage_type: "brute",
});
rt.type(8903, "/obj/item/projectile/magic", "/obj/item/projectile", {
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	flag: "magic",
	name: "bolt of nothing",
	icon_state: "energy",
	armour_penetration: 100,
});
rt.type(8910, "/obj/item/projectile/magic/spellblade", "/obj/item/projectile/magic", {
	damage: 15,
	damage_type: "fire",
	flag: "magic",
	dismemberment: 50,
	nodamage: 0,
	name: "blade energy",
	icon_state: "lavastaff",
});
rt.type(8911, "/obj/item/projectile/magic/arcane_barrage", "/obj/item/projectile/magic", {
	damage: 20,
	damage_type: "fire",
	nodamage: 0,
	flag: "magic",
	name: "arcane bolt",
	icon_state: "arcane_barrage",
	armour_penetration: 0,
});
rt.type(9153, "/obj/item/device/firing_pin/magic", "/obj/item/device/firing_pin", {
	name: "magic crystal shard",
	desc: "A small enchanted shard which allows magical weapons to fire.",
});
rt.type(9156, "/obj/item/device/firing_pin/implant/mindshield", "/obj/item/device/firing_pin/implant", {
	req_implant: rt.typePath("/obj/item/weapon/implant/mindshield"),
	name: "mindshield firing pin",
	desc: "This Security firing pin authorizes the weapon for only mindshield-implanted users.",
	icon_state: "firing_pin_loyalty",
});
rt.type(9157, "/obj/item/device/firing_pin/implant/pindicate", "/obj/item/device/firing_pin/implant", {
	req_implant: rt.typePath("/obj/item/weapon/implant/weapons_auth"),
	name: "syndicate firing pin",
	icon_state: "firing_pin_pindi",
});
rt.type(9160, "/obj/item/device/firing_pin/clown/ultra/selfdestruct", "/obj/item/device/firing_pin/clown/ultra", {
	selfdestruct: 1,
	desc: "Advanced clowntech that can convert any firearm into a far more useful object. It has a small nitrobananium charge on it.",
});
rt.type(9162, "/obj/item/device/firing_pin/dna/dredd", "/obj/item/device/firing_pin/dna", {
	selfdestruct: 1,
	desc: "This is a DNA-locked firing pin which only authorizes one user. Attempt to fire once to DNA-link. It has a small explosive charge on it.",
});
rt.type(9164, "/obj/item/device/firing_pin/tag/red", "/obj/item/device/firing_pin/tag", {
	suit_requirement: rt.typePath("/obj/item/clothing/suit/redtag"),
	tagcolor: "red",
	name: "red laser tag firing pin",
	icon_state: "firing_pin_red",
});
rt.type(9165, "/obj/item/device/firing_pin/tag/blue", "/obj/item/device/firing_pin/tag", {
	suit_requirement: rt.typePath("/obj/item/clothing/suit/bluetag"),
	tagcolor: "blue",
	name: "blue laser tag firing pin",
	icon_state: "firing_pin_blue",
});
rt.type(9886, "/obj/item/ammo_box/magazine/m50", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=2",
	name: "handgun magazine (.50ae)",
	icon_state: "50ae",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a50"),
	caliber: ".50",
	max_ammo: 7,
	multiple_sprites: 1,
});
rt.type(9887, "/obj/item/ammo_box/magazine/m50/ctf", "/obj/item/ammo_box/magazine/m50", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/a50/ctf"),
});
rt.type(9892, "/obj/item/ammo_box/magazine/m10mm", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=2",
	name: "pistol magazine (10mm)",
	desc: "A gun magazine.",
	icon_state: "9x19p",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm"),
	caliber: "10mm",
	max_ammo: 8,
	multiple_sprites: 2,
});
rt.type(9894, "/obj/item/ammo_box/magazine/m10mm/fire", "/obj/item/ammo_box/magazine/m10mm", {
	name: "pistol magazine (10mm incendiary)",
	icon_state: "9x19pI",
	desc: "A gun magazine. Loaded with rounds which ignite the target.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm/fire"),
});
rt.type(9895, "/obj/item/ammo_box/magazine/m10mm/hp", "/obj/item/ammo_box/magazine/m10mm", {
	name: "pistol magazine (10mm HP)",
	icon_state: "9x19pH",
	desc: "A gun magazine. Loaded with hollow-point rounds, extremely effective against unarmored targets, but nearly useless against protective clothing.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm/hp"),
});
rt.type(9896, "/obj/item/ammo_box/magazine/m10mm/ap", "/obj/item/ammo_box/magazine/m10mm", {
	name: "pistol magazine (10mm AP)",
	icon_state: "9x19pA",
	desc: "A gun magazine. Loaded with rounds which penetrate armour, but are less effective against normal targets",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm/ap"),
});
rt.type(9909, "/obj/item/ammo_box/magazine/tommygunm45", "/obj/item/ammo_box/magazine", {
	name: "drum magazine (.45)",
	icon_state: "drum45",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c45"),
	caliber: ".45",
	max_ammo: 50,
});
rt.type(9910, "/obj/item/ammo_box/magazine/m75", "/obj/item/ammo_box/magazine", {
	name: "specialized magazine (.75)",
	icon_state: "75",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/a75"),
	caliber: "75",
	multiple_sprites: 2,
	max_ammo: 8,
});
rt.type(9911, "/obj/item/ammo_box/magazine/m556", "/obj/item/ammo_box/magazine", {
	origin_tech: "combat=5;syndicate=1",
	name: "toploader magazine (5.56mm)",
	icon_state: "5.56m",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a556"),
	caliber: "a556",
	max_ammo: 30,
	multiple_sprites: 2,
});
rt.type(9929, "/obj/item/ammo_box/magazine/toy", "/obj/item/ammo_box/magazine", {
	name: "foam force META magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart"),
	caliber: "foam_force",
});
rt.type(9932, "/obj/item/ammo_box/magazine/toy/pistol", "/obj/item/ammo_box/magazine/toy", {
	name: "foam force pistol magazine",
	icon_state: "9x19p",
	max_ammo: 8,
	multiple_sprites: 2,
});
rt.type(9933, "/obj/item/ammo_box/magazine/toy/pistol/riot", "/obj/item/ammo_box/magazine/toy/pistol", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
});
rt.type(9961, "/obj/item/ammo_box/a357", "/obj/item/ammo_box", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/a357"),
	max_ammo: 7,
	multiple_sprites: 1,
	name: "speed loader (.357)",
	desc: "Designed to quickly reload revolvers.",
	icon_state: "357",
});
rt.type(9962, "/obj/item/ammo_box/c38", "/obj/item/ammo_box", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/c38"),
	max_ammo: 6,
	multiple_sprites: 1,
	name: "speed loader (.38)",
	desc: "Designed to quickly reload revolvers.",
	icon_state: "38",
});
rt.type(9963, "/obj/item/ammo_box/c9mm", "/obj/item/ammo_box", {
	origin_tech: "combat=2",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mm"),
	max_ammo: 30,
	name: "ammo box (9mm)",
	icon_state: "9mmbox",
});
rt.type(9964, "/obj/item/ammo_box/c10mm", "/obj/item/ammo_box", {
	origin_tech: "combat=2",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c10mm"),
	max_ammo: 20,
	name: "ammo box (10mm)",
	icon_state: "10mmbox",
});
rt.type(9965, "/obj/item/ammo_box/c45", "/obj/item/ammo_box", {
	origin_tech: "combat=2",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c45"),
	max_ammo: 20,
	name: "ammo box (.45)",
	icon_state: "45box",
});
rt.type(9966, "/obj/item/ammo_box/a40mm", "/obj/item/ammo_box", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/a40mm"),
	max_ammo: 4,
	multiple_sprites: 1,
	name: "ammo box (40mm grenades)",
	icon_state: "40mm",
});
rt.type(9967, "/obj/item/ammo_box/a762", "/obj/item/ammo_box", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/a762"),
	max_ammo: 5,
	multiple_sprites: 1,
	name: "stripper clip (7.62mm)",
	desc: "A stripper clip.",
	icon_state: "762",
});
rt.type(9968, "/obj/item/ammo_box/n762", "/obj/item/ammo_box", {
	origin_tech: "combat=2",
	ammo_type: rt.typePath("/obj/item/ammo_casing/n762"),
	max_ammo: 14,
	name: "ammo box (7.62x38mmR)",
	icon_state: "10mmbox",
});
rt.type(9969, "/obj/item/ammo_box/foambox", "/obj/item/ammo_box", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart"),
	max_ammo: 40,
	name: "ammo box (Foam Darts)",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	icon_state: "foambox",
});
rt.type(9970, "/obj/item/ammo_box/foambox/riot", "/obj/item/ammo_box/foambox", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
	icon_state: "foambox_riot",
});
