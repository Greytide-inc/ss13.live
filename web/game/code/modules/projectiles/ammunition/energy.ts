// From code/modules/projectiles/ammunition/energy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8685, "/obj/item/ammo_casing/energy/chameleon", "/obj/item/ammo_casing/energy", {
	projectile_vars: null,
	e_cost: 0,
	projectile_type: rt.typePath("/obj/item/projectile/energy/chameleon"),
});

// /obj/item/ammo_casing/energy/chameleon/proc/<init>  (code/modules/projectiles/ammunition/energy.dm:14)
rt.def("/obj/item/ammo_casing/energy/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "projectile_vars", rt.list());
	return f.dot;
});

// /obj/item/ammo_casing/energy/chameleon/proc/ready_proj  (code/modules/projectiles/ammunition/energy.dm:17)  may sleep
rt.def("/obj/item/ammo_casing/energy/chameleon/proc/ready_proj", function* ready_proj(f: Frame) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [V, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "BB"))) {
		yield* g.srcCall(f, "newshot");
	}
	V = null;
	rt.forList(f, 0, rt.sv(f, "projectile_vars"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.index(rt.fv(f, "vars", rt.sv(f, "BB")), live(V)))) {
			rt.setAt(rt.fv(f, "vars", rt.sv(f, "BB")), live(V), rt.index(rt.sv(f, "projectile_vars"), live(V)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(8727, "/obj/item/ammo_casing/energy/gravityrepulse", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "repulse",
	projectile_type: rt.typePath("/obj/item/projectile/gravityrepulse"),
	fire_sound: rt.rsc("sound/weapons/wave.ogg"),
	delay: 50,
});

// /obj/item/ammo_casing/energy/gravityrepulse/proc/New  (code/modules/projectiles/ammunition/energy.dm:217)
rt.def("/obj/item/ammo_casing/energy/gravityrepulse/proc/New", function New(f: Frame, G: Value) {
	rt.setSv(f, "gun", live(G));
	return f.dot;
});

rt.type(8728, "/obj/item/ammo_casing/energy/gravityattract", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "attract",
	projectile_type: rt.typePath("/obj/item/projectile/gravityattract"),
	fire_sound: rt.rsc("sound/weapons/wave.ogg"),
	delay: 50,
});

// /obj/item/ammo_casing/energy/gravityattract/proc/New  (code/modules/projectiles/ammunition/energy.dm:229)
rt.def("/obj/item/ammo_casing/energy/gravityattract/proc/New", function New(f: Frame, G: Value) {
	rt.setSv(f, "gun", live(G));
	return f.dot;
});

rt.type(8729, "/obj/item/ammo_casing/energy/gravitychaos", "/obj/item/ammo_casing/energy", {
	gun: null,
	e_cost: 0,
	select_name: "chaos",
	projectile_type: rt.typePath("/obj/item/projectile/gravitychaos"),
	fire_sound: rt.rsc("sound/weapons/wave.ogg"),
	delay: 50,
});

// /obj/item/ammo_casing/energy/gravitychaos/proc/New  (code/modules/projectiles/ammunition/energy.dm:240)
rt.def("/obj/item/ammo_casing/energy/gravitychaos/proc/New", function New(f: Frame, G: Value) {
	rt.setSv(f, "gun", live(G));
	return f.dot;
});
