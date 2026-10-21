// Types declared in code/modules/projectiles/ammunition that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(8670, "/obj/item/ammo_casing/caseless/gumball", "/obj/item/ammo_casing/caseless", {
	name: "Gumball",
	desc: "Why are you seeing this?!",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/gumball"),
	click_cooldown_override: 2,
});
rt.type(8671, "/obj/item/ammo_casing/caseless/lollipop", "/obj/item/ammo_casing/caseless", {
	name: "Lollipop",
	desc: "Why are you seeing this?!",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/lollipop"),
	click_cooldown_override: 2,
});
rt.type(8672, "/obj/item/ammo_casing/caseless/laser", "/obj/item/ammo_casing/caseless", {
	name: "laser casing",
	desc: "You shouldn't be seeing this.",
	caliber: "laser",
	icon_state: "s-casing-live",
	projectile_type: rt.typePath("/obj/item/projectile/beam"),
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect/energy"),
});
rt.type(8673, "/obj/item/ammo_casing/caseless/laser/ctf", "/obj/item/ammo_casing/caseless/laser", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/ctf"),
});
rt.type(8674, "/obj/item/ammo_casing/caseless/laser/ctf/red", "/obj/item/ammo_casing/caseless/laser/ctf", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/ctf/red"),
});
rt.type(8675, "/obj/item/ammo_casing/caseless/laser/ctf/blue", "/obj/item/ammo_casing/caseless/laser/ctf", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/ctf/blue"),
});
rt.type(8676, "/obj/item/ammo_casing/caseless/laser/gatling", "/obj/item/ammo_casing/caseless/laser", {
	projectile_type: rt.typePath("/obj/item/projectile/beam/weak"),
	variance: 0.8,
	click_cooldown_override: 1,
});
rt.type(8677, "/obj/item/ammo_casing/caseless/a75", "/obj/item/ammo_casing/caseless", {
	desc: "A .75 bullet casing.",
	caliber: "75",
	icon_state: "s-casing-live",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/gyro"),
});
rt.type(8678, "/obj/item/ammo_casing/caseless/a84mm", "/obj/item/ammo_casing/caseless", {
	desc: "An 84mm anti-armour rocket.",
	caliber: "84mm",
	icon_state: "s-casing-live",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/a84mm"),
});
rt.type(8679, "/obj/item/ammo_casing/caseless/magspear", "/obj/item/ammo_casing/caseless", {
	throw_speed: 3,
	name: "magnetic spear",
	desc: "A reusable spear that is typically loaded into kinetic spearguns.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/magspear"),
	caliber: "speargun",
	icon_state: "magspear",
	throwforce: 15,
});
rt.type(8681, "/obj/item/ammo_casing/caseless/foam_dart/riot", "/obj/item/ammo_casing/caseless/foam_dart", {
	name: "riot foam dart",
	desc: "Whose smart idea was it to use toys as crowd control? Ages 18 and up.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/foam_dart/riot"),
	icon_state: "foamdart_riot",
});
rt.type(8682, "/obj/item/ammo_casing/caseless/arrow", "/obj/item/ammo_casing/caseless", {
	name: "arrow",
	desc: "Stab, stab, stab.",
	icon_state: "arrow",
	force: 10,
	sharpness: 1,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/arrow"),
	caliber: "arrow",
});
rt.type(8769, "/obj/item/ammo_casing/shotgun/buckshot", "/obj/item/ammo_casing/shotgun", {
	pellets: 6,
	variance: 25,
	name: "buckshot shell",
	desc: "A 12 gauge buckshot shell.",
	icon_state: "gshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/pellet"),
});
rt.type(8775, "/obj/item/ammo_casing/shotgun/meteorshot", "/obj/item/ammo_casing/shotgun", {
	name: "meteorshot shell",
	desc: "A shotgun shell rigged with CMC technology, which launches a massive slug when fired.",
	icon_state: "mshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/meteorshot"),
});
rt.type(8776, "/obj/item/ammo_casing/shotgun/breaching", "/obj/item/ammo_casing/shotgun", {
	name: "breaching shell",
	desc: "An economic version of the meteorshot, utilizing similar technologies. Great for busting down doors.",
	icon_state: "mshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/meteorshot/weak"),
});
rt.type(8777, "/obj/item/ammo_casing/shotgun/pulseslug", "/obj/item/ammo_casing/shotgun", {
	name: "pulse slug",
	desc: "A delicate device which can be loaded into a shotgun. The primer acts as a button which triggers the gain medium and fires a powerful energy blast. While the heat and power drain limit it to one use, it can still allow an operator to engage targets that ballistic ammunition would have difficulty with.",
	icon_state: "pshell",
	projectile_type: rt.typePath("/obj/item/projectile/beam/pulse/shot"),
});
rt.type(8778, "/obj/item/ammo_casing/shotgun/incendiary", "/obj/item/ammo_casing/shotgun", {
	name: "incendiary slug",
	desc: "An incendiary-coated shotgun slug.",
	icon_state: "ishell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/incendiary/shell"),
});
rt.type(8779, "/obj/item/ammo_casing/shotgun/incendiary/dragonsbreath", "/obj/item/ammo_casing/shotgun/incendiary", {
	pellets: 4,
	variance: 35,
	name: "dragonsbreath shell",
	desc: "A shotgun shell which fires a spread of incendiary pellets.",
	icon_state: "ishell2",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/incendiary/shell/dragonsbreath"),
});
rt.type(8780, "/obj/item/ammo_casing/shotgun/frag12", "/obj/item/ammo_casing/shotgun", {
	name: "FRAG-12 slug",
	desc: "A high explosive breaching round for a 12 gauge shotgun.",
	icon_state: "heshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/frag12"),
});
rt.type(8781, "/obj/item/ammo_casing/shotgun/ion", "/obj/item/ammo_casing/shotgun", {
	pellets: 4,
	variance: 35,
	name: "ion shell",
	desc: "An advanced shotgun shell which uses a subspace ansible crystal to produce an effect similar to a standard ion rifle. The unique properties of the crystal split the pulse into a spread of individually weaker bolts.",
	icon_state: "ionshell",
	projectile_type: rt.typePath("/obj/item/projectile/ion/weak"),
});
rt.type(8782, "/obj/item/ammo_casing/shotgun/laserslug", "/obj/item/ammo_casing/shotgun", {
	name: "laser slug",
	desc: "An advanced shotgun shell that uses a micro laser to replicate the effects of a laser weapon in a ballistic package.",
	icon_state: "lshell",
	projectile_type: rt.typePath("/obj/item/projectile/beam/laser"),
});
rt.type(8783, "/obj/item/ammo_casing/shotgun/techshell", "/obj/item/ammo_casing/shotgun", {
	projectile_type: null,
	name: "unloaded technological shell",
	desc: "A high-tech shotgun shell which can be loaded with materials to produce unique effects.",
	icon_state: "cshell",
});
