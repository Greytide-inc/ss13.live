// Types declared in code/modules/projectiles/guns/ballistic that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(5206, "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/gold", "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle", {
	desc: "A gold plated desert eagle folded over a million times by superior martian gunsmiths. Uses .50 AE ammo.",
	icon_state: "deagleg",
	item_state: "deagleg",
});
rt.type(5207, "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/camo", "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle", {
	desc: "A Deagle brand Deagle for operators operating operationally. Uses .50 AE ammo.",
	icon_state: "deaglecamo",
	item_state: "deagleg",
});
rt.type(5208, "/obj/item/weapon/gun/ballistic/automatic/pistol/m1911", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "１M1911",
	desc: "A classic .45 handgun with a small magazine capacity.",
	icon_state: "m1911",
	w_class: 3,
	can_suppress: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m45"),
});
rt.type(5217, "/obj/item/weapon/gun/ballistic/automatic/c20r/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/c20r", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5218, "/obj/item/weapon/gun/ballistic/automatic/c20r/toy", "/obj/item/weapon/gun/ballistic/automatic/c20r", {
	name: "donksoft SMG",
	desc: "A bullpup two-round burst toy SMG, designated 'C-20r'. Ages 8 and up.",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	can_suppress: 1,
	needs_permit: 0,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/smgm45"),
});
rt.type(5219, "/obj/item/weapon/gun/ballistic/automatic/c20r/toy/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/c20r/toy", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5220, "/obj/item/weapon/gun/ballistic/automatic/proto", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "１NanoTrasen Saber SMG",
	desc: "A prototype three-round burst 9mm submachine gun, designated 'SABR'. Has a threaded barrel for suppressors.",
	icon_state: "saber",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/smgm9mm"),
	pin: null,
});
rt.type(5221, "/obj/item/weapon/gun/ballistic/automatic/proto/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/proto", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5223, "/obj/item/weapon/gun/ballistic/automatic/mini_uzi", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "１Type U3 Uzi",
	desc: "A lightweight, burst-fire submachine gun, for when you really want someone dead. Uses 9mm rounds.",
	icon_state: "mini-uzi",
	origin_tech: "combat=4;materials=2;syndicate=4",
	burst_size: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/uzim9mm"),
});
rt.type(5226, "/obj/item/weapon/gun/ballistic/automatic/tommygun", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "１Thompson SMG",
	desc: "Based on the classic 'Chicago Typewriter'.",
	icon_state: "tommygun",
	item_state: "shotgun",
	w_class: 5,
	slot_flags: 0,
	origin_tech: "combat=5;materials=1;syndicate=3",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	can_suppress: 0,
	burst_size: 4,
	fire_delay: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/tommygunm45"),
});
rt.type(5227, "/obj/item/weapon/gun/ballistic/automatic/ar", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "１NT-ARG 'Boarder'",
	desc: "A robust assault rile used by Nanotrasen fighting forces.",
	icon_state: "arg",
	item_state: "arg",
	slot_flags: 0,
	origin_tech: "combat=6;engineering=4",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m556"),
});
rt.type(5228, "/obj/item/weapon/gun/ballistic/automatic/shotgun", "/obj/item/weapon/gun/ballistic/automatic", {});
rt.type(5230, "/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5232, "/obj/item/weapon/gun/ballistic/automatic/l6_saw/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/l6_saw", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5233, "/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy", "/obj/item/weapon/gun/ballistic/automatic/l6_saw", {
	name: "donksoft LMG",
	desc: "A heavily modified toy light machine gun, designated 'L6 SAW'. Ages 8 and up.",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	can_suppress: 0,
	needs_permit: 0,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/m762"),
});
rt.type(5234, "/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/l6_saw/toy", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5236, "/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/syndicate", "/obj/item/weapon/gun/ballistic/automatic/sniper_rifle", {
	name: "syndicate sniper rifle",
	desc: "An illegally modified .50 cal sniper rifle with supression compatibility. Quickscoping still doesn't work.",
	origin_tech: "combat=7;syndicate=6",
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});
rt.type(5237, "/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/gang", "/obj/item/weapon/gun/ballistic/automatic/sniper_rifle", {
	name: "black market sniper rifle",
	desc: "A long ranged weapon that does significant damage. It is well worn from years of service.",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds/gang"),
});
rt.type(5242, "/obj/item/weapon/gun/ballistic/automatic/toy", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "foam force SMG",
	desc: "A prototype three-round burst toy submachine gun. Ages 8 and up.",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	icon_state: "saber",
	item_state: "gun",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	force: 0,
	throwforce: 0,
	burst_size: 3,
	can_suppress: 1,
	clumsy_check: 0,
	needs_permit: 0,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/smg"),
});
rt.type(5243, "/obj/item/weapon/gun/ballistic/automatic/toy/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/toy", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5246, "/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5247, "/obj/item/weapon/gun/ballistic/automatic/toy/pistol/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/toy/pistol", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5250, "/obj/item/weapon/gun/ballistic/shotgun/lethal", "/obj/item/weapon/gun/ballistic/shotgun", {
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/lethal"),
});
rt.type(5254, "/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/arcane_barrage", "/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted", {
	flags: 16384,
	name: "arcane barrage",
	desc: "Pew Pew Pew",
	fire_sound: rt.rsc("sound/weapons/emitter.ogg"),
	icon_state: "arcane_barrage",
	item_state: "arcane_barrage",
	pin: rt.typePath("/obj/item/device/firing_pin/magic"),
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/boltaction/enchanted/arcane_barrage"),
});
rt.type(5256, "/obj/item/weapon/gun/ballistic/shotgun/automatic/combat", "/obj/item/weapon/gun/ballistic/shotgun/automatic", {
	name: "combat shotgun",
	desc: "A semi automatic shotgun with tactical furniture and a six-shell capacity underneath.",
	icon_state: "cshotgun",
	origin_tech: "combat=6",
	w_class: 5,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/com"),
});
rt.type(5257, "/obj/item/weapon/gun/ballistic/shotgun/automatic/combat/compact", "/obj/item/weapon/gun/ballistic/shotgun/automatic/combat", {
	name: "compact combat shotgun",
	desc: "A compact version of the semi automatic combat shotgun. For close encounters.",
	icon_state: "cshotgunc",
	origin_tech: "combat=4;materials=2",
	w_class: 4,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/com/compact"),
});
rt.type(5260, "/obj/item/weapon/gun/ballistic/shotgun/toy/unrestricted", "/obj/item/weapon/gun/ballistic/shotgun/toy", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5261, "/obj/item/weapon/gun/ballistic/shotgun/toy/crossbow", "/obj/item/weapon/gun/ballistic/shotgun/toy", {
	name: "foam force crossbow",
	desc: "A weapon favored by many overactive children. Ages 8 and up.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "foamcrossbow",
	item_state: "crossbow",
	fire_sound: rt.rsc("sound/items/syringeproj.ogg"),
	slot_flags: 512,
	w_class: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/toy/crossbow"),
});
rt.type(5266, "/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/unrestricted", "/obj/item/weapon/gun/ballistic/revolver/grenadelauncher", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5267, "/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/cyborg", "/obj/item/weapon/gun/ballistic/revolver/grenadelauncher", {
	desc: "A 6-shot grenade launcher.",
	name: "multi grenade launcher",
	icon: rt.rsc("icons/mecha/mecha_equipment.dmi"),
	icon_state: "mecha_grenadelnchr",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder/grenademulti"),
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5269, "/obj/item/weapon/gun/ballistic/revolver/mateba", "/obj/item/weapon/gun/ballistic/revolver", {
	name: "１Unica 6 auto-revolver",
	desc: "A retro high-powered autorevolver typically used by officers of the New Russia military. Uses .357 ammo.",
	icon_state: "mateba",
});
rt.type(5270, "/obj/item/weapon/gun/ballistic/revolver/golden", "/obj/item/weapon/gun/ballistic/revolver", {
	name: "１Golden revolver",
	desc: "This ain't no game, ain't never been no show, And I'll gladly gun down the oldest lady you know. Uses .357 ammo.",
	icon_state: "goldrevolver",
	fire_sound: rt.rsc("sound/weapons/resonator_blast.ogg"),
	recoil: 8,
	pin: rt.typePath("/obj/item/device/firing_pin"),
});
rt.type(5271, "/obj/item/weapon/gun/ballistic/revolver/nagant", "/obj/item/weapon/gun/ballistic/revolver", {
	name: "nagant revolver",
	desc: "An old model of revolver that originated in Russia. Able to be suppressed. Uses 7.62x38mmR ammo.",
	icon_state: "nagant",
	origin_tech: "combat=3",
	can_suppress: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder/rev762"),
});
rt.type(5276, "/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/sawn", "/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised", {
	name: "sawn-off improvised shotgun",
	desc: "A single-shot shotgun, better not miss",
	icon_state: "ishotgun",
	item_state: "gun",
	w_class: 3,
	sawn_state: 1,
	slot_flags: 512,
});
