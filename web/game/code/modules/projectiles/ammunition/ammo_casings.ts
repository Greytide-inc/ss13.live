// From code/modules/projectiles/ammunition/ammo_casings.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8768, "/obj/item/ammo_casing/shotgun", "/obj/item/ammo_casing", {
	caliber: "shotgun",
	name: "shotgun slug",
	desc: "A 12 gauge lead slug.",
	icon_state: "blshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet"),
	materials: null,
});

// /obj/item/ammo_casing/shotgun/proc/<init>  (code/modules/projectiles/ammunition/ammo_casings.dm:179)
rt.def("/obj/item/ammo_casing/shotgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	return f.dot;
});

rt.type(8770, "/obj/item/ammo_casing/shotgun/rubbershot", "/obj/item/ammo_casing/shotgun", {
	pellets: 6,
	variance: 25,
	name: "rubber shot",
	desc: "A shotgun casing filled with densely-packed rubber balls, used to incapacitate crowds from a distance.",
	icon_state: "bshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/rpellet"),
	materials: null,
});

// /obj/item/ammo_casing/shotgun/rubbershot/proc/<init>  (code/modules/projectiles/ammunition/ammo_casings.dm:197)
rt.def("/obj/item/ammo_casing/shotgun/rubbershot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	return f.dot;
});

rt.type(8771, "/obj/item/ammo_casing/shotgun/beanbag", "/obj/item/ammo_casing/shotgun", {
	name: "beanbag slug",
	desc: "A weak beanbag slug for riot control.",
	icon_state: "bshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet"),
	materials: null,
});

// /obj/item/ammo_casing/shotgun/beanbag/proc/<init>  (code/modules/projectiles/ammunition/ammo_casings.dm:205)
rt.def("/obj/item/ammo_casing/shotgun/beanbag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	return f.dot;
});

rt.type(8772, "/obj/item/ammo_casing/shotgun/improvised", "/obj/item/ammo_casing/shotgun", {
	pellets: 10,
	variance: 25,
	name: "improvised shell",
	desc: "An extremely weak shotgun shell with multiple small pellets made out of metal shards.",
	icon_state: "improvshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/pellet/weak"),
	materials: null,
});

// /obj/item/ammo_casing/shotgun/improvised/proc/<init>  (code/modules/projectiles/ammunition/ammo_casings.dm:213)
rt.def("/obj/item/ammo_casing/shotgun/improvised/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	return f.dot;
});

rt.type(8773, "/obj/item/ammo_casing/shotgun/improvised/overload", "/obj/item/ammo_casing/shotgun/improvised", {
	pellets: 4,
	variance: 40,
	name: "overloaded improvised shell",
	desc: "An extremely weak shotgun shell with multiple small pellets made out of metal shards. This one has been packed with even more propellant. It's like playing russian roulette, with a shotgun.",
	icon_state: "improvshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/pellet/overload"),
	materials: null,
});

// /obj/item/ammo_casing/shotgun/improvised/overload/proc/<init>  (code/modules/projectiles/ammunition/ammo_casings.dm:224)
rt.def("/obj/item/ammo_casing/shotgun/improvised/overload/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	return f.dot;
});

rt.type(8774, "/obj/item/ammo_casing/shotgun/stunslug", "/obj/item/ammo_casing/shotgun", {
	name: "taser slug",
	desc: "A stunning taser slug.",
	icon_state: "stunshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/stunshot"),
	materials: null,
});

// /obj/item/ammo_casing/shotgun/stunslug/proc/<init>  (code/modules/projectiles/ammunition/ammo_casings.dm:234)
rt.def("/obj/item/ammo_casing/shotgun/stunslug/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 250]));
	return f.dot;
});

rt.type(8784, "/obj/item/ammo_casing/shotgun/dart", "/obj/item/ammo_casing/shotgun", {
	name: "shotgun dart",
	desc: "A dart for use in shotguns. Can be injected with up to 30 units of any chemical.",
	icon_state: "cshell",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/dart"),
});

// /obj/item/ammo_casing/shotgun/dart/proc/New  (code/modules/projectiles/ammunition/ammo_casings.dm:305)  may sleep
rt.def("/obj/item/ammo_casing/shotgun/dart/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modSrcVar(f, "container_type", 4096, rt.bitOr));
	yield* g.srcCall(f, "create_reagents", 30);
	yield* g.callName(f, rt.sv(f, "reagents"), "set_reacting", [0]);
	return f.dot;
}, true);

rt.type(8785, "/obj/item/ammo_casing/shotgun/dart/bioterror", "/obj/item/ammo_casing/shotgun/dart", {
	desc: "A shotgun dart filled with deadly toxins.",
});

// /obj/item/ammo_casing/shotgun/dart/bioterror/proc/New  (code/modules/projectiles/ammunition/ammo_casings.dm:317)  may sleep
rt.def("/obj/item/ammo_casing/shotgun/dart/bioterror/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["neurotoxin", 6]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["spore", 6]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["mutetoxin", 6]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["coniine", 6]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["sodium_thiopental", 6]);
	return f.dot;
}, true);
