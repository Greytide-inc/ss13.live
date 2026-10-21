// Types declared in code/modules/projectiles/boxes_magazines that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(9904, "/obj/item/ammo_box/magazine/smgm9mm/ap", "/obj/item/ammo_box/magazine/smgm9mm", {
	name: "SMG magazine (Armour Piercing 9mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mmap"),
});
rt.type(9905, "/obj/item/ammo_box/magazine/smgm9mm/toxin", "/obj/item/ammo_box/magazine/smgm9mm", {
	name: "SMG magazine (Toxin Tipped 9mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mmtox"),
});
rt.type(9906, "/obj/item/ammo_box/magazine/smgm9mm/fire", "/obj/item/ammo_box/magazine/smgm9mm", {
	name: "SMG Magazine (Incindiary 9mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c9mminc"),
});
rt.type(9913, "/obj/item/ammo_box/magazine/m12g/buckshot", "/obj/item/ammo_box/magazine/m12g", {
	name: "shotgun magazine (12g buckshot slugs)",
	icon_state: "m12gb",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
});
rt.type(9914, "/obj/item/ammo_box/magazine/m12g/slug", "/obj/item/ammo_box/magazine/m12g", {
	name: "shotgun magazine (12g slugs)",
	icon_state: "m12gb",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun"),
});
rt.type(9915, "/obj/item/ammo_box/magazine/m12g/dragon", "/obj/item/ammo_box/magazine/m12g", {
	name: "shotgun magazine (12g dragon's breath)",
	icon_state: "m12gf",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/incendiary/dragonsbreath"),
});
rt.type(9916, "/obj/item/ammo_box/magazine/m12g/bioterror", "/obj/item/ammo_box/magazine/m12g", {
	name: "shotgun magazine (12g bioterror)",
	icon_state: "m12gt",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/dart/bioterror"),
});
rt.type(9917, "/obj/item/ammo_box/magazine/m12g/breach", "/obj/item/ammo_box/magazine/m12g", {
	name: "shotgun magazine (12g breacher slugs)",
	icon_state: "m12gbc",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/breaching"),
});
rt.type(9919, "/obj/item/ammo_box/magazine/sniper_rounds/soporific", "/obj/item/ammo_box/magazine/sniper_rounds", {
	origin_tech: "combat=6;syndicate=3",
	name: "sniper rounds (Zzzzz)",
	desc: "Soporific sniper rounds, designed for happy days and dead quiet nights...",
	icon_state: "soporific",
	ammo_type: rt.typePath("/obj/item/ammo_casing/soporific"),
	max_ammo: 3,
	caliber: ".50",
});
rt.type(9920, "/obj/item/ammo_box/magazine/sniper_rounds/haemorrhage", "/obj/item/ammo_box/magazine/sniper_rounds", {
	name: "sniper rounds (Bleed)",
	desc: "Haemorrhage sniper rounds, leaves your target in a pool of crimson pain",
	icon_state: "haemorrhage",
	ammo_type: rt.typePath("/obj/item/ammo_casing/haemorrhage"),
	max_ammo: 5,
	caliber: ".50",
});
rt.type(9921, "/obj/item/ammo_box/magazine/sniper_rounds/penetrator", "/obj/item/ammo_box/magazine/sniper_rounds", {
	origin_tech: "combat=6;syndicate=3",
	name: "sniper rounds (penetrator)",
	desc: "An extremely powerful round capable of passing straight through cover and anyone unfortunate enough to be behind it.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/penetrator"),
	max_ammo: 5,
});
rt.type(9922, "/obj/item/ammo_box/magazine/sniper_rounds/gang", "/obj/item/ammo_box/magazine/sniper_rounds", {
	origin_tech: "combat=6",
	name: "black market sniper rounds (.50)",
	icon_state: ".50mag",
	ammo_type: rt.typePath("/obj/item/ammo_casing/point50/gang"),
});
rt.type(9923, "/obj/item/ammo_box/magazine/sniper_rounds/gang/sleeper", "/obj/item/ammo_box/magazine/sniper_rounds/gang", {
	origin_tech: "combat=6",
	name: "illegally modified tranquilizer round",
	icon_state: "soporific",
	ammo_type: rt.typePath("/obj/item/ammo_casing/point50/gang/sleeper"),
});
rt.type(9925, "/obj/item/ammo_box/magazine/mm195x129/bleeding", "/obj/item/ammo_box/magazine/mm195x129", {
	origin_tech: "combat=3",
	name: "box magazine (Bleeding 1.95x129mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/mm195x129/bleeding"),
});
rt.type(9926, "/obj/item/ammo_box/magazine/mm195x129/hollow", "/obj/item/ammo_box/magazine/mm195x129", {
	origin_tech: "combat=3",
	name: "box magazine (Hollow-Point 1.95x129mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/mm195x129/hollow"),
});
rt.type(9927, "/obj/item/ammo_box/magazine/mm195x129/ap", "/obj/item/ammo_box/magazine/mm195x129", {
	origin_tech: "combat=4",
	name: "box magazine (Armor Penetrating 1.95x129mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/mm195x129/ap"),
});
rt.type(9928, "/obj/item/ammo_box/magazine/mm195x129/incen", "/obj/item/ammo_box/magazine/mm195x129", {
	origin_tech: "combat=4",
	name: "box magazine (Incendiary 1.95x129mm)",
	ammo_type: rt.typePath("/obj/item/ammo_casing/mm195x129/incen"),
});
rt.type(9931, "/obj/item/ammo_box/magazine/toy/smg/riot", "/obj/item/ammo_box/magazine/toy/smg", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart/riot"),
});
rt.type(9938, "/obj/item/ammo_box/magazine/internal/cylinder/rev38", "/obj/item/ammo_box/magazine/internal/cylinder", {
	name: "detective revolver cylinder",
	ammo_type: rt.typePath("/obj/item/ammo_casing/c38"),
	caliber: "38",
	max_ammo: 6,
});
rt.type(9939, "/obj/item/ammo_box/magazine/internal/cylinder/grenademulti", "/obj/item/ammo_box/magazine/internal/cylinder", {
	name: "grenade launcher internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a40mm"),
	caliber: "40mm",
	max_ammo: 6,
});
rt.type(9940, "/obj/item/ammo_box/magazine/internal/cylinder/rev762", "/obj/item/ammo_box/magazine/internal/cylinder", {
	name: "nagant revolver cylinder",
	ammo_type: rt.typePath("/obj/item/ammo_casing/n762"),
	caliber: "n762",
	max_ammo: 7,
});
rt.type(9941, "/obj/item/ammo_box/magazine/internal/cylinder/rus357", "/obj/item/ammo_box/magazine/internal/cylinder", {
	name: "russian revolver cylinder",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a357"),
	caliber: "357",
	max_ammo: 6,
	multiload: 0,
});
rt.type(9943, "/obj/item/ammo_box/magazine/internal/shot/tube", "/obj/item/ammo_box/magazine/internal/shot", {
	name: "dual feed shotgun internal tube",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/rubbershot"),
	max_ammo: 4,
});
rt.type(9944, "/obj/item/ammo_box/magazine/internal/shot/lethal", "/obj/item/ammo_box/magazine/internal/shot", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
});
rt.type(9945, "/obj/item/ammo_box/magazine/internal/shot/com", "/obj/item/ammo_box/magazine/internal/shot", {
	name: "combat shotgun internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
	max_ammo: 6,
});
rt.type(9946, "/obj/item/ammo_box/magazine/internal/shot/com/compact", "/obj/item/ammo_box/magazine/internal/shot/com", {
	name: "compact combat shotgun internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/buckshot"),
	max_ammo: 4,
});
rt.type(9947, "/obj/item/ammo_box/magazine/internal/shot/dual", "/obj/item/ammo_box/magazine/internal/shot", {
	name: "double-barrel shotgun internal magazine",
	max_ammo: 2,
});
rt.type(9948, "/obj/item/ammo_box/magazine/internal/shot/improvised", "/obj/item/ammo_box/magazine/internal/shot", {
	name: "improvised shotgun internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/improvised"),
	max_ammo: 1,
});
rt.type(9949, "/obj/item/ammo_box/magazine/internal/shot/riot", "/obj/item/ammo_box/magazine/internal/shot", {
	name: "riot shotgun internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/rubbershot"),
	max_ammo: 6,
});
rt.type(9950, "/obj/item/ammo_box/magazine/internal/shot/toy", "/obj/item/ammo_box/magazine/internal/shot", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart"),
	caliber: "foam_force",
	max_ammo: 4,
});
rt.type(9951, "/obj/item/ammo_box/magazine/internal/shot/toy/crossbow", "/obj/item/ammo_box/magazine/internal/shot/toy", {
	max_ammo: 5,
});
rt.type(9952, "/obj/item/ammo_box/magazine/internal/grenadelauncher", "/obj/item/ammo_box/magazine/internal", {
	name: "grenade launcher internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a40mm"),
	caliber: "40mm",
	max_ammo: 1,
});
rt.type(9953, "/obj/item/ammo_box/magazine/internal/rocketlauncher", "/obj/item/ammo_box/magazine/internal", {
	name: "grenade launcher internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/a84mm"),
	caliber: "84mm",
	max_ammo: 1,
});
rt.type(9954, "/obj/item/ammo_box/magazine/internal/speargun", "/obj/item/ammo_box/magazine/internal", {
	name: "speargun internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/magspear"),
	caliber: "speargun",
	max_ammo: 1,
});
rt.type(9956, "/obj/item/ammo_box/magazine/internal/boltaction", "/obj/item/ammo_box/magazine/internal", {
	name: "bolt action rifle internal magazine",
	desc: "Oh god, this shouldn't be here",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a762"),
	caliber: "a762",
	max_ammo: 5,
	multiload: 1,
});
rt.type(9957, "/obj/item/ammo_box/magazine/internal/boltaction/enchanted", "/obj/item/ammo_box/magazine/internal/boltaction", {
	max_ammo: 1,
	ammo_type: rt.typePath("/obj/item/ammo_casing/a762/enchanted"),
});
rt.type(9958, "/obj/item/ammo_box/magazine/internal/boltaction/enchanted/arcane_barrage", "/obj/item/ammo_box/magazine/internal/boltaction/enchanted", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/arcane_barrage"),
});
rt.type(9959, "/obj/item/ammo_box/magazine/internal/minigun", "/obj/item/ammo_box/magazine/internal", {
	name: "gatling gun fusion core",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser/gatling"),
	caliber: "gatling",
	max_ammo: 5000,
});
rt.type(9960, "/obj/item/ammo_box/magazine/internal/bow", "/obj/item/ammo_box/magazine/internal", {
	name: "bow internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/arrow"),
	caliber: "arrow",
	max_ammo: 1,
});
